/* ═══ 빌드 65: 새 무기 손에 든 모습 · 공격 동작 (사용자 11-12 17:23 「3개안건 전부 넣는데 카드는 … 한장만 들고 있는 걸로 해서 사선으로 들고 있게.
   카드를 펼치면 3장이 오른쪽, 왼쪽 사선으로, 중앙에 한장 … 3장 펼쳤다 접었다 반복」) ═══
   시안 tools/saved/mot65(_w62.js 채찍 · 정글칼 · mot65.js 카드 · 완드 · 오브 · 네크로노미콘)를 게임 안으로 옮긴 것.
     whip    채찍         (마부 · 코네스토가 · 캐러밴마스터) — 손잡이 2칸 + 끈(조절점 다섯 wa · 길이 wl, 땅에 닿으면 눕는다) · 서 있을 때는 감아 쥔 끈
     machete 정글칼       (정찰가 · 탐험가)                — 날 등 N · 배 M(끝으로 넓은 2칸) · 끝 x, 올려베기는 날이 위로
     card    트럼프 카드  (소매치기 · 괴도 · 대도)          — 손끝에 낀 얇은 카드 한 장(폭 1칸 · 길이 3칸)을 사선으로 · 펼치면 세 장(가운데 한 장 + 왼쪽 · 오른쪽 사선) · 던지면 손이 빈다(cd 0)
     wand    완드         (정령술사 · 정령왕)              — 짧은 자루 + 쇠테 + 보석 끝
     orb     오브         (원소술사 · 연금술사)            — 손바닥 위에 떠 있는 구슬(ob 손에서 자리 · or 반지름, 0 = 쏘아 보냄)
     necro   네크로노미콘 (네크로맨서 · 리치)              — 한 손에 든 책(op 1 = 펼침: 핏빛 책장 · 보랏빛 마법진)
   pxs.js가 부르는 곳: pxsAdvGrid(옆 서 있기 PXS_WPN_SIDE) · pxsMWpn(PXS_WPN_FN) · pxsMAxis(PXS_AXIS_FN) · pxsMotFx(채찍 효과 w62Fx) · pxsMotGrid(PXS_MK).
   팔레트 글자(pxa.js pxPal): D 책 표지 · E 표지 그늘 · e 책장 · T 카드 붉은 무늬 · Y 책 금 장식. 갈래 표(기본 공격 · 역할)는 view.js MOT_POOL · MOT_OWN · MOT_ROLE · MOT_FAMR. */
Object.assign(PXS_FAMW, { whip: 'whip', machete: 'machete', card: 'card', wand: 'wand', orb: 'orb', necro: 'book' });
for (const k of ['card', 'wand', 'orb', 'necro', 'whip', 'machete']) delete PX_WALIAS[k];
const W65_UP = (s, w) => ['.'.repeat(w * 2)].concat(pxUp(pxRows(s))).join('\n');   // 반 해상도로 그려 두 배 · 손 줄이 홀수가 되게 위에 빈 줄 하나
const W65_ROT3 = r => pxRot(pxRot(pxRot(r)));                                          // 옆 서 있기는 칼처럼 시계로 한 번 돌리므로 미리 거꾸로
// ── 서 있는 그림 (앞 = PX_WPN, 옆 = PXS_WPN_SIDE — 없으면 앞 그림을 칼처럼 돌린다)
const CG_WHIP = pxUp(pxRows(`
.O.
.@.
.W.
WWV
W.V
VVV`));
Object.assign(PX_WPN, {
  whip: ['......'].concat(CG_WHIP).join('\n'),   // 손잡이 끝 · 손 · 감아 쥔 끈
  machete: ['....'].concat(pxUp(pxRows(`
xM
NM
NM
NM
G.
@.
v.`))).join('\n'),
  card: W65_UP(`
...Z
..T.
.Z..
@...`, 4),   // 손끝에 낀 얇은 카드 한 장 — 오른쪽 위로 45° 사선 (가운데 붉은 무늬)
  wand: W65_UP(`
x
X
G
v
v
@
v`, 1),
  orb: W65_UP(`
.xX.
xXXX
XXXX
.XX.
G..G
.@..`, 4),
  necro: W65_UP(`
EDDY
EDXD
EDDD
EDDY
.@..`, 4)
});
const PXS_WPN_SIDE = {
  whip: W65_ROT3(pxRows(CG_WHIP.join('\n'))).join('\n'),
  card: W65_ROT3(pxRows(PX_WPN.card)).join('\n'),   // 옆에서도 사선으로 든 한 장
  orb: W65_ROT3(pxRows(PX_WPN.orb)).join('\n'),
  necro: W65_ROT3(pxRows(W65_UP(`
EDDY
EDXD
EDDD
.@..`, 4))).join('\n')
};

