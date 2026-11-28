import { open, sleep } from './cdp.mjs';
import fs from 'node:fs';
const B = await open('file:///C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/hook_kit.html');
const E = x => B.ev(`window.__E(${JSON.stringify(x)})`); fs.mkdirSync('kitshots', { recursive: true }); const L = []; let n = 0;
const shot = async lb => { const f = `kitshots/${String(++n).padStart(2, '0')}.png`; await B.shot(f); L.push([f, lb]); };
try {
  await shot('첫 화면'); await B.ev(`document.getElementById('t-sys').click()`); await sleep(500); await shot('시스템 설정');
  await B.ev(`(document.querySelector('#t-opt .btn, #t-opt button')||{click(){}}).click()`); await sleep(300);
  await B.ev(`document.getElementById('t-start').click()`); await sleep(600); await shot('길드 창립 신청서');
  await B.ev(`(() => { const i = document.getElementById('t-name'); i.value = '새벽 상단'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`); await B.ev(`document.getElementById('t-go').click()`); await sleep(3000);
  await shot('시작 알림 (서류 창)');
  await E(`S.modals = []; closeModal(); Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); S.gold = 99999; for (const k in BUILDINGS) S.bld[k] = Math.max(S.bld[k] || 0, 1); const mk = (cls, lv) => { const a = makeAdv({ cls, lv }); S.advs.push(a); return a; }; ['warrior','archer','mage','cleric'].forEach(c => mk(c, 15)); for (let i = 0; i < 8; i++) S.gear.push(makeGear(dropBase(0), 0, i % 4)); ['rat_tail','herb','pot_s','f1_ore_chip'].forEach(k => S.inv[k] = 5); UI.dirty = true`);
  for (const [lb, code] of [['길드', `openWin('co')`], ['파티', `openWin('exp')`], ['창고 · 장비', `UI.invTab='gear'; openWin('inv')`], ['모험가 · 스킬', `UI.advTab='skill'; openAdv(S.advs[0].id)`], ['모험가 · 장비', `UI.advTab='gear'; openAdv(S.advs[0].id)`], ['대장간', `openWin('b', { b: 'smithy' })`], ['모험가 협회', `openWin('assoc')`], ['시설', `openWin('fac')`]]) {
    await E(`S.modals = []; closeModal(); closeWins(); ${code}`); await sleep(500); await shot(lb);
  }
} catch (e) { console.log('STOP', e.message.slice(0, 200)); }
fs.writeFileSync('kitshots/list.json', JSON.stringify(L)); console.log(L.length, B.errs.length); B.close(); process.exit(0);
