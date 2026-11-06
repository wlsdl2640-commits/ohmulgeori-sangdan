/* ───────── 만년설산 · 얼어붙은 신전 몬스터 (빌드 49 시안): 눈사람 · 얼음 정령 · 예티 · 설녀 · 설녀 여왕 ───────── */
Object.assign(PXU, {
  snowman: {   // 눈사람: 두 덩이(머리·몸) · 기운 양동이 모자 · 숯 눈·입 · 당근 코 · 붉은 목도리 · 나뭇가지 팔 (눈덩이를 치켜들어 던진다)
    pal: { Q: '#ffffff', C: '#e4ecf6', c: '#b0c0d8', d: '#7e92b6', K: '#1c2030', w: '#ffffff', e: '#1c2030', O: '#f28a2a', o: '#b85a18', R: '#d8383a', r: '#8e2026', M: '#7a8698', m: '#aab6c6', N: '#4c566a', T: '#7a4a2a', t: '#4a2c1a', W: '#ffffff' },
    g: `
.
.
........NMMm
.......NMMMMm
......NNNNNNNN
.......QQQCC
......QQQKCCcK
......QQQCKcKd
......CCCCccOOOo
......CCcccdd
tt....QccKKKd
T...QQrRRrRRrR...tt
.T.QRRQrRRRRrd...T
..TQRrQQCCKccd.TT
...TQrCCCCccddT
...CCCCCCccddd
...cCCCcccKddd
....ccccddddd
.....ddddddd
`, g2: `
.
.
........NMMm
.......NMMMMm
......NNNNNNNN
.......QQQCC
......QQQKCCcK
......QQQCKcKd
......CCCCccOOOo
......CCcccdd....t
......QccKKKd....Tt
t...QQrRRrRRrR..T
T..QRRQrRRRRrd..T
.TTQRrQQCCKccd.T
...TQrCCCCccddT
...CCCCCCccddd
...cCCCcccKddd
....ccccddddd
.....ddddddd
`, gm: { squash: `
.
.
.
........NMMm
.......NMMMMm
......NNNNNNNN
........QQCc
......QQQKCCcK
......QQQCKcKd
.....CCCCCccOOOo
......CCCccddd
tt....cccKKKd
T...QQrRRrRRrR...tt
.T.QRRQrRRKRrd...T
..TQRrQCCCCccddTT
..CTCrCCCCccddT
...CCCCCccKdddd
...ccccccddddd
.....ddddddd
`, stretch: `
........NMMm
.......NMMMMm
......NNNNNNNN
.......QQQCc
......QQQKCCcK
......QQQCKcK
......CCCCccOOOo
......CCCccdd
tt....cccKKKd
T.....rRRrRRrR...tt
.T..RRQrRRRRr....T
..T.RrQQQCCcc..TT
...TQrQQCCKccdT
...CQQQCCCccdd
...CCCCCCCccdd
...CCCCCccKddd
....cCccccddd
....dcccddddd
......dddddd
`, swell: `
.
.
........NMMm
.......NMMMMm...QC
......NNNNNNNN.QCc
.......QQQCC...Ccd
......QQQKCCcK.t
......QQQCKcKd..T
......CCCCccOOOoT
......CCcccdd...T
tt....QccKKKd...T
T...QQrRRrRRrR.T
.T.QRRQrRRRRrd.T
..TQRrQQCCKccd.T
...TQrCCCCccdd
...CCCCCCccddd
...cCCCcccKddd
....ccccddddd
.....ddddddd
`, spit: `
.
.
........NMMm
.......NMMMMm
......NNNNNNNN
.......QQQCC
......QQQKCCcK
......QQQCKcKd
......CCCCccOOOo
.t....CCcccdd
tT....QccKKKd......t
..T.QQrRRrRRrR....T
..TQRRQrRRRRrd.TTT.t
..TQRrQQCCKccdT
...TQrCCCCccdd
...CCCCCCccddd
...cCCCcccKddd
....ccccddddd
.....ddddddd
` }, sh: [15, 10], hip: 11, ax: 9, still: 1, noArm: 1, wpn: 'none' },
  icesprite: {   // 얼음 정령: 마름모 얼음 결정 몸(면마다 명암) · 얼굴 · 양옆에 떠 있는 작은 결정 둘 · 아래 반짝이 (떠 있다)
    pal: { Q: '#eafcff', C: '#9ee2ff', c: '#58aee6', d: '#2e6cb0', w: '#ffffff', K: '#142038', e: '#16305a', B: '#d8f8ff', b: '#7ad0f8' },
    g: `
........Q
........wc
.......Qwcc
......QwQCc....c
..c...QQQwCc...C
..C..QQQQeCec.QCc
.QCcQQQQQeCec.Ccd
.Ccd.cCCCcccd.cc
.cc...cCCced...d
..d...ccCcdd
.......cBBd
........Bd
........cd
.
.......b
`, g2: `
........Q
........wc
.......Qwcc....c
......QwQCc....C
......QQQwCc..QCc
..c..QQQQeCec.Ccd
..C.QQQQQeCec.cc
.QCc.cCCCcccd..d
.Ccd..cCCced
.cc...ccCcdd
..d....cBBd
........Bd
........cd
.
.......b
`, gm: { swell: `
........w
........wc
.......wwcc
......wwQCc.....c
.c....wQQCCc....C
.C...wQQQeCce..wCc
wCc.wwQQQCeec..Ccd
Ccd..cCCCcccd..cc
cc....cCCced....d
.d....ccCcdd
.......cwwd
........wd
........cd
.
.......b
`, spit: `
........w
........wc
.......wwcc
......wwQCc......c
..c...wQQwCc.....C
..C..wQQQeCec...wCc
.wCcwwQQQeCec...Ccd
.Ccd.cCCCcccd...cc
.cc...cCCced.....d
..d...ccCcdd
.......cwwd
........wd
........cd
.
.......b
` }, sh: [14, 6], hip: 0, ax: 9, float: 1, noArm: 1, wpn: 'none' },
  yeti: {   // 예티: 흰 털이 덥수룩한 큰 덩치 · 솟은 등 · 앞으로 내민 머리 · 푸른 회색 얼굴 · 붉은 눈 · 송곳니 · 긴 팔과 푸른 주먹 (앞팔은 몸짓)
    pal: { F: '#dfe7f1', f: '#a9b9d0', Q: '#ffffff', C: '#e6ecf4', c: '#b4c2d6', d: '#8090ae', K: '#1a1e2e', S: '#8aa2c8', s: '#5c7299', e: '#ff4a3a', w: '#ffffff', R: '#c8404a', n: '#3a4666' },
    g: `
.....QQQc
...QQCCCQQc
..QCQCCCcCCcQQQc
..QCcCCCCccQCCCCQc
.QCCCcCCCQcQCcccccc
.QQCCCQCCccQcSccSccc
QCcCCCcCCCccSSseSseS
QCCcCCCcCCccSSSSSSsn
QCCCCCCCQCCdcSKwKKwc
cCCCQCCCcCCdccccccc
ccCCcCCCCcCCdddc
QcQCCcQCCCCQCCCc
QcQCCCcCCCCcCCc
QccCCCCcCCCCcCc
cc.dcdcdcdcdcd
SS.cQQQc..cQQQc
ss..QCCc...QCCc
....cccc...cccc
...sSSSSs.sSSSSs
`, gm: { roar: `
.....QQQc
...QQCCCQQc
..QCQCCCcCCcQQQc
..QCcCCCCccQCCCCQc
.QCCCcCCCQcQCcccccc
.QQCCCQCCccQcSccSccc
QCcCCCcCCCccSSseSseS
QCCcCCCcCCccSSSSSSsn
QCCCCCCCQCCdcwKKKKwc
cCCCQCCCcCCdcKRRRRK
ccCCcCCCCcCCddwKKw
QcQCCcQCCCCQCCCc
QcQCCCcCCCCcCCc
QccCCCCcCCCCcCc
cc.dcdcdcdcdcd
SS.cQQQc..cQQQc
ss..QCCc...QCCc
....cccc...cccc
...sSSSSs.sSSSSs
` }, sh: [13, 11], hip: 14, ax: 10, ms: 1.25, arm: ['F', 'f'], hand: 'S', wpn: 'rfist', wmap: { Q: 'S', C: 'S', c: 's' }, idle: { h: [3, 5], a: 80 } },
  snowmaiden: {   // 설녀: 허리 아래까지 내려온 검은 긴 머리 · 창백한 얼굴 · 얼음빛 눈 · 흰 기모노와 푸른 오비 · 뒤로 늘어진 긴 소매 · 아래는 끌리는 옷자락 (떠 있다)
    pal: { S: '#f2f6fd', s: '#c4cde4', e: '#3aa8f0', K: '#141a2a', C: '#f4f8ff', c: '#c6d4ec', d: '#8ea4cc', Q: '#ffffff', v: '#9aaed2', w: '#c6d4ec', B: '#5e92d8', b: '#3a64a8', f: '#9ad0f6', R: '#7a86d0', h: '#20263c', H: '#46557e', q: '#323c5a' },
    g: `
......hhhh
....hhHHHhh
...hhHHhhhhhh
...hhhhhhSSSSh
..hhhhhhSSeSeS
..hhhqhhSSSSSs
..hhhhhhhSSRs
.hhqhhhhhhCs
.hhhhhhhCCdCC
.hhhqhhCCCCdCCc
..hhhhcCCCCCCCc
..hhhhcBBBBBBBc
..hhhccBbBbBbBc
...ccccCCCCCCCc
...ccccCCCCCCc
...cccdCCCCCCc
....cd.fCCCCf
.......cCCCc
.....cCCCc
...cCCc
..cc
`, g2: `
......hhhh
....hhHHHhh
...hhHHhhhhhh
...hhhhhhSSSSh
..hhhhhhSSeSeS
..hhhqhhSSSSSs
..hhhhhhhSSRs
.hhqhhhhhhCs
.hhhhhhhCCdCC
.hhhqhhCCCCdCCc
..hhhhcCCCCCCCc
..hhhhcBBBBBBBc
..hhhccBbBbBbBc
...ccccCCCCCCCc
...ccccCCCCCCc
...cccdCCCCCCc
....cd.fCCCCf
c......cCCCc
.cccccCCCc
.....c
`, gm: { swell: `
......hhhh
....hhHHHhh
...hhHHhhhhhh
...hhhhhhSSSSh
..hhhhhhSSKSKS
..hhhqhhSSSSSs
..hhhhhhhSSRs
.hhqhhhhhhCs
.hhhhhhhCCdCC
.hhhqhhCCCCdCCc
..hhhhcCCCCCCCc
..hhhhcBBBBBBBc
..hhhccBbBbBbBc
...ccccCCCCCCCc
...ccccCCCCCCc
...cccdCCCCCCc
....cd.fCCCCf
.......cCCCc
.....cCCCc
...cCCc
..cc
` }, sh: [12, 9], hip: 0, ax: 9, float: 1, arm: ['v', 'w'], hand: 'S', wpn: 'none', idle: { h: [1, 3], a: 70 } },
  icequeen: {   // 설녀 여왕(우두머리): 얼음 왕관 · 머리 뒤 얼음 깃 · 남빛 긴 머리 · 흰 드레스(주름 · 얼음 무늬 · 푸른 띠) · 뒤로 끌리는 망토 · 얼음 홀
    pal: { S: '#eef3fc', s: '#c0cae4', e: '#5ad8ff', K: '#141a2a', C: '#eef5ff', c: '#b8cae6', d: '#7e96c4', Q: '#ffffff', w: '#ffffff', h: '#2c3c78', H: '#5a74c0', q: '#3a4c8c', f: '#9ad0f6', F: '#c4eaff', B: '#4a7ad0', b: '#2e4e98', R: '#5a6ad0', v: '#9aaed2', n: '#c8d4ec', x: '#ffffff' },
    g: `
...........f
.........f.Qf.f
........fQffQfQf
...FF...fQQQQQQf
..FQF..hhhhhhhhh
.FQFF.hhHHHhhhhhh
.FQF.hhHHhhhSSSSh
FQFF.hhhhhhSSeSeS
FQF.hhhhqhhSSSSSs
FFF.hhhhhhhhSSRs
.F..hqhhhhhhhCs
...hhhhhhhCCdCCC
..hhhhhhCCCCCdCCC
..hhhqhcCCCCCCCCc
..hhhhcBBBbBBBBBc
...hhccCCCCfCCCCc
...cccCCCCCfCCCCc
...cccCCCCfQfCCCc
..ccccCCCCCfCCCCCc
..cccdCCcCCfCCcCCc
..cccdCCcCCCCCcCCc
.ccccdCCcCCfCCcCCCc
.cccdCCCcCfQfCcCCCc
ccccdfCCCCCfCCCCCCCf
cccd.ffffffffffffff
`, g2: `
...........f
.........f.Qf.f
........fQffQfQf
...FF...fQQQQQQf
..FQF..hhhhhhhhh
.FQFF.hhHHHhhhhhh
.FQF.hhHHhhhSSSSh
FQFF.hhhhhhSSeSeS
FQF.hhhhqhhSSSSSs
FFF.hhhhhhhhSSRs
.F..hqhhhhhhhCs
...hhhhhhhCCdCCC
..hhhhhhCCCCCdCCC
..hhhqhcCCCCCCCCc
..hhhhcBBBbBBBBBc
...hhccCCCCfCCCCc
...cccCCCCCfCCCCc
...cccCCCCfQfCCCc
..ccccCCCCCfCCCCCc
..cccdCCcCCfCCcCCc
..cccdCCcCCCCCcCCc
.ccccdCCcCCfCCcCCCc
ccccdCCCcCfQfCcCCCc
.cccdfCCCCCfCCCCCCCf
..cd.ffffffffffffff
`, gm: { swell: `
...........Q
.........Q.QQ.Q
........QQQQQQQQ
...FQ...QQQQQQQQ
..FQF..hhhhhhhhh
.FQFQ.hhHHHhhhhhh
.QQQ.hhHHhhhSSSSh
QQQF.hhhhhhSSeSeS
FQF.hhhhqhhSSSSSs
QFQ.hhhhhhhhSSRs
.Q..hqhhhhhhhCs
...hhhhhhhCCdCCC
..hhhhhhCCCCCdCCC
..hhhqhcCCCCCCCCc
..hhhhcBBBbBBBBBc
...hhccCCCCfCCCCc
...cccCCCCCfCCCCc
...cccCCCCfQfCCCc
..ccccCCCCCfCCCCCc
..cccdCCcCCfCCcCCc
..cccdCCcCCCCCcCCc
.ccccdCCcCCfCCcCCCc
.cccdCCCcCfQfCcCCCc
ccccdfCCCCCfCCCCCCCf
cccd.ffffffffffffff
` }, sh: [14, 12], hip: 0, ax: 11, ms: 1.5, mx: 20, my: 22, still: 1, arm: ['v', 'd'], hand: 'S', wpn: 'lstaff', wmap: { v: 'n', G: 'f', g: 'b', X: 'Q', x: 'w' }, idle: { h: [3, 3], a: -80, g: 3 } }
});
Object.assign(PXU_ACT, {
  snowman: { atk: ['wspit', 'sbounce'], skl: ['wspit'], fx: { atk: { pal: 'snow', hit: 'burst', p: 'snow' }, sbounce: { pal: 'snow', hit: 'burst' }, skl: { pal: 'ice', hit: 'shatter', p: 'snow', big: 1, after: 'motes' } } },
  icesprite: { mag: ['wspit'], atk: ['wspit'], skl: ['wspit'], fx: { atk: { pal: 'ice', hit: 'shatter', p: 'shard' }, mag: { pal: 'ice', hit: 'shatter', p: 'shard' }, skl: { pal: 'ice', hit: 'shatter', p: 'orb', big: 1, after: 'motes' } } },
  yeti: { atk: ['down', 'side'], skl: ['smash'], tk: 1.15, fx: { atk: { pal: 'ice', hit: 'star', big: 1 }, skl: { pal: 'ice', hit: 'quake', big: 2, after: 'dust' } } },
  snowmaiden: { mag: ['spush', 'sjab'], atk: ['spush'], skl: ['scharge'], tk: 1.0, fx: { mag: { pal: 'ice', hit: 'shatter', p: 'shard' }, atk: { pal: 'ice', hit: 'shatter', p: 'shard' }, skl: { pal: 'ice', hit: 'vortex', p: 'orb', big: 1, after: 'motes' } } },
  icequeen: { mag: ['spush', 'spushup'], skl: ['scharge'], tk: 1.2, fx: { mag: { pal: 'ice', hit: 'shatter', p: 'shard', big: 1 }, skl: { pal: 'ice', hit: 'shatter', big: 2, after: 'motes', aoe: 'blizzard', shake: 3 } } }
});
