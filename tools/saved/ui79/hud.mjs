import { open, sleep } from './cdp.mjs';
const B = await open('file:///C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/hook.html');
const E = x => B.ev(`window.__E(${JSON.stringify(x)})`);
await B.ev(`document.getElementById('t-start').click()`); await sleep(500);
await B.ev(`(() => { const i = document.getElementById('t-name'); i.value = '새벽 상단'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`); await B.ev(`document.getElementById('t-go').click()`); await sleep(3000);
await E(`S.modals = []; closeModal(); Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); const a = makeAdv({ cls: 'warrior', lv: 3 }); S.advs.push(a); const p = S.parties[0]; startExp(p, 'plains'); S.view = p.id; UI.dirty = true`);
await sleep(4000); await B.shot('h1.png');
await E(`menuBoard(true)`); await sleep(400); await B.shot('h2.png'); await E(`menuBoard(false); hqZone('tower')`); await sleep(800); await B.shot('h3.png');
console.log(B.errs.length, B.errs.slice(0, 2)); B.close(); process.exit(0);
