/* ───────── 빌드 30 풍경: 안개 묘지 · 용암 화산 · 세계수 뿌리 · 구름섬 (+ 던전 다섯은 buildUnder) ───────── */
Object.assign(DAY_SKY, {
  grave:   ['#4a4a62', '#7a7a92', '#b8b8c8'],
  volcano: ['#4a2a2a', '#8a5a4a', '#d8a078'],
  roots:   ['#2a3a2a', '#4a6a44', '#8aa878'],
  sky:     ['#3a7ae0', '#8ac4f4', '#e8f4ff']
});
TIER_COLORS.push('#9ab0d8', '#ff8a30', '#8ad87a', '#ffe8a0');
Object.assign(UNDER_PAL, {
  catacomb:    { wall: '#3a3a44', line: '#26262e', floor: '#4a4a52', fl: '#3a3a42', torch: '#8ad8ff', dark: 0.4 },
  crater:      { wall: '#3a1e18', line: '#24100c', floor: '#4a2a22', fl: '#3a1e18', torch: '#ff8a30', dark: 0.2 },
  heartwood:   { wall: '#3a2a1a', line: '#241a0e', floor: '#4a3a24', fl: '#3a2c1a', torch: '#8aff8a' },
  cloudtemple: { wall: '#c8d8ec', line: '#a0b4cc', floor: '#e0e8f4', fl: '#c4d0e0', torch: '#ffe08a', dark: 0.1 },
  vault:       { wall: '#4a3a22', line: '#2e2414', floor: '#6a5a3a', fl: '#5a4a2e', torch: '#f0c24a', dark: 0.24 }
});
Object.assign(UNDER_DECOR, {
  // 잊힌 지하 묘소: 벽감 속 관, 해골, 거미줄, 푸른 촛불
  catacomb: (m, r) => {
    for (let x = 20; x < 480; x += 60) { R(m, x, 24, 22, 30, '#1e1e26'); R(m, x + 2, 26, 18, 26, '#2a2a34'); R(m, x + 5, 34, 12, 14, '#5a4a3a'); R(m, x + 7, 36, 8, 2, '#8a7a5a'); R(m, x + 9, 40, 4, 1, '#8a7a5a'); if (r() < 0.5) { R(m, x + 8, 28, 6, 5, '#e8e0d0'); R(m, x + 9, 30, 1, 2, '#1e1e26'); R(m, x + 12, 30, 1, 2, '#1e1e26'); } }
    for (let x = 0; x < 480; x += 97) { for (let i = 0; i < 6; i++) R(m, x + i * 2, 4 + i * 3, 1, 1, '#8a8a9a'); for (let i = 0; i < 6; i++) R(m, x + 12 - i * 2, 4 + i * 3, 1, 1, '#8a8a9a'); }
    for (let x = 30; x < 480; x += 77) { R(m, x, 92, 8, 8, '#e8e0d0'); R(m, x + 2, 95, 1, 2, '#1e1e26'); R(m, x + 5, 95, 1, 2, '#1e1e26'); R(m, x + 10, 98, 10, 2, '#e8e0d0'); }
    for (let x = 0; x < 480; x += 19) R(m, x, 100 - (x % 4), 3, 1, 'rgba(180,200,230,0.25)');
  },
  // 불의 심장 화구: 용암 폭포, 흑요석 기둥, 불꽃
  crater: (m, r) => {
    for (let x = 60; x < 480; x += 140) { for (let i = 0; i < 70; i++) R(m, x + (i % 3), 20 + i, 4 - (i % 3), 1, i % 7 ? '#ff8a30' : '#ffd040'); ell(m, x + 2, 94, 10, 3, '#ff8a30'); ell(m, x + 2, 93, 6, 1, '#ffd040'); }
    for (let x = 20; x < 480; x += 100) { R(m, x, 30, 10, 74, '#141010'); R(m, x + 2, 30, 2, 74, '#2a2020'); R(m, x - 2, 26, 14, 4, '#1e1818'); }
    for (let i = 0; i < 30; i++) { const x = Math.floor(r() * 480), y = 20 + Math.floor(r() * 80); R(m, x, y, 1, 1, '#ff6a2a'); }
    for (let x = 0; x < 480; x += 23) R(m, x, 100 - (x % 3), 4, 1, '#ff6a2a');
  },
  // 세계수의 심장: 얽힌 뿌리, 빛나는 수액, 버섯
  heartwood: (m, r) => {
    for (let y = 0; y < 104; y += 16) for (let x = (y / 16) % 2 ? 0 : 20; x < 480; x += 40) { R(m, x, y + 4, 36, 3, '#5a4028'); R(m, x + 4, y + 7, 28, 2, '#4a3420'); R(m, x + 10, y + 1, 3, 10, '#6a4a2e'); }
    for (let x = 30; x < 480; x += 90) { for (let i = 0; i < 40; i++) R(m, x + Math.round(Math.sin(i * 0.5) * 3), 20 + i * 2, 2, 2, i % 5 ? '#8aff8a' : '#c8ffc0'); }
    for (let k = 0; k < 14; k++) { const bx = Math.floor(r() * 476); R(m, bx, 97, 1, 4, '#c8c0a0'); R(m, bx - 1, 96, 3, 2, r() < 0.5 ? '#6ad86a' : '#c8ff80'); }
    for (let x = 0; x < 480; x += 11) if (r() < 0.6) tuft(m, x, 101, '#3a8a3a');
  },
  // 구름 위 신전: 흰 기둥, 황금 장식, 구름 바닥
  cloudtemple: (m, r) => {
    for (let x = 24; x < 480; x += 72) { R(m, x, 14, 10, 90, '#f4f8ff'); R(m, x + 7, 14, 3, 90, '#b8c8dc'); R(m, x - 3, 10, 16, 5, '#f4f8ff'); R(m, x - 3, 100, 16, 4, '#d8e0ec'); R(m, x + 2, 12, 6, 1, '#f0c24a'); }
    R(m, 0, 10, 480, 3, '#f0c24a'); for (let x = 0; x < 480; x += 36) { R(m, x + 10, 4, 14, 6, '#e0e8f4'); R(m, x + 15, 2, 4, 2, '#f0c24a'); }
    for (let i = 0; i < 16; i++) { const x = Math.floor(r() * 480), y = 60 + Math.floor(r() * 40); ell(m, x, y, 10 + Math.floor(r() * 10), 2, 'rgba(255,255,255,0.5)'); }
    for (let x = 60; x < 480; x += 150) { R(m, x, 84, 20, 16, '#e8e4d8'); R(m, x + 4, 80, 12, 4, '#f0c24a'); R(m, x + 8, 76, 4, 4, '#ffffff'); }
  },
  // 보물고: 금화 더미, 상자, 보석
  vault: (m, r) => {
    for (let x = 16; x < 480; x += 68) { const w = 20 + Math.floor(r() * 14); for (let i = 0; i < 9; i++) R(m, x + i, 100 - i, w - i * 2, 1, i % 2 ? '#f0c24a' : '#d8a830'); R(m, x + 4, 92, 3, 1, '#fff2c0'); }
    for (let x = 48; x < 480; x += 120) { R(m, x, 86, 18, 12, '#8a6238'); R(m, x - 1, 84, 20, 3, '#a07848'); R(m, x + 8, 88, 2, 3, '#f0c24a'); R(m, x + 2, 86, 14, 1, '#6e4c2a'); }
    for (let i = 0; i < 14; i++) { const x = Math.floor(r() * 476), y = 30 + Math.floor(r() * 50); R(m, x, y, 2, 3, ['#6ab0ff', '#ff6a8a', '#8af08a', '#c87af0'][i % 4]); R(m, x, y, 1, 1, '#ffffff'); }
    for (let x = 90; x < 480; x += 150) { R(m, x, 20, 14, 30, '#2a1e10'); R(m, x + 2, 22, 10, 26, '#3a2a18'); for (let i = 0; i < 5; i++) R(m, x + 3 + i * 2, 24 + (i % 2) * 10, 1, 8, ['#a8432f', '#3f6a9a', '#4f8a43', '#c08a3a', '#6a4a8a'][i]); }
  }
});

