/* ───────── 특성 · 새 능력치(방어·반격·연타) · 상태이상 · 각성(용사) ───────── */

// 모험가마다 1~3개가 무작위로 붙는다. 값은 derive()와 전투 곳곳에서 더해진다
const TRAITS = {
  giant:     { name: '거구',       desc: 'HP +15%',                      hpPct: 0.15 },
  scholar:   { name: '학자',       desc: 'MP +15%',                      mpPct: 0.15 },
  medit:     { name: '명상',       desc: '초당 MP +2',                   mpFlat: 2 },
  strong:    { name: '강함',       desc: '공격력 +15%',                  atkPct: 0.15 },
  nimble:    { name: '날렵함',     desc: '회피 +15%',                    eva: 0.15 },
  sharp:     { name: '예리함',     desc: '치명타 +15%',                  crit: 0.15 },
  perfect:   { name: '완벽함',     desc: '방어 확률 +15% (막으면 피해 1/4)', block: 0.15 },
  oppor:     { name: '기회주의자', desc: '반격 확률 +15%',               counter: 0.15 },
  sturdy:    { name: '단단함',     desc: '방어력 +15%',                  defPct: 0.15 },
  faith:     { name: '믿음',       desc: '회복 스킬 회복량 +15%',        healPow: 0.15 },
  sage:      { name: '현자',       desc: '마법 공격력 +15%',             matkPct: 0.15 },
  quick:     { name: '재빠름',     desc: '공격 속도 +10% (기본 공격 대기 ↓)', spdPct: 0.10 },
  tactician: { name: '전술가',     desc: '스킬 재사용 대기시간 -8%',     cdr: 0.08 },
  flurry:    { name: '연타꾼',     desc: '연타 확률 +15%',               double: 0.15 },
  healthy:   { name: '건강함',     desc: '초당 HP 1% 재생',              hpRegen: 0.01 },
  blessedT:  { name: '축복받음',   desc: '받는 회복량 +15%',             rheal: 0.15 },
  tough:     { name: '끈질김',     desc: '받는 피해 -8%',                guard: 0.08 },
  walker:    { name: '걸음꾼',     desc: '이동 속도 +15%',               movePct: 0.15 },
  stamina:   { name: '지구력',     desc: '피로가 25% 느리게 쌓임',       fatigue: 0.25 },
  sleeper:   { name: '숙면가',     desc: '숙면 피로가 30% 느리게 쌓임',  sleepy: 0.30 },
  lucky:     { name: '행운아',     desc: '전리품·금화 +10%',             luck: 0.10 },
  back:      { name: '짐꾼의 등',  desc: '짐 +6',                        carry: 6 },
  antitox:   { name: '독에 강함',  desc: '중독·출혈 피해 -50%',          resPoison: 0.5 },
  fireproof: { name: '불에 강함',  desc: '화상 피해 -50%',               resBurn: 0.5 },
  calm:      { name: '냉정함',     desc: '냉기·감전·마비·기절 시간 -50%', resCc: 0.5 },
  frenzy:    { name: '전투광',     desc: 'HP 50% 아래에서 공격력 +20%',  frenzy: 0.20 },
  guardianT: { name: '수호자',     desc: '적에게 노려질 확률 ×1.5',      tank: 0.5 },
  shadowT:   { name: '그림자',     desc: '적에게 노려질 확률 ×0.5',      tank: -0.5 },
  hunter:    { name: '보스 사냥꾼', desc: '보스에게 주는 피해 +15%',     bossDmg: 0.15 },
  learner:   { name: '학습 능력',  desc: '경험치 +10%',                  expPct: 0.10 },
  talker:    { name: '수다쟁이',   desc: '개인 명성 +20%',               pfPct: 0.20 }
};
const TRAIT_IDS = Object.keys(TRAITS);
function rollTraits() {
  const n = 1 + (rnd() < 0.5 ? 1 : 0) + (rnd() < 0.3 ? 1 : 0), out = [];
  while (out.length < n) { const t = pickOne(TRAIT_IDS); if (!out.includes(t)) out.push(t); }
  return out;
}
const traitSum = (a, k) => (a.traits || []).reduce((s, id) => s + ((TRAITS[id] && TRAITS[id][k]) || 0), 0) + (typeof hallBonus === 'function' && S && S.hall ? hallBonus(k) : 0);   // 명예의 전당 동상 보너스도 더한다
// 직업 특성 + 타고난 특성
const TQ = (a, k) => ((TR(a)[k] || 0) + traitSum(a, k));

