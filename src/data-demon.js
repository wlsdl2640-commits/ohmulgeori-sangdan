/* ───────── 마계 (마족의 땅): 상위 사냥터 셋 ─────────
   눅눅한 늪지대 → 메마른 땅 → 백작의 성. 사막 왕릉을 공략하면 늪지대가, 그 던전을 공략하면 다음 땅이 열린다.
   10 스테이지마다 나오는 우두머리는 F.bosses에 적은 몬스터(1-50의 주인까지). 전직 조건(CLASSES[c].req)도 여기서 더한다. */
const DEMON_IDS = ['swamp', 'barren', 'castle'];
const DEMON_NAME = '마계';

/* ───────── 부속품 ───────── */
Object.assign(ITEMS, {
  // 늪지대
  frog_leg:       { name: '프로그 뒷다리',      v: 150,  w: 1, icon: 'tail',    c: '#8ab85a' },
  leech_sac:      { name: '거머리 피주머니',    v: 160,  w: 1, icon: 'blob',    c: '#7a3a4a' },
  kelpie_mane:    { name: '켈피 갈기',          v: 190,  w: 2, icon: 'hide',    c: '#4a8aa8' },
  siren_scale:    { name: '세이렌 비늘',        v: 200,  w: 1, icon: 'gem',     c: '#6ad8d0' },
  siren_pearl:    { name: '세이렌의 눈물 진주', v: 1800, w: 1, icon: 'gem',     c: '#e8f0ff' },
  swamp_moss:     { name: '늪지 괴물의 이끼',   v: 210,  w: 3, icon: 'blob',    c: '#4a7a3a' },
  toad_oil:       { name: '두꺼비 왕의 기름',   v: 900,  w: 2, icon: 'potion',  c: '#a8c84a' },
  hydra_fang:     { name: '히드라 송곳니',      v: 2400, w: 2, icon: 'fang',    c: '#5ab08a' },
  witch_cauldron: { name: '마녀의 가마솥',      v: 7200, w: 5, icon: 'crown',   c: '#3a3a4a' },
  // 메마른 땅
  imp_horn:       { name: '임프 뿔',            v: 220,  w: 1, icon: 'horn',    c: '#c84a3a' },
  hound_fang:     { name: '헬하운드 송곳니',    v: 240,  w: 1, icon: 'fang',    c: '#e06a2a' },
  troll_hide:     { name: '트롤 가죽',          v: 260,  w: 4, icon: 'hide',    c: '#6a8a5a' },
  ogre_tooth:     { name: '오거 어금니',        v: 280,  w: 2, icon: 'horn',    c: '#e8dcc0' },
  lab_vial:       { name: '연구소 약병',        v: 300,  w: 1, icon: 'potion',  c: '#6ae8a0' },
  cerberus_collar:{ name: '케르베로스의 목줄',  v: 1200, w: 2, icon: 'ring',    c: '#c84a2a' },
  ogre_crown:     { name: '오거 대왕의 왕관',   v: 3200, w: 3, icon: 'crown',   c: '#c8a040' },
  chimera_mane:   { name: '키메라의 갈기',      v: 9000, w: 4, icon: 'heart',   c: '#e0803a' },
  // 백작의 성
  vbat_wing:      { name: '흡혈 박쥐 날개',     v: 300,  w: 1, icon: 'wing',    c: '#5a3a6a' },
  ghoul_nail:     { name: '구울 손톱',          v: 320,  w: 1, icon: 'fang',    c: '#8a9a7a' },
  gargoyle_shard: { name: '가고일 파편',        v: 340,  w: 3, icon: 'ore',     c: '#8a8a9a' },
  evil_eye:       { name: '이블아이의 눈알',    v: 360,  w: 1, icon: 'eye',     c: '#d03a6a' },
  succubus_wing:  { name: '서큐버스 날개',      v: 380,  w: 2, icon: 'wing',    c: '#c03a8a' },
  blood_tear:     { name: '피눈물',             v: 2500, w: 1, icon: 'drop',    c: '#d02030', desc: '백작의 성 흡혈귀들이 흘린 붉은 눈물. 버서커 전직에 필요하다.' },
  vamp_crest:     { name: '흡혈 기사의 문장',   v: 1500, w: 1, icon: 'crest',   c: '#a02040' },
  dracula_cape:   { name: '드라큘라의 망토',    v: 4200, w: 2, icon: 'hide',    c: '#3a1030' },
  bone_dust:      { name: '뼛가루',             v: 260,  w: 1, icon: 'bone',    c: '#e8e0d0' },
  bone_arrow:     { name: '뼈 화살',            v: 330,  w: 1, icon: 'blade',   c: '#d8d0c0' },
  dark_tome:      { name: '어둠의 서',          v: 420,  w: 1, icon: 'book',    c: '#3a2a4a' },
  lich_phylactery:{ name: '리치의 성물함',      v: 12000, w: 3, icon: 'gem',    c: '#8a40c0' }
});

