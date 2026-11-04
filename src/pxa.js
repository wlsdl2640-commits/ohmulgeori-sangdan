/* ───────── 손 도트 (A안 디테일) ─────────
   글자 격자를 팔레트로 칠하고 검은 테두리를 두른다. 격자 한 칸 = 논리 1픽셀(전투 화면에서는 2×2).
   2등신 · 반짝이는 콩 눈 · 세 단계 명암. 같은 그림은 한 번만 굽는다. */
const PXO = '#1c1622';
const PXC = new Map();
const pxRgb = h => { if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]; const n = parseInt(h.slice(1, 7), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const pxRows = s => s.replace(/^\n+/, '').replace(/\s+$/, '').split('\n').map(r => r.split('|')[0].trim()).map(r => (r === '-' ? '' : r));
function pxCenter(rows, W) { return rows.map(r => { const l = (W - r.length) >> 1; return '.'.repeat(Math.max(0, l)) + r + '.'.repeat(Math.max(0, W - r.length - l)); }); }
function pxGrid(w, h) { return Array.from({ length: h }, () => new Array(w).fill('.')); }
// rows를 (x,y)에 덮는다. '.'·' ' 그대로 · '_' 지움 · '@' 손잡이(그 자리 글자는 alt)
function pxPut(g, rows, x, y, alt) {
  for (let j = 0; j < rows.length; j++) {
    const Y = y + j; if (Y < 0 || Y >= g.length) continue;
    const r = rows[j];
    for (let i = 0; i < r.length; i++) {
      let c = r[i]; if (c === '.' || c === ' ') continue;
      const X = x + i; if (X < 0 || X >= g[Y].length) continue;
      if (c === '@') c = alt || 'v';
      g[Y][X] = c === '_' ? '.' : c;
    }
  }
}
// 겹치되 이미 칠한 칸은 두기 (뒤에 오는 것)
function pxUnder(g, rows, x, y) {
  for (let j = 0; j < rows.length; j++) { const Y = y + j; if (Y < 0 || Y >= g.length) continue; const r = rows[j]; for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === '.' || c === ' ') continue; const X = x + i; if (X < 0 || X >= g[Y].length) continue; if (g[Y][X] === '.') g[Y][X] = c; } }
}
function pxFind(rows, ch) { for (let j = 0; j < rows.length; j++) { const i = rows[j].indexOf(ch); if (i >= 0) return [i, j]; } return null; }
const pxFlip = rows => rows.map(r => [...r].reverse().join(''));
// 시계 방향 90도 (세운 무기 → 오른쪽으로 뻗은 무기)
function pxRot(rows) { const H = rows.length, W = Math.max(...rows.map(r => r.length)), P = rows.map(r => r.padEnd(W, '.')), out = []; for (let i = 0; i < W; i++) { let r = ''; for (let j = 0; j < H; j++) r += P[H - 1 - j][i]; out.push(r); } return out; }

/* 색: 바탕에서 그늘·밝음·짙음을 만든다 (그늘은 푸른 쪽, 밝음은 노란 쪽으로 살짝) */
function pxHsl(hex) { const [r, g, b] = pxRgb(hex).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; } return [h, s, l]; }
function pxHex(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
  let r, g, b;
  if (!s) r = g = b = l;
  else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }; r = f(h + 1 / 3); g = f(h); b = f(h - 1 / 3); }
  return '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}
const pxTurn = (h, to, a) => { const d = ((to - h + 540) % 360) - 180; return h + Math.sign(d) * Math.min(Math.abs(d), a); };
const PXR = new Map();
function pxRamp(hex) {
  let r = PXR.get(hex); if (r) return r;
  const [h, s, l] = pxHsl(hex);
  r = { b: hex, s: pxHex(pxTurn(h, 250, 14), s * 1.04, l * 0.72), d: pxHex(pxTurn(h, 255, 24), s * 1.08, l * 0.5), l: pxHex(pxTurn(h, 50, 10), s * 0.92, l + (1 - l) * 0.32) };
  PXR.set(hex, r);
  return r;
}

/* 굽기: 격자 → 캔버스 (테두리 1칸). ax, ay = 발밑 기준점(격자 좌표) */
/* B4 손질 스위치: rim 가장자리 빛, line 부위 사이 선, tex 질감. null이면 끈다 */
let PX_FX = { rim: 0.28, line: 0.26, tex: 1 };
// 글자 → 재질 묶음 (1 = 얼굴·눈처럼 선을 긋지 않는 것)
const PX_MAT = { S: 2, s: 2, t: 2, k: 1, w: 1, p: 1, m: 1, H: 3, h: 3, L: 3, C: 4, c: 4, Q: 4, d: 4, M: 5, N: 5, n: 5, x: 5, G: 6, g: 6, o: 6, J: 7, j: 7, I: 7, A: 8, a: 8, F: 8, f: 8, W: 9, V: 9, U: 11, u: 11, B: 12, b: 12, R: 13, r: 13, X: 14, Z: 15, z: 15, K: 16, O: 17, v: 17, P: 18, q: 18 };
// 선을 긋는 큰 부위: 살·머리카락·천·쇠·모자·가죽·바지·장화·망토
const PX_LINE = { 2: 1, 3: 1, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1, 11: 1, 12: 1, 18: 1 };
/* 뭉툭 도트: 격자를 반으로 줄여 굽고 2배로 키운다 (픽셀이 굵어진다). 0이면 끈다 */
let PX_CHUNK = 2;
// 2×2 칸을 하나로. 눈·입·쇠·나무(무기)·금은 작아도 살린다
const PX_PRI = { k: 3.2, w: 3.0, p: 1.6, m: 1.6, x: 1.6, M: 1.35, N: 1.3, O: 1.4, v: 1.3, K: 1.25, G: 1.3, g: 1.2, X: 1.5, Z: 1.2, R: 1.15 };
function pxChunk(g) {
  const H = g.length, W = g[0].length, out = [];
  for (let y = 0; y < H; y += 2) {
    const row = [];
    for (let x = 0; x < W; x += 2) {
      const a = g[y][x], b = x + 1 < W ? g[y][x + 1] : '.', c = y + 1 < H ? g[y + 1][x] : '.', e = y + 1 < H && x + 1 < W ? g[y + 1][x + 1] : '.';
      let empty = 0; const cnt = {};
      for (const q of [a, b, c, e]) { if (q === '.') empty++; else cnt[q] = (cnt[q] || 0) + 1; }
      if (empty > 2) { row.push('.'); continue; }
      let best = '.', bs = 0;
      for (const q in cnt) { const v = cnt[q] * (PX_PRI[q] || 1); if (v > bs) { bs = v; best = q; } }
      row.push(best);
    }
    out.push(row);
  }
  return out;
}
function pxBake(key, g0, pal, ax, ay, pre) {
  const ch = PX_CHUNK && !(g0.pre || pre) ? PX_CHUNK : 0, k = key + '|' + (FLASH || '') + (PX_FX ? '|fx' : '') + (PX_CHUNK ? '|c' : '');
  let s = PXC.get(k);
  if (s) return s;
  // 뭉툭: 격자를 반으로 (이미 반 해상도로 그린 것(pre)은 그대로)
  const g = ch ? pxChunk(g0) : g0, sc = PX_CHUNK ? 2 : 1;
  if (ch) { ax /= 2; ay /= 2; }
  const H = g.length, W = g[0].length;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] !== '.') { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) { x0 = y0 = 0; x1 = y1 = 0; }
  const w = x1 - x0 + 3, h = y1 - y0 + 3, img = new ImageData(w, h), d = img.data, fl = FLASH ? pxRgb(FLASH) : null, ol = pxRgb(PXO);
  const set = (x, y, c) => { const i = (y * w + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; };
  const RGB = {}, FX = (g0.pre || pre) ? null : PX_FX;   // 반 해상도로 미리 손질한 그림은 그대로
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const c = g[y][x]; if (c === '.') continue;
    const hx = pal[c]; if (!hx) continue;
    let col = fl || RGB[c] || (RGB[c] = pxRgb(hx));
    if (FX && !fl) {
      // B4 손질: 왼쪽 위 가장자리 빛 · 부위 사이 어두운 선 · 쇠·가죽 질감
      const m = PX_MAT[c] || 0, up = y > 0 ? g[y - 1][x] : '.', lf = x > 0 ? g[y][x - 1] : '.';
      let f = 1;
      if (m > 1) {
        // 위·왼쪽에 다른 부위가 겹치면 그 밑은 그늘(맞닿은 그림자), 바깥이면 가장자리 빛
        const mu = PX_MAT[up] || 0, ml = PX_MAT[lf] || 0, big = PX_LINE[m];
        if (big && ((up !== '.' && mu > 1 && mu !== m && PX_LINE[mu]) || (lf !== '.' && ml > 1 && ml !== m && PX_LINE[ml]))) f *= 1 - FX.line;
        else if (up === '.' || lf === '.') f *= 1 + FX.rim;
        if (FX.tex && m === 5 && (x + y) % 2) f *= 0.92;
        if (FX.tex && m === 9 && x % 3 === 1 && y % 3 === 1) f *= 0.86;
      }
      if (f !== 1) col = [Math.min(255, Math.round(col[0] * f)), Math.min(255, Math.round(col[1] * f)), Math.min(255, Math.round(col[2] * f))];
    }
    set(x - x0 + 1, y - y0 + 1, col);
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (d[(y * w + x) * 4 + 3]) continue;
    const on = (xx, yy) => xx >= 0 && yy >= 0 && xx < w && yy < h && d[(yy * w + xx) * 4 + 3] === 255;
    if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) { const i = (y * w + x) * 4; const c = fl || ol; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 254; }
  }
  for (let i = 3; i < d.length; i += 4) if (d[i] === 254) d[i] = 255;
  let [cv, x] = mkCanvas(w, h);
  x.putImageData(img, 0, 0);
  if (sc > 1) { const [big, bx] = mkCanvas(w * sc, h * sc); bx.imageSmoothingEnabled = false; bx.drawImage(cv, 0, 0, w * sc, h * sc); cv = big; }
  s = { cv, ax: Math.round((ax - x0 + 1) * sc), ay: Math.round((ay - y0 + 1) * sc), w: w * sc, h: h * sc };
  PXC.set(k, s);
  if (PXC.size > 1400) PXC.delete(PXC.keys().next().value);
  return s;
}
const pxBlit = (ctx, s) => ctx.drawImage(s.cv, -s.ax, -s.ay);