// 전투 중 상태이상. tick: 초당 피해(dps는 걸 때 정한다) · cc: 행동 제한 · weak: 능력치 깎임
const STATUS = {
  poison: { name: '중독', c: '#7ad83a', tick: 1, desc: '초당 독 피해. 해독 스킬로 풀린다.' },
  burn:   { name: '화상', c: '#ff8a2a', tick: 1, desc: '초당 불 피해. 10초 뒤 꺼진다.' },
  bleed:  { name: '출혈', c: '#ff4a4a', tick: 1, desc: '초당 피해. 붕대나 회복 스킬로 풀린다.' },
  chill:  { name: '냉기', c: '#8ae8ff', cc: 1, desc: '이동·기본 공격·스킬 재사용이 느려진다.' },
  shock:  { name: '감전', c: '#ffe84a', cc: 1, desc: '스킬을 쓸 수 없다.' },
  para:   { name: '마비', c: '#c08aff', cc: 1, desc: '기본 공격을 할 수 없다.' },
  stun:   { name: '기절', c: '#ffffff', cc: 1, desc: '아무것도 할 수 없다.' },
  weak:   { name: '쇠약', c: '#a0a0a0', desc: '공격력·마법·방어력이 20% 깎인다.' }
};
const STATUS_IDS = Object.keys(STATUS);
const CC_IDS = ['chill', 'shock', 'para', 'stun'];

// 몬스터가 거는 상태이상: k 종류 · p 맞힐 때 확률 · d 지속(초) · m 틱 피해(공격력 비율)
Object.assign(MONS.spider,      { sta: { k: 'poison', p: 0.3, d: 8, m: 0.25 } });
Object.assign(MONS.myconid,     { sta: { k: 'poison', p: 0.25, d: 8, m: 0.2 } });
Object.assign(MONS.scorpion,    { sta: { k: 'poison', p: 0.35, d: 10, m: 0.3 } });
Object.assign(MONS.sludge,      { sta: { k: 'poison', p: 0.3, d: 8, m: 0.25 } });
Object.assign(MONS.poisoner,    { sta: { k: 'poison', p: 0.5, d: 10, m: 0.3 } });
Object.assign(MONS.snowman,     { sta: { k: 'chill', p: 0.3, d: 5 } });
Object.assign(MONS.icesprite,   { sta: { k: 'chill', p: 0.4, d: 5 } });
Object.assign(MONS.snowmaiden,  { sta: { k: 'weak', p: 0.3, d: 8 } });
Object.assign(MONS.icequeen,    { sta: { k: 'chill', p: 0.5, d: 6 } });
Object.assign(MONS.stormwyvern, { sta: { k: 'shock', p: 0.35, d: 3 } });
Object.assign(MONS.tempest,     { sta: { k: 'shock', p: 0.4, d: 3 } });
Object.assign(MONS.golem,       { sta: { k: 'stun', p: 0.15, d: 2 } });
Object.assign(MONS.giant,       { sta: { k: 'stun', p: 0.25, d: 2 } });
Object.assign(MONS.behemoth,    { sta: { k: 'stun', p: 0.2, d: 2 } });
Object.assign(MONS.bandit,      { sta: { k: 'bleed', p: 0.3, d: 8, m: 0.25 } });
Object.assign(MONS.assassin,    { sta: { k: 'bleed', p: 0.4, d: 8, m: 0.3 } });
Object.assign(MONS.blackhood,   { sta: { k: 'bleed', p: 0.5, d: 10, m: 0.35 } });
Object.assign(MONS.sewercroc,   { sta: { k: 'bleed', p: 0.3, d: 8, m: 0.3 } });
Object.assign(MONS.ratman,      { sta: { k: 'para', p: 0.2, d: 2 } });
Object.assign(MONS.shaman,      { sta: { k: 'weak', p: 0.3, d: 8 } });
Object.assign(MONS.elder,       { sta: { k: 'stun', p: 0.2, d: 2 } });
Object.assign(MONS.kaishar,     { sta: { k: 'bleed', p: 0.4, d: 8, m: 0.35 } });
Object.assign(MONS.harpy,       { sta: { k: 'bleed', p: 0.2, d: 6, m: 0.2 } });

