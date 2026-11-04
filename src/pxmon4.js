/* ───────── 빌드 31 몬스터 손 도트: 천둥 봉우리 · 천계의 유적 폐허 · 별의 정원 (반 해상도 → 두 배, pxmon3.js와 같은 방식) ─────────
   글자: C 몸 · c 그늘 · d 짙음 · Q 밝음 · K 먹 · w 흰 · e 눈빛 · S 살 · s 살 그늘 · 그 밖은 pal. 모두 오른쪽을 본다. */
const PXM4 = {
  // ── 천둥 봉우리 ──
  stormcloud: { h: `
....QQQ.....
..QQCCCQQ...
.QCCCCCCCQQ.
QCCCCCCCCCCQ
CCCCeCCCeCCC
CCCCCCCCCCCC
.ccCCccCCcc.
...cc.Y.cc..
......YY....
.....YY.....
......Y.....
`, pal: { Q: '#8a9ac0', e: '#ffe060', Y: '#ffe060' } },
  thunderhawk: { h: `
.............
BB.......CC..
BBB.....CCeY.
.BBBB..CCCCYY
..BBBBCCCC...
...BBBCCCC...
....BCCCCC...
.....CQQCC...
......K..K...
`, pal: { B: '#4a5aa8', e: '#1a1a2a', Y: '#ff9a30', K: '#a88a1a', Q: '#fff8c0' } },
  stormgolem: { h: `
.Y.CCCCCC.Y.
..YCCCCCCY..
..CCeeeeCC..
..CCCCCCCC..
.CCCCMMCCCC.
CCCCMMMMCCCC
CCCCCMMCCCCC
.CCCCCCCCCC.
..CCC..CCC..
..ccc..ccc..
`, pal: { e: '#8ad8ff', M: '#8ad8ff', Y: '#ffe060' } },
  raiju: { h: `
...........KK.
..........CCCK
.........CCCeC
Y........CCCCY
.Y.CCCCCCCCCC.
YYCCYCCYCCYC..
..CCCCCCCCCC..
..CCc....CCc..
..cc.....cc...
..KK.....KK...
`, pal: { e: '#ffe060', Y: '#ffe060', K: '#3a4a8a' } },
  tempestknight: { h: `
....KKKK....Y
...KKKKKK..Y.
...KeKKeK.Y..
...KKKKKK.L..
.CCCCCCCCCLC.
CCCCCCCCCCLCC
CCCCQQQQCCL..
.CCCCCCCCCL..
...CC..CC.L..
...cc..cc....
`, pal: { K: '#8aa0d0', e: '#ffe060', L: '#c8c8d0', Y: '#ffe060', Q: '#ffe060' } },
  thunderdragon: { h: `
...........CCC..
..........CCCeC.
.Y.......CCCCCYY
..Y.....CCCCK...
.CCY...CCCCC....
.CCCY.CCCCCC....
..CCCCCCCCCC....
...CCQQQQCCC....
...CCQQQQCCCC...
....CCCCCCCCC...
....CC....CCC...
....cc.....cc...
`, pal: { e: '#ffe060', Y: '#ffe060', K: '#ffe060', Q: '#8ab0e8' } },
  stormking: { h: `
....Y.GGGG.Y....
.....GGGGGG..Y..
....GSSSSSSG.Y..
....GSeSSeSG.YY.
....GSSSSSSG.Y..
..CCCCCCCCCCCLY.
.CCCCCCCCCCCCL..
.CCCCMMMMMMCCL..
.CCCCCCCCCCCCL..
..CCCCCCCCCCCL..
...CCC....CCC...
...ccc....ccc...
`, pal: { e: '#8ad8ff', G: '#ffe060', M: '#ffe060', L: '#c8c8e0', Y: '#fff4a0' } },
  // ── 천계의 유적 폐허 ──
  ruinguard: { h: `
....CCCCCC....
...CCCCdCCC...
...CCeCCeCC...
...CCCCCCCC...
.QQCCCCCCCCQQ.
QQCCCCMMCCdCQQ
.QCCCMMMMCCCQ.
..CdCCMMCCCC..
..CCCCCCCdCC..
...CCC..CCC...
...ccc..ccc...
`, pal: { e: '#ffd040', M: '#ffd040' } },
  fallenangel: { h: `
.....HH.H...
....SSSS....
.B..SeSe..B.
BB..SSSS..BB
BBB.CCCC.BBB
.BBCCCCCCBB.
..BCCCCCCB..
...CCCCCC...
...CCCCCC...
....cccc....
.....cc.....
`, pal: { H: '#c0a040', B: '#5a4a6a', e: '#ff4a6a' } },
  seraphknight: { h: `
..Q.KKKK.Q..
..QKKKKKKQ..
...KeKKeK..G
...KKKKKK..G
.CCCCCCCCC.G
CCCCCCCCCCCG
CCCCMMMMCC.G
.CCCCCCCCCGGG
...CC..CC..G.
...cc..cc....
`, pal: { K: '#d8d8e8', e: '#8ad8ff', Q: '#ffffff', M: '#ffd040', G: '#e0e8ff' } },
  sphinx: { h: `
.........YBYB..
........YBYBYB.
........BSSSSB.
........BSeSeB.
C.......BSSSS..
.CCCCCCCCCSSS..
.CCCCCCCCCCCC..
.CCCCCCCCCCCC..
.CCc.....CCc...
.cc......cc....
.KK......KK....
`, pal: { B: '#3a5ab8', Y: '#ffd040', e: '#2a1e1a', K: '#6a4a20' } },
  ophan: { h: `
QQ..........QQ
QQQ..CCCC..QQQ
.QQQCCeeCCQQQ.
..QCC....CCQ..
...Ce.ww.eC...
...C.wEEw.C...
...Ce.ww.eC...
..QCC....CCQ..
.QQQCCeeCCQQQ.
QQQ..CCCC..QQQ
QQ..........QQ
`, pal: { Q: '#fff8e0', e: '#6a3a1a', E: '#ff6a2a' } },
  colossus: { h: `
.....Y.YY.Y.....
......CCCC......
.....CCCCCC.....
.....CeCCeC.....
.....CCCCCC.....
...CCCCCCCCCC...
..CCCCCCCCCCCC..
.CCCCCMMMMCCCCC.
.CCdCCMMMMCCdCC.
.CC.CCCCCCCC.CC.
.QQ.CCCCCCCC.QQ.
....CCCC.CCC....
....cccc.ccc....
`, pal: { e: '#ffffff', M: '#ffffff', Y: '#ffd040' } },
  fallenarch: { h: `
......HHHH......
.....H....H.....
B....SSSSSS....B
BB...SeSSeS...BB
BBB..SSSSSS..BBB
.BBBCCCCCCCCBBB.
..BBCCCCCCCCBB..
.BBBCCMMMMCCBBB.
BB..CCCCCCCC..BB
B...CCCCCCCC...B
.....CCCCCC.....
......cccc......
.......cc.......
`, pal: { H: '#8a6ac8', B: '#4a3a64', e: '#ff3a5a', M: '#c0a0ff' } },
  // ── 별의 정원 ──
  starsprite: { h: `
.....Y......
....YYY.....
.....Y......
..W.SSSS.W..
.WW.SeSe.WW.
WWW.SSSS.WWW
.WWCCCCCCWW.
..WCCCCCCW..
...CCCCCC...
....CCCC....
.....cc.....
`, pal: { Y: '#fff0a0', W: '#c8e8ff', e: '#4a4a8a' } },
  moonhound: { h: `
............KK
...........CCC
..........CCeC
C.........CCCCK
.CCCCCCCCCCCC..
.CCCYYCCCCCC...
.CCYCCCCCCCC...
.CCc.....CCc...
.cc......cc....
.KK......KK....
`, pal: { e: '#ffe060', Y: '#fff8c0', K: '#4a5a8a' } },
  nebula: { h: `
...QQQQQQ...
..QCCCCCCQ..
.QCCwCCCCCQ.
.CCCCCCwCCC.
.CCeCCCCeCC.
.CCCCCCCCCC.
..cCcCcCcC..
..c.c.c.c...
...c.c.c.c..
..c.c.c.c...
`, pal: { Q: '#e0c0ff', w: '#ffffff', e: '#2a1a4a' } },
  constellation: { h: `
.....Y......
....KKKK....
...KKKKKK..L
...KeKKeK..L
...KKKKKK..L
.CCCCCCCCCCL
CCwCCCCCwCCL
CCCCYYYYCC.L
.CCwCCCCwCCL
...CC..CC..L
...cc..cc...
`, pal: { Y: '#fff0a0', K: '#8a9ad8', e: '#ffffff', w: '#ffffff', L: '#d8e0ff' } },
  startreant: { h: `
...LLYLLLL...
..LLLLLLYLL..
.LYLLLLLLLLL.
.LLLLLYLLLYL.
..LLLLLLLLL..
....CCCCCC...
....CeCCeC...
....CCCCCC...
..CCCCCCCCCC.
.CC.CCCCCC.CC
....CC..CC...
...ccc..ccc..
`, pal: { L: '#5a4a8a', Y: '#fff0a0', e: '#fff0a0' } },
  starwhale: { h: `
..Y......CCCC...
......CCCCCCCCC.
C...CCCwCCCCCCCC
CC.CCCCCCCCCCeCC
.CCCCCCCCwCCCCCC
CC.CCCCCCCCCCCCC
C...QQQQQQQQQQQ.
.....QQQQQQQQQ..
......cc...cc...
`, pal: { w: '#ffffff', Q: '#a8f0ff', e: '#ffffff', Y: '#fff0a0' } },
  starqueen: { h: `
....Y.YYYY.Y....
.....YYYYYY...Y.
....HSSSSSSH.YYY
....HSeSSeSH..L.
....HSSSSSSH..L.
...HHCCCCCCHH.L.
..CCCCCCCCCCCCL.
.CCCCCwMMwCCCCL.
.CCCCCCMMCCCCCL.
CCCwCCCCCCCwCCC.
CCCCCCCCCCCCCCC.
.CCCCCwCCCCCCC..
..cccccccccccc..
`, pal: { Y: '#fff0a0', H: '#c8d0ff', e: '#4a4aa8', M: '#fff0a0', w: '#ffffff', L: '#d8d8f0' } }
};
// 반 해상도 → 두 배
Object.keys(PXM4).forEach(id => {
  const M = PXM4[id], rows = M.h.split('\n').filter(r => r.trim().length);
  const W = Math.max(...rows.map(r => r.length));
  const g = ['.'.repeat(W * 2 + 1)].concat(rows.map(r => '.' + r.padEnd(W, '.').split('').map(ch => ch + ch).join('')).flatMap(r => [r, r])).join('\n');
  PXM[id] = { g: '\n' + g + '\n', pal: M.pal || {} };
});
