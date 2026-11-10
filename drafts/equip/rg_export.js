// rg1 · rg2 · rg3 시안을 읽어 tools/saved/rogue_skins.json 으로 (반 해상도 격자 · 직업 그림 색)
const fs = require('fs'), vm = require('vm');
const pxRows = s => s.replace(/^\n+/, '').replace(/\s+$/, '').split('\n').map(r => r.split('|')[0].trim()).map(r => (r === '-' ? '' : r));
const pxUp = rows => rows.flatMap(r => { const d = [...r].map(c => c + c).join(''); return [d, d]; });
const ctx = { window: {}, PX_HEAD: {}, PXS_HEAD: {}, PX_EX: {}, PXS_EX: {}, PX_WPN: {}, GTYPES: {}, PXL: { masterthief: { note: 'game PXL.masterthief (src/pxa.js) 그대로' } }, pxRows, pxUp, console };
vm.createContext(ctx);
const code = ['rg1.js', 'rg2.js', 'rg3.js'].map(f => fs.readFileSync(f, 'utf8')).join('\n') + '\n;({ RG, RGF })';
const { RG, RGF } = vm.runInContext(code, ctx);
const half = (part) => { const rows = pxRows(part.g); return { top_h: part.top / 2, x_h: (part.x || 0) / 2, rows: rows.filter((_, i) => i % 2 === 0).map(r => [...r].filter((_, i) => i % 2 === 0).join('')) }; };
const parts = {}, ex = {};
for (const k of ['shinobi', 'shadow', 'kunoichi', 'oni', 'kitsune', 'flatcap', 'bowler', 'beanie', 'kasa', 'kasa_hat'])
  parts[k] = { front: half(ctx.PX_HEAD[k]), side: half(ctx.PXS_HEAD[k]) };
for (const k of ['kerchief', 'nscarf', 'sscarf', 'bowtie'])
  ex[k] = { front: Object.assign(half({ g: ctx.PX_EX[k].g, top: 0, x: 0 }), { x: ctx.PX_EX[k].x, y: ctx.PX_EX[k].y }), side: Object.assign(half({ g: ctx.PXS_EX[k].g, top: 0, x: 0 }), { x: ctx.PXS_EX[k].x, y: ctx.PXS_EX[k].y }) };
for (const k in ex) { for (const v of ['front', 'side']) { delete ex[k][v].top_h; delete ex[k][v].x_h; } }
const looks = {
  pickpocket: { use: '2차 소매치기 (고름)', look: RG.pp[0][2] },
  phantom: { use: '3차 괴도 — 새 직업 (고름, 이번 시안 B 중절모 도박사)', look: RG.pp[1][2] },
  masterthief: { use: '4차 대도 — 지금 PXL.masterthief 그대로', look: null },
  ninja: { use: '2차 닌자 (A로 봄)', look: RG.nj[0][2] },
  kageninja: { use: '3차 카게닌자 (고름, 첫째 시안)', look: RG.kg[0][2] },
  musa_kasa: { use: '보관 — 전사 계열 새 1차 무사(→ 검호 → 검제 → 검성)에 삿갓(모자만) 다시 쓰기', look: RGF.saved[0][3] },
  kunoichi: { use: '보관 — 나중에 (여)도적', look: RG.nj[2][2] },
  kage_oni: { use: '보관 — 닌자 계열 4차(또는 5차 · 각성)', look: RG.kg[1][2] },
  kage_kitsune: { use: '보관 — 닌자 계열 4차(또는 5차 · 각성)', look: RG.kg[2][2] },
  unused: { use: '안 고름 (참고)', beanie: RG.pp[2][2], kasa_ninja: RG.nj[1][2] }
};
const out = {
  note: '도적 계열 캐릭터 시안 (2026-11-10, 사용자 22:15 결정). 머리 · 덧붙이기는 반 해상도(뭉툭 칸) 격자 — 게임에 넣을 때 pxUp으로 두 배(top = top_h×2, x = x_h×2). 앞은 PX_HEAD/PX_EX(BX · HY · BY 기준), 옆은 PXS_HEAD/PXS_EX(SX−1 · SHY · SY 기준, 옆 덧붙이기 x는 온 칸 그대로 · 홀수). 글자는 pxPal: J/j/I 두건·모자(hc) · F/f 셋째 색(c3) · A/a 둘째 색(c2) · R/r 깃털 색(feather) · Z/z 흰 천·뼈 · X 보석(gem) · H/h/L 머리칼 · k 눈(eyes). 트럼프 카드 손 그림은 cards(온 칸).',
  parts, ex,
  cards: pxRows(ctx.PX_WPN.cards),
  looks
};
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log('parts', Object.keys(parts).length, 'ex', Object.keys(ex).length);
