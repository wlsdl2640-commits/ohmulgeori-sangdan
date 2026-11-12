// 탈것 시안판: 탈것(PXU 몬스터 그림 — 장마다 'key__장' id) + 기수(모험가 옆모습, 다리만 걸터앉은 다리로)
// 기수 그림은 게임 pxsAdvGrid를 그대로 쓰고(머리 · 머리칼 · 얼굴 · 몸 · 활), 다리 글자(U u B b)만 지우고 RIDE_LEG를 얹는다.
// 기수 닻 = 엉덩이 아래 (RIDE_HIP) → 탈것 장의 seat 칸 왼쪽 위 모서리에 맞춘다(뭉툭 칸이 어긋나지 않게 짝수 자리).
const RIDE_HIP = [SX + 7, SY + 8];
const RIDE_LEG = {
  // 걸터앉은 다리: 허벅지가 앞으로 · 무릎에서 꺾여 종아리가 아래로 · 발끝은 앞 (몸 블록 왼쪽 위 기준, y는 SY+6부터)
  ride: { x: 3, y: 6, g: `
...UUUUUUu...
..UUUUUUUUu..
.....uUUUUUu.
.......UUUu..
.......UUUu..
.......UUUu..
......BBBBb..
......BBBBBBb
` },
  // 등자에 일어서 쏘기: 다리를 조금 펴고
  stand: { x: 3, y: 6, g: `
...UUUUUUu...
..UUUUUUUu...
.....UUUUUu..
......UUUu...
......UUUu...
......UUUu...
.....BBBBb...
.....BBBBBBb.
` }
};

// 정면 기수: 게임 pxAdvGrid(앞모습)에서 다리 글자만 지우고, 탈것 등을 사이에 두고 벌려 앉은 다리를 얹는다
const RIDE_HIPF = [BX + 8, BY + 8];
const RIDE_LEGF = { x: -6, y: 7, g: `
......UUUUUUUUUUUUUUu.......
...UUUUUUu........UUUUUUu...
.UUUUu..............UUUUu...
UUUu..................UUUu..
UUu....................UUu..
UUu....................UUu..
BBBb..................BBBb..
BBBb..................BBBb..
` };
const _riderF = function (spec, pose, fr) {
  const a = { id: spec.id != null ? spec.id : 2, cls: spec.cls || 'ranger', look: { hair: spec.hair || HAIRS[2], skin: spec.skin || SKINS[1] }, eq: { weapon: { base: spec.wpn || 'bow', t: 2, q: 0 } } };
  if (spec.heads) for (const k in spec.heads) PXS_HEAD[k] = spec.heads[k];
  if (spec.headsF) for (const k in spec.headsF) PX_HEAD[k] = spec.headsF[k];
  const L = Object.assign({}, PXL[a.cls] || PXL.ranger, spec.L || {});
  const g = pxAdvGrid(a, pose, fr, L);
  for (let y = BY + 7; y < PXH; y++) for (let x = 0; x < PXW; x++) if ('UuBb'.includes(g[y][x])) g[y][x] = '.';
  pxPut(g, pxRows(RIDE_LEGF.g), BX + RIDE_LEGF.x, BY + RIDE_LEGF.y);
  const pal = Object.assign(pxPal(L, a.look), pxOffPal(a), spec.pal || {});
  return pxBake('RIDEF|' + (spec.key || '') + '|' + pose + fr, g, pal, RIDE_HIPF[0], RIDE_HIPF[1]);
};

