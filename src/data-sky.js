/* ───────── 빌드 30: 고렙 필드 넷 · 희귀종 · 둥지 · 보물 지도 · 말과 마차 · 도서관 · 비행장 · 상단 랭킹 ─────────
   안개 묘지(Lv70) → 용암 화산(Lv80) → 세계수 뿌리(Lv90)는 대륙 북쪽 변경. 메마른 땅의 연구소를 공략하면 묘지가 열리고, 앞 땅의 던전을 공략하면 다음이 열린다.
   구름섬(Lv100)은 하늘 지도의 새 지역. 세계수 뿌리의 던전을 공략하고 비행장을 지은 뒤, 비행 마차를 단 파티만 간다. */
const FRONTIER_IDS = ['grave', 'volcano', 'roots'];
const SKY_IDS = ['sky'];
const SKY_NAME = '하늘';

/* ───────── 부속품 ───────── */
Object.assign(ITEMS, {
  // 안개 묘지
  wisp_flame:     { name: '도깨비불 불씨',      v: 420,  w: 1, icon: 'drop',   c: '#8ae0ff' },
  zombie_cloth:   { name: '썩은 수의',          v: 400,  w: 2, icon: 'hide',   c: '#6a7a5a' },
  banshee_veil:   { name: '밴시의 베일',        v: 460,  w: 1, icon: 'wing',   c: '#c8d8ff' },
  wraith_shard:   { name: '망령의 검 조각',     v: 480,  w: 2, icon: 'blade',  c: '#8a9ab8' },
  ghost_bark:     { name: '원혼 나무껍질',      v: 440,  w: 3, icon: 'ore',    c: '#4a5a4a' },
  mummy_wrap:     { name: '미라 붕대',          v: 450,  w: 1, icon: 'hide',   c: '#d8c8a0' },
  reaper_scythe:  { name: '사신의 낫날',        v: 3600, w: 2, icon: 'blade',  c: '#c0c8d8' },
  dk_helm:        { name: '죽음의 기사 투구',   v: 14000, w: 3, icon: 'crown', c: '#4a4a6a' },
  // 용암 화산
  magma_core:     { name: '마그마 핵',          v: 520,  w: 1, icon: 'core',   c: '#ff8a30' },
  firebat_wing:   { name: '불박쥐 날개',        v: 500,  w: 1, icon: 'wing',   c: '#e05a2a' },
  salamander_scale:{ name: '샐러맨더 비늘',     v: 560,  w: 1, icon: 'gem',    c: '#f0a040' },
  lava_stone:     { name: '용암석',             v: 540,  w: 3, icon: 'ore',    c: '#6a3a2a' },
  redhare_mane:   { name: '적토마 갈기',        v: 640,  w: 2, icon: 'hide',   c: '#c83a2a' },
  efreet_ember:   { name: '이프리트의 불씨',    v: 600,  w: 1, icon: 'drop',   c: '#ffd040' },
  dragon_magma:   { name: '마그마 드래곤의 비늘', v: 4200, w: 2, icon: 'gem',  c: '#ff6a2a' },
  firelord_crown: { name: '화염 군주의 왕관',   v: 16000, w: 3, icon: 'crown', c: '#ffb020' },
  // 세계수 뿌리
  root_silk:      { name: '뿌리 거미줄',        v: 660,  w: 1, icon: 'blob',   c: '#d8e8c0' },
  guard_bark:     { name: '수호자의 나무껍질',  v: 700,  w: 3, icon: 'ore',    c: '#6a4a2a' },
  dryad_leaf:     { name: '드라이어드의 잎',    v: 720,  w: 1, icon: 'leaf',   c: '#6ad86a' },
  moss_core:      { name: '이끼 골렘의 핵',     v: 740,  w: 2, icon: 'core',   c: '#5aa84a' },
  rootworm_hide:  { name: '뿌리 웜 가죽',       v: 680,  w: 2, icon: 'hide',   c: '#a08a5a' },
  serpent_fang:   { name: '세계수 뱀의 송곳니', v: 5000, w: 2, icon: 'fang',   c: '#9ad8a0' },
  heart_sap:      { name: '세계수 심장의 수액', v: 18000, w: 2, icon: 'potion', c: '#c8ff80' },
  // 구름섬
  cloud_wool:     { name: '구름 양털',          v: 820,  w: 1, icon: 'blob',   c: '#f4f8ff' },
  skyray_fin:     { name: '하늘 가오리 지느러미', v: 860, w: 1, icon: 'wing',  c: '#9ad0ff' },
  thunder_feather:{ name: '뇌조의 깃털',        v: 900,  w: 1, icon: 'wing',   c: '#ffe060' },
  pegasus_feather:{ name: '페가수스의 깃털',    v: 980,  w: 1, icon: 'wing',   c: '#ffffff' },
  cloudstone:     { name: '구름 거인의 돌',     v: 940,  w: 3, icon: 'ore',    c: '#b8c8e0' },
  sky_crest:      { name: '하늘 기사의 문장',   v: 920,  w: 1, icon: 'crest',  c: '#6aa0ff' },
  titan_heart:    { name: '하늘 거인의 심장',   v: 6000, w: 3, icon: 'heart',  c: '#8ab8ff' },
  emperor_crown:  { name: '하늘 황제의 관',     v: 22000, w: 3, icon: 'crown', c: '#ffe8a0' },
  // 그 밖
  goat_horn:      { name: '산양 뿔',            v: 260,  w: 1, icon: 'horn',   c: '#d8c8a8' },
  mimic_tongue:   { name: '미믹의 혀',          v: 900,  w: 1, icon: 'tail',   c: '#e05a7a' },
  gold_dust:      { name: '황금 가루',          v: 1500, w: 1, icon: 'gem',    c: '#ffd040' },
  tmap:           { name: '보물 지도',          v: 2500, w: 1, icon: 'book',   c: '#d8b878', use: 'tmap', desc: '필드의 우두머리·주인이 가끔 남기는 낡은 지도. 원정대 창에서 「보물 던전」을 골라 떠나면 한 장을 쓴다. 안에는 미믹과 황금 골렘, 상자가 있다.' },
  parchment:      { name: '양피지',             v: 60,   w: 1, icon: 'book',   c: '#f0e0b8', buy: 120, desc: '스킬북을 만드는 데 쓴다. 도서관에서 산다.' },
  ink:            { name: '먹물',               v: 90,   w: 1, icon: 'potion', c: '#2a2a3a', buy: 180, desc: '스킬북을 만드는 데 쓴다. 도서관에서 산다.' },
  horseshoe:      { name: '강철 편자',          v: 400,  w: 1, icon: 'ring',   c: '#9aa0a8', buy: 800, desc: '마차 강화에 쓴다. 마구간에서 산다.' }
});

