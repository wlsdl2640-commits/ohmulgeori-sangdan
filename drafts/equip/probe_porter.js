window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 42 * Z;
  const cls = ['porter', 'coachman', 'caravanmaster', 'scout', 'pathfinder'];
  const [c, g] = mkCanvas(3 * CW + 160, cls.length * RH + 10);
  g.fillStyle = '#26232c'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  cls.forEach((k, r) => {
    PXC.clear();
    const a = makeAdv({ cls: k, lv: 60 }); a.id = 1; a.eq.off = null;
    const y0 = r * RH;
    g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(k, 6, y0 + 20);
    const put = (s, j) => { const x = 160 + j * CW + CW / 2, yy = y0 + RH - 14; g.drawImage(s.cv, Math.round(x - s.ax * Z), Math.round(yy - s.ay * Z), s.cv.width * Z, s.cv.height * Z); };
    put(pxAdvSprite(a, 'idle', 0), 0); put(pxsAdvSprite(a, 'idle', 0), 1); put(pxsAdvSprite(a, 'm:' + (k === 'scout' || k === 'pathfinder' ? 'bshot' : 'smash'), 4), 2);
  });
  return c.toDataURL();
};
