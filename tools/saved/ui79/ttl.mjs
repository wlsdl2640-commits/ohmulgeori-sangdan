import { open, sleep } from './cdp.mjs';
const B = await open('file:///C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/hook.html');
await B.shot('t1.png');
await B.ev(`document.getElementById('t-start').click()`); await sleep(500); await B.shot('t2.png');
await B.ev(`document.getElementById('t-back').click()`); await sleep(300); await B.ev(`document.getElementById('t-sys').click()`); await sleep(400); await B.shot('t3.png');
console.log(B.errs.length, B.errs.slice(0,2)); B.close(); process.exit(0);
