/* ───────── 레이드 몬스터: 부품을 겹쳐 그리고 부품 사이에 굵은 선을 넣는다 ─────────
   부품마다 바탕색 → 아래·오른쪽 가장자리는 그늘, 위·왼쪽은 밝음 → 부품이 만나는 곳은 짙은 선 → 바깥은 검은 테두리 */
class GP {
  constructor(w, h) { this.w = w; this.h = h; this.id = new Int16Array(w * h).fill(-1); this.parts = []; }
  // fn(P): Pix에 모양을 그린다 (색은 아무거나). o: { flat, nolight, line }
  part(color, fn, o = {}) {
    const P = new Pix(this.w, this.h); fn(P);
    const k = this.parts.length; this.parts.push({ c: color, r: pxRamp(color), o });
    for (let i = 0; i < this.w * this.h; i++) if (P.d[i]) this.id[i] = k;
    return k;
  }
  // 점·무늬: 이미 칠한 부품 위에 색만 바꾼다
  dot(x, y, color, w = 1, h = 1) { const k = this.parts.length; this.parts.push({ c: color, r: pxRamp(color), o: { flat: 1, nolight: 1, over: 1 } }); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const X = x + i, Y = y + j; if (X >= 0 && Y >= 0 && X < this.w && Y < this.h && this.id[Y * this.w + X] >= 0) this.id[Y * this.w + X] = k; } }
  canvas(ax, ay) {
    const { w, h, id } = this, img = new ImageData(w, h), d = img.data, ink = [26, 20, 30];
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? -1 : id[y * w + x]);
    const put = (i, c) => { d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const k = at(x, y); if (k < 0) continue;
      const p = this.parts[k], i = y * w + x;
      // 부품 사이 선: 아래/오른쪽 이웃이 다른 부품(앞에 있든 뒤에 있든)이면 짙게
      const nb = [at(x + 1, y), at(x - 1, y), at(x, y + 1), at(x, y - 1)];
      if (!p.o.over && nb.some(n => n !== k && n >= 0 && !this.parts[n].o.over)) { put(i, pxRgb(p.r.d)); continue; }
      if (p.o.flat) { put(i, pxRgb(p.c)); continue; }
      const sh = at(x + 1, y + 1) !== k || at(x + 2, y + 2) !== k || at(x, y + 2) !== k, lt = at(x - 1, y - 1) !== k || at(x - 2, y - 2) !== k;
      put(i, pxRgb(sh ? p.r.s : lt && !p.o.nolight ? p.r.l : p.c));
    }
    // 바깥 테두리
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (at(x, y) >= 0) continue; if (at(x + 1, y) >= 0 || at(x - 1, y) >= 0 || at(x, y + 1) >= 0 || at(x, y - 1) >= 0) { const i = y * w + x; d[i * 4] = ink[0]; d[i * 4 + 1] = ink[1]; d[i * 4 + 2] = ink[2]; d[i * 4 + 3] = 255; } }
    const [cv, x] = mkCanvas(w, h); x.putImageData(img, 0, 0);
    return { cv, ax, ay, w, h };
  }
}
const gpEll = (cx, cy, rx, ry) => P => P.ell(cx, cy, rx, ry, 1);
const gpPoly = pts => P => P.poly(pts, 1);
const gpRect = (x, y, w, h) => P => P.rect(x, y, w, h, 1);
const gpCap = (x1, y1, x2, y2, r) => P => { const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1))); for (let i = 0; i <= n; i++) P.ell(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, r, r, 1); };
const gpAll = (...fns) => P => fns.forEach(f => f(P));
// 눈: 흰자·눈동자·반짝임
function gpEye(G, x, y, r, iris, big) { G.part('#ffffff', gpEll(x, y, r, r * 0.9), { flat: 1 }); G.part(iris, gpEll(x + (big ? 0.5 : 0.3), y + 0.3, r * 0.62, r * 0.62), { flat: 1 }); G.dot(Math.round(x - r * 0.35), Math.round(y - r * 0.45), '#ffffff', big ? 2 : 1, big ? 2 : 1); }

