/* ───────── 펫: 알 → 사육장에서 부화 → 파티마다 한 마리 동행 ─────────
   act: 전투에서 cd초마다 하는 일 (bite 물기 · heal 치료 · song 공격 버프 · guard 방어 버프 · web 거미줄 · frost/ember/splash 마법 · sting 독침 · drain 흡혈)
   home: 상단에 두면 주는 효과 [키, 값] (rest 숙면·회복 · traffic 손님 · herb 약초 · exp 경험치 · luck 전리품 · move 이동 · craft 조제 덤)
   Lv30에 진화(stage 1): 힘 ×1.8, 어른 몬스터 모습. 호감도 100이면 특성 하나. */
const PETS = {
  slime:     { name: '슬라임 새끼',     mon: 'slime',     field: 'plains',   act: 'heal',   pow: 1.0, cd: 4, likes: ['slime_jelly', 'herb'],           home: ['rest', 0.06],    evo: '왕관 슬라임',   c: '#5fbf5a', desc: '다친 동료를 몸으로 감싸 치료한다.' },
  wolf:      { name: '새끼 늑대',       mon: 'wolf',      field: 'plains',   act: 'bite',   pow: 1.0, cd: 3, likes: ['rat_tail', 'wolf_fang'],          home: ['traffic', 0.04], evo: '은빛 늑대',     c: '#8f877d', sta: { k: 'bleed', p: 0.2, d: 6, m: 0.2 }, desc: '앞의 적을 물어뜯는다. 물면 피를 흘리게 한다.' },
  spider:    { name: '아기 거미',       mon: 'spider',    field: 'forest',   act: 'web',    pow: 0.6, cd: 5, likes: ['spore', 'spider_silk'],           home: ['herb', 0.1],     evo: '여왕 거미',     c: '#3a3440', sta: { k: 'poison', p: 0.4, d: 8, m: 0.2 }, desc: '거미줄로 적을 느리게 하고 독을 바른다.' },
  golem:     { name: '골렘 조각',       mon: 'golem',     field: 'mountain', act: 'guard',  pow: 1.0, cd: 9, likes: ['iron_ore', 'golem_core'],         home: ['rest', 0.04],    evo: '수정 골렘',     c: '#77727c', desc: '돌벽을 세워 파티의 방어력을 올린다.' },
  griffon:   { name: '아기 그리폰',     mon: 'griffon',   field: 'valley',   act: 'bite',   pow: 1.15, cd: 3, likes: ['harpy_feather', 'griffon_claw'], home: ['traffic', 0.05], evo: '폭풍 그리폰',   c: '#c8a050', fx: 'wind', desc: '발톱으로 적을 할퀸다. 진화하면 바람을 몰고 온다.' },
  harpy:     { name: '하피 병아리',     mon: 'harpy',     field: 'valley',   act: 'song',   pow: 1.0, cd: 9, likes: ['harpy_feather', 'herb'],          home: ['exp', 0.03],     evo: '세이렌 하피',   c: '#c8a888', desc: '노래로 파티의 공격력을 올린다.' },
  icesprite: { name: '얼음 정령 새끼',  mon: 'icesprite', field: 'snow',     act: 'frost',  pow: 1.0, cd: 4, likes: ['frost_crystal', 'snow_essence'],  home: ['rest', 0.05],    evo: '서리 정령',     c: '#8ad8ff', magic: 1, fx: 'ice', sta: { k: 'chill', p: 0.35, d: 5, m: 0.3 }, desc: '얼음 조각을 날려 적을 얼린다.' },
  scorpion:  { name: '아기 전갈',       mon: 'scorpion',  field: 'desert',   act: 'bite',   pow: 0.9, cd: 4, likes: ['scorpion_stinger', 'antlion_jaw'], home: ['luck', 0.03],   evo: '황제 전갈',     c: '#b8682e', sta: { k: 'poison', p: 0.45, d: 8, m: 0.3 }, desc: '독침으로 적을 찌른다.' },
  sewerrat:  { name: '하수도 생쥐',     mon: 'sewerrat',  field: 'sewer',    act: 'bite',   pow: 0.7, cd: 3, likes: ['rat_tail', 'sewer_hide'],         home: ['luck', 0.05],    evo: '쥐 두목',       c: '#5a4a44', luck: 0.05, desc: '작지만 빠르다. 떨어진 것을 잘 줍는다(전리품 +5%).' },
  kelpie:    { name: '켈피 망아지',     mon: 'kelpie',    field: 'swamp',    act: 'splash', pow: 0.8, cd: 5, likes: ['kelpie_mane', 'waterherb'],       home: ['move', 0.05],    evo: '늪의 켈피',     c: '#3a7a98', magic: 1, fx: 'ice', sta: { k: 'chill', p: 0.3, d: 5, m: 0.3 }, desc: '물보라로 모든 적을 적시고 식힌다.' },
  imp:       { name: '임프 새끼',       mon: 'imp',       field: 'barren',   act: 'ember',  pow: 1.1, cd: 4, likes: ['imp_horn', 'fireherb'],           home: ['craft', 0.1],    evo: '불꽃 임프',     c: '#c84a3a', magic: 1, fx: 'fire', sta: { k: 'burn', p: 0.35, d: 8, m: 0.3 }, desc: '불씨를 던져 적을 태운다.' },
  vbat:      { name: '아기 박쥐',       mon: 'vbat',      field: 'castle',   act: 'drain',  pow: 0.9, cd: 4, likes: ['vbat_wing', 'bloodshroom'],       home: ['exp', 0.05],     evo: '흡혈 군주 박쥐', c: '#5a3a6a', desc: '피를 빨아 가장 다친 동료에게 나눠 준다.' }
};
const PET_IDS = Object.keys(PETS);
const PET_ACT_NAME = { bite: '물기', heal: '보듬기', song: '노래', guard: '돌벽', web: '거미줄', frost: '얼음 조각', ember: '불씨', splash: '물보라', drain: '흡혈' };
const PET_EVO_LV = 30, PET_MAX_LV = 60, PET_HATCH_DAYS = 2, PET_FEED_AFF = 12, PET_AFF_MAX = 100;
const petNeed = lv => Math.round(30 * Math.pow(lv, 1.6));
const petPow = pet => (10 + 3 * pet.lv) * (pet.stage ? 1.8 : 1) * PETS[pet.kind].pow * (pet.trait === 'fierce' ? 1.2 : 1);
const PET_TRAITS = {
  fierce: { name: '사나움',   desc: '행동 힘 +20%' },
  swift:  { name: '잽쌈',     desc: '행동 간격 -20%' },
  lucky:  { name: '복덩이',   desc: '전리품 +8%' },
  loyal:  { name: '충직함',   desc: '파티 받는 피해 -4%' },
  glutton:{ name: '먹보',     desc: '먹이 호감도 두 배 · 경험치 +15%' }
};
// 알
PET_IDS.forEach(k => { const P = PETS[k]; ITEMS['egg_' + k] = { name: `${MONS[P.mon].name} 알`, v: 1200 + (FIELDS[P.field] ? FIELDS[P.field].lv * 60 : 600), w: 2, icon: 'egg', c: P.c, egg: k, use: 'egg', desc: `사육장에서 ${PET_HATCH_DAYS}일 품으면 ${P.name}이(가) 태어난다. ${P.desc}` }; });
const petsOfField = fid => PET_IDS.filter(k => PETS[k].field === fid);
// 사육장
BUILDINGS.pen = { name: '사육장', max: 3, cost: [1500, 5000, 12000], desc: '알을 부화시키고 펫을 기른다. 펫은 파티마다 한 마리 데려가고, 남은 펫은 상단에 힘을 준다.', eff: lv => `펫 ${2 + lv * 2}마리 · 한 번에 ${lv}개 부화` };
BUILD_RANK.pen = 1;
BUILD_ORDER.splice(BUILD_ORDER.indexOf('inn') + 1, 0, 'pen');
const penCap = () => 2 + (S.bld.pen || 0) * 2;
const petById = id => (S && S.pets ? S.pets.find(x => x.id === id) : null);
const petOfParty = p => (p && p.pet ? petById(p.pet) : null);
// 마차에 맨 펫(마구간): 파티 p.horse = 'p:펫id'. 맨 펫은 싸우지도, 상단에 힘을 주지도 않는다
const petHitched = id => !!(S && S.parties.some(p => p.horse === 'p:' + id));
const petsAtHome = () => (S && S.pets ? S.pets.filter(x => !S.parties.some(p => p.pet === x.id) && !petHitched(x.id)) : []);
// 상단에 남은 펫의 효과 합
const petHome = k => petsAtHome().reduce((s, x) => s + (PETS[x.kind].home[0] === k ? PETS[x.kind].home[1] * (x.stage ? 1.5 : 1) : 0), 0);
