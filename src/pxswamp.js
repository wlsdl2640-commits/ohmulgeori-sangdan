// 늪지대 몬스터 무기 (빌드 53): 국자 지팡이 · 옹이 지팡이 · 빗자루
// 국자 지팡이 (늪지의 마녀): 긴 나무 자루 끝에 쇠 국자 · 국자 안에 초록 독약
PXU_WPN.ladle = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 6 * k;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  at(-1.5, 0, 'v'); at(-0.8, 0, 'v');
  for (let t = 0.6; t <= L; t += 0.5) at(t, 0, 'v');
  for (const [t, s] of [[L + 0.5, -1], [L + 1, -0.5], [L + 1.2, 0.5], [L + 0.8, 1.2], [L + 0.3, 1]]) at(t, s, 'N');
  at(L + 0.7, 0.2, 'O'); at(L + 0.4, -0.3, 'O');
  return out; };
PXU_FXW.ladle = 'staff';
// 옹이 지팡이 (늪지의 마녀): 비틀린 나무 자루 · 끝의 갈퀴 손이 쥔 빛나는 초록 구슬
PXU_WPN.gstaff = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 6.2 * k;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -2; t <= L; t += 0.5) at(t, Math.sin(t * 1.1) * 0.35, t % 2 < 1 ? 'v' : 'V');
  at(L + 0.4, -1.1, 'V'); at(L + 0.4, 1.1, 'V'); at(L + 1.2, -1.3, 'v'); at(L + 1.2, 1.3, 'v');
  at(L + 1.1, 0, 'O'); at(L + 1.6, -0.5, 'O'); at(L + 1.6, 0.5, 'O'); at(L + 2.1, 0, 'o'); at(L + 1.5, 0, 'x');
  return out; };
PXU_FXW.gstaff = 'staff';
// 빗자루 (늪지의 마녀): 긴 자루 · 끝에 묶은 짚 다발
PXU_WPN.broom = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 5.5 * k;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -2.5; t <= L; t += 0.5) at(t, 0, 'v');
  at(-2.6, 0, 'V'); for (let t = -2.4; t >= -4.6; t -= 0.5) for (const s of [-1.2, -0.4, 0.4, 1.2]) at(t, s * (1 + (-2.4 - t) * 0.35), t > -3 ? 'V' : 'B');
  return out; };
