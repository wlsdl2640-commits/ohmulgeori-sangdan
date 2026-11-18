/* ───────── 하르겐 지하 「지하미궁 통로」 · 「암살자 길드 본부」 몬스터 (빌드 70 시안 · 11-18 09:05 · 09:19 사용자가 고른 모습): 쥐인간 금고털이 A · 사람 사냥꾼 B(사슬잡이 — 사슬 손질) · 형제단 사냥개 A · 밀수꾼 A · 그림자 분신 B(누런 매연) · 조직 두목 쥐 기수 A · 붉은 장갑 사냥꾼 B · 장부지기 A · 길드장 검은 두건 A(B · C는 패턴) ─────────
   그림체는 빌드 55~61과 같은 「뭉툭」(큰 면 한 색 · 윗가장자리 빛 · 아래 그늘 · 부위마다 다른 글자로 PX_FX가 선을 긋는다).
   원본은 tools/saved/mon70 (g/aq3.py · g/pass4.py 시안 도구 → t/*.json → emitunder70.py) — 손으로 고치지 말고 다시 뽑는다. */
// 새 무기 (빌드 70 시안)
// 쇠지레 (쥐인간 금고털이 A): 끝이 꺾인 쇠막대
PXU_WPN.crowbar = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 5.5 * k, o = L - 5.5;
  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);
  for (let t = -1.5; t <= L; t += 0.5) at(t, 0, t < -1.5 + 0.6 ? 'g' : 'N');
  for (const [t, s, ch] of [[7.0,-1.0,'N'],[7.0,0.0,'N'],[6.0,0.0,'N']]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);
  return out; };
PXU_FXW.crowbar = 'club';
// 쇠공 사슬 (사슬잡이): 정면 고리 · 옆 고리가 번갈아 처지는 사슬 + 끝의 무거운 쇠공 (가시 없음 · 위 빛 · 아래 그늘)
PXU_WPN.chainball = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  const L = 7.2 * k, ring = (t, s) => { for (const [a, b] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) at(t + a * 0.8, s + b * 0.8, a + b <= -1 && b <= 0 ? 'x' : a + b >= 1 ? 'n' : 'N'); };
  for (let t = 1.2, i = 0; t <= L - 2.0; t += 1.25, i++) { const s = Math.sin(t / L * Math.PI) * 1.0; if (i % 2 === 0) ring(t, s); else at(t, s, 'n'); }   // 구멍 난 고리 · 이음 고리 번갈아 (가운데가 처진다)
  for (let a = -2.0; a <= 2.0; a += 0.45) for (let b = -2.0; b <= 2.0; b += 0.45) { const q = a * a + b * b; if (q > 4.0) continue; at(L + 0.6 + a, b, a < -0.6 && b < -0.4 && q < 2.6 ? 'x' : a > 0.8 || b > 1.1 ? 'n' : 'N'); }   // 무거운 쇠공
  return out; };
PXU_FXW.chainball = 'club';
// 짐 갈고리 (밀수꾼 A): 짧은 자루 끝의 휜 쇠갈고리
PXU_WPN.chook = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 2.5 * k, o = L - 2.5;
  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);
  for (let t = -1.0; t <= L; t += 0.5) at(t, 0, t < -1.0 + 0.6 ? 'g' : 'b');
  for (const [t, s, ch] of [[6.0,-1.0,'N'],[6.0,0.0,'N'],[5.0,1.0,'N'],[4.0,1.0,'N'],[3.0,0.0,'N'],[3.0,1.0,'N']]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);
  return out; };
PXU_FXW.chook = 'dagger';
// 깃발 단 왕홀 창 (쥐 기수 두목): 금빛 창날 · 쥐의 왕관 붉은 작은 깃발
PXU_WPN.ratlance = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 8.5 * k, o = L - 8.5;
  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);
  for (let t = -4.0; t <= L; t += 0.5) at(t, 0, t < -4.0 + 0.6 ? 'g' : 'g');
  for (const [t, s, ch] of [[14.0,0.0,'x'],[13.0,-1.0,'x'],[13.0,0.0,'M'],[13.0,1.0,'x'],[12.0,-1.0,'x'],[12.0,0.0,'M'],[12.0,1.0,'x'],[11.0,0.0,'M'],[11.0,1.0,'R'],[11.0,2.0,'R'],[10.0,0.0,'M'],[10.0,1.0,'R'],[10.0,2.0,'R'],[9.0,0.0,'M']]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);
  return out; };
PXU_FXW.ratlance = 'lance';
// 사람 잡는 갈래창 (붉은 장갑 사냥꾼): 목을 걸어 잡는 U자 쇠 갈래 (가운데 날 없음)
PXU_WPN.mancatch = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 8.5 * k, o = L - 8.5;
  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);
  for (let t = -4.0; t <= L; t += 0.5) at(t, 0, t < -4.0 + 0.6 ? 'g' : 'j');
  for (const [t, s, ch] of [[13.0,-2.0,'N'],[13.0,2.0,'N'],[12.0,-2.0,'N'],[12.0,2.0,'N'],[11.0,-2.0,'x'],[11.0,2.0,'x'],[10.0,-1.0,'N'],[10.0,1.0,'N'],[9.0,0.0,'N']]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);
  return out; };
PXU_FXW.mancatch = 'lance';
// 등불 지팡이 (장부지기): 긴 지팡이 끝에 매단 놋쇠 등불
PXU_WPN.lanternst = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = 8.0 * k, o = L - 8.0;
  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);
  for (let t = -4.0; t <= L; t += 0.5) at(t, 0, t < -4.0 + 0.6 ? 'g' : 'b');
  for (const [t, s, ch] of [[12.5,-1.0,'N'],[12.5,0.0,'N'],[12.5,1.0,'N'],[11.5,-1.0,'N'],[11.5,0.0,'Y'],[11.5,1.0,'N'],[10.5,-1.0,'N'],[10.5,0.0,'Y'],[10.5,1.0,'N'],[9.5,-1.0,'N'],[9.5,0.0,'N'],[9.5,1.0,'N'],[8.5,0.0,'N']]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);
  return out; };
