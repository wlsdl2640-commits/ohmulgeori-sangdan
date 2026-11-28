/* ───────── 빌드 79: UI 키트 배치 (11-28 대표님 — ai-meeting decisions.md 「UI 키트 배치 확정」) ─────────
   그림 · CSS는 data-uikit79.js(UIKIT79_CSS — tools/saved/ui79/kit/kitcss2.py --js). 창(#win)에 data-kit를 붙여 그 키트로 그린다.
   · B 양피지: 퀘스트(의뢰) · 서류 · 대화 · 알림 / C 돌 · 룬: 스킬 관련 / D 가죽: 모험가 정보와 관련된 곳 / A 나무 · 금: 창고 · 가방 / E 쇠: 대장간 · 제작
   · 시설은 다섯 키트 시안을 보고 고름(클팀장 추천 그대로 — 대표님 「ㄱㄱ」) */
const UIKIT79_WIN = { req: 'B', talk: 'B', co_money: 'B', co_log: 'B', co_goal: 'B', co_rank: 'B', co_king: 'B', assoc: 'B',
  adv: 'D', exp: 'D', hall: 'D', inv: 'A', rune: 'E', gearshop: 'E', potshop: 'A', cook: 'E' };
const UIKIT79_BLD = { shop: 'A', warehouse: 'A', farm: 'A', inn: 'D', training: 'D', pen: 'D', stable: 'D', alchemy: 'E', kitchen: 'E', salvage: 'E', airfield: 'E', smithy: 'E', tower: 'C', library: 'C', temple: 'B' };
function uikitOf(w) {
  if (!w) return '';
  if (w.id === 'advd') return UI.advTab === 'skill' ? 'C' : 'D';
  if (w.id === 'dex') return UI.dexTab === 'skill' ? 'C' : 'A';
  if (w.id === 'b') return UIKIT79_BLD[w.b] || 'A';
  return UIKIT79_WIN[w.id] || 'A';
}
function uikitApply() { const el = document.getElementById('win'); if (el) el.dataset.kit = uikitOf(winTop()); }
(() => { const st = document.createElement('style'); st.id = 'uikit79'; st.textContent = UIKIT79_CSS; document.head.appendChild(st); })();
const _showWin79 = showWin;
showWin = function (s) { _showWin79(s); uikitApply(); };   // eslint-disable-line no-func-assign
const _renderPanel79 = renderPanel;
renderPanel = function (f) { const r = _renderPanel79(f); uikitApply(); return r; };   // eslint-disable-line no-func-assign
