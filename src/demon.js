/* ───────── 마계 풍경: 눅눅한 늪지대 · 메마른 땅 · 백작의 성 (+ 던전 셋은 buildUnder) ───────── */
Object.assign(DAY_SKY, {
  swamp:  ['#3a5a4a', '#6a8a6a', '#a8b890'],
  barren: ['#5a3a3a', '#9a6a4a', '#d8a878'],
  castle: ['#2a2238', '#4a3a5a', '#8a6a8a']
});

function buildSwamp() {
  const r = rng(131);
  const [back, b] = mkCanvas(480, 128);
  // 안개 낀 죽은 숲
  ridge(b, 480, 84, 6, Math.PI * 2 / 480 * 2, Math.PI * 2 / 480 * 5, 20, '#4a6a58', '#5a7a66');
  for (let x = 6; x < 480; x += 18 + Math.floor(r() * 16)) { const h = 18 + Math.floor(r() * 16); R(b, x, 88 - h, 2, h + 4, '#3a5444'); R(b, x - 4, 92 - h, 4, 1, '#3a5444'); R(b, x + 2, 95 - h, 5, 1, '#3a5444'); R(b, x - 2, 99 - h, 2, 1, '#3a5444'); }
  for (let y = 80; y < 96; y += 3) R(b, 0, y, 480, 1, 'rgba(180,200,180,0.18)');
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 93, 4, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 7, 50, '#3f5a44', '#4c6a50');
  for (let x = 0; x < 480; x += 5) { const h = 3 + ((x / 5) % 3); R(f, x, 93 - h, 1, h + 2, '#5a7a4a'); R(f, x + 2, 95 - h, 1, h, '#6a8a52'); }
  const [mid, m] = mkCanvas(480, 128);
  // 썩은 물웅덩이와 죽은 나무, 이끼, 버섯
  const pools = [];
  for (let x = 20; x < 480; x += 90 + Math.floor(r() * 50)) { const w = 24 + Math.floor(r() * 24); ell(m, x, 100, w, 3, '#2a4a3a'); ell(m, x, 99, w - 4, 2, '#3a6a4a'); R(m, x - w + 4, 98, w, 1, '#5a8a5a'); pools.push([x, w]); }
  for (let k = 0; k < 7; k++) { const tx = Math.floor(r() * 470), h = 20 + Math.floor(r() * 14); R(m, tx - 1, 101 - h, 3, h, '#3a2e22'); R(m, tx - 1, 101 - h, 1, h, '#2a2018'); R(m, tx - 6, 101 - h + 4, 6, 1, '#3a2e22'); R(m, tx + 2, 101 - h + 1, 7, 1, '#3a2e22'); R(m, tx - 3, 101 - h - 3, 2, 4, '#3a2e22'); for (let i = 0; i < 3; i++) R(m, tx + 1 + i * 2, 101 - h + 6 + i * 2, 1, 5 - i, '#5a8a4a'); }
  for (let k = 0; k < 12; k++) { const bx = Math.floor(r() * 476); R(m, bx, 97, 1, 4, '#c8c0a0'); R(m, bx - 1, 96, 3, 2, r() < 0.5 ? '#b46ad8' : '#7a3f98'); }
  for (let x = 4; x < 480; x += 11) if (r() < 0.6) tuft(m, x, 101, '#5a8a4a');
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#3a3a2a'); R(g, 0, 0, 480, 1, '#5a5a3a');
  for (let k = 0; k < 50; k++) { const x = Math.floor(r() * 476), y = 3 + Math.floor(r() * 24); ell(g, x, y, 3 + Math.floor(r() * 4), 1, '#2a3a30'); }
  for (let k = 0; k < 30; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 2, 1, '#4a5a3a');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 6; x < 480; x += 28 + Math.floor(r() * 30)) { for (let i = 0; i < 4; i++) R(fo, x + i * 3, 10 + (i % 2) * 4, 1, 18 - (i % 2) * 4, '#2e4a34'); R(fo, x + 3, 8, 2, 4, '#5a4a2a'); }
  return { back, far, mid, gr, fore, clouds: 3, ambient: 'dust',
    emit(g, off, t, dark) { if (dark < 0.15) return; for (const [px] of pools) { const x = ((px - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -20 && xx < VW + 20) { const k = (t * 0.5 + px) % 1; R(g, Math.round(xx + Math.sin(t + px) * 6), Math.round(92 - k * 14), 2, 2, rgba('#8af0a0', Math.min(1, dark * 1.6) * (1 - k))); } } },
    lights(off, dark) { if (dark < 0.15) return []; const out = []; for (const [px] of pools) { const x = ((px - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx, y: 90, r: 22, c: '#6ae08a', glow: 1 }); } return out; } };
}

