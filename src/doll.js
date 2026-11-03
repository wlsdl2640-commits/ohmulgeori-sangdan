/* ───────── 고해상도 도트 엔진 ─────────
   모양(타원·캡슐·다각형·상자)을 재질로 칠하고, 왼쪽 위에서 오는 빛으로 명암을 넣은 뒤
   앞 부품이 뒤 부품에 그림자를 드리우고, 색이 들어간 외곽선을 두른다. 전투 화면은 두 배 해상도. */
const HI = 2;
const LIGHT = (() => { const v = [-0.52, -0.7, 0.5], m = Math.hypot(...v); return v.map(x => x / m); })();
const SHADE_TH = [-0.3, 0.16, 0.56, 0.85];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function hexRgb(h) { if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]; const n = parseInt(h.slice(1, 7), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function rgbHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; }
  return [h, s, l];
}
function hslRgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
  if (!s) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map(v => Math.round(v * 255));
}
const hueTo = (h, t, a) => { const d = ((t - h + 540) % 360) - 180; return h + Math.sign(d) * Math.min(Math.abs(d), Math.abs(a)); };
const mixRgb = (c, d, k) => [0, 1, 2].map(i => Math.round(c[i] + (d[i] - c[i]) * k));
// rgbHex는 bg.js에 있다

// 재질: 다섯 단계 색 (0 가장 어두움 · 2 바탕 · 4 하이라이트). sto = 그림자가 기우는 색상
const KIND = {
  cloth:   { d: [0.46, 0.72], l: [0.2, 0.36], hs: 14, sto: 250, top: 3 },
  leather: { d: [0.46, 0.7], l: [0.18, 0.32], hs: 10, sto: 300, top: 3 },
  skin:    { d: [0.7, 0.86], l: [0.14, 0.26], hs: 8, sto: 15, top: 3, sat: 0.02 },
  hair:    { d: [0.48, 0.72], l: [0.2, 0.4], hs: 12, sto: 260, top: 4 },
  metal:   { d: [0.34, 0.6], l: [0.36, 0.74], hs: 18, sto: 225, top: 4 },
  gold:    { d: [0.4, 0.66], l: [0.32, 0.66], hs: 14, sto: 15, top: 4 },
  wood:    { d: [0.48, 0.72], l: [0.18, 0.3], hs: 8, sto: 330, top: 3 },
  gem:     { d: [0.4, 0.66], l: [0.36, 0.78], hs: 16, sto: 250, top: 4 },
  gel:     { d: [0.5, 0.76], l: [0.3, 0.72], hs: 16, sto: 250, top: 4 },
  bone:    { d: [0.56, 0.78], l: [0.14, 0.3], hs: 12, sto: 260, top: 3 },
  fur:     { d: [0.5, 0.74], l: [0.16, 0.3], hs: 10, sto: 300, top: 3 },
  stone:   { d: [0.46, 0.7], l: [0.16, 0.3], hs: 12, sto: 240, top: 3 },
  scale:   { d: [0.4, 0.66], l: [0.24, 0.48], hs: 16, sto: 240, top: 4 },
  glow:    { d: [0.86, 0.94], l: [0.36, 0.7], hs: 0, sto: 0, top: 4, flat: 1 },
  ink:     { d: [1, 1], l: [0, 0], hs: 0, sto: 0, top: 2, flat: 1 }
};
const MATS = [], MAT_ID = new Map();
function mat(hex, kind = 'cloth') {
  const key = hex + kind;
  let id = MAT_ID.get(key);
  if (id != null) return id;
  const K = KIND[kind] || KIND.cloth, c = hexRgb(hex), [h, s, l] = rgbHsl(...c);
  const dk = (dl, k) => hslRgb(K.hs ? hueTo(h, K.sto, K.hs * k) : h, s * (1 + (K.sat != null ? K.sat : 0.1) * k), l * dl);
  const lt = (dl, k) => hslRgb(K.hs ? hueTo(h, 55, K.hs * 0.55 * k) : h, s * (1 - 0.16 * k), l + (1 - l) * dl);
  const rp = [dk(K.d[0], 2), dk(K.d[1], 1), c, lt(K.l[0], 1), lt(K.l[1], 2)];
  id = MATS.length;
  MATS.push({ rp, top: K.top, flat: !!K.flat, kind, out: mixRgb(rp[0], [16, 10, 18], 0.55), outL: mixRgb(rp[0], [16, 10, 18], 0.3) });
  MAT_ID.set(key, id);
  return id;
}

