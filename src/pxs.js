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
    const pole = ['staff', 'skull', 'crozier', 'lance', 'trident'].includes(wk), up = pxRows(PX_WPN[wk] || PX_WPN.sword);
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
/* ───────── 무기마다 공격 동작 (빌드 42) ─────────
   무기 갈래: sword 칼 · dagger 단검 · heavy 도끼·큰 도끼·철퇴·몽둥이·망치 · pole 창·삼지창 · staff 지팡이·해골·주교 지팡이 · bow 활·장궁 · lute 류트.
   단검·둔기는 칼 동작(down·up·side·thrust…)을 그 무기로 그리고, 갈래마다 새 동작을 더한다. 한 장은 칼 동작과 같은 꼴에 더해:
     g 손 뒤로 나온 자루 칸(창·지팡이) · pull 시위를 당긴 칸 · ar 화살을 메김 · bend 활이 휜 정도 · la 류트 목 방향 · lp 류트 몸통 자리 · h2·a2 먼 손 칼(쌍수)
   fx: arc 끝 자취(both = 자루 끝도) · streak 찌르기 번쩍 · snap 화살이 떠남 · glint 끝 빛 · cast 지팡이 끝 터짐 · gather 빛이 모임 · notes 음표 · dust 땅 먼지 */
const PXS_FAMW = { sword: 'sword', great: 'sword', gladius: 'sword', dagger: 'dagger', axe: 'heavy', gaxe: 'heavy', club: 'heavy', mace: 'heavy', hammer: 'heavy',
  lance: 'pole', trident: 'pole', staff: 'staff', skull: 'staff', crozier: 'staff', bow: 'bow', long: 'bow', lute: 'lute' };
