// 지금(빌드 62) 도적 계열 모습: 앞 · 옆 · 찌르기
window.WAR_SHEET = () => {
  S = blankState('시안');
  const CL = ['rogue', 'assassin', 'shadowlord', 'duelist', 'bladedancer', 'treasure', 'masterthief'];
  const Z = 4, CW = 34 * Z, RH = 40 * Z, cols = ['앞', '옆', '찌르기 4', '뒤(앞 격자에서)'];
  const [c, g] = mkCanvas(110 + cols.length * CW, 40 + CL.length * RH);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('지금 도적 계열 (빌드 62)', 10, 22);
  g.font = '12px Galmuri11'; cols.forEach((n, i) => { g.fillStyle = '#c8c0b0'; g.fillText(n, 110 + i * CW + 10, 36); });
  CL.forEach((cls, r) => {
    const a = makeAdv({ cls, lv: 60 }); a.eq.weapon = makeGear(WEAPON_OF[cls], 2, 0);
    const y0 = 40 + r * RH;
    g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(CLASSES[cls].name, 10, y0 + 24);
    const put = (s, i) => { const x = 110 + i * CW + CW / 2, y = y0 + RH - 12; g.drawImage(s.cv, Math.round(x - s.ax * Z), Math.round(y - s.ay * Z), s.cv.width * Z, s.cv.height * Z); };
    put(pxAdvSprite(a, 'idle', 0), 0); put(pxsAdvSprite(a, 'idle', 0), 1);
    put(pxsAdvSprite(a, 'm:thrust', 4), 2);
    if (typeof qBackSpr === 'function') { try { put(qBackSpr(a), 3); } catch (e) {} }
  });
  return c.toDataURL();
};
