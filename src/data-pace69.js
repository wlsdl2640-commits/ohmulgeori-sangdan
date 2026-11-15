/* ───────── 회복 방식 · 스킬 재사용 늘리기 · 기본 공격 빠르게 (빌드 69, 11-15 20:20 사용자 — 계획 문서 「물어볼 것 (11-15 12:30)」) ─────────
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
   측정: tools/saved/stat69/v99 (README). build.py에서 data-skjob68.js 다음 (스킬이 다 생기고 skJob 차수를 쓸 수 있는 뒤 — data-store.js · data-skjob68.js는 kind · cd · mult를 안 본다). */
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

// 스킬 재사용 · 지속 · 세기 (모든 모험가 스킬 — 몬스터 스킬 MSK · 몬스터 기본 공격 · 펫은 따로)
//   cd: 재사용 × · dur: 강화 · 도발 · 지속 피해 · 때린 뒤 강화의 지속 × (걸려 있는 시간 몫 그대로) ·
//   powT: 공격 스킬(물리 · 마법 · 지속 피해) 한 방 × — 차수마다 [공용, 1차 계열, 2차, 3차, 4차] (skJob(id).tier — 낮은 차수는 빨라진 기본 공격이 메운다) ·
//   heal: 치유 · 재생 · 보호막 한 번 양 × (마법 공격력 계수 · 최대 HP % 모두, 자기 회복 포함) — 재사용 ×2에 ×1.4라 회복은 초당 70%쯤
const PACE69 = { cd: 2, dur: 2, powT: [1, 1, 1.3, 1.6, 1.6], heal: 1.4 };
const PACE69_SM = PACE69.cd;                       // 숙련도: 한 번 쓸 때 오르는 몫 (core.js cast — 재사용이 길어진 만큼, 오르는 빠르기는 그대로)
const PACE69_DUR = ['buff', 'taunt', 'dot'];       // 지속도 늘리는 종류 (보호막 · 재생은 한 번 양이 정해져 있어 그대로)
const PACE69_POW = ['dmg', 'mdmg', 'dot'];         // 한 방을 키우는 종류
const PACE69_HEAL = ['heal', 'regen', 'shield'];   // 한 번 양을 PACE69.heal로 (부활은 그대로)
const paceSec = v => Math.round(v * 10) / 10, paceMul = v => Math.round(v * 1000) / 1000;
const paceDesc = (s, a, b) => { if (s.desc && a !== b && !s.desc.includes(b)) s.desc = s.desc.split(a).join(b); };   // 설명 글의 숫자도 같이
for (const id in SKILLS) {
  const s = SKILLS[id], tier = Math.max(0, Math.min(4, (skJob(id) || {}).tier || 0));
  if (s.cd) { s.cd0 = s.cd; s.cd = paceSec(s.cd * PACE69.cd); }
  if (s.dur && PACE69_DUR.includes(s.kind)) { s.dur0 = s.dur; s.dur = paceSec(s.dur * PACE69.dur); paceDesc(s, `${s.dur0}초 동안`, `${s.dur}초 동안`); }
  [s.after, s.after2].forEach(A2 => {   // 때린 뒤 강화 (서부로! · 세기의 마술쇼 · 심해의 포효) — 와이번 강하 · 해일의 내려앉음(ground)은 그대로
    if (!A2 || !A2.dur || A2.stat === 'ground') return;
    A2.dur0 = A2.dur; A2.dur = paceSec(A2.dur * PACE69.dur); paceDesc(s, `${A2.dur0}초 동안`, `${A2.dur}초 동안`);
  });
  const pw = PACE69_POW.includes(s.kind) ? PACE69.powT[tier] : PACE69_HEAL.includes(s.kind) ? PACE69.heal : 1;
  if (s.mult && pw !== 1) { s.mult0 = s.mult; s.mult = paceMul(s.mult * pw); paceDesc(s, `마법 공격력 ×${s.mult0}`, `마법 공격력 ×${s.mult}`); }   // 재생 · 보호막 설명의 계수 (공격 스킬 설명의 ×는 짐승 · 괴수 특공이라 건드리지 않는다)
  if (s.pct && PACE69_HEAL.includes(s.kind) && pw !== 1) {   // 최대 HP %로 채우는 회복 · 보호막 (피의 갈증 · 재기 · 수호의 방패 · 짐칸 방패 …)
    s.pct0 = s.pct; s.pct = Math.round(s.pct * pw * 10000) / 10000;
    const P0 = Math.round(s.pct0 * 1000) / 10, P1 = Math.round(s.pct * 1000) / 10;
    paceDesc(s, `HP의 ${P0}%`, `HP의 ${P1}%`); paceDesc(s, `HP ${P0}%`, `HP ${P1}%`);
  }
}

STORY.v69h = [
  '성직자 계열의 회복 방식이 갈렸다 — 사제 → 대주교는 직접 치유, 역병의사 → 명의는 재생과 상태이상 풀기, 퇴마사 → 심판관은 흡수와 보호. 치유는 작은 기본기가 됐고 기도도 조금 작아졌다.',
  `회복의 빛은 가장 다친 동료 둘을, 소생의 기도는 HP가 ${Math.round(HEAL_DANGER * 100)}% 아래로 떨어진 동료를 모두 크게 치료한다. 명의의 손은 6초 동안 이어지는 재생이, 생명의 축복은 8초 동안 이어지는 파티 재생이 됐다.`,
  `싸움의 리듬이 바뀌었다 — 모든 스킬의 재사용 대기시간이 ${PACE69.cd}배로 길어지고, 기본 공격은 ${BASIC_CD}초 ÷ 공격 속도마다 나간다(예전 5초). 강화 · 도발 · 지속 피해는 그만큼 오래 가고, 공격 스킬은 한 방이 2차 스킬 ×${PACE69.powT[2]} · 3차 · 4차 스킬 ×${PACE69.powT[3]}만큼 세졌다(1차 · 공용 스킬은 빨라진 기본 공격이 메운다). 치유 · 재생 · 보호막은 한 번에 ×${PACE69.heal}만큼 크게 채우는 대신 드물게 나간다. 숙련도가 오르는 빠르기는 그대로.`
];