// 스킬이 거는 상태이상 (있던 스킬에 더한다)
Object.assign(SKILLS.fireball, { sta: { k: 'burn', p: 0.35, d: 10, m: 0.25 } });
Object.assign(SKILLS.icelance, { sta: { k: 'chill', p: 0.5, d: 5 } });
Object.assign(SKILLS.chain,    { sta: { k: 'shock', p: 0.4, d: 3 } });
Object.assign(SKILLS.bash,     { sta: { k: 'stun', p: 0.2, d: 2 } });
Object.assign(SKILLS.backstab, { sta: { k: 'bleed', p: 0.35, d: 6, m: 0.3 } });
Object.assign(SKILLS.ar_combo, { sta: { k: 'bleed', p: 0.5, d: 8, m: 0.3 } });
Object.assign(SKILLS.sa_mirage, { sta: { k: 'burn', p: 0.4, d: 8, m: 0.2 } });
Object.assign(SKILLS.el_arrow, { sta: { k: 'chill', p: 0.3, d: 4 } });
// 새 스킬: 해독 · 마비 침 · 얼음 감옥 · 약화의 저주 · 붕대 감기
const TRAIT_SKILLS = {
  cure:     { name: '해독',       cls: ['cleric'],          lv: 7,  cost: { mp: 8 },  cd: 10, kind: 'cure', cures: ['poison', 'weak'], tgt: 'party', desc: '파티의 중독과 쇠약을 푼다.' },
  bandage:  { name: '붕대 감기',  cls: ['all'],             lv: 4,  cost: { mp: 5 },  cd: 9,  kind: 'cure', cures: ['bleed'], tgt: 'party', desc: '파티의 출혈을 멎게 한다.' },
  parasting:{ name: '마비 침',    cls: ['rogue'],           lv: 14, cost: { mp: 10 }, cd: 9,  kind: 'dmg', mult: 1.2, tgt: 'front', sta: { k: 'para', p: 0.6, d: 3 }, desc: '적을 찔러 3초 동안 공격을 못 하게 한다.' },
  iceprison:{ name: '얼음 감옥',  cls: ['mage'],            lv: 26, cost: { mp: 18 }, cd: 14, kind: 'mdmg', mult: 1.6, tgt: 'front', fx: 'ice', sta: { k: 'stun', p: 0.7, d: 2.5 }, desc: '적을 얼려 잠시 아무것도 못 하게 한다.' },
  weaken:   { name: '약화의 저주', cls: ['mage', 'cleric'], lv: 18, cost: { mp: 14 }, cd: 12, kind: 'mdmg', mult: 0.6, tgt: 'all', fx: 'dark', sta: { k: 'weak', p: 0.8, d: 8 }, desc: '모든 적의 힘을 8초 동안 깎는다.' },
  resolve:  { name: '결의',       cls: ['warrior'],         lv: 26, cost: { mp: 14 }, cd: 18, kind: 'buff', stat: 'block', add: 0.25, dur: 8, tgt: 'party', desc: '8초 동안 파티의 방어 확률을 올린다.' },
  riposte:  { name: '되치기',     cls: ['rogue', 'warrior'], lv: 22, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'counter', add: 0.3, dur: 8, tgt: 'self', desc: '8초 동안 맞으면 되받아친다.' },
  chant:    { name: '치유의 찬가', cls: ['cleric', 'archer'], lv: 20, cost: { mp: 12 }, cd: 16, kind: 'buff', stat: 'rheal', add: 0.3, dur: 10, tgt: 'party', desc: '10초 동안 파티가 받는 회복량을 올린다.' }
};
Object.assign(SKILLS, TRAIT_SKILLS);
Object.keys(TRAIT_SKILLS).forEach(id => { const s = SKILLS[id]; SKILL_IDS.push(id); BOOK_IDS.push(id); ITEMS['book_' + id] = { name: `스킬북: ${s.name}`, v: 60 + s.lv * 35, w: 1, icon: 'book', c: BOOK_COLORS[s.cls[0]] || '#4a8ac8', book: id }; });
ITEMS.bandage = { name: '붕대', v: 18, w: 1, icon: 'hide', c: '#f0ece0', sup: 1, desc: '출혈을 멎게 한다. 보급품으로 가져가면 저절로 쓴다.' };

