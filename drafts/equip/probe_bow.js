window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 5, CW = 34 * Z, RH = 42 * Z;
  const cls = ['sniper', 'mhunter'];
  const [c, g] = mkCanvas(6 * CW, cls.length * RH + 10);
  g.fillStyle = '#26232c'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  cls.forEach((k, r) => {
    PXC.clear();
    const a = makeAdv({ cls: k, lv: 60 }); a.id = 1; a.eq.weapon = makeGear('bow', 5, 0); a.eq.off = null;
    const y0 = r * RH;
    const put = (s, j) => { const x = j * CW + CW / 2, yy = y0 + RH - 14; g.drawImage(s.cv, Math.round(x - s.ax * Z), Math.round(yy - s.ay * Z), s.cv.width * Z, s.cv.height * Z); };
    put(pxAdvSprite(a, 'idle', 0), 0); put(pxsAdvSprite(a, 'idle', 0), 1); put(pxsAdvSprite(a, 'atk', 0), 2);
    put(pxsAdvSprite(a, 'm:bshot', 2), 3); put(pxsAdvSprite(a, 'm:bshot', 4), 4); put(pxAdvSprite(a, 'atk', 0), 5);
  });
  return c.toDataURL();
};
