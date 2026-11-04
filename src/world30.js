/* ───────── 빌드 30: 마구간 · 도서관 · 비행장 · 상단 랭킹 · 변경·하늘 지도 그림 ─────────
   데이터는 data-sky.js, 몬스터 그림은 pxmon3.js, 풍경은 sky.js. 희귀종·둥지·보물 던전의 전투 쪽은 core.js/events.js. */
Object.assign(WIN_TITLE, { co_league: '상단 랭킹' });
const FLOOR_TXT = {
  stable: () => `말 ${stableHorses().length}/${stableCap()}마리 · 마차 ${S.parties.filter(p => p.wagon).length}대`,
  library: () => `양피지 ${S.inv.parchment || 0} · 먹물 ${S.inv.ink || 0} · 스킬북 ${Object.keys(S.inv).filter(k => k.startsWith('book_') && S.inv[k] > 0).length}종`,
  airfield: () => (isUnlocked('sky') ? `구름섬 원정 가능 · 비행 마차 ${S.parties.filter(p => wagonFly(p)).length}대` : '구름섬은 세계수의 심장을 공략해야 열려요')
};

/* ───────── 마구간 ───────── */
const stableState = () => { if (!S.stable) S.stable = { horses: {} }; if (!S.stable.horses) S.stable.horses = {}; return S.stable; };
// 마구간의 말 목록: 산 말(종류별 여러 마리)과 맨 펫
function stableHorses() {
  const out = [], H = stableState().horses;
  for (const k of HORSE_BUY) for (let i = 0; i < (H[k] || 0); i++) out.push({ kind: k });
  for (const p of S.parties) if (p.horse && p.horse.startsWith('p:')) out.push({ kind: 'pet', pet: +p.horse.slice(2) });
  return out;
}
const horseUsed = k => S.parties.filter(p => p.horse === 'h:' + k).length;
const horseFree = k => Math.max(0, (stableState().horses[k] || 0) - horseUsed(k));
const horseOpen = k => (HORSES[k].lv || 1) <= (S.bld.stable || 0);
function buyHorse(k) {
  const H = HORSES[k]; if (!H || H.pet) return '';
  if (!S.bld.stable) return '마구간이 필요해요.';
  if (!horseOpen(k)) return `마구간 ${H.lv}단계부터 팔아요.`;
  if (stableHorses().length >= stableCap()) return `마구간이 가득 찼어요 (${stableCap()}마리). 넓히거나 말을 팔아요.`;
  if (S.gold < H.cost) return '돈이 모자라요.';
  S.gold -= H.cost; S.stats.spent = (S.stats.spent || 0) + H.cost;
  stableState().horses[k] = (stableState().horses[k] || 0) + 1;
  log(`마구간에 ${H.name}을(를) ${g$(H.cost)}에 들였다.`, 'good');
  changed();
  return '';
}
function sellHorse(k) {
  const H = HORSES[k]; if (!H || H.pet) return '';
  if (horseFree(k) < 1) return '팔 수 있는 말이 없어요 (마차에 매인 말은 먼저 풀어요).';
  const back = Math.round(H.cost * 0.5);
  stableState().horses[k]--; if (!stableState().horses[k]) delete stableState().horses[k];
  S.gold += back; S.stats.earned += back;
  log(`${H.name}을(를) ${g$(back)}에 팔았다.`);
  changed();
  return '';
}
// 말을 맨다: 'h:종류' 또는 'p:펫id'. 맨 펫은 그 파티의 전투 펫 자리에서 빠진다
function hitch(pid, key) {
  const p = findP(pid); if (!p) return '';
  if (p.exp) return '원정 중에는 말을 바꿀 수 없어요.';
  const w = wagonOwned(p); if (!w || !w.horse) return '말이 끄는 마차가 있어야 매요.';
  const fits = H => (w.horse === 'goat' ? !!H.steel : w.horse === 'fly' ? !!H.fly : true);
  if (key.startsWith('h:')) {
    const k = key.slice(2), H = HORSES[k]; if (!H || H.pet) return '';
    if (!fits(H)) return `${w.name}은(는) ${w.horse === 'goat' ? '고산지대 산양' : '그리폰·와이번·페가수스'}만 끌 수 있어요.`;
    if (p.horse !== key && horseFree(k) < 1) return `남는 ${H.name}이(가) 없어요.`;
  } else {
    const pet = petById(+key.slice(2)); if (!pet) return '';
    const hk = horseOfPet(pet.kind); if (!hk) return `${PETS[pet.kind].name}은(는) 마차를 끌 수 없어요.`;
    if (!fits(HORSES[hk])) return `${w.name}은(는) ${w.horse === 'goat' ? '고산지대 산양' : '그리폰·와이번·페가수스'}만 끌 수 있어요.`;
    if (!pet.stage) return `${pet.name}은(는) 아직 망아지예요. Lv${PET_EVO_LV}에 진화하면 끌 수 있어요.`;
    const other = S.parties.find(x => x.horse === key && x.id !== p.id), fighter = S.parties.find(x => x.pet === pet.id);
    if (other && other.exp) return `${pet.name}은(는) ${other.name}의 마차를 끌고 원정 중이에요.`;
    if (fighter && fighter.exp) return `${pet.name}은(는) ${fighter.name}과 원정 중이에요.`;
    if (other) other.horse = null;
    if (fighter) fighter.pet = null;   // 마차를 끄는 펫은 싸우지 않는다
  }
  p.horse = key;
  const h = horseOf(p);
  log(`${p.name}의 ${w.name}에 ${h ? (h.petName ? `펫 ${h.petName}(${h.name})` : h.name) : '말'}을(를) 맸다.`);
  changed();
  return '';
}
function unhitch(p) { if (!p || !p.horse) return ''; if (p.exp) return '원정 중에는 풀 수 없어요.'; p.horse = null; changed(); return ''; }
// 마차 강화: 돈 + 강철 편자 + 철광석. 마구간 단계가 상한을 정한다
const wagonPlusMax = () => Math.min(WAGON_PLUS_MAX, (S.bld.stable || 0) + 2);
function enhanceWagon(pid) {
  const p = findP(pid); if (!p || !p.wagon) return '';
  if (p.exp) return '원정 중에는 강화할 수 없어요.';
  const n = wagonPlus(p);
  if (n >= wagonPlusMax()) return n >= WAGON_PLUS_MAX ? '더 강화할 수 없어요.' : `마구간을 넓혀야 +${n + 1}로 강화해요.`;
  const c = wagonPlusCost(p.wagon, n);
  if (S.gold < c.gold) return '돈이 모자라요.';
  if ((S.inv.horseshoe || 0) < c.shoe) return `강철 편자 ${c.shoe}개가 필요해요.`;
  if ((S.inv.iron_ore || 0) < c.ore) return `철광석 ${c.ore}개가 필요해요.`;
  S.gold -= c.gold; S.stats.spent = (S.stats.spent || 0) + c.gold; addTo(S.inv, 'horseshoe', -c.shoe); addTo(S.inv, 'iron_ore', -c.ore);
  p.wagonPlus = n + 1;
  log(`${p.name}의 ${WAGONS[p.wagon].name}을(를) +${p.wagonPlus}로 강화했다. 짐 +${Math.round(WAGON_PLUS.cap * p.wagonPlus * 100)}%, 속도 +${Math.round(WAGON_PLUS.spd * p.wagonPlus * 100)}%`, 'good');
  changed();
  return '';
}
function buyShoe(n) {
  const cost = ITEMS.horseshoe.buy * n;
  if (S.gold < cost) return '돈이 모자라요.';
  S.gold -= cost; S.stats.spent = (S.stats.spent || 0) + cost; addTo(S.inv, 'horseshoe', n);
  changed();
  return `강철 편자 ${n}개를 샀어요.`;
}
const horseLine = k => { const H = HORSES[k]; return `짐 ×${H.cap} · 속도 ×${H.spd}${H.fly ? ' · 비행' : ''}${H.steel ? ' · 강철 마차' : ''}`; };
BLD_SUM.stable = () => `<div class="sub">말 ${stableHorses().length}/${stableCap()}마리 · 마차 ${S.parties.filter(p => p.wagon).length}대 · 강화 +${wagonPlusMax()}까지</div>`;
BLD_BOX.stable = () => {
  const parties = S.parties, sp = parties.find(p => p.id === UI.stableP) || parties[0];
  const picker = parties.length ? `<div class="btns">${parties.map(p => `<button type="button" class="btn sm${sp && sp.id === p.id ? ' on' : ''}" data-act="stablep" data-id="${p.id}">${esc(p.name)}<span class="muted"> · ${p.wagon ? rigName(p) : '마차 없음'}</span></button>`).join('')}</div>` : '<div class="sub muted">파티가 없어요.</div>';
  // 1) 고른 파티의 마차
  let rig = '';
  if (sp) {
    const w = wagonOwned(sp), h = horseOf(sp), why = wagonWhy(sp), busy = !!sp.exp;
    const bodies = WAGON_IDS.map(k => { const W = WAGONS[k], own = sp.wagon === k, open = wagonOpen(k), back = wagonBack(sp);
      return `<div class="li${own ? ' on' : ''}"><div class="grow stack"><span>${W.name} <span class="muted">짐 +${W.cap} · 이동 ×${W.spd}${W.horse === 'goat' ? ' · 산양' : W.horse === 'fly' ? ' · 날개 달린 펫' : W.horse ? ' · 말 필요' : ''}</span></span><span class="sub muted">${W.desc}${open ? '' : ` ${wagonOpenWhy(k)}.`}</span></div>${own ? '<span class="tag gold-t">쓰는 중</span>' : `<button type="button" class="btn sm" data-act="wagon" data-id="${sp.id}" data-w="${k}"${open && !busy && S.gold + back >= W.cost ? '' : ' disabled'}>${fmt(Math.max(0, W.cost - back))}G</button>`}</div>`; }).join('');
    const horses = w && w.horse ? HORSE_BUY.filter(k => (stableState().horses[k] || 0) > 0).map(k => { const H = HORSES[k], on = sp.horse === 'h:' + k, ok = on || horseFree(k) > 0;
      return `<div class="li${on ? ' on' : ''}"><img class="peti" src="${monIconURL('horse_' + k)}" alt=""><div class="grow stack"><span>${H.name} <span class="muted">· ${stableState().horses[k]}마리 (남음 ${horseFree(k)})</span></span><span class="sub">${horseLine(k)}${w.horse === 'goat' ? ' · <span class="red-t">강철 마차는 산양만</span>' : w.horse === 'fly' ? ' · <span class="red-t">비행 마차는 날개 달린 펫만</span>' : ''}</span></div>${on ? `<button type="button" class="btn sm" data-act="unhitch" data-id="${sp.id}"${busy ? ' disabled' : ''}>풀기</button>` : `<button type="button" class="btn sm gold" data-act="hitch" data-id="${sp.id}" data-h="h:${k}"${ok && !busy && w.horse === 1 ? '' : ' disabled'}>매기</button>`}</div>`; }).join('') : '';
    const petRows = w && w.horse ? S.pets.filter(x => horseOfPet(x.kind)).map(x => { const k = horseOfPet(x.kind), H = HORSES[k], on = sp.horse === 'p:' + x.id, fit = w.horse === 1 || (w.horse === 'goat' && H.steel) || (w.horse === 'fly' && H.fly), used = S.parties.find(q => q.horse === 'p:' + x.id && q.id !== sp.id), inParty = S.parties.find(q => q.pet === x.id);
      return `<div class="li${on ? ' on' : ''}">${petIcon(x)}<div class="grow stack"><span>${esc(x.name)} <span class="muted">· ${x.stage ? PETS[x.kind].evo : PETS[x.kind].name} Lv${x.lv}</span></span><span class="sub">${H.name}: ${horseLine(k)}${!x.stage ? ` · <span class="red-t">Lv${PET_EVO_LV} 진화 후</span>` : !fit ? ' · <span class="red-t">이 마차는 못 끌어요</span>' : ''}${used ? ` · ${esc(used.name)}의 마차를 끄는 중` : inParty ? ` · ${esc(inParty.name)}과 싸우는 중(매면 빠져요)` : ''}</span></div>${on ? `<button type="button" class="btn sm" data-act="unhitch" data-id="${sp.id}"${busy ? ' disabled' : ''}>풀기</button>` : `<button type="button" class="btn sm gold" data-act="hitch" data-id="${sp.id}" data-h="p:${x.id}"${x.stage && fit && !busy ? '' : ' disabled'}>매기</button>`}</div>`; }).join('') : '';
    const n = wagonPlus(sp), c = sp.wagon ? wagonPlusCost(sp.wagon, n) : null, canPlus = sp.wagon && n < wagonPlusMax();
    rig = `<div class="card hl"><div class="h">${esc(sp.name)} · ${sp.wagon ? rigName(sp) : '마차 없음'}</div>
      <div class="sub">${sp.wagon ? `짐 +${wagonCap(sp) || 0} · 이동 ×${wagonSpd(sp).toFixed(2)}${h ? ` · 끄는 ${h.petName ? `펫 ${esc(h.petName)}(${h.name})` : h.name}` : ''}${why ? ` · <span class="red-t">${why}</span>` : ''}` : '아래에서 마차를 고르고, 말을 매요.'}${porterOf(sp) ? ` · 짐꾼 ${esc(porterOf(sp).name)}` : sp.wagon && sp.wagon !== 'cart' ? ' · <span class="red-t">짐꾼 계열 없음</span>' : ''}${busy ? ' · <span class="muted">원정 중</span>' : ''}</div>
      ${sp.wagon && sp.wagon !== 'cart' ? `<div class="row sub"><span class="grow">강화 +${n}/${wagonPlusMax()} <span class="muted">· 단계마다 짐 +${Math.round(WAGON_PLUS.cap * 100)}%, 속도 +${Math.round(WAGON_PLUS.spd * 100)}%${c && canPlus ? ` · 다음: ${fmt(c.gold)}G · 강철 편자 ${c.shoe}(창고 ${S.inv.horseshoe || 0}) · 철광석 ${c.ore}(창고 ${S.inv.iron_ore || 0})` : ''}</span></span><button type="button" class="btn sm gold" data-act="wplus" data-id="${sp.id}"${canPlus && !busy && S.gold >= c.gold && (S.inv.horseshoe || 0) >= c.shoe && (S.inv.iron_ore || 0) >= c.ore ? '' : ' disabled'}>${n >= WAGON_PLUS_MAX ? '최대' : n >= wagonPlusMax() ? '마구간 확장 필요' : `+${n + 1} 강화`}</button></div>` : ''}</div>
      <div class="sec"><b>마차 몸체</b><span>바꾸면 쓰던 마차는 반값에 넘기고 강화는 사라져요</span></div><div class="list">${bodies}</div>
      ${w && w.horse ? `<div class="sec"><b>맬 말</b><span>${w.horse === 'goat' ? '고산지대 산양' : w.horse === 'fly' ? '그리폰·와이번·페가수스' : '마구간의 말 또는 다 자란 펫'}</span></div><div class="list">${horses}${petRows}${horses || petRows ? '' : '<div class="sub muted">맬 말이 없어요. 아래에서 말을 사거나, 사육장에서 적토마·켈피·페가수스·산양·그리폰·와이번을 키워요.</div>'}</div>` : ''}`;
  }
  // 2) 말 사고팔기
  const shop = HORSE_BUY.map(k => { const H = HORSES[k], own = stableState().horses[k] || 0, open = horseOpen(k);
    return `<div class="li${own ? ' on' : ''}"><img class="peti" src="${monIconURL('horse_' + k, !open)}" alt=""><div class="grow stack"><span>${H.name}${own ? ` <span class="tag ok-t">${own}마리</span>` : ''} <span class="muted">· ${horseLine(k)}</span></span><span class="sub">${H.desc}${open ? '' : ` <span class="red-t">마구간 ${H.lv}단계</span>`}</span></div><span class="btns"><button type="button" class="btn sm gold" data-act="buyhorse" data-k="${k}"${open && S.gold >= H.cost && stableHorses().length < stableCap() ? '' : ' disabled'}>${fmt(H.cost)}G</button>${own ? `<button type="button" class="btn sm" data-act="sellhorse" data-k="${k}"${horseFree(k) ? '' : ' disabled'}>팔기 ${fmt(Math.round(H.cost * 0.5))}G</button>` : ''}</span></div>`; }).join('');
  const petHorses = HORSE_IDS.filter(k => HORSES[k].pet).map(k => `<span class="tag">${HORSES[k].name} ${horseLine(k)}</span>`).join(' ');
  return `<div class="sub">말은 마차 몸체의 짐과 속도에 배율로 곱해요. 손수레 말고는 짐꾼 계열(짐꾼·음유시인·마부·정찰가…)이 파티에 있어야 끌고, 짐꾼 계열은 파티당 한 명만 넣어요. 마부가 몰면 짐과 속도 보너스가 더 붙어요.</div>
    <div class="sec"><b>파티 고르기</b><span>마차·말·강화는 파티마다</span></div>${picker}${rig}
    <div class="sec"><b>말 사기</b><span>마구간 ${stableHorses().length}/${stableCap()}마리</span></div><div class="list">${shop}</div>
    <div class="row sub"><span class="grow">강철 편자 <b class="num">${S.inv.horseshoe || 0}</b> <span class="muted">· 마차 강화 재료 · 하나 ${ITEMS.horseshoe.buy}G</span></span><button type="button" class="btn sm" data-act="buyshoe" data-n="1"${S.gold >= ITEMS.horseshoe.buy ? '' : ' disabled'}>1개</button><button type="button" class="btn sm" data-act="buyshoe" data-n="5"${S.gold >= ITEMS.horseshoe.buy * 5 ? '' : ' disabled'}>5개</button></div>
    <div class="sub muted">펫으로 매는 말(사육장에서 알을 부화시키고 Lv${PET_EVO_LV}에 진화): ${petHorses}</div>`;
};

