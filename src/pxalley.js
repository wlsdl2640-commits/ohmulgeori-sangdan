// 뒷골목 몬스터 무기 (빌드 51): 독 병 · 못 박힌 몽둥이 · 물결 단검
// 독 병 (독살자): 병목을 쥔 둥근 유리병 · 빛나는 초록 독 · 코르크 — 팔 방향과 상관없이 늘 똑바로 선다
PXU_WPN.flask = (F, d) => { const [hx, hy] = pxsMHand(F), out = [], at = (x, y, ch) => out.push([hx + x, hy + y, ch]);
  at(0, -1, 'Y');                                   // 코르크
  at(-1, 1, 'O'); at(0, 1, 'O'); at(1, 1, 'o');     // 병 몸
  at(-1, 2, 'o'); at(0, 2, 'O'); at(1, 2, 'o');
  at(0, 3, 'o');
  return out; };
PXU_FXW.flask = 'dagger';
// 못 박힌 몽둥이 (길드 행동대원): 굵은 나무 머리에 쇠못
PXU_WPN.nclub = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  at(-0.8, 0, 'v');
  for (let t = 0.6; t <= 2 * k; t += 0.5) at(t, 0, 'v');
  for (let t = 2 * k; t <= 5.4 * k; t += 0.5) { at(t, -1, 'O'); at(t, 0, 'O'); at(t, 1, 'o'); }
  at(5.4 * k + 0.7, -0.5, 'b'); at(5.4 * k + 0.7, 0.5, 'o'); at(4.8 * k, 0, 'b'); at(3.4 * k, -1, 'b');
  for (const [t, s] of [[2.6, -1.9], [3.4, 1.9], [4.2, -1.9], [5.0, 1.9], [5.6, -1.6]]) at(t * k, s, 'M');
  return out; };
PXU_FXW.nclub = 'club';
// 물결 단검 (길드장): 붉은 보석 자루 끝 · 금 코등이 · 물결치는 긴 날
PXU_WPN.kris = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  at(-0.9, 0, 'R'); at(0.8, -1, 'G'); at(0.8, 1, 'G'); at(0.8, 0, 'G');
  const L = 5.2 * k;
  for (let t = 1.4; t <= L; t += 0.5) { const s = Math.sin(t * 1.5) * 0.6; at(t, s, t > L - 0.6 ? 'x' : 'M'); at(t, s + 0.9, 'N'); }
  return out; };
