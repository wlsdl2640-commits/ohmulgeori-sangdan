/* ───────── 스킬 효과 (빌드 41): 칼잡이(전사 계열) 스킬의 동작 + 단계 효과 ─────────
   공격 스킬: ① 모으기(첫 동작의 셋째 장을 hold초 붙잡고 칼·방패·몸에 빛이 모인다) ② 휘두르기(스킬 색 칼끝 자취, 두껍게)
              ③ 맞히기(적 자리: 번쩍 → 모양 → 흩어짐) ④ 남은 것(먼지·빛 알갱이·땅 울림·화면 흔들림).
   강화·치유·도발: 방패 세우기·칼 치켜들기·칼 세우기(치유)·칼끝 겨누기(도발)·흘려 받기·되치기·모래 뿌리기 동작(pxs.js PXS_MOT_OF)
              + 모으기 → 모양(방벽·막·고리·불꽃·빛) → 퍼짐(파티 스킬이면 동료마다 작은 모양).
   칸은 모두 2×2 논리 픽셀(뭉툭 칸)에 맞춘다. 그리는 곳: 모험가 몸 쪽(모으기·자취)은 view.js motFx(몸 좌표, 그림 칸에 맞춤),
   적·파티 쪽은 fx()의 V.fx 'skh'(맞히기)·'skw'(초승달)·'skq'(땅 금)·'skc'(강화)·'shk'(흔들림). 다른 직업은 skfx2.js (빌드 42). */
const SK_PAL = {
  power: ['#ffffff', '#ffe066', '#ff9a2e', '#c0501e'],
  holy:  ['#ffffff', '#fff2a8', '#ffd24a', '#d89a1c'],
  earth: ['#f4e4c4', '#d8b070', '#9a7040', '#5a4428'],
  steel: ['#ffffff', '#d8ecff', '#8ab8f0', '#4a6ab0'],
  wind:  ['#ffffff', '#dff6ff', '#9ad8f0', '#5a9ac0'],
  gold:  ['#ffffff', '#fff0a0', '#ffc840', '#e08a1c'],
  war:   ['#ffffff', '#ffd08a', '#ff8a3a', '#c8402a'],
  guard: ['#ffffff', '#c8e0ff', '#7ab0ff', '#3a6ad0'],
  fire:  ['#fff6c0', '#ffb040', '#f05a2a', '#a8281e'],
  ice:   ['#ffffff', '#c8f4ff', '#7ad0f8', '#3a8ad8'],
  bolt:  ['#ffffff', '#fff8a0', '#a8d0ff', '#5a7ae0'],
  arcane: ['#ffffff', '#e8c8ff', '#b07af0', '#6a3ac0'],
  star:  ['#ffffff', '#e0f0ff', '#a8c8ff', '#f0d060'],
  heal:  ['#ffffff', '#d8ffd0', '#8af08a', '#3aa84a'],
  blood: ['#ffd8d0', '#ff7a6a', '#d8302a', '#801a1a'],
  taunt: ['#ffffff', '#ffb0a0', '#ff5a4a', '#b0201a'],
  sand:  ['#f8ecc8', '#e8c890', '#c8a060', '#8a6a3a']
};
/* 스킬 효과 표. mot 동작(여러 번 치면 배열 — 차례로) · hold 모으는 초 · pal 색 · charge 모으기(glow 칼 빛 · gather 빛 알갱이 · aura 온몸 기운 · shield 방패 빛 · tip 칼끝 빛)
   trail 자취 두께(0 없음 · 1 · 2 · 3) · hit 맞히기(star 별 터짐 · wave 초승달 칼바람 · quake 땅 금과 솟는 바위 · cross 빛 십자 · pillar 빛기둥 · stun 기절 별 · pierce 꿰뚫는 빛줄기)
   big 크기 · lastBig 마지막 한 방만 크게 · after 남은 것(dust 먼지 · motes 빛 알갱이 · ring 땅 울림 · embers 불티 · shards 얼음 조각 · drain 피가 돌아옴) · shake 흔들림 · dash 돌진 잔상 · keep 원래 투사체 효과도
   cast 강화(barrier 육각 방벽 · dome 둥근 막 · shout 함성 고리 · rage 불꽃 기운 · taunt 도발 · heal 치유 빛 · cure 붕대 · cheer 환호 · wind 바람 · counter 되치기 · sand 모래) · party 동료에게도 */
