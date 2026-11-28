/* ───────── 빌드 78: 주문서 바르기 연출 (11-28 대표님 7번 둘째) ─────────
   바르기를 누르면 화면 가운데에 1.6초: 주문서가 장비 위에 떠올라 빛을 모으고 —
   · 성공: 주문서가 위에서부터 금빛 알갱이로 풀려 장비로 빨려 들고, 장비가 하얗게 번쩍인 뒤 금빛 테 · 반짝이
   · 실패: 주문서가 아래에서부터 불씨 테를 두르며 타들어 가 잿가루로 흩어지고, 장비는 그대로(흐리게 한 번 떨림)
   그림은 그 주문서 · 장비 그림을 작은 판(72×64)에 줄여 찍고 칸 단위로 굽는다(도트 — 흐린 빛 · 둥근 빛 없음). 누르면 바로 닫힌다. */
const SCRFX = { W: 72, H: 64, Z: 4, T: 1.6, S: 22, G: 24 };
function scrFxImg(url, n) {
  return new Promise(res => {
    if (!url) return res(null);
    const im = new Image();
    im.onload = () => { const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'); x.imageSmoothingEnabled = true; const k = Math.min(n / im.width, n / im.height), w = Math.round(im.width * k), h = Math.round(im.height * k); x.drawImage(im, (n - w) >> 1, (n - h) >> 1, w, h);
      const d = x.getImageData(0, 0, n, n); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; x.putImageData(d, 0, 0); res({ c, d }); };   // 반투명 가장자리는 칸으로 자른다
    im.onerror = () => res(null); im.src = url;
  });
}
const scrHash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
async function scrFx(ok, it, g) {
  if (typeof document === 'undefined' || !document.body) return;
  const old = document.getElementById('scrfx'); if (old) old.remove();
  const F = SCRFX, [sc, ge] = await Promise.all([scrFxImg(itemHD(it) || iconURL(it), F.S), scrFxImg(typeof armArtURL === 'function' && armArtURL(g) || gearIconURL(g), F.G)]);
  const ov = document.createElement('div'); ov.id = 'scrfx'; ov.className = 'scrfx';
  const cv = document.createElement('canvas'); cv.width = F.W; cv.height = F.H; cv.style.width = F.W * F.Z + 'px'; cv.style.height = F.H * F.Z + 'px';
  const lb = document.createElement('div'); lb.className = 'scrfx-t ' + (ok ? 'ok' : 'no'); lb.textContent = ok ? '성공!' : '실패…';
  ov.append(cv, lb); document.body.appendChild(ov);
  const x = cv.getContext('2d'), sx = (F.W - F.S) >> 1, gx = (F.W - F.G) >> 1, gy = F.H - F.G - 6, t0 = performance.now();
  const P = (px, py, c) => { x.fillStyle = c; x.fillRect(px | 0, py | 0, 1, 1); };
  const done = () => { ov.classList.add('out'); setTimeout(() => ov.remove(), 180); };
  ov.addEventListener('pointerdown', done);
  const motes = [];   // 풀린 알갱이 · 잿가루
  if (sc) for (let y = 0; y < F.S; y++) for (let xx = 0; xx < F.S; xx++) { const i = (y * F.S + xx) * 4; if (sc.d.data[i + 3]) motes.push({ x: xx, y, h: scrHash(xx, y), c: `rgb(${sc.d.data[i]},${sc.d.data[i + 1]},${sc.d.data[i + 2]})` }); }
  const GOLD = ['#fff6c0', '#ffd860', '#f0a828'], EMB = ['#fff0a0', '#ffb040', '#e05020'], ASH = ['#8a8070', '#5a5248', '#3a342e'];
  const frame = now => {
    if (!ov.isConnected) return;
    const t = (now - t0) / 1000; x.clearRect(0, 0, F.W, F.H);
    const lift = Math.min(1, t / 0.3), sy = 10 - Math.round(4 * lift) + (t < 0.55 ? Math.round(Math.sin(t * 18)) : 0);
    // 장비
    if (ge) {
      const shake = !ok && t > 0.55 && t < 0.8 ? (Math.floor(t * 40) % 2 ? 1 : -1) : 0;
      x.globalAlpha = !ok && t > 0.55 ? 0.75 : 1; x.drawImage(ge.c, gx + shake, gy); x.globalAlpha = 1;
      if (ok && t > 0.95) {   // 번쩍 → 금빛 테
        const k = t - 0.95, D = ge.d.data;
        for (let y = 0; y < F.G; y++) for (let xx = 0; xx < F.G; xx++) {
          const a = D[(y * F.G + xx) * 4 + 3]; if (!a) { const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([u, v]) => { const X = xx + u, Y = y + v; return X >= 0 && Y >= 0 && X < F.G && Y < F.G && D[(Y * F.G + X) * 4 + 3]; }); if (nb && ((xx + y + Math.floor(k * 14)) % 3)) P(gx + xx, gy + y, k < 0.4 ? GOLD[0] : GOLD[1]); continue; }
          if (k < 0.12) P(gx + xx, gy + y, '#ffffff'); else if (k < 0.24 && (xx + y) % 2) P(gx + xx, gy + y, GOLD[0]);
        }
        for (let j = 0; j < 4; j++) { const ph = (k * 3 + j * 0.25) % 1, r = Math.round(4 + 14 * ph), ang = j * 1.7 + 0.6, cx = gx + 12 + Math.round(Math.cos(ang) * r), cy = gy + 12 + Math.round(Math.sin(ang) * r * 0.8); if (ph < 0.7) { P(cx, cy, GOLD[0]); if (ph < 0.4) { P(cx - 1, cy, GOLD[1]); P(cx + 1, cy, GOLD[1]); P(cx, cy - 1, GOLD[1]); P(cx, cy + 1, GOLD[1]); } } }
      }
    }
    // 모으는 빛: 둘레에서 주문서로 오는 알갱이 (0.1 ~ 0.55초)
    if (t > 0.1 && t < 0.55) for (let j = 0; j < 10; j++) { const q = ((t - 0.1) / 0.45 + j / 10) % 1, ang = j * 2.4, r = Math.round(22 * (1 - q)); P(sx + 11 + Math.cos(ang) * r, sy + 11 + Math.sin(ang) * r * 0.7, ok ? GOLD[j % 2] : '#c8d0ff'); }
    // 주문서
    const u = Math.max(0, (t - 0.55) / 0.5);   // 0 → 1: 풀리기 · 타기
    for (const m of motes) {
      let gone, edge;
      if (ok) { gone = m.y / F.S + m.h * 0.25 < u * 1.3; edge = !gone && m.y / F.S + m.h * 0.25 < u * 1.3 + 0.08; }
      else { gone = (F.S - 1 - m.y) / F.S + m.h * 0.3 < u * 1.35; edge = !gone && (F.S - 1 - m.y) / F.S + m.h * 0.3 < u * 1.35 + 0.1; }
      if (!gone) { P(sx + m.x, sy + m.y, edge ? (ok ? GOLD[0] : EMB[Math.floor(m.h * 3)]) : m.c); continue; }
      // 떨어져 나간 칸: 성공 = 장비로 빨려 듦 · 실패 = 잿가루가 흩날리며 떨어짐
      const t1 = u * 1.3 - (ok ? m.y / F.S + m.h * 0.25 : (F.S - 1 - m.y) / F.S + m.h * 0.3), q = Math.min(1, t1 * 2.2);
      if (q >= 1 || (m.h > 0.55 && !ok) || (m.h > 0.35 && ok)) continue;   // 알갱이는 일부만 남겨 가볍게
      if (ok) { const tx = gx + 12 + (m.x - 11) * 0.3, ty = gy + 10, e = q * q; P(sx + m.x + (tx - sx - m.x) * e, sy + m.y + (ty - sy - m.y) * e - Math.sin(q * 3.1) * 6, q < 0.5 ? GOLD[0] : GOLD[1]); }
      else { P(sx + m.x + Math.sin(m.h * 20 + q * 6) * 3 * q, sy + m.y + q * 16 * (0.5 + m.h), ASH[q < 0.3 ? 0 : q < 0.7 ? 1 : 2]); if (q < 0.25) P(sx + m.x, sy + m.y - 1 - q * 8, EMB[1]); }
    }
    if (t > 0.35) lb.classList.add('on');
    if (t < F.T) requestAnimationFrame(frame); else done();
  };
  requestAnimationFrame(frame);
}
const _scrDo78fx = scrDo;
scrDo = function (gid, it) {   // eslint-disable-line no-func-assign
  const f = findGear(gid), w = _scrDo78fx(gid, it); if (!w && f && UI.scrLast) scrFx(UI.scrLast.ok, it, f.g); return w;
};
