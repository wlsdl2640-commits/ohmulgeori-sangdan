/* ═══ 전사 리모델링 시안 2 (사용자 11-10 14:37) ═══
   1 기사 · 성기사 = 십자 방패, 라운드 실드 = 방패를 낄 수 있는 직업 모두의 공용 방패
   2 방패도 고유 이름 · 고유 디자인
   3 옆모습: 방패는 두께 있는 판 — 평소엔 몸에 가려 있다가(옆으로 선 판), 방패 밀기 · 막기에서 돌며 앞으로 나온다
   4 무기마다 공격 동작 · 광전사는 앞모습 · 뒷모습에서 대검을 등에 사선으로 꽂고 있다 */

// ── 십자 방패 (기사 · 성기사): 단계마다 판 · 십자 · 테가 다르다 (히터 꼴: 위가 평평 · 아래가 뾰족) ──
WR_SHAPE.cross = [`
1111111
1224221
1224221
1444441
1224221
.12421.
..141..
...1...`, `
1111111
1224221
1444441
1224221
1224221
.12421.
..141..
...1...`, `
5111115
1224221
1444441
1224221
1224221
.12421.
..121..
...1...`, `
5151515
1224221
1444441
1245421
1224221
.12421.
..151..
...5...`];
WR_PAL.cross = [{ 1: '#5a3a20', 2: '#b08048', 3: '#8a5a30', 4: '#9aa0aa', 5: '#d8dce4' },
                { 1: '#4a505c', 2: '#d8dce4', 3: '#a8b0bc', 4: '#c0392b', 5: '#ffffff' },
                { 1: '#c8d4e4', 2: '#f4f6fa', 3: '#c8d0dc', 4: '#3a6ac0', 5: '#f0c24a' },
                { 1: '#e8b030', 2: '#fbf8ee', 3: '#ddd4bc', 4: '#e8b030', 5: '#e83a4a' }];
WR_AT.front.cross = [13, 17]; WR_AT.side.cross = [10, 15];
// 고유 이름 (시안: 단계마다 하나씩 — 나중에 장비마다 따로)
const WR_NAME = {
  buckler: ['참나무 버클러', '강철 원반', '서리꽃 버클러', '투기장 왕의 금테 버클러'],
  round:   ['떡갈나무 둥근 방패', '붉은 띠 강철 방패', '서리 금고리 방패', '진홍 금징 방패'],
  cross:   ['견습 기사의 십자 방패', '붉은 십자 강철 방패', '푸른 십자 서리 방패', '백금 십자 방패'],
  ether:   ['마나 구슬', '비취 에테르 핵', '자수정 에테르 핵', '태양석 에테르 핵']
};

// ── 방패 세 모습: face 정면 · half 3/4(도는 중) · edge 옆에서 본 두께 ──
function wrViews(face) {
  const rows = pxRows(face), w = rows[0].length, n = Math.max(2, Math.ceil(w * 0.5));
  const half = rows.map(r => { const has = /[^.]/.test(r); let s = has ? '3' : '.'; for (let i = 0; i < n; i++) s += r[Math.min(w - 1, Math.floor((i + 0.5) * w / n))]; return s; });
  const mid = Math.floor(rows.length / 2);
  const edge = rows.map((r, j) => { const has = /[^.]/.test(r); if (!has) return '...'; const inner = r.replace(/^\.+|\.+$/g, ''); return '3' + '1' + (j === mid && /[45]/.test(r) ? '4' : '.'); });
  return { face: rows, half, edge };
}
const WR_VIEW = {};
function wrView(kind, look, v) { const k = kind + look; if (!WR_VIEW[k]) WR_VIEW[k] = wrViews(WR_SHAPE[kind][look]); return WR_VIEW[k][v]; }
// 옆모습 평소: 몸 가운데 뒤에 옆으로 선 판 (가려진다)
const WR_HIDE = { buckler: [11, 16], round: [10, 15], cross: [10, 15], ether: [12, 15] };

