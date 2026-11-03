/* ───────── 전투 화면: 원근 무대 위에 적은 가운데 줄, 파티는 아래 줄 ─────────
   무대(240×200)를 한 번 그려서, 작은 창에는 가운데 띠만, 전투 창에는 전체를 보여 준다. */
const PIP_Y = 64, PIP_H = 128;
const ZP = 1.5, ZE = 1.25;                                // 무대 배율: 앞줄 파티는 크게, 적은 조금 작게
const PH = 21 * ZP;                                       // 파티원 키 (논리 픽셀)
const zq = z => Math.max(0.25, Math.round(z * 4) / 4);   // 배율은 1/4 단위 (구운 그림을 다시 쓰게)
const eW = f => monW(f.id, f.sc) * ZE, eH = f => monH(f.id, f.sc) * ZE;
const V = { cvs: null, ctx: null, off: null, g: null, wc: null, w: null, lc: null, l: null, bcv: null, bctx: null, bopen: false,
  mode: '', lastN: 0, lastF: 0, fx: [], ghosts: [], flash: {}, lunge: {}, atk: {}, jump: {}, last: {}, shake: 0, giant: false,
  log: [], logN: 0, logP: 0, fname: {} };

function initView(canvas) {
  V.cvs = canvas;
  V.ctx = canvas.getContext('2d');
  [V.off, V.g] = mkCanvas(AW * HI, AH * HI);
  [V.wc, V.w] = mkCanvas(AW * HI, AH * HI);
  [V.lc, V.l] = mkCanvas(AW * HI, AH * HI);
  [V.g, V.w, V.l].forEach(x => x.setTransform(HI, 0, 0, HI, 0, 0));   // 논리 좌표로 그리면 두 배로 찍힌다
  V.bcv = $('bcv'); if (V.bcv) V.bctx = V.bcv.getContext('2d');
  sizeView();
  window.addEventListener('resize', sizeView);
}
function fitCanvas(cv, w, h) {
  if (!cv) return;
  const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  const W = Math.max(w, Math.round(r.width * dpr)), H = Math.max(h, Math.round(r.height * dpr));
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  cv.getContext('2d').imageSmoothingEnabled = false;
}
function sizeView() { fitCanvas(V.cvs, AW * HI, PIP_H * HI); if (V.bopen) fitCanvas(V.bcv, AW * HI, AH * HI); }
const viewParty = () => (S && (S.parties.find(p => p.id === S.view) || S.parties[0])) || null;
function routePos(e) { return ((e.area === 'dungeon' ? FIELD_STAGES + e.stage : e.stage) - 1) * STAGE_LEN + e.pos; }

/* 자리: 파티는 아래 줄에 고르게, 적은 몸집만큼 띄워 가운데 줄에 */
const partyX = (i, n) => Math.round(AW / 2 + (i - (n - 1) / 2) * Math.min(38, 220 / Math.max(1, n)));
function foeXs(foes) {
  const ws = foes.map(f => Math.max(18, eW(f))), gap = 8;
  const tot = ws.reduce((s, v) => s + v, 0) + gap * (foes.length - 1), k = tot > 228 ? 228 / tot : 1;
  let x = AW / 2 - tot * k / 2;
  return foes.map((f, i) => { const cx = x + ws[i] * k / 2; x += (ws[i] + gap) * k; return Math.round(cx); });
}
// 두 배 해상도 도우미 (0.5 = 고해상도 한 칸)
function oval(g, x, y, rx, ry, c) { for (let j = -ry; j <= ry; j += 0.5) { const w = rx * Math.sqrt(Math.max(0, 1 - (j * j) / (ry * ry))); if (w > 0.2) R(g, Math.round((x - w) * 2) / 2, y + j, Math.round(w * 4) / 2, 0.5, c); } }
const shadowAt = (g, x, y, rx) => oval(g, x, y + 0.5, rx, Math.max(1, rx * 0.28), 'rgba(10,6,14,0.3)');
function bar(g, x, y, w, f, col, h = 1.5) {
  f = Math.max(0, Math.min(1, f));
  R(g, x - w / 2 - 0.5, y - 0.5, w + 1, h + 1, '#0a0810');
  R(g, x - w / 2, y, w, h, mix(col, '#140c10', 0.72));
  if (f > 0) { R(g, x - w / 2, y, Math.max(0.5, Math.round(w * f * 2) / 2), h, col); R(g, x - w / 2, y, Math.max(0.5, Math.round(w * f * 2) / 2), 0.5, mix(col, '#ffffff', 0.35)); }
}

/* 스킬 이름은 글자로 띄운다 (화면 위 DOM). 작은 창과 전투 창 모두 */
function callout(x, y, text, cls) {
  if (document.hidden) return;
  const k = Math.min(2.5, (S && S.speed) || 1), dur = cls === 'boss' ? 2.3 : 1.1;
  const boxes = V.bopen ? [['bcallouts', 0, AH]] : [['callouts', PIP_Y, PIP_H]];
  for (const [id, y0, h] of boxes) {
    const box = $(id);
    if (!box) continue;
    while (box.children.length >= 5) box.firstChild.remove();
    const xp = Math.max(9, Math.min(91, x / AW * 100));
    const near = cls === 'boss' ? 0 : [...box.children].filter(c => !c.classList.contains('boss') && Math.abs(+c.dataset.x - xp) < 17).length;
    const s = document.createElement('span');
    s.className = 'call ' + (cls || '');
    s.textContent = text;
    s.dataset.x = xp;
    s.style.left = xp + '%';
    s.style.top = (cls === 'boss' ? Math.max(14, (ROW_E - 40 - y0) / h * 100) : Math.max(8, (y - y0) / h * 100 - near * 9)) + '%';
    if (k > 1 || cls === 'boss') s.style.animationDuration = (dur / k).toFixed(2) + 's';
    box.append(s);
    setTimeout(() => s.remove(), dur * 1050 / k);
  }
}
const clearCallouts = () => ['callouts', 'bcallouts'].forEach(id => { const b = $(id); if (b) b.textContent = ''; });

