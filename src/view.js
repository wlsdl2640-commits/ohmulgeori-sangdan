/* ───────── 전투 화면 ───────── */
const PXU = 1.6;   // 거리 1 = 화면 1.6px
const V = { cvs: null, ctx: null, off: null, g: null, pid: null, mode: '', lastN: 0, scroll: 0, fx: [], ghosts: [], graves: [], flash: {}, lunge: {}, last: {}, shake: 0 };

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
  const h = { quad: (m.h || 4) + 5, blob: m.h || 8, shroom: 12, bug: 8, tree: 18, biped: 13, flyer: 17, golem: 18 }[m.plan] || 12;
  return h * s;
}
function hpBar(g, x, y, f, col) {
  R(g, x - 6, y, 12, 2, '#1a1410');
  R(g, x - 6, y, Math.max(0, Math.round(12 * Math.max(0, Math.min(1, f)))), 2, col);
}

function drawFrame(now) {
  const t = now / 1000, g = V.g, p = viewParty(), e = p && p.exp;
  const key = (p ? p.id : 0) + ':' + (e ? 'x' : 'h');
  if (key !== V.mode) {
    V.mode = key; V.fx = []; V.ghosts = []; V.graves = []; V.flash = {}; V.lunge = {};
    V.lastN = e ? e.evN : 0; V.scroll = e ? routePos(e) * PXU : 0;
  }
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
  let list = p ? p.members.map(advById).filter(Boolean) : [];
  if (!list.length) list = S.advs.filter(a => a.status === 'idle');
  list.slice(0, 6).forEach((a, i) => {
    const x = 46 + i * 30 + (i >= 2 ? 26 : 0);
    g.save(); g.translate(x, GY); g.scale(i < 2 ? 1 : -1, 1);
    drawAdv(g, a, t, {});
    g.restore();
  });
}

function fieldScene(g, t, p, e) {
  const F = FIELDS[e.field];
  const dir = e.mode === 'return' ? -1 : 1;
  const target = routePos(e) * PXU;
  if (Math.abs(target - V.scroll) > 160) V.scroll = target; else V.scroll += (target - V.scroll) * 0.2;
  drawBg(g, e.area === 'dungeon' ? F.dungeon.bg : F.bg, V.scroll, t);

  const team = p.members.map(advById).filter(Boolean);
  const n = team.length, sp = n > 1 ? Math.min(15, 84 / (n - 1)) : 0;
  const front = dir > 0 ? 104 : 136;
  const fighting = e.foes.length > 0;
  const foes = fighting ? e.foes : (e.next || []);
  const gap = !fighting && e.encs[e.ei] != null ? Math.abs(e.encs[e.ei] - e.pos) * PXU : 0;
  const pos = {};
  team.forEach((a, i) => { pos['a' + a.id] = Math.round(front - dir * i * sp); });
  let acc = 20 + gap;
  foes.forEach(f => { const big = Math.max(1, Math.round(MONS[f.id].scale || 1)); pos['f' + f.uid] = Math.round(front + dir * (acc + (big - 1) * 8)); acc += 15 + (big - 1) * 14; });
  Object.assign(V.last, pos);
  events(e, pos, dir, t);

  // 쓰러진 적의 잔상
  V.ghosts = V.ghosts.filter(gh => t - gh.t0 < 0.45);
  V.ghosts.forEach(gh => { if (Math.floor((t - gh.t0) * 20) % 2) return; g.save(); g.translate(gh.x, GY); g.scale(-dir, 1); FLASH = '#e9e2d0'; drawMon(g, gh.id, t); FLASH = null; g.restore(); });
  // 묘비
  V.graves = V.graves.filter(gv => t - gv.t0 < 5);
  V.graves.forEach(gv => { R(g, gv.x - 1, GY - 9, 2, 9, '#c9c3b8'); R(g, gv.x - 3, GY - 7, 6, 2, '#c9c3b8'); });

  foes.forEach((f, i) => {
    const x = pos['f' + f.uid];
    if (x < -40 || x > VW + 40) return;
    const lg = (V.lunge['f' + f.uid] || 0) > t ? -dir * 4 : 0;
    g.save(); g.translate(x + lg, GY); g.scale(-dir, 1);
    FLASH = (V.flash['f' + f.uid] || 0) > t ? '#ffffff' : null;
    drawMon(g, f.id, t, { ph: i * 0.37 });
    FLASH = null; g.restore();
    if (fighting) hpBar(g, x, GY - monH(f.id) - 5, f.hp / f.maxHp, f.boss ? '#f0b43c' : '#e0503f');
  });
  team.forEach((a, i) => {
    const lunging = (V.lunge['a' + a.id] || 0) > t;
    const x = pos['a' + a.id] + (lunging && CLASSES[a.cls].act === 'melee' ? dir * 4 : 0);
    g.save(); g.translate(x, GY); g.scale(dir, 1);
    FLASH = (V.flash['a' + a.id] || 0) > t ? '#ffffff' : null;
    drawAdv(g, a, t, { walk: !fighting, ph: i * 0.5, atk: lunging });
    FLASH = null; g.restore();
    const f = a.hp / a.maxHp;
    hpBar(g, x, GY - 23, f, f < 0.35 ? '#e0503f' : '#7bd36a');
  });
  fx(g, t);
}