/* ───────── 안개 묘지: 유령 숲과 비석, 떠도는 도깨비불 ───────── */
function buildGrave() {
  const r = rng(301);
  const [back, b] = mkCanvas(480, 128);
  ridge(b, 480, 84, 6, Math.PI * 2 / 480 * 2, Math.PI * 2 / 480 * 5, 20, '#4a4a5e', '#5a5a6e');
  for (let x = 6; x < 480; x += 16 + Math.floor(r() * 14)) { const h = 16 + Math.floor(r() * 14); R(b, x, 88 - h, 2, h + 4, '#3a3a4a'); R(b, x - 4, 92 - h, 4, 1, '#3a3a4a'); R(b, x + 2, 95 - h, 5, 1, '#3a3a4a'); }
  for (let y = 78; y < 98; y += 3) R(b, 0, y, 480, 1, 'rgba(200,205,230,0.2)');
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 93, 4, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 7, 50, '#3a3a48', '#4a4a58');
  for (let x = 0; x < 480; x += 6) { R(f, x, 86, 1, 10, '#2a2a34'); } R(f, 0, 88, 480, 1, '#3a3a44'); R(f, 0, 94, 480, 1, '#3a3a44');
  const [mid, m] = mkCanvas(480, 128);
  const wisps = [];
  for (let k = 0; k < 16; k++) { const sx = Math.floor(r() * 470), sh = 8 + Math.floor(r() * 7), sw = 5 + Math.floor(r() * 3); R(m, sx, 101 - sh, sw, sh, '#7a7a8a'); R(m, sx, 101 - sh, 1, sh, '#9a9aaa'); R(m, sx + 1, 100 - sh, sw - 2, 1, '#9a9aaa'); if (r() < 0.5) { R(m, sx + Math.floor(sw / 2), 98 - sh, 1, 4, '#9a9aaa'); R(m, sx + Math.floor(sw / 2) - 1, 97 - sh, 3, 1, '#9a9aaa'); } R(m, sx - 1, 100, sw + 2, 1, '#3a4a3a'); }
  for (let k = 0; k < 6; k++) { const tx = Math.floor(r() * 470), h = 22 + Math.floor(r() * 12); R(m, tx - 1, 101 - h, 3, h, '#1e1e26'); R(m, tx - 7, 101 - h + 4, 7, 1, '#1e1e26'); R(m, tx + 2, 101 - h + 2, 8, 1, '#1e1e26'); R(m, tx - 3, 101 - h - 5, 2, 6, '#1e1e26'); R(m, tx + 4, 101 - h - 3, 1, 4, '#1e1e26'); }
  for (let x = 40; x < 480; x += 130 + Math.floor(r() * 40)) { R(m, x, 70, 20, 30, '#4a4a56'); R(m, x + 2, 68, 16, 3, '#5a5a66'); R(m, x + 8, 80, 4, 20, '#1a1a22'); R(m, x + 4, 72, 3, 4, '#2a2a34'); R(m, x + 13, 72, 3, 4, '#2a2a34'); }
  for (let x = 30; x < 480; x += 70 + Math.floor(r() * 50)) wisps.push([x, 60 + Math.floor(r() * 24)]);
  for (let y = 90; y < 101; y += 2) for (let x = (y * 7) % 20; x < 480; x += 40) R(m, x, y, 14, 1, 'rgba(200,210,230,0.14)');
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#3a3a40'); R(g, 0, 0, 480, 1, '#4a5a4a');
  for (let k = 0; k < 40; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 3, 1, '#3a4a3a');
  for (let k = 0; k < 24; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 1, 1, '#5a5a66');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 10; x < 480; x += 50 + Math.floor(r() * 40)) { R(fo, x, 16, 7, 12, '#5a5a66'); R(fo, x, 16, 1, 12, '#7a7a86'); R(fo, x + 1, 15, 5, 1, '#7a7a86'); if (r() < 0.5) tuft(fo, x + 12, 28, '#3a5a3a'); }
  return { back, far, mid, gr, fore, clouds: 2, ambient: 'dust',
    ambientFn(g2, scroll, t, T, oy, wrap) { for (let y = 0; y < 3; y++) { const x = wrap(y * 90 - t * 6 - scroll * 0.3, VW + 120) - 60; R(g2, Math.round(x), 84 + y * 6, 60, 2, 'rgba(210,220,240,0.14)'); } },
    emit(g2, off, t, dark) { for (const [wx, wy] of wisps) { const x = ((wx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -8 && xx < VW + 8) { const bob = Math.sin(t * 2 + wx) * 3, a = 0.4 + dark * 0.6; R(g2, Math.round(xx + Math.sin(t * 0.7 + wx) * 6), Math.round(wy + bob), 3, 3, rgba('#8ae0ff', a)); R(g2, Math.round(xx + Math.sin(t * 0.7 + wx) * 6) + 1, Math.round(wy + bob) - 1, 1, 1, rgba('#ffffff', a)); } } },
    lights(off, dark) { if (dark < 0.1) return []; const out = []; for (const [wx, wy] of wisps) { const x = ((wx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx + 1, y: wy + 1, r: 20, c: '#8ae0ff', glow: 1 }); } return out; } };
}

