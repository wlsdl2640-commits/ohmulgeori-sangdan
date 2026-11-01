/* ───────── 직업과 능력치 ───────── */
// base: 1레벨 능력치, grow: 레벨당 평균 성장 (소수점은 확률로 오른다)
// 힘 str → 공격력, 체력 vit → HP·방어, 민첩 agi → 회피·공격속도·이동속도, 지능 int → MP·마법력
const STATS = [['str', '힘'], ['vit', '체력'], ['agi', '민첩'], ['int', '지능']];
const STAT_KEYS = STATS.map(s => s[0]);
const CLASSES = {
  warrior: { name: '전사',   base: { str: 7, vit: 8, agi: 3, int: 1 }, grow: { str: 1.6, vit: 2.0, agi: 0.6, int: 0.2 }, spd: 0.85, crit: 0.05, carry: 10, salary: 120, act: 'melee', innate: 'bash',      tunic: '#9b3b2f', trim: '#c9c3b8', desc: '앞에 서서 적의 공격을 받아낸다.' },
  archer:  { name: '궁수',   base: { str: 4, vit: 4, agi: 8, int: 3 }, grow: { str: 0.8, vit: 1.0, agi: 2.0, int: 0.4 }, spd: 1.0,  crit: 0.08, carry: 8,  salary: 130, act: 'arrow', innate: 'aimed',     tunic: '#3f7a3a', trim: '#8a5a32', desc: '체력이 가장 약한 적을 멀리서 쏜다.' },
  mage:    { name: '마법사', base: { str: 1, vit: 3, agi: 4, int: 9 }, grow: { str: 0.2, vit: 0.8, agi: 0.8, int: 2.4 }, spd: 0.7,  crit: 0.05, carry: 6,  salary: 160, act: 'magic', innate: 'fireball',  tunic: '#5a3d8c', trim: '#5ad6e8', desc: '지능이 높아 강한 마법을 쓴다.' },
  cleric:  { name: '성직자', base: { str: 3, vit: 5, agi: 3, int: 7 }, grow: { str: 0.6, vit: 1.3, agi: 0.6, int: 1.7 }, spd: 0.8,  crit: 0.03, carry: 8,  salary: 150, act: 'heal',  innate: 'heal',      tunic: '#d8d4c8', trim: '#d9b44a', desc: '다친 동료를 치료한다.' },
  rogue:   { name: '도적',   base: { str: 5, vit: 4, agi: 8, int: 1 }, grow: { str: 1.2, vit: 0.9, agi: 2.0, int: 0.2 }, spd: 1.25, crit: 0.15, carry: 12, salary: 130, act: 'melee', innate: 'backstab',  tunic: '#3a3a46', trim: '#9aa0a8', desc: '빠르고 치명타가 잦다.' },
  porter:  { name: '짐꾼',   base: { str: 8, vit: 7, agi: 2, int: 1 }, grow: { str: 1.8, vit: 1.6, agi: 0.4, int: 0.2 }, spd: 0.6,  crit: 0.02, carry: 30, salary: 80,  act: 'melee', innate: 'throwjunk', tunic: '#9a7a4f', trim: '#5e4630', desc: '싸움은 약하지만 짐을 아주 많이 든다.' }
};
// 특수직업: 던전을 공략하면 한 명씩 여관을 찾아온다 (무작위 손님으로는 나오지 않음)
Object.assign(CLASSES, {
  gladiator:    { name: '검투사',     special: 1, base: { str: 9, vit: 8, agi: 6, int: 1 },  grow: { str: 1.9, vit: 1.7, agi: 1.2, int: 0.2 }, spd: 0.95, crit: 0.1,  carry: 12, salary: 220, act: 'melee', innate: 'arena',       tunic: '#a8432f', trim: '#d9a441', desc: '투기장에서 살아남은 싸움꾼. 치명타와 회피에 능하다.' },
  elementalist: { name: '정령술사',   special: 1, base: { str: 2, vit: 5, agi: 5, int: 10 }, grow: { str: 0.3, vit: 1.0, agi: 0.9, int: 2.6 }, spd: 0.8,  crit: 0.05, carry: 8,  salary: 240, act: 'magic', innate: 'windspirit',  tunic: '#2f7a5a', trim: '#9ae0b0', desc: '정령의 힘으로 여러 적을 한꺼번에 공격한다.' },
  berserker:    { name: '광전사',     special: 1, base: { str: 11, vit: 9, agi: 4, int: 0 }, grow: { str: 2.4, vit: 1.9, agi: 0.8, int: 0.1 }, spd: 0.9,  crit: 0.08, carry: 14, salary: 230, act: 'melee', innate: 'bloodstrike', tunic: '#6a4a32', trim: '#c0392b', desc: 'HP를 깎아 가며 무시무시한 힘을 낸다.' },
  dragoon:      { name: '용기병',     special: 1, base: { str: 8, vit: 7, agi: 8, int: 2 },  grow: { str: 1.8, vit: 1.5, agi: 1.6, int: 0.3 }, spd: 1.0,  crit: 0.08, carry: 12, salary: 250, act: 'melee', innate: 'jump',        tunic: '#2f5a6a', trim: '#7ad8c8', desc: '하늘로 뛰어올라 창으로 내리꽂는다.' },
  paladin:      { name: '성기사',     special: 1, base: { str: 7, vit: 10, agi: 3, int: 6 }, grow: { str: 1.5, vit: 2.2, agi: 0.5, int: 1.3 }, spd: 0.85, crit: 0.04, carry: 12, salary: 260, act: 'melee', innate: 'holystrike',  tunic: '#e8e4d8', trim: '#e8c060', desc: '동료를 지키고 치유하는 신의 기사.' },
  necromancer:  { name: '네크로맨서', special: 1, base: { str: 2, vit: 5, agi: 4, int: 11 }, grow: { str: 0.3, vit: 1.1, agi: 0.8, int: 2.7 }, spd: 0.78, crit: 0.05, carry: 8,  salary: 270, act: 'magic', innate: 'drain',       tunic: '#2a2234', trim: '#a87ad8', desc: '죽음의 마법으로 적의 생명을 빼앗는다.' }
});
const CLASS_IDS = Object.keys(CLASSES).filter(k => !CLASSES[k].special);   // 여관에 무작위로 오는 직업
const ALL_CLASS_IDS = Object.keys(CLASSES);
const MAX_SKILLS = 4;

