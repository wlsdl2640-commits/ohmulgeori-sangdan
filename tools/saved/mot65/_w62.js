PXS_FAMW.whip = 'whip'; PXS_FAMW.machete = 'machete';

/* ── 서 있는 그림: 앞 = 세워 든 꼴(손 '@'), 옆 = 칼처럼 돌리지 않고 그대로 늘어뜨린다(옆 그림 길이 시계로 돌리므로 미리 거꾸로 돌려 둔다) ── */
const CG_WHIP = pxUp(pxRows(`
.O.
.@.
.W.
WWV
W.V
VVV`));
const CG_WHIP_F = ['......'].concat(CG_WHIP).join('\n'), CG_WHIP_S = CG_WHIP.join('\n');
PX_WPN.whip = CG_WHIP_F;   // 손잡이 끝 · 손 · 감아 쥔 끈 (porter_chars/cg1.js)
const W62_ROT3 = r => pxRot(pxRot(pxRot(r)));
const W62_SIDE = { whip: W62_ROT3(pxRows(CG_WHIP_S)).join('\n') };
// 정글칼: 반 해상도로 그려 두 배(뭉툭 칸에 맞게), 손 줄이 홀수가 되게 빈 줄 하나를 위에
const W62_MACH_H = pxRows(`
xM
NM
NM
NM
G.
@.
v.`);
PX_WPN.machete = ['....'].concat(pxUp(W62_MACH_H)).join('\n');

/* ── 끈 꼴: 손잡이 끝에서 wa 방향을 따라 wl칸 (방향은 조절점 사이를 고르게 바꾼다) · 땅(뭉툭 23줄) 밑으로는 못 가고 땅을 따라 눕는다 ── */
const W62 = { gy: 23, ds: 0.2 };
function w62Lash(F) {
  const [hx, hy] = pxsMHand(F), a0 = F.a || 0, [dx, dy] = pxsDir(a0), hl = F.hl != null ? F.hl : 2;
  const wa = F.wa || [a0, a0 + 30, 80, 90, 90], n = wa.length - 1, L = F.wl || 9, ds = W62.ds;
  let x = hx + dx * hl, y = hy + dy * hl;
  const pts = [[x, y]];
  for (let s = ds; s <= L + 1e-6; s += ds) {
    const q = Math.min(n - 1e-9, s / L * n), i = Math.floor(q), f = q - i, [ux, uy] = pxsDir(wa[i] + (wa[i + 1] - wa[i]) * f);
    if (y + uy * ds > W62.gy) { y = W62.gy; x += (ux >= -0.05 ? 1 : -1) * ds; }
    else { x += ux * ds; y += uy * ds; }
    pts.push([x, y]);
  }
  return { hand: [hx, hy], base: [hx + dx * hl, hy + dy * hl], pts, tip: pts[pts.length - 1] };
}
// 점 → 칸: 겹친 칸을 빼고, 대각선으로 이어지면 꺾인 칸(ㄱ자)을 지워 한 칸 굵기로
function w62Cells(pts) {
  const out = [];
  for (const [x, y] of pts) { const X = Math.round(x), Y = Math.round(y), l = out[out.length - 1]; if (!l || l[0] !== X || l[1] !== Y) out.push([X, Y]); }
  for (let i = 1; i < out.length - 1;) { const p = out[i - 1], q = out[i + 1]; if (Math.abs(p[0] - q[0]) <= 1 && Math.abs(p[1] - q[1]) <= 1) out.splice(i, 1); else i++; }
  return out;
}
function w62Whip(F) {
  const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), hl = F.hl != null ? F.hl : 2, out = [];
  out.push([hx - dx, hy - dy, 'G']);                                   // 손잡이 끝 (손 뒤)
  for (let t = 1; t <= hl; t++) out.push([hx + dx * t, hy + dy * t, 'v']);   // 손잡이
  const L = w62Lash(F), cells = w62Cells(L.pts).slice(1), N = cells.length;
  cells.forEach(([x, y], i) => out.push([x, y, i >= N - 1 ? 'w' : i < N * 0.3 ? 'V' : 'W']));   // 굵은 밑동 · 끈 · 끝(꼬리 술)
  return out;
}

