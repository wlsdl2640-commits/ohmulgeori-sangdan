/* ───────── 회복 개편 (빌드 69, 사용자 11-13 15:47) ─────────
   「HP회복 계열의 스킬들은 사제계열 · 성기사 같은 직업용으로 개편 · 응급처치를 사제용으로 · 재기는 Lv150 · 자신의 HP만 회복하거나 흡수하는 스킬은 두고 수치를 줄여 ·
    정령술사 회복량 · 사제계열 · 성기사 회복량도 낮춰 · 치유의 찬가는 사제계열용으로 Lv50 이상 · 모든 회복 스킬의 드랍률을 낮춰 · 스킬을 Lv5까지 올렸을 때 기준으로 ·
    모든 HP회복 · 회복량 · 흡수 · 최대 HP 상승 · HP 재생량이 대상 · 숙련 포함 · 사제계열 · 성기사에게 신성력 숙련(자기 HP 재생)」
   기준: 스킬 Lv5 + 숙련도 5(위력 ×1.52 · 재사용 ×0.76)에서 그 스킬을 쓰는 직업이 한 번에 —
     자주 쓰는 한 사람 치유 탱커 최대 HP 15~25% · 큰 치유 30~45% · 파티 치유 딜러 최대 HP 15~35% · 큰 파티 치유 40~50% · 재생은 다 합쳐 30~60%.
     (같은 성직자 공통 스킬도 대주교 · 명의는 마법 공격력이 HP보다 빨리 커서 더 크게 들어간다. 측정 scratchpad/v83 — CLAUDE.md 「회복 개편」)
     (빌드 68까지는 Lv1에서도 기도 한 번이 탱커 HP 70~115%, 대치유 110~180%, 집중 치료 합이 170%였다 — 거의 다 넘쳐 버렸다)
   사제계열(성직자 → 사제 · 대주교 / 역병의사 · 명의 / 퇴마사 · 심판관)의 직업 치유량(tr.healPow)과 신성학 숙련도 낮췄다 → 축복의 보호막은 세기가 그대로이게 계수를 올렸다.
   build.py에서 data-cut69.js 다음 · data-store.js 앞: 응급 처치(공용 → 성직자 공통)는 찢어진 스킬북 → 낡은 스킬북으로, 회복 스킬북은 뽑기 등급이 한 칸 드물다(HEAL_BOOK).
   옛 저장: econ.js heal69(불러올 때마다 — 이제 못 배우는 응급 처치 · 치유의 찬가 · 재기를 지우고 스킬북 · 수업료를 돌려준다) · notes69b */