/* ───────── 몬스터 (그림은 pxmon3.js) ───────── */
Object.assign(MONS, {
  // 만년설산에 더해지는 고산지대 산양 (알 → 펫 → 드워프 강철 마차를 끈다)
  alpgoat:    { name: '고산지대 산양',   plan: 'quad',  body: '#e8e0d0', dark: '#a89a84', mh: 1.3, ma: 1.0, md: 1.1, spd: 1.2, eva: 0.1, minS: 3, drops: [['goat_horn', 0.5], ['yeti_fur', 0.1]] },
  // 안개 묘지
  wisp:       { name: '도깨비불',        plan: 'blob',  body: '#8ae0ff', dark: '#3a8ab8', mh: 0.9, ma: 1.4, md: 0.4, spd: 1.4, eva: 0.28, magic: 1, minS: 1, sta: { k: 'chill', p: 0.25, d: 6, m: 0.3 }, drops: [['wisp_flame', 0.6]] },
  zombie:     { name: '좀비',            plan: 'biped', body: '#7a8a6a', dark: '#4a5a3a', skin: '#9aa88a', mh: 2.2, ma: 1.3, md: 0.9, spd: 0.7, minS: 1, sta: { k: 'poison', p: 0.3, d: 8, m: 0.3 }, drops: [['zombie_cloth', 0.55]] },
  banshee:    { name: '밴시',            plan: 'ghost', body: '#c8d8ff', dark: '#7a8ac8', skin: '#e8f0ff', mh: 1.4, ma: 1.7, md: 0.5, spd: 1.1, eva: 0.2, magic: 1, minS: 2, sta: { k: 'weak', p: 0.3, d: 8, m: 0.25 }, drops: [['banshee_veil', 0.45]] },
  wraith:     { name: '망령 기사',       plan: 'biped', body: '#4a5a7a', dark: '#2a3448', skin: '#8a9ab8', mh: 2.2, ma: 1.6, md: 1.5, spd: 1.0, minS: 4, sta: { k: 'bleed', p: 0.3, d: 8, m: 0.3 }, drops: [['wraith_shard', 0.45]] },
  ghosttree:  { name: '원혼 나무',       plan: 'tree',  body: '#3a4a3a', dark: '#1e2a1e', leaf: '#8ae0c0', mh: 2.8, ma: 1.4, md: 1.7, spd: 0.6, minS: 6, sta: { k: 'para', p: 0.2, d: 3, m: 0 }, drops: [['ghost_bark', 0.5]] },
  mummy:      { name: '미라',            plan: 'biped', body: '#d8c8a0', dark: '#9a8a62', skin: '#b8a880', mh: 2.4, ma: 1.4, md: 1.3, spd: 0.75, sta: { k: 'weak', p: 0.25, d: 8, m: 0.25 }, drops: [['mummy_wrap', 0.5]] },
  reaper:     { name: '사신',            plan: 'ghost', body: '#2a2a3a', dark: '#141420', skin: '#d8d8e0', fb: 5, scale: 3, mh: 3.4, ma: 2.0, md: 1.6, spd: 1.0, eva: 0.15, magic: 1, aoe: 1, sta: { k: 'bleed', p: 0.4, d: 10, m: 0.35 }, drops: [['reaper_scythe', 0.8], ['wisp_flame', 1, 2]] },
  deathknight:{ name: '죽음의 기사 모르간', plan: 'biped', body: '#3a3a5a', dark: '#1e1e34', skin: '#9aa0c0', boss: 1, scale: 2, mh: 7, ma: 2.3, md: 1.9, spd: 0.95, aoe: 1, sta: { k: 'bleed', p: 0.4, d: 10, m: 0.4 }, drops: [['dk_helm', 1], ['wraith_shard', 1, 3]] },
  // 용암 화산
  magmaslime: { name: '마그마 슬라임',   plan: 'blob',  body: '#ff8a30', dark: '#a83a1a', mh: 1.4, ma: 1.3, md: 1.1, spd: 0.8, minS: 1, sta: { k: 'burn', p: 0.3, d: 8, m: 0.3 }, drops: [['magma_core', 0.6]] },
  firebat:    { name: '불박쥐',          plan: 'flyer', body: '#e05a2a', dark: '#7a2a14', mh: 1.0, ma: 1.4, md: 0.5, spd: 1.6, eva: 0.25, minS: 1, sta: { k: 'burn', p: 0.25, d: 8, m: 0.25 }, drops: [['firebat_wing', 0.55]] },
  salamander: { name: '샐러맨더',        plan: 'quad',  body: '#f0a040', dark: '#a85a1a', mh: 1.9, ma: 1.5, md: 1.4, spd: 1.0, minS: 2, sta: { k: 'burn', p: 0.35, d: 8, m: 0.3 }, drops: [['salamander_scale', 0.5]] },
  lavagolem:  { name: '용암 골렘',       plan: 'golem', body: '#5a3a30', dark: '#2e1a14', core: '#ff8a30', mh: 3.0, ma: 1.6, md: 2.4, spd: 0.6, minS: 4, sta: { k: 'stun', p: 0.15, d: 2, m: 0 }, drops: [['lava_stone', 0.5]] },
  redhare:    { name: '적토마',          plan: 'quad',  body: '#c83a2a', dark: '#7a1e14', mh: 1.8, ma: 1.6, md: 1.0, spd: 1.5, eva: 0.15, minS: 5, drops: [['redhare_mane', 0.45]] },
  efreet:     { name: '이프리트',        plan: 'ghost', body: '#ff6a2a', dark: '#a82a10', skin: '#ffd040', mh: 2.2, ma: 1.7, md: 0.9, spd: 1.0, eva: 0.1, magic: 1, minS: 6, sta: { k: 'burn', p: 0.3, d: 8, m: 0.3 }, drops: [['efreet_ember', 0.45]] },
  magmadragon:{ name: '마그마 드래곤',   plan: 'flyer', body: '#8a2a1a', dark: '#4a1008', beak: '#ffd040', big: 1, fb: 5, scale: 3, mh: 3.6, ma: 2.1, md: 1.8, spd: 0.9, eva: 0.1, aoe: 1, sta: { k: 'burn', p: 0.45, d: 10, m: 0.4 }, drops: [['dragon_magma', 0.8], ['magma_core', 1, 2]] },
  firelord:   { name: '화염 군주 이프리트', plan: 'ghost', body: '#ff4a10', dark: '#8a1a00', skin: '#ffe080', boss: 1, scale: 2, mh: 7.5, ma: 2.5, md: 1.8, spd: 1.0, magic: 1, aoe: 1, sta: { k: 'burn', p: 0.5, d: 12, m: 0.4 }, drops: [['firelord_crown', 1], ['efreet_ember', 1, 3]] },
  // 세계수 뿌리
  rootspider: { name: '뿌리 거미',       plan: 'bug',   body: '#6a5a3a', dark: '#3a2e1a', eye: '#8aff8a', mh: 1.5, ma: 1.6, md: 0.9, spd: 1.3, eva: 0.12, minS: 1, sta: { k: 'poison', p: 0.35, d: 8, m: 0.3 }, drops: [['root_silk', 0.6]] },
  treantguard:{ name: '트렌트 수호자',   plan: 'tree',  body: '#5a3a1a', dark: '#2e1e0c', leaf: '#3a8a3a', mh: 3.2, ma: 1.6, md: 2.0, spd: 0.6, minS: 2, sta: { k: 'stun', p: 0.15, d: 2, m: 0 }, drops: [['guard_bark', 0.5]] },
  dryad:      { name: '드라이어드',      plan: 'ghost', body: '#6ad86a', dark: '#2a7a3a', skin: '#e8d8b0', mh: 1.6, ma: 1.9, md: 0.8, spd: 1.1, eva: 0.2, magic: 1, minS: 3, sta: { k: 'para', p: 0.25, d: 3, m: 0 }, drops: [['dryad_leaf', 0.45]] },
  mossgolem:  { name: '이끼 골렘',       plan: 'golem', body: '#4a7a3a', dark: '#243e1c', core: '#c8ff80', mh: 3.2, ma: 1.6, md: 2.5, spd: 0.6, minS: 4, drops: [['moss_core', 0.45]] },
  rootworm:   { name: '뿌리 웜',         plan: 'worm',  body: '#a08a5a', dark: '#5a4a2a', mh: 2.8, ma: 1.8, md: 1.3, spd: 0.75, minS: 6, sta: { k: 'poison', p: 0.3, d: 10, m: 0.35 }, drops: [['rootworm_hide', 0.45]] },
  worldserpent:{ name: '세계수의 뱀',    plan: 'worm',  body: '#3a8a5a', dark: '#1a4a2e', fb: 5, scale: 3, mh: 3.8, ma: 2.2, md: 1.9, spd: 0.8, aoe: 1, sta: { k: 'poison', p: 0.45, d: 12, m: 0.4 }, drops: [['serpent_fang', 0.8], ['root_silk', 1, 2]] },
  corruptheart:{ name: '타락한 세계수의 심장', plan: 'tree', body: '#3a2a3a', dark: '#1a0e1a', leaf: '#c060e0', boss: 1, scale: 2, mh: 8, ma: 2.6, md: 2.0, spd: 0.6, magic: 1, aoe: 1, sta: { k: 'poison', p: 0.5, d: 12, m: 0.4 }, drops: [['heart_sap', 1], ['dryad_leaf', 1, 3]] },
  // 구름섬
  cloudsheep: { name: '구름 양',         plan: 'quad',  body: '#f4f8ff', dark: '#b8c8e0', mh: 1.6, ma: 1.4, md: 1.2, spd: 1.0, minS: 1, drops: [['cloud_wool', 0.6]] },
  skyray:     { name: '하늘 가오리',     plan: 'flyer', body: '#9ad0ff', dark: '#4a7ab8', mh: 1.8, ma: 1.7, md: 0.9, spd: 1.3, eva: 0.25, minS: 1, sta: { k: 'chill', p: 0.3, d: 6, m: 0.3 }, drops: [['skyray_fin', 0.55]] },
  thunderbird:{ name: '뇌조',            plan: 'flyer', body: '#ffe060', dark: '#a88a1a', mh: 1.7, ma: 2.0, md: 0.8, spd: 1.4, eva: 0.2, magic: 1, minS: 2, sta: { k: 'para', p: 0.3, d: 3, m: 0 }, drops: [['thunder_feather', 0.5]] },
  pegasus:    { name: '페가수스',        plan: 'quad',  body: '#ffffff', dark: '#a8b8d8', mh: 2.0, ma: 1.8, md: 1.2, spd: 1.6, eva: 0.2, minS: 4, drops: [['pegasus_feather', 0.45]] },
  cloudgiant: { name: '구름 거인',       plan: 'giant', body: '#b8c8e0', dark: '#6a7a98', mh: 3.4, ma: 1.9, md: 2.2, spd: 0.6, minS: 5, sta: { k: 'stun', p: 0.2, d: 2, m: 0 }, drops: [['cloudstone', 0.5]] },
  skyknight:  { name: '하늘 기사',       plan: 'biped', body: '#6aa0ff', dark: '#2a4a98', skin: '#f1c9a5', mh: 2.6, ma: 2.0, md: 1.8, spd: 1.1, minS: 6, drops: [['sky_crest', 0.45]] },
  skytitan:   { name: '하늘의 거인',     plan: 'giant', body: '#8ab8ff', dark: '#3a5a98', fb: 5, scale: 3, mh: 4.2, ma: 2.4, md: 2.2, spd: 0.7, aoe: 1, sta: { k: 'stun', p: 0.3, d: 2, m: 0 }, drops: [['titan_heart', 0.8], ['cloudstone', 1, 2]] },
  skyemperor: { name: '하늘의 황제',     plan: 'biped', body: '#ffe8a0', dark: '#a88a3a', skin: '#f1c9a5', boss: 1, scale: 2, mh: 9, ma: 2.8, md: 2.2, spd: 1.0, eva: 0.15, magic: 1, aoe: 1, sta: { k: 'para', p: 0.4, d: 3, m: 0 }, drops: [['emperor_crown', 1], ['sky_crest', 1, 3]] },
  // 보물 던전
  mimic:      { name: '미믹',            plan: 'blob',  body: '#a8743e', dark: '#5a3a1a', mh: 2.4, ma: 1.6, md: 1.4, spd: 0.9, sta: { k: 'stun', p: 0.2, d: 2, m: 0 }, drops: [['mimic_tongue', 0.5], ['gold_dust', 0.3]] },
  goldgolem:  { name: '황금 골렘',       plan: 'golem', body: '#f0c24a', dark: '#a8781a', core: '#ffffff', mh: 3.0, ma: 1.6, md: 2.6, spd: 0.6, drops: [['gold_dust', 0.6]] },
  treasureguard:{ name: '보물 수호자',   plan: 'golem', body: '#ffd860', dark: '#b8882a', core: '#ff6a5a', boss: 1, scale: 2, mh: 6, ma: 2.0, md: 2.4, spd: 0.6, aoe: 1, drops: [['gold_dust', 1, 4], ['mimic_tongue', 1, 2]] }
});
FIELDS.snow.mons.push('alpgoat');

