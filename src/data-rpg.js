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
// 2차·3차 직업 (special). tier 2는 기본 직업에서 셋 중 하나를 고르고, tier 3은 그 2차의 다음 단계.
// tr: 직업 특성 (전투 계산에 쓰인다)
//   critMul 치명타 배율 · guard 받는 피해 감소 · tank 적의 표적이 될 무게 · lifesteal 물리 흡혈 · rage 체력이 줄수록 공격력
//   pet 동물 동료의 추가 공격 확률 · pen 방어 관통 · first 싸움 첫 공격 배율(반드시 치명타) · double 기본 공격 두 번
//   luck 전리품·금화 · aoe 광역 마법 · mdrain 마법 흡혈 · hybrid 기본 공격에 마법 피해 · healPow 치유량 · dot 지속 피해 · bossDmg 보스 피해 · aura 파티 공격력
const SP = (o) => Object.assign({ special: 1, carry: 10 }, o);
Object.assign(CLASSES, {
  // ── 전사 ──
  gladiator:   SP({ name: '검투사',     tier: 2, from: 'warrior',    base: { str: 8, vit: 9, agi: 8, int: 1 },   grow: { str: 1.7, vit: 1.9, agi: 1.6, int: 0.2 }, spd: 1.0,  crit: 0.14, carry: 12, salary: 230, act: 'melee', innate: 'arena',       tunic: '#a8432f', trim: '#d9a441', tr: { critMul: 2.1, tank: 1 }, desc: '회피와 치명타가 높고 체력도 튼튼한 투기장의 싸움꾼.' }),
  champion:    SP({ name: '챔피언',     tier: 3, from: 'gladiator',  base: { str: 11, vit: 11, agi: 11, int: 1 }, grow: { str: 2.1, vit: 2.2, agi: 2.0, int: 0.2 }, spd: 1.05, crit: 0.2,  carry: 12, salary: 300, act: 'melee', innate: 'glory',       tunic: '#c0392b', trim: '#f0c24a', tr: { critMul: 2.5, tank: 1 }, desc: '투기장의 전설. 치명타가 터질 때마다 관중이 열광한다.' }),
  knight:      SP({ name: '기사',       tier: 2, from: 'warrior',    base: { str: 7, vit: 11, agi: 3, int: 2 },  grow: { str: 1.4, vit: 2.4, agi: 0.5, int: 0.3 }, spd: 0.85, crit: 0.04, carry: 12, salary: 230, act: 'melee', innate: 'shieldbash',  tunic: '#4a5a7a', trim: '#c8ccd4', tr: { guard: 0.12, tank: 2 }, desc: '방어력과 체력이 높고 공격력은 보통. 동료 앞을 막아선다.' }),
  paladin:     SP({ name: '성기사',     tier: 3, from: 'knight',     base: { str: 9, vit: 13, agi: 4, int: 7 },  grow: { str: 1.7, vit: 2.7, agi: 0.6, int: 1.5 }, spd: 0.85, crit: 0.05, carry: 12, salary: 300, act: 'melee', innate: 'holystrike',  tunic: '#e8e4d8', trim: '#e8c060', tr: { guard: 0.2, tank: 3, healPow: 1.2 }, desc: '신의 부름을 받은 기사. 동료를 지키고 치유한다.' }),
  berserker:   SP({ name: '광전사',     tier: 2, from: 'warrior',    base: { str: 9, vit: 7, agi: 5, int: 0 },   grow: { str: 1.8, vit: 1.4, agi: 1.0, int: 0.1 }, spd: 0.95, crit: 0.08, carry: 14, salary: 230, act: 'melee', innate: 'bloodstrike', tunic: '#6a4a32', trim: '#c0392b', tr: { lifesteal: 0.1, rage: 0.6, tank: 1 }, desc: '공격할 때마다 피를 빨아 회복한다. 체력이 줄어들수록 공격력이 세진다.' }),
  bloodlord:   SP({ name: '피의 군주',  tier: 3, from: 'berserker',  base: { str: 12, vit: 9, agi: 6, int: 0 },  grow: { str: 2.3, vit: 1.7, agi: 1.2, int: 0.1 }, spd: 1.0,  crit: 0.1,  carry: 14, salary: 300, act: 'melee', innate: 'bloodfeast',  tunic: '#4a1a1a', trim: '#e03a3a', tr: { lifesteal: 0.16, rage: 1.0, tank: 1 }, desc: '피에 굶주린 전장의 군주. 쓰러지기 직전에 가장 무섭다.' }),
  // ── 궁수 ──
  ranger:      SP({ name: '레인저',     tier: 2, from: 'archer',     base: { str: 5, vit: 6, agi: 10, int: 4 },  grow: { str: 1.0, vit: 1.2, agi: 2.3, int: 0.6 }, spd: 1.05, crit: 0.1,  salary: 230, act: 'arrow', innate: 'beastshot',   tunic: '#4a6a2a', trim: '#c8a060', tr: { pet: 0.25 }, desc: '늑대와 함께 사냥하는 숲의 궁수. 늑대가 함께 물어뜯는다.' }),
  dragoon:     SP({ name: '용기병',     tier: 3, from: 'ranger',     base: { str: 10, vit: 8, agi: 10, int: 2 }, grow: { str: 2.0, vit: 1.6, agi: 2.0, int: 0.3 }, spd: 1.05, crit: 0.1,  carry: 12, salary: 300, act: 'melee', innate: 'jump',        tunic: '#2f5a6a', trim: '#7ad8c8', tr: { pet: 0.4 }, desc: '와이번을 길들인 레인저. 하늘에서 창을 내리꽂고 와이번이 함께 싸운다.' }),
  sniper:      SP({ name: '저격수',     tier: 2, from: 'archer',     base: { str: 6, vit: 4, agi: 11, int: 3 },  grow: { str: 1.2, vit: 0.9, agi: 2.5, int: 0.4 }, spd: 0.85, crit: 0.18, salary: 230, act: 'arrow', innate: 'headshot',    tunic: '#3a4a3a', trim: '#9aa0a8', tr: { pen: 0.3, first: 2.0 }, desc: '멀리서 단 한 발로 끝낸다. 방어를 꿰뚫고, 싸움의 첫 발이 특히 아프다.' }),
  hawkeye:     SP({ name: '신궁',       tier: 3, from: 'sniper',     base: { str: 8, vit: 6, agi: 14, int: 4 },  grow: { str: 1.5, vit: 1.1, agi: 2.9, int: 0.5 }, spd: 0.9,  crit: 0.25, salary: 300, act: 'arrow', innate: 'divinearrow', tunic: '#2a3a5a', trim: '#f0d870', tr: { pen: 0.5, first: 2.5 }, desc: '신의 눈을 가진 궁수. 그의 화살은 빗나가지 않는다.' }),
  bard:        SP({ name: '음유시인',   tier: 2, from: 'porter',     base: { str: 6, vit: 7, agi: 6, int: 7 },   grow: { str: 1.1, vit: 1.4, agi: 1.3, int: 1.5 }, spd: 1.0,  crit: 0.06, carry: 22, salary: 220, act: 'arrow', innate: 'ballad',      tunic: '#8a3a6a', trim: '#f0c24a', tr: { aura: 0.08 }, desc: '노래로 동료의 힘을 북돋운다. 함께 다니는 파티 모두의 공격력이 오른다.' }),
  maestro:     SP({ name: '마에스트로', tier: 3, from: 'bard',       base: { str: 8, vit: 9, agi: 8, int: 10 }, grow: { str: 1.4, vit: 1.7, agi: 1.6, int: 2.0 }, spd: 1.0,  crit: 0.08, carry: 24, salary: 290, act: 'arrow', innate: 'symphony',    tunic: '#5a2a6a', trim: '#fff2c0', tr: { aura: 0.15 }, desc: '전설의 노래꾼. 그가 부르면 전장 전체가 춤춘다.' }),
  mhunter:     SP({ name: '괴물사냥꾼', tier: 2, from: 'archer',     base: { str: 7, vit: 6, agi: 9, int: 2 },   grow: { str: 1.4, vit: 1.3, agi: 2.1, int: 0.3 }, spd: 0.95, crit: 0.12, carry: 12, salary: 230, act: 'arrow', innate: 'huntmark',    tunic: '#5a4a2a', trim: '#c8b080', tr: { bossDmg: 1.2, drop: 0.25 }, desc: '몬스터의 급소와 가죽 벗기는 법을 안다. 보스에게 강하고 부속품을 더 챙긴다.' }),
  dslayer:     SP({ name: '드래곤 슬레이어', tier: 3, from: 'mhunter', base: { str: 10, vit: 8, agi: 12, int: 3 }, grow: { str: 1.9, vit: 1.6, agi: 2.5, int: 0.4 }, spd: 1.0,  crit: 0.15, carry: 12, salary: 300, act: 'arrow', innate: 'dragonpierce', tunic: '#3a2a2a', trim: '#e05a3a', tr: { bossDmg: 1.5, drop: 0.35, pen: 0.2 }, desc: '용을 잡은 사냥꾼. 어떤 거대한 몬스터도 사냥감일 뿐이다.' }),
  // ── 도적 ──
  assassin:    SP({ name: '암살자',     tier: 2, from: 'rogue',      base: { str: 7, vit: 5, agi: 10, int: 2 },  grow: { str: 1.5, vit: 1.0, agi: 2.3, int: 0.3 }, spd: 1.35, crit: 0.2,  salary: 230, act: 'melee', innate: 'assassinate', tunic: '#2a2a32', trim: '#a83a3a', tr: { first: 2.0 }, desc: '싸움이 시작되자마자 급소를 꿰뚫는다. 첫 공격은 반드시 치명타.' }),
  shadowlord:  SP({ name: '그림자 군주', tier: 3, from: 'assassin',  base: { str: 10, vit: 7, agi: 13, int: 4 }, grow: { str: 2.0, vit: 1.3, agi: 2.7, int: 0.5 }, spd: 1.45, crit: 0.25, salary: 300, act: 'melee', innate: 'shadowstep',  tunic: '#1a1426', trim: '#8a4ad8', tr: { first: 3.0 }, desc: '밤과 그림자를 다스리는 암살자들의 군주.' }),
  duelist:     SP({ name: '쌍검사',     tier: 2, from: 'rogue',      base: { str: 7, vit: 6, agi: 9, int: 1 },   grow: { str: 1.5, vit: 1.2, agi: 2.0, int: 0.2 }, spd: 1.25, crit: 0.12, salary: 230, act: 'melee', innate: 'twinslash',   tunic: '#3a5a6a', trim: '#e8e2d0', tr: { double: 0.6 }, desc: '두 자루 칼로 한 번에 두 번 벤다.' }),
  bladedancer: SP({ name: '검무사',     tier: 3, from: 'duelist',    base: { str: 9, vit: 8, agi: 12, int: 2 },  grow: { str: 1.9, vit: 1.5, agi: 2.5, int: 0.3 }, spd: 1.35, crit: 0.16, salary: 300, act: 'melee', innate: 'bladewaltz',  tunic: '#2a4a5a', trim: '#7ae0e0', tr: { double: 0.75 }, desc: '칼날의 춤. 한 번 휘두를 때마다 두 줄기 칼바람이 인다.' }),
  treasure:    SP({ name: '보물 사냥꾼', tier: 2, from: 'rogue',     base: { str: 6, vit: 6, agi: 9, int: 3 },   grow: { str: 1.2, vit: 1.2, agi: 2.0, int: 0.5 }, spd: 1.2,  crit: 0.12, carry: 16, salary: 220, act: 'melee', innate: 'pilfer',      tunic: '#7a5a2a', trim: '#f0c24a', tr: { luck: 0.15 }, desc: '몬스터의 보물을 귀신같이 찾아낸다. 파티의 전리품과 금화가 는다.' }),
  masterthief: SP({ name: '대도',       tier: 3, from: 'treasure',   base: { str: 8, vit: 7, agi: 12, int: 4 },  grow: { str: 1.6, vit: 1.4, agi: 2.5, int: 0.6 }, spd: 1.3,  crit: 0.16, carry: 18, salary: 290, act: 'melee', innate: 'grandheist',  tunic: '#4a3a1a', trim: '#ffe08a', tr: { luck: 0.3 }, desc: '훔치지 못한 것이 없는 전설의 도둑. 파티의 전리품과 금화가 크게 는다.' }),
  // ── 법사 ──
  elementalist: SP({ name: '정령술사',  tier: 2, from: 'mage',       base: { str: 2, vit: 5, agi: 5, int: 10 },  grow: { str: 0.3, vit: 1.0, agi: 0.9, int: 2.6 }, spd: 0.8,  crit: 0.05, carry: 8, salary: 230, act: 'magic', innate: 'windspirit',  tunic: '#2f7a5a', trim: '#9ae0b0', tr: { aoe: 0.2 }, desc: '정령의 힘으로 여러 적을 한꺼번에 공격한다. 광역 마법이 더 세다.' }),
  elementlord: SP({ name: '정령왕',     tier: 3, from: 'elementalist', base: { str: 3, vit: 6, agi: 6, int: 13 }, grow: { str: 0.3, vit: 1.2, agi: 1.0, int: 3.0 }, spd: 0.82, crit: 0.06, carry: 8, salary: 300, act: 'magic', innate: 'spiritking',  tunic: '#1f5a7a', trim: '#c8ffd8', tr: { aoe: 0.35 }, desc: '모든 정령이 그 이름에 고개를 숙인다.' }),
  necromancer: SP({ name: '네크로맨서', tier: 2, from: 'mage',       base: { str: 2, vit: 5, agi: 4, int: 11 },  grow: { str: 0.3, vit: 1.1, agi: 0.8, int: 2.7 }, spd: 0.78, crit: 0.05, carry: 8, salary: 240, act: 'magic', innate: 'drain',       tunic: '#2a2234', trim: '#a87ad8', tr: { mdrain: 0.08 }, desc: '죽음의 마법으로 적의 생명을 빼앗는다. 마법 피해의 일부만큼 회복한다.' }),
  lich:        SP({ name: '리치',       tier: 3, from: 'necromancer', base: { str: 2, vit: 6, agi: 4, int: 14 }, grow: { str: 0.3, vit: 1.3, agi: 0.8, int: 3.1 }, spd: 0.8,  crit: 0.06, carry: 8, salary: 300, act: 'magic', innate: 'soulrend',    tunic: '#1a1424', trim: '#7af0c8', tr: { mdrain: 0.15 }, desc: '죽음을 넘어선 마법사. 빼앗은 생명으로 영원히 산다.' }),
  spellblade:  SP({ name: '마검사',     tier: 2, from: 'warrior',    base: { str: 8, vit: 7, agi: 4, int: 6 },   grow: { str: 1.6, vit: 1.5, agi: 0.7, int: 1.4 }, spd: 0.95, crit: 0.08, salary: 230, act: 'melee', innate: 'flameblade',  tunic: '#5a2a2a', trim: '#f08a3c', tr: { hybrid: 0.5 }, desc: '검에 마법을 실어 벤다. 기본 공격에 마법 피해가 더해진다.' }),
  arcblade:    SP({ name: '마검성',     tier: 3, from: 'spellblade', base: { str: 9, vit: 8, agi: 7, int: 10 },  grow: { str: 1.9, vit: 1.5, agi: 1.3, int: 2.0 }, spd: 1.0,  crit: 0.1,  salary: 300, act: 'melee', innate: 'starblade',   tunic: '#3a1a4a', trim: '#c89aff', tr: { hybrid: 0.8 }, desc: '검과 마법의 정점에 선 자.' }),
  // ── 성직자 ──
  priest:      SP({ name: '사제',       tier: 2, from: 'cleric',     base: { str: 3, vit: 6, agi: 4, int: 10 },  grow: { str: 0.5, vit: 1.4, agi: 0.7, int: 2.4 }, spd: 0.8,  crit: 0.03, carry: 8, salary: 220, act: 'heal', innate: 'prayer',       tunic: '#f0ece0', trim: '#5a8ad8', tr: { healPow: 1.25 }, desc: '치유의 기도에 전념한다. 치유량이 크게 오른다.' }),
  archbishop:  SP({ name: '대주교',     tier: 3, from: 'priest',     base: { str: 4, vit: 7, agi: 5, int: 13 },  grow: { str: 0.6, vit: 1.6, agi: 0.8, int: 2.9 }, spd: 0.82, crit: 0.04, carry: 8, salary: 290, act: 'heal', innate: 'miracle',      tunic: '#fff8e8', trim: '#d9b44a', tr: { healPow: 1.5 }, desc: '기적을 부르는 대성당의 주인.' }),
  plaguedoc:   SP({ name: '역병의사',   tier: 2, from: 'cleric',     base: { str: 3, vit: 6, agi: 5, int: 9 },   grow: { str: 0.4, vit: 1.3, agi: 1.0, int: 2.2 }, spd: 0.85, crit: 0.06, carry: 9, salary: 240, act: 'heal', innate: 'miasma',       tunic: '#2a2a2e', trim: '#c8b890', tr: { dot: 1.4 }, desc: '독 안개로 적을 약하게 하고 동료를 치료한다. 신전에서 수술을 할 수 있다.' }),
  physician:   SP({ name: '명의',       tier: 3, from: 'plaguedoc',  base: { str: 4, vit: 7, agi: 6, int: 12 },  grow: { str: 0.5, vit: 1.5, agi: 1.2, int: 2.7 }, spd: 0.85, crit: 0.07, carry: 9, salary: 290, act: 'heal', innate: 'cureall',      tunic: '#1e1e24', trim: '#e8dcb8', tr: { dot: 1.8, healPow: 1.2 }, desc: '살리지 못한 환자가 없다는 전설의 의사. 신전에서 수술을 한다.' }),
  exorcist:    SP({ name: '퇴마사',     tier: 2, from: 'cleric',     base: { str: 5, vit: 6, agi: 5, int: 9 },   grow: { str: 1.0, vit: 1.3, agi: 1.0, int: 2.0 }, spd: 0.85, crit: 0.06, salary: 230, act: 'magic', innate: 'banish',      tunic: '#e8e0f0', trim: '#8a5ad8', tr: { bossDmg: 1.25 }, desc: '악령과 마물을 쫓아낸다. 보스에게 특히 강하다.' }),
  inquisitor:  SP({ name: '심판관',     tier: 3, from: 'exorcist',   base: { str: 7, vit: 8, agi: 6, int: 12 },  grow: { str: 1.3, vit: 1.6, agi: 1.2, int: 2.6 }, spd: 0.88, crit: 0.08, salary: 300, act: 'magic', innate: 'verdict',     tunic: '#5a1a2a', trim: '#f0d870', tr: { bossDmg: 1.45 }, desc: '신의 이름으로 심판을 내린다.' })
});
// 전직 길: 기본 직업 → 2차(셋 중 하나) → 3차 (짐꾼은 짐꾼 그대로)
const JOB_TREE = {};
Object.entries(CLASSES).forEach(([id, C]) => { if (C.from) (JOB_TREE[C.from] = JOB_TREE[C.from] || []).push(id); });
const JOB_PARENT = Object.fromEntries(Object.entries(CLASSES).filter(([, C]) => C.from).map(([id, C]) => [id, C.from]));
const jobTier = c => CLASSES[c].tier || 1;
const chainOf = c => { const out = [c]; while (JOB_PARENT[out[out.length - 1]]) out.push(JOB_PARENT[out[out.length - 1]]); return out; };
const jobBase = c => chainOf(c).pop();
const nextJobs = c => JOB_TREE[c] || [];
const JOB_REQ = { 2: { lv: 20, rank: 1, fee: 2000 }, 3: { lv: 50, rank: 2, fee: 8000 } };
const jobName = c => CLASSES[c].name + (jobTier(c) > 1 ? ` (${jobTier(c)}차)` : '');
const TR = a => (CLASSES[a.cls] && CLASSES[a.cls].tr) || {};
const CLASS_IDS = Object.keys(CLASSES).filter(k => !CLASSES[k].special);   // 여관에 무작위로 오는 직업
const ALL_CLASS_IDS = Object.keys(CLASSES);
const MAX_SKILLS = 4;   // 기본 스킬 칸. LV30·50·70·90·100마다 한 칸씩 늘어난다
const MAX_LV = 100;
const SKILL_SLOT_LV = [30, 50, 70, 90, 100];
const skillSlots = a => MAX_SKILLS + SKILL_SLOT_LV.filter(l => a.lv >= l).length + (a.hero ? 1 : 0);   // 용사는 각성기 칸이 따로

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
  // ── v0.7: 기본 직업 고레벨 스킬북 ──
  earthsplit:  { name: '대지 가르기', cls: ['warrior'], lv: 32, cost: { mp: 22 }, cd: 10, kind: 'dmg', mult: 1.6, tgt: 'all', desc: '땅을 내리쳐 모든 적을 벤다.' },
  warcry:      { name: '전쟁의 함성', cls: ['warrior'], lv: 45, cost: { mp: 26 }, cd: 20, kind: 'buff', stat: 'atk', mult: 1.3, dur: 10, tgt: 'party', desc: '10초 동안 파티의 공격력을 올린다.' },
  guardian:    { name: '수호자', cls: ['warrior'], lv: 60, passive: { hpPct: 0.15 }, desc: '최대 HP가 15% 오른다.' },
  titanblow:   { name: '거인의 일격', cls: ['warrior'], lv: 75, cost: { mp: 40 }, cd: 14, kind: 'dmg', mult: 4.2, boss: 1.3, tgt: 'front', desc: '모든 힘을 실어 내리친다. 보스에게 더 아프다.' },
  piercing:    { name: '관통 사격', cls: ['archer'], lv: 30, cost: { mp: 20 }, cd: 9, kind: 'dmg', mult: 1.4, tgt: 'all', fx: 'arrow', desc: '모든 적을 꿰뚫는 화살을 쏜다.' },
  eagleeye:    { name: '매의 눈', cls: ['archer'], lv: 40, passive: { crit: 0.08 }, desc: '치명타 확률이 8%p 오른다.' },
  tripleshot:  { name: '삼연사', cls: ['archer'], lv: 55, cost: { mp: 28 }, cd: 8, kind: 'dmg', mult: 1.2, hits: 3, tgt: 'low', fx: 'arrow', desc: '약한 적에게 화살 세 발을 쏜다.' },
  stormarrows: { name: '폭풍 화살', cls: ['archer'], lv: 75, cost: { mp: 45 }, cd: 14, kind: 'dmg', mult: 2.2, tgt: 'all', fx: 'arrow', desc: '하늘을 덮는 화살을 퍼붓는다.' },
  quickstep:   { name: '잰걸음', cls: ['rogue'], lv: 30, passive: { eva: 0.06 }, desc: '회피율이 6%p 오른다.' },
  deadlyvenom: { name: '맹독', cls: ['rogue'], lv: 42, cost: { mp: 24 }, cd: 10, kind: 'dot', mult: 1.2, dur: 8, tgt: 'front', desc: '8초 동안 강한 독 피해를 준다.' },
  blades:      { name: '칼날 폭풍', cls: ['rogue'], lv: 58, cost: { mp: 32 }, cd: 12, kind: 'dmg', mult: 1.5, hits: 2, tgt: 'all', desc: '칼날을 휘둘러 모든 적을 두 번 벤다.' },
  vital:       { name: '급소 노리기', cls: ['rogue'], lv: 75, passive: { crit: 0.1 }, desc: '치명타 확률이 10%p 오른다.' },
  meteor:      { name: '운석 낙하', cls: ['mage'], lv: 35, cost: { mp: 40 }, cd: 14, kind: 'mdmg', mult: 2.4, tgt: 'all', fx: 'fire', desc: '하늘에서 운석을 떨어뜨린다.' },
  manashield:  { name: '마나 보호막', cls: ['mage'], lv: 45, cost: { mp: 24 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.8, dur: 8, tgt: 'self', desc: '8초 동안 방어력이 크게 오른다.' },
  blizzard:    { name: '눈보라', cls: ['mage'], lv: 60, cost: { mp: 45 }, cd: 12, kind: 'mdmg', mult: 1.8, slow: 4, tgt: 'all', fx: 'ice', desc: '모든 적을 얼리고 느리게 한다.' },
  arcane:      { name: '비전 숙련', cls: ['mage'], lv: 75, passive: { matkPct: 0.15 }, desc: '마법 피해와 치유량이 15% 오른다.' },
  sanctuary:   { name: '성역', cls: ['cleric'], lv: 32, cost: { mp: 30 }, cd: 20, kind: 'buff', stat: 'def', mult: 1.4, dur: 10, tgt: 'party', desc: '10초 동안 파티의 방어력을 올린다.' },
  greatheal:   { name: '대치유', cls: ['cleric'], lv: 45, cost: { mp: 30 }, cd: 6, kind: 'heal', mult: 4.0, tgt: 'low', desc: '가장 다친 동료를 크게 치료한다.' },
  smite:       { name: '천벌', cls: ['cleric'], lv: 60, cost: { mp: 32 }, cd: 9, kind: 'mdmg', mult: 3.0, boss: 1.5, tgt: 'front', fx: 'holy', desc: '하늘의 벌을 내린다. 보스에게 더 아프다.' },
  revival:     { name: '생명의 축복', cls: ['cleric'], lv: 78, cost: { mp: 55 }, cd: 14, kind: 'heal', mult: 2.2, tgt: 'party', desc: '파티 전원을 크게 치료한다.' },
  packmule:    { name: '짐 노새', cls: ['porter'], lv: 30, passive: { carryPct: 0.3 }, desc: '들 수 있는 짐이 30% 더 늘어난다.' },
  shieldbag:   { name: '짐 방패', cls: ['porter'], lv: 45, cost: { mp: 18 }, cd: 16, kind: 'buff', stat: 'def', mult: 2.0, dur: 8, tgt: 'self', desc: '짐을 방패 삼아 8초 동안 방어력이 두 배가 된다.' },
  avalanche:   { name: '짐 사태', cls: ['porter'], lv: 65, cost: { mp: 28 }, cd: 12, kind: 'dmg', mult: 1.6, tgt: 'all', desc: '짐을 쏟아 모든 적을 덮친다.' },
  toughness:   { name: '강인함', cls: ['all'], lv: 25, passive: { hpPct: 0.08 }, desc: '최대 HP가 8% 오른다.' },
  focus:       { name: '집중', cls: ['all'], lv: 40, passive: { crit: 0.03 }, desc: '치명타 확률이 3%p 오른다.' },
  secondwind:  { name: '재기', cls: ['all'], lv: 55, cost: { mp: 20 }, cd: 30, kind: 'heal', tgt: 'self', pct: 0.3, desc: '최대 HP의 30%를 회복한다.' },
  // ── 2차·3차 직업 스킬 (own: 스킬북 없이 훈련소에서 배운다. 3차는 2차·기본 직업 스킬도 배울 수 있다) ──
  // 검투사 → 챔피언
  arena:       { name: '투기장 일격', cls: ['gladiator'], lv: 1, cost: { mp: 6 }, cd: 4, kind: 'dmg', mult: 2.0, crit: 0.25, tgt: 'front', desc: '관중을 열광시키는 일격. 치명타가 잘 터진다.' },
  parry:       { name: '흘려 받기', cls: ['gladiator'], lv: 22, own: 1, cost: { mp: 8 }, cd: 12, kind: 'buff', stat: 'eva', add: 0.3, dur: 6, tgt: 'self', desc: '6초 동안 회피율이 크게 오른다.' },
  roar:        { name: '관중의 함성', cls: ['gladiator'], lv: 28, own: 1, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'atk', mult: 1.25, dur: 8, tgt: 'party', desc: '8초 동안 파티의 공격력을 올린다.' },
  execute:     { name: '처형', cls: ['gladiator'], lv: 36, own: 1, cost: { mp: 16 }, cd: 12, kind: 'dmg', mult: 3.2, tgt: 'low', desc: '가장 약한 적에게 결정타를 날린다.' },
  spinslash:   { name: '회전 베기', cls: ['gladiator'], lv: 48, own: 1, cost: { mp: 18 }, cd: 9, kind: 'dmg', mult: 1.6, tgt: 'all', desc: '빙글 돌며 모든 적을 벤다.' },
  glory:       { name: '영광의 일격', cls: ['champion'], lv: 1, cost: { mp: 12 }, cd: 4, kind: 'dmg', mult: 3.0, crit: 0.4, tgt: 'front', desc: '챔피언의 일격. 치명타가 아주 잘 터진다.' },
  crowd:       { name: '관중의 환호', cls: ['champion'], lv: 60, own: 1, passive: { atkPct: 0.15 }, desc: '공격력이 15% 오른다.' },
  finale:      { name: '피날레', cls: ['champion'], lv: 75, own: 1, cost: { mp: 36 }, cd: 16, kind: 'dmg', mult: 5.0, crit: 0.5, tgt: 'front', desc: '관중이 숨을 멈추는 마지막 일격.' },
  colosseum:   { name: '콜로세움', cls: ['champion'], lv: 95, own: 1, cost: { mp: 60 }, cd: 20, kind: 'dmg', mult: 4.0, crit: 0.3, tgt: 'all', desc: '경기장 전체를 휩쓰는 전설의 기술.' },
  // 기사 → 성기사
  shieldbash:  { name: '방패 치기', cls: ['knight'], lv: 1, cost: { mp: 6 }, cd: 4, kind: 'dmg', mult: 1.6, tgt: 'front', desc: '방패로 앞의 적을 후려친다.' },
  provoke:     { name: '도발', cls: ['knight'], lv: 22, own: 1, cost: { mp: 10 }, cd: 12, kind: 'taunt', dur: 7, desc: '7초 동안 모든 적이 자신만 노리게 한다.' },
  fortress:    { name: '요새', cls: ['knight'], lv: 28, own: 1, cost: { mp: 14 }, cd: 16, kind: 'buff', stat: 'def', mult: 2.2, dur: 8, tgt: 'self', desc: '8초 동안 방어력이 두 배 넘게 오른다.' },
  rally:       { name: '결집', cls: ['knight'], lv: 36, own: 1, cost: { mp: 18 }, cd: 18, kind: 'buff', stat: 'def', mult: 1.35, dur: 10, tgt: 'party', desc: '10초 동안 파티의 방어력을 올린다.' },
  lancecharge: { name: '돌격', cls: ['knight'], lv: 48, own: 1, cost: { mp: 24 }, cd: 12, kind: 'dmg', mult: 3.0, tgt: 'front', desc: '창을 꼬나쥐고 돌진한다.' },
  holystrike:  { name: '성스러운 일격', cls: ['paladin'], lv: 1, cost: { mp: 7 }, cd: 4, kind: 'dmg', mult: 1.7, boss: 1.4, tgt: 'front', fx: 'holy', desc: '빛을 두른 검으로 벤다. 보스에게 더 아프다.' },
  guard:       { name: '수호의 맹세', cls: ['paladin'], lv: 55, own: 1, cost: { mp: 10 }, cd: 12, kind: 'taunt', dur: 7, desc: '7초 동안 모든 적이 자신만 노리게 한다.' },
  layhands:    { name: '치유의 손길', cls: ['paladin'], lv: 60, own: 1, cost: { mp: 12 }, cd: 7, kind: 'heal', mult: 2.5, tgt: 'low', desc: '가장 다친 동료를 크게 치료한다.' },
  judgment:    { name: '천상의 심판', cls: ['paladin'], lv: 66, own: 1, cost: { mp: 22 }, cd: 12, kind: 'mdmg', mult: 1.7, boss: 1.4, tgt: 'all', fx: 'holy', desc: '하늘의 빛이 모든 적을 내리친다.' },
  aegis:       { name: '신성한 방패', cls: ['paladin'], lv: 75, own: 1, cost: { mp: 34 }, cd: 18, kind: 'buff', stat: 'def', mult: 1.6, dur: 10, tgt: 'party', desc: '10초 동안 파티를 빛의 방패로 감싼다.' },
  devotion:    { name: '헌신', cls: ['paladin'], lv: 85, own: 1, passive: { hpPct: 0.2 }, desc: '최대 HP가 20% 오른다.' },
  divinity:    { name: '신의 강림', cls: ['paladin'], lv: 95, own: 1, cost: { mp: 60 }, cd: 20, kind: 'mdmg', mult: 5.0, boss: 1.5, tgt: 'all', fx: 'holy', desc: '신의 빛이 모든 적을 내리친다.' },
  // 광전사 → 피의 군주
  bloodstrike: { name: '피의 일격', cls: ['berserker'], lv: 1, cost: { hp: 0.05 }, cd: 3.5, kind: 'dmg', mult: 2.3, tgt: 'front', desc: 'HP를 조금 깎아 강하게 내리친다.' },
  whirl:       { name: '회전 도끼', cls: ['berserker'], lv: 22, own: 1, cost: { mp: 8 }, cd: 7, kind: 'dmg', mult: 1.3, tgt: 'all', desc: '도끼를 휘둘러 모든 적을 벤다.' },
  bloodthirst: { name: '피의 갈증', cls: ['berserker'], lv: 28, own: 1, cost: { mp: 10 }, cd: 14, kind: 'heal', tgt: 'self', pct: 0.25, desc: '최대 HP의 25%를 회복한다.' },
  rampage:     { name: '폭주', cls: ['berserker'], lv: 36, own: 1, cost: { hp: 0.2 }, cd: 20, kind: 'buff', stat: 'atk', mult: 1.9, dur: 8, tgt: 'self', desc: 'HP를 크게 깎아 8초 동안 공격력이 거의 두 배가 된다.' },
  frenzy:      { name: '광란', cls: ['berserker'], lv: 48, own: 1, passive: { spdPct: 0.15 }, desc: '공격속도가 15% 빨라진다.' },
  bloodfeast:  { name: '피의 만찬', cls: ['bloodlord'], lv: 1, cost: { hp: 0.05 }, cd: 3.5, kind: 'dmg', mult: 3.2, drain: 0.3, tgt: 'front', desc: '베어 낸 피를 그대로 마신다.' },
  bloodlust:   { name: '끝없는 갈증', cls: ['bloodlord'], lv: 60, own: 1, passive: { atkPct: 0.2 }, desc: '공격력이 20% 오른다.' },
  bloodmoon:   { name: '핏빛 달', cls: ['bloodlord'], lv: 75, own: 1, cost: { hp: 0.2 }, cd: 22, kind: 'buff', stat: 'atk', mult: 2.0, dur: 8, tgt: 'self', desc: 'HP를 바쳐 8초 동안 공격력이 두 배가 된다.' },
  ragnarok:    { name: '라그나로크', cls: ['bloodlord'], lv: 95, own: 1, cost: { hp: 0.25 }, cd: 20, kind: 'dmg', mult: 4.5, tgt: 'all', desc: 'HP를 크게 깎아 세상을 끝낼 듯 휘두른다.' },
  // 레인저 → 용기병
  beastshot:   { name: '짐승 사냥', cls: ['ranger'], lv: 1, cost: { mp: 7 }, cd: 4, kind: 'dmg', mult: 2.0, crit: 0.2, boss: 1.2, tgt: 'low', fx: 'arrow', desc: '사냥감의 숨통을 노려 쏜다.' },
  trap:        { name: '덫 놓기', cls: ['ranger'], lv: 22, own: 1, cost: { mp: 12 }, cd: 10, kind: 'dot', mult: 0.9, dur: 6, slow: 4, tgt: 'front', desc: '덫에 걸린 적은 6초 동안 피해를 입고 느려진다.' },
  wolfcall:    { name: '늑대 부르기', cls: ['ranger'], lv: 28, own: 1, cost: { mp: 18 }, cd: 10, kind: 'dmg', mult: 1.2, hits: 2, tgt: 'all', desc: '늑대 떼가 모든 적을 물어뜯는다.' },
  camouflage:  { name: '위장', cls: ['ranger'], lv: 36, own: 1, cost: { mp: 14 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.3, dur: 8, tgt: 'self', desc: '8초 동안 회피율이 크게 오른다.' },
  instinct:    { name: '사냥꾼의 감', cls: ['ranger'], lv: 42, own: 1, passive: { crit: 0.06 }, desc: '치명타 확률이 6%p 오른다.' },
  arrowstorm:  { name: '화살 폭우', cls: ['ranger'], lv: 48, own: 1, cost: { mp: 34 }, cd: 12, kind: 'dmg', mult: 2.0, tgt: 'all', fx: 'arrow', desc: '모든 적에게 화살비를 쏟는다.' },
  jump:        { name: '도약 찌르기', cls: ['dragoon'], lv: 1, cost: { mp: 7 }, cd: 5, kind: 'dmg', mult: 2.4, tgt: 'low', fx: 'jump', desc: '뛰어올라 약한 적을 창으로 꿰뚫는다.' },
  dragonscale: { name: '용의 비늘', cls: ['dragoon'], lv: 55, own: 1, passive: { defPct: 0.15 }, desc: '방어력이 15% 오른다.' },
  gale:        { name: '창 돌풍', cls: ['dragoon'], lv: 62, own: 1, cost: { mp: 14 }, cd: 9, kind: 'dmg', mult: 1.6, tgt: 'all', desc: '창을 휘둘러 모든 적을 찌른다.' },
  skyfall:     { name: '하늘 낙하', cls: ['dragoon'], lv: 68, own: 1, cost: { mp: 20 }, cd: 14, kind: 'dmg', mult: 4.0, boss: 1.3, tgt: 'front', fx: 'jump', desc: '높이 솟구쳤다가 내리꽂는다. 보스에게 특히 아프다.' },
  wyvernfall:  { name: '와이번 강하', cls: ['dragoon'], lv: 75, own: 1, cost: { mp: 34 }, cd: 12, kind: 'dmg', mult: 2.6, tgt: 'all', fx: 'jump', desc: '길들인 와이번과 함께 내리꽂힌다.' },
  dragonblood: { name: '용의 피', cls: ['dragoon'], lv: 85, own: 1, passive: { hpPct: 0.2 }, desc: '최대 HP가 20% 오른다.' },
  dragonfall:  { name: '용의 낙하', cls: ['dragoon'], lv: 95, own: 1, cost: { mp: 50 }, cd: 18, kind: 'dmg', mult: 7.0, boss: 1.5, tgt: 'front', fx: 'jump', desc: '하늘 끝에서 떨어지며 꿰뚫는다. 보스에게 특히 아프다.' },
  // 저격수 → 신궁
  headshot:    { name: '헤드샷', cls: ['sniper'], lv: 1, cost: { mp: 8 }, cd: 5, kind: 'dmg', mult: 2.6, crit: 0.3, tgt: 'front', fx: 'arrow', desc: '머리를 노려 쏜다.' },
  steadyaim:   { name: '정조준', cls: ['sniper'], lv: 22, own: 1, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'atk', mult: 1.5, dur: 8, tgt: 'self', desc: '숨을 고르고 8초 동안 공격력을 올린다.' },
  longshot:    { name: '원거리 사격', cls: ['sniper'], lv: 28, own: 1, cost: { mp: 16 }, cd: 8, kind: 'dmg', mult: 3.0, tgt: 'low', fx: 'arrow', desc: '멀리 있는 약한 적을 저격한다.' },
  piercearrow: { name: '철갑 화살', cls: ['sniper'], lv: 36, own: 1, cost: { mp: 20 }, cd: 10, kind: 'dmg', mult: 3.6, boss: 1.3, tgt: 'front', fx: 'arrow', desc: '단단한 껍질도 꿰뚫는 화살.' },
  deadeye:     { name: '데드아이', cls: ['sniper'], lv: 48, own: 1, passive: { crit: 0.1 }, desc: '치명타 확률이 10%p 오른다.' },
  divinearrow: { name: '신궁의 화살', cls: ['hawkeye'], lv: 1, cost: { mp: 14 }, cd: 5, kind: 'dmg', mult: 4.0, crit: 0.4, tgt: 'front', fx: 'arrow', desc: '빗나가지 않는 신의 화살.' },
  starfall:    { name: '별똥별 화살', cls: ['hawkeye'], lv: 60, own: 1, cost: { mp: 36 }, cd: 12, kind: 'dmg', mult: 2.8, tgt: 'all', fx: 'arrow', desc: '하늘에서 별처럼 화살이 쏟아진다.' },
  godseye:     { name: '신의 눈', cls: ['hawkeye'], lv: 75, own: 1, passive: { crit: 0.12 }, desc: '치명타 확률이 12%p 오른다.' },
  lastarrow:   { name: '심판의 화살', cls: ['hawkeye'], lv: 95, own: 1, cost: { mp: 60 }, cd: 20, kind: 'dmg', mult: 9.0, boss: 1.5, tgt: 'front', fx: 'arrow', desc: '단 한 발로 거대한 적을 꿰뚫는다.' },
  // 음유시인 → 마에스트로
  ballad:      { name: '용기의 노래', cls: ['bard'], lv: 1, cost: { mp: 10 }, cd: 12, kind: 'buff', stat: 'atk', mult: 1.2, dur: 8, tgt: 'party', desc: '8초 동안 파티의 공격력을 올린다.' },
  lullaby:     { name: '자장가', cls: ['bard'], lv: 22, own: 1, cost: { mp: 14 }, cd: 10, kind: 'mdmg', mult: 0.8, slow: 4, tgt: 'all', desc: '모든 적을 졸리게 해 느려지게 한다.' },
  hymn:        { name: '치유의 찬가', cls: ['bard'], lv: 28, own: 1, cost: { mp: 18 }, cd: 9, kind: 'heal', mult: 0.9, tgt: 'party', desc: '노래로 파티 전원을 치료한다.' },
  marchsong:   { name: '행진곡', cls: ['bard'], lv: 36, own: 1, cost: { mp: 16 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.15, dur: 8, tgt: 'party', desc: '8초 동안 파티의 회피율을 올린다.' },
  warsong:     { name: '전쟁가', cls: ['bard'], lv: 48, own: 1, cost: { mp: 26 }, cd: 18, kind: 'buff', stat: 'atk', mult: 1.35, dur: 10, tgt: 'party', desc: '10초 동안 파티의 공격력을 크게 올린다.' },
  symphony:    { name: '교향곡', cls: ['maestro'], lv: 1, cost: { mp: 16 }, cd: 14, kind: 'buff', stat: 'atk', mult: 1.3, dur: 10, tgt: 'party', desc: '10초 동안 파티의 공격력을 올린다.' },
  requiem:     { name: '진혼곡', cls: ['maestro'], lv: 60, own: 1, cost: { mp: 34 }, cd: 12, kind: 'mdmg', mult: 2.5, tgt: 'all', desc: '적의 영혼을 잠재우는 노래.' },
  overture:    { name: '서곡', cls: ['maestro'], lv: 75, own: 1, cost: { mp: 40 }, cd: 14, kind: 'heal', mult: 2.0, tgt: 'party', desc: '파티 전원을 크게 치료한다.' },
  grandfinale: { name: '장엄한 피날레', cls: ['maestro'], lv: 95, own: 1, cost: { mp: 60 }, cd: 24, kind: 'buff', stat: 'atk', mult: 1.8, dur: 10, tgt: 'party', desc: '10초 동안 파티의 공격력이 크게 오른다.' },
  // 암살자 → 그림자 군주
  assassinate: { name: '암살', cls: ['assassin'], lv: 1, cost: { mp: 7 }, cd: 4, kind: 'dmg', mult: 2.4, crit: 1, tgt: 'low', desc: '약한 적의 급소를 반드시 찌른다.' },
  poisonblade: { name: '독날', cls: ['assassin'], lv: 22, own: 1, cost: { mp: 12 }, cd: 8, kind: 'dot', mult: 1.0, dur: 6, tgt: 'front', desc: '독을 바른 칼날로 6초 동안 독 피해를 준다.' },
  vanish:      { name: '은신', cls: ['assassin'], lv: 28, own: 1, cost: { mp: 14 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.4, dur: 6, tgt: 'self', desc: '6초 동안 그림자에 숨는다.' },
  throatcut:   { name: '목 긋기', cls: ['assassin'], lv: 36, own: 1, cost: { mp: 20 }, cd: 9, kind: 'dmg', mult: 3.2, crit: 0.3, tgt: 'low', desc: '단숨에 숨통을 끊는다.' },
  shadowclone: { name: '분신술', cls: ['assassin'], lv: 48, own: 1, cost: { mp: 26 }, cd: 12, kind: 'dmg', mult: 1.0, hits: 4, tgt: 'front', desc: '분신들과 함께 네 번 벤다.' },
  killer:      { name: '살수의 본능', cls: ['assassin'], lv: 52, own: 1, passive: { crit: 0.1 }, desc: '치명타 확률이 10%p 오른다.' },
  shadowstep:  { name: '그림자 걸음', cls: ['shadowlord'], lv: 1, cost: { mp: 9 }, cd: 4, kind: 'dmg', mult: 2.8, crit: 0.5, tgt: 'low', desc: '그림자를 밟고 나타나 벤다.' },
  nightfall:   { name: '밤의 장막', cls: ['shadowlord'], lv: 60, own: 1, cost: { mp: 26 }, cd: 18, kind: 'buff', stat: 'eva', add: 0.25, dur: 8, tgt: 'party', desc: '8초 동안 파티를 어둠으로 감싼다.' },
  shadowstorm: { name: '그림자 폭풍', cls: ['shadowlord'], lv: 66, own: 1, cost: { mp: 32 }, cd: 10, kind: 'dmg', mult: 2.2, hits: 2, tgt: 'all', desc: '그림자 칼날이 모든 적을 두 번 벤다.' },
  soulreap:    { name: '영혼 수확', cls: ['shadowlord'], lv: 75, own: 1, cost: { mp: 36 }, cd: 12, kind: 'dmg', mult: 4.0, drain: 0.3, tgt: 'front', desc: '적의 영혼을 거두어 HP를 채운다.' },
  darkness:    { name: '어둠의 군주', cls: ['shadowlord'], lv: 85, own: 1, passive: { atkPct: 0.15 }, desc: '공격력이 15% 오른다.' },
  eclipse:     { name: '일식', cls: ['shadowlord'], lv: 95, own: 1, cost: { mp: 60 }, cd: 20, kind: 'dmg', mult: 5.0, crit: 0.4, tgt: 'all', desc: '해를 가리는 어둠이 모든 적을 덮친다.' },
  // 쌍검사 → 검무사
  twinslash:   { name: '쌍칼 베기', cls: ['duelist'], lv: 1, cost: { mp: 6 }, cd: 3.5, kind: 'dmg', mult: 1.0, hits: 2, tgt: 'front', desc: '두 자루 칼로 연달아 벤다.' },
  crossslash:  { name: '십자 베기', cls: ['duelist'], lv: 22, own: 1, cost: { mp: 12 }, cd: 7, kind: 'dmg', mult: 2.4, tgt: 'front', desc: '칼날을 엇갈려 크게 벤다.' },
  parrying:    { name: '받아넘기기', cls: ['duelist'], lv: 28, own: 1, cost: { mp: 12 }, cd: 14, kind: 'buff', stat: 'eva', add: 0.25, dur: 6, tgt: 'self', desc: '6초 동안 회피율이 오른다.' },
  blitz:       { name: '질풍 연격', cls: ['duelist'], lv: 36, own: 1, cost: { mp: 20 }, cd: 9, kind: 'dmg', mult: 0.8, hits: 5, tgt: 'front', desc: '눈에 보이지 않는 다섯 번의 베기.' },
  twinstorm:   { name: '쌍검 폭풍', cls: ['duelist'], lv: 48, own: 1, cost: { mp: 28 }, cd: 11, kind: 'dmg', mult: 1.4, hits: 2, tgt: 'all', desc: '모든 적을 두 번씩 벤다.' },
  bladewaltz:  { name: '칼날 왈츠', cls: ['bladedancer'], lv: 1, cost: { mp: 12 }, cd: 4, kind: 'dmg', mult: 1.2, hits: 3, tgt: 'front', desc: '춤추듯 세 번 벤다.' },
  swordrain:   { name: '칼비', cls: ['bladedancer'], lv: 60, own: 1, cost: { mp: 34 }, cd: 11, kind: 'dmg', mult: 1.6, hits: 2, tgt: 'all', desc: '칼날이 비처럼 쏟아진다.' },
  dancemaster: { name: '무희의 발놀림', cls: ['bladedancer'], lv: 75, own: 1, passive: { eva: 0.08, spdPct: 0.1 }, desc: '회피율 8%p, 공격속도 10%가 오른다.' },
  thousandcut: { name: '천 번의 베기', cls: ['bladedancer'], lv: 95, own: 1, cost: { mp: 60 }, cd: 18, kind: 'dmg', mult: 0.9, hits: 8, tgt: 'front', desc: '여덟 번의 칼날이 한순간에 지나간다.' },
  // 보물 사냥꾼 → 대도
  pilfer:      { name: '슬쩍하기', cls: ['treasure'], lv: 1, cost: { mp: 6 }, cd: 5, kind: 'dmg', mult: 1.5, steal: 3, tgt: 'front', desc: '때리면서 몬스터의 금화를 슬쩍한다.' },
  lockpick:    { name: '자물쇠 따기', cls: ['treasure'], lv: 22, own: 1, passive: { carryPct: 0.2 }, desc: '보물을 잘 챙겨 들 수 있는 짐이 20% 늘어난다.' },
  smokebomb:   { name: '연막 폭탄', cls: ['treasure'], lv: 28, own: 1, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.25, dur: 6, tgt: 'party', desc: '6초 동안 파티의 회피율을 올린다.' },
  goldrush:    { name: '골드러시', cls: ['treasure'], lv: 36, own: 1, cost: { mp: 18 }, cd: 10, kind: 'dmg', mult: 1.2, steal: 2, tgt: 'all', desc: '모든 적을 치며 금화를 줍는다.' },
  jackpot:     { name: '대박', cls: ['treasure'], lv: 48, own: 1, cost: { mp: 24 }, cd: 14, kind: 'dmg', mult: 3.0, steal: 10, tgt: 'front', desc: '큰 한 방에 금화가 쏟아진다.' },
  grandheist:  { name: '대도의 손놀림', cls: ['masterthief'], lv: 1, cost: { mp: 10 }, cd: 5, kind: 'dmg', mult: 2.2, steal: 6, tgt: 'front', desc: '눈 깜짝할 새 금화를 훔친다.' },
  phantom:     { name: '그림자 도둑', cls: ['masterthief'], lv: 60, own: 1, cost: { mp: 30 }, cd: 10, kind: 'dmg', mult: 2.0, steal: 4, tgt: 'all', desc: '모든 적의 주머니를 턴다.' },
  fortune:     { name: '행운의 여신', cls: ['masterthief'], lv: 75, own: 1, passive: { crit: 0.08 }, desc: '치명타 확률이 8%p 오른다.' },
  heist:       { name: '세기의 대도', cls: ['masterthief'], lv: 95, own: 1, cost: { mp: 60 }, cd: 20, kind: 'dmg', mult: 4.0, steal: 20, tgt: 'all', desc: '세상을 놀라게 할 한탕.' },
  // 정령술사 → 정령왕
  windspirit:  { name: '바람 정령', cls: ['elementalist'], lv: 1, cost: { mp: 9 }, cd: 4, kind: 'mdmg', mult: 1.1, tgt: 'all', fx: 'wind', desc: '바람 정령이 모든 적을 벤다.' },
  earthward:   { name: '대지의 가호', cls: ['elementalist'], lv: 22, own: 1, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.35, dur: 8, tgt: 'party', desc: '8초 동안 파티의 방어력을 올린다.' },
  firespirit:  { name: '불꽃 정령', cls: ['elementalist'], lv: 28, own: 1, cost: { mp: 14 }, cd: 7, kind: 'mdmg', mult: 0.8, hits: 3, tgt: 'front', fx: 'fire', desc: '불꽃 정령이 세 번 연달아 불을 뿜는다.' },
  waterspirit: { name: '물의 정령', cls: ['elementalist'], lv: 36, own: 1, cost: { mp: 24 }, cd: 10, kind: 'heal', mult: 1.0, tgt: 'party', desc: '물의 정령이 파티를 치료한다.' },
  storm:       { name: '정령 폭풍', cls: ['elementalist'], lv: 48, own: 1, cost: { mp: 26 }, cd: 12, kind: 'mdmg', mult: 2.2, tgt: 'all', fx: 'bolt', desc: '모든 정령이 함께 휘몰아친다.' },
  spiritking:  { name: '정령왕의 분노', cls: ['elementlord'], lv: 1, cost: { mp: 16 }, cd: 5, kind: 'mdmg', mult: 1.8, tgt: 'all', fx: 'wind', desc: '정령왕의 분노가 모든 적을 덮친다.' },
  spiritlink:  { name: '정령 교감', cls: ['elementlord'], lv: 60, own: 1, passive: { matkPct: 0.15 }, desc: '마법 피해와 치유량이 15% 오른다.' },
  elemental:   { name: '4원소 폭발', cls: ['elementlord'], lv: 75, own: 1, cost: { mp: 48 }, cd: 14, kind: 'mdmg', mult: 3.0, tgt: 'all', fx: 'bolt', desc: '네 정령의 힘을 한꺼번에 터뜨린다.' },
  genesis:     { name: '천지창조', cls: ['elementlord'], lv: 95, own: 1, cost: { mp: 70 }, cd: 20, kind: 'mdmg', mult: 6.0, tgt: 'all', fx: 'fire', desc: '세상이 처음 생기던 날의 힘.' },
  // 네크로맨서 → 리치
  drain:       { name: '생명 흡수', cls: ['necromancer'], lv: 1, cost: { mp: 8 }, cd: 3.5, kind: 'mdmg', mult: 1.7, drain: 0.35, tgt: 'front', fx: 'dark', desc: '적의 생명을 빼앗아 자신의 HP를 채운다.' },
  curse:       { name: '저주', cls: ['necromancer'], lv: 22, own: 1, cost: { mp: 10 }, cd: 8, kind: 'dot', magic: 1, mult: 0.7, dur: 6, tgt: 'front', fx: 'dark', desc: '6초 동안 저주 피해를 준다.' },
  bonewall:    { name: '뼈의 방벽', cls: ['necromancer'], lv: 28, own: 1, cost: { mp: 14 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.3, dur: 8, tgt: 'party', desc: '해골 방패가 8초 동안 파티를 지킨다.' },
  raise:       { name: '해골 병사', cls: ['necromancer'], lv: 36, own: 1, cost: { mp: 28 }, cd: 12, kind: 'mdmg', mult: 1.2, hits: 3, tgt: 'all', fx: 'dark', desc: '해골 병사들이 모든 적을 세 번 친다.' },
  deathwave:   { name: '죽음의 파도', cls: ['necromancer'], lv: 48, own: 1, cost: { hp: 0.15 }, cd: 14, kind: 'mdmg', mult: 2.4, tgt: 'all', fx: 'dark', desc: 'HP를 바쳐 모든 적에게 죽음의 파도를 보낸다.' },
  soulrend:    { name: '영혼 찢기', cls: ['lich'], lv: 1, cost: { mp: 14 }, cd: 4, kind: 'mdmg', mult: 3.0, drain: 0.35, tgt: 'front', fx: 'dark', desc: '적의 영혼을 찢어 생명을 빼앗는다.' },
  lichmind:    { name: '리치의 지혜', cls: ['lich'], lv: 60, own: 1, passive: { matkPct: 0.2 }, desc: '마법 피해가 20% 오른다.' },
  deathplague: { name: '죽음의 역병', cls: ['lich'], lv: 75, own: 1, cost: { mp: 40 }, cd: 12, kind: 'dot', magic: 1, mult: 2.0, dur: 8, tgt: 'all', fx: 'dark', desc: '8초 동안 모든 적이 썩어 간다.' },
  apocalypse:  { name: '종말', cls: ['lich'], lv: 95, own: 1, cost: { hp: 0.2 }, cd: 20, kind: 'mdmg', mult: 6.0, tgt: 'all', fx: 'dark', desc: 'HP를 바쳐 종말을 부른다.' },
  // 마검사 → 마검성
  huntmark:    { name: '사냥꾼의 표식', cls: ['mhunter'], lv: 1, cost: { mp: 7 }, cd: 5, kind: 'dmg', mult: 1.9, crit: 0.2, tgt: 'low', fx: 'arrow', desc: '가장 약한 사냥감의 급소를 쏜다. 보스에게 더 아프다.' },
  trapnet:     { name: '그물 덫', cls: ['mhunter'], lv: 22, own: 1, cost: { mp: 12 }, cd: 10, kind: 'dmg', mult: 1.2, tgt: 'front', sta: { k: 'para', p: 0.45, d: 3, m: 0 }, desc: '앞의 적에게 그물을 던져 묶는다. 마비시킬 수 있다.' },
  biggame:     { name: '대물 사냥', cls: ['mhunter'], lv: 28, own: 1, cost: { mp: 18 }, cd: 12, kind: 'dmg', mult: 3.0, tgt: 'front', fx: 'arrow', desc: '큰 사냥감을 겨눈 강한 한 발. 보스에게 아주 아프다.' },
  skinning:    { name: '가죽 벗기기', cls: ['mhunter'], lv: 36, own: 1, passive: { crit: 0.05, atkPct: 0.08 }, desc: '몬스터를 잘 알아 치명타와 공격력이 오른다.' },
  volleytrap:  { name: '덫 사격', cls: ['mhunter'], lv: 48, own: 1, cost: { mp: 24 }, cd: 12, kind: 'dmg', mult: 1.3, hits: 2, tgt: 'all', fx: 'arrow', desc: '모든 적에게 화살을 두 발씩 퍼붓는다.' },
  dragonpierce:{ name: '용 관통', cls: ['dslayer'], lv: 1, cost: { mp: 14 }, cd: 5, kind: 'dmg', mult: 3.2, crit: 0.2, tgt: 'front', fx: 'arrow', desc: '용의 비늘도 뚫는 한 발.' },
  wyrmbane:    { name: '용살자의 눈', cls: ['dslayer'], lv: 60, own: 1, passive: { atkPct: 0.15, crit: 0.08 }, desc: '공격력 15%, 치명 8%가 오른다.' },
  slayrain:    { name: '용살의 비', cls: ['dslayer'], lv: 75, own: 1, cost: { mp: 36 }, cd: 12, kind: 'dmg', mult: 1.8, hits: 2, tgt: 'all', fx: 'arrow', desc: '모든 적에게 두 발씩 쏟아붓는다.' },
  dragonheart: { name: '용의 심장 꿰기', cls: ['dslayer'], lv: 95, own: 1, cost: { mp: 60 }, cd: 20, kind: 'dmg', mult: 7.0, crit: 0.3, tgt: 'low', fx: 'arrow', desc: '가장 약한 적의 심장을 꿰는 필살의 한 발.' },
  flameblade:  { name: '화염검', cls: ['spellblade'], lv: 1, cost: { mp: 8 }, cd: 4, kind: 'mdmg', mult: 2.0, tgt: 'front', fx: 'fire', desc: '불꽃을 두른 검으로 벤다.' },
  frostblade:  { name: '냉기검', cls: ['spellblade'], lv: 22, own: 1, cost: { mp: 12 }, cd: 7, kind: 'mdmg', mult: 1.8, slow: 4, tgt: 'front', fx: 'ice', desc: '베인 적이 얼어붙어 느려진다.' },
  thunderblade:{ name: '뇌전검', cls: ['spellblade'], lv: 28, own: 1, cost: { mp: 18 }, cd: 9, kind: 'mdmg', mult: 1.2, tgt: 'all', fx: 'bolt', desc: '검끝의 번개가 모든 적에게 튄다.' },
  arcaneguard: { name: '마력 갑주', cls: ['spellblade'], lv: 36, own: 1, cost: { mp: 16 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.8, dur: 8, tgt: 'self', desc: '8초 동안 마력의 갑옷을 두른다.' },
  spellsword:  { name: '마검 일섬', cls: ['spellblade'], lv: 48, own: 1, cost: { mp: 26 }, cd: 12, kind: 'dmg', mult: 3.5, tgt: 'front', desc: '마력을 실은 한 줄기 베기.' },
  starblade:   { name: '별의 검', cls: ['arcblade'], lv: 1, cost: { mp: 14 }, cd: 4, kind: 'mdmg', mult: 3.0, tgt: 'front', fx: 'holy', desc: '별빛을 두른 검으로 벤다.' },
  manaburst:   { name: '마력 해방', cls: ['arcblade'], lv: 60, own: 1, cost: { mp: 30 }, cd: 18, kind: 'buff', stat: 'atk', mult: 1.6, dur: 8, tgt: 'self', desc: '8초 동안 공격력이 크게 오른다.' },
  dimension:   { name: '차원 베기', cls: ['arcblade'], lv: 75, own: 1, cost: { mp: 40 }, cd: 12, kind: 'dmg', mult: 3.0, tgt: 'all', desc: '공간째로 모든 적을 벤다.' },
  swordsaint:  { name: '검성의 일격', cls: ['arcblade'], lv: 95, own: 1, cost: { mp: 70 }, cd: 20, kind: 'mdmg', mult: 5.5, tgt: 'all', fx: 'bolt', desc: '검과 마법이 하나 된 궁극의 일격.' },
  // 사제 → 대주교
  prayer:      { name: '기도', cls: ['priest'], lv: 1, cost: { mp: 7 }, cd: 2.5, kind: 'heal', mult: 2.6, tgt: 'low', desc: '가장 다친 동료를 치료한다.' },
  grace:       { name: '신의 은총', cls: ['priest'], lv: 22, own: 1, cost: { mp: 14 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.3, dur: 10, tgt: 'party', desc: '10초 동안 파티의 방어력을 올린다.' },
  restore:     { name: '회복의 빛', cls: ['priest'], lv: 28, own: 1, cost: { mp: 18 }, cd: 8, kind: 'heal', mult: 1.2, tgt: 'party', desc: '파티 전원을 치료한다.' },
  purify:      { name: '정화', cls: ['priest'], lv: 36, own: 1, cost: { mp: 16 }, cd: 7, kind: 'mdmg', mult: 2.4, tgt: 'front', fx: 'holy', desc: '성스러운 빛으로 적을 태운다.' },
  sacredsong:  { name: '소생의 기도', cls: ['priest'], lv: 48, own: 1, cost: { mp: 34 }, cd: 16, kind: 'heal', mult: 2.0, tgt: 'party', desc: '파티 전원을 크게 치료한다.' },
  miracle:     { name: '기적', cls: ['archbishop'], lv: 1, cost: { mp: 20 }, cd: 6, kind: 'heal', mult: 1.6, tgt: 'party', desc: '기적의 빛이 파티 전원을 치료한다.' },
  holyland:    { name: '성지', cls: ['archbishop'], lv: 60, own: 1, cost: { mp: 30 }, cd: 20, kind: 'buff', stat: 'def', mult: 1.5, dur: 12, tgt: 'party', desc: '12초 동안 파티의 방어력을 크게 올린다.' },
  archangel:   { name: '대천사 강림', cls: ['archbishop'], lv: 75, own: 1, cost: { mp: 44 }, cd: 12, kind: 'mdmg', mult: 3.0, tgt: 'all', fx: 'holy', desc: '대천사가 내려와 모든 적을 벌한다.' },
  dawnlight:   { name: '창세의 빛', cls: ['archbishop'], lv: 95, own: 1, cost: { mp: 70 }, cd: 18, kind: 'heal', mult: 4.0, tgt: 'party', desc: '세상을 처음 비춘 빛으로 파티를 감싼다.' },
  // 역병의사 → 명의
  miasma:      { name: '독 플라스크', cls: ['plaguedoc'], lv: 1, cost: { mp: 7 }, cd: 5, kind: 'dot', magic: 1, mult: 0.9, dur: 6, tgt: 'all', fx: 'dark', desc: '깨지면 독 안개가 퍼져 모든 적에게 6초 동안 독 피해를 준다.' },
  remedy:      { name: '응급 수술', cls: ['plaguedoc'], lv: 22, own: 1, cost: { mp: 10 }, cd: 6, kind: 'heal', mult: 1.7, tgt: 'low', desc: '가장 다친 동료를 크게 치료한다.' },
  quarantine:  { name: '격리', cls: ['plaguedoc'], lv: 28, own: 1, cost: { mp: 12 }, cd: 14, kind: 'buff', stat: 'def', mult: 1.3, dur: 8, tgt: 'party', desc: '8초 동안 파티의 방어력을 올린다.' },
  vaccine:     { name: '백신', cls: ['plaguedoc'], lv: 36, own: 1, cost: { mp: 20 }, cd: 16, kind: 'buff', stat: 'def', mult: 1.25, dur: 10, tgt: 'party', desc: '10초 동안 파티의 방어력을 올린다.' },
  panacea:     { name: '만병통치약', cls: ['plaguedoc'], lv: 42, own: 1, cost: { mp: 22 }, cd: 12, kind: 'heal', mult: 1.2, tgt: 'party', desc: '파티 전원을 치료한다.' },
  epidemic:    { name: '역병 확산', cls: ['plaguedoc'], lv: 48, own: 1, cost: { mp: 30 }, cd: 12, kind: 'dot', magic: 1, mult: 1.4, dur: 8, tgt: 'all', fx: 'dark', desc: '8초 동안 모든 적에게 역병이 번진다.' },
  cureall:     { name: '명의의 손', cls: ['physician'], lv: 1, cost: { mp: 12 }, cd: 3, kind: 'heal', mult: 3.5, tgt: 'low', desc: '어떤 상처도 꿰매는 손.' },
  surgeon:     { name: '명의', cls: ['physician'], lv: 60, own: 1, passive: { matkPct: 0.15 }, desc: '치유량과 마법 피해가 15% 오른다.' },
  blackdeath:  { name: '흑사병', cls: ['physician'], lv: 75, own: 1, cost: { mp: 40 }, cd: 12, kind: 'dot', magic: 1, mult: 2.2, dur: 8, tgt: 'all', fx: 'dark', desc: '8초 동안 모든 적에게 지독한 병을 퍼뜨린다.' },
  elixir:      { name: '불사의 영약', cls: ['physician'], lv: 95, own: 1, cost: { mp: 60 }, cd: 18, kind: 'heal', mult: 3.5, tgt: 'party', desc: '파티 전원을 거의 다 치료한다.' },
  // 퇴마사 → 심판관
  banish:      { name: '퇴마', cls: ['exorcist'], lv: 1, cost: { mp: 8 }, cd: 4, kind: 'mdmg', mult: 2.2, boss: 1.3, tgt: 'front', fx: 'holy', desc: '마물을 쫓아내는 빛. 보스에게 더 아프다.' },
  sealing:     { name: '봉인', cls: ['exorcist'], lv: 22, own: 1, cost: { mp: 12 }, cd: 8, kind: 'mdmg', mult: 1.6, slow: 5, tgt: 'front', fx: 'holy', desc: '적을 봉인해 느려지게 한다.' },
  holywater:   { name: '성수', cls: ['exorcist'], lv: 28, own: 1, cost: { mp: 16 }, cd: 10, kind: 'dot', magic: 1, mult: 1.0, dur: 6, tgt: 'all', fx: 'holy', desc: '성수를 뿌려 모든 적에게 6초 동안 피해를 준다.' },
  wardcircle:  { name: '결계', cls: ['exorcist'], lv: 36, own: 1, cost: { mp: 18 }, cd: 18, kind: 'buff', stat: 'def', mult: 1.3, dur: 10, tgt: 'party', desc: '10초 동안 파티를 결계로 지킨다.' },
  exorcism:    { name: '대퇴마', cls: ['exorcist'], lv: 48, own: 1, cost: { mp: 30 }, cd: 12, kind: 'mdmg', mult: 2.2, boss: 1.4, tgt: 'all', fx: 'holy', desc: '모든 마물을 한꺼번에 몰아낸다.' },
  verdict:     { name: '심판', cls: ['inquisitor'], lv: 1, cost: { mp: 14 }, cd: 4, kind: 'mdmg', mult: 3.2, boss: 1.5, tgt: 'front', fx: 'holy', desc: '신의 이름으로 내리는 심판.' },
  pyre:        { name: '화형', cls: ['inquisitor'], lv: 60, own: 1, cost: { mp: 34 }, cd: 12, kind: 'dot', magic: 1, mult: 2.0, dur: 8, tgt: 'all', fx: 'fire', desc: '8초 동안 모든 적을 성스러운 불길로 태운다.' },
  inquisition: { name: '이단 심문', cls: ['inquisitor'], lv: 75, own: 1, cost: { mp: 40 }, cd: 12, kind: 'mdmg', mult: 6.0, boss: 1.6, tgt: 'front', fx: 'holy', desc: '한 놈을 골라 끝까지 심문한다.' },
  lastjudgment:{ name: '최후의 심판', cls: ['inquisitor'], lv: 95, own: 1, cost: { mp: 70 }, cd: 20, kind: 'mdmg', mult: 6.0, boss: 1.6, tgt: 'all', fx: 'holy', desc: '세상의 마지막 날에 내릴 심판.' }

};
const SKILL_IDS = Object.keys(SKILLS);
const BOOK_IDS = SKILL_IDS.filter(id => !SKILLS[id].own && !Object.values(CLASSES).some(c => c.innate === id));
const BOOK_COLORS = { warrior: '#c0392b', archer: '#4f9a3a', mage: '#7a4ac8', cleric: '#d9b44a', rogue: '#5a5a6a', porter: '#9a7a4f', all: '#4a8ac8' };
const ownFee = s => s.lv * 40;   // 특수직업 고유 스킬 수련비
BOOK_IDS.forEach(id => {
  const s = SKILLS[id];
  ITEMS['book_' + id] = { name: `스킬북: ${s.name}`, v: 60 + s.lv * 35, w: 1, icon: 'book', c: BOOK_COLORS[s.cls[0]], book: id };
});
// 3차 직업은 2차·기본 직업의 스킬도 배울 수 있다
const canLearn = (a, id) => { const s = SKILLS[id]; return (s.cls.includes('all') || chainOf(a.cls).some(c => s.cls.includes(c))) && a.lv >= s.lv; };

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
  sword:   { name: '장검',     slot: 'weapon', cls: ['warrior', 'duelist', 'spellblade'],                     st: { atk: 4.2, vit: 0.5 },           w: 3, icon: 'sword',  mat: [3, 1, 0] },
  bow:     { name: '활',       slot: 'weapon', cls: ['archer'],                      st: { atk: 3.6, agi: 0.8 },           w: 2, icon: 'bow',    mat: [2, 2, 0] },
  staff:   { name: '지팡이',   slot: 'weapon', cls: ['mage', 'priest', 'exorcist'],                        st: { matk: 4.2, int: 0.8, mp: 4 },   w: 2, icon: 'staff',  mat: [1, 0, 3] },
  mace:    { name: '철퇴',     slot: 'weapon', cls: ['cleric', 'knight'],                      st: { atk: 2.4, matk: 2.6, int: 0.5 }, w: 3, icon: 'mace',  mat: [3, 0, 1] },
  dagger:  { name: '단검',     slot: 'weapon', cls: ['rogue', 'gladiator', 'bard'],                       st: { atk: 3.2, agi: 0.6, crit: 0.006 }, w: 1, icon: 'dagger', mat: [2, 1, 0] },
  club:    { name: '몽둥이',   slot: 'weapon', cls: ['porter', 'warrior'],           st: { atk: 3.4, str: 0.8 },           w: 3, icon: 'club',   mat: [3, 0, 0] },
  axe:     { name: '도끼',     slot: 'weapon', cls: ['warrior', 'porter'],     st: { atk: 4.6, str: 0.8, agi: -0.3 }, w: 4, icon: 'axe',    mat: [3, 1, 0] },
  lance:   { name: '창',       slot: 'weapon', cls: ['ranger', 'knight'],                     st: { atk: 4.3, agi: 0.7 },           w: 3, icon: 'lance',  mat: [3, 1, 0] },
  lute:    { name: '류트',     slot: 'weapon', cls: ['bard'],                        st: { atk: 2.6, matk: 2.2, agi: 0.6 }, w: 2, icon: 'lute',   mat: [1, 2, 1] },
  plate:   { name: '판금 갑옷', slot: 'armor', cls: ['warrior', 'dragoon', 'arcblade', 'inquisitor'],                     st: { def: 4.2, hp: 10, agi: -0.3 },  w: 6, icon: 'armor',  mat: [2, 3, 0] },
  leather: { name: '가죽 갑옷', slot: 'armor', cls: ['archer', 'rogue', 'porter', 'warrior', 'spellblade'],   st: { def: 2.6, hp: 5, agi: 0.6 },    w: 3, icon: 'vest',   mat: [0, 4, 0] },
  robe:    { name: '로브',     slot: 'armor', cls: ['mage', 'cleric', 'bard'],               st: { def: 1.6, mp: 6, int: 0.8 },    w: 2, icon: 'robe',   mat: [0, 1, 3] },
  ring:    { name: '반지',     slot: 'acc',   cls: ['all'],                          st: { str: 0.7, agi: 0.7, crit: 0.005 }, w: 1, icon: 'ring', mat: [1, 0, 2] },
  amulet:  { name: '부적',     slot: 'acc',   cls: ['all'],                          st: { int: 0.7, vit: 0.7, eva: 0.005 }, w: 1, icon: 'amulet', mat: [0, 0, 3] },
  bag:     { name: '가방',     slot: 'bag',   cls: ['all'],                          st: { carry: 4 },                     w: 1, icon: 'bag',    mat: [0, 5, 0] }
};
const GTYPE_IDS = Object.keys(GTYPES);
// 등급마다 룬 슬롯이 하나씩 열린다 (일반 0칸 … 신성 6칸)
const QUALITY = [
  { name: '일반', m: 1.0,  c: '#d8d0c0' },
  { name: '고급', m: 1.25, c: '#7bd36a' },
  { name: '희귀', m: 1.55, c: '#6ab0ff' },
  { name: '영웅', m: 1.95, c: '#c07af0' },
  { name: '전설', m: 2.45, c: '#f0b43c' },
  { name: '신화', m: 3.1,  c: '#ff6a5a' },
  { name: '신성', m: 4.0,  c: '#fff4b0' }
];
const runeSlots = g => (g ? g.q || 0 : 0);
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
  for (const id of g.runes || []) { const R = ITEMS[id] && ITEMS[id].rune; if (!R) continue; const [k, l] = R, st = RUNES[k].st; out[st] = Math.round(((out[st] || 0) + RUNES[k].v[l]) * 1000) / 1000; }
  return out;
}
const gearName = g => `${GTIERS[g.t].name} ${GTYPES[g.base].name}`;
const gearKey = g => `${g.base}:${g.t}`;
const gearValue = g => Math.round(45 * GTIERS[g.t].p * QUALITY[g.q || 0].m + recipeFee(g.t) * 0.5 + (g.runes || []).reduce((s, id) => s + (ITEMS[id] ? ITEMS[id].v * 0.5 : 0), 0));
const recipeFee = t => Math.round(15 * GTIERS[t].p * GTIERS[t].p);
function recipeNeed(base, t) {
  const need = {}, mats = GTIERS[t].mats;
  GTYPES[base].mat.forEach((n, i) => { if (n) need[mats[i]] = n; });
  return need;
}
const gearFits = (a, g) => (GTYPES[g.base].cls.includes('all') || chainOf(a.cls).some(c => GTYPES[g.base].cls.includes(c))) && a.lv >= GTIERS[g.t].lv;

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
