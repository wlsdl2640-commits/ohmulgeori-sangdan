/* ───────── 도트 그리기 도구 ───────── */
let FLASH = null;
const HI = 2;   // 전투 화면은 두 배 해상도                         // 피격 시 전체를 한 색으로
function R(ctx, x, y, w, h, c) { ctx.fillStyle = FLASH || c; ctx.fillRect(x, y, w, h); }
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => f(v).toString(16).padStart(2, '0')).join('');
}
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; }

const HAIRS = ['#2b1d16', '#5a3a22', '#8a5a2b', '#c9a04a', '#d8d0c0', '#7a2f22', '#30304a'];
const SKINS = ['#f1c9a5', '#e0ac7e', '#c68a5e', '#9a6644'];

/* ───────── 아이콘 (10×10) ───────── */
const ICON_PX = {
  tail:    ['..........', '.......kk.', '......k##k', '.....k#k..', '....k#k...', '...k#k....', '..k#k.....', '.k#k......', '.kk.......', '..........'],
  blob:    ['..........', '..........', '...kkkk...', '..k#ll#k..', '.k#l####k.', '.k######k.', '.k##k#k#k.', '.kdddddk..', '..kkkkk...', '..........'],
  horn:    ['......kk..', '.....kl#k.', '.....k##k.', '....k#l#k.', '....k###k.', '...k#l##k.', '...k####k.', '..kdddddk.', '..kkkkkkk.', '..........'],
  hide:    ['..........', '.kk....kk.', '.k#k..k#k.', '.k######k.', '..k#ll#k..', '..k####k..', '.k##dd##k.', '.k#k..k#k.', '.kk....kk.', '..........'],
  fang:    ['..........', '..kkkkkk..', '..k#l##k..', '..k####k..', '...k###k..', '...k##k...', '....k#k...', '....kdk...', '.....k....', '..........'],
  ear:     ['k.........', 'kk........', 'k#k.......', 'k##kkk....', '.k#l##kk..', '.k#l####k.', '..k#####k.', '...kd##k..', '....kkk...', '..........'],
  blade:   ['.......kk.', '......klk.', '.....kl#k.', '....kl#k..', '...kl#k...', '.kk###k...', '..kddk....', '.kdkkdk...', 'kdk..kk...', 'kk........'],
  crown:   ['..........', '.k..kk..k.', 'k#kk##kk#k', 'k#k####k#k', 'k########k', 'k#rr##rr#k', 'k########k', 'kddddddddk', '.kkkkkkkk.', '..........'],
  gem:     ['..........', '...kkkk...', '..kl#l#k..', '.kl##l##k.', 'k########k', '.k######k.', '..k####k..', '...kddk...', '....kk....', '..........'],
  ore:     ['..........', '...kkk....', '..k##lkk..', '.k#l####k.', 'k###dd###k', 'k#d##l##dk', 'k###d###k.', '.kddddddk.', '..kkkkkk..', '..........'],
  potion:  ['...kkkk...', '...kbbk...', '....kk....', '...k..k...', '..k.l..k..', '.k######k.', '.k#l####k.', '.k######k.', '..kddddk..', '...kkkk...'],
  feather: ['........kk', '.......k#k', '......k#lk', '.....k##k.', '....k#lk..', '...k##k...', '..k#lk....', '..kdk.....', '.kk.......', 'k.........'],
  heart:   ['..........', '.kk...kk..', 'k##k.k##k.', 'k#l#k###k.', 'k#l#####k.', '.k######k.', '..k####k..', '...k##k...', '....kk....', '..........'],
  book:    ['.kkkkkkk..', 'k#######k.', 'k#lll###kk', 'k#######kp', 'k##ll###kp', 'k#######kp', 'k#######kp', 'k#######kp', 'kkkkkkkkkp', '.pppppppp.'],
  egg:     ['..........', '...kkkk...', '..k#ll#k..', '.k#l####k.', '.k######k.', '.k##d###k.', '.k######k.', '..k#dd#k..', '...kkkk...', '..........'],
  wing:    ['..........', 'kk........', 'k#kk......', 'k##l#kk...', 'k#####l#k.', '.k####l##k', '..kd###dk.', '...kd#dk..', '....kdk...', '.....k....'],
  eye:     ['..........', '...kkkk...', '..k####k..', '.k#kkkk#k.', 'k#k#ll#k#k', 'k#k#ll#k#k', '.k#kkkk#k.', '..k####k..', '...kkkk...', '..........'],
  drop:    ['..........', '.....k....', '....k#k...', '....k#k...', '...k#l#k..', '...k###k..', '..k#l###k.', '..k#####k.', '...kdddk..', '....kkk...'],
  bone:    ['..........', 'kk......kk', 'k#k....k#k', '.k#kkkk#k.', '..k####k..', '.k#kkkk#k.', 'k#k....k#k', 'kk......kk', '..........', '..........'],
  branch:  ['........kk', '.......k#k', '......k#k.', '....kkk#k.', '...k#l#k..', '..k##k#k..', '.k#lk.k#k.', 'k#k....kk.', 'kk........', '..........'],
  root:    ['...kkkk...', '..k#ll#k..', '..k####k..', '...k##k...', '..k#l##k..', '..k####k..', '.k#kkk#k..', '.kk..k#k..', '.....kk...', '..........'],
  flower:  ['..........', '..kk..kk..', '.k#lk#l#k.', '.k######k.', '..k#rr#k..', '.k##rr##k.', '.k#l####k.', '..kk.kkk..', '....k.....', '...kk.....'],
  sword:   ['........kk', '.......klk', '......kl#k', '.....kl#k.', '....kl#k..', '.k.kl#k...', '..kk#k....', '..kwk.....', '.kwkkk....', 'kk........'],
  bow:     ['...kk.....', '..kwwk....', '..kwks....', '.kwk.s....', '.kwk.s....', '.kwk.s....', '.kwk.s....', '..kwks....', '..kwwk....', '...kk.....'],
  staff:   ['......kkk.', '.....kl#k.', '.....k##k.', '......kkk.', '.....kwk..', '....kwk...', '...kwk....', '..kwk.....', '.kwk......', '.kk.......'],
  mace:    ['.....kkk..', '....k#l#k.', '....k###k.', '.....kdk..', '....kwk...', '...kwk....', '..kwk.....', '.kwk......', 'kwk.......', 'kk........'],
  dagger:  ['..........', '.......kk.', '......klk.', '.....kl#k.', '....kl#k..', '...k##k...', '..kkdk....', '.kwkk.....', 'kwk.......', 'kk........'],
  club:    ['......kkk.', '.....k###k', '.....k#d#k', '....k###k.', '....kwkk..', '...kwk....', '..kwk.....', '.kwk......', 'kwk.......', 'kk........'],
  armor:   ['.kk....kk.', 'k##k..k##k', 'k###kk###k', '.k#l####k.', '.k#l####k.', '.k######k.', '.k##dd##k.', '.k######k.', '..kkkkkk..', '..........'],
  vest:    ['.kk....kk.', 'k##k..k##k', 'k##kkkk##k', '.k#d##d#k.', '.k######k.', '.k#d##d#k.', '.k######k.', '.kkkkkkkk.', '..........', '..........'],
  robe:    ['...kkkk...', '..k####k..', '.k#l##l#k.', '.k######k.', '..k#dd#k..', '..k####k..', '.k######k.', 'k########k', 'kkkkkkkkkk', '..........'],
  ring:    ['..........', '....kk....', '...klrk...', '....kk....', '..kk##kk..', '.k#k..k#k.', '.k#....#k.', '.k#k..k#k.', '..kk##kk..', '....kk....'],
  amulet:  ['.k......k.', '..k....k..', '...k..k...', '....kk....', '...k##k...', '..k#l##k..', '..k####k..', '...k##k...', '....kk....', '..........'],
  axe:     ['....kkkk..', '...k###lk.', '...k####k.', '....kkwk..', '.....kwk..', '....kwk...', '...kwk....', '..kwk.....', '.kwk......', '.kk.......'],
  lance:   ['........kk', '.......klk', '......k#k.', '.....kwk..', '....kwk...', '...kwk....', '..kwk.....', '.kwk......', 'kwk.......', 'kk........'],
  leaf:    ['......kk..', '....kk##k.', '...k#l##k.', '..k#l###k.', '.k#l###k..', '.k#l##k...', '.k###k....', '..kkd.....', '...kd.....', '....k.....'],
  bag:     ['...kkkk...', '..k....k..', '.kkkkkkkk.', 'k########k', 'k#l######k', 'k##kkkk##k', 'k##k##k##k', 'k########k', '.kddddddk.', '..kkkkkk..'],
  lute:    ['........kk', '.......kwk', '......kwk.', '..kkkkwk..', '.k#l##kk..', 'k#l#kk#k..', 'k##kdk#k..', 'k###kk#k..', '.kd###k...', '..kkkk....'],
  rune:    ['..kkkkkk..', '.kgGGGGgk.', '.kG#GG#Gk.', '.kGG##GGk.', '.kG#ll#Gk.', '.kGG##GGk.', '.kG#GG#Gk.', '.kGGGGGGk.', '.kggggggk.', '..kkkkkk..'],
  crest:   ['.kkkkkkkk.', '.kbbbbbbk.', '.kb#l##bk.', '.kb#ll#bk.', '.kb####bk.', '..kb##bk..', '..kb#dbk..', '...kbbk...', '....kk....', '..........'],
  core:    ['...kkkk...', '..kbbbbk..', '.kb#ll#bk.', 'kb#lll##bk', 'kb######bk', 'kb##dd##bk', '.kb####bk.', '..kbbbbk..', '...kkkk...', '..........'],
  soul:    ['....k.....', '...k#k....', '...k#lk...', '..k#ll#k..', '..k#ll#k..', '.k##l###k.', '.k#l##l#k.', '.k##ll##k.', '..kdddk...', '...kkk....']
};
// 부장비 그림을 10×10으로 (진열대·손님 손): 2×2칸마다 많은 색(테두리보다 안쪽 색), 칠한 칸 둘레에 다시 테두리
const OFF_MINI = {};
// 빌드 64: 전사 계열 고유 장비 그림 (data-wicon.js · 20×20, 단계마다 하나) → 칸 색 400개 (빈칸 null)
const WIC_CELLS = {};
function wicCells(base, i) {
  const k = base + ':' + i; if (WIC_CELLS[k] !== undefined) return WIC_CELLS[k];
  const code = typeof WICON !== 'undefined' && WICON[base] && WICON[base][i]; if (!code) return (WIC_CELLS[k] = null);
  const bar = code.indexOf('|'), pal = code.slice(0, bar), cells = code.slice(bar + 1), P = [], out = new Array(400).fill(null);
  for (let j = 0; j < pal.length; j += 6) P.push('#' + pal.slice(j, j + 6));
  for (let j = 0; j < 400; j++) { const ch = cells[j]; if (ch && ch !== '.') out[j] = P[WICON_ALPH.indexOf(ch)] || null; }
  return (WIC_CELLS[k] = out);
}
function wicURL(g) {
  if (!isUniq(g)) return null;
  const i = uniqIdx(g), k = 'w:' + g.base + ':' + i; if (ICON_URL[k]) return ICON_URL[k];
  const cells = wicCells(g.base, i); if (!cells) return null;
  const [c, x] = mkCanvas(20, 20);
  cells.forEach((col, j) => { if (col) { x.fillStyle = col; x.fillRect(j % 20, (j / 20) | 0, 1, 1); } });
  return (ICON_URL[k] = keepCv(c));
}
function offMini(base, t) {
  const uq = isUniq({ base, t }), ui = uq ? uniqIdx({ base, t }) : 0;
  const k = uq ? 'w:' + base + ':' + ui : base + ':' + offLook(t); if (OFF_MINI[k] !== undefined) return OFF_MINI[k];
  const cells = uq ? wicCells(base, ui) : typeof OFFICON !== 'undefined' && OFFICON[base] ? skiCells('o:' + k) : null;
  if (!cells) return (OFF_MINI[k] = null);
  const W = uq ? 20 : 16, X0 = uq ? 0 : 1;   // 20×20 그림은 2×2칸 그대로 10×10, 16×20 그림은 가운데 8칸
  const lum = h => { const n = parseInt(h.slice(1), 16); return 0.3 * (n >> 16) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255); };
  const g = Array.from({ length: 10 }, () => new Array(10).fill(null));
  for (let y = 0; y < 10; y++) for (let x = 0; x < W / 2; x++) {
    const cs = [0, 1, W, W + 1].map(o => cells[2 * y * W + 2 * x + o]).filter(c => c && c !== '#ff00ff');
    if (cs.length < 2) continue;
    const inner = cs.filter(c => lum(c) > 45), pool = inner.length ? inner : cs, cnt = {};
    pool.forEach(c => { cnt[c] = (cnt[c] || 0) + 1; });
    g[y][x + X0] = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || lum(b) - lum(a))[0];
  }
  const out = g.map(r => r.slice());
  for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (!g[y][x] && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const v = g[y + dy] && g[y + dy][x + dx]; return v && v !== '#1a1414'; })) out[y][x] = '#1a1414';
  return (OFF_MINI[k] = out);
}
// 진열대에 놓인 장비 키('g:종류:단계')의 아이콘
const gearKeyIcon = key => { const [, b, t] = key.split(':'); return { icon: GTYPES[b].icon, c: TIER_COLORS[+t], off: (typeof OFFICON !== 'undefined' && OFFICON[b]) || isUniq({ base: b, t: +t }) ? b : null, t: +t }; };
function drawIcon(ctx, id, ox = 0, oy = 0) {
  if (id && typeof id === 'object' && id.off) { const m = offMini(id.off, id.t); if (m) { m.forEach((r, y) => r.forEach((c, x) => { if (c) R(ctx, ox + x, oy + y, 1, 1, c); })); return; } }
  const it = typeof id === 'object' ? id : ITEMS[id]; if (!it) return;
  const pat = ICON_PX[it.icon] || ICON_PX.gem;
  const map = { '#': it.c, l: shade(it.c, 0.45), d: shade(it.c, -0.4), k: '#1a1410', r: '#c0392b', b: '#c9a04a', w: '#8a5a32', p: '#e8dcb8', s: '#e8e2d0', g: '#4a4652', G: '#6e6a78' };
  pat.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const ch = row[x]; if (ch !== '.') R(ctx, ox + x, oy + y, 1, 1, map[ch]); } });
}
const ICON_URL = {};
const TIER_COLORS = ['#b0a898', '#7ab05a', '#b8c0c8', '#7ab8ff', '#c8ecff', '#f0c24a', '#7ab86a', '#e07a4a', '#c060e0'];
const QCOL = ['#b0a898', '#7bd36a', '#6ab0ff', '#c07af0', '#f0b43c', '#ff6a5a', '#fff4b0'];
// 부장비 그림 (data-officon.js가 있으면): 단계 묶음마다 모습 하나 — 견습·숲지기 / 강철·폭풍 / 서리·사막왕 / 그 위. 16×20칸을 1칸 = 1픽셀로 20×20에 (#ff00ff = 빈칸)
const offLook = t => (t <= 1 ? 0 : t <= 3 ? 1 : t <= 5 ? 2 : 3);
function offIconURL(base, t) {
  if (typeof OFFICON === 'undefined' || !OFFICON[base]) return null;
  const k = 'o:' + base + ':' + offLook(t); if (ICON_URL[k]) return ICON_URL[k];
  const cells = skiCells(k); if (!cells) return null;
  const [c, x] = mkCanvas(20, 20);
  cells.forEach((col, i) => { if (col !== '#ff00ff') { x.fillStyle = col; x.fillRect(2 + (i % 16), Math.floor(i / 16), 1, 1); } });
  return (ICON_URL[k] = keepCv(c));
}
function gearIconURL(g) {
  const w = wicURL(g); if (w) return w;   // 빌드 64: 고유 이름 장비는 단계마다 그림
  const off = offIconURL(g.base, g.t); if (off) return off;
  const key = 'g:' + g.base + ':' + g.t;
  if (ICON_URL[key]) return ICON_URL[key];
  const [c, x] = mkCanvas(10, 10);
  drawIcon(x, { icon: GTYPES[g.base].icon, c: TIER_COLORS[g.t] });
  return (ICON_URL[key] = keepCv(c));
}
const URL_CV = new Map();   // 빌드 63: 그림 data URL → 캔버스 (레어도 칸이 그림 도트를 다시 그린다, rarity.js)
const keepCv = (c) => { const u = c.toDataURL(); URL_CV.set(u, c); return u; };
// 빌드 63: 스킬북 · 룬은 20×20 새 그림(data-itemart.js)
function artCanvas(key) {
  const code = typeof ITEMART !== 'undefined' && ITEMART[key]; if (!code) return null;
  const bar = code.indexOf('|'), pal = code.slice(0, bar), cells = code.slice(bar + 1), P = [];
  for (let i = 0; i < pal.length; i += 6) P.push('#' + pal.slice(i, i + 6));
  const [c, x] = mkCanvas(20, 20);
  for (let i = 0; i < 400; i++) { const ch = cells[i]; if (ch === '.' || ch == null) continue; x.fillStyle = P[ITEMART_ALPH.indexOf(ch)]; x.fillRect(i % 20, (i / 20) | 0, 1, 1); }
  return c;
}
function itemArtKey(id) {
  const I = ITEMS[id]; if (!I) return null;
  if (I.btier != null) return BOOK_TIERS[I.btier] ? BOOK_TIERS[I.btier].id : null;
  if (I.book && SKILLS[I.book]) {
    const s = SKILLS[I.book], c0 = (s.cls || [])[0], fam = !c0 || c0 === 'all' || !CLASSES[c0] ? 'all' : jobBase(c0);
    return `jb_${['warrior', 'archer', 'mage', 'cleric', 'rogue', 'porter'].includes(fam) ? fam : 'all'}_${Math.max(0, Math.min(5, bookGrade(I.book)))}`;
  }
  if (I.rune) return `rn_${I.rune[0]}_${I.rune[1]}`;
  return null;
}
function iconURL(id) {
  if (ICON_URL[id]) return ICON_URL[id];
  const ak = typeof id === 'string' ? itemArtKey(id) : null, ac = ak ? artCanvas(ak) : null;
  if (ac) return (ICON_URL[id] = keepCv(ac));
  const [c, x] = mkCanvas(10, 10);
  drawIcon(x, id);
  return (ICON_URL[id] = keepCv(c));
}