/* ───────── 모험가 (전투 화면, 앞모습) ─────────
   몸 블록 16칸(가로) × 13줄, 머리 블록 16칸 × 12줄(얼굴은 6~11줄). 작업판 40×48, 몸 블록 왼쪽 위 = (12, 34). */
const PXW = 40, PXH = 48, BX = 12, BY = 34, HY = BY - 12;
// 얼굴: 6줄 이마 · 7~8줄 눈 · 9줄 입 · 10줄 턱 · 11줄 턱끝. 양옆(1·14칸)은 머리카락이나 모자
const PX_FACE = pxRows(`
..sSSSSSSSSSSs..
..SSwkSSSSwkSs..
..SSkkSSSSkkSs..
..pSSSSmmSSSSp..
..sSSSSSSSSSSs..
....ssSSSSss....
`);
const PX_HAIR = {
  short: pxRows(`
.....HHHHHH.....
...HHHHHHHHHh...
..HHLLHHHHHHHh..
.HHLHHHHHHHHHhh.
.HLHHHHHHHHHHHh.
.HHHSHHSSHHSHHh.
.H............h.
.H............h.
.h............h.
.h............h.
`),
  long: pxRows(`
.....HHHHHH.....
...HHHHHHHHHh...
..HHLLHHHHHHHh..
.HHLHHHHHHHHHhh.
.HLHHHHHHHHHHHh.
.HHHSHHSSHHSHHh.
HH............hh
HH............hh
Hh............hh
Hh............hh
Hh............hh
.h............h.
`),
  spiky: pxRows(`
....H..H..H.....
...HHHHHHHHHh...
..HHLLHHHHHHHh..
.HHLHHHHHHHHHhh.
HHLHHHHHHHHHHHhh
.HHHSHHSSHHSHHh.
.H............h.
.H............h.
.h............h.
.h............h.
`)
};
/* 머리 장식: top = 머리 블록 0줄 위로 몇 줄, x = 머리 블록 왼쪽에서 얼마나 (넓은 챙은 음수)
   J/j/I 장식 색 · G/g/o 금 · M/N/n/x 쇠 · F/f 셋째 색 · R/r 깃털·망토 · K 짙은 천 */
