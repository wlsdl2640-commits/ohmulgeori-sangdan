/* ───────── 전투 무대: 길이 화면 안쪽으로 뻗는 원근 배경 ─────────
   적은 가운데 줄, 파티는 아래 줄. 배경은 캐릭터와 같은 두 배 해상도로 그려 한 번 굽는다. */
const AW = 240, AH = 200, AHZ = 74, ROW_E = 128, ROW_P = 184;      // 논리 좌표
const AR = { W: AW * HI, H: AH * HI, HZ: AHZ * HI, VX: AW };        // 고해상도 좌표 (VX = 가운데)
const ACAM = (AR.H - AR.HZ) / 120;                                    // 카메라 높이 (세상 단위)
// 세상 좌표 (X 옆, Y 높이, z 깊이 1 = 맨 앞) → 화면
const ap = (X, Y, z) => [AR.VX + X * 120 / z, AR.HZ + (ACAM - Y) * 120 / z];

class Pix {
  constructor(w, h) { this.w = w; this.h = h; this.img = new ImageData(w, h); this.d = new Uint32Array(this.img.data.buffer); }
  static c(hex) { const [r, g, b] = pxRgb(hex); return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0; }
  set(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.d[y * this.w + x] = c; }
  rect(x, y, w, h, c) { const x0 = Math.max(0, Math.round(x)), y0 = Math.max(0, Math.round(y)), x1 = Math.min(this.w, Math.round(x + w)), y1 = Math.min(this.h, Math.round(y + h)); for (let j = y0; j < y1; j++) this.d.fill(c, j * this.w + x0, j * this.w + Math.max(x0, x1)); }
  // 다각형 채우기. dk = 0~1 이면 바둑판 무늬로 그만큼만 (반투명 대신)
  poly(pts, c, dk) {
    let y0 = 1e9, y1 = -1e9;
    for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    y0 = Math.max(0, Math.floor(y0)); y1 = Math.min(this.h - 1, Math.ceil(y1));
    for (let y = y0; y <= y1; y++) {
      const xs = [], py = y + 0.5;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > py) !== (yj > py)) xs.push(xi + (py - yi) / (yj - yi) * (xj - xi)); }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const a = Math.max(0, Math.round(xs[k])), b = Math.min(this.w, Math.round(xs[k + 1]));
        if (dk == null) { if (b > a) this.d.fill(c, y * this.w + a, y * this.w + b); }
        else for (let x = a; x < b; x++) if (BAYER[(y & 3) * 4 + (x & 3)] < dk * 16) this.d[y * this.w + x] = c;
      }
    }
  }
  ell(cx, cy, rx, ry, c, dk) { const pts = []; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } this.poly(pts, c, dk); }
  // 세로 그라데이션 (점 무늬로 섞는다)
  vgrad(x, y, w, h, cols) {
    const C = cols.map(Pix.c), n = C.length - 1;
    for (let j = 0; j < h; j++) {
      const t = j / Math.max(1, h - 1) * n, i = Math.min(n - 1, Math.floor(t)), f = t - i, yy = Math.round(y + j);
      if (yy < 0 || yy >= this.h) continue;
      for (let xx = Math.max(0, Math.round(x)); xx < Math.min(this.w, Math.round(x + w)); xx++) this.d[yy * this.w + xx] = BAYER[(yy & 3) * 4 + (xx & 3)] < f * 16 ? C[i + 1] : C[i];
    }
  }
  canvas() { const [cv, x] = mkCanvas(this.w, this.h); x.putImageData(this.img, 0, 0); return cv; }
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/* ── 소품 (s = 세상 1단위가 몇 픽셀인지) ── */
function pTree(P, x, y, s, pal) {   // pal: [줄기, 줄기 밝음, 잎 어둠, 잎, 잎 밝음]
  const [t0, t1, l0, l1, l2] = pal.map(Pix.c);
  P.poly([[x - s * 0.13, y], [x + s * 0.13, y], [x + s * 0.09, y - s * 1.3], [x - s * 0.09, y - s * 1.3]], t0);
  P.poly([[x - s * 0.05, y - s * 0.05], [x + s * 0.06, y - s * 0.05], [x + s * 0.02, y - s * 1.2], [x - s * 0.04, y - s * 1.2]], t1);
  P.poly([[x - s * 0.24, y], [x - s * 0.1, y - s * 0.18], [x + s * 0.1, y - s * 0.18], [x + s * 0.26, y]], t0);
  const cy = y - s * 1.7;
  [[0, 0, 0.8, 0.62], [-0.45, 0.22, 0.52, 0.42], [0.46, 0.18, 0.5, 0.42], [0, -0.38, 0.54, 0.4]].forEach(([dx, dy, rx, ry]) => P.ell(x + dx * s, cy + dy * s, rx * s, ry * s, l0));
  [[-0.08, -0.06, 0.66, 0.5], [-0.46, 0.16, 0.4, 0.32], [0.38, 0.1, 0.38, 0.32], [-0.05, -0.42, 0.42, 0.3]].forEach(([dx, dy, rx, ry]) => P.ell(x + dx * s, cy + dy * s, rx * s, ry * s, l1));
  [[-0.24, -0.26, 0.34, 0.24], [-0.56, 0.04, 0.18, 0.14], [0.2, -0.5, 0.2, 0.14]].forEach(([dx, dy, rx, ry]) => P.ell(x + dx * s, cy + dy * s, rx * s, ry * s, l2));
}
function pPine(P, x, y, s, pal, snow) {
  const [t0, l0, l1, sn] = pal.map(Pix.c);
  P.rect(x - s * 0.07, y - s * 0.4, s * 0.14, s * 0.4, t0);
  for (let i = 0; i < 4; i++) {
    const by = y - s * (0.3 + i * 0.45), w = s * (0.62 - i * 0.12);
    P.poly([[x - w, by], [x + w, by], [x, by - s * 0.75]], l0);
    P.poly([[x - w * 0.9, by - 1], [x + w * 0.1, by - 1], [x - w * 0.05, by - s * 0.7]], l1);
    if (snow) P.poly([[x - w * 0.55, by - s * 0.32], [x + w * 0.55, by - s * 0.32], [x, by - s * 0.72]], sn);
  }
}
function pRock(P, x, y, s, pal) {
  const [r0, r1, r2] = pal.map(Pix.c);
  P.poly([[x - s * 0.5, y], [x - s * 0.42, y - s * 0.34], [x - s * 0.1, y - s * 0.52], [x + s * 0.32, y - s * 0.4], [x + s * 0.52, y]], r0);
  P.poly([[x - s * 0.42, y - s * 0.06], [x - s * 0.36, y - s * 0.32], [x - s * 0.08, y - s * 0.48], [x + s * 0.16, y - s * 0.38], [x - s * 0.02, y - s * 0.2], [x - s * 0.2, y - s * 0.04]], r1);
  P.poly([[x - s * 0.3, y - s * 0.32], [x - s * 0.08, y - s * 0.46], [x + s * 0.05, y - s * 0.4], [x - s * 0.12, y - s * 0.3]], r2);
}
function pBush(P, x, y, s, pal) { const [a, b, c] = pal.map(Pix.c); P.ell(x, y - s * 0.18, s * 0.42, s * 0.22, a); P.ell(x - s * 0.08, y - s * 0.24, s * 0.3, s * 0.16, b); P.ell(x - s * 0.16, y - s * 0.3, s * 0.14, s * 0.08, c); }
function pTuft(P, x, y, s, c) { const C = Pix.c(c); for (const dx of [-1, 0, 1]) P.rect(x + dx * s * 0.06, y - s * (0.16 - Math.abs(dx) * 0.06), Math.max(1, s * 0.03), s * (0.16 - Math.abs(dx) * 0.06), C); }
// 땅: 지평선 쪽은 흐리게, 앞쪽은 진하게. 길은 가운데로 모인다
function pGround(P, cols, road, roadW = 1) {
  P.vgrad(0, AR.HZ, AR.W, AR.H - AR.HZ, cols);
  if (!road) return;
  const [rc, re, rl] = road.map(Pix.c);
  for (let y = AR.HZ + 1; y < AR.H; y++) {
    const z = (ACAM * 120) / (y - AR.HZ), half = roadW * 120 / z, x0 = AR.VX - half, x1 = AR.VX + half;
    P.rect(x0, y, x1 - x0, 1, rc);
    P.rect(x0, y, Math.max(1, half * 0.08), 1, re); P.rect(x1 - Math.max(1, half * 0.08), y, Math.max(1, half * 0.08), 1, re);
    if (Math.floor(z * 3) % 2 === 0 && half > 6) P.rect(AR.VX - half * 0.35, y, Math.max(1, half * 0.08), 1, rl), P.rect(AR.VX + half * 0.28, y, Math.max(1, half * 0.06), 1, rl);
  }
}
function pRidge(P, y, amp, f, seed, c, top) {
  const C = Pix.c(c), T = top ? Pix.c(top) : 0;
  for (let x = 0; x < AR.W; x++) { const h = Math.round(y - Math.abs(Math.sin((x + seed) * f)) * amp - Math.sin((x + seed * 2) * f * 2.3) * amp * 0.3); P.rect(x, h, 1, AR.HZ + 2 - h, C); if (T) P.rect(x, h, 1, 2, T); }
}
function pPeaks(P, base, n, minH, maxH, seed, c, cap, shadow) {
  const r = rng(seed), C = Pix.c(c), S0 = Pix.c(shadow || shade(c, -0.25)), K = cap ? Pix.c(cap) : 0;
  for (let i = 0; i < n; i++) {
    const cx = r() * AR.W, h = minH + r() * (maxH - minH), w = h * (0.9 + r() * 0.6);
    P.poly([[cx - w, base], [cx, base - h], [cx + w, base]], C);
    P.poly([[cx, base - h], [cx + w, base], [cx + w * 0.35, base]], S0);
    if (K) P.poly([[cx - h * 0.28, base - h * 0.7], [cx, base - h], [cx + h * 0.3, base - h * 0.68], [cx + h * 0.08, base - h * 0.74], [cx - h * 0.1, base - h * 0.66]], K);
  }
}
// 원근으로 줄지어 선 소품 (양쪽)
function rowProps(P, Xs, zs, fn) { for (const z of zs) for (const X of Xs) { const [x, y] = ap(X, 0, z); fn(x, y, 120 / z, X, z); } }
const fieldRng = seed => rng(seed * 7717 + 3);

