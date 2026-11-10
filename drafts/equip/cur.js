// 지금(빌드 62) 전사 계열 모습: 앞 · 옆 · 내려베기 · 방패 밀기
window.WAR_SHEET = () => {
  S = blankState('시안');
  const CL = ['warrior', 'gladiator', 'champion', 'knight', 'paladin', 'berserker', 'bloodlord', 'spellblade', 'arcblade'];
  const Z = 4, CW = 34 * Z, RH = 40 * Z, cols = ['앞', '옆', '내려베기 3', '내려베기 5', '방패 밀기 4'];
  const [c, g] = mkCanvas(110 + cols.length * CW, 40 + CL.length * RH);
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('지금 전사 계열 (빌드 62)', 10, 22);
  g.font = '12px Galmuri11'; cols.forEach((n, i) => { g.fillStyle = '#c8c0b0'; g.fillText(n, 110 + i * CW + 10, 36); });
  CL.forEach((cls, r) => {
    const a = makeAdv({ cls, lv: 60 }); a.eq.weapon = makeGear(WEAPON_OF[cls], 2, 0);
    if (gearFits(a, { base: 'shield', t: 0 })) a.eq.off = makeGear(shieldOf(cls), 2, 0); else a.eq.off = null;
    const y0 = 40 + r * RH;
    g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(CLASSES[cls].name, 10, y0 + 24);
    g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c'; g.fillText((GTYPES[a.eq.weapon.base] || {}).name || a.eq.weapon.base, 10, y0 + 42); g.fillText(a.eq.off ? (GTYPES[a.eq.off.base] || {}).name || a.eq.off.base : '방패 없음', 10, y0 + 58);
    const put = (s, i) => { const x = 110 + i * CW + CW / 2, y = y0 + RH - 12; g.drawImage(s.cv, Math.round(x - s.ax * Z), Math.round(y - s.ay * Z), s.cv.width * Z, s.cv.height * Z); };
    put(pxAdvSprite(a, 'idle', 0), 0); put(pxsAdvSprite(a, 'idle', 0), 1);
    put(pxsAdvSprite(a, 'm:down', 2), 2); put(pxsAdvSprite(a, 'm:down', 4), 3);
    if (a.eq.off) put(pxsAdvSprite(a, 'm:bash', 3), 4);
  });
  return c.toDataURL();
};
