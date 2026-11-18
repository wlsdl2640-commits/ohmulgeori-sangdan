/* ───────── 빌드 70 하르겐 지하: 풍경 넷 · 물이 찬 스테이지 · 독 안개 · 길드장 패턴 효과 · 지도 자리 ─────────
   풍경(buildUnder — scene.js): 옛 제국 수로(aqueduct) · 옛 제국의 대저수조(cistern) · 지하미궁 통로(passage) · 암살자 길드 본부(guildhq).
   벽은 UNDER_DECOR, 바닥은 UNDER_FLOOR(빌드 70에 더한 훅). 피한 것: 격자 창살(쇠 띠는 세로만) · 십자 무늬 · 손 모양 문장 · 칼자루 십자(무기 진열대 대신 과녁).
   build.py에서 map.js 다음 (BG_MAKERS · SKFX · FMOT_NAME · MAP_NODES가 다 있은 뒤). 데이터는 data-under70.js. */

Object.assign(UNDER_PAL, {
  aqueduct: { wall: '#5a5446', line: '#3e3a30', floor: '#5a5a50', fl: '#46463e', torch: '#f0c070', dark: 0.3 },
  cistern:  { wall: '#2e3a3e', line: '#1e282c', floor: '#3a4a4e', fl: '#2a383c', torch: '#f0c070', dark: 0.36 },
  passage:  { wall: '#3a332e', line: '#26211e', floor: '#3e362e', fl: '#2e2822', torch: '#e8a040', dark: 0.34 },
  guildhq:  { wall: '#241e26', line: '#161218', floor: '#2a2228', fl: '#1e181e', torch: '#e04a3a', dark: 0.36 }
});
Object.assign(UNDER_DECOR, {
  // 옛 제국 수로: 큰 마름돌 · 둥근 아치 굴(안쪽 어둠과 먼 물빛) · 아치 사이 벽기둥 · 녹청 낀 청동 배수구(세로 쇠 띠만) · 물때 · 이끼
  aqueduct: (m, r) => {
    R(m, 0, 0, 480, 104, '#5a5446');   // 기본 벽돌을 지우고 큰 마름돌로
    for (let y = 2; y < 104; y += 12) { R(m, 0, y, 480, 1, '#3e3a30'); for (let x = (y / 12) % 2 ? 0 : 14; x < 480; x += 28) { R(m, x, y, 1, 12, '#3e3a30'); R(m, x + 1, y + 1, 26, 1, '#6a6454'); if (r() < 0.2) R(m, x + 4, y + 4, 8, 4, '#524c40'); } }
    for (let x = 100; x < 480; x += 120) {   // 아치 굴 (횃불 받침 사이)
      const cx = x, w = 22, top = 46;
      for (let yy = top - w; yy < 104; yy++) { const dy = yy - top, hw = dy < 0 ? Math.round(Math.sqrt(Math.max(0, w * w - dy * dy))) : w; R(m, cx - hw - 3, yy, hw * 2 + 6, 1, '#7a7260'); }   // 아치 돌 테
      for (let yy = top - w + 3; yy < 104; yy++) { const dy = yy - top, hw = dy < 0 ? Math.round(Math.sqrt(Math.max(0, (w - 3) * (w - 3) - dy * dy))) : w - 3; R(m, cx - hw, yy, hw * 2, 1, '#121816'); }
      for (let i = 0; i < 7; i++) { const a = Math.PI * (i / 6), px = cx + Math.round(Math.cos(a) * (w - 1)), py = top - Math.round(Math.sin(a) * (w - 1)); R(m, px - 1, py - 1, 2, 2, '#3e3a30'); }   // 아치 돌 이음
      R(m, cx - 14, 92, 28, 3, '#1e3a40'); R(m, cx - 10, 93, 6, 1, '#3a7a8a'); R(m, cx + 3, 92, 5, 1, '#3a7a8a');   // 굴 안쪽 먼 물빛
      R(m, cx - 3, top - w - 1, 6, 4, '#8a8270'); R(m, cx - 2, top - w, 4, 1, '#a8a088');   // 쐐기돌
    }
    for (let x = 40; x < 480; x += 120) {   // 벽기둥 (횃불 뒤)
      R(m, x - 6, 12, 14, 92, '#6a6454'); R(m, x - 6, 12, 2, 92, '#7a7462'); R(m, x + 6, 12, 2, 92, '#4a463a'); R(m, x - 8, 10, 18, 4, '#7a7262'); R(m, x - 8, 13, 18, 1, '#4a463a'); R(m, x - 8, 98, 18, 6, '#4e483c');
    }
    for (let x = 158; x < 480; x += 240) {   // 녹청 낀 청동 배수구 + 흘러내린 물때
      R(m, x, 64, 16, 12, '#1c2422'); R(m, x - 1, 63, 18, 1, '#5aa890'); R(m, x - 1, 76, 18, 1, '#3a7a68'); for (let i = 0; i < 4; i++) R(m, x + 2 + i * 4, 64, 2, 12, '#4a8a78');
      for (let i = 0; i < 3; i++) R(m, x + 3 + i * 5, 77, 2, 8 + i * 4, '#4a7a6a');
    }
    for (let i = 0; i < 36; i++) { const x = Math.floor(r() * 480), y = 20 + Math.floor(r() * 70); R(m, x, y, 1, 3 + Math.floor(r() * 8), '#4a463c'); }   // 물때
    for (let x = 6; x < 480; x += 31) if (r() < 0.65) { R(m, x, 99 - Math.floor(r() * 3), 4, 2, '#4a6a3a'); R(m, x + 1, 97, 2, 1, '#6a8a4a'); }   // 이끼
  },
  // 옛 제국의 대저수조: 물에서 솟은 기둥 줄(가까운 줄 · 먼 줄) · 기둥머리 · 기둥 사이 아치 천장 · 물에 비친 횃불
  cistern: (m, r) => {
    R(m, 0, 0, 480, 104, '#26323a');
    for (let x = 12; x < 480; x += 32) { R(m, x, 18, 6, 80, '#1e2a30'); R(m, x - 2, 16, 10, 3, '#24323a'); }   // 먼 줄
    for (let x = 0; x < 480; x += 32) for (let i = 0; i <= 16; i++) { const u = i / 16, yy = 18 - Math.round(Math.sin(u * Math.PI) * 9); R(m, x + 12 + i * 2, yy, 2, 1, '#2e3c44'); }
    for (let x = 28; x < 480; x += 64) {   // 가까운 줄
      R(m, x, 22, 12, 82, '#4a5a5e'); R(m, x, 22, 3, 82, '#5e7076'); R(m, x + 9, 22, 3, 82, '#34444a');
      for (let y = 30; y < 100; y += 14) R(m, x, y, 12, 1, '#3a4a50');
      R(m, x - 3, 16, 18, 6, '#5a6a6e'); R(m, x - 3, 16, 18, 1, '#7a8a8e'); R(m, x - 1, 22, 14, 2, '#3a4a50');   // 기둥머리
      for (let i = 0; i <= 20; i++) { const u = i / 20, yy = 16 - Math.round(Math.sin(u * Math.PI) * 13); R(m, x + 12 + i * 2.6, yy, 3, 2, '#4a5a5e'); }   // 아치 천장
      R(m, x - 2, 96, 16, 8, '#2a3a40');
    }
    for (let i = 0; i < 26; i++) { const x = Math.floor(r() * 480), y = 26 + Math.floor(r() * 66); R(m, x, y, 1, 2 + Math.floor(r() * 6), '#22303a'); }   // 물방울 자국
    for (let x = 0; x < 480; x += 6) R(m, x, 101 + (x % 3 === 0 ? 1 : 0), 4, 1, '#3a5a64');   // 물 가장자리
  },
  // 지하미궁 통로: 거친 바위벽 + 군데군데 옛 미궁의 큰 마름돌(지그재그 띠) · 버팀목 · 밀수꾼 짐짝 · 자루 · 걸린 사슬 · 쥐의 왕관 분필 표시 · 등불
  passage: (m, r) => {
    R(m, 0, 0, 480, 104, '#3a332e');   // 기본 벽돌을 지우고 거친 바위로
    for (let i = 0; i < 160; i++) { const x = Math.floor(r() * 480), y = Math.floor(r() * 100), w = 4 + Math.floor(r() * 12); R(m, x, y, w, 2 + Math.floor(r() * 4), r() < 0.5 ? '#433b34' : '#302a25'); }
    for (let x = 60; x < 480; x += 160) {   // 옛 미궁 마름돌 벽
      R(m, x, 30, 44, 70, '#5a5248'); for (let y = 30; y < 100; y += 14) { R(m, x, y, 44, 1, '#3e3830'); for (let bx = x + ((y / 14) % 2 ? 0 : 11); bx < x + 44; bx += 22) R(m, bx, y, 1, 14, '#3e3830'); }
      for (let i = 0; i < 11; i++) R(m, x + i * 4, 44 + (i % 2 ? 0 : 3), 4, 1, '#8a7a5a');   // 지그재그 띠
      R(m, x, 30, 44, 1, '#6e665a'); R(m, x - 1, 29, 46, 1, '#2a2420');
    }
    for (let x = 18; x < 480; x += 96) {   // 버팀목 (두 기둥 + 가로대)
      R(m, x, 22, 4, 82, '#5e4630'); R(m, x + 30, 22, 4, 82, '#5e4630'); R(m, x - 2, 20, 38, 4, '#6e5236'); R(m, x - 2, 20, 38, 1, '#8a6a46'); R(m, x + 1, 22, 1, 82, '#7a5a3a');
    }
    for (let x = 120; x < 480; x += 200) {   // 짐짝 · 자루 · 통
      R(m, x, 84, 18, 16, '#7a5a36'); R(m, x + 1, 85, 16, 1, '#9a7a4e'); R(m, x + 8, 84, 2, 16, '#5a4024'); R(m, x + 4, 72, 14, 12, '#6e5232'); R(m, x + 5, 73, 12, 1, '#8e6e46');
      R(m, x + 22, 90, 10, 10, '#8a7a5a'); R(m, x + 24, 88, 6, 3, '#9a8a6a'); R(m, x + 26, 87, 2, 2, '#5a4a30');
      R(m, x - 14, 86, 10, 14, '#5a4a3a'); R(m, x - 14, 88, 10, 1, '#3a3028'); R(m, x - 14, 96, 10, 1, '#3a3028');
    }
    for (let x = 200; x < 480; x += 160) for (let i = 0; i < 9; i++) { R(m, x + (i % 2), 14 + i * 4, 2, 3, '#6a6a72'); if (i % 2) R(m, x, 15 + i * 4, 1, 1, '#2a2a30'); }   // 걸린 사슬 (붉은 손)
    for (let x = 84; x < 480; x += 240) ['X..X..X', 'XX.X.XX', 'XXXXXXX', '.......', 'X.X.X.X'].forEach((row, j) => { for (let i = 0; i < 7; i++) if (row[i] === 'X') R(m, x + i, 56 + j, 1, 1, '#d8d0b8'); });   // 쥐의 왕관 분필 표시 (뾰족 셋 관 + 밑 점줄)
    for (let x = 0; x < 480; x += 11) if (r() < 0.4) R(m, x, 99 - Math.floor(r() * 2), 3, 1, '#5a4a3a');
  },
  // 암살자 길드 본부: 검붉은 휘장(두건과 붉은 두 눈) · 던지기 과녁(동심원) · 촛대 · 떠도는 누런 매연
  guildhq: (m, r) => {
    R(m, 0, 0, 480, 104, '#241e26');   // 검은 널판 벽 (세로 이음만 — 가로줄과 엇갈려 십자가 생기지 않게)
    for (let x = 0; x < 480; x += 12) { R(m, x, 0, 1, 104, '#1a161c'); R(m, x + 1, 0, 1, 104, '#2c2530'); }
    R(m, 0, 4, 480, 3, '#2e2630'); R(m, 0, 7, 480, 1, '#141016'); R(m, 0, 94, 480, 10, '#1c171e'); R(m, 0, 94, 480, 1, '#3a3038');
    for (let x = 70; x < 480; x += 120) {   // 휘장
      R(m, x, 8, 26, 70, '#4a1418'); R(m, x, 8, 26, 2, '#6a2024'); R(m, x + 2, 10, 2, 66, '#5a181c'); R(m, x - 2, 6, 30, 3, '#2a2228'); R(m, x - 3, 6, 2, 3, '#8a7a5a'); R(m, x + 27, 6, 2, 3, '#8a7a5a');
      for (let i = 0; i < 5; i++) R(m, x + i * 6, 78, 3, 3 + (i % 2) * 2, '#4a1418');
      for (let yy = 0; yy < 16; yy++) { const hw = Math.round(2 + yy * 0.45); R(m, x + 13 - hw, 30 + yy, hw * 2, 1, '#121014'); }   // 두건
      R(m, x + 9, 40, 2, 2, '#e04a3a'); R(m, x + 15, 40, 2, 2, '#e04a3a');
    }
    for (let x = 136; x < 480; x += 240) {   // 던지기 과녁
      for (const [rr, c] of [[11, '#6e5236'], [9, '#d8c8a0'], [7, '#8a2a24'], [5, '#d8c8a0'], [3, '#8a2a24']]) ell(m, x, 54, rr, rr, c);
      R(m, x - 6, 50, 3, 1, '#a8a8b0'); R(m, x + 4, 57, 3, 1, '#a8a8b0'); R(m, x + 1, 46, 1, 3, '#a8a8b0');   // 꽂힌 칼 (자루 끝만)
      R(m, x - 1, 65, 2, 39, '#3a2e2a');
    }
    for (let x = 30; x < 480; x += 240) { R(m, x, 70, 2, 30, '#5a4a3a'); R(m, x - 6, 70, 14, 2, '#6a5a44'); for (let i = 0; i < 3; i++) { R(m, x - 5 + i * 6, 64, 2, 6, '#e8e0c8'); R(m, x - 5 + i * 6, 62, 2, 2, '#ffb040'); } }   // 촛대
    for (let i = 0; i < 18; i++) { const x = Math.floor(r() * 470), y = 20 + Math.floor(r() * 70); R(m, x, y, 6 + Math.floor(r() * 10), 2, 'rgba(156,144,104,0.18)'); }   // 누런 매연
  }
});
Object.assign(UNDER_FLOOR, {
  aqueduct: (g, r) => { R(g, 0, 12, 480, 16, '#24505a'); R(g, 0, 12, 480, 1, '#7a7462'); R(g, 0, 11, 480, 1, '#46463e'); for (let x = 0; x < 480; x += 19) { R(g, x + 3, 16 + (x / 19) % 3, 8, 1, '#3a7a8a'); R(g, x + 12, 22 - (x / 19) % 2, 5, 1, '#3a7a8a'); } for (let x = 4; x < 480; x += 27) if (r() < 0.5) R(g, x, 10, 3, 2, '#4a6a3a'); },
  cistern:  (g, r) => { R(g, 0, 9, 480, 19, '#1e3a44'); R(g, 0, 9, 480, 1, '#5a6a6e'); for (let x = 0; x < 480; x += 64) { R(g, x + 28, 10, 12, 18, 'rgba(90,110,114,0.35)'); } for (let x = 0; x < 480; x += 15) R(g, x + 2, 13 + (x / 15) % 4 * 3, 7, 1, '#2e5a66'); for (let x = 40; x < 480; x += 120) { R(g, x, 12, 3, 1, '#f0c070'); R(g, x - 1, 15, 5, 1, '#c89a50'); R(g, x, 18, 3, 1, '#8a6a3a'); } },
  passage:  (g, r) => { for (let i = 0; i < 70; i++) R(g, Math.floor(r() * 480), 2 + Math.floor(r() * 26), 2, 1, i % 2 ? '#4a4036' : '#2a241e'); for (let x = 30; x < 480; x += 140) { R(g, x, 6, 22, 3, '#5e4630'); R(g, x, 6, 22, 1, '#7a5a3a'); R(g, x + 7, 6, 1, 3, '#3a2a1e'); } for (let x = 90; x < 480; x += 170) R(g, x, 16, 10, 1, '#c8b070'); },
  guildhq:  (g, r) => { R(g, 0, 8, 480, 10, '#5a141a'); R(g, 0, 8, 480, 1, '#8a2a24'); R(g, 0, 17, 480, 1, '#3a0e12'); for (let x = 0; x < 480; x += 24) { R(g, x + 6, 12, 4, 2, '#8a6a3a'); } for (let x = 0; x < 480; x += 12) R(g, x, 22, 6, 1, '#2e2630'); }
});
Object.assign(BG_MAKERS, { aqueduct: () => buildUnder('aqueduct'), cistern: () => buildUnder('cistern'), passage: () => buildUnder('passage'), guildhq: () => buildUnder('guildhq') });