function drawFrame(now, vt) {
  const t = vt != null ? vt : now / 1000, p = viewParty(), e = p && p.exp;
  const key = (p ? p.id : 0) + ':' + (e ? 'x' : 'h');
  // 화면을 바꿨거나 오래 멈췄다 돌아오면 밀린 효과는 건너뛴다
  if (key !== V.mode || now - V.lastF > 1000) {
    if (key !== V.mode) { V.fx = []; V.ghosts = []; V.flash = {}; V.lunge = {}; V.atk = {}; V.jump = {}; clearCallouts(); }
    if (p && V.logP !== p.id) { V.log = []; V.logP = p.id; V.logN = 0; }
    V.mode = key; V.lastN = e ? e.evN : 0;
  }
  V.lastF = now;
  const g = V.g, w = V.w, dp = clockDp();
  const F = e && FIELDS[e.field];
  const id = e ? (e.area === 'dungeon' ? F.dungeon.bg : F.bg) : 'town';
  const bg = arenaBg(id);
  let T;
  if (bg.under) { T = todAt(dp, 'plains'); R(g, 0, 0, AW, AH, '#000'); }
  else T = arenaSky(g, id, t, dp);
  w.clearRect(0, 0, AW, AH);
  w.drawImage(bg.cv, 0, 0, AW, AH);
  const lights = [], post = [];
  const dark = bg.under ? 0.34 : T.dark[1], dcol = bg.under ? '#05040a' : T.dark[0];
  if (e) fieldScene(w, t, p, e, lights, post, dark, bg); else townScene(w, t, p, lights, post, dark);
  stageLights(id, bg, lights, dark);
  if (dark > 0.01) applyDark(w, dark, dcol, lights);
  g.drawImage(V.wc, 0, 0, AW, AH);
  if (dark > 0.05) glows(g, lights, dark);
  for (const f of post) f(g);
  if (e) fx(g, t);
  ambient(g, id, t, T);
  present();
}
// 작은 창에는 가운데 띠, 열려 있으면 전투 창에는 무대 전체
function present() {
  const sh = V.shake > 0 ? Math.round((Math.random() - 0.5) * V.shake) : 0;
  const put = (c, cv, y0, h) => {
    c.imageSmoothingEnabled = false;
    const sx = sh * (cv.width / AW);
    if (sx) { c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height); }
    c.drawImage(V.off, 0, y0 * HI, AW * HI, h * HI, sx, 0, cv.width, cv.height);
  };
  if (V.bopen && V.bctx) put(V.bctx, V.bcv, 0, AH);
  else put(V.ctx, V.cvs, PIP_Y, PIP_H);
  V.shake = Math.max(0, V.shake - 0.4);
}

