/* 시안 (빌드 40): 전사 옆모습 공격 동작을 여러 장으로 나눈다.
   몸·머리·다리는 지금 그림 그대로 뭉툭 칸(작업판 2×2)으로 줄이고, 팔·손·칼·방패는 뭉툭 칸 위에 직접 그린다 → 두 배로 키워 굽기.
   좌표는 모두 뭉툭 칸 (작업판 40×48 → 20×24). 옆모습 몸 블록 왼쪽 위 = (6.5, 17), 어깨 ≈ (11, 17). */
const AN = { W: 28, H: PXH / 2, SH: [11, 17] };
// 새 방패 모양 (빌드 38 성기사 방패): 네모 · 바탕 · 십자
PX_OFFSHAPE.cross = `
.111.
12431
14441
12431
12431
12331
.111.`;
PX_SHIELD_SHAPE.cross = 'cross';
PX_OFFAT.side.shield.cross = [1, 16];
// 탑 방패를 띠 무늬로 바꾸는 안 (십자 방패와 구분): 위·아래 띠 + 가운데 돌기
PX_OFFSHAPE.towerB = `
111111
144441
122231
122531
122231
144441
.1111.`;
PX_SHIELD_SHAPE.towerB = 'towerB';
PX_OFFAT.side.shield.towerB = [1, 16];
PX_OFFAT.front.shield.towerB = [2, 17];
PX_OFFAT.front.shield.cross = [3, 17];

