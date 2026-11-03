/* ───────── 숲·원시림·뒷골목 풍경 (무대 전체 높이 200) ─────────
   겹: back(아주 먼 것) · far · mid · gr(땅 띠 28) · fore. 발 디딤선 = GL. 가로 480으로 이어 붙는다 */
const SCN_H = AH, GL = GY + BG_OY;
const wrapX = (x, fn) => { fn(x); if (x < 80) fn(x + 480); if (x > 400) fn(x - 480); };
// 줄기: 나무껍질 결·옹이·밝은 쪽/그늘 쪽
function barkTrunk(g, x, top, base, w, pal, r, taper = 0) {
  const h = base - top;
  for (let y = top; y < base; y += 1) { const k = (y - top) / h, ww = Math.max(2, Math.round(w - taper * (1 - k))), xx = x + Math.round((w - ww) / 2); R(g, xx, y, ww, 1, pal.b); R(g, xx, y, Math.max(1, Math.round(ww * 0.18)), 1, pal.l); R(g, xx + ww - Math.max(1, Math.round(ww * 0.22)), y, Math.max(1, Math.round(ww * 0.22)), 1, pal.d); }
  for (let y = top + 3; y < base - 2; y += 3 + Math.floor(r() * 4)) { const k = (y - top) / h, ww = Math.max(2, Math.round(w - taper * (1 - k))), xx = x + Math.round((w - ww) / 2); R(g, xx + 1 + Math.floor(r() * Math.max(1, ww - 4)), y, 2 + Math.floor(r() * 3), 1, pal.d); }
  for (let i = 0; i < Math.max(1, Math.round(h / 40)); i++) { const ky = top + 8 + Math.floor(r() * Math.max(1, h - 16)), kx = x + 2 + Math.floor(r() * Math.max(1, w - 5)); ell(g, kx, ky, 2, 1, pal.d); R(g, kx, ky, 1, 1, pal.k); }
}
// 버팀뿌리: 밑동에서 양옆으로 퍼진다
function roots(g, x, base, w, len, pal) {
  for (let i = 1; i <= len; i++) { const hh = Math.max(1, Math.round((len - i) * 0.55)); R(g, x - i, base - hh, 1, hh, i % 3 ? pal.b : pal.d); R(g, x + w - 1 + i, base - hh, 1, hh, i % 3 ? pal.b : pal.d); }
  R(g, x - len, base - 1, w + len * 2, 1, pal.d);
}
// 잎 덩어리: 어두운 바탕 → 중간 → 밝은 윗면, 가장자리는 울퉁불퉁
function leafMass(g, cx, cy, rx, ry, pal, r) {
  for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; ell(g, Math.round(cx + Math.cos(a) * rx * 0.85), Math.round(cy + Math.sin(a) * ry * 0.85), Math.round(rx * 0.32) + 1, Math.round(ry * 0.36) + 1, pal.d); }
  ell(g, cx, cy, rx, ry, pal.d);
  ell(g, cx - Math.round(rx * 0.12), cy - Math.round(ry * 0.15), Math.round(rx * 0.82), Math.round(ry * 0.78), pal.m);
  ell(g, cx - Math.round(rx * 0.35), cy - Math.round(ry * 0.42), Math.round(rx * 0.42), Math.round(ry * 0.36), pal.l);
  for (let i = 0; i < Math.round(rx * ry / 18); i++) { const a = r() * Math.PI * 2, rr = Math.sqrt(r()); const px = Math.round(cx + Math.cos(a) * rx * rr), py = Math.round(cy + Math.sin(a) * ry * rr); R(g, px, py, 2, 1, r() < 0.5 ? pal.m : pal.l); }
}
function fern(g, x, y, c, cL, s = 1) {
  for (const a of [-1, -0.55, -0.2, 0.2, 0.55, 1]) { const len = Math.round((5 + 3 * (1 - Math.abs(a))) * s); for (let i = 1; i <= len; i++) { const px = x + Math.round(a * i * 0.9), py = y - Math.round(i * (1 - Math.abs(a) * 0.55)); R(g, px, py, 1, 1, i % 2 ? c : cL); if (i % 3 === 0) { R(g, px - 1, py, 1, 1, c); R(g, px + 1, py, 1, 1, c); } } }
}
function vine(g, x, y, len, c, cL, r) { for (let i = 0; i < len; i++) { const px = x + Math.round(Math.sin(i * 0.45) * 1.2); R(g, px, y + i, 1, 1, c); if (i % 4 === 2) { R(g, px - 1, y + i, 1, 1, cL); R(g, px + 1, y + i + 1, 1, 1, cL); } } R(g, x + Math.round(Math.sin(len * 0.45) * 1.2) - 1, y + len, 3, 1, cL); }
function mushroom(g, x, y, c, cL, cap = 3) { R(g, x, y - 2, 2, 3, '#e8dcc8'); R(g, x - cap + 1, y - 4, cap * 2, 2, c); R(g, x - cap + 2, y - 5, cap * 2 - 2, 1, cL); R(g, x, y - 4, 1, 1, cL); }
function logFallen(g, x, y, len, pal, r) { R(g, x, y - 6, len, 6, pal.b); R(g, x, y - 6, len, 1, pal.l); R(g, x, y - 2, len, 2, pal.d); for (let i = 3; i < len; i += 5 + Math.floor(r() * 4)) R(g, x + i, y - 5 + Math.floor(r() * 3), 3, 1, pal.d); ell(g, x + len, y - 3, 2, 3, pal.l); R(g, x + len, y - 3, 1, 1, pal.d); for (let i = 0; i < 3; i++) R(g, x + 4 + Math.floor(r() * (len - 8)), y - 7, 3, 1, '#4f8a43'); }