/* 어둠: 빛이 닿는 곳만 남기고 덮는다 */
function applyDark(w, a, col, lights) {
  const L = V.l;
  L.globalCompositeOperation = 'source-over';
  L.clearRect(0, 0, AW, AH);
  L.globalAlpha = a; L.fillStyle = col; L.fillRect(0, 0, AW, AH); L.globalAlpha = 1;
  L.globalCompositeOperation = 'destination-out';
  for (const l of lights) {
    const gr = L.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.5, 'rgba(0,0,0,0.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    L.fillStyle = gr; L.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
  }
  L.globalCompositeOperation = 'source-over';
  w.save(); w.globalCompositeOperation = 'source-atop'; w.drawImage(V.lc, 0, 0, AW, AH); w.restore();
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
// 무대에 붙은 불빛: 던전 횃불, 거리 등불
function stageLights(id, bg, lights, dark) {
  if (bg.under) {
    for (const z of [1.5, 3]) for (const s of [-1, 1]) { const [x, y] = ap(s * 1.4, 1.2, z); lights.push({ x: x / HI, y: y / HI - 2, r: 46 / z, c: DUN[id] ? DUN[id].light : '#f0b050', glow: 1, flick: 1 }); }
  } else if (bg.town && dark > 0.12) {
    for (const z of [1.32, 1.9]) for (const s of [-1, 1]) { const [x, y] = ap(s * 1.15, 1.3, z); lights.push({ x: x / HI, y: y / HI, r: 52 / z, c: '#f0c060', glow: 1 }); }
  }
}
function torchFlames(g, id, t) {
  for (const z of [1.5, 3]) for (const s of [-1, 1]) {
    const [x0, y0] = ap(s * 1.4, 1.2, z), x = x0 / HI, y = y0 / HI, k = 2.2 / z, f = Math.floor(t * 9 + z * 3 + s) % 3;
    R(g, x - 1 * k, y - (3 + f * 0.5) * k, 2 * k, (3 + f * 0.5) * k, '#e8702a'); R(g, x - 0.5 * k, y - (2.5 + f * 0.5) * k, 1 * k, 2 * k, '#f7d04a'); R(g, x - 0.5 * k, y - 1 * k, 1 * k, 1 * k, '#fff4c0');
  }
}

/* ───────── 상단 앞 (원정 중이 아닐 때) ───────── */
const TOWNSFOLK = [
  { cls: 'porter', look: { hair: '#5a3a22', skin: '#e0ac7e' }, id: 1, X: -0.86, sp: 0.07, z0: 0 },
  { cls: 'cleric', look: { hair: '#c9a04a', skin: '#f1c9a5' }, id: 2, X: 0.9, sp: 0.05, z0: 0.45 }
];
function townScene(w, t, p, lights, post, dark) {
  // 거리 저 안쪽에서 걸어 나오는 사람들 (멀면 작게)
  TOWNSFOLK.forEach((v, i) => {
    if (i && dark > 0.3) return;
    const k = (v.z0 + t * v.sp) % 1, z = 8 - k * 5.4, [x, y] = ap(v.X, 0, z), s = Math.min(1, 2.6 / z);
    w.save(); w.translate(x / HI, y / HI); shadowAt(w, 0, 0, 8 * s); drawAdv(w, v, t, { walk: 1, ph: i, z: zq(ZP * s) }); w.restore();
  });
  let list = p ? teamOf(p) : [];
  if (!list.length) list = S.advs.filter(a => a.status === 'idle').slice(0, 6);
  list = list.slice(0, 6);
  list.forEach((a, i) => {
    const x = partyX(i, list.length);
    shadowAt(w, x, ROW_P, 9);
    w.save(); w.translate(x, ROW_P); drawAdv(w, a, t, { ph: i * 0.5, z: ZP }); w.restore();
  });
  if (dark > 0.3 && list.length) lights.push({ x: AW / 2, y: ROW_P - PH / 2, r: 70, c: '#f0c060' });
}

/* ───────── 원정 ───────── */
const ORBIT = { elementalist: ['#7ae0a0', '#f0a040'], necromancer: ['#b88aff', '#6a4aa8'] };
const Z_ROW = ACAM * 120 / ((ROW_E - AHZ) * HI);       // 적 줄의 깊이
function fieldScene(w, t, p, e, lights, post, dark, bg) {
  const all = teamOf(p), team = all.filter(a => !a.down).concat(all.filter(a => a.down));   // 들것은 맨 끝
  const fighting = e.foes.length > 0, camping = !!e.camp && !fighting, waiting = !!e.wait && !fighting;
  const walking = !fighting && !camping && !waiting;
  const F = FIELDS[e.field];
  // 다가오는 적: 길 저 끝에서 줄까지 걸어온다
  const gap = !fighting && !camping && e.encs[e.ei] != null ? Math.abs(e.encs[e.ei] - e.pos) : 99;
  const foes = fighting ? e.foes : camping || gap > 30 ? [] : (e.next || []);
  const appr = fighting ? 0 : Math.max(0, Math.min(1, gap / 30));
  V.giant = foes.some(f => f.giant);
  for (const f of e.foes.concat(e.next || [])) V.fname[f.uid] = f.name || MONS[f.id].name;
  const pos = {}, n = team.length;
  team.forEach((a, i) => { pos['a' + a.id] = partyX(i, n); });
  const fx0 = foeXs(foes);
  foes.forEach((f, i) => { pos['f' + f.uid] = fx0[i]; });
  Object.assign(V.last, pos);
  if (bg.under) post.push(g => torchFlames(g, F.dungeon.bg, t));
  events(e, pos, t, team, p);
  if (walking) roadMarks(w, t, routePos(e), bg);

  // 던전 입구: 1-50 끝에서 길 끝에 서 있다
  const fs = S.fields[e.field];
  if (e.area === 'field' && fs && !F.raid && (waiting || (e.stage === FIELD_STAGES && e.mode === 'advance' && !fighting && e.pos > 55))) {
    const k = waiting ? 0 : Math.max(0, Math.min(1, (STAGE_LEN - e.pos) / 45)), z = Z_ROW + k * 6, s = Z_ROW / z, [, gy] = ap(0, 0, z);
    w.save(); w.translate(AW / 2, gy / HI); w.scale(s, s); drawGate(w, F.dungeon.bg, fs.cleared ? 1 : fs.found ? 0 : 2); w.restore();
  }

  // 야영: 모닥불을 둘러앉는다
  if (camping) {
    const cx = AW / 2, cy = ROW_P - 14;
    w.save(); w.translate(cx - 70, ROW_E + 20); drawTentHi(w); w.restore();
    const sleep = e.camp.t > 1.5;
    team.forEach((a, i) => {
      const k = n > 1 ? i / (n - 1) : 0.5, ang = Math.PI * (0.1 + 0.8 * k), rx = sleep ? 78 : 60, x = Math.round(cx - Math.cos(ang) * rx), y = Math.round(cy - Math.sin(ang) * 14 + 6);
      pos['a' + a.id] = x;
      const zz = sleep && (a.fat || 0) > 4;
      shadowAt(w, x, y, zz ? 15 : 9);
      w.save(); w.translate(x, y); drawAdv(w, a, t, { sit: !zz, sleep: zz, z: ZP }); w.restore();
      if (zz) post.push(g => drawZ(g, x + 9, y - 16, t, i * 0.3));
    });
    post.push(g => fireHi(g, cx, cy + 10, t));
    lights.push({ x: cx, y: cy + 4, r: 90, c: '#f09040', glow: 1, flick: 1 });
    return;
  }

  // 쓰러진 적의 잔상
  V.ghosts = V.ghosts.filter(gh => t - gh.t0 < 0.45);
  V.ghosts.forEach(gh => { if (Math.floor((t - gh.t0) * 20) % 2) return; w.save(); w.translate(gh.x, ROW_E); w.scale(gh.face, 1); FLASH = '#e9e2d0'; drawMon(w, gh.id, t, { sc: gh.sc, z: ZE }); FLASH = null; w.restore(); });

  // 적
  foes.forEach((f, i) => {
    let x = pos['f' + f.uid], y = ROW_E, s = 1;
    if (appr > 0) { const z = Z_ROW + appr * 7; s = Z_ROW / z; x = AW / 2 + (x - AW / 2) * s; y = ap(0, 0, z)[1] / HI; }
    const face = f.giant ? -1 : x < AW / 2 - 6 ? 1 : -1, lg = (V.lunge['f' + f.uid] || 0) > t ? 4 : 0;
    w.save(); w.translate(x, y + lg);
    shadowAt(w, 0, 0, Math.min(46, eW(f) * 0.45) * s);
    w.scale(face, 1);
    FLASH = !f.giant && (V.flash['f' + f.uid] || 0) > t ? '#ffffff' : null;   // 레이드 몬스터는 번쩍이지 않는다
    drawMon(w, f.id, t, { ph: i * 0.37, sc: f.sc, z: appr > 0 ? zq(ZE * s) : ZE });
    FLASH = null; w.restore();
    if (!fighting) return;
    const h = eH(f);
    if (f.giant) post.push(g => { const fr0 = Math.max(0, f.hp / f.maxHp); bar(g, AW / 2, ROW_E + 4, 120, fr0, '#e0503f', 3); drawNum(g, AW / 2, ROW_E + 9, Math.ceil(fr0 * 100) + '%', '#ffffff'); });
    else post.push(g => {
      const bw = Math.max(16, Math.min(32, eW(f) * 0.7));
      bar(g, x, ROW_E + 3, bw, f.hp / f.maxHp, f.boss ? '#f0b43c' : '#e0503f');
      if (f.dot) R(g, x - bw / 2 - 3, ROW_E + 3, 1.5, 1.5, f.dot.magic ? '#b88aff' : '#7ad83c');
      if (f.slow > 0) R(g, x + bw / 2 + 1.5, ROW_E + 3, 1.5, 1.5, '#8ad8ff');
      if (f.fb) { const yy = ROW_E - h - 6; R(g, x - 3, yy, 7, 2, '#f0b43c'); R(g, x - 3, yy - 2, 1, 2, '#f0b43c'); R(g, x, yy - 2, 1, 2, '#f0b43c'); R(g, x + 3, yy - 2, 1, 2, '#f0b43c'); }
    });
  });

  // 파티
  team.forEach((a, i) => {
    const x0 = pos['a' + a.id];
    if (a.down) {   // 들것 위에 누워 있다
      shadowAt(w, x0, ROW_P, 18);
      w.save(); w.translate(x0, ROW_P); stretcherHi(w, a, t, walking); w.restore();
      return;
    }
    const at = V.atk['a' + a.id], lunging = at && t - at < 0.26, atkF = lunging ? (t - at < 0.08 ? 0 : 1) : 0;
    const melee = CLASSES[a.cls].act === 'melee';
    const jt = V.jump['a' + a.id], jy = jt && t - jt < 0.4 ? -Math.round(Math.sin((t - jt) / 0.4 * Math.PI) * 14) : 0;
    const y = ROW_P + (lunging && melee && atkF ? -7 : 0) + jy;
    shadowAt(w, x0, ROW_P, jy ? 7 : 9);
    w.save(); w.translate(x0, y);
    FLASH = (V.flash['a' + a.id] || 0) > t ? '#ffffff' : null;
    drawAdv(w, a, t, { walk: walking, ph: i * 0.5, atk: lunging, atkF, z: ZP });
    FLASH = null; w.restore();
    if (ORBIT[a.cls]) post.push(g => { const [c1, c2] = ORBIT[a.cls]; for (let k = 0; k < 2; k++) { const ang = t * 3 + k * Math.PI; R(g, Math.round((x0 + Math.cos(ang) * 12) * 2) / 2, Math.round((y - PH * 0.55 + Math.sin(ang) * 4) * 2) / 2, 1.5, 1.5, k ? c2 : c1); } });
    const d = derive(a);
    post.push(g => {
      bar(g, x0, ROW_P + 3, 24, a.hp / d.maxHp, '#e0503f');
      bar(g, x0, ROW_P + 5.5, 24, a.mp / Math.max(1, d.maxMp), '#4a8ae8', 1);
      if ((a.fat || 0) >= 60) R(g, x0 + 13.5, ROW_P + 3, 1.5, 1.5, a.fat >= 85 ? '#e0503f' : '#f0b43c');
      if (e.taunt && e.taunt.aid === a.id) drawNum(g, x0, y - PH - 6, '!', '#ff5a4a');
    });
  });
  if (dark > 0.25 && team.length && !bg.under) { const lx = pos['a' + team[0].id] + 11, ly = ROW_P - PH * 0.5; lights.push({ x: lx, y: ly, r: 70, c: '#f0c060', glow: 1, flick: 1 }); post.push(g => { R(g, lx - 1, ly - 1.5, 2.5, 3, '#f7d070'); R(g, lx - 0.5, ly - 0.5, 1, 1, '#ffffff'); }); }
  else if (bg.under && team.length) lights.push({ x: AW / 2, y: ROW_P - PH * 0.5, r: 96, c: '#f0c060' });
  if (waiting) post.push(g => { const k = Math.floor(t * 2) % 2; drawNum(g, AW / 2, ROW_E - 54 - k, '?', '#f0b43c'); });
}
// 걷는 동안 길 위의 자국이 다가온다
function roadMarks(w, t, dist, bg) {
  const c = bg.under ? 'rgba(0,0,0,0.22)' : 'rgba(40,24,10,0.18)';
  for (let i = 0; i < 9; i++) {
    const zz = 1.1 + ((i * 0.9 - dist * 0.045) % 8.1 + 8.1) % 8.1, X = ((i * 37) % 7 - 3) * 0.16, [x, y] = ap(X, 0, zz), s = 120 / zz / HI;
    R(w, Math.round((x / HI - s * 0.12) * 2) / 2, Math.round(y / HI * 2) / 2, Math.max(0.5, Math.round(s * 0.24 * 2) / 2), Math.max(0.5, Math.round(s * 0.04 * 2) / 2), c);
  }
}

/* 천막·모닥불·들것 (두 배 해상도) */
function drawTentHi(ctx) {
  blitHi(ctx, bakeHi('tentHi', 70, 52, 35, 48, D => {
    const cv = mat('#c8a868'), cv2 = mat('#e0c88a'), wood = mat('#6b4a2e', 'wood');
    D.add(shPoly([[-30, 0], [-6, -38], [-2, -38], [-14, 0]]), cv2, { tex: TX.fold(6, 2) });
    D.add(shPoly([[-14, 0], [-4, -38], [24, -36], [32, 0]]), cv, { tex: TX.fold(6, 0), lift: -0.15 });
    D.add(shPoly([[-14, 0], [-4, -30], [6, 0]]), mat('#2a1d14', 'ink'), { cast: false });
    D.add(shCap(-4, -38, -4, -44, 1, 1), wood);
    D.add(shCap(-32, 1, -30, -1, 1.2, 1.2), wood); D.add(shCap(33, 1, 31, -1, 1.2, 1.2), wood);
  }));
}
function fireHi(g, x, y, t) {
  g.save(); g.translate(x, y);
  blitHi(g, bakeHi('fireBase', 40, 20, 20, 12, D => {
    const st = mat('#7a7480', 'stone'), wd = mat('#7a5232', 'wood');
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; D.add(shEll(Math.cos(a) * 13, Math.sin(a) * 4.5, 3.4, 2.4), st); }
    D.add(shCap(-9, 2, 9, -3, 2, 2), wd, { tex: TX.grain() }); D.add(shCap(-9, -3, 9, 2, 2, 2), mat('#5e3c22', 'wood'));
  }));
  g.restore();
  const f = Math.floor(t * 10) % 4;
  [[-3, 6, '#c0392b'], [-1.5, 10, '#f08a3c'], [0, 13, '#f7c04a'], [1.5, 9, '#f08a3c'], [3, 5, '#c0392b']].forEach(([dx, h, c], i) => {
    const hh = h + ((i + f) % 3) - 1;
    R(g, x + dx - 0.75, y - 1 - hh, 1.5, hh, c);
  });
  R(g, x - 1.5, y - 7, 3, 4, '#fff2c0');
  for (let i = 0; i < 6; i++) { const k = ((t * 0.9 + i * 0.37) % 1), sx = x + Math.sin(i * 7 + t * 3) * 4, sy = y - 12 - k * 28; if (k < 0.8) R(g, Math.round(sx * 2) / 2, Math.round(sy * 2) / 2, 1, 1, k < 0.4 ? '#f7e04a' : '#f08a3c'); }
}
function stretcherHi(g, a, t, moving) {
  const by = moving ? Math.round(Math.sin(t * 9) * 1) / 2 : 0;
  R(g, -20, -3 + by, 40, 1, '#6b4a2e'); R(g, -21, -3 + by, 1, 1, '#8a6a44'); R(g, 20, -3 + by, 1, 1, '#8a6a44');
  R(g, -15, -4 + by, 30, 1.5, '#d8cdb0'); R(g, -15, -2.5 + by, 30, 0.5, '#a89a7a');
  R(g, -13, -2 + by, 0.5, 2, '#5e3c22'); R(g, 13, -2 + by, 0.5, 2, '#5e3c22');
  g.save(); g.translate(0, -3 + by); drawAdv(g, a, t, { sleep: 1, z: ZP }); g.restore();
  R(g, -0.5, -22 + by, 2, 0.5, '#e0503f'); R(g, 0, -22.5 + by, 1, 2, '#e0503f');
}

