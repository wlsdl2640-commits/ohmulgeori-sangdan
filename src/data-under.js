/* ───────── 7번가 지하수로: 범죄자들의 지하 도시 ─────────
   투기장(파티 PvP) · 투기장 상단 · 암시장 · 경매장 · 암살자 길드 본부 · 지하수로 던전.
   그리고 왕국 상단이 팔러 오는 물건과 왕국 전용 스킬북. */
const UNDER_RANK = 2;   // 상단 D랭크부터 지하수로 입구가 열린다

// 왕국 상단이 가져와 파는 것 (sells)과 그 왕국에서만 파는 스킬북 (books)
Object.assign(KINGDOMS.inglisia, { sells: ['iron_ore', 'wolf_pelt', 'lizard_scale'], books: ['kn_charge', 'kn_wall'] });
Object.assign(KINGDOMS.frama,    { sells: ['spider_silk', 'sand_silk', 'harpy_feather'], books: ['fr_wit', 'fr_song'] });
Object.assign(KINGDOMS.elves,    { sells: ['herb', 'treant_sap', 'elder_heart'], books: ['el_arrow', 'el_breath'] });
Object.assign(KINGDOMS.dwarves,  { sells: ['iron_ore', 'golem_core', 'frost_crystal'], books: ['dw_smash', 'dw_grit'] });
Object.assign(KINGDOMS.sarak,    { sells: ['scorpion_stinger', 'sand_silk', 'worm_pearl'], books: ['sa_mirage', 'sa_curse'] });

// 드랍으로는 얻을 수 없는 스킬: 왕국 상단(kingdom)과 투기장 상단(arena)에서만 판다
const UNDER_SKILLS = {
  kn_charge: { name: '기사단 돌격',  cls: ['warrior'],          lv: 24, cost: { mp: 14 }, cd: 9,  kind: 'dmg',  mult: 2.6, tgt: 'front', crit: 0.1, desc: '잉그리시아 기사단의 돌격. 앞의 적을 꿰뚫는다.', kingdom: 'inglisia' },
  kn_wall:   { name: '왕국 방패술',  cls: ['warrior'],          lv: 30, cost: { mp: 16 }, cd: 18, kind: 'buff', stat: 'def', mult: 1.5, dur: 8, tgt: 'party', desc: '8초 동안 파티의 방어력을 올린다.', kingdom: 'inglisia' },
  fr_wit:    { name: '상인의 재치',  cls: ['rogue', 'archer'],  lv: 26, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.15, dur: 8, tgt: 'party', desc: '8초 동안 파티가 공격을 더 잘 피한다.', kingdom: 'frama' },
  fr_song:   { name: '남해의 노래',  cls: ['archer', 'cleric'], lv: 32, cost: { mp: 18 }, cd: 12, kind: 'heal', mult: 1.1, tgt: 'party', desc: '파티 전원을 치료하는 바닷노래.', kingdom: 'frama' },
  el_arrow:  { name: '정령의 화살',  cls: ['archer'],           lv: 28, cost: { mp: 14 }, cd: 7,  kind: 'mdmg', mult: 2.4, tgt: 'low', fx: 'arrow', desc: '정령의 힘을 실은 화살. 마법 피해를 준다.', kingdom: 'elves' },
  el_breath: { name: '숲의 숨결',    cls: ['cleric', 'mage'],   lv: 34, cost: { mp: 20 }, cd: 14, kind: 'heal', mult: 1.3, tgt: 'party', desc: '세계수의 숨결로 파티를 치료한다.', kingdom: 'elves' },
  dw_smash:  { name: '브론하임 강타', cls: ['warrior', 'porter'], lv: 30, cost: { mp: 16 }, cd: 10, kind: 'dmg', mult: 3.2, tgt: 'front', fx: 'jump', desc: '드워프식 망치질. 한 놈을 크게 친다.', kingdom: 'dwarves' },
  dw_grit:   { name: '광부의 끈기',  cls: ['porter', 'warrior'], lv: 26, cost: { mp: 10 }, cd: 20, kind: 'buff', stat: 'def', mult: 2.2, dur: 7, tgt: 'self', desc: '7초 동안 방어력이 크게 오른다.', kingdom: 'dwarves' },
  sa_mirage: { name: '사막의 신기루', cls: ['mage'],            lv: 32, cost: { mp: 22 }, cd: 11, kind: 'mdmg', mult: 1.4, tgt: 'all', fx: 'fire', desc: '모든 적을 태우는 신기루.', kingdom: 'sarak' },
  sa_curse:  { name: '술탄의 저주',  cls: ['mage', 'cleric'],   lv: 36, cost: { mp: 18 }, cd: 12, kind: 'dot',  mult: 0.9, dur: 8, tgt: 'all', magic: 1, fx: 'dark', desc: '8초 동안 모든 적에게 저주 피해를 준다.', kingdom: 'sarak' },
  // 투기장 상단
  ar_roar:   { name: '검투사의 함성', cls: ['warrior'],         lv: 20, cost: { mp: 14 }, cd: 16, kind: 'buff', stat: 'atk', mult: 1.35, dur: 8, tgt: 'party', desc: '8초 동안 파티의 공격력을 올린다.', arena: 1 },
  ar_sand:   { name: '모래 뿌리기',  cls: ['rogue', 'warrior'], lv: 20, cost: { mp: 8 },  cd: 12, kind: 'buff', stat: 'eva', add: 0.2, dur: 6, tgt: 'self', desc: '적의 눈에 모래를 뿌려 6초 동안 공격을 잘 피한다.', arena: 1 },
  ar_cheer:  { name: '관중의 응원',  cls: ['all'],              lv: 24, cost: { mp: 16 }, cd: 15, kind: 'heal', mult: 1.0, tgt: 'party', desc: '환호에 힘입어 파티 전원이 회복한다.', arena: 1 },
  ar_combo:  { name: '투기장 연격',  cls: ['warrior', 'rogue'], lv: 28, cost: { mp: 15 }, cd: 8,  kind: 'dmg',  mult: 0.95, hits: 3, tgt: 'front', desc: '세 번 연달아 벤다.', arena: 1 },
  ar_finish: { name: '피니시',       cls: ['all'],              lv: 34, cost: { mp: 20 }, cd: 14, kind: 'dmg',  mult: 3.4, tgt: 'low', crit: 0.25, desc: '가장 약한 적에게 끝내기 일격.', arena: 1 },
  ar_phalanx:{ name: '방진',         cls: ['warrior', 'cleric'], lv: 30, cost: { mp: 18 }, cd: 20, kind: 'buff', stat: 'def', mult: 1.6, dur: 8, tgt: 'party', desc: '8초 동안 파티의 방어력을 올린다.', arena: 1 }
};
Object.assign(SKILLS, UNDER_SKILLS);
Object.keys(UNDER_SKILLS).forEach(id => {
  const s = SKILLS[id];
  SKILL_IDS.push(id);
  ITEMS['book_' + id] = { name: `스킬북: ${s.name}`, v: 120 + s.lv * 50, w: 1, icon: 'book', c: s.arena ? '#f0b43c' : (BOOK_COLORS[s.cls[0]] || '#4a8ac8'), book: id, rare: 1 };
});

