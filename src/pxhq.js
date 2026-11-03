/* ───────── 본부 사람들 손 도트 (A안 작은판) ─────────
   앞(f)·뒤(b) 두 방향, 12칸 × 20줄. 발밑 가운데 = (0,0). 왼쪽을 볼 때는 뒤집는다 */
const PQW = 22, PQH = 28, QX = 5, QY = 26;   // 작업판과 몸 블록 왼쪽 위 (몸 12칸 × 9줄 = 17..25, 머리 12칸 × 9줄 = 8..16)
const PQ_FACE = pxRows(`
.sSSSSSSSSs.
.SSwkSSwkSs.
.SSkkSSkkSs.
.pSSSmmSSSp.
..sSSSSSSs..
...ssSSss...
`);
const PQ_HAIR = {
  f: [pxRows(`
...HHHHHH...
..HHLHHHHHh.
.HHLHHHHHHh.
.HHHSHSSHSHh
.H........h.
.h........h.
`), pxRows(`
...HHHHHH...
..HHLHHHHHh.
.HHLHHHHHHh.
.HHHSHSSHSHh
HH........hh
Hh........hh
Hh........hh
.h........h.
`), pxRows(`
..H..H..H...
..HHHHHHHHh.
.HHLHHHHHHh.
.HHHSHSSHSHh
.H........h.
.h........h.
`), pxRows(`
...HHHHHH...
..HHHHHHHHh.
.HHLHHHHHHh.
.HhhhhhhhhHh
.H........h.
.h........h.
`)],
  b: [pxRows(`
...HHHHHH...
..HHHHHHHHh.
.HHHHHHHHHh.
.HHHHHHHHHhh
.HHHHHHHHHh.
.hHHHHHHHhh.
..hhhhhhhh..
`), pxRows(`
...HHHHHH...
..HHHHHHHHh.
.HHHHHHHHHh.
.HHHHHHHHHhh
HHHHHHHHHHhh
HHHHHHHHHHhh
HhHHHHHHHhhh
.hhhhhhhhhh.
`), pxRows(`
..H..H..H...
..HHHHHHHHh.
.HHHHHHHHHh.
.HHHHHHHHHhh
.HHHHHHHHHh.
.hHHHHHHHhh.
..hhhhhhhh..
`), pxRows(`
...HHHHHH...
..HHHHHHHHh.
.HHHHHHHHHh.
.HHHHHHHHHhh
.HHHHHHHHHh.
.hHHHHHHHhh.
..hhhhhhhh..
`)]
};
// 모자: 머리 블록 0줄 기준 (top = 위로 몇 줄). J/j/I 모자 색
const PQ_HAT = {
  cap:    { top: 2, f: `
..JJJJJJJJ..
.JJIJJJJJJj.
JJJJJJJJJJjj
.jjjjjjjjjjj
`, b: `
..JJJJJJJJ..
.JJJJJJJJJj.
JJJJJJJJJJjj
.jjjjjjjjjj.
` },
  straw:  { top: 2, f: `
....GGGG....
...GGGGGGg..
GGGGGFFGGGGg
.gggggggggg.
` },
  scarf:  { top: 1, f: `
..JJJJJJJJ..
.JJIJJJJJJj.
.JJJJJJJJJj.
.J........j.
.J........jj
.j........jj
`, b: `
..JJJJJJJJ..
.JJJJJJJJJj.
.JJJJJJJJJj.
.JJJJJJJJJj.
.JJJJJJJJJjj
.jjjjjjjjjjj
` },
  band:   { top: -3, f: `
.FFFFFFFFFFf
F...........
` },
  goggle: { top: -3, f: `
.KXZKKKKXZKk
.KXX....XX.k
`, b: `
.KKKKKKKKKKk
` },
  wizard: { top: 6, f: `
......Jj....
.....JJj....
....JIJj....
....JJJjj...
...JIJJJj...
...JJJJJjj..
..JJJJJJJjj.
.GGGGGGGGGGg
JJJJJJJJJJJj
.jjjjjjjjjj.
` },
  hood:   { top: 1, f: `
..JJJJJJJJ..
.JJIJJJJJJj.
.JIJJJJJJJj.
.JJJJJJJJJjj
.J........j.
.J........j.
.J........j.
.JJ......jj.
..JJJ..jjj..
`, b: `
..JJJJJJJJ..
.JJJJJJJJJj.
.JJJJJJJJJj.
.JJJJJJJJJjj
.JJJJJJJJJjj
.JJJJJJJJJjj
.JJJJJJJJJjj
.JJJJJJJJJjj
..jjjjjjjjj.
` },
  helm:   { top: 2, f: `
.....RR.....
...NMRrNn...
..NMxMMMMNn.
.NMxMMMMMMNn
.gGGGGGGGGGg
.N........n.
.N........n.
`, b: `
.....RR.....
...NMMRrNn..
..NMMMMMMNn.
.NMMMMMMMMNn
.NMMMMMMMMNn
.NNNNNNNNNNn
.nnnnnnnnnnn
` },
  bronze: { top: 3, f: `
.....RRr....
....RRrr....
...GGGGGGg..
..GoGGGGGGg.
.GGGGGGGGGGg
.gGGGGGGGGgg
.G........g.
.G........g.
`, b: `
.....RRr....
....RRrr....
...GGGGGGg..
..GGGGGGGGg.
.GGGGGGGGGGg
.GGGGGGGGGGg
.GGGGGGGGGGg
.gggggggggg.
` },
  horns:  { top: 3, f: `
x..........x
Zx........xz
.ZNMMMMMMNz.
.NMxMMMMMMNn
.gGGGGGGGGGg
.N........n.
`, b: `
x..........x
Zx........xz
.ZNMMMMMMNz.
.NMMMMMMMMNn
.NMMMMMMMMNn
.nNNNNNNNNnn
` },
  dragon: { top: 3, f: `
.X........X.
.XX.NMMN.XX.
..NMMxMMMN..
.NMxMMMMMMNn
.nNXNNNNNXNn
.N........n.
`, b: `
.X........X.
.XX.NMMN.XX.
..NMMMMMMN..
.NMMMMMMMMNn
.NMMMMMMMMNn
.nNNNNNNNNnn
` },
  greathelm: { top: 2, f: `
.....RRr....
...NMRrrNn..
..NMxMMMMNn.
.NMxMMMMMMNn
.NMMMMGMMMNn
.NKKKKGKKKKn
.NMMMMGMMMNn
.nNNNNNNNNnn
..nnnnnnnn..
`, b: `
.....RRr....
...NMMRrNn..
..NMMMMMMNn.
.NMMMMMMMMNn
.NMMMMMMMMNn
.NMMMMMMMMNn
.NMMMMMMMMNn
.nNNNNNNNNnn
..nnnnnnnn..
` },
  circlet: { top: -3, f: `
.GGGGGXGGGGg
`, b: `
.GGGGGGGGGGg
` },
  plague: { top: 3, f: `
....JJJJJ...
...JJIJJJJ..
...JJJJJJJ..
...FFFFFFF..
JJJJJJJJJJJj
.jjjjjjjjjj.
..zZZZZZZz..
..ZKXZZKXZz.
..zZZZZZZZz.
...zZZZZZz..
.....zZZz...
`, b: `
....JJJJJ...
...JJJJJJJ..
...JJJJJJJ..
...FFFFFFF..
JJJJJJJJJJJj
.jjjjjjjjjj.
` }
};
/* 몸: 12칸 × 9줄 (0~4 몸통, 5~8 다리). 앞/뒤 */
const PQ_BODY = {
  f: `
.cCCCCCCCCc.
.CdCCCCCCCCc
.CdCCCCCCCCc
.SdCCCCCCCcS
.sWWWWGWWWWs
..UUu..UUu..
..UUu..UUu..
.BBBb..BBBb.
`,
  b: `
.cCCCCCCCCc.
.CCCCCCCCCCc
.CCCCCCCCCCc
.SCCCCCCCCCS
.sWWWWWWWWWs
..UUu..UUu..
..UUu..UUu..
.BBBb..BBBb.
`,
  robe_f: `
.cCCCAACCCc.
.CdCCAACCCCc
.CdCCAACCCCc
.SdCCAACCCcS
.sCCCAACCCCs
.CCCCAACCCCc
.CCCCAACCCCc
.cCCCAACCCcc
..Bb....Bb..
`,
  robe_b: `
.cCCCCCCCCc.
.CCCCCCCCCCc
.CCCCCCCCCCc
.SCCCCCCCCCS
.sCCCCCCCCCs
.CCCCCCCCCCc
.CCCCCCCCCCc
.cCCCCCCCCcc
..Bb....Bb..
`
};
const PQ_LEGS = {
  stand: ['..UUu..UUu..', '..UUu..UUu..', '.BBBb..BBBb.'],
  a: ['..UUu..UUu..', '.BBBb..UUu..', '.......BBBb.'],
  b: ['..UUu..UUu..', '..UUu..BBBb.', '.BBBb.......'],
  sit: ['.UUUUUUUUUu.', '.BBb....BBb.']
};
function pqGrid(p, dir, pose, fr) {
  const g = pxGrid(PQW, PQH), back = dir === 'b', sit = pose === 'sit', walk = pose === 'walk', f = walk ? fr % 4 : 0;
  const bodyKey = (p.robe ? 'robe_' : '') + (back ? 'b' : 'f');
  const oy = sit ? 3 : 0;
  // 뒤에 오는 것: 망토·짐
  if (!back && p.cape) pxPut(g, pxRows('.PPPPPPPPPq.\n.PPPPPPPPPq.\n.PPPPPPPPPq.\n.PPPPPPPPPq.\n.PPPPPPPPPq.\n.qqqqqqqqqq.'), QX, QY - 9 + oy);
  if (!back && p.pack) pxPut(g, pxRows('.WWWWWWWWWV.\n.WFWWWWWWFV.\n.WWWWWWWWWV.\n.VVVVVVVVVV.'), QX, QY - 13 + oy);
  const body = pxRows(PQ_BODY[bodyKey]);
  let rows = body;
  if (!p.robe) { rows = body.slice(0, 5).concat(sit ? PQ_LEGS.sit : walk ? [PQ_LEGS.stand, PQ_LEGS.a, PQ_LEGS.stand, PQ_LEGS.b][f] : PQ_LEGS.stand); }
  else if (sit) rows = body.slice(0, 6).concat(['.cCCCCCCCCcc', '.BBb....BBb.']);
  pxPut(g, rows, QX, QY - rows.length + oy + (sit && !p.robe ? 0 : 0));
  if (!back) {
    if (p.apron) pxPut(g, pxRows('..AAAAAAAA..\n..AaAAAAAa..\n..AAAAAAAA..\n..AAAAAAAA..\n..aaaaaaaa..'), QX, QY - 8 + oy);
    if (p.tie) pxPut(g, pxRows('....ZFZ.....\n.....F......\n.....F......'), QX, QY - 9 + oy);
    if (p.bag) pxPut(g, pxRows('.........V..\n........WWV.\n........WGV.'), QX, QY - 7 + oy);
    if (p.trim && p.robe) pxPut(g, pxRows('.AAAAAAAAAA.'), QX, QY - 9 + oy);
  } else {
    if (p.cape) pxPut(g, pxRows('.PPPPPPPPPq.\n.PPPPPPPPPq.\n.PPPPPPPPPq.\n.PPPPPPPPPq.\n.PPPPPPPPPq.\n.PPPPPPPPPq.\n.qqqqqqqqqq.'), QX, QY - 9 + oy);
    if (p.pack) pxPut(g, pxRows('.WWWWWWWWWV.\n.WFWWWWWWFV.\n.WWWWWWWWWV.\n.WWWWWWWWWV.\n.WWGWWWWGWV.\n.VVVVVVVVVV.'), QX, QY - 13 + oy);
  }
  // 팔 자세 (앞모습)
  if (!back) {
    const A = { hammer: fr % 2 ? ['..........NN', '.........MMN', '..........v.', '..........v.'] : ['........MMN.', '.........v..', '.........v..'], stir: ['.........O..', '.........O..', '........O...'], pray: ['....SSSS....', '....sSSs....'], read: ['...FZZFZZF..', '...FZZFZZF..'], pay: ['..........GG', '..........Gg'], carry: ['........SS..', '........WWV.', '........WWV.'] }[pose];
    if (A) pxPut(g, A, QX, QY - (pose === 'hammer' && fr % 2 ? 17 : pose === 'stir' ? 12 : pose === 'pray' ? 10 : pose === 'read' ? 8 : pose === 'carry' ? 13 : 9) + oy);
  }
  // 머리
  const hy = QY - 9 - 7 + oy, hair = PQ_HAIR[back ? 'b' : 'f'][(p.style || 0) % 4];
  pxPut(g, hair, QX, hy);
  if (!back) {
    pxPut(g, PQ_FACE, QX, hy + 3);
    if (p.beard) pxPut(g, pxRows('..HHHHHHHH..\n...HhHHhH...\n....hhhh....'), QX, hy + 6);
    if (p.mustache) pxPut(g, pxRows('...HHH.HHH..'), QX, hy + 6);
    if (p.glasses) pxPut(g, pxRows('.KKXZKKKXZKk'), QX, hy + 4);
  }
  const H = p.hat && PQ_HAT[p.hat];
  if (H) { const rows = pxRows(back && H.b ? H.b : H.f); pxPut(g, rows, QX, hy - H.top); }
  return g;
}
function pqPal(p) {
  const R = pxRamp, sk = R(p.skin), hr = R(p.hair), bd = R(p.body), lg = R(p.legs || '#3a3040'), hc = R(p.hatc || p.body), tr = R(p.trim || '#d9b44a'), ap = R(p.apron || '#7a5232'), cp = R(p.cape || '#8a3030');
  return { S: sk.b, s: sk.s, k: '#2a1e2a', w: '#ffffff', p: '#f6a2a2', m: '#c4585a', H: hr.b, h: hr.s, L: hr.l,
    C: bd.b, c: bd.s, d: bd.d, Q: bd.l, U: lg.b, u: lg.s, B: '#3a2a1e', b: '#261a12', W: '#8a6238', V: '#5e4028', G: '#f0c24a', g: '#b08a2a', o: '#8a6a1a',
    J: hc.b, j: hc.s, I: hc.l, A: tr.b, a: tr.s, F: p.hat === 'band' ? '#c0392b' : p.hat === 'plague' ? '#4a4650' : p.hat === 'straw' ? '#a8432f' : tr.b, Z: '#f4f0e6', z: '#c4bca8', K: '#2a2632', X: '#8ad8ff',
    M: '#e2e6ec', N: '#a2aab8', n: '#62687a', x: '#ffffff', R: '#e84040', r: '#a82c2c', P: cp.b, q: cp.s, O: '#8a6a44' };
}
function drawPerson(ctx, p, dir, pose, fr, flip) {
  const key = 'PQ|' + (p.key || p.hair + p.body) + '|' + dir + pose + (pose === 'walk' || pose === 'hammer' ? fr % 4 : 0);
  let s = PXC.get(key + '|' + (FLASH || ''));
  if (!s) s = pxBake(key, pqGrid(p, dir, pose, fr), pqPal(p), QX + 6, QY);
  if (flip) { ctx.save(); ctx.scale(-1, 1); pxBlit(ctx, s); ctx.restore(); } else pxBlit(ctx, s);
}
function drawSleeper(ctx, p) {
  const key = 'PQZ|' + (p.key || p.hair);
  let s = PXC.get(key + '|' + (FLASH || ''));
  if (!s) { const g = pxGrid(16, 12); pxPut(g, pxRows('..HHHHHH..\n.HHLHHHHHh\n.HHSSSSSHh\n.HSSkkSSSh\n..sSSSSSs.\n...ssss...'), 3, 2); if (p.hat && !['band', 'goggle', 'circlet'].includes(p.hat)) pxPut(g, pxRows('..JJJJJJJ.\n.JJJJJJJJj'), 3, 1); s = pxBake(key, g, pqPal(p), 8, 10); }
  pxBlit(ctx, s);
}
