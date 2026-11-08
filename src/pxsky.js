/* ───────── 구름섬 · 구름 위 신전 몬스터 (빌드 59 시안 · 사용자가 고른 모습): 구름 양 · 하늘 가오리 · 뇌조 · 페가수스 · 구름 거인 · 하늘 기사 · 우두머리 하늘의 거인 · 두목 하늘의 황제 ─────────
   그림체는 빌드 55~58과 같은 「뭉툭」(큰 면 한 색 · 윗가장자리 빛 · 아래 그늘 · 부위마다 다른 글자로 PX_FX가 선을 긋는다).
   사람꼴(구름 거인 · 하늘 기사 · 하늘의 거인 · 서 있는 황제)은 g2 없이 엔진 숨쉬기(cr)로. 짐승(still)과 떠 있는 것(가오리 · 새 · 구름 왕좌)은 g2로 날갯짓 · 구름 · 꼬리를.
   페가수스 기본 모습(흰 날개 말)은 다 자란 펫 · 비행 마차 말 그림. 광역기 회오리바람(twister) · 깃털 폭풍(feathers)은 fmot.js. */
// 구름섬 몬스터 무기 (빌드 59): 구름 거인 부러진 돌기둥 · 쇠스랑 / 하늘의 황제 구름 지팡이 · 깃털 지팡이
// 부러진 흰 돌기둥 몽둥이 (구름 거인 B): 세로 홈이 난 흰 돌 · 위는 기둥머리 · 끝은 부러진 자국
PXU_WPN.mcol = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 8 * k;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -1; t <= L; t += 0.5) for (let s = -1.2; s <= 1.21; s += 0.6) at(t, s, Math.abs(s) < 0.1 ? 'm' : s < -0.6 ? 'M' : 'N');
  for (let s = -2; s <= 2.01; s += 0.5) { at(-1.4, s, 'N'); at(-1.9, s, 'M'); }
  for (const [t, s] of [[L + 0.5, -0.6], [L + 0.5, 0.6], [L + 1.0, 0]]) at(t, s, 'm');
  return out; };
PXU_FXW.mcol = 'great';
// 커다란 쇠스랑 (구름 거인 D): 긴 나무 자루 · 끝에 쇠 갈퀴 셋
PXU_WPN.pfork = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 9 * k;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -3; t <= L; t += 0.5) at(t, 0, 'J');
  for (let s = -1.6; s <= 1.61; s += 0.5) at(L, s, 'N');
  for (const s of [-1.6, 0, 1.6]) for (let t = L + 0.5; t <= L + 3.2; t += 0.5) at(t, s, t > L + 2.6 ? 'm' : 'N');
  return out; };
PXU_FXW.pfork = 'great';
// 구름 지팡이 (하늘의 황제 A): 금 자루 끝에 작은 구름 · 가운데 하늘빛 보석
PXU_WPN.cstaff = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 6.0 * k, o = L - 6.0;
  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);
  for (let t = -2.5; t <= L; t += 0.5) at(t, 0, t < -2.5 + 0.6 ? 'g' : 'G');
  for (const [t, s, ch] of [[10.5,-1.0,'P'],[10.5,0.0,'P'],[10.5,1.0,'P'],[9.5,-2.0,'P'],[9.5,-1.0,'P'],[9.5,0.0,'P'],[9.5,1.0,'P'],[9.5,2.0,'P'],[8.5,-3.0,'P'],[8.5,-2.0,'P'],[8.5,-1.0,'P'],[8.5,0.0,'E'],[8.5,1.0,'P'],[8.5,2.0,'P'],[8.5,3.0,'P'],[7.5,-3.0,'P'],[7.5,-2.0,'P'],[7.5,-1.0,'E'],[7.5,0.0,'E'],[7.5,1.0,'e'],[7.5,2.0,'P'],[7.5,3.0,'P'],[6.5,-2.0,'q'],[6.5,-1.0,'P'],[6.5,0.0,'P'],[6.5,1.0,'P'],[6.5,2.0,'q']]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);
  return out; };
PXU_FXW.cstaff = 'staff';
// 깃털 지팡이 (하늘의 황제 B): 금 자루 끝에 커다란 흰 깃털 하나 · 밑동에 하늘빛 보석
PXU_WPN.fstaff = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 6.0 * k, o = L - 6.0;
  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);
  for (let t = -2.5; t <= L; t += 0.5) at(t, 0, t < -2.5 + 0.6 ? 'g' : 'G');
  for (const [t, s, ch] of [[14.5,1.5,'P'],[14.5,2.5,'q'],[13.5,0.5,'P'],[13.5,1.5,'P'],[13.5,2.5,'q'],[12.5,-0.5,'P'],[12.5,0.5,'P'],[12.5,1.5,'P'],[12.5,2.5,'q'],[11.5,-0.5,'P'],[11.5,0.5,'P'],[11.5,1.5,'q'],[10.5,-1.5,'P'],[10.5,-0.5,'P'],[10.5,0.5,'P'],[10.5,1.5,'q'],[9.5,-1.5,'P'],[9.5,-0.5,'P'],[9.5,0.5,'q'],[8.5,-1.5,'P'],[8.5,-0.5,'q'],[7.5,-0.5,'G'],[6.5,-1.5,'G'],[6.5,-0.5,'E'],[6.5,0.5,'G']]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);
  return out; };