/* 모양: f(x, y) → 안이면 법선 [nx, ny, nz], 밖이면 null */
function shEll(cx, cy, rx, ry, rot = 0, depth = 1) {
  const c = Math.cos(rot), s = Math.sin(rot), R = Math.max(rx, ry) + 1, rz = Math.min(rx, ry) * depth;
  return { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R, f(px, py) {
    const dx = px - cx, dy = py - cy, u = (dx * c + dy * s) / rx, v = (-dx * s + dy * c) / ry, q = u * u + v * v;
    if (q > 1) return null;
    const nu = u / rx, nv = v / ry, nz = Math.sqrt(1 - q) / rz;
    return [nu * c - nv * s, nu * s + nv * c, nz];
  } };
}
function shCap(x1, y1, x2, y2, r1, r2 = r1) {
  const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1e-6, R = Math.max(r1, r2) + 1;
  return { x0: Math.min(x1, x2) - R, y0: Math.min(y1, y2) - R, x1: Math.max(x1, x2) + R, y1: Math.max(y1, y2) + R, f(px, py) {
    const t = clamp(((px - x1) * dx + (py - y1) * dy) / L2, 0, 1), ex = px - (x1 + dx * t), ey = py - (y1 + dy * t), r = r1 + (r2 - r1) * t, d2 = ex * ex + ey * ey;
    if (d2 > r * r) return null;
    return [ex / r, ey / r, Math.sqrt(Math.max(0, 1 - d2 / (r * r))) + 0.05];
  } };
}
// 다각형: 가장자리에서 bev만큼 둥글게 깎인 판
function shPoly(pts, bev = 2.2, depth = 1) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const n = pts.length;
  return { x0, y0, x1, y1, f(px, py) {
    let inside = false, best = 1e9, bx = 0, by = 0;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
      const ex = xj - xi, ey = yj - yi, t = clamp(((px - xi) * ex + (py - yi) * ey) / (ex * ex + ey * ey || 1e-6), 0, 1);
      const qx = xi + ex * t - px, qy = yi + ey * t - py, d = qx * qx + qy * qy;
      if (d < best) { best = d; bx = qx; by = qy; }
    }
    if (!inside) return null;
    const d = Math.sqrt(best) || 1e-6, k = Math.max(0, 1 - d / bev) * 1.7;
    return [bx / d * k, by / d * k, depth];
  } };
}
function shBox(x, y, w, h, r = 1, bev = 2) {
  const cx = x + w / 2, cy = y + h / 2, hx = w / 2 - r, hy = h / 2 - r;
  return { x0: x - 1, y0: y - 1, x1: x + w + 1, y1: y + h + 1, f(px, py) {
    const ax = Math.abs(px - cx) - hx, ay = Math.abs(py - cy) - hy;
    const out = Math.hypot(Math.max(ax, 0), Math.max(ay, 0)) + Math.min(Math.max(ax, ay), 0) - r;
    if (out > 0) return null;
    let gx, gy;
    if (ax > 0 && ay > 0) { const m = Math.hypot(ax, ay); gx = ax / m; gy = ay / m; } else if (ax > ay) { gx = 1; gy = 0; } else { gx = 0; gy = 1; }
    gx *= Math.sign(px - cx) || 1; gy *= Math.sign(py - cy) || 1;
    const k = Math.max(0, 1 + out / bev) * 1.6;
    return [gx * k, gy * k, 1];
  } };
}

