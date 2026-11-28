/* ───────── 빌드 79: 데모(1층) 사육장 — 협회 알 상점 · 뿔토끼 새끼 · 낟알 경단 · 펫 레벨은 먹이로만 (11-28 대표님 — 회의 e9 · ai-meeting decisions.md) ─────────
   · 사육장 짓기 800G(F랭크부터) · 알은 협회에서 1,500G(첫 알 할인 없음 — 「초반에 바로 못 사게 조금 비싸게」) · 산 알도 유정란 · 부화 판정을 한다(data-food68.js: 40% · 20 ~ 50%)
   · 1층 동료 셋: 들쥐 새끼 · 새끼 늑대 · 뿔토끼 새끼(새로). 슬라임은 늪지로 옮겼다. 데모(1층)에서는 원정 중 알이 떨어지지 않는다 — 알은 협회에서만
   · 먹이: 1층 먹이 「낟알 경단」(벼 1 + 들쥐 꼬리 2, 길드 주방에서 빚음 · 협회에서도 조금 비싸게). 하루 제한 없음. 먹이마다 경험치 · 호감도 값이 다르다(다른 층 먹이일수록 더 큼)
   · 펫 레벨은 먹이를 먹어서만 오른다(싸움 경험치 없음) · 무정란은 라비린토스 시장에서 300G */
BUILDINGS.pen.cost[0] = 800;
PETS.slime.field = 'swamp';   // 11-25: 슬라임은 늪지 몬스터
PETS.rabbit = { name: '뿔토끼 새끼', mon: 'rabbit', field: 'plains', act: 'guard', pow: 1.0, cd: 8, likes: [], home: ['rest', 0.06], evo: '뿔토끼 대장', c: '#d8c8a8',
  desc: '가장 다친 동료 앞에서 뿔을 세워 막아 준다. 길드에 두면 숙면 회복이 는다.' };
if (!PET_IDS.includes('rabbit')) PET_IDS.push('rabbit');
// 새끼 그림 (pxpet.js와 같은 꼴 — 반 칸 격자를 두 배로): 귀 둘 · 이마의 작은 뿔
{ const rows = ['.Y....C.', '.C...C..', '.CC.CC..', '.CCCCCC.', '.CeCCCCK', 'CCCCCCw.', '.cc..cc.'], W = 8;
  const g = ['.'.repeat(W * 2 + 1)].concat(rows.map(r => '.' + r.split('').map(ch => ch + ch).join('')).flatMap(r => [r, r])).join('\n');
  PXM.pet_rabbit = { g: '\n' + g + '\n', pal: { e: '#2a1e1e', K: '#4a3a30', w: '#f4f0e8', Y: '#e8d078' } };
  const m = MONS.rabbit; MONS.pet_rabbit = { name: PETS.rabbit.name, plan: 'pet', body: m.body || m.skin || '#d8c8a8', dark: m.dark, skin: m.skin, mh: 0, ma: 0, md: 0, spd: 1, pet: 'rabbit', drops: [] }; }
ITEMS.egg_rabbit = Object.assign({}, ITEMS.egg_rat, { name: `${MONS.rabbit.name} 알 (?)`, c: PETS.rabbit.c, egg: 'rabbit',
  desc: `사육장에서 ${PET_HATCH_DAYS}일 품으면 판정 — 유정란이고 부화에 성공하면 뿔토끼 새끼이(가) 태어나고, 아니면 요리 재료 「무정란」이 된다. ${PETS.rabbit.desc}` });

// 먹이 (먹이마다 경험치 · 호감도)
const PET_FOOD79 = { pf_grain: { exp: 120, aff: 4, need: { mm_scarecrow: 1, rat_tail: 2 }, buy: 180 } };
ITEMS.pf_grain = { name: '낟알 경단', v: 40, w: 1, icon: 'blob', c: '#e0c070', petFood: 1, keep: 1, desc: '벼 낟알에 들쥐 꼬리를 다져 넣어 빚은 펫 먹이. 펫 경험치 +120 · 호감도 +4.' };
for (const k of PET_IDS) PETS[k].likes = Object.keys(PET_FOOD79);
feedWhy = function (pet, it) {   // eslint-disable-line no-func-assign
  if (!pet) return '';
  if (!PET_FOOD79[it]) return '펫 먹이가 아니에요.';
  if ((S.inv[it] || 0) < 1) return `${ITEMS[it].name}이(가) 창고에 없어요.`;
  if (pet.lv >= PET_MAX_LV && (pet.aff || 0) >= PET_AFF_MAX) return '더 자랄 수 없어요.';
  return '';
};
feed = function (pid, it) {   // eslint-disable-line no-func-assign
  const pet = petById(pid), why = feedWhy(pet, it); if (why) return why;
  const F = PET_FOOD79[it]; addTo(S.inv, it, -1);
  const gain = F.aff * (pet.trait === 'glutton' ? 2 : 1);
  pet.aff = Math.min(PET_AFF_MAX, (pet.aff || 0) + gain);
  const lv0 = pet.lv; petExp(pet, F.exp);
  let msg = `${pet.name}이(가) ${ITEMS[it].name}을(를) 맛있게 먹었다. 경험치 +${F.exp} · 호감도 +${gain}${pet.lv > lv0 ? ` · Lv${pet.lv}!` : ''}`;
  if (pet.aff >= PET_AFF_MAX && !pet.trait) {
    pet.trait = pickOne(Object.keys(PET_TRAITS));
    msg += ` · 호감도가 가득 차 특성 「${PET_TRAITS[pet.trait].name}」이 생겼다!`;
    queueModal({ title: '펫 특성', pet: pet.id, body: [`${pet.name}이(가) 당신을 완전히 따르게 됐다.`, `특성 「${PET_TRAITS[pet.trait].name}」: ${PET_TRAITS[pet.trait].desc}`] });
  }
  log(msg, 'good'); changed();
  return '';
};
// 싸움 경험치 없음 · 1층(데모)에서는 알이 떨어지지 않는다
const _petKill79 = petKill;
petKill = function (p, e, f, xp) {   // eslint-disable-line no-func-assign
  if (e && e.field === 'plains') { const pet = petOfParty(p); if (pet) pet.kills = (pet.kills || 0) + 1; return; }
  return _petKill79(p, e, f, 0);
};
// 낟알 경단 빚기 (길드 주방)
function pfMakeWhy(it, n) {
  const F = PET_FOOD79[it]; if (!F) return '';
  if (!S.bld.kitchen) return '길드 주방이 있어야 빚어요.';
  for (const k in F.need) if ((S.inv[k] || 0) < F.need[k] * n) return `${ITEMS[k].name}이(가) 모자라요.`;
  if (!roomItem(it, 0)) return WH_FULL;
  return '';
}
function pfMake(it, n) {
  const w = pfMakeWhy(it, n); if (w) return w;
  const F = PET_FOOD79[it]; for (const k in F.need) addTo(S.inv, k, -F.need[k] * n);
  addTo(S.inv, it, n); changed(); return `${ITEMS[it].name} ${n}개를 빚었다.`;
}

