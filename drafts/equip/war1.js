/* ═══ 전사 리모델링 시안 1 (사용자 11-10 14:06 · 14:08) ═══
   방패는 왼손(앞모습 = 보는 사람 오른쪽, 옆모습 = 먼 팔 · 몸 앞쪽에 걸쳐 든다), 무기는 오른손.
   검투사 버클러 + 글라디우스 · 기사 라운드 실드 + 장검(롱소드) · 광전사 대검(방패 없음) · 마검사 에테르 실드 + 룬소드(검마다 속성) */
const WR = {};
// ── 방패 모양 (뭉툭 칸): 1 테 · 2 판 · 3 판 그늘/결 · 4 징/보석 · 5 빛/징 · 6 무늬 ──
const WR_SHAPE = {
  // 버클러 (주먹만 한 둥근 방패): 견습 나무 · 강철 · 서리 법랑 · 영웅 금테 붉은 판
  buckler: [`
.111.
12321
13431
12321
.111.`, `
.111.
13331
13431
13331
.111.`, `
.111.
16621
16421
12261
.111.`, `
.151.
16661
16461
16661
.151.`],
  // 라운드 실드 (중간 크기): 견습 나무 판자 · 강철 붉은 띠 · 서리 금 고리 · 영웅 붉은 판 금 징
  round: [`
..111..
.13231.
1232321
1234321
1232321
.13231.
..111..`, `
..111..
.12221.
1222221
1664661
1222221
.13331.
..111..`, `
..111..
.16661.
1655561
1654561
1655561
.16661.
..111..`, `
..151..
.12221.
5266625
1264621
5266625
.12221.
..151..`],
  // 에테르 실드: 손 앞에 떠 있는 작은 오브(마나) · 금 테 · 날개살(단계마다 늘어난다) · 빛 고리
  ether: [`
.......
..111..
.14221.
.12221.
.12231.
..111..
.......`, `
......5
..1115.
.14221.
.12221.
.12231.
.5111..
5......`, `
.....55
..1115.
.14221.
612221.
.12231.
.5111..
55.....`, `
6....55
..11156
.14221.
612221.
.12231.
65111..
55....6`]
};
const WR_PAL = {
  buckler: [{ 1: '#5a3a20', 2: '#a8743e', 3: '#8a5a30', 4: '#9aa0aa', 5: '#d8dce4', 6: '#7a5030' },
            { 1: '#4a505c', 2: '#a4acb8', 3: '#7e8696', 4: '#e8ecf2', 5: '#3a404c', 6: '#c8ccd4' },
            { 1: '#d8e4f0', 2: '#4a7ac8', 3: '#3a5aa0', 4: '#9ae8ff', 5: '#ffffff', 6: '#2e5aa8' },
            { 1: '#7a4a10', 2: '#c8902a', 3: '#a0701a', 4: '#e83a3a', 5: '#ffe070', 6: '#b02a2a' }],
  round:   [{ 1: '#5a5e68', 2: '#b0804a', 3: '#8a5e34', 4: '#9aa0aa', 5: '#d8dce4', 6: '#7a5030' },
            { 1: '#3e444e', 2: '#b8c0cc', 3: '#8e96a4', 4: '#f0f2f6', 5: '#ffffff', 6: '#b83a32' },
            { 1: '#d8e0ec', 2: '#4a7ad0', 3: '#3a5aa0', 4: '#9ae8ff', 5: '#f0c24a', 6: '#2e5aa8' },
            { 1: '#3a2a20', 2: '#a82830', 3: '#7a1a20', 4: '#7af0ff', 5: '#ffd860', 6: '#e8b030' }],
  ether:   [{ 1: '#a8a090', 2: '#8ad0f0', 3: '#5aa0c8', 4: '#ffffff', 5: '#c8c0a8', 6: '#c8f0ff' },
            { 1: '#c8902a', 2: '#7ae0a0', 3: '#4ab070', 4: '#ffffff', 5: '#ffe070', 6: '#c8ffd8' },
            { 1: '#e8b030', 2: '#b88aff', 3: '#7a5ad0', 4: '#fff4ff', 5: '#fff0a0', 6: '#e8d8ff' },
            { 1: '#ffd860', 2: '#ff9a4a', 3: '#e05a2a', 4: '#fffce0', 5: '#ffffff', 6: '#fff0b0' }]
};
// 놓는 곳 (뭉툭 칸 · 작업판 좌표). 앞: 보는 사람 오른쪽(왼손) · 옆: 먼 팔로 몸 앞쪽에 (몸 뒤에 깔려 앞으로 삐져나온다)
const WR_AT = { front: { buckler: [13, 19], round: [12, 17], ether: [13, 15], heater: [13, 18], kite: [13, 18], tower: [12, 17], cross: [13, 17] }, side: { buckler: [12, 16], round: [10, 15], ether: [12, 15], heater: [11, 15], kite: [11, 15], tower: [10, 14], cross: [11, 15] } };
// 룬소드 속성: 룬 빛(D) · 룬 그늘(T) · 손잡이 보석(Y)
const WR_RUNE = { fire: ['#ffb040', '#e04a1a', '#ff6a2a', '불'], ice: ['#c8f4ff', '#4ab8e8', '#7ae0ff', '빙결'], thunder: ['#fff27a', '#e0b020', '#ffe04a', '번개'],
                  wind: ['#c8ffd8', '#3ac880', '#7ae8a8', '바람'], earth: ['#f0c878', '#9a6a2a', '#d8a050', '흙'], dark: ['#d8b8ff', '#7a4ad0', '#a87af0', '어둠'] };