/* ───────── 필드 ───────── */
Object.assign(FIELDS, {
  grave: {
    no: 12, name: '안개 묘지', lv: 70, bg: 'grave', tier: 9, after: 'barren', frontier: 1, unlock: '메마른 땅의 키메라 연구소를 공략하면 열려요',
    desc: '안개가 걷히지 않는 북쪽 묘지와 유령 숲. 도깨비불이 길을 홀리고 좀비와 망령 기사가 무덤에서 기어 나온다. 밤에는 훨씬 많이 몰려온다.',
    mons: ['wisp', 'zombie', 'banshee', 'wraith', 'ghosttree'],
    bosses: ['zombie', 'wraith', 'banshee', 'ghosttree', 'reaper'],
    dungeon: { name: '잊힌 지하 묘소', bg: 'catacomb', mons: ['zombie', 'mummy', 'wraith', 'banshee'], boss: 'deathknight' },
    next: 'volcano'
  },
  volcano: {
    no: 13, name: '용암 화산', lv: 80, bg: 'volcano', tier: 10, after: 'grave', frontier: 1, unlock: '안개 묘지의 지하 묘소를 공략하면 열려요',
    desc: '불을 뿜는 화산. 마그마 슬라임과 샐러맨더가 용암 사이를 기어 다니고, 적토마 떼가 재를 차며 달린다. 화구 깊은 곳에는 화염 군주가 산다.',
    mons: ['magmaslime', 'firebat', 'salamander', 'lavagolem', 'redhare', 'efreet'],
    bosses: ['salamander', 'lavagolem', 'redhare', 'efreet', 'magmadragon'],
    dungeon: { name: '불의 심장 화구', bg: 'crater', mons: ['magmaslime', 'salamander', 'lavagolem', 'efreet'], boss: 'firelord' },
    next: 'roots'
  },
  roots: {
    no: 14, name: '세계수 뿌리', lv: 90, bg: 'roots', tier: 11, after: 'volcano', frontier: 1, unlock: '용암 화산의 화구를 공략하면 열려요',
    desc: '세계수의 뿌리가 얽힌 거대한 땅속 숲. 뿌리 거미와 트렌트 수호자가 침입자를 막고, 드라이어드가 노래한다. 가장 깊은 곳에서 세계수의 심장이 검게 뛴다.',
    mons: ['rootspider', 'treantguard', 'dryad', 'mossgolem', 'rootworm'],
    bosses: ['rootspider', 'treantguard', 'mossgolem', 'dryad', 'worldserpent'],
    dungeon: { name: '세계수의 심장', bg: 'heartwood', mons: ['rootspider', 'treantguard', 'dryad', 'rootworm'], boss: 'corruptheart' },
    next: null
  },
  sky: {
    no: 15, name: '구름섬', lv: 100, bg: 'sky', tier: 12, after: 'roots', region: 'sky', unlock: '세계수의 심장을 공략하고 비행장을 지으면 열려요',
    desc: '구름 위에 떠 있는 섬. 구름 양이 풀을 뜯고 하늘 가오리와 뇌조가 난다. 페가수스가 사는 곳이며, 섬 꼭대기 신전에는 하늘의 황제가 있다. 비행 마차를 단 파티만 갈 수 있다.',
    mons: ['cloudsheep', 'skyray', 'thunderbird', 'pegasus', 'cloudgiant', 'skyknight'],
    bosses: ['skyray', 'pegasus', 'thunderbird', 'cloudgiant', 'skytitan'],
    dungeon: { name: '구름 위 신전', bg: 'cloudtemple', mons: ['cloudsheep', 'skyknight', 'thunderbird', 'cloudgiant'], boss: 'skyemperor' },
    next: null
  },
  // 보물 지도로 가는 작은 던전 (필드 목록에는 안 보이고, 지도가 있을 때만 목적지에 뜬다)
  treasure: {
    no: 0, name: '보물 던전', lv: 20, bg: 'vault', tier: 0, raid: 1, hidden: 1, treasure: 1,
    desc: '낡은 보물 지도가 가리키는 곳. 세 층으로 된 작은 보물고에 미믹과 황금 골렘이 지키는 상자가 있다. 층마다 상자를 열고, 맨 아래층의 수호자를 쓰러뜨리면 보물을 전부 가져온다.',
    mons: [],
    dungeon: { name: '보물고', bg: 'vault', mons: ['mimic', 'goldgolem'], boss: 'treasureguard' },
    next: null
  }
});
FRONTIER_IDS.concat(SKY_IDS).forEach(f => { ALL_FIELDS.push(f); TIER_FIELDS.push(f); });
ALL_FIELDS.push('treasure');
DUNGEON_GOLD.push(360000, 480000, 640000, 900000);
const TREASURE_FLOORS = 3;

