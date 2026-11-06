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
.NMMMMMMKKwwKn.
.NMMMMMMKKwwKn.
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
  const cls = PXL[a.cls] ? a.cls : PXL[jobBase(a.cls)] ? jobBase(a.cls) : 'warrior', L0 = Lx || PXL[cls], [L, Q] = pxOffLook(a, L0);
  const ex = L.ex || [], g = pxGrid(PXW, PXH);
  const robe = L.body === 'robe', coat = L.body === 'coat';
  const wpn = a.eq && a.eq.weapon, base = wpn ? wpn.base : (typeof WEAPON_OF !== 'undefined' && WEAPON_OF[a.cls]) || 'sword';
  const wk = pxWeapon(a.cls, base), bow = wk === 'bow' || wk === 'long', lute = wk === 'lute';
  const atk = pose === 'atk' ? fr % 2 : -1, sit = pose === 'sit', sd = sit ? 3 : 0;
  const arm = bow || lute || sit ? 'rest' : atk === 0 ? 'up' : atk === 1 ? 'out' : 'rest';
  const armTone = L.body === 'plate' || L.body === 'chain' ? { C: 'M', c: 'N' } : L.body === 'bare' ? { C: 'S', c: 's' } : {};
  // 뒤: 망토·화살통·짐·방패·두 번째 칼
  for (const e of ex) { const E = PXS_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), SX + E.x, SY + E.y + sd); }
  if (L.shield && !sit && !(a.eq && a.eq.off && PX_SHIELD_SHAPE[a.eq.off.base])) { const Sd = PXS_SHIELD[L.shield]; pxPut(g, pxRows(Sd.g), SX + Sd.x, SY + 3 + Sd.y); }
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
  else if (lute) { const W = pxRows(PX_WPN.lute), [ax, ay] = pxFind(W, '@'); pxPut(g, W, SX + 8 - ax, SY + 4 - ay + (atk === 1 ? 1 : 0) + sd, 'K'); }
  else if (!sit) {
    const pole = ['staff', 'skull', 'crozier', 'lance'].includes(wk), up = pxRows(PX_WPN[wk] || PX_WPN.sword);
    const rows = arm === 'out' || (arm === 'rest' && !pole) ? pxRot(up) : up, [ax, ay] = pxFind(rows, '@'), [hx, hy] = arm === 'rest' && !pole ? [11, 4] : PXS_HAND[arm];
    pxPut(g, rows, SX + hx - ax, SY + hy - ay, 'v');
    if (arm === 'rest') pxPut(g, ['S', 's'], SX + hx - 1, SY + hy);
  }
  if (ex.includes('pauldron') && arm === 'rest') pxPut(g, pxRows(PXS_EX.pauldron.g), SX + PXS_EX.pauldron.x, SY + PXS_EX.pauldron.y + sd);
  const bob = (pose === 'idle' && fr % 2) || (pose === 'walk' && fr % 2 === 0);
  if (bob) for (let y = SY + 8 + sd; y > 0; y--) g[y] = g[y - 1].slice(), y === 1 && (g[0] = new Array(PXW).fill('.'));
  // 부장비 (빌드 39)
  if (Q) pxQuiverPut(g, Q, 'side', (sit ? 6 : 0) + (bob ? 2 : 0));
  const O = pxOffOf(a, L0); if (O) pxOffPut(g, O, pose, fr, 'side');
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
/* ───────── 공격 동작 (빌드 40): 칼을 든 옆모습을 여러 장으로 ─────────
   몸·머리·다리는 서 있는 그림을 뭉툭 칸으로 줄여 쓰고, 팔·손·칼·방패는 뭉툭 칸 위에 그린다 → 두 배로 키워 굽는다(뭉툭 굽기를 다시 거쳐도 그대로).
   좌표는 뭉툭 칸: 작업판 40×48 → 20×24 (칼이 앞으로 길게 나가도록 28칸). 어깨 (11, 17) · 발밑 (9.5, 23.5).
   한 장: h 손(어깨에서) · a 칼 방향(도: 0 앞 · -90 위 · 90 아래 · 180 뒤) · k 칼 길이(앞뒤로 누우면 짧다) · th 횡베기 칼끝 타원 각도(h·a·k를 대신, 90 = 카메라 쪽)
          lean 위 몸 기울기 · cr 웅크림 · legs 다리 · dx 몸이 나간 칸 · wu 칼이 몸 뒤 · sh 방패 [x, y, 몸 앞(1)] · fx 효과(arc 칼끝 자취 · streak 찌르기 · bash 충격 · block 불꽃) */
