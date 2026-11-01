/* ───────── 전투 화면 ───────── */
const PXU = 1.6;   // 거리 1 = 화면 1.6px
const V = { cvs: null, ctx: null, off: null, g: null, mode: '', lastN: 0, lastF: 0, scroll: 0, fx: [], ghosts: [], graves: [], flash: {}, lunge: {}, last: {}, shake: 0 };

function initView(canvas) {
  V.cvs = canvas;
  V.ctx = canvas.getContext('2d');
  [V.off, V.g] = mkCanvas(VW, VH);
  sizeView();
  window.addEventListener('resize', sizeView);
}
function sizeView() {
  const r = V.cvs.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  V.cvs.width = Math.max(VW, Math.round(r.width * dpr));
  V.cvs.height = Math.max(VH, Math.round(r.height * dpr));
  V.ctx.imageSmoothingEnabled = false;
}
const viewParty = () => (S && (S.parties.find(p => p.id === S.view) || S.parties[0])) || null;
function routePos(e) { return ((e.area === 'dungeon' ? 10 + e.stage : e.stage) - 1) * STAGE_LEN + e.pos; }
function monH(id) {
  const m = MONS[id], s = Math.max(1, Math.round(m.scale || 1));
  const h = m.plan === 'quad' ? (m.h || 4) + 5 : m.plan === 'blob' ? (m.nose ? 13 : m.h || 8) : m.plan === 'bug' ? (m.tail ? 15 : 8)
    : m.plan === 'flyer' ? (m.big ? 24 : 17) : m.plan === 'golem' ? (m.small ? 16 : 18) : m.plan === 'worm' ? 23 : m.plan === 'ghost' ? (m.crown ? 21 : 17)
    : { shroom: 12, tree: 18, biped: 14 }[m.plan] || 12;
  return h * s;
}
function monW(id) {
  const m = MONS[id], s = Math.max(1, Math.round(m.scale || 1));
  const w = m.plan === 'quad' ? (m.len || 8) + 3 : m.plan === 'flyer' ? (m.big ? 20 : 15) : m.plan === 'worm' ? 14 : m.plan === 'tree' ? 13 : m.plan === 'golem' && !m.small ? 16 : m.plan === 'bug' && m.tail ? 15 : 11;
  return w * s;
}
function hpBar(g, x, y, f, col) {
  R(g, x - 6, y, 12, 2, '#1a1410');
  R(g, x - 6, y, Math.max(0, Math.round(12 * Math.max(0, Math.min(1, f)))), 2, col);
}
// 스킬 이름은 글자로 띄운다 (화면 위 DOM)
function callout(x, y, text, cls) {
  const box = $('callouts');
  if (!box || document.hidden) return;
  while (box.children.length >= 5) box.firstChild.remove();
  const xp = Math.max(9, Math.min(91, x / VW * 100));
  // 가까이 떠 있는 글씨가 있으면 그 위로 쌓는다
  const near = [...box.children].filter(c => Math.abs(+c.dataset.x - xp) < 17).length;
  const s = document.createElement('span');
  s.className = 'call ' + (cls || '');
  s.textContent = text;
  s.dataset.x = xp;
  s.style.left = xp + '%';
  s.style.top = Math.max(14, y / VH * 100 - near * 9) + '%';
  box.append(s);
  setTimeout(() => s.remove(), 1150);
}

function drawFrame(now) {
  const t = now / 1000, g = V.g, p = viewParty(), e = p && p.exp;
  const key = (p ? p.id : 0) + ':' + (e ? 'x' : 'h');
  // 화면을 바꿨거나 오래 멈췄다 돌아오면 밀린 효과는 건너뛴다
  if (key !== V.mode || now - V.lastF > 1000) {
    if (key !== V.mode) { V.fx = []; V.ghosts = []; V.graves = []; V.flash = {}; V.lunge = {}; V.scroll = e ? routePos(e) * PXU : 0; const cb = $('callouts'); if (cb) cb.textContent = ''; }
    V.mode = key; V.lastN = e ? e.evN : 0;
  }
  V.lastF = now;
  if (e) fieldScene(g, t, p, e); else townScene(g, t, p);
  const c = V.ctx;
  c.imageSmoothingEnabled = false;
  const sx = V.shake > 0 ? Math.round((Math.random() - 0.5) * V.shake) * (V.cvs.width / VW) : 0;
  if (sx) { c.fillStyle = '#000'; c.fillRect(0, 0, V.cvs.width, V.cvs.height); }
  c.drawImage(V.off, 0, 0, VW, VH, sx, 0, V.cvs.width, V.cvs.height);
  V.shake = Math.max(0, V.shake - 0.4);
}

