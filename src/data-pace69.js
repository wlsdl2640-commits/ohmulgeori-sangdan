/* ───────── 회복 방식 · 스킬 재사용 늘리기 · 기본 공격 (빌드 69, 11-15 20:20 · 21:36 사용자 — 계획 문서 「물어볼 것 (11-15 12:30)」 · 「(11-15 밤 2)」) ─────────
   1 원칙 「좋은 거 같아」 — 성직자 계열은 계열마다 회복 방식 하나:
       사제 → 대주교 = 직접 치유(한 사람 큰 치유 · 파티 치유) · 역병의사 → 명의 = 재생 · 상태이상 풀기 · 퇴마사 → 심판관 = 흡수 · 보호(그대로).
       공통 치유(치유)는 작은 기본기, 기도는 조금 작게.
   2 「사실 10초도 빠른 것 같아. 모든 스킬의 기본 쿨타임을 더 늘려보자. 기본공격의 쿨타임은 줄이고.」
       → 모든 스킬의 재사용 ×2 (s.cd0 = 예전 값) · 기본 공격 5 → 3초(data-rpg.js BASIC_CD) · 강화 · 도발 · 지속 피해 · 때린 뒤 강화는 지속도 ×2(걸려 있는 시간 몫 그대로) ·
         공격 스킬 한 방은 차수마다 공용 · 1차 ×1 · 2차 ×1.3 · 3차 · 4차 ×1.6(낮은 차수는 빨라진 기본 공격이 메운다 — 허수아비 피해가 지금과 ±10%) ·
         치유 · 재생 · 보호막 한 번 양 ×1.4(초당 회복은 70%쯤 — 드물지만 크게) · 숙련도는 한 번을 두 번으로 · 몬스터 스킬 · 몬스터 기본 공격 · 펫 · 상태이상 지속은 그대로.
         재 본 값(같은 레벨 파티가 제 땅을 밀어 도달, 47파티 × 4번): 힐러 파티 Lv12 ~ 45 −1.8 · Lv60 ~ 90 −1.2 · Lv100 ~ 130 −0.4 · Lv146 30층 −0.9, 힐러 없음 −0.1 ~ −0.8,
         딜러 스킬 1분에 37 → 22번 · 기본 공격 몫 21 → 35%.
   3 「응 그렇게 해보자」 — 회복의 빛 → 가장 다친 둘(low2) · 소생의 기도 → HP 40% 아래 동료 모두(danger) · 명의의 손 → 재생 · 생명의 축복 → 파티 재생.
       core.js pickSkill · cast: low2 · danger 대상, 재생의 urgent(급하면 직접 치유처럼 · 다른 재생과 겹쳐도) · 한 사람 재생은 아직 안 걸린 가장 다친 동료에게.
   빌드 69 밤 (11-15 21:36 사용자 「ㄱㄱ」 — 계획 문서 「물어볼 것 (11-15 밤 2)」): 1 기본 공격 8초 「ㅇㅇ 넣어봐」 · 2 한 방 「스킬이 더 강함으로」 ·
       3 차수별 재사용 「ㅇㅇ 근데 너무 길어 조금 완화」 · 4 「마법사, 사제의가 스킬에 사용하는 MP를 늘리자」 · 5 「공격속도는 … 실행되어 타격까지 이어지는 그 시간이 줄어들게,
       기본공격 쿨타임 감소는 기본공격을 다시 하기까지의 대기시간」 → 위 2의 ×2 · 3초를 바꿨다:
       재사용 차수별 PACE69.cdT ×2 · 2 · 2 · 2.25 · 2.5 (공격 스킬 powT · 회복 healT도 차수별) · 기본 공격 = 쿨타임 8초 − 쿨타임 감소(가장 짧게 1.5초) + 실행 1초 ÷ 공격 속도
       (data-rpg.js BASIC69 · core.js basicCd · basicExec · battle 'swing') · 한 방 ×1.4(BASIC_MULT 3.5 · BASIC_MAGIC 2.94) · 예전 「공격 속도 +%」 효과는 쿨타임 감소(초)로(아래 BASIC69_DESC) ·
       마법사 · 성직자 계열 스킬 MP ×min(8, 2 + 레벨 ÷ 8)(아래 MP69) · 낮은 땅 힐러 파티는 Lv1 ~ 47 몬스터를 약하게(data-monup69.js MON_MUL69).
   측정: tools/saved/stat69/v99 · v101 (README). build.py에서 data-skjob68.js 다음 (스킬이 다 생기고 skJob 차수를 쓸 수 있는 뒤 — data-store.js · data-skjob68.js는 kind · cd · mult를 안 본다). */
