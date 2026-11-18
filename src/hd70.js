/* ───────── 빌드 70 시험: 곡창지대 평원 리마스터 (11-18 18:42 사용자 「몬스터 · 1차 전사 리마스터 · 스킬까지도」 · 「우선 전사 1차만 적용시켜서 … 시험 아티팩트」) ─────────
   그림은 data-hd70.js(HD70_DATA — tools/saved/gpt70/hd70/export_hd70.py로 뽑는다, 손으로 고치지 말 것). 그림 판을 다 풀기 전에는 예전 그림.
   · 그림 몬스터 6종(들쥐 · 뿔토끼 · 들늑대 · 허수아비 · 멧돼지 · 갑옷 멧돼지): PXU 자리를 그대로 써서(fmot 동작 · 효과 · 크기 규칙) pxuSprite가 그림 장을 돌려준다.
     동작 'i_<id>_<줄>' — 장 시간 PXS_MOT_TT · 맞히는 장 PXS_MOT_HITF · 앞으로 나간 거리 dx(논리 픽셀) · 쏘는 자리 tip(닻에서 논리 픽셀)
   · 전사 1차(cls warrior): drawAdv가 리마스터 장을 그린다 — 서 있기 · 걷기 · 공격 동작(베기 · 올려베기 · 찌르기 · 방패 막기 · 방패 밀치기) · 맞음 · 쓰러짐 · 앞모습. 앉기 · 눕기는 예전 그림
   · 1차 스킬 그림 13개: hexURL이 육각 안쪽 34×40을 그린다 (hdSkiCells)
   · 넓은 평원(bg plains_hd): 뒷산 · 중경(언덕 · 농장 · 울타리) · 넓은 땅 · 도는 풍차 날개 — 땅이 화면 아래 40%,
     파티 · 몬스터가 앞뒤로 흩어져 선다 (view.js formSlots · foeSlots · zAt이 V.wide를 본다) */