/* ───────── 도서관: 스킬북 제작 ───────── */
const libBooks = () => BOOK_IDS.filter(sk => bookRecipe(sk) && ITEMS['book_' + sk]).sort((a, b) => SKILLS[a].lv - SKILLS[b].lv);
function craftBook(sk) {
  if (!S.bld.library) return '도서관이 필요해요.';
  const R = bookRecipe(sk); if (!R) return '만들 수 없는 책이에요.';
  if (SKILLS[sk].lv > LIB_MAXLV[S.bld.library]) return `도서관을 넓혀야 Lv${SKILLS[sk].lv} 스킬북을 만들어요.`;
  if (S.gold < R.fee) return '돈이 모자라요.';
  const short = Object.entries(R.need).find(([k, q]) => (S.inv[k] || 0) < q);
  if (short) return `${ITEMS[short[0]].name}이(가) ${short[1] - (S.inv[short[0]] || 0)}개 모자라요.`;
  S.gold -= R.fee; S.stats.spent = (S.stats.spent || 0) + R.fee;
  Object.entries(R.need).forEach(([k, q]) => addTo(S.inv, k, -q));
  addTo(S.inv, 'book_' + sk, 1); S.stats.books = (S.stats.books || 0) + 1;
  if (S.dex) { S.dex.items = S.dex.items || {}; S.dex.items['book_' + sk] = 1; }
  log(`도서관에서 「${ITEMS['book_' + sk].name}」을(를) 만들었다. (${g$(R.fee)})`, 'good');
  changed();
  return '';
}
function buyLibMat(k, n) {
  const I = ITEMS[k]; if (!I || !I.buy) return '';
  const cost = I.buy * n;
  if (S.gold < cost) return '돈이 모자라요.';
  S.gold -= cost; S.stats.spent = (S.stats.spent || 0) + cost; addTo(S.inv, k, n);
  changed();
  return `${I.name} ${n}개를 샀어요.`;
}
BLD_SUM.library = () => `<div class="sub">양피지 ${S.inv.parchment || 0} · 먹물 ${S.inv.ink || 0} · Lv${LIB_MAXLV[S.bld.library]}까지 제작</div>`;
BLD_BOX.library = () => {
  const tab = UI.libTab || 'all', groups = [['all', '전체'], ['warrior', '전사'], ['archer', '궁수'], ['mage', '마법사'], ['cleric', '성직자'], ['rogue', '도적'], ['porter', '짐꾼'], ['any', '누구나']];
  const ids = libBooks().filter(sk => tab === 'all' || (tab === 'any' ? SKILLS[sk].cls.includes('all') : SKILLS[sk].cls.some(c => c === tab || jobBase(c) === tab)));
  const bar = `<div class="tabs">${groups.map(([id, n]) => `<button type="button" class="tab${tab === id ? ' on' : ''}" data-act="libtab" data-t="${id}">${n}</button>`).join('')}</div>`;
  const maxLv = LIB_MAXLV[S.bld.library];
  const rows = ids.map(sk => { const s = SKILLS[sk], R = bookRecipe(sk), ok = s.lv <= maxLv, have = S.inv['book_' + sk] || 0, can = ok && S.gold >= R.fee && Object.entries(R.need).every(([k, q]) => (S.inv[k] || 0) >= q);
    return `<div class="li${can ? '' : ok ? '' : ' dim'}">${iconImg('book_' + sk)}<div class="grow stack"><span>${ITEMS['book_' + sk].name} <span class="muted">· Lv${s.lv} ${clsList(s.cls)}${have ? ` · 창고 ${have}권` : ''}</span></span><span class="sub">${s.desc}</span><span class="sub muted">${ok ? `${needStr(R.need)} · ${fmt(R.fee)}G` : `도서관 ${LIB_MAXLV.findIndex(v => v >= s.lv)}단계부터`}</span></div><button type="button" class="btn sm gold" data-act="libcraft" data-sk="${sk}"${can ? '' : ' disabled'}>만들기</button></div>`; }).join('');
  return `<div class="sub">스킬북은 양피지·먹물과 그 책을 떨어뜨리는 몬스터의 부속품으로 만들어요. 훈련소에서 배우고, 같은 책을 한 권 더 바치면 스킬 단계를 올려요. 지금은 Lv${maxLv} 책까지.</div>
    <div class="row sub"><span class="grow">양피지 <b class="num">${S.inv.parchment || 0}</b> <span class="muted">· 하나 ${ITEMS.parchment.buy}G</span></span><button type="button" class="btn sm" data-act="libbuy" data-k="parchment" data-n="5"${S.gold >= ITEMS.parchment.buy * 5 ? '' : ' disabled'}>5개</button><button type="button" class="btn sm" data-act="libbuy" data-k="parchment" data-n="20"${S.gold >= ITEMS.parchment.buy * 20 ? '' : ' disabled'}>20개</button></div>
    <div class="row sub"><span class="grow">먹물 <b class="num">${S.inv.ink || 0}</b> <span class="muted">· 하나 ${ITEMS.ink.buy}G</span></span><button type="button" class="btn sm" data-act="libbuy" data-k="ink" data-n="5"${S.gold >= ITEMS.ink.buy * 5 ? '' : ' disabled'}>5개</button><button type="button" class="btn sm" data-act="libbuy" data-k="ink" data-n="20"${S.gold >= ITEMS.ink.buy * 20 ? '' : ' disabled'}>20개</button></div>
    ${bar}<div class="list">${rows || '<div class="sub muted">만들 수 있는 책이 없어요.</div>'}</div>`;
};

