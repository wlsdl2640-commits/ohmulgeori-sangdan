/* 동작 장 판: 동작마다 8장(그림 + 효과 칸)을 4배로 나란히 — 그림 손질용 */
Object.assign(CLASSES, { conestoga: Object.assign({}, CLASSES.coachman, { name: '코네스토가', tier: 3, from: 'coachman' }) });
JOB_PARENT.conestoga = 'coachman';
PXL.conestoga = CG[1][2];          // 코네스토가 = B 푸른 짐칸 (00:49)
PXL.caravanmaster = CG[0][2];      // 캐러밴마스터 = A 개척민
const M62 = {
  mkAdv(cls, wpn, id) {
    const a = makeAdv({ cls, lv: 60 }); a.id = id || 901; a.look = { hair: '#5a3a22', skin: '#e0ac7e' };
    a.eq.weapon = { base: wpn, t: 3, q: 0, plus: 0, uid: 7000 + (id || 0) }; a.eq.off = null; a.eq.ammo = null;
    return a;
  }
};
window.MOT_SHEET = (rows, Z) => {
  S = S || blankState('시안'); PXC.clear();
  Z = Z || 4;
  const CW = 62 * Z, CH = 54 * Z, LW = 150;
  const [c, g] = mkCanvas(LW + 9 * CW + 20, 40 + rows.length * (CH + 26));
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('채찍 · 정글칼 공격 동작 — 장마다 (서 있기 + 8장, 효과 칸은 흰 · 노랑 · 흐림)', 10, 22);
  rows.forEach(([ttl, cls, wpn, mk], j) => {
    const a = M62.mkAdv(cls, wpn, 900 + j), y0 = 40 + j * (CH + 26);
    g.fillStyle = '#e8e0d0'; g.font = '700 12px Galmuri11'; g.fillText(ttl, 10, y0 + 16);
    g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(mk, 10, y0 + 32);
    const frames = [['idle', 0]].concat([0, 1, 2, 3, 4, 5, 6, 7].map(f => ['m:' + mk, f]));
    frames.forEach(([pose, f], i) => {
      const s = pxsAdvSprite(a, pose, f), x = LW + i * CW + 21 * Z, yy = y0 + 50 * Z;
      g.save(); g.fillStyle = i === 5 ? '#2a2630' : '#22202a'; g.fillRect(LW + i * CW + 2, y0 + 2, CW - 4, CH + 18); g.beginPath(); g.rect(LW + i * CW + 2, y0 + 2, CW - 4, CH + 18); g.clip();
      g.fillStyle = '#3a3a2a'; g.fillRect(LW + i * CW + 2, yy, CW - 4, 1);
      const F = pose === 'idle' ? null : pxsMotFr(mk, f), dx = F ? F.dx * 2 * Z : 0;
      g.drawImage(s.cv, Math.round(x + dx - s.ax * Z), Math.round(yy - s.ay * Z), s.cv.width * Z, s.cv.height * Z);
      if (s.mfx) { const pal = MOT_PAL[0]; for (const L of [s.mfx.back, s.mfx.front]) for (const [X, Y, ci] of L) { g.fillStyle = pal[ci]; g.fillRect(Math.round(x + (2 * X - 19) * Z), Math.round(yy + (2 * Y - 47) * Z), 2 * Z, 2 * Z); } }
      g.restore(); g.fillStyle = '#8a8070'; g.font = '10px Galmuri11'; g.fillText(pose === 'idle' ? '서 있기' : (f + 1) + (f === pxsMotHit(mk) ? ' 맞힘' : ''), LW + i * CW + 6, y0 + CH + 14);
    });
  });
  return c.toDataURL();
};