const PXS_MOTW = {
  hack: [   // 난도질: 짧게 네 번 (단검·칼)
    { h: [2, -2], a: -60 },
    { h: [3, -4], a: -105, lean: 1 },
    { h: [4, 0], a: 35, lean: 1, legs: 'lunge', dx: 2, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -3], a: -70, lean: 1, legs: 'lunge', dx: 3, h2: [3, 1], a2: 20 },
    { h: [4, 1], a: 50, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', long: 1 } },
    { h: [4, -2], a: -35, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.8 }, h2: [2, 0], a2: -25 },
    { h: [3, 1], a: 40, legs: 'lunge', dx: 3, fx: { k: 'arc', a: 0.6 } },
    { h: [1, 1], a: 15, dx: 1 }
  ],
  smash: [   // 내려찍기: 머리 뒤로 크게 들었다가 땅까지 (둔기 · 맞히는 장 5)
    { h: [1, -2], a: -75 },
    { h: [0, -5], a: -115, lean: -1 },
    { h: [-1, -6], a: -145, lean: -1, legs: 'lunge' },
    { h: [2, -5], a: -75, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -2], a: 10, lean: 1, legs: 'lunge', dx: 2, fx: { k: 'arc', long: 1 } },
    { h: [3, 2], a: 75, lean: 1, cr: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', a: 0.7, dust: 1 } },
    { h: [3, 2], a: 80, cr: 1, legs: 'lunge', dx: 3, fx: { k: 'dust', r: 2 } },
    { h: [2, 1], a: 40, dx: 1 }
  ],
  pthrust: [   // 창: 정면 찌르기
    { h: [1, 1], a: -3, g: 3 },
    { h: [-1, 1], a: -5, g: 3, lean: -1 },
    { h: [-2, 1], a: -6, g: 3, lean: -1, cr: 1 },
    { h: [2, 1], a: -3, g: 3, legs: 'lunge', dx: 2 },
    { h: [4, 1], a: -3, g: 3, lean: 1, legs: 'lunge', dx: 5, fx: { k: 'streak' } },
    { h: [4, 1], a: -3, g: 3, lean: 1, legs: 'lunge', dx: 6, fx: { k: 'streak', star: 1 } },
    { h: [2, 1], a: -3, g: 3, legs: 'lunge', dx: 4 },
    { h: [1, 1], a: -3, g: 3, dx: 1 }
  ],
  pup: [   // 창: 위로 찌르기
    { h: [1, 1], a: -10, g: 3 },
    { h: [-1, 2], a: -20, g: 3, lean: -1, cr: 1 },
    { h: [-2, 2], a: -25, g: 3, lean: -1, cr: 1 },
    { h: [2, 0], a: -35, g: 3, legs: 'lunge', dx: 2 },
    { h: [4, -2], a: -38, g: 3, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'streak' } },
    { h: [4, -2], a: -40, g: 3, lean: 1, legs: 'lunge', dx: 5, fx: { k: 'streak', star: 1 } },
    { h: [2, -1], a: -25, g: 3, legs: 'lunge', dx: 3 },
    { h: [1, 0], a: -10, g: 3, dx: 1 }
  ],
  plow: [   // 창: 아래로 찌르기
    { h: [1, 0], a: 5, g: 3 },
    { h: [-1, -1], a: 10, g: 3, lean: -1 },
    { h: [-2, -1], a: 15, g: 3, lean: -1 },
    { h: [2, 1], a: 22, g: 3, cr: 1, legs: 'lunge', dx: 2 },
    { h: [4, 1], a: 24, g: 3, lean: 1, cr: 1, legs: 'lunge', dx: 4, fx: { k: 'streak' } },
    { h: [4, 1], a: 26, g: 3, lean: 1, cr: 1, legs: 'lunge', dx: 5, fx: { k: 'streak', star: 1 } },
    { h: [2, 1], a: 20, g: 3, legs: 'lunge', dx: 3 },
    { h: [1, 0], a: 5, g: 3, dx: 1 }
  ],
  pswing: [   // 창: 머리 위에서 앞 아래로 휘두르기
    { h: [1, 0], a: -30, g: 2 },
    { h: [0, -3], a: -100, g: 2, lean: -1 },
    { h: [-1, -4], a: -130, g: 2, lean: -1 },
    { h: [2, -3], a: -60, g: 2, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: 5, g: 2, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [3, 1], a: 45, g: 2, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, 1], a: 30, g: 2, legs: 'lunge', dx: 3 },
    { h: [1, 0], a: 0, g: 2, dx: 1 }
  ],
  praise: [   // 창: 치켜들기 (강화·함성)
    { h: [1, 0], a: -30, g: 2 },
    { h: [1, -3], a: -80, g: 2 },
    { h: [1, -4], a: -90, g: 2 },
    { h: [1, -4], a: -90, g: 2 },
    { h: [1, -5], a: -90, g: 2 },
    { h: [1, -4], a: -90, g: 2 },
    { h: [1, -2], a: -60, g: 2 },
    { h: [1, 0], a: -20, g: 2 }
  ],
  pjump: [   // 창: 도약 찌르기 — 웅크려 창을 들고 뛰어올라(jy 위 칸) 내려오며 아래로 꽂는다 (맞히는 장 5 = 내려앉을 때)
    { h: [1, 0], a: -20, g: 2, cr: 1 },
    { h: [1, -3], a: -70, g: 2, cr: 1, lean: -1 },
    { h: [1, -4], a: -85, g: 2, jy: -4, dx: 1 },
    { h: [2, -2], a: 20, g: 3, lean: 1, jy: -9, dx: 3 },
    { h: [3, 0], a: 55, g: 3, lean: 1, jy: -5, dx: 4, fx: { k: 'streak' } },
    { h: [3, 2], a: 68, g: 3, lean: 1, cr: 1, legs: 'lunge', dx: 5, fx: { k: 'dust', r: 2 } },
    { h: [2, 1], a: 45, g: 3, cr: 1, legs: 'lunge', dx: 4 },
    { h: [1, 0], a: 0, g: 2, dx: 1 }
  ],
  pspin: [   // 창: 가운데를 잡고 앞에서 돌리기 (양 끝이 자취를 남긴다)
    { h: [2, 0], a: 0, g: 4 },
    { h: [3, 0], a: -60, g: 4, fx: { k: 'arc', a: 0.8, both: 1 } },
    { h: [3, 0], a: -120, g: 4, fx: { k: 'arc', both: 1 } },
    { h: [3, 0], a: -180, g: 4, fx: { k: 'arc', both: 1 } },
    { h: [3, 0], a: -240, g: 4, legs: 'lunge', dx: 2, fx: { k: 'arc', both: 1 } },
    { h: [3, 0], a: -300, g: 4, legs: 'lunge', dx: 2, fx: { k: 'arc', both: 1 } },
    { h: [3, 0], a: -360, g: 4, legs: 'lunge', dx: 2, fx: { k: 'arc', a: 0.6, both: 1 } },
    { h: [1, 0], a: -380, g: 3, dx: 1 }
  ],
  spush: [   // 지팡이: 앞으로 내밀기 (마법이 지팡이 끝에서 나간다)
    { h: [1, 1], a: -80, g: 2 },
    { h: [0, 0], a: -95, g: 2, lean: -1 },
    { h: [0, -1], a: -100, g: 2, lean: -1, fx: { k: 'glint' } },
    { h: [2, 0], a: -50, g: 2 },
    { h: [4, -1], a: -12, g: 2, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast' } },
    { h: [4, -1], a: -10, g: 2, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast', r: 2 } },
    { h: [3, 0], a: -30, g: 2, dx: 1 },
    { h: [1, 1], a: -70, g: 2 }
  ],
  sjab: [   // 지팡이: 찌르기
    { h: [1, 1], a: -60, g: 2 },
    { h: [-1, 1], a: -10, g: 3, lean: -1 },
    { h: [-2, 1], a: -8, g: 3, lean: -1, cr: 1 },
    { h: [2, 1], a: -5, g: 3, legs: 'lunge', dx: 2 },
    { h: [4, 1], a: -5, g: 3, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'streak' } },
    { h: [4, 1], a: -5, g: 3, lean: 1, legs: 'lunge', dx: 5, fx: { k: 'streak', star: 1 } },
    { h: [2, 1], a: -10, g: 3, legs: 'lunge', dx: 3 },
    { h: [1, 1], a: -50, g: 2, dx: 1 }
  ],
  spushup: [   // 지팡이: 앞으로 내밀었다가 한 번 더 위로 들기 (맞히는 장 6)
    { h: [1, 1], a: -80, g: 2 },
    { h: [0, 0], a: -95, g: 2, lean: -1 },
    { h: [0, -1], a: -100, g: 2, lean: -1, fx: { k: 'glint' } },
    { h: [3, 0], a: -20, g: 2, lean: 1, legs: 'lunge', dx: 1 },
    { h: [4, -1], a: -10, g: 2, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'glint' } },
    { h: [3, -3], a: -60, g: 2, legs: 'lunge', dx: 1 },
    { h: [2, -5], a: -88, g: 2, lean: -1, fx: { k: 'cast', r: 2 } },
    { h: [1, -1], a: -80, g: 2 }
  ],
  sswing: [   // 지팡이: 휘두르기
    { h: [1, 0], a: -70, g: 2 },
    { h: [0, -3], a: -110, g: 2, lean: -1 },
    { h: [-1, -4], a: -140, g: 2, lean: -1 },
    { h: [2, -3], a: -60, g: 2, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: 10, g: 2, lean: 1, legs: 'lunge', dx: 2, fx: { k: 'arc', long: 1 } },
    { h: [3, 1], a: 55, g: 2, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', a: 0.6 } },
    { h: [2, 1], a: 40, g: 2, legs: 'lunge', dx: 2 },
    { h: [1, 1], a: -40, g: 2, dx: 1 }
  ],
  scharge: [   // 지팡이: 높이 들어 기를 모았다가 앞으로 (맞히는 장 6)
    { h: [1, 1], a: -80, g: 2 },
    { h: [1, -3], a: -90, g: 2, fx: { k: 'glint' } },
    { h: [1, -4], a: -90, g: 2, lean: -1, fx: { k: 'gather' } },
    { h: [1, -4], a: -90, g: 2, lean: -1, fx: { k: 'gather', r: 2 } },
    { h: [1, -4], a: -90, g: 2, lean: -1, fx: { k: 'gather', r: 3 } },
    { h: [2, -3], a: -60, g: 2, fx: { k: 'glint', r: 2 } },
    { h: [4, -1], a: -15, g: 2, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast', r: 2 } },
    { h: [2, 0], a: -50, g: 2 }
  ],
  sraise: [   // 지팡이: 치켜들기 (치유·강화)
    { h: [1, 1], a: -80, g: 2 },
    { h: [1, -3], a: -88, g: 2 },
    { h: [1, -4], a: -90, g: 2, fx: { k: 'glint' } },
    { h: [1, -4], a: -90, g: 2 },
    { h: [1, -5], a: -90, g: 2, fx: { k: 'glint', r: 2 } },
    { h: [1, -4], a: -90, g: 2 },
    { h: [1, -2], a: -85, g: 2 },
    { h: [1, 1], a: -80, g: 2 }
  ],
  bshot: [   // 활: 시위를 당겨 놓는다 (맞히는 장 4 = 화살이 떠나는 장)
    { h: [4, -1], a: 0, pull: 0, ar: 1 },
    { h: [5, -1], a: 0, pull: 1, ar: 1 },
    { h: [5, -1], a: 0, pull: 2, ar: 1, bend: 1.3 },
    { h: [5, -1], a: -2, pull: 2, ar: 1, bend: 1.3 },
    { h: [5, -1], a: -2, pull: 0, fx: { k: 'snap' } },
    { h: [5, -1], a: -2, pull: -0.6, fx: { k: 'snap', r: 2 } },
    { h: [4, -1], a: 0, pull: 0.3 },
    { h: [3, 0], a: 0, pull: 0 }
  ],
  bfull: [   // 활: 몸을 젖혀 끝까지 당기기 · 화살촉이 빛난다
    { h: [4, -1], a: 0, pull: 0, ar: 1 },
    { h: [5, -1], a: 0, pull: 1.5, ar: 1, lean: -1 },
    { h: [5, -1], a: -2, pull: 3, ar: 1, bend: 1.8, lean: -1, legs: 'lunge', fx: { k: 'glint' } },
    { h: [5, -1], a: -2, pull: 3, ar: 1, bend: 1.8, lean: -1, legs: 'lunge', fx: { k: 'glint', r: 2 } },
    { h: [5, -1], a: -2, pull: 0, legs: 'lunge', fx: { k: 'snap', big: 1 } },
    { h: [5, -1], a: -2, pull: -0.8, legs: 'lunge', fx: { k: 'snap', r: 2, big: 1 } },
    { h: [4, -1], a: 0, pull: 0.3, legs: 'lunge' },
    { h: [3, 0], a: 0, pull: 0 }
  ],
  bdiag: [   // 활: 사선으로 (하늘로) 쏘기
    { h: [4, -2], a: -20, pull: 0, ar: 1 },
    { h: [4, -3], a: -38, pull: 1, ar: 1, lean: -1 },
    { h: [4, -3], a: -42, pull: 2, ar: 1, bend: 1.3, lean: -1 },
    { h: [4, -3], a: -44, pull: 2, ar: 1, bend: 1.3, lean: -1 },
    { h: [4, -3], a: -44, pull: 0, lean: -1, fx: { k: 'snap' } },
    { h: [4, -3], a: -44, pull: -0.6, lean: -1, fx: { k: 'snap', r: 2 } },
    { h: [4, -2], a: -30, pull: 0.3 },
    { h: [3, 0], a: -5, pull: 0 }
  ],
  brapid: [   // 활: 연사 — 짧게 당겨 바로 놓고 곧장 다음 화살 (이어 쏘면 셋째 장부터)
    { h: [5, -1], a: 0, pull: 0.5, ar: 1 },
    { h: [5, -1], a: 0, pull: 1.5, ar: 1 },
    { h: [5, -1], a: 0, pull: 1.5, ar: 1 },
    { h: [5, -1], a: 0, pull: 1.8, ar: 1 },
    { h: [5, -1], a: 0, pull: 0, fx: { k: 'snap' } },
    { h: [5, -1], a: 0, pull: 0.8, ar: 1 },
    { h: [5, -1], a: 0, pull: 0.4, ar: 1 },
    { h: [4, -1], a: 0, pull: 0 }
  ],
  bswing: [   // 활: 활대로 내려치기 (활대 = 겨눈 방향에 수직)
    { h: [3, -1], a: 0 },
    { h: [1, -4], a: -150, lean: -1 },
    { h: [0, -5], a: -175, lean: -1 },
    { h: [2, -4], a: -120, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: -70, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [3, 1], a: -25, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, 1], a: -10, legs: 'lunge', dx: 3 },
    { h: [2, 0], a: 0, dx: 1 }
  ],
  braise: [   // 활: 높이 들기 (강화·위장)
    { h: [3, -1], a: 0 },
    { h: [2, -3], a: -50 },
    { h: [2, -4], a: -70 },
    { h: [2, -4], a: -70, fx: { k: 'glint' } },
    { h: [2, -5], a: -75 },
    { h: [2, -4], a: -70, fx: { k: 'glint', r: 2 } },
    { h: [2, -2], a: -40 },
    { h: [3, -1], a: 0 }
  ],
  lstrum: [   // 류트: 줄을 훑으면 음표가 나간다 (맞히는 장 4)
    { h: [2, 2], la: -140 },
    { h: [2, 1], la: -140 },
    { h: [2, 0], la: -145, lean: -1 },
    { h: [2, 2], la: -140 },
    { h: [3, 3], la: -138, fx: { k: 'notes' } },
    { h: [2, 1], la: -140, fx: { k: 'notes', r: 2 } },
    { h: [2, 2], la: -140 },
    { h: [2, 2], la: -140 }
  ],
  lraise: [   // 류트: 높이 들고 켜기 (노래 강화)
    { h: [2, 2], la: -140 },
    { h: [2, 0], la: -125, lp: [1, 1], lean: -1 },
    { h: [2, -1], la: -115, lp: [1, 0], lean: -1, fx: { k: 'notes' } },
    { h: [2, 0], la: -120, lp: [1, 1], lean: -1 },
    { h: [2, -1], la: -115, lp: [1, 0], lean: -1, fx: { k: 'notes', r: 2 } },
    { h: [2, 0], la: -120, lp: [1, 1] },
    { h: [2, 1], la: -135, lp: [1, 2] },
    { h: [2, 2], la: -140 }
  ],
  lswing: [   // 류트: 목을 쥐고 내려치기
    { h: [1, -2], a: -70 },
    { h: [1, -5], a: -100, lean: -1 },
    { h: [0, -6], a: -125, lean: -1 },
    { h: [2, -4], a: -50, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: 15, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [3, 2], a: 60, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, 2], a: 45, legs: 'lunge', dx: 3 },
    { h: [2, 2], la: -140, dx: 1 }
  ]
};
// 장마다 초 · 맞히는 장 (없으면 PXS_MOT_T · 4)
const PXS_MOT_TT = {
  hack: [0.035, 0.03, 0.035, 0.03, 0.05, 0.035, 0.04, 0.05],
  smash: [0.05, 0.06, 0.08, 0.04, 0.035, 0.08, 0.07, 0.06],
  pjump: [0.05, 0.07, 0.07, 0.1, 0.06, 0.08, 0.07, 0.06],
  pspin: [0.04, 0.035, 0.035, 0.035, 0.05, 0.04, 0.05, 0.05],
  spushup: [0.045, 0.045, 0.06, 0.04, 0.06, 0.04, 0.08, 0.06],
  scharge: [0.045, 0.05, 0.06, 0.06, 0.06, 0.04, 0.08, 0.06],
  bshot: [0.05, 0.05, 0.07, 0.04, 0.06, 0.05, 0.05, 0.05],
  bfull: [0.05, 0.06, 0.1, 0.1, 0.06, 0.06, 0.06, 0.06],
  bdiag: [0.05, 0.05, 0.07, 0.04, 0.06, 0.05, 0.05, 0.05],
  brapid: [0.03, 0.03, 0.035, 0.025, 0.045, 0.03, 0.03, 0.04],
  lstrum: [0.05, 0.05, 0.06, 0.04, 0.07, 0.06, 0.05, 0.05],
  lraise: [0.05, 0.06, 0.08, 0.06, 0.08, 0.06, 0.06, 0.05]
};
const PXS_MOT_HITF = { smash: 5, spushup: 6, scharge: 6, pjump: 5 };
const PXS_MOT_SUB = { hack: [2, 5, 6] };   // 맞히는 장 말고도 베는 장 (적에게 작은 불꽃)
const PXS_MOT_MELEE = { bswing: 1, lswing: 1 };   // 활·류트로 치는 동작: 화살·음표 없이 바로 맞는다
const pxsMotT = mk => PXS_MOT_TT[mk] || PXS_MOT_T;
const pxsMotHit = mk => (PXS_MOT_HITF[mk] != null ? PXS_MOT_HITF[mk] : PXS_MOT_HIT);
// 무기 종류 (그림 갈래): 장검·대검·글라디우스는 칼, 삼지창은 창
const pxsWk = a => { const w = a && a.eq && a.eq.weapon, base = w ? w.base : (typeof WEAPON_OF !== 'undefined' && a && WEAPON_OF[a.cls]) || 'sword'; return pxWeapon(a ? a.cls : 'warrior', base); };
const pxsFam = a => PXS_FAMW[pxsWk(a)] || 'sword';
// 동작을 쓰는 모험가: 빌드 42부터 모든 무기 (펫·모르는 무기는 칼 그림으로)
function pxsMotOK(a) {
  return !!(a && a.cls && CLASSES[a.cls]);
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
  const o = PXS_MOT_OF[mk] || PXS_MOTW[mk];
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
// 칼이 아닌 무기 (빌드 42): 손에서 방향 a로 (옆 s + = 방향을 시계로 90°). { cells, hand2 (활 시위를 당기는 손) }
const PXS_POLE_LF = { lance: 4, trident: 4, staff: 4, skull: 4, crozier: 4.5 };   // 손 앞 자루 칸 (머리는 그 끝에)
function pxsMWpn(F, wk) {
  if (!PXS_FAMW[wk] || PXS_FAMW[wk] === 'sword') return { cells: pxsMSword(F, wk === 'great') };
  const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [];
  const fam = PXS_FAMW[wk], k = fam === 'dagger' || fam === 'heavy' ? Math.max(0.5, F.k) : 1;
  const at = (t, s, ch) => out.push([hx + dx * t * k + px * s, hy + dy * t * k + py * s, ch]);
  const seg = (t0, t1, ch) => { const n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * Math.abs(t1 - t0) * k)); for (let j = 0; j <= n; j++) at(t0 + (t1 - t0) * j / n, 0, ch); };
  let hand2 = null;
  if (wk === 'dagger') { const Lb = Math.max(1, Math.round(2 * F.k)); at(1, -0.5, 'G'); at(1, 0.5, 'G'); for (let t = 2; t <= 1 + Lb; t++) at(t, 0, t === 1 + Lb ? 'x' : 'M'); }
  else if (wk === 'axe') { seg(-0.5, 4, 'v'); at(3, 1, 'M'); at(4, 1, 'M'); at(3, 2, 'x'); at(4, 2, 'x'); at(4.9, 1, 'N'); }
  else if (wk === 'gaxe') { seg(-1.5, 5, 'v'); for (const s of [1, -1]) { at(4, s, 'M'); at(5, s, 'M'); at(4, 2 * s, 'x'); at(5, 2 * s, 'x'); } at(6, 0, 'M'); }
  else if (wk === 'mace') { seg(-0.5, 3, 'v'); at(4, -0.5, 'M'); at(4, 0.5, 'N'); at(5, -0.5, 'M'); at(5, 0.5, 'N'); at(6, 0, 'x'); at(4.5, -1.5, 'x'); at(4.5, 1.5, 'x'); }
  else if (wk === 'club') { seg(-0.5, 2, 'v'); at(3, -0.5, 'O'); at(3, 0.5, 'O'); at(4, -0.5, 'O'); at(4, 0.5, 'v'); at(5, 0, 'O'); }
  else if (wk === 'hammer') { seg(-0.5, 3.5, 'v'); for (const s of [-1, 0, 1]) { at(4, s, 'M'); at(5, s, 'N'); } at(4, 2, 'x'); at(5, 2, 'x'); }
  else if (fam === 'pole' || fam === 'staff') {
    const g = F.g != null ? F.g : 2, Lf = PXS_POLE_LF[wk] || 4;
    seg(-g, Lf, wk === 'crozier' ? 'G' : 'v');
    if (wk === 'lance') { at(Lf + 1, -0.5, 'x'); at(Lf + 1, 0.5, 'N'); at(Lf + 2, 0, 'x'); at(Lf, 1, 'A'); at(Lf - 0.7, 1.5, 'a'); }
    else if (wk === 'trident') { for (const s of [-1, 0, 1]) at(Lf + 1, s, 'M'); at(Lf + 2, -1, 'x'); at(Lf + 2, 1, 'x'); at(Lf + 2, 0, 'M'); at(Lf + 3, 0, 'x'); }
    else if (wk === 'staff') { at(Lf + 0.5, 0, 'G'); at(Lf + 1.5, -0.5, 'X'); at(Lf + 1.5, 0.5, 'X'); at(Lf + 2.5, -0.5, 'x'); at(Lf + 2.5, 0.5, 'X'); }
    else if (wk === 'skull') { at(Lf + 0.5, 0, 'z'); at(Lf + 1.5, -0.5, 'Z'); at(Lf + 1.5, 0.5, 'z'); at(Lf + 2.5, -0.5, 'Z'); at(Lf + 2.5, 0.5, 'K'); }
    else { at(Lf + 1, 0, 'G'); at(Lf + 1.8, 0.6, 'G'); at(Lf + 1.8, 1.6, 'g'); at(Lf + 1, 2, 'G'); at(Lf + 0.3, 1.8, 'g'); }   // 주교 지팡이 갈고리
  } else if (fam === 'bow') {
    // 활대: 겨눈 방향에 수직, 끝이 사람 쪽으로 휜다 · 시위: 끝 → 당긴 자리 → 끝 · 화살: 당긴 자리에서 활 앞까지
    const Lh = wk === 'long' ? 5 : 4, c0 = 1.2 * (F.bend || 1), pull = F.pull || 0, un = -c0 - pull, N = Math.ceil(Lh * 4);
    for (let j = 0; j <= N; j++) { const v = -Lh + 2 * Lh * j / N; at(-c0 * (v / Lh) * (v / Lh), v, wk === 'long' && Math.abs(v) > Lh - 0.7 ? 'G' : 'O'); }
    for (const sg of [-1, 1]) for (let j = 1; j < 8; j++) { const q = j / 8; at(-c0 + (un + c0) * q, sg * Lh * (1 - q), 'w'); }
    if (F.ar) { for (let u = un; u <= 1.6; u += 0.5) at(u, 0, 'v'); at(2.2, 0, 'x'); at(un + 0.4, -0.8, 'R'); at(un + 0.4, 0.8, 'R'); }
    if (pull > 0.4) hand2 = [hx + dx * un, hy + dy * un];
  } else if (wk === 'lute') {
    if (F.la != null) {   // 몸 앞에 든 류트: 몸통(lp) · 목(la 방향)
      const lp = F.lp || [1, 3], bx = PXS_SH[0] + F.lean + lp[0], by = PXS_SH[1] + F.cr + lp[1], [nx, ny] = pxsDir(F.la);
      for (let t = 2; t <= 6.51; t += 0.5) out.push([bx + nx * t, by + ny * t, 'v']);
      out.push([bx + nx * 7 - ny * 0.8, by + ny * 7 + nx * 0.8, 'v']); out.push([bx + nx * 7.4, by + ny * 7.4, 'G']);
      [[-1, -1, 'Z'], [0, -1, 'Z'], [-2, 0, 'Z'], [-1, 0, 'K'], [0, 0, 'Z'], [1, 0, 'Z'], [-2, 1, 'Z'], [-1, 1, 'Z'], [0, 1, 'Z'], [1, 1, 'z'], [-1, 2, 'z'], [0, 2, 'z']].forEach(([ox, oy, ch]) => out.push([bx + ox, by + oy, ch]));
    } else { seg(0, 3, 'v'); for (const s of [-1, 0, 1]) { at(4, s, 'Z'); at(5, s, s ? 'Z' : 'K'); } at(6, -0.5, 'z'); at(6, 0.5, 'z'); }
  }
  return { cells: out, hand2 };
}
// 효과용: 무기 끝 축 { o 손 자리 · u 단위 방향 · L0..L1 자취를 남기는 구간 · b 자루 끝 (창 돌리기) }
function pxsMAxis(P, wk) {
  const fam = PXS_FAMW[wk] || 'sword', hx = PXS_SH[0] + P.lean + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1], [dx, dy] = pxsDir(P.a || 0), k = Math.max(0.5, P.k);
  if (fam === 'bow') { const Lh = wk === 'long' ? 5 : 4; return { o: [hx, hy], u: [-dy, dx], L0: Lh - 1.4, L1: Lh, b: null, fwd: [dx, dy] }; }
  const L = fam === 'sword' ? 1 + Math.max(1, (wk === 'great' ? 5 : 4) * P.k) : fam === 'dagger' ? 1 + Math.max(1, 2 * P.k) : fam === 'heavy' ? ({ axe: 4.5, gaxe: 5.5, mace: 5.5, club: 5, hammer: 5 }[wk] || 5) * k
    : (PXS_POLE_LF[wk] || 4) + 2.5;
  return { o: [hx, hy], u: [dx, dy], L0: Math.max(1.5, L - (fam === 'heavy' || fam === 'pole' || fam === 'staff' ? 1.8 : 1.6)), L1: L, b: fam === 'pole' || fam === 'staff' ? -(P.g != null ? P.g : 2) : null, fwd: [dx, dy] };
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
  const wk = pxsWk(a), twinK = wk === 'sword' || wk === 'great' || wk === 'gladius' ? 'sword' : 'dagger';
  for (const e of ex) { const E = PXS_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), SX + E.x, SY + E.y); }
  if (L.twin && !F.h2) { const D = pxRows(PX_WPN[twinK]), [bx, by] = pxFind(D, '@'); pxPut(g, D, SX + PXS_HAND.back[0] - bx, SY + PXS_HAND.back[1] - by, 'v'); }
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
  // 먼 손 칼 (쌍수, 장에 h2가 있을 때만 움직인다): 몸 뒤에 깔린다
  if (L.twin && F.h2) pxsMWpn(Object.assign({}, F, { h: F.h2, a: F.a2 || 0, k: 1, th: null }), twinK).cells.concat([[pxsMShoulder(F)[0] + F.h2[0], pxsMShoulder(F)[1] + F.h2[1], 's']]).forEach(([x, y, ch]) => pxsMSet(c, x, y, ch, 1));
  const W = pxsMWpn(F, wk), sw = W.cells, arm = pxsMArm(F).map(([x, y, ch]) => [x, y, tone[ch] || ch]), [hx, hy] = pxsMHand(F);
  const mine = new Set(sw.concat(arm).map(([x, y]) => Math.round(x) + ',' + Math.round(y)).concat([hx + ',' + hy]));
  if (F.wu) sw.forEach(([x, y, ch]) => pxsMSet(c, x, y, ch, 1));
  arm.forEach(([x, y, ch]) => pxsMSet(c, x, y, ch));
  if (!F.wu) pxsMOver(c, sw, 'cross', mine);
  pxsMSet(c, hx, hy, 'S');
  if (W.hand2) pxsMSet(c, W.hand2[0], W.hand2[1], 'S');
  if (ex.includes('pauldron')) { const p = pxGrid(PXW, PXH); pxPut(p, pxRows(PXS_EX.pauldron.g), SX + PXS_EX.pauldron.x, SY + PXS_EX.pauldron.y); pxChunk(p).forEach((r, y) => r.forEach((ch, x) => ch !== '.' && pxsMSet(c, x + F.lean, y + F.cr, ch))); }
  const out = pxUp(c.map(r => r.join(''))).map(r => [...r]);
  out.mfx = pxsMotFx(mk, f, c, sh, wk);
  return out;
}
/* 효과 칸 (뭉툭 칸, 몸이 나간 칸까지 더한 자리): { back: 몸 뒤(몸에 가린 칸은 뺌), front: 몸 앞 } · 칸 = [x, y, 색 번호 0 흰 · 1 연노랑 · 2 흐림]
   그리는 곳: view.js motFx (어둠 위에 · 칸마다 2×2 논리 픽셀) */
