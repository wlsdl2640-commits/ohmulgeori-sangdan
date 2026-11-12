/* ───────── 상단 본부: 장소마다 한 장면 (빌드 62) ─────────
   옆으로 넘긴다: 왼쪽 = 지하(던전 수거소 · 대장간), 가운데 = 상점 · 본부, 오른쪽 = 선술집 · 위층 시설 · 비행장.
   장면은 실내를 앞에서 본 그림(벽지처럼 화면을 채운다). 늘 어둑하고 렌턴이 은은히 비추며, 창은 바깥 시간(낮 · 노을 · 밤)을 따른다.
   가까이 보는 장소(zoom)는 본부 판보다 작은 판에 그려 기기 화면으로 한 번에 늘린다. 시안과 결정은 scratchpad/hq2/DECISIONS.md */
const HQ = { cvs: null, ctx: null, W: 200, H: 400, top: 112, cur: 'shop0', anim: null, hits: [], hitK: null, shells: new Map(), views: {}, pending: [] };

const FLOOR_INFO = {
  salvage:  { name: '던전 수거소', win: 'b:salvage', under: 1 },
  smithy:   { name: '대장간', win: 'b:smithy', under: 1 },
  shop:     { name: '상점 · 본부', win: 'inv' },
  tavern:   { name: '선술집', win: 'guest' },
  port:     { name: '항구', win: 'port' },   // 빌드 65: 처음부터 열린 시설 (port68.js)
  alchemy:  { name: '연금술 공방', win: 'b:alchemy' },
  kitchen:  { name: '주방', win: 'b:kitchen' },
  training: { name: '훈련소', win: 'adv' },
  temple:   { name: '신전', win: 'b:temple' },
  inn:      { name: '여관', win: 'adv' },
  pen:      { name: '사육장', win: 'b:pen' },
  farm:     { name: '재배소', win: 'b:farm' },   // 빌드 65: 비닐하우스 (farm68.js)
  stable:   { name: '마구간', win: 'b:stable' },
  library:  { name: '도서관', win: 'b:library' },
  tower:    { name: '마탑', win: 'b:tower' },
  airfield: { name: '비행장', win: 'b:airfield' }
};
const SEATS = 6;   // 여관 한 장소의 자리 (2층 침대 셋)

/* 장소 목록 (왼쪽 → 오른쪽) */
function hqPlaces() {
  const b = S.bld, out = [];
  if (b.salvage) out.push({ id: 'salvage' });
  if (b.smithy) out.push({ id: 'smithy' });
  out.push({ id: 'shop' }, { id: 'tavern' }, { id: 'port' });
  if (b.alchemy) out.push({ id: 'alchemy' });
  if (b.kitchen) out.push({ id: 'kitchen' });
  if (b.training) out.push({ id: 'training' });
  if (b.temple) out.push({ id: 'temple' });
  const nInn = Math.max(1, Math.ceil(beds() / SEATS));
  for (let i = 0; i < nInn; i++) out.push({ id: 'inn', i });
  if (b.pen) out.push({ id: 'pen' });
  if (b.farm) out.push({ id: 'farm' });
  if (b.stable) out.push({ id: 'stable' });
  if (b.library) out.push({ id: 'library' });
  if (b.tower) out.push({ id: 'tower' });
  if (b.airfield) out.push({ id: 'airfield' });
  out.forEach(f => { f.key = f.id + (f.i || 0); f.under = FLOOR_INFO[f.id].under || 0; f.name = FLOOR_INFO[f.id].name + (f.id === 'inn' && nInn > 1 ? ' ' + (f.i + 1) : ''); });
  return out;
}
const hqPlace = key => { const L = hqPlaces(); return L.find(f => f.key === key) || L.find(f => f.id === 'shop'); };
// 장소 옮기기: 오른쪽 장소면 오른쪽에서 밀려 들어온다 (quiet면 바로)
function hqGo(key, quiet) {
  const L = hqPlaces(), to = L.find(f => f.key === key);
  if (!to || to.key === HQ.cur) return;
  const i0 = L.findIndex(f => f.key === HQ.cur), i1 = L.indexOf(to);
  HQ.anim = quiet || i0 < 0 ? null : { from: HQ.cur, dir: i1 > i0 ? 1 : -1, t0: null, d: 380 };
  HQ.cur = to.key;
  if (HOOKS.floor) HOOKS.floor();
}
function hqStep(d) { const L = hqPlaces(), i = L.findIndex(f => f.key === HQ.cur), j = Math.max(0, Math.min(L.length - 1, i + d)); if (j !== i) hqGo(L[j].key); }

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
const qF = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
const qP = (g, x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
function qL(g, x0, y0, x1, y1, c) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let e = dx + dy; g.fillStyle = c;
  for (let n = 0; n < 2000; n++) { g.fillRect(x0, y0, 1, 1); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
}
const qQ = (g, pts, c) => poly(g, pts, c);
const QRC = new Map();
function qR(c) {   // 색 단계: h 빛 · l 밝음 · b 바탕 · s 그늘 · d 어둠 · k 테
  let r = QRC.get(c); if (r) return r;
  r = { h: shade(c, 0.4), l: shade(c, 0.2), b: c, s: shade(c, -0.17), d: shade(c, -0.34), k: shade(c, -0.6) };
  QRC.set(c, r); return r;
}
// 투명 아닌 칸 둘레에 테 (n겹)
function qOut(cv, col, n = 1) {
  const g = cv.getContext('2d'), W = cv.width, H = cv.height;
  for (let k = 0; k < n; k++) {
    const a = g.getImageData(0, 0, W, H).data, m = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) m[i] = a[i * 4 + 3] > 16 ? 1 : 0;
    g.fillStyle = col;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (m[i]) continue;
      if ((x > 0 && m[i - 1]) || (x < W - 1 && m[i + 1]) || (y > 0 && m[i - W]) || (y < H - 1 && m[i + W])) g.fillRect(x, y, 1, 1);
    }
  }
}
// 그림 조각 (테 1칸 포함). fn(g, w, h)는 (0,0)~(w,h)에 그린다. 닻 (ax, ay)
const QS = new Map();
function qSpr(key, w, h, ax, ay, fn, ol = '#1c130e') {
  let s = QS.get(key); if (s) return s;
  const [cv, g] = mkCanvas(w + 2, h + 2); g.translate(1, 1); fn(g, w, h); g.setTransform(1, 0, 0, 1, 0, 0);
  if (ol) qOut(cv, ol);
  s = { cv, ax: ax + 1, ay: ay + 1 }; QS.set(key, s); return s;
}
function qB(g, s, x, y, flip) {
  x = Math.round(x); y = Math.round(y);
  if (!flip) { g.drawImage(s.cv, x - s.ax, y - s.ay); return; }
  g.save(); g.translate(x, y); g.scale(-1, 1); g.drawImage(s.cv, -s.ax, -s.ay); g.restore();
}
function qDisc(g, cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(Math.max(0, r * r - y * y))); qF(g, cx - w, cy + y, w * 2 + 1, 1, c); } }
function qEll(g, cx, cy, rx, ry, c) { for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); qF(g, cx - w, cy + y, w * 2 + 1, 1, c); } }
// 누르는 자리 (장면 판 좌표)
const hqHitAdd = (K, x, y, w, h, o) => { if (K.hits) K.hits.push(Object.assign({ x, y, w, h }, o)); };

/* ───────── 사람: 모험가 뭉툭 그림을 그대로 (굵은 칸 하나 = 한 픽셀) ───────── */
PX_WPN.none = '\n@\n';   // 빈손 (상인 · 손님 · 일꾼)
function qAdv(g, a, side, pose, fr, x, y, flip, Lx) {
  const s = side ? pxsAdvSprite(a, pose, fr, Lx) : pxAdvSprite(a, pose, fr, Lx);
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1); g.drawImage(s.cv, -s.ax, -s.ay); g.restore();
}
const hand0 = { base: 'none', t: 0, q: 0 };
const QPEO = {
  keeper: { a: { id: 7, cls: 'porter', look: { hair: '#5a3a22', skin: '#f1c9a5' }, eq: { weapon: hand0 } }, L: { head: 'band', body: 'tunic', ex: [], c1: '#e8dcb8', c2: '#7a5232', c3: '#a8432f', pants: '#4a3a2a', boots: '#5a3a22', leather: '#7a5232', hair: 'spiky' } },
  smith:  { a: { id: 4, cls: 'berserker', look: { hair: '#2b1d16', skin: '#c68a5e' }, eq: { weapon: { base: 'hammer', t: 2, q: 0 } } }, L: { head: 'band', body: 'bare', ex: [], c1: '#5a4030', c2: '#6a4a2e', c3: '#c0392b', metal: '#8a8a92', pants: '#4a3a2e', boots: '#3a2a20', leather: '#4a3424', hc: '#c0392b' } },
  groom:  { a: { id: 5, cls: 'porter', look: { hair: '#8a5a2b', skin: '#e0ac7e' }, eq: { weapon: hand0 } }, L: { head: 'beret', body: 'tunic', ex: [], c1: '#5f7a4a', c2: '#c9a04a', c3: '#a8432f', pants: '#5a4630', boots: '#6a4428', leather: '#6a4428', hc: '#8a5a2b', hair: 'spiky' } },
  cust1:  { a: { id: 8, cls: 'porter', look: { hair: '#c9a04a', skin: '#f1c9a5' }, eq: { weapon: hand0 } }, L: { head: 'beret', body: 'tunic', ex: ['bag'], c1: '#3f6a9a', c2: '#e8dcb8', c3: '#c0392b', pants: '#3a3040', boots: '#4a3424', leather: '#7a5232', hc: '#a8432f' } },
  cust2:  { a: { id: 9, cls: 'porter', look: { hair: '#7a2f22', skin: '#e0ac7e' }, eq: { weapon: hand0 } }, L: { head: 'widebrim', body: 'robe', ex: [], c1: '#8a5a9a', c2: '#e8c060', c3: '#e8dcb8', pants: '#4a3a4a', boots: '#3a2a3a', leather: '#6a4428', hc: '#c08a3a' } },
  cust3:  { a: { id: 10, cls: 'porter', look: { hair: '#2b1d16', skin: '#c68a5e' }, eq: { weapon: hand0 } }, L: { head: 'band', body: 'tunic', ex: ['pack'], c1: '#4f8a43', c2: '#c9a04a', c3: '#d8c060', pants: '#5a4a3a', boots: '#4a3424', leather: '#7a5232' } },
  cust4:  { a: { id: 11, cls: 'porter', look: { hair: '#d8d0c0', skin: '#f1c9a5' }, eq: { weapon: hand0 } }, L: { head: 'band', body: 'robe', ex: [], c1: '#5a6a7a', c2: '#c9a04a', c3: '#e8dcb8', pants: '#3a3040', boots: '#3a2a20', leather: '#6a4428' } },
  cust5:  { a: { id: 12, cls: 'porter', look: { hair: '#30304a', skin: '#c68a5e' }, eq: { weapon: hand0 } }, L: { head: 'beret', body: 'tunic', ex: [], c1: '#b86a8a', c2: '#e8dcb8', c3: '#3f6a9a', pants: '#4a3a4a', boots: '#3a2a3a', leather: '#6a4428', hc: '#3f6a9a' } },
  hand:   { a: { id: 13, cls: 'porter', look: { hair: '#5a3a22', skin: '#e0ac7e' }, eq: { weapon: hand0 } }, L: { head: 'goggles', body: 'coat', ex: [], c1: '#7a5a3a', c2: '#c9a04a', c3: '#a8432f', pants: '#4a3a2a', boots: '#3a2a20', leather: '#6a4428', hc: '#5a3a22' } },
  alchem: { a: { id: 41, cls: 'alchemist', look: { hair: '#c9a04a', skin: '#f1c9a5' }, eq: { weapon: { base: 'staff', t: 1, q: 0 } } }, L: { head: 'goggles', body: 'robe', ex: [], c1: '#4f7a5a', c2: '#c8b890', c3: '#7ae070', hc: '#5a3a22' } },
  cook:   { a: { id: 42, cls: 'porter', look: { hair: '#3a2a1a', skin: '#f1c9a5' }, eq: { weapon: hand0 } }, L: { head: 'band', body: 'tunic', ex: [], c1: '#f4f0e4', c2: '#c8402e', c3: '#f4f0e4', pants: '#4a3a2a', boots: '#3a2a20', leather: '#8a6a4a', hc: '#f4f0e4' } },
  coach:  { a: { id: 43, cls: 'warrior', look: { hair: '#5a3a22', skin: '#c68a5e' }, eq: { weapon: { base: 'sword', t: 1, q: 0 } } }, L: { head: 'band', body: 'leather', ex: [], c1: '#a8432f', c2: '#c9a04a', c3: '#a8432f', hc: '#a8432f' } },
  priest: { a: { id: 44, cls: 'cleric', look: { hair: '#d8d0c0', skin: '#e0ac7e' }, eq: { weapon: hand0 } }, L: { head: 'coif', body: 'robe', ex: [], c1: '#f4f0e6', c2: '#d9b44a', hc: '#f8f4ec' } },
  sage:   { a: { id: 45, cls: 'mage', look: { hair: '#e8e4dc', skin: '#f1c9a5' }, eq: { weapon: { base: 'staff', t: 3, q: 0 } } }, L: { head: 'wizard', body: 'robe', c1: '#3f2f6a', c2: '#d9b44a', hc: '#3f2f6a', gem: '#8ae8ff', hair: 'long', hairc: '#e8e4dc' } },
  salv1:  { a: { id: 47, cls: 'porter', look: { hair: '#3a2a1a', skin: '#c68a5e' }, eq: { weapon: hand0 } }, L: { head: 'beret', body: 'tunic', ex: ['pack'], c1: '#5a6a3a', c2: '#c9a04a', c3: '#8a6a3a', hc: '#8a6a3a' } },
  salv2:  { a: { id: 48, cls: 'porter', look: { hair: '#8a5a2a', skin: '#f1c9a5' }, eq: { weapon: hand0 } }, L: { head: 'band', body: 'tunic', ex: [], c1: '#6a4a3a', c2: '#c9a04a', c3: '#a8432f', hc: '#a8432f' } },
  salv3:  { a: { id: 49, cls: 'porter', look: { hair: '#d8d0c0', skin: '#e0ac7e' }, eq: { weapon: hand0 } }, L: { head: 'goggles', body: 'coat', ex: ['pack'], c1: '#4a5a6a', c2: '#c9a04a', c3: '#8a6a3a', hc: '#4a5a6a' } }
};
const qPeo = (k, g, side, pose, fr, x, y, flip) => { const p = QPEO[k]; qAdv(g, p.a, side, pose, fr, x, y, flip, Object.assign({}, PXL[p.a.cls], p.L)); };
// 모험가 (그 사람 그대로)
function q4Spr(g, a, side, pose, fr, x, y, flip) { if (!a) return; const s = side ? pxsAdvSprite(a, pose, fr) : pxAdvSprite(a, pose, fr); g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1); g.drawImage(s.cv, -s.ax, -s.ay); g.restore(); }
// 뒷모습: 앞모습 격자에서 얼굴 글자를 머리칼로 바꿔 굽는다
const QBK = {};
function qBackSpr(k, fr) {
  const p = QPEO[k], L = Object.assign({}, PXL[p.a.cls], p.L), key = 'QB|' + k + fr;
  if (QBK[key]) return QBK[key];
  const g = pxAdvGrid(p.a, 'idle', fr, L);
  for (let y = HY - 3; y < BY - 1; y++) for (let x = BX - 2; x < BX + 18; x++) { const ch = g[y] && g[y][x]; if (ch && 'SstkwpmE'.includes(ch)) g[y][x] = y >= BY - 3 ? 'h' : (x <= BX + 2 || x >= BX + 13) ? 'h' : 'H'; }
  return (QBK[key] = pxBake(key, g, Object.assign(pxPal(L, p.a.look), pxOffPal(p.a)), BX + 8, BY + 13));
}
function qPeoBack(k, g, fr, x, y) { const s = qBackSpr(k, fr); g.drawImage(s.cv, Math.round(x) - s.ax, Math.round(y) - s.ay); }
// 쿨쿨 (z 셋이 떠오르며 커진다)
const QZG = { 3: ['###', '.#.', '###'], 4: ['####', '..#.', '.#..', '####'], 5: ['#####', '...#.', '..#..', '.#...', '#####'] };
const QZS = {};
function qZspr(n) {
  if (QZS[n]) return QZS[n];
  const G = QZG[n], [c, g] = mkCanvas(n + 2, n + 2);
  G.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') qP(g, x + 1, y + 1, '#f4f8ff'); }));
  qOut(c, '#2a3048', 1);
  return (QZS[n] = c);
}
function qZ(g, x, y, t, ph) {
  for (let i = 0; i < 3; i++) {
    const k = ((t * 0.4 + ph + i / 3) % 1);
    if (k > 0.9) continue;
    const n = k < 0.3 ? 3 : k < 0.62 ? 4 : 5, zx = Math.round(x + k * 8 + Math.sin(k * 6 + ph) * 1.5), zy = Math.round(y - k * 16);
    g.globalAlpha = k > 0.72 ? 0.6 : 1; g.drawImage(qZspr(n), zx - 1, zy - 1); g.globalAlpha = 1;
  }
}
// 짐승 그림을 너비 w 안팎으로 (옛 말 그림은 작아서 두 배까지 키운다)
const hqFit = (id, w) => Math.min(2, w / monW(id));
function hqMon(g, id, x, y, t, z, flip, ph) {
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1);
  try { drawMon(g, id, t, { ph: ph || 0, z }); } catch (_) {}
  g.restore();
}

/* ───────── 상단에 있는 모험가가 지금 어디에 있는지 ─────────
   원정 안 나간 모험가: 신전(치유사 · 환자) → 여관(졸리거나 다쳤거나 밤) → 훈련소(낮, 넷까지) → 도서관(하나) → 선술집 */
function hqWhere() {
  const ph = phaseOf(S.t), night = ph === 3 || ph === 0, out = { heal: [], sick: [], inn: new Set(), train: [], lib: [], tav: [] };
  for (const a of living()) {
    if (a.status !== 'idle') continue;
    if (a.post === 'temple' && S.bld.temple) { out.heal.push(a); continue; }
    if (a.inj && S.bld.temple) { out.sick.push(a); continue; }
    if ((a.sleep || 0) > 2 || a.inj || night) { out.inn.add(a.id); continue; }
    if (S.bld.training && out.train.length < 4) { out.train.push(a); continue; }
    if (S.bld.library && !out.lib.length) { out.lib.push(a); continue; }
    out.tav.push(a);
  }
  return out;
}
const hqHome = p => !p.exp;   // 원정에 안 나간 파티
// 마구간 짐승: 산 말(원정 나간 파티가 맨 말은 빼고) + 집에 있는 파티가 맨 땅짐승 펫. 날개 달린 짐승은 비행장으로
function hqStableAnimals() {
  const out = [], H = (S.stable && S.stable.horses) || {};
  for (const k of HORSE_BUY) { const n = (H[k] || 0) - S.parties.reduce((c, p) => c + (!hqHome(p) && p.horse === 'h:' + k ? 1 : 0) + (!hqHome(p) && p.horse2 === 'h:' + k ? 1 : 0), 0); for (let i = 0; i < n; i++) out.push({ id: 'horse_' + k }); }
  for (const p of S.parties) for (const hk of [p.horse, p.horse2]) {   // 빌드 65: 둘째 마차에 맨 펫도
    if (!hk || !hk.startsWith('p:') || !hqHome(p)) continue;
    const pet = petById(+hk.slice(2)), k = pet && horseOfPet(pet.kind);
    if (pet && !(k && HORSES[k].fly)) out.push({ id: petLook(pet), pet: pet.id });
  }
  // 빌드 65: 상단에 있는 랑기수 · 용기수의 탈것 (늑대 · 와이번) — 낮에는 서 있고 밤에는 웅크려 잔다
  for (const a of S.advs) if (a.status !== 'away' && rideKind(a)) out.push({ ride: a.id });
  return out;
}
// 마구간의 탈것 한 마리 (기수 없이): 낮 = 옆모습 서 있기 · 밤 = 자는 모습, 너비 w 안으로
function hqRide(g, aid, x, y, t, w, flip, night, ph) {
  const a = advById(aid), k = a && rideKind(a); if (!k) return 0;
  const fr = Math.floor(t * 1.2 + (ph || 0)) % 2, s = night ? rideSleepSpr(a, fr) : rideMSpr(k, rideLook(a, k), 'side', 'idle' + fr), z = Math.min(1, w / s.w);
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1); g.scale(z, z); pxBlit(g, s); g.restore();
  return Math.round(s.ay * z);
}
const hqFlyers = () => S.parties.filter(hqHome).flatMap(p => [p.horse, p.horse2]).filter(hk => hk && hk.startsWith('p:')).map(hk => petById(+hk.slice(2))).filter(pet => { const k = pet && horseOfPet(pet.kind); return k && HORSES[k].fly; });
const hqShips = () => S.parties.filter(p => hqHome(p) && p.wagon && WAGONS[p.wagon] && WAGONS[p.wagon].fly);

