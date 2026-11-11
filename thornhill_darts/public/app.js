'use strict';
(async () => {
  const { esc, api, icon, avatar, setClubs, applyBranding, initChrome, STATUS } = window.League;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let slug;
  let league;
  let clubs = [];

  initChrome();

  // ---------- views (Table / Fixtures / Clubs) ----------
  const VIEWS = ['table', 'fixtures', 'clubs'];
  function showView() {
    const name = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'table';
    const swap = () => {
      document.querySelectorAll('[data-view]').forEach((v) => { v.hidden = v.dataset.view !== name; });
      document.querySelectorAll('[data-nav]').forEach((a) => {
        a.classList.toggle('on', a.dataset.nav === name);
        if (a.dataset.nav === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      scrollTo(0, 0);
    };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(swap);
    else swap();
  }
  addEventListener('hashchange', showView);
  showView();

  const callout = (el, name, text) => { el.hidden = !text; el.innerHTML = text ? `${icon(name)}<div>${esc(text)}</div>` : ''; };
  const val = (v, signed) => (v === null || v === undefined ? null : signed && v > 0 ? `+${v}` : String(v));

  // ---------- standings ----------
  function divisionCard(d, i, { live, showPoints }) {
    const cols = [['played', 'P', 'Played'], ['won', 'W', 'Won'], ...(live ? [['drawn', 'D', 'Drawn']] : []), ['lost', 'L', 'Lost'],
      ['legs_for', 'LF', 'Legs for'], ['legs_against', 'LA', 'Legs against'], ['leg_difference', '+/−', 'Leg difference'],
      ...(showPoints ? [['points', 'Pts', 'League points']] : [])];
    // A published table with no figures entered yet is shown as a clean final order, not a grid of blanks.
    const hasStats = live || d.rows.some((r) => cols.some(([k]) => r[k] !== null));

    const row = (r, n) => {
      const cells = cols.map(([k, , label]) => {
        const v = val(r[k], k === 'leg_difference');
        const cls = [k === 'points' ? 'pts' : '', v === null ? 'na' : ''].join(' ').trim();
        return `<span class="${cls}" aria-label="${label}: ${v === null ? 'not entered' : esc(v)}">${v === null ? '–' : esc(v)}</span>`;
      }).join('');
      const s = (k, signed) => val(r[k], signed) ?? '–';
      const anyFigure = cols.some(([k]) => r[k] !== null);
      const strip = !anyFigure ? 'Figures not entered' :
        `P <b>${s('played')}</b> · W <b>${s('won')}</b>${live ? ` · D <b>${s('drawn')}</b>` : ''} · L <b>${s('lost')}</b> · Legs <b>${s('legs_for')}–${s('legs_against')}</b> · <b>${s('leg_difference', true)}</b>`;
      return `<li class="${r.position === 1 ? 'first' : ''}" style="--n:${n}">` +
        `<span class="pos" aria-label="Position ${r.position ?? 'not set'}">${r.position ?? '–'}</span>${avatar(r.team, r.club)}` +
        `<div class="who"><b>${esc(r.team)}</b></div>` +
        (hasStats ? `<div class="statgrid">${cells}</div><div class="strip" aria-hidden="true">${strip}</div>` : '') + '</li>';
    };

    const head = hasStats
      ? `<div class="cols" aria-hidden="true"><span>#</span><span></span><span>Team</span><div class="statgrid">${cols.map(([, h]) => `<span>${h}</span>`).join('')}</div></div>` : '';
    return `<article class="card division${i === 0 ? ' on' : ''}" data-division="${i}">` +
      `<div class="division-head"><h3>${esc(d.name)}</h3><span>${d.rows.length} teams</span></div>` +
      `<div class="standings${hasStats ? ' has-stats' : ''}${hasStats && !showPoints ? ' no-pts' : ''}" style="--n-stats:${cols.length}">${head}<ol>${d.rows.map(row).join('')}</ol></div></article>`;
  }

  function renderDivisions(el, divisions, opts) {
    const multi = divisions.length > 1;
    el.innerHTML =
      (multi ? `<div class="segmented" role="tablist" aria-label="Division">${divisions.map((d, i) =>
        `<button role="tab" aria-selected="${i === 0}" class="${i === 0 ? 'on' : ''}" data-pick="${i}">${esc(d.name)}</button>`).join('')}</div>` : '') +
      `<div class="divisions${multi ? ' switchable' : ''}">${divisions.map((d, i) => divisionCard(d, i, opts)).join('')}</div>`;
    el.onclick = (e) => {
      const pick = e.target.closest('[data-pick]')?.dataset.pick;
      if (pick === undefined) return;
      el.querySelectorAll('[data-pick]').forEach((b) => { b.classList.toggle('on', b.dataset.pick === pick); b.setAttribute('aria-selected', b.dataset.pick === pick); });
      el.querySelectorAll('[data-division]').forEach((c) => c.classList.toggle('on', c.dataset.division === pick));
    };
  }

  // ---------- fixtures ----------
  function renderFixtures(fixtures, season) {
    $('fixturesSub').textContent = season.name;
    if (!fixtures.length) {
      $('fixtureList').innerHTML = `<div class="card empty"><div class="ring">${icon('calendar')}</div><h3>No fixtures yet</h3>` +
        '<p>No fixtures or results have been entered for this season.</p></div>';
      return;
    }
    const days = new Map();
    for (const f of fixtures) {
      const key = f.match_date || '';
      if (!days.has(key)) days.set(key, []);
      days.get(key).push(f);
    }
    const fmt = (d) => (d ? new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'Date to be confirmed');
    const line = (team, legs, lost, played) =>
      `<div class="line${lost ? ' lose' : ''}">${avatar(team)}<b>${esc(team)}</b><span class="legs${played ? '' : ' tbd'}">${played ? legs : '–'}</span></div>`;
    $('fixtureList').innerHTML = [...days].map(([date, list]) =>
      `<div class="day"><h3>${esc(fmt(date))}</h3><div class="matches">${list.map((f) => {
        const played = f.status === 'played';
        return `<article class="card match"><div class="meta"><span>${esc(f.division)}</span><span class="st ${esc(f.status)}">${esc(played ? 'Full time' : f.status)}</span></div>` +
          line(f.home, f.home_legs, played && f.home_legs < f.away_legs, played) +
          line(f.away, f.away_legs, played && f.away_legs < f.home_legs, played) + '</article>';
      }).join('')}</div></div>`).join('');
  }

  // ---------- clubs ----------
  function renderClubs(seasonId) {
    $('clubs').innerHTML = clubs.map((c, n) => {
      const teams = c.teams.map((t) => {
        const m = t.divisions.find((d) => d.season_id === seasonId) || t.divisions[0];
        return `<div class="team"><span>${esc(t.name)}</span>${m ? `<span class="pill">${esc(m.division)}</span>` : ''}</div>`;
      }).join('');
      return `<article class="card club" style="--n:${n}"><header>${avatar(c.name, c.name, 'lg')}<div><h3>${esc(c.name)}</h3>` +
        `<small>${c.teams.length} ${c.teams.length === 1 ? 'team' : 'teams'}</small></div></header>${teams}</article>`;
    }).join('');
  }

  function renderStats(seasonId) {
    const inSeason = clubs.flatMap((c) => c.teams.map((t) => ({ club: c.name, m: t.divisions.find((d) => d.season_id === seasonId) }))).filter((t) => t.m);
    const teams = inSeason.length || clubs.reduce((n, c) => n + c.teams.length, 0);
    const clubCount = inSeason.length ? new Set(inSeason.map((t) => t.club)).size : clubs.length;
    const divisions = new Set(inSeason.map((t) => t.m.division)).size;
    $('stats').innerHTML = [[teams, 'Teams'], [divisions, 'Divisions'], [clubCount, 'Clubs']]
      .map(([n, label]) => `<div class="stat"><b>${n}</b><span>${label}</span></div>`).join('');
  }

  // ---------- loading ----------
  async function loadSeason(seasonId) {
    seasonId = Number(seasonId);
    const [st, fixtures] = await Promise.all([
      api(`/api/leagues/${slug}/seasons/${seasonId}/standings`),
      api(`/api/leagues/${slug}/seasons/${seasonId}/fixtures`),
    ]);
    const { historical: h, live, season } = st;
    $('tableSkeleton').hidden = true;
    $('seasonDot').className = `dot ${season.status}`;
    $('seasonStatus').textContent = STATUS[season.status] || season.status;
    renderStats(seasonId);

    $('historical').hidden = !h;
    if (h) {
      $('historicalSub').textContent = [season.notes, 'Shown exactly as published, never recalculated.'].filter(Boolean).join(' ');
      callout($('historicalNotice'), 'info', h.complete ? '' :
        'These are the final positions. Played, won, lost, legs and points will appear here once the league uploads the published table.');
      renderDivisions($('historicalTables'), h.divisions, { live: false, showPoints: true });
    }

    $('live').hidden = !live;
    if (live) {
      $('liveSub').textContent = `Worked out from ${live.playedFixtures} played of ${live.totalFixtures} entered fixtures.`;
      callout($('liveNotice'), 'info', live.pointsConfirmed ? '' :
        'The league points system has not been confirmed yet, so no points are shown. The order is provisional: wins, then leg difference.');
      renderDivisions($('liveTables'), live.divisions, { live: true, showPoints: live.pointsConfirmed });
    }

    $('empty').hidden = !!(h || live);
    renderFixtures(fixtures, season);
    renderClubs(seasonId);
  }

  async function loadLeague() {
    [league, clubs] = await Promise.all([api(`/api/leagues/${slug}`), api(`/api/leagues/${slug}/clubs`)]);
    setClubs(clubs);
    applyBranding(league);
    document.title = league.name;
    const sel = $('seasonSelect');
    sel.innerHTML = league.seasons.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    sel.closest('.hero-row').hidden = !league.seasons.length;
    // Default to the season in progress, otherwise the most recent.
    const current = league.seasons.find((s) => s.status === 'active') || league.seasons[0];
    if (current) { sel.value = current.id; await loadSeason(current.id); } else {
      $('tableSkeleton').hidden = true; $('empty').hidden = false; renderStats(0); renderClubs(0);
    }
  }

  function showError(e) { $('tableSkeleton').hidden = true; callout($('error'), 'alert', e.message); }

  try {
    const [config, leagues] = await Promise.all([api('/api/config'), api('/api/leagues')]);
    slug = params.get('league') || config.defaultLeague;
    if (!leagues.some((l) => l.slug === slug)) slug = leagues[0]?.slug;
    const ls = $('leagueSelect');
    ls.innerHTML = leagues.map((l) => `<option value="${esc(l.slug)}">${esc(l.name)}</option>`).join('');
    ls.value = slug;
    ls.hidden = leagues.length < 2; // single-league deployments show no switcher
    ls.onchange = () => { location.search = `?league=${encodeURIComponent(ls.value)}`; };
    $('seasonSelect').onchange = (e) => loadSeason(e.target.value).catch(showError);
    await loadLeague();
  } catch (e) { showError(e); }
})();
