/* ───────── 몬스터 그림 (고해상도) ─────────
   옛 그림과 같은 크기(논리 픽셀)로 오른쪽을 보고 그린다. k = 화면 배율 × 몸집 */
function kit(D, k) {
  const K = v => v * k;
  return {
    k,
    e: (x, y, rx, ry, m, o, rot, dep) => D.add(shEll(K(x), K(y), K(rx), K(ry), rot || 0, dep || 1), m, o),
    c: (x1, y1, x2, y2, r1, r2, m, o) => D.add(shCap(K(x1), K(y1), K(x2), K(y2), K(r1), K(r2 == null ? r1 : r2)), m, o),
    p: (pts, m, o, bev) => D.add(shPoly(pts.map(([x, y]) => [K(x), K(y)]), K(bev || 1)), m, o),
    b: (x, y, w, h, r, m, o) => D.add(shBox(K(x), K(y), K(w), K(h), K(r || 0.5), K(1)), m, o),
    px: (x, y, c, w = 1, h = 1) => D.px(K(x), K(y), c, Math.max(1, Math.round(w * k / 2)), Math.max(1, Math.round(h * k / 2))),
    eye: (x, y, c = '#1a1010', glint = true) => { D.px(K(x), K(y), c, Math.max(1, Math.round(k / 2)), Math.max(2, Math.round(k))); if (glint && k >= 2) D.px(K(x), K(y), '#fff6e0', 1, 1); }
  };
}
const legs4 = (G, xs, top, bot, r, m, fr, step = 1) => xs.forEach((x, i) => { const s = ((i + fr) % 2 ? 1 : -1) * step; G.c(x, top, x + s * 0.6, bot - 0.6, r, r * 0.8, m); G.e(x + s * 0.8, bot - 0.6, r * 1.1, r * 0.7, m); });
// 깃털 날개: 어깨(x,y)에서 a0~a1 방향으로 깃털을 부채처럼 편다
function featherWing(G, x, y, a0, a1, len, n, m, m2) {
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), a = a0 + (a1 - a0) * t, L = len * (0.62 + 0.38 * Math.sin(t * Math.PI * 0.9 + 0.2));
    G.c(x + Math.cos(a) * L * 0.25, y + Math.sin(a) * L * 0.25, x + Math.cos(a) * L, y + Math.sin(a) * L, len * 0.09, len * 0.05, i % 2 ? m : (m2 || m), { tex: TX.stripe(2) });
  }
  G.e(x + Math.cos((a0 + a1) / 2) * len * 0.22, y + Math.sin((a0 + a1) / 2) * len * 0.22, len * 0.26, len * 0.17, m2 || m, { tex: TX.noise(2, 0.2) }, (a0 + a1) / 2);
}
// 막 날개: 뼈대 끝점들 사이에 막을 친다
function batWing(G, x, y, tips, mem, bone) {
  const pts = [[x, y]].concat(tips).concat([[x - 1, y + 2]]);
  G.p(pts, mem, { tex: TX.fold(3, 0) }, 1.2);
  tips.forEach(([tx, ty], i) => G.c(x, y, tx, ty, i ? 0.55 : 0.8, 0.25, bone));
}
const BEAST = {
  // 네발짐승: 쥐·토끼·늑대·도마뱀·들쥐왕
  quad(D, m, fr, q, k) {
    const G = kit(D, k), L = m.len, H = m.h, low = !!m.low, b = mat(m.body, m.low ? 'scale' : 'fur'), d = mat(m.dark, m.low ? 'scale' : 'fur');
    const by = -(low ? 2.4 : 2.2) - H / 2, tex = m.low ? TX.scale() : TX.noise(L, 0.14);
    if (m.tail) { if (low) G.c(-L / 2, by + 0.5, -L / 2 - 6, by + 2 + fr * 0.6, H * 0.32, 0.5, b, { tex }); else if (m.snout) G.p([[-L / 2 + 1, by - 1], [-L / 2 - 5, by - 3 - fr], [-L / 2 - 6, by + 0.5], [-L / 2, by + 1.5]], d, { tex: TX.noise(3, 0.25) }); else G.c(-L / 2, by + 1, -L / 2 - 5, by - 1 - fr, 0.6, 0.35, mat(m.body === '#7a6656' || m.body === '#8a7564' ? '#d49a8f' : m.body, 'skin')); }
    legs4(G, [-L / 2 + 1.6, L / 2 - 2.2], by + H / 2 - 0.5, 0, low ? 0.9 : 1.05, d, fr, low ? 1.4 : 1);
    G.e(-0.5, by, L / 2, H / 2 + 0.4, b, { tex });
    legs4(G, [-L / 2 + 2.8, L / 2 - 1.2], by + H / 2 - 0.3, 0, low ? 0.95 : 1.1, b, fr + 1, low ? 1.4 : 1);
    const hr = Math.max(2, H * 0.48 + 0.6), hx = L / 2 + hr * 0.4, hy = by - H * 0.35 - (low ? -1 : 0.6);
    if (m.ears) { G.e(hx - 1.2, hy - hr - 1.8, 0.8, 2.4, b, {}, -0.2); G.e(hx + 0.6, hy - hr - 1.6, 0.8, 2.2, b, {}, 0.25); }
    if (m.ear) { G.p([[hx - hr * 0.8, hy - hr * 0.4], [hx - hr * 0.1, hy - hr * 0.7], [hx - hr * 0.7, hy - hr - 1.6]], d); }
    G.e(hx, hy, hr, hr * 0.92, b, { tex });
    if (m.snout) G.e(hx + hr * 0.9, hy + hr * 0.25, hr * 0.62, hr * 0.42, b);
    else if (!low) G.e(hx + hr * 0.75, hy + hr * 0.2, hr * 0.42, hr * 0.38, b);
    if (low) G.e(hx + hr * 0.8, hy + 0.2, hr * 0.7, hr * 0.5, b, { tex });
    G.px(hx + hr * (m.snout ? 1.45 : 1.1), hy + hr * 0.1, '#1a1010', 0.8, 0.8);
    G.eye(hx + hr * 0.35, hy - hr * 0.25, m.boss ? '#e04a2a' : '#1a1010');
    if (m.horn) { G.c(hx + hr * 0.3, hy - hr * 0.7, hx + hr * 0.9, hy - hr - 2.2, 0.7, 0.25, mat(m.horn, 'bone')); }
    if (m.crown) { G.b(hx - hr * 0.9, hy - hr - 1.4, hr * 1.8, 1.4, 0.2, mat('#f0c24a', 'gold')); [[-0.8, 0], [0, 0], [0.8, 0]].forEach(([s]) => G.p([[hx + s * hr - 0.5, hy - hr - 1.2], [hx + s * hr + 0.5, hy - hr - 1.2], [hx + s * hr, hy - hr - 3]], mat('#f0c24a', 'gold'))); G.px(hx - 0.3, hy - hr - 1, '#c0392b', 0.8, 0.8); }
    if (m.snout) G.px(hx + hr * 0.9, hy + hr * 0.55, '#f4ecdc', 0.6, 0.6);
  },
  // 슬라임·눈사람
  blob(D, m, fr, q, k) {
    const G = kit(D, k);
    if (m.nose) {
      const sn = mat(m.body, 'cloth'), tw = mat('#6b4a2e', 'wood');
      G.c(-5.5, -7, -9, -9 - fr, 0.45, 0.3, tw); G.c(4.5, -7, 8.5, -9 + fr, 0.45, 0.3, tw);
      G.e(0, -3.8, 5.2, 4, sn); G.e(0, -9.2, 3.8, 3.4, sn);
      G.b(-3, -14.4, 6, 2.6, 0.4, mat('#4a4a58', 'metal')); G.b(-4, -12.4, 8, 1, 0.3, mat('#4a4a58', 'metal'));
      G.eye(0.6, -10, '#1a1410', false); G.eye(2.6, -10, '#1a1410', false); G.c(2.8, -8.8, 6, -8.4, 0.7, 0.2, mat('#f08a3c', 'cloth'));
      G.px(1, -5, '#1a1410', 0.8, 0.8); G.px(1, -3, '#1a1410', 0.8, 0.8); G.c(-3, -6.8, 3, -6.6, 0.6, 0.6, mat('#c0392b'));
      return;
    }
    const w = m.w / 2 + 0.8 + (fr ? 0.5 : 0), h = m.h / 2 + 0.6 - (fr ? 0.4 : 0), g = mat(m.body, 'gel');
    G.e(0, -h, w, h, g, { lift: 0.05 });
    G.e(-w * 0.35, -h * 1.35, w * 0.28, h * 0.22, mat('#ffffff', 'glow'), { cast: false });
    G.px(-w * 0.1, -h * 0.5, rgbHex(MATS[g].rp[3]), 1, 1); G.px(-w * 0.5, -h * 0.7, rgbHex(MATS[g].rp[3]), 0.8, 0.8);
    G.eye(w * 0.45, -h * 1.1, '#103010'); G.eye(w * 0.05, -h * 1.1, '#103010');
    G.px(w * 0.25, -h * 0.75, '#103010', 1.2, 0.6);
  },
  // 독버섯 괴물
  shroom(D, m, fr, q, k) {
    const G = kit(D, k), st = mat(m.stem, 'cloth'), cap = mat(m.body, 'gel'), bob = fr ? -0.5 : 0;
    G.e(-1.6 + fr * 0.4, -0.8, 1.6, 1, mat(m.dark)); G.e(1.6 - fr * 0.4, -0.8, 1.6, 1, mat(m.dark));
    G.c(0, -1.5, 0, -7 + bob, 2.6, 2.2, st, { tex: TX.stripe(3) });
    G.e(0, -9.4 + bob, 6.4, 3.4, cap, { clip: (px, py) => py < (-8.4 + bob) * k });
    G.e(0, -8.6 + bob, 6, 1.2, mat(m.dark), { cast: false });
    [[-3, -10.8], [1, -11.6], [3.4, -9.8], [-0.8, -9.6]].forEach(([x, y]) => G.e(x, y + bob, 0.8, 0.6, mat('#f3e6ff', 'cloth'), { cast: false }));
    G.eye(1.2, -5.6 + bob); G.eye(-0.6, -5.6 + bob); G.px(0, -3.8 + bob, '#4a2a3a', 1.4, 0.6);
  },
  // 거미·전갈·개미지옥
  bug(D, m, fr, q, k) {
    const G = kit(D, k), b = mat(m.body, 'scale'), d = mat(m.dark, 'scale');
    const leg = (x, s, i) => { const kx = x + s * 1.2, ky = -5.2 - ((i + fr) % 2) * 0.6; G.c(x, -3.6, kx, ky, 0.5, 0.45, d); G.c(kx, ky, x + s * 2.4, 0 - 0.4, 0.45, 0.3, d); };
    [-3, -1, 1, 3].forEach((x, i) => leg(x - 1, i < 2 ? -1 : 1, i));
    if (m.tail) {
      const ty = fr ? 0.6 : 0;
      G.c(-5, -4.5, -7.5, -7, 1.3, 1.1, b); G.c(-7.5, -7, -7.5, -10.5, 1.1, 1, b); G.c(-7.5, -10.5, -5.5, -13 + ty, 1, 0.9, b); G.c(-5.5, -13 + ty, -3, -13 + ty, 0.9, 0.6, b);
      G.p([[-3, -13.8 + ty], [-0.6, -12.6 + ty], [-3, -12 + ty]], mat('#f0e0b0', 'bone'));
      G.c(4, -4, 7, -6, 0.9, 0.8, d); G.e(8, -6.6, 1.6, 1.1, d); G.c(4, -3, 7, -2, 0.8, 0.7, d); G.e(7.8, -1.8, 1.5, 1, d);
    }
    G.e(-1.4, -5.2, 4.6, 3.2, b, { tex: m.tail ? TX.plates(3) : TX.noise(5, 0.12) });
    G.e(3.6, -4.6, 2.6, 2.2, d);
    if (m.jaws) { const o = fr ? 0.6 : 0; G.c(5, -5.6, 8.6, -6.8 - o, 0.7, 0.3, mat('#5a4a32', 'bone')); G.c(5, -3.6, 8.6, -2.4 + o, 0.7, 0.3, mat('#5a4a32', 'bone')); }
    G.eye(4.6, -5.4, m.eye || '#e04a4a', false); G.eye(5.6, -4.8, m.eye || '#e04a4a', false);
    if (!m.tail && !m.jaws) { G.px(-2.6, -6.8, rgbHex(MATS[b].rp[3]), 1.6, 0.6); G.px(-1, -4, '#c04040', 1, 1); }
  },
  // 트렌트
  tree(D, m, fr, q, k) {
    const G = kit(D, k), bark = mat(m.body, 'wood'), lf = mat(m.leaf, 'fur');
    G.c(-1.4, -1, -3.6, 0, 1, 0.8, bark); G.c(1.4, -1, 3.8, 0, 1, 0.8, bark);
    G.c(2, -8, 6, -10 + fr, 0.9, 0.6, bark); G.c(-2, -8, -5.5, -9.6 - fr, 0.8, 0.5, bark);
    G.b(-2.6, -11, 5.2, 11, 1.4, bark, { tex: TX.grain() });
    G.e(0, -14.6, 6.4, 4.6, lf, { tex: TX.noise(7, 0.22) });
    G.e(-3.4, -12.6, 3.2, 2.6, lf, { tex: TX.noise(9, 0.22) }); G.e(3.6, -12.8, 3, 2.4, lf, { tex: TX.noise(11, 0.22) });
    G.px(0.2, -8.4, '#f0e070', 0.9, 0.9); G.px(1.8, -8.4, '#f0e070', 0.9, 0.9); G.px(0.4, -5.6, '#2a1a10', 2, 0.8);
  },
  // 두 발: 고블린·코볼트·사막 도적·암살자 길드
  biped(D, m, fr, q, k) {
    const G = kit(D, k), s = mat(m.skin, 'skin'), c = mat(m.cloth, 'cloth'), bt = mat('#3a2a1e', 'leather');
    const st = fr ? 1 : -1;
    G.c(-0.8, -5, -1.2 + st * 0.6, -1.2, 0.95, 0.85, c); G.b(-2.2 + st * 0.6, -1.6, 2.4, 1.6, 0.5, bt);
    G.c(0.9, -5, 1.3 - st * 0.6, -1.2, 0.95, 0.85, c); G.b(0.2 - st * 0.6, -1.6, 2.6, 1.6, 0.5, bt);
    G.e(0, -6.8, 2.6, 2.8, c, { tex: TX.fold(3, 0) });
    G.b(-2.4, -5.4, 4.8, 0.9, 0.3, mat('#4a3020', 'leather'), { cast: false });
    G.c(-1.8, -8.4, -2.6, -5, 0.8, 0.7, m.hood || m.wrap ? c : s);
    const hx = 0.6, hy = -11;
    if (!m.hood && !m.wrap) { G.p([[hx - 2, hy - 0.4], [hx - 5.2, hy - 2.2], [hx - 1.8, hy + 0.8]], s); }
    if (m.hood) G.e(hx - 0.6, hy, 3.4, 3.4, c, { tex: TX.fold(3, 0) });
    G.e(hx, hy, 2.8, 2.8, s);
    if (!m.hood && !m.wrap) G.p([[hx + 1.8, hy - 0.8], [hx + 5, hy - 2.8], [hx + 2.4, hy + 0.6]], s);
    if (m.skin === '#b0703a') { G.e(hx + 2.6, hy + 0.6, 1.4, 1, s); G.c(hx - 1, hy - 2.4, hx - 2, hy - 4.2, 0.5, 0.2, mat('#e8dcc0', 'bone')); }
    if (m.hood) { G.e(hx - 0.8, hy - 1.4, 3.2, 2.2, c, { clip: (px, py) => py < (hy - 0.9) * k }); G.b(hx - 0.2, hy + 0.6, 3.2, 1.8, 0.6, mat(shade(m.cloth, 0.15)), { cast: false }); }
    if (m.wrap) { G.b(hx - 2.8, hy - 2.8, 5.6, 1.6, 0.5, c); G.b(hx - 0.4, hy + 0.6, 3.2, 1.4, 0.5, c, { cast: false }); G.c(hx - 2.4, hy - 2, hx - 4.6, hy + 1.6, 0.6, 0.4, c); }
    G.eye(hx + 1.4, hy - 0.3, m.hood ? '#e04a4a' : '#f7e04a', false);
    if (!m.hood && !m.wrap) G.px(hx + 1.2, hy + 1.2, rgbHex(MATS[s].rp[0]), 1.4, 0.5);
    const hand = [2.8, -6.2];
    if (m.gear === 'dagger') G.p([[hand[0], hand[1] - 0.5], [hand[0] + 4, hand[1] - 1.2], [hand[0], hand[1] + 0.5]], mat('#c9c3b8', 'metal'));
    if (m.gear === 'staff') { G.c(hand[0], 0, hand[0], -13, 0.5, 0.5, mat('#7a5634', 'wood')); G.e(hand[0], -14, 1.4, 1.3, mat('#e8e2d0', 'bone')); G.px(hand[0] - 0.4, -14.2, '#141414', 0.6, 0.6); }
    if (m.gear === 'pick') { G.c(hand[0], -2, hand[0] + 0.6, -9.5, 0.5, 0.5, mat('#7a5634', 'wood')); G.c(hand[0] - 2.4, -9.2, hand[0] + 3.4, -10, 0.55, 0.3, mat('#c9c3b8', 'metal')); G.b(hx - 2.4, hy - 3.4, 4.8, 1.2, 0.4, mat('#e8b84a', 'metal')); }
    if (m.gear === 'flask') { G.e(hand[0] + 0.6, hand[1] - 0.2, 1.3, 1.5, mat('#7ad83c', 'gel')); G.b(hand[0], hand[1] - 2.4, 1.2, 1, 0.2, mat('#e8e2d0', 'cloth')); }
    if (m.gear === 'club') G.c(hand[0], hand[1] + 1, hand[0] + 1.4, hand[1] - 6, 0.6, 1.3, mat('#6b4a2e', 'wood'), { tex: TX.grain() });
    G.c(1.6, -8.4, hand[0], hand[1], 0.8, 0.7, m.hood || m.wrap ? c : s); G.e(hand[0], hand[1], 0.8, 0.8, s);
    if (m.feather) { G.c(hx - 1, hy - 2.6, hx - 2, hy - 5.2, 0.5, 0.3, mat('#e05a4a')); G.c(hx, hy - 2.8, hx + 0.4, hy - 5.6, 0.5, 0.3, mat('#f0c24a')); }
  },
  // 날짐승: 박쥐·하피·그리폰·와이번
  flyer(D, m, fr, q, k) {
    const G = kit(D, k), b = mat(m.body, m.big ? (m.beak === '#f0c24a' ? 'fur' : 'scale') : 'fur'), d = mat(m.dark, m.big ? 'scale' : 'fur');
    const y = -12 + Math.round(Math.sin(q * Math.PI / 2) * 1.5), up = q % 4 < 2;
    if (m.big) {
      const fea = m.beak === '#f0c24a', wm = mat(m.dark, fea ? 'fur' : 'scale'), mem = mat(shade(m.dark, 0.1), 'cloth');
      if (fea) featherWing(G, -2, y - 1.5, up ? -2.5 : 2.0, up ? -1.4 : 3.0, 13, 6, wm, b);
      else batWing(G, -2, y - 1.5, up ? [[-6, y - 13], [-11, y - 13], [-13, y - 7]] : [[-6, y + 8], [-11, y + 8], [-13, y + 3]], mem, wm);
      G.c(-6, y + 0.5, -12, y + 2 + (fr ? 1 : 0), 1.4, 0.5, b, { tex: TX.noise(2, 0.15) });
      if (!fea) G.p([[-12, y + 1 + (fr ? 1 : 0)], [-14.5, y - 0.5], [-14, y + 3]], wm);
      G.c(-1, y + 2, -1.6, y + 6.5, 0.7, 0.5, d); G.c(2.4, y + 2, 2.8, y + 6.5, 0.7, 0.5, d);
      G.e(-0.6, y, 6, 3.6, b, { tex: fea ? TX.noise(3, 0.15) : TX.scale() });
      if (!fea) G.e(0, y + 1.4, 4.6, 2, mat(shade(m.body, 0.25), 'scale'), { tex: TX.stripe(2), cast: false });
      G.c(4, y - 1, 6.6, y - 4, 1.8, 1.5, fea ? mat('#f4ecd8', 'fur') : b);
      G.e(7.4, y - 4.8, 2.6, 2.3, fea ? mat('#f4ecd8', 'fur') : b);
      G.p([[9, y - 5.6], [12.4, y - 4.2], [9.4, y - 3]], mat(m.beak || '#e8e2d0', 'bone'));
      G.eye(8.2, y - 5.6, m.boss ? '#ff5a3a' : '#1a1010');
      if (!fea) { G.c(6.2, y - 6.4, 4.4, y - 9, 0.5, 0.2, mat('#e8e2d0', 'bone')); G.c(7.4, y - 6.6, 6.4, y - 9.6, 0.4, 0.15, mat('#e8e2d0', 'bone')); }
      if (fea) featherWing(G, 0.5, y - 2, up ? -2.0 : 1.2, up ? -0.9 : 2.2, 13, 6, b, wm);
      else batWing(G, 0.5, y - 2, up ? [[0, y - 15], [-4, y - 16], [-8, y - 10]] : [[-1, y + 10], [-5, y + 11], [-9, y + 5]], mat(shade(m.dark, 0.2), 'cloth'), wm);
      return;
    }
    const face = m.face, wm = mat(m.dark, face ? 'fur' : 'cloth'), bone = mat(m.body, 'fur');
    const tipsB = up ? [[-4, y - 7], [-7.5, y - 6], [-8.5, y - 2]] : [[-4, y + 4.5], [-7.5, y + 4], [-8.5, y + 1]];
    if (face) featherWing(G, -0.6, y - 1, up ? -2.4 : 2.2, up ? -1.3 : 3.1, 8, 5, wm, mat(m.body, 'fur')); else batWing(G, -0.6, y - 0.4, tipsB, wm, bone);
    if (face) { G.c(-0.6, y + 2, -0.8, y + 5.5, 0.5, 0.4, mat('#e0c070', 'skin')); G.c(1, y + 2, 1.2, y + 5.5, 0.5, 0.4, mat('#e0c070', 'skin')); }
    G.e(0, y + 0.4, 2.6, 2.6, b, { tex: TX.noise(4, 0.15) });
    if (face) { G.e(1.2, y - 3, 2, 2.1, mat(face, 'skin')); G.e(0.4, y - 4, 2.2, 1.6, mat('#7a5a3a', 'hair'), { clip: (px, py) => py < (y - 3.4) * k }); G.c(-0.6, y - 3.4, -1.8, y + 0.6, 0.9, 0.6, mat('#7a5a3a', 'hair')); G.eye(2.3, y - 3); }
    else { G.p([[-1.2, y - 2], [-0.6, y - 4.6], [0.4, y - 2.2]], b); G.p([[0.8, y - 2.2], [1.8, y - 4.6], [2.2, y - 1.8]], b); G.eye(1.4, y - 0.6, '#e04a4a', false); G.px(1.6, y + 1, '#f4f0e6', 0.5, 0.8); }
    const tipsF = up ? [[2, y - 7.5], [6, y - 7], [7.5, y - 2]] : [[2, y + 5], [6, y + 4.6], [7.5, y + 1.4]];
    if (face) featherWing(G, 0.8, y - 1, up ? -1.9 : 1.0, up ? -0.7 : 1.9, 8.5, 5, mat(m.body, 'fur'), wm); else batWing(G, 0.8, y - 0.4, tipsF, mat(shade(m.dark, 0.12), 'cloth'), bone);
  },
  // 골렘·바위거인·얼음 정령·예티
  golem(D, m, fr, q, k) {
    const G = kit(D, k), yeti = m.body === '#e8ecf0', st = mat(m.body, yeti ? 'fur' : m.small ? 'gem' : 'stone'), dk = mat(m.dark, yeti ? 'fur' : 'stone'), tex = yeti ? TX.noise(6, 0.2) : TX.noise(8, 0.1);
    if (m.small) {
      const y = -9 + (fr ? -0.6 : 0);
      G.p([[-3, y], [0, y - 6], [3, y], [0, y + 6]], st, { line: 1 }, 1.6);
      G.p([[-5.5, y - 1], [-3.4, y - 3], [-2.6, y + 1]], st, {}, 0.8); G.p([[5.5, y - 1], [3.4, y - 3], [2.6, y + 1]], st, {}, 0.8);
      G.p([[-1, y + 6.5], [0, y + 9], [1, y + 6.5]], st, {}, 0.6);
      G.e(0, y, 1.3, 1.6, mat(m.core, 'glow'), { cast: false }); G.eye(-1, y - 2.4, '#1a2a4a', false); G.eye(1.2, y - 2.4, '#1a2a4a', false);
      return;
    }
    const sw = fr ? 0.6 : -0.6;
    G.c(-4.6, -9 - sw, -6.4, -2.4, 2.2, 2.6, dk, { tex });
    G.b(-3.8, -5.4, 3.2, 5.4, 1, dk, { tex }); G.b(0.8, -5.4, 3.2, 5.4, 1, dk, { tex });
    G.e(0, -10.4, 6.8, 5.6, st, { tex });
    G.e(0.6, -9.6, 2, 2.2, mat(m.core, 'glow'), { cast: false });
    if (!yeti) [[-3.6, -12], [2.4, -13.4], [-1.4, -7.6]].forEach(([x, y]) => G.px(x, y, rgbHex(MATS[st].rp[0]), 1.6, 0.6));
    G.e(1.4, -16.4, 3, 2.6, st, { tex });
    if (yeti) G.e(2.4, -16, 2, 1.8, mat(m.core, 'skin'));
    G.eye(2, -16.8, yeti ? '#1a1010' : m.core, !yeti); G.eye(3.8, -16.8, yeti ? '#1a1010' : m.core, !yeti);
    G.c(4.8, -12 + sw, 6.6, -4.6, 2.3, 2.7, st, { tex });
  },
  // 샌드웜
  worm(D, m, fr, q, k) {
    const G = kit(D, k), b = mat(m.body, 'leather'), d = mat(m.dark, 'leather'), ph = q / 4 * Math.PI * 2;
    G.e(0, -0.6, 7.6, 1.6, mat('#a8844e', 'stone'), { tex: TX.noise(2, 0.3) });
    const pts = [];
    for (let i = 0; i <= 7; i++) { const t = i / 7; pts.push([-4 + t * 8 + Math.sin(ph + t * 3) * 0.8, -1 - t * 19 + Math.cos(ph + t * 2.4) * 0.6 * t]); }
    pts.forEach(([x, y], i) => G.e(x, y, 3.6 - i * 0.12, 2.6, i % 2 ? b : d, { tex: TX.stripe(3) }));
    const [hx, hy] = pts[pts.length - 1];
    G.e(hx + 1.6, hy - 0.6, 3.2, 3.4, b);
    G.e(hx + 3.4, hy - 0.4, 1.6, 2.6, mat('#3a1a14', 'cloth'), { cast: false });
    [[0, -2.2], [0.6, -1], [0.8, 0.4], [0.6, 1.6]].forEach(([x, y]) => G.px(hx + 3 + x, hy + y, '#f4ecd8', 0.8, 0.8));
  },
  // 설녀·설녀 여왕
  ghost(D, m, fr, q, k) {
    const G = kit(D, k), b = mat(m.body, 'cloth'), hr = mat(m.hair, 'hair'), y = -3 + Math.sin(q * Math.PI / 2) * 1;
    G.p([[-4, y - 9], [3, y - 9], [4.5, y - 1], [2, y + 1.6], [-1, y + 0.4], [-3.4, y + 2.6], [-6, y + 0.6]], b, { tex: TX.fold(3, q) }, 1.6);
    G.c(-1, y - 15, -4, y - 6, 2.2, 1.2, hr);
    G.e(0, y - 11, 3, 3.6, b);
    G.c(2, y - 11, 5.6, y - 8.4 + (fr ? -1 : 0), 0.8, 0.6, b);
    G.e(0.8, y - 15.6, 2.6, 2.8, mat('#f4f0f8', 'skin'));
    G.e(0, y - 16.6, 3, 2.4, hr, { clip: (px, py) => py < (y - 16) * k || px < (y * 0 - 1) * k });
    G.eye(1.6, y - 15.8, '#3a5a9a'); G.eye(3, y - 15.8, '#3a5a9a');
    if (m.crown) { G.b(-1.6, y - 19.6, 4.6, 1.2, 0.2, mat('#cfefff', 'gem')); [-1, 0.8, 2.6].forEach(x => G.p([[x - 0.6, y - 19.4], [x + 0.6, y - 19.4], [x, y - 22]], mat('#cfefff', 'gem'))); }
    [[-6, y - 4], [5, y - 13], [-5, y - 13]].forEach(([x, yy], i) => G.px(x + (q + i) % 2, yy, '#e8f6ff', 0.6, 0.6));
  },

  /* ── 초대형 레이드 몬스터 ── */
  kingslime(D, m, fr, q, k) {
    const G = kit(D, k), g = mat(m.body, 'gel'), sq = fr ? 0.6 : 0;
    G.e(0, -18 + sq, 23 + sq, 18 - sq, g, { tex: TX.noise(5, 0.04) });
    [[-9, -12, 3.6], [6, -9, 2.6], [-2, -6, 2.2], [11, -15, 2]].forEach(([x, y, r]) => G.e(x, y + sq, r, r * 0.8, mat(shade(m.body, 0.25), 'gel'), { cast: false }));
    G.e(-10, -29 + sq, 6, 3, mat('#ffffff', 'glow'), { cast: false });
    G.eye(8, -24 + sq, '#0a2a4a'); G.eye(14, -24 + sq, '#0a2a4a'); G.c(9, -19 + sq, 14, -19 + sq, 0.8, 0.8, mat('#0a2a4a', 'cloth'));
    const cy = -36 + sq * 2, gm = mat('#f0c24a', 'gold');
    G.b(-7, cy, 14, 4, 0.6, gm, { tex: TX.stripe(2) });
    [-6, -2, 2, 6].forEach((x, i) => G.p([[x - 1.6, cy + 0.5], [x + 1.6, cy + 0.5], [x, cy - 4 - (i % 2) * 1.5]], gm));
    G.px(-1, cy + 1.2, '#c0392b', 2, 2); G.px(-5, cy + 1.4, '#5ab0f0', 1.4, 1.4); G.px(4, cy + 1.4, '#7ae0a0', 1.4, 1.4);
  },
  swordmaster(D, m, fr, q, k) {
    const G = kit(D, k), s = mat(m.skin, 'skin'), c = mat(m.cloth, 'cloth'), mt = mat('#9aa4b0', 'metal'), dk = mat('#2a1a1a', 'leather'), sw = fr ? 1 : 0;
    // 두 자루 대검 (뒤)
    G.p([[-6, -26], [-4, -26], [-14, -44], [-16, -43]], mt, { line: 1 }, 0.8);
    G.c(-7, -18, -2, -26, 2.4, 2, s);
    G.c(-4, -15, -6, -1, 3, 2.4, c); G.b(-9, -2.6, 6, 2.6, 0.8, dk);
    G.c(4, -15, 6, -1, 3, 2.4, c); G.b(3, -2.6, 6.4, 2.6, 0.8, dk);
    G.e(0, -22, 9, 9.4, s, { tex: TX.noise(4, 0.05) });
    G.p([[-9, -18], [9, -18], [8, -11], [-8, -11]], c, { tex: TX.fold(3, 0) });
    G.c(-8, -26, 8, -16, 1.6, 1.6, mat('#7a5232', 'leather'));
    G.e(-5, -29, 5, 3.6, mt, { tex: TX.plates(2) });
    G.c(-6, -30, -18, -24 - sw, 1.4, 0.6, mat('#c0392b'));
    const hx = 2, hy = -36;
    G.p([[hx - 3, hy], [hx - 10, hy - 4], [hx - 3, hy + 2]], s);
    G.e(hx, hy, 6.4, 6, s);
    G.p([[hx + 4, hy - 1], [hx + 11, hy - 5], [hx + 5, hy + 2]], s);
    G.b(hx - 6.4, hy - 4, 12.8, 2.6, 0.6, mat('#c0392b'));
    G.eye(hx + 2, hy - 0.4, '#f7e04a', false); G.eye(hx + 4.6, hy - 0.4, '#f7e04a', false);
    G.c(hx - 1, hy - 2, hx + 3, hy + 3, 0.3, 0.3, mat('#8a3a2a', 'cloth'), { cast: false });
    G.p([[hx + 1, hy + 3], [hx + 5, hy + 3], [hx + 4.4, hy + 4]], mat('#f4ecd8', 'bone'), { cast: false });
    G.c(8, -27, 14, -20 + sw, 2.6, 2.2, s);
    G.p([[12, -19 + sw], [15, -21 + sw], [32, -36 + sw * 2], [31, -39 + sw * 2]], mt, { line: 1 }, 0.8);
    G.b(11, -22 + sw, 5, 2, 0.4, mat('#d8a84a', 'gold'));
  },
  giantgriffon(D, m, fr, q, k) {
    const G = kit(D, k), b = mat(m.body, 'fur'), d = mat(m.dark, 'fur'), wh = mat('#f4ecd8', 'fur'), up = q % 4 < 2, y = -24 + (up ? -1.5 : 1);
    featherWing(G, -6, y - 4, up ? -2.5 : 2.0, up ? -1.3 : 3.0, 28, 8, d, b);
    G.c(-14, y + 2, -27, y - 2 + (fr ? 2 : 0), 2.4, 0.8, b, { tex: TX.noise(3, 0.12) }); G.e(-28, y - 3 + (fr ? 2 : 0), 2.6, 2, d, { tex: TX.noise(5, 0.3) });
    G.c(-10, y + 6, -11, y + 22, 2.4, 1.8, b); G.e(-10.6, y + 22.6, 2.8, 1.4, d);
    G.c(4, y + 6, 6, y + 22, 2.2, 1.6, mat('#e0b040', 'scale')); G.e(7, y + 22.6, 3, 1.4, mat('#e0b040', 'scale'));
    G.e(-4, y + 2, 14, 9, b, { tex: TX.noise(7, 0.1) });
    G.e(6, y - 4, 7, 7, wh, { tex: TX.stripe(2) });
    G.c(8, y - 6, 12, y - 14, 4.6, 4, wh, { tex: TX.stripe(2) });
    G.e(14, y - 17, 5.6, 5, wh);
    G.p([[17, y - 19], [25, y - 15], [21, y - 11], [17, y - 13]], mat('#f0c24a', 'gold'), { line: 1 });
    G.eye(16, y - 18.6, '#2a1a10'); G.px(16.4, y - 20, '#2a1a10', 2, 0.6);
    G.p([[10, y - 20], [8, y - 26], [12, y - 22]], wh);
    G.c(12, y + 6, 14, y + 18, 2, 1.6, mat('#e0b040', 'scale')); G.p([[13, y + 18], [18, y + 19], [14, y + 20]], mat('#e8e2d0', 'bone'));
    featherWing(G, -1, y - 6, up ? -2.2 : 1.3, up ? -0.9 : 2.3, 30, 8, b, mat('#f4ecd8', 'fur'));
  },
  dragon(D, m, fr, q, k) {
    const G = kit(D, k), b = mat(m.body, 'scale'), d = mat(m.dark, 'scale'), belly = mat('#a8c4e0', 'scale'), hn = mat('#e8e2d0', 'bone'), up = q % 4 < 2, y = -26 + (up ? -1.5 : 1);
    const mem = mat('#4a6a9a', 'cloth'), mem2 = mat('#5a7ab0', 'cloth');
    batWing(G, -6, y - 6, up ? [[-12, y - 34], [-24, y - 36], [-34, y - 28], [-36, y - 16]] : [[-14, y + 10], [-26, y + 14], [-36, y + 10], [-38, y]], mem, d);
    G.c(-14, y + 4, -30, y + 12, 5, 2.4, b, { tex: TX.scale() }); G.c(-30, y + 12, -42, y + 6 + (fr ? 2 : 0), 2.4, 0.8, b, { tex: TX.scale() });
    G.p([[-41, y + 4 + (fr ? 2 : 0)], [-47, y + 1], [-45, y + 7 + (fr ? 2 : 0)], [-48, y + 11], [-42, y + 9 + (fr ? 2 : 0)]], d);
    G.c(-11, y + 8, -14, y + 22, 4, 3, d, { tex: TX.scale() }); G.c(-14, y + 22, -12, y + 28, 3, 2.4, d); G.e(-11, y + 28.6, 4.4, 1.6, d);
    G.e(-3, y + 3, 15, 10, b, { tex: TX.scale() });
    G.e(1, y + 7, 11, 5.4, belly, { tex: TX.stripe(2), cast: false, clip: (px, py) => py > (y + 3) * k });
    G.c(7, y + 10, 9, y + 22, 3.6, 2.8, b, { tex: TX.scale() }); G.c(9, y + 22, 11, y + 28, 2.8, 2.2, b); G.e(12, y + 28.6, 4.4, 1.6, d);
    [[13, y + 28.6], [15, y + 28.4]].forEach(([x, yy]) => G.p([[x, yy - 1], [x + 2.4, yy], [x, yy + 0.6]], hn));
    G.c(8, y - 3, 14, y - 13, 5, 4, b, { tex: TX.scale() }); G.c(14, y - 13, 18, y - 19, 4, 3.6, b, { tex: TX.scale() });
    G.c(9, y - 1, 14, y - 11, 2.6, 2.2, belly, { tex: TX.stripe(2), cast: false });
    G.e(21, y - 21, 6.4, 4.6, b, { tex: TX.scale() });
    G.p([[24, y - 24], [33, y - 21], [33, y - 18.5], [24, y - 18]], b);
    G.p([[24, y - 18.6], [32, y - 17.6], [29, y - 15]], d);
    [[27, y - 18], [29.5, y - 17.8], [31.5, y - 17.6]].forEach(([x, yy]) => G.px(x, yy, '#f4ecd8', 0.6, 1));
    G.c(18, y - 24, 9, y - 31, 1.7, 0.5, hn); G.c(21, y - 25, 15, y - 34, 1.5, 0.4, hn);
    G.eye(24, y - 22, '#fff4a0', false); G.px(23.4, y - 23.4, '#1e3050', 3, 0.6);
    [[-6, y - 6], [-1, y - 7.6], [4, y - 8.6], [9, y - 12], [13, y - 17]].forEach(([x, yy]) => G.p([[x - 1.6, yy + 0.6], [x + 1.6, yy + 0.6], [x - 0.4, yy - 3.4]], mat('#9ab8d8', 'gem')));
    G.c(14, y + 1, 19, y + 9, 2.4, 1.8, b); G.p([[18, y + 9], [23, y + 10], [19, y + 11]], hn);
    batWing(G, -1, y - 8, up ? [[2, y - 40], [-10, y - 46], [-22, y - 40], [-28, y - 28]] : [[-6, y + 12], [-18, y + 20], [-28, y + 18], [-32, y + 8]], mem2, b);
    if (fr) { const bolt = mat('#fff8a0', 'glow'); [[30, -48, 26, -42], [26, -42, 30, -38], [30, -38, 27, -32]].forEach(([x1, y1, x2, y2]) => G.c(x1, y1, x2, y2, 0.5, 0.5, bolt, { cast: false })); }
  },
  whale(D, m, fr, q, k) {
    const G = kit(D, k), b = mat(m.body, 'scale'), d = mat(m.dark, 'scale'), belly = mat('#c8c0e8', 'cloth'), y = -40 + Math.sin(q * Math.PI / 2) * 2;
    // 지느러미: 뿌리(x,yy)에서 ang 쪽으로 부채처럼 펼친 막과 살
    const fin = (x, yy, ang, len, wd, mm) => {
      const c = Math.cos(ang), s2 = Math.sin(ang), nx = -s2, ny = c, pts = [[x - nx * wd * 0.3, yy - ny * wd * 0.3]];
      for (let i = 0; i <= 6; i++) { const t = i / 6 - 0.5, L2 = len * (0.75 + 0.25 * Math.cos(t * 2.6)); pts.push([x + c * L2 + nx * wd * t * 2.2, yy + s2 * L2 + ny * wd * t * 2.2]); }
      pts.push([x + nx * wd * 0.3, yy + ny * wd * 0.3]);
      G.p(pts, mm || mat('#7a6ac8', 'cloth'), { tex: TX.fold(2, 0) }, 1.4);
      for (let i = 0; i <= 4; i++) { const t = i / 4 - 0.5; G.c(x, yy, x + c * len * 0.9 + nx * wd * t * 2, yy + s2 * len * 0.9 + ny * wd * t * 2, 0.5, 0.25, d, { cast: false }); }
    };
    const fl = fr ? 0.15 : -0.15;
    fin(-24, y - 16, -2.3 + fl, 20, 6); fin(-6, y - 19, -1.95 - fl, 18, 6); fin(12, y - 18, -1.6 + fl, 14, 5);
    G.p([[-46, y - 2], [-62, y - 16 + (fr ? 2 : 0)], [-58, y], [-62, y + 14 - (fr ? 2 : 0)], [-46, y + 4]], d, { tex: TX.stripe(3) }, 2);
    G.e(-4, y, 48, 20, b, { tex: TX.noise(11, 0.05) });
    G.e(2, y + 10, 40, 9, belly, { tex: TX.stripe(2), cast: false, clip: (px, py) => py > (y + 4) * k });
    fin(-14, y + 14, 2.3 - fl, 22, 7, mat('#8a7ad8', 'cloth')); fin(8, y + 16, 1.95 + fl, 18, 6, mat('#8a7ad8', 'cloth')); fin(24, y + 12, 1.5 - fl, 13, 4); fin(-32, y + 10, 2.7 + fl, 13, 4);
    fin(4, y + 2, 2.6 + fl * 2, 16, 6, mat('#9a8ae8', 'cloth'));
    G.c(30, y + 6, 42, y + 8, 1, 1, mat('#2a2040', 'cloth'), { cast: false });
    [[24, y - 6], [32, y - 7], [27, y - 1], [35, y - 2]].forEach(([x, yy]) => { G.e(x, yy, 2.4, 2, mat('#fff4b0', 'glow'), { cast: false }); G.px(x + 0.4, yy - 0.4, '#3a1a4a', 1.4, 1.4); });
    [[-30, y - 10], [-20, y - 12], [-8, y - 13], [6, y - 12]].forEach(([x, yy]) => G.e(x, yy, 1.4, 1, mat('#e8e4ff', 'bone'), { cast: false }));
  }
};
// 사람 크기 적(사막 도적·암살자 길드)은 모험가 그림을 빌린다
const HUMAN_FOES = {
  bandit:    { cls: 'rogue', look: { hair: '#2b1d16', skin: '#c68a5e' }, L: { body: 'leather', c1: '#d8b878', c2: '#8a6a4a', c3: '#d8b878', head: 'cowl', ex: ['scarf'] }, w: 'dagger' },
  assassin:  { cls: 'assassin', look: { hair: '#2b1d16', skin: '#c68a5e' }, L: { body: 'leather', c1: '#22222c', c2: '#3a3a46', c3: '#5a5a6a', head: 'cowl', eyes: '#e04a4a', ex: ['twin'] }, w: 'dagger' },
  poisoner:  { cls: 'plaguedoc', look: { hair: '#2b1d16', skin: '#e0ac7e' }, L: { body: 'coat', c1: '#3a4a2a', c2: '#2a3a20', c3: '#3a4a2a', head: 'hoodup', cape: '#2a3a20', eyes: '#9ae86a' }, w: 'mace' },
  enforcer:  { cls: 'berserker', look: { hair: '#2b1d16', skin: '#9a6644' }, L: { body: 'bare', c1: '#3a2a2a', c2: '#5a3a2a', head: 'band', c3: '#3a2a2a', sh: 'spike', metal: '#5a5a62' }, w: 'club' },
  blackhood: { cls: 'shadowlord', look: { hair: '#14141a', skin: '#c68a5e' }, L: { body: 'coat', c1: '#14141a', c2: '#3a3a46', c3: '#14141a', head: 'cowl', cape: '#14141a', eyes: '#ff4a3a', ex: ['twin', 'wisp'] }, w: 'dagger' }
};
function paintMonHi(D, id, m, fr, q, sc) {
  const H = HUMAN_FOES[id];
  if (H) {
    D.sc = sc;
    paintAdvHi(D, { id: 7, cls: H.cls, look: H.look, eq: { weapon: { base: H.w, t: 2, q: 0 }, armor: null } }, fr ? 'walk' : 'idle', fr ? 2 : 0, H.L);
    return;
  }
  (BEAST[m.plan] || BEAST.blob)(D, m, fr, q, HI * sc);
}
