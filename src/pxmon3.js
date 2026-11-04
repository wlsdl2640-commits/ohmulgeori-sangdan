/* ───────── 빌드 30 몬스터 손 도트 (반 해상도 → 두 배, pxmon2.js와 같은 방식) ─────────
   글자: C 몸 · c 그늘 · d 짙음 · Q 밝음 · K 먹 · w 흰 · e 눈빛 · v 나무 · S 살 · s 살 그늘 · 그 밖은 pal. */
const PXM3 = {
  // ── 만년설산: 고산지대 산양 ──
  alpgoat: { h: `
..........HH
.........HCC
........CCCe
.......CCCCK
..CCCCCCCC..
.CCCCCCCCC..
.CCCCCCCC...
.CCc...CCc..
.cc....cc...
.KK....KK...
`, pal: { H: '#8a7a5a', e: '#2a1e1a', K: '#3a3230' } },
  // ── 안개 묘지 ──
  wisp: { h: `
....QQ....
...QwwQ...
..QwwwwQ..
..CwwwwC..
..CCeeCC..
...CCCC...
....cc....
...c..c...
`, pal: { w: '#e8fbff', e: '#1a2a3a' } },
  zombie: { h: `
....SSSS....
....SeSe....
....SSSS....
...CCCCCC...
..CCCCCCCC.S
..CCCCCCCCSS
...CCCCCC...
...CC..CC...
...cc..cc...
...KK..KK...
`, pal: { e: '#e0e060', K: '#2a2a20' } },
  banshee: { h: `
...QQQQQQ...
..QSSSSSSQ..
..QSeSSeSQ..
..QSSSSSSQ..
...CCCCCC...
..CCCCCCCC..
..CCCCCCCC..
.CCCCCCCCCC.
.CC.CCCC.CC.
....C..C....
`, pal: { e: '#4a4aa8', Q: '#e8f0ff' } },
  wraith: { h: `
....KKKK....
...KCCCCK...
...KeeeeK...
...KCCCCK...
..CCCCCCCC..
.CCCCMMCCCC.
.CCCCMMCCCCG
..CCCCCCCC.G
..CCC..CCC.G
..ccc..ccc.G
`, pal: { e: '#8ad8ff', K: '#1a2030', M: '#8a9ab8', G: '#9aa8c8' } },
  ghosttree: { h: `
..LLLLLLL...
.LLLLLLLLL..
LLLLeeLLLLL.
.LLLLLLLLL..
..LLCCCLL...
....CCC.....
...CCCCC....
..CCCCCCC...
..CC.C.CC...
.cc..c..cc..
`, pal: { L: '#8ae0c0', e: '#ffffff' } },
  mummy: { h: `
....CCCC....
....CeCe....
....CCCC....
...CCCCCC...
..CCCCCCCC..
..CCCCCCCC..
...CCCCCC...
...CC..CC...
...CC..CC...
...cc..cc...
`, pal: { e: '#e04a4a' } },
  reaper: { h: `
....KKKKKK....G.
...KKKKKKKK...G.
...KKSSSSKK...G.
...KKSeSeKK..GGG
...KKSSSSKK.GGGG
..CCCCCCCCCC..G.
.CCCCCCCCCCCC.G.
.CCCCCCCCCCCC.G.
.CCCCCCCCCCCC.G.
..CCCCCCCCCC..G.
..CC.CCCC.CC..G.
..cc..cc..cc..G.
`, pal: { e: '#8ad8ff', K: '#141420', G: '#c0c8d8' } },
  deathknight: { h: `
....KKKKKK......
...KKCCCCKK.....
...KKeeeeKK.....
...KKCCCCKK.....
..CCCCCCCCCC.GG.
.CCCMMMMMMCCC.G.
.CCCMMMMMMCCC.G.
.CCCCCCCCCCCC.G.
.CCCCCCCCCCCCGGG
..CCCC..CCCC..G.
..CCCC..CCCC..G.
..cccc..cccc..G.
`, pal: { e: '#ff4a6a', K: '#1e1e34', M: '#6a6a9a', G: '#9aa0c0' } },
  // ── 용암 화산 ──
  magmaslime: { h: `
...QQQQ...
..QQQQQQ..
.CCQQQQCC.
.CCCeeCCC.
.CCCCCCCC.
CCCCCCCCCC
.cccccccc.
`, pal: { e: '#2a1008', Q: '#ffd040' } },
  firebat: { h: `
C..........C
CC..CCCC..CC
CCCCCeeCCCCC
.CCCCCCCCCC.
..CC.CC.CC..
...C....C...
`, pal: { e: '#ffe060' } },
  salamander: { h: `
..........CC
.........CCe
........CCCC
.CCCCCCCCCK.
CCCCCCCCCC..
.CCQQQQCC...
.CC....CC...
.cc....cc...
`, pal: { e: '#ffffff', K: '#ffd040', Q: '#ffd040' } },
  lavagolem: { h: `
...CCCCCC...
..CCCCCCCC..
..CCeeeeCC..
..CCCCCCCC..
.CCCMMMMCCC.
CCCCMMMMCCCC
CCCCCCCCCCCC
.CCCCCCCCCC.
..CCC..CCC..
..ccc..ccc..
`, pal: { e: '#ffd040', M: '#ff8a30' } },
  redhare: { h: `
.........KK.
........CCQK
.......CCCCe
......CCCCK.
..CCCCCCCC..
.CCCCCCCCC..
.CCCCCCCC...
.CCc...CCc..
.cc....cc...
.KK....KK...
`, pal: { e: '#ffffff', K: '#4a1a10', Q: '#ff8a60' } },
  efreet: { h: `
.....QQQQ...
....QQQQQQ..
...QQSSSSQ..
...QSSeeSSQ.
....SSSSSS..
...CCCCCCCC.
..CCCCCCCCCC
..CCCCCCCCCC
...CCCCCCCC.
....CCCCCC..
.....CCCC...
......CC....
`, pal: { e: '#2a1008', Q: '#ffd040' } },
  magmadragon: { h: `
...........CCC..
..........CCCeC.
.........CCCCCK.
........CCCCK...
.CC....CCCCC....
.CCC..CCCCCC....
..CCCCCCCCCC....
...CCMMMMCCC....
...CCMMMMCCCC...
....CCCCCCCCC...
....CC....CCC...
....cc.....cc...
`, pal: { e: '#ffd040', K: '#ffd040', M: '#ff8a30' } },
  firelord: { h: `
.....QQQQQQ.....
....QQQQQQQQ....
...QQSSSSSSQQ...
...QSSeeeeSSQ...
...QSSSSSSSSQ...
....SSSSSSSS....
..CCCCCCCCCCCC..
.CCCCCCCCCCCCCC.
.CCCCCCCCCCCCCC.
..CCCCCCCCCCCC..
...CCCCCCCCCC...
....CCCCCCCC....
.....CCCCCC.....
......CCCC......
`, pal: { e: '#2a1008', Q: '#ffd040' } },
  // ── 세계수 뿌리 ──
  rootspider: { h: `
K..........K
.K..CCCC..K.
..KCCeeCCK..
..CCCCCCCC..
.KCCCCCCCCK.
K..CC..CC..K
...c....c...
`, pal: { e: '#8aff8a', K: '#3a2e1a' } },
  treantguard: { h: `
..LLLLLLLL..
.LLLLLLLLLL.
LLLLLeeLLLLL
.LLLLLLLLLL.
..LLCCCCLL..
..CCCCCCCC..
.CCCCCCCCCC.
.CCCCCCCCCC.
..CCC..CCC..
.ccc....ccc.
`, pal: { L: '#3a8a3a', e: '#ffe060' } },
  dryad: { h: `
...LLLLLL...
..LLSSSSLL..
..LLSeSeLL..
..LLSSSSLL..
...LCCCCL...
..CCCCCCCC..
..CCCCCCCC..
..CCCCCCCC..
...CC..CC...
...cc..cc...
`, pal: { L: '#4aa84a', e: '#2a6a3a' } },
  mossgolem: { h: `
...CCCCCC...
..CCCCCCCC..
..CCeeeeCC..
.CCCCCCCCCC.
.CCCMMMMCCC.
CCCCMMMMCCCC
CCCCCCCCCCCC
.CCCCCCCCCC.
..CCC..CCC..
..ccc..ccc..
`, pal: { e: '#c8ff80', M: '#c8ff80' } },
  rootworm: { h: `
............
.......ccc..
.....CCCCCc.
...CCQQQCCc.
.CCCQQQCCc..
.CQQQCCCc...
.CCCCcc.ee..
..ccc...KK..
`, pal: { e: '#8aff8a', K: '#3a2e1a' } },
  worldserpent: { h: `
..........CCCC..
.........CCeeCC.
........CCCCCCK.
.......CCCCCK...
.....CCCCCCC....
...CCCQQQCCC....
..CCCQQQCCC.....
.CCCQQQCCC......
.CCCCCCCC.......
..CCCCCC........
...CCCC.........
....cc..........
`, pal: { e: '#ffe060', K: '#1a4a2e', Q: '#8ad8a0' } },
  corruptheart: { h: `
..LLLLLLLLLL....
.LLLLLLLLLLLL...
LLLLLeeLLLLLLL..
.LLLLLLLLLLLL...
..LLLCCCCLLL....
....CCMMCC......
...CCCMMCCC.....
..CCCCCCCCCC....
..CCCCCCCCCC....
..CCC.CC.CCC....
.ccc..cc..ccc...
`, pal: { L: '#c060e0', e: '#ff4a8a', M: '#ff4a8a' } },
  // ── 구름섬 ──
  cloudsheep: { h: `
...QQQQQQ...
..QQQQQQQQ..
.QQQQQQQQQK.
.QQQQQQQQKeK
.QQQQQQQQQK.
..QQQQQQQQ..
..KK....KK..
`, pal: { e: '#2a2a34', K: '#4a4a5a', Q: '#f4f8ff' } },
  skyray: { h: `
.....CCCC.....
...CCCCCCCC...
.CCCCCeeCCCCC.
CCCCCCCCCCCCCC
.CCCCCCCCCCCC.
...CCCCCCCC...
.....CCCC...cc
......CC..cc..
`, pal: { e: '#1a2a4a' } },
  thunderbird: { h: `
C..........C
CC..CCCC..CC
CCCCCeeCCCCC
.CCCCCCCCCC.
..CCCCCCCC..
...CCQQCC...
....CCCC....
.....KK.....
`, pal: { e: '#2a2a34', Q: '#ffffff', K: '#a88a1a' } },
  pegasus: { h: `
..........CC
.........CCQ
........CCCe
...QQ..CCCK.
..QQQCCCCC..
.QQQCCCCCC..
..QCCCCCC...
..CCc...CCc.
..cc....cc..
..KK....KK..
`, pal: { e: '#4a6ab8', K: '#8a8aa8', Q: '#e8f0ff' } },
  cloudgiant: { h: `
.....CCCC.....
....CCCCCC....
....CeCCeC....
....CCCCCC....
..CCCCCCCCCC..
.CCCCCCCCCCCC.
.CCCCCCCCCCCC.
.CC.CCCCCC.CC.
....CCCCCC....
....CCC.CC....
....ccc.cc....
`, pal: { e: '#2a3a6a' } },
  skyknight: { h: `
....KKKK....
...KSSSSK...
...KSeSeK...
...KSSSSK...
.CCCCCCCCCC.
CCCCCCCCCCCC
CCCCQQQQCCCC
.CCCCCCCCCC.
...CC..CC...
...cc..cc...
`, pal: { e: '#2a1e1a', K: '#c8d8f0', Q: '#ffffff' } },
  skytitan: { h: `
......CCCC......
.....CCCCCC.....
.....CeCCeC.....
.....CCCCCC.....
...CCCCCCCCCC...
..CCCCCCCCCCCC..
.CCCCCMMMMCCCCC.
.CCCCCMMMMCCCCC.
.CC.CCCCCCCC.CC.
....CCCCCCCC....
....CCCC.CCC....
....cccc.ccc....
`, pal: { e: '#ffffff', M: '#ffffff' } },
  skyemperor: { h: `
.....GGGGGG.....
....GSSSSSSG....
....GSeSSeSG....
....GSSSSSSG....
..CCCCCCCCCCCC..
.CCCCCCCCCCCCCC.
.CCCCMMMMMMCCCC.
.CCCCCCCCCCCCCC.
..CCCCCCCCCCCC..
...CCC....CCC...
...ccc....ccc...
`, pal: { e: '#4a6ab8', G: '#ffd040', M: '#ffffff' } },
  // ── 보물 던전 ──
  mimic: { h: `
..CCCCCCCC..
.CCCCCCCCCC.
.CCCCCCCCCC.
.CwKwKwKwKC.
.CKRRRRRRKC.
.CCCCCCCCCC.
.CCCCCCCCCC.
..cc.cc.cc..
`, pal: { w: '#ffffff', K: '#2a1a0a', R: '#e05a7a' } },
  goldgolem: { h: `
...CCCCCC...
..CCCCCCCC..
..CCeeeeCC..
..CCCCCCCC..
.CCCMMMMCCC.
CCCCMMMMCCCC
CCCCCCCCCCCC
.CCCCCCCCCC.
..CCC..CCC..
..ccc..ccc..
`, pal: { e: '#ffffff', M: '#ffffff' } },
  treasureguard: { h: `
....CCCCCC....
...CCCCCCCC...
...CCeeeeCC...
...CCCCCCCC...
..CCCMMMMCCC..
.CCCCMMMMCCCC.
.CCCCCCCCCCCC.
.CCCCCCCCCCCC.
..CCCC..CCCC..
..cccc..cccc..
`, pal: { e: '#ff6a5a', M: '#ff6a5a' } }
};
// 마구간의 말: 한 그림에 종류마다 다른 색 (당나귀만 귀가 길다)
const HORSE_GRID = `
.........KK.
........CCQK
.......CCCCe
......CCCCK.
..CCCCCCCC..
.CCCCCCCCC..
.CCCCCCCC...
.CCc...CCc..
.cc....cc...
.KK....KK...
`;
const DONKEY_GRID = `
........K.K.
........CCQ.
.......CCCCe
......CCCCK.
..CCCCCCCC..
.CCCCCCCCC..
.CCCCCCCC...
.CCc...CCc..
.cc....cc...
.KK....KK...
`;
const HORSE_LOOK = {
  old:    { body: '#8a7a6a', dark: '#5a4e42', mane: '#6a6058' },
  donkey: { body: '#9a9088', dark: '#625a52', mane: '#4a4440' },
  gray:   { body: '#a8743e', dark: '#6a4824', mane: '#4a3018' },
  black:  { body: '#2e2a30', dark: '#1a181c', mane: '#0e0c10' },
  white:  { body: '#f0f0f4', dark: '#b8b8c4', mane: '#d8d8e0' },
  war:    { body: '#5a3a2a', dark: '#38241a', mane: '#1e1410' },
  noble:  { body: '#c08a3a', dark: '#7a5420', mane: '#f0d070' }
};
Object.keys(HORSE_LOOK).forEach(k => {
  const L = HORSE_LOOK[k];
  PXM3['horse_' + k] = { h: k === 'donkey' ? DONKEY_GRID : HORSE_GRID, pal: { e: '#ffffff', K: L.mane, Q: L.mane } };
  MONS['horse_' + k] = { name: HORSES[k].name, plan: 'pet', body: L.body, dark: L.dark, mh: 0, ma: 0, md: 0, spd: 1, drops: [], horse: k };
});
// 반 해상도 → 두 배
Object.keys(PXM3).forEach(id => {
  const M = PXM3[id], rows = M.h.split('\n').filter(r => r.trim().length);
  const W = Math.max(...rows.map(r => r.length));
  const g = ['.'.repeat(W * 2 + 1)].concat(rows.map(r => '.' + r.padEnd(W, '.').split('').map(ch => ch + ch).join('')).flatMap(r => [r, r])).join('\n');
  PXM[id] = { g: '\n' + g + '\n', pal: M.pal || {} };
});
// 새 펫 새끼 (pxpet.js와 같은 방식)
const PXPET3 = {
  goat: { h: `
.HH..HH.
.CCCCCC.
.CeCCCCK
CCCCCC..
.CC.CC..
.KK.KK..
`, pal: { e: '#2a1e1a', H: '#8a7a5a', K: '#3a3230' } },
  wyvern: { h: `
...CCC..
..CCeCK.
.CCCCCC.
CCCCCC..
.CC.CC..
.cc.cc..
`, pal: { e: '#ffe060', K: '#e8e2d0' } },
  redhare: { h: `
.....QQ.
....CCQC
...CCCe.
.CCCCC..
.CCCCC..
.KK.KK..
`, pal: { Q: '#ff8a60', e: '#ffffff', K: '#4a1a10' } },
  pegasus: { h: `
.....QQ.
..Q.CCQC
.QQCCCe.
.QCCCC..
.CCCCC..
.KK.KK..
`, pal: { Q: '#e8f0ff', e: '#4a6ab8', K: '#8a8aa8' } }
};
Object.keys(PXPET3).forEach(k => {
  const M = PXPET3[k], rows = M.h.split('\n').filter(r => r.trim().length), W = Math.max(...rows.map(r => r.length));
  const g = ['.'.repeat(W * 2 + 1)].concat(rows.map(r => '.' + r.padEnd(W, '.').split('').map(ch => ch + ch).join('')).flatMap(r => [r, r])).join('\n');
  PXM['pet_' + k] = { g: '\n' + g + '\n', pal: M.pal || {} };
  const P = PETS[k], m = MONS[P.mon];
  MONS['pet_' + k] = { name: P.name, plan: 'pet', body: m.body || m.skin || '#8a8a8a', dark: m.dark, skin: m.skin, mh: 0, ma: 0, md: 0, spd: 1, pet: k, drops: [] };
});
