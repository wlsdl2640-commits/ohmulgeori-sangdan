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
       재사용 차수별 PACE69.cdT ×2 · 2 · 2 · 2.25 · 2.5 (공격 스킬 powT · 회복 healT도 차수별) · 기본 공격 = 쿨타임 8초 − 쿨타임 감소(직업 · 전직 · 민첩, 가장 짧게 1.5초) + 실행 ÷ 공격 속도
       (data-rpg.js BASIC69 · core.js basicCd · basicExec · battle 'swing') · 한 방 ×1.4(BASIC_MULT 3.5 · BASIC_MAGIC 2.94) · 마법사 · 성직자 계열 스킬 MP(아래 MP69) ·
       낮은 땅 힐러 파티는 Lv1 ~ 47 몬스터를 약하게(data-monup69.js MON_MUL69).
   11-16 01:18 사용자(채팅): 민첩 「둘 다 그대로」 · 실행 「더 길게 1.5초」 · 예전 「공격 속도 +%」 효과(패시브 · 특성 · 숙련 · 룬 · 강화 스킬) 「모두 공격 속도로」 — 실행만 줄인다
       (21:36판은 쿨타임 감소 초로 바꾸고 설명 글을 다시 썼었다 — 그 글은 지웠다) · MP 「더 세게」(싸움 중 40 ~ 60%쯤) · 낮은 땅 「힐러 −1 안쪽이면 됨」.
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
const PACE69 = { cdT: [2, 2, 2, 2.25, 2.5], powT: [1.5, 1.5, 2, 1.75, 1.75], healT: [1.4, 1.4, 1.4, 1.6, 1.75] };   // 11-16: 실행 1.5초 · 공격 속도 효과가 실행으로 가며 낮은 차수 ×1.4 · 1.9 → ×1.5 · 2
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

/* 스킬 MP (빌드 69 밤, 11-15 21:36 사용자 「마법사, 사제의가 스킬에 사용하는 MP를 늘리자」 · 11-16 01:18 「더 세게」(싸움 중 40 ~ 60%쯤 — MP 물약 · MP 회복이 꼭 필요하게)):
   마법사 · 성직자 계열(jobBase mage · cleric)이 쓰는 스킬은 MP × min(max, k0 + 레벨 ÷ per) — 치유 · 재생 · 보호막 · 부활 · 해제는 늘어난 몫의 heal배(낮은 땅 성직자가 MP에 막혀 힐러 파티가 쓰러져서).
   두 계열은 지능이 높아 최대 MP가 물리 직업의 6 ~ 10배라 스킬 MP가 거의 안 들었다(싸움 중 MP 98 ~ 100%). Lv12 ×6.3 · Lv30 ×8.3 · Lv54부터 ×11 → 딜러 싸움 중 MP 평균 55%쯤
   (Lv12 ~ 30 56 ~ 65% · Lv60 49 ~ 60% · Lv100 18 ~ 24% · Lv146 39 ~ 50%), 힐러는 낮은 땅 63 ~ 85% · 높은 땅 97 ~ 99% — tools/saved/stat69/v101. 21:36판은 min(8, 2 + 레벨 ÷ 8)이었다.
   11-16 사용자 「높은 레벨만 조이기」(채팅): 힐러는 스킬을 1분 4 ~ 16번만 써서 Lv80부터 싸움 중 MP가 96 ~ 99%였다 → 회복 · 보호 스킬의 몫을 Lv75부터 늘려 Lv100부터 늘어난 몫의 200%(×21).
     ×11(100%)로는 힐러 MP 94 ~ 98%로 거의 그대로 · ×21 → Lv100 ~ 146 대주교 86 ~ 92% · 명의 71 ~ 92%(힐러 파티 도달 Lv100 ~ 130 ±0.6, Lv146 −1 ~ −1.6 — 최상급 마나 물약을 챙기면 되찾는다)
     · ×26(250%)는 Lv146 명의가 MP에 막혀(16%) −3.3 — tools/saved/stat69/v101 hh*
   core.js pickSkill · cast · panels.js · skillinfo.js가 skMp를 본다 */