// 같은 직업 안 스킬끼리의 크기 차례는 그대로 두되 간격은 줄였다 (예전 비율의 제곱근쯤 — 광역 치유 1 : 회복의 빛 1.15 : 기적 1.3 : 생명의 축복 1.6 : 창세의 빛 2.1)
const HEAL69 = {   // 스킬: 바꾼 값 (예전 값은 HEAL69_OLD에 남는다)
  heal:        { mult: 0.7 },                  // 치유 (성직자 기본)         2 → 0.7
  prayer:      { mult: 0.8 },                  // 기도 (사제 기본)           2.6 → 0.8
  firstaid:    { cls: ['cleric'], mult: 0.5 }, // 응급 처치: 공용 → 성직자 공통 · 0.8 → 0.5
  greatheal:   { mult: 1 },                    // 대치유                     4 → 1
  massheal:    { mult: 0.35 },                 // 광역 치유                  0.9 → 0.35
  revival:     { mult: 0.55 },                 // 생명의 축복                2.2 → 0.55
  restore:     { mult: 0.4 },                  // 회복의 빛                  1.2 → 0.4
  sacredsong:  { mult: 0.5 },                  // 소생의 기도                2 → 0.5
  miracle:     { mult: 0.45 },                 // 기적 (대주교 기본)         1.6 → 0.45
  dawnlight:   { mult: 0.75 },                 // 창세의 빛                  4 → 0.75
  resurrect:   { pct: 0.25 },                  // 부활: 최대 HP 40% → 25%로 일으킨다
  cureall:     { mult: 0.75 },                 // 명의의 손 (명의 기본)      3.5 → 0.75
  remedy:      { mult: 0.14 },                 // 재생 처방: 초당 0.5 → 0.14 (10초)
  regenall:    { mult: 0.03 },                 // 집중 치료: 초당 0.45 → 0.03 (12초)
  panacea:     { mult: 0.4 },                  // 만병통치약                 1.2 → 0.4
  elixir:      { mult: 0.7 },                  // 불사의 영약                3.5 → 0.7
  layhands:    { mult: 1.8 },                  // 치유의 손길 (성기사)       2.5 → 1.8
  waterspirit: { mult: 0.2 },                  // 물의 정령 (정령술사)       1.2 → 0.2
  hymn:        { mult: 0.4 },                  // 치유의 세레나데 (음유시인) 0.9 → 0.4
  overture:    { mult: 0.55 },                 // 서곡 (마에스트로)          2 → 0.55
  medkit:      { pct: 0.06 },                  // 약상자: 최대 HP 15% → 6%
  shieldbag:   { pct: 0.05 },                  // 보급품 나눠 주기: 10% → 5%
  rations:     { pct: 0.008 },                 // 비상식량: 초당 1.5% → 0.8%
  bloodthirst: { pct: 0.1 },                   // 피의 갈증 (자기): 25% → 10%
  secondwind:  { lv: 150, pct: 0.15 },         // 재기 (공용 · 자기): Lv55 → Lv150 · 30% → 15%
  bloodfeast:  { drain: 0.12 },                // 피의 만찬: 준 피해의 30% → 12% 흡혈
  soulreap:    { drain: 0.12 },                // 영혼 수확: 30% → 12%
  drain:       { drain: 0.15 },                // 생명 흡수: 35% → 15%
  soulrend:    { drain: 0.15 },                // 영혼 찢기: 35% → 15%
  chant:       { cls: ['cleric'], lv: 50, add: 0.2 },   // 치유의 찬가: 성직자 · 궁수 → 성직자 공통 · Lv20 → Lv50 · 받는 회복 +30% → +20%
  grace:       { add: 0.15 },                  // 신의 은총: 받는 회복 +20% → +15%
  guardian:    { passive: { hpPct: 0.1 } },    // 수호자: 최대 HP +15% → +10%
  toughness:   { passive: { hpPct: 0.05 } },   // 강인함: +8% → +5%
  devotion:    { passive: { hpPct: 0.12 } },   // 헌신: +20% → +12%
  campcraft:   { passive: { hpPct: 0.05, eva: 0.04 } },     // 야영 기술: 최대 HP +8% → +5%
  pioneerwit:  { passive: { healPow: 0.08, camp: 0.2 } },   // 개척민의 지혜: 치유량 +15% → +8%
  holyshield:  { mult: 2.3 }                   // 축복의 보호막: 사제 치유량 · 신성학이 줄어 그대로의 세기가 되게 1.8 → 2.3
};
// 숫자가 들어간 스킬 설명
const HEAL69_DESC = {
  guardian: '최대 HP가 10% 오른다.', toughness: '최대 HP가 5% 오른다.', devotion: '최대 HP가 12% 오른다.', campcraft: '최대 HP 5%, 회피 4%p가 오른다.',
  secondwind: '최대 HP의 15%를 회복한다.', bloodthirst: '최대 HP의 10%를 회복한다.',
  shieldbag: '보급품을 돌려 파티의 HP를 최대 HP의 5%씩 채우고 상태이상을 하나씩 푼다.', medkit: '가장 다친 동료의 HP를 최대 HP의 6%만큼 채우고 출혈 · 중독을 푼다.',
  rations: '10초 동안 파티가 1초마다 최대 HP의 0.8%씩 회복하고, 상태이상을 하나씩 푼다.', pioneerwit: '회복과 보호막이 8% 세지고, 야영 회복이 20% 빨라진다.',
  grace: '10초 동안 파티가 받는 회복량이 15% 늘어난다.', holyshield: '20초 동안 파티 전원에게 마법 공격력 ×2.3만큼의 보호막을 씌운다.',
  resurrect: '쓰러진 동료를 최대 HP의 25%로 일으킨다. 싸움마다 한 번, 부상도 남지 않는다.',
  remedy: '가장 다친 동료가 10초 동안 초당 마법 공격력 ×0.14씩 회복한다.', regenall: '12초 동안 파티 전원이 초당 마법 공격력 ×0.03씩 회복한다.',
  elixir: '파티 전원을 크게 치료하고 모든 상태이상을 푼다.', firstaid: '다친 동료를 조금 치료한다. 성직자 계열의 첫 응급 치료.'
};
const HEAL69_OLD = {};
for (const [id, o] of Object.entries(HEAL69)) {
  const s = SKILLS[id]; if (!s) continue;
  HEAL69_OLD[id] = {};
  for (const k of Object.keys(o)) { HEAL69_OLD[id][k] = s[k] && typeof s[k] === 'object' ? JSON.parse(JSON.stringify(s[k])) : s[k]; s[k] = o[k] && typeof o[k] === 'object' ? JSON.parse(JSON.stringify(o[k])) : o[k]; }
  if (HEAL69_DESC[id]) s.desc = HEAL69_DESC[id];
}
// 직업 치유량 · 흡혈 · 흡수 (tr) — 사제계열 · 성기사의 치유량, 광전사 · 네크로맨서 계열의 흡혈, 퇴마사 계열의 성스러운 흡수
const HEAL69_TR = {
  priest: { healPow: 1.15 }, archbishop: { healPow: 1.15 }, plaguedoc: { healPow: 1.05 }, physician: { healPow: 1.05 }, paladin: { healPow: 1.1 },
  berserker: { lifesteal: 0.06 }, bloodlord: { lifesteal: 0.09 }, necromancer: { mdrain: 0.06 }, lich: { mdrain: 0.09 }, exorcist: { pdrain: 0.1 }, inquisitor: { pdrain: 0.14 }
};
const HEAL69_TR_OLD = {};
for (const [c, o] of Object.entries(HEAL69_TR)) { const T = CLASSES[c] && CLASSES[c].tr; if (!T) continue; HEAL69_TR_OLD[c] = {}; for (const k in o) { HEAL69_TR_OLD[c][k] = T[k]; T[k] = o[k]; } }
CLASSES.priest.desc = '순수 치유·보호. 치유량 ×1.15, 축복의 보호막으로 파티를 감싼다.';
CLASSES.necromancer.desc = '지속딜. 저주와 역병이 다른 마법을 쓰는 동안에도 적을 깎는다(지속 피해 ×1.2). 마법 피해의 6%를 흡수.';
CLASSES.exorcist.desc = '전투 사제(혼합). 마법 피해의 10%만큼 가장 다친 동료가 회복한다. 보스에게 강하다.';
CLASSES.inquisitor.desc = '신의 이름으로 심판한다. 때릴수록 파티가 산다(흡수 14%).';
// 특성의 HP 재생 (초당 최대 HP의 %) — 건강함 1% → 0.5% · 죽음의 인장 0.5% → 0.3% · 불사의 인장 1% → 0.5%
const HEAL69_TRAIT = { healthy: { hpRegen: 0.005, desc: '초당 HP 0.5% 재생' }, j_necromancer: { hpRegen: 0.003, desc: '마법 공격력 +6% · 초당 HP 0.3% 재생' }, j_lich: { hpRegen: 0.005, desc: '마법 공격력 +10% · 초당 HP 0.5% 재생' } };
for (const [k, o] of Object.entries(HEAL69_TRAIT)) { if (TRAITS[k]) Object.assign(TRAITS[k], o); const jc = k.startsWith('j_') ? k.slice(2) : null; if (jc && JOB_TRAITS[jc]) Object.assign(JOB_TRAITS[jc], o); }
// 숙련: 갑옷 숙련 최대 HP · 신성학 치유량 · 금서 해독 마법 흡수
MASTERY.plate.fx = [{ hpPct: 0.03 }, { hpPct: 0.05, defPct: 0.03 }, { hpPct: 0.07, defPct: 0.06 }, { hpPct: 0.09, defPct: 0.08 }];
MASTERY.holy.fx = [{ healPow: 0.03 }, { healPow: 0.06 }, { healPow: 0.09 }, { healPow: 0.12 }];
MASTERY.tome.fx = MASTERY.tome.fx.map((f, i) => (f.mdrain ? Object.assign({}, f, { mdrain: [0, 0.02, 0.04, 0.06][i] }) : f));
// 새 숙련 「신성력」: 사제계열 · 성기사 — 싸우는 동안에도 자기 HP가 조금씩 차오른다 (초당 최대 HP의 0.2 · 0.4 · 0.6 · 0.8%, core.js deriveBase hpRegen)
// 그림: data-masticon.js MASTICON.divine = 시안 저장소 dot/m_v69c.py B안 「세 색 빛살」(11-13 19:40 사용자 「B로」) — icon은 그림이 없을 때 쓰는 임시 물건 그림
MASTERY.divine = { name: '신성력', job: ['cleric', 'paladin'], icon: 'amulet', fx: [{ hpRegen: 0.002 }, { hpRegen: 0.004 }, { hpRegen: 0.006 }, { hpRegen: 0.008 }], desc: '몸에 깃든 신성한 힘. 싸우는 동안에도 자기 HP가 조금씩 차오른다.' };
MAST_IDS.push('divine');
// 회복 스킬북은 뽑기 등급이 한 칸 드물다 (data-store.js — 흔함 → 보통 → 드묾 → 희귀 → 전설)
const HEAL_BOOK = new Set(['massheal', 'firstaid', 'greatheal', 'revival', 'restore', 'sacredsong', 'dawnlight', 'resurrect', 'remedy', 'regenall', 'panacea', 'elixir', 'layhands', 'waterspirit', 'hymn', 'overture', 'medkit', 'shieldbag', 'rations', 'bloodthirst', 'secondwind', 'soulreap', 'chant', 'grace', 'pioneerwit']);
const HEAL_LEGEND_W = 0.25;   // 이미 전설(Lv90 이상)인 회복 스킬북의 무게 (전설 0.4보다 드물게)
// 옛 저장에서 이제 못 배우는 스킬 (econ.js heal69): 응급 처치(성직자 계열만) · 치유의 찬가(성직자 계열 · Lv50) · 재기(Lv150)
const HEAL69_LEARN = ['firstaid', 'chant', 'secondwind'];

