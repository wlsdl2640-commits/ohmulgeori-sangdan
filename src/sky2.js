/* ───────── 빌드 31 풍경: 천둥 봉우리 · 천계의 유적 폐허 · 별의 정원 (+ 던전 셋은 buildUnder) ───────── */
Object.assign(DAY_SKY, {
  thunder:    ['#2a3048', '#4a5470', '#8a94b0'],
  ruins:      ['#c88a4a', '#f0c088', '#fff0d0'],
  stargarden: ['#1a1a4a', '#3a3a7a', '#8a7ac8']
});
TIER_COLORS.push('#ffe060', '#f0d890', '#c8c8ff');
Object.assign(UNDER_PAL, {
  spire:      { wall: '#2e3448', line: '#1e2234', floor: '#3a4058', fl: '#2a3046', torch: '#8ad8ff', dark: 0.3 },
  sanctum:    { wall: '#c8bea0', line: '#a89e80', floor: '#d8d0b8', fl: '#b8ae94', torch: '#ffe08a', dark: 0.12 },
  starthrone: { wall: '#1e1e40', line: '#141430', floor: '#2a2a54', fl: '#1e1e44', torch: '#c8c8ff', dark: 0.34 }
});
Object.assign(UNDER_DECOR, {
  // 뇌신의 첨탑: 구리 코일, 번개 기둥 사이의 아크, 쇠 계단
  spire: (m, r) => {
    for (let x = 30; x < 480; x += 90) { R(m, x, 20, 8, 80, '#4a5068'); R(m, x + 1, 20, 2, 80, '#6a7088'); for (let y = 26; y < 96; y += 6) R(m, x - 2, y, 12, 2, '#b8743a'); R(m, x - 3, 16, 14, 5, '#3a3e54'); R(m, x + 2, 12, 4, 4, '#8ad8ff'); }
    for (let x = 30; x < 400; x += 180) { let y = 30; for (let i = 0; i < 18; i++) { const px = x + 10 + i * 4.4, py = y + (i % 2 ? 4 : -3); R(m, Math.round(px), Math.round(py), 4, 1, i % 3 ? '#c8e8ff' : '#ffffff'); } }
    for (let i = 0; i < 30; i++) R(m, Math.floor(r() * 480), 10 + Math.floor(r() * 80), 1, 1, '#8ad8ff');
    for (let x = 0; x < 480; x += 32) { R(m, x, 100, 20, 2, '#4a5068'); R(m, x + 2, 98, 16, 2, '#5a6078'); }
  },
  // 무너진 천계의 성소: 부러진 기둥, 쓰러진 천사상, 갈라진 천장에서 드는 빛줄기
  sanctum: (m, r) => {
    for (let x = 18; x < 480; x += 64) { const h = 40 + Math.floor(r() * 50); R(m, x, 104 - h, 12, h, '#f0e8d0'); R(m, x + 9, 104 - h, 3, h, '#c8bea0'); R(m, x - 2, 104 - h - 2, 16, 3, '#e8e0c8'); for (let i = 0; i < 4; i++) R(m, x + 2 + i * 2, 106 - h - 4 - (i % 2) * 2, 2, 2, '#e8e0c8'); R(m, x + 3, 104 - h + 6, 6, 1, '#f0c24a'); }
    for (let x = 0; x < 480; x += 150) { for (let i = 0; i < 60; i++) R(m, x + 40 + Math.round(i * 0.4), i, 12, 1, `rgba(255,248,210,${(0.22 - i * 0.003).toFixed(3)})`); }
    for (let x = 70; x < 480; x += 170) { R(m, x, 92, 26, 8, '#e0d8c0'); R(m, x + 2, 90, 8, 4, '#e8e0c8'); R(m, x + 20, 86, 10, 6, '#f0e8d0'); R(m, x + 24, 84, 4, 2, '#f0c24a'); R(m, x - 6, 94, 8, 6, '#d0c8b0'); }
    for (let i = 0; i < 20; i++) { const x = Math.floor(r() * 476); R(m, x, 98 + Math.floor(r() * 3), 3, 2, '#b8ae94'); }
    for (let x = 0; x < 480; x += 9) if (r() < 0.25) { R(m, x, 60 + Math.floor(r() * 30), 1, 6 + Math.floor(r() * 8), '#6a9a5a'); }
  },
  // 별의 왕좌: 별자리 무늬 벽, 빛나는 계단, 별빛 휘장
  starthrone: (m, r) => {
    for (let i = 0; i < 70; i++) { const x = Math.floor(r() * 480), y = 4 + Math.floor(r() * 90), b = r(); R(m, x, y, 1, 1, b < 0.2 ? '#ffffff' : b < 0.6 ? '#c8c8ff' : '#8a8ad8'); }
    for (let k = 0; k < 6; k++) { const pts = []; for (let i = 0; i < 4; i++) pts.push([k * 80 + 10 + Math.floor(r() * 60), 14 + Math.floor(r() * 50)]); for (let i = 0; i < 3; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = 12; for (let j = 0; j <= n; j++) R(m, Math.round(x0 + (x1 - x0) * j / n), Math.round(y0 + (y1 - y0) * j / n), 1, 1, 'rgba(200,200,255,0.45)'); } pts.forEach(([x, y]) => { R(m, x - 1, y, 3, 1, '#ffffff'); R(m, x, y - 1, 1, 3, '#ffffff'); }); }
    for (let x = 40; x < 480; x += 120) { R(m, x, 10, 16, 70, '#3a2a6a'); R(m, x + 2, 10, 2, 70, '#5a4a8a'); R(m, x, 80, 16, 3, '#f0d890'); for (let i = 0; i < 5; i++) R(m, x + 3 + i * 2, 83, 1, 3 + (i % 2) * 2, '#f0d890'); }
    for (let i = 0; i < 4; i++) R(m, 0, 92 + i * 3, 480, 2, i % 2 ? '#3a3a6a' : '#4a4a7a');
  }
});

