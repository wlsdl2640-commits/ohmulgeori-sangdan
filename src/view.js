/* ───────── 전투 화면: 원근 무대 위에 적은 가운데 줄, 파티는 아래 줄 ─────────
   무대(240×200)를 한 번 그려서, 작은 창에는 가운데 띠만, 전투 창에는 전체를 보여 준다. */
const PIP_Y = 64, PIP_H = 128;
const ZP = 1.5, ZE = 1.25;                                // 무대 배율: 앞줄 파티는 크게, 적은 조금 작게
const PH = 21 * ZP;                                       // 파티원 키 (논리 픽셀)
const zq = z => Math.max(0.25, Math.round(z * 4) / 4);   // 배율은 1/4 단위 (구운 그림을 다시 쓰게)
const eW = f => monW(f.id, f.sc) * ZE, eH = f => monH(f.id, f.sc) * ZE;
const V = { cvs: null, ctx: null, off: null, g: null, wc: null, w: null, lc: null, l: null, bcv: null, bctx: null, bopen: false,
  mode: '', lastN: 0, lastF: 0, scroll: 0, fx: [], ghosts: [], flash: {}, flash0: {}, lunge: {}, atk: {}, mot: {}, fmot: {}, fhit: {}, motLast: {}, skSeen: {}, jump: {}, fall: {}, last: {}, shake: 0, giant: false,
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
  const k = Math.min(2.5, (S && S.speed) || 1), dur = cls === 'boss' || cls === 'rare' ? 2.3 : 1.1;
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
    if (key !== V.mode) { V.fx = []; V.ghosts = []; V.flash = {}; V.flash0 = {}; V.lunge = {}; V.atk = {}; V.mot = {}; V.fmot = {}; V.fhit = {}; V.jump = {}; V.fall = {}; clearCallouts(); }
    if (p && V.logP !== p.id) { V.log = []; V.logP = p.id; V.logN = 0; }
    V.mode = key; V.lastN = e ? e.evN : 0;
  }
  V.lastF = now;
  const g = V.g, w = V.w, dp = clockDp();
  const F = e && FIELDS[e.field];
  const id = e ? (e.area === 'dungeon' ? F.dungeon.bg : F.bg === 'forest' && e.stage > 20 ? 'primeval' : F.bg) : 'front';
  const bg = getBg(id), oy = bg.tall ? 0 : BG_OY;
  // 옆으로 흐르는 풍경: 간 거리만큼 (상단 앞은 멈춰 있다)
  if (e) { const target = routePos(e) * 1.6; if (Math.abs(target - V.scroll) > 200) V.scroll = target; else V.scroll += (target - V.scroll) * 0.2; } else V.scroll = 0;
  w.clearRect(0, 0, AW, AH);
  // 옛 240×128 풍경을 무대 아래쪽에 붙이고, 위는 하늘로 잇는다 (키 큰 풍경은 무대 전체)
  const T = todAt(dp, id);
  if (bg.under) R(g, 0, 0, AW, AH, '#000');
  else { R(g, 0, 0, AW, BG_OY + 1, T.sky[0]); if (T.star > 0.02) for (const st of STARS) { const tw = 0.55 + 0.45 * Math.sin(t * (1.5 + st.b * 2) + st.p), a = T.star * tw * (0.5 + st.b * 0.5); if (a > 0.05) R(g, st.x, Math.round(st.y * BG_OY / 70), 1, 1, `rgba(255,250,235,${a.toFixed(2)})`); } }
  g.save(); g.translate(0, BG_OY); drawSky(g, id, V.scroll, t, dp); g.restore();
  w.save(); w.translate(0, oy); drawLand(w, id, V.scroll, t, T); w.restore();
  if (!bg.under) groundWx(w, wxNow(e || null), oy);   // 겨울 눈 덮인 땅 · 젖은 땅
  if (id === 'forest' && !bg.tall) { R(w, 0, 0, AW, BG_OY + 2, '#24472c'); for (let i = 0; i < 16; i++) { const x = ((i * 53 - V.scroll * 0.5) % (AW + 60) + AW + 60) % (AW + 60) - 30, y = BG_OY - 2 - (i % 3) * 7; ell(w, Math.round(x), y, 22, 8, i % 2 ? '#2f5a35' : '#2a5030'); ell(w, Math.round(x) - 6, y - 5, 10, 4, '#3f7a44'); } }   // 숲: 위쪽을 우듬지로 잇는다
  if (bg.under && !bg.tall) { R(w, 0, 0, AW, BG_OY + 1, bg.wall); for (let y = 4; y < BG_OY; y += 8) R(w, 0, y, AW, 1, shade(bg.wall, -0.25)); w.save(); w.beginPath(); w.rect(0, 0, AW, BG_OY); w.clip(); w.translate(0, BG_OY - 128); tile(w, bg.foreTall, V.scroll * 1.25, 0); w.restore(); }
  const lights = [], post = [];
  const dark = bg.under ? (bg.dark != null ? bg.dark : 0.34) : T.dark[1], dcol = bg.under ? '#05040a' : T.dark[0];
  if (e) fieldScene(w, t, p, e, lights, post, dark, bg); else townScene(w, t, p, lights, post, dark);
  w.save(); w.translate(0, oy); drawFore(w, id, V.scroll); w.restore();
  for (const l of bgLights(id, V.scroll, dark)) lights.push({ x: l.x, y: l.y + oy, r: l.r, c: l.c, glow: l.glow, flick: l.flick });
  if (dark > 0.01) applyDark(w, dark, dcol, lights);
  g.drawImage(V.wc, 0, 0, AW, AH);
  if (dark > 0.05) glows(g, lights, dark);
  g.save(); g.translate(0, oy); bgEmit(g, id, V.scroll, t, dark); g.restore();
  for (const f of post) f(g);
  if (e) fx(g, t);
  g.save(); g.translate(0, bg.tall ? 0 : BG_OY); drawAmbient(g, id, V.scroll, t, T); g.restore();
  if (!bg.under) drawWeather(g, wxNow(e || null), t, BG_OY);   // 비·눈·바람·안개 (실내·던전은 없다)
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

/* ───────── 상단 앞 (원정 중이 아닐 때): 입구 앞에 선 파티, 거리를 오가는 사람들 ───────── */
const TOWNSFOLK = [
  { cls: 'porter', look: { hair: '#5a3a22', skin: '#e0ac7e' }, id: 1, sp: 14, off: 0, dir: 1 },
  { cls: 'cleric', look: { hair: '#c9a04a', skin: '#f1c9a5' }, id: 2, sp: 11, off: 150, dir: -1 },
  { cls: 'archer', look: { hair: '#2b1d16', skin: '#c68a5e' }, id: 3, sp: 16, off: 260, dir: 1 }
];
// 입구 앞 자리: 넷까지 한 줄, 그보다 많으면 두 줄
function frontSlots(n) {
  if (n <= 4) { const sp = n > 3 ? 40 : 46; return Array.from({ length: n }, (_, i) => [Math.round(120 + (i - (n - 1) / 2) * sp), 190]); }
  const back = Math.ceil(n / 2), front = n - back, out = [];
  for (let i = 0; i < back; i++) out.push([Math.round(120 + (i - (back - 1) / 2) * 44), 181]);
  for (let i = 0; i < front; i++) out.push([Math.round(120 + (i - (front - 1) / 2) * 44 + (front === back ? 22 : 0)), 191]);
  return out;
}
/* ───────── 왕국 상단의 마차: 방문하는 동안 상단 앞 오른쪽에 서 있고, 올 때 굴러 들어오고 갈 때 굴러 나간다 ───────── */
const COACH_PARK = 166;   // 서 있을 때 마차 몸통 왼쪽 끝 x (말은 그 왼쪽, 문 앞을 가리지 않게)
const COACH_RUN = 3.2;    // 들어오고 나가는 데 걸리는 시간(초)
function coachState(t) {
  const v = S.king && S.king.visit, k = v ? v.k : null;
  if (k !== V.coachK) {   // 방문이 시작됐거나(들어온다) 끝났다(나간다)
    if (k) V.coach = { k, t0: t, out: 0 };
    else if (V.coach) { V.coach.out = 1; V.coach.t0 = t; }
    V.coachK = k;
  }
  const c = V.coach;
  if (!c || !KINGDOMS[c.k]) return null;
  const p = Math.min(1, (t - c.t0) / COACH_RUN), far = AW + 120;
  if (c.out) { if (p >= 1) { V.coach = null; return null; } return { k: c.k, x: Math.round(COACH_PARK + (far - COACH_PARK) * p * p), moving: 1 }; }
  const ease = 1 - Math.pow(1 - p, 3);
  return { k: c.k, x: Math.round(far - (far - COACH_PARK) * ease), moving: p < 1 };
}
// 왼쪽을 보는 화려한 사륜마차. X: 몸통 왼쪽 끝, gy: 땅. 왕국 색 몸통에 금 테두리, 백마 두 필, 마부.
// 작은 캔버스에 원래 크기로 그린 뒤 COACH_Z배로 또렷하게 키워 붙인다 (사람보다 큼직하게)
const COACH_Z = 1.5, COACH_OX = 52, COACH_OY = 57;
function drawCoach(w0, X, gy, t, D, moving, lights, dark) {
  if (!V.coachCv) V.coachCv = mkCanvas(112, 60);
  const [cv, w] = V.coachCv; w.clearRect(0, 0, cv.width, cv.height);
  const x = COACH_OX, gy0 = COACH_OY;
  shadowAt(w0, X + 24 * COACH_Z, gy, 30); shadowAt(w0, X - 22 * COACH_Z, gy, 14);
  const C = D.c, Cd = shade(C, -0.38), Cl = shade(C, 0.22), G = D.c2, Gd = shade(G, -0.3), Gl = shade(G, 0.35);
  const WD = '#4a3020', WDd = '#2e1c10', IR = '#26262e', GL = '#1a1a26';
  const bob = moving ? (Math.floor(t * 8) % 2 ? -1 : 0) : 0;
  const horse = (hx, hy, c, ph) => {   // hx: 가슴 앞(왼쪽) x, hy: 발 딛는 선
    const cd = shade(c, -0.28), mane = '#3a2a22';
    [[hx + 4, 0], [hx + 7, 2], [hx + 14, 1], [hx + 17, 3]].forEach(([lx, k]) => { const sw = moving ? Math.round(Math.sin(t * 15 + k * 1.6 + ph) * 2) : 0; R(w, lx + sw, hy - 8, 2, 8, k % 2 ? cd : c); R(w, lx + sw, hy - 1, 2, 1, '#1e1a1a'); });
    ell(w, hx + 11, hy - 11, 9, 4, c); R(w, hx + 4, hy - 9, 14, 1, cd);
    R(w, hx + 2, hy - 18, 4, 7, c); R(w, hx + 1, hy - 20, 4, 3, c); R(w, hx - 3, hy - 20, 5, 3, c); R(w, hx - 3, hy - 18, 3, 1, cd);
    R(w, hx + 2, hy - 22, 1, 2, c); R(w, hx + 4, hy - 22, 1, 2, c); R(w, hx - 2, hy - 19, 1, 1, '#1a1a1a');
    for (let i = 0; i < 6; i++) R(w, hx + 5 + i, hy - 20 + i, 1, 2, mane);
    const tf = Math.round(Math.sin(t * 3 + ph)); R(w, hx + 20, hy - 13, 1, 3, mane); R(w, hx + 21 + tf, hy - 11, 1, 5, mane);
    R(w, hx + 8, hy - 14, 1, 6, G); R(w, hx - 3, hy - 18, 6, 1, G); R(w, hx + 1, hy - 23, 1, 1, G);   // 금 마구와 깃
  };
  const wheel = (cx, cy, r) => {
    disc(w, cx, cy, r, IR); disc(w, cx, cy, r - 1, '#5a4a3a'); disc(w, cx, cy, r - 2, '#16141a');
    const a0 = moving ? -t * 9 : 0.4;
    for (let i = 0; i < 4; i++) { const a = a0 + i * Math.PI / 4; for (let s = -(r - 2); s <= r - 2; s++) R(w, Math.round(cx + Math.cos(a) * s), Math.round(cy + Math.sin(a) * s), 1, 1, '#c8a060'); }
    disc(w, cx, cy, 1, G);
  };
  const gyS = gy; const y = gy0 + bob; gy = gy0;
  horse(x - 30, gy - 2, '#d8d0c4', 1.3); horse(x - 33, gy, '#ece6dc', 0);
  R(w, x - 12, y - 11, 16, 1, WD); R(w, x - 14, y - 12, 3, 1, WD);   // 끌채
  for (let i = 0; i < 25; i++) R(w, x - 6 - i, y - 35 + Math.round(i * 0.68), 1, 1, '#5a4a3a');   // 고삐
  // 차대·발판·몸통
  R(w, x + 2, y - 12, 42, 2, WDd); R(w, x - 2, y - 11, 5, 2, WD); R(w, x + 44, y - 10, 4, 1, WD);
  R(w, x + 4, y - 32, 38, 19, C); R(w, x + 6, y - 13, 34, 2, C); R(w, x + 8, y - 11, 30, 1, Cd);
  R(w, x + 4, y - 32, 38, 1, Cl); R(w, x + 4, y - 14, 38, 1, Cd);
  R(w, x + 4, y - 25, 38, 1, G); R(w, x + 4, y - 16, 38, 1, Gd); R(w, x + 4, y - 32, 1, 18, Gd); R(w, x + 41, y - 32, 1, 18, Gd);
  for (const wx of [x + 8, x + 30]) { R(w, wx, y - 30, 8, 7, GL); R(w, wx, y - 30, 2, 7, G); R(w, wx + 6, y - 30, 2, 7, G); R(w, wx + 2, y - 29, 4, 2, '#4a5a7a'); }
  R(w, x + 19, y - 31, 9, 17, Cd); R(w, x + 20, y - 30, 7, 15, C); R(w, x + 21, y - 29, 5, 5, GL); R(w, x + 22, y - 28, 3, 1, '#4a5a7a');
  disc(w, x + 23, y - 20, 2, G); R(w, x + 22, y - 21, 3, 1, Gl); R(w, x + 26, y - 23, 1, 2, Gl);   // 문장과 손잡이
  // 지붕과 짐 난간, 꼭대기 장식, 뒤 짐가방
  R(w, x + 2, y - 35, 42, 3, '#2a2228'); R(w, x + 2, y - 35, 42, 1, '#3e343a'); R(w, x + 6, y - 37, 34, 2, '#3a2e34'); for (let i = 0; i < 6; i++) R(w, x + 8 + i * 6, y - 38, 1, 1, G);
  R(w, x + 22, y - 40, 2, 3, G); R(w, x + 21, y - 41, 4, 1, Gl);
  R(w, x + 42, y - 24, 5, 10, '#6a4a30'); R(w, x + 42, y - 24, 5, 1, '#8a6a44'); R(w, x + 43, y - 20, 3, 1, G);
  // 앞 등불
  R(w, x + 1, y - 31, 1, 3, IR); R(w, x - 1, y - 28, 4, 5, '#3a3a40'); R(w, x, y - 27, 2, 3, dark > 0.12 ? '#ffe8a0' : '#f0c060');
  if (lights && dark > 0.12) lights.push({ x: X + 1 * COACH_Z, y: gyS - 26 * COACH_Z, r: 34, c: '#f0c060', glow: 1, flick: 1 });
  // 마부석과 마부 (모자·얼굴·왕국 색 외투·채찍)
  R(w, x - 6, y - 33, 14, 2, WD); R(w, x - 6, y - 31, 2, 3, WD); R(w, x + 6, y - 31, 2, 3, WD);
  R(w, x - 3, y - 31, 2, 3, '#2a2228'); R(w, x, y - 31, 2, 3, '#2a2228'); R(w, x - 3, y - 28, 2, 1, '#1a1a1a'); R(w, x, y - 28, 2, 1, '#1a1a1a');   // 다리·구두
  R(w, x - 3, y - 38, 7, 5, G); R(w, x - 3, y - 38, 7, 1, Gl); R(w, x - 5, y - 36, 3, 1, G); R(w, x - 6, y - 36, 1, 1, '#e8b890');   // 외투·팔·손
  R(w, x - 1, y - 41, 3, 3, '#e8b890'); R(w, x - 2, y - 43, 5, 2, '#2a2228'); R(w, x - 1, y - 45, 3, 2, '#2a2228'); R(w, x - 2, y - 42, 5, 1, G);   // 얼굴·모자
  if (moving) { R(w, x - 9, y - 45, 1, 9, '#6a4a30'); R(w, x - 12 + (Math.floor(t * 6) % 2), y - 47, 3, 2, '#6a4a30'); }
  // 바퀴 (가까운 쪽이라 몸통 위에)
  wheel(x + 37, gy - 8, 8); wheel(x + 9, gy - 6, 6);
  w0.drawImage(cv, 0, 0, cv.width, cv.height, X - COACH_OX * COACH_Z, gyS - COACH_OY * COACH_Z, cv.width * COACH_Z, cv.height * COACH_Z);
}
function townScene(w, t, p, lights, post, dark) {
  // 거리를 지나가는 사람들 (파티 뒤, 밤에는 한 명만)
  TOWNSFOLK.forEach((v, i) => {
    if (i && dark > 0.3) return;
    const span = AW + 70, k = ((t * v.sp + v.off) % span + span) % span, x = v.dir > 0 ? k - 35 : AW + 35 - k;
    w.save(); w.translate(Math.round(x), 181); shadowAt(w, 0, 0, 7); if (v.dir < 0) w.scale(-1, 1); drawAdv(w, v, t, { walk: 1, ph: i, side: 1, z: zq(1.1) }); w.restore();
  });
  const coach = coachState(t);   // 왕국 상단의 마차 (파티 뒤)
  if (coach) drawCoach(w, coach.x, 181, t, KINGDOMS[coach.k], coach.moving, lights, dark);
  if (p && p.wagon) drawRig(w, 30, 182, t, p, false, 1);   // 상단 앞에 세워 둔 이 파티의 마차
  let list = p ? teamOf(p) : [];
  if (!list.length) list = S.advs.filter(a => a.status === 'idle').slice(0, 6);
  list = list.slice(0, 6);
  const slots = frontSlots(list.length);
  list.forEach((a, i) => {
    const [x, y] = slots[i], z = zq(y > 185 ? ZS : ZS * 0.92);
    shadowAt(w, x, y, 9 * z / ZS);
    w.save(); w.translate(x, y); drawAdv(w, a, t, { ph: i * 0.5, z }); w.restore();
  });
}

