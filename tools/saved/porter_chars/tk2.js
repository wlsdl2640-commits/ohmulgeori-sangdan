/* ═══ 트래커 · 스토커 시안 손질 (11-10 23:2x) — tk1.js 위에 ═══
   컴파운드 보우 손 그림(곧은 손잡이 · 짧은 활대 · 시위 쪽 끝 도르래) · 손목 석궁(먼 팔 손목, 활대가 손 쪽) · 볼트통(허리 왼쪽 옆) · 뒷모습(얼굴 · 가면 → 두건, 좌우를 뒤집고 화살통 · 망토를 등 위로) */
const tkUp = s => pxUp(pxRows(s)).join('\n');
// 앞: 활은 보는 사람 왼쪽(오른손), 손잡이가 바깥 · 시위가 몸 쪽 · 도르래는 시위 쪽
TK_CBOW.front = { x: -6, y: -4, g: tkUp(`
.GG
v.w
O.w
O.w
OSw
O.w
v.w
.GG`) };
// 옆(오른쪽을 봄): 시위가 몸 쪽(왼쪽), 손잡이가 앞(오른쪽) · 앞 손이 손잡이를 쥔다
TK_CBOW.side = { x: 11, y: -6, g: tkUp(`
GG.
w.v
w.O
w.O
SSO
w.O
w.v
GG.`), draw: tkUp(`
..GG..
..w.v.
.w..O.
w...O.
SROOSM
w...O.
.w..O.
..w.v.
..GG..`) };
TK_CBOW.side.dx = -4;   // draw는 왼쪽으로 4칸 더 (시위를 몸 쪽으로 당긴다)
Object.assign(PX_EX, {
  // 손목 석궁: 먼 팔(보는 사람 오른쪽) 팔뚝 위 개머리 · 손 쪽 끝에 쇠 활대
  wxbow: E2(`
.O.
.O.
NMN`, 12, 2),
  // 볼트통: 허리 왼쪽 옆(활 든 손 아래) · 볼트 깃 끝만 보인다
  bcase: E2(`
R.
OO
Ov
vv`, 0, 6)
});
Object.assign(PXS_EX, {
  wxbow: E2(`
.O.
.O.
NMN`, -3, 0, 1),
  bcase: E2(`
.R
OO
Ov
vv`, 1, 5)
});
// 머리마다 뒷모습: fill = 두건 바탕, mask = 머리 그림에서 지울 얼굴 · 가면 글자, strap = 끈 줄(머리 그림의 줄 번호, 반 해상도)
const TK_BACK = {
  wolfhood: { fill: 'J', edge: 'j', mask: 'ZzKX' },
  wolfhood2: { fill: 'J', edge: 'j', mask: 'ZzKX' },
  trapper: { fill: 'J', edge: 'j', mask: 'Aa', maskFrom: 4, trim: 'A' },   // 뒤: 털 테 아래는 가죽 덮개 + 끝단 털
  bandana: { fill: 'J', edge: 'j', mask: '' },
  lensmask: { fill: 'J', edge: 'j', mask: 'GXFr', strap: [4, 'F'] },
  skullmask: { fill: 'J', edge: 'j', mask: 'ZzKX', strap: [4, 'v'] }
};
const TK_FACE = 'SstkwpmEHhL';
function tkBackGrid(a, L) {
  const g = pxAdvGrid(a, 'idle', 0, L), H = PX_HEAD[L.head], B = TK_BACK[L.head], rows = pxRows(H.g);
  const x0 = BX + (H.x || 0), y0 = HY - H.top, last = rows.length - 1;
  for (let y = 0; y < rows.length; y++) {
    const r = rows[y], lo = r.search(/[^.]/), hi = r.length - 1 - [...r].reverse().join('').search(/[^.]/);
    for (let x = 0; x < r.length; x++) {
      const gy = y0 + y, gx = x0 + x, ch = g[gy] && g[gy][gx]; if (!ch) continue;
      const hc = r[x], inside = x > lo && x < hi;
      if (hc === '.' ? inside && TK_FACE.includes(ch) : B.mask.includes(hc) && (y >> 1) >= (B.maskFrom || 0)) {
        const hy = y >> 1;   // 반 해상도 줄
        g[gy][gx] = B.trim && y >= last - 1 && x > lo && x < hi ? B.trim : (B.strap && hy === B.strap[0]) ? B.strap[1] : (x <= lo + 1 || x >= hi - 1) ? B.edge : B.fill;
      } else if (B.strap && (y >> 1) === B.strap[0] && 'Jj'.includes(hc) && x > lo + 1 && x < hi - 1) g[gy][gx] = B.strap[1];
    }
  }
  // 좌우 뒤집기 (몸 가운데 = 19.5 — 2×2 칸 짝도 그대로 맞는다)
  for (const row of g) row.reverse();
  const put = (rows2, x, y) => pxPut(g, rows2, x, y);
  const ex = L.ex || [];
  // 망토는 등을 덮는다: 앞 그림의 테만 있는 망토를 채워서 몸 위에
  if (ex.includes('cape')) {
    const cr = pxRows(PX_EX.cape.g).map((r, i) => {
      const lo = r.search(/[^.]/), hi = r.length - 1 - [...r].reverse().join('').search(/[^.]/), mid = r.length >> 1;
      return [...r].map((c, x) => x < lo || x > hi ? '.' : c !== '.' ? c : i >= 3 && (x === mid || x === mid - 4 || x === mid + 4) ? 'r' : 'R').join('');
    });
    const w = cr[0].length;
    put(pxTone(cr.map(r => [...r].reverse().join('')), PX_CAPE_KEYS), 39 - (BX + PX_EX.cape.x) - (w - 1), BY + PX_EX.cape.y);
  }
  if (ex.includes('fur')) { const fr = pxRows(PX_EX.fur.g); put(fr.map(r => [...r].reverse().join('')), 39 - (BX + PX_EX.fur.x) - (fr[0].length - 1), BY + PX_EX.fur.y); }
  // 화살통: 등 위로 (앞에서는 오른 어깨 뒤 → 뒤에서는 왼쪽), 허리까지 길게
  const q = pxRows(PX_OFFSHAPE.quiverF).concat(['.90.', '.90.', '.99.']).map(r => [...r].reverse().join(''));
  put(pxUp(q), 39 - 24 - 7, 20);
  return g;
}
function tkBack(a, L) {
  return pxBake('TB|' + JSON.stringify(L), tkBackGrid(a, L), Object.assign(pxPal(L, a.look || {}), pxOffPal(a)), 19, BY + 13);
}
// 당기기: 시위를 몸 쪽으로 당긴 그림은 draw — x를 dx만큼 옮겨 놓는다
// 궁수(archer)의 활 칸은 단궁(bow) — 시안판에서는 단궁 · 장궁 칸 모두 컴파운드 보우로 잠깐 바꾼다
function tkWith2(fn) {
  const keep = [PX_BOW.bow, PX_BOW.long, PXS_BOW.bow, PXS_BOW.long];
  const side = { x: TK_CBOW.side.x, y: TK_CBOW.side.y, g: TK_CBOW.side.g, draw: TK_CBOW.side.draw };
  PX_BOW.bow = PX_BOW.long = TK_CBOW.front; PXS_BOW.bow = PXS_BOW.long = side;
  try { return fn(); } finally { [PX_BOW.bow, PX_BOW.long, PXS_BOW.bow, PXS_BOW.long] = keep; }
}
function tkDraw(a, L) {   // 옆 당기기: draw 그림만 dx 옮겨서 (먼 팔 손목 석궁은 몸 뒤라 뺀다)
  const B = PXS_BOW.bow, keep = B.x; B.x = keep + TK_CBOW.side.dx;
  try { return pxsAdvSprite(a, 'atk', 0, Object.assign({}, L, { ex: (L.ex || []).filter(e => e !== 'wxbow'), _d: 1 })); } finally { B.x = keep; }
}
// 머리칼 색은 시안마다 정해 둔다 (뒷모습 · 옆모습이 모험가마다 달라지지 않게)
TK.tr[0][2].hairc = '#4a3424'; TK.tr[1][2].hairc = '#3a2a1e'; TK.tr[2][2].hairc = '#2e2418';
TK.st[0][2].hairc = '#1e1a1e'; TK.st[1][2].hairc = '#1e1a1e'; TK.st[2][2].hairc = '#1e1a1e';
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 42 * Z, LW = 250, cols = ['앞', '옆', '뒤', '활 당기기', '게임 속 크기'];
  const secs = ['tr', 'st'];
  const H = 84 + secs.reduce((s, k) => s + 50 + TK[k].length * RH, 0);
  const [c, g] = mkCanvas(LW + 4 * CW + 140, H);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 16px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('트래커 · 스토커 캐릭터 시안 — 직업마다 셋 중 하나 (11-10 23:09)', 10, 24);
  g.font = '12px Galmuri11'; g.fillStyle = '#a89c8c';
  g.fillText('옛 사냥꾼 · 괴수사냥꾼(괴물사냥꾼 · 드래곤 슬레이어) 그림은 버리고 새로. 손에 컴파운드 보우(끝에 도르래), 먼 팔 손목에 손목 석궁,', 10, 44);
  g.fillText('허리에 볼트통, 등에 화살통(궁수 공통). 줄: 트래커(2차) → 스토커(3차) → 프레데터(4차) → 아나이얼레이터(5차, 생각 중).', 10, 60);
  g.fillText('맨 오른쪽 칸 = 실제 크기(두 배 · 한 배). 이름 · 색은 제안.', 10, 76);
  let y = 84;
  secs.forEach(k => {
    g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText(TK_NAME[k], 10, y + 22);
    g.fillStyle = '#3a3640'; g.fillRect(10, y + 30, c.width - 20, 1);
    cols.forEach((n, i) => { g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(n, LW + i * CW + (i === 4 ? 14 : CW / 2 - g.measureText(n).width / 2), y + 46); });
    y += 50;
    TK[k].forEach(([nm, desc, L]) => tkWith2(() => {
      PXC.clear();
      const a = makeAdv({ cls: 'archer', lv: 60 }); a.id = 1;
      a.eq.weapon = makeGear('bow', 5, 0); a.eq.off = null;
      g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(nm, 10, y + 40);
      g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c';
      let ty = y + 60, line = '';
      for (const w of desc.split(' ')) { if (g.measureText(line + w).width > LW - 24) { g.fillText(line, 10, ty); ty += 15; line = ''; } line += w + ' '; }
      g.fillText(line, 10, ty);
      const put = (s, i, z, dx, dy) => { const x = LW + i * CW + CW / 2 + (dx || 0), yy = y + RH - 16 + (dy || 0); g.drawImage(s.cv, Math.round(x - s.ax * z), Math.round(yy - s.ay * z), s.cv.width * z, s.cv.height * z); };
      const side = pxsAdvSprite(a, 'idle', 0, L);
      put(pxAdvSprite(a, 'idle', 0, L), 0, Z); put(side, 1, Z); put(tkBack(a, L), 2, Z);
      put(tkDraw(a, L), 3, Z);
      g.fillStyle = '#0e1118'; g.fillRect(LW + 4 * CW, y + 30, 110, RH - 40);
      put(side, 4, 2, -50, -10); put(side, 4, 1, 0, -10);
      y += RH;
    }));
  });
  return c.toDataURL();
};