/* ── 채찍 끈: 손잡이 끝에서 wa 방향을 따라 wl칸 · 땅(뭉툭 23줄) 밑으로는 못 가고 땅을 따라 눕는다 ── */
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
  out.push([hx - dx, hy - dy, 'G']);                                          // 손잡이 끝 (손 뒤)
  for (let t = 1; t <= hl; t++) out.push([hx + dx * t, hy + dy * t, 'v']);    // 손잡이
  const L = w62Lash(F), cells = w62Cells(L.pts).slice(1), N = cells.length;
  cells.forEach(([x, y], i) => out.push([x, y, i >= N - 1 ? 'w' : i < N * 0.3 ? 'V' : 'W']));   // 굵은 밑동 · 끈 · 끝(꼬리 술)
  return out;
}
/* ── 손 → 방향 a로 칸마다 (t 앞 · s 옆) 자리를 재서 칠한다 (어느 각도에서도 폭이 고르게) ── */
function m65Scan(F, R, fn) {
  const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [];
  for (let Y = Math.floor(hy - R); Y <= hy + R; Y++) for (let X = Math.floor(hx - R); X <= hx + R; X++) {
    const ox = X - hx, oy = Y - hy, ch = fn(ox * dx + oy * dy, ox * px + oy * py, ox, oy);
    if (ch && !(X === hx && Y === hy)) out.push([X, Y, ch]);
  }
  return out;
}
const W62_EDGE = { up: -1, toss: -1 };   // 정글칼: 올려베기는 날이 위로
function w62Mach(F) {
  const k = Math.max(0.55, F.k != null ? F.k : 1), ed = W62_EDGE[PXS_MK] || 1, Lb = 3.6 * k, Lt = 1.6 + Lb;
  return m65Scan(F, 8, (t, s0) => {
    const s = s0 * ed;
    if (t > -1.5 && t <= -0.5 && Math.abs(s) <= 0.5) return 'v';                        // 자루 끝
    if (t > 0.5 && t <= 1.5 && Math.abs(s) <= 0.5) return 'G';                          // 덧쇠
    if (t > 1.5 && t <= Lt && s >= -0.5 && s <= 0.5) return t > Lt - 1 ? 'M' : 'N';      // 날 등
    if (t > 2.5 && t <= Lt - 0.15 && s > 0.5 && s <= 1.55) return t > Lt - 1.15 ? 'x' : 'M';   // 날 배 (끝으로 넓어진다)
    return null;
  });
}
// 카드: 얇은 한 장(폭 1칸 · 길이 3칸, 가운데 붉은 무늬). fan 3이면 가운데 한 장 + 왼쪽 · 오른쪽으로 fs도씩 (뒤 두 장을 먼저, 가운데를 맨 위에)
function m65Card(F) {
  if ((F.cd != null ? F.cd : 1) <= 0) return [];
  const n = F.fan || 1, fs = F.fs != null ? F.fs : 34, out = [];
  const one = da => m65Scan(Object.assign({}, F, { a: (F.a || 0) + da }), 5, (t, s) => (t > 0.45 && t <= 3.45 && s > -0.62 && s <= 0.62 ? (t > 1.55 && t <= 2.45 ? 'T' : t > 2.45 ? 'Z' : 'z') : null));
  const order = n >= 3 ? [-fs, fs, 0] : n === 2 ? [-fs / 2, fs / 2] : [0];
  for (const da of order) out.push(...one(da));
  return out;
}
function m65Wand(F) {   // 완드: 자루 3칸 · 쇠테 · 보석 · 끝 빛
  return m65Scan(F, 7, (t, s) => (Math.abs(s) > 0.55 ? null : t > 0.5 && t <= 3.5 ? 'v' : t > 3.5 && t <= 4.5 ? 'G' : t > 4.5 && t <= 5.5 ? 'X' : t > 5.5 && t <= 6.3 ? 'x' : null));
}
function m65Orb(F) {    // 오브: 손바닥 위 ob 자리의 구슬 (or 0이면 없음) · 손 위 금 받침
  const r = F.or != null ? F.or : 1.5; if (r <= 0) return [];
  const [hx, hy] = pxsMHand(F), [ox, oy] = F.ob || [0.5, -2.5], cx = hx + ox, cy = hy + oy, out = [];
  for (let Y = Math.floor(cy - r - 1); Y <= cy + r + 1; Y++) for (let X = Math.floor(cx - r - 1); X <= cx + r + 1; X++) {
    const u = X - cx, v = Y - cy, d = Math.hypot(u, v);
    if (d <= r + 0.2) out.push([X, Y, u + v < -r * 0.7 ? 'x' : 'X']);
  }
  if (!F.ob) out.push([hx - 1, hy - 1, 'G'], [hx + 1, hy - 1, 'G']);
  return out;
}
function m65Book(F) {   // 책: 손 앞 3 × 3칸 (s가 −인 쪽 = 위 = 책장) · 펼치면 핏빛 책장 · 마법진
  const op = !!F.op;
  return m65Scan(F, 6, (t, s) => {
    if (!(t > 0.3 && t <= 4.3 && s > -2.0 && s <= 1.6)) return null;
    if (t <= 1.3) return 'E';                                                    // 등
    if (op && s <= -0.9) return t > 3.3 ? 'e' : (t > 2.3 ? 'T' : 'e');            // 펼친 책장 (핏빛 글씨)
    if (t > 2.0 && t <= 3.3 && s > -0.6 && s <= 0.8) return op ? 'X' : 'Y';       // 마법진 · 덮으면 금 장식
    return 'D';
  });
}
const PXS_WPN_FN = { whip: w62Whip, machete: w62Mach, card: m65Card, wand: m65Wand, orb: m65Orb, necro: m65Book };
// 효과 축: 정글칼은 날 끝까지 · 채찍은 손 → 끈 끝 · 카드 끝 · 보석 · 구슬 가운데 · 책 가운데
const PXS_AXIS_FN = {
  machete(P) { const hx = PXS_SH[0] + P.lean + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1], [dx, dy] = pxsDir(P.a || 0), L = 1.6 + 3.6 * Math.max(0.55, P.k != null ? P.k : 1); return { o: [hx, hy], u: [dx, dy], L0: Math.max(1.5, L - 2.6), L1: L, b: null, fwd: [dx, dy] }; },
  whip(P) {
    const hx = PXS_SH[0] + P.lean + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1], T = w62Lash(Object.assign({ lean: 0, cr: 0 }, P)).tip, d = Math.max(1, Math.hypot(T[0] - hx, T[1] - hy)), u = [(T[0] - hx) / d, (T[1] - hy) / d];
    return { o: [hx, hy], u, L0: Math.max(1, d - 1.5), L1: d, b: null, fwd: u };
  },
  orb(P) { const hx = PXS_SH[0] + P.lean + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1], [ox, oy] = P.ob || [0.5, -2.5], d = Math.max(0.5, Math.hypot(ox, oy)); return { o: [hx, hy], u: [ox / d, oy / d], L0: d - 1, L1: d + 0.8, b: null, fwd: [1, 0] }; },
  card(P) { return m65Ax(P, 3.2); }, wand(P) { return m65Ax(P, 6); }, necro(P) { return m65Ax(P, 2.8); }
};
function m65Ax(P, L) { const hx = PXS_SH[0] + P.lean + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1], [dx, dy] = pxsDir(P.a || 0); return { o: [hx, hy], u: [dx, dy], L0: L - 1.6, L1: L, b: null, fwd: [dx, dy] }; }
/* ── 채찍 효과: lash = 끈 끝 자취(앞 장 → 이 장을 끈 꼴째 섞어서) · crack = 끈 끝 터짐 ── */
function w62Lerp(A, B, s) {
  const L = (p, q) => p + (q - p) * s, wa = (A.wa && B.wa && A.wa.length === B.wa.length) ? A.wa.map((v, i) => L(v, B.wa[i])) : B.wa;
  return { h: [L(A.h[0], B.h[0]), L(A.h[1], B.h[1])], a: L(A.a || 0, B.a || 0), wa, wl: L(A.wl || 9, B.wl || 9), hl: L(A.hl != null ? A.hl : 2, B.hl != null ? B.hl : 2), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx), k: 1 };
}
function w62Fx(mk, f, c) {
  const F = pxsMotFr(mk, f), fx = F.fx, back = [], front = [];
  if (!fx) return null;
  const occ = (x, y) => { const lx = x - Math.round(F.dx); return c[y] && c[y][lx] && c[y][lx] !== '.'; };
  const put = (x, y, ci, behind) => { x = Math.round(x); y = Math.round(y); if (y > W62.gy) return; if (behind) { if (!occ(x, y)) back.push([x, y, ci]); } else front.push([x, y, ci]); };
  for (const k of Array.isArray(fx) ? fx : [fx]) {
    if (k.k === 'lash' && f >= 1) {   // 끈 끝이 지나간 자리 (long: 그 앞 장부터) · 새 자리일수록 밝게
      const seg = (A, B, w0, w1) => { for (let s = 0; s <= 1.0001; s += 1 / 28) { const P = w62Lerp(A, B, s), T = w62Lash(P).tip, w = w0 + (w1 - w0) * s; if (w > 0.35) put(T[0] + P.dx, T[1], w > 0.8 ? 0 : w > 0.55 ? 1 : 2, k.back); } };
      const P1 = pxsMotFr(mk, f - 1);
      if (k.long && f >= 2) seg(pxsMotFr(mk, f - 2), P1, 0.3, 0.55);
      seg(P1, F, 0.55, 1);
    } else if (k.k === 'crack') {   // 끈 끝이 터진다: 가운데 흰 칸 · 둘레 · 대각선 불똥 (r 2 = 더 크게, 흩어짐)
      const T = w62Lash(F).tip, x = T[0] + F.dx, y = T[1], r = k.r || 1;
      if (r < 3) { put(x, y, 0); for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) put(x + ox, y + oy, 0); }
      for (const [ox, oy] of [[2, 0], [0, -2], [0, 2], [-2, 0]]) put(x + ox * r * 0.75 + (r > 1 ? ox * 0.5 : 0), y + oy * r * 0.75, r > 2 ? 2 : 1);
      for (const [ox, oy] of [[1, -1], [1, 1], [-1, -1], [-1, 1]]) put(x + ox * (r + 0.4), y + oy * (r + 0.4), r > 1 ? 2 : 1);
    }
  }
  return back.length || front.length ? { back, front, occ: c.map(r => r.join('')) } : null;
}