// 상태이상 표시: 막대 위에 색점 (중독 초록 · 화상 주황 · 출혈 빨강 · 냉기 하늘 · 감전 노랑 · 마비 보라 · 기절 흰색 · 쇠약 회색)
function staDots(g, st, x, y) {
  if (!st) return;
  let i = 0;
  for (const k of STATUS_IDS) if (st[k]) { R(g, x + i * 3, y, 2, 2, STATUS[k].c); i++; }
}
/* ───────── 원정 (옆모습): 파티는 왼쪽, 적은 오른쪽. 앞줄이 크고 뒷줄이 작다 ───────── */
const ORBIT = { elementalist: ['#7ae0a0', '#f0a040'], necromancer: ['#b88aff', '#6a4aa8'] };
const SLOT_P = [[98, 198], [66, 192], [90, 186], [58, 180], [82, 174], [50, 168], [36, 196], [26, 184], [44, 172], [16, 176]];   // 7번째부터는 레이드대(짐꾼 포함 10명)
const ZS = 1.25;   // 옆모습 배율
const giantZ = f => zq(Math.min(1.75, 100 / monW(f.id)));
const zAt = y => zq(ZS * (0.8 + 0.2 * Math.max(0, Math.min(1, (y - 166) / 32))));
const SHADOW_R = 9;
function foeSlots(foes) {
  if (foes.length === 1) { const f = foes[0]; if (f.giant) { const z = giantZ(f); return [[AW - monW(f.id) * z / 2 - 8, 194]]; } return [[150, 194]]; }
  return foes.map((f, i) => { const [x, y] = SLOT_P[Math.min(5, i)]; return [AW - x + 6 - (f.boss ? 12 : 0), y]; });
}
function fieldScene(w, t, p, e, lights, post, dark, bg) {
  const all = teamOf(p), team = all.filter(a => !a.down).concat(all.filter(a => a.down));   // 들것은 맨 끝
  const fighting = e.foes.length > 0, camping = !!e.camp && !fighting, waiting = !!e.wait && !fighting;
  const walking = !fighting && !camping && !waiting;
  const F = FIELDS[e.field];
  const gap = !fighting && !camping && e.encs[e.ei] != null ? Math.abs(e.encs[e.ei] - e.pos) : 99;
  const foes = fighting ? e.foes : camping || gap > 30 ? [] : (e.next || []);
  const appr = fighting ? 0 : Math.max(0, Math.min(1, gap / 30));
  V.giant = foes.some(f => f.giant);
  for (const f of e.foes.concat(e.next || [])) V.fname[f.uid] = f.name || MONS[f.id].name;
  const pos = {}, n = team.length, draws = [], dir = e.mode === 'return' ? -1 : 1, mx = x => (dir > 0 ? x : AW - x);
  V.dir = dir;
  team.forEach((a, i) => { const [x, y] = SLOT_P[Math.min(SLOT_P.length - 1, i)]; pos['a' + a.id] = [mx(x), y]; });
  const pet = petOfParty(p);
  if (pet) pos['aP' + pet.id] = n > 6 ? [mx(8), 199] : [mx(34), 197];
  foeSlots(foes).forEach(([x, y], i) => { pos['f' + foes[i].uid] = [mx(x + appr * 90), y]; });
  Object.assign(V.last, pos);
  events(e, pos, t, team, p);

  // 던전 입구: 1-50 끝에서 길 끝에 서 있다
  const fs = S.fields[e.field];
  if (e.area === 'field' && fs && !F.raid && (waiting || (e.stage === FIELD_STAGES && e.mode === 'advance' && !fighting && e.pos > 55))) {
    const k = waiting ? 0 : Math.max(0, Math.min(1, (STAGE_LEN - e.pos) / 45));
    w.save(); w.translate(190 + k * 120, GY + BG_OY); w.scale(1.25, 1.25); drawGate(w, F.dungeon.bg, fs.cleared ? 1 : fs.found ? 0 : 2); w.restore();
  }

  // 야영: 모닥불을 둘러앉는다
  if (camping) {
    const cx = AW / 2, cy = GL + 16, sleep = e.camp.t > 1.5, tent = !!e.camp.tent;
    if (tent) {   // 정찰가의 텐트: 모닥불 대신 큰 텐트를 치고 그 옆에 나란히 눕는다
      w.save(); w.translate(cx - 62, GL + 2); w.scale(1.7, 1.7); drawTentHi(w); w.restore();
    } else { w.save(); w.translate(cx + 78, GL + 4); drawTentHi(w); w.restore(); }
    team.forEach((a, i) => {
      const side = i % 2 ? 1 : -1, k = Math.floor(i / 2), zz = sleep && (a.fat || 0) > 4;
      const x = tent ? cx - 14 + i * 20 : cx + side * (zz ? 26 + k * 24 : 18 + k * 17), y = tent ? cy + 2 : cy;
      pos['a' + a.id] = [x, y];
      shadowAt(w, x, y, zz ? 14 : 8);
      w.save(); w.translate(x, y); w.scale(tent ? 1 : side > 0 ? -1 : 1, 1); drawAdv(w, a, t, { sit: !zz, sleep: zz, z: ZS, side: 1 }); w.restore();
      if (zz) post.push(g => drawZ(g, x + (tent ? 8 : -side * 8), y - 14, t, i * 0.3));
    });
    const cw = wxNow(e);
    if (tent) { const lx = cx - 14 + team.length * 20 + 6; post.push(g => lanternHi(g, lx, cy - 2, t)); lights.push({ x: lx, y: cy - 8, r: 80, c: '#f0c060', glow: 1, flick: 1 }); }
    else if (campWet(p, cw)) { post.push(g => { R(g, cx - 5, cy - 2, 11, 1, '#5e3c22'); R(g, cx - 4, cy - 3, 3, 1, '#4a3020'); R(g, cx + 2, cy - 3, 3, 1, '#4a3020'); for (let i = 0; i < 4; i++) { const k = ((t * 0.5 + i * 0.25) % 1); R(g, cx + Math.round(Math.sin(i * 5 + t) * 2), cy - 6 - Math.round(k * 16), 1, 1, `rgba(170,170,180,${(0.6 * (1 - k)).toFixed(2)})`); } }); }   // 비: 꺼진 장작에서 연기만
    else { const windy = campWindy(p, cw); post.push(g => fireHi(g, cx + (windy ? Math.round(Math.sin(t * 9)) : 0), cy, t)); lights.push({ x: cx, y: cy - 6, r: windy ? 55 : 90, c: '#f09040', glow: 1, flick: 1 }); }
    if (p.wagon && !bg.under) drawRig(w, tent ? 214 : 26, GL + 10, t, p, false, tent ? -1 : 1);
    return;
  }

  // 쓰러지는 적: 뒤로 넘어지며 사라진다
  V.ghosts = V.ghosts.filter(gh => t - gh.t0 < 0.9);
  for (const gh of V.ghosts) {
    const k = t - gh.t0, fall = Math.min(1, k / 0.32), ang = fall * fall * Math.PI / 2, fade = k < 0.45 ? 1 : Math.max(0, 1 - (k - 0.45) / 0.45);
    draws.push({ y: gh.y, f: g => {
      g.save(); g.globalAlpha = fade; g.translate(gh.x, gh.y);
      if (gh.adv) { g.scale(gh.face, 1); FLASH = k < 0.1 ? '#ffffff' : null; drawAdv(g, gh.adv, 0, { side: 1, down: 1, z: gh.z }); }
      else { g.rotate(gh.face < 0 ? ang : -ang); g.scale(gh.face, 1); FLASH = k < 0.1 ? '#ffffff' : null; drawMon(g, gh.id, 0, { sc: gh.sc, z: gh.z }); }
      FLASH = null; g.restore();
      if (k > 0.3) for (let i = 0; i < 6; i++) { const a = i * 1.05 + gh.x, u = (k - 0.3) / 0.6; R(g, Math.round((gh.x + Math.cos(a) * (6 + u * 18)) * 2) / 2, Math.round((gh.y - 6 - Math.sin(a) * 0.5 * (6 + u * 14) - u * 10) * 2) / 2, 2 - u, 2 - u, 'rgba(220,210,200,' + (0.7 * (1 - u)).toFixed(2) + ')'); }
    } });
  }

  // 적
  foes.forEach((f, i) => {
    const [x, y] = pos['f' + f.uid], z = f.giant ? giantZ(f) : zAt(y), fmo = fmotOK(f) ? fmotNow(f, t) : null;   // 언데드 동작 (빌드 43)
    const lg = fmo ? -fmotDx(f, fmo, z) * dir : (V.lunge['f' + f.uid] || 0) > t ? -5 * dir : 0;
    const jy = fmo ? fmotJy(f, fmo, z) : 0;   // 짐승이 뛰어오른 높이 (빌드 44): 그림자는 땅에
    const did = fmotOK(f) ? pxuLow(f) : f.id, lw0 = (V.lowSt || (V.lowSt = {}))[f.uid];   // 다친 모습 (빌드 44: 들쥐왕은 HP 30% 아래에서 망토가 찢어진다)
    V.lowSt[f.uid] = did;
    if (lw0 !== undefined && lw0 !== did && did !== f.id) V.fx.push({ k: 'skh', id: 'u:low:tear', x: x + 9 * z * dir, y: y - 13 * z, fy: y, h: 21 * z, t0: t, pre: 0, d: 1.2, big: 1, last: 1, dir: -dir, ax: x });
    if (fmo) post.push(g => fmotFx(g, f, fmo, x, y + jy, z, dir));
    draws.push({ y, f: g => {
      g.save(); g.translate(x + lg, y);
      shadowAt(g, 0, 0, Math.min(46, eW(f) * 0.45 * z / ZE) * (jy < -6 ? 0.7 : 1));
      if (jy) g.translate(0, jy);
      g.scale(-dir, 1);
      FLASH = !f.giant && (V.flash['f' + f.uid] || 0) > t && (V.flash0['f' + f.uid] || 0) <= t ? '#ffffff' : null;   // 레이드 몬스터는 번쩍이지 않는다
      if (f.adv) drawAdv(g, f.adv, t, { side: 1, z, ph: i * 0.5, atk: lg ? 1 : 0 });   // 투기장 상대: 모험가 옆모습
      else { drawMon(g, did, t, { ph: i * 0.37, sc: f.sc, z, mot: fmo }); if (f.rare && !FLASH) { FLASH = '#ffd040'; g.globalAlpha = 0.28 + 0.14 * Math.sin(t * 6); drawMon(g, did, t, { ph: i * 0.37, sc: f.sc, z, mot: fmo }); g.globalAlpha = 1; } }   // 희귀종: 금빛으로 반짝인다
      FLASH = null; g.restore();
    } });
    if (f.rare) post.push(g => { const h = eH(f) * z / ZE; for (let k = 0; k < 4; k++) { const ph = t * 1.6 + k * 1.57, sx = x + Math.cos(ph) * (10 + k * 3), sy = y - h * (0.3 + 0.6 * ((Math.sin(ph * 0.7 + k) + 1) / 2)), on = Math.sin(t * 5 + k * 2) > 0; if (on) { R(g, Math.round(sx), Math.round(sy) - 1, 1, 3, '#fff6c0'); R(g, Math.round(sx) - 1, Math.round(sy), 3, 1, '#ffd040'); } } });
    if (f.nest) post.push(g => { const yy = y - eH(f) * z / ZE - 5; R(g, x - 3, yy, 7, 2, '#a8743e'); R(g, x - 2, yy - 1, 5, 1, '#d8b878'); R(g, x - 1, yy - 2, 1, 1, '#f0e8d8'); R(g, x + 1, yy - 2, 1, 1, '#f0e8d8'); });
    if (!fighting) return;
    if (f.giant) post.push(g => { const fr0 = Math.max(0, f.hp / f.maxHp); bar(g, Math.min(x, AW - 56), y + 4, 100, fr0, '#e0503f', 3); drawNum(g, Math.min(x, AW - 56), y + 9, Math.ceil(fr0 * 100) + '%', '#ffffff'); });
    else post.push(g => {
      const bw = Math.max(14, Math.min(30, eW(f) * 0.6 * z / ZE));
      bar(g, x, y + 3, bw, f.hp / f.maxHp, f.boss ? '#f0b43c' : '#e0503f');
      if (f.dot) R(g, x - bw / 2 - 3, y + 3, 1.5, 1.5, f.dot.magic ? '#b88aff' : '#7ad83c');
      staDots(g, f.sta, x - bw / 2, y);
      if (f.slow > 0) R(g, x + bw / 2 + 1.5, y + 3, 1.5, 1.5, '#8ad8ff');
      if (f.fb) { const yy = y - eH(f) * z / ZE - 6; R(g, x - 3, yy, 7, 2, '#f0b43c'); R(g, x - 3, yy - 2, 1, 2, '#f0b43c'); R(g, x, yy - 2, 1, 2, '#f0b43c'); R(g, x + 3, yy - 2, 1, 2, '#f0b43c'); }
    });
  });

  // 펫: 파티 뒤에서 따라다니며 cd마다 앞으로 튀어나온다 (빌드 48: 파티와 같은 쪽을 본다 — 예전에는 뒤를 보고 있었다 · 큰 펫은 너비 44 안으로)
  if (pet) {
    const [px, py] = pos['aP' + pet.id], pz = zAt(py) * (pet.stage ? 0.72 * monFit(petLook(pet), 44) : 1.1), pat = V.atk['aP' + pet.id], plunge = pat && t - pat < 0.3;
    const hop = walking ? Math.abs(Math.sin(t * 7)) * 2 : plunge ? Math.sin((t - pat) / 0.3 * Math.PI) * 4 : Math.abs(Math.sin(t * 2.5)) * 0.6;
    const pdx = (plunge ? Math.sin((t - pat) / 0.3 * Math.PI) * 14 : 0) * dir;
    draws.push({ y: py - 1, f: g => {
      shadowAt(g, px + pdx, py, 5 * pz);
      g.save(); g.translate(px + pdx, py - hop); g.scale(dir, 1);
      drawMon(g, petLook(pet), t, { ph: 0.7, z: pz });
      g.restore();
    } });
  }
  // 마차: 파티 뒤를 따라온다 (던전·레이드·투기장에는 두고 온다)
  if (p.wagon && !bg.under && (e.area === 'field' || e.area === 'trade' || e.area === 'wave')) draws.push({ y: 160, f: g => drawRig(g, mx(20), 170, t, p, walking, dir) });
  // 파티
  team.forEach((a, i) => {
    const [x0, y0] = pos['a' + a.id], z = zAt(y0);
    const ft = V.fall['a' + a.id], falling = ft && t - ft < 0.5;
    if (a.down && !falling) {   // 들것 위에 누워 있다
      draws.push({ y: y0, f: g => { shadowAt(g, x0, y0, 18 * z / ZS); g.save(); g.translate(x0, y0); g.scale(dir * z / ZS, z / ZS); stretcherHi(g, a, t, walking); g.restore(); } });
      return;
    }
    const at = V.atk['a' + a.id], lunging = at && t - at < 0.26, atkF = lunging ? (t - at < 0.08 ? 0 : 1) : 0;
    const melee = CLASSES[a.cls].act === 'melee';
    const jt = V.jump['a' + a.id], jy = jt && t >= jt && t - jt < 0.4 ? -Math.round(Math.sin((t - jt) / 0.4 * Math.PI) * 14) : 0;
    const mo = !a.down && !falling ? motNow(a, t) : null, mF = mo && pxsMotFr(mo.mk, mo.f);   // 공격 동작 (빌드 40)
    const msk = mo && mo.sk && SKFX[mo.sk], dashK = msk && msk.dash && mo.f >= 3 && mo.f <= 6 ? 1.8 : 1;   // 스킬 효과 (빌드 41): 돌진은 더 멀리
    const mjy = mo ? Math.round(motJy(mo) * 2 * z) : 0;   // 도약 찌르기 (빌드 42): 동작이 뛰는 높이를 정한다
    const dx = ((mo ? mF.dx * 2 * z * dashK : lunging && melee && atkF ? 8 : 0) + (jy ? 10 : 0)) * dir, y = y0 + jy + mjy;
    if (mo) post.push(g => motFx(g, a, mo, x0 + ((jy ? 10 : 0) + (dashK > 1 ? mF.dx * 2 * z * (dashK - 1) : 0)) * dir, y, z, dir, t));
    draws.push({ y: y0, f: g => {
      shadowAt(g, x0 + dx, y0, (jy || mjy < -4 ? 7 : SHADOW_R) * z / ZS);
      if (msk) skGhosts(g, a, mo, msk, x0 + dx, y, z, dir, t);
      g.save(); g.translate(x0 + dx, y); g.scale(dir, 1);
      if (falling) { const k = Math.max(0, Math.min(1, (t - ft) / 0.3)); g.rotate(-k * k * Math.PI / 2); }
      FLASH = (V.flash['a' + a.id] || 0) > t && (V.flash0['a' + a.id] || 0) <= t ? '#ffffff' : null;
      drawAdv(g, a, t, { walk: walking && !falling, ph: i * 0.5, atk: lunging && !mo, atkF, mot: mo, z, side: 1 });
      FLASH = null; g.restore();
    } });
    if (ORBIT[a.cls]) post.push(g => { const [c1, c2] = ORBIT[a.cls]; for (let k = 0; k < 2; k++) { const ang = t * 3 + k * Math.PI; R(g, Math.round((x0 + Math.cos(ang) * 12) * 2) / 2, Math.round((y - PH * 0.55 + Math.sin(ang) * 4) * 2) / 2, 1.5, 1.5, k ? c2 : c1); } });
    const d = derive(a);
    post.push(g => {
      bar(g, x0, y0 + 3, 22, a.hp / d.maxHp, '#e0503f');
      bar(g, x0, y0 + 5.5, 22, a.mp / Math.max(1, d.maxMp), '#4a8ae8', 1);
      const shp = e.buffs.reduce((s2, b) => s2 + (b.stat === 'shield' && b.to === a.id ? Math.max(0, b.hp) : 0), 0); if (shp) bar(g, x0, y0 + 1.5, 22, Math.min(1, shp / d.maxHp), '#8ad8ff', 1);   // 보호막
      if ((a.fat || 0) >= 60) R(g, x0 + 12.5, y0 + 3, 1.5, 1.5, a.fat >= 85 ? '#e0503f' : '#f0b43c');
      staDots(g, e.sta && e.sta[a.id], x0 - 11, y0);
      if (e.taunt && e.taunt.aid === a.id) drawNum(g, x0, y - 21 * z - 6, '!', '#ff5a4a');
    });
  });
  // 뒤에 선 것부터 그린다
  draws.sort((a, b) => a.y - b.y).forEach(d => d.f(w));
  if (dark > 0.25 && team.length && !bg.under) { const [px0, py0] = pos['a' + team[0].id], lx = px0 + 11 * dir, ly = py0 - 12; lights.push({ x: lx, y: ly, r: 70, c: '#f0c060', glow: 1, flick: 1 }); post.push(g => { R(g, lx - 1, ly - 1.5, 2.5, 3, '#f7d070'); R(g, lx - 0.5, ly - 0.5, 1, 1, '#ffffff'); }); }
  else if (bg.under && team.length) lights.push({ x: 80, y: 170, r: 96, c: '#f0c060' });
  if (waiting) post.push(g => { const k = Math.floor(t * 2) % 2; drawNum(g, 190, GY + BG_OY - 40 - k, '?', '#f0b43c'); });
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
  const g = pxGrid(40, 26);
  pxPut(g, pxRows(`
...............vv.......................
..............QQQQ......................
.............QQQQQQ.....................
............QQQQQQQQ....................
...........QQQQKKQQQQC..................
..........QQQQKKKKQQQQCC................
.........QQQQKKKKKKQQQQCCC..............
........QQQQKKKKKKKKQQQQCCCc............
.......QQQQKKKKKKKKKKQQQQCCCCc..........
......QQQQKKKKKKKKKKKKQQQQCCCCCc........
.....QQQQKKKKKKKKKKKKKKQQQQCCCCCCc......
....QQQQKKKKKKKKKKKKKKKKQQQQCCCCCCCc....
...QQQQKKKKKKKKKKKKKKKKKKQQQQCCCCCCCCc..
..QQQQKKKKKKKKKKKKKKKKKKKKQQQQCCCCCCCCCc
.vccccccccccccccccccccccccccccccccccccv.
`), 0, 10);
  pxBlit(ctx, pxBake('tentHi', g, { Q: '#e0c88a', C: '#c8a868', c: '#8a6a3a', K: '#2a1d14', v: '#6b4a2e' }, 20, 25));
}
// 텐트 옆 등불
function lanternHi(g, x, y, t) {
  const gr = pxGrid(8, 14);
  pxPut(gr, pxRows(`
...vv...
..vKKv..
..KYYK..
..KYYK..
..KyyK..
..vKKv..
...vv...
...v....
...v....
...v....
..vvv...
`), 0, 0);
  const f = Math.floor(t * 6) % 2;
  g.save(); g.translate(x, y);
  pxBlit(g, pxBake('lanternHi' + f, gr, { v: '#5e3c22', K: '#3a2a1a', Y: f ? '#fff0a0' : '#f0c040', y: '#f08a2a' }, 4, 13));
  g.restore();
}
function fireHi(g, x, y, t) {
  g.save(); g.translate(x, y);
  const gr = pxGrid(30, 10);
  pxPut(gr, pxRows(`
......SSS..........SSS........
.....SNNNS...vvv..SNNNS.......
..SSS.SSS.vvVVVVvv.SSS.SSS....
.SNNNS...vVVVVVVVVv...SNNNS...
..SSS.....vvvvvvvv.....SSS....
`), 0, 2);
  pxBlit(g, pxBake('fireBase', gr, { S: '#8a8490', N: '#a8a2b0', v: '#5e3c22', V: '#7a5232' }, 15, 8));
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
  g.save(); g.translate(0, -3 + by); drawAdv(g, a, t, { down: 1, z: ZS, side: 1 }); g.restore();
  R(g, -0.5, -22 + by, 2, 0.5, '#e0503f'); R(g, 0, -22.5 + by, 1, 2, '#e0503f');
}

