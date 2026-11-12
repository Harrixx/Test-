'use strict';
// Spreadsheet importers used by the admin tool and the CLI.
//
// Two kinds of upload are supported:
//   historical_standings — a published final table, stored exactly as given.
//   fixtures             — match fixtures / results that drive live standings.
//
// Every import runs in two steps: validate (preview, no writes) and commit.
// Commit re-validates and refuses if there are any errors.
const { tx } = require('./db');
const { findTeam, createTeam, normaliseName } = require('./teams');
const { parseCsv } = require('./csv');

// Header aliases -> canonical keys. Matching ignores case, spaces and punctuation.
const STANDINGS_COLUMNS = {
  division: ['division', 'div', 'league', 'section'],
  position: ['position', 'pos', 'rank', 'place', 'no'],
  team: ['team', 'teamname'],
  played: ['played', 'p', 'pld', 'gp', 'matchesplayed'],
  won: ['won', 'w', 'wins'],
  lost: ['lost', 'l', 'losses'],
  legs_for: ['legsfor', 'lf', 'for', 'f', 'legswon'],
  legs_against: ['legsagainst', 'la', 'against', 'a', 'legslost'],
  leg_difference: ['legdifference', 'legdiff', 'ld', 'diff', 'difference', 'gd', '+/-', '+-'],
  points: ['points', 'pts', 'pt', 'leaguepoints'],
};

const FIXTURE_COLUMNS = {
  division: ['division', 'div', 'league', 'section'],
  date: ['date', 'matchdate', 'played', 'fixturedate', 'week'],
  home: ['home', 'hometeam', 'homeside'],
  away: ['away', 'awayteam', 'awayside'],
  home_legs: ['homelegs', 'homescore', 'hlegs', 'hs', 'homelegswon'],
  away_legs: ['awaylegs', 'awayscore', 'alegs', 'as', 'awaylegswon'],
  status: ['status', 'state'],
};

const REQUIRED = {
  historical_standings: ['division', 'team'],
  fixtures: ['division', 'home', 'away'],
};

function canon(h) {
  const s = String(h ?? '').toLowerCase().trim();
  if (s === '+/-' || s === '+-') return s;
  return s.replace(/[^a-z0-9]/g, '');
}

function mapHeaders(rawHeaders, spec) {
  const map = {};
  const used = new Set();
  for (const raw of rawHeaders) {
    const c = canon(raw);
    for (const [key, aliases] of Object.entries(spec)) {
      if (used.has(key)) continue;
      if (aliases.includes(c)) { map[raw] = key; used.add(key); break; }
    }
  }
  return map;
}

// Integer cell; blank -> null. Accepts "+5", "-3", " 12 ". Rejects decimals.
function parseIntCell(v) {
  if (v === null || v === undefined) return { value: null };
  if (typeof v === 'number') return Number.isInteger(v) ? { value: v } : { error: `"${v}" is not a whole number` };
  const s = String(v).trim().replace(/^\+/, '').replace(/[−–]/g, '-');
  if (s === '' || s === '-' || s === '—') return { value: null };
  if (!/^-?\d+$/.test(s)) return { error: `"${v}" is not a whole number` };
  return { value: Number(s) };
}

// Points may be fractional in some leagues (e.g. half points), so allow decimals.
function parseNumberCell(v) {
  if (v === null || v === undefined) return { value: null };
  if (typeof v === 'number') return Number.isFinite(v) ? { value: v } : { error: `"${v}" is not a number` };
  const s = String(v).trim().replace(/^\+/, '').replace(/[−–]/g, '-');
  if (s === '' || s === '-' || s === '—') return { value: null };
  if (!/^-?\d+(\.\d+)?$/.test(s)) return { error: `"${v}" is not a number` };
  return { value: Number(s) };
}

// Dates: YYYY-MM-DD, ISO timestamps, or UK DD/MM/YYYY (also DD-MM-YY etc).
function parseDateCell(v) {
  if (v === null || v === undefined || String(v).trim() === '') return { value: null };
  const s = String(v).trim();
  // Excel stores dates as day serials (e.g. 46275); .xlsx uploads arrive that way.
  if (/^\d{5}(\.\d+)?$/.test(s)) {
    const dt = new Date(Date.UTC(1899, 11, 30) + Math.floor(Number(s)) * 86400000);
    return { value: dt.toISOString().slice(0, 10) };
  }
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return validDate(+m[1], +m[2], +m[3], v);
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/);
  if (m) {
    const y = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    return validDate(y, +m[2], +m[1], v);
  }
  return { error: `"${v}" is not a recognised date (use YYYY-MM-DD or DD/MM/YYYY)` };
}

function validDate(y, mo, d, raw) {
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return { error: `"${raw}" is not a valid date` };
  }
  return { value: dt.toISOString().slice(0, 10) };
}

