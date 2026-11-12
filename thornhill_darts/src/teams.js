'use strict';

// "Flatt Top A" -> { club: "Flatt Top", suffix: "A" }; "Black Horse" -> { club: "Black Horse", suffix: null }.
// This is only the default grouping applied when a team is first created;
// administrators can move a team to a different club afterwards.
function inferClubName(teamName) {
  const name = String(teamName).trim().replace(/\s+/g, ' ');
  const m = name.match(/^(.+?)\s+([A-Z])$/);
  return m ? { club: m[1], suffix: m[2] } : { club: name, suffix: null };
}

function normaliseName(s) {
  return String(s ?? '').trim().replace(/\s+/g, ' ');
}

function findTeam(db, leagueId, name) {
  return db
    .prepare('SELECT * FROM teams WHERE league_id = ? AND lower(name) = lower(?)')
    .get(leagueId, normaliseName(name));
}

function ensureClub(db, leagueId, clubName) {
  const name = normaliseName(clubName);
  const found = db.prepare('SELECT * FROM clubs WHERE league_id = ? AND lower(name) = lower(?)').get(leagueId, name);
  if (found) return found;
  const { lastInsertRowid } = db.prepare('INSERT INTO clubs (league_id, name) VALUES (?, ?)').run(leagueId, name);
  return db.prepare('SELECT * FROM clubs WHERE id = ?').get(lastInsertRowid);
}

function createTeam(db, leagueId, name, clubName) {
  const teamName = normaliseName(name);
  if (!teamName) throw new Error('Team name is required');
  if (findTeam(db, leagueId, teamName)) throw new Error(`Team "${teamName}" already exists`);
  const club = ensureClub(db, leagueId, clubName ? clubName : inferClubName(teamName).club);
  const { lastInsertRowid } = db
    .prepare('INSERT INTO teams (league_id, club_id, name) VALUES (?, ?, ?)')
    .run(leagueId, club.id, teamName);
  return db.prepare('SELECT * FROM teams WHERE id = ?').get(lastInsertRowid);
}

function updateTeam(db, leagueId, teamId, { name, club, active }) {
  const team = db.prepare('SELECT * FROM teams WHERE id = ? AND league_id = ?').get(teamId, leagueId);
  if (!team) throw new Error('Team not found');
  if (name !== undefined) {
    const n = normaliseName(name);
    if (!n) throw new Error('Team name is required');
    const clash = findTeam(db, leagueId, n);
    if (clash && clash.id !== team.id) throw new Error(`Team "${n}" already exists`);
    db.prepare('UPDATE teams SET name = ? WHERE id = ?').run(n, team.id);
  }
  if (club !== undefined) {
    const c = ensureClub(db, leagueId, club);
    db.prepare('UPDATE teams SET club_id = ? WHERE id = ?').run(c.id, team.id);
    // Tidy up clubs left with no teams.
    db.prepare('DELETE FROM clubs WHERE league_id = ? AND id NOT IN (SELECT club_id FROM teams)').run(leagueId);
  }
  if (active !== undefined) db.prepare('UPDATE teams SET active = ? WHERE id = ?').run(active ? 1 : 0, team.id);
  return db.prepare('SELECT * FROM teams WHERE id = ?').get(team.id);
}

// Teams grouped by club, with the division each team played in per season.
function listClubs(db, leagueId) {
  const clubs = db.prepare('SELECT id, name FROM clubs WHERE league_id = ? ORDER BY name').all(leagueId);
  const teams = db.prepare('SELECT id, club_id, name, active FROM teams WHERE league_id = ? ORDER BY name').all(leagueId);
  const memberships = db
    .prepare(
      `SELECT dt.team_id, s.id AS season_id, s.name AS season, d.name AS division
         FROM division_teams dt
         JOIN seasons s ON s.id = dt.season_id
         JOIN divisions d ON d.id = dt.division_id
        WHERE s.league_id = ?
        ORDER BY s.created_at DESC, s.id DESC`
    )
    .all(leagueId);
  return clubs.map((c) => ({
    ...c,
    teams: teams
      .filter((t) => t.club_id === c.id)
      .map((t) => ({
        id: t.id,
        name: t.name,
        active: !!t.active,
        divisions: memberships.filter((m) => m.team_id === t.id).map(({ team_id, ...m }) => m),
      })),
  }));
}

module.exports = { inferClubName, normaliseName, findTeam, ensureClub, createTeam, updateTeam, listClubs };
