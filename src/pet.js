// 펫 공격의 속성 (그림 효과로 정한다)
const PET_FX_EL = { ice: 'ice', fire: 'fire', bolt: 'thunder', wind: 'wind', dark: 'dark', holy: 'holy', water: 'water' };   // water: 빌드 69 해룡
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
  const P = petState(); P.lucky = P.lucky || {}; const lucky = (P.lucky[kind] || 0) > 0; if (lucky) P.lucky[kind]--;   // 우두머리 · 둥지 알: 레어도를 두 번 굴린다
  P.inc.push({ kind, done: today() + PET_HATCH_DAYS, lucky: lucky ? 1 : 0 });
  log(`사육장에서 ${MONS[PETS[kind].mon].name} 알을 품기 시작했다. ${PET_HATCH_DAYS}일 뒤에 유정란인지 판정한다.`);
  changed();
  return '';
}
const PET_NAMES = ['콩이', '모모', '두두', '보리', '초코', '구름', '방울', '우유', '달이', '별이', '감자', '찹쌀', '호두', '단비', '솜이', '뭉치'];
function newPet(kind) {
  const used = new Set(S.pets.map(x => x.name)), pool = PET_NAMES.filter(n => !used.has(n));
  return { id: nid(), kind, name: pool.length ? pickOne(pool) : PETS[kind].name, lv: 1, exp: 0, aff: 0, stage: 0, trait: null, fed: -1, kills: 0, born: today(), q: 0 };
}
// 날마다: 부화 (빌드 65: 유정란 50% · 유정란의 부화 확률 30 ~ 70%(사육장 레벨) · 실패하면 무정란 — 같은 새벽에 여럿이면 알림 하나로)
function penDay(k) {
  const P = petState();
  const born = P.inc.filter(x => k >= x.done);
  P.inc = P.inc.filter(x => k < x.done);
  if (!born.length) return;
  const res = born.map(x => {
    const egg = MONS[PETS[x.kind].mon].name + ' 알', fertile = rnd() < PEN_FERTILE, ok = fertile && rnd() < penHatch();
    if (!ok) {
      stashItem('egg_none', 1);
      log(`사육장의 ${egg}은(는) ${fertile ? '부화에 실패했다' : '무정란이었다'}. 요리 재료 「무정란」을 창고에 넣었다.`);
      return { egg, fertile, pet: null };
    }
    const pet = newPet(x.kind); pet.q = rollPetQ(x.lucky); S.pets.push(pet);
    if (S.dex) { S.dex.pets = S.dex.pets || {}; S.dex.pets[x.kind] = 1; }
    log(`사육장에서 ${QUALITY[pet.q].name} ${PETS[x.kind].name} 「${pet.name}」이(가) 태어났다!`, 'good');
    return { egg, fertile, pet };
  });
  const rate = `사육장 Lv${S.bld.pen} 부화 확률 ${Math.round(penHatch() * 100)}% (유정란일 때) · 강화하면 Lv5에서 70%`;
  const bornTxt = r => { const pet = r.pet, qn = QUALITY[pet.q].name; return `${r.egg}이(가) 갈라지고 ${qn} ${PETS[pet.kind].name} 「${pet.name}」이(가) 나왔다 — 힘과 상단 효과 ×${petQMul(pet)}`; };
  const failTxt = r => `${r.egg}은(는) ${r.fertile ? '유정란이었지만 깨어나지 못했다' : '무정란이었다'} → 요리 재료 「무정란」`;
  if (res.length === 1) {
    const r = res[0];
    if (!r.pet) queueModal({ title: r.fertile ? '부화에 실패했어요' : '무정란이었어요…', body: [`${r.egg}은(는) ${r.fertile ? '유정란이었지만 깨어나지 못했다' : '깨어나지 않았다'}. 요리 재료 「무정란」 1개를 창고에 넣었다.`, rate] });
    else queueModal({ title: '유정란이었어요!', pet: r.pet.id, body: [bornTxt(r), PETS[r.pet.kind].desc, '원정대 창에서 파티에 넣으면 함께 싸우고, 상단에 두면 ' + petHomeText(r.pet.kind, r.pet) + '.'] });
    return;
  }
  const pets = res.filter(r => r.pet), fails = res.filter(r => !r.pet);
  queueModal({ title: pets.length ? `알 ${res.length}개 판정 · ${pets.length}마리 태어났어요!` : `알 ${res.length}개 판정 · 모두 깨어나지 않았어요`, pet: pets.length ? pets[0].pet.id : undefined,
    body: pets.map(bornTxt).concat(fails.map(failTxt), [fails.length ? `무정란 ${fails.length}개를 창고에 넣었다. ${rate}` : rate]) });
}
const PET_HOME_TXT = { rest: '숙면 회복', traffic: '상점 손님', herb: '재배소 수확', exp: '원정 경험치', luck: '전리품', move: '이동 속도', craft: '조제 덤 확률' };
const petHomeText = (kind, pet) => `${PET_HOME_TXT[PETS[kind].home[0]]} +${Math.round(PETS[kind].home[1] * (pet ? petQMul(pet) * (pet.stage ? 1.5 : 1) : 1) * 100)}%`;
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
    alive.forEach(f => { const v = hitFoe(e, f, pw * 0.6, false, true, null, PET_FX_EL[K.fx || 'ice'] || 'none'); ev(e, 'hit', Object.assign({ s: sid, d: f.uid, v, k: K.fx || 'ice', pet: 1 }, hitTag())); if (v) sta(f); });
  } else {
    const f = alive[0], magic = !!K.magic, v = hitFoe(e, f, pw, rnd() < 0.1, magic, null, PET_FX_EL[K.fx] || 'none');
    ev(e, 'hit', Object.assign({ s: sid, d: f.uid, v, k: K.fx || 'pet', pet: 1 }, hitTag()));
    if (v) sta(f);
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
  const ch = f.fb >= 5 ? 0.06 : f.fb ? 0.02 + 0.005 * f.fb : f.boss ? 0.08 : 0.001;   // 빌드 65: 약 4분의 1 (예전 25% · 10~16% · 35% · 0.4%)
  if (rnd() < ch) { const sk = f.id === 'seadragon' && typeof pxuSkin === 'function' ? pxuSkin(f) : null, kind = sk && kinds.includes(sk) ? sk : pickOne(kinds); loot(p, e, 'egg_' + kind, 1); if (f.fb || f.boss) { const P = petState(); P.lucky = P.lucky || {}; P.lucky[kind] = (P.lucky[kind] || 0) + 1; } }   // 빌드 69: 해룡은 쓰러뜨린 그 모습의 알
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
