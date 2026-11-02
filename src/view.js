/* ───────── 전투 화면 ───────── */
const PXU = 1.6;   // 거리 1 = 화면 1.6px
const V = { cvs: null, ctx: null, off: null, g: null, wc: null, w: null, lc: null, l: null, mode: '', lastN: 0, lastF: 0, scroll: 0,
  fx: [], ghosts: [], flash: {}, lunge: {}, atk: {}, jump: {}, last: {}, shake: 0 };

function initView(canvas) {
  V.cvs = canvas;
  V.ctx = canvas.getContext('2d');
  [V.off, V.g] = mkCanvas(VW, VH);
  [V.wc, V.w] = mkCanvas(VW, VH);
  [V.lc, V.l] = mkCanvas(VW, VH);
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
function routePos(e) { return ((e.area === 'dungeon' ? FIELD_STAGES + e.stage : e.stage) - 1) * STAGE_LEN + e.pos; }
function hpBar(g, x, y, f, col) {
  R(g, x - 6, y, 12, 2, '#1a1410');
  R(g, x - 6, y, Math.max(0, Math.round(12 * Math.max(0, Math.min(1, f)))), 2, col);
}
const shadow = (g, x, w) => { R(g, Math.round(x - w / 2), GY, Math.round(w), 1, 'rgba(0,0,0,0.26)'); R(g, Math.round(x - w / 3), GY + 1, Math.round(w * 2 / 3), 1, 'rgba(0,0,0,0.16)'); };
// 스킬 이름은 글자로 띄운다 (화면 위 DOM)
function callout(x, y, text, cls) {
  const box = $('callouts');
  if (!box || document.hidden) return;
  while (box.children.length >= 5) box.firstChild.remove();
  const xp = Math.max(9, Math.min(91, x / VW * 100));
  // 가까이 떠 있는 글씨가 있으면 그 위로 쌓는다
  const near = cls === 'boss' ? 0 : [...box.children].filter(c => !c.classList.contains('boss') && Math.abs(+c.dataset.x - xp) < 17).length;
  const s = document.createElement('span');
  s.className = 'call ' + (cls || '');
  s.textContent = text;
  s.dataset.x = xp;
  s.style.left = xp + '%';
  s.style.top = cls === 'boss' ? '13%' : Math.max(24, y / VH * 100 - near * 9) + '%';
  const k = Math.min(2.5, (S && S.speed) || 1), dur = cls === 'boss' ? 2.3 : 1.1;   // 빠르게 흐를 때는 글씨도 빨리 사라진다
  if (k > 1 || cls === 'boss') s.style.animationDuration = (dur / k).toFixed(2) + 's';
  box.append(s);
  setTimeout(() => s.remove(), dur * 1050 / k);
}

function drawFrame(now, vt) {
  const t = vt != null ? vt : now / 1000, p = viewParty(), e = p && p.exp;
  const key = (p ? p.id : 0) + ':' + (e ? 'x' : 'h');
  // 화면을 바꿨거나 오래 멈췄다 돌아오면 밀린 효과는 건너뛴다
  if (key !== V.mode || now - V.lastF > 1000) {
    if (key !== V.mode) { V.fx = []; V.ghosts = []; V.flash = {}; V.lunge = {}; V.atk = {}; V.jump = {}; V.scroll = e ? routePos(e) * PXU : 0; const cb = $('callouts'); if (cb) cb.textContent = ''; }
    V.mode = key; V.lastN = e ? e.evN : 0;
  }
  V.lastF = now;
  const g = V.g, w = V.w, dp = clockDp();
  const id = e ? (e.area === 'dungeon' ? FIELDS[e.field].dungeon.bg : FIELDS[e.field].bg) : 'town';
  if (e) { const target = routePos(e) * PXU; if (Math.abs(target - V.scroll) > 160) V.scroll = target; else V.scroll += (target - V.scroll) * 0.2; }
  else V.scroll = 0;
  const T = drawSky(g, id, V.scroll, t, dp);
  w.clearRect(0, 0, VW, VH);
  drawLand(w, id, V.scroll, t, T);
  const lights = [], post = [];
  const b = getBg(id), dark = b.under ? 0.34 : T.dark[1], dcol = b.under ? '#05040a' : T.dark[0];
  if (e) fieldScene(w, t, p, e, lights, post, dark); else townScene(w, t, p, lights, post, dark);
  drawFore(w, id, V.scroll);
  for (const l of bgLights(id, V.scroll, dark)) lights.push(l);
  if (dark > 0.01) applyDark(w, dark, dcol, lights);
  g.drawImage(V.wc, 0, 0);
  if (dark > 0.05) glows(g, lights, dark);
  bgEmit(g, id, V.scroll, t, dark);
  for (const f of post) f(g);
  if (e) fx(g, t);
  drawAmbient(g, id, V.scroll, t, T);
  const c = V.ctx;
  c.imageSmoothingEnabled = false;
  const sx = V.shake > 0 ? Math.round((Math.random() - 0.5) * V.shake) * (V.cvs.width / VW) : 0;
  if (sx) { c.fillStyle = '#000'; c.fillRect(0, 0, V.cvs.width, V.cvs.height); }
  c.drawImage(V.off, 0, 0, VW, VH, sx, 0, V.cvs.width, V.cvs.height);
  V.shake = Math.max(0, V.shake - 0.4);
}

/* 어둠: 빛이 닿는 곳만 남기고 덮는다 */
function applyDark(w, a, col, lights) {
  const L = V.l;
  L.globalCompositeOperation = 'source-over';
  L.clearRect(0, 0, VW, VH);
  L.globalAlpha = a; L.fillStyle = col; L.fillRect(0, 0, VW, VH); L.globalAlpha = 1;
  L.globalCompositeOperation = 'destination-out';
  for (const l of lights) {
    const gr = L.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.5, 'rgba(0,0,0,0.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    L.fillStyle = gr; L.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
  }
  L.globalCompositeOperation = 'source-over';
  w.save(); w.globalCompositeOperation = 'source-atop'; w.drawImage(V.lc, 0, 0); w.restore();
}
function glows(g, lights, dark) {
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const l of lights) {
    if (!l.glow) continue;
    const a = (0.08 + dark * 0.16) * (l.flick ? 0.85 + Math.random() * 0.15 : 1), r = l.r * 0.6;
    const gr = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, r);
    gr.addColorStop(0, rgba(l.c, a.toFixed(3))); gr.addColorStop(1, rgba(l.c, 0));
    g.fillStyle = gr; g.fillRect(l.x - r, l.y - r, r * 2, r * 2);
  }
  g.restore();
}