/* ── 무기 그림 ── */
// 글라디우스: 짧고 넓은 날 · 짧은 코등이 · 둥근 자루 끝 (앞모습 세워 든 그림, '@' = 손)
const WR_WPN = {
  gladius: `
.x.
xMN
xMN
xMN
xMN
xMN
GGGG
.@.
.v.
.O.
`,
  rune: `
.x
xM
xD
xM
xD
xM
xD
xN
xN
GYGG
.@.
.v.
.G.
`
};

/* ── 앞모습: 무기는 오른손(보는 사람 왼쪽), 방패는 왼손(오른쪽) ── */
function wrKind(a) { const o = a.eq && a.eq.off; return o && WR_SHAPE[o.base] ? o.base : null; }
function wrAdvGrid(a, pose, fr) {
  const cls = PXL[a.cls] ? a.cls : PXL[jobBase(a.cls)] ? jobBase(a.cls) : 'warrior', L0 = PXL[cls], [L, Q] = pxOffLook(a, L0);
  const look = a.look || {}, ex = L.ex || [], g = pxGrid(PXW, PXH);
  const wpn = a.eq && a.eq.weapon, base = wpn ? wpn.base : 'sword', wk = WR_WPN[base] ? base : pxWeapon(a.cls, base);
  for (const e of ex) { const E = PX_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), BX + E.x, BY + E.y); }
  pxPut(g, pxRows(PX_BODY[L.body] || PX_BODY.tunic).concat(pxRows(PX_LEGS[L.body === 'coat' ? 'coat' : 'stand'])), BX, BY);
  pxPut(g, PX_HAIR[L.hair || ['short', 'long', 'spiky'][(a.id || 0) % 3]] || PX_HAIR.short, BX, HY);
  pxPut(g, PX_FACE, BX, HY + 6);
  for (const e of ex) { const E = PX_EX[e]; if (E && !E.under) { if (e === 'mask' || e === 'paint') continue; pxPut(g, pxRows(E.g), BX + E.x, BY + E.y); } }
  const H = PX_HEAD[L.head];
  if (L.face) { const F = PX_HEAD[L.face]; pxPut(g, pxRows(F.g), BX + (F.x || 0), HY - F.top); }
  for (const e of ['mask', 'paint']) if (ex.includes(e)) { const F = PX_HEAD[e]; pxPut(g, pxRows(F.g), BX, HY); }
  if (H) pxPut(g, pxRows(H.g), BX + (H.x || 0), HY - H.top);
  // 오른손(보는 사람 왼쪽) 무기: 세운 그림을 뒤집어 왼쪽 손에
  const W = pxFlip(pxRows(WR_WPN[wk] || PX_WPN[wk] || PX_WPN.sword)), [bx, by] = pxFind(W, '@'), lx = -2, ly = PX_HAND.left[1];
  pxPut(g, W, BX + lx - bx, BY + ly - by, 'v'); pxPut(g, ['SS', 'ss'], BX + lx, BY + ly);
  const bob = pose === 'idle' && fr % 2;
  if (bob) for (let y = BY + 8; y > 0; y--) g[y] = g[y - 1].slice(), y === 1 && (g[0] = new Array(PXW).fill('.'));
  // 왼손 방패 (보는 사람 오른쪽, 몸 앞에)
  const k = wrKind(a), o = a.eq && a.eq.off;
  if (k) { const lk = offLook(o.t), [fx, fy] = WR_AT.front[k], fl = k === 'ether' && fr % 2 ? -1 : 0; pxPut(g, pxUp(pxRows(WR_SHAPE[k][lk])), fx * 2, fy * 2 + (bob ? 1 : 0) + fl * 2); }
  else if (o && PX_SHIELD_SHAPE[o.base]) { const sh = PX_SHIELD_SHAPE[o.base], [fx, fy] = WR_AT.front[sh] || [13, 18]; pxPut(g, pxOffRows(sh), fx * 2, fy * 2 + (bob ? 1 : 0)); }
  return g;
}
function wrPal(a, L) {
  const p = Object.assign(pxPal(L, a.look || {}), pxOffPal(a)), k = wrKind(a), w = a.eq && a.eq.weapon;
  if (k) Object.assign(p, WR_PAL[k][offLook(a.eq.off.t)]);
  const R = WR_RUNE[(w && w.el) || 'fire']; p.D = R[0]; p.T = R[1]; p.Y = R[2];
  return p;
}
const wrKey = (a, v, pose, fr) => 'WR|' + v + '|' + a.cls + a.id + '|' + (a.eq.weapon ? a.eq.weapon.base + a.eq.weapon.t + (a.eq.weapon.el || '') : '-') + '|' + (wrKind(a) ? wrKind(a) + offLook(a.eq.off.t) : '-') + '|' + pose + fr;
function wrFront(a, fr) { const L = PXL[a.cls] || advLook(a); return pxBake(wrKey(a, 'F', 'idle', fr), wrAdvGrid(a, 'idle', fr), wrPal(a, L), BX + 8, BY + 13); }

