/* ───────── 빌드 31: 주방과 원정 도시락 ─────────
   주방에서 재료로 도시락을 만든다. 파티마다 도시락 하나를 골라 두면 출발할 때 하나를 들고 가고, 원정 내내 효과가 이어진다.
   「없으면 만들기」를 켜 두면 도시락이 떨어졌을 때 출발 직전에 재료로 하나 만든다. */
const foodOf = e => (e && e.food && FOODS[e.food] ? e.food : null);
const FX_MEMO = new WeakMap();
const foodFx = e => {   // 도시락 효과 + 상단 전용 원정 휴대품(e.bst, store.js boostStart)
  const f = (e && e.food && FOODS[e.food] ? FOODS[e.food].fx : {}) || {};
  if (!e || !e.bst) return f;
  const m = FX_MEMO.get(e); if (m && m.food === e.food) return m.fx;
  const o = Object.assign({}, f); for (const [k, v] of Object.entries(e.bst)) o[k] = (o[k] || 0) + v;
  FX_MEMO.set(e, { food: e.food, fx: o }); return o;
};
const cookFee = F => Math.round(F.fee * (1 - Math.max(0, (S.bld.kitchen || 0) - 1) * 0.1));
function cookWhy(id) {
  const F = FOODS[id]; if (!F) return '없는 요리예요.';
  if (!S.bld.kitchen) return '주방이 필요해요.';
  if (S.bld.kitchen < F.lv) return `주방 ${F.lv}단계가 필요해요.`;
  const miss = Object.entries(F.need).find(([k, q]) => (S.inv[k] || 0) < q);
  if (miss) return `${ITEMS[miss[0]].name}이(가) 모자라요 (${S.inv[miss[0]] || 0}/${miss[1]}).`;
  if (S.gold < cookFee(F)) return '돈이 모자라요.';
  if (!roomItem('food_' + id, freedBy(F.need))) return WH_FULL;
  return '';
}
function cookFood(id, quiet) {
  const why = cookWhy(id); if (why) return why;
  const F = FOODS[id];
  Object.entries(F.need).forEach(([k, q]) => addTo(S.inv, k, -q));
  S.gold -= cookFee(F); S.stats.spent = (S.stats.spent || 0) + cookFee(F);
  addTo(S.inv, 'food_' + id, 1);
  const lv = S.bld.kitchen || 0;
  if (lv >= 2 && rnd() < (lv >= 3 ? 0.3 : 0.15)) { addTo(S.inv, 'food_' + id, 1); if (!quiet) HOOKS.toast(`${F.name}이(가) 하나 더 나왔다!`); }
  S.stats.cooked = (S.stats.cooked || 0) + 1;
  changed();
  return '';
}
function buyFoodMat(k, n) {
  if (!S.bld.kitchen) return '주방이 필요해요.';
  const price = KITCHEN_BUY[k]; if (!price) return '';
  n = Math.max(1, n || 1);
  if (S.gold < price * n) return '돈이 모자라요.';
  if (!roomItem(k)) return WH_FULL;
  S.gold -= price * n; S.stats.spent = (S.stats.spent || 0) + price * n; addTo(S.inv, k, n);
  changed();
  return '';
}
// 출발할 때: 고른 도시락을 하나 들고 간다 (없으면 만들기가 켜져 있으면 재료로 하나 만든다)
function packFood(p) {
  const id = p.food; if (!id || !FOODS[id]) return null;
  if ((S.inv['food_' + id] || 0) < 1 && p.autoCook) cookFood(id, true);
  if ((S.inv['food_' + id] || 0) < 1) { log(`${p.name}은(는) 도시락(${FOODS[id].name})이 없어 그냥 떠났다.`); return null; }
  addTo(S.inv, 'food_' + id, -1);
  return id;
}
function setPartyFood(pid, id) {
  const p = findP(pid); if (!p) return '';
  p.food = id && FOODS[id] ? id : null;
  changed();
  return '';
}
const foodLine = id => { const F = FOODS[id]; return `${F.name} · ${foodFxText(F.fx)}`; };
// 원정대 창: 파티 도시락 고르기
function foodPick(p) {
  const opts = FOOD_IDS.filter(id => (S.inv['food_' + id] || 0) > 0 || p.food === id || !cookWhy(id));   // 창고에 있거나 지금 만들 수 있는 것만
  if (!S.bld.kitchen && !opts.some(id => S.inv['food_' + id])) return '<div class="sub muted">주방을 지으면 원정 도시락을 만들어 들려 보낼 수 있어요.</div>';
  return `<div class="row sub"><span class="grow">도시락 · ${p.food ? `<b>${FOODS[p.food].name}</b> (창고 ${S.inv['food_' + p.food] || 0}) · ${foodFxText(FOODS[p.food].fx)}` : '없음'}</span></div>
    ${opts.length ? '' : '<div class="sub muted">창고에 도시락이 없어요. 주방에서 만들면 여기에서 고를 수 있어요.</div>'}
    <div class="chips">${['', ...opts].map(id => `<button type="button" class="chip${(p.food || '') === id ? ' on' : ''}" data-act="pfood" data-id="${p.id}" data-f="${id}">${id ? `${FOODS[id].name} ${S.inv['food_' + id] || 0}${(S.inv['food_' + id] || 0) ? '' : ' (만들 수 있음)'}` : '없음'}</button>`).join('')}</div>
    ${p.food ? `<label class="tog sub"><input type="checkbox" data-act="pautocook" data-id="${p.id}"${p.autoCook ? ' checked' : ''}> 떨어지면 출발 전에 재료로 만들기</label>` : ''}`;
}
/* ───────── 주방 창 ───────── */
BLD_INNER.kitchen = '도시락 만들기';
BLD_SUM.kitchen = () => `<div class="sub">도시락 ${FOOD_IDS.reduce((n, id) => n + (S.inv['food_' + id] || 0), 0)}개 · 날고기 ${S.inv.raw_meat || 0} · 밀가루 ${S.inv.flour || 0} · 향신료 ${S.inv.spice || 0} · 꿀 ${S.inv.honey || 0}</div>`;
BLD_BOX.kitchen = () => {
  const lv = S.bld.kitchen || 0;
  const rows = FOOD_IDS.map(id => {
    const F = FOODS[id], ok = lv >= F.lv, why = cookWhy(id), have = S.inv['food_' + id] || 0;
    return `<div class="li${ok ? '' : ' dim'}">${iconImg('food_' + id)}<div class="grow stack"><span>${F.name} <span class="muted">창고 ${have}</span></span><span class="sub">${foodFxText(F.fx)}</span><span class="sub muted">${ok ? `${needStr(F.need)} · ${cookFee(F)}G` : `주방 ${F.lv}단계`}</span></div><button type="button" class="btn sm gold" data-act="cook" data-k="${id}"${why ? ' disabled' : ''}>만들기</button></div>`;
  }).join('');
  const mats = Object.keys(KITCHEN_BUY).map(k => `<div class="li">${iconImg(k)}<div class="grow stack"><span>${ITEMS[k].name} <span class="muted">창고 ${S.inv[k] || 0}</span></span><span class="sub">${KITCHEN_BUY[k]}G${k === 'raw_meat' ? ' · 짐승을 사냥하면 얻어요' : ''}</span></div><div class="btns"><button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="1"${S.gold < KITCHEN_BUY[k] ? ' disabled' : ''}>1</button><button type="button" class="btn sm" data-act="fbuy" data-k="${k}" data-n="10"${S.gold < KITCHEN_BUY[k] * 10 ? ' disabled' : ''}>10</button></div></div>`).join('');
  return `<div class="sub">도시락은 원정대 창에서 파티마다 골라요. 출발할 때 하나를 들고 가서 돌아올 때까지 효과가 이어져요.</div>
    <div class="sec"><b>요리</b><span>Lv${lv} · ${FOOD_IDS.filter(id => FOODS[id].lv <= lv).length}/${FOOD_IDS.length}가지</span></div><div class="list">${rows}</div>
    <div class="sec"><b>재료 사기</b><span>교역로에서 더 싸게</span></div><div class="list">${mats}</div>`;
};
Object.assign(ACT, {
  cook: d => say(cookFood(d.k)),
  fbuy: d => say(buyFoodMat(d.k, +d.n)),
  pfood: d => { say(setPartyFood(+d.id, d.f || null)); renderPanel(true); },
  pautocook: d => { const p = findP(+d.id); if (p) { p.autoCook = !p.autoCook; changed(); renderPanel(true); } }
});