// ── 동작: 방패 밀기 · 막기에서 방패가 돌며 앞으로 (edge → half → face → half → edge) ──
Object.assign(PXS_MOT, {
  bash: [
    { h: [-1, 1], a: 120, lean: -1, shv: 'edge' },
    { h: [-2, 1], a: 150, lean: -1, sh: [8, 16, 1], shv: 'half' },
    { h: [-2, 1], a: 150, legs: 'lunge', dx: 2, sh: [10, 16, 1], shv: 'face' },
    { h: [-2, 1], a: 150, lean: 1, legs: 'lunge', dx: 5, sh: [11, 16, 1], shv: 'face', fx: { k: 'bash', speed: 1 } },
    { h: [-2, 1], a: 150, lean: 1, legs: 'lunge', dx: 6, sh: [11, 16, 1], shv: 'face', fx: { k: 'bash', r: 2 } },
    { h: [-2, 1], a: 150, legs: 'lunge', dx: 5, sh: [10, 16, 1], shv: 'face' },
    { h: [-1, 1], a: 120, dx: 3, sh: [8, 16, 1], shv: 'half' },
    { h: [0, 1], a: 40, dx: 1, shv: 'edge' }
  ],
  block: [
    { h: [-1, 1], a: 120, shv: 'edge' },
    { h: [-2, 1], a: 140, lean: -1, sh: [9, 15, 1], shv: 'half' },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, sh: [11, 14, 1], shv: 'face' },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, dx: -2, sh: [11, 14, 1], shv: 'face', fx: { k: 'block' } },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, dx: -2, sh: [11, 14, 1], shv: 'face', fx: { k: 'block', r: 2 } },
    { h: [-1, 1], a: 120, cr: 1, dx: -1, sh: [10, 15, 1], shv: 'half' },
    { h: [0, 1], a: 80, shv: 'edge' },
    { h: [0, 1], a: 30, shv: 'edge' }
  ],
  // 글라디우스: 허리에서 짧게 두 번 찌른다 (방패는 몸에 가린 채)
  gstab: [
    { h: [0, 1], a: 0 }, { h: [-2, 1], a: 0, lean: -1 },
    { h: [3, 1], a: -5, legs: 'lunge', dx: 3, fx: { k: 'streak' } }, { h: [1, 1], a: 0, dx: 2 },
    { h: [-1, 1], a: 0, lean: -1, dx: 1 }, { h: [4, 0], a: -5, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'streak', star: 1 } },
    { h: [2, 1], a: 0, legs: 'lunge', dx: 3 }, { h: [1, 1], a: 5, dx: 1 }
  ],
  // 글라디우스 + 버클러: 방패로 쳐내고 그 틈에 비스듬히 벤다
  gcut: [
    { h: [-1, 1], a: 120, sh: [9, 16, 1], shv: 'half' },
    { h: [-2, 0], a: 150, lean: 1, legs: 'lunge', dx: 2, sh: [12, 16, 1], shv: 'face', fx: { k: 'bash', r: 1 } },
    { h: [-1, -3], a: -110, lean: -1, dx: 2, sh: [10, 16, 1], shv: 'half' },
    { h: [1, -4], a: -70, dx: 2, shv: 'edge' },
    { h: [3, -1], a: 10, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', long: 1 } },
    { h: [3, 2], a: 60, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, 2], a: 40, legs: 'lunge', dx: 3 }, { h: [1, 1], a: 10, dx: 1 }
  ],
  // 대검(두 손): 머리 뒤로 크게 들었다가 땅까지 내려찍기
  gcleave: [
    { h: [0, -1], a: -100 }, { h: [-1, -5], a: -150, lean: -1 }, { h: [-2, -6], a: -170, lean: -2 },
    { h: [1, -6], a: -100, lean: -1 }, { h: [3, -2], a: -20, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [4, 2], a: 55, lean: 2, legs: 'lunge', dx: 5, cr: 1, fx: { k: 'arc', a: 0.7 } },
    { h: [4, 3], a: 78, lean: 2, legs: 'lunge', dx: 5, cr: 1 }, { h: [2, 2], a: 50, legs: 'lunge', dx: 3 }
  ],
  // 대검(두 손): 몸을 크게 틀어 한 바퀴 휘두르기 (칼끝이 넓은 타원)
  gspin: [
    { th: 150, hy: 0, lean: -1 }, { th: 175, hy: 0, lean: -2 }, { th: 180, hy: 0, lean: -2 },
    { th: 120, hy: 0, fx: { k: 'arc', a: 0.8 } }, { th: 50, hy: 0, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { th: -10, hy: 0, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', long: 1 } }, { th: -70, hy: 0, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [1, 1], a: 20, k: 0.9, dx: 2 }
  ],
  // 룬소드: 칼을 세워 룬에 빛을 모았다가 비스듬히 베어 속성을 터뜨린다
  rslash: [
    { h: [1, -2], a: -80 }, { h: [1, -5], a: -90, lean: -1 }, { h: [1, -6], a: -92, lean: -1, glow: 1 },
    { h: [2, -5], a: -60, glow: 2 }, { h: [3, -1], a: 15, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 }, glow: 2 },
    { h: [3, 2], a: 65, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 }, burst: 1 }, { h: [2, 2], a: 45, legs: 'lunge', dx: 3, burst: 2 }, { h: [1, 1], a: 15, dx: 1 }
  ]
});

