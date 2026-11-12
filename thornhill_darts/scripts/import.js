'use strict';
// Command-line import, same validation as the admin tool.
//
//   node scripts/import.js <standings|fixtures> <file.csv> --season "Name" [--status completed] [--commit] [--create-teams] [--league thornhill]
//
// Without --commit it only previews (validates) the file.
const fs = require('node:fs');
const path = require('node:path');
const { openDb } = require('../src/db');
const { seed } = require('../src/seed');
const importers = require('../src/importers');

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const [kindArg, file] = args;
if (!['standings', 'fixtures'].includes(kindArg) || !file || !flag('--season')) {
  console.error('Usage: node scripts/import.js <standings|fixtures> <file.csv> --season "Season name" [--status completed|active|upcoming] [--commit] [--create-teams] [--league slug]');
  process.exit(2);
}

const db = openDb(process.env.DB_FILE || path.join(__dirname, '..', 'data', 'league.db'));
seed(db);
const slug = flag('--league') || 'thornhill';
const leagueRow = db.prepare('SELECT id FROM leagues WHERE slug = ?').get(slug);
if (!leagueRow) { console.error(`League "${slug}" not found`); process.exit(1); }
const seasonName = flag('--season');
const existing = db.prepare('SELECT id FROM seasons WHERE league_id = ? AND lower(name) = lower(?)').get(leagueRow.id, seasonName);
const input = {
  kind: kindArg === 'fixtures' ? 'fixtures' : 'historical_standings',
  csv: fs.readFileSync(file, 'utf8'),
  filename: path.basename(file),
  createMissingTeams: args.includes('--create-teams'),
  ...(existing ? { seasonId: existing.id } : { newSeason: { name: seasonName, status: flag('--status') || 'completed' } }),
};

const result = importers.preview(db, slug, input);
console.log(`${result.rows.length} rows, divisions: ${result.divisions.join(', ') || '—'}`);
result.warnings.forEach((w) => console.log(`  warning: ${w}`));
result.errors.forEach((e) => console.log(`  ERROR:   ${e}`));
if (!result.ok) process.exit(1);
if (!args.includes('--commit')) { console.log('Preview only. Re-run with --commit to save.'); process.exit(0); }
const done = importers.commit(db, slug, input);
console.log(`Saved import #${done.batchId} (${done.rows} rows).`);
