/* ───────── 옆모습 모험가 (원정·레이드 화면) ─────────
   오른쪽을 본다. 머리 블록 14칸 × 12줄, 몸 블록 12칸 × 13줄. 작업판 40×48, 몸 블록 왼쪽 위 = (12, 34) */
const SX = 13, SY = 34, SHY = SY - 12;
// 얼굴 옆: 눈 하나, 코 끝, 볼 터치. 머리카락이 뒤통수를 덮는다
const PXS_FACE = pxRows(`
......sSSSSSSs.
.....SSSSSSSSSs
.....SSSSSwkSSs
.....SSSSSkkSSS
.....sSSSSSSSSs
.....pSSSSSmSs.
......sSSSSSs..
.......sssss...
`);
const PXS_HAIR = {
  short: pxRows(`
.....HHHHHH....
...HHHHHHHHHh..
..HHHLLHHHHHHh.
.HHHLHHHHHHHHh.
.HHHHHHHHHHHhh.
.HHHHHH........
.HHHHH.........
.hHHHH.........
.hHHHH.........
..hhHh.........
`),
  long: pxRows(`
.....HHHHHH....
...HHHHHHHHHh..
..HHHLLHHHHHHh.
.HHHLHHHHHHHHh.
.HHHHHHHHHHHhh.
.HHHHHH........
HHHHHH.........
HHHHHH.........
HhHHHH.........
HhHHHh.........
Hhhhhh.........
.hhhh..........
`),
  spiky: pxRows(`
....H..H..H....
...HHHHHHHHHh..
..HHHLLHHHHHHh.
HHHHLHHHHHHHHh.
.HHHHHHHHHHHhh.
.HHHHHH........
.HHHHH.........
.hHHHH.........
.hHHHH.........
..hhHh.........
`)
};
/* 머리 장식 옆모습. top = 머리 블록 0줄에서 위로 몇 줄 */
const PXS_HEAD = {
  helm: { top: 3, g: `
......RR.......
.....RRrr......
....NMRrr......
..NMxMMMMMNn...
.NMxMMMMMMMNn..
.NMxMMMMMMMMNn.
.NMMMMMMMMMMNn.
.gGoGGGGGGGGGg.
.NN............
.NN............
.NN............
.nn............
.nn............
` },
  hood: { top: 1, g: `
......JJJJ.....
....JJIJJJjj...
..JJIJJJJJJjj..
.JJIJJJJJJJJj..
.JIJJJJJJJJJjj.
.JJJJJJJJJJjj..
.JJJJJJJJj.....
.JJJJJJJJ......
.JJJJJJJj......
.jJJJJJJj......
.jJJJJJJj......
.JJJJJJJjj.....
..JJJJJJjjj....
` },
  hoodup: { top: 2, g: `
.......JJ......
.....JJJJjj....
...JJIJJJJJjj..
..JIJJJJJJJJj..
.JIJJJJJJJJJjj.
.JJJJJJJJJJJJj.
JJJJJJJKKKKjjjj
JJJJJJJK...Kjjj
JJJJJJJJ.......
JJJJJJJj.......
JjJJJJJj.......
jjJJJJJj.......
JJjJJJJjj......
.JJJJJJjjjj....
` },
  wizard: { top: 9, x: -1, g: `
...........Jj......
..........JJj......
..........JJJj.....
.........JJIJj.....
.........JIJJJj....
........JJIJJJjj...
.......JJIJJJJJjj..
......JJJJJJGJJJjj.
.....JJJJJJGGGJJJjj
....JJJJJJJJGJJJJJj
...JJJJJJJJJJJJJJJj
..GGGGGGGGGGGGGGGGG
JJJJJJJJJJJJJJJJJJj
.jjjjjjjjjjjjjjjjj.
` },
  coif: { top: 2, g: `
......ZZZZ.....
....ZZZZZZzz...
..ZZZZZZZZZZz..
.ZZZZZZZGZZZZz.
.ZZZZZZGGGZZZz.
.ZZZZZZZGZZZZz.
.ZZGGGGGGGGGGz.
.ZZZZZZZZ......
.ZZZZZZZZ......
.ZZZZZZZz......
.zZZZZZZz......
.zZZZZZZz......
.ZZZZZZZzz.....
..ZZZZZZzzz....
` },
  mitre: { top: 6, g: `
.......ZZ......
......ZZzz.....
.....ZZGZzz....
....ZZGGGZzz...
....ZZZGZZzz...
...ZZZZGZZZzz..
...ZZZZGZZZzz..
..GGGGGGGGGGGg.
..ZZZZZZZZZZzz.
.ZZZZZZZZ......
` },
  mitre2: { top: 8, g: `
.......GG......
......ZGGz.....
.....ZZGZzz....
....ZZGGGZzz...
...ZZZZGZZZzz..
...ZZGGGGGZzz..
..ZZZZZGZZZZz..
..ZZZZZGZZZZz..
..GGXGGGGGXGGg.
..GGGGGGGGGGGg.
..ZZZZZZZZZZzz.
.ZZZZZZZZ......
` },
  coif2: { top: 2, g: `
......KKKK.....
....KKKKKKKK...
..KKKKKKKKKKK..
.KKKKKKKKKKKKK.
.KKKKKKKKKKKKK.
.KKKKKKZZZZZZK.
.KKKKKKZZ......
.KKKKKKZ.......
.KKKKKKZ.......
.KKKKKKZ.......
KKKKKKKZ.......
KKKKKKKZ.......
KKKKKKKZZ......
KKKKKKKKZZZZ...
KKKKKKKK.......
` },
  cowl: { top: 1, g: `
......JJJJ.....
....JJJJJJjj...
...JJIJJJJJjj..
..JIIJJJJJJJj..
.JIJJJJJJJJJjj.
.FFFFFFFFFFFFf.
.JJJJJJJJJJJjj.
.JJJJJJJJ......
.JJJJJJJJ......
.jJJJJJJj......
.jJJJJJKKKKKKK.
..JJJJKKKKKKK..
....KKKKKKKK...
` },
  band: { top: 0, g: `
...............
...............
...............
...............
.FFFFFFFFFFFFf.
FF.............
F..............
` },
  glad: { top: 4, g: `
.......RR......
......RRRr.....
.....RRRRrr....
......RRrr.....
....GGGGGGgg...
..GGoGGGGGGGgg.
.GGoGGGGGGGGGg.
.GGGGGGGGGGGGg.
.gGGGGGGGGGGgg.
.gG............
.GG............
.GG............
.gg............
.gg............
` },
  laurel: { top: 0, g: `
...............
...............
...............
..GG..G..G..GG.
.GGGGGGGGGGGGg.
G.............g
` },
  great: { top: 3, g: `
......RRrr.....
.....RRRRrr....
....RRrrRRr....
..NMMMMMMMNn...
.NMxMMMMMMMNn..
.NMxMMMMMMMMNn.
.NMxMMMMMMMMNn.
.NMMMMMMMMMMNn.
.NMMMMMMMMMGNn.
.NMMMMMMMMMGNn.
.NMMMMMMKKKKKn.
.NMMMMMMMMMGNn.
.NMMMMMMNNNGNn.
.nNNNNNNNNNNnn.
..nNNNNNNNNNn..
....nnnnnnnn...
` },
  winged: { top: 3, g: `
x.......x......
Mx....xMN......
MMx.NMMMMN.....
NMMNMxMMMMNn...
.NMxMMMMMMMNn..
.NMxMMMMMMMMNn.
.NMMMMMMMMMMNn.
.GGGGGGGXGGGGg.
.NN............
.NN............
.NN............
.nn............
.nn............
` },
  horn: { top: 4, g: `
x......x.......
Zx....xz.......
.Zx..xz........
.ZZ..zz........
.ZZNMMMMMMNn...
..ZMxMMMMMMNn..
.NMxMMMMMMMMNn.
.NMMMMMMMMMMNn.
.gGGoGGGGGoGGg.
.NN............
.NN............
.nn............
` },
  dragon: { top: 4, g: `
..X....X.......
.XX...XX.......
.X...NMMN......
.XX.NMMxMMN....
..NMMxMMMMMN...
.NMMxMMMMMMMNn.
.NMxMMMMMMMMNn.
.NMMMMMMMMMMNn.
.nNXNNNNNNNXNn.
.NN............
.NN............
.nn............
.nn............
` },
  goggles: { top: 0, g: `
...............
...............
...............
...............
.KKKKKKKKKXZKK.
.K........XX..K
` },
  feather: { top: 4, g: `
......RR.......
.....RRr.......
....RRr........
...RRr.........
..JJJJJJJJjj...
.JJIIJJJJJJjj..
JJIJJJJJJJJJjj.
JJJJJJJJJJJJJjj
.jjjjjjjjjjjjj.
` },
  beret: { top: 2, g: `
.......RR......
..JJJJJJJRr....
.JJIJJJJJJJjj..
JJIJJJJJJJJJjj.
JJJJJJJJJJJJJj.
.jjjjjjjjjjjj..
` },
  circlet: { top: 0, g: `
...............
...............
...............
...............
.GGGGGGGGGGXGGg
..........X....
` },
  crown: { top: 3, g: `
..G...G..G...G.
..GG.GXG.GG.GG.
..GGGGXGGGGGGg.
..GXGGGGGGGXGg.
..GGGGGGGGGGGg.
..ooooooooooo..
` },
  bonecrown: { top: 3, g: `
..Z...Z..Z...Z.
..ZZ.ZZ..ZZ.ZZ.
..ZXZZZXXZZZXZ.
..zZZZZZZZZZZz.
` },
  tophat: { top: 7, x: -1, g: `
....JJJJJJJJJ....
....JJIJJJJJJJ...
....JJIJJJJJJJ...
....JIJJJJJJJJ...
....JJJJJJJJJJ...
....FFFFFFFFFF...
....JJJJJJJJJJ...
.JJJJJJJJJJJJJJJ.
..jjjjjjjjjjjjj..
` },
  widebrim: { top: 4, x: -3, g: `
........JJJJJJJ......
.......JJIJJJJJJ.....
.......JIJJJJJJJ.....
.......FFFFFFFFF.....
JJJJJJJJJJJJJJJJJJJJJ
.jjjjjjjjjjjjjjjjjjj.
` },
  beak: { top: 5, x: -1, g: `
.......JJJJJJ......
......JJIJJJJJ.....
......JIJJJJJJ.....
......JJJJJJJJ.....
.....JFFFFFFFFJ....
JJJJJJJJJJJJJJJJJJJ
.jjjjjjjjjjjjjjjjj.
...J.....zZZZZz....
...J.....ZZZZZZz...
...J.....ZZKKXZz...
...J.....ZZKXXZZz..
...J.....zZZZZZZZz.
...JJ....ZZZZzzZZZz
.....J...zZZZzzzzzz
.........zzz.......
` },
  monocle: { top: 0, g: `
...............
...............
...............
...............
...............
...............
...........GGG.
...........GXG.
...........GGG.
............G..
` },
  mask: { top: 0, g: `
...............
...............
...............
...............
...............
...............
........KKKKKK.
........KKKwkK.
.........KKkkK.
` },
  bones: { top: 0, g: `
...............
...............
...............
...............
...............
...............
.........zZZZz.
.........ZZKKXz
.........ZZKKKz
........zZZZZZz
........zZKZKZz
.........zZZZz.
` },
  pumpkin: { top: 2, g: `
........AA.....
.......jAa.....
.....jJJIJJj...
...jJJIJJJIJJj.
..jJJIJJJIJJJJj
.jJJIJJJIJJKKJj
.jJJIJJJIJJKKKj
.jJJIJJJIJJJJJj
.jJJIJJJIJKJJKj
.jJJJIJJJKKKKKj
..jJJIJJJJKJKj.
..jjJJJJJJJJj..
...jjJJJJJjj...
.....jjjjjj....
` },
  paint: { top: 0, g: `
...............
...............
...............
...............
...............
...............
...............
...............
...............
..........FF...
` }
};
/* 몸 옆모습: 12칸 × 8줄 + 다리 5줄. 가까운 팔은 앞으로 나와 손(S)이 오른쪽 끝 */
const PXS_BODY = {
  tunic: `
..cCCCCCCCc.
.cCCCCCCCCCc
.CCdCCCCCCCS
.CCdCCCCCCSs
.cCdCCCCCCCc
.WWWWWWGGWWW
..CCCCCCCCc.
...CCCCCCc..
`,
  leather: `
..cCCCCCCCc.
.cCCWWWWWCCc
.CCdWVVVVCCS
.WWdWVVVVWSs
.WWdWVVVVWWW
.WWWWWWGGWWW
..CCCCCCCCc.
...CCCCCCc..
`,
  chain: `
..nNNNNNNNn.
.nNNxNNNNNNn
.NNnNNxNNNNS
.NNnNNNNxNSs
.NxnNNNNNNNn
.WWWWWWGGWWW
..NNxNNNNNn.
...nNNNNNn..
`,
  plate: `
..NMMMMMMMNn
.NMxMMMMMMMN
.MMnMMxMMMMS
.MMnMMMMxMSs
.NNnnNNNNNNn
.GGGGGGGGGGG
..MxMMNNMMN.
...NMNnNMN..
`,
  scale: `
..cCCQCCCQc.
.cCCQCCQCCCc
.CQdCCQCCQCS
.CCdQCCCQCSs
.CQdCCQCCQCc
.GGGGGGGGGGG
..CQCCCQCCc.
...cCCcCCc..
`,
  robe: `
..cCCCCAACc.
.cCCCCCAACCc
.CCdCCCAACCS
.CCdCCCAACSs
.CCdCCCAACCc
.CCCCCCAACCc
.cCCCCCAACCc
.CCCCCCAACCc
`,
  coat: `
..CCCAAAACc.
.CCCdCAACCCc
.CCdCCAACCCS
.CCdCCAACCSs
.CCdCCAACCCc
.WWWWWWGGWWW
..CCCCAACCc.
..CC.CAAC.c.
`,
  bare: `
..sSSSSSSSs.
.sSSSSSSSSSs
.SSsSSWSSSSS
.SSsSSSWSSSs
.FFsSSSSSSSs
.WWWWWWGGWWW
..CCCCCCCCc.
...CCCCCCc..
`
};
const PXS_LEGS = {
  stand: `
...UUu.UUu..
...UUu.UUu..
...UUu.UUu..
..BBBb.BBBb.
..BBBBbBBBBb
`,
  walkA: `
..UUu..UUu..
.UUu....UUu.
BBBb.....UUu
BBBBb....BBBb
.........BBBBb
`,
  walkB: `
....UUUUu...
....UUUUu...
....UUUUu...
...BBBBBBb..
...BBBBBBBb.
`,
  sit: `
...UUUUUUUUu
...BBb....BBb
`,
  robe: `
..CCCCCCCCc.
..CCCCCCCCc.
.cCCCCCCCCcc
.cCCcCCCcCcc
...BBb.BBb..
`,
  robeA: `
..CCCCCCCCc.
..CCCCCCCCc.
.cCCCCCCCCcc
.cCCcCCCcCcc
.BBb.....BBb
`,
  robeB: `
..CCCCCCCCc.
..CCCCCCCCc.
.cCCCCCCCCcc
.cCCcCCCcCcc
.....BBBb...
`,
  robeSit: `
.cCCCCCCCCCc
.BBb.....BBb
`,
  coat: `
..CUUu.UUuC.
..CUUu.UUuC.
...UUu.UUu..
..BBBb.BBBb.
..BBBBbBBBBb
`
};
// 팔: up = 머리 옆으로 치켜들기 · out = 앞으로 뻗기 (덮개, 몸 블록 좌표)
const PXS_ARM = {
  up: { x: 9, y: -9, g: `
....SS
....Ss
....CC
....CC
...CCc
...CCc
...Cc.
..CCc.
.CCc..
CCc...
_.....
_.....
` },
  out: { x: 9, y: 1, g: `
CCCCCSS
cccccSs
__.....
` }
};
// 손 위치(몸 블록 좌표): rest(앞 손) · up · out · back(먼 손)
const PXS_HAND = { rest: [11, 2], up: [14, -9], out: [15, 1], back: [2, 3] };
// 방패: 먼 팔에 들어 몸 뒤로 보인다 (뒤에 깔림)
const PXS_SHIELD = {
  round: { x: -5, y: -1, g: `
..NNN..
.NOOOvN
NOOGOvvN
NOGGGvvN
NOOGOvvN
.NOvvvN
..NNN..
` },
  kite: { x: -5, y: -2, g: `
.NNNNN.
NFFGFFN
NFGGGfN
NFFGFfN
NFFGFfN
.NFGfN.
.NFfN..
..NN...
` },
  tower: { x: -6, y: -4, g: `
NNNNNNN
NZZGZZN
NZZGZzN
NGGGGGN
NZZGZzN
NZZGZzN
NZZGZzN
NZZGZzN
NZzGzzN
.NNNNN.
` }
};
// 활: 앞 손에 세워 든다 (몸 블록 좌표). draw = 당긴 모습
const PXS_BOW = {
  bow: { x: 10, y: -5, g: `
.O..
O.w.
O.w.
O.w.
O.w.
O.w.
O.w.
OSS.
O.w.
O.w.
O.w.
O.w.
O.w.
.O..
`, draw: `
.O....
O.w...
O..w..
O...w.
O....R
O....R
O...w.
OSS...
O...w.
O....w
O...w.
O..w..
O.w...
.O....
` },
  long: { x: 10, y: -8, g: `
.GO..
O.w..
O.w..
O.w..
O.w..
O.w..
O.w..
O.w..
O.w..
OSS..
O.w..
O.w..
O.w..
O.w..
O.w..
O.w..
O.w..
.GO..
`, draw: `
.GO.....
O.w.....
O..w....
O...w...
O....w..
O.....w.
O......R
O......R
O.....w.
OSS.....
O.....w.
O....w..
O...w...
O..w....
O.w.....
O.w.....
O.w.....
.GO.....
` }
};
// 덧붙이기 (몸 블록 좌표). under = 몸 뒤
const PXS_EX = {
  pauldron: { x: 7, y: -1, g: `
.NMMN.
NMxMMN
NMMNNn
.nnnn.
` },
  fur: { x: 6, y: -1, g: `
.WWWWW.
WWWVWWV
WVWVWVV
.V.V.V.
` },
  spike: { x: 7, y: -3, g: `
...x..
..xN..
.NMMN.
NMxMMN
NMMNNn
.nnnn.
` },
  tabard: { x: 4, y: 0, g: `
CCCC
CQAC
CAAc
CCCc
CCCc
....
CCCc
CCCc
.CC.
` },
  holy: { x: 6, y: 1, g: `
.G.
GGG
.G.
.G.
` },
  stole: { x: 5, y: 0, g: `
FF
Ff
Ff
Ff
Ff
Ff
Ff
GG
` },
  sash: { x: 2, y: 0, g: `
AA.....
.AaA...
..AaA..
...AaA.
....AaA
` },
  scarf: { x: -6, y: 0, g: `
.......FFFFFFf
.FFFFFFFfffff.
FFff..........
Ff............
f.............
` },
  quiver: { under: 1, x: -3, y: -4, g: `
.w.w
wRwR
.W.W
.WWV
.WWV
.WWV
..WV
..WV
` },
  pack: { under: 1, x: -8, y: -8, g: `
..FFFFFFFF..
.FFfFFfFFff.
.FffffffffF.
..ffffffff..
.WWWWWWWWWV.
WWVVVVVVVVVV
WWWWWGWWWWVV
WWWWWWWWWWVV
WWWWWWWWWWVV
WWWWWWWWWWVV
WWWWWWWWWWVV
WWWWWWWWWWVV
WWWWWWWWWWVV
WWGWWWWWWGVV
WWWWWWWWWWVV
.VVVVVVVVVV.
` },
  cape: { under: 1, x: -7, y: 0, g: `
.......RRRRRRRRr
......RRRRRRRRrr
.....RRRRRRRRrrr
....RRRRRRRRrrr.
...RRRRRRRRrrr..
..RRRRRRRRRrrr..
.RRRRRRRRRRrr...
.RRRRRRRRRRrr...
RRRRRRRRRRRrr...
RRRRRRRRRRrrr...
RRrrrrrrrrrr....
.rrrrrrrrrr.....
` },
  manica: { x: 9, y: 1, g: `
MN
xN
MN
` },
  book: { x: -3, y: 4, g: `
FFF
FZF
FFF
` },
  bag: { x: -4, y: 5, g: `
.WW.
WVVW
WGWW
WWWV
` },
  wisp: { x: -4, y: -8, g: `
.X...........X.
XZX.........XZX
.X...........X.
` },
  stars: { under: 1, x: -3, y: 2, g: `
x.........x
...........
.........x.
x..........
.......x...
` }
};
// 먼 손에 든 두 번째 칼 (몸 뒤에 작게 보인다)
function pxsAdvGrid(a, pose, fr, Lx) {
  const cls = PXL[a.cls] ? a.cls : PXL[jobBase(a.cls)] ? jobBase(a.cls) : 'warrior', L = Lx || PXL[cls];
  const ex = L.ex || [], g = pxGrid(PXW, PXH);
  const robe = L.body === 'robe', coat = L.body === 'coat';
  const wpn = a.eq && a.eq.weapon, base = wpn ? wpn.base : (typeof WEAPON_OF !== 'undefined' && WEAPON_OF[a.cls]) || 'sword';
  const wk = pxWeapon(a.cls, base), bow = wk === 'bow' || wk === 'long', lute = wk === 'lute';
  const atk = pose === 'atk' ? fr % 2 : -1, sit = pose === 'sit', sd = sit ? 3 : 0;
  const arm = bow || lute || sit ? 'rest' : atk === 0 ? 'up' : atk === 1 ? 'out' : 'rest';
  const armTone = L.body === 'plate' || L.body === 'chain' ? { C: 'M', c: 'N' } : L.body === 'bare' ? { C: 'S', c: 's' } : {};
  // 뒤: 망토·화살통·짐·방패·두 번째 칼
  for (const e of ex) { const E = PXS_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), SX + E.x, SY + E.y + sd); }
  if (L.shield && !sit) { const Sd = PXS_SHIELD[L.shield]; pxPut(g, pxRows(Sd.g), SX + Sd.x, SY + 3 + Sd.y); }
  if (L.twin && !sit) { const D = pxRows(PX_WPN[wk === 'sword' || wk === 'great' ? 'sword' : 'dagger']), [bx, by] = pxFind(D, '@'); pxPut(g, D, SX + PXS_HAND.back[0] - bx, SY + PXS_HAND.back[1] - by, 'v'); }
  // 몸
  const body = pxRows(PXS_BODY[L.body] || PXS_BODY.tunic);
  const legs = pxRows(PXS_LEGS[sit ? (robe ? 'robeSit' : 'sit') : robe ? (pose === 'walk' ? ['robeA', 'robe', 'robeB', 'robe'][fr % 4] : 'robe') : pose === 'walk' ? ['walkA', 'stand', 'walkB', 'stand'][fr % 4] : coat ? 'coat' : 'stand']);
  pxPut(g, body.concat(legs), SX, SY + sd);
  for (const e of ex) { const E = PXS_EX[e]; if (E && !E.under && e !== 'mask' && e !== 'paint') pxPut(g, pxRows(E.g), SX + E.x, SY + E.y + sd); }
  // 머리
  const hair = PXS_HAIR[L.hair || ['short', 'long', 'spiky'][(a.id || 0) % 3]] || PXS_HAIR.short;
  pxPut(g, hair, SX - 1, SHY + sd);
  pxPut(g, PXS_FACE, SX - 1, SHY + 4 + sd);
  if (L.face) { const F = PXS_HEAD[L.face]; pxPut(g, pxRows(F.g), SX - 1 + (F.x || 0), SHY - F.top + sd); }
  for (const e of ['mask', 'paint']) if (ex.includes(e)) pxPut(g, pxRows(PXS_HEAD[e].g), SX - 1, SHY + sd);
  const H = PXS_HEAD[L.head];
  if (H) pxPut(g, pxRows(H.g), SX - 1 + (H.x || 0), SHY - H.top + sd);
  // 팔과 무기
  if (arm !== 'rest') { const A = PXS_ARM[arm]; pxPut(g, pxTone(pxRows(A.g), armTone), SX + A.x, SY + A.y + sd); }
  if (bow) { const B = PXS_BOW[wk]; pxPut(g, pxRows(atk === 0 ? B.draw : B.g), SX + B.x, SY + B.y + sd); }
  else if (lute) { const W = pxRows(PX_WPN.lute), [ax, ay] = pxFind(W, '@'); pxPut(g, W, SX + 8 - ax, SY + 4 - ay + (atk === 1 ? 1 : 0) + sd, 'O'); }
  else if (!sit) {
    const pole = ['staff', 'skull', 'crozier', 'lance'].includes(wk), up = pxRows(PX_WPN[wk] || PX_WPN.sword);
    const rows = arm === 'out' || (arm === 'rest' && !pole) ? pxRot(up) : up, [ax, ay] = pxFind(rows, '@'), [hx, hy] = arm === 'rest' && !pole ? [11, 4] : PXS_HAND[arm];
    pxPut(g, rows, SX + hx - ax, SY + hy - ay, 'v');
    if (arm === 'rest') pxPut(g, ['S', 's'], SX + hx - 1, SY + hy);
  }
  if (ex.includes('pauldron') && arm === 'rest') pxPut(g, pxRows(PXS_EX.pauldron.g), SX + PXS_EX.pauldron.x, SY + PXS_EX.pauldron.y + sd);
  const bob = (pose === 'idle' && fr % 2) || (pose === 'walk' && fr % 2 === 0);
  if (bob) for (let y = SY + 8 + sd; y > 0; y--) g[y] = g[y - 1].slice(), y === 1 && (g[0] = new Array(PXW).fill('.'));
  return g;
}
// 쓰러짐: 등을 땅에 대고 누운 모습 (발이 오른쪽)
function pxsDownGrid(a, L) {
  const g = pxGrid(PXW, PXH);
  pxPut(g, pxRows(`
.....HHHHH.......................
...HHLHHHHhh.....................
..HLHHHHHHHh.cCCCCCCCCCCCCCcc....
..HHSSSSSHHh.CCCCCCCCCCCCCCCcUUUu
.HHSSkkSSSShcCCCCdCCCCCCCCCcUUUBB
.HhSSSSSpSShCCCCCCCCCCCCCCCcUUUBB
..hSSSSSSSs.cWWWWWWWGGWWWWWccBBBb
...ssSSSSs...cccccccccccccc.....
`), 4, 38);
  return g;
}
function pxsAdvSprite(a, pose, fr, Lx) {
  const look = a.look || {}, w = a.eq && a.eq.weapon, cls = PXL[a.cls] ? a.cls : 'warrior', L = Lx || advLook(a);
  const key = 'PS|' + (Lx ? (Lx.c1 || '') + (Lx.head || '') : a.skin || '') + a.cls + '|' + (look.hair || '') + (look.skin || '') + '|' + ((a.id || 0) % 3) + '|' + (w ? w.base : '-') + '|' + pose + fr;
  const hit = PXC.get(key + '|' + (FLASH || ''));
  if (hit) return hit;
  const g = pose === 'sleep' ? pxSleepGrid(a, L) : pose === 'down' ? pxsDownGrid(a, L) : pxsAdvGrid(a, pose, fr, L);
  return pxBake(key, g, pxPal(L, look), SX + 6, SY + 13);
}