const HEAL_DANGER = 0.4;   // 소생의 기도: 이 HP 몫 아래 동료를 모두

// 성직자 계열 회복 손질 (예전 값은 CLERIC69_OLD)
const CLERIC69 = {
  heal:       { mult: 0.42 },                                        // 치유 (성직자 공통 · 기본기): 0.7 → 0.42 — 작게
  prayer:     { mult: 0.52 },                                        // 기도 (사제 기본): 0.8 → 0.52
  restore:    { tgt: 'low2', mult: 0.55 },                           // 회복의 빛: 파티 → 가장 다친 둘 · 0.4 → 0.55 (한 사람마다)
  sacredsong: { tgt: 'danger', mult: 0.73 },                         // 소생의 기도: 파티 → HP 40% 아래 동료 모두 · 0.5 → 0.73 (탱커 HP 35%쯤)
  cureall:    { kind: 'regen', mult: 0.14, dur: 6, urgent: 1 },      // 명의의 손: 바로 치유 ×0.75 → 재생 6초 · 초당 ×0.14 (합 ×0.84)
  revival:    { kind: 'regen', mult: 0.07, dur: 8, urgent: 1 }       // 생명의 축복: 파티 치유 ×0.55 → 파티 재생 8초 · 초당 ×0.07 (합 ×0.56)
};
const CLERIC69_DESC = {
  restore: '가장 다친 동료 둘을 치료한다.',
  sacredsong: `HP가 ${Math.round(HEAL_DANGER * 100)}% 아래로 떨어진 동료를 모두 크게 치료한다.`,
  cureall: '어떤 상처도 꿰매는 손. 가장 다친 동료가 6초 동안 초당 마법 공격력 ×0.14씩 회복한다.',
  revival: '8초 동안 파티 전원이 초당 마법 공격력 ×0.07씩 회복한다.'
};
const CLERIC69_OLD = {};
for (const [id, o] of Object.entries(CLERIC69)) {
  const s = SKILLS[id]; if (!s) continue;
  CLERIC69_OLD[id] = { desc: s.desc };
  for (const k of Object.keys(o)) { CLERIC69_OLD[id][k] = s[k]; s[k] = o[k]; }
  if (CLERIC69_DESC[id]) s.desc = CLERIC69_DESC[id];
}