/* ───────── 비행장: 비행 마차 제작 · 구름섬 원정 ───────── */
function skyGo(pid) {
  const p = findP(pid); if (!p) return '';
  if (p.exp) return '원정 중인 파티예요.';
  p.dest = 'sky';
  const m = startExp(p, 'sky');
  if (m) return m;
  S.view = p.id; renderChips();
  return '';
}
BLD_SUM.airfield = () => `<div class="sub">${isUnlocked('sky') ? `구름섬 원정 가능 · 비행 마차를 단 파티 ${S.parties.filter(p => wagonFly(p)).length}대` : '구름섬은 세계수의 심장을 공략하면 열려요'}</div>`;
BLD_BOX.airfield = () => {
  const open = isUnlocked('sky'), F = FIELDS.sky, fs = S.fields.sky || {};
  const nb = [1, 2, 3, 4, 5].filter(k => fs.boss && fs.boss[k]).length;
  const rows = S.parties.map(p => { const team = teamOf(p), avg = Math.round(avgLvOf(p)), block = team.map(cantGo).filter(Boolean), fly = wagonFly(p), W = WAGONS.sky;
    const why = p.exp ? `원정 중 · ${whereStr(p.exp)}` : !team.length ? '파티원이 없어요' : !fly ? (p.wagon === 'sky' ? wagonWhy(p) : '비행 마차가 없어요') : portersOf(p).length > 1 ? '짐꾼 계열은 한 명만' : block.length ? block[0] : !open ? '구름섬이 아직 안 열렸어요' : '';
    const buy = p.wagon === 'sky' ? '' : `<button type="button" class="btn sm" data-act="wagon" data-id="${p.id}" data-w="sky"${!p.exp && S.gold + wagonBack(p) >= W.cost ? '' : ' disabled'}>비행 마차 ${fmt(Math.max(0, W.cost - wagonBack(p)))}G</button>`;
    return `<div class="row sub rsend"><span class="grow">${esc(p.name)} <span class="muted">· ${team.length}명 · 평균 Lv${avg} · ${p.wagon ? rigName(p) : '마차 없음'}</span>${why ? `<br><span class="red-t">${esc(why)}</span>` : '<br><span class="ok-t">날아갈 준비가 됐어요</span>'}</span><button type="button" class="btn sm gold" data-act="skygo" data-id="${p.id}"${why ? ' disabled' : ''}>구름섬 출발</button></div>${buy ? `<div class="btns" style="margin-top:-2px;margin-bottom:6px">${buy}</div>` : ''}`; }).join('');
  return `<div class="card hl"><div class="h">${F.name} <small>Lv${F.lv}~${F.lv + 12}</small></div><div class="sub">${F.desc}</div><div class="sub ${open ? 'ok-t' : 'red-t'}">${open ? `열림 · 최고 ${F.no}-${fs.best || 0} · ${fs.cleared ? '던전★' : fs.found ? '던전 열림' : `보스 ${nb}/5`}` : F.unlock}</div></div>
    <div class="sub">비행 마차(${fmt(WAGONS.sky.cost)}G · 짐 +${WAGONS.sky.cap} · 이동 ×${WAGONS.sky.spd})는 여기서 만들어요. 마구간에서 그리폰·와이번·페가수스(다 자란 펫)를 매면 그리폰 마차·와이번 마차·페가수스 마차가 되고, 그래야 구름섬으로 날아가요. 비행장 2단계면 비행 마차 짐 +20%.</div>
    <div class="sec"><b>보낼 파티</b><span>보급품·목적지 거점은 원정대 창에서</span></div>${rows || '<div class="sub muted">파티가 없어요.</div>'}
    <div class="sub muted">하늘 지도는 지도 창의 「${SKY_NAME}」 탭에서 봐요. 구름섬에는 앞으로 새 필드와 던전이 더 생겨요.</div>`;
};

