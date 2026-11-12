/* ═══ 빌드 65: 새 무기 손에 든 모습 · 공격 동작 시안 (사용자 11-12 15:26 「손에 든 모습과 공격 동작 … 이거 새동작모션 만들고」) ═══
   _w62.js(채찍 · 정글칼 — 11-11 시안 porter_chars/mot62.js) 뒤에 이어 붙여, 게임 안(직접 eval)에서 돈다. 게임에 넣을 때는 pxs.js · pxa.js · view.js 표로 옮긴다.
     card   트럼프 카드  (소매치기 · 괴도 · 대도)        — 손가락에 끼운 카드(3 × 2칸) · 부채(fan) · 던지면 손이 빈다(cd 0)
     wand   완드         (정령술사 · 정령왕)           — 짧은 자루 + 쇠테 + 보석 끝(gem 색 = 직업 색)
     orb    오브         (원소술사 · 연금술사)         — 손바닥 위에 떠 있는 구슬(ob 손에서 자리 · or 반지름, 0 = 쏘아 보냄)
     necro  네크로노미콘 (네크로맨서 · 리치)           — 한 손에 든 책(op 1 = 펼침: 핏빛 책장 · 보랏빛 마법진)
   새 글자(pxPal에 더함): D 책 표지(검붉은 가죽) · E 표지 그늘 · e 책장 · T 카드 붉은 무늬 · Y 책 금 장식 */