/* ───────── 바탕 · 가구 조각 ───────── */
function bgSky(g, W, H, T, y1) {
  const s = T.sky;
  for (let y = 0; y < y1; y += 2) { const k = y / y1; qF(g, 0, y, W, 2, k < 0.55 ? mix(s[0], s[1], k / 0.55) : mix(s[1], s[2], (k - 0.55) / 0.45)); }
  if (T.star > 0.05) { const r = rng(3); g.globalAlpha = T.star; for (let i = 0; i < 46; i++) qP(g, r() * W, r() * y1 * 0.8, '#ffffff'); g.globalAlpha = 1; }
}
function bgCloud(g, x, y, w, T, a = 1) {   // 뭉게구름 (두 톤, 아래가 평평)
  const c = mix('#ffffff', T.sky[1], 0.12), cs = mix('#d8e4f0', T.sky[2], 0.3), r = rng(Math.round(x * 7 + y * 13));
  g.globalAlpha = a;
  const n = Math.max(2, Math.round(w / 9));
  for (let i = 0; i < n; i++) { const px = x + 4 + (w - 8) * i / (n - 1), rr = 4 + Math.round(r() * 4 + (i > 0 && i < n - 1 ? 2 : 0)); qDisc(g, px, y - rr + 4, rr, c); }
  qF(g, x, y, w, 3, cs); qF(g, x + 2, y + 3, w - 4, 1, shade(cs, -0.08));
  g.globalAlpha = 1;
}
const aCounter = (w) => qSpr('aCounter' + w, w, 20, 0, 20, (g) => {
  qF(g, 0, 0, w, 5, '#d4a46a'); qF(g, 0, 0, w, 1, '#f0c890'); qF(g, 0, 4, w, 1, '#8a5a30');
  qF(g, 1, 5, w - 2, 15, '#a8743e'); for (let x = 3; x < w - 4; x += 11) { qF(g, x, 8, 9, 9, '#94643a'); qF(g, x, 8, 9, 1, '#7a5030'); qF(g, x, 16, 9, 1, '#c08a50'); }
  qF(g, 1, 18, w - 2, 2, '#6e4626');
});
const aBarrel = (fill) => qSpr('aBarrel' + fill, 14, 16, 7, 16, (g) => {
  qEll(g, 7, 9, 6, 7, '#8a5a30'); qF(g, 1, 4, 12, 10, '#9a6a3a'); qF(g, 3, 4, 3, 10, '#b08048'); qF(g, 10, 4, 2, 10, '#7a4e28');
  for (const y of [5, 11]) qF(g, 1, y, 12, 1, '#5a5a62');
  qEll(g, 7, 3, 6, 2, '#6e4626'); qEll(g, 7, 3, 5, 1, '#4e3018');
  if (fill === 'water') { qEll(g, 7, 3, 5, 1, '#5a8ab0'); qP(g, 5, 3, '#9ac8e8'); }
});
const aCrate = (w, h, c0) => qSpr('aCrate' + w + h + c0, w, h, 0, h, (g) => {
  const c = qR(c0 || '#b08454');
  qF(g, 0, 0, w, h, c.b); qF(g, 0, 0, w, 2, c.l); qF(g, 0, h - 2, w, 2, c.s);
  qF(g, 0, 0, 2, h, c.s); qF(g, w - 2, 0, 2, h, c.s);
  qL(g, 2, 2, w - 3, h - 3, c.s); qL(g, 2, h - 3, w - 3, 2, c.s);
});
const aSack = (c0) => qSpr('aSack' + c0, 11, 11, 5, 11, (g) => { const c = qR(c0); qEll(g, 5, 7, 5, 4, c.b); qF(g, 2, 3, 7, 5, c.b); qF(g, 3, 1, 5, 3, c.s); qF(g, 4, 0, 3, 1, c.d); qF(g, 2, 4, 2, 4, c.l); qF(g, 7, 8, 3, 2, c.s); });
// 게시판 (종이는 따로 — 의뢰 · 손님 수만큼)
const aBoard = () => qSpr('aBoard0', 26, 20, 0, 0, (g) => { qF(g, 0, 0, 26, 20, '#6e4626'); qF(g, 2, 2, 22, 16, '#b8905a'); qF(g, 2, 2, 22, 1, '#9a7448'); });
const BOARD_NOTE = [[4, 4], [11, 3], [17, 5], [5, 11], [12, 10], [18, 12]];
function hqNotes(g, x, y, n, hl) {   // (빌드 62 옛 쪽지 — 빌드 63부터 hqNotes2를 쓴다) 게시판 (x, y)에 종이 n장 · hl(i)면 노란 종이
  for (let i = 0; i < Math.min(6, n); i++) { const [dx, dy] = BOARD_NOTE[i], c = hl && hl(i) ? '#fff2a0' : '#f4ecd8'; qF(g, x + 1 + dx, y + 1 + dy, 5, 6, c); qF(g, x + 2 + dx, y + 3 + dy, 3, 1, '#9a9080'); qF(g, x + 2 + dx, y + 5 + dy, 2, 1, '#9a9080'); qP(g, x + 3 + dx, y + 1 + dy, '#d04040'); }
}
const aBanner = (c0, emb) => qSpr('aBan' + c0 + emb, 22, 22, 11, 0, (g) => {
  const c = qR(c0);
  qF(g, 0, 0, 22, 2, '#5e4028'); qF(g, 2, 2, 18, 14, c.b); qF(g, 2, 2, 2, 14, c.l); qF(g, 17, 2, 3, 14, c.s);
  qQ(g, [[2, 16], [11, 21], [20, 16]], c.b); qQ(g, [[14, 18], [11, 21], [20, 16], [20, 15]], c.s);
  qF(g, 3, 3, 16, 1, '#e8c060');
  if (emb === 'shoe') { qF(g, 7, 6, 2, 7, '#c8ccd4'); qF(g, 13, 6, 2, 7, '#c8ccd4'); qF(g, 8, 12, 6, 2, '#c8ccd4'); qF(g, 9, 6, 4, 1, c.b); }
  if (emb === 'anvil') { qF(g, 6, 7, 10, 3, '#9aa0aa'); qF(g, 4, 7, 3, 2, '#9aa0aa'); qF(g, 9, 10, 4, 3, '#7a808a'); qF(g, 7, 13, 8, 2, '#7a808a'); qF(g, 6, 7, 10, 1, '#c8ccd4'); }
});
const aClock = () => qSpr('aClock', 10, 10, 5, 5, (g) => { qDisc(g, 5, 5, 5, '#6e4626'); qDisc(g, 5, 5, 4, '#f4ecd8'); qF(g, 5, 2, 1, 4, '#3a3040'); qF(g, 5, 5, 3, 1, '#3a3040'); qP(g, 5, 1, '#c08a20'); });
const aHay = (w, h) => qSpr('aHay' + w + h, w, h, 0, h, (g) => {   // 건초 덩이 (끈 두 줄)
  qF(g, 0, 1, w, h - 1, '#d8b050'); qF(g, 0, 1, w, 2, '#f0d070'); qF(g, 0, h - 2, w, 2, '#a88228');
  const r = rng(w * 7 + h); for (let k = 0; k < w * h / 6; k++) qF(g, Math.floor(r() * w), 2 + Math.floor(r() * (h - 3)), 2, 1, r() < 0.5 ? '#f0d070' : '#b8902e');
  for (const x of [Math.floor(w * 0.28), Math.floor(w * 0.7)]) qF(g, x, 1, 1, h - 1, '#8a5a30');
  for (let x = 1; x < w; x += 3) qP(g, x, 0, '#e8c460');
});
const aHayPile = (w) => qSpr('aHayPile' + w, w, 9, w >> 1, 9, (g) => {
  qEll(g, w >> 1, 6, (w >> 1) - 1, 3, '#c8a040'); qEll(g, w >> 1, 5, (w >> 1) - 3, 3, '#e0bc58');
  const r = rng(w); for (let k = 0; k < w; k++) { const x = Math.floor(r() * w), y = 3 + Math.floor(r() * 6); qF(g, x, y, 2, 1, r() < 0.5 ? '#f4d878' : '#a88228'); }
}, null);
const aNest2 = (rx, ry) => qSpr('aNest2' + rx + 'x' + ry, rx * 2 + 4, ry * 2 + 5, rx + 2, ry * 2 + 4, (g) => {   // 빌드 63: 엮은 둥지 (테 · 오목한 안 · 잔가지 · 삐친 지푸라기)
  const cx = rx + 2, cy = ry + 2, r = rng(rx * 13 + ry);
  qEll(g, cx, cy + 1, rx, ry, '#5e3a14'); qEll(g, cx, cy, rx, ry, '#8a6a20'); qEll(g, cx, cy - 1, Math.max(2, rx - 5), Math.max(1, ry - 3), '#4a2e10'); qEll(g, cx, cy, Math.max(1, rx - 7), Math.max(1, ry - 4), '#6a4a18');
  for (let k = 0; k < rx * 3; k++) { const a = r() * Math.PI * 2, px = Math.round(cx + Math.cos(a) * (rx - 2)), py = Math.round(cy + Math.sin(a) * Math.max(1, ry - 1)); qF(g, px - 1, py, 3, 1, r() < 0.45 ? '#c8a040' : r() < 0.5 ? '#a07a28' : '#e0bc58'); }
  for (let k = 0; k < Math.max(3, rx >> 2); k++) { const px = cx - rx + 2 + Math.floor(r() * (rx * 2 - 4)); qF(g, px, cy - ry - 1 + Math.floor(r() * 2), 1, 2, '#e8c460'); }
});
const aTrough = (w) => qSpr('aTrough' + w, w, 8, 0, 8, (g) => { qF(g, 0, 0, w, 8, '#8a5a30'); qF(g, 0, 0, w, 1, '#b08048'); qF(g, 1, 1, w - 2, 2, '#4a7aa8'); qF(g, 1, 1, w - 2, 1, '#8ac0e8'); qF(g, 1, 6, w - 2, 2, '#6e4626'); qF(g, 1, 7, 2, 1, '#4e3018'); qF(g, w - 3, 7, 2, 1, '#4e3018'); });
const aSaddle = () => qSpr('aSaddle', 14, 9, 7, 9, (g) => { qEll(g, 7, 4, 6, 3, '#8a4a24'); qF(g, 2, 2, 10, 3, '#a85a2c'); qF(g, 3, 1, 3, 2, '#6e3418'); qF(g, 10, 1, 2, 2, '#6e3418'); qF(g, 6, 5, 2, 4, '#5e3018'); qF(g, 5, 8, 4, 1, '#c8ccd4'); qP(g, 4, 2, '#c87a44'); });
const aForge = () => qSpr('aForge', 44, 64, 22, 64, (g) => {   // 벽돌 화덕 + 갓 + 굴뚝
  qF(g, 15, 0, 14, 22, '#5e544e'); for (let y = 2; y < 22; y += 4) qF(g, 15 + ((y >> 2) % 2) * 3, y, 11, 1, '#4a4240');
  qQ(g, [[4, 34], [40, 34], [31, 21], [13, 21]], '#6a5e56'); qQ(g, [[6, 33], [38, 33], [30, 23], [14, 23]], '#7a6e66'); qF(g, 4, 33, 36, 3, '#4a4240');
  qF(g, 2, 36, 40, 28, '#9a5a40'); for (let y = 38, row = 0; y < 64; y += 4, row++) for (let x = 2 + (row % 2) * 4; x < 42; x += 8) { qF(g, x, y, 7, 3, '#a8644a'); qF(g, x, y, 7, 1, '#c07a5a'); }
  qF(g, 0, 36, 44, 3, '#5e544e'); qF(g, 0, 36, 44, 1, '#8a807a');
  qQ(g, [[10, 64], [10, 50], [14, 45], [30, 45], [34, 50], [34, 64]], '#2a1410'); qQ(g, [[13, 64], [13, 51], [16, 48], [28, 48], [31, 51], [31, 64]], '#5a1a0e');
  qF(g, 8, 61, 28, 3, '#3a3434');
});
const aAnvil = () => qSpr('aAnvil', 22, 18, 11, 18, (g) => {
  qF(g, 6, 9, 10, 9, '#6e4a2c'); qF(g, 6, 9, 2, 9, '#8a6038'); qF(g, 14, 9, 2, 9, '#4e3420'); qF(g, 5, 16, 12, 2, '#5e3e24');
  qF(g, 3, 1, 15, 4, '#8a909a'); qQ(g, [[0, 1], [3, 1], [3, 4]], '#8a909a'); qF(g, 18, 1, 3, 2, '#8a909a'); qF(g, 3, 1, 18, 1, '#d8dce4'); qF(g, 7, 5, 8, 2, '#6a707a'); qF(g, 5, 7, 12, 2, '#5a6068'); qF(g, 3, 4, 15, 1, '#5a6068');
});
const aRack = () => qSpr('aRack', 34, 30, 0, 30, (g) => {   // 무기 걸이 (벽)
  qF(g, 0, 4, 34, 3, '#6e4626'); qF(g, 0, 22, 34, 3, '#6e4626'); qF(g, 0, 4, 34, 1, '#9a6a3e'); qF(g, 0, 22, 34, 1, '#9a6a3e');
  for (const [x, len, c] of [[4, 24, '#c8ccd4'], [10, 20, '#d8dce4'], [16, 26, '#c8ccd4']]) { qF(g, x, 26 - len, 2, len - 6, c); qF(g, x + 1, 26 - len, 1, len - 6, '#8a8e98'); qF(g, x - 2, 20, 6, 2, '#c9a04a'); qF(g, x, 22, 2, 5, '#5e3a20'); }
  qF(g, 24, 2, 2, 27, '#8a5a30'); qQ(g, [[21, 3], [29, 3], [29, 11], [26, 13], [21, 9]], '#9aa0aa'); qF(g, 22, 4, 6, 1, '#d8dce4');
  qF(g, 31, 0, 1, 30, '#8a5a30'); qQ(g, [[29, 0], [33, 0], [31, -4]], '#c8ccd4');
});
const aArmor = () => qSpr('aArmor', 18, 34, 9, 34, (g) => {
  qF(g, 8, 18, 2, 14, '#6e4626'); qF(g, 3, 31, 12, 3, '#5e3e24');
  qF(g, 3, 9, 12, 11, '#9aa4b0'); qF(g, 3, 9, 12, 2, '#c8d0dc'); qF(g, 8, 10, 2, 9, '#7a8490'); qF(g, 1, 9, 3, 4, '#8a94a0'); qF(g, 14, 9, 3, 4, '#8a94a0');
  qF(g, 5, 1, 8, 7, '#9aa4b0'); qF(g, 5, 1, 8, 2, '#c8d0dc'); qF(g, 6, 4, 6, 1, '#2a2a3a'); qF(g, 8, 0, 2, 2, '#c0392b');
});
const aGrind = () => qSpr('aGrind', 20, 18, 10, 18, (g) => { qF(g, 2, 12, 2, 6, '#6e4626'); qF(g, 16, 12, 2, 6, '#6e4626'); qF(g, 1, 11, 18, 2, '#8a5a30'); qDisc(g, 10, 8, 7, '#8a8e98'); qDisc(g, 10, 8, 5, '#a4a8b0'); qDisc(g, 10, 8, 1, '#4a4a52'); qF(g, 17, 7, 3, 1, '#6e4626'); });
const aCoal = () => qSpr('aCoal', 20, 8, 10, 8, (g) => { qEll(g, 10, 5, 9, 3, '#24222a'); const r = rng(4); for (let k = 0; k < 18; k++) qF(g, 2 + Math.floor(r() * 16), 2 + Math.floor(r() * 5), 2, 1, r() < 0.5 ? '#4a4856' : '#121016'); }, null);
function aSparks(g, x, y, t) { for (let i = 0; i < 6; i++) { const k = ((t * 1.6 + i * 0.17) % 1), a = -0.4 - i * 0.45; if (k > 0.6) continue; qP(g, x + Math.cos(a) * k * 18, y - Math.sin(-a) * k * 10 - k * 6 + k * k * 14, k < 0.3 ? '#fff4b0' : '#f0a040'); } }
const aCrest = () => qSpr('a2Crest', 36, 30, 18, 0, (g) => {   // 상단 문장 판 (나무 방패 꼴 · 금화 · 붉은 띠)
  qQ(g, [[2, 0], [34, 0], [34, 18], [18, 29], [2, 18]], '#6e4626'); qQ(g, [[4, 2], [32, 2], [32, 17], [18, 26], [4, 17]], '#9a6a3e');
  qF(g, 4, 2, 28, 2, '#b88a54'); qDisc(g, 18, 13, 6, '#c08a20'); qDisc(g, 18, 13, 5, '#f0c24a'); qDisc(g, 17, 12, 2, '#fff2a0'); qF(g, 17, 10, 2, 7, '#c08a20');
  qF(g, 0, 20, 36, 4, '#b8322a'); qF(g, 0, 20, 36, 1, '#e05a4a'); qQ(g, [[0, 20], [-1, 26], [3, 24]], '#8a2218'); qQ(g, [[36, 20], [37, 26], [33, 24]], '#8a2218');
});
const aShip = (flip) => qSpr('a2Ship' + flip, 86, 62, 43, 62, (g) => {   // 비행선: 천 기구 · 나무 선체 · 선실 · 프로펠러
  const ex = 43, ey = 18;
  qEll(g, ex, ey, 40, 17, '#c8b48a'); qEll(g, ex, ey - 2, 38, 14, '#e8d8b4'); qEll(g, ex - 6, ey - 7, 22, 6, '#f8ecd0');
  for (const dx of [-26, -13, 0, 13, 26]) for (let y = -15; y <= 15; y++) { const w = 40 * Math.sqrt(Math.max(0, 1 - (y * y) / 289)); if (Math.abs(dx) < w - 2) qP(g, ex + dx + Math.round(dx * (Math.abs(y) / 40)), ey + y, '#b8a47a'); }
  qF(g, ex - 38, ey - 1, 76, 3, '#b8322a'); qF(g, ex - 38, ey - 1, 76, 1, '#e05a4a');
  qQ(g, [[ex + 36, ey - 2], [ex + 46, ey - 10], [ex + 44, ey + 4]], '#b8322a');
  for (const [a, b] of [[-28, -26], [-12, -14], [12, 10], [28, 24]]) qL(g, ex + a, ey + 13, ex + b, 44, '#6e5a44');
  qQ(g, [[ex - 32, 44], [ex + 30, 44], [ex + 24, 56], [ex - 26, 56]], '#8a5a30'); qF(g, ex - 32, 44, 62, 3, '#b08048'); qF(g, ex - 26, 54, 50, 2, '#6e4626');
  for (const dx of [-18, -6, 6, 18]) { qDisc(g, ex + dx, 50, 2, '#c9a04a'); qP(g, ex + dx, 50, '#9cc8ec'); }
  qF(g, ex - 33, 42, 64, 2, '#c9a04a');
  qF(g, ex + 30, 46, 3, 8, '#6e4626'); qF(g, ex + 33, 44, 2, 12, '#9aa0aa');
  qF(g, ex - 8, 36, 12, 8, '#a07448'); qF(g, ex - 6, 38, 3, 3, '#9cc8ec'); qF(g, ex - 9, 35, 14, 2, '#6e4626');
  qF(g, ex - 30, 30, 1, 14, '#5e3a20'); qQ(g, [[ex - 29, 30], [ex - 20, 33], [ex - 29, 36]], '#3f6a9a');
}, '#1c130e');

