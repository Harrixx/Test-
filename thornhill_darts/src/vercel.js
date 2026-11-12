'use strict';
// Request handler for Vercel functions. Vercel serves the files in public/
// itself; this only answers /api/* requests.

function fail(res, status, error) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error }));
}

function createVercelHandler({ basePath = '', env = process.env, store: givenStore } = {}) {
  let store = givenStore || null;
  let app = null;
  let appDb = null;

  return async function handler(req, res) {
    let createApp;
    try {
      ({ createApp } = require('./app'));
      store = store || require('./store').storeFromEnv(env);
    } catch (e) {
      console.error(e);
      return fail(res, 500, e.code === 'ERR_UNKNOWN_BUILTIN_MODULE'
        ? 'This site needs Node.js 22 or newer. Set the Node.js version in the Vercel project settings and redeploy.'
        : 'The league site could not start.');
    }

    const isWrite = req.method !== 'GET' && req.method !== 'HEAD';
    try {
      await store.sync({ fresh: isWrite });
    } catch (e) {
      console.error(e);
      // A read can still be answered from the copy this instance already holds.
      if (!store.db || isWrite) return fail(res, 503, 'The league database could not be reached. Please try again in a moment.');
    }

    if (appDb !== store.db) {
      appDb = store.db;
      app = createApp(appDb, {
        adminToken: env.ADMIN_TOKEN || null,
        defaultLeague: env.DEFAULT_LEAGUE || 'thornhill',
        basePath,
        storage: { kind: store.kind, writable: store.writable },
        commit: () => store.push(),
      });
    }
    return app(req, res);
  };
}

module.exports = { createVercelHandler };