const PX_HEAD = {
  helm: { top: 3, g: `
.......RR.......
......RRrr......
.....NMRrrN.....
...NMxMMMMMNn...
..NMxMMMMMMMNn..
.NMxMMMMMMMMMNn.
.NMMMMMMMMMMMNn.
.gGoGGGGGGGGoGg.
.N............n.
.N............n.
.N............n.
.n............n.
.n............n.
` },
  hood: { top: 1, g: `
......JJJJ......
....JJIJJJjj....
..JJIJJJJJJJjj..
.JJIJJJJJJJJJjj.
.JIJJJJJJJJJJJj.
.JJJJJJJJJJJJjj.
.J............j.
.J............j.
.J............j.
.j............j.
.j............j.
.JJ..........jj.
..JJJ......jjj..
` },
  hoodup: { top: 2, g: `
.......JJ.......
.....JJJJjj.....
...JJIJJJJJjj...
..JIJJJJJJJJJj..
.JIJJJJJJJJJJjj.
.JJJJJJJJJJJJJj.
JJJJKKKKKKKKjjjj
JJK..........Kjj
JJ............jj
JJ............jj
Jj............jj
jj............jj
JJj..........jjj
.JJJj......jjjj.
` },
  wizard: { top: 9, x: -2, g: `
...........Jj.......
..........JJj.......
..........JJJj......
.........JJIJj......
.........JIJJJj.....
........JJIJJJjj....
.......JJIJJJJJjj...
......JJJJJJGJJJjj..
.....JJJJJJGGGJJJjj.
....JJJJJJJJGJJJJJj.
...JJJJJJJJJJJJJJJjj
..GGGGGGGGGGGGGGGGG.
JJJJJJJJJJJJJJJJJJJj
.jjjjjjjjjjjjjjjjjj.
` },
  coif: { top: 2, g: `
......ZZZZ......
....ZZZZZZzz....
..ZZZZZZZZZZzz..
.ZZZZZZGZZZZZzz.
.ZZZZZGGGZZZZzz.
.ZZZZZZGZZZZZzz.
.ZZGGGGGGGGGGzz.
.Z............z.
.Z............z.
.Z............z.
.z............z.
.z............z.
.ZZ..........zz.
..ZZZZ....zzzz..
` },
  mitre: { top: 6, g: `
.......ZZ.......
......ZZzz......
.....ZZGZzz.....
....ZZGGGZzz....
....ZZZGZZzz....
...ZZZZGZZZzz...
...ZZZZGZZZzz...
..GGGGGGGGGGGg..
..ZZZZZZZZZZzz..
.Z............z.
` },
  mitre2: { top: 8, g: `
.......GG.......
......ZGGz......
.....ZZGZzz.....
....ZZGGGZzz....
...ZZZZGZZZzz...
...ZZGGGGGZzz...
..ZZZZZGZZZZzz..
..ZZZZZGZZZZzz..
..GGXGGGGGXGGg..
..GGGGGGGGGGGg..
..ZZZZZZZZZZzz..
.Z............z.
` },
  coif2: { top: 2, g: `
......KKKK......
....KKKKKKKK....
..KKKKKKKKKKKK..
.KKKKKKKKKKKKKK.
.KKKKKKKKKKKKKK.
.KKZZZZZZZZZZKK.
.KZZ........ZZK.
.KZ..........ZK.
.KZ..........ZK.
.KZ..........ZK.
KKZ..........ZKK
KKZ..........ZKK
KKZZ........ZZKK
KKKZZZZ..ZZZZKKK
KKK..........KKK
` },
  cowl: { top: 1, g: `
......JJJJ......
....JJJJJJjj....
...JJIJJJJJJjj..
..JIIJJJJJJJjj..
.JIJJJJJJJJJJjj.
.FFFFFFFFFFFFff.
.JFFfJJJJJJJJjj.
.J............j.
.J............j.
.j............j.
.jKKKKKKKKKKKKj.
..KKKKKKKKKKKK..
....KKKKKKKK....
` },
  band: { top: 0, g: `
................
................
................
................
.FFFFFFFFFFFFff.
F.............fF
F...............
` },
  glad: { top: 4, g: `
.......RR.......
......RRRr......
.....RRRRrr.....
......RRrr......
....GGGGGGgg....
..GGoGGGGGGGgg..
.GGoGGGGGGGGGgg.
.GGGGGGGGGGGGgg.
.gGGGGGGGGGGGgg.
.g............g.
.G............g.
.G............g.
.g............g.
.g............g.
` },
  laurel: { top: 0, g: `
................
................
................
..GG..G..G..GG..
.GGGGGGGGGGGGGg.
G..............g
` },
  great: { top: 3, g: `
......RRrr......
.....RRRRrr.....
....RRrrRRr.....
...NMMMMMMMNn...
..NMxMMMMMMMNn..
.NMxMMMMMMMMMNn.
.NMxMMMMMMMMMNn.
.NMMMMMMMMMMMNn.
.NMMMMMMGMMMMNn.
.NKKwwKKGKKwwNn.
.NKKwwKKGKKwwNn.
.NMMMMMMGMMMMNn.
.NMMMNNNGNNNMNn.
.nNNNNNNNNNNNnn.
..nNNNNNNNNNNn..
....nnnnnnnn....
` },
  winged: { top: 3, g: `
x..............x
Mx...........xMN
MMx..NMMMMN..xMN
NMMNMxMMMMMNNMNn
.NMxMMMMMMMMMNn.
.NMxMMMMMMMMMNn.
.NMMMMMMMMMMMNn.
.GGGGGGXGGGGGGg.
.N............n.
.N............n.
.N............n.
.n............n.
.n............n.
` },
  horn: { top: 4, g: `
x..............x
Zx............xz
.Zx..........xz.
.ZZ..........zz.
.ZZNMMMMMMMMNzz.
..ZMxMMMMMMMNz..
.NMxMMMMMMMMMNn.
.NMMMMMMMMMMMNn.
.gGGoGGGGGoGGgg.
.N............n.
.N............n.
.n............n.
` },
  dragon: { top: 4, g: `
..X...........X.
.XX....NN....XX.
.X....NMMN....X.
.XX.NMMxMMMN.XX.
..NMMxMMMMMMMN..
.NMMxMMMMMMMMNn.
.NMxMMMMMMMMMNn.
.NMMMMMMMMMMMNn.
.nNXNNNNNNNXNnn.
.N............n.
.N............n.
.n............n.
.n............n.
` },
  goggles: { top: 0, g: `
................
................
................
................
.KKXZKKKKKXZKKK.
.K.XX.....XX..K.
` },
  feather: { top: 4, g: `
..........RR....
.........RRr....
........RRr.....
.......RRr......
...JJJJJJJJjj...
..JJIIJJJJJJjj..
.JJIJJJJJJJJJjj.
JJJJJJJJJJJJJJjj
.jjjjjjjjjjjjjj.
` },
  beret: { top: 2, g: `
.........RR.....
..JJJJJJJJRr....
.JJIJJJJJJJJjj..
JJIJJJJJJJJJJjj.
JJJJJJJJJJJJJJj.
.jjjjjjjjjjjjj..
` },
  circlet: { top: 0, g: `
................
................
................
................
.GGGGGGXGGGGGGg.
.......X........
` },
  crown: { top: 3, g: `
..G...GX G...G..
..GG.GXXXG..GG..
..GGGGGXGGGGGg..
..GXGGGGGGGXGg..
..GGGGGGGGGGGg..
..oooooooooooo..
` },
  bonecrown: { top: 3, g: `
..Z...Z..Z...Z..
..ZZ.ZZ..ZZ.ZZ..
..ZXZZZXXZZZXZ..
..zZZZZZZZZZZz..
` },
  tophat: { top: 7, x: -1, g: `
....JJJJJJJJJ.....
....JJIJJJJJJJ....
....JJIJJJJJJJ....
....JIJJJJJJJJ....
....JJJJJJJJJJ....
....FFFFFFFFFF....
....JJJJJJJJJJ....
.JJJJJJJJJJJJJJJJ.
..jjjjjjjjjjjjjj..
` },
  widebrim: { top: 4, x: -3, g: `
........JJJJJJJ.......
.......JJIJJJJJJ......
.......JIJJJJJJJ......
.......FFFFFFFFF......
JJJJJJJJJJJJJJJJJJJJJJ
.jjjjjjjjjjjjjjjjjjjj.
` },
  beak: { top: 5, x: -2, g: `
.......JJJJJJ.......
......JJIJJJJJ......
......JIJJJJJJ......
......JJJJJJJJ......
.....JFFFFFFFFJ.....
JJJJJJJJJJJJJJJJJJJJ
.jjjjjjjjjjjjjjjjjj.
...J.zZZZZZZZZz.J...
...JzZZZZZZZZZZzJ...
...JZKKZZZZZKKZzJ...
...JZKXZZZZZKXZzJ...
...JzZZZZZZZZZZzJ...
...JJzZZZzzZZZzJJ...
....JJJzZZZZzJJJ....
......JJzZZzJJ......
........zzz.........
` },
  monocle: { top: 0, g: `
................
................
................
................
................
................
................
..........GGG...
..........GXG...
..........GGG...
...........G....
` },
  mask: { top: 0, g: `
................
................
................
................
................
................
..KKKKKKKKKKKK..
..KKwkKKKKwkKK..
...KkkK..KkkK...
` },
  bones: { top: 0, g: `
................
................
................
................
................
................
..zZZZZZZZZZZz..
..ZKKXZZZZKKXz..
..ZKKKZZZZKKKz..
..zZZZZKKZZZZz..
..zZKZKZZKZKZz..
....zZZZZZZz....
` },
  pumpkin: { top: 2, g: `
.......AA.......
......jJAa......
....jJJIJJJJJj..
..jJJIJJJIJJJJj.
.jJJIJJJJIJJJJjj
.JJIJKKJJIJKKJjj
.JJIJKKKJIJKKKjj
.JJIJJJJJIJJJJjj
.JJIKJJKJKJJKJjj
.jJJKKKKKKKKKKjj
.jJJJKJJKJKJJjj.
..jJJJJIJJJJjj..
...jjJJJJJJjj...
.....jjjjjj.....
` },
  paint: { top: 0, g: `
................
................
................
................
................
................
................
................
................
..FF........FF..
` }
};