/* 상단 앞 */
const TOWNSFOLK = [
  { cls: 'porter', look: { hair: '#5a3a22', skin: '#e0ac7e' }, id: 1, sp: 9, x0: 10 },
  { cls: 'cleric', look: { hair: '#c9a04a', skin: '#f1c9a5' }, id: 2, sp: -7, x0: 200 },
  { cls: 'rogue', look: { hair: '#2b1d16', skin: '#c68a5e' }, id: 3, sp: 12, x0: 120 }
];
function townScene(w, t, p, lights, post, dark) {
  TOWNSFOLK.forEach((v, i) => {
    const span = VW + 60, x = ((v.x0 + t * v.sp) % span + span) % span - 30;
    if (i === 2 && dark > 0.3) return;
    w.save(); w.translate(Math.round(x), GY - 3); w.scale(v.sp > 0 ? 1 : -1, 1); drawAdv(w, v, t, { walk: 1, ph: i }); w.restore();
  });
  let list = p ? teamOf(p) : [];
  if (!list.length) list = S.advs.filter(a => a.status === 'idle');
  list.slice(0, 6).forEach((a, i) => {
    const x = 46 + i * 30 + (i >= 2 ? 26 : 0);
    shadow(w, x, 10);
    w.save(); w.translate(x, GY); w.scale(i < 2 ? 1 : -1, 1);
    drawAdv(w, a, t, {});
    w.restore();
  });
}

