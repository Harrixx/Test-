'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { tx } = require('./db');
const { createTeam, updateTeam, listClubs, normaliseName } = require('./teams');
const { getPointsSystem, setPointsSystem, historicalStandings, liveStandings } = require('./standings');
const importers = require('./importers');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json' };
const MAX_BODY = 5 * 1024 * 1024;

class HttpError extends Error {
  constructor(status, message, details) { super(message); this.status = status; this.details = details; }
}

function send(res, status, body, headers = {}) {
  const isJson = typeof body !== 'string' && !Buffer.isBuffer(body);
  res.writeHead(status, { 'Content-Type': isJson ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(isJson ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new HttpError(413, 'Upload too large (5 MB max)')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new HttpError(400, 'Request body must be JSON')); }
    });
    req.on('error', reject);
  });
}

function serveFile(res, dir, rel) {
  const file = path.normalize(path.join(dir, rel));
  if (!file.startsWith(dir + path.sep)) return send(res, 404, 'Not found');
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'Not found');
    const headers = { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' };
    if (dir === TEMPLATES_DIR) headers['Content-Disposition'] = `attachment; filename="${path.basename(file)}"`;
    res.writeHead(200, headers);
    res.end(buf);
  });
}

function leagueSummary(db, league) {
  return {
    slug: league.slug, name: league.name, shortName: league.short_name, region: league.region,
    branding: { primaryColour: league.primary_colour, accentColour: league.accent_colour },
  };
}