/* ───────── 장비 단계 · 보스 부속품 · 유물 ───────── */
GTIERS.push(
  { name: '망령',   lv: 70, p: 27.0, smith: 7, mats: ['wraith_shard', 'zombie_cloth', 'wisp_flame'] },
  { name: '화염',   lv: 80, p: 32.0, smith: 8, mats: ['salamander_scale', 'lava_stone', 'magma_core'] },
  { name: '세계수', lv: 90, p: 38.0, smith: 9, mats: ['guard_bark', 'rootworm_hide', 'dryad_leaf'] },
  { name: '천공',   lv: 100, p: 45.0, smith: 10, mats: ['cloudstone', 'skyray_fin', 'pegasus_feather'] }
);
const FRONT_BOSS_NAMES = {
  grave:   ['묘지 우두머리의 증표', '안개 묘지 주인의 핵', '죽음의 기사의 혼'],
  volcano: ['화산 우두머리의 증표', '용암 화산 주인의 핵', '화염 군주의 혼'],
  roots:   ['뿌리 우두머리의 증표', '세계수 뿌리 주인의 핵', '타락한 심장의 혼'],
  sky:     ['구름 우두머리의 증표', '구름섬 주인의 핵', '하늘 황제의 혼']
};
const FRONT_COL = ['#9ab0d8', '#ff8a30', '#8ad87a', '#ffe8a0'];
FRONTIER_IDS.concat(SKY_IDS).forEach((fid, i) => {
  const t = TIER_FIELDS.indexOf(fid), [a, b, c] = FRONT_BOSS_NAMES[fid];
  BOSS_COL[t] = FRONT_COL[i];
  ITEMS['crest_' + t] = { name: a, v: 60 * (t + 1), w: 1, icon: 'crest', c: FRONT_COL[i], boss: 1 };
  ITEMS['core_' + t] = { name: b, v: 220 * (t + 1), w: 2, icon: 'core', c: FRONT_COL[i], boss: 2 };
  ITEMS['soul_' + t] = { name: c, v: 900 * (t + 1), w: 1, icon: 'soul', c: FRONT_COL[i], boss: 3 };
});
Object.assign(RELICS, {
  grave:   { name: '죽음의 기사의 방패',  desc: '모험가가 받는 피해 -6%',          guard: 0.06 },
  volcano: { name: '화염 군주의 모루',    desc: '대장간 제작비 -15%',              smith: 0.15 },
  roots:   { name: '세계수의 씨앗',       desc: '모험가 최대 체력 +8%',            hp: 0.08 },
  sky:     { name: '하늘 황제의 날개',    desc: '모험가 이동속도 +12%',            move: 0.12 }
});
// 대장간을 두 단계 더 넓혀 세계수·천공 장비를 만든다
BUILDINGS.smithy.max = 10; BUILDINGS.smithy.cost.push(200000, 320000);
KINGDOMS.inglisia.wants.push('wraith_shard', 'sky_crest');
KINGDOMS.frama.wants.push('banshee_veil', 'pegasus_feather', 'cloud_wool');
KINGDOMS.elves.wants.push('dryad_leaf', 'guard_bark', 'ghost_bark');
KINGDOMS.dwarves.wants.push('lava_stone', 'magma_core', 'cloudstone');
KINGDOMS.sarak.wants.push('salamander_scale', 'efreet_ember', 'thunder_feather');