/* 원정 */
const BUFF_C = { atk: '#ff8a4a', def: '#7ab8ff', eva: '#e8e2d0' };
const ORBIT = { elementalist: ['#7ae0a0', '#f0a040'], necromancer: ['#b88aff', '#6a4aa8'] };
function fieldScene(w, t, p, e, lights, post, dark) {
  const dir = e.mode === 'return' ? -1 : 1;
  const all = teamOf(p), team = all.filter(a => !a.down).concat(all.filter(a => a.down));   // 들것은 맨 뒤
  const fighting = e.foes.length > 0, camping = !!e.camp && !fighting, waiting = !!e.wait && !fighting;
  const n = team.length, sp = n > 1 ? Math.min(15, 84 / (n - 1)) : 0;
  const front = dir > 0 ? 104 : 136;
  const foes = fighting ? e.foes : camping ? [] : (e.next || []);
  const gap = !fighting && !camping && e.encs[e.ei] != null ? Math.abs(e.encs[e.ei] - e.pos) * PXU : 0;
  const pos = {};
  const cx = Math.round(front - dir * (n - 1) * sp / 2);
  if (camping) team.forEach((a, i) => { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); pos['a' + a.id] = cx + side * (12 + k * 13); });
  else { let off = 0; team.forEach((a, i) => { if (i) off += a.down ? Math.max(sp, 19) : sp; pos['a' + a.id] = Math.round(front - dir * off); }); }   // 들것은 자리를 더 차지한다
  let acc = 16 + gap;
  foes.forEach(f => { const fw = monW(f.id, f.sc); pos['f' + f.uid] = Math.round(front + dir * (acc + fw / 2)); acc += fw + 4; });
  Object.assign(V.last, pos);
  events(e, pos, dir, t, team);

  // 던전 입구: 필드 끝(1-50 너머)에 서 있다. 1-50의 주인을 쓰러뜨리기 전에는 봉인
  const F = FIELDS[e.field], fs = S.fields[e.field];
  if (e.area === 'field' && fs && !F.raid) {
    const gx = Math.round(104 + (FIELD_STAGES * STAGE_LEN * PXU - V.scroll) + 24);
    if (gx > -40 && gx < VW + 40) { w.save(); w.translate(gx, GY); drawGate(w, F.dungeon.bg, fs.cleared ? 1 : fs.found ? 0 : 2); w.restore(); }
  }
  // 마차 (던전 안에는 두고 들어간다)
  if (p.wagon && e.area !== 'dungeon' && WAGON_W[p.wagon]) {
    const ww = WAGON_W[p.wagon];
    const last = team[team.length - 1];
    const rear = camping ? cx - dir * 46 : last ? pos['a' + last.id] : front;
    const x0 = camping ? rear - dir * ww / 2 : rear - dir * (last && last.down ? 15 : 6);
    w.save(); w.translate(Math.round(x0), GY); w.scale(dir, 1); w.translate(-ww, 0);
    drawWagon(w, p.wagon, t, !fighting && !camping && !waiting);
    w.restore();
  }
  // 야영: 천막과 모닥불
  if (camping) {
    w.save(); w.translate(cx + dir * 26, GY); drawTent(w); w.restore();
    post.push(g => drawFire(g, cx, GY, t, false));
    lights.push({ x: cx, y: GY - 6, r: 52, c: '#f09040', glow: 1, flick: 1 });
  } else if (dark > 0.25 && team.length) {
    const lx = pos['a' + team[0].id] + dir * 4;
    lights.push({ x: lx, y: GY - 13, r: e.area === 'dungeon' ? 40 : 28, c: '#f0c060', glow: 1, flick: 1 });
    post.push(g => { R(g, lx - 1, GY - 14, 3, 3, '#f7d070'); R(g, lx, GY - 13, 1, 1, '#ffffff'); });
  }

  // 쓰러진 적의 잔상
  V.ghosts = V.ghosts.filter(gh => t - gh.t0 < 0.45);
  V.ghosts.forEach(gh => { if (Math.floor((t - gh.t0) * 20) % 2) return; w.save(); w.translate(gh.x, GY); w.scale(-dir, 1); FLASH = '#e9e2d0'; drawMon(w, gh.id, t, { sc: gh.sc }); FLASH = null; w.restore(); });

  foes.forEach((f, i) => {
    const x = pos['f' + f.uid];
    if (x < -60 || x > VW + 60) return;
    shadow(w, x, Math.min(48, monW(f.id, f.sc) * 0.8));
    const lg = (V.lunge['f' + f.uid] || 0) > t ? -dir * 4 : 0;
    w.save(); w.translate(x + lg, GY); w.scale(-dir, 1);
    FLASH = (V.flash['f' + f.uid] || 0) > t ? '#ffffff' : null;
    drawMon(w, f.id, t, { ph: i * 0.37, sc: f.sc });
    FLASH = null; w.restore();
    if (f.fb) post.push(g => { const y = GY - monH(f.id, f.sc) - 9; R(g, x - 3, y, 7, 2, '#f0b43c'); R(g, x - 3, y - 2, 1, 2, '#f0b43c'); R(g, x, y - 2, 1, 2, '#f0b43c'); R(g, x + 3, y - 2, 1, 2, '#f0b43c'); });
    if (fighting) {
      const y = GY - monH(f.id, f.sc) - 5;
      post.push(g => { hpBar(g, x, y, f.hp / f.maxHp, f.boss ? '#f0b43c' : '#e0503f'); if (f.dot) R(g, x - 9, y, 2, 2, f.dot.magic ? '#b88aff' : '#7ad83c'); if (f.slow > 0) R(g, x + 7, y, 2, 2, '#8ad8ff'); });
    }
  });
  team.forEach((a, i) => {
    if (a.down) {   // 들것 위에 누워 있다
      const x = pos['a' + a.id];
      shadow(w, x, 22);
      w.save(); w.translate(x, GY); w.scale(camping ? 1 : dir, 1); drawStretcher(w, a, t, !fighting && !camping && !waiting); w.restore();
      return;
    }
    const at = V.atk['a' + a.id], lunging = at && t - at < 0.26;
    const atkF = lunging ? (t - at < 0.08 ? 0 : 1) : 0;
    const melee = CLASSES[a.cls].act === 'melee';
    const jt = V.jump['a' + a.id], jy = jt && t - jt < 0.4 ? -Math.round(Math.sin((t - jt) / 0.4 * Math.PI) * 12) : 0;
    const x = pos['a' + a.id] + (lunging && melee && atkF ? dir * 4 : 0) + (jy ? dir * 6 : 0);
    const sleeping = camping && e.camp.t > 1.5 && (a.fat || 0) > 4;
    const face = camping ? (x < cx ? 1 : -1) : dir;
    if (!jy) shadow(w, x, 10);
    const bf = !camping && e.buffs.find(bb => bb.to === a.id || bb.to === 'party');
    if (bf) R(w, x - 4, GY, 9, 1, BUFF_C[bf.stat] || '#e8e2d0');
    w.save(); w.translate(x, GY + jy); w.scale(face, 1);
    FLASH = (V.flash['a' + a.id] || 0) > t ? '#ffffff' : null;
    drawAdv(w, a, t, { walk: !fighting && !camping && !waiting, ph: i * 0.5, atk: lunging, atkF, sit: camping && !sleeping, sleep: sleeping });
    FLASH = null; w.restore();
    if (sleeping) post.push(g => drawZ(g, x + face * 6, GY - 8, t, i * 0.3));
    if (ORBIT[a.cls] && !sleeping) post.push(g => { const [c1, c2] = ORBIT[a.cls]; for (let k = 0; k < 2; k++) { const ang = t * 3 + k * Math.PI; R(g, Math.round(x + Math.cos(ang) * 7), Math.round(GY - 14 + jy + Math.sin(ang) * 3), 2, 2, k ? c2 : c1); } });
    if (!camping) {
      const d = derive(a), f = a.hp / d.maxHp;
      post.push(g => {
        hpBar(g, x, GY - 26 + jy, f, f < 0.35 ? '#e0503f' : '#7bd36a');
        R(g, x - 6, GY - 24 + jy, 12, 1, '#10141c');
        R(g, x - 6, GY - 24 + jy, Math.max(0, Math.round(12 * Math.min(1, a.mp / Math.max(1, d.maxMp)))), 1, '#5aa0ff');
        if ((a.fat || 0) >= 60) R(g, x + 7, GY - 26 + jy, 2, 2, a.fat >= 85 ? '#e0503f' : '#f0b43c');
        if (e.taunt && e.taunt.aid === a.id) drawNum(g, x, GY - 33 + jy, '!', '#ff5a4a');
      });
    }
  });
  if (waiting) post.push(g => { const k = Math.floor(t * 2) % 2; drawNum(g, front + dir * 14, GY - 30 - k, '!', '#f0b43c'); R(g, front + dir * 10, GY - 22, 9, 22, 'rgba(10,8,14,0.0)'); });
}