/* ── 장면 ── */
const ASCENE = {
  plains(P) {
    pRidge(P, AR.HZ - 6, 14, 0.012, 40, '#8fb4c4'); pRidge(P, AR.HZ + 2, 10, 0.02, 9, '#79a46a', '#8ab874');
    for (let i = 0; i < 9; i++) { const x = 14 + i * 53 + (i % 3) * 9, r = 7 + (i % 3) * 3; P.ell(x, AR.HZ - r * 0.6, r * 1.3, r, Pix.c('#5f8a5a')); P.ell(x - 2, AR.HZ - r * 0.9, r * 0.8, r * 0.6, Pix.c('#6e9a64')); }
    pGround(P, ['#9cc46a', '#7cae4a', '#5f9a3a', '#4f8a34'], ['#c8a070', '#a07c50', '#d8b484']);
    // 밀밭
    for (const s of [-1, 1]) for (let k = 0; k < 8; k++) { const z0 = 1.6 + k * 0.9, z1 = z0 + 0.45, a = ap(s * 1.5, 0, z0), b = ap(s * 7, 0, z0), c = ap(s * 7, 0, z1), d = ap(s * 1.5, 0, z1); P.poly([a, b, c, d], Pix.c(k % 2 ? '#d8b860' : '#c8a850')); }
    rowProps(P, [-1.15, 1.15], [1.15, 1.5, 2, 2.8, 4, 6, 9], (x, y, s) => { P.rect(x - s * 0.04, y - s * 0.42, s * 0.08, s * 0.42, Pix.c('#7a5634')); P.rect(x - s * 0.04, y - s * 0.38, s * 0.03, s * 0.36, Pix.c('#9a7448')); });
    for (const s of [-1, 1]) for (const yy of [0.3, 0.2]) { const a = ap(s * 1.15, yy, 1.15), b = ap(s * 1.15, yy, 9); P.poly([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] + 1], [a[0], a[1] + Math.max(1, 120 / 1.15 * 0.04)]], Pix.c('#8a6440')); }
    const [tx, ty] = ap(-3.4, 0, 1.4); pTree(P, tx, ty, 120 / 1.4, ['#5a3e28', '#7a5a3a', '#3f7a34', '#5a9a40', '#86c05a']);
    const [ux, uy] = ap(3.8, 0, 2.6); pTree(P, ux, uy, 120 / 2.6, ['#5a3e28', '#7a5a3a', '#3f7a34', '#5a9a40', '#86c05a']);
    const r = fieldRng(1); for (let i = 0; i < 70; i++) { const X = (r() < 0.5 ? -1 : 1) * (1.2 + r() * 2.2), z = 1 + r() * 5, [x, y] = ap(X, 0, z); if (r() < 0.25) P.rect(x, y - 1, 2, 2, Pix.c(['#f0e070', '#f08aa0', '#ffffff'][i % 3])); else pTuft(P, x, y, 120 / z, '#3f7a2e'); }
  },
  forest(P) {
    for (let i = 0; i < 26; i++) { const x = (i * 37) % AR.W, w = 4 + (i % 3) * 3; P.rect(x, AR.HZ - 70, w, 72, Pix.c(i % 2 ? '#8ab0a0' : '#9cc0b0')); }
    pGround(P, ['#6a9a6a', '#4f7f3a', '#3e6a30', '#355e2a'], ['#8a6440', '#6e4e32', '#a07a50']);
    rowProps(P, [-1.3, 1.3], [1.2, 1.6, 2.2, 3, 4.4, 7], (x, y, s, X) => { pBush(P, x + Math.sign(X) * s * 0.25, y, s * 1.1, ['#2f5a2a', '#3f7a34', '#5a9a40']); });
    const trunk = (X, z, w) => { const s = 120 / z, [x, y] = ap(X, 0, z), t0 = Pix.c('#4a3424'), t1 = Pix.c('#6a4a30'), t2 = Pix.c('#8a6a44'); P.poly([[x - w * s, y], [x + w * s, y], [x + w * s * 0.7, -10], [x - w * s * 0.7, -10]], t0); P.poly([[x - w * s * 0.55, y - 2], [x + w * s * 0.1, y - 2], [x + w * s * 0.05, -10], [x - w * s * 0.45, -10]], t1); P.rect(x - w * s * 0.42, 0, Math.max(1, w * s * 0.14), y - 4, t2); P.poly([[x - w * s * 1.8, y], [x - w * s, y - s * 0.3], [x - w * s * 0.6, y]], t0); P.poly([[x + w * s * 1.7, y], [x + w * s, y - s * 0.3], [x + w * s * 0.6, y]], t0); };
    [[-2.6, 6, 0.16], [2.4, 5, 0.16], [-2.2, 3.2, 0.2], [2.6, 2.6, 0.22], [-2.4, 1.6, 0.26], [2.9, 1.3, 0.3]].forEach(([X, z, w]) => trunk(X, z, w));
    const L = [Pix.c('#1f3a24'), Pix.c('#2f5a2e'), Pix.c('#3f7a38')];
    for (let i = 0; i < 18; i++) { const x = (i * 53) % (AR.W + 60) - 30, y = 10 + (i % 4) * 14; P.ell(x, y, 46, 30, L[0]); P.ell(x - 6, y - 6, 34, 20, L[1]); P.ell(x - 12, y - 10, 16, 9, L[2]); }
    const r = fieldRng(2); for (let i = 0; i < 40; i++) { const X = (r() < 0.5 ? -1 : 1) * r() * 0.8, z = 1.2 + r() * 6, [x, y] = ap(X, 0, z); P.ell(x, y, 120 / z * 0.06, 120 / z * 0.03, Pix.c(i % 2 ? '#7a8a6a' : '#6a7a5a')); }
  },
  mountain(P) {
    pPeaks(P, AR.HZ + 2, 9, 44, 100, 17, '#6a6c8c', '#eef0f8', '#50506a');
    pRidge(P, AR.HZ + 3, 14, 0.018, 33, '#5a6a62', '#6a7a6e');
    pGround(P, ['#9a9284', '#8a8274', '#7a7264', '#6e6658'], ['#b0a894', '#8e8674', '#c0b8a4'], 0.9);
    for (const s of [-1, 1]) {
      const e = s < 0 ? 0 : AR.W, rim = [ap(s * 1.3, 0, 1), ap(s * 1.3, 0, 8), ap(s * 2.6, 1.6, 8), ap(s * 3.2, 2.4, 4), ap(s * 3.6, 3.4, 2), ap(s * 4, 4.6, 1)];
      P.poly([[e, AR.H], ...rim, [e, 0]], Pix.c('#6e6878'));
      P.poly([[e, AR.H], rim[0], rim[1], ap(s * 1.9, 0.6, 8), ap(s * 2.2, 0.9, 3), ap(s * 2.4, 1.3, 1)], Pix.c('#7c7686'));
      for (let k = 0; k < 6; k++) { const z = 1.3 + k * 1.1, a = ap(s * (1.7 + k * 0.1), 0.4 + k * 0.12, z), b = ap(s * (2.5 + k * 0.08), 0.9 + k * 0.14, z * 1.12); P.poly([a, b, [b[0], b[1] + 2], [a[0], a[1] + 3]], Pix.c('#625c6c')); }
      rowProps(P, [s * 2.3, s * 3.1], [1.6, 2.6, 4.2], (x, y, sz) => pPine(P, x, y, sz * 0.9, ['#3a2e26', '#2e4a3e', '#3e5e4e', '#e8eef6'], 0));
    }
    rowProps(P, [-1.2, 1.25], [1.3, 2.1, 3.6, 6], (x, y, s) => pRock(P, x, y, s * 0.55, ['#5e5868', '#7e788a', '#a09aaa']));
  },
  valley(P) {
    for (let i = 0; i < 6; i++) { const x = 20 + i * 86, w = 36 + (i % 3) * 20, h = 26 + (i % 2) * 20; P.rect(x, AR.HZ - h, w, h + 2, Pix.c('#d8a07a')); P.rect(x, AR.HZ - h, w, 3, Pix.c('#e8bc98')); P.rect(x + w * 0.6, AR.HZ - h, w * 0.4, h + 2, Pix.c('#c48a62')); }
    pGround(P, ['#dcb48c', '#cca474', '#bc9262', '#ac8252'], ['#e4c49c', '#bc986e', '#eed4ac']);
    for (const s of [-1, 1]) {
      const e = s < 0 ? 0 : AR.W, Hc = 2.2, a = ap(s * 1.7, 0, 1), b = ap(s * 1.7, 0, 8), c = ap(s * 1.7, Hc, 8), d = ap(s * 1.7, Hc, 1);
      P.poly([[e, AR.H], a, b, c, d, [e, d[1]]], Pix.c('#c07850'));
      const bands = ['#c88052', '#bc7248', '#cc8a5c'];
      for (let k = 0; k < 3; k++) { const y0 = 0.35 + k * 0.62, p1 = ap(s * 1.7, y0, 1), p2 = ap(s * 1.7, y0, 8), p3 = ap(s * 1.7, y0 + 0.3, 8), p4 = ap(s * 1.7, y0 + 0.3, 1); P.poly([p1, p2, p3, p4], Pix.c(bands[k])); }
      const t1 = ap(s * 1.7, Hc, 1), t2 = ap(s * 1.7, Hc, 8), t3 = ap(s * 2.3, Hc + 0.05, 8), t4 = ap(s * 2.6, Hc + 0.05, 1);
      P.poly([t1, t2, t3, t4, [e, t4[1]], [e, t1[1]]], Pix.c('#d89a6a'));
      P.poly([t1, t2, [t2[0], t2[1] + 2], [t1[0], t1[1] + 3]], Pix.c('#e8b488'));
    }
    rowProps(P, [-1.35, 1.4], [1.4, 2.6, 4.6], (x, y, s) => pRock(P, x, y, s * 0.5, ['#9a5a3a', '#b87a50', '#d89a6a']));
  },
  snow(P) {
    pPeaks(P, AR.HZ + 2, 8, 50, 100, 23, '#c8d6ea', '#ffffff', '#a8bcd8');
    pGround(P, ['#f4f8fc', '#e8eef6', '#dce6f0', '#d0dcea'], ['#c8d4e2', '#aebccc', '#dae4ee']);
    rowProps(P, [-1.7, -2.6, 1.8, 2.8], [1.3, 1.9, 2.8, 4.2, 6.5], (x, y, s) => pPine(P, x, y, s * 1.1, ['#4a3a2a', '#2e5a4a', '#3f7a64', '#f4f8ff'], 1));
    const r = fieldRng(5); for (let i = 0; i < 40; i++) { const X = (r() - 0.5) * 0.9, z = 1.1 + r() * 6, [x, y] = ap(X, 0, z); P.rect(x, y, Math.max(1, 120 / z * 0.05), 1, Pix.c('#b0c0d4')); }
  },
  desert(P) {
    P.poly([[300, AR.HZ + 2], [352, AR.HZ - 44], [404, AR.HZ + 2]], Pix.c('#d8b070')); P.poly([[352, AR.HZ - 44], [404, AR.HZ + 2], [366, AR.HZ + 2]], Pix.c('#c09a5a'));
    pRidge(P, AR.HZ + 2, 12, 0.014, 70, '#ecc888', '#f4dca8');
    pGround(P, ['#f0d498', '#e8c47c', '#dcb46a', '#d0a85e'], ['#d8b070', '#c09a5a', '#e4c080'], 0.9);
    for (const s of [-1, 1]) P.ell(s < 0 ? 40 : 440, AR.H - 70, 150, 60, Pix.c('#e0b468')), P.ell(s < 0 ? 30 : 450, AR.H - 82, 120, 34, Pix.c('#ecc880'));
    const [px, py] = ap(-2.6, 0, 1.8), s = 120 / 1.8, tr = Pix.c('#8a6a44'); for (let i = 0; i < 12; i++) P.rect(px - s * 0.05 + i * s * 0.012, py - i * s * 0.12, s * 0.1, s * 0.13, i % 2 ? tr : Pix.c('#a8845a'));
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; P.poly([[px + s * 0.08, py - s * 1.45], [px + s * 0.08 + Math.cos(a) * s * 0.7, py - s * 1.35 + Math.abs(Math.sin(a)) * s * 0.3], [px + s * 0.08 + Math.cos(a) * s * 0.6, py - s * 1.28 + Math.abs(Math.sin(a)) * s * 0.42]], Pix.c(k % 2 ? '#4f8a3c' : '#3f7a34')); }
    const [cx2, cy2] = ap(2.4, 0, 2.2), s2 = 120 / 2.2; P.rect(cx2 - s2 * 0.2, cy2 - s2 * 1.1, s2 * 0.4, s2 * 1.1, Pix.c('#d8c098')); P.rect(cx2 - s2 * 0.2, cy2 - s2 * 1.1, s2 * 0.12, s2 * 1.1, Pix.c('#ecd8b4')); P.rect(cx2 - s2 * 0.28, cy2 - s2 * 1.2, s2 * 0.56, s2 * 0.12, Pix.c('#c8ac80'));
    const r = fieldRng(6); for (let i = 0; i < 30; i++) { const X = (r() - 0.5) * 4, z = 1.1 + r() * 6, [x, y] = ap(X, 0, z); P.rect(x - 120 / z * 0.15, y, 120 / z * 0.3, 1, Pix.c('#c8a060')); }
  }
};
// 던전: 양쪽 벽과 바닥 타일이 안쪽 문으로 모이는 복도
const DUN = {
  cellar:    { wall: ['#6a4a30', '#7a5838', '#55391f'], floor: ['#5e4a32', '#503e2a'], ceil: '#1a120c', wk: 'plank', fk: 'plank', ck: 'beam', prop: 'hay', light: '#f0b050' },
  cave:      { wall: ['#55493f', '#64574b', '#463b33'], floor: ['#423d33', '#38342c'], ceil: '#16120f', wk: 'rock', fk: 'rock', ck: 'drip', prop: 'roots', light: '#9ae08a' },
  mine:      { wall: ['#57525e', '#67626e', '#46424c'], floor: ['#4e4a54', '#444049'], ceil: '#131117', wk: 'rock', fk: 'rail', ck: 'beam', prop: 'cart', light: '#f0b050' },
  nest:      { wall: ['#6e6474', '#7e7484', '#58505e'], floor: ['#7a6a52', '#6c5c46'], ceil: '#241f2a', wk: 'rock', fk: 'rock', ck: 'drip', prop: 'twigs', light: '#f0c070' },
  icetemple: { wall: ['#8eb4d4', '#a4c8e4', '#7498bc'], floor: ['#a2c6e0', '#8eb4d2'], ceil: '#1c2c46', wk: 'block', fk: 'tile', ck: 'arch', prop: 'pillars', light: '#bfe8ff' },
  tomb:      { wall: ['#bc965e', '#cca670', '#a07c48'], floor: ['#ac8852', '#9c7a46'], ceil: '#2a1e12', wk: 'block', fk: 'tile', ck: 'flat', prop: 'gold', light: '#f0b050' },
  alley:     { wall: ['#74403a', '#844c44', '#5e3430'], floor: ['#4e4e56', '#44444c'], ceil: '#0e0c14', wk: 'brick', fk: 'tile', ck: 'open', prop: 'barrels', light: '#f0a040' }
};
// 원근 선: 세상 두 점 사이를 화면 두께 th(세상 단위)로
function pLine(P, a, b, th, c) { const sa = 120 / a[2] * th, sb = 120 / b[2] * th, A = ap(a[0], a[1], a[2]), B = ap(b[0], b[1], b[2]); const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L; P.poly([[A[0] + nx * sa / 2, A[1] + ny * sa / 2], [B[0] + nx * sb / 2, B[1] + ny * sb / 2], [B[0] - nx * sb / 2, B[1] - ny * sb / 2], [A[0] - nx * sa / 2, A[1] - ny * sa / 2]], c); }
// 던전: 양쪽 벽과 바닥이 안쪽 문으로 모이는 복도. 무늬는 바탕색과 가깝게 (난잡하지 않게)
function dungeonScene(P, D) {
  const W0 = Pix.c(D.wall[0]), Wl = Pix.c(D.wall[1]), Wd = Pix.c(D.wall[2]), F0 = Pix.c(D.floor[0]), F1 = Pix.c(D.floor[1]);
  const z0 = 0.55, z9 = 9, X = 1.4, Hc = 3.2, r = fieldRng(D.wall[0].length + D.wk.length);
  P.vgrad(0, 0, AR.W, AR.HZ, [D.ceil, D.ceil, mix(D.ceil, D.wall[2], 0.5)]);
  // 바닥
  P.poly([ap(-X, 0, z0), ap(X, 0, z0), ap(X, 0, z9), ap(-X, 0, z9)], F0);
  if (D.fk === 'plank') for (let k = -3; k <= 3; k++) pLine(P, [k * X / 3.5, 0, z0], [k * X / 3.5, 0, z9], 0.02, F1);
  else if (D.fk === 'tile') { for (let z = 1; z < z9; z += 0.7) pLine(P, [-X, 0, z], [X, 0, z], 0.018, F1); for (let k = -2; k <= 2; k++) pLine(P, [k * X / 2.5, 0, z0], [k * X / 2.5, 0, z9], 0.018, F1); }
  else if (D.fk === 'rail') { for (const k of [-0.32, 0.32]) pLine(P, [k, 0, z0], [k, 0, z9], 0.035, Pix.c('#8a8a92')); for (let z = 0.8; z < z9; z += 0.5) pLine(P, [-0.5, 0, z], [0.5, 0, z], 0.06, Pix.c('#5a4030')); }
  else for (let i = 0; i < 46; i++) { const Xr = (r() - 0.5) * 2 * X * 0.9, z = z0 + 0.4 + r() * 8, [x, y] = ap(Xr, 0, z), s = 120 / z; P.ell(x, y, s * 0.07, s * 0.025, F1); }
  // 벽
  for (const sd of [-1, 1]) {
    const e = sd < 0 ? 0 : AR.W, Xs = sd * X;
    P.poly([[e, AR.H], ap(Xs, 0, z0), ap(Xs, 0, z9), ap(Xs, Hc, z9), ap(Xs, Hc, z0), [e, 0]], W0);
    if (D.wk === 'plank') {
      for (let z = z0; z < z9; z += 0.42) pLine(P, [Xs, 0, z], [Xs, Hc, z], 0.022, Wd);
      for (let z = z0 + 0.1; z < z9; z += 1.26) pLine(P, [Xs, 0.05, z], [Xs, Hc, z], 0.012, Wl);
    } else if (D.wk === 'brick' || D.wk === 'block') {
      const h = D.wk === 'brick' ? 0.32 : 0.62, L = D.wk === 'brick' ? 0.7 : 1.3;
      for (let k = 0, Y = 0; Y < Hc; k++, Y += h) {
        pLine(P, [Xs, Y, z0], [Xs, Y, z9], 0.016, Wd);
        for (let z = z0 + (k % 2 ? L / 2 : 0); z < z9; z += L) pLine(P, [Xs, Y, z], [Xs, Math.min(Hc, Y + h), z], 0.016, Wd);
      }
    } else {
      const md = Pix.c(mix(D.wall[0], D.wall[2], 0.55)), ml = Pix.c(mix(D.wall[0], D.wall[1], 0.6));
      for (let i = 0; i < 70; i++) { const z = 1.2 + r() * 7.5, Y = 0.2 + r() * (Hc - 0.4), [x, y] = ap(Xs, Y, z), s = 120 / z; P.ell(x, y, s * (0.03 + r() * 0.04), s * (0.04 + r() * 0.05), r() < 0.55 ? md : ml); }
      for (let k = 0; k < 3; k++) { const Y = 0.7 + k * 0.9 + r() * 0.2; pLine(P, [Xs, Y, z0], [Xs, Y + 0.08, z9], 0.012, md); }
    }
    pLine(P, [Xs, 0.06, z0], [Xs, 0.06, z9], 0.12, Wd);              // 걸레받이
    for (let z = 1.6; z < z9; z += 2.2) {                               // 기둥
      const A = ap(Xs, 0, z), B = ap(Xs, Hc, z), w = 120 / z * 0.14;
      P.poly([[A[0] - w / 2, A[1]], [A[0] + w / 2, A[1]], [B[0] + w / 2, B[1]], [B[0] - w / 2, B[1]]], D.wk === 'plank' || D.ck === 'beam' ? Pix.c('#5e4028') : Wd);
      P.poly([[A[0] - w / 2, A[1]], [A[0] - w / 6, A[1]], [B[0] - w / 6, B[1]], [B[0] - w / 2, B[1]]], D.wk === 'plank' || D.ck === 'beam' ? Pix.c('#7a5634') : Wl);
    }
  }
  // 천장
  const cz = [ap(-X, Hc, z0), ap(X, Hc, z0), ap(X, Hc, z9), ap(-X, Hc, z9)];
  if (D.ck === 'beam') for (let z = 1.6; z < z9; z += 2.2) { const a = ap(-X, Hc, z), b = ap(X, Hc, z), w = 120 / z * 0.14; P.poly([[a[0], a[1] - w], [b[0], b[1] - w], [b[0], b[1] + w * 0.3], [a[0], a[1] + w * 0.3]], Pix.c('#5e4028')); P.poly([[a[0], a[1] + w * 0.1], [b[0], b[1] + w * 0.1], [b[0], b[1] + w * 0.3], [a[0], a[1] + w * 0.3]], Pix.c('#3e2a1a')); }
  else if (D.ck === 'drip') for (let i = 0; i < 22; i++) { const Xr = (r() - 0.5) * 2 * X, z = 1 + r() * 7, [x, y] = ap(Xr, Hc, z), s = 120 / z, h = s * (0.15 + r() * 0.3); P.poly([[x - s * 0.06, y - 2], [x + s * 0.06, y - 2], [x, y + h]], Wd); }
  else if (D.ck === 'arch') for (let z = 1.6; z < z9; z += 2.2) { const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; pts.push(ap(-Math.cos(a) * X, Hc - 0.5 + Math.sin(a) * 0.5, z)); } for (let i = 0; i < 12; i++) pLine(P, [-Math.cos(Math.PI * i / 12) * X, Hc - 0.5 + Math.sin(Math.PI * i / 12) * 0.5, z], [-Math.cos(Math.PI * (i + 1) / 12) * X, Hc - 0.5 + Math.sin(Math.PI * (i + 1) / 12) * 0.5, z], 0.1, Wl); }
  else if (D.ck === 'open') { P.vgrad(0, 0, AR.W, AR.HZ - 40, ['#05040c', '#0e0c1c', '#1a1830']); for (let i = 0; i < 30; i++) P.rect(r() * AR.W, r() * (AR.HZ - 60), 1, 1, Pix.c('#c8c8e0')); }
  void cz;
  // 안쪽 문
  const dt = ap(-0.5, 1.5, z9), db = ap(0.5, 0, z9);
  P.rect(dt[0] - 4, dt[1] - 4, db[0] - dt[0] + 8, db[1] - dt[1] + 4, Wd); P.rect(dt[0], dt[1], db[0] - dt[0], db[1] - dt[1], Pix.c('#050308'));
  // 소품: 벽 가까이, 파티 줄과 겹치지 않게 멀리
  const prop = D.prop;
  rowProps(P, [-1.22, 1.22], [2.9, 4.6], (x, y, s, Xs) => {
    if (prop === 'hay') { P.ell(x, y - s * 0.15, s * 0.3, s * 0.17, Pix.c('#b89038')); P.ell(x - s * 0.06, y - s * 0.21, s * 0.18, s * 0.09, Pix.c('#d8b450')); }
    else if (prop === 'barrels') { P.rect(x - s * 0.17, y - s * 0.44, s * 0.34, s * 0.44, Pix.c('#7a5232')); P.rect(x - s * 0.17, y - s * 0.37, s * 0.34, s * 0.035, Pix.c('#4a4a52')); P.rect(x - s * 0.17, y - s * 0.12, s * 0.34, s * 0.035, Pix.c('#4a4a52')); P.rect(x - s * 0.13, y - s * 0.44, s * 0.07, s * 0.44, Pix.c('#9a7048')); }
    else if (prop === 'pillars') { P.rect(x - s * 0.12, y - s * 3, s * 0.24, s * 3, Pix.c('#c8e4f4')); P.rect(x - s * 0.12, y - s * 3, s * 0.07, s * 3, Pix.c('#ffffff')); P.rect(x - s * 0.16, y - s * 0.12, s * 0.32, s * 0.12, Pix.c('#a8c8e0')); }
    else if (prop === 'gold') { P.rect(x - s * 0.2, y - s * 0.3, s * 0.4, s * 0.3, Pix.c('#8a6a40')); P.rect(x - s * 0.2, y - s * 0.3, s * 0.4, s * 0.05, Pix.c('#a8844e')); P.ell(x, y - s * 0.33, s * 0.15, s * 0.06, Pix.c('#f0c24a')); }
    else if (prop === 'roots') { P.ell(x, y - s * 0.05, s * 0.08, s * 0.05, Pix.c('#9ae08a')); P.ell(x + s * 0.12, y - s * 0.04, s * 0.06, s * 0.04, Pix.c('#c8f0b0')); }
    else if (prop === 'twigs') { P.ell(x, y - s * 0.1, s * 0.34, s * 0.11, Pix.c('#7a5634')); P.ell(x, y - s * 0.15, s * 0.11, s * 0.08, Pix.c('#f0e8d8')); }
    else if (prop === 'cart') { if (Xs > 0) { P.rect(x - s * 0.3, y - s * 0.36, s * 0.6, s * 0.28, Pix.c('#5a5660')); P.rect(x - s * 0.3, y - s * 0.36, s * 0.6, s * 0.05, Pix.c('#7a7680')); P.ell(x - s * 0.18, y - s * 0.06, s * 0.07, s * 0.07, Pix.c('#2a2830')); P.ell(x + s * 0.18, y - s * 0.06, s * 0.07, s * 0.07, Pix.c('#2a2830')); P.ell(x, y - s * 0.4, s * 0.22, s * 0.07, Pix.c('#6a6070')); } }
  });
  // 횃불 자리 (불꽃과 빛은 그릴 때)
  for (const z of [1.5, 3]) for (const sd of [-1, 1]) { const [x, y] = ap(sd * X, 1.2, z), s = 120 / z; P.rect(x - s * 0.02, y, s * 0.04, s * 0.2, Pix.c('#4a3424')); P.rect(x - s * 0.05, y - s * 0.02, s * 0.1, s * 0.04, Pix.c('#6a4a30')); }
}
function townScene2(P) {
  // 저 멀리 제도의 지붕들과 성
  const r = fieldRng(9), far = Pix.c('#8a94a8'), far2 = Pix.c('#7a8498');
  for (let x = -10; x < AR.W + 10;) { const w = 18 + r() * 22, h = 10 + r() * 16; P.rect(x, AR.HZ - h, w, h + 2, r() < 0.5 ? far : far2); P.poly([[x - 2, AR.HZ - h], [x + w / 2, AR.HZ - h - 9], [x + w + 2, AR.HZ - h]], far2); x += w + 2; }
  const cx = AR.VX; P.rect(cx - 34, AR.HZ - 52, 68, 52, Pix.c('#9aa2b4')); for (const dx of [-40, 28]) { P.rect(cx + dx, AR.HZ - 74, 12, 74, Pix.c('#a8b0c0')); P.poly([[cx + dx - 3, AR.HZ - 74], [cx + dx + 6, AR.HZ - 92], [cx + dx + 15, AR.HZ - 74]], Pix.c('#6a7a9a')); }
  P.rect(cx - 9, AR.HZ - 88, 18, 36, Pix.c('#b0b8c8')); P.poly([[cx - 12, AR.HZ - 88], [cx, AR.HZ - 110], [cx + 12, AR.HZ - 88]], Pix.c('#5a6a8e')); P.rect(cx - 1, AR.HZ - 116, 2, 8, Pix.c('#c8a040'));
  // 길: 돌바닥과 보도
  pGround(P, ['#8e867a', '#7e766a', '#6e665a', '#625a50'], null);
  P.poly([ap(-1.05, 0, 0.5), ap(1.05, 0, 0.5), ap(1.05, 0, 12), ap(-1.05, 0, 12)], Pix.c('#7a7468'));
  for (let z = 0.6; z < 12; z += 0.32) pLine(P, [-1.05, 0, z], [1.05, 0, z], 0.014, Pix.c('#6a645a'));
  for (let k = -3; k <= 3; k++) pLine(P, [k * 0.3, 0, 0.5], [k * 0.3, 0, 12], 0.012, Pix.c('#6e685e'));
  for (const sd of [-1, 1]) { P.poly([ap(sd * 1.05, 0, 0.5), ap(sd * 1.3, 0, 0.5), ap(sd * 1.3, 0, 12), ap(sd * 1.05, 0, 12)], Pix.c('#a49c8e')); pLine(P, [sd * 1.05, 0.01, 0.5], [sd * 1.05, 0.01, 12], 0.03, Pix.c('#5e584e')); }
  // 집: 회벽에 나무 뼈대, 기와 처마, 창의 불빛
  const PL = ['#d8c8a8', '#c8b494', '#e2d4b6', '#bfae90', '#a8a8b0'], RF = ['#8a3a2a', '#5a4a6a', '#7a4a2a', '#4a5a6a'];
  for (const sd of [-1, 1]) {
    let z = 0.55, i = sd < 0 ? 0 : 2;
    while (z < 11) {
      const L = 1.1 + (i % 3) * 0.35, z2 = z + L, h = 2.3 + ((i * 7) % 3) * 0.45, Xs = sd * 1.3, wall = Pix.c(PL[i % PL.length]), tim = Pix.c('#5a3a22'), stone = PL[i % PL.length] === '#a8a8b0';
      P.poly([ap(Xs, 0, z), ap(Xs, 0, z2), ap(Xs, h, z2), ap(Xs, h, z)], wall);
      if (!stone) { pLine(P, [Xs, 1.15, z], [Xs, 1.15, z2], 0.05, tim); pLine(P, [Xs, 0, z + 0.03], [Xs, h, z + 0.03], 0.06, tim); if (z > 1) { pLine(P, [Xs, 1.15, z + 0.03], [Xs, h, z + L / 2], 0.035, tim); pLine(P, [Xs, 1.15, z2 - 0.03], [Xs, h, z + L / 2], 0.035, tim); } }
      else for (let Y = 0.4; Y < h; Y += 0.4) pLine(P, [Xs, Y, z], [Xs, Y, z2], 0.012, Pix.c('#8e8e98'));
      P.poly([ap(Xs, 0, z), ap(Xs, 0, z2), ap(Xs, 0.14, z2), ap(Xs, 0.14, z)], Pix.c('#6a6258'));
      // 처마
      P.poly([ap(Xs, h, z - 0.05), ap(Xs, h, z2 + 0.05), ap(sd * 0.98, h + 0.55, z2 + 0.05), ap(sd * 0.98, h + 0.55, z - 0.05)], Pix.c(RF[i % RF.length]));
      pLine(P, [Xs, h, z - 0.05], [Xs, h, z2 + 0.05], 0.05, Pix.c('#2a1a14'));
      // 창과 문
      const wz = [z + L * 0.22, z + L * 0.62];
      for (const zz of wz) for (const wy of [1.45, 0.5]) {
        if (wy < 1 && zz === wz[0]) continue;
        const w1 = ap(Xs, wy, zz), w2 = ap(Xs, wy + 0.42, zz), w3 = ap(Xs, wy + 0.42, zz + 0.24), w4 = ap(Xs, wy, zz + 0.24);
        P.poly([w1, w2, w3, w4], Pix.c('#3a3446')); P.poly([w1, w2, [w2[0] - sd * 2, w2[1]], [w1[0] - sd * 2, w1[1]]], Pix.c('#7a5634'));
        pLine(P, [Xs, wy + 0.21, zz], [Xs, wy + 0.21, zz + 0.24], 0.015, Pix.c('#7a5634'));
        P.poly([ap(Xs, wy - 0.02, zz - 0.03), ap(Xs, wy - 0.02, zz + 0.27), ap(Xs, wy - 0.07, zz + 0.27), ap(Xs, wy - 0.07, zz - 0.03)], Pix.c('#6a4a30'));
      }
      const d1 = ap(Xs, 0, z + L * 0.2), d2 = ap(Xs, 0.85, z + L * 0.2), d3 = ap(Xs, 0.85, z + L * 0.36), d4 = ap(Xs, 0, z + L * 0.36); P.poly([d1, d2, d3, d4], Pix.c('#4a2c18')); P.poly([d1, d2, [d2[0] - sd * 1.5, d2[1]], [d1[0] - sd * 1.5, d1[1]]], Pix.c('#2a1a10'));
      if (i % 2 === 0) { const sg = ap(sd * 1.3, 1.25, z + L * 0.5), sg2 = ap(sd * 1.05, 1.25, z + L * 0.5), sz = 120 / (z + L * 0.5); P.poly([sg, sg2, [sg2[0], sg2[1] + 2]], Pix.c('#3a2a1a')); P.rect(Math.min(sg[0], sg2[0]) + (sd < 0 ? sz * 0.08 : 0), sg2[1] + 2, sz * 0.18, sz * 0.14, Pix.c(['#c8a040', '#a8432f', '#4a7ab8'][i % 3])); }
      z = z2 + 0.06; i++;
    }
    // 가로등
    for (const z of [1.32, 1.9]) { const a = ap(sd * 1.15, 0, z), b = ap(sd * 1.15, 1.35, z), s2 = 120 / z; P.rect(a[0] - s2 * 0.02, b[1], s2 * 0.04, a[1] - b[1], Pix.c('#2a2a34')); P.rect(b[0] - s2 * 0.06, b[1] - s2 * 0.12, s2 * 0.12, s2 * 0.12, Pix.c('#f0d080')); P.rect(b[0] - s2 * 0.07, b[1] - s2 * 0.14, s2 * 0.14, s2 * 0.03, Pix.c('#2a2a34')); }
  }
}
// 굽기: 장면 id → 캔버스 (배경 하늘은 투명)
const ASC = new Map();
function arenaBg(id) {
  let c = ASC.get(id);
  if (c) return c;
  const P = new Pix(AR.W, AR.H);
  if (ASCENE[id]) ASCENE[id](P); else if (DUN[id]) dungeonScene(P, DUN[id]); else if (id === 'town') townScene2(P); else ASCENE.plains(P);
  c = { cv: P.canvas(), under: !!DUN[id], town: id === 'town' };
  ASC.set(id, c);
  return c;
}
// 하늘: 시간대 색으로 계단처럼, 해·달·별·구름
function arenaSky(g, id, t, dp) {
  const T = todAt(dp, DAY_SKY[id] ? id : 'plains');
  for (let i = 0; i < 12; i++) { const k = i / 11, c = k < 0.5 ? mix(T.sky[0], T.sky[1], k * 2) : mix(T.sky[1], T.sky[2], (k - 0.5) * 2); R(g, 0, Math.floor(i * (AHZ + 4) / 12), AW, Math.ceil((AHZ + 4) / 12) + 1, c); }
  if (T.star > 0.05) for (const s of STARS) { if ((s.x * 7 + s.y) % 3 && T.star < 0.6) continue; R(g, s.x, Math.round(s.y * 0.55), 1, 1, rgba('#ffffff', (0.4 + 0.6 * T.star) * (0.6 + 0.4 * Math.sin(t * 2 + s.x)))); }
  const disc = (cx, cy, r, c) => { for (let j = -r; j <= r; j += 0.5) { const w = Math.sqrt(Math.max(0, r * r - j * j)); if (w > 0.2) R(g, Math.round((cx - w) * 2) / 2, cy + j, Math.round(w * 4) / 2, 0.5, c); } };
  const skyY = y0 => AHZ - (96 - y0) / 76 * (AHZ - 14);
  if (T.sun) { const x = T.sun.x, y = skyY(T.sun.y), low = 1 - Math.sin(Math.PI * T.sun.u), c = mix('#fff6c8', '#ffa050', low); disc(x, y, 9, rgba(c, 0.16)); disc(x, y, 6.5, rgba(c, 0.3)); disc(x, y, 4.5, c); disc(x - 1, y - 1, 2, '#fffbe8'); }
  if (T.moon) { const x = T.moon.x, y = skyY(T.moon.y), day = S ? (today() % MONTH_DAYS) : 15, ph = Math.abs(day - 15) / 15; disc(x, y, 8, 'rgba(220,230,255,0.1)'); disc(x, y, 4.5, '#f2eed8'); R(g, x - 2, y - 1, 1.5, 1.5, '#d8d2b8'); R(g, x + 1, y + 1.5, 1.5, 1, '#d8d2b8'); if (ph > 0.15) disc(x + (1 - ph) * 7 + 2, y - 1, 4.5, mix(T.sky[0], T.sky[1], 0.3)); }
  const cl = T.dark[1] > 0.3 ? mix(T.sky[1], '#ffffff', 0.18) : mix('#ffffff', T.sky[2], 0.4), cd = mix(cl, T.sky[1], 0.45);
  const puff = (cx, cy, rx, ry, c) => { for (let j = -ry; j <= 0; j += 0.5) { const w = rx * Math.sqrt(Math.max(0, 1 - (j * j) / (ry * ry))); R(g, Math.round((cx - w) * 2) / 2, cy + j, Math.round(w * 4) / 2, 0.5, c); } };
  for (let i = 0; i < 4; i++) {
    const w = 26 + (i * 13) % 14, x = ((i * 77 + t * (1.5 + i * 0.6)) % (AW + 70)) - 35, y = 14 + i * 9 + (i % 2) * 4;
    R(g, Math.round(x * 2) / 2, y, w, 1, cd);
    puff(x + w * 0.5, y, w * 0.5, 2.5, cl); puff(x + w * 0.32, y, w * 0.24, 5, cl); puff(x + w * 0.62, y, w * 0.28, 7, cl);
  }
  return T;
}
