// 가까이: 시안마다 앞 · 옆 · 뒤 (Z 8)
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 7, CW = 30 * Z, RH = 38 * Z;
  const all = []; ['pp', 'nj', 'kg'].forEach(k => RG[k].forEach(r => all.push([k, r])));
  const pick = (window.RGZ_PICK || all.map((_, i) => i));
  const [c, g] = mkCanvas(3 * CW + 120, 20 + pick.length * RH);
  g.fillStyle = '#26232c'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  pick.forEach((i, r) => {
    const [k, [nm, , L]] = all[i];
    PXC.clear();
    const a = makeAdv({ cls: 'rogue', lv: 60 }); a.id = 1;
    a.eq.weapon = makeGear(k === 'pp' ? 'cards' : 'dagger', 5, 0); a.eq.off = null;
    const y0 = 20 + r * RH;
    g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(nm, 8, y0 + 20);
    const put = (s, j) => { const x = 120 + j * CW + CW / 2, yy = y0 + RH - 14; g.drawImage(s.cv, Math.round(x - s.ax * Z / 1), Math.round(yy - s.ay * Z), s.cv.width * Z, s.cv.height * Z); };
    put(pxAdvSprite(a, 'idle', 0, L), 0); put(pxsAdvSprite(a, 'idle', 0, L), 1); put(rgBack(a, L), 2);
  });
  return c.toDataURL();
};