const HD = { mon: {}, war: null, wx: {}, sky: null, front: null, bg: null, spr: new Map(), tint: new WeakMap() };
const HD_EMPTY = (() => { if (typeof document === 'undefined') return null; const [cv] = mkCanvas(1, 1); return { cv, ax: 0, ay: 0, w: 1, h: 1, dx: 0, jy: 0, fo: [0, 0] }; })();
// 그림 몬스터 동작: 줄 · 장 시간 · 맞히는 장 · 앞으로 나간 거리(논리 픽셀, 장마다) · 쏘는 자리
const HD_MOT = {
  i_rat_bite:    { id: 'rat', row: 'bite', T: [0.06, 0.06, 0.07, 0.05, 0.06, 0.07, 0.06, 0.06], hit: 4, dx: [0, 0, 1, 3, 5, 4, 2, 0] },
  i_rat_leap:    { id: 'rat', row: 'leap', T: 0.05, hit: 7, dx: [0, 0, 0, 2, 5, 9, 13, 15, 14, 10, 5, 1] },
  i_rabbit_charge: { id: 'rabbit', row: 'charge', T: [0.05, 0.06, 0.06, 0.05, 0.06, 0.07, 0.06, 0.06], hit: 4, dx: [0, 1, 4, 9, 12, 10, 5, 1] },
  i_rabbit_jump: { id: 'rabbit', row: 'jump', T: 0.055, hit: 6, dx: [0, 0, 2, 6, 10, 13, 14, 11, 6, 2] },
  i_wolf_bite:   { id: 'wolf', row: 'bite', T: [0.06, 0.06, 0.07, 0.05, 0.07, 0.07, 0.06, 0.06], hit: 4, dx: [0, 0, 2, 4, 6, 5, 3, 1] },
  i_wolf_leap:   { id: 'wolf', row: 'leap', T: 0.055, hit: 6, dx: [0, 0, 1, 5, 10, 15, 17, 13, 7, 2] },
  i_scarecrow_crow1: { id: 'scarecrow', row: 'crow1', T: 0.07, hit: 3, tip: [12, -30] },   // 어깨 까마귀 발사
  i_scarecrow_crow2: { id: 'scarecrow', row: 'crow2', T: 0.07, hit: 3, tip: [2, -42] },    // 머리 까마귀 발사
  i_scarecrow_crow3: { id: 'scarecrow', row: 'crow3', T: 0.075, hit: 3, tip: [8, -34] },   // 남은 까마귀 발사
  i_boar_butt:   { id: 'boar', row: 'headbutt', T: [0.07, 0.07, 0.07, 0.06, 0.08, 0.08, 0.08], hit: 4, dx: [0, 0, 1, 4, 7, 5, 2] },
  i_boar_charge: { id: 'boar', row: 'charge', T: 0.055, hit: 5, dx: [0, 3, 8, 14, 20, 24, 18, 8] },
  i_aboar_butt:  { id: 'aboar', row: 'headbutt', T: [0.07, 0.07, 0.07, 0.06, 0.08, 0.08, 0.08, 0.08], hit: 4, dx: [0, 0, 1, 3, 6, 8, 5, 2] },
  i_aboar_charge: { id: 'aboar', row: 'charge', T: 0.06, hit: 5, dx: [0, 3, 8, 14, 20, 24, 18, 8] },
  i_aboar_horn:  { id: 'aboar', row: 'hornup', T: 0.08, hit: 3, dx: [0, 0, 1, 3, 2, 0] }
};
const HD_IDLE_FPS = { rat: 7, rabbit: 7, wolf: 7, scarecrow: 6, boar: 6, aboar: 6 };
for (const k in HD_MOT) {   // 장 시간 · 맞히는 장을 동작 표에 (fmotOn · pxuMotT · fmotTip이 본다)
  const M = HD_MOT[k], n = (M.dx || []).length || 8;
  PXS_MOT_TT[k] = Array.isArray(M.T) ? M.T : Array.from({ length: n }, () => M.T);
  PXS_MOT_HITF[k] = M.hit;
}
Object.assign(PXU_CAST, { i_scarecrow_crow1: 1, i_scarecrow_crow2: 1, i_scarecrow_crow3: 1 });   // 까마귀를 날려 보낸다 (fmot.js FMOT_CAST)
// 새 몬스터 셋은 그림만 있다 (PXU 자리 · 크기 규칙만 빌린다) — 들쥐 · 뿔토끼 · 들늑대는 예전 PXU 그림이 그림 판을 풀기 전까지 그대로 나온다
for (const id of ['scarecrow', 'boar', 'aboar']) PXU[id] = { img: 1, g: 'C', ax: 0, pal: {} };
for (const id of ['rat', 'rabbit', 'wolf']) PXU[id].img = 1;
// 동작 갈래: hd = 그림 판이 있을 때 · 없으면 예전 갈래 (새 몬스터는 같은 것)
const HD_ACT = {
  rat:       { atk: ['i_rat_bite', 'i_rat_leap'], skl: ['i_rat_leap'] },
  rabbit:    { atk: ['i_rabbit_charge', 'i_rabbit_jump'], skl: ['i_rabbit_jump'] },
  wolf:      { atk: ['i_wolf_bite', 'i_wolf_leap'], skl: ['i_wolf_leap'] },
  scarecrow: { atk: ['i_scarecrow_crow1', 'i_scarecrow_crow2'], skl: ['i_scarecrow_crow3'] },
  boar:      { atk: ['i_boar_butt'], skl: ['i_boar_charge'] },
  aboar:     { atk: ['i_aboar_butt'], skl: ['i_aboar_charge', 'i_aboar_horn'] }
};
Object.assign(PXU_ACT, {
  scarecrow: Object.assign({ fx: { atk: { pal: 'shadow', hit: 'claw', p: 'dart' }, skl: { pal: 'shadow', hit: 'claw', p: 'dart', big: 1, after: 'feathers', aoe: 'feathers' } } }, HD_ACT.scarecrow),
  boar:      Object.assign({ tk: 1, fx: { atk: { pal: 'earth', hit: 'star', after: 'dust' }, skl: { pal: 'earth', hit: 'star', big: 1, after: 'dust' } } }, HD_ACT.boar),
  aboar:     Object.assign({ tk: 1.05, fx: { atk: { pal: 'steel', hit: 'star', after: 'dust' }, skl: { pal: 'war', hit: 'pierce', big: 1, after: 'dust' } } }, HD_ACT.aboar)
});
for (const id in HD_ACT) PXU_ACT[id].hd = HD_ACT[id];
const hdAct = id => { const A = PXU_ACT[id]; return A && A.hd && HD.mon[id] ? A.hd : A; };   // pxund.js pxuPick이 부른다

