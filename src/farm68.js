/* ───────── 빌드 65 넷째 묶음: 재배소 (비닐하우스, 최대 3동) ─────────
   시안 tools/saved/draft68/farm (사용자 11-12 18:55 「재배소 · 비닐하우스 · 최대 3동 · 아래 단추로 넘김」 · 19:57 「채소도 기르게. 1개를 심으면 3~5개」 · 20:34 「다 넣어」).
   상태 S.farm = { cur: 보는 동, auto: 거두면 다시 심기, houses: [{ lv: 1 ~ 3, plots: [null | { k: 모종, at: 심은 때(S.t), ready: 다 자라는 때(S.t) }] }] }.
   동 수 = S.bld.farm (시설 「짓기」로 한 동씩 · 2동 C랭크 · 3동 A랭크). 자라는 시간은 게임 시계(S.t)로 센다 — 게임을 켜 둔 동안 자란다. */
function farmState() {
  const F = S.farm || (S.farm = { cur: 0, auto: 1, houses: [] });
  F.houses = F.houses || [];
  const n = Math.min(FARM.n, S.bld.farm || 0);
  while (F.houses.length < n) F.houses.push({ lv: 1, plots: [] });
  F.houses.forEach(h => { h.lv = Math.max(1, Math.min(3, h.lv || 1)); h.plots = h.plots || []; while (h.plots.length < FARM.plots[h.lv - 1]) h.plots.push(null); });
  if (!(F.cur >= 0 && F.cur < F.houses.length)) F.cur = 0;
  return F;
}
const farmFrac = P => (P ? Math.max(0, (S.t - P.at) / Math.max(1, P.ready - P.at)) : 0);
const farmIsReady = P => !!P && S.t >= P.ready;
const farmReady = h => (h ? h.plots.filter(farmIsReady).length : 0);
const farmReadyAll = () => (S.farm && S.farm.houses ? S.farm.houses.reduce((n, h) => n + farmReady(h), 0) : 0);
const farmGet = k => (ITEMS[k].veg ? FARM.vegGet : FARM.herbGet[herbTier(k)]);
const farmGetTxt = k => { const [a, b] = farmGet(k); return a === b ? `${a}개` : `${a}~${b}개`; };
const FARM_TIER_TXT = ['하급 약초', '중급 약초', '최상급 약초'];
const farmKindTxt = k => (ITEMS[k].veg ? (VEG_FROM[k] === 'hargen' ? '하르겐 채소' : `${KINGDOMS[VEG_FROM[k]].name} 채소`) : FARM_TIER_TXT[herbTier(k)]);
function farmLeftTxt(P) {
  const h = Math.max(1, Math.ceil((P.ready - S.t) / DAY_SEC * 24));
  return h >= 24 ? `${Math.floor(h / 24)}일${h % 24 ? ` ${h % 24}시간` : ''}` : `${h}시간`;
}
const farmTierNames = t => Object.keys(HERB_TIER).filter(k => HERB_TIER[k] === t && ITEMS[k]).map(k => ITEMS[k].name).join(' · ');
// 심기: 창고의 그 약초 · 채소 하나가 모종
function farmPlant(hi, i, k) {
  const F = farmState(), H = F.houses[hi];
  if (!H) return '재배소가 없어요.';
  if (!farmable(k)) return '심을 수 없는 것이에요.';
  if (H.lv < farmLvNeed(k)) return `${ITEMS[k].name}은(는) 재배소 Lv${farmLvNeed(k)}부터 심어요.`;
  if ((S.inv[k] || 0) < 1) return `${ITEMS[k].name}이(가) 창고에 없어요.`;
  if (i == null || H.plots[i]) i = H.plots.findIndex(p => !p);
  if (i < 0) return '빈 밭이 없어요.';
  addTo(S.inv, k, -1);
  H.plots[i] = { k, at: S.t, ready: S.t + farmDays(k) * DAY_SEC };
  changed(); return '';
}
// 거두기: 하급 3 · 중급 2 ~ 3 · 최상급 1 ~ 2 · 채소 3 ~ 5 (상단에 둔 약초 펫만큼 더) · 「거두면 다시 심기」면 하나를 다시 심는다
function farmHarvest(hi, i, quiet) {
  const F = farmState(), H = F.houses[hi], P = H && H.plots[i];
  if (!farmIsReady(P)) return '';
  if (!roomItem(P.k)) return WH_FULL;
  const [a, b] = farmGet(P.k), x = ri(a, b) * (1 + petHome('herb'));
  const n = Math.floor(x) + (rnd() < x - Math.floor(x) ? 1 : 0);
  addTo(S.inv, P.k, n); H.plots[i] = null;
  S.stats.farmed = (S.stats.farmed || 0) + n;
  if (F.auto && H.lv >= farmLvNeed(P.k) && (S.inv[P.k] || 0) > 0) { addTo(S.inv, P.k, -1); H.plots[i] = { k: P.k, at: S.t, ready: S.t + farmDays(P.k) * DAY_SEC }; }
  if (!quiet) HOOKS.toast(`${ITEMS[P.k].name} ${n}개를 거뒀다${H.plots[i] ? ' · 하나를 다시 심었다' : ''}`);
  changed(); return '';
}
function farmHarvestAll() {
  const F = farmState(), got = {};
  for (let hi = 0; hi < F.houses.length; hi++) F.houses[hi].plots.forEach((P, i) => { if (!farmIsReady(P)) return; const k = P.k, n0 = S.inv[k] || 0; if (farmHarvest(hi, i, true) === WH_FULL) return; got[k] = (got[k] || 0) + (S.inv[k] || 0) - n0 + (F.houses[hi].plots[i] ? 1 : 0); });
  const keys = Object.keys(got);
  if (!keys.length) return farmReadyAll() ? WH_FULL : '다 자란 밭이 없어요.';
  HOOKS.toast(`거뒀다: ${keys.map(k => `${ITEMS[k].name} ${got[k]}`).join(' · ')}`);
  return '';
}
function farmUp(hi) {
  const F = farmState(), H = F.houses[hi];
  if (!H) return '';
  if (H.lv >= 3) return '더 올릴 수 없어요.';
  const c = FARM.up[H.lv];
  if (S.gold < c) return '돈이 모자라요.';
  S.gold -= c; S.stats.spent = (S.stats.spent || 0) + c; H.lv++;
  farmState();
  log(`재배소 ${hi + 1}동을 Lv${H.lv}로 강화했다 (밭 ${H.plots.length}칸).`, 'good');
  changed(); return '';
}