PXU_FXW.broom = 'staff';
/* ───────── 눅눅한 늪지대 · 가라앉은 마녀의 오두막 몬스터 (빌드 53 시안): 프로그 · 늪 거머리 · 켈피 · 세이렌 · 늪지 괴물 · 두꺼비 왕 · 늪지 아나콘다 · 늪지의 마녀 ───────── */
Object.assign(PXU, {
  frogman: {   // 프로그 1 늪 개구리(기본): 앉은 초록 개구리 · 큰 노란 눈 · 엉덩이 혹 · 접은 뒷다리 · 연둣빛 턱 (사용자: 프로그 1·2·3·6)
    pal: { w: '#ffffff', e: '#141010', R: '#c83848', r: '#7a1e28', p: '#f08898', Q: '#9ad870', C: '#55a048', c: '#2c6430', A: '#76b85a', F: '#3e8040', f: '#245028', S: '#dcec9c', s: '#a8bc6c', K: '#f0c838' },
    g: `
............QQQ
...........QKKwQ
.....QQQ...CKeeCc
...QQCCCQQQCCCCCCc
..QCCCCCCCCCCCCCCCs
.QCCCCCCCCCcccccccc
.CCCCCCCCCCSSSSSSs
cCCCAAAACCcSSSSSs
cCCAFFFFAcCcSSSc
cCAFFFFFFfcCCCCc
.cFFFFFFFfc.CCc
..fffffffFFFFFccff
`, g2: `
............QQQ
...........QKKwQ
.....QQQ...CKccCc
...QQCCCQQQCCCCCCc
..QCCCCCCCCCCCCCCCs
.QCCCCCCCCCcccccccc
.CCCCCCCCCCSSSSSSs
cCCCAAAACCcSSSSSs
cCCAFFFFAcCcSSSc
cCAFFFFFFfcCCCCc
.cFFFFFFFfc.CCc
..fffffffFFFFFccff
`, gp: { bite: { y: 0, g: `
............QQQ
...........QKKwQ
.....QQQ...CKeeCcc
...QQCCCQQQCCCCCCCc
..QCCCCCCCCCCCCCwwc
.QCCCCCCCCCCRRRRRRr
.CCCCCCCCCCcrrppRr
cCCCAAAACCcSSSSSs
cCCAFFFFAcCcSSSc
cCAFFFFFFfcCCCCc
.cFFFFFFFfc.CCc
..fffffffFFFFFccff
` } }, gm: { leap: `
.
...................QQQ
..................QKKwQ
.........QQQQQQQQQCKeeCc
.......QQCCCCCCCCCCCCCCCs
.....QQCCCCCCCCCCCcccccccc
..AAFCCCCCCCCCCCSSSSSSSs
AFFFFFFcCCCCCCCSSSSSs
fFf..ffcccCCCCCCcc.CCc
ff........ccccc......CCc
......................cc
` }, sh: [17, 5], hip: 7, ax: 9, still: 1, noArm: 1, wpn: 'none' },
  frogman_b: {   // 프로그 2 황소개구리: 넓적한 머리 · 눈 뒤 고막 · 턱 밑에 크게 부푼 노란 울대
    pal: { w: '#ffffff', e: '#141010', R: '#c83848', r: '#7a1e28', p: '#f08898', Q: '#b4c068', C: '#728438', c: '#3e4a1c', d: '#4a3a1c', A: '#94a450', F: '#56662a', f: '#323c16', S: '#e0dca0', s: '#b0aa70', K: '#e8b030', Y: '#f8f0b8', y: '#c8bc78' },
    g: `
..............QQQ
.............QKKwQ
......QQQQQQQCKeeCc
....QQCCCCCCCdCCCCCc
...QCCCCCCCCdCdCCCCCs
..QCCCCCCCCCCdCcccccccs
.QCCCCCCCCCCCCcYYYYYc
.CCCCAAAAACCCYYYYYYYYc
cCCCAFFFFFACYYYYYYYYy
cCCAFFFFFFFcyYYYYYYy
cCAFFFFFFFFfcyyyyyy
.cFFFFFFFFFfcCCCc
..fffffffffFFFFFFccff
`, g2: `
..............QQQ
.............QKKwQ
......QQQQQQQCKccCc
....QQCCCCCCCdCCCCCc
...QCCCCCCCCdCdCCCCCs
..QCCCCCCCCCCdCcccccccs
.QCCCCCCCCCCCCcYYYYYc
.CCCCAAAAACCCYYYYYYYYc
cCCCAFFFFFACYYYYYYYYy
cCCAFFFFFFFcyYYYYYYy
cCAFFFFFFFFfcyyyyyy
.cFFFFFFFFFfcCCCc
..fffffffffFFFFFFccff
`, gp: { bite: { y: 0, g: `
..............QQQ
.............QKKwQ
......QQQQQQQCKeeCcc
....QQCCCCCCCdCCCCCCc
...QCCCCCCCCdCdCCCwwwc
..QCCCCCCCCCCdCRRRRRRRr
.QCCCCCCCCCCCCcrppRRr
.CCCCAAAAACCCYYYYYYYYc
cCCCAFFFFFACYYYYYYYYy
cCCAFFFFFFFcyYYYYYYy
cCAFFFFFFFFfcyyyyyy
.cFFFFFFFFFfcCCCc
..fffffffffFFFFFFccff
` } }, sh: [20, 5], hip: 7, ax: 10, still: 1, noArm: 1, wpn: 'none' },
  frogman_c: {   // 프로그 3 독화살 개구리: 작고 높게 선 몸 · 긴 앞다리 · 새파란 몸에 검은 무늬 · 큰 검은 눈
    pal: { w: '#ffffff', e: '#0c0c14', R: '#c83848', r: '#7a1e28', p: '#f08898', Q: '#80d0ff', C: '#2878d8', c: '#164488', d: '#0e1420', A: '#58a8f0', F: '#1e5ab0', f: '#123870' },
    g: `
..........QQQ
.........QeeewQ
.........CeeeeC
....QQQQQCCCCCCc
...QCCdCCCCdCCCCs
..QCCCCCCdCCccccc
.QCdCCCCCCCCcc
.CCCCAAAAdCcCC
cCCAFFFFAcc.CC
cCAFFdFFFfc.CC
.cFFFFFFFfc.CC
..ffffffffFFccff
`, g2: `
..........QQQ
.........QcccwQ
.........CccccC
....QQQQQCCCCCCc
...QCCdCCCCdCCCCs
..QCCCCCCdCCccccc
.QCdCCCCCCCCcc
.CCCCAAAAdCcCC
cCCAFFFFAcc.CC
cCAFFdFFFfc.CC
.cFFFFFFFfc.CC
..ffffffffFFccff
`, gp: { bite: { y: 0, g: `
..........QQQ
.........QeeewQ
.........CeeeeCc
....QQQQQCCCCCCwc
...QCCdCCCCdCCRRr
..QCCCCCCdCCcrpRr
.QCdCCCCCCCCcc
.CCCCAAAAdCcCC
cCCAFFFFAcc.CC
cCAFFdFFFfc.CC
.cFFFFFFFfc.CC
..ffffffffFFccff
` } }, sh: [15, 4], hip: 7, ax: 8, still: 1, noArm: 1, wpn: 'none' },
  frogman_d: {   // 프로그 6 이끼 개구리: 등에 이끼 덤불이 덮인 늪 개구리 · 들쭉날쭉한 등
    pal: { w: '#ffffff', e: '#141010', R: '#c83848', r: '#7a1e28', p: '#f08898', Q: '#9ab870', C: '#5a7a3a', c: '#2e4420', d: '#6a4a28', A: '#7a9a50', F: '#44602a', f: '#283a18', S: '#d8dca0', s: '#a8ac70', K: '#f0b030', G: '#6ac040', g: '#3a7a24' },
    g: `
.......G...G..QQQ
.....GGgG.GgGQKKwQ
....GgGGgGGgGCKeeCc
...GGgCCGgCCCCCCCCc
..QCCCCCCCCCCCCCCCCs
.QCCCdCCCCCCccccccc
.CCCCCCCCdCSSSSSSs
cCCCAAAACCcSSSSSs
cCCAFFFFAcCcSSSc
cCAFFFFFFfcCCCCc
.cFFFFFFFfc.CCc
..fffffffFFFFFccff
`, g2: `
.......G...G..QQQ
.....GGgG.GgGQKKwQ
....GgGGgGGgGCKccCc
...GGgCCGgCCCCCCCCc
..QCCCCCCCCCCCCCCCCs
.QCCCdCCCCCCccccccc
.CCCCCCCCdCSSSSSSs
cCCCAAAACCcSSSSSs
cCCAFFFFAcCcSSSc
cCAFFFFFFfcCCCCc
.cFFFFFFFfc.CCc
..fffffffFFFFFccff
`, gp: { bite: { y: 0, g: `
.......G...G..QQQ
.....GGgG.GgGQKKwQ
....GgGGgGGgGCKeeCcc
...GGgCCGgCCCCCCCCCc
..QCCCCCCCCCCCCCCwwc
.QCCCdCCCCCCRRRRRRr
.CCCCCCCCdCcrrppRr
cCCCAAAACCcSSSSSs
cCCAFFFFAcCcSSSc
cCAFFFFFFfcCCCCc
.cFFFFFFFfc.CCc
..fffffffFFFFFccff
` } }, sh: [18, 5], hip: 7, ax: 9, still: 1, noArm: 1, wpn: 'none' },
  leech: {   // 늪 거머리 A(기본): 검붉은 마디 몸 · 붉은 빨판 입 · 고개를 쳐든다
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#1a1210', Q: '#9a5a6a', C: '#6a3a44', c: '#3a1e26', R: '#e04050', r: '#902030' },
    g: `
.................CCc
................CCRRc
...............CCRRRc
..............CCCCRRc
.............CCCCCCc
...........CCCCCCCc
........CCCCCCCCcc
.....CCCCCCCCCccc
..CCCCCCCCCCccc
.cCCCCCCcccc
..cccccc
`, g2: `
................CCRRc
...............CCRRRc
..............CCCCRRc
..............CCCCCc
.............C
...........CCCCCCCc
........CCCCCCCCcc
.....CCCCCCCCCccc
..CCCCCCCCCCccc
.cCCCCCCcccc
..cccccc
`, gp: { bite: { y: 0, g: `
.................CCc....
................CCRRRc..
...............CCRRRRRr.
..............CCCCRRRRr.
.............CCCCCCcrr..
...........CCCCCCCc.....
........CCCCCCCCcc......
.....CCCCCCCCCccc.......
..CCCCCCCCCCccc.........
.cCCCCCCcccc............
..cccccc................
` } }, gm: { leap: `
.
.
.
.....................CCc
.................CCCCRRc
.............CCCCCCCRRRc
.........CCCCCCCCCCCCc
.....CCCCCCCCCCCCCc
..CCCCCCCCCCCCCcc
.cCCCCCCCcccccc
..cccccc
` }, sh: [19, 2], hip: 6, ax: 9, still: 1, noArm: 1, wpn: 'none' },
  leech_b: {   // 늪 거머리 B 검은 몸에 노란 줄무늬
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#1a1210', Q: '#e0c040', C: '#2e2a30', c: '#181418', R: '#f080a0', r: '#a04060' },
    g: `
.................CCc
................CCRRc
...............CCRRRc
..............CCCCRRc
.............CCCQCCc
...........QCCCQCCc
........CCQCCCQCcc
.....QCCCQCCCQccc
..CCQCCCQCCCccc
.cCQCCCQcccc
..cccccc
`, g2: `
................CCRRc
...............CCRRRc
..............CCCCRRc
..............CCQCCc
.............C
...........QCCCQCCc
........CCQCCCQCcc
.....QCCCQCCCQccc
..CCQCCCQCCCccc
.cCQCCCQcccc
..cccccc
`, gp: { bite: { y: 0, g: `
.................CCc....
................CCRRRc..
...............CCRRRRRr.
..............CCCCRRRRr.
.............CCCCCCcrr..
...........CCCCCCCc.....
........CCCCCCCCcc......
.....CCCCCCCCCccc.......
..CCCCCCCCCCccc.........
.cCCCCCCcccc............
..cccccc................
` } }, gm: { leap: `
.
.
.
.....................CCc
.................CCCCRRc
.............CCCCCCCRRRc
.........CCCCCCCCCCCCc
.....CCCCCCCCCCCCCc
..CCCCCCCCCCCCCcc
.cCCCCCCCcccccc
..cccccc
` }, sh: [19, 2], hip: 6, ax: 9, still: 1, noArm: 1, wpn: 'none' },
  leech_c: {   // 늪 거머리 C 창백한 물거머리 · 속이 비치는 피
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#1a1210', Q: '#f0f0f0', C: '#d8d0d0', c: '#a09898', R: '#e04050', r: '#902030' },
    g: `
.................CCc
................CCRRc
...............CCRRRc
..............CCCCRRc
.............CCCCCCc
...........CCCCRCCc
........CCCCRCCCcc
.....CCCCRCCCCccc
..CCCCRCCCCCccc
.cCCCCCCcccc
..cccccc
`, g2: `
................CCRRc
...............CCRRRc
..............CCCCRRc
..............CCCCCc
.............C
...........CCCCRCCc
........CCCCRCCCcc
.....CCCCRCCCCccc
..CCCCRCCCCCccc
.cCCCCCCcccc
..cccccc
`, gp: { bite: { y: 0, g: `
.................CCc....
................CCRRRc..
...............CCRRRRRr.
..............CCCCRRRRr.
.............CCCCCCcrr..
...........CCCCCCCc.....
........CCCCCCCCcc......
.....CCCCCCCCCccc.......
..CCCCCCCCCCccc.........
.cCCCCCCcccc............
..cccccc................
` } }, gm: { leap: `
.
.
.
.....................CCc
.................CCCCRRc
.............CCCCCCCRRRc
.........CCCCCCCCCCCCc
.....CCCCCCCCCCCCCc
..CCCCCCCCCCCCCcc
.cCCCCCCCcccccc
..cccccc
` }, sh: [19, 2], hip: 6, ax: 9, still: 1, noArm: 1, wpn: 'none' },
  kelpie: {   // 켈피(한 모습): 서 있는 흰 말 · 켈프 갈기 가닥이 목 앞으로 · 켈프 꼬리 · 물 때 주둥이가 벌어진다 — 맞으면 잠깐 kelpie_w(물로 풀린 모습)로 (사용자: 「A·C 하나로 합쳐서 맞을 때 C로」)
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#50c8e0', R: '#c03040', r: '#802020', Q: '#ffffff', C: '#f0f2f4', c: '#a8b4c0', K: '#405060', S: '#c8d0d8', s: '#a8b4c0', k: '#505860', V: '#4a9a3a', v: '#2a6a24', B: '#80c8f0' },
    g: `
.......................kk.k
.....................VVCCCC
....................VVCCKeCc
...................VVVCCCCCCs
..................VVvVCCCCcss
.................VVvVVCCCc
................VVvVvCCCc
...............VVvVVCCCc.V
..............VVvVCCCCc..v
.......CCCCCCVVvVCCCCcV..V
.....CCCCCCCCCCCCCCCCcv
....VCCCCCCCCCCCCCCCCc
...VVCCCCCCCCCCCCCCCCc
..VvV.cCCCCCCCCCCCCCc
.VvV..cCCc.....cCCCc
.Vv...CCc......CCc
.v....Cc.......Cc
......cc.......cc
......kk.......kk
`, g2: `
.....................V.kk.k
....................VVVCCCC
...................VVVCCKeCc
..................VVvVCCCCCCs
.................VVvVVCCCCcss
................VVvVvCCCCc
...............VVvVVCCCCc
..............VVvVCCCCCc.V
..............VvVCCCCcc..v
.......CCCCCCV........V..V
.....CCCCCCCCCCCCCCCCcv
....VCCCCCCCCCCCCCCCCc
...VVCCCCCCCCCCCCCCCCc
..VvV.cCCCCCCCCCCCCCc
.VvV..cCCc.....cCCCc
.Vv...CCc......CCc
.v....Cc.......Cc
......cc.......cc
......kk.......kk
`, gp: { bite: { y: 4, g: `
..........................rw_
.........................CSSs
` } }, gm: { leap: `
.
..........................kk.k
........................VVCCCC
.......................VVCCKeCc
......................VVVCCCCCCs
.....................VVvVCCCCcss
....................VVvVVCCCc
...................VVvVvCCCc
..................VVvVVCCCc.V
.................VVvVCCCCc..v
.......CCCCCCCCCCVVvVCCCCcV..V
.....CCCCCCCCCCCCCCCCCCCCcv
....VCCCCCCCCCCCCCCCCCCCc
...VVCCCCCCCCCCCCCCCCCCc
..VvV.cCCCCCCCCCCCCCCCc
.VvV..cCCc....cCCCc
.Vv...Cc......CCc
.v....cc......cc
......kk......kk
` }, sh: [26, 5], hip: 13, ax: 12, still: 1, noArm: 1, wpn: 'none', hitLook: 'kelpie_w', hitT: 0.45 },
  kelpie_w: {   // 켈피가 맞았을 때 잠깐 보이는 모습: 아랫몸이 물결로 풀려 흘러내린다 (PXU.kelpie.hitLook)
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#50c8e0', R: '#c03040', r: '#802020', Q: '#ffffff', C: '#f0f2f4', c: '#a8b4c0', K: '#405060', S: '#c8d0d8', s: '#a8b4c0', k: '#505860', V: '#4a9a3a', v: '#2a6a24', B: '#60b8e8', b: '#2a78b0' },
    g: `
.......................kk.k
.....................VVCCCC
....................VVCCKeCc
...................VVVCCCCCCs
..................VVvVCCCCcss
.................VVvVVCCCc
................VVvVvCCCc
...............VVvVVCCCc.V
..............VVvVCCCCc..v
.......CCCCCCVVvVCCCCcV
.....CCCCCCCCCCCCCCCCc
....BCCCCCCCCCCCCCCCCc
...BBCCCCCCCCCCCCCCCCc
..BbB.cCCCCCCCCCCCCCc..B
.BbB...BCCCBBBCCCCBc..b
.Bb....BBBB.BBBBBBB
.b....B.BB...BB.BB.B
.....BB..B...B...BB
....B....B..B....B...B
`, g2: `
.....................V.kk.k
....................VVVCCCC
...................VVVCCKeCc
..................VVvVCCCCCCs
.................VVvVVCCCCcss
................VVvVvCCCCc
...............VVvVVCCCCc
..............VVvVCCCCCc.V
..............VvVCCCCcc..v
.......CCCCCCV........V
.....CCCCCCCCCCCCCCCCc
....BCCCCCCCCCCCCCCCCc
...BBCCCCCCCCCCCCCCCCc
..BbB.cCCCCCCCCCCCCCc..B
.BbB...BCCCBBBCCCCBc..b
.Bb....BBBB.BBBBBBB
.b....B.BB...BB.BB.B
.....BB..B...B...BB
....B....B..B....B...B
`, gm: { leap: `
.
..........................kk.k
........................VVCCCC
.......................VVCCKeCc
......................VVVCCCCCCs
.....................VVvVCCCCcss
....................VVvVVCCCc
...................VVvVvCCCc
..................VVvVVCCCc.V
.................VVvVCCCCc..v
.......CCCCCCCCCCVVvVCCCCcV
.....CCCCCCCCCCCCCCCCCCCCc
....BCCCCCCCCCCCCCCCCCCCc
...BBCCCCCCCCCCCCCCCCCCc
..BbB.cCCCCCCCCCCCCCCCc..B
.BbB...BCCCBBBCCCCBB...b
.Bb....BBBB.BBBBBBB
.b....B.BB...BB.BB.B
.....BB..B...B...BB
` }, sh: [26, 5], hip: 13, ax: 12, still: 1, noArm: 1, wpn: 'none' },
  siren: {   // 세이렌 A 청록(기본): 청록 긴 머리 · 조개 가슴 · 푸른 비늘 꼬리 · 떠 있다
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#c04060', e: '#1a1210', H: '#5ac8c0', h: '#2a8a88', S: '#f1d6c0', s: '#c8a890', F: '#e0a0a8', f: '#a86878', G: '#3a8aa8', g: '#1e5a78', Q: '#88d0e0' },
    g: `
......HHHHH
.....HHHHHHH
....HHSSSSHH
....HHSeSeSH
....HHSSSSSH
.....HSSwSH
......SSSSHH
.....FSSSSFHH
....FFSSSSFFHH
....FFFSSFFFH
.....FFFFFFF
......ffffff
.....QQQQGGG
....QQQGGGGgg
...GGGGGGggggg
..Gggggggggggg
.gg....gggggg
.
.
`, g2: `
......HHHHH
.....HHHHHHH
....HHSSSSHH
....HHSeSeSH
....HHSSSSSH
.....HSSwSHH
......SSSSHHH
.....FSSSSFFHH
....FFSSSSFFH
....FFFSSFFF
.....FFFFFF
......ffffff
.....QQQQGGG
....QQQGGGGgg
...GGGGGGggggg
..Gggggggggggg
.gg....gggggg
.
.
`, sh: [11, 7], hip: 12, ax: 8, float: 1, arm: ['S', 's'], hand: 'S', wpn: 'none', idle: { h: [2, 1], a: -30 } },
  siren_b: {   // 세이렌 B 검은 머리 늪 세이렌 · 녹빛 살결
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#803040', e: '#1a1210', H: '#1e1a24', h: '#0e0c12', S: '#c8d8b0', s: '#98a888', F: '#5a7a5a', f: '#3a5a3a', G: '#2e5a3a', g: '#1a3a24', Q: '#88d0e0' },
    g: `
......HHHHH
.....HHHHHHH
....HHSSSSHH
....HHSeSeSH
....HHSSSSSH
.....HSSwSH
......SSSSHH
.....FSSSSFHH
....FFSSSSFFHH
....FFFSSFFFH
.....FFFFFFF
......ffffff
.....QQQQGGG
....QQQGGGGgg
...GGGGGGggggg
..Gggggggggggg
.gg....gggggg
.
.
`, g2: `
......HHHHH
.....HHHHHHH
....HHSSSSHH
....HHSeSeSH
....HHSSSSSH
.....HSSwSHH
......SSSSHHH
.....FSSSSFFHH
....FFSSSSFFH
....FFFSSFFF
.....FFFFFF
......ffffff
.....QQQQGGG
....QQQGGGGgg
...GGGGGGggggg
..Gggggggggggg
.gg....gggggg
.
.
`, sh: [11, 7], hip: 12, ax: 8, float: 1, arm: ['S', 's'], hand: 'S', wpn: 'none', idle: { h: [2, 1], a: -30 } },
  siren_c: {   // 세이렌 C 붉은 머리 · 금빛 비늘 꼬리
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#c04060', e: '#1a1210', H: '#d04040', h: '#8a2020', S: '#f8e0d0', s: '#d0b0a0', F: '#f0e0c0', f: '#c0a080', G: '#d8a838', g: '#9a7020', Q: '#88d0e0' },
    g: `
......HHHHH
.....HHHHHHH
....HHSSSSHH
....HHSeSeSH
....HHSSSSSH
.....HSSwSH
......SSSSHH
.....FSSSSFHH
....FFSSSSFFHH
....FFFSSFFFH
.....FFFFFFF
......ffffff
.....QQQQGGG
....QQQGGGGgg
...GGGGGGggggg
..Gggggggggggg
.gg....gggggg
.
.
`, g2: `
......HHHHH
.....HHHHHHH
....HHSSSSHH
....HHSeSeSH
....HHSSSSSH
.....HSSwSHH
......SSSSHHH
.....FSSSSFFHH
....FFSSSSFFH
....FFFSSFFF
.....FFFFFF
......ffffff
.....QQQQGGG
....QQQGGGGgg
...GGGGGGggggg
..Gggggggggggg
.gg....gggggg
.
.
`, sh: [11, 7], hip: 12, ax: 8, float: 1, arm: ['S', 's'], hand: 'S', wpn: 'none', idle: { h: [2, 1], a: -30 } },
  swampthing: {   // 늪지 괴물 A 이끼 괴물(기본, ms 1.25): 이끼·물풀 덩치 · 붉은 눈 · 물풀 팔
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#ff5040', V: '#4a8a3a', C: '#4a6a3a', c: '#2a4a24', Q: '#6a8a4a', d: '#182a14', K: '#0a140a' },
    g: `
......VVVV.VVV
....VVCCCCCCCCVV
...VCCCCCCCCCCCCV
..VCCCdddddddddCCV
..CCCddeddddeddCCC
..cCCddddddddddCCC
...CQdddKKKKKdddCC
...QQQdddddddddCcc
..QQQQQQQQQCCCCccc
.QQQQQQQQQCCCCCcccc
.QQQQQQQCCCCCCcccccC
.cCQQCCCCCCCCccccccc
.cCCCCVCCCCcccVccccc
..CCCCVVCccccVVcccC
..cccccccccccccccCc
...cccccccccccccCc
....dCcccd..dcCCCd
....dCCCd....dCCCd
...ddddd.....ddddd
`, g2: `
....VVCCCCCCCCVV
.
...VCCCCCCCCCCCCV
..VCCCdddddddddCCV
..CCCddeddddeddCCC
..cCCddddddddddCCC
...CQdddKKKKKdddCC
...QQQdddddddddCcc
..QQQQQQQQQCCCCccc
.QQQQQQQQQCCCCCcccc
.QQQQQQQCCCCCCcccccC
.cCQQCCCCCCCCccccccc
.cCCCCVCCCCcccVccccc
..CCCCVVCccccVVcccC
..cccccccccccccccCc
...cccccccccccccCc
....dCcccd..dcCCCd
....dCCCd....dCCCd
...ddddd.....ddddd
`, sh: [16, 9], hip: 16, ax: 10, ms: 1.25, arm: ['C', 'c'], hand: 'V', wpn: 'wrap', wmap: { Z: 'V', z: 'C' }, idle: { h: [3, 5], a: 80 } },
  swampthing_b: {   // 늪지 괴물 B 진흙 괴물 · 노란 눈 · 나무뿌리
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#f0d040', V: '#6a4a2a', C: '#3a3028', c: '#221c16', Q: '#5a4a3a', d: '#100c06', K: '#060402' },
    g: `
......VVVV.VVV
....VVCCCCCCCCVV
...VCCCCCCCCCCCCV
..VCCCdddddddddCCV
..CCCddeddddeddCCC
..cCCddddddddddCCC
...CQdddKKKKKdddCC
...QQQdddddddddCcc
..QQQQQQQQQCCCCccc
.QQQQQQQQQCCCCCcccc
.QQQQQQQCCCCCCcccccC
.cCQQCCCCCCCCccccccc
.cCCCCVCCCCcccVccccc
..CCCCVVCccccVVcccC
..cccccccccccccccCc
...cccccccccccccCc
....dCcccd..dcCCCd
....dCCCd....dCCCd
...ddddd.....ddddd
`, g2: `
....VVCCCCCCCCVV
.
...VCCCCCCCCCCCCV
..VCCCdddddddddCCV
..CCCddeddddeddCCC
..cCCddddddddddCCC
...CQdddKKKKKdddCC
...QQQdddddddddCcc
..QQQQQQQQQCCCCccc
.QQQQQQQQQCCCCCcccc
.QQQQQQQCCCCCCcccccC
.cCQQCCCCCCCCccccccc
.cCCCCVCCCCcccVccccc
..CCCCVVCccccVVcccC
..cccccccccccccccCc
...cccccccccccccCc
....dCcccd..dcCCCd
....dCCCd....dCCCd
...ddddd.....ddddd
`, sh: [16, 9], hip: 16, ax: 10, ms: 1.25, arm: ['C', 'c'], hand: 'V', wpn: 'wrap', wmap: { Z: 'V', z: 'C' }, idle: { h: [3, 5], a: 80 } },
  swampthing_c: {   // 늪지 괴물 C 버섯 괴물 · 썩은 통나무 몸 · 붉은 갓
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', e: '#80f060', V: '#c83a3a', C: '#6a5a3a', c: '#443a24', Q: '#8a7a4a', d: '#241c0e', K: '#100c04' },
    g: `
......VVVV.VVV
....VVCCCCCCCCVV
...VCCCCCCCCCCCCV
..VCCCdddddddddCCV
..CCCddeddddeddCCC
..cCCddddddddddCCC
...CQdddKKKKKdddCC
...QQQdddddddddCcc
..QQQQQQQQQCCCCccc
.QQQQQQQQQCCCCCcccc
.QQQQQQQCCCCCCcccccC
.cCQQCCCCCCCCccccccc
.cCCCCVCCCCcccVccccc
..CCCCVVCccccVVcccC
..cccccccccccccccCc
...cccccccccccccCc
....dCcccd..dcCCCd
....dCCCd....dCCCd
...ddddd.....ddddd
`, g2: `
....VVCCCCCCCCVV
.
...VCCCCCCCCCCCCV
..VCCCdddddddddCCV
..CCCddeddddeddCCC
..cCCddddddddddCCC
...CQdddKKKKKdddCC
...QQQdddddddddCcc
..QQQQQQQQQCCCCccc
.QQQQQQQQQCCCCCcccc
.QQQQQQQCCCCCCcccccC
.cCQQCCCCCCCCccccccc
.cCCCCVCCCCcccVccccc
..CCCCVVCccccVVcccC
..cccccccccccccccCc
...cccccccccccccCc
....dCcccd..dcCCCd
....dCCCd....dCCCd
...ddddd.....ddddd
`, sh: [16, 9], hip: 16, ax: 10, ms: 1.25, arm: ['C', 'c'], hand: 'V', wpn: 'wrap', wmap: { Z: 'V', z: 'C' }, idle: { h: [3, 5], a: 80 } },
  toadking: {   // 두꺼비 왕 1 황소개구리 왕(기본, ms 1.25): 넓적한 머리 위 금관 · 큰 고막 · 턱 밑 큰 울대 (사용자: 두꺼비 왕 1·4·5)
    pal: { w: '#ffffff', e: '#141010', R: '#c83848', r: '#7a1e28', p: '#f08898', G: '#f4c840', g: '#a87c20', X: '#e03850', Q: '#b4c068', C: '#728438', c: '#3e4a1c', d: '#4a3a1c', A: '#94a450', F: '#56662a', f: '#323c16', K: '#e8b030', Y: '#f8f0b8', y: '#c8bc78' },
    g: `
...........G..G..G
...........GGXGGXGG....QQQQ
...........GGGGGGGG...QKKKwQ
..........QggggggggQQQCKKeeCc
.......QQQCCCCCCCCCCCCCCCCCCCc
.....QQCCCCCCCCCCCCCCdCCCCCCCCc
....QCCCCCCCCCCCCCCCdCdCCCCCCCCs
...QCCCCCCCCCCCCCCCCCdCcccccccccc
..QCCCCCCCCCCCCCCCCCCCcYYYYYYYYc
..CCCCCCAAAAAAACCCCCCYYYYYYYYYYYc
.cCCCCCAFFFFFFFACCCCYYYYYYYYYYYYc
cCCCCCAFFFFFFFFFACCYYYYYYYYYYYYy
cCCCCAFFFFFFFFFFFcYYYYYYYYYYYYy
cCCCAFFFFFFFFFFFFcyYYYYYYYYYYy
cCCAFFFFFFFFFFFFFfcyyyyyyyyyy
.cFFFFFFFFFFFFFFFfcCCCCCc
..fffffffffffffffFFFFFFFFFcccfff
`, g2: `
...........G..G..G
...........GGXGGXGG....QQQQ
...........GGGGGGGG...QKKKwQ
..........QggggggggQQQCKKccCc
.......QQQCCCCCCCCCCCCCCCCCCCc
.....QQCCCCCCCCCCCCCCdCCCCCCCCc
....QCCCCCCCCCCCCCCCdCdCCCCCCCCs
...QCCCCCCCCCCCCCCCCCdCcccccccccc
..QCCCCCCCCCCCCCCCCCCCcYYYYYYYYc
..CCCCCCAAAAAAACCCCCCYYYYYYYYYYYc
.cCCCCCAFFFFFFFACCCCYYYYYYYYYYYYc
cCCCCCAFFFFFFFFFACCYYYYYYYYYYYYy
cCCCCAFFFFFFFFFFFcYYYYYYYYYYYYy
cCCCAFFFFFFFFFFFFcyYYYYYYYYYYy
cCCAFFFFFFFFFFFFFfcyyyyyyyyyy
.cFFFFFFFFFFFFFFFfcCCCCCc
..fffffffffffffffFFFFFFFFFcccfff
`, gp: { bite: { y: 0, g: `
...........G..G..G
...........GGXGGXGG....QQQQ
...........GGGGGGGG...QKKKwQ
..........QggggggggQQQCKKeeCcc
.......QQQCCCCCCCCCCCCCCCCCCCCc
.....QQCCCCCCCCCCCCCCdCCCCwwwwc
....QCCCCCCCCCCCCCCCdCdCRRRRRRRr
...QCCCCCCCCCCCCCCCCCdCRRrppRRr
..QCCCCCCCCCCCCCCCCCCCcYYYYYYYYc
..CCCCCCAAAAAAACCCCCCYYYYYYYYYYYc
.cCCCCCAFFFFFFFACCCCYYYYYYYYYYYYc
cCCCCCAFFFFFFFFFACCYYYYYYYYYYYYy
cCCCCAFFFFFFFFFFFcYYYYYYYYYYYYy
cCCCAFFFFFFFFFFFFcyYYYYYYYYYYy
cCCAFFFFFFFFFFFFFfcyyyyyyyyyy
.cFFFFFFFFFFFFFFFfcCCCCCc
..fffffffffffffffFFFFFFFFFcccfff
` } }, sh: [28, 6], hip: 9, ax: 15, ms: 1.25, still: 1, noArm: 1, wpn: 'none' },
  toadking_b: {   // 두꺼비 왕 4 정원을 진 두꺼비 왕: 등에 붉은 버섯 · 갈대 · 연꽃 · 처진 눈꺼풀
    pal: { w: '#ffffff', e: '#141010', R: '#d84040', r: '#7a1e28', p: '#f08898', G: '#f4c840', g: '#a87c20', X: '#e03850', Q: '#9ab870', C: '#5a7a3a', c: '#2e4420', A: '#7a9a50', F: '#44602a', f: '#283a18', S: '#d8dca0', s: '#a8ac70', K: '#d8c060', h: '#3a5226', U: '#f4e4c0', u: '#c8b890', I: '#b0c860', J: '#7a9a38', V: '#4a8a3a', B: '#f0a0c8' },
    g: `
.........u...u
........uUu.uUu..I.I
.......RRRRuUuRRRIII
......RwRRRRRwRRRIII...QQQQ
......RRRRRRRRRRRRIIJ.QhhhhQ
.......VVBBVVVVBBVVJJQCKKeeCc
....QQVVVVVVVVVVVVVVCCCCCCCCc
...QCCCCCCCCCCCCCCCCCCCCCCCCCc
..QCCCCCCCCCCCCCCCCCCCCccccccccs
..CCCCCCCCCCCCCCCCCCCCSSSSSSSSs
.cCCCCCAAAAAACCCCCCCSSSSSSSSSs
cCCCCCAFFFFFFAACCCcSSSSSSSSs
cCCCCAFFFFFFFFFAcCCcSSSSSSc
cCCAAFFFFFFFFFFFfcCCCCCCCc
.cFFFFFFFFFFFFFFfc.CCCCCc
..ffffffffffffffFFFFFFFFccfff
`, g2: `
.........u...u
........uUu.uUu..I.I
.......RRRRuUuRRRIII
......RwRRRRRwRRRIII...QQQQ
......RRRRRRRRRRRRIIJ.QhhhhQ
.......VVBBVVVVBBVVJJQCKKccCc
....QQVVVVVVVVVVVVVVCCCCCCCCc
...QCCCCCCCCCCCCCCCCCCCCCCCCCc
..QCCCCCCCCCCCCCCCCCCCCccccccccs
..CCCCCCCCCCCCCCCCCCCCSSSSSSSSs
.cCCCCCAAAAAACCCCCCCSSSSSSSSSs
cCCCCCAFFFFFFAACCCcSSSSSSSSs
cCCCCAFFFFFFFFFAcCCcSSSSSSc
cCCAAFFFFFFFFFFFfcCCCCCCCc
.cFFFFFFFFFFFFFFfc.CCCCCc
..ffffffffffffffFFFFFFFFccfff
`, gp: { bite: { y: 0, g: `
.........u...u
........uUu.uUu..I.I
.......RRRRuUuRRRIII
......RwRRRRRwRRRIII...QQQQ
......RRRRRRRRRRRRIIJ.QhhhhQ
.......VVBBVVVVBBVVJJQCKKeeCcc
....QQVVVVVVVVVVVVVVCCCCCCCCCc
...QCCCCCCCCCCCCCCCCCCCCCCwwwwc
..QCCCCCCCCCCCCCCCCCCCCRRRRRRRr
..CCCCCCCCCCCCCCCCCCCCcrrppRRr
.cCCCCCAAAAAACCCCCCCSSSSSSSSSs
cCCCCCAFFFFFFAACCCcSSSSSSSSs
cCCCCAFFFFFFFFFAcCCcSSSSSSc
cCCAAFFFFFFFFFFFfcCCCCCCCc
.cFFFFFFFFFFFFFFfc.CCCCCc
..ffffffffffffffFFFFFFFFccfff
` } }, sh: [28, 8], hip: 9, ax: 15, ms: 1.25, still: 1, noArm: 1, wpn: 'none' },
  toadking_c: {   // 두꺼비 왕 5 독샘 두꺼비 왕: 검은 가죽에 보랏빛으로 빛나는 독샘 · 뼈 왕관
    pal: { w: '#ffffff', e: '#141010', R: '#c83848', r: '#7a1e28', p: '#f08898', G: '#f4c840', g: '#a87c20', X: '#e03850', Q: '#6a6a72', C: '#3a3a42', c: '#1e1e24', A: '#55555e', F: '#2e2e36', f: '#18181e', S: '#a8a0b0', s: '#78708a', K: '#c0f040', U: '#e8e0c8', u: '#a8a090', O: '#c060ff', o: '#7a30b0' },
    g: `
...........U..U..U
...........UUUUUUUU....QQQQ
..........QuuuuuuuuQ..QKKKwQ
.......QQQCCOCCCCOCCQQCKKeeCc
.....QQCCCOoOCCCCoOCCCCCCCCCCc
....QCCOCCCOCCCOCCCCOCCCCCCCCCc
...QCCOoOCCCCCOoOCCOoOCcccccccc
..QCCCCOCCCCCCCOCCCCOCCSSSSSSSs
..CCCCCCCAAAAAACCCCCCSSSSSSSSs
.cCCCCCAFFFFFFFACCCcSSSSSSSSs
cCCCCCAFFFFFFFFFAccSSSSSSSSc
cCCCCAFFFFFFFFFFFfcCSSSSSc
cCCCAFFFFFFFFFFFFfcCCCCCc
.cFFFFFFFFFFFFFFFfcoCCCc
..fffffffffffffffFFFFFFFFcccff
`, g2: `
...........U..U..U
...........UUUUUUUU....QQQQ
..........QuuuuuuuuQ..QKKKwQ
.......QQQCCOCCCCOCCQQCKKccCc
.....QQCCCOoOCCCCoOCCCCCCCCCCc
....QCCOCCCOCCCOCCCCOCCCCCCCCCc
...QCCOoOCCCCCOoOCCOoOCcccccccc
..QCCCCOCCCCCCCOCCCCOCCSSSSSSSs
..CCCCCCCAAAAAACCCCCCSSSSSSSSs
.cCCCCCAFFFFFFFACCCcSSSSSSSSs
cCCCCCAFFFFFFFFFAccSSSSSSSSc
cCCCCAFFFFFFFFFFFfcCSSSSSc
cCCCAFFFFFFFFFFFFfcCCCCCc
.cFFFFFFFFFFFFFFFfcoCCCc
..fffffffffffffffFFFFFFFFcccff
`, gp: { bite: { y: 0, g: `
...........U..U..U
...........UUUUUUUU....QQQQ
..........QuuuuuuuuQ..QKKKwQ
.......QQQCCOCCCCOCCQQCKKeeCcc
.....QQCCCOoOCCCCoOCCCCCCCCCCCc
....QCCOCCCOCCCOCCCCOCCCCCwwwwc
...QCCOoOCCCCCOoOCCOoOCRRRRRRRr
..QCCCCOCCCCCCCOCCCCOCcrrppRRr
..CCCCCCCAAAAAACCCCCCSSSSSSSSs
.cCCCCCAFFFFFFFACCCcSSSSSSSSs
cCCCCCAFFFFFFFFFAccSSSSSSSSc
cCCCCAFFFFFFFFFFFfcCSSSSSc
cCCCAFFFFFFFFFFFFfcCCCCCc
.cFFFFFFFFFFFFFFFfcoCCCc
..fffffffffffffffFFFFFFFFcccff
` } }, sh: [28, 6], hip: 9, ax: 15, ms: 1.25, still: 1, noArm: 1, wpn: 'none' },
  anaconda: {   // 늪지 아나콘다(새 몬스터 · 히드라 자리, ms 1.5): 썩은 그루터기를 얇은 띠 두 겹으로 감고 긴 목을 세워 머리를 내민 큰 뱀 · 꼬리는 아래 겹 앞쪽에서 땅을 따라 — 사용자: 「4번인데 너무 커, 높이를 낮춰서」 → 「겹은 2겹으로 하고, 얇게」 → 「목을 위로 길게 하고 꼬리 붙여서 앞쪽으로」
    pal: { w: '#ffffff', e: '#141010', R: '#c83848', r: '#7a1e28', p: '#f08898', Y: '#e03850', Q: '#a0c070', C: '#5e8a3c', c: '#2e4a1a', d: '#24381a', A: '#6e8e48', F: '#46682a', f: '#2a3e18', S: '#e8e098', s: '#b0a868', K: '#f0c838', n: '#1e2e10', V: '#6a4a28', v: '#3e2a16' },
    g: `
......................QQQQQc
.....................QCCKeCCcn
....................QCCCCCCCCCs
....................CCCcccccccc
...................QCSSSSSSSs
...................QCS
..................QCS
..................QCS
..........VVVVVVV.QCS
.........VvvvvvvV.QCS
.........QQQQQQQQQQCS
........QCCdCCCdCCCCS
........cSSSSSSSSSSSc
.........VvvvvvvvvV
......QQQQQQQQQQQQQQQQ
.....QCCdCCCdCCCdCCCdCQ
.....cSSSSSSSSSSSSSSSSCQQQQQ
....vVvvvvvvvvvvvvvvvVCCCCCCCCc
`, g2: `
......................QQQQQc
.....................QCCKeCCcn
....................QCCCCCCCCCs..Y
....................CCCccccccccYY
...................QCSSSSSSSs....Y
...................QCS
..................QCS
..................QCS
..........VVVVVVV.QCS
.........VvvvvvvV.QCS
.........QQQQQQQQQQCS
........QCCdCCCdCCCCS
........cSSSSSSSSSSSc
.........VvvvvvvvvV
......QQQQQQQQQQQQQQQQ
.....QCCdCCCdCCCdCCCdCQ
.....cSSSSSSSSSSSSSSSSCQQQQQ
....vVvvvvvvvvvvvvvvvVCCCCCCCCc
`, gp: { bite: { y: 0, g: `
......................QQQQQcc
.....................QCCKeCCCwc
....................QCCCCCCRRRr
....................CCCcRRrppr
...................QCSSSSwwSs
...................QCS
..................QCS
..................QCS
..........VVVVVVV.QCS
.........VvvvvvvV.QCS
.........QQQQQQQQQQCS
........QCCdCCCdCCCCS
........cSSSSSSSSSSSc
.........VvvvvvvvvV
......QQQQQQQQQQQQQQQQ
.....QCCdCCCdCCCdCCCdCQ
.....cSSSSSSSSSSSSSSSSCQQQQQ
....vVvvvvvvvvvvvvvvvVCCCCCCCCc
.
` } }, sh: [28, 2], hip: 6, ax: 14, ms: 1.5, still: 1, noArm: 1, wpn: 'none', show2: ['qbite', 4] },
  swampwitch: {   // 늪지의 마녀 — 마녀 2 꼬부랑 노파: 등이 굽어 머리가 앞으로 · 등 혹을 덮은 숄 · 긴 매부리코 · 국자 지팡이에 기댄다
    pal: { w: '#ffffff', K: '#1a1014', m: '#3a1a10', G: '#e8c040', g: '#8a6a20', v: '#6a4422', V: '#8a6030', O: '#8af060', o: '#3a9a28', x: '#f0ffe0', B: '#c8a050', h: '#2a2418', J: '#e0e0d8', S: '#b8c898', s: '#88986a', C: '#4a3a30', c: '#2a2018', P: '#6a4a7a', p: '#40284c', k: '#140e0a' },
    g: `
..........hh
.........hhhh
........hhhhh
........hhhhhh
.........hhhhhh
........hhhhhhhh
........hhgGghhhh
.....hhhhhhhhhhhhhhhh
......hhhhhhhhhhhhhhh
...PPP.....JSSSSSSs
..PPPPPP..JJSSKSSKSs
.PPPPPPPPJJJSSSSSSSSSs
.PPPPPPPPPJJsSSSSSSsSS
PPPPPPPPPPPJJsSmmSSs.s
PPPPPPPPPPPPPPsSSSs
pPPPPPPPPPPPPPPPP
.pPPPPPPPPPPPPPPPp
..CCCCCCCCCCCCCCCc
..CCCCCCCCCCCCCCCc
.cCCCCCCCCCCCCCCCCc
.cCCCCCCCCCCCCCCCCc
ccCCCCCCCCCCCCCCCCcc
cCcCcCCcCCcCCcCCcCcc
.....kkkk....kkkk
`, g2: `
.........hhhh
........hhhhh
........hhhhhh
.........hhhhhh
........hhhhhhhh
........hhgGghhhh
.....hhhhhhhhhhhhhhhh
......hhhhhhhhhhhhhhh
.
...PPP.....JSSSSSSs
..PPPPPP..JJSSKSSKSs
.PPPPPPPPJJJSSSSSSSSSs
.PPPPPPPPPJJsSSSSSSsSS
PPPPPPPPPPPJJsSmmSSs.s
PPPPPPPPPPPPPPsSSSs
pPPPPPPPPPPPPPPPP
.pPPPPPPPPPPPPPPPp
..CCCCCCCCCCCCCCCc
..CCCCCCCCCCCCCCCc
.cCCCCCCCCCCCCCCCCc
.cCCCCCCCCCCCCCCCCc
ccCCCCCCCCCCCCCCCCcc
cCcCcCCcCCcCCcCCcCcc
.....kkkk....kkkk
`, sh: [16, 16], hip: 18, ax: 10, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'ladle', idle: { h: [3, 4], a: -75 } },
  swampwitch_b: {   // 늪지의 마녀 — 마녀 4 까마귀 마녀: 모자 챙에 앉은 까마귀 · 검은 깃털 숄 · 창백한 얼굴과 붉은 눈 · 검은 로브
    pal: { w: '#ffffff', K: '#f0c040', m: '#5a1a24', G: '#e8c040', g: '#8a6a20', v: '#6a4422', V: '#8a6030', O: '#28283a', o: '#141420', x: '#f0ffe0', B: '#c8a050', h: '#141418', J: '#5a5a66', S: '#dcdcd0', s: '#a8a8a0', X: '#ff3030', C: '#24242c', c: '#121216', A: '#30303a', a: '#18181e', k: '#0c0c10', N: '#c8ccd4', M: '#8a8e98' },
    g: `
..hh........OOO
.hhhh......OOKOw
.hhhhh.....OOOOOw
..hhhhh.....OOOO
...hhhhh....OoO
....hhhhh..oo.o
....hhhhhh
....hhhhhhh
...hhhhhhhhh
...hhNMNhhhhh
hhhhhhhhhhhhhhhhhh
.hhhhhhhhhhhhhhhhh
..JJJJSSSSSSSs
..JJJSSSXSSSXSs
.JJJJSSSSSSSSSSSs
.JJJJsSSSSSSSSsSSs
.JJJJJsSSmmmSSs.sS
.AAAAAAsSSSSSs
AAaAAaAAsSSSAAA
.AaAAAaAAAAAAAAaA
AAAaAAAAaAAAAAaAAA
.AaCCCCCCCCCCCCAa
...CCCCCCCCCCCCCc
...CCCCCCCCCCCCCc
..cCCCCCCCCCCCCCCc
..cCCCCCCCCCCCCCCc
.ccCCCCCCCCCCCCCCcc
.cCcCCcCCCCcCCCcCCc
..c.cc.cCc.cc.c.cc
.....kkkk...kkkk
`, g2: `
..hh.......OOKOw
.hhhh......OOOOOw
.hhhhh......OOOO
..hhhhh.....OoO
...hhhhh...oo.o
....hhhhh
....hhhhhh
....hhhhhhh
...hhhhhhhhh
...hhNMNhhhhh
hhhhhhhhhhhhhhhhhh
.hhhhhhhhhhhhhhhhh
..JJJJSSSSSSSs
..JJJSSSXSSSXSs
.JJJJSSSSSSSSSSSs
.JJJJsSSSSSSSSsSSs
.JJJJJsSSmmmSSs.sS
.AAAAAAsSSSSSs
AAaAAaAAsSSSAAA
.AaAAAaAAAAAAAAaA
AAAaAAAAaAAAAAaAAA
.AaCCCCCCCCCCCCAa
...CCCCCCCCCCCCCc
...CCCCCCCCCCCCCc
..cCCCCCCCCCCCCCCc
..cCCCCCCCCCCCCCCc
.ccCCCCCCCCCCCCCCcc
.cCcCCcCCCCcCCCcCCc
..c.cc.cCc.cc.c.cc
.....kkkk...kkkk
`, sh: [15, 21], hip: 24, ax: 10, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'gstaff', idle: { h: [3, 4], a: -75 } }
});
Object.assign(PXU_ACT, {
  frogman: { atk: ['qbite', 'qpounce'], skl: ['qdive'], tk: 1.0, fx: { atk: { pal: 'water', hit: 'star' }, skl: { pal: 'poison', hit: 'poison', big: 1, after: 'bubbles' } } },
  leech: { atk: ['qbite'], skl: ['qgnaw'], tk: 1.0, fx: { atk: { pal: 'blood', hit: 'bite' }, skl: { pal: 'blood', hit: 'bite', big: 1, after: 'drain' } } },
  kelpie: { atk: ['qbite', 'qcharge'], skl: ['qdive'], tk: 1.1, fx: { atk: { pal: 'water', hit: 'star' }, skl: { pal: 'ice', hit: 'shatter', big: 1, after: 'bubbles' } } },
  siren: { mag: ['spush', 'sjab'], atk: ['spush'], skl: ['scharge'], tk: 1.0, fx: { mag: { pal: 'music', hit: 'notes', p: 'note' }, atk: { pal: 'music', hit: 'notes', p: 'note' }, skl: { pal: 'music', hit: 'notes', p: 'note', big: 1, after: 'bubbles' } } },
  swampthing: { atk: ['side', 'down'], skl: ['smash'], tk: 1.2, fx: { atk: { pal: 'nature', hit: 'star', big: 1 }, skl: { pal: 'poison', hit: 'poison', big: 1, after: 'bubbles' } } },
  toadking: { atk: ['qbite', 'qpounce'], skl: ['qdive'], tk: 1.2, fx: { atk: { pal: 'earth', hit: 'star', big: 1 }, skl: { pal: 'poison', hit: 'poison', big: 2, after: 'bubbles', shake: 2 } } },
  anaconda: { atk: ['qbite', 'qcharge'], skl: ['qmaul'], tk: 1.3, fx: { atk: { pal: 'poison', hit: 'bite', big: 1 }, skl: { pal: 'poison', hit: 'bite', big: 2, after: 'bubbles', aoe: 'coil', shake: 3 } } },
  swampwitch: { mag: ['spush', 'sjab', 'spushup'], skl: ['scharge'], tk: 1.2, fx: { mag: { pal: 'poison', hit: 'poison', p: 'orb', big: 1 }, skl: { pal: 'poison', hit: 'poison', big: 2, after: 'bubbles', aoe: 'miasma', shake: 3 } } }
});
// 만날 때마다 모습 하나 (빌드 53): 기본 모습이 아닌 것은 드랍 없는 이름표 (pxuLook) · 켈피가 맞았을 때 모습도 이름표만
pxuLook('frogman_b', 'frogman', MONS.frogman.name); pxuLook('frogman_c', 'frogman', MONS.frogman.name); pxuLook('frogman_d', 'frogman', MONS.frogman.name);
pxuLook('leech_b', 'leech', MONS.leech.name); pxuLook('leech_c', 'leech', MONS.leech.name);
pxuLook('siren_b', 'siren', MONS.siren.name); pxuLook('siren_c', 'siren', MONS.siren.name);
pxuLook('swampthing_b', 'swampthing', MONS.swampthing.name); pxuLook('swampthing_c', 'swampthing', MONS.swampthing.name);
pxuLook('toadking_b', 'toadking', MONS.toadking.name); pxuLook('toadking_c', 'toadking', MONS.toadking.name);
pxuLook('swampwitch_b', 'swampwitch', MONS.swampwitch.name);
pxuLook('kelpie_w', 'kelpie', MONS.kelpie.name);
Object.assign(PXU_SKIN, { frogman: ['frogman', 'frogman_b', 'frogman_c', 'frogman_d'], leech: ['leech', 'leech_b', 'leech_c'], siren: ['siren', 'siren_b', 'siren_c'], swampthing: ['swampthing', 'swampthing_b', 'swampthing_c'], toadking: ['toadking', 'toadking_b', 'toadking_c'], swampwitch: ['swampwitch', 'swampwitch_b'] });
Object.assign(PXU_SKIN_NAME, { frogman: ['늪 개구리', '황소개구리', '독화살 개구리', '이끼 개구리'], leech: ['검붉은 거머리', '줄무늬 거머리', '창백한 물거머리'], siren: ['청록 세이렌', '검은 머리 늪 세이렌', '붉은 머리 세이렌'], swampthing: ['이끼 괴물', '진흙 괴물', '버섯 괴물'], toadking: ['황소개구리 왕', '정원을 진 두꺼비 왕', '독샘 두꺼비 왕'], swampwitch: ['꼬부랑 노파', '까마귀 마녀'] });
