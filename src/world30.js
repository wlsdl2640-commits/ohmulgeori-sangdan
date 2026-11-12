/* ───────── 빌드 30: 마구간 · 도서관 · 비행장 · 상단 랭킹 · 변경·하늘 지도 그림 ─────────
   데이터는 data-sky.js, 몬스터 그림은 pxmon3.js, 풍경은 sky.js. 희귀종·둥지·보물 던전의 전투 쪽은 core.js/events.js. */
Object.assign(WIN_TITLE, { co_league: '상단 랭킹' });
const FLOOR_TXT = {
  stable: () => `말 ${stableHorses().length}/${stableCap()}마리 · 마차 ${S.parties.filter(p => p.wagon).length}대`,
  library: () => `양피지 ${S.inv.parchment || 0} · 먹물 ${S.inv.ink || 0} · 펼칠 스킬북 ${TIER_BOOK_IDS.reduce((n, k) => n + (S.inv[k] || 0), 0)}권`,   // 빌드 63: 스킬북 단계
  airfield: () => (isUnlocked('sky') ? `구름섬 원정 가능 · 비행 마차 ${S.parties.filter(p => wagonFly(p)).length}대` : '구름섬은 세계수의 심장을 공략해야 열려요')
};

/* ───────── 마구간 ───────── */
const stableState = () => { if (!S.stable) S.stable = { horses: {} }; if (!S.stable.horses) S.stable.horses = {}; return S.stable; };
// 마구간의 말 목록: 산 말(종류별 여러 마리)과 맨 펫
function stableHorses() {
  const out = [], H = stableState().horses;
  for (const k of HORSE_BUY) for (let i = 0; i < (H[k] || 0); i++) out.push({ kind: k });
  for (const p of S.parties) for (const hk of [p.horse, p.horse2]) if (hk && hk.startsWith('p:')) out.push({ kind: 'pet', pet: +hk.slice(2) });   // 빌드 65: 둘째 마차에 맨 것도
  return out;
}
const horseUsed = k => S.parties.reduce((n, p) => n + (p.horse === 'h:' + k ? 1 : 0) + (p.horse2 === 'h:' + k ? 1 : 0), 0);
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
// 말을 맨다: 'h:종류' 또는 'p:펫id'. 맨 펫은 그 파티의 전투 펫 자리에서 빠진다 · sl 2 = 둘째 마차(빌드 65 캐러밴 마스터)
const RIG_F = sl => (sl === 2 ? { w: 'wagon2', h: 'horse2', n: 'wagonPlus2' } : { w: 'wagon', h: 'horse', n: 'wagonPlus' });
const rigAt = (p, sl) => (sl === 2 ? rig2(p) : p);
function hitch(pid, key, sl) {
  const p = findP(pid); if (!p) return '';
  if (p.exp) return '원정 중에는 말을 바꿀 수 없어요.';
  const RF = RIG_F(sl), q = rigAt(p, sl), w = wagonOwned(q); if (!w || !w.horse) return '말이 끄는 마차가 있어야 매요.';
  const fits = H => (w.horse === 'goat' ? !!H.steel : w.horse === 'fly' ? !!H.fly : true);
  if (key.startsWith('h:')) {
    const k = key.slice(2), H = HORSES[k]; if (!H || H.pet) return '';
    if (!fits(H)) return `${w.name}은(는) ${w.horse === 'goat' ? '고산지대 산양' : '그리폰·와이번·페가수스'}만 끌 수 있어요.`;
    if (p[RF.h] !== key && horseFree(k) < 1) return `남는 ${H.name}이(가) 없어요.`;
  } else {
    const pet = petById(+key.slice(2)); if (!pet) return '';
    const hk = horseOfPet(pet.kind); if (!hk) return `${PETS[pet.kind].name}은(는) 마차를 끌 수 없어요.`;
    if (!fits(HORSES[hk])) return `${w.name}은(는) ${w.horse === 'goat' ? '고산지대 산양' : '그리폰·와이번·페가수스'}만 끌 수 있어요.`;
    if (!pet.stage) return `${pet.name}은(는) 아직 망아지예요. Lv${PET_EVO_LV}에 진화하면 끌 수 있어요.`;
    const other = S.parties.find(x => (x.horse === key || x.horse2 === key) && !(x.id === p.id && x[RF.h] === key)), fighter = S.parties.find(x => x.pet === pet.id);
    if (other && other.exp) return `${pet.name}은(는) ${other.name}의 마차를 끌고 원정 중이에요.`;
    if (fighter && fighter.exp) return `${pet.name}은(는) ${fighter.name}과 원정 중이에요.`;
    if (other) { if (other.horse === key) other.horse = null; if (other.horse2 === key) other.horse2 = null; }
    if (fighter) fighter.pet = null;   // 마차를 끄는 펫은 싸우지 않는다
  }
  p[RF.h] = key;
  const h = horseOf(rigAt(p, sl));
  log(`${p.name}의 ${sl === 2 ? '둘째 마차 ' : ''}${w.name}에 ${h ? (h.petName ? `펫 ${h.petName}(${h.name})` : h.name) : '말'}을(를) 맸다.`);
  changed();
  return '';
}
function unhitch(p, sl) { const F = RIG_F(sl); if (!p || !p[F.h]) return ''; if (p.exp) return '원정 중에는 풀 수 없어요.'; p[F.h] = null; changed(); return ''; }
// 마차 강화: 돈 + 강철 편자 + 철광석. 마구간 단계가 상한을 정한다
const wagonPlusMax = () => Math.min(WAGON_PLUS_MAX, (S.bld.stable || 0) + 2);
function enhanceWagon(pid, sl) {
  const p0 = findP(pid), RF = RIG_F(sl), p = p0 && rigAt(p0, sl); if (!p || !p.wagon) return '';
  if (p0.exp) return '원정 중에는 강화할 수 없어요.';
  const n = wagonPlus(p);
  if (n >= wagonPlusMax()) return n >= WAGON_PLUS_MAX ? '더 강화할 수 없어요.' : `마구간을 넓혀야 +${n + 1}로 강화해요.`;
  const c = wagonPlusCost(p.wagon, n);
  if (S.gold < c.gold) return '돈이 모자라요.';
  if ((S.inv.horseshoe || 0) < c.shoe) return `강철 편자 ${c.shoe}개가 필요해요.`;
  if ((S.inv.iron_ore || 0) < c.ore) return `철광석 ${c.ore}개가 필요해요.`;
  S.gold -= c.gold; S.stats.spent = (S.stats.spent || 0) + c.gold; addTo(S.inv, 'horseshoe', -c.shoe); addTo(S.inv, 'iron_ore', -c.ore);
  p0[RF.n] = n + 1;
  log(`${p0.name}의 ${sl === 2 ? '둘째 마차 ' : ''}${WAGONS[p.wagon].name}을(를) +${n + 1}로 강화했다. 짐 +${Math.round(WAGON_PLUS.cap * (n + 1) * 100)}%, 속도 +${Math.round(WAGON_PLUS.spd * (n + 1) * 100)}%`, 'good');
  changed();
  return '';
}
function buyShoe(n) {
  const cost = ITEMS.horseshoe.buy * n;
  if (S.gold < cost) return '돈이 모자라요.';
  if (!roomItem('horseshoe')) return WH_FULL;
  S.gold -= cost; S.stats.spent = (S.stats.spent || 0) + cost; addTo(S.inv, 'horseshoe', n);
  changed();
  return `강철 편자 ${n}개를 샀어요.`;
}
const horseLine = k => { const H = HORSES[k]; return `짐 ×${H.cap} · 속도 ×${H.spd}${H.fly ? ' · 비행' : ''}${H.steel ? ' · 강철 마차' : ''}`; };
BLD_SUM.stable = () => `<div class="sub">말 ${stableHorses().length}/${stableCap()}마리 · 마차 ${S.parties.filter(p => p.wagon).length}대 · 강화 +${wagonPlusMax()}까지</div>`;
function stableRig(sp, sl) {
    const q = rigAt(sp, sl), w = wagonOwned(q), h = horseOf(q), why = wagonWhy(q), busy = !!sp.exp, S2 = sl === 2 ? ' data-s="2"' : '', hk = sl === 2 ? sp.horse2 : sp.horse, two = sl === 2;
    const bodies = WAGON_IDS.filter(k => !two || WAGONS[k].horse).map(k => { const W = WAGONS[k], own = q.wagon === k, open = wagonOpen(k), back = wagonBack(q);
      return `<div class="li${own ? ' on' : ''}"><div class="grow stack"><span>${W.name} <span class="muted">짐 +${W.cap} · 이동 ×${W.spd}${W.horse === 'goat' ? ' · 산양' : W.horse === 'fly' ? ' · 날개 달린 펫' : W.horse ? ' · 말 필요' : ''}</span></span><span class="sub muted">${W.desc}${open ? '' : ` ${wagonOpenWhy(k)}.`}</span></div>${own ? '<span class="tag gold-t">쓰는 중</span>' : `<button type="button" class="btn sm" data-act="wagon" data-id="${sp.id}" data-w="${k}"${S2}${open && !busy && (!two || caravanOf(sp)) && S.gold + back >= W.cost ? '' : ' disabled'}>${fmt(Math.max(0, W.cost - back))}G</button>`}</div>`; }).join('');
    const horses = w && w.horse ? HORSE_BUY.filter(k => (stableState().horses[k] || 0) > 0).map(k => { const H = HORSES[k], on = hk === 'h:' + k, ok = on || horseFree(k) > 0;
      return `<div class="li${on ? ' on' : ''}"><img class="peti" src="${monIconURL('horse_' + k)}" alt=""><div class="grow stack"><span>${H.name} <span class="muted">· ${stableState().horses[k]}마리 (남음 ${horseFree(k)})</span></span><span class="sub">${horseLine(k)}${w.horse === 'goat' ? ' · <span class="red-t">강철 마차는 산양만</span>' : w.horse === 'fly' ? ' · <span class="red-t">비행 마차는 날개 달린 펫만</span>' : ''}</span></div>${on ? `<button type="button" class="btn sm" data-act="unhitch" data-id="${sp.id}"${S2}${busy ? ' disabled' : ''}>풀기</button>` : `<button type="button" class="btn sm gold" data-act="hitch" data-id="${sp.id}" data-h="h:${k}"${S2}${ok && !busy && w.horse === 1 ? '' : ' disabled'}>매기</button>`}</div>`; }).join('') : '';
    const petRows = w && w.horse ? S.pets.filter(x => horseOfPet(x.kind)).map(x => { const k = horseOfPet(x.kind), H = HORSES[k], on = hk === 'p:' + x.id, fit = w.horse === 1 || (w.horse === 'goat' && H.steel) || (w.horse === 'fly' && H.fly), used = S.parties.find(o => (o.horse === 'p:' + x.id || o.horse2 === 'p:' + x.id) && !(o.id === sp.id && (sl === 2 ? o.horse2 : o.horse) === 'p:' + x.id)), inParty = S.parties.find(q => q.pet === x.id);
      return `<div class="li${on ? ' on' : ''}">${petIcon(x)}<div class="grow stack"><span>${esc(x.name)} <span class="muted">· ${x.stage ? PETS[x.kind].evo : PETS[x.kind].name} Lv${x.lv}</span></span><span class="sub">${H.name}: ${horseLine(k)}${!x.stage ? ` · <span class="red-t">Lv${PET_EVO_LV} 진화 후</span>` : !fit ? ' · <span class="red-t">이 마차는 못 끌어요</span>' : ''}${used ? ` · ${esc(used.name)}의 마차를 끄는 중` : inParty ? ` · ${esc(inParty.name)}과 싸우는 중(매면 빠져요)` : ''}</span></div>${on ? `<button type="button" class="btn sm" data-act="unhitch" data-id="${sp.id}"${S2}${busy ? ' disabled' : ''}>풀기</button>` : `<button type="button" class="btn sm gold" data-act="hitch" data-id="${sp.id}" data-h="p:${x.id}"${S2}${x.stage && fit && !busy ? '' : ' disabled'}>매기</button>`}</div>`; }).join('') : '';
    const n = wagonPlus(q), c = q.wagon ? wagonPlusCost(q.wagon, n) : null, canPlus = q.wagon && n < wagonPlusMax();
    const drv = sl === 2 ? caravanOf(sp) : coachLineOf(sp) || porterOf(sp);
    let rig = `<div class="card hl"><div class="h">${esc(sp.name)} · ${two ? '둘째 마차 · ' : ''}${q.wagon ? rigName(q) : '마차 없음'}</div>
      <div class="sub">${q.wagon ? `짐 +${(sl === 2 ? rigCap(q) : rigCap(sp)) || 0} · 이동 ×${(sl === 2 ? rigSpd(q) : rigSpd(sp)).toFixed(2)}${h ? ` · 끄는 ${h.petName ? `펫 ${esc(h.petName)}(${h.name})` : h.name}` : ''}${why ? ` · <span class="red-t">${why}</span>` : ''}` : two ? '캐러밴 마스터는 마차를 두 대까지 몰아요 — 짐은 더하고, 행렬은 느린 마차에 맞춰 움직여요.' : '아래에서 마차를 고르고, 말을 매요.'}${drv ? ` · ${two ? '캐러밴 마스터' : coachLine(drv) ? '마부' : '짐꾼'} ${esc(drv.name)}` : q.wagon && q.wagon !== 'cart' ? ' · <span class="red-t">마부 계열 없음</span>' : ''}${busy ? ' · <span class="muted">원정 중</span>' : ''}</div>
      ${q.wagon && q.wagon !== 'cart' ? `<div class="row sub"><span class="grow">강화 +${n}/${wagonPlusMax()} <span class="muted">· 단계마다 짐 +${Math.round(WAGON_PLUS.cap * 100)}%, 속도 +${Math.round(WAGON_PLUS.spd * 100)}%${c && canPlus ? ` · 다음: ${fmt(c.gold)}G · 강철 편자 ${c.shoe}(창고 ${S.inv.horseshoe || 0}) · 철광석 ${c.ore}(창고 ${S.inv.iron_ore || 0})` : ''}</span></span><button type="button" class="btn sm gold" data-act="wplus" data-id="${sp.id}"${S2}${canPlus && !busy && S.gold >= c.gold && (S.inv.horseshoe || 0) >= c.shoe && (S.inv.iron_ore || 0) >= c.ore ? '' : ' disabled'}>${n >= WAGON_PLUS_MAX ? '최대' : n >= wagonPlusMax() ? '마구간 확장 필요' : `+${n + 1} 강화`}</button></div>` : ''}</div>
      <div class="sec"><b>${two ? '둘째 마차 몸체' : '마차 몸체'}</b><span>바꾸면 쓰던 마차는 반값에 넘기고 강화는 사라져요</span></div><div class="list">${bodies}</div>
      ${w && w.horse ? `<div class="sec"><b>맬 말</b><span>${w.horse === 'goat' ? '고산지대 산양' : w.horse === 'fly' ? '그리폰·와이번·페가수스' : '마구간의 말 또는 다 자란 펫'}</span></div><div class="list">${horses}${petRows}${horses || petRows ? '' : '<div class="sub muted">맬 말이 없어요. 아래에서 말을 사거나, 사육장에서 적토마·켈피·페가수스·산양·그리폰·와이번을 키워요.</div>'}</div>` : ''}`;
  return rig;
}
BLD_BOX.stable = () => {
  const parties = S.parties.filter(p => !p.raidOnly), sp = parties.find(p => p.id === UI.stableP) || parties[0];
  const picker = parties.length ? `<div class="btns">${parties.map(p => `<button type="button" class="btn sm${sp && sp.id === p.id ? ' on' : ''}" data-act="stablep" data-id="${p.id}">${esc(p.name)}<span class="muted"> · ${p.wagon ? rigName(p) : '마차 없음'}</span></button>`).join('')}</div>` : '<div class="sub muted">파티가 없어요.</div>';
  // 1) 고른 파티의 마차 (빌드 65: 캐러밴 마스터가 있으면 둘째 마차도)
  let rig = sp ? stableRig(sp, 1) + (caravanOf(sp) || sp.wagon2 ? stableRig(sp, 2) : '') : '';
  // 2) 말 사고팔기
  const shop = HORSE_BUY.map(k => { const H = HORSES[k], own = stableState().horses[k] || 0, open = horseOpen(k);
    return `<div class="li${own ? ' on' : ''}"><img class="peti" src="${monIconURL('horse_' + k, !open)}" alt=""><div class="grow stack"><span>${H.name}${own ? ` <span class="tag ok-t">${own}마리</span>` : ''} <span class="muted">· ${horseLine(k)}</span></span><span class="sub">${H.desc}${open ? '' : ` <span class="red-t">마구간 ${H.lv}단계</span>`}</span></div><span class="btns"><button type="button" class="btn sm gold" data-act="buyhorse" data-k="${k}"${open && S.gold >= H.cost && stableHorses().length < stableCap() ? '' : ' disabled'}>${fmt(H.cost)}G</button>${own ? `<button type="button" class="btn sm" data-act="sellhorse" data-k="${k}"${horseFree(k) ? '' : ' disabled'}>팔기 ${fmt(Math.round(H.cost * 0.5))}G</button>` : ''}</span></div>`; }).join('');
  const petHorses = HORSE_IDS.filter(k => HORSES[k].pet).map(k => `<span class="tag">${HORSES[k].name} ${horseLine(k)}</span>`).join(' ');
  return `<div class="sub">말은 마차 몸체의 짐과 속도에 배율로 곱해요. 손수레는 아무나 끌지만, 말이 끄는 마차는 마부 계열(마부 · 코네스토가 · 캐러밴 마스터)이 몰아요 — 그냥 짐꾼 · 음유시인 · 정찰가는 손수레만. 짐꾼 계열은 파티당 한 명, 마부 계열이 몰면 짐과 속도 보너스가 더 붙고, 캐러밴 마스터는 마차를 두 대까지 몰아요.</div>
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
  if (!roomItem(k)) return WH_FULL;
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
// 비행장에서 고른 섬 (열린 섬만)
const skyDestOf = () => { const d = UI.skyDest; return d && SKY_IDS.includes(d) && isUnlocked(d) ? d : 'sky'; };
function skyGo(pid) {
  const p = findP(pid); if (!p) return '';
  if (p.exp) return '원정 중인 파티예요.';
  const fid = skyDestOf();
  p.dest = fid;
  const m = startExp(p, fid);
  if (m) return m;
  S.view = p.id; renderChips();
  return '';
}
BLD_SUM.airfield = () => `<div class="sub">${isUnlocked('sky') ? `구름섬 원정 가능 · 비행 마차를 단 파티 ${S.parties.filter(p => wagonFly(p)).length}대` : '구름섬은 세계수의 심장을 공략하면 열려요'}</div>`;
BLD_BOX.airfield = () => {
  const fid = skyDestOf(), open = isUnlocked(fid), F = FIELDS[fid], fs = S.fields[fid] || {};
  const isles = SKY_IDS.filter(f => FIELDS[f].region === 'sky').map(f => `<button type="button" class="chip${f === fid ? ' on' : ''}" data-act="skydest" data-f="${f}"${isUnlocked(f) ? '' : ' disabled'}>${FIELDS[f].name}${isUnlocked(f) ? '' : ' 🔒'}</button>`).join('');
  const nb = [1, 2, 3, 4, 5].filter(k => fs.boss && fs.boss[k]).length;
  const rows = S.parties.filter(p => !p.raidOnly).map(p => { const team = teamOf(p), avg = Math.round(avgLvOf(p)), block = team.map(cantGo).filter(Boolean), fly = wagonFly(p), W = WAGONS.sky;
    const why = p.exp ? `원정 중 · ${whereStr(p.exp)}` : !team.length ? '파티원이 없어요' : !fly ? (p.wagon === 'sky' ? wagonWhy(p) : '비행 마차가 없어요') : partyWhy(p) ? partyWhy(p) : block.length ? block[0] : !open ? '구름섬이 아직 안 열렸어요' : '';
    const buy = p.wagon === 'sky' ? '' : `<button type="button" class="btn sm" data-act="wagon" data-id="${p.id}" data-w="sky"${!p.exp && S.gold + wagonBack(p) >= W.cost ? '' : ' disabled'}>비행 마차 ${fmt(Math.max(0, W.cost - wagonBack(p)))}G</button>`;
    return `<div class="row sub rsend"><span class="grow">${esc(p.name)} <span class="muted">· ${team.length}명 · 평균 Lv${avg} · ${p.wagon ? rigName(p) : '마차 없음'}</span>${why ? `<br><span class="red-t">${esc(why)}</span>` : '<br><span class="ok-t">날아갈 준비가 됐어요</span>'}</span><button type="button" class="btn sm gold" data-act="skygo" data-id="${p.id}"${why ? ' disabled' : ''}>${fid === 'sky' ? '구름섬' : F.name} 출발</button></div>${buy ? `<div class="btns" style="margin-top:-2px;margin-bottom:6px">${buy}</div>` : ''}`; }).join('');
  return `<div class="chips">${isles}</div><div class="card hl"><div class="h">${F.name} <small>Lv${F.lv}~${fieldLv(F, FIELD_STAGES)}</small></div><div class="sub">${F.desc}</div><div class="sub ${open ? 'ok-t' : 'red-t'}">${open ? `열림 · 최고 ${F.no}-${fs.best || 0} · ${fs.cleared ? '던전★' : fs.found ? '던전 열림' : `보스 ${nb}/5`}` : F.unlock}</div></div>
    <div class="sub">비행 마차(${fmt(WAGONS.sky.cost)}G · 짐 +${WAGONS.sky.cap} · 이동 ×${WAGONS.sky.spd})는 여기서 만들어요. 마구간에서 그리폰·와이번·페가수스(다 자란 펫)를 매면 그리폰 마차·와이번 마차·페가수스 마차가 되고, 그래야 구름섬으로 날아가요. 비행장 2단계면 비행 마차 짐 +20%.</div>
    <div class="sec"><b>보낼 파티</b><span>보급품·목적지 거점은 원정대 창에서</span></div>${rows || '<div class="sub muted">파티가 없어요.</div>'}
    <div class="sub muted">하늘 지도는 지도 창의 「${SKY_NAME}」 탭에서 봐요. 구름섬 너머로 천둥 봉우리(Lv120) → 천계의 유적 폐허(Lv130) → 별의 정원(Lv140)이 이어지고, 앞 섬의 던전을 공략하면 다음 섬이 열려요.</div>`;
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

/* ───────── 지도 그림 ─────────
   빌드 66: 대륙 지도에 덧그리던 북쪽 변경(묘지 · 화산 · 세계수 · 길)과 하늘 지도는 data-mapart.js 그림(시안 A 양피지 고지도 결)으로 바뀌었다. */
function skyMapArt() { return SKY_MAP_ART; }

/* ───────── 단추 ───────── */
Object.assign(ACT, {
  stablep: d => { UI.stableP = +d.id; renderPanel(true); },
  buyhorse: d => say(buyHorse(d.k)),
  sellhorse: d => say(sellHorse(d.k)),
  hitch: d => say(hitch(+d.id, d.h, +d.s || 1)),
  unhitch: d => say(unhitch(findP(d.id), +d.s || 1)),
  wplus: d => say(enhanceWagon(+d.id, +d.s || 1)),
  buyshoe: d => say(buyShoe(+d.n)),
  libtab: d => { UI.libTab = d.t; renderPanel(true); },
  libbuy: d => say(buyLibMat(d.k, +d.n)),
  libcraft: d => say(craftBook(d.sk)),
  skydest: d => { UI.skyDest = d.f; renderPanel(true); },
  skygo: d => { const m = skyGo(+d.id); if (m) say(m); else { say(`${findP(+d.id).name} ${FIELDS[skyDestOf()].name}(으)로 출발!`); showWin(false); } }
});
Object.assign(ACT_SFX, { buyhorse: 'buy', sellhorse: 'coin', hitch: 'buff', wplus: 'forge', libcraft: 'buff', libbuy: 'buy', buyshoe: 'buy', skygo: 'open' });