/* ───────── 용암 화산: 검은 비탈과 흐르는 용암 ───────── */
function buildVolcano() {
  const r = rng(331);
  const [back, b] = mkCanvas(480, 128);
  peaks(b, 480, 90, 30, 60, r, '#3a2222', null, '#2e1a1a');
  for (let i = 0; i < 5; i++) { const vx = 50 + i * 100; R(b, vx - 3, 36, 6, 2, '#ff6a2a'); R(b, vx - 1, 30, 2, 6, '#ffb040'); for (let k = 0; k < 10; k++) R(b, vx - 6 + Math.floor(r() * 12), 20 + k * 2, 2, 1, 'rgba(90,70,70,0.5)'); }
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 92, 6, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 8, 30, '#4a2a26', '#5a3a32');
  for (let x = 0; x < 480; x += 9) R(f, x, 95 + (x % 3), 4, 1, '#3a1e1a');
  const [mid, m] = mkCanvas(480, 128);
  const lava = [];
  for (let x = 20; x < 480; x += 90 + Math.floor(r() * 60)) { const w = 16 + Math.floor(r() * 12); R(m, x, 99, w, 3, '#ff8a30'); R(m, x + 2, 98, w - 4, 1, '#ffd040'); R(m, x - 2, 101, w + 4, 1, '#a83a1a'); lava.push([x, w]); }
  for (let k = 0; k < 8; k++) rock(m, Math.floor(r() * 460), 101, 10 + Math.floor(r() * 12), 6 + Math.floor(r() * 8), '#3a2a2a');
  for (let x = 60; x < 480; x += 160) { for (let i = 0; i < 26; i++) R(m, x + Math.round(Math.sin(i * 0.4) * 2), 75 + i, 3, 1, i % 4 ? '#ff8a30' : '#ffd040'); R(m, x - 6, 70, 14, 6, '#2a1a1a'); }
  for (let k = 0; k < 10; k++) { const bx = Math.floor(r() * 470), h = 10 + Math.floor(r() * 8); R(m, bx, 101 - h, 2, h, '#1e1414'); R(m, bx - 3, 101 - h + 3, 3, 1, '#1e1414'); R(m, bx + 2, 101 - h + 1, 4, 1, '#1e1414'); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#3a2626'); R(g, 0, 0, 480, 1, '#5a3a32');
  for (let y = 4; y < 28; y += 6) for (let x = (y * 5) % 13; x < 480; x += 19) { R(g, x, y, 7 + (x % 3), 1, '#2a1818'); R(g, x + 4, y + 1, 1, 3, '#2a1818'); }
  for (let k = 0; k < 30; k++) R(g, Math.floor(r() * 480), Math.floor(r() * 28), 2, 1, '#ff6a2a');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 16; x < 480; x += 60 + Math.floor(r() * 40)) { rock(fo, x, 28, 9, 5, '#2a1e1e'); if (r() < 0.5) { R(fo, x + 12, 24, 6, 2, '#ff8a30'); R(fo, x + 14, 23, 2, 1, '#ffd040'); } }
  return { back, far, mid, gr, fore, clouds: 1, ambient: 'dust',
    ambientFn(g2, scroll, t, T, oy, wrap) { for (let i = 0; i < 16; i++) { const x = wrap(i * 31 + Math.sin(t * 0.8 + i) * 6 - scroll * 0.6, VW), y = wrap(104 - (t * (8 + (i % 4) * 4) + i * 23), 104); R(g2, Math.round(x), Math.round(y), 1, 1, i % 3 ? 'rgba(255,140,60,0.8)' : 'rgba(255,220,100,0.9)'); } },
    emit(g2, off, t, dark) { for (const [px, w] of lava) { const x = ((px - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -20 && xx < VW + 20) { const fl = Math.floor(t * 6 + px) % 2; R(g2, Math.round(xx + 2 + fl), 98, w - 4, 1, rgba('#ffe080', 0.5 + dark * 0.5)); } } },
    lights(off, dark) { const out = []; for (const [px, w] of lava) { const x = ((px - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx + w / 2, y: 100, r: 24, c: '#ff8a30', glow: 1 }); } return out; } };
}

