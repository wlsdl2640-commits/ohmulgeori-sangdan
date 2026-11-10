// tk1 · tk2 시안을 읽어 tools/saved/archer_skins.json 으로 (반 해상도 격자 · 직업 그림 색) — 11-10 23:40 사용자 결정
const fs = require('fs'), vm = require('vm');
const pxRows = s => s.replace(/^\n+/, '').replace(/\s+$/, '').split('\n').map(r => r.split('|')[0].trim()).map(r => (r === '-' ? '' : r));
const pxUp = rows => rows.flatMap(r => { const d = [...r].map(c => c + c).join(''); return [d, d]; });
const ctx = { window: {}, PX_HEAD: {}, PXS_HEAD: {}, PX_EX: {}, PXS_EX: {}, PX_WPN: {}, PX_BOW: {}, PXS_BOW: {}, GTYPES: {}, PXL: {}, pxRows, pxUp, console, BX: 12, BY: 34, HY: 22 };
vm.createContext(ctx);
const code = ['rg1.js', 'rg2.js', 'tk1.js', 'tk2.js'].map(f => fs.readFileSync(f, 'utf8')).join('\n') + '\n;({ TK, TK_CBOW })';
const { TK, TK_CBOW } = vm.runInContext(code, ctx);
const half = (g) => pxRows(g).filter((_, i) => i % 2 === 0).map(r => [...r].filter((_, i) => i % 2 === 0).join(''));
const head = (k) => ({ front: { top_h: ctx.PX_HEAD[k].top / 2, x_h: (ctx.PX_HEAD[k].x || 0) / 2, rows: half(ctx.PX_HEAD[k].g) },
                        side: { top_h: ctx.PXS_HEAD[k].top / 2, x_h: (ctx.PXS_HEAD[k].x || 0) / 2, rows: half(ctx.PXS_HEAD[k].g) } });
const parts = {}; for (const k of ['wolfhood', 'lensmask', 'wolfhood2']) parts[k] = head(k);
const ex = {};
for (const k of ['wxbow', 'bcase']) ex[k] = { front: { x: ctx.PX_EX[k].x, y: ctx.PX_EX[k].y, rows: half(ctx.PX_EX[k].g) },
                                              side: { x: ctx.PXS_EX[k].x, y: ctx.PXS_EX[k].y, under: !!ctx.PXS_EX[k].under, rows: half(ctx.PXS_EX[k].g) } };
const bow = { front: { x: TK_CBOW.front.x, y: TK_CBOW.front.y, rows: half(TK_CBOW.front.g) },
              side: { x: TK_CBOW.side.x, y: TK_CBOW.side.y, rows: half(TK_CBOW.side.g) },
              side_draw: { x: TK_CBOW.side.x + TK_CBOW.side.dx, y: TK_CBOW.side.y, rows: half(TK_CBOW.side.draw) } };
const out = {
  note: '궁수 계열 트래커 · 스토커 캐릭터 그림 (2026-11-10, 사용자 23:40 결정). 머리 · 덧붙이기 · 손 활은 반 해상도(뭉툭 칸) 격자 — 게임에 넣을 때 pxUp으로 두 배(top = top_h×2, x = x_h×2). 앞은 PX_HEAD/PX_EX(BX · HY · BY 기준), 옆은 PXS_HEAD/PXS_EX(SX−1 · SHY · SY 기준, 옆 덧붙이기 x는 온 칸 그대로 · 홀수). 글자는 pxPal: J/j/I 두건(hc) · Z/z 뼈 · K 검정 · X 빛(gem) · G/g 놋쇠(gold) · F 셋째 색(c3) · r 깃털 짙은 색 · O/v 나무 · N/M 쇠 · R 깃털(feather) · w 시위 · S 손. 손목 석궁 = 먼 팔(왼팔, 옆모습은 몸 뒤 under), 볼트통 = 허리 왼쪽 옆. 손 활은 시안판에서만 단궁 칸을 빌려 쓴 컴파운드 보우(앞 · 옆 · 옆 당기기) — 구현 때 동작 그림과 다시.',
  parts, ex, bow,
  looks: {
    tracker: { use: '2차 트래커 — 확정 (A 늑대 가죽 두건, 괴물사냥꾼 자리)', look: TK.tr[0][2] },
    stalker: { use: '3차 스토커 — 확정 (A 유리눈 가면, 드래곤 슬레이어 자리)', look: TK.st[0][2] },
    keep_blackwolf: { use: '보관 — 검은 늑대 망토 (나중에 4차 프레데터 등)', look: TK.st[1][2] },
    unused: { use: '안 고름 (참고)', trapper: TK.tr[1][2], bandana: TK.tr[2][2], skullmask: TK.st[2][2] }
  }
};
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log('parts', Object.keys(parts).length, 'ex', Object.keys(ex).length);