/* ── 장면: 비닐하우스 안 (시안 farm68.js를 실제 밭으로) ── */
const FARM_G = ['#4e9e3a', '#7ac458', '#2e6a24'];
function farmLeaf(g, lx, ly, len, dir, c1, c2, lw, sway) { for (let i = 0; i < len; i++) { const px = lx + Math.round(dir * i * 0.7) + (i > len / 2 ? sway : 0), py = ly - i; qF(g, px, py, lw, 1, i % 3 ? c1 : c2); qP(g, px + (dir > 0 ? lw : -1), py, c2); } }
// 약초 포기 (시안 그대로): st 0 새싹 · 1 자라는 중 · 2 다 자람
function farmHerbPx(g, kind, x, y, sz, st, t, night) {
  const k = st === 1 ? 0.65 : 1, h = Math.max(3, Math.round(sz * k)), sway = Math.round(Math.sin(t * 1.3 + x * 0.3) * (sz > 12 ? 1 : 0)), lw = sz > 16 ? 2 : 1;
  const leaf = (lx, ly, len, dir, c1, c2) => farmLeaf(g, lx, ly, len, dir, c1, c2, lw, sway);
  const [G1, G2, GD] = FARM_G;
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
    default: for (let i = -2; i <= 2; i++) leaf(x + i, y, Math.round(h * 0.8), i * 0.6, G1, GD);
  }
}
// 채소 포기 (빌드 65: 11-12 19:57 「채소도 기르게」): 다 자라면 열매 · 뿌리 머리가 보인다
function farmVegPx(g, kind, x, y, sz, st, t) {
  const k = st === 1 ? 0.65 : 1, h = Math.max(3, Math.round(sz * k)), sway = Math.round(Math.sin(t * 1.3 + x * 0.3) * (sz > 12 ? 1 : 0)), lw = sz > 16 ? 2 : 1, ripe = st === 2;
  const leaf = (lx, ly, len, dir, c1, c2) => farmLeaf(g, lx, ly, len, dir, c1, c2, lw, sway);
  const [G1, G2, GD] = FARM_G, u = Math.max(1, Math.round(sz / 8));
  const stake = () => { qF(g, x, y - h - 2, 1, h + 2, '#8a6a3a'); qP(g, x, y - h - 2, '#b08a50'); };
  switch (kind) {
    case 'hg_potato': {   // 감자: 줄기마다 작은 잎이 마주 난 덤불 · 흰 꽃 · 흙 위로 감자
      for (const [dx, f, d] of [[-1, 0.75, -0.9], [0, 0.95, -0.15], [1, 0.85, 0.7], [0, 0.6, 1.2]]) {
        const len = Math.max(2, Math.round(h * f));
        for (let j = 0; j < len; j++) { const px = x + dx + Math.round(d * j * 0.6) + (j > len / 2 ? sway : 0), py = y - 1 - j; qP(g, px, py, '#4e8a34'); if (j % 2 === 1) { qF(g, px - 2, py, 2, 1, j % 4 === 1 ? G2 : G1); qF(g, px + 1, py - 1, 2, 1, j % 4 === 1 ? G1 : G2); } }
        if (ripe) { const tx = x + dx + Math.round(d * len * 0.6) + sway, ty = y - len; qP(g, tx, ty - 1, '#f4f2ea'); qP(g, tx - 1, ty, '#e8e4f0'); qP(g, tx + 1, ty, '#e8e4f0'); qP(g, tx, ty, '#e8c040'); }
      }
      if (ripe) { qEll(g, x - Math.max(2, u + 1), y + 1, u + 1, u, '#c8a060'); qP(g, x - Math.max(2, u + 1), y, '#e0c080'); qEll(g, x + Math.max(2, u + 1), y + 1, u, u, '#b08a4a'); }
      break;
    }
    case 'hg_onion':   // 양파: 곧게 선 대롱 잎 · 땅 위 둥근 머리
      for (const [dx, f] of [[-2, 0.8], [-1, 1], [1, 0.9], [2, 0.7]]) for (let i = 0; i < Math.round(h * f); i++) qP(g, x + dx + (i > h * 0.6 ? Math.sign(dx) : 0), y - 2 - i, i % 3 ? '#3e8a3a' : '#5aa83a');
      qEll(g, x, y - 1, Math.max(2, u + 1), Math.max(1, u), ripe ? '#d0883a' : '#c8a870'); qP(g, x - 1, y - 2, '#e8a860');
      break;
    case 'hg_carrot':   // 당근: 깃털 잎 부채 · 주황 머리
      for (let i = -3; i <= 3; i++) { const len = Math.round(h * (1 - Math.abs(i) * 0.1)); for (let j = 0; j < len; j++) { const px = x + Math.round(i * j * 0.35) + (j > len / 2 ? sway : 0); qP(g, px, y - 1 - j, j % 2 ? '#7ac458' : '#5aa83a'); if (j % 3 === 2) qP(g, px + (i < 0 ? -1 : 1), y - 1 - j, '#a8e07a'); } }
      qF(g, x - u, y - 1, u * 2 + 1, Math.max(2, u + 1), ripe ? '#e8802a' : '#c8803a'); qP(g, x - u, y - 1, '#f8a050');
      break;
    case 'hg_cabbage': {   // 양배추: 둥근 통 · 겹잎
      const r = Math.max(2, Math.round(h * (ripe ? 0.55 : 0.45)));
      qEll(g, x, y - r + 1, r + 2, r, '#3e8a34'); qEll(g, x, y - r, r, r - 1, '#6ab84a'); qEll(g, x, y - r - 1, Math.max(1, r - 2), Math.max(1, r - 2), '#a8d878');
      for (let i = -r + 1; i < r; i += 3) qP(g, x + i, y - r + 1, '#2e6a24'); qP(g, x - 1, y - r - 2, '#d8f0b0');
      break;
    }
    case 'in_pea':   // 완두: 버팀대를 감고 오르는 덩굴 · 꼬투리
      stake();
      for (let i = 0; i < h; i++) { const px = x + ((i >> 1) % 2 ? 1 : -1); qP(g, px, y - i, i % 3 ? '#5aa83a' : '#86cc56'); if (i % 4 === 1) { qP(g, px + (px > x ? 1 : -1), y - i, '#7ac458'); qP(g, px + (px > x ? 2 : -2), y - i - 1, '#4e9e3a'); } }
      if (ripe) for (const [dx, dy] of [[-2, 0.35], [2, 0.6], [-2, 0.8]]) { const py = Math.round(y - h * dy); qF(g, x + dx, py, 1, 3, '#5aa83a'); qP(g, x + dx, py, '#a8e07a'); }
      break;
    case 'in_turnip':   // 순무: 넓은 잎 · 보랏빛 어깨의 흰 뿌리
      leaf(x - 1, y - 1, Math.round(h * 0.9), -0.7, G1, GD); leaf(x + 1, y - 1, Math.round(h * 0.9), 0.7, G2, GD); leaf(x, y - 1, h, 0.1, G1, GD);
      qEll(g, x, y, Math.max(2, u + 1), Math.max(2, u + 1), '#eeeae2'); qF(g, x - u - 1, y - u - 1, u * 2 + 3, Math.max(1, u), ripe ? '#9a4a9a' : '#b88ab8'); qP(g, x - 1, y - 1, '#ffffff');
      break;
    case 'fr_tomato':   // 토마토: 버팀대 · 잎 · 붉은 열매
      stake();
      for (let i = 0; i < h; i += 2) { leaf(x, y - i, Math.max(2, Math.round(h * 0.25)), i % 4 ? 1.1 : -1.1, G1, GD); }
      if (ripe) for (const [dx, dy] of [[-3, 0.3], [3, 0.5], [-2, 0.7]]) { const py = Math.round(y - h * dy), r = Math.max(1, u); qDisc(g, x + dx, py, r, '#d83a2a'); qP(g, x + dx - (r > 1 ? 1 : 0), py - r + (r > 1 ? 1 : 0), '#f87a5a'); qP(g, x + dx, py - r, '#3e8a3a'); }
      else if (st === 1) qDisc(g, x + 2, Math.round(y - h * 0.5), 1, '#8ac04a');
      break;
    case 'fr_olive': {   // 올리브: 작은 나무 · 은빛 잎 · 열매
      const th = Math.max(2, Math.round(h * 0.45)), r = Math.max(2, Math.round(h * 0.42));
      qF(g, x, y - th, lw + 1, th, '#6e4626'); qP(g, x, y - th, '#8a5a34');
      qEll(g, x, y - th - r + 2, r + 1, r, '#5a6a34'); qEll(g, x - 1, y - th - r + 1, r, r - 1, '#8a9a5a'); qEll(g, x - 2, y - th - r, Math.max(1, r - 2), Math.max(1, r - 3), '#a8b880');
      if (ripe) for (const [dx, dy] of [[-r + 1, 0], [1, 1], [r - 1, -1]]) qF(g, x + dx, y - th - r + 2 + dy, 1, 2, '#3a4a1a');
      break;
    }
    case 'el_lettuce': {   // 상추: 느슨한 잎 송이 · 이슬
      const r = Math.max(2, Math.round(h * 0.5));
      qEll(g, x, y - r + 1, r + 2, r - 1, '#4e9e3a'); qEll(g, x, y - r, r, r - 1, '#8ad06a');
      for (let i = -r - 1; i <= r + 1; i += 2) qP(g, x + i, y - r - ((i + r) % 4 ? 0 : 1), '#b8e890');
      qEll(g, x, y - r - 1, Math.max(1, r - 2), Math.max(1, r - 3), '#c8f0a0'); if (ripe) qP(g, x + 1, y - r - 2, '#ffffff');
      break;
    }
    case 'el_mush':   // 은버섯: 둥근 갓 · 굵은 대 (갓 아래 그늘)
      for (const [dx, s2] of [[-2, 0.62], [2, 0.9]]) {
        const hh = Math.max(2, Math.round(h * s2 * 0.55)), cx = x + dx, sw = Math.max(1, Math.round(hh * 0.3)), cw = Math.max(2, Math.round(hh * 0.75)), chh = Math.max(1, Math.round(hh * 0.5));
        qF(g, cx - (sw >> 1), y - hh, sw, hh, '#e8e4f0'); qP(g, cx - (sw >> 1), y - hh + 1, '#ffffff');
        for (let yy = 0; yy <= chh; yy++) { const w = Math.round(cw * Math.sqrt(Math.max(0, 1 - (yy / (chh + 0.5)) ** 2))); qF(g, cx - w, y - hh - yy, w * 2 + 1, 1, yy === 0 ? '#8a8aa8' : yy < chh * 0.5 ? (ripe ? '#c0c0dc' : '#a0a0bc') : (ripe ? '#dcdcf4' : '#b8b8d0')); }
        qP(g, cx - Math.max(1, cw >> 1), y - hh - Math.max(1, chh - 1), '#ffffff');
      }
      if (ripe && Math.floor(t * 2 + x) % 4 === 0) qP(g, x + 4, y - h + 1, '#ffffff');
      break;
    case 'dw_beet':   // 비트: 붉은 줄기의 잎 · 붉은 뿌리 머리
      for (let i = -2; i <= 2; i++) leaf(x + i, y - 1, Math.round(h * (1 - Math.abs(i) * 0.16)), i * 0.6, i % 2 ? G1 : '#9a1a3a', GD);
      qEll(g, x, y, Math.max(2, u + 1), Math.max(1, u), ripe ? '#9a1a3a' : '#a84a5a'); qP(g, x - 1, y - 1, '#c84a6a');
      break;
    case 'dw_garlic':   // 바위 마늘: 납작하고 긴 잎 · 흰 통
      for (const [dx, d] of [[-1, -0.5], [0, 0.15], [1, 0.6]]) leaf(x + dx, y - 1, h, d, '#6a9a4a', '#4a7a34');
      qEll(g, x, y, Math.max(2, u + 1), Math.max(1, u), '#eeeae2'); qP(g, x, y - 1, '#c8c0b0'); qP(g, x - 1, y, '#ffffff');
      break;
    case 'sr_chili': {   // 모래 고추: 갈래진 줄기 · 잎 · 아래로 늘어진 붉은 고추
      const top = Math.max(3, Math.round(h * 0.95));
      for (const [dx, d, f] of [[0, 0, 1], [-1, -0.8, 0.7], [1, 0.8, 0.75]]) { const len = Math.round(top * f); for (let j = 0; j < len; j++) { const px = x + dx + Math.round(d * j * 0.5) + (j > len / 2 ? sway : 0), py = y - 1 - j; qP(g, px, py, '#4e7a2a'); if (j > 1 && j % 2 === 0) qF(g, px + (d < 0 ? -2 : 1), py, 2, 1, j % 4 ? G1 : G2); } }
      if (ripe) for (const [dx, dy] of [[-2, 0.55], [2, 0.65], [0, 0.85]]) { const px = x + dx, py = Math.round(y - top * dy), L = Math.max(2, u + 2); qP(g, px, py - 1, '#3e7a2a'); qF(g, px, py, 1, L, '#d82a1a'); qP(g, px + 1, py + L - 1, '#d82a1a'); qP(g, px, py, '#f05a3a'); }
      break;
    }
    case 'sr_cactus': {   // 선인장: 기둥 · 팔 · 꼭대기 분홍 열매
      const w = Math.max(2, u + 1);
      qF(g, x - (w >> 1), y - h, w, h, '#3e7a34'); qF(g, x - (w >> 1), y - h, 1, h, '#6aaa4a'); qF(g, x - (w >> 1), y - h, w, 1, '#5a9a44');
      const ay = Math.round(y - h * 0.55); qF(g, x + (w >> 1) + 1, ay, 2, 1, '#3e7a34'); qF(g, x + (w >> 1) + 2, ay - Math.max(2, Math.round(h * 0.25)), 1, Math.max(2, Math.round(h * 0.25)), '#4e8a3a');
      for (let i = 2; i < h; i += 3) qP(g, x - (w >> 1) - 1, y - i, '#d8e8b0');
      if (ripe) { qDisc(g, x, y - h - 1, Math.max(1, u), '#d8306a'); qP(g, x - 1, y - h - 2, '#f070a0'); }
      break;
    }
    default: for (let i = -2; i <= 2; i++) leaf(x + i, y, Math.round(h * 0.8), i * 0.6, G1, GD);
  }
}
function farmPx(g, kind, x, y, sz, st, t, night) {
  if (st === 0) { const q = Math.max(1, Math.round(sz / 9)); qF(g, x, y - 2 * q, q, 2 * q, '#5aa83a'); qF(g, x - 2 * q, y - 3 * q, 2 * q, q, '#86cc56'); qF(g, x + q, y - 3 * q, 2 * q, q, '#86cc56'); return; }
  if (ITEMS[kind] && ITEMS[kind].veg) farmVegPx(g, kind, x, y, sz, st, t); else farmHerbPx(g, kind, x, y, sz, st, t, night);
}
const A3_FARM = {
  zoom: 1.25,
  geo(K) { K.FB = K.bot - 128; return K; },
  bg(g, K, T) {
    const { W, FB } = K, cx = W >> 1, night = q3Night(T);
    q3Glass(g, 0, 0, W, FB + 30, T, 7);
    g.globalAlpha = 0.5 - night * 0.2; qF(g, 0, 0, W, FB + 30, night > 0.5 ? '#4a5a66' : '#e4eeea'); g.globalAlpha = 1;   // 비닐: 우윳빛 막 + 주름 + 비스듬한 빛
    for (let x = 6; x < W; x += 11) { g.globalAlpha = 0.25; qF(g, x, 0, 1, FB + 30, '#ffffff'); g.globalAlpha = 1; }
    if (night < 0.6) for (let k = 0; k < 3; k++) for (let i = 0; i < 60; i++) { const x = 40 + k * 96 + i, y = i * 2 - 10; if (y > 0 && y < FB) { g.globalAlpha = 0.18; qF(g, x, y, 6, 2, '#ffffff'); g.globalAlpha = 1; } }
    const ex = 40, ey = 52; qEll(g, cx, FB, ex, ey, night > 0.5 ? '#38464e' : '#cdd8d4'); qF(g, cx - ex, FB, ex * 2, 1, '#9aa8a8');   // 끝벽 아치 + 문
    qF(g, cx - 10, FB - 30, 20, 30, '#5e3a20'); qF(g, cx - 8, FB - 28, 16, 28, night > 0.5 ? '#202830' : '#8ab0c0'); qF(g, cx - 1, FB - 28, 2, 28, '#5e3a20'); qF(g, cx - 8, FB - 16, 16, 2, '#5e3a20');
    for (let i = 0; i < 7; i++) {   // 갈빗대(쇠 파이프 아치): 멀리서 가까이로 커진다
      const f = 1 + 0.62 * Math.pow(i, 1.25), rx = ex * f, ry = ey * f, by = FB + i * i * 1.6 + i * 3, w = i < 2 ? 1 : i < 4 ? 2 : 3;
      for (let a = 0; a <= 180; a += 0.5) { const th = a * Math.PI / 180, x = Math.round(cx + Math.cos(th) * rx), y = Math.round(by - Math.sin(th) * ry); if (x < -4 || x > W + 4 || y < -4) continue; qF(g, x, y, w, w, a > 90 ? '#c8d4d8' : '#f0f6f8'); qP(g, x, y + w, '#7a8a90'); }
    }
    qF(g, 0, FB, W, K.H - FB, '#5a4030');   // 바닥: 흙 · 가운데 길 · 양옆 두둑
    qQ(g, [[cx - 8, FB], [cx + 8, FB], [cx + 38, K.H], [cx - 38, K.H]], '#8a6e50');
    for (let y = FB + 4; y < K.H; y += 6) qF(g, cx - 6 - (y - FB) * 0.18, y, 3, 1, '#9a7e5e');
    for (const s of [-1, 1]) {
      qQ(g, [[cx + s * 10, FB + 2], [cx + s * 44, FB + 2], [cx + s * 190, K.H], [cx + s * 42, K.H]], '#6e4626'); qQ(g, [[cx + s * 12, FB + 3], [cx + s * 42, FB + 3], [cx + s * 182, K.H], [cx + s * 48, K.H]], '#3e2a1c');
      for (let k = 1; k < 9; k++) { const d = k / 9, y = Math.round(FB + 4 + (K.H - FB) * d * d), x0 = cx + s * (12 + 36 * d * d), x1 = cx + s * (42 + 140 * d * d); qF(g, Math.min(x0, x1), y, Math.abs(x1 - x0), 1, '#4a3424'); }
    }
  },
  house(g, K) {
    const { W, FB } = K, cx = W >> 1;
    for (const [hx0, hy, sd] of [[cx - 56, FB - 84, 1], [cx - 28, FB - 108, 2], [cx + 28, FB - 108, 3], [cx + 56, FB - 84, 4]]) {   // 매단 화분 + 늘어진 덩굴
      qF(g, hx0, K.top + 4, 1, hy - K.top - 4, '#6a6a74'); qF(g, hx0 - 5, hy, 11, 6, '#b4643a'); qF(g, hx0 - 5, hy, 11, 2, '#d08050'); qF(g, hx0 - 5, hy + 5, 11, 1, '#7a3a1e');
      const r = rng(sd); for (let i = 0; i < 5; i++) { const vx = hx0 - 5 + Math.floor(r() * 11), vl = 3 + Math.floor(r() * 10); for (let k = 0; k < vl; k++) qP(g, vx + (k % 4 === 3 ? 1 : 0), hy + 6 + k, k % 2 ? '#4e9e3a' : '#7ac458'); }
      for (let i = -4; i <= 4; i += 2) qF(g, hx0 + i, hy - 3 - (i % 4 === 0 ? 1 : 0), 2, 3, '#5aa83a');
    }
    const rx0 = 4, ry0 = FB - 30;   // 모종 선반 (두 칸)
    for (const yy of [ry0, ry0 + 14]) { qF(g, rx0, yy, 34, 3, '#8a5a30'); qF(g, rx0, yy, 34, 1, '#b08048'); for (let x = rx0 + 2; x < rx0 + 32; x += 6) { qF(g, x, yy - 4, 5, 4, '#6a4a32'); qP(g, x + 2, yy - 6, '#7ac458'); qP(g, x + 1, yy - 5, '#5aa83a'); qP(g, x + 3, yy - 5, '#5aa83a'); } }
    qF(g, rx0, ry0, 2, 30, '#6e4626'); qF(g, rx0 + 32, ry0, 2, 30, '#6e4626');
    for (const [x, y] of [[cx - 42, FB - 52], [cx + 42, FB - 52]]) qF(g, x, K.top + 4, 1, y - K.top - 4, '#5a5a66');   // 매단 줄
    qF(g, W - 26, FB - 8, 20, 13, '#4a6a8a'); qF(g, W - 26, FB - 8, 20, 2, '#6a8aaa'); qEll(g, W - 16, FB - 8, 10, 2, '#2a4a6a');   // 물통
    for (let i = 0; i < 3; i++) { qF(g, W - 48 + i * 7, FB - 3, 5, 5, '#b4643a'); qF(g, W - 48 + i * 7, FB - 3, 5, 1, '#d08050'); }   // 빈 화분
  },
  live(g, K, t, T) {
    const { W, FB } = K, cx = W >> 1, night = q3Night(T) > 0.5, F = farmState(), H = F.houses[F.cur];
    if (H) {
      const n = H.plots.length, per = n / 2, yb = K.bot - 36, span = K.H - FB;
      H.plots.forEach((P, i) => {
        const s = i < per ? -1 : 1, j = i % per, d = Math.pow((j + 0.9) / (per + 0.4), 1.25);
        const y = Math.round(FB + 10 + (yb - FB - 10) * d), sz = Math.round(6 + 15 * (y - FB) / (yb - FB)), x = Math.max(sz + 4, Math.min(W - sz - 4, Math.round(cx + s * (27 + 84 * (y - FB) / span))));
        qEll(g, x, y, Math.round(sz * 1.5), Math.max(2, Math.round(sz * 0.28)), '#2e2016'); qEll(g, x - 1, y - 1, Math.round(sz * 1.3), Math.max(1, Math.round(sz * 0.2)), '#4a3426');   // 밭 한 칸 (흙 둔덕)
        hqHitAdd(K, x - sz * 1.5, y - sz - 8, sz * 3, sz + 10, { win: 'b:farm' });
        if (!P) { for (let k = -sz; k < sz; k += 3) qP(g, x + k, y - 1, '#6a4a32'); return; }
        const f = farmFrac(P), st = f >= 1 ? 2 : f < 0.3 ? 0 : 1;
        for (const k of [-1, 1, 0]) farmPx(g, P.k, x + k * Math.round(sz * 0.75), y + (k === 0 ? 1 : -1) * Math.round(sz * 0.1), sz, st, t + k, night);
        if (st === 2) { const bob = Math.round(Math.sin(t * 3 + x) * 1); qF(g, x - 1, y - sz - 7 + bob, 3, 3, '#fff4b0'); qP(g, x, y - sz - 6 + bob, '#c89a2a'); }   // 다 자람 표시 (작은 금빛 점)
      });
    }
    for (const [lx, ly] of [[cx - 42, FB - 52], [cx + 42, FB - 52]]) { qF(g, lx - 4, ly, 9, 4, '#3a3a44'); qF(g, lx - 3, ly + 4, 7, 2, night ? '#f8b048' : '#8a6a3a'); }   // 매단 등
    qPeo('groom', g, true, 'idle', Math.floor(t * 1.2) % 2, cx + 4, FB + 62, true);
    const wx = cx + 16, wy = FB + 48; qF(g, wx, wy, 8, 6, '#7a8a98'); qF(g, wx, wy, 8, 1, '#a8b8c4'); qF(g, wx + 8, wy + 1, 4, 1, '#7a8a98'); qF(g, wx + 11, wy, 1, 1, '#7a8a98');   // 물뿌리개
    if (Math.floor(t * 2) % 3 === 0) for (let i = 0; i < 4; i++) qP(g, wx + 13 + i, wy + 2 + i * 2, '#a8d8f0');
    q3Light(g, K, T, { amb: 0.08, ambN: 0.5, lamps: [[cx - 42, FB - 46, 44, '#f8a040'], [cx + 42, FB - 46, 44, '#f8a040']], wins: [], soft: [[cx, FB - 40, 120, 0.6 * (1 - q3Night(T))]] }, t);
  }
};
HQS.farm = A3_FARM;
BLD_FLOOR.farm = 'farm0';
FLOOR_TXT.farm = () => { const F = farmState(), r = farmReadyAll(); return `비닐하우스 ${F.houses.length}동 · ${r ? `다 자란 밭 ${r}칸` : `자라는 밭 ${F.houses.reduce((n, h) => n + h.plots.filter(Boolean).length, 0)}칸`}`; };