/* ───────── 희귀종: 어느 몬스터든 아주 가끔 반짝이는 개체로 나온다 ─────────
   잡으면 도감에 기록되고, 그 뒤로 같은 종을 잡을 때 피해와 전리품이 늘어난다. 희귀종은 개화석을 꼭 남긴다. */
const RARE = { p: 1 / 300, hp: 3, atk: 1.4, def: 1.3, eva: 0.1, exp: 5, dmg: 0.15, drop: 0.25, name: '반짝이는 ' };

/* ───────── 몬스터 둥지: 필드 하나에 사흘 동안 둥지가 생긴다 ─────────
   둥지 몬스터(강한 개체, 전리품 두 배)가 섞여 나오고, 정해진 수를 잡으면 둥지를 치운 보상(돈·명성·그 필드의 알)을 받는다. */
const NEST = { days: 3, p: 0.4, need: 12, hp: 1.6, atk: 1.2, extra: 1, name: '둥지 ' };

/* ───────── 보물 지도 ───────── */
const TMAP_DROP = { fb: 0.04, lord: 0.08 };

/* ───────── 말: 마구간에서 사거나(노쇠~명마) 펫을 맨다(적토마·켈피·페가수스·산양·그리폰·와이번) ─────────
   cap·spd: 마차 몸체에 곱하는 배율. fly: 비행 마차를 끌 수 있다. lv: 마구간 단계 */