/* ───────── 사건 → 효과와 전투 기록 ───────── */
const PROJ = { arrow: 0.18, magic: 0.22, fire: 0.22, ice: 0.2, bolt: 0.05, holy: 0.08, wind: 0.2, dark: 0.24, jump: 0.2, spell: 0.2, note: 0.2 };
const SKILL_CLS = { heal: 'heal', buff: 'buff', taunt: 'buff', mdmg: 'magic', dot: 'dot' };
const BUFF_C = { atk: '#ff8a4a', def: '#7ab8ff', eva: '#e8e2d0' };
function events(e, pos, t, team, p) {
  const at = k => (pos[k] != null ? pos[k] : V.last[k]);
  const jx = () => { V.nj = ((V.nj || 0) + 1) % 5; return (V.nj - 2) * 5; }, jy = () => (V.nj % 2) * -5;   // 숫자가 겹치지 않게 조금씩 비킨다
  const fy = uid => { const f = e.foes.find(o => o.uid === uid); return ROW_E - (f ? Math.min(48, eH(f)) : 14) / 2; };
  const ftop = uid => { const f = e.foes.find(o => o.uid === uid); return ROW_E - (f ? Math.min(64, eH(f)) : 18) - 4; };
  for (const x of e.ev) {
    if (x.n <= V.lastN) continue;
    V.lastN = x.n;
    logEvent(x, e, p);
    if (x.type === 'hit') {
      const fx0 = at('f' + x.d);
      if (fx0 == null) continue;
      if (x.k === 'poison' || x.k === 'curse') { V.fx.push({ k: 'num', x: fx0 + jx(), y: ftop(x.d) + jy(), s: String(x.v), c: x.k === 'curse' ? '#c89aff' : '#9ae86a', t0: t, d: 0.7 }); continue; }
      const ax = at('a' + x.s);
      if (ax == null) continue;
      V.atk['a' + x.s] = t;
      if (x.k === 'jump') V.jump['a' + x.s] = t;
      const delay = PROJ[x.k] || 0, y0 = ROW_P - PH * 0.6, y1 = fy(x.d);
      if (x.k === 'arrow') V.fx.push({ k: 'proj', x0: ax, y0, x1: fx0, y1, t0: t, d: 0.18, c: x.dot ? '#7ad83c' : '#e8e2d0' });
      if (x.k === 'magic' || x.k === 'spell') V.fx.push({ k: 'orb', x0: ax, y0: y0 - 4, x1: fx0, y1, t0: t, d: 0.22, c: '#b48aff', c2: '#ffffff' });
      if (x.k === 'note') V.fx.push({ k: 'orb', x0: ax, y0: y0 - 2, x1: fx0, y1, t0: t, d: 0.2, c: '#f0d870', c2: '#ffffff' });
      if (x.k === 'fire') V.fx.push({ k: 'orb', x0: ax, y0: y0 - 4, x1: fx0, y1, t0: t, d: 0.22, c: '#ff7a2a', c2: '#ffe08a', big: 1 });
      if (x.k === 'dark') V.fx.push({ k: 'orb', x0: ax, y0: y0 - 2, x1: fx0, y1, t0: t, d: 0.24, c: '#5a2a8a', c2: '#d8a8ff', big: 1 });
      if (x.k === 'ice') V.fx.push({ k: 'proj', x0: ax, y0: y0 - 2, x1: fx0, y1, t0: t, d: 0.2, c: '#8ad8ff', tip: '#ffffff' });
      if (x.k === 'wind') V.fx.push({ k: 'wind', x0: ax, y0, x1: fx0, y1, t0: t, d: 0.2 });
      if (x.k === 'bolt') V.fx.push({ k: 'bolt', x: fx0, y: y1, t0: t, d: 0.16 });
      if (x.k === 'holy') V.fx.push({ k: 'beam', x: fx0, y: ROW_E, t0: t, d: 0.3 });
      if (x.k === 'melee' || x.k === 'jump' || x.k === 'pet') V.fx.push({ k: 'slash', x: fx0, y: y1, t0: t + delay, d: 0.16, c: x.c ? '#fff2a0' : '#ffffff', big: x.c });
      V.flash['f' + x.d] = t + delay + 0.09;
      if (x.dot) V.fx.push({ k: 'spark', x: fx0, y: y1, t0: t + delay, d: 0.5, c: '#7ad83c' });
      else V.fx.push({ k: 'num', x: fx0 + jx(), y: ftop(x.d) + jy(), s: String(x.v), c: x.c ? '#f7e04a' : '#ffffff', t0: t + delay, d: 0.7 });
    } else if (x.type === 'fmiss') {
      const fx0 = at('f' + x.d);
      V.atk['a' + x.s] = t;
      if (fx0 != null) V.fx.push({ k: 'num', x: fx0 + 2, y: ftop(x.d) - 4, s: 'MISS', c: '#a9b0bd', t0: t, d: 0.6 });
    } else if (x.type === 'hurt') {
      const ax = at('a' + x.d);
      if (ax == null) continue;
      V.lunge['f' + x.s] = t + 0.14;
      V.flash['a' + x.d] = t + 0.1;
      const fx0 = at('f' + x.s);
      if (fx0 != null && x.k === 'magic') V.fx.push({ k: 'orb', x0: fx0, y0: fy(x.s), x1: ax, y1: ROW_P - PH * 0.5, t0: t - 0.1, d: 0.12, c: '#d86aff', c2: '#ffffff' });
      V.fx.push({ k: 'claw', x: ax, y: ROW_P - PH * 0.5, t0: t, d: 0.14 });
      V.fx.push({ k: 'num', x: ax, y: ROW_P - PH - 8, s: String(x.v), c: x.c ? '#ff9a3a' : '#ff6a5a', t0: t, d: 0.7 });
    } else if (x.type === 'miss') {
      const ax = at('a' + x.d);
      V.lunge['f' + x.s] = t + 0.14;
      if (ax != null) V.fx.push({ k: 'num', x: ax + 2, y: ROW_P - PH - 12, s: 'MISS', c: '#cfe8ff', t0: t, d: 0.6 });
    } else if (x.type === 'aoe') {
      V.lunge['f' + x.s] = t + 0.25;
      V.shake = Math.max(V.shake, 3);
      V.fx.push({ k: 'wave', x: at('f' + x.s) || AW / 2, t0: t, d: 0.35 });
    } else if (x.type === 'heal' || x.type === 'pot' || x.type === 'mana') {
      const ax = at('a' + x.d);
      if (ax == null) continue;
      const blue = x.type === 'mana';
      V.fx.push({ k: 'num', x: ax, y: ROW_P - PH - 8, s: '+' + x.v, c: blue ? '#7ab8ff' : '#7bd36a', t0: t, d: 0.8 });
      V.fx.push({ k: 'spark', x: ax, y: ROW_P - PH * 0.5, t0: t, d: 0.5, c: x.type === 'pot' ? '#ff7a8a' : blue ? '#8ac8ff' : '#c8ffb0' });
    } else if (x.type === 'skill') {
      const ax = at('a' + x.s), s = SKILLS[x.id];
      if (ax != null && s) callout(ax, ROW_P - PH - 4, s.name, SKILL_CLS[s.kind] || '');
      if (s && (s.kind === 'mdmg' || s.kind === 'heal')) V.atk['a' + x.s] = t;
    } else if (x.type === 'buff') {
      const s = SKILLS[x.id], col = s && s.kind === 'taunt' ? '#ff5a4a' : BUFF_C[s && s.stat] || '#e8e2d0';
      const list = x.party ? team.map(a => a.id) : [x.s];
      list.forEach(id => { const ax = at('a' + id); if (ax != null) V.fx.push({ k: 'spark', x: ax, y: ROW_P - PH * 0.5, t0: t, d: 0.6, c: col }); });
    } else if (x.type === 'kill') {
      const fx0 = at('f' + x.d);
      if (fx0 != null) V.ghosts.push({ id: x.id, x: fx0, t0: t, sc: x.sc || 0, face: fx0 < AW / 2 - 6 ? 1 : -1 });
    } else if (x.type === 'loot' || x.type === 'gear') {
      const fx0 = V.ghosts.length ? V.ghosts[V.ghosts.length - 1].x : AW / 2;
      V.fx.push({ k: 'icon', id: x.type === 'gear' ? { icon: GTYPES[x.base].icon, c: TIER_COLORS[x.t] } : x.id, x: fx0 + (x.type === 'gear' ? 6 : 0), y: ROW_E - 10, t0: t, d: x.type === 'gear' ? 1.4 : 0.9 });
    } else if (x.type === 'down') {
      const ax = at('a' + x.d);
      if (ax != null) { V.fx.push({ k: 'num', x: ax, y: ROW_P - PH - 12, s: 'DOWN', c: '#ff6a5a', t0: t, d: 1.4 }); V.fx.push({ k: 'spark', x: ax, y: ROW_P - PH * 0.5, t0: t, d: 0.6, c: '#ff6a5a' }); }
      V.shake = 4;
    } else if (x.type === 'lvl') {
      const ax = at('a' + x.d);
      if (ax != null) V.fx.push({ k: 'num', x: ax, y: ROW_P - PH - 16, s: 'LV UP', c: '#f0b43c', t0: t, d: 1.2 });
    } else if (x.type === 'spawn' && (x.boss || x.amb)) {
      V.shake = x.boss ? 6 : 4;
      if (x.name) callout(AW / 2, ROW_E - 40, x.name, 'boss');
    }
    else if (x.type === 'enter') V.shake = 3;
  }
}

