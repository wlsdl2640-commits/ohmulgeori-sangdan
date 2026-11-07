/* ───────── 도트 굽기: 그린 그림에 외곽선과 명암을 입혀 저장해 둔다 ───────── */
const SPR = new Map();
function bake(key, w, h, ax, ay, paint, plain) {
  let s = SPR.get(key);
  if (s) return s;
  const [cv, x] = mkCanvas(w, h);
  x.save(); x.translate(ax, ay); paint(x); x.restore();
  if (!plain) {
    const img = x.getImageData(0, 0, w, h), d = img.data, o = new Uint8ClampedArray(d);
    const A = (i, j) => (i < 0 || j < 0 || i >= w || j >= h ? 0 : d[(j * w + i) * 4 + 3]);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4;
      if (!d[k + 3]) {
        if (A(i - 1, j) || A(i + 1, j) || A(i, j - 1) || A(i, j + 1)) { o[k] = 18; o[k + 1] = 13; o[k + 2] = 22; o[k + 3] = 255; }
        continue;
      }
      // 위쪽 가장자리는 밝게, 아래쪽 가장자리는 어둡게
      if (!A(i, j - 1)) for (let c = 0; c < 3; c++) o[k + c] = d[k + c] + (255 - d[k + c]) * 0.2;
      else if (!A(i, j + 1)) for (let c = 0; c < 3; c++) o[k + c] = d[k + c] * 0.74;
    }
    x.putImageData(new ImageData(o, w, h), 0, 0);
  }
  s = { cv, ax, ay };
  SPR.set(key, s);
  if (SPR.size > 1600) SPR.delete(SPR.keys().next().value);
  return s;
}
const blit = (ctx, s) => ctx.drawImage(s.cv, -s.ax, -s.ay);

/* ───────── 모험가 (손 도트: pxa.js 앞모습 · pxs.js 옆모습) ───────── */
const ROBED = Object.keys(PXL).filter(c => PXL[c].body === 'robe');
function advKey(a) {
  const w = a.eq && a.eq.weapon, l = a.look || {};
  return [a.cls, l.hair, l.skin, (a.id || 0) % 3, w ? w.base : '-', a.hero ? 'H' : ''].join('|');
}
function advPoseOf(t, o) {
  if (o.sleep) return ['sleep', 0];
  if (o.down) return ['down', 0];
  if (o.sit) return ['sit', 0];
  if (o.mot) return ['m:' + o.mot.mk, o.mot.f];   // 공격 동작 여러 장 (빌드 40, 옆모습 칼)
  if (o.atk) return ['atk', o.atkF != null ? o.atkF : 1];
  if (o.walk) return ['walk', Math.floor(t * 8 + (o.ph || 0) * 2) % 4];
  return ['idle', Math.floor(t * 1.6 + (o.ph || 0)) % 2];
}
// 논리 좌표 화면에 그린다. o.side 옆모습 · o.z 배율
function drawAdv(ctx, a, t, o = {}) {
  const [pose, fr] = advPoseOf(t, o), s = o.side ? pxsAdvSprite(a, pose, fr) : pxAdvSprite(a, pose, fr), z = o.z || 1;
  if (z === 1) { pxBlit(ctx, s); return; }
  ctx.save(); ctx.scale(z, z); pxBlit(ctx, s); ctx.restore();
}
function drawAdvHi(ctx, a, t, o = {}) { drawAdv(ctx, a, t, o); }