const HORSES = {
  old:     { name: '노쇠',   cost: 300,   cap: 0.8,  spd: 0.9,  lv: 1, desc: '늙은 말. 느리지만 어디든 간다.' },
  donkey:  { name: '당나귀', cost: 900,   cap: 0.9,  spd: 0.95, lv: 1, desc: '고집 세지만 튼튼하다.' },
  gray:    { name: '갈마',   cost: 2500,  cap: 1.0,  spd: 1.0,  lv: 1, desc: '평원 농가에서 기른 갈색 말.' },
  black:   { name: '흑마',   cost: 5000,  cap: 1.1,  spd: 1.06, lv: 2, desc: '검은 털의 빠른 말.' },
  white:   { name: '백마',   cost: 9000,  cap: 1.2,  spd: 1.12, lv: 2, desc: '기사들이 타는 흰 말.' },
  war:     { name: '군마',   cost: 14000, cap: 1.35, spd: 1.16, lv: 3, desc: '전장에서 길들인 말. 겁이 없다.' },
  noble:   { name: '명마',   cost: 20000, cap: 1.5,  spd: 1.25, lv: 3, desc: '왕국의 경주를 휩쓴 명마.' },
  redhare: { name: '적토마',   pet: 'redhare', cap: 1.7, spd: 1.4, desc: '하루에 천 리를 달리는 붉은 말.' },
  kelpie:  { name: '켈피',     pet: 'kelpie',  cap: 1.9, spd: 1.3, desc: '늪의 물말. 짐을 물처럼 가볍게 끈다.' },
  pegasus: { name: '페가수스', pet: 'pegasus', cap: 2.1, spd: 1.55, fly: 1, desc: '날개 달린 말. 비행 마차를 끌면 페가수스 마차.' },
  goat:    { name: '고산지대 산양', pet: 'goat', cap: 1.4, spd: 1.0, steel: 1, desc: '드워프 강철 마차를 끄는 산양.' },
  griffon: { name: '그리폰',   pet: 'griffon', cap: 1.5, spd: 1.5, fly: 1, desc: '비행 마차를 끌면 그리폰 마차.' },
  wyvern:  { name: '와이번',   pet: 'wyvern',  cap: 1.8, spd: 1.3, fly: 1, desc: '비행 마차를 끌면 와이번 마차.' }
};
const HORSE_IDS = Object.keys(HORSES);
const HORSE_BUY = HORSE_IDS.filter(k => !HORSES[k].pet);
const horseOfPet = kind => HORSE_IDS.find(k => HORSES[k].pet === kind) || null;
const WAGON_PLUS_MAX = 5, WAGON_PLUS = { cap: 0.08, spd: 0.02 };
const wagonPlusCost = (w, n) => ({ gold: Math.round(WAGONS[w].cost * (0.25 + 0.15 * n) / 10) * 10, shoe: 1 + n, ore: 4 + n * 3 });