const PXS_MW = 28, PXS_SH = [11, 17], PXS_HZ = { rh: [3, 1], rt: [8, 2.5] };
const PXS_MLEGS = { lunge: ['..UUUUu..', '.Uu...Uu.', 'BB....BBb'] };   // 내딛기 (x 6부터 · y 21~23)
const PXS_MOT = {
  down: [   // 내려베기
    { h: [1, -2], a: -70 },
    { h: [2, -5], a: -95, lean: -1 },
    { h: [2, -6], a: -120, lean: -1 },
    { h: [3, -4], a: -45, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: 15, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [3, 2], a: 65, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, 2], a: 45, legs: 'lunge', dx: 3 },
    { h: [1, 1], a: 15, dx: 1 }
  ],
  up: [   // 올려베기
    { h: [1, 2], a: 40 },
    { h: [-1, 2], a: 140, lean: -1 },
    { h: [-2, 2], a: 160, lean: -1 },
    { h: [2, 1], a: 80, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: -20, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [2, -4], a: -75, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, -4], a: -85, legs: 'lunge', dx: 3 },
    { h: [1, -1], a: -30, dx: 1 }
  ],
  side: [   // 횡베기: 칼끝이 납작한 타원을 돈다 (앞쪽 반은 몸 앞, 먼 쪽 반은 몸 뒤)
    { th: 140, hy: -1, lean: -1 },
    { th: 165, hy: -2, lean: -1 },
    { th: 178, hy: -2, lean: -1 },
    { th: 125, hy: -1, fx: { k: 'arc', a: 0.75 } },
    { th: 65, hy: -1, legs: 'lunge', dx: 2, fx: { k: 'arc', a: 0.9, long: 1 } },
    { th: 5, hy: -1, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', long: 1 } },
    { th: -45, hy: -1, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [1, 0], a: -10, k: 0.8, dx: 2 }
  ],
  thrust: [   // 찌르기
    { h: [1, 0], a: 0 },
    { h: [-1, 0], a: 0, lean: -1 },
    { h: [-2, 0], a: -4, lean: -1, cr: 1 },
    { h: [2, 0], a: 0, legs: 'lunge', dx: 2 },
    { h: [3, 0], a: 0, lean: 1, legs: 'lunge', dx: 5, fx: { k: 'streak' } },
    { h: [3, 0], a: 0, lean: 1, legs: 'lunge', dx: 6, fx: { k: 'streak', star: 1 } },
    { h: [2, 0], a: 0, legs: 'lunge', dx: 4 },
    { h: [1, 0], a: 0, dx: 1 }
  ],
  bash: [   // 방패 밀기: 몸을 틀며 방패를 몸 앞으로 → 내딛으며 민다
    { h: [-1, 1], a: 120, lean: -1, sh: [5, 16, 1] },
    { h: [-2, 1], a: 150, lean: -1, sh: [8, 16, 1] },
    { h: [-2, 1], a: 150, legs: 'lunge', dx: 2, sh: [10, 16, 1] },
    { h: [-2, 1], a: 150, lean: 1, legs: 'lunge', dx: 5, sh: [11, 16, 1], fx: { k: 'bash', speed: 1 } },
    { h: [-2, 1], a: 150, lean: 1, legs: 'lunge', dx: 6, sh: [11, 16, 1], fx: { k: 'bash', r: 2 } },
    { h: [-2, 1], a: 150, legs: 'lunge', dx: 5, sh: [10, 16, 1] },
    { h: [-1, 1], a: 120, dx: 3, sh: [7, 16, 1] },
    { h: [0, 1], a: 40, dx: 1, sh: [3, 17, 0] }
  ],
  block: [   // 방패 막기: 몸은 젖히고 방패만 앞으로 · 웅크려 뒤로 밀린다
    { h: [-1, 1], a: 120, sh: [6, 16, 1] },
    { h: [-2, 1], a: 140, lean: -1, sh: [9, 15, 1] },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, sh: [11, 14, 1] },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, dx: -2, sh: [11, 14, 1], fx: { k: 'block' } },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, dx: -2, sh: [11, 14, 1], fx: { k: 'block', r: 2 } },
    { h: [-1, 1], a: 120, cr: 1, dx: -1, sh: [10, 15, 1] },
    { h: [0, 1], a: 80, sh: [7, 16, 1] },
    { h: [0, 1], a: 30, sh: [3, 17, 0] }
  ]
};
// 다른 동작의 장을 빌리거나 새로 짠 동작 (효과 없이, 빌드 40~41): raise 칼 치켜들기(강화·함성) · guard 방패 세우기(방어 강화·보호막)
//   salute 칼을 얼굴 앞에 세우기(치유) · taunt 칼끝으로 겨누기(도발) · parry 칼을 비스듬히 세워 흘려 받기 · ready 칼을 당겨 웅크린 되치기 자세 · toss 아래에서 위로 뿌리기(모래)
const pxsBorrow = (src, list) => list.map(i => (typeof i === 'number' ? Object.assign({}, PXS_MOT[src][i], { fx: null }) : i));
const PXS_MOT_OF = {
  raise: pxsBorrow('down', [0, 1, 1, 1, 1, 1, 1, 0]),
  guard: pxsBorrow('block', [0, 1, 2, 2, 2, 2, 6, 7]),
  salute: pxsBorrow('down', [0, { h: [2, -3], a: -90 }, { h: [2, -3], a: -90 }, { h: [2, -4], a: -90 }, { h: [2, -4], a: -90 }, { h: [2, -3], a: -90 }, { h: [1, -1], a: -60 }, { h: [1, 0], a: -15 }]),
  taunt: [{ h: [1, -2], a: -70 }, { h: [3, -2], a: -30, lean: 1 }, { h: [3, -3], a: -42, lean: 1 }, { h: [3, -2], a: -26, lean: 1 }, { h: [3, -3], a: -42, lean: 1 }, { h: [3, -2], a: -30, lean: 1 }, { h: [2, -1], a: -18 }, { h: [1, 0], a: -5 }],
  parry: [{ h: [1, 0], a: -20 }, { h: [2, -1], a: -55, lean: -1 }, { h: [2, -2], a: -62, lean: -1 }, { h: [2, -2], a: -62, lean: -1 }, { h: [2, -1], a: -50, lean: -1 }, { h: [2, -2], a: -62, lean: -1 }, { h: [1, 0], a: -25 }, { h: [1, 0], a: -5 }],
  ready: pxsBorrow('thrust', [0, 1, 2, 2, 2, 2, 1, 0]),
  toss: pxsBorrow('up', [0, 1, 2, 3, 4, 5, 6, 7])
};
const PXS_MOT_T = [0.045, 0.045, 0.06, 0.04, 0.08, 0.06, 0.055, 0.055];   // 장마다 초 · 다섯째 장(4)이 맞히는 장
const PXS_MOT_HIT = 4;
// 동작을 쓰는 모험가: 칼 모양 무기 (장검·대검, 그림이 따로 없는 글라디우스·삼지창)
function pxsMotOK(a) {
  const w = a && a.eq && a.eq.weapon, base = w ? w.base : (typeof WEAPON_OF !== 'undefined' && WEAPON_OF[a.cls]) || 'sword', wk = pxWeapon(a.cls, base);
  return (wk === 'sword' || wk === 'great' || !PX_WPN[wk]) && wk !== 'bow' && wk !== 'long' && wk !== 'lute';
}
const pxsMotShield = a => { const o = a && a.eq && a.eq.off; return (o && PX_SHIELD_SHAPE[o.base]) || null; };
function pxsHz(F) {
  if (F.th == null) return F;
  const t = F.th * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), yy = F.hy || 0;
  const hx = PXS_HZ.rh[0] * c, hy = PXS_HZ.rh[1] * s + yy, tx = PXS_HZ.rt[0] * c, ty = PXS_HZ.rt[1] * s + yy, dist = Math.hypot(tx - hx, ty - hy);
  return Object.assign({}, F, { h: [Math.round(hx), Math.round(hy)], a: Math.atan2(ty - hy, tx - hx) * 180 / Math.PI, k: Math.max(0, (dist - 1) / 4), wu: F.wu != null ? F.wu : s < -0.2 });
}
const pxsMF = F => pxsHz(Object.assign({ k: 1, lean: 0, cr: 0, dx: 0, legs: null }, F));
function pxsMotFr(mk, f) {
  const o = PXS_MOT_OF[mk];
  return pxsMF((o || PXS_MOT[mk] || PXS_MOT.down)[Math.max(0, Math.min(7, f))]);
}
const pxsMShoulder = F => [PXS_SH[0] + F.lean, PXS_SH[1] + F.cr];
const pxsMHand = F => { const s = pxsMShoulder(F); return [s[0] + F.h[0], s[1] + F.h[1]]; };
const pxsDir = a => { const r = a * Math.PI / 180; return [Math.cos(r), Math.sin(r)]; };
const pxsMSet = (c, x, y, ch, under) => { x = Math.round(x); y = Math.round(y); if (y < 0 || y >= c.length || x < 0 || x >= c[0].length) return; if (under && c[y][x] !== '.') return; c[y][x] = ch; };
// 칼 칸: 코등이 2칸(3칸 대검) · 날은 손에서 2칸부터 길이 4(대검 5) × k
function pxsMSword(F, great) {
  const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a), px = -dy, py = dx, out = [], Lb = Math.max(1, Math.round((great ? 5 : 4) * F.k));
  out.push([hx + dx - 0.5 * px, hy + dy - 0.5 * py, 'G'], [hx + dx + 0.5 * px, hy + dy + 0.5 * py, 'G']);
  if (great) out.push([hx + dx + 1.4 * px, hy + dy + 1.4 * py, 'G']);
  for (let t = 2; t <= 1 + Lb; t++) out.push([hx + dx * t, hy + dy * t, t === 2 && Lb > 2 ? 'M' : 'x']);
  return out;
}
function pxsMArm(F) {
  const [sx, sy] = pxsMShoulder(F), [hx, hy] = pxsMHand(F), n = Math.max(Math.abs(hx - sx), Math.abs(hy - sy)), out = [];
  for (let j = 0; j < n; j++) out.push([sx + (hx - sx) * j / n, sy + (hy - sy) * j / n, j < n / 2 ? 'C' : 'c']);
  return out;
}
// 앞에 겹치는 것(칼날·앞 방패)은 몸과 맞닿는 칸에 어두운 테 → 갑옷과 섞이지 않는다 (cross = 몸을 가로지르는 칸만)
function pxsMOver(c, cells, ring, keep) {
  const R = cells.map(([x, y, ch]) => [Math.round(x), Math.round(y), ch]), own = new Set(R.map(([x, y]) => x + ',' + y));
  if (ring) for (const [x, y] of R) {
    if (ring === 'cross' && !(y >= 0 && y < c.length && c[y][x] !== '.')) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy, k = X + ',' + Y; if (own.has(k) || (keep && keep.has(k))) continue; if (Y >= 0 && Y < c.length && X >= 0 && X < c[0].length && c[Y][X] !== '.' && c[Y][X] !== 'K') c[Y][X] = 'K'; }
  }
  for (const [x, y, ch] of R) pxsMSet(c, x, y, ch);
}
// 한 장 (작업판 격자를 돌려준다, g.mfx = 효과 칸)
function pxsMotGrid(a, mk, f, Lx) {
  const cls = PXL[a.cls] ? a.cls : PXL[jobBase(a.cls)] ? jobBase(a.cls) : 'warrior', L0 = Lx || PXL[cls], [L, Q] = pxOffLook(a, L0);
  const ex = L.ex || [], g = pxGrid(PXW, PXH), robe = L.body === 'robe', coat = L.body === 'coat', F = pxsMotFr(mk, f);
  const wpn = a.eq && a.eq.weapon, wk = pxWeapon(a.cls, wpn ? wpn.base : (typeof WEAPON_OF !== 'undefined' && WEAPON_OF[a.cls]) || 'sword');
  for (const e of ex) { const E = PXS_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), SX + E.x, SY + E.y); }
  if (L.twin) { const D = pxRows(PX_WPN.sword), [bx, by] = pxFind(D, '@'); pxPut(g, D, SX + PXS_HAND.back[0] - bx, SY + PXS_HAND.back[1] - by, 'v'); }
  pxPut(g, pxRows(PXS_BODY[L.body] || PXS_BODY.tunic).concat(pxRows(PXS_LEGS[robe ? 'robe' : coat ? 'coat' : 'stand'])), SX, SY);
  for (const e of ex) { const E = PXS_EX[e]; if (E && !E.under && e !== 'mask' && e !== 'paint' && e !== 'pauldron') pxPut(g, pxRows(E.g), SX + E.x, SY + E.y); }
  const hair = PXS_HAIR[L.hair || ['short', 'long', 'spiky'][(a.id || 0) % 3]] || PXS_HAIR.short;
  pxPut(g, hair, SX - 1, SHY);
  pxPut(g, PXS_FACE, SX - 1, SHY + 4);
  if (L.face) { const Fc = PXS_HEAD[L.face]; pxPut(g, pxRows(Fc.g), SX - 1 + (Fc.x || 0), SHY - Fc.top); }
  for (const e of ['mask', 'paint']) if (ex.includes(e)) pxPut(g, pxRows(PXS_HEAD[e].g), SX - 1, SHY);
  const H = PXS_HEAD[L.head];
  if (H) pxPut(g, pxRows(H.g), SX - 1 + (H.x || 0), SHY - H.top);
  if (Q) pxQuiverPut(g, Q, 'side', 0);
  const O = pxOffOf(a, L0); if (O && O.base !== 'shield') pxOffPut(g, O, 'idle', 0, 'side');
  // 뭉툭 칸으로 줄여서 팔·칼·방패를 그린다
  const c = pxChunk(g).map(r => r.concat(new Array(PXS_MW - r.length).fill('.')));
  c[18][12] = '.';   // 몸 그림에 붙은 앞 손을 뗀다
  const P = PXS_MLEGS[F.legs];
  if (P) for (let j = 0; j < 3; j++) { const y = 21 + j; for (let x = 5; x < 16; x++) c[y][x] = '.'; [...P[j]].forEach((ch, i) => { if (ch !== '.') c[y][6 + i] = robe && j < 2 ? 'C' : ch; }); }
  if (F.lean) for (let y = 0; y <= 18; y++) { const r = c[y], n = new Array(r.length).fill('.'); for (let x = 0; x < r.length; x++) { const X = x + F.lean; if (r[x] !== '.' && X >= 0 && X < r.length) n[X] = r[x]; } c[y] = n; }
  if (F.cr) { for (let y = 21; y >= 1; y--) c[y] = c[y - 1].slice(); c[0] = new Array(PXS_MW).fill('.'); }
  // 방패 (먼 팔): 뒤에 깔리거나(0) 몸 앞에(1, 테 두름)
  const shape = pxsMotShield(a);
  let sh = null;
  if (shape) {
    const d = F.sh || [...PX_OFFAT.side.shield[shape], 0], rows = pxRows(PX_OFFSHAPE[shape]), x0 = d[0] + (d[2] ? F.lean : 0), y0 = d[1] + F.cr, cells = [];
    rows.forEach((r, j) => [...r].forEach((ch, k) => ch !== '.' && cells.push([x0 + k, y0 + j, ch])));
    if (d[2]) pxsMOver(c, cells, 'all'); else cells.forEach(([x, y, ch]) => pxsMSet(c, x, y, ch, 1));
    sh = { x: x0, y: y0, w: rows[0].length, h: rows.length };
  }
  const tone = L.body === 'plate' || L.body === 'chain' ? { C: 'M', c: 'N' } : L.body === 'bare' ? { C: 'S', c: 's' } : {};
  const sw = pxsMSword(F, wk === 'great'), arm = pxsMArm(F).map(([x, y, ch]) => [x, y, tone[ch] || ch]), [hx, hy] = pxsMHand(F);
  const mine = new Set(sw.concat(arm).map(([x, y]) => Math.round(x) + ',' + Math.round(y)).concat([hx + ',' + hy]));
  if (F.wu) sw.forEach(([x, y, ch]) => pxsMSet(c, x, y, ch, 1));
  arm.forEach(([x, y, ch]) => pxsMSet(c, x, y, ch));
  if (!F.wu) pxsMOver(c, sw, 'cross', mine);
  pxsMSet(c, hx, hy, 'S');
  if (ex.includes('pauldron')) { const p = pxGrid(PXW, PXH); pxPut(p, pxRows(PXS_EX.pauldron.g), SX + PXS_EX.pauldron.x, SY + PXS_EX.pauldron.y); pxChunk(p).forEach((r, y) => r.forEach((ch, x) => ch !== '.' && pxsMSet(c, x + F.lean, y + F.cr, ch))); }
  const out = pxUp(c.map(r => r.join(''))).map(r => [...r]);
  out.mfx = pxsMotFx(mk, f, c, sh, wk === 'great');
  return out;
}
/* 효과 칸 (뭉툭 칸, 몸이 나간 칸까지 더한 자리): { back: 몸 뒤(몸에 가린 칸은 뺌), front: 몸 앞 } · 칸 = [x, y, 색 번호 0 흰 · 1 연노랑 · 2 흐림]
   그리는 곳: view.js motFx (어둠 위에 · 칸마다 2×2 논리 픽셀) */
