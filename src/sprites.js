/* ───────── 도트 그리기 도구 ───────── */
let FLASH = null;                         // 피격 시 전체를 한 색으로
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

/* ───────── 모험가 ───────── */
function drawAdv(ctx, a, t, o = {}) {
  const C = CLASSES[a.cls] || CLASSES.warrior;
  const look = a.look || { hair: HAIRS[0], skin: SKINS[0] };
  const tu = C.tunic, tr = C.trim, sk = look.skin, hr = look.hair;
  const fr = o.walk ? Math.floor(t * 7 + (o.ph || 0)) % 2 : 0;
  const by = o.walk && fr ? -1 : 0;
  ctx.save();
  ctx.translate(0, by);
  // 등 뒤
  if (a.hero) R(ctx, -5, -10, 2, 8, '#c0392b');
  if (a.cls === 'archer') { R(ctx, -6, -11, 2, 5, '#8a5a32'); R(ctx, -6, -12, 1, 1, '#e8e2d0'); R(ctx, -5, -13, 1, 1, '#e8e2d0'); }
  if (a.cls === 'porter') { R(ctx, -9, -14, 5, 9, '#7a5634'); R(ctx, -8, -13, 3, 1, '#9a7a4f'); R(ctx, -9, -16, 5, 2, '#a8432f'); R(ctx, -9, -10, 5, 1, '#5e4630'); }
  // 다리
  const robe = a.cls === 'mage' || a.cls === 'cleric';
  if (!robe) {
    const pants = shade(tu, -0.45);
    if (fr) { R(ctx, -2, -4, 2, 3, pants); R(ctx, 1, -5, 2, 3, pants); R(ctx, -2, -1, 2, 1, '#2a1d14'); R(ctx, 1, -2, 2, 1, '#2a1d14'); }
    else    { R(ctx, -3, -4, 2, 3, pants); R(ctx, 1, -4, 2, 3, pants); R(ctx, -3, -1, 2, 1, '#2a1d14'); R(ctx, 1, -1, 2, 1, '#2a1d14'); }
  }
  // 몸통
  if (robe) { R(ctx, -3, -9, 6, 9, tu); R(ctx, -3, -1, 6, 1, shade(tu, -0.35)); if (fr) R(ctx, 2, -2, 1, 1, shade(tu, -0.35)); }
  else { R(ctx, -3, -9, 6, 5, tu); R(ctx, -3, -5, 6, 1, shade(tu, -0.4)); }
  if (a.cls === 'cleric') { R(ctx, 0, -9, 1, 5, tr); R(ctx, -3, -4, 6, 1, tr); }
  if (a.cls === 'mage') R(ctx, -3, -5, 6, 1, tr);
  R(ctx, -4, -9, 1, 4, shade(tu, -0.2));
  // 머리
  R(ctx, -3, -14, 6, 5, sk);
  R(ctx, 1, -12, 1, 1, '#1a1410');
  R(ctx, -3, -15, 6, 1, hr); R(ctx, -3, -14, 2, 1, hr); R(ctx, -3, -13, 1, 2, hr);
  // 머리 장비
  if (a.cls === 'warrior') { R(ctx, -3, -16, 6, 2, '#9aa0a8'); R(ctx, -3, -14, 1, 2, '#9aa0a8'); R(ctx, -1, -17, 2, 1, '#c0392b'); }
  if (a.cls === 'archer') { R(ctx, -3, -16, 6, 2, shade(tu, 0.1)); R(ctx, -3, -14, 1, 3, shade(tu, 0.1)); }
  if (a.cls === 'cleric') { R(ctx, -3, -16, 6, 2, tu); R(ctx, -3, -14, 1, 3, tu); R(ctx, -1, -16, 2, 1, tr); }
  if (a.cls === 'rogue') { R(ctx, -3, -16, 6, 2, '#2a2a34'); R(ctx, -3, -14, 1, 3, '#2a2a34'); R(ctx, -1, -11, 4, 1, '#6a2a2a'); }
  if (a.cls === 'porter') R(ctx, -3, -14, 6, 1, '#c9a04a');
  if (a.cls === 'mage') { const hd = shade(tu, -0.25); R(ctx, -4, -15, 9, 1, hd); R(ctx, -2, -16, 5, 1, tu); R(ctx, -1, -17, 3, 1, tu); R(ctx, 0, -18, 2, 1, tu); R(ctx, 1, -19, 1, 1, tu); }
  // 앞쪽 팔과 무기
  const atk = o.atk ? 1 : 0;
  R(ctx, 3, -9, 1, 3, shade(tu, -0.1)); R(ctx, 3, -6, 1, 1, sk);
  if (a.cls === 'warrior') { R(ctx, 3 + atk, -10, 3, 6, '#6b7078'); R(ctx, 4 + atk, -9, 1, 4, '#c9c3b8'); R(ctx, 6 + atk * 2, -15, 1, 7, '#dfe4ea'); R(ctx, 5 + atk * 2, -8, 3, 1, '#8a5a32'); }
  if (a.cls === 'archer') { const b = '#8a5a32'; R(ctx, 4, -14, 1, 1, b); R(ctx, 5, -13, 1, 6, b); R(ctx, 4, -7, 1, 1, b); R(ctx, 4 - atk, -13, 1, 6, '#e8e2d0'); }
  if (a.cls === 'mage') { R(ctx, 5, -16, 1, 15, '#7a5634'); R(ctx, 4, -18, 3, 2, atk ? '#ffffff' : tr); }
  if (a.cls === 'cleric') { R(ctx, 5, -11 - atk, 1, 6, '#8a5a32'); R(ctx, 4, -13 - atk, 3, 2, tr); }
  if (a.cls === 'rogue') { R(ctx, 4 + atk * 2, -7, 3, 1, '#dfe4ea'); R(ctx, 3 + atk * 2, -7, 1, 1, '#8a5a32'); }
  if (a.cls === 'porter') { R(ctx, 4 + atk, -9, 1, 5, '#8a5a32'); }
  ctx.restore();
}