function createApp(db, { adminToken, defaultLeague = 'thornhill' } = {}) {
  if (!adminToken) throw new Error('adminToken is required');
  const tokenBuf = Buffer.from(adminToken);

  const isAdmin = (req) => {
    const m = String(req.headers.authorization || '').match(/^Bearer (.+)$/);
    if (!m) return false;
    const given = Buffer.from(m[1]);
    return given.length === tokenBuf.length && crypto.timingSafeEqual(given, tokenBuf);
  };

  const league = (slug) => {
    const l = db.prepare('SELECT * FROM leagues WHERE slug = ?').get(slug);
    if (!l) throw new HttpError(404, `League "${slug}" not found`);
    return l;
  };
  const season = (l, id) => {
    const s = db.prepare('SELECT * FROM seasons WHERE id = ? AND league_id = ?').get(Number(id), l.id);
    if (!s) throw new HttpError(404, 'Season not found');
    return s;
  };
  const seasonsOf = (l) => db.prepare(
    `SELECT s.id, s.name, s.status, s.notes, s.created_at,
            (SELECT COUNT(*) FROM historical_standings h WHERE h.season_id = s.id) AS historical_rows,
            (SELECT COUNT(*) FROM fixtures f WHERE f.season_id = s.id) AS fixture_count
       FROM seasons s WHERE s.league_id = ? ORDER BY s.created_at DESC, s.id DESC`
  ).all(l.id);

  const routes = [
    // ---------- public ----------
    ['GET', /^\/api\/config$/, () => ({ defaultLeague })],
    ['GET', /^\/api\/leagues$/, () => db.prepare('SELECT * FROM leagues ORDER BY name').all().map((l) => leagueSummary(db, l))],
    ['GET', /^\/api\/leagues\/([\w-]+)$/, (m) => {
      const l = league(m[1]);
      return { ...leagueSummary(db, l), seasons: seasonsOf(l), pointsSystem: getPointsSystem(db, l.id) };
    }],
    ['GET', /^\/api\/leagues\/([\w-]+)\/seasons\/(\d+)\/standings$/, (m) => {
      const l = league(m[1]);
      const s = season(l, m[2]);
      return { season: s, historical: historicalStandings(db, s.id), live: liveStandings(db, l.id, s.id) };
    }],
    ['GET', /^\/api\/leagues\/([\w-]+)\/seasons\/(\d+)\/fixtures$/, (m) => {
      const l = league(m[1]);
      const s = season(l, m[2]);
      return db.prepare(
        `SELECT f.id, d.name AS division, f.match_date, ht.name AS home, at.name AS away, f.home_legs, f.away_legs, f.status
           FROM fixtures f JOIN divisions d ON d.id = f.division_id
           JOIN teams ht ON ht.id = f.home_team_id JOIN teams at ON at.id = f.away_team_id
          WHERE f.season_id = ? ORDER BY f.match_date IS NULL, f.match_date, d.sort_order, ht.name`
      ).all(s.id);
    }],
    ['GET', /^\/api\/leagues\/([\w-]+)\/clubs$/, (m) => listClubs(db, league(m[1]).id)],

    // ---------- admin ----------
    ['GET', /^\/api\/admin\/check$/, () => ({ ok: true }), true],
    ['POST', /^\/api\/admin\/leagues$/, (m, body) => {
      const slug = String(body.slug || '').trim().toLowerCase();
      if (!/^[a-z0-9-]{2,40}$/.test(slug)) throw new HttpError(400, 'Slug must be 2–40 lowercase letters, numbers or dashes');
      if (!normaliseName(body.name)) throw new HttpError(400, 'League name is required');
      if (db.prepare('SELECT 1 FROM leagues WHERE slug = ?').get(slug)) throw new HttpError(409, 'That slug is already used');
      tx(db, () => {
        const { lastInsertRowid } = db.prepare('INSERT INTO leagues (slug, name, short_name, region, primary_colour, accent_colour) VALUES (?, ?, ?, ?, ?, ?)')
          .run(slug, normaliseName(body.name), body.shortName || null, body.region || null, body.primaryColour || '#14532d', body.accentColour || '#b91c1c');
        db.prepare('INSERT INTO points_systems (league_id, confirmed) VALUES (?, 0)').run(lastInsertRowid);
      });
      return leagueSummary(db, league(slug));
    }, true],
    ['PUT', /^\/api\/admin\/leagues\/([\w-]+)\/branding$/, (m, body) => {
      const l = league(m[1]);
      const colour = (v, fallback) => {
        if (v === undefined) return fallback;
        if (!/^#[0-9a-fA-F]{6}$/.test(v)) throw new HttpError(400, `"${v}" is not a #rrggbb colour`);
        return v;
      };
      const name = body.name !== undefined ? normaliseName(body.name) : l.name;
      if (!name) throw new HttpError(400, 'League name is required');
      db.prepare('UPDATE leagues SET name = ?, short_name = ?, region = ?, primary_colour = ?, accent_colour = ? WHERE id = ?').run(
        name, body.shortName !== undefined ? body.shortName || null : l.short_name, body.region !== undefined ? body.region || null : l.region,
        colour(body.primaryColour, l.primary_colour), colour(body.accentColour, l.accent_colour), l.id);
      return leagueSummary(db, league(l.slug));
    }, true],
    ['PUT', /^\/api\/admin\/leagues\/([\w-]+)\/points-system$/, (m, body) => {
      try { return setPointsSystem(db, league(m[1]).id, body); } catch (e) { if (e instanceof HttpError) throw e; throw new HttpError(400, e.message); }
    }, true],
    ['POST', /^\/api\/admin\/leagues\/([\w-]+)\/seasons$/, (m, body) => {
      const l = league(m[1]);
      const name = normaliseName(body.name);
      const status = body.status || 'upcoming';
      if (!name) throw new HttpError(400, 'Season name is required');
      if (!['upcoming', 'active', 'completed'].includes(status)) throw new HttpError(400, 'Invalid status');
      if (db.prepare('SELECT 1 FROM seasons WHERE league_id = ? AND lower(name) = lower(?)').get(l.id, name)) throw new HttpError(409, 'A season with that name exists');
      const { lastInsertRowid } = db.prepare('INSERT INTO seasons (league_id, name, status, notes) VALUES (?, ?, ?, ?)').run(l.id, name, status, body.notes || null);
      return season(l, lastInsertRowid);
    }, true],
    ['PATCH', /^\/api\/admin\/leagues\/([\w-]+)\/seasons\/(\d+)$/, (m, body) => {
      const l = league(m[1]);
      const s = season(l, m[2]);
      const status = body.status ?? s.status;
      if (!['upcoming', 'active', 'completed'].includes(status)) throw new HttpError(400, 'Invalid status');
      const name = body.name !== undefined ? normaliseName(body.name) : s.name;
      if (!name) throw new HttpError(400, 'Season name is required');
      db.prepare('UPDATE seasons SET name = ?, status = ?, notes = ? WHERE id = ?').run(name, status, body.notes !== undefined ? body.notes || null : s.notes, s.id);
      return season(l, s.id);
    }, true],
    ['POST', /^\/api\/admin\/leagues\/([\w-]+)\/teams$/, (m, body) => {
      try { return createTeam(db, league(m[1]).id, body.name, body.club); } catch (e) { if (e instanceof HttpError) throw e; throw new HttpError(400, e.message); }
    }, true],
    ['PATCH', /^\/api\/admin\/leagues\/([\w-]+)\/teams\/(\d+)$/, (m, body) => {
      try { return updateTeam(db, league(m[1]).id, Number(m[2]), body); } catch (e) { if (e instanceof HttpError) throw e; throw new HttpError(400, e.message); }
    }, true],
    ['POST', /^\/api\/admin\/leagues\/([\w-]+)\/import\/preview$/, (m, body) => {
      try { return importers.preview(db, m[1], body); } catch (e) { throw new HttpError(400, e.message); }
    }, true],
    ['POST', /^\/api\/admin\/leagues\/([\w-]+)\/import\/commit$/, (m, body) => {
      try { return importers.commit(db, m[1], body); } catch (e) { throw new HttpError(e.details ? 422 : 400, e.message, e.details); }
    }, true],
    ['GET', /^\/api\/admin\/leagues\/([\w-]+)\/imports$/, (m) => {
      const l = league(m[1]);
      return db.prepare(
        `SELECT b.id, b.kind, b.filename, b.row_count, b.warnings, b.source_note, b.created_at, s.name AS season
           FROM import_batches b LEFT JOIN seasons s ON s.id = b.season_id WHERE b.league_id = ? ORDER BY b.created_at DESC, b.id DESC`
      ).all(l.id).map((b) => ({ ...b, warnings: b.warnings ? JSON.parse(b.warnings) : [] }));
    }, true],
  ];

  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const p = url.pathname;
    try {
      if (p.startsWith('/api/')) {
        for (const [method, re, fn, admin] of routes) {
          const m = p.match(re);
          if (!m) continue;
          if (req.method !== method) continue;
          if (admin && !isAdmin(req)) throw new HttpError(401, 'Administrator token required');
          const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await readBody(req) : {};
          return send(res, 200, fn(m, body));
        }
        throw new HttpError(404, 'Not found');
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
      if (p.startsWith('/templates/')) return serveFile(res, TEMPLATES_DIR, decodeURIComponent(p.slice('/templates/'.length)));
      if (p === '/' || p === '/index.html') return serveFile(res, PUBLIC_DIR, 'index.html');
      if (p === '/admin' || p === '/admin/') return serveFile(res, PUBLIC_DIR, 'admin.html');
      return serveFile(res, PUBLIC_DIR, decodeURIComponent(p.slice(1)));
    } catch (e) {
      const status = e.status || 500;
      if (status === 500) console.error(e);
      return send(res, status, { error: status === 500 ? 'Internal error' : e.message, ...(e.details || {}) });
    }
  };
}

module.exports = { createApp };