// 바탕: 팔·무기·방패·어깨받이 없이 (pxsAdvGrid 앞부분) → 뭉툭 격자 (AN.W 칸 너비)
function anBase(a) {
  const cls = PXL[a.cls] ? a.cls : PXL[jobBase(a.cls)] ? jobBase(a.cls) : 'warrior', L0 = PXL[cls], [L, Q] = pxOffLook(a, L0);
  const ex = L.ex || [], g = pxGrid(PXW, PXH), robe = L.body === 'robe', coat = L.body === 'coat';
  for (const e of ex) { const E = PXS_EX[e]; if (E && E.under) pxPut(g, e === 'cape' ? pxTone(pxRows(E.g), PX_CAPE_KEYS) : pxRows(E.g), SX + E.x, SY + E.y); }
  const body = pxRows(PXS_BODY[L.body] || PXS_BODY.tunic);
  const legs = pxRows(PXS_LEGS[robe ? 'robe' : coat ? 'coat' : 'stand']);
  pxPut(g, body.concat(legs), SX, SY);
  for (const e of ex) { const E = PXS_EX[e]; if (E && !E.under && e !== 'mask' && e !== 'paint' && e !== 'pauldron') pxPut(g, pxRows(E.g), SX + E.x, SY + E.y); }
  const hair = PXS_HAIR[L.hair || ['short', 'long', 'spiky'][(a.id || 0) % 3]] || PXS_HAIR.short;
  pxPut(g, hair, SX - 1, SHY);
  pxPut(g, PXS_FACE, SX - 1, SHY + 4);
  if (L.face) { const F = PXS_HEAD[L.face]; pxPut(g, pxRows(F.g), SX - 1 + (F.x || 0), SHY - F.top); }
  for (const e of ['mask', 'paint']) if (ex.includes(e)) pxPut(g, pxRows(PXS_HEAD[e].g), SX - 1, SHY);
  const H = PXS_HEAD[L.head];
  if (H) pxPut(g, pxRows(H.g), SX - 1 + (H.x || 0), SHY - H.top);
  const c0 = pxChunk(g), c = c0.map(r => r.concat(new Array(AN.W - r.length).fill('.')));
  c[18][12] = '.';   // 몸 그림에 붙은 앞 손을 뗀다 (팔을 따로 그린다)
  // 어깨받이: 뭉툭 칸으로 따로 (팔 위에 얹는다)
  let pa = null;
  if (ex.includes('pauldron')) { const p = pxGrid(PXW, PXH); pxPut(p, pxRows(PXS_EX.pauldron.g), SX + PXS_EX.pauldron.x, SY + PXS_EX.pauldron.y); pa = []; pxChunk(p).forEach((r, y) => r.forEach((ch, x) => ch !== '.' && pa.push([x, y, ch]))); }
  const armTone = L.body === 'plate' || L.body === 'chain' ? { C: 'M', c: 'N' } : L.body === 'bare' ? { C: 'S', c: 's' } : {};
  return { c, L, Q, ex, pa, armTone };
}
// 다리 자세 (뭉툭 칸, x 6부터 · y 21~23)
const AN_LEGS = {
  lunge: ['..UUUUu..', '.Uu...Uu.', 'BB....BBb'],
  brace: ['..UUUu...', '.Uu..Uu..', 'BB...BBb.']
};
function anLegs(c, k) {
  const P = AN_LEGS[k]; if (!P) return;
  for (let j = 0; j < 3; j++) { const y = 21 + j; for (let x = 5; x < 16; x++) c[y][x] = '.'; [...P[j]].forEach((ch, i) => { if (ch !== '.') c[y][6 + i] = ch; }); }
}
// 위 몸 기울이기: 머리·가슴(y ≤ 18)을 dx칸
function anLean(c, dx) {
  if (!dx) return;
  for (let y = 0; y <= 18; y++) { const r = c[y], n = new Array(r.length).fill('.'); for (let x = 0; x < r.length; x++) { const X = x + dx; if (r[x] !== '.' && X >= 0 && X < r.length) n[X] = r[x]; } c[y] = n; }
}
// 웅크리기: 다리 위를 한 칸 내린다 (다리가 짧아진다)
function anCrouch(c) { for (let y = 21; y >= 1; y--) c[y] = c[y - 1].slice(); c[0] = new Array(c[0].length).fill('.'); }
const anSet = (c, x, y, ch, under) => { x = Math.round(x); y = Math.round(y); if (y < 0 || y >= c.length || x < 0 || x >= c[0].length) return; if (under && c[y][x] !== '.') return; c[y][x] = ch; };
const anDir = a => { const r = a * Math.PI / 180; return [Math.cos(r), Math.sin(r)]; };
const AN_HZ = { rh: [3, 1], rt: [8, 2.5] };
function anHz(F) {
  if (F.th == null) return F;
  const t = F.th * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), yy = F.hy || 0;
  const hx = AN_HZ.rh[0] * c, hy = AN_HZ.rh[1] * s + yy, tx = AN_HZ.rt[0] * c, ty = AN_HZ.rt[1] * s + yy, dist = Math.hypot(tx - hx, ty - hy);
  return Object.assign({}, F, { h: [Math.round(hx), Math.round(hy)], a: Math.atan2(ty - hy, tx - hx) * 180 / Math.PI, k: Math.max(0, (dist - 1) / 4), wu: F.wu != null ? F.wu : s < -0.2 });
}
const anF = F => anHz(Object.assign({ k: 1, lean: 0, cr: 0, dx: 0, legs: null }, F));
const anShoulder = F => [AN.SH[0] + F.lean, AN.SH[1] + F.cr];
const anHand = F => { const s = anShoulder(F); return [s[0] + F.h[0], s[1] + F.h[1]]; };
// 칼 칸: 코등이 2칸 · 날 (거리 2부터, 길이 4 × k)
function anSword(F) {
  const [hx, hy] = anHand(F), [dx, dy] = anDir(F.a), px = -dy, py = dx, out = [];
  const Lb = Math.max(1, Math.round(4 * F.k));
  out.push([hx + dx - 0.5 * px, hy + dy - 0.5 * py, 'G'], [hx + dx + 0.5 * px, hy + dy + 0.5 * py, 'G']);
  for (let t = 2; t <= 1 + Lb; t++) out.push([hx + dx * t, hy + dy * t, t === 2 && Lb > 2 ? 'M' : 'x']);
  return out;
}
// 팔: 어깨 → 손 (손 칸은 빼고)
function anArm(F) {
  const [sx, sy] = anShoulder(F), [hx, hy] = anHand(F), n = Math.max(Math.abs(hx - sx), Math.abs(hy - sy)), out = [];
  for (let j = 0; j < n; j++) out.push([sx + (hx - sx) * j / n, sy + (hy - sy) * j / n, j < n / 2 ? 'C' : 'c']);
  return out;
}
// 방패 모양 좁히기 (몸을 틀어 앞으로 내민 방패): 오른쪽 테 바로 안쪽 줄을 뺀다
function anNarrow(rows, w) {
  let R = rows;
  while (R[0].length > w) { const W = R[0].length, drop = W - 2; R = R.map(r => r.slice(0, drop) + r.slice(drop + 1)); }
  return R;
}
// 앞에 겹치는 것(칼날·앞 방패)은 몸과 맞닿는 칸에 어두운 테를 둘러 떼어 보이게 한다
function anOver(c, cells, ring, keep) {
  const R = cells.map(([x, y, ch]) => [Math.round(x), Math.round(y), ch]), own = new Set(R.map(([x, y]) => x + ',' + y));
  if (ring) for (const [x, y] of R) {
    if (ring === 'cross' && !(y >= 0 && y < c.length && c[y][x] !== '.')) continue;   // 칼날: 몸을 가로지르는 칸만
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy, k = X + ',' + Y; if (own.has(k) || (keep && keep.has(k))) continue; if (Y >= 0 && Y < c.length && X >= 0 && X < c[0].length && c[Y][X] !== '.' && c[Y][X] !== 'K') c[Y][X] = 'K'; }
  }
  for (const [x, y, ch] of R) anSet(c, x, y, ch);
}
// 한 장: 뭉툭 격자 (+ 효과 정보)
function anGrid(a, M, i) {
  const F = anF(M.f[i]), B = anBase(a), c = B.c, tone = ch => B.armTone[ch] || ch;
  if (F.legs) anLegs(c, F.legs);
  anLean(c, F.lean);
  if (F.cr) anCrouch(c);
  // 방패 (먼 팔): 뒤에 깔리거나(0) 몸 앞에(1, 테 두름)
  const off = a.eq && a.eq.off, shape = off && PX_SHIELD_SHAPE[off.base];
  let shInfo = null;
  if (shape) {
    const d = F.sh || [...PX_OFFAT.side.shield[shape], 0], rows0 = pxRows(PX_OFFSHAPE[shape]), rows = d[3] ? anNarrow(rows0, d[3]) : rows0;
    const x0 = d[0] + (d[2] ? F.lean : 0), y0 = d[1] + F.cr, cells = [];
    rows.forEach((r, j) => [...r].forEach((ch, k) => ch !== '.' && cells.push([x0 + k, y0 + j, ch])));
    if (d[2]) anOver(c, cells, 'all'); else cells.forEach(([x, y, ch]) => anSet(c, x, y, ch, 1));
    shInfo = { x: x0, y: y0, w: rows[0].length, h: rows.length, front: !!d[2] };
  }
  const sw = anSword(F), arm = anArm(F).map(([x, y, ch]) => [x, y, tone(ch)]), [hx, hy] = anHand(F);
  const mine = new Set(sw.concat(arm).map(([x, y]) => Math.round(x) + ',' + Math.round(y)).concat([hx + ',' + hy]));
  if (F.wu) sw.forEach(([x, y, ch]) => anSet(c, x, y, ch, 1));   // 칼이 몸 뒤로 (횡베기 끝: 먼 쪽)
  arm.forEach(([x, y, ch]) => anSet(c, x, y, ch));
  if (!F.wu) anOver(c, sw, 'cross', mine);
  anSet(c, hx, hy, 'S');
  if (B.pa) B.pa.forEach(([x, y, ch]) => anSet(c, x + F.lean, y + F.cr, ch));
  return { c, B, F, shInfo };
}
// 굽기: 뭉툭 격자를 두 배로 → pxBake (뭉툭 굽기를 거쳐도 그대로)
function anBake(a, M, i, key) {
  const { c, B, F, shInfo } = anGrid(a, M, i), g = pxUp(c.map(r => r.join('')).map(r => r)).map(r => [...r]);
  const s = pxBake('AN|' + key, g, Object.assign(pxPal(B.L, a.look || {}), pxOffPal(a)), SX + 6, SY + 13);
  return { s, F, shInfo };
}
// 효과: 칼끝 자취 · 찌르기 줄 · 방패 충격 · 막기 불꽃 (뭉툭 칸, 화면에 바로 · 테두리 없음)
function anLerp(A, B, s) {
  const L = (p, q) => p + (q - p) * s;
  if (A.th != null && B.th != null) return anF({ th: L(A.th, B.th), hy: L(A.hy || 0, B.hy || 0), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx) });
  return { h: [L(A.h[0], B.h[0]), L(A.h[1], B.h[1])], a: L(A.a, B.a), k: L(A.k, B.k), lean: L(A.lean, B.lean), cr: L(A.cr, B.cr), dx: L(A.dx, B.dx) };
}
function anTrail(M, i) {
  const cov = new Map(), F = anF(M.f[i]), fx = F.fx; if (!fx || fx.k !== 'arc') return cov;
  const seg = (A, B, w0, w1) => {
    for (let s = 0; s <= 1.0001; s += 1 / 40) {
      const P = anLerp(A, B, s), w = (w0 + (w1 - w0) * s) * (fx.a || 1), sx = AN.SH[0] + P.lean + P.dx, sy = AN.SH[1] + P.cr, hx = sx + P.h[0], hy = sy + P.h[1], [dx, dy] = anDir(P.a), Lb = Math.max(1, 4 * P.k);
      for (let t = Math.max(2, 1 + Lb - (w > 0.75 ? 1.6 : 0.8)); t <= 1 + Lb + 0.3; t += 0.2) {
        const X = Math.round(hx + dx * t), Y = Math.round(hy + dy * t), k = X + ',' + Y;
        if (Y > 23) continue;
        const front = P.th != null && Math.sin(P.th * Math.PI / 180) > 0.15, o = cov.get(k);
        if (!o || o.w < w) cov.set(k, { w, front });
      }
    }
  };
  const P0 = i >= 2 ? anF(M.f[i - 2]) : null, P1 = anF(M.f[i - 1]);
  if (P0 && fx.long) seg(P0, P1, 0.3, 0.55);
  seg(P1, F, 0.55, 1);
  return cov;
}
function anFx(g, M, i, OX, OY, shInfo, layer) {
  const F = anF(M.f[i]), fx = F.fx;
  const px = (x, y, col, al) => { g.globalAlpha = al; g.fillStyle = col; g.fillRect(OX + x, OY + y, 1, 1); g.globalAlpha = 1; };
  if (!fx) return;
  if (fx.k === 'arc') {
    for (const [k, { w, front }] of anTrail(M, i)) { if (front !== (layer === 'front')) continue; const [x, y] = k.split(',').map(Number); if (w > 0.72) px(x, y, '#ffffff', 1); else if (w > 0.4) px(x, y, '#fff2a0', 1); }
    return;
  }
  if (fx.k === 'streak') {   // 찌르기: 칼끝 앞으로 번쩍 + 팔 위아래 속도 줄
    const [hx, hy] = anHand(F), X = hx + F.dx, tip = X + 5;
    if (!fx.star) { for (let j = 1; j <= 3; j++) px(tip + j, hy, j < 3 ? '#ffffff' : '#fff2a0', 1); }
    else { px(tip + 1, hy, '#ffffff', 1); px(tip + 2, hy, '#fff2a0', 1); px(tip + 1, hy - 1, '#fff2a0', 1); px(tip + 1, hy + 1, '#fff2a0', 1); }
  }
  if ((fx.k === 'bash' || fx.k === 'block') && shInfo) {
    const X = shInfo.x + shInfo.w + F.dx, Y = shInfo.y + Math.floor(shInfo.h / 2), r = fx.r || 1, al = fx.a || 1;
    if (fx.k === 'bash') {
      // 충격: 방패 앞으로 퍼지는 짧은 줄 + 몸 뒤 속도 줄
      [[1, -2, 1, -1], [1, 0, 1, 0], [1, 2, 1, 1]].forEach(([x0, y0, ddx, ddy]) => { for (let j = 0; j < 1 + r; j++) px(X + x0 + j * ddx + (r - 1), Y + y0 + j * ddy * (y0 ? 1 : 0), j === 0 ? '#ffffff' : '#fff2a0', 1); });
      if (fx.speed) for (let j = 0; j < 4; j++) { px(2 + j + F.dx - 4, 17, j > 1 ? '#ffffff' : '#a8a090', 1); px(1 + j + F.dx - 4, 20, j > 1 ? '#ffffff' : '#a8a090', 1); }
    } else {
      // 막기: 방패 앞 불꽃 (십자 + 튀는 점)
      if (r < 2) { px(X, Y, '#ffffff', 1); px(X, Y - 1, '#ffffff', 1); px(X, Y + 1, '#ffffff', 1); px(X + 1, Y, '#ffffff', 1); px(X, Y - 2, '#fff2a0', 1); px(X, Y + 2, '#fff2a0', 1); px(X + 2, Y, '#fff2a0', 1); }
      [[2, -2], [2, 2], [1, -3], [3, 0], [1, 3]].forEach(([x0, y0], j) => j < 2 + r && px(X + x0 * r, Y + Math.round(y0 * (r > 1 ? 1.4 : 1)), r > 1 ? '#fff2a0' : '#ffffff', 1));
    }
  }
}
// 동작 표 (8장). h = 손 (어깨에서) · a = 칼 방향(도, 0 앞 · -90 위 · 90 아래 · 180 뒤) · k = 칼 길이(앞뒤로 누우면 짧다)
// lean 위 몸 기울기 · cr 웅크림 · legs 다리 · dx 몸 나감 · wu 칼이 몸 뒤 · sh 방패 [x, y, 앞(1), 좁힘] · fx 효과
const AN_M = {
  down: { name: '내려베기', f: [
    { h: [1, -2], a: -70 },
    { h: [2, -5], a: -95, lean: -1 },
    { h: [2, -6], a: -120, lean: -1 },
    { h: [3, -4], a: -45, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: 15, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [3, 2], a: 65, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, 2], a: 45, legs: 'lunge', dx: 3 },
    { h: [1, 1], a: 15, dx: 1 }
  ] },
  up: { name: '올려베기', f: [
    { h: [1, 2], a: 40 },
    { h: [-1, 2], a: 140, lean: -1 },
    { h: [-2, 2], a: 160, lean: -1 },
    { h: [2, 1], a: 80, fx: { k: 'arc', a: 0.8 } },
    { h: [3, -1], a: -20, lean: 1, legs: 'lunge', dx: 3, fx: { k: 'arc', long: 1 } },
    { h: [2, -4], a: -75, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [2, -4], a: -85, legs: 'lunge', dx: 3 },
    { h: [1, -1], a: -30, dx: 1 }
  ] },
  side: { name: '횡베기', f: [
    { th: 140, hy: -1, lean: -1 },
    { th: 165, hy: -2, lean: -1 },
    { th: 178, hy: -2, lean: -1 },
    { th: 125, hy: -1, fx: { k: 'arc', a: 0.75 } },
    { th: 65, hy: -1, legs: 'lunge', dx: 2, fx: { k: 'arc', a: 0.9, long: 1 } },
    { th: 5, hy: -1, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', long: 1 } },
    { th: -45, hy: -1, lean: 1, legs: 'lunge', dx: 4, fx: { k: 'arc', a: 0.6 } },
    { h: [1, 0], a: -10, k: 0.8, dx: 2 }
  ] },
  thrust: { name: '찌르기', f: [
    { h: [1, 0], a: 0 },
    { h: [-1, 0], a: 0, lean: -1 },
    { h: [-2, 0], a: -4, lean: -1, cr: 1 },
    { h: [2, 0], a: 0, legs: 'lunge', dx: 2 },
    { h: [3, 0], a: 0, lean: 1, legs: 'lunge', dx: 5, fx: { k: 'streak' } },
    { h: [3, 0], a: 0, lean: 1, legs: 'lunge', dx: 6, fx: { k: 'streak', star: 1, a: 0.7 } },
    { h: [2, 0], a: 0, legs: 'lunge', dx: 4 },
    { h: [1, 0], a: 0, dx: 1 }
  ] },
  bash: { name: '방패 밀기', f: [
    { h: [-1, 1], a: 120, lean: -1, sh: [5, 16, 1] },
    { h: [-2, 1], a: 150, lean: -1, sh: [8, 16, 1] },
    { h: [-2, 1], a: 150, legs: 'lunge', dx: 2, sh: [10, 16, 1] },
    { h: [-2, 1], a: 150, lean: 1, legs: 'lunge', dx: 5, sh: [11, 16, 1], fx: { k: 'bash', speed: 1 } },
    { h: [-2, 1], a: 150, lean: 1, legs: 'lunge', dx: 6, sh: [11, 16, 1], fx: { k: 'bash', r: 2, a: 0.6 } },
    { h: [-2, 1], a: 150, legs: 'lunge', dx: 5, sh: [10, 16, 1] },
    { h: [-1, 1], a: 120, dx: 3, sh: [7, 16, 1] },
    { h: [0, 1], a: 40, dx: 1, sh: [3, 17, 0] }
  ] },
  block: { name: '방패 막기', f: [
    { h: [-1, 1], a: 120, sh: [6, 16, 1] },
    { h: [-2, 1], a: 140, lean: -1, sh: [9, 15, 1] },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, sh: [11, 14, 1] },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, dx: -2, sh: [11, 14, 1], fx: { k: 'block' } },
    { h: [-2, 1], a: 140, lean: -1, cr: 1, dx: -2, sh: [11, 14, 1], fx: { k: 'block', r: 2, a: 0.55 } },
    { h: [-1, 1], a: 120, cr: 1, dx: -1, sh: [10, 15, 1] },
    { h: [0, 1], a: 80, sh: [7, 16, 1] },
    { h: [0, 1], a: 30, sh: [3, 17, 0] }
  ] }
};
// 화면 한 장 (뭉툭 칸 = 캔버스 1칸): 바탕 · 그림자 · 자취 · 모험가 · 효과
const AN_CW = 46, AN_CH = 30, AN_OX = 8, AN_OY = 2;
function anAdv(r) {
  if (!S) S = blankState();
  const a = makeAdv({ cls: r.cls, lv: 30 }); a.id = r.id || 3; a.look = { hair: r.hair || '#5a3a22', skin: r.skin || '#e0ac7e' };
  a.eq.off = r.off ? { base: r.off[0], t: r.off[1], q: 0, lv: 0 } : null;
  return a;
}
function anCanvas() {
  const c = document.createElement('canvas'); c.width = AN_CW; c.height = AN_CH;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#3a3430'; g.fillRect(0, 0, AN_CW, AN_CH);
  g.fillStyle = '#4a423c'; g.fillRect(0, AN_OY + 24, AN_CW, AN_CH - AN_OY - 24);
  return [c, g];
}
function anShadow(g, dx) { g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(AN_OX + 6 + dx, AN_OY + 23, 8, 1); g.fillRect(AN_OX + 7 + dx, AN_OY + 24, 6, 1); }
const anBlit = (g, s, dx) => g.drawImage(s.cv, 0, 0, s.w, s.h, AN_OX + dx + 9.5 - s.ax / 2, AN_OY + 23.5 - s.ay / 2, s.w / 2, s.h / 2);
window.AN_FRAME = (r, mk, i) => {
  const a = anAdv(r), M = AN_M[mk], [c, g] = anCanvas();
  if (i < 0) { const s = pxsAdvSprite(a, 'idle', -i - 1); anShadow(g, 0); anBlit(g, s, 0); return c.toDataURL(); }
  const { s, F, shInfo } = anBake(a, M, i, r.cls + (r.off || []).join('') + mk + i);
  anShadow(g, F.dx);
  if (F.fx && F.fx.k === 'arc') anFx(g, M, i, AN_OX, AN_OY, shInfo, 'back');
  anBlit(g, s, F.dx);
  if (F.fx) anFx(g, M, i, AN_OX, AN_OY, shInfo, 'front');
  return c.toDataURL();
};
window.AN_NAMES = () => Object.fromEntries(Object.entries(AN_M).map(([k, v]) => [k, [v.name, v.f.length]]));
window.AN_GRID = (r, mk, i) => anGrid(anAdv(r), AN_M[mk], i).c.map(row => row.join(''));
