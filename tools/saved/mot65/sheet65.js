/* 시안 판: 동작마다 (앞 서 있기 · 옆 서 있기 + 8장) — 효과 칸은 흰 · 노랑 · 흐림. GIF용 장 (M65_GIF) */
const M65S = {
  mk(cls, wpn, id) {
    const a = makeAdv({ cls, lv: 120 }); a.id = id; a.look = { hair: '#5a3a22', skin: '#e0ac7e' };
    a.eq.weapon = { base: wpn, t: 8, q: 0, uid: 7000 + id }; a.eq.off = null; a.eq.ammo = null; a.eq.bolt = null; a.eq.bcase = null;
    return a;
  },
  cell(g, a, pose, f, mk, x, yy, Z) {   // 그림 하나 (+ 효과 칸)
    const s = pose === 'front' ? pxAdvSprite(a, 'idle', 0) : pxsAdvSprite(a, pose, f);
    const F = pose.startsWith('m:') ? pxsMotFr(mk, f) : null, dx = F ? F.dx * 2 * Z : 0;
    g.drawImage(s.cv, Math.round(x + dx - s.ax * Z), Math.round(yy - s.ay * Z), s.cv.width * Z, s.cv.height * Z);
    if (s.mfx) { const pal = MOT_PAL[0]; for (const L of [s.mfx.back, s.mfx.front]) for (const [X, Y, ci] of L) { g.fillStyle = pal[ci]; g.fillRect(Math.round(x + (2 * X - 19) * Z), Math.round(yy + (2 * Y - 47) * Z), 2 * Z, 2 * Z); } }
  }
};
window.M65_SHEET = (title, rows, Z) => {
  PXC.clear(); Z = Z || 3;
  const CW = 62 * Z, CH = 54 * Z, LW = 150, NC = 10;
  const [c, g] = mkCanvas(LW + NC * CW + 20, 44 + rows.length * (CH + 26));
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 15px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText(title, 10, 24);
  rows.forEach(([ttl, cls, wpn, mk], j) => {
    const a = M65S.mk(cls, wpn, 900 + j), y0 = 44 + j * (CH + 26);
    g.fillStyle = '#e8e0d0'; g.font = '700 12px Galmuri11'; g.fillText(ttl, 10, y0 + 16);
    g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(CLASSES[cls].name + ' · ' + mk, 10, y0 + 32);
    const cols = [['front', 0, '앞 서 있기'], ['idle', 0, '옆 서 있기']].concat([0, 1, 2, 3, 4, 5, 6, 7].map(f => ['m:' + mk, f, (f + 1) + (f === pxsMotHit(mk) ? ' 맞힘' : '')]));
    cols.forEach(([pose, f, lab], i) => {
      const X0 = LW + i * CW, x = X0 + 21 * Z, yy = y0 + 50 * Z;
      g.save(); g.fillStyle = pose.startsWith('m:') && f === pxsMotHit(mk) ? '#2e2a36' : '#22202a'; g.fillRect(X0 + 2, y0 + 2, CW - 4, CH + 18); g.beginPath(); g.rect(X0 + 2, y0 + 2, CW - 4, CH + 18); g.clip();
      g.fillStyle = '#3a3a2a'; g.fillRect(X0 + 2, yy, CW - 4, 1);
      try { M65S.cell(g, a, pose, f, mk, pose === 'front' ? X0 + 14 * Z : x, yy, Z); } catch (err) { g.fillStyle = '#f66'; g.font = '10px sans-serif'; g.fillText(String(err.message).slice(0, 30), X0 + 4, y0 + 40); }
      g.restore(); g.fillStyle = '#8a8070'; g.font = '10px Galmuri11'; g.fillText(lab, X0 + 6, y0 + CH + 14);
    });
  });
  return c.toDataURL();
};
// GIF 장: 여러 직업이 나란히 같은 차례로 동작 (서 있기 0.5초 → 동작 → …)
window.M65_GIF = (lines, Z) => {
  PXC.clear(); Z = Z || 3;
  const CW = 58 * Z, CH = 50 * Z, n = lines.length, out = [], advs = lines.map(([cls, wpn], i) => M65S.mk(cls, wpn, 950 + i));
  const L = Math.max(...lines.map(l => l[2].length));
  const frame = (picks, ms) => {
    const [c, g] = mkCanvas(n * CW, CH + 22); g.fillStyle = '#1e1c26'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
    picks.forEach(([pose, f, mk], i) => {
      const X0 = i * CW, yy = 44 * Z; g.fillStyle = '#34302a'; g.fillRect(X0, yy, CW, 1);
      M65S.cell(g, advs[i], pose, f, mk, X0 + 24 * Z, yy, Z);
      g.fillStyle = '#c8bca8'; g.font = '11px Galmuri11'; g.fillText(lines[i][3] || '', X0 + 4, CH + 16);
    });
    out.push({ u: c.toDataURL(), d: ms });
  };
  for (let k = 0; k < L; k++) {
    frame(lines.map(() => ['idle', 0, null]), 260); frame(lines.map(() => ['idle', 1, null]), 260);
    for (let f = 0; f < 8; f++) {
      const mks = lines.map(l => l[2][k % l[2].length]);
      const ms = Math.max(...mks.map(mk => ((PXS_MOT_TT[mk] || PXS_MOT_T)[f] || 0.06))) * 1000 * 1.6;   // 1.6배 느리게 (보기 좋게)
      frame(mks.map(mk => ['m:' + mk, f, mk]), Math.round(ms));
    }
  }
  return out;
};