PXU_FXW.kris = 'dagger';
/* ───────── 7번가 뒷골목 · 암살자 길드 은신처 몬스터 (빌드 51 시안): 암살자 · 독살자 · 길드 행동대원 · 길드 간부 · 길드장 검은 두건 ───────── */
Object.assign(PXU, {
  assassin: {   // 암살자 A 그림자 두건(기본): 잿빛 두건 · 검은 복면 · 붉은 눈 · 뒤로 날리는 붉은 목도리 · 가슴 단검 띠
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', G: '#b0b4bc', w: '#ffffff', H: '#56566e', h: '#383850', k: '#1c1c28', S: '#c8906a', s: '#9a6648', e: '#ff4848', V: '#26262f', v: '#17171d', R: '#c42e36', r: '#821c24', L: '#4a4454', l: '#2e2a36', T: '#5a4636', t: '#3a2c22', P: '#3a3846', p: '#262430', K: '#18161e' },
    g: `
......HHHH
.....HHHHHHh
....hHHHHHHHh
...hHHkkkkkHH
..hhHkSSSSSSH
..h.HkSSeSSeH
.....hkVVVVVVV
RRr..hhVVVVVh
.RRRRRRRRRRRh
...rr.LLLLLLl
.....lLMLLLLl
.....lLLMLLLl
.....TTTGTTTt
......PPp.PP
.....PPPp.PPP
.....PPp..PPp
....kKK..kKK
`, g2: `
......HHHH
.....HHHHHHh
....hHHHHHHHh
...hHHkkkkkHH
..hhHkSSSSSSH
..h.HkSSeSSeH
RRr..hkVVVVVVV
.RRRRhhVVVVVh
...rrRRRRRRRh
......LLLLLLl
.....lLMLLLLl
.....lLLMLLLl
.....TTTGTTTt
......PPp.PP
.....PPPp.PPP
.....PPp..PPp
....kKK..kKK
`, sh: [10, 9], hip: 12, ax: 8, arm: ['L', 'l'], hand: 'S', wpn: 'dagger', idle: { h: [2, 2], a: 20 } },
  assassin_b: {   // 암살자 B 흰 가면: 짧은 두건 망토 · 하얀 가면(눈 틈 · 붉은 눈물 자국) · 붉은 허리띠
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', G: '#b0b4bc', w: '#b8b2a8', H: '#3e3450', h: '#26203a', W: '#ece8e0', K: '#16121e', e: '#d83040', R: '#c42a36', r: '#82182a', C: '#4a4660', c: '#302c44', k: '#16121c' },
    g: `
......HHHH
.....HHHHHHh
....hHHHHHHHh
...hHHWWWWWWH
..hhHWKeWWKeH
..h.HWWWWWRWH
....hHwWWWRWh
...hhHHwwwwHh
..hhHHHHHHHHHh
..hhhhCCCCCCh
.....cCCCCCCc
.....cCCCCCCc
..rRRRRRRRRRr
......CCc.CC
.....CCCc.CCC
.....CCc..CCc
....kKK..kKK
`, g2: `
......HHHH
.....HHHHHHh
....hHHHHHHHh
...hHHWWWWWWH
..hhHWKeWWKeH
..h.HWWWWWRWH
....hHwWWWRWh
...hhHHwwwwHh
..hhHHHHHHHHHh
..hhhhCCCCCCh
.....cCCCCCCc
..rR.cCCCCCCc
....RRRRRRRRr
......CCc.CC
.....CCCc.CCC
.....CCc..CCc
....kKK..kKK
`, sh: [10, 9], hip: 12, ax: 8, arm: ['C', 'c'], hand: 'C', wpn: 'dagger', idle: { h: [2, 2], a: 20 } },
  assassin_c: {   // 암살자 C 꽁지머리 추적자: 높이 묶은 꽁지머리 · 붉은 머리띠 · 검붉은 얼굴 천 · 청록 가죽옷
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', G: '#b0b4bc', w: '#ffffff', A: '#2c2432', a: '#18121e', R: '#b8323a', S: '#e2b08a', s: '#b07e5e', e: '#2a1a14', V: '#6a1e28', v: '#4a1018', L: '#2e4a52', l: '#1c2e34', T: '#4a3a2e', t: '#30241c', P: '#2a3238', p: '#1a2024', K: '#141418', k: '#0e0e12' },
    g: `
......AAAA
..a..AAAAAAa
.aAaRRRRRRRRa
aAA.aAASSSSAA
aA...ASSeSSeA
aA...aSSSSSSs
.a....sVVVVVVV
.a....LVVVVVL
.....LLLLLLLLl
.....lLLLLLLLl
....SlLLLLLLl
....NlLLLLLLl
....NTTTGTTTt
....x.PPp.PP
.....PPPp.PPP
.....PPp..PPp
....kKK..kKK
`, g2: `
..a...AAAA
.aAa.AAAAAAa
aAA.RRRRRRRRa
aA..aAASSSSAA
aA...ASSeSSeA
.a...aSSSSSSs
.a....sVVVVVVV
......LVVVVVL
.....LLLLLLLLl
.....lLLLLLLLl
....SlLLLLLLl
....NlLLLLLLl
....NTTTGTTTt
....x.PPp.PP
.....PPPp.PPP
.....PPp..PPp
....kKK..kKK
`, sh: [10, 9], hip: 12, ax: 8, arm: ['L', 'l'], hand: 'S', wpn: 'dagger', idle: { h: [2, 2], a: 20 } },
  poisoner: {   // 독살자 A 역병 의사(기본): 챙 넓은 모자 · 긴 부리 가면 · 유리 눈 · 발까지 오는 외투 · 허리에 독 병
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', O: '#8ef04a', o: '#4aa428', Y: '#c8a060', v: '#4a3020', H: '#3a3444', h: '#201c28', K: '#4a4256', k: '#201c28', G: '#8ae8e0', B: '#e8d8a8', b: '#b09a68', C: '#3e3648', c: '#262030' },
    g: `
.....HHHHHH
.....HHHHHH
..hhhhHHHHhhhh
.....KKKKKK
.....KGGKKGK
.....KKKKKKKKBB
......KKKKKKKbbb
......CCCCCCc
.....CCCCCCCcc
.....cCCCCCCCc
.....cCCCOoCCc
.....cCCCoOCCc
.....cCCCCCCCc
.....cCCCCCCCc
.....ccCCCCCcc
......ccCCCcc
....kKKk.kKKk
`, g2: `
.....HHHHHH
.....HHHHHH
..hhhhHHHHhhhh
.....KKKKKK
.....KGGKKGK.BB
.....KKKKKKKKbbb
......KKKKKKK
......CCCCCCc
.....CCCCCCCcc
.....cCCCCCCCc
.....cCCCOoCCc
.....cCCCoOCCc
.....cCCCCCCCc
.....cCCCCCCCc
.....ccCCCCCcc
......ccCCCcc
....kKKk.kKKk
`, sh: [10, 8], hip: 13, ax: 8, arm: ['C', 'c'], hand: 'B', wpn: 'flask', idle: { h: [2, 1], a: -10 } },
  poisoner_b: {   // 독살자 B 녹색 두건 약제사: 짙은 녹색 두건 · 입을 가린 천 · 가죽 앞치마에 독 병 둘 · 약초 가방
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', O: '#8ef04a', o: '#4aa428', Y: '#c8a060', v: '#4a3020', H: '#2e4a2a', h: '#1c2e18', S: '#dcb48c', s: '#a8805c', e: '#2a1a10', T: '#5a6a40', C: '#3a4a2e', c: '#243018', A: '#6a5236', a: '#4a3824', B: '#7a5a3a', b: '#4a3620', P: '#2c2c24', p: '#1a1a14', K: '#1a1a14', k: '#101010' },
    g: `
......HHHH
.....HHHHHHh
....hHHHHHHHh
...hHHSSSSSSH
..hhHSSeSSeSH
..h.HSTTTTTTH
.....hTTTTTh
.....CCCCCCCh
..BB.CCCCCCCc
.BBBbCAAAAACc
.BBBbcAOAOAcc
.BBBbcAoAoAcc
..bb.cAAAAAcc
.....cCCCCCCc
......PPp.PP
.....PPPp.PPP
....kKK..kKK
`, g2: `
......HHHH
.....HHHHHHh
....hHHHHHHHh
...hHHSSSSSSH
..hhHSSeSSeSH
..h.HSTTTTTTH
.....hTTTTTh
..BB.CCCCCCCh
.BBBbCCCCCCCc
.BBBbCAAAAACc
.BBBbcAOAOAcc
..bb.cAoAoAcc
.....cAAAAAcc
.....cCCCCCCc
......PPp.PP
.....PPPp.PPP
....kKK..kKK
`, sh: [10, 8], hip: 13, ax: 8, arm: ['C', 'c'], hand: 'S', wpn: 'flask', idle: { h: [2, 1], a: -10 } },
  poisoner_c: {   // 독살자 C 늙은 독 약초꾼: 성긴 백발 · 보랏빛 넝마 로브 · 등에 짊어진 독 항아리
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#a8a89c', O: '#8ef04a', o: '#4aa428', Y: '#c8a060', v: '#3a2244', W: '#dcdcd0', S: '#d8b090', s: '#a07c5c', K: '#2a1a14', V: '#5a3a6a', J: '#4a5a40', j: '#2e3a28', K2: '#1a1a14', k: '#101010' },
    g: `
.......oo
......o..o
....WWWWWW
...WWWWWWWw
...WWSSSSSw
...WSSKSSKS
...WSSSSSSs
.JJ..sSSssSs
JJJJ.VVVVVV
JJjjVVVVVVVV
JJj.vVVVVVVV
jj..vVVVVVVV
....vVVVVVVVv
....vVVVVVVVv
.....vVVVVVv
.....vvVVVvv
....kKK..kKK
`, g2: `
......o..o
.
....WWWWWW
...WWWWWWWw
...WWSSSSSw
...WSSKSSKS
...WSSSSSSs
.JJ..sSSssSs
JJJJ.VVVVVV
JJjjVVVVVVVV
JJj.vVVVVVVV
jj..vVVVVVVV
....vVVVVVVVv
....vVVVVVVVv
.....vVVVVVv
.....vvVVVvv
....kKK..kKK
`, sh: [10, 8], hip: 13, ax: 8, arm: ['V', 'v'], hand: 'S', wpn: 'flask', idle: { h: [2, 1], a: -10 } },
  enforcer: {   // 길드 행동대원 A 상처투성이 덩치(기본, ms 1.25): 짧게 민 머리 · 얼굴 흉터 · 떡 벌어진 어깨 · 가죽 조끼 · 못 박힌 몽둥이
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', O: '#8a5a32', o: '#5e3c20', v: '#3e2614', H: '#3a2a22', h: '#241a14', S: '#b8825a', s: '#8a5e3e', K: '#1c120c', R: '#c84848', L: '#5a3e34', l: '#3a2620', G: '#c9a04a', T: '#4a3426', P: '#3a3238', p: '#242028', K2: '#000', k: '#161218', b: '#8a1420', Z: '#74564a', z: '#8a5e3e', Q: '#cfa07a' },
    g: `
.......hhhhhh
......hHHHHHHh
......hQQQSSsh
......QQQSSSss
......QQKSSKss
......SSSSRsss
......sSsKKsss
.......ssssss
....ZZZZZZZLLLLL
...ZZZZZZZZLLLLll
..SZZZZZZZLLLLLllS
..SZZZZZZLLLLLlllS
..sZZGLLLLLLLlGlls
..sLllllllllllllls
..SLLLLLLllllllllS
...LLLlllllllllll
...TTTTTTTTTTTTTT
....PPPPPp.pPPPPP
....PPPPPp.pPPPPP
....PPPPp...pPPPP
...kKKKK.....KKKKk
`, g2: `
.......hhhhhh
......hHHHHHHh
......hQQQSSsh
......QQQSSSss
......QQKSSKss
......SSSSRsss
......sSsKKsss
.......ssssss
....ZZZZZZZLLLLL
...ZZZZZZZZLLLLll
..SZZZZZZZLLLLLllS
..SZZZZZZLLLLLlllS
..sZZGLLLLLLLlGlls
..sLllllllllllllls
..SLLLLLLllllllllS
...LLLlllllllllll
...TTTTTTTTTTTTTT
....PPPPPp.pPPPPP
....PPPPPp.pPPPPP
....PPPPp...pPPPP
...kKKKK.....KKKKk
`, sh: [14, 9], hip: 16, ax: 10, ms: 1.25, arm: ['L', 'l'], hand: 'S', wpn: 'nclub', idle: { h: [3, 4], a: 35 } },
  enforcer_b: {   // 길드 행동대원 B 쇠가면 집행자: 눈 틈·입 창살·못이 박힌 쇠가면(피 묻음) · 사슬 두른 어깨 · 검붉은 갑옷 조끼
    pal: { M: '#b0b4bc', N: '#767a84', x: '#f4f6fa', w: '#ffffff', O: '#8a5a32', o: '#5e3c20', v: '#3e2614', h: '#1a1418', n: '#4a4e58', K: '#120c10', b: '#8a1420', B: '#a8202a', S: '#b8825a', s: '#8a5e3e', R: '#6a2228', r: '#44141a', T: '#2e2024', P: '#2a262c', p: '#18161c', k: '#100e12', Z: '#883038', Q: '#c4c8d0' },
    g: `
......h..hh..h
.....hhhhhhhhh
.....hhhhhhhhhh
.....nMMMMMMMMn
.....MMMMMMMMMM
.....MbKKMMKKMM
.....NMMMMMMMMN
.....NMNNNNNNNN
.....NbMNMNMNMN
......nNNNNNNn
....NNNNNNNNNNNN
...NnNnNnNnNnNnNN
..SZZZZZZZRRRRRrrS
..SZZZZZZBRRRRrrrS
..sZrZRRRRbRRrrrrs
..sRrrrrrrrrrrrrrs
..SRRRRRRrrrrrrrrS
...RRRrrrrrrrrrrr
...TTTTTTTTTTTTTT
....PPPPPp.pPPPPP
....PPPPPp.pPPPPP
....PPPPp...pPPPP
...kKKKK.....KKKKk
`, g2: `
......h..hh..h
.....hhhhhhhhh
.....hhhhhhhhhh
.....nMMMMMMMMn
.....MMMMMMMMMM
.....MbKKMMKKMM
.....NMMMMMMMMN
.....NMNNNNNNNN
.....NbMNMNMNMN
......nNNNNNNn
....NNNNNNNNNNNN
...NnNnNnNnNnNnNN
..SZZZZZZZRRRRRrrS
..SZZZZZZBRRRRrrrS
..sZrZRRRRbRRrrrrs
..sRrrrrrrrrrrrrrs
..SRRRRRRrrrrrrrrS
...RRRrrrrrrrrrrr
...TTTTTTTTTTTTTT
....PPPPPp.pPPPPP
....PPPPPp.pPPPPP
....PPPPp...pPPPP
...kKKKK.....KKKKk
`, sh: [14, 11], hip: 18, ax: 10, ms: 1.25, arm: ['R', 'r'], hand: 'S', wpn: 'nclub', idle: { h: [3, 4], a: 35 } },
  enforcer_c: {   // 길드 행동대원 C 붉은 머리띠 주먹꾼: 붉은 머리띠 · 맨가슴에 붕대 · 금 목걸이
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', O: '#8a5a32', o: '#5e3c20', v: '#3e2614', h: '#2a1a14', R: '#c42e36', r: '#821c24', S: '#c08860', s: '#926440', K: '#1c120c', G: '#e0b040', B: '#e8dcc8', b: '#8a1420', T: '#5a3a2a', P: '#4a4050', p: '#302a36', k: '#1a1620', Q: '#d8a078' },
    g: `
......hhhhhh
.....hhhhhhhhh
.....RRRRRRRRhh
.....QQQQSSSsrr
.....QQKSSKss
.....SSSSssss
.....sSSKKsss
......sQQQQs
....QQQQQQQSSSSS
...QQQQQQQQSSSSss
..QQQQGGGGGGGGSssS
..QQQQQQQSSSSSssss
..sQBBBBBBBBBBBBss
..sSSSSSSSSsssssss
..SSBBBBBBBBBBBBsS
...SSSsssssssssss
...TTTTTTTTTTTTTT
....PPPPPp.pPPPPP
....PPPPPp.pPPPPP
....PPPPp...pPPPP
...kKKKK.....KKKKk
`, g2: `
......hhhhhh
.....hhhhhhhhh
.....RRRRRRRRhh
.....QQQQSSSsrr
.....QQKSSKss
.....SSSSssss
.....sSSKKsss
......sQQQQs
....QQQQQQQSSSSS
...QQQQQQQQSSSSss
..QQQQGGGGGGGGSssS
..QQQQQQQSSSSSssss
..sQBBBBBBBBBBBBss
..sSSSSSSSSsssssss
..SSBBBBBBBBBBBBsS
...SSSsssssssssss
...TTTTTTTTTTTTTT
....PPPPPp.pPPPPP
....PPPPPp.pPPPPP
....PPPPp...pPPPP
...kKKKK.....KKKKk
`, sh: [14, 9], hip: 16, ax: 10, ms: 1.25, arm: ['S', 's'], hand: 'S', wpn: 'nclub', idle: { h: [3, 4], a: 35 } },
  blackhood: {   // 길드장 검은 두건(두목 · 던전 주인, ms 1.5): 얼굴을 덮는 검은 두건 속 붉은 두 눈 · 안감 붉은 검은 망토 · 가슴에 은빛 길드 문장 · 물결 단검
    pal: { M: '#d8dce4', N: '#9aa2b2', x: '#f4f6fa', w: '#ffffff', G: '#e0b040', R: '#c42e36', H: '#1a1620', h: '#0e0c12', K: '#08060c', e: '#ff3a3a', C: '#262230', c: '#141018', Z: '#36303e', r: '#7a1a24', P: '#1c1a22', p: '#100e14', k: '#0a0810' },
    g: `
.........HHHHHH
........HHHHHHHH
.......HHHHHHHHHH
.......HHHKKKKKKH
.......HHKKeKKeKH
.......HHKKKKKKKH
.......HhHKKKKKH
........hHHHHHH
....ccccZZZZZZCCCC
...ccccZZZZZZCCCCcC
...cccCZZZZZZCCCccC
..ccccZZZZNZCCCCccc
..crccZZZNMNCCCCccc
..crrcZZZZNCCCCcccc
..crrcCCCCCCCCccccc
.ccrrccCCCCCCcccccc
.crrrcc.GGGGGGGGGG
.crrrrc.CCcccccccc
.crrrrc.cccccccccC
crrrrrc.ccccccccCc
crrrrrc..PPPPp.PPPP
crrrrrrc.PPPPp.PPPP
cccccccc.PPPp...PPP
........kKKK...kKKK
`, g2: `
.........HHHHHH
........HHHHHHHH
.......HHHHHHHHHH
.......HHHKKKKKKH
.......HHKKeKKeKH
.......HHKKKKKKKH
.......HhHKKKKKH
....ccc.hHHHHHH
...cccccZZZZZZCCCC
...cccCZZZZZZCCCCcC
..ccccZZZZZZZCCCccC
..crccZZZZNZCCCCccc
..crrcZZZNMNCCCCccc
..crrcCZZZNCCCCcccc
.ccrrccCCCCCCCccccc
.crrrccCCCCCCcccccc
.crrrrc.GGGGGGGGGG
.crrrrc.CCcccccccc
crrrrrc.cccccccccC
crrrrrc.ccccccccCc
crrrrrr..PPPPp.PPPP
cccccccc.PPPPp.PPPP
.......c.PPPp...PPP
........kKKK...kKKK
`, sh: [17, 9], hip: 20, ax: 14, ms: 1.5, arm: ['C', 'c'], hand: 'K', wpn: 'kris', idle: { h: [3, 3], a: 15 } },
  officer: {   // 길드 간부 A 까마귀 가면(기본, ms 1.5): 쇠 부리 가면 · 깃털이 겹겹이 달린 어깨 망토 · 붉은 끈 · 물결 단검
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#ffffff', G: '#e0b040', R: '#b02a32', h: '#1c1a24', n: '#5a5e68', e: '#ff3a3a', F: '#34303e', f: '#1c1a24', C: '#3a3446', c: '#221e2a', Z: '#4a4458', P: '#1c1a22', p: '#100e14', k: '#0a0810' },
    g: `
......hhhhhhh
......hhhhhhhh
.....hhNNNNNhh
.....hNNeNNeNh
.....hNNNNNNNNnn
.....hhNNNNNNn
....FFFFFFFFFFF
...FFFFFFFFFFFFF
..ffffffffffffff
..FFFFFFFFFFFFFF
..FFFFFFFFFFFFFF
..ff.ffCCRccff
......CCRRccc
......CCCRccc
......ccccccc
......ccccccC
......CccccCc
......PPPpPPPP
......PPp..PPP
......KKK..kKK
`, g2: `
......hhhhhhh
......hhhhhhhh
.....hhNNNNNhh
.....hNNeNNeNh
.....hNNNNNNNNnn
.....hhNNNNNNn
...FFFFFFFFFFFF
..ffFFFFFFFFFFFF
..FFffffffffffff
..ffFFFFFFFFFFFF
..ffFFFFFFFFFFFF
.....ffCCRccff
......CCRRccc
......CCCRccc
......ccccccc
......ccccccC
......CccccCc
......PPPpPPPP
......PPp..PPP
......KKK..kKK
`, sh: [13, 7], hip: 16, ax: 11, ms: 1.25, arm: ['C', 'c'], hand: 'N', wpn: 'kris', idle: { h: [3, 3], a: 15 } },
  officer_b: {   // 길드 간부 B 흰 머리 노검객: 뒤로 넘긴 백발 · 얼굴 흉터 · 검은 비단 옷 · 금실 띠 · 어깨에 걸친 붉은 외투
    pal: { M: '#c8ccd4', N: '#8a8e98', x: '#f4f6fa', w: '#a8a8a0', G: '#e0b040', R: '#a8262e', W: '#e8e8e0', S: '#d4a884', s: '#9e7656', e: '#1a1210', C: '#1e1a26', c: '#100e16', Z: '#302a3a', r: '#6e161e', P: '#2a2630', p: '#18161c', k: '#0c0a10' },
    g: `
.......WWWWWW
......WWWWWWWw
......WSSSSSSw
......SSeSSeSw
......SSSSRSSw
......SSSSSRs
...rrrZZZZZCCC
..rRRrZZZZCCCCC
..rRRRZZZZCCCcC
..rRRRZZZZCCCcc
..RRRRZZCCCCccc
..RRRRCCCCCcccc
.rRRRRrCCCccccc
.rRRRR.GGGGGGGG
.rRRRRr.ccccccC
rRRRRRr.cccccCc
rRRRRRr..PPPp.PPP
rRRRRRRr.PPPp.PPP
........kKK...KKK
`, g2: `
.......WWWWWW
......WWWWWWWw
......WSSSSSSw
......SSeSSeSw
......SSSSRSSw
......SSSSSRs
..rRRrZZZZZCCC
..rRRRZZZZCCCCC
..rRRRZZZZCCCcC
..RRRRZZZZCCCcc
..RRRRZZCCCCccc
.rRRRRCCCCCcccc
.rRRRRrCCCccccc
.rRRRR.GGGGGGGG
rRRRRRr.ccccccC
rRRRRRr.cccccCc
rRRRRRr..PPPp.PPP
rrrrrrRr.PPPp.PPP
........kKK...KKK
`, sh: [13, 7], hip: 16, ax: 11, ms: 1.25, arm: ['C', 'c'], hand: 'S', wpn: 'kris', idle: { h: [3, 3], a: 15 } }
});
// 길드장 동작: 망토를 젖히고 물결 단검을 높이 치켜들었다가 허공에 뿌린다 → 그림자 칼날 비 (맞히는 장 4)
PXU_MOT.bcape = [
  { h: [2, 3], a: 15 },
  { h: [1, 0], a: -40, lean: -1 },
  { h: [0, -4], a: -95, lean: -1, fx: { k: 'gather', r: 1 } },
  { h: [1, -5], a: -110, lean: -1, fx: { k: 'gather', r: 2 } },
  { h: [3, -4], a: -45, dx: 1, fx: { k: 'cast', r: 2 } },
  { h: [3, -2], a: -20, dx: 1 },
  { h: [3, 1], a: 10 },
  { h: [2, 3], a: 15 }
];
PXS_MOT_TT.bcape = [0.05, 0.07, 0.09, 0.1, 0.07, 0.1, 0.08, 0.07];
Object.assign(PXU_ACT, {
  assassin: { atk: ['thrust', 'down', 'hack'], skl: ['jstab'], tk: 0.9, fx: { atk: { pal: 'steel', hit: 'star' }, skl: { pal: 'blood', hit: 'slashes', big: 1, after: 'dust' } } },
  poisoner: { mag: ['spush', 'sjab'], atk: ['down'], skl: ['scharge'], tk: 1.0, fx: { mag: { pal: 'poison', hit: 'poison', p: 'flask' }, atk: { pal: 'poison', hit: 'poison', p: 'flask' }, skl: { pal: 'poison', hit: 'poison', p: 'flask', big: 1, after: 'smoke' } } },
  enforcer: { atk: ['smash', 'side', 'down'], skl: ['smash'], tk: 1.15, fx: { atk: { pal: 'earth', hit: 'star', big: 1 }, skl: { pal: 'earth', hit: 'quake', big: 2, after: 'dust' } } },
  blackhood: { atk: ['thrust', 'down', 'hack'], skl: ['bcape'], tk: 1.25, fx: { atk: { pal: 'shadow', hit: 'slashes', big: 1 }, skl: { pal: 'blood', hit: 'slashes', big: 2, after: 'motes', aoe: 'blades', shake: 3 } } },
  officer: { atk: ['thrust', 'down', 'hack'], skl: ['jstab'], tk: 1.2, fx: { atk: { pal: 'shadow', hit: 'slashes', big: 1 }, skl: { pal: 'blood', hit: 'slashes', big: 1, after: 'motes' } } }
});
// 만날 때마다 모습 하나 (빌드 51, 사용자 결정 「다 ㄱㄱ」): 기본 모습이 아닌 것은 드랍 없는 이름표 (pxuLook)
pxuLook('assassin_b', 'assassin', MONS.assassin.name); pxuLook('assassin_c', 'assassin', MONS.assassin.name);
pxuLook('poisoner_b', 'poisoner', MONS.poisoner.name); pxuLook('poisoner_c', 'poisoner', MONS.poisoner.name);
pxuLook('enforcer_b', 'enforcer', MONS.enforcer.name); pxuLook('enforcer_c', 'enforcer', MONS.enforcer.name);
pxuLook('officer_b', 'officer', MONS.officer.name);
Object.assign(PXU_SKIN, { assassin: ['assassin', 'assassin_b', 'assassin_c'], poisoner: ['poisoner', 'poisoner_b', 'poisoner_c'], enforcer: ['enforcer', 'enforcer_b', 'enforcer_c'], officer: ['officer', 'officer_b'] });
Object.assign(PXU_SKIN_NAME, { assassin: ['그림자 두건', '흰 가면', '꽁지머리 추적자'], poisoner: ['역병 의사', '녹색 두건 약제사', '늙은 독 약초꾼'], enforcer: ['상처투성이 덩치', '쇠가면 집행자', '붉은 머리띠 주먹꾼'], officer: ['까마귀 가면', '흰 머리 노검객'] });
