'use strict';
(async () => {
  const { esc, cell, api, applyBranding, STATUS } = window.League;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let slug;

  function table(rows, { live, showPoints }) {
    const head = `<tr><th>#</th><th class="l">Team</th><th title="Played">P</th><th title="Won">W</th>${live ? '<th title="Drawn">D</th>' : ''}` +
      `<th title="Lost">L</th><th title="Legs for">LF</th><th title="Legs against">LA</th><th title="Leg difference">+/−</th>` +
      `${showPoints ? '<th title="League points">Pts</th>' : ''}</tr>`;
    const body = rows.map((r) =>
      `<tr>${cell(r.position, 'pos')}<td class="l team">${esc(r.team)}</td>${cell(r.played)}${cell(r.won)}${live ? cell(r.drawn) : ''}` +
      `${cell(r.lost)}${cell(r.legs_for)}${cell(r.legs_against)}${cell(r.leg_difference, '', true)}${showPoints ? cell(r.points, 'pts') : ''}</tr>`).join('');
    return `<div class="table-scroll"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  }

  async function loadSeason(seasonId) {
    const [st, fixtures] = await Promise.all([
      api(`/api/leagues/${slug}/seasons/${seasonId}/standings`),
      api(`/api/leagues/${slug}/seasons/${seasonId}/fixtures`),
    ]);
    const { historical: h, live, season } = st;

    $('historical').hidden = !h;
    if (h) {
      $('historicalSub').textContent = [season.notes, 'Shown exactly as published — not recalculated.'].filter(Boolean).join(' ');
      $('historicalNotice').hidden = h.complete;
      $('historicalNotice').textContent = h.complete ? '' :
        'Final positions are shown as published. Figures marked — (played, won, lost, legs and points) have not been entered yet; they will appear once the league administrator uploads the published table.';
      $('historicalTables').innerHTML = h.divisions.map((d) => `<div><h3>${esc(d.name)}</h3>${table(d.rows, { live: false, showPoints: true })}</div>`).join('');
    }

    $('live').hidden = !live;
    if (live) {
      $('liveSub').textContent = `Calculated from ${live.playedFixtures} played of ${live.totalFixtures} entered fixtures.`;
      $('liveNotice').hidden = live.pointsConfirmed;
      $('liveNotice').textContent = live.pointsConfirmed ? '' :
        'The league points system has not been confirmed yet, so no points are shown. Order is provisional (wins, then leg difference).';
      $('liveTables').innerHTML = live.divisions.map((d) => `<div><h3>${esc(d.name)}</h3>${table(d.rows, { live: true, showPoints: live.pointsConfirmed })}</div>`).join('');
    }

    $('fixtures').hidden = !fixtures.length;
    $('fixtureRows').innerHTML = fixtures.map((f) => {
      const score = f.status === 'played' ? `${f.home_legs} – ${f.away_legs}` : 'v';
      const date = f.match_date ? new Date(`${f.match_date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'TBC';
      return `<tr><td class="l">${esc(date)}</td><td class="l">${esc(f.division)}</td><td class="l team">${esc(f.home)}</td>` +
        `<td style="text-align:center">${esc(score)}</td><td class="l team">${esc(f.away)}</td><td class="l muted">${esc(f.status)}</td></tr>`;
    }).join('');

    $('empty').hidden = !!(h || live || fixtures.length);
  }

  async function loadLeague() {
    const league = await api(`/api/leagues/${slug}`);
    applyBranding(league);
    document.title = league.name;
    const sel = $('seasonSelect');
    sel.innerHTML = league.seasons.map((s) => `<option value="${s.id}">${esc(s.name)} — ${esc(STATUS[s.status] || s.status)}</option>`).join('');
    sel.hidden = !league.seasons.length;
    // Default to the season in progress, otherwise the most recent.
    const current = league.seasons.find((s) => s.status === 'active') || league.seasons[0];
    if (current) { sel.value = current.id; await loadSeason(current.id); } else $('empty').hidden = false;

    const clubs = await api(`/api/leagues/${slug}/clubs`);
    $('clubs').innerHTML = clubs.map((c) =>
      `<div class="club"><strong>${esc(c.name)}</strong>${c.teams.map((t) =>
        `<div class="t"><span>${esc(t.name)}</span><span>${esc(t.divisions[0]?.division || '')}</span></div>`).join('')}</div>`).join('');
  }

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

  function showError(e) { $('error').hidden = false; $('error').textContent = e.message; }
})();