// 협회 알 상점 (모험가 협회 로비 · 사육장 창)
const EGG79 = { ids: ['egg_rat', 'egg_wolf', 'egg_rabbit'], price: 1500 };
function eggBuyWhy(k) {
  if (!S.bld.pen) return '사육장이 있어야 알을 살 수 있어요.';
  if (S.gold < EGG79.price) return '돈이 모자라요.';
  if (!roomItem(k)) return WH_FULL;
  return '';
}
function eggBuy(k) {
  if (!EGG79.ids.includes(k)) return ''; const w = eggBuyWhy(k); if (w) return w;
  S.gold -= EGG79.price; S.stats.spent = (S.stats.spent || 0) + EGG79.price; addTo(S.inv, k, 1);
  log(`협회에서 ${ITEMS[k].name}을(를) 샀다. (${g$(EGG79.price)})`); changed(); return `${ITEMS[k].name}을(를) 샀다`;
}
function pfBuy(it) {
  const F = PET_FOOD79[it]; if (!F) return ''; if (S.gold < F.buy) return '돈이 모자라요.'; if (!roomItem(it)) return WH_FULL;
  S.gold -= F.buy; S.stats.spent = (S.stats.spent || 0) + F.buy; addTo(S.inv, it, 1); changed(); return `${ITEMS[it].name}을(를) 샀다`;
}
function eggShopBox() {
  const eggs = EGG79.ids.map(k => { const P = PETS[ITEMS[k].egg], w = eggBuyWhy(k);
    return `<div class="li">${iconImg(k)}<div class="grow stack"><span>${ITEMS[k].name} <b class="num">×${S.inv[k] || 0}</b></span><span class="sub">${esc(P.desc)} · ${fmt(EGG79.price)}G</span>${w ? `<span class="sub red-t">${esc(w)}</span>` : ''}</div>
      <button type="button" class="btn sm gold" data-act="eggbuy" data-k="${k}"${w ? ' disabled' : ''}>사기</button></div>`; }).join('');
  const foods = Object.keys(PET_FOOD79).map(it => { const F = PET_FOOD79[it], mk = pfMakeWhy(it, 1);
    return `<div class="li">${iconImg(it)}<div class="grow stack"><span>${ITEMS[it].name} <b class="num">×${S.inv[it] || 0}</b></span><span class="sub">경험치 +${F.exp} · 호감도 +${F.aff} · 협회 ${fmt(F.buy)}G · 주방에서 ${Object.entries(F.need).map(([k, q]) => `${ITEMS[k].name} ${q}`).join(' + ')}</span></div>
      <div class="btns"><button type="button" class="btn sm" data-act="pfbuy" data-k="${it}"${S.gold < F.buy ? ' disabled' : ''}>사기</button><button type="button" class="btn sm" data-act="pfmake" data-k="${it}"${mk ? ` disabled title="${esc(mk)}"` : ''}>빚기</button></div></div>`; }).join('');
  return `<div class="sec"><b>협회 알 상점</b><span>몬스터 알 · 사육장이 있어야 사요</span></div><div class="list">${eggs}</div>
    <div class="sub muted">산 알도 품어 봐야 안다: 유정란 ${Math.round(PEN_FERTILE * 100)}% · 부화는 사육장 레벨에 따라 ${Math.round(PEN_HATCH[0] * 100)} ~ ${Math.round(PEN_HATCH[PEN_HATCH.length - 1] * 100)}%. 실패하면 무정란(요리 재료).</div>
    <div class="sec"><b>펫 먹이</b><span>펫 레벨은 먹이로만 올라요 · 하루 제한 없음</span></div><div class="list">${foods}</div>`;
}
const _assocPanel79 = PANELS.assoc;
PANELS.assoc = () => _assocPanel79() + `<div class="card">${eggShopBox()}</div>`;
const _penBox79 = penBox;
penBox = function () { return _penBox79() + `<div class="card">${eggShopBox()}</div>`; };   // eslint-disable-line no-func-assign
KITCHEN_BUY.egg_none = 300;   // 무정란 (라비린토스 시장)
Object.assign(ACT, { eggbuy: d => say(eggBuy(d.k)), pfbuy: d => say(pfBuy(d.k)), pfmake: d => say(pfMake(d.k, 1)) });