/* ── 숲 (2-1 ~ 2-20): 빽빽한 활엽수와 덤불 ── */
function buildForest() {
  const r = rng(23), B = { b: '#4a3828', l: '#6a5440', d: '#2e2218', k: '#1a120c' }, LD = { d: '#1c3a24', m: '#2a5a30', l: '#3f7a3a' }, LM = { d: '#24502e', m: '#357040', l: '#4f9a48' };
  const [back, b] = mkCanvas(480, SCN_H);
  R(b, 0, 0, 480, SCN_H, '#2a4a42');
  for (let x = 0; x < 480; x += 6) { const h = 90 + Math.floor(r() * 50); R(b, x, GL - h, 3, h, '#23403a'); ell(b, x + 1, GL - h - 6, 7, 9, '#23403a'); }
  for (let i = 0; i < 40; i++) ell(b, Math.floor(r() * 480), 30 + Math.floor(r() * 60), 16 + Math.floor(r() * 14), 10 + Math.floor(r() * 8), '#1f3a34');
  const [far, f] = mkCanvas(480, SCN_H);
  for (let x = 0; x < 480; x += 7 + Math.floor(r() * 6)) { const h = 70 + Math.floor(r() * 60), w = 3 + Math.floor(r() * 3); R(f, x, GL - h, w, h, '#283f36'); R(f, x, GL - h, 1, h, '#324a40'); leafMass(f, x + w / 2, GL - h - 8, 10 + Math.floor(r() * 8), 8 + Math.floor(r() * 6), { d: '#243f33', m: '#2c4c3c', l: '#345846' }, r); }
  for (let x = 0; x < 480; x += 11) ell(f, x, GL - 4, 8, 5, '#2a4538');
  const [mid, m] = mkCanvas(480, SCN_H);
  // 우듬지: 위쪽을 꽉 채운다
  for (let x = -10; x < 500; x += 14) { leafMass(m, x, 8 + Math.floor(r() * 14), 18, 12, LD, r); }
  const trunks = [];
  for (let x = 6; x < 480; x += 16 + Math.floor(r() * 16)) { const w = 5 + Math.floor(r() * 4), top = 26 + Math.floor(r() * 30); trunks.push([x, w, top]); }
  for (const [x, w, top] of trunks) wrapX(x, xx => { barkTrunk(m, xx, top, GL - 2, w, B, r, 2); roots(m, xx, GL - 1, w, 3 + Math.floor(r() * 3), B); if (r() < 0.6) R(m, xx, GL - 8 - Math.floor(r() * 8), w, 3 + Math.floor(r() * 5), '#4f8a43'); });
  for (const [x, w, top] of trunks) wrapX(x, xx => { leafMass(m, xx + w / 2, top - 4 + Math.floor(r() * 4), 14 + Math.floor(r() * 8), 10 + Math.floor(r() * 5), r() < 0.5 ? LD : LM, r); if (r() < 0.5) leafMass(m, xx + w / 2 + (r() < 0.5 ? -9 : 9), top + 10, 9, 6, LM, r); });
  for (let i = 0; i < 14; i++) wrapX(Math.floor(r() * 480), x => vine(m, x, 20 + Math.floor(r() * 20), 16 + Math.floor(r() * 30), '#2a5a30', '#4f9a48', r));
  for (let x = 4; x < 480; x += 10 + Math.floor(r() * 12)) { const s = 4 + Math.floor(r() * 5); ell(m, x, GL - s, s + 3, s, '#24502e'); ell(m, x - 2, GL - s - 2, s + 1, s - 1, '#357040'); ell(m, x - 3, GL - s - 3, Math.max(1, s - 2), Math.max(1, s - 3), '#4f9a48'); }
  for (let i = 0; i < 26; i++) fern(m, Math.floor(r() * 480), GL - 1 - Math.floor(r() * 4), '#3f7a3a', '#5aa050');
  logFallen(m, 300, GL, 46, B, r);
  const shrooms = [];
  for (let x = 30; x < 480; x += 60 + Math.floor(r() * 50)) { mushroom(m, x, GL, '#b46ad8', '#d8a0f0', 3); shrooms.push(x); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#2f4a28'); R(g, 0, 0, 480, 3, '#3d6b3a'); R(g, 0, 0, 480, 1, '#4f8a44');
  R(g, 0, 6, 480, 11, '#3a2e22'); R(g, 0, 6, 480, 1, '#2a2018');
  for (let k = 0; k < 40; k++) { const x = Math.floor(r() * 470); R(g, x, 8 + Math.floor(r() * 7), 8 + Math.floor(r() * 8), 1, '#4b3a28'); }
  for (let k = 0; k < 14; k++) { const x = Math.floor(r() * 470); R(g, x, 7 + Math.floor(r() * 5), 10 + Math.floor(r() * 14), 2, '#2a2018'); }
  for (let k = 0; k < 90; k++) R(g, Math.floor(r() * 480), 17 + Math.floor(r() * 10), 2, 1, ['#c86a2a', '#8a5a2a', '#4f8a44', '#d89a3a'][k % 4]);
  for (let k = 0; k < 20; k++) fern(g, Math.floor(r() * 480), 2 + Math.floor(r() * 4), '#3f7a3a', '#5aa050', 0.7);
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 10; x < 480; x += 28 + Math.floor(r() * 30)) fern(fo, x, 28, '#1c3a24', '#24502e', 1.6);
  const lightsOf = (off, dark) => { const out = []; if (dark < 0.15) return out; for (const sx of shrooms) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -20 && xx < VW + 20) out.push({ x: xx, y: GL - 4, r: 10, c: '#b46ad8' }); } return out; };
  return { back, far, mid, gr, fore, clouds: 0, ambient: 'forest', tall: 1,
    props(g, off, t, dark) { lightShafts(g, off, t, dark, [60, 190, 330, 430]); },
    emit(g, off, t, dark) { if (dark < 0.15) return; for (const sx of shrooms) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) { if (xx < -6 || xx > VW + 6) continue; R(g, xx - 2, GL - 4, 6, 2, rgba('#d89aff', Math.min(1, dark * 1.6))); R(g, xx - 1, GL - 5, 4, 1, rgba('#f0d0ff', Math.min(1, dark * 1.6))); } } },
    lights: lightsOf };
}
// 햇살: 우듬지 틈으로 비스듬히 내리는 빛 (낮에만)
function lightShafts(g, off, t, dark, xs) {
  if (dark > 0.35) return;
  g.save(); g.globalAlpha = (0.1 + 0.03 * Math.sin(t * 0.7)) * (1 - dark * 2.5); g.fillStyle = '#fff4c0';
  for (const sx of xs) { const x = ((sx - off * 0.5) % 480 + 480) % 480; for (const xx of [x, x - 480]) { if (xx < -60 || xx > VW + 20) continue; g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx + 10, 0); g.lineTo(xx + 46, GL); g.lineTo(xx + 24, GL); g.closePath(); g.fill(); } }
  g.restore();
}