/* ───────── 상단 랭킹: 달마다 이웃 상단들과 겨룬다 ─────────
   점수 = 번 돈/50 + 명성 ×15 + 던전 공략 ×400 + 희귀종 ×100 + 보물 던전 ×150 + 둥지 ×120 (이달에 쌓은 만큼). 정산 때 등수 보상 */
function leagueState() {
  if (!S.league || S.league.month !== S.settleDay) leagueNew();
  return S.league;
}
function leagueNew() {
  const prev = S.league;
  const rv = RIVALS.slice().sort(() => rnd() - 0.5).slice(0, 5).map(r => ({ n: r.name, c: r.c, pw: 0.45 + rnd() * 0.9, s: 0 }));
  S.league = { month: S.settleDay, start: { earned: S.stats.earned || 0, fame: S.fame, dungeons: S.stats.dungeons || 0, rares: S.stats.rares || 0, tmaps: S.stats.tmaps || 0, nests: S.stats.nests || 0 }, rivals: rv, days: 0, last: prev && prev.last ? prev.last : null, title: prev ? prev.title : 0 };
  if (prev && prev.result) S.league.last = prev.result;
}
function leagueScore() {
  const L = leagueState(), s0 = L.start;
  return Math.max(0, Math.round(((S.stats.earned || 0) - s0.earned) / 50 + (S.fame - s0.fame) * 15 + ((S.stats.dungeons || 0) - s0.dungeons) * 400 + ((S.stats.rares || 0) - s0.rares) * 100 + ((S.stats.tmaps || 0) - s0.tmaps) * 150 + ((S.stats.nests || 0) - s0.nests) * 120));
}
const leagueStand = () => leagueState().rivals.map(r => ({ n: r.n, s: Math.round(r.s), c: r.c })).concat([{ n: S.company, s: leagueScore(), me: 1 }]).sort((x, y) => y.s - x.s);
const leagueTier = () => Math.max(0, ...TIER_FIELDS.filter(isUnlocked).map(f => FIELDS[f].tier));
// 날마다: 경쟁 상단들의 점수가 쌓인다 (상단이 간 땅이 높을수록 많이)
function leagueDay() {
  const L = leagueState(); L.days++;
  const base = LEAGUE.base * (1 + leagueTier() * 0.6) / MONTH_DAYS;
  for (const r of L.rivals) r.s += base * r.pw * (0.6 + rnd() * 0.8);
}
// 정산 때: 등수와 보상, 새 달 시작
function leagueMonth(lines) {
  const L = leagueState(), st = leagueStand(), my = st.findIndex(x => x.me), R = LEAGUE.rewards[my];
  const scale = LEAGUE.base * (1 + leagueTier());
  const res = { month: L.month, rank: my + 1, score: leagueScore(), top: st.slice(0, 4).map(x => ({ n: x.n, s: x.s, me: !!x.me })) };
  if (R) {
    const gold = Math.round(scale * R.gold / 10) * 10;
    S.gold += gold; S.stats.earned += gold; S.fame += R.fame; res.gold = gold; res.fame = R.fame;
    if (my === 0) { L.title = (L.title || 0) + 1; S.stats.leagueWins = (S.stats.leagueWins || 0) + 1; }
    lines.push(`상단 랭킹 ${my + 1}위! 상금 ${g$(gold)}, 명성 +${R.fame}${my === 0 ? ' · 「이달의 상단」 칭호' : ''}`);
  } else lines.push(`상단 랭킹 ${my + 1}위. (1위 ${st[0].n} ${fmt(st[0].s)}점, 우리 ${fmt(res.score)}점)`);
  L.result = res;
  log(`이달의 상단 랭킹: ${my + 1}위 (${fmt(res.score)}점)`, my < 3 ? 'good' : '');
}
PANELS.co_league = () => {
  const L = leagueState(), st = leagueStand(), my = st.findIndex(x => x.me), s0 = L.start, dd = S.settleDay - today();
  const rows = st.map((x, i) => `<div class="row sub${x.me ? ' gold-t' : ''}"><span class="rkn">${i + 1}</span><span class="grow">${esc(x.n)}</span><span class="num">${fmt(x.s)}</span></div>`).join('');
  const parts = [['번 돈', Math.round(((S.stats.earned || 0) - s0.earned) / 50), `${fmt((S.stats.earned || 0) - s0.earned)}G`], ['명성', (S.fame - s0.fame) * 15, `+${S.fame - s0.fame}`], ['던전 공략', ((S.stats.dungeons || 0) - s0.dungeons) * 400, `${(S.stats.dungeons || 0) - s0.dungeons}곳`], ['희귀종', ((S.stats.rares || 0) - s0.rares) * 100, `${(S.stats.rares || 0) - s0.rares}마리`], ['보물 던전', ((S.stats.tmaps || 0) - s0.tmaps) * 150, `${(S.stats.tmaps || 0) - s0.tmaps}번`], ['둥지 소탕', ((S.stats.nests || 0) - s0.nests) * 120, `${(S.stats.nests || 0) - s0.nests}번`]];
  const scale = LEAGUE.base * (1 + leagueTier());
  const rew = LEAGUE.rewards.map((R, i) => `<span class="tag">${i + 1}위 ${fmt(Math.round(scale * R.gold / 10) * 10)}G · 명성 +${R.fame}${R.title ? ' · 칭호' : ''}</span>`).join(' ');
  const last = L.last ? `<div class="sec"><b>지난달</b><span>${L.last.rank}위 · ${fmt(L.last.score)}점${L.last.gold ? ` · ${fmt(L.last.gold)}G` : ''}</span></div><div class="card">${L.last.top.map((x, i) => `<div class="row sub${x.me ? ' gold-t' : ''}"><span class="rkn">${i + 1}</span><span class="grow">${esc(x.n)}</span><span class="num">${fmt(x.s)}</span></div>`).join('')}</div>` : '';
  return `<div class="card hl"><div class="row"><span class="rk">${my + 1}위</span><div class="grow"><div class="h">${esc(S.company)} <small>${fmt(leagueScore())}점</small></div><div class="sub">정산까지 D-${dd} · 이웃 상단 ${L.rivals.length}곳과 겨루는 중${L.title ? ` · 이달의 상단 ${L.title}번` : ''}</div></div></div></div>
    <div class="sec"><b>이달 순위</b><span>날마다 경쟁 상단 점수가 쌓여요</span></div><div class="card">${rows}</div>
    <div class="sec"><b>우리 점수</b><span>이달에 쌓은 만큼</span></div><div class="card">${parts.map(([n, v, d]) => `<div class="row sub"><span class="grow">${n} <span class="muted">${d}</span></span><span class="num">${fmt(v)}</span></div>`).join('')}</div>
    <div class="sub">보상: ${rew}</div>${last}
    <div class="sub muted">점수: 번 돈 50G당 1 · 명성 1당 15 · 던전 공략 400 · 희귀종 100 · 보물 던전 150 · 둥지 소탕 120. 경쟁 상단은 우리가 연 땅이 높을수록 세져요.</div>`;
};