function townScene(g, t, p) {
  drawBg(g, 'town', 0, t);
  let list = p ? teamOf(p) : [];
  if (!list.length) list = S.advs.filter(a => a.status === 'idle');
  list.slice(0, 6).forEach((a, i) => {
    const x = 46 + i * 30 + (i >= 2 ? 26 : 0);
    g.save(); g.translate(x, GY); g.scale(i < 2 ? 1 : -1, 1);
    drawAdv(g, a, t, {});
    g.restore();
  });
}

const BUFF_C = { atk: '#ff8a4a', def: '#7ab8ff', eva: '#e8e2d0' };
function fieldScene(g, t, p, e) {
  const F = FIELDS[e.field];
  const dir = e.mode === 'return' ? -1 : 1;
  const target = routePos(e) * PXU;
  if (Math.abs(target - V.scroll) > 160) V.scroll = target; else V.scroll += (target - V.scroll) * 0.2;
  drawBg(g, e.area === 'dungeon' ? F.dungeon.bg : F.bg, V.scroll, t);

  const team = teamOf(p);
  const n = team.length, sp = n > 1 ? Math.min(15, 84 / (n - 1)) : 0;
  const front = dir > 0 ? 104 : 136;
  const fighting = e.foes.length > 0;
  const foes = fighting ? e.foes : (e.next || []);
  const gap = !fighting && e.encs[e.ei] != null ? Math.abs(e.encs[e.ei] - e.pos) * PXU : 0;
  const pos = {};
  team.forEach((a, i) => { pos['a' + a.id] = Math.round(front - dir * i * sp); });
  let acc = 16 + gap;
  foes.forEach(f => { const w = monW(f.id); pos['f' + f.uid] = Math.round(front + dir * (acc + w / 2)); acc += w + 4; });
  Object.assign(V.last, pos);
  events(e, pos, dir, t, team);

  // 쓰러진 적의 잔상
  V.ghosts = V.ghosts.filter(gh => t - gh.t0 < 0.45);
  V.ghosts.forEach(gh => { if (Math.floor((t - gh.t0) * 20) % 2) return; g.save(); g.translate(gh.x, GY); g.scale(-dir, 1); FLASH = '#e9e2d0'; drawMon(g, gh.id, t); FLASH = null; g.restore(); });
  // 묘비
  V.graves = V.graves.filter(gv => t - gv.t0 < 5);
  V.graves.forEach(gv => { R(g, gv.x - 1, GY - 9, 2, 9, '#c9c3b8'); R(g, gv.x - 3, GY - 7, 6, 2, '#c9c3b8'); });

  foes.forEach((f, i) => {
    const x = pos['f' + f.uid];
    if (x < -60 || x > VW + 60) return;
    const lg = (V.lunge['f' + f.uid] || 0) > t ? -dir * 4 : 0;
    g.save(); g.translate(x + lg, GY); g.scale(-dir, 1);
    FLASH = (V.flash['f' + f.uid] || 0) > t ? '#ffffff' : null;
    drawMon(g, f.id, t, { ph: i * 0.37 });
    FLASH = null; g.restore();
    if (fighting) {
      const y = GY - monH(f.id) - 5;
      hpBar(g, x, y, f.hp / f.maxHp, f.boss ? '#f0b43c' : '#e0503f');
      if (f.dot) R(g, x - 9, y, 2, 2, '#7ad83c');
      if (f.slow > 0) R(g, x + 7, y, 2, 2, '#8ad8ff');
    }
  });
  team.forEach((a, i) => {
    const lunging = (V.lunge['a' + a.id] || 0) > t;
    const x = pos['a' + a.id] + (lunging && CLASSES[a.cls].act === 'melee' ? dir * 4 : 0);
    const bf = e.buffs.find(b => b.to === a.id || b.to === 'party');
    if (bf) R(g, x - 4, GY, 9, 1, BUFF_C[bf.stat] || '#e8e2d0');
    g.save(); g.translate(x, GY); g.scale(dir, 1);
    FLASH = (V.flash['a' + a.id] || 0) > t ? '#ffffff' : null;
    drawAdv(g, a, t, { walk: !fighting, ph: i * 0.5, atk: lunging });
    FLASH = null; g.restore();
    const d = derive(a), f = a.hp / d.maxHp;
    hpBar(g, x, GY - 24, f, f < 0.35 ? '#e0503f' : '#7bd36a');
    R(g, x - 6, GY - 22, 12, 1, '#10141c');
    R(g, x - 6, GY - 22, Math.max(0, Math.round(12 * Math.min(1, a.mp / Math.max(1, d.maxMp)))), 1, '#5aa0ff');
    if (e.taunt && e.taunt.aid === a.id) drawNum(g, x, GY - 31, '!', '#ff5a4a');
  });
  fx(g, t);
}