function getLeague(db, slug) {
  return db.prepare('SELECT * FROM leagues WHERE slug = ?').get(slug);
}

function rowsFromInput(input) {
  if (Array.isArray(input.rows)) return input.rows;
  if (typeof input.csv === 'string') return parseCsv(input.csv);
  throw new Error('Provide either "rows" (array of objects) or "csv" (text)');
}

// Resolve the target season: an existing season id, or a new season to create.
function resolveSeason(db, league, input, errors) {
  if (input.seasonId) {
    const s = db.prepare('SELECT * FROM seasons WHERE id = ? AND league_id = ?').get(input.seasonId, league.id);
    if (!s) errors.push(`Season ${input.seasonId} not found in this league`);
    return { season: s || null, create: null };
  }
  const ns = input.newSeason;
  if (ns && normaliseName(ns.name)) {
    const name = normaliseName(ns.name);
    const status = ns.status || 'completed';
    if (!['upcoming', 'active', 'completed'].includes(status)) errors.push(`Invalid season status "${status}"`);
    const existing = db.prepare('SELECT * FROM seasons WHERE league_id = ? AND lower(name) = lower(?)').get(league.id, name);
    if (existing) return { season: existing, create: null };
    return { season: null, create: { name, status, notes: ns.notes || null } };
  }
  errors.push('Choose a season, or give a name for a new season');
  return { season: null, create: null };
}