// ── 그림 판 풀기 (data URL → 장마다 캔버스) ──
function hdCut(im, w, h, rows, n) { const out = {}; rows.forEach((r, ri) => { out[r] = []; for (let i = 0; i < n[ri]; i++) { const [cv, x] = mkCanvas(w, h); x.drawImage(im, i * w, ri * h, w, h, 0, 0, w, h); out[r].push(cv); } }); return out; }
function hdBox(cv) {   // 그림이 있는 칸의 테두리 [x0, x1, y0]
  let x0 = cv.width, x1 = -1, y0 = cv.height;
  try { const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; } } catch (_) { return null; }
  return x1 < 0 ? null : [x0, x1 + 1, y0];
}
function hdLoad() {
  if (typeof Image === 'undefined' || typeof HD70_DATA === 'undefined') return;
  const D = HD70_DATA, img = (url, fn) => { const im = new Image(); im.onload = () => fn(im); im.src = url; };
  for (const id in D.mon) {
    const m = D.mon[id];
    img(m.url, im => {
      const f = hdCut(im, m.w, m.h, m.rows, m.n), b = hdBox(f[m.rows[0]][0]);
      const q = m.hs || 1; HD.mon[id] = { m, f, bb: b ? [(b[0] - m.ax) / q, (b[1] - m.ax) / q, (m.ay - b[2]) / q] : [-10, 10, 20] };   // 닻에서 뒤 끝 · 앞 끝 · 키
      HD.spr.clear(); if (typeof MON_DIM !== 'undefined') delete MON_DIM[id]; if (typeof MON_BACK !== 'undefined') delete MON_BACK[id];
    });
  }
  const W = D.war;
  img(W.url, im => { HD.war = { m: W, f: hdCut(im, W.w, W.h, W.rows, W.n) }; HD.spr.clear(); });
  img(W.front.url, im => { const [cv, x] = mkCanvas(W.front.w, W.front.h); x.drawImage(im, 0, 0); HD.front = { cv, hs: W.hs || 1, ax: W.front.ax, ay: W.front.ay, w: W.front.w, h: W.front.h }; });
  for (const rn in W.x || {}) { const m = W.x[rn]; img(m.url, im => { HD.wx[rn] = { m, f: hdCut(im, m.w, m.h, [rn], [m.n])[rn] }; HD.spr.clear(); }); }   // 걷기 · 달리기 · 앉기 · 눕기 (11-18 20:44 판)
  if (D.sky) { const K = { moon: null, clouds: [] }; let n = D.sky.clouds.length + 1; const done = () => { if (!--n) HD.sky = K; }; img(D.sky.moon, im => { K.moon = im; done(); }); D.sky.clouds.forEach((u, i) => img(u, im => { const [cv, x] = mkCanvas(im.width, im.height); x.drawImage(im, 0, 0); K.clouds[i] = cv; done(); })); }
  const B = D.bg.plains, L = {}; let left = 4;
  for (const k of ['back', 'mid', 'gr', 'blades']) img(B[k].url, im => { L[k] = im; if (--left) return; HD.bg = L; if (typeof BG !== 'undefined') delete BG.plains_hd; });
}
// FLASH(맞으면 흰 번쩍 · 희귀종 금빛 · 스킬 잔상): 같은 모양을 한 색으로
function hdTint(cv, col) {
  let T = HD.tint.get(cv); if (!T) HD.tint.set(cv, T = {});
  if (T[col]) return T[col];
  const [c, x] = mkCanvas(cv.width, cv.height); x.drawImage(cv, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, cv.width, cv.height);
  return (T[col] = c);
}