const MP69 = { lines: ['mage', 'cleric'], k0: 5, per: 9, max: 11, heal: 0.5, healHi: { lv0: 75, lv1: 100, to: 2 }, healK: ['heal', 'regen', 'shield', 'revive', 'cure'] };   // 회복 · 보호 스킬은 늘어난 몫의 heal배 → healHi: lv0부터 lv1까지 to배로 (11-16 「높은 레벨만 조이기」)
const mpLine69 = a => !!a && MP69.lines.includes(jobBase(a.cls));
const mpHealShare = lv => { const H = MP69.healHi; if (!H) return MP69.heal; const t = Math.max(0, Math.min(1, ((lv || 1) - H.lv0) / (H.lv1 - H.lv0))); return MP69.heal + (H.to - MP69.heal) * t; };
const mpHealTxt = () => { const H = MP69.healHi, p = x => `${Math.round(x * 100)}%`; return H ? `늘어난 몫의 ${p(MP69.heal)} — Lv${H.lv0}부터 늘어 Lv${H.lv1}부터 ${p(H.to)}(×${Math.round((1 + (MP69.max - 1) * H.to) * 100) / 100})` : `늘어난 몫의 ${p(MP69.heal)}`; };
const mpMul69 = (a, s) => { const k = Math.min(MP69.max, MP69.k0 + (a.lv || 1) / MP69.per); return s && MP69.healK.includes(s.kind) ? 1 + (k - 1) * mpHealShare(a.lv) : k; };
const skMp = (a, s) => { const m = (s && s.cost && s.cost.mp) || 0; return m && mpLine69(a) ? Math.round(m * mpMul69(a, s)) : m; };
const mpMulTxt = (a, s) => `×${Math.round(mpMul69(a, s) * 100) / 100}`;

STORY.v69h = [
  '성직자 계열의 회복 방식이 갈렸다 — 사제 → 대주교는 직접 치유, 역병의사 → 명의는 재생과 상태이상 풀기, 퇴마사 → 심판관은 흡수와 보호. 치유는 작은 기본기가 됐고 기도도 조금 작아졌다.',
  `회복의 빛은 가장 다친 동료 둘을, 소생의 기도는 HP가 ${Math.round(HEAL_DANGER * 100)}% 아래로 떨어진 동료를 모두 크게 치료한다. 명의의 손은 6초 동안 이어지는 재생이, 생명의 축복은 8초 동안 이어지는 파티 재생이 됐다.`,
  `싸움의 리듬이 바뀌었다 — 스킬 재사용 대기시간이 공용 · 1차 · 2차 스킬 ${PACE69.cdT[2]}배 · 3차 ${PACE69.cdT[3]}배 · 4차 ${PACE69.cdT[4]}배로 길어지고, 강화 · 도발 · 지속 피해도 그만큼 오래 간다. 그 대신 공격 스킬 한 방이 1차 ×${PACE69.powT[1]} · 2차 ×${PACE69.powT[2]} · 3차 ×${PACE69.powT[3]} · 4차 ×${PACE69.powT[4]}, 치유 · 재생 · 보호막 한 번이 ×${PACE69.healT[1]} ~ ×${PACE69.healT[4]}만큼 크다. 숙련도가 오르는 빠르기는 그대로.`,
  `기본 공격은 쿨타임 ${BASIC69.base}초가 돌면 휘두르기 시작해 ${BASIC69.exec}초 ÷ 공격 속도만에 맞힌다(맞힌 뒤부터 다음 쿨타임). 쿨타임은 직업 · 전직(차수마다 ${BASIC69.tier}초) · 민첩(${BASIC69.agiStep}점마다 ${BASIC69.agi}초)이 줄이고(가장 짧게 ${BASIC69.floor}초), 공격 속도는 휘둘러 맞히기까지를 줄인다 — 민첩(1점마다 ${Math.round(BASIC69.aspd * 1000) / 10}%) · 「신속」 같은 지속 스킬 · 특성 · 숙련 · 신속의 룬 · 강화 스킬. 한 방은 공격력 ×${BASIC_MULT}(마법 ×${BASIC_MAGIC})로 세졌지만 스킬 한 번이 더 세다.`,
  `마법사 · 성직자 계열은 스킬에 MP를 훨씬 더 쓴다 — ×(${MP69.k0} + 레벨 ÷ ${MP69.per}), Lv${Math.ceil((MP69.max - MP69.k0) * MP69.per)}부터 ×${MP69.max}(치유 · 재생 · 보호막 · 부활 · 해제는 ${mpHealTxt()}). 최대 MP가 큰 만큼 아껴 써야 하고, 마나 물약 · MP 회복이 꼭 필요하다 — 상급 · 최상급 마나 물약(MP ${ITEMS.mp_l.mana} · ${ITEMS.mp_x.mana.toLocaleString('ko-KR')})이 새로 나왔다(창고에서 사거나 연금술 공방 3 · 4단계에서 만든다).`
];