/* ───────── 몬스터 (그림은 pxmon2.js) ───────── */
Object.assign(MONS, {
  // 눅눅한 늪지대
  frogman:   { name: '프로그',        plan: 'biped', body: '#5a9a4a', dark: '#2e6a34', mh: 1.1, ma: 1.1, md: 0.7, spd: 1.2, eva: 0.12, minS: 1, drops: [['frog_leg', 0.6]] },
  leech:     { name: '늪 거머리',     plan: 'worm',  body: '#6a3a44', dark: '#3a1e26', mh: 0.8, ma: 1.0, md: 0.4, spd: 1.4, minS: 1, sta: { k: 'bleed', p: 0.3, d: 8, m: 0.25 }, drops: [['leech_sac', 0.55]] },
  kelpie:    { name: '켈피',          plan: 'quad',  body: '#3a7a98', dark: '#1e4a62', mh: 1.6, ma: 1.3, md: 0.9, spd: 1.1, eva: 0.1, minS: 2, sta: { k: 'chill', p: 0.25, d: 6, m: 0.3 }, drops: [['kelpie_mane', 0.5]] },
  siren:     { name: '세이렌',        plan: 'ghost', body: '#5ac8c0', dark: '#2a8a88', skin: '#f1d6c0', mh: 1.0, ma: 1.4, md: 0.5, spd: 1.0, eva: 0.18, magic: 1, minS: 4, sta: { k: 'para', p: 0.2, d: 3, m: 0 }, drops: [['siren_scale', 0.45], ['siren_pearl', 0.08]] },
  swampthing:{ name: '늪지 괴물',     plan: 'golem', body: '#4a6a3a', dark: '#2a4a24', mh: 2.4, ma: 1.4, md: 1.5, spd: 0.7, minS: 6, sta: { k: 'poison', p: 0.3, d: 8, m: 0.3 }, drops: [['swamp_moss', 0.5]] },
  toadking:  { name: '두꺼비 왕',     plan: 'blob',  body: '#8aa84a', dark: '#4a6a2a', fb: 1, scale: 2, mh: 1.8, ma: 1.2, md: 1.0, spd: 0.8, sta: { k: 'poison', p: 0.3, d: 8, m: 0.3 }, drops: [['toad_oil', 0.7], ['frog_leg', 1, 2]] },
  hydra:     { name: '히드라',        plan: 'worm',  body: '#3a8a6a', dark: '#1e5a44', fb: 5, scale: 3, mh: 2.8, ma: 1.6, md: 1.4, spd: 0.8, aoe: 1, sta: { k: 'poison', p: 0.35, d: 10, m: 0.35 }, drops: [['hydra_fang', 0.8], ['swamp_moss', 1, 2]] },
  swampwitch:{ name: '늪지의 마녀',   plan: 'ghost', body: '#3a2a4a', dark: '#1e1430', skin: '#a8c88a', boss: 1, scale: 2, mh: 5.5, ma: 1.9, md: 1.3, spd: 0.9, magic: 1, aoe: 1, sta: { k: 'poison', p: 0.4, d: 10, m: 0.35 }, drops: [['witch_cauldron', 1], ['swamp_moss', 1, 3], ['wizstone', 0.2]] },
  // 메마른 땅
  imp:       { name: '임프',          plan: 'biped', body: '#c84a3a', dark: '#7a2a22', mh: 0.8, ma: 1.2, md: 0.5, spd: 1.3, eva: 0.15, magic: 1, minS: 1, sta: { k: 'burn', p: 0.2, d: 8, m: 0.25 }, drops: [['imp_horn', 0.6]] },
  hellhound: { name: '헬하운드',      plan: 'quad',  body: '#3a2a2a', dark: '#1e1414', mh: 1.3, ma: 1.3, md: 0.7, spd: 1.35, minS: 2, sta: { k: 'burn', p: 0.3, d: 8, m: 0.3 }, drops: [['hound_fang', 0.5]] },
  troll:     { name: '트롤',          plan: 'giant', body: '#6a8a5a', dark: '#3a5a34', mh: 2.4, ma: 1.3, md: 1.1, spd: 0.8, minS: 3, drops: [['troll_hide', 0.5]] },
  ogre:      { name: '오거',          plan: 'giant', body: '#a87a5a', dark: '#6a4a34', mh: 2.8, ma: 1.6, md: 1.4, spd: 0.65, minS: 5, sta: { k: 'stun', p: 0.15, d: 2, m: 0 }, drops: [['ogre_tooth', 0.45]] },
  flesh:     { name: '실험체 골렘',   plan: 'golem', body: '#9a7a7a', dark: '#5a3a3a', mh: 2.6, ma: 1.2, md: 1.6, spd: 0.6, sta: { k: 'weak', p: 0.2, d: 8, m: 0.2 }, drops: [['lab_vial', 0.4], ['ogre_tooth', 0.1]] },
  cerberus:  { name: '케르베로스',    plan: 'quad',  body: '#4a2a2a', dark: '#241414', fb: 1, scale: 2, mh: 2.0, ma: 1.4, md: 0.9, spd: 1.2, sta: { k: 'burn', p: 0.4, d: 8, m: 0.3 }, drops: [['cerberus_collar', 0.6], ['hound_fang', 1, 2]] },
  ogreking:  { name: '오거 대왕',     plan: 'giant', body: '#b08060', dark: '#704a30', fb: 5, scale: 3, mh: 3.0, ma: 1.8, md: 1.5, spd: 0.7, aoe: 1, sta: { k: 'stun', p: 0.25, d: 2, m: 0 }, drops: [['ogre_crown', 0.8], ['ogre_tooth', 1, 2]] },
  chimera:   { name: '키메라',        plan: 'quad',  body: '#c89a4a', dark: '#7a5a2a', boss: 1, scale: 2, mh: 6, ma: 2.0, md: 1.5, spd: 1.0, aoe: 1, sta: { k: 'burn', p: 0.4, d: 10, m: 0.35 }, drops: [['chimera_mane', 1], ['lab_vial', 1, 2], ['wizstone', 0.3]] },
  // 백작의 성
  vbat:      { name: '흡혈 박쥐',     plan: 'flyer', body: '#5a3a6a', dark: '#30203a', mh: 0.9, ma: 1.2, md: 0.4, spd: 1.6, eva: 0.25, minS: 1, sta: { k: 'bleed', p: 0.25, d: 8, m: 0.25 }, drops: [['vbat_wing', 0.6], ['blood_tear', 0.015]] },
  ghoul:     { name: '구울',          plan: 'biped', body: '#7a8a6a', dark: '#44503a', mh: 1.6, ma: 1.3, md: 0.8, spd: 1.0, minS: 1, sta: { k: 'weak', p: 0.2, d: 8, m: 0.2 }, drops: [['ghoul_nail', 0.55]] },
  gargoyle:  { name: '가고일',        plan: 'flyer', body: '#7a7a8a', dark: '#44445a', mh: 2.0, ma: 1.3, md: 2.2, spd: 0.8, minS: 2, drops: [['gargoyle_shard', 0.5]] },
  evileye:   { name: '이블아이',      plan: 'flyer', body: '#8a3a6a', dark: '#4a1e3a', mh: 1.2, ma: 1.5, md: 0.6, spd: 0.9, eva: 0.1, magic: 1, minS: 3, sta: { k: 'para', p: 0.25, d: 3, m: 0 }, drops: [['evil_eye', 0.45]] },
  succubus:  { name: '서큐버스',      plan: 'ghost', body: '#a02a7a', dark: '#5a1444', skin: '#f0c8c0', mh: 1.3, ma: 1.6, md: 0.7, spd: 1.1, eva: 0.2, magic: 1, minS: 5, sta: { k: 'weak', p: 0.3, d: 8, m: 0.25 }, drops: [['succubus_wing', 0.4], ['blood_tear', 0.05]] },
  vampknight:{ name: '흡혈 기사',     plan: 'biped', body: '#3a2a3a', dark: '#1e1420', skin: '#d8c8d0', fb: 2, scale: 2, mh: 2.2, ma: 1.5, md: 1.3, spd: 1.0, sta: { k: 'bleed', p: 0.35, d: 8, m: 0.3 }, drops: [['blood_tear', 0.25], ['vamp_crest', 0.4]] },
  dracula:   { name: '드라큘라 백작', plan: 'biped', body: '#2a1030', dark: '#160818', skin: '#e8e0e8', fb: 5, scale: 3, mh: 3.2, ma: 1.9, md: 1.6, spd: 1.0, eva: 0.15, magic: 1, aoe: 1, sta: { k: 'bleed', p: 0.4, d: 10, m: 0.35 }, drops: [['blood_tear', 0.6], ['dracula_cape', 0.7]] },
  skelwar:   { name: '스켈레톤 전사', plan: 'biped', body: '#d8d0c0', dark: '#8a8070', mh: 1.5, ma: 1.3, md: 1.2, spd: 1.0, drops: [['bone_dust', 0.5]] },
  skelarc:   { name: '스켈레톤 궁수', plan: 'biped', body: '#d8d0c0', dark: '#8a8070', mh: 1.1, ma: 1.4, md: 0.6, spd: 1.2, eva: 0.1, drops: [['bone_arrow', 0.4], ['bone_dust', 0.3]] },
  skelmage:  { name: '스켈레톤 법사', plan: 'biped', body: '#d8d0c0', dark: '#8a8070', mh: 1.0, ma: 1.6, md: 0.5, spd: 0.9, magic: 1, sta: { k: 'chill', p: 0.3, d: 6, m: 0.3 }, drops: [['dark_tome', 0.3], ['bone_dust', 0.3]] },
  lichking:  { name: '리치 킹',       plan: 'ghost', body: '#3a2a5a', dark: '#1e1434', skin: '#d8d0c0', boss: 1, scale: 2, mh: 6.5, ma: 2.2, md: 1.6, spd: 0.9, eva: 0.1, magic: 1, aoe: 1, sta: { k: 'chill', p: 0.4, d: 8, m: 0.35 }, drops: [['lich_phylactery', 1], ['bone_dust', 1, 3], ['wizstone', 0.3]] }
});

