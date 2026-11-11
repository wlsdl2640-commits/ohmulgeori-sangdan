/* ───────── 빌드 63: 레어도 칸 · 홀로그램 (사용자 11-11 13:03) ─────────
   「A안 보석은 B」 → 26×26 도트 판(2배 = 52px): A안 테(2~3칸 경사 · 계단 바탕 · 희귀부터 모서리 따기 · 전설부터 금 줄 · 반짝이)
     + B안 위 보석(레어도만큼 커진다, 신화부터 아래 보석도).
   「영웅등급부터 테두리, 안쪽배경, 장비, 아이템 도트에 홀로그램처럼 레어도 빛이 움직이는 효과」 → 테 · 바탕 · 그림 도트를 한 판으로 굽고,
     그 위로 홀로그램(빌드 63 다섯째 묶음: 칸 전체에 레어도 색 필름 결 + 넓은 빛 덩어리 — 처음엔 무지갯빛 한 줄)이 흐르는 12장을 세로로 이어 붙여 CSS steps로 넘긴다 (흐림 · 부드러운 이동 없음, 모두 칸으로).
   우주(빌드 63 다섯째 묶음): 남빛 테 · 칸 안 별밤(rqSpace) · 옆 보석 · 깜빡이는 별(rqCosmos) · 보석 너비 8.
   그림 하나 · 레어도 · 강화 단계마다 한 번만 굽고(RQ_CACHE), 큰 data URL은 칸마다 쓰지 않고 스타일 규칙 하나(.rqa.kN)로 붙인다. */
