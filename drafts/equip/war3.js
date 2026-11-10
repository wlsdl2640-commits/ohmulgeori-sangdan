/* ═══ 시안 3 (사용자 11-10 14:43): 룬소드는 색만 바꾸지 말고, 고유한 이름 · 속성이 들어간 모양 ═══
   지옥의 업화(불 — 칼날이 불꽃) · 혹한의 결정(빙결 — 얼음 결정). 나머지 넷은 이름 · 모양 제안(임시).
   그림은 뭉툭 칸(칸 하나 = 2×2 픽셀)으로 그려 앞모습 · 옆모습(동작마다 돌려서) 모두 같은 칼이 되게 한다.
   색 글자: D 빛 · T 날 · Y 날 그늘 · e 무늬/보석 · i 무늬 2 · l 자루 · y 자루 그늘 · @ 손 */
const WR_RS = {
  fire: { name: '지옥의 업화', el: '불', pal: { D: '#fff2a8', T: '#ff8a2a', Y: '#c8281a', e: '#ffd040', i: '#ff5a1a', l: '#4a2a26', y: '#24140f' }, g: `
.i..
.TY.
.DT.
TDY.
.DTi
.DY.
TDT.
.DY.
.DT.
yeyy
.@..
.y..
.e..` },
  ice: { name: '혹한의 결정', el: '빙결', pal: { D: '#ffffff', T: '#a8e8ff', Y: '#3a8ad0', e: '#e0f8ff', i: '#5ab8f0', l: '#b8c8d8', y: '#5a6a80' }, g: `
.D..
.DY.
.TY.
eTYe
.TY.
.TY.
eTYe
.TY.
.TY.
lill
.@..
.y..
.i..` },
  thunder: { name: '벼락 송곳니', el: '번개', pal: { D: '#ffffff', T: '#ffe84a', Y: '#c89a10', e: '#9ae8ff', i: '#6a6a7a', l: '#3a3a4a', y: '#1e1e28' }, g: `
..D.
.DT.
.TY.
DT..
.DT.
..TY
.DY.
DT..
.T..
yeiy
.@..
.y..
.e..` },
  wind: { name: '질풍의 깃', el: '바람', pal: { D: '#f4fff8', T: '#9af0c0', Y: '#3aa070', e: '#ffffff', i: '#6ad8a0', l: '#8a6a40', y: '#5a4024' }, g: `
...D
..DT
..TY
.DT.
.TY.
.DT.
.TY.
.TY.
.TY.
ylel
.@..
.y..
.l..` },
  earth: { name: '암반 가르개', el: '흙', pal: { D: '#d8c8a8', T: '#a08860', Y: '#6a5438', e: '#ffb040', i: '#8a7050', l: '#5a4028', y: '#3a2818' }, g: `
.TT.
TDTY
TeTY
TDTY
TDeY
TDTY
.DTY
.TY.
.TY.
ylly
.@..
.y..
.y..` },
  dark: { name: '심연의 송곳니', el: '어둠', pal: { D: '#e8c8ff', T: '#5a3a8a', Y: '#2a1a40', e: '#c88aff', i: '#8a4ad8', l: '#2a2030', y: '#120c18' }, g: `
.e..
.TY.
eTY.
.TYe
eTY.
.TYe
eTY.
.TY.
.TY.
yiyy
.@..
.y..
.i..` }
};
// 앞모습 그림(뭉툭 칸)을 옆모습 칼 칸으로: '@' 줄 = 손(t 0), 위로 갈수록 칼끝(t +), 손 열 기준 옆 칸 s
function wrRsCells(el) {
  const rows = pxRows(WR_RS[el].g), [ax, ay] = pxFind(rows, '@'), out = [];
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.' || ch === '@') return; out.push([ay - j, i - ax, ch]); }));
  return out;
}
function wrApply3() {
  // 옆모습: 동작 장의 방향으로 돌려 칸을 찍는다 (손 = 그 장의 손 자리)
  const _w = pxsMWpn;
  pxsMWpn = function (F, wk) {
    if (wk !== 'rune' || !WR.rsEl) return _w(F, wk);
    const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a), px = -dy, py = dx, k = Math.max(0.6, F.k || 1);
    return { cells: wrRsCells(WR.rsEl).map(([t, s, ch]) => [hx + dx * t * (t > 0 ? k : 1) + px * s, hy + dy * t * (t > 0 ? k : 1) + py * s, ch]) };
  };
  const _op = pxOffPal;
  pxOffPal = function (a) { const p = _op(a), el = a.eq && a.eq.weapon && a.eq.weapon.el; if (a.eq && a.eq.weapon && a.eq.weapon.base === 'rune' && WR_RS[el]) Object.assign(p, WR_RS[el].pal); return p; };
  WR_WPN.rune = null;
  PXC.clear();
}
// 팔레트: 칼 색은 칼마다 (D T Y e i l y)
const _wrPal3 = wrPal;
wrPal = function (a, L) { const p = _wrPal3(a, L), el = a.eq && a.eq.weapon && a.eq.weapon.el; if (WR_RS[el]) Object.assign(p, WR_RS[el].pal); return p; };
function wrRsAdv(cls, el, t) { const a = wrShape(wrAdv(cls, 'rune', 'ether', t, el)); return a; }
// 앞모습: 칼 그림을 뭉툭 칸 두 배로 넣는다 (wrAdvGrid가 WR_WPN[wk]를 쓰므로 그때그때 바꿔 끼운다)
function wrRsFront(a, fr) { const el = a.eq.weapon.el; WR_WPN.rune = pxUp(pxRows(WR_RS[el].g)).join('\n'); const s = pxBake('WRS|F|' + a.cls + el + fr + a.eq.off.t, wrAdvGrid(a, 'idle', fr), wrPal(a, PXL[a.cls]), BX + 8, BY + 13); return s; }
// 옆모습 그림: 칼마다 열쇠가 달라야 한다 (pxOffKey에 속성이 들어 있다)
function wrRsSide(a, pose, f) { WR.rsEl = a.eq.weapon.el; const s = pxsAdvSprite(a, pose, f); WR.rsEl = null; return s; }
function wrSheetE() {
  const els = Object.keys(WR_RS), CW = 190, [c, g] = mkCanvas(20 + els.length * CW, 470);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  wrText(g, '룬소드 — 칼마다 고유 이름 · 속성이 모양에 들어간다 (색만 바꾸지 않음). 불 · 빙결은 이름 확정, 나머지 넷은 제안', 12, 24, '#f0c45a', '700 15px Galmuri11');
  els.forEach((el, i) => {
    const R = WR_RS[el], x0 = 16 + i * CW, rows = pxRows(R.g);
    wrText(g, R.name, x0, 56, R.pal.T, '700 14px Galmuri11'); wrText(g, `${R.el} 속성 룬소드${i > 1 ? ' (이름 제안)' : ''}`, x0, 74, '#a89c8c', '11px Galmuri11');
    wrBig(g, rows, Object.assign({ v: R.pal.y }, R.pal), x0 + 4, 88, 12);
    const a = wrRsAdv(i % 2 ? 'arcblade' : 'spellblade', el, 4);
    wrPut(g, wrRsFront(a, 0), x0 + 120, 300, 3);
    wrPut(g, wrRsSide(a, 'idle', 0), x0 + 50, 450, 3);
    wrPut(g, wrRsSide(a, 'm:rslash', 1), x0 + 100, 450, 3);
    wrPut(g, wrRsSide(a, 'm:rslash', 5), x0 + 150, 450, 3);
  });
  wrText(g, '옆모습: 서 있기 · 룬에 빛 모으기 · 베기', 16, 466, '#8a8478', '11px Galmuri11');
  return c.toDataURL();
}
window.WAR_SHEET = () => { S = blankState('시안'); wrApply(); wrApply2(); wrApply3(); return [wrSheetE()]; };
