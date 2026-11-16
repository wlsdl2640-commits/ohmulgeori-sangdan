/* ───────── 보물 던전 · 보물고 몬스터 (빌드 70 시안 · 사용자가 고른 모습): 미믹 · 황금 골렘 (보물 수호자는 시안 2를 고르는 중) ─────────
   그림체는 빌드 55~61과 같은 「뭉툭」(큰 면 한 색 · 윗가장자리 빛 · 아래 그늘 · 부위마다 다른 글자로 PX_FX가 선을 긋는다).
   원본은 tools/saved/mon70 (g/*.py 시안 도구 → t/*.json → emit70.py) — 손으로 고치지 말고 다시 뽑는다. */
Object.assign(PXU, {
  mimic: {   // 시안 A 나무 보물 상자 미믹 (사용자가 고른 것 중 첫째 = 기본 모습): 세로 쇠 띠 두른 나무 상자 · 금 자물쇠 · 뚜껑 틈으로 엿보는 노란 눈 · 뚜껑을 열면 위아래 톱니 이빨과 길게 늘어진 붉은 혀
    pal: { m: '#6a1420', C: '#a8743e', Q: '#d09a5a', c: '#6e4822', M: '#6a6a76', G: '#f0c444', k: '#1a0a0a', w: '#fff8e8', T: '#d83a4a', t: '#ff8a9a', E: '#ffe040' },
    g: `
.
.
.
.
.
...................Q
...........QQQQQQQQCQ
.....QQQQQQCCCCCCCMMCQ
....QCMMCCCCCCCCCCCCCC
...QCCCCCCCCCCCCCCCCCC
...CCCCCCCCCCCCCcccccc
...cCCCCcccccccc
....CCCC....EE.EE....GGG
....CCCMMQQQEEQEEQQMMGGG
....CCCMMCCCCCCCCCCMMGkG
....CCCMMCCCCCCCCCCMMGGG
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....cccMMccccccccccMMcc
`, g2: `
.
.
.
.
...............QQQQQ
...........QQQQCCMMCQ
.......QQQQCCCCCCCCCC
....QQQCCCCCCCCCCCCCCQ
....CMMCCCCCCCCCCCcccc
...QCCCCCCCCCCccccwmmm
...CCCCCCCccccwwmmwmmm
...CCCcccckmwmmwmwmmmm
...cCCwwkwmmwmwmmwmmwGGG
....CCwMMwQQQQQQQQQMMGGG
....CCCMMCCCCCCCCCCMMGkG
....CCCMMCEECCCCCCCMMGGG
....CCCMMCEECCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....cccMMccccccccccMMcc
`, gm: { bite: `
..........QQMMQQQc
.........QCCCCCCcm
.......QQCCCCCCcmm
......QCCCCCCCcwmmm
.....QCCCCCCCcmmmmm
....QCCCCCCccmmmmmm
...QCCCCCCcmmwmmmmmm
..QCMCCCCcwmmmmmmmmm
..CMCCCCcmmmmmmmmmmm
..CCCCCcwkmmmmmmmmmmm
..CCCCckwkkmmmmmmmmmm
..cCCckkkTTTTTTTTTTTTTT
...cCkwwkTTttttttTTTTGGG
....CQQMMTTTTTTTQQQMMGGGT
....CCCMMCCCCCCCCCCMMGkGtT
....CCCMMCEECCCCCCCMMGGGTT
....CCCMMCEECCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....cccMMccccccccccMMcc
`, leap: `
........QQQQQQQQcmm
......QQCCCCCCCcwmmm
.....QCCCCCCCccmwmmm
...QQCCCCCCCcwmmmmmm
..QCMCCCCCccmmmmmmmm
..CCMCCCCcwwmmmmmmmmm
..CCCCCCckmmmmmmmmmmm
..CCCCccwkkmmmmmmmmmm
..cCCckkkTTTTTTTTTTTTTT
...cCwwwkTTttttttTTTTGGG
....CQQMMTTTTTTTQQQMMGGGT
....CCCMMCCCCCCCCCCMMGkGtT
....CCCMMCEECCCCCCCMMGGGTT
....CCCMMCEECCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC.TT
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....CCCMMCCCCCCCCCCMMCC
....cccMMccccccccccMMcc
.
.
.
` }, sh: [23, 13], hip: 99, ax: 13, wpn: 'none', still: 1, noArm: 1 },
  mimic_b: {   // 시안 B 쇠 금고 미믹: 리벳 박힌 먹빛 쇠 상자 · 열쇠 구멍이 붉게 빛나는 눈 하나 · 열면 쇠못 같은 흰 이빨과 보랏빛 혀
    pal: { m: '#3a1440', C: '#4a4e5c', Q: '#7a7e8e', c: '#2a2c36', x: '#c8ccd8', N: '#1a1c24', k: '#120814', w: '#e8ecf4', T: '#9a4ad0', t: '#d0a0ff', E: '#ff5a3a' },
    g: `
.
.
.
.
.
...................Q
...........QQQQQQQQCQ
.....QQQQQQCCCCCCCCCCQ
....QCCCCCCCCCCCCCCCCC
...QCCCCCCCCCCCCCCCCCC
...CCCCCCCCCCCCCcccccc
...cCCCCcccccccc
....CCCC
....CCCCQQQQQQQQQQQQQQQ
....CCCCCCCCCCCCCCCCCCC
....CxCCCCCCCCCCCCCCxCC
....CCCCCCCNNNNNCCCCCCC
....CCCCCCCNwEENCCCCCCC
....CCCCCCCNEEENCCCCCCC
....CCCCCCCNEEENCCCCCCC
....CCCCCCCNNNNNCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CxCCCCCCCxCCCCCCxCC
....ccccccccccccccccccc
`, g2: `
.
.
.
.
...............QQQQQ
...........QQQQCCCCCQ
.......QQQQCCCCCCCCCC
....QQQCCCCCCCCCCCCCCQ
....CCCCCCCCCCCCCCcccc
...QCCCCCCCCCCccccwmmm
...CCCCCCCccccwwmmwmmm
...CCCcccckmwmmwmwmmmm
...cCCwwkwmmwmwmmwmmwm
....CCwQQwQQQQQQQQQQQQQ
....CCCCCCCCCCCCCCCCCCC
....CxCCCCCCCCCCCCCCxCC
....CCCCCCCNNNNNCCCCCCC
....CCCCCCCNwEENCCCCCCC
....CCCCCCCNEEENCCCCCCC
....CCCCCCCNEEENCCCCCCC
....CCCCCCCNNNNNCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CxCCCCCCCxCCCCCCxCC
....ccccccccccccccccccc
`, gm: { bite: `
..........QQQQQQQc
.........QCCCCCCcm
.......QQCCCCCCcmm
......QCCCCCCCcwmmm
.....QCCCCCCCcmmmmm
....QCCCCCCccmmmmmm
...QCCCCCCcmmwmmmmmm
..QCCCCCCcwmmmmmmmmm
..CCCCCCcmmmmmmmmmmm
..CCCCCcwkmmmmmmmmmmm
..CCCCckwkkmmmmmmmmmm
..cCCckkkTTTTTTTTTTTTTT
...cCkwwkTTttttttTTTTTtT
....CQQQQTTTTTTTQQQQQTTtT
....CCCCCCCCCCCCCCCCCCCttT
....CxCCCCCCCCCCCCCCxCC.TT
....CCCCCCCNNNNNCCCCCCC.TT
....CCCCCCCNwEENCCCCCCC.TT
....CCCCCCCNEEENCCCCCCC.TT
....CCCCCCCNEEENCCCCCCC.TT
....CCCCCCCNNNNNCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CxCCCCCCCxCCCCCCxCC
....ccccccccccccccccccc
`, leap: `
........QQQQQQQQcmm
......QQCCCCCCCcwmmm
.....QCCCCCCCccmwmmm
...QQCCCCCCCcwmmmmmm
..QCCCCCCCccmmmmmmmm
..CCCCCCCcwwmmmmmmmmm
..CCCCCCckmmmmmmmmmmm
..CCCCccwkkmmmmmmmmmm
..cCCckkkTTTTTTTTTTTTTT
...cCwwwkTTttttttTTTTTtT
....CQQQQTTTTTTTQQQQQTTtT
....CCCCCCCCCCCCCCCCCCCttT
....CxCCCCCCCCCCCCCCxCC.TT
....CCCCCCCNNNNNCCCCCCC.TT
....CCCCCCCNwEENCCCCCCC.TT
....CCCCCCCNEEENCCCCCCC.TT
....CCCCCCCNEEENCCCCCCC.TT
....CCCCCCCNNNNNCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CCCCCCCCCCCCCCCCCCC
....CxCCCCCCCxCCCCCCxCC
....ccccccccccccccccccc
.
.
.
` }, sh: [23, 13], hip: 99, ax: 13, wpn: 'none', still: 1, noArm: 1 },
  goldgolem: {   // 시안 A 금괴 골렘 (사용자가 고른 것): 쌓아 올린 금괴로 된 몸(금괴마다 위가 좁은 사다리꼴 · 사이 틈) · 금괴 머리에 박힌 루비 두 눈 · 금괴를 포갠 팔 · 짧은 금괴 다리 · 금 주먹
    pal: { C: '#f0c24a', Q: '#fff0a0', c: '#b8862a', d: '#7a5418', k: '#2a1a08', E: '#ff3a4a', e: '#ffc0c0', R: '#e8304a', r: '#ff9aa8', A: '#30c070', a: '#a8ffd0', B: '#3a7ae8', b: '#b8d8ff', F: '#d8a83a', f: '#9a6e1e' },
    g: `
............QQQQQQQ
............CCCCCCC
............CCCCCCC
............CCCeECEE
............CCCEECEE
............CCCCCCC
.
........CQQQQQQQQQQQQQ
........CCCCCFFFFCCCCC
....QQQQCCCCCCCCCCCCCC
....ccccddddddddddddddd
...ccccc.QQQQQQQQQQQQ
...ccccccCCCCCCCCCCCC
....QQQQ.CCCCCCCCCCCCC
....cccc.ddddddddddddd
...ccccc..QQQQQQQQQQQ
...cccccc.CCCCCCCCCCC
...QQQQQ.CCCCCCCCCCCC
...ccccc..dddddddddddd
..ccccccc.CQQQQQQQQQ
..ccccccc.CCCCCCCCCC
..........QQQ...QQQQ
.........cccc...CCCC
.........ccccc.CCCCC
.........QQQQQ..QQQQ
.........ccccc.CCCCCC
.........ccccccCCCCCC
`, sh: [21, 8], hip: 20, ax: 15, ms: 1.25, arm: ['C', 'c'], hand: 'C', wpn: 'rfist', idle: { h: [1, 3], a: 80 } }
});
Object.assign(PXU_ACT, {
  mimic: { atk: ['qbite'], skl: ['qmaul'], tk: 0.9, fx: { atk: { pal: 'gold', hit: 'bite' }, skl: { pal: 'gold', hit: 'coins', big: 1, after: 'dust' } } },
  goldgolem: { atk: ['side', 'down'], skl: ['smash'], tk: 1.25, fx: { atk: { pal: 'gold', hit: 'star', big: 1 }, skl: { pal: 'gold', hit: 'coins', big: 1, after: 'dust', shake: 1 } } }
});
// 만날 때마다 모습 하나: 기본 모습이 아닌 것은 드랍 없는 이름표 (pxuLook) · PXU_ACT는 기본 id에만
pxuLook('mimic_b', 'mimic', MONS.mimic.name);
Object.assign(PXU_SKIN, { mimic: ['mimic', 'mimic_b'] });
Object.assign(PXU_SKIN_NAME, { mimic: ['나무 보물 상자 미믹', '쇠 금고 미믹'] });