function events(e, pos, dir, t) {
  const at = k => pos[k] != null ? pos[k] : V.last[k];
  for (const x of e.ev) {
    if (x.n <= V.lastN) continue;
    V.lastN = x.n;
    if (x.type === 'hit') {
      const ax = at('a' + x.s), fx0 = at('f' + x.d);
      if (ax == null || fx0 == null) continue;
      V.lunge['a' + x.s] = t + 0.14;
      const delay = x.k === 'melee' ? 0 : 0.18;
      if (x.k === 'arrow') V.fx.push({ k: 'proj', x0: ax + dir * 5, y0: GY - 11, x1: fx0, y1: GY - 7, t0: t, d: 0.18, c: '#e8e2d0' });
      if (x.k === 'magic') V.fx.push({ k: 'orb', x0: ax + dir * 5, y0: GY - 17, x1: fx0, y1: GY - 8, t0: t, d: 0.22, c: '#b48aff' });
      V.flash['f' + x.d] = t + delay + 0.09;
      V.fx.push({ k: 'num', x: fx0, y: GY - 26, s: String(x.v), c: x.c ? '#f7e04a' : '#ffffff', t0: t + delay, d: 0.7 });
    } else if (x.type === 'hurt') {
      const ax = at('a' + x.d);
      if (ax == null) continue;
      V.lunge['f' + x.s] = t + 0.14;
      V.flash['a' + x.d] = t + 0.1;
      V.fx.push({ k: 'num', x: ax, y: GY - 30, s: String(x.v), c: '#ff6a5a', t0: t, d: 0.7 });
    } else if (x.type === 'heal' || x.type === 'pot') {
      const ax = at('a' + x.d);
      if (ax == null) continue;
      V.fx.push({ k: 'num', x: ax, y: GY - 30, s: '+' + x.v, c: '#7bd36a', t0: t, d: 0.8 });
      V.fx.push({ k: 'spark', x: ax, y: GY - 12, t0: t, d: 0.5, c: x.type === 'pot' ? '#ff7a8a' : '#c8ffb0' });
    } else if (x.type === 'kill') {
      const fx0 = at('f' + x.d);
      if (fx0 != null) V.ghosts.push({ id: x.id, x: fx0, t0: t });
    } else if (x.type === 'loot') {
      const fx0 = V.ghosts.length ? V.ghosts[V.ghosts.length - 1].x : VW / 2;
      V.fx.push({ k: 'icon', id: x.id, x: fx0, y: GY - 14, t0: t, d: 0.9 });
    } else if (x.type === 'die') {
      const ax = at('a' + x.d);
      if (ax != null) V.graves.push({ x: ax, t0: t });
      V.shake = 4;
    } else if (x.type === 'lvl') {
      const ax = at('a' + x.d);
      if (ax != null) V.fx.push({ k: 'num', x: ax, y: GY - 38, s: 'LV UP', c: '#f0b43c', t0: t, d: 1.2 });
    } else if (x.type === 'spawn' && x.boss) V.shake = 6;
  }
}

function fx(g, t) {
  V.fx = V.fx.filter(f => t - f.t0 < f.d);
  for (const f of V.fx) {
    const k = (t - f.t0) / f.d;
    if (k < 0) continue;
    if (f.k === 'num') drawNum(g, f.x, Math.round(f.y - k * 10), f.s, f.c);
    else if (f.k === 'proj') { const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k; R(g, Math.round(x) - 2, Math.round(y), 5, 1, f.c); }
    else if (f.k === 'orb') { const x = Math.round(f.x0 + (f.x1 - f.x0) * k), y = Math.round(f.y0 + (f.y1 - f.y0) * k); R(g, x - 1, y - 1, 3, 3, f.c); R(g, x, y, 1, 1, '#ffffff'); }
    else if (f.k === 'spark') { for (let i = 0; i < 4; i++) { const a = i * 1.57 + k * 3; R(g, Math.round(f.x + Math.cos(a) * (3 + k * 6)), Math.round(f.y + Math.sin(a) * (3 + k * 6) - k * 6), 1, 1, f.c); } }
    else if (f.k === 'icon') drawIcon(g, f.id, Math.round(f.x - 5), Math.round(f.y - k * 18));
  }
}
