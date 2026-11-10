window.WAR_SHEET = () => {
  S = blankState('시안');
  let out = '';
  tkWith2(() => {
    const L = TK.tr[0][2];
    const a = makeAdv({ cls: 'archer', lv: 60 }); a.id = 1; a.eq.weapon = makeGear('bow', 5, 0); a.eq.off = null;
    out += 'wk=' + pxWeapon(a.cls, a.eq.weapon.base) + '\n';
    const g = pxAdvGrid(a, 'idle', 0, L);
    out += g.slice(14, 48).map((r, i) => String(14 + i).padStart(2) + ' ' + r.slice(0, 34).join('')).join('\n');
    const s = pxsAdvGrid(a, 'idle', 0, L);
    out += '\n\n' + s.slice(14, 48).map((r, i) => String(14 + i).padStart(2) + ' ' + r.slice(0, 36).join('')).join('\n');
  });
  return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(out)));
};