PXU_FXW.fstaff = 'staff';
Object.assign(PXU, {
  cloudsheep: {   // 시안 A 뭉게구름 양 (사용자가 고른 것 중 첫째 = 기본 모습): 동글동글 뭉게구름 털(덩이마다 아래 주름) · 검은 얼굴과 처진 귀 · 머리 위 털 한 줌 · 짧은 검은 다리
    pal: { H: '#f4f8ff', h: '#b4c4e4', L: '#ffffff', C: '#4a4c5e', c: '#2a2c3a', Q: '#6a6c80', k: '#16161e', w: '#ffffff' },
    g: `
.
.
............LL
.......LLLLLLLLL..LLL
......LLLLLhHHhLLLHhHh
...LLLLHHHHhHHhHchhhhC
.LLLLhHHHHHLHHLHcchCCCC
.LhHHhHHHHHHHHHHLCCCCCw
.HhhhLHHhhHHHhhHHLCCCCCC
.hhhhHHhhhhHhhhhHh.CCCCC
..hhhhhhhhhhhhhhhh...CCk
....hhhhhhhhhhhhh
.....hhhhhhhhhhh
......c.C.hh..c.C
......c.C.....c.C
......c.C.....c.C
......c.C.....c.C
......k.k.....k.k
`, g2: `
.
.
........LLL.LL
......LLLLLLLLLL
......LhHHHhHHhLLLLLLL
...LLLHhHHHhHHhHhHhhhh
.LLLLhHLHHHLHHLHchhhCCC
.LhHHhHHHHHHHHHHLcCCCCC
.HhhhLHHhhHHHhhHHLCCCCwC
.hhhhHHhhhhHhhhhHh.CCCCC
..hhhhhhhhhhhhhhhh..CCCk
....hhhhhhhhhhhhh
.....hhhhhhhhhhh
......c.C.hh..c.C
......c.C.....c.C
......c.C.....c.C
......c.C.....c.C
......k.k.....k.k
`, gm: { charge: `
.
.
.
........LLLLLLLL
.......LLLLLLLLLL
.....LLLHHHHHHHHLLLLL
..LLLLhHHHHHHHHHHhhhHL
.hLLhHhHHHHHHHHHHhhhhhC
..HHhHLHhHHHHhhHHLhCCCCC
..hhhHHHhhhHHhhhHHhCCCCC
..hhhhHhhhhhhhhhhh.CCCCw
...hhhhhhhhhhhhhhh..CCCC
.....hhhhhhhhhhhhh...CCC
......c.Chhhh.c.C......k
......c.C.....c.C
......c.C.....c.C
......c.C.....c.C
......k.k.....k.k
`, leap: `
........LLLLLLL
......LLLLLLLLLL.LLLL
....LLLhHHHHHHHLLHhhHh
...LLhHhHHHHHHHHchhhhC
.LLLHhHLHHHHHHHHccCCCCC
.LhHHLHHhHHHHhhHLLCCCCwC
.HhhhHHHhhhHHhhhHHhCCCCC
.hhhhhhhhhhhhhhhHh..CCCk
..hhhhhhhhhhhhhhhh....C
....hhhhhhhhhhhhh
......c.Chhhhc.C
.......c.C...c.C
......ccCC...ccCC
.
.
.
.
.
` }, sh: [22, 8], hip: 99, ax: 11, still: 1, noArm: 1, wpn: 'none' },
  cloudsheep_b: {   // 시안 B 비구름 양: 납작하고 넓게 퍼진 회청빛 비구름 털 · 배 밑으로 떨어지는 빗줄기 · 졸린 눈 · 검은 얼굴
    pal: { H: '#a8b8d0', h: '#6a7a98', L: '#c8d4e8', C: '#3a3e52', c: '#22263a', k: '#121420', w: '#ffffff', B: '#7ab0ff', b: '#4a7ad8' },
    g: `
.
.
............LL
.......LLL.LHHL
......hHHHLHHHHL
.......HHHhHHHHHL
....LLLHHHhHHHHHHL...C
....HhHHHHHHHHHHHHccCCCC
.LLLHhHHhhHHhhhHHHhHCCCCC
LHHhhHHhhhhH.hhhHHhhCCCkk
hhhhhhhhhhhhhhhhHhhhhCCCC
...hhhhhhhhhhhhhhhhhh.CCCk
.....hhchhhh.hhhhC
....B..c.C.....c.C.B
....b..c.C...B.c.C.b
.......c.C...b.c.C
.......c.C.....cBC
.......c.CB....cbC
.......k.kb....k.k
`, g2: `
.
.
............LL
.......LLLLLHHL
......LHHHHhHHHL
......HHHHHhHHHHL
....LLHHHHHHHHHHHL
....HhHHHHHHHHHHHHccCCCC
.LLLHhHHhhHHhhhHHHccCCCCC
LHHhhHHhhhhH.hhhHHhhCCCkk
hhhhhhhhhhhhhhhhHhhhCCCCC
...hhhhhhhhhhhhhhhhhhCCCC
.....hhchhhh.hhhhC.....C.k
.......c.C.....cBC
.......c.CB....cbC
....B..c.Cb....c.C.B
....b..c.C...B.c.C.b
.......c.C...b.c.C
.......k.k.....k.k
`, gm: { charge: `
.
.
.
........LL.LLLL
.......LHHLHHHHL
.......HHHhHHHHHLL
......LHHHhHHHHHhH
.....LHHHHHHHHHHhHLcccC
..LLLHHHhhHHhhhHHHhHcCCCC
..HHhHHHhhhH..hhHHhHHCCCC
.LHhhhHhhhhhhhhhHhhhhCCCkC
.hhhhhhhhhhhhhhhhhhhhCCCCk
....hhhhhhhhhhhhhh.h..CCCC
....B..c.C.....c.C.B...CCk
....b..c.C...B.c.C.b
.......c.C...b.c.C
.......c.C.....cBC
.......c.CB....cbC
.......k.kb....k.k
`, leap: `
........L..LLLL
.......LHLLHHHH
......LHHhhHHHHLL
.....LHHHhhHHHHhHL
....LHHHHHHHHHHhHHccCCC
..LLHHHHhHHHhhHHHHccCCCC
.LHhHHHHhhHH.hhHHHhHCCCkC
LHHhhhHhhhhhhhhhHhhhCCCCk
hhhhhhhhhhhhhhhhhhhhhCCCC
....hhhhhhhhhhhhh.hh...CCk
......ccChh...hh.C
.......c.C....c.C
.......c.C.....ccCC
.
.
.
.
.
.
` }, sh: [24, 9], hip: 99, ax: 11, still: 1, noArm: 1, wpn: 'none' },
  skyray: {   // 시안 A 하늘빛 만타 (사용자가 고른 것 중 첫째 = 기본 모습): 넓은 마름모 날개 · 하늘빛 등과 가까운 날개 앞가장자리의 흰 배 · 어깨의 밝은 무늬 · 머리지느러미 둘 · 길고 가는 꼬리
    pal: { C: '#6aa8e8', Q: '#9ccaf8', c: '#3a6ab0', F: '#5e9ade', S: '#f4faff', k: '#0e1a30', R: '#2a3a6a', M: '#c8e4ff' },
    g: `
.
.
.
..........c
...........QQQ
...........cFFQQ
............FFFFQQ
............FFFFFFQQ
............FFFFFFFFQ
............FFFFFFFFFQ
............Fccccccccccc..CC
...........ccQQQQQQQQQQkCCC
............QCCCCCCCCCCCCQ
ccccccccccc.CCCCCCCCCCCCCc
...........QCCCCCCCCCCCCCCC
...........cCCCCCCCCCCCk..CC
............CCCCCCCCCCc
............CCCCCCCCcc
...........QCCCCMMMc
...........CCCCCCCc
...........CCCCCcc
...........CCCCc
..........QCCcc
..........ccc
.........c
.
.
.
.
`, g2: `
.
.
.
.
.
..........cQ
...........FQQQ
...........cFFFQQQ
............FFFFFFQQ
............FFFFFFFFQQ
............Fcccccccccc...CC
...........ccQQQQQQQQQQkCCC
............QCCCCCCCCCCCCQ
ccccccccccc.CCCCCCCCCCCCCc
...........QCCCCCCCCCCCCCCC
...........CCCCCCCCCCCck..CC
...........CCCCCCCCCCc
...........CCCCCCCCcc
...........CCCCCMMM
...........CCCCccc
..........QCCcc
.........Qccc
.........c
.
.
.
.
.
.
`, gm: { bite: `
...........Q
...........FQ
...........cFQ
............FFQ
............FFFQQ
............FFFFFQ
............FFFFFFQ
c...........FFFFFFFQ
.cc.........FFFFFFFFQ
...ccc......FccccFFFF
......ccccc.cQQQQccMFQ
..........c.QCCCCQQQccQ
..........QQCCCCCCCCQQcc
..........CCCCCCCCCCCCQQkCCC
..........CCCCCCCCCCCCCCCC
.........QCCCCCCCCCCCCCCC
........QCCCCCCCCCCCCCCCc
.......QCCCCCCMCCCCCcckCC
......QCCCCCCCCMCMcc....C
.....QCCCCCCccccc........C
....cccccccc
..cc
.
.
.
.
.
.
.
`, swell: `
.
.
.
.
.
.
.
........cQQQQQQ
.........cFFFFFQMQQQ......C
..........cFFFFFFMccccc.CCC
...........FFFcccQQQQQQkCC
...........FFcQQQCCCCCCCCc
...........ccQCCCCCCCCCCCCC
............QCCCCCCCCCCCcCCC
.......cccc.CCCCCCCCCCCck
...cccc....cCCCCCCCCCCc
ccc.........CCCCCCCCcc
............CCCCCCCM
............CCCCCMM
............CCCCcc
...........QCCCc
...........CCcc
...........cc
..........c
.
.
.
.
.
`, spit: `
.
.
.
............Q
............cQQ
.............FFQQ
.............FFFFQ
.............FFFFFQQ
.............FFFFFFFQ
.............FFFFFFFFQ
............ccccccccccc....C
cccccc......QQQQQQQQQQQc.CCC
......ccccc.CCCCCCCCCCCQkC
...........QCCCCCCCCCCCCCR
...........CCCCCCCCCCCCCCR
...........CCCCCCCCCCCCcC
...........CCCCCCCCCCCckCC
...........CCCCCCCCCcc...CC
...........CCCCMMMCc
...........CCCCCCcc
..........QCCCCcc
..........CCccc
.........ccc
.
.
.
.
.
.
` }, sh: [25, 13], hip: 99, ax: 14, float: 1, still: 1, noArm: 1, wpn: 'none' },
  skyray_b: {   // 시안 B 구름 자락 가오리: 희뿌연 하늘빛 몸 · 날개 뒷가장자리가 뭉게구름 자락으로 풀린다 · 꼬리 끝도 구름 한 줌 · 머리지느러미 둘
    pal: { C: '#cfe2f6', Q: '#f4faff', c: '#8eaad0', F: '#c0d6ee', S: '#ffffff', H: '#ffffff', h: '#b8cce4', k: '#2a3a58', R: '#5a6a8a' },
    g: `
.
.
.
.
........HHc
........HH.QQQ
.......HHHHcFFQQ
.......HHHH.FFFFQQ
........HH..FFFFFFQQ
........HHH.FFFFFFFFQ
........HHH.FFFFFFFFFQ
.......HHHH.Fccccccccccc..CC
........HHHccQQQQQQQQQQkCCC
HH........h.QCCCCCCCCCCCCQ
HHccccccccc.CCCCCCCCCCCCCc
........HH.QCCCCCCCCCCCCCCC
........HHHcCCCCCCCCCCCk..CC
.......HHHh.CCCCCCCCCCc
.......HHHH.CCCCCCCCcc
.......HHH.QCCCCCCCc
.......HHHhCCCCCCCc
.......HHH.CCCCCcc
.......HHh.CCCCc
.......HHHQCCcc
.......HHhccc
.......HHH
.........h
.
.
.
.
`, g2: `
.
.
.
.
.
.......HHH
.......HHHHQ
.......HHH.FQQQ
.......HHH.cFFFQQQ
.......HHHH.FFFFFFQQ
.......HHHH.FFFFFFFFQQ
........HHH.Fcccccccccc...CC
........HHHccQQQQQQQQQQkCCC
..........h.QCCCCCCCCCCCCQ
HHcccccccHc.CCCCCCCCCCCCCc
HH.....HHHHQCCCCCCCCCCCCCCC
.......HHHHCCCCCCCCCCCck..CC
.......HHHhCCCCCCCCCCc
.......HHH.CCCCCCCCcc
.......HHh.CCCCCCCc
.......HHH.CCCCccc
.......HHhQCCcc
......HHHhccc
......HHHH
.......Hh
.
.
.
.
.
.
`, gm: { bite: `
.........HH
........HHHQ
.........HhFQ
........HHHHFQ
........HHHHFFQ
.........HH.FFFQQ
........HHH.FFFFFQ
.H.......HH.FFFFFFQ
HHH.....HHHHFFFFFFFQ
HHHc....HHHHFFFFFFFFQ
....cc...HH.FccccFFFF
.....cccccchcQQQQcccFQ
........H.c.QCCCCQQQccQ
.......HHHQQCCCCCCCCQQcc
......HHHHCCCCCCCCCCCCQQkCCC
.....HHHHhCCCCCCCCCCCCCCCC
....HHHH.QCCCCCCCCCCCCCCC
....HHHhQCCCCCCCCCCCCCCCc
..HHHH.QCCCCCCCCCCCCcckCC
..HHH.hCCCCCCCCCCccc....C
.HHHHQCCCCCCccccc........C
HHH.hccccccc
.HHc
..h
.
.
.
.
.
.
.
`, swell: `
.
.
.
.
.
.
.
.
......HHcQQQQQQ
......HHHcFFFFFQQQQQ......C
......HHHHcFFFFFFcccccc.CCC
......HHHH.FFFcccQQQQQQkCC
.......HHH.FFcQQQCCCCCCCCc
.......HHHHccQCCCCCCCCCCCCC
.......HHHH.QCCCCCCCCCCCcCCC
.......ccch.CCCCCCCCCCCck
....ccc..HHcCCCCCCCCCCc
HHcc....HHH.CCCCCCCCcc
HHH.....HHH.CCCCCCCc
HH......HHh.CCCCCCc
........HHH.CCCCcc
........HHhQCCCc
.......HHHhCCcc
........HHHcc
........HHh
..........h
.
.
.
.
.
`, spit: `
.
.
.
..........HH
.........HHHQ
.........HHHcQQ
........HHHH.FFQQ
.........HHH.FFFFQ
.........HHH.FFFFFQQ
.........HH..FFFFFFFQ
........HHHH.FFFFFFFFQ
HH......HHHHccccccccccc....C
HHcc.....Hh.QQQQQQQQQQQc.CCC
H....cccccc.CCCCCCCCCCCQkC
........HH.QCCCCCCCCCCCCCR
........HHHCCCCCCCCCCCCCCR
.......HHHhCCCCCCCCCCCCcC
.......HHHHCCCCCCCCCCCckCC
.......HHH.CCCCCCCCCcc...CC
.......HHh.CCCCCCCCc
......HHH..CCCCCCcc
......HHHhQCCCCcc
......HHH.CCccc
......HHhccc
......HH
........h
.
.
.
.
.
` }, sh: [25, 14], hip: 99, ax: 14, float: 1, still: 1, noArm: 1, wpn: 'none' },
  thunderbird: {   // 시안 C 번개 꼬리 매 (사용자가 고른 것 중 첫째 = 기본 모습): 날렵한 흰 매(뾰족한 날개) · 등과 날개 끝은 하늘빛 · 꺾이며 뻗은 긴 하늘빛 꼬리깃 둘 · 굽은 부리와 눈 밑 줄
    pal: { C: '#f0f4fa', Q: '#ffffff', c: '#a8b8d0', F: '#c8d4e8', B: '#5ab0f0', b: '#2a70c0', Y: '#ffd84a', k: '#0e1424', K: '#3a4a6a', e: '#ffd84a', R: '#5a1a2a' },
    g: `
...................Q
..................QCB.F
.................cCCBFF
..................CCBQF
..................CCBBF
.................QCCCCF
.................cCCCCF
..................CCCCQ
.................QCCCCC
................ccCCCCC..QQQ
..................CCCCC.QCCkeK
........bbb.......CBCBCQCccbc
...b...bb.bb.bbcQBCCCCCCC..b
....bbb.BBBbbbBBcCCCCCCCcc
...BB.BBB.BBBBBB.ccccccc
....BBB....BBB
.
.
.
.
.
.
.
`, g2: `
.
.
.
.
.
.
.
.
.
................FFFF.....QQQ
.........b....F.QQQQQ....CCkeK
...b...bb.b...FbCCCBCBQQQcCbc
....b.bbBBbbFcQQCBCCCCCCC.cb
...BbbbBB.BbbbCCCCCCCCCCcc
....B.BB..BBBBCCCCCccccc
.....B.....QQQCCCcc
...........CCCCBc
...........cccB
.
.
.
.
.
`, gm: { bite: `
.
.
..................F
...............QBFF
...............CCBFF
.....b........ccCCBF
.....b..........CCBQF
....B.bbbbbb...QCCCCQ
....BB...BBb...cCCCCCF
.....BBBBBBbb...CCCCCQ
..........BBbbbbCCCCCC
...........BBBBBCCBCBCB
...........BBBBBcCCCCCCQ.QQQQ
.................ccCCCCCQCCceKK
...................ccCCCCccbbR
....................Ycccc..b
.....................Y
.....................Y
.
.
.
.
.
`, swell: `
....................Q
..................cQCBF
...................CCBF
...................CCBFF
.................QQCCBQF
.................cCCCCC
..................CCCCC
.................QCCCCC..QQ
................cCCCCCC.QCCc
.................cCCCCC.CCceKK
..................cCCBCQCcbc
...................BCCCCC.b
.................QQCCCCCc
.........b....bcQBCCCCCc
........bbbbbbbBccccccc
.......b.BBbbbBB
....bbb.BBBBBBB
....B..BB...B
.....BB
.
.
.
.
`, spit: `
.
.................Q..F
................QCBFF
...............ccCBQF
.................CCBFF
.................CCBQF
................QCCCCF
................cCCCCQ
.................CCCCC
................QCCCCC....QQ
.........bb....ccCCCCCQ..QCcQ
...bb.bbb.bb...b.CCBCCBQQCCbeK
...Bbbb.BBBbbbbcQBCCCCCCCccb.R
...BB.BBB.BBbBBBccCCCCCCc..b
.....B.....BBBB...cccccc
.
.
.
.
.
.
.
.
` }, sh: [30, 10], hip: 99, ax: 14, still: 1, noArm: 1, wpn: 'none', float: 1 },
  thunderbird_b: {   // 시안 D 구름 날개 두루미: 목과 다리가 긴 두루미가 날아간다 · 구름 혹이 달린 흰 날개(끝은 먹빛) · 검은 목과 꽁지 · 붉은 정수리 · 긴 노란 부리 · 날개 끝에서 튀는 번개
    pal: { C: '#f4f8fc', Q: '#ffffff', c: '#b4c2d8', F: '#d0dcec', K: '#2a2e3a', k: '#0e1018', R: '#e8303a', Y: '#ffd84a', B: '#7ad8ff', G: '#4a4e5e', e: '#ffd84a', r: '#7a1a24' },
    g: `
..............BBB
................B
...............BB
...............Q.FF
..............QCKFF
.............QCCKKFF.C
............cCCCCKKFCCC
.............CCCCCCQFCc
............ccCCCCCCFCCC
..............CCCCCCQCCC
.............QCCCCCCCF.c
............cCCCCCCCCQCCC
.............CCCCCCCCC.Cc
............ccCCCCCCCC.....KKKKQRR
............K.CCCCCCCC..QQQKKKKcckY
...........KKccCCCCCCCQQCcc
...........KKKKcCCCCCCCCc
...........KK.QKCCCCCCCC
...........K.GcccCCCCccc
...........GGG...cccc
.......GGGG
.
.
.
.
.
.
.
.
.
.
.
.
.
`, g2: `
.
.
.
.
.
.
.
.
.
.
.
.
..............FFFF
............F.QQQQF............QQR
............QKCCCCQQQ....QQKKKKCCkYYY
..........FKcQCCCCCCCQQQQCcKK..ccc
..........FKKCCCcCCCCCCCcc
...........cQCCCCCCCCCCC
.........FFCCCcCCCCCcccc
.........GKCCCCCCCCC
.....GGGGFFKcCCCCCCc
.........cKKKCCCCcc
..........KKKKCCc
..........KKKKcc
...........KKc
...........K
..........BB
........BB
.........B
.......BBB
.
.
.
.
`, gm: { bite: `
.
.
.........B
.........B.B
.........BBB
...........B.F
...........B.FFF..C
...........QQKFFFCCC
...........CCKKKFF.cC
..........QCCCCCQQFCCC
..........cCCCCCCCQF.cC
...........CCCCCCCCQFCC
...........cCCCCCCCCQ..c
............CCCCCCCCCQ
...........KcCCCCCCCCC
...........c.CCCCCCCCCQQ
.............CCCCCCCCCCCQ
............ccCCCCCCCCCCCQQKKK
..............cccccccccccccKKKKQQRc
..................G............cckY
..................G.................Y
...................G
...................G
....................G
.
.
.
.
.
.
.
.
.
.
`, swell: `
.................B
.................B
.................B
...............QQKFF
..............QCCKFF
.............cCCCKKF..C
..............CCCKCQFCCC...Qc
.............cCCCCCCF.Cc..QCRY
..............CCCCCCQ.CC.Kcck
.............QCCCCCCCFCCKK
............ccCCCCCCCQ.cK
..............CCCCCCCCCCC
............ccCCCCCCCC.Cc
..............CCCCCCCC.CC
.............cCCCCCCCCQCc
..............ccCCCCCCCC
...........KKKKKcCCCCCCC
...........KKKKKKCCCCCCCc
...........KK.cKQCCCCCcc
...........KK..Gcccccc
.............GG
............G
..........GG
........GG
.
.
.
.
.
.
.
.
.
.
`, spit: `
...........B
...........B
...........BBB
.............B
.............B.FF
.............QKFFF
............QCKKFFCCC
...........QCCCKQFFCc
..........ccCCCCCQFFCC
............CCCCCCQFCC
...........ccCCCCCCQF.cC
.............CCCCCCCQCCC
............QCCCCCCCC..c
...........ccCCCCCCCCQ
............KCCCCCCCCC....QKKKKQQRc
...........KcCCCCCCCCCQQQQcKKKKcck
...........KKCCCCCCCCCCCcc..........Y
...........K.ccCCCCCCCCc
............GGGcccCCccc
.......GGGGG......cc
.
.
.
.
.
.
.
.
.
.
.
.
.
.
` }, sh: [37, 14], hip: 99, ax: 18, still: 1, noArm: 1, wpn: 'none', float: 1 },
  pegasus: {   // 시안 A 흰 날개 말 (사용자가 고른 것 중 첫째 = 기본 모습): 다리가 긴 흰 말 · 은빛 하늘 갈기와 꼬리 · 등에서 위로 활짝 든 커다란 흰 깃 날개(덮깃 · 첫째깃 줄) · 연회색 발굽
    pal: { C: '#f4f6fa', Q: '#ffffff', c: '#b4bcd0', K: '#8a94b0', W: '#ffffff', w: '#ccd6ea', V: '#a8b6d4', L: '#ffffff', M: '#a8d4ff', m: '#6aa0e0', e: '#1a2240', k: '#3a4258' },
    g: `
.
.
...........Www
..........WWWw
.........WWVWWw
........WWWVVWWw
.........WWVVWWw.......Q
........WWWVVWWL...MMMMC
..........WVVWWWL.M.mMMCQ
.........WWVVWWWLMMMMQCCCQ
.........wWVVVWWLMMMCCCCeCQ
.........WWWVVWWWLMMCCCCcCCQ
..........WWVVWWWLMCCCCc.cCCQ
..........WWVVWWWLCCCCC...cck
......QQQQQWWVVQQCCCCCc
....MQCCCCCCCCCCCCCCCC
...MQCCCCCCCCCCCCCCCCC
..MMcCCCCCCCCCCCCCCCCC
.MMm.cCCCCCCCCCCCCCCCc
.MMm..CcCccccccccCccC
.MMm..C.C........C..C
.M.m..C.C........C..C
.Mmm..C.C........C..C
..M...C.C........C..C
..M...c.c........c..c
......K.K........K..K
`, g2: `
.
.
.
.........w
........www
.......WWWww
......wWWWWWw..........Q
......WWVWWWWw....MMMMMC
......WwVVWWWLw..MM.mMMCQ
.......WWVVWWWLW.MMMMQCCCQ
.......WWVVWWWWLMMMMCCCCeCQ
........WWVVWWWLWmMMCCCCcCCQ
.......WWWVVVWWWLMMCCCCc.cCCQ
.........WWWVWWWWMCCCCC...cck
......QQWWWWVVVWQCCCCCc
....MQCCCCWWWVWCCCCCCC
...MQCCCCCWCCCCCCCCCCC
..MMcCCCCCCCCCCCCCCCCC
.MMm.cCCCCCCCCCCCCCCCc
.MMm..CcCccccccccCccC
.MMm..C.C........C..C
.MMm..C.C........C..C
.M.m..C.C........C..C
.Mmm..C.C........C..C
..M...c.c........c..c
..M...K.K........K..K
`, gm: { charge: `
.
.
.
.
.
.
.
.....wwwww.............Q
.....WWWWWww.......MMMMC
.....WWWWWWLWw....M.mMMCQ
....wWVWWWWWLLW..MMMMQCCCQ
.....WWVVWWWWWLWMMMMCCCCeCQ
....WwWWVVWWWWWLWmMMCCCCcCCQ
......WWWVVWWWWWLMMCCCCc.cCCQ
......QQWWVVVWWWmMCCCCc...cck
....MQCCWWWWVVVWCCCCCC
...MQCCCCWWWWVVCCCCCCC
..MMcCCCCWCWWWCCCCCCCC
.MMm.cCCCCCWCCCCCCCCCc
.MMm..CcCccccccccCccC
.MMm..C.C........C..C
.M.m..C.C........C..C
.Mmm..C.C........C..C
..M...C.C........C..C
..M...c.c........c..c
......K.K........K..K
`, leap: `
.............WWWw
............WWVVW
...........wWWVVWw
...........WWWVWWW
...........wWWVWWW
..........WWWVVWWW
..........wwWVVWWW.....Q
.........WWWWVVWWWLMMMMC
..........wWWVVWWWL.mMMCQ
..........WWWVVWWWMMMQCCCQ
...........WWVVWWLMMCCCCeCQ
............WVVWWLMMCCCCcCCQ
..............MMMMMCCCCc.cCCQ
.............M..mMCCCCC...cck
......QQQQQQQQQQQCCCCCc
....MQCCCCCCCCCCCCCCCC
...MQCCCCCCCCCCCCCCCCC
..MMcCCCCCCCCCCCCCCCCc
.MMm.cCCCCCCCCCCCCCCCKQK
.MMm..CcCccccccccccCcQc
.MMm..C.C..........c.c
.M.m..C.C
.Mmm..C.C
..M...C.C
..M...c.c
......K.K
` }, sh: [29, 12], hip: 99, ax: 13, still: 1, noArm: 1, wpn: 'none' },
  pegasus_b: {   // 시안 D 접은 날개 갈색 페가수스: 밤색 말 · 검은 갈기와 꼬리 · 날개를 몸에 착 접었다(크림빛 깃 · 끝은 하늘빛 · 덮칠 때만 활짝) · 흰 발목
    pal: { C: '#8a5a36', Q: '#ae7a4e', c: '#5a3a20', K: '#2a1c14', H: '#2a1c18', h: '#140c0a', W: '#f4ead2', w: '#cfe4f4', V: '#9ac0e0', B: '#7aaee0', U: '#f4eee4', e: '#140c08', k: '#2a1810' },
    g: `
.
.
.
.
.
.
.......................Q
...................HHHHC
..................H.hHHCQ
.................HHHHQCCCQ
................HHHHCCCCeCQ
..............WWHhHHCCCCcCCQ
........wWWWWWWWWWWCCCCc.cCCQ
....wwwwwWVVVVVVVVVVCCC...cck
.wwwBwBwwBWWWWWWWWWWCCc
.ww.wBBwBBWWWWWWWWCCCC
...HBCCBwCCWWCCCCCCCCC
..HHcCCCCCCCCCCCCCCCCC
.HHh.cCCCCCCCCCCCCCCCc
.HHh..CcCccccccccCccC
.HHh..C.C........C..C
.H.h..C.C........C..C
.Hhh..C.C........C..C
..H...U.U........U..U
..H...U.U........U..U
......K.K........K..K
`, g2: `
.
.
.
.
.
.
.......................Q
..................HHHHHC
.................HH.hHHCQ
.................HHHHQCCCQ
................HHHHCCCCeCQ
.........WWWWWWWWWWHCCCCcCCQ
......WWwWWWWWWVVVVVCCCc.cCCQ
...WwwwwwWVVVVVWWWWWCCC...cck
.wwwBwBwwBWWWWWWWWWWCCc
.ww.wBBwBBWWWWWWWWCCCC
...HBCCBwCCWWCCCCCCCCC
..HHcCCCCCCCCCCCCCCCCC
.HHh.cCCCCCCCCCCCCCCCc
.HHh..CcCccccccccCccC
.HHh..C.C........C..C
.HHh..C.C........C..C
.H.h..C.C........C..C
.Hhh..U.U........U..U
..H...U.U........U..U
..H...K.K........K..K
`, gm: { charge: `
.
.
.
.
.
.
.
.......................Q
...................HHHHC
..................H.hHHCQ
.................HHHHQCCCQ
..............WWHHHHCCCCeCQ
........wWWWWWWWWWWHCCCCcCCQ
....wwwwwWVVVVVVVVVVCCCc.cCCQ
.wwwBwBwwBWWWWWWWWWWCCc...cck
.ww.wBBwBBWWWWWWWWCCCC
...HBCCBwCCWWCCCCCCCCC
..HHcCCCCCCCCCCCCCCCCC
.HHh.cCCCCCCCCCCCCCCCc
.HHh..CcCccccccccCccC
.HHh..C.C........C..C
.H.h..C.C........C..C
.Hhh..C.C........C..C
..H...U.U........U..U
..H...U.U........U..U
......K.K........K..K
`, leap: `
.............WWWw
............WWVVW
...........wWWVVWw
...........WWWVWWW
...........wWWVWWW
..........WWWVVWWW
..........wwWVVWWW.....Q
.........WWWWVVWWWWHHHHC
..........wWWVVWWWW.hHHCQ
..........WWWVVWWWHHHQCCCQ
...........WWVVWWWHHCCCCeCQ
............WVVWWWHHCCCCcCCQ
..............HHHHHCCCCc.cCCQ
.............H..hHCCCCC...cck
......QQQQQQQQQQQCCCCCc
....HQCCCCCCCCCCCCCCCC
...HQCCCCCCCCCCCCCCCCC
..HHcCCCCCCCCCCCCCCCCc
.HHh.cCCCCCCCCCCCCCCCKQK
.HHh..CcCccccccccccCcQc
.HHh..C.C..........c.c
.H.h..C.C
.Hhh..C.C
..H...U.U
..H...U.U
......K.K
` }, sh: [29, 12], hip: 99, ax: 13, still: 1, noArm: 1, wpn: 'none' },
  cloudgiant: {   // 시안 A 구름 몸 거인 (사용자가 고른 것 중 첫째 = 기본 모습): 뭉게구름으로 된 몸통 · 어깨 · 다리(연보랏빛 그늘) · 둘레에 떠도는 구름 조각 · 금빛 바람 무늬 돌 가면(하늘빛 눈 틈) · 허리 돌 띠 · 돌 주먹 · 돌 발
    pal: { H: '#f6f4ff', h: '#b0b0dc', L: '#ffffff', C: '#8a8e9e', Q: '#b0b4c2', c: '#5a5e6e', B: '#7ae0ff', Y: '#f0c850', k: '#1a1e2a' },
    g: `
.............LL
............LHHL
.........LLLHhhH.L
........LhHQQQQQQQL
........hhQQYYCYYCQ
.........hCCCCYCCCC
..........CCkBCkBCC.....HH
..HH......CCCCCCCCC....HHH
..HH.LLL..CCCcccCCC..L..Hh
...hLHHHLLcccccccccLLHLL
....hHHHhHhHhHHhHhHHhHhh
....hhHHhHhHHHHHHhHHhHhh
....HhhHHHHHHHHHHHHHHHh
.HH.HHhHHHHHHHHHHHHHHH...H
.HHHHHHhhhHHHHHHHHHHHH..HHH
...hHHHhhhHHHHHHHHHHhhh...h
...HHHHhhhHHHhhHHHHhhhh
...HHHHhhhhHhhhhHHhhhh
...HHHH.hhhhhhhhhhhhh
...HHHH.CCYCCYCCYCCY
...QQQQQCCCCCCCCCCCC
...CCCCC..hhhhhhhhhh
...CCCCC.LLhhhhhhhh
...cccccLHHL...LHHL
........HHHH...HHHH
........HhHH...HHHH
........hhhH...hHHh
........hhhh...hhhh
........hhhh...hhhh
........QQQQQQ.QQQQQQ
.......QCCCCCCQCCCCCC
.......cccccccccccccc
`, sh: [20, 12], hip: 23, ax: 14, ms: 1.25, arm: ['H', 'h'], hand: 'C', wpn: 'rfist', idle: { h: [1, 3], a: 70 } },
  cloudgiant_b: {   // 시안 B 기둥 거인: 잿빛 살갗의 거인 · 머리 위 구름 곱슬머리 · 어깨에 두른 뭉게구름 숄 · 한쪽 어깨에 걸친 흰 천 옷과 금테 · 굵은 눈썹의 굳은 얼굴 · 부러진 흰 돌기둥을 몽둥이로
    pal: { C: '#9aa2b4', Q: '#bcc4d4', c: '#646c80', U: '#f4f0e6', u: '#cfc8b8', Y: '#e8c050', H: '#ffffff', h: '#b8c8e4', L: '#ffffff', M: '#e8e6e0', N: '#c8c4bc', m: '#9a968e', k: '#1a1e28', e: '#e8f4ff' },
    g: `
.............LLL
..........LLLhhHLLL
..........hHHhhhHHh
...........hhCCChhC
...........CCcccccc
..........QCCCCCCCC
..........cCCCkCCkCc
...........CCCCCCCC
...........CCCCcccC
...........cCCCCccc
.......LL...CCCC
......LHHhLLLUCCQLLL
.....QhHhhHHHuUUCHHhLLL
.....CChhChhhCYuUhhhHHHh
.....CCCCCCCCCCCYUhhhHh
....QCCCCCCCCCCCCYYUUh
....CCCCUUUUUUUUUUUYY
...QCCCUUUUUUUUUUUUUUc
...CCCCUUUUUUUUUUUUUU
...CCCCUUUUUUUUUUUUUU
...CCCCUUUUuUUUuUUUUU
...CCCCUUUUuUUUuUUUUU
...cCCCUUUUuUUUuUUUUU
....cccuUUUuUuuuUUUuu
........YYYYY..YYYY
........CCCCC..CCCCQ
........CCCCc..cCCCC
........CCCC....CCCC
........CCCC....CCCC
........cccc....cccc
........ccccc..cccccc
........ccccc..cccccc
`, sh: [20, 12], hip: 23, ax: 14, ms: 1.25, arm: ['C', 'c'], hand: 'C', wpn: 'mcol', idle: { h: [1, 3], a: 70 } },
  cloudgiant_c: {   // 시안 D 하늘 농부 거인: 챙 넓은 밀짚모자 · 소매 걷은 하늘빛 옷과 새끼줄 띠 · 작은 눈과 큰 코 · 흙 묻은 장화 · 커다란 쇠스랑
    pal: { C: '#d8a070', Q: '#f0bc8a', c: '#a8704a', S: '#7ab0e0', s: '#4a80b8', T: '#e8c868', t: '#b8963a', R: '#c8a060', J: '#8a5a30', N: '#8a8e9a', m: '#d8dce6', K: '#5a4030', k: '#1a1008', e: '#ffffff' },
    g: `
...........TTTTTTTT
..........TTTTTTTTT
..........TTTTTTTTT
..........TRRRRRRRR
......ttttttttttttttttt
...........CCCCCCC
...........CCkCCkC
...........cCCccCc
............ccCcc
......SSS.....ccc
......SSSSSSSSSSSSSSS
.....SSSSSSSSSSSSSSSS
.....SSSSSssSSSSSSSSS
.....SSSSSSSSSSSSSssS
....SSSSSSSSSSSSSSSSSS
....SSSSSSSSSSSSSSSSSS
....SSSSSSSSSSSSSSSSSS
....SSSSSSSSSSSSSSSSSS
....SSSRRRRRRRRRRRRRRRR
....sssSSSSSSSSRRSSSSs
....QQQSSSSSSssSSSSSS
....CCCsSSSSSSSSSSSSS
....ccccsSSSSssSSSSSs
.........SSSS..sSSSS
.........SSSS...SSSS
.........SSSS...SSSS
.........SSSS...SSSS
.........SSSS...SSSS
........sssss...ssss
........KKKKKK..KKKKKK
........KKKKKK..KKKKKK
`, sh: [20, 11], hip: 22, ax: 14, ms: 1.25, arm: ['S', 's'], hand: 'C', wpn: 'pfork', idle: { h: [1, 3], a: 70 } },
  skyknight: {   // 시안 A 날개 투구 창기사 (사용자가 고른 것 중 첫째 = 기본 모습): 옆에 작은 흰 날개가 달린 은빛 투구(하늘빛 눈 틈) · 은빛 갑옷과 하늘빛 겉옷 · 몸 앞에 든 연 모양 흰 방패(파란 테 · 구름 문장) · 긴 창
    pal: { C: '#c8d0e0', c: '#8a94ac', Q: '#ffffff', B: '#5a90e0', b: '#3a64b0', H: '#ffffff', h: '#b8c8e4', K: '#4a5268', k: '#141a28', e: '#9ae8ff', S: '#f4f6fa', s: '#4a7ad0', U: '#c8d8f0' },
    g: `
....H
.....H..QQQQ
....HhHQCCCC
....HHhCCCCCQ
.......CCCkkek
.......cCCCc
........ccc
.
......QQQQQsssssss
.....QcccccsSSSSSs
.....CBBBBBsSSSSSs
.....CBBBBBsSUUUUs
.....CBBBBBBSSUUSs
.....CBBBBBBsSSSSs
.....CBBBBBBsSSSs
.....cBBBBBBBsSSs
......BBBBBBBBss
......bbbbbbbbs
......QQ..cQQ
......CC...CC
......cc...cc
.....KKKK..KKK
`, sh: [12, 9], hip: 15, ax: 8, ms: 1.2, arm: ['C', 'c'], hand: 'C', wpn: 'lance', idle: { h: [2, 3], a: 20 } },
  skyknight_b: {   // 시안 B 구름 망토 검사: 얼굴이 드러난 가벼운 은빛 투구 · 은빛 가슴판과 하늘빛 옷 · 가죽 띠 · 등 뒤로 흩날리는 흰 구름 망토 · 장검
    pal: { C: '#d0d6e2', c: '#8a94ac', Q: '#ffffff', B: '#4a80d0', b: '#2e5aa0', H: '#ffffff', h: '#b8c8e4', L: '#ffffff', F: '#f1c9a5', f: '#c89a78', R: '#6a4a30', K: '#3a4258', k: '#141a28', e: '#1a2a4a' },
    g: `
........CCCC
.......CCCCCC
.......FFFFFF
.......RFFFeF
.......RFFFFF
........FFFFf
.....L
....LHBQQQQQQB
..LLHhQCCCCCCB
.LHhHhCCCCCCCB
.HHhh.CCCCCCCB
.HHH..cccccccB
.HHHh.BBBBBBBB
.hHh..RRRRRRRR
..hh..BBBbBBBb
..hhh.Bbb.BBb
..hhh.Bb..BBb
......BB..bBB
......BB...BB
......bb...bb
.....KKKK..KKK
`, sh: [12, 8], hip: 14, ax: 9, ms: 1.2, arm: ['B', 'b'], hand: 'F', wpn: 'sword', idle: { h: [2, 3], a: 20 } },
  skyknight_c: {   // 시안 D 푸른 갑주 대검사: 두꺼운 남빛 판금에 금빛 가로 테 · 큰 어깨 갑옷 · 눈 틈이 있는 통 투구 · 높이 솟아 뒤로 늘어진 흰 깃 장식 · 커다란 양손 대검
    pal: { A: '#3a5aa8', a: '#24387a', F: '#5a7ac8', Y: '#f0c850', y: '#b08a2a', W: '#ffffff', w: '#c8d4ea', H: '#ffffff', K: '#2a3048', k: '#0e1222', e: '#9ae8ff', N: '#c8d0e0' },
    g: `
.......wW
........ww
........WW
........WWW
........FWWFF
.......FAAAAA
.......AAkkekk
.......AAAAAA
.....F.AAAAAAFF
...FFAFAYYYYYAAF
...AAAAAAAAAAAAAY
...YAAAYAAAYAAAY
....YYYAAAAAYYY
.....AAAAAAAAAA
.....AAAAAAAAAA
.....AAAAAAAAAA
.....YYYYYYYYYY
.....AAAAAAAAAA
.....aAAAaAAAaa
......Aaa.AAa
......Aa..AAa
......AF..aAF
......AA...AA
......aa...aa
.....KKKK..KKK
`, sh: [13, 11], hip: 18, ax: 9, ms: 1.2, arm: ['A', 'a'], hand: 'A', wpn: 'great', idle: { h: [2, 3], a: 20 } },
  skytitan: {   // 시안 A 섬을 진 거인 (사용자가 고른 것 중 첫째 = 기본 모습): 등에 작은 바위섬을 진 거인(섬 위 풀 · 빨간 지붕 작은 집 · 작은 나무 · 뒤로 떨어지는 폭포와 물안개) · 섬 앞에 나온 머리(무거운 눈썹 · 빛나는 흰 눈 · 네모난 턱) · 넓은 어깨와 이끼 · 푸른 잿빛 살갗 · 허리 가죽 · 돌주먹
    pal: { C: '#8a9ab8', Q: '#b0bfd8', c: '#5a6888', d: '#71809e', A: '#9cacc8', a: '#6a789a', U: '#8a6a4a', u: '#5a4430', G: '#7ac04a', g: '#4a8a32', J: '#7a5a3a', j: '#4e3622', R: '#d05a3a', r: '#8a3020', I: '#f4ead2', B: '#7ad0ff', b: '#3a90d8', F: '#7a5a3a', f: '#4a3420', e: '#ffffff', k: '#141a28', H: '#ffffff', h: '#b8c8e4' },
    g: `
...............GGG
......R.......GGGGG
.....RRR.....GGGGGG
....RRRRR....gGggGGg
...rrrrrrr....g.Jgg
....IIIII.......J
....IIJIk.......J
....IIJII.......J.GGGGGG
.GgGgGJgggggggggJggggggg
.ggGgggUUUUUUUUUUUUUUUUU
..ugUUUgUUUUUgUUUUUgUUgQQQQQ
..BBUUUUUUUUUUUUUUUUUUQCCCCCcc
.BBuUUUUUUUUUUUUUUUUUuCcccccC
.Bb.uuuuUUUUUUUUUUuuucCCeCCeC
.Bb..uUUuuuuuuuuuuUUu.CCCCCCCQQ
.BB...uUUUUUUUUUUUuu..CCCCCCCCc
.BB....uUcQQQQQQQQQQQQCCCCCCCC
.Bb.....QQCGCCCCCCCCCGGCCccccC
.BB....dCGGCCCCCCCCCCCCCCCCccc
.BB....dCCCCCCCCCCCCCCCCCCC
.B.....dCCCCCCCCCCCCCCCCCCC
HHH...ddCCCCCCCCCCCCCCCCCCC
HHHHh.ddCCCCCCCCCCCCCCCCCCC
hhhhhdddCCCCCCCCCCCCCCCCCCC
.....dddCCCCCCCCCCCCCCCCCCC
.....dddcCCCCCCCCCCCCCCCCCC
.....ddddCCCCCCCCCCCCCCCCCC
.....ddddcCCCCCCCCCCCCCCCCc
.....ddddcCCCCCCCCCCCCCCCC
.....dddd.cFFFFFFFFFFFFFFFF
.....dddd.dFFFFFFFFFFFFFFFF
....dddddddFFFFFFFFFFFFFFFF
....cddddcdfffffffffFFFFfff
.....cccc.ddddddc.CCFFFFC
..........dddddd..CCFFFFC
..........dddddd..CCffffC
..........dddddd..cCCCCCC
.........ddddddd...CCCCCCQ
.........ddddddd...CCCCCCC
.........cdddddd...CCCCCCc
..........dddddd...CCCCCC
..........dddddd...CCCCCC
.........dddddddd.QCCCCCCQQ
.........dddddddd.CCCCCCCCC
.........ccddddcc.cCCCCCccc
...........cccc....ccCCc
.....................cc
`, sh: [25, 20], hip: 32, ax: 17, ms: 1.5, mx: 20, my: 20, arm: ['A', 'a'], hand: 'C', wpn: 'rfist', idle: { h: [1, 4], a: 78 } },
  skytitan_b: {   // 시안 B 폭풍석 거인: 먹구름빛 돌덩이들이 서로 닿지 않고 떠서 이어진 거인 — 머리 · 어깨 · 가슴 · 허리 · 다리 덩이 사이 틈 · 울퉁불퉁한 머리 바위에 빛나는 두 눈 · 가슴에 동그랗게 빛나는 폭풍 심장 · 돌 금 · 틈 둘레에 감도는 바람과 떠도는 돌 조각 · 앞팔은 바람 줄기에 돌주먹
    pal: { C: '#5c6078', Q: '#8286a6', c: '#3a3c50', d: '#4a4c62', E: '#7af0ff', D: '#2a9ad0', e: '#ffffff', H: '#eef8ff', h: '#a8d4f4', A: '#dcf2ff', a: '#8cc4ee', k: '#141a28' },
    g: `
.......................QQ
...................QQQQCCQ
..................QCcCCCCCQQ
..................CCCcCCCCCC..dd
.................QCCCcCCCCCC..dd
.................CCCCCCECCEC
.................CCCCCCCCCCc
.................ccCCCCCCCc
...................ccccccc....Q
...........................QQQCQQ
....dd.....................CCCCCCQ
....dd.....................CCCCCCC
................QQQQ.......cCCCCCC
.............QQQCCCCQQQQQQQ.CCCCCc
.........QQQQCCCCCCCCCCCCCCQCCccc
..HH.....CCCCCCCCCCCCCCCCCCCCC
..H...dddcCCCcCCCCCDDCCCCCCCCC
.H....ddddCCCcCCCCEEEDCCCCCCCC
..H...ddddCCCCcCCDEeeEDCCCCcCC
..H...ddddCCCCcCCDEEEEDCCCcCCc
..HH..cccdCCCCcCCDDEEDCCCCcCC
....H....ccCCcCCCCDDDCCECCCCC
...........cCCCCCCCCCCCECCCCc
.....ddddd..cCCCCCCCCCCCEECc
.....ddddd...cCCCCCCCCCCCCc.......dd
.....ddddc....cCCCCCcccccc........dd
.....cccc......ccccc
.............................HHH
.........d...QQQQQQQQQQQQQ......H
....dddddd...CCCcCCCCCCCCC......H
....dddddd...cCCcCCCCCCCCc.....HH
....ddddddc...ccccccccccc
....cddddc..........................dd
.....cccc.......d.......Q...........dd
............ddddd...QQQQC
............ddddd...CCCCCQ
............cccccc..cccccc
.
...............dd......QQ
............ddddd...QQQCC
............ccccc...ccccc
.
..........dddddddd.QQQQQQQQ
..........cccccccc.cccccccc
`, sh: [30, 12], hip: 32, ax: 19, ms: 1.5, mx: 20, my: 20, arm: ['A', 'a'], hand: 'C', wpn: 'rfist', idle: { h: [2, 3], a: 70 } },
  skytitan_c: {   // 시안 C 하얀 성채 거인: 흰 돌을 쌓은 성벽 몸(엇갈린 돌 줄눈 · 성가퀴 · 세로로 좁은 활 쏘는 틈) · 어깨는 구리빛 청록 고깔 지붕 탑 · 탑 머리에 빛나는 창문 눈과 성문 같은 입 · 꼭대기와 어깨 탑의 붉은 깃발 · 발치에 구름 · 돌 주먹
    pal: { C: '#e8e6e0', Q: '#ffffff', c: '#a8a49a', d: '#c8c4ba', A: '#cfcbc1', a: '#99958b', F: '#e8e6e0', f: '#a8a49a', B: '#4fb4a2', b: '#2a7a6c', Y: '#ffe070', k: '#2a2a34', R: '#d84a4a', r: '#902a2a', J: '#7a5a3a', H: '#ffffff', h: '#b8c8e4', L: '#ffffff' },
    g: `
...................JRR
...................JRRR
...................J
...................J
...................J.........JR
...................b.........JR
..................BBb........J
.................BBBBb.......J
........Bb.......BBBBb.......Bb
........BBb.....BBBBBBb.....BBb
.......BBBb....bbbbbbbbb....BBBb
.......BBBBb....QQQQQQQQ...BBBBb
......BBBBBBb...CCCCCCCC..BBBBBBb
.....bbbbbbbb...CCCCCCCC..bbbbbbbb
......QQQQQQQ...CCCCCCCC..QQQQQQQQ
......CCCCCCC...CYYYCYYC..CCCCCCCC
......CCCCCCC...CYYYCYYC..CCCCCCCC
......CCCkkCC...CCCCCCCC..CCCkkCCC
......CCCkkCC...CkkkkkkC..CCCkkCCC
......CCCCCCC...CkkkkkkC..CCCCCCCC
......CCCCCCCQ.QCCCCCCCCQQCCCCCCCC
......CCCCCCCCQCCCCCCCCCCCCCCCCCCC
......ccccCCCdCCCCCCCCCCCdCCCCcccc
.....AAAAACCCdCCCCCCCCCCCdCCCC
.....AAAAACCCdCCCCCCCCCCCdCCCC
.....AAAAAdddddddddddddddddddC
.....AAAAACdCCCCdCCCCCdCCCCdCC
.....AAAAACdCCkCdCCCCCdCkCCdCC
.....AAAAACdCCkCdCCCCCdCkCCdCC
.....AAAAACCCCkCCCCCCCCCkCCCCC
.....AAAAAdddddddddddddddddddC
.....AAAAACCCdCCCCCdCCCCCdCCCC
.....AAAAACCCdCCCCCkkCCCCdCCCC
.....AAAAACCCdCCCCCkkCCCCdCCCC
.....AAAAACCCCCCCCCkkCCCCCCCCC
....AAAAAACCCCCCCCCCCCCCCCCCCC
....AAAAAACCCCCCCCCCCCCCCCCCCC
....AAAAAAcCCCCCCCcccCCCCCCCcc
....AAAAAAACCCCCCC...CCCCCCC
....aaaaaaaCCCCCCC...CCCCCCC
...........CCCCCCC...CCCCCCC
...........CCCCCCC...CCCCCCC
...........CCCCCCC...CCCCCCC
........LL.CCCCCCC...CCCCCCCLLL
.......LHHLCCLLCCC...CCCLCCLHHHL
......hHhhHhLHHLCC.L.CCLHLLHHhHH
.......HhhhcHhhHccLhLcLHhHHhhhhh
.......hhhh.hhhh.hhhH.hhhhh.hhh
.............hh...hhh..hhh
`, sh: [29, 23], hip: 36, ax: 20, ms: 1.5, mx: 20, my: 20, arm: ['F', 'f'], hand: 'C', wpn: 'rfist', idle: { h: [2, 3], a: 70 } },
  skyemperor: {   // 시안 A 구름 왕좌 황제 (사용자가 고른 것 중 첫째 = 기본 모습): 떠 있는 구름 위 금빛 왕좌(푸른 벨벳 등받이 · 꼭대기 금 구슬)에 앉은 젊은 황제 · 진홍 옷과 높은 깃 · 비스듬한 금 띠 · 흰 소매 · 짙은 갈색 머리 · 세 뿔 금관 · 금 신 · 구름 지팡이
    pal: { G: '#e8c050', g: '#a88a2a', o: '#fff0a0', E: '#7ad8ff', e: '#ffffff', k: '#1a1420', S: '#f1c9a5', t: '#ffe0c4', s: '#c08a68', H: '#4a3020', h: '#2a1a10', C: '#c8484e', Q: '#e8787a', c: '#8a2a36', B: '#6aa8e8', b: '#3a70b8', U: '#3a5aa8', u: '#24387a', P: '#ffffff', q: '#b8cce8' },
    g: `
.............G
.............G.G..G
............GGGGGGGG
....ooo.....GGGGEGGG
....ggg.....HHHSSHH
..oooooooo..HhSSSSS
..ogggggoo..HHSSkSSk
..GUUUUuGG..hHSSSSS.S
..GUUUEuGG..hHSSSSs
..GUUUUuGG....ssssss
..GUUUUuGG..QGGGGGG
..GUUUUuGGccCCCCCCC
..GUUUUuGGcQCCCCCCCQ
..GUUUUuGGcCGGCCCCCC
..GUUUUuGGcCCGCCCCCC
..GUUUUuGGcCCGGCCCCC
..GUUUUuGccCCCGGCCCC
..GUUUUuGccCCCCGGCCC
..GUUUUuGccCCCCCGCCC
..GUUUUuGccCCCCCGGCC
..GUUUUuGccCCCCCCGGC
..GUUUUuGccCCCCCCCGG
..GUUUUuGccCCCCCCCGCGQQQ
..GUUUUuGccCCCCCCCCGCCCCQ
..GUUUUuGccCCCCCCCCCCCCCC
..GUUUUuGUUcCCCCCCCCCCCCC
..GUUUUuGUUUccccccccCCCCC
..GoooooGUUUUUUUUUUUCCCCCo
..GGGGGGGGGGGGGGGGGGCCCCCG
..gGGGGGGGGGGGGGGGGQCCCCCG
..gggggggggggggggggCCCCCCg
....ggeeee.........CCCCCC.eeee
....gePPPPe........cccccccPPPPe
...eePPPPPP........GGGGGGGGPPPP
.eePqPPPPPPee.........gGGGGPPPPee
.PqPqPPPPPPqPe..eeeee.eeePPPPqPqPe
.PqPqPPPPPPqPPeePPPPPePPqPPPPqqqPq
.PPqqqqqqqPPPPqqPPPPPqPPqPPPqqqPPq
.qqqqqqqqqqPPPqqPPPPPqPPqqqqqqqqq
..qqqqqqqqqPqqqqPPqqPPqqqqqqq
.......qqqqqqqqqPqqqqqqqqqqqq
........qqqqqq.qqqqqqq.qqqq
..........qq....qqqqq
.
.
.
`, g2: `
.............G
.............G.G..G
............GGGGGGGG
....ooo.....GGGGEGGG
....ggg.....HHHSSHH
..oooooooo..HhSSSSS
..ogggggoo..HHSSkSSk
..GUUUUuGG..hHSSSSS.S
..GUUUEuGG..hHSSSSs
..GUUUUuGG....ssssss
..GUUUUuGG..QGGGGGG
..GUUUUuGGccCCCCCCC
..GUUUUuGGcQCCCCCCCQ
..GUUUUuGGcCGGCCCCCC
..GUUUUuGGcCCGCCCCCC
..GUUUUuGccCCGGCCCCC
..GUUUUuGccCCCGGCCCC
..GUUUUuGccCCCCGGCCC
..GUUUUuGccCCCCCGCCC
..GUUUUuGccCCCCCGGCC
..GUUUUuGccCCCCCCGGC
..GUUUUuGccCCCCCCCGG
..GUUUUucccCCCCCCCGCGQQQ
..GUUUUucccCCCCCCCCGCCCCQ
..GUUUUucccCCCCCCCCCCCCCC
..GUUUUuGUUcCCCCCCCCCCCCC
..GUUUUuGUUUccccccccCCCCC
..GoooooGUUUUUUUUUUUCCCCCo
..GGGGGGGGGGGGGGGGGGCCCCCG
..gGGGGGGGGGGGGGGGGQCCCCCG
..gggggggggggggggggCCCCCCg
....ggeeee.........CCCCCC.eeee
....gePPPPe........cccccccPPPPe
...eePPPPPP........GGGGGGGGPPPP
..ePqPPPPPPe..........gGGGGPPPPeee
.ePPqPPPPPPPee...eeee.eePPPPPqPqPPe
.PPPqPPPPPPPqP.eePPPPePqPPPPqqqqPPq
.qqqqqPPqqPPqPePqPPPPqPqPPPPqqqPPqq
..qqqqqqqqqPPqqPqPPPPqPPqqqqqqqqqq
...qqqqqqqqPPqqqPPqqPPPqqqqqq
......qqqqqqqq.qqqqqqqqqqqqq
.......qqqqqq..qqqqqqqqqqqq
..........q......qqqq
.
.
.
`, sh: [17, 14], hip: 98, ax: 17, ms: 1.5, mx: 20, my: 20, arm: ['P', 'q'], hand: 'S', wpn: 'cstaff', idle: { h: [3, 4], a: -75 }, float: 1 },
  skyemperor_b: {   // 시안 B 깃털 망토 여황제: 어깨에서 네 겹으로 늘어진 흰 깃털 망토(뾰족한 깃털 끝은 하늘빛) · 목까지 덮는 짙은 청보랏빛 긴 옷과 금 허리띠 · 옷단 금테 · 틀어 올린 검은 머리와 작은 관 · 흰 소매 · 깃털 지팡이
    pal: { G: '#e8c050', g: '#a88a2a', o: '#fff0a0', E: '#7ad8ff', e: '#ffffff', k: '#1a1420', S: '#f4d0b0', t: '#ffe6d0', s: '#c89270', H: '#3a2a48', h: '#1e1428', C: '#6e6cc8', Q: '#9c9aea', c: '#44428a', P: '#ffffff', q: '#c4d0e4', B: '#8cc4f4', b: '#4a88c8', r: '#e07a8a' },
    g: `
...................G
..............HHHGGGEG
.............HHhHHHHHH
.............HhHHHHSStH
..............HHHHSSSSt
................HHSSSSS
................HSSSkSk
................HSSSSS.S
.................sssssr
................PPGGGG
...........PPPPPPPPCCC
......PPPPPPPPPPPPPCCC
......PPPPPPPPPPPqCCCC
......PPPPPPPqPCCCCCCC
.....PPPPPPPPPPCCCCCCC
.....qPPqPPqPPqCCCCCCCQ
.....qPPqPPqPPqCCCCCCCC
....PqbPqbPqbPqCCCCCCCC
....bqPbqPbqPbqCCCCCCCC
....PqPPqPPqPPqGGGGGGGGG
....PPPPPPPPPPPGGGGGGGGG
....qPPqPPqPPqPCCCCCCCC
....qPPqPPqPPqPCCCCCCCC
...PqbPqbPqbPqbCCCCCCCCQ
...bqPbqPbqPbqPCCCCCCCCC
...PqPPqPPqPPqPCCCCCCCCC
...PPPPPPPPPPPQCCCCCCCCC
...qPPqPPqPPqPCCCCCCCCCC
...qPPqPPqPPqPCCCCCCCCCC
..PqbPqbPqbPqbCCCCCCCCCC
..bqPbqPbqPbqPCCCCCCCCCCQ
...qPPqPPqPPqPCCCCCCCCCCC
...PPPPPPPPPPPCCCCCCCCCCC
..PqPPqPPqPPqPCCCCCCCCCCC
..PqPPqPPqPPqPCCCCCCCCCCC
..PqbPqbPqbPqbCCCCCCCCCCC
..bq.bq.bq.bq.CCCCCCCCCCC
...q..q..q..q.CCCCCCCCCCCQ
..............CCCCCCCCCCCC
..............CCCCCCCCCCCC
..............CCCCCCCCCCCC
..............CCCCCCCCCCCC
..............CCCCCCCCCCCC
..............GGGGGGGGGGGGG
`, sh: [21, 13], hip: 20, ax: 20, ms: 1.5, mx: 20, my: 20, arm: ['P', 'q'], hand: 'S', wpn: 'fstaff', idle: { h: [3, 4], a: -75 } }
});
Object.assign(PXU_ACT, {
  cloudsheep: { atk: ['qcharge'], skl: ['qpounce'], tk: 1.0, fx: { atk: { pal: 'wind', hit: 'star' }, skl: { pal: 'wind', hit: 'quake', big: 1, after: 'motes' } } },
  skyray: { atk: ['bswoop'], skl: ['wspit'], tk: 1.0, fx: { atk: { pal: 'wind', hit: 'claw' }, skl: { pal: 'ice', hit: 'shatter', p: 'shard', big: 1, after: 'motes' } } },
  thunderbird: { mag: ['wspit'], atk: ['bswoop'], skl: ['wspit'], tk: 1.0, fx: { mag: { pal: 'bolt', hit: 'bolt', p: 'orb' }, atk: { pal: 'bolt', hit: 'claw' }, skl: { pal: 'bolt', hit: 'bolt', p: 'orb', big: 1, after: 'sparks' } } },
  pegasus: { atk: ['qcharge'], skl: ['qpounce'], tk: 0.95, fx: { atk: { pal: 'wind', hit: 'star' }, skl: { pal: 'wind', hit: 'claw', big: 1, after: 'feathers' } } },
  cloudgiant: { atk: ['side', 'down'], skl: ['smash'], tk: 1.25, fx: { atk: { pal: 'wind', hit: 'star', big: 1 }, skl: { pal: 'wind', hit: 'quake', big: 2, after: 'dust', shake: 2 } } },
  skyknight: { atk: ['thrust', 'side', 'down'], skl: ['pjump'], tk: 1.0, fx: { atk: { pal: 'wind', hit: 'slashes' }, skl: { pal: 'wind', hit: 'pierce', big: 1, after: 'feathers', shake: 2 } } },
  skytitan: { atk: ['side', 'down'], skl: ['smash'], tk: 1.3, fx: { atk: { pal: 'wind', hit: 'star', big: 1 }, skl: { pal: 'wind', hit: 'vortex', big: 2, after: 'dust', aoe: 'twister', shake: 3 } } },
  skyemperor: { mag: ['spush', 'sjab'], skl: ['scharge'], fx: { mag: { pal: 'light', hit: 'flash', p: 'orb' }, skl: { pal: 'gold', hit: 'star', big: 1, after: 'feathers', aoe: 'feathers', shake: 2 } } }
});
// 만날 때마다 모습 하나: 기본 모습이 아닌 것은 드랍 없는 이름표 (pxuLook) · PXU_ACT는 기본 id에만
pxuLook('cloudsheep_b', 'cloudsheep', MONS.cloudsheep.name);
pxuLook('skyray_b', 'skyray', MONS.skyray.name);
pxuLook('thunderbird_b', 'thunderbird', MONS.thunderbird.name);
pxuLook('pegasus_b', 'pegasus', MONS.pegasus.name);
pxuLook('cloudgiant_b', 'cloudgiant', MONS.cloudgiant.name); pxuLook('cloudgiant_c', 'cloudgiant', MONS.cloudgiant.name);
pxuLook('skyknight_b', 'skyknight', MONS.skyknight.name); pxuLook('skyknight_c', 'skyknight', MONS.skyknight.name);
pxuLook('skytitan_b', 'skytitan', MONS.skytitan.name); pxuLook('skytitan_c', 'skytitan', MONS.skytitan.name);
pxuLook('skyemperor_b', 'skyemperor', MONS.skyemperor.name);
Object.assign(PXU_SKIN, { cloudsheep: ['cloudsheep', 'cloudsheep_b'], skyray: ['skyray', 'skyray_b'], thunderbird: ['thunderbird', 'thunderbird_b'], pegasus: ['pegasus', 'pegasus_b'], cloudgiant: ['cloudgiant', 'cloudgiant_b', 'cloudgiant_c'], skyknight: ['skyknight', 'skyknight_b', 'skyknight_c'], skytitan: ['skytitan', 'skytitan_b', 'skytitan_c'], skyemperor: ['skyemperor', 'skyemperor_b'] });
Object.assign(PXU_SKIN_NAME, { cloudsheep: ['뭉게구름 양', '비구름 양'], skyray: ['하늘빛 만타', '구름 자락 가오리'], thunderbird: ['번개 꼬리 매', '구름 날개 두루미'], pegasus: ['흰 날개 말', '접은 날개 갈색 페가수스'], cloudgiant: ['구름 몸 거인', '기둥 거인', '하늘 농부 거인'], skyknight: ['날개 투구 창기사', '구름 망토 검사', '푸른 갑주 대검사'], skytitan: ['섬을 진 거인', '폭풍석 거인', '하얀 성채 거인'], skyemperor: ['구름 왕좌 황제', '깃털 망토 여황제'] });
