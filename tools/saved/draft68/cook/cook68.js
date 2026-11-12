// 빌드 68 시안: 요리 전용 화면 (큰 구리솥 · 넣으면 퐁당 · 빼면 창고로) — 게임 안 그리기 도구를 빌려 그린다. 게임에는 안 넣음.
const ICO = window.__ICO68;   // python이 넣는 20x20 그림 {k: {name, url, grade, ...}}
const ART = {}; const IMG = {};
const itemInfo = k => ICO[k] ? { name: ICO[k].name, url: ICO[k].url, g: ICO[k].grade } : { name: ITEMS[k].name, url: iconURL(k), g: itemGrade(k) };
const COLOR = { hg_potato: '#c8a060', hg_carrot: '#e8802a', raw_meat: '#9a3a30', hg_onion: '#d0883a', hg_cabbage: '#6ab84a', egg_none: '#f0e6d0', flour: '#e8e0d0', spice: '#a8542a', sr_chili: '#d82a1a', el_lettuce: '#8ad06a', sea_mackerel: '#5a8eaa', sea_shrimp: '#e8683a' };
const STORE = [['raw_meat', 6], ['hg_potato', 5], ['hg_carrot', 4], ['hg_onion', 3], ['hg_cabbage', 2], ['egg_none', 2], ['flour', 8], ['spice', 3], ['sr_chili', 3], ['el_lettuce', 2], ['sea_mackerel', 2], ['sea_shrimp', 2]];
const POT_N = 6;
const loadImg = u => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.src = u; });
async function prep() {
  for (const k of Object.keys(ICO)) { const im = await loadImg(ICO[k].url); const [c, x] = mkCanvas(20, 20); x.drawImage(im, 0, 0); URL_CV.set(ICO[k].url, c); IMG[k] = im; }
  for (const [k] of STORE) if (!IMG[k]) IMG[k] = await loadImg(itemInfo(k).url);
  S.modals = []; const m = document.querySelector('#modal'); if (m) m.style.display = 'none';
}