// 스킬 재사용 · 지속 · 세기 (모든 모험가 스킬 — 몬스터 스킬 MSK · 몬스터 기본 공격 · 펫은 따로) — 차수마다 [공용, 1차 계열, 2차, 3차, 4차] (skJob(id).tier)
//   빌드 69 밤 (11-15 21:36 「차수별 재사용 — ㅇㅇ 근데 너무 길어 조금 완화」 · 21:13 「2차스킬보다, 3차 스킬의 쿨을 좀 더 올리고」):
//   cdT: 재사용 × (강화 · 도발 · 지속 피해 · 때린 뒤 강화의 지속도 같은 배 — 걸려 있는 시간 몫 그대로 · 숙련도도 한 번을 그만큼으로) — 시안 ×2 · 2 · 2 · 2.5 · 3에서 3차 · 4차를 덜었다
//   powT: 공격 스킬(물리 · 마법 · 지속 피해) 한 방 × (허수아비 피해가 빌드 69 오전과 ±10%가 되게 맞춤 — tools/saved/stat69/v101) ·
//   healT: 치유 · 재생 · 보호막 한 번 양 × (마법 공격력 계수 · 최대 HP % 모두, 자기 회복 포함) — 재사용 배의 0.7배라 회복은 초당 70%쯤
const PACE69 = { cdT: [2, 2, 2, 2.25, 2.5], powT: [1.4, 1.4, 1.9, 1.75, 1.75], healT: [1.4, 1.4, 1.4, 1.6, 1.75] };
const paceTier = id => Math.max(0, Math.min(4, (skJob(id) || {}).tier || 0));
const paceSm = id => (SKILLS[id] && SKILLS[id].pk) || PACE69.cdT[0];   // 숙련도: 한 번 쓸 때 오르는 몫 (core.js cast — 재사용이 길어진 만큼, 오르는 빠르기는 그대로)
const PACE69_DUR = ['buff', 'taunt', 'dot'];       // 지속도 늘리는 종류 (보호막 · 재생은 한 번 양이 정해져 있어 그대로)
const PACE69_POW = ['dmg', 'mdmg', 'dot'];         // 한 방을 키우는 종류
const PACE69_HEAL = ['heal', 'regen', 'shield'];   // 한 번 양을 PACE69.healT로 (부활은 그대로)
const paceSec = v => Math.round(v * 10) / 10, paceMul = v => Math.round(v * 1000) / 1000;
const paceDesc = (s, a, b) => { if (s.desc && a !== b && !s.desc.includes(b)) s.desc = s.desc.split(a).join(b); };   // 설명 글의 숫자도 같이
for (const id in SKILLS) {
  const s = SKILLS[id], tier = paceTier(id), k = PACE69.cdT[tier];
  s.pk = k; s.ptier = tier;   // 차수 배 · 차수 (숙련도 paceSm · 스킬 MP mpMul69가 본다)
  if (s.cd) { s.cd0 = s.cd; s.cd = paceSec(s.cd * k); }
  if (s.dur && PACE69_DUR.includes(s.kind)) { s.dur0 = s.dur; s.dur = paceSec(s.dur * k); paceDesc(s, `${s.dur0}초 동안`, `${s.dur}초 동안`); }
  [s.after, s.after2].forEach(A2 => {   // 때린 뒤 강화 (서부로! · 세기의 마술쇼 · 심해의 포효) — 와이번 강하 · 해일의 내려앉음(ground)은 그대로
    if (!A2 || !A2.dur || A2.stat === 'ground') return;
    A2.dur0 = A2.dur; A2.dur = paceSec(A2.dur * k); paceDesc(s, `${A2.dur0}초 동안`, `${A2.dur}초 동안`);
  });
  const pw = PACE69_POW.includes(s.kind) ? PACE69.powT[tier] : PACE69_HEAL.includes(s.kind) ? PACE69.healT[tier] : 1;
  if (s.mult && pw !== 1) { s.mult0 = s.mult; s.mult = paceMul(s.mult * pw); paceDesc(s, `마법 공격력 ×${s.mult0}`, `마법 공격력 ×${s.mult}`); }   // 재생 · 보호막 설명의 계수 (공격 스킬 설명의 ×는 짐승 · 괴수 특공이라 건드리지 않는다)
  if (s.pct && PACE69_HEAL.includes(s.kind) && pw !== 1) {   // 최대 HP %로 채우는 회복 · 보호막 (피의 갈증 · 재기 · 수호의 방패 · 짐칸 방패 …)
    s.pct0 = s.pct; s.pct = Math.round(s.pct * pw * 10000) / 10000;
    const P0 = Math.round(s.pct0 * 1000) / 10, P1 = Math.round(s.pct * 1000) / 10;
    paceDesc(s, `HP의 ${P0}%`, `HP의 ${P1}%`); paceDesc(s, `HP ${P0}%`, `HP ${P1}%`);
  }
}