PXU_FXW.lanternst = 'staff';
Object.assign(PXU, {
  ratburglar: {   // 시안 A 고글 금고털이 (사용자가 고른 것): 쥐의 왕관 조합원 · 갈색 쥐인간이 구부정하게 선다 · 이마에 올린 놋쇠 고글과 눈에 내린 확대 알 · 가죽 조끼와 연장 고리 달린 앞치마 · 허리 주머니 · 쇠지레로 내리친다
    pal: { F: '#8a7a68', f: '#5e5044', O: '#d8a0a0', K: '#140c0c', C: '#6a4a30', c: '#46301e', A: '#8a6a44', a: '#5e4630', B: '#3a2a1e', b: '#2a1e14', G: '#d8b040', L: '#9ad8f0', P: '#3e3a44', p: '#2a262e', k: '#1a1418', t: '#c89a8a', N: '#8a9098', n: '#565c64', w: '#ffffff' },
    g: `
...............FFFF
.............ffFOOF
.............ffGGOF
.............fGGGOF
..............GGLFFGF
..............FFFbGLLb
..............FFFFGLLFFF
..............FFFFFFFFFFFFff
..............FFFFFFFFFFffO
...............FFFFF....fff
............CCCCCcc.....w.ff
...........fCCCCCFFF
...........CCCCCCFFF
..........fCCCCCCFFF
..........CCCCCCCFFF
..........CCCCCCCFFF
.........fCCCCCCccFFC
.........bbbBBBBBBBBBB
.........bbbAAAAAAAAc
.........bbbAAaAaaaaA
.........bbbAAaAaaaaA
.......ttt.CAAaAaaaaA
......ttt..cAAAAAAAAA
.....ttt...pAAAAAAAAA
.....tt....pAAAAAAAAA
....tt.....ppp.PPPP
...tt......ppp.PPPP
...t.......ppp.PPPP
...t.......ppp.PPPP
..tt.......kkkkkkkkkk
..tt.......kkkkkkkkkk
....t......kkkkkkkkkk
`, sh: [18, 12], hip: 21, ax: 14, ms: 1.0, arm: ['C', 'c'], hand: 'F', wpn: 'crowbar', idle: { h: [2, 2], a: -40 } },
  manhunter: {   // 시안 B 사슬잡이 (사용자가 고른 것): 붉은 손 형제단의 사람 사냥꾼 · 민머리 · 덥수룩한 검은 수염 · 눈썹의 흉터 · 털 어깨 덮개 · 앞 어깨에서 먼 허리로 감은 굵은 고리 사슬(구멍 난 고리 · 이음 고리)과 허리에 늘어진 사슬 · 붉게 물든 팔 · 처지는 사슬 끝의 쇠공을 휘두른다
    pal: { S: '#c89070', s: '#9a6a4e', k: '#1a1210', R: '#b02a2a', r: '#701a1a', Y: '#7a6a58', y: '#54483c', C: '#4a3a30', c: '#30261e', N: '#8a9098', n: '#4a5058', x: '#d8dce4', B: '#2e2420', P: '#3e3630', p: '#2a2420', K: '#1a1418', b: '#3a2a20' },
    g: `
...............SSSSSS
..............SSSSSrS
..............SSSSSrS
..............SSssSSrS
..............SSbbbbbS
..............SSbbbbb
..............SSbbbbb
...........YYYYSbbbbb
..........YYYYYYYbYYY
..........YYYYYYYYYnx
..........yyyyyyyynnxx
..........CCCCCCCnxNC
..........CCCCCCnCxxC
.........SCCCCCnxnCCC
.........SCCCCnCCxCCC
.........SCCCnNnNCCCC
..........BBnBBxBBBBB
..........BnNnNBBBBxB
..........nCCxCCCNxxC
..........cnNccccnnNc
...........pppp.PNxx
...........pppp.PnPN
...........pppp.PPNx
...........pppp.PPnx
...........pppp.PPnnN
...........pppp.PPP
...........pppp.PPP
...........KKKKKKKKKK
...........KKKKKKKKKK
...........KKKKKKKKKK
`, sh: [18, 9], hip: 18, ax: 15, ms: 1.0, arm: ['S', 'R'], hand: 'R', wpn: 'chainball', idle: { h: [2, 2], a: 40 } },
  huntdog: {   // 시안 A 쇠가시 목줄 사냥개 (사용자가 고른 것): 붉은 손 형제단이 부리는 먹빛 큰 사냥개 · 각진 큰 머리와 처진 볼 · 짧게 자른 귀 · 쇠가시 목줄과 붉은 천 · 주황 눈 · 물어뜯고 덮친다
    pal: { C: '#3a3030', Q: '#5a4c48', c: '#241c1c', d: '#140e0e', M: '#6a5a52', e: '#ffb030', k: '#0a0606', w: '#ffffff', R: '#b02a2a', r: '#701a1a', N: '#8a9098', n: '#565c64', x: '#c8ccd4', T: '#d06a6a' },
    g: `
.
.
.........................QcQQQ
........................QCccCCQ
....Q...................nNCCddd
....C..............QQQQxxNCCCeeQQkk
....C........QQQQQQCCCCCCNNCCMMMMkk
....CQ....QQQCCCCCCCCCCCCNNCCMMMMCC
....cCQ..QCCCCCCCCCCCCCCCNNCCCCcccc
.....cCQQCCCCCCCCCCCCCCCCNRcccc
......ccCCCCCCCCCCCCCCCCCNRr
........CCCCCCCCCCCCCCCCCCRr
........cCCCCCCCCCCCCCCCCCR
.........cCCCCCCCCCCCCCCCc
.........ccCCCCCCCcCCCCCC
.........ccCCCcccc.ccccCC
.........ccCCC.......ccCC
.........ccCCc.......ccCC
.........ccCC........ccCC
.........ccCC........ccCC
.........ccCC........ccCC
..........cCCQ.......ccCCQ
..........cccc........cccc
`, g2: `
.
.
..........................c
........................QQccQQQ
........................CNCCCCC
...cQ...............QQQ.xNCCddd
....C.............QQCCCQCNNCCeeMMkk
....CQ.....QQQQQQQCCCCCCCNNCCMMMMCC
....cCQ...QCCCCCCCCCCCCxxNNCCCMMCCC
.....cCQ.QCCCCCCCCCCCCCCCNNCCCCcccc
......ccQCCCCCCCCCCCCCCCCNRRccc
........CCCCCCCCCCCCCCCCCCRr
........cCCCCCCCCCCCCCCCCCRr
.........cCCCCCCCCCCCCCCCC
.........ccCCCCCCCCCCCCCCc
.........ccCCCcccccccccCC
.........ccCCC.......ccCC
.........ccCCc.......ccCC
.........ccCC........ccCC
.........ccCC........ccCC
.........ccCC........ccCC
..........cCCQ.......ccCCQ
..........cccc........cccc
`, gm: { bite: `
.
.
.........................QcQQQ
........................QCccCCQ
....Q...................nNCCddd
....C..............QQQQxxNCCCeeQQkk
....C........QQQQQQCCCCCCNNCCMMMMkk
....CQ....QQQCCCCCCCCCCCCNNCCMMMMCC
....cCQ..QCCCCCCCCCCCCCCCNNCCCwkwcc
.....cCQQCCCCCCCCCCCCCCCCNRcccTTQ
......ccCCCCCCCCCCCCCCCCCNRr....c
........CCCCCCCCCCCCCCCCCCRr
........cCCCCCCCCCCCCCCCCCR
.........cCCCCCCCCCCCCCCCc
.........ccCCCCCCCcCCCCCC
.........ccCCCcccc.ccccCC
.........ccCCC.......ccCC
.........ccCCc.......ccCC
.........ccCC........ccCC
.........ccCC........ccCC
.........ccCC........ccCC
..........cCCQ.......ccCCQ
..........cccc........cccc
`, leap: `
...........................QcQQQ
..........................QCccCCQ
...................QQQQQ..nNCCddd
.............QQQQQQCCCCCQxxNCCCeeQQk
..........QQQCCCCCCCCCCCCQCNNCCMMMMk
.cQQ.....QCCCCCCCCCCCCCCCCCNNCCMMMMC
..ccQQQQQCCCCCCCCCCCCCCCCCCNNCCCwkwc
....ccccCCCCCCCCCCCCCCCCCCcNRcccTTQ
........CCCCCCCCCCCCCCCCCC.NRr....c
........cCCCCCCCCCCCCCCCCC..Rr
........ccCCCCCCCCCCCCCCCCQ.R
........ccCCCCCCCCcCCCCccCC
........ccCCCccccc.ccccccCCQ
.......cccCCC..........cccCC
.......cc.CCc..........cc.CCc
.......cc.CC...........cc.CC
.......cc.CC...........cc.CC
.......ccQCC...........ccQCC
.......ccCCC...........ccCCC
......cccCCc..........cccCCc
......cc.CC...........cc.CC
......cc.CCQ..........cc.CCQ
.......c.ccc...........c.ccc
` }, sh: [33, 7], hip: 99, ax: 18, wpn: 'none', still: 1, noArm: 1 },
  smuggler: {   // 시안 A 짐짝 밀수꾼 (사용자가 고른 것): 잿빛 장부의 밀수꾼 · 잿빛 두건 망토와 코까지 가린 천 · 등에 멘 나무 짐짝(가로 널) · 허리에 단 작은 등불 · 짧은 짐 갈고리로 걸어 당긴다 · 훔친 금화를 던진다
    pal: { S: '#c89a78', s: '#9a6e52', k: '#141010', H: '#6a6a6e', h: '#46464c', D: '#8a8a8e', C: '#5a4636', c: '#3a2c22', J: '#9a7448', j: '#6a4e2e', b: '#3a2a1e', N: '#6a6e76', n: '#3e424a', Y: '#ffd060', P: '#3e3a3e', p: '#2a262a', K: '#1a1418' },
    g: `
...............HHHHH
.............HHHHHHHH
.............HHHHHHHH
.............HHSSSSSS
.............HHSSSSkk
.............HHSssSSDD
............HHHSDDDDDD
....jjjjjjjjHHHSDDDDDD
....jJJJJJJj.HHSDDDDDD
....jJJJJJJj.H.SSSSSS
....jJJJJJHhhhhhhhhh
....jjjjjjHCCCCCCCCCb
....jJJJJJHCCCCCCCCbH
....jJJJJJHCCCCCCCbCH
....jjjjjjHCCCCCCbCCH
....jJJJJJHCCCCCbCCCH
....jJJJJJHCCCCbCCCCH
....jJJJJJHCCCbCCCCCH
....jjjjjHHCCbCCCCCCH
.........Hbbbbbbbbbbb
.........HbbbbbbbbbNb
.........HHcccccccNNN
.........HHHHHHHHHNYN
.........HHHHHHHHHNYN
.........hhhhhhhhhNNNh
...........pppp.PPP
...........pppp.PPP
...........pppp.PPP
...........pppp.PPP
...........KKKKKKKKKK
...........KKKKKKKKKK
...........KKKKKKKKKK
`, sh: [18, 11], hip: 20, ax: 15, ms: 1.0, arm: ['H', 'h'], hand: 'S', wpn: 'chook', idle: { h: [2, 2], a: 45 } },
  shadeclone: {   // 시안 B 누런 매연 그림자 (사용자가 고른 것): 길드장이 부려 놓은 그림자 분신 · 누렇게 찌든 매연 덩이 사람꼴 · 머리 뒤로 매연 기둥이 길게 날린다 · 속에서 깜빡이는 불티 · 주홍 두 눈 · 끝이 달아오른 매연 단검
    pal: { W: '#7a6e4e', w: '#4c4430', V: '#9c9068', u: '#2a261a', d: '#16120c', e: '#ff6a2a', O: '#ffa040', o: '#c05a1a', M: '#3a3426', N: '#5a5038', x: '#ffb050' },
    g: `
..Wu.Wu.Wu
..uuuwwWVVu
.....uuVVwVWWu
.......uuOwVwu.WWu
.........uwwwwWVVwu
..........uuuwVwwwu
....uu.......wwwwwwu
............Wwwwwwwwu
...........WVwwwwdddu
...........Vwwwwwdede
...........wwwwuudddu
..........Wwwwu
.........WVwwu...WWWu
........uVwwwu...VVVwu
.........wwwwu..Wwwwwu
.........wwwwwWOVwwwu
.........wwwwVVVVwou
.........wwwVwwwwwwwu
.........wwwwwwwwwwu
.........uuwwOwwwwuu
...........wwwwwwu....uu
..........WwwwwwVVV
.........WVwwwwVwowu
.........wwwwwwwwwwu
.........uwwwwwuwwu
..........uOwwu.uu
...........wwwwu
...........wwwwu
...........uwwwu.....uu
............wwu
...........Wwou
...........Vwwu
............wu
............wwu
............uuu
.
............Wu
............u
.
.
.
`, sh: [19, 14], hip: 23, ax: 15, ms: 1.0, arm: ['W', 'w'], hand: 'w', wpn: 'dagger', wmap: { M: 'u', N: 'w', x: 'x' }, idle: { h: [2, 2], a: 30 }, float: 1 },
  ratcrown: {   // 시안 A 쥐 기수 두목 (사용자가 고른 것): 쥐의 왕관 두목 · 붉은 안장을 얹은 큰 쥐를 탄 잿빛 쥐인간 · 비스듬히 얹은 도둑맞은 금관 · 훔친 보랏빛 외투와 털 깃 · 고삐 · 쥐의 왕관 붉은 깃발 단 금빛 왕홀 창으로 찌르고 쥐 떼를 부른다
    pal: { F: '#7a6a5a', f: '#4e4236', O: '#d8a0a0', e: '#ff4a3a', t: '#c8949a', H: '#5e5e66', h: '#3e3e46', R: '#9a2a34', G: '#e0b040', g: '#a8802a', r: '#d02a3a', U: '#5a2a6a', u: '#3a1a46', Y: '#c8a070', P: '#3a3236', K: '#1a1416', k: '#140c0c', w: '#ffffff', M: '#e0c060', x: '#fff0b0' },
    g: `
......................HH
.................G.hHHHHH
.................GGGHHHHHH
................GGGGHHOOHH
.................gGGHHOOHH
..................hhHHHHHH
...................hHHHHHHHH
...................HHHHHHHHH
..................HHHHHHHHeeHH
..................HHHHHHHHeeHHHH
..................HHHHHHHHHHHHHHHH..hh
...................HHHHHHHHHHHHHhhhh
...................HHHHHHHHHHHHHhHOO
.....................HHHHHH......hhh
.................YYYYYYYYYY.....w...hh
.................YYYYYYYYYY
.................YYYYYYYYYY
.................UUUUUUUUUG
.................UUUUUUUUUG
.................UUUUUUUUUG
................uUUUUUUUUUG
................uUUUUUUUUUG
................uUUUUUUUUUG
.................UUUUUUUUUG
.................UUUUUUUUUG
.................UUUUUUUUUG..........FFFF
.................uUUUUPPPUG.......ffFFFFF
..................UUUPPPPPP.......ffFFOOFF
...............GGGuuuPPPPPPPG.....ffFFOOFF
...............RRRRRRRRPPPPPkk....ffFFOOFF
...............RRRRRRRRRRPPPR.kk...fFFFFFFF
.............FFRRRRRRRRRRPPPRFF.kk.FFFFFFFFF
...........FFFFFRRRRRRRRRPPPFFFFF.kkFFFFFFeeFF
.........FFFFFFFFRRRRRRRRPPPFFFFFFFFkkFFFFeeFFFF
.........FFFFFFFFRRRRRRRRKKKKKFFFFFFFFFFFFFFFFFFFF.ff
........FFFFFFFFFGGGGGGGGKKKKKFFFFFFFFFFFFFFFFFFfffO
......ttFFFFFFFFFFFFFFFFFKKKKKFFFFFFFFFFFFFFFFFFf.OO
....ttttfFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF.......ff
...ttttttfFFFFFFFFFFFFFFFFFFFFFFFFFFFF.........w...ff
...ttt....fFFFFFFFFFFFFFFFFFFFFFFffFFFF
..ttt......ffFFFFFFFFFFFFFFFFFFffffFFFF
.ttt.......ffffFFFFFFFFFFFFfffffff.FFFF
.tt........fff.FFFfffffffff....fff.fFFF
.tt........fff.FFF.............fff..FFF
..t........fff.FFFF............fff..FFFF
..tt.......fff.Ffff............fff..Ffff
....ttt....fffffOOOO...........ffff.fOOOO
............ff..ff..............ff...ff
`, sh: [25, 16], hip: 27, ax: 26, ms: 1.5, mx: 20, my: 20, arm: ['U', 'u'], hand: 'H', wpn: 'ratlance', idle: { h: [1, 4], a: -70 } },
  redhand: {   // 시안 B 붉은 장갑 사냥꾼 (사용자가 고른 것): 붉은 손 형제단 두목 · 털 테 두른 두건과 입을 가린 천 · 털 어깨 망토 · 무릎 위 검붉은 사냥 외투와 긴 장화 · 붉은 장갑 · 허리의 상아 뿔피리 · 사람의 목을 걸어 잡는 U자 갈래창으로 찌르고 걸어 넘어뜨린다
    pal: { C: '#6a2a26', c: '#461a18', Q: '#8a3a34', S: '#d0a080', s: '#a07858', k: '#140c0c', D: '#2e2626', Y: '#8a7058', y: '#5e4a3a', J: '#6a4a30', j: '#46301e', W: '#e8e0d0', w: '#b8b0a0', r: '#d03030', B: '#2e2420', P: '#3a3236', p: '#2a2428', K: '#1a1416' },
    g: `
......................CCCCCCC
.....................CCCCCCCCC
....................CCCCCCCCCC
...................CCCCCCCCCCCC
...................CCCCCCCCCCCC
...................CCCCYYYYYYYYY
...................CCCCYSSSsssS
...................CCCCYSSSkkSS
..................CCCCCYSSSSSSS
..................CCCCCYDDDDDDD
..................CCCCCYDDDDDDD
...................CCCCYDDDDDDS
...................CCCCYDDDDDDS
.............YYYYYYYYYSSDDDSSSYYYYY
.............YYyyYYYyYYYYyYYYYyYYYyY
.............YYcccYYyYYYYyYYYYyYYYyY
.............YYcccYYyYYYYyYYYYyYYYyY
.............YccccYYyYYYYyYYYYyYYYyY
.............YccccCYyYYYYyCCYyYYYyYY
..............cccCCCCCYCCCCCCCCYCC
.............ccccCCCCCCCCCCCCCCCCC
.............ccccCCCCCCCCCCCCCCCCC
.............ccccCCCCCCCCCCCCCCCCC
.............ccccCCCCCCCCCCCCCCCCCQ
.............ccccCCCCCCCCCCCCCCCCCC
..............cccBBBBBBBBBBBBBBBBBB
..............crrjjBjjBBBBBBBBBWWBB
..............crrjjCjjCCCCCCCCCwwwW
..............CCjjjCjjCCCCCCCCCCCCwW
..............CCCCCCCCCCCCCCCCCCCCWW
..............CCCCCCCCccccccCCCCCCC
..............CCCCCCCC......CCCCCCC
..............CCCCCCCC......cCCCCCC
.............QCCCCCCCcp..PPPPCCCCCC
.............ccCCCCCCpp..PPPPCCCCCc
...............ccccCCpp..PPPPcCccc
.................ppccpp..PPPPPc
.................pppppp..PPPPPP
.................pppppp..PPPPPP
.................pppppp..PPPPPP
.................pppppp..PPPPPP
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
`, sh: [32, 17], hip: 33, ax: 24, ms: 1.5, mx: 20, my: 20, arm: ['C', 'c'], hand: 'r', wpn: 'mancatch', idle: { h: [1, 4], a: -72 } },
  greyledger: {   // 시안 A 장부지기 (사용자가 고른 것): 잿빛 장부 두목 · 벗어진 머리와 흰 구레나룻 · 둥근 안경 · 털 깃 단 잿빛 긴 외투와 금단추 · 먼 손목에 사슬로 맨 큰 잿빛 장부(놋쇠 모서리 · 잠금쇠) · 놋쇠 등불 지팡이로 찌르고 금화를 쏟아붓는다
    pal: { C: '#5e5e66', c: '#3e3e46', Q: '#7e7e88', Y: '#ffd060', y: '#8a867e', S: '#d8b098', s: '#a88068', W: '#e8e4dc', w: '#b8b4ac', G: '#d8b040', g: '#9a7a28', L: '#46464c', l: '#2e2e34', N: '#a08850', b: '#3a2a20', n: '#565c64', k: '#140c0c', P: '#3a3a40', K: '#1a1418', V: '#b8b4ac', v: '#8a867e' },
    g: `
......................SSSSSSSS
.....................SSSSSSSSSS
.....................SSSSSSSSSS
.....................SSSSSSSSSS
.....................WWWSSGSSGS
.....................WWWWSSGGSSS
.....................WWWWSSSSSSS
.....................WWWWSSSSSS
.....................WWWWSSSSSS
.....................WWWWSsssss
.....................WWWWSSSSSS
.............VVVVVVVVSSSSSSSSSVVVVVV
.............VVVVVVVVVVVVVVVVVVVVVVV
.............VVVVVVVVVVVVVVVVVVVVVVV
............cVVVVVVVVVVVVVVVVVVVVVVV
............cvvvvvvvvvvvvvvvvvvvvvvv
...........cccccCCCCCCCCCCCCCCCcCCC
...........cccccCCCCCCCCCCCCCCCcCCC
.....GllllcccccCCCCCCCCCCCCCCCCcCCC
.....lLLLLcccccCCCCCCCCCCCCCCCGcCCC
.....lLLLLccccCCCCCCCCCCCCCCCCCcCCC
.....lLLLLccccCCCCCCCCCCCCCCCCCcCCC
.....lLLLLccccCCCCCCCCCCCCCCCCCcCCC
.....lLLGGcccccCCCCCCCCCCCCCCCGcCCC
.....lLLGGccSScCCCCCCCCCCCCCCCCcCCCQ
.....lLLGGLcSScCCCCCCCCCCCCCCCCCcCCC
.....lLLLLLLGCCCCCCCCCCCCCCCCCCCcCCC
.....lLLLLLLnCCCCCCCCCCCCCCCCCGCcCCC
.....lLLLLLLGCCCCCCCCCCCCCCCCCCCcCCC
.....lLLLLLLnCCCCCCCCCCCCCCCCCCCcCCC
.....lLLLLLLCCCCCCCCCCCCCCCCCCCCcCCC
.....GllllllCCCCCCCCCCCCCCCCCCCCcCCC
............CCCCCCCCCCCCCCCCCCCCcCCC
............CCCCCCCCCCCCCCCCCCCCcCCC
............CCCCCCCCCCCCCCCCCCCCcCCC
............CCCCCCCCCCCCCCCCCCCCcCCC
............CCCCCCCCCCCCCCCCCCCCcCCC
............CCCCCCCCCCCCCCCCCCCCcCCCQ
............CCCCCCCCCCCCCCCCCCCCcCCCC
............CCCCCCCCCCCCCCCCCCCCcCCCC
...........cccccccccccccccccccccccccc
.................pppppp..PPPPPP
.................pppppp..PPPPPP
.................pppppp..PPPPPP
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
................KKKKKKKKKKKKKKKKKKK
`, sh: [33, 16], hip: 32, ax: 24, ms: 1.5, mx: 20, my: 20, arm: ['C', 'c'], hand: 'S', wpn: 'lanternst', idle: { h: [1, 4], a: -72 } },
  guildmaster: {   // 시안 A 검은 두건 (본체 · 확정) (사용자가 고른 것): 암살자 길드 본부의 진짜 길드장 · 얼굴을 삼킨 큰 검은 두건 속 붉은 두 눈 · 붉은 안감이 펄럭이는 긴 검은 외투 · 던지는 칼을 꽂은 비스듬한 띠 · 은빛 둥근 길드 문장 · 발밑 그림자 자락 · 물결 단검
    pal: { H: '#1e1a26', h: '#100e16', C: '#24202c', c: '#14121a', Q: '#3a3446', K: '#06050a', e: '#ff3a3a', r: '#8a1a24', R: '#b02a36', M: '#c8ccd8', x: '#f4f6fa', N: '#8a90a0', G: '#d8b040', g: '#9a7a28', P: '#1c1a22', p: '#121016', k: '#0a080c', S: '#c8a080', W: '#4e4e54', w: '#2c2c32', V: '#727278', u: '#141418', d: '#0a0a0c', T: '#6ad050', t: '#3a8a30', Y: '#b8f070', b: '#6a4a30', a: '#4c4430', A: '#7a6e4e', z: '#2a261a', O: '#9c9068' },
    g: `
......................HHhHHHHH
....................HHHhHHHHHHH
...................HHhhHHHHHHHH
..................HHhHHHHHHHHHH
.................HHHHHHHKKKKKKK
..................HHHHHKKKKKKKK
...................HHHHKKKKKKKK
....................HHHKKKeKKeK
....................HHHKKKKKKKK
....................HHHKKKKKKKK
....................HHHKKKKKKKK
....................HHHHKKKKKKK
.....................HHHHHHHHHH
......................HHHHHHHH
................ccQQQQQQQQQQQQQQQQ
..............QcccCCCCCCCCCCCCCCCr
..............CcccCCCCCCCCCCCMCcCr
.............QccccCCCCCCCCCCMCcCCr
.............CccccCCCCCCCCCCcCCCCr
.............CcccCCCCCCCMMMCCCCCCCr
.............ccccCCCCCCCMxMcCCCCCCr
............QccccCCCCCCCMCcCCCCCCCr
............CccccCCCCCCCcCCCCCCCCCr
............CccccCCCCCCcCCCCCCCCCCr
............CccccCCCCMcCCCCCCCCCCCr
...........QCCcccCCCCMCCCCCCCCCCCCr
...........CCCccccCCCcCCCCCCCCCCCCr
...........CCCcKKcCcCCCCCCCCCCCCCCr
...........CCCCKKCCCCCCCCCCCCCCCCCr
..........QCCCCCCCCCCCCCCCCCCCCCCCr
..........CCCCCCCCCCCCCCCCCCCCCCCCr
..........CCCCCCCCCCCCCCCCCCCCCCCCr
..........CCCCCCCCCCCCccccccCCCCCCr
..........CCCCCCCCCCCC......CCCCCCr
.........QCCCCCCCCCCCC......CCCCCCr
.........CCCCCCCCCCCCcp..PPPcCCCCCr
.........CCCccCCCCCCCpp..PPPPCCCCCr
.........CCcRRCCCCCCCpp..PPPPCCCCCr
.........CCRRRCCCCCCCpp..PPPPCCCCr
.........CCRRRcCCCCCCpp..PPPPCCCCr
.........CCRRRRCcccccpp..PPPPccccr
.........CCRRRRC.pppppp..PPPPPP..r
.........CcRRRRC.KKKKKKKKKKKKKKKKK
.........CRRRRQc.KKKKKKKKKKKKKKKKK
.........CRRRRC..KKKKKKKKKKKKKKKKK
.........cRRRRC..KKKKKKKKKKKKKKKKK
..........wwccc..KKKKKKKKKKKKKKKKK
...........ww...wwwKKKKKKKKKKwwwKK
.................KwKKKKKKKKKKKKwKK
`, sh: [32, 17], hip: 33, ax: 24, ms: 1.5, mx: 20, my: 20, arm: ['C', 'c'], hand: 'K', wpn: 'kris', idle: { h: [2, 3], a: 20 } },
  guildmaster_p1: {   // 패턴 1 「그림자 분신」 (HP 50%): B를 패턴으로: HP가 절반 아래로 떨어지면 발밑 그림자에서 매연 그림자 분신 둘을 부르고, 등 뒤에 매연 분신이 붙어 서서 길드장이 벨 때마다 한 번 더 따라 벤다(피해 절반)
    pal: { H: '#1e1a26', h: '#100e16', C: '#24202c', c: '#14121a', Q: '#3a3446', K: '#06050a', e: '#ff3a3a', r: '#8a1a24', R: '#b02a36', M: '#c8ccd8', x: '#f4f6fa', N: '#8a90a0', G: '#d8b040', g: '#9a7a28', P: '#1c1a22', p: '#121016', k: '#0a080c', S: '#c8a080', W: '#4e4e54', w: '#2c2c32', V: '#727278', u: '#141418', d: '#0a0a0c', T: '#6ad050', t: '#3a8a30', Y: '#b8f070', b: '#6a4a30', a: '#4c4430', A: '#7a6e4e', z: '#2a261a', O: '#9c9068' },
    g: `
...........AAz........HHhHHHHH
..........AOOaz.....HHHhHHHHHHH
.........AOaOaz....HHhhHHHHHHHH
........AOOOaaz...HHhHHHHHHHHHH
........OaaaaaaAzHHHHHHHKKKKKKK
.......Aaaaaaaaaz.HHHHHKKKKKKKK
.......Oaaaaadddz..HHHHKKKKKKKK
......zaaaazzdede...HHHKKKeKKeK
.......zaaz..zzz....HHHKKKKKKKK
........zz..........HHHKKKKKKKK
....................HHHKKKKKKKK
........Az..AAz.....HHHHKKKKKKK
......AAOOAAOOaz.....HHHHHHHHHH
......OOaaaOaaaaz.....HHHHHHHH
.....AaaaaaaaaaaccQQQQQQQQQQQQQQQQ
.....zaaaaaaaaQcccCCCCCCCCCCCCCCCr
......aaaOOOaaCcccCCCCCCCCCCCMCcCr
......aaOazzzQccccCCCCCCCCCCMCcCCr
......aaaz...CccccCCCCCCCCCCcCCCCr
.....Aaaaaz.zCcccCCCCCCCMMMCCCCCCCr
.....OaaaaaAOccccCCCCCCCMxMcCCCCCCr
....zaaaaaaOQccccCCCCCCCMCcCCCCCCCr
.....aaaaaaaCccccCCCCCCCcCCCCCCCCCr
.....zaaaaaaCccccCCCCCCcCCCCCCCCCCr
...zz.aaaOzaCccccCCCCMcCCCCCCCCCCCr
......aaO..QCCcccCCCCMCCCCCCCCCCCCr
.....AaOaz.CCCccccCCCcCCCCCCCCCCCCr
....AOaaaazCCCcKKcCcCCCCCCCCCCCCCCr
....zaaaaazCCCCKKCCCCCCCCCCCCCCCCCr
.....zaaaaQCCCCCCCCCCCCCCCCCCCCCCCr
......zzaaCCCCCCCCCCCCCCCCCCCCCCCCr
........aaCCCCCCCCCCCCCCCCCCCCCCCCr
........zzCCCCCCCCCCCCccccccCCCCCCr
......Az..CCCCCCCCCCCC......CCCCCCr
.....AOazQCCCCCCCCCCCC......CCCCCCr
...zzOaazCCCCCCCCCCCCcp..PPPcCCCCCr
.....zaazCCCccCCCCCCCpp..PPPPCCCCCr
......zz.CCcRRCCCCCCCpp..PPPPCCCCCr
.......aACCRRRCCCCCCCpp..PPPPCCCCr
.......aOCCRRRcCCCCCCpp..PPPPCCCCr
.......zzCCRRRRCcccccpp..PPPPccccr
.....Az..CCRRRRC.pppppp..PPPPPP..r
.....zz..CcRRRRC.KKKKKKKKKKKKKKKKK
.........CRRRRQc.KKKKKKKKKKKKKKKKK
....zz...CRRRRC..KKKKKKKKKKKKKKKKK
.........cRRRRC..KKKKKKKKKKKKKKKKK
..........wwccc..KKKKKKKKKKKKKKKKK
...........ww...wwwKKKKKKKKKKwwwKK
.................KwKKKKKKKKKKKKwKK
`, sh: [32, 17], hip: 33, ax: 24, ms: 1.5, mx: 20, my: 20, arm: ['C', 'c'], hand: 'K', wpn: 'kris', idle: { h: [2, 3], a: 20 } },
  guildmaster_p2: {   // 패턴 2 「독 안개」 (HP 25%): C를 패턴으로: HP가 4분의 1 아래로 떨어지면 띠의 칼을 초록 독 약병으로 바꿔 쥐고 파티에게 던진다 — 깨진 자리마다 초록 독 안개가 피어 맹독 · 눈멂을 건다 · 발밑에도 독 안개가 감돈다 (등 뒤 분신은 그대로)
    pal: { H: '#1e1a26', h: '#100e16', C: '#24202c', c: '#14121a', Q: '#3a3446', K: '#06050a', e: '#ff3a3a', r: '#8a1a24', R: '#b02a36', M: '#c8ccd8', x: '#f4f6fa', N: '#8a90a0', G: '#d8b040', g: '#9a7a28', P: '#1c1a22', p: '#121016', k: '#0a080c', S: '#c8a080', W: '#4e4e54', w: '#2c2c32', V: '#727278', u: '#141418', d: '#0a0a0c', T: '#6ad050', t: '#3a8a30', Y: '#b8f070', b: '#6a4a30', a: '#4c4430', A: '#7a6e4e', z: '#2a261a', O: '#9c9068' },
    g: `
...........AAz........HHhHHHHH
..........AOOaz.....HHHhHHHHHHH
.........AOaOaz....HHhhHHHHHHHH
........AOOOaaz...HHhHHHHHHHHHH
........OaaaaaaAzHHHHHHHKKKKKKK
.......Aaaaaaaaaz.HHHHHKKKKKKKK
.......Oaaaaadddz..HHHHKKKKKKKK
......zaaaazzdede...HHHKKKeKKeK
.......zaaz..zzz....HHHKKKKKKKK
........zz..........HHHKKKKKKKK
....................HHHKKKKKKKK
........Az..AAz.....HHHHKKKKKKK
......AAOOAAOOaz.....HHHHHHHHHH
......OOaaaOaaaaz.....HHHHHHHH
.....AaaaaaaaaaaccQQQQQQQQQQQQbQQQ
.....zaaaaaaaaQcccCCCCCCCCCCCTTCCr
......aaaOOOaaCcccCCCCCCCCCCCTTcCr
......aaOazzzQccccCCCCCCCCCCCCcCCr
......aaaz...CccccCCCCCCCTbCcCCCCr
.....Aaaaaz.zCcccCCCCCCCMMMCCCCCCCr
.....OaaaaaAOccccCCCCCCCMxMcCCCCCCr
....zaaaaaaOQccccCCCCCCCCCcCCCCCCCr
.....aaaaaaaCccccCCCCTbCcCCCCCCCCCr
.....zaaaaaaCccccCCCCTTcCCCCCCCCCCr
...zz.aaaOzaCccccCCCCTTCCCCCCCCCCCr
......aaO..QCCcccCCCCCCCCCCCCCCCCCr
.....AaOaz.CCCccccCCCcCCCCCCCCCCCCr
....AOaaaazCCCcKKcCcCCCCCCCCCCCCCCr
....zaaaaazCCCCTbTCCCCCCCCCCCCCCCCr
.....zaaaaQCCCCYTTCCCCCCCCCCCCCCCCr
......zzaaCCCCCTTTCCCCCCCCCCCCCCCCr
........aaCCCCCTTTCCCCCCCCCCCCCCCCr
........zzCCCCCCCCCCCCccccccCCCCCCr
......Az..CCCCCCCCCCCC......CCCCCCr
.....AOazQCCCCCCCCCCCC......CCCCCCr
...zzOaazCCCCCCCCCCCCcp..PPPcCCCCCr
.....zaazCCCccCCCCCCCpp..PPPPCCCCCr
......zz.CCcRRCCCCCCCpp..PPPPCCCCCr
.......aACCRRRCCCCCCCpp..PPPPCCCCr
.......aOCCRRRcCCCCCCpp..PPPPCCCCr
.......zzCCRRRRCcccccpp..PPPPccccr
.....Az..CCRRRRC.pppppp..PPPPPP..r
.....zz..CcRRRRC.KKKKKKKKKKKKKKKKK
.........CRRRRQc.KKTtKKKKKKKKTtKKK
....zz...CtTtRC..KKttKKKKKKKKttKKK
.........cRRRRCttKKKKKKKKKKKKKKKKK
............ctTTTttKKKttttKKKtTTTtt
..............ttttKKtttTTtttKKtttt
.................KKKKKKKKKKKKKKKKK
`, sh: [32, 17], hip: 33, ax: 24, ms: 1.5, mx: 20, my: 20, arm: ['C', 'c'], hand: 'K', wpn: 'kris', idle: { h: [2, 3], a: 20 } }
});
Object.assign(PXU_ACT, {
  ratburglar: { atk: ['down', 'side'], skl: ['smash'], tk: 1.05, fx: { atk: { pal: 'steel', hit: 'star' }, skl: { pal: 'steel', hit: 'stun', big: 1, after: 'sparks' } } },
  manhunter: { atk: ['down', 'side'], skl: ['smash'], tk: 1.05, fx: { atk: { pal: 'blood', hit: 'star' }, skl: { pal: 'blood', hit: 'stun', big: 1, after: 'dust' } } },
  huntdog: { atk: ['qbite'], skl: ['qpounce'], tk: 1.15, fx: { atk: { pal: 'blood', hit: 'bite' }, skl: { pal: 'blood', hit: 'claw', big: 1, after: 'dust' } } },
  smuggler: { atk: ['side', 'thrust'], mag: ['spush'], skl: ['jstab'], tk: 1.05, fx: { atk: { pal: 'steel', hit: 'star' }, mag: { pal: 'coin', hit: 'coins', p: 'orb' }, skl: { pal: 'coin', hit: 'coins', big: 1, after: 'sparks' } } },
  shadeclone: { atk: ['thrust', 'hack'], skl: ['jstab'], tk: 0.95, fx: { atk: { pal: 'shadow', hit: 'slashes' }, skl: { pal: 'shadow', hit: 'slashes', big: 1, after: 'smoke' } } },
  ratcrown: { atk: ['pthrust', 'pswing'], skl: ['pspin'], tk: 1.2, fx: { atk: { pal: 'steel', hit: 'pierce', big: 1 }, skl: { pal: 'coin', hit: 'slashes', big: 2, after: 'sparks', aoe: 'rats', shake: 2 } } },
  redhand: { atk: ['pthrust', 'pswing'], skl: ['pspin'], tk: 1.2, fx: { atk: { pal: 'blood', hit: 'pierce', big: 1 }, skl: { pal: 'blood', hit: 'stun', big: 2, after: 'dust', aoe: 'lash', shake: 2 } } },
  greyledger: { atk: ['spush', 'sjab'], mag: ['sraise'], skl: ['scharge'], tk: 1.2, fx: { atk: { pal: 'coin', hit: 'star', big: 1 }, mag: { pal: 'coin', hit: 'coins', p: 'orb' }, skl: { pal: 'coin', hit: 'coins', big: 2, after: 'sparks', aoe: 'meteor', shake: 2 } } },
  guildmaster: { atk: ['thrust', 'hack', 'side'], skl: ['jstab'], tk: 1.35, fx: { atk: { pal: 'shadow', hit: 'slashes', big: 1 }, skl: { pal: 'shadow', hit: 'slashes', big: 2, after: 'smoke', aoe: 'blades', shake: 2 } } }
});
// 그림만 쓰는 모습 (드랍 없는 이름표)
pxuLook('guildmaster_p1', 'guildmaster', '그림자 분신을 두른 검은 두건');
pxuLook('guildmaster_p2', 'guildmaster', '독 안개를 두른 검은 두건');
// 길드장 패턴 (11-18 09:05 「B, C는 패턴으로 승화」 — data-under70.js MONS.guildmaster.pat · core.js fPhase):
//   HP 50% 아래 패턴 1 그림(등 뒤 매연 분신) · 25% 아래 패턴 2 그림(독 약병 · 발밑 독 안개) — pxund.js pxuLow가 문턱 여럿을 본다, 바뀌는 순간 fx(under70.js)
//   fx.gas = 패턴 2 광역기 「독 안개」(fmot.js 'gas' — 약병이 포물선으로 날아가 사람마다 초록 안개) · fx.echo = 등 뒤 분신이 따라 베기
PXU.guildmaster.low = [{ hp: 0.5, id: 'guildmaster_p1', fx: 'u:low:smog' }, { hp: 0.25, id: 'guildmaster_p2', fx: 'u:low:gas' }];
Object.assign(PXU_ACT.guildmaster.fx, { gas: { pal: 'poison', hit: 'poison', big: 2, after: 'smoke', aoe: 'gas', shake: 2, nm: '독 안개' }, echo: { pal: 'smog', hit: 'slashes', big: 1, after: 'smoke' } });
