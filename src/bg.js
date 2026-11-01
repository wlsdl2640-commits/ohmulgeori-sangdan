/* ───────── 배경 ───────── */
const VW = 240, VH = 128, GY = 104;   // 가상 화면 크기, 발 디딤선
const BG = {};

const SKIES = {
  plains:   ['#7fb2dc', '#8fbde0', '#a2c9e4', '#b8d6e8', '#cfe3ea'],
  forest:   ['#1f3b3c', '#284a48', '#335a52', '#40695c', '#507a66'],
  mountain: ['#3a3548', '#4a4458', '#5d5568', '#766c7c', '#8a7f8f'],
  town:     ['#0b1020', '#0f1528', '#141c32', '#19233c', '#1e2a44']
};

function hills(x, w, base, amp, f1, f2, col, seed) {
  for (let i = 0; i < w; i++) {
    const y = Math.round(base - Math.sin((i + seed) * f1) * amp - Math.sin((i + seed * 3) * f2 + 1) * amp * 0.5);
    R(x, i, y, 1, 128 - y, col);
  }
}

function buildPlains() {
  const r = rng(11);
  const [far, f] = mkCanvas(480, 128);
  for (let k = 0; k < 6; k++) { const cx = Math.floor(r() * 460), cy = 10 + Math.floor(r() * 26), cw = 14 + Math.floor(r() * 18); R(f, cx, cy, cw, 3, '#eef4f6'); R(f, cx + 3, cy - 2, cw - 8, 2, '#eef4f6'); R(f, cx + 2, cy + 3, cw - 4, 1, '#d6e4ea'); }
  hills(f, 480, 82, 6, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 7, '#8fb08a', 0);
  hills(f, 480, 90, 4, Math.PI * 2 / 480 * 4, Math.PI * 2 / 480 * 9, '#76a06e', 40);
  const [mid, m] = mkCanvas(480, 128);
  R(m, 0, 90, 480, 12, '#d6b45a');
  for (let x = 0; x < 480; x += 3) R(m, x, 91 + (x % 2), 1, 10, '#c4a046');
  for (let x = 0; x < 480; x += 7) R(m, x, 89, 1, 2, '#e6c86a');
  // 나무와 울타리, 풍차
  [40, 190, 410].forEach(tx => { R(m, tx, 74, 3, 18, '#5e4630'); R(m, tx - 7, 62, 17, 13, '#4f8a43'); R(m, tx - 5, 59, 13, 3, '#4f8a43'); R(m, tx - 4, 62, 6, 2, '#6aa555'); });
  for (let x = 90; x < 160; x += 12) { R(m, x, 84, 2, 10, '#7a5634'); if (x + 12 < 160) R(m, x, 87, 12, 1, '#8a6a44'); }
  R(m, 300, 58, 9, 34, '#d8d0c0'); R(m, 299, 54, 11, 4, '#8a3a2a'); R(m, 301, 52, 7, 2, '#8a3a2a'); R(m, 303, 70, 3, 5, '#5e4630');
  for (let i = -14; i <= 14; i++) { R(m, 304 + i, 56 + Math.round(i * 0.3), 1, 1, '#6b5a48'); R(m, 304 + Math.round(i * 0.3), 56 - i, 1, 1, '#6b5a48'); }
  const [gr, g] = mkCanvas(240, 28);
  R(g, 0, 0, 240, 28, '#4f8a3c'); R(g, 0, 0, 240, 3, '#6aa84f');
  R(g, 0, 6, 240, 10, '#a5845a'); R(g, 0, 6, 240, 1, '#8c6c46'); R(g, 0, 15, 240, 1, '#8c6c46');
  for (let k = 0; k < 40; k++) { const x = Math.floor(r() * 240); R(g, x, 7 + Math.floor(r() * 8), 1, 1, '#c4a678'); }
  for (let k = 0; k < 30; k++) { const x = Math.floor(r() * 240); R(g, x, 18 + Math.floor(r() * 8), 1, 2, '#62a04c'); }
  return { sky: SKIES.plains, far, mid, gr };
}

