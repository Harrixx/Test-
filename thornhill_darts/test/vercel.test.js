'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { createRedisStore, createEphemeralStore } = require('../src/store');
const { createVercelHandler } = require('../src/vercel');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'darts-store-'));
const dbFile = (name) => path.join(tmp, `${name}.db`);

// In-memory stand-in for the Upstash Redis REST API: POST a JSON command array, get { result }.
// EVAL implements the one script the store uses (save only if the version is unchanged).
function fakeUpstash() {
  const data = new Map();
  const state = { down: false, calls: [] };
  const fetchImpl = async (url, init) => {
    if (state.down) throw new Error('network down');
    assert.equal(init.headers.Authorization, 'Bearer test-token');
    const [cmd, ...args] = JSON.parse(init.body);
    state.calls.push(cmd);
    let result;
    if (cmd === 'GET') result = data.get(args[0]) ?? null;
    else if (cmd === 'MGET') result = args.map((k) => data.get(k) ?? null);
    else if (cmd === 'EVAL') {
      const [, numKeys, versionKey, dbKey, expected, copy] = args;
      assert.equal(numKeys, '2');
      const current = Number(data.get(versionKey) ?? 0);
      if (current !== Number(expected)) result = -1;
      else { data.set(dbKey, copy); data.set(versionKey, String(current + 1)); result = current + 1; }
    } else return { ok: false, status: 400, json: async () => ({ error: `ERR unknown command ${cmd}` }) };
    return { ok: true, status: 200, json: async () => ({ result }) };
  };
  return { data, state, fetchImpl };
}

const redisStore = (fake, name) =>
  createRedisStore({ url: 'https://fake.upstash.test', token: 'test-token', file: dbFile(name), fetchImpl: fake.fetchImpl, maxAgeMs: 0 });

