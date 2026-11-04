/* ───────── 상단 본부: 비스듬한 입체로 본 층 ───────── */
// 한 번에 한 층을 잘라서 본다. 1층은 상점이자 본부, 위로는 연금술 공방·훈련소·신전·여관·마탑, 아래로는 대장간·은행 금고.
const TW = 20, TH = 10, GN = 9, WH = 56, SLAB = 6;
const HQ = { cvs: null, ctx: null, off: null, g: null, lc: null, l: null, W: 240, H: 400, cur: 'shop0', anim: null,
  cust: [], fx: [], hits: [], ox: 115, oy: 220, shells: new Map(), lastT: 0, browse: 0, keeperPay: 0, pending: [] };
const isoX = (tx, ty) => (tx - ty) * TW / 2, isoY = (tx, ty) => (tx + ty) * TH / 2;

const FLOOR_INFO = {
  shop:     { name: '상점 · 본부', win: 'inv' },
  alchemy:  { name: '연금술 공방', win: 'b:alchemy' },
  kitchen:  { name: '주방', win: 'b:kitchen' },
  training: { name: '훈련소', win: 'adv' },
  temple:   { name: '신전', win: 'b:temple' },
  inn:      { name: '여관', win: 'adv' },
  pen:      { name: '사육장', win: 'b:pen' },
  stable:   { name: '마구간', win: 'b:stable' },
  library:  { name: '도서관', win: 'b:library' },
  tower:    { name: '마탑', win: 'b:tower' },
  airfield: { name: '비행장', win: 'b:airfield' },
  smithy:   { name: '대장간', win: 'b:smithy', under: 1 },
  bank:     { name: '은행 금고', win: 'b:bank', under: 1 }
};
const ROOM_C = {
  shop:     { wall: '#d6ba90', wall2: '#bc9e74', base: '#6a4a2a', fl: ['#9e774a', '#916c42'], plank: 1 },
  inn:      { wall: '#dccaa6', wall2: '#c4ae88', base: '#5e4228', fl: ['#8a5e3a', '#7e5434'], plank: 1 },
  pen:      { wall: '#c8b890', wall2: '#ae9e76', base: '#6a5a3a', fl: ['#9a8a4a', '#8e7e42'] },
  stable:   { wall: '#b89a6a', wall2: '#9e8256', base: '#5a4228', fl: ['#8a6a3a', '#7e6034'], plank: 1 },
  library:  { wall: '#c8b494', wall2: '#ae9a7a', base: '#4a3220', fl: ['#6a4a2a', '#5e4224'], plank: 1 },
  airfield: { wall: '#9ab4cc', wall2: '#829cb4', base: '#3a4a5a', fl: ['#7a8a98', '#6e7e8c'], stone: 1 },
  temple:   { wall: '#e6e2d6', wall2: '#cdc8b8', base: '#8a8478', fl: ['#cac4b6', '#b8b2a4'] },
  training: { wall: '#c8a67c', wall2: '#ae8c64', base: '#5e4630', fl: ['#6e8e5c', '#628252'] },
  alchemy:  { wall: '#9cb696', wall2: '#86a080', base: '#465640', fl: ['#7c8272', '#707666'] },
  kitchen:  { wall: '#e0c8a0', wall2: '#c8ae86', base: '#6a4a2a', fl: ['#b8a07a', '#ac946e'], stone: 1 },
  tower:    { wall: '#5e4e80', wall2: '#4c3e6c', base: '#241c3a', fl: ['#6c5c8e', '#605082'] },
  smithy:   { wall: '#706458', wall2: '#5e544a', base: '#342c26', fl: ['#5c544c', '#524a42'], stone: 1 },
  bank:     { wall: '#7c7c88', wall2: '#686874', base: '#34343e', fl: ['#a4a4ae', '#94949e'], stone: 1 }
};
const SEATS = 6;   // 여관 한 층의 방 수

/* 층 목록 (위에서 아래로) */
function hqFloors() {
  const b = S.bld, up = [];
  if (b.alchemy) up.push({ id: 'alchemy' });
  if (b.kitchen) up.push({ id: 'kitchen' });
  if (b.training) up.push({ id: 'training' });
  if (b.temple) up.push({ id: 'temple' });
  const nInn = Math.max(1, Math.ceil(beds() / SEATS));
  for (let i = 0; i < nInn; i++) up.push({ id: 'inn', i });
  if (b.pen) up.push({ id: 'pen' });
  if (b.stable) up.push({ id: 'stable' });
  if (b.library) up.push({ id: 'library' });
  if (b.tower) up.push({ id: 'tower' });
  if (b.airfield) up.push({ id: 'airfield' });   // 비행장은 늘 맨 위
  const down = [];
  if (b.smithy) down.push({ id: 'smithy' });
  if (b.bank) down.push({ id: 'bank' });
  const out = [];
  for (let k = up.length - 1; k >= 0; k--) out.push(Object.assign(up[k], { label: (k + 2) + 'F', lv: k + 2 }));
  out.push({ id: 'shop', label: '1F', lv: 1 });
  down.forEach((f, k) => out.push(Object.assign(f, { label: 'B' + (k + 1), lv: -(k + 1), under: 1 })));
  out.forEach(f => { f.key = f.id + (f.i || 0); f.name = FLOOR_INFO[f.id].name + (f.id === 'inn' && nInn > 1 ? ' ' + (f.i + 1) : ''); f.top = f === out[0]; });
  return out;
}
const hqFloor = key => { const L = hqFloors(); return L.find(f => f.key === key) || L.find(f => f.id === 'shop'); };
function hqGo(key, quiet) {
  const L = hqFloors(), to = L.find(f => f.key === key);
  if (!to || to.key === HQ.cur) return;
  const from = hqFloor(HQ.cur);
  HQ.anim = quiet ? null : { from: from.key, to: to.key, t0: performance.now(), dir: to.lv > from.lv ? 1 : -1 };
  HQ.cur = to.key;
  HQ.cust = []; HQ.fx = [];
  if (HOOKS.floor) HOOKS.floor();
}
function hqStep(d) { const L = hqFloors(), i = L.findIndex(f => f.key === HQ.cur); const j = Math.max(0, Math.min(L.length - 1, i - d)); if (j !== i) hqGo(L[j].key); }

/* ───────── 그리기 도구 ───────── */
// 꼭짓점 목록을 줄 단위로 칠한다 (계단식 도트 경계)
function poly(g, pts, c) {
  let y0 = Infinity, y1 = -Infinity;
  for (const p of pts) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  y0 = Math.floor(y0); y1 = Math.ceil(y1);
  g.fillStyle = FLASH || c;
  for (let y = y0; y < y1; y++) {
    const yc = y + 0.5;
    let a = Infinity, b = -Infinity;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      if ((p[1] <= yc && q[1] > yc) || (q[1] <= yc && p[1] > yc)) { const x = p[0] + (yc - p[1]) / (q[1] - p[1]) * (q[0] - p[0]); if (x < a) a = x; if (x > b) b = x; }
    }
    if (b > a) { const xa = Math.round(a), xb = Math.round(b); if (xb > xa) g.fillRect(xa, y, xb - xa, 1); }
  }
}
// 바닥 (0,0)에서 본 상대 좌표: 타일 (dx,dy), 높이 z
const L = (dx, dy, z = 0) => [isoX(dx, dy), isoY(dx, dy) - z];
// 입체 상자: 위·왼쪽 앞·오른쪽 앞 세 면
function ibox(x, dx, dy, w, d, h, top, left, right, z = 0) {
  poly(x, [L(dx, dy + d, z), L(dx + w, dy + d, z), L(dx + w, dy + d, z + h), L(dx, dy + d, z + h)], left);
  poly(x, [L(dx + w, dy + d, z), L(dx + w, dy, z), L(dx + w, dy, z + h), L(dx + w, dy + d, z + h)], right);
  poly(x, [L(dx, dy, z + h), L(dx + w, dy, z + h), L(dx + w, dy + d, z + h), L(dx, dy + d, z + h)], top);
}
// 가구 하나를 구워 둔다: 기준점 = 그 가구가 놓인 타일 뒤 꼭짓점
function furnSprite(key, w, d, h, paint, plain) {
  const W = (w + d) * TW / 2 + 8, Hh = (w + d) * TH / 2 + h + 12;
  return bake('F|' + key, W, Hh, d * TW / 2 + 4, h + 8, paint, plain);
}
const scr = (tx, ty, z = 0) => [HQ.ox + isoX(tx, ty), HQ.oy + isoY(tx, ty) - z];
const blitAt = (g, s, x, y) => g.drawImage(s.cv, Math.round(x - s.ax), Math.round(y - s.ay));