/* ───────── 숫자 (3×5) ───────── */
const DIGITS = {
  '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111', '4': '101101111001001',
  '5': '111100111001111', '6': '111100111101111', '7': '111001010010010', '8': '111101111101111', '9': '111101111001111', '+': '000010111010000',
  O: '111101101101111', W: '101101101111101', N: '110101101101101', D: '110101101101110',
  L: '100100100100111', M: '101111111101101', I: '111010010010111', S: '111100111001111', V: '101101101101010', U: '101101101101111', P: '111101111100100', ' ': '000000000000000', '!': '010010010000010', D: '110101101101110', O: '111101101101111', W: '101101101111101', N: '110101101101101', '%': '101001010100101',
  E: '111100110100111', A: '010101111101101', R: '110101110101101', C: '111100100100111', T: '111010010010010', H: '101101111101101', K: '101101110101101', G: '111100101101111', B: '110101110101110', F: '111100110100100', X: '101101010101101', Y: '101101010010010', J: '001001001101111', Q: '111101101111001', Z: '111001010100111'
};
function drawNum(ctx, x, y, s, col) {
  s = String(s);
  const w = s.length * 4 - 1;
  let cx = Math.round(x - w / 2);
  for (const ch of s) {
    const g = DIGITS[ch];
    if (g) for (let i = 0; i < 15; i++) if (g[i] === '1') { const px = cx + (i % 3), py = y + Math.floor(i / 3); R(ctx, px + 1, py + 1, 1, 1, '#120d0a'); R(ctx, px, py, 1, 1, col); }
    cx += 4;
  }
}