function buildBarren() {
  const r = rng(151);
  const [back, b] = mkCanvas(480, 128);
  peaks(b, 480, 84, 18, 40, r, '#5a3a3a', null, '#4a2e2e');
  for (let i = 0; i < 4; i++) { const vx = 60 + i * 120; R(b, vx - 2, 50, 4, 2, '#e0603a'); R(b, vx - 1, 46, 2, 4, '#f0a040'); }
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 92, 6, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 8, 30, '#7a4a3a', '#8a5a44');
  for (let x = 0; x < 480; x += 7) R(f, x, 96 + (x % 3), 4, 1, '#6a3a2e');
  const [mid, m] = mkCanvas(480, 128);
  // 갈라진 땅, 죽은 나무, 뼈, 용암 틈
  const cracks = [];
  for (let x = 0; x < 480; x += 14 + Math.floor(r() * 10)) { R(m, x, 99, 6 + Math.floor(r() * 6), 1, '#4a2a22'); R(m, x + 3, 100, 1, 2, '#4a2a22'); }
  for (let x = 30; x < 480; x += 110 + Math.floor(r() * 60)) { const w = 10 + Math.floor(r() * 8); R(m, x, 100, w, 2, '#f08a30'); R(m, x + 2, 99, w - 4, 1, '#ffd060'); cracks.push([x, w]); }
  for (let k = 0; k < 5; k++) { const tx = Math.floor(r() * 470), h = 16 + Math.floor(r() * 12); R(m, tx, 101 - h, 2, h, '#2a1e1a'); R(m, tx - 5, 101 - h + 3, 5, 1, '#2a1e1a'); R(m, tx + 2, 101 - h + 1, 6, 1, '#2a1e1a'); R(m, tx - 2, 101 - h - 4, 1, 5, '#2a1e1a'); }
  for (let k = 0; k < 6; k++) { const bx = Math.floor(r() * 460); R(m, bx, 98, 10, 2, '#e8e0d0'); R(m, bx + 2, 95, 2, 3, '#e8e0d0'); R(m, bx + 6, 95, 2, 3, '#e8e0d0'); if (r() < 0.5) { R(m, bx + 12, 94, 6, 6, '#e8e0d0'); R(m, bx + 13, 96, 1, 2, '#2a1e1a'); R(m, bx + 16, 96, 1, 2, '#2a1e1a'); } }
  for (let k = 0; k < 6; k++) rock(m, Math.floor(r() * 460), 101, 10 + Math.floor(r() * 10), 6 + Math.floor(r() * 6), '#5a3a34');
  // 마족의 말뚝과 깃발
  for (let x = 80; x < 480; x += 200) { R(m, x, 70, 2, 31, '#3a2a2a'); R(m, x + 2, 70, 12, 8, '#6a1a1a'); R(m, x + 4, 72, 6, 4, '#c8a040'); R(m, x - 2, 68, 6, 3, '#e8e0d0'); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#6a4a3a'); R(g, 0, 0, 480, 1, '#8a6a4a');
  for (let y = 4; y < 28; y += 6) for (let x = (y * 5) % 13; x < 480; x += 19) { R(g, x, y, 7 + (x % 3), 1, '#4a2e26'); R(g, x + 4, y + 1, 1, 3, '#4a2e26'); }
  for (let k = 0; k < 40; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 1, 1, '#8a6a52');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 16; x < 480; x += 60 + Math.floor(r() * 40)) { if (r() < 0.5) rock(fo, x, 28, 9, 5, '#4a2e2a'); else { R(fo, x, 24, 8, 2, '#e8e0d0'); R(fo, x + 1, 22, 1, 2, '#e8e0d0'); } }
  return { back, far, mid, gr, fore, clouds: 1, ambient: 'sand',
    emit(g, off, t, dark) { for (const [px, w] of cracks) { const x = ((px - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -20 && xx < VW + 20) { const fl = Math.floor(t * 6 + px) % 2; R(g, Math.round(xx + 2 + fl), 99, w - 4, 1, rgba('#ffe080', 0.5 + dark * 0.5)); } } },
    lights(off, dark) { const out = []; for (const [px, w] of cracks) { const x = ((px - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx + w / 2, y: 100, r: 20, c: '#f08a30', glow: 1 }); } return out; } };
}