function pxsMLerp(A, B, s) {
  const L = (p, q) => p + (q - p) * s;
  if (A.th != null && B.th != null) return pxsMF({ th: L(A.th, B.th), hy: L(A.hy || 0, B.hy || 0), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx) });
  return { h: [L(A.h[0], B.h[0]), L(A.h[1], B.h[1])], a: L(A.a, B.a), k: L(A.k, B.k), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx) };
}
// 땅 먼지 (뭉툭 칸 21~23줄): 무기 끝 앞뒤로
function pxsMDust(put, x, r) { for (let j = 1; j <= r + 1; j++) { put(x + j, 23, j > r ? 2 : 1); put(x - j, 23, 2); } put(x + 1, 22, 2); if (r > 1) { put(x - 1, 22, 2); put(x + 2, 21, 2); } }
function pxsMotFx(mk, f, c, sh, wk) {
  wk = wk === true ? 'great' : wk || 'sword';
  const F = pxsMotFr(mk, f), fx = F.fx, back = [], front = [], fam = PXS_FAMW[wk] || 'sword';
  if (!fx) return null;
  const put = (x, y, ci) => { if (Math.round(y) <= 23) front.push([Math.round(x), Math.round(y), ci]); };
  const A = pxsMAxis(F, wk), tip = [A.o[0] + F.dx + A.u[0] * A.L1, A.o[1] + A.u[1] * A.L1];
  if (fx.k === 'arc' && f >= 1) {   // 무기 끝이 지나간 자리: 앞 장 → 이 장 (long이면 그 앞 장부터 · both면 자루 끝도)
    const cov = new Map();
    const seg = (A0, B0, w0, w1) => {
      for (let s = 0; s <= 1.0001; s += 1 / 40) {
        const P = pxsMLerp(A0, B0, s), w = (w0 + (w1 - w0) * s) * (fx.a || 1), X = pxsMAxis(P, wk), o0 = X.o[0] + P.dx;
        const fr = P.th != null && Math.sin(P.th * Math.PI / 180) > 0.15, wd = (X.L1 - X.L0) * (w > 0.75 ? 1 : 0.5);
        const band = (t0, t1) => { for (let t = t0; t <= t1 + 1e-6; t += 0.2) {
          const x = Math.round(o0 + X.u[0] * t), y = Math.round(X.o[1] + X.u[1] * t), k = x + ',' + y;
          if (y > 23) continue;
          const o = cov.get(k); if (!o || o.w < w) cov.set(k, { w, fr });
        } };
        band(Math.max(fam === 'sword' ? 2 : 1.5, X.L1 - wd), X.L1 + 0.3);
        if (fx.both && X.b != null) band(X.b - 0.3, X.b + wd);
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
    if (fx.dust) pxsMDust(put, tip[0], 1);
  } else if (fx.k === 'streak') {   // 찌르기: 무기 끝 앞으로 번쩍 (찌른 방향으로)
    const [ux, uy] = A.u, [px, py] = [-uy, ux];
    if (!fx.star) for (let j = 1; j <= 3; j++) put(tip[0] + ux * j, tip[1] + uy * j, j < 3 ? 0 : 1);
    else { put(tip[0] + ux, tip[1] + uy, 0); put(tip[0] + ux * 2, tip[1] + uy * 2, 1); put(tip[0] + ux + px, tip[1] + uy + py, 1); put(tip[0] + ux - px, tip[1] + uy - py, 1); }
  } else if (fx.k === 'snap') {   // 활: 화살이 떠나는 번쩍 (활 앞으로 짧은 줄) · r 2 = 더 멀리 흐리게
    const [ux, uy] = A.fwd, r = fx.r || 1, o = [A.o[0] + F.dx, A.o[1]];
    for (let j = 0; j < 3; j++) { const t = 2.5 + j + (r - 1) * 2.5; put(o[0] + ux * t, o[1] + uy * t, r > 1 ? (j ? 2 : 1) : j ? 1 : 0); }
    if (fx.big) { const t = 3 + (r - 1) * 2.5; put(o[0] + ux * t - uy, o[1] + uy * t + ux, 1); put(o[0] + ux * t + uy, o[1] + uy * t - ux, 1); }
    if (r < 2) { put(o[0] - ux * 1.2 * (F.bend || 1) - uy * 2, o[1] - uy * 1.2 + ux * 2, 2); put(o[0] - ux * 1.2 * (F.bend || 1) + uy * 2, o[1] - uy * 1.2 - ux * 2, 2); }   // 시위 떨림
  } else if (fx.k === 'glint' || fx.k === 'cast' || fx.k === 'gather') {   // 무기 머리 빛: 반짝 · 터짐 · 모임
    const hd = fam === 'bow' ? [A.o[0] + F.dx + A.fwd[0] * 2.2, A.o[1] + A.fwd[1] * 2.2] : [tip[0] - A.u[0] * 0.8, tip[1] - A.u[1] * 0.8], r = fx.r || 1;
    if (fx.k === 'glint') { put(hd[0], hd[1] - 1 - (r > 1 ? 1 : 0), 0); for (const [ox, oy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) put(hd[0] + ox * (r + 1), hd[1] + oy * (r + 1) - 1, r > 1 ? 1 : 0); if (r > 1) for (const [ox, oy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) put(hd[0] + ox * 2, hd[1] + oy * 2 - 1, 2); }
    else if (fx.k === 'cast') { const R0 = r + 0.6; for (let q = 0; q < 8; q++) { const t = q * Math.PI / 4; put(hd[0] + Math.cos(t) * R0, hd[1] + Math.sin(t) * R0, q % 2 ? 1 : 0); } if (r > 1) for (let q = 0; q < 8; q++) { const t = (q + 0.5) * Math.PI / 4; put(hd[0] + Math.cos(t) * (R0 + 1.4), hd[1] + Math.sin(t) * (R0 + 1.4), 2); } }
    else for (let q = 0; q < 6; q++) { const t = q * Math.PI / 3 + r * 0.5, R0 = 6 - r * 1.3; put(hd[0] + Math.cos(t) * R0, hd[1] + Math.sin(t) * R0, r > 2 ? 0 : 1); }
  } else if (fx.k === 'notes') {   // 류트: 음표 (머리 2칸 + 대) 가 떠오른다
    const lp = F.lp || [1, 3], bx = PXS_SH[0] + F.lean + F.dx + lp[0], by = PXS_SH[1] + F.cr + lp[1], r = fx.r || 1;
    for (const [nx, ny, ci] of [[3 + r, -1 - r * 2, 0], [5 + r * 2, -r, 1]]) { put(bx + nx, by + ny, ci); put(bx + nx + 1, by + ny, ci); put(bx + nx + 1, by + ny - 1, ci); put(bx + nx + 1, by + ny - 2, ci); }
  } else if (fx.k === 'dust') pxsMDust(put, tip[0], fx.r || 1);
  else if (sh && (fx.k === 'bash' || fx.k === 'block')) {
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
