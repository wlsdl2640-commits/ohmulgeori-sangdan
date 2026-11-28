import { open, sleep } from './cdp.mjs';
import fs from 'node:fs';
const B = await open('file:///C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/hook_kit2.html');
const E = x => B.ev(`window.__E(${JSON.stringify(x)})`); fs.mkdirSync('kit2', { recursive: true }); const L = []; let n = 0;
const shot = async (lb, g) => { const f = `kit2/${String(++n).padStart(3, '0')}.png`; await B.shot(f); L.push([f, lb, g]); };
const KIT = `window.kitOf = () => { if (window.__kitForce) return window.__kitForce; const w = winTop(); if (!w) return ''; const id = w.id;
  if (['req', 'talk', 'co_money', 'co_log', 'co_goal', 'co_rank', 'assoc', 'co_king'].includes(id)) return 'B';
  if (id === 'advd') return UI.advTab === 'skill' ? 'C' : 'D';
  if (['adv', 'exp', 'hall'].includes(id)) return 'D';
  if (id === 'inv') return 'A';
  if (id === 'b' && w.b === 'smithy') return 'E';
  if (id === 'rune') return 'E';
  if (id === 'dex' && UI.dexTab === 'skill') return 'C';
  return 'A'; };
  window.kitApply = () => { const el = document.getElementById('win'); if (el) el.dataset.kit = kitOf(); };
  const _sw = showWin; showWin = function (s) { _sw(s); kitApply(); };
  const _rp = renderPanel; renderPanel = function (f) { _rp(f); kitApply(); }; 1`;
try {
  await B.ev(`document.getElementById('t-start').click()`); await sleep(500);
  await B.ev(`(() => { const i = document.getElementById('t-name'); i.value = '새벽 상단'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`); await B.ev(`document.getElementById('t-go').click()`); await sleep(3000);
  await E(KIT);
  await shot('시작 알림 (B 서류)', 'map');
  await E(`S.modals = []; closeModal(); Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); S.gold = 99999; for (const k in BUILDINGS) S.bld[k] = Math.max(S.bld[k] || 0, 1); const mk = (cls, lv) => { const a = makeAdv({ cls, lv }); S.advs.push(a); return a; }; ['warrior','archer','mage','cleric'].forEach(c => mk(c, 15)); for (let i = 0; i < 8; i++) S.gear.push(makeGear(dropBase(0), 0, i % 4)); ['rat_tail','herb','pot_s','f1_ore_chip'].forEach(k => S.inv[k] = 5); UI.dirty = true`);
  const M = [['의뢰 (B)', `openWin('req')`], ['월말 정산 (B)', `menuSub('co_money')`], ['길드원 (D)', `openWin('adv')`], ['모험가 · 개요 (D)', `UI.advTab='sum'; openAdv(S.advs[0].id)`], ['모험가 · 장비 (D)', `UI.advTab='gear'; openAdv(S.advs[0].id)`], ['모험가 · 스킬 (C)', `UI.advTab='skill'; openAdv(S.advs[0].id)`], ['파티 (D)', `openWin('exp')`], ['창고 (A)', `UI.invTab='gear'; openWin('inv')`], ['대장간 (E)', `openWin('b', { b: 'smithy' })`], ['모험가 협회 (B)', `openWin('assoc')`]];
  for (const [lb, code] of M) { await E(`S.modals = []; closeModal(); closeWins(); ${code}`); await sleep(500); await shot(lb, 'map'); }
  const FAC = await E(`Object.keys(BUILDINGS).filter(b => b !== 'smithy')`);
  for (const b of FAC) for (const K of 'ABCDE') { await E(`window.__kitForce = '${K}'; S.modals = []; closeModal(); closeWins(); openWin('b', { b: '${b}' })`); await sleep(350); await shot(`${b} · ${K}`, 'fac:' + b); }
} catch (e) { console.log('STOP', e.message.slice(0, 200)); }
fs.writeFileSync('kit2/list.json', JSON.stringify(L)); console.log(L.length, B.errs.length, B.errs.slice(0, 2)); B.close(); process.exit(0);
