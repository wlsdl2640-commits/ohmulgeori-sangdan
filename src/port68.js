/* ───────── 빌드 65 넷째 묶음: 항구 (처음부터 열린 시설 · 해상왕국 코랄리아의 배 「산호호」가 찾아온다) ─────────
   시안 tools/saved/draft68/port (사용자 11-12 19:57 「처음부터 오픈되어 있는 시설인 항구를 만들고, 이곳에 해상왕국의 배가 찾아오게」 · 20:34 「다 넣어」).
   상태 S.port = { next: 다음 배가 오는 날, ship: null | { from: 온 날, until: 머무는 마지막 날, stock: [{ it, n, price }] }, n: 온 횟수 }.
   배는 4 ~ 6일마다 새벽에 들어와 하루 머물고 떠난다. 해산물은 이 배에서만 · 해산물이 들어가는 요리 레시피도 하나에 100,000G. */
WIN_TITLE.port = '항구';
const portState = () => S.port || (S.port = { next: today() + 1, ship: null, n: 0 });
function portArrive(k) {
  const P = portState();
  P.ship = { from: k, until: k + PORT.stay - 1, stock: Object.keys(SEA68).filter(it => ITEMS[it]).map(it => ({ it, n: ri(PORT.stock[0], PORT.stock[1]), price: FOOD_PRICE[it] })) };
  P.n = (P.n || 0) + 1;
  log(`${PORT.king}의 배 「${PORT.ship}」이(가) 항구에 들어왔다. 해산물을 팔고 오늘 밤 떠난다.`, 'good');
  HOOKS.toast(`${PORT.king}의 배가 항구에 들어왔어요 · 오늘 밤 떠나요`);
  if (!S.flags.port1) { S.flags.port1 = 1; queueModal({ title: '해상왕국의 배', body: STORY.port }); }
  changed();
}
function portLeave() {
  const P = portState(), v = P.ship; if (!v) return;
  P.ship = null; P.next = v.from + ri(PORT.gap[0], PORT.gap[1]);
  log(`「${PORT.ship}」이(가) 항구를 떠났다. 다음 배는 ${dayLabel(P.next)}쯤.`);
}
function portDay(k) {
  const P = portState();
  if (P.ship && k > P.ship.until) portLeave();
  if (!P.ship && k >= P.next) portArrive(k);
}
function portBuy(i, q) {
  const v = portState().ship, o = v && v.stock[i];
  if (!o) return '배가 떠났어요.';
  if (o.n <= 0) return '다 팔렸어요.';
  if (S.gold < o.price) return '돈이 모자라요.';
  if (!roomItem(o.it)) return WH_FULL;
  q = Math.max(1, Math.min(q || 1, o.n, Math.floor(S.gold / o.price)));
  const cost = o.price * q;
  S.gold -= cost; o.n -= q; addTo(S.inv, o.it, q); S.stats.spent = (S.stats.spent || 0) + cost;
  log(`항구의 「${PORT.ship}」에서 ${ITEMS[o.it].name} ${q}개를 ${fmt(cost)}G에 샀다.`);
  changed();
  return `${ITEMS[o.it].name} ${q}개를 창고에 넣었어요.`;
}
function portRecipe(id) {
  if (!portState().ship) return '배가 와 있을 때만 살 수 있어요.';
  if (!FOODS[id]) return '';
  if (knows(id)) return '이미 아는 레시피예요.';
  if (S.gold < RECIPE_PRICE) return '돈이 모자라요.';
  S.gold -= RECIPE_PRICE; S.stats.spent = (S.stats.spent || 0) + RECIPE_PRICE;
  learnRecipe(id, '해상왕국 배에서 삼');
  changed();
  return `${FOODS[id].name} 레시피를 도감 「요리」에 적었어요.`;
}

