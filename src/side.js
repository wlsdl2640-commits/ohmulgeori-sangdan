/* ───────── 원정 배경: 옆으로 흘러가는 겹 풍경 ─────────
   논리 240×200. 지평선 SHZ. 겹마다 다른 속도로 흐른다 (뒤 느리게, 앞 빠르게). 고해상도(×2)로 한 번 굽는다 */
const SHZ = 112, STW = 480;                       // 지평선 · 한 겹의 가로 길이 (논리)
const SR = { W: STW * HI, H: AH * HI, HZ: SHZ * HI };
const SSC = new Map();
// 땅 띠: 지평선부터 아래까지 색이 깊어지고, 가운데 길이 가로로 지난다
function sGround(P, cols, road) {
  P.vgrad(0, SR.HZ, SR.W, SR.H - SR.HZ, cols);
  if (!road) return;
  const [rc, re, rl] = road.map(Pix.c), y0 = SR.HZ + 60, y1 = SR.H - 8;
  P.rect(0, y0, SR.W, y1 - y0, rc); P.rect(0, y0, SR.W, 3, re); P.rect(0, y1 - 3, SR.W, 3, re);
  const r = fieldRng(77);
  for (let i = 0; i < 90; i++) { const x = r() * SR.W, y = y0 + 8 + r() * (y1 - y0 - 16), w = 4 + r() * 10; P.rect(x, y, w, 2, rl); }
  for (let i = 0; i < 40; i++) { const x = r() * SR.W, y = y0 + 6 + r() * (y1 - y0 - 12); P.rect(x, y, 3, 2, re); }
}
function sSpread(P, n, seed, fn) { const r = fieldRng(seed); for (let i = 0; i < n; i++) fn(r() * SR.W, r, i); }
/* 장면: back(먼 것, 지평선 위) · mid(땅 위 소품, 지평선 바로 아래) · fore(맨 앞 풀) */
const SSCENE = {
  plains: {
    back(P) { pRidge(P, SR.HZ + 2, 22, 0.012, 40, '#8fb4c4'); for (let i = 0; i < 14; i++) { const x = 20 + i * 70 + (i % 3) * 11, s = 14 + (i % 3) * 5; P.ell(x, SR.HZ - s * 0.5, s * 1.3, s, Pix.c('#6a9a66')); P.ell(x - 3, SR.HZ - s * 0.8, s * 0.8, s * 0.6, Pix.c('#78a872')); } P.rect(0, SR.HZ - 2, SR.W, 4, Pix.c('#5f8a5a')); },
    mid(P) { sGround(P, ['#9cc46a', '#7cae4a', '#5f9a3a', '#4f8a34'], ['#c8a070', '#a07c50', '#d8b484']); for (let k = 0; k < 6; k++) { const x0 = k * 160, c = Pix.c(k % 2 ? '#d8b860' : '#c8a850'); P.rect(x0 + 20, SR.HZ + 10, 120, 24, c); P.rect(x0 + 20, SR.HZ + 10, 120, 2, Pix.c('#e8cc78')); } const pal = ['#5a3e28', '#7a5a3a', '#3f7a34', '#5a9a40', '#86c05a']; for (const [x, s] of [[70, 70], [330, 84], [620, 62], [860, 78]]) pTree(P, x, SR.HZ + 38, s, pal); for (let i = 0; i < 12; i++) { const x = 40 + i * 80; P.rect(x, SR.HZ + 36, 5, 22, Pix.c('#7a5634')); P.rect(x, SR.HZ + 36, 2, 22, Pix.c('#9a7448')); P.rect(x - 40, SR.HZ + 42, 85, 3, Pix.c('#8a6440')); } sSpread(P, 60, 1, (x, r, i) => { const y = SR.HZ + 46 + r() * 12; if (i % 4 === 0) P.rect(x, y - 2, 3, 3, Pix.c(['#f0e070', '#f08aa0', '#ffffff'][i % 3])); else pTuft(P, x, y, 40, '#3f7a2e'); }); },
    fore(P) { sSpread(P, 30, 2, (x, r) => pTuft(P, x, SR.H - 2 - r() * 6, 70, '#3a7030')); }
  },
  forest: {
    back(P) { for (let i = 0; i < 40; i++) { const x = (i * 37) % SR.W, w = 6 + (i % 3) * 4; P.rect(x, SR.HZ - 90, w, 94, Pix.c(i % 2 ? '#7aa090' : '#8cb0a0')); } for (let i = 0; i < 30; i++) { const x = (i * 61) % SR.W; P.ell(x, SR.HZ - 86 + (i % 3) * 10, 40, 24, Pix.c('#6a9080')); } },
    mid(P) { sGround(P, ['#6a9a6a', '#4f7f3a', '#3e6a30', '#355e2a'], ['#8a6440', '#6e4e32', '#a07a50']); const t0 = Pix.c('#4a3424'), t1 = Pix.c('#6a4a30'), t2 = Pix.c('#8a6a44'), L = [Pix.c('#1f3a24'), Pix.c('#2f5a2e'), Pix.c('#3f7a38')]; for (let i = 0; i < 7; i++) { const x = 30 + i * 70 + (i % 2) * 20, w = 12 + (i % 3) * 4, y = SR.HZ + 40; P.rect(x - w / 2, 0, w, y, t0); P.rect(x - w / 2 + 2, 0, w * 0.35, y - 2, t1); P.rect(x - w / 2 + 3, 0, 2, y - 4, t2); P.poly([[x - w * 1.3, y], [x - w / 2, y - 14], [x - w / 2, y]], t0); P.poly([[x + w * 1.3, y], [x + w / 2, y - 14], [x + w / 2, y]], t0); } for (let i = 0; i < 24; i++) { const x = (i * 43) % (SR.W + 60) - 30, y = 6 + (i % 4) * 16; P.ell(x, y, 56, 34, L[0]); P.ell(x - 8, y - 8, 40, 22, L[1]); P.ell(x - 14, y - 12, 18, 10, L[2]); } for (let i = 0; i < 10; i++) pBush(P, 40 + i * 48, SR.HZ + 52 + (i % 2) * 8, 44, ['#2f5a2a', '#3f7a34', '#5a9a40']); sSpread(P, 20, 3, (x, r, i) => P.ell(x, SR.HZ + 50 + r() * 20, 4, 2, Pix.c(i % 2 ? '#7a8a6a' : '#6a7a5a'))); },
    fore(P) { for (let i = 0; i < 6; i++) pBush(P, 60 + i * 84, SR.H + 14, 56, ['#1f3a24', '#2f5a2e', '#3f7a38']); }
  },
  mountain: {
    back(P) { pPeaks(P, SR.HZ + 4, 10, 60, 120, 17, '#6a6c8c', '#eef0f8', '#50506a'); pRidge(P, SR.HZ + 4, 20, 0.018, 33, '#5a6a62', '#6a7a6e'); },
    mid(P) { sGround(P, ['#9a9284', '#8a8274', '#7a7264', '#6e6658'], ['#b0a894', '#8e8674', '#c0b8a4']); for (let i = 0; i < 8; i++) pPine(P, 40 + i * 62, SR.HZ + 36, 46, ['#3a2e26', '#2e4a3e', '#3e5e4e', '#e8eef6'], 0); for (let i = 0; i < 7; i++) pRock(P, 20 + i * 70, SR.HZ + 52, 36, ['#5e5868', '#7e788a', '#a09aaa']); },
    fore(P) { for (let i = 0; i < 5; i++) pRock(P, 50 + i * 100, SR.H + 10, 40, ['#4e4858', '#6a6474', '#8a8494']); }
  },
  valley: {
    back(P) { for (let i = 0; i < 9; i++) { const x = 10 + i * 56, w = 36 + (i % 3) * 16, h = 40 + (i % 2) * 30; P.rect(x, SR.HZ - h, w, h + 4, Pix.c('#d8a07a')); P.rect(x, SR.HZ - h, w, 4, Pix.c('#e8bc98')); P.rect(x + w * 0.6, SR.HZ - h, w * 0.4, h + 4, Pix.c('#c48a62')); for (let k = 0; k < h; k += 12) P.rect(x, SR.HZ - h + k + 6, w, 2, Pix.c('#c88052')); } },
    mid(P) { sGround(P, ['#dcb48c', '#cca474', '#bc9262', '#ac8252'], ['#e4c49c', '#bc986e', '#eed4ac']); for (let i = 0; i < 8; i++) pRock(P, 30 + i * 62, SR.HZ + 50 + (i % 2) * 8, 34, ['#9a5a3a', '#b87a50', '#d89a6a']); for (let i = 0; i < 6; i++) { const x = 60 + i * 80; P.rect(x, SR.HZ + 20, 6, 30, Pix.c('#6a8a3a')); P.rect(x - 6, SR.HZ + 28, 6, 12, Pix.c('#6a8a3a')); P.rect(x + 6, SR.HZ + 24, 6, 14, Pix.c('#6a8a3a')); } },
    fore(P) { for (let i = 0; i < 5; i++) pRock(P, 70 + i * 96, SR.H + 10, 38, ['#8a4a2a', '#a86a40', '#c88a5a']); }
  },
  snow: {
    back(P) { pPeaks(P, SR.HZ + 4, 9, 70, 130, 23, '#c8d6ea', '#ffffff', '#a8bcd8'); },
    mid(P) { sGround(P, ['#f4f8fc', '#e8eef6', '#dce6f0', '#d0dcea'], ['#c8d4e2', '#aebccc', '#dae4ee']); for (let i = 0; i < 9; i++) pPine(P, 30 + i * 54, SR.HZ + 40 + (i % 2) * 6, 50, ['#4a3a2a', '#2e5a4a', '#3f7a64', '#f4f8ff'], 1); sSpread(P, 30, 5, (x, r) => P.rect(x, SR.HZ + 50 + r() * 14, 6, 1, Pix.c('#b0c0d4'))); },
    fore(P) { for (let i = 0; i < 4; i++) pPine(P, 80 + i * 120, SR.H + 70, 70, ['#3a2a1a', '#24483a', '#2f6a54', '#f4f8ff'], 1); }
  },
  desert: {
    back(P) { pRidge(P, SR.HZ + 4, 16, 0.014, 70, '#ecc888', '#f4dca8'); P.poly([[300, SR.HZ + 2], [360, SR.HZ - 60], [420, SR.HZ + 2]], Pix.c('#d8b070')); P.poly([[360, SR.HZ - 60], [420, SR.HZ + 2], [374, SR.HZ + 2]], Pix.c('#c09a5a')); P.poly([[700, SR.HZ + 2], [740, SR.HZ - 38], [780, SR.HZ + 2]], Pix.c('#d8b070')); },
    mid(P) { sGround(P, ['#f0d498', '#e8c47c', '#dcb46a', '#d0a85e'], ['#d8b070', '#c09a5a', '#e4c080']); for (let k = 0; k < 4; k++) { P.ell(60 + k * 240, SR.HZ + 30, 110, 26, Pix.c('#e0b468')); P.ell(50 + k * 240, SR.HZ + 22, 80, 14, Pix.c('#ecc880')); } for (const x of [180, 560, 820]) { for (let i = 0; i < 10; i++) P.rect(x - 3 + i * 0.6, SR.HZ + 40 - i * 5, 6, 6, Pix.c(i % 2 ? '#8a6a44' : '#a8845a')); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; P.poly([[x + 4, SR.HZ - 12], [x + 4 + Math.cos(a) * 30, SR.HZ - 8 + Math.abs(Math.sin(a)) * 14], [x + 4 + Math.cos(a) * 26, SR.HZ - 4 + Math.abs(Math.sin(a)) * 18]], Pix.c(k % 2 ? '#4f8a3c' : '#3f7a34')); } } for (const x of [400, 720]) { P.rect(x - 10, SR.HZ - 20, 20, 60, Pix.c('#d8c098')); P.rect(x - 10, SR.HZ - 20, 6, 60, Pix.c('#ecd8b4')); P.rect(x - 14, SR.HZ - 26, 28, 6, Pix.c('#c8ac80')); } sSpread(P, 30, 6, (x, r) => P.rect(x, SR.HZ + 48 + r() * 14, 12, 1, Pix.c('#c8a060'))); },
    fore(P) { for (let i = 0; i < 4; i++) { P.ell(100 + i * 240, SR.H + 10, 120, 18, Pix.c('#dcb064')); } }
  }
};
/* 던전 복도 옆모습: 천장 · 뒷벽(횃불·기둥) · 바닥 */
function sDungeon(P, D) {
  const W0 = Pix.c(D.wall[0]), Wl = Pix.c(D.wall[1]), Wd = Pix.c(D.wall[2]), F0 = Pix.c(D.floor[0]), F1 = Pix.c(D.floor[1]), r = fieldRng(D.wall[0].length);
  P.vgrad(0, 0, SR.W, 60, [D.ceil, D.ceil, mix(D.ceil, D.wall[2], 0.5)]);
  P.rect(0, 60, SR.W, SR.HZ + 40 - 60, W0);
  if (D.wk === 'plank') { for (let x = 0; x < SR.W; x += 22) P.rect(x, 60, 3, SR.HZ - 20, Wd); for (let x = 11; x < SR.W; x += 44) P.rect(x, 60, 1, SR.HZ - 20, Wl); }
  else if (D.wk === 'brick' || D.wk === 'block') { const h = D.wk === 'brick' ? 12 : 22, L = D.wk === 'brick' ? 28 : 46; for (let y = 60, k = 0; y < SR.HZ + 40; y += h, k++) { P.rect(0, y, SR.W, 2, Wd); for (let x = k % 2 ? L / 2 : 0; x < SR.W; x += L) P.rect(x, y, 2, h, Wd); } }
  else { const md = Pix.c(mix(D.wall[0], D.wall[2], 0.55)), ml = Pix.c(mix(D.wall[0], D.wall[1], 0.6)); for (let i = 0; i < 160; i++) P.ell(r() * SR.W, 64 + r() * (SR.HZ - 30), 4 + r() * 6, 3 + r() * 5, r() < 0.55 ? md : ml); }
  for (let x = 40; x < SR.W; x += 120) { P.rect(x - 8, 60, 16, SR.HZ - 20, D.ck === 'beam' ? Pix.c('#5e4028') : Wd); P.rect(x - 8, 60, 5, SR.HZ - 20, D.ck === 'beam' ? Pix.c('#7a5634') : Wl); }
  if (D.ck === 'beam') { P.rect(0, 56, SR.W, 10, Pix.c('#5e4028')); P.rect(0, 64, SR.W, 3, Pix.c('#3e2a1a')); }
  if (D.ck === 'arch') for (let x = 100; x < SR.W; x += 120) for (let i = 0; i < 12; i++) { const a = Math.PI * i / 12, b = Math.PI * (i + 1) / 12; P.poly([[x - Math.cos(a) * 50, 90 - Math.sin(a) * 30], [x - Math.cos(b) * 50, 90 - Math.sin(b) * 30], [x - Math.cos(b) * 46, 94 - Math.sin(b) * 28], [x - Math.cos(a) * 46, 94 - Math.sin(a) * 28]], Wl); }
  if (D.ck === 'open') { P.vgrad(0, 0, SR.W, 70, ['#05040c', '#0e0c1c', '#1a1830']); for (let i = 0; i < 60; i++) P.rect(r() * SR.W, r() * 50, 1, 1, Pix.c('#c8c8e0')); }
  P.rect(0, SR.HZ + 36, SR.W, 6, Wd);
  P.rect(0, SR.HZ + 40, SR.W, SR.H - SR.HZ - 40, F0);
  if (D.fk === 'plank') for (let y = SR.HZ + 52; y < SR.H; y += 14) P.rect(0, y, SR.W, 2, F1);
  else if (D.fk === 'tile') { for (let y = SR.HZ + 40; y < SR.H; y += 24) P.rect(0, y, SR.W, 2, F1); for (let x = 0, k = 0; x < SR.W; x += 40, k++) for (let y = SR.HZ + 40; y < SR.H; y += 24) P.rect(x + (Math.floor((y - SR.HZ - 40) / 24) % 2 ? 20 : 0), y, 2, 24, F1); }
  else if (D.fk === 'rail') { for (const y of [SR.HZ + 100, SR.HZ + 112]) P.rect(0, y, SR.W, 3, Pix.c('#8a8a92')); for (let x = 0; x < SR.W; x += 20) P.rect(x, SR.HZ + 96, 8, 22, Pix.c('#5a4030')); }
  else for (let i = 0; i < 80; i++) P.ell(r() * SR.W, SR.HZ + 44 + r() * (SR.H - SR.HZ - 48), 5, 2, F1);
  // 소품
  const prop = D.prop;
  for (let x = 90; x < SR.W; x += 150) {
    const y = SR.HZ + 40, s = 60;
    if (prop === 'hay') { P.ell(x, y - s * 0.15, s * 0.3, s * 0.17, Pix.c('#b89038')); P.ell(x - s * 0.06, y - s * 0.21, s * 0.18, s * 0.09, Pix.c('#d8b450')); }
    else if (prop === 'barrels') { P.rect(x - 10, y - 26, 20, 26, Pix.c('#7a5232')); P.rect(x - 10, y - 22, 20, 2, Pix.c('#4a4a52')); P.rect(x - 10, y - 7, 20, 2, Pix.c('#4a4a52')); P.rect(x - 7, y - 26, 4, 26, Pix.c('#9a7048')); }
    else if (prop === 'gold') { P.rect(x - 12, y - 18, 24, 18, Pix.c('#8a6a40')); P.rect(x - 12, y - 18, 24, 3, Pix.c('#a8844e')); P.ell(x, y - 20, 9, 4, Pix.c('#f0c24a')); }
    else if (prop === 'twigs') { P.ell(x, y - 6, 20, 7, Pix.c('#7a5634')); P.ell(x, y - 9, 7, 5, Pix.c('#f0e8d8')); }
    else if (prop === 'cart') { P.rect(x - 18, y - 22, 36, 16, Pix.c('#5a5660')); P.rect(x - 18, y - 22, 36, 3, Pix.c('#7a7680')); P.ell(x - 10, y - 4, 4, 4, Pix.c('#2a2830')); P.ell(x + 10, y - 4, 4, 4, Pix.c('#2a2830')); P.ell(x, y - 24, 13, 4, Pix.c('#6a6070')); }
    else if (prop === 'roots') { P.ell(x, y - 3, 5, 3, Pix.c('#9ae08a')); P.ell(x + 8, y - 2, 4, 2, Pix.c('#c8f0b0')); }
    else if (prop === 'pillars') { P.rect(x - 7, 60, 14, SR.HZ - 20, Pix.c('#c8e4f4')); P.rect(x - 7, 60, 4, SR.HZ - 20, Pix.c('#ffffff')); }
  }
  for (let x = 160; x < SR.W; x += 240) { P.rect(x - 2, SR.HZ - 10, 4, 14, Pix.c('#4a3424')); P.rect(x - 5, SR.HZ - 12, 10, 3, Pix.c('#6a4a30')); }
}
function sideBg(id) {
  let c = SSC.get(id); if (c) return c;
  const D = DUN[id], S0 = SSCENE[id] || SSCENE.plains;
  const mk = fn => { const P = new Pix(SR.W, SR.H); fn(P); return P.canvas(); };
  c = D ? { under: 1, layers: [{ cv: mk(P => sDungeon(P, D)), par: 1 }] }
    : { under: 0, layers: [{ cv: mk(S0.back), par: 0.18 }, { cv: mk(S0.mid), par: 1 }, { cv: mk(S0.fore), par: 1.35 }] };
  SSC.set(id, c);
  return c;
}
// 겹을 흘려 그린다 (ctx는 논리 좌표). scroll = 논리 픽셀
function drawSide(g, bg, scroll) {
  for (const L of bg.layers) { const s = ((scroll * L.par) % STW + STW) % STW; g.drawImage(L.cv, -s, 0, STW, AH); if (STW - s < AW) g.drawImage(L.cv, STW - s, 0, STW, AH); }
}
function sideSky(g, id, t, dp) {
  const T = todAt(dp, DAY_SKY[id] ? id : 'plains');
  for (let i = 0; i < 14; i++) { const k = i / 13, c = k < 0.5 ? mix(T.sky[0], T.sky[1], k * 2) : mix(T.sky[1], T.sky[2], (k - 0.5) * 2); R(g, 0, Math.floor(i * (SHZ + 4) / 14), AW, Math.ceil((SHZ + 4) / 14) + 1, c); }
  if (T.star > 0.05) for (const s of STARS) { if ((s.x * 7 + s.y) % 3 && T.star < 0.6) continue; R(g, s.x, Math.round(s.y * 0.9), 1, 1, rgba('#ffffff', (0.4 + 0.6 * T.star) * (0.6 + 0.4 * Math.sin(t * 2 + s.x)))); }
  const disc = (cx, cy, r, c) => { for (let j = -r; j <= r; j += 0.5) { const w = Math.sqrt(Math.max(0, r * r - j * j)); if (w > 0.2) R(g, Math.round((cx - w) * 2) / 2, cy + j, Math.round(w * 4) / 2, 0.5, c); } };
  const skyY = y0 => SHZ - (96 - y0) / 76 * (SHZ - 14);
  if (T.sun) { const x = T.sun.x, y = skyY(T.sun.y), low = 1 - Math.sin(Math.PI * T.sun.u), c = mix('#fff6c8', '#ffa050', low); disc(x, y, 9, rgba(c, 0.16)); disc(x, y, 6.5, rgba(c, 0.3)); disc(x, y, 4.5, c); disc(x - 1, y - 1, 2, '#fffbe8'); }
  if (T.moon) { const x = T.moon.x, y = skyY(T.moon.y); disc(x, y, 8, 'rgba(220,230,255,0.1)'); disc(x, y, 4.5, '#f2eed8'); R(g, x - 2, y - 1, 1.5, 1.5, '#d8d2b8'); R(g, x + 1, y + 1.5, 1.5, 1, '#d8d2b8'); }
  const cl = T.dark[1] > 0.3 ? mix(T.sky[1], '#ffffff', 0.18) : mix('#ffffff', T.sky[2], 0.4), cd = mix(cl, T.sky[1], 0.45);
  const puff = (cx, cy, rx, ry, c) => { for (let j = -ry; j <= 0; j += 0.5) { const w = rx * Math.sqrt(Math.max(0, 1 - (j * j) / (ry * ry))); R(g, Math.round((cx - w) * 2) / 2, cy + j, Math.round(w * 4) / 2, 0.5, c); } };
  for (let i = 0; i < 5; i++) {
    const w = 26 + (i * 13) % 14, x = ((i * 77 + t * (1.5 + i * 0.6) - V.scroll * 0.04) % (AW + 70) + AW + 70) % (AW + 70) - 35, y = 14 + i * 12 + (i % 2) * 4;
    R(g, Math.round(x * 2) / 2, y, w, 1, cd);
    puff(x + w * 0.5, y, w * 0.5, 2.5, cl); puff(x + w * 0.32, y, w * 0.24, 5, cl); puff(x + w * 0.62, y, w * 0.28, 7, cl);
  }
  return T;
}
