/* ───────── 배경: 하늘·해와 달·구름·풍경·빛 ───────── */
const VW = 240, VH = 128, GY = 104;   // 가상 화면 크기, 발 디딤선
const BG = {};

/* 색 섞기 */
const hex2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgbHex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, k) => { const A = hex2(a), B = hex2(b); return rgbHex(A.map((v, i) => v + (B[i] - v) * k)); };
const rgba = (h, a) => { const c = hex2(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };

/* 낮 하늘 (필드별): 위 · 가운데 · 지평선 */
const DAY_SKY = {
  plains:   ['#4f8fd6', '#86b8e6', '#d2e8f0'],
  forest:   ['#3f7a86', '#6a9e9a', '#b4d2bc'],
  mountain: ['#5a6aa8', '#8f9cc8', '#d6d6e2'],
  valley:   ['#3f8fdc', '#74b4e8', '#c8e4f2'],
  snow:     ['#6a8ccc', '#a2bce0', '#e6eef6'],
  desert:   ['#4f92d8', '#a4c6e2', '#f6e2ba'],
  town:     ['#5684c4', '#8cb0d8', '#d0e0ea']
};
/* 하루의 흐름 (dp: 0~0.25 새벽녘, 0.25~0.5 점심, 0.5~0.75 해질녘, 0.75~1 밤) */
const TOD = [
  { at: 0.0,  sky: ['#121a3e', '#33305e', '#9a6680'], dark: ['#1a1440', 0.42], star: 0.6 },
  { at: 0.13, sky: ['#3a5a9a', '#c48aa2', '#f6c08a'], dark: ['#3a2050', 0.14], star: 0 },
  { at: 0.27, sky: null, dark: ['#000000', 0], star: 0 },
  { at: 0.5,  sky: null, dark: ['#40200c', 0.04], star: 0 },
  { at: 0.62, sky: ['#38397a', '#d8704a', '#f8b060'], dark: ['#5a2010', 0.2], star: 0 },
  { at: 0.75, sky: ['#141a40', '#38285a', '#74466a'], dark: ['#140c30', 0.42], star: 0.55 },
  { at: 0.87, sky: ['#05081a', '#0c1430', '#1c2c4c'], dark: ['#04081a', 0.58], star: 1 },
  { at: 1.0,  sky: ['#121a3e', '#33305e', '#9a6680'], dark: ['#1a1440', 0.42], star: 0.6 }
];
const smooth = k => k * k * (3 - 2 * k);
function todAt(dp, id) {
  dp = ((dp % 1) + 1) % 1;
  let i = 0;
  while (i < TOD.length - 2 && TOD[i + 1].at <= dp) i++;
  const A = TOD[i], B = TOD[i + 1], k = smooth((dp - A.at) / (B.at - A.at));
  const day = DAY_SKY[id] || DAY_SKY.plains;
  const sk = K => (K.sky ? K.sky.map((c, j) => mix(c, day[j], 0.22)) : day);
  const sa = sk(A), sb = sk(B);
  const sky = sa.map((c, j) => mix(c, sb[j], k));
  const dark = [mix(A.dark[0], B.dark[0], k), A.dark[1] + (B.dark[1] - A.dark[1]) * k];
  const star = A.star + (B.star - A.star) * k;
  let sun = null, moon = null;
  if (dp > 0.06 && dp < 0.7) { const u = (dp - 0.06) / 0.64; sun = { x: 12 + u * 216, y: 96 - Math.sin(Math.PI * u) * 76, u }; }
  const dm = dp < 0.15 ? dp + 1 : dp;
  if (dm > 0.68 && dm < 1.12) { const u = (dm - 0.68) / 0.44; moon = { x: 12 + u * 216, y: 92 - Math.sin(Math.PI * u) * 70 }; }
  return { sky, dark, star, sun, moon };
}
const clockDp = () => (S ? (((S.t % DAY_SEC) + DAY_SEC) % DAY_SEC) / DAY_SEC : 0.6);

/* 작은 그리기 도구 */
function disc(g, cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); R(g, Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1, c); } }
function ell(g, cx, cy, rx, ry, c) { for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); R(g, cx - w, cy + y, w * 2 + 1, 1, c); } }
function ridge(g, w, base, amp, f1, f2, seed, col, light) {
  for (let i = 0; i < w; i++) {
    const y = Math.round(base - Math.sin((i + seed) * f1) * amp - Math.sin((i + seed * 3) * f2 + 1) * amp * 0.5);
    R(g, i, y, 1, VH - y, col);
    if (light) R(g, i, y, 1, 1, light);
  }
}
function peaks(g, w, base, minH, maxH, r, col, cap, shadow) {
  let x = -20;
  while (x < w + 20) {
    const pw = 36 + Math.floor(r() * 50), h = minH + Math.floor(r() * (maxH - minH));
    for (let i = 0; i < pw; i++) {
      const k = 1 - Math.abs(i - pw / 2) / (pw / 2), y = Math.round(base - h * k + (r() < 0.3 ? 1 : 0));
      const px = ((x + i) % w + w) % w;
      R(g, px, y, 1, VH - y, i > pw / 2 && shadow ? shadow : col);
      if (cap && k > 0.72) R(g, px, y, 1, Math.round((k - 0.72) * 30) + 1, i > pw / 2 ? mix(cap, col, 0.35) : cap);
    }
    x += Math.floor(pw * 0.62);
  }
}
function tree(g, x, base, h, trunk, leaf, leafL, leafD) {
  R(g, x - 1, base - h, 3, h, trunk); R(g, x - 1, base - h, 1, h, shade(trunk, 0.2)); R(g, x - 2, base - 1, 5, 1, shade(trunk, -0.2));
  const cy = base - h - 3;
  ell(g, x, cy, 9, 7, leafD); ell(g, x - 1, cy - 1, 8, 6, leaf); ell(g, x - 3, cy - 3, 4, 3, leafL);
  ell(g, x + 5, cy + 2, 4, 3, leaf); ell(g, x - 6, cy + 2, 4, 3, leaf);
}
function pine(g, x, base, h, c, snow) {
  const cD = shade(c, -0.25);
  R(g, x, base - 3, 1, 3, '#4a3424');
  const tiers = 4;
  for (let t2 = 0; t2 < tiers; t2++) {
    const top = base - h + t2 * Math.floor(h / (tiers + 1)), th = Math.floor(h / tiers) + 2;
    for (let i = 0; i < th; i++) { const w = Math.round(1 + i * (3 + t2) / th * 1.6); R(g, x - w, top + i, w, 1, c); R(g, x, top + i, w + 1, 1, cD); if (snow && i < 2) R(g, x - w, top + i, w * 2 + 1, 1, snow); }
  }
}
function rock(g, x, base, w, h, c) {
  const cL = shade(c, 0.2), cD = shade(c, -0.3);
  for (let i = 0; i < h; i++) { const k = i / h, ww = Math.round(w * (0.55 + 0.45 * Math.sqrt(k))); R(g, x + Math.round((w - ww) / 2), base - h + i, ww, 1, c); }
  R(g, x + Math.round(w * 0.25), base - h, Math.round(w * 0.4), 1, cL); R(g, x + 1, base - Math.round(h * 0.6), 2, 1, cL);
  R(g, x + Math.round(w * 0.6), base - h + 2, 1, Math.round(h * 0.4), cD); R(g, x, base - 1, w, 1, cD);
}
function tuft(g, x, y, c) { const cL = shade(c, 0.25); R(g, x, y - 3, 1, 3, c); R(g, x - 1, y - 2, 1, 2, c); R(g, x + 1, y - 4, 1, 4, cL); R(g, x + 2, y - 2, 1, 2, c); }
function flower(g, x, y, c) { R(g, x, y - 3, 1, 3, '#4f8a3c'); R(g, x - 1, y - 4, 3, 1, c); R(g, x, y - 5, 1, 3, c); R(g, x, y - 4, 1, 1, '#f7e04a'); }
function stars(seed, n) { const r = rng(seed), out = []; for (let i = 0; i < n; i++) out.push({ x: Math.floor(r() * VW), y: Math.floor(r() * 70), p: r() * 6, b: r() }); return out; }
const STARS = stars(99, 60);