/* ── 장면: 부두 (시안 port68.js — 배가 있을 때 / 없을 때 「다음 배」 표판) ── */
function portShip(g, K, T) {
  const { FB } = K, wl = FB - 6, night = q3Night(T) > 0.5;
  const H0 = '#6a4228', H1 = '#5a3420', H2 = '#8a5a34', TE = '#2a8a8a', CO = '#e8705a';
  for (const [mx, sx0, sx1, sy0, sy1] of [[70, 54, 86, 44, 84], [112, 98, 126, 60, 90]]) {   // 돛대 · 돛 (돛대는 활대에서 끝난다 — 십자 꼴이 생기지 않게 · 깃발은 고물 깃대에)
    const top = sy0 - 2;
    qF(g, mx, top, 2, wl - 30 - top, '#5a3a22'); qF(g, mx, top, 1, wl - 30 - top, '#7a5232');
    qF(g, sx0 - 1, sy0 - 2, sx1 - sx0 + 2, 2, '#5a3a22');
    for (let y = sy0; y < sy1; y++) { const b = Math.round(Math.sin((y - sy0) / (sy1 - sy0) * Math.PI) * 3); qF(g, sx0 + 1, y, sx1 - sx0 + b, 1, (y - sy0) % 9 === 8 ? '#d8ccb0' : '#f0e8d0'); qP(g, sx0 + 1, y, '#c8bca0'); qP(g, sx1 + b, y, '#c8bca0'); }
    if (mx === 70) { const cx = 70, cy = 66; for (let r = 0; r < 7; r++) for (let a = -60; a <= 60; a += 12) { const th = (a - 90) * Math.PI / 180; qP(g, Math.round(cx + Math.cos(th) * r), Math.round(cy + 3 + Math.sin(th) * r), r > 5 ? '#b8503a' : CO); } qF(g, cx - 2, cy + 3, 5, 2, '#b8503a'); }   // 산호 조개 문장
  }
  for (const [x0, y0, x1, y1] of [[71, 42, 150, wl - 36], [71, 42, 36, wl - 44], [113, 58, 150, wl - 36]]) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i += 2) qP(g, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), '#3a2a1a'); }
  qQ(g, [[30, wl - 34], [150, wl - 34], [156, wl - 40], [150, wl - 22], [138, wl], [40, wl], [30, wl - 16]], H0);   // 선체
  for (let y = wl - 30; y < wl; y += 4) qF(g, 34, y, 112, 1, H1);
  qF(g, 30, wl - 36, 122, 2, H2); qF(g, 30, wl - 36, 122, 1, '#a87a4a');
  qF(g, 32, wl - 22, 116, 3, TE); qF(g, 32, wl - 23, 116, 1, CO);
  for (const x of [60, 84, 108, 128]) { qDisc(g, x, wl - 14, 2, '#d8a838'); qDisc(g, x, wl - 14, 1, night ? '#f8d060' : '#1a2030'); }
  qQ(g, [[30, wl - 36], [56, wl - 36], [56, wl - 48], [30, wl - 50]], H0); qF(g, 30, wl - 50, 26, 2, H2);   // 고물 다락
  for (const x of [36, 44]) qF(g, x, wl - 46, 4, 5, night ? '#f8c050' : '#2a3040');
  qF(g, 150, wl - 42, 10, 1, '#5a3a22'); qF(g, 154, wl - 44, 6, 1, '#5a3a22');   // 이물 기움 돛대
  qF(g, 31, wl - 70, 1, 22, '#5a3a22');   // 고물 깃대 + 해상왕국 깃발 (청록 바탕 · 산호 조개)
  qF(g, 32, wl - 70, 12, 8, TE); qF(g, 32, wl - 70, 12, 1, '#4ab0b0'); qF(g, 36, wl - 67, 4, 3, CO); qP(g, 37, wl - 68, '#ffb0a0');
  for (const [lx, ly] of [[33, wl - 54], [148, wl - 40]]) { qF(g, lx - 2, ly, 5, 5, '#3a3a44'); qF(g, lx - 1, ly + 1, 3, 3, night ? '#f8c050' : '#8a7a5a'); }   // 뱃전 등
}
function portPier(g, K) {
  const { W, FB, H } = K;
  qF(g, 0, FB, W, H - FB, '#8a6a48');
  for (let y = FB + 4, i = 0; y < H; y += 5, i++) { qF(g, 0, y, W, 4, i % 2 ? '#7e6040' : '#94744e'); qF(g, 0, y + 4, W, 1, '#5a4430'); for (let x = (i * 13) % 24; x < W; x += 24) qF(g, x, y, 1, 4, '#5a4430'); }
  qF(g, 0, FB, W, 4, '#6a4a30'); qF(g, 0, FB, W, 1, '#a07a50');
  for (let x = 4; x < W; x += 26) { qF(g, x, FB - 10, 5, 12, '#5a3e28'); qF(g, x, FB - 10, 5, 1, '#7a5638'); qF(g, x + 1, FB - 7, 3, 1, '#c8b080'); }   // 말뚝 + 밧줄
}
const portHas = () => !!(S && S.port && S.port.ship);
const A3_PORT = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 84; return K; },
  sig: () => (portHas() ? 's' : 'e'),
  bg(g, K, T) {
    const { W, FB } = K, night = q3Night(T) > 0.5, hz = 122;
    q3Glass(g, 0, 0, W, hz, T, 11);
    const bands = night ? ['#1e3050', '#18284a', '#122040', '#0e1a36'] : ['#6aa4d4', '#4a86c0', '#3a6eaa', '#2a5a96'];
    bands.forEach((c, i) => qF(g, 0, hz + Math.round((FB - hz) * i / 4), W, Math.ceil((FB - hz) / 4) + 1, c));
    for (let y = hz + 3, i = 0; y < FB; y += 4, i++) for (let x = (i * 17) % 30; x < W; x += 30) qF(g, x, y, 6 + (i % 3) * 2, 1, night ? '#3a5a80' : '#9ac8ee');
    qQ(g, [[0, hz], [0, hz - 14], [10, hz - 18], [22, hz - 16], [34, hz - 10], [48, hz]], night ? '#1a2028' : '#4a5a5a');   // 먼 곶 · 등대
    qF(g, 20, hz - 34, 6, 18, '#f0ece4'); for (const y of [hz - 30, hz - 22]) qF(g, 20, y, 6, 3, '#c0392b'); qF(g, 19, hz - 38, 8, 4, '#3a3a44'); qF(g, 21, hz - 37, 4, 2, night ? '#ffe080' : '#a8b0b8');
    qQ(g, [[118, hz], [126, hz - 6], [140, hz - 8], [152, hz - 5], [160, hz - 3], [160, hz]], night ? '#182028' : '#5a6a6a');
  },
  house(g, K, T) {
    const { W, FB } = K, ship = portHas();
    if (ship) portShip(g, K, T);
    portPier(g, K);
    for (const [x, y, w, h] of [[6, FB + 16, 16, 12], [8, FB + 6, 12, 10], [24, FB + 20, 14, 10]]) { qF(g, x, y, w, h, '#a8783e'); qF(g, x, y, w, 2, '#c8985e'); qF(g, x, y + h - 1, w, 1, '#6a4422'); qF(g, x + 2, y + 4, w - 4, 1, '#7a5228'); }   // 상자
    for (const x of [W - 34, W - 22]) { qEll(g, x, FB + 22, 6, 8, '#7a4e2a'); qF(g, x - 6, FB + 17, 13, 1, '#3a3a44'); qF(g, x - 6, FB + 26, 13, 1, '#3a3a44'); qF(g, x - 3, FB + 15, 3, 14, '#9a6a3a'); }   // 통
    qF(g, W - 12, FB - 30, 2, 70, '#3a3a44'); qF(g, W - 16, FB - 34, 10, 6, '#3a3a44'); qF(g, W - 15, FB - 33, 8, 4, '#8a7a5a');   // 부두 등 기둥
    for (let i = 0; i < 6; i++) qEll(g, 52 + i, FB + 46, 7 - i, 2, i % 2 ? '#c8b080' : '#a89060');   // 감은 밧줄
    if (ship) { for (let i = 0; i < 14; i++) qF(g, 104 + Math.round(i * 0.5), FB - 34 + i * 3, 12, 2, i % 3 ? '#9a6a3a' : '#6a4422'); }   // 건널판
    else { qF(g, 98, FB + 4, 2, 26, '#5a3e28'); qF(g, 88, FB + 2, 22, 12, '#c8a070'); qF(g, 88, FB + 2, 22, 1, '#e0c090'); qF(g, 88, FB + 13, 22, 1, '#7a5228'); }   // 「다음 배」 표판 (글씨는 덧그림)
  },
  live(g, K, t, T) {
    const { W, FB } = K, night = q3Night(T) > 0.5, ship = portHas();
    for (let i = 0; i < 9; i++) { const x = Math.round((i * 37 + t * 6) % (W + 20)) - 10, y = 126 + (i * 11) % (FB - 132); if (ship && x > 28 && x < 158 && y > FB - 44) continue; qF(g, x, y, 3, 1, night ? '#5a7aa0' : '#e8f4ff'); }   // 반짝이는 물결
    for (let i = 0; i < 3; i++) { const x = Math.round((t * (8 + i * 3) + i * 60) % (W + 30)) - 15, y = 30 + i * 14 + Math.round(Math.sin(t * 2 + i) * 3), up = Math.floor(t * 4 + i) % 2; qP(g, x - 2, y - up, '#f0f0f0'); qP(g, x - 1, y - 1 + up, '#f0f0f0'); qP(g, x, y, '#d8d8e0'); qP(g, x + 1, y - 1 + up, '#f0f0f0'); qP(g, x + 2, y - up, '#f0f0f0'); }   // 갈매기
    if (ship) {
      qF(g, 76, FB + 28, 22, 10, '#8a5a30'); qF(g, 76, FB + 28, 22, 2, '#a87a4a'); for (let i = 0; i < 4; i++) { qF(g, 78 + i * 5, FB + 30, 4, 2, '#c8d4e0'); qP(g, 78 + i * 5, FB + 30, '#ffffff'); }   // 생선 상자
      qPeo('groom', g, true, 'idle', Math.floor(t * 1.2) % 2, 122, FB + 50, true);
      hqHitAdd(K, 28, FB - 100, 132, 96, { win: 'port' });
    }
    qPeo('cook', g, true, 'idle', Math.floor(t * 1.1 + 1) % 2, 40, FB + 60, false);
    const lamps = [[W - 11, FB - 30, 40, '#f8b048']]; if (ship) lamps.push([35, FB - 58, 34, '#f8b048'], [150, FB - 44, 30, '#f8b048']);
    q3Light(g, K, T, { amb: 0.02, ambN: 0.56, lamps, wins: [] }, t);
  }
};
HQS.port = A3_PORT;
FLOOR_TXT.port = () => { const P = portState(); return P.ship ? `「${PORT.ship}」 정박 중 · 오늘 밤 떠나요` : `해상왕국 배 · 다음 배 D-${Math.max(0, P.next - today())}`; };
// 배가 없을 때 표판 글씨 (캔버스 위 덧그림 · farm68.js hqExtra)
HQX.port = () => { const P = portState(); return P.ship ? '' : `<div class="hqx-sign">다음 배<br>D-${Math.max(0, P.next - today())}</div>`; };
HQX.place = el => {
  const sg = el.querySelector('.hqx-sign'); if (!sg || !HQ.cvs) return;
  const K = A3_PORT.geo(hqGeo(A3_PORT.zoom)), cr = HQ.cvs.getBoundingClientRect(), sr = el.getBoundingClientRect(), sc = cr.width / K.W;
  sg.style.left = Math.round(cr.left - sr.left + 99 * sc) + 'px'; sg.style.top = Math.round(cr.top - sr.top + (K.FB + 8) * sc) + 'px';
  sg.style.fontSize = Math.max(9, Math.round(4.6 * sc)) + 'px';
};