function pxsMLerp(A, B, s) {
  const L = (p, q) => p + (q - p) * s;
  if (A.th != null && B.th != null) return pxsMF({ th: L(A.th, B.th), hy: L(A.hy || 0, B.hy || 0), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx) });
  return { h: [L(A.h[0], B.h[0]), L(A.h[1], B.h[1])], a: L(A.a, B.a), k: L(A.k, B.k), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx) };
}
function pxsMotFx(mk, f, c, sh, great) {
  const F = pxsMotFr(mk, f), fx = F.fx, back = [], front = [];
  if (!fx) return null;
  const put = (x, y, ci) => front.push([x, y, ci]);
  if (fx.k === 'arc' && f >= 1) {   // 칼끝이 지나간 자리: 앞 장 → 이 장 (long이면 그 앞 장부터)
    const cov = new Map(), Lm = great ? 5 : 4;
    const seg = (A, B, w0, w1) => {
      for (let s = 0; s <= 1.0001; s += 1 / 40) {
        const P = pxsMLerp(A, B, s), w = (w0 + (w1 - w0) * s) * (fx.a || 1), hx = PXS_SH[0] + P.lean + P.dx + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1], [dx, dy] = pxsDir(P.a), Lb = Math.max(1, Lm * P.k);
        const fr = P.th != null && Math.sin(P.th * Math.PI / 180) > 0.15;
        for (let t = Math.max(2, 1 + Lb - (w > 0.75 ? 1.6 : 0.8)); t <= 1 + Lb + 0.3; t += 0.2) {
          const X = Math.round(hx + dx * t), Y = Math.round(hy + dy * t), k = X + ',' + Y;
          if (Y > 23) continue;
          const o = cov.get(k); if (!o || o.w < w) cov.set(k, { w, fr });
        }
      }
    };
    const P1 = pxsMotFr(mk, f - 1);
    if (fx.long && f >= 2) seg(pxsMotFr(mk, f - 2), P1, 0.3, 0.55);
    seg(P1, F, 0.55, 1);
    for (const [k, { w, fr }] of cov) {
      if (w <= 0.4) continue;
      const [x, y] = k.split(',').map(Number), ci = w > 0.72 ? 0 : 1;
      if (fr) front.push([x, y, ci]);
      else { const lx = x - F.dx; if (!(c[y] && c[y][lx] && c[y][lx] !== '.')) back.push([x, y, ci]); }
    }
  } else if (fx.k === 'streak') {   // 찌르기: 칼끝 앞으로 번쩍
    const [hx, hy] = pxsMHand(F), tip = hx + F.dx + (great ? 6 : 5);
    if (!fx.star) for (let j = 1; j <= 3; j++) put(tip + j, hy, j < 3 ? 0 : 1);
    else { put(tip + 1, hy, 0); put(tip + 2, hy, 1); put(tip + 1, hy - 1, 1); put(tip + 1, hy + 1, 1); }
  } else if (sh && (fx.k === 'bash' || fx.k === 'block')) {
    const X = sh.x + sh.w + F.dx, Y = sh.y + Math.floor(sh.h / 2), r = fx.r || 1;
    if (fx.k === 'bash') {   // 방패 앞으로 퍼지는 짧은 줄 (+ 몸 뒤 속도 줄)
      [[1, -2, 1, -1], [1, 0, 1, 0], [1, 2, 1, 1]].forEach(([x0, y0, ddx, ddy]) => { for (let j = 0; j < 1 + r; j++) put(X + x0 + j * ddx + (r - 1), Y + y0 + j * ddy * (y0 ? 1 : 0), j === 0 ? 0 : 1); });
      if (fx.speed) for (let j = 0; j < 4; j++) { put(j + F.dx - 2, 17, j > 1 ? 0 : 2); put(j + F.dx - 3, 20, j > 1 ? 0 : 2); }
    } else {   // 막기: 방패 앞 불꽃 (십자 → 튀는 점)
      if (r < 2) { put(X, Y, 0); put(X, Y - 1, 0); put(X, Y + 1, 0); put(X + 1, Y, 0); put(X, Y - 2, 1); put(X, Y + 2, 1); put(X + 2, Y, 1); }
      [[2, -2], [2, 2], [1, -3], [3, 0], [1, 3]].forEach(([x0, y0], j) => { if (j < 2 + r) put(X + x0 * r, Y + Math.round(y0 * (r > 1 ? 1.4 : 1)), r > 1 ? 1 : 0); });
    }
  }
  return back.length || front.length ? { back, front, occ: c.map(r => r.join('')) } : null;
}
// 그림 열쇠: pxBake와 같은 꼴 (미리 찾아서 격자를 다시 만들지 않는다)
const pxKeyOf = key => key + '|' + (FLASH || '') + (PX_FX ? '|fx' : '') + (PX_CHUNK ? '|c' : '');
function pxsAdvSprite(a, pose, fr, Lx) {
  const look = a.look || {}, w = a.eq && a.eq.weapon, cls = PXL[a.cls] ? a.cls : 'warrior', L = Lx || advLook(a);
  const key = 'PS|' + (Lx ? (Lx.c1 || '') + (Lx.head || '') : '') + a.cls + '|' + (look.hair || '') + (look.skin || '') + '|' + ((a.id || 0) % 3) + '|' + (w ? w.base : '-') + '|' + pxOffKey(a) + '|' + pose + fr;
  const hit = PXC.get(pxKeyOf(key));
  if (hit) return hit;
  const g = pose === 'sleep' ? pxSleepGrid(a, L) : pose === 'down' ? pxsDownGrid(a, L) : pose.startsWith('m:') ? pxsMotGrid(a, pose.slice(2), fr, L) : pxsAdvGrid(a, pose, fr, L);
  const s = pxBake(key, g, Object.assign(pxPal(L, look), pxOffPal(a)), SX + 6, SY + 13);
  if (g.mfx !== undefined) s.mfx = g.mfx;
  return s;
}