/* ───────── 천둥 봉우리: 먹구름 아래 번개 치는 바위 봉우리와 푸른 수정 ───────── */
function buildThunder() {
  const r = rng(421);
  const [back, b] = mkCanvas(480, 128);
  for (let i = 0; i < 18; i++) { const x = Math.floor(r() * 480), y = 8 + Math.floor(r() * 30), w = 30 + Math.floor(r() * 40); ell(b, x, y, w, 7, i % 2 ? '#3a4058' : '#2e3448'); ell(b, x - 8, y + 4, Math.round(w * 0.6), 4, '#262a3c'); }
  peaks(b, 480, 92, 36, 70, r, '#3a4058', '#8a94b0', '#2a3044');
  const [far, f] = mkCanvas(480, 128);
  for (let x = 10; x < 480; x += 60 + Math.floor(r() * 40)) { const h = 30 + Math.floor(r() * 30), w = 12 + Math.floor(r() * 10); for (let i = 0; i < h; i++) { const ww = Math.max(2, Math.round(w * (i / h))); R(f, x - ww, 96 - h + i, ww * 2, 1, i % 6 ? '#4a5068' : '#5a6078'); } R(f, x - 1, 96 - h - 6, 2, 6, '#b8743a'); R(f, x - 2, 96 - h - 8, 4, 2, '#8ad8ff'); }
  ridge(f, 480, 96, 4, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 8, 40, '#3a4058', '#4a5068');
  const [mid, m] = mkCanvas(480, 128);
  const crys = [];
  for (let k = 0; k < 9; k++) rock(m, Math.floor(r() * 460), 101, 12 + Math.floor(r() * 14), 8 + Math.floor(r() * 10), '#4a5068');
  for (let x = 24; x < 480; x += 70 + Math.floor(r() * 40)) { const h = 10 + Math.floor(r() * 10); for (let i = 0; i < h; i++) R(m, x - Math.round((h - i) / 4), 101 - i, Math.max(1, Math.round((h - i) / 2)), 1, i % 3 ? '#6ab8f0' : '#a8e0ff'); R(m, x + 4, 101 - Math.round(h * 0.6), 2, Math.round(h * 0.6), '#4a8ac8'); crys.push([x, 101 - h]); }
  for (let x = 60; x < 480; x += 150) { R(m, x, 66, 4, 35, '#3a3e54'); R(m, x + 1, 66, 1, 35, '#5a6078'); for (let y = 70; y < 98; y += 5) R(m, x - 1, y, 6, 2, '#b8743a'); R(m, x - 2, 62, 8, 4, '#2a2e40'); }
  for (let x = 4; x < 480; x += 13) if (r() < 0.4) tuft(m, x, 101, '#4a6a6a');
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#3a4054'); R(g, 0, 0, 480, 2, '#4a5068'); R(g, 0, 0, 480, 1, '#5a6078');
  for (let y = 5; y < 28; y += 6) for (let x = (y * 7) % 17; x < 480; x += 23) { R(g, x, y, 8 + (x % 4), 1, '#2a3040'); R(g, x + 5, y + 1, 1, 3, '#2a3040'); }
  for (let k = 0; k < 24; k++) { const x = Math.floor(r() * 476), y = 4 + Math.floor(r() * 22); R(g, x, y, 3, 1, '#ffe060'); R(g, x + 2, y + 1, 2, 1, '#ffe060'); }
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 12; x < 480; x += 55 + Math.floor(r() * 40)) { rock(fo, x, 28, 10, 6, '#2a3044'); if (r() < 0.5) { R(fo, x + 14, 20, 2, 8, '#6ab8f0'); R(fo, x + 13, 22, 1, 6, '#a8e0ff'); } }
  return { back, far, mid, gr, fore, clouds: 6, ambient: 'wind',
    ambientFn(g2, scroll, t, T, oy, wrap) {
      const n = Math.floor(t / 6.5), ph = t - n * 6.5;
      if (ph < 0.35) {
        const bx = wrap(n * 97 + 40, VW - 40) + 20;
        if (ph < 0.12 || (ph > 0.2 && ph < 0.27)) R(g2, 0, 0, VW, 104, 'rgba(230,240,255,0.22)');
        let x = bx, y = 0; for (let i = 0; i < 10; i++) { const nx = x + ((n * 7 + i * 13) % 9) - 4; for (let k = 0; k < 9; k++) R(g2, Math.round(x + (nx - x) * k / 9), y + k, 2, 1, i % 3 ? '#fff8c0' : '#ffffff'); x = nx; y += 9; }
      }
    },
    emit(g2, off, t, dark) { for (const [cx, cy] of crys) { const x = ((cx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -8 && xx < VW + 8) { const a = 0.35 + 0.3 * Math.sin(t * 2 + cx); R(g2, Math.round(xx), cy + 2, 2, 2, `rgba(200,240,255,${a.toFixed(2)})`); } } },
    lights(off, dark) { if (dark < 0.08) return []; const out = []; for (const [cx, cy] of crys) { const x = ((cx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx + 1, y: cy + 6, r: 18, c: '#8ad8ff', glow: 1 }); } return out; } };
}