function analyse(db, slug, input) {
  const kind = input.kind;
  if (!['historical_standings', 'fixtures'].includes(kind)) throw new Error(`Unknown import kind "${kind}"`);
  const league = getLeague(db, slug);
  if (!league) throw new Error(`League "${slug}" not found`);

  const errors = [];
  const warnings = [];
  const rawRows = rowsFromInput(input);
  const spec = kind === 'fixtures' ? FIXTURE_COLUMNS : STANDINGS_COLUMNS;
  const headers = [...new Set(rawRows.flatMap((r) => Object.keys(r)))];
  const headerMap = mapHeaders(headers, spec);
  const mapped = Object.values(headerMap);
  for (const req of REQUIRED[kind]) {
    if (!mapped.includes(req)) errors.push(`Missing required column: ${req}`);
  }
  const ignored = headers.filter((h) => !(h in headerMap) && String(h).trim() !== '' && !/^__EMPTY/.test(h));
  if (ignored.length) warnings.push(`Ignored columns: ${ignored.join(', ')}`);

  const { season, create } = resolveSeason(db, league, input, errors);
  const createMissingTeams = !!input.createMissingTeams;
  const newTeams = new Set();

  const resolveTeam = (name, line) => {
    const n = normaliseName(name);
    if (!n) { errors.push(`Row ${line}: team name is blank`); return null; }
    const t = findTeam(db, league.id, n);
    if (t) return { id: t.id, name: t.name };
    if (createMissingTeams) { newTeams.add(n); return { id: null, name: n }; }
    errors.push(`Row ${line}: team "${n}" is not in the database (add it under Teams, or tick "create missing teams")`);
    return null;
  };

  // Existing division memberships for the target season (team name -> division name).
  const existingMembership = new Map();
  if (season) {
    for (const r of db
      .prepare(
        `SELECT lower(t.name) AS team, d.name AS division FROM division_teams dt
           JOIN teams t ON t.id = dt.team_id JOIN divisions d ON d.id = dt.division_id
          WHERE dt.season_id = ?`
      )
      .all(season.id)) existingMembership.set(r.team, r.division);
  }

  const out = [];
  const seenTeamDivision = new Map();
  const checkMembership = (team, division, line) => {
    if (!team) return;
    const key = team.name.toLowerCase();
    const prev = seenTeamDivision.get(key);
    if (prev && prev.toLowerCase() !== division.toLowerCase()) {
      errors.push(`Row ${line}: "${team.name}" appears in both "${prev}" and "${division}" — a team can only be in one division per season`);
    }
    seenTeamDivision.set(key, division);
  };

  rawRows.forEach((raw, i) => {
    const line = i + 2; // header is line 1
    const r = {};
    for (const [h, key] of Object.entries(headerMap)) r[key] = raw[h];
    if (Object.values(r).every((v) => v === undefined || v === null || String(v).trim() === '')) return;
    const division = normaliseName(r.division);
    if (!division) errors.push(`Row ${line}: division is blank`);

    if (kind === 'historical_standings') {
      const team = resolveTeam(r.team, line);
      const rec = { line, division, team: team?.name ?? normaliseName(r.team), teamId: team?.id ?? null };
      for (const f of ['position', 'played', 'won', 'lost', 'legs_for', 'legs_against', 'leg_difference']) {
        const p = parseIntCell(r[f]);
        if (p.error) errors.push(`Row ${line} ${f.replace('_', ' ')}: ${p.error}`);
        rec[f] = p.value ?? null;
        if (f !== 'leg_difference' && rec[f] !== null && rec[f] < 0) errors.push(`Row ${line} ${f.replace('_', ' ')}: cannot be negative`);
      }
      const pts = parseNumberCell(r.points);
      if (pts.error) errors.push(`Row ${line} points: ${pts.error}`);
      rec.points = pts.value ?? null;

      // Consistency checks are warnings only: the published figures are kept exactly as given.
      if (rec.played !== null && rec.won !== null && rec.lost !== null && rec.won + rec.lost !== rec.played) {
        warnings.push(`Row ${line} (${rec.team}): won + lost (${rec.won + rec.lost}) ≠ played (${rec.played}) — kept as published`);
      }
      if (rec.legs_for !== null && rec.legs_against !== null && rec.leg_difference !== null &&
          rec.legs_for - rec.legs_against !== rec.leg_difference) {
        warnings.push(`Row ${line} (${rec.team}): legs for − against (${rec.legs_for - rec.legs_against}) ≠ leg difference (${rec.leg_difference}) — kept as published`);
      }
      const blanks = ['played', 'won', 'lost', 'legs_for', 'legs_against', 'leg_difference', 'points'].filter((f) => rec[f] === null);
      if (blanks.length) warnings.push(`Row ${line} (${rec.team}): no value for ${blanks.join(', ').replace(/_/g, ' ')} — will show as "not entered"`);
      checkMembership(team, division, line);
      out.push(rec);
    } else {
      const home = resolveTeam(r.home, line);
      const away = resolveTeam(r.away, line);
      if (home && away && home.name.toLowerCase() === away.name.toLowerCase()) errors.push(`Row ${line}: a team cannot play itself`);
      const date = parseDateCell(r.date);
      if (date.error) errors.push(`Row ${line} date: ${date.error}`);
      const hl = parseIntCell(r.home_legs);
      const al = parseIntCell(r.away_legs);
      if (hl.error) errors.push(`Row ${line} home legs: ${hl.error}`);
      if (al.error) errors.push(`Row ${line} away legs: ${al.error}`);
      if ((hl.value ?? 0) < 0 || (al.value ?? 0) < 0) errors.push(`Row ${line}: legs cannot be negative`);
      let status = normaliseName(r.status).toLowerCase();
      const hasScore = hl.value !== null && hl.value !== undefined && al.value !== null && al.value !== undefined;
      if (!status) status = hasScore ? 'played' : 'scheduled';
      if (!['scheduled', 'played', 'postponed', 'void'].includes(status)) errors.push(`Row ${line}: unknown status "${r.status}"`);
      if (status === 'played' && !hasScore) errors.push(`Row ${line}: status is "played" but legs are missing`);
      if ((hl.value === null) !== (al.value === null)) errors.push(`Row ${line}: give both home and away legs, or neither`);
      checkMembership(home, division, line);
      checkMembership(away, division, line);
      out.push({ line, division, date: date.value ?? null, home: home?.name ?? normaliseName(r.home), homeId: home?.id ?? null,
        away: away?.name ?? normaliseName(r.away), awayId: away?.id ?? null, home_legs: hl.value ?? null, away_legs: al.value ?? null, status });
    }
  });

  if (!out.length && !errors.length) errors.push('The file has no data rows');

  // Conflicts with divisions already recorded for this season.
  for (const [team, division] of seenTeamDivision) {
    const prev = existingMembership.get(team);
    if (prev && prev.toLowerCase() !== division.toLowerCase()) {
      // For a standings import this division is about to be replaced only if
      // prev is also in the file; otherwise it is a genuine conflict.
      const replaced = kind === 'historical_standings' && [...seenTeamDivision.values()].some((d) => d.toLowerCase() === prev.toLowerCase());
      if (!replaced) errors.push(`"${team}" is already in "${prev}" for this season, so cannot also be in "${division}"`);
    }
  }

  if (kind === 'historical_standings') {
    const byDiv = new Map();
    for (const r of out) {
      if (r.position === null) continue;
      const k = `${r.division}|${r.position}`;
      if (byDiv.has(k)) warnings.push(`${r.division}: position ${r.position} is shared by ${byDiv.get(k)} and ${r.team}`);
      else byDiv.set(k, r.team);
    }
    if (season) {
      const existing = db.prepare('SELECT COUNT(*) AS n FROM historical_standings WHERE season_id = ?').get(season.id).n;
      const divs = [...new Set(out.map((r) => r.division))];
      if (existing) warnings.push(`This replaces the stored historical standings for: ${divs.join(', ')} in "${season.name}"`);
    }
  }
  if (newTeams.size) warnings.push(`New teams will be created: ${[...newTeams].join(', ')}`);

  const divisions = [...new Set(out.map((r) => r.division))].filter(Boolean);
  return {
    kind, league, season, createSeason: create, rows: out, divisions, errors, warnings,
    columns: headerMap, createMissingTeams,
  };
}

