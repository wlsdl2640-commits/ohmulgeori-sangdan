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
function drawIcon(ctx, id, ox = 0, oy = 0) {
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
  return (ICON_URL[k] = c.toDataURL());
}
function gearIconURL(g) {
  const off = offIconURL(g.base, g.t); if (off) return off;
  const key = 'g:' + g.base + ':' + g.t;
  if (ICON_URL[key]) return ICON_URL[key];
  const [c, x] = mkCanvas(10, 10);
  drawIcon(x, { icon: GTYPES[g.base].icon, c: TIER_COLORS[g.t] });
  return (ICON_URL[key] = c.toDataURL());
}
function iconURL(id) {
  if (ICON_URL[id]) return ICON_URL[id];
  const [c, x] = mkCanvas(10, 10);
  drawIcon(x, id);
  return (ICON_URL[id] = c.toDataURL());
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