/* ───────── 필드별 풍경 ───────── */
function buildPlains() {
  const r = rng(11);
  const [back, b] = mkCanvas(480, 128); peaks(b, 480, 80, 14, 32, r, '#7d96b8', '#eef2f8', '#6c84a6');
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 86, 6, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 7, 0, '#86ae7e', '#9cc28e');
  for (let x = 30; x < 480; x += 70) { R(f, x, 84 + (x % 3), 26, 2, '#a8b86a'); R(f, x + 2, 86 + (x % 3), 22, 1, '#94a85c'); }
  ridge(f, 480, 93, 4, Math.PI * 2 / 480 * 4, Math.PI * 2 / 480 * 9, 40, '#6e9e66');
  const [mid, m] = mkCanvas(480, 128);
  // 밀밭과 초지
  for (let x = 0; x < 480; x++) { const wheat = (x > 60 && x < 170) || (x > 300 && x < 400); R(m, x, 91, 1, 10, wheat ? (x % 3 ? '#d8b85a' : '#c4a046') : (x % 4 ? '#7aaa5a' : '#6a9a4c')); if (wheat && x % 2) R(m, x, 89 + (x % 4 === 1 ? 0 : 1), 1, 2, '#e8cc6a'); }
  [24, 196, 446].forEach(tx => tree(m, tx, 92, 14, '#5e4630', '#4f8a43', '#78b060', '#3a6a34'));
  // 울타리
  for (let x = 82; x < 170; x += 10) { R(m, x, 82, 2, 11, '#7a5634'); R(m, x, 82, 2, 1, '#9a7a4f'); if (x + 10 < 170) { R(m, x, 85, 10, 1, '#8a6a44'); R(m, x, 89, 10, 1, '#8a6a44'); } }
  // 농가
  R(m, 228, 70, 30, 22, '#e8dcc0'); R(m, 228, 70, 30, 1, '#fff4dc'); for (let i = 0; i < 9; i++) R(m, 225 + i, 70 - i, 36 - i * 2, 1, i % 3 ? '#a8432f' : '#8a3020');
  R(m, 238, 80, 7, 12, '#6b4a2e'); R(m, 248, 75, 6, 5, '#5a7ab0'); R(m, 248, 77, 6, 1, '#e8dcc0'); R(m, 251, 75, 1, 5, '#e8dcc0'); R(m, 254, 58, 3, 6, '#8a6a5a');
  // 풍차 몸통 (날개는 따로 돈다)
  R(m, 326, 58, 11, 34, '#d8d0c0'); R(m, 326, 58, 4, 34, '#e8e2d4'); R(m, 324, 54, 15, 5, '#8a3a2a'); R(m, 327, 51, 9, 3, '#8a3a2a'); R(m, 329, 80, 5, 12, '#5e4630'); R(m, 329, 66, 4, 4, '#5a7ab0');
  // 건초 더미
  [140, 380].forEach(hx => { ell(m, hx, 88, 7, 5, '#d8b050'); R(m, hx - 6, 87, 13, 1, '#b8903a'); R(m, hx - 3, 84, 4, 1, '#f0d070'); });
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#4f8a3c'); R(g, 0, 0, 480, 3, '#6aa84f'); R(g, 0, 0, 480, 1, '#86c060');
  R(g, 0, 6, 480, 10, '#b08a5a'); R(g, 0, 6, 480, 1, '#8c6c46'); R(g, 0, 15, 480, 1, '#8c6c46'); R(g, 0, 9, 480, 1, '#a07a4c'); R(g, 0, 12, 480, 1, '#a07a4c');
  for (let k = 0; k < 90; k++) { const x = Math.floor(r() * 480); R(g, x, 7 + Math.floor(r() * 8), 1 + Math.floor(r() * 2), 1, r() < 0.5 ? '#c8a678' : '#8c6c46'); }
  for (let k = 0; k < 70; k++) { const x = Math.floor(r() * 480); R(g, x, 18 + Math.floor(r() * 8), 1, 2, '#62a04c'); }
  for (let k = 0; k < 18; k++) R(g, Math.floor(r() * 480), 19 + Math.floor(r() * 7), 1, 1, ['#f0f0f0', '#f7e04a', '#e86a8a'][k % 3]);
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 6; x < 480; x += 22 + Math.floor(r() * 26)) { tuft(fo, x, 28, '#3f7a34'); if (r() < 0.5) flower(fo, x + 5, 28, ['#e86a8a', '#f7e04a', '#f0f0f0'][Math.floor(r() * 3)]); if (r() < 0.25) rock(fo, x + 10, 28, 6, 3, '#8a8478'); }
  return { back, far, mid, gr, fore, clouds: 7, ambient: 'meadow',
    props(g, off, t) { const x = ((330 - off) % 480 + 480) % 480 - 4, y = 56; for (const xx of [x, x - 480, x + 480]) { if (xx < -30 || xx > VW + 30) continue; const a0 = t * 1.2; for (let k = 0; k < 4; k++) { const a = a0 + k * Math.PI / 2; for (let i = 2; i < 15; i++) { R(g, Math.round(xx + Math.cos(a) * i), Math.round(y + Math.sin(a) * i), 1, 1, '#6b5a48'); if (i > 5) R(g, Math.round(xx + Math.cos(a) * i + Math.cos(a + 1.57) * 2), Math.round(y + Math.sin(a) * i + Math.sin(a + 1.57) * 2), 1, 1, '#e8e2d0'); } } R(g, xx - 1, y - 1, 3, 3, '#4a3a2a'); } } };
}