/* ───────── 가구 ───────── */
const WOOD = ['#b08454', '#8a6238', '#6e4c2a'];
const F = {
  stand: x => { ibox(x, 0.1, 0.1, 0.8, 0.8, 7, '#c89a64', '#9a7040', '#7e5a32'); ibox(x, 0.15, 0.15, 0.7, 0.7, 1, '#e8dcb8', '#c8b890', '#b0a078', 7); },
  counter: x => { ibox(x, 0, 0, 3, 1, 11, '#c49660', '#94683a', '#7a5430'); ibox(x, -0.05, -0.05, 3.1, 1.1, 2, '#e0b878', '#a87c48', '#8a6238', 11); ibox(x, 2.2, 0.25, 0.5, 0.45, 3, '#d0b040', '#a08020', '#806010', 13); },
  crate: x => { ibox(x, 0.1, 0.1, 0.8, 0.8, 9, '#b08454', '#8a6238', '#6e4c2a'); poly(x, [L(0.1, 0.9, 4), L(0.9, 0.9, 4), L(0.9, 0.9, 5), L(0.1, 0.9, 5)], '#5e4028'); },
  barrel: x => { for (let i = 0; i < 10; i++) ell(x, 0, 5 - i, 5, 3, i % 4 === 1 ? '#5e4028' : i > 7 ? '#a07848' : '#8a6238'); ell(x, 0, -5, 4, 2, '#6a8aa8'); },
  plant: x => { ibox(x, 0.3, 0.3, 0.4, 0.4, 5, '#b05a3a', '#8a4428', '#6e3420'); for (const [px, py, r] of [[0, -9, 4], [-3, -12, 3], [3, -13, 3], [0, -16, 3]]) disc(x, px, py, r, '#4f8a43'); disc(x, -1, -13, 1, '#7ab05a'); },
  lamp: x => { R(x, -1, -22, 2, 20, '#3a3040'); R(x, -3, -26, 6, 5, '#f0c060'); R(x, -2, -25, 4, 3, '#fff2c0'); R(x, -3, -2, 6, 2, '#3a3040'); },
  bed: x => { ibox(x, 0.1, 0.05, 0.8, 1.9, 5, '#e8e2d0', '#a89a7a', '#8a7e64'); ibox(x, 0.15, 0.1, 0.7, 0.5, 2, '#ffffff', '#d8d0c0', '#c0b8a8', 5); ibox(x, 0.1, 0.7, 0.8, 1.3, 1, '#7a8ab8', '#5a6a98', '#4a5a88', 5); ibox(x, 0.05, 0, 0.9, 0.12, 12, '#8a6238', '#6e4c2a', '#5e4028'); },
  bedT: x => { ibox(x, 0.1, 0.05, 0.8, 1.9, 5, '#f4f0e4', '#b8b0a0', '#9a9284'); ibox(x, 0.15, 0.1, 0.7, 0.5, 2, '#ffffff', '#d8d0c0', '#c0b8a8', 5); ibox(x, 0.1, 0.7, 0.8, 1.3, 1, '#e8e4d8', '#c8c2b4', '#b0aa9c', 5); R(x, 0, 6, 3, 1, '#e0503f'); R(x, 1, 5, 1, 3, '#e0503f'); },
  wardrobe: x => { ibox(x, 0.15, 0.1, 0.7, 0.7, 24, '#a07040', '#7e5430', '#644222'); poly(x, [L(0.5, 0.8, 3), L(0.5, 0.8, 21), L(0.52, 0.8, 21), L(0.52, 0.8, 3)], '#3a2818'); R(x, -1, -12, 1, 2, '#d0b040'); R(x, 1, -12, 1, 2, '#d0b040'); },
  chest: x => { ibox(x, 0.15, 0.2, 0.7, 0.6, 6, '#a87440', '#845a30', '#6a4624'); ibox(x, 0.12, 0.17, 0.76, 0.66, 2, '#c08850', '#a07040', '#845a30', 6); poly(x, [L(0.45, 0.83, 2), L(0.55, 0.83, 2), L(0.55, 0.83, 6), L(0.45, 0.83, 6)], '#d0b040'); },
  rug: x => { poly(x, [L(0.1, 0.1), L(1.9, 0.1), L(1.9, 1.4), L(0.1, 1.4)], '#a8432f'); poly(x, [L(0.3, 0.3), L(1.7, 0.3), L(1.7, 1.2), L(0.3, 1.2)], '#c86a4a'); },
  dummy: x => { R(x, -1, -20, 2, 20, '#7a5634'); ell(x, 0, -14, 4, 5, '#d8b860'); ell(x, 0, -21, 3, 3, '#e0c070'); R(x, -5, -16, 10, 2, '#7a5634'); R(x, -2, -15, 1, 3, '#a8432f'); R(x, -4, 0, 8, 1, '#5e4028'); },
  rack: x => { ibox(x, 0, 0.3, 1.6, 0.3, 2, '#8a6238', '#6e4c2a', '#5e4028', 16); for (let i = 0; i < 4; i++) { const [px, py] = L(0.2 + i * 0.4, 0.45); R(x, Math.round(px), Math.round(py) - 16, 1, 16, '#9aa0a8'); R(x, Math.round(px) - 1, Math.round(py) - 6, 3, 1, '#5e4028'); } ibox(x, 0, 0.3, 1.6, 0.3, 2, '#8a6238', '#6e4c2a', '#5e4028', 2); },
  mat: x => { poly(x, [L(0.05, 0.05), L(2.95, 0.05), L(2.95, 1.95), L(0.05, 1.95)], '#4a6a8a'); poly(x, [L(0.2, 0.2), L(2.8, 0.2), L(2.8, 1.8), L(0.2, 1.8)], '#5a7a9a'); },
  altar: x => { ibox(x, 0, 0, 3, 1, 10, '#f0ece0', '#c8c2b4', '#aaa498'); ibox(x, 0.2, 0.2, 2.6, 0.6, 2, '#d9b44a', '#b08a2a', '#8a6a1a', 10); ibox(x, 1.2, 0.3, 0.6, 0.4, 8, '#d9b44a', '#b08a2a', '#8a6a1a', 12); },
  cauldron: x => { ell(x, 0, 2, 13, 6, '#2a2a30'); ell(x, 0, -2, 14, 7, '#3a3a44'); ell(x, 0, -4, 12, 5, '#2a2a30'); ell(x, 0, -4, 10, 4, '#5ac84a'); R(x, -10, 3, 3, 4, '#2a2a30'); R(x, 8, 3, 3, 4, '#2a2a30'); },
  shelf: x => { ibox(x, 0, 0.6, 2, 0.4, 26, '#8a6238', '#6e4c2a', '#5e4028'); for (let r = 0; r < 3; r++) { ibox(x, 0, 0.6, 2, 0.4, 1, '#a07848', '#7e5a32', '#6a4826', 6 + r * 8); for (let i = 0; i < 4; i++) { const [px, py] = L(0.25 + i * 0.45, 0.95); R(x, Math.round(px), Math.round(py) - 11 - r * 8, 2, 4, ['#e04a5a', '#4a7af0', '#5ac84a', '#f0b43c', '#c03ad8'][(i + r * 2) % 5]); } } },
  books: x => { ibox(x, 0, 0.6, 2, 0.4, 28, '#6a4a2a', '#54381e', '#442c16'); for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const [px, py] = L(0.15 + i * 0.26, 0.95); R(x, Math.round(px), Math.round(py) - 10 - r * 8, 1, 6, ['#a8432f', '#3f6a9a', '#4f8a43', '#c08a3a', '#6a4a8a'][(i * 3 + r) % 5]); } },
  table: x => { ibox(x, 0.1, 0.1, 1.8, 0.8, 2, '#b08454', '#8a6238', '#6e4c2a', 8); R(x, -8, 2, 1, 7, '#6e4c2a'); R(x, 9, 2, 1, 7, '#6e4c2a'); for (let i = 0; i < 3; i++) { const [px, py] = L(0.5 + i * 0.5, 0.5); R(x, Math.round(px), Math.round(py) - 13, 2, 3, ['#8ad8ff', '#e04a5a', '#5ac84a'][i]); R(x, Math.round(px), Math.round(py) - 14, 2, 1, '#e8e2d0'); } },
  forge: x => { ibox(x, 0, 0, 2, 1.6, 18, '#7a6a5e', '#5e5048', '#4a3e38'); ibox(x, 0.6, 0.3, 0.8, 0.8, 22, '#6a5a50', '#544840', '#443a34', 18); poly(x, [L(0.4, 1.6, 3), L(1.6, 1.6, 3), L(1.6, 1.6, 11), L(0.4, 1.6, 11)], '#2a1410'); },
  anvil: x => { ibox(x, 0.3, 0.3, 0.4, 0.4, 6, '#5a4028', '#44301e', '#362616'); ibox(x, 0.1, 0.25, 0.8, 0.5, 4, '#7a7e88', '#5a5e68', '#4a4e58', 6); },
  coal: x => { for (let i = 0; i < 12; i++) disc(x, Math.round(Math.sin(i * 7) * 6), 2 - Math.floor(i / 4) * 2 + Math.round(Math.cos(i * 5) * 2), 2, i % 3 ? '#2a2628' : '#3a3438'); },
  vault: x => { ibox(x, 0, 0, 3, 0.3, 40, '#5a5a66', '#46464e', '#3a3a42'); const [cx, cy] = L(1.5, 0.3, 20); disc(x, Math.round(cx), Math.round(cy), 13, '#a8a8b4'); disc(x, Math.round(cx), Math.round(cy), 11, '#8a8a96'); disc(x, Math.round(cx), Math.round(cy), 3, '#d0b040'); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; R(x, Math.round(cx + Math.cos(a) * 7), Math.round(cy + Math.sin(a) * 7), 2, 2, '#c8c8d0'); } },
  gold: x => { for (let i = 0; i < 9; i++) { const r = 3 - Math.floor(i / 4); disc(x, Math.round(Math.sin(i * 2.3) * (6 - i * 0.5)), 2 - i, r, i % 2 ? '#f0c24a' : '#d0a030'); } R(x, -1, -8, 2, 1, '#fff2c0'); },
  circle: x => { ell(x, 0, 0, 34, 17, '#3a2a5a'); ell(x, 0, 0, 31, 15, '#6a4aa8'); ell(x, 0, 0, 28, 14, '#3a2a5a'); ell(x, 0, 0, 20, 10, '#5a3a98'); ell(x, 0, 0, 17, 8, '#3a2a5a'); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; R(x, Math.round(Math.cos(a) * 24), Math.round(Math.sin(a) * 12), 2, 1, '#c8a8ff'); } },
  scope: x => { R(x, -1, -14, 1, 14, '#5e4028'); R(x, 2, -14, 1, 14, '#5e4028'); R(x, -3, -22, 12, 3, '#d9b44a'); R(x, 8, -24, 3, 5, '#b08a2a'); R(x, -4, -21, 2, 2, '#8ad8ff'); },
  board: x => { poly(x, [L(0, 0, 18), L(0, 2.4, 18), L(0, 2.4, 38), L(0, 0, 38)], '#8a6238'); poly(x, [L(0, 0.15, 20), L(0, 2.25, 20), L(0, 2.25, 36), L(0, 0.15, 36)], '#b88a50'); },
  door: x => { poly(x, [L(0, 0, 0), L(0, 1.6, 0), L(0, 1.6, 30), L(0, 0, 30)], '#3a2818'); poly(x, [L(0, 0.15, 0), L(0, 1.45, 0), L(0, 1.45, 27), L(0, 0.15, 27)], '#5e4028'); poly(x, [L(0, 0.3, 4), L(0, 1.3, 4), L(0, 1.3, 25), L(0, 0.3, 25)], '#7a5634'); const [hx, hy] = L(0, 1.15, 13); R(x, Math.round(hx), Math.round(hy), 1, 2, '#d0b040'); },
  stairs: x => { for (let i = 0; i < 5; i++) ibox(x, 0, i * 0.3, 1.2, 0.3, 14 - i * 3, '#8a6238', '#6e4c2a', '#5e4028'); },
  stool: x => { ibox(x, 0.3, 0.3, 0.4, 0.4, 5, '#a07848', '#7e5a32', '#6a4826'); },
  // 마구간: 건초 더미 · 구유 · 울타리. 도서관: 큰 책장 · 독서대. 비행장: 바람자루 · 밧줄 말뚝 · 비행 마차
  hay: x => { ibox(x, 0.1, 0.1, 0.8, 0.8, 7, '#d8b050', '#b08a30', '#8a6a20'); for (let i = 0; i < 6; i++) R(x, -6 + i * 2, -8 - (i % 2) * 2, 1, 2, '#f0d070'); },
  trough: x => { ibox(x, 0, 0.2, 2, 0.6, 7, '#8a6238', '#6e4c2a', '#5e4028'); ibox(x, 0.1, 0.3, 1.8, 0.4, 1, '#5a7ab0', '#4a6a9a', '#3a5a8a', 7); },
  fence: x => { for (let i = 0; i < 3; i++) { const [px, py] = L(0.1 + i * 0.9, 0.5); R(x, Math.round(px), Math.round(py) - 14, 2, 14, '#8a6238'); } const [ax, ay] = L(0.1, 0.5), [bx, by] = L(1.9, 0.5); R(x, Math.round(ax), Math.round(ay) - 11, Math.round(bx - ax) + 2, 2, '#a07848'); R(x, Math.round(ax), Math.round(ay) - 5, Math.round(bx - ax) + 2, 2, '#a07848'); },
  bigbooks: x => { ibox(x, 0, 0.6, 3, 0.4, 36, '#5a3a22', '#44301a', '#362412'); for (let r = 0; r < 4; r++) for (let i = 0; i < 11; i++) { const [px, py] = L(0.12 + i * 0.26, 0.95); R(x, Math.round(px), Math.round(py) - 8 - r * 8, 1, 6, ['#a8432f', '#3f6a9a', '#4f8a43', '#c08a3a', '#6a4a8a', '#c8b890'][(i * 5 + r) % 6]); } },
  lectern: x => { ibox(x, 0.3, 0.3, 0.4, 0.4, 14, '#8a6238', '#6e4c2a', '#5e4028'); ibox(x, 0.1, 0.2, 0.8, 0.6, 2, '#a07848', '#7e5a32', '#6a4826', 14); R(x, -3, -18, 6, 3, '#f0e8d0'); R(x, -2, -17, 4, 1, '#8a8070'); },
  windsock: x => { R(x, -1, -34, 2, 34, '#5a5a62'); for (let i = 0; i < 5; i++) R(x, 1 + i * 3, -33 + (i % 2), 3, 5 - Math.floor(i / 2), i % 2 ? '#f0f0f0' : '#f08a3c'); },
  // 주방: 화덕 · 식료품 선반 · 큰 솥
  stove: x => { ibox(x, 0, 0.2, 2, 0.8, 14, '#8a7a6a', '#6a5a4e', '#5a4a40'); ibox(x, 0.1, 0.25, 1.8, 0.7, 1, '#3a3430', '#2a2420', '#221c18', 14); const [fx, fy] = L(1, 1, 5); R(x, Math.round(fx) - 6, Math.round(fy) - 4, 12, 5, '#2a1a10'); R(x, Math.round(fx) - 4, Math.round(fy) - 3, 8, 3, '#f08a3c'); R(x, Math.round(fx) - 2, Math.round(fy) - 3, 4, 2, '#fff2a0'); const [px, py] = L(0.6, 0.5, 15); ell(x, Math.round(px), Math.round(py), 5, 2, '#3a3a44'); R(x, Math.round(px) - 4, Math.round(py) - 3, 8, 3, '#4a4a54'); const [qx, qy] = L(1.4, 0.5, 15); ell(x, Math.round(qx), Math.round(qy), 4, 2, '#2a2a30'); R(x, Math.round(qx) + 3, Math.round(qy) - 1, 5, 1, '#5e4028'); },
  pantry: x => { ibox(x, 0, 0.6, 2, 0.4, 26, '#9a7048', '#7a5432', '#664424'); for (let r = 0; r < 3; r++) { ibox(x, 0, 0.6, 2, 0.4, 1, '#b08454', '#8a6238', '#6e4c2a', 7 + r * 8); for (let i = 0; i < 5; i++) { const [px, py] = L(0.2 + i * 0.38, 0.95, 8 + r * 8); const c = ['#e8dcc0', '#c8504a', '#f0b43c', '#7ab85a', '#d8642a'][(i + r) % 5]; R(x, Math.round(px) - 1, Math.round(py) - 4, 3, 4, c); } } },
  pot: x => { ell(x, 0, 2, 11, 5, '#2a2a30'); ell(x, 0, -2, 12, 6, '#3a3a44'); ell(x, 0, -4, 10, 4, '#2a2a30'); ell(x, 0, -4, 8, 3, '#c8803a'); R(x, -1, -12, 2, 8, '#8a6238'); for (let i = 0; i < 3; i++) R(x, -4 + i * 4, -9 - (i % 2) * 2, 1, 2, 'rgba(230,230,230,0.6)'); },
  bollard: x => { ibox(x, 0.3, 0.3, 0.4, 0.4, 8, '#6a6a72', '#52525a', '#42424a'); R(x, -1, -9, 2, 1, '#9aa0a8'); },
  flywagon: x => { ibox(x, 0.2, 0.2, 2.6, 1.2, 14, '#8a6238', '#6e4c2a', '#5e4028'); ibox(x, 0.1, 0.1, 2.8, 1.4, 3, '#a07848', '#7e5a32', '#6a4826', 14); for (const sx of [-18, 14]) { R(x, sx, -24, 10, 2, '#e8e0d0'); R(x, sx + 2, -27, 8, 3, '#e8e0d0'); R(x, sx + 4, -30, 6, 3, '#d8d0c0'); } R(x, -4, -9, 8, 5, '#2a2a34'); }
};
// 가구 배치: [이름, tx, ty, w, d, h, 누르면 열 창]
const LAYOUT = {
  shop: [['counter', 5, 1, 3, 1, 16, 'co'], ['crate', 8, 1, 1, 1, 10], ['crate', 8, 2, 1, 1, 10], ['barrel', 8, 8, 1, 1, 12], ['plant', 0, 8, 1, 1, 18], ['lamp', 8, 6, 1, 1, 28], ['shelf', 1, 0, 2, 1, 28, 'inv'], ['stairs', 3.4, 0, 1.2, 1.5, 16]],
  inn: [],
  pen: [['crate', 0, 0, 1, 1, 10], ['barrel', 8, 0, 1, 1, 12, 'b:pen'], ['crate', 8, 1, 1, 1, 10], ['plant', 0, 8, 1, 1, 18], ['plant', 8, 8, 1, 1, 18], ['mat', 2, 2, 5, 2, 1], ['mat', 2, 5, 5, 2, 1]],
  alchemy: [['cauldron', 3, 3, 2, 2, 12, 'b:alchemy'], ['shelf', 1, 0, 2, 1, 28, 'b:alchemy'], ['shelf', 5, 0, 2, 1, 28, 'b:alchemy'], ['table', 6, 4, 2, 1, 16, 'b:alchemy'], ['barrel', 8, 2, 1, 1, 12], ['crate', 1, 7, 1, 1, 10], ['stool', 7, 6, 1, 1, 6]],
  training: [['mat', 1, 3, 3, 2, 1], ['mat', 5, 3, 3, 2, 1], ['dummy', 2, 1, 1, 1, 24, 'adv'], ['dummy', 4, 1, 1, 1, 24, 'adv'], ['dummy', 6, 1, 1, 1, 24, 'adv'], ['rack', 0, 5, 2, 1, 20], ['barrel', 8, 7, 1, 1, 12], ['crate', 8, 1, 1, 1, 10]],
  temple: [['altar', 3, 0, 3, 1, 22, 'b:temple'], ['plant', 1, 0, 1, 1, 18], ['plant', 7, 0, 1, 1, 18], ['lamp', 0, 3, 1, 1, 28], ['lamp', 8, 3, 1, 1, 28]],
  tower: [['circle', 4, 4, 1, 1, 2, 'b:tower'], ['books', 1, 0, 2, 1, 30, 'b:tower'], ['books', 5, 0, 2, 1, 30, 'b:tower'], ['scope', 7, 6, 1, 1, 26], ['table', 1, 5, 2, 1, 16, 'b:tower'], ['crate', 8, 2, 1, 1, 10]],
  smithy: [['forge', 1, 0, 2, 2, 42, 'b:smithy'], ['anvil', 4, 3, 1, 1, 12, 'b:smithy'], ['rack', 6, 0, 2, 1, 20, 'b:smithy'], ['coal', 0, 4, 1, 1, 8], ['barrel', 3, 1, 1, 1, 12], ['crate', 8, 5, 1, 1, 10], ['crate', 8, 6, 1, 1, 10]],
  bank: [['vault', 3, 0, 3, 1, 42, 'b:bank'], ['counter', 2, 3, 3, 1, 16, 'b:bank'], ['gold', 7, 1, 1, 1, 12, 'b:bank'], ['chest', 1, 0, 1, 1, 10, 'b:bank'], ['chest', 7, 3, 1, 1, 10, 'b:bank'], ['lamp', 0, 6, 1, 1, 28], ['plant', 8, 8, 1, 1, 18]],
  stable: [['hay', 0, 0, 1, 1, 8, 'b:stable'], ['hay', 1, 0, 1, 1, 8, 'b:stable'], ['trough', 3, 0, 2, 1, 8, 'b:stable'], ['trough', 6, 0, 2, 1, 8, 'b:stable'], ['fence', 0, 4, 2, 1, 14], ['fence', 0, 7, 2, 1, 14], ['barrel', 8, 8, 1, 1, 12], ['crate', 8, 7, 1, 1, 10], ['lamp', 8, 1, 1, 1, 28]],
  library: [['bigbooks', 0, 0, 3, 1, 36, 'b:library'], ['bigbooks', 3.5, 0, 3, 1, 36, 'b:library'], ['books', 0, 3, 2, 1, 30, 'b:library'], ['table', 4, 4, 2, 1, 16, 'b:library'], ['lectern', 7, 2, 1, 1, 14, 'b:library'], ['stool', 5, 5.5, 1, 1, 6], ['lamp', 8, 7, 1, 1, 28], ['plant', 0, 8, 1, 1, 18]],
  kitchen: [['stove', 1, 0, 2, 1, 22, 'b:kitchen'], ['pantry', 4, 0, 2, 1, 28, 'b:kitchen'], ['pot', 6.5, 3.5, 1, 1, 14, 'b:kitchen'], ['table', 2, 4, 2, 1, 16, 'b:kitchen'], ['stool', 2.5, 5.6, 1, 1, 6], ['stool', 4, 5.6, 1, 1, 6], ['barrel', 8, 1, 1, 1, 12], ['crate', 8, 2, 1, 1, 10], ['crate', 0, 6, 1, 1, 10], ['lamp', 0, 3, 1, 1, 28], ['plant', 8, 8, 1, 1, 18]],
  airfield: [['flywagon', 2, 2, 3, 2, 30, 'b:airfield'], ['windsock', 8, 0, 1, 1, 34], ['bollard', 0, 7, 1, 1, 8], ['bollard', 3, 7, 1, 1, 8], ['bollard', 6, 7, 1, 1, 8], ['crate', 7, 0, 1, 1, 10], ['crate', 0, 0, 1, 1, 10], ['barrel', 8, 5, 1, 1, 12], ['lamp', 0, 4, 1, 1, 28]]
};
const STAND_POS = [[2, 3], [4, 3], [6, 3], [2, 5], [4, 5], [6, 5], [3, 7], [5, 7], [7, 7], [8, 4]];
const CENTERED = ['barrel', 'plant', 'lamp', 'dummy', 'cauldron', 'gold', 'coal', 'circle', 'scope', 'pot'];
// 여관 방 r: 뒤쪽 셋 (ty 0~3), 앞쪽 셋 (ty 5~8)
const roomAt = r => ({ tx: (r % 3) * 3, ty: r < 3 ? 0 : 5 });
const BED_SPOT = [[2, 3], [4, 3], [6, 3], [1, 6], [3, 6], [5, 6], [7, 6]];   // 신전 환자 침대
const TRAIN_SPOT = [[2.5, 2.3], [4.5, 2.3], [6.5, 2.3], [2.3, 4.2], [4.6, 4.2], [6.8, 4.2]];