// 빌드 69 회복 개편 알림 (옛 저장 — econ.js notes69b)
STORY.v69b = [
  '회복 스킬을 다시 맞췄다 — 스킬을 Lv5까지 올리고 숙련도까지 찬 때를 기준으로, 한 번에 넘치던 회복을 줄였다. 자주 쓰는 치유는 탱커 HP의 15~25%, 큰 치유는 30~45%, 파티 치유는 딜러 HP의 15~35%쯤.',
  '응급 처치는 성직자 계열 스킬이 됐고(낡은 스킬북), 치유의 찬가는 성직자 계열 Lv50부터, 재기는 Lv150부터 배운다. 자기 회복 · 흡혈 스킬(피의 갈증 · 재기 · 피의 만찬 · 생명 흡수 · 영혼 찢기 · 영혼 수확)은 그대로 두고 수치를 줄였다.',
  '사제 · 대주교 · 역병의사 · 명의 · 성기사의 치유량, 광전사 · 네크로맨서 계열의 흡혈, 퇴마사 계열의 성스러운 흡수, 최대 HP를 올리는 패시브(수호자 · 강인함 · 헌신 · 야영 기술)와 숙련(갑옷 숙련 · 신성학 · 금서 해독)도 낮췄다. 회복 스킬북은 뽑기에서 한 칸 드물게 나온다.',
  '새 숙련 「신성력」: 성직자 계열 · 성기사가 훈련소에서 배운다. 싸우는 동안에도 자기 HP가 초당 0.2 · 0.4 · 0.6 · 0.8%씩 차오른다.'
];
