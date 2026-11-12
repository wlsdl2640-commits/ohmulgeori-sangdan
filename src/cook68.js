/* ───────── 빌드 65 넷째 묶음: 요리 화면 (큰 구리솥) · 레시피 찾기 · 도감 「요리」 · 하르겐 시장 · 레시피 팔기 ─────────
   시안 tools/saved/draft68/cook (사용자 11-12 18:55 「큰 구리솥에 재료를 선택해서 하나씩 넣으면 … 냄비 위에서 나타나서 냄비안으로 퐁당 · 빼기 누르면 다시 창고로」
   · 19:57 「힌트없이 대신 … 레시피 판매 · 1개당 10만」 · 20:34 「다 넣어」).
   상태 S.cook = { known: {요리 id: 찾은 날}, made: {요리 id: 만든 수}, pot: [재료 id …], sus: 수상한 죽 수 }.
   솥에 넣은 재료는 창고에서 빠지고, 빼면 돌아간다. 「요리하기」는 솥 안 재료와 그 수가 레시피와 딱 맞아야 그 요리 · 아니면 수상한 죽(재료는 쓴다). */
const cookState = () => { const C = S.cook || (S.cook = { known: {}, made: {}, pot: [], sus: 0 }); C.known = C.known || {}; C.made = C.made || {}; C.pot = C.pot || []; return C; };
const knows = id => !!(S && cookState().known[id]);
function learnRecipe(id, how) {
  const C = cookState(); if (!FOODS[id] || C.known[id]) return false;
  C.known[id] = today() + 1;
  log(`새 레시피: ${FOODS[id].name} (${how || '솥에서 찾음'}) — 도감 「요리」에 적었다.`, 'good');
  return true;
}
WIN_TITLE.cook = '요리';
// 솥에 넣을 수 있는 재료 = 어느 레시피에든 들어가는 것 (+ 무정란)
const COOK_MATS = [...new Set(FOOD_IDS.flatMap(id => Object.keys(FOODS[id].need)).concat(['egg_none']))].filter(k => ITEMS[k]);
const COOK_TABS = [['all', '전체'], ['meat', '고기'], ['veg', '채소'], ['sea', '해산물'], ['grain', '곡물·양념'], ['egg', '알'], ['herb', '약초'], ['etc', '부속품']];
const cookCat = k => { const I = ITEMS[k]; if (I.veg) return 'veg'; if (I.sea) return 'sea'; if (k === 'egg_none') return 'egg'; if (k === 'raw_meat' || k === 'frog_leg') return 'meat'; if (I.herb) return 'herb'; if (KITCHEN_BUY[k]) return 'grain'; return 'etc'; };
/* ── 장면 (시안 cook68.js를 게임 시계로) ── */
const CKV = { anims: [], cook: null, res: null, raf: 0, img: {} };
const CK_W = 196, CK_H = 128, CK_PC = { h: '#ffd8a8', l: '#f4a868', b: '#c8703a', s: '#a45428', d: '#7a3a1c', k: '#4a200e' };
const CK_POT = { rimY: 50, rx: 47, ry: 12, irx: 42, iry: 9, ly: 52, lrx: 40, lry: 8, cy: 62, bry: 42 };
const CK_DX = [-16, 12, -4, 20, -22, 4];
const CK_T = { pop: 0.08, hang: 0.12, fall: 0.3, rise: 0.3, fly: 0.46, cook: 1.5 };
function ckImg(k) {
  if (CKV.img[k]) return CKV.img[k];
  const ak = itemArtKey(k), ac = ak ? artCanvas(ak) : null;
  if (ac) return (CKV.img[k] = ac);
  const im = new Image(); im.src = iconURL(k); CKV.img[k] = im; return im;
}
function ckWall(g) {
  const W = CK_W;
  q3Logs(g, 0, 0, W, CK_H, '#8a5a34', 17);
  qF(g, 14, 24, W - 28, 80, '#5e564e');
  for (let y = 24, row = 0; y < 104; y += 6, row++) for (let x = 14 + (row % 2) * 4; x < W - 14; x += 8) { const blue = (x * 3 + y) % 5 === 0; qF(g, x, y, 7, 5, blue ? '#6a86a2' : '#cfc6b4'); qF(g, x, y, 7, 1, blue ? '#86a2bc' : '#e4dccc'); qF(g, x, y + 4, 7, 1, blue ? '#546e88' : '#b0a694'); }
  q3Beam(g, 1, W, '#4e3018');
  const cx = W >> 1;
  qQ(g, [[cx - 26, 6], [cx + 26, 6], [cx + 54, 26], [cx - 54, 26]], '#6e6660'); qF(g, cx - 54, 25, 108, 3, '#8a827c'); qF(g, cx - 54, 25, 108, 1, '#a49c96'); qF(g, cx - 20, 0, 40, 7, '#5e5854'); qF(g, cx - 20, 0, 3, 7, '#7a726c');
  for (let i = 0; i < 6; i++) qF(g, cx - 40 + i * 14, 14 + (i % 2) * 4, 9, 1, '#5a524c');
  for (const [x, k, s] of [[12, 'garlic', 1], [24, 'herb', 2], [W - 24, 'meat', 3], [W - 12, 'garlic', 4]]) q4Hang(g, x, 10, k, s);
  for (const sx of [4, W - 40]) {
    q4Shelf(g, sx, 62, 36, '#5e3a20');
    const r = rng(sx + 7); for (let x = sx + 3; x < sx + 34; x += 7) { const c = ['#c0392b', '#4f8a43', '#e8c060', '#7a5aa8'][Math.floor(r() * 4)]; qF(g, x, 54, 5, 8, '#c8a050'); qF(g, x, 53, 5, 1, '#e8dcb8'); qF(g, x + 1, 56, 3, 3, c); }
    q4Shelf(g, sx, 88, 36, '#5e3a20');
    for (let x = sx + 4; x < sx + 32; x += 10) { qEll(g, x + 3, 84, 4, 4, '#a87a4a'); qF(g, x, 79, 7, 2, '#7a5432'); qP(g, x + 1, 82, '#d8b080'); }
  }
}
function ckHearth(g, t) {
  const W = CK_W, H = CK_H, cx = W >> 1, top = 102;
  qF(g, 26, top, W - 52, H - top, '#6a625e');
  for (let y = top + 4, row = 0; y < H; y += 7, row++) for (let x = 26 + (row % 2) * 7; x < W - 26; x += 14) { qF(g, x, y, 13, 6, (x + y) % 3 ? '#77706a' : '#625a56'); qF(g, x, y, 13, 1, '#8a827c'); }
  qF(g, 22, top - 2, W - 44, 5, '#8a827c'); qF(g, 22, top - 2, W - 44, 1, '#a49c96'); qF(g, 22, top + 3, W - 44, 1, '#4a4440');
  qQ(g, [[cx - 24, H], [cx - 24, top + 12], [cx - 16, top + 6], [cx + 16, top + 6], [cx + 24, top + 12], [cx + 24, H]], '#1a1210');
  for (let i = 0; i < 7; i++) { const ph = (t * 2.2 + i * 0.37) % 1; qF(g, cx - 18 + i * 6, H - 4 - (i % 2), 5, 3, ph < 0.5 ? '#f8a040' : '#e07028'); }
  drawFire(g, cx - 8, H - 2, t, true); drawFire(g, cx + 8, H - 2, t + 0.4, true);
}
function ckPotBody(g, t) {
  const PC = CK_PC, cx = CK_W >> 1, { rimY, cy } = CK_POT, rx = 48, ry = CK_POT.bry, r = rng(5);
  for (let y = rimY; y <= cy + ry; y++) {
    const w = Math.floor(rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)));
    for (let x = cx - w; x <= cx + w; x++) {
      const u = (x - cx) / rx, ck = (x + y) & 1, bot = (y - (cy + ry - 10)) / 10;
      let c = u < -0.74 ? PC.l : u < -0.56 ? (ck || u < -0.6 ? PC.h : PC.l) : u < 0.22 ? PC.b : u < 0.3 ? (ck ? PC.s : PC.b) : u < 0.62 ? PC.s : u < 0.7 ? (ck ? PC.d : PC.s) : PC.d;
      if (bot > 0) c = bot > 0.6 ? PC.k : bot > 0.3 ? (ck ? PC.k : PC.d) : (ck && c !== PC.d ? PC.s : c);
      if (Math.abs(x - cx) >= w) c = PC.k;
      qP(g, x, y, c);
    }
  }
  for (let i = 0; i < 90; i++) { const x = cx - 40 + Math.floor(r() * 80), y = rimY + 14 + Math.floor(r() * 24); const u = (x - cx) / rx; if (u > -0.5 && u < 0.6) qP(g, x, y, r() < 0.5 ? PC.l : PC.s); }
  const by = 76; qF(g, cx - 47, by, 95, 4, PC.d); qF(g, cx - 47, by, 95, 1, PC.s); qF(g, cx - 47, by + 3, 95, 1, PC.k);
  for (let x = cx - 42; x <= cx + 42; x += 8) { qF(g, x, by + 1, 2, 2, PC.l); qP(g, x, by + 1, PC.h); }
  const fl = 0.5 + 0.5 * Math.sin(t * 9);
  for (let x = cx - 30; x <= cx + 30; x += 2) if ((x + Math.floor(t * 8)) % 6 < 3) qP(g, x, cy + ry - 1, fl > 0.5 ? '#f88a3c' : '#c8502a');
  for (const sx of [-1, 1]) {
    const hx0 = cx + sx * 49; qF(g, hx0 - 3, 62, 6, 6, PC.k); qF(g, hx0 - 2, 63, 4, 4, '#5a5a66');
    for (let a = 0; a < 24; a++) { const th = a / 24 * Math.PI * 2; qP(g, Math.round(hx0 + sx * 3 + Math.cos(th) * 4), Math.round(72 + Math.sin(th) * 5), a < 12 ? '#3a3a44' : '#8a8a98'); }
  }
}
function ckRimBack(g) { const PC = CK_PC, cx = CK_W >> 1, { rimY, rx, ry, irx, iry } = CK_POT; qEll(g, cx, rimY, rx, ry, PC.k); qEll(g, cx, rimY, rx - 1, ry - 1, PC.l); qEll(g, cx, rimY, irx, iry, PC.d); qEll(g, cx, rimY + 1, irx - 1, iry - 1, PC.k); }
function ckRimFront(g) {
  const PC = CK_PC, cx = CK_W >> 1, { rimY, rx, ry, irx, iry } = CK_POT;
  for (let x = cx - rx; x <= cx + rx; x++) {
    const u = (x - cx) / rx, yo = Math.round(rimY + ry * Math.sqrt(Math.max(0, 1 - u * u))), yi = Math.round(rimY + iry * Math.sqrt(Math.max(0, 1 - ((x - cx) / irx) ** 2)));
    const top = Math.abs(x - cx) <= irx ? yi + 1 : rimY;
    for (let y = top; y <= yo; y++) qP(g, x, y, y === yo ? PC.k : y === top ? PC.h : u < 0.45 ? PC.l : PC.b);
  }
}
function ckSoup(pot) {
  if (!pot.length) return '#6a8a8a';
  const cs = pot.map(k => (ITEMS[k] && ITEMS[k].c) || '#a87a4a'), avg = cs.reduce((a, h) => [a[0] + parseInt(h.slice(1, 3), 16), a[1] + parseInt(h.slice(3, 5), 16), a[2] + parseInt(h.slice(5, 7), 16)], [0, 0, 0]).map(v => v / cs.length);
  const m = Math.min(0.85, 0.25 + pot.length * 0.15), b = [0x6a, 0x8a, 0x8a];
  return '#' + b.map((v, i) => Math.round(v * (1 - m) + avg[i] * m).toString(16).padStart(2, '0')).join('');
}
function ckLiquid(g, t, pot, cooking, ripples) {
  const cx = CK_W >> 1, ly = CK_POT.ly, LR = CK_POT.lrx, LY = CK_POT.lry, R = qR(ckSoup(pot));
  qEll(g, cx, ly, LR, LY, R.b); qEll(g, cx, ly - 2, LR - 2, LY - 3, R.s); qEll(g, cx + 2, ly + 1, LR - 6, LY - 3, R.b); qEll(g, cx - 8, ly - 1, 18, 3, R.l);
  for (let i = 0; i < 16; i++) { const x = cx - 34 + ((i * 37 + Math.floor(t * 3)) % 68), y = ly - 6 + (i * 5) % 12; if (((x - cx) / LR) ** 2 + ((y - ly) / LY) ** 2 < 0.75) qF(g, x, y, 3, 1, R.h); }
  const nb = cooking ? 14 : 5;
  for (let i = 0; i < nb; i++) {
    const per = cooking ? 0.45 : 0.9, ph = ((t + i * 0.137) / per) % 1, k = Math.floor((t + i * 0.137) / per), rr = rng(i * 31 + k * 7)();
    const x = Math.round(cx - 34 + rr * 68), y = Math.round(ly - 5 + ((i * 3 + k) % 10));
    if (((x - cx) / LR) ** 2 + ((y - ly) / LY) ** 2 > 0.8) continue;
    if (ph < 0.7) { const r = ph < 0.35 ? 1 : 2; qDisc(g, x, y - r, r, R.h); qP(g, x - 1, y - r - 1, '#ffffff'); } else { qP(g, x - 2, y - 1, R.h); qP(g, x + 2, y - 1, R.h); qP(g, x, y - 3, R.h); }
  }
  pot.forEach((k, i) => { const x = Math.round(cx + CK_DX[i % CK_DX.length] * 0.9 + Math.sin(t * 1.4 + i) * 2), y = ly - 3 + (i % 3) * 3, C = qR((ITEMS[k] && ITEMS[k].c) || '#a87a4a'); qF(g, x - 3, y, 6, 3, C.b); qF(g, x - 3, y, 3, 1, C.l); qF(g, x + 1, y + 2, 2, 1, C.d); qF(g, x - 3, y + 3, 6, 1, R.s); });
  for (const rp of ripples) {
    const a = rp.a; if (a < 0 || a > 0.5) continue;
    const rx = 4 + a * 50, ry = 1.5 + a * 11;
    for (let k = 0; k < 48; k++) { const th = k / 48 * Math.PI * 2; if ((k + Math.floor(a * 20)) % (a > 0.3 ? 3 : 2)) continue; const x = Math.round(rp.x + Math.cos(th) * rx), y = Math.round(ly + Math.sin(th) * ry); if (((x - cx) / LR) ** 2 + ((y - ly) / LY) ** 2 <= 1) qP(g, x, y, R.h); }
  }
  if (cooking) for (let k = 0; k < 3; k++) { const th0 = t * 5 + k * 2.1; for (let s = 0; s < 10; s++) { const th = th0 + s * 0.1, rr = 9 + k * 10; qF(g, Math.round(cx + Math.cos(th) * rr), Math.round(ly + Math.sin(th) * rr * 0.2), 2, 1, R.h); } }
}
function ckLadle(g, t, cooking) {
  const cx = CK_W >> 1, a = cooking ? t * 7 : 0, bx = cx + 18 + Math.cos(a) * (cooking ? 14 : 0), by = 54 + Math.sin(a) * (cooking ? 3 : 0), tx = cx + 60 + (cooking ? Math.cos(a) * 3 : 0), ty = 18;
  const n = Math.max(Math.abs(tx - bx), Math.abs(ty - by));
  for (let i = 0; i <= n; i++) { const x = Math.round(bx + (tx - bx) * i / n), y = Math.round(by + (ty - by) * i / n); if (y > 51) continue; qF(g, x, y, 2, 2, '#a8743e'); qP(g, x, y, '#d0a060'); qP(g, x + 2, y + 1, '#6e4626'); }
}
function ckSteam(g, t, cooking) {
  const cx = CK_W >> 1, n = cooking ? 9 : 4;
  for (let i = 0; i < n; i++) {
    const per = cooking ? 1.1 : 1.8, ph = ((t + i * 0.41) / per) % 1, x = Math.round(cx - 26 + ((i * 23) % 52) + Math.sin((t + i) * 2) * 3), y = Math.round(46 - ph * 30), r = 2 + Math.round(ph * 3);
    if (ph > 0.85) continue;
    g.globalAlpha = 0.55 * (1 - ph); qDisc(g, x, y, r, '#f4f0f0'); g.globalAlpha = 1;
  }
}
const CK_T0 = { dark: [0, 0] };
function ckDraw(now) {
  const cv = document.getElementById('ck-cv'); if (!cv) return false;
  const g = cv.getContext('2d'), t = now, C = cookState(), cx = CK_W >> 1, ly = CK_POT.ly;
  CKV.anims = CKV.anims.filter(a => now - a.t0 < 1.4);
  const cooking = CKV.cook && now - CKV.cook.t0 < CK_T.cook;
  const plopping = CKV.anims.filter(a => a.type === 'plop' && now - a.t0 < CK_T.pop + CK_T.hang + CK_T.fall);
  const potShown = C.pot.filter((k, i) => !plopping.some(a => a.i === i));
  const ripples = CKV.anims.map(a => { const hit = a.type === 'plop' ? CK_T.pop + CK_T.hang + CK_T.fall : 0; return { a: now - a.t0 - hit, x: cx + a.dx }; });
  g.clearRect(0, 0, CK_W, CK_H); ckWall(g); ckHearth(g, t); ckRimBack(g); ckLiquid(g, t, potShown, cooking, ripples);
  const clipDraw = (k, x, y, clipY) => { const im = ckImg(k); if (!im || (im.complete === false)) return; g.save(); g.beginPath(); g.rect(0, 0, CK_W, clipY); g.clip(); g.drawImage(im, Math.round(x - 10), Math.round(y - 10), 20, 20); g.restore(); };
  for (const a of plopping) {
    const x = cx + a.dx, y0 = 14, e = now - a.t0; let y = y0;
    if (e < CK_T.pop) { g.globalAlpha = 0.4 + e / CK_T.pop * 0.6; clipDraw(a.k, x, y0, CK_H); g.globalAlpha = 1; for (let k = 0; k < 6; k++) { const th = k / 6 * Math.PI * 2, rr = 8 + e / CK_T.pop * 8; qF(g, Math.round(x + Math.cos(th) * rr), Math.round(y0 + Math.sin(th) * rr), 2, 2, '#fff8d8'); } continue; }
    const b = e - CK_T.pop;
    if (b < CK_T.hang) y = y0 - Math.round(Math.sin(b / CK_T.hang * Math.PI) * 3); else { const f = (b - CK_T.hang) / CK_T.fall; y = y0 + (ly + 8 - y0) * f * f; }
    clipDraw(a.k, x, y, ly + 1 + (Math.abs(a.dx) % 3));
  }
  for (const a of CKV.anims) if (a.type === 'rem' && now - a.t0 < CK_T.rise) { const f = (now - a.t0) / CK_T.rise, x = cx + a.dx, y = ly + 10 - (ly + 10 - 22) * (1 - (1 - f) * (1 - f)); clipDraw(a.k, x, y, ly + 1); }
  ckLadle(g, t, cooking); ckPotBody(g, t); ckRimFront(g); ckSteam(g, t, cooking);
  q3Light(g, { W: CK_W, H: CK_H }, CK_T0, { amb: 0.34, ambN: 0, lamps: [[cx, 118, 96, '#f88a3c'], [26, 30, 44], [CK_W - 26, 30, 44]], wins: [] }, t);
  for (const a of CKV.anims) {   // 튀는 물방울 (빛 위에)
    const d = now - a.t0 - (a.type === 'plop' ? CK_T.pop + CK_T.hang + CK_T.fall : 0); if (d < 0 || d > 0.5) continue; const R = rng(Math.round(a.t0 * 1000) % 9973);
    for (let k = 0; k < 9; k++) { const vx = (R() - 0.5) * 70, vy = -40 - R() * 50, x = cx + a.dx + vx * d, y = ly - 2 + vy * d + 160 * d * d; if (y > ly + 3) continue; qF(g, Math.round(x), Math.round(y), 2, 2, k % 3 ? qR(ckSoup(C.pot)).l : '#ffffff'); }
  }
  if (CKV.cook && now - CKV.cook.t0 < CK_T.cook && now - CKV.cook.t0 > CK_T.cook - 0.22) { g.globalAlpha = Math.min(1, (now - CKV.cook.t0 - (CK_T.cook - 0.22)) / 0.22) * 0.85; qF(g, 0, 0, CK_W, CK_H, '#fff4d8'); g.globalAlpha = 1; }
  // 글씨 · 날아가는 그림 (화면 위)
  const fx = document.getElementById('ck-fx'), cr = cv.getBoundingClientRect(), sc = cr.width / CK_W;
  if (fx) {
    let html = '';
    for (const a of CKV.anims) { const e = now - a.t0 - (a.type === 'plop' ? CK_T.pop + CK_T.hang + CK_T.fall : 0); if (e >= 0 && e < 0.62) html += `<div class="ckpop" style="left:${(cx + a.dx) * sc}px;top:${((a.type === 'plop' ? 34 : 30) - e * 22) * sc}px;opacity:${e > 0.4 ? 1 - (e - 0.4) / 0.22 : 1}">${a.type === 'plop' ? '퐁당!' : '쏙!'}</div>`; }
    if (cooking) html += `<div class="ckpop" style="left:${cx * sc}px;top:${(26 - ((now - CKV.cook.t0) % 0.5) * 6) * sc}px;font-size:15px">보글보글…</div>`;
    if (html !== fx.dataset.h) { fx.innerHTML = html; fx.dataset.h = html; }
  }
  let fly = document.getElementById('ck-fly');
  const rem = CKV.anims.find(a => a.type === 'rem' && now - a.t0 >= CK_T.rise && now - a.t0 < CK_T.rise + CK_T.fly);
  if (rem) {
    if (!fly) { fly = document.createElement('img'); fly.id = 'ck-fly'; fly.className = 'ckfly'; document.body.appendChild(fly); }
    const f = Math.min(1, (now - rem.t0 - CK_T.rise) / CK_T.fly), sx = cr.left + (cx + rem.dx) * sc, sy = cr.top + 22 * sc;
    const cell = document.querySelector(`#ck-st [data-k="${rem.k}"]`), tc = cell ? cell.getBoundingClientRect() : { left: sx, top: sy + 200, width: 0, height: 0 };
    const ex = tc.left + tc.width / 2, ey = tc.top + tc.height / 2, qx = (sx + ex) / 2 + 30, qy = sy - 150;
    fly.src = iconURL(rem.k); fly.style.display = 'block';
    fly.style.left = ((1 - f) * (1 - f) * sx + 2 * (1 - f) * f * qx + f * f * ex) + 'px'; fly.style.top = ((1 - f) * (1 - f) * sy + 2 * (1 - f) * f * qy + f * f * ey) + 'px';
  } else if (fly) fly.style.display = 'none';
  if (CKV.res && !CKV.res.shown && now - CKV.res.t0 >= CK_T.cook) { CKV.res.shown = 1; renderPanel(); }
  return true;
}
function ckLoop() {
  const top = winTop();
  if (!top || top.id !== 'cook' || !ckDraw(performance.now() / 1000)) { CKV.raf = 0; const fly = document.getElementById('ck-fly'); if (fly) fly.style.display = 'none'; return; }
  CKV.raf = requestAnimationFrame(ckLoop);
}
const ckKick = () => { if (!CKV.raf) CKV.raf = requestAnimationFrame(ckLoop); };
/* ── 솥 다루기 ── */
function potAdd(k) {
  const C = cookState();
  if (C.pot.length >= POT_MAX) return `솥에는 ${POT_MAX}개까지 넣어요.`;
  if ((S.inv[k] || 0) < 1) return `${ITEMS[k].name}이(가) 창고에 없어요.`;
  if (CKV.cook && performance.now() / 1000 - CKV.cook.t0 < CK_T.cook) return '';
  addTo(S.inv, k, -1); C.pot.push(k);
  CKV.anims.push({ type: 'plop', k, t0: performance.now() / 1000, dx: CK_DX[(C.pot.length - 1) % CK_DX.length], i: C.pot.length - 1 });
  sfx('ui'); changed(); ckKick(); return '';
}
function potRem(i) {
  const C = cookState(), k = C.pot[i]; if (!k) return '';
  if (!roomItem(k)) return WH_FULL;
  C.pot.splice(i, 1); addTo(S.inv, k, 1);
  CKV.anims.push({ type: 'rem', k, t0: performance.now() / 1000, dx: CK_DX[i % CK_DX.length] });
  changed(); ckKick(); return '';
}
function potClear(quiet) {
  const C = cookState(); if (!C.pot.length) return '';
  const now = performance.now() / 1000;
  C.pot.forEach((k, i) => { addTo(S.inv, k, 1); if (!quiet) CKV.anims.push({ type: 'rem', k, t0: now + i * 0.12, dx: CK_DX[i % CK_DX.length] }); });
  C.pot = []; changed(); ckKick(); return '';
}
function potFill(id) {
  const F = FOODS[id]; if (!F || !knows(id)) return '';
  potClear(true);
  const miss = Object.entries(F.need).find(([k, q]) => (S.inv[k] || 0) < q);
  if (miss) return `${ITEMS[miss[0]].name}이(가) 모자라요 (${S.inv[miss[0]] || 0}/${miss[1]}).`;
  const C = cookState(), now = performance.now() / 1000; let i = 0;
  for (const [k, q] of Object.entries(F.need)) for (let j = 0; j < q; j++) { addTo(S.inv, k, -1); C.pot.push(k); CKV.anims.push({ type: 'plop', k, t0: now + i * 0.18, dx: CK_DX[i % CK_DX.length], i }); i++; }
  changed(); ckKick(); return '';
}
function potCook() {
  const C = cookState(); if (!C.pot.length) return '솥이 비었어요. 재료를 넣어 주세요.';
  if (!S.bld.kitchen) return '주방이 필요해요.';
  if (CKV.cook && performance.now() / 1000 - CKV.cook.t0 < CK_T.cook) return '';
  const id = RECIPE_OF[potKey(C.pot)], now = performance.now() / 1000;
  if (id && (S.bld.kitchen || 0) < FOODS[id].lv) {   // 레시피는 맞는데 주방이 작다: 도감에 적고 재료는 그대로
    const fresh = learnRecipe(id, '솥에서 찾음'); changed();
    return `${FOODS[id].name} 레시피예요${fresh ? ' (도감에 적었어요)' : ''}. 만들려면 주방 Lv${FOODS[id].lv}이 필요해요.`;
  }
  const out = id ? 'food_' + id : 'food_sus';
  if (!roomItem(out, C.pot.length)) return WH_FULL;
  const used = C.pot.slice(); C.pot = [];
  let n = 1;
  if (id) { const lv = S.bld.kitchen || 0; if (lv >= 2 && rnd() < (lv >= 3 ? 0.3 : 0.15)) n = 2; C.made[id] = (C.made[id] || 0) + n; S.stats.cooked = (S.stats.cooked || 0) + 1; } else C.sus = (C.sus || 0) + 1;
  addTo(S.inv, out, n);
  const fresh = id ? learnRecipe(id, '솥에서 찾음') : false;
  CKV.cook = { t0: now }; CKV.res = { t0: now, id, n, fresh, used, shown: 0 };
  if (!id) log(`솥에서 수상한 죽이 끓었다… (${used.map(k => ITEMS[k].name).join(' · ')})`);
  sfx('pot'); changed(); ckKick(); return '';
}
/* ── 요리 화면 ── */
function cookCell(k, n, act, extra) { const g = itemGrade(k); return `<button type="button" class="cell rq${g}${n === 0 ? ' zero' : ''}" data-act="${act}" ${extra || ''}>${rqArt(iconURL(k), g, 2)}${n != null ? `<b class="qty">${n}</b>` : ''}</button>`; }
PANELS.cook = () => {
  const C = cookState(), tab = UI.cookTab || 'all';
  const pot = Array.from({ length: POT_MAX }, (_, i) => C.pot[i] ? cookCell(C.pot[i], null, 'potrem', `data-i="${i}" title="빼기"`).replace('</button>', '<b class="qty">빼기</b></button>') : `<span class="cell empty">${rqEmpty(2)}</span>`).join('');
  const mats = COOK_MATS.filter(k => (S.inv[k] || 0) > 0 && (tab === 'all' || cookCat(k) === tab));
  const st = mats.map(k => cookCell(k, S.inv[k] || 0, 'potadd', `data-k="${k}"`)).join('') || '<div class="sub muted" style="padding:8px">이 갈래의 재료가 창고에 없어요. 하르겐 시장 · 왕국 상단 · 항구 · 재배소에서 구해요.</div>';
  const R = CKV.res, res = R && R.shown ? (() => {
    const k = R.id ? 'food_' + R.id : 'food_sus', g = itemGrade(k), F = R.id && FOODS[R.id];
    return `<div class="card ckres"><div class="rib${R.id ? '' : ' gray'}">${R.id ? (R.fresh ? '새 레시피 발견!' : '요리 완성') : '레시피에 없는 조합…'}</div>
      <div class="cell rq${g}" style="width:60px;height:60px;margin:4px auto">${rqArt(iconURL(k), g, 2)}</div>
      <div class="h" style="justify-content:center">${ITEMS[k].name}${R.n > 1 ? ` <small>×${R.n}</small>` : ''}</div>
      <div class="sub">${needTxt(F ? F.need : Object.fromEntries(R.used.map(x => [x, R.used.filter(y => y === x).length])))}</div>
      <div class="sub gold-t">${F ? foodFxText(F.fx) : '효과 없음 · 펫 먹이로 줄 수 있어요'}</div>
      ${R.fresh ? '<div class="sub muted">도감 「요리」에 적었어요 · 다음부터는 「레시피로 넣기」로 바로</div>' : ''}
      <button type="button" class="btn gold sm" data-act="cookok" style="margin-top:6px">확인</button></div>`;
  })() : '';
  const known = FOOD_IDS.filter(knows), quick = known.length ? `<details class="ckquick"><summary class="sub">레시피로 넣기 (찾은 ${known.length}/${FOOD_IDS.length})</summary><div class="chips">${known.map(id => `<button type="button" class="chip" data-act="potfill" data-id="${id}">${FOODS[id].name}</button>`).join('')}</div></details>` : '';
  const market = Object.keys(KITCHEN_BUY).map(k => `<div class="li">${iconImg(k)}<div class="grow stack"><span>${ITEMS[k].name}</span><span class="sub gold-t">${fmt(KITCHEN_BUY[k])}G</span></div><button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="1">사기</button><button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="5">×5</button></div>`).join('');
  ckKick();
  return `<div class="ckscene" data-part="ckscene"><canvas id="ck-cv" width="${CK_W}" height="${CK_H}"></canvas><div id="ck-fx"></div></div>
    <div data-part="ckres">${res}</div>
    <div data-part="ckpot"><div class="sec"><b>솥 안</b><span>${C.pot.length}/${POT_MAX} · 주방 Lv${S.bld.kitchen || 0}</span></div><div class="igrid">${pot}</div>
    <div class="row ckbtns"><button type="button" class="btn gold" data-act="potcook">요리하기</button><button type="button" class="btn" data-act="potclr">모두 빼기</button><button type="button" class="btn" data-act="cookdex">레시피 도감</button></div></div>
    <div data-part="ckq">${quick}</div>
    <div data-part="ckst"><div class="tabs inv">${COOK_TABS.map(([id, n]) => `<button type="button" class="tab${tab === id ? ' on' : ''}" data-act="cooktab" data-id="${id}">${n}</button>`).join('')}</div>
    <div class="igrid" id="ck-st">${st}</div>
    <div class="sub muted">재료를 누르면 솥에 하나씩 넣고, 솥 칸을 누르면 빼서 창고로 돌려보내요. 재료와 그 수가 맞으면 요리 — 처음 만든 요리는 도감 「요리」에 적혀요. 틀리면 수상한 죽(재료는 써요).</div></div>
    <div data-part="ckmk"><details><summary class="sec"><b>하르겐 시장</b><span>늘 열려 있는 재료 가게</span></summary><div class="list">${market}</div></details></div>`;
};
const cookOpen0 = () => { openWin('cook'); ckKick(); };
/* ── 주방 창 (시설) ── */
BLD_INNER.kitchen = '요리 화면';
BLD_SUM.kitchen = () => { const C = cookState(); return `<div class="sub">찾은 레시피 ${FOOD_IDS.filter(knows).length}/${FOOD_IDS.length} · 도시락 ${FOOD_IDS.reduce((n, id) => n + (S.inv['food_' + id] || 0), 0)}개${C.pot.length ? ` · 솥 안 ${C.pot.length}개` : ''}</div>`; };
BLD_BOX.kitchen = () => {
  const C = cookState(), lv = S.bld.kitchen || 0, known = FOOD_IDS.filter(knows);
  const rows = known.map(id => { const F = FOODS[id], have = S.inv['food_' + id] || 0, why = cookWhy(id);
    return `<div class="li${lv >= F.lv ? '' : ' dim'}">${iconImg('food_' + id)}<div class="grow stack"><span>${F.name} <span class="muted">창고 ${have} · 주방 Lv${F.lv}</span></span><span class="sub">${foodFxText(F.fx)}</span><span class="sub muted">${needStr(F.need)}</span></div><button type="button" class="btn sm gold" data-act="potfill" data-id="${id}"${why && lv >= F.lv ? '' : ''}>솥에 넣기</button></div>`; }).join('');
  const market = Object.keys(KITCHEN_BUY).map(k => `<div class="li">${iconImg(k)}<div class="grow stack"><span>${ITEMS[k].name} <span class="muted">창고 ${S.inv[k] || 0}</span></span><span class="sub gold-t">${fmt(KITCHEN_BUY[k])}G</span></div><button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="1">사기</button><button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="5">×5</button></div>`).join('');
  return `<div class="card hl"><div class="row"><div class="grow"><div class="h">요리 화면</div><div class="sub">큰 구리솥에 재료를 하나씩 넣어 요리해요. 레시피는 직접 찾거나 왕국 상단 · 항구의 배에서 사요 (하나에 ${fmt(RECIPE_PRICE)}G).</div></div><button type="button" class="btn gold" data-act="cookopen">요리하러 가기 ›</button></div>
    <div class="sub muted">찾은 레시피 ${known.length}/${FOOD_IDS.length}${C.pot.length ? ` · 솥 안에 재료 ${C.pot.length}개` : ''} · 도시락은 원정대 창에서 파티마다 골라요 (찾은 레시피만 「떨어지면 만들기」).</div></div>
    ${known.length ? `<div class="sec"><b>찾은 레시피</b><span>「솥에 넣기」로 재료를 한 번에</span></div><div class="list">${rows}</div>` : ''}
    <div class="sec"><b>하르겐 시장</b><span>늘 열려 있어요 · 가장 싼 재료 ${fmt(Math.min(...Object.values(KITCHEN_BUY)))}G</span></div><div class="list">${market}</div>`;
};
/* ── 도감 「요리」 탭 ── */
DEX_TABS.push(['food', '요리']);
const dexPanel0 = PANELS.dex;
PANELS.dex = top => {
  if ((UI.dexTab || 'mon') !== 'food') return dexPanel0(top);
  const bar = `<div class="tabs">${DEX_TABS.map(([id, n]) => `<button type="button" class="tab${id === 'food' ? ' on' : ''}" data-act="dextab" data-id="${id}">${n}</button>`).join('')}</div>`;
  const C = cookState(), ids = FOOD_IDS.slice().sort((a, b) => (knows(b) ? 1 : 0) - (knows(a) ? 1 : 0) || FOODS[a].lv - FOODS[b].lv);
  const mini = k => `<img class="ico" src="${iconURL(k)}" alt="" style="width:20px;height:20px">`;
  const rows = ids.map(id => { const F = FOODS[id], k = 'food_' + id, g = itemGrade(k);
    if (!knows(id)) return `<div class="li dim"><span class="cell empty" style="width:60px;height:60px;flex:none">${rqEmpty(2)}</span><div class="grow stack"><span>??? <span class="muted">주방 Lv${F.lv}</span></span><span class="sub muted">솥에 직접 넣어 찾거나, 왕국 상단 · 항구의 배에서 레시피를 사요</span></div></div>`;
    return `<div class="li"><span class="cell rq${g}" style="width:60px;height:60px;flex:none">${rqArt(iconURL(k), g, 2)}</span><div class="grow stack"><span>${F.name} <span class="muted">주방 Lv${F.lv} · ${C.made[id] || 0}번 만듦</span></span><span class="sub">${Object.entries(F.need).flatMap(([x, q]) => Array(q).fill(mini(x))).join(' ')}</span><span class="sub gold-t">${foodFxText(F.fx)}</span></div><button type="button" class="btn sm" data-act="potfill" data-id="${id}">레시피로 넣기</button></div>`; }).join('');
  return `${bar}<div class="sec"><b>요리 레시피</b><span>${FOOD_IDS.filter(knows).length}/${FOOD_IDS.length} 찾음 · 수상한 죽 ${C.sus || 0}번</span></div><div class="sub muted">주방의 요리 화면에서 구리솥에 재료를 넣어 맞는 조합을 찾으면 여기에 적혀요. 왕국 상단 · 항구의 배는 그 나라 재료가 들어가는 레시피를 팔아요.</div><div class="list">${rows}</div>`;
};
/* ── 왕국 상단 · 항구 배의 레시피 · 채소 ── */
function recipeGoods(ids) { return ids.filter(id => !knows(id)).map(id => ({ it: 'rcp_' + id, n: 1, price: RECIPE_PRICE })); }
function buyRecipe(it) { const id = ITEMS[it] && ITEMS[it].recipe; if (!id) return false; learnRecipe(id, '레시피를 삼'); return true; }
Object.assign(ACT, {
  cookopen: () => { cookOpen0(); },
  potadd: d => { say(potAdd(d.k)); renderPanel(); },
  potrem: d => { say(potRem(+d.i)); renderPanel(); },
  potclr: () => { say(potClear()); renderPanel(); },
  potcook: () => { say(potCook()); renderPanel(); },
  potfill: d => { const top = winTop(); if (!top || top.id !== 'cook') cookOpen0(); say(potFill(d.id)); renderPanel(); },
  cooktab: d => { UI.cookTab = d.id; renderPanel(true); },
  cookok: () => { CKV.res = null; renderPanel(); },
  cookdex: () => { UI.dexTab = 'food'; openWin('dex', { tab: 'food' }); }
});