/* ───────── 창과 크기 ───────── */
function initHQ(canvas) {
  HQ.cvs = canvas; HQ.ctx = canvas.getContext('2d');
  sizeHQ();
  window.addEventListener('resize', sizeHQ);
}
function sizeHQ() {
  const r = HQ.cvs.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  if (!r.width || !r.height) return;
  HQ.W = 200; HQ.H = Math.max(240, Math.round(HQ.W * r.height / r.width));
  HQ.cvs.width = Math.round(r.width * dpr); HQ.cvs.height = Math.round(r.height * dpr);
  [HQ.off, HQ.g] = mkCanvas(HQ.W, HQ.H);
  [HQ.lc, HQ.l] = mkCanvas(HQ.W, HQ.H);
  HQ.shells.clear();
  // 위쪽 원정 창·메뉴 바로 아래에 방 지붕이 오도록
  const k = HQ.W / r.width, pip = document.getElementById('pip').getBoundingClientRect(), menu = document.getElementById('menu').getBoundingClientRect();
  const top = (Math.max(pip.bottom, menu.bottom) - r.top) * k;
  HQ.ox = Math.round(HQ.W / 2);
  HQ.oy = Math.round(Math.min(Math.max(top + WH + 14, WH + 16), HQ.H - 150));
  HQ.ctx.imageSmoothingEnabled = false;
}