// 각성(용사): 3차 직업의 끝에 선 모험가를 용사로. 각성기를 받고 능력이 15% 오른다
const AWAKEN = { lv: 60, rank: 3, fee: 30000, souls: 2 };
const AWK_SKILLS = {
  awk_warrior: { name: '용사의 일격',  cls: ['warrior'], lv: 1, cost: { mp: 30 }, cd: 30, kind: 'dmg',  mult: 4.5, tgt: 'all', fx: 'jump', crit: 0.2, awk: 1, desc: '각성기. 모든 적을 한 번에 내리친다.' },
  awk_archer:  { name: '유성우',       cls: ['archer'],  lv: 1, cost: { mp: 30 }, cd: 30, kind: 'dmg',  mult: 1.6, hits: 3, tgt: 'all', fx: 'arrow', awk: 1, desc: '각성기. 화살이 별똥별처럼 쏟아진다.' },
  awk_mage:    { name: '종말의 불꽃',  cls: ['mage'],    lv: 1, cost: { mp: 40 }, cd: 30, kind: 'mdmg', mult: 3.2, tgt: 'all', fx: 'fire', sta: { k: 'burn', p: 1, d: 10, m: 0.3 }, awk: 1, desc: '각성기. 모든 적을 태우고 불을 붙인다.' },
  awk_cleric:  { name: '신의 기적',    cls: ['cleric'],  lv: 1, cost: { mp: 40 }, cd: 30, kind: 'heal', mult: 3.0, tgt: 'party', cures: STATUS_IDS, awk: 1, desc: '각성기. 파티를 크게 치료하고 모든 상태이상을 푼다.' },
  awk_rogue:   { name: '그림자 처형',  cls: ['rogue'],   lv: 1, cost: { mp: 30 }, cd: 30, kind: 'dmg',  mult: 7.0, tgt: 'low', crit: 1, awk: 1, desc: '각성기. 가장 약한 적을 반드시 치명타로 벤다.' },
  awk_porter:  { name: '거인의 등짐',  cls: ['porter'],  lv: 1, cost: { mp: 30 }, cd: 30, kind: 'buff', stat: 'atk', mult: 1.5, dur: 10, tgt: 'party', awk: 1, desc: '각성기. 10초 동안 파티의 공격력이 크게 오른다.' }
};
Object.assign(SKILLS, AWK_SKILLS);
Object.keys(AWK_SKILLS).forEach(id => SKILL_IDS.push(id));
const awkSkillOf = a => 'awk_' + jobBase(a.cls);
STAT_NAMES.block = '방어'; STAT_NAMES.counter = '반격'; STAT_NAMES.double = '연타'; STAT_NAMES.heal = '회복량'; STAT_NAMES.rheal = '받는 회복';