// ── 그림 몬스터 ──
const hdMon = id => HD.mon[id] || null;
const hdIdleN = id => { const H = HD.mon[id]; return H ? H.f[H.m.rows[0]].length : 2; };
const hdMonBase = id => { const H = HD.mon[id]; return H ? [H.bb[1] - H.bb[0], H.bb[2]] : null; };   // art.js monBase (너비 · 키)
function hdMonSpr(id, mk, f) {   // pxund.js pxuSprite가 부른다 (그림 판이 없으면 null)
  const H = HD.mon[id];
  if (!H) return PXU[id] && PXU[id].g === 'C' ? HD_EMPTY : null;
  const M = HD_MOT[mk] && HD_MOT[mk].id === id ? HD_MOT[mk] : null, row = M ? M.row : mk === 'walk' && H.f.walk ? 'walk' : H.m.rows[0], L = H.f[row];
  const i = M ? Math.max(0, Math.min(L.length - 1, f)) : ((f % L.length) + L.length) % L.length, key = id + '|' + (M ? mk : row) + '|' + i + '|' + (FLASH || '');
  let s = HD.spr.get(key); if (s) return s;
  const m = H.m, cv = FLASH ? hdTint(L[i], FLASH) : L[i];
  const q = m.hs || 1, lx = m.ax / q, ly = m.ay / q;
  s = { cv, hs: q, ax: m.ax, ay: m.ay, w: m.w, h: m.h, dx: M && M.dx ? (M.dx[i] || 0) / 2 : 0, jy: 0, fo: [lx, ly], tip: M && M.tip ? [(lx + M.tip[0] - 1) / 2, (ly + M.tip[1] - 1) / 2] : [(lx + H.bb[1] - 2) / 2, (ly - H.bb[2] * 0.6) / 2] };
  HD.spr.set(key, s); if (HD.spr.size > 900) HD.spr.delete(HD.spr.keys().next().value);
  return s;
}

// ── 전사 1차 ──
const hdWarOn = a => !!(HD.war && a && a.cls === 'warrior');
// 모험가 동작(pxs.js) → 리마스터 줄
const HDW_ROW = { down: 'slash', side: 'slash', hack: 'slash', smash: 'slash', toss: 'slash', up: 'upper', thrust: 'thrust', taunt: 'thrust', bash: 'bash', block: 'guard', guard: 'guard', parry: 'guard', ready: 'guard', raise: 'guard', salute: 'guard' };
function hdWarSpr(a, pose, fr, t, o) {   // art.js drawAdv가 부른다 (null이면 예전 그림)
  const X = (rn, i) => { const Q = HD.wx[rn]; if (!Q) return null; const key = 'X|' + rn + '|' + i + '|' + (FLASH || ''); let s = HD.spr.get(key); if (!s) { const m = Q.m; s = { cv: FLASH ? hdTint(Q.f[i], FLASH) : Q.f[i], hs: m.hs, ax: m.ax, ay: m.ay, w: m.w, h: m.h }; HD.spr.set(key, s); } return s; };
  if (pose === 'sit' || pose === 'sleep') return X(pose, Math.floor(t * 1.6 + (o.ph || 0)) % 4);   // 야영: 앉아 쉬기 · 누워 자기 (숨쉬기 4장)
  if (o.side && pose === 'walk' && o.die == null) { const h0 = typeof V !== 'undefined' && V.flash0 && a.id != null ? V.flash0['a' + a.id] : null; if (!(h0 != null && t - h0 >= 0 && t - h0 < 0.4)) { const rn = o.run ? 'run' : 'walk', s = X(rn, Math.floor(t * (o.run ? 11 : 8) + (o.ph || 0) * 3) % 8); if (s) return s; } }
  if (!o.side) { if (!HD.front) return null; const F = HD.front; return FLASH ? { cv: hdTint(F.cv, FLASH), hs: F.hs, ax: F.ax, ay: F.ay, w: F.w, h: F.h } : F; }
  const H = HD.war, ph = o.ph || 0;
  let row = 'idle', i = Math.floor(t * 6 + ph * 2) % 8, fl = FLASH;
  if (o.die != null) { row = 'death'; i = Math.max(0, Math.min(7, Math.floor(o.die * 8))); }   // 쓰러지는 때가 맞는 때보다 늦게 잡혀 있으면(V.fall) 첫 장
  else if (pose === 'down') { row = 'death'; i = 7; }
  else if (pose.startsWith('m:')) { const mk = pose.slice(2), n = pxsMotT(mk).length || 8; row = HDW_ROW[mk] || 'slash'; i = Math.max(0, Math.min(7, Math.round(fr * 7 / Math.max(1, n - 1)))); }
  else if (pose === 'atk') { row = 'slash'; i = fr ? 4 : 2; }
  else {
    const h0 = typeof V !== 'undefined' && V.flash0 && a.id != null ? V.flash0['a' + a.id] : null, dt = h0 != null ? t - h0 : -1;
    if (dt >= 0 && dt < 0.4) { row = 'hurt'; i = Math.min(7, Math.floor(dt / 0.4 * 8)); if (fl === '#ffffff' && dt > 0.07) fl = null; }   // 맞음: 흰 번쩍은 처음 한순간만
    else if (pose === 'walk') { row = 'walk'; i = Math.floor(t * 8 + ph * 3) % 8; }
  }
  const L = H.f[row] || H.f.idle, key = 'W|' + row + '|' + i + '|' + (fl || '');
  if (!L[i]) return null;
  let s = HD.spr.get(key); if (s) return s;
  const m = H.m; s = { cv: fl ? hdTint(L[i], fl) : L[i], hs: m.hs || 1, ax: m.ax, ay: m.ay, w: m.w, h: m.h };
  HD.spr.set(key, s); return s;
}

