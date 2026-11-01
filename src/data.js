/* ───────── 세계 설정 ───────── */
// 대륙 이름은 이 한 곳만 바꾸면 게임 전체에 반영된다.
const WORLD = { continent: '룬테라', empire: '파로스 제국', capital: '하르겐', street: '7번가 오물거리' };

const DAY_SEC = 180;            // 게임 속 하루 = 실제 3분
const MONTH_DAYS = 30;
const START = { year: 1024, month: 3 };
const OFFLINE_CAP = 2 * 3600;   // 자리를 비운 동안 최대 2시간까지 진행
const STAGE_LEN = 100;          // 스테이지 하나의 길이
const WALK = 8;                 // 초당 이동 거리
const DUNGEON_FLOORS = 5;
const MAX_PARTIES = 4;

/* ───────── 부속품·물품 ───────── */
// v: 기준가(G), w: 무게, icon: 아이콘 모양, c: 아이콘 색
const ITEMS = {
  rat_tail:       { name: '쥐꼬리',           v: 4,    w: 1, icon: 'tail',    c: '#d49a8f' },
  slime_jelly:    { name: '슬라임 젤리',      v: 6,    w: 1, icon: 'blob',    c: '#6fd06a' },
  rabbit_horn:    { name: '뿔토끼 뿔',        v: 10,   w: 1, icon: 'horn',    c: '#e7cf86' },
  wolf_pelt:      { name: '들늑대 가죽',      v: 22,   w: 3, icon: 'hide',    c: '#8f877d' },
  wolf_fang:      { name: '들늑대 송곳니',    v: 14,   w: 1, icon: 'fang',    c: '#eee8da' },
  goblin_ear:     { name: '고블린 귀',        v: 12,   w: 1, icon: 'ear',     c: '#7fae4b' },
  rusty_dagger:   { name: '녹슨 단검',        v: 18,   w: 2, icon: 'blade',   c: '#b7774a' },
  ratking_crown:  { name: '들쥐왕의 왕관',    v: 260,  w: 2, icon: 'crown',   c: '#f0c24a' },
  spore:          { name: '독버섯 포자',      v: 22,   w: 1, icon: 'blob',    c: '#b46ad8' },
  spider_silk:    { name: '거미줄 주머니',    v: 26,   w: 1, icon: 'hide',    c: '#e6e6f0' },
  venom_gland:    { name: '거미 독샘',        v: 34,   w: 1, icon: 'gem',     c: '#9ad83c' },
  treant_sap:     { name: '트렌트 수액',      v: 30,   w: 2, icon: 'potion',  c: '#d8a13c' },
  bark:           { name: '단단한 나무껍질',  v: 20,   w: 3, icon: 'hide',    c: '#7a5634' },
  shaman_feather: { name: '주술 깃털',        v: 40,   w: 1, icon: 'feather', c: '#e05a4a' },
  elder_heart:    { name: '늙은 트렌트의 심장', v: 620, w: 4, icon: 'heart',   c: '#5fbf7a' },
  lizard_scale:   { name: '바위도마뱀 비늘',  v: 40,   w: 1, icon: 'gem',     c: '#7f8fa8' },
  iron_ore:       { name: '철광석',           v: 28,   w: 4, icon: 'ore',     c: '#9a8f86' },
  kobold_pick:    { name: '코볼트 곡괭이 날', v: 46,   w: 2, icon: 'blade',   c: '#c9c3b8' },
  bat_wing:       { name: '동굴박쥐 날개막',  v: 30,   w: 1, icon: 'hide',    c: '#6a5470' },
  golem_core:     { name: '골렘 핵',          v: 110,  w: 5, icon: 'gem',     c: '#e8873a' },
  giant_gem:      { name: '바위거인의 원석',  v: 1400, w: 5, icon: 'gem',     c: '#5ad6e8' },
  pot_s:          { name: '하급 회복 물약',   v: 30,   w: 1, icon: 'potion',  c: '#e04a5a', heal: 35, buy: 30, potion: true },
  pot_m:          { name: '중급 회복 물약',   v: 90,   w: 1, icon: 'potion',  c: '#c03ad8', heal: 95, buy: 95, potion: true }
};
const POTIONS = ['pot_s', 'pot_m'];

