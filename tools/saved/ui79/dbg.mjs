import { open, sleep } from './cdp.mjs';
const B = await open('file:///C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/hook.html');
console.log('load errs', B.errs);
await B.ev(`document.getElementById('t-start').click()`); await sleep(500);
await B.ev(`(() => { const i = document.getElementById('t-name'); i.value = '새벽 상단'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`); await B.ev(`document.getElementById('t-go').click()`); await sleep(3000);
console.log('after', B.errs.map(s => String(s).slice(0, 400)));
B.close(); process.exit(0);