/* ───────── 마차 몸체 (data-biz.js WAGONS에 비행 마차를 더한다) ───────── */
WAGONS.sky = { name: '비행 마차', cost: 30000, cap: 140, spd: 1.15, horse: 'fly', fly: 1, bld: 'airfield', desc: '비행장에서 만드는 날개 달린 마차. 그리폰·와이번·페가수스가 끌며, 구름섬에 갈 수 있다.' };
WAGON_IDS.push('sky');

/* ───────── 새 펫: 산양(만년설산) · 와이번(바람계곡) · 적토마(용암 화산) · 페가수스(구름섬) ───────── */
Object.assign(PETS, {
  goat:    { name: '아기 산양',     mon: 'alpgoat', field: 'snow',    act: 'guard', pow: 0.9, cd: 9, likes: ['herb', 'goat_horn'],             home: ['rest', 0.04],    evo: '바위산 산양', c: '#e8e0d0', desc: '뿔로 받아 파티를 지킨다. 자라면 드워프 강철 마차를 끈다.' },
  wyvern:  { name: '아기 와이번',   mon: 'wyvern',  field: 'valley',  act: 'ember', pow: 1.1, cd: 4, likes: ['wyvern_scale', 'fireherb'],      home: ['traffic', 0.05], evo: '폭풍 와이번',  c: '#4f8a5a', magic: 1, fx: 'fire', sta: { k: 'burn', p: 0.3, d: 8, m: 0.3 }, desc: '불을 뿜어 적을 태운다. 자라면 비행 마차를 끈다.' },
  redhare: { name: '적토마 망아지', mon: 'redhare', field: 'volcano', act: 'bite',  pow: 1.2, cd: 3, likes: ['redhare_mane', 'herb'],          home: ['move', 0.06],    evo: '적토마',       c: '#c83a2a', desc: '발굽으로 걷어찬다. 자라면 마차를 바람처럼 끈다.' },
  pegasus: { name: '페가수스 망아지', mon: 'pegasus', field: 'sky',   act: 'song',  pow: 1.2, cd: 8, likes: ['pegasus_feather', 'cloud_wool'], home: ['exp', 0.06],     evo: '페가수스',     c: '#ffffff', fx: 'wind', desc: '날갯짓으로 파티의 공격력을 올린다. 자라면 비행 마차를 끈다.' }
});
['goat', 'wyvern', 'redhare', 'pegasus'].forEach(k => { PET_IDS.push(k); const P = PETS[k]; ITEMS['egg_' + k] = { name: `${MONS[P.mon].name} 알`, v: 1200 + (FIELDS[P.field] ? FIELDS[P.field].lv * 60 : 600), w: 2, icon: 'egg', c: P.c, egg: k, use: 'egg', desc: `사육장에서 ${PET_HATCH_DAYS}일 품으면 ${P.name}이(가) 태어난다. ${P.desc}` }; });

/* ───────── 건물: 마구간 · 도서관 · 비행장 ───────── */
BUILDINGS.stable = { name: '마구간', max: 3, cost: [2500, 9000, 24000], desc: '말을 사서 마차에 매고, 마차를 바꾸고 강화한다. 펫도 맬 수 있다.', eff: lv => `말 ${2 + lv * 2}마리 · ${lv >= 3 ? '명마까지' : lv >= 2 ? '백마까지' : '갈마까지'} 판매 · 마차 강화 +${Math.min(WAGON_PLUS_MAX, lv + 2)}까지` };
BUILDINGS.library = { name: '도서관', max: 3, cost: [5000, 20000, 60000], desc: '양피지·먹물과 몬스터 부속품을 모아 스킬북을 만든다.', eff: lv => `Lv${[30, 55, 100][lv - 1]} 스킬북까지 제작${lv > 1 ? ` · 제작비 -${(lv - 1) * 15}%` : ''}` };
BUILDINGS.airfield = { name: '비행장', max: 2, cost: [40000, 120000], desc: '비행 마차를 만들고, 구름섬으로 가는 원정을 띄운다.', eff: lv => `비행 마차 제작 · 구름섬 원정${lv >= 2 ? ' · 비행 마차 짐 +20%' : ''}` };
BUILD_RANK.stable = 1; BUILD_RANK.library = 3; BUILD_RANK.airfield = 5;
BUILD_ORDER.splice(BUILD_ORDER.indexOf('pen') + 1, 0, 'stable');
BUILD_ORDER.push('library', 'airfield');
const stableCap = () => 2 + (S.bld.stable || 0) * 2;
const LIB_MAXLV = [0, 30, 55, 100];
// 스킬북 레시피: 양피지·먹물 + 그 책을 떨어뜨리는 몬스터의 부속품
function bookRecipe(sk) {
  const s = SKILLS[sk], mons = (BOOK_MONS[sk] || []).filter(m => MONS[m] && !MONS[m].boss && MONS[m].drops.length).slice(0, 2);
  if (!s || !mons.length) return null;
  const need = { parchment: 2 + Math.floor(s.lv / 15), ink: 1 + Math.floor(s.lv / 25) };
  mons.forEach(m => { const it = MONS[m].drops[0][0]; need[it] = (need[it] || 0) + 2 + Math.floor(s.lv / 20); });
  const fee = Math.round((200 + s.lv * 40) * (1 - Math.max(0, (S && S.bld.library ? S.bld.library : 1) - 1) * 0.15) / 10) * 10;
  return { need, fee };
}

/* ───────── 상단 랭킹: 달마다 이웃 상단들과 점수를 겨룬다 ───────── */
const LEAGUE = { rewards: [{ gold: 1.0, fame: 30, title: '이달의 상단' }, { gold: 0.5, fame: 15 }, { gold: 0.25, fame: 8 }], base: 3000 };