/* ── 원시림 (2-21 ~ 2-50): 거대한 고목이 빽빽하다 ── */
function buildPrimeval() {
  const r = rng(29), B = { b: '#3b2e22', l: '#5a4634', d: '#221a12', k: '#120c08' }, B2 = { b: '#2e3a2a', l: '#44533a', d: '#1a2418', k: '#0e140c' };
  const LD = { d: '#15301c', m: '#1f4a28', l: '#2d6a34' }, LM = { d: '#1c3f24', m: '#2a5a30', l: '#3f7a3a' };
  const [back, b] = mkCanvas(480, SCN_H);
  R(b, 0, 0, 480, SCN_H, '#1e3a34');
  for (let x = 0; x < 480; x += 26 + Math.floor(r() * 14)) { const w = 16 + Math.floor(r() * 12); R(b, x, 0, w, GL, '#1a332e'); R(b, x, 0, 2, GL, '#213d36'); for (let i = 1; i < 10; i++) { R(b, x - i, GL - 10 + i, 1, 10 - i, '#1a332e'); R(b, x + w + i, GL - 10 + i, 1, 10 - i, '#1a332e'); } }
  for (let i = 0; i < 50; i++) ell(b, Math.floor(r() * 480), Math.floor(r() * 70), 20 + Math.floor(r() * 20), 10 + Math.floor(r() * 10), '#172e2a');
  const [far, f] = mkCanvas(480, SCN_H);
  for (let x = 4; x < 480; x += 40 + Math.floor(r() * 30)) { const w = 16 + Math.floor(r() * 12); wrapX(x, xx => { barkTrunk(f, xx, 0, GL - 6, w, B2, r, 4); roots(f, xx, GL - 5, w, 9 + Math.floor(r() * 6), B2); }); }
  for (let x = -10; x < 500; x += 16) ell(f, x, 6 + Math.floor(r() * 16), 16, 10, '#162e22');
  for (let x = 0; x < 480; x += 9) ell(f, x, GL - 6, 7, 4, '#1f3a2c');
  const [mid, m] = mkCanvas(480, SCN_H);
  for (let x = -10; x < 500; x += 12) leafMass(m, x, 4 + Math.floor(r() * 12), 20, 12, LD, r);
  const trunks = [];
  for (let x = 10; x < 460; x += 62 + Math.floor(r() * 30)) trunks.push([x, 22 + Math.floor(r() * 13)]);
  for (const [x, w] of trunks) wrapX(x, xx => {
    barkTrunk(m, xx, 0, GL - 2, w, B, r, 6);
    roots(m, xx, GL - 1, w, 14 + Math.floor(r() * 7), B);
    for (let k = 0; k < 3; k++) { const rl = 6 + Math.floor(r() * 8), ry = GL - 2 - Math.floor(r() * 10); for (let i = 0; i < rl; i++) R(m, xx - 6 - i, ry - Math.floor(i * 0.3), 1, 2, k % 2 ? B.d : B.b); }   // 땅 위로 드러난 뿌리
    R(m, xx - 3, GL - 6, 5, 3, '#4f8a43'); R(m, xx + w - 2, GL - 5, 5, 2, '#3f7a3a');
    // 이끼와 덩굴, 갈라진 틈
    for (let k = 0; k < 2 + Math.floor(r() * 3); k++) { const my = GL - 10 - Math.floor(r() * 60), mw = 3 + Math.floor(r() * (w - 3)); R(m, xx + Math.floor(r() * (w - mw)), my, mw, 2 + Math.floor(r() * 3), k % 2 ? '#3f7a3a' : '#4f8a43'); }
    R(m, xx + Math.floor(w / 2), 30 + Math.floor(r() * 40), 1, 20 + Math.floor(r() * 30), B.k);
    for (let k = 0; k < 2; k++) vine(m, xx + 1 + Math.floor(r() * (w - 2)), 20 + Math.floor(r() * 30), 20 + Math.floor(r() * 40), '#24502e', '#4f9a48', r);
    // 가지와 잎 (중간 높이)
    const by = 40 + Math.floor(r() * 50), side = r() < 0.5 ? -1 : 1;
    for (let i = 0; i < 22; i++) R(m, xx + (side > 0 ? w - 1 + i : -i), by - Math.floor(i * 0.45), 1, 3 - Math.floor(i / 10), i % 5 ? B.b : B.d);
    leafMass(m, xx + (side > 0 ? w + 22 : -22), by - 14, 20, 11, LM, r);
    leafMass(m, xx + (side > 0 ? w + 8 : -8), by - 4, 11, 7, LD, r);
    if (r() < 0.5) { const sy = GL - 30 - Math.floor(r() * 30); for (let k = 0; k < 4; k++) R(m, xx + (side > 0 ? -2 - k * 3 : w + 1 + k * 3), sy + k, 3, 1, '#c8a060'); }   // 선반버섯
  });
  for (let i = 0; i < 26; i++) wrapX(Math.floor(r() * 480), x => vine(m, x, 10 + Math.floor(r() * 10), 30 + Math.floor(r() * 60), '#1f4a28', '#3f7a3a', r));
  for (let x = 30; x < 480; x += 90 + Math.floor(r() * 60)) { for (let i = 0; i < 40; i++) { const yy = GL - 3 - Math.round(Math.sin(i / 40 * Math.PI) * 7); R(m, x + i, yy, 1, 3, i % 7 ? B.b : B.d); } R(m, x + 10, GL - 9, 6, 1, '#4f8a43'); }   // 길을 가로지르는 뿌리
  for (let i = 0; i < 40; i++) fern(m, Math.floor(r() * 480), GL - 1 - Math.floor(r() * 5), '#2d6a34', '#4f9a48', 1.2);
  for (let x = 20; x < 480; x += 36 + Math.floor(r() * 30)) { const s = 5 + Math.floor(r() * 5); ell(m, x, GL - s, s + 4, s, '#1c3f24'); ell(m, x - 2, GL - s - 2, s + 1, s - 1, '#2a5a30'); }
  logFallen(m, 140, GL, 70, B, r);
  const shrooms = [];
  for (let x = 40; x < 480; x += 50 + Math.floor(r() * 50)) { mushroom(m, x, GL, '#5ad6a0', '#a0f0d0', 2 + Math.floor(r() * 2)); shrooms.push(x); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#2a2018'); R(g, 0, 0, 480, 3, '#2f4a28'); R(g, 0, 0, 480, 1, '#3d6b3a');
  for (let k = 0; k < 30; k++) { const x = Math.floor(r() * 470); R(g, x, 4 + Math.floor(r() * 18), 10 + Math.floor(r() * 24), 2, '#3b2e22'); R(g, x, 4 + Math.floor(r() * 18), 4, 1, '#5a4634'); }
  for (let k = 0; k < 100; k++) R(g, Math.floor(r() * 480), 4 + Math.floor(r() * 22), 2, 1, ['#6a4a2a', '#4f8a44', '#3f6a30', '#8a6a3a'][k % 4]);
  for (let k = 0; k < 26; k++) fern(g, Math.floor(r() * 480), 2 + Math.floor(r() * 5), '#2d6a34', '#4f9a48', 0.7);
  const [fore, fo] = mkCanvas(480, 28);
  for (let x = 6; x < 480; x += 22 + Math.floor(r() * 26)) fern(fo, x, 29, '#122a18', '#1c3f24', 1.9);
  for (let x = 60; x < 480; x += 170) { R(fo, x, 14, 14, 14, '#1a140e'); R(fo, x, 14, 3, 14, '#2a2018'); }
  const lightsOf = (off, dark) => { const out = []; if (dark < 0.15) return out; for (const sx of shrooms) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) if (xx > -20 && xx < VW + 20) out.push({ x: xx, y: GL - 4, r: 12, c: '#5ad6a0' }); } return out; };
  return { back, far, mid, gr, fore, clouds: 0, ambient: 'forest', tall: 1,
    props(g, off, t, dark) { lightShafts(g, off, t, dark, [40, 150, 260, 400]); },
    emit(g, off, t, dark) { if (dark < 0.15) return; for (const sx of shrooms) { const x = ((sx - off) % 480 + 480) % 480; for (const xx of [x, x - 480]) { if (xx < -6 || xx > VW + 6) continue; R(g, xx - 2, GL - 4, 6, 2, rgba('#8af0c8', Math.min(1, dark * 1.6))); R(g, xx - 1, GL - 5, 4, 1, rgba('#d0fff0', Math.min(1, dark * 1.6))); } } },
    lights: lightsOf };
}