const PROJ = {
  arrow: { d: 0.18 }, magic: { d: 0.22 }, fire: { d: 0.22 }, ice: { d: 0.2 }, bolt: { d: 0.05 }, holy: { d: 0.08 }
};
const SKILL_CLS = { heal: 'heal', buff: 'buff', taunt: 'buff', mdmg: 'magic', dot: 'dot' };
function events(e, pos, dir, t, team) {
  const at = k => (pos[k] != null ? pos[k] : V.last[k]);
  for (const x of e.ev) {
    if (x.n <= V.lastN) continue;
    V.lastN = x.n;
    if (x.type === 'hit') {
      const fx0 = at('f' + x.d);
      if (fx0 == null) continue;
      if (x.k === 'poison') { V.fx.push({ k: 'num', x: fx0, y: GY - 26, s: String(x.v), c: '#9ae86a', t0: t, d: 0.7 }); continue; }
      const ax = at('a' + x.s);
      if (ax == null) continue;
      V.lunge['a' + x.s] = t + 0.14;
      const P = PROJ[x.k], delay = P ? P.d : 0;
      if (x.k === 'arrow') V.fx.push({ k: 'proj', x0: ax + dir * 5, y0: GY - 11, x1: fx0, y1: GY - 7, t0: t, d: 0.18, c: x.dot ? '#7ad83c' : '#e8e2d0' });
      if (x.k === 'magic') V.fx.push({ k: 'orb', x0: ax + dir * 5, y0: GY - 17, x1: fx0, y1: GY - 8, t0: t, d: 0.22, c: '#b48aff', c2: '#ffffff' });
      if (x.k === 'fire') V.fx.push({ k: 'orb', x0: ax + dir * 5, y0: GY - 17, x1: fx0, y1: GY - 8, t0: t, d: 0.22, c: '#ff7a2a', c2: '#ffe08a', big: 1 });
      if (x.k === 'ice') V.fx.push({ k: 'proj', x0: ax + dir * 5, y0: GY - 15, x1: fx0, y1: GY - 8, t0: t, d: 0.2, c: '#8ad8ff', tip: '#ffffff' });
      if (x.k === 'bolt') V.fx.push({ k: 'bolt', x0: ax + dir * 4, x1: fx0, t0: t, d: 0.16 });
      if (x.k === 'holy') V.fx.push({ k: 'beam', x: fx0, t0: t, d: 0.3 });
      V.flash['f' + x.d] = t + delay + 0.09;
      if (x.dot) V.fx.push({ k: 'spark', x: fx0, y: GY - 10, t0: t + delay, d: 0.5, c: '#7ad83c' });
      else V.fx.push({ k: 'num', x: fx0, y: GY - 26, s: String(x.v), c: x.c ? '#f7e04a' : '#ffffff', t0: t + delay, d: 0.7 });
    } else if (x.type === 'fmiss') {
      const fx0 = at('f' + x.d);
      V.lunge['a' + x.s] = t + 0.14;
      if (fx0 != null) V.fx.push({ k: 'num', x: fx0 + 2, y: GY - 34, s: 'MISS', c: '#a9b0bd', t0: t, d: 0.6 });
    } else if (x.type === 'hurt') {
      const ax = at('a' + x.d);
      if (ax == null) continue;
      V.lunge['f' + x.s] = t + 0.14;
      V.flash['a' + x.d] = t + 0.1;
      V.fx.push({ k: 'num', x: ax, y: GY - 31, s: String(x.v), c: x.c ? '#ff9a3a' : '#ff6a5a', t0: t, d: 0.7 });
    } else if (x.type === 'miss') {
      const ax = at('a' + x.d);
      V.lunge['f' + x.s] = t + 0.14;
      if (ax != null) V.fx.push({ k: 'num', x: ax + 2, y: GY - 38, s: 'MISS', c: '#cfe8ff', t0: t, d: 0.6 });
    } else if (x.type === 'aoe') {
      V.lunge['f' + x.s] = t + 0.25;
      V.shake = Math.max(V.shake, 3);
      const fx0 = at('f' + x.s);
      if (fx0 != null) V.fx.push({ k: 'wave', x: fx0, t0: t, d: 0.35, dir });
    } else if (x.type === 'heal' || x.type === 'pot' || x.type === 'mana') {
      const ax = at('a' + x.d);
      if (ax == null) continue;
      const blue = x.type === 'mana';
      V.fx.push({ k: 'num', x: ax, y: GY - 31, s: '+' + x.v, c: blue ? '#7ab8ff' : '#7bd36a', t0: t, d: 0.8 });
      V.fx.push({ k: 'spark', x: ax, y: GY - 12, t0: t, d: 0.5, c: x.type === 'pot' ? '#ff7a8a' : blue ? '#8ac8ff' : '#c8ffb0' });
    } else if (x.type === 'skill') {
      const ax = at('a' + x.s), s = SKILLS[x.id];
      if (ax != null && s) callout(ax, GY - 33, s.name, SKILL_CLS[s.kind] || '');
    } else if (x.type === 'buff') {
      const s = SKILLS[x.id], col = s && s.kind === 'taunt' ? '#ff5a4a' : BUFF_C[s && s.stat] || '#e8e2d0';
      const list = x.party ? team.map(a => a.id) : [x.s];
      list.forEach(id => { const ax = at('a' + id); if (ax != null) V.fx.push({ k: 'spark', x: ax, y: GY - 10, t0: t, d: 0.6, c: col }); });
    } else if (x.type === 'kill') {
      const fx0 = at('f' + x.d);
      if (fx0 != null) V.ghosts.push({ id: x.id, x: fx0, t0: t });
    } else if (x.type === 'loot' || x.type === 'gear') {
      const fx0 = V.ghosts.length ? V.ghosts[V.ghosts.length - 1].x : VW / 2;
      V.fx.push({ k: 'icon', id: x.type === 'gear' ? { icon: GTYPES[x.base].icon, c: TIER_COLORS[x.t] } : x.id, x: fx0 + (x.type === 'gear' ? 6 : 0), y: GY - 14, t0: t, d: x.type === 'gear' ? 1.4 : 0.9 });
    } else if (x.type === 'die') {
      const ax = at('a' + x.d);
      if (ax != null) V.graves.push({ x: ax, t0: t });
      V.shake = 4;
    } else if (x.type === 'lvl') {
      const ax = at('a' + x.d);
      if (ax != null) V.fx.push({ k: 'num', x: ax, y: GY - 40, s: 'LV UP', c: '#f0b43c', t0: t, d: 1.2 });
    } else if (x.type === 'spawn' && x.boss) V.shake = 6;
    else if (x.type === 'enter') V.shake = 3;
  }
}

