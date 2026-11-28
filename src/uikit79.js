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

/* ── 첫 화면 (11-28 대표님 「그냥 1번할게」 — 밝은 미궁 대문 B1 · 제목 글자 A · 단추는 아래쪽) ──
   세로 화면만 새 그림(206×450 도트를 정수배로) · 가로 화면(PC)은 가로 그림이 생길 때까지 예전 그림(TITLE_ART) */
const TITLE79_CSS = (() => {
  const B = (k, s) => `border-image: url('${TITLE79.btn[k][s]}') 9 fill / 14px stretch;`;
  return `
.tbtn { border-style: solid; border-color: transparent; border-width: 14px; ${B('wood', 'normal')} image-rendering: pixelated; background: none !important; box-shadow: none !important; color: #f6e0b0 !important; min-height: 0; padding: 0 6px; text-shadow: 1px 1px 0 #2a1406; }
.tbtn:hover:not(:disabled), .tbtn:focus-visible { ${B('wood', 'hover')} filter: none; outline: none; }
.tbtn:active:not(:disabled) { ${B('wood', 'pressed')} transform: translateY(2px); }
.tbtn:disabled { ${B('wood', 'disabled')} opacity: 1; color: #8a8478 !important; }
.tbtn.main { ${B('gold', 'normal')} color: #2a1406 !important; text-shadow: 1px 1px 0 rgba(255, 236, 170, .6); }
.tbtn.main:hover:not(:disabled), .tbtn.main:focus-visible { ${B('gold', 'hover')} }
.tbtn.main:active:not(:disabled) { ${B('gold', 'pressed')} }
.tbtn.main:disabled { ${B('gold', 'disabled')} }
.t-logo-img { display: none; image-rendering: pixelated; }
@media (orientation: portrait) {
  .t-bg.px { image-rendering: pixelated; object-fit: cover; object-position: 50% 100%; }
  .t-logo.img .game-sub, .t-logo.img .game-name { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .t-logo.img .t-logo-img { display: block; width: min(62vw, 260px); margin: 0 auto; }
  .t-main .credit { grid-row: 3; text-align: center; font-size: 9px; opacity: .7; }
  .t-menu { grid-template-columns: 1fr 1fr; width: min(74vw, 290px); gap: 6px; margin-bottom: 0; }
  .t-menu .tbtn.main { grid-column: 1 / -1; font-size: 18px; height: 48px; }
  .t-menu .tbtn:not(.main) { font-size: 13px; height: 40px; }
}`; })();
(() => { const st = document.createElement('style'); st.id = 'title79'; st.textContent = TITLE79_CSS; document.head.appendChild(st); })();
function title79Art() {
  const bg = document.getElementById('t-bg'), portrait = matchMedia('(orientation: portrait)').matches;
  if (bg) { bg.src = portrait ? TITLE79.bg : TITLE_ART; bg.classList.toggle('px', portrait); }
  const lg = document.querySelector('.t-logo');
  if (lg && !lg.querySelector('.t-logo-img')) { const im = document.createElement('img'); im.className = 't-logo-img'; im.alt = ''; im.src = TITLE79.logo; lg.prepend(im); lg.classList.add('img'); }
}
const _showTitle79 = showTitle;
showTitle = function () { const r = _showTitle79.apply(this, arguments); title79Art(); return r; };   // eslint-disable-line no-func-assign
try { matchMedia('(orientation: portrait)').addEventListener('change', () => { const t = document.getElementById('title-scr'); if (t && !t.hidden) title79Art(); }); } catch (_) {}

/* ── 아이콘 (11-28 대표님 「옛 탭 속 이미지들도 다 바꿔」) — 메뉴판 칸 · 바로 가기 · 메뉴 단추 · 위쪽 띠 돈 · 명성 · 장소 화살표 (data-icons79.js) ── */
const _applyPx79 = applyPx;
applyPx = function () { _applyPx79(); document.querySelectorAll('img[data-px]').forEach(im => { const u = ICONS79[im.dataset.px]; if (u) im.src = u; }); };   // eslint-disable-line no-func-assign
(() => { const st = document.createElement('style'); st.id = 'icons79'; st.textContent = `
.mtile img { width: 32px; height: 32px; image-rendering: pixelated; }
.mchip img { width: 20px; height: 20px; image-rendering: auto; }
.mbtn img, .mbtn.mmain img { width: 24px; height: 24px; image-rendering: auto; }
.hud .pi { width: 18px; height: 18px; image-rendering: auto; }
.pnav .parr { background-image: url('${ICONS79.arrow}') !important; background-size: 32px 32px; background-repeat: no-repeat; background-position: center; image-rendering: pixelated; }`; document.head.appendChild(st); })();

/* ── 길드 창 안에 시설을 합침 (11-28 대표님 「길드 안에다가 시설 통합시켜」) — 메뉴판의 「시설」 칸 자리는 「모험가 협회」 ── */
const CO79_TABS = [['co', '길드'], ['fac', '시설']];
const _panelCo79 = PANELS.co;
PANELS.co = () => {
  const t = UI.coTab === 'fac' ? 'fac' : 'co';
  return `<div class="tabs co79">${CO79_TABS.map(([k, n]) => `<button type="button" class="tab${t === k ? ' on' : ''}" data-act="cotab" data-t="${k}">${n}</button>`).join('')}</div>` + (t === 'fac' ? PANELS.fac() : _panelCo79());
};
Object.assign(ACT, { cotab: d => { UI.coTab = d.t; const w = winTop(); if (w) w.tab = d.t; renderPanel(true); } });