/* ───────── 사건 → 효과와 전투 기록 ───────── */
// 표창: 네 장으로 돌며 날아간다 (빌드 39). 0°·22.5°·45°·67.5° 별 + 검은 테두리. 색 = 표창 단계 모습
const SHURI_C = [['#b9bfcb', '#636873'], ['#f0f9ff', '#ff5959'], ['#7af04a', '#30303a'], ['#b48cff', '#633cb3']];
const SHURI_TRAIL = true;   // 시안 B: 잔상
const SHURI_FR = [0, 22.5, 45, 67.5].map(th => {
  const pts = new Map(); pts.set('0,0', 1);
  for (let k = 0; k < 4; k++) { const a = (th + 90 * k) * Math.PI / 180; for (const r of [1, 2.2]) pts.set(Math.round(r * Math.cos(a)) + ',' + Math.round(-r * Math.sin(a)), 0); }
  const star = [...pts].map(([q, c]) => { const [x, y] = q.split(',').map(Number); return [x, y, c]; }), out = new Map();
  for (const [x, y] of star) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = (x + dx) + ',' + (y + dy); if (!pts.has(q)) out.set(q, [x + dx, y + dy]); }
  return { star, out: [...out.values()] };
});
const shuriLook = id => { const a = typeof advById === 'function' ? advById(id) : null, g = a && a.eq && a.eq.off; return g && g.base === 'shuriken' ? offLook(g.t) : 0; };
const PROJ = { arrow: 0.18, magic: 0.24, fire: 0.26, ice: 0.22, bolt: 0.06, holy: 0.1, wind: 0.24, dark: 0.26, jump: 0.2, spell: 0.2, note: 0.24, pet: 0 };
const SKILL_CLS = { heal: 'heal', buff: 'buff', taunt: 'buff', mdmg: 'magic', dot: 'dot', shield: 'buff', regen: 'heal', revive: 'heal' };
const BUFF_C = { atk: '#ff8a4a', def: '#7ab8ff', eva: '#e8e2d0', spd: '#ffe08a', matk: '#c89aff', block: '#9aa0a8', counter: '#f0c070', rheal: '#8af08a', shield: '#8ad8ff', regen: '#8af08a', crit: '#ffd060', cdr: '#c0a0ff', guard: '#9ab0c8' };
const HIT_C = { melee: ['#ffffff', '#fff2a0'], jump: ['#fff2a0', '#ffffff'], pet: ['#f0c070', '#ffffff'], arrow: ['#e8e2d0', '#ffffff'], magic: ['#b48aff', '#ffffff'], spell: ['#8ab8ff', '#ffffff'], fire: ['#ff7a2a', '#ffe08a'], ice: ['#8ad8ff', '#ffffff'], bolt: ['#fff8a0', '#ffffff'], holy: ['#fff0b0', '#ffffff'], wind: ['#7ae0a0', '#c8ffd8'], dark: ['#7a3ad0', '#d8a8ff'], note: ['#f0d870', '#ffffff'] };
// 스킬 효과 (빌드 41): 돌진 잔상 · 온몸 기운 (그림을 스킬 색으로 겹쳐 그린다)
function skGhosts(g, a, mo, sk, x, y, z, dir, t) {
  const P = SK_PAL[sk.pal], one = (ox, oy, al) => { g.save(); g.globalAlpha = al; g.translate(x + ox, y + oy); g.scale(dir, 1); FLASH = P[2]; drawAdv(g, a, t, { side: 1, z, mot: mo }); FLASH = null; g.restore(); };
  if (sk.dash && mo.f >= 4 && mo.f <= 6) for (let k = 1; k <= 3; k++) one(-k * 9 * dir, 0, 0.5 - k * 0.12);
  if (sk.charge === 'aura' && mo.first && mo.f >= 1 && mo.f <= 3 && Math.floor(t * 20) % 2) for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) one(ox, oy, 0.55);
}
/* 공격 동작 (빌드 40): 칼을 든 모험가는 여러 장 동작(pxs.js PXS_MOT). 기본 공격은 무작위 자세, 스킬은 스킬에 맞는 자세(MOT_SKILL).
   여러 번 치는 스킬은 동작을 잇는다: 앞 동작의 맞히는 장을 MOT_HOLD만큼 보이고 다음 동작은 셋째 장(MOT_CHAIN0)부터.
   적 쪽 효과·숫자·소리·번쩍임은 맞히는 장에 맞춰 늦춘다(motOn이 남은 시간을 돌려준다). 막으면 방패 막기, 치유·강화는 칼 치켜들기/방패 세우기 */