/* ───────── 필드 ───────── */
Object.assign(FIELDS, {
  swamp: {
    no: 9, name: '눅눅한 늪지대', lv: 54, bg: 'swamp', tier: 6, after: 'desert', demon: 1, unlock: '사라크 사막의 왕릉을 공략하면 열려요',
    desc: '마계의 문턱. 발이 푹푹 빠지는 늪에 켈피와 세이렌이 산다. 깊은 곳에는 마녀의 오두막이 가라앉아 있다.',
    mons: ['frogman', 'leech', 'kelpie', 'siren', 'swampthing'],
    bosses: ['toadking', 'kelpie', 'siren', 'swampthing', 'hydra'],
    dungeon: { name: '가라앉은 마녀의 오두막', bg: 'hut', mons: ['frogman', 'leech', 'siren', 'swampthing'], boss: 'swampwitch' },
    next: 'barren'
  },
  barren: {
    no: 10, name: '메마른 땅', lv: 66, bg: 'barren', tier: 7, after: 'swamp', demon: 1, unlock: '늪지대의 마녀 오두막을 공략하면 열려요',
    desc: '갈라진 땅에 재가 날린다. 트롤과 오거가 떼 지어 다니고, 마족이 버린 연구소에서 키메라가 울부짖는다.',
    mons: ['imp', 'hellhound', 'troll', 'ogre'],
    bosses: ['cerberus', 'troll', 'ogre', 'hellhound', 'ogreking'],
    dungeon: { name: '키메라 연구소', bg: 'lab', mons: ['imp', 'flesh', 'troll', 'hellhound'], boss: 'chimera' },
    next: 'castle'
  },
  castle: {
    no: 11, name: '백작의 성', lv: 78, bg: 'castle', tier: 8, after: 'barren', demon: 1, unlock: '키메라 연구소를 공략하면 열려요',
    desc: '마계 끝의 검은 성. 흡혈 박쥐와 구울이 성벽을 지키고 서큐버스와 이블아이가 복도를 떠돈다. 주인은 드라큘라 백작, 지하에는 고문실이 있다.',
    mons: ['vbat', 'ghoul', 'gargoyle', 'evileye', 'succubus'],
    bosses: ['gargoyle', 'vampknight', 'evileye', 'succubus', 'dracula'],
    dungeon: { name: '지하 고문실', bg: 'torture', mons: ['skelwar', 'skelarc', 'skelmage', 'ghoul'], boss: 'lichking' },
    next: null
  }
});
DEMON_IDS.forEach(f => { ALL_FIELDS.push(f); TIER_FIELDS.push(f); });
DUNGEON_GOLD.push(120000, 180000, 260000);