/* ── 본부 장소 위 덧그림 (재배소 동 단추 · 항구 표판 글씨는 port68.js) ── */
const HQX = {};
HQX.farm = () => {
  const F = farmState(), hs = F.houses.map((h, i) => { const r = farmReady(h); return `<button type="button" class="pchip${i === F.cur ? ' on' : ''}" data-fh="${i}"><i class="dot${r ? ' go' : ''}"></i>재배소 ${i + 1}${r ? ` · ${r}` : ''}</button>`; });
  if (F.houses.length < FARM.n) hs.push(`<button type="button" class="pchip lock" data-fh="new">＋ ${F.houses.length + 1}동 짓기</button>`);
  return `<div class="hqx-chips">${hs.join('')}</div>`;
};
function hqExtra(cur) {
  let el = document.getElementById('hqx');
  if (!el) {
    const st = document.getElementById('stage'); if (!st) return;
    el = document.createElement('div'); el.id = 'hqx'; el.className = 'hqx'; st.appendChild(el);
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-fh]'); if (!b || !S) return;
      if (b.dataset.fh === 'new') { hqOpen({ win: 'b:farm' }); return; }
      const F = farmState(); F.cur = Math.max(0, Math.min(F.houses.length - 1, +b.dataset.fh)); sfx('ui'); renderFloors();
    });
  }
  const fn = cur && !HQ.anim && HQX[cur.id], html = fn ? fn(cur) : '';
  if (html !== el.dataset.h) { el.innerHTML = html; el.dataset.h = html; }
  const ch = el.querySelector('.hqx-chips'); if (ch) ch.style.bottom = (document.getElementById('placebar').offsetHeight + 2) + 'px';
  if (cur && HQX.place) HQX.place(el, cur);
}