// ── 그리기 바꿔 끼우기 (시안 1 위에) ──
function wrApply2() {
  WR_SHAPE.cross.forEach((s, i) => { PX_OFFSHAPE['cross' + i] = s; PX_OFFAT.side.shield['cross' + i] = WR_AT.side.cross.slice(); PX_SHIELD_SHAPE['cross' + i] = 'cross' + i; });
  // 옆모습 평소 (서 있기 · 걷기): 몸 가운데 뒤에 옆으로 선 판
  const _put = pxOffPut;
  pxOffPut = function (g, O, pose, fr, view) {
    const k = O && O.shape && O.shape.replace(/\d$/, '');
    if (view !== 'side' || O.base !== 'shield' || !WR_SHAPE[k]) return _put(g, O, pose, fr, view);
    const [fx, fy] = WR_HIDE[k], bob = (pose === 'idle' && fr % 2) || (pose === 'walk' && fr % 2 === 0);
    pxUnder(g, pxUp(wrView(k, +O.shape.slice(-1), 'edge')), fx * 2, fy * 2 + (bob ? 1 : 0));
  };
  // 동작: 장마다 방패 모습(edge · half · face)과 자리를 고른다
  const _mg = pxsMotGrid;
  pxsMotGrid = function (a, mk, f, Lx) {
    const k = wrKind(a), F = pxsMotFr(mk, f);
    if (!k) return _mg(a, mk, f, Lx);
    const lk = offLook(a.eq.off.t), shape = k + lk, v = F.shv || (F.sh && F.sh[2] ? 'face' : 'edge');
    const sv = PX_OFFSHAPE[shape], sa = PX_OFFAT.side.shield[shape];
    PX_OFFSHAPE[shape] = wrView(k, lk, v).join('\n');
    if (!F.sh) PX_OFFAT.side.shield[shape] = WR_HIDE[k].slice();
    let out;
    try { out = _mg(a, mk, f, Lx); } finally { PX_OFFSHAPE[shape] = sv; PX_OFFAT.side.shield[shape] = sa; }
    return out;
  };
  PXC.clear();
}
// 앞모습 광전사: 대검을 등에 사선으로 (칼자루는 오른 어깨 위 = 보는 사람 왼쪽, 칼끝은 왼 엉덩이 아래)
const WR_BACKSWORD = { x0: -3, y0: -16, x1: 15, y1: 8 };   // 몸 블록 기준 칸 (자루 끝 → 칼끝)
function wrBackSword(g, over) {
  const { x0, y0, x1, y1 } = WR_BACKSWORD, n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)), put = over ? pxPut : pxUnder;
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = Math.round(BX + x0 + (x1 - x0) * t), y = Math.round(BY + y0 + (y1 - y0) * t), part = i < 4 ? 'v' : i < 6 ? 'G' : i > n - 2 ? 'x' : 'M';
    if (part === 'G') put(g, ['GGG', 'GGG'], x - 1, y - 1); else put(g, part === 'v' ? ['vv', 'vv'] : [part + 'N', 'x' + part], x, y);
  }
  put(g, ['GG', 'GG'], BX + x0 - 1, BY + y0 - 1);   // 자루 끝 장식
}
function wrFrontBerserk(a, fr, back) {
  const w = a.eq.weapon; a.eq.weapon = null;
  const g = wrAdvGridNoWpn(a, fr);
  a.eq.weapon = w;
  if (back) { for (let y = HY - 3; y < BY - 1; y++) for (let x = BX - 2; x < BX + 18; x++) { const ch = g[y] && g[y][x]; if (ch && 'SstkwpmE'.includes(ch)) g[y][x] = y >= BY - 3 ? 'h' : (x <= BX + 2 || x >= BX + 13) ? 'h' : 'H'; } }
  wrBackSword(g, back);
  return g;
}
function wrAdvGridNoWpn(a, fr) {
  const cls = PXL[a.cls] ? a.cls : 'warrior', L0 = PXL[cls], [L] = pxOffLook(a, L0), ex = L.ex || [], g = pxGrid(PXW, PXH);
  for (const e of ex) { const E = PX_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), BX + E.x, BY + E.y); }
  pxPut(g, pxRows(PX_BODY[L.body] || PX_BODY.tunic).concat(pxRows(PX_LEGS.stand)), BX, BY);
  pxPut(g, PX_HAIR[L.hair || ['short', 'long', 'spiky'][(a.id || 0) % 3]] || PX_HAIR.short, BX, HY);
  pxPut(g, PX_FACE, BX, HY + 6);
  for (const e of ex) { const E = PX_EX[e]; if (E && !E.under && e !== 'mask' && e !== 'paint') pxPut(g, pxRows(E.g), BX + E.x, BY + E.y); }
  if (L.face) { const F = PX_HEAD[L.face]; pxPut(g, pxRows(F.g), BX + (F.x || 0), HY - F.top); }
  const H = PX_HEAD[L.head]; if (H) pxPut(g, pxRows(H.g), BX + (H.x || 0), HY - H.top);
  if (fr % 2) for (let y = BY + 8; y > 0; y--) g[y] = g[y - 1].slice(), y === 1 && (g[0] = new Array(PXW).fill('.'));
  return g;
}