const MOT_BASIC = ['down', 'up', 'side', 'thrust'];
const MOT_SKILL = {
  bash: 'down', sweep: 'side', earthsplit: 'down', titanblow: 'down', kn_charge: 'thrust', dw_smash: 'down', shockwave: 'down', awk_warrior: 'down', awk2_warrior: 'down',
  ar_combo: ['down', 'up', 'side'], ar_finish: 'thrust',
  arena: ['down', 'up'], execute: ['down', 'up', 'down'], spinslash: 'side', glory: ['down', 'up', 'side'], finale: ['side', 'up', 'down', 'thrust'], colosseum: 'side',
  shieldbash: 'bash', lancecharge: 'thrust', holystrike: 'down', judgment: 'raise', divinity: 'raise',
  twinslash: ['down', 'up'], crossslash: 'down', blitz: ['thrust', 'side', 'up', 'down', 'thrust'], twinstorm: ['side', 'side'],
  bladewaltz: ['side', 'up', 'down'], swordrain: ['down', 'down'], thousandcut: ['down', 'up', 'side', 'thrust'],
  flameblade: 'down', frostblade: 'side', thunderblade: 'up', spellsword: 'thrust', starblade: 'down', dimension: 'side', swordsaint: 'down'
};
const MOT_HOLD = 0.08, MOT_CHAIN0 = 2, MOT_PAL = [['#ffffff', '#fff2a0', '#a8a090'], ['#fffbe0', '#ffd84a', '#c8a060']];   // 효과 색: 보통 · 치명타
const motToHit = q => (q.T || pxsMotT(q.mk)).slice(q.f0 || 0, pxsMotHit(q.mk)).reduce((s, v) => s + v, 0);
const motT = (mk, hold) => pxsMotT(mk).map((v, f) => v + (f === 2 ? hold || 0 : 0));   // 스킬: 셋째 장(모으기)을 hold초 더 붙잡는다
/* 무기 갈래마다 (빌드 42): 기본 공격 자세 · 그 갈래가 가진 동작 · 다른 갈래 동작을 이 갈래로 바꾸는 표(역할: 내려치기 cut · 올려치기 rise · 휩쓸기 sweep ·
   찌르기 stab · 난도질 flurry · 내려찍기 slam · 쏘기 shoot · 모아 쏘기 cast · 치켜들기 raise) */
const MOT_POOL = {
  sword: ['down', 'up', 'side', 'thrust'], dagger: ['down', 'up', 'side', 'thrust', 'hack'], heavy: ['down', 'up', 'side', 'smash'],
  pole: ['pthrust', 'pup', 'plow', 'pswing'], staff: ['spush', 'sjab', 'sswing'], bow: ['bshot', 'bshot', 'bshot', 'bdiag', 'bdiag', 'bswing'], lute: ['lstrum', 'lstrum', 'lstrum', 'lswing']
};
const MOT_REPEAT = { bshot: 1, lstrum: 1 };   // 잇달아 나와도 되는 자세 (보통 쏘기·켜기)
const MOT_POOL_K = { staff: { melee: ['sjab', 'sswing'] }, heavy: { magic: ['spush', 'spushup'], spell: ['spush', 'spushup'] }, lute: { melee: ['lswing'] } };
const MOT_SWORDISH = ['down', 'up', 'side', 'thrust', 'hack', 'bash', 'block', 'raise', 'guard', 'salute', 'taunt', 'parry', 'ready', 'toss'];
const MOT_OWN = {
  sword: MOT_SWORDISH, dagger: MOT_SWORDISH, heavy: MOT_SWORDISH.filter(k => k !== 'thrust' && k !== 'hack').concat(['smash', 'spush', 'spushup']),
  pole: ['pthrust', 'pup', 'plow', 'pswing', 'pjump', 'pspin', 'praise'], staff: ['spush', 'sjab', 'spushup', 'sswing', 'scharge', 'sraise'],
  bow: ['bshot', 'bfull', 'bdiag', 'brapid', 'bswing', 'braise'], lute: ['lstrum', 'lraise', 'lswing']
};
const MOT_ROLE = { down: 'cut', up: 'rise', side: 'sweep', thrust: 'stab', hack: 'flurry', smash: 'slam', bash: 'stab', block: 'raise', raise: 'raise', guard: 'raise', salute: 'raise', taunt: 'raise', parry: 'raise', ready: 'raise', toss: 'rise',
  pthrust: 'stab', pup: 'rise', plow: 'stab', pswing: 'cut', pjump: 'slam', pspin: 'sweep', praise: 'raise', spush: 'shoot', sjab: 'stab', spushup: 'rise', sswing: 'cut', scharge: 'cast', sraise: 'raise',
  bshot: 'shoot', bfull: 'cast', bdiag: 'rise', brapid: 'flurry', bswing: 'cut', braise: 'raise', lstrum: 'shoot', lraise: 'raise', lswing: 'cut' };