function buildForest() {
  const r = rng(23);
  const [far, f] = mkCanvas(480, 128);
  R(f, 222, 14, 30, 90, '#18302a'); R(f, 214, 90, 46, 14, '#18302a');
  R(f, 150, 0, 180, 30, '#1a3530'); R(f, 170, 26, 140, 10, '#1a3530'); R(f, 130, 6, 30, 18, '#1a3530'); R(f, 320, 6, 30, 18, '#1a3530');
  for (let k = 0; k < 9; k++) { const x = Math.floor(r() * 470); if (x > 120 && x < 360) continue; const h = 40 + Math.floor(r() * 30); R(f, x, 104 - h, 8, h, '#22423a'); R(f, x - 6, 104 - h - 10, 20, 14, '#22423a'); }
  const [mid, m] = mkCanvas(480, 128);
  for (let x = 6; x < 480; x += 34 + Math.floor(r() * 18)) {
    const w = 6 + Math.floor(r() * 4), top = 20 + Math.floor(r() * 20);
    R(m, x, top, w, 104 - top, '#3b2e22'); R(m, x + 1, top, 1, 104 - top, '#4a3a2c');
    R(m, x - 9, top - 8, w + 18, 14, '#2f5a35'); R(m, x - 6, top - 12, w + 12, 4, '#2f5a35'); R(m, x - 4, top - 8, 6, 2, '#3f7a44');
  }
  for (let x = 0; x < 480; x += 9) { const h = 3 + Math.floor(r() * 5); R(m, x, 100 - h, 4, h, '#3f7a3a'); }
  const [gr, g] = mkCanvas(240, 28);
  R(g, 0, 0, 240, 28, '#2f4a28'); R(g, 0, 0, 240, 3, '#3d6b3a');
  R(g, 0, 6, 240, 10, '#3a2e22');
  for (let k = 0; k < 14; k++) { const x = Math.floor(r() * 230); R(g, x, 8 + Math.floor(r() * 6), 8, 1, '#4b3a28'); }
  for (let k = 0; k < 12; k++) { const x = Math.floor(r() * 240); R(g, x, 18 + Math.floor(r() * 8), 1, 1, '#b46ad8'); }
  return { sky: SKIES.forest, far, mid, gr };
}

function buildMountain() {
  const r = rng(37);
  const [far, f] = mkCanvas(480, 128);
  let x = 0;
  while (x < 480) {
    const w = 40 + Math.floor(r() * 50), h = 40 + Math.floor(r() * 36);
    for (let i = 0; i < w; i++) { const t = 1 - Math.abs(i - w / 2) / (w / 2); const y = Math.round(100 - h * t); R(f, x + i, y, 1, 104 - y, '#2e2a36'); if (t > 0.82) R(f, x + i, y, 1, 3, '#cfcad8'); }
    x += Math.floor(w * 0.7);
  }
  const [mid, m] = mkCanvas(480, 128);
  for (let k = 0; k < 10; k++) { const bx = Math.floor(r() * 470), bw = 10 + Math.floor(r() * 18), bh = 6 + Math.floor(r() * 10); R(m, bx, 100 - bh, bw, bh, '#4a4550'); R(m, bx + 2, 100 - bh, bw - 4, 2, '#5c5764'); }
  for (let k = 0; k < 5; k++) { const px = Math.floor(r() * 470); R(m, px + 3, 80, 2, 20, '#3a2e22'); for (let i = 0; i < 4; i++) R(m, px + 1 - i, 66 + i * 4, 6 + i * 2, 4, '#24302c'); }
  const [gr, g] = mkCanvas(240, 28);
  R(g, 0, 0, 240, 28, '#3c3a3e'); R(g, 0, 0, 240, 2, '#4f4c54'); R(g, 0, 7, 240, 9, '#4a4648');
  for (let k = 0; k < 60; k++) R(g, Math.floor(r() * 240), Math.floor(r() * 28), 1, 1, '#5a5760');
  return { sky: SKIES.mountain, far, mid, gr };
}