/* ───────── 장비 단계 · 보스 부속품 · 유물 ───────── */
GTIERS.push(
  { name: '늪지', lv: 52, p: 14.5, smith: 5, mats: ['siren_scale', 'kelpie_mane', 'leech_sac'] },
  { name: '마족', lv: 64, p: 19.0, smith: 6, mats: ['ogre_tooth', 'troll_hide', 'imp_horn'] },
  { name: '백작', lv: 76, p: 25.0, smith: 7, mats: ['gargoyle_shard', 'ghoul_nail', 'evil_eye'] }
);
const DEMON_BOSS_NAMES = {
  swamp:  ['늪 우두머리의 증표', '늪지대 주인의 핵', '늪지 마녀의 혼'],
  barren: ['마족 우두머리의 증표', '메마른 땅 주인의 핵', '키메라의 혼'],
  castle: ['성 우두머리의 증표', '백작의 성 주인의 핵', '리치 킹의 혼']
};
const DEMON_COL = ['#7ab86a', '#e07a4a', '#c060e0'];
DEMON_IDS.forEach((fid, i) => {
  const t = TIER_FIELDS.indexOf(fid), [a, b, c] = DEMON_BOSS_NAMES[fid];
  BOSS_COL[t] = DEMON_COL[i];
  ITEMS['crest_' + t] = { name: a, v: 60 * (t + 1), w: 1, icon: 'crest', c: DEMON_COL[i], boss: 1 };
  ITEMS['core_' + t] = { name: b, v: 220 * (t + 1), w: 2, icon: 'core', c: DEMON_COL[i], boss: 2 };
  ITEMS['soul_' + t] = { name: c, v: 900 * (t + 1), w: 1, icon: 'soul', c: DEMON_COL[i], boss: 3 };
});
Object.assign(RELICS, {
  swamp:  { name: '늪지 마녀의 가마솥',  desc: '물약 회복량 +20%',          potion: 0.2 },
  barren: { name: '키메라의 심장',       desc: '모험가 최대 체력 +6%',      hp: 0.06 },
  castle: { name: '리치 킹의 성물함',    desc: '전투 경험치 +10%',          exp: 0.1 }
});
// 왕국들도 마계 부속품을 사 간다
KINGDOMS.inglisia.wants.push('troll_hide', 'ogre_tooth', 'vamp_crest');
KINGDOMS.frama.wants.push('siren_scale', 'siren_pearl', 'succubus_wing');
KINGDOMS.elves.wants.push('kelpie_mane', 'swamp_moss', 'frog_leg');
KINGDOMS.dwarves.wants.push('gargoyle_shard', 'imp_horn', 'ogre_crown');
KINGDOMS.sarak.wants.push('hound_fang', 'evil_eye', 'dracula_cape');