/* ───────── 천계의 유적 폐허: 노을빛 하늘 아래 무너진 흰 도시 ───────── */
function buildRuins() {
  const r = rng(451);
  const [back, b] = mkCanvas(480, 128);
  for (let i = 0; i < 12; i++) { const x = Math.floor(r() * 480), y = 70 + Math.floor(r() * 26), w = 24 + Math.floor(r() * 30); ell(b, x, y, w, 5, '#fff0d8'); ell(b, x - 6, y - 3, Math.round(w * 0.5), 3, '#ffffff'); }
  for (const [ax, ay] of [[90, 52], [330, 46]]) { R(b, ax, ay, 6, 34, '#e8dcc0'); R(b, ax + 40, ay, 6, 34, '#e8dcc0'); for (let i = 0; i <= 20; i++) { const yy = ay - Math.round(Math.sin(Math.PI * i / 20) * 14); R(b, ax + 2 + i * 2, yy, 3, 4, '#e8dcc0'); } }
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 96, 3, Math.PI * 2 / 480 * 2, Math.PI * 2 / 480 * 6, 70, '#e0d0b0', '#f0e4c8');
  for (let x = 6; x < 480; x += 24 + Math.floor(r() * 18)) { const h = 14 + Math.floor(r() * 22); R(f, x, 96 - h, 6, h, '#e8dcc0'); R(f, x + 4, 96 - h, 2, h, '#c8b898'); if (r() < 0.6) R(f, x - 1, 95 - h, 8, 2, '#f0e8d0'); }
  const [mid, m] = mkCanvas(480, 128);
  for (let x = 0; x < 480; x += 8) R(m, x, 98, 7, 3, x % 16 ? '#d8ccb0' : '#e8dcc0');
  for (let x = 30; x < 480; x += 110 + Math.floor(r() * 40)) { const h = 28 + Math.floor(r() * 24); R(m, x, 98 - h, 10, h, '#f4ecd8'); R(m, x + 7, 98 - h, 3, h, '#c8bca0'); R(m, x - 2, 98 - h - 3, 14, 3, '#fff8e8'); for (let y = 98 - h + 6; y < 96; y += 8) R(m, x + 2, y, 1, 4, '#d8ccb0'); R(m, x + 2, 98 - h - 1, 6, 1, '#f0c24a'); if (r() < 0.6) for (let i = 0; i < 10; i++) R(m, x + (i % 3) * 3, 98 - h + 4 + i * 3, 2, 2, '#6a9a5a'); }
  for (let x = 80; x < 480; x += 160) { R(m, x, 90, 30, 8, '#ece4d0'); R(m, x + 2, 88, 26, 2, '#f8f0e0'); R(m, x + 4, 92, 1, 6, '#c8bca0'); R(m, x + 14, 92, 1, 6, '#c8bca0'); R(m, x + 34, 94, 8, 4, '#e0d8c0'); R(m, x - 8, 92, 6, 6, '#d8d0b8'); }
  for (let x = 120; x < 480; x += 240) { R(m, x, 64, 14, 30, '#f0e8d4'); R(m, x + 2, 58, 10, 7, '#f0e8d4'); R(m, x + 4, 60, 2, 2, '#a89a7a'); R(m, x + 8, 60, 2, 2, '#a89a7a'); R(m, x - 8, 66, 9, 3, '#f8f0e0'); R(m, x + 13, 66, 9, 3, '#f8f0e0'); R(m, x - 10, 64, 4, 2, '#fff8e8'); R(m, x + 20, 64, 4, 2, '#fff8e8'); R(m, x + 3, 54, 8, 2, '#f0c24a'); }
  for (let x = 4; x < 480; x += 11) if (r() < 0.45) tuft(m, x, 98, '#6a9a4a');
  for (let k = 0; k < 8; k++) flower(m, Math.floor(r() * 476), 98, ['#ffffff', '#f0c24a'][k % 2]);
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#d8ccb0'); R(g, 0, 0, 480, 1, '#f0e8d0');
  for (let x = 0; x < 480; x += 16) R(g, x, 0, 1, 28, '#b8ac90'); for (let y = 7; y < 28; y += 7) R(g, 0, y, 480, 1, '#b8ac90');
  for (let x = 8; x < 480; x += 48) { R(g, x, 10, 8, 1, '#f0c24a'); R(g, x + 3, 8, 2, 5, '#f0c24a'); }
  for (let k = 0; k < 30; k++) { const x = Math.floor(r() * 476), y = Math.floor(r() * 26); R(g, x, y, 1 + Math.floor(r() * 4), 1, '#a89c80'); }
  for (let k = 0; k < 40; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 1, 2, '#6a9a4a');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 10; x < 480; x += 60 + Math.floor(r() * 40)) { R(fo, x, 18, 14, 10, '#e8dcc0'); R(fo, x + 10, 18, 4, 10, '#c8bca0'); R(fo, x - 2, 16, 18, 3, '#f8f0e0'); if (r() < 0.5) tuft(fo, x + 18, 28, '#5a8a3c'); }
  return { back, far, mid, gr, fore, clouds: 4, ambient: 'dust',
    ambientFn(g2, scroll, t, T, oy, wrap) { for (let i = 0; i < 6; i++) { const x = wrap(i * 67 + Math.sin(t * 0.6 + i) * 16 - scroll * 0.4, VW), y = wrap(i * 29 + t * (5 + i % 3), 104), sw = Math.sin(t * 2 + i) > 0 ? 1 : 0; R(g2, Math.round(x), Math.round(y), 3, 1, '#ffffff'); R(g2, Math.round(x) + sw, Math.round(y) + 1, 2, 1, '#e8e0f0'); } }
  };
}