window.RIDE = {
  rider(spec, pose, fr) {
    const a = { id: spec.id != null ? spec.id : 2, cls: spec.cls || 'ranger', look: { hair: spec.hair || HAIRS[2], skin: spec.skin || SKINS[1] }, eq: { weapon: { base: spec.wpn || 'bow', t: 2, q: 0 } } };
    if (spec.heads) for (const k in spec.heads) PXS_HEAD[k] = spec.heads[k];
    if (spec.exs) for (const k in spec.exs) PXS_EX[k] = spec.exs[k];
    const L = Object.assign({}, PXL[a.cls] || PXL.ranger, spec.L || {});
    const g = pxsAdvGrid(a, pose, fr, L);
    for (let y = SY + 6; y < PXH; y++) for (let x = 0; x < PXW; x++) if ('UuBb'.includes(g[y][x])) g[y][x] = '.';
    const LG = RIDE_LEG[spec.leg || 'ride'];
    pxPut(g, pxRows(LG.g), SX + LG.x, SY + LG.y);
    const pal = Object.assign(pxPal(L, a.look), pxOffPal(a), spec.pal || {});
    return pxBake('RIDE|' + (spec.key || '') + '|' + pose + fr + '|' + (spec.leg || 'ride'), g, pal, RIDE_HIP[0], RIDE_HIP[1]);
  },
  reg(defs) {   // { key: { frames: {장: g}, pal, ax, seat: {장: [x, y]}, float } }
    for (const [k, v] of Object.entries(defs)) for (const [f, g] of Object.entries(v.frames)) {
      PXU[k + '__' + f] = { g, pal: v.pal, ax: v.ax, sh: [0, 0], hip: 99, still: 1, noArm: 1, wpn: 'none', seat: v.seat[f], _rows: null };
    }
  },
  // 한 장: 탈것 장 f + 기수(pose, rfr) → [dataURL, 닻 x, 닻 y] (Z배)
  frame(mk, f, spec, pose, rfr, Z, o = {}) {
    const id = mk + '__' + f, D = PXU[id], m = pxuSprite(id, 'idle', 0), H0 = pxuRows(D).length;
    const r = spec ? (o.fv ? _riderF(spec, pose, rfr) : RIDE.rider(spec, pose, rfr)) : null;
    const sx = m.ax - 1 + 2 * (D.seat[0] - D.ax), sy = m.ay - 1 + 2 * (D.seat[1] - (H0 - 1));
    const L = Math.min(0, r ? sx - r.ax : 0), T = Math.min(0, r ? sy - r.ay : 0);
    const R = Math.max(m.w, r ? sx - r.ax + r.w : 0), B = Math.max(m.h, r ? sy - r.ay + r.h : 0) + (o.shadow ? 4 : 0);
    const W = R - L + 4, H = B - T + 4, ox = 2 - L, oy = 2 - T;
    const c = document.createElement('canvas'); c.width = W * Z; c.height = H * Z;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.scale(Z, Z);
    if (o.shadow) { g.fillStyle = 'rgba(0,0,0,0.28)'; g.beginPath(); g.ellipse(ox + m.ax, oy + m.ay + (o.lift || 0) * 2 + 1, o.shadow, 2.2, 0, 0, Math.PI * 2); g.fill(); }
    g.drawImage(m.cv, ox, oy);
    if (r) g.drawImage(r.cv, ox + sx - r.ax, oy + sy - r.ay);
    if (o.front && PXU[id + '_f']) { const mf = pxuSprite(id + '_f', 'idle', 0); g.drawImage(mf.cv, ox + m.ax - mf.ax, oy + m.ay - mf.ay); }
    return [c.toDataURL(), (ox + m.ax) * Z, (oy + m.ay) * Z];
  },
  // 서 있는 모험가 옆모습(크기 비교용)
  stand(cls, Z, pose = 'idle', fr = 0) {
    const a = { id: 2, cls, look: { hair: HAIRS[2], skin: SKINS[1] }, eq: { weapon: { base: WEAPON_OF[cls] || 'sword', t: 2, q: 0 } } };
    const s = pxsAdvSprite(a, pose, fr), c = document.createElement('canvas'); c.width = s.w * Z; c.height = s.h * Z;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.scale(Z, Z); g.drawImage(s.cv, 0, 0);
    return [c.toDataURL(), s.ax * Z, s.ay * Z];
  },
  mon(id, Z) {
    const s = pxuSprite(id, 'idle', 0), c = document.createElement('canvas'); c.width = s.w * Z; c.height = s.h * Z;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.translate(s.w * Z, 0); g.scale(-Z, Z); g.drawImage(s.cv, 0, 0);
    return [c.toDataURL(), (s.w - s.ax) * Z, s.ay * Z];
  }
};
