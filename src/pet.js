/* ───────── 펫 살림: 부화·먹이·성장·진화·전투 행동 ───────── */
function petState() { if (!S.pets) S.pets = []; if (!S.pen) S.pen = { inc: [] }; return S.pen; }
// 알 품기
function hatchWhy(kind) {
  if (!S.bld.pen) return '사육장이 필요해요.';
  if ((S.inv['egg_' + kind] || 0) < 1) return '알이 없어요.';
  const P = petState();
  if (P.inc.length >= S.bld.pen) return `한 번에 ${S.bld.pen}개까지 품을 수 있어요.`;
  if (S.pets.length + P.inc.length >= penCap()) return `사육장이 가득 찼어요 (${penCap()}마리). 넓히거나 펫을 보내 줘야 해요.`;
  return '';
}
function hatch(kind) {
  const why = hatchWhy(kind); if (why) return why;
  addTo(S.inv, 'egg_' + kind, -1);
  petState().inc.push({ kind, done: today() + PET_HATCH_DAYS });
  log(`사육장에서 ${ITEMS['egg_' + kind].name}을(를) 품기 시작했다. ${PET_HATCH_DAYS}일 뒤에 태어난다.`);
  changed();
  return '';
}
const PET_NAMES = ['콩이', '모모', '두두', '보리', '초코', '구름', '방울', '우유', '달이', '별이', '감자', '찹쌀', '호두', '단비', '솜이', '뭉치'];
function newPet(kind) {
  const used = new Set(S.pets.map(x => x.name)), pool = PET_NAMES.filter(n => !used.has(n));
  return { id: nid(), kind, name: pool.length ? pickOne(pool) : PETS[kind].name, lv: 1, exp: 0, aff: 0, stage: 0, trait: null, fed: -1, kills: 0, born: today() };
}
// 날마다: 부화
function penDay(k) {
  const P = petState();
  const born = P.inc.filter(x => k >= x.done);
  P.inc = P.inc.filter(x => k < x.done);
  for (const x of born) {
    const pet = newPet(x.kind); S.pets.push(pet);
    if (S.dex) { S.dex.pets = S.dex.pets || {}; S.dex.pets[x.kind] = 1; }
    log(`사육장에서 ${PETS[x.kind].name} 「${pet.name}」이(가) 태어났다!`, 'good');
    queueModal({ title: '펫이 태어났어요', pet: pet.id, body: [`${ITEMS['egg_' + x.kind].name}이(가) 갈라지고 ${PETS[x.kind].name} 「${pet.name}」이(가) 나왔다.`, PETS[x.kind].desc, '원정대 창에서 파티에 넣으면 함께 싸우고, 상단에 두면 ' + petHomeText(x.kind) + '.'] });
  }
}
const PET_HOME_TXT = { rest: '숙면 회복', traffic: '상점 손님', herb: '약초 줍기', exp: '원정 경험치', luck: '전리품', move: '이동 속도', craft: '조제 덤 확률' };
const petHomeText = kind => `${PET_HOME_TXT[PETS[kind].home[0]]} +${Math.round(PETS[kind].home[1] * 100)}%`;
// 먹이: 하루 한 번, 좋아하는 부속품 하나
function feedWhy(pet, it) {
  if (!pet) return '';
  if (pet.fed === today()) return '오늘은 이미 먹었어요.';
  if (!PETS[pet.kind].likes.includes(it)) return '이 펫이 좋아하는 먹이가 아니에요.';
  if ((S.inv[it] || 0) < 1) return `${ITEMS[it].name}이(가) 창고에 없어요.`;
  return '';
}
function feed(pid, it) {
  const pet = petById(pid), why = feedWhy(pet, it); if (why) return why;
  addTo(S.inv, it, -1); pet.fed = today();
  const gain = PET_FEED_AFF * (pet.trait === 'glutton' ? 2 : 1);
  pet.aff = Math.min(PET_AFF_MAX, (pet.aff || 0) + gain);
  let msg = `${pet.name}이(가) ${ITEMS[it].name}을(를) 맛있게 먹었다. 호감도 +${gain}`;
  if (pet.aff >= PET_AFF_MAX && !pet.trait) {
    pet.trait = pickOne(Object.keys(PET_TRAITS));
    msg += ` · 호감도가 가득 차 특성 「${PET_TRAITS[pet.trait].name}」이 생겼다!`;
    queueModal({ title: '펫 특성', pet: pet.id, body: [`${pet.name}이(가) 당신을 완전히 따르게 됐다.`, `특성 「${PET_TRAITS[pet.trait].name}」: ${PET_TRAITS[pet.trait].desc}`] });
  }
  log(msg, 'good'); changed();
  return '';
}
// 경험치 (처치 때 파티 경험치의 절반)
function petExp(pet, xp) {
  if (pet.lv >= PET_MAX_LV) return false;
  pet.exp += Math.round(xp * (pet.trait === 'glutton' ? 1.15 : 1));
  let up2 = false;
  while (pet.lv < PET_MAX_LV && pet.exp >= petNeed(pet.lv)) { pet.exp -= petNeed(pet.lv); pet.lv++; up2 = true; }
  if (pet.lv >= PET_MAX_LV) pet.exp = 0;
  if (up2 && !pet.stage && pet.lv >= PET_EVO_LV) {
    pet.stage = 1;
    log(`${pet.name}이(가) ${PETS[pet.kind].evo}(으)로 진화했다!`, 'good');
    queueModal({ title: '진화', pet: pet.id, body: [`${PETS[pet.kind].name} 「${pet.name}」이(가) Lv${PET_EVO_LV}에 닿아 ${PETS[pet.kind].evo}(으)로 자라났다.`, '행동의 힘이 1.8배가 되고 상단에 둘 때의 효과도 커진다.'] });
  }
  return up2;
}
// 전투: cd초마다 한 번 행동한다 (펫은 적에게 맞지 않는다)
function petTick(p, e, team, dm, dt) {
  const pet = petOfParty(p); if (!pet) return;
  const alive = e.foes.filter(f => f.hp > 0); if (!alive.length) return;
  const K = PETS[pet.kind];
  e.petCd = (e.petCd == null ? 1.2 : e.petCd) - dt;
  if (e.petCd > 0) return;
  e.petCd = K.cd * (pet.trait === 'swift' ? 0.8 : 1) * (0.9 + rnd() * 0.2);
  const sid = 'P' + pet.id, pw = petPow(pet), live = team.filter(up);
  if (!live.length) return;
  const low = live.slice().sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0];
  const sta = f => { if (K.sta && f.hp > 0 && rnd() < K.sta.p) inflictFoe(e, f, K.sta, pw, sid, 'pet'); };
  if (K.act === 'heal') {
    const h = Math.round(dm[low.id].maxHp * (0.03 + pet.lv * 0.001) * (pet.stage ? 1.8 : 1) * K.pow);
    low.hp = Math.min(dm[low.id].maxHp, low.hp + h); ev(e, 'heal', { s: sid, d: low.id, v: h }); cureSta(e, low, ['bleed']);
  } else if (K.act === 'song' || K.act === 'guard') {
    e.buffs = e.buffs.filter(b => b.sid !== 'pet');
    e.buffs.push({ sid: 'pet', to: 'party', stat: K.act === 'song' ? 'atk' : 'def', mult: pet.stage ? 1.25 : 1.15, add: 0, t: 6 });
    ev(e, 'buff', { s: sid, id: 'pet_' + K.act, party: true, pet: K.act });
  } else if (K.act === 'splash') {
    alive.forEach(f => { const v = hitFoe(e, f, pw * 0.6, false, true, null); ev(e, 'hit', { s: sid, d: f.uid, v, k: K.fx || 'ice', pet: 1 }); sta(f); });
  } else {
    const f = alive[0], magic = !!K.magic, v = hitFoe(e, f, pw, rnd() < 0.1, magic, null);
    ev(e, 'hit', { s: sid, d: f.uid, v, k: K.fx || 'pet', pet: 1 });
    sta(f);
    if (K.act === 'web') f.slow = 4;
    if (K.act === 'drain') { const h = Math.round(v * 0.5); low.hp = Math.min(dm[low.id].maxHp, low.hp + h); ev(e, 'heal', { s: sid, d: low.id, v: h }); }
  }
}
// 처치 때: 경험치와 알
function petKill(p, e, f, xp) {
  const pet = petOfParty(p);
  if (pet) { pet.kills = (pet.kills || 0) + 1; if (petExp(pet, Math.round(xp * 0.5))) ev(e, 'petlvl', { pet: pet.id }); }
  if (f.pvp || f.giant) return;
  const kinds = petsOfField(e.field); if (!kinds.length) return;
  const ch = f.fb >= 5 ? 0.25 : f.fb ? 0.08 + 0.02 * f.fb : f.boss ? 0.35 : 0.004;
  if (rnd() < ch) loot(p, e, 'egg_' + pickOne(kinds), 1);
}
// 파티에 넣기·빼기
function setPartyPet(pid, petId) {
  const p = findP(pid); if (!p) return '';
  if (p.exp) return '원정 중에는 바꿀 수 없어요.';
  if (!petId) { p.pet = null; changed(); return ''; }
  const pet = petById(petId); if (!pet) return '';
  if (petHitched(petId)) return `${pet.name}은(는) 마차를 끌고 있어요. 마구간에서 풀어 주세요.`;
  const other = S.parties.find(x => x.pet === petId && x.id !== pid);
  if (other) { if (other.exp) return `${pet.name}은(는) ${other.name}과 원정 중이에요.`; other.pet = null; }
  p.pet = petId; changed();
  return '';
}
function releasePet(petId) {
  const pet = petById(petId); if (!pet) return '';
  if (S.parties.some(x => x.pet === petId && x.exp)) return '원정 중인 펫은 보낼 수 없어요.';
  if (petHitched(petId)) return '마차를 끌고 있는 펫이에요. 마구간에서 먼저 풀어 주세요.';
  S.parties.forEach(x => { if (x.pet === petId) x.pet = null; });
  S.pets = S.pets.filter(x => x.id !== petId);
  log(`${pet.name}을(를) 들판에 놓아 주었다.`);
  changed();
  return '';
}