/* ───────── 세계수 뿌리: 거대한 뿌리 사이의 땅속 숲 ───────── */
function buildRoots() {
  const r = rng(361);
  const [back, b] = mkCanvas(480, 128);
  R(b, 0, 0, 480, 104, '#2a3a2a');
  for (let x = 0; x < 480; x += 40) { R(b, x, 0, 10 + (x % 3) * 3, 104, '#3a2e1e'); R(b, x + 2, 0, 2, 104, '#4a3e2a'); }
  for (let y = 10; y < 100; y += 18) for (let x = (y / 18) % 2 ? 0 : 20; x < 480; x += 40) { R(b, x, y, 30, 3, '#3a2e1e'); R(b, x + 4, y + 3, 20, 2, '#2e2416'); }
  const [far, f] = mkCanvas(480, 128);
  ridge(f, 480, 92, 5, Math.PI * 2 / 480 * 3, Math.PI * 2 / 480 * 7, 60, '#3a5a3a', '#4a6a44');
  for (let x = 8; x < 480; x += 30 + Math.floor(r() * 20)) tree(f, x, 96, 10 + Math.floor(r() * 6), '#4a3420', '#3f7a3f', '#5a9a52', '#2e5a2e');
  const [mid, m] = mkCanvas(480, 128);
  const saps = [];
  for (let x = 30; x < 480; x += 110 + Math.floor(r() * 50)) { for (let i = 0; i < 60; i++) { const w = 6 + Math.floor(i / 10); R(m, x - w + Math.round(Math.sin(i * 0.3) * 3), 40 + i, w * 2, 1, i % 6 ? '#5a4028' : '#6a4a2e'); } R(m, x - 2, 38, 4, 4, '#8aff8a'); saps.push(x); }
  for (let k = 0; k < 10; k++) { const bx = Math.floor(r() * 476); R(m, bx, 96, 2, 5, '#c8c0a0'); R(m, bx - 2, 94, 6, 3, r() < 0.5 ? '#6ad86a' : '#c8ff80'); }
  for (let x = 4; x < 480; x += 9) if (r() < 0.7) tuft(m, x, 101, '#4f8a43');
  for (let k = 0; k < 6; k++) rock(m, Math.floor(r() * 460), 101, 8 + Math.floor(r() * 8), 4 + Math.floor(r() * 4), '#4a5a4a');
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#3a2e1e'); R(g, 0, 0, 480, 2, '#4f8a43'); R(g, 0, 0, 480, 1, '#6aa84f');
  for (let k = 0; k < 60; k++) R(g, Math.floor(r() * 480), 3 + Math.floor(r() * 24), 2 + Math.floor(r() * 3), 1, k % 2 ? '#4a3a26' : '#2e2416');
  for (let k = 0; k < 20; k++) R(g, Math.floor(r() * 480), 18 + Math.floor(r() * 8), 1, 1, '#8aff8a');
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 6; x < 480; x += 30 + Math.floor(r() * 30)) { R(fo, x, 12, 3, 16, '#4a3420'); R(fo, x - 4, 20, 4, 2, '#4a3420'); R(fo, x + 3, 17, 5, 2, '#4a3420'); if (r() < 0.5) tuft(fo, x + 10, 28, '#3f7a34'); }
  return { back, far, mid, gr, fore, clouds: 0, ambient: 'forest',
    emit(g2, off, t, dark) { for (const sx of saps) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -8 && xx < VW + 8) { const k = (t * 0.4 + sx) % 1; R(g2, Math.round(xx - 1), Math.round(40 + k * 50), 2, 3, rgba('#8aff8a', 0.5 + dark * 0.5)); } } },
    lights(off, dark) { if (dark < 0.1) return []; const out = []; for (const sx of saps) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -40 && xx < VW + 40) out.push({ x: xx, y: 60, r: 26, c: '#8aff8a', glow: 1 }); } return out; } };
}

