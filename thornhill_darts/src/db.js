'use strict';
// SQLite persistence via Node's built-in `node:sqlite` (Node >= 22.5) — no
// native dependencies to compile.
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS leagues (
  id             INTEGER PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  short_name     TEXT,
  region         TEXT,
  primary_colour TEXT,
  accent_colour  TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- A club is the pub / venue / organisation a team plays for. One club can
-- field several teams (e.g. "Flatt Top A" and "Flatt Top B"), and those teams
-- may play in different divisions.
CREATE TABLE IF NOT EXISTS clubs (
  id        INTEGER PRIMARY KEY,
  league_id INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  UNIQUE (league_id, name)
);

-- A team keeps its identity across seasons; division membership is per season.
CREATE TABLE IF NOT EXISTS teams (
  id        INTEGER PRIMARY KEY,
  league_id INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  club_id   INTEGER NOT NULL REFERENCES clubs(id),
  name      TEXT NOT NULL,
  active    INTEGER NOT NULL DEFAULT 1,
  UNIQUE (league_id, name)
);

CREATE TABLE IF NOT EXISTS seasons (
  id         INTEGER PRIMARY KEY,
  league_id  INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  status     TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed')),
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (league_id, name)
);

CREATE TABLE IF NOT EXISTS divisions (
  id         INTEGER PRIMARY KEY,
  season_id  INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (season_id, name)
);

-- A team plays in at most one division per season.
CREATE TABLE IF NOT EXISTS division_teams (
  season_id   INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  division_id INTEGER NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  team_id     INTEGER NOT NULL REFERENCES teams(id),
  PRIMARY KEY (season_id, team_id)
);

CREATE TABLE IF NOT EXISTS import_batches (
  id          INTEGER PRIMARY KEY,
  league_id   INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  season_id   INTEGER REFERENCES seasons(id) ON DELETE SET NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('historical_standings', 'fixtures', 'seed')),
  filename    TEXT,
  row_count   INTEGER NOT NULL,
  warnings    TEXT,           -- JSON array of strings
  source_note TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Published standings stored verbatim. These are NEVER recalculated and are
-- kept apart from live standings, which are derived from fixtures at read time.
-- NULL means "not yet entered", never zero.
CREATE TABLE IF NOT EXISTS historical_standings (
  id              INTEGER PRIMARY KEY,
  season_id       INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  division_id     INTEGER NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  team_id         INTEGER NOT NULL REFERENCES teams(id),
  position        INTEGER,
  played          INTEGER,
  won             INTEGER,
  lost            INTEGER,
  legs_for        INTEGER,
  legs_against    INTEGER,
  leg_difference  INTEGER,
  points          REAL,
  import_batch_id INTEGER REFERENCES import_batches(id) ON DELETE SET NULL,
  UNIQUE (division_id, team_id)
);

CREATE TABLE IF NOT EXISTS fixtures (
  id              INTEGER PRIMARY KEY,
  season_id       INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  division_id     INTEGER NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  match_date      TEXT,
  home_team_id    INTEGER NOT NULL REFERENCES teams(id),
  away_team_id    INTEGER NOT NULL REFERENCES teams(id),
  home_legs       INTEGER,
  away_legs       INTEGER,
  status          TEXT NOT NULL CHECK (status IN ('scheduled', 'played', 'postponed', 'void')),
  import_batch_id INTEGER REFERENCES import_batches(id) ON DELETE SET NULL,
  CHECK (home_team_id <> away_team_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS fixtures_natural_key
  ON fixtures (season_id, division_id, IFNULL(match_date, ''), home_team_id, away_team_id);

-- League points system. Starts unconfirmed with no values: live tables show
-- no points column until an administrator enters the confirmed rules.
CREATE TABLE IF NOT EXISTS points_systems (
  league_id      INTEGER PRIMARY KEY REFERENCES leagues(id) ON DELETE CASCADE,
  confirmed      INTEGER NOT NULL DEFAULT 0,
  points_win     REAL,
  points_draw    REAL,
  points_loss    REAL,
  points_per_leg REAL,
  notes          TEXT,
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function openDb(file) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON;');
  if (file !== ':memory:') db.exec('PRAGMA journal_mode = WAL;');
  db.exec(SCHEMA);
  return db;
}

// Run fn inside a transaction; roll back on any thrown error.
function tx(db, fn) {
  db.exec('BEGIN');
  try {
    const out = fn();
    db.exec('COMMIT');
    return out;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

module.exports = { openDb, tx };