/* ── 항구 창 ── */
PANELS.port = () => {
  const P = portState(), v = P.ship;
  const cell = k => { const g = itemGrade(k); return `<span class="cell rq${g}" style="width:60px;height:60px;flex:none">${rqArt(iconURL(k), g, 2)}</span>`; };
  const head = `<div class="card${v ? ' hl' : ''}"><div class="row"><div class="grow"><div class="h">${PORT.king}의 배 <small>${PORT.ship}</small></div><div class="sub">${v ? `오늘 밤 떠나요 · 다음 배는 ${PORT.gap[0]} ~ ${PORT.gap[1]}일 뒤 (배가 오면 소식에 알려요)` : `지금은 배가 없어요 · 다음 배 D-${Math.max(0, P.next - today())} (${dayLabel(P.next)}쯤 새벽)`}</div></div></div>
    <div class="sub muted">항구는 처음부터 열려 있는 시설 — 해산물은 이 배에서만 살 수 있어요. 배는 하루만 머물러요.</div></div>`;
  if (!v) return head + `<div class="sec"><b>배가 오면</b><span>해산물 ${Object.keys(SEA68).length}가지 · 레시피</span></div><div class="list">${Object.keys(SEA68).map(k => `<div class="li dim">${cell(k)}<div class="grow stack"><span>${ITEMS[k].name} <span class="muted">해산물 · ${gradeName(itemGrade(k))}</span></span><span class="sub">${SEA68[k][3]} · 창고 ${S.inv[k] || 0}</span><span class="sub gold-t">${fmt(FOOD_PRICE[k])}G</span></div></div>`).join('')}</div>`;
  const rows = v.stock.map((o, i) => { const q5 = Math.max(1, Math.min(5, o.n)); return `<div class="li">${cell(o.it)}<div class="grow stack"><span>${ITEMS[o.it].name} <span class="muted">해산물 · ${gradeName(itemGrade(o.it))}</span></span><span class="sub">${SEA68[o.it][3]} · 창고 ${S.inv[o.it] || 0}</span><span class="sub gold-t">${fmt(o.price)}G · 남은 수 ${o.n}</span></div><div class="stack" style="gap:3px"><button type="button" class="btn sm gold" data-act="portbuy" data-i="${i}"${o.n > 0 && S.gold >= o.price ? '' : ' disabled'}>${o.n > 0 ? '사기' : '다 팔림'}</button><button type="button" class="btn sm" data-act="portbuy" data-i="${i}" data-q="5"${o.n > 1 && S.gold >= o.price * q5 ? '' : ' disabled'}>×${q5}</button></div></div>`; }).join('');
  const recs = recipesOfSea().map(id => { const known = knows(id); return `<div class="li"${known ? ' style="opacity:.55"' : ''}>${cell('rcp_' + id)}<div class="grow stack"><span>${FOODS[id].name} 레시피 <span class="muted">${known ? '이미 앎' : '사면 도감에 적힘'}</span></span><span class="sub">${needTxt(FOODS[id].need)}</span><span class="sub gold-t">${fmt(RECIPE_PRICE)}G</span></div><button type="button" class="btn sm${known ? '' : ' gold'}" data-act="portrcp" data-id="${id}"${known || S.gold < RECIPE_PRICE ? ' disabled' : ''}>${known ? '앎' : '사기'}</button></div>`; }).join('');
  return `${head}<div class="sec"><b>해산물</b><span>상하지 않아요</span></div><div class="list">${rows}</div>
    <div class="sec"><b>레시피</b><span>해산물이 들어가는 요리 · 하나에 ${fmt(RECIPE_PRICE)}G</span></div><div class="list">${recs}</div>`;
};
// 시설 창 맨 위: 항구 (처음부터 열린 시설)
function portCard() {
  const P = portState(), v = P.ship;
  return `<div class="card${v ? ' hl' : ''}"><div class="row"><div class="grow"><div class="h">항구 <small>처음부터 열림</small></div><div class="sub">${v ? `<span class="gold-t">${PORT.king}의 배 「${PORT.ship}」이(가) 와 있어요 · 오늘 밤 떠나요</span>` : `해상왕국 배가 ${PORT.gap[0]} ~ ${PORT.gap[1]}일마다 들어와요 · 다음 배 D-${Math.max(0, P.next - today())}`}</div></div><button type="button" class="btn sm gold" data-act="portopen">항구 ›</button></div></div>`;
}
const facPanel68 = PANELS.fac;
PANELS.fac = () => portCard() + facPanel68();
Object.assign(ACT_SFX, { portbuy: 'buy', portrcp: 'buy', farmharv: 'pot', farmall: 'pot', farmup: 'forge' });
Object.assign(ACT, {
  portopen: () => { openWin('port'); hqGo('port0', true); },
  portbuy: d => say(portBuy(+d.i, +d.q || 1)),
  portrcp: d => say(portRecipe(d.id))
});