const MOT_FAMR = {
  sword:  { cut: 'down', rise: 'up', sweep: 'side', stab: 'thrust', flurry: 'hack', slam: 'down', shoot: 'thrust', cast: 'raise', raise: 'raise' },
  dagger: { cut: 'down', rise: 'up', sweep: 'side', stab: 'thrust', flurry: 'hack', slam: 'down', shoot: 'thrust', cast: 'raise', raise: 'raise' },
  heavy:  { cut: 'down', rise: 'up', sweep: 'side', stab: 'down', flurry: 'down', slam: 'smash', shoot: 'spush', cast: 'spushup', raise: 'raise' },
  pole:   { cut: 'pswing', rise: 'pup', sweep: 'pspin', stab: 'pthrust', flurry: 'pthrust', slam: 'pjump', shoot: 'pthrust', cast: 'praise', raise: 'praise' },
  staff:  { cut: 'sswing', rise: 'spushup', sweep: 'sswing', stab: 'sjab', flurry: 'sjab', slam: 'sswing', shoot: 'spush', cast: 'scharge', raise: 'sraise' },
  bow:    { cut: 'bswing', rise: 'bdiag', sweep: 'bswing', stab: 'bshot', flurry: 'brapid', slam: 'bswing', shoot: 'bshot', cast: 'bfull', raise: 'braise' },
  lute:   { cut: 'lswing', rise: 'lswing', sweep: 'lswing', stab: 'lstrum', flurry: 'lstrum', slam: 'lswing', shoot: 'lstrum', cast: 'lraise', raise: 'lraise' }
};
// 이 모험가가 쓸 동작: 그 갈래에 있으면 그대로, 없으면 역할이 같은 동작
function motFam(a, mk) {
  const fam = pxsFam(a);
  if (MOT_OWN[fam].includes(mk)) return mk === 'bash' && !pxsMotShield(a) ? MOT_FAMR[fam].stab : mk;
  return MOT_FAMR[fam][MOT_ROLE[mk] || 'cut'];
}
function motPool(a, k) {
  const fam = pxsFam(a), byK = MOT_POOL_K[fam] && MOT_POOL_K[fam][k];
  let pool = byK || MOT_POOL[fam];
  if (pxsMotShield(a) && MOT_OWN[fam].includes('bash')) pool = pool.concat('bash');
  if (fam === 'sword' && (PXL[a.cls] || {}).twin) pool = pool.concat('hack');   // 쌍검은 난도질도
  return pool;
}
function motPick(a, sid, i, k) {
  const m = sid && ((SKFX[sid] && SKFX[sid].mot) || MOT_SKILL[sid]);
  if (m) return motFam(a, Array.isArray(m) ? m[i % m.length] : m);
  const pool = motPool(a, k), last = V.motLast[a.id];   // 같은 자세가 잇달아 나오지 않게
  const pick = pool.filter(q => q !== last || MOT_REPEAT[q]), mk = pick.length ? pick[Math.floor(Math.random() * pick.length)] : pool[0];
  V.motLast[a.id] = mk; return mk;
}
// 사건 하나(hit·fmiss)에 동작을 붙이고 맞히는(쏘는) 때까지 남은 초를 돌려준다 (동작이 없으면 0)
function motOn(a, x, t) {
  if (!a || a.down || !pxsMotOK(a) || x.sid === 'shuri' || x.k === 'pet') return 0;
  const key = 'a' + a.id, sid = x.sid || (x.ctr ? 'ctr' : '');
  let m = V.mot[key];
  if (x.dot) { if (!m || m.t !== t || !m.dot) return 0; m.lastQ = m.q[0]; return m.q[0].t0 + motToHit(m.q[0]) - t; }   // 지속 피해: skill 사건이 건 동작에 맞춘다
  const sk = x.sid && SKFX[x.sid] && SKFX[x.sid].mot ? x.sid : null;
  if (!m || m.t !== t || m.sid !== sid) { const mk = motPick(a, x.sid, 0, x.k); m = V.mot[key] = { t, sid, n: {}, q: [{ mk, t0: t, f0: 0, c: x.c, sk, T: motT(mk, sk && SKFX[sk].hold) }] }; }
  const n = (m.n[x.d] = (m.n[x.d] || 0) + 1) - 1;
  while (m.q.length <= n) { const q = m.q[m.q.length - 1], mk = motPick(a, x.sid, m.q.length, x.k); m.q.push({ mk, t0: q.t0 + motToHit(q) + MOT_HOLD, f0: MOT_CHAIN0, c: x.c, sk, T: pxsMotT(mk) }); }
  if (x.c) m.q[n].c = 1;
  m.lastN = n + 1; m.lastQ = m.q[n];
  return m.q[n].t0 + motToHit(m.q[n]) - t;
}
// 공격이 아닌 동작 (막기·치켜들기·방패 세우기): 다른 동작 중이 아닐 때(휘두르던 무기를 끊지 않는다), 막기는 방패가 있을 때 · 갈래에 맞게 바꾼다
function motCast(a, mk, t, blk, sk) {
  if (!a || a.down || !pxsMotOK(a) || motNow(a, t + 0.1)) return;
  if (blk && !pxsMotShield(a)) return;
  if (mk === 'guard' && !pxsMotShield(a)) mk = 'raise';
  mk = motFam(a, mk);
  V.mot['a' + a.id] = { t, sid: '#' + mk, n: {}, q: [{ mk, t0: t, f0: 0, sk: sk || null, T: motT(mk, sk && SKFX[sk] && SKFX[sk].hold) }] };
}
function motNow(a, t) {
  const m = V.mot['a' + a.id]; if (!m) return null;
  let q = null; for (const s of m.q) if (t >= s.t0) q = s;
  if (!q) return null;
  let e = t - q.t0; const T = q.T || pxsMotT(q.mk), q0 = m.q[0];
  for (let f = q.f0; f < T.length; f++) { if (e < T[f]) return { mk: q.mk, f, p: e / T[f], c: q.c, sk: q.sk, e: t - q0.t0, hit: motToHit(q0), first: q === q0 }; e -= T[f]; }
  if (q === m.q[m.q.length - 1]) delete V.mot['a' + a.id];
  return null;
}
// 뛰는 높이 (뭉툭 칸, 위 −): 장 사이를 부드럽게
const motJy = mo => { const A = pxsMotFr(mo.mk, mo.f).jy || 0, B = mo.f < 7 ? pxsMotFr(mo.mk, mo.f + 1).jy || 0 : 0; return A + (B - A) * (mo.p || 0); };
// 맞히는(쏘는) 장의 무기 끝 → 화면 자리: 화살·마법·음표가 여기서 떠난다
function motTip(a, mk, q, z) {
  const F = pxsMotFr(mk, pxsMotHit(mk)), wk = pxsWk(a), fam = PXS_FAMW[wk] || 'sword', A = pxsMAxis(F, wk);
  let X, Y;
  if (fam === 'bow') { X = A.o[0] + A.fwd[0] * 2.5; Y = A.o[1] + A.fwd[1] * 2.5; }
  else if (fam === 'lute' && F.la != null) { const lp = F.lp || [1, 3]; X = PXS_SH[0] + F.lean + lp[0] + 2; Y = PXS_SH[1] + F.cr + lp[1] - 1; }
  else { X = A.o[0] + A.u[0] * (A.L1 - 0.6); Y = A.o[1] + A.u[1] * (A.L1 - 0.6); }
  const dir = V.dir || 1;
  return [q[0] + (2 * (X + F.dx) - 19 + 1) * z * dir, q[1] + (2 * Y - 47 + 1 + 2 * (F.jy || 0)) * z];
}
// 칼끝 자취·찌르기 번쩍임·방패 충격·막기 불꽃: 그림과 같은 칸(뭉툭 칸 = 2×2 논리 픽셀), 어둠 위에
function motFx(g, a, mo, x0, y, z, dir, t) {
  const sk = mo.sk && SKFX[mo.sk] && !SKFX[mo.sk].cast ? SKFX[mo.sk] : null;
  g.save(); g.translate(x0, y); g.scale(dir * z, z);
  if (!(sk && skAdvFx(g, a, mo, sk, t || 0))) {
    const s = pxsAdvSprite(a, 'm:' + mo.mk, mo.f), F = s.mfx, pal = MOT_PAL[mo.c ? 1 : 0];
    if (F) for (const L of [F.back, F.front]) for (const [X, Y, ci] of L) R(g, 2 * X - 19, 2 * Y - 47, 2, 2, pal[ci]);
  }
  g.restore();
}
function events(e, pos, t, team, p) {
  const at = k => (pos[k] != null ? pos[k] : V.last[k]);
  const jx = () => { V.nj = ((V.nj || 0) + 1) % 5; return (V.nj - 2) * 5; }, jy = () => (V.nj % 2) * -5;   // 숫자가 겹치지 않게 조금씩 비킨다
  const foe = uid => e.foes.find(o => o.uid === uid);
  const fz = (f, y) => (f && f.giant ? giantZ(f) : zAt(y));
  const fmid = uid => { const f = foe(uid), q = at('f' + uid); return q ? [q[0], q[1] - (f ? Math.min(60, monH(f.id, f.sc) * fz(f, q[1])) : 12) * 0.5] : null; };
  const ftop = uid => { const f = foe(uid), q = at('f' + uid); return q ? [q[0], q[1] - (f ? Math.min(90, monH(f.id, f.sc) * fz(f, q[1])) : 16) - 4] : null; };
  const amid = id => { const q = at('a' + id); return q ? [q[0] + 4 * (V.dir || 1), q[1] - 12 * zAt(q[1])] : null; };
  const atop = id => { const q = at('a' + id); return q ? [q[0], q[1] - 21 * zAt(q[1]) - 6] : null; };
  const advOf = id => team.find(a => a.id === id);
  const sfxAt = (k, d) => (d > 0.02 ? setTimeout(() => sfx(k), d * 1000) : sfx(k));
  for (let xi = 0; xi < e.ev.length; xi++) {
    const x = e.ev[xi];
    if (x.n <= V.lastN) continue;
    const md = x.type === 'hit' || x.type === 'fmiss' ? motOn(advOf(x.s), x, t) : 0;   // 칼 동작: 맞히는 장까지 남은 시간
    const fd = (x.type === 'hurt' && !x.dot) || x.type === 'miss' || x.type === 'aoe' || (x.type === 'shield' && !x.on) ? fmotOn(e, x, t, e.ev[xi + 1], at) : 0;   // 몬스터 동작 (빌드 43): 맞는 때까지
    if (x.type === 'hit') { /* 소리는 맞는 때에 (아래 hit) */ }
    else if (x.type === 'hurt' && !x.dot) sfxAt('hurt', fd);
    else if (x.type === 'heal' || x.type === 'pot' || x.type === 'fheal') sfx(x.type === 'pot' ? 'pot' : 'heal');
    else if (x.type === 'buff' || x.type === 'revive' || (x.type === 'shield' && x.on)) sfx('buff');
    else if (x.type === 'kill') sfx('kill');
    else if (x.type === 'lvl' || x.type === 'petlvl') sfx('lvl');
    else if (x.type === 'down') sfx('down');
    else if (x.type === 'loot' || x.type === 'gear') sfx('loot');
    else if (x.type === 'miss' || x.type === 'fmiss') sfxAt('miss', x.type === 'miss' ? fd : md);
    else if (x.type === 'mastery') sfx('mast');
    else if (x.type === 'spawn' && x.boss) sfx('boss');
    else if (x.type === 'arena') sfx(x.win ? 'win' : 'lose');
    else if (x.type === 'wave') sfx('buff');
    else if (x.type === 'sta' && x.side !== 'f') sfxAt('warn', Math.max(0, (V.fhit['a' + x.d] || 0) - t));
    V.lastN = x.n;
    logEvent(x, e, p);
    if (x.type === 'hit') {
      const fm = fmid(x.d), ft = ftop(x.d);
      if (!fm) { if (!x.dot && x.v) sfx(x.c ? 'crit' : HIT_SFX[x.k] === undefined ? 'hit' : HIT_SFX[x.k]); continue; }
      if (x.k === 'poison' || x.k === 'curse' || x.k === 'burn' || x.k === 'bleed') { const cc = x.k === 'curse' ? '#c89aff' : x.k === 'burn' ? '#ff8a2a' : x.k === 'bleed' ? '#ff4a4a' : '#9ae86a'; V.fx.push({ k: 'num', x: ft[0] + jx(), y: ft[1] + jy(), s: String(x.v), c: cc, t0: t, d: 0.7 }); V.fx.push({ k: 'bubble', x: fm[0], y: fm[1], t0: t, d: 0.5, c: cc }); continue; }
      const am = amid(x.s);
      if (!am) { if (!x.dot && x.v) sfxAt(x.c ? 'crit' : HIT_SFX[x.k] === undefined ? 'hit' : HIT_SFX[x.k], md); continue; }
      if (!md) V.atk['a' + x.s] = t;   // 칼 동작이 없으면 예전 두 장 공격
      const mq = md && V.mot['a' + x.s] ? V.mot['a' + x.s].lastQ : null;   // 이 사건의 동작 칸 (빌드 42: 쏘는 자리 · 도약)
      if (x.k === 'jump' && !(mq && pxsMotFr(mq.mk, 3).jy)) V.jump['a' + x.s] = t + Math.max(0, md - 0.2);   // 동작이 뛰지 않으면 예전처럼 뛴다
      // 스킬 효과 (빌드 41): 초승달·땅 금은 적마다 늦게 닿는다 · (빌드 42) 지속 피해 스킬은 skill 사건이 건 동작의 스킬
      const am0 = V.mot['a' + x.s], sid = x.sid || (x.dot && mq && am0 && am0.dot ? am0.sid : null), sk = sid ? SKFX[sid] : null, dirv = V.dir || 1;
      const aq0 = at('a' + x.s), src = mq && aq0 && (PROJ[x.k] || (sk && sk.proj)) ? motTip(advOf(x.s), mq.mk, aq0, zAt(aq0[1])) : am;   // 화살·마법은 무기 끝에서
      let tw = 0, x0w = 0;
      if (sk && (sk.hit === 'wave' || sk.hit === 'quake')) { x0w = am[0] + (sk.hit === 'wave' ? 26 : 30) * dirv; tw = Math.abs(fm[0] - x0w) / (sk.hit === 'wave' ? SK_WAVE : SK_QUAKE); }
      const mel = mq && PXS_MOT_MELEE[mq.mk], arcK = mq && mq.mk === 'bdiag' ? 1.6 : 1, pre = (sk && SK_PRE[sk.hit]) || 0;
      const t1 = t + md + tw, delay = mel ? 0 : Math.max(pre, ((sk && sk.proj ? SK_PROJ_T[sk.proj] : PROJ[x.k]) || 0) * arcK), [c1, c2] = HIT_C[mel ? 'melee' : x.k] || HIT_C.melee;   // 사선 화살은 더 오래 난다 · 활·류트로 치면 바로
      if (!x.dot && x.v) sfxAt(x.c ? 'crit' : HIT_SFX[x.k] === undefined ? 'hit' : HIT_SFX[x.k], t1 + delay - t);
      if (sk) {
        const act = V.mot['a' + x.s], nth = act && act.sid === sid && act.lastN ? act.lastN : 1, last = nth >= ((SKILLS[sid] && SKILLS[sid].hits) || 1), fq = at('f' + x.d);
        V.fx.push({ k: 'skh', id: sid, x: fm[0], y: fm[1], fy: fq ? fq[1] : fm[1] + 10, h: fq ? Math.max(8, fq[1] - ft[1] - 4) : 20, t0: t1 + delay - pre, pre, d: 1.3 + pre, big: sk.lastBig ? (last ? sk.lastBig : 0) : sk.big || 0, last, dir: dirv, ax: am[0] });
        if (sk.proj && !mel) V.fx.push({ k: 'skp', id: sid, style: sk.proj, x0: src[0], y0: src[1], x1: fm[0], y1: fm[1], t0: t1, d: delay, arc: arcK > 1 ? 34 : sk.proj === 'flask' || sk.proj === 'junk' ? 16 : 0, dir: dirv, big: sk.big || 0 });
        const once = V.skSeen[x.s] && V.skSeen[x.s].key === sid + ':' + t ? V.skSeen[x.s] : (V.skSeen[x.s] = { key: sid + ':' + t });
        if (sk.hit === 'rain' && !once.r) { once.r = 1; for (let j = 0; j < 3; j++) V.fx.push({ k: 'skp', id: sid, style: 'arrow', x0: src[0], y0: src[1], x1: src[0] + (24 + j * 10) * dirv, y1: src[1] - 140, t0: t1 + j * 0.035, d: 0.2, dir: dirv }); }   // 화살비: 하늘로 쏘아 올린다
        if ((sk.hit === 'wave' || sk.hit === 'quake') && !once.w) {   // 한 번 쓸 때 한 번: 초승달 · 땅 금 (가장 먼 적까지)
          once.w = 1; const xs = e.foes.map(f => at('f' + f.uid)).filter(Boolean).map(q => q[0]), xe = xs.length ? (dirv > 0 ? Math.max(...xs) : Math.min(...xs)) + 10 * dirv : fm[0];
          if (sk.hit === 'wave') V.fx.push({ k: 'skw', id: x.sid, x0: x0w, y: fm[1], dir: dirv, t0: t + md, d: Math.abs(xe - x0w) / SK_WAVE + 0.3 });
          else V.fx.push({ k: 'skq', id: x.sid, x0: x0w, xe, gy: fq ? fq[1] : fm[1] + 10, dir: dirv, t0: t + md, d: Math.abs(xe - x0w) / SK_QUAKE + 1.2 });
        }
        if (sk.shake && last && !once.s) { once.s = 1; V.fx.push({ k: 'shk', id: sid, n: sk.shake, t0: t1 + delay, d: 0.1 }); }
      }
      const P = { x0: src[0], y0: src[1], x1: fm[0], y1: fm[1], t0: t1, d: delay, arc: arcK > 1 ? 34 : undefined };
      if (mq && PXS_MOT_SUB[mq.mk] && !x.dot) {   // 난도질: 베는 장마다 적에게 작은 불꽃
        const T = mq.T || pxsMotT(mq.mk); let tt = mq.t0;
        for (let f = mq.f0 || 0; f < T.length; f++) { if (PXS_MOT_SUB[mq.mk].includes(f) && f !== pxsMotHit(mq.mk)) V.fx.push({ k: 'burst', x: fm[0] + (f % 2 ? 4 : -3), y: fm[1] + (f % 3) * 3 - 3, t0: tt + T[f] * 0.5, d: 0.16, c: c1, c2 }); tt += T[f]; }
      }
      if (sk && !sk.keep) { /* 스킬 효과가 투사체·베기·터짐을 대신한다 */ }
      else if (mel) { /* 활·류트로 친다: 투사체 없음 */ }
      else if (x.sid === 'shuri') V.fx.push(Object.assign({ k: 'shuri', c: SHURI_C[shuriLook(x.s)] }, P));
      else if (x.k === 'arrow') V.fx.push(Object.assign({ k: 'arrow', c: x.dot ? '#7ad83c' : x.el && ELEMS[x.el] ? ELEMS[x.el].c : c1 }, P));   // 속성 화살은 그 색
      else if (x.k === 'magic' || x.k === 'spell' || x.k === 'note') V.fx.push(Object.assign({ k: 'orb', c: c1, c2, ring: 1, size: 2 }, P));
      else if (x.k === 'fire') V.fx.push(Object.assign({ k: 'orb', c: c1, c2, trail: 1, size: 3 }, P));
      else if (x.k === 'dark') V.fx.push(Object.assign({ k: 'orb', c: c1, c2, ring: 1, size: 3 }, P));
      else if (x.k === 'ice') V.fx.push(Object.assign({ k: 'shard', c: c1, c2 }, P));
      else if (x.k === 'wind') V.fx.push(Object.assign({ k: 'gust', c: c1, c2 }, P));
      else if (x.k === 'bolt') V.fx.push({ k: 'bolt', x: fm[0], y: fm[1] + 8, t0: t1, d: 0.22 });
      else if (x.k === 'holy') V.fx.push({ k: 'pillar', x: fm[0], y: fm[1] + 10, t0: t1, d: 0.45, c: c1, c2 });
      if (!sk && (x.k === 'melee' || x.k === 'jump' || x.k === 'pet' || mel)) V.fx.push({ k: 'slash', x: fm[0], y: fm[1], t0: t1 + delay, d: 0.22, c: x.c ? '#fff2a0' : '#ffffff', big: x.c || x.k === 'jump', dir: V.dir || 1 });
      if (!sk) V.fx.push({ k: 'burst', x: fm[0], y: fm[1], t0: t1 + delay, d: x.c ? 0.4 : 0.28, c: c1, c2, big: x.c });
      V.flash['f' + x.d] = t1 + delay + 0.09; V.flash0['f' + x.d] = t1 + delay;
      if (x.dot) V.fx.push({ k: 'spark', x: fm[0], y: fm[1], t0: t1 + delay, d: 0.5, c: '#7ad83c' });
      else if (x.imm) V.fx.push({ k: 'num', x: ft[0] + jx(), y: ft[1] + jy(), s: '면역', c: '#a9b0bd', t0: t1 + delay, d: 0.8 });
      else V.fx.push({ k: 'num', x: ft[0] + jx(), y: ft[1] + jy(), s: String(x.v), c: x.c ? '#f7e04a' : x.wk ? '#ffa04a' : x.res ? '#9ab4d0' : '#ffffff', t0: t1 + delay, d: x.c ? 0.9 : 0.7, big: x.c || x.wk });
      if (x.wk && !x.c) V.fx.push({ k: 'num', x: ft[0], y: ft[1] - 8, s: '약점', c: '#ffa04a', t0: t1 + delay, d: 0.7 });
      if (x.c) V.fx.push({ k: 'num', x: ft[0], y: ft[1] - 8, s: 'CRITICAL', c: '#ffb43c', t0: t1 + delay, d: 0.8 });
    } else if (x.type === 'fmiss') {
      const ft = ftop(x.d);
      if (!md) V.atk['a' + x.s] = t;
      if (ft) V.fx.push({ k: 'num', x: ft[0] + 2, y: ft[1] - 4, s: 'MISS', c: '#a9b0bd', t0: t + md, d: 0.6 });
    } else if (x.type === 'hurt' && x.dot) {
      const aq = at('a' + x.d);
      if (aq) { V.fx.push({ k: 'num', x: aq[0] + jx(), y: aq[1] - 21 * zAt(aq[1]) - 6, s: String(x.v), c: STATUS[x.k] ? STATUS[x.k].c : '#ff6a5a', t0: t, d: 0.7 }); V.fx.push({ k: 'bubble', x: aq[0], y: aq[1] - 10, t0: t, d: 0.5, c: STATUS[x.k] ? STATUS[x.k].c : '#ff6a5a' }); }
    } else if (x.type === 'sta') {
      const q = at((x.side === 'f' ? 'f' : 'a') + x.d), St = STATUS[x.k], dl = x.side !== 'f' ? Math.max(0, (V.fhit['a' + x.d] || 0) - t) : 0;
      if (q && St) { const cy = q[1] - 21 * zAt(q[1]) - 10; if (dl > 0.02) setTimeout(() => callout(q[0], cy, St.name + '!', 'dot'), dl * 1000); else callout(q[0], cy, St.name + '!', 'dot'); V.fx.push({ k: 'buff', x: q[0], y: q[1], t0: t + dl, d: 0.6, c: St.c }); }
    } else if (x.type === 'cure') {
      const aq = at('a' + x.d);
      if (aq) V.fx.push({ k: 'heal', x: aq[0], y: aq[1], t0: t, d: 0.6, c: '#c8f0ff' });
    } else if (x.type === 'hurt') {
      const am = amid(x.d), aq = at('a' + x.d);
      if (!am) continue;
      const T1 = t + fd;   // 맞는 때 (언데드는 동작이 닿는 때 · 그 밖은 바로)
      if (!fd) V.lunge['f' + x.s] = t + 0.14;
      if (x.blk) { V.fx.push({ k: 'num', x: aq[0] + 2, y: aq[1] - 21 * zAt(aq[1]) - 12, s: 'BLOCK', c: '#c8d8ff', t0: T1, d: 0.6 }); motCast(advOf(x.d), 'block', T1 - 0.1, 1); }
      V.flash['a' + x.d] = T1 + 0.1; V.flash0['a' + x.d] = T1; V.fhit['a' + x.d] = T1;
      const fm = fmid(x.s);
      if (fd) fmotHitFx(e, x, t, fd, am, aq, at);   // 언데드: 갈래 효과 (투사체 · 맞히기)
      else {
        if (fm && x.k === 'magic') V.fx.push({ k: 'orb', x0: fm[0], y0: fm[1], x1: am[0], y1: am[1], t0: t - 0.12, d: 0.14, c: '#d86aff', c2: '#ffffff', size: 2 });
        V.fx.push({ k: 'slash', x: am[0], y: am[1], t0: t, d: 0.18, c: '#ff8a7a', dir: -(V.dir || 1) });
        V.fx.push({ k: 'burst', x: am[0], y: am[1], t0: t, d: 0.25, c: '#ff6a5a', c2: '#ffd0c0' });
      }
      V.fx.push({ k: 'num', x: aq[0], y: aq[1] - 21 * zAt(aq[1]) - 6, s: String(x.v), c: x.c ? '#ff9a3a' : '#ff6a5a', t0: T1, d: 0.7 });
    } else if (x.type === 'miss') {
      const aq = at('a' + x.d);
      if (!fd) V.lunge['f' + x.s] = t + 0.14;
      if (aq) V.fx.push({ k: 'num', x: aq[0] + 2, y: aq[1] - 21 * zAt(aq[1]) - 12, s: 'MISS', c: '#cfe8ff', t0: t + fd, d: 0.6 });
    } else if (x.type === 'aoe') {
      const q = at('f' + x.s);
      if (fd) fmotAoe(e, x, t, fd, team, at);   // 언데드 광역기: 박쥐 떼 · 죽음의 파동 · 죽음의 회전 · 암흑 강타
      else { V.lunge['f' + x.s] = t + 0.25; V.shake = Math.max(V.shake, 3); V.fx.push({ k: 'wave', x: q ? q[0] : 170, y: 190, t0: t, d: 0.4 }); }
    } else if (x.type === 'heal' || x.type === 'pot' || x.type === 'mana') {
      const aq = at('a' + x.d);
      if (!aq) continue;
      const blue = x.type === 'mana';
      V.fx.push({ k: 'num', x: aq[0], y: aq[1] - 21 * zAt(aq[1]) - 6, s: '+' + x.v, c: blue ? '#7ab8ff' : '#7bd36a', t0: t, d: 0.8 });
      V.fx.push({ k: 'heal', x: aq[0], y: aq[1], t0: t, d: 0.7, c: x.type === 'pot' ? '#ff7a8a' : blue ? '#8ac8ff' : '#8af08a' });
    } else if (x.type === 'skill') {
      const aq = at('a' + x.s), s = SKILLS[x.id], sk = SKFX[x.id], ma = advOf(x.s), mot = ma && pxsMotOK(ma), cast = s && !['dmg', 'mdmg', 'dot'].includes(s.kind);
      if (aq && s) { callout(aq[0], aq[1] - 21 * zAt(aq[1]) - 4, s.name, SKILL_CLS[s.kind] || ''); if (!sk || (!sk.cast && !mot)) V.fx.push({ k: 'cast', x: aq[0], y: aq[1], t0: t, d: 0.35, c: s.kind === 'heal' ? '#8af08a' : s.kind === 'mdmg' ? '#b48aff' : '#fff2a0' }); }
      if (cast && mot) motCast(ma, sk && sk.mot ? sk.mot : (s.kind === 'buff' && ['def', 'block', 'guard'].includes(s.stat)) || s.kind === 'shield' ? 'guard' : 'raise', t, 0, sk ? x.id : null);
      else if (s && s.kind === 'dot' && mot && !x.pet) { const mk = motPick(ma, x.id, 0, s.fx || (s.magic ? 'magic' : 'melee')), sk2 = sk && sk.mot ? x.id : null; V.mot['a' + ma.id] = { t, sid: x.id, dot: 1, n: {}, q: [{ mk, t0: t, f0: 0, sk: sk2, T: motT(mk, sk2 && sk.hold) }] }; }   // 지속 피해 스킬도 동작 (빌드 42)
      else if (s && !mot && (s.kind === 'mdmg' || s.kind === 'heal')) V.atk['a' + x.s] = t;
      if (cast && sk && sk.cast && aq) V.fx.push({ k: 'skc', id: x.id, x: aq[0], y: aq[1], z: zAt(aq[1]), dir: V.dir || 1, t0: t, d: 1.6, tg: sk.party ? team.filter(m => !m.down && m.id !== x.s).map(m => at('a' + m.id)).filter(Boolean).map(q => [q[0], q[1], zAt(q[1])]) : [] });
    } else if (x.type === 'buff') {
      const s = SKILLS[x.id], col = x.pet ? BUFF_C[x.pet === 'song' ? 'atk' : 'def'] : s && s.kind === 'taunt' ? '#ff5a4a' : BUFF_C[s && s.stat] || '#e8e2d0';
      if (x.pet) { const pq = at('a' + x.s); if (pq) callout(pq[0], pq[1] - 18, PET_ACT_NAME[x.pet] + '!', 'buff'); }
      const list = x.party ? team.map(a => a.id) : [x.s];
      list.forEach(id => { const aq = at('a' + id); if (aq) V.fx.push({ k: 'buff', x: aq[0], y: aq[1], t0: t, d: 0.7, c: col }); });
    } else if (x.type === 'shield') {   // 보호막이 생기거나 깎일 때: 하늘색 테
      const aq = at('a' + x.d); if (aq) V.fx.push({ k: 'buff', x: aq[0], y: aq[1], t0: t + fd, d: x.on ? 0.7 : 0.35, c: '#8ad8ff' });
    } else if (x.type === 'cover') {    // 엄호: 탱커 위에 방패 글자
      const aq = at('a' + x.s); if (aq) callout(aq[0], aq[1] - 21 * zAt(aq[1]) - 4, '엄호!', 'buff');
    } else if (x.type === 'combo') {    // 연계: 중첩 수
      const aq = at('a' + x.s); if (aq && (x.c === 3 || x.c === COMBO_MAX)) callout(aq[0], aq[1] - 21 * zAt(aq[1]) - 4, x.c === COMBO_MAX ? '연계 MAX' : `연계 ${x.c}`, '');
    } else if (x.type === 'noammo') {   // 화살이 떨어진 궁수
      const aq = at('a' + x.s); if (aq) callout(aq[0], aq[1] - 21 * zAt(aq[1]) - 4, x.k === 'shuri' ? '표창 없음!' : '화살 없음!', 'noammo');
    } else if (x.type === 'jackpot') {  // 대박
      const aq = at('a' + x.s); if (aq) callout(aq[0], aq[1] - 21 * zAt(aq[1]) - 4, '대박!', 'buff');
    } else if (x.type === 'revive') {   // 부활: 금빛 테
      const aq = at('a' + x.d); if (aq) { V.fx.push({ k: 'buff', x: aq[0], y: aq[1], t0: t, d: 1.0, c: '#ffe08a' }); callout(aq[0], aq[1] - 21 * zAt(aq[1]) - 4, '부활!', 'buff'); }
    } else if (x.type === 'kill') {
      const q = at('f' + x.d);
      if (q) V.ghosts.push({ id: pxuDead(x.id, x.d), adv: x.adv || null, x: q[0], y: q[1], t0: t, sc: x.sc || 0, face: -(V.dir || 1), z: zAt(q[1]) });   // 쓰러질 때도 그 적의 모습 그대로 (빌드 46: 모습 넷 · 찢어진 망토)
    } else if (x.type === 'loot' || x.type === 'gear') {
      const gh = V.ghosts[V.ghosts.length - 1], q = gh ? [gh.x, gh.y] : [160, 180];
      V.fx.push({ k: 'icon', id: x.type === 'gear' ? gearKeyIcon('g:' + x.base + ':' + x.t) : x.id, x: q[0] + (x.type === 'gear' ? 6 : 0), y: q[1] - 10, t0: t + 0.3, d: x.type === 'gear' ? 1.4 : 0.9 });
    } else if (x.type === 'down') {
      const aq = at('a' + x.d), dl = Math.max(0, (V.fhit['a' + x.d] || 0) - t);   // 몬스터 동작이 닿는 때에 쓰러진다 (빌드 43)
      if (aq) { V.fall['a' + x.d] = t + dl; V.fx.push({ k: 'num', x: aq[0], y: aq[1] - 21 * zAt(aq[1]) - 12, s: 'DOWN', c: '#ff6a5a', t0: t + dl, d: 1.4 }); V.fx.push({ k: 'burst', x: aq[0], y: aq[1] - 10, t0: t + dl, d: 0.4, c: '#ff6a5a', c2: '#ffffff', big: 1 }); }
      if (dl > 0.02) V.fx.push({ k: 'shk', id: 'bash', n: 4, t0: t + dl, d: 0.1 }); else V.shake = 4;
    } else if (x.type === 'lvl') {
      const aq = at('a' + x.d);
      if (aq) { V.fx.push({ k: 'levelup', x: aq[0], y: aq[1], t0: t, d: 1.4 }); V.fx.push({ k: 'num', x: aq[0], y: aq[1] - 21 * zAt(aq[1]) - 14, s: 'LEVEL UP', c: '#ffd84a', t0: t + 0.1, d: 1.3, big: 1 }); }
    } else if (x.type === 'petlvl') {
      const aq = at('aP' + x.pet);
      if (aq) V.fx.push({ k: 'num', x: aq[0], y: aq[1] - 16, s: 'LEVEL UP', c: '#ffd84a', t0: t + 0.1, d: 1.1 });
    } else if (x.type === 'fheal') {
      const fq = at('f' + x.d);
      if (fq) { V.fx.push({ k: 'heal', x: fq[0], y: fq[1], t0: t, d: 0.7, c: '#8af08a' }); V.fx.push({ k: 'num', x: fq[0], y: fq[1] - 24, s: '+' + x.v, c: '#8af08a', t0: t, d: 0.8 }); }
    } else if (x.type === 'arena') {
      V.fx.push({ k: 'num', x: AW / 2, y: 96, s: x.win ? 'VICTORY' : 'DEFEAT', c: x.win ? '#ffd84a' : '#ff6a5a', t0: t + 0.2, d: 2.2, big: 1 });
      callout(AW / 2, 120, x.win ? '승리! 관중이 환호한다' : '패배… 들것에 실려 나간다', 'boss');
      if (x.win) V.shake = 3;
    } else if (x.type === 'mastery') {
      const aq = at('a' + x.s), s = SKILLS[x.id];
      if (aq && s) { callout(aq[0], aq[1] - 21 * zAt(aq[1]) - 14, `${s.name} 숙련 ${x.lv}`, 'mast'); V.fx.push({ k: 'buff', x: aq[0], y: aq[1], t0: t + 0.2, d: 0.8, c: '#8af0c0' }); }
    } else if (x.type === 'spawn' && (x.boss || x.amb)) {
      V.shake = x.boss ? 6 : 4;
      if (x.name) callout(170, 120, x.name, 'boss');
      if (x.rare) callout(170, 104, '희귀종 출현!', 'rare');
    } else if (x.type === 'spawn' && x.rare) { callout(170, 120, '희귀종 출현!', 'rare'); sfx('buff'); }
    else if (x.type === 'chest') { V.fx.push({ k: 'num', x: AW / 2, y: 96, s: 'TREASURE', c: '#ffd84a', t0: t + 0.1, d: 1.6, big: 1 }); callout(AW / 2, 120, '보물 상자를 열었다', 'boss'); }
    else if (x.type === 'enter') V.shake = 3;
  }
}