// ── 물이 찬 스테이지 (data-under70.js floodOn): 바닥에 차오른 물 · 사람과 몬스터 발목의 물결
function floodFloor(w, scroll, t, oy) {
  const y0 = oy + 104, H = AH - y0;
  w.save(); w.globalAlpha = 0.5; R(w, 0, y0, AW, H, '#1e4a56'); w.globalAlpha = 1;
  R(w, 0, y0 - 1, AW, 1, 'rgba(140,210,220,0.55)');
  for (let i = 0; i < 22; i++) {   // 흐르는 물결 (걷는 거리 · 시간에 따라)
    const x = ((i * 47 - scroll * 1.0 - t * 6) % (AW + 40) + AW + 40) % (AW + 40) - 20, y = y0 + 3 + (i * 7) % Math.max(4, H - 4);
    R(w, Math.round(x), y, 6 + (i % 3) * 3, 1, i % 4 ? 'rgba(90,170,190,0.55)' : 'rgba(200,240,250,0.55)');
  }
  w.restore();
}
function floodFeet(w, t, pts, walking) {
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i], ph = (t * 1.6 + i * 0.37) % 1, k = walking ? 1 : 0.6;
    w.save(); w.globalAlpha = 0.6; R(w, Math.round(x) - 10, y - 2, 20, 3, '#2a6a7a'); w.globalAlpha = 1;
    R(w, Math.round(x) - 9, y - 2, 18, 1, 'rgba(190,235,245,0.75)');
    const rr = Math.round(10 + ph * 8 * k), a = (0.55 * (1 - ph)).toFixed(2);   // 퍼져 나가는 물결 고리 (납작한 타원 — 위아래 두 줄)
    R(w, Math.round(x) - rr, y + 1, 4, 1, `rgba(190,235,245,${a})`); R(w, Math.round(x) + rr - 4, y + 1, 4, 1, `rgba(190,235,245,${a})`);
    R(w, Math.round(x) - rr + 4, y + 2, rr * 2 - 8, 1, `rgba(150,215,230,${(a * 0.6).toFixed(2)})`);
    w.restore();
  }
}