/* ── 재배소 창 ── */
BLD_INNER.farm = '밭 돌보기';
BLD_SUM.farm = () => { const F = farmState(), r = farmReadyAll(); return `<div class="sub">비닐하우스 ${F.houses.length}동 · 밭 ${F.houses.reduce((n, h) => n + h.plots.length, 0)}칸${r ? ` · <span class="gold-t">다 자란 밭 ${r}칸</span>` : ''}</div>`; };
BLD_BOX.farm = () => {
  const F = farmState(), hi = F.cur, H = F.houses[hi]; if (!H) return '';
  const lv = H.lv, all = farmReadyAll(), ph = petHome('herb'), sel = UI.farmPlot != null && UI.farmPlot < H.plots.length && !H.plots[UI.farmPlot] ? UI.farmPlot : null;
  const chips = F.houses.map((h, i) => { const r = farmReady(h); return `<button type="button" class="pchip${i === hi ? ' on' : ''}" data-act="farmcur" data-h="${i}"><i class="dot${r ? ' go' : ''}"></i>재배소 ${i + 1} <small>Lv${h.lv}</small>${r ? ` · ${r}` : ''}</button>`; })
    .concat(F.houses.length < FARM.n ? [(() => { const n = F.houses.length, need = FARM.rank[n], ok = (S.rank || 0) >= need; return `<button type="button" class="pchip lock" data-act="build" data-id="farm"${ok && S.gold >= FARM.cost[n] ? '' : ' disabled'}>＋ ${n + 1}동 ${ok ? `${fmt(FARM.cost[n])}G` : `${RANKS[need].name}랭크`}</button>`; })()] : []).join('');
  const upC = FARM.up[lv], next = lv < 3 ? `Lv${lv + 1}: 밭 ${FARM.plots[lv]}칸 · ${FARM_TIER_TXT[lv]}(${farmTierNames(lv)})도 심는다` : '최고 단계 · 모든 약초와 채소를 심는다';
  const rows = H.plots.map((P, i) => {
    if (!P) return `<div class="li${sel === i ? ' on' : ''}"><span class="cell empty" style="width:30px;height:30px;flex:none">${rqEmpty(1)}</span><div class="grow stack"><span>밭 ${i + 1} · 빈 밭</span><span class="sub muted">${sel === i ? '아래에서 심을 것을 눌러요' : '창고의 약초 · 채소 하나를 모종으로 심어요'}</span></div><button type="button" class="btn sm${sel === i ? ' gold' : ''}" data-act="farmsel" data-i="${i}">심기</button></div>`;
    const f = farmFrac(P), ok = f >= 1, g = itemGrade(P.k);
    return `<div class="li"><span class="cell rq${g}" style="width:30px;height:30px;flex:none">${rqArt(iconURL(P.k), g, 1)}</span><div class="grow stack"><span>밭 ${i + 1} · ${ITEMS[P.k].name} <span class="muted">${farmKindTxt(P.k)}</span></span><span class="sub${ok ? ' gold-t' : ''}">${ok ? `다 자랐어요 · ${farmGetTxt(P.k)} 거둠` : `${f < 0.3 ? '새싹' : '자라는 중'} · ${farmLeftTxt(P)} 남음`}</span><span class="farm-bar"><i class="${ok ? 'ok' : ''}" style="width:${Math.round(Math.min(1, f) * 100)}%"></i></span></div>${ok ? `<button type="button" class="btn sm gold" data-act="farmharv" data-h="${hi}" data-i="${i}">거두기</button>` : '<button type="button" class="btn sm" disabled>기다림</button>'}</div>`;
  }).join('');
  const tab = UI.farmTab || 'herb', seeds = (tab === 'herb' ? Object.keys(HERB_TIER) : Object.keys(VEG68)).filter(k => ITEMS[k]);
  const pick = seeds.map(k => { const need = farmLvNeed(k), lock = lv < need, n = S.inv[k] || 0, g = itemGrade(k);
    return `<button type="button" class="cell rq${g}${n && !lock ? '' : ' zero'}" data-act="farmplant" data-k="${k}" title="${ITEMS[k].name}"${lock ? ' style="opacity:.45"' : ''}>${rqArt(iconURL(k), g, 2)}<b class="qty">${lock ? 'Lv' + need : n}</b></button>`; }).join('');
  const shop = ['herb'].concat(Object.keys(KITCHEN_BUY).filter(k => ITEMS[k] && ITEMS[k].veg)).map(k => { const p = k === 'herb' ? buyPrice('herb') : KITCHEN_BUY[k];
    return `<div class="li">${iconImg(k)}<div class="grow stack"><span>${ITEMS[k].name} <span class="muted">창고 ${S.inv[k] || 0}</span></span><span class="sub gold-t">${fmt(p)}G</span></div>${k === 'herb' ? `<button type="button" class="btn sm" data-act="buy" data-it="herb" data-q="1"${S.gold < p ? ' disabled' : ''}>사기</button><button type="button" class="btn sm" data-act="buy" data-it="herb" data-q="5"${S.gold < p * 5 ? ' disabled' : ''}>×5</button>` : `<button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="1"${S.gold < p ? ' disabled' : ''}>사기</button><button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="5"${S.gold < p * 5 ? ' disabled' : ''}>×5</button>`}</div>`; }).join('');
  return `<div class="farm-chips">${chips}</div>
    <div class="card"><div class="row"><div class="grow"><div class="h">재배소 ${hi + 1} <small>Lv${lv}</small></div><div class="sub">비닐하우스 · 밭 ${H.plots.length}칸 · ${lv === 1 ? '하급 약초 · 채소' : `${FARM_TIER_TXT[lv - 1]}까지 · 채소`}</div></div>${lv < 3 ? `<button type="button" class="btn sm" data-act="farmup" data-h="${hi}"${S.gold < upC ? ' disabled' : ''}>강화 ${fmt(upC)}G</button>` : '<span class="sub muted">최고 단계</span>'}</div>
    <div class="sub muted">${next}</div></div>
    <div class="sec"><b>밭</b><span>${H.plots.length}칸 · 다 자람 ${farmReady(H)}</span></div>
    <div class="list">${rows}</div>
    <div class="row ckbtns"><button type="button" class="btn gold" data-act="farmall"${all ? '' : ' disabled'}>모두 거두기 (${all})</button><button type="button" class="btn${F.auto ? ' on' : ''}" data-act="farmauto">${F.auto ? '✓ ' : ''}거두면 다시 심기</button></div>
    <div class="sec"><b>심을 것</b><span>모종 = 창고의 그 약초 · 채소 하나${sel != null ? ` · 밭 ${sel + 1}에` : ''}</span></div>
    <div class="tabs inv"><button type="button" class="tab${tab === 'herb' ? ' on' : ''}" data-act="farmtab" data-id="herb">약초</button><button type="button" class="tab${tab === 'veg' ? ' on' : ''}" data-act="farmtab" data-id="veg">채소</button></div>
    <div class="igrid">${pick}</div>
    <div class="sub muted">약초: 하급 1일 → 3개 · 중급 2일 → 2~3개 (동 Lv2) · 최상급 4일 → 1~2개 (동 Lv3) · 채소: 하르겐 1일 · 왕국 특산 2일 → 3~5개${ph ? ` · 상단에 둔 약초 펫: 수확 +${Math.round(ph * 100)}%` : ''}. 중급 · 최상급 약초는 상점에서 팔지 않아요 — 필드에서 드물게 주운 것을 길러 늘려요.</div>
    <details class="card"><summary class="sec"><b>모종 사기</b><span>하르겐 시장 · 히포크리초</span></summary><div class="list">${shop}</div><div class="sub muted">왕국 특산 채소는 그 나라 상단이 찾아올 때 팔아요.</div></details>`;
};
Object.assign(ACT, {
  farmcur: d => { const F = farmState(); F.cur = Math.max(0, Math.min(F.houses.length - 1, +d.h)); UI.farmPlot = null; renderPanel(true); renderFloors(); },
  farmsel: d => { UI.farmPlot = UI.farmPlot === +d.i ? null : +d.i; renderPanel(true); },
  farmplant: d => { const F = farmState(), r = farmPlant(F.cur, UI.farmPlot, d.k); if (!r) { UI.farmPlot = null; sfx('ui'); } say(r); renderPanel(true); },
  farmharv: d => { say(farmHarvest(+d.h, +d.i)); renderPanel(true); },
  farmall: () => { say(farmHarvestAll()); renderPanel(true); },
  farmauto: () => { const F = farmState(); F.auto = F.auto ? 0 : 1; changed(); renderPanel(true); },
  farmup: d => { say(farmUp(+d.h)); renderPanel(true); },
  farmtab: d => { UI.farmTab = d.id; renderPanel(true); }
});