/* 효과 그리기: 투사체 → 명중 → 숫자 */
function fx(g, t) {
  V.fx = V.fx.filter(f => t - f.t0 < f.d);
  const P = (x, y, w, h, c) => R(g, Math.round(x * 2) / 2, Math.round(y * 2) / 2, w, h, c);
  const ring = (x, y, r, c, th = 1) => { const n = Math.max(8, Math.round(r * 2)); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; P(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.45, th, th, c); } };
  for (const f of V.fx) {
    const k = (t - f.t0) / f.d;
    if (k < 0) continue;
    if (f.k === 'skh' || f.k === 'skw' || f.k === 'skq' || f.k === 'skc' || f.k === 'shk' || f.k === 'skp') { skDraw(g, f, t); continue; }   // 스킬 효과 (빌드 41) · 투사체 (빌드 43에서 바로잡음)
    if (f.k === 'ubat' || f.k === 'unova' || f.k === 'uspin' || f.k === 'urat' || f.k === 'ustorm') { fmotDraw(g, f, t); continue; }   // 몬스터 광역기 (빌드 43·44 · 47 번개 폭풍)
    const L = f.x1 != null ? Math.hypot(f.x1 - f.x0, f.y1 - f.y0) || 1 : 1, AH = f.arc != null ? f.arc : f.k === 'arrow' ? 10 : 4;   // 포물선 높이 (사선으로 쏜 화살은 높이)
    let ux = f.x1 != null ? (f.x1 - f.x0) / L : 1, uy = f.x1 != null ? (f.y1 - f.y0) / L : 0;
    const px = f.x1 != null ? f.x0 + (f.x1 - f.x0) * k : 0, py = f.x1 != null ? f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * AH : 0;
    if (f.k === 'arrow' && f.x1 != null) { const tx = f.x1 - f.x0, ty = (f.y1 - f.y0) - Math.PI * Math.cos(k * Math.PI) * AH, tl = Math.hypot(tx, ty) || 1; ux = tx / tl; uy = ty / tl; }   // 화살은 날아가는 방향을 본다
    if (f.k === 'num') { if (f.big) { drawNum(g, f.x - 0.5, Math.round(f.y - k * 12) - 0.5, f.s, f.c); drawNum(g, f.x + 0.5, Math.round(f.y - k * 12), f.s, f.c); } drawNum(g, f.x, Math.round(f.y - k * 12), f.s, f.c); }
    else if (f.k === 'shuri') {
      const fr = Math.floor(t * 24) % 4, at = kk => [Math.round(f.x0 + (f.x1 - f.x0) * kk), Math.round(f.y0 + (f.y1 - f.y0) * kk - Math.sin(kk * Math.PI) * 4)];
      const draw = (q, F, al, line) => { const [cx, cy] = q; g.save(); g.globalAlpha = al; if (line) for (const [x, y] of F.out) R(g, cx + x, cy + y, 1, 1, '#1a1414'); for (const [x, y, c] of F.star) R(g, cx + x, cy + y, 1, 1, c ? f.c[1] : f.c[0]); g.restore(); };
      if (SHURI_TRAIL) for (const [j, al] of [[2, 0.28], [1, 0.5]]) if (k - j * 0.06 > 0) draw(at(k - j * 0.06), SHURI_FR[(fr + 4 - j) % 4], al, false);
      draw(at(k), SHURI_FR[fr], 1, true);
    }
    else if (f.k === 'arrow') {
      for (let i = 0; i < 7; i++) P(px - ux * i, py - uy * i + (i > 4 ? 0.5 : 0), 1, 1, i < 5 ? f.c : 'rgba(255,255,255,0.4)');
      P(px + ux * 1.5, py + uy * 1.5, 1, 1, '#ffffff');
    } else if (f.k === 'orb') {
      const s = f.size || 2;
      if (f.trail) for (let i = 1; i <= 6; i++) { const u = i / 6; P(px - ux * i * 2.2 + Math.sin(t * 40 + i) * 1.2, py - uy * i * 2.2 - u * 3, s * (1 - u * 0.6), s * (1 - u * 0.6), i % 2 ? f.c : f.c2); }
      if (f.ring) for (let i = 0; i < 6; i++) { const a = t * 14 + i; P(px + Math.cos(a) * (s + 2), py + Math.sin(a) * (s + 1), 1, 1, i % 2 ? f.c : f.c2); }
      P(px - s / 2, py - s / 2, s, s, f.c); P(px - s / 2 + 0.5, py - s / 2 + 0.5, s - 1, s - 1, f.c2);
    } else if (f.k === 'shard') {
      for (let j = -1; j <= 1; j++) { const ox = -uy * j * 3, oy = ux * j * 3 + Math.abs(j); for (let i = 0; i < 5; i++) P(px + ox - ux * i, py + oy - uy * i, 1.5, 1, i ? f.c : f.c2); }
    } else if (f.k === 'gust') {
      for (let i = 0; i < 10; i++) { const a = t * 18 + i * 0.63, r = 2 + (i % 3) * 2; P(px + Math.cos(a) * r - ux * i * 1.2, py + Math.sin(a) * r * 0.6 - 3, 1.5, 1, i % 2 ? f.c : f.c2); }
    } else if (f.k === 'bolt') {
      const top = Math.max(10, f.y - 90), h = f.y - top;
      let qx = f.x, qy = top;
      g.save(); g.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3;
      for (let i = 1; i <= 7; i++) { const nx = f.x + (i === 7 ? 0 : (Math.random() - 0.5) * 14), ny = top + h * i / 7; const n = Math.max(Math.abs(nx - qx), Math.abs(ny - qy)) * 2; for (let j = 0; j <= n; j++) { const u = j / n; P(qx + (nx - qx) * u, qy + (ny - qy) * u, 1.5, 1.5, '#fff8a0'); } if (i % 2) { const bx = nx + (Math.random() - 0.5) * 16; for (let j = 0; j < 6; j++) P(nx + (bx - nx) * j / 6, ny + j * 1.5, 1, 1, '#ffffff'); } qx = nx; qy = ny; }
      if (k < 0.3) { R(g, f.x - 12, f.y - 10, 24, 12, 'rgba(255,250,200,' + (0.5 * (1 - k / 0.3)).toFixed(2) + ')'); }
      g.restore();
    } else if (f.k === 'pillar') {
      const h = (f.y - 10) * Math.min(1, k * 3), a = k < 0.6 ? 1 : (1 - k) / 0.4;
      g.save(); g.globalAlpha = a;
      R(g, f.x - 7, f.y - h, 14, h, 'rgba(255,240,180,0.35)'); R(g, f.x - 4, f.y - h, 8, h, 'rgba(255,250,220,0.6)'); R(g, f.x - 1.5, f.y - h, 3, h, '#ffffff');
      for (let i = 0; i < 4; i++) ring(f.x, f.y - ((k * 60 + i * 15) % 60), 9 - i, f.c2);
      for (let i = 0; i < 8; i++) P(f.x + Math.sin(i * 2.1 + t * 5) * 9, f.y - ((k * 70 + i * 9) % 70), 1, 1, '#ffffff');
      g.restore();
    } else if (f.k === 'slash') {
      const r = f.big ? 13 : 9, s = f.dir, n = 14;
      for (let m = 0; m < (f.big ? 3 : 2); m++) for (let i = 0; i < n; i++) { const a = -2.2 + i * 0.34 + k * 1.2 - m * 0.25, rr = r - m * 2.5; if (i > k * n + 4 || i < (k - 0.4) * n) continue; P(f.x + s * Math.cos(a) * rr, f.y + Math.sin(a) * rr * 0.9, 1.5, 1.5, m ? f.c : '#ffffff'); }
    } else if (f.k === 'burst') {
      const r = (f.big ? 10 : 6) * Math.sin(Math.min(1, k * 1.2) * Math.PI / 2), n = f.big ? 12 : 8;
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + (f.big ? 0.2 : 0), len = r * (i % 2 ? 1 : 0.6); for (let j = 0; j < 3; j++) P(f.x + Math.cos(a) * (len - j * 1.2), f.y + Math.sin(a) * (len - j * 1.2) * 0.8, 1, 1, j ? f.c : f.c2); }
      if (k < 0.35) { const rr = (f.big ? 7 : 4) * (1 - k / 0.35); P(f.x - rr, f.y - rr * 0.7, rr * 2, rr * 1.4, f.c2); P(f.x - rr * 0.6, f.y - rr * 0.4, rr * 1.2, rr * 0.8, '#ffffff'); }
    } else if (f.k === 'wave') {
      const r = 6 + k * 150;
      ring(f.x, f.y - 2, r, '#e0503f', 2); ring(f.x, f.y - 2, r - 5, '#ff9a7a', 1.5);
    } else if (f.k === 'spark') {
      for (let i = 0; i < 5; i++) { const a = i * 1.26 + k * 3; P(f.x + Math.cos(a) * (3 + k * 7), f.y + Math.sin(a) * (3 + k * 6) - k * 8, 1, 1, f.c); }
    } else if (f.k === 'bubble') {
      for (let i = 0; i < 4; i++) P(f.x + Math.sin(i * 2 + t * 6) * 5, f.y - 4 - ((k * 20 + i * 5) % 20), 1.5, 1.5, f.c);
    } else if (f.k === 'heal') {
      ring(f.x, f.y, 4 + k * 10, f.c, 1);
      for (let i = 0; i < 5; i++) { const x = f.x + Math.sin(i * 1.7) * 8, y = f.y - 6 - ((k * 36 + i * 7) % 36); P(x - 1.5, y, 4, 1.5, f.c); P(x - 0.5, y - 1, 2, 3.5, f.c); P(x, y, 1, 1, '#ffffff'); }
    } else if (f.k === 'buff') {
      g.save(); g.globalAlpha = 1 - k * 0.6;
      ring(f.x, f.y, 3 + k * 12, f.c, 1.5); ring(f.x, f.y - 2, 2 + k * 8, '#ffffff', 1);
      for (let i = 0; i < 6; i++) P(f.x + Math.cos(i * 1.05) * (6 + k * 4), f.y - 2 - ((k * 30 + i * 5) % 30), 1.5, 1.5, f.c);
      g.restore();
    } else if (f.k === 'cast') {
      for (let i = 0; i < 8; i++) { const a = t * 8 + i * 0.79, r = 10 - k * 6; P(f.x + Math.cos(a) * r, f.y - 10 + Math.sin(a) * r * 0.5, 1.5, 1.5, i % 2 ? f.c : '#ffffff'); }
    } else if (f.k === 'levelup') {
      const a = k < 0.7 ? 1 : (1 - k) / 0.3, h = 70 * Math.min(1, k * 2.5), wv = 10 + Math.sin(k * Math.PI) * 4;
      g.save(); g.globalAlpha = a;
      R(g, f.x - wv, f.y - h, wv * 2, h, 'rgba(255,220,100,0.22)'); R(g, f.x - wv * 0.55, f.y - h, wv * 1.1, h, 'rgba(255,240,170,0.45)'); R(g, f.x - 1.5, f.y - h, 3, h, 'rgba(255,255,230,0.9)');
      ring(f.x, f.y, 4 + k * 16, '#ffd84a', 1.5); ring(f.x, f.y, 2 + k * 9, '#ffffff', 1);
      for (let i = 0; i < 12; i++) { const u = (k * 1.6 + i * 0.13) % 1, x = f.x + Math.sin(i * 2.3) * 11, y = f.y - 4 - u * 60; P(x, y, 1.5, 1.5, i % 3 ? '#ffd84a' : '#ffffff'); if (i % 4 === 0) { P(x - 1.5, y, 4.5, 1, '#fff2a0'); P(x, y - 1.5, 1, 4.5, '#fff2a0'); } }
      g.restore();
    } else if (f.k === 'icon') drawIcon(g, f.id, Math.round(f.x - 5), Math.round(f.y - k * 18));
  }
}

