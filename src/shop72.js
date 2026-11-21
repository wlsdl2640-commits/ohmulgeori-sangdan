/* ───────── 협회 장비 상점 · 협회 포션 상점 (빌드 72 · 11-21 15:52 사용자) ─────────
   미궁탑에 새로 생긴 두 곳. 장비 상점은 협회의 대장장이들이 만든 장비를, 포션 상점은 연금술사들이 만든 포션을 판다. 장비는 이제 제작 아니면 여기서 사는 것뿐이다.
   · 장비 상점: 날마다 06시(새 날)에 물건이 바뀐다. GSHOP.n점 — 길드원 최고 레벨에 맞는 단계까지, 일반 품질(가끔 고급). 값 = 장비 값 × GSHOP.mul. 제작보다 비싸고 레어도가 낮다.
   · 포션 상점: 회복 · 마나 물약과 치료 소모품을 늘 판다. 값 = buyPrice(없으면 기준가 × PSHOP.mul).
   · 방 그림은 아직(부탁 글 tools/saved/gpt70/shops/) — 그때까지 협회 로비 그림. 값 · 가짓수는 내 안. */
const GSHOP = { n: 10, mul: 4, fine: 0.2 }, PSHOP = { mul: 2.5, ids: ['pot_s', 'pot_m', 'pot_l', 'mp_s', 'mp_m', 'mp_l', 'bandage', 'antidote', 'salve', 'warmer', 'ward', 'salts', 'tonic', 'eyedrop', 'holyvial', 'panacea'] };
function gshopState() {
  const d = today(); if (S.gshop && S.gshop.day === d) return S.gshop;
  const top = Math.max(1, ...S.advs.map(a => a.lv)), maxT = GTIERS.reduce((m, T, i) => (T.lv <= top + 4 ? i : m), 0), items = [];
  for (let i = 0; i < GSHOP.n * 6 && items.length < GSHOP.n; i++) {
    const t = Math.max(0, maxT - (rnd() < 0.5 ? 0 : rnd() < 0.6 ? 1 : 2)), b = dropBase(t); if (!GTYPES[b] || GTYPES[b].ammo || !tierOk(b, t)) continue;
    const g = makeGear(b, t, rnd() < GSHOP.fine ? 1 : 0); items.push({ g, price: Math.max(50, Math.round(gearValue(g) * GSHOP.mul / 10) * 10) });
  }
  return (S.gshop = { day: d, items });
}
function gshopBuy(i) {
  const G = gshopState(), o = G.items[i]; if (!o) return ''; if (S.gold < o.price) return '돈이 모자라요.'; if (!roomGear(1)) return WH_FULL;
  S.gold -= o.price; S.stats.spent = (S.stats.spent || 0) + o.price; S.gear.push(o.g); G.items.splice(i, 1); log(`협회 장비 상점에서 ${gearName(o.g)}을(를) 샀다. (${g$(o.price)})`); changed(); return `${gearName(o.g)}을(를) 샀다`;
}
PANELS.gearshop = () => {
  const G = gshopState();
  const rows = G.items.map((o, i) => `<div class="li">${gArt(o.g, 1)}<div class="grow stack"><span>${gearName(o.g)} ${qTag(o.g)} <span class="muted">· ${gearWho(o.g.base)} · Lv${gearReqLv(o.g)}+</span></span><span class="sub">${statLine(gearStats(o.g))}</span></div><button type="button" class="btn sm gold" data-act="gshopbuy" data-i="${i}"${S.gold < o.price ? ' disabled' : ''}>${fmt(o.price)}G</button></div>`).join('');
  return `<div class="card"><div class="h">협회 장비 상점</div><div class="sub">협회의 대장장이들이 만든 장비를 팔아요. 물건은 날마다 새벽에 바뀌어요. 대장간에서 직접 만들면 더 싸고 좋은 레어도를 노릴 수 있어요.</div></div>
    <div class="sec"><b>오늘의 장비</b><span>${G.items.length}점</span></div><div class="list">${rows || '<div class="li"><span class="sub">오늘 물건은 다 팔렸어요.</span></div>'}</div>`;
};
const pshopPrice = k => (ITEMS[k].buy ? buyPrice(k) : Math.round(ITEMS[k].v * PSHOP.mul / 5) * 5);
function pshopBuy(k, n) {
  if (!ITEMS[k] || !PSHOP.ids.includes(k)) return ''; const cost = pshopPrice(k) * n; if (S.gold < cost) return '돈이 모자라요.'; if (!roomItem(k)) return WH_FULL;
  S.gold -= cost; S.stats.spent = (S.stats.spent || 0) + cost; addTo(S.inv, k, n); changed(); return `${ITEMS[k].name} ${n}개를 샀다`;
}
PANELS.potshop = () => {
  const rows = PSHOP.ids.filter(k => ITEMS[k]).map(k => { const pr = pshopPrice(k), I = ITEMS[k];
    return `<div class="li">${iconImg(k)}<div class="grow stack"><span>${I.name} <b class="num">×${S.inv[k] || 0}</b></span><span class="sub">${I.heal ? `HP ${I.heal} 회복` : I.mana ? `MP ${I.mana} 회복` : esc(I.desc || '')} · ${fmt(pr)}G</span></div><div class="btns"><button type="button" class="btn sm gold" data-act="pshopbuy" data-k="${k}" data-n="1"${S.gold < pr ? ' disabled' : ''}>1개</button><button type="button" class="btn sm" data-act="pshopbuy" data-k="${k}" data-n="10"${S.gold < pr * 10 ? ' disabled' : ''}>10개</button></div></div>`; }).join('');
  return `<div class="card"><div class="h">협회 포션 상점</div><div class="sub">협회의 연금술사들이 만든 포션과 치료약을 팔아요. 길드 본부의 연금술 연구실에서 약초로 직접 만들면 더 싸요.</div></div><div class="list">${rows}</div>`;
};
Object.assign(ACT, { gshopbuy: d => say(gshopBuy(+d.i)), pshopbuy: d => say(pshopBuy(d.k, +d.n)) });
