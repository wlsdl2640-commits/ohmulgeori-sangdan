/* ───────── 세계 설정 ───────── */
// 대륙 이름은 이 한 곳만 바꾸면 게임 전체에 반영된다.
const WORLD = { continent: '룬테라', empire: '파로스 제국', capital: '하르겐', street: '7번가 오물거리' };
const VERSION = '0.7.0';

const DAY_SEC = 180;            // 게임 속 하루 = 게임을 켜 둔 실제 3분
const MONTH_DAYS = 30;
const START = { year: 1024, month: 3 };
const OFFLINE_CAP = 2 * 3600;   // 자리를 비운 동안 최대 2시간까지 보상 (마탑 연구로 늘어남)
const STAGE_LEN = 100;
const FIELD_STAGES = 50;        // 필드마다 1-1 ~ 1-50
const BOSS_EVERY = 10;          // 1-10, 1-20 … 1-50마다 필드 보스. 1-50 보스를 쓰러뜨리면 던전 입구가 열린다
const DUNGEON_FLOORS = 5;
const MAX_PARTIES = 4;
// 하루는 네 때로 나뉜다. 밤이 될수록 몬스터가 많아진다.
// 하루(DAY_SEC)는 새벽 4시에 시작한다: 새벽 04~10시 · 점심 10~16시 · 저녁 16~22시 · 밤 22~04시
const PHASES = [
  { id: 'dawn',  name: '새벽', more: 0 },
  { id: 'day',   name: '점심', more: 0 },
  { id: 'dusk',  name: '저녁', more: 0.4 },
  { id: 'night', name: '밤',   more: 1.0 }
];
const HOUR0 = 4;
const SPEEDS = [1, 5, 10, 20];
const phaseOf = t => Math.floor(((t % DAY_SEC) + DAY_SEC) % DAY_SEC / (DAY_SEC / 4));
const phaseFrac = t => (((t % DAY_SEC) + DAY_SEC) % DAY_SEC) / (DAY_SEC / 4) % 1;
// 게임 속 시계 (자정을 넘겨도 날짜는 새벽 4시에 바뀐다)
function clockOf(t) { const f = (((t % DAY_SEC) + DAY_SEC) % DAY_SEC) / DAY_SEC, mins = Math.floor(HOUR0 * 60 + f * 1440) % 1440; return { h: Math.floor(mins / 60), m: mins % 60 }; }
const clockStr = t => { const c = clockOf(t); return String(c.h).padStart(2, '0') + ':' + String(Math.floor(c.m / 10) * 10).padStart(2, '0'); };
// 필드 몬스터 레벨: 네 스테이지마다 1씩 오른다 (1-50에서 +12). F.span이 있으면 1-50에서 +span (구름섬 너머의 섬: 10)
const fieldLv = (F, stage) => F.lv + (F.span ? Math.floor((stage - 1) * F.span / (FIELD_STAGES - 1)) : Math.floor((stage - 1) / 4));
const minStage = m => 1 + ((m.minS || 1) - 1) * 3;
// 던전 몬스터는 필드 끝(1-50)보다 강하다
const dungeonLv = (F, floor) => (F.span ? F.lv + F.span - 5 + floor : F.lv + 10 + floor);
const dungeonBossLv = F => (F.span ? F.lv + F.span + 2 : F.lv + 17);

