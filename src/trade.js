/* ───────── 빌드 31: 교역로 · 눈에 보이는 마차 ─────────
   교역: 말이 끄는 마차를 가진 파티가 그 나라가 원하는 물건을 창고에서 싣고 길을 떠난다. 그 나라에 닿으면 실은 것을 다 팔고(호감에 따라 기준가의 135~185%),
   남는 자리에 그 나라 특산물을 기준가의 60%에 사서 돌아온다. 길에는 산적과 짐승이 나오고, 날씨도 따라온다. */
const tradeOf = e => (e && e.area === 'trade' && FIELDS[e.field] ? FIELDS[e.field].trade : null);
const TRADE_BUDGETS = [0, 5000, 20000, 50000, 200000];
function tradeWhy(p) {
  const w = wagonOwned(p);
  if (!w || !w.horse) return '말이 끄는 마차(짐수레 이상)가 있어야 교역을 떠날 수 있어요.';
  const why = wagonWhy(p); if (why) return `${rigName(p)}: ${why}.`;
  return '';
}
// 의뢰에 쓸 물건은 싣지 않는다
const reqNeed = it => (S.reqs || []).reduce((n, q) => n + (q.item === it || q.it === it ? (q.qty || 0) : 0), 0);
function tradeCargoPlan(p, k) {
  const room = Math.max(0, Math.floor(capOf(p) * (1 - TRADE_CAP_KEEP)) - wOf(p.sup));
  const want = KINGDOMS[k].wants.filter(it => ITEMS[it] && (S.inv[it] || 0) - reqNeed(it) > 0).sort((a, b) => ITEMS[b].v / (ITEMS[b].w || 1) - ITEMS[a].v / (ITEMS[a].w || 1));
  const cargo = {}; let w = 0, value = 0;
  for (const it of want) {
    const W = ITEMS[it].w || 1, q = Math.min((S.inv[it] || 0) - reqNeed(it), Math.floor((room - w) / W));
    if (q > 0) { cargo[it] = q; w += q * W; value += ITEMS[it].v * q; }
    if (w >= room) break;
  }
  return { cargo, w, room, value };
}
const tradeSellMul = k => FAVOR[favorTier(favorOf(k))].m * festSellMul(k);
const tradeBuyPrice = (k, it) => Math.max(1, Math.round(ITEMS[it].v * TRADE_BUY_MUL * festBuyMul(k)));
// startExp가 부른다: 짐을 싣고 길을 정한다
function tradeSetup(p, e) {
  const k = FIELDS[e.field].trade, T = TRADE[k], plan = tradeCargoPlan(p, k);
  for (const [it, q] of Object.entries(plan.cargo)) addTo(S.inv, it, -q);
  Object.assign(e, { area: 'trade', cargo: plan.cargo, dist: T.dist, leg: 'out', lvo: Math.max(T.lv, Math.round(avgLvOf(p)) - 6), trade: { k, sold: 0, spent: 0, bought: {} } });
  e.encs = makeEncs(e);
  log(`${p.name}이(가) ${rigName(p)}에 교역품 ${Object.values(plan.cargo).reduce((s, q) => s + q, 0)}개(기준가 ${g$(plan.value)})를 싣고 ${KINGDOMS[k].name}(으)로 떠났다.`);
}
// 그 나라에 닿았다: 다 팔고 특산물을 사서 돌아선다
function tradeAtKingdom(p, e) {
  const k = e.trade.k, D = KINGDOMS[k], m = tradeSellMul(k);
  let sold = 0, n = 0;
  for (const [it, q] of Object.entries(e.cargo || {})) { sold += Math.round(ITEMS[it].v * m) * q; n += q; }
  e.cargo = {};
  S.gold += sold; S.stats.earned += sold; S.stats.soldG = (S.stats.soldG || 0) + sold; S.stats.trades = (S.stats.trades || 0) + 1;
  S.king.favor[k] = favorOf(k) + sold / 400 + 5; S.fame += 2;
  // 특산물: 남는 짐 자리와 정한 예산만큼, 고르게
  let budget = Math.min(S.gold, p.tradeBuy != null ? p.tradeBuy : 20000), room = Math.floor(capOf(p) * (1 - TRADE_CAP_KEEP / 2)) - usedOf(p);
  const goods = TRADE[k].goods.filter(it => ITEMS[it]), bought = {};
  let spent = 0, any = true;
  while (any) { any = false; for (const it of goods) { const pr = tradeBuyPrice(k, it), W = ITEMS[it].w || 1; if (pr <= budget && W <= room) { budget -= pr; room -= W; spent += pr; bought[it] = (bought[it] || 0) + 1; addTo(e.bag, it, 1); any = true; } } }
  S.gold -= spent; S.stats.spent = (S.stats.spent || 0) + spent;
  Object.assign(e.trade, { sold, spent, bought, n });
  ev(e, 'trade', { k });
  log(`${p.name}이(가) ${D.name}에서 교역품 ${n}개를 ${g$(sold)}에 팔고${spent ? `, 특산물 ${Object.values(bought).reduce((s, q) => s + q, 0)}개를 ${g$(spent)}에 샀다` : ''}. 호감이 올랐다.`, 'good');
  HOOKS.toast(`${p.name} · ${D.name} 교역 ${g$(sold)}`);
  // 돌아선다
  e.leg = 'back'; e.mode = 'return'; e.why = 'trade'; e.stage = e.dist; e.home = 1; e.pos = STAGE_LEN; e.ei = 0; e.next = null; e.encs = makeEncs(e);
}
function tradeStage(p, e) {
  if (e.leg === 'out' && e.stage >= e.dist) { tradeAtKingdom(p, e); changed(); return; }
  e.stage++; e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}