/* ───────── 구름섬: 구름 위에 뜬 풀밭과 흰 돌기둥 ───────── */
function buildSky() {
  const r = rng(391);
  const [back, b] = mkCanvas(480, 128);
  for (let i = 0; i < 14; i++) { const x = Math.floor(r() * 480), y = 60 + Math.floor(r() * 36), w = 20 + Math.floor(r() * 30); ell(b, x, y, w, 5, '#e8f2fc'); ell(b, x - 6, y - 3, Math.round(w * 0.5), 4, '#ffffff'); }
  for (const [ix, iy, iw] of [[80, 70, 30], [300, 62, 26], [430, 76, 22]]) { for (let i = 0; i < 8; i++) R(b, ix - iw + i, iy + 2 + i, iw * 2 - i * 2, 1, '#8a8a9a'); ell(b, ix, iy, iw, 4, '#7ab85a'); }
  const [far, f] = mkCanvas(480, 128);
  for (let x = 0; x < 480; x += 7) { const h = 4 + Math.floor(r() * 6); ell(f, x, 100 + h, 9, 4, '#f4f8ff'); }
  R(f, 0, 100, 480, 4, '#f4f8ff');
  for (let x = 20; x < 480; x += 100 + Math.floor(r() * 40)) { R(f, x, 70, 8, 30, '#e8ecf4'); R(f, x + 6, 70, 2, 30, '#b8c4d4'); R(f, x - 2, 66, 12, 4, '#ffffff'); R(f, x - 2, 98, 12, 3, '#d8e0ec'); }
  const [mid, m] = mkCanvas(480, 128);
  for (let x = 0; x < 480; x++) R(m, x, 94, 1, 8, x % 4 ? '#7ab85a' : '#6aa84c');
  for (let x = 40; x < 480; x += 120 + Math.floor(r() * 40)) { R(m, x, 60, 10, 41, '#f4f8ff'); R(m, x + 8, 60, 2, 41, '#b8c4d4'); R(m, x - 3, 56, 16, 4, '#ffffff'); R(m, x + 2, 58, 6, 1, '#f0c24a'); }
  for (let k = 0; k < 8; k++) { const bx = Math.floor(r() * 470); ell(m, bx, 99, 6, 3, '#f4f8ff'); ell(m, bx - 3, 97, 4, 2, '#ffffff'); }
  for (let x = 6; x < 480; x += 14) if (r() < 0.5) tuft(m, x, 95, '#5a9a4a');
  for (let k = 0; k < 10; k++) flower(m, Math.floor(r() * 476), 95, ['#ffffff', '#f7e04a', '#9ad0ff'][k % 3]);
  const birds = [];
  for (let k = 0; k < 4; k++) birds.push([Math.floor(r() * 480), 20 + Math.floor(r() * 30)]);
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#5a9a4a'); R(g, 0, 0, 480, 3, '#7ab85a'); R(g, 0, 0, 480, 1, '#96d070');
  R(g, 0, 8, 480, 8, '#c8b890'); R(g, 0, 8, 480, 1, '#a89870'); R(g, 0, 15, 480, 1, '#a89870');
  for (let k = 0; k < 60; k++) R(g, Math.floor(r() * 480), 18 + Math.floor(r() * 8), 1, 2, '#6aa84c');
  for (let k = 0; k < 16; k++) R(g, Math.floor(r() * 480), 19 + Math.floor(r() * 7), 1, 1, ['#ffffff', '#f7e04a', '#9ad0ff'][k % 3]);
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 6; x < 480; x += 26 + Math.floor(r() * 26)) { ell(fo, x, 26, 8, 3, '#f4f8ff'); ell(fo, x - 4, 24, 5, 2, '#ffffff'); if (r() < 0.4) tuft(fo, x + 10, 28, '#4f8a3c'); }
  return { back, far, mid, gr, fore, clouds: 8, ambient: 'wind',
    ambientFn(g2, scroll, t, T, oy, wrap) { for (const [bx, by] of birds) { const x = wrap(bx + t * 12 - scroll * 0.2, VW + 60) - 30, y = by + Math.sin(t * 1.5 + bx) * 3, fl = Math.floor(t * 5 + bx) % 2; R(g2, Math.round(x) - 3, Math.round(y) - fl, 3, 1, '#ffffff'); R(g2, Math.round(x), Math.round(y), 1, 1, '#ffffff'); R(g2, Math.round(x) + 1, Math.round(y) - fl, 3, 1, '#ffffff'); } } };
}
Object.assign(BG_MAKERS, { grave: buildGrave, volcano: buildVolcano, roots: buildRoots, sky: buildSky,
  catacomb: () => buildUnder('catacomb'), crater: () => buildUnder('crater'), heartwood: () => buildUnder('heartwood'), cloudtemple: () => buildUnder('cloudtemple'), vault: () => buildUnder('vault') });
