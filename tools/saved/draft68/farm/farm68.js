// 빌드 68 시안: 재배소 (비닐하우스) 장소 장면 — HQS에 잠깐 끼워 실제 본부 화면으로 찍는다. 게임에는 안 넣음.
const FARM = window.__FARM68 || { cur: 0, houses: [
  { lv: 2, plots: [['herb', 2], ['herb', 1], ['waterherb', 1], ['fireherb', 2], ['snowherb', 0], [null, 0]] },
  { lv: 1, plots: [['ethermoss', 1], ['bloodshroom', 0], ['herb', 2], [null, 0]] },
  null] };
// 약초 포기: kind · 크기 sz(키, 칸) · 자람 st 0 새싹 · 1 자라는 중 · 2 다 자람
function farmPlant(g, kind, x, y, sz, st, t, night) {
  const k = st === 0 ? 0.3 : st === 1 ? 0.65 : 1, h = Math.max(3, Math.round(sz * k));
  const sway = Math.round(Math.sin(t * 1.3 + x * 0.3) * (sz > 12 ? 1 : 0));
  const lw = sz > 16 ? 2 : 1, leaf = (lx, ly, len, dir, c1, c2) => { for (let i = 0; i < len; i++) { const px = lx + Math.round(dir * i * 0.7) + (i > len / 2 ? sway : 0), py = ly - i; qF(g, px, py, lw, 1, i % 3 ? c1 : c2); qP(g, px + (dir > 0 ? lw : -1), py, c2); } };
  if (st === 0) { const q = Math.max(1, Math.round(sz / 9)); qF(g, x, y - 2 * q, q, 2 * q, '#5aa83a'); qF(g, x - 2 * q, y - 3 * q, 2 * q, q, '#86cc56'); qF(g, x + q, y - 3 * q, 2 * q, q, '#86cc56'); return; }
  const G1 = '#4e9e3a', G2 = '#7ac458', GD = '#2e6a24';
  switch (kind) {
    case 'herb': for (let i = -2; i <= 2; i++) leaf(x + i, y, Math.round(h * (1 - Math.abs(i) * 0.18)), i * 0.6, i % 2 ? G1 : G2, GD); break;
    case 'waterherb': for (let i = -3; i <= 3; i += 2) leaf(x + i, y, h + 2 - Math.abs(i), i * 0.25, '#4a9ab8', '#2a6a88'); break;
    case 'snowherb': for (let i = -2; i <= 2; i++) leaf(x + i, y, Math.round(h * 0.9), i * 0.7, '#a8e0f8', '#6aa8c8'); if (st === 2) { qP(g, x - 2, y - h + 1, '#ffffff'); qP(g, x + 2, y - h + 2, '#ffffff'); } break;
    case 'fireherb': leaf(x - 2, y, Math.round(h * 0.6), -0.8, G1, GD); leaf(x + 2, y, Math.round(h * 0.6), 0.8, G2, GD); for (let i = 0; i < h; i++) qP(g, x + (i > h / 2 ? sway : 0), y - i, G1);
      if (st === 2) { const fx = x + sway, fy = y - h; qF(g, fx - 2, fy - 2, 5, 3, '#f08a3a'); qF(g, fx - 1, fy - 3, 3, 1, '#f8b060'); qP(g, fx, fy - 1, '#ffe080'); } break;
    case 'ethermoss': { const r = Math.max(2, Math.round(h * 0.45)); qEll(g, x, y - r + 1, r + 1, r, '#6aa8d8'); qEll(g, x - 1, y - r, r, r - 1, '#a8d8ff'); if (st === 2) for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; qP(g, Math.round(x + Math.cos(a) * (r + 2)), Math.round(y - r - 2 + Math.sin(a) * 2), '#e0f4ff'); } break; }
    case 'boltbranch': for (let i = 0; i < h; i++) { const px = x + ((i >> 1) % 2 ? 1 : -1); qP(g, px, y - i, i % 3 ? '#c8a830' : '#f0e04a'); if (i % 3 === 1) { qP(g, px + 2, y - i - 1, '#f0e04a'); qP(g, px - 2, y - i - 1, '#c8a830'); } } break;
    case 'bloodshroom': for (const [dx, s2] of [[-2, 0.7], [2, 1], [0, 0.55]]) { const hh = Math.max(2, Math.round(h * s2 * 0.7)), cx = x + dx; qF(g, cx, y - hh, 1, hh, '#e8dcc8'); qEll(g, cx, y - hh - 1, Math.max(1, Math.round(hh * 0.6)), Math.max(1, Math.round(hh * 0.35)), '#c03a3a'); qP(g, cx - 1, y - hh - 2, '#f07a6a'); } break;
    case 'moonflower': leaf(x - 1, y, Math.round(h * 0.6), -0.9, G1, GD); leaf(x + 1, y, Math.round(h * 0.6), 0.9, G2, GD); for (let i = 0; i < h; i++) qP(g, x, y - i, G1); if (st === 2) { qDisc(g, x, y - h - 1, 2, night ? '#ffffff' : '#e8e8ff'); qP(g, x, y - h - 1, '#f8f0a0'); } break;
    case 'mandrake': for (let i = -3; i <= 3; i++) leaf(x + i, y - 1, Math.round(h * 0.8 * (1 - Math.abs(i) * 0.12)), i * 0.9, i % 2 ? G1 : G2, GD); qEll(g, x, y, 3, 2, '#c8a870'); qP(g, x - 1, y - 1, '#e8d0a0'); break;
  }
  if (st === 2) { const bob = Math.round(Math.sin(t * 3 + x) * 1); qF(g, x - 1, y - h - 7 + bob, 3, 3, '#fff4b0'); qP(g, x, y - h - 6 + bob, '#c89a2a'); }   // 다 자람 표시 (작은 금빛 점)
}
const A3_FARM = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 128; return K; },
  bg(g, K, T) {
    const { W, FB } = K, cx = W >> 1, night = q3Night(T);
    q3Glass(g, 0, 0, W, FB + 30, T, 7);
    // 비닐: 우윳빛 막 + 주름 + 비스듬한 빛
    g.globalAlpha = 0.5 - night * 0.2; qF(g, 0, 0, W, FB + 30, night > 0.5 ? '#4a5a66' : '#e4eeea'); g.globalAlpha = 1;
    for (let x = 6; x < W; x += 11) { g.globalAlpha = 0.25; qF(g, x, 0, 1, FB + 30, '#ffffff'); g.globalAlpha = 1; }
    if (night < 0.6) for (let k = 0; k < 3; k++) for (let i = 0; i < 60; i++) { const x = 40 + k * 96 + i, y = i * 2 - 10; if (y > 0 && y < FB) { g.globalAlpha = 0.18; qF(g, x, y, 6, 2, '#ffffff'); g.globalAlpha = 1; } }
    // 끝벽 아치 + 문
    const ex = 40, ey = 52; qEll(g, cx, FB, ex, ey, night > 0.5 ? '#38464e' : '#cdd8d4'); qF(g, cx - ex, FB, ex * 2, 1, '#9aa8a8');
    qF(g, cx - 10, FB - 30, 20, 30, '#5e3a20'); qF(g, cx - 8, FB - 28, 16, 28, night > 0.5 ? '#202830' : '#8ab0c0'); qF(g, cx - 1, FB - 28, 2, 28, '#5e3a20'); qF(g, cx - 8, FB - 16, 16, 2, '#5e3a20');
    // 갈빗대(쇠 파이프 아치): 멀리서 가까이로 커진다
    for (let i = 0; i < 7; i++) {
      const f = 1 + 0.62 * Math.pow(i, 1.25), rx = ex * f, ry = ey * f, by = FB + i * i * 1.6 + i * 3, w = i < 2 ? 1 : i < 4 ? 2 : 3;
      for (let a = 0; a <= 180; a += 0.5) { const th = a * Math.PI / 180, x = Math.round(cx + Math.cos(th) * rx), y = Math.round(by - Math.sin(th) * ry); if (x < -4 || x > W + 4 || y < -4) continue; qF(g, x, y, w, w, a > 90 ? '#c8d4d8' : '#f0f6f8'); qP(g, x, y + w, '#7a8a90'); }
    }
    // 바닥: 흙 · 가운데 길 · 양옆 두둑
    qF(g, 0, FB, W, K.H - FB, '#5a4030');
    qQ(g, [[cx - 8, FB], [cx + 8, FB], [cx + 38, K.H], [cx - 38, K.H]], '#8a6e50');
    for (let y = FB + 4; y < K.H; y += 6) qF(g, cx - 6 - (y - FB) * 0.18, y, 3, 1, '#9a7e5e');
    for (const s of [-1, 1]) {
      qQ(g, [[cx + s * 10, FB + 2], [cx + s * 44, FB + 2], [cx + s * 190, K.H], [cx + s * 42, K.H]], '#6e4626'); qQ(g, [[cx + s * 12, FB + 3], [cx + s * 42, FB + 3], [cx + s * 182, K.H], [cx + s * 48, K.H]], '#3e2a1c');
      for (let k = 1; k < 9; k++) { const d = k / 9, y = Math.round(FB + 4 + (K.H - FB) * d * d), x0 = cx + s * (12 + 36 * d * d), x1 = cx + s * (42 + 140 * d * d); qF(g, Math.min(x0, x1), y, Math.abs(x1 - x0), 1, '#4a3424'); }
    }
  },
  house(g, K, T) {
    const { W, FB } = K, cx = W >> 1;
    for (const [hx0, hy, sd] of [[cx - 56, FB - 84, 1], [cx - 28, FB - 108, 2], [cx + 28, FB - 108, 3], [cx + 56, FB - 84, 4]]) {   // 매단 화분 + 늘어진 덩굴
      qF(g, hx0, K.top + 4, 1, hy - K.top - 4, '#6a6a74'); qF(g, hx0 - 5, hy, 11, 6, '#b4643a'); qF(g, hx0 - 5, hy, 11, 2, '#d08050'); qF(g, hx0 - 5, hy + 5, 11, 1, '#7a3a1e');
      const r = rng(sd); for (let i = 0; i < 5; i++) { const vx = hx0 - 5 + Math.floor(r() * 11), vl = 3 + Math.floor(r() * 10); for (let k = 0; k < vl; k++) qP(g, vx + (k % 4 === 3 ? 1 : 0), hy + 6 + k, k % 2 ? '#4e9e3a' : '#7ac458'); }
      for (let i = -4; i <= 4; i += 2) qF(g, hx0 + i, hy - 3 - (i % 4 === 0 ? 1 : 0), 2, 3, '#5aa83a');
    }
    const rx0 = 4, ry0 = FB - 30;   // 모종 선반 (두 칸)
    for (const yy of [ry0, ry0 + 14]) { qF(g, rx0, yy, 34, 3, '#8a5a30'); qF(g, rx0, yy, 34, 1, '#b08048'); for (let x = rx0 + 2; x < rx0 + 32; x += 6) { qF(g, x, yy - 4, 5, 4, '#6a4a32'); qP(g, x + 2, yy - 6, '#7ac458'); qP(g, x + 1, yy - 5, '#5aa83a'); qP(g, x + 3, yy - 5, '#5aa83a'); } }
    qF(g, rx0, ry0, 2, 30, '#6e4626'); qF(g, rx0 + 32, ry0, 2, 30, '#6e4626');
    for (const [x, y] of [[cx - 42, FB - 52], [cx + 42, FB - 52]]) { qF(g, x, K.top + 4, 1, y - K.top - 4, '#5a5a66'); }   // 매단 줄
    qF(g, W - 26, FB - 8, 20, 13, '#4a6a8a'); qF(g, W - 26, FB - 8, 20, 2, '#6a8aaa'); qEll(g, W - 16, FB - 8, 10, 2, '#2a4a6a');   // 물통
    for (let i = 0; i < 3; i++) { qF(g, W - 48 + i * 7, FB - 3, 5, 5, '#b4643a'); qF(g, W - 48 + i * 7, FB - 3, 5, 1, '#d08050'); }   // 빈 화분
  },
  live(g, K, t, T) {
    const { W, FB } = K, cx = W >> 1, night = q3Night(T) > 0.5, H = FARM.houses[FARM.cur] || FARM.houses[0];
    const n = H.plots.length, per = n / 2;
    const yb = K.bot - 36, span = K.H - FB;
    H.plots.forEach(([kind, st], i) => {
      const s = i < per ? -1 : 1, j = i % per, d = Math.pow((j + 0.9) / (per + 0.4), 1.25);
      const y = Math.round(FB + 10 + (yb - FB - 10) * d), sz = Math.round(6 + 15 * (y - FB) / (yb - FB)), x = Math.max(sz + 4, Math.min(W - sz - 4, Math.round(cx + s * (27 + 84 * (y - FB) / span))));
      qEll(g, x, y, Math.round(sz * 1.5), Math.max(2, Math.round(sz * 0.28)), '#2e2016'); qEll(g, x - 1, y - 1, Math.round(sz * 1.3), Math.max(1, Math.round(sz * 0.2)), '#4a3426');   // 밭 한 칸 (흙 둔덕)
      if (!kind) { for (let k = -sz; k < sz; k += 3) qP(g, x + k, y - 1, '#6a4a32'); return; }
      for (const k of [-1, 1, 0]) farmPlant(g, kind, x + k * Math.round(sz * 0.75), y + (k === 0 ? 1 : -1) * Math.round(sz * 0.1), sz, st, t + k, night);
    });
    for (const [lx, ly] of [[cx - 42, FB - 52], [cx + 42, FB - 52]]) { qF(g, lx - 4, ly, 9, 4, '#3a3a44'); qF(g, lx - 3, ly + 4, 7, 2, night ? '#f8b048' : '#8a6a3a'); }   // 매단 등
    qPeo('groom', g, true, 'idle', Math.floor(t * 1.2) % 2, cx + 4, FB + 62, true);
    const wx = cx + 16, wy = FB + 48; qF(g, wx, wy, 8, 6, '#7a8a98'); qF(g, wx, wy, 8, 1, '#a8b8c4'); qF(g, wx + 8, wy + 1, 4, 1, '#7a8a98'); qF(g, wx + 11, wy, 1, 1, '#7a8a98');   // 물뿌리개
    if (Math.floor(t * 2) % 3 === 0) for (let i = 0; i < 4; i++) qP(g, wx + 13 + i, wy + 2 + i * 2, '#a8d8f0');
    q3Light(g, K, T, { amb: 0.08, ambN: 0.5, lamps: [[cx - 42, FB - 46, 44, '#f8a040'], [cx + 42, FB - 46, 44, '#f8a040']], wins: [], soft: [[cx, FB - 40, 120, 0.6 * (1 - q3Night(T))]] }, t);
  }
};
HQS.farm = A3_FARM; FLOOR_INFO.farm = { name: '재배소', win: 'b:kitchen' };
if (!window.__farmPatched) {
  window.__farmPatched = 1;
  hqPlaces = (orig => () => { const L = orig(); const i = L.findIndex(f => f.id === 'pen'); const f = { id: 'farm', key: 'farm0', under: 0, name: '재배소' }; L.splice(i >= 0 ? i + 1 : L.length, 0, f); return L; })(hqPlaces);
}
window.FARM68 = FARM;
JSON.stringify({ ok: 1, places: hqPlaces().map(f => f.key) })