/* 몸: 16칸 × 13줄. 0줄 어깨 · 1~4 가슴과 팔 · 5~6 손과 허리띠 · 7 치맛단 · 8~10 다리 · 11~12 장화
   C/c/Q/d 옷 · A/a 장식 · F/f 셋째 색 · M/N/n/x 쇠 · W/V 가죽 · U/u 바지 · B/b 장화 · S/s 손 */
const PX_BODY = {
  tunic: `
.ccCCCQQCCCCCcc.
.CCdCQQCCCCCdCc.
.CCdCQCCCCCCdCc.
.SSdCCCCCCCCdSs.
.SSdCCCCCCCcdSs.
.SSWWWWGGWWWWSs.
.ssCCCQCCCCCCss.
...CCCCCCCCCc...
`,
  leather: `
.ccCCCQQCCCCCcc.
.CCdWWQCCCCWdCc.
.CCdWVWCCCWVdCc.
.WWdWVVWWWVVdWW.
.WWdWVVVVVVVdWW.
.SSWWWWGGWWWWSs.
.ssCCCQCCCCCCss.
...CCCCCCCCCc...
`,
  chain: `
.nNNNNxNNNNNNnn.
.NNnNxNNNNNNnNn.
.NxnNNNNxNNNnNn.
.NNnNNxNNNNNnNn.
.NxnNNNNNNxNnNn.
.SSWWWWGGWWWWSs.
.ssNNxNNNNxNNss.
...nNNNNNNNNn...
`,
  plate: `
.NMMMxMMMMMMMNn.
.MMnMxMMMMMNnMN.
.MxnMxMMMMMNnMN.
.MMnNMMMMMMNnMN.
.NNnnNNNNNNnnNn.
.SSGGGGGGGGGGSs.
.ssMxMMNNMMMNss.
...NMNnNNnNMN...
`,
  scale: `
.ccCCQCCCCQCCcc.
.CCdQCCQCCCCdCc.
.CQdCCQCCQCCdQc.
.CCdQCCCQCCCdCc.
.CQdCCQCCCQCdQc.
.SSGGGGGGGGGGSs.
.ssCQCCCQCCCCss.
...cCCcCCcCCc...
`,
  robe: `
.cCCCQAACCCCCc..
CCCdCQAACCCCdCc.
CCCdQCAACCCCdCc.
CCCdCCAACCCCdCc.
SSCdCCAACCCCdCS.
SsCCCCAACCCCCcs.
.cCCCCAACCCCCc..
.CCCCCAACCCCCc..
`,
  coat: `
.CCCAAQQAACCCcc.
.CCdCAQQACCCdCc.
.CCdCCAACCCCdCc.
.CCdCCAACCCCdCc.
.CCdCCAACCCCdCc.
.SSCWWWGGWWWCSs.
.ssCCCAACCCCCss.
..CC.CAAC..CCc..
`,
  bare: `
.sSSSSSSSSSSSss.
.SSsSWSSSSSWsSs.
.SSsSSWSSSWSsSs.
.SSsSSSWWWSSsSs.
.FFsSSSSSSSSsFF.
.SSWWWWGGWWWWSs.
.ssCCCCCCCCCCss.
...CCCCCCCCCc...
`
};
// 다리: 13줄 중 8~12줄. 서기·걷기 둘·앉기
const PX_LEGS = {
  stand: `
....UUu..UUu....
....UUu..UUu....
....UUu..UUu....
...BBBb..BBBb...
..BBBBb..BBBBb..
`,
  walkA: `
....UUu..UUu....
....UUu..UUu....
...BBBb..UUu....
..BBBBb..BBBb...
.........BBBBb..
`,
  walkB: `
....UUu..UUu....
....UUu..UUu....
....UUu..BBBb...
...BBBb..BBBBb..
..BBBBb.........
`,
  sit: `
..UUUUUUUUUUUu..
.BBBb......BBBb.
`,
  robe: `
...CCCCCCCCCc...
...CCCCCCCCCc...
..cCCCCCCCCCcc..
..cCcCCCCcCCcc..
....BBb..BBb....
`,
  robeA: `
...CCCCCCCCCc...
...CCCCCCCCCc...
..cCCCCCCCCCcc..
..cCcCCCCcCCcc..
...BBb.....Bb...
`,
  robeB: `
...CCCCCCCCCc...
...CCCCCCCCCc...
..cCCCCCCCCCcc..
..cCcCCCCcCCcc..
....Bb....BBb...
`,
  robeSit: `
.cCCCCCCCCCCCcc.
.BBb........BBb.
`,
  coat: `
..CUUu..UUuCc...
..CUUu..UUuCc...
...UUu..UUu.....
...BBBb..BBBb...
..BBBBb..BBBBb..
`
};
// 팔 자세 (오른팔, 몸 블록 좌표 기준 덮개). 지울 칸은 '_'
const PX_ARM = {
  // 오른팔을 머리 옆으로 들기 (손 = 15~16칸, -7~-6줄)
  up: { x: 13, y: -8, g: `
..SS
..Ss
..CC
..CC
..Cc
..Cc
..Cc
..Cc
CCCc
__Cc
__..
__..
__..
__..
__..
` },
  // 오른팔을 옆으로 뻗기 (손 = 18~19칸, 1~2줄)
  out: { x: 13, y: 0, g: `
CCcCCCSS
CCccccSs
__..
__..
__..
__..
__..
` }
};
// 손 위치 (몸 블록 좌표): 무기의 '@'가 여기에 온다
const PX_HAND = { rest: [16, 5], up: [17, -8], out: [23, 1], left: [-1, 5] };