/* ───────── 이야기 ───────── */
STORY.v30 = ['북쪽 변경과 하늘이 열렸다.', '새 필드: 안개 묘지(Lv70) · 용암 화산(Lv80) · 세계수 뿌리(Lv90). 메마른 땅의 연구소를 공략하면 묘지가 열리고, 던전을 공략할 때마다 다음 땅이 열린다. 구름섬(Lv100)은 하늘 지도의 새 지역이라 비행장을 짓고 비행 마차를 단 파티만 간다.', '희귀종: 어느 몬스터든 아주 가끔 반짝이는 개체가 나온다. 잡으면 개화석을 남기고, 도감에 기록되어 그 종을 잡을 때 피해 +15%, 전리품 +25%. 몬스터 둥지: 사흘 동안 필드 하나에 둥지가 생긴다. 둥지 몬스터를 12마리 잡으면 돈·명성·그 필드의 알을 받는다. 보물 지도: 필드의 우두머리(4%)·주인(8%)이 남긴다. 원정대 창의 「보물 던전」으로 떠난다.', '마구간: 말을 사서(노쇠→당나귀→갈마→흑마→백마→군마→명마) 마차에 맨다. 적토마·켈피·페가수스·산양·그리폰·와이번은 알을 부화시킨 펫을 맨다. 마차는 손수레 말고는 짐꾼 계열이 파티에 있어야 끌고, 짐꾼 계열은 파티당 한 명만. 드워프 강철 마차는 고산지대 산양이, 비행 마차는 그리폰·와이번·페가수스가 끈다. 마차는 +5까지 강화(짐 +8%·속도 +2%씩).', '도서관: 양피지·먹물과 부속품으로 스킬북을 만든다. 비행장: 비행 마차를 만들고 구름섬 원정을 띄운다. 상단 창의 「상단 랭킹」: 달마다 이웃 상단들과 번 돈·명성·던전 공략을 겨뤄 등수 보상을 받는다.'];
STORY.frontier = ['키메라 연구소 깊은 곳에서 북쪽 변경의 지도가 나왔다.', '"안개 묘지, 용암 화산, 세계수 뿌리. 마왕의 남은 봉인 둘은 그 너머에 있다."', '원정대 창의 목적지에서 안개 묘지를 고를 수 있다. 밤에는 유령이 훨씬 많이 나오니 조심하자.'];
STORY.grave = ['죽음의 기사 모르간이 투구를 떨어뜨리며 무너졌다. 안개가 걷히자 북쪽 하늘에 불을 뿜는 산이 보였다.', '모르간의 방패는 아직 따뜻했다. 모험가들이 받는 피해가 조금 줄었다.'];
STORY.volcano = ['화염 군주 이프리트가 화구 속으로 가라앉았다. 식은 용암 사이로 거대한 뿌리가 드러났다.', '화구에서 꺼낸 모루는 어떤 쇠도 쉽게 다룬다. 대장간 제작비가 줄었다.'];
STORY.roots = ['타락한 세계수의 심장이 멎고, 다시 푸른 수액이 흐르기 시작했다. 세계수 꼭대기 너머, 구름 위에 섬이 떠 있다.', '심장에서 떨어진 씨앗은 모험가들의 몸을 튼튼하게 한다. 비행장을 지으면 구름섬으로 갈 수 있다.'];
STORY.sky = ['하늘의 황제가 관을 내려놓았다. 구름섬의 신전이 처음으로 조용해졌다.', '황제의 날개는 모험가들의 발걸음을 가볍게 한다. 구름섬에는 앞으로 더 많은 땅과 던전이 생길 것이다.'];
STORY.airfield = ['비행장이 완성됐다. 활주로 끝에 바람자루가 펄럭인다.', '비행장 창에서 비행 마차를 만들 수 있다. 마구간에서 다 자란 그리폰·와이번·페가수스를 매면 하늘을 난다.', '구름섬은 세계수 뿌리의 던전 「세계수의 심장」을 공략하면 갈 수 있다.'];
STORY.stable = ['마구간을 지었다. 건초 냄새가 상단 위층까지 올라온다.', '마구간 창에서 말을 사고(노쇠부터 명마까지), 파티마다 마차 몸체를 고르고 말을 맨다. 적토마·켈피·페가수스·고산지대 산양·그리폰·와이번은 알을 부화시켜 키운 펫(Lv30 진화)을 맨다.', '손수레 말고는 짐꾼 계열이 파티에 있어야 마차를 끌고, 짐꾼 계열은 파티당 한 명만 넣을 수 있다. 마차는 강철 편자와 철광석으로 강화한다.'];
STORY.library = ['도서관을 지었다. 서가 사이로 먹물 냄새가 난다.', '양피지와 먹물을 사고, 그 책을 떨어뜨리는 몬스터의 부속품을 모으면 스킬북을 만들 수 있다. 도서관을 넓히면 더 높은 레벨의 책을 만든다.'];
STORY.skyOpen = ['비행장이 완성됐다. 세계수 너머 구름 위의 섬으로 가는 길이 열렸다.', '구름섬은 Lv100 필드다. 비행 마차(비행장에서 제작)에 그리폰·와이번·페가수스를 맨 파티만 갈 수 있다. 비행장 창이나 원정대 창의 「하늘」 탭에서 보낸다.'];