/* ───────── 몬스터 ───────── */
function drawMon(ctx, id, t, o = {}) {
  const m = MONS[id];
  const fr = Math.floor(t * 6 + (o.ph || 0)) % 2;
  const sc = Math.max(1, Math.round(m.scale || 1));
  ctx.save();
  if (sc > 1) ctx.scale(sc, sc);
  const P = PLANS[m.plan];
  P(ctx, m, fr, t, o);
  ctx.restore();
}
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
  bag:     ['...kkkk...', '..k....k..', '.kkkkkkkk.', 'k########k', 'k#l######k', 'k##kkkk##k', 'k##k##k##k', 'k########k', '.kddddddk.', '..kkkkkk..']
};
function drawIcon(ctx, id, ox = 0, oy = 0) {
  const it = typeof id === 'object' ? id : ITEMS[id]; if (!it) return;
  const pat = ICON_PX[it.icon] || ICON_PX.gem;
  const map = { '#': it.c, l: shade(it.c, 0.45), d: shade(it.c, -0.4), k: '#1a1410', r: '#c0392b', b: '#c9a04a', w: '#8a5a32', p: '#e8dcb8', s: '#e8e2d0' };
  pat.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const ch = row[x]; if (ch !== '.') R(ctx, ox + x, oy + y, 1, 1, map[ch]); } });
}
const ICON_URL = {};
const TIER_COLORS = ['#b0a898', '#7ab05a', '#b8c0c8', '#7ab8ff', '#c8ecff', '#f0c24a'];
function gearIconURL(g) {
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
  L: '100100100100111', M: '101111111101101', I: '111010010010111', S: '111100111001111', V: '101101101101010', U: '101101101101111', P: '111101111100100', ' ': '000000000000000', '!': '010010010000010'
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
