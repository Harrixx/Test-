'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { openDb } = require('../src/db');
const { seed, FINAL_STANDINGS } = require('../src/seed');
const { inferClubName, listClubs } = require('../src/teams');
const { historicalStandings, liveStandings, setPointsSystem } = require('../src/standings');
const importers = require('../src/importers');
const { createApp } = require('../src/app');

function fresh() {
  const db = openDb(':memory:');
  seed(db);
  const league = db.prepare("SELECT * FROM leagues WHERE slug = 'thornhill'").get();
  const season = db.prepare('SELECT * FROM seasons WHERE league_id = ?').get(league.id);
  return { db, league, season };
}

const HEADER = 'Division,Pos,Team,Played,Won,Lost,Legs For,Legs Against,Leg Difference,Points';

test('seed creates the real Thornhill teams and nothing invented', () => {
  const { db, league, season } = fresh();
  const teams = db.prepare('SELECT name FROM teams WHERE league_id = ? ORDER BY name').all(league.id).map((t) => t.name);
  assert.deepEqual(teams, Object.values(FINAL_STANDINGS).flat().sort());
  assert.equal(teams.length, 13);
  assert.equal(league.name, 'Thornhill Village Darts League');
  assert.equal(season.status, 'completed');
  assert.equal(db.prepare('SELECT COUNT(*) n FROM fixtures').get().n, 0);
  const ps = db.prepare('SELECT * FROM points_systems WHERE league_id = ?').get(league.id);
  assert.equal(ps.confirmed, 0);
  assert.equal(ps.points_win, null);
  assert.equal(seed(db), false, 'seeding is idempotent');
});

test('historical snapshot keeps published order with figures not entered (null, not zero)', () => {
  const { db, season } = fresh();
  const h = historicalStandings(db, season.id);
  assert.equal(h.complete, false);
  assert.deepEqual(h.divisions.map((d) => d.name), ['Division A', 'Division B']);
  assert.deepEqual(h.divisions[0].rows.map((r) => r.team), FINAL_STANDINGS['Division A']);
  assert.deepEqual(h.divisions[1].rows.map((r) => r.team), FINAL_STANDINGS['Division B']);
  for (const r of h.divisions.flatMap((d) => d.rows)) {
    for (const f of ['played', 'won', 'lost', 'legs_for', 'legs_against', 'leg_difference', 'points']) assert.equal(r[f], null);
  }
  assert.equal(liveStandings(db, 1, season.id), null, 'no live table without fixtures');
});

test('A and B teams of the same club are grouped and can sit in different divisions', () => {
  const { db, league } = fresh();
  assert.deepEqual(inferClubName('Flatt Top A'), { club: 'Flatt Top', suffix: 'A' });
  assert.deepEqual(inferClubName('Black Horse'), { club: 'Black Horse', suffix: null });
  const clubs = listClubs(db, league.id);
  const flatt = clubs.find((c) => c.name === 'Flatt Top');
  assert.deepEqual(flatt.teams.map((t) => t.name), ['Flatt Top A', 'Flatt Top B']);
  assert.deepEqual(flatt.teams.map((t) => t.divisions[0].division), ['Division A', 'Division B']);
  assert.equal(clubs.length, 8);
});

test('standings import stores published figures exactly, flagging (not fixing) inconsistencies', () => {
  const { db, season } = fresh();
  // Deliberately inconsistent figures: they must be stored verbatim.
  const csv = `${HEADER}\nDivision A,1,Thornhill Edge A,10,8,2,60,30,+31,16.5\nDivision A,2,Flatt Top A,10,7,3,55,35,20,14\n`;
  const input = { kind: 'historical_standings', csv, seasonId: season.id, filename: 'x.csv' };
  const p = importers.preview(db, 'thornhill', input);
  assert.equal(p.ok, true, p.errors.join('; '));
  assert.ok(p.warnings.some((w) => /leg difference \(31\)/.test(w)));
  importers.commit(db, 'thornhill', input);
  const h = historicalStandings(db, season.id);
  const a = h.divisions.find((d) => d.name === 'Division A');
  assert.deepEqual(a.rows.map((r) => r.team), ['Thornhill Edge A', 'Flatt Top A'], 'Division A replaced by file');
  assert.deepEqual(
    { ...a.rows[0], team_id: undefined, club: undefined },
    { position: 1, team: 'Thornhill Edge A', team_id: undefined, club: undefined, played: 10, won: 8, lost: 2,
      legs_for: 60, legs_against: 30, leg_difference: 31, points: 16.5 }
  );
  assert.equal(h.divisions.find((d) => d.name === 'Division B').rows.length, 7, 'other divisions untouched');
});