/* ───────── 바깥: 하늘·거리·땅속 ───────── */
function hqBack(g, f, t, T) {
  const W = HQ.W, H = HQ.H;
  if (f.under) {
    for (let y = 0; y < H; y += 4) R(g, 0, y, W, 4, mix('#3a2e26', '#1e1814', y / H));
    const r = rng(7);
    for (let i = 0; i < 70; i++) R(g, Math.floor(r() * W), Math.floor(r() * H), 2 + Math.floor(r() * 3), 1 + Math.floor(r() * 2), r() < 0.5 ? '#4a3c32' : '#2a221c');
    return;
  }
  const sky = T.sky;
  for (let y = 0; y < H; y += 2) { const k = y / H; R(g, 0, y, W, 2, k < 0.5 ? mix(sky[0], sky[1], k * 2) : mix(sky[1], sky[2], (k - 0.5) * 2)); }
  if (T.star > 0.05) { const r = rng(3); g.globalAlpha = T.star; for (let i = 0; i < 40; i++) R(g, Math.floor(r() * W), Math.floor(r() * H * 0.6), 1, 1, '#ffffff'); g.globalAlpha = 1; }
  // 하르겐의 지붕들
  const r = rng(11), far = mix(sky[1], '#20283a', 0.55), near = mix(sky[2], '#283040', 0.6);
  const hz = HQ.oy + 30;
  for (let x = -10; x < W; ) { const w = 14 + Math.floor(r() * 20), h = 20 + Math.floor(r() * 50); R(g, x, hz - h, w, H, far); if (r() < 0.5) poly(g, [[x - 2, hz - h], [x + w / 2, hz - h - 10], [x + w + 2, hz - h]], far); x += w + 2; }
  for (let x = -6; x < W; ) { const w = 18 + Math.floor(r() * 18), h = 10 + Math.floor(r() * 30); R(g, x, hz + 40 - h, w, H, near); poly(g, [[x - 3, hz + 40 - h], [x + w / 2, hz + 40 - h - 12], [x + w + 3, hz + 40 - h]], shade(near, -0.15)); if (T.dark[1] > 0.3) for (let k = 0; k < 3; k++) if (r() < 0.6) R(g, x + 4 + k * 5, hz + 48 - h, 2, 3, '#f0c060'); x += w + 4; }
}
// 지금 층 아래로 이어지는 건물 겉면과 거리
function hqFacade(g, f, T) {
  if (f.under) return;
  const below = f.lv - 1, night = T.dark[1] > 0.3;
  let z = -SLAB;
  const wall = '#c8ad86', wallD = '#a88e6a', ledge = '#7a5a3a';
  for (let k = 0; k < below; k++) {
    const top = z, bot = z - WH;
    poly(g, [scr(0, GN, top), scr(GN, GN, top), scr(GN, GN, bot), scr(0, GN, bot)], wall);
    poly(g, [scr(GN, GN, top), scr(GN, 0, top), scr(GN, 0, bot), scr(GN, GN, bot)], wallD);
    for (let i = 0; i < 3; i++) {
      const a = 1.2 + i * 2.6, c = night ? (k + i) % 3 ? '#f0c060' : '#3a3a50' : '#5a7ab0';
      poly(g, [scr(a, GN, top - 14), scr(a + 1.2, GN, top - 14), scr(a + 1.2, GN, top - 36), scr(a, GN, top - 36)], c);
      poly(g, [scr(GN, a, top - 14), scr(GN, a + 1.2, top - 14), scr(GN, a + 1.2, top - 36), scr(GN, a, top - 36)], night ? (k + i) % 2 ? '#d8a848' : '#2a2a40' : '#4a6a9a');
    }
    poly(g, [scr(0, GN, bot), scr(GN, GN, bot), scr(GN, GN, bot - SLAB), scr(0, GN, bot - SLAB)], ledge);
    poly(g, [scr(GN, GN, bot), scr(GN, 0, bot), scr(GN, 0, bot - SLAB), scr(GN, GN, bot - SLAB)], shade(ledge, -0.2));
    z = bot - SLAB;
  }
  // 거리: 1층 바닥 높이의 돌길
  const y0 = Math.round(scr(GN, GN, z)[1]);
  const st = '#7a7066';
  poly(g, [[0, y0 - 46], [HQ.W, y0 - 46], [HQ.W, HQ.H], [0, HQ.H]], st);
  const r = rng(5);
  for (let y = y0 - 44; y < HQ.H; y += 5) for (let x = (y % 10 ? 0 : 6); x < HQ.W; x += 12) R(g, x + Math.floor(r() * 3), y, 9, 3, r() < 0.5 ? '#867b70' : '#6e655c');
  R(g, 0, y0 - 47, HQ.W, 1, '#5e564e');
}

