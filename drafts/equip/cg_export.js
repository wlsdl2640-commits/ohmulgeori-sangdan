// cg1 시안을 읽어 tools/saved/porter_skins.json 으로 (반 해상도 격자 · 직업 그림 색 · 손 채찍 · 웨건) — 11-11 00:49 사용자 결정
const fs = require('fs'), vm = require('vm');
const pxRows = s => s.replace(/^\n+/, '').replace(/\s+$/, '').split('\n').map(r => r.split('|')[0].trim()).map(r => (r === '-' ? '' : r));
const pxUp = rows => rows.flatMap(r => { const d = [...r].map(c => c + c).join(''); return [d, d]; });
const ctx = { window: {}, PX_HEAD: {}, PXS_HEAD: {}, PX_EX: {}, PXS_EX: {}, PX_WPN: {}, PX_BOW: {}, PXS_BOW: {}, GTYPES: {}, PXL: {}, pxRows, pxUp, console, BX: 12, BY: 34, HY: 22 };
vm.createContext(ctx);
const code = ['rg1.js', 'rg2.js', 'tk1.js', 'tk2.js', 'cg1.js'].map(f => fs.readFileSync(f, 'utf8')).join('\n') + '\n;({ CG, CG_WHIP })';
const { CG, CG_WHIP } = vm.runInContext(code, ctx);
const half = (g) => (Array.isArray(g) ? g : pxRows(g)).filter((_, i) => i % 2 === 0).map(r => [...r].filter((_, i) => i % 2 === 0).join(''));
const head = (k) => ({ front: { top_h: ctx.PX_HEAD[k].top / 2, x_h: (ctx.PX_HEAD[k].x || 0) / 2, rows: half(ctx.PX_HEAD[k].g) },
                        side: { top_h: ctx.PXS_HEAD[k].top / 2, x_h: (ctx.PXS_HEAD[k].x || 0) / 2, rows: half(ctx.PXS_HEAD[k].g) } });
const parts = {}; for (const k of ['pioneer', 'straw', 'oilhood']) parts[k] = head(k);
const ex = {};
for (const k of ['bedroll', 'lantern', 'susp']) ex[k] = { front: { x: ctx.PX_EX[k].x, y: ctx.PX_EX[k].y, under: !!ctx.PX_EX[k].under, rows: half(ctx.PX_EX[k].g) },
                                                         side: { x: ctx.PXS_EX[k].x, y: ctx.PXS_EX[k].y, under: !!ctx.PXS_EX[k].under, rows: half(ctx.PXS_EX[k].g) } };
const wagon = JSON.parse(fs.readFileSync('camp/wagon62.json', 'utf8'));
const out = {
  note: '짐꾼 계열 코네스토가 · 캐러밴마스터 캐릭터 그림 (2026-11-11, 사용자 00:49 결정: 「캐릭터는 A를 캐러밴마스터로, B를 코네스토가로」). 머리 · 덧붙이기 · 손 채찍은 반 해상도(뭉툭 칸) 격자 — 게임에 넣을 때 pxUp으로 두 배(top = top_h×2, x = x_h×2). 앞은 PX_HEAD/PX_EX(BX · HY · BY 기준), 옆은 PXS_HEAD/PXS_EX(SX−1 · SHY · SY 기준). 글자는 pxPal: J/j/I 모자(hc) · W/V 가죽 · A/a 둘째 색(c2) · F 셋째 색(c3) · Z/z 담요 · R 깃털(붉은 줄) · G 놋쇠 · X 빛(gem) · O 나무. 손 채찍(whip_hand)은 앞 = 위에 빈 줄 하나를 더 얹어 손 줄을 홀수로(시안 CG_WHIP_F), 옆 = 그대로. 웨건 = 코네스토가 야영 웨건 80×50(앞이 오른쪽, 글자표 wagon_letters), 팔레트는 camp62.js WAG_PAL.',
  parts, ex,
  whip_hand: half(CG_WHIP),
  looks: {
    caravanmaster: { use: '캐러밴마스터 — 확정 (A 개척민, 지금 실크해트 그림 대신)', look: CG[0][2] },
    conestoga: { use: '3차 코네스토가 — 확정 (B 푸른 짐칸)', look: CG[1][2] },
    unused: { use: '안 고름 (참고) — C 불침번', look: CG[2][2] }
  },
  wagon: { w: wagon.w, h: wagon.h, rows: wagon.rows, wagon_letters: '덮개 C c(그늘) d(테) e(끝 구멍) · 짐칸 B b(널빤지 틈) k(위 띠) K · 바퀴 R r(살) T(쇠 테) h(통) · 받침 v V · 끌채 w W' }
};
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log('parts', Object.keys(parts).length, 'ex', Object.keys(ex).length, 'wagon', wagon.rows.length);
