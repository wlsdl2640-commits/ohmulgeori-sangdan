"""시안 상자 2 (11-11 17:05 사용자 「빛이 이동하는 걸 전체적으로 입힐 수는 없어? 한 줄 말고」):
홀로그램 빛 방식 window.RQH = 'line'(지금 한 줄) | 'wave'(칸 전체에 좁은 띠 여러 줄) | 'flow'(칸 전체가 레어도 색 띠로 흐름) | 'sheen'(넓은 빛) | 'foil'(밝은 칸일수록 반짝)
+ 창조 A/B(window.RQD = {8: 'A'|'B'}). sandbox = 저장소 build.py · src · fonts · tools/appart.py 사본. python3 mkdraft2.py <sandbox>"""
import sys, pathlib
SB = pathlib.Path(sys.argv[1])
def sub(p, old, new, cnt=1):
    p = SB / p; s = p.read_text(encoding='utf-8'); assert s.count(old) == cnt, (p, old[:70], s.count(old)); p.write_text(s.replace(old, new), encoding='utf-8')
sub('src/data-store.js', 'const GRADE_MAX = 7;', 'const GRADE_MAX = 8;')
sub('src/data-rpg.js', "  { name: '우주', m: 5.1,  c: '#9c9cff' }   // 빌드 63 다섯째 묶음\n];", "  { name: '우주', m: 5.1,  c: '#9c9cff' },\n  { name: '창조', m: 6.5,  c: '#ffffff' }\n];")
R = 'src/rarity.js'
sub(R, "const rqMix = (a, b, t) =>", r"""const RQ_RAIN = [[255, 112, 112], [255, 186, 84], [248, 240, 104], [104, 232, 132], [96, 196, 255], [178, 128, 255]];
const rqOpt = g => (g === 8 ? ((window.RQD || {})[8] || 'A') : '');
const RQX8 = { A: { pal: [[226, 228, 246], [255, 255, 255], [146, 146, 184], [30, 26, 48]], holo: RQ_RAIN },
               B: { pal: [[214, 214, 232], [255, 255, 255], [96, 96, 132], [18, 14, 36]], holo: [[255, 255, 255], [236, 236, 255], [255, 244, 250], [244, 255, 252]] } };
const rqRing = (N, k) => { const r = []; for (let i = k + 1; i < N - k - 1; i++) r.push([i, k]); for (let i = k + 1; i < N - k - 1; i++) r.push([N - 1 - k, i]); for (let i = N - k - 2; i > k; i--) r.push([i, N - 1 - k]); for (let i = N - k - 2; i > k; i--) r.push([k, i]); return r; };
function rqCreate(set, get, t, base, L, D) {
  const N = RQ_N, o = rqOpt(8);
  for (const [x0, s] of [[0, 1], [N - 4, -1]]) {
    for (let y = 10; y <= 15; y++) for (let x = x0; x < x0 + 4; x++) set(x, y, RQ_K);
    const gx = x0 + 1, cc = RQ_RAIN[(t + (s > 0 ? 0 : 3)) % 6];
    set(gx, 11, rqMix(cc, RQ_W, 0.45)); set(gx + 1, 11, base); set(gx, 12, base); set(gx + 1, 12, cc); set(gx, 13, cc); set(gx + 1, 13, D); set(gx, 14, D); set(gx + 1, 14, rqMix(D, [0, 0, 0], 0.3));
  }
  if (o === 'A') { const ring = rqRing(N, 4); ring.forEach(([x, y], i) => { const c = get(x, y); if (c) set(x, y, rqMix(c, RQ_RAIN[((i >> 2) + t) % 6], 0.7)); }); }
  else {
    for (const k of [1, 2]) { const ring = rqRing(N, k); ring.forEach(([x, y], i) => { const c = get(x, y); if (c) set(x, y, rqMix(c, RQ_RAIN[(Math.floor(i * 6 / ring.length) + (t >> 1)) % 6], k === 1 ? 0.75 : 0.55)); }); }
    for (const [x, y, ph] of [[6, 6, 0], [19, 6, 2], [6, 19, 4], [19, 19, 1], [12, 5, 3], [5, 12, 5], [20, 13, 2], [13, 20, 0]]) { const k = (t + ph) % 3; if (k === 2) continue; set(x, y, k === 0 ? RQ_W : RQ_RAIN[(ph + t) % 6]); }
  }
  const cx = N / 2 - 4; set(cx + 3, 1, RQ_RAIN[t % 6]); set(cx + 4, 2, RQ_RAIN[(t + 3) % 6]);
}
const BAY4D = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const rqMix = (a, b, t) =>""")
sub(R, "const [base, L, D, B] = g < 0 ? RQ_EMPTY : RQ_GR[g], gg = Math.max(0, g);", "const [base, L, D, B] = g < 0 ? RQ_EMPTY : g === 8 ? RQX8[rqOpt(8)].pal : RQ_GR[g], gg = Math.max(0, g);")
sub(R, "const w = [0, 2, 2, 4, 4, 6, 6, 8][gg];", "const w = [0, 2, 2, 4, 4, 6, 6, 8, 8][gg];")
sub(R, "  if (gg >= 7) rqCosmos(set, get, t, base, L, D);", "  if (gg === 7) rqCosmos(set, get, t, base, L, D);\n  if (gg === 8) rqCreate(set, get, t, base, L, D);")
s = (SB / R).read_text(encoding='utf-8'); i = s.index('function rqHolo(P, g, t) {'); j = s.index('// 강화 표시', i)
s = s[:i] + r"""function rqHolo(P, g, t, M) {
  const N = RQ_N, pal = g === 8 ? RQX8[rqOpt(8)].holo : RQ_HOLO[g]; if (!pal) return;
  const mode = window.RQH || 'line', n = pal.length, md = (a, b) => ((a % b) + b) % b;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x, c = P[i]; if (!c) continue;
    const th = (BAY4D[(y & 3) * 4 + (x & 3)] + 0.5) / 16, im = M && M[i] ? 0.6 : 1;
    let s = 0, hc;
    if (mode === 'line') {
      const bands = [-6 + t * 6]; if (g >= 5) bands.push(-6 + t * 6 - 30);
      for (const bc of bands) { const d = Math.abs(x + y - bc); if (d <= 1) s = Math.max(s, 0.62); else if (d <= 3) s = Math.max(s, 0.3); }
      if (!s) continue; P[i] = rqMix(c, pal[md(((x - y) >> 2) + t, n)], s); continue;
    }
    if (mode === 'wave') {   // 좁은 빛 띠가 칸 전체에 12칸마다, 모두 함께 오른쪽 아래로
      const u = md(x + y - t, 12); hc = pal[md(Math.floor((x + y - t) / 12), n)];
      s = u < 2 ? 0.55 : u < 4 || u >= 11 ? 0.32 : (th < 0.5 ? 0.18 : 0.1);
    } else if (mode === 'flow') {   // 칸 전체가 레어도 색 띠로 물들어 흐른다 (한 바퀴 26칸)
      const v = md(x + y - Math.round(t * 26 / 12), 26) / 26, f = v * n, k = Math.floor(f), fr = f - k;
      hc = pal[fr > 0.75 && th < (fr - 0.75) * 4 ? (k + 1) % n : k]; s = v < 0.12 ? 0.5 : 0.28;
    } else if (mode === 'sheen') {   // 넓은 빛 덩어리가 칸 대각선을 지나간다 (가장자리는 바둑 무늬로 옅게)
      const d = Math.abs(x + y + 26 - t * 6.5); hc = pal[md(((x - y) >> 2) + t, n)];
      s = d < 4 ? 0.5 : d < 9 ? (th < 0.66 ? 0.36 : 0.22) : d < 15 ? (th < 0.4 ? 0.2 : 0.08) : 0.06;
    } else {   // foil: 밝은 칸일수록 더 반짝 (필름), 조금 가파른 결
      const w = md(x * 2 + y - t * 2, 24) / 24, lum = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255, lv = 0.12 + 0.5 * lum;
      hc = pal[Math.floor(w * n) % n]; s = lv > 0.45 ? 0.5 : lv > 0.3 ? (th < 0.5 ? 0.42 : 0.3) : (th < 0.5 ? 0.24 : 0.14);
    }
    P[i] = rqMix(c, hc, s * im);
  }
}
""" + s[j:]
(SB / R).write_text(s, encoding='utf-8')
sub(R, "key = (src || '') + '|' + g + '|' + pt;", "key = (src || '') + '|' + g + '|' + pt + '|' + rqOpt(g) + '|' + (window.RQH || 'line');")
sub(R, "    if (ic) for (const [px, py, col] of ic) { const X = px + 3, Y = py + 3; if (X >= 0 && Y >= 0 && X < N && Y < N) P[Y * N + X] = col; }\n    rqPlus(P, plus);\n    if (holo) rqHolo(P, g, t);",
       "    const M = new Uint8Array(N * N);\n    if (ic) for (const [px, py, col] of ic) { const X = px + 3, Y = py + 3; if (X >= 0 && Y >= 0 && X < N && Y < N) { P[Y * N + X] = col; M[Y * N + X] = 1; } }\n    rqPlus(P, plus);\n    if (holo) rqHolo(P, g, t, M);")
print('draft2 ok')
