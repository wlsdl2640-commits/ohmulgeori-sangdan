/* ───────── 시작과 반복 ───────── */
let running = false, lastT = 0, acc = 0, uiTimer = 0;

function fmtDur(sec) {
  const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
  return h ? `${h}시간 ${m}분` : `${Math.max(1, m)}분`;
}
function awayReport(r) {
  if (r.sec < 60) return;
  const lines = [`${fmtDur(r.sec)} 동안 상단이 돌아갔어요. (게임 속 ${r.days}일)`];
  lines.push(`골드 ${r.gold >= 0 ? '+' : ''}${fmt(r.gold)}G · 처치 ${fmt(r.kills)}마리 · 상점 판매 ${fmt(r.sales)}개`);
  if (r.fame) lines.push(`명성 ${r.fame > 0 ? '+' : ''}${r.fame}`);
  if (r.deaths) lines.push(`그사이 모험가 ${r.deaths}명이 쓰러졌어요. 모험가 탭의 묘지에서 확인할 수 있어요.`);
  if (r.sec >= OFFLINE_CAP) lines.push('자리를 비운 시간은 최대 2시간까지만 계산돼요.');
  S.modals.unshift({ title: '자리를 비운 동안', body: lines });
}
function startGame() {
  running = true;
  UI.html = ''; UI.chips = '';
  renderPanel(true); renderChips(); updateHud(); updateOverlay();
  clearInterval(uiTimer);
  uiTimer = setInterval(() => {
    if (!S) return;
    updateHud(); updateOverlay(); renderChips(); renderPanel(); pumpModals();
  }, 400);
  lastT = 0;
  requestAnimationFrame(loop);
  setTimeout(pumpModals, 300);
}
function loop(now) {
  if (!S) { running = false; return; }
  if (!lastT) lastT = now;
  let dt = (now - lastT) / 1000;
  lastT = now;
  if (dt > 3) {
    const r = catchUp(Math.min(OFFLINE_CAP, dt));
    awayReport(r);
    dt = 0; UI.dirty = true;
  }
  acc += Math.min(dt, 0.5);
  while (acc >= 0.1) { step(0.1); acc -= 0.1; }
  drawFrame(now);
  requestAnimationFrame(loop);
}
function boot() {
  applyPx();
  initView($('cv'));
  bindUI();
  HOOKS.changed = () => { UI.dirty = true; };
  HOOKS.toast = toast;
  HOOKS.modal = () => setTimeout(pumpModals, 60);
  setInterval(saveGame, 5000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveGame(); });
  window.addEventListener('pagehide', saveGame);
  if (loadGame()) {
    const away = Math.min(OFFLINE_CAP, Math.max(0, (Date.now() - (S.lastSeen || Date.now())) / 1000));
    if (away > 20) awayReport(catchUp(away));
    startGame();
  } else showTitle();
  // 직접 올린 웹사이트에서 열었을 때만 오프라인 캐시를 켠다
  try {
    if ('serviceWorker' in navigator && window.top === window && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  } catch (_) {}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
