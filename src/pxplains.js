/* ───────── 평원 · 버려진 곡물 창고 몬스터 (빌드 44 시안): 들쥐 · 초록 슬라임 · 뿔토끼 · 들늑대 · 고블린 · 들쥐왕 ─────────
   짐승은 팔이 없다(noArm): 동작 장의 body가 다른 몸 그림(gm, 통째로) · 조각 그림(gp, 입을 벌린 머리 같은 것)을 고르고, cr(웅크림) · dx(나감) · jy(뜀)로 움직인다.
   sh = 입 자리(효과가 나오는 곳) · hip = 다리가 시작하는 줄(웅크리면 그 위가 내려앉는다) · still = 숨쉬기 대신 g2(꼬리·귀) */
Object.assign(PXU, {
  rat: {
    pal: { S: '#e8a8a0', s: '#b87870', K: '#1a1010', w: '#f4ecd0' },
    g: `
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
` }, sh: [15, 4], hip: 6, ax: 9, still: 1, noArm: 1, wpn: 'none' },
  slime: {
    pal: { w: '#ffffff', K: '#143a14' },
    g: `
....QQQQ....
..QQwwQCCC..
.QwwQQCCCCC.
.QQCCCCCCCCc
QCCCCCKCCKCc
QCCCCCKCCKCc
CCCCCCCCCCCc
cCCCCCKKKCcc
.ccccccccdd.
`, g2: `
............
...QQwwQ....
.QQwwQCCCC..
QQwQCCCCCCC.
QCCCCCKCCKCc
QCCCCCKCCKCc
CCCCCCCCCCCc
cCCCCCKKKCcc
cccccccccddd
`, gm: { squash: `
............
............
............
...QQwwQQ...
.QQwwQCCCCC.
QQCCCCKCCKCc
QCCCCCKCCKCc
CCCCCCKKKCCc
ccccccccdddd
`, stretch: `
....QQQ.....
...QwwQC....
...QwQCCC...
..QQCCCCC...
..QCCKCCKc..
..QCCKCCKc..
..CCCCCCCc..
..cCCKKKCc..
...cccccd...
` }, sh: [10, 5], hip: 99, ax: 6, still: 1, noArm: 1, wpn: 'none' },
  rabbit: {
    pal: { S: '#f0b0b8', s: '#c88a90', K: '#2a1a1a', w: '#ffffff', G: '#f0d890', g: '#b89a50' },
    g: `
........cc....
.......cSc..G.
.......cSc.Gg.
........cSCG..
.......QCCCCC.
......QCCCKwCs
..QQQQCCCCCCs.
.QwQCCCCCCCC..
.QQCCCCCCCCc..
..cCCCCcCCc...
..ccc.cc.cc...
`, g2: `
..............
.......ccc..G.
.......cSSc.G.
........cSCGg.
.......QCCCCC.
......QCCCKwCs
..QQQQCCCCCCs.
.QwQCCCCCCCC..
.QQCCCCCCCCc..
..cCCCCcCCc...
..ccc.cc.cc...
`, gm: { charge: `
..............
..............
..............
..cc..........
...cSc........
....cSCCCC....
..Q.QCCCCKwC..
.QwQCCCCCCCCGG
.QQCCCCCCCCs..
..cCCCCCCCc...
.ccc..cc.ccc..
` }, sh: [13, 5], hip: 9, ax: 6, still: 1, noArm: 1, wpn: 'none' },
  wolf: {
    pal: { K: '#14100e', w: '#f4f0e4', e: '#f0c040' },
    g: `
..............c.c....
.............cCcCc...
............cCCCCCc..
............CCCeKCCC.
.c..........CCCCCCCCK
cCc......QQQCCCCCcww.
cCCcQQQQQCCCCCCCCc...
.cCCCCCCCCCCCCCCc....
..cCCCCCCCCCCCCc.....
...cCC.cC....cC.cC...
...cC..cC....cC..cC..
..cc..cc....cc..cc...
`, g2: `
..............c.c....
.............cCcCc...
............cCCCCCc..
............CCCeKCCC.
............CCCCCCCCK
.c.......QQQCCCCCcww.
cCcQQQQQQCCCCCCCCc...
cCCCCCCCCCCCCCCCc....
.ccCCCCCCCCCCCCc.....
...cCC.cC....cC.cC...
...cC..cC....cC..cC..
..cc..cc....cc..cc...
`, gp: { bite: { y: 3, g: `
............CCCeKCCCK
............CCCCCCww_
.c.......QQQCCCCK____
cCc.QQQQQCCCCCCCCcww.
` } }, gm: { leap: `
.....................
..............c.c....
.............cCcCc...
............cCCCCCc..
.cc.........CCCeKCCC.
cCCc...QQQQCCCCCCCCK.
.cCCQQQQQCCCCCCCCcww.
..cCCCCCCCCCCCCCCc...
.cCccCCCCCCCCCcCCc...
cC.....cC..cC....cCc.
c.......c...c.....cc.
.....................
` }, sh: [19, 4], hip: 9, ax: 10, still: 1, noArm: 1, wpn: 'none' },
  goblin: {
    pal: { S: '#8ab850', s: '#5e8a34', t: '#3e5a22', e: '#f0e040', K: '#1a1e10', w: '#f0ecd0', W: '#7a5434', V: '#523822', U: '#5a4a3a', G: '#c8a040', M: '#8a8070', x: '#c8c0b0' },
    g: `
.....sSSs.....
....sSSSSS....
sSssSSSSeKS...
.sSSSSSSSSSs..
..ssSSSSSs....
....sSKwKs....
.....sSSs.....
....WWWWWV....
...WWVWWWVV...
...sWWWWWWV...
....VVGVVV....
....UU.UU.....
....SS..SS....
...tSs..tSs...
`, sh: [8, 8], hip: 11, ax: 6, arm: ['S', 's'], hand: 'S', wpn: 'dagger', idle: { h: [2, 2], a: 30 } },
  ratking: {
    pal: { S: '#e8a8a0', s: '#b87870', K: '#1a1010', e: '#ff3a2a', w: '#f4ecd0', G: '#f0c040', g: '#a07a20', X: '#ff4a6a', R: '#a8203a', r: '#601020' },
    g: `
..................G.G.G.....
..................GXGXG.....
................QQGGGGG.....
..............QQCCCCCCCSs...
............QQCCCCCCCCKeCC..
..........QQCCCCCCCCCCCCCCSs
........RRRRRRCCCCCCCCCCKww.
......RRRRRRRRRRCCCCCCCCww..
.....RRRRRRRRRRrGCCCCCCC....
....cRRRRRRRRRrGCCCCCSSC....
...cCrRRRRRRRrGCCCCCCSSSC...
..cCCCrrrrrrrGCCQQQQCCCC....
..cCCCCCCCCCCCCQQQQQQCCC....
..cCCCCCCCCCCCCQQQQQCCCC....
..ccCCCCCCCCCCCCQQQCCCC.....
...cccCCCCcCCCCCcCCCc.......
.s.....cCCSc....cCCSc.......
s.sssss.SSS.....SSS.........
`, gp: { bite: { y: 4, g: `
..........................Ss
.........................ww_
........................KKK_
` } }, gm: { rear: `
....................G.G.G...
....................GXGXG...
..................QQGGGGG...
................QQCCCCCCCs..
...............QCCCCCCCKeCS.
..............QCCCCCCCCCCCK.
............RRRRCCCCCCCwwK..
...........RRRRRRCCCCCSSww..
..........RRRRRRrGCCCCSS....
.........RRRRRRrGCCCCCC.....
........cRRRRRrGCCCQQCC.....
........cCrrrrGCCCQQQCC.....
.......cCCCCCCCCCQQQQCC.....
.......cCCCCCCCCCQQQCCC.....
.......ccCCCCCCCCCCCCCC.....
........cccCCCCCCCCCCc......
.s........cCCSc.cCCSc.......
s.sssss...SSS...SSS.........
` }, sh: [26, 6], hip: 15, ax: 14, ms: 1.5, mx: 18, my: 16, still: 1, noArm: 1, wpn: 'none' }
});
// 짐승 동작 (모험가 동작 표와 같은 꼴: h·a는 효과 자리(입에서) · body 다른 몸/조각 · cr 웅크림 · dx 나감 · jy 뜀(뭉툭 칸, 위 −))
Object.assign(PXU_MOT, {
  qbite: [   // 물기: 웅크렸다가 입을 벌리며 덮친다
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, cr: 1, dx: -0.5 },
    { h: [1, 0], a: 0, cr: 1, dx: -1 },
    { h: [1, 0], a: 0, dx: 2, body: 'bite' },
    { h: [2, 0], a: 0, dx: 4, body: 'bite', fx: { k: 'streak', star: 1 } },
    { h: [1, 0], a: 0, dx: 4 },
    { h: [1, 0], a: 0, dx: 2 },
    { h: [1, 0], a: 0, dx: 1 }
  ],
  qgnaw: [   // 물어뜯기: 두 번 덥석 (맞히는 장 5)
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, cr: 1, dx: -1 },
    { h: [1, 0], a: 0, dx: 3, body: 'bite' },
    { h: [2, 0], a: 0, dx: 4, fx: { k: 'streak' } },
    { h: [1, 0], a: 0, dx: 3, body: 'bite' },
    { h: [2, 0], a: 0, dx: 5, body: 'bite', fx: { k: 'streak', star: 1 } },
    { h: [1, 0], a: 0, dx: 3 },
    { h: [1, 0], a: 0, dx: 1 }
  ],
  qpounce: [   // 덮치기: 웅크렸다가 뛰어올라 내리꽂는다
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, cr: 1 },
    { h: [1, 0], a: 0, cr: 1, dx: -1 },
    { h: [1, 0], a: 0, dx: 2, jy: -4, body: 'leap' },
    { h: [2, 1], a: 30, dx: 5, jy: -2, body: 'leap', fx: { k: 'streak', star: 1 } },
    { h: [1, 0], a: 0, dx: 6, cr: 1, fx: { k: 'dust' } },
    { h: [1, 0], a: 0, dx: 4 },
    { h: [1, 0], a: 0, dx: 2 }
  ],
  qmaul: [   // 들늑대: 덮쳐서 물고 흔든다 (맞히는 장 5)
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, cr: 1, dx: -1 },
    { h: [1, 0], a: 0, dx: 2, jy: -4, body: 'leap' },
    { h: [2, 1], a: 30, dx: 5, jy: -2, body: 'leap' },
    { h: [1, 0], a: 0, dx: 6, body: 'bite', fx: { k: 'streak' } },
    { h: [2, 0], a: 0, dx: 6, cr: 1, body: 'bite', fx: { k: 'streak', star: 1 } },
    { h: [1, 0], a: 0, dx: 4, body: 'bite' },
    { h: [1, 0], a: 0, dx: 2 }
  ],
  qcharge: [   // 뿔 들이받기: 머리를 숙이고 돌진
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, cr: 1, dx: -0.5 },
    { h: [1, 0], a: 0, cr: 1, dx: -1.5, body: 'charge' },
    { h: [2, 1], a: 0, dx: 3, body: 'charge' },
    { h: [3, 1], a: 0, dx: 6, body: 'charge', fx: { k: 'streak' } },
    { h: [2, 1], a: 0, dx: 6, body: 'charge' },
    { h: [1, 0], a: 0, dx: 3 },
    { h: [1, 0], a: 0, dx: 1 }
  ],
  qdive: [   // 뿔토끼: 높이 뛰어 뿔부터 내리꽂는다 (맞히는 장 5)
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, cr: 1 },
    { h: [1, 0], a: 0, cr: 1, dx: -1, fx: { k: 'gather', r: 1 } },
    { h: [1, 0], a: -40, dx: 1, jy: -7, body: 'charge' },
    { h: [2, 1], a: 20, dx: 4, jy: -6, body: 'charge', fx: { k: 'glint', r: 2 } },
    { h: [3, 2], a: 45, dx: 6, jy: -1, body: 'charge', fx: { k: 'streak', star: 1 } },
    { h: [1, 0], a: 0, dx: 5, cr: 1, fx: { k: 'dust', r: 2 } },
    { h: [1, 0], a: 0, dx: 2 }
  ],
  sbounce: [   // 슬라임: 납작 눌렸다가 튀어 올라 덮친다 (맞히는 장 5)
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, body: 'squash' },
    { h: [1, 0], a: 0, dx: -0.5, body: 'squash' },
    { h: [1, 0], a: 0, dx: 2, jy: -3, body: 'stretch' },
    { h: [1, 0], a: 0, dx: 4, jy: -2, body: 'stretch' },
    { h: [2, 2], a: 0, dx: 5, body: 'squash', fx: { k: 'dust' } },
    { h: [1, 0], a: 0, dx: 3 },
    { h: [1, 0], a: 0, dx: 1 }
  ],
  sslam: [   // 슬라임: 높이 튀어 짓누른다 (맞히는 장 5)
    { h: [1, 0], a: 0 },
    { h: [1, 0], a: 0, body: 'squash' },
    { h: [1, 0], a: 0, dx: -1, body: 'squash', fx: { k: 'gather', r: 1 } },
    { h: [1, 0], a: 0, dx: 1, jy: -8, body: 'stretch' },
    { h: [1, 0], a: 0, dx: 4, jy: -7, body: 'stretch' },
    { h: [2, 2], a: 0, dx: 6, body: 'squash', fx: { k: 'dust', r: 2 } },
    { h: [1, 0], a: 0, dx: 5, body: 'squash' },
    { h: [1, 0], a: 0, dx: 2 }
  ],
  rswipe: [   // 들쥐왕: 일어서서 앞발로 할퀸다
    { h: [1, 0], a: 0 },
    { h: [-1, 2], a: -60, body: 'rear' },
    { h: [-2, 2], a: -80, body: 'rear', lean: -1 },
    { h: [0, 3], a: -20, body: 'rear', fx: { k: 'arc', a: 0.8 } },
    { h: [2, 5], a: 40, dx: 2, fx: { k: 'arc', long: 1 } },
    { h: [2, 6], a: 70, dx: 2, cr: 1, fx: { k: 'dust' } },
    { h: [1, 0], a: 0, dx: 1 },
    { h: [1, 0], a: 0 }
  ],
  rscreech: [   // 들쥐왕: 일어서서 찍찍 울어 쥐 떼를 부른다
    { h: [1, 0], a: 0 },
    { h: [0, 0], a: -30, body: 'rear' },
    { h: [0, -1], a: -40, body: 'rear', fx: { k: 'gather', r: 1 } },
    { h: [0, -1], a: -40, body: 'rear', fx: { k: 'gather', r: 2 } },
    { h: [1, 0], a: -20, body: 'rear', fx: { k: 'cast', r: 2 } },
    { h: [1, 0], a: -20, body: 'rear', fx: { k: 'cast' } },
    { h: [1, 0], a: 0, body: 'rear' },
    { h: [1, 0], a: 0 }
  ],
  jstab: [   // 고블린: 뛰어올라 단검을 내리꽂는다
    { h: [2, 2], a: 30 },
    { h: [0, 0], a: -40, cr: 1 },
    { h: [-1, -2], a: -70, cr: 1, dx: -0.5 },
    { h: [2, -3], a: -10, dx: 2, jy: -4 },
    { h: [3, 1], a: 55, dx: 4, jy: -2, fx: { k: 'streak' } },
    { h: [3, 2], a: 70, dx: 5, cr: 1, fx: { k: 'dust' } },
    { h: [2, 2], a: 40, dx: 3 },
    { h: [2, 2], a: 30, dx: 1 }
  ]
});
Object.assign(PXS_MOT_TT, {
  qbite: [0.05, 0.06, 0.07, 0.04, 0.06, 0.06, 0.05, 0.05],
  qgnaw: [0.05, 0.06, 0.04, 0.05, 0.04, 0.06, 0.06, 0.05],
  qpounce: [0.05, 0.06, 0.08, 0.06, 0.05, 0.07, 0.06, 0.05],
  qmaul: [0.05, 0.07, 0.06, 0.05, 0.04, 0.07, 0.08, 0.06],
  qcharge: [0.05, 0.05, 0.08, 0.04, 0.05, 0.06, 0.06, 0.05],
  qdive: [0.05, 0.06, 0.08, 0.07, 0.06, 0.05, 0.08, 0.06],
  sbounce: [0.05, 0.07, 0.07, 0.06, 0.06, 0.07, 0.06, 0.05],
  sslam: [0.05, 0.08, 0.09, 0.08, 0.07, 0.07, 0.08, 0.06],
  rswipe: [0.05, 0.07, 0.08, 0.04, 0.05, 0.07, 0.07, 0.06],
  rscreech: [0.05, 0.07, 0.09, 0.09, 0.07, 0.1, 0.08, 0.06],
  jstab: [0.05, 0.06, 0.07, 0.06, 0.05, 0.07, 0.06, 0.05]
});
Object.assign(PXS_MOT_HITF, { qgnaw: 5, qmaul: 5, qdive: 5, sbounce: 5, sslam: 5 });
Object.assign(PXU_ACT, {
  rat:     { atk: ['qbite', 'qpounce'], skl: ['qgnaw'], fx: { atk: { pal: 'earth', hit: 'bite' }, skl: { pal: 'blood', hit: 'bite', big: 1, after: 'dust' } } },
  slime:   { atk: ['sbounce'], skl: ['sslam'], tk: 1.1, fx: { atk: { pal: 'nature', hit: 'burst' }, skl: { pal: 'nature', hit: 'burst', big: 1, after: 'bubbles', shake: 2 } } },
  rabbit:  { atk: ['qcharge', 'qpounce'], skl: ['qdive'], tk: 0.9, fx: { atk: { pal: 'light', hit: 'star' }, skl: { pal: 'gold', hit: 'pierce', big: 1, after: 'motes' } } },
  wolf:    { atk: ['qbite', 'qpounce'], skl: ['qmaul'], fx: { atk: { pal: 'steel', hit: 'bite' }, skl: { pal: 'blood', hit: 'claw', big: 1, after: 'drain' } } },
  goblin:  { atk: ['down', 'thrust', 'hack'], skl: ['jstab'], fx: { atk: { pal: 'steel', hit: 'star' }, skl: { pal: 'war', hit: 'pierce', big: 1, after: 'dust' } } },
  ratking: { atk: ['qbite', 'rswipe'], skl: ['rscreech'], tk: 1.2, fx: { atk: { pal: 'earth', hit: 'bite', big: 1 }, skl: { pal: 'blood', hit: 'bite', big: 1, after: 'dust', aoe: 'rats', shake: 2 } } }
});