/* ───────── 직업 ───────── */
const CLASSES = {
  warrior: { name: '전사',   hp: 64, atk: 7, def: 4, spd: 0.85, crit: 0.05, carry: 12, salary: 120, act: 'melee', tunic: '#9b3b2f', trim: '#c9c3b8', desc: '앞에 서서 적의 공격을 받아낸다.' },
  archer:  { name: '궁수',   hp: 40, atk: 9, def: 1, spd: 1.05, crit: 0.08, carry: 10, salary: 130, act: 'arrow', tunic: '#3f7a3a', trim: '#8a5a32', desc: '체력이 가장 약한 적을 멀리서 쏜다.' },
  mage:    { name: '마법사', hp: 32, atk: 8, def: 1, spd: 0.7,  crit: 0.05, carry: 8,  salary: 160, act: 'magic', tunic: '#5a3d8c', trim: '#5ad6e8', desc: '모든 적에게 마법 피해를 준다.' },
  cleric:  { name: '성직자', hp: 42, atk: 4, def: 2, spd: 0.8,  crit: 0.03, carry: 10, salary: 150, act: 'heal',  tunic: '#d8d4c8', trim: '#d9b44a', desc: '다친 동료를 치료한다.' },
  rogue:   { name: '도적',   hp: 44, atk: 8, def: 2, spd: 1.3,  crit: 0.25, carry: 14, salary: 130, act: 'melee', tunic: '#3a3a46', trim: '#9aa0a8', desc: '빠르고 치명타가 잦다.' },
  porter:  { name: '짐꾼',   hp: 52, atk: 3, def: 2, spd: 0.6,  crit: 0.02, carry: 40, salary: 80,  act: 'melee', tunic: '#9a7a4f', trim: '#5e4630', desc: '싸움은 약하지만 짐을 아주 많이 든다.' }
};
const CLASS_IDS = Object.keys(CLASSES);