function buildForest() {
  const r = rng(23);
  const [back, b] = mkCanvas(480, 128);
  // 세계수
  R(b, 228, 16, 26, 92, '#2a4a42'); R(b, 216, 92, 50, 16, '#2a4a42'); ell(b, 241, 10, 110, 26, '#2a4a42'); ell(b, 150, 22, 40, 14, '#2a4a42'); ell(b, 330, 22, 40, 14, '#2a4a42');
  for (let x = 0; x < 480; x += 16) { if (x > 120 && x < 360) continue; const h = 46 + Math.floor(r() * 30); R(b, x + 6, 104 - h, 4, h, '#2a4a42'); ell(b, x + 8, 104 - h - 4, 10, 9, '#2a4a42'); }
  const [far, f] = mkCanvas(480, 128);
  for (let x = 0; x < 480; x += 12 + Math.floor(r() * 10)) {
    const h = 30 + Math.floor(r() * 30), kind = Math.floor(r() * 3);
    R(f, x + 3, 104 - h, 3, h, '#2a4038');
    if (kind === 0) { ell(f, x + 4, 104 - h - 2, 8 + Math.floor(r() * 4), 7, '#2f5248'); ell(f, x + 9, 104 - h + 4, 6, 5, '#2f5248'); }
    else if (kind === 1) pine(f, x + 4, 104 - h + 18, 24 + Math.floor(r() * 10), '#2f5248');
    else { ell(f, x + 4, 104 - h - 6, 6, 12, '#2f5248'); ell(f, x + 1, 104 - h + 4, 5, 6, '#2a4a40'); }
  }
  const [mid, m] = mkCanvas(480, 128);
  ell(m, 240, -4, 300, 14, '#24472c'); for (let x = 0; x < 480; x += 7) R(m, x, 8 + Math.floor(r() * 6), 7, 3, '#2f5a35');
  for (let x = 10; x < 480; x += 44 + Math.floor(r() * 22)) {
    const w = 7 + Math.floor(r() * 4), top = 14 + Math.floor(r() * 14);
    R(m, x, top, w, 102 - top, '#3b2e22'); R(m, x + 1, top, 1, 102 - top, '#52402e'); R(m, x + w - 2, top, 1, 102 - top, '#2a2018');
    for (let y = top + 6; y < 100; y += 9) R(m, x + 2 + (y % 3), y, 2, 1, '#2a2018');
    R(m, x - 3, 98, 3, 4, '#3b2e22'); R(m, x + w, 98, 3, 4, '#3b2e22');
    ell(m, x + w / 2, top - 4, 14, 8, '#2f5a35'); ell(m, x + w / 2 - 3, top - 6, 7, 4, '#3f7a44'); ell(m, x + w / 2 + 6, top - 2, 6, 4, '#2a5030');
    for (let k = 0; k < 3; k++) { const vx = x - 6 + Math.floor(r() * (w + 12)), vl = 8 + Math.floor(r() * 18); R(m, vx, top - 2, 1, vl, '#3f7a3a'); R(m, vx, top - 2 + vl, 1, 2, '#5a9a4a'); }
  }
  for (let x = 0; x < 480; x += 9) { const h = 3 + Math.floor(r() * 5); R(m, x, 101 - h, 4, h, '#3f7a3a'); R(m, x + 1, 101 - h, 1, 1, '#5a9a4a'); }
  const shrooms = [];
  for (let x = 30; x < 480; x += 60 + Math.floor(r() * 40)) { R(m, x, 96, 2, 5, '#e8dcc8'); R(m, x - 2, 94, 6, 2, '#b46ad8'); R(m, x - 1, 93, 4, 1, '#c88ae8'); shrooms.push(x); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#2f4a28'); R(g, 0, 0, 480, 3, '#3d6b3a'); R(g, 0, 0, 480, 1, '#4f8a44');
  R(g, 0, 6, 480, 10, '#3a2e22'); R(g, 0, 6, 480, 1, '#2a2018');
  for (let k = 0; k < 30; k++) { const x = Math.floor(r() * 470); R(g, x, 8 + Math.floor(r() * 6), 8 + Math.floor(r() * 6), 1, '#4b3a28'); }
  for (let k = 0; k < 60; k++) R(g, Math.floor(r() * 480), 17 + Math.floor(r() * 10), 1, 1, ['#c86a2a', '#8a5a2a', '#4f8a44'][k % 3]);
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 10; x < 480; x += 30 + Math.floor(r() * 30)) { const c = '#2a5a2a'; for (let i = 0; i < 5; i++) { R(fo, x + i * 2 - 4, 28 - 4 - i, 2, 1, c); R(fo, x + i * 2 - 4, 28 - 3 - i, 1, 3 + i, shade(c, 0.15)); } if (r() < 0.4) { R(fo, x + 8, 22, 2, 6, '#e8dcc8'); R(fo, x + 6, 20, 6, 2, '#c0392b'); R(fo, x + 7, 20, 1, 1, '#ffffff'); } }
  return { back, far, mid, gr, fore, clouds: 0, ambient: 'forest',
    emit(g, off, t, dark) { if (dark < 0.15) return; for (const sx of shrooms) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) { if (xx < -6 || xx > VW + 6) continue; R(g, xx - 2, 94, 6, 2, rgba('#d89aff', Math.min(1, dark * 1.6))); R(g, xx - 1, 93, 4, 1, rgba('#f0d0ff', Math.min(1, dark * 1.6))); } } },
    lights(off, dark) { const out = []; if (dark < 0.15) return out; for (const sx of shrooms) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -20 && xx < VW + 20) out.push({ x: xx, y: 94, r: 10, c: '#b46ad8' }); } return out; },
    props(g, off, t, dark) { if (dark > 0.1) return; for (let i = 0; i < 4; i++) { const x0 = ((i * 130 - off * 0.6) % 520 + 520) % 520 - 60; g.fillStyle = 'rgba(255,248,200,0.07)'; for (let y = 0; y < 100; y += 2) g.fillRect(Math.round(x0 + y * 0.45), y, 10, 2); } } };
}

