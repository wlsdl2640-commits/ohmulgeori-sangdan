// 빌드 68 시안: 항구 (처음부터 열린 시설 · 해상왕국 배가 찾아온다) — HQS에 잠깐 끼워 실제 본부 화면으로 찍는다. 게임에는 안 넣음.
const PORT = window.PORT68 || (window.PORT68 = { ship: true });
function portShip(g, K, T) {
  const { FB } = K, wl = FB - 6, night = q3Night(T) > 0.5;
  const H0 = '#6a4228', H1 = '#5a3420', H2 = '#8a5a34', TE = '#2a8a8a', CO = '#e8705a';
  // 돛대 · 돛 (돛대는 활대에서 끝난다 — 십자 꼴이 생기지 않게 · 깃발은 고물 깃대에)
  for (const [mx, top0, sx0, sx1, sy0, sy1] of [[70, 40, 54, 86, 44, 84], [112, 56, 98, 126, 60, 90]]) {
    const top = sy0 - 2;   // 돛대 끝 = 활대 (위로 삐져나오면 십자 꼴)
    qF(g, mx, top, 2, wl - 30 - top, '#5a3a22'); qF(g, mx, top, 1, wl - 30 - top, '#7a5232');
    qF(g, sx0 - 1, sy0 - 2, sx1 - sx0 + 2, 2, '#5a3a22');
    for (let y = sy0; y < sy1; y++) { const b = Math.round(Math.sin((y - sy0) / (sy1 - sy0) * Math.PI) * 3); qF(g, sx0 + 1, y, sx1 - sx0 + b, 1, (y - sy0) % 9 === 8 ? '#d8ccb0' : '#f0e8d0'); qP(g, sx0 + 1, y, '#c8bca0'); qP(g, sx1 + b, y, '#c8bca0'); }
    if (mx === 70) { const cx = 70, cy = 66; for (let r = 0; r < 7; r++) for (let a = -60; a <= 60; a += 12) { const th = (a - 90) * Math.PI / 180; qP(g, Math.round(cx + Math.cos(th) * r), Math.round(cy + 3 + Math.sin(th) * r), r > 5 ? '#b8503a' : CO); } qF(g, cx - 2, cy + 3, 5, 2, '#b8503a'); }   // 산호 조개 문장
  }
  for (const [x0, y0, x1, y1] of [[71, 42, 150, wl - 36], [71, 42, 36, wl - 44], [113, 58, 150, wl - 36]]) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i += 2) qP(g, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), '#3a2a1a'); }
  // 선체
  qQ(g, [[30, wl - 34], [150, wl - 34], [156, wl - 40], [150, wl - 22], [138, wl], [40, wl], [30, wl - 16]], H0);
  for (let y = wl - 30; y < wl; y += 4) qF(g, 34, y, 112, 1, H1);
  qF(g, 30, wl - 36, 122, 2, H2); qF(g, 30, wl - 36, 122, 1, '#a87a4a');
  qF(g, 32, wl - 22, 116, 3, TE); qF(g, 32, wl - 23, 116, 1, CO);
  for (const x of [60, 84, 108, 128]) { qDisc(g, x, wl - 14, 2, '#d8a838'); qDisc(g, x, wl - 14, 1, night ? '#f8d060' : '#1a2030'); }
  qQ(g, [[30, wl - 36], [56, wl - 36], [56, wl - 48], [30, wl - 50]], H0); qF(g, 30, wl - 50, 26, 2, H2);   // 고물 다락
  for (const x of [36, 44]) qF(g, x, wl - 46, 4, 5, night ? '#f8c050' : '#2a3040');
  qF(g, 150, wl - 42, 10, 1, '#5a3a22'); qF(g, 154, wl - 44, 6, 1, '#5a3a22');   // 이물 기움 돛대
  qF(g, 31, wl - 70, 1, 22, '#5a3a22');   // 고물 깃대 + 해상왕국 깃발 (청록 바탕 · 산호 조개)
  qF(g, 32, wl - 70, 12, 8, TE); qF(g, 32, wl - 70, 12, 1, '#4ab0b0'); qF(g, 36, wl - 67, 4, 3, CO); qP(g, 37, wl - 68, '#ffb0a0');
  // 뱃전 등
  for (const [lx, ly] of [[33, wl - 54], [148, wl - 40]]) { qF(g, lx - 2, ly, 5, 5, '#3a3a44'); qF(g, lx - 1, ly + 1, 3, 3, night ? '#f8c050' : '#8a7a5a'); }
  return wl;
}
function portPier(g, K, T) {
  const { W, FB, H } = K;
  qF(g, 0, FB, W, H - FB, '#8a6a48');
  for (let y = FB + 4, i = 0; y < H; y += 5, i++) { qF(g, 0, y, W, 4, i % 2 ? '#7e6040' : '#94744e'); qF(g, 0, y + 4, W, 1, '#5a4430'); for (let x = (i * 13) % 24; x < W; x += 24) qF(g, x, y, 1, 4, '#5a4430'); }
  qF(g, 0, FB, W, 4, '#6a4a30'); qF(g, 0, FB, W, 1, '#a07a50');
  for (let x = 4; x < W; x += 26) { qF(g, x, FB - 10, 5, 12, '#5a3e28'); qF(g, x, FB - 10, 5, 1, '#7a5638'); qF(g, x + 1, FB - 7, 3, 1, '#c8b080'); }   // 말뚝 + 밧줄
}
const A3_PORT = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 84; return K; },
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
    const { W, FB } = K;
    if (PORT.ship) portShip(g, K, T);
    portPier(g, K, T);
    for (const [x, y, w, h] of [[6, FB + 16, 16, 12], [8, FB + 6, 12, 10], [24, FB + 20, 14, 10]]) { qF(g, x, y, w, h, '#a8783e'); qF(g, x, y, w, 2, '#c8985e'); qF(g, x, y + h - 1, w, 1, '#6a4422'); qF(g, x + 2, y + 4, w - 4, 1, '#7a5228'); }   // 상자
    for (const x of [W - 34, W - 22]) { qEll(g, x, FB + 22, 6, 8, '#7a4e2a'); qF(g, x - 6, FB + 17, 13, 1, '#3a3a44'); qF(g, x - 6, FB + 26, 13, 1, '#3a3a44'); qF(g, x - 3, FB + 15, 3, 14, '#9a6a3a'); }   // 통
    qF(g, W - 12, FB - 30, 2, 70, '#3a3a44'); qF(g, W - 16, FB - 34, 10, 6, '#3a3a44'); qF(g, W - 15, FB - 33, 8, 4, '#8a7a5a');   // 부두 등 기둥
    for (let i = 0; i < 6; i++) qEll(g, 52 + i, FB + 46, 7 - i, 2, i % 2 ? '#c8b080' : '#a89060');   // 감은 밧줄
    if (PORT.ship) { for (let i = 0; i < 14; i++) qF(g, 104 + Math.round(i * 0.5), FB - 34 + i * 3, 12, 2, i % 3 ? '#9a6a3a' : '#6a4422'); }   // 건널판
    else { qF(g, 98, FB + 4, 2, 26, '#5a3e28'); qF(g, 88, FB + 2, 22, 12, '#c8a070'); qF(g, 88, FB + 2, 22, 1, '#e0c090'); qF(g, 88, FB + 13, 22, 1, '#7a5228'); }   // 「다음 배」 표판
  },
  live(g, K, t, T) {
    const { W, FB } = K, night = q3Night(T) > 0.5;
    for (let i = 0; i < 9; i++) { const x = Math.round((i * 37 + t * 6) % (W + 20)) - 10, y = 126 + (i * 11) % (FB - 132); if (PORT.ship && x > 28 && x < 158 && y > FB - 44) continue; qF(g, x, y, 3, 1, night ? '#5a7aa0' : '#e8f4ff'); }   // 반짝이는 물결
    for (let i = 0; i < 3; i++) { const x = Math.round((t * (8 + i * 3) + i * 60) % (W + 30)) - 15, y = 30 + i * 14 + Math.round(Math.sin(t * 2 + i) * 3), up = Math.floor(t * 4 + i) % 2; qP(g, x - 2, y - up, '#f0f0f0'); qP(g, x - 1, y - 1 + up, '#f0f0f0'); qP(g, x, y, '#d8d8e0'); qP(g, x + 1, y - 1 + up, '#f0f0f0'); qP(g, x + 2, y - up, '#f0f0f0'); }   // 갈매기
    if (PORT.ship) {
      qF(g, 76, FB + 28, 22, 10, '#8a5a30'); qF(g, 76, FB + 28, 22, 2, '#a87a4a'); for (let i = 0; i < 4; i++) { qF(g, 78 + i * 5, FB + 30, 4, 2, '#c8d4e0'); qP(g, 78 + i * 5, FB + 30, '#ffffff'); }   // 생선 상자
      qPeo('groom', g, true, 'idle', Math.floor(t * 1.2) % 2, 122, FB + 50, true);
    }
    qPeo('cook', g, true, 'idle', Math.floor(t * 1.1 + 1) % 2, 40, FB + 60, false);
    const lamps = [[W - 11, FB - 30, 40, '#f8b048']]; if (PORT.ship) lamps.push([35, FB - 58, 34, '#f8b048'], [150, FB - 44, 30, '#f8b048']);
    q3Light(g, K, T, { amb: 0.02, ambN: 0.56, lamps, wins: [] }, t);
  }
};
HQS.port = A3_PORT; FLOOR_INFO.port = { name: '항구', win: 'b:kitchen' };
if (!window.__portPatched) {
  window.__portPatched = 1;
  hqPlaces = (orig => () => { const L = orig(); const i = L.findIndex(f => f.id === 'tavern'); L.splice(i >= 0 ? i + 1 : L.length, 0, { id: 'port', key: 'port0', under: 0, name: '항구' }); return L; })(hqPlaces);
}
JSON.stringify({ ok: 1, places: hqPlaces().map(f => f.key) })