/* ───────── 직업 특성 (2차·3차 전직 때 붙는다, 마법사의 돌로 바꿀 수 없다) · 마법사의 돌 ───────── */
const JOB_TRAITS = {
  // 2차
  gladiator:   { name: '검투사의 투지',   desc: '치명타 +6% · 공격력 +6%',        crit: 0.06, atkPct: 0.06 },
  knight:      { name: '기사의 맹세',     desc: '방어력 +12% · 방어 확률 +6%',    defPct: 0.12, block: 0.06 },
  berserker:   { name: '광전사의 피',     desc: '공격력 +12% · 받는 피해 +4%',    atkPct: 0.12, guard: -0.04 },
  spellblade:  { name: '마검의 각인',     desc: '공격력 +6% · 마법 공격력 +6%',   atkPct: 0.06, matkPct: 0.06 },
  ranger:      { name: '숲의 동반자',     desc: '회피 +6% · 이동 속도 +8%',       eva: 0.06, movePct: 0.08 },
  sniper:      { name: '매의 눈',         desc: '치명타 +10%',                    crit: 0.10 },
  mhunter:     { name: '사냥꾼의 본능',   desc: '보스 피해 +8% · 전리품 +6%',     bossDmg: 0.08, luck: 0.06 },
  bard:        { name: '음유시인의 선율', desc: '회복량 +8% · 초당 MP +1',        healPow: 0.08, mpFlat: 1 },
  assassin:    { name: '그림자 걸음',     desc: '회피 +6% · 치명타 +6%',          eva: 0.06, crit: 0.06 },
  duelist:     { name: '쌍검의 춤',       desc: '연타 확률 +10%',                 double: 0.10 },
  treasure:    { name: '보물의 감',       desc: '전리품·금화 +10%',               luck: 0.10 },
  elementalist:{ name: '정령의 가호',     desc: '마법 공격력 +10%',               matkPct: 0.10 },
  necromancer: { name: '죽음의 인장',     desc: '마법 공격력 +6% · 초당 HP 0.5% 재생', matkPct: 0.06, hpRegen: 0.005 },
  sorcerer:    { name: '마도사의 인장',   desc: '마법 공격력 +8% · 치명타 +4%',   matkPct: 0.08, crit: 0.04 },
  priest:      { name: '성자의 손',       desc: '회복량 +12%',                    healPow: 0.12 },
  plaguedoc:   { name: '역병의 지식',     desc: '마법 공격력 +6% · 중독·출혈 피해 -50%', matkPct: 0.06, resPoison: 0.5 },
  exorcist:    { name: '퇴마의 서약',     desc: '보스 피해 +12%',                 bossDmg: 0.12 },
  // 3차
  champion:    { name: '챔피언의 관록',   desc: '치명타 +10% · 공격력 +10%',      crit: 0.10, atkPct: 0.10 },
  paladin:     { name: '성기사의 가호',   desc: '방어력 +15% · 받는 회복량 +10%', defPct: 0.15, rheal: 0.10 },
  bloodlord:   { name: '군주의 갈증',     desc: '공격력 +15% · HP 50% 아래에서 +10%', atkPct: 0.15, frenzy: 0.10 },
  arcblade:    { name: '별의 검흔',       desc: '공격력 +10% · 마법 공격력 +10%', atkPct: 0.10, matkPct: 0.10 },
  dragoon:     { name: '용기병의 창',     desc: '공격력 +10% · 회피 +8%',         atkPct: 0.10, eva: 0.08 },
  hawkeye:     { name: '신궁의 집중',     desc: '치명타 +15%',                    crit: 0.15 },
  dslayer:     { name: '용살자의 심장',   desc: '보스 피해 +15% · 전리품 +10%',   bossDmg: 0.15, luck: 0.10 },
  maestro:     { name: '거장의 악장',     desc: '회복량 +12% · 초당 MP +2',       healPow: 0.12, mpFlat: 2 },
  shadowlord:  { name: '어둠의 군주',     desc: '회피 +10% · 치명타 +10%',        eva: 0.10, crit: 0.10 },
  bladedancer: { name: '검무의 경지',     desc: '연타 확률 +15%',                 double: 0.15 },
  masterthief: { name: '대도의 손끝',     desc: '전리품·금화 +15%',               luck: 0.15 },
  elementlord: { name: '정령왕의 권능',   desc: '마법 공격력 +15%',               matkPct: 0.15 },
  lich:        { name: '불사의 인장',     desc: '마법 공격력 +10% · 초당 HP 1% 재생', matkPct: 0.10, hpRegen: 0.01 },
  archmage:    { name: '대마도사의 권능', desc: '마법 공격력 +12% · 치명타 +6%',  matkPct: 0.12, crit: 0.06 },
  archbishop:  { name: '대주교의 축성',   desc: '회복량 +15% · 받는 회복량 +10%', healPow: 0.15, rheal: 0.10 },
  physician:   { name: '명의의 처방',     desc: '마법 공격력 +8% · 회복량 +8%',   matkPct: 0.08, healPow: 0.08 },
  inquisitor:  { name: '심판의 권능',     desc: '보스 피해 +18%',                 bossDmg: 0.18 }
};
Object.entries(JOB_TRAITS).forEach(([cls, t]) => { TRAITS['j_' + cls] = Object.assign({ job: cls }, t); });
const jobTraitOf = cls => (JOB_TRAITS[cls] ? 'j_' + cls : null);
const isJobTrait = id => !!(TRAITS[id] && TRAITS[id].job);
const ROLL_TRAIT_IDS = TRAIT_IDS.slice();   // 무작위로 붙는 특성(직업 특성 제외)
ITEMS.wizstone = { name: '마법사의 돌', v: 4000, w: 1, icon: 'gem', c: '#c060e0', use: 'trait', desc: '모험가의 타고난 특성 하나를 골라 다른 특성으로 바꾼다. 직업 특성은 바꿀 수 없다. 모험가 창에서 쓴다.' };
// 특성 하나를 무작위 다른 특성으로. 바뀐 [옛, 새] 또는 null
function rerollTrait(a, id) {
  if (!a || !(a.traits || []).includes(id) || isJobTrait(id)) return null;
  const pool = ROLL_TRAIT_IDS.filter(t => !a.traits.includes(t));
  if (!pool.length) return null;
  const nt = pickOne(pool);
  a.traits[a.traits.indexOf(id)] = nt;
  return [id, nt];
}