function buildMountain() {
  const r = rng(37);
  const [back, b] = mkCanvas(480, 128); peaks(b, 480, 96, 44, 78, r, '#5a5470', '#ece8f4', '#4a4460');
  const [far, f] = mkCanvas(480, 128); peaks(f, 480, 102, 18, 40, r, '#3e384c', null, '#342e40');
  for (let x = 10; x < 480; x += 26 + Math.floor(r() * 30)) pine(f, x, 98, 14 + Math.floor(r() * 8), '#26302c');
  const [mid, m] = mkCanvas(480, 128);
  for (let k = 0; k < 12; k++) { const bx = Math.floor(r() * 470), bw = 12 + Math.floor(r() * 20), bh = 7 + Math.floor(r() * 12); rock(m, bx, 101, bw, bh, '#4e4a56'); }
  for (let k = 0; k < 7; k++) pine(m, Math.floor(r() * 470), 100, 20 + Math.floor(r() * 10), '#24302c');
  // 갱도 입구
  R(m, 300, 70, 30, 31, '#26222a'); R(m, 298, 68, 4, 33, '#6b4a2e'); R(m, 328, 68, 4, 33, '#6b4a2e'); R(m, 296, 66, 38, 4, '#7a5634'); R(m, 296, 66, 38, 1, '#9a7a4f'); R(m, 306, 82, 18, 19, '#16141a');
  const crystals = [];
  for (let x = 40; x < 480; x += 90 + Math.floor(r() * 50)) { R(m, x, 94, 2, 7, '#8a6ad8'); R(m, x + 2, 96, 2, 5, '#6a4ab8'); R(m, x - 2, 97, 2, 4, '#7a5ac8'); R(m, x, 94, 1, 2, '#d8c8ff'); crystals.push(x); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#3c3a3e'); R(g, 0, 0, 480, 2, '#4f4c54'); R(g, 0, 7, 480, 9, '#4a4648'); R(g, 0, 7, 480, 1, '#2e2c30');
  for (let k = 0; k < 140; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 1 + Math.floor(r() * 2), 1, r() < 0.5 ? '#5a5760' : '#2e2c30');
  for (let x = 4; x < 480; x += 9) R(g, x, 8, 4, 7, '#5e4630'); R(g, 0, 9, 480, 1, '#8a8a90'); R(g, 0, 14, 480, 1, '#8a8a90');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 14; x < 480; x += 40 + Math.floor(r() * 40)) { rock(fo, x, 28, 10 + Math.floor(r() * 8), 5 + Math.floor(r() * 3), '#3a363e'); if (r() < 0.5) tuft(fo, x + 14, 28, '#4a5a3a'); }
  return { back, far, mid, gr, fore, clouds: 4, ambient: 'mountain',
    emit(g, off, t, dark) { if (dark < 0.12) return; const a = Math.min(1, dark * 1.8) * (0.7 + 0.3 * Math.sin(t * 2)); for (const cx of crystals) { const x = ((cx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -6 && xx < VW + 6) { R(g, xx, 94, 2, 7, rgba('#b89aff', a)); R(g, xx, 94, 1, 2, rgba('#ffffff', a)); } } },
    lights(off, dark) { const out = []; if (dark < 0.12) return out; for (const cx of crystals) { const x = ((cx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -20 && xx < VW + 20) out.push({ x: xx + 1, y: 96, r: 12, c: '#8a6ad8' }); } return out; } };
}

function mesa(g, x, w, h, col, band, dark) {
  for (let i = 0; i < h + 28; i++) {
    const y = 100 - h + i, inset = i < 3 ? 3 - i : 0, widen = Math.floor(i / 5);
    const x0 = x + inset - widen, ww = w - inset * 2 + widen * 2;
    R(g, x0, y, ww, 1, i % 9 < 2 && i > 3 ? band : col);
    R(g, x0 + ww - 4, y, 4, 1, dark);
    if (i === 0) R(g, x0, y, ww, 1, shade(col, 0.2));
  }
}
function buildValley() {
  const r = rng(53);
  const [back, b] = mkCanvas(480, 128);
  for (let x = -20; x < 480;) { const w = 60 + Math.floor(r() * 70), h = 24 + Math.floor(r() * 30); mesa(b, x, w, h, '#b8806a', '#a06c58', '#9a6654'); x += w + 10 + Math.floor(r() * 40); }
  const [far, f] = mkCanvas(480, 128);
  // 따로 솟은 바위 기둥들 (사이로 뒤쪽 메사가 보인다)
  for (let x = 0; x < 480;) {
    const w = 26 + Math.floor(r() * 44), base = 52 + Math.floor(r() * 22);
    for (let i = 0; i < w; i++) {
      const edge = Math.min(i, w - 1 - i), y = Math.round(base + (edge < 4 ? (4 - edge) * 3 : 0) + Math.sin(i * 0.9) * 1.5 + (r() < 0.15 ? -2 : 0));
      R(f, x + i, y, 1, 104 - y, i > w * 0.65 ? '#6a5468' : '#7a6478'); R(f, x + i, y, 1, 1, '#9a8498');
      if (i % 11 === 5) R(f, x + i, y + 6, 1, 20, '#5e4a5c');
    }
    x += w + 8 + Math.floor(r() * 34);
  }
  for (let i = 0; i < 40; i++) R(f, 190 + i, 58 + Math.round(Math.sin(i / 40 * Math.PI) * 6), 1, 1, '#5a3a2a');
  for (let i = 0; i < 40; i += 4) R(f, 190 + i, 54 + Math.round(Math.sin(i / 40 * Math.PI) * 6), 1, 4, '#5a3a2a');
  const [mid, m] = mkCanvas(480, 128);
  for (let k = 0; k < 10; k++) rock(m, Math.floor(r() * 470), 101, 12 + Math.floor(r() * 20), 8 + Math.floor(r() * 14), '#6a6070');
  // 바위 기둥 위 둥지
  R(m, 360, 60, 14, 41, '#6a6070'); R(m, 360, 60, 3, 41, '#8a8090'); ell(m, 367, 58, 10, 3, '#7a5634'); R(m, 363, 54, 3, 3, '#f0e8d8'); R(m, 368, 55, 3, 3, '#f0e8d8');
  // 마른 나무
  R(m, 120, 70, 3, 31, '#5a4a3a'); R(m, 112, 72, 9, 1, '#5a4a3a'); R(m, 112, 70, 1, 3, '#5a4a3a'); R(m, 122, 78, 10, 1, '#5a4a3a'); R(m, 131, 75, 1, 4, '#5a4a3a');
  for (let x = 0; x < 480; x += 5) { const h = 3 + Math.floor(r() * 4); R(m, x, 101 - h, 1, h, '#9ab86a'); R(m, x + 1, 101 - h + 1, 1, h - 1, '#7a9a5a'); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#7a8a5a'); R(g, 0, 0, 480, 3, '#9ab86a'); R(g, 0, 6, 480, 10, '#9a8a6a'); R(g, 0, 6, 480, 1, '#7a6a4e');
  for (let k = 0; k < 90; k++) R(g, Math.floor(r() * 480), 7 + Math.floor(r() * 8), 2, 1, r() < 0.6 ? '#b8a888' : '#7a6a4e');
  for (let k = 0; k < 60; k++) R(g, Math.floor(r() * 480), 18 + Math.floor(r() * 8), 1, 2, '#8aa85a');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 8; x < 480; x += 26 + Math.floor(r() * 30)) { for (let i = 0; i < 4; i++) { R(fo, x + i * 2, 28 - 6 - i, 1, 6 + i, '#7a9a4a'); R(fo, x + i * 2 + 1, 28 - 7 - i, 1, 2, '#9ab86a'); } }
  return { back, far, mid, gr, fore, clouds: 6, ambient: 'wind' };
}

function buildSnow() {
  const r = rng(61);
  const [back, b] = mkCanvas(480, 128); peaks(b, 480, 96, 40, 76, r, '#e4ecf6', '#ffffff', '#b8c8e0');
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 90, 8, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 8, 12, '#d0dcec', '#f4f8fc');
  for (let x = 8; x < 480; x += 14 + Math.floor(r() * 14)) pine(f, x, 92 + Math.floor(r() * 4), 14 + Math.floor(r() * 6), '#4a6a7a', '#e8f0f8');
  const [mid, m] = mkCanvas(480, 128);
  for (let k = 0; k < 11; k++) pine(m, Math.floor(r() * 470), 101, 22 + Math.floor(r() * 12), '#2a4a3a', '#f0f6fc');
  for (let k = 0; k < 7; k++) { const bx = Math.floor(r() * 460); rock(m, bx, 101, 14, 8, '#8a98ac'); R(m, bx + 3, 93, 8, 2, '#f4f8fc'); }
  const ice = [];
  for (let x = 50; x < 480; x += 100 + Math.floor(r() * 40)) { R(m, x, 90, 2, 11, '#8ad8ff'); R(m, x + 2, 94, 2, 7, '#6ab8e8'); R(m, x - 2, 95, 2, 6, '#7ac8f0'); R(m, x, 90, 1, 3, '#ffffff'); ice.push(x); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#e8eef4'); R(g, 0, 0, 480, 2, '#ffffff');
  for (let k = 0; k < 60; k++) R(g, Math.floor(r() * 476), 4 + Math.floor(r() * 22), 4 + Math.floor(r() * 4), 1, '#c8d4e4');
  for (let x2 = 6; x2 < 480; x2 += 14) { R(g, x2, 10, 2, 1, '#b8c6da'); R(g, x2 + 5, 13, 2, 1, '#b8c6da'); }
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 10; x < 480; x += 40 + Math.floor(r() * 40)) { ell(fo, x, 28, 10, 4, '#f4f8fc'); R(fo, x - 6, 25, 12, 1, '#ffffff'); }
  return { back, far, mid, gr, fore, clouds: 5, ambient: 'snow',
    emit(g, off, t, dark) { if (dark < 0.15) return; for (const cx of ice) { const x = ((cx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -6 && xx < VW + 6) R(g, xx, 90, 1, 3, rgba('#ffffff', Math.min(1, dark * 1.6))); } } };
}

function buildDesert() {
  const r = rng(71);
  const [back, b] = mkCanvas(480, 128);
  ridge(b, 480, 84, 8, Math.PI * 2 / 480 * 2, Math.PI * 2 / 480 * 5, 10, '#d8a868', '#e8c088');
  for (let i = 0; i < 26; i++) R(b, 300 - i, 58 + i, i * 2 + 1, 1, i % 4 ? '#c89858' : '#b8884a');
  for (let i = 0; i < 26; i++) R(b, 300, 58 + i, i, 1, '#b07a42');
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 92, 6, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 8, 70, '#e2b474', '#f0c88c');
  for (let x = 0; x < 480; x += 3) R(f, x, 95 + Math.round(Math.sin(x * 0.07) * 2), 2, 1, '#d0a060');
  const [mid, m] = mkCanvas(480, 128);
  const cactus = (cx, h) => { R(m, cx, 101 - h, 3, h, '#4a8a4a'); R(m, cx, 101 - h, 1, h, '#6aaa5a'); R(m, cx - 3, 92 - h / 3, 3, 2, '#4a8a4a'); R(m, cx - 3, 88 - h / 3, 1, 5, '#4a8a4a'); R(m, cx + 3, 94 - h / 3, 3, 2, '#4a8a4a'); R(m, cx + 5, 89 - h / 3, 1, 6, '#4a8a4a'); };
  for (let k = 0; k < 6; k++) cactus(Math.floor(r() * 460), 14 + Math.floor(r() * 10));
  // 무너진 기둥과 뼈
  [[150, 26], [170, 14], [186, 20]].forEach(([cx, h]) => { R(m, cx, 101 - h, 7, h, '#d8c098'); R(m, cx, 101 - h, 2, h, '#e8d8b8'); R(m, cx - 1, 101 - h, 9, 2, '#c8a878'); });
  R(m, 168, 96, 16, 5, '#c8a878');
  for (let k = 0; k < 4; k++) { const bx = Math.floor(r() * 460); R(m, bx, 98, 8, 2, '#f0e8d8'); R(m, bx + 2, 96, 1, 2, '#f0e8d8'); R(m, bx + 5, 96, 1, 2, '#f0e8d8'); }
  // 오아시스
  ell(m, 400, 99, 18, 3, '#3a8ab8'); R(m, 386, 98, 28, 1, '#6ab8e0');
  R(m, 392, 72, 2, 26, '#8a6a3a'); R(m, 394, 70, 2, 4, '#8a6a3a'); [[-10, 2], [-6, -2], [2, -3], [8, 0], [11, 4]].forEach(([dx, dy]) => { R(m, 395 + dx, 69 + dy, 8, 2, '#3a8a3a'); R(m, 395 + dx + (dx < 0 ? -1 : 6), 70 + dy, 3, 2, '#2a6a2a'); });
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#e8c890'); R(g, 0, 0, 480, 1, '#f4d8a4');
  for (let y = 3; y < 28; y += 5) for (let x2 = (y * 7) % 11; x2 < 480; x2 += 22) R(g, x2, y, 9, 1, '#d8b078');
  for (let k = 0; k < 40; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 1, 1, '#c89860');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 20; x < 480; x += 50 + Math.floor(r() * 40)) { if (r() < 0.5) { ell(fo, x, 25, 4, 3, '#a8884a'); R(fo, x - 3, 23, 1, 1, '#8a6a3a'); R(fo, x + 2, 22, 1, 1, '#8a6a3a'); } else rock(fo, x, 28, 9, 4, '#b8946a'); }
  return { back, far, mid, gr, fore, clouds: 2, ambient: 'sand' };
}