/* ───────── 스킬 ───────── */
// cls: 배울 수 있는 직업 (all = 모두), lv: 배울 수 있는 레벨, cost: { mp } 또는 { hp: 최대 HP 비율 }
// kind: dmg(물리) mdmg(마법) heal buff taunt dot, tgt: front low all self party
const SKILLS = {
  bash:       { name: '강타',       cls: ['warrior'], lv: 1,  cost: { mp: 6 },    cd: 4,  kind: 'dmg',  mult: 1.8, tgt: 'front', desc: '앞의 적을 세게 내리친다.' },
  taunt:      { name: '도발',       cls: ['warrior'], lv: 5,  cost: { mp: 8 },    cd: 12, kind: 'taunt', dur: 6, desc: '6초 동안 모든 적이 자신만 노리게 한다.' },
  ironwall:   { name: '철벽',       cls: ['warrior'], lv: 10, cost: { mp: 12 },   cd: 16, kind: 'buff', stat: 'def', mult: 2, dur: 6, tgt: 'self', desc: '6초 동안 방어력이 두 배가 된다.' },
  sweep:      { name: '휩쓸기',     cls: ['warrior'], lv: 15, cost: { mp: 14 },   cd: 8,  kind: 'dmg',  mult: 1.1, tgt: 'all', desc: '모든 적을 베어 낸다.' },
  berserk:    { name: '광폭화',     cls: ['warrior'], lv: 22, cost: { hp: 0.15 }, cd: 20, kind: 'buff', stat: 'atk', mult: 1.6, dur: 8, tgt: 'self', desc: 'HP를 깎아 8초 동안 공격력을 크게 올린다.' },
  aimed:      { name: '조준 사격',  cls: ['archer'],  lv: 1,  cost: { mp: 5 },    cd: 4,  kind: 'dmg',  mult: 1.7, crit: 0.3, tgt: 'low', fx: 'arrow', desc: '약한 적을 노려 쏜다. 치명타가 잘 터진다.' },
  double:     { name: '연사',       cls: ['archer'],  lv: 6,  cost: { mp: 9 },    cd: 6,  kind: 'dmg',  mult: 1.0, hits: 2, tgt: 'low', fx: 'arrow', desc: '화살 두 발을 연달아 쏜다.' },
  poisonarrow:{ name: '독화살',     cls: ['archer'],  lv: 11, cost: { mp: 10 },   cd: 8,  kind: 'dot',  mult: 0.5, dur: 6, tgt: 'front', fx: 'arrow', desc: '6초 동안 독 피해를 준다.' },
  rain:       { name: '화살비',     cls: ['archer'],  lv: 17, cost: { mp: 16 },   cd: 10, kind: 'dmg',  mult: 1.2, tgt: 'all', fx: 'arrow', desc: '모든 적에게 화살을 퍼붓는다.' },
  fireball:   { name: '화염구',     cls: ['mage'],    lv: 1,  cost: { mp: 8 },    cd: 3,  kind: 'mdmg', mult: 2.0, tgt: 'front', fx: 'fire', desc: '불덩이를 날린다.' },
  icelance:   { name: '얼음 창',    cls: ['mage'],    lv: 6,  cost: { mp: 10 },   cd: 6,  kind: 'mdmg', mult: 1.6, slow: 4, tgt: 'front', fx: 'ice', desc: '피해를 주고 4초 동안 적을 느리게 한다.' },
  chain:      { name: '연쇄 번개',  cls: ['mage'],    lv: 12, cost: { mp: 16 },   cd: 8,  kind: 'mdmg', mult: 1.3, tgt: 'all', fx: 'bolt', desc: '모든 적에게 번개가 튄다.' },
  burst:      { name: '마나 폭주',  cls: ['mage'],    lv: 20, cost: { hp: 0.2 },  cd: 18, kind: 'mdmg', mult: 2.4, tgt: 'all', fx: 'fire', desc: 'HP를 태워 모든 적에게 큰 마법 피해를 준다.' },
  heal:       { name: '치유',       cls: ['cleric'],  lv: 1,  cost: { mp: 6 },    cd: 2.5, kind: 'heal', mult: 2.0, tgt: 'low', desc: '가장 다친 동료를 치료한다.' },
  bless:      { name: '축복',       cls: ['cleric'],  lv: 5,  cost: { mp: 10 },   cd: 14, kind: 'buff', stat: 'atk', mult: 1.25, dur: 8, tgt: 'party', desc: '8초 동안 파티의 공격력을 올린다.' },
  massheal:   { name: '광역 치유',  cls: ['cleric'],  lv: 10, cost: { mp: 16 },   cd: 8,  kind: 'heal', mult: 0.9, tgt: 'party', desc: '파티 전원을 치료한다.' },
  holy:       { name: '신성한 빛',  cls: ['cleric'],  lv: 15, cost: { mp: 12 },   cd: 6,  kind: 'mdmg', mult: 1.8, boss: 1.6, tgt: 'front', fx: 'holy', desc: '마법 피해를 준다. 보스에게 더 아프다.' },
  backstab:   { name: '급소 찌르기', cls: ['rogue'],  lv: 1,  cost: { mp: 5 },    cd: 4,  kind: 'dmg',  mult: 1.5, crit: 1, tgt: 'low', desc: '반드시 치명타로 찌른다.' },
  smoke:      { name: '연막탄',     cls: ['rogue'],   lv: 6,  cost: { mp: 8 },    cd: 14, kind: 'buff', stat: 'eva', add: 0.25, dur: 6, tgt: 'party', desc: '6초 동안 파티의 회피율을 올린다.' },
  venom:      { name: '독 바르기',  cls: ['rogue'],   lv: 10, cost: { mp: 9 },    cd: 8,  kind: 'dot',  mult: 0.6, dur: 6, tgt: 'front', desc: '6초 동안 독 피해를 준다.' },
  shadow:     { name: '그림자 칼날', cls: ['rogue'],  lv: 16, cost: { hp: 0.1 },  cd: 9,  kind: 'dmg',  mult: 0.9, hits: 3, tgt: 'front', desc: 'HP를 깎아 세 번 연속으로 벤다.' },
  throwjunk:  { name: '짐 던지기',  cls: ['porter'],  lv: 1,  cost: { mp: 4 },    cd: 5,  kind: 'dmg',  mult: 1.4, tgt: 'front', desc: '들고 있던 잡동사니를 던진다.' },
  shout:      { name: '짐꾼의 함성', cls: ['porter'], lv: 8,  cost: { mp: 8 },    cd: 15, kind: 'buff', stat: 'def', mult: 1.4, dur: 8, tgt: 'party', desc: '8초 동안 파티의 방어력을 올린다.' },
  sturdy:     { name: '튼튼한 등짐', cls: ['porter'], lv: 12, passive: { carryPct: 0.3 }, desc: '들 수 있는 짐이 30% 늘어난다.' },
  ironskin:   { name: '강철 피부',  cls: ['warrior', 'porter'], lv: 14, passive: { defPct: 0.2 }, desc: '방어력이 20% 오른다.' },
  firstaid:   { name: '응급 처치',  cls: ['all'],     lv: 3,  cost: { mp: 8 },    cd: 10, kind: 'heal', mult: 0.8, tgt: 'low', desc: '다친 동료를 조금 치료한다.' },
  sprint:     { name: '질주',       cls: ['all'],     lv: 5,  passive: { movePct: 0.15 }, desc: '이동속도가 15% 빨라진다.' },
  meditate:   { name: '명상',       cls: ['all'],     lv: 8,  passive: { mpRegen: 1 }, desc: 'MP 회복이 두 배가 된다.' },
  // ── 특수직업 (own: 스킬북 없이 훈련소에서 배운다) ──
  arena:       { name: '투기장 일격', cls: ['gladiator'], lv: 1, cost: { mp: 6 }, cd: 4, kind: 'dmg', mult: 2.0, crit: 0.25, tgt: 'front', desc: '관중을 열광시키는 일격. 치명타가 잘 터진다.' },
  parry:       { name: '흘려 받기', cls: ['gladiator'], lv: 6, own: 1, cost: { mp: 8 }, cd: 12, kind: 'buff', stat: 'eva', add: 0.3, dur: 6, tgt: 'self', desc: '6초 동안 회피율이 크게 오른다.' },
  roar:        { name: '관중의 함성', cls: ['gladiator'], lv: 12, own: 1, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'atk', mult: 1.25, dur: 8, tgt: 'party', desc: '8초 동안 파티의 공격력을 올린다.' },
  execute:     { name: '처형', cls: ['gladiator'], lv: 20, own: 1, cost: { mp: 16 }, cd: 12, kind: 'dmg', mult: 3.2, tgt: 'low', desc: '가장 약한 적에게 결정타를 날린다.' },
  windspirit:  { name: '바람 정령', cls: ['elementalist'], lv: 1, cost: { mp: 9 }, cd: 4, kind: 'mdmg', mult: 1.1, tgt: 'all', fx: 'wind', desc: '바람 정령이 모든 적을 벤다.' },
  earthward:   { name: '대지의 가호', cls: ['elementalist'], lv: 7, own: 1, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.35, dur: 8, tgt: 'party', desc: '8초 동안 파티의 방어력을 올린다.' },
  firespirit:  { name: '불꽃 정령', cls: ['elementalist'], lv: 13, own: 1, cost: { mp: 14 }, cd: 7, kind: 'mdmg', mult: 0.8, hits: 3, tgt: 'front', fx: 'fire', desc: '불꽃 정령이 세 번 연달아 불을 뿜는다.' },
  storm:       { name: '정령 폭풍', cls: ['elementalist'], lv: 21, own: 1, cost: { mp: 26 }, cd: 12, kind: 'mdmg', mult: 2.2, tgt: 'all', fx: 'bolt', desc: '모든 정령이 함께 휘몰아친다.' },
  bloodstrike: { name: '피의 일격', cls: ['berserker'], lv: 1, cost: { hp: 0.05 }, cd: 3.5, kind: 'dmg', mult: 2.3, tgt: 'front', desc: 'HP를 조금 깎아 강하게 내리친다.' },
  whirl:       { name: '회전 도끼', cls: ['berserker'], lv: 7, own: 1, cost: { mp: 8 }, cd: 7, kind: 'dmg', mult: 1.3, tgt: 'all', desc: '도끼를 휘둘러 모든 적을 벤다.' },
  bloodthirst: { name: '피의 갈증', cls: ['berserker'], lv: 12, own: 1, cost: { mp: 10 }, cd: 14, kind: 'heal', tgt: 'self', pct: 0.25, desc: '최대 HP의 25%를 회복한다.' },
  rampage:     { name: '폭주', cls: ['berserker'], lv: 20, own: 1, cost: { hp: 0.2 }, cd: 20, kind: 'buff', stat: 'atk', mult: 1.9, dur: 8, tgt: 'self', desc: 'HP를 크게 깎아 8초 동안 공격력이 거의 두 배가 된다.' },
  jump:        { name: '도약 찌르기', cls: ['dragoon'], lv: 1, cost: { mp: 7 }, cd: 5, kind: 'dmg', mult: 2.4, tgt: 'low', fx: 'jump', desc: '뛰어올라 약한 적을 창으로 꿰뚫는다.' },
  dragonscale: { name: '용의 비늘', cls: ['dragoon'], lv: 8, own: 1, passive: { defPct: 0.15 }, desc: '방어력이 15% 오른다.' },
  gale:        { name: '창 돌풍', cls: ['dragoon'], lv: 13, own: 1, cost: { mp: 14 }, cd: 9, kind: 'dmg', mult: 1.3, tgt: 'all', desc: '창을 휘둘러 모든 적을 찌른다.' },
  skyfall:     { name: '하늘 낙하', cls: ['dragoon'], lv: 21, own: 1, cost: { mp: 20 }, cd: 14, kind: 'dmg', mult: 4.0, boss: 1.3, tgt: 'front', fx: 'jump', desc: '높이 솟구쳤다가 내리꽂는다. 보스에게 특히 아프다.' },
  holystrike:  { name: '성스러운 일격', cls: ['paladin'], lv: 1, cost: { mp: 7 }, cd: 4, kind: 'dmg', mult: 1.7, boss: 1.4, tgt: 'front', fx: 'holy', desc: '빛을 두른 검으로 벤다. 보스에게 더 아프다.' },
  guard:       { name: '수호의 맹세', cls: ['paladin'], lv: 6, own: 1, cost: { mp: 10 }, cd: 12, kind: 'taunt', dur: 7, desc: '7초 동안 모든 적이 자신만 노리게 한다.' },
  layhands:    { name: '치유의 손길', cls: ['paladin'], lv: 11, own: 1, cost: { mp: 12 }, cd: 7, kind: 'heal', mult: 1.8, tgt: 'low', desc: '가장 다친 동료를 크게 치료한다.' },
  judgment:    { name: '천상의 심판', cls: ['paladin'], lv: 20, own: 1, cost: { mp: 22 }, cd: 12, kind: 'mdmg', mult: 1.7, boss: 1.4, tgt: 'all', fx: 'holy', desc: '하늘의 빛이 모든 적을 내리친다.' },
  drain:       { name: '생명 흡수', cls: ['necromancer'], lv: 1, cost: { mp: 8 }, cd: 3.5, kind: 'mdmg', mult: 1.7, drain: 0.35, tgt: 'front', fx: 'dark', desc: '적의 생명을 빼앗아 자신의 HP를 채운다.' },
  curse:       { name: '저주', cls: ['necromancer'], lv: 6, own: 1, cost: { mp: 10 }, cd: 8, kind: 'dot', magic: 1, mult: 0.7, dur: 6, tgt: 'front', fx: 'dark', desc: '6초 동안 저주 피해를 준다.' },
  bonewall:    { name: '뼈의 방벽', cls: ['necromancer'], lv: 12, own: 1, cost: { mp: 14 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.3, dur: 8, tgt: 'party', desc: '해골 방패가 8초 동안 파티를 지킨다.' },
  deathwave:   { name: '죽음의 파도', cls: ['necromancer'], lv: 20, own: 1, cost: { hp: 0.15 }, cd: 14, kind: 'mdmg', mult: 2.4, tgt: 'all', fx: 'dark', desc: 'HP를 바쳐 모든 적에게 죽음의 파도를 보낸다.' }
};
const SKILL_IDS = Object.keys(SKILLS);
const BOOK_IDS = SKILL_IDS.filter(id => !SKILLS[id].own && !Object.values(CLASSES).some(c => c.innate === id));
const BOOK_COLORS = { warrior: '#c0392b', archer: '#4f9a3a', mage: '#7a4ac8', cleric: '#d9b44a', rogue: '#5a5a6a', porter: '#9a7a4f', all: '#4a8ac8' };
const ownFee = s => s.lv * 40;   // 특수직업 고유 스킬 수련비
BOOK_IDS.forEach(id => {
  const s = SKILLS[id];
  ITEMS['book_' + id] = { name: `스킬북: ${s.name}`, v: 60 + s.lv * 35, w: 1, icon: 'book', c: BOOK_COLORS[s.cls[0]], book: id };
});
const canLearn = (a, id) => { const s = SKILLS[id]; return (s.cls.includes('all') || s.cls.includes(a.cls)) && a.lv >= s.lv; };

/* ───────── 장비 ───────── */
// 단계별 재료: [단단한 것, 질긴 것, 마력 있는 것]
const GTIERS = [
  { name: '견습',   lv: 1,  p: 1.0,  smith: 1, mats: ['rabbit_horn', 'wolf_pelt', 'slime_jelly'] },
  { name: '숲지기', lv: 8,  p: 2.2,  smith: 1, mats: ['bark', 'spider_silk', 'shaman_feather'] },
  { name: '강철',   lv: 16, p: 3.8,  smith: 2, mats: ['iron_ore', 'lizard_scale', 'golem_core'] },
  { name: '폭풍',   lv: 25, p: 5.8,  smith: 3, mats: ['griffon_claw', 'wyvern_scale', 'harpy_feather'] },
  { name: '서리',   lv: 34, p: 8.2,  smith: 4, mats: ['frost_crystal', 'yeti_fur', 'snow_essence'] },
  { name: '사막왕', lv: 43, p: 11.0, smith: 4, mats: ['scorpion_stinger', 'sandworm_hide', 'sand_silk'] }
];
const SLOTS = [['weapon', '무기'], ['armor', '방어구'], ['acc', '장신구'], ['bag', '가방']];
// st: 단계 힘(p)을 곱하는 능력치, mat: 재료 개수 [단단, 질긴, 마력]
const GTYPES = {
  sword:   { name: '장검',     slot: 'weapon', cls: ['warrior', 'gladiator', 'paladin'],                     st: { atk: 4.2, vit: 0.5 },           w: 3, icon: 'sword',  mat: [3, 1, 0] },
  bow:     { name: '활',       slot: 'weapon', cls: ['archer'],                      st: { atk: 3.6, agi: 0.8 },           w: 2, icon: 'bow',    mat: [2, 2, 0] },
  staff:   { name: '지팡이',   slot: 'weapon', cls: ['mage', 'elementalist', 'necromancer'],                        st: { matk: 4.2, int: 0.8, mp: 4 },   w: 2, icon: 'staff',  mat: [1, 0, 3] },
  mace:    { name: '철퇴',     slot: 'weapon', cls: ['cleric', 'paladin'],                      st: { atk: 2.4, matk: 2.6, int: 0.5 }, w: 3, icon: 'mace',  mat: [3, 0, 1] },
  dagger:  { name: '단검',     slot: 'weapon', cls: ['rogue', 'gladiator'],                       st: { atk: 3.2, agi: 0.6, crit: 0.006 }, w: 1, icon: 'dagger', mat: [2, 1, 0] },
  club:    { name: '몽둥이',   slot: 'weapon', cls: ['porter', 'warrior', 'berserker'],           st: { atk: 3.4, str: 0.8 },           w: 3, icon: 'club',   mat: [3, 0, 0] },
  axe:     { name: '도끼',     slot: 'weapon', cls: ['berserker', 'warrior', 'porter'],     st: { atk: 4.6, str: 0.8, agi: -0.3 }, w: 4, icon: 'axe',    mat: [3, 1, 0] },
  lance:   { name: '창',       slot: 'weapon', cls: ['dragoon'],                     st: { atk: 4.3, agi: 0.7 },           w: 3, icon: 'lance',  mat: [3, 1, 0] },
  plate:   { name: '판금 갑옷', slot: 'armor', cls: ['warrior', 'gladiator', 'berserker', 'dragoon', 'paladin'],                     st: { def: 4.2, hp: 10, agi: -0.3 },  w: 6, icon: 'armor',  mat: [2, 3, 0] },
  leather: { name: '가죽 갑옷', slot: 'armor', cls: ['archer', 'rogue', 'porter', 'gladiator', 'berserker', 'dragoon'],   st: { def: 2.6, hp: 5, agi: 0.6 },    w: 3, icon: 'vest',   mat: [0, 4, 0] },
  robe:    { name: '로브',     slot: 'armor', cls: ['mage', 'cleric', 'elementalist', 'necromancer'],               st: { def: 1.6, mp: 6, int: 0.8 },    w: 2, icon: 'robe',   mat: [0, 1, 3] },
  ring:    { name: '반지',     slot: 'acc',   cls: ['all'],                          st: { str: 0.7, agi: 0.7, crit: 0.005 }, w: 1, icon: 'ring', mat: [1, 0, 2] },
  amulet:  { name: '부적',     slot: 'acc',   cls: ['all'],                          st: { int: 0.7, vit: 0.7, eva: 0.005 }, w: 1, icon: 'amulet', mat: [0, 0, 3] },
  bag:     { name: '가방',     slot: 'bag',   cls: ['all'],                          st: { carry: 4 },                     w: 1, icon: 'bag',    mat: [0, 5, 0] }
};
const GTYPE_IDS = Object.keys(GTYPES);
const QUALITY = [
  { name: '일반', m: 1.0,  c: '#d8d0c0' },
  { name: '고급', m: 1.25, c: '#7bd36a' },
  { name: '희귀', m: 1.55, c: '#6ab0ff' }
];
const STAT_NAMES = { atk: '공격', matk: '마법', def: '방어', hp: 'HP', mp: 'MP', str: '힘', vit: '체력', agi: '민첩', int: '지능', crit: '치명', eva: '회피', carry: '짐' };
const PCT_STATS = ['crit', 'eva'];

function gearStats(g) {
  const T = GTYPES[g.base], t = GTIERS[g.t], q = QUALITY[g.q || 0].m, out = {};
  for (const [k, v] of Object.entries(T.st)) {
    if (k === 'carry') out.carry = Math.round((6 + v * t.p) * q);
    else if (PCT_STATS.includes(k)) out[k] = Math.min(0.12, Math.round(v * t.p * q * 1000) / 1000);
    else if (STAT_KEYS.includes(k)) { const n = Math.round(v * t.p * q); if (n) out[k] = n; }   // 힘·체력·민첩·지능은 정수
    else out[k] = Math.round(v * t.p * q * 10) / 10;
  }
  if (g.bonus) for (const [k, v] of Object.entries(g.bonus)) out[k] = Math.round(((out[k] || 0) + v) * 1000) / 1000;
  return out;
}
const gearName = g => `${GTIERS[g.t].name} ${GTYPES[g.base].name}`;
const gearKey = g => `${g.base}:${g.t}`;
const gearValue = g => Math.round(45 * GTIERS[g.t].p * QUALITY[g.q || 0].m + recipeFee(g.t) * 0.5);
const recipeFee = t => Math.round(15 * GTIERS[t].p * GTIERS[t].p);
function recipeNeed(base, t) {
  const need = {}, mats = GTIERS[t].mats;
  GTYPES[base].mat.forEach((n, i) => { if (n) need[mats[i]] = n; });
  return need;
}
const gearFits = (a, g) => (GTYPES[g.base].cls.includes('all') || GTYPES[g.base].cls.includes(a.cls)) && a.lv >= GTIERS[g.t].lv;

/* ───────── 연금술 ───────── */
const RECIPES = [
  { out: 'pot_s', need: { slime_jelly: 2 }, fee: 6, lv: 1 },
  { out: 'mp_s',  need: { spore: 1, shaman_feather: 1 }, fee: 15, lv: 1 },
  { out: 'pot_m', need: { treant_sap: 1, spore: 1 }, fee: 20, lv: 1 },
  { out: 'pot_l', need: { lizard_scale: 2, golem_core: 1 }, fee: 60, lv: 2 },
  { out: 'mp_m',  need: { harpy_feather: 2, frost_crystal: 1 }, fee: 60, lv: 2 }
];

/* ───────── 상점 가격대 ───────── */
const TIERS = [
  { name: '싸게',   m: 1.0, iv: 22 },
  { name: '정가',   m: 1.3, iv: 45 },
  { name: '비싸게', m: 1.6, iv: 90 }
];
const GUILD_RATE = 0.7;
const GEAR_SELL = 0.6;