/* ───────── 몬스터 ───────── */
// plan: 그리는 방식, drops: [물품, 확률, 개수]
const MONS = {
  rat:     { name: '들쥐',         plan: 'quad', body: '#8a7564', dark: '#5d4d40', len: 9,  h: 4, tail: 1, ear: 1, hp: 14, atk: 4,  def: 0, spd: 1.1, minS: 1, drops: [['rat_tail', 0.7]] },
  slime:   { name: '초록 슬라임',  plan: 'blob', body: '#5fbf5a', dark: '#3f8f3c', w: 10, h: 8, hp: 18, atk: 3,  def: 1, spd: 0.8, minS: 1, drops: [['slime_jelly', 0.8]] },
  rabbit:  { name: '뿔토끼',       plan: 'quad', body: '#e6e0d4', dark: '#b9b0a2', len: 8,  h: 5, horn: '#e7cf86', ears: 1, hp: 16, atk: 5,  def: 0, spd: 1.3, minS: 2, drops: [['rabbit_horn', 0.6]] },
  wolf:    { name: '들늑대',       plan: 'quad', body: '#8f877d', dark: '#5f5a54', len: 14, h: 7, tail: 1, ear: 1, snout: 1, hp: 26, atk: 6,  def: 1, spd: 1.1, minS: 4, drops: [['wolf_pelt', 0.45], ['wolf_fang', 0.5]] },
  goblin:  { name: '고블린',       plan: 'biped', skin: '#7fae4b', cloth: '#6b4a2e', gear: 'dagger', short: 1, hp: 24, atk: 6, def: 2, spd: 1.0, minS: 6, drops: [['goblin_ear', 0.7], ['rusty_dagger', 0.15]] },
  ratking: { name: '들쥐왕',       plan: 'quad', body: '#7a6656', dark: '#4b3d32', len: 9, h: 4, tail: 1, ear: 1, crown: 1, scale: 3, boss: 1, hp: 260, atk: 12, def: 3, spd: 0.9, drops: [['ratking_crown', 1], ['rat_tail', 1, 3]] },

  myconid: { name: '독버섯 괴물',  plan: 'shroom', body: '#b46ad8', dark: '#7a3f98', stem: '#e8dcc8', hp: 34, atk: 8,  def: 2, spd: 0.8, minS: 1, drops: [['spore', 0.7]] },
  spider:  { name: '거대 거미',    plan: 'bug', body: '#3a3440', dark: '#221e26', eye: '#e04a4a', hp: 30, atk: 10, def: 1, spd: 1.3, minS: 2, drops: [['spider_silk', 0.6], ['venom_gland', 0.3]] },
  sapling: { name: '트렌트 묘목',  plan: 'tree', body: '#6b4a2e', leaf: '#4f8f3c', hp: 48, atk: 8,  def: 4, spd: 0.7, minS: 4, drops: [['treant_sap', 0.5], ['bark', 0.55]] },
  shaman:  { name: '고블린 주술사', plan: 'biped', skin: '#6e9e44', cloth: '#7a2f2f', gear: 'staff', feather: 1, short: 1, hp: 32, atk: 12, def: 1, spd: 0.9, minS: 6, drops: [['shaman_feather', 0.5], ['goblin_ear', 0.5]] },
  elder:   { name: '늙은 트렌트',  plan: 'tree', body: '#4b3420', leaf: '#2f6a3a', scale: 2, boss: 1, hp: 480, atk: 16, def: 6, spd: 0.7, drops: [['elder_heart', 1], ['bark', 1, 3]] },

  lizard:  { name: '바위 도마뱀',  plan: 'quad', body: '#6f7a88', dark: '#4a5260', len: 15, h: 4, tail: 1, low: 1, hp: 46, atk: 12, def: 4, spd: 1.0, minS: 1, drops: [['lizard_scale', 0.6]] },
  bat:     { name: '동굴 박쥐',    plan: 'flyer', body: '#4e3e58', dark: '#2e2436', hp: 30, atk: 11, def: 1, spd: 1.6, minS: 2, drops: [['bat_wing', 0.65]] },
  kobold:  { name: '코볼트 광부',  plan: 'biped', skin: '#b0703a', cloth: '#4a4a52', gear: 'pick', short: 1, hp: 40, atk: 13, def: 3, spd: 1.1, minS: 3, drops: [['kobold_pick', 0.45], ['iron_ore', 0.4]] },
  golem:   { name: '스톤 골렘',    plan: 'golem', body: '#77727c', dark: '#4e4a54', core: '#e8873a', hp: 90, atk: 16, def: 8, spd: 0.6, minS: 6, drops: [['golem_core', 0.35], ['iron_ore', 0.5]] },
  giant:   { name: '바위거인',     plan: 'golem', body: '#5f5a66', dark: '#3a3640', core: '#5ad6e8', scale: 2, boss: 1, hp: 900, atk: 22, def: 10, spd: 0.6, drops: [['giant_gem', 1], ['golem_core', 1, 2]] }
};