/* 기본 공격 쿨타임 감소로 바뀐 예전 「공격 속도」 효과의 설명 (빌드 69 밤 — data-rpg.js BASIC69): 패시브 · 특성 +% → ×pct초, 강화 스킬 배율 → (배율 − 1) × buff초 */
const b69Sec = v => `${Math.round(v * 100) / 100}초`;
const b69P = s => b69Sec(s.passive.spdPct * BASIC69.pct), b69H = m => b69Sec((m - 1) * BASIC69.buff);
const b69pp = v => `${Math.round(v * 100)}%p`, b69pc = v => `${Math.round(v * 100)}%`;
const BASIC69_DESC = {
  quickstep: s => `회피율 ${b69pp(s.passive.eva)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄어든다.`,
  haste: s => `기본 공격 쿨타임이 ${b69P(s)} 줄어든다.`,
  rhythm: s => `기본 공격 쿨타임이 ${b69P(s)} 줄고 스킬 재사용 감소 ${b69pc(s.passive.cdr)}가 오른다.`,
  crowd: s => `공격력 ${b69pc(s.passive.atkPct)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄어든다.`,
  frenzy: s => `공격력 ${b69pc(s.passive.atkPct)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄어든다.`,
  instinct: s => `회피 ${b69pp(s.passive.eva)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄며 늑대가 무는 피해가 ${b69pc(s.passive.petDmg)} 는다.`,
  dragonblood: s => `치명타 ${b69pp(s.passive.crit)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄며 와이번의 공격 피해가 ${b69pc(s.passive.petDmg)} 는다.`,
  killer: s => `치명타 확률 ${b69pp(s.passive.crit)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄어든다.`,
  dancemaster: s => `회피율 ${b69pp(s.passive.eva)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄어든다.`,
  deepblood: s => `치명타 ${b69pp(s.passive.crit)}, 물 속성 피해 ${b69pc(s.passive.el_water)}가 오르고 기본 공격 쿨타임이 ${b69P(s)} 줄어든다.`,
  berserk: s => `HP를 깎아 ${s.dur}초 동안 공격력을 크게 올리고 기본 공격 쿨타임을 ${b69H(s.haste)} 줄인다.`,
  warcry: s => `${s.dur}초 동안 파티의 공격력을 올리고 기본 공격 쿨타임을 ${b69H(s.haste)} 줄인다.`,
  rampage: s => `HP를 크게 깎아 ${s.dur}초 동안 공격력이 거의 두 배가 되고 기본 공격 쿨타임이 ${b69H(s.haste)} 준다.`,
  bloodmoon: s => `HP를 바쳐 ${s.dur}초 동안 공격력이 두 배가 되고 기본 공격 쿨타임이 ${b69H(s.haste)} 준다.`,
  camouflage: s => `늑대가 고개를 젖혀 운다. ${s.dur}초 동안 파티의 공격력이 오르고 기본 공격 쿨타임이 ${b69H(s.haste)} 준다.`,
  marchsong: s => `${s.dur}초 동안 파티의 회피율을 올리고 기본 공격 쿨타임을 ${b69H(s.haste)} 줄인다.`,
  grandfinale: s => `${s.dur}초 동안 파티의 공격력이 크게 오르고 기본 공격 쿨타임이 ${b69H(s.haste)} 준다.`,
  manaburst: s => `${s.dur}초 동안 공격력이 크게 오르고 기본 공격 쿨타임이 ${b69H(s.haste)} 준다.`,
  westward: s => `웨건이 모든 적을 들이받고(기절 ${b69pc(s.sta.p)}), ${s.after.dur}초 동안 파티의 기본 공격 쿨타임이 ${b69H(s.after.mult)} 준다.`,
  medkit: s => `물통을 돌려 파티 모두의 피로를 ${s.fat} 덜고, ${s.dur}초 동안 기본 공격 쿨타임을 ${b69H(s.mult)} 줄인다. 피로가 ${s.fatNeed || 20} 넘은 동료가 있을 때 쓴다.`
};
['roar', 'ballad', 'symphony', 'drumbeat', 'thieveshonor'].forEach(id => { BASIC69_DESC[id] = BASIC69_DESC.warcry; });
['gallop'].forEach(id => { BASIC69_DESC[id] = BASIC69_DESC.marchsong; });
for (const [id, f] of Object.entries(BASIC69_DESC)) if (SKILLS[id]) SKILLS[id].desc = f(SKILLS[id]);
if (TRAITS.quick) TRAITS.quick.desc = `기본 공격 쿨타임 −${b69Sec(TRAITS.quick.spdPct * BASIC69.pct)}`;
if (TRAITS.j_ninja) TRAITS.j_ninja.desc = `회피 +${b69pp(TRAITS.j_ninja.eva)} · 기본 공격 쿨타임 −${b69Sec(TRAITS.j_ninja.spdPct * BASIC69.pct)}`;

