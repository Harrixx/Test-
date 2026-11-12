'use strict';
// Two deliberately separate views of a season's table:
//   historical — the published snapshot, returned verbatim from historical_standings.
//   live       — calculated on the fly from played fixtures and the league's
//                points system. Never written back to historical_standings.

function getPointsSystem(db, leagueId) {
  const row = db.prepare('SELECT * FROM points_systems WHERE league_id = ?').get(leagueId);
  return row
    ? { confirmed: !!row.confirmed, win: row.points_win, draw: row.points_draw, loss: row.points_loss,
        perLeg: row.points_per_leg, notes: row.notes, updatedAt: row.updated_at }
    : { confirmed: false, win: null, draw: null, loss: null, perLeg: null, notes: null, updatedAt: null };
}

function setPointsSystem(db, leagueId, { confirmed, win, draw, loss, perLeg, notes }) {
  const num = (v, label) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isFinite(n)) throw new Error(`${label} must be a number`);
    return n;
  };
  const vals = { win: num(win, 'Points for a win'), draw: num(draw, 'Points for a draw'),
    loss: num(loss, 'Points for a loss'), perLeg: num(perLeg, 'Points per leg won') };
  if (confirmed && vals.win === null && vals.perLeg === null) {
    throw new Error('A confirmed points system needs at least points for a win or points per leg');
  }
  db.prepare(
    `INSERT INTO points_systems (league_id, confirmed, points_win, points_draw, points_loss, points_per_leg, notes, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT (league_id) DO UPDATE SET confirmed = excluded.confirmed, points_win = excluded.points_win,
       points_draw = excluded.points_draw, points_loss = excluded.points_loss,
       points_per_leg = excluded.points_per_leg, notes = excluded.notes, updated_at = excluded.updated_at`
  ).run(leagueId, confirmed ? 1 : 0, vals.win, vals.draw, vals.loss, vals.perLeg, notes || null);
  return getPointsSystem(db, leagueId);
}

function divisionsFor(db, seasonId) {
  return db.prepare('SELECT id, name, sort_order FROM divisions WHERE season_id = ? ORDER BY sort_order, name').all(seasonId);
}

function historicalStandings(db, seasonId) {
  const rows = db
    .prepare(
      `SELECT h.division_id, h.position, t.id AS team_id, t.name AS team, c.name AS club,
              h.played, h.won, h.lost, h.legs_for, h.legs_against, h.leg_difference, h.points
         FROM historical_standings h
         JOIN teams t ON t.id = h.team_id
         JOIN clubs c ON c.id = t.club_id
        WHERE h.season_id = ?
        ORDER BY h.position IS NULL, h.position, t.name`
    )
    .all(seasonId);
  if (!rows.length) return null;
  const batch = db
    .prepare(
      `SELECT b.id, b.kind, b.filename, b.source_note, b.created_at FROM import_batches b
        WHERE b.id IN (SELECT import_batch_id FROM historical_standings WHERE season_id = ?)
        ORDER BY b.created_at DESC, b.id DESC LIMIT 1`
    )
    .get(seasonId);
  const fields = ['played', 'won', 'lost', 'legs_for', 'legs_against', 'leg_difference', 'points'];
  return {
    source: batch || null,
    complete: rows.every((r) => fields.every((f) => r[f] !== null)),
    divisions: divisionsFor(db, seasonId)
      .map((d) => ({ id: d.id, name: d.name, rows: rows.filter((r) => r.division_id === d.id).map(({ division_id, ...r }) => r) }))
      .filter((d) => d.rows.length),
  };
}

function computeLive(teams, fixtures, points) {
  const table = new Map(teams.map((t) => [t.id, {
    team_id: t.id, team: t.name, club: t.club, played: 0, won: 0, drawn: 0, lost: 0, legs_for: 0, legs_against: 0,
  }]));
  for (const f of fixtures) {
    const h = table.get(f.home_team_id);
    const a = table.get(f.away_team_id);
    if (!h || !a) continue;
    h.played++; a.played++;
    h.legs_for += f.home_legs; h.legs_against += f.away_legs;
    a.legs_for += f.away_legs; a.legs_against += f.home_legs;
    if (f.home_legs > f.away_legs) { h.won++; a.lost++; }
    else if (f.home_legs < f.away_legs) { a.won++; h.lost++; }
    else { h.drawn++; a.drawn++; }
  }
  const rows = [...table.values()].map((r) => {
    r.leg_difference = r.legs_for - r.legs_against;
    r.points = points.confirmed
      ? r.won * (points.win ?? 0) + r.drawn * (points.draw ?? 0) + r.lost * (points.loss ?? 0) + r.legs_for * (points.perLeg ?? 0)
      : null;
    return r;
  });
  // Ordering: points (when confirmed) then wins, leg difference, legs for, name.
  // The league's own tie-break rules are not yet confirmed, so treat this as provisional.
  rows.sort((x, y) =>
    (points.confirmed ? y.points - x.points : 0) || y.won - x.won || y.leg_difference - x.leg_difference ||
    y.legs_for - x.legs_for || x.team.localeCompare(y.team));
  rows.forEach((r, i) => { r.position = i + 1; });
  return rows;
}

function liveStandings(db, leagueId, seasonId) {
  const fixtures = db.prepare("SELECT * FROM fixtures WHERE season_id = ? AND status = 'played'").all(seasonId);
  const total = db.prepare('SELECT COUNT(*) AS n FROM fixtures WHERE season_id = ?').get(seasonId).n;
  if (!total) return null; // no underlying fixture data — no live table
  const points = getPointsSystem(db, leagueId);
  const members = db
    .prepare(
      `SELECT dt.division_id, t.id, t.name, c.name AS club FROM division_teams dt
         JOIN teams t ON t.id = dt.team_id JOIN clubs c ON c.id = t.club_id WHERE dt.season_id = ?`
    )
    .all(seasonId);
  return {
    pointsConfirmed: points.confirmed,
    playedFixtures: fixtures.length,
    totalFixtures: total,
    divisions: divisionsFor(db, seasonId)
      .map((d) => ({
        id: d.id, name: d.name,
        rows: computeLive(members.filter((m) => m.division_id === d.id), fixtures.filter((f) => f.division_id === d.id), points),
      }))
      .filter((d) => d.rows.length),
  };
}

module.exports = { getPointsSystem, setPointsSystem, historicalStandings, liveStandings, computeLive };