const SKFX = {
  // 전사
  bash:         { mot: 'down', hold: 0.18, pal: 'power', charge: 'glow', trail: 2, hit: 'star', big: 1, after: 'dust', shake: 2 },
  sweep:        { mot: 'side', hold: 0.12, pal: 'wind', charge: 'glow', trail: 2, hit: 'wave' },
  earthsplit:   { mot: 'down', hold: 0.22, pal: 'earth', charge: 'gather', trail: 2, hit: 'quake', shake: 3 },
  titanblow:    { mot: 'down', hold: 0.42, pal: 'power', charge: 'aura', trail: 3, hit: 'star', big: 2, after: 'ring', shake: 4 },
  awk_warrior:  { mot: 'down', hold: 0.3, pal: 'gold', charge: 'aura', trail: 3, hit: 'quake', big: 1, after: 'ring', shake: 4 },
  awk2_warrior: { mot: 'down', hold: 0.45, pal: 'power', charge: 'aura', trail: 3, hit: 'quake', big: 2, after: 'ring', shake: 5 },
  kn_charge:    { mot: 'thrust', hold: 0.2, pal: 'steel', charge: 'gather', trail: 1, hit: 'pierce', dash: 1, shake: 2 },
  ar_combo:     { mot: ['down', 'up', 'side'], hold: 0.1, pal: 'gold', charge: 'glow', trail: 2, hit: 'star', lastBig: 1 },
  dw_smash:     { mot: 'down', hold: 0.25, pal: 'earth', charge: 'glow', trail: 2, hit: 'star', big: 1, after: 'dust', shake: 3 },
  shockwave:    { mot: 'down', hold: 0.22, pal: 'earth', charge: 'gather', trail: 2, hit: 'quake', shake: 3 },
  ar_finish:    { mot: 'thrust', hold: 0.2, pal: 'gold', charge: 'glow', trail: 1, hit: 'pierce', shake: 2 },
  // 검투사 · 챔피언
  arena:        { mot: ['down', 'up'], hold: 0.1, pal: 'gold', charge: 'glow', trail: 2, hit: 'star', lastBig: 1 },
  execute:      { mot: ['down', 'up', 'down'], hold: 0.1, pal: 'war', charge: 'glow', trail: 2, hit: 'star', lastBig: 1, shake: 2 },
  spinslash:    { mot: 'side', hold: 0.15, pal: 'wind', charge: 'glow', trail: 3, hit: 'wave', big: 1 },
  glory:        { mot: ['down', 'up', 'side'], hold: 0.1, pal: 'gold', charge: 'glow', trail: 2, hit: 'star', lastBig: 1 },
  finale:       { mot: ['side', 'up', 'down', 'thrust'], hold: 0.15, pal: 'gold', charge: 'glow', trail: 2, hit: 'star', lastBig: 2, shake: 3 },
  colosseum:    { mot: 'side', hold: 0.3, pal: 'gold', charge: 'aura', trail: 3, hit: 'wave', big: 2, after: 'ring', shake: 4 },
  // 기사 · 성기사
  shieldbash:   { mot: 'bash', hold: 0.14, pal: 'steel', charge: 'shield', trail: 1, hit: 'stun', shake: 2 },
  lancecharge:  { mot: 'thrust', hold: 0.22, pal: 'steel', charge: 'gather', trail: 1, hit: 'pierce', dash: 1, shake: 2 },
  holystrike:   { mot: 'down', hold: 0.18, pal: 'holy', charge: 'glow', trail: 2, hit: 'cross', after: 'motes' },
  judgment:     { mot: 'raise', hold: 0.3, pal: 'holy', charge: 'tip', trail: 0, hit: 'pillar', after: 'motes' },
  divinity:     { mot: 'raise', hold: 0.45, pal: 'holy', charge: 'tip', trail: 0, hit: 'pillar', big: 1, after: 'motes', shake: 3 },
  // 마검사 · 검성
  flameblade:   { mot: 'down', hold: 0.18, pal: 'fire', charge: 'glow', trail: 2, hit: 'star', after: 'embers' },
  frostblade:   { mot: 'side', hold: 0.18, pal: 'ice', charge: 'glow', trail: 2, hit: 'star', after: 'shards' },
  thunderblade: { mot: 'up', hold: 0.2, pal: 'bolt', charge: 'glow', trail: 2, hit: 'star', keep: 1 },
  spellsword:   { mot: 'thrust', hold: 0.25, pal: 'arcane', charge: 'gather', trail: 1, hit: 'pierce', shake: 2 },
  starblade:    { mot: 'down', hold: 0.2, pal: 'star', charge: 'glow', trail: 2, hit: 'cross', after: 'motes' },
  dimension:    { mot: 'side', hold: 0.3, pal: 'arcane', charge: 'aura', trail: 3, hit: 'wave', big: 1, shake: 3 },
  swordsaint:   { mot: 'down', hold: 0.4, pal: 'bolt', charge: 'aura', trail: 3, hit: 'star', big: 2, after: 'ring', keep: 1, shake: 4 },
  // 광전사 · 피의 군주 (빌드 42부터 도끼 동작: 내려찍기·횡베기)
  bloodstrike:  { mot: 'smash', hold: 0.18, pal: 'blood', charge: 'glow', trail: 2, hit: 'star', big: 1, after: 'drain', shake: 2 },
  whirl:        { mot: 'side', hold: 0.14, pal: 'blood', charge: 'glow', trail: 3, hit: 'wave' },
  bloodfeast:   { mot: 'smash', hold: 0.22, pal: 'blood', charge: 'glow', trail: 2, hit: 'star', big: 2, after: 'drain', shake: 3 },
  ragnarok:     { mot: 'smash', hold: 0.45, pal: 'blood', charge: 'aura', trail: 3, hit: 'quake', big: 2, after: 'ring', shake: 5 },
  // 강화 · 치유 · 도발 (공격이 아닌 스킬)
  ironwall:     { mot: 'guard', hold: 0.1, pal: 'guard', cast: 'barrier' },
  fortress:     { mot: 'guard', hold: 0.15, pal: 'steel', cast: 'barrier', big: 1 },
  dw_grit:      { mot: 'guard', hold: 0.1, pal: 'earth', cast: 'barrier' },
  kn_wall:      { mot: 'guard', hold: 0.12, pal: 'guard', cast: 'barrier', party: 1 },
  ar_phalanx:   { mot: 'guard', hold: 0.12, pal: 'gold', cast: 'barrier', party: 1 },
  resolve:      { mot: 'guard', hold: 0.12, pal: 'steel', cast: 'barrier', party: 1 },
  aegis:        { mot: 'guard', hold: 0.2, pal: 'holy', cast: 'dome', party: 1 },
  arcaneguard:  { mot: 'guard', hold: 0.15, pal: 'arcane', cast: 'dome' },
  starward:     { mot: 'guard', hold: 0.15, pal: 'star', cast: 'dome' },
  warcry:       { mot: 'raise', hold: 0.2, pal: 'war', cast: 'shout', party: 1 },
  roar:         { mot: 'raise', hold: 0.18, pal: 'gold', cast: 'shout', party: 1 },
  ar_roar:      { mot: 'raise', hold: 0.18, pal: 'war', cast: 'shout', party: 1 },
  rally:        { mot: 'raise', hold: 0.18, pal: 'steel', cast: 'shout', party: 1 },
  berserk:      { mot: 'raise', hold: 0.25, pal: 'blood', cast: 'rage' },
  manaburst:    { mot: 'raise', hold: 0.25, pal: 'arcane', cast: 'rage' },
  rampage:      { mot: 'raise', hold: 0.25, pal: 'blood', cast: 'rage' },
  bloodmoon:    { mot: 'raise', hold: 0.3, pal: 'blood', cast: 'rage', big: 1 },
  taunt:        { mot: 'taunt', pal: 'taunt', cast: 'taunt' },
  provoke:      { mot: 'taunt', pal: 'taunt', cast: 'taunt', big: 1 },
  guard:        { mot: 'taunt', pal: 'holy', cast: 'taunt' },
  firstaid:     { mot: 'salute', pal: 'heal', cast: 'heal' },
  secondwind:   { mot: 'salute', hold: 0.15, pal: 'heal', cast: 'heal', big: 1 },
  layhands:     { mot: 'salute', hold: 0.15, pal: 'holy', cast: 'heal' },
  bloodthirst:  { mot: 'salute', pal: 'blood', cast: 'heal' },
  bandage:      { mot: 'salute', pal: 'heal', cast: 'cure', party: 1 },
  ar_cheer:     { mot: 'raise', hold: 0.15, pal: 'gold', cast: 'cheer', party: 1 },
  parry:        { mot: 'parry', pal: 'wind', cast: 'wind' },
  ar_sand:      { mot: 'toss', pal: 'sand', cast: 'sand' },
  riposte:      { mot: 'ready', hold: 0.15, pal: 'war', cast: 'counter' }
};
const skOf = id => (id && SKFX[id]) || null;
const SK_WAVE = 260, SK_QUAKE = 240;   // 초승달·땅 금이 나아가는 빠르기 (논리 픽셀/초)
const skH = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
// 뭉툭 칸: 화면(짝수 칸) · 모험가 몸 좌표(그림 칸에 맞춘다: 뭉툭 칸 X → 2X − 19)
function skQ(g, x, y, c, a) { if (a != null && a <= 0.02) return; if (a != null && a < 1) g.globalAlpha = a; R(g, Math.round(x / 2) * 2, Math.round(y / 2) * 2, 2, 2, c); if (a != null && a < 1) g.globalAlpha = 1; }
function skL(g, x, y, c, a) { if (a != null && a <= 0.02) return; if (a != null && a < 1) g.globalAlpha = a; R(g, Math.round((x + 19) / 2) * 2 - 19, Math.round((y + 47) / 2) * 2 - 47, 2, 2, c); if (a != null && a < 1) g.globalAlpha = 1; }
const skCell = (X, Y) => [2 * X - 19, 2 * Y - 47];
function skBladeCells(mo, great) { const F = pxsMotFr(mo.mk, mo.f); return pxsMSword(F, great).map(([x, y]) => [Math.round(x) + F.dx, Math.round(y)]); }
// 무기 칸 (빌드 42): all 무기 전부 · glow 빛낼 칸(칼날·무기 머리·화살) · tip 끝 — 몸 좌표 뭉툭 칸, 몸이 나간 칸까지
function skWpnCells(a, mo) {
  const F = pxsMotFr(mo.mk, mo.f), wk = a ? pxsWk(a) : 'sword', fam = PXS_FAMW[wk] || 'sword', W = pxsMWpn(F, wk).cells.map(([x, y, ch]) => [Math.round(x) + F.dx, Math.round(y), ch]), A = pxsMAxis(F, wk);
  let glow, tip;
  if (fam === 'sword') { glow = W.slice(wk === 'great' ? 3 : 2); tip = W[W.length - 1]; }
  else if (fam === 'bow') { glow = F.ar ? W.filter(c => c[2] === 'v' || c[2] === 'x' || c[2] === 'R') : W.filter(c => c[2] === 'O' || c[2] === 'G'); tip = [Math.round(A.o[0] + F.dx + A.fwd[0] * 2.2), Math.round(A.o[1] + A.fwd[1] * 2.2)]; }
  else if (fam === 'lute' && F.la != null) { glow = W.filter(c => c[2] !== 'v'); const lp = F.lp || [1, 3]; tip = [PXS_SH[0] + F.lean + lp[0] + F.dx, PXS_SH[1] + F.cr + lp[1]]; }
  else { glow = W.filter(c => c[2] !== 'v' && c[2] !== 'G' || fam === 'staff' && wk === 'crozier'); tip = [Math.round(A.o[0] + F.dx + A.u[0] * (A.L1 - 0.6)), Math.round(A.o[1] + A.u[1] * (A.L1 - 0.6))]; }
  return { all: W, glow: glow.length ? glow : W, tip };
}
function skShieldCells(a, mo) {
  const F = pxsMotFr(mo.mk, mo.f), P = pxsShAt(a, F); if (!P || !P.front) return [];
  const rows = P.rows, out = [], x0 = P.x + F.lean + F.dx, y0 = P.y + F.cr;
  rows.forEach((r, j) => [...r].forEach((ch, k) => ch !== '.' && out.push([x0 + k, y0 + j]))); return out;
}
function skRing(cells) {   // 칸 둘레 한 칸
  const own = new Set(cells.map(([x, y]) => x + ',' + y)), out = [];
  for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = (x + dx) + ',' + (y + dy); if (!own.has(q)) { own.add(q); out.push([x + dx, y + dy]); } }
  return out;
}
/* ① 모으기 + ② 휘두르기 (몸 좌표, view.js motFx가 부른다). mo: { mk, f, e 첫 동작부터 지난 초, hit 첫 맞힘까지, first 첫 동작인가 } */
function skAdvFx(g, a, mo, sk, t) {
  const P = SK_PAL[sk.pal], fl = Math.floor(t * 25) % 2, k = Math.max(0, Math.min(1, mo.e / Math.max(0.01, mo.hit)));
  if (sk.charge && mo.f >= 1 && mo.f <= 4 && (mo.first || sk.charge === 'glow')) {
    if (sk.charge === 'glow' || sk.charge === 'gather' || sk.charge === 'aura') {   // 칼날에 스킬 색 빛 + 둘레
      const W = skWpnCells(a, mo), kk = mo.f >= 2 ? 1 : 0.4;
      for (const [x, y] of skRing(W.all)) { const [X, Y] = skCell(x, y); skL(g, X, Y, P[fl ? 1 : 2], 0.35 + 0.5 * kk); }
      for (const [x, y] of W.glow) { const [X, Y] = skCell(x, y); skL(g, X, Y, P[0]); }
    }
    if (sk.charge === 'shield') { for (const [x, y] of skRing(skShieldCells(a, mo))) { const [X, Y] = skCell(x, y); skL(g, X, Y, P[fl ? 1 : 2], 0.9); } }
  }
  if (mo.first && mo.f <= 2) {
    const tip = skWpnCells(a, mo).tip, [tx, ty] = skCell(tip[0], tip[1]);
    if (sk.charge === 'gather' || sk.charge === 'aura') for (let i = 0; i < 8; i++) { const an = i * 0.785 + 0.3, r = 22 * (1 - k) + 2; skL(g, tx + Math.cos(an) * r, ty + Math.sin(an) * r * 0.8, P[i % 2 ? 1 : 2]); }
    if (sk.charge === 'aura') {   // 온몸 기운: 발밑 고리 + 위로 오르는 불티
      const rr = 8 + 6 * k; for (let i = 0; i < 14; i++) { const an = i / 14 * Math.PI * 2; skL(g, Math.cos(an) * rr, -1 + Math.sin(an) * rr * 0.28, P[i % 2 ? 2 : 3], 0.8); }
      for (let i = 0; i < 6; i++) { const u = (t * 1.8 + skH(i, 1)) % 1; skL(g, -10 + skH(i, 2) * 22, -4 - u * 34, P[u < 0.5 ? 1 : 2], 1 - u); }
    }
    if (sk.charge === 'tip') {   // 칼끝에 빛이 모이고, 다 모이면 하늘로 쏜다
      const r = 2 + 5 * k; for (let i = 0; i < 8; i++) { const an = i * 0.785 + t * 3; skL(g, tx + Math.cos(an) * r, ty + Math.sin(an) * r, P[i % 2 ? 1 : 2]); }
      for (const [dx, dy, c] of [[0, 0, 0], [-2, 0, 1], [2, 0, 1], [0, -2, 1], [0, 2, 1]]) skL(g, tx + dx, ty + dy, P[c]);
      if (k > 0.75) for (let y = ty - 4; y > -160; y -= 2) skL(g, tx, y, (Math.round(y / 2) % 2) ? P[0] : P[1], 0.9);
    }
  }
  // ② 자취: 동작 자취를 스킬 색으로 + 바깥 한두 칸 (몸 뒤 자취의 둘레는 그림을 덮지 않는다)
  if (!sk.trail) return mo.mk === 'raise' || mo.mk === 'guard' || mo.mk === 'sraise' || mo.mk === 'praise' || mo.mk === 'braise' || mo.mk === 'lraise';
  const s = pxsAdvSprite(a, 'm:' + mo.mk, mo.f), F = s.mfx; if (!F) return true;
  const dx = pxsMotFr(mo.mk, mo.f).dx, occ = F.occ || [], hid = (x, y) => occ[y] && occ[y][x - dx] && occ[y][x - dx] !== '.';
  const cells = [], all = F.back.concat(F.front), own = new Set(all.map(([x, y]) => x + ',' + y)), front = new Set(F.front.map(([x, y]) => x + ',' + y));
  let ring = [];
  if (sk.trail >= 2) for (const [x, y] of all) for (const [ddx, ddy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + ddx, Y = y + ddy, q = X + ',' + Y; if (own.has(q)) continue; own.add(q); if (!front.has(x + ',' + y) && hid(X, Y)) continue; ring.push([X, Y, 2]); }
  if (sk.trail >= 3) { const r2 = []; for (const [x, y] of ring) for (const [ddx, ddy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + ddx, Y = y + ddy, q = X + ',' + Y; if (own.has(q) || hid(X, Y)) continue; own.add(q); r2.push([X, Y, 3]); } ring = r2.concat(ring); }
  for (const [x, y, ci] of ring.concat(all)) { const [X, Y] = skCell(x, y); skL(g, X, Y, P[Math.min(3, ci)]); }
  return true;
}
/* ③ 맞히기: 별 터짐 (번쩍 → 빛살·고리 → 튀는 불티) */
function skStar(g, cx, cy, e, P, big) {
  const b = big || 0; if (e < 0) return;
  if (e < 0.05) { const r = 4 + 2 * b; for (let y = -r; y <= r; y += 2) for (let x = -r; x <= r; x += 2) if (Math.abs(x) + Math.abs(y) <= r) skQ(g, cx + x, cy + y, Math.abs(x) + Math.abs(y) < r - 2 ? P[0] : P[1]); return; }
  if (e < 0.18) {
    const u = (e - 0.05) / 0.13, L = 4 + (8 + 4 * b) * u;
    for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + 0.2, l = i % 2 ? L * 0.6 : L; for (let d = 2; d <= l; d += 2) skQ(g, cx + Math.cos(an) * d, cy + Math.sin(an) * d * 0.85, d < l * 0.4 ? P[0] : d < l * 0.75 ? P[1] : P[2]); }
    const rr = 5 + (6 + 3 * b) * u; for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2; skQ(g, cx + Math.cos(an) * rr, cy + Math.sin(an) * rr * 0.7, P[2], 1 - u * 0.5); }
    return;
  }
  if (e < 0.5) { const u = (e - 0.18) / 0.32, q = e - 0.18; for (let i = 0; i < 8 + 4 * b; i++) { const an = skH(i, 3) * Math.PI * 2, v = 50 + skH(i, 4) * 50 + 20 * b; skQ(g, cx + Math.cos(an) * v * q, cy + Math.sin(an) * v * q * 0.8 + 140 * q * q, P[1 + (i % 3)], 1 - u); } }
}
function skDraw(g, f, t) {
  const sk = SKFX[f.id]; if (!sk) return;
  const P = SK_PAL[sk.pal], e = t - f.t0;
  if (f.k === 'shk') { if (!f.done) { f.done = 1; V.shake = Math.max(V.shake, f.n); } return; }
  if (f.k === 'skw') {   // 초승달 칼바람: 세로로 휜 ")" — 나아가며 적을 꿰뚫는다
    const x = f.x0 + f.dir * e * SK_WAVE, cy = f.y, a = e < 0.4 ? 1 : 0.6, s = f.dir, h = 6 + (sk.big || 0) * 2;
    for (let j = -h; j <= h; j++) { const yy = cy + j * 2, bend = 6 * (1 - (j / h) * (j / h)); skQ(g, x + s * bend, yy, P[0], a); skQ(g, x + s * (bend - 2), yy, P[1], a); if (Math.abs(j) < h - 1) skQ(g, x + s * (bend - 4), yy, P[2], a * 0.8); }
    return;
  }
  if (f.k === 'skq') {   // 땅을 치면 금이 적 쪽으로 달려간다 (첫 칸에 흙 튐)
    const x1 = f.x0 + f.dir * Math.max(0, e) * SK_QUAKE, al = e < 0.8 ? 1 : Math.max(0, 1 - (e - 0.8) / 0.4);
    if (e < 0.12) for (let i = 0; i < 10; i++) { const an = Math.PI + i / 9 * Math.PI, r = 4 + e * 90; skQ(g, f.x0 + Math.cos(an) * r, f.gy - 2 + Math.sin(an) * r * 0.5, P[i % 2 ? 1 : 2]); }
    for (let x = f.x0; f.dir > 0 ? x < Math.min(x1, f.xe) : x > Math.max(x1, f.xe); x += 2 * f.dir) { const j = Math.round(Math.sin(x * 0.55) * 1.2 + Math.sin(x * 0.21) * 1.5); skQ(g, x, f.gy - 1 + j * 2, P[3], al); if (Math.round(x) % 6 === 0) skQ(g, x, f.gy - 3 + j * 2, P[1], 0.8 * al); }
    return;
  }
  if (f.k === 'skp') return skProjDraw(g, f, sk, P, e);   // 빌드 42
  if (f.k === 'skh') return skHitDraw(g, f, sk, P, e - (f.pre || 0));
  if (f.k === 'skc') return skCastDraw(g, f, sk, P, e, t);
}
function skHitDraw(g, f, sk, P, e) {
  const big = f.big != null ? f.big : sk.big || 0, cx = f.x, cy = f.y, fx = f.x, fy = f.fy;
  if (SK_HIT2[sk.hit]) SK_HIT2[sk.hit](g, f, P, e, big);   // 빌드 42
  else if (e >= 0) switch (sk.hit) {
    case 'star': case 'wave': skStar(g, cx, cy, e, P, big); break;
    case 'stun': skStar(g, cx, cy, e, P, 0); if (e > 0.12 && e < 1.2) for (let i = 0; i < 3; i++) { const an = e * 7 + i * 2.09, sx = fx + Math.cos(an) * 8, sy = fy - f.h - 4 + Math.sin(an) * 2; skQ(g, sx, sy, '#ffe066'); for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) skQ(g, sx + ox, sy + oy, '#fff6c0'); } break;
    case 'cross': if (e < 0.05) skStar(g, cx, cy, e, P, 1); else if (e < 0.4) { const u = (e - 0.05) / 0.35, h = 14 + 10 * Math.min(1, u * 2), w = 9 + 4 * Math.min(1, u * 2), al = u < 0.6 ? 1 : (1 - u) / 0.4;
      for (let y = -h; y <= h; y += 2) { skQ(g, fx, cy + y, P[0], al); skQ(g, fx - 2, cy + y, P[1], al); skQ(g, fx + 2, cy + y, P[1], al); }
      for (let x = -w; x <= w; x += 2) { skQ(g, fx + x, cy - 6, P[0], al); skQ(g, fx + x, cy - 4, P[1], al); skQ(g, fx + x, cy - 8, P[2], al * 0.8); } } break;
    case 'pillar': if (e < 0.6) { const W = 10 + 4 * big, w = e < 0.08 ? 2 : e < 0.3 ? W : W * (1 - (e - 0.3) / 0.3) + 2, top = 0, h = e < 0.08 ? (fy - top) * e / 0.08 : fy - top;
      for (let y = fy - h; y <= fy; y += 2) for (let x = -w / 2; x <= w / 2; x += 2) skQ(g, fx + x, y, Math.abs(x) < w / 6 ? P[0] : Math.abs(x) < w / 3 ? P[1] : P[2], 0.9);
      if (e > 0.08) for (let i = 0; i < 18; i++) { const an = i / 18 * Math.PI * 2, rr = 8 + 10 * Math.min(1, (e - 0.08) / 0.3); skQ(g, fx + Math.cos(an) * rr, fy + Math.sin(an) * rr * 0.3, P[2], 1 - Math.min(1, (e - 0.08) / 0.5)); } } break;
    case 'pierce': if (e < 0.34) { const x0 = f.ax + f.dir * 40, x1 = fx + f.dir * 34, al = e < 0.2 ? 1 : 1 - (e - 0.2) / 0.14, th = e >= 0.06 && e < 0.2, sx = e > 0.2 ? x0 + (x1 - x0) * (e - 0.2) / 0.14 : x0;
      for (let x = sx; f.dir > 0 ? x <= x1 : x >= x1; x += 2 * f.dir) { skQ(g, x, cy, P[0], al); if (th) { skQ(g, x, cy - 2, P[1], al); skQ(g, x, cy + 2, P[1], al); } }
      skStar(g, cx, cy, e, P, 0); } break;
    case 'quake': if (e < 0.7) {   // 적 밑에서 바위가 솟고 흙먼지
      for (let i = 0; i < 5; i++) { const vx = (skH(i, 5) - 0.5) * 50, vy = -70 - skH(i, 6) * 50 - 20 * big, x = fx + (i - 2) * 4 + vx * e, y = fy + vy * e + 260 * e * e; if (y <= fy + 2) { skQ(g, x, y, P[2]); skQ(g, x + 2, y, P[3]); skQ(g, x, y - 2, P[1]); } }
      if (e < 0.4) for (let i = 0; i < 6; i++) { const r = 4 + e * 40; skQ(g, fx + (i - 2.5) * r / 2.5, fy - 2 - Math.abs(Math.sin(i)) * r * 0.4, '#d8c8b0', 0.7 * (1 - e / 0.4)); }
      if (big) skStar(g, cx, cy, e, P, big - 1); } break;
  }
  // ④ 남은 것
  if (e < 0.15 || !sk.after || !f.last) return;
  const u0 = e - 0.15;
  switch (sk.after) {
    case 'dust': if (e < 0.9) { const u = u0 / 0.75; for (let i = 0; i < 6; i++) skQ(g, fx + (i - 2.5) * (6 + u * 10), fy - 2 - Math.abs(Math.sin(i * 1.7)) * 4 - u * 6, i % 2 ? '#d8c8b0' : '#b8a890', 0.75 * (1 - u)); } break;
    case 'motes': if (e < 1.2) { const u = u0 / 1.05; for (let i = 0; i < 7; i++) { const x = fx + (skH(i, 7) - 0.5) * 26 + Math.sin(e * 4 + i) * 2, y = fy - 6 - (skH(i, 8) * 20 + u * 26); if (Math.floor(e * 12 + i) % 3) R(g, Math.round(x), Math.round(y), 1, 1, P[i % 2 ? 0 : 1]); else { R(g, Math.round(x), Math.round(y) - 1, 1, 3, P[1]); R(g, Math.round(x) - 1, Math.round(y), 3, 1, P[1]); R(g, Math.round(x), Math.round(y), 1, 1, P[0]); } } } break;
    case 'ring': if (e < 0.7) { const u = u0 / 0.55, r = 10 + u * 46; for (let i = 0; i < 28; i++) { const an = i / 28 * Math.PI * 2; skQ(g, fx + Math.cos(an) * r, fy + Math.sin(an) * r * 0.22, P[i % 2 ? 2 : 3], 1 - u); } } break;
    case 'embers': if (e < 1.0) { const u = u0 / 0.85; for (let i = 0; i < 8; i++) { const x = fx + (skH(i, 9) - 0.5) * 22 + Math.sin(e * 6 + i) * 3, y = fy - 4 - skH(i, 10) * 10 - u * 30; skQ(g, x, y, P[1 + (i % 3)], 1 - u); } } break;
    case 'shards': if (e < 0.9) { const u = u0 / 0.75; for (let i = 0; i < 7; i++) { const x = fx + (skH(i, 11) - 0.5) * 24, y = cy - 6 + u0 * (30 + skH(i, 12) * 40) + 60 * u0 * u0; if (y < fy + 2) { skQ(g, x, y, P[i % 2 ? 1 : 2], 1 - u * 0.5); if (i % 3 === 0) skQ(g, x, y - 2, P[0], 1 - u * 0.5); } } } break;
    case 'drain': if (e < 0.8) { const u = u0 / 0.65; for (let i = 0; i < 6; i++) { const w = Math.min(1, u * (1 + skH(i, 13))), x = fx + (f.ax - fx) * w, y = cy - Math.sin(w * Math.PI) * (10 + skH(i, 14) * 10); skQ(g, x, y, P[1 + (i % 3)], 1 - w * 0.6); } } break;
    default: if (SK_AFTER2[sk.after]) SK_AFTER2[sk.after](g, f, P, e, u0);
  }
}
/* 강화·치유·도발: 시전자 자리(f.x, f.y 발밑 · f.z 배율)에 모양, 파티 스킬이면 동료(f.tg)마다 작은 모양. 단계: 모으기(0~0.12) → 모양(셋째 장 붙잡는 동안) → 퍼짐 */
function skCastDraw(g, f, sk, P, e, t) {
  const z = f.z || 1.25, hx = f.x + 2 * f.dir, hy = f.y - 28 * z, cy = f.y - 16 * z, fl = Math.floor(t * 12) % 2, hold = sk.hold || 0, peak = 0.15 + hold;
  const fade = e < peak + 0.25 ? 1 : Math.max(0, 1 - (e - peak - 0.25) / 0.35);
  if (e < 0.14) for (let i = 0; i < 8; i++) { const an = i * 0.785, r = 20 * (1 - e / 0.14) + 3; skQ(g, f.x + Math.cos(an) * r, cy + Math.sin(an) * r * 0.9, P[i % 2 ? 1 : 2]); }   // 모으기: 빛 알갱이가 몸으로
  const mates = (fn, delay) => { const ee = e - (peak + (delay || 0)); if (ee >= 0 && ee < 0.5) for (const [x, y, zz] of f.tg || []) fn(x, y, zz || 1.25, ee / 0.5); };
  const hex = (x, y, zz, rx, ry, al, c) => { for (let i = 0; i < 6; i++) { const a0 = i / 6 * Math.PI * 2 + Math.PI / 6, a1 = (i + 1) / 6 * Math.PI * 2 + Math.PI / 6; for (let k = 0; k <= 6; k++) skQ(g, x + Math.cos(a0) * rx + (Math.cos(a1) - Math.cos(a0)) * rx * k / 6, y + Math.sin(a0) * ry + (Math.sin(a1) - Math.sin(a0)) * ry * k / 6, c, al); } };
  const dome = (x, y, zz, r, al) => { const ry = r * 2.1, n = Math.max(16, Math.round(Math.PI * ry / 1.6)); for (let i = 0; i <= n; i++) { const an = Math.PI + i / n * Math.PI; skQ(g, x + Math.cos(an) * r, y - 1 + Math.sin(an) * ry, (i >> 1) % 2 ? P[1] : P[2], al); } for (let i = 0; i < 6; i++) { const an = Math.PI * (1.1 + i * 0.09); skQ(g, x + Math.cos(an) * (r - 4), y - 1 + Math.sin(an) * (ry - 5), P[0], al * 0.85); } for (let i = -3; i <= 3; i++) skQ(g, x + i * r / 4, y - 1, P[2], al * 0.6); };
  const rings = (x, y, n, rmax, al) => { for (let k = 0; k < n; k++) { const ee = e - 0.08 - k * 0.12; if (ee < 0 || ee > 0.45) continue; const u = ee / 0.45, r = 6 + u * rmax, m = Math.max(16, Math.round(Math.PI * 2 * r / 2)); for (let i = 0; i < m; i++) { const an = i / m * Math.PI * 2; skQ(g, x + Math.cos(an) * r, y + Math.sin(an) * r * 0.75, P[k === 0 ? 2 : 3], (1 - u) * al); if (k === 0 && u < 0.5) skQ(g, x + Math.cos(an) * (r - 2), y + Math.sin(an) * (r - 2) * 0.75, P[1], (1 - u * 2) * al); } } };
  if (SK_CAST2[sk.cast]) return SK_CAST2[sk.cast](g, f, sk, P, e, t, z, cy, hy, fade, mates);   // 빌드 42
  switch (sk.cast) {
    case 'barrier': {   // 육각 방벽: 커졌다가 두 번 깜박이고 흩어진다 · 동료에게 작은 방벽
      if (e > 0.1 && e < peak + 0.6) { const u = Math.min(1, (e - 0.1) / 0.12), rx = (11 + 4 * u + 2 * (sk.big || 0)) * z / 1.25, ry = (15 + 5 * u + 2 * (sk.big || 0)) * z / 1.25; hex(f.x + 2 * f.dir, cy - 2, z, rx, ry, fade * 0.9, fl ? P[1] : P[2]); if (e < peak) for (let i = 0; i < 5; i++) { const an = i * 1.26 + t * 6; R(g, Math.round(f.x + Math.cos(an) * (rx - 4)), Math.round(cy + Math.sin(an) * (ry - 6)), 1, 1, P[0]); } }
      mates((x, y, zz, u) => hex(x + 2, y - 16 * zz / 1.25, zz, 9, 12, 1 - u, u < 0.5 ? P[1] : P[2]), 0.05);
      break; }
    case 'dome': {   // 둥근 막: 위에서 내려 덮고 반짝인다
      if (e > 0.1 && e < peak + 0.6) { const u = Math.min(1, (e - 0.1) / 0.15); dome(f.x + 2 * f.dir, f.y, z, (10 + 7 * u) * z / 1.25, fade); }
      mates((x, y, zz, u) => dome(x + 2, y, zz, 15 * zz / 1.25, 1 - u), 0.05);
      break; }
    case 'shout': {   // 함성: 머리에서 고리 셋이 퍼지고 외침 줄 · 동료 머리 위에 불티
      rings(hx + 4 * f.dir, hy, 3, 34, 1);
      if (e > 0.08 && e < peak + 0.2) for (let i = 0; i < 3; i++) { const an = (-0.6 + i * 0.6), x0 = hx + 10 * f.dir, y0 = hy + 2; for (let d = 4; d < 10; d += 2) skQ(g, x0 + f.dir * Math.cos(an) * d, y0 + Math.sin(an) * d, P[0]); }
      for (let i = 0; i < 6; i++) { const u = ((e - 0.1) * 1.4 + skH(i, 9)) % 1; if (e > 0.1 && e < peak + 0.55) skQ(g, f.x - 10 + skH(i, 10) * 26, f.y - 2 - u * 36, P[1 + (i % 2)], (1 - u) * fade); }
      mates((x, y, zz, u) => { const r = 4 + u * 12, m = Math.max(10, Math.round(Math.PI * r)); for (let i = 0; i < m; i++) { const an = i / m * Math.PI * 2; skQ(g, x + Math.cos(an) * r, y - 28 * zz / 1.25 + Math.sin(an) * r * 0.6, P[i % 2 ? 1 : 2], 1 - u); } }, 0.05);
      break; }
    case 'rage': {   // 불꽃 기운: 몸 둘레에 혀처럼 날름이는 불꽃 + 오르는 불티
      if (e > 0.06 && e < peak + 0.6) { const n = 16 + 4 * (sk.big || 0); for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2 + t * 2, rx = 13 * z / 1.25, ry = 19 * z / 1.25, x = f.x + Math.cos(an) * rx, y = cy - 2 + Math.sin(an) * ry, up = (Math.floor(t * 14 + i) % 3) * 2; skQ(g, x, y - up, P[3], fade); skQ(g, x, y - up - 2, P[2], fade); skQ(g, x, y - up - 4, P[1], fade * 0.85); if (i % 2 === 0) skQ(g, x, y - up - 6, P[0], fade * 0.7); } }
      for (let i = 0; i < 8; i++) { const u = ((e - 0.05) * 1.6 + skH(i, 15)) % 1; if (e > 0.05 && e < peak + 0.6) skQ(g, f.x - 12 + skH(i, 16) * 26, f.y - 4 - u * 40, P[1 + (i % 3)], (1 - u) * fade); }
      break; }
    case 'taunt': {   // 도발: 머리 위 「!」가 쿵 → 적 쪽으로 붉은 고리
      if (e < peak + 0.5) { const bx = hx, by = hy - 10 - (e < 0.12 ? (0.12 - e) * 60 : 0), c = fl ? P[0] : P[2]; for (let y = 0; y < 8; y += 2) skQ(g, bx, by + y, c, fade); skQ(g, bx, by + 10, c, fade); }
      for (let k = 0; k < 3 + (sk.big || 0); k++) { const ee = e - 0.1 - k * 0.1; if (ee < 0 || ee > 0.4) continue; const u = ee / 0.4, r = 8 + u * 30, m = Math.max(6, Math.round(r * 0.8)); for (let i = -m; i <= m; i++) { const an = i / m * 0.8; skQ(g, hx + f.dir * Math.cos(an) * r, cy + Math.sin(an) * r * 1.2, P[k % 2 ? 2 : 3], 1 - u); if (k === 0) skQ(g, hx + f.dir * Math.cos(an) * (r - 2), cy + Math.sin(an) * (r - 2) * 1.2, P[1], (1 - u) * 0.8); } }
      break; }
    case 'heal': {   // 치유: 칼끝에서 빛이 퍼지고 초록 빛 알갱이가 오른다 + 반짝 십자
      const big = sk.big || 0;
      if (e > 0.08 && e < peak + 0.7) for (let i = 0; i < 8 + 4 * big; i++) { const u = ((e - 0.08) * 1.2 + skH(i, 17)) % 1, x = f.x - 10 + skH(i, 18) * 24, y = f.y - 2 - u * 34; if (i % 3) R(g, Math.round(x), Math.round(y), 1, 2, P[1 + (i % 3)]); else { R(g, Math.round(x) - 1, Math.round(y), 3, 1, P[1]); R(g, Math.round(x), Math.round(y) - 1, 1, 3, P[1]); R(g, Math.round(x), Math.round(y), 1, 1, P[0]); } }
      if (e > 0.1 && e < peak + 0.3) { const s = e < peak ? 1 : 1 - (e - peak) / 0.3, sx = f.x + 6 * f.dir, sy = hy - 6; skQ(g, sx, sy, P[0], s); for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) skQ(g, sx + ox, sy + oy, P[1], s); if (fl) for (const [ox, oy] of [[-4, 0], [4, 0], [0, -4], [0, 4]]) skQ(g, sx + ox, sy + oy, P[2], s * 0.8); }
      break; }
    case 'cure': {   // 붕대: 동료 둘레를 하얀 작은 십자가 돈다
      const one = (x, y, zz, u) => { for (let i = 0; i < 4; i++) { const an = u * 9 + i * 1.57, px = x + Math.cos(an) * 9, py = y - 16 * zz / 1.25 + Math.sin(an) * 3; R(g, Math.round(px) - 1, Math.round(py), 3, 1, P[0]); R(g, Math.round(px), Math.round(py) - 1, 1, 3, P[0]); R(g, Math.round(px), Math.round(py), 1, 1, P[2]); } };
      if (e < peak + 0.5) one(f.x, f.y, z, e / (peak + 0.5)); mates(one, 0); break; }
    case 'cheer': {   // 환호: 머리 위로 꽃종이 + 초록 빛
      if (e > 0.1 && e < peak + 0.8) for (let i = 0; i < 12; i++) { const u = (e - 0.1) / (peak + 0.7), x = f.x + (skH(i, 19) - 0.5) * 50 * Math.min(1, u * 3), y = hy - 6 - Math.sin(Math.min(1, u * 2) * Math.PI / 2) * 18 + u * u * 40; skQ(g, x, y, ['#ff7a8a', '#ffd84a', '#7ad8ff', '#8af08a'][i % 4], 1 - u * 0.6); }
      mates((x, y, zz, u) => { for (let i = 0; i < 5; i++) R(g, Math.round(x - 6 + i * 3), Math.round(y - 4 - u * 20 - (i % 2) * 4), 1, 2, P[2]); }, 0.1); break; }
    case 'wind': {   // 흘려 받기: 몸 둘레를 바람이 감아 돈다
      if (e > 0.06 && e < peak + 0.7) for (let k = 0; k < 3; k++) for (let i = 0; i < 12; i++) { const an = t * 9 + k * 2.1 + i * 0.2, rx = (14 + k * 2) * z / 1.25, ry = 5; skQ(g, f.x + Math.cos(an) * rx, cy - 12 + k * 10 + Math.sin(an) * ry, i < 4 ? P[0] : i < 8 ? P[1] : P[2], fade * (1 - i / 13)); }
      break; }
    case 'counter': {   // 되치기: 당긴 칼끝이 번쩍 + 붉은 테두리 빛
      if (e > 0.08 && e < peak + 0.5) { const sx = f.x + 18 * f.dir * z / 1.25, sy = cy - 2, s = fl ? 1 : 0.6; skQ(g, sx, sy, P[0], fade); for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) skQ(g, sx + ox, sy + oy, P[1], fade * s); for (const [ox, oy] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) skQ(g, sx + ox, sy + oy, P[2], fade * s * 0.8);
        for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; skQ(g, f.x + Math.cos(an) * 12 * z / 1.25, cy + Math.sin(an) * 17 * z / 1.25, P[3], fade * 0.5); } }
      break; }
    case 'sand': {   // 모래 뿌리기: 손에서 앞쪽으로 모래가 흩뿌려진다
      if (e > 0.12 && e < 0.9) for (let i = 0; i < 14; i++) { const q = e - 0.12 - skH(i, 20) * 0.08; if (q < 0) continue; const vx = 120 + skH(i, 21) * 90, vy = -60 - skH(i, 22) * 50, x = f.x + f.dir * (10 + vx * q), y = cy + vy * q + 160 * q * q; if (y < f.y + 1) skQ(g, x, y, P[i % 4], 1 - Math.min(1, q / 0.7)); }
      break; }
  }
}
STORY.v41 = [
  '빌드 41: 칼을 든 전사 계열의 스킬마다 효과가 생겼다 — ① 모으기(휘두르기 직전에 잠깐 멈추고 칼·방패에 스킬 색 빛이 모인다) ② 휘두르기(스킬 색 자취) ③ 맞히기(번쩍 → 별 터짐·초승달 칼바람·땅 갈라짐·빛 십자·빛기둥·기절 별·꿰뚫는 빛줄기 → 흩어짐) ④ 남은 것(먼지·빛 알갱이·땅 울림, 센 스킬은 화면이 흔들린다).',
  '공격이 아닌 스킬도 동작과 효과가 생겼다 — 방어 강화는 방패를 세우고 육각 방벽, 보호막은 둥근 막, 함성은 칼을 치켜들고 고리, 광폭화는 불꽃 기운, 도발은 칼끝으로 겨누며 「!」, 치유는 칼을 얼굴 앞에 세우고 빛 알갱이, 붕대는 하얀 십자, 흘려 받기는 바람, 되치기는 칼끝 번쩍, 모래 뿌리기는 모래. 파티 스킬은 동료마다 작은 모양이 뜬다.',
  '도끼를 든 광전사·피의 군주는 동작 없이 스킬 효과만 붙었다.'
];
