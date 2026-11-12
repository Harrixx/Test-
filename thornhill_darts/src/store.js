'use strict';
// Where the league database lives.
//
//   file      A SQLite file on local disk. The normal mode on any host with a
//             persistent disk (`npm start`).
//   redis     For hosts with no persistent disk (Vercel). The SQLite file sits
//             in the function's temp folder and a compressed copy is kept in
//             Redis (Upstash, over its REST API). Each instance checks a
//             version number before serving and reloads when it has moved on;
//             a save only succeeds if nobody else has saved since this
//             instance loaded, so two administrators cannot overwrite each
//             other. The database is small (a seeded league is about 5 KB
//             compressed), so copying it whole on each change is cheap.
//   ephemeral No storage connected: the seeded data is rebuilt whenever the
//             instance restarts and the site is read-only.
const fs = require('node:fs');
const zlib = require('node:zlib');
const { openDb } = require('./db');
const { seed } = require('./seed');

class ConflictError extends Error {
  constructor() {
    super('Someone else saved a change at the same moment, so yours was not saved. Reload to see the latest data, then try again.');
    this.status = 409;
  }
}

// Compare-and-set: store the new copy only if the version is still the one this instance loaded.
const SAVE_IF_UNCHANGED = `
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
if current ~= tonumber(ARGV[1]) then return -1 end
redis.call('SET', KEYS[2], ARGV[2])
return redis.call('INCR', KEYS[1])`;

function upstash(url, token, fetchImpl = fetch) {
  return async (...command) => {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command.map(String)),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(`Storage request failed: ${data.error || `HTTP ${res.status}`}`);
    return data.result;
  };
}

function removeDbFiles(file) {
  for (const f of [file, `${file}-journal`, `${file}-wal`, `${file}-shm`]) fs.rmSync(f, { force: true });
}

function createRedisStore({ url, token, file, prefix = 'darts-league', maxAgeMs = 1500, fetchImpl }) {
  const redis = upstash(url, token, fetchImpl);
  const versionKey = `${prefix}:version`;
  const dbKey = `${prefix}:db`;
  let db = null;
  let version = 0;
  let checkedAt = 0;

  // Returns true if saved, false if another instance saved first.
  async function trySave() {
    const copy = zlib.gzipSync(fs.readFileSync(file)).toString('base64');
    const result = Number(await redis('EVAL', SAVE_IF_UNCHANGED, 2, versionKey, dbKey, version, copy));
    if (result < 0) return false;
    version = result;
    checkedAt = Date.now();
    return true;
  }

  async function load() {
    const [storedVersion, copy] = await redis('MGET', versionKey, dbKey);
    if (db) { try { db.close(); } catch { /* already closed */ } db = null; }
    removeDbFiles(file);
    if (copy) {
      fs.writeFileSync(file, zlib.gunzipSync(Buffer.from(copy, 'base64')));
      db = openDb(file, { wal: false });
      version = Number(storedVersion) || 0;
    } else {
      // First run against empty storage: seed, then publish the seeded copy.
      db = openDb(file, { wal: false });
      seed(db);
      version = 0;
      if (!(await trySave())) return load(); // another instance seeded first — use theirs
    }
    checkedAt = Date.now();
  }

  return {
    kind: 'redis',
    writable: true,
    get db() { return db; },
    // Make sure the local copy is current. `fresh` skips the short cache (used before writes).
    async sync({ fresh = false } = {}) {
      if (!db) return load();
      if (!fresh && Date.now() - checkedAt < maxAgeMs) return;
      const stored = Number(await redis('GET', versionKey)) || 0;
      checkedAt = Date.now();
      if (stored !== version) await load();
    },
    // Publish the local copy after a change. Throws ConflictError (and reloads) if beaten to it.
    async push() {
      let saved;
      try {
        saved = await trySave();
      } catch (e) {
        version = -1; // the local copy now holds an unsaved change: force a reload before it is used again
        const err = new Error('The change could not be saved because storage did not respond. Please try again.');
        err.status = 503;
        err.cause = e;
        throw err;
      }
      if (saved) return;
      await load();
      throw new ConflictError();
    },
  };
}

function createEphemeralStore({ file }) {
  let db = null;
  return {
    kind: 'none',
    writable: false,
    get db() { return db; },
    async sync() {
      if (db) return;
      removeDbFiles(file);
      db = openDb(file, { wal: false });
      seed(db);
    },
    async push() { /* nothing to publish to */ },
  };
}

// Picks the store from the environment. Upstash's Vercel integration sets the KV_* names;
// a database created directly at Upstash uses the UPSTASH_* names.
function storeFromEnv(env = process.env, { file = '/tmp/league.db' } = {}) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return createRedisStore({ url, token, file, prefix: env.STORAGE_PREFIX || 'darts-league' });
  return createEphemeralStore({ file });
}

module.exports = { createRedisStore, createEphemeralStore, storeFromEnv, ConflictError };