/* ───────── 바깥 + 겉면 + 방 껍데기 (30분마다 새로 굽는다) ───────── */
function hqBase(f, T, dp, night) {
  const key = f.key + '|' + Math.floor(dp * 48) + '|' + HQ.W + 'x' + HQ.H + '|' + (f.top ? 1 : 0) + '|' + f.lv + '|' + HQ.oy;
  let c = HQ.shells.get(key);
  if (c) return c;
  const [cv, g] = mkCanvas(HQ.W, HQ.H);
  hqBack(g, f, 0, T);
  hqFacade(g, f, T);
  paintShell(g, f, night);
  HQ.shells.set(key, cv);
  if (HQ.shells.size > 12) HQ.shells.delete(HQ.shells.keys().next().value);
  return cv;
}
function paintShell(g, f, night) {
  const C = ROOM_C[f.id];
  // 벽 두 면
  poly(g, [scr(0, 0), scr(GN, 0), scr(GN, 0, WH), scr(0, 0, WH)], C.wall);
  poly(g, [scr(0, 0), scr(0, GN), scr(0, GN, WH), scr(0, 0, WH)], C.wall2);
  if (C.stone) {
    const r = rng(f.id.length * 13);
    for (let z = 4; z < WH - 2; z += 6) for (let i = (z % 12 ? 0 : 0.5); i < GN; i += 1.1) {
      poly(g, [scr(i, 0, z), scr(i + 0.9, 0, z), scr(i + 0.9, 0, z + 1), scr(i, 0, z + 1)], shade(C.wall, -0.12));
      poly(g, [scr(0, i, z), scr(0, i + 0.9, z), scr(0, i + 0.9, z + 1), scr(0, i, z + 1)], shade(C.wall2, -0.12));
      if (r() < 0.15) poly(g, [scr(i + 0.2, 0, z + 2), scr(i + 0.5, 0, z + 2), scr(i + 0.5, 0, z + 4), scr(i + 0.2, 0, z + 4)], shade(C.wall, 0.1));
    }
  } else {
    for (let i = 1; i < GN; i += 2) { poly(g, [scr(i, 0, 3), scr(i + 0.06, 0, 3), scr(i + 0.06, 0, WH - 4), scr(i, 0, WH - 4)], shade(C.wall, -0.06)); poly(g, [scr(0, i, 3), scr(0, i + 0.06, 3), scr(0, i + 0.06, WH - 4), scr(0, i, WH - 4)], shade(C.wall2, -0.06)); }
  }
  // 걸레받이와 윗선
  poly(g, [scr(0, 0), scr(GN, 0), scr(GN, 0, 4), scr(0, 0, 4)], C.base);
  poly(g, [scr(0, 0), scr(0, GN), scr(0, GN, 4), scr(0, 0, 4)], shade(C.base, -0.15));
  poly(g, [scr(0, 0, WH - 3), scr(GN, 0, WH - 3), scr(GN, 0, WH), scr(0, 0, WH)], shade(C.wall, -0.2));
  poly(g, [scr(0, 0, WH - 3), scr(0, GN, WH - 3), scr(0, GN, WH), scr(0, 0, WH)], shade(C.wall2, -0.2));
  // 벽 두께 (잘린 단면)
  const cut = f.top ? '#5a3a2a' : '#4a4038';
  poly(g, [scr(-0.3, -0.3, WH), scr(GN, -0.3, WH), scr(GN, 0, WH), scr(0, 0, WH)], cut);
  poly(g, [scr(-0.3, -0.3, WH), scr(0, 0, WH), scr(0, GN, WH), scr(-0.3, GN, WH)], shade(cut, 0.15));
  poly(g, [scr(GN, -0.3, WH), scr(GN, 0, WH), scr(GN, 0, 0), scr(GN, -0.3, 0)], shade(C.wall, -0.35));
  poly(g, [scr(-0.3, GN, WH), scr(0, GN, WH), scr(0, GN, 0), scr(-0.3, GN, 0)], shade(C.wall2, -0.35));
  if (f.top && !f.under) {   // 맨 위층: 지붕 처마
    poly(g, [scr(-0.6, -0.6, WH + 6), scr(GN + 0.3, -0.6, WH + 6), scr(GN + 0.3, -0.6, WH), scr(-0.6, -0.6, WH)], '#8a3a2a');
    poly(g, [scr(-0.6, -0.6, WH + 6), scr(-0.6, GN + 0.3, WH + 6), scr(-0.6, GN + 0.3, WH), scr(-0.6, -0.6, WH)], '#6a2a20');
  }
  // 바닥
  for (let i = 0; i < GN; i++) for (let j = 0; j < GN; j++) {
    const col = C.plank ? C.fl[i % 2] : C.fl[(i + j) % 2];
    poly(g, [scr(i, j), scr(i + 1, j), scr(i + 1, j + 1), scr(i, j + 1)], col);
    if (C.plank && (i * 7 + j * 3) % 5 === 0) poly(g, [scr(i + 0.1, j + 0.5), scr(i + 0.9, j + 0.5), scr(i + 0.9, j + 0.55), scr(i + 0.1, j + 0.55)], shade(col, -0.12));
  }
  // 바닥판 앞 단면
  poly(g, [scr(0, GN), scr(GN, GN), scr(GN, GN, -SLAB), scr(0, GN, -SLAB)], C.base);
  poly(g, [scr(GN, GN), scr(GN, 0), scr(GN, 0, -SLAB), scr(GN, GN, -SLAB)], shade(C.base, -0.25));
  poly(g, [scr(0, GN), scr(GN, GN), scr(GN, GN, -1), scr(0, GN, -1)], shade(C.base, 0.25));
  // 층마다 벽 꾸미기
  wallDecor(g, f, night);
}
function winR(g, a, b, z0, z1, sky) {   // 오른쪽 뒤 벽 창문
  poly(g, [scr(a - 0.1, 0, z0 - 2), scr(b + 0.1, 0, z0 - 2), scr(b + 0.1, 0, z1 + 2), scr(a - 0.1, 0, z1 + 2)], '#5e4028');
  poly(g, [scr(a, 0, z0), scr(b, 0, z0), scr(b, 0, z1), scr(a, 0, z1)], sky);
  const m = (a + b) / 2;
  poly(g, [scr(m - 0.04, 0, z0), scr(m + 0.04, 0, z0), scr(m + 0.04, 0, z1), scr(m - 0.04, 0, z1)], '#5e4028');
  poly(g, [scr(a, 0, (z0 + z1) / 2 - 0.5), scr(b, 0, (z0 + z1) / 2 - 0.5), scr(b, 0, (z0 + z1) / 2 + 0.5), scr(a, 0, (z0 + z1) / 2 + 0.5)], '#5e4028');
}
function winL(g, a, b, z0, z1, sky) {   // 왼쪽 뒤 벽 창문
  poly(g, [scr(0, a - 0.1, z0 - 2), scr(0, b + 0.1, z0 - 2), scr(0, b + 0.1, z1 + 2), scr(0, a - 0.1, z1 + 2)], '#4a3020');
  poly(g, [scr(0, a, z0), scr(0, b, z0), scr(0, b, z1), scr(0, a, z1)], shade(sky, -0.1));
  const m = (a + b) / 2;
  poly(g, [scr(0, m - 0.04, z0), scr(0, m + 0.04, z0), scr(0, m + 0.04, z1), scr(0, m - 0.04, z1)], '#4a3020');
}
function wallDecor(g, f, night) {
  const T = todAt(clockDp(), 'town'), sky = night ? '#1c2440' : T.sky[1];
  if (f.id === 'shop') {
    winR(g, 5.4, 7.4, 26, 44, sky);
    // 의뢰 게시판 (왼쪽 벽)
    poly(g, [scr(0, 1.2, 18), scr(0, 3.6, 18), scr(0, 3.6, 40), scr(0, 1.2, 40)], '#6e4c2a');
    poly(g, [scr(0, 1.35, 20), scr(0, 3.45, 20), scr(0, 3.45, 38), scr(0, 1.35, 38)], '#b88a50');
    // 문 (왼쪽 벽): 손님이 드나든다
    poly(g, [scr(0, 5.6, 0), scr(0, 7.4, 0), scr(0, 7.4, 32), scr(0, 5.6, 32)], '#4a3020');
    poly(g, [scr(0, 5.8, 0), scr(0, 7.2, 0), scr(0, 7.2, 29), scr(0, 5.8, 29)], night ? '#1a1830' : mix(T.sky[2], '#c8b898', 0.5));
    poly(g, [scr(0, 5.8, 0), scr(0, 7.2, 0), scr(0, 7.2, 2), scr(0, 5.8, 2)], '#7a7066');
    // 간판
    poly(g, [scr(0.6, 0, 46), scr(4.4, 0, 46), scr(4.4, 0, 53), scr(0.6, 0, 53)], '#7a2a20');
    poly(g, [scr(0.8, 0, 47), scr(4.2, 0, 47), scr(4.2, 0, 52), scr(0.8, 0, 52)], '#a8432f');
    for (let i = 0; i < 4; i++) poly(g, [scr(1.1 + i * 0.8, 0, 48.5), scr(1.5 + i * 0.8, 0, 48.5), scr(1.5 + i * 0.8, 0, 50.5), scr(1.1 + i * 0.8, 0, 50.5)], '#f0c24a');
  } else if (f.id === 'inn') {
    winR(g, 1, 2, 28, 42, sky); winR(g, 4, 5, 28, 42, sky); winR(g, 7, 8, 28, 42, sky);
    winL(g, 6, 7.4, 28, 42, sky);
  } else if (f.id === 'temple') {
    // 스테인드글라스
    for (const [a, b] of [[1.6, 2.8], [6.2, 7.4]]) {
      poly(g, [scr(a - 0.1, 0, 16), scr(b + 0.1, 0, 16), scr(b + 0.1, 0, 46), scr(a - 0.1, 0, 46)], '#8a8478');
      const cols = ['#c8463a', '#3a7ac8', '#e8c040', '#4aa86a'];
      for (let k = 0; k < 4; k++) poly(g, [scr(a, 0, 18 + k * 7), scr(b, 0, 18 + k * 7), scr(b, 0, 24 + k * 7), scr(a, 0, 24 + k * 7)], night ? shade(cols[k], -0.5) : cols[(k + 1) % 4]);
    }
    poly(g, [scr(4.3, 0, 30), scr(4.7, 0, 30), scr(4.7, 0, 50), scr(4.3, 0, 50)], '#d9b44a');
    poly(g, [scr(3.9, 0, 42), scr(5.1, 0, 42), scr(5.1, 0, 45), scr(3.9, 0, 45)], '#d9b44a');
    winL(g, 3, 4.6, 24, 44, sky);
  } else if (f.id === 'training') {
    winR(g, 3, 6, 30, 44, sky);
    for (let i = 0; i < 3; i++) poly(g, [scr(0, 2 + i * 2, 30), scr(0, 2.8 + i * 2, 30), scr(0, 2.8 + i * 2, 44), scr(0, 2 + i * 2, 44)], ['#a8432f', '#3f6a9a', '#c08a3a'][i]);
  } else if (f.id === 'kitchen') {
    winL(g, 3, 5, 26, 42, sky); winR(g, 6.4, 7.8, 26, 42, sky);
    for (let i = 0; i < 4; i++) { const [x, y] = scr(0, 6 + i * 0.5, 40); R(g, Math.round(x) - 1, Math.round(y), 1, 5, '#5e4028'); R(g, Math.round(x) - 3, Math.round(y) + 5, 5, 3, ['#3a3a44', '#8a6238', '#3a3a44', '#c8a060'][i]); }
    for (let i = 0; i < 3; i++) { const [x, y] = scr(0.6 + i * 0.5, 0, 46); R(g, Math.round(x), Math.round(y), 1, 6, '#5a7a4a'); R(g, Math.round(x) - 1, Math.round(y) + 6, 3, 2, ['#e0d0a0', '#c84a3a', '#7ab85a'][i]); }
  } else if (f.id === 'alchemy') {
    winL(g, 3, 5, 26, 42, sky);
    for (let i = 0; i < 5; i++) { const [x, y] = scr(3.4 + i * 0.4, 0, 46); R(g, Math.round(x), Math.round(y), 1, 6, '#5a7a4a'); R(g, Math.round(x) - 1, Math.round(y) + 6, 3, 3, ['#5ac84a', '#c8a040', '#a85ac8', '#5ac84a', '#e0503f'][i]); }
  } else if (f.id === 'tower') {
    winR(g, 3.6, 5.4, 22, 46, night ? '#0c1028' : '#3a4a8a');
    winL(g, 3.6, 5.4, 22, 46, night ? '#0c1028' : '#3a4a8a');
    for (let i = 0; i < 9; i++) { const [x, y] = scr(3.8 + (i % 3) * 0.6, 0, 26 + Math.floor(i / 3) * 8); R(g, Math.round(x), Math.round(y), 1, 1, '#ffffff'); }
  } else if (f.id === 'smithy') {
    for (let i = 0; i < 4; i++) { const [x, y] = scr(0, 4 + i * 1.1, 34); R(g, Math.round(x) - 1, Math.round(y), 2, 14, '#9aa0a8'); R(g, Math.round(x) - 3, Math.round(y) + 10, 6, 2, '#5e4028'); }
  } else if (f.id === 'stable') {
    winR(g, 3, 5, 30, 44, sky); winL(g, 3, 5, 30, 44, sky);
    for (let i = 0; i < 3; i++) { const [x, y] = scr(0, 6.2 + i * 0.6, 24); R(g, Math.round(x), Math.round(y), 1, 1, '#d8b050'); R(g, Math.round(x) - 2, Math.round(y) + 2, 5, 1, '#8a6238'); }
  } else if (f.id === 'library') {
    winR(g, 7.2, 8.6, 24, 46, sky);
    for (let i = 0; i < 2; i++) poly(g, [scr(0, 5 + i * 1.6, 28), scr(0, 6.2 + i * 1.6, 28), scr(0, 6.2 + i * 1.6, 44), scr(0, 5 + i * 1.6, 44)], ['#3f6a9a', '#6a4a8a'][i]);
  } else if (f.id === 'airfield') {
    winR(g, 1, 3, 20, 48, sky); winR(g, 5, 7, 20, 48, sky); winL(g, 1, 3, 20, 48, sky); winL(g, 5, 7, 20, 48, sky);
  } else if (f.id === 'bank') {
    poly(g, [scr(0, 3, 22), scr(0, 6, 22), scr(0, 6, 42), scr(0, 3, 42)], '#4a4a56');
    poly(g, [scr(0, 3.2, 24), scr(0, 5.8, 24), scr(0, 5.8, 40), scr(0, 3.2, 40)], '#2a2a34');
    for (let i = 0; i < 4; i++) poly(g, [scr(0, 3.4 + i * 0.6, 26), scr(0, 3.5 + i * 0.6, 26), scr(0, 3.5 + i * 0.6, 38), scr(0, 3.4 + i * 0.6, 38)], '#9aa0a8');
  }
}

