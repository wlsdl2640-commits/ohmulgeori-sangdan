/* ───────── 하늘빛과 하루의 흐름 (풍경은 arena.js) ───────── */
const VW = 240;   // 무대 가로 (논리 픽셀)

/* 색 섞기 */
const hex2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgbHex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, k) => { const A = hex2(a), B = hex2(b); return rgbHex(A.map((v, i) => v + (B[i] - v) * k)); };
const rgba = (h, a) => { const c = hex2(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };

/* 낮 하늘 (필드별): 위 · 가운데 · 지평선 */
const DAY_SKY = {
  plains:   ['#4f8fd6', '#86b8e6', '#d2e8f0'],
  forest:   ['#3f7a86', '#6a9e9a', '#b4d2bc'],
  primeval: ['#2e5a5a', '#4a7a70', '#8ab098'],
  mountain: ['#5a6aa8', '#8f9cc8', '#d6d6e2'],
  valley:   ['#3f8fdc', '#74b4e8', '#c8e4f2'],
  snow:     ['#6a8ccc', '#a2bce0', '#e6eef6'],
  desert:   ['#4f92d8', '#a4c6e2', '#f6e2ba'],
  town:     ['#5684c4', '#8cb0d8', '#d0e0ea']
};
/* 하루의 흐름. dp 0 = 새벽 4시, dp 1 = 다음 날 새벽 4시 (1시간 = 1/24) */
const TOD = [
  { at: 0.0,  sky: ['#121a3e', '#33305e', '#9a6680'], dark: ['#1a1440', 0.42], star: 0.6 },   // 04:00 어스름
  { at: 0.09, sky: ['#3a5a9a', '#c48aa2', '#f6c08a'], dark: ['#3a2050', 0.14], star: 0 },     // 06:10 해돋이
  { at: 0.18, sky: null, dark: ['#000000', 0], star: 0 },                                      // 08:20 낮
  { at: 0.46, sky: null, dark: ['#40200c', 0.04], star: 0 },                                   // 15:00
  { at: 0.6,  sky: ['#38397a', '#d8704a', '#f8b060'], dark: ['#5a2010', 0.2], star: 0 },       // 18:20 노을
  { at: 0.7,  sky: ['#141a40', '#38285a', '#74466a'], dark: ['#140c30', 0.42], star: 0.55 },   // 20:50 땅거미
  { at: 0.82, sky: ['#05081a', '#0c1430', '#1c2c4c'], dark: ['#04081a', 0.58], star: 1 },      // 23:40 깊은 밤
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
  if (dp > 0.06 && dp < 0.66) { const u = (dp - 0.06) / 0.6; sun = { x: 12 + u * 216, y: 96 - Math.sin(Math.PI * u) * 76, u }; }
  const dm = dp < 0.15 ? dp + 1 : dp;
  if (dm > 0.64 && dm < 1.1) { const u = (dm - 0.64) / 0.46; moon = { x: 12 + u * 216, y: 92 - Math.sin(Math.PI * u) * 70 }; }
  return { sky, dark, star, sun, moon };
}
const clockDp = () => (S ? (((S.t % DAY_SEC) + DAY_SEC) % DAY_SEC) / DAY_SEC : 0.6);

/* 작은 그리기 도구 */
function disc(g, cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); R(g, Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1, c); } }
function ell(g, cx, cy, rx, ry, c) { for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); R(g, cx - w, cy + y, w * 2 + 1, 1, c); } }
function stars(seed, n) { const r = rng(seed), out = []; for (let i = 0; i < n; i++) out.push({ x: Math.floor(r() * VW), y: Math.floor(r() * 70), p: r() * 6, b: r() }); return out; }
const STARS = stars(99, 60);