/* 무기: '@' = 손잡이 (손 옆). up = 세워 들기, sw = 휘두르기(오른쪽 아래로 비스듬히) */
const PX_WPN = {
  sword: `
.x
xM
xM
xM
xM
xN
xN
xN
xN
GGGG
.@.
.v.
.G.
`,
  great: `
.x.
xMN
xMN
xMN
xMN
xMN
xMN
xMN
xMN
xMN
xMN
xNN
GGGGG
.@.
.v.
.v.
.G.
`,
  axe: `
..xMM.
.xMMMN
xMMNNn
.vMNn.
.v....
.v....
.v....
.v....
.@....
.v....
.v....
`,
  gaxe: `
...M...
.xMMxM.
xMMvMMN
xMNvNMN
.MNvNN.
...v...
...v...
...v...
...v...
...@...
...v...
...v...
`,
  club: `
.OO.
OOOv
OOOv
.Ov.
.Ov.
.v..
.@..
.v..
`,
  mace: `
.x.x.
xMMMN
MMxMN
NMMNn
.n.n.
..v..
..v..
..v..
..@..
..v..
`,
  hammer: `
xMMMMN
MMxMNn
NNNNnn
..v...
..v...
..v...
..v...
..@...
..v...
`,
  dagger: `
.x
xM
xN
xN
GGG
.@.
`,
  staff: `
.xXx.
xXZXx
.XXX.
.GGG.
..v..
..v..
..v..
..v..
..v..
..v..
..v..
..@..
..v..
..v..
..v..
..v..
`,
  skull: `
.zZZz.
ZZZZZz
ZKXZKz
.ZZZZ.
..vv..
..v...
..v...
..v...
..v...
..v...
..v...
..@...
..v...
..v...
..v...
`,
  crozier: `
.GGGg.
Gg..Gg
G...Gg
....Gg
...GG.
...Gg.
...G..
...G..
...G..
...G..
...G..
...G..
...@..
...G..
...G..
...G..
`,
  lance: `
..x..
.xMN.
.xMN.
..N..
..NAa
..vAa
..vA.
..v..
..v..
..v..
..v..
..v..
..v..
..@..
..v..
..v..
..v..
..v..
`,
  lute: `
vv............
.vvv..........
..vvv.........
...vvv........
....vvv.......
.....vvvvvv...
.....vZZZZZZv.
....vZZZZZZZZv
....vZZKKZZZZv
....vZZK@KZZZv
....vZZZKZZZZv
.....vZZZZZZv.
......vvvvvv..
`
};
// 활: 왼손(몸 블록 0칸, 5줄)에 세워 든다. draw = 시위를 당긴 모습
const PX_BOW = {
  bow: { x: -4, y: -4, g: `
..O.
.O..
.Ow.
O.w.
O.w.
O.w.
O.w.
O.w.
OOSS
O.w.
O.w.
O.w.
.Ow.
.O..
..O.
`, draw: `
..O....
.O.....
.O.w...
O...w..
O....wR
O....wR
O...w..
O..w...
OOSS...
O..w...
O.w....
O.w....
.Ow....
.O.....
..O....
` },
  long: { x: -4, y: -6, g: `
..GO.
.GO..
.O...
O.w..
O.w..
O.w..
O.w..
O.w..
O.w..
O.w..
OOSS.
O.w..
O.w..
O.w..
O.w..
O.w..
.O...
.GO..
..GO.
`, draw: `
..GO....
.GO.....
.O.w....
O...w...
O....w..
O.....wR
O.....wR
O....w..
O...w...
O..w....
OOSS....
O..w....
O..w....
O.w.....
O.w.....
O.w.....
.O......
.GO.....
..GO....
` }
};
// 방패: 왼손에
const PX_SHIELD = {
  round: { x: -4, y: 0, g: `
..NNN..
.NOOOvN
NOOGOvvN
NOGGGvvN
NOOGOvvN
.NOvvvN
..NNN..
` },
  kite: { x: -4, y: -1, g: `
.NNNNN.
NFFGFFN
NFGGGfN
NFFGFfN
NFFGFfN
.NFGfN.
.NFfN..
..NN...
` },
  tower: { x: -5, y: -3, g: `
NNNNNNN
NZZGZZN
NZZGZzN
NGGGGGN
NZZGZzN
NZZGZzN
NZZGZzN
NZZGZzN
NZzGzzN
.NNNNN.
` }
};
// 덧붙이는 것 (몸 블록 좌표). under = 몸 뒤에
const PX_EX = {
  pauldron: { x: -1, y: -1, g: `
.NMMN........NMMN.
NMxMMN......NMMNNn
NMMNNn......nNNNnn
.nnn..........nnn.
` },
  fur: { x: -1, y: -1, g: `
.WWWWW......WWWWW.
WWWWVWW....WWVWWVV
WVWVWVWWWWWWVWVWVV
.V.V.V......V.V.V.
` },
  spike: { x: -1, y: -3, g: `
.x..............x.
.Nx............xN.
.NMMN........NMMN.
NMxMMN......NMMNNn
NMMNNn......nNNNnn
.nnn..........nnn.
` },
  tabard: { x: 5, y: 0, g: `
CCCCCC
CQAAQc
CQAACc
CCAACc
CCCCCc
......
CCCCCc
CQCCCc
.CCCc.
` },
  holy: { x: 6, y: 1, g: `
.GG.
GGGG
.GG.
.GG.
` },
  stole: { x: 4, y: 0, g: `
FF....FF
Ff....Ff
Ff....Ff
Ff....Ff
Ff....Ff
Ff....Ff
Ff....Ff
GG....GG
` },
  sash: { x: 3, y: 0, g: `
AA........
AaA.......
.AaA......
..AaA.....
...AaA....
....AaA...
` },
  scarf: { x: 2, y: -1, g: `
.FFFFFFFFFFf.
.FFfFFFFFFff..
...........Ff.
...........Ff.
............f.
` },
  quiver: { under: 1, x: 12, y: -5, g: `
.w.w.
wRwR.
.W.W.
.WWV.
.WWV.
.WWV.
..WV.
..WV.
` },
  pack: { under: 1, x: -3, y: -19, g: `
...FFFFFFFFFFFFFFFf...
..FFfFFfFFfFFfFFfFff..
..FffffffffffffffffF..
...ffffffffffffffff...
..WWWWWWWWWWWWWWWWWV..
.WWVVVVVVVVVVVVVVVVVV.
.WWWWWWWWWGGWWWWWWWVV.
.WWWWWWWWWWWWWWWWWWVV.
.WWWWWWWWWWWWWWWWWWVV.
.WWWWWWWWWWWWWWWWWWVV.
.WWWWWWWWWWWWWWWWWWVV.
.WWWWWWWWWWWWWWWWWWVV.
.WWWWWWWWWWWWWWWWWWVV.
WWWVWWWWWWWWWWWWWWVWVV
WWWVWWWWWWWWWWWWWWVWVV
WWWVWWWWWWWWWWWWWWVWVV
WWWVWWWWWWWWWWWWWWVWVV
WWGVWWWWWWWWWWWWWWVGVV
WWWVWWWWWWWWWWWWWWVWVV
WWWVWWWWWWWWWWWWWWVWVV
.VVVWWWWWWWWWWWWWWVVV.
...VVVVVVVVVVVVVVVV...
` },
  cape: { under: 1, x: -1, y: 0, g: `
.RRRRRRRRRRRRRRr.
RRRRRRRRRRRRRRRrr
RRRRRRRRRRRRRRRrr
RRr...........Rrr
RRr...........Rrr
RRr...........Rrr
RRr...........Rrr
RRr...........Rrr
RRr...........Rrr
RRr...........Rrr
RRrrrr.....rrRrrr
.rrrr.......rrrr.
` },
  manica: { x: 0, y: 1, g: `
MN
xN
MN
` },
  book: { x: 3, y: 6, g: `
FFF
FZF
FFF
` },
  bag: { x: -3, y: 5, g: `
.WW.
WVVW
WGWW
WWWV
` },
  wisp: { x: -2, y: -9, g: `
.X..............X.
XZX............XZX
.X..............X.
` },
  stars: { under: 1, x: 0, y: 2, g: `
.x............x.
................
..............x.
x...............
..........x.....
` },
  sachet: { x: 11, y: 6, g: `
WW
VW
` }
};