/* ───────── 부속품·물품 ───────── */
// v: 기준가(G), w: 무게, icon: 아이콘 모양, c: 아이콘 색
const ITEMS = {
  rat_tail:       { name: '쥐꼬리',             v: 4,    w: 1, icon: 'tail',    c: '#d49a8f' },
  slime_jelly:    { name: '슬라임 젤리',        v: 6,    w: 1, icon: 'blob',    c: '#6fd06a' },
  rabbit_horn:    { name: '뿔토끼 뿔',          v: 10,   w: 1, icon: 'horn',    c: '#e7cf86' },
  wolf_pelt:      { name: '들늑대 가죽',        v: 22,   w: 3, icon: 'hide',    c: '#8f877d' },
  wolf_fang:      { name: '들늑대 송곳니',      v: 14,   w: 1, icon: 'fang',    c: '#eee8da' },
  goblin_ear:     { name: '고블린 귀',          v: 12,   w: 1, icon: 'ear',     c: '#7fae4b' },
  rusty_dagger:   { name: '녹슨 단검',          v: 18,   w: 2, icon: 'blade',   c: '#b7774a' },
  ratking_crown:  { name: '들쥐왕의 왕관',      v: 320,  w: 2, icon: 'crown',   c: '#f0c24a' },
  spore:          { name: '독버섯 포자',        v: 22,   w: 1, icon: 'blob',    c: '#b46ad8' },
  spider_silk:    { name: '거미줄 주머니',      v: 26,   w: 1, icon: 'hide',    c: '#e6e6f0' },
  venom_gland:    { name: '거미 독샘',          v: 34,   w: 1, icon: 'gem',     c: '#9ad83c' },
  treant_sap:     { name: '트렌트 수액',        v: 30,   w: 2, icon: 'potion',  c: '#d8a13c' },
  bark:           { name: '단단한 나무껍질',    v: 20,   w: 3, icon: 'hide',    c: '#7a5634' },
  shaman_feather: { name: '주술 깃털',          v: 40,   w: 1, icon: 'feather', c: '#e05a4a' },
  elder_heart:    { name: '늙은 트렌트의 심장', v: 760,  w: 4, icon: 'heart',   c: '#5fbf7a' },
  lizard_scale:   { name: '바위도마뱀 비늘',    v: 40,   w: 1, icon: 'gem',     c: '#7f8fa8' },
  iron_ore:       { name: '철광석',             v: 28,   w: 4, icon: 'ore',     c: '#9a8f86' },
  kobold_pick:    { name: '코볼트 곡괭이 날',   v: 46,   w: 2, icon: 'blade',   c: '#c9c3b8' },
  bat_wing:       { name: '동굴박쥐 날개막',    v: 30,   w: 1, icon: 'hide',    c: '#6a5470' },
  golem_core:     { name: '골렘 핵',            v: 110,  w: 5, icon: 'gem',     c: '#e8873a' },
  giant_gem:      { name: '바위거인의 원석',    v: 1600, w: 5, icon: 'gem',     c: '#5ad6e8' },
  harpy_feather:  { name: '하피 깃털',          v: 55,   w: 1, icon: 'feather', c: '#9ad0f0' },
  gale_fang:      { name: '질풍 송곳니',        v: 50,   w: 1, icon: 'fang',    c: '#cfe8f0' },
  griffon_claw:   { name: '그리폰 발톱',        v: 80,   w: 2, icon: 'horn',    c: '#e0c070' },
  wyvern_scale:   { name: '와이번 비늘',        v: 95,   w: 2, icon: 'gem',     c: '#5aa07a' },
  storm_heart:    { name: '폭풍의 심장',        v: 2600, w: 4, icon: 'heart',   c: '#7ab8ff' },
  snow_essence:   { name: '눈의 정수',          v: 60,   w: 1, icon: 'blob',    c: '#f0f6ff' },
  yeti_fur:       { name: '예티 털가죽',        v: 85,   w: 3, icon: 'hide',    c: '#e8ecf0' },
  frost_crystal:  { name: '서리 수정',          v: 90,   w: 2, icon: 'gem',     c: '#8ad8ff' },
  maiden_veil:    { name: '설녀의 면사포',      v: 120,  w: 1, icon: 'hide',    c: '#c8d8ff' },
  ice_crown:      { name: '얼음 왕관',          v: 3800, w: 3, icon: 'crown',   c: '#bfe8ff' },
  scorpion_stinger: { name: '전갈 독침',        v: 95,   w: 1, icon: 'fang',    c: '#d07a3a' },
  antlion_jaw:    { name: '개미지옥 턱',        v: 110,  w: 2, icon: 'horn',    c: '#a8885a' },
  sand_silk:      { name: '사막 비단',          v: 100,  w: 1, icon: 'hide',    c: '#e8c87a' },
  sandworm_hide:  { name: '샌드웜 가죽',        v: 140,  w: 4, icon: 'hide',    c: '#c09a6a' },
  worm_pearl:     { name: '모래 진주',          v: 5600, w: 3, icon: 'gem',     c: '#f0e0b0' },
  assassin_mark:  { name: '암살자 문장',        v: 70,   w: 1, icon: 'ear',     c: '#5a5a6a' },
  poison_vial:    { name: '독약병',             v: 60,   w: 1, icon: 'potion',  c: '#7ad83c' },
  guild_ledger:   { name: '암살자 길드 장부',   v: 3000, w: 2, icon: 'book',    c: '#3a2a2a' },
  pot_s: { name: '하급 회복 물약', v: 30,  w: 1, icon: 'potion', c: '#e04a5a', heal: 45,  buy: 30,  potion: 'hp' },
  pot_m: { name: '중급 회복 물약', v: 90,  w: 1, icon: 'potion', c: '#c03ad8', heal: 130, buy: 95,  potion: 'hp' },
  pot_l: { name: '상급 회복 물약', v: 240, w: 1, icon: 'potion', c: '#f0b43c', heal: 320, buy: 260, potion: 'hp' },
  mp_s:  { name: '마나 물약',      v: 50,  w: 1, icon: 'potion', c: '#4a7af0', mana: 40,  buy: 55,  potion: 'mp' },
  mp_m:  { name: '고급 마나 물약', v: 150, w: 1, icon: 'potion', c: '#3ad8e0', mana: 110, buy: 160, potion: 'mp' }
};
const POTIONS = ['pot_s', 'pot_m', 'pot_l', 'mp_s', 'mp_m'];

