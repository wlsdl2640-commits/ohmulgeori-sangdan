/* ───────── 빌드 63: 레어도 칸 · 홀로그램 (사용자 11-11 13:03) ─────────
   「A안 보석은 B」 → 26×26 도트 판(2배 = 52px): A안 테(2~3칸 경사 · 계단 바탕 · 희귀부터 모서리 따기 · 전설부터 금 줄 · 반짝이)
     + B안 위 보석(레어도만큼 커진다, 신화부터 아래 보석도).
   「영웅등급부터 테두리, 안쪽배경, 장비, 아이템 도트에 홀로그램처럼 레어도 빛이 움직이는 효과」 → 테 · 바탕 · 그림 도트를 한 판으로 굽고,
     그 위로 그 레어도 색의 빛줄기(빌드 63 다섯째 묶음부터 — 처음엔 무지갯빛)가 대각선으로 지나가는 12장을 세로로 이어 붙여 CSS steps로 넘긴다 (흐림 · 부드러운 이동 없음, 모두 칸으로).
   그림 하나 · 레어도 · 강화 단계마다 한 번만 굽고(RQ_CACHE), 큰 data URL은 칸마다 쓰지 않고 스타일 규칙 하나(.rqa.kN)로 붙인다. */
const RQ_N = 26, RQ_NF = 12, RQ_K = [12, 14, 20];
const RQ_GR = [   // [바탕, 밝음, 어두움, 칸 안]
  [[70, 78, 96], [100, 108, 128], [44, 50, 64], [26, 30, 42]],
  [[74, 138, 62], [123, 211, 106], [38, 78, 32], [22, 38, 24]],
  [[60, 118, 184], [106, 176, 255], [28, 60, 104], [20, 32, 54]],
  [[147, 86, 204], [196, 132, 244], [78, 42, 118], [38, 22, 56]],
  [[224, 160, 50], [255, 222, 132], [126, 82, 18], [50, 36, 12]],
  [[240, 92, 76], [255, 182, 160], [130, 36, 30], [58, 18, 16]],
  [[246, 232, 160], [255, 255, 236], [164, 144, 72], [64, 56, 28]]
];
const RQ_EMPTY = [[40, 46, 60], [52, 58, 74], [30, 34, 46], [18, 22, 32]];
const RQ_HOLO = [null, null, null,   // 빌드 63 다섯째 묶음 (11-11 15:01 사용자 「각 레어도 색상에 맞는 홀로그램으로」): 무지갯빛 → 그 레어도 색의 밝기 넷
  [[236, 200, 255], [196, 132, 244], [255, 176, 246], [168, 142, 255]],   // 영웅: 연보라 · 보라 · 분홍 보라 · 푸른 보라
  [[255, 244, 196], [255, 210, 100], [255, 232, 150], [255, 186, 72]],    // 전설: 옅은 금 · 금 · 밝은 금 · 호박
  [[255, 200, 186], [255, 124, 108], [255, 226, 212], [255, 156, 140]],   // 신화: 산호 · 빨강 · 옅은 분홍 · 붉은 산호
  [[255, 255, 244], [255, 246, 200], [255, 236, 168], [244, 248, 255]]    // 신성: 흰빛 · 상아 · 옅은 금 · 푸른 흰빛
];
const rqMix = (a, b, t) => [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
const RQ_W = [255, 255, 255];

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
  const w = [0, 2, 2, 4, 4, 6, 6][gg];
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
  if (gg >= 4) {
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
  return P;
}
// 홀로그램 빛줄기: 대각선(x + y)으로 장마다 6칸씩 지나간다. 신화부터 줄기 둘
function rqHolo(P, g, t) {
  const N = RQ_N, pal = RQ_HOLO[g]; if (!pal) return;
  const bands = [-6 + t * 6]; if (g >= 5) bands.push(-6 + t * 6 - 30);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const c = P[y * N + x]; if (!c) continue;
    let s = 0;
    for (const bc of bands) { const d = Math.abs(x + y - bc); if (d <= 1) s = Math.max(s, 0.62); else if (d <= 3) s = Math.max(s, 0.3); }
    if (!s) continue;
    const hc = pal[((((x - y) >> 2) + t) % pal.length + pal.length) % pal.length];
    P[y * N + x] = rqMix(c, hc, s);
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
    if (ic) for (const [px, py, col] of ic) { const X = px + 3, Y = py + 3; if (X >= 0 && Y >= 0 && X < N && Y < N) P[Y * N + X] = col; }
    rqPlus(P, plus);
    if (holo) rqHolo(P, g, t);
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