/* ───────── 필드 ───────── */
const FIELDS = {
  plains: {
    no: 1, name: '평원', lv: 1, bg: 'plains',
    desc: '제국의 곡창지대. 원시림과 맞닿은 넓은 들판이다.',
    mons: ['rat', 'slime', 'rabbit', 'wolf', 'goblin'],
    dungeon: { name: '버려진 곡물 창고', bg: 'cellar', mons: ['rat', 'slime', 'goblin', 'wolf'], boss: 'ratking' },
    next: 'forest'
  },
  forest: {
    no: 2, name: '원시림', lv: 9, bg: 'forest',
    desc: '중앙에 세계수가 솟은 숲. 엘프 왕국의 영역이다.',
    mons: ['myconid', 'spider', 'sapling', 'shaman'],
    dungeon: { name: '썩은 뿌리 동굴', bg: 'cave', mons: ['myconid', 'spider', 'sapling', 'shaman'], boss: 'elder' },
    next: 'mountain'
  },
  mountain: {
    no: 3, name: '검은바위산', lv: 18, bg: 'mountain',
    desc: '광물이 풍부한 산. 지하 깊은 곳에 드워프 왕국이 있다.',
    mons: ['lizard', 'bat', 'kobold', 'golem'],
    dungeon: { name: '버려진 드워프 갱도', bg: 'mine', mons: ['lizard', 'bat', 'kobold', 'golem'], boss: 'giant' },
    next: null
  }
};
const FIELD_IDS = Object.keys(FIELDS);
const LOCKED_FIELDS = [
  { name: '바람계곡',   desc: '비행 몬스터가 많고 와이번이 나온다.' },
  { name: '만년설산',   desc: '예티, 눈사람, 설녀가 사는 얼어붙은 산.' },
  { name: '사라크 사막', desc: '스콜피온과 개미지옥, 그리고 웜이 나오는 사막.' }
];

/* ───────── 건물 ───────── */
const BUILDINGS = {
  shop:     { name: '상점',        max: 5, cost: [0, 600, 1500, 3500, 8000],  desc: '부속품을 진열해 손님에게 판다.', eff: lv => `진열대 ${lv + 2}칸` },
  inn:      { name: '여관',        max: 5, cost: [0, 500, 1400, 3200, 7000],  desc: '모험가들의 숙소. 방이 많을수록 더 고용할 수 있다.', eff: lv => `방 ${2 + lv * 2}개` },
  alchemy:  { name: '연금술 공방', max: 1, cost: [900],                       desc: '부속품으로 회복 물약을 만든다.', eff: () => '물약 제작' },
  training: { name: '훈련소',      max: 1, cost: [1200],                      desc: '돈을 들여 대기 중인 모험가를 훈련시킨다.', eff: () => '경험치 훈련' }
};
const FUTURE_BUILDINGS = [
  { name: '대장간', desc: '부속품으로 장비를 만든다.' },
  { name: '은행',   desc: '돈을 빌려주고 이자를 받는다. 모험가의 예금도 굴린다.' },
  { name: '마탑',   desc: '마법을 연구하고 훈련한다.' }
];

const RECIPES = [
  { out: 'pot_s', need: { slime_jelly: 2 }, fee: 6 },
  { out: 'pot_m', need: { treant_sap: 1, spore: 1 }, fee: 20 }
];

// 상점 진열 가격대: m 가격 배율, iv 판매 간격(초)
const TIERS = [
  { name: '싸게',   m: 1.0, iv: 22 },
  { name: '정가',   m: 1.3, iv: 45 },
  { name: '비싸게', m: 1.6, iv: 90 }
];
const GUILD_RATE = 0.7;   // 모험가 길드 즉시 매입가

/* ───────── 사람들 ───────── */
const NAME_A = ['브', '리', '카', '세', '로', '다', '하', '테', '에', '미', '루', '파', '오', '시', '아', '베', '노', '유', '가', '레'];
const NAME_B = ['람', '네', '엘', '린', '안', '온', '르', '나', '스', '벨', '토', '키', '라', '렌', '디', '샤', '윈', '로', '즈', '크'];
const BIOS = {
  warrior: ['국경 수비대에서 쫓겨났다고만 말한다.', '대장장이 아버지의 망치를 등에 메고 다닌다.', '한 번 맡은 자리는 절대 비우지 않는다.'],
  archer:  ['원시림 경계 마을 출신. 바람 냄새로 날씨를 맞힌다.', '내기 활쏘기에서 진 적이 없다고 우긴다.', '말수가 적고 화살 깃을 직접 다듬는다.'],
  mage:    ['마탑 입학시험에 세 번 떨어졌다.', '불꽃을 보면 눈이 반짝인다.', '책값을 벌려고 모험에 나섰다.'],
  cleric:  ['오물거리 무료 진료소에서 일했다.', '기도문보다 붕대 감는 손이 빠르다.', '신전에서 파문당했다는 소문이 있다.'],
  rogue:   ['7번가 뒷골목에서 자랐다. 암살자 길드를 싫어한다.', '자물쇠 보면 손이 근질거린다.', '빚을 갚을 때까지만 일하겠다고 한다.'],
  porter:  ['항구에서 짐을 지던 장사. 웃음소리가 크다.', '어떤 짐이든 무게를 한 번에 맞힌다.', '모험가가 꿈이었지만 일단 짐부터 든다.']
};
const CLIENTS = ['빵집 할머니 도라', '견습 연금술사 미라', '모험가 길드 접수원 한스', '항구 창고지기 볼', '수상한 망토 사내', '황실 조달청 서기관', '엘프 약초상 실린', '드워프 상인 그롬'];