function buildUnder(kind) {
  const r = rng(kind.length * 13);
  const pal = {
    cellar: { wall: '#3a302a', line: '#2a221e', floor: '#5a4632', fl: '#4a3a28' },
    cave:   { wall: '#2a2a22', line: '#1e1e18', floor: '#2f2a20', fl: '#3a3428' },
    mine:   { wall: '#2e2b30', line: '#222024', floor: '#3a3438', fl: '#2a2628' },
    nest:   { wall: '#4a4038', line: '#3a322c', floor: '#5a4a3a', fl: '#4a3a2c' },
    icetemple: { wall: '#6a98b8', line: '#4a7898', floor: '#a8c8dc', fl: '#8ab0c8', torch: '#8ad8ff' },
    tomb:   { wall: '#a8844e', line: '#7a5a32', floor: '#c8a468', fl: '#a8844e' },
    alley:  { wall: '#2a2628', line: '#1a1618', floor: '#3a3438', fl: '#2a2628', torch: '#e04a3a' }
  }[kind];
  const [mid, m] = mkCanvas(480, 128);
  R(m, 0, 0, 480, 104, pal.wall);
  for (let y = 4; y < 104; y += 8) {
    R(m, 0, y, 480, 1, pal.line);
    for (let x = (y / 8) % 2 ? 0 : 8; x < 480; x += 16) { R(m, x, y, 1, 8, pal.line); R(m, x + 1, y + 1, 14, 1, shade(pal.wall, 0.08)); if (r() < 0.12) R(m, x + 3, y + 3, 5, 3, shade(pal.wall, -0.12)); }
  }
  if (kind === 'cellar') for (let x = 20; x < 480; x += 70) { R(m, x, 82, 14, 18, '#a8905a'); R(m, x + 2, 80, 10, 2, '#a8905a'); R(m, x + 5, 86, 4, 1, '#7a6440'); R(m, x, 90, 14, 1, '#7a6440'); }
  if (kind === 'cave') for (let x = 0; x < 480; x += 13) { const h = 4 + Math.floor(r() * 18); R(m, x, 0, 3, h, '#4b3420'); R(m, x + 1, h, 1, 3, '#4b3420'); if (r() < 0.3) R(m, x + 1, h + 3, 1, 1, '#7ad87a'); }
  if (kind === 'mine') for (let x = 30; x < 480; x += 80) { R(m, x, 20, 5, 84, '#6b4a2e'); R(m, x + 40, 20, 5, 84, '#6b4a2e'); R(m, x, 18, 45, 4, '#7a5634'); R(m, x, 18, 45, 1, '#9a7a4f'); R(m, x + 20, 22, 3, 2, '#3a3a40'); }
  if (kind === 'nest') for (let x = 0; x < 480; x += 9) { const y = 60 + Math.floor(r() * 36); R(m, x, y, 10, 1, '#7a5634'); R(m, x + 3, y - 2, 6, 1, '#8a6a44'); if (r() > 0.85) { R(m, x + 2, y - 6, 4, 5, '#f0e8d8'); R(m, x + 3, y - 7, 2, 1, '#f0e8d8'); } }
  if (kind === 'icetemple') { for (let x = 0; x < 480; x += 7) { const h = 3 + Math.floor(r() * 10); R(m, x, 0, 2, h, '#e8f6ff'); R(m, x, h, 1, 2, '#e8f6ff'); } for (let x = 40; x < 480; x += 100) { R(m, x, 30, 10, 74, '#c8e4f4'); R(m, x + 2, 30, 2, 74, '#ffffff'); R(m, x - 2, 26, 14, 4, '#e8f6ff'); } }
  if (kind === 'tomb') { for (let x = 16; x < 480; x += 60) { R(m, x, 40, 3, 3, '#5a3a1a'); R(m, x + 6, 38, 2, 6, '#5a3a1a'); R(m, x + 11, 40, 4, 2, '#5a3a1a'); R(m, x + 2, 50, 10, 1, '#5a3a1a'); } for (let x = 70; x < 480; x += 150) { R(m, x, 84, 30, 16, '#8a6a3a'); R(m, x + 2, 82, 26, 2, '#c8a468'); R(m, x + 12, 86, 6, 10, '#f0c24a'); } }
  if (kind === 'alley') { for (let x = 10; x < 480; x += 55) { R(m, x, 86, 14, 14, '#5e4630'); R(m, x + 1, 87, 12, 1, '#7a5a3a'); R(m, x + 6, 86, 1, 14, '#4a3420'); } for (let x = 30; x < 480; x += 90) { R(m, x, 30, 18, 14, '#16141a'); R(m, x + 2, 32, 6, 4, '#3a2a2a'); } }
  // 횃불 받침 (불꽃은 따로 그린다)
  for (let x = 40; x < 480; x += 120) { R(m, x, 52, 2, 9, '#5e4630'); R(m, x - 1, 51, 4, 2, '#3a2a1e'); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, pal.floor);
  for (let x = 0; x < 480; x += 12) R(g, x, 0, 1, 28, pal.fl);
  for (let y = 7; y < 28; y += 7) R(g, 0, y, 480, 1, pal.fl);
  R(g, 0, 0, 480, 1, shade(pal.floor, 0.2));
  if (kind === 'mine') { R(g, 0, 10, 480, 1, '#8a8a90'); R(g, 0, 16, 480, 1, '#8a8a90'); for (let x = 2; x < 480; x += 8) R(g, x, 9, 3, 9, '#5e4630'); }
  const [fore, fo] = mkCanvas(480, 128);
  for (let x = 90; x < 480; x += 200) { R(fo, x, 0, 12, 128, shade(pal.wall, -0.45)); R(fo, x, 0, 2, 128, shade(pal.wall, -0.3)); R(fo, x - 2, 0, 16, 6, shade(pal.wall, -0.5)); }
  const torch = pal.torch || '#f0a03a';
  return { under: true, wall: pal.wall, torch, mid, gr, foreTall: fore, ambient: 'dust',
    emit(g, off, t) { for (let x = 40; x < 480; x += 120) { const xx = ((x - off) % 480 + 480) % 480; for (const tx of [xx, xx - 480]) { if (tx < -8 || tx > VW + 8) continue; const fl = Math.floor(t * 9 + x) % 3; R(g, tx - 1, 47 - fl, 4, 4 + fl, torch); R(g, tx, 46 - fl, 2, 3, '#f7e04a'); R(g, tx, 48, 2, 2, '#fff2c0'); } } },
    lights(off) { const out = []; for (let x = 40; x < 480; x += 120) { const xx = ((x - off) % 480 + 480) % 480; for (const tx of [xx, xx - 480]) if (tx > -40 && tx < VW + 40) out.push({ x: tx + 1, y: 48, r: 34, c: torch, glow: 1 }); } return out; } };
}