/* ───────── 몬스터 (손 도트: pxmon.js) ───────── */
// 크기 배율: 언데드(빌드 43)는 그림 자체가 크다 — 큰 우두머리는 늘 1배, 보통 언데드가 우두머리로 나오면 1.5배(예전 2배) · 2배(예전 3배)
const monSc = (m, sc, id) => { const k = sc || Math.max(1, Math.round(m.scale || 1)); if (!(id && typeof PXU !== 'undefined' && PXU[id])) return k; return PXU[id].ms ? 1 : k <= 1 ? 1 : 1 + (k - 1) * 0.5; };
const MON_DIM = {};
function monBase(id) {
  if (MON_DIM[id]) return MON_DIM[id];
  if (typeof PXG_DIM !== 'undefined' && PXG_DIM[id]) return (MON_DIM[id] = PXG_DIM[id]);
  if (typeof PXU !== 'undefined' && PXU[id]) { const rows = pxuRows(PXU[id]); return (MON_DIM[id] = [Math.max(...rows.map(r => r.length)) * 2, rows.length * 2]); }
  const M = PXM[id];
  if (!M) return (MON_DIM[id] = [12, 12]);
  const rows = pxRows(M.g);
  return (MON_DIM[id] = [Math.max(...rows.map(r => r.length)), rows.length]);
}
const monH = (id, sc) => monBase(id)[1] * monSc(MONS[id], sc, id);
const monW = (id, sc) => monBase(id)[0] * monSc(MONS[id], sc, id);
// 펫·마차 짐승 (빌드 48): 새 그림 몬스터(와이번 66칸 너비 같은 것)가 펫이 되면 너무 커서, 너비를 w 픽셀 안으로 줄이는 배율
const monFit = (id, w) => Math.min(1, w / monW(id));
const MON_BACK = {};
function monBack(id) {   // 닻(발 가운데)에서 그림 뒤 끝까지 (z 1 픽셀) — 마차를 끄는 짐승을 마차 앞에 세운다
  if (MON_BACK[id] != null) return MON_BACK[id];
  const s = PXU[id] ? pxuSprite(id, 'idle', 0) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', 0);
  let lx = 0;
  try { const d = s.cv.getContext('2d').getImageData(0, 0, s.w, s.h).data; lx = s.w; for (let x = 0; x < s.w && lx === s.w; x++) for (let y = 0; y < s.h; y++) if (d[(y * s.w + x) * 4 + 3]) { lx = x; break; } } catch (_) { lx = 0; }
  return (MON_BACK[id] = Math.max(0, s.ax - lx) * monSc(MONS[id], 0, id));
}
function drawMon(ctx, id, t, o = {}) {
  const m = MONS[id], sc = monSc(m, o.sc, id) * (o.z || 1), tt = t + (o.ph || 0);
  const fr = Math.floor(tt * (PXU[id] && PXU[id].ifr || (m.giant ? 3 : PXU[id] && PXU[id].float ? 2.5 : 5))) % 2;   // ifr: 서 있기 두 장을 바꾸는 빠르기 (빌드 55 키메라 — 염소가 2초마다 앞·뒤를 본다)
  const s = PXU[id] ? pxuSprite(id, o.mot ? o.mot.mk : 'idle', o.mot ? o.mot.f : fr) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', fr);   // 언데드: 동작 장 (빌드 43)
  if (sc === 1) { pxBlit(ctx, s); return; }
  ctx.save(); ctx.scale(sc, sc); pxBlit(ctx, s); ctx.restore();
}

/* ───────── 모닥불과 잠든 숨 (본부 화면에서도 쓴다) ───────── */
function drawFire(ctx, x, y, t, big) {
  // 돌과 장작
  R(ctx, x - 6, y - 1, 2, 1, '#6a6670'); R(ctx, x + 5, y - 1, 2, 1, '#6a6670'); R(ctx, x - 4, y, 9, 1, '#4a4650');
  R(ctx, x - 5, y - 2, 11, 1, '#5e3c22'); R(ctx, x - 4, y - 3, 3, 1, '#7a5232'); R(ctx, x + 2, y - 3, 3, 1, '#7a5232');
  const f = Math.floor(t * 10) % 4, s = big ? 1.4 : 1;
  const cols = [[-2, 5, '#c0392b'], [-1, 8, '#f08a3c'], [0, 10, '#f7c04a'], [1, 7, '#f08a3c'], [2, 4, '#c0392b']];
  cols.forEach(([dx, h, c], i) => {
    const hh = Math.round((h + ((i + f) % 3) - 1) * s);
    R(ctx, x + dx, y - 3 - hh, 1, hh, c);
  });
  R(ctx, x - 1, y - 5, 3, 2, '#fff2c0');
  for (let i = 0; i < 5; i++) {
    const k = ((t * 0.9 + i * 0.37) % 1), sx = x + Math.round(Math.sin(i * 7 + t * 3) * 3), sy = y - 8 - Math.round(k * 20);
    if (k < 0.8) R(ctx, sx, sy, 1, 1, k < 0.4 ? '#f7e04a' : '#f08a3c');
  }
}
function drawZ(ctx, x, y, t, ph) {
  for (let i = 0; i < 2; i++) {
    const k = ((t * 0.5 + ph + i * 0.5) % 1), zx = x + Math.round(k * 6), zy = y - Math.round(k * 12);
    if (k > 0.9) continue;
    const c = 'rgba(232,240,255,' + (1 - k).toFixed(2) + ')';
    R(ctx, zx, zy, 3, 1, c); R(ctx, zx + 1, zy + 1, 1, 1, c); R(ctx, zx, zy + 2, 3, 1, c);
  }
}