const PROJ = { arrow: 0.18, magic: 0.22, fire: 0.22, ice: 0.2, bolt: 0.05, holy: 0.08, wind: 0.2, dark: 0.24, jump: 0.2 };
const SKILL_CLS = { heal: 'heal', buff: 'buff', taunt: 'buff', mdmg: 'magic', dot: 'dot' };
function events(e, pos, dir, t, team) {
  const at = k => (pos[k] != null ? pos[k] : V.last[k]);
  for (const x of e.ev) {
    if (x.n <= V.lastN) continue;
    V.lastN = x.n;
    if (x.type === 'hit') {
      const fx0 = at('f' + x.d);
      if (fx0 == null) continue;
      if (x.k === 'poison' || x.k === 'curse') { V.fx.push({ k: 'num', x: fx0, y: GY - 26, s: String(x.v), c: x.k === 'curse' ? '#c89aff' : '#9ae86a', t0: t, d: 0.7 }); continue; }
      const ax = at('a' + x.s);
      if (ax == null) continue;
      V.atk['a' + x.s] = t;
      if (x.k === 'jump') V.jump['a' + x.s] = t;
      const delay = PROJ[x.k] || 0;
      if (x.k === 'arrow') V.fx.push({ k: 'proj', x0: ax + dir * 5, y0: GY - 11, x1: fx0, y1: GY - 7, t0: t, d: 0.18, c: x.dot ? '#7ad83c' : '#e8e2d0' });
      if (x.k === 'magic') V.fx.push({ k: 'orb', x0: ax + dir * 5, y0: GY - 17, x1: fx0, y1: GY - 8, t0: t, d: 0.22, c: '#b48aff', c2: '#ffffff' });
      if (x.k === 'fire') V.fx.push({ k: 'orb', x0: ax + dir * 5, y0: GY - 17, x1: fx0, y1: GY - 8, t0: t, d: 0.22, c: '#ff7a2a', c2: '#ffe08a', big: 1 });
      if (x.k === 'dark') V.fx.push({ k: 'orb', x0: ax + dir * 5, y0: GY - 15, x1: fx0, y1: GY - 9, t0: t, d: 0.24, c: '#5a2a8a', c2: '#d8a8ff', big: 1 });
      if (x.k === 'ice') V.fx.push({ k: 'proj', x0: ax + dir * 5, y0: GY - 15, x1: fx0, y1: GY - 8, t0: t, d: 0.2, c: '#8ad8ff', tip: '#ffffff' });
      if (x.k === 'wind') V.fx.push({ k: 'wind', x0: ax + dir * 5, x1: fx0, t0: t, d: 0.2 });
      if (x.k === 'bolt') V.fx.push({ k: 'bolt', x0: ax + dir * 4, x1: fx0, t0: t, d: 0.16 });
      if (x.k === 'holy') V.fx.push({ k: 'beam', x: fx0, t0: t, d: 0.3 });
      if (x.k === 'melee' || x.k === 'jump') V.fx.push({ k: 'slash', x: fx0 - dir * 3, y: GY - 10, dir, t0: t + delay, d: 0.16, c: x.c ? '#fff2a0' : '#ffffff' });
      V.flash['f' + x.d] = t + delay + 0.09;
      if (x.dot) V.fx.push({ k: 'spark', x: fx0, y: GY - 10, t0: t + delay, d: 0.5, c: '#7ad83c' });
      else V.fx.push({ k: 'num', x: fx0, y: GY - 26, s: String(x.v), c: x.c ? '#f7e04a' : '#ffffff', t0: t + delay, d: 0.7 });
    } else if (x.type === 'fmiss') {
      const fx0 = at('f' + x.d);
      V.atk['a' + x.s] = t;
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
      if (s && (s.kind === 'mdmg' || s.kind === 'heal')) V.atk['a' + x.s] = t;
    } else if (x.type === 'buff') {
      const s = SKILLS[x.id], col = s && s.kind === 'taunt' ? '#ff5a4a' : BUFF_C[s && s.stat] || '#e8e2d0';
      const list = x.party ? team.map(a => a.id) : [x.s];
      list.forEach(id => { const ax = at('a' + id); if (ax != null) V.fx.push({ k: 'spark', x: ax, y: GY - 10, t0: t, d: 0.6, c: col }); });
    } else if (x.type === 'kill') {
      const fx0 = at('f' + x.d);
      if (fx0 != null) V.ghosts.push({ id: x.id, x: fx0, t0: t, sc: x.sc || 0 });
    } else if (x.type === 'loot' || x.type === 'gear') {
      const fx0 = V.ghosts.length ? V.ghosts[V.ghosts.length - 1].x : VW / 2;
      V.fx.push({ k: 'icon', id: x.type === 'gear' ? { icon: GTYPES[x.base].icon, c: TIER_COLORS[x.t] } : x.id, x: fx0 + (x.type === 'gear' ? 6 : 0), y: GY - 14, t0: t, d: x.type === 'gear' ? 1.4 : 0.9 });
    } else if (x.type === 'down') {
      const ax = at('a' + x.d);
      if (ax != null) { V.fx.push({ k: 'num', x: ax, y: GY - 36, s: 'DOWN', c: '#ff6a5a', t0: t, d: 1.4 }); V.fx.push({ k: 'spark', x: ax, y: GY - 10, t0: t, d: 0.6, c: '#ff6a5a' }); }
      V.shake = 4;
    } else if (x.type === 'lvl') {
      const ax = at('a' + x.d);
      if (ax != null) V.fx.push({ k: 'num', x: ax, y: GY - 40, s: 'LV UP', c: '#f0b43c', t0: t, d: 1.2 });
    } else if (x.type === 'spawn' && (x.boss || x.amb)) {
      V.shake = x.boss ? 6 : 4;
      if (x.name) callout(VW / 2, GY - 52, x.name, 'boss');
    }
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
      if (f.big) { R(g, x - 2, y - 2, 5, 5, f.c); R(g, x - s * 4, y, 2, 1, f.c); R(g, x - s * 6, y + 1, 1, 1, f.c); }
      else R(g, x - 1, y - 1, 3, 3, f.c);
      R(g, x, y, 1, 1, f.c2);
    } else if (f.k === 'wind') {
      const x = Math.round(f.x0 + (f.x1 - f.x0) * k), s = Math.sign(f.x1 - f.x0) || 1;
      for (let i = 0; i < 5; i++) R(g, x - s * i, GY - 14 + Math.abs(i - 2) * 2, 1, 2, i % 2 ? '#c8ffd8' : '#7ae0a0');
    } else if (f.k === 'bolt') {
      const n = 5, y0 = GY - 16;
      let px = f.x0, py = y0;
      for (let i = 1; i <= n; i++) {
        const nx = Math.round(f.x0 + (f.x1 - f.x0) * i / n), ny = Math.round(y0 + (i === n ? 8 : (Math.random() - 0.5) * 8));
        R(g, Math.min(px, nx), Math.min(py, ny), Math.abs(nx - px) + 1, 1, '#fff8a0');
        R(g, nx, Math.min(py, ny), 1, Math.abs(ny - py) + 1, '#f7e04a');
        px = nx; py = ny;
      }
    } else if (f.k === 'beam') {
      const h = Math.round(GY * Math.min(1, k * 3));
      R(g, f.x - 2, GY - h, 5, h, '#f0d870'); R(g, f.x - 1, GY - h, 3, h, '#fff8d0');
    } else if (f.k === 'slash') {
      const s = f.dir;
      for (let i = 0; i < 6; i++) { const a = -1.1 + i * 0.45 + k * 0.8; R(g, Math.round(f.x + s * Math.cos(a) * 6), Math.round(f.y + Math.sin(a) * 7), 1, 1, f.c); }
    } else if (f.k === 'wave') {
      const r = Math.round(6 + k * 40);
      R(g, f.x - f.dir * r, GY - 3, 3, 3, '#e0503f'); R(g, f.x - f.dir * (r + 6), GY - 2, 2, 2, '#ff9a7a');
    } else if (f.k === 'spark') {
      for (let i = 0; i < 4; i++) { const a = i * 1.57 + k * 3; R(g, Math.round(f.x + Math.cos(a) * (3 + k * 6)), Math.round(f.y + Math.sin(a) * (3 + k * 6) - k * 6), 1, 1, f.c); }
    } else if (f.k === 'icon') drawIcon(g, f.id, Math.round(f.x - 5), Math.round(f.y - k * 18));
  }
}
