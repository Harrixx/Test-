'use strict';
// Dart-throwing interactions. Purely decorative: nothing here reads or writes league data.
window.Darts = (() => {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const buzz = (ms = 10) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };

  // Drawn along the x-axis with the tip at the left edge, so rotating about the tip aims it.
  const DART_SVG = '<svg viewBox="0 0 84 16" aria-hidden="true">' +
    '<path d="M0 8 19 6.9v2.2z" fill="#dfe5e1"/>' +
    '<rect x="18" y="4.8" width="23" height="6.4" rx="2.2" fill="url(#dartBrass)"/>' +
    '<path d="M22 4.8v6.4M25.5 4.8v6.4M29 4.8v6.4M32.5 4.8v6.4M36 4.8v6.4" stroke="#6b4a0c" stroke-width=".8" opacity=".55"/>' +
    '<rect x="40.5" y="6.9" width="22" height="2.2" rx="1" fill="#c9d1cc"/>' +
    '<path d="M60 8 68 .8h14L76.5 8 82 15.2H68z" fill="#e5383b"/>' +
    '<path d="M62.5 8 69 2.8h8.5L73.5 8z" fill="#ff8f91" opacity=".9"/>' +
    '</svg>';
  const DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="dartBrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe29a"/><stop offset=".5" stop-color="#d9a441"/><stop offset="1" stop-color="#8f6410"/></linearGradient>' +
    '</defs></svg>';

  let layer;
  function getLayer() {
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'dart-layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.innerHTML = DEFS;
      document.body.append(layer);
    }
    return layer;
  }

  // Fly a dart so its tip lands at viewport point (x, y). Resolves with the element once it has landed.
  function fly(x, y, { size = 84, angle = -rand(26, 50) } = {}) {
    getLayer();
    const el = document.createElement('span');
    el.className = 'dart';
    el.innerHTML = DART_SVG;
    el.style.setProperty('--len', `${size}px`);
    el.style.setProperty('--a', `${angle}deg`);
    if (reduced()) return Promise.resolve({ el, angle });
    // Start off-screen along the dart's own axis so it travels point-first.
    const dist = Math.hypot(innerWidth, innerHeight) * 0.8;
    const rad = (angle * Math.PI) / 180;
    el.style.setProperty('--fx', `${dist * Math.cos(rad)}px`);
    el.style.setProperty('--fy', `${dist * Math.sin(rad)}px`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.classList.add('fly');
    layer.append(el);
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve({ el, angle }); } };
      el.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 750); // background tabs may never fire animationend
    });
  }

  function stick(el, container, lx, ly, angle) {
    el.classList.remove('fly');
    el.classList.add('stuck');
    el.style.left = `${lx}px`;
    el.style.top = `${ly}px`;
    el.style.setProperty('--a', `${angle}deg`);
    container.append(el);
  }

  function ripple(container, lx, ly) {
    const r = document.createElement('span');
    r.className = 'dart-ripple';
    r.style.left = `${lx}px`;
    r.style.top = `${ly}px`;
    container.append(r);
    r.addEventListener('animationend', () => r.remove(), { once: true });
    setTimeout(() => r.remove(), 900);
  }

  function retrigger(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // restart the CSS animation
    el.classList.add(cls);
  }

  function fadeOut(el) {
    el.classList.add('gone');
    setTimeout(() => el.remove(), 320);
  }

  // Throw a dart into the middle of `target` (a positioned element), then clear it after `linger` ms.
  async function hit(target, { size = 52, linger = 1100, spread = 3 } = {}) {
    if (!target) return;
    const before = target.getBoundingClientRect();
    const x = before.left + before.width / 2 + rand(-spread, spread);
    const y = before.top + before.height / 2 + rand(-spread, spread);
    const { el, angle } = await fly(x, y, { size });
    const now = target.getBoundingClientRect();
    if (!now.width) { el.remove(); return; } // target hidden while the dart was in the air
    stick(el, target, x - before.left, y - before.top, angle);
    ripple(target, x - before.left, y - before.top);
    retrigger(target, 'hit');
    buzz();
    setTimeout(() => fadeOut(el), linger);
  }

  // ---------- throwable dartboard (hero panel) ----------
  const NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

  // Score for a point in board units (0 = centre, 100 = edge of the board graphic) at `deg` clockwise from the top.
  function score(u, deg) {
    if (u <= 6) return { label: 'BULL', value: 50 };
    if (u <= 14) return { label: '25', value: 25 };
    if (u > 90) return { label: 'Miss', value: 0 };
    const n = NUMBERS[Math.floor((((deg + 9) % 360) + 360) % 360 / 18)];
    if (u >= 82) return { label: `D${n}`, value: n * 2 };
    if (u >= 51 && u <= 57) return { label: `T${n}`, value: n * 3 };
    return { label: String(n), value: n };
  }

  function initBoard(hero) {
    const board = hero?.querySelector('.board');
    if (!board) return;
    const svg = board.querySelector('svg');
    // Numbers round the rim, like a real board.
    svg.insertAdjacentHTML('beforeend', `<g class="nums">${NUMBERS.map((n, i) => {
      const a = (i * 18 * Math.PI) / 180;
      const x = 100 + 94 * Math.sin(a);
      const y = 100 - 94 * Math.cos(a);
      return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" transform="rotate(${i * 18} ${x.toFixed(2)} ${y.toFixed(2)})">${n}</text>`;
    }).join('')}</g>`);

    let thrown = []; // { el, value }
    let total = null;
    let busy = false;

    const geometry = () => {
      const r = board.getBoundingClientRect(); // centre is rotation-proof; size is not, so use offsetWidth
      const rot = parseFloat(getComputedStyle(board).rotate) || 0;
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, half: board.offsetWidth / 2, rot };
    };
    // Viewport point -> board-local vector (undoing the slow spin) and board units from the centre.
    const locate = (x, y) => {
      const g = geometry();
      const dx = x - g.cx;
      const dy = y - g.cy;
      const t = (-g.rot * Math.PI) / 180;
      const lx = dx * Math.cos(t) - dy * Math.sin(t);
      const ly = dx * Math.sin(t) + dy * Math.cos(t);
      return { g, lx, ly, u: (Math.hypot(dx, dy) / g.half) * 100, deg: (Math.atan2(lx, -ly) * 180) / Math.PI };
    };
    const onBoard = (e) => !e.target.closest('.season-pick, a, button, select') && locate(e.clientX, e.clientY).u <= 99;

    function pop(text, x, y, cls = '') {
      const h = hero.getBoundingClientRect();
      const p = document.createElement('span');
      p.className = `score-pop ${cls}`;
      p.textContent = text;
      p.style.left = `${x - h.left}px`;
      p.style.top = `${y - h.top}px`;
      hero.append(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
      setTimeout(() => p.remove(), 1400);
    }

    function clearBoard() {
      thrown.forEach((d) => fadeOut(d.el));
      thrown = [];
      total?.remove();
      total = null;
    }

    async function throwAt(x, y, { demo = false } = {}) {
      if (busy) return;
      busy = true;
      if (thrown.length >= 3 || thrown.some((d) => d.demo)) clearBoard();
      const { el, angle } = await fly(x, y, { size: 78 });
      const { g, lx, ly, u, deg } = locate(x, y);
      // Attach to the spinning board so the dart stays in its segment.
      stick(el, board, g.half + lx, g.half + ly, angle - g.rot);
      ripple(board, g.half + lx, g.half + ly);
      buzz(demo ? 0 : 12);
      const s = score(u, deg);
      thrown.push({ el, value: s.value, demo });
      if (!demo) {
        pop(s.label, x, y, s.value >= 50 ? 'big' : '');
        if (thrown.length === 3) {
          const sum = thrown.reduce((n, d) => n + d.value, 0);
          total = document.createElement('div');
          total.className = 'throw-total';
          total.innerHTML = sum === 180 ? '<b>180!</b><span>One hundred and eighty</span>' : `<b>${sum}</b><span>Three darts</span>`;
          hero.append(total);
          if (sum === 180) buzz(60);
        }
      }
      busy = false;
    }

    hero.addEventListener('click', (e) => { if (onBoard(e)) throwAt(e.clientX, e.clientY); });
    hero.addEventListener('pointermove', (e) => { hero.classList.toggle('aiming', e.pointerType === 'mouse' && onBoard(e)); });
    hero.addEventListener('pointerleave', () => hero.classList.remove('aiming'));

    // One dart on arrival, to show the board can be played. It is not scored.
    if (!reduced()) {
      setTimeout(() => {
        if (hero.offsetParent === null || thrown.length) return;
        const g = geometry();
        const h = hero.getBoundingClientRect();
        // Aim at the bull if it is on screen, otherwise at the visible part of the board.
        const x = Math.min(g.cx + rand(-4, 4), h.right - 30);
        const y = Math.min(Math.max(g.cy + rand(-4, 4), h.top + 30), h.bottom - 30);
        throwAt(x, y, { demo: true });
      }, 900);
    }
  }

  return { hit, initBoard, score };
})();
