/* ───────── 왕국 · 투기장 스킬 빼기 (빌드 69, 사용자 11-13 15:07 「여러 왕국등에서 구하던 스킬둘 다 게임에서 빼버려」 · 15:08 「투기장 스킬도 빼버려 (검투사스킬을 빼지는 말고)」) ─────────
   왕국 상단 스킬 10개(s.kingdom — data-under.js)와 투기장 상단 스킬 6개(s.arena — ar_*). 검투사 직업 스킬(cls gladiator — 투기장 쌍격 · 흘려 받기 · 관중의 함성 …)은 그대로.
   정의는 남겨 두고 아무도 못 배우게(cls [] · cut 1) 한다 — 옛 저장의 원정 중 지속 피해 · 강화 · 전투 통계가 그 스킬 id를 들고 있어도 깨지지 않게.
   build.py에서 data-store.js 바로 앞: 스킬북 뽑기(BOOK_POOL)에서 빠지고, 스킬 목록 · 도감(SKILL_IDS — data-skjob68.js가 다시 넣지 않게 cut을 본다)에도 안 나온다.
   옛 저장: econ.js cut69(불러올 때마다 — 남은 게 없으면 아무것도 안 한다) · notes69 */
const CUT_SK = Object.keys(SKILLS).filter(id => SKILLS[id].kingdom || SKILLS[id].arena);
// 빼기 전 차수 → 돌려줄 스킬북 단계 차례 (0 찢어진(공용) · 1 낡은(1차) · 2 빛바랜(왕국 스킬 = 2차 전직 뒤))
const CUT_SK_TIER = Object.fromEntries(CUT_SK.map(id => { const s = SKILLS[id]; return [id, s.cls.includes('all') ? 0 : Math.max(1, s.tier || 0, ...s.cls.map(c => (CLASSES[c] ? jobTier(c) : 1)))]; }));
const CUT_SK_NAMES = { kingdom: CUT_SK.filter(id => SKILLS[id].kingdom).map(id => SKILLS[id].name), arena: CUT_SK.filter(id => SKILLS[id].arena).map(id => SKILLS[id].name) };
CUT_SK.forEach(id => {
  const s = SKILLS[id]; s.cls = []; s.cut = 1; delete s.tier;
  [SKILL_IDS, BOOK_IDS].forEach(L => { const i = L.indexOf(id); if (i >= 0) L.splice(i, 1); });
});

// 빌드 69 알림 (옛 저장 — econ.js notes69)
STORY.v69 = [
  `왕국 상단 스킬 ${CUT_SK_NAMES.kingdom.length}개(${CUT_SK_NAMES.kingdom.join(' · ')})와 투기장 상단 스킬 ${CUT_SK_NAMES.arena.length}개(${CUT_SK_NAMES.arena.join(' · ')})를 게임에서 뺐다. 검투사 직업 스킬(투기장 쌍격 · 흘려 받기 · 관중의 함성 …)은 그대로.`,
  '스킬북 단계(찢어진 · 낡은 · 빛바랜 …)를 펼쳐도 더는 나오지 않는다. 배운 모험가에게서는 지워지고(스킬 칸이 빈다) 배울 때 쓴 스킬북 · 수업료와 스킬 단계를 올린 책 · 값을 돌려받는다. 창고에 있던 그 스킬북은 같은 차수 스킬북 단계로 바뀐다.'
];
