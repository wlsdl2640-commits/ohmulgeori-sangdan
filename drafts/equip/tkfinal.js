// 트래커 · 스토커 확정 · 보관 판 (11-10 23:40 사용자) → T_chars_final.png
window.WAR_SHEET = () => {
  S = blankState('시안');
  const Z = 4, CW = 34 * Z, RH = 42 * Z, LW = 250, cols = ['앞', '옆', '뒤', '활 당기기', '게임 속 크기'];
  const rows = [['트래커 (2차) — 확정', TK.tr[0]], ['스토커 (3차) — 확정', TK.st[0]], ['보관 — 나중에 (4차 프레데터 등)', TK.st[1]]];
  const [c, g] = mkCanvas(LW + 4 * CW + 140, 74 + rows.length * (RH + 30));
  g.fillStyle = '#1a1820'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
  g.font = '700 16px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText('트래커 · 스토커 — 고른 그림 · 보관 (11-10 23:40)', 10, 24);
  g.font = '12px Galmuri11'; g.fillStyle = '#a89c8c';
  g.fillText('트래커 = A 늑대 가죽 두건 · 스토커 = A 유리눈 가면 · 검은 늑대 망토는 보관. 줄: 트래커 → 스토커 → 프레데터(4차) → 아나이얼레이터(5차, 생각 중).', 10, 44);
  g.fillText('손 그림 활은 시안판용(컴파운드 보우 칸) — 게임에 넣을 때 동작 그림과 함께 다시.', 10, 60);
  let y = 74;
  rows.forEach(([head, [nm, desc, L]]) => tkWith2(() => {
    g.font = '700 14px Galmuri11'; g.fillStyle = '#f0c45a'; g.fillText(head, 10, y + 18);
    cols.forEach((n, i) => { g.font = '11px Galmuri11'; g.fillStyle = '#8a8070'; g.fillText(n, LW + i * CW + (i === 4 ? 14 : CW / 2 - g.measureText(n).width / 2), y + 18); });
    y += 26;
    PXC.clear();
    const a = makeAdv({ cls: 'archer', lv: 60 }); a.id = 1; a.eq.weapon = makeGear('bow', 5, 0); a.eq.off = null;
    g.fillStyle = '#e8e0d0'; g.font = '700 13px Galmuri11'; g.fillText(nm, 10, y + 30);
    g.font = '11px Galmuri11'; g.fillStyle = '#a89c8c';
    let ty = y + 50, line = '';
    for (const w of desc.split(' ')) { if (g.measureText(line + w).width > LW - 24) { g.fillText(line, 10, ty); ty += 15; line = ''; } line += w + ' '; }
    g.fillText(line, 10, ty);
    const put = (s, i, z, dx, dy) => { const x = LW + i * CW + CW / 2 + (dx || 0), yy = y + RH - 16 + (dy || 0); g.drawImage(s.cv, Math.round(x - s.ax * z), Math.round(yy - s.ay * z), s.cv.width * z, s.cv.height * z); };
    const side = pxsAdvSprite(a, 'idle', 0, L);
    put(pxAdvSprite(a, 'idle', 0, L), 0, Z); put(side, 1, Z); put(tkBack(a, L), 2, Z); put(tkDraw(a, L), 3, Z);
    g.fillStyle = '#0e1118'; g.fillRect(LW + 4 * CW, y + 10, 110, RH - 30);
    put(side, 4, 2, -50, -10); put(side, 4, 1, 0, -10);
    y += RH + 4;
  }));
  return c.toDataURL();
};