/* 그림판 */
class Doll {
  constructor(w, h, ox, oy) {
    Object.assign(this, { w, h, ox, oy, np: 0, over: [], sc: 1 });
    const n = w * h;
    this.idx = new Int8Array(n).fill(-1); this.mat = new Int16Array(n); this.pid = new Int16Array(n).fill(-1);
  }
  // o: top 최대 밝기 · lift 밝기 보정 · tex(x,y,i) 무늬 · cast 그림자 드리우기 · line 자기 테두리 · clip(x,y) · flat
  add(sh, m, o = {}) {
    const id = this.np++, { w, h, ox, oy, sc } = this, M = MATS[m], top = o.top != null ? o.top : M.top, mine = [];
    const xa = Math.max(0, Math.floor(sh.x0 * sc + ox)), xb = Math.min(w - 1, Math.ceil(sh.x1 * sc + ox)), ya = Math.max(0, Math.floor(sh.y0 * sc + oy)), yb = Math.min(h - 1, Math.ceil(sh.y1 * sc + oy));
    for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
      const px = (x + 0.5 - ox) / sc, py = (y + 0.5 - oy) / sc;
      if (o.clip && !o.clip(px, py)) continue;
      const nr = sh.f(px, py);
      if (!nr) continue;
      let i;
      if (M.flat || o.flat) i = o.flat != null && o.flat !== true ? o.flat : 2;
      else {
        const s = (nr[0] * LIGHT[0] + nr[1] * LIGHT[1] + nr[2] * LIGHT[2]) / (Math.hypot(nr[0], nr[1], nr[2]) || 1) + (o.lift || 0);
        i = s < SHADE_TH[0] ? 0 : s < SHADE_TH[1] ? 1 : s < SHADE_TH[2] ? 2 : s < SHADE_TH[3] ? 3 : 4;
        if (i > top) i = top;
      }
      if (o.tex) i = clamp(i + o.tex(px, py, i), 0, 4);
      const k = y * w + x;
      this.idx[k] = i; this.mat[k] = m; this.pid[k] = id;
      mine.push(k);
    }
    if (o.line != null) for (const k of mine) { const x = k % w; if (this.pid[k] !== id) continue; if ((x > 0 && this.pid[k - 1] !== id) || (x < w - 1 && this.pid[k + 1] !== id) || this.pid[k - w] !== id || this.pid[k + w] !== id) this.idx[k] = Math.min(this.idx[k], o.line); }
    // 앞 부품의 그림자: 아래·오른쪽으로 한 칸
    if (o.cast !== false) {
      const done = new Set();
      for (const k of mine) for (const k2 of [k + w + 1, k + w, k + 1]) {
        if (k2 >= w * h || done.has(k2)) continue;
        const p2 = this.pid[k2];
        if (p2 < 0 || p2 === id) continue;
        done.add(k2); this.idx[k2] = Math.max(0, this.idx[k2] - 1);
      }
    }
    return id;
  }
  // 그림 위에 그대로 찍는 점 (눈·문양 등). c = '#hex'
  px(x, y, c, ww = 1, hh = 1) { const k = this.sc; this.over.push([Math.round(x * k + this.ox), Math.round(y * k + this.oy), Math.max(1, Math.round(ww * k)), Math.max(1, Math.round(hh * k)), c]); }
  // 이미 칠한 곳만 다른 단계로 (무늬)
  shadeAt(x, y, d) { const X = Math.round(x * this.sc + this.ox), Y = Math.round(y * this.sc + this.oy), k = Y * this.w + X; if (X >= 0 && Y >= 0 && X < this.w && Y < this.h && this.idx[k] >= 0) this.idx[k] = clamp(this.idx[k] + d, 0, 4); }
  canvas(flash) {
    const { w, h } = this, n = w * h, img = new ImageData(w, h), d = img.data;
    for (let k = 0; k < n; k++) {
      if (this.idx[k] < 0) continue;
      const c = MATS[this.mat[k]].rp[this.idx[k]];
      d[k * 4] = c[0]; d[k * 4 + 1] = c[1]; d[k * 4 + 2] = c[2]; d[k * 4 + 3] = 255;
    }
    // 외곽선: 빛을 받는 위·왼쪽은 조금 밝게
    for (let k = 0; k < n; k++) {
      if (this.idx[k] >= 0) continue;
      const x = k % w;
      let nb = -1, lit = false;
      if (k + w < n && this.idx[k + w] >= 0) { nb = k + w; lit = true; }
      else if (x < w - 1 && this.idx[k + 1] >= 0) { nb = k + 1; lit = true; }
      else if (k - w >= 0 && this.idx[k - w] >= 0) nb = k - w;
      else if (x > 0 && this.idx[k - 1] >= 0) nb = k - 1;
      if (nb < 0) continue;
      const M = MATS[this.mat[nb]], c = lit ? M.outL : M.out;
      d[k * 4] = c[0]; d[k * 4 + 1] = c[1]; d[k * 4 + 2] = c[2]; d[k * 4 + 3] = 255;
    }
    const [cv, x] = mkCanvas(w, h);
    x.putImageData(img, 0, 0);
    for (const [px, py, ww, hh, c] of this.over) { x.fillStyle = c; x.fillRect(px, py, ww, hh); }
    if (flash) { x.globalCompositeOperation = 'source-in'; x.fillStyle = flash; x.fillRect(0, 0, w, h); }
    return cv;
  }
}
// 굽기: 고해상도 그림을 캐시에 넣는다 (ax, ay = 발밑 기준점)
function bakeHi(key, w, h, ax, ay, build) {
  let s = SPR.get(key);
  if (s) return s;
  const flash = FLASH, D = new Doll(w, h, ax, ay);
  build(D);
  s = { cv: D.canvas(flash), ax, ay, hi: 1 };
  SPR.set(key, s);
  if (SPR.size > 900) SPR.delete(SPR.keys().next().value);
  return s;
}
// 두 배 해상도 화면에 그린다 (ctx는 이미 ×2 상태)
function blitHi(ctx, s) { ctx.save(); ctx.scale(1 / HI, 1 / HI); ctx.drawImage(s.cv, -s.ax, -s.ay); ctx.restore(); }
// 무늬 도우미
const TX = {
  fold: (gap = 4, ph = 0) => (x, y, i) => ((Math.round(x) + ph) % (gap + 1) === 0 && i >= 2 && Math.round(y) % 3 !== 0 ? -1 : 0),
  chain: () => (x, y, i) => (Math.round(y) % 2 === 0 && (Math.round(x) + Math.round(y) / 2) % 2 === 0 && i >= 2 ? -1 : 0),
  scale: () => (x, y, i) => { const X = Math.round(x), Y = Math.round(y); return Y % 3 === 0 && (X + (Y % 6 ? 0 : 2)) % 4 === 0 && i >= 1 ? -1 : 0; },
  noise: () => () => 0,
  grain: () => (x, y, i) => (Math.round(y + Math.sin(x * 0.7) * 1.2) % 4 === 0 && i >= 2 ? -1 : 0),
  stripe: (gap = 3) => (x, y, i) => (Math.round(y) % (gap + 2) === 0 && i >= 2 ? -1 : 0),
  plates: (gap = 5) => (x, y, i) => (Math.round(y) % (gap + 1) === 0 && i >= 1 ? -1 : 0),
  stars: (seed = 3) => (x, y) => { const h = Math.sin(Math.round(x) * 91.7 + Math.round(y) * 47.3 + seed) * 9137.1; return h - Math.floor(h) > 0.95 ? 4 : 0; }
};
