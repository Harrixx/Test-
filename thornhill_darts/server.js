'use strict';
const http = require('node:http');
const path = require('node:path');
const crypto = require('node:crypto');
const { openDb } = require('./src/db');
const { seed } = require('./src/seed');
const { createApp } = require('./src/app');

const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'league.db');
const DEFAULT_LEAGUE = process.env.DEFAULT_LEAGUE || 'thornhill';

let adminToken = process.env.ADMIN_TOKEN;
if (!adminToken) {
  adminToken = crypto.randomBytes(18).toString('base64url');
  console.warn('ADMIN_TOKEN is not set. A one-off token was generated for this run:');
  console.warn(`  ${adminToken}`);
  console.warn('Set ADMIN_TOKEN in the environment to keep a stable administrator token.');
}

const db = openDb(DB_FILE);
if (seed(db)) console.log('Seeded Thornhill Village Darts League (initial teams and final standings positions).');

http.createServer(createApp(db, { adminToken, defaultLeague: DEFAULT_LEAGUE })).listen(PORT, () => {
  console.log(`League site:  http://localhost:${PORT}/`);
  console.log(`Admin tool:   http://localhost:${PORT}/admin`);
});
