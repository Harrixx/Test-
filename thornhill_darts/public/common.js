'use strict';
// Shared helpers for the public site and admin tool.
window.League = (() => {
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (v, signed = false) => (v === null || v === undefined ? null : signed && v > 0 ? `+${v}` : String(v));
  const cell = (v, cls = '', signed = false) => {
    const s = num(v, signed);
    return s === null ? `<td class="na ${cls}" title="Not entered">—</td>` : `<td class="${cls}">${esc(s)}</td>`;
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

  function applyBranding(league) {
    document.documentElement.style.setProperty('--brand', league.branding.primaryColour || '#14532d');
    document.documentElement.style.setProperty('--accent', league.branding.accentColour || '#b91c1c');
    document.querySelectorAll('[data-league-name]').forEach((el) => { el.textContent = league.name; });
    document.querySelectorAll('[data-league-region]').forEach((el) => { el.textContent = league.region || ''; });
  }

  const STATUS = { completed: 'Completed', active: 'In progress', upcoming: 'Upcoming' };

  return { esc, cell, api, applyBranding, STATUS };
})();
