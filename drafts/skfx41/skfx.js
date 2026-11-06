/* 시안 (빌드 41 후보): 스킬 동작 + 단계 효과. 게임 코드(pxs.js 동작 · view.js motFx · drawAdv · drawMon) 위에 얹어 그린다.
   단계: ① 모으기(휘두르기 전 셋째 장을 hold초 더 붙잡고 칼·방패에 빛이 모인다) ② 휘두르기(스킬 색 칼끝 자취, 두껍게)
         ③ 맞히기(적 자리: 번쩍 → 모양 → 흩어짐) ④ 남은 것(먼지·빛 알갱이·땅 울림). 모든 칸은 2×2 논리 픽셀(뭉툭 칸)에 맞춘다.
   장면: 논리 200×96, 땅 y 86, 모험가 (64, 86) 배율 1.25, 적 (150, 86) 또는 셋. */
const SK_PAL = {
  power: ['#ffffff', '#ffe066', '#ff9a2e', '#c0501e'],
  holy:  ['#ffffff', '#fff2a8', '#ffd24a', '#d89a1c'],
  earth: ['#f4e4c4', '#d8b070', '#9a7040', '#5a4428'],
  steel: ['#ffffff', '#d8ecff', '#8ab8f0', '#4a6ab0'],
  wind:  ['#ffffff', '#dff6ff', '#9ad8f0', '#5a9ac0'],
  gold:  ['#ffffff', '#fff0a0', '#ffc840', '#e08a1c'],
  war:   ['#ffffff', '#ffd08a', '#ff8a3a', '#c8402a'],
  guard: ['#ffffff', '#c8e0ff', '#7ab0ff', '#3a6ad0']
};
// 스킬 효과 표: mot 동작(여러 번이면 배열) · hold 모으는 초 · charge 모으기 · trail 자취 두께(1~3) · hit 맞히기 · after 남은 것 · shake 흔들림 · all 모든 적
const SKFX = {
  bash:        { name: '강타',          mot: 'down',   hold: 0.18, pal: 'power', charge: 'glow',   trail: 2, hit: 'star',  big: 1, after: 'dust',  shake: 2 },
  sweep:       { name: '휩쓸기',        mot: 'side',   hold: 0.12, pal: 'wind',  charge: 'glow',   trail: 2, hit: 'wave',  all: 1 },
  earthsplit:  { name: '대지 가르기',   mot: 'down',   hold: 0.22, pal: 'earth', charge: 'gather', trail: 2, hit: 'quake', all: 1, shake: 3 },
  titanblow:   { name: '거인의 일격',   mot: 'down',   hold: 0.42, pal: 'power', charge: 'aura',   trail: 3, hit: 'star',  big: 2, after: 'ring',  shake: 4 },
  shieldbash:  { name: '방패 치기',     mot: 'bash',   hold: 0.14, pal: 'steel', charge: 'shield', trail: 1, hit: 'stun',  big: 0, shake: 2 },
  lancecharge: { name: '돌격',          mot: 'thrust', hold: 0.22, pal: 'steel', charge: 'gather', trail: 1, hit: 'pierce', dash: 1, shake: 2 },
  holystrike:  { name: '성스러운 일격', mot: 'down',   hold: 0.18, pal: 'holy',  charge: 'glow',   trail: 2, hit: 'cross', after: 'motes' },
  judgment:    { name: '천상의 심판',   mot: 'raise',  hold: 0.3,  pal: 'holy',  charge: 'tip',    trail: 0, hit: 'pillar', all: 1, after: 'motes' },
  glory:       { name: '영광의 연격',   mot: ['down', 'up', 'side'], hold: 0.1, pal: 'gold', charge: 'glow', trail: 2, hit: 'star', big: 0, lastBig: 1 },
  ironwall:    { name: '철벽',          mot: 'guard',  cast: 'barrier', pal: 'guard' },
  warcry:      { name: '전쟁의 함성',   mot: 'raise',  cast: 'shout',   pal: 'war' }
};
const SC = { W: 200, H: 96, GY: 86, AX: 64, Z: 1.25, FZ: 1.4 };
const skFoes = sp => (sp.all ? [['bandit', 128, 84], ['wolf', 158, 88], ['slime', 184, 83]] : [['bandit', 150, 86]]);
// 동작 시간표: 첫 동작은 셋째 장(2)을 hold만큼 더 · 이어지는 동작은 앞 동작의 맞히는 장 + MOT_HOLD 뒤 셋째 장부터
function skSegs(sp) {
  const chain = Array.isArray(sp.mot) ? sp.mot : [sp.mot], segs = [];
  chain.forEach((mk, i) => {
    const f0 = i ? MOT_CHAIN0 : 0, T = PXS_MOT_T.map((v, f) => v + (f === 2 && i === 0 ? sp.hold || 0 : 0));
    const toHit = T.slice(f0, PXS_MOT_HIT).reduce((s, v) => s + v, 0), t0 = i ? segs[i - 1].t0 + segs[i - 1].toHit + MOT_HOLD : 0;
    segs.push({ mk, f0, T, t0, toHit, hit: t0 + toHit, last: i === chain.length - 1 });
  });
  return segs;
}
function skFrame(sp, tau) {
  const segs = skSegs(sp); let s = null;
  for (const q of segs) if (tau >= q.t0) s = q;
  if (!s || tau < 0) return null;
  let e = tau - s.t0;
  for (let f = s.f0; f < 8; f++) { if (e < s.T[f]) return { mk: s.mk, f, seg: s, segs, u: e / s.T[f] }; e -= s.T[f]; }
  return s.last ? null : { mk: s.mk, f: 7, seg: s, segs, u: 1 };
}
// 칸 그리기: 2×2 (뭉툭) · 1×1 (작은 반짝임)
const skC = (g, x, y, c, a) => { if (a != null) g.globalAlpha = a; R(g, Math.round(x / 2) * 2, Math.round(y / 2) * 2, 2, 2, c); if (a != null) g.globalAlpha = 1; };
const skP = (g, x, y, c) => R(g, Math.round(x), Math.round(y), 1, 1, c);
const hash = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
// 모험가 칸(뭉툭 칸 X, Y, 몸이 나간 칸 포함) → 장면 좌표
const skXY = (X, Y, z) => [SC.AX + (2 * X - 19) * z, SC.GY + (2 * Y - 47) * z];
function skBlade(fr, great) {   // 지금 장의 칼날 칸 (몸이 나간 칸 포함)
  const F = pxsMotFr(fr.mk, fr.f); return pxsMSword(F, great).map(([x, y, ch]) => [Math.round(x) + F.dx, Math.round(y), ch]);
}
function skShieldCells(a, fr) {
  const F = pxsMotFr(fr.mk, fr.f), shape = pxsMotShield(a); if (!shape || !F.sh || !F.sh[2]) return [];
  const rows = pxRows(PX_OFFSHAPE[shape]), out = [], x0 = F.sh[0] + F.lean + F.dx, y0 = F.sh[1] + F.cr;
  rows.forEach((r, j) => [...r].forEach((ch, k) => ch !== '.' && out.push([x0 + k, y0 + j]))); return out;
}
// ① 모으기
function skCharge(g, a, sp, fr, tau, P) {
  const segs = fr.segs, s0 = segs[0], k = Math.max(0, Math.min(1, tau / s0.hit)), z = SC.Z;
  if (fr.seg !== s0 && sp.charge !== 'glow') return;
  const blade = skBlade(fr, false), tip = blade[blade.length - 1], [tx, ty] = skXY(tip[0], tip[1], z), flick = Math.floor(tau * 25) % 2;
  const glow = kk => {   // 칼날을 스킬 색으로 + 둘레 한 칸
    const own = new Set(blade.map(([x, y]) => x + ',' + y));
    for (const [x, y] of blade) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = (x + dx) + ',' + (y + dy); if (own.has(q)) continue; own.add(q); const [X, Y] = skXY(x + dx, y + dy, z); skC(g, X, Y, P[flick ? 1 : 2], 0.35 + 0.5 * kk); }
    for (const [x, y] of blade.slice(2)) { const [X, Y] = skXY(x, y, z); skC(g, X, Y, P[0]); }
  };
  if (sp.charge === 'glow' || sp.charge === 'gather' || sp.charge === 'aura') {
    if (fr.f >= 1 && fr.f <= 4) glow(fr.f >= 2 ? 1 : 0.4);
    if ((sp.charge === 'gather' || sp.charge === 'aura') && fr.seg === s0 && fr.f <= 2) for (let i = 0; i < 8; i++) {   // 빛 알갱이가 칼끝으로 모인다
      const an = i * 0.785 + 0.3, r = 22 * (1 - k) + 2; skC(g, tx + Math.cos(an) * r, ty + Math.sin(an) * r * 0.8, P[i % 2 ? 1 : 2]);
    }
  }
  if (sp.charge === 'aura' && fr.seg === s0 && fr.f <= 3) {   // 온몸에 기운: 발밑 고리 + 위로 오르는 불티
    const rr = 8 + 6 * k; for (let i = 0; i < 14; i++) { const an = i / 14 * Math.PI * 2; skC(g, SC.AX + 2 + Math.cos(an) * rr, SC.GY - 1 + Math.sin(an) * rr * 0.28, P[i % 2 ? 2 : 3], 0.8); }
    for (let i = 0; i < 6; i++) { const u = (tau * 1.8 + hash(i, 1)) % 1; skC(g, SC.AX - 8 + hash(i, 2) * 22, SC.GY - 4 - u * 34, P[u < 0.5 ? 1 : 2], 1 - u); }
  }
  if (sp.charge === 'shield' && fr.f >= 1 && fr.f <= 4) {   // 방패에 빛
    const cells = skShieldCells(a, fr), own = new Set(cells.map(([x, y]) => x + ',' + y));
    for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [0, 1], [0, -1]]) { const q = (x + dx) + ',' + (y + dy); if (own.has(q)) continue; own.add(q); const [X, Y] = skXY(x + dx, y + dy, z); skC(g, X, Y, P[flick ? 1 : 2], 0.9); }
  }
  if (sp.charge === 'tip') {   // 칼끝에 빛이 모이고 하늘로 쏜다
    const r = 2 + 5 * k; for (let i = 0; i < 8; i++) { const an = i * 0.785 + tau * 3; skC(g, tx + Math.cos(an) * r, ty + Math.sin(an) * r, P[i % 2 ? 1 : 2]); }
    skC(g, tx, ty, P[0]); skC(g, tx - 2, ty, P[1]); skC(g, tx + 2, ty, P[1]); skC(g, tx, ty - 2, P[1]); skC(g, tx, ty + 2, P[1]);
    if (k > 0.75) for (let y = ty - 4; y > 0; y -= 2) skC(g, tx, y, (y / 2) % 2 ? P[0] : P[1], 0.9);
  }
}
// ② 휘두르기: 동작 자취를 스킬 색으로, 바깥 한두 칸 더
function skTrail(g, a, sp, fr, P) {
  if (!sp.trail) return;
  const s = pxsAdvSprite(a, 'm:' + fr.mk, fr.f), F = s.mfx; if (!F) return;
  const all = F.back.concat(F.front), own = new Set(all.map(([x, y]) => x + ',' + y)), ring = [], z = SC.Z;
  if (sp.trail >= 2) for (const [x, y] of all) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = (x + dx) + ',' + (y + dy); if (!own.has(q)) { own.add(q); ring.push([x + dx, y + dy, 2]); } }
  const ring2 = [];
  if (sp.trail >= 3) for (const [x, y] of ring) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = (x + dx) + ',' + (y + dy); if (!own.has(q)) { own.add(q); ring2.push([x + dx, y + dy, 3]); } }
  for (const [x, y, ci] of ring2.concat(ring, all)) { const [X, Y] = skXY(x, y, z); skC(g, X, Y, P[Math.min(3, ci)]); }
}
// ③ 맞히기 (적 자리 cx, cy · 맞은 뒤 초 e · 크기 big)
function skStar(g, cx, cy, e, P, big) {
  const b = big || 0;
  if (e < 0) return;
  if (e < 0.05) { const r = 4 + 2 * b; for (let y = -r; y <= r; y += 2) for (let x = -r; x <= r; x += 2) if (Math.abs(x) + Math.abs(y) <= r) skC(g, cx + x, cy + y, Math.abs(x) + Math.abs(y) < r - 2 ? P[0] : P[1]); return; }
  if (e < 0.18) {
    const u = (e - 0.05) / 0.13, L = 4 + (8 + 4 * b) * u;
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + 0.2, l = i % 2 ? L * 0.6 : L; for (let d = 2; d <= l; d += 2) skC(g, cx + Math.cos(an) * d, cy + Math.sin(an) * d * 0.85, d < l * 0.4 ? P[0] : d < l * 0.75 ? P[1] : P[2]); }
    const rr = 5 + (6 + 3 * b) * u; for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2; skC(g, cx + Math.cos(an) * rr, cy + Math.sin(an) * rr * 0.7, P[2], 1 - u * 0.5); }
    return;
  }
  if (e < 0.5) {   // 불꽃이 튀어 떨어진다
    const u = (e - 0.18) / 0.32;
    for (let i = 0; i < 8 + 4 * b; i++) { const an = hash(i, 3) * Math.PI * 2, v = 50 + hash(i, 4) * 50 + 20 * b, x = cx + Math.cos(an) * v * (e - 0.18), y = cy + Math.sin(an) * v * (e - 0.18) * 0.8 + 140 * (e - 0.18) * (e - 0.18); skC(g, x, y, P[1 + (i % 3)], 1 - u); }
  }
}
function skWave(g, x, cy, P, a) {   // 휩쓸기 초승달: 세로로 휜 ")" 모양
  for (let j = -6; j <= 6; j++) { const yy = cy + j * 2, bend = 6 * (1 - (j / 6) * (j / 6)); skC(g, x + bend, yy, P[0], a); skC(g, x + bend - 2, yy, P[1], a); if (Math.abs(j) < 5) skC(g, x + bend - 4, yy, P[2], a * 0.8); }
}
function skHit(g, sp, foes, tHit, tau, P, segs) {
  const big = sp.big || 0;
  for (const [id, fx, fy] of foes) {
    const cy = fy - Math.min(30, monH(id) * SC.FZ) * 0.5;
    if (sp.hit === 'star') for (const s of segs) skStar(g, fx, cy, tau - s.hit, P, s.last && sp.lastBig ? 1 : big);
    if (sp.hit === 'stun') { skStar(g, fx, cy, tau - tHit, P, 0); const e = tau - tHit; if (e > 0.12 && e < 1.2) for (let i = 0; i < 3; i++) { const an = e * 7 + i * 2.09, sx = fx + Math.cos(an) * 8, sy = fy - Math.min(30, monH(id) * SC.FZ) - 4 + Math.sin(an) * 2; skC(g, sx, sy, '#ffe066'); skC(g, sx - 2, sy, '#fff6c0'); skC(g, sx + 2, sy, '#fff6c0'); skC(g, sx, sy - 2, '#fff6c0'); skC(g, sx, sy + 2, '#fff6c0'); } }
    if (sp.hit === 'cross') { const e = tau - tHit; if (e >= 0) {
      if (e < 0.05) skStar(g, fx, cy, e, P, 1);
      else if (e < 0.4) { const u = (e - 0.05) / 0.35, h = 14 + 10 * Math.min(1, u * 2), w = 9 + 4 * Math.min(1, u * 2), al = u < 0.6 ? 1 : (1 - u) / 0.4;
        for (let y = -h; y <= h; y += 2) { skC(g, fx, cy + y, P[0], al); skC(g, fx - 2, cy + y, P[1], al); skC(g, fx + 2, cy + y, P[1], al); }
        for (let x = -w; x <= w; x += 2) { skC(g, fx + x, cy - 6, P[0], al); skC(g, fx + x, cy - 4, P[1], al); skC(g, fx + x, cy - 8, P[2], al * 0.8); } }
    } }
    if (sp.hit === 'pillar') { const e = tau - tHit + (fx - 128) * 0.0015; if (e >= 0 && e < 0.6) {
      const top = 0, bot = fy, w = e < 0.08 ? 2 : e < 0.3 ? 10 : 10 * (1 - (e - 0.3) / 0.3) + 2, h = e < 0.08 ? (bot - top) * e / 0.08 : bot - top;
      for (let y = bot - h; y <= bot; y += 2) for (let x = -w / 2; x <= w / 2; x += 2) skC(g, fx + x, y, Math.abs(x) < w / 6 ? P[0] : Math.abs(x) < w / 3 ? P[1] : P[2], 0.9);
      if (e > 0.08) for (let i = 0; i < 18; i++) { const an = i / 18 * Math.PI * 2, rr = 8 + 10 * Math.min(1, (e - 0.08) / 0.3); skC(g, fx + Math.cos(an) * rr, fy + Math.sin(an) * rr * 0.3, P[2], 1 - Math.min(1, (e - 0.08) / 0.5)); }
    } }
    if (sp.hit === 'pierce') { const e = tau - tHit; if (e >= 0 && e < 0.34) {
      const x0 = SC.AX + 40, x1 = fx + 34, al = e < 0.2 ? 1 : 1 - (e - 0.2) / 0.14, th = e < 0.06 ? 0 : e < 0.2 ? 2 : 0;
      for (let x = x0 + (e > 0.2 ? (x1 - x0) * (e - 0.2) / 0.14 : 0); x <= x1; x += 2) { skC(g, x, cy, P[0], al); if (th) { skC(g, x, cy - 2, P[1], al); skC(g, x, cy + 2, P[1], al); } }
      skStar(g, fx, cy, e, P, 0);
    } }
  }
  if (sp.hit === 'wave') {   // 초승달이 적을 꿰뚫고 지나간다 → 지나갈 때 적마다 작은 별
    const e = tau - tHit, x = SC.AX + 30 + e * 260;
    if (e >= 0 && x < SC.W + 10) skWave(g, x, SC.GY - 16, P, e < 0.4 ? 1 : 0.6);
    for (const [id, fx, fy] of foes) { const th = tHit + (fx - SC.AX - 30) / 260, cy = fy - Math.min(30, monH(id) * SC.FZ) * 0.5; skStar(g, fx, cy, tau - th, P, 0); }
  }
  if (sp.hit === 'quake') {   // 땅을 치면 금이 적 쪽으로 달려가고, 적 밑에서 바위가 솟는다
    const e = tau - tHit, x0 = SC.AX + 34, xe = x0 + Math.max(0, e) * 240;
    if (e >= 0) {
      if (e < 0.12) for (let i = 0; i < 10; i++) { const an = Math.PI + i / 9 * Math.PI, r = 4 + e * 90; skC(g, x0 + Math.cos(an) * r, SC.GY - 2 + Math.sin(an) * r * 0.5, P[i % 2 ? 1 : 2]); }
      for (let x = x0; x < Math.min(xe, SC.W); x += 2) { const j = Math.round(Math.sin(x * 0.55) * 1.2 + Math.sin(x * 0.21) * 1.5); skC(g, x, SC.GY - 1 + j * 2, P[3], e < 0.8 ? 1 : Math.max(0, 1 - (e - 0.8) / 0.4)); if (x % 6 === 0) skC(g, x, SC.GY - 3 + j * 2, P[1], 0.8); }
      for (const [id, fx, fy] of foes) { const th = (fx - x0) / 240, ee = e - th; if (ee < 0 || ee > 0.7) continue;
        for (let i = 0; i < 5; i++) { const vx = (hash(i, 5) - 0.5) * 50, vy = -70 - hash(i, 6) * 50, x = fx + (i - 2) * 4 + vx * ee, y = fy + vy * ee + 260 * ee * ee; if (y <= fy + 2) { skC(g, x, y, P[2]); skC(g, x + 2, y, P[3]); skC(g, x, y - 2, P[1]); } }
        if (ee < 0.4) for (let i = 0; i < 6; i++) { const r = 4 + ee * 40; skC(g, fx + (i - 2.5) * r / 2.5, fy - 2 - Math.abs(Math.sin(i)) * r * 0.4, '#d8c8b0', 0.7 * (1 - ee / 0.4)); }
      }
    }
  }
}
// ④ 남은 것
function skAfter(g, sp, foes, tHit, tau, P) {
  const e = tau - tHit; if (e < 0.15 || !sp.after) return;
  for (const [id, fx, fy] of foes) {
    if (sp.after === 'dust' && e < 0.9) { const u = (e - 0.15) / 0.75; for (let i = 0; i < 6; i++) { const x = fx + (i - 2.5) * (6 + u * 10), y = fy - 2 - Math.abs(Math.sin(i * 1.7)) * 4 - u * 6; skC(g, x, y, i % 2 ? '#d8c8b0' : '#b8a890', 0.75 * (1 - u)); } }
    if (sp.after === 'motes' && e < 1.2) { const u = (e - 0.15) / 1.05; for (let i = 0; i < 7; i++) { const x = fx + (hash(i, 7) - 0.5) * 26 + Math.sin(e * 4 + i) * 2, y = fy - 6 - (hash(i, 8) * 20 + u * 26); if (Math.floor(e * 12 + i) % 3) skP(g, x, y, P[i % 2 ? 0 : 1]); else { skP(g, x, y, P[0]); skP(g, x - 1, y, P[1]); skP(g, x + 1, y, P[1]); skP(g, x, y - 1, P[1]); skP(g, x, y + 1, P[1]); } } }
  }
  if (sp.after === 'ring' && e < 0.7) { const u = (e - 0.15) / 0.55, [id, fx, fy] = foes[0], r = 10 + u * 46; for (let i = 0; i < 28; i++) { const an = i / 28 * Math.PI * 2; skC(g, fx + Math.cos(an) * r, fy + Math.sin(an) * r * 0.22, P[i % 2 ? 2 : 3], 1 - u); } }
}
// 강화 스킬 (철벽 방벽 · 함성 고리)
function skCast(g, a, sp, fr, tau, P) {
  const z = SC.Z, hx = SC.AX + 2, hy = SC.GY - 26;
  if (sp.cast === 'barrier' && tau > 0.1 && tau < 0.75) {
    const u = (tau - 0.1) / 0.65, puls = Math.floor(tau * 12) % 2, rx = 15 + (u < 0.2 ? u * 10 : 2), ry = 20 + (u < 0.2 ? u * 10 : 2), al = u < 0.7 ? 1 : (1 - u) / 0.3;
    for (let i = 0; i < 6; i++) {   // 육각 방벽
      const a0 = i / 6 * Math.PI * 2 + Math.PI / 6, a1 = (i + 1) / 6 * Math.PI * 2 + Math.PI / 6, x0 = hx + Math.cos(a0) * rx, y0 = hy + 6 + Math.sin(a0) * ry, x1 = hx + Math.cos(a1) * rx, y1 = hy + 6 + Math.sin(a1) * ry;
      for (let k = 0; k <= 6; k++) skC(g, x0 + (x1 - x0) * k / 6, y0 + (y1 - y0) * k / 6, puls ? P[1] : P[2], al * 0.85);
    }
    if (u < 0.5) for (let i = 0; i < 5; i++) { const an = i * 1.26 + tau * 6, r = rx - 4; skP(g, hx + Math.cos(an) * r, hy + 6 + Math.sin(an) * ry * 0.8, P[0]); }
    const cells = skShieldCells(a, fr), own = new Set(cells.map(([x, y]) => x + ',' + y));
    for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [0, 1], [0, -1], [-1, 0]]) { const q = (x + dx) + ',' + (y + dy); if (own.has(q)) continue; own.add(q); const [X, Y] = skXY(x + dx, y + dy, z); skC(g, X, Y, P[puls ? 1 : 2], 0.9); }
  }
  if (sp.cast === 'shout' && tau > 0.08 && tau < 0.9) {
    for (let k = 0; k < 3; k++) { const e = tau - 0.08 - k * 0.12; if (e < 0 || e > 0.45) continue; const u = e / 0.45, r = 6 + u * 34; for (let i = 0; i < 24; i++) { const an = i / 24 * Math.PI * 2; skC(g, hx + 4 + Math.cos(an) * r, hy + Math.sin(an) * r * 0.75, P[k === 0 ? 2 : 3], 1 - u); } }
    if (tau < 0.5) for (let i = 0; i < 3; i++) { const an = -0.6 + i * 0.6, x0 = hx + 10, y0 = hy + 2; for (let d = 4; d < 10; d += 2) skC(g, x0 + Math.cos(an) * d, y0 + Math.sin(an) * d, P[0]); }
    for (let i = 0; i < 6; i++) { const u = ((tau - 0.1) * 1.4 + hash(i, 9)) % 1; if (tau > 0.1) skC(g, SC.AX - 10 + hash(i, 10) * 26, SC.GY - 2 - u * 36, P[1 + (i % 2)], 1 - u); }
  }
}
// 장면 한 장
function skScene(id, tau, Zs) {
  const sp = SKFX[id], P = SK_PAL[sp.pal], foes = skFoes(sp), Z = Zs || 3;
  if (!S) S = blankState();
  const a = skAdv(id);
  const c = document.createElement('canvas'); c.width = SC.W * Z; c.height = SC.H * Z;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.scale(Z, Z);
  const fr = tau >= 0 ? skFrame(sp, tau) : null, segs = skSegs(sp), tHit = segs[0].hit, lastHit = segs[segs.length - 1].hit;
  // 흔들림
  const sh = sp.shake && tau >= lastHit && tau < lastHit + 0.18 ? sp.shake : 0;
  if (sh) g.translate(Math.round((hash(Math.floor(tau * 50), 11) - 0.5) * sh), Math.round((hash(Math.floor(tau * 50), 12) - 0.5) * sh));
  // 바탕
  R(g, -4, -4, SC.W + 8, SC.GY - 18 + 4, '#8ab8dc'); R(g, -4, SC.GY - 30, SC.W + 8, 14, '#9cc4a0'); R(g, -4, SC.GY - 16, SC.W + 8, 18, '#6aa04e'); R(g, -4, SC.GY - 6, SC.W + 8, 8, '#a88a5c'); R(g, -4, SC.GY + 2, SC.W + 8, 12, '#5a8a40');
  for (let i = 0; i < 9; i++) R(g, i * 24 + 6, SC.GY - 21, 2, 6, '#8a6a4a');
  // 적
  for (const [fid, fx, fy] of foes) {
    const hitT = sp.hit === 'wave' ? tHit + (fx - SC.AX - 30) / 260 : sp.hit === 'quake' ? tHit + (fx - SC.AX - 34) / 240 : sp.hit === 'pillar' ? tHit - (fx - 128) * 0.0015 : null;
    const hits = sp.cast ? [] : hitT != null ? [hitT] : segs.map(s => s.hit), flash = hits.some(h => tau >= h && tau < h + 0.09), kb = hits.some(h => tau >= h && tau < h + 0.12) ? (sp.big >= 2 ? 4 : 2) : 0;
    shadowAt(g, fx, fy, 9); g.save(); g.translate(fx + kb, fy); g.scale(-1, 1); FLASH = flash ? '#ffffff' : null; drawMon(g, fid, tau + 3, { z: SC.FZ }); FLASH = null; g.restore();
  }
  // 모험가 (+ 돌격: 잔상)
  const mF = fr && pxsMotFr(fr.mk, fr.f), dash = sp.dash && fr && fr.f >= 3 && fr.f <= 6 ? 1.8 : 1, dx = mF ? mF.dx * 2 * SC.Z * dash : 0;
  if (sp.dash && fr && fr.f >= 4 && fr.f <= 6) for (let k = 1; k <= 3; k++) { g.save(); g.globalAlpha = 0.5 - k * 0.12; g.translate(SC.AX + dx - k * 9, SC.GY); FLASH = P[2]; drawAdv(g, a, tau, { side: 1, z: SC.Z, mot: fr }); FLASH = null; g.restore(); }
  if (sp.charge === 'aura' && fr && fr.seg === segs[0] && fr.f >= 1 && fr.f <= 3 && Math.floor(tau * 20) % 2) for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) { g.save(); g.globalAlpha = 0.55; g.translate(SC.AX + dx + ox, SC.GY + oy); FLASH = P[2]; drawAdv(g, a, tau, { side: 1, z: SC.Z, mot: fr }); FLASH = null; g.restore(); }
  shadowAt(g, SC.AX + dx, SC.GY, 9 * SC.Z / 1.25);
  g.save(); g.translate(SC.AX + dx, SC.GY); drawAdv(g, a, tau, fr ? { side: 1, z: SC.Z, mot: fr } : { side: 1, z: SC.Z }); g.restore();
  // 효과
  if (fr) {
    g.save(); if (dash > 1) g.translate(dx - (mF ? mF.dx * 2 * SC.Z : 0), 0);
    if (sp.cast) skCast(g, a, sp, fr, tau, P);
    else { skCharge(g, a, sp, fr, tau, P); if (sp.trail) skTrail(g, a, sp, fr, P); else motFx(g, a, fr, SC.AX, SC.GY, SC.Z, 1); }
    g.restore();
  }
  if (!sp.cast) { skHit(g, sp, foes, tHit, tau, P, segs); skAfter(g, sp, foes, lastHit, tau, P); }
  // 피해 숫자
  if (!sp.cast) for (const [fid, fx, fy] of foes) {
    const hitT = sp.hit === 'wave' ? tHit + (fx - SC.AX - 30) / 260 : sp.hit === 'quake' ? tHit + (fx - SC.AX - 34) / 240 : null;
    (hitT != null ? [{ hit: hitT, last: 1 }] : segs).forEach((s, i) => { const e = tau - s.hit; if (e >= 0 && e < 0.7) drawNum(g, fx + (i - 1) * 6, Math.round(fy - Math.min(30, monH(fid) * SC.FZ) - 6 - e * 14), String([128, 96, 141, 77][i % 4] * (sp.big >= 2 ? 3 : 1)), s.last && sp.big ? '#f7e04a' : '#ffffff'); });
  }
  return c.toDataURL();
}
function skAdv(id) {
  const k = { shieldbash: 'knight', lancecharge: 'knight', holystrike: 'paladin', judgment: 'paladin', glory: 'champion', ironwall: 'warrior' }[id] || 'warrior';
  const off = { knight: ['kite', 2], paladin: ['cross', 6], warrior: ['shield', 2], champion: null }[k];
  const a = makeAdv({ cls: k, lv: 60 }); a.id = 4; a.look = { hair: '#5a3a22', skin: '#e0ac7e' }; a.eq.weapon = makeGear('sword', 4, 0); a.eq.off = off ? makeGear(off[0], off[1], 0) : null;
  return a;
}
window.SK_LIST = () => Object.entries(SKFX).map(([k, v]) => [k, v.name, skSegs(v).map(s => +s.hit.toFixed(3)), v.cast ? 0.9 : skSegs(v)[skSegs(v).length - 1].hit + 0.9]);
window.SK_SCENE = (id, tau, z) => skScene(id, tau, z);