test('standings import rejects unknown teams, bad numbers and double division entries', () => {
  const { db, season } = fresh();
  const csv = `${HEADER}\nDivision A,1,Made Up FC,1,1,0,3,0,3,2\nDivision A,2,Flatt Top A,x,1,0,3,0,3,2\nDivision B,1,Flatt Top A,1,1,0,3,0,3,2\n`;
  const p = importers.preview(db, 'thornhill', { kind: 'historical_standings', csv, seasonId: season.id });
  assert.equal(p.ok, false);
  assert.ok(p.errors.some((e) => /Made Up FC/.test(e)));
  assert.ok(p.errors.some((e) => /not a whole number/.test(e)));
  assert.ok(p.errors.some((e) => /both "Division A" and "Division B"/.test(e)));
  assert.throws(() => importers.commit(db, 'thornhill', { kind: 'historical_standings', csv, seasonId: season.id }), /nothing was saved/);
});

test('fixtures produce a live table separate from the historical snapshot; points only once confirmed', () => {
  const { db, league } = fresh();
  const csv = 'Division,Date,Home,Away,Home Legs,Away Legs\n' +
    'Division A,10/09/2026,Flatt Top A,Black Horse,5,4\n' +
    'Division A,2026-09-17,Black Horse,Thornhill Edge A,,\n';
  const input = { kind: 'fixtures', csv, newSeason: { name: 'Next season', status: 'active' } };
  const p = importers.preview(db, 'thornhill', input);
  assert.equal(p.ok, true, p.errors.join('; '));
  assert.equal(p.rows[0].date, '2026-09-10');
  assert.equal(p.rows[1].status, 'scheduled');
  const { seasonId } = importers.commit(db, 'thornhill', input);
  assert.equal(historicalStandings(db, seasonId), null);
  let live = liveStandings(db, league.id, seasonId);
  assert.equal(live.pointsConfirmed, false);
  const top = live.divisions[0].rows[0];
  assert.equal(top.team, 'Flatt Top A');
  assert.deepEqual([top.played, top.won, top.legs_for, top.legs_against, top.points], [1, 1, 5, 4, null]);
  setPointsSystem(db, league.id, { confirmed: true, win: 2, draw: 1, loss: 0 });
  live = liveStandings(db, league.id, seasonId);
  assert.equal(live.divisions[0].rows[0].points, 2);
  // Re-importing the same fixture updates rather than duplicates.
  importers.commit(db, 'thornhill', { ...input, csv: 'Division,Date,Home,Away,Home Legs,Away Legs\nDivision A,10/09/2026,Flatt Top A,Black Horse,3,6\n' });
  assert.equal(db.prepare('SELECT COUNT(*) n FROM fixtures WHERE season_id = ?').get(seasonId).n, 2);
  assert.equal(liveStandings(db, league.id, seasonId).divisions[0].rows[0].team, 'Black Horse');
});

test('bundled Thornhill template validates against the seeded season', () => {
  const { db, season } = fresh();
  const csv = fs.readFileSync(path.join(__dirname, '..', 'templates', 'thornhill-final-standings-2026.csv'), 'utf8');
  const p = importers.preview(db, 'thornhill', { kind: 'historical_standings', csv, seasonId: season.id });
  assert.equal(p.ok, true, p.errors.join('; '));
  assert.equal(p.rows.length, 13);
});

test('HTTP API: public reads, admin writes require the token', async () => {
  const { db, season } = fresh();
  const server = http.createServer(createApp(db, { adminToken: 'secret-token' }));
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const league = await (await fetch(`${base}/api/leagues/thornhill`)).json();
    assert.equal(league.name, 'Thornhill Village Darts League');
    assert.equal(league.seasons.length, 1);
    const st = await (await fetch(`${base}/api/leagues/thornhill/seasons/${season.id}/standings`)).json();
    assert.equal(st.historical.divisions.length, 2);
    assert.equal(st.live, null);
    const body = JSON.stringify({ confirmed: true, win: 2 });
    let r = await fetch(`${base}/api/admin/leagues/thornhill/points-system`, { method: 'PUT', body });
    assert.equal(r.status, 401);
    r = await fetch(`${base}/api/admin/leagues/thornhill/points-system`, { method: 'PUT', body, headers: { authorization: 'Bearer secret-token' } });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).win, 2);
    r = await fetch(`${base}/templates/../src/db.js`);
    assert.equal(r.status, 404);
    r = await fetch(`${base}/templates/fixtures-template.csv`);
    assert.equal(r.status, 200);
  } finally {
    server.close();
  }
});