/* ───────── 몬스터 ───────── */
// mh·ma·md: 레벨 곡선에 곱하는 체력·공격·방어 배율, spd: 초당 공격, eva: 회피율, magic: 방어 절반 무시, aoe: 광역 공격
const MONS = {
  rat:     { name: '들쥐',         plan: 'quad', body: '#8a7564', dark: '#5d4d40', len: 9,  h: 4, tail: 1, ear: 1, mh: 0.45, ma: 0.55, md: 0,   spd: 1.1, minS: 1, drops: [['rat_tail', 0.7]] },
  slime:   { name: '초록 슬라임',  plan: 'blob', body: '#5fbf5a', dark: '#3f8f3c', w: 10, h: 8, mh: 0.6, ma: 0.45, md: 0.5, spd: 0.8, minS: 1, drops: [['slime_jelly', 0.8]] },
  rabbit:  { name: '뿔토끼',       plan: 'quad', body: '#e6e0d4', dark: '#b9b0a2', len: 8,  h: 5, horn: '#e7cf86', ears: 1, mh: 0.55, ma: 0.7, md: 0, spd: 1.3, eva: 0.08, minS: 2, drops: [['rabbit_horn', 0.6]] },
  wolf:    { name: '들늑대',       plan: 'quad', body: '#8f877d', dark: '#5f5a54', len: 14, h: 7, tail: 1, ear: 1, snout: 1, mh: 0.95, ma: 0.95, md: 0.4, spd: 1.1, minS: 4, drops: [['wolf_pelt', 0.45], ['wolf_fang', 0.5]] },
  goblin:  { name: '고블린',       plan: 'biped', skin: '#7fae4b', cloth: '#6b4a2e', gear: 'dagger', mh: 0.9, ma: 0.9, md: 0.8, spd: 1.0, minS: 6, drops: [['goblin_ear', 0.7], ['rusty_dagger', 0.15]] },
  ratking: { name: '들쥐왕',       plan: 'quad', body: '#7a6656', dark: '#4b3d32', len: 9, h: 4, tail: 1, ear: 1, crown: 1, scale: 3, boss: 1, mh: 4, ma: 1.5, md: 1, spd: 0.9, aoe: 1, drops: [['ratking_crown', 1], ['rat_tail', 1, 3]] },

  myconid: { name: '독버섯 괴물',  plan: 'shroom', body: '#b46ad8', dark: '#7a3f98', stem: '#e8dcc8', mh: 1.0, ma: 0.8, md: 0.6, spd: 0.8, minS: 1, drops: [['spore', 0.7]] },
  spider:  { name: '거대 거미',    plan: 'bug', body: '#3a3440', dark: '#221e26', eye: '#e04a4a', mh: 0.85, ma: 1.0, md: 0.3, spd: 1.3, eva: 0.08, minS: 2, drops: [['spider_silk', 0.6], ['venom_gland', 0.3]] },
  sapling: { name: '트렌트 묘목',  plan: 'tree', body: '#6b4a2e', leaf: '#4f8f3c', mh: 1.4, ma: 0.8, md: 1.2, spd: 0.7, minS: 4, drops: [['treant_sap', 0.5], ['bark', 0.55]] },
  shaman:  { name: '고블린 주술사', plan: 'biped', skin: '#6e9e44', cloth: '#7a2f2f', gear: 'staff', feather: 1, mh: 0.85, ma: 1.15, md: 0.3, spd: 0.9, magic: 1, minS: 6, drops: [['shaman_feather', 0.5], ['goblin_ear', 0.5]] },
  elder:   { name: '늙은 트렌트',  plan: 'tree', body: '#4b3420', leaf: '#2f6a3a', scale: 2, boss: 1, mh: 4.5, ma: 1.5, md: 1.4, spd: 0.7, aoe: 1, drops: [['elder_heart', 1], ['bark', 1, 3]] },

  lizard:  { name: '바위 도마뱀',  plan: 'quad', body: '#6f7a88', dark: '#4a5260', len: 15, h: 4, tail: 1, low: 1, mh: 1.1, ma: 0.95, md: 1.2, spd: 1.0, minS: 1, drops: [['lizard_scale', 0.6]] },
  bat:     { name: '동굴 박쥐',    plan: 'flyer', body: '#4e3e58', dark: '#2e2436', mh: 0.75, ma: 0.9, md: 0.3, spd: 1.6, eva: 0.2, minS: 2, drops: [['bat_wing', 0.65]] },
  kobold:  { name: '코볼트 광부',  plan: 'biped', skin: '#b0703a', cloth: '#4a4a52', gear: 'pick', mh: 1.0, ma: 1.05, md: 0.9, spd: 1.1, minS: 3, drops: [['kobold_pick', 0.45], ['iron_ore', 0.4]] },
  golem:   { name: '스톤 골렘',    plan: 'golem', body: '#77727c', dark: '#4e4a54', core: '#e8873a', mh: 1.8, ma: 1.1, md: 2.0, spd: 0.6, minS: 6, drops: [['golem_core', 0.35], ['iron_ore', 0.5]] },
  giant:   { name: '바위거인',     plan: 'golem', body: '#5f5a66', dark: '#3a3640', core: '#5ad6e8', scale: 2, boss: 1, mh: 5, ma: 1.6, md: 2, spd: 0.6, aoe: 1, drops: [['giant_gem', 1], ['golem_core', 1, 2]] },

  harpy:   { name: '하피',         plan: 'flyer', body: '#c8a888', dark: '#7a9ab8', face: '#f1c9a5', mh: 0.9, ma: 1.0, md: 0.4, spd: 1.4, eva: 0.22, minS: 1, drops: [['harpy_feather', 0.6]] },
  windwolf:{ name: '바람 늑대',    plan: 'quad', body: '#b8c8d8', dark: '#7a8aa0', len: 15, h: 7, tail: 1, ear: 1, snout: 1, mh: 1.1, ma: 1.05, md: 0.6, spd: 1.3, eva: 0.1, minS: 2, drops: [['gale_fang', 0.55]] },
  griffon: { name: '그리폰',       plan: 'flyer', body: '#c8a050', dark: '#8a6a3a', beak: '#f0c24a', big: 1, mh: 1.6, ma: 1.2, md: 1.0, spd: 1.0, eva: 0.12, minS: 4, drops: [['griffon_claw', 0.4]] },
  wyvern:  { name: '와이번',       plan: 'flyer', body: '#4f8a5a', dark: '#2f5a3a', beak: '#e8e2d0', big: 1, mh: 1.9, ma: 1.3, md: 1.3, spd: 0.9, minS: 6, drops: [['wyvern_scale', 0.45]] },
  stormwyvern: { name: '폭풍 와이번', plan: 'flyer', body: '#3a5a8a', dark: '#24365a', beak: '#9ad0f0', big: 1, scale: 2, boss: 1, mh: 5.5, ma: 1.7, md: 1.6, spd: 0.8, eva: 0.1, aoe: 1, drops: [['storm_heart', 1], ['wyvern_scale', 1, 2]] },

  snowman: { name: '눈사람',       plan: 'blob', body: '#eef2f8', dark: '#b8c4d4', w: 10, h: 12, nose: 1, mh: 1.2, ma: 0.9, md: 0.8, spd: 0.8, minS: 1, drops: [['snow_essence', 0.65]] },
  icesprite: { name: '얼음 정령',  plan: 'golem', body: '#8ad8ff', dark: '#4a8ac8', core: '#ffffff', small: 1, mh: 1.0, ma: 1.15, md: 1.5, spd: 1.0, magic: 1, minS: 2, drops: [['frost_crystal', 0.45]] },
  yeti:    { name: '예티',         plan: 'golem', body: '#e8ecf0', dark: '#a8b4c4', core: '#5a7aa0', mh: 2.0, ma: 1.25, md: 1.2, spd: 0.8, minS: 4, drops: [['yeti_fur', 0.45]] },
  snowmaiden: { name: '설녀',      plan: 'ghost', body: '#e0ecff', dark: '#8aa8d8', hair: '#f0f6ff', mh: 1.1, ma: 1.3, md: 0.5, spd: 1.0, eva: 0.15, magic: 1, minS: 6, drops: [['maiden_veil', 0.4], ['snow_essence', 0.4]] },
  icequeen:{ name: '설녀 여왕',    plan: 'ghost', body: '#c8dcff', dark: '#5a7ab8', hair: '#ffffff', crown: 1, scale: 2, boss: 1, mh: 5.5, ma: 1.8, md: 1.5, spd: 0.8, magic: 1, aoe: 1, drops: [['ice_crown', 1], ['frost_crystal', 1, 2]] },

  scorpion:{ name: '스콜피온',     plan: 'bug', body: '#b8682e', dark: '#7a3e1a', eye: '#1a1410', tail: 1, mh: 1.2, ma: 1.2, md: 1.4, spd: 1.1, minS: 1, drops: [['scorpion_stinger', 0.5]] },
  antlion: { name: '개미지옥',     plan: 'bug', body: '#8a7050', dark: '#5a4a32', eye: '#e8c84a', jaws: 1, mh: 1.5, ma: 1.1, md: 1.6, spd: 0.8, minS: 2, drops: [['antlion_jaw', 0.45]] },
  bandit:  { name: '사막 도적',    plan: 'biped', skin: '#c68a5e', cloth: '#d8b878', gear: 'dagger', wrap: 1, mh: 1.0, ma: 1.3, md: 0.8, spd: 1.2, eva: 0.12, minS: 3, drops: [['sand_silk', 0.5]] },
  sandworm:{ name: '샌드웜',       plan: 'worm', body: '#c09a6a', dark: '#8a6a42', mh: 2.2, ma: 1.35, md: 1.0, spd: 0.7, minS: 5, drops: [['sandworm_hide', 0.4]] },
  greatworm: { name: '거대 샌드웜', plan: 'worm', body: '#a8844e', dark: '#6a5230', scale: 3, boss: 1, mh: 6, ma: 1.9, md: 1.8, spd: 0.7, aoe: 1, drops: [['worm_pearl', 1], ['sandworm_hide', 1, 2]] },

  assassin:{ name: '암살자',       plan: 'biped', skin: '#c68a5e', cloth: '#22222c', gear: 'dagger', hood: 1, mh: 1.0, ma: 1.2, md: 0.6, spd: 1.25, eva: 0.15, drops: [['assassin_mark', 0.5]] },
  poisoner:{ name: '독살자',       plan: 'biped', skin: '#e0ac7e', cloth: '#3a4a2a', gear: 'flask', hood: 1, mh: 0.9, ma: 1.2, md: 0.5, spd: 1.0, magic: 1, drops: [['poison_vial', 0.55]] },
  enforcer:{ name: '길드 행동대원', plan: 'biped', skin: '#9a6644', cloth: '#3a2a2a', gear: 'club', mh: 1.6, ma: 1.2, md: 1.2, spd: 0.9, drops: [['assassin_mark', 0.4]] },
  blackhood: { name: '길드장 검은 두건', plan: 'biped', skin: '#c68a5e', cloth: '#14141a', gear: 'dagger', hood: 1, scale: 2, boss: 1, mh: 6, ma: 1.8, md: 1.5, spd: 1.1, eva: 0.15, aoe: 1, drops: [['guild_ledger', 1], ['assassin_mark', 1, 3]] }
};