async function serve(handler) {
  const server = http.createServer(handler);
  await new Promise((r) => server.listen(0, r));
  return { base: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}
const auth = { authorization: 'Bearer admin-secret', 'content-type': 'application/json' };

test('redis store: first instance seeds and publishes; a second instance loads the same data', async () => {
  const fake = fakeUpstash();
  const a = redisStore(fake, 'a1');
  await a.sync();
  assert.equal(fake.data.get('darts-league:version'), '1');
  assert.equal(a.db.prepare('SELECT COUNT(*) n FROM teams').get().n, 13);
  const b = redisStore(fake, 'b1');
  await b.sync();
  assert.equal(b.db.prepare('SELECT COUNT(*) n FROM teams').get().n, 13);
  assert.equal(fake.data.get('darts-league:version'), '1', 'second instance must not re-seed');
});

test('redis store: a saved change reaches other instances, and a stale instance cannot overwrite it', async () => {
  const fake = fakeUpstash();
  const a = redisStore(fake, 'a2');
  const b = redisStore(fake, 'b2');
  await a.sync();
  await b.sync();

  a.db.prepare("UPDATE leagues SET region = 'From A'").run();
  await a.push();
  assert.equal(fake.data.get('darts-league:version'), '2');

  // b has not synced since a saved: its save must be refused, and it must end up holding a's data.
  b.db.prepare("UPDATE leagues SET region = 'From B'").run();
  await assert.rejects(() => b.push(), (e) => e.status === 409);
  assert.equal(b.db.prepare('SELECT region FROM leagues').get().region, 'From A');
  assert.equal(fake.data.get('darts-league:version'), '2');

  // After syncing, b can save normally and a picks it up.
  b.db.prepare("UPDATE leagues SET region = 'From B'").run();
  await b.push();
  await a.sync();
  assert.equal(a.db.prepare('SELECT region FROM leagues').get().region, 'From B');
});

test('redis store: if storage is unreachable during a save, the unsaved change is dropped on the next sync', async () => {
  const fake = fakeUpstash();
  const a = redisStore(fake, 'a3');
  await a.sync();
  a.db.prepare("UPDATE leagues SET region = 'Unsaved'").run();
  fake.state.down = true;
  await assert.rejects(() => a.push(), (e) => e.status === 503);
  fake.state.down = false;
  await a.sync();
  assert.equal(a.db.prepare('SELECT region FROM leagues').get().region, 'Thornhill, West Yorkshire, England');
});

test('vercel handler without storage: public site works, admin changes are refused, nothing is lost silently', async () => {
  const handler = createVercelHandler({ env: { ADMIN_TOKEN: 'admin-secret' }, store: createEphemeralStore({ file: dbFile('eph') }) });
  const s = await serve(handler);
  try {
    const cfg = await (await fetch(`${s.base}/api/config`)).json();
    assert.deepEqual(cfg, { defaultLeague: 'thornhill', adminConfigured: true, storage: 'none', writable: false });
    const league = await (await fetch(`${s.base}/api/leagues/thornhill`)).json();
    assert.equal(league.name, 'Thornhill Village Darts League');
    const put = await fetch(`${s.base}/api/admin/leagues/thornhill/points-system`, { method: 'PUT', headers: auth, body: JSON.stringify({ confirmed: true, win: 2 }) });
    assert.equal(put.status, 503);
    assert.match((await put.json()).error, /no database storage/);
    // Checking a file is still allowed: it saves nothing.
    const preview = await fetch(`${s.base}/api/admin/leagues/thornhill/import/preview`, { method: 'POST', headers: auth,
      body: JSON.stringify({ kind: 'historical_standings', seasonId: 1, csv: 'Division,Pos,Team\nDivision A,1,Flatt Top A\n' }) });
    assert.equal(preview.status, 200);
  } finally { s.close(); }
});

test('vercel handler without ADMIN_TOKEN: admin API is switched off rather than open', async () => {
  const s = await serve(createVercelHandler({ env: {}, store: createEphemeralStore({ file: dbFile('notoken') }) }));
  try {
    assert.equal((await (await fetch(`${s.base}/api/config`)).json()).adminConfigured, false);
    const r = await fetch(`${s.base}/api/admin/check`, { headers: { authorization: 'Bearer anything' } });
    assert.equal(r.status, 503);
  } finally { s.close(); }
});

test('vercel handler with storage: an admin change is published and served by a second instance', async () => {
  const fake = fakeUpstash();
  const env = { ADMIN_TOKEN: 'admin-secret' };
  const one = await serve(createVercelHandler({ env, store: redisStore(fake, 'v1') }));
  const two = await serve(createVercelHandler({ env, store: redisStore(fake, 'v2') }));
  try {
    assert.equal((await (await fetch(`${two.base}/api/leagues/thornhill`)).json()).pointsSystem.confirmed, false);
    const put = await fetch(`${one.base}/api/admin/leagues/thornhill/points-system`, { method: 'PUT', headers: auth, body: JSON.stringify({ confirmed: true, win: 2, loss: 0 }) });
    assert.equal(put.status, 200);
    const seen = await (await fetch(`${two.base}/api/leagues/thornhill`)).json();
    assert.deepEqual([seen.pointsSystem.confirmed, seen.pointsSystem.win], [true, 2]);
    // A read-only request must not publish a new copy.
    const before = fake.data.get('darts-league:version');
    await fetch(`${one.base}/api/leagues/thornhill/clubs`);
    await fetch(`${one.base}/api/admin/leagues/thornhill/imports`, { headers: auth });
    assert.equal(fake.data.get('darts-league:version'), before);
  } finally { one.close(); two.close(); }
});

test('vercel handler: works under a sub-path, via ?__path= rewrites, and with a body the host already parsed', async () => {
  const fake = fakeUpstash();
  const inner = createVercelHandler({ basePath: '/thornhill', env: { ADMIN_TOKEN: 'admin-secret' }, store: redisStore(fake, 'sub') });
  // Mimic Vercel: the function is invoked at its own path with the app path in ?__path=, and JSON bodies arrive pre-parsed.
  const s = await serve(async (req, res) => {
    if (req.headers['x-as-vercel']) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      if (chunks.length) req.body = JSON.parse(Buffer.concat(chunks).toString());
      const original = new URL(req.url, 'http://x');
      req.url = `/api/thornhill?__path=${encodeURIComponent(original.pathname.replace(/^\/thornhill/, ''))}&path=x`;
    }
    return inner(req, res);
  });
  try {
    const direct = await fetch(`${s.base}/thornhill/api/leagues/thornhill`);
    assert.equal((await direct.json()).slug, 'thornhill');
    const rewritten = await fetch(`${s.base}/thornhill/api/leagues/thornhill/clubs`, { headers: { 'x-as-vercel': '1' } });
    assert.equal((await rewritten.json()).length, 8);
    const post = await fetch(`${s.base}/thornhill/api/admin/leagues/thornhill/teams`, { method: 'POST', headers: { ...auth, 'x-as-vercel': '1' }, body: JSON.stringify({ name: 'Black Horse B' }) });
    assert.equal(post.status, 200);
    assert.equal((await post.json()).name, 'Black Horse B');
  } finally { s.close(); }
});