// 용사: 던전을 처음 공략하면 여관에 나타난다
const HEROES = {
  plains:   { name: '카일',   cls: 'warrior', lv: 5,  fame: 25,  bio: '예언서에 적힌 "검의 용사". 아직 자기가 누구인지 모른다.' },
  forest:   { name: '엘라',   cls: 'archer',  lv: 12, fame: 70,  bio: '세계수를 지키던 엘프 궁수. "활의 용사"의 문장이 손등에 떠올랐다.' },
  mountain: { name: '오르반', cls: 'mage',    lv: 20, fame: 140, bio: '마탑에서 추방된 천재. "지혜의 용사"를 자처한다.' }
};

/* ───────── 이야기 ───────── */
const STORY = {
  intro: [
    `제국력 ${START.year}년 봄, ${WORLD.continent} 대륙 ${WORLD.empire}의 제도 ${WORLD.capital}.`,
    '항구 창고와 광장 사이 열두 구역 가운데, 범죄자들이 우글거리는 무법지대 7번가. 사람들은 이곳을 오물거리, 혹은 시궁창이라 부른다.',
    '당신은 그 입구에 작은 상단을 열었다. 모험가를 고용해 몬스터의 부속품을 구해 오고, 그것을 팔아 상단을 키울 생각이다.'
  ],
  assassin: [
    '개업 첫날 밤, 검은 두건을 쓴 사내가 문을 두드렸다.',
    '"이 거리에서 장사하려면 자릿세를 내야지. 보호비라고 해 두자고. 매달 말일에 받으러 오겠다."',
    '암살자 길드다. 지금은 따를 수밖에 없다. 하지만 상단이 커지면 이야기가 달라질 것이다.'
  ],
  firstReturn: ['첫 원정대가 돌아왔다. 가져온 부속품은 창고에 쌓였다.', '창고 탭에서 모험가 길드에 바로 팔거나, 상점 진열대에 올려 손님에게 더 비싸게 팔 수 있다.'],
  plains:   ['들쥐왕이 쓰러지자 곡물 창고 깊은 곳에서 검은 안개가 새어 나왔다.', '"마왕의 봉인이 약해지고 있다"는 소문이 오물거리에까지 돌기 시작했다.', '그날 밤, 여관에 낡은 검을 든 청년이 찾아왔다. 원시림으로 가는 길도 열렸다.'],
  forest:   ['늙은 트렌트의 심장이 멈추자 세계수의 잎 하나가 검게 시들었다.', '엘프 왕국은 국경을 닫았지만, 한 엘프 궁수가 몰래 숲을 나와 당신의 상단을 찾았다.', '검은바위산으로 가는 길이 열렸다.'],
  mountain: ['갱도 끝, 바위거인이 지키던 문 너머에서 드워프들의 경고문이 발견됐다.', '"봉인은 일곱. 둘은 이미 깨졌다."', '마탑에서 쫓겨난 마법사 하나가 여관 문을 두드렸다. 이야기는 다음 업데이트에서 이어진다.']
};