/* ───────── 필드 ───────── */
const FIELDS = {
  plains: {
    no: 1, name: '평원', lv: 1, bg: 'plains', tier: 0,
    desc: '제국의 곡창지대. 원시림과 맞닿은 넓은 들판이다.',
    mons: ['rat', 'slime', 'rabbit', 'wolf', 'goblin'],
    dungeon: { name: '버려진 곡물 창고', bg: 'cellar', mons: ['rat', 'slime', 'goblin', 'wolf'], boss: 'ratking' },
    next: 'forest'
  },
  forest: {
    no: 2, name: '원시림', lv: 9, bg: 'forest', tier: 1,
    desc: '중앙에 세계수가 솟은 숲. 엘프 왕국의 영역이다.',
    mons: ['myconid', 'spider', 'sapling', 'shaman'],
    dungeon: { name: '썩은 뿌리 동굴', bg: 'cave', mons: ['myconid', 'spider', 'sapling', 'shaman'], boss: 'elder' },
    next: 'mountain'
  },
  mountain: {
    no: 3, name: '검은바위산', lv: 18, bg: 'mountain', tier: 2,
    desc: '광물이 풍부한 산. 지하 깊은 곳에 드워프 왕국이 있다.',
    mons: ['lizard', 'bat', 'kobold', 'golem'],
    dungeon: { name: '버려진 드워프 갱도', bg: 'mine', mons: ['lizard', 'bat', 'kobold', 'golem'], boss: 'giant' },
    next: 'valley'
  },
  valley: {
    no: 4, name: '바람계곡', lv: 27, bg: 'valley', tier: 3,
    desc: '거센 바람이 쉬지 않는 협곡. 하늘을 나는 몬스터가 많고 와이번이 둥지를 튼다.',
    mons: ['harpy', 'windwolf', 'griffon', 'wyvern'],
    dungeon: { name: '와이번 둥지', bg: 'nest', mons: ['harpy', 'windwolf', 'griffon', 'wyvern'], boss: 'stormwyvern' },
    next: 'snow'
  },
  snow: {
    no: 5, name: '만년설산', lv: 36, bg: 'snow', tier: 4,
    desc: '녹지 않는 눈에 덮인 산. 예티와 눈사람, 그리고 설녀가 산다.',
    mons: ['snowman', 'icesprite', 'yeti', 'snowmaiden'],
    dungeon: { name: '얼어붙은 신전', bg: 'icetemple', mons: ['snowman', 'icesprite', 'yeti', 'snowmaiden'], boss: 'icequeen' },
    next: 'desert'
  },
  desert: {
    no: 6, name: '사라크 사막', lv: 45, bg: 'desert', tier: 5,
    desc: '끝없는 모래 언덕. 스콜피온과 개미지옥, 모래 밑의 웜을 조심해야 한다.',
    mons: ['scorpion', 'antlion', 'bandit', 'sandworm'],
    dungeon: { name: '모래에 묻힌 왕릉', bg: 'tomb', mons: ['scorpion', 'antlion', 'bandit', 'sandworm'], boss: 'greatworm' },
    next: null
  },
  alley: {
    no: 7, name: '7번가 뒷골목', lv: 14, bg: 'alley', tier: 3, raid: 1,
    desc: '암살자 길드의 은신처로 이어지는 골목. 다섯 겹의 함정과 길드원이 지키고 있다.',
    mons: [],
    dungeon: { name: '암살자 길드 은신처', bg: 'alley', mons: ['assassin', 'poisoner', 'enforcer'], boss: 'blackhood' },
    next: null
  }
};
const FIELD_IDS = ['plains', 'forest', 'mountain', 'valley', 'snow', 'desert'];
const ALL_FIELDS = FIELD_IDS.concat(['alley']);
const TIER_FIELDS = FIELD_IDS.slice();   // 장비 단계·보스 부속품·유물을 가진 필드 (마계가 뒤에 붙는다)