/* ───────── 별의 정원: 성운 아래 별꽃이 피는 정원 ───────── */
function buildStargarden() {
  const r = rng(481);
  const [back, b] = mkCanvas(480, 128);
  for (let i = 0; i < 10; i++) { const x = Math.floor(r() * 480), y = 20 + Math.floor(r() * 50), w = 30 + Math.floor(r() * 40); ell(b, x, y, w, 8, 'rgba(176,128,224,0.16)'); ell(b, x + 8, y + 2, Math.round(w * 0.6), 5, 'rgba(255,160,220,0.12)'); }
  for (let i = 0; i < 140; i++) { const x = Math.floor(r() * 480), y = Math.floor(r() * 90), k = r(); R(b, x, y, 1, 1, k < 0.15 ? '#ffffff' : k < 0.5 ? '#d8d8ff' : 'rgba(200,200,255,0.6)'); if (k < 0.05) { R(b, x - 1, y, 3, 1, '#ffffff'); R(b, x, y - 1, 1, 3, '#ffffff'); } }
  disc(b, 380, 34, 16, '#c8c0f0'); disc(b, 380, 34, 14, '#d8d0ff'); R(b, 372, 30, 5, 3, '#b8b0e0'); R(b, 384, 38, 4, 2, '#b8b0e0'); for (let i = -24; i <= 24; i++) R(b, 380 + i, 34 + Math.round(i * 0.25), 1, 1, 'rgba(255,240,200,0.6)');
  const [far, f] = mkCanvas(480, 128);
  for (const [ix, iy, iw] of [[60, 74, 26], [220, 66, 20], [400, 78, 30]]) { for (let i = 0; i < 10; i++) R(f, ix - iw + i, iy + 2 + i, iw * 2 - i * 2, 1, '#2a2a5a'); ell(f, ix, iy, iw, 4, '#3a3a7a'); for (let k = 0; k < 4; k++) { const tx = ix - iw + 8 + k * Math.round(iw / 2); R(f, tx, iy - 8, 1, 8, '#4a4a8a'); ell(f, tx, iy - 10, 4, 3, '#5a4a9a'); R(f, tx, iy - 11, 1, 1, '#fff0a0'); } }
  ridge(f, 480, 97, 3, Math.PI * 2 / 480 * 2, Math.PI * 2 / 480 * 7, 90, '#2a2a5a', '#3a3a6a');
  const [mid, m] = mkCanvas(480, 128);
  const blooms = [];
  for (let x = 0; x < 480; x++) R(m, x, 95, 1, 7, x % 5 ? '#3a3a7a' : '#4a4a8a');
  for (let x = 30; x < 480; x += 100 + Math.floor(r() * 40)) { R(m, x, 64, 4, 32, '#4a3a6a'); R(m, x + 1, 64, 1, 32, '#6a5a8a'); ell(m, x + 2, 60, 16, 9, '#4a3a8a'); ell(m, x - 2, 57, 10, 6, '#5a4a9a'); for (let i = 0; i < 8; i++) { const bx = x - 12 + Math.floor(r() * 28), by = 52 + Math.floor(r() * 14); R(m, bx, by, 2, 2, '#fff0a0'); blooms.push([bx, by]); } }
  for (let k = 0; k < 18; k++) { const bx = Math.floor(r() * 474); R(m, bx, 90, 1, 6, '#5a6aa8'); R(m, bx - 1, 88, 3, 3, '#fff8c0'); R(m, bx, 89, 1, 1, '#ffffff'); if (k % 3 === 0) blooms.push([bx - 1, 88]); }
  for (let x = 0; x < 480; x += 6) if (r() < 0.5) R(m, x, 93, 2, 1, '#8a8ad8');
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#2a2a5a'); R(g, 0, 0, 480, 3, '#3a3a7a'); R(g, 0, 0, 480, 1, '#5a5aa0');
  R(g, 0, 9, 480, 7, '#4a4a8a'); R(g, 0, 9, 480, 1, '#6a6ab8'); for (let x = 0; x < 480; x += 10) R(g, x + 4, 12, 2, 1, '#c8c8ff');
  for (let k = 0; k < 50; k++) R(g, Math.floor(r() * 480), 17 + Math.floor(r() * 10), 1, 1, k % 4 ? '#8a8ad8' : '#fff0a0');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 8; x < 480; x += 40 + Math.floor(r() * 30)) { R(fo, x, 20, 1, 8, '#4a5a98'); R(fo, x - 1, 18, 3, 3, '#fff0a0'); R(fo, x, 19, 1, 1, '#ffffff'); if (r() < 0.5) { R(fo, x + 6, 22, 1, 6, '#4a5a98'); R(fo, x + 5, 20, 3, 2, '#c8c8ff'); } }
  return { back, far, mid, gr, fore, clouds: 0, ambient: 'dust',
    ambientFn(g2, scroll, t, T, oy, wrap) {
      for (let i = 0; i < 14; i++) { const x = wrap(i * 41 + Math.sin(t * 0.5 + i) * 12 - scroll * 0.6, VW), y = 30 + wrap(i * 23 - t * (3 + i % 4), 70), on = Math.sin(t * 3 + i * 1.3) > -0.2; if (on) R(g2, Math.round(x), Math.round(y), 1, 1, i % 3 ? '#fff0a0' : '#c8c8ff'); }
      const k = (t * 0.13) % 1; if (k < 0.08) { const sx = VW * (1 - k / 0.08) , sy = 10 + k * 200; for (let i = 0; i < 10; i++) R(g2, Math.round(sx + i * 2), Math.round(sy - i), 2, 1, `rgba(255,255,255,${(0.8 - i * 0.08).toFixed(2)})`); }
    },
    emit(g2, off, t, dark) { for (const [bx, by] of blooms) { const x = ((bx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -4 && xx < VW + 4) { const a = 0.3 + 0.35 * Math.sin(t * 2.2 + bx * 0.7); if (a > 0.1) R(g2, Math.round(xx) - 1, by - 1, 4, 4, `rgba(255,240,160,${(a * 0.5).toFixed(2)})`); } } },
    lights(off, dark) { const out = []; for (const [bx, by] of blooms) { if (bx % 3) continue; const x = ((bx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx + 1, y: by + 1, r: 14, c: '#fff0a0', glow: 1 }); } return out; } };
}
Object.assign(BG_MAKERS, { thunder: buildThunder, ruins: buildRuins, stargarden: buildStargarden,
  spire: () => buildUnder('spire'), sanctum: () => buildUnder('sanctum'), starthrone: () => buildUnder('starthrone') });