// ── 1차 스킬 그림 (육각 안쪽 34×40 — hero.js hexURL) ──
const HD_SKI = {};
function hdSkiCells(id) {
  if (HD_SKI[id] !== undefined) return HD_SKI[id];
  const src = typeof HD70_DATA !== 'undefined' && HD70_DATA.ski[id]; if (!src) return (HD_SKI[id] = null);
  const [p, q] = src.split('|'), pal = [], A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
  for (let i = 0; i < p.length; i += 6) pal.push('#' + p.slice(i, i + 6));
  const out = []; for (let i = 0; i < q.length; i++) out.push(pal[A.indexOf(q[i])] || '#ff00ff');
  return (HD_SKI[id] = out);
}

// ── 넓은 평원 풍경 (scene.js getBg → BG_MAKERS.plains_hd) ──
function buildPlainsHD() {
  const L = HD.bg;
  if (!L) return Object.assign({ hdWait: 1 }, buildPlains());   // 그림을 풀기 전: 옛 평원 (풀면 BG.plains_hd를 지워 다시 짓는다)
  const B = HD70_DATA.bg.plains;
  const q = B.hs || 1;   // 화면 픽셀 해상도 겹 (scene.js tile이 cv.hs를 본다)
  const mir = (im, h, y) => { const [cv, x] = mkCanvas(im.width * 2, h); x.drawImage(im, 0, Math.round(y * q)); x.save(); x.translate(im.width * 2, 0); x.scale(-1, 1); x.drawImage(im, 0, Math.round(y * q)); x.restore(); cv.hs = q; return cv; };   // 뒤집어 이어 붙여 이음매가 없다
  const back = mir(L.back, AH * q, B.back.y), mid = mir(L.mid, AH * q, B.mid.y), gr = mir(L.gr, L.gr.height, 0);
  const bw = B.blades.w, bl = [];
  for (let i = 0; i < B.blades.n; i++) { const [c, x] = mkCanvas(bw, bw); x.drawImage(L.blades, i * bw, 0, bw, bw, 0, 0, bw, bw); bl.push(c); }
  const W2 = mid.width / q, bx = B.blades.x, by = B.blades.y;
  return { tall: 1, wide: 1, hdSky: 1, back, far: null, mid, gr, gy: B.gr.y, clouds: 7, ambient: 'meadow', skyOy: B.skyOy, gateY: B.gateY,
    props(g, off, t) {   // 풍차 날개 (뒤집힌 짝은 거꾸로 돈다)
      const fi = Math.floor(t * 8) % bl.length;
      for (const [x0, flip] of [[bx, 0], [W2 - bx, 1]]) {
        const x = ((x0 - off) % W2 + W2) % W2;
        for (const xx of [x, x - W2]) { if (xx < -bw / q || xx > VW + bw / q) continue; g.save(); g.translate(Math.round(xx), Math.round(by)); if (flip) g.scale(-1, 1); g.drawImage(bl[fi], -bw / q / 2, -bw / q / 2, bw / q, bw / q); g.restore(); }
      }
    } };
}
hdLoad();
