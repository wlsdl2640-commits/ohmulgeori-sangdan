window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 6, CW = 34 * Z, RH = 40 * Z;
  const all = []; ['tr', 'st'].forEach(k => TK[k].forEach(r => all.push(r)));
  const pick = (window.TKZ || [0, 1, 2, 3, 4, 5]);
  const [c, g] = mkCanvas(4 * CW + 10, pick.length * RH + 10);
  g.fillStyle = '#26232c'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  pick.forEach((i, r) => tkWith2(() => {
    const [nm, , L] = all[i];
    PXC.clear();
    const a = makeAdv({ cls: 'archer', lv: 60 }); a.id = 1; a.eq.weapon = makeGear('bow', 5, 0); a.eq.off = null;
    const y0 = r * RH;
    g.fillStyle = '#e8e0d0'; g.font = '700 14px Galmuri11'; g.fillText(nm, 8, y0 + 18);
    const put = (s, j) => { const x = j * CW + CW / 2, yy = y0 + RH - 12; g.drawImage(s.cv, Math.round(x - s.ax * Z), Math.round(yy - s.ay * Z), s.cv.width * Z, s.cv.height * Z); };
    put(pxAdvSprite(a, 'idle', 0, L), 0); put(pxsAdvSprite(a, 'idle', 0, L), 1); put(tkBack(a, L), 2); put(tkDraw(a, L), 3);
  }));
  return c.toDataURL();
};
