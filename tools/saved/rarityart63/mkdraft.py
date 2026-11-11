"""시안 상자 (빌드 63 다섯째 묶음, 11-11 15:01 사용자 「신성 다음으로 우주, 창조등급 두 단계 더 · 레어도 표현 시안」):
우주(7) · 창조(8) 레어도 칸 A/B + 예전 무지갯빛 홀로그램 비교 (window.RQD = {7: 'A'|'B', 8: 'A'|'B'} · window.RQOLD).
  sandbox = 저장소의 build.py · src · fonts · tools/appart.py(+ app_scene.png · app_icon_scene.png) 사본
  python3 mkdraft.py <sandbox> → (cd sandbox && python3 build.py) → python3 rqsheet.py sandbox/dist/play.html rq_drafts.png rq_drafts.gif"""
import sys, pathlib
SB = pathlib.Path(sys.argv[1])
def sub(p, old, new, cnt=1):
    p = SB / p; s = p.read_text(encoding='utf-8'); assert s.count(old) == cnt, (p, old[:70], s.count(old)); p.write_text(s.replace(old, new), encoding='utf-8')
sub('src/data-store.js', 'const GRADE_MAX = 6;', 'const GRADE_MAX = 8;')
sub('src/data-rpg.js', "  { name: '신성', m: 4.0,  c: '#fff4b0' }\n];", "  { name: '신성', m: 4.0,  c: '#fff4b0' },\n  { name: '우주', m: 5.1,  c: '#9c9cff' },\n  { name: '창조', m: 6.5,  c: '#ffffff' }\n];")
R = 'src/rarity.js'
sub(R, "const rqMix = (a, b, t) =>", r"""const RQ_HOLO_OLD = [null, null, null, [[255, 138, 240], [160, 232, 255], [255, 240, 160], [200, 160, 255]], [[255, 248, 190], [255, 208, 96], [255, 255, 255], [176, 240, 255]], [[255, 176, 160], [255, 224, 128], [160, 240, 255], [255, 255, 255]], [[255, 154, 154], [255, 224, 138], [154, 255, 176], [154, 216, 255], [224, 168, 255]]];
const RQ_RAIN = [[255, 112, 112], [255, 186, 84], [248, 240, 104], [104, 232, 132], [96, 196, 255], [178, 128, 255]];
const rqOpt = g => (g >= 7 ? ((window.RQD || {})[g] || 'A') : '');
const RQX = {
  7: { A: { pal: [[60, 56, 156], [156, 168, 255], [26, 22, 84], [8, 8, 28]], holo: [[150, 172, 255], [196, 150, 255], [130, 232, 255], [255, 255, 255]] },
       B: { pal: [[30, 34, 86], [116, 226, 255], [12, 12, 46], [14, 8, 34]], holo: [[255, 156, 232], [176, 138, 255], [116, 232, 255], [255, 255, 255]] } },
  8: { A: { pal: [[226, 228, 246], [255, 255, 255], [146, 146, 184], [30, 26, 48]], holo: RQ_RAIN },
       B: { pal: [[214, 214, 232], [255, 255, 255], [96, 96, 132], [18, 14, 36]], holo: [[255, 255, 255], [236, 236, 255], [255, 244, 250], [244, 255, 252]] } }
};
const rqRing = (N, k) => { const r = []; for (let i = k + 1; i < N - k - 1; i++) r.push([i, k]); for (let i = k + 1; i < N - k - 1; i++) r.push([N - 1 - k, i]); for (let i = N - k - 2; i > k; i--) r.push([i, N - 1 - k]); for (let i = N - k - 2; i > k; i--) r.push([k, i]); return r; };
// 우주: 칸 안을 별밤으로 (A 대각 성운 띠 · B 성운 두 덩이)
function rqSpace(set, t, o, B) {
  const N = RQ_N, n1 = o === 'B' ? [70, 28, 86] : [40, 34, 96], n2 = o === 'B' ? [22, 40, 104] : [62, 44, 132];
  for (let y = 3; y <= N - 4; y++) for (let x = 3; x <= N - 4; x++) {
    let c = B, ck = (x + y) % 2;
    if (o === 'B') {
      const d1 = Math.hypot(x - 8, y - 8), d2 = Math.hypot(x - 18, y - 17);
      c = d1 < 3.2 ? n1 : d1 < 5.2 ? (ck ? n1 : B) : d2 < 3.6 ? n2 : d2 < 5.8 ? (ck ? n2 : B) : B;
    } else {
      const d = Math.abs(x - y);
      c = d < 2 ? n2 : d < 4 ? (ck ? n2 : n1) : d < 6 ? (ck ? n1 : B) : B;
    }
    set(x, y, c);
  }
}
function rqExtra(P, set, get, g, t, base, L, D) {
  const N = RQ_N, o = rqOpt(g);
  // 옆 보석 둘 (왼쪽 · 오른쪽 가운데)
  for (const [x0, s] of [[0, 1], [N - 4, -1]]) {
    for (let y = 10; y <= 15; y++) for (let x = x0; x < x0 + 4; x++) set(x, y, RQ_K);
    const gx = x0 + 1, cc = g === 8 ? RQ_RAIN[(t + (s > 0 ? 0 : 3)) % 6] : L;
    set(gx, 11, rqMix(cc, RQ_W, 0.45)); set(gx + 1, 11, base); set(gx, 12, base); set(gx + 1, 12, cc); set(gx, 13, cc); set(gx + 1, 13, D); set(gx, 14, D); set(gx + 1, 14, rqMix(D, [0, 0, 0], 0.3));
  }
  if (g === 7) {
    const ST = [[5, 6, 0], [20, 5, 1], [7, 17, 2], [19, 19, 3], [13, 4, 1], [4, 20, 2], [21, 12, 0], [11, 21, 3], [16, 8, 2], [6, 11, 1], [17, 15, 0], [10, 7, 3], [21, 20, 1], [4, 4, 2]];
    for (const [x, y, ph] of ST) {
      const k = (t + ph) % 4; if (k === 3) continue;
      set(x, y, k === 0 ? RQ_W : o === 'B' ? [255, 196, 244] : [176, 196, 255]);
      if (k === 0 && (t + ph) % 8 === 0) for (const [dx, dy] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) { const c = get(x + dx, y + dy); if (c) set(x + dx, y + dy, rqMix(c, [150, 170, 255], 0.6)); }
    }
    if (o === 'B') {   // 테를 도는 행성 셋
      const ring = rqRing(N, 1), cols = [[116, 232, 255], [255, 150, 220], [255, 214, 110]];
      for (let j = 0; j < 3; j++) { const i = (t * 6 + j * Math.floor(ring.length / 3)) % ring.length, [x, y] = ring[i], [px, py] = ring[(i - 1 + ring.length) % ring.length]; set(px, py, rqMix(cols[j], base, 0.55)); set(x, y, cols[j]); }
    } else {   // 네 모서리 별이 번갈아 반짝
      [[2, 2], [N - 3, 2], [2, N - 3], [N - 3, N - 3]].forEach(([x, y], j) => { if ((t + j) % 4 < 2) set(x, y, RQ_W); });
    }
  }
  if (g === 8) {
    if (o === 'A') {   // 안쪽 테를 도는 무지개 줄
      const ring = rqRing(N, 4);
      ring.forEach(([x, y], i) => { const c = get(x, y); if (c) set(x, y, rqMix(c, RQ_RAIN[((i >> 2) + t) % 6], 0.7)); });
    } else {   // 바깥 테 자체가 무지개
      for (const k of [1, 2]) { const ring = rqRing(N, k); ring.forEach(([x, y], i) => { const c = get(x, y); if (c) set(x, y, rqMix(c, RQ_RAIN[(Math.floor(i * 6 / ring.length) + (t >> 1)) % 6], k === 1 ? 0.75 : 0.55)); }); }
      const ST = [[6, 6, 0], [19, 6, 2], [6, 19, 4], [19, 19, 1], [12, 5, 3], [5, 12, 5], [20, 13, 2], [13, 20, 0]];
      for (const [x, y, ph] of ST) { const k = (t + ph) % 3; if (k === 2) continue; set(x, y, k === 0 ? RQ_W : RQ_RAIN[(ph + t) % 6]); }
    }
    const w = 8, cx = N / 2 - w / 2;   // 위 보석 가운데가 무지개로
    set(cx + 3, 1, RQ_RAIN[t % 6]); set(cx + 4, 2, RQ_RAIN[(t + 3) % 6]);
  }
}
const rqMix = (a, b, t) =>""")
sub(R, "const [base, L, D, B] = g < 0 ? RQ_EMPTY : RQ_GR[g], gg = Math.max(0, g);", "const [base, L, D, B] = g < 0 ? RQ_EMPTY : g >= 7 ? RQX[g][rqOpt(g)].pal : RQ_GR[g], gg = Math.max(0, g);")
sub(R, "  for (let i = 0; i < N; i++) { set(i, 0, RQ_K); set(i, N - 1, RQ_K); set(0, i, RQ_K); set(N - 1, i, RQ_K); }\n  const th", "  if (gg === 7) rqSpace(set, t, rqOpt(7), B);\n  for (let i = 0; i < N; i++) { set(i, 0, RQ_K); set(i, N - 1, RQ_K); set(0, i, RQ_K); set(N - 1, i, RQ_K); }\n  const th")
sub(R, "const w = [0, 2, 2, 4, 4, 6, 6][gg];", "const w = [0, 2, 2, 4, 4, 6, 6, 8, 8][gg];")
sub(R, "  if (gg >= 4) {\n    const spots", "  if (gg >= 4 && gg !== 7) {\n    const spots")
sub(R, "  return P;\n}\n// 홀로그램 빛줄기", "  if (gg >= 7) rqExtra(P, set, get, gg, t, base, L, D);\n  return P;\n}\n// 홀로그램 빛줄기")
sub(R, "const N = RQ_N, pal = RQ_HOLO[g]; if (!pal) return;\n  const bands = [-6 + t * 6]; if (g >= 5) bands.push(-6 + t * 6 - 30);",
       "const N = RQ_N, pal = g >= 7 ? RQX[g][rqOpt(g)].holo : window.RQOLD ? RQ_HOLO_OLD[g] : RQ_HOLO[g]; if (!pal) return;\n  const bands = [-6 + t * 6]; if (g >= 5) bands.push(-6 + t * 6 - 30); ")
sub(R, "key = (src || '') + '|' + g + '|' + pt;", "key = (src || '') + '|' + g + '|' + pt + '|' + rqOpt(g) + (window.RQOLD ? 'o' : '');")
print('draft ok')