/* ───────── 던전 입구 (필드 끝, 길 끝에 서 있다) ───────── */
function paintGate(x, kind, cleared) {
  const P = (px, py, w, h, c) => R(x, px, py, w, h, c), dark = '#120e14';
  if (kind === 'cellar') {          // 버려진 곡물 창고
    P(-18, -24, 36, 24, '#7a5634'); for (let i = -18; i < 18; i += 4) P(i, -24, 1, 24, '#5e4028');
    for (let i = 0; i < 10; i++) P(-21 + i, -24 - i, 42 - i * 2, 1, i % 3 ? '#8a3020' : '#6a2418');
    P(-7, -17, 14, 17, dark); P(-7, -17, 14, 1, '#4a3020'); P(-9, -19, 18, 2, '#5e4028');
    P(13, -5, 6, 5, '#d8b050'); P(-19, -4, 5, 4, '#d8b050');
  } else if (kind === 'cave') {     // 썩은 뿌리 동굴
    ell(x, 0, -10, 22, 12, '#4a4038'); ell(x, -2, -14, 16, 8, '#5a5048'); ell(x, 0, -5, 9, 7, dark);
    for (const [rx, ry, l] of [[-18, -16, 10], [-10, -22, 8], [8, -21, 12], [16, -14, 9]]) { P(rx, ry, 1, l, '#6b4a2e'); P(rx + 1, ry + l - 1, 2, 1, '#6b4a2e'); }
    P(-6, -20, 3, 3, '#3f7a3a'); P(5, -19, 4, 2, '#3f7a3a');
  } else if (kind === 'mine') {     // 버려진 드워프 갱도
    ell(x, 0, -12, 24, 14, '#4e4a56'); P(-10, -20, 20, 20, dark); P(-12, -22, 4, 22, '#6b4a2e'); P(8, -22, 4, 22, '#6b4a2e'); P(-14, -24, 28, 3, '#7a5634'); P(-14, -24, 28, 1, '#9a7a4f');
    P(-8, -3, 16, 1, '#8a8a90'); P(-8, -1, 16, 1, '#8a8a90'); P(-2, -26, 4, 2, '#c9a04a');
  } else if (kind === 'nest') {     // 와이번 둥지
    ell(x, 0, -14, 22, 16, '#6a6070'); ell(x, 0, -6, 10, 8, dark);
    for (let i = -16; i < 16; i += 3) P(i, -28 + Math.abs(i) / 3, 4, 1, '#7a5634');
    P(-14, -2, 4, 2, '#f0e8d8'); P(10, -3, 3, 3, '#f0e8d8'); P(12, -5, 1, 2, '#f0e8d8');
  } else if (kind === 'icetemple') { // 얼어붙은 신전
    P(-20, -4, 40, 4, '#a8c8dc'); P(-16, -26, 5, 22, '#c8e4f4'); P(11, -26, 5, 22, '#c8e4f4'); P(-15, -26, 1, 22, '#ffffff'); P(12, -26, 1, 22, '#ffffff');
    for (let i = 0; i < 7; i++) P(-20 + i * 2, -27 - i, 40 - i * 4, 1, '#e8f6ff');
    P(-8, -20, 16, 16, '#1a2a4a'); P(-8, -20, 16, 1, '#4a7898'); P(-1, -32, 2, 3, '#8ad8ff');
  } else if (kind === 'tomb') {     // 모래에 묻힌 왕릉
    for (let i = 0; i < 22; i++) P(-22 + i, -i - 1, 44 - i * 2, 1, i % 4 ? '#c89858' : '#b8884a');
    P(-6, -14, 12, 14, dark); P(-8, -16, 16, 2, '#d8c098'); P(-8, -14, 2, 14, '#d8c098'); P(6, -14, 2, 14, '#d8c098');
    P(-3, -19, 6, 2, '#f0c24a'); P(-1, -21, 2, 2, '#f0c24a');
  }
  if (cleared === 2) {              // 1-50의 주인이 지키는 동안은 봉인되어 있다
    for (let i = 0; i < 14; i++) { P(-8 + i, -18 + i, 2, 1, '#8a8e98'); P(5 - i, -18 + i, 2, 1, '#8a8e98'); }
    P(-3, -12, 6, 6, '#6a2a8a'); P(-2, -11, 4, 4, '#b86af0'); P(-1, -10, 2, 2, '#f0d8ff');
  } else if (cleared) {             // 공략한 던전은 판자로 막혔다
    P(-9, -18, 18, 2, '#9a7a4f'); P(-9, -10, 18, 2, '#9a7a4f'); P(-8, -18, 2, 18, '#7a5634'); P(6, -18, 2, 18, '#7a5634');
    for (let i = 0; i < 12; i++) { P(-7 + i, -17 + i, 2, 1, '#8a6a44'); P(5 - i, -17 + i, 2, 1, '#8a6a44'); }
  }
}
function drawGate(ctx, kind, cleared) {
  blit(ctx, bake('G|' + kind + (+cleared || 0), 54, 44, 27, 41, x => paintGate(x, kind, cleared)));
}