function fx(g, t) {
  V.fx = V.fx.filter(f => t - f.t0 < f.d);
  const P = (x, y, w, h, c) => R(g, Math.round(x * 2) / 2, Math.round(y * 2) / 2, w, h, c);
  for (const f of V.fx) {
    const k = (t - f.t0) / f.d;
    if (k < 0) continue;
    if (f.k === 'num') drawNum(g, f.x, Math.round(f.y - k * 10), f.s, f.c);
    else if (f.k === 'proj') {
      const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k, L = Math.hypot(f.x1 - f.x0, f.y1 - f.y0) || 1, ux = (f.x1 - f.x0) / L, uy = (f.y1 - f.y0) / L;
      for (let i = 0; i < 6; i++) P(x - ux * i * 0.8, y - uy * i * 0.8, 1, 1, f.c);
      if (f.tip) P(x + ux, y + uy, 1, 1, f.tip);
    } else if (f.k === 'orb') {
      const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k, L = Math.hypot(f.x1 - f.x0, f.y1 - f.y0) || 1, ux = (f.x1 - f.x0) / L, uy = (f.y1 - f.y0) / L;
      if (f.big) { P(x - 2, y - 2, 4, 4, f.c); P(x - ux * 4 - 1, y - uy * 4 - 1, 2, 2, f.c); P(x - ux * 7, y - uy * 7, 1, 1, f.c); }
      else P(x - 1.5, y - 1.5, 3, 3, f.c);
      P(x - 0.5, y - 0.5, 1, 1, f.c2);
    } else if (f.k === 'wind') {
      const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k;
      for (let i = 0; i < 8; i++) { const a = i * 0.8 + k * 9; P(x + Math.cos(a) * (2 + i * 0.5), y + Math.sin(a) * (1 + i * 0.3), 1, 1, i % 2 ? '#c8ffd8' : '#7ae0a0'); }
    } else if (f.k === 'bolt') {
      let px = f.x, py = AHZ - 20;
      for (let i = 1; i <= 6; i++) {
        const nx = f.x + (i === 6 ? 0 : (Math.random() - 0.5) * 10), ny = AHZ - 20 + (f.y - AHZ + 20) * i / 6;
        const n = Math.max(Math.abs(nx - px), Math.abs(ny - py)) * 2;
        for (let j = 0; j <= n; j++) { const u = j / n; P(px + (nx - px) * u, py + (ny - py) * u, 1, 1, j % 3 ? '#fff8a0' : '#ffffff'); }
        px = nx; py = ny;
      }
    } else if (f.k === 'beam') {
      const h = (f.y - 0) * Math.min(1, k * 3);
      R(g, f.x - 3, f.y - h, 6, h, 'rgba(240,216,112,0.55)'); R(g, f.x - 1.5, f.y - h, 3, h, '#fff8d0');
    } else if (f.k === 'slash') {
      const r = f.big ? 11 : 8;
      for (let i = 0; i < 12; i++) { const a = -2.4 + i * 0.32 + k * 0.6; P(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r * 0.9, 1, 1, f.c); if (i % 2) P(f.x + Math.cos(a) * (r - 1.5), f.y + Math.sin(a) * (r - 1.5) * 0.9, 0.5, 0.5, f.c); }
    } else if (f.k === 'claw') {
      for (let j = -1; j <= 1; j++) for (let i = 0; i < 7; i++) P(f.x - 5 + i * 1.5 + j * 3, f.y - 5 + i * 1.5, 1, 1, i < 7 * k + 2 ? '#ff8a7a' : 'rgba(0,0,0,0)');
    } else if (f.k === 'wave') {
      const r = 6 + k * 120;
      for (const s of [-1, 1]) { P(f.x + s * r, ROW_P - 3, 3, 2, '#e0503f'); P(f.x + s * (r - 5), ROW_P - 2, 2, 1.5, '#ff9a7a'); }
    } else if (f.k === 'spark') {
      for (let i = 0; i < 5; i++) { const a = i * 1.26 + k * 3; P(f.x + Math.cos(a) * (3 + k * 7), f.y + Math.sin(a) * (3 + k * 6) - k * 8, 1, 1, f.c); }
    } else if (f.k === 'icon') drawIcon(g, f.id, Math.round(f.x - 5), Math.round(f.y - k * 18));
  }
}