/* ── 7번가 뒷골목 (암살자 길드 은신처): 밤 골목 ── */
function buildAlley() {
  const r = rng(71), WL = '#2e2630', WLn = '#1e181f', WLl = '#3a3040';
  const [mid, m] = mkCanvas(480, SCN_H);
  // 밤하늘 띠와 지붕선
  R(m, 0, 0, 480, 46, '#0a0a16'); for (let i = 0; i < 50; i++) R(m, Math.floor(r() * 480), Math.floor(r() * 38), 1, 1, i % 4 ? '#8a8aa8' : '#d8d8f0');
  R(m, 350, 10, 6, 6, '#e8e4d0'); R(m, 352, 11, 4, 4, '#0a0a16');
  for (let x = 0; x < 480; x += 120) { R(m, x, 34, 120, 12, '#1a1620'); for (let k = 0; k < 120; k += 6) R(m, x + k, 34 + (k % 12 ? 0 : 1), 5, 3, '#2a2230'); R(m, x + 20, 20, 10, 14, '#141020'); R(m, x + 19, 18, 12, 2, '#2a2230'); }
  // 벽돌 벽
  R(m, 0, 46, 480, GL - 46, WL);
  for (let y = 46; y < GL; y += 6) { R(m, 0, y, 480, 1, WLn); for (let x = ((y - 46) / 6) % 2 ? 0 : 7; x < 480; x += 14) { R(m, x, y, 1, 6, WLn); R(m, x + 1, y + 1, 12, 1, WLl); if (r() < 0.1) R(m, x + 3, y + 2, 6, 3, '#26202a'); } }
  for (let i = 0; i < 12; i++) { const x = Math.floor(r() * 480), y = 60 + Math.floor(r() * 90); for (let k = 0; k < 8; k++) R(m, x + k, y + Math.floor(k * 0.7), 1, 1, WLn); }   // 금
  for (let i = 0; i < 8; i++) { const x = Math.floor(r() * 480); R(m, x, 46, 2, 30 + Math.floor(r() * 50), '#242028'); }   // 물때
  // 창: 덧문 닫힌 창, 몇은 붉은 불빛
  const litWin = [];
  for (let x = 30; x < 480; x += 70 + Math.floor(r() * 30)) { const lit = r() < 0.4; if (lit) litWin.push(x); R(m, x, 56, 16, 18, '#141018'); R(m, x + 1, 57, 14, 16, lit ? '#5a1e1e' : '#1a1620'); R(m, x + 7, 57, 2, 16, '#3a2a22'); R(m, x + 1, 64, 14, 1, '#3a2a22'); for (let k = 58; k < 73; k += 2) R(m, x + 1, k, 14, 1, lit ? '#6a2424' : '#221c26'); R(m, x - 1, 74, 18, 2, '#3a3040'); if (lit) R(m, x + 3, 60, 3, 4, '#8a3030'); }
  // 빗물관
  for (let x = 100; x < 480; x += 240) { R(m, x, 46, 3, GL - 46, '#1a1a22'); R(m, x, 46, 1, GL - 46, '#2a2a34'); R(m, x - 2, 50, 7, 2, '#1a1a22'); R(m, x - 2, 120, 7, 2, '#1a1a22'); }
  // 현상 수배지와 길드 표식
  for (let x = 50; x < 480; x += 110 + Math.floor(r() * 40)) { R(m, x, 90, 12, 15, '#c8b890'); R(m, x + 1, 91, 10, 1, '#8a7a5a'); R(m, x + 3, 94, 6, 6, '#3a2a22'); R(m, x + 4, 95, 4, 2, '#c8b890'); R(m, x + 2, 102, 8, 1, '#8a2a2a'); R(m, x + 5, 97, 2, 1, '#e04040'); }
  for (let x = 160; x < 480; x += 230) { ell(m, x, 100, 6, 4, '#3a1818'); ell(m, x, 100, 4, 2, '#8a2a2a'); R(m, x, 100, 1, 1, '#e8e4d0'); R(m, x - 8, 108, 16, 1, '#8a2a2a'); }   // 눈 표식
  // 빨랫줄과 널린 망토
  for (let x = 0; x < 480; x += 240) { R(m, x, 80, 240, 1, '#4a4450'); for (let k = 30; k < 240; k += 60 + Math.floor(r() * 30)) { const c = ['#2a2a36', '#3a2a2a', '#1e1e28'][k % 3]; R(m, x + k, 81, 10, 14, c); R(m, x + k + 2, 95, 6, 3, c); R(m, x + k, 81, 10, 1, '#5a5a66'); } }
  // 등불 받침대 (불꽃은 따로)
  const lamps = [];
  for (let x = 40; x < 480; x += 120) { R(m, x - 4, 100, 10, 1, '#4a3a30'); R(m, x, 100, 1, 8, '#4a3a30'); lamps.push(x); }
  // 차양, 사슬, 길드 깃발, 깨진 병, 수레바퀴
  for (let x = 24; x < 480; x += 160) { for (let k = 0; k < 24; k += 4) R(m, x + k, 76, 4, 3, k % 8 ? '#5a2a2a' : '#3a1e1e'); R(m, x, 79, 24, 1, '#2a1616'); R(m, x - 1, 74, 26, 2, '#3a3040'); }
  for (let x = 300; x < 480; x += 480) { for (let i = 0; i < 26; i++) R(m, x + (i % 2), 46 + i, 1, 1, i % 2 ? '#6a6a74' : '#3a3a44'); R(m, x - 2, 72, 5, 4, '#4a4a54'); }
  for (let x = 240; x < 480; x += 240) { R(m, x, 50, 14, 28, '#141018'); R(m, x + 1, 51, 12, 26, '#1e1620'); ell(m, x + 7, 62, 4, 3, '#8a2a2a'); R(m, x + 7, 62, 1, 1, '#e8e4d0'); R(m, x + 2, 70, 10, 1, '#8a2a2a'); R(m, x - 1, 49, 16, 2, '#4a3a30'); for (let k = 0; k < 12; k += 3) R(m, x + 1 + k, 77, 2, 2, '#1e1620'); }   // 길드 깃발
  for (let x = 70; x < 480; x += 130 + Math.floor(r() * 40)) { R(m, x, GL - 3, 3, 3, '#4a8a4a'); R(m, x + 1, GL - 5, 1, 2, '#6aa86a'); R(m, x + 6, GL - 2, 2, 2, '#4a8a4a'); R(m, x + 10, GL - 1, 3, 1, '#8ad88a'); }
  for (let x = 330; x < 480; x += 480) { ell(m, x, GL - 7, 7, 7, '#3a2a1e'); ell(m, x, GL - 7, 4, 4, WL); R(m, x - 1, GL - 8, 2, 2, '#5a4a3a'); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4; R(m, x + Math.round(Math.cos(a) * 5), GL - 7 + Math.round(Math.sin(a) * 5), 1, 1, '#5a4a3a'); } }
  // 단검 걸이, 상자, 술통, 우리, 고양이, 쥐
  for (let x = 210; x < 480; x += 240) { R(m, x, 120, 22, 2, '#4a3a30'); for (let k = 0; k < 4; k++) { R(m, x + 3 + k * 5, 122, 1, 7, '#c8ccd4'); R(m, x + 2 + k * 5, 122, 3, 1, '#c9a04a'); } }
  for (let x = 10; x < 480; x += 55 + Math.floor(r() * 20)) { const kind = Math.floor(r() * 3); if (kind === 0) { R(m, x, GL - 14, 14, 14, '#5e4630'); R(m, x + 1, GL - 13, 12, 1, '#7a5a3a'); R(m, x + 6, GL - 14, 1, 14, '#4a3420'); R(m, x, GL - 8, 14, 1, '#4a3420'); } else if (kind === 1) { R(m, x + 1, GL - 16, 12, 16, '#5a3e28'); R(m, x, GL - 13, 14, 2, '#3a3a42'); R(m, x, GL - 5, 14, 2, '#3a3a42'); R(m, x + 3, GL - 16, 2, 16, '#7a5a3a'); } else { R(m, x, GL - 12, 16, 12, '#2a2a32'); for (let k = 1; k < 16; k += 3) R(m, x + k, GL - 12, 1, 12, '#5a5a66'); R(m, x, GL - 12, 16, 1, '#5a5a66'); R(m, x + 5, GL - 6, 3, 2, '#e04040'); } }
  R(m, 268, GL - 20, 7, 6, '#1a1a1e'); R(m, 273, GL - 23, 3, 3, '#1a1a1e'); R(m, 266, GL - 17, 2, 1, '#1a1a1e'); R(m, 274, GL - 22, 1, 1, '#e8c840'); R(m, 262, GL - 16, 6, 1, '#1a1a1e');   // 고양이
  // 문: 쇠창살 들여다보는 구멍
  for (let x = 130; x < 480; x += 250) { R(m, x, GL - 40, 24, 40, '#3a2a1e'); R(m, x + 1, GL - 39, 22, 38, '#4a3626'); R(m, x + 8, GL - 32, 8, 5, '#141018'); for (let k = 0; k < 4; k++) R(m, x + 9 + k * 2, GL - 32, 1, 5, '#8a8a92'); R(m, x + 18, GL - 20, 2, 2, '#c9a04a'); R(m, x - 2, GL - 42, 28, 3, '#2a1e16'); }
  // 지하 계단
  for (let x = 400; x < 480; x += 480) { for (let k = 0; k < 5; k++) R(m, x + k * 4, GL - 20 + k * 4, 24 - k * 4, 4, k % 2 ? '#26202a' : '#2e2630'); R(m, x, GL - 20, 24, 1, '#3a3040'); }
  const [gr, g] = mkCanvas(480, 28);
  R(g, 0, 0, 480, 28, '#2e2e36');
  for (let y = 0; y < 28; y += 5) for (let x = (y / 5) % 2 ? 0 : 5; x < 480; x += 10) { R(g, x, y, 9, 4, '#383840'); R(g, x, y, 9, 1, '#44444e'); if (r() < 0.08) R(g, x + 2, y + 1, 5, 2, '#2a2a32'); }
  for (let x = 20; x < 480; x += 90 + Math.floor(r() * 60)) { ell(g, x, 14, 16, 4, '#1e1e2c'); ell(g, x - 2, 13, 10, 2, '#262636'); R(g, x - 6, 13, 3, 1, '#4a3a3a'); }   // 웅덩이
  const [fore, fo] = mkCanvas(480, SCN_H);
  for (let x = 90; x < 480; x += 220) { R(fo, x, 0, 10, SCN_H, '#141018'); R(fo, x, 0, 2, SCN_H, '#221c26'); R(fo, x - 3, 0, 16, 8, '#0e0a12'); }
  const torch = '#f08a3a';
  return { under: true, wall: WL, torch, mid, gr, foreTall: fore, ambient: 'dust', tall: 1,
    emit(g, off, t) { for (const x of lamps) { const xx = ((x - off * 0.6) % 480 + 480) % 480; for (const tx of [xx, xx - 480]) { if (tx < -8 || tx > VW + 8) continue; const fl = Math.floor(t * 7 + x) % 2; R(g, tx - 3, 106, 7, 9, '#5a1818'); R(g, tx - 2, 107, 5, 7, fl ? '#e05030' : '#f06838'); R(g, tx - 1, 109, 3, 3, '#ffd080'); R(g, tx, 110, 1, 1, '#fff8e0'); R(g, tx - 3, 105, 7, 1, '#3a2a22'); R(g, tx - 2, 115, 5, 1, '#3a2a22'); } } },
    lights(off) { const out = []; for (const x of lamps) { const xx = ((x - off * 0.6) % 480 + 480) % 480; for (const tx of [xx, xx - 480]) if (tx > -40 && tx < VW + 40) out.push({ x: tx, y: 110, r: 56, c: '#f06838', glow: 1, flick: 1 }); } for (const x of litWin) { const xx = ((x - off * 0.6) % 480 + 480) % 480; for (const tx of [xx, xx - 480]) if (tx > -40 && tx < VW + 40) out.push({ x: tx + 8, y: 66, r: 26, c: '#c04040' }); } return out; } };
}
