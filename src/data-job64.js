/* ───────── 빌드 64: 2차 · 3차 직업 스킬을 배우는 레벨 ─────────
   전직 레벨이 2차 Lv20 → 50, 3차 Lv50 → 100으로 올라서 직업 스킬도 그만큼 뒤로 옮긴다 (전직 기본 스킬 Lv1은 그대로).
   2차: 22 · 28 · 36 · 42 · 48 · 52 → 56 · 64 · 72 · 80 · 88 · 92 / 3차: 55 · 60~68 · 75 · 85 · 95 → 108 · 112~118 · 126 · 136 · 146.
   스킬북 값 · 스킬 올리는 값 · 뽑기 등급은 예전 레벨(lv0)로 그대로 둔다 (data-store.js · skillUpCost). 모든 스킬 정의가 끝난 뒤, 스킬북 표(data-store.js) 앞에서 돈다. */
const SKLV2 = { 22: 56, 28: 64, 36: 72, 42: 80, 48: 88, 52: 92 };
const SKLV3 = { 55: 108, 60: 112, 62: 114, 65: 116, 66: 116, 68: 118, 75: 126, 85: 136, 95: 146 };
Object.keys(SKILLS).forEach(id => {
  const s = SKILLS[id]; if (!s || !s.cls || !(s.lv > 1) || s.lv0 != null) return;
  const t = Math.max(1, ...s.cls.map(c => (CLASSES[c] ? jobTier(c) : 1)));
  if (t < 2) return;
  s.lv0 = s.lv;
  s.lv = t === 2 ? SKLV2[s.lv] || Math.min(99, Math.max(51, Math.round(50 + (s.lv - 20) * 1.4))) : SKLV3[s.lv] || Math.min(149, Math.max(101, s.lv + 51));
});