/* ── 시안판 ── */
const WR_SH_ROWS = [['knight', 'sword', 'cross', 2, '기사 · 십자 방패'], ['paladin', 'sword', 'cross', 6, '성기사 · 십자 방패'], ['warrior', 'sword', 'round', 0, '전사 · 라운드 실드(공용)'],
                    ['gladiator', 'gladius', 'buckler', 4, '검투사 · 버클러'], ['spellblade', 'rune', 'ether', 4, '마검사 · 에테르 실드']];
function wrStrip(g, a, mk, x0, y, Z, CW, from = 0, to = 7, extra) { for (let f = from; f <= to; f++) { const s = pxsAdvSprite(a, 'm:' + mk, f); wrPut(g, s, x0 + (f - from) * CW + CW / 2, y, Z); if (extra) extra(f, x0 + (f - from) * CW + CW / 2, y, s); } }
function wrSheetA() {   // 방패: 평소 몸에 가림 → 밀기 · 막기에서 돌며 앞으로
  const Z = 3, CW = 96, RH = 130, [c, g] = mkCanvas(200 + 12 * CW, 70 + WR_SH_ROWS.length * RH);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  wrText(g, '옆모습 방패: 평소엔 몸 뒤에 옆으로 선 판(가려짐) → 방패 밀기 · 막기에서 돌며 앞으로 (옆 → 3/4 → 정면 → 3/4 → 옆)', 12, 24, '#f0c45a', '700 15px Galmuri11');
  wrText(g, '서 있기', 200 + 10, 52, '#c8c0b0'); wrText(g, '방패 밀기 0 ~ 7', 200 + CW + 10, 52, '#c8c0b0'); wrText(g, '막기 1 · 3 · 5', 200 + 9 * CW + 10, 52, '#c8c0b0');
  WR_SH_ROWS.forEach(([cls, wb, ob, t, nm], r) => {
    const a = wrShape(wrAdv(cls, wb, ob, t)), y0 = 70 + r * RH, by = y0 + RH - 14;
    wrText(g, nm, 12, y0 + 30, '#f4ecd8', '700 13px Galmuri11'); wrText(g, WR_NAME[ob][offLook(t)], 12, y0 + 50, '#d8b878', '11px Galmuri11');
    wrPut(g, pxsAdvSprite(a, 'idle', 0), 200 + CW / 2, by, Z);
    wrStrip(g, a, 'bash', 200 + CW, by, Z, CW);
    [1, 3, 5].forEach((f, i) => wrPut(g, pxsAdvSprite(a, 'm:block', f), 200 + (9 + i) * CW + CW / 2, by, Z));
  });
  return c.toDataURL();
}
const WR_MOT_ROWS = [['gladiator', 'gladius', 'buckler', 2, 'gstab', '글라디우스 · 짧게 두 번 찌르기'], ['gladiator', 'gladius', 'buckler', 2, 'gcut', '글라디우스 · 버클러로 쳐내고 베기'],
                     ['knight', 'sword', 'cross', 2, 'down', '장검 · 내려베기 (지금 칼 동작)'], ['berserker', 'great', null, 2, 'gcleave', '대검 · 두 손 내려찍기'],
                     ['berserker', 'great', null, 2, 'gspin', '대검 · 두 손 휘둘러 베기'], ['spellblade', 'rune', 'ether', 4, 'rslash', '룬소드 · 룬에 빛을 모아 베기']];