/* ── 정글칼: 손 → 방향 a로 칸마다 (t 앞 · s 옆) 자리를 재서 칠한다 (어느 각도에서도 2칸 폭이 고르게) ── */
const W62_EDGE = { up: -1, toss: -1 };   // 올려베기는 날이 위로
let W62_MK = null;
function w62Mach(F) {
  const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = Math.max(0.55, F.k != null ? F.k : 1);
  const ed = W62_EDGE[W62_MK] || 1, Lb = 3.6 * k, Lt = 1.6 + Lb;
  for (let Y = Math.floor(hy - 8); Y <= hy + 8; Y++) for (let X = Math.floor(hx - 8); X <= hx + 8; X++) {
    const ox = X - hx, oy = Y - hy, t = ox * dx + oy * dy, s = (ox * px + oy * py) * ed;
    let ch = null;
    if (t > -1.5 && t <= -0.5 && Math.abs(s) <= 0.5) ch = 'v';                       // 자루 끝
    else if (t > 0.5 && t <= 1.5 && Math.abs(s) <= 0.5) ch = 'G';                    // 덧쇠
    else if (t > 1.5 && t <= Lt && s >= -0.5 && s <= 0.5) ch = t > Lt - 1 ? 'M' : 'N';   // 날 등
    else if (t > 2.5 && t <= Lt - 0.15 && s > 0.5 && s <= 1.55) ch = t > Lt - 1.15 ? 'x' : 'M';   // 날 배 (끝으로 넓어진다)
    if (ch && !(X === hx && Y === hy)) out.push([X, Y, ch]);
  }
  return out;
}
const W62_MWPN = function (F, wk, next) {
  if (wk === 'whip') return { cells: w62Whip(F) };
  if (wk === 'machete') return { cells: w62Mach(F) };
  return next(F, wk);
};

// 효과 축: 정글칼은 날 끝까지, 채찍은 손 → 끈 끝
const W62_AXIS = function (P, wk, next) {
  if (wk !== 'machete' && wk !== 'whip') return next(P, wk);
  const hx = PXS_SH[0] + P.lean + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1];
  if (wk === 'machete') { const [dx, dy] = pxsDir(P.a || 0), L = 1.6 + 3.6 * Math.max(0.55, P.k != null ? P.k : 1); return { o: [hx, hy], u: [dx, dy], L0: Math.max(1.5, L - 2.6), L1: L, b: null, fwd: [dx, dy] }; }
  const T = w62Lash(Object.assign({ lean: 0, cr: 0 }, P)).tip, d = Math.max(1, Math.hypot(T[0] - hx, T[1] - hy)), u = [(T[0] - hx) / d, (T[1] - hy) / d];
  return { o: [hx, hy], u, L0: Math.max(1, d - 1.5), L1: d, b: null, fwd: u };
};

/* ── 효과: lash = 끈 끝 자취 (앞 장 → 이 장을 끈 꼴째 섞어서), crack = 끈 끝 터짐 ── */
function w62Lerp(A, B, s) {
  const L = (p, q) => p + (q - p) * s, wa = (A.wa && B.wa && A.wa.length === B.wa.length) ? A.wa.map((v, i) => L(v, B.wa[i])) : B.wa;
  return { h: [L(A.h[0], B.h[0]), L(A.h[1], B.h[1])], a: L(A.a || 0, B.a || 0), wa, wl: L(A.wl || 9, B.wl || 9), hl: L(A.hl != null ? A.hl : 2, B.hl != null ? B.hl : 2), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx), k: 1 };
}
const W62_FX = function (mk, f, c, sh, wk, next) {
  if (wk !== 'whip') return next(mk, f, c, sh, wk);
  const F = pxsMotFr(mk, f), fx = F.fx, back = [], front = [];
  if (!fx) return null;
  const occ = (x, y) => { const lx = x - Math.round(F.dx); return c[y] && c[y][lx] && c[y][lx] !== '.'; };
  const put = (x, y, ci, behind) => { x = Math.round(x); y = Math.round(y); if (y > W62.gy) return; if (behind) { if (!occ(x, y)) back.push([x, y, ci]); } else front.push([x, y, ci]); };
  const ks = Array.isArray(fx) ? fx : [fx];
  for (const k of ks) {
    if (k.k === 'lash' && f >= 1) {   // 끈 끝이 지나간 자리 (long: 그 앞 장부터) · 새 자리일수록 밝게
      const seg = (A, B, w0, w1) => { for (let s = 0; s <= 1.0001; s += 1 / 28) { const P = w62Lerp(A, B, s), T = w62Lash(P).tip, w = w0 + (w1 - w0) * s; if (w > 0.35) put(T[0] + P.dx, T[1], w > 0.8 ? 0 : w > 0.55 ? 1 : 2, k.back); } };
      const P1 = pxsMotFr(mk, f - 1);
      if (k.long && f >= 2) seg(pxsMotFr(mk, f - 2), P1, 0.3, 0.55);
      seg(P1, F, 0.55, 1);
    } else if (k.k === 'crack') {   // 끈 끝이 터진다: 가운데 흰 칸 · 네 갈래 · 대각선 불똥 (r 2 = 더 크게, 흩어짐)
      const T = w62Lash(F).tip, x = T[0] + F.dx, y = T[1], r = k.r || 1;
      if (r < 3) { put(x, y, 0); for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) put(x + ox, y + oy, 0); }
      for (const [ox, oy] of [[2, 0], [0, -2], [0, 2], [-2, 0]]) put(x + ox * r * 0.75 + (r > 1 ? ox * 0.5 : 0), y + oy * r * 0.75, r > 2 ? 2 : 1);
      for (const [ox, oy] of [[1, -1], [1, 1], [-1, -1], [-1, 1]]) put(x + ox * (r + 0.4), y + oy * (r + 0.4), r > 1 ? 2 : 1);
    }
  }
  return back.length || front.length ? { back, front, occ: c.map(r => r.join('')) } : null;
};

