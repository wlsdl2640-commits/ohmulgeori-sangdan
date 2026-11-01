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
const PLANS = {
  quad(ctx, m, fr) {
    const L = m.len, H = m.h, lg = m.low ? 1 : 2, b = m.body, d = m.dark;
    const x0 = -Math.floor(L / 2), top = -H - lg;
    R(ctx, x0, top, L, H, b); R(ctx, x0, top + H - 1, L, 1, d);
    const hs = Math.max(3, Math.round(H * 0.85)), hx = x0 + L - 1;
    R(ctx, hx, top - 1, hs, hs, b);
    if (m.snout) R(ctx, hx + hs, top + 1, 2, 2, b);
    R(ctx, hx + hs - 2, top, 1, 1, '#141414');
    if (m.ear) R(ctx, hx, top - 2, 1, 1, d);
    if (m.ears) { R(ctx, hx, top - 5, 1, 4, b); R(ctx, hx + 2, top - 4, 1, 3, b); }
    if (m.horn) { R(ctx, hx + hs - 1, top - 2, 1, 1, m.horn); R(ctx, hx + hs, top - 3, 1, 1, m.horn); }
    if (m.tail) R(ctx, x0 - 3, top + 1, 3, 1, d);
    if (m.crown) { const c = '#f0c24a'; R(ctx, hx, top - 3, 4, 2, c); R(ctx, hx, top - 4, 1, 1, c); R(ctx, hx + 3, top - 4, 1, 1, c); R(ctx, hx + 1, top - 2, 1, 1, '#c0392b'); }
    const legs = [x0 + 1, x0 + 3, x0 + L - 4, x0 + L - 2];
    legs.forEach((lx, i) => R(ctx, lx, -lg, 1, lg - ((i + fr) % 2 ? 1 : 0), d));
  },
  blob(ctx, m, fr) {
    const w = m.w + (fr ? 1 : 0), h = m.h - (fr ? 1 : 0), x0 = -Math.floor(w / 2);
    R(ctx, x0 + 2, -h, w - 4, 1, m.body); R(ctx, x0 + 1, -h + 1, w - 2, 1, m.body); R(ctx, x0, -h + 2, w, h - 2, m.body);
    R(ctx, x0, -1, w, 1, m.dark); R(ctx, x0 + 2, -h + 2, 2, 1, '#d8ffd0');
    R(ctx, x0 + w - 3, -h + 3, 1, 2, '#123012'); R(ctx, x0 + w - 5, -h + 3, 1, 2, '#123012');
  },
  shroom(ctx, m, fr) {
    R(ctx, -2, -7, 5, 6, m.stem); R(ctx, -2 + fr, -1, 2, 1, m.dark); R(ctx, 1 - fr, -1, 2, 1, m.dark);
    R(ctx, -5, -11, 11, 4, m.body); R(ctx, -4, -12, 9, 1, m.body); R(ctx, -5, -8, 11, 1, m.dark);
    R(ctx, -3, -11, 1, 1, '#f3e6ff'); R(ctx, 1, -10, 2, 1, '#f3e6ff'); R(ctx, 3, -12, 1, 1, '#f3e6ff');
    R(ctx, 1, -5, 1, 1, '#141414'); R(ctx, -1, -5, 1, 1, '#141414');
  },
  bug(ctx, m, fr) {
    for (let i = 0; i < 4; i++) { const lx = -4 + i * 2; R(ctx, lx, -3, 1, 2, m.dark); R(ctx, lx + ((i + fr) % 2 ? -1 : 1), -1, 1, 1, m.dark); }
    R(ctx, -5, -7, 8, 4, m.body); R(ctx, -4, -8, 6, 1, m.body); R(ctx, 3, -6, 3, 3, m.dark);
    R(ctx, 5, -6, 1, 1, m.eye); R(ctx, 4, -5, 1, 1, m.eye); R(ctx, -3, -7, 2, 1, shade(m.body, 0.2));
  },
  tree(ctx, m, fr) {
    R(ctx, -2, -10, 5, 10, m.body); R(ctx, -4, -1, 2, 1, m.body); R(ctx, 3, -1, 2, 1, m.body);
    R(ctx, 3, -9 + fr, 3, 1, m.body); R(ctx, 5, -10 + fr, 1, 1, m.body);
    R(ctx, -5, -17, 11, 7, m.leaf); R(ctx, -4, -18, 9, 1, m.leaf); R(ctx, -6, -15, 1, 4, m.leaf); R(ctx, 6, -15, 1, 4, m.leaf);
    R(ctx, -3, -16, 3, 1, shade(m.leaf, 0.25)); R(ctx, 1, -11, 4, 1, shade(m.leaf, -0.3));
    R(ctx, 0, -8, 1, 1, '#f0e070'); R(ctx, 2, -8, 1, 1, '#f0e070'); R(ctx, 0, -5, 3, 1, shade(m.body, -0.4));
  },
  biped(ctx, m, fr) {
    const s = m.skin, c = m.cloth;
    if (fr) { R(ctx, -1, -3, 1, 3, c); R(ctx, 1, -4, 1, 3, c); } else { R(ctx, -2, -3, 1, 3, c); R(ctx, 1, -3, 1, 3, c); }
    R(ctx, -2, -7, 5, 4, c); R(ctx, -2, -11, 5, 4, s);
    R(ctx, -3, -11, 1, 1, s); R(ctx, 3, -12, 1, 2, s); R(ctx, 1, -10, 1, 1, '#f7e04a');
    R(ctx, 3, -7, 1, 2, s);
    if (m.gear === 'dagger') R(ctx, 4, -6, 2, 1, '#c9c3b8');
    if (m.gear === 'staff') { R(ctx, 4, -13, 1, 12, '#7a5634'); R(ctx, 3, -15, 3, 2, '#e8e2d0'); R(ctx, 4, -14, 1, 1, '#141414'); }
    if (m.gear === 'pick') { R(ctx, 4, -9, 1, 7, '#7a5634'); R(ctx, 2, -10, 5, 1, '#c9c3b8'); R(ctx, -2, -12, 5, 1, '#e8b84a'); }
    if (m.feather) { R(ctx, -1, -13, 1, 2, '#e05a4a'); R(ctx, 0, -14, 1, 2, '#f0c24a'); }
  },
  flyer(ctx, m, fr, t) {
    const y = -12 + Math.round(Math.sin(t * 5) * 2);
    R(ctx, -2, y, 5, 3, m.body); R(ctx, -2, y - 1, 1, 1, m.body); R(ctx, 2, y - 1, 1, 1, m.body); R(ctx, 2, y + 1, 1, 1, '#ff4a4a');
    if (fr) { R(ctx, -7, y - 2, 5, 2, m.dark); R(ctx, 3, y - 2, 5, 2, m.dark); }
    else { R(ctx, -7, y + 2, 5, 2, m.dark); R(ctx, 3, y + 2, 5, 2, m.dark); }
  },
  golem(ctx, m, fr) {
    R(ctx, -5, -5, 3, 5 - fr, m.dark); R(ctx, 2, -5, 3, 5 - (1 - fr), m.dark);
    R(ctx, -6, -14, 12, 9, m.body); R(ctx, -3, -18, 6, 4, m.body);
    R(ctx, 1, -16, 2, 1, m.core); R(ctx, -1, -11, 2, 2, m.core);
    R(ctx, -8, -13, 2, 8, m.dark); R(ctx, 6, -13 + fr, 2, 8, m.dark);
    R(ctx, -4, -12, 1, 3, m.dark); R(ctx, 3, -9, 2, 1, m.dark); R(ctx, -5, -14, 10, 1, shade(m.body, 0.18));
  }
};

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
  heart:   ['..........', '.kk...kk..', 'k##k.k##k.', 'k#l#k###k.', 'k#l#####k.', '.k######k.', '..k####k..', '...k##k...', '....kk....', '..........']
};
function drawIcon(ctx, id, ox = 0, oy = 0) {
  const it = ITEMS[id]; if (!it) return;
  const pat = ICON_PX[it.icon] || ICON_PX.gem;
  const map = { '#': it.c, l: shade(it.c, 0.45), d: shade(it.c, -0.4), k: '#1a1410', r: '#c0392b', b: '#c9a04a' };
  pat.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const ch = row[x]; if (ch !== '.') R(ctx, ox + x, oy + y, 1, 1, map[ch]); } });
}
const ICON_URL = {};
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
  L: '100100100100111', V: '101101101101010', U: '101101101101111', P: '111101111100100', ' ': '000000000000000', '!': '010010010000010'
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