// ── 독 안개 (길드장 패턴 2 — fmot.js fmotAoe 'gas'): 독 약병이 빙글 돌며 포물선으로 날아가 맞는 때에 깨지고, 유리 조각 · 초록 안개 · 거품
function gasDraw(g, f, e, P) {
  if (e > f.d) return;
  const z = f.z || 1, G = P || SK_PAL.poison;
  if (e < f.fl) {
    const q = e / f.fl, x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q - 4 * f.h * q * (1 - q), rot = Math.floor(e / 0.07 + f.s) % 4;
    for (let i = 1; i <= 5; i++) { const qq = Math.max(0, q - i * 0.045), tx = f.x0 + (f.x1 - f.x0) * qq, ty = f.y0 + (f.y1 - f.y0) * qq - 4 * f.h * qq * (1 - qq); skQ(g, tx, ty + 2, i < 3 ? G[1] : G[2], 0.7 - i * 0.12); }   // 흘린 독 방울
    const cells = [[[0, -4, '#a8784a'], [0, -2, G[0]], [0, 0, G[2]], [0, 2, G[3]], [2, 0, G[1]]], [[4, 0, '#a8784a'], [2, 0, G[0]], [0, 0, G[2]], [-2, 0, G[3]], [0, -2, G[1]]], [[0, 4, '#a8784a'], [0, 2, G[0]], [0, 0, G[2]], [0, -2, G[3]], [-2, 0, G[1]]], [[-4, 0, '#a8784a'], [-2, 0, G[0]], [0, 0, G[2]], [2, 0, G[3]], [0, 2, G[1]]]][rot];
    for (const [dx, dy, c] of cells) skQ(g, x + dx, y + dy, c);   // 약병: 코르크 · 빛 · 초록 유리 · 짙은 바닥
    return;
  }
  const k = e - f.fl, d2 = f.d - f.fl, fade = k > d2 - 0.5 ? Math.max(0, (d2 - k) / 0.5) : 1;
  if (k < 0.12) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, rr = (3 + k / 0.12 * 9) * z; skQ(g, f.x1 + Math.cos(a) * rr, f.y1 + Math.sin(a) * rr * 0.6, i % 2 ? '#ffffff' : G[0], 1 - k / 0.12); }   // 깨지는 번쩍임
  if (k < 0.4) for (let i = 0; i < 7; i++) {   // 유리 조각 · 튀는 독
    const a = Math.PI * (0.1 + 0.8 * skH(f.s * 7 + i, 91)), sp = (30 + 26 * skH(f.s * 7 + i, 92)) * z, side = i % 2 ? 1 : -1;
    skQ(g, f.x1 + Math.cos(a) * sp * k * side, f.y1 - Math.sin(a) * sp * k + 110 * k * k, i % 3 ? '#e8fff0' : G[1], 1 - k / 0.4);
  }
  const R0 = (7 + 12 * Math.min(1, k / 0.35)) * z, cyc = f.gy - 10 * z;
  for (let i = 0; i < 20; i++) {   // 안개 덩이: 몸 둘레로 퍼지며 천천히 오르고 흔들린다 (안쪽 덩이는 몸을 덮는다)
    const a = (i / 20) * Math.PI * 2 + f.s, rx = R0 * (i % 4 === 0 ? 0.3 : 0.55 + 0.45 * skH(i, f.s + 3)), px = f.x1 + Math.cos(a) * rx + Math.sin(k * 2.2 + i) * 2, py = cyc + Math.sin(a) * rx * 0.6 - k * 8 * z;
    const c = i % 3 === 0 ? G[1] : i % 3 === 1 ? G[2] : G[3], al = 0.85 * fade * (0.75 + 0.25 * Math.sin(k * 5 + i));
    skQ(g, px, py, c, al); skQ(g, px + 2, py, c, al * 0.85); skQ(g, px, py - 2, i % 2 ? G[1] : c, al * 0.7); if (i % 2) skQ(g, px + 2, py - 2, G[2], al * 0.6);
  }
  if (k > 0.15) for (let i = 0; i < 5; i++) { const p = ((k - 0.15) * 0.8 + i * 0.2) % 1; skQ(g, f.x1 + (i - 2) * 5 * z, cyc - 2 - p * 24 * z, G[0], 0.7 * (1 - p) * fade); }   // 오르는 거품
}

// ── 길드장 패턴이 바뀌는 순간 (pxund.js PXU.guildmaster.low[].fx · view.js) · 따라 베기 색 · 광역기 이름 · 지도 자리
Object.assign(SK_PAL, { smog: ['#fff4d8', '#d8c898', '#9c9068', '#4c4430'] });   // 누런 매연
SKFX['u:low:smog'] = { pal: 'smog', hit: 'burst', after: 'smoke' };     // 패턴 1: 발밑 그림자에서 매연이 솟아 등 뒤 분신이 선다
SKFX['u:low:gas'] = { pal: 'poison', hit: 'poison', after: 'smoke' };   // 패턴 2: 독 약병을 꺼내 들고 발밑에 독 안개
Object.assign(FMOT_NAME, { sluicewarden: '수로 범람', ratcrown: '쥐 떼 돌격', redhand: '갈래창 휩쓸기', greyledger: '금화 비', guildmaster: '그림자 칼날 비' });
Object.assign(MAP_NODES, { aqueduct: { x: 190, y: 192, dun: [-2, -14] }, passage: { x: 110, y: 190, dun: [-18, -2] } });   // 지하수로(150, 176) 양옆 — 길드(150, 192) 이름표와 안 겹치게