// 투기장 상단에서만 파는 장비 (떨어지지도, 만들 수도 없다)
Object.assign(GTYPES, {
  gladius:   { name: '글라디우스',    slot: 'weapon', cls: ['warrior', 'gladiator', 'champion', 'duelist', 'bladedancer'], st: { atk: 4.8, agi: 0.6, crit: 0.01 }, w: 3, icon: 'sword', mat: [3, 1, 0], arena: 1 },
  trident:   { name: '삼지창',        slot: 'weapon', cls: ['gladiator', 'champion', 'knight', 'paladin', 'ranger', 'dragoon'], st: { atk: 4.6, agi: 0.5, vit: 0.5 }, w: 3, icon: 'lance', mat: [3, 1, 0], arena: 1 },
  arenamail: { name: '투기장 흉갑',   slot: 'armor',  cls: ['warrior', 'gladiator', 'champion', 'knight', 'berserker', 'duelist', 'rogue'], st: { def: 4.0, hp: 12, agi: 0.3 }, w: 5, icon: 'armor', mat: [2, 3, 0], arena: 1 },
  champring: { name: '챔피언의 반지', slot: 'acc',    cls: ['all'], st: { str: 1.0, agi: 0.8, crit: 0.012 }, w: 1, icon: 'ring', mat: [1, 0, 2], arena: 1 }
});
const ARENA_GEAR = ['gladius', 'trident', 'arenamail', 'champring'];
const ARENA_BOOKS = Object.keys(UNDER_SKILLS).filter(id => UNDER_SKILLS[id].arena);
const ARENA_COIN = { win: 15, lose: 5 };
const ARENA_SCORE_WIN = [90, 140, 200];   // 상대 급(약·비슷·강)별 랭킹 점수
const ARENA_SCORE_LOSE = 30;
const ARENA_PER_DAY = 10;
const ARENA_TIERS = ['신참', '베테랑', '챔피언'];
const GLADIATOR_SCORE = 10000;   // 검투사 전직 조건: 투기장 랭킹 점수
const ARENA_NAMES = ['검은 늪 상단', '황금사자 상단', '푸른 돛 상단', '잿빛 송곳니단', '붉은 모래 용병단', '7번가 토박이들', '브론하임 철벽대', '실바레아 순찰대', '프라마 용병단', '잉그리시아 왕립 원정대', '그림자 상단', '등불 없는 자들'];