/* 직업 차림: head 머리 장식 · body 옷 · hair 머리 모양(없으면 모험가마다) · ex 덧붙이기
   c1 옷 · c2 장식 · c3 셋째 · hc 머리 장식 색 · metal · cape · gem · eyes 눈빛 · skin 피부 · pants · boots */
const PXL = {
  warrior:     { head: 'helm', body: 'chain', ex: ['pauldron', 'tabard'], c1: '#c8403a', c2: '#f2c444', pants: '#5c606c', boots: '#6a4428' },
  archer:      { head: 'hood', body: 'leather', ex: ['quiver'], c1: '#5ea852', c2: '#f2c444', hc: '#4c8e4a', feather: '#e84040', pants: '#6c5642' },
  mage:        { head: 'wizard', body: 'robe', c1: '#6c4ab4', c2: '#f2c444', hc: '#5c3c9e', gem: '#8ae8ff', hair: 'long', hairc: '#d8d8ea', boots: '#3a2a4a' },
  cleric:      { head: 'coif', body: 'robe', ex: ['holy'], c1: '#f2eee2', c2: '#3a6ac8', hc: '#f8f4ec', boots: '#8a6a4a' },
  rogue:       { head: 'cowl', body: 'leather', c1: '#4c4660', c2: '#8a6040', c3: '#d23c3c', hc: '#3c3448', pants: '#3c3646', boots: '#2c2632', leather: '#5a4434' },
  porter:      { head: 'band', body: 'tunic', ex: ['pack'], c1: '#d2a868', leather: '#7a5232', c2: '#c9a04a', c3: '#c0392b', pants: '#5a4630', boots: '#6a4428', hair: 'spiky' },
  gladiator:   { head: 'glad', body: 'bare', shield: 'round', ex: ['manica'], c1: '#a8432f', c2: '#7a5232', c3: '#7a5232', hc: '#c08a3a', gold: '#d8a040', feather: '#c0392b', boots: '#7a5232' },
  champion:    { head: 'laurel', body: 'plate', ex: ['pauldron', 'tabard', 'cape'], c1: '#c8322a', c2: '#f2c444', metal: '#e8c060', cape: '#b8322a', wv: 'great', gem: '#e8f8ff' },
  knight:      { head: 'great', body: 'plate', shield: 'kite', ex: ['pauldron', 'tabard'], c1: '#3a5aa8', c2: '#e8e4d8', c3: '#3a5aa8', feather: '#4a6ac8', boots: '#646a7a' },
  paladin:     { head: 'winged', body: 'plate', shield: 'tower', ex: ['pauldron', 'tabard', 'cape'], c1: '#f0ece0', c2: '#f2c444', metal: '#e8ecf4', cape: '#3a5aa8', gem: '#fff2a0', glow: '#fff2a0' },
  berserker:   { head: 'horn', body: 'bare', ex: ['fur', 'paint'], c1: '#5a4030', c2: '#8a6a4a', c3: '#c0392b', metal: '#8a8a92', wv: 'great', hc: '#e8e2d0', boots: '#5a4030' },
  bloodlord:   { head: 'horn', body: 'plate', ex: ['spike', 'cape'], c1: '#6a1a1a', c2: '#c0392b', metal: '#5a4a56', cape: '#6a1a1a', eyes: '#ff4a3a', wv: 'great', hc: '#e8e2d0' },
  ranger:      { head: 'hoodup', body: 'leather', ex: ['quiver', 'cape'], c1: '#4a6a3a', c2: '#c9a04a', hc: '#55663a', cape: '#55663a', pants: '#5a4a36' },
  dragoon:     { head: 'dragon', body: 'scale', ex: ['pauldron', 'cape'], c1: '#2f6a7a', c2: '#e8c060', metal: '#5a9aaa', cape: '#2a3a5a', gem: '#7ad8c8', pants: '#2a3a4a' },
  sniper:      { head: 'goggles', body: 'leather', ex: ['quiver', 'scarf'], c1: '#5a6a52', c2: '#c9a04a', c3: '#8a7a5a', gem: '#8ad8ff', wv: 'long', pants: '#4a4a3e' },
  hawkeye:     { head: 'feather', body: 'coat', ex: ['quiver', 'cape'], c1: '#f0ece0', c2: '#e8c060', hc: '#2f6a4a', feather: '#f0c24a', cape: '#c9a04a', wv: 'long', pants: '#5a4a36' },
  mhunter:     { head: 'horn', body: 'leather', ex: ['quiver', 'fur', 'scarf'], c1: '#5a4a2a', c2: '#c8b080', c3: '#8a3a2a', hc: '#c8b890', metal: '#8a8a92', wv: 'long', pants: '#4a3a2a', boots: '#3a2a1a' },
  dslayer:     { head: 'dragon', body: 'plate', ex: ['pauldron', 'cape', 'quiver', 'spike'], c1: '#3a2a2a', c2: '#e05a3a', c3: '#e05a3a', metal: '#5a4a56', cape: '#6a1a1a', gem: '#ff8a3a', eyes: '#ff8a3a', wv: 'long', pants: '#2a1a1a' },
  bard:        { head: 'beret', body: 'coat', c1: '#c8322a', c2: '#f2c444', hc: '#4a3a8a', feather: '#4ab0e0', pants: '#4a3a6a', hair: 'long' },
  maestro:     { head: 'beret', body: 'coat', ex: ['cape'], c1: '#6a3a9a', c2: '#f2c444', hc: '#2a1a3a', feather: '#fff4b0', cape: '#2a1a3a', pants: '#2a2236', hair: 'long' },
  coachman:    { head: 'widebrim', body: 'coat', ex: ['scarf', 'pack'], c1: '#7a5232', c2: '#c9a04a', c3: '#a8432f', hc: '#4a3a2a', pants: '#4a3a2a', boots: '#3a2a1a' },
  caravanmaster: { head: 'tophat', body: 'coat', ex: ['cape', 'scarf', 'pack'], c1: '#2f5a3a', c2: '#e0c060', c3: '#e0c060', hc: '#1e2a1a', cape: '#6a3a2a', pants: '#2a2a2a', boots: '#2a1a1a' },
  scout:       { head: 'hoodup', body: 'leather', ex: ['quiver', 'pack', 'scarf'], c1: '#6a7a3a', c2: '#c9a04a', c3: '#8a6a3a', hc: '#4a5a2a', pants: '#5a4a36', boots: '#4a3a2a' },
  pathfinder:  { head: 'feather', body: 'coat', ex: ['quiver', 'pack', 'cape'], c1: '#c8a868', c2: '#8a3a2a', hc: '#5a3a2a', feather: '#e84040', cape: '#4a6a3a', wv: 'long', pants: '#4a3a2a' },
  assassin:    { head: 'cowl', body: 'leather', ex: ['scarf'], c1: '#2a2a36', c2: '#4a4458', c3: '#a82a2a', hc: '#22222c', pants: '#22222c', boots: '#1c1a22', twin: 1, eyes: '#c83a3a' },
  shadowlord:  { head: 'cowl', body: 'coat', ex: ['cape', 'wisp'], c1: '#262032', c2: '#7a4ab8', c3: '#7a4ab8', hc: '#1e1828', cape: '#2a1a3a', gem: '#c89aff', eyes: '#c89aff', twin: 1, pants: '#1e1828' },
  duelist:     { head: 'band', body: 'coat', ex: ['sash'], c1: '#2a4a8a', c2: '#e8e2d0', c3: '#c0392b', twin: 1, pants: '#2a2a3a', hair: 'spiky' },
  bladedancer: { head: 'circlet', body: 'coat', ex: ['sash', 'scarf'], c1: '#f0ece0', c2: '#3aa8a0', c3: '#3aa8a0', gem: '#3aa8a0', twin: 1, pants: '#2f6a6a', hair: 'long' },
  treasure:    { head: 'goggles', body: 'leather', ex: ['pack'], c1: '#8a6a44', c2: '#c9a04a', c3: '#a8432f', gem: '#f0c24a', pants: '#5a4630' },
  masterthief: { head: 'tophat', body: 'coat', ex: ['cape', 'mask'], c1: '#6a1a2a', c2: '#e0c060', c3: '#c0392b', hc: '#2a2632', cape: '#1e1828', pants: '#1e1828', boots: '#1e1a22' },
  elementalist: { head: 'circlet', body: 'robe', ex: ['sash'], c1: '#2f7a5a', c2: '#9ae0b0', gem: '#7ae0a0', hair: 'long' },
  elementlord: { head: 'crown', body: 'robe', ex: ['cape', 'stole'], c1: '#e8e4f0', c2: '#5ac8f0', c3: '#5ac8f0', cape: '#3a6a9a', gem: '#f0a040', hair: 'long' },
  necromancer: { head: 'hoodup', body: 'robe', c1: '#262032', c2: '#7a4ab8', hc: '#1e1828', skin: '#d8d0d8', gem: '#b88aff', wv: 'skull', eyes: '#9a6ad8' },
  lich:        { head: 'bonecrown', face: 'bones', body: 'robe', ex: ['cape', 'stole'], c1: '#2a1a3a', c2: '#a87ad8', c3: '#a87ad8', hc: '#e8e4dc', skin: '#e8e4dc', cape: '#1a1024', gem: '#c89aff', eyes: '#c89aff', wv: 'skull' },
  sorcerer:    { head: 'wizard', body: 'robe', ex: ['stole', 'stars'], c1: '#4a2a8a', c2: '#f0c24a', c3: '#f0c24a', hc: '#2a1a4a', gem: '#ff8ad8', glow: '#c89aff' },
  archmage:    { head: 'wizard', body: 'robe', ex: ['cape', 'stole', 'stars'], c1: '#1a1040', c2: '#ffd870', c3: '#ffd870', hc: '#120a30', cape: '#2a1050', gem: '#ffe0ff', glow: '#ffe0ff', hair: 'long' },
  spellblade:  { head: 'circlet', body: 'leather', ex: ['pauldron'], c1: '#3a4a7a', c2: '#8ab8ff', metal: '#a2b0cc', gem: '#8ab8ff', glow: '#8ab8ff' },
  arcblade:    { head: 'circlet', body: 'plate', ex: ['pauldron', 'cape', 'stars'], c1: '#1e2a4a', c2: '#c8d8ff', metal: '#5a6a9a', cape: '#141a3a', gem: '#fff4b0', glow: '#c8d8ff', hair: 'long' },
  priest:      { head: 'mitre', body: 'robe', ex: ['stole'], c1: '#f2eee2', c2: '#f2c444', c3: '#f2c444', gem: '#fff2a0' },
  archbishop:  { head: 'mitre2', body: 'robe', ex: ['cape', 'stole'], c1: '#f6eccc', c2: '#e0b040', c3: '#a8322a', cape: '#a8322a', gem: '#ff7a7a', wv: 'crozier' },
  plaguedoc:   { head: 'beak', body: 'coat', ex: ['bag'], c1: '#2a2830', c2: '#4a4650', hc: '#2a2830', gem: '#8ad8ff', pants: '#24222a', boots: '#1e1c22' },
  physician:   { head: 'monocle', body: 'coat', ex: ['bag'], c1: '#eceef2', c2: '#5a8ab8', gem: '#bfe8ff', pants: '#3a4a6a' },
  exorcist:    { head: 'coif2', body: 'robe', ex: ['book'], c1: '#2a2830', c2: '#e8e4d8', c3: '#a8322a', hc: '#2a2830', boots: '#2a2228' },
  inquisitor:  { head: 'widebrim', body: 'coat', ex: ['cape'], c1: '#8a1a1a', c2: '#e0c060', c3: '#e0c060', hc: '#1e1418', cape: '#1e1418', wv: 'hammer', pants: '#2a1a1a' }
};
// 무기 모양: 직업 차림(wv)이 바꾸기도 한다
function pxWeapon(cls, base) {
  const L = PXL[cls] || {}, w = L.wv;
  if (base === 'bow') return w === 'long' ? 'long' : 'bow';
  if (w === 'great') return base === 'axe' ? 'gaxe' : base === 'sword' ? 'great' : base;
  if (w === 'skull' && base === 'staff') return 'skull';
  if (w === 'crozier' && base === 'staff') return 'crozier';
  if (w === 'hammer' && base === 'mace') return 'hammer';
  return base;
}
// 팔레트: 직업 색 + 모험가 생김새
function pxPal(L, look) {
  const skin = L.skin || look.skin || SKINS[0], hair = look.hair || HAIRS[0];
  const R = pxRamp, sk = R(skin), hr = R(L.hairc || hair), c1 = R(L.c1 || '#8a8a8a'), c2 = R(L.c2 || '#c9a04a'), c3 = R(L.c3 || L.c2 || '#c9a04a');
  const mt = R(L.metal || '#b4bcc8'), gd = R(L.gold || '#f2c444'), hc = R(L.hc || L.c1 || '#8a8a8a'), cp = R(L.cape || L.c1 || '#8a3030');
  const lt = R(L.leather || '#7a5232'), pn = R(L.pants || '#5a5048'), bt = R(L.boots || '#5a3a24'), gm = R(L.gem || '#8ae8ff'), fe = R(L.feather || '#e84040');
  return {
    S: sk.b, s: sk.s, t: sk.d, k: L.eyes || '#2a1e2a', w: '#ffffff', p: '#f6a2a2', m: '#c4585a',
    H: hr.b, h: hr.s, L: hr.l,
    C: c1.b, c: c1.s, Q: c1.l, d: c1.d, A: c2.b, a: c2.s, F: c3.b, f: c3.s,
    M: mt.l, N: mt.b, n: mt.s, x: '#ffffff', G: gd.b, g: gd.s, o: gd.d,
    J: hc.b, j: hc.s, I: hc.l, R: fe.b, r: fe.s, W: lt.b, V: lt.s, U: pn.b, u: pn.s, B: bt.b, b: bt.s,
    X: gm.b, Z: '#f4f0e6', z: '#c4bca8', K: '#2a2632', O: '#b8864e', v: '#6a4428', P: cp.b, q: cp.s
  };
}
// 망토 색은 깃털 색과 따로: 망토 덮개는 P/q로 바꿔 칠한다
const PX_CAPE_KEYS = { R: 'P', r: 'q' };
function pxTone(rows, map) { return rows.map(r => [...r].map(c => map[c] || c).join('')); }

