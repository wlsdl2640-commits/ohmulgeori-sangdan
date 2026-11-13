/* 빌드 69 — 스킬 재사용 감소(쿨감) 손질 (11-13 20:28 사용자 「쿨타임 감소 밸런스를 너가 제시한 대로」
   = 목록 시트 「쿨타임 · 상태이상 · 버프 목록」 쿨타임 감소 탭의 패치 제안).
   - 상한(CDR_MAX 50 → 30%) · 스킬 레벨(SK_LV_CD 단계마다 4 → 2%) · 숙련도(SM_CD 단계마다 2 → 1%) · 재사용 바닥(0.5초 → 기본 재사용의 40%, CD_FLOOR)은
     data-rpg.js 맨 위 상수, 바닥은 core.js skillCdOf.
   - 여기서는 패시브 · 특성 · 강화의 재사용 감소 값과 설명 글을 바꾼다. 예전 값은 CDR69_OLD.
   - 그대로: 시간 룬(사용자 「그대로 두고 벨런스를 보자」) · 숙련(연주법 · 마법 지식 · 완드술) · 더위.
   - 짐 덜어 주기(짐꾼 Lv45, 파티 재사용 +8%)는 data-porter69.js. */
const CDR69 = {
  tactics:     [0.05, '스킬 재사용 대기시간이 5% 줄어든다.'],
  rhythm:      [0.05, '공격 속도 8%, 스킬 재사용 감소 5%가 오른다.'],
  arcane:      [0.06, '마법 피해와 치유량이 15% 오르고 스킬 재사용이 6% 빨라진다.'],
  arcanefocus: [0.03, '마법 공격력 10%, 치명 5%, 스킬 재사용 감소 3%가 오른다.'],
  elemfocus:   [0.03, '여러 원소의 결을 맞춘다. 마법 공격력 10%, 스킬 재사용 감소 3%.'],
  spiritlink:  [0.04, '마법 피해와 치유량이 15% 오르고 스킬 재사용이 4% 빨라진다.'],
  lichmind:    [0.05, '마법 피해가 20% 오르고 스킬 재사용이 5% 빨라진다.'],
  surgeon:     [0.04, '치유량과 마법 피해가 15% 오르고 스킬 재사용이 4% 빨라진다.']
};
const CDR69_OLD = {};
for (const [id, [v, desc]] of Object.entries(CDR69)) {
  const s = SKILLS[id]; if (!s || !s.passive) continue;
  CDR69_OLD[id] = s.passive.cdr; s.passive.cdr = v; s.desc = desc;
}
// 앙코르(마에스트로): 파티 재사용 +30% → +15%
if (SKILLS.encore) { CDR69_OLD.encore = SKILLS.encore.add; SKILLS.encore.add = 0.15; SKILLS.encore.desc = '10초 동안 파티의 스킬 재사용 대기시간이 15% 더 빨리 돈다.'; }
// 특성 전술가: 8% → 5%
if (TRAITS.tactician) { CDR69_OLD.tactician = TRAITS.tactician.cdr; Object.assign(TRAITS.tactician, { cdr: 0.05, desc: '스킬 재사용 대기시간 -5%' }); }
STORY.v69b.push(`스킬 재사용 감소가 손질됐다: 재사용 감소를 다 더한 상한 50% → ${Math.round(CDR_MAX * 100)}% · 스킬 레벨 단계마다 재사용 -4% → -${Math.round(SK_LV_CD * 100)}% · 숙련도 단계마다 -2% → -${Math.round(SM_CD * 100)}% · 재사용은 기본 재사용의 ${Math.round(CD_FLOOR * 100)}% 아래로 줄지 않는다. 전술 · 전투 리듬 · 특성 「전술가」는 8% → 5%, 마법사 계열 패시브도 조금씩, 앙코르는 +30% → +15%.`);