const RQ_N = 26, RQ_NF = 12, RQ_K = [12, 14, 20];
const RQ_GR = [   // [바탕, 밝음, 어두움, 칸 안]
  [[70, 78, 96], [100, 108, 128], [44, 50, 64], [26, 30, 42]],
  [[74, 138, 62], [123, 211, 106], [38, 78, 32], [22, 38, 24]],
  [[60, 118, 184], [106, 176, 255], [28, 60, 104], [20, 32, 54]],
  [[147, 86, 204], [196, 132, 244], [78, 42, 118], [38, 22, 56]],
  [[224, 160, 50], [255, 222, 132], [126, 82, 18], [50, 36, 12]],
  [[240, 92, 76], [255, 182, 160], [130, 36, 30], [58, 18, 16]],
  [[246, 232, 160], [255, 255, 236], [164, 144, 72], [64, 56, 28]],
  [[60, 56, 156], [156, 168, 255], [26, 22, 84], [8, 8, 28]]   // 우주 (빌드 63 다섯째 묶음, 사용자가 고른 「우주 A · 별밤」): 남빛 테 · 칸 안은 별밤
];
const RQ_EMPTY = [[40, 46, 60], [52, 58, 74], [30, 34, 46], [18, 22, 32]];
const RQ_HOLO = [null, null, null,   // 빌드 63 다섯째 묶음 (11-11 15:01 사용자 「각 레어도 색상에 맞는 홀로그램으로」): 무지갯빛 → 그 레어도 색의 밝기 넷
  [[236, 200, 255], [196, 132, 244], [255, 176, 246], [168, 142, 255]],   // 영웅: 연보라 · 보라 · 분홍 보라 · 푸른 보라
  [[255, 244, 196], [255, 210, 100], [255, 232, 150], [255, 186, 72]],    // 전설: 옅은 금 · 금 · 밝은 금 · 호박
  [[255, 200, 186], [255, 124, 108], [255, 226, 212], [255, 156, 140]],   // 신화: 산호 · 빨강 · 옅은 분홍 · 붉은 산호
  [[255, 255, 244], [255, 246, 200], [255, 236, 168], [244, 248, 255]],   // 신성: 흰빛 · 상아 · 옅은 금 · 푸른 흰빛
  [[150, 172, 255], [196, 150, 255], [130, 232, 255], [255, 255, 255]]    // 우주: 푸른 보라 · 보라 · 하늘색 · 흰 별빛
];
const rqMix = (a, b, t) => [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
const RQ_W = [255, 255, 255];
// 우주: 칸 안을 별밤으로 — 성운 띠가 왼쪽 위에서 오른쪽 아래로 흐른다 (홀로그램 줄과 엇갈리게)
function rqSpace(set, B) {
  const N = RQ_N, n1 = [40, 34, 96], n2 = [62, 44, 132];
  for (let y = 3; y <= N - 4; y++) for (let x = 3; x <= N - 4; x++) {
    const d = Math.abs(x - y), ck = (x + y) % 2;
    set(x, y, d < 2 ? n2 : d < 4 ? (ck ? n2 : n1) : d < 6 ? (ck ? n1 : B) : B);
  }
}
const RQ_STARS = [[5, 6, 0], [20, 5, 1], [7, 17, 2], [19, 19, 3], [13, 4, 1], [4, 20, 2], [21, 12, 0], [11, 21, 3], [16, 8, 2], [6, 11, 1], [17, 15, 0], [10, 7, 3], [21, 20, 1], [4, 4, 2]];   // [x, y, 깜빡이는 때]
// 우주부터: 왼쪽 · 오른쪽 가운데 보석 둘 · 별이 깜빡(가끔 비스듬한 빛) · 네 모서리 별이 번갈아
function rqCosmos(set, get, t, base, L, D) {
  const N = RQ_N;
  for (const x0 of [0, N - 4]) {
    for (let y = 10; y <= 15; y++) for (let x = x0; x < x0 + 4; x++) set(x, y, RQ_K);
    const gx = x0 + 1;
    set(gx, 11, rqMix(L, RQ_W, 0.45)); set(gx + 1, 11, base); set(gx, 12, base); set(gx + 1, 12, L); set(gx, 13, L); set(gx + 1, 13, D); set(gx, 14, D); set(gx + 1, 14, rqMix(D, [0, 0, 0], 0.3));
  }
  for (const [x, y, ph] of RQ_STARS) {
    const k = (t + ph) % 4; if (k === 3) continue;
    set(x, y, k === 0 ? RQ_W : [176, 196, 255]);
    if (k === 0 && (t + ph) % 8 === 0) for (const [dx, dy] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) { const c = get(x + dx, y + dy); if (c) set(x + dx, y + dy, rqMix(c, [150, 170, 255], 0.6)); }
  }
  [[2, 2], [N - 3, 2], [2, N - 3], [N - 3, N - 3]].forEach(([x, y], j) => { if ((t + j) % 4 < 2) set(x, y, RQ_W); });
}

// 테 + 바탕 (그림 없이). g = -1이면 빈 칸
function rqFrame(g, t) {
  const N = RQ_N, P = new Array(N * N).fill(null), set = (x, y, c) => { if (x >= 0 && y >= 0 && x < N && y < N) P[y * N + x] = c; }, get = (x, y) => P[y * N + x];
  const [base, L, D, B] = g < 0 ? RQ_EMPTY : RQ_GR[g], gg = Math.max(0, g);
  // 바탕: 둥근 빛 대신 계단 세 겹 + 이음매 바둑 무늬
  const c0 = B, c1 = rqMix(B, base, g < 0 ? 0.06 : 0.16), c2 = rqMix(B, base, g < 0 ? 0.1 : 0.3), m = (N - 1) / 2;
  for (let y = 3; y <= N - 4; y++) for (let x = 3; x <= N - 4; x++) {
    const ax = Math.abs(x - m), ay = Math.abs(y - m + 1), r = Math.max(ax, ay) + 0.25 * Math.min(ax, ay), ck = (x + y) % 2;
    set(x, y, r < 4.5 ? c2 : r < 5.6 ? (ck ? c2 : c1) : r < 7.8 ? c1 : r < 8.9 ? (ck ? c1 : c0) : c0);
  }
  if (gg === 7) rqSpace(set, B);
  for (let i = 0; i < N; i++) { set(i, 0, RQ_K); set(i, N - 1, RQ_K); set(0, i, RQ_K); set(N - 1, i, RQ_K); }
  const th = gg < 4 ? 2 : 3;
  for (let k = 1; k <= th; k++) {
    const tl = k < th || gg < 4 ? L : base;
    for (let i = k; i < N - k; i++) { set(i, k, tl); set(k, i, tl); set(i, N - 1 - k, D); set(N - 1 - k, i, D); }
    set(N - 1 - k, k, base); set(k, N - 1 - k, base);
  }
  for (let i = th + 1; i < N - th - 1; i++) { const a = get(i, th + 1), b = get(th + 1, i); if (a) set(i, th + 1, rqMix(a, [0, 0, 0], 0.35)); if (b) set(th + 1, i, rqMix(b, [0, 0, 0], 0.35)); }
  if (g < 0) return P;
  if (gg >= 2) for (const [x, y] of [[1, 1], [N - 2, 1], [1, N - 2], [N - 2, N - 2]]) set(x, y, RQ_K);   // 모서리 따기
  if (gg >= 4) for (let i = th + 2; i < N - th - 2; i += 2) { set(i, th + 1, rqMix(L, base, 0.5)); set(th + 1, i, rqMix(L, base, 0.5)); }   // 금 가는 줄
  // B안 보석: 위 가운데, 레어도만큼 넓어진다
  const w = [0, 2, 2, 4, 4, 6, 6, 8][gg];
  if (w) {
    const cx = N / 2 - w / 2;
    for (let dx = 0; dx < w; dx++) {
      set(cx + dx, 0, RQ_K); set(cx + dx, 3, RQ_K);
      set(cx + dx, 1, dx < w / 2 ? rqMix(L, RQ_W, 0.4) : base); set(cx + dx, 2, dx < w / 2 ? base : D);
    }
    set(cx - 1, 1, RQ_K); set(cx - 1, 2, RQ_K); set(cx + w, 1, RQ_K); set(cx + w, 2, RQ_K);
    if (gg >= 4 && t % 4 === 0) set(cx, 1, RQ_W);
  }
  if (gg >= 5) { const cx = N / 2 - 1; set(cx - 1, N - 4, RQ_K); set(cx + 2, N - 4, RQ_K); set(cx, N - 4, base); set(cx + 1, N - 4, rqMix(L, RQ_W, 0.3)); set(cx, N - 3, D); set(cx + 1, N - 3, base); }
  // 반짝이 (장마다 자리가 바뀐다)
  if (gg >= 4 && gg !== 7) {   // 우주는 반짝이 대신 별
    const spots = [[7, 7], [19, 9], [9, 19], [18, 18], [13, 6], [6, 13]], n = gg === 4 ? 1 : gg === 5 ? 2 : 3;
    for (let j = 0; j < n; j++) {
      if ((t + j) % 3 === 2) continue;
      const [sx, sy] = spots[(t + j * 2) % spots.length], big = gg === 6 && (t + j) % 2 === 0;
      set(sx, sy, RQ_W);
      for (const [dx, dy] of big ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : [[1, 1], [-1, -1], [1, -1], [-1, 1]]) set(sx + dx, sy + dy, L);
    }
  }
  if (gg === 5) {   // 신화: 테를 도는 빛 칸
    const ring = [];
    for (let i = 2; i < N - 2; i++) ring.push([i, 1]);
    for (let i = 2; i < N - 2; i++) ring.push([N - 2, i]);
    for (let i = N - 3; i > 1; i--) ring.push([i, N - 2]);
    for (let i = N - 3; i > 1; i--) ring.push([1, i]);
    for (let j = 0; j < 3; j++) { const [x, y] = ring[(t * 7 + j) % ring.length]; set(x, y, [255, 236, 220]); }
  }
  if (gg === 6) {   // 신성: 모서리에서 퍼지는 빛살 (계단 줄)
    for (let k = 4; k < 13; k += 3) for (const [x, y] of [[k + t % 3, 4], [4, k + t % 3], [N - 1 - k - t % 3, N - 5], [N - 5, N - 1 - k - t % 3]]) {
      const c = get(x, y); if (x > 3 && x < N - 4 && y > 3 && y < N - 4 && c) set(x, y, rqMix(c, L, 0.45));
    }
  }
  if (gg >= 7) rqCosmos(set, get, t, base, L, D);
  return P;
}
// 홀로그램 빛줄기: 대각선(x + y)으로 장마다 6칸씩 지나간다. 신화부터 줄기 둘
const RQ_BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];   // 4×4 바둑 무늬 문턱
// 홀로그램 (11-11 17:37 사용자 확정 「C안」 — 「한 줄 말고 전체적으로」 · 「필름이랑 넓은 빛을 합쳐」 · 「필름 세기를 A와 B 사이로」):
//   칸 전체에 레어도 색 필름 결(밝은 칸일수록 진하게, 조금 가파른 결)이 흐르고, 넓은 빛 덩어리가 대각선으로 한 번 지나간다.
//   필름 세기 = 기본 × (0.7 + 0.35 × 빛이 닿은 정도), 넓은 빛은 레어도 색을 흰빛 쪽으로 35% 섞어 더한다. 그림(M) 칸은 0.6배.
function rqHolo(P, g, t, M) {
  const N = RQ_N, pal = RQ_HOLO[g]; if (!pal) return;
  const n = pal.length, md = (a, b) => ((a % b) + b) % b;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x, c = P[i]; if (!c) continue;
    const th = (RQ_BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16, im = M && M[i] ? 0.6 : 1;
    const w = md(x * 2 + y - t * 2, 24) / 24, lum = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255, lv = 0.12 + 0.5 * lum;
    const sf = lv > 0.45 ? 0.5 : lv > 0.3 ? (th < 0.5 ? 0.42 : 0.3) : (th < 0.5 ? 0.24 : 0.14);
    const d = Math.abs(x + y + 26 - t * 6.5), k = d < 4 ? 1 : d < 9 ? (th < 0.66 ? 0.7 : 0.45) : d < 15 ? (th < 0.4 ? 0.35 : 0.15) : 0;
    const ss = d < 4 ? 0.45 : d < 9 ? (th < 0.66 ? 0.3 : 0.18) : d < 15 ? (th < 0.4 ? 0.14 : 0.05) : 0;
    let q = rqMix(c, pal[Math.floor(w * n) % n], sf * (0.7 + 0.35 * k) * im);
    if (ss) q = rqMix(q, rqMix(pal[md(((x - y) >> 2) + t, n)], RQ_W, 0.35), ss * im);
    P[i] = q;
  }
}
// 강화 표시 (+4 · +7 · +10): 왼쪽 아래 2×2 도트 (예전 흐린 빛 대신)
function rqPlus(P, plus) {
  if (!(plus >= 4)) return;
  const c = plus >= 10 ? [240, 180, 60] : plus >= 7 ? [192, 122, 240] : [106, 176, 255], N = RQ_N, x0 = 4, y0 = N - 7;
  for (let dy = -1; dy <= 2; dy++) for (let dx = -1; dx <= 2; dx++) { const x = x0 + dx, y = y0 + dy; P[y * N + x] = dx < 0 || dy < 0 || dx > 1 || dy > 1 ? RQ_K : dx === 0 && dy === 0 ? rqMix(c, RQ_W, 0.5) : c; }
}
// 그림 도트 얹기: 20×20(또는 10×10을 2배) 그림을 (3,3)에
function rqIconPx(src) {
  const cv = src && URL_CV.get(src); if (!cv) return null;
  const w = cv.width, h = cv.height, d = cv.getContext('2d').getImageData(0, 0, w, h).data, sc = w <= 10 ? 2 : 1, out = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4; if (d[i + 3] < 128) continue;
    const c = [d[i], d[i + 1], d[i + 2]];
    for (let yy = 0; yy < sc; yy++) for (let xx = 0; xx < sc; xx++) out.push([x * sc + xx, y * sc + yy, c]);
  }
  return out;
}
const RQ_CACHE = new Map();
let RQ_STYLE = null, RQ_SEQ = 0;
function rqClass(src, g, plus) {
  const pt = plus >= 10 ? 3 : plus >= 7 ? 2 : plus >= 4 ? 1 : 0, key = (src || '') + '|' + g + '|' + pt;
  if (RQ_CACHE.has(key)) return RQ_CACHE.get(key);
  const holo = g >= 3, nf = holo ? RQ_NF : 1, N = RQ_N, ic = rqIconPx(src);
  const [c, x] = mkCanvas(N, N * nf), img = x.createImageData(N, N * nf), D = img.data;
  for (let t = 0; t < nf; t++) {
    const P = rqFrame(g, t);
    const M = new Uint8Array(N * N);   // 그림 칸 (홀로그램을 조금 약하게)
    if (ic) for (const [px, py, col] of ic) { const X = px + 3, Y = py + 3; if (X >= 0 && Y >= 0 && X < N && Y < N) { P[Y * N + X] = col; M[Y * N + X] = 1; } }
    rqPlus(P, plus);
    if (holo) rqHolo(P, g, t, M);
    for (let i = 0; i < N * N; i++) { const col = P[i]; if (!col) continue; const o = (t * N * N + i) * 4; D[o] = col[0]; D[o + 1] = col[1]; D[o + 2] = col[2]; D[o + 3] = 255; }
  }
  x.putImageData(img, 0, 0);
  const cls = 'k' + (++RQ_SEQ);
  if (!RQ_STYLE) { RQ_STYLE = document.createElement('style'); RQ_STYLE.id = 'rq-sheets'; document.head.appendChild(RQ_STYLE); }
  try { RQ_STYLE.sheet.insertRule(`.rqa.${cls} { background-image: url(${c.toDataURL()}); }`, RQ_STYLE.sheet.cssRules.length); } catch (_) { /* 규칙을 못 넣으면 빈 칸 */ }
  const out = cls + (holo ? ' holo' : '');
  RQ_CACHE.set(key, out); return out;
}
// 칸 그림 HTML. s = 1(26px) · 2(52px)
const rqArt = (src, g, s, plus) => `<i class="rqa s${s || 2} ${rqClass(src, Math.max(0, Math.min(GRADE_MAX, g | 0)), plus | 0)}" aria-hidden="true"></i>`;
const rqEmpty = s => `<i class="rqa s${s || 2} ${rqClass(null, -1, 0)}" aria-hidden="true"></i>`;
const gArt = (g, s) => rqArt(gearIconURL(g), g.q || 0, s, g.plus || 0);
const iArt = (k, s) => rqArt(iconURL(k), itemGrade(k), s, 0);
