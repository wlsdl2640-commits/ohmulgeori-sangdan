window.WAR_SHEET = () => {
  S = blankState('x'); wrApply();
  const [c, g] = mkCanvas(6 * 200, 220); g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  Object.keys(WR_RUNE).forEach((el, i) => { const a = wrShape(wrAdv('arcblade', 'rune', 'ether', 6, el)); wrPut(g, pxsAdvSprite(a, 'm:down', 4), i * 200 + 90, 200, 6); });
  return [c.toDataURL()];
};
