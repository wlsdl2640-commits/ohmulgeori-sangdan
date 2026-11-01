/* ───────── 몬스터 그리는 방식 ───────── */
// 모두 오른쪽을 보고 그린다. 발 디딤점이 (0,0), 위쪽이 음수.
const PLANS = {
  quad(ctx, m, fr) {
    const L = m.len, H = m.h, lg = m.low ? 1 : 2, b = m.body, d = m.dark;
    const x0 = -Math.floor(L / 2), top = -H - lg;
    R(ctx, x0, top, L, H, b); R(ctx, x0, top + H - 1, L, 1, d);
    const hs = Math.max(3, Math.round(H * 0.85)), hx = x0 + L - 1;
    R(ctx, hx, top - 1, hs, hs, b);
    if (m.snout) R(ctx, hx + hs, top + 1, 2, 2, b);
    R(ctx, hx + hs - 2, top, 1, 1, '#141414');
    if (m.ear) R(ctx, hx, top - 2, 1, 1, d);
    if (m.ears) { R(ctx, hx, top - 5, 1, 4, b); R(ctx, hx + 2, top - 4, 1, 3, b); }
    if (m.horn) { R(ctx, hx + hs - 1, top - 2, 1, 1, m.horn); R(ctx, hx + hs, top - 3, 1, 1, m.horn); }
    if (m.tail) R(ctx, x0 - 3, top + 1, 3, 1, d);
    if (m.crown) { const c = '#f0c24a'; R(ctx, hx, top - 3, 4, 2, c); R(ctx, hx, top - 4, 1, 1, c); R(ctx, hx + 3, top - 4, 1, 1, c); R(ctx, hx + 1, top - 2, 1, 1, '#c0392b'); }
    const legs = [x0 + 1, x0 + 3, x0 + L - 4, x0 + L - 2];
    legs.forEach((lx, i) => R(ctx, lx, -lg, 1, lg - ((i + fr) % 2 ? 1 : 0), d));
  },
  blob(ctx, m, fr) {
    const w = m.w + (fr ? 1 : 0), h = m.h - (fr ? 1 : 0), x0 = -Math.floor(w / 2);
    if (m.nose) {
      // 눈사람: 몸통 두 덩이, 숯 눈, 당근 코, 나뭇가지 팔
      R(ctx, x0 + 1, -6, w - 2, 6, m.body); R(ctx, x0, -5, w, 4, m.body); R(ctx, x0 + 1, -1, w - 2, 1, m.dark);
      R(ctx, x0 + 2, -11, w - 4, 5, m.body); R(ctx, x0 + 3, -12, w - 6, 1, m.body);
      R(ctx, x0 + w - 4, -10, 1, 1, '#1a1410'); R(ctx, x0 + w - 6, -10, 1, 1, '#1a1410');
      R(ctx, x0 + w - 3, -9, 3, 1, '#f08a3c');
      R(ctx, x0 - 2, -6 - fr, 3, 1, '#6b4a2e'); R(ctx, x0 + w - 1, -6 + fr, 3, 1, '#6b4a2e');
      R(ctx, x0 + 3, -4, 1, 1, '#1a1410'); R(ctx, x0 + 3, -2, 1, 1, '#1a1410');
      return;
    }
    R(ctx, x0 + 2, -h, w - 4, 1, m.body); R(ctx, x0 + 1, -h + 1, w - 2, 1, m.body); R(ctx, x0, -h + 2, w, h - 2, m.body);
    R(ctx, x0, -1, w, 1, m.dark); R(ctx, x0 + 2, -h + 2, 2, 1, '#d8ffd0');
    R(ctx, x0 + w - 3, -h + 3, 1, 2, '#123012'); R(ctx, x0 + w - 5, -h + 3, 1, 2, '#123012');
  },
  shroom(ctx, m, fr) {
    R(ctx, -2, -7, 5, 6, m.stem); R(ctx, -2 + fr, -1, 2, 1, m.dark); R(ctx, 1 - fr, -1, 2, 1, m.dark);
    R(ctx, -5, -11, 11, 4, m.body); R(ctx, -4, -12, 9, 1, m.body); R(ctx, -5, -8, 11, 1, m.dark);
    R(ctx, -3, -11, 1, 1, '#f3e6ff'); R(ctx, 1, -10, 2, 1, '#f3e6ff'); R(ctx, 3, -12, 1, 1, '#f3e6ff');
    R(ctx, 1, -5, 1, 1, '#141414'); R(ctx, -1, -5, 1, 1, '#141414');
  },
  bug(ctx, m, fr) {
    for (let i = 0; i < 4; i++) { const lx = -4 + i * 2; R(ctx, lx, -3, 1, 2, m.dark); R(ctx, lx + ((i + fr) % 2 ? -1 : 1), -1, 1, 1, m.dark); }
    R(ctx, -5, -7, 8, 4, m.body); R(ctx, -4, -8, 6, 1, m.body); R(ctx, 3, -6, 3, 3, m.dark);
    R(ctx, 5, -6, 1, 1, m.eye); R(ctx, 4, -5, 1, 1, m.eye); R(ctx, -3, -7, 2, 1, shade(m.body, 0.2));
    if (m.tail) { // 전갈 꼬리
      R(ctx, -7, -8, 2, 2, m.body); R(ctx, -8, -11, 2, 3, m.body); R(ctx, -7, -13, 2, 2, m.body); R(ctx, -5, -14 + fr, 2, 2, m.body); R(ctx, -3, -13 + fr, 1, 2, '#f0e0b0');
      R(ctx, 6, -8, 2, 2, m.dark); R(ctx, 8, -9, 1, 2, m.dark); R(ctx, 6, -4, 2, 1, m.dark);
    }
    if (m.jaws) { R(ctx, 6, -7 + fr, 3, 1, m.dark); R(ctx, 6, -4 - fr, 3, 1, m.dark); R(ctx, 8, -6, 1, 2, m.dark); }
  },
  tree(ctx, m, fr) {
    R(ctx, -2, -10, 5, 10, m.body); R(ctx, -4, -1, 2, 1, m.body); R(ctx, 3, -1, 2, 1, m.body);
    R(ctx, 3, -9 + fr, 3, 1, m.body); R(ctx, 5, -10 + fr, 1, 1, m.body);
    R(ctx, -5, -17, 11, 7, m.leaf); R(ctx, -4, -18, 9, 1, m.leaf); R(ctx, -6, -15, 1, 4, m.leaf); R(ctx, 6, -15, 1, 4, m.leaf);
    R(ctx, -3, -16, 3, 1, shade(m.leaf, 0.25)); R(ctx, 1, -11, 4, 1, shade(m.leaf, -0.3));
    R(ctx, 0, -8, 1, 1, '#f0e070'); R(ctx, 2, -8, 1, 1, '#f0e070'); R(ctx, 0, -5, 3, 1, shade(m.body, -0.4));
  },
  biped(ctx, m, fr) {
    const s = m.skin, c = m.cloth;
    if (fr) { R(ctx, -1, -3, 1, 3, c); R(ctx, 1, -4, 1, 3, c); } else { R(ctx, -2, -3, 1, 3, c); R(ctx, 1, -3, 1, 3, c); }
    R(ctx, -2, -7, 5, 4, c); R(ctx, -2, -11, 5, 4, s);
    R(ctx, -3, -11, 1, 1, s); R(ctx, 3, -12, 1, 2, s); R(ctx, 1, -10, 1, 1, m.hood ? '#e04a4a' : '#f7e04a');
    R(ctx, 3, -7, 1, 2, s);
    if (m.hood) { R(ctx, -3, -12, 6, 2, c); R(ctx, -3, -10, 1, 3, c); R(ctx, -1, -9, 4, 1, shade(c, 0.15)); }
    if (m.wrap) { R(ctx, -2, -12, 5, 1, c); R(ctx, -1, -9, 4, 1, c); }
    if (m.gear === 'dagger') R(ctx, 4, -6, 2, 1, '#c9c3b8');
    if (m.gear === 'staff') { R(ctx, 4, -13, 1, 12, '#7a5634'); R(ctx, 3, -15, 3, 2, '#e8e2d0'); R(ctx, 4, -14, 1, 1, '#141414'); }
    if (m.gear === 'pick') { R(ctx, 4, -9, 1, 7, '#7a5634'); R(ctx, 2, -10, 5, 1, '#c9c3b8'); R(ctx, -2, -12, 5, 1, '#e8b84a'); }
    if (m.gear === 'flask') { R(ctx, 4, -8, 2, 3, '#7ad83c'); R(ctx, 4, -9, 2, 1, '#e8e2d0'); }
    if (m.gear === 'club') { R(ctx, 4, -11, 2, 7, '#6b4a2e'); R(ctx, 3, -12, 4, 2, '#5a3a22'); }
    if (m.feather) { R(ctx, -1, -13, 1, 2, '#e05a4a'); R(ctx, 0, -14, 1, 2, '#f0c24a'); }
  },
  flyer(ctx, m, fr, t) {
    const y = -12 + Math.round(Math.sin(t * 5) * 2);
    if (m.big) {
      // 그리폰·와이번: 큰 몸통, 부리, 다리, 큰 날개
      R(ctx, -6, y - 2, 11, 5, m.body); R(ctx, -8, y, 3, 2, m.body); R(ctx, -10, y + 1, 3, 1, m.dark);
      R(ctx, 5, y - 4, 4, 4, m.body); R(ctx, 9, y - 2, 2, 2, m.beak || '#e8e2d0'); R(ctx, 7, y - 3, 1, 1, '#141414');
      R(ctx, -2, y + 3, 1, 3, m.dark); R(ctx, 2, y + 3, 1, 3, m.dark);
      if (fr) { R(ctx, -2, y - 4, 6, 2, m.dark); R(ctx, -4, y - 6, 8, 2, m.dark); R(ctx, -6, y - 8, 9, 2, m.dark); R(ctx, -8, y - 10, 8, 2, m.dark); R(ctx, -9, y - 11, 4, 1, shade(m.dark, 0.25)); R(ctx, -5, y - 7, 6, 1, shade(m.dark, 0.18)); }
      else { R(ctx, -3, y + 1, 8, 2, m.dark); R(ctx, -5, y + 3, 7, 2, m.dark); R(ctx, -6, y + 5, 4, 1, shade(m.dark, 0.2)); }
      return;
    }
    R(ctx, -2, y, 5, 3, m.body); R(ctx, -2, y - 1, 1, 1, m.body); R(ctx, 2, y - 1, 1, 1, m.body);
    if (m.face) { R(ctx, 1, y - 2, 3, 3, m.face); R(ctx, 3, y - 1, 1, 1, '#141414'); R(ctx, 0, y - 3, 3, 1, '#7a5634'); }
    else R(ctx, 2, y + 1, 1, 1, '#ff4a4a');
    if (fr) { R(ctx, -7, y - 2, 5, 2, m.dark); R(ctx, 3, y - 2, 5, 2, m.dark); }
    else { R(ctx, -7, y + 2, 5, 2, m.dark); R(ctx, 3, y + 2, 5, 2, m.dark); }
  },
  golem(ctx, m, fr) {
    if (m.small) {
      const y = -3 + (fr ? -1 : 0);
      R(ctx, -3, y - 8, 7, 7, m.body); R(ctx, -2, y - 10, 5, 2, m.body); R(ctx, -1, y - 12, 3, 2, shade(m.body, 0.3));
      R(ctx, 1, y - 7, 1, 1, m.core); R(ctx, -1, y - 7, 1, 1, m.core); R(ctx, -5, y - 6, 2, 3, m.dark); R(ctx, 4, y - 6, 2, 3, m.dark);
      R(ctx, -2, y - 1, 5, 1, shade(m.dark, -0.2));
      return;
    }
    R(ctx, -5, -5, 3, 5 - fr, m.dark); R(ctx, 2, -5, 3, 5 - (1 - fr), m.dark);
    R(ctx, -6, -14, 12, 9, m.body); R(ctx, -3, -18, 6, 4, m.body);
    R(ctx, 1, -16, 2, 1, m.core); R(ctx, -1, -11, 2, 2, m.core);
    R(ctx, -8, -13, 2, 8, m.dark); R(ctx, 6, -13 + fr, 2, 8, m.dark);
    R(ctx, -4, -12, 1, 3, m.dark); R(ctx, 3, -9, 2, 1, m.dark); R(ctx, -5, -14, 10, 1, shade(m.body, 0.18));
  },
  worm(ctx, m, fr, t) {
    // 모래에서 솟은 마디 몸통과 이빨 달린 입
    const sway = Math.round(Math.sin(t * 3) * 1.5);
    R(ctx, -7, -2, 14, 2, '#c8a870'); R(ctx, -5, -3, 10, 1, '#c8a870');
    const segs = [[-2, -6], [-1, -10], [0 + sway, -14], [1 + sway, -18]];
    segs.forEach(([x, y], i) => { R(ctx, x - 3, y, 7, 4, i % 2 ? m.body : shade(m.body, -0.1)); R(ctx, x - 3, y + 3, 7, 1, m.dark); });
    const hx = 2 + sway, hy = -22;
    R(ctx, hx - 3, hy, 8, 5, m.body); R(ctx, hx + 3, hy + 1, 3, 3, '#3a1a14');
    R(ctx, hx + 4, hy + 1, 1, 1, '#f0e8d8'); R(ctx, hx + 4, hy + 3, 1, 1, '#f0e8d8'); R(ctx, hx + 5, hy + 2 - fr, 1, 1, '#f0e8d8');
    R(ctx, hx - 2, hy - 1, 6, 1, m.dark);
  },
  ghost(ctx, m, fr, t) {
    const y = -2 + Math.round(Math.sin(t * 2.5) * 1.5);
    R(ctx, -3, y - 6, 7, 5, m.body); R(ctx, -4, y - 2, 9, 2, m.body);
    R(ctx, -4 + fr, y, 2, 1, m.body); R(ctx, 0, y, 2, 1, m.body); R(ctx, 3 - fr, y, 2, 1, m.body);
    R(ctx, -2, y - 9, 5, 3, m.body); R(ctx, 3, y - 8, 2, 2, m.body);
    R(ctx, -2, y - 13, 5, 4, '#f4f8ff'); R(ctx, 1, y - 11, 1, 1, '#3a5a9a'); R(ctx, 3, y - 11, 1, 1, '#3a5a9a');
    R(ctx, -3, y - 14, 6, 2, m.hair); R(ctx, -4, y - 12, 2, 7, m.hair); R(ctx, -5, y - 7, 1, 3, m.hair);
    R(ctx, -1, y - 5, 3, 1, m.dark);
    if (m.crown) { R(ctx, -2, y - 16, 5, 2, '#bfe8ff'); R(ctx, -2, y - 17, 1, 1, '#bfe8ff'); R(ctx, 2, y - 17, 1, 1, '#bfe8ff'); R(ctx, 0, y - 18, 1, 2, '#ffffff'); }
  }
};