/* 스킬 MP (빌드 69 밤, 11-15 21:36 사용자 「마법사, 사제의가 스킬에 사용하는 MP를 늘리자」): 마법사 · 성직자 계열(jobBase mage · cleric)이 쓰는 스킬은 MP × min(max, k0 + 레벨 ÷ per)
   — 두 계열은 지능이 높아 최대 MP가 물리 직업의 6 ~ 10배라 스킬 MP가 거의 안 들었다(싸움 중 MP 98 ~ 100%). 최대 MP는 레벨과 함께 크게 늘어 낮은 레벨은 덜 곱한다:
   Lv12 ×3.5 · Lv30 ×5.75 · Lv48부터 ×8 → 싸움 중 MP 75 ~ 90%쯤(긴 싸움에서는 바닥이 보인다 — tools/saved/stat69/v101). core.js pickSkill · cast · panels.js · skillinfo.js가 skMp를 본다 */
const MP69 = { lines: ['mage', 'cleric'], k0: 2, per: 8, max: 8 };
const mpLine69 = a => !!a && MP69.lines.includes(jobBase(a.cls));
const mpMul69 = a => Math.min(MP69.max, MP69.k0 + (a.lv || 1) / MP69.per);
const skMp = (a, s) => { const m = (s && s.cost && s.cost.mp) || 0; return m && mpLine69(a) ? Math.round(m * mpMul69(a)) : m; };
const mpMulTxt = a => `×${Math.round(mpMul69(a) * 100) / 100}`;

STORY.v69h = [
  '성직자 계열의 회복 방식이 갈렸다 — 사제 → 대주교는 직접 치유, 역병의사 → 명의는 재생과 상태이상 풀기, 퇴마사 → 심판관은 흡수와 보호. 치유는 작은 기본기가 됐고 기도도 조금 작아졌다.',
  `회복의 빛은 가장 다친 동료 둘을, 소생의 기도는 HP가 ${Math.round(HEAL_DANGER * 100)}% 아래로 떨어진 동료를 모두 크게 치료한다. 명의의 손은 6초 동안 이어지는 재생이, 생명의 축복은 8초 동안 이어지는 파티 재생이 됐다.`,
  `싸움의 리듬이 바뀌었다 — 스킬 재사용 대기시간이 공용 · 1차 · 2차 스킬 ${PACE69.cdT[2]}배 · 3차 ${PACE69.cdT[3]}배 · 4차 ${PACE69.cdT[4]}배로 길어지고, 강화 · 도발 · 지속 피해도 그만큼 오래 간다. 그 대신 공격 스킬 한 방이 1차 ×${PACE69.powT[1]} · 2차 ×${PACE69.powT[2]} · 3차 ×${PACE69.powT[3]} · 4차 ×${PACE69.powT[4]}, 치유 · 재생 · 보호막 한 번이 ×${PACE69.healT[1]} ~ ×${PACE69.healT[4]}만큼 크다. 숙련도가 오르는 빠르기는 그대로.`,
  `기본 공격은 쿨타임 ${BASIC69.base}초가 돌면 휘두르기 시작해 ${BASIC69.exec}초 ÷ 공격 속도만에 맞힌다. 쿨타임은 직업 · 전직(차수마다 ${BASIC69.tier}초) · 민첩(${BASIC69.agiStep}점마다 ${BASIC69.agi}초) · 「신속」 같은 지속 스킬 · 특성 · 숙련 · 신속의 룬 · 강화 스킬이 몇 초씩 줄이고(가장 짧게 ${BASIC69.floor}초), 공격 속도는 민첩이 올린다(1점마다 ${Math.round(BASIC69.aspd * 1000) / 10}%). 예전의 「공격 속도 +%」 효과는 이제 기본 공격 쿨타임을 줄인다(+10% → −${b69Sec(0.1 * BASIC69.pct)}). 한 방은 공격력 ×${BASIC_MULT}(마법 ×${BASIC_MAGIC})로 세졌지만 스킬 한 번이 더 세다.`,
  `마법사 · 성직자 계열은 스킬에 MP를 더 쓴다 — ×(${MP69.k0} + 레벨 ÷ ${MP69.per}), Lv${Math.ceil((MP69.max - MP69.k0) * MP69.per)}부터 ×${MP69.max}. 최대 MP가 큰 만큼 아껴 써야 하고, 긴 싸움에서는 MP 물약 · MP 회복이 쓸모 있다.`
];
