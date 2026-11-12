'use strict';
(() => {
  const { esc, cell, api, icon, applyBranding, initChrome, STATUS } = window.League;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let slug = null;
  let token = sessionStorage.getItem('adminToken') || '';
  let league = null;
  let pending = null; // last successfully previewed import payload
  initChrome();

  const admin = (path, method = 'GET', body) => api(path, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const base = () => `api/admin/leagues/${slug}`;

  function flash(msg, isError = false) {
    const el = $('flash');
    el.className = `callout ${isError ? 'err' : 'ok'}`;
    el.innerHTML = `${icon(isError ? 'alert' : 'check')}<div>${esc(msg)}</div>`;
    el.hidden = false;
    el.scrollIntoView({ block: 'nearest' });
  }
  const guard = (fn) => async (e) => {
    e?.preventDefault?.();
    try { await fn(e); } catch (err) {
      if (err.status === 401) return signOut('Your token was not accepted. Please sign in again.');
      flash(err.message, true);
    }
  };
  const list = (el, title, items) => {
    el.hidden = !items.length;
    el.innerHTML = items.length ? `${icon(el.classList.contains('err') ? 'alert' : 'info')}<div><strong>${esc(title)}</strong><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>` : '';
  };

  // ---------- sign in ----------
  function signOut(msg) {
    token = '';
    sessionStorage.removeItem('adminToken');
    $('panel').hidden = true;
    $('login').hidden = false;
    $('loginError').hidden = !msg;
    $('loginError').innerHTML = msg ? `${icon('alert')}<div>${esc(msg)}</div>` : '';
  }
  $('signOut').onclick = () => signOut();
  $('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    token = $('token').value.trim();
    try {
      await admin('api/admin/check');
      sessionStorage.setItem('adminToken', token);
      $('token').value = '';
      await start();
    } catch (err) { signOut(err.status === 401 ? 'That token was not accepted.' : err.message); }
  };

  // ---------- tabs ----------
  $('tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll('#tabs [data-tab]').forEach((b) => b.classList.toggle('on', b === btn));
    document.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab; });
    $('flash').hidden = true;
  });

  // ---------- loading ----------
  async function start() {
    const [config, leagues] = await Promise.all([api('api/config'), api('api/leagues')]);
    slug = slug || params.get('league') || config.defaultLeague;
    if (!leagues.some((l) => l.slug === slug)) slug = leagues[0].slug;
    const ls = $('leagueSelect');
    ls.innerHTML = leagues.map((l) => `<option value="${esc(l.slug)}">${esc(l.name)}</option>`).join('');
    ls.value = slug;
    ls.hidden = leagues.length < 2;
    ls.onchange = guard(async () => { slug = ls.value; resetImport(); await refresh(); });
    $('login').hidden = true;
    $('panel').hidden = false;
    await refresh();
  }

  async function refresh() {
    league = await api(`api/leagues/${slug}`);
    applyBranding(league);
    document.title = `League administration — ${league.name}`;

    // Import: season picker
    const keep = $('impSeason').value;
    $('impSeason').innerHTML = league.seasons.map((s) => `<option value="${s.id}">${esc(s.name)} — ${esc(STATUS[s.status])}</option>`).join('') +
      '<option value="new">＋ New season…</option>';
    if ([...$('impSeason').options].some((o) => o.value === keep)) $('impSeason').value = keep;
    onImportOptions();

    // Seasons
    $('seasonRows').innerHTML = league.seasons.map((s) =>
      `<tr><td class="l team">${esc(s.name)}<div class="muted" style="font-weight:400;font-size:.85rem">${esc(s.notes || '')}</div></td>` +
      `<td class="l"><select class="inp" data-season="${s.id}">${Object.entries(STATUS).map(([v, t]) => `<option value="${v}"${v === s.status ? ' selected' : ''}>${t}</option>`).join('')}</select></td>` +
      `<td>${s.historical_rows}</td><td>${s.fixture_count}</td></tr>`).join('');

    // Points
    const p = league.pointsSystem;
    $('ptWin').value = p.win ?? ''; $('ptDraw').value = p.draw ?? ''; $('ptLoss').value = p.loss ?? ''; $('ptLeg').value = p.perLeg ?? '';
    $('ptNotes').value = p.notes ?? ''; $('ptConfirmed').checked = p.confirmed;

    // Branding
    $('brName').value = league.name; $('brRegion').value = league.region || '';
    $('brPrimary').value = league.branding.primaryColour; $('brAccent').value = league.branding.accentColour;

    // Teams
    const clubs = await api(`api/leagues/${slug}/clubs`);
    $('clubList').innerHTML = clubs.map((c) => `<option value="${esc(c.name)}">`).join('');
    $('teamRows').innerHTML = clubs.flatMap((c) => c.teams.map((t) =>
      `<tr data-team="${t.id}"><td class="l"><input data-f="name" value="${esc(t.name)}" aria-label="Team name"></td>` +
      `<td class="l"><input data-f="club" value="${esc(c.name)}" list="clubList" aria-label="Club"></td>` +
      `<td class="l muted wrap">${esc(t.divisions[0] ? `${t.divisions[0].division} (${t.divisions[0].season})` : '—')}</td>` +
      `<td class="l"><input type="checkbox" data-f="active"${t.active ? ' checked' : ''} aria-label="Active"></td>` +
      `<td><button class="btn sm" data-save>Save</button></td></tr>`)).join('');

    // History
    const KIND = { historical_standings: 'Historical standings', fixtures: 'Fixtures', seed: 'Initial data' };
    const imports = await admin(`${base()}/imports`);
    $('historyRows').innerHTML = imports.map((b) =>
      `<tr><td class="l">${esc(b.created_at)}</td><td class="l">${esc(KIND[b.kind] || b.kind)}</td><td class="l">${esc(b.season || '')}</td>` +
      `<td class="l">${esc(b.filename || '—')}</td><td>${b.row_count}</td>` +
      `<td class="l wrap">${esc([b.source_note, ...b.warnings].filter(Boolean).join(' · '))}</td></tr>`).join('');
  }

  // ---------- import ----------
  const HELP = {
    historical_standings: 'Columns: Division, Pos, Team, Played, Won, Lost, Legs For, Legs Against, Leg Difference, Points. Figures are stored exactly as in the file and are never recalculated; blank cells stay blank. Each division in the file replaces that division\'s stored table. ' +
      'Templates: <a href="templates/standings-template.csv">blank</a>',
    fixtures: 'Columns: Division, Date, Home, Away, Home Legs, Away Legs, Status (optional). Leave legs blank for matches not yet played. Re-uploading a fixture with the same date and teams updates its result. ' +
      'Template: <a href="templates/fixtures-template.csv">blank</a>',
  };
  function onImportOptions() {
    const isNew = $('impSeason').value === 'new';
    $('newSeasonBox').hidden = !isNew;
    $('newSeasonStatusBox').hidden = !isNew;
    let help = HELP[$('impKind').value];
    if ($('impKind').value === 'historical_standings' && slug === 'thornhill') {
      help += ' · <a href="templates/thornhill-final-standings-2026.csv">Thornhill final standings 2026 (teams pre-filled)</a>';
    }
    $('impHelp').innerHTML = help;
    invalidate();
  }
  function invalidate() { pending = null; $('impCommit').disabled = true; $('impCommit').classList.remove('primary'); }
  function showFile() {
    const f = $('impFile').files[0];
    $('dropzone').classList.toggle('has-file', !!f);
    $('dropTitle').textContent = f ? f.name : 'Choose a spreadsheet or drop it here';
    $('dropSub').textContent = f ? `${Math.max(1, Math.round(f.size / 1024))} KB · click to choose a different file` : '.csv or .xlsx';
  }
  $('impFile').addEventListener('change', showFile);
  ['dragenter', 'dragover'].forEach((t) => $('dropzone').addEventListener(t, (e) => { e.preventDefault(); $('dropzone').classList.add('over'); }));
  ['dragleave', 'drop'].forEach((t) => $('dropzone').addEventListener(t, (e) => { e.preventDefault(); $('dropzone').classList.remove('over'); }));
  $('dropzone').addEventListener('drop', (e) => {
    if (!e.dataTransfer?.files.length) return;
    $('impFile').files = e.dataTransfer.files;
    showFile(); invalidate();
  });
  function resetImport() {
    invalidate();
    $('impFile').value = ''; $('impText').value = ''; $('impNote').value = ''; showFile();
    $('impErrors').hidden = true; $('impWarnings').hidden = true; $('impTable').innerHTML = '';
  }
  ['impKind', 'impSeason'].forEach((id) => { $(id).onchange = onImportOptions; });
  ['impFile', 'impText', 'impCreate', 'impNewName', 'impNewStatus'].forEach((id) => $(id).addEventListener('input', invalidate));

  async function buildPayload() {
    const payload = { kind: $('impKind').value, createMissingTeams: $('impCreate').checked, sourceNote: $('impNote').value.trim() };
    if ($('impSeason').value === 'new') payload.newSeason = { name: $('impNewName').value, status: $('impNewStatus').value };
    else payload.seasonId = Number($('impSeason').value);
    const file = $('impFile').files[0];
    if (file) {
      payload.filename = file.name;
      if (/\.xlsx$/i.test(file.name)) payload.rows = await window.readXlsx(await file.arrayBuffer());
      else if (/\.xls$/i.test(file.name)) throw new Error('Old-style .xls files are not supported — save the sheet as .xlsx or .csv first');
      else payload.csv = await file.text();
    } else if ($('impText').value.trim()) payload.csv = $('impText').value;
    else throw new Error('Choose a file or paste CSV first');
    return payload;
  }

  function previewTable(p) {
    if (!p.rows.length) return '';
    if (p.kind === 'fixtures') {
      return `<div class="table-scroll"><table><thead><tr><th class="l">Division</th><th class="l">Date</th><th class="l">Home</th><th>Legs</th><th class="l">Away</th><th class="l">Status</th></tr></thead><tbody>` +
        p.rows.map((r) => `<tr><td class="l">${esc(r.division)}</td><td class="l">${esc(r.date || 'TBC')}</td><td class="l team">${esc(r.home)}</td>` +
          `<td style="text-align:center">${r.home_legs === null ? '—' : `${r.home_legs} – ${r.away_legs}`}</td><td class="l team">${esc(r.away)}</td><td class="l">${esc(r.status)}</td></tr>`).join('') +
        '</tbody></table></div>';
    }
    return p.divisions.map((d) =>
      `<h3>${esc(d)}</h3><div class="table-scroll"><table><thead><tr><th>#</th><th class="l">Team</th><th>P</th><th>W</th><th>L</th><th>LF</th><th>LA</th><th>+/−</th><th>Pts</th></tr></thead><tbody>` +
      p.rows.filter((r) => r.division === d).map((r) =>
        `<tr>${cell(r.position, 'pos')}<td class="l team">${esc(r.team)}</td>${cell(r.played)}${cell(r.won)}${cell(r.lost)}${cell(r.legs_for)}${cell(r.legs_against)}${cell(r.leg_difference, '', true)}${cell(r.points, 'pts')}</tr>`).join('') +
      '</tbody></table></div>').join('');
  }

  $('impPreview').onclick = guard(async () => {
    invalidate();
    $('flash').hidden = true;
    $('impErrors').hidden = true; $('impWarnings').hidden = true; $('impTable').innerHTML = '';
    const payload = await buildPayload();
    const p = await admin(`${base()}/import/preview`, 'POST', payload);
    list($('impErrors'), 'Fix these before the file can be saved:', p.errors);
    list($('impWarnings'), 'Please check:', p.warnings);
    $('impTable').innerHTML = previewTable(p);
    if (p.ok) { pending = payload; $('impCommit').disabled = false; $('impCommit').classList.add('primary'); }
  });

  $('impCommit').onclick = guard(async () => {
    if (!pending) return;
    const done = await admin(`${base()}/import/commit`, 'POST', pending);
    resetImport();
    await refresh();
    $('impSeason').value = String(done.seasonId);
    onImportOptions();
    flash(`Import saved: ${done.rows} rows.`);
  });

  // ---------- other forms ----------
  $('teamForm').onsubmit = guard(async () => {
    const t = await admin(`${base()}/teams`, 'POST', { name: $('teamName').value, club: $('teamClub').value || undefined });
    $('teamForm').reset();
    await refresh();
    flash(`Added ${t.name}.`);
  });
  $('teamRows').addEventListener('click', guard(async (e) => {
    if (!e.target.matches('[data-save]')) return;
    const tr = e.target.closest('tr');
    const f = (n) => tr.querySelector(`[data-f="${n}"]`);
    const t = await admin(`${base()}/teams/${tr.dataset.team}`, 'PATCH', { name: f('name').value, club: f('club').value, active: f('active').checked });
    await refresh();
    flash(`Saved ${t.name}.`);
  }));
  $('pointsForm').onsubmit = guard(async () => {
    await admin(`${base()}/points-system`, 'PUT', { win: $('ptWin').value, draw: $('ptDraw').value, loss: $('ptLoss').value, perLeg: $('ptLeg').value,
      notes: $('ptNotes').value, confirmed: $('ptConfirmed').checked });
    await refresh();
    flash($('ptConfirmed').checked ? 'Points system saved and confirmed. Live tables now show points.' : 'Points system saved (not yet confirmed — live tables show no points).');
  });
  $('seasonForm').onsubmit = guard(async () => {
    await admin(`${base()}/seasons`, 'POST', { name: $('seasonName').value, status: $('seasonStatus').value });
    $('seasonForm').reset();
    await refresh();
    flash('Season added.');
  });
  $('seasonRows').addEventListener('change', guard(async (e) => {
    if (!e.target.dataset.season) return;
    await admin(`${base()}/seasons/${e.target.dataset.season}`, 'PATCH', { status: e.target.value });
    await refresh();
    flash('Season updated.');
  }));
  $('brandForm').onsubmit = guard(async () => {
    await admin(`${base()}/branding`, 'PUT', { name: $('brName').value, region: $('brRegion').value, primaryColour: $('brPrimary').value, accentColour: $('brAccent').value });
    await refresh();
    flash('Branding saved.');
  });
  $('leagueForm').onsubmit = guard(async () => {
    const l = await admin('api/admin/leagues', 'POST', { name: $('lgName').value, slug: $('lgSlug').value, region: $('lgRegion').value });
    $('leagueForm').reset();
    slug = l.slug;
    resetImport();
    await start();
    flash(`${l.name} created. You are now managing it.`);
  });

  // Tell the administrator plainly if the site has not been fully set up on its host.
  api('api/config').then((config) => {
    if (!config.adminConfigured) {
      $('loginForm').hidden = true;
      $('setupNotice').hidden = false;
      $('setupNotice').innerHTML = `${icon('info')}<div><strong>Administration is switched off.</strong> No admin token has been set for this site. ` +
        'Add an environment variable called <code>ADMIN_TOKEN</code> (any long, hard-to-guess phrase) in the hosting settings, then redeploy.</div>';
    }
    if (!config.writable) {
      $('storageNotice').hidden = false;
      $('storageNotice').innerHTML = `${icon('alert')}<div><strong>Changes can't be saved yet.</strong> This site has no database storage connected, so imports and edits are refused. ` +
        'The public pages still work and show the starting data. To switch saving on, connect an Upstash Redis database to the Vercel project (Storage tab), then redeploy.</div>';
    }
  }).catch(() => { /* the sign-in form reports connection problems */ });

  if (token) start().catch((err) => signOut(err.status === 401 ? '' : err.message));
})();
