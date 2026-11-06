// 동작 판: 한 줄 = 동작 하나 (서 있기 + 8장), 효과 칸 포함
window.MS42 = (r, MK, Z) => { if (!S) S = blankState();
  const a = makeAdv({ cls: r.cls, lv: 60 }); a.id = r.id || 3; a.look = { hair: '#5a3a22', skin: '#e0ac7e' };
  if (r.wpn) a.eq.weapon = makeGear(r.wpn, r.t || 2, 0);
  a.eq.off = r.off ? makeGear(r.off[0], r.off[1], 0) : (r.keepOff ? a.eq.off : null);
  const W = 34, H = 30, c = document.createElement('canvas'); c.width = 9 * W * Z; c.height = MK.length * H * Z; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#3a3430'; g.fillRect(0, 0, c.width, c.height); const info = { fam: pxsFam(a), wk: pxsWk(a), fx: 0, err: [] };
  const PAL = ['#ffffff', '#fff2a0', '#a8a090'];
  MK.forEach((mk, j) => {
    for (let f = -1; f < 8; f++) {
      let s, F = null; try { s = f < 0 ? pxsAdvSprite(a, 'idle', 0) : pxsAdvSprite(a, 'm:' + mk, f); F = f < 0 ? null : pxsMotFr(mk, f); } catch (e) { info.err.push(mk + f + ' ' + e.message + ' ' + (e.stack || '').split('\n')[1]); continue; }
      const ox = (f + 1) * W + 8, oy = j * H + 27, dx = F ? F.dx : 0;
      if (s.mfx) { info.fx++; for (const [X, Y, ci] of s.mfx.back) { g.fillStyle = PAL[ci]; g.fillRect((ox + X - 9.5 + 0.5) * Z, (oy + Y - 23.5 + 0.5) * Z, Z, Z); } }
      g.drawImage(s.cv, 0, 0, s.w, s.h, (ox + dx) * Z - s.ax * Z / 2, oy * Z - s.ay * Z / 2, s.w * Z / 2, s.h * Z / 2);
      if (s.mfx) for (const [X, Y, ci] of s.mfx.front) { g.fillStyle = PAL[ci]; g.fillRect((ox + X - 9.5 + 0.5) * Z, (oy + Y - 23.5 + 0.5) * Z, Z, Z); }
    }
  });
  return [c.toDataURL(), info];
};