/* ───────── 지도 그림: 대륙 북쪽 변경과 하늘 ───────── */
MAP_EXTRA.push((g, r) => {
  // 안개 묘지 (서쪽, 평원 왼쪽): 잿빛 땅, 비석, 죽은 나무, 안개
  ell(g, 34, 112, 22, 14, '#5a5a6a'); ell(g, 32, 110, 14, 8, '#6a6a7a');
  for (let i = 0; i < 9; i++) { const x = 18 + Math.floor(r() * 32), y = 104 + Math.floor(r() * 16); R(g, x, y, 2, 3, '#9a9aa8'); R(g, x, y - 1, 2, 1, '#b8b8c8'); }
  for (const [tx, th] of [[22, 7], [44, 6], [36, 8]]) { R(g, tx, 118 - th, 1, th, '#2a2a30'); R(g, tx - 2, 120 - th, 2, 1, '#2a2a30'); R(g, tx + 1, 121 - th, 3, 1, '#2a2a30'); }
  for (let y = 102; y < 124; y += 3) R(g, 12 + (y % 2) * 4, y, 36, 1, 'rgba(200,210,230,0.22)');
  // 용암 화산 (북쪽 산맥 위): 검은 원뿔, 붉은 화구, 용암 줄기
  for (let i = 0; i < 16; i++) R(g, 158 - i, 8 + i, i * 2 + 1, 1, i < 3 ? '#8a2a1a' : i % 4 === 0 ? '#3a2a2a' : '#2e2222');
  R(g, 156, 7, 5, 2, '#ff6a2a'); R(g, 157, 6, 3, 1, '#ffd040');
  R(g, 156, 10, 1, 6, '#f08a30'); R(g, 160, 11, 1, 8, '#f08a30'); R(g, 158, 12, 1, 4, '#ffb040');
  for (let i = 0; i < 6; i++) R(g, 150 + i * 3, 3 + (i % 2), 2, 1, '#5a5a66');
  // 세계수 뿌리 (원시림 북쪽): 거대한 뿌리와 세계수 둥치
  ell(g, 76, 34, 18, 10, '#5a4a2a'); ell(g, 74, 32, 12, 6, '#6a5a34');
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; for (let k = 2; k < 14; k++) R(g, Math.round(76 + Math.cos(a) * k * 1.4), Math.round(34 + Math.sin(a) * k * 0.8), 1, 1, k % 3 ? '#8a6a3a' : '#a07a44'); }
  R(g, 74, 18, 5, 16, '#6a4a2a'); R(g, 74, 18, 2, 16, '#8a6a3a'); ell(g, 76, 16, 9, 5, '#3f7a3f'); ell(g, 75, 14, 6, 3, '#5a9a52');
  // 길
  const road = (x0, y0, x1, y1) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i += 3) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); R(g, x, y, 2, 1, '#8a6a3a'); } };
  road(84, 118, 34, 112); road(122, 60, 158, 24); road(44, 78, 76, 36);
});
let SKY_CV = null;
function skyMapArt() {
  if (SKY_CV) return SKY_CV;
  const r = rng(77), W = SKY_MAP_W, H = SKY_MAP_H, [cv, g] = mkCanvas(W * 2, H * 2);
  g.scale(2, 2); g.imageSmoothingEnabled = false;
  for (let y = 0; y < H; y += 2) R(g, 0, y, W, 2, mix('#3a6ac8', '#9ac8f0', y / H));
  // 먼 구름
  for (let i = 0; i < 26; i++) { const x = Math.floor(r() * W), y = 10 + Math.floor(r() * (H - 20)), w = 10 + Math.floor(r() * 26); ell(g, x, y, w, 3 + Math.floor(r() * 3), i % 3 ? '#e8f2fc' : '#ffffff'); ell(g, x - 4, y - 2, Math.round(w * 0.5), 3, '#ffffff'); }
  // 구름섬: 바위 밑동과 풀밭, 폭포, 신전
  const cx = 118, cy = 84;
  for (let i = 0; i < 22; i++) R(g, cx - 40 + i, cy + 4 + i, 80 - i * 2, 1, i % 5 === 0 ? '#5a5a6a' : i < 4 ? '#8a8a9a' : '#6a6a7a');
  ell(g, cx, cy, 44, 12, '#5a9a4a'); ell(g, cx - 6, cy - 2, 30, 7, '#6aaa52'); ell(g, cx + 16, cy + 1, 14, 4, '#7ab85a');
  for (let i = 0; i < 30; i++) R(g, cx - 40 + Math.floor(r() * 80), cy - 8 + Math.floor(r() * 16), 1 + Math.floor(r() * 2), 1, r() < 0.5 ? '#86c060' : '#4f8a3c');
  for (let i = 0; i < 5; i++) { const x = cx - 30 + i * 14, y = cy - 4 + (i % 2) * 5; R(g, x, y - 5, 2, 5, '#5a3a22'); ell(g, x + 1, y - 7, 4, 3, '#3f7a3f'); }
  for (let i = 0; i < 14; i++) R(g, cx + 22, cy + 10 + i, 2, 1, i % 3 ? '#9ad8ff' : '#ffffff'); ell(g, cx + 23, cy + 25, 5, 2, 'rgba(255,255,255,0.6)');
  // 신전 (던전 자리)
  const tx = cx + 26, ty = cy - 14; R(g, tx - 9, ty - 2, 18, 8, '#e8e4d8'); R(g, tx - 11, ty - 4, 22, 2, '#f8f4ec'); for (let i = 0; i < 5; i++) R(g, tx - 8 + i * 4, ty - 2, 1, 8, '#b8b4a8'); R(g, tx - 7, ty - 9, 14, 5, '#d8d4c8'); R(g, tx - 1, ty - 11, 2, 2, '#f0c24a');
  // 작은 섬들 (앞으로 생길 땅)
  for (const [ix, iy, iw] of [[36, 40, 16], [196, 46, 14], [60, 122, 12], [206, 116, 18]]) { for (let i = 0; i < 6; i++) R(g, ix - iw + i, iy + 2 + i, iw * 2 - i * 2, 1, '#6a6a7a'); ell(g, ix, iy, iw, 3, '#5a9a4a'); R(g, ix - 4, iy - 2, 2, 1, '#7ab85a'); }
  // 비행 마차 (상단 → 구름섬)
  R(g, 20, 118, 8, 4, '#8a6238'); R(g, 18, 116, 12, 2, '#a07848'); R(g, 16, 114, 4, 2, '#e8e0d0'); R(g, 28, 114, 4, 2, '#e8e0d0'); R(g, 22, 116, 3, 2, '#2a2a34');
  for (let i = 0; i < 12; i++) R(g, 30 + i * 7, 112 - i * 2, 3, 1, 'rgba(255,255,255,0.5)');
  // 나침반과 테두리
  R(g, 8, 8, 1, 14, '#f0e8c8'); R(g, 2, 14, 13, 1, '#f0e8c8'); R(g, 7, 6, 3, 3, '#e04a4a');
  R(g, 0, 0, W, 2, '#2a4a8a'); R(g, 0, H - 2, W, 2, '#2a4a8a'); R(g, 0, 0, 2, H, '#2a4a8a'); R(g, W - 2, 0, 2, H, '#2a4a8a');
  return (SKY_CV = cv.toDataURL());
}

/* ───────── 단추 ───────── */
Object.assign(ACT, {
  stablep: d => { UI.stableP = +d.id; renderPanel(true); },
  buyhorse: d => say(buyHorse(d.k)),
  sellhorse: d => say(sellHorse(d.k)),
  hitch: d => say(hitch(+d.id, d.h)),
  unhitch: d => say(unhitch(findP(d.id))),
  wplus: d => say(enhanceWagon(+d.id)),
  buyshoe: d => say(buyShoe(+d.n)),
  libtab: d => { UI.libTab = d.t; renderPanel(true); },
  libbuy: d => say(buyLibMat(d.k, +d.n)),
  libcraft: d => say(craftBook(d.sk)),
  skygo: d => { const m = skyGo(+d.id); if (m) say(m); else { say(`${findP(+d.id).name} 구름섬으로 출발!`); showWin(false); } }
});
Object.assign(ACT_SFX, { buyhorse: 'buy', sellhorse: 'coin', hitch: 'buff', wplus: 'forge', libcraft: 'buff', libbuy: 'buy', buyshoe: 'buy', skygo: 'open' });