function buildTown() {
  const r = rng(7);
  const [back, b] = mkCanvas(240, 128);
  // 언덕 위 황궁
  ell(b, 186, 96, 60, 22, '#3a4262'); R(b, 160, 52, 52, 30, '#3a4262'); for (const [tx, th] of [[158, 40], [176, 52], [196, 46], [212, 36]]) { R(b, tx, 82 - th, 9, th, '#3a4262'); for (let i = 0; i < 6; i++) R(b, tx + i, 82 - th - 6 + i, 9 - i * 2 > 0 ? 9 - i * 2 : 1, 1, '#2e3452'); R(b, tx + 4, 82 - th - 10, 1, 4, '#2e3452'); R(b, tx + 5, 82 - th - 10, 3, 2, '#a8432f'); }
  const [far, f] = mkCanvas(240, 128);
  let x = 0;
  const wins = [];
  while (x < 240) {
    const w = 18 + Math.floor(r() * 22), h = 26 + Math.floor(r() * 26), c = ['#3a3440', '#34303a', '#403a46'][Math.floor(r() * 3)];
    R(f, x, 100 - h, w, h, c); for (let i = 0; i < 5; i++) R(f, x - 1 + i, 100 - h - 5 + i, w + 2 - i * 2, 1, '#2a2430');
    if (r() < 0.6) R(f, x + w - 6, 100 - h - 10, 3, 6, '#2a2430');
    for (let i = 0; i < 3; i++) if (r() > 0.4) { const wx = x + 4 + Math.floor(r() * (w - 8)), wy = 100 - h + 6 + Math.floor(r() * (h - 16)); R(f, wx, wy, 2, 3, '#1e1a24'); wins.push([wx, wy, 2, 3]); }
    x += w + 2;
  }
  const [mid, m] = mkCanvas(240, 128);
  // 우리 상단 건물
  R(m, 82, 54, 76, 46, '#5a4636'); for (let y = 58; y < 100; y += 5) R(m, 82, y, 76, 1, '#4a3a2e'); R(m, 82, 54, 2, 46, '#6a5442');
  R(m, 76, 48, 88, 7, '#3a2a24'); R(m, 76, 48, 88, 1, '#5a3e32'); R(m, 80, 44, 80, 4, '#4a3428'); for (let i = 0; i < 80; i += 4) R(m, 80 + i, 44, 2, 4, '#3a2a24');
  R(m, 112, 72, 16, 28, '#2a1d14'); R(m, 114, 74, 12, 26, '#6e5236'); R(m, 119, 74, 1, 26, '#5a4028'); R(m, 124, 86, 1, 2, '#e8b84a');
  R(m, 88, 66, 18, 14, '#1e1814'); R(m, 134, 66, 18, 14, '#1e1814'); R(m, 87, 80, 20, 2, '#7a5634'); R(m, 133, 80, 20, 2, '#7a5634');
  R(m, 104, 57, 32, 9, '#7a5634'); R(m, 105, 58, 30, 7, '#a8743e'); R(m, 106, 58, 28, 1, '#c8945a'); R(m, 117, 59, 6, 5, '#f0c24a'); R(m, 118, 60, 4, 3, '#c99a2a'); R(m, 119, 61, 2, 1, '#f0c24a');
  R(m, 108, 96, 6, 4, '#8a6a44'); R(m, 128, 94, 5, 6, '#7a5634'); R(m, 128, 94, 5, 1, '#9a7a4f'); R(m, 160, 92, 8, 8, '#6b4a2e'); R(m, 160, 92, 8, 1, '#8a6a44'); R(m, 162, 96, 4, 1, '#4a3420');
  // 이웃 건물
  R(m, 18, 58, 58, 42, '#3a3436'); R(m, 12, 54, 70, 5, '#26201f'); R(m, 30, 70, 10, 12, '#1e1814'); R(m, 54, 72, 12, 28, '#1a1416'); R(m, 46, 76, 3, 3, '#1e1814');
  R(m, 166, 58, 62, 42, '#34303a'); R(m, 160, 54, 74, 5, '#1c1a20'); R(m, 176, 68, 12, 10, '#1e1814'); R(m, 204, 70, 12, 30, '#16141a');
  wins.push([88, 66, 18, 14], [134, 66, 18, 14], [30, 70, 10, 12], [176, 68, 12, 10]);
  // 가로등
  for (const lx of [70, 172]) { R(m, lx, 70, 2, 30, '#2a2a30'); R(m, lx - 2, 68, 6, 3, '#3a3a40'); R(m, lx - 1, 71, 4, 4, '#4a4a50'); }
  const [gr, g] = mkCanvas(240, 28);
  R(g, 0, 0, 240, 28, '#3a3a42');
  for (let y = 0; y < 28; y += 5) { R(g, 0, y, 240, 1, '#2a2a30'); for (let x2 = (y / 5) % 2 ? 0 : 5; x2 < 240; x2 += 10) { R(g, x2, y, 1, 5, '#2a2a30'); R(g, x2 + 1, y + 1, 8, 1, '#46464e'); } }
  R(g, 150, 14, 30, 4, '#22304a'); R(g, 154, 13, 22, 1, '#22304a'); R(g, 158, 15, 6, 1, '#4a6a9a');
  const [fore, fo] = mkCanvas(240, 28);
  R(fo, 2, 14, 10, 14, '#6b4a2e'); R(fo, 2, 14, 10, 1, '#8a6a44'); R(fo, 2, 19, 10, 1, '#4a3420'); R(fo, 2, 24, 10, 1, '#4a3420');
  R(fo, 226, 16, 12, 12, '#7a5634'); R(fo, 226, 16, 12, 1, '#9a7a4f'); R(fo, 231, 16, 1, 12, '#5a3e22');
  return { back, far, mid, gr, fore, clouds: 5, town: true, ambient: 'town',
    emit(g, off, t, dark) {
      if (dark < 0.12) return;
      const a = Math.min(1, dark * 1.7), fl = Math.floor(t * 5) % 2;
      for (const [wx, wy, ww, wh] of wins) { R(g, wx, wy, ww, wh, rgba(fl && ww > 10 ? '#f0b040' : '#e8a83a', a)); if (ww > 8) { R(g, wx + Math.floor(ww / 2), wy, 1, wh, rgba('#7a5634', a)); R(g, wx, wy + Math.floor(wh / 2), ww, 1, rgba('#7a5634', a)); } }
      for (const lx of [70, 172]) R(g, lx - 1, 71, 4, 4, rgba('#fff0b0', a));
      R(g, 99, 60, 3, 4, rgba(fl ? '#f7c04a' : '#e8a03a', a)); R(g, 138, 60, 3, 4, rgba(fl ? '#e8a03a' : '#f7c04a', a));
    },
    lights(off, dark) { if (dark < 0.12) return []; return [{ x: 71, y: 73, r: 30, c: '#f0c060', glow: 1 }, { x: 173, y: 73, r: 30, c: '#f0c060', glow: 1 }, { x: 97, y: 73, r: 22, c: '#e8a83a' }, { x: 143, y: 73, r: 22, c: '#e8a83a' }, { x: 120, y: 62, r: 16, c: '#f7c04a' }]; } };
}

