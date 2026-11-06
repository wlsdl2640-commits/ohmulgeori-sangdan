// 지하수로 몬스터 무기 (빌드 52): 하수관 몽둥이
// 하수관 몽둥이 (하수도 트롤): 굵은 쇠 파이프 · 끝에 이음쇠 · 녹
PXU_WPN.pipe = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  at(-0.8, 0, 'N');
  for (let t = 0.6; t <= 6.4 * k; t += 0.5) { at(t, -0.5, 'M'); at(t, 0.5, 'N'); }
  for (let t = 6.4 * k; t <= 7 * k; t += 0.5) { at(t, -1.2, 'N'); at(t, -0.3, 'N'); at(t, 0.6, 'n'); at(t, 1.4, 'n'); }
  at(1.8 * k, -1.2, 'N'); at(1.8 * k, 1.2, 'n');
  for (const [t, s] of [[2.2, 0.5], [3.6, -0.5], [4.4, 0.5]]) at(t * k, s, 'r');
  return out; };
PXU_FXW.pipe = 'club';
/* ───────── 지하수로 · 지하수로 깊은 곳 몬스터 (빌드 52 시안): 하수도 쥐떼 · 오물 슬라임 · 하수도 악어 · 쥐인간 도둑 · 하수도 트롤 ───────── */
Object.assign(PXU, {
  sewerrat: {   // 하수도 쥐떼 A 잿빛(기본 · 펫 다 자란 모습): 평원 들쥐 모습 그대로 세 마리(사용자 결정) — 앞 둘 뒤 하나, 물 때는 맨 앞 쥐가 입을 벌린다
    pal: { K: '#ff3030', w: '#f4ecd0', x: '#ffffff', Q: '#8a8278', C: '#5e5850', c: '#3e3a34', S: '#c88a84', s: '#946058' },
    g: `
....................QQc
...................QCSc
..............QQQQQCCCCc
............QQCCCCCCCKwC
...........QCCCCCCCCCCCCSs
..........sCQQcCCCCCCCcww...QQc
.........s.QCSccccCCCcc....QCSc
......QQQQQCCCCc..SS.SQQQQQCCCCc
....QQCCCCCCCKwC....QQCCCCCCCKwC
...QCCCCCCCCCCCCSs.QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.sCCCCCCCCCCCcww
.s..cCCcccCCCcc..s..cCCcccCCCcc
s....SS...SS.S..s....SS...SS.S
`, g2: `
....................QQc
...................QCSc
..............QQQQQCCCCc
............QQCCCCCCCKwC
...........QCCCCCCCCCCCCSs
..........sCQQcCCCCCCCcww...QQc
..........sQCSccccCCCcc....QCSc
......QQQQQCCCCc..SS.SQQQQQCCCCc
....QQCCCCCCCKwC....QQCCCCCCCKwC
...QCCCCCCCCCCCCSs.QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.sCCCCCCCCCCCcww
..s.cCCcccCCCcc...s.cCCcccCCCcc
.ss..SS...SS.S...ss..SS...SS.S
`, gp: { bite: { y: 8, g: `....................QQCCCCCCCKwCSs
...................QCCCCCCCCCCCww_
..................sCCCCCCCCCCK____
.................s..cCCcccCCCcww..
` } }, gm: { leap: `
.
.....................QQc
....................QCSc
...........sQQQQQQQCCCCc
..........s.QCCCCCCCCKwCSs
.........s..cCCCCCCCCCCcww
........s.SScQQccccccc.......QQc
............QCSc......SS....QCSc
...sQQQQQQQCCCCc...sQQQQQQQCCCCc
..s.QCCCCCCCCKwCSss.QCCCCCCCCKwCSs
.s..cCCCCCCCCCCcws..cCCCCCCCCCCcww
s.SScccccccccc..s.SScccccccccc
..............SS..............SS
` }, sh: [31, 9], hip: 11, ax: 17, still: 1, noArm: 1, wpn: 'none' },
  sewerrat_b: {   // 하수도 쥐떼 B 검은 쥐 셋 · 노란 눈
    pal: { K: '#f0d040', w: '#f4ecd0', x: '#ffffff', Q: '#4a4648', C: '#2e2c30', c: '#1c1a1e', S: '#b08080', s: '#805858' },
    g: `
....................QQc
...................QCSc
..............QQQQQCCCCc
............QQCCCCCCCKwC
...........QCCCCCCCCCCCCSs
..........sCQQcCCCCCCCcww...QQc
.........s.QCSccccCCCcc....QCSc
......QQQQQCCCCc..SS.SQQQQQCCCCc
....QQCCCCCCCKwC....QQCCCCCCCKwC
...QCCCCCCCCCCCCSs.QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.sCCCCCCCCCCCcww
.s..cCCcccCCCcc..s..cCCcccCCCcc
s....SS...SS.S..s....SS...SS.S
`, g2: `
....................QQc
...................QCSc
..............QQQQQCCCCc
............QQCCCCCCCKwC
...........QCCCCCCCCCCCCSs
..........sCQQcCCCCCCCcww...QQc
..........sQCSccccCCCcc....QCSc
......QQQQQCCCCc..SS.SQQQQQCCCCc
....QQCCCCCCCKwC....QQCCCCCCCKwC
...QCCCCCCCCCCCCSs.QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.sCCCCCCCCCCCcww
..s.cCCcccCCCcc...s.cCCcccCCCcc
.ss..SS...SS.S...ss..SS...SS.S
`, gp: { bite: { y: 8, g: `....................QQCCCCCCCKwCSs
...................QCCCCCCCCCCCww_
..................sCCCCCCCCCCK____
.................s..cCCcccCCCcww..
` } }, gm: { leap: `
.
.....................QQc
....................QCSc
...........sQQQQQQQCCCCc
..........s.QCCCCCCCCKwCSs
.........s..cCCCCCCCCCCcww
........s.SScQQccccccc.......QQc
............QCSc......SS....QCSc
...sQQQQQQQCCCCc...sQQQQQQQCCCCc
..s.QCCCCCCCCKwCSss.QCCCCCCCCKwCSs
.s..cCCCCCCCCCCcws..cCCCCCCCCCCcww
s.SScccccccccc..s.SScccccccccc
..............SS..............SS
` }, sh: [31, 9], hip: 11, ax: 17, still: 1, noArm: 1, wpn: 'none' },
  sewerrat_c: {   // 하수도 쥐떼 C 갈색 쥐 셋 · 초록 눈
    pal: { K: '#8af060', w: '#f4ecd0', x: '#ffffff', Q: '#9a7a5a', C: '#6e5438', c: '#4a3824', S: '#c89a8a', s: '#9a6a5e' },
    g: `
....................QQc
...................QCSc
..............QQQQQCCCCc
............QQCCCCCCCKwC
...........QCCCCCCCCCCCCSs
..........sCQQcCCCCCCCcww...QQc
.........s.QCSccccCCCcc....QCSc
......QQQQQCCCCc..SS.SQQQQQCCCCc
....QQCCCCCCCKwC....QQCCCCCCCKwC
...QCCCCCCCCCCCCSs.QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.sCCCCCCCCCCCcww
.s..cCCcccCCCcc..s..cCCcccCCCcc
s....SS...SS.S..s....SS...SS.S
`, g2: `
....................QQc
...................QCSc
..............QQQQQCCCCc
............QQCCCCCCCKwC
...........QCCCCCCCCCCCCSs
..........sCQQcCCCCCCCcww...QQc
..........sQCSccccCCCcc....QCSc
......QQQQQCCCCc..SS.SQQQQQCCCCc
....QQCCCCCCCKwC....QQCCCCCCCKwC
...QCCCCCCCCCCCCSs.QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.sCCCCCCCCCCCcww
..s.cCCcccCCCcc...s.cCCcccCCCcc
.ss..SS...SS.S...ss..SS...SS.S
`, gp: { bite: { y: 8, g: `....................QQCCCCCCCKwCSs
...................QCCCCCCCCCCCww_
..................sCCCCCCCCCCK____
.................s..cCCcccCCCcww..
` } }, gm: { leap: `
.
.....................QQc
....................QCSc
...........sQQQQQQQCCCCc
..........s.QCCCCCCCCKwCSs
.........s..cCCCCCCCCCCcww
........s.SScQQccccccc.......QQc
............QCSc......SS....QCSc
...sQQQQQQQCCCCc...sQQQQQQQCCCCc
..s.QCCCCCCCCKwCSss.QCCCCCCCCKwCSs
.s..cCCCCCCCCCCcws..cCCCCCCCCCCcww
s.SScccccccccc..s.SScccccccccc
..............SS..............SS
` }, sh: [31, 9], hip: 11, ax: 17, still: 1, noArm: 1, wpn: 'none' },
  sludge: {   // 오물 슬라임 A 녹갈색(기본): 흘러내리는 오물 덩이 · 안에 뼈다귀 · 거품 (공 명암)
    pal: { K: '#1a2a10', w: '#f4ecd0', e: '#ff4040', x: '#ffffff', Q: '#8a9a4a', C: '#5a6a3a', c: '#3a4a26', d: '#2a3618', B: '#e8e0c8', b: '#b8d060' },
    g: `
.....QQQQ
...QQwwQQCCb
..QwwQQQCCCcb
..QQQQQQCCCccc
.QQQQBBCKCcKcc
.QQQQBBCKccKdc
.CCCCCCCccccdc
.cCCCCcKKKdcc
.ccccccccccdd
..c.ccc..cc.c
`, g2: `
.
....QQwwQ.b
..QQwwQQCCCb
.QQwQQQQCCCcCc
.QQQQBBCKCCKcc
.QQQQBBCKCcKcc
.QQCCCCCCcccdc
.cCCCCCKKKccc
.ccccccccccdd
.c..cc...ccc
`, gm: { squash: `
.
.
.
.
...QQwwQQQ.b
.QQwwQQQCCCcb
QQQQQBBKCCKccc
QCCCCBBKKKccdc
ccccccccccdddd
c.cc.ccc.cc.cc
`, stretch: `
....QQQ
...QwwQQ
..QwwQQQC.b
..QQQQQCCCb
..QQQQBBCKcKc
..QQQCBBCKcKc
..CCCCCCccdCc
..cCCCCKKKdcc
..ccccccccddc
...c.cc..cc
` }, sh: [10, 4], hip: 9, ax: 7, still: 1, noArm: 1, wpn: 'none' },
  sludge_b: {   // 오물 슬라임 B 검은 폐수 · 보랏빛 광택 · 안에 해골
    pal: { K: '#c060ff', w: '#f4ecd0', e: '#ff4040', x: '#ffffff', Q: '#6a5a7a', C: '#3a3046', c: '#241c2e', d: '#161020', B: '#e0d8e8', b: '#a080c0' },
    g: `
.....QQQQ
...QQwwQQCCb
..QwwQQQCCCcb
..QQQQQQCCCccc
.QQQQBBCKCcKcc
.QQQQBBCKccKdc
.CCCCCCCccccdc
.cCCCCcKKKdcc
.ccccccccccdd
..c.ccc..cc.c
`, g2: `
.
....QQwwQ.b
..QQwwQQCCCb
.QQwQQQQCCCcCc
.QQQQBBCKCCKcc
.QQQQBBCKCcKcc
.QQCCCCCCcccdc
.cCCCCCKKKccc
.ccccccccccdd
.c..cc...ccc
`, gm: { squash: `
.
.
.
.
...QQwwQQQ.b
.QQwwQQQCCCcb
QQQQQBBKCCKccc
QCCCCBBKKKccdc
ccccccccccdddd
c.cc.ccc.cc.cc
`, stretch: `
....QQQ
...QwwQQ
..QwwQQQC.b
..QQQQQCCCb
..QQQQBBCKcKc
..QQQCBBCKcKc
..CCCCCCccdCc
..cCCCCKKKdcc
..ccccccccddc
...c.cc..cc
` }, sh: [10, 4], hip: 9, ax: 7, still: 1, noArm: 1, wpn: 'none' },
  sludge_c: {   // 오물 슬라임 C 밝은 초록 독 오물 · 거품 가득
    pal: { K: '#ff3838', w: '#f4ecd0', e: '#ff4040', x: '#ffffff', Q: '#b8f060', C: '#6ab038', c: '#448024', d: '#2e5a18', B: '#d8f0a0', b: '#f0ffb0' },
    g: `
.....QQQQ
...QQwwQQCCb
..QwwQQQCCCcb
..QQQQQQCCCccc
.QQQQBBCKCcKcc
.QQQQBBCKccKdc
.CCCCCCCccccdc
.cCCCCcKKKdcc
.ccccccccccdd
..c.ccc..cc.c
`, g2: `
.
....QQwwQ.b
..QQwwQQCCCb
.QQwQQQQCCCcCc
.QQQQBBCKCCKcc
.QQQQBBCKCcKcc
.QQCCCCCCcccdc
.cCCCCCKKKccc
.ccccccccccdd
.c..cc...ccc
`, gm: { squash: `
.
.
.
.
...QQwwQQQ.b
.QQwwQQQCCCcb
QQQQQBBKCCKccc
QCCCCBBKKKccdc
ccccccccccdddd
c.cc.ccc.cc.cc
`, stretch: `
....QQQ
...QwwQQ
..QwwQQQC.b
..QQQQQCCCb
..QQQQBBCKcKc
..QQQCBBCKcKc
..CCCCCCccdCc
..cCCCCKKKdcc
..ccccccccddc
...c.cc..cc
` }, sh: [10, 4], hip: 9, ax: 7, still: 1, noArm: 1, wpn: 'none' },
  sewercroc: {   // 하수도 악어 A 이끼 악어(기본): 슬림한 몸 · 솟은 눈두덩 · 앞으로 뻗은 주둥이와 위아래 이빨 · 작은 등 비늘 · 발톱 (사용자: 「슬림하게 디테일 다듬기」)
    pal: { K: '#f0d040', w: '#f4f0e0', x: '#ffffff', Q: '#7a9a5a', C: '#4a6a4a', c: '#2e4a2e', d: '#1e3420', Z: '#8ab060', S: '#c8d8b0', s: '#8a9a78', R: '#c03030', r: '#802020' },
    g: `
...................QKwQ
..............Z.Z.ZCCCCQ
............ZQZQZQZCCCCCQQQQQQQc
..........ZQCCCCCCCCCCCCCCCCCCCKc
........QQCCCCCCCCCCCCCCCwdwdwdwd
......QQCCCCCCCCCCCCCCCCdSdSdSdSs
....QQCCCCCCCCCCCCCCCCCcssssss
..QQCCCCCCCCCCCCCCCCCccc
cCCCCCCCCCCCCCCCCCccc
cc...cCCCc....cCCCc
.....ccKcc....ccKcc
`, g2: `
...................QKwQ
..............Z.Z.ZCCCCQ
............ZQZQZQZCCCCCQQQQQQQc
..........ZQCCCCCCCCCCCCCCCCCCCKc
........QQCCCCCCCCCCCCCCCwdwdwdwd
......QQCCCCCCCCCCCCCCCCdSdSdSdSs
..Q.QQCCCCCCCCCCCCCCCCCcssssss
cC.QCCCCCCCCCCCCCCCCCccc
..CCCCCCCCCCCCCCCCccc
cc...cCCCc....cCCCc
.....ccKcc....ccKcc
`, gp: { bite: { y: 0, g: `
...................QKwQ..........
..............Z.Z.ZCCCCQQ........
............ZQZQZQZCCCCCCQQQQQQc.
..........ZQCCCCCCCCCCCCCCCCCwKwc
........QQCCCCCCCCCCCCCCCRRRRRRRr
......QQCCCCCCCCCCCCCCCCRRRRRRr..
....QQCCCCCCCCCCCCCCCCCcSwSwSwSs.
..QQCCCCCCCCCCCCCCCCCcccsssss....
cCCCCCCCCCCCCCCCCCccc............
cc...cCCCc....cCCCc..............
.....ccKcc....ccKcc..............
` } }, gm: { leap: `
.
.......................QKwQ
..................Z.Z.ZCCCCQ
................ZQZQZQZCCCCCQQQQQc
..............ZQCCCCCCCCCCCCCCCCKc
............QQCCCCCCCCCCCCCCwdwdwd
..........QQCCCCCCCCCCCCCCCdSdSdSs
........QQCCCCCCCCCCCCCCCCcsssss
......QQCCCCCCCCCCCCCCCCccc
...QQQCCCCCCCCCCCCCCCccc
cccccccccc.ccccc...ccccc
` }, sh: [26, 4], hip: 8, ax: 14, still: 1, noArm: 1, wpn: 'none' },
  sewercroc_b: {   // 하수도 악어 B 검은 악어 · 붉은 눈 · 쇠빛 등 비늘
    pal: { K: '#ff4040', w: '#f4f0e0', x: '#ffffff', Q: '#4a5050', C: '#2a3034', c: '#181c20', d: '#0c1014', Z: '#b0b8b8', S: '#9aa0a0', s: '#6a7070', R: '#c03030', r: '#802020' },
    g: `
...................QKwQ
..............Z.Z.ZCCCCQ
............ZQZQZQZCCCCCQQQQQQQc
..........ZQCCCCCCCCCCCCCCCCCCCKc
........QQCCCCCCCCCCCCCCCwdwdwdwd
......QQCCCCCCCCCCCCCCCCdSdSdSdSs
....QQCCCCCCCCCCCCCCCCCcssssss
..QQCCCCCCCCCCCCCCCCCccc
cCCCCCCCCCCCCCCCCCccc
cc...cCCCc....cCCCc
.....ccKcc....ccKcc
`, g2: `
...................QKwQ
..............Z.Z.ZCCCCQ
............ZQZQZQZCCCCCQQQQQQQc
..........ZQCCCCCCCCCCCCCCCCCCCKc
........QQCCCCCCCCCCCCCCCwdwdwdwd
......QQCCCCCCCCCCCCCCCCdSdSdSdSs
..Q.QQCCCCCCCCCCCCCCCCCcssssss
cC.QCCCCCCCCCCCCCCCCCccc
..CCCCCCCCCCCCCCCCccc
cc...cCCCc....cCCCc
.....ccKcc....ccKcc
`, gp: { bite: { y: 0, g: `
...................QKwQ..........
..............Z.Z.ZCCCCQQ........
............ZQZQZQZCCCCCCQQQQQQc.
..........ZQCCCCCCCCCCCCCCCCCwKwc
........QQCCCCCCCCCCCCCCCRRRRRRRr
......QQCCCCCCCCCCCCCCCCRRRRRRr..
....QQCCCCCCCCCCCCCCCCCcSwSwSwSs.
..QQCCCCCCCCCCCCCCCCCcccsssss....
cCCCCCCCCCCCCCCCCCccc............
cc...cCCCc....cCCCc..............
.....ccKcc....ccKcc..............
` } }, gm: { leap: `
.
.......................QKwQ
..................Z.Z.ZCCCCQ
................ZQZQZQZCCCCCQQQQQc
..............ZQCCCCCCCCCCCCCCCCKc
............QQCCCCCCCCCCCCCCwdwdwd
..........QQCCCCCCCCCCCCCCCdSdSdSs
........QQCCCCCCCCCCCCCCCCcsssss
......QQCCCCCCCCCCCCCCCCccc
...QQQCCCCCCCCCCCCCCCccc
cccccccccc.ccccc...ccccc
` }, sh: [26, 4], hip: 8, ax: 14, still: 1, noArm: 1, wpn: 'none' },
  sewercroc_c: {   // 하수도 악어 C 늙은 백악어 · 흐린 하늘빛 눈
    pal: { K: '#8ad0e0', w: '#ffffff', x: '#ffffff', Q: '#e0e0d0', C: '#b0b0a0', c: '#808070', d: '#505048', Z: '#f0f0e0', S: '#e8e8d8', s: '#b0b0a0', R: '#d04040', r: '#902828' },
    g: `
...................QKwQ
..............Z.Z.ZCCCCQ
............ZQZQZQZCCCCCQQQQQQQc
..........ZQCCCCCCCCCCCCCCCCCCCKc
........QQCCCCCCCCCCCCCCCwdwdwdwd
......QQCCCCCCCCCCCCCCCCdSdSdSdSs
....QQCCCCCCCCCCCCCCCCCcssssss
..QQCCCCCCCCCCCCCCCCCccc
cCCCCCCCCCCCCCCCCCccc
cc...cCCCc....cCCCc
.....ccKcc....ccKcc
`, g2: `
...................QKwQ
..............Z.Z.ZCCCCQ
............ZQZQZQZCCCCCQQQQQQQc
..........ZQCCCCCCCCCCCCCCCCCCCKc
........QQCCCCCCCCCCCCCCCwdwdwdwd
......QQCCCCCCCCCCCCCCCCdSdSdSdSs
..Q.QQCCCCCCCCCCCCCCCCCcssssss
cC.QCCCCCCCCCCCCCCCCCccc
..CCCCCCCCCCCCCCCCccc
cc...cCCCc....cCCCc
.....ccKcc....ccKcc
`, gp: { bite: { y: 0, g: `
...................QKwQ..........
..............Z.Z.ZCCCCQQ........
............ZQZQZQZCCCCCCQQQQQQc.
..........ZQCCCCCCCCCCCCCCCCCwKwc
........QQCCCCCCCCCCCCCCCRRRRRRRr
......QQCCCCCCCCCCCCCCCCRRRRRRr..
....QQCCCCCCCCCCCCCCCCCcSwSwSwSs.
..QQCCCCCCCCCCCCCCCCCcccsssss....
cCCCCCCCCCCCCCCCCCccc............
cc...cCCCc....cCCCc..............
.....ccKcc....ccKcc..............
` } }, gm: { leap: `
.
.......................QKwQ
..................Z.Z.ZCCCCQ
................ZQZQZQZCCCCCQQQQQc
..............ZQCCCCCCCCCCCCCCCCKc
............QQCCCCCCCCCCCCCCwdwdwd
..........QQCCCCCCCCCCCCCCCdSdSdSs
........QQCCCCCCCCCCCCCCCCcsssss
......QQCCCCCCCCCCCCCCCCccc
...QQQCCCCCCCCCCCCCCCccc
cccccccccc.ccccc...ccccc
` }, sh: [26, 4], hip: 8, ax: 14, still: 1, noArm: 1, wpn: 'none' },
  ratman: {   // 쥐인간 도둑 A 갈색(기본): 쥐 머리(긴 주둥이 · 둥근 귀 · 수염) · 누더기 두건 · 등에 훔친 자루 · 꼬리 · 단검
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#1a1010', o: '#8a6a5a', O: '#c89a8a', H: '#5a4a3a', F: '#8a7a6a', f: '#5e5044', n: '#c89a8a', K: '#1a1010', B: '#a08a5a', b: '#6e5a34', C: '#4a3a2e', c: '#2e2218', G: '#9a7a3a', g: '#6a5020', P: '#3a3028', p: '#241c16', k: '#1a1410', t: '#c89a8a' },
    g: `
..oo......oo
.oOOo....oOOo
..OHHHHHHHHO
..HHHHHHHHHHH
..HFFeFFFFFFH
..FFFFFFFFFFFn
..fFFFFFFFFFwwn
...fFFFFKKFFn
....ffFFFFff
..BB..CCCCCc
.BBBb.CCCCCCc
.BBBbcCCCCCCc
.BBBbcCCCCCCc
..bb.GGGGGGGg
.....cCCCCCCc
t....PPp.PPP
tt..PPPp.PPPp
.tt.PPp..PPp
..tt.kK..kK
`, g2: `
..oo......oo
.oOOo....oOOo
..OHHHHHHHHO
..HHHHHHHHHHH
..HFFeFFFFFFH
..FFFFFFFFFFFn
..fFFFFFFFFFwwn
...fFFFFKKFFn
....ffFFFFff
..BB..CCCCCc
.BBBb.CCCCCCc
.BBBbcCCCCCCc
.BBBbcCCCCCCc
..bb.GGGGGGGg
t....cCCCCCCc
tt...PPp.PPP
.tt.PPPp.PPPp
..ttPPp..PPp
.....kK..kK
`, sh: [11, 10], hip: 14, ax: 8, arm: ['C', 'c'], hand: 'F', wpn: 'dagger', idle: { h: [2, 2], a: 25 } },
  ratman_b: {   // 쥐인간 도둑 B 회색 · 붉은 눈 · 붉은 두건 · 가죽 조끼
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#ff4040', o: '#6a6a70', O: '#c8a0a0', H: '#a83030', F: '#8a8a92', f: '#5e5e66', n: '#c8a0a0', K: '#1a1010', B: '#8a7a5a', b: '#5e5034', C: '#5a4634', c: '#3a2c1e', G: '#9a9aa0', g: '#606068', P: '#3a3a42', p: '#24242a', k: '#1a1a20', t: '#c8a0a0' },
    g: `
..oo......oo
.oOOo....oOOo
..OHHHHHHHHO
..HHHHHHHHHHH
..HFFeFFFFFFH
..FFFFFFFFFFFn
..fFFFFFFFFFwwn
...fFFFFKKFFn
....ffFFFFff
..BB..CCCCCc
.BBBb.CCCCCCc
.BBBbcCCCCCCc
.BBBbcCCCCCCc
..bb.GGGGGGGg
.....cCCCCCCc
t....PPp.PPP
tt..PPPp.PPPp
.tt.PPp..PPp
..tt.kK..kK
`, g2: `
..oo......oo
.oOOo....oOOo
..OHHHHHHHHO
..HHHHHHHHHHH
..HFFeFFFFFFH
..FFFFFFFFFFFn
..fFFFFFFFFFwwn
...fFFFFKKFFn
....ffFFFFff
..BB..CCCCCc
.BBBb.CCCCCCc
.BBBbcCCCCCCc
.BBBbcCCCCCCc
..bb.GGGGGGGg
t....cCCCCCCc
tt...PPp.PPP
.tt.PPPp.PPPp
..ttPPp..PPp
.....kK..kK
`, sh: [11, 10], hip: 14, ax: 8, arm: ['C', 'c'], hand: 'F', wpn: 'dagger', idle: { h: [2, 2], a: 25 } },
  ratman_c: {   // 쥐인간 도둑 C 검은 두목 · 금니 · 보라 두건 · 금화 자루
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#f0d040', o: '#2e2a30', O: '#a08090', H: '#5a3a7a', F: '#3a3640', f: '#242228', n: '#a08090', K: '#f0c040', B: '#c8a040', b: '#8a6a20', C: '#2e2a34', c: '#1a181e', G: '#e0b040', g: '#9a7424', P: '#2a2830', p: '#18161c', k: '#121014', t: '#a08090' },
    g: `
..oo......oo
.oOOo....oOOo
..OHHHHHHHHO
..HHHHHHHHHHH
..HFFeFFFFFFH
..FFFFFFFFFFFn
..fFFFFFFFFFwwn
...fFFFFKKFFn
....ffFFFFff
..BB..CCCCCc
.BBBb.CCCCCCc
.BBBbcCCCCCCc
.BBBbcCCCCCCc
..bb.GGGGGGGg
.....cCCCCCCc
t....PPp.PPP
tt..PPPp.PPPp
.tt.PPp..PPp
..tt.kK..kK
`, g2: `
..oo......oo
.oOOo....oOOo
..OHHHHHHHHO
..HHHHHHHHHHH
..HFFeFFFFFFH
..FFFFFFFFFFFn
..fFFFFFFFFFwwn
...fFFFFKKFFn
....ffFFFFff
..BB..CCCCCc
.BBBb.CCCCCCc
.BBBbcCCCCCCc
.BBBbcCCCCCCc
..bb.GGGGGGGg
t....cCCCCCCc
tt...PPp.PPP
.tt.PPPp.PPPp
..ttPPp..PPp
.....kK..kK
`, sh: [11, 10], hip: 14, ax: 8, arm: ['C', 'c'], hand: 'F', wpn: 'dagger', idle: { h: [2, 2], a: 25 } },
  sewertroll: {   // 하수도 트롤 A 긴 코 이끼 트롤(우두머리 기본, ms 1.5): 긴 매부리코 · 뾰족 귀 · 뻐드렁니 · 등에 이끼 · 뒷팔이 땅까지 · 하수관 몽둥이
    pal: { M: '#c8ccd4', N: '#8a8e98', n: '#4a6a40', x: '#f4f6fa', w: '#f4f0e0', r: '#8a4a2a', h: '#2e4a2e', S: '#6a8a5a', s: '#4a6a40', Q: '#8aa878', K: '#1a2a1a', C: '#5a7a5a', c: '#3a5a3a', Z: '#3a6a2a', T: '#6e5a3a', t: '#4a3c24', k: '#2a3a24' },
    g: `
..........hhh...h
.........hhhhhhhh
..h.....hQQQQSSsh.h
..hh...hQQQQSSSsshh
...hhhhQQKQSSSKssh
....hSSSSSSSSSsssSn
...ZZsSSSSSSssssnnn
..ZZZZsSswsssswsS
..ZZZZZsSsssssss
..ZZZZZZQQQQQQCCCCCC
..ZZZZZZQQQQQQCCCCCccC
.ZZZZZZQQQQQQCCCCCCcccc
.ZZZZZQQQQQQCCCCCCcccccc
.ZZZZQQQQCCCCCCCCccccccc
.ZZZCCCCCCCCCCCccccccccc
.CCCCCCCCCCCcccccccccccc
.CCCcccccccccccccccccCc
.CCc.ccccccccccccccCCc
.CCc..TTtTTTTtTTTTtTT
.CCc..tTTTTtTTTTtTTT
.SSc..CCCCCCc.cCCCCC
.SSs..CCCCCCc.cCCCCC
.Ss...cCCCCc...cCCCCc
......kKKKKKk..kKKKKKk
`, sh: [20, 10], hip: 18, ax: 13, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'pipe', idle: { h: [3, 6], a: 75 } },
  sewertroll_b: {   // 하수도 트롤 B 뚱뚱한 폐수 트롤: 둥근 배 · 작은 머리 · 물고기 뼈 목걸이 · 노란 눈
    pal: { M: '#c8ccd4', N: '#8a8e98', n: '#3e4a3e', x: '#f4f6fa', w: '#f4f0e0', r: '#8a4a2a', h: '#3a3a40', S: '#5a6a5a', s: '#3e4a3e', Q: '#7a8a7a', K: '#f0d040', C: '#4a5a4a', c: '#2e3a2e', d: '#2a3a20', B: '#e8e0c8', T: '#5a4a38', t: '#3a2e22', k: '#1a2a1a' },
    g: `
...........hhhhhhh
..........hhhhhhhhh
...h.....hQQQQSSSSh..h
...hh....QQQQSSSssShh
....hh..QQKKSSSsKKSh
.....hhsSSSSSSnsssS
.......ssSwSssswss
........sSsssssss
.......BwBwBwBwBwB
....CQQQQQQQQQCCCCcCC
...QQQQQQQQQQQCCCCCccC
..QQQQQQQQQQQCCCCCCcccC
.QQQQQQQQQQQCCCCCCcccccC
.QQQQQQQQdCCCCCCCccccccC
.CCQQCCCddCCCCCCcccccccC
.cCCCCCCdCCCCccccccccccc
.cCCCCCCCCccccccccccccCc
..cccccccccccccccccccCc
...cCccccccccccccccCCc
....TTtTTTTtTTTTtTTTT
....tTTTTtTTTTtTTTTt
....CCCCCCc...cCCCCC
....cCCCCc.....cCCCCc
...kKKKKKk.....kKKKKKk
`, sh: [20, 10], hip: 19, ax: 12, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'pipe', idle: { h: [3, 6], a: 75 } },
  sewertroll_c: {   // 하수도 트롤 C 외눈 뼈 트롤: 외눈 · 뿔 둘 · 어깨 위 해골 · 뼈 목걸이
    pal: { M: '#c8ccd4', N: '#8a8e98', n: '#302c36', x: '#e8e0c8', w: '#f4f0e0', r: '#8a4a2a', V: '#d8d0b8', h: '#1e1a22', S: '#4a4650', s: '#302c36', Q: '#6a6676', K: '#160e10', e: '#ff3030', C: '#3e3a46', c: '#26222c', B: '#e8e0c8', T: '#4a3a30', t: '#302420', k: '#141218' },
    g: `
.....V...........V
.....VV.........VV
......hhhhhhhhhhh
.....hhhhhhhhhhhhh
.....hQQQQQSSSSssh
.....QQQQxKKxSsssS
.....SSSSKKeKKsssn
.....sSSSSKKssssnnn
.....ssswssssswsS
......sSssssssSs
..xx..CQQQQQQQCCCCC
.xKxx.QQQQQQQQCCCCccC
.xxxx.QQQQBwBwBwBCccc
..xx.QQQQQQQCCCCCccccc
....QQQQQCCCCCCCccccccc
...cCCCCCCCCCCccccccccc
...cCCCCCCCCcccccccccCc
...cCcccccccccccccccCc
....cCCcccccccccccCCc
....TTtTTTTtTTTTtTTT
....tTTTTtTTTTtTTTT
....CCCCCCc..cCCCCC
....cCCCCc....cCCCCc
...kKKKKKk....kKKKKKk
`, sh: [20, 11], hip: 19, ax: 12, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'pipe', idle: { h: [3, 6], a: 75 } }
});
Object.assign(PXU_ACT, {
  sewerrat: { atk: ['qbite', 'qpounce'], skl: ['qgnaw'], tk: 1.05, fx: { atk: { pal: 'earth', hit: 'bite' }, skl: { pal: 'blood', hit: 'bite', big: 1, after: 'dust' } } },
  sludge: { atk: ['sbounce'], skl: ['sslam'], tk: 0.95, fx: { atk: { pal: 'poison', hit: 'star' }, skl: { pal: 'poison', hit: 'poison', big: 1, after: 'bubbles' } } },
  sewercroc: { atk: ['qbite', 'qcharge'], skl: ['qmaul'], tk: 1.2, fx: { atk: { pal: 'water', hit: 'bite', big: 1 }, skl: { pal: 'blood', hit: 'bite', big: 1, after: 'bubbles' } } },
  ratman: { atk: ['thrust', 'hack', 'down'], skl: ['jstab'], tk: 1.0, fx: { atk: { pal: 'steel', hit: 'star' }, skl: { pal: 'bolt', hit: 'stun', big: 1, after: 'sparks' } } },
  sewertroll: { atk: ['side', 'down'], skl: ['smash'], tk: 1.3, fx: { atk: { pal: 'earth', hit: 'star', big: 2 }, skl: { pal: 'water', hit: 'quake', big: 2, after: 'bubbles', aoe: 'flood', shake: 4 } } }
});
// 만날 때마다 모습 하나 (빌드 52, 사용자 결정 「다」): 기본 모습이 아닌 것은 드랍 없는 이름표 (pxuLook)
pxuLook('sewerrat_b', 'sewerrat', MONS.sewerrat.name); pxuLook('sewerrat_c', 'sewerrat', MONS.sewerrat.name);
pxuLook('sludge_b', 'sludge', MONS.sludge.name); pxuLook('sludge_c', 'sludge', MONS.sludge.name);
pxuLook('sewercroc_b', 'sewercroc', MONS.sewercroc.name); pxuLook('sewercroc_c', 'sewercroc', MONS.sewercroc.name);
pxuLook('ratman_b', 'ratman', MONS.ratman.name); pxuLook('ratman_c', 'ratman', MONS.ratman.name);
pxuLook('sewertroll_b', 'sewertroll', MONS.sewertroll.name); pxuLook('sewertroll_c', 'sewertroll', MONS.sewertroll.name);
Object.assign(PXU_SKIN, { sewerrat: ['sewerrat', 'sewerrat_b', 'sewerrat_c'], sludge: ['sludge', 'sludge_b', 'sludge_c'], sewercroc: ['sewercroc', 'sewercroc_b', 'sewercroc_c'], ratman: ['ratman', 'ratman_b', 'ratman_c'], sewertroll: ['sewertroll', 'sewertroll_b', 'sewertroll_c'] });
Object.assign(PXU_SKIN_NAME, { sewerrat: ['잿빛 쥐떼', '검은 쥐떼', '갈색 쥐떼'], sludge: ['녹갈색 오물', '검은 폐수', '독 거품 오물'], sewercroc: ['이끼 악어', '검은 악어', '늙은 백악어'], ratman: ['갈색 쥐인간', '회색 쥐인간', '검은 쥐인간 두목'], sewertroll: ['긴 코 이끼 트롤', '뚱뚱한 폐수 트롤', '외눈 뼈 트롤'] });
// 하수도 생쥐 펫이 다 자란 모습 「쥐 두목」(빌드 52): 평원 들쥐 틀 하나에 잿빛 하수도 털 · 붉은 눈 · 1.5배 (떼가 아니라 한 마리)
PXU.psewerrat = { pal: { Q: '#8a8278', C: '#5e5850', c: '#3e3a34', S: '#c88a84', s: '#946058', K: '#ff3030', w: '#f4ecd0' }, g: `
............QQc...
...........QCSc...
......QQQQQCCCCc..
....QQCCCCCCCKwC..
...QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.
.s..cCCcccCCCcc...
s....SS...SS.S....
`, g2: `
............QQc...
...........QCSc...
......QQQQQCCCCc..
....QQCCCCCCCKwC..
...QCCCCCCCCCCCCSs
..sCCCCCCCCCCCcww.
..s.cCCcccCCCcc...
.ss..SS...SS.S....
`, gp: { bite: { y: 3, g: `
....QQCCCCCCCKwCSs
...QCCCCCCCCCCCww_
..sCCCCCCCCCCK____
.s..cCCcccCCCcww..
` } }, gm: { leap: `
..................
.............QQc..
............QCSc..
...sQQQQQQQCCCCc..
..s.QCCCCCCCCKwCSs
.s..cCCCCCCCCCCcww
s.SScccccccccc....
..............SS..
` }, sh: [15, 4], hip: 6, ax: 9, still: 1, noArm: 1, wpn: 'none' };
pxuLook('psewerrat', 'sewerrat', '쥐 두목', 1.5);
PETS.sewerrat.adult = 'psewerrat';