STORY.demon = [
  '사막 왕릉의 거대 샌드웜이 쓰러진 날, 상단 앞에 검은 깃털이 떨어졌다.',
  '남쪽 바다 건너, 지도 끝에 「마계」라 적힌 땅이 있다. 늪지대·메마른 땅·백작의 성. 마족과 흡혈귀가 다스리는 곳이다.',
  '원정대 창의 목적지에서 「마계」를 고를 수 있다. 눅눅한 늪지대부터 시작한다.'
];
STORY.swamp = ['늪지의 마녀가 가마솥 안으로 사라졌다. 늪의 안개가 걷히자 메마른 땅으로 가는 길이 드러났다.', '가마솥 바닥에는 마녀가 끓이던 약의 비법이 눌어붙어 있었다. 상단의 물약이 더 잘 듣게 되었다.'];
STORY.barren = ['키메라가 연구소와 함께 무너졌다. 재가 날리는 땅 끝에 검은 성이 보인다.', '연구소에서 꺼낸 키메라의 심장은 아직 뛰고 있었다. 모험가들의 몸이 조금 더 튼튼해졌다.'];
STORY.castle = ['리치 킹이 성물함과 함께 부서졌다. 백작의 성에 아침 햇살이 들었다.', '성물함의 조각은 모험가들에게 죽은 자의 기억을 속삭인다. 싸울 때마다 더 많이 배운다.', '마계 세 땅이 모두 조용해졌다. 제국 사람들은 이제 7번가 입구의 상단을 「마계를 연 상단」이라 부른다.'];