// 집에 닿았을 때 (arrive가 부른다)
function tradeHome(p, e) {
  if (e.cargo) for (const [it, q] of Object.entries(e.cargo)) addTo(S.inv, it, q);   // 못 팔고 돌아왔으면 창고로
  const T = e.trade; if (!T || !T.sold) return;
  const D = KINGDOMS[T.k], bought = Object.entries(T.bought || {});
  queueModal({ title: `교역 보고 · ${D.name}`, body: [`${p.name}이(가) ${D.name}에서 돌아왔다.`, `교역품 ${T.n}개를 ${g$(T.sold)}에 팔았다 (기준가의 ${Math.round(tradeSellMul(T.k) * 100)}%).`, bought.length ? `특산물 ${bought.map(([it, q]) => `${ITEMS[it].name} ${q}개`).join(', ')}를 ${g$(T.spent)}에 사 왔다. 상점에 진열하거나 다른 나라에 팔면 남는다.` : '특산물은 사지 않았다.', `${D.name}의 호감 ${Math.round(favorOf(T.k))} (${FAVOR[favorTier(favorOf(T.k))].name})`] });
}
function tradeWhere(e) {
  const k = e.trade ? e.trade.k : FIELDS[e.field].trade, D = KINGDOMS[k];
  return e.leg === 'back' ? `${D.name.replace(/ 왕국$/, '')}에서 돌아오는 길 · ${e.stage}/${e.dist}` : `${D.name.replace(/ 왕국$/, '')}행 교역로 · ${e.stage}/${e.dist}`;
}
// 원정대 창: 교역 목적지
function tradeDestButtons(p, dest) {
  return TRADE_IDS.map(k => {
    const fid = 'trade_' + k, ok = kingOpen(k), T = TRADE[k], plan = ok ? tradeCargoPlan(p, k) : null;
    return `<button type="button" class="fbtn trade${dest === fid ? ' on' : ''}" data-act="dest" data-id="${p.id}" data-f="${fid}"${ok ? '' : ' disabled'}><span>${KINGDOMS[k].name}</span><small>${ok ? `${T.dist}구간 · 길 Lv${T.lv}+ · 실을 것 ${Object.keys(plan.cargo).length}종 ${g$(plan.value)}어치` : '아직 길을 모르는 나라'}</small></button>`;
  }).join('');
}
function tradeInfo(p, dest) {
  const F = FIELDS[dest]; if (!F || !F.trade) return '';
  const k = F.trade, plan = tradeCargoPlan(p, k), why = tradeWhy(p), m = tradeSellMul(k);
  const rows = Object.entries(plan.cargo).map(([it, q]) => `${ITEMS[it].name} ${q}`).join(', ');
  const bud = p.tradeBuy != null ? p.tradeBuy : 20000;
  return `<div class="card special"><div class="h">${KINGDOMS[k].name} 교역</div>
    <div class="sub">실을 교역품: ${rows || '<span class="red-t">이 나라가 원하는 물건이 창고에 없어요</span>'}</div>
    <div class="sub">무게 ${plan.w}/${plan.room} · 기준가 ${g$(plan.value)} → 그 나라에서 약 <b class="gold-t">${g$(Math.round(plan.value * m))}</b> (호감 ${FAVOR[favorTier(favorOf(k))].name} ×${m.toFixed(2)})</div>
    <div class="sub">사 올 특산물: ${TRADE[k].goods.filter(it => ITEMS[it]).map(it => `${ITEMS[it].name} ${g$(tradeBuyPrice(k, it))}`).join(' · ')}</div>
    <div class="row sub"><span class="grow">특산물 예산</span></div><div class="chips">${TRADE_BUDGETS.map(b => `<button type="button" class="chip${bud === b ? ' on' : ''}" data-act="tbud" data-id="${p.id}" data-b="${b}">${b ? g$(b) : '사지 않기'}</button>`).join('')}</div>
    <div class="sub muted">길에서 산적과 짐승을 만나요 (Lv${Math.max(TRADE[k].lv, Math.round(avgLvOf(p)) - 6)} 안팎). 쓰러지면 교역품도 잃어요.</div>
    ${why ? `<div class="sub red-t">${why}</div>` : ''}</div>`;
}
Object.assign(ACT, {
  tbud: d => { const p = findP(+d.id); if (p) { p.tradeBuy = +d.b; changed(); renderPanel(true); } },
  // 지도의 왕국 카드에서: 쉬고 있는 첫 파티의 목적지를 그 나라 교역로로 하고 원정대 창을 연다
  tradego: d => { const p = S.parties.find(x => !x.exp && x.members.length) || S.parties.find(x => !x.exp); if (!p) { say('쉬고 있는 파티가 없어요.'); return; } p.dest = 'trade_' + d.k; UI.destTab = 'trade'; UI.expTab = p.id; openWin('exp'); }
});