/* ───────── 장면 판 크기 · 빛 · 창 · 벽 · 바닥 ───────── */
// 가까이(z)면 본부 판보다 작은 판. top = 메뉴 아래(볼거리가 시작되는 줄), bot = 장소 판 위
function hqGeo(z) {
  const W = Math.round(HQ.W / z), H = Math.round(HQ.H / z);
  return { W, H, z, top: Math.round(HQ.top / z), bot: H - Math.round(40 / z), cx: W >> 1 };
}
// 빛: 실내는 늘 어둑하고 등불이 은은히 · 창은 바깥 시간 (낮엔 밝은 하늘과 빛살, 밤엔 어둔 하늘)
const Q3LC = {};
function q3Night(T) { return Math.max(0, Math.min(1, T.dark[1] / 0.7)); }
function q3Light(g, K, T, L, t) {
  const nt = q3Night(T), amt = Math.min(0.84, L.amb + nt * (L.ambN != null ? L.ambN : 0.26));
  // 빌드 63 (사용자 「다고쳐」): 둥근 흐린 빛 → 투명도를 계단으로 끊고 4×4 바둑 무늬로 잇는 도트 빛. 같은 장면 · 같은 때면 다시 굽지 않는다 (불빛 흔들림은 뺐다)
  const key = `${K.W}x${K.H}|${amt.toFixed(3)}|${nt.toFixed(2)}|${L.tint || ''}|${JSON.stringify([L.lamps, L.wins, L.soft])}`;
  const C = Q3LC.cache || (Q3LC.cache = new Map());
  let e = C.get(key);
  if (!e) {
    const [c, x] = mkCanvas(K.W, K.H);
    x.globalAlpha = amt; x.fillStyle = L.tint || '#0c0812'; x.fillRect(0, 0, K.W, K.H); x.globalAlpha = 1;
    x.globalCompositeOperation = 'destination-out';
  const hole = (px, py, r, a) => { const gr = x.createRadialGradient(px, py, 0, px, py, r); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(0.5, `rgba(0,0,0,${a * 0.6})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(px - r, py - r, r * 2, r * 2); };
    for (const [lx, ly, r] of L.lamps || []) hole(lx, ly, r, 0.95);
  for (const [wx, wy, ww, wh] of L.wins || []) { x.fillStyle = 'rgba(0,0,0,1)'; x.fillRect(wx, wy, ww, wh); hole(wx + ww / 2, wy + wh / 2, Math.max(ww, wh) * 0.9, 0.55 * (1 - nt)); }
  for (const [ax, ay, r, a] of L.soft || []) hole(ax, ay, r, a);
    x.globalCompositeOperation = 'source-over';
    q3Dither(x, K.W, K.H, amt, 4);
    const [c2, y2] = mkCanvas(K.W, K.H);   // 등불 빛도 계단 + 바둑 무늬로
    for (const [lx, ly, r, col] of L.lamps || []) { const rr = r * 0.66, gr = y2.createRadialGradient(lx, ly, 0, lx, ly, rr); gr.addColorStop(0, rgba(col || '#f8b048', 0.32)); gr.addColorStop(1, rgba(col || '#f8b048', 0)); y2.fillStyle = gr; y2.fillRect(lx - rr, ly - rr, rr * 2, rr * 2); }
    q3Dither(y2, K.W, K.H, 0.32, 3);
    e = { c, c2 }; if (C.size > 48) C.clear(); C.set(key, e);
  }
  g.drawImage(e.c, 0, 0);
  g.save(); g.globalCompositeOperation = 'lighter';
  g.globalAlpha = Math.min(1, (0.2 + nt * 0.12) / 0.32); g.drawImage(e.c2, 0, 0); g.globalAlpha = 1;
  if (nt < 0.85) {   // 낮 창 빛살: 창에서 바닥 쪽으로 비스듬히 — 빌드 63: 반투명 띠 대신 바둑 무늬 칸 (도트)
    g.globalAlpha = Math.min(1, 0.22 * (1 - nt)); g.fillStyle = Q3LC.pat || (Q3LC.pat = g.createPattern(mkCanvas(2, 2).map((v, i) => { if (i === 1) { v.fillStyle = '#fff4d0'; v.fillRect(0, 0, 1, 1); v.fillRect(1, 1, 1, 1); } return v; })[0], 'repeat'));
    for (const [wx, wy, ww, wh, len] of L.wins || []) { const l = len || 60; for (let k = 0; k < l; k++) g.fillRect(Math.round(wx + k * 0.45), wy + wh + k, ww, 1); }
  }
  g.restore();
}
// 창 유리: 바깥 하늘 (낮 · 노을 · 밤 + 별)
function q3Glass(g, x, y, w, h, T, seed) {
  const s = T.sky, nt = q3Night(T);
  for (let yy = 0; yy < h; yy++) qF(g, x, y + yy, w, 1, mix(s[0], s[2], yy / Math.max(1, h - 1)));
  if (nt > 0.4) { const r = rng(seed || 3); g.globalAlpha = Math.min(1, (nt - 0.4) * 2); for (let k = 0; k < Math.max(2, w * h / 40); k++) qP(g, x + r() * w, y + r() * h * 0.8, '#ffffff'); g.globalAlpha = 1; }
  else { g.globalAlpha = 0.5; qF(g, x + 2, y + h - 5, Math.max(2, w >> 1), 3, '#ffffff'); qF(g, x + 4, y + h - 7, Math.max(2, w >> 2), 2, '#ffffff'); g.globalAlpha = 1; }
}
function q3Win(g, x, y, w, h, T, opt = {}) {   // 나무 창틀 + 바깥 + 세로 창살 둘
  qF(g, x - 3, y - 3, w + 6, h + 6, '#3a2616'); q3Glass(g, x, y, w, h, T, x * 7 + y);
  for (const k of [1 / 3, 2 / 3]) qF(g, x + Math.round(w * k) - 1, y, 2, h, '#3a2616');
  qF(g, x - 4, y + h + 2, w + 8, 3, '#6e4626'); qF(g, x - 4, y + h + 2, w + 8, 1, '#9a6a3e');
  if (opt.curtain) { const c = qR(opt.curtain); qF(g, x - 5, y - 4, 5, h + 7, c.s); qF(g, x + w, y - 4, 5, h + 7, c.s); qF(g, x - 5, y - 4, 2, h + 7, c.b); qF(g, x + w + 3, y - 4, 2, h + 7, c.b); qF(g, x - 6, y - 6, w + 12, 3, '#3a2616'); }
}
// 통나무 벽 (오두막) · 기둥 · 들보 · 원근 판자 바닥 · 걸린 렌턴
function q3Logs(g, x0, y0, w, h, c0, seed = 1) {
  const c = qR(c0), r = rng(seed);
  for (let y = y0; y < y0 + h; y += 10) {
    const hh = Math.min(10, y0 + h - y);
    qF(g, x0, y, w, hh, c.b); qF(g, x0, y + 1, w, 2, c.l); qF(g, x0, y + 6, w, 2, c.s); qF(g, x0, y + 8, w, 1, c.d); if (hh >= 10) qF(g, x0, y + 9, w, 1, c.k);
    for (let k = 0; k < w / 9; k++) { const gx = x0 + Math.floor(r() * w), gy = y + 3 + Math.floor(r() * 4), gl = 3 + Math.floor(r() * 6); qF(g, gx, gy, gl, 1, r() < 0.5 ? c.s : shade(c0, 0.08)); }
    if (r() < 0.6) { const kx = x0 + Math.floor(r() * (w - 4)); qF(g, kx, y + 3, 3, 3, c.d); qP(g, kx + 1, y + 4, c.k); }
  }
}
function q3Post(g, x, y0, y1, c0) { const c = qR(c0); qF(g, x, y0, 8, y1 - y0, c.b); qF(g, x + 1, y0, 2, y1 - y0, c.l); qF(g, x + 6, y0, 2, y1 - y0, c.s); qF(g, x + 7, y0, 1, y1 - y0, c.k); for (let y = y0 + 6; y < y1; y += 13) qF(g, x + 3, y, 2, 4, c.s); }
function q3Beam(g, y, W, c0) { const c = qR(c0); qF(g, 0, y, W, 9, c.b); qF(g, 0, y, W, 2, c.l); qF(g, 0, y + 7, W, 2, c.k); for (let x = 3; x < W; x += 16) qF(g, x, y + 3, 6, 1, c.s); }
function q3Floor(g, K, c1, c2, seam, n = 14) {
  const { W, H, FB } = K, vx = W / 2;
  qF(g, 0, FB, W, H - FB, c1);
  const xb = i => vx + (i / n - 0.5) * W * 1.08, xf = i => vx + (i / n - 0.5) * W * 1.6;
  for (let i = 0; i < n; i += 2) qQ(g, [[xb(i), FB], [xb(i + 1), FB], [xf(i + 1), H], [xf(i), H]], c2);
  for (let i = 0; i <= n; i++) qL(g, xb(i), FB, xf(i), H, seam);
  const r = rng(n * 7 + W);
  for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) { const k = r(), y = Math.round(FB + (H - FB) * k), xa = xb(i) + (xf(i) - xb(i)) * k + 1, x2 = xb(i + 1) + (xf(i + 1) - xb(i + 1)) * k - 1; qL(g, xa, y, x2, y, seam); }
  qF(g, 0, FB, W, 2, shade(c1, -0.45)); qF(g, 0, FB + 2, W, 1, shade(c1, 0.12));
}
const q3Lamp = (len) => qSpr('q3Lamp' + len, 9, len + 11, 4, 0, (g) => {
  qF(g, 4, 0, 1, len, '#2a2230'); qF(g, 2, len, 5, 2, '#2a2230'); qF(g, 1, len + 2, 7, 7, '#2a2230'); qF(g, 2, len + 3, 5, 5, '#f8c060'); qF(g, 3, len + 4, 3, 3, '#fff0b8'); qF(g, 1, len + 9, 7, 2, '#2a2230'); qF(g, 4, len + 2, 1, 7, '#2a2230');
});

/* ───────── 진열대: 칸 수에 따라 1~4단 (뒤가 뚫린 열린 선반 · 맨 위 덮개 판 — 물건은 늘 칸 안에) ───────── */
const Q3S = { w: 29, lv: 17, leg: 13 };
const q3Tiers = n => Math.max(1, Math.min(4, Math.ceil(n / 3)));
function q3ShelfSpr(tiers, wood) {
  const { w, lv, leg } = Q3S, h = leg + tiers * lv + 4;
  return qSpr('q3Sh' + tiers + wood, w + 2, h + 2, 0, h + 2, (g) => {
    const c = qR(wood);
    qF(g, 3, 1, 2, h - 1, c.s); qF(g, w - 3, 1, 2, h - 1, c.s);   // 뒤 기둥
    qF(g, 3, 4, w - 4, h - leg - 2, 'rgba(0,0,0,.18)');   // 칸 안 그늘
    for (let k = 0; k <= tiers; k++) { const y = h - leg - k * lv; qF(g, 1, y, w, 3, c.b); qF(g, 1, y, w, 1, c.h); qF(g, 1, y + 2, w, 1, c.d); if (k < tiers) qF(g, 2, y + 3, w - 2, 1, 'rgba(0,0,0,.25)'); }
    qF(g, -1, 1, w + 4, 3, c.l); qF(g, -1, 1, w + 4, 1, c.h); qF(g, -1, 3, w + 4, 1, c.d);   // 덮개 판
    qF(g, 0, 0, 3, h + 2, c.b); qF(g, 0, 0, 1, h + 2, c.l); qF(g, w - 1, 0, 3, h + 2, c.b); qF(g, w + 1, 0, 1, h + 2, c.d);   // 앞 기둥
    qF(g, -1, 0, 5, 2, c.l); qF(g, w - 2, 0, 5, 2, c.l);
  });
}
const q3LvY = (yb, k) => yb - Q3S.leg - k * Q3S.lv;   // k단 받침 윗면 (아래부터 0)
// 칸 i의 자리: 12칸까지는 단마다 진열대 하나에 한 칸(물건 둘), 그보다 많으면 단마다 진열대 하나에 두 칸(물건 하나씩)
function hqShopCells(n, K) {
  const wide = n > 12, per = wide ? 6 : 3, tiers = wide ? 4 : q3Tiers(n), out = [];
  for (let i = 0; i < tiers * per; i++) {
    const k = Math.floor(i / per), r = i % per, u = r % 3, half = wide ? Math.floor(r / 3) : 0, x = K.shX[u];
    out.push({ u, k, wide, x: wide ? x + 2 + half * 13 : x + 4, y: q3LvY(K.FB + 1, k), tx: wide ? x + 5 + half * 13 : x + 11 });
  }
  return { tiers, cells: out };
}
const slotIcon = s => (isGearKey(s.item) ? gearKeyIcon(s.item) : s.item);
const TIER_C = ['#7bd36a', '#f0b43c', '#e0503f'];

/* ───────── 여관 침대: 옆으로 누운 모습 (옆모습 격자를 모자 · 무기 없이, 눈 감고 90° 돌림) ───────── */
const Q3LIE = {};
function q3LieSpr(a) {
  const key = 'Q3L|' + a.id + a.cls + (a.look ? (a.look.hair || '') + (a.look.skin || '') : ''); if (Q3LIE[key]) return Q3LIE[key];
  const L = Object.assign({}, advLook(a)); delete L.head; L.ex = (L.ex || []).filter(e => !['quiver', 'pack', 'cape', 'book'].includes(e));
  const b = { id: a.id, cls: a.cls, look: a.look, eq: { weapon: hand0 } };
  const g = pxsAdvGrid(b, 'idle', 0, L);
  for (let y = 0; y < BY; y++) for (let x = 0; x < PXW; x++) { if (g[y][x] === 'w') g[y][x] = 'S'; }
  const s = pxBake(key, g, Object.assign(pxPal(L, a.look || {}), pxOffPal(b)), SX + 6, SY + 13);
  const [c, x] = mkCanvas(s.cv.height, s.cv.width);
  x.translate(0, s.cv.width); x.rotate(-Math.PI / 2); x.drawImage(s.cv, 0, 0);
  return (Q3LIE[key] = { cv: c, w: c.width, h: c.height });
}
// 침대 한 칸: x = 왼쪽(베개 쪽), yb = 매트 윗면, 사람(있으면) + 이불
function q3BedSlot(g, x, yb, len, a, blanket, t, ph) {
  qF(g, x + 1, yb - 4, 10, 5, '#f4ecd8'); qF(g, x + 1, yb - 4, 10, 1, '#ffffff'); qF(g, x + 1, yb, 10, 1, '#c8bca0');   // 베개
  if (a) { const s = q3LieSpr(a); g.drawImage(s.cv, Math.round(x - 3), Math.round(yb - s.h + 6)); }
  const b = qR(blanket), bx = x + 12, bw = len - 13, hump = a ? 6 : 2;
  for (let k = 0; k < bw; k++) { const u = k / bw, hh = 3 + Math.round(hump * Math.sin(Math.min(1, u * 1.15) * Math.PI) * (u < 0.85 ? 1 : 0.6)); qF(g, bx + k, yb - hh, 1, hh + 3, b.b); qP(g, bx + k, yb - hh, b.l); }
  qF(g, bx, yb + 1, bw, 2, b.s); qF(g, bx - 1, yb - 4, 2, 7, b.l);
  for (let k = 4; k < bw - 2; k += 7) qF(g, bx + k, yb - 1, 1, 3, b.s);   // 누빈 줄
  if (a) qZ(g, x + 4, yb - 14, t, ph);
}
// 아직 없는 방: 매트 없는 판자 + 짐 상자
function q3BedBare(g, x, yb, len) { for (let k = 0; k < len; k += 5) qF(g, x + k, yb, 4, 2, '#8a5a30'); qB(g, aCrate(12, 9, '#9a7448'), x + len - 18, yb); qB(g, aCrate(9, 7, '#b08454'), x + len - 30, yb); }
function q3Bunk(g, x, yb, len, top, bot, t, cols, ph, open) {   // 2층 침대 (옆에서 본 긴 쪽). open = [아래 칸, 위 칸]
  const w = qR('#b07a44'), h1 = 6, h2 = 30;
  [yb - h1, yb - h1 - h2].forEach((yy, i) => { if (!open[i]) return; qF(g, x, yy + 1, len, 3, '#e8e0cc'); qF(g, x, yy + 1, len, 1, '#fff8e8'); });   // 매트 (흰 홑청)
  for (const px of [x - 2, x + len]) { qF(g, px, yb - h2 - 14, 4, h2 + 14, w.b); qF(g, px, yb - h2 - 14, 1, h2 + 14, w.l); qF(g, px + 3, yb - h2 - 14, 1, h2 + 14, w.k); qF(g, px - 1, yb - h2 - 16, 6, 3, w.l); }
  for (const yy of [yb - h1, yb - h1 - h2]) { qF(g, x - 1, yy + 4, len + 2, 4, w.b); qF(g, x - 1, yy + 4, len + 2, 1, w.l); qF(g, x - 1, yy + 8, len + 2, 1, w.k); }
  if (open[0]) q3BedSlot(g, x + 2, yb - h1 + 3, len - 4, bot, cols[0], t, ph); else q3BedBare(g, x + 2, yb - h1 + 2, len - 4);
  if (open[1]) q3BedSlot(g, x + 2, yb - h1 - h2 + 3, len - 4, top, cols[1], t, ph + 0.5); else q3BedBare(g, x + 2, yb - h1 - h2 + 2, len - 4);
  qF(g, x, yb - h1 - h2 - 6, len - 10, 2, w.b); qF(g, x, yb - h1 - h2 - 6, len - 10, 1, w.l); for (const px of [x + 8, x + 18]) qF(g, px, yb - h1 - h2 - 5, 1, 3, w.s);   // 위층 난간 (머리 쪽 반만)
  for (let k = 0; k < 4; k++) qF(g, x + len - 6, yb - h1 - 6 - k * 7, 6, 2, w.l);   // 사다리 단
  qF(g, x + len - 7, yb - h1 - h2, 1, h2 + 2, w.b); qF(g, x + len - 1, yb - h1 - h2, 1, h2 + 2, w.b);
}

/* ═══ 상점 · 본부 (가까이 1.5배 · 통나무 오두막 · 렌턴) ═══ */
/* ───────── 빌드 63 (사용자 11-11 「A안 + 도트 빛」): 상점 물건 도트 그림 · 도트 빛 ───────── */
const aBoard2 = () => qSpr('aBoard2', 28, 22, 0, 0, (g) => {   // 게시판: 굵은 나무 테(경사) · 코르크 결 · 모서리 못
  qF(g, 0, 0, 28, 22, '#1c130e'); qF(g, 1, 1, 26, 20, '#7a4e2a');
  qF(g, 1, 1, 26, 1, '#a8743e'); qF(g, 1, 1, 1, 20, '#a8743e'); qF(g, 1, 20, 26, 1, '#4e3018'); qF(g, 26, 1, 1, 20, '#4e3018');
  qF(g, 3, 3, 22, 16, '#2a1a0e'); qF(g, 4, 4, 20, 14, '#b88a50');
  const r = rng(11); for (let k = 0; k < 52; k++) qP(g, 4 + Math.floor(r() * 20), 4 + Math.floor(r() * 14), r() < 0.55 ? '#9c7038' : '#d0a466');
  qF(g, 4, 4, 20, 1, '#8a6030'); qF(g, 4, 4, 1, 14, '#8a6030');
  for (const [x, y] of [[2, 2], [25, 2], [2, 19], [25, 19]]) qP(g, x, y, '#d8dce4');
});
function hqNotes2(g, x, y, n, hl) {   // 쪽지: 그림자 · 접힌 귀 · 글줄 · 두 칸 압정 (노랑 = 채울 수 있는 의뢰)
  const P = [[5, 5], [11, 4], [17, 6], [6, 11], [12, 10], [18, 12]];
  for (let i = 0; i < Math.min(6, n); i++) {
    const [dx, dy] = P[i], X = x + dx, Y = y + dy, on = hl && hl(i), c = on ? '#fff0a0' : '#f2e8d2', e = on ? '#c8a840' : '#b4a88e';
    qF(g, X + 1, Y + 1, 5, 6, '#6e4a22'); qF(g, X, Y, 5, 6, c); qF(g, X, Y + 5, 5, 1, e); qF(g, X + 4, Y, 1, 6, e);
    qP(g, X + 4, Y + 5, '#6e4a22'); qP(g, X + 3, Y + 5, e);
    qF(g, X + 1, Y + 2, 3, 1, '#8a8070'); qF(g, X + 1, Y + 4, 2, 1, '#8a8070');
    qP(g, X + 1, Y, '#e04848'); qP(g, X + 2, Y, '#9a1e1e');
  }
}
function q3WallBooks(g, x, y) {   // 계산대 뒤 벽 선반: 받침 판 · 까치발 · 책등(빛 · 띠) · 기댄 책 · 단지
  qF(g, x, y, 31, 4, '#1c130e'); qF(g, x, y, 31, 3, '#6e4626'); qF(g, x, y, 31, 1, '#a07448'); qF(g, x, y + 2, 31, 1, '#4e3018');
  for (const bx of [x + 3, x + 26]) { qF(g, bx, y + 3, 2, 4, '#4e3018'); qF(g, bx + 2, y + 3, 1, 2, '#4e3018'); qP(g, bx, y + 3, '#7a5232'); }
  let bxx = x + 1;
  for (const [w, h, c] of [[3, 8, '#b03a2e'], [2, 9, '#3f6a9a'], [3, 7, '#4f8a43'], [2, 8, '#c8a040'], [3, 9, '#7a4a9a']]) {
    qF(g, bxx, y - h, w, h, '#1c130e'); qF(g, bxx, y - h + 1, w - 1, h - 1, c); qF(g, bxx, y - h + 1, 1, h - 1, shade(c, 0.28)); qF(g, bxx, y - h + 1, w - 1, 1, shade(c, 0.4));
    qF(g, bxx, y - 3, w - 1, 1, shade(c, -0.4)); qF(g, bxx, y - h + 3, w - 1, 1, '#e8c060');
    bxx += w;
  }
  for (let k = 0; k < 7; k++) { qF(g, bxx + 1 + (k >> 1), y - 1 - k, 3, 1, k ? '#c87a3a' : '#1c130e'); qP(g, bxx + 3 + (k >> 1), y - 1 - k, '#1c130e'); }   // 기댄 책
  const jx = x + 24; qF(g, jx, y - 6, 5, 6, '#1c130e'); qF(g, jx + 1, y - 5, 3, 5, '#5a8a9a'); qP(g, jx + 1, y - 5, '#9ad0e0'); qF(g, jx + 1, y - 7, 3, 2, '#1c130e'); qF(g, jx + 2, y - 7, 1, 1, '#c8a060');   // 단지
}
function q3Cloth(g, x, y, w) {   // 안 연 칸을 덮은 천: 테 · 위 빛 · 주름 · 단 · 꼬리표
  qF(g, x, y - 6, w, 6, '#1c130e'); qF(g, x + 1, y - 5, w - 2, 5, '#b8a074'); qF(g, x + 1, y - 5, w - 2, 1, '#e2d0a6');
  for (let k = x + 3; k < x + w - 2; k += 4) { qF(g, k, y - 4, 1, 3, '#8e7a52'); qP(g, k + 1, y - 4, '#d4c094'); }
  qF(g, x + 1, y - 1, w - 2, 1, '#8e7a52');
  if (w > 12) { qF(g, x + w - 6, y - 3, 4, 4, '#1c130e'); qF(g, x + w - 5, y - 2, 2, 2, '#e8dcb8'); qP(g, x + w - 4, y - 4, '#8e7a52'); }
}
const RUG_RED = { e: '#3a120e', b: '#c89a3a', b2: '#e8c060', l: '#5e1c16', f: '#8a2a24', m: '#a8342c', fr: '#e8d8b0', fr2: '#b8a47e' };
const RUG_BLUE = { e: '#141c34', b: '#c8b070', b2: '#f0dca0', l: '#1e2c50', f: '#34508a', m: '#4a6aa8', fr: '#e8e0c8', fr2: '#a89c80' };
const RUG_PLUM = { e: '#24101a', b: '#b89850', b2: '#e0c878', l: '#3a1a2a', f: '#5a2a3a', m: '#7a3a4a', fr: '#e0d0b0', fr2: '#a8946e' };
function q3Rug(g, xl0, xr0, xl1, xr1, y0, y1, P = RUG_RED) {   // 원근 깔개: 줄마다 두 끝을 잇고 칸 무늬 (테 · 금 띠 · 마름모) + 술
  const H = y1 - y0;
  for (let y = y0; y <= y1; y++) {
    const v = (y - y0) / H, xl = Math.round(xl0 + (xl1 - xl0) * v), xr = Math.round(xr0 + (xr1 - xr0) * v), Wd = xr - xl, pv = Math.round(v * 12);
    for (let x = xl; x <= xr; x++) {
      const pu = Math.round((x - xl) / Wd * 46); let c;
      if (x === xl || x === xr || y === y0 || y === y1) c = P.e;
      else if (pv <= 1 || pv >= 11 || pu <= 2 || pu >= 44) c = (pu + pv) % 4 === 0 ? P.b2 : P.b;
      else if (pv === 2 || pv === 10 || pu === 3 || pu === 43) c = P.l;
      else { const mu = (pu - 4) % 8, dd = Math.abs(mu - 4) + Math.abs(pv - 6); c = dd === 3 ? P.b : dd < 3 ? (dd === 0 ? P.b2 : P.m) : P.f; }
      qP(g, x, y, c);
    }
  }
  for (let x = xl1 + 1; x < xr1; x += 2) { qP(g, x, y1 + 1, P.fr); qP(g, x, y1 + 2, P.fr2); }
  for (let x = xl0 + 1; x < xr0; x += 2) qP(g, x, y0 - 1, P.fr);
}
const aCash = () => qSpr('aCash', 12, 9, 0, 9, (g) => {   // 돈 상자: 열린 뚜껑 · 금화 더미 · 쇠 모서리 · 자물쇠
  qF(g, 1, 0, 10, 3, '#1c130e'); qF(g, 2, 0, 8, 2, '#8a5a30'); qF(g, 2, 0, 8, 1, '#b08048');
  qF(g, 0, 3, 12, 6, '#1c130e'); qF(g, 1, 4, 10, 4, '#7a4e2a'); qF(g, 1, 4, 10, 1, '#a8743e'); qF(g, 1, 7, 10, 1, '#4e3018');
  qF(g, 1, 3, 10, 1, '#f0c24a'); qP(g, 3, 2, '#f0c24a'); qP(g, 4, 2, '#fff2a0'); qP(g, 6, 2, '#c08a20'); qP(g, 7, 2, '#f0c24a'); qP(g, 8, 2, '#fff2a0');
  for (const x of [1, 10]) { qP(g, x, 4, '#c8ccd4'); qP(g, x, 7, '#8a8e98'); }
  qP(g, 5, 5, '#e8c060'); qP(g, 6, 5, '#e8c060'); qP(g, 5, 6, '#8a6a20'); qP(g, 6, 6, '#8a6a20');
});
function q3Coins(g, x, y, n) { for (let k = 0; k < n; k++) { const yy = y - 2 - k * 2; qF(g, x, yy, 5, 2, '#1c130e'); qF(g, x, yy, 4, 1, '#f0c24a'); qP(g, x, yy, '#fff2a0'); qF(g, x, yy + 1, 4, 1, '#c08a20'); } }
const BAY4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function q3Dither(x, W, H, top, steps) {   // 투명도를 몇 계단으로 끊고 4×4 바둑 무늬로 잇는다 (도트 빛)
  const id = x.getImageData(0, 0, W, H), d = id.data;
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    if (!d[i + 3]) continue;
    const px = p % W, py = (p / W) | 0, v = d[i + 3] / 255 / top * steps, lo = Math.floor(v), th = (BAY4[(py & 3) * 4 + (px & 3)] + 0.5) / 16;
    d[i + 3] = Math.round(Math.min(steps, lo + (v - lo > th ? 1 : 0)) / steps * top * 255);
  }
  x.putImageData(id, 0, 0);
}
const A3_SHOP = {
  zoom: 1.5,
  geo(K) { K.FB = K.bot - 46; K.lane = K.FB + 24; K.door = -8; K.shX = [10, 41, 72]; K.payX = 108; K.n = Math.max(1, slotCount()); Object.assign(K, hqShopCells(K.n, K)); return K; },
  sig: K => K.tiers,
  bg(g, K) {
    const { W, FB } = K;
    q3Logs(g, 0, 0, W, FB, '#8a5a34', 3);
    q3Beam(g, K.top - 6, W, '#5e3a20');
    for (const x of [3, 101]) q3Post(g, x, K.top + 3, FB, '#6e4626');
    q3Floor(g, K, '#7a5232', '#6e4a2c', '#4e3018', 10);
    q3Rug(g, 6, 104, -2, 112, FB + 12, FB + 37);   // 빌드 63 A안: 원근 깔개 (테 · 금 띠 · 마름모 · 술)
  },
  house(g, K, T) {
    const { FB } = K;
    q3Win(g, 20, K.top + 14, 22, 20, T, { curtain: '#8a2e28' }); q3Win(g, 70, K.top + 14, 22, 20, T, { curtain: '#8a2e28' });
    qB(g, aCrest(), 56, K.top + 6);
    qB(g, aBoard2(), 105, K.top + 11); q3WallBooks(g, 104, FB - 46);   // 빌드 63 A안: 코르크 게시판 · 벽 책 선반
    for (const x of K.shX) qB(g, q3ShelfSpr(K.tiers, '#9a6a3a'), x, FB + 1);
  },
  live(g, K, t, T) {
    const { FB, n } = K;
    hqNotes2(g, 106, K.top + 12, S.reqs.length, i => S.reqs[i] && reqHave(S.reqs[i]) >= S.reqs[i].qty);
    // 물건: 칸 i (재고만큼 1~2개 · 값표). 비었으면 값표만, 안 연 칸은 접은 천
    const hide = {}; for (const c of QCU.list) if ((c.st === 'pick' && c.buy && t - c.t0 > 0.35) || c.hold != null) hide[c.slot] = 1;
    K.cells.forEach((c, i) => {
      if (i >= n) { q3Cloth(g, c.wide ? c.x : c.x + 1, c.y, c.wide ? 11 : 20); return; }
      const s = S.shop.slots[i]; if (!s) return;
      const st = stockOf(s.item), cnt = st > 0 ? Math.min(c.wide ? 1 : 2, st) - (hide[i] ? 1 : 0) : 0, itm = slotIcon(s);
      for (let j = 0; j < cnt; j++) drawIcon(g, itm, c.x + j * 11, c.y - 10);
      if (st <= 0) qF(g, c.x + 2, c.y - 2, c.wide ? 7 : 16, 1, '#7a6a5a');
      qF(g, c.tx, c.y + 3, c.wide ? 4 : 6, 3, TIER_C[s.tier || 0]); qF(g, c.tx, c.y + 3, c.wide ? 4 : 6, 1, '#ffffff');
    });
    hqCustStep(K, t);
    const pay = QCU.paid && t - QCU.paid < 0.6 && t >= QCU.paid;
    qPeo('keeper', g, false, pay ? 'atk' : 'idle', pay ? 0 : Math.floor(t * 1.2) % 2, 122, FB + 5);
    qB(g, aCounter(36), 104, FB + 19);
    qB(g, aCash(), 125, FB + 1); q3Coins(g, 119, FB + 1, 3);   // 빌드 63 A안: 돈 상자 · 금화 더미
    hqCustDraw(g, K, t);
    for (const x of [24, 86]) qB(g, q3Lamp(10), x, K.top + 3);
    q3Light(g, K, T, { amb: 0.34, lamps: [[28, K.top + 19, 48], [90, K.top + 19, 48], [128, FB - 18, 34], [60, FB + 20, 50]], wins: [[20, K.top + 14, 22, 20, 46], [70, K.top + 14, 22, 20, 46]] }, t);
    const shH = Q3S.leg + K.tiers * Q3S.lv + 6;
    hqHitAdd(K, 8, FB - shH, 96, shH + 4, { win: 'inv' });
    hqHitAdd(K, 36, K.top + 4, 40, 32, { win: 'co' });
    hqHitAdd(K, 102, FB - 30, K.W - 102, 52, { win: 'co' });
    hqHitAdd(K, 104, K.top + 10, 30, 24, { win: 'req' });
  }
};
// 손님: 문으로 들어와 → 진열대 앞(뒷모습)에서 집고 → 머리 위에 들고 계산대 → (뒷모습) 계산 +G → 문으로 나간다.
// 실제로 팔린 물건(hqSale)이면 그 칸에서 사 가고, 그 밖에는 구경만 하고 나가는 손님이 손님 수(traffic)에 맞춰 들른다
const QCU = { list: [], browse: 1.5, lastT: null, fx: [], seq: 0, paid: 0 };
const CUST_WHO = ['cust1', 'cust2', 'cust4', 'cust5', 'cust3'];
function hqCustAdd(K, slot, gold) {
  const s = S.shop.slots[slot], c = K.cells[slot];
  if (!s || !c) return;
  QCU.list.push({ who: CUST_WHO[QCU.seq % 5], x: K.door, y: K.lane, st: 'in', tx: K.shX[c.u] + 14 + (QCU.seq % 2 ? -3 : 3), slot, buy: gold > 0, gold, itm: slotIcon(s), a: 0, w: 0, hold: null, dir: 1 });
  QCU.seq++;
}
function hqCustStep(K, t) {
  const dt = QCU.lastT == null ? 0 : Math.min(0.1, Math.max(0, t - QCU.lastT)); QCU.lastT = t;
  if (HQ.pending.length > 4) HQ.pending.splice(0, HQ.pending.length - 4);
  while (HQ.pending.length && QCU.list.length < 4) { const [i, gold] = HQ.pending.shift(); hqCustAdd(K, i, gold); }
  QCU.browse -= dt;
  if (QCU.browse <= 0) {
    QCU.browse = 9 / Math.max(0.5, traffic()) * (0.6 + Math.random() * 0.8);
    const live = []; for (let i = 0; i < K.n; i++) { const s = S.shop.slots[i]; if (s && stockOf(s.item) > 0) live.push(i); }
    if (live.length && QCU.list.length < 3) hqCustAdd(K, pickOne(live), 0);
  }
  for (const c of QCU.list) {
    c.w += dt;
    const walk = (tx, ty, v = 26) => { const dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy); if (d <= v * dt) { c.x = tx; c.y = ty; return true; } c.x += dx / d * v * dt; c.y += dy / d * v * dt; c.dir = dx >= 0 ? 1 : -1; return false; };
    if (c.st === 'in') { c.a = Math.min(1, c.a + dt * 3); if (walk(c.tx, K.lane - 5)) { c.st = 'pick'; c.t0 = t; } }
    else if (c.st === 'pick') { if (t - c.t0 > 1.1) { if (c.buy) { c.hold = c.slot; c.st = 'toPay'; } else c.st = 'out'; } }
    else if (c.st === 'toPay') { if (walk(K.payX, K.lane - 1)) { c.st = 'pay'; c.t0 = t; } }
    else if (c.st === 'pay') { if (t - c.t0 > 0.9) { QCU.fx.push({ x: K.payX + 8, y: K.FB - 22, t0: t, v: c.gold }); c.hold = null; c.st = 'out'; QCU.paid = t; } }
    else if (c.st === 'out') { if (walk(K.door, K.lane)) c.a -= dt * 3; if (c.a <= 0) c.gone = 1; }
  }
  QCU.list = QCU.list.filter(c => !c.gone);
  QCU.fx = QCU.fx.filter(f => t - f.t0 < 1.2 && t >= f.t0);
}
function hqCustDraw(g, K, t) {
  for (const c of QCU.list.slice().sort((a, b) => a.y - b.y)) {
    g.save(); g.globalAlpha = Math.max(0, Math.min(1, c.a));
    if (c.st === 'pick' || c.st === 'pay') qPeoBack(c.who, g, Math.floor(t * 1.4) % 2, c.x, c.y);
    else qPeo(c.who, g, true, 'walk', Math.floor(c.w * 6) % 4, c.x, c.y, c.dir < 0);
    g.restore();
    if (c.st === 'pick' && c.buy) {   // 집을 때 단에서 머리 위로 날아온다
      const k = Math.min(1, Math.max(0, (t - c.t0 - 0.35) / 0.45)), cell = K.cells[c.slot], sx = cell.x + 5, sy = cell.y - 10;
      if (k > 0) drawIcon(g, c.itm, Math.round(sx + (c.x - 5 - sx) * k), Math.round(sy + (c.y - 41 - sy) * k - Math.sin(k * Math.PI) * 8));
    }
    if (c.st === 'pick' && !c.buy && t - c.t0 > 0.4) { qF(g, c.x + 6, c.y - 40, 7, 7, '#2a2a3a'); qF(g, c.x + 7, c.y - 39, 5, 5, '#f4f0e4'); qF(g, c.x + 9, c.y - 38, 1, 2, '#2a2a3a'); qP(g, c.x + 9, c.y - 35, '#2a2a3a'); }   // 구경만: 물음표
    if (c.hold != null && c.st !== 'pick') drawIcon(g, c.itm, Math.round(c.x) - 5, Math.round(c.y) - 41 + (Math.floor(t * 4) % 2));
  }
  for (const f of QCU.fx) { const k = (t - f.t0) / 1.2, y = Math.round(f.y - k * 12); qF(g, f.x - 2, y, 5, 5, '#c08a20'); qF(g, f.x - 1, y + 1, 3, 3, '#f8d870'); g.globalAlpha = 1 - Math.max(0, k - 0.6) / 0.4; drawNum(g, f.x + 5, y - 1, '+' + f.v, '#f0c24a'); g.globalAlpha = 1; }
}
// 시뮬레이션의 판매 → 손님 한 명 (상점을 보고 있을 때만)
function hqSale(i, gold) { if (HQ.cur === 'shop0' && !document.hidden) HQ.pending.push([i, gold]); }

/* ═══ 선술집: 찾아온 모험가(고용 후보)와 쉬는 모험가가 탁자에 앉아 있다 · 바 · 술통 · 벽난로 · 모집 게시판 ═══ */
function q3Table(g, x, y) {   // 둥근 탁자 (앞모습)
  qF(g, x - 2, y - 10, 5, 11, '#4e3018'); qF(g, x - 8, y, 17, 2, '#3a2412');
  qEll(g, x, y - 12, 19, 5, '#5e3a20'); qEll(g, x, y - 13, 19, 5, '#a8743e'); qEll(g, x - 2, y - 14, 14, 3, '#c08a54'); qP(g, x + 8, y - 14, '#d8a868');
}
const q3Mug = (g, x, y) => { qF(g, x, y - 5, 4, 5, '#c8a050'); qF(g, x, y - 6, 4, 1, '#fff4dc'); qF(g, x + 4, y - 4, 1, 3, '#a88228'); qP(g, x + 1, y - 4, '#e8c870'); };
const q3Stool = (g, x, y) => { qF(g, x - 5, y - 6, 11, 3, '#8a5a30'); qF(g, x - 5, y - 6, 11, 1, '#b08048'); qF(g, x - 4, y - 3, 2, 4, '#5e3a20'); qF(g, x + 3, y - 3, 2, 4, '#5e3a20'); };
function q3Seat(g, a, x, y, side, flip) {
  if (!a) return;
  const s = side ? pxsAdvSprite(a, 'sit', 0) : pxAdvSprite(a, 'sit', 0);
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1); g.drawImage(s.cv, -s.ax, -s.ay); g.restore();
}
QPEO.barkeep = { a: { id: 14, cls: 'porter', look: { hair: '#7a2f22', skin: '#e0ac7e' }, eq: { weapon: hand0 } }, L: { head: 'band', body: 'tunic', ex: [], c1: '#ece4cc', c2: '#5a3a22', c3: '#3f6a9a', pants: '#3a3040', boots: '#3a2a20', leather: '#6a4428', hc: '#3f6a9a', hair: 'spiky' } };
const A3_TAVERN = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 56; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q3Logs(g, 0, 0, W, FB, '#7a4e32', 11);
    q3Beam(g, K.top + 4, W, '#4e3018');
    for (const x of [0, 100, 152]) q3Post(g, x, K.top + 13, FB, '#5e3a20');
    q3Floor(g, K, '#6e4a2c', '#62422a', '#3e2816', 10);
  },
  house(g, K) {
    const { FB } = K;
    for (const y of [K.top + 30, K.top + 46]) { qF(g, 8, y, 84, 3, '#4e3018'); qF(g, 8, y, 84, 1, '#7a5030'); const r = rng(y); for (let x = 11; x < 88; x += 5) { const c = ['#3a8a4a', '#9a2e2e', '#d8b040', '#3a5a9a', '#9a7040'][Math.floor(r() * 5)], h = 8 + Math.floor(r() * 4); qF(g, x, y - h, 3, h, c); qF(g, x + 1, y - h - 2, 1, 2, c); qP(g, x, y - h + 1, shade(c, 0.45)); } }   // 술병 선반 둘
    qF(g, 8, FB - 40, 84, 3, '#4e3018');
    qF(g, 6, FB - 38, 88, 4, '#5e3a20'); qF(g, 6, FB - 38, 88, 1, '#8a6038'); for (const x of [10, 88]) qF(g, x, FB - 66, 3, 30, '#4e3018');   // 술통 받침대
    for (const x of [24, 50, 76]) {   // 술통 셋 (쇠테 · 꼭지)
      qDisc(g, x, FB - 51, 12, '#5a5a62'); qDisc(g, x, FB - 51, 11, '#9a6a3a');
      for (let k = -9; k <= 9; k += 3) { const hh = Math.round(Math.sqrt(Math.max(0, 110 - k * k))); qF(g, x + k, FB - 51 - hh, 1, hh * 2, '#7e5430'); }
      qDisc(g, x, FB - 51, 7, '#6a6a72'); qDisc(g, x, FB - 51, 6, '#a87440'); qDisc(g, x - 2, FB - 53, 2, '#c8945a');
      qF(g, x - 1, FB - 42, 3, 2, '#c9a04a'); qF(g, x, FB - 40, 1, 2, '#c9a04a');
    }
    qF(g, 110, FB - 58, 42, 58, '#6a625e'); for (let y = FB - 56, row = 0; y < FB; y += 6, row++) for (let x = 110 + (row % 2) * 5; x < 152; x += 10) { qF(g, x, y, 9, 5, '#7a726c'); qF(g, x, y, 9, 1, '#968e88'); }   // 벽난로
    qQ(g, [[117, FB], [117, FB - 24], [124, FB - 31], [138, FB - 31], [145, FB - 24], [145, FB]], '#1a1210'); qF(g, 106, FB - 60, 50, 5, '#5e3a20'); qF(g, 106, FB - 60, 50, 1, '#8a6038');
    qF(g, 120, FB - 76, 22, 14, '#3a2616'); qF(g, 122, FB - 74, 18, 10, '#c8a050'); qDisc(g, 131, FB - 69, 3, '#f0d070');
    qB(g, aBoard2(), 109, K.top + 17);
  },
  live(g, K, t, T) {
    const { FB } = K;
    hqNotes2(g, 110, K.top + 18, S.cands.length);
    qPeo('barkeep', g, false, 'idle', Math.floor(t * 1.2) % 2, 44, FB + 2);
    qF(g, 4, FB - 14, 92, 16, '#5e3a20'); qF(g, 4, FB - 17, 92, 4, '#a8743e'); qF(g, 4, FB - 17, 92, 1, '#d09a60'); for (let x = 8; x < 92; x += 14) qF(g, x, FB - 10, 11, 9, '#4a2e18');
    q3Mug(g, 18, FB - 17); q3Mug(g, 66, FB - 17); q3Mug(g, 76, FB - 17);
    drawFire(g, 131, FB - 2, t, true);
    // 손님: 찾아온 모험가(고용 후보)가 먼저, 남은 자리에 쉬는 모험가 — 탁자마다 뒤 의자 하나 · 옆 걸상 둘
    const ppl = [...S.cands.map(a => ({ a, guest: 1 })), ...hqWhere().tav.map(a => ({ a }))].slice(0, 9);
    const TB = [[34, FB + 30], [118, FB + 26], [78, FB + 52]], at = (ti, si) => ppl[si * 3 + ti];
    TB.forEach(([x, y], ti) => {
      const P = [at(ti, 0), at(ti, 1), at(ti, 2)];
      if (P[0]) q3Seat(g, P[0].a, x, y - 12, false, false);
      q3Stool(g, x - 24, y + 2); q3Stool(g, x + 24, y + 2);
      if (P[1]) q3Seat(g, P[1].a, x - 24, y - 3, true, false);
      q3Table(g, x, y);
      if (P[0] || P[1] || P[2]) { q3Mug(g, x - 8, y - 15); if (P[1] || P[2]) q3Mug(g, x + 5, y - 16); }
      if (P[2]) q3Seat(g, P[2].a, x + 24, y - 3, true, true);
      [[0, x, y - 12], [1, x - 24, y - 3], [2, x + 24, y - 3]].forEach(([si, px, py]) => { const p = P[si]; if (p) hqHitAdd(K, px - 9, py - 24, 18, 26, p.guest ? { win: 'guest' } : { adv: p.a.id }); });
    });
    for (const [x] of TB) qB(g, q3Lamp(18), x, K.top + 13);
    q3Light(g, K, T, { amb: 0.32, ambN: 0.2, lamps: [...TB.map(([x, y]) => [x + 4, y - 26, 40]), [131, FB - 12, 46, '#f88a3c'], [48, FB - 30, 30]], wins: [] }, t);
    hqHitAdd(K, 108, K.top + 16, 30, 24, { win: 'guest' });
  }
};

/* ═══ 여관: 2층 침대 셋 (한 장소 여섯 자리) · 자는 모험가는 옆으로 누워 잔다 ═══ */
const A3_INN = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 30; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q3Logs(g, 0, 0, W, FB, '#8a5a3a', 7);
    q3Beam(g, K.top + 2, W, '#4e3018');
    for (const x of [0, 152]) q3Post(g, x, K.top + 11, FB, '#5e3a20');
    q3Floor(g, K, '#7a5232', '#6e4a2c', '#4a2e18', 10);
    q3Rug(g, 24, 136, 16, 144, FB + 8, FB + 26, RUG_BLUE);   // 빌드 63: 무늬 깔개 (도트)
    for (let x = 32; x < 130; x += 6) qP(g, x, FB + 17, '#7a9ad0');
  },
  house(g, K, T) {
    q3Win(g, 22, K.top + 18, 24, 22, T, { curtain: '#3f5a8a' }); q3Win(g, 114, K.top + 18, 24, 22, T, { curtain: '#3f5a8a' });
    qB(g, aClock(), 80, K.top + 26);
    qF(g, 56, K.top + 44, 48, 3, '#5e3a20'); qF(g, 56, K.top + 44, 48, 1, '#8a6038');
    for (const [x, c] of [[60, '#a8432f'], [72, '#3f6a9a'], [86, '#4f8a43'], [98, '#8a5a9a']]) { qF(g, x, K.top + 47, 1, 3, '#2a2230'); qF(g, x - 4, K.top + 50, 9, 12, c); qF(g, x - 4, K.top + 50, 9, 2, shade(c, 0.2)); qF(g, x - 4, K.top + 60, 9, 2, shade(c, -0.25)); }
  },
  live(g, K, t, T, f) {
    const { FB } = K, W = hqWhere(), owners = living().slice().sort((a, b) => a.id - b.id), base = (f.i || 0) * SEATS, total = beds();
    const cols = [['#8a3a32', '#b84a3a'], ['#3f5a8a', '#5a7ab8'], ['#4f6a3a', '#6a9a4a']], here = a => (a && W.inn.has(a.id) ? a : null);
    [6, 58, 110].forEach((x, j) => {
      const kb = base + j * 2, kt = kb + 1, ob = owners[kb], ot = owners[kt];
      q3Bunk(g, x, FB - 2, 44, here(ot), here(ob), t, cols[j], j * 0.37, [kb < total, kt < total]);
      for (const [o, yy] of [[ob, FB - 8], [ot, FB - 38]]) if (o) { qF(g, x + 18, yy + 4, 6, 3, '#2a1d14'); qF(g, x + 19, yy + 5, 4, 1, CLASSES[o.cls].tunic); }   // 문패: 직업 색
      if (ob) hqHitAdd(K, x - 2, FB - 24, 48, 24, { adv: ob.id });
      if (ot) hqHitAdd(K, x - 2, FB - 54, 48, 26, { adv: ot.id });
    });
    for (const x of [53, 105]) { qF(g, x - 2, FB - 13, 6, 13, '#5e3a20'); qF(g, x - 3, FB - 14, 8, 2, '#8a6038'); qF(g, x, FB - 20, 2, 6, '#f4ecd8'); qF(g, x, FB - 23 - (Math.floor(t * 8) % 2), 2, 3, '#f8c060'); }
    for (const x of [30, 132]) qB(g, q3Lamp(6), x, K.top + 11);
    q3Light(g, K, T, { amb: 0.3, ambN: 0.22, lamps: [[54, FB - 22, 34], [106, FB - 22, 34], [34, K.top + 24, 34], [136, K.top + 24, 34]], wins: [[22, K.top + 18, 24, 22, 44], [114, K.top + 18, 24, 22, 44]] }, t);
  }
};

/* ═══ 마구간 (1층 · 칸 셋 + 바닥 곳곳 · 밤에는 선 채로 잔다) · 날개 달린 짐승은 비행장으로 ═══ */
const STALL_FLOOR = [[46, 40], [104, 42], [160, 40], [74, 68], [134, 68]];   // 칸 밖 바닥 자리 (x, FB + y) — 칸 안 짐승과 겹치지 않게 앞쪽에
const A3_STABLE = {
  geo(K) { K.FB = K.bot - 74; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q3Logs(g, 0, 0, W, FB, '#7a5432', 5);
    q3Beam(g, K.top + 2, W, '#4e3018');
    q3Floor(g, K, '#7a5a3a', '#6e5034', '#4a3420', 12);
    const r = rng(9); for (let k = 0; k < 200; k++) { const y = FB + 3 + Math.floor(r() * (K.H - FB - 3)), x = Math.floor(r() * W); qF(g, x, y, 2, 1, r() < 0.5 ? '#c8a040' : '#a88228'); }
  },
  house(g, K, T) {
    const { FB } = K;
    for (const x of [0, 66, 132]) { qF(g, x + 2, FB - 56, 62, 56, '#5e3e24'); for (let i = x + 4; i < x + 64; i += 6) qF(g, i, FB - 56, 1, 56, '#4a301c'); }   // 칸 셋: 뒷벽 판자
    for (const x of [0, 64, 130, 194]) { q3Post(g, x, K.top + 11, FB, '#5e3a20'); qF(g, x - 6, FB - 26, 20, 4, '#7a5030'); qF(g, x - 6, FB - 26, 20, 1, '#a07448'); }
    for (const x of [8, 74, 140]) { qF(g, x, FB - 66, 50, 8, '#5e3a20'); for (let k = 0; k < 10; k++) qF(g, x + 2 + k * 5, FB - 70 + (k % 2), 3, 5, '#d8b050'); }   // 건초 시렁
    q3Win(g, 26, K.top + 22, 18, 16, T, {}); q3Win(g, 156, K.top + 22, 18, 16, T, {});
    qB(g, aBanner('#3f6a9a', 'shoe'), 100, K.top + 14);
    qB(g, aSaddle(), 100, FB - 30);
    for (let i = 0; i < 3; i++) qB(g, aTrough(20), 10 + i * 66, FB - 1);
    for (const [x, y] of STALL_FLOOR) qB(g, aHayPile(44), x, FB + y + 3);
  },
  live(g, K, t, T) {
    const { FB } = K, L = hqStableAnimals(), nt = q3Night(T);
    const k = (t * 0.06) % 2, gx = 14 + (k < 1 ? k : 2 - k) * 170, gy = FB + 54;   // 마부: 두 줄 사이를 오간다
    let groom = false;
    L.slice(0, 3 + STALL_FLOOR.length).forEach((m, i) => {
      const [x, y] = i < 3 ? [33 + i * 66, FB - 2] : [STALL_FLOOR[i - 3][0], FB + STALL_FLOOR[i - 3][1]];
      if (!groom && y > gy) { groom = true; qPeo('groom', g, true, 'walk', Math.floor(t * 6) % 4, gx, gy, k >= 1); }
      if (m.ride) { const h = hqRide(g, m.ride, x, y, t, i < 3 ? 60 : 54, i % 2 === 0, nt > 0.5, i); if (nt > 0.5) qZ(g, x - 6, y - h - 4, t, i * 0.3); hqHitAdd(K, x - 26, y - 44, 52, 46, { win: 'b:stable' }); return; }   // 빌드 65: 탈것
      const z = hqFit(m.id, i < 3 ? 56 : 50);
      hqMon(g, m.id, x, y, nt > 0.5 ? t * 0.3 : t, z, i % 2 === 0, i);
      if (nt > 0.5) qZ(g, x - 6, y - Math.round(monH(m.id) * z) - 4, t, i * 0.3);
      hqHitAdd(K, x - 26, y - 44, 52, 46, { win: 'b:stable' });
    });
    if (!groom) qPeo('groom', g, true, 'walk', Math.floor(t * 6) % 4, gx, gy, k >= 1);
    for (const x of [32, 98, 164]) qB(g, q3Lamp(6), x, K.top + 11);
    q3Light(g, K, T, { amb: 0.3, ambN: 0.24, lamps: [[36, K.top + 24, 48], [102, K.top + 24, 48], [168, K.top + 24, 48], [100, FB + 30, 60]], wins: [[26, K.top + 22, 18, 16, 50], [156, K.top + 22, 18, 16, 50]] }, t);
  }
};

/* ═══ 대장간 (지하): 돌계단 → 거리로 나가는 문(문 창도 바깥 시간) · 쇠창살 창 · 화덕 · 모루 ═══ */
const A3_SMITHY = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 46; return K; },
  bg(g, K) {
    const { W, FB } = K, r = rng(4);
    qF(g, 0, 0, W, FB, '#5a5450');
    for (let y = 0, row = 0; y < FB; y += 7, row++) for (let x = (row % 2) * -7; x < W; x += 14) { const c = r() < 0.3 ? '#6a645c' : r() < 0.5 ? '#5e5854' : '#665e58'; qF(g, x + 1, y + 1, 12, 5, c); qF(g, x + 1, y + 1, 12, 1, shade(c, 0.15)); qF(g, x + 1, y + 6, 12, 1, '#3e3834'); }
    q3Floor(g, K, '#625c56', '#5a544e', '#3a3430', 10);
  },
  house(g, K, T) {
    const { FB } = K, top = K.top + 30;
    const n = 7, sh = Math.round((FB - top) / n);   // 계단: 왼쪽 벽을 따라 문까지
    for (let i = 0; i < n; i++) { const x = 2 + i * 6, y = FB - (i + 1) * sh; qF(g, x, y, 26, sh, '#7a726c'); qF(g, x, y, 26, 2, '#9a928c'); qF(g, x, y + 2, 26, 1, '#6a625e'); qF(g, x + 24, y, 2, sh, '#4e4844'); qF(g, x, FB - i * sh - 1, 26, 1, '#3e3834'); }
    qF(g, 0, top, 2 + n * 6, 2, '#9a928c');
    const dx = 44, dy = top - 34;   // 문 (계단 꼭대기 · 거리로)
    qF(g, dx, dy, 26, 36, '#3a2616'); qF(g, dx + 3, dy + 3, 20, 33, '#6b4a2e'); qF(g, dx + 12, dy + 3, 2, 33, '#3a2616'); for (let y = dy + 8; y < top; y += 6) qF(g, dx + 3, y, 20, 1, '#5a3a22');
    q3Glass(g, dx + 6, dy + 7, 14, 8, T, 5); qF(g, dx + 12, dy + 7, 2, 8, '#3a2616'); qP(g, dx + 8, dy + 22, '#f0c24a');
    qF(g, dx - 2, top, 30, 3, '#8a827c');
    qF(g, 93, 0, 15, FB - 62, '#625a56'); qF(g, 93, 0, 3, FB - 62, '#7a726c'); qF(g, 105, 0, 3, FB - 62, '#46403c'); for (let y = 8; y < FB - 62; y += 9) qF(g, 93, y, 15, 1, '#46403c');   // 굴뚝
    qF(g, 120, K.top + 8, 32, 18, '#2a2422'); q3Glass(g, 122, K.top + 10, 28, 14, T, 9); for (let x = 125; x < 150; x += 5) qF(g, x, K.top + 10, 2, 14, '#2a2a30');   // 쇠창살 창
    qF(g, 120, FB - 70, 36, 3, '#5e3a20'); for (const [x, h] of [[124, 12], [131, 10], [138, 14], [146, 11]]) { qF(g, x, FB - 67, 1, h, '#8a8e98'); qF(g, x - 2, FB - 67 + h, 5, 3, '#6a707a'); }
    qB(g, aForge(), 100, FB + 1);
    qB(g, aRack(), 122, FB - 30);
    qB(g, aBanner('#8a2a22', 'anvil'), 78, K.top + 22);
  },
  live(g, K, t, T) {
    const { FB } = K;
    qB(g, aCoal(), 72, FB + 6); qB(g, aBarrel('water'), 128, FB + 12); qB(g, aArmor(), 152, FB + 4);
    qB(g, aAnvil(), 72, FB + 30);
    const f = [0, 1, 2, 3, 4, 4, 5, 6][Math.floor(t * 5) % 8];
    qPeo('smith', g, true, 'm:smash', f, 56, FB + 29, false);
    drawFire(g, 100, FB - 2, t, true);
    if (f >= 4) aSparks(g, 70, FB + 12, t);
    qB(g, aGrind(), 140, FB + 34); qB(g, aCrate(14, 10, '#8a6a4a'), 100, FB + 40);
    q3Light(g, K, T, { amb: 0.38, ambN: 0.16, lamps: [[100, FB - 12, 70, '#f88a3c'], [57, K.top + 2, 26]], wins: [[122, K.top + 10, 28, 14, 64]], soft: [[57, K.top, 30, 0.55]] }, t);
  }
};

/* ═══ 비행장: 시간이 흐르는 하늘 · 탑승구(문 · 계단 · 다리) 앞에 댄 비행 마차 · 계류탑 · 둥지 넷 ═══ */
const NESTS = [[46, 30], [116, 26], [70, 66], [150, 64]];   // (x, FB + y)
const A3_AIR = {
  geo(K) { K.FB = K.bot - 92; return K; },
  bg(g, K, T) {
    const { W, H, FB } = K;
    bgSky(g, W, H, T, FB);
    bgCloud(g, 8, K.top + 18, 40, T, 0.9); bgCloud(g, 140, K.top + 58, 44, T, 0.85);
    bgCloud(g, -10, FB - 14, 70, T, 0.85); bgCloud(g, 70, FB - 8, 80, T, 0.8); bgCloud(g, 140, FB - 12, 90, T, 0.85);
    q3Floor(g, K, '#8a6a4c', '#7e6046', '#5a4232', 12);
  },
  house(g, K) {
    const { W, FB } = K;
    for (let x = 4; x < W; x += 16) qF(g, x, FB - 12, 3, 13, '#5e3a20');
    qF(g, 0, FB - 13, W, 3, '#7a5030'); qF(g, 0, FB - 13, W, 1, '#a07448'); qF(g, 0, FB - 6, W, 2, '#5e3a20');
    const gx = 150, gy = FB - 74;   // 탑승구: 나무 탑 · 지붕 · 열린 문 · 간판 띠 · 계단 · 다리
    qF(g, gx, gy, 46, 74, '#6e4626'); q3Logs(g, gx + 2, gy + 2, 42, 72, '#8a5a34', 21);
    qQ(g, [[gx - 6, gy + 2], [gx + 23, gy - 18], [gx + 52, gy + 2]], '#7a3a2a'); qQ(g, [[gx - 3, gy + 1], [gx + 23, gy - 15], [gx + 49, gy + 1]], '#a04a34');
    qF(g, gx + 12, gy + 20, 22, 30, '#3a2616'); qF(g, gx + 14, gy + 22, 18, 28, '#f0c868'); qF(g, gx + 14, gy + 22, 18, 3, '#fff0b8');
    qF(g, gx + 4, gy + 6, 38, 9, '#3a2616'); qF(g, gx + 5, gy + 7, 36, 7, '#c8402e'); qF(g, gx + 5, gy + 7, 36, 1, '#e86a4a');
    for (let i = 0; i < 6; i++) { qF(g, gx + 10 - i * 4, FB - 4 - i * 6, 24, 3, '#9a6a3e'); qF(g, gx + 10 - i * 4, FB - 4 - i * 6, 24, 1, '#c08a54'); }
    qF(g, gx - 22, gy + 48, 36, 4, '#7a5030'); qF(g, gx - 22, gy + 48, 36, 1, '#a07448'); for (let x = gx - 20; x < gx + 12; x += 6) qF(g, x, gy + 42, 1, 6, '#5e3a20'); qF(g, gx - 22, gy + 41, 36, 1, '#5e3a20');
    qF(g, 30, FB - 110, 5, 112, '#5e3a20'); qF(g, 30, FB - 110, 2, 112, '#7a5030'); qF(g, 25, FB - 112, 15, 4, '#4e3018'); for (let y = FB - 96; y < FB; y += 16) qF(g, 26, y, 13, 2, '#4e3018');   // 계류탑
    for (const [x, y0] of NESTS) qB(g, aNest2(34, 9), x, FB + y0 + 7);   // 짚 둥지 (빌드 63: 엮은 잔가지 도트)
  },
  live(g, K, t, T) {
    const { FB } = K, bob = i => Math.round(Math.sin(t * 1.3 + i * 2) * 1.5), gx = 150, gy = FB - 74, ships = hqShips(), nt = q3Night(T);
    if (ships[1]) { const x = 62, y = FB - 104 + bob(1); qB(g, aShip(1), x, y); qL(g, x - 28, y - 10, 33, FB - 110, '#3a2e22'); hqHitAdd(K, x - 43, y - 62, 86, 62, { win: 'b:airfield' }); }   // 둘째: 계류탑에 매임
    if (ships[0]) { const x = 98, y = gy + 52 + bob(0); qB(g, aShip(0), x, y); qL(g, x + 30, y - 14, gx + 2, gy + 30, '#3a2e22'); qL(g, x + 30, y - 4, gx + 2, gy + 44, '#3a2e22'); const pr = Math.floor(t * 12) % 2; qF(g, x + 34, y - 18 + (pr ? -3 : 0), 1, pr ? 7 : 3, '#d8dce4'); hqHitAdd(K, x - 43, y - 62, 86, 62, { win: 'b:airfield' }); }   // 첫째: 탑승구 다리 앞
    hqFlyers().slice(0, NESTS.length).forEach((pet, i) => {
      const [x, y0] = NESTS[i], y = FB + y0 - 3, id = petLook(pet), z = hqFit(id, 62);
      hqMon(g, id, x + 4, y, nt > 0.5 ? t * 0.3 : t, z, i % 2 === 1, i);
      if (nt > 0.5) qZ(g, x - 10, y - Math.round(monH(id) * z) - 2, t, i * 0.25);
      hqHitAdd(K, x - 34, y - 46, 68, 50, { win: 'b:stable' });
    });
    const k = (t * 0.06) % 2, wx = 16 + (k < 1 ? k : 2 - k) * 120; qPeo('hand', g, true, 'walk', Math.floor(t * 6) % 4, wx, FB + 12, k >= 1);
    if (nt > 0.2) q3Light(g, K, T, { amb: 0, ambN: 0.35, tint: '#0a0c1c', lamps: [[gx + 23, gy + 34, 40], [33, FB - 108, 24], [100, FB - 10, 30]], wins: [] }, t);
    for (const [x, y] of [[33, FB - 108], [gx + 23, gy + 4]]) { qF(g, x - 3, y - 4, 7, 7, '#2a2230'); qF(g, x - 2, y - 3, 5, 5, '#f8c060'); }
  }
};

/* ───────── 공통 그림 (돌벽 · 선반 · 약병 · 책 · 걸린 꾸러미 · 촛불 · 홑침대) ───────── */
function q4Stone(g, x0, y0, w, h, c0, seed, bw = 14, bh = 7) {
  const r = rng(seed), c = qR(c0);
  qF(g, x0, y0, w, h, c.d);
  for (let y = y0, row = 0; y < y0 + h; y += bh, row++) for (let x = x0 + (row % 2) * -(bw >> 1); x < x0 + w; x += bw) {
    const col = r() < 0.3 ? c.l : r() < 0.55 ? c.b : shade(c0, -0.08), xx = Math.max(x0, x + 1), ww = Math.min(x0 + w, x + bw) - xx, hh = Math.min(bh - 1, y0 + h - y - 1);
    if (ww > 0 && hh > 0) { qF(g, xx, y + 1, ww, hh, col); qF(g, xx, y + 1, ww, 1, shade(col, 0.15)); }
  }
}
function q4Shelf(g, x, y, w, c0) { const c = qR(c0); qF(g, x, y, w, 3, c.b); qF(g, x, y, w, 1, c.l); qF(g, x, y + 3, w, 1, c.k); qQ(g, [[x + 2, y + 4], [x + 6, y + 4], [x + 2, y + 9]], c.s); qQ(g, [[x + w - 6, y + 4], [x + w - 2, y + 4], [x + w - 2, y + 9]], c.s); }
function q4Bottles(g, x, y, w, seed) { const r = rng(seed); for (let xx = x + 2; xx < x + w - 3; xx += 5) { const c = ['#4ac85a', '#e04848', '#4a8ae0', '#d8b040', '#b05ad8', '#40c8c0'][Math.floor(r() * 6)], h = 5 + Math.floor(r() * 4), round = r() < 0.4; if (round) { qDisc(g, xx + 1, y - 3, 2, c); qF(g, xx + 1, y - 7, 1, 3, '#d8d0c0'); qP(g, xx, y - 4, shade(c, 0.5)); } else { qF(g, xx, y - h, 3, h, c); qF(g, xx + 1, y - h - 2, 1, 2, '#d8d0c0'); qP(g, xx, y - h + 1, shade(c, 0.5)); } } }
function q4Books(g, x, y, w, seed, h = 9) { const r = rng(seed); for (let xx = x; xx < x + w - 1;) { const bw = 2 + (r() < 0.25 ? 1 : 0), bh = h - 3 + Math.floor(r() * 4), c = ['#a8432f', '#3f6a9a', '#4f8a43', '#8a5a9a', '#c9a04a', '#6e4a2c', '#2e4a5a'][Math.floor(r() * 7)]; if (r() < 0.08) { qQ(g, [[xx, y], [xx + 2, y], [xx + 6, y - bh + 2], [xx + 4, y - bh + 1]], c); xx += 6; continue; } qF(g, xx, y - bh, bw, bh, c); qP(g, xx, y - bh + 2, shade(c, 0.4)); qF(g, xx, y - bh + 1, bw, 1, shade(c, -0.25)); xx += bw; } }
function q4Bookcase(g, x, yb, w, h, seed) {   // 바닥부터 선 큰 책장
  const c = qR('#5e3a20'), n = Math.floor((h - 6) / 15);
  qF(g, x, yb - h, w, h, c.d); qF(g, x, yb - h, w, 3, c.l);
  for (let k = 0; k < n; k++) { const y = yb - 4 - k * 15; q4Books(g, x + 3, y, w - 6, seed + k, 11); qF(g, x + 2, y, w - 4, 2, c.b); qF(g, x + 2, y, w - 4, 1, c.l); }
  qF(g, x, yb - h, 3, h, c.b); qF(g, x, yb - h, 1, h, c.l); qF(g, x + w - 3, yb - h, 3, h, c.s);
}
function q4Hang(g, x, y, kind, seed) {   // 말린 약초 · 마늘 · 고기 꾸러미
  qF(g, x, y, 1, 4, '#5e3a20');
  if (kind === 'herb') for (let k = 0; k < 4; k++) qF(g, x - 2 + k, y + 4 + k * 2, 4 - (k > 2 ? 1 : 0), 2, k % 2 ? '#6a9a48' : '#4f7a3a');
  if (kind === 'garlic') for (let k = 0; k < 4; k++) { qDisc(g, x + (k % 2 ? 1 : -1), y + 6 + k * 3, 2, '#f0e8d8'); qP(g, x + (k % 2 ? 1 : -1), y + 5 + k * 3, '#c8b8a0'); }
  if (kind === 'meat') { qEll(g, x, y + 9, 3, 6, '#a8432f'); qEll(g, x - 1, y + 8, 1, 3, '#d86a4a'); }
}
function q4Candle(g, x, y, t, c) { qF(g, x, y - 6, 2, 6, '#f4ecd8'); qF(g, x, y - 9 - (Math.floor(t * 8 + x) % 2), 2, 3, c || '#f8c060'); qP(g, x, y - 9, '#fff0b8'); }
function q4Bed(g, x, yb, len, a, blanket, t, ph) {   // 홑침대 (신전 환자)
  const w = qR('#d8d0c0');
  qF(g, x - 2, yb - 14, 3, 18, w.s); qF(g, x + len, yb - 9, 3, 13, w.s); qF(g, x - 2, yb - 14, 3, 1, w.l);
  qF(g, x, yb + 1, len, 4, w.b); qF(g, x, yb + 1, len, 1, w.l); qF(g, x, yb + 5, len, 1, w.k);
  qF(g, x, yb - 1, len, 3, '#f4f0e8');
  q3BedSlot(g, x + 1, yb, len - 2, a, blanket, t, ph);
}
const Q4MOT = { sword: 'down', dagger: 'hack', heavy: 'smash', pole: 'pthrust', staff: 'spush', bow: 'bshot', lute: 'lstrum', whip: 'wcrack', machete: 'mchop', card: 'cflick', wand: 'vflick', orb: 'opush', book: 'bkcast' };   // 빌드 65 새 무기   // 무기 갈래 → 훈련 동작
const hqFam = a => { try { return pxsFam(a); } catch (_) { return 'sword'; } };

/* ═══ 연금술 공방: 초록 솥 · 약병 선반 · 증류기 · 걸린 약초 ═══ */
const A3_ALCH = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 44; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q4Stone(g, 0, 0, W, FB, '#6a7068', 31);
    q3Beam(g, K.top + 2, W, '#4e3018'); for (const x of [0, 152]) q3Post(g, x, K.top + 11, FB, '#4e3018');
    q3Floor(g, K, '#5a5e56', '#52564e', '#363a34', 10);
  },
  house(g, K, T) {
    const { FB } = K;
    qDisc(g, 80, K.top + 30, 13, '#3a2616'); { const [c, x] = mkCanvas(22, 22); q3Glass(x, 0, 0, 22, 22, T, 7); const m = mkCanvas(22, 22); qDisc(m[1], 11, 11, 10, '#000'); m[1].globalCompositeOperation = 'source-in'; m[1].drawImage(c, 0, 0); g.drawImage(m[0], 69, K.top + 19); }   // 둥근 창
    qF(g, 79, K.top + 19, 2, 22, '#3a2616'); qF(g, 69, K.top + 29, 22, 2, '#3a2616');
    for (const [y, s] of [[K.top + 36, 3], [K.top + 56, 5], [K.top + 76, 9]]) { q4Shelf(g, 8, y, 50, '#5e3a20'); q4Bottles(g, 10, y, 46, s); }
    for (const [x, s] of [[24, 1], [40, 2], [104, 3], [122, 4], [138, 5]]) q4Hang(g, x, K.top + 11, 'herb', s);
    qF(g, 100, FB - 26, 54, 4, '#8a5a30'); qF(g, 100, FB - 26, 54, 1, '#b08048'); qF(g, 104, FB - 22, 3, 22, '#5e3a20'); qF(g, 147, FB - 22, 3, 22, '#5e3a20'); qF(g, 102, FB - 8, 50, 2, '#5e3a20');   // 작업대 + 증류기
    qDisc(g, 114, FB - 33, 6, '#b8e0f0'); qDisc(g, 114, FB - 32, 5, '#5ac85a'); qF(g, 112, FB - 44, 4, 6, '#b8e0f0'); qL(g, 115, FB - 44, 134, FB - 52, '#b8e0f0'); qL(g, 134, FB - 52, 138, FB - 36, '#b8e0f0');
    qF(g, 135, FB - 36, 7, 9, '#b8e0f0'); qF(g, 136, FB - 32, 5, 4, '#e04848'); qF(g, 111, FB - 27, 6, 1, '#3a3040');
    qF(g, 124, FB - 31, 6, 5, '#7a6a5a'); qF(g, 125, FB - 30, 4, 3, '#a89a88');   // 절구
    qB(g, aBoard2(), 105, K.top + 29); hqNotes2(g, 106, K.top + 30, 4);
  },
  live(g, K, t, T) {
    const { FB } = K, cx = 64, cy = FB + 20;
    drawFire(g, cx, cy + 1, t, true);   // 큰 솥: 불 위 · 초록 물이 끓는다
    qEll(g, cx, cy - 6, 20, 9, '#1e1c22'); qEll(g, cx, cy - 9, 21, 9, '#2e2c34'); qEll(g, cx - 4, cy - 12, 12, 3, '#46424e'); qEll(g, cx, cy - 15, 18, 5, '#1e1c22'); qEll(g, cx, cy - 15, 16, 4, '#4ac85a');
    for (let i = 0; i < 4; i++) { const k = (t * 1.3 + i * 0.27) % 1, bx = cx - 10 + i * 6 + Math.round(Math.sin(t * 3 + i) * 2); if (k < 0.5) qDisc(g, bx, cy - 15 - Math.round(k * 4), 1, '#a8f8a0'); }
    for (let i = 0; i < 5; i++) { const k = (t * 0.5 + i / 5) % 1; g.globalAlpha = 0.45 * (1 - k); qDisc(g, cx - 6 + i * 3 + Math.round(Math.sin(k * 6 + i) * 3), cy - 20 - Math.round(k * 30), 2 + Math.round(k * 2), '#b8f8b0'); }
    g.globalAlpha = 1;
    qF(g, cx - 22, cy - 10, 3, 6, '#2e2c34'); qF(g, cx + 19, cy - 10, 3, 6, '#2e2c34');
    qPeo('alchem', g, true, 'atk', Math.floor(t * 2) % 2, cx + 30, FB + 22, true);
    q4Candle(g, 130, FB - 26, t); q4Candle(g, 146, FB - 26, t);
    qB(g, q3Lamp(10), 44, K.top + 11);
    q3Light(g, K, T, { amb: 0.38, lamps: [[cx, cy - 16, 56, '#6af070'], [138, FB - 34, 30], [48, K.top + 26, 34]], wins: [[69, K.top + 19, 22, 22, 30]] }, t);
  }
};

/* ═══ 주방: 돌 화덕 · 빵 가마 · 걸린 냄비 · 긴 식탁 ═══ */
const A3_KITCHEN = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 44; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q3Logs(g, 0, 0, W, FB, '#8a5a34', 17);
    for (let y = FB - 58, row = 0; y < FB - 16; y += 6, row++) for (let x = 6 + (row % 2) * 4; x < 66; x += 8) { qF(g, x, y, 7, 5, (x + y) % 3 ? '#e8e4d8' : '#7aa0c8'); qF(g, x, y, 7, 1, '#ffffff'); }   // 화덕 뒤 타일
    q3Beam(g, K.top + 2, W, '#4e3018');
    q3Floor(g, K, '#8a7a66', '#7e6e5c', '#5a4e40', 10);
  },
  house(g, K) {
    const { FB } = K;
    qF(g, 6, FB - 16, 60, 16, '#6a625e'); qF(g, 6, FB - 18, 60, 3, '#8a827c'); qF(g, 6, FB - 18, 60, 1, '#a49c96');   // 돌 화덕 · 아궁이 둘 · 갓
    qQ(g, [[18, FB], [18, FB - 10], [22, FB - 13], [30, FB - 13], [34, FB - 10], [34, FB]], '#1a1210'); qQ(g, [[40, FB], [40, FB - 10], [44, FB - 13], [52, FB - 13], [56, FB - 10], [56, FB]], '#1a1210');
    qQ(g, [[4, FB - 64], [68, FB - 64], [58, FB - 74], [14, FB - 74]], '#5e5854'); qF(g, 22, FB - 110, 28, 36, '#56504c'); qF(g, 22, FB - 110, 3, 36, '#6a645e');
    qF(g, 72, K.top + 30, 40, 2, '#3a3040');   // 걸린 냄비 · 마늘 · 고기
    for (const [x, r] of [[78, 5], [92, 6], [106, 4]]) { qF(g, x, K.top + 32, 1, 4, '#3a3040'); qEll(g, x, K.top + 40, r, 3, '#8a8e98'); qF(g, x - r, K.top + 37, r * 2 + 1, 3, '#6a707a'); qF(g, x - 1, K.top + 36, 3, 1, '#c8ccd4'); }
    for (const [x, k, s] of [[118, 'garlic', 1], [126, 'meat', 2], [134, 'garlic', 3], [142, 'meat', 4]]) q4Hang(g, x, K.top + 11, k, s);
    for (const y of [K.top + 50, K.top + 66]) { q4Shelf(g, 100, y, 52, '#5e3a20'); const r = rng(y); for (let x = 103; x < 148; x += 7) { const k = r(); if (k < 0.5) { qF(g, x, y - 7, 5, 7, '#c8a050'); qF(g, x, y - 8, 5, 1, '#e8dcb8'); qF(g, x + 1, y - 5, 3, 2, ['#c0392b', '#4f8a43', '#e8c060'][Math.floor(r() * 3)]); } else { qEll(g, x + 2, y - 4, 3, 4, '#c8b48a'); qF(g, x + 1, y - 9, 3, 2, '#a8946a'); } } }   // 식료품 선반
    for (let y = 0; y < 30; y++) { const hw = Math.round(22 * Math.sqrt(Math.max(0, 1 - ((30 - y) / 30) ** 2))); qF(g, 130 - hw, FB - 30 + y, hw * 2, 1, y % 5 === 0 ? '#7a3a2a' : '#a8543a'); }   // 빵 가마
    qQ(g, [[122, FB], [122, FB - 8], [126, FB - 12], [134, FB - 12], [138, FB - 8], [138, FB]], '#1a1210');
  },
  live(g, K, t, T) {
    const { FB } = K;
    drawFire(g, 26, FB - 1, t, false); drawFire(g, 48, FB - 1, t, false);
    for (const [x, c] of [[26, '#c8803a'], [48, '#e8dcb8']]) { qEll(g, x, FB - 21, 9, 3, '#2a2a30'); qF(g, x - 9, FB - 26, 19, 5, '#3a3a44'); qEll(g, x, FB - 26, 8, 2, c); for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3 + x) % 1; g.globalAlpha = 0.4 * (1 - k); qDisc(g, x - 3 + i * 3, FB - 30 - Math.round(k * 18), 1 + Math.round(k * 2), '#f0f0f0'); } g.globalAlpha = 1; }
    qF(g, 127, FB - 8, 6, 5, Math.floor(t * 3) % 2 ? '#f8a040' : '#e07028');
    qPeo('cook', g, true, 'idle', Math.floor(t * 1.3) % 2, 40, FB + 22, false);
    const ty = FB + 34; qF(g, 70, ty - 12, 80, 4, '#a8743e'); qF(g, 70, ty - 12, 80, 1, '#d09a60'); qF(g, 70, ty - 8, 80, 2, '#6e4626'); qF(g, 74, ty - 8, 3, 9, '#5e3a20'); qF(g, 143, ty - 8, 3, 9, '#5e3a20');   // 긴 식탁: 빵 · 채소 · 도마
    qEll(g, 82, ty - 15, 6, 3, '#c8883a'); qEll(g, 82, ty - 16, 5, 2, '#e0a858'); qEll(g, 94, ty - 14, 4, 2, '#c8883a');
    qF(g, 104, ty - 14, 14, 2, '#c8a070'); qF(g, 108, ty - 17, 2, 3, '#e86a2a'); qF(g, 111, ty - 16, 2, 2, '#e86a2a'); qDisc(g, 126, ty - 15, 3, '#5a9a48'); qP(g, 125, ty - 16, '#8aca6a'); qF(g, 134, ty - 15, 8, 3, '#c04a3a'); qF(g, 134, ty - 15, 8, 1, '#e07a6a');
    qB(g, q3Lamp(8), 86, K.top + 11);
    q3Light(g, K, T, { amb: 0.34, lamps: [[36, FB - 10, 52, '#f88a3c'], [130, FB - 10, 36, '#f88a3c'], [90, K.top + 26, 40]], wins: [] }, t);
  }
};

/* ═══ 훈련소: 허수아비 · 과녁 · 목검 걸이 · 쉬는 모험가가 낮에 훈련한다 (밤에는 여관에서 잔다) ═══ */
function q4Dummy(g, x, yb, hit) { qF(g, x - 1, yb - 30, 3, 30, '#6e4626'); qF(g, x - 9, yb - 22, 19, 3, '#6e4626'); qEll(g, x + (hit ? 1 : 0), yb - 18, 6, 8, '#d8b860'); qEll(g, x + (hit ? 1 : 0), yb - 30, 4, 4, '#e0c070'); qF(g, x - 4, yb - 18, 9, 2, '#a8432f'); for (let k = 0; k < 5; k++) qP(g, x - 4 + k * 2, yb - 14 + (k % 2), '#b89840'); qF(g, x - 6, yb - 2, 13, 2, '#5e3a20'); }
const A3_TRAIN = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 52; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q3Logs(g, 0, 0, W, FB, '#8a5e38', 23);
    q3Beam(g, K.top + 2, W, '#4e3018'); for (const x of [0, 76, 152]) q3Post(g, x, K.top + 11, FB, '#5e3a20');
    q3Floor(g, K, '#8a6a46', '#7e6040', '#5a4228', 10);
    q3Rug(g, 30, 130, 20, 140, FB + 6, FB + 44, RUG_BLUE);   // 빌드 63: 무늬 깔개 (도트)
  },
  house(g, K, T) {
    const { FB } = K;
    q3Win(g, 24, K.top + 18, 26, 20, T, {}); q3Win(g, 110, K.top + 18, 26, 20, T, {});
    qB(g, aBanner('#a8432f', 'shoe'), 80, K.top + 14);
    qF(g, 8, FB - 64, 60, 3, '#5e3a20'); qF(g, 8, FB - 38, 60, 3, '#5e3a20');   // 목검 · 방패 걸이
    for (let x = 12; x < 64; x += 8) { qF(g, x, FB - 66, 2, 26, '#b08048'); qF(g, x - 2, FB - 46, 6, 2, '#6e4626'); }
    for (const x of [92, 112]) { qDisc(g, x, FB - 52, 8, '#5e3a20'); qDisc(g, x, FB - 52, 7, '#8a5a30'); qDisc(g, x, FB - 52, 3, '#c9a04a'); }
    qDisc(g, 140, FB - 30, 12, '#f0e8d8'); qDisc(g, 140, FB - 30, 9, '#c0392b'); qDisc(g, 140, FB - 30, 6, '#f0e8d8'); qDisc(g, 140, FB - 30, 3, '#c0392b'); qF(g, 138, FB - 18, 5, 18, '#6e4626');   // 과녁
  },
  live(g, K, t, T) {
    const { FB } = K, fr = Math.floor(t * 7) % 8;
    // 자리: 허수아비 둘(칼 · 둔기 · 창) · 과녁(활) · 마법 연습(지팡이 · 류트). 맞는 자리가 차면 남은 자리로
    const spots = [{ k: 'melee', x: 30, i: 0 }, { k: 'melee', x: 76, i: 1 }, { k: 'bow' }, { k: 'cast' }], used = [];
    const want = fam => (fam === 'bow' ? 'bow' : fam === 'staff' || fam === 'lute' ? 'cast' : 'melee');
    const put = {};
    for (const a of hqWhere().train) { const f = hqFam(a); let s = spots.find(p => !used.includes(p) && p.k === want(f)) || spots.find(p => !used.includes(p)); if (!s) break; used.push(s); put[spots.indexOf(s)] = a; }
    [0, 1].forEach(j => {
      const sp = spots[j], a = put[j], f = (fr + j * 3) % 8, mk = a ? Q4MOT[hqFam(a)] || 'down' : null;
      q4Dummy(g, sp.x + 18, FB + 18 + j * 6, !!a && f >= 4 && f <= 5);
      if (a) { q4Spr(g, a, true, 'm:' + mk, f, sp.x, FB + 24 + j * 6, false); hqHitAdd(K, sp.x - 10, FB - 4 + j * 6, 22, 30, { adv: a.id }); }
    });
    const ar = put[2];
    if (ar) { const mk = Q4MOT[hqFam(ar)] || 'bshot'; q4Spr(g, ar, true, 'm:' + mk, fr, 104, FB + 34, false); hqHitAdd(K, 94, FB + 6, 22, 30, { adv: ar.id }); if (mk === 'bshot') { const k = (t * 0.7) % 1; if (k < 0.4) qF(g, 112 + Math.round(k * 60), FB + 12 - Math.round(k * 14), 4, 1, '#d8d0c0'); } }
    const st = put[3];
    if (st) { q4Spr(g, st, true, 'm:' + (Q4MOT[hqFam(st)] || 'spush'), (fr + 2) % 8, 128, FB + 46, true); hqHitAdd(K, 118, FB + 18, 22, 30, { adv: st.id }); }
    qPeo('coach', g, false, 'idle', Math.floor(t * 1.2) % 2, 148, FB + 22);
    for (const x of [38, 118]) qB(g, q3Lamp(6), x, K.top + 11);
    q3Light(g, K, T, { amb: 0.3, lamps: [[42, K.top + 24, 46], [122, K.top + 24, 46]], wins: [[24, K.top + 18, 26, 20, 50], [110, K.top + 18, 26, 20, 50]] }, t);
  }
};

/* ═══ 신전: 대리석 · 금 · 붉은 천 · 푸른 천 · 꽃잎 색유리 창 · 제단과 금 화로 · 환자 침대 · 치유사 ═══ */
function q4Marble(g, x0, y0, w, h, seed) {
  const r = rng(seed);
  qF(g, x0, y0, w, h, '#e8e4dc');
  for (let k = 0; k < w * h / 140; k++) { let x = x0 + Math.floor(r() * w), y = y0 + Math.floor(r() * h); const n = 4 + Math.floor(r() * 10), c = r() < 0.5 ? '#c8c4bc' : '#d6d2ca'; for (let j = 0; j < n; j++) { qP(g, x, y, c); x += r() < 0.5 ? 1 : 0; y += r() < 0.6 ? 1 : -1; } }
  for (let y = y0 + 24; y < y0 + h; y += 24) { qF(g, x0, y, w, 1, '#c8c2b6'); qF(g, x0, y + 1, w, 1, '#f8f6f0'); }
}
function q4Pillar(g, x, y0, y1) {   // 대리석 기둥 · 금 머리 · 금 받침
  qF(g, x, y0, 12, y1 - y0, '#ece8e0'); qF(g, x, y0, 3, y1 - y0, '#ffffff'); qF(g, x + 9, y0, 3, y1 - y0, '#c8c2b6'); for (const dx of [4, 7]) qF(g, x + dx, y0 + 6, 1, y1 - y0 - 12, '#d6d0c4');
  for (const y of [y0, y1 - 6]) { qF(g, x - 3, y, 18, 6, '#c9a04a'); qF(g, x - 3, y, 18, 1, '#f8d870'); qF(g, x - 3, y + 5, 18, 1, '#8a6a1a'); }
}
function q4Drape(g, x, y, w, h, c0) {   // 늘어진 천 (주름 · 금 술)
  const c = qR(c0);
  for (let k = 0; k < w; k++) { const fold = Math.sin(k / w * Math.PI * 3), hh = h - Math.round(Math.abs(Math.sin(k / w * Math.PI)) * 4); qF(g, x + k, y, 1, hh, fold > 0.3 ? c.l : fold < -0.3 ? c.s : c.b); }
  qF(g, x, y, w, 3, '#c9a04a'); qF(g, x, y, w, 1, '#f8d870'); for (let k = 2; k < w; k += 4) qF(g, x + k, y + h - 3, 1, 3, '#d9b44a');
}
const A3_TEMPLE = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 52; return K; },
  bg(g, K) {
    const { W, H, FB } = K;
    q4Marble(g, 0, 0, W, FB, 41);
    qF(g, 0, K.top + 4, W, 4, '#c9a04a'); qF(g, 0, K.top + 4, W, 1, '#f8d870'); qF(g, 0, FB - 20, W, 3, '#c9a04a'); qF(g, 0, FB - 20, W, 1, '#f8d870');
    qF(g, 0, FB, W, H - FB, '#d8d4cc');   // 바닥: 흰 · 회색 대리석 바둑판 (원근)
    for (let i = -6; i < 12; i++) for (let j = 0; j < 6; j++) { const y0 = FB + j * 9, y1 = FB + (j + 1) * 9, k0 = 1 + j * 0.12, k1 = 1 + (j + 1) * 0.12, xa = W / 2 + (i * 16 - W / 2) * k0, xb = W / 2 + ((i + 1) * 16 - W / 2) * k0, xc = W / 2 + ((i + 1) * 16 - W / 2) * k1, xd = W / 2 + (i * 16 - W / 2) * k1; qQ(g, [[xa, y0], [xb, y0], [xc, y1], [xd, y1]], (i + j) % 2 ? '#e8e4dc' : '#b8b2a8'); }
    qF(g, 0, FB, W, 2, '#8a8478');
    qQ(g, [[66, FB], [94, FB], [104, H], [56, H]], '#c9a04a'); qQ(g, [[68, FB], [92, FB], [101, H], [59, H]], '#a8282a');   // 붉은 융단
    for (let y = FB + 2; y < H; y += 6) { const k = (y - FB) / (H - FB), x = Math.round(80 + 0 * k); qP(g, x, y, '#e8c060'); qP(g, x - 1, y + 1, '#c9a04a'); qP(g, x + 1, y + 1, '#c9a04a'); qP(g, x, y + 2, '#e8c060'); }   // 빌드 63: 가운데 금 마름모 줄 (도트)
    for (let y = FB; y < H; y++) { const k = (y - FB) / (H - FB); qP(g, Math.round(68 - 9 * k) + 1, y, '#7a1a1c'); qP(g, Math.round(92 + 9 * k) - 1, y, '#7a1a1c'); }
  },
  house(g, K, T) {
    const { FB } = K, cx = 80, cy = K.top + 34, br = 1 - q3Night(T) * 0.65;
    qDisc(g, cx, cy, 19, '#c9a04a'); qDisc(g, cx, cy, 17, '#5e5040');   // 꽃잎 색유리 창 — 바깥 시간에 따라 밝기
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, col = ['#5a8ae0', '#e04848', '#e8c040', '#4ab870'][k % 4]; for (let rr = 4; rr < 16; rr++) qDisc(g, Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr), rr < 12 ? 2 : 1, mix('#101420', col, br)); }
    qDisc(g, cx, cy, 4, mix('#101420', '#f8e8a0', br)); qDisc(g, cx, cy, 2, mix('#101420', '#ffffff', br));
    for (const x of [6, 46, 102, 142]) q4Pillar(g, x, K.top + 8, FB);
    q4Drape(g, 20, K.top + 12, 24, 58, '#a8282a'); q4Drape(g, 116, K.top + 12, 24, 58, '#a8282a');
    q4Drape(g, 60, K.top + 58, 40, 18, '#2e4a8a');
    qF(g, 58, FB - 24, 44, 24, '#ece8e0'); qF(g, 58, FB - 24, 44, 2, '#ffffff'); qF(g, 58, FB - 26, 44, 3, '#c9a04a'); qF(g, 58, FB - 26, 44, 1, '#f8d870'); qF(g, 58, FB - 4, 44, 4, '#c9a04a');   // 제단
    qF(g, 66, FB - 20, 28, 14, '#2e4a8a'); qF(g, 66, FB - 20, 28, 2, '#c9a04a'); qDisc(g, 80, FB - 13, 3, '#c9a04a');
    qEll(g, 80, FB - 31, 11, 4, '#8a6a1a'); qEll(g, 80, FB - 32, 11, 4, '#c9a04a'); qEll(g, 80, FB - 33, 9, 2, '#5a2a10'); qF(g, 77, FB - 29, 7, 3, '#c9a04a'); qEll(g, 80, FB - 26, 7, 2, '#c9a04a'); qP(g, 73, FB - 33, '#f8d870');   // 금 화로 (낮고 넓게)
    for (const x of [62, 98]) { qEll(g, x + 1, FB - 27, 4, 2, '#c9a04a'); qF(g, x, FB - 32, 3, 5, '#c9a04a'); }
  },
  live(g, K, t, T) {
    const { FB } = K, W = hqWhere(), nt = q3Night(T);
    { const f = Math.floor(t * 8) % 3; for (const [dx, h] of [[-5, 4], [-2, 7], [1, 8], [4, 5]]) qF(g, 80 + dx, FB - 34 - h - (dx + f) % 2, 2, h, h > 6 ? '#f8d070' : '#f08a3c'); qF(g, 78, FB - 38, 4, 3, '#fff4c0'); }
    for (const x of [62, 99]) q4Candle(g, x, FB - 32, t);
    // 환자 침대 둘 (다친 모험가가 누워 쉰다) · 치유사가 곁에 · 사제는 제단 앞에서 뒷모습으로 기도
    const pa = [W.sick[0] || null, W.sick[1] || null];
    q4Bed(g, 8, FB + 30, 40, pa[0], '#a8282a', t, 0); q4Bed(g, 112, FB + 30, 40, pa[1], '#2e4a8a', t, 0.4);
    [[30, FB + 14, 0, 6], [134, FB + 14, 1, 110]].forEach(([x, y, i, bx]) => { if (!pa[i]) return; qP(g, x - 2, y - 4, '#e0503f'); qP(g, x, y - 4, '#e0503f'); qF(g, x - 2, y - 3, 5, 1, '#e0503f'); qF(g, x - 1, y - 2, 3, 1, '#e0503f'); qP(g, x, y - 1, '#e0503f'); hqHitAdd(K, bx, FB + 10, 44, 26, { adv: pa[i].id }); });   // 다친 표시: 작은 하트
    W.heal.slice(0, 2).forEach((h, i) => { const x = i ? 104 : 56; q4Spr(g, h, true, 'idle', Math.floor(t * 1.2 + i) % 2, x, FB + 22, !i); hqHitAdd(K, x - 9, FB - 4, 18, 28, { adv: h.id }); });
    qPeoBack('priest', g, Math.floor(t) % 2, 80, FB + 20);
    q3Light(g, K, T, { amb: 0.24, ambN: 0.26, tint: '#100c18', lamps: [[80, FB - 40, 60, '#f8d070'], [62, FB - 44, 26], [99, FB - 44, 26]], wins: [[61, K.top + 15, 38, 38, 0]], soft: [[80, K.top + 34, 40, 0.5 * (1 - nt)]] }, t);
    if (nt < 0.7) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.08 * (1 - nt); for (const [c, dx] of [['#5a8ae0', -10], ['#e04848', 0], ['#e8c040', 10]]) { g.fillStyle = c; for (let y = K.top + 52; y < FB + 30; y++) g.fillRect(Math.round(74 + dx + (y - K.top - 52) * 0.25), y, 6, 1); } g.restore(); }   // 색유리 빛살
  }
};

/* ═══ 사육장: 낮은 울타리 · 짚 · 알 둥지와 따뜻한 등 · 상단에 남은 펫들이 돌아다닌다 ═══ */
const A3_PEN = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 56; return K; },
  bg(g, K) {
    const { W, FB } = K, c = qR('#9a6a3e');
    qF(g, 0, 0, W, FB, c.b); for (let x = 0, i = 0; x < W; x += 6, i++) { if (i % 2) qF(g, x, 0, 6, FB, c.s); qF(g, x, 0, 1, FB, c.d); }
    q3Beam(g, K.top + 2, W, '#4e3018');
    q3Floor(g, K, '#9a7a48', '#8e6e40', '#6a522c', 10);
    const r = rng(29); for (let k = 0; k < 160; k++) qF(g, Math.floor(r() * W), FB + 3 + Math.floor(r() * (K.H - FB - 3)), 2, 1, r() < 0.5 ? '#d8b050' : '#b08a30');
  },
  house(g, K, T) {
    const { W, FB } = K;
    q3Win(g, 64, K.top + 16, 30, 20, T, {});
    for (let x = 4; x < W; x += 14) qF(g, x, FB - 20, 3, 20, '#6e4626');   // 뒤 낮은 울타리 · 건초 · 구유
    for (const y of [FB - 18, FB - 10]) { qF(g, 0, y, W, 3, '#8a5a30'); qF(g, 0, y, W, 1, '#b08048'); }
    qB(g, aHay(26, 12), 6, FB - 1); qB(g, aHay(20, 10), 10, FB - 12);
    qB(g, aTrough(30), 116, FB + 2);
    qF(g, 142, K.top + 11, 1, 30, '#3a3040'); qF(g, 136, K.top + 41, 13, 6, '#3a3040'); qF(g, 138, K.top + 46, 9, 2, '#f8a040');   // 알 둥지 위 따뜻한 등
    qB(g, aBoard2(), 17, K.top + 17); hqNotes2(g, 18, K.top + 18, 3);
    qB(g, aNest2(14, 4), 142, FB);   // 빌드 63: 엮은 둥지
  },
  live(g, K, t, T) {
    const { FB } = K;
    ((S.pen && S.pen.inc) || []).slice(0, 3).forEach((x, i) => { const E = ITEMS['egg_' + x.kind] || { c: '#e8dcb8' }, ex = 134 + i * 7, wob = Math.round(Math.sin(t * 4 + i) * 0.6); qEll(g, ex + wob, FB - 10, 3, 4, E.c); qP(g, ex - 1 + wob, FB - 12, shade(E.c, 0.4)); });   // 품는 알
    petsAtHome().slice(0, 7).forEach((pet, i) => {
      const id = petLook(pet), bx = 22 + (i % 4) * 34, by = FB + 18 + Math.floor(i / 4) * 22, x = bx + Math.sin(t * 0.6 + i * 2) * 10, hop = Math.abs(Math.sin(t * 4 + i)) * 2, fl = Math.cos(t * 0.6 + i * 2) < 0;
      hqMon(g, id, x, by - hop, t, Math.min(1, monFit(id, 22)), fl, i);
    });
    qPeo('groom', g, true, 'idle', Math.floor(t * 1.2) % 2, 110, FB + 30, true);
    qB(g, q3Lamp(6), 40, K.top + 11);
    q3Light(g, K, T, { amb: 0.3, lamps: [[142, K.top + 48, 38, '#f8a040'], [44, K.top + 24, 40]], wins: [[64, K.top + 16, 30, 20, 50]] }, t);
  }
};

/* ═══ 도서관: 바닥부터 천장까지 책장 · 사다리 · 지구본 · 촛불 책상 · 현자와 책 읽는 모험가 ═══ */
const A3_LIB = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 44; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q3Logs(g, 0, 0, W, FB, '#6e4630', 37);
    q3Floor(g, K, '#6a462a', '#5e3e26', '#3a2414', 10);
    q3Rug(g, 36, 124, 28, 132, FB + 8, FB + 32, RUG_PLUM);   // 빌드 63: 무늬 깔개 (도트)
  },
  house(g, K, T) {
    const { FB } = K;
    q4Bookcase(g, 2, FB, 52, FB - K.top + 4, 3); q4Bookcase(g, 106, FB, 52, FB - K.top + 4, 9);
    q3Win(g, 66, K.top + 14, 28, 26, T, { curtain: '#5a2a3a' });
    qF(g, 56, K.top + 4, 2, FB - K.top - 4, '#8a6038'); qF(g, 50, K.top + 4, 2, FB - K.top - 4, '#8a6038'); for (let y = K.top + 10; y < FB; y += 8) qF(g, 50, y, 8, 2, '#a07448');   // 사다리
    qF(g, 84, FB - 26, 1, 8, '#6e4626'); qDisc(g, 84, FB - 32, 7, '#3a7aa8'); qF(g, 80, FB - 36, 5, 3, '#5aa04a'); qF(g, 85, FB - 31, 4, 4, '#5aa04a'); qF(g, 79, FB - 18, 11, 2, '#6e4626');   // 지구본
    qF(g, 66, FB - 12, 12, 12, '#5e3a20'); q4Books(g, 66, FB - 12, 12, 21, 8);
  },
  live(g, K, t, T) {
    const { FB } = K, rd = hqWhere().lib[0];
    qPeo('sage', g, false, 'idle', Math.floor(t * 0.8) % 2, 48, FB + 20);
    if (rd) { q4Spr(g, rd, false, 'sit', 0, 116, FB + 22, false); hqHitAdd(K, 106, FB - 4, 20, 28, { adv: rd.id }); }
    for (const x of [24, 92]) { qF(g, x, FB + 12, 46, 4, '#8a5a30'); qF(g, x, FB + 12, 46, 1, '#b08048'); qF(g, x + 3, FB + 16, 3, 14, '#5e3a20'); qF(g, x + 40, FB + 16, 3, 14, '#5e3a20'); }
    qF(g, 36, FB + 8, 16, 4, '#f4ecd8'); qF(g, 44, FB + 8, 1, 4, '#c8bca0'); qF(g, 38, FB + 9, 5, 1, '#8a8070'); qF(g, 46, FB + 9, 5, 1, '#8a8070'); qL(g, 56, FB + 11, 60, FB + 4, '#f4f0e4');
    q4Books(g, 100, FB + 12, 14, 31, 8); q4Candle(g, 30, FB + 12, t); q4Candle(g, 130, FB + 12, t);
    q3Light(g, K, T, { amb: 0.36, lamps: [[31, FB + 4, 34], [131, FB + 4, 34], [80, K.top + 20, 30]], wins: [[66, K.top + 14, 28, 26, 40]] }, t);
  }
};

/* ═══ 마탑: 보랏빛 돌 · 빛나는 마법진 · 떠 있는 수정 구슬(연구 중이면 밝게) · 망원경 · 별 지도 ═══ */
const A3_TOWER = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 50; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q4Stone(g, 0, 0, W, FB, '#4a3e6a', 53, 16, 8);
    for (let x = 6; x < W; x += 20) { qL(g, x, K.top + 10, x + 6, K.top + 4, '#7ad8f0'); qL(g, x + 6, K.top + 4, x + 12, K.top + 10, '#7ad8f0'); qP(g, x + 6, K.top + 8, '#c8f0ff'); }   // 빛나는 세모 띠
    q3Floor(g, K, '#3a3058', '#342a50', '#221a38', 10);
  },
  house(g, K, T) {
    const { FB } = K, wx = 98, wy = K.top + 18, ww = 40, wh = 50;
    for (let y = 0; y < wh; y++) { const half = y < 20 ? Math.round(Math.sqrt(Math.max(0, 400 - (20 - y) ** 2))) : 20; qF(g, wx + 20 - half - 3, wy + y - 3, half * 2 + 6, 1, '#2a2040'); }   // 아치 큰 창
    { const [c, x] = mkCanvas(ww, wh); q3Glass(x, 0, 0, ww, wh, T, 13); if (q3Night(T) > 0.4) { qDisc(x, 28, 12, 5, '#f8f0c8'); qDisc(x, 30, 11, 4, mix('#101420', T.sky[0], 0.5)); } for (let y = 0; y < 20; y++) { const half = Math.round(Math.sqrt(Math.max(0, 400 - (20 - y) ** 2))); x.clearRect(0, y, 20 - half, 1); x.clearRect(20 + half, y, 20, 1); } g.drawImage(c, wx, wy); }
    qF(g, wx + 19, wy, 2, wh, '#2a2040'); qF(g, wx, wy + 26, ww, 2, '#2a2040');
    qQ(g, [[wx - 10, FB - 34], [wx + 14, FB - 56], [wx + 18, FB - 52], [wx - 6, FB - 30]], '#c9a04a'); qF(g, wx - 4, FB - 32, 2, 32, '#5e3a20'); qF(g, wx - 12, FB - 2, 18, 2, '#5e3a20'); qL(g, wx - 4, FB - 30, wx - 12, FB - 2, '#5e3a20');   // 망원경
    qF(g, 10, K.top + 20, 40, 28, '#1a2040'); qF(g, 10, K.top + 20, 40, 2, '#c9a04a'); { const r = rng(5), pts = []; for (let k = 0; k < 9; k++) { const p = [12 + Math.floor(r() * 36), K.top + 24 + Math.floor(r() * 22)]; pts.push(p); qP(g, p[0], p[1], '#f8f0c8'); } for (let k = 0; k < 4; k++) qL(g, pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], '#5a6aa0'); }   // 별 지도
    q4Bookcase(g, 4, FB, 40, 56, 17);
  },
  live(g, K, t, T) {
    const { FB } = K, cx = 74, cy = FB + 26, k = (Math.sin(t * 2) + 1) / 2, on = !!(S.research && S.research.cur);
    g.save(); g.globalAlpha = (on ? 0.55 : 0.35) + k * 0.35;   // 바닥 마법진
    for (const [rx, ry, c] of [[44, 12, '#7ad8f0'], [38, 10, '#b88aff'], [26, 7, '#7ad8f0']]) for (let a = 0; a < 360; a += 3) { const r = a * Math.PI / 180; qP(g, cx + Math.cos(r) * rx, cy + Math.sin(r) * ry, c); }
    for (let i = 0; i < 6; i++) { const r = (i / 6) * Math.PI * 2 + t * 0.3; qF(g, Math.round(cx + Math.cos(r) * 32) - 1, Math.round(cy + Math.sin(r) * 9) - 1, 3, 2, '#c8f0ff'); }
    g.restore();
    const oy = Math.round(cy - 40 - Math.sin(t * 1.5) * 3);   // 떠 있는 수정 구슬 · 떠도는 책 둘
    qDisc(g, cx, oy, 7, '#5a3a9a'); qDisc(g, cx, oy, 6, on ? '#b88aff' : '#7a5aba'); qDisc(g, cx - 2, oy - 2, 2, '#e8d8ff'); qF(g, cx - 5, oy + 7, 11, 2, '#c9a04a');
    for (let i = 0; i < 2; i++) { const a = t * 0.8 + i * Math.PI, bx = Math.round(cx + Math.cos(a) * 26), by = Math.round(oy + 4 + Math.sin(a) * 6); qF(g, bx - 4, by - 3, 8, 6, i ? '#a8432f' : '#3f6a9a'); qF(g, bx - 4, by - 3, 8, 1, '#f4ecd8'); }
    qPeo('sage', g, true, 'm:spush', Math.floor(t * 3) % 8 < 4 ? 2 : 3, cx - 36, FB + 30, false);
    for (const x of [20, 128]) { qF(g, x, FB + 6, 2, 6, '#f4ecd8'); qF(g, x, FB + 3 - (Math.floor(t * 8 + x) % 2), 2, 3, '#7ad8f0'); }
    q3Light(g, K, T, { amb: 0.42, tint: '#0a0818', lamps: [[cx, oy, on ? 52 : 40, '#b88aff'], [cx, cy, 50, '#7ad8f0'], [21, FB + 2, 24, '#7ad8f0'], [129, FB + 2, 24, '#7ad8f0']], wins: [[98, K.top + 18, 40, 50, 0]] }, t);
  }
};

/* ═══ 던전 수거소 (지하 맨 아래): 굴 같은 돌벽 · 나무 버팀 · 던전 지도 · 트로피 선반 · 레일 위 광차 · 분류대 ═══
   수거꾼은 낮 · 저녁에 던전에 나가 있고, 새벽 · 밤에 돌아와 광차를 민다 */
const A3_SALV = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 50; return K; },
  bg(g, K) {
    const { W, FB } = K;
    q4Stone(g, 0, 0, W, FB, '#5a4c40', 71, 18, 9);
    for (const x of [0, 64, 128]) q3Post(g, x, K.top + 2, FB, '#6e4626');
    qF(g, 0, K.top + 2, W, 6, '#6e4626'); qF(g, 0, K.top + 2, W, 1, '#9a6a3e');
    q3Floor(g, K, '#5e5246', '#56483e', '#3a3028', 10);
    const y = FB + 34; qF(g, 0, y, W, 2, '#6a6e78'); qF(g, 0, y + 6, W, 2, '#6a6e78'); for (let x = 2; x < W; x += 9) qF(g, x, y - 1, 3, 10, '#5e3a20');   // 레일
  },
  house(g, K) {
    const { FB } = K;
    qF(g, 72, K.top + 16, 50, 34, '#6e4626'); qF(g, 74, K.top + 18, 46, 30, '#d8c49a');   // 던전 지도 판 (길 · 핀)
    const pts = [[78, 44], [86, 34], [96, 40], [104, 28], [112, 36], [116, 24]].map(([x, y]) => [x, K.top + y]);
    for (let i = 0; i < pts.length - 1; i++) qL(g, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], '#8a6a4a');
    pts.forEach(([x, y], i) => { qF(g, x - 1, y - 1, 3, 3, '#2a1a10'); qP(g, x, y, ['#e0503f', '#4a7af0', '#5ac84a', '#f0c24a', '#c03ad8', '#e0503f'][i]); });
    q4Shelf(g, 8, K.top + 40, 56, '#5e3a20');   // 트로피 선반 (수정 핵 · 뿔 · 비늘)
    qQ(g, [[14, K.top + 40], [18, K.top + 30], [22, K.top + 40]], '#5ad8e0'); qP(g, 17, K.top + 34, '#d8f8ff');
    qQ(g, [[30, K.top + 40], [34, K.top + 28], [36, K.top + 30], [34, K.top + 40]], '#e8dcc0'); qQ(g, [[44, K.top + 40], [50, K.top + 33], [56, K.top + 40]], '#4a8a5a'); qP(g, 50, K.top + 36, '#8ad8a0');
    for (const [x, c] of [[132, '#e8e0c8'], [146, '#8ad8ff']]) { qF(g, x, FB - 16, 13, 16, '#5e3a20'); qF(g, x + 1, FB - 15, 11, 4, c); qF(g, x + 1, FB - 15, 11, 1, shade(c, 0.3)); }   // 분류 칸
    for (const [x, y] of [[10, FB + 2], [20, FB + 4], [14, FB - 6]]) qB(g, aSack('#a8946a'), x, y);
  },
  live(g, K, t, T) {
    const { FB } = K, ph = phaseOf(S.t), n = Math.min(3, salvPicks().length), home = n > 0 && (ph === 0 || ph === 3);
    qF(g, 60, FB + 4, 44, 4, '#9a7a52'); qF(g, 60, FB + 4, 44, 1, '#c09a6a'); qF(g, 62, FB + 8, 3, 12, '#5e3a20'); qF(g, 99, FB + 8, 3, 12, '#5e3a20');   // 분류대 + 장부 담당
    for (const [x, c] of [[66, '#e8e0c8'], [74, '#5fbf5a'], [82, '#8ad8ff'], [90, '#f0c24a']]) { qF(g, x, FB + 1, 5, 3, c); qP(g, x, FB + 1, shade(c, 0.4)); }
    qPeo('salv2', g, false, 'idle', Math.floor(t * 1.2) % 2, 82, FB + 2);
    const k = home ? (t * 0.08) % 2 : 0, cx = 20 + (k < 1 ? k : 2 - k) * 110, y = FB + 34;   // 광차 (수거꾼이 있으면 레일을 오간다)
    qF(g, cx - 14, y - 16, 28, 12, '#6a5040'); qF(g, cx - 14, y - 16, 28, 2, '#8a6a52'); qF(g, cx - 15, y - 17, 30, 2, '#5a5a62');
    qEll(g, cx - 6, y - 18, 5, 3, '#a8946a'); qQ(g, [[cx + 2, y - 17], [cx + 5, y - 25], [cx + 8, y - 17]], '#5ad8e0'); qEll(g, cx + 9, y - 18, 4, 3, '#b49e72');
    for (const dx of [-8, 8]) { qDisc(g, cx + dx, y - 2, 3, '#3a3a42'); qP(g, cx + dx, y - 2, '#9aa0aa'); }
    if (home) {
      qPeo('salv1', g, true, 'walk', Math.floor(t * 6) % 4, cx - 24 + (k < 1 ? 0 : 48), y - 2, k >= 1);
      if (n > 1) qPeo('salv3', g, false, 'idle', Math.floor(t * 1.1) % 2, 30, FB + 12);
      if (n > 2) qPeo('salv1', g, true, 'idle', Math.floor(t * 1.3) % 2, 140, FB + 14, true);
    }
    for (const x of [40, 112]) { qF(g, x, K.top + 24, 3, 8, '#5e3a20'); drawFire(g, x + 1, K.top + 24, t, false); }
    q3Light(g, K, T, { amb: 0.44, ambN: 0.06, lamps: [[41, K.top + 16, 40, '#f88a3c'], [113, K.top + 16, 40, '#f88a3c'], [146, FB - 12, 22, '#8ad8ff']], wins: [] }, t);
  }
};

/* ───────── 장면 고르기 · 그리기 ───────── */
const HQS = { shop: A3_SHOP, tavern: A3_TAVERN, inn: A3_INN, stable: A3_STABLE, smithy: A3_SMITHY, airfield: A3_AIR, alchemy: A3_ALCH, kitchen: A3_KITCHEN, training: A3_TRAIN, temple: A3_TEMPLE, pen: A3_PEN, library: A3_LIB, tower: A3_TOWER, salvage: A3_SALV };
// 장소 하나를 그 장소 판에 그린다: 벽 · 가구 · 창(바깥 시간)은 시간 칸마다 한 번 구워 두고, 사람 · 물건 · 불빛은 매번. rec면 누르는 자리를 남긴다
function hqRender(f, t, rec) {
  const sc = HQS[f.id], K = sc.geo(hqGeo(sc.zoom || 1)), dp = clockDp(), T = todAt(dp, 'town');
  let v = HQ.views[f.key]; if (!v || v[0].width !== K.W || v[0].height !== K.H) { v = mkCanvas(K.W, K.H); HQ.views[f.key] = v; }
  const g = v[1], key = f.key + '|' + K.W + 'x' + K.H + '|' + Math.floor(dp * 64) + '|' + (sc.sig ? sc.sig(K) : '');
  let base = HQ.shells.get(key);
  if (!base) {
    const [cv, bg] = mkCanvas(K.W, K.H); sc.bg(bg, K, T); sc.house(bg, K, T); base = cv;
    HQ.shells.set(key, cv); if (HQ.shells.size > 24) HQ.shells.delete(HQ.shells.keys().next().value);
  }
  g.clearRect(0, 0, K.W, K.H); g.drawImage(base, 0, 0);
  K.hits = rec ? [{ x: 0, y: 0, w: K.W, h: K.H, win: FLOOR_INFO[f.id].win }] : null;   // 빈 곳을 누르면 그 장소의 창
  sc.live(g, K, t, T, f);
  if (rec) { HQ.hits = K.hits; HQ.hitK = K; }
  return v[0];
}
function drawHQ(now, vt) {
  if (!HQ.cvs || !S) return;
  const t = vt != null ? vt : now / 1000, f = hqPlace(HQ.cur);
  if (f.key !== HQ.cur) HQ.cur = f.key;
  const c = HQ.ctx, W = HQ.cvs.width, H = HQ.cvs.height, A = HQ.anim;
  c.imageSmoothingEnabled = false;
  if (A) {   // 옆으로 밀며 바뀐다: 새 장소가 그쪽에서 들어온다
    if (A.t0 == null) A.t0 = now;
    const k = Math.min(1, Math.max(0, (now - A.t0) / A.d)), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2, from = hqPlace(A.from);
    const a = from.key !== f.key ? hqRender(from, t, false) : null, b = hqRender(f, t, true), ox = Math.round(-A.dir * e * W);
    c.clearRect(0, 0, W, H);
    if (a) c.drawImage(a, 0, 0, a.width, a.height, ox, 0, W, H);
    c.drawImage(b, 0, 0, b.width, b.height, ox + A.dir * W, 0, W, H);
    if (k >= 1) HQ.anim = null;
  } else { const v = hqRender(f, t, true); c.drawImage(v, 0, 0, v.width, v.height, 0, 0, W, H); }
}
// 화면을 누른 곳 → 그 자리의 것 (넘어가는 중에는 없음)
function hqHit(cx, cy) {
  const K = HQ.hitK;
  if (!K || HQ.anim) return null;
  const r = HQ.cvs.getBoundingClientRect(), x = (cx - r.left) / r.width * K.W, y = (cy - r.top) / r.height * K.H;
  for (let i = HQ.hits.length - 1; i >= 0; i--) { const h = HQ.hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h; }
  return null;
}

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
  // 메뉴 바로 아래부터 볼거리 (창 · 문장 · 선반 꼭대기)
  const k = HQ.W / r.width, menu = document.getElementById('menu').getBoundingClientRect();
  HQ.top = Math.max(40, Math.min(HQ.H - 200, Math.round((menu.bottom - r.top) * k)));
  HQ.shells.clear(); HQ.views = {};
  HQ.ctx.imageSmoothingEnabled = false;
}

/* ───────── 장소 판의 금빛 화살표 (▶ · 빗면 · 붉은 보석 · 뒤에 말린 장식 18×20) ───────── */
const Q_ARROW = (() => {
  const [c, g] = mkCanvas(18, 20);
  for (let y = 1; y < 19; y++) { const d = Math.abs(y - 9.5), xr = 16 - Math.round(d * 1.25); for (let x = 5; x <= xr; x++) qP(g, x, y, y < 8 ? '#ffe08a' : y < 12 ? '#f0bc48' : '#c8862a'); qP(g, xr, y, y < 10 ? '#fff4c8' : '#a86a1a'); }
  for (let y = 2; y < 18; y++) qP(g, 5, y, '#fff0b8');
  for (const [x, y] of [[3, 3], [2, 4], [2, 5], [3, 6], [3, 13], [2, 14], [2, 15], [3, 16], [4, 8], [4, 11]]) qP(g, x, y, '#e8b040');
  qOut(c, '#2a1806', 1);
  qDisc(g, 9, 9, 2, '#7a1414'); qF(g, 8, 8, 3, 3, '#d83838'); qP(g, 8, 8, '#ffc8c8'); qP(g, 10, 10, '#8a1e1e');
  return c.toDataURL();
})();

STORY.v62 = [
  '상단 본부를 새로 꾸몄다.',
  '이제 본부는 장소마다 한 장면이다. 화면을 옆으로 밀거나 아래 장소 판의 금빛 화살표를 누르면 옆 장소로 넘어간다. 왼쪽은 지하(대장간 · 던전 수거소), 오른쪽은 위층 시설과 비행장이다. 장소 판 가운데를 누르면 그 시설 창이 열린다.',
  '상점은 진열대가 칸 수에 따라 1~4단으로 자라고, 손님이 들어와 물건을 집어 계산대에서 값을 치르고 나간다.',
  '새 장소 선술집: 고용할 수 있는 모험가가 여기로 찾아오고, 쉬는 모험가도 탁자에 앉아 쉰다. 모험가는 여관 2층 침대에서 잔다.',
  '마구간에는 말과 맨 펫이, 비행장에는 비행 마차와 날개 달린 짐승이 보인다. 창밖은 바깥 시간을 따르고, 실내는 렌턴 불빛으로 은은하다.'
];