// 지하수로 필드와 몬스터
Object.assign(ITEMS, {
  sewer_hide:    { name: '하수도 쥐가죽',  v: 16,   w: 2, icon: 'hide',  c: '#6a5a50' },
  sludge_lump:   { name: '오물 덩어리',    v: 14,   w: 3, icon: 'blob',  c: '#6a7a3a' },
  croc_hide:     { name: '하수도 악어 가죽', v: 48, w: 4, icon: 'hide',  c: '#4a6a4a' },
  croc_tooth:    { name: '악어 이빨',      v: 60,   w: 1, icon: 'fang',  c: '#e8e0c8' },
  ratman_dagger: { name: '쥐인간의 단검',  v: 75,   w: 1, icon: 'blade', c: '#9a9aa8' },
  troll_fang:    { name: '트롤의 송곳니',  v: 420,  w: 2, icon: 'fang',  c: '#d8d0a8' },
  troll_heart:   { name: '하수도 트롤의 심장', v: 1400, w: 3, icon: 'heart', c: '#5a8a4a' }
});
Object.assign(MONS, {
  sewerrat:   { name: '하수도 쥐떼',   plan: 'beast', body: '#5a4a44', dark: '#3a2e2a', mh: 0.9, ma: 1.0, md: 0.8, spd: 1.3, eva: 0.08, minS: 1,  drops: [['sewer_hide', 0.5], ['rat_tail', 0.3]] },
  sludge:     { name: '오물 슬라임',   plan: 'slime', body: '#5a6a3a', dark: '#3a4a26', mh: 1.4, ma: 0.9, md: 1.1, spd: 0.7, minS: 1,  drops: [['sludge_lump', 0.5], ['slime_jelly', 0.3]] },
  sewercroc:  { name: '하수도 악어',   plan: 'beast', body: '#4a6a4a', dark: '#2e4a2e', mh: 1.8, ma: 1.4, md: 1.3, spd: 0.8, minS: 10, drops: [['croc_hide', 0.45], ['croc_tooth', 0.25]] },
  ratman:     { name: '쥐인간 도둑',   plan: 'human', body: '#7a6a5a', dark: '#4a3e34', skin: '#8a7a6a', mh: 1.1, ma: 1.3, md: 0.9, spd: 1.2, eva: 0.15, minS: 20, drops: [['ratman_dagger', 0.3], ['sewer_hide', 0.3]] },
  sewertroll: { name: '하수도 트롤',   plan: 'giant', body: '#5a7a5a', dark: '#3a5a3a', boss: 1, scale: 2, mh: 5.0, ma: 1.7, md: 1.4, spd: 0.7, aoe: 1, drops: [['troll_fang', 1], ['troll_heart', 1]] }
});
FIELDS.sewer = {
  no: 8, name: '지하수로', lv: 30, bg: 'sewer', tier: 3, unlock: `지하수로 구역이 열리면 (상단 ${RANKS[UNDER_RANK].name}랭크)`,
  desc: '7번가 밑을 흐르는 하수도. 범죄자들의 지하 도시 너머로 더 깊은 수로가 이어진다.',
  mons: ['sewerrat', 'sludge', 'sewercroc', 'ratman'],
  dungeon: { name: '지하수로 깊은 곳', bg: 'sewer', mons: ['sewerrat', 'sludge', 'sewercroc', 'ratman'], boss: 'sewertroll' },
  next: null
};
ALL_FIELDS.push('sewer');

STORY.under = [
  '상단 랭크가 오르자 7번가 토박이가 귀띔했다. "오물거리 밑에는 또 하나의 거리가 있소. 하수도를 따라가면 등불 없는 도시가 나오지."',
  '지하수로. 암살자 길드의 본부, 피 냄새 나는 투기장, 물건에 이름표가 없는 암시장, 밤마다 한 점씩만 나오는 경매장. 그리고 더 깊은 수로에는 아무도 돌아오지 않은 곳이 있다.',
  '시설 창에서 「7번가 지하수로」로 내려갈 수 있다. 원정 목적지에도 지하수로가 열렸다.'
];
STORY.sewer = ['지하수로의 트롤이 쓰러졌다. 수로 깊은 곳의 물이 처음으로 맑게 흘렀다.', '트롤의 둥지에는 범죄자들이 잃어버린 금고 열쇠가 있었다. 지하 도시가 상단을 다르게 보기 시작했다.'];