function buildCastle() {
  const r = rng(171);
  const [back, b] = mkCanvas(480, 128);
  // 멀리 검은 성
  ridge(b, 480, 90, 5, Math.PI * 2 / 480 * 2, Math.PI * 2 / 480 * 5, 40, '#2a2234', '#3a3044');
  const castle = (cx) => { R(b, cx - 30, 60, 60, 32, '#1e1a28'); for (const [tx, th, tw] of [[-30, 50, 10], [-10, 40, 8], [8, 56, 12], [24, 44, 8]]) { R(b, cx + tx, 92 - th, tw, th, '#1e1a28'); for (let i = 0; i < tw; i += 3) R(b, cx + tx + i, 90 - th, 2, 2, '#1e1a28'); for (let i = 0; i < 6; i++) R(b, cx + tx + Math.floor(tw / 2) - 3 + i, 86 - th - i, 1 + (6 - i) * 0, 1, '#2a2234'); R(b, cx + tx + Math.floor(tw / 2) - 3, 86 - th - 6, 6, 1, '#1e1a28'); R(b, cx + tx + Math.floor(tw / 2) - 2, 80 - th, 4, 6, '#2e2438'); R(b, cx + tx + Math.floor(tw / 2), 74 - th, 1, 6, '#1e1a28'); R(b, cx + tx + Math.floor(tw / 2) + 1, 74 - th, 3, 2, '#6a1a2a'); } };
  castle(300);
  const wins = [[282, 66], [292, 72], [312, 60], [322, 70], [272, 50], [309, 44]];
  for (const [wx, wy] of wins) R(b, wx, wy, 2, 3, '#141020');
  for (let i = 0; i < 6; i++) { const bx = 100 + i * 60, by = 30 + (i % 3) * 10; R(b, bx, by, 2, 1, '#141020'); R(b, bx - 2, by - 1, 2, 1, '#141020'); R(b, bx + 2, by - 1, 2, 1, '#141020'); }
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 94, 4, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 7, 60, '#2e2a3a', '#3a3446');
  for (let x = 4; x < 480; x += 16 + Math.floor(r() * 14)) { const h = 14 + Math.floor(r() * 12); R(f, x, 96 - h, 2, h, '#221e2c'); R(f, x - 4, 98 - h, 4, 1, '#221e2c'); R(f, x + 2, 100 - h, 5, 1, '#221e2c'); }
  const [mid, m] = mkCanvas(480, 128);
  // 묘지: 비석, 철책, 죽은 나무, 안개
  for (let x = 0; x < 480; x += 6) { R(m, x, 86, 1, 15, '#2a2630'); R(m, x, 84, 1, 2, '#3a3640'); } R(m, 0, 88, 480, 1, '#3a3640'); R(m, 0, 96, 480, 1, '#3a3640');
  for (let k = 0; k < 14; k++) { const sx = Math.floor(r() * 470), sh = 8 + Math.floor(r() * 6), sw = 5 + Math.floor(r() * 3); R(m, sx, 101 - sh, sw, sh, '#6a6a76'); R(m, sx, 101 - sh, 1, sh, '#8a8a96'); R(m, sx + 1, 100 - sh, sw - 2, 1, '#8a8a96'); if (r() < 0.5) { R(m, sx + Math.floor(sw / 2), 98 - sh, 1, 4, '#8a8a96'); R(m, sx + Math.floor(sw / 2) - 1, 97 - sh, 3, 1, '#8a8a96'); } R(m, sx - 1, 100, sw + 2, 1, '#3a4a30'); }
  for (let k = 0; k < 4; k++) { const tx = Math.floor(r() * 470), h = 22 + Math.floor(r() * 12); R(m, tx - 1, 101 - h, 3, h, '#1e1a22'); R(m, tx - 7, 101 - h + 4, 7, 1, '#1e1a22'); R(m, tx + 2, 101 - h + 2, 8, 1, '#1e1a22'); R(m, tx - 3, 101 - h - 5, 2, 6, '#1e1a22'); R(m, tx + 4, 101 - h - 3, 1, 4, '#1e1a22'); }
  for (let y = 90; y < 101; y += 2) for (let x = (y * 7) % 20; x < 480; x += 40) R(m, x, y, 14, 1, 'rgba(200,190,220,0.12)');
  const lamps = [];
  for (let x = 60; x < 480; x += 160) { R(m, x, 70, 2, 31, '#2a2630'); R(m, x - 2, 68, 6, 3, '#3a3640'); R(m, x - 1, 71, 4, 4, '#1a1620'); lamps.push(x); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#3a3444');
  for (let y = 0; y < 28; y += 5) { R(g, 0, y, 480, 1, '#2a2634'); for (let x = (y / 5) % 2 ? 0 : 5; x < 480; x += 10) { R(g, x, y, 1, 5, '#2a2634'); R(g, x + 1, y + 1, 8, 1, '#46405a'); } }
  for (let k = 0; k < 24; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 3, 1, '#3a4a30');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 10; x < 480; x += 50 + Math.floor(r() * 40)) { R(fo, x, 16, 7, 12, '#4a4a56'); R(fo, x, 16, 1, 12, '#6a6a76'); R(fo, x + 1, 15, 5, 1, '#6a6a76'); }
  return { back, far, mid, gr, fore, clouds: 2, ambient: 'dust',
    emit(g, off, t, dark) {
      if (dark < 0.12) return;
      const a = Math.min(1, dark * 1.7), fl = Math.floor(t * 5) % 2;
      for (const [wx, wy] of wins) { const x = ((wx - off * 0.25) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -4 && xx < VW + 4) R(g, Math.round(xx), wy, 2, 3, rgba(fl ? '#e04a3a' : '#c83a2a', a)); }
      for (const lx of lamps) { const x = ((lx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -6 && xx < VW + 6) R(g, Math.round(xx) - 1, 71, 4, 4, rgba(fl ? '#a8c8ff' : '#8ab0ff', a)); }
    },
    lights(off, dark) { if (dark < 0.12) return []; const out = []; for (const lx of lamps) { const x = ((lx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx + 1, y: 73, r: 28, c: '#8ab0ff', glow: 1 }); } return out; } };
}
const BG_MAKERS = { swamp: buildSwamp, barren: buildBarren, castle: buildCastle, hut: () => buildUnder('hut'), lab: () => buildUnder('lab'), torture: () => buildUnder('torture') };