/* ───────── 사람들 ───────── */
const NAME_A = ['브', '리', '카', '세', '로', '다', '하', '테', '에', '미', '루', '파', '오', '시', '아', '베', '노', '유', '가', '레'];
const NAME_B = ['람', '네', '엘', '린', '안', '온', '르', '나', '스', '벨', '토', '키', '라', '렌', '디', '샤', '윈', '로', '즈', '크'];
const BIOS = {
  warrior: ['국경 수비대에서 쫓겨났다고만 말한다.', '대장장이 아버지의 망치를 등에 메고 다닌다.', '한 번 맡은 자리는 절대 비우지 않는다.'],
  archer:  ['원시림 경계 마을 출신. 바람 냄새로 날씨를 맞힌다.', '내기 활쏘기에서 진 적이 없다고 우긴다.', '말수가 적고 화살 깃을 직접 다듬는다.'],
  mage:    ['마탑 입학시험에 세 번 떨어졌다.', '불꽃을 보면 눈이 반짝인다.', '책값을 벌려고 모험에 나섰다.'],
  cleric:  ['오물거리 무료 진료소에서 일했다.', '기도문보다 붕대 감는 손이 빠르다.', '신전에서 파문당했다는 소문이 있다.'],
  rogue:   ['7번가 뒷골목에서 자랐다. 암살자 길드를 싫어한다.', '자물쇠 보면 손이 근질거린다.', '빚을 갚을 때까지만 일하겠다고 한다.'],
  porter:  ['항구에서 짐을 지던 장사. 웃음소리가 크다.', '어떤 짐이든 무게를 한 번에 맞힌다.', '모험가가 꿈이었지만 일단 짐부터 든다.'],
  gladiator:    ['투기장 모래 위에서 백 번을 이겼다고 한다.', '관중의 함성이 없으면 힘이 안 난다며 웃는다.'],
  elementalist: ['바람 정령이 늘 어깨 위에서 속삭인다.', '불의 정령과 사이가 나빠 자주 머리끝이 그을린다.'],
  berserker:    ['싸움이 끝나면 언제 그랬냐는 듯 순해진다.', '도끼에 이름을 붙여 부른다.'],
  dragoon:      ['창 하나로 와이번을 떨어뜨렸다는 소문이 있다.', '높은 곳만 보면 뛰어오르고 싶어 한다.'],
  paladin:      ['맹세를 어긴 적이 한 번도 없다.', '갑옷을 매일 밤 손수 닦는다.'],
  plaguedoc:    ['까마귀 가면 아래 얼굴을 본 사람이 없다.', '역병이 돈 마을에서 끝까지 남은 의사였다.'],
  necromancer:  ['해골과 이야기를 나누는 버릇이 있다.', '죽음을 연구하는 건 삶을 지키기 위해서라고 말한다.'],
  champion:     ['투기장의 모래는 이제 그의 이름을 기억한다.'], knight: ['기사 서임식 날 받은 방패를 아직도 쓴다.'],
  bloodlord:    ['피 냄새를 맡으면 눈빛이 바뀐다.'], ranger: ['늑대 한 마리가 늘 그림자처럼 따라다닌다.'],
  sniper:       ['바람 소리만 듣고 거리를 잰다.'], hawkeye: ['천 걸음 밖 사과도 맞힌다는 소문이 있다.'],
  mhunter:      ['벽에 걸린 뿔 하나하나에 이야기가 있다.', '사냥감을 보면 먼저 가죽 값부터 센다.'], dslayer: ['용의 비늘로 만든 외투를 입는다.'],
  huntsman:     ['발자국만 보고 무슨 짐승이 언제 지나갔는지 안다.', '사냥개 세 마리와 함께 산다.'], kaijuhunter: ['산만 한 괴수의 뼈로 활을 깎았다.'],
  elemancer:    ['여섯 원소의 주문을 동시에 외우다 혀를 깨문 적이 있다.', '약점을 찾는 눈이 날카롭다.'], alchemist: ['납을 금으로 바꿨다는 소문이 있지만 본인은 웃기만 한다.'],
  bard:         ['노래 한 곡이면 지친 동료도 다시 일어난다.', '짐을 지고도 노래가 끊기지 않는다.'], maestro: ['그의 연주가 끝나면 전장이 조용해진다.'],
  coachman:     ['말이 먼저 알아보고 고개를 숙인다.', '고삐를 쥐면 수레도 춤춘다.'], caravanmaster: ['그가 이끄는 행렬은 산도 넘고 사막도 건넌다.'],
  scout:        ['지도보다 발자국을 더 믿는다.', '어디서든 바람을 등지고 텐트를 친다.'], pathfinder: ['아무도 가지 않은 길에만 발자국을 남긴다.'],
  assassin:     ['뒷골목 출신이지만 암살자 길드와는 원수다.'], shadowlord: ['그림자 속에서 걸어 나오는 걸 본 사람이 있다.'],
  duelist:      ['두 자루 칼에 두 사람 몫의 이름을 새겼다.'], bladedancer: ['싸움이 춤처럼 보인다는 말을 좋아한다.'],
  treasure:     ['던전 지도를 모으는 게 취미다.'], masterthief: ['황궁 보물고에 들어갔다 나왔다는 전설이 있다.'],
  elementlord:  ['네 정령이 그를 왕이라 부른다.'], lich: ['심장이 멈춘 지 오래라는 농담을 한다.'],
  spellblade:   ['검에 마법을 두르는 법을 혼자 깨쳤다.'], arcblade: ['별빛을 검에 담는다.'],
  sorcerer:     ['마탑 꼭대기에서 내려왔다. 지팡이 끝이 늘 빛난다.', '마법은 넓게 뿌리는 게 아니라 한 점에 꽂는 거라고 말한다.'], archmage: ['그가 손가락을 튕기면 촛불이 모두 꺼진다.'],
  priest:       ['기도 한 번에 상처가 아문다.'], archbishop: ['대신전에서도 그를 함부로 대하지 못한다.'],
  physician:    ['역병을 이긴 의사. 손이 빠르고 말은 느리다.'], exorcist: ['악령을 쫓는 성수병을 허리에 찬다.'],
  inquisitor:   ['어둠과는 타협하지 않는다.']
};
const CLIENTS = ['빵집 할머니 도라', '견습 연금술사 미라', '모험가 길드 접수원 한스', '항구 창고지기 볼', '수상한 망토 사내', '황실 조달청 서기관', '엘프 약초상 실린', '드워프 상인 그롬', '기사단 병참관 로웰', '떠돌이 음유시인 펠'];
const SPECIAL_CLIENTS = ['황실 조달청 특별 주문', '모험가 길드장 하스킨', '드워프 왕국 사절', '엘프 여왕의 시종'];