/* ───────── 전직 조건: 계열마다 맨 앞 2차 직업은 레벨만, 나머지는 저마다 추가 조건 ─────────
   req: lv(최소 레벨) · fame(상단 명성) · item([부속품, 개수], 전직 때 씀) · itemAny([머리글자, 개수], 어느 단계든) · kills(그 모험가의 처치 수)
        dexFull(도감 완전 기록 몬스터 수) · bld(시설) · arenaWins(투기장 승리) · relics(유물 수) · cleared(공략한 던전 수) */
CLASSES.gladiator.req = { lv: 30 };
CLASSES.knight.req = { lv: 30, fame: 1000 };
CLASSES.berserker.req = { item: ['blood_tear', 1] };
CLASSES.spellblade.req = { bld: 'tower' };
CLASSES.sniper.req = { kills: 500 };
CLASSES.mhunter.req = { dexFull: 3 };
CLASSES.necromancer.req = { itemAny: ['soul_', 1] };
CLASSES.sorcerer.req = { lv: 30, bld: 'tower' };
CLASSES.duelist.req = { arenaWins: 10 };
CLASSES.treasure.req = { relics: 1 };
CLASSES.plaguedoc.req = { bld: 'temple' };
CLASSES.exorcist.req = { cleared: 1 };
CLASSES.coachman.req = { wagon: 1 };   // 상단에 마차(당나귀 수레 이상) 한 대
CLASSES.scout.req = { trips: 20 };     // 본인 원정 20회
const REQ_NAME = { itemAny: { soul_: '던전 주인의 혼(어느 단계든)' } };
function jobReqText(c) {
  const R = CLASSES[c] && CLASSES[c].req; if (!R) return '';
  const out = [];
  if (R.lv) out.push(`Lv${R.lv}`);
  if (R.fame) out.push(`상단 명성 ${fmt(R.fame)}`);
  if (R.arena) out.push(`투기장 랭킹 ${fmt(GLADIATOR_SCORE)}점`);
  if (R.item) out.push(`${ITEMS[R.item[0]].name} ${R.item[1]}개`);
  if (R.itemAny) out.push(`${REQ_NAME.itemAny[R.itemAny[0]] || R.itemAny[0]} ${R.itemAny[1]}개`);
  if (R.kills) out.push(`본인 처치 ${fmt(R.kills)}마리`);
  if (R.dexFull) out.push(`도감 완전 기록 ${R.dexFull}종`);
  if (R.bld) out.push(`${BUILDINGS[R.bld].name} 건설`);
  if (R.arenaWins) out.push(`투기장 ${R.arenaWins}승`);
  if (R.relics) out.push(`유물 ${R.relics}개`);
  if (R.cleared) out.push(`던전 공략 ${R.cleared}곳`);
  if (R.wagon) out.push('마차(당나귀 수레 이상) 보유');
  if (R.trips) out.push(`본인 원정 ${R.trips}회`);
  return out.join(' · ');
}
// 모자란 조건 하나를 말로 (없으면 '')
function jobReqWhy(a, c) {
  const R = CLASSES[c] && CLASSES[c].req; if (!R) return '';
  if (R.arena && arenaScore() < GLADIATOR_SCORE) return `투기장 랭킹 점수 ${fmt(GLADIATOR_SCORE)} 필요 (지금 ${fmt(arenaScore())})`;
  if (R.fame && S.fame < R.fame) return `상단 명성 ${fmt(R.fame)} 필요 (지금 ${fmt(S.fame)})`;
  if (R.item && (S.inv[R.item[0]] || 0) < R.item[1]) return `${ITEMS[R.item[0]].name} ${R.item[1]}개 필요 (창고 ${S.inv[R.item[0]] || 0})`;
  if (R.itemAny) { const n = Object.keys(S.inv).filter(k => k.startsWith(R.itemAny[0])).reduce((t, k) => t + (S.inv[k] || 0), 0); if (n < R.itemAny[1]) return `${REQ_NAME.itemAny[R.itemAny[0]] || R.itemAny[0]} ${R.itemAny[1]}개 필요 (창고 ${n})`; }
  if (R.kills && (a.kills || 0) < R.kills) return `본인 처치 ${fmt(R.kills)}마리 필요 (지금 ${fmt(a.kills || 0)})`;
  if (R.dexFull) { const n = S.dex ? Object.values(S.dex.kills || {}).filter(v => v >= 30).length : 0; if (n < R.dexFull) return `도감 완전 기록 ${R.dexFull}종 필요 (지금 ${n}종)`; }
  if (R.bld && !S.bld[R.bld]) return `${BUILDINGS[R.bld].name}이(가) 있어야 해요`;
  if (R.arenaWins && ((S.under && S.under.arena && S.under.arena.wins) || 0) < R.arenaWins) return `투기장 ${R.arenaWins}승 필요 (지금 ${(S.under && S.under.arena && S.under.arena.wins) || 0}승)`;
  if (R.relics && (S.relics || []).length < R.relics) return `유물 ${R.relics}개 필요 (지금 ${(S.relics || []).length}개)`;
  if (R.cleared) { const n = TIER_FIELDS.filter(f => S.fields[f] && S.fields[f].cleared).length; if (n < R.cleared) return `던전 공략 ${R.cleared}곳 필요 (지금 ${n}곳)`; }
  if (R.wagon && !S.parties.some(p => p.wagon && WAGONS[p.wagon] && WAGONS[p.wagon].coach)) return '마차(당나귀 수레 이상)가 있는 파티가 필요해요';
  if (R.trips && (a.trips || 0) < R.trips) return `본인 원정 ${R.trips}회 필요 (지금 ${a.trips || 0}회)`;
  return '';
}