function getBg(id) {
  if (BG[id]) return BG[id];
  const make = { plains: buildPlains, forest: buildForest, mountain: buildMountain, town: buildTown,
    cellar: () => buildUnder('cellar'), cave: () => buildUnder('cave'), mine: () => buildUnder('mine'),
    valley: buildValley, snow: buildSnow, desert: buildDesert,
    nest: () => buildUnder('nest'), icetemple: () => buildUnder('icetemple'), tomb: () => buildUnder('tomb'), alley: () => buildUnder('alley') }[id] || buildPlains;
  return (BG[id] = make());
}
function tile(ctx, img, off, y) {
  const w = img.width, s = ((Math.floor(off) % w) + w) % w;
  ctx.drawImage(img, -s, y);
  if (w - s < VW) ctx.drawImage(img, w - s, y);
}

/* ───────── 하늘 ───────── */
function cloudAt(g, x, y, w, c, cD) { R(g, x + 3, y - 3, w - 8, 3, c); R(g, x, y, w, 4, c); R(g, x + 2, y + 4, w - 4, 1, cD); R(g, x + w * 0.4, y - 5, w * 0.3, 2, c); }
function drawSky(g, id, scroll, t, dp) {
  const T = todAt(dp, id), b = getBg(id);
  if (b.under) return T;
  for (let i = 0; i < 9; i++) { const k = i / 8, c = k < 0.5 ? mix(T.sky[0], T.sky[1], k * 2) : mix(T.sky[1], T.sky[2], (k - 0.5) * 2); R(g, 0, i * 12, VW, 13, c); }
  R(g, 0, 104, VW, 24, T.sky[2]);
  if (T.star > 0.02) for (const s of STARS) { const tw = 0.55 + 0.45 * Math.sin(t * (1.5 + s.b * 2) + s.p); const a = T.star * tw * (0.5 + s.b * 0.5); if (a < 0.05) continue; const sx = ((s.x - scroll * 0.01) % VW + VW) % VW; R(g, Math.round(sx), s.y, 1, 1, `rgba(255,250,235,${a.toFixed(2)})`); if (s.b > 0.85) { R(g, Math.round(sx) - 1, s.y, 3, 1, `rgba(255,250,235,${(a * 0.35).toFixed(2)})`); R(g, Math.round(sx), s.y - 1, 1, 3, `rgba(255,250,235,${(a * 0.35).toFixed(2)})`); } }
  if (T.sun) {
    const low = 1 - Math.sin(Math.PI * T.sun.u), c = mix('#fff6c8', '#ffa050', low), x = Math.round(T.sun.x), y = Math.round(T.sun.y);
    disc(g, x, y, 9, rgba(c, 0.18)); disc(g, x, y, 6, rgba(c, 0.35)); disc(g, x, y, 4, c); disc(g, x - 1, y - 1, 2, '#fffbe8');
  }
  if (T.moon) {
    const x = Math.round(T.moon.x), y = Math.round(T.moon.y), day = S ? (today() % MONTH_DAYS) : 15, ph = Math.abs(day - 15) / 15;
    disc(g, x, y, 9, 'rgba(220,230,255,0.10)'); disc(g, x, y, 5, '#f2eed8'); R(g, x - 2, y - 1, 2, 2, '#d8d2b8'); R(g, x + 1, y + 2, 2, 1, '#d8d2b8'); R(g, x + 1, y - 3, 1, 1, '#d8d2b8');
    if (ph > 0.15) disc(g, x + Math.round((1 - ph) * 8) + 2, y - 1, 5, mix(T.sky[0], T.sky[1], 0.3));
  }
  const nC = b.clouds || 0;
  if (nC) {
    const day = DAY_SKY[id] || DAY_SKY.plains, warm = mix('#ffffff', T.sky[2], 0.55), c = T.dark[1] > 0.3 ? mix(T.sky[1], '#ffffff', 0.18) : warm, cD = mix(c, T.sky[1], 0.4);
    for (let i = 0; i < nC; i++) { const w = 18 + (i * 37) % 22, sp = 1.5 + (i % 3), y = 10 + (i * 23) % 40, x = ((i * 97 + t * sp - scroll * 0.05) % (VW + 80) + VW + 80) % (VW + 80) - 40; cloudAt(g, Math.round(x), y, w, c, cD); }
    void day;
  }
  return T;
}

