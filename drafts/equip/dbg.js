window.WAR_SHEET = () => {
  S = blankState('x'); wrApply();
  const a = wrShape(wrAdv('knight', 'sword', 'round', 2));
  const g = wrAdvGrid(a, 'idle', 0);
  const W = pxFlip(pxRows(PX_WPN.sword)), at = pxFind(W, '@');
  return [g.map(r => r.join('')).join('\n') + '\nHAND ' + JSON.stringify(PX_HAND) + ' at ' + JSON.stringify(at)];
};
