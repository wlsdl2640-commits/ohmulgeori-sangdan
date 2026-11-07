/* ───────── 메마른 땅 · 키메라 연구소 몬스터 (빌드 55 시안): 임프 · 헬하운드 · 트롤 · 오거 · 케르베로스 · 오거 대왕 · 키메라 ─────────
   그림체는 사용자가 고른 이끼 등 트롤과 같은 「뭉툭」: 큰 면 한 색 · 윗가장자리 빛 · 아래와 뒤 가장자리 그늘 · 부위마다 다른 글자(PX_FX가 선을 긋는다).
   사람꼴(트롤 · 오거 · 대왕)은 g2 없이 엔진 숨쉬기(cr)로 — lift로 만든 g2를 같이 쓰면 둘째 장에 가로 틈이 생긴다. */
// 메마른 땅 몬스터 무기 (빌드 55): 큰 몽둥이 · 못 박힌 큰 몽둥이 · 고기 칼 · 반달 큰 도끼 · 고기 뼈 몽둥이 · 큰 뼈 몽둥이
// 큰 몽둥이 (트롤 · 오거): 손잡이 · 끝으로 갈수록 굵어지는 옹이 진 통나무 (ms만큼 크게)
PXU_WPN.bclub = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -1.5; t <= 7 * k; t += 0.5) { const w = t < 2 ? 0.5 : 0.5 + (t - 2) / (7 * k - 2) * 1.6 * k; for (let s = -w; s <= w + 0.01; s += 0.5) at(t, s, s > w - 0.6 ? 'v' : 'V'); }
  at(4 * k, -1.4 * k, 'v'); at(5.6 * k, 1.9 * k, 'v');
  return out; };
PXU_FXW.bclub = 'great';
// 못 박힌 큰 몽둥이 (전쟁 트롤 · 오거 대왕): 큰 몽둥이에 쇠못
PXU_WPN.bnclub = (F, d) => { const out = PXU_WPN.bclub(F, d), [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, k = (d && d.ms) || 1;
  for (const [t, s] of [[4.2, -1.9], [5.2, 2.2], [6.2, -2.4], [6.8, 1.4], [3.6, 1.6]]) out.push([hx + dx * t * k + px * s * k, hy + dy * t * k + py * s * k, 'x']);
  return out; };
PXU_FXW.bnclub = 'great';
// 고기 칼 (백정 오거): 짧은 나무 손잡이 · 넓은 네모 날 · 날 끝에 핏자국
PXU_WPN.cleaver = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -1; t <= 1.5; t += 0.5) at(t * k, 0, 'v');
  for (let t = 2; t <= 6; t += 0.5) for (let s = 0; s <= 3; s += 0.5) at(t * k, s * k, s >= 2.5 ? (t > 4.5 ? 'R' : 'x') : 'M');
  return out; };
PXU_FXW.cleaver = 'great';
// 큰 도끼 (해골 왕관 오거 대왕): 긴 자루 · 한쪽으로 넓은 반달 날
PXU_WPN.baxe = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -2; t <= 7 * k; t += 0.5) at(t, 0, 'v');
  for (let t = 4 * k; t <= 7.4 * k; t += 0.5) { const u = (t - 5.7 * k) / (1.7 * k), w = 3.2 * k * Math.sqrt(Math.max(0, 1 - u * u)); for (let s = 0.5; s <= w; s += 0.5) at(t, s, s > w - 0.6 ? 'x' : 'M'); }
  return out; };
PXU_FXW.baxe = 'great';
// 고기 뼈 몽둥이 (이끼 등 트롤): 굵은 뼈 손잡이 끝에 붉은 고깃덩이
PXU_WPN.meatbone = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  at(-1.6, -0.6, 'J'); at(-1.6, 0.6, 'J'); for (let t = -1.2; t <= 2.2 * k; t += 0.5) at(t, 0, 'J');
  for (let t = 2.4 * k; t <= 6.4 * k; t += 0.5) { const u = (t - 4.4 * k) / (2 * k), w = 2 * k * Math.sqrt(Math.max(0, 1 - u * u)) + 0.3; for (let s = -w; s <= w + 0.01; s += 0.5) at(t, s, s > w - 0.6 ? 'r' : (t + s) % 2 < 1 ? 'R' : 'p'); }
  return out; };
PXU_FXW.meatbone = 'great';
// 큰 뼈 몽둥이 (짐승 해골 오거): 굵은 짐승 넓적다리뼈 · 끝에 둥근 마디 둘
PXU_WPN.boneclub = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  for (let t = -1.4; t <= 6.2 * k; t += 0.5) { const w = 0.6 + Math.max(0, t - 3 * k) / (3.2 * k) * 0.5; for (let s = -w; s <= w + 0.01; s += 0.5) at(t, s, s > w - 0.6 ? 'j' : 'J'); }
  for (const sg of [-1, 1]) { const tc = 6.7 * k, sc = sg * 1.05 * k, R = 1.25 * k; for (let u = -R; u <= R + 0.01; u += 0.5) for (let v = -R; v <= R + 0.01; v += 0.5) if (u * u + v * v <= R * R) at(tc + u, sc + v, u + v * sg > R * 0.5 ? 'j' : 'J'); }
  at(-1.8, -0.7, 'J'); at(-1.8, 0.7, 'J');
  return out; };