const PXG = {
  kingslime(G) {
    G.part('#2a6aa8', gpEll(26, 35, 24, 4));                          // 바닥 그늘 젤리
    G.part('#5ab0f0', gpAll(gpEll(26, 24, 24, 15), gpEll(26, 18, 18, 14)));
    G.part('#7ac8ff', gpEll(20, 13, 9, 5), { nolight: 1 });            // 윤기
    G.part('#3a7ab8', gpAll(gpEll(14, 29, 4, 3), gpEll(36, 30, 3, 2.5), gpEll(26, 32, 2.5, 2)), { flat: 1 });   // 속 젤리
    for (const [x, y] of [[4, 35], [46, 34], [12, 37]]) G.part('#4a98d8', gpEll(x, y + 2, 2, 2.5), { nolight: 1 });   // 방울
    gpEye(G, 16, 21, 4.2, '#1a2a4a', 1); gpEye(G, 34, 21, 4.2, '#1a2a4a', 1);
    G.part('#1a2a4a', gpPoly([[20, 27], [32, 27], [30, 31], [22, 31]]), { flat: 1 });
    G.part('#f06a7a', gpEll(26, 30, 3, 1.4), { flat: 1 });
    G.part('#b08a2a', gpPoly([[16, 8], [36, 8], [36, 4], [31, 6], [26, 1], [21, 6], [16, 4]]));   // 왕관
    G.part('#f0c24a', gpPoly([[17, 7], [35, 7], [35, 5], [31, 7], [26, 2], [21, 7], [17, 5]]), { nolight: 1 });
    G.dot(20, 6, '#e04a3a'); G.dot(26, 4, '#e04a3a'); G.dot(32, 6, '#e04a3a'); G.dot(26, 3, '#ffffff');
  },
  kaishar(G) {
    G.part('#8a2424', gpPoly([[6, 14], [18, 12], [22, 30], [4, 34]]));                     // 망토
    G.part('#3a2a1a', gpAll(gpRect(12, 36, 5, 6), gpRect(20, 36, 5, 6)));                   // 다리
    G.part('#2a1c12', gpAll(gpRect(10, 41, 8, 3), gpRect(19, 41, 8, 3)));                   // 장화
    G.part('#5a1a1a', gpPoly([[11, 20], [26, 20], [27, 36], [10, 36]]));                    // 몸통 갑옷
    G.part('#3a1010', gpAll(gpRect(12, 25, 13, 1), gpRect(12, 30, 13, 1)), { flat: 1 });
    G.part('#c9a04a', gpRect(10, 32, 17, 2), { nolight: 1 });                               // 허리띠
    G.part('#8a8e9a', gpAll(gpEll(11, 21, 4.5, 3), gpEll(26, 21, 4.5, 3)));                 // 어깨판
    G.dot(10, 20, '#d8dce4'); G.dot(25, 20, '#d8dce4');
    G.part('#6e9e44', gpAll(gpCap(26, 22, 30, 15, 2), gpCap(10, 22, 7, 30, 2)));             // 팔
    G.part('#6e9e44', gpAll(gpEll(18, 11, 8, 7), gpPoly([[9, 9], [12, 12], [12, 7]]), gpPoly([[27, 9], [24, 12], [24, 7]])));   // 머리와 귀
    G.part('#c0392b', gpAll(gpPoly([[10, 6], [26, 6], [25, 10], [11, 10]]), gpPoly([[18, 6], [14, 2], [22, 2]])));   // 두건과 뿔
    G.dot(12, 7, '#8a2424'); G.dot(14, 12, '#4a7030', 1, 3); G.dot(16, 15, '#f4ecdc', 1, 2); G.dot(21, 15, '#f4ecdc', 1, 2);
    gpEye(G, 21, 11, 2.2, '#e04a2a');
    G.part('#6a4428', gpCap(31, 14, 31, 30, 1.2));                                           // 손잡이와 칼
    G.part('#d8dce4', gpPoly([[29, 13], [33, 13], [33, 0], [31, -3], [29, 0]]));
    G.dot(30, 1, '#ffffff', 1, 11);
    G.part('#c9a04a', gpRect(28, 13, 6, 2), { nolight: 1 });
    G.part('#6a4428', gpCap(6, 30, 6, 18, 1.2)); G.part('#a8aeb8', gpPoly([[4, 18], [8, 18], [8, 4], [6, 1], [4, 4]]));   // 등 뒤 칼
  },
  raidgriffon(G) {
    G.part('#8a6a3a', gpCap(8, 36, 20, 40, 1.4)); G.part('#6a4a2a', gpEll(6, 36, 3.5, 2.5));   // 꼬리
    G.part('#c8a050', gpEll(36, 38, 14, 9));                                                  // 몸 (사자)
    G.part('#a8843c', gpAll(gpEll(26, 42, 6, 5), gpCap(26, 44, 24, 51, 2.5)));                // 뒷다리
    G.part('#c8a050', gpAll(gpCap(42, 44, 44, 51, 2.5), gpCap(36, 44, 36, 51, 2.5)));         // 앞다리
    for (const x of [22, 34, 42]) G.part('#f0c24a', gpPoly([[x, 51], [x + 5, 51], [x + 4, 54], [x - 1, 54]]), { flat: 1 });   // 발톱
    // 날개: 어깨에서 왼쪽 위로 뻗은 팔뼈에서 깃털이 뒤로 쓸려 나간다
    for (let i = 0; i < 9; i++) { const sx = 44 - i * 3.6, sy = 26 - i * 2.2, L = 22 - i * 1.2; G.part(i % 2 ? '#a8843c' : '#b8944a', gpCap(sx, sy, sx - L, sy + 6 + i * 1.4, 2.4)); }
    for (let i = 0; i < 7; i++) { const sx = 43 - i * 3.6, sy = 24 - i * 2.2, L = 11 - i * 0.6; G.part(i % 2 ? '#c8a050' : '#d4ac5c', gpCap(sx, sy, sx - L, sy + 2 + i * 0.8, 2)); }
    G.part('#c8a050', gpCap(46, 27, 12, 6, 3.4));
    G.part('#d8b868', gpCap(44, 26, 14, 8, 1.4), { flat: 1 });
    G.part('#e8d8a8', gpEll(44, 30, 7, 8), { nolight: 1 });                                   // 가슴 깃털
    G.part('#d8b060', gpCap(46, 28, 52, 14, 5));                                               // 목
    G.part('#e0c070', gpEll(54, 10, 7.5, 6.5));                                                // 머리
    G.part('#d8b060', gpAll(gpPoly([[50, 5], [48, -1], [53, 4]]), gpPoly([[55, 4], [57, -2], [59, 5]])));   // 귀깃
    G.part('#f0c24a', gpPoly([[60, 9], [66, 11], [62, 15]])); G.part('#b08a2a', gpPoly([[60, 12], [63, 14], [61, 15]]), { flat: 1 });   // 부리
    gpEye(G, 56, 9, 2, '#2a1a0a');
    G.dot(54, 7, '#8a6a3a', 3, 1);
  },
  tempest(G) {
    G.part('#1e3050', gpPoly([[0, 20], [10, 22], [12, 30], [18, 40], [8, 44], [2, 36]]));       // 꼬리 끝
    G.part('#3a5a8a', gpAll(gpCap(16, 42, 26, 48, 3), gpCap(6, 36, 16, 42, 2.4)));            // 꼬리
    G.part('#1e3050', gpPoly([[2, 34], [8, 30], [10, 38]]), { flat: 1 });                     // 꼬리 끝 창
    G.part('#2a4878', gpPoly([[12, 2], [40, 18], [60, 24], [50, 40], [30, 40], [16, 30]]));    // 날개 막
    for (const [x1, y1, x2, y2] of [[48, 30, 14, 4], [48, 30, 26, 2], [48, 30, 44, 12], [48, 30, 58, 22]]) G.part('#1e3050', gpCap(x1, y1, x2, y2, 1), { flat: 1 });   // 날개 뼈
    G.part('#3a5a8a', gpEll(40, 44, 16, 9));                                                   // 몸
    G.part('#2a4470', gpAll(gpCap(30, 48, 28, 57, 3), gpCap(48, 48, 50, 57, 3)));              // 다리
    for (const x of [24, 46]) G.part('#e8e2d0', gpPoly([[x, 57], [x + 8, 57], [x + 7, 60], [x + 1, 60]]), { flat: 1 });
    G.part('#3a5a8a', gpCap(52, 40, 62, 22, 5));                                                // 목
    for (let i = 0; i < 5; i++) G.part('#1e3050', gpPoly([[50 + i * 2, 36 - i * 4], [56 + i * 2, 34 - i * 4], [52 + i * 2, 30 - i * 5]]));   // 등 가시
    G.part('#3a5a8a', gpEll(64, 16, 9, 7));                                                     // 머리
    G.part('#2a4470', gpPoly([[66, 20], [78, 22], [74, 26], [64, 24]]));                        // 아래턱
    G.part('#3a5a8a', gpPoly([[66, 14], [80, 18], [72, 22], [64, 20]]));                        // 주둥이
    G.dot(70, 20, '#e8e2d0'); G.dot(74, 20, '#e8e2d0'); G.dot(72, 22, '#e8e2d0');
    G.part('#e8e2d0', gpAll(gpPoly([[60, 10], [58, 0], [63, 8]]), gpPoly([[66, 10], [68, 0], [69, 9]])));   // 뿔
    gpEye(G, 66, 13, 2.2, '#9ad0f0');
    for (const [x, y] of [[36, 40], [44, 46]]) { G.dot(x, y, '#8ad8ff', 2, 1); G.dot(x + 1, y + 1, '#8ad8ff', 2, 1); G.dot(x + 2, y + 2, '#c8f0ff', 1, 1); }   // 번개 무늬
  },
  behemoth(G) {
    G.part('#4a4a80', gpPoly([[0, 40], [10, 44], [8, 52], [16, 48], [10, 58], [0, 56], [2, 48]]));   // 꼬리 지느러미
    G.part('#5a5a98', gpCap(10, 48, 26, 46, 7));                                                    // 꼬리 몸통
    G.part('#6a6aa8', gpEll(58, 38, 40, 20));                                                        // 몸
    G.part('#9a9ad8', gpAll(gpEll(60, 48, 34, 10), gpEll(80, 44, 14, 9)), { nolight: 1 });           // 배
    G.part('#6a6aa8', gpEll(80, 30, 20, 16));                                                        // 머리
    for (let i = 0; i < 4; i++) G.part('#4a4a80', gpPoly([[28 + i * 12, 22 + Math.abs(i - 1.5) * 1], [36 + i * 12, 20 + Math.abs(i - 1.5)], [40 + i * 12, 10 + (i % 2) * 2]]));   // 등 지느러미
    for (let i = 0; i < 3; i++) G.part('#5a5a98', gpPoly([[40 + i * 16, 50], [52 + i * 16, 52], [44 + i * 16, 60]]));   // 옆 지느러미
    G.part('#5a5a98', gpPoly([[86, 46], [100, 50], [90, 56]]));                                     // 앞 지느러미
    G.part('#2a2a4a', gpPoly([[66, 42], [98, 40], [98, 42], [66, 45]]), { flat: 1 });                // 입
    for (let i = 0; i < 6; i++) G.dot(70 + i * 5, 42, '#d8d8f0', 2, 1);
    gpEye(G, 74, 26, 3, '#f0b040', 1); gpEye(G, 86, 24, 3, '#f0b040', 1);
    gpEye(G, 76, 34, 2.2, '#f0b040'); gpEye(G, 88, 32, 2.2, '#f0b040');
    for (const [x, y] of [[30, 30], [44, 26], [50, 36], [62, 24]]) { G.dot(x, y, '#8ad0ff', 2, 2); G.dot(x + 3, y + 1, '#c8f0ff'); }   // 빛나는 무늬
    for (const [x, y] of [[36, 46], [52, 44], [20, 42]]) G.part('#8a8aa0', gpEll(x, y, 2, 1.5), { flat: 1 });   // 따개비
  }
};
const PXG_DIM = { kingslime: [52, 40], kaishar: [36, 46], raidgriffon: [68, 56], tempest: [82, 62], behemoth: [104, 62] };
function pxGiantSprite(id) {
  const key = 'PG|' + id;
  let s = PXC.get(key + '|');
  if (s) return s;
  const [w, h] = PXG_DIM[id], G = new GP(w, h);
  PXG[id](G);
  s = G.canvas(Math.round(w / 2), h - 1);
  PXC.set(key + '|', s);
  return s;
}