/* ── 옆모습: 게임 그리기를 그대로 쓰고, 방패 · 무기만 새것으로 바꿔 끼운다 ── */
function wrApply() {
  for (const k of ['buckler', 'round', 'ether']) WR_SHAPE[k].forEach((s, i) => { PX_OFFSHAPE[k + i] = s; });
  // 모양 = 종류 + 단계 모습. 옆 · 동작의 기본 자리 = WR_AT.side (몸 뒤에 깔려 앞쪽으로 삐져나온다)
  const _of = pxOffOf;
  pxOffOf = function (a, L) { const k = wrKind(a); if (k) return { base: 'shield', look: offLook(a.eq.off.t), shape: k + offLook(a.eq.off.t) }; return _of(a, L); };
  for (const k of ['buckler', 'round', 'ether']) for (let i = 0; i < 4; i++) { PX_OFFAT.side.shield[k + i] = WR_AT.side[k].slice(); PX_OFFAT.front.shield[k + i] = WR_AT.front[k].slice(); PX_SHIELD_SHAPE[k + i] = k + i; }
  for (const k of ['heater', 'kite', 'tower', 'cross']) PX_OFFAT.side.shield[k] = WR_AT.side[k].slice();   // 옛 방패도 먼 팔로 몸 앞에
  // 에테르 실드: 막을 때 오브 앞에 마나 막(활꼴 · 성긴 빛 칸)이 펼쳐진다
  const _mg = pxsMotGrid;
  pxsMotGrid = function (a, mk, f, Lx) {
    const out = _mg(a, mk, f, Lx);
    if (wrKind(a) === 'ether' && (mk === 'block' || mk === 'bash') && f >= 2 && f <= 5) {
      const F = pxsMotFr(mk, f), d = F.sh || WR_AT.side.ether, x0 = d[0] + (d[2] ? F.lean : 0) + 7, y0 = d[1] + F.cr + 3, R = 7;
      for (let j = -R; j <= R; j++) { const bend = Math.round(R - Math.sqrt(R * R - j * j)), x = (x0 - bend) * 2, y = (y0 + j) * 2;
        for (let q = 0; q < 2; q++) for (let p2 = 0; p2 < 2; p2++) { const X = x + p2, Y = y + q; if (Y >= 0 && Y < out.length && X >= 0 && X < out[0].length && ((X + Y + f) % 2 === 0 || Math.abs(j) > R - 2)) out[Y][X] = (Math.abs(j) % 3 === 0 ? '5' : '6'); } }
    }
    return out;
  };
  const _pal = pxOffPal;
  pxOffPal = function (a) { const p = _pal(a), k = wrKind(a), w = a.eq && a.eq.weapon; if (k) Object.assign(p, WR_PAL[k][offLook(a.eq.off.t)]); const R = WR_RUNE[(w && w.el) || 'fire']; p.D = R[0]; p.T = R[1]; p.Y = R[2]; return p; };
  const _key = pxOffKey;
  pxOffKey = function (a) { const w = a.eq && a.eq.weapon; return _key(a) + (wrKind(a) ? '|' + wrKind(a) + offLook(a.eq.off.t) : '') + (w && w.el ? '|' + w.el : ''); };
  // 무기: 글라디우스(짧은 날 · 청동 코등이) · 룬소드(날에 룬 빛) · 대검은 두 손으로
  Object.assign(PXS_FAMW, { gladius: 'sword', rune: 'sword' });
  const _wk = pxWeapon;
  pxWeapon = function (cls, base) { return base === 'gladius' || base === 'rune' ? base : _wk(cls, base); };
  const _wpn = pxsMWpn;
  pxsMWpn = function (F, wk) {
    if (wk === 'gladius') { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a), px = -dy, py = dx, out = [], Lb = Math.max(1, Math.round(3 * F.k)); out.push([hx + dx - 0.5 * px, hy + dy - 0.5 * py, 'O'], [hx + dx + 0.5 * px, hy + dy + 0.5 * py, 'O']); for (let t = 2; t <= 1 + Lb; t++) out.push([hx + dx * t, hy + dy * t, t === 1 + Lb ? 'x' : 'M']); return { cells: out }; }
    if (wk === 'rune') { const cells = pxsMSword(F, false).map(([x, y, ch], i) => [x, y, ch === 'G' && i === 0 ? 'Y' : ch === 'x' && i % 2 ? 'D' : ch]); return { cells }; }
    const r = _wpn(F, wk);
    if (wk === 'great') { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a); r.hand2 = [Math.round(hx - dx), Math.round(hy - dy)]; }   // 대검: 두 손으로 쥔다
    return r;
  };
  Object.assign(PX_WPN, { gladius: WR_WPN.gladius, rune: WR_WPN.rune });
  PXC.clear();
}