PXU_FXW.boneclub = 'great';
Object.assign(PXU, {
  imp: {   // 임프 B(기본): 붉은 두건 · 노란 눈과 이빨 · 산양처럼 말린 뿔 · 옹이 지팡이 끝 불씨 (사용자: 「두건임프에, 뿔 무양 시안」 → B·C)
    pal: { H: '#6a161c', L: '#8e262c', h: '#3a0a10', m: '#140406', K: '#140406', e: '#ffc020', w: '#ffffff', Z: '#2c2a32', z: '#9a96a2', k: '#2a0c0c', O: '#ffe27a', o: '#ff7a20', x: '#fff6c0', V: '#3a2a22', v: '#1e1410', C: '#c42a26', c: '#7e1418' },
    g: `
.
.....zZZ...ZZz
....zZ..Z.Z..Zz
...zZ.........Zz
...Z...........Z
...ZZ.........ZZ
....zZHHHHH..Zz
....HHLLHHHHH
...HLLHHHHHHHH
...HLHHmmmmmmHH
..HHHHmeKmKemmH
..HHHHmmmmmmmmH
..HHHHmwmwmwmmH
..HHHHHmmmmmmHH
.HHHHHHHHHHHHHHh
.HLHHHHHHHHHHHHh
HLHHHHHHHHHHHHHh
HLHHHHhHHHHHHHhh
LHHHHhHHHHHhHHHh
HhHHhHHHHhHHHHhh
.h.hh.hHHh.hh.h.h
........kk..kk
`, g2: `
.....zZZ...ZZz
....zZ..Z.Z..Zz
...zZ.........Zz
...Z...........Z
...ZZ.........ZZ
....zZHHHHH..Zz
....HHLLHHHHH
...HLLHHHHHHHH
...HLHHmmmmmmHH
..HHHHmeKmKemmH
..HHHHmmmmmmmmH
..HHHHmwmwmwmmH
..HHHHHmmmmmmHH
.
.HHHHHHHHHHHHHHh
.HLHHHHHHHHHHHHh
HLHHHHHHHHHHHHHh
HLHHHHhHHHHHHHhh
LHHHHhHHHHHhHHHh
HhHHhHHHHhHHHHhh
.h.hh.hHHh.hh.h.h
........kk..kk
`, sh: [13, 15], hip: 17, ax: 8, arm: ['H', 'h'], hand: 'C', wpn: 'gstaff', idle: { h: [3, 4], a: -75 } },
  imp_b: {   // 임프 C: 붉은 두건 · 뒤로 휜 긴 뿔
    pal: { H: '#6a161c', L: '#8e262c', h: '#3a0a10', m: '#140406', K: '#140406', e: '#ffc020', w: '#ffffff', Z: '#2c2a32', z: '#9a96a2', k: '#2a0c0c', O: '#ffe27a', o: '#ff7a20', x: '#fff6c0', V: '#3a2a22', v: '#1e1410', C: '#c42a26', c: '#7e1418' },
    g: `
.
zZZ
..zZZ.....zZZ
....zZ......zZ
.....zZ......zZ
......zZ......Z
......HZZHH..ZZ
....HHLLHHHHH
...HLLHHHHHHHH
...HLHHmmmmmmHH
..HHHHmeKmKemmH
..HHHHmmmmmmmmH
..HHHHmwmwmwmmH
..HHHHHmmmmmmHH
.HHHHHHHHHHHHHHh
.HLHHHHHHHHHHHHh
HLHHHHHHHHHHHHHh
HLHHHHhHHHHHHHhh
LHHHHhHHHHHhHHHh
HhHHhHHHHhHHHHhh
.h.hh.hHHh.hh.h.h
........kk..kk
`, g2: `
zZZ
..zZZ.....zZZ
....zZ......zZ
.....zZ......zZ
......zZ......Z
......HZZHH..ZZ
....HHLLHHHHH
...HLLHHHHHHHH
...HLHHmmmmmmHH
..HHHHmeKmKemmH
..HHHHmmmmmmmmH
..HHHHmwmwmwmmH
..HHHHHmmmmmmHH
.
.HHHHHHHHHHHHHHh
.HLHHHHHHHHHHHHh
HLHHHHHHHHHHHHHh
HLHHHHhHHHHHHHhh
LHHHHhHHHHHhHHHh
HhHHhHHHHhHHHHhh
.h.hh.hHHh.hh.h.h
........kk..kk
`, sh: [13, 15], hip: 17, ax: 8, arm: ['H', 'h'], hand: 'C', wpn: 'gstaff', idle: { h: [3, 4], a: -75 } },
  hellhound: {   // 헬하운드 3 썩은 하이에나(기본): 하이에나 몸 · 드러난 갈비 · 찢긴 귀 · 병든 초록 눈 · 꿰맨 목 · 늘어진 혀 · 연기 나는 갈기 (사용자: 「3, 4 가고 3에다 좀비 개 디자인 섞어서」)
    pal: { G: '#ffe27a', g: '#ff9a30', o: '#d8441a', Q: '#9a8a6a', C: '#6e604a', c: '#40362a', d: '#2a241a', h: '#a8602a', V: '#5a6a40', J: '#e4dcc4', k: '#2a1e18', e: '#b8ff50', X: '#4a8a20', K: '#140c08', w: '#f0e8d0', m: '#2a0a0a', R: '#c0506a' },
    g: `
.....................QQ...Q
..............hh.h..QCCQ.QCQ
...........h.hhhhhhhQCCCCCCCQ
.........hhhhhhhhhhhCCCCCCCCCc
.......hhhQCCCCCCCCCCCkCeXCCCC
.....hhQQCCdCCVVCCCCCCkCCCCCCCK
...QQQCCCCCVJkJkJkCCCkCCCCCCwmwm
..QQCCdCCCCVJkJkJkCCCCCCCCCwmmmm
.QCCCCCCCdCVJkJkJkCCCCCcCCwmwmw
QCCdCCCCCCCCVVVVCCCCCCcccccRR
cCCCCCCCdCCkCkCkCdCCCc.....RR
.cCCc....cCCCCCCcCJCc.......R
.cCc.....cCC...cCJc
.cCc....cCC....cJc
..cCc...cCc...cJc
.ccJJ..ccJJ..ccJJ
`, g2: `
.....................QQ...Q
...............h.h..QCCQ.QCQ
..............h.h.h.QCCCCCCCQ
.........hChChChChChCCCCCCCCCc
.......ChCQCCCCCCCCCCCkCeXCCCC
.....hCQQCCdCCVVCCCCCCkCCCCCCCK
...QQQCCCCCVJkJkJkCCCkCCCCCCwmwm
..QQCCdCCCCVJkJkJkCCCCCCCCCwmmmm
.QCCCCCCCdCVJkJkJkCCCCCcCCwmwmw
QCCdCCCCCCCCVVVVCCCCCCcccccRR
cCCCCCCCdCCkCkCkCdCCCc.....RR
.cCCc....cCCCCCCcCJCc.......R
.cCc.....cCC...cCJc
.cCc....cCC....cJc
..cCc...cCc...cJc
.ccJJ..ccJJ..ccJJ
`, gp: { bite: { y: 0, g: `
.
.
..............................K
..............................KK
..........C..................wmw
........C...................RRRR
...........................RRRRR
..........................RRRRR_
.
.
.
.
.
.
.
.
` } }, sh: [29, 6], hip: 8, ax: 16, still: 1, noArm: 1, wpn: 'none' },
  hellhound_b: {   // 헬하운드 4 가시 늑대: 검은 늑대 · 등을 따라 흰 뼈 가시 · 붉은 눈
    pal: { G: '#ffe27a', g: '#ff9a30', o: '#d8441a', Q: '#7a7480', C: '#4e4856', c: '#2c2832', z: '#f4ecdc', Z: '#c8bca6', e: '#ff3a2a', X: '#ffd24a', K: '#0a0608', w: '#fff4dc', m: '#3a0a10', N: '#5a5e68', x: '#d8dce4', M: '#8a8e98', n: '#4a4e58', J: '#d8d0c0', B: '#c8e0f0', R: '#c8302a' },
    g: `
..................ZZz
................zZZ..Z
...............zZ....Z
..............zZ.....Z
.................cQc..c
..........M..Q..cCCcQc
.........n..Q.QcCCCCCCc
........M..QCQCCCCCCeXCC
.......nQ.QCCCCCCCCCCCCCK
.....Q.QCCCCCCCCCCCCCCwmwmK
...Q.QCCCCCCCCCCCNNxNCmmmm
..QCQCCCCCCCCCCCCCNNCwmwmw
.QCCCCCCCCCCCCCCCCCCcc..B
QCCCCCCCCCCCCCCCCCCc....B
CcCCCCCCCCCCCCCCCCc
Cc.cCCc...cCCCc.cccc
c..cCc.....cCc...ccc
...cCc.....ccc...ccc
...cCc....ccc....ccc
..ccJJ...ccJJ...ccJJ
`, g2: `
..................ZZz
................zZZ..Z
...............zZ....Z
..............zZ.....Z
.................cQc..c
..........M..Q..cCCcQc
.........n..Q.QcCCCCCCc
........M..QCQCCCCCCeXCC
.......nQ.QCCCCCCCCCCCCCK
.....Q.QCCCCCCCCCCCCCCwmwmK
...Q.QCCCCCCCCCCCNNxNCmmmm
..QCQCCCCCCCCCCCCCNNCwmwmw
QCCCCCCCCCCCCCCCCCCCcc..B
CcCCCCCCCCCCCCCCCCCc....B
CcCCCCCCCCCCCCCCCCc
c..cCCc...cCCCc.cccc
...cCc.....cCc...ccc
...cCc.....ccc...ccc
...cCc....ccc....ccc
..ccJJ...ccJJ...ccJJ
`, gp: { bite: { y: 0, g: `
.
.
.
.
.........................K
........................KK
.......................wmw
......................RRRR
.....................RRRRR
....................RRRRR__
.....................w.w._
.....................cc___
...................c
..................c
................cc
.
.
.
.
.
` } }, sh: [26, 8], hip: 10, ax: 14, still: 1, noArm: 1, wpn: 'none' },
  troll: {   // 트롤 — 이끼 등 트롤(ms 1.25): 푸른 몸 · 산처럼 굽은 등에 이끼와 흰 서리꽃 · 앞으로 내민 머리 · 긴 귀 · 엄니 · 고기 뼈 몽둥이 (사용자: 「이끼등트롤만 적용」) · 사람꼴은 g2 없이 엔진 숨쉬기(cr)
    pal: { G: '#5a9a4a', g: '#3a6a30', w: '#f4f8ff', A: '#5a8aa0', a: '#3a6276', C: '#4e7a90', c: '#34566a', Q: '#76a0b4', S: '#86aabc', s: '#5a7e90', K: '#0e1418', m: '#1e1418', T: '#5a4030', t: '#3a2a1e', F: '#6a5040', f: '#44342a', k: '#141c20', J: '#ece4d0', R: '#c04a5a', r: '#7a2a34', p: '#e07a8a' },
    g: `
.....wGgwGw
...wGGggGGGGw
..GGggQcgggGGGw
.GGgQQCCQQcgggGG
GGgQCCCCCCCQQcggG
GgQCCCCCCCCCCCQcgg.a
gQCCCCCCCCCCCCCccAAAa
QCCCCCCCCCCCCCCcAaaaAa
CCCCCCCCCCCCCCcAaaaaAAa
CCCCCCCCCCCCCCcAAaKwaaaa
CCCCCCCCCCCCCCcAAaAasSSa
CCCCCCCCCCCCCCcAawaaassSs
CCCCCCCCCccccccaawwmmmmss
cCCCCCCCccccccccaaaaaaa
cCCCCCCCcSSSSScCQQQQcc
.cCCCCCcSSSSSSSCCCCcc
.cCCCcccsSSSSSsccccc
..CCCccccsssssccccc
..ccc.TTTTTTTTTTTT
..ccc.tttttttttttt
.SSSS..FFFFF..ccccc
.ssss..fffff..ccccc
......kkkkkk.kkkkkkk
`, sh: [20, 14], hip: 18, ax: 11, ms: 1.25, arm: ['C', 'c'], hand: 'S', wpn: 'meatbone', idle: { h: [3, 4], a: 45 } },
  ogre: {   // 오거 기본(ms 1.25): 성난 눈썹 · 아래턱 엄니 · 둥근 배 · 털가죽 허리옷 · 나무 몽둥이를 앞으로 비스듬히 (사용자: 「고른 오거 스타일을 기본으로 하나 더」 · 「왼팔은 백정오거 모양으로」)
    pal: { K: '#14100e', w: '#fffaf0', m: '#2a1414', k: '#1e1814', T: '#5a3c26', t: '#3a2616', F: '#7a5a3a', f: '#4e3820', U: '#ece6da', u: '#b4ac9e', H: '#2e2420', h: '#1a1412', J: '#ece4cc', j: '#b4aa8c', e: '#ffcc40', G: '#e8b838', g: '#a07a20', R: '#b02a2a', r: '#6e1616', M: '#9a9eaa', N: '#5e626e', n: '#3e424c', x: '#e0e4ec', v: '#6a4428', V: '#9a6a3c', d: '#6a3a2a', B: '#8a8e98', b: '#5a5e68', Z: '#8a8a90', z: '#5a5a60', L: '#a8a49a', l: '#6e6a62', C: '#b8865e', c: '#7a5434', Q: '#d6a67a', A: '#b07e58', a: '#72502f', S: '#e4bc92', s: '#a88460' },
    g: `
..............AAAAAa
.............AAAAAAAAa
............AaaaAAaaaAa
............aaaaAaaaaAa
............AaKwAAaKwAa
............AAAAAaSSSaa
...........AaAAAAassssa
...........awaaaaaaaawa
...QQQQQQQcawwmmmmmmwwa
...CCCCCCCCcaaaaaaaaaaQQc
..QCCCCCCCCCcccccccccQCCCc
..CCCCCCCCCcccccccccccCCc
..CCCCCCCCccSSSSSSSSSccCc
.QCCCCCCCCcSSSSSSSSSSScCc
.CCCCCCCCcSSSSSSSSSSSSSCc
.CCCCCCCCcSSSSSSSSSSSSSCc
.CCCCcCCCcsSSSSSSSSSSSsCc
.ccccccccccsSSSSSSSSSscc
.cccc.ccccccsssssssssccc
.SSSS.ttttttttttttttttt
.SSSS.fFffFFffFFfFFFfFf
.ssss..ffffff.ffffffff
.......cfQcfc..fQQcfQc
.......cccccc...cccccc
.......cccccc...cccccc
......kkkkkkk...kkkkkkk
`, sh: [24, 11], hip: 19, ax: 14, ms: 1.25, arm: ['C', 'c'], hand: 'S', wpn: 'bclub', idle: { h: [2, 3], a: -50 } },
  ogre_b: {   // 오거 2 두 머리 오거: 앞 머리는 성난 얼굴 · 뒤 머리는 작고 혀를 빼문 멍한 얼굴 · 못 박힌 몽둥이
    pal: { K: '#14100e', w: '#fffaf0', m: '#2a1414', k: '#1e1814', T: '#5a3c26', t: '#3a2616', F: '#7a5a3a', f: '#4e3820', U: '#ece6da', u: '#b4ac9e', H: '#2e2420', h: '#1a1412', J: '#ece4cc', j: '#b4aa8c', e: '#ffcc40', G: '#e8b838', g: '#a07a20', R: '#b02a2a', r: '#6e1616', M: '#9a9eaa', N: '#5e626e', n: '#3e424c', x: '#e0e4ec', v: '#6a4428', V: '#9a6a3c', d: '#6a3a2a', B: '#8a8e98', b: '#5a5e68', Z: '#8a8a90', z: '#5a5a60', L: '#a8a49a', l: '#6e6a62', C: '#a08c78', c: '#6a5a4c', Q: '#c0ac96', A: '#9a8470', a: '#62544a', S: '#d4c2aa', s: '#a8947c' },
    g: `
................AAAAAa
...............AAAAAAAAa
.......HH.....AaaaAAaaaAa
......hhhh....aaaaAaaaaAa
.....AAAAAa...AaKwAAaKwAa
....AaaAAAAa..AAAAAaSSSaa
....aKwAAaaa.AaAAAAassssa
....AAAAaKwacawaaaaaaaawa
...cAAaassAacawwmmmmmmwwa
...caammmmAaCcaaaaaaaaaaQc
..QCcaaaRRaQCcccccccQQQQCcc
..CCCQQcRrQcccccccccccCCCc
..CCCCCcrQCccSSSSSSSccCCc
.QCCCcCCQCcSSSSSSSSSSScCc
.CCCCcCCCCcSSSSSSSSSSScCc
.CCCc.CCCcsSSSSSSSSSSSsc
.CCCc.CCCCcSSSSSSSSSSSQc
.cccc.cccccssSSSSSSSsscc
.cccc.cccccccssssssscccc
.SSSS.tttttttttttttttttc
.SSSS.fFffFFffFFfFFFfFf
.ssss..ffffff.ffffffff
.......cfQcfc..fQQcfQc
.......cccccc...cccccc
.......cccccc...cccccc
......kkkkkkk...kkkkkkk
`, sh: [24, 11], hip: 19, ax: 14, ms: 1.25, arm: ['C', 'c'], hand: 'S', wpn: 'bnclub', idle: { h: [2, 3], a: -76 } },
  ogre_c: {   // 오거 4 짐승 해골 오거: 뿔 달린 짐승 해골 · 눈구멍 속 노란 눈 · 어깨를 두른 늑대 털 · 뼈 목걸이 · 큰 뼈 몽둥이
    pal: { K: '#14100e', w: '#fffaf0', m: '#2a1414', k: '#1e1814', T: '#5a3c26', t: '#3a2616', F: '#7a5a3a', f: '#4e3820', U: '#ece6da', u: '#b4ac9e', H: '#2e2420', h: '#1a1412', J: '#ece4cc', j: '#b4aa8c', e: '#ffcc40', G: '#e8b838', g: '#a07a20', R: '#b02a2a', r: '#6e1616', M: '#9a9eaa', N: '#5e626e', n: '#3e424c', x: '#e0e4ec', v: '#6a4428', V: '#9a6a3c', d: '#5a3624', B: '#7c7682', b: '#4e4856', Z: '#8a8a90', z: '#5a5a60', L: '#a8a49a', l: '#6e6a62', C: '#8e5c40', c: '#5a3624', Q: '#b07a58', A: '#86543a', a: '#523020', S: '#c4936c', s: '#9a6a4c' },
    g: `
.........jJ..........Jj
..........jJ........Jj
...........jJJJJJJJJJ
............JjjJJJjjJ
............JKeJJJKeJ
............jKKJJJKKJJ
.............jjjjjjjjj
.............aAAAAAAAa
............awaaaaaaawa
.........BBBawwmmmmmwwa
...cBBBBBBBBBaaaaaaaaaB
...bBBBBBBBBBBBBBBBBBBBb
..QcbBBbBBBbBBBBBBBbbBBc
..cbcBbcbBbjbbbbbbbjcBbc
..CQcbQCcbccSjSsSjSSSbcCc
.QCCCQCCCQcSSSSjSSSSSScCc
.CCCCCCCCcSSSSSSSSSSSSSCc
.CCCCCCCCcSSSSSSSSSSSSSCc
.CCCCcCCCcsSSSSSSSSSSSscc
.ccccccccccsSSSSSSSSSscc
.cccc.ccccccssssssssscc
.SSSS.ttttttttttttttttt
.SSSS..QQcFFFFFFFFQQQc
.ssss..CCcFFFFFFFFCCCc
.......CCcfFFFFFFfCCCc
.......ccccffffffccccc
.......cccccc...cccccc
......kkkkkkk...kkkkkkk
`, sh: [23, 13], hip: 21, ax: 14, ms: 1.25, arm: ['C', 'c'], hand: 'S', wpn: 'boneclub', idle: { h: [2, 3], a: -76 } },
  ogre_d: {   // 오거 6 백정 오거: 꿰맨 대머리 · 찡그린 한쪽 눈 · 피 묻은 앞치마 · 고기 칼
    pal: { K: '#14100e', w: '#fffaf0', m: '#2a1414', k: '#1e1814', T: '#5a3c26', t: '#3a2616', F: '#7a5a3a', f: '#4e3820', U: '#ece6da', u: '#b4ac9e', H: '#2e2420', h: '#1a1412', J: '#ece4cc', j: '#b4aa8c', e: '#ffcc40', G: '#e8b838', g: '#a07a20', R: '#b02a2a', r: '#6e1616', M: '#9a9eaa', N: '#5e626e', n: '#3e424c', x: '#e0e4ec', v: '#6a4428', V: '#9a6a3c', d: '#9a6458', B: '#8a8e98', b: '#5a5e68', Z: '#8a8a90', z: '#5a5a60', L: '#a8a49a', l: '#6e6a62', C: '#d8a090', c: '#9a6458', Q: '#f0bcac', A: '#d09888', a: '#905c52', S: '#f6d0c2', s: '#c49a8e' },
    g: `
..............AaAAAa
.............AakaAAAAa
............AAAakaAAAAa
............AaaAakAaaaa
............aaaAAAaaaaa
............aKwAAAakkaa
............AAAAAAaSSSa
...........AAaaaaaasssa
.......QQQcaawmmmmmmwAa
....QQQCCCccaaaaaaaaaa
....CCCCCCcUUUUUUUUcQc
...QCCCCCcUUUUUUUUUUcc
...CCCCCCcUUUUUUUUUUcCc
...CCCCCCcUUUUUuuUUUUcc
..QCCCCCcUUUUUUrRUUUUcCc
..CCCCCCcUUUUUUUrUUUUUcc
..CCCCCccUUUUUUUUUUuUUcc
..CCCCCcuuuuuuuuuuuruuUc
.QCCCCctttttttttttttttU
.cccccccUUUUuUUUUUUUUUU
.cccccccUUUUruUUUUUUUuU
.SSSS..cuUUUURUUUUuUUru
.sSSS..CcUUUUrUUUUruuU
..sss..CcUUUUUUUUUUrrU
.......Ccuuuuuuuuuuuuu
.......cccccc..cccccc
.......cccccc..cccccc
......kkkkkkk..kkkkkkk
`, sh: [22, 11], hip: 22, ax: 13, ms: 1.25, arm: ['C', 'c'], hand: 'S', wpn: 'cleaver', idle: { h: [2, 3], a: -70 } },
  cerberus: {   // 케르베로스 1-A 푸른 가시 등(ms 1.5): 세 머리 · 등을 따라 흰 뼈 가시 줄 · 목 털갈기 · 세 갈래 가시 꼬리 (사용자: 「1로가자」)
    pal: { S: '#c8d8ec', Q: '#7a88a8', C: '#4e5a78', c: '#2c3448', A: '#465270', a: '#283044', F: '#3a4460', f: '#1e2434', e: '#ff3a2a', X: '#ffd0d0', K: '#0a0c12', w: '#ffffff', R: '#d83040', x: '#c8d8ec' },
    g: `
.x.x
x.S.x
.SSS.....................f..f
..C...............x.....fFffFf
..C...........x..xSx..x.fFFFFFFf
...C......x..xSxxSSSxxSfFFeXFFFFK
...C.....xSxxSSSx...xSSFFFFFFwawwa
....Q.x.xSSSx.......QCCFFFFRRaAaaAa
....QxSx.QQQQQQQQQQQQQQQfFFFwaAAAAAAa
.....Q.QQQQQQQCCCCCCCCCCCfffaAAeXAAAAK
......QQQQQQCCCCCCCCCCCCCCCCAAAAAAwwww
.....QQQQQQCCCCCCCCCCCCCCCCcAAcARRRRR
.....cQQQCCCCCCCCCCCCCCCCCcQccQcAwwww
.....cQQCCCCCCCCCCCCCCCCCCcCCCCCCca
.....cCCCCCCCCCCCCCCCCCCCcCCeXCCCCK
......cCCCCCCcccccccccCCCCCCCCCwwww
......cCCCCCcFFc....FFcccCCCCRRRRR
......cCCCCc.cFFc...cFFccccCCCwwww
.....cCCCCc..cFFc...cFFccccccccc
.....cCCCc....cFc....cFccccc
......cCCc....cFc....cFc.cccc
......cCCc....cFc....cFc.cccc
.....cCCCc...cFFc...cFFc.ccccc
....cxxxxc..cxxxc..cxxxc.cxxxxc
`, g2: `
..x.x
.x.S.x
..SSS....................f..f
...C..............x.....fFffFf
...C..........x..xSx..x.fFFFFFFf
....C.....x..xSxxSSSxxSfFFeXFFFFK
...C.....xSxxSSSx...xSSFFFFFFwawwa
....Q.x.xSSSx.......QCCFFFFRRaAaaAa
....QxSx.QQQQQQQQQQQQQQQfFFFwaAAAAAAa
.....Q.QQQQQQQCCCCCCCCCCCfffaAAeXAAAAK
......QQQQQQCCCCCCCCCCCCCCCCAAAAAAwwww
.....QQQQQQCCCCCCCCCCCCCCCCcAAcARRRRR
.....cQQQCCCCCCCCCCCCCCCCCcQccQcAwwww
.....cQQCCCCCCCCCCCCCCCCCCcCCCCCCca
.....cCCCCCCCCCCCCCCCCCCCcCCeXCCCCK
......cCCCCCCcccccccccCCCCCCCCCwwww
......cCCCCCcFFc....FFcccCCCCRRRRR
......cCCCCc.cFFc...cFFccccCCCwwww
.....cCCCCc..cFFc...cFFccccccccc
.....cCCCc....cFc....cFccccc
......cCCc....cFc....cFc.cccc
......cCCc....cFc....cFc.cccc
.....cCCCc...cFFc...cFFc.ccccc
....cxxxxc..cxxxc..cxxxc.cxxxxc
`, gp: { bite: { y: 0, g: `
.
.
.
.
.
.
.....................................K
....................................KK
...................................www
..................................RRRR
.................................RRRRR
..................................K
.................................KK
................................www
...............................RRRR
..............................RRRRR
.
.
.
.
.
.
.
.
.
` } }, sh: [36, 10], hip: 12, ax: 19, ms: 1.5, still: 1, noArm: 1, wpn: 'none' },
  ogreking: {   // 오거 대왕 1 왕관 대왕(ms 1.5): 보석 금관 · 턱 밑 흰 털 깃 · 땅까지 끌리는 붉은 망토 · 금 띠 · 못 박힌 큰 몽둥이 (사용자: 「오거대왕 123 다좋아」)
    pal: { K: '#14100e', w: '#fffaf0', m: '#2a1414', k: '#1e1814', T: '#5a3c26', t: '#3a2616', F: '#7a5a3a', f: '#4e3820', U: '#f2ece0', u: '#bcb2a2', H: '#2e2420', h: '#1a1412', J: '#ece4cc', j: '#b4aa8c', e: '#ffcc40', G: '#f0c040', g: '#a07a20', R: '#b8283a', r: '#741626', M: '#9a9eaa', N: '#5e626e', n: '#3e424c', x: '#e0e4ec', v: '#6a4428', V: '#9a6a3c', d: '#6a3a2a', B: '#2c50c8', b: '#1a3080', Z: '#8a8a90', z: '#5a5a60', L: '#a8a49a', l: '#6e6a62', C: '#b8865e', c: '#7a5434', Q: '#d6a67a', A: '#b07e58', a: '#72502f', S: '#e4bc92', s: '#a88460' },
    g: `
......................G..G..G..G..G
......................GG.GG.G.GG.GG
......................GgGGGgGGGgGGg
......................GrGGGbGGGbGGr
......................ggggggggggggg
......................AAAAAAAAAAAAa
......................AaaaaAAAAaaaaa
......................aaaaaAAAaaaaaa
......................AAaKwAAAAaKwAa
......................AAAAAAAAaSSSaa
.....................AAAAAAAAAaSSSSa
.....................AaaAAAAAAassssa
..................QQcawwaaaaaaaaawwa
........UUuQc.QQQQCCcawwwmmmmmmmmwwa
.....uuuuuQCCcccccccccaAAAAAAAAAAAac
....uRRRRQCCCccccccccccaaaaaaaaaaacc
.....RRRRCCCcUuUUuUUuUUuUUuUUuUUuUUc
.....RRRrCCCcukuukuukUUkUUkUukuukuuc
....RRRRQCCCCQQQQQccuuuuuuuuSSScccQc
....RRRRCCCCCCCCCCcSSSSSSSSSSSSSScCc
....RRRRCCCCCCCCCcSSSSSSSSSSSSSSSSCCc
....RRRRCCCCCCCCCcSSSSSSSSSSSSSSSSCCc
....RRRrCCCCCCCCCcSSSSSSSSSSSSSSSSCCc
...RRRRQCCCCCCCCCcSSSSSSSSSSSSSSSSCCc
...RRRRCcccCcCCCCcSSSSSSSSSSSSSSSSCc
...RRRRcccccccCCCcsSSSSSSSSSSSSSSscc
...RRRRcSSScRccccccssSSSSSSSSSSsscc
...RRRRSSSSSRrcccccccssssssssssccc
..RRRRRsSSSsRGGGGGGGGGGggrggGGGGGGGG
..RRRRRRsssRRggggggggggggggggggggggg
..RRRRRRRRRRRRRfFfFFFfFFFfFFFfFFFf
..RRRRRRRRRRRRRcfffffffffffffffff
..RRRRRRRRRRRRRCcfQQcf...fQQcfQQcf
.RRRRRRRRRRRRRRccccccc....ccccccc
.rrrrrrrrrrrrrrccccccc....ccccccc
..............kkkkkkkk....kkkkkkkk
`, sh: [36, 16], hip: 27, ax: 24, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'bnclub', idle: { h: [2, 3], a: -76 } },
  ogreking_b: {   // 오거 대왕 2 두 머리 대왕: 앞 머리 큰 금관 · 뒤 머리 작은 금관과 늘어진 혀
    pal: { K: '#14100e', w: '#fffaf0', m: '#2a1414', k: '#1e1814', T: '#5a3c26', t: '#3a2616', F: '#7a5a3a', f: '#4e3820', U: '#f2ece0', u: '#bcb2a2', H: '#2e2420', h: '#1a1412', J: '#ece4cc', j: '#b4aa8c', e: '#ffcc40', G: '#f0c040', g: '#a07a20', R: '#b8283a', r: '#741626', M: '#9a9eaa', N: '#5e626e', n: '#3e424c', x: '#e0e4ec', v: '#6a4428', V: '#9a6a3c', d: '#6a3a2a', B: '#2c50c8', b: '#1a3080', Z: '#8a8a90', z: '#5a5a60', L: '#a8a49a', l: '#6e6a62', C: '#a08c78', c: '#6a5a4c', Q: '#c0ac96', A: '#9a8470', a: '#62544a', S: '#d4c2aa', s: '#a8947c' },
    g: `
.....................G..G..G..G..G
.....................GG.GG.G.GG.GG
.....................GgGGGgGGGgGGg
.......G.G.G.G.......GrGGGbGGGbGGr
.......GgGgGgG.......ggggggggggggg
.......GrGbGrG.......AAAAAAAAAAAAa
.......ggggggg.......AaaaaAAAAaaaaa
.......AAAAAAa.......aaaaaAAAaaaaaa
......AaaAAAAAa......AAaKwAAAAaKwAa
......aKwAAAaaAa.....AAAAAAAAaSSSaa
......AAAAAaKwAa....AAAAAAAAAaSSSSa
......AAAaasssAa....AaaAAAAAAassssa
......aAammmmmAaQQQcawwaaaaaaaaawwa
.......aaaaRRaaQCCCcawwwmmmmmmmmwwa
......QQQccRrccccccccaAAAAAAAAAAAa
.....QCCCccrccccccccccaaaaaaaaaaa
.....CCCcUuUUuUUuUUuUUuUUuUUuUUuU
.....CCCcukuukuukUUkUUkUUkuukuuku
....QCCCCQQQQQccuuuuuuuuuuScccQQc
....CCCCCCCCCCcSSSSSSSSSSSSSScCCc
....CCCCCCCCCcSSSSSSSSSSSSSSSSCCCc
....CCCCCCCCCcSSSSSSSSSSSSSSSSCCCc
....CCCCCCCCCcSSSSSSSSSSSSSSSSCCCc
...QCCCCcCCCCcSSSSSSSSSSSSSSSSCCCc
...CcccCccCCCcSSSSSSSSSSSSSSSSCCc
...ccccc.ccCCcsSSSSSSSSSSSSSSsCcc
...cSSSc..cccccssSSSSSSSSSSssccc
...SSSSS...ccccccsssssssssscccc
...sSSSs.GGGGGGGGGGGGggrggGGGGGGGG
....sss..ggggggggggggggggggggggggg
...........cfFfFFFfFFFfFFFfFFFf
...........Ccfffffffffffffffff
...........CCcfQQcf...fQQcfQc.f
...........ccccccc....ccccccc
...........ccccccc....ccccccc
..........kkkkkkkk....kkkkkkkk
`, sh: [33, 16], hip: 27, ax: 21, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'bnclub', idle: { h: [2, 3], a: -76 } },
  ogreking_c: {   // 오거 대왕 3 해골 대왕: 더 큰 뿔 해골 위 이빨 왕관 · 등까지 덮은 늑대 털 · 해골 목걸이 · 반달 큰 도끼
    pal: { K: '#14100e', w: '#fffaf0', m: '#2a1414', k: '#1e1814', T: '#5a3c26', t: '#3a2616', F: '#7a5a3a', f: '#4e3820', U: '#f2ece0', u: '#bcb2a2', H: '#2e2420', h: '#1a1412', J: '#ece4cc', j: '#b4aa8c', e: '#ffcc40', G: '#f0c040', g: '#a07a20', R: '#b02a2a', r: '#6e1616', M: '#9a9eaa', N: '#5e626e', n: '#3e424c', x: '#e0e4ec', v: '#6a4428', V: '#9a6a3c', d: '#5a3624', B: '#6e6874', b: '#46404c', Z: '#8a8a90', z: '#5a5a60', L: '#a8a49a', l: '#6e6a62', C: '#8e5c40', c: '#5a3624', Q: '#b07a58', A: '#86543a', a: '#523020', S: '#c4936c', s: '#9a6a4c' },
    g: `
............JJ..................JJ
............jJJ................JJj
.............jJJ..J.J.J.J.J.J.JJj
..............jJJJJJJJJJJJJJJJJj
...............JJJJJJJJJJJJJJJJ
...............JJjjjJJJJJJjjjJJJ
...............JJKKeJJJJJJKKeJJJ
...............jJKKKJJjJjJKKKJJJ
................jJJJJJjJjJJJJJJj
................jjjjjjjjjjjjjjjj
.................aaAAAAAAAAAAAa
................awwaaaaaaaaaaawwa
................awwwmmmmmmmmmwwwa
..........Qc.BBBBaaaaaaaaaaaaaaac
.......BbQcBBBBBBBBBBBBBBBBBBBBBBBc
....BBBBQCcbbBBBBBBBBBBBBBBBBBBBbbc
....BBBBCCCccBBbBBbBbBBbBBbBbBBbccc
....BBBbCCcbcBbcbbcbcBbcbBcbcbbcbBc
....BBBQCCCQcbQCcjccSbjJjbSsSjcccbc
...BBBBCCCCCCQCCCcSjSjKJKjSjSSSScQc
...BBBBCCCCCCCCCcSSSSSJjJSSSSSSSSCCc
...BBBBCCCCCCCCCcSSSSSjSjSSSSSSSSCCc
...BBBbCCCCCCCCCcSSSSSSSSSSSSSSSSCCc
...BBBQCCCCCCCCCcSSSSSSSSSSSSSSSSCCc
...BBBCcccCcCCCCcSSSSSSSSSSSSSSSSCc
...BBBcccccccCCCcsSSSSSSSSSSSSSSscc
...BBBcSSScBccccccssSSSSSSSSSSsscc
...BBBSSSSSBbcccccccssssssssssccc
..BBBBsSSSsBTTTTTTTTTTJJJJTTTTTTTTT
..BBBBBsssBBttttttttttjjjjttttttttt
..BBBBBBBbbbbbfFfFFFfFFFfFFFfFFFf
..BbBBbBb.....cfffffffffffffffff
..b.bb.b.bb.b.bbfQQcf...fQQcfQQcf
..b..b...b..b.ccccccc....ccccccc
..............ccccccc....ccccccc
.............kkkkkkkk....kkkkkkkk
`, sh: [35, 16], hip: 28, ax: 23, ms: 1.5, arm: ['C', 'c'], hand: 'S', wpn: 'baxe', idle: { h: [2, 3], a: -76 } },
  chimera: {   // 키메라 1-E(ms 1.5, 키메라 연구소 두목): 금빛 사자 · 붉은 갈기 · 흰 염소 · 초록 뱀 꼬리 — 서 있는 동안 염소가 2초마다 앞을 봤다 뒤(뱀 쪽)를 봤다 하고, 뒤를 볼 때 뱀이 혀를 날름 (ifr 0.5 · 사용자: 「염소가 앞을 봤다, 뒤를 봤다 하게」)
    pal: { K: '#140c08', k: '#24180e', w: '#fff4dc', m: '#2a1010', e: '#ffd040', R: '#e03040', r: '#8a1a22', u: '#b8b0a2', f: '#5a4434', C: '#d8a040', c: '#946420', Q: '#f0c868', A: '#e4b452', a: '#a8782c', S: '#f2dca0', s: '#c4a870', H: '#b0461e', h: '#6e2810', U: '#f0ebe0', J: '#e8dcc0', j: '#a08a64', Z: '#5aa040', z: '#2e6a24' },
    g: `
.
.........Z.......JJJJJ
.......ZZzzZ.....JjjjjJJ
.....ZZZZeKzZ...JJ....jjUUU.....H..H
....ZZZzzzz.z...jJJ..UUUUuuU.hHHHHHH..h
...ZZzz..........jJ..UUUUeKUUKHHHHHHHH
...ZZ.............j.UUUUUUUUUUHHHHHHHHh
..ZZZ...............UUUUuuuuuuHHHHHHHhAAAA
..ZZz...............UUUU..HuuHHHHHHHhAAAAAAA
.ZZZ................UUUU.HHuHHHHHHHHAAaaaAAAA
.ZZZ................UUUUhHHuHHHHHHHHAAaaaAAAAA
.zZZZ..............UUUUU.HHHHHHHHHHHAAAeKAaaaa
..ZZZ..............UUUUuHHHHHHHHHHHHAAAAAaSSSSK
..zZZZ..........QQQUUUUhhHHHHHHHHHHHAAAAAsssssK
...ZZZZZ....QQQQCCCuUUucQHHHHHHHHHHHaAAAAmmmmmm
...zZZZZZZ.QCCCCCCCQuuQcCHHHHHHHHHHHHaAAAwSSSw
....zzZZZZQCCCCCCCCCQQChChHHHHHHHHHHHHaaaasss
......zzzzCCCCCCCCCCCCCQcQHHHHHHHHHHHHHH
........QQCCCCCCCCCCCCCCcChHHHHHHHHHHHHh
.......cCCCCCCCCCCCCCCCChCQhHHHHHHHHHHh
.......cCCCCCCCccccccccccccQhhHHHHHHhh
........cCCCCCccccccccccccccQQhhhhhh
........cCCCCCcSSSSSSSSSSShcccQQQQQ
.........CCCCcssSSSSSSSSSSssccCCCCC
.........CCCCcccssssssssssccc.CCCCC
.........CCCC.cccc.......cccc.CCCCC
.........CCCCQcccc........cccccCCCC
.........CCcCcccccc.......cccccCCcC
.........ccccc.cccc.......cccc.cccc
.........cccccccccccc.....ccccccccccc
.........kkkkkkkkkkkk.....kkkkkkkkkkk
`, g2: `
.....................J
.........Z.........JJjJJJ
.......ZZzzZ....UUJjj.jJJ
.....ZZZZeKzZ.uRuujU...JJj......H..H
....ZZZzzzz.zRRuKeUUU..JJ....HHHHHHH..h
...ZZzz......UURUUUUU.jjj...HHHHHHHHHH
...ZZ........uuuUUUUU......HHHHHHHHHHHh
..ZZZ.........uuuUUUU....hHHHHHHHHHHHhAAAA
..ZZz..........u.uUUUU....HHHHHHHHHHhAAAAAAA
.ZZZ...........u..UUUU...HHHHHHHHHHHAAaaaAAAA
.ZZZ..............UUUU..hHHHHHHHHHHHAAaaaAAAAA
.zZZZ.............UUUU...HHHHHHHHHHHAAAeKAaaaa
..ZZZ.............uUUUU.HHHHHHHHHHHHAAAAAaSSSSK
..zZZZ..........QQQUUUUhhHHHHHHHHHHHAAAAAsssssK
...ZZZZZ....QQQQCCCuUUucQHHHHHHHHHHHaAAAAmmmmmm
...zZZZZZZ.QCCCCCCCQuuQcCHHHHHHHHHHHHaAAAwSSSw
....zzZZZZQCCCCCCCCCQQChChHHHHHHHHHHHHaaaasss
......zzzzCCCCCCCCCCCCCQcQHHHHHHHHHHHHHH
........QQCCCCCCCCCCCCCCcChHHHHHHHHHHHHh
.......cCCCCCCCCCCCCCCCChCQhHHHHHHHHHHh
.......cCCCCCCCccccccccccccQhhHHHHHHhh
........cCCCCCccccccccccccccQQhhhhhh
........cCCCCCcSSSSSSSSSSShcccQQQQQ
.........CCCCcssSSSSSSSSSSssccCCCCC
.........CCCCcccssssssssssccc.CCCCC
.........CCCC.cccc.......cccc.CCCCC
.........CCCCQcccc........cccccCCCC
.........CCcCcccccc.......cccccCCcC
.........ccccc.cccc.......cccc.cccc
.........cccccccccccc.....ccccccccccc
.........kkkkkkkkkkkk.....kkkkkkkkkkk
`, gp: { bite: { y: 14, g: `
....................................A....w....w
....................................aA...mmRRmm
.....................................AAAAmmmmmm
.....................................aAAAwSSSw
......................................aaaasss
` } }, sh: [45, 14], hip: 21, ax: 22, ms: 1.5, noArm: 1, still: 1, wpn: 'none', ifr: 0.5 }
});
// 키메라 불길 숨결: 몸을 웅크려 숨을 모았다가 입을 벌리고 앞으로 내민 채 불길을 뿜는다 (맞히는 장 4 · 광역기 breath)
PXU_MOT.cbreath = [
  { h: [1, 0], a: 0 },
  { h: [1, 0], a: 0, cr: 1, dx: -1 },
  { h: [1, 0], a: 0, cr: 1, dx: -1.5, fx: { k: 'gather', r: 1 } },
  { h: [1, 0], a: 0, dx: -1, fx: { k: 'gather', r: 2 } },
  { h: [2, 0], a: 0, dx: 1, body: 'bite', fx: { k: 'cast', r: 2 } },
  { h: [2, 0], a: 0, dx: 1, body: 'bite' },
  { h: [1, 0], a: 0, dx: 1, body: 'bite' },
  { h: [1, 0], a: 0 }
];
Object.assign(PXS_MOT_TT, { cbreath: [0.06, 0.08, 0.1, 0.1, 0.08, 0.16, 0.14, 0.06] });
Object.assign(PXU_ACT, {
  imp: { mag: ['spush', 'sjab', 'spushup'], skl: ['scharge'], tk: 0.95, fx: { mag: { pal: 'fire', hit: 'burst', p: 'orb' }, skl: { pal: 'fire', hit: 'burst', big: 1, after: 'embers' } } },
  hellhound: { atk: ['qbite', 'qpounce'], skl: ['qmaul'], fx: { atk: { pal: 'fire', hit: 'bite' }, skl: { pal: 'fire', hit: 'claw', big: 1, after: 'embers' } } },
  troll: { atk: ['side', 'down'], skl: ['smash'], tk: 1.2, fx: { atk: { pal: 'earth', hit: 'star', big: 1 }, skl: { pal: 'earth', hit: 'quake', big: 1, after: 'dust', shake: 3 } } },
  ogre: { atk: ['side', 'down'], skl: ['smash'], tk: 1.15, fx: { atk: { pal: 'earth', hit: 'star', big: 1 }, skl: { pal: 'earth', hit: 'quake', big: 2, after: 'dust', shake: 3 } } },
  cerberus: { atk: ['qbite', 'qpounce'], skl: ['qmaul'], tk: 1.2, fx: { atk: { pal: 'fire', hit: 'bite', big: 1 }, skl: { pal: 'fire', hit: 'claw', big: 2, after: 'embers', shake: 3 } } },
  ogreking: { atk: ['side', 'down'], skl: ['smash'], tk: 1.25, fx: { atk: { pal: 'earth', hit: 'star', big: 2 }, skl: { pal: 'earth', hit: 'quake', big: 2, after: 'dust', aoe: 'rocks', shake: 4 } } },
  chimera: { atk: ['qbite', 'qpounce'], skl: ['cbreath'], tk: 1.3, fx: { atk: { pal: 'fire', hit: 'bite', big: 1 }, skl: { pal: 'fire', hit: 'burst', big: 2, after: 'embers', aoe: 'breath', shake: 3 } } }
});
// 만날 때마다 모습 하나: 기본 모습이 아닌 것은 드랍 없는 이름표 (pxuLook) · PXU_ACT는 기본 id에만
pxuLook('imp_b', 'imp', MONS.imp.name);
pxuLook('hellhound_b', 'hellhound', MONS.hellhound.name);
pxuLook('ogre_b', 'ogre', MONS.ogre.name); pxuLook('ogre_c', 'ogre', MONS.ogre.name); pxuLook('ogre_d', 'ogre', MONS.ogre.name);
pxuLook('ogreking_b', 'ogreking', MONS.ogreking.name); pxuLook('ogreking_c', 'ogreking', MONS.ogreking.name);
Object.assign(PXU_SKIN, { imp: ['imp', 'imp_b'], hellhound: ['hellhound', 'hellhound_b'], ogre: ['ogre', 'ogre_b', 'ogre_c', 'ogre_d'], ogreking: ['ogreking', 'ogreking_b', 'ogreking_c'] });
Object.assign(PXU_SKIN_NAME, { imp: ['말린 뿔 임프', '긴 뿔 임프'], hellhound: ['썩은 하이에나', '가시 늑대'], ogre: ['오거', '두 머리 오거', '짐승 해골 오거', '백정 오거'], ogreking: ['왕관 쓴 대왕', '두 머리 대왕', '해골 대왕'] });