function buildUnder(kind) {
  const r = rng(kind.length * 13);
  const pal = {
    cellar: { wall: '#3a302a', line: '#2a221e', floor: '#5a4632', fl: '#4a3a28' },
    cave:   { wall: '#2a2a22', line: '#1e1e18', floor: '#2f2a20', fl: '#3a3428' },
    mine:   { wall: '#2e2b30', line: '#222024', floor: '#3a3438', fl: '#2a2628' }
  }[kind];
  const [mid, m] = mkCanvas(480, 128);
  R(m, 0, 0, 480, 104, pal.wall);
  for (let y = 4; y < 104; y += 8) { R(m, 0, y, 480, 1, pal.line); for (let x = (y / 8) % 2 ? 0 : 8; x < 480; x += 16) R(m, x, y, 1, 8, pal.line); }
  if (kind === 'cellar') for (let x = 20; x < 480; x += 70) { R(m, x, 82, 14, 18, '#a8905a'); R(m, x + 2, 80, 10, 2, '#a8905a'); R(m, x + 5, 86, 4, 1, '#7a6440'); }
  if (kind === 'cave') for (let x = 0; x < 480; x += 13) { const h = 4 + Math.floor(r() * 18); R(m, x, 0, 2, h, '#4b3420'); R(m, x + 1, h, 1, 2, '#4b3420'); }
  if (kind === 'mine') for (let x = 30; x < 480; x += 80) { R(m, x, 20, 5, 84, '#6b4a2e'); R(m, x + 40, 20, 5, 84, '#6b4a2e'); R(m, x, 18, 45, 4, '#7a5634'); }
  const [gr, g] = mkCanvas(240, 28);
  R(g, 0, 0, 240, 28, pal.floor);
  for (let x = 0; x < 240; x += 12) R(g, x, 0, 1, 28, pal.fl);
  R(g, 0, 0, 240, 1, shade(pal.floor, 0.2));
  if (kind === 'mine') { R(g, 0, 10, 240, 1, '#8a8a90'); R(g, 0, 16, 240, 1, '#8a8a90'); for (let x = 2; x < 240; x += 8) R(g, x, 9, 3, 9, '#5e4630'); }
  return { under: true, wall: pal.wall, mid, gr };
}