/* ───────── 전투 기록: 사건을 문장으로 ───────── */
// 받침이 있으면 앞의 조사, 없으면 뒤의 조사
function jo(w, a, b) { const c = String(w).charCodeAt(String(w).length - 1); return w + (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 ? a : b); }
const LOG_MAX = 80;
function logEvent(x, e, p) {
  const A = id => { const a = advById(id); return a ? a.name : '동료'; };
  const Fn = uid => V.fname[uid] || '몬스터';
  const ally = s => `<b class="lg-a">${esc(s)}</b>`, foe = s => `<b class="lg-f">${esc(s)}</b>`, num = (v, c) => `<b class="lg-${c || 'n'}">${fmt(v)}</b>`;
  const add = (h, c) => { V.log.push({ n: ++V.logN, h, c: c || '' }); if (V.log.length > LOG_MAX) V.log.shift(); };
  if (x.type === 'hit') {
    if (x.dot && !x.v) return;
    if (x.k === 'poison' || x.k === 'curse') return add(`${foe(jo(Fn(x.d), '이', '가'))} ${x.k === 'curse' ? '저주' : '독'}로 ${num(x.v)} 피해를 입었습니다.`, 'dim');
    if (x.k === 'pet') return add(`${ally(A(x.s))}의 동료 짐승이 ${foe(Fn(x.d))}에게 ${num(x.v)} 피해!`);
    return add(`${x.c ? '<i class="lg-c">치명타!</i> ' : ''}${ally(jo(A(x.s), '이', '가'))} ${foe(Fn(x.d))}에게 ${num(x.v, x.c ? 'c' : '')} 피해를 줬습니다.`);
  }
  if (x.type === 'fmiss') return add(`${ally(A(x.s))}의 공격이 ${foe(Fn(x.d))}에게 빗나갔습니다.`, 'dim');
  if (x.type === 'hurt') return add(`${foe(Fn(x.s))}의 공격! ${ally(jo(A(x.d), '이', '가'))} ${num(x.v, 'r')} 피해를 입었습니다.`);
  if (x.type === 'miss') return add(`${ally(jo(A(x.d), '이', '가'))} ${foe(Fn(x.s))}의 공격을 피했습니다.`, 'dim');
  if (x.type === 'aoe') return add(`${foe(Fn(x.s))}의 광역 공격!`, 'warn');
  if (x.type === 'heal') return add(x.s === x.d ? `${ally(jo(A(x.d), '이', '가'))} HP를 ${num(x.v, 'g')} 회복했습니다.` : `${ally(jo(A(x.s), '이', '가'))} ${ally(A(x.d))}의 HP를 ${num(x.v, 'g')} 치유했습니다.`);
  if (x.type === 'pot') return add(`${ally(jo(A(x.d), '이', '가'))} 회복 물약으로 HP ${num(x.v, 'g')} 회복.`);
  if (x.type === 'mana') return add(`${ally(jo(A(x.d), '이', '가'))} 마나 물약으로 MP ${num(x.v, 'b')} 회복.`);
  if (x.type === 'skill') { const s = SKILLS[x.id]; if (s) add(`${ally(jo(A(x.s), '이', '가'))} 「${esc(s.name)}」${s.kind === 'heal' ? '을(를) 외웠습니다.' : '!'}`, 'sk'); return; }
  if (x.type === 'kill') return add(`${foe(jo(Fn(x.d), '을', '를'))} 처치했습니다!`, 'kill');
  if (x.type === 'loot') { const it = ITEMS[x.id]; if (it) add(`전리품 <b class="lg-l">${esc(it.name)}</b> 획득`, 'loot'); return; }
  if (x.type === 'gear') return add(`장비 <b class="lg-l">${esc(GTYPES[x.base].name)}</b> 획득!`, 'loot');
  if (x.type === 'down') return add(`${ally(jo(A(x.d), '이', '가'))} 쓰러졌습니다. 들것에 싣습니다.`, 'bad');
  if (x.type === 'lvl') { const a = advById(x.d); if (a) add(`${ally(A(x.d))} 레벨 업! LV ${a.lv}`, 'lvl'); return; }
  if (x.type === 'spawn') { const fs = e.foes.map(f => f.name || MONS[f.id].name); if (fs.length) add(`${x.boss ? '<i class="lg-c">보스!</i> ' : x.amb ? '<i class="lg-c">기습!</i> ' : ''}${fs.map(foe).join(', ')} 출현`, x.boss ? 'warn' : ''); return; }
  if (x.type === 'clear') return add('전투에서 이겼습니다.', 'dim');
  if (x.type === 'flee') return add('파티가 전투에서 물러났습니다.', 'bad');
  if (x.type === 'camp') return add('모닥불을 피우고 쉬어 갑니다.', 'dim');
  if (x.type === 'wake') return add('다시 길을 나섭니다.', 'dim');
  if (x.type === 'enter') return add(`${esc(FIELDS[e.field].dungeon.name)}에 들어섰습니다.`, 'warn');
  if (x.type === 'turn') return add('상단으로 발길을 돌립니다.', 'dim');
}