// ── 장면 ──
let W = 196, H = 128;
const T0 = { dark: [0, 0] };
function wall(g) {
  q3Logs(g, 0, 0, W, H, '#8a5a34', 17);
  qF(g, 14, 24, W - 28, 80, '#5e564e');
  for (let y = 24, row = 0; y < 104; y += 6, row++) for (let x = 14 + (row % 2) * 4; x < W - 14; x += 8) { const blue = (x * 3 + y) % 5 === 0; qF(g, x, y, 7, 5, blue ? '#6a86a2' : '#cfc6b4'); qF(g, x, y, 7, 1, blue ? '#86a2bc' : '#e4dccc'); qF(g, x, y + 4, 7, 1, blue ? '#546e88' : '#b0a694'); }
  q3Beam(g, 1, W, '#4e3018');
  const cx = W >> 1;   // 굴뚝 갓
  qQ(g, [[cx - 26, 6], [cx + 26, 6], [cx + 54, 26], [cx - 54, 26]], '#6e6660'); qF(g, cx - 54, 25, 108, 3, '#8a827c'); qF(g, cx - 54, 25, 108, 1, '#a49c96'); qF(g, cx - 20, 0, 40, 7, '#5e5854'); qF(g, cx - 20, 0, 3, 7, '#7a726c');
  for (let i = 0; i < 6; i++) qF(g, cx - 40 + i * 14, 14 + (i % 2) * 4, 9, 1, '#5a524c');
  for (const [x, k, s] of [[12, 'garlic', 1], [24, 'herb', 2], [W - 24, 'meat', 3], [W - 12, 'garlic', 4]]) q4Hang(g, x, 10, k, s);
  for (const [sx, dir] of [[4, 1], [W - 40, -1]]) {   // 양념 선반
    q4Shelf(g, sx, 62, 36, '#5e3a20');
    const r = rng(sx + 7); for (let x = sx + 3; x < sx + 34; x += 7) { const c = ['#c0392b', '#4f8a43', '#e8c060', '#7a5aa8'][Math.floor(r() * 4)]; qF(g, x, 54, 5, 8, '#c8a050'); qF(g, x, 53, 5, 1, '#e8dcb8'); qF(g, x + 1, 56, 3, 3, c); }
    q4Shelf(g, sx, 88, 36, '#5e3a20');
    for (let x = sx + 4; x < sx + 32; x += 10) { qEll(g, x + 3, 84, 4, 4, '#a87a4a'); qF(g, x, 79, 7, 2, '#7a5432'); qP(g, x + 1, 82, '#d8b080'); }
  }
}
function hearth(g, t) {
  const cx = W >> 1, top = 102;
  qF(g, 26, top, W - 52, H - top, '#6a625e');
  for (let y = top + 4, row = 0; y < H; y += 7, row++) for (let x = 26 + (row % 2) * 7; x < W - 26; x += 14) { qF(g, x, y, 13, 6, (x + y) % 3 ? '#77706a' : '#625a56'); qF(g, x, y, 13, 1, '#8a827c'); }
  qF(g, 22, top - 2, W - 44, 5, '#8a827c'); qF(g, 22, top - 2, W - 44, 1, '#a49c96'); qF(g, 22, top + 3, W - 44, 1, '#4a4440');
  qQ(g, [[cx - 24, H], [cx - 24, top + 12], [cx - 16, top + 6], [cx + 16, top + 6], [cx + 24, top + 12], [cx + 24, H]], '#1a1210');
  for (let i = 0; i < 7; i++) { const ph = (t * 2.2 + i * 0.37) % 1; qF(g, cx - 18 + i * 6, H - 4 - (i % 2), 5, 3, ph < 0.5 ? '#f8a040' : '#e07028'); }
  drawFire(g, cx - 8, H - 2, t, true); drawFire(g, cx + 8, H - 2, t + 0.4, true);
}
const PC = { h: '#ffd8a8', l: '#f4a868', b: '#c8703a', s: '#a45428', d: '#7a3a1c', k: '#4a200e' };
const POT = { rimY: 50, rx: 47, ry: 12, irx: 42, iry: 9, ly: 52, lrx: 40, lry: 8, cy: 62, bry: 42 };
function potBody(g, t, cook) {
  const cx = W >> 1, { rimY, cy } = POT, rx = 48, ry = POT.bry, r = rng(5);
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
  for (let i = 0; i < 90; i++) { const x = cx - 40 + Math.floor(r() * 80), y = rimY + 14 + Math.floor(r() * 24); const u = (x - cx) / rx; if (u > -0.5 && u < 0.6) qP(g, x, y, r() < 0.5 ? PC.l : PC.s); }   // 두드린 자국
  const by = 76; qF(g, cx - 47, by, 95, 4, PC.d); qF(g, cx - 47, by, 95, 1, PC.s); qF(g, cx - 47, by + 3, 95, 1, PC.k);   // 띠 · 리벳
  for (let x = cx - 42; x <= cx + 42; x += 8) { qF(g, x, by + 1, 2, 2, PC.l); qP(g, x, by + 1, PC.h); }
  const fl = 0.5 + 0.5 * Math.sin(t * 9);   // 불빛이 솥 밑을 비춘다
  for (let x = cx - 30; x <= cx + 30; x += 2) if ((x + Math.floor(t * 8)) % 6 < 3) qP(g, x, cy + ry - 1, fl > 0.5 ? '#f88a3c' : '#c8502a');
  for (const sx of [-1, 1]) {   // 고리 손잡이
    const hx0 = cx + sx * 49; qF(g, hx0 - 3, 62, 6, 6, PC.k); qF(g, hx0 - 2, 63, 4, 4, '#5a5a66');
    for (let a = 0; a < 24; a++) { const th = a / 24 * Math.PI * 2, x = Math.round(hx0 + sx * 3 + Math.cos(th) * 4), y = Math.round(72 + Math.sin(th) * 5); qP(g, x, y, a < 12 ? '#3a3a44' : '#8a8a98'); }
  }
}
function rimBack(g) { const cx = W >> 1, { rimY, rx, ry, irx, iry } = POT; qEll(g, cx, rimY, rx, ry, PC.k); qEll(g, cx, rimY, rx - 1, ry - 1, PC.l); qEll(g, cx, rimY, irx, iry, PC.d); qEll(g, cx, rimY + 1, irx - 1, iry - 1, PC.k); }
function rimFront(g) {
  const cx = W >> 1, { rimY, rx, ry, irx, iry } = POT;
  for (let x = cx - rx; x <= cx + rx; x++) {
    const u = (x - cx) / rx, yo = Math.round(rimY + ry * Math.sqrt(Math.max(0, 1 - u * u))), yi = Math.round(rimY + iry * Math.sqrt(Math.max(0, 1 - ((x - cx) / irx) ** 2)));
    const top = Math.abs(x - cx) <= irx ? yi + 1 : rimY;
    for (let y = top; y <= yo; y++) qP(g, x, y, y === yo ? PC.k : y === top ? PC.h : u < 0.45 ? PC.l : PC.b);
  }
}
const SOUP0 = '#6a8a8a';
function soupCol(pot, cook, t) {
  let c = SOUP0; if (!pot.length) return c;
  const cs = pot.map(p => COLOR[p.k] || '#a87a4a'); const avg = cs.reduce((a, h) => [a[0] + parseInt(h.slice(1, 3), 16), a[1] + parseInt(h.slice(3, 5), 16), a[2] + parseInt(h.slice(5, 7), 16)], [0, 0, 0]).map(v => v / cs.length);
  const m = Math.min(0.85, 0.25 + pot.length * 0.15); const b = [0x6a, 0x8a, 0x8a];
  return '#' + b.map((v, i) => Math.round(v * (1 - m) + avg[i] * m).toString(16).padStart(2, '0')).join('');
}
function liquid(g, t, pot, cook, ripples) {
  const cx = W >> 1, ly = POT.ly, LR = POT.lrx, LY = POT.lry, c = soupCol(pot, cook, t), R = qR(c);
  qEll(g, cx, ly, LR, LY, R.b); qEll(g, cx, ly - 2, LR - 2, LY - 3, R.s); qEll(g, cx + 2, ly + 1, LR - 6, LY - 3, R.b); qEll(g, cx - 8, ly - 1, 18, 3, R.l);
  for (let i = 0; i < 16; i++) { const x = cx - 34 + ((i * 37 + Math.floor(t * 3)) % 68), y = ly - 6 + (i * 5) % 12; if (((x - cx) / LR) ** 2 + ((y - ly) / LY) ** 2 < 0.75) qF(g, x, y, 3, 1, R.h); }
  const nb = cook ? 14 : 5;   // 보글보글
  for (let i = 0; i < nb; i++) {
    const per = cook ? 0.45 : 0.9, ph = ((t + i * 0.137) / per) % 1, k = Math.floor((t + i * 0.137) / per), rr = rng(i * 31 + k * 7)();
    const x = Math.round(cx - 34 + rr * 68), y = Math.round(ly - 5 + ((i * 3 + k) % 10));
    if (((x - cx) / LR) ** 2 + ((y - ly) / LY) ** 2 > 0.8) continue;
    if (ph < 0.7) { const r = ph < 0.35 ? 1 : 2; qDisc(g, x, y - r, r, R.h); qP(g, x - 1, y - r - 1, '#ffffff'); }
    else { qP(g, x - 2, y - 1, R.h); qP(g, x + 2, y - 1, R.h); qP(g, x, y - 3, R.h); }
  }
  pot.forEach((p, i) => { const x = Math.round(cx + p.dx * 0.9 + Math.sin(t * 1.4 + i) * 2), y = ly - 3 + (i % 3) * 3; const C = qR(COLOR[p.k] || '#a87a4a'); qF(g, x - 3, y, 6, 3, C.b); qF(g, x - 3, y, 3, 1, C.l); qF(g, x + 1, y + 2, 2, 1, C.d); qF(g, x - 3, y + 3, 6, 1, R.s); });   // 떠 있는 건더기
  for (const rp of ripples) {   // 물결 고리
    const a = rp.a; if (a < 0 || a > 0.5) continue;
    const rx = 4 + a * 50, ry = 1.5 + a * 11;
    for (let k = 0; k < 48; k++) { const th = k / 48 * Math.PI * 2; if ((k + Math.floor(a * 20)) % (a > 0.3 ? 3 : 2)) continue; const x = Math.round(rp.x + Math.cos(th) * rx), y = Math.round(ly + Math.sin(th) * ry); if (((x - cx) / LR) ** 2 + ((y - ly) / LY) ** 2 <= 1) qP(g, x, y, R.h); }
  }
  if (cook) for (let k = 0; k < 3; k++) { const th0 = t * 5 + k * 2.1; for (let s = 0; s < 10; s++) { const th = th0 + s * 0.1, rr = 9 + k * 10; qF(g, Math.round(cx + Math.cos(th) * rr), Math.round(ly + Math.sin(th) * rr * 0.2), 2, 1, R.h); } }
}
function ladle(g, t, cook) {
  const cx = W >> 1, a = cook ? t * 7 : 0, bx = cx + 18 + Math.cos(a) * (cook ? 14 : 0), by = 54 + Math.sin(a) * (cook ? 3 : 0), tx = cx + 60 + (cook ? Math.cos(a) * 3 : 0), ty = 18;
  const n = Math.max(Math.abs(tx - bx), Math.abs(ty - by));
  for (let i = 0; i <= n; i++) { const x = Math.round(bx + (tx - bx) * i / n), y = Math.round(by + (ty - by) * i / n); if (y > 51) continue; qF(g, x, y, 2, 2, '#a8743e'); qP(g, x, y, '#d0a060'); qP(g, x + 2, y + 1, '#6e4626'); }
}
function steam(g, t, cook) {
  const cx = W >> 1, n = cook ? 9 : 4;
  for (let i = 0; i < n; i++) {
    const per = cook ? 1.1 : 1.8, ph = ((t + i * 0.41) / per) % 1, x = Math.round(cx - 26 + ((i * 23) % 52) + Math.sin((t + i) * 2) * 3), y = Math.round(46 - ph * 30), r = 2 + Math.round(ph * 3);
    if (ph > 0.85) continue;
    g.globalAlpha = 0.55 * (1 - ph); qDisc(g, x, y, r, '#f4f0f0'); g.globalAlpha = 1;
  }
}
// ── 상태: 사건을 차례로 돌려 지금 때의 상태를 만든다 ──
const EV = [];
const PLOP = { pop: 0.08, hang: 0.12, fall: 0.3 }, PLOP_HIT = PLOP.pop + PLOP.hang + PLOP.fall, REM = { rise: 0.3, fly: 0.46 }, COOK_T = 1.5;
const DXS = [-16, 12, -4, 20, -22, 4];
function stateAt(t) {
  const st = { pot: [], store: Object.fromEntries(STORE.map(([k, n]) => [k, n])), plops: [], rems: [], ripples: [], drops: [], cook: null, taps: [], pops: [], result: null };
  let nDx = 0;
  for (const e of EV) {
    if (e.t > t) break;
    const a = t - e.t;
    if (e.a === 'add') {
      st.store[e.k]--; const dx = DXS[nDx++ % DXS.length];
      st.taps.push({ el: 'st:' + e.k, a });
      if (a < PLOP_HIT) st.plops.push({ k: e.k, a, dx });
      else { st.pot.push({ k: e.k, dx, t: e.t }); const b = a - PLOP_HIT; st.ripples.push({ a: b, x: (W >> 1) + dx }); st.drops.push({ a: b, x: (W >> 1) + dx, seed: e.t }); st.pops.push({ txt: '퐁당!', a: b, x: (W >> 1) + dx, y: 34 }); }
    } else if (e.a === 'rem') {
      const p = st.pot.splice(e.i, 1)[0]; st.taps.push({ el: 'pot:' + e.i, a });
      if (a < REM.rise + REM.fly) st.rems.push({ k: p.k, a, dx: p.dx }); else { st.store[p.k]++; st.bump = { k: p.k, a: a - REM.rise - REM.fly }; }
      if (a < 0.5) { st.ripples.push({ a: a * 0.8, x: (W >> 1) + p.dx }); st.pops.push({ txt: '쏙!', a, x: (W >> 1) + p.dx, y: 30 }); }
    } else if (e.a === 'cook') {
      st.taps.push({ el: 'cook', a });
      if (a < COOK_T) st.cook = { a }; else { st.result = { a: a - COOK_T, k: e.out, name: e.name, need: e.need, fx: e.fx }; st.pot.length = 0; st.cooked = 1; }
    }
  }
  return st;
}
// ── 그리기 ──
let CV, G, ROOT;
function drawScene(t, st) {
  G.clearRect(0, 0, W, H);
  wall(G); hearth(G, t);
  const cook = !!st.cook;
  rimBack(G); liquid(G, t, st.pot, cook, st.ripples);
  const cx = W >> 1, ly = POT.ly;
  const clipDraw = (im, x, y, clipY) => { G.save(); G.beginPath(); G.rect(0, 0, W, clipY); G.clip(); G.drawImage(im, Math.round(x - 10), Math.round(y - 10)); G.restore(); };
  for (const p of st.plops) {   // 위에 나타나서 퐁당
    const x = cx + p.dx, y0 = 14; let y = y0;
    if (p.a < PLOP.pop) { G.save(); G.globalAlpha = 0.4 + p.a / PLOP.pop * 0.6; G.drawImage(IMG[p.k], x - 10, y0 - 10); G.globalCompositeOperation = 'source-atop'; G.restore(); for (let k = 0; k < 6; k++) { const th = k / 6 * Math.PI * 2, rr = 8 + p.a / PLOP.pop * 8; qF(G, Math.round(x + Math.cos(th) * rr), Math.round(y0 + Math.sin(th) * rr), 2, 2, '#fff8d8'); } continue; }
    const b = p.a - PLOP.pop;
    if (b < PLOP.hang) y = y0 - Math.round(Math.sin(b / PLOP.hang * Math.PI) * 3);
    else { const f = (b - PLOP.hang) / PLOP.fall; y = y0 + (ly + 8 - y0) * f * f; }
    clipDraw(IMG[p.k], x, y, ly + 1 + (p.dx % 3));
  }
  for (const r of st.rems) {   // 솥에서 솟아오르기 (그다음은 화면 위 날아가는 그림)
    if (r.a >= REM.rise) continue;
    const f = r.a / REM.rise, x = cx + r.dx, y = ly + 10 - (ly + 10 - 22) * (1 - (1 - f) * (1 - f));
    clipDraw(IMG[r.k], x, y, ly + 1);
    for (let k = 0; k < 3; k++) { const yy = Math.round(y + 10 + ((f * 30 + k * 7) % 14)); if (yy < ly) qF(G, x - 4 + k * 4, yy, 1, 2, qR(soupCol(st.pot)).h); }
  }
  ladle(G, t, cook);
  potBody(G, t, cook); rimFront(G);
  steam(G, t, cook);
  q3Light(G, { W, H }, T0, { amb: 0.34, ambN: 0, lamps: [[cx, 118, 96, '#f88a3c'], [26, 30, 44], [W - 26, 30, 44]], wins: [] }, t);
  for (const d of st.drops) {   // 튀는 물방울 (빛 위에)
    if (d.a > 0.5) continue; const R = rng(Math.round(d.seed * 100));
    for (let k = 0; k < 9; k++) { const vx = (R() - 0.5) * 70, vy = -40 - R() * 50, x = d.x + vx * d.a, y = ly - 2 + vy * d.a + 160 * d.a * d.a; if (y > ly + 3) continue; qF(G, Math.round(x), Math.round(y), 2, 2, k % 3 ? qR(soupCol(st.pot)).l : '#ffffff'); }
  }
  if (cook) { const a = st.cook.a; if (a > COOK_T - 0.22) { G.globalAlpha = Math.min(1, (a - (COOK_T - 0.22)) / 0.22) * 0.85; qF(G, 0, 0, W, H, '#fff4d8'); G.globalAlpha = 1; } }
}
function cellHTML(k, n, attr) { const I = itemInfo(k); return `<button type="button" class="cell${rqc(I.g)}${n === 0 ? ' zero' : ''}" ${attr}>${rqArt(I.url, I.g, 2)}<b class="qty">${n}</b></button>`; }
const rqc = g => ' rq' + g;
function setup() {
  S.bld.kitchen = 3; openWin('b', { b: 'kitchen' });
  document.querySelector('#win-title').textContent = '요리';
  const pi = document.querySelector('#panel-in'), cw = pi.clientWidth - 20;
  W = Math.floor(cw / 2); H = 128;
  pi.innerHTML = `<div class="d68">
    <div class="d68scene"><canvas id="d68cv" width="${W}" height="${H}" style="width:${W * 2}px;height:${H * 2}px;image-rendering:pixelated;display:block"></canvas><div id="d68fx"></div></div>
    <div class="sec"><b>솥 안</b><span id="d68cnt">0/${POT_N}</span></div>
    <div class="igrid d68pot" id="d68pot"></div>
    <div class="row d68btns"><button type="button" class="btn gold" id="d68cook">요리하기</button><button type="button" class="btn">모두 빼기</button><button type="button" class="btn">레시피 도감</button></div>
    <div class="tabs inv d68tabs"><button type="button" class="tab on">전체</button><button type="button" class="tab">고기</button><button type="button" class="tab">채소</button><button type="button" class="tab">해산물</button><button type="button" class="tab">곡물·양념</button><button type="button" class="tab">알</button></div>
    <div class="igrid d68st" id="d68st"></div>
    <div class="sub muted d68hint">재료를 누르면 솥에 하나씩 넣고, 솥 칸을 누르면 빼서 창고로 돌려보내요. 맞는 조합이면 새 레시피 — 도감 「요리」에 적어요.</div>
  </div>`;
  const css = document.createElement('style'); css.textContent = `
    .d68scene{position:relative;margin:0 auto 4px;width:${W * 2}px;border:2px solid #2a1a10;box-shadow:0 2px 0 #00000055}
    #d68fx{position:absolute;inset:0;pointer-events:none;overflow:visible}
    .d68pop{position:absolute;transform:translate(-50%,-50%);font:bold 16px Galmuri11,sans-serif;color:#fff;text-shadow:2px 0 0 #3a1a0a,-2px 0 0 #3a1a0a,0 2px 0 #3a1a0a,0 -2px 0 #3a1a0a,2px 2px 0 #3a1a0a;white-space:nowrap}
    .d68pot,.d68st{margin:2px 0}
    .d68btns{gap:6px;margin:4px 0}.d68btns .btn{flex:1}
    .d68tabs{margin-top:6px}
    #d68fly{position:fixed;left:0;top:0;width:40px;height:40px;image-rendering:pixelated;pointer-events:none;z-index:99;transform:translate(-50%,-50%)}
    .d68tap{position:fixed;border:3px solid #fff8d8;border-radius:50%;pointer-events:none;z-index:98;transform:translate(-50%,-50%);box-shadow:0 0 0 2px #3a1a0a}
    .cell.d68bump{transform:scale(1.14)}
    .d68{position:relative}.d68res{position:absolute;left:50%;top:150px;transform:translate(-50%,-50%);width:84%;z-index:5;text-align:center;padding:8px 8px 10px;box-shadow:0 4px 0 #00000088}
    .d68res .rib{display:inline-block;background:#a8322a;color:#fff4d8;padding:2px 12px;border:2px solid #4a120c;font-weight:bold;margin-bottom:6px}
    .d68res .cell{margin:4px auto;display:block}
    .d68spk{position:absolute;width:4px;height:4px;background:#fff4b0;box-shadow:0 0 0 1px #8a5a10}
  `; document.head.appendChild(css);
  CV = document.querySelector('#d68cv'); G = CV.getContext('2d'); ROOT = pi;
  const fly = document.createElement('img'); fly.id = 'd68fly'; fly.style.display = 'none'; document.body.appendChild(fly);
}
let lastPot = '', lastSt = '';
function render(t) {
  const st = stateAt(t); drawScene(t, st);
  const potKey = st.pot.map(p => p.k).join(',');
  if (potKey !== lastPot) { lastPot = potKey; document.querySelector('#d68pot').innerHTML = Array.from({ length: POT_N }, (_, i) => st.pot[i] ? cellHTML(st.pot[i].k, 1, `data-pot="${i}"`).replace('<b class="qty">1</b>', '<b class="qty d68x">빼기</b>') : `<span class="cell empty">${rqEmpty(2)}</span>`).join(''); }
  document.querySelector('#d68cnt').textContent = `${st.pot.length}/${POT_N}`;
  const stKey = JSON.stringify(st.store);
  if (stKey !== lastSt) { lastSt = stKey; document.querySelector('#d68st').innerHTML = STORE.map(([k]) => cellHTML(k, st.store[k], `data-st="${k}"`)).join(''); }
  document.querySelectorAll('#d68st .cell').forEach(c => c.classList.toggle('d68bump', !!(st.bump && st.bump.a < 0.16 && c.dataset.st === st.bump.k)));
  // 글씨 · 탭 고리 · 날아가는 그림
  const fx = document.querySelector('#d68fx'), cr = CV.getBoundingClientRect(), sc = cr.width / W;
  let html = '';
  for (const p of st.pops) if (p.a < 0.62) html += `<div class="d68pop" style="left:${p.x * sc}px;top:${(p.y - p.a * 22) * sc}px;opacity:${p.a > 0.4 ? 1 - (p.a - 0.4) / 0.22 : 1}">${p.txt}</div>`;
  if (st.cook) html += `<div class="d68pop" style="left:${W * sc / 2}px;top:${(26 - (st.cook.a % 0.5) * 6) * sc}px;font-size:15px">보글보글…</div>`;
  fx.innerHTML = html;
  document.querySelectorAll('.d68tap').forEach(x => x.remove());
  for (const tp of st.taps) {
    if (tp.a > 0.32) continue;
    const el = tp.el === 'cook' ? document.querySelector('#d68cook') : tp.el.startsWith('st:') ? document.querySelector(`#d68st [data-st="${tp.el.slice(3)}"]`) : document.querySelector(`#d68pot [data-pot="${tp.el.slice(4)}"]`) || document.querySelector('#d68pot .cell');
    if (!el) continue; const r = el.getBoundingClientRect(), d = 18 + tp.a * 90;
    const ring = document.createElement('div'); ring.className = 'd68tap'; ring.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:${d}px;height:${d}px;opacity:${1 - tp.a / 0.32}`; document.body.appendChild(ring);
  }
  const fly = document.querySelector('#d68fly'); fly.style.display = 'none';
  for (const r of st.rems) {
    if (r.a < REM.rise) continue;
    const f = Math.min(1, (r.a - REM.rise) / REM.fly), sx = cr.left + ((W >> 1) + r.dx) * sc, sy = cr.top + 22 * sc;
    const tc = document.querySelector(`#d68st [data-st="${r.k}"]`).getBoundingClientRect(), ex = tc.left + tc.width / 2, ey = tc.top + tc.height / 2;
    const qx = (sx + ex) / 2 + 30, qy = sy - 150, x = (1 - f) * (1 - f) * sx + 2 * (1 - f) * f * qx + f * f * ex, y = (1 - f) * (1 - f) * sy + 2 * (1 - f) * f * qy + f * f * ey;
    fly.src = itemInfo(r.k).url; fly.style.display = 'block'; fly.style.left = x + 'px'; fly.style.top = y + 'px';
  }
  // 결과 카드
  let res = document.querySelector('.d68res');
  if (st.result) {
    if (!res) { res = document.createElement('div'); res.className = 'card d68res'; document.querySelector('.d68').appendChild(res); }
    const R = st.result, I = ICO[R.k], s = Math.min(1, R.a / 0.14);
    res.style.transform = `translate(-50%,-50%) scale(${0.86 + 0.14 * s})`; res.style.opacity = s;
    let spk = ''; if (R.name) for (let i = 0; i < 8; i++) { const th = i / 8 * Math.PI * 2 + R.a * 2, rr = 44 + (i % 2) * 10; if ((Math.floor(R.a * 8) + i) % 3) spk += `<i class="d68spk" style="left:calc(50% + ${Math.round(Math.cos(th) * rr * 1.5)}px);top:${58 + Math.round(Math.sin(th) * rr * 0.55)}px"></i>`; }
    res.innerHTML = `<div class="rib">${R.name ? '새 레시피 발견!' : ''}</div>${spk}<div class="cell rq${I.grade}" style="width:60px">${rqArt(I.url, I.grade, 2)}</div><div class="h" style="justify-content:center">${I.name}</div><div class="sub">${R.need}</div><div class="sub gold-t">${R.fx}</div><div class="sub muted">도감 「요리」에 적었어요 · 다음부터는 「레시피로 넣기」로 바로</div><button type="button" class="btn gold sm" style="margin-top:6px">확인</button>`;
  } else if (res) res.remove();
}
window.D68 = { prep, setup, render, EV, stateAt };