/* ── 동작 표 (8장 · 맞히는 장 4, PXS_MOT_HITF에 적은 것은 그 장) · 손 h는 어깨에서 · a 무기 방향 ── */
const W62_REST = { h: [2, 1], a: 62, wa: [62, 84, 96, 40, 6], wl: 9 };
const C_REST = { h: [2, 1], a: -42 }, V_REST = { h: [2, 1], a: -55 }, O_REST = { h: [2, 0] }, B_REST = { h: [2, 0], a: -20 };
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
  wflick: [   // 올려 채기: 땅에 깔린 끈을 아래에서 위로 채어 올린다 (나는 적 · 올가미)
    W62_REST,
    { h: [0, 3], a: 118, wa: [118, 90, 30, 4, 0], wl: 9, lean: -1 },
    { h: [-1, 3], a: 104, wa: [104, 60, 6, 0, 0], wl: 9, lean: -1, cr: 1 },
    { h: [2, 0], a: -28, wa: [-28, 14, 46, 36, 10], wl: 9, cr: 1, fx: { k: 'lash' } },
    { h: [3, -4], a: -52, wa: [-52, -44, -36, -30, -26], wl: 9.5, lean: 1, legs: 'lunge', dx: 1, fx: [{ k: 'lash', long: 1 }, { k: 'crack' }] },
    { h: [3, -4], a: -48, wa: [-48, -16, 18, 56, 96], wl: 9.5, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'crack', r: 2 } },
    { h: [2, 0], a: 30, wa: [30, 64, 80, 50, 10], wl: 9, legs: 'lunge', dx: 1 },
    W62_REST
  ],
  wtwirl: [   // 머리 위로 돌려 치기: 끈을 머리 위에서 한 바퀴 돌리고 앞으로 터뜨린다 (모든 적)
    W62_REST,
    { h: [1, -7], a: -84, wa: [-84, -40, -8, -2, 4], wl: 9 },
    { h: [0, -7], a: -92, wa: [-92, -60, -40, -30, -20], wl: 4.5, fx: { k: 'lash' } },
    { h: [-1, -7], a: -96, wa: [-96, -150, -176, -180, -176], wl: 9, wu: 1, fx: { k: 'lash', back: 1 } },
    { h: [3, -5], a: -40, wa: [-40, -14, 2, 8, 14], wl: 10, lean: 1, legs: 'lunge', dx: 1, fx: [{ k: 'lash', long: 1 }, { k: 'crack' }] },
    { h: [3, -3], a: -18, wa: [-18, -2, 24, 56, 88], wl: 10, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'crack', r: 2 } },
    { h: [2, 1], a: 40, wa: [40, 70, 56, 24, 4], wl: 9.5, legs: 'lunge', dx: 1 },
    W62_REST
  ],
  wraise: [   // 채찍 치켜들기 (강화 · 진지 · 깃발): 머리 위에서 끈이 물결친다
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
    { h: [1, -2], a: -70 }, { h: [0, -5], a: -128, lean: -1 }, { h: [-1, -6], a: -158, lean: -1 }, { h: [2, -5], a: -84, fx: { k: 'arc', a: 0.8 } },
    { h: [4, -1], a: 28, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } }, { h: [3, 2], a: 78, lean: 1, cr: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.7, dust: 1 } },
    { h: [2, 2], a: 62, cr: 1, legs: 'lunge', dx: 3 }, { h: [1, 1], a: 20, dx: 1 }
  ],
  cflick: [   // 카드 던지기 (기본 공격 · 예고장): 손끝의 한 장을 어깨 뒤로 젖혔다가 손목을 채며 던진다 — 손이 비었다가 다음 카드를 뽑는다
    C_REST, { h: [0, -2], a: -120, lean: -1 }, { h: [-1, -4], a: -160, lean: -1, fx: { k: 'glint' } }, { h: [3, -3], a: -40 },
    { h: [5, -2], a: -10, lean: 1, legs: 'lunge', dx: 1, cd: 0, fx: { k: 'streak' } }, { h: [5, -1], a: 0, lean: 1, legs: 'lunge', dx: 1, cd: 0, fx: { k: 'streak', star: 1 } },
    { h: [3, 0], a: 10, legs: 'lunge', dx: 1, cd: 0 }, C_REST
  ],
  cfan: [     // 카드 부채 (여러 장 · 카드 마술): 몸 앞에서 세 장을 펼쳤다 접었다 다시 펼치고(가운데 한 장 + 왼쪽 · 오른쪽 사선), 한꺼번에 날린다
    C_REST, { h: [4, -1], a: -70, fan: 3, fs: 0 }, { h: [4, -1], a: -70, fan: 3, fs: 34, fx: { k: 'glint' } }, { h: [4, -1], a: -70, fan: 3, fs: 0 },
    { h: [5, -1], a: -40, lean: 1, legs: 'lunge', dx: 1, fan: 3, fs: 34, fx: { k: 'streak' } },
    { h: [5, 0], a: -5, lean: 1, legs: 'lunge', dx: 1, cd: 0, fx: { k: 'streak', star: 1 } }, { h: [3, 1], a: 10, legs: 'lunge', dx: 1, cd: 0 }, C_REST
  ],
  cshow: [    // 카드 펼쳐 보이기 (강화 · 밑장 빼기 · 변장): 머리 위에서 세 장을 펼쳤다 접었다 되풀이한다
    C_REST, { h: [3, -4], a: -90, fan: 3, fs: 0 }, { h: [3, -5], a: -90, fan: 3, fs: 36, fx: { k: 'glint' } }, { h: [3, -5], a: -90, fan: 3, fs: 0 },
    { h: [3, -5], a: -90, fan: 3, fs: 36, fx: { k: 'glint', r: 2 } }, { h: [3, -5], a: -90, fan: 3, fs: 0 }, { h: [3, -5], a: -90, fan: 3, fs: 36 }, C_REST
  ],
  vflick: [   // 완드 겨눠 쏘기 (기본 공격): 들어 올렸다가 손목을 채 앞으로 — 보석 끝에서 빛이 터진다
    V_REST, { h: [1, -1], a: -100, lean: -1 }, { h: [0, -3], a: -125, lean: -1, fx: { k: 'glint' } }, { h: [3, -2], a: -50 },
    { h: [5, -1], a: -10, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast' } }, { h: [5, -1], a: -8, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast', r: 2 } },
    { h: [3, 0], a: -30, dx: 1 }, V_REST
  ],
  vswirl: [   // 완드로 원 그리기 (정령 스킬): 끝으로 작은 원을 그려 기를 모은 뒤 앞으로 찌른다 (맞히는 장 6)
    V_REST, { h: [5, -2], a: -20, fx: { k: 'glint' } }, { h: [3, 0], a: 40, fx: { k: 'gather' } }, { h: [1, -2], a: -170, lean: -1, fx: { k: 'gather', r: 2 } },
    { h: [3, -4], a: -95, fx: { k: 'gather', r: 3 } }, { h: [4, -3], a: -60 }, { h: [5, -1], a: -8, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast', r: 2 } }, V_REST
  ],
  vraise: [   // 완드 치켜들기 (강화 · 치유)
    V_REST, { h: [1, -3], a: -85 }, { h: [1, -5], a: -90, fx: { k: 'glint' } }, { h: [1, -5], a: -90 }, { h: [1, -6], a: -90, fx: { k: 'glint', r: 2 } }, { h: [1, -5], a: -90 }, { h: [1, -2], a: -75 }, V_REST
  ],
  opush: [    // 오브 밀어 쏘기 (기본 공격): 오브를 끌어당겼다가 손바닥으로 밀어 날린다 — 손 위에 작은 구슬이 다시 맺힌다
    O_REST, { h: [0, 0], lean: -1, fx: { k: 'glint' } }, { h: [-1, -1], lean: -1, or: 1.8, fx: { k: 'gather' } }, { h: [3, -1] },
    { h: [5, -1], lean: 1, legs: 'lunge', dx: 1, ob: [2.5, -1], fx: { k: 'cast' } }, { h: [5, -1], lean: 1, legs: 'lunge', dx: 1, or: 0, fx: { k: 'cast', r: 2 } },
    { h: [3, 0], dx: 1, or: 0.8 }, O_REST
  ],
  olift: [    // 오브 들어 올리기 (큰 원소 마법): 머리 위에서 구슬이 부풀었다가 앞으로 터뜨린다 (맞히는 장 6)
    O_REST, { h: [2, -3], fx: { k: 'glint' } }, { h: [1, -6], lean: -1, or: 1.8, fx: { k: 'gather' } }, { h: [1, -6], lean: -1, or: 2.2, fx: { k: 'gather', r: 2 } },
    { h: [1, -6], lean: -1, or: 2.5, fx: { k: 'gather', r: 3 } }, { h: [3, -4], or: 2.2 }, { h: [5, -2], lean: 1, legs: 'lunge', dx: 1, or: 0, fx: { k: 'cast', r: 2 } }, { h: [2, 0], or: 1 }
  ],
  ospin: [    // 오브 돌리기 (강화 · 조율): 든 손 둘레를 구슬이 돈다
    O_REST, { h: [2, -3] }, { h: [2, -4], ob: [0, -3], fx: { k: 'glint' } }, { h: [2, -4], ob: [2.6, -1.4] }, { h: [2, -4], ob: [0.4, 1.6], fx: { k: 'glint', r: 2 } },
    { h: [2, -4], ob: [-2.4, -1.4] }, { h: [2, -2] }, O_REST
  ],
  bkcast: [   // 책 펼쳐 주문 (기본 공격): 가슴 앞에서 책을 펼치고, 마법진이 빛나면 앞으로 내민다
    B_REST, { h: [3, -2], a: -30, op: 1 }, { h: [3, -2], a: -30, op: 1, fx: { k: 'glint' } }, { h: [4, -2], a: -20, op: 1, fx: { k: 'gather' } },
    { h: [5, -1], a: -10, op: 1, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast' } }, { h: [5, -1], a: -10, op: 1, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast', r: 2 } },
    { h: [3, -1], a: -20, op: 1, dx: 1 }, B_REST
  ],
  bkraise: [  // 책 높이 들기 (부르기 · 큰 저주): 펼친 책을 머리 위로 — 기가 모였다가 앞으로 쏟아진다 (맞히는 장 6)
    B_REST, { h: [2, -4], a: -70, op: 1 }, { h: [1, -6], a: -95, op: 1, lean: -1, fx: { k: 'gather' } }, { h: [1, -6], a: -95, op: 1, lean: -1, fx: { k: 'gather', r: 2 } },
    { h: [1, -6], a: -95, op: 1, lean: -1, fx: { k: 'gather', r: 3 } }, { h: [3, -4], a: -50, op: 1 }, { h: [5, -2], a: -15, op: 1, lean: 1, legs: 'lunge', dx: 1, fx: { k: 'cast', r: 2 } }, B_REST
  ],
  bkshut: [   // 책 덮어 내리치기 (가까이 · 저주 한 방): 펼친 책을 치켜들었다가 덮으며 내리친다
    B_REST, { h: [2, -4], a: -80, op: 1 }, { h: [1, -6], a: -105, op: 1, lean: -1, fx: { k: 'glint' } }, { h: [3, -3], a: -40, op: 1 },
    { h: [5, 0], a: 25, lean: 1, legs: 'lunge', dx: 2, fx: { k: 'streak', star: 1 } }, { h: [4, 1], a: 40, lean: 1, legs: 'lunge', dx: 2 }, { h: [3, 1], a: 20, legs: 'lunge', dx: 1 }, B_REST
  ]
});
Object.assign(PXS_MOT_HITF, { vswirl: 6, olift: 6, bkraise: 6 });
Object.assign(PXS_MOT_TT, {
  wcrack: [0.05, 0.06, 0.08, 0.045, 0.08, 0.06, 0.06, 0.06], wside: [0.05, 0.055, 0.07, 0.045, 0.08, 0.06, 0.06, 0.06], wflick: [0.05, 0.06, 0.07, 0.04, 0.08, 0.06, 0.06, 0.06],
  wtwirl: [0.05, 0.06, 0.06, 0.06, 0.08, 0.06, 0.06, 0.06], wraise: [0.05, 0.06, 0.09, 0.09, 0.09, 0.09, 0.06, 0.06], mchop: [0.05, 0.06, 0.08, 0.04, 0.07, 0.07, 0.06, 0.06],
  cflick: [0.05, 0.06, 0.07, 0.04, 0.07, 0.06, 0.06, 0.06], cfan: [0.05, 0.07, 0.08, 0.07, 0.06, 0.06, 0.06, 0.06], cshow: [0.05, 0.08, 0.09, 0.08, 0.09, 0.08, 0.09, 0.06],
  vflick: [0.05, 0.06, 0.07, 0.045, 0.07, 0.06, 0.06, 0.06], vswirl: [0.05, 0.06, 0.06, 0.06, 0.06, 0.05, 0.08, 0.06], vraise: [0.05, 0.06, 0.08, 0.08, 0.09, 0.08, 0.06, 0.06],
  opush: [0.05, 0.06, 0.07, 0.045, 0.07, 0.06, 0.07, 0.06], olift: [0.05, 0.06, 0.07, 0.07, 0.08, 0.05, 0.08, 0.06], ospin: [0.05, 0.06, 0.08, 0.08, 0.08, 0.08, 0.06, 0.06],
  bkcast: [0.05, 0.06, 0.07, 0.06, 0.07, 0.06, 0.06, 0.06], bkraise: [0.05, 0.06, 0.07, 0.07, 0.08, 0.05, 0.08, 0.06], bkshut: [0.05, 0.06, 0.08, 0.04, 0.08, 0.06, 0.06, 0.06]
});