/* ── 동작 표 (8장 · 맞히는 장 4) ── 손 h는 어깨(11, 17)에서 · a 손잡이 방향 · wa 끈 방향(조절점 다섯) · wl 끈 길이 · wu 1이면 몸 뒤 */
const W62_REST = { h: [2, 1], a: 62, wa: [62, 84, 96, 40, 6], wl: 9 };
Object.assign(PXS_MOTW, {
  wcrack: [   // 내려 후려치기: 끈을 머리 뒤로 크게 감아 올렸다가 앞으로 뻗어 끝을 터뜨린다 (기본 공격 · 채찍질)
    W62_REST,
    { h: [1, -3], a: -55, wa: [-55, 5, 60, 85, 92], wl: 9, lean: -1 },
    { h: [-1, -6], a: -112, wa: [-112, -152, -192, -222, -236], wl: 9, lean: -1, wu: 1, fx: { k: 'lash', back: 1 } },
    { h: [1, -6], a: -62, wa: [-62, -118, -168, -196, -206], wl: 9.5, wu: 1, fx: { k: 'lash', back: 1 } },
    { h: [4, -1], a: -6, wa: [-6, -2, 2, 5, 9], wl: 10, lean: 1, legs: 'lunge', dx: 1, fx: [{ k: 'lash', long: 1 }, { k: 'crack' }] },
    { h: [3, 0], a: 14, wa: [14, -12, 14, 42, 74], wl: 10, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'crack', r: 2 } },
    { h: [2, 2], a: 48, wa: [48, 72, 52, 20, 4], wl: 9.5, legs: 'lunge', dx: 1 },
    W62_REST
  ],
  wside: [   // 옆으로 후려치기: 허리 높이로 뒤에서 앞으로 끌어 휘두른다
    W62_REST,
    { h: [-1, 1], a: 158, wa: [158, 132, 150, 176, 180], wl: 9, lean: -1, wu: 1 },
    { h: [-3, 0], a: -168, wa: [-168, 176, 172, 176, 182], wl: 9, lean: -1, wu: 1, fx: { k: 'lash', back: 1 } },
    { h: [1, 0], a: 178, wa: [178, 186, 192, 196, 200], wl: 9, wu: 1, fx: { k: 'lash', back: 1 } },
    { h: [4, 0], a: 0, wa: [0, -4, -6, -12, -22], wl: 10, lean: 1, legs: 'lunge', dx: 2, fx: [{ k: 'lash' }, { k: 'crack' }] },
    { h: [4, 1], a: 8, wa: [8, 16, -6, -40, -80], wl: 10, lean: 1, legs: 'lunge', dx: 2, fx: { k: 'crack', r: 2 } },
    { h: [2, 2], a: 46, wa: [46, 64, 46, 18, 2], wl: 9.5, legs: 'lunge', dx: 1 },
    W62_REST
  ],
  wflick: [   // 올려 채기: 땅에 깔린 끈을 아래에서 위로 채어 올린다 (나는 적)
    W62_REST,
    { h: [0, 3], a: 118, wa: [118, 90, 30, 4, 0], wl: 9, lean: -1 },
    { h: [-1, 3], a: 104, wa: [104, 60, 6, 0, 0], wl: 9, lean: -1, cr: 1 },
    { h: [2, 0], a: -28, wa: [-28, 14, 46, 36, 10], wl: 9, cr: 1, fx: { k: 'lash' } },
    { h: [3, -4], a: -52, wa: [-52, -44, -36, -30, -26], wl: 9.5, lean: 1, legs: 'lunge', dx: 1, fx: [{ k: 'lash', long: 1 }, { k: 'crack' }] },
    { h: [3, -4], a: -48, wa: [-48, -16, 18, 56, 96], wl: 9.5, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'crack', r: 2 } },
    { h: [2, 0], a: 30, wa: [30, 64, 80, 50, 10], wl: 9, legs: 'lunge', dx: 1 },
    W62_REST
  ],
  wtwirl: [   // 머리 위로 돌려 치기: 끈을 머리 위에서 한 바퀴 돌리고(옆에서 보면 길어졌다 짧아졌다) 앞으로 터뜨린다 (모든 적)
    W62_REST,
    { h: [1, -7], a: -84, wa: [-84, -40, -8, -2, 4], wl: 9 },
    { h: [0, -7], a: -92, wa: [-92, -60, -40, -30, -20], wl: 4.5, fx: { k: 'lash' } },
    { h: [-1, -7], a: -96, wa: [-96, -150, -176, -180, -176], wl: 9, wu: 1, fx: { k: 'lash', back: 1 } },
    { h: [3, -5], a: -40, wa: [-40, -14, 2, 8, 14], wl: 10, lean: 1, legs: 'lunge', dx: 1, fx: [{ k: 'lash', long: 1 }, { k: 'crack' }] },
    { h: [3, -3], a: -18, wa: [-18, -2, 24, 56, 88], wl: 10, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'crack', r: 2 } },
    { h: [2, 1], a: 40, wa: [40, 70, 56, 24, 4], wl: 9.5, legs: 'lunge', dx: 1 },
    W62_REST
  ],
  wraise: [   // 채찍 치켜들기 (강화 · 전속력 · 호위 대형): 머리 위에서 끈이 물결친다
    W62_REST,
    { h: [1, -4], a: -70, wa: [-70, -20, 30, 60, 80], wl: 9 },
    { h: [1, -7], a: -86, wa: [-86, -40, -96, -150, -120], wl: 9 },
    { h: [1, -7], a: -86, wa: [-86, -130, -80, -30, -60], wl: 9 },
    { h: [1, -7], a: -86, wa: [-86, -40, -96, -150, -120], wl: 9 },
    { h: [1, -7], a: -86, wa: [-86, -130, -80, -30, -60], wl: 9 },
    { h: [1, -3], a: -50, wa: [-50, 10, 60, 80, 90], wl: 9 },
    W62_REST
  ],
  mchop: [   // 덤불 베기 (정글칼): 칼을 어깨 뒤로 젖혔다가 몸을 실어 비스듬히 땅까지 내려벤다 · 흙먼지
    { h: [1, -2], a: -70 },
    { h: [0, -5], a: -128, lean: -1 },
    { h: [-1, -6], a: -158, lean: -1 },
    { h: [2, -5], a: -84, fx: { k: 'arc', a: 0.8 } },
    { h: [4, -1], a: 28, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [3, 2], a: 78, lean: 1, cr: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.7, dust: 1 } },
    { h: [2, 2], a: 62, cr: 1, legs: 'lunge', dx: 3 },
    { h: [1, 1], a: 20, dx: 1 }
  ]
});
Object.assign(PXS_MOT_TT, {
  wcrack: [0.05, 0.06, 0.08, 0.045, 0.08, 0.06, 0.06, 0.06],
  wside: [0.05, 0.055, 0.07, 0.045, 0.08, 0.06, 0.06, 0.06],
  wflick: [0.05, 0.06, 0.07, 0.04, 0.08, 0.06, 0.06, 0.06],
  wtwirl: [0.05, 0.06, 0.06, 0.06, 0.08, 0.06, 0.06, 0.06],
  wraise: [0.05, 0.06, 0.09, 0.09, 0.09, 0.09, 0.06, 0.06],
  mchop: [0.05, 0.06, 0.08, 0.04, 0.07, 0.07, 0.06, 0.06]
});