/* ───────── 전투 기록: 사건을 문장으로 ───────── */
// 받침이 있으면 앞의 조사, 없으면 뒤의 조사
function jo(w, a, b) { const c = String(w).charCodeAt(String(w).length - 1); return w + (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 ? a : b); }
const LOG_MAX = 80;
function logEvent(x, e, p) {
  const A = id => { if (typeof id === 'string' && id[0] === 'P') { const pt = petById(+id.slice(1)); return pt ? pt.name : '펫'; } const a = advById(id); return a ? a.name : '동료'; };
  const Fn = uid => V.fname[uid] || '몬스터';
  const ally = s => `<b class="lg-a">${esc(s)}</b>`, foe = s => `<b class="lg-f">${esc(s)}</b>`, num = (v, c) => `<b class="lg-${c || 'n'}">${fmt(v)}</b>`;
  const add = (h, c) => { V.log.push({ n: ++V.logN, h, c: c || '' }); if (V.log.length > LOG_MAX) V.log.shift(); };
  if (x.type === 'hit') {
    if (x.dot && !x.v) return;
    if (x.k === 'poison' || x.k === 'curse' || x.k === 'burn' || x.k === 'bleed') return add(`${foe(jo(Fn(x.d), '이', '가'))} ${x.k === 'curse' ? '저주' : x.k === 'burn' ? '화상' : x.k === 'bleed' ? '출혈' : '독'}(으)로 ${num(x.v)} 피해를 입었습니다.`, 'dim');
    if (x.pet) return add(`펫 ${ally(A(x.s))}의 ${PET_ACT_NAME[PETS[(petById(+String(x.s).slice(1)) || { kind: 'wolf' }).kind].act] || '공격'}! ${foe(Fn(x.d))}에게 ${num(x.v)} 피해.`);
    if (x.k === 'pet') return add(`${ally(A(x.s))}의 동료 짐승이 ${foe(Fn(x.d))}에게 ${num(x.v)} 피해!`);
    if (x.imm) return add(`${foe(Fn(x.d))}에게는 ${ally(A(x.s))}의 공격이 통하지 않는다! <i class="lg-c">면역</i>`, 'dim');
    return add(`${x.ctr ? '<i class="lg-c">반격!</i> ' : ''}${x.wk ? '<i class="lg-c">약점!</i> ' : ''}${x.c ? '<i class="lg-c">치명타!</i> ' : ''}${ally(jo(A(x.s), '이', '가'))} ${foe(Fn(x.d))}에게 ${num(x.v, x.c ? 'c' : '')} 피해를 줬습니다.`);
  }
  if (x.type === 'fmiss') return add(`${ally(A(x.s))}의 공격이 ${foe(Fn(x.d))}에게 빗나갔습니다.`, 'dim');
  if (x.type === 'hurt' && x.dot) return add(`${ally(jo(A(x.d), '이', '가'))} ${STATUS[x.k] ? STATUS[x.k].name : '독'}(으)로 ${num(x.v, 'r')} 피해를 입었습니다.`, 'dim');
  if (x.type === 'hurt') return add(`${foe(Fn(x.s))}의 공격! ${ally(jo(A(x.d), '이', '가'))} ${num(x.v, 'r')} 피해를 입었습니다.${x.blk ? ' <i class="lg-c">막았다!</i>' : ''}`);
  if (x.type === 'sta') { const St = STATUS[x.k]; if (St) add(x.side === 'f' ? `${foe(jo(Fn(x.d), '이', '가'))} ${St.name} 상태가 됐습니다.` : `${ally(jo(A(x.d), '이', '가'))} ${St.name} 상태가 됐습니다!`, x.side === 'f' ? 'sk' : 'warn'); return; }
  if (x.type === 'cure') return add(`${ally(A(x.d))}의 상태이상이 풀렸습니다.`, 'dim');
  if (x.type === 'miss') return add(`${ally(jo(A(x.d), '이', '가'))} ${foe(Fn(x.s))}의 공격을 피했습니다.`, 'dim');
  if (x.type === 'aoe') return add(`${foe(Fn(x.s))}의 광역 공격!`, 'warn');
  if (x.type === 'heal' && typeof x.s === 'string') { const pt = petById(+x.s.slice(1)); return add(`펫 ${ally(pt ? pt.name : '펫')}의 ${pt ? PET_ACT_NAME[PETS[pt.kind].act] : '회복'}! ${ally(A(x.d))}의 HP를 ${num(x.v, 'g')} 회복.`); }
  if (x.type === 'heal' && x.rg) return add(`${ally(jo(A(x.d), '이', '가'))} 재생으로 HP를 ${num(x.v, 'g')} 회복했습니다.`, 'dim');
  if (x.type === 'heal') return add(x.s === x.d ? `${ally(jo(A(x.d), '이', '가'))} HP를 ${num(x.v, 'g')} 회복했습니다.` : `${ally(jo(A(x.s), '이', '가'))} ${ally(A(x.d))}의 HP를 ${num(x.v, 'g')} 치유했습니다.`);
  if (x.type === 'shield') return add(x.on ? `${ally(A(x.d))}에게 보호막 ${num(x.v, 'b')}이 생겼습니다.` : `${ally(A(x.d))}의 보호막이 ${num(x.v, 'b')}을(를) 막아냈습니다.`, 'dim');
  if (x.type === 'cover') return add(`${ally(jo(A(x.s), '이', '가'))} ${ally(A(x.d))}을(를) 감싸 대신 맞았습니다!`, 'sk');
  if (x.type === 'combo') { if (x.c === 3 || x.c === COMBO_MAX) add(`${ally(A(x.s))}의 연계 ${x.c}중첩! (피해 +${Math.round((TR(advById(x.s) || { cls: 'warrior' }).combo || 0) * x.c * 100)}%)`, 'dim'); return; }
  if (x.type === 'jackpot') return add(`<i class="lg-c">대박!</i> ${ally(A(x.s))}의 한 방이 크게 터졌습니다.`, 'lvl');
  if (x.type === 'revive') return add(`<i class="lg-c">부활!</i> ${ally(jo(A(x.s), '이', '가'))} 쓰러진 ${ally(A(x.d))}을(를) 일으켜 세웠습니다.`, 'lvl');
  if (x.type === 'pot' && x.k) return add(`${ally(jo(A(x.d), '이', '가'))} ${ITEMS[x.k].name}(으)로 ${cureName(ITEMS[x.k].cure)}을(를) 풀었습니다.`);
  if (x.type === 'pot') return add(`${ally(jo(A(x.d), '이', '가'))} 회복 물약으로 HP ${num(x.v, 'g')} 회복.`);
  if (x.type === 'mana') return add(`${ally(jo(A(x.d), '이', '가'))} 마나 물약으로 MP ${num(x.v, 'b')} 회복.`);
  if (x.type === 'skill') { const s = SKILLS[x.id]; if (s) add(`${ally(jo(A(x.s), '이', '가'))} 「${esc(s.name)}」${s.kind === 'heal' ? '을(를) 외웠습니다.' : '!'}`, 'sk'); return; }
  if (x.type === 'kill') return add(`${foe(jo(Fn(x.d), '을', '를'))} 처치했습니다!`, 'kill');
  if (x.type === 'wave') return add(`${x.cur}번째 무리를 막았습니다! (${x.cur}/${x.n})`, 'kill');
  if (x.type === 'loot') { const it = ITEMS[x.id]; if (it) add(`전리품 <b class="lg-l">${esc(it.name)}</b> 획득`, 'loot'); return; }
  if (x.type === 'gear') return add(`장비 <b class="lg-l">${esc(GTYPES[x.base].name)}</b> 획득!`, 'loot');
  if (x.type === 'down') return add(`${ally(jo(A(x.d), '이', '가'))} 쓰러졌습니다. 들것에 싣습니다.`, 'bad');
  if (x.type === 'lvl') { const a = advById(x.d); if (a) add(`${ally(A(x.d))} 레벨 업! LV ${a.lv}`, 'lvl'); return; }
  if (x.type === 'petlvl') { const pt = petById(x.pet); if (pt) add(`펫 ${ally(pt.name)} 레벨 업! LV ${pt.lv}`, 'lvl'); return; }
  if (x.type === 'fheal') return add(`${foe(jo(Fn(x.s), '이', '가'))} ${foe(Fn(x.d))}의 HP를 ${num(x.v, 'g')} 회복시켰습니다.`, 'dim');
  if (x.type === 'arena') return add(x.win ? '<i class="lg-c">승리!</i> 투기장의 관중이 환호합니다.' : '패배했습니다. 들것에 실려 모래판을 나갑니다.', x.win ? 'lvl' : 'bad');
  if (x.type === 'mastery') { const s = SKILLS[x.id]; if (s) add(`${ally(A(x.s))}의 「${esc(s.name)}」 숙련도가 ${x.lv}단계가 되었습니다. (위력 +${x.lv * 3}%)`, 'lvl'); return; }
  if (x.type === 'spawn') { const fs = e.foes.map(f => f.name || MONS[f.id].name); if (fs.length) add(`${x.boss ? '<i class="lg-c">보스!</i> ' : x.amb ? '<i class="lg-c">기습!</i> ' : ''}${fs.map(foe).join(', ')} 출현`, x.boss ? 'warn' : ''); return; }
  if (x.type === 'clear') return add('전투에서 이겼습니다.', 'dim');
  if (x.type === 'flee') return add(x.skip ? '파티가 싸움을 피해 지나갑니다.' : '파티가 전투에서 물러났습니다.', 'bad');
  if (x.type === 'camp') return add(x.tent ? '텐트를 치고 쉬어 갑니다. 피로가 빨리 풀립니다.' : '모닥불을 피우고 쉬어 갑니다.', 'dim');
  if (x.type === 'wake') return add('다시 길을 나섭니다.', 'dim');
  if (x.type === 'enter') return add(`${esc(FIELDS[e.field].dungeon.name)}에 들어섰습니다.`, 'warn');
  if (x.type === 'turn') return add('상단으로 발길을 돌립니다.', 'dim');
}