/* 모험가 한 장 만들기. pose: idle · walk · atk · sit · sleep */
function pxAdvGrid(a, pose, fr, Lx) {
  const cls = PXL[a.cls] ? a.cls : PXL[jobBase(a.cls)] ? jobBase(a.cls) : 'warrior', L = Lx || PXL[cls];
  const look = a.look || {}, ex = L.ex || [];
  const g = pxGrid(PXW, PXH);
  const robe = L.body === 'robe', coat = L.body === 'coat';
  // 무기와 왼손
  const wpn = a.eq && a.eq.weapon, base = wpn ? wpn.base : (typeof WEAPON_OF !== 'undefined' && WEAPON_OF[a.cls]) || 'sword';
  const wk = pxWeapon(a.cls, base), bow = wk === 'bow' || wk === 'long';
  const atk = pose === 'atk' ? fr % 2 : -1, sit = pose === 'sit';
  const arm = bow || wk === 'lute' ? 'rest' : atk === 0 ? 'up' : atk === 1 ? 'out' : 'rest';
  // 뒤에 오는 것 (망토·화살통·짐)
  for (const e of ex) { const E = PX_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), BX + E.x, BY + E.y); }
  // 몸 (다리 포함)
  const body = pxRows(PX_BODY[L.body] || PX_BODY.tunic);
  const legs = pxRows(PX_LEGS[sit ? (robe ? 'robeSit' : 'sit') : robe ? (pose === 'walk' ? ['robeA', 'robe', 'robeB', 'robe'][fr % 4] : 'robe') : pose === 'walk' ? ['walkA', 'stand', 'walkB', 'stand'][fr % 4] : coat ? 'coat' : 'stand']);
  const sitDrop = sit ? 3 : 0;
  pxPut(g, body.concat(legs), BX, BY + sitDrop);
  // 머리
  const hairRows = PX_HAIR[L.hair || ['short', 'long', 'spiky'][(a.id || 0) % 3]] || PX_HAIR.short;
  pxPut(g, hairRows, BX, HY + sitDrop);
  pxPut(g, PX_FACE, BX, HY + 6 + sitDrop);
  // 덧붙이기 (앞)
  for (const e of ex) { const E = PX_EX[e]; if (E && !E.under) { if (e === 'mask' || e === 'paint') continue; pxPut(g, pxRows(E.g), BX + E.x, BY + E.y + sitDrop); } }
  const H = PX_HEAD[L.head];
  if (L.face) { const F = PX_HEAD[L.face]; pxPut(g, pxRows(F.g), BX + (F.x || 0), HY - F.top + sitDrop); }
  for (const e of ['mask', 'paint']) if (ex.includes(e)) { const F = PX_HEAD[e]; pxPut(g, pxRows(F.g), BX, HY + sitDrop); }
  if (H) pxPut(g, pxRows(H.g), BX + (H.x || 0), HY - H.top + sitDrop);
  // 팔 자세
  if (arm !== 'rest') { const A = PX_ARM[arm]; pxPut(g, pxTone(pxRows(A.g), L.body === 'plate' || L.body === 'chain' ? { C: 'M', c: 'N' } : L.body === 'bare' ? { C: 'S', c: 's' } : {}), BX + A.x, BY + A.y + sitDrop); }
  // 방패 · 활 · 두 번째 칼
  if (L.shield && !sit) { const Sd = PX_SHIELD[L.shield]; pxPut(g, pxRows(Sd.g), BX + Sd.x, BY + 5 + Sd.y); }
  if (bow) { const B = PX_BOW[wk]; pxPut(g, pxRows(atk === 0 ? B.draw : B.g), BX + B.x, BY + B.y + sitDrop); }
  else if (wk === 'lute') { const W = pxRows(PX_WPN.lute), [ax, ay] = pxFind(W, '@'); pxPut(g, W, BX + 9 - ax, BY + 4 - ay + (atk === 1 ? 1 : 0) + sitDrop, 'K'); if (atk === 0) pxPut(g, ['SS', 'Ss'], BX + 10, BY + 3 + sitDrop); }
  else if (!sit) {
    const up = pxRows(PX_WPN[wk] || PX_WPN.sword), rows = arm === 'out' ? pxRot(up) : up, [ax, ay] = pxFind(rows, '@'), [hx, hy] = PX_HAND[arm];
    pxPut(g, rows, BX + hx - ax, BY + hy - ay, 'v');
    if (arm === 'rest') pxPut(g, ['S', 's'], BX + hx - 1, BY + hy);
    if (L.twin) { const D = pxFlip(pxRows(PX_WPN[wk === 'sword' || wk === 'great' ? 'sword' : 'dagger'])), [bx, by] = pxFind(D, '@'), [lx, ly] = PX_HAND.left; pxPut(g, D, BX + lx - bx, BY + ly - by, 'v'); pxPut(g, ['S', 's'], BX + lx + 1, BY + ly); }
  }
  // 숨쉬기·걷기: 위쪽을 한 칸 내린다
  const bob = (pose === 'idle' && fr % 2) || (pose === 'walk' && fr % 2 === 0);
  if (bob) for (let y = BY + 8 + sitDrop; y > 0; y--) g[y] = g[y - 1].slice(), y === 1 && (g[0] = new Array(PXW).fill('.'));
  return g;
}
// 자는 모습: 침낭 + 옆으로 누운 머리
function pxSleepGrid(a, Lx) {
  const L = Lx || advLook(a), g = pxGrid(PXW, PXH);
  pxPut(g, pxRows(`
.........................
..CCCCCCCCCCCCCCCcZZZZ...
.CCQQQCCCCQQQCCCCcZZZZz..
CCQCCCCCCCCCCCCCCcZZZZz..
CCCCCCCCCCCCCCCCCcZZZZz..
cCCCCCCCCCCCCCCCCcZzzzz..
.cccccccccccccccccc......
`), 7, 36);
  pxPut(g, pxRows(`
....HHHHH...
..HHLHHHHhh.
.HLHHHHHHHh.
.HHSSSSSHHh.
HHSSKKSSSSh.
HhSSSSSpSSh.
.hSSSSSSSs..
..ssSSSSs...
`), 21, 34);
  return g;
}
const PXK_POSE = { idle: 2, walk: 4, atk: 2, sit: 1, sleep: 1 };
/* 직업 도안 (전직하면 바뀐다) */
function advLook(a) { return PXL[a.cls] || PXL[jobBase(a.cls)] || PXL.warrior; }
function pxAdvSprite(a, pose, fr, Lx) {
  const look = a.look || {}, w = a.eq && a.eq.weapon, cls = PXL[a.cls] ? a.cls : 'warrior', L = Lx || advLook(a);
  const key = 'PA|' + (Lx ? JSON.stringify(Lx).length + (Lx.c1 || '') : '') + a.cls + '|' + (look.hair || '') + (look.skin || '') + '|' + ((a.id || 0) % 3) + '|' + (w ? w.base : '-') + '|' + pose + fr;
  const hit = PXC.get(key + '|' + (FLASH || ''));
  if (hit) return hit;
  const g = pose === 'sleep' ? pxSleepGrid(a, L) : pxAdvGrid(a, pose, fr, L);
  return pxBake(key, g, pxPal(L, look), BX + 8, BY + 13 + (pose === 'sleep' ? -2 : 0));
}