/* 날씨와 생물 (빛을 입힌 뒤에 그린다) */
function ambient(g, id, t, T) {
  const dark = T.dark[1], wrap = (v, m) => ((v % m) + m) % m, P = (x, y, w, h, c) => R(g, Math.round(x * 2) / 2, Math.round(y * 2) / 2, w, h, c);
  if ((id === 'plains' || id === 'forest') && dark > 0.2) for (let i = 0; i < 12; i++) { const x = wrap(i * 41 + Math.sin(t * 0.7 + i) * 14, AW), y = AHZ + 20 + (i * 17) % 90 + Math.sin(t * 1.3 + i * 2) * 5; if (Math.sin(t * 2.5 + i * 1.7) > 0.1) P(x, y, 1, 1, `rgba(220,255,120,${Math.min(1, dark * 1.8).toFixed(2)})`); }
  if (id === 'forest') for (let i = 0; i < 10; i++) P(wrap(i * 53 + t * 6 + Math.sin(t + i) * 10, AW), wrap(i * 29 + t * (10 + i % 4 * 3), AH), 1.5, 1, ['#c86a2a', '#d89a3a', '#6aa84f'][i % 3]);
  if (id === 'snow') for (let i = 0; i < 46; i++) { const s = i % 7 ? 1 : 1.5; P(wrap(i * 53 + t * (8 + (i % 5) * 3) + Math.sin(t + i) * 4, AW), wrap(i * 37 + t * (14 + (i % 4) * 4), AH), s, s, '#ffffff'); }
  if (id === 'mountain') for (let i = 0; i < 9; i++) P(wrap(i * 71 - t * 110, AW + 40) - 20, 12 + (i * 23) % 150, 8 + (i % 3) * 4, 0.5, 'rgba(255,255,255,0.45)');
  if (id === 'desert' && dark < 0.4) for (let i = 0; i < 9; i++) P(wrap(i * 61 - t * 40, AW + 30) - 15, AHZ + 10 + (i * 19) % 110, 5 + i % 4, 0.5, 'rgba(240,210,150,0.6)');
  if (id === 'valley') for (let i = 0; i < 4; i++) { const x = wrap(i * 80 + t * 22 + Math.sin(t * 3 + i) * 8, AW + 40) - 20, y = 18 + i * 10 + Math.sin(t * 4 + i) * 4, f = Math.floor(t * 8 + i) % 2; P(x - 2, y + f * 0.5, 2, 0.5, '#3a2a34'); P(x, y, 0.5, 1, '#3a2a34'); P(x + 0.5, y + f * 0.5, 2, 0.5, '#3a2a34'); }
  if (DUN[id]) for (let i = 0; i < 14; i++) P(wrap(i * 37 + Math.sin(t * 0.4 + i) * 8, AW), 40 + wrap(i * 23 - t * 3, 150), 0.5, 0.5, 'rgba(255,230,180,0.4)');
  if (id === 'town') for (let i = 0; i < 3; i++) { const k = wrap(t * 0.25 + i * 0.33, 1); P(70 + i * 50 + Math.sin(t + i) * 2, 40 - k * 30, 1.5, 1.5, `rgba(200,200,210,${(0.5 * (1 - k)).toFixed(2)})`); }
}