/* 날씨와 생물 (빛을 입힌 뒤에 그린다) */

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
  // 통계 보기: 기록 대신 이번 원정의 전투 통계를 그린다
  const box = $('bw-log');
  if (V.bstats) { const html = `<div class="bstats"><div class="sub">${e ? '이번 원정' : '지난 원정'} · 누가 얼마나 때리고 맞았는지</div>${bstatRows(e ? e.stats : p && p.last ? p.last.stats : null, p && p.last ? p.last.names : null)}</div>`; if (box.dataset.h !== html) { box.innerHTML = html; box.dataset.h = html; } V.bdrawn = -1; return; }
  if (box.dataset.h) { box.textContent = ''; delete box.dataset.h; V.bdrawn = -1; }
  // 기록: 새 줄만 붙인다 (파티를 바꾸면 처음부터)
  const first = V.log.length ? V.log[0].n : 0;
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
  const dp = clockDp(), T = todAt(dp, 'front');
  R(g, 0, 0, AW, BG_OY + 1, T.sky[0]);
  g.save(); g.translate(0, BG_OY); drawSky(g, 'front', 0, t, dp); g.restore();
  drawLand(g, 'front', 0, t, T);
  const slots = frontSlots(cast.length);
  cast.forEach((a, i) => { const [x, y] = slots[i]; shadowAt(g, x, y, 9); g.save(); g.translate(x, y); drawAdv(g, a, t, { ph: i * 0.5, z: zq(ZS) }); g.restore(); });
  drawFore(g, 'front', 0);
  bgEmit(g, 'front', 0, t, T.dark[1]);
}