function buildTown() {
  const r = rng(7);
  const [far, f] = mkCanvas(240, 128);
  for (let k = 0; k < 40; k++) R(f, Math.floor(r() * 240), Math.floor(r() * 50), 1, 1, r() > 0.7 ? '#e8e2d0' : '#8a90b0');
  let x = 0;
  while (x < 240) { const w = 18 + Math.floor(r() * 22), h = 30 + Math.floor(r() * 30); R(f, x, 100 - h, w, h, '#0a0e1a'); R(f, x + 3, 96 - h, w - 6, 4, '#0a0e1a'); for (let i = 0; i < 3; i++) if (r() > 0.5) R(f, x + 4 + Math.floor(r() * (w - 8)), 100 - h + 6 + Math.floor(r() * (h - 16)), 2, 3, '#e8b84a'); x += w + 2; }
  const [mid, m] = mkCanvas(240, 128);
  // 우리 상단 건물
  R(m, 82, 54, 76, 46, '#4a3a2e'); R(m, 76, 48, 88, 7, '#2e2220'); R(m, 80, 44, 80, 4, '#3a2a24');
  R(m, 112, 72, 16, 28, '#2a1d14'); R(m, 114, 74, 12, 26, '#5e4630'); R(m, 124, 86, 1, 2, '#e8b84a');
  R(m, 88, 66, 18, 14, '#e8b84a'); R(m, 88, 72, 18, 1, '#4a3a2e'); R(m, 96, 66, 1, 14, '#4a3a2e');
  R(m, 134, 66, 18, 14, '#d89a3a'); R(m, 134, 72, 18, 1, '#4a3a2e'); R(m, 142, 66, 1, 14, '#4a3a2e');
  R(m, 104, 57, 32, 9, '#7a5634'); R(m, 105, 58, 30, 7, '#8a6a44'); R(m, 118, 59, 4, 4, '#f0c24a'); R(m, 119, 60, 2, 2, '#c99a2a');
  // 이웃 건물과 골목
  R(m, 20, 60, 56, 40, '#2e2a2c'); R(m, 14, 56, 66, 5, '#1e1a1c'); R(m, 30, 70, 10, 12, '#3a2420'); R(m, 54, 72, 12, 28, '#1a1416');
  R(m, 166, 58, 60, 42, '#2a2830'); R(m, 160, 54, 72, 5, '#1c1a20'); R(m, 176, 68, 12, 10, '#5a4a2a'); R(m, 204, 70, 12, 30, '#16141a');
  const [gr, g] = mkCanvas(240, 28);
  R(g, 0, 0, 240, 28, '#33333a');
  for (let y = 0; y < 28; y += 5) { R(g, 0, y, 240, 1, '#26262c'); for (let x = (y / 5) % 2 ? 0 : 5; x < 240; x += 10) R(g, x, y, 1, 5, '#26262c'); }
  R(g, 150, 14, 30, 4, '#22304a'); R(g, 154, 13, 22, 1, '#22304a'); R(g, 158, 15, 6, 1, '#4a6a9a');
  return { sky: SKIES.town, far, mid, gr, town: true };
}

function getBg(id) {
  if (BG[id]) return BG[id];
  const make = { plains: buildPlains, forest: buildForest, mountain: buildMountain, town: buildTown,
    cellar: () => buildUnder('cellar'), cave: () => buildUnder('cave'), mine: () => buildUnder('mine') }[id] || buildPlains;
  return (BG[id] = make());
}

function tile(ctx, img, off, y) {
  const w = img.width, s = ((Math.floor(off) % w) + w) % w;
  ctx.drawImage(img, -s, y); ctx.drawImage(img, w - s, y);
}

function drawBg(ctx, id, scroll, t) {
  const b = getBg(id);
  if (b.under) {
    tile(ctx, b.mid, scroll * 0.6, 0);
    const tx = 120, off = ((scroll * 0.6) % tx + tx) % tx;
    for (let x = -off; x < VW + tx; x += tx) {
      const fl = Math.floor(t * 8 + x) % 3;
      R(ctx, Math.round(x + 40), 52, 2, 8, '#5e4630'); R(ctx, Math.round(x + 39), 49 - fl, 4, 3 + fl, '#f0a03a'); R(ctx, Math.round(x + 40), 48 - fl, 2, 2, '#f7e04a');
    }
    tile(ctx, b.gr, scroll, 100);
    return;
  }
  b.sky.forEach((c, i) => R(ctx, 0, i * 16, VW, 17, c));
  R(ctx, 0, 80, VW, 24, b.sky[b.sky.length - 1]);
  if (b.town) {
    ctx.drawImage(b.far, 0, 0); ctx.drawImage(b.mid, 0, 0);
    const fl = Math.floor(t * 5) % 2;
    R(ctx, 99, 60, 3, 4, fl ? '#f7c04a' : '#e8a03a'); R(ctx, 138, 60, 3, 4, fl ? '#e8a03a' : '#f7c04a');
    ctx.drawImage(b.gr, 0, 100);
    return;
  }
  tile(ctx, b.far, scroll * 0.15, 0);
  tile(ctx, b.mid, scroll * 0.5, 0);
  tile(ctx, b.gr, scroll, 100);
}