/* ───────── 층마다 놓이는 것 (가구 + 사람) ───────── */
// 그릴 것 목록: { d: 깊이, x, y, draw(g), hit }
function sceneOf(f, t) {
  const out = [], it = (d, x, y, draw, hit) => out.push({ d, x, y, draw, hit });
  for (const [name, tx, ty, w, d, h, win] of LAYOUT[f.id] || []) {
    const [sx, sy] = scr(tx, ty), spr = furnSprite(name + w + 'x' + d, w, d, h, x => {
      if (CENTERED.includes(name)) { const [cx, cy] = L(w / 2, d / 2); x.save(); x.translate(Math.round(cx), Math.round(cy)); F[name](x); x.restore(); }
      else F[name](x);
    }, name === 'circle' || name === 'mat' || name === 'rug');
    const flat = name === 'circle' || name === 'mat' || name === 'rug';
    it(flat ? -10 + tx + ty : tx + w - 1 + ty + d - 1 + 0.5, sx, sy, g => blitAt(g, spr, sx, sy), win ? { x: sx - d * TW / 2, y: sy - h, w: (w + d) * TW / 2, h: h + (w + d) * TH / 2, win } : null);
  }
  if (f.id === 'shop') shopScene(it, t);
  if (f.id === 'inn') innScene(it, f, t);
  if (f.id === 'temple') templeScene(it, t);
  if (f.id === 'pen') penScene(it, t);
  if (f.id === 'training') trainScene(it, t);
  if (f.id === 'alchemy') staffAt(it, STAFF.alchem, 2.6, 4.6, 'stir', t, 'f', 1);
  if (f.id === 'kitchen') staffAt(it, STAFF.cook, 2.2, 1.9, 'stir', t, 'f', 0);
  if (f.id === 'tower') { staffAt(it, STAFF.sage, 2.2, 6.4, 'read', t, 'b', 1); }
  if (f.id === 'smithy') staffAt(it, STAFF.smith, 4.5, 2.3, 'hammer', t, 'f', 0, 2.6);
  if (f.id === 'bank') staffAt(it, STAFF.clerk, 3.5, 2.4, 'idle', t, 'f', 0);
  if (f.id === 'stable') stableScene(it, t);
  if (f.id === 'library') { staffAt(it, STAFF.sage, 6.5, 4.6, 'read', t, 'b', 1); }
  if (f.id === 'airfield') { staffAt(it, STAFF.coach, 6.2, 3.2, 'idle', t, 'f', 0); }
  return out;
}
// 마구간: 산 말과 맨 펫이 칸마다 서 있다 (누르면 마구간 창)
const STABLE_SPOT = [[2.5, 2.2], [4.5, 2.2], [6.5, 2.2], [2.5, 5.2], [4.5, 5.2], [6.5, 5.2], [3.5, 7.4], [5.5, 7.4]];
function stableScene(it, t) {
  const list = [];
  for (const k in (S.stable && S.stable.horses) || {}) for (let i = 0; i < (S.stable.horses[k] || 0); i++) list.push({ id: 'horse_' + k });
  for (const p of S.parties) if (p.horse && p.horse.startsWith('p:')) { const pet = petById(+p.horse.slice(2)); if (pet) list.push({ id: pet.stage ? PETS[pet.kind].mon : 'pet_' + pet.kind }); }
  list.slice(0, STABLE_SPOT.length).forEach((h, i) => {
    const [bx, by] = STABLE_SPOT[i], tx = bx + Math.sin(t * 0.3 + i * 2) * 0.15, [x, y] = scr(tx, by), bob = Math.abs(Math.sin(t * 1.2 + i)) * 0.6;
    it(tx + by, x, y, g => { g.save(); g.translate(Math.round(x), Math.round(y - bob)); g.scale(0.5, 0.5); drawMon(g, h.id, t, { ph: i }); g.restore(); }, { x: x - 9, y: y - 16, w: 18, h: 18, win: 'b:stable' });
  });
}
function staffAt(it, p, tx, ty, pose, t, dir, flip, rate = 1.2) {
  const [x, y] = scr(tx, ty), fr = Math.floor(t * rate) % 2;
  it(tx + ty, x, y, g => { g.save(); g.translate(Math.round(x), Math.round(y)); drawPerson(g, p, dir, pose, fr, flip); g.restore(); }, null);
}
function advAt(it, a, tx, ty, pose, t, dir, flip) {
  const [x, y] = scr(tx, ty), p = advPerson(a), fr = pose === 'walk' ? Math.floor(t * 6) % 4 : Math.floor(t * 1.4 + a.id) % 2;
  it(tx + ty, x, y, g => { g.save(); g.translate(Math.round(x), Math.round(y)); drawPerson(g, p, dir, pose, fr, flip); g.restore(); }, { x: x - 7, y: y - 22, w: 14, h: 24, adv: a.id });
}
function sleeperAt(it, a, tx, ty, t, hurt) {
  const [x, y] = scr(tx, ty);
  it(tx + ty + 0.6, x, y, g => {
    g.save(); g.translate(Math.round(x), Math.round(y) - 4); drawSleeper(g, advPerson(a)); g.restore();
    if (!hurt) drawZ(g, Math.round(x) + 4, Math.round(y) - 12, t, a.id * 0.3);
    else { R(g, Math.round(x) - 1, Math.round(y) - 18, 3, 1, '#e0503f'); R(g, Math.round(x), Math.round(y) - 19, 1, 3, '#e0503f'); }
  }, { x: x - 8, y: y - 16, w: 16, h: 16, adv: a.id });
}