function wrSheetB() {   // 무기마다 공격 동작
  const Z = 3, CW = 104, RH = 132, [c, g] = mkCanvas(230 + 8 * CW, 70 + WR_MOT_ROWS.length * RH);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  wrText(g, '무기마다 공격 동작 (장 0 ~ 7) — 효과(칼끝 자취 · 먼지 · 속성 터짐)는 게임에서 덧그린다', 12, 24, '#f0c45a', '700 15px Galmuri11');
  WR_MOT_ROWS.forEach(([cls, wb, ob, t, mk, nm], r) => {
    const a = wrShape(wrAdv(cls, wb, ob, t, 'thunder')), y0 = 54 + r * RH, by = y0 + RH - 14, R = WR_RUNE.thunder;
    wrText(g, nm, 12, y0 + 30, '#f4ecd8', '700 12px Galmuri11');
    wrStrip(g, a, mk, 230, by, Z, CW, 0, 7, (f, cx, cy) => {
      const F = PXS_MOT[mk][f];
      if (F.burst) {   // 시안 표시: 칼끝에서 속성이 터진다 (게임에서는 효과로) — 칼끝 = 어깨 + 손 + 방향 × 날 길이 (뭉툭 칸)
        const bx = cx + (F.burst === 1 ? 44 : 52), byy = cy - (F.burst === 1 ? 16 : 8);   // 칼끝 근처 (내려벤 끝)
        g.globalAlpha = F.burst === 1 ? 0.85 : 0.45;
        for (let k = 0; k < 8; k++) { const ang = k / 8 * Math.PI * 2, rr = 8 + F.burst * 7; g.fillStyle = k % 2 ? R[0] : R[2]; g.fillRect(Math.round(bx + Math.cos(ang) * rr) - 3, Math.round(byy + Math.sin(ang) * rr) - 3, 6, 6); }
        g.fillStyle = R[0]; g.fillRect(Math.round(bx) - 4, Math.round(byy) - 4, 8, 8);
        g.globalAlpha = 1;
      }
    });
  });
  return c.toDataURL();
}
function wrSheetC() {   // 광전사: 앞 · 뒤에서 대검을 등에 사선으로, 싸울 때는 두 손으로
  const Z = 4, CW = 150, [c, g] = mkCanvas(170 + 5 * CW, 70 + 2 * 190);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  wrText(g, '광전사 계열: 서 있을 때(앞 · 뒤)는 대검을 등에 사선으로 꽂고, 싸울 때 뽑아 두 손으로', 12, 24, '#f0c45a', '700 15px Galmuri11');
  ['앞모습', '뒷모습', '옆 서 있기', '내려찍기 2', '내려찍기 5'].forEach((n, i) => wrText(g, n, 170 + i * CW + 20, 52, '#c8c0b0'));
  [['berserker', 2], ['bloodlord', 6]].forEach(([cls, t], r) => {
    const a = wrShape(wrAdv(cls, 'great', null, t)), y0 = 60 + r * 190, by = y0 + 180, L = PXL[cls];
    wrText(g, CLASSES[cls].name, 12, y0 + 40, '#f4ecd8', '700 14px Galmuri11');
    wrPut(g, pxBake('WRB|F|' + cls, wrFrontBerserk(a, 0, false), wrPal(a, L), BX + 8, BY + 13), 170 + CW / 2, by, Z);
    wrPut(g, pxBake('WRB|B|' + cls, wrFrontBerserk(a, 0, true), wrPal(a, L), BX + 8, BY + 13), 170 + CW * 1.5, by, Z);
    wrPut(g, pxsAdvSprite(a, 'idle', 0), 170 + CW * 2.5, by, Z);
    wrPut(g, pxsAdvSprite(a, 'm:gcleave', 2), 170 + CW * 3.5, by, Z); wrPut(g, pxsAdvSprite(a, 'm:gcleave', 5), 170 + CW * 4.5, by, Z);
  });
  return c.toDataURL();
}
function wrSheetD() {   // 방패 고유 이름 · 디자인 (단계별)
  const CW = 170, RH = 150, [c, g] = mkCanvas(170 + 4 * CW, 60 + 4 * RH);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  wrText(g, '방패 고유 이름 · 디자인 (시안 — 같은 종류라도 단계마다 모양 · 문양 · 이름이 다르다)', 12, 24, '#f0c45a', '700 15px Galmuri11');
  [['cross', 'knight', 'sword', '십자 방패', '기사 · 성기사'], ['round', 'warrior', 'sword', '라운드 실드', '공용 (방패를 끼는 직업 모두)'], ['buckler', 'gladiator', 'gladius', '버클러', '검투사 · 챔피언'], ['ether', 'spellblade', 'rune', '에테르 실드', '마검사 · 마검성']].forEach(([k, cls, wb, nm, who], r) => {
    const y0 = 44 + r * RH;
    wrText(g, nm, 12, y0 + 30, '#f4ecd8', '700 14px Galmuri11'); wrText(g, who, 12, y0 + 50, '#a89c8c', '11px Galmuri11');
    for (let t = 0; t < 4; t++) {
      const x0 = 170 + t * CW, rows = pxRows(WR_SHAPE[k][t]);
      wrText(g, WR_NAME[k][t], x0 + 4, y0 + 14, '#d8b878', '11px Galmuri11');
      wrBig(g, rows, WR_PAL[k][t], x0 + 8, y0 + 24, 8);
      const a = wrShape(wrAdv(cls, wb, k, [0, 2, 4, 6][t]));
      wrPut(g, wrFront(a, 0), x0 + 118, y0 + RH - 14, 3);
    }
  });
  return c.toDataURL();
}
window.WAR_SHEET = () => {
  S = blankState('시안');
  wrApply(); wrApply2();
  return [wrSheetA(), wrSheetB(), wrSheetC(), wrSheetD()];
};