Object.assign(PXS_FAMW, { card: 'card', wand: 'wand', orb: 'orb', necro: 'book' });
for (const k of ['card', 'wand', 'orb', 'necro', 'whip', 'machete']) delete PX_WALIAS[k];
const M65_PAL = { D: '#6a1620', E: '#3a0a12', e: '#e8d8bc', T: '#d0302a', Y: '#d8a040' };
// ── 서 있는 그림 (반 해상도로 그려 두 배 · 손 줄이 홀수가 되게 위에 빈 줄 하나) — 앞 = 그대로, 옆 = 칼처럼 시계로 돌아가므로 오브 · 책은 미리 거꾸로
const M65_UP = (s, w) => ['.'.repeat(w * 2)].concat(pxUp(pxRows(s))).join('\n');
Object.assign(PX_WPN, {
  card: M65_UP(`
.Z.Z.
ZZTZZ
zZZZz
..@..`, 5),
  wand: M65_UP(`
x
X
G
v
v
@
v`, 1),
  orb: M65_UP(`
.xX.
xXXX
XXXX
.XX.
G..G
.@..`, 4),
  necro: M65_UP(`
EDDY
EDXD
EDDD
EDDY
.@..`, 4)
});
Object.assign(W62_SIDE, {
  orb: W62_ROT3(pxRows(M65_UP(`
.xX.
xXXX
XXXX
.XX.
G..G
.@..`, 4))).join('\n'),
  necro: W62_ROT3(pxRows(M65_UP(`
EDDY
EDXD
EDDD
.@..`, 4))).join('\n')
});
// ── 동작 그림: 손 → 방향 a로 칸마다 (t 앞 · s 옆) 자리를 재서 칠한다
function m65Scan(F, R, fn) {
  const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [];
  for (let Y = Math.floor(hy - R); Y <= hy + R; Y++) for (let X = Math.floor(hx - R); X <= hx + R; X++) {
    const ox = X - hx, oy = Y - hy, ch = fn(ox * dx + oy * dy, ox * px + oy * py, ox, oy);
    if (ch && !(X === hx && Y === hy)) out.push([X, Y, ch]);
  }
  return out;
}
function m65Card(F) {   // 카드: 3칸 길이 · 2칸 폭, 부채면 fs도씩 벌린다 (뒤 카드부터)
  if ((F.cd != null ? F.cd : 1) <= 0) return [];
  const n = F.fan || 1, out = [];
  for (let i = 0; i < n; i++) {
    const G = Object.assign({}, F, { a: (F.a || 0) + (i - (n - 1) / 2) * (F.fs || 24) });
    out.push(...m65Scan(G, 5, (t, s) => (t > 0.45 && t <= 3.45 && s > -0.95 && s <= 0.95 ? (t > 1.5 && t <= 2.5 && s > 0 ? 'T' : t > 2.5 || s <= -0.5 ? 'z' : 'Z') : null)));
  }
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
    if (t <= 1.3) return 'E';                                   // 등
    if (op && s <= -0.9) return t > 3.3 ? 'e' : (t > 2.3 ? 'T' : 'e');   // 펼친 책장 (핏빛 글씨)
    if (t > 2.0 && t <= 3.3 && s > -0.6 && s <= 0.8) return op ? 'X' : 'Y';   // 마법진 · 덮으면 금 장식
    return 'D';
  });
}
const M65_WPN = { card: m65Card, wand: m65Wand, orb: m65Orb, necro: m65Book };
const M65_MWPN = (F, wk, next) => (M65_WPN[wk] ? { cells: M65_WPN[wk](F) } : W62_MWPN(F, wk, next));
// 효과 축: 무기 끝(카드 끝 · 보석 · 구슬 가운데 · 책 가운데)에서 빛이 터진다
const M65_AXIS = (P, wk, next) => {
  if (!M65_WPN[wk]) return W62_AXIS(P, wk, next);
  const hx = PXS_SH[0] + P.lean + P.h[0], hy = PXS_SH[1] + P.cr + P.h[1], [dx, dy] = pxsDir(P.a || 0);
  if (wk === 'orb') { const [ox, oy] = P.ob || [0.5, -2.5], d = Math.max(0.5, Math.hypot(ox, oy)); return { o: [hx, hy], u: [ox / d, oy / d], L0: d - 1, L1: d + 0.8, b: null, fwd: [1, 0] }; }
  const L = wk === 'wand' ? 6 : wk === 'card' ? 3.2 : 2.8;
  return { o: [hx, hy], u: [dx, dy], L0: L - 1.6, L1: L, b: null, fwd: [dx, dy] };
};
// ── 동작 표 (8장 · 맞히는 장 4, PXS_MOT_HITF에 적은 것은 그 장)
const C_REST = { h: [2, 1], a: -35 }, V_REST = { h: [2, 1], a: -55 }, O_REST = { h: [2, 0] }, B_REST = { h: [2, 0], a: -20 };
Object.assign(PXS_MOTW, {
  cflick: [   // 카드 던지기 (기본 공격 · 슬쩍하기 · 예고장): 어깨 뒤로 젖혔다가 손목을 채며 던진다 — 손이 비었다가 다음 카드를 뽑는다
    C_REST, { h: [0, -2], a: -120, lean: -1 }, { h: [-1, -4], a: -160, lean: -1, fx: { k: 'glint' } }, { h: [3, -3], a: -40 },
    { h: [5, -2], a: -10, lean: 1, legs: 'lunge', dx: 1, cd: 0, fx: { k: 'streak' } }, { h: [5, -1], a: 0, lean: 1, legs: 'lunge', dx: 1, cd: 0, fx: { k: 'streak', star: 1 } },
    { h: [3, 0], a: 10, legs: 'lunge', dx: 1, cd: 0 }, C_REST
  ],
  cfan: [     // 카드 부채 · 카드 마술 (여러 장): 몸 앞으로 부채를 끌어 쓸듯 세 장을 차례로 날린다
    Object.assign({ fan: 3 }, C_REST), { h: [0, 0], a: -150, lean: -1, fan: 3, fs: 22 }, { h: [-1, 0], a: -172, lean: -1, fan: 3, fs: 26, wu: 1 },
    { h: [3, -1], a: -50, fan: 2, fx: { k: 'streak' } }, { h: [5, 0], a: -15, lean: 1, legs: 'lunge', dx: 1, fan: 1, fx: { k: 'streak' } },
    { h: [5, 1], a: 15, lean: 1, legs: 'lunge', dx: 1, cd: 0, fx: { k: 'streak', star: 1 } }, { h: [3, 1], a: 20, legs: 'lunge', dx: 1, cd: 0 }, C_REST
  ],
  cshow: [    // 카드 펼쳐 보이기 (강화 · 밑장 빼기 · 변장): 머리 위에서 부채가 다섯 장으로 펼쳐진다
    C_REST, { h: [2, -3], a: -90 }, { h: [2, -5], a: -90, fan: 3, fs: 24, fx: { k: 'glint' } }, { h: [2, -5], a: -90, fan: 5, fs: 22 },
    { h: [2, -5], a: -90, fan: 5, fs: 22, fx: { k: 'glint', r: 2 } }, { h: [2, -5], a: -90, fan: 3, fs: 24 }, { h: [2, -2], a: -70 }, C_REST
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
  cflick: [0.05, 0.06, 0.07, 0.04, 0.07, 0.06, 0.06, 0.06], cfan: [0.05, 0.06, 0.07, 0.05, 0.06, 0.06, 0.06, 0.06], cshow: [0.05, 0.06, 0.08, 0.08, 0.09, 0.08, 0.06, 0.06],
  vflick: [0.05, 0.06, 0.07, 0.045, 0.07, 0.06, 0.06, 0.06], vswirl: [0.05, 0.06, 0.06, 0.06, 0.06, 0.05, 0.08, 0.06], vraise: [0.05, 0.06, 0.08, 0.08, 0.09, 0.08, 0.06, 0.06],
  opush: [0.05, 0.06, 0.07, 0.045, 0.07, 0.06, 0.07, 0.06], olift: [0.05, 0.06, 0.07, 0.07, 0.08, 0.05, 0.08, 0.06], ospin: [0.05, 0.06, 0.08, 0.08, 0.08, 0.08, 0.06, 0.06],
  bkcast: [0.05, 0.06, 0.07, 0.06, 0.07, 0.06, 0.06, 0.06], bkraise: [0.05, 0.06, 0.07, 0.07, 0.08, 0.05, 0.08, 0.06], bkshut: [0.05, 0.06, 0.08, 0.04, 0.08, 0.06, 0.06, 0.06]
});
// ── 게임 함수 감싸기 (시안 판에서만 — 넣을 때는 각 함수 안으로)
const _m65AdvGrid = pxsAdvGrid, _m65MWpn = pxsMWpn, _m65MotGrid = pxsMotGrid, _m65Axis = pxsMAxis, _m65MotFx = pxsMotFx, _m65Pal = pxPal;
pxsAdvGrid = function (a, pose, fr, Lx) { const wk = pxsWk(a); if (!W62_SIDE[wk]) return _m65AdvGrid(a, pose, fr, Lx); const k = PX_WPN[wk]; PX_WPN[wk] = W62_SIDE[wk]; try { return _m65AdvGrid(a, pose, fr, Lx); } finally { PX_WPN[wk] = k; } };
pxsMWpn = (F, wk) => M65_MWPN(F, wk, _m65MWpn);
pxsMotGrid = function (a, mk, f, Lx) { W62_MK = mk; try { return _m65MotGrid(a, mk, f, Lx); } finally { W62_MK = null; } };
pxsMAxis = (P, wk) => M65_AXIS(P, wk, _m65Axis);
pxsMotFx = (mk, f, c, sh, wk) => W62_FX(mk, f, c, sh, wk, _m65MotFx);
pxPal = (L, look) => Object.assign(_m65Pal(L, look), M65_PAL);
PXC.clear();