/* ───────── 눈에 보이는 마차: 원정 화면에서 파티 뒤를 따라오고, 상단 앞에는 세워 둔다 ───────── */
// X: 마차 몸통 가운데, gy: 땅. 앞(dir 쪽)에 말·펫이 서서 끈다. 비행 마차는 떠서 날고 그림자만 땅에 진다.
function rigAnimalId(p) { const h = horseOf(p); if (!h) return null; if (h.petId) { const pet = petById(h.petId); return pet ? PETS[pet.kind].mon : null; } return 'horse_' + h.id; }
function drawRig(g, X, gy, t, p, moving, dir) {
  const W = wagonOwned(p); if (!W) return;
  const k = p.wagon, fly = W.fly && wagonFly(p), bob = fly ? Math.round(Math.sin(t * 2.2) * 2) - 12 : moving ? (Math.floor(t * 8) % 2 ? -1 : 0) : 0;
  const WD = '#7a5232', WDd = '#4a3020', WDl = '#a07848', IR = '#2a2a30';
  g.save(); g.translate(Math.round(X), gy); g.scale(dir, 1);
  // 그림자
  for (let i = -26; i <= 26; i++) R(g, i, 0, 1, 1, `rgba(0,0,0,${(0.22 * (1 - Math.abs(i) / 30)).toFixed(2)})`);
  const wheel = (cx, cy, r) => { disc(g, cx, cy, r, IR); disc(g, cx, cy, r - 1, '#6a5038'); disc(g, cx, cy, Math.max(1, r - 2), '#2a2028'); const a0 = moving ? -t * 9 : 0.4; for (let i = 0; i < 3; i++) { const a = a0 + i * Math.PI / 3; for (let s = -(r - 1); s <= r - 1; s++) R(g, Math.round(cx + Math.cos(a) * s), Math.round(cy + Math.sin(a) * s), 1, 1, '#c8a060'); } };
  // 끄는 짐승 (손수레는 없다)
  const an = rigAnimalId(p);
  if (an && W.horse) { g.save(); g.translate(28, bob * (fly ? 1 : 0)); drawMon(g, an, t, { ph: 0.4, z: 1 }); g.restore(); R(g, 12, -9 + (fly ? bob : 0), 12, 1, WDd); }
  const y = bob;
  if (k === 'cart') {
    R(g, -14, y - 12, 22, 6, WD); R(g, -14, y - 12, 22, 1, WDl); R(g, -14, y - 7, 22, 1, WDd);
    ell(g, -8, y - 15, 5, 3, '#c8b890'); ell(g, -1, y - 16, 4, 3, '#b8a880'); R(g, -3, y - 18, 2, 2, '#8a7a5a');
    R(g, 8, y - 10, 12, 1, WDd); R(g, 19, y - 11, 1, 3, WDd);
    wheel(-4, -4, 4);
  } else if (k === 'donkey') {
    R(g, -18, y - 14, 30, 7, WD); R(g, -18, y - 14, 30, 1, WDl); R(g, -18, y - 8, 30, 1, WDd); for (let i = 0; i < 4; i++) R(g, -16 + i * 8, y - 14, 1, 7, WDd);
    R(g, -14, y - 21, 8, 7, '#a8743e'); R(g, -14, y - 21, 8, 1, '#c8945a'); R(g, -5, y - 19, 7, 5, '#8a6238'); ell(g, 6, y - 17, 4, 3, '#c8b890');
    wheel(-6, -5, 5);
  } else if (k === 'wagon' || k === 'caravan' || k === 'steel') {
    const big = k === 'caravan', steel = k === 'steel', L = big ? -26 : -22, Rr = big ? 16 : 13, top = big ? 34 : 29;
    const body = steel ? '#6a7484' : WD, bodyD = steel ? '#4a5260' : WDd, bodyL = steel ? '#9aa4b4' : WDl;
    R(g, L, y - 15, Rr - L, 9, body); R(g, L, y - 15, Rr - L, 1, bodyL); R(g, L, y - 7, Rr - L, 1, bodyD);
    if (steel) for (let x = L + 2; x < Rr; x += 5) { R(g, x, y - 13, 1, 1, '#c8d0dc'); R(g, x, y - 9, 1, 1, '#c8d0dc'); }
    // 덮개
    const cv = steel ? '#5a6270' : big ? '#e8dcc0' : '#e0d4b8', cvD = steel ? '#3a4250' : big ? '#c8b890' : '#bcae90';
    for (let i = 0; i <= top - 15; i++) { const yy = y - 15 - i, k2 = i / (top - 15), w2 = Math.round((Rr - L - 4) * Math.sqrt(1 - k2 * k2 * 0.9)); R(g, Math.round((L + Rr) / 2 - w2 / 2), yy, w2, 1, i % 5 === 0 ? cvD : cv); }
    if (big) for (let x = L + 4; x < Rr - 2; x += 8) R(g, x, y - top + 6, 3, top - 22, '#c84a3a');
    if (steel) { R(g, L + 4, y - top - 4, 3, 6, '#3a3e48'); R(g, L + 4, y - top - 6 - (Math.floor(t * 3) % 2), 3, 2, 'rgba(200,200,210,0.5)'); }
    if (big) { R(g, Rr + 1, y - 22, 1, 6, IR); R(g, Rr, y - 17, 3, 3, '#f0c060'); }
    wheel(L + 7, -6, big ? 7 : 6); wheel(Rr - 6, -6, big ? 7 : 6);
  } else if (k === 'sky') {
    // 배 모양 몸통과 날개
    for (let i = 0; i < 8; i++) R(g, -22 + i, y - 8 - i, 38 - i * 2 + (i > 4 ? 0 : 0), 1, i < 2 ? WDd : WD);
    R(g, -22, y - 17, 36, 2, WDl); R(g, -18, y - 24, 2, 7, WDd); R(g, -19, y - 25, 4, 1, '#f0c24a');
    const fl = Math.sin(t * 8) * 4;
    for (let i = 0; i < 12; i++) { R(g, -10 - i, y - 18 - Math.round(i * 0.4 + fl * (i / 12)), 2, 1, i % 3 ? '#f0f0f8' : '#c8d0e0'); R(g, -6 + i, y - 18 - Math.round(i * 0.4 + fl * (i / 12)), 2, 1, i % 3 ? '#f0f0f8' : '#c8d0e0'); }
    R(g, -2, y - 12, 4, 3, '#2a2a34'); R(g, -1, y - 11, 2, 1, '#8ad8ff');
  }
  g.restore();
}