// 던전 공략 보상 (단계별)
const DUNGEON_GOLD = [3000, 8000, 16000, 30000, 50000, 80000];
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
  firstInj: ['다친 동료를 들것에 싣고 원정대가 돌아왔다. 모험가는 죽지 않지만, 다 나을 때까지는 원정에 나갈 수 없다.', '부상은 시간이 지나면 낫는다. 시설 창의 신전에서는 훨씬 빨리 낫고, 히포크리초·약재·물약으로 하루 한 번 처치하거나 성직자를 치유사로 두면 더 빨라진다.', '파티의 「위험하면 복귀」를 켜 두면 누가 쓰러졌을 때 싸움에서 빠져나와 돌아온다.'],
  firstReturn: ['첫 원정대가 돌아왔다. 가져온 부속품은 창고에 쌓였다.', '창고 창에서 모험가 길드에 바로 팔거나, 상점 진열대에 올려 손님에게 더 비싸게 팔 수 있다.'],
  v03: ['상단에 새 소식이 있다.', '하루가 새벽·점심·저녁·밤으로 나뉘었다. 어두워질수록 몬스터가 많이 몰려온다.', '모험가가 지치면 원정 중에 모닥불을 피우고 잠을 잔다. 피로가 쌓이면 힘을 제대로 못 쓴다.', '필드는 50 스테이지까지 이어진다. 원정 창에서는 파티마다 마차를 마련해 짐을 더 많이 실을 수 있다.'],
  v05: ['상단에 새 소식이 있다.', '이제 모험가는 죽지 않는다. HP가 다하면 쓰러지고, 동료가 들것에 실어 데려온다. 쓰러진 모험가는 신전에서 시간과 약초·약재·물약, 수술로 치료해야 다시 원정에 나갈 수 있다. 성직자와 역병의사를 신전에 배치하면 치료가 빨라진다.', '필드마다 10 스테이지마다 필드 보스가 있고, 1-50의 보스를 쓰러뜨려야 던전이 열린다. 던전을 공략하면 큰 보상을 받고 상단 랭크업 조건을 채운다.', '상단 랭크를 올리면 새 필드와 시설, 더 많은 파티와 매대, 거래 혜택이 열린다. 모험가는 개인 명성을 쌓아 동장·은장·금장·백은·용사로 승급하고, 상단 명성으로 해금된 특수직업으로 전직할 수 있다.', '모험가마다 여관 방이 있다. 원정에서 쌓인 숙면 피로는 여관에서 자야 풀리고, 많이 쌓이면 원정에 나갈 수 없다.'],
  v06: ['상단 건물을 새로 단장했다.', '이제 첫 화면은 상단 본부다. 1층은 상점이자 본부라서, 진열대에 올린 물건을 손님이 직접 들어와 골라 사 간다. 시설을 지으면 위로는 연금술 공방·훈련소·신전·여관·마탑이, 아래로는 대장간과 은행 금고가 한 층씩 생긴다. 여관에는 모험가마다 침대와 옷장, 보관 상자가 있는 방이 있다.', '왼쪽 층 버튼을 누르거나 화면을 위아래로 밀어 층을 옮기고, 가구나 사람을 누르면 그 창이 열린다. 오른쪽 메뉴로 창을 열고, 뒤로 버튼이나 휴대폰의 뒤로 가기로 돌아온다.', '원정 화면은 왼쪽 위 작은 창에 나온다. 누르면 크게, 다시 누르면 작게 볼 수 있다.'],
  bview: ['캐릭터와 몬스터를 전부 손으로 다시 찍었다. 원정에서는 옆모습으로 싸우고, 쓰러지는 동작과 레벨 업 효과가 생겼다.', '원정 화면을 새로 그렸다. 길이 화면 안쪽으로 뻗고, 적은 가운데 줄에, 파티는 아래 줄에 선다. 모험가와 몬스터 밑에는 체력(빨강)과 마나(파랑) 막대가 있다.', '왼쪽 위 작은 원정 창을 누르면 전투 창이 열린다. 전장 전체와 함께 누가 누구에게 얼마나 피해를 줬는지 전투 기록이 이름별 색으로 적힌다. 전투 창에서 복귀 명령도 내릴 수 있다.', '아래 파티 단추를 누르면 그 파티의 전투를 본다.'],
  v29: ['2차·3차 직업이 역할별로 다시 짜였다.', '전사: 기사=탱커(도발·엄호·받는 피해 감소·파티 보호막) · 검투사=지속딜(연계) · 광전사=한방딜(분노·처형) · 마검사=브루저(마법 검+보호막). 마법사: 네크로맨서=지속딜 · 마도사=한방딜 · 정령술사=혼합. 궁수: 레인저=지속딜 · 저격수=한방딜 · 괴물사냥꾼=혼합(표식). 도적: 쌍검사=지속딜 · 암살자=한방딜 · 보물 사냥꾼=혼합(대박). 성직자: 사제=치유·보호막, 대주교는 부활 · 역병의사=재생+지속 딜 · 퇴마사=전투 사제. 짐꾼: 음유시인=공격 버퍼 · 마부=방어 버퍼 · 정찰가=디버퍼.', '새 장치: 연계(기본 공격을 맞힐 때마다 피해가 쌓임, 5중첩) · 처형(HP 30% 아래 적에게 더 아픔) · 표식(걸린 적이 받는 피해 +20%) · 보호막(피해를 대신 받는 임시 HP) · 엄호(탱커가 동료 대신 맞음) · 재생(초당 회복) · 부활(대주교 Lv75).', '배워 둔 고유 스킬은 그대로 남고 수치와 종류만 바뀌었다. 새 고유 스킬(짐칸 보호막·약점 간파·축복의 보호막·집중 치료·별의 보호막·앙코르·부활)은 훈련소에서 배운다. 3차 첫 고유 스킬은 Lv55에 열린다.', '초반 마법사가 너무 앞서서 마법 기본 공격 ×2.3→×2.1, 화염구 ×2.0→×1.8로 조금 내렸다. 모험가 창 → 전직 안내에 역할 설명이 있다.'],
  v28: ['특성 돌과 레이드, 왕국 상단에 새것이 들어왔다.', '개화석: 타고난 특성이 3개가 안 되는 모험가에게 새 특성 하나를 피운다. 필드의 우두머리(6%)·주인(15%), 던전 주인(20%), 레이드 등수 보상(1위 2개·2위 1개·3위 1개)에서 나온다. 모험가 창의 특성에서 쓴다.', '마법사의 돌은 이제 투기장 상단·암시장·떠돌이 상인에서 팔지 않는다. 우두머리·주인·던전 주인이 4%로, 레이드 등수 보상으로 가끔 남긴다.', '원정대 창의 「레이드」 탭에서 파티를 골라 바로 보낼 수 있다.', '왕국 상단이 찾아오면 상단 앞에 그 왕국의 마차가 서 있다. 왕국 상단의 스킬북은 전보다 강해지고 비싸졌으며, 2차 전직을 마친 모험가만 배울 수 있다.'],
  v25: ['원정대 창이 파티 탭으로 바뀌었다.', '맨 위의 1팀·2팀 탭을 누르면 그 파티의 파티원·대기 모험가·보급품·목적지·마차·설정·출발이 한 화면에 나온다. 레이드는 「레이드」 탭에.', '출발하면 파티가 대형을 짠다: 근접은 앞줄, 원거리 딜러는 가운데, 짐꾼·음유시인·마법사·치유사는 뒷줄. 앞줄이 적의 공격을 더 자주 받는다.', '짐꾼의 2차 직업에 마부와 정찰가가 생겼다. 당나귀 수레부터는 마부가 파티에 있어야 끌 수 있으니, 마차를 가진 파티에는 짐꾼을 마부로 전직시켜 넣자(손수레는 그대로). 마부는 마차 짐을 더 싣고 더 빨리 몬다.', '정찰가는 파티 이동 속도를 올리고, 야영할 때 모닥불 대신 텐트를 쳐 잘 때 피로가 훨씬 빨리 풀리고 밤습격도 줄어든다.'],
  v23: ['스킬과 상단 살림에 새것이 들어왔다.', '배운 스킬은 훈련소에서 Lv5까지 올릴 수 있다. 스킬북이 있는 스킬은 같은 책 한 권을 더 바치고, 기본·고유 스킬은 돈만 든다. 단계마다 위력 +8%, 재사용 -4%.', '스킬마다 「자동 끔」과 「우선」을 정할 수 있다. 끈 스킬은 쓰지 않고, 우선 스킬은 먼저 쓴다.', '전투 창의 「통계」 단추를 누르면 이번 원정에서 누가 얼마나 때리고 맞았는지, 어떤 스킬이 피해를 많이 냈는지 보인다. 원정대 창의 파티 카드에도 지난 원정 통계가 남는다.', '상단 창에 「업적」이 생겼다. 49가지 목표를 채우면 돈·명성·마법사의 돌·룬을 받는다. 이미 채운 것은 지금 바로 받는다.', '같은 단계 장비를 3점 끼면 세트 효과(공격·마법·방어 +5%), 4점이면 +8%와 최대 HP +6%. 희귀 이상 장비의 보너스 옵션은 마탑에서 다시 감정할 수 있다(창고 장비 탭).'],
  v22: ['전투와 모험가 길드가 조금 바뀌었다.', '기본 공격은 이제 5초(÷ 공격 속도)에 한 번 나가는 대신 공격력의 2.5배로 세게 친다. 스킬은 저마다의 재사용 대기시간이 돌면 기본 공격과 상관없이 바로 나간다. 공격 속도는 특성 「재빠름」·스킬북 「신속」·신속의 룬·강화 스킬로, 스킬 재사용 감소는 스킬북 「전술」·특성 「전술가」·시간의 룬·숙련도로 모은다.', '모험가 창의 스킬 탭과 창고·도감·상점의 스킬북에 피해 계수·대상·치명타·상태이상 확률·비용·재사용 대기시간이 전부 적힌다. 모험가 창에서는 그 모험가의 실제 수치로 보인다.', '스킬북은 책마다 떨어뜨리는 몬스터가 정해졌다. 도감의 몬스터 전리품과 스킬북 설명에서 누가 어떤 책을 떨어뜨리는지 볼 수 있다.', '모험가 길드의 라이선스 심사가 엄해졌다. 레벨·개인 명성뿐 아니라 처치 수, 우두머리·주인 처치 수, 던전 공략 수를 본다. 그동안의 처치 기록은 어림해 넣어 두었다.'],
  v07: ['상단에 큰 소식이 있다.', '모험가가 Lv100까지 자라고, Lv30·50·70·90·100마다 스킬 칸이 하나씩 늘어난다. 스킬도 200가지로 많아졌다.', '전직이 바뀌었다. 전사·궁수·도적·마법사·성직자는 Lv20에 세 갈래 2차 직업 중 하나를 고르고, Lv50에 3차 직업이 된다. 직업마다 특성이 다르다. 짐꾼은 짐꾼 그대로다.', '장비 등급에 영웅·전설·신화·신성이 생겼다. 필드 보스와 던전 주인의 전용 부속품으로 대장간에서 만든다. 등급마다 룬 칸이 하나씩 열리고, 룬을 끼우면 장비가 강해진다.', '던전을 공략하면 상단 전체에 힘을 주는 유물을 얻는다. 이웃 왕국의 상단이 물건을 대량으로 사러 오고, 매달 초대형 몬스터 레이드 두 곳이 열려 다른 상단·왕국 원정대와 겨룬다.', '배속은 1×·5×·10×·20×로 바뀌었고, 오른쪽 위 버튼으로 바꾼다.'],
  v04: ['상단에 새 소식이 있다.', '이제 게임 속 시간이 24시간 시계로 흐른다. 새벽 4시~10시는 새벽, 10시~16시는 점심, 16시~22시는 저녁, 22시~새벽 4시는 밤이다.', '파티 목록 오른쪽의 1×·2×·3×·5× 버튼으로 시간을 빠르게 흘려 보낼 수 있다.', '상단 메뉴의 설정에서 저장 코드를 복사해 두면, 다른 기기나 새로 설치한 앱으로 진행 상황을 옮길 수 있다.'],
  temple: ['신전의 종이 처음으로 울렸다.', '사제가 말했다. "다친 이를 데려오시오. 시간과 히포크리초, 기도로 다시 일으켜 세우겠소."', '성직자를 신전에 두면 환자가 더 빨리 낫는다. 그리고 매달 신들 가운데 한 분이 상단에 축복을 내리신다.'],
  v02: ['상단에 새 소식이 있다.', '모험가마다 힘·체력·민첩·지능이 생겼고, 스킬과 장비를 갖출 수 있게 됐다. 모험가 창에서 이름을 누르면 자세히 볼 수 있다.', '시설 창에서 대장간, 은행, 마탑을 지을 수 있고, 상단 메뉴의 후원에서 도시의 여러 단체를 후원할 수 있다.', '게임 속 날짜는 이제 게임을 켜 둔 동안에만 흐른다. 자리를 비운 동안에도 원정과 판매 보상은 그대로 받는다.'],
  plains:   ['들쥐왕이 쓰러지자 곡물 창고 깊은 곳에서 검은 안개가 새어 나왔다.', '"마왕의 봉인이 약해지고 있다"는 소문이 오물거리에까지 돌기 시작했다.', '상단 랭크업 조건 하나를 채웠다. 다른 조건도 채우면 원시림으로 가는 길이 열린다.'],
  forest:   ['늙은 트렌트의 심장이 멈추자 세계수의 잎 하나가 검게 시들었다.', '엘프 왕국은 국경을 닫았다. 세계수가 병들고 있다는 소문이 돈다.', '상단 랭크업 조건 하나를 채웠다.'],
  mountain: ['갱도 끝, 바위거인이 지키던 문 너머에서 드워프들의 경고문이 발견됐다.', '"봉인은 일곱. 둘은 이미 깨졌다."', '상단 랭크업 조건 하나를 채웠다.'],
  valley:   ['폭풍 와이번이 떨어지자 계곡의 바람이 처음으로 멎었다.', '둥지 깊은 곳에는 깨진 봉인석 조각이 박혀 있었다. 세 번째 봉인이다.', '상단 랭크업 조건 하나를 채웠다.'],
  snow:     ['설녀 여왕의 얼음 왕관이 깨지며 신전에 갇혀 있던 사제가 깨어났다.', '"봉인을 지키던 자들이 하나씩 사라지고 있습니다. 다음은 사막의 왕릉입니다."', '상단 랭크업 조건 하나를 채웠다.'],
  desert:   ['거대 샌드웜의 뱃속에서 다섯 번째 봉인석이 나왔다. 이미 반쯤 금이 가 있었다.', '왕릉 벽화에는 일곱 용사가 마왕을 막아선 그림이 그려져 있었다.', '마지막 두 봉인이 어디 있는지는 아무도 모른다. 이야기는 다음 업데이트에서 이어진다.'],
  guildReady: ['시민회 사람들이 상단을 찾아왔다.', '"당신 상단이라면 해낼 수 있소. 7번가를 그놈들한테서 되찾아 주시오."', '원정 창에서 7번가 뒷골목으로 파티를 보낼 수 있다.'],
  guild:    ['검은 두건이 무릎을 꿇었다. 길드 장부에는 하르겐 귀족들의 이름이 빼곡했다.', '오물거리에 더는 자릿세를 걷으러 오는 사람이 없다. 거리에 사람이 늘고, 상점 손님도 많아졌다.', '하지만 장부 마지막 장에는 낯선 문장이 찍혀 있었다. 마왕을 섬기는 교단의 표식이다.']
};
