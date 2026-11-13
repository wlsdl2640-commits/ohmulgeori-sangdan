/* ───────── 빌드 69: 봉급이 레벨을 따라 오른다 (11-13 21:22 사용자 「영운들 월급도 LV10당 50%나 30%정도 선에도 더 올려야해 전체적으로」 · 23:06 「50%」) ─────────
   빌드 68까지: 고용할 때 한 번 정한 봉급(계열 첫 직업 봉급 × (1 + 0.09 × (Lv − 1)))에 라이선스마다 ×1.2 · 전직마다 ×1.3을 곱해 갈 뿐 — 레벨이 올라도 그대로였다
     (처음부터 키운 Lv100 챔피언 ≈ 350G, 벌이의 1% 안팎).
   이제: 그 식을 지금 레벨 · 직업 차수 · 라이선스로 다시 셈한 값에 Lv10마다 +50%(× (1 + 0.5 × (Lv − 1) / 10))를 곱한다 — 레벨이 오를 때마다 다시 매긴다.
   길드 후원 3단계 봉급 −10%는 이제 모든 모험가에게(예전엔 새로 고용하는 사람만), 첫 견습생은 절반(a.salK 0.5), 명예의 전당 스승 할인(같은 계열 동상마다 −3%, 최대 −15%)은
   달마다 실제로 낸다(예전엔 창에만 깎여 보이고 정산은 깎지 않았다). */
const SAL_LV10 = 0.5, SAL_PER_LV = 0.09, SAL_PROMO = 1.3, SAL_LIC = 1.2;
function salaryCalc(a) {
  const C1 = CLASSES[jobBase(a.cls)] || CLASSES[a.cls] || { salary: 100 }, L = Math.max(1, a.lv || 1);
  let v = C1.salary * (1 + SAL_PER_LV * (L - 1)) * Math.pow(SAL_PROMO, Math.max(0, jobTier(a.cls) - 1)) * Math.pow(SAL_LIC, a.rank || 0) * (1 + SAL_LV10 * (L - 1) / 10) * (a.salK || 1);
  if (S && S.spons && (S.spons.guild || 0) >= 3) v *= 0.9;   // 길드 후원 3단계 「봉급 10% 할인」
  return Math.max(5, Math.round(v / 5) * 5);
}
const salaryNew = a => { if (a) a.salary = salaryCalc(a); return a ? a.salary : 0; };
STORY.v69c.push('모험가 봉급이 레벨을 따라 오른다: 지금 레벨 · 직업 차수 · 라이선스로 다시 매기고, Lv10마다 +50%. 명예의 전당 스승 할인도 이제 정산에서 실제로 깎인다.');
