'use strict';
// Shared helpers for the league site and the admin tool.
window.League = (() => {
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (v, signed = false) => (v === null || v === undefined ? null : signed && v > 0 ? `+${v}` : String(v));
  // Table cell for admin previews; null means "not entered", never zero.
  const cell = (v, cls = '', signed = false) => {
    const s = num(v, signed);
    return s === null ? `<td class="na ${cls}" title="Not entered">–</td>` : `<td class="${cls}">${esc(s)}</td>`;
  };

  async function api(path, opts = {}) {
    const res = await fetch(path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      err.status = res.status;
      err.details = data;
      throw err;
    }
    return data;
  }

  const ICONS = {
    table: '<path d="M3 20h18M5 20v-6h4v6M10 20V7h4v13M15 20v-9h4v9"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 4 3 19h18L12 4z"/><path d="M12 10v4M12 17h.01"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.9c1.7.8 2.7 2.5 3 5.1"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5-1-1.8-1-3 0-1.1.9-2 2-2h2.5A3.5 3.5 0 0 0 21 10.5C21 6.4 17 3 12 3z"/><path d="M7.5 12h.01M9.5 8h.01M14 7h.01"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l4-4-4-4M14 12H4"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  };
  const icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  // Club colours: each club in the league gets its own colour, shared by its
  // A/B teams so they read as the same pub at a glance. Purely decorative.
  const PALETTE = ['#d1453b', '#2b9361', '#3b6fe0', '#c98a12', '#8a4fc7', '#0f8f95', '#d2609a', '#5b6b7a', '#b5651d', '#4d8f2f'];
  const clubColour = new Map();
  const teamClub = new Map();
  function setClubs(clubs) {
    clubColour.clear(); teamClub.clear();
    clubs.forEach((c, i) => {
      clubColour.set(c.name, PALETTE[i % PALETTE.length]);
      c.teams.forEach((t) => teamClub.set(t.name, c.name));
    });
  }
  function monogram(name) {
    const words = String(name).replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0]).toUpperCase();
  }
  function avatar(team, club, cls = '') {
    const c = club || teamClub.get(team) || team;
    const suffix = team && team !== c && team.startsWith(`${c} `) ? team.slice(c.length + 1) : '';
    return `<span class="avatar ${cls}" style="--c:${clubColour.get(c) || '#5b6b7a'}" aria-hidden="true">${esc(monogram(c))}` +
      `${suffix && suffix.length <= 2 ? `<i>${esc(suffix)}</i>` : ''}</span>`;
  }

  function applyBranding(league) {
    const root = document.documentElement.style;
    root.setProperty('--brand', league.branding.primaryColour || '#14532d');
    root.setProperty('--accent', league.branding.accentColour || '#b91c1c');
    document.querySelectorAll('[data-league-name]').forEach((el) => { el.textContent = league.name; });
    document.querySelectorAll('[data-league-region]').forEach((el) => { el.textContent = league.region || ''; });
  }

  function syncThemeColour() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  }
  function initChrome() {
    document.querySelectorAll('[data-icon]').forEach((el) => { el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)); });
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.innerHTML = icon('sun', 'i-sun') + icon('moon', 'i-moon');
      toggle.onclick = () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch { /* private mode */ }
        syncThemeColour();
      };
    }
    syncThemeColour();
    const bar = document.querySelector('.appbar');
    if (bar) {
      const onScroll = () => bar.classList.toggle('scrolled', scrollY > 4);
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  const STATUS = { completed: 'Completed', active: 'In progress', upcoming: 'Upcoming' };

  return { esc, cell, api, icon, avatar, setClubs, monogram, applyBranding, initChrome, STATUS };
})();
