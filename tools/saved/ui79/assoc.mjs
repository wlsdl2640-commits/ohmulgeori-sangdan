import { open, sleep } from './cdp.mjs';
const B = await open('file:///C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/hook.html');
const E = x => B.ev(`window.__E(${JSON.stringify(x)})`);
await B.ev(`document.getElementById('t-start').click()`); await sleep(500);
await B.ev(`(() => { const i = document.getElementById('t-name'); i.value = '새벽 상단'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`); await B.ev(`document.getElementById('t-go').click()`); await sleep(3000);
await E(`S.modals = []; closeModal(); Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); S.bld.pen = 1; S.gold = 9000; ['warrior','archer','cleric'].forEach(c => { const a = makeAdv({ cls: c, lv: 8 }); S.advs.push(a); }); S.b79 = { got: {}, done: { own_plains: 1 }, seen: { rg_c1: 1 }, log: { plains: { day: 2, party: '1팀', mem: [['브람', '전사', 11], ['리네', '궁수', 10]] } } }; UI.dirty = true`);
let i = 0; for (const t of ['req', 'rank', 'shop', 'log']) { await E(`S.modals = []; closeModal(); closeWins(); UI.assocTab = '${t}'; openWin('assoc')`); await sleep(500); await B.shot(`as${++i}.png`); }
await E(`closeWins(); menuBoard(true)`); await sleep(400); await B.shot('as5.png');
console.log(B.errs.length, B.errs.slice(0, 2)); B.close(); process.exit(0);