function fx(g, t) {
  V.fx = V.fx.filter(f => t - f.t0 < f.d);
  for (const f of V.fx) {
    const k = (t - f.t0) / f.d;
    if (k < 0) continue;
    if (f.k === 'num') drawNum(g, f.x, Math.round(f.y - k * 10), f.s, f.c);
    else if (f.k === 'proj') {
      const x = Math.round(f.x0 + (f.x1 - f.x0) * k), y = Math.round(f.y0 + (f.y1 - f.y0) * k), s = Math.sign(f.x1 - f.x0) || 1;
      R(g, x - 2, y, 5, 1, f.c);
      if (f.tip) R(g, x + s * 3, y, 1, 1, f.tip);
    } else if (f.k === 'orb') {
      const x = Math.round(f.x0 + (f.x1 - f.x0) * k), y = Math.round(f.y0 + (f.y1 - f.y0) * k), s = Math.sign(f.x1 - f.x0) || 1;
      if (f.big) { R(g, x - 2, y - 2, 5, 5, f.c); R(g, x - s * 4, y, 2, 1, f.c); }
      else R(g, x - 1, y - 1, 3, 3, f.c);
      R(g, x, y, 1, 1, f.c2);
    } else if (f.k === 'bolt') {
      const n = 5, y0 = GY - 16;
      let px = f.x0, py = y0;
      for (let i = 1; i <= n; i++) {
        const nx = Math.round(f.x0 + (f.x1 - f.x0) * i / n), ny = Math.round(y0 + (i === n ? 8 : (Math.random() - 0.5) * 8));
        const sx = Math.min(px, nx), w = Math.abs(nx - px) + 1;
        R(g, sx, Math.min(py, ny), w, 1, '#fff8a0');
        R(g, nx, Math.min(py, ny), 1, Math.abs(ny - py) + 1, '#f7e04a');
        px = nx; py = ny;
      }
    } else if (f.k === 'beam') {
      const h = Math.round(GY * Math.min(1, k * 3));
      R(g, f.x - 2, GY - h, 5, h, '#f0d870'); R(g, f.x - 1, GY - h, 3, h, '#fff8d0');
    } else if (f.k === 'wave') {
      const r = Math.round(6 + k * 40);
      R(g, f.x - f.dir * r, GY - 3, 3, 3, '#e0503f'); R(g, f.x - f.dir * (r + 6), GY - 2, 2, 2, '#ff9a7a');
    } else if (f.k === 'spark') {
      for (let i = 0; i < 4; i++) { const a = i * 1.57 + k * 3; R(g, Math.round(f.x + Math.cos(a) * (3 + k * 6)), Math.round(f.y + Math.sin(a) * (3 + k * 6) - k * 6), 1, 1, f.c); }
    } else if (f.k === 'icon') drawIcon(g, f.id, Math.round(f.x - 5), Math.round(f.y - k * 18));
  }
}
