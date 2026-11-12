'use strict';
// Initial deployment data: Thornhill Village Darts League, West Yorkshire.
//
// The final positions below are the published standings following
// 9 September 2026, as supplied by the league. The published figures (played,
// won, lost, legs for/against, leg difference, points) were NOT supplied with
// them, so they are stored as NULL ("not entered") — never guessed or derived.
// Enter them with the admin import tool (Admin -> Import), using
// public/templates/thornhill-final-standings-2026.csv, which is pre-filled with
// these teams in this order.
//
// No fixtures, results, players or scoring rules are seeded.
const { tx } = require('./db');
const { createTeam, findTeam } = require('./teams');

const LEAGUE = {
  slug: 'thornhill',
  name: 'Thornhill Village Darts League',
  short_name: 'TVDL',
  region: 'Thornhill, West Yorkshire, England',
  primary_colour: '#14532d',
  accent_colour: '#b91c1c',
};

const SEASON = {
  name: 'Season ending September 2026',
  status: 'completed',
  notes: 'Final league standings published following 9 September 2026.',
};

const FINAL_STANDINGS = {
  'Division A': ['Thornhill Edge A', 'Flatt Top A', 'Black Horse', 'Overthorpe A', 'Cricket Club A', 'Trojans A'],
  'Division B': ['Flatt Top B', 'Cricket Club B', 'Overthorpe B', 'Saville Arms', 'Trojans B', 'Thornhill Edge B', 'Scarborough B'],
};

function seed(db) {
  if (db.prepare('SELECT 1 FROM leagues WHERE slug = ?').get(LEAGUE.slug)) return false;
  tx(db, () => {
    const { lastInsertRowid: leagueId } = db
      .prepare('INSERT INTO leagues (slug, name, short_name, region, primary_colour, accent_colour) VALUES (?, ?, ?, ?, ?, ?)')
      .run(LEAGUE.slug, LEAGUE.name, LEAGUE.short_name, LEAGUE.region, LEAGUE.primary_colour, LEAGUE.accent_colour);
    // Points system starts unconfirmed with no values.
    db.prepare('INSERT INTO points_systems (league_id, confirmed) VALUES (?, 0)').run(leagueId);

    const { lastInsertRowid: seasonId } = db
      .prepare('INSERT INTO seasons (league_id, name, status, notes) VALUES (?, ?, ?, ?)')
      .run(leagueId, SEASON.name, SEASON.status, SEASON.notes);
    const rowCount = Object.values(FINAL_STANDINGS).flat().length;
    const { lastInsertRowid: batchId } = db
      .prepare('INSERT INTO import_batches (league_id, season_id, kind, filename, row_count, warnings, source_note) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(leagueId, seasonId, 'seed', null, rowCount,
        JSON.stringify(['Final positions only: published figures not yet entered']),
        'Final league standings published following 9 September 2026 (positions supplied by the league)');

    let order = 0;
    for (const [divisionName, teams] of Object.entries(FINAL_STANDINGS)) {
      const { lastInsertRowid: divisionId } = db
        .prepare('INSERT INTO divisions (season_id, name, sort_order) VALUES (?, ?, ?)')
        .run(seasonId, divisionName, ++order);
      teams.forEach((name, i) => {
        const team = findTeam(db, leagueId, name) || createTeam(db, leagueId, name);
        db.prepare('INSERT INTO division_teams (season_id, division_id, team_id) VALUES (?, ?, ?)').run(seasonId, divisionId, team.id);
        db.prepare(
          'INSERT INTO historical_standings (season_id, division_id, team_id, position, import_batch_id) VALUES (?, ?, ?, ?, ?)'
        ).run(seasonId, divisionId, team.id, i + 1, batchId);
      });
    }
  });
  return true;
}

module.exports = { seed, LEAGUE, SEASON, FINAL_STANDINGS };