/* ───────── 풍경 (어둠은 화면 쪽에서 입힌다) ───────── */
function haze(g, c, a) { g.save(); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = a; g.fillStyle = c; g.fillRect(0, 0, VW, VH); g.restore(); }
function drawLand(g, id, scroll, t, T) {
  const b = getBg(id);
  if (b.under) { tile(g, b.mid, scroll * 0.6, 0); tile(g, b.gr, scroll, 100); return; }
  if (b.town) { g.drawImage(b.back, 0, 0); haze(g, T.sky[2], 0.4); g.drawImage(b.far, 0, 0); haze(g, T.sky[2], 0.12); g.drawImage(b.mid, 0, 0); g.drawImage(b.gr, 0, 100); return; }
  tile(g, b.back, scroll * 0.08, 0); haze(g, T.sky[2], 0.42);
  tile(g, b.far, scroll * 0.2, 0); haze(g, T.sky[2], 0.18);
  tile(g, b.mid, scroll * 0.5, 0);
  if (b.props) b.props(g, scroll * 0.5, t, T.dark[1]);
  tile(g, b.gr, scroll, 100);
}
function drawFore(g, id, scroll) {
  const b = getBg(id);
  if (b.foreTall) tile(g, b.foreTall, scroll * 1.25, 0);
  else if (b.fore) { if (b.town) g.drawImage(b.fore, 0, 100); else tile(g, b.fore, scroll * 1.15, 100); }
}
function bgLights(id, scroll, dark) { const b = getBg(id); return b.lights ? b.lights(b.under ? scroll * 0.6 : b.town ? 0 : scroll * 0.5, dark) : []; }
function bgEmit(g, id, scroll, t, dark) { const b = getBg(id); if (b.emit) b.emit(g, b.under ? scroll * 0.6 : b.town ? 0 : scroll * 0.5, t, dark); }

/* ───────── 날씨와 생물 (빛을 입힌 뒤에 그린다) ───────── */
function drawAmbient(g, id, scroll, t, T) {
  const b = getBg(id), dark = T.dark[1], amb = b.ambient;
  const wrap = (v, m) => ((v % m) + m) % m;
  if ((amb === 'meadow' || amb === 'forest') && dark > 0.2) {
    for (let i = 0; i < 12; i++) { const x = wrap(i * 41 + Math.sin(t * 0.7 + i) * 14 - scroll * 0.7, VW), y = 60 + (i * 17) % 40 + Math.sin(t * 1.3 + i * 2) * 5, on = Math.sin(t * 2.5 + i * 1.7) > 0.1; if (on) { R(g, Math.round(x), Math.round(y), 1, 1, `rgba(220,255,120,${Math.min(1, dark * 1.8).toFixed(2)})`); R(g, Math.round(x) - 1, Math.round(y), 3, 1, `rgba(220,255,120,${(dark * 0.4).toFixed(2)})`); } }
  }
  if (amb === 'meadow' && dark < 0.2) {
    for (let i = 0; i < 3; i++) { const x = wrap(i * 90 + t * 14 - scroll * 0.3, VW + 40) - 20, y = 18 + i * 9 + Math.sin(t * 2 + i) * 3, f = Math.floor(t * 6 + i) % 2; R(g, Math.round(x) - 2, Math.round(y) - f, 2, 1, '#2a2a34'); R(g, Math.round(x), Math.round(y), 1, 1, '#2a2a34'); R(g, Math.round(x) + 1, Math.round(y) - f, 2, 1, '#2a2a34'); }
    for (let i = 0; i < 3; i++) { const x = wrap(i * 77 + Math.sin(t * 0.8 + i) * 20 - scroll * 0.8, VW), y = 86 + Math.sin(t * 3 + i * 2) * 4, f = Math.floor(t * 8 + i) % 2; R(g, Math.round(x), Math.round(y), f ? 1 : 2, 2, ['#f0f0f0', '#f7e04a', '#e86a8a'][i]); }
  }
  if (amb === 'forest') for (let i = 0; i < 10; i++) { const x = wrap(i * 53 + t * 6 + Math.sin(t + i) * 10 - scroll * 0.9, VW), y = wrap(i * 29 + t * (10 + i % 4 * 3), 110); R(g, Math.round(x), Math.round(y), 2, 1, ['#c86a2a', '#d89a3a', '#6aa84f'][i % 3]); }
  if (amb === 'snow') for (let i = 0; i < 40; i++) { const sx = wrap(i * 53 + t * (8 + (i % 5) * 3) + Math.sin(t + i) * 4 - scroll * 0.3, VW), sy = wrap(i * 37 + t * (14 + (i % 4) * 4), 112); R(g, Math.round(sx), Math.round(sy), i % 7 ? 1 : 2, i % 7 ? 1 : 2, '#ffffff'); }
  if (amb === 'wind') {
    for (let i = 0; i < 9; i++) { const wx = wrap(i * 71 - t * 120 - scroll * 0.4, VW + 40) - 20, wy = 12 + (i * 23) % 84; R(g, Math.round(wx), wy, 10 + (i % 3) * 4, 1, 'rgba(255,255,255,0.5)'); }
    if (dark < 0.3) { const x = wrap(t * 9 - scroll * 0.1, VW + 120) - 60, y = 26 + Math.sin(t * 0.8) * 6, f = Math.floor(t * 3) % 2; R(g, Math.round(x) - 6, Math.round(y) - f * 2, 5, 1, 'rgba(40,40,60,0.55)'); R(g, Math.round(x) - 1, Math.round(y), 4, 2, 'rgba(40,40,60,0.55)'); R(g, Math.round(x) + 3, Math.round(y) - f * 2, 5, 1, 'rgba(40,40,60,0.55)'); }
  }
  if (amb === 'sand' && dark < 0.4) for (let i = 0; i < 7; i++) { const x = wrap(i * 61 - t * 40 - scroll * 1.1, VW + 30) - 15, y = 96 + (i * 7) % 26; R(g, Math.round(x), y, 6 + i % 4, 1, 'rgba(240,210,150,0.55)'); }
  if (amb === 'mountain' && dark > 0.35) for (let i = 0; i < 3; i++) { const x = wrap(i * 80 + t * 30 + Math.sin(t * 3 + i) * 10, VW + 40) - 20, y = 20 + i * 12 + Math.sin(t * 4 + i) * 6, f = Math.floor(t * 10 + i) % 2; R(g, Math.round(x) - 2, Math.round(y) + f, 2, 1, '#1a1420'); R(g, Math.round(x), Math.round(y), 1, 2, '#1a1420'); R(g, Math.round(x) + 1, Math.round(y) + f, 2, 1, '#1a1420'); }
  if (amb === 'dust') for (let i = 0; i < 14; i++) { const x = wrap(i * 37 + Math.sin(t * 0.4 + i) * 8 - scroll * 0.5, VW), y = 20 + wrap(i * 23 - t * 3, 80); R(g, Math.round(x), Math.round(y), 1, 1, 'rgba(255,230,180,0.35)'); }
  if (amb === 'town') {
    for (let i = 0; i < 3; i++) { const k = wrap(t * 0.25 + i * 0.33, 1); R(g, 159 - i * 40 + Math.round(Math.sin(t + i) * 2), Math.round(46 - k * 30), 2, 2, `rgba(200,200,210,${(0.5 * (1 - k)).toFixed(2)})`); }
  }
}
// 예전 호출과의 호환 (첫 화면 등)
function drawBg(ctx, id, scroll, t) { const T = drawSky(ctx, id, scroll, t, clockDp()); drawLand(ctx, id, scroll, t, T); }