function preview(db, slug, input) {
  const a = analyse(db, slug, input);
  return {
    ok: a.errors.length === 0,
    kind: a.kind,
    season: a.season ? { id: a.season.id, name: a.season.name, status: a.season.status } : null,
    createSeason: a.createSeason,
    divisions: a.divisions,
    columns: a.columns,
    rows: a.rows,
    errors: a.errors,
    warnings: a.warnings,
  };
}

function ensureDivision(db, seasonId, name) {
  const d = db.prepare('SELECT * FROM divisions WHERE season_id = ? AND lower(name) = lower(?)').get(seasonId, name);
  if (d) return d;
  const order = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM divisions WHERE season_id = ?').get(seasonId).n;
  const { lastInsertRowid } = db.prepare('INSERT INTO divisions (season_id, name, sort_order) VALUES (?, ?, ?)').run(seasonId, name, order);
  return db.prepare('SELECT * FROM divisions WHERE id = ?').get(lastInsertRowid);
}

function commit(db, slug, input) {
  const a = analyse(db, slug, input);
  if (a.errors.length) {
    const err = new Error('Import has errors; nothing was saved');
    err.details = { errors: a.errors, warnings: a.warnings };
    throw err;
  }
  return tx(db, () => {
    let season = a.season;
    if (!season) {
      const { lastInsertRowid } = db
        .prepare('INSERT INTO seasons (league_id, name, status, notes) VALUES (?, ?, ?, ?)')
        .run(a.league.id, a.createSeason.name, a.createSeason.status, a.createSeason.notes);
      season = db.prepare('SELECT * FROM seasons WHERE id = ?').get(lastInsertRowid);
    }
    const teamId = (id, name) => id ?? (findTeam(db, a.league.id, name) || createTeam(db, a.league.id, name)).id;
    const { lastInsertRowid: batchId } = db
      .prepare('INSERT INTO import_batches (league_id, season_id, kind, filename, row_count, warnings, source_note) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(a.league.id, season.id, a.kind, input.filename || null, a.rows.length, JSON.stringify(a.warnings), input.sourceNote || null);

    const setMembership = (divisionId, tid) => {
      db.prepare(
        `INSERT INTO division_teams (season_id, division_id, team_id) VALUES (?, ?, ?)
         ON CONFLICT (season_id, team_id) DO UPDATE SET division_id = excluded.division_id`
      ).run(season.id, divisionId, tid);
    };

    if (a.kind === 'historical_standings') {
      for (const divName of a.divisions) {
        const div = ensureDivision(db, season.id, divName);
        // Replace this division's snapshot (and its membership) wholesale.
        db.prepare('DELETE FROM historical_standings WHERE division_id = ?').run(div.id);
        db.prepare('DELETE FROM division_teams WHERE division_id = ?').run(div.id);
        const ins = db.prepare(
          `INSERT INTO historical_standings
             (season_id, division_id, team_id, position, played, won, lost, legs_for, legs_against, leg_difference, points, import_batch_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        for (const r of a.rows.filter((x) => x.division.toLowerCase() === divName.toLowerCase())) {
          const tid = teamId(r.teamId, r.team);
          setMembership(div.id, tid);
          ins.run(season.id, div.id, tid, r.position, r.played, r.won, r.lost, r.legs_for, r.legs_against, r.leg_difference, r.points, batchId);
        }
      }
    } else {
      const upsert = db.prepare(
        `INSERT INTO fixtures (season_id, division_id, match_date, home_team_id, away_team_id, home_legs, away_legs, status, import_batch_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (season_id, division_id, IFNULL(match_date, ''), home_team_id, away_team_id)
         DO UPDATE SET home_legs = excluded.home_legs, away_legs = excluded.away_legs,
                       status = excluded.status, import_batch_id = excluded.import_batch_id`
      );
      for (const r of a.rows) {
        const div = ensureDivision(db, season.id, r.division);
        const h = teamId(r.homeId, r.home);
        const w = teamId(r.awayId, r.away);
        setMembership(div.id, h);
        setMembership(div.id, w);
        upsert.run(season.id, div.id, r.date, h, w, r.home_legs, r.away_legs, r.status, batchId);
      }
    }
    return { batchId: Number(batchId), seasonId: season.id, rows: a.rows.length, warnings: a.warnings };
  });
}

module.exports = { preview, commit, parseIntCell, parseDateCell, mapHeaders, STANDINGS_COLUMNS, FIXTURE_COLUMNS };