/* 1층: 매대와 손님 */
function shopScene(it, t) {
  const n = slotCount();
  for (let i = 0; i < Math.min(n, STAND_POS.length); i++) {
    const [tx, ty] = STAND_POS[i], s = S.shop.slots[i], [x, y] = scr(tx, ty);
    const spr = furnSprite('stand', 1, 1, 9, F.stand);
    const has = s && stockOf(s.item) > 0;
    it(tx + ty + 0.5, x, y, g => {
      blitAt(g, spr, x, y);
      if (s) {
        const [cx, cy] = scr(tx + 0.5, ty + 0.5, 9);
        if (has) drawIcon(g, isGearKey(s.item) ? { icon: GTYPES[s.item.split(':')[1]].icon, c: TIER_COLORS[+s.item.split(':')[2]] } : s.item, Math.round(cx) - 5, Math.round(cy) - 9);
        R(g, Math.round(cx) + 5, Math.round(cy) - 3, 3, 2, ['#7bd36a', '#f0b43c', '#e0503f'][s.tier || 0]);
        if (!has) R(g, Math.round(cx) - 3, Math.round(cy) - 2, 6, 1, '#7a6a5a');
      }
    }, { x: x - 10, y: y - 20, w: 20, h: 26, win: 'inv' });
  }
  // 계산대 뒤 주인
  const pay = HQ.keeperPay > t;
  staffAt(it, STAFF.keeper, 6.3, 0.55, pay ? 'pay' : 'idle', t, 'f', 0, 1);
  // 게시판 (의뢰)
  const [bx, by] = scr(0, 1.2, 40);
  it(-5, bx, by, g => { for (let i = 0; i < Math.min(6, S.reqs.length); i++) { const [px, py] = scr(0, 1.5 + (i % 3) * 0.65, 34 - Math.floor(i / 3) * 8); R(g, Math.round(px) - 2, Math.round(py), 4, 5, S.reqs[i] && reqHave(S.reqs[i]) >= S.reqs[i].qty ? '#fff2a0' : '#f0e8d8'); R(g, Math.round(px) - 1, Math.round(py) + 1, 2, 1, '#8a8a8a'); } }, { x: bx - 26, y: by, w: 26, h: 34, win: 'req' });
  for (const c of HQ.cust) {
    const [x, y] = scr(c.x, c.y);
    it(c.x + c.y, x, y, g => {
      g.save(); g.globalAlpha = c.alpha; g.translate(Math.round(x), Math.round(y));
      drawPerson(g, c.p, c.dir, c.pose, c.pose === 'walk' ? Math.floor(c.wt * 6) % 4 : 0, c.flip);
      g.restore();
      if (c.show && c.state === 'look') drawIcon(g, c.show, Math.round(x) - 5, Math.round(y) - 34);
    }, null);
  }
}
/* 여관: 모험가마다 방 하나 */
function roomOwners() { return living().slice().sort((a, b) => a.id - b.id); }
function innScene(it, f, t) {
  const owners = roomOwners(), base = (f.i || 0) * SEATS, total = beds(), night = isNight() || phaseOf(S.t) === 0;
  for (let r = 0; r < SEATS; r++) {
    const k = base + r, { tx, ty } = roomAt(r), a = owners[k], open = k < total;
    // 칸막이 (방 사이 낮은 벽)
    if (r % 3) for (let k = 0; k < 4; k++) { const y0 = ty + k, [px, py] = scr(tx, y0); it(tx + y0 + 0.45, px, py, g => { poly(g, [scr(tx, y0), scr(tx, y0 + 1), scr(tx, y0 + 1, 10), scr(tx, y0, 10)], '#b89a72'); poly(g, [scr(tx - 0.15, y0, 10), scr(tx, y0, 10), scr(tx, y0 + 1, 10), scr(tx - 0.15, y0 + 1, 10)], '#d8c098'); if (k === 3) poly(g, [scr(tx - 0.15, y0 + 1), scr(tx, y0 + 1), scr(tx, y0 + 1, 10), scr(tx - 0.15, y0 + 1, 10)], '#8a6e4a'); }, null); }
    if (!open) {   // 아직 없는 방: 짐 보관
      const [cx, cy] = scr(tx + 1, ty + 1); const spr = furnSprite('crate', 1, 1, 10, F.crate);
      it(tx + ty + 2, cx, cy, g => { blitAt(g, spr, cx, cy); blitAt(g, spr, scr(tx + 1.6, ty + 2)[0], scr(tx + 1.6, ty + 2)[1]); }, null);
      continue;
    }
    const by = r < 3 ? ty : ty + 2, [bx, byy] = scr(tx + 0.35, by), bed = furnSprite('bed', 1, 2, 14, F.bed);
    it(tx + 0.35 + by + 1.5, bx, byy, g => blitAt(g, bed, bx, byy), a ? { x: bx - 12, y: byy - 12, w: 26, h: 24, adv: a.id } : null);
    const [wx, wy] = scr(tx + 2, r < 3 ? ty : ty + 3), wd = furnSprite('wardrobe', 1, 1, 28, F.wardrobe);
    it(tx + 2 + (r < 3 ? ty : ty + 3) + 0.5, wx, wy, g => blitAt(g, wd, wx, wy), null);
    const [kx, ky] = scr(tx + 2, r < 3 ? ty + 2 : ty + 1), ch = furnSprite('chest', 1, 1, 10, F.chest);
    it(tx + 2 + (r < 3 ? ty + 2 : ty + 1) + 0.5, kx, ky, g => blitAt(g, ch, kx, ky), a ? { x: kx - 10, y: ky - 8, w: 20, h: 14, adv: a.id } : null);
    // 문패: 직업 색
    if (a) { const [nx, ny] = r < 3 ? scr(tx + 1.5, 0, 46) : scr(tx + 1.5, ty + 4.2, 0); it(r < 3 ? -4 : tx + ty + 4.5, nx, ny, g => { R(g, Math.round(nx) - 4, Math.round(ny) - (r < 3 ? 0 : 2), 8, 4, '#2a1d14'); R(g, Math.round(nx) - 3, Math.round(ny) - (r < 3 ? -1 : 1), 6, 2, CLASSES[a.cls].tunic); }, null); }
    if (!a || a.status !== 'idle' || a.post || (a.inj && S.bld.temple)) continue;
    const sleepy = (a.sleep || 0) > 2 || a.inj || night;
    if (sleepy) sleeperAt(it, a, tx + 0.8, by + 0.55, t, !!a.inj);
    else if (!S.bld.training || night) advAt(it, a, tx + 1.3, by + (r < 3 ? 2.6 : 0.9), 'idle', t, 'f', r % 2);
  }
}
/* 신전: 환자와 치유사 */
/* 사육장: 상단에 남은 펫들이 돌아다니고, 품는 알이 놓여 있다 */
const PEN_SPOT = [[2.5, 3], [5, 2.6], [3.5, 5.5], [6, 5], [1.5, 6.5], [7, 3.8], [4.5, 4], [2, 4.5]];
function penScene(it, t) {
  const home = petsAtHome().slice(0, PEN_SPOT.length);
  home.forEach((pet, i) => {
    const [bx, by] = PEN_SPOT[i], tx = bx + Math.sin(t * 0.6 + i * 2) * 0.6, ty = by + Math.cos(t * 0.45 + i) * 0.4, [x, y] = scr(tx, ty);
    const hop = Math.abs(Math.sin(t * 4 + i)) * 1.5;
    it(tx + ty, x, y, g => { g.save(); g.translate(Math.round(x), Math.round(y - hop)); g.scale(0.55, 0.55); drawMon(g, pet.stage ? PETS[pet.kind].mon : 'pet_' + pet.kind, t, { ph: i }); g.restore(); }, { x: x - 8, y: y - 14, w: 16, h: 16, win: 'b:pen' });
  });
  const inc = (S.pen && S.pen.inc) || [];
  inc.forEach((x, i) => { const [sx, sy] = scr(1 + i * 1.2, 1.2), E = ITEMS['egg_' + x.kind]; it(1 + i * 1.2 + 1.2, sx, sy, g => { R(g, Math.round(sx) - 4, Math.round(sy) - 6, 9, 4, '#c8a860'); R(g, Math.round(sx) - 3, Math.round(sy) - 9, 7, 7, E.c); R(g, Math.round(sx) - 2, Math.round(sy) - 10, 5, 2, E.c); R(g, Math.round(sx) - 2, Math.round(sy) - 8, 2, 2, shade(E.c, 0.35)); }, { x: sx - 6, y: sy - 12, w: 12, h: 12, win: 'b:pen' }); });
}
function templeScene(it, t) {
  staffAt(it, STAFF.priest, 4.5, 1.6, 'pray', t, 'b', 0, 0.8);
  const pats = patients().filter(a => a.status === 'idle'), hs = healers();
  BED_SPOT.forEach(([tx, ty], i) => {
    const [x, y] = scr(tx, ty), spr = furnSprite('bedT', 1, 2, 14, F.bedT);
    it(tx + ty + 1.5, x, y, g => blitAt(g, spr, x, y), { x: x - 12, y: y - 10, w: 26, h: 22, win: 'b:temple' });
    if (pats[i]) sleeperAt(it, pats[i], tx + 0.5, ty + 0.55, t, true);
  });
  hs.forEach((h, i) => { const [tx, ty] = BED_SPOT[Math.min(BED_SPOT.length - 1, i * 2)]; advAt(it, h, tx + 1.4, ty + 0.6, 'pray', t, 'b', 1); });
}
/* 훈련소: 쉬는 모험가가 훈련한다 */
function trainScene(it, t) {
  staffAt(it, STAFF.coach, 7.6, 4.4, 'idle', t, 'f', 1);
  const night = isNight() || phaseOf(S.t) === 0;
  if (night) return;
  const list = living().filter(a => a.status === 'idle' && !a.inj && !a.post && (a.sleep || 0) <= 2).slice(0, TRAIN_SPOT.length);
  list.forEach((a, i) => { const [tx, ty] = TRAIN_SPOT[i]; advAt(it, a, tx, ty, i < 3 ? 'hammer' : 'idle', t + i * 0.37, i < 3 ? 'b' : 'f', i < 3 ? 0 : i % 2); });
}

/* ───────── 손님 ───────── */
const DOOR = [0.55, 6.5];
function custPath(i) {
  const [sx, sy] = STAND_POS[i];
  return [[1.3, 6.5], [1.3, sy + 1.35], [sx + 0.5, sy + 1.35]];
}
function spawnCust(i, buy) {
  if (HQ.cust.length >= 9 || !STAND_POS[i]) return;
  const s = S.shop.slots[i];
  const show = s ? (isGearKey(s.item) ? { icon: GTYPES[s.item.split(':')[1]].icon, c: TIER_COLORS[+s.item.split(':')[2]] } : s.item) : null;
  HQ.cust.push({ p: villager(Math.floor(Math.random() * 60) + 1), x: DOOR[0], y: DOOR[1], path: custPath(i), state: 'in', wait: 0, wt: 0, alpha: 0, dir: 'f', flip: 0, pose: 'walk', buy, show, stand: i });
}
function stepCust(dt, t) {
  for (const c of HQ.cust) {
    c.wt += dt;
    if (c.state === 'in' || c.state === 'out') c.alpha = Math.min(1, c.alpha + dt * 3);
    if (c.wait > 0) { c.wait -= dt; if (c.wait > 0) continue; }
    if (!c.path.length) {
      if (c.state === 'in') { c.state = 'look'; c.pose = 'idle'; c.dir = 'b'; c.flip = 0; c.wait = 1.4; continue; }
      if (c.state === 'look') { c.state = c.buy ? 'pay' : 'out'; c.path = c.buy ? [[1.3, c.y], [1.3, 2.4], [5.6, 2.4]] : [[1.3, c.y], [1.3, 6.5], DOOR]; c.pose = 'walk'; continue; }
      if (c.state === 'pay') {
        if (!c.paid) { c.paid = 1; c.pose = 'pay'; c.dir = 'b'; c.flip = 0; c.wait = 0.9; HQ.keeperPay = t + 0.9; const [x, y] = scr(c.x, c.y); HQ.fx.push({ k: 'coin', x, y: y - 26, t0: t, d: 1.1, v: c.buy }); continue; }
        c.state = 'out'; c.path = [[1.3, 2.4], [1.3, 6.5], DOOR]; c.pose = 'walk'; continue;
      }
      if (c.state === 'out') { c.alpha -= dt * 3; if (c.alpha <= 0) c.gone = 1; continue; }
    }
    const [px, py] = c.path[0], dx = px - c.x, dy = py - c.y, dist = Math.hypot(dx, dy), v = 1.7 * dt;
    if (dist <= v) { c.x = px; c.y = py; c.path.shift(); continue; }
    c.x += dx / dist * v; c.y += dy / dist * v;
    if (Math.abs(dx) > Math.abs(dy)) { c.dir = dx > 0 ? 'f' : 'b'; c.flip = dx > 0 ? 0 : 1; } else { c.dir = dy > 0 ? 'f' : 'b'; c.flip = dy > 0 ? 1 : 0; }
  }
  HQ.cust = HQ.cust.filter(c => !c.gone);
}
// 시뮬레이션의 판매 → 손님 한 명
function hqSale(i, g) { if (HQ.cur === 'shop0' && !document.hidden) HQ.pending.push([i, g]); }