/* ── 시안판 ── */
const WR_CL = [['gladiator', 'gladius', 'buckler', 2], ['champion', 'gladius', 'buckler', 6], ['knight', 'sword', 'round', 2], ['paladin', 'sword', 'cross', 6],
               ['berserker', 'great', null, 2], ['bloodlord', 'great', null, 6], ['spellblade', 'rune', 'ether', 2], ['arcblade', 'rune', 'ether', 6], ['warrior', 'sword', 'shield', 0]];
function wrShape(a) { const k = wrKind(a); if (k) PX_SHIELD_SHAPE[k] = k + offLook(a.eq.off.t); return a; }
function wrAdv(cls, wb, ob, t, el) {
  const a = makeAdv({ cls, lv: 60 });
  a.eq.weapon = { base: wb, t, q: 0, el: el || (wb === 'rune' ? 'fire' : undefined) };
  a.eq.off = ob ? { base: ob, t, q: 0 } : null;
  return a;
}
function wrText(g, s, x, y, c, f) { g.font = f || '12px Galmuri11'; g.fillStyle = c || '#e8e0d0'; g.fillText(s, x, y); }
function wrPut(g, s, x, y, Z) { g.drawImage(s.cv, Math.round(x - s.ax * Z), Math.round(y - s.ay * Z), s.cv.width * Z, s.cv.height * Z); }
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 40 * Z, cols = ['지금 (옆)', '시안 앞', '시안 옆', '내려베기', '막기 · 방패 밀기'];
  // 지금 모습을 먼저 찍어 둔다 (바꿔 끼우기 전)
  const cur = WR_CL.map(([cls]) => { const a = makeAdv({ cls, lv: 60 }); a.eq.weapon = makeGear(WEAPON_OF[cls], 2, 0); a.eq.off = gearFits(a, { base: 'shield', t: 0 }) ? makeGear(shieldOf(cls), 2, 0) : null; return pxsAdvSprite(a, 'idle', 0); });
  wrApply();
  const [c, g] = mkCanvas(170 + cols.length * CW, 64 + WR_CL.length * RH);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  wrText(g, '전사 리모델링 시안 1 — 방패는 왼손(앞모습 오른쪽 · 옆모습 먼 팔), 무기는 오른손', 12, 24, '#f0c45a', '700 15px Galmuri11');
  cols.forEach((n, i) => wrText(g, n, 170 + i * CW + 12, 52, '#c8c0b0'));
  WR_CL.forEach(([cls, wb, ob, t], r) => {
    const a = wrShape(wrAdv(cls, wb, ob, t)), y0 = 64 + r * RH, by = y0 + RH - 12, cx = i => 170 + i * CW + CW / 2;
    wrText(g, CLASSES[cls].name, 12, y0 + 26, '#f4ecd8', '700 14px Galmuri11');
    const wn = { gladius: '글라디우스', sword: '장검(롱소드)', great: '대검 · 두 손', rune: '룬소드(불)' }[wb], on = { buckler: '버클러', round: '라운드 실드', cross: '십자 방패(그대로)', ether: '에테르 실드', shield: '히터 방패(그대로)' }[ob] || '방패 없음';
    wrText(g, wn, 12, y0 + 46, '#a8c0d8'); wrText(g, on, 12, y0 + 62, '#d8b878'); wrText(g, `${['견습', '강철', '서리', '영웅'][offLook(t)]} 단계`, 12, y0 + 78, '#8a8478', '11px Galmuri11');
    wrPut(g, cur[r], cx(0), by, Z);
    wrPut(g, wrFront(a, 0), cx(1), by, Z);
    wrPut(g, pxsAdvSprite(a, 'idle', 0), cx(2), by, Z);
    wrPut(g, pxsAdvSprite(a, wb === 'great' ? 'm:smash' : 'm:down', 4), cx(3), by, Z);
    if (ob) wrPut(g, pxsAdvSprite(a, ob === 'ether' ? 'm:block' : 'm:bash', ob === 'ether' ? 3 : 4), cx(4), by, Z);
    else wrPut(g, pxsAdvSprite(a, 'm:smash', 6), cx(4), by, Z);
  });
  return [c.toDataURL(), wrSheet2()];
};
// 시안판 2: 방패 단계별 (견습 · 강철 · 서리 · 영웅) + 룬소드 속성 + 새 무기
function wrBig(g, rows, pal, x, y, Z) { rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.' || ch === ' ') return; g.fillStyle = pal[ch === '@' ? 'v' : ch] || '#ff00ff'; g.fillRect(x + i * Z, y + j * Z, Z, Z); })); }
function wrSheet2() {
  const Z = 3, CW = 150, RH = 150, [c, g] = mkCanvas(170 + 6 * CW, 70 + 5 * RH);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  wrText(g, '방패 단계별 모양 · 문양 (견습 → 강철 → 서리 → 영웅) · 룬소드 속성 · 새 무기', 12, 24, '#f0c45a', '700 15px Galmuri11');
  const TN = ['견습', '강철', '서리', '영웅'];
  [['buckler', 'gladiator', '버클러', '검투사 · 챔피언'], ['round', 'knight', '라운드 실드', '기사 · 성기사?'], ['ether', 'spellblade', '에테르 실드', '마검사 · 마검성']].forEach(([k, cls, nm, who], r) => {
    const y0 = 50 + r * RH;
    wrText(g, nm, 12, y0 + 30, '#f4ecd8', '700 14px Galmuri11'); wrText(g, who, 12, y0 + 50, '#a89c8c');
    for (let t = 0; t < 4; t++) {
      const x0 = 170 + t * CW, rows = pxRows(WR_SHAPE[k][t]);
      wrText(g, TN[t], x0 + 6, y0 + 14, '#c8c0b0', '11px Galmuri11');
      wrBig(g, rows, WR_PAL[k][t], x0 + 6, y0 + 22, 8);
      const a = wrShape(wrAdv(cls, cls === 'spellblade' ? 'rune' : cls === 'gladiator' ? 'gladius' : 'sword', k, [0, 2, 4, 6][t]));
      wrPut(g, wrFront(a, 0), x0 + 100, y0 + RH - 18, Z);
      if (t === 3) wrPut(g, pxsAdvSprite(a, k === 'ether' ? 'm:block' : 'm:bash', k === 'ether' ? 3 : 4), x0 + CW + 50, y0 + RH - 18, Z);
    }
    if (r === 2) wrText(g, '막을 때 마나 막', 170 + 4 * CW + 10, y0 + 14, '#c8c0b0', '11px Galmuri11');
  });
  // 룬소드: 속성마다 룬 빛
  const y3 = 50 + 3 * RH;
  wrText(g, '룬소드', 12, y3 + 30, '#f4ecd8', '700 14px Galmuri11'); wrText(g, '검마다 속성 하나', 12, y3 + 50, '#a89c8c'); wrText(g, '그 속성 버프', 12, y3 + 66, '#a89c8c');
  Object.entries(WR_RUNE).forEach(([el, R], i) => {
    const x0 = 170 + i * CW, a = wrShape(wrAdv('arcblade', 'rune', 'ether', 6, el));
    wrText(g, R[3], x0 + 6, y3 + 14, R[2], '700 12px Galmuri11');
    const pal = Object.assign(pxPal(PXL.arcblade, a.look || {}), { D: R[0], T: R[1], Y: R[2] });
    wrBig(g, pxRows(WR_WPN.rune), pal, x0 + 8, y3 + 22, 7);
    wrPut(g, pxsAdvSprite(a, 'm:down', 4), x0 + 96, y3 + RH - 18, Z);
  });
  // 새 무기 (크게): 글라디우스 · 장검 · 대검
  const y4 = 50 + 4 * RH;
  wrText(g, '무기', 12, y4 + 30, '#f4ecd8', '700 14px Galmuri11');
  [['gladius', '글라디우스 (검투사)'], ['sword', '장검 = 롱소드 (기사)'], ['great', '대검 · 두 손 (광전사)']].forEach(([w, n], i) => {
    const x0 = 170 + i * 2 * CW, pal = pxPal(PXL.knight, {});
    wrText(g, n, x0 + 6, y4 + 14, '#c8c0b0', '11px Galmuri11');
    wrBig(g, pxRows(WR_WPN[w] || PX_WPN[w]), pal, x0 + 10, y4 + 22, 6);
    const a = wrShape(wrAdv(w === 'gladius' ? 'gladiator' : w === 'great' ? 'berserker' : 'knight', w, w === 'gladius' ? 'buckler' : w === 'great' ? null : 'round', 2));
    wrPut(g, pxsAdvSprite(a, w === 'great' ? 'm:smash' : 'm:down', 3), x0 + 150, y4 + RH - 18, Z); wrPut(g, pxsAdvSprite(a, w === 'great' ? 'm:smash' : 'm:side', 5), x0 + 230, y4 + RH - 18, Z);
  });
  return c.toDataURL();
}