/* ───────── 전투 창: 무대 전체 + 전투 기록 ───────── */
function openBattle() { const top = winTop(); if (top && top.id === 'battle') return; openWin('battle'); }
function showBattle(on) {
  V.bopen = !!on;
  $('bwin').hidden = !on;
  clearCallouts();
  if (!on) return;
  V.bdrawn = 0; V.bparty = -1; $('bw-log').textContent = '';
  requestAnimationFrame(() => { fitCanvas(V.bcv, AW * HI, AH * HI); renderBattle(); });
}
// 글자 부분: 제목, 진행, 기록 (그림은 drawFrame이 그린다)
function renderBattle() {
  if (!V.bopen || !S) return;
  const p = viewParty(), e = p && p.exp;
  $('bw-title').textContent = p ? `${p.name} · ${e ? whereStr(e) : '상단 앞'}` : '원정';
  $('bw-st').textContent = !p ? '' : e ? expStatus(p) : p.members.length ? '대기 중 · 원정 메뉴에서 출발' : '파티원이 없어요';
  const k = e ? (e.stage - 1 + e.pos / STAGE_LEN) / (e.area === 'dungeon' ? DUNGEON_FLOORS : FIELD_STAGES) : 0;
  $('bw-prog').style.width = Math.round(Math.max(0, Math.min(1, k)) * 100) + '%';
  $('bw-load').hidden = !e; if (e) $('bw-load').innerHTML = `짐 <span class="${usedOf(p) >= capOf(p) ? 'warn' : 'gold'}">${usedOf(p)}/${capOf(p)}</span>`;
  const rt = $('bw-ret');
  rt.hidden = !e || e.mode === 'return'; rt.dataset.id = p ? p.id : '';
  const gate = $('bw-gate');
  gate.hidden = !(e && e.wait === 'gate');
  if (!gate.hidden) gate.querySelectorAll('button').forEach(x => { x.dataset.id = p.id; });
  // 기록: 새 줄만 붙인다 (파티를 바꾸면 처음부터)
  const box = $('bw-log'), first = V.log.length ? V.log[0].n : 0;
  if (V.bparty !== V.logP || V.bdrawn < first - 1 || V.bdrawn > V.logN) { box.textContent = ''; V.bdrawn = Math.max(0, first - 1); V.bparty = V.logP; }
  const stick = box.scrollHeight - box.scrollTop - box.clientHeight < 24;
  let html = '';
  for (const l of V.log) if (l.n > V.bdrawn) html += `<p class="${l.c}">${l.h}</p>`;
  if (html) {
    box.insertAdjacentHTML('beforeend', html);
    V.bdrawn = V.logN;
    while (box.children.length > LOG_MAX) box.firstChild.remove();
    if (stick) box.scrollTop = box.scrollHeight;
  }
  if (!V.log.length && !box.children.length) box.innerHTML = '<p class="dim empty">아직 기록이 없어요. 전투가 벌어지면 여기에 적혀요.</p>';
  else if (V.log.length) { const em = box.querySelector('.empty'); if (em) em.remove(); }
}

/* 첫 화면: 거리 무대에 네 사람 */
function drawStill(g, id, cast, t) {
  arenaSky(g, id, t, clockDp());
  g.drawImage(arenaBg(id).cv, 0, 0, AW, AH);
  cast.forEach((a, i) => { const x = partyX(i, cast.length); shadowAt(g, x, ROW_P, 9); g.save(); g.translate(x, ROW_P); drawAdv(g, a, t, { ph: i * 0.5, z: ZP }); g.restore(); });
}