/* ───────── 한 장면 ───────── */
// 거리를 오가는 사람들 (1층 아래 길에 보일 때만)
const streetY = f => scr(GN, GN, -SLAB - (f.lv - 1) * (WH + SLAB))[1];
function drawPeds(g, f, t, dt) {
  if (f.under) return;
  const y0 = streetY(f);
  if (y0 > HQ.H - 6) return;
  if (!HQ.peds) HQ.peds = [];
  while (HQ.peds.length < 4) { const d = Math.random() < 0.5 ? 1 : -1; HQ.peds.push({ p: villager(Math.floor(Math.random() * 80) + 1), x: d > 0 ? -10 - Math.random() * 120 : HQ.W + 10 + Math.random() * 120, d, v: 9 + Math.random() * 6, lane: Math.random() }); }
  for (const q of HQ.peds) {
    q.x += q.d * q.v * dt;
    const y = Math.round(Math.min(HQ.H - 4, y0 + 8 + q.lane * 26));
    g.save(); g.translate(Math.round(q.x), y); drawPerson(g, q.p, q.lane > 0.5 ? 'f' : 'b', 'walk', Math.floor((t + q.lane * 3) * 6) % 4, q.d < 0 ? (q.lane > 0.5 ? 1 : 0) : (q.lane > 0.5 ? 0 : 1)); g.restore();
  }
  HQ.peds = HQ.peds.filter(q => q.x > -140 && q.x < HQ.W + 140);
}
function drawFloor(g, f, t, T, night, dy, dt) {
  g.save(); g.translate(0, dy);
  g.drawImage(hqBase(f, T, clockDp(), night), 0, 0);
  const list = sceneOf(f, t).sort((a, b) => a.d - b.d || a.y - b.y);
  if (!dy) HQ.hits = [];
  for (const o of list) { o.draw(g); if (o.hit && !dy) HQ.hits.push(o.hit); }
  // 움직이는 것들
  if (f.id === 'smithy') { const [x, y] = scr(2, 1.6, 6); drawFire(g, Math.round(x), Math.round(y) + 2, t, true); }
  if (f.id === 'alchemy') { const [x, y] = scr(4, 4, 0); for (let i = 0; i < 4; i++) { const k = (t * 0.8 + i * 0.25) % 1; R(g, Math.round(x - 6 + i * 4 + Math.sin(t * 3 + i) * 2), Math.round(y - 10 - k * 12), 2, 2, k < 0.6 ? '#8af07a' : '#c8ffb0'); } }
  if (f.id === 'tower') { const [x, y] = scr(4.5, 4.5, 0); const k = (Math.sin(t * 2) + 1) / 2; g.globalAlpha = 0.25 + k * 0.3; ell(g, Math.round(x), Math.round(y), 30, 15, '#a87af0'); g.globalAlpha = 1; const oy = Math.round(y - 26 - Math.sin(t * 1.5) * 3); disc(g, Math.round(x), oy, 4, S.research && S.research.cur ? '#c89aff' : '#6a5a8a'); R(g, Math.round(x) - 1, oy - 2, 2, 1, '#ffffff'); }
  if (f.id === 'temple') for (const tx of [3.3, 5.7]) { const [x, y] = scr(tx, 0.5, 13); R(g, Math.round(x), Math.round(y) - 4, 1, 4, '#f0ece0'); R(g, Math.round(x), Math.round(y) - 6 - (Math.floor(t * 8) % 2), 1, 2, '#f7c04a'); }
  if (!dy) drawPeds(g, f, t, dt || 0);
  g.restore();
}
function hqLights(f, t) {
  const out = [];
  const add = (tx, ty, z, r, c) => { const [x, y] = scr(tx, ty, z); out.push({ x, y, r, c, glow: 1, flick: 1 }); };
  if (f.id === 'shop') { add(8.5, 6.5, 26, 46, '#f0c060'); add(6.5, 1, 20, 40, '#f0c060'); }
  if (f.id === 'inn') { add(1.5, 2, 20, 30, '#f0c060'); add(4.5, 2, 20, 30, '#f0c060'); add(7.5, 7, 20, 30, '#f0c060'); }
  if (f.id === 'temple') { add(4.5, 0.5, 16, 52, '#f7d070'); add(0.5, 3.5, 26, 34, '#f0c060'); add(8.5, 3.5, 26, 34, '#f0c060'); }
  if (f.id === 'training') add(4.5, 4.5, 40, 60, '#f0c060');
  if (f.id === 'alchemy') add(4, 4, 6, 48, '#7af070');
  if (f.id === 'kitchen') { add(2, 1, 4, 52, '#f08a3c'); add(0.5, 3.5, 26, 34, '#f0c060'); }
  if (f.id === 'tower') add(4.5, 4.5, 20, 56, '#b88aff');
  if (f.id === 'smithy') { add(2, 1.6, 8, 64, '#f08a3c'); add(5, 5, 30, 34, '#f0c060'); }
  if (f.id === 'bank') { add(0.5, 6.5, 26, 40, '#f0c060'); add(7.5, 1.5, 6, 30, '#f0d070'); }
  if (f.id === 'stable') { add(8.5, 1.5, 26, 40, '#f0c060'); add(2.5, 4.5, 20, 34, '#f0c060'); }
  if (f.id === 'library') { add(8.5, 7.5, 26, 40, '#f0c060'); add(4.5, 4.5, 18, 36, '#f0d070'); }
  if (f.id === 'airfield') { add(0.5, 4.5, 26, 40, '#f0c060'); add(3.5, 3, 20, 46, '#bfe0ff'); }
  return out;
}
function drawHQ(now, vt) {
  if (!HQ.cvs || !S) return;
  const t = vt != null ? vt : now / 1000, dt = Math.min(0.25, Math.max(0, t - (HQ.lastT || t)));
  HQ.lastT = t;
  const g = HQ.g, f = hqFloor(HQ.cur);
  if (f.key !== HQ.cur) HQ.cur = f.key;
  const dp = clockDp(), T = todAt(dp, 'town'), night = T.dark[1] > 0.3;
  // 손님 들이기
  if (f.id === 'shop') {
    while (HQ.pending.length) { const [i, gg] = HQ.pending.shift(); spawnCust(i, gg); }
    HQ.browse -= dt;
    if (HQ.browse <= 0) {
      HQ.browse = 9 / Math.max(0.5, traffic()) * (0.6 + Math.random() * 0.8);
      const live = S.shop.slots.map((s, i) => (s && stockOf(s.item) > 0 && i < STAND_POS.length ? i : -1)).filter(i => i >= 0);
      if (live.length) spawnCust(pickOne(live), 0);
    }
    stepCust(dt, t);
  } else HQ.pending.length = 0;
  g.clearRect(0, 0, HQ.W, HQ.H);
  const A = HQ.anim;
  if (A) {
    const k = Math.min(1, (now - A.t0) / 320), e = k * k * (3 - 2 * k), from = hqFloor(A.from);
    drawFloor(g, from, t, T, night, Math.round(A.dir * e * HQ.H), 0);
    drawFloor(g, f, t, T, night, Math.round(-A.dir * (1 - e) * HQ.H), 0);
    if (k >= 1) HQ.anim = null;
  } else {
    drawFloor(g, f, t, T, night, 0, dt);
    // 어둠과 불빛
    const dark = f.under ? 0.2 : T.dark[1] * 0.8;
    if (dark > 0.02) {
      const lights = hqLights(f, t), Lg = HQ.l;
      Lg.globalCompositeOperation = 'source-over'; Lg.clearRect(0, 0, HQ.W, HQ.H);
      Lg.globalAlpha = dark; Lg.fillStyle = f.under ? '#0a0608' : T.dark[0]; Lg.fillRect(0, 0, HQ.W, HQ.H); Lg.globalAlpha = 1;
      Lg.globalCompositeOperation = 'destination-out';
      for (const l of lights) { const gr = Lg.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); Lg.fillStyle = gr; Lg.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2); }
      Lg.globalCompositeOperation = 'source-over';
      g.drawImage(HQ.lc, 0, 0);
      g.save(); g.globalCompositeOperation = 'lighter';
      for (const l of lights) { const a = (0.06 + dark * 0.14) * (0.88 + Math.random() * 0.12), r = l.r * 0.55; const gr = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, r); gr.addColorStop(0, rgba(l.c, a.toFixed(3))); gr.addColorStop(1, rgba(l.c, 0)); g.fillStyle = gr; g.fillRect(l.x - r, l.y - r, r * 2, r * 2); }
      g.restore();
    }
    // 동전 같은 효과
    HQ.fx = HQ.fx.filter(x => t - x.t0 < x.d);
    for (const x of HQ.fx) { const k = (t - x.t0) / x.d; if (x.k === 'coin') { R(g, Math.round(x.x) - 2, Math.round(x.y - k * 10), 4, 4, '#f0c24a'); R(g, Math.round(x.x) - 1, Math.round(x.y - k * 10) + 1, 2, 2, '#fff2a0'); drawNum(g, Math.round(x.x) + 1, Math.round(x.y - 9 - k * 10), '+' + x.v, '#f0c24a'); } }
  }
  const c = HQ.ctx;
  c.imageSmoothingEnabled = false;
  c.drawImage(HQ.off, 0, 0, HQ.W, HQ.H, 0, 0, HQ.cvs.width, HQ.cvs.height);
}
// 화면을 누른 곳 → 그 자리의 것
function hqHit(cx, cy) {
  const r = HQ.cvs.getBoundingClientRect(), x = (cx - r.left) / r.width * HQ.W, y = (cy - r.top) / r.height * HQ.H;
  for (let i = HQ.hits.length - 1; i >= 0; i--) { const h = HQ.hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h; }
  return null;
}
