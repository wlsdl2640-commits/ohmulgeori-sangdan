/* 야영 시안 (11-11 00:34 사용자) — fieldScene의 야영만 갈아 끼운다. WAGON62 = 웨건 칸(80×50, 앞이 오른쪽) */
drawWeather = () => {}; groundWx = () => {};

const C62 = { mode: 'fire', shift: 2.4, walk: 0.9 };
const WAG_PAL = {
  day: { C: '#ece0c4', c: '#c8b890', d: '#968260', e: '#3c2c1e', B: '#3a5a9a', b: '#243a6a', k: '#964028', K: '#5a2416', R: '#c84a2a', r: '#e6824a', T: '#2a2630', h: '#3c281e', v: '#462c1c', V: '#6e4628', w: '#8c6038', W: '#503420' },
  lit: { C: '#ffe6a0', c: '#e8b860', d: '#b07a3a', e: '#fff4c8', B: '#3a5a9a', b: '#243a6a', k: '#964028', K: '#5a2416', R: '#c84a2a', r: '#e6824a', T: '#2a2630', h: '#3c281e', v: '#462c1c', V: '#6e4628', w: '#8c6038', W: '#503420' }
};
function drawWagon62(w, x, gy, lit, dir) {
  const gr = pxGrid(80, 50); pxPut(gr, WAGON62, 0, 0);
  w.save(); w.translate(Math.round(x), gy); w.scale(dir || 1, 1);
  pxBlit(w, pxBake('wag62' + (lit ? 'L' : 'D'), gr, WAG_PAL[lit ? 'lit' : 'day'], 40, 49));
  w.restore();
}
const isPorterFam = a => jobBase(a.cls) === 'porter';
const TENT_AT = [[-58, 7], [-94, 1], [-22, -5]];        // 불(cx) 기준 텐트 자리(아래 가운데): 앞 · 뒤 왼쪽 · 뒤 가운데
const tentsFor = n => (n <= 3 ? 1 : n <= 5 ? 2 : 3);     // 텐트 하나에 두 명 (불침번 한 명은 밖)
const _fieldScene62 = fieldScene;
fieldScene = function (w, t, p, e, lights, post, dark, bg) {
  if (!e.camp || e.foes.length) return _fieldScene62(w, t, p, e, lights, post, dark, bg);
  const team = teamOf(p).filter(a => !a.down), cx = AW / 2, cy = GL + 16, mode = C62.mode, pos = {};
  // 불침번 차례: 짐꾼 계열 먼저 → 나머지는 파티 순서
  const order = team.filter(isPorterFam).concat(team.filter(a => !isPorterFam(a)));
  const ct = e.camp.t, sh = C62.shift, k = Math.floor(ct / sh), inShift = ct - k * sh;
  const cur = order[k % order.length], nxt = order[(k + 1) % order.length], swap = inShift > sh - C62.walk && order.length > 1;
  const sw = swap ? (inShift - (sh - C62.walk)) / C62.walk : 0;   // 0 → 1 교대 걸음
  const seat = [cx + 20, cy];                                      // 불침번 자리: 불 오른쪽, 불과 잠자리를 바라본다
  // 잠자리 (모닥불만이면 불가, 텐트 · 웨건이면 그 안)
  let door = null;
  // 텐트 (11-11 01:07 사용자): 텐트 하나에 두 명 · 4명 이상이면 텐트 둘(5명까지), 6명부터 셋 — 불침번 한 명은 밖
  let TP = null, slots = null;
  if (mode === 'tent') {
    const L = order.length, nT = tentsFor(L);
    TP = TENT_AT.slice(0, nT).map(([ox, oy]) => [cx + ox, GL + oy]);
    TP.map((q, i) => i).sort((i, j) => TP[i][1] - TP[j][1]).forEach(i => { w.save(); w.translate(TP[i][0], TP[i][1]); drawTentHi(w); w.restore(); });
    // 잠자리 칸: 처음엔 첫 불침번 다음 차례대로 두 명씩 · 교대할 때마다 나온 사람 칸에 들어간 사람
    slots = order.slice(1);
    for (let j = 1; j <= k; j++) { const i = slots.indexOf(order[j % L]); if (i >= 0) slots[i] = order[(j - 1) % L]; }
    const ti = Math.max(0, Math.floor(slots.indexOf(nxt) / 2));
    door = [TP[ti][0] - 4, TP[ti][1] + 1];
  }
  if (p.wagon && mode !== 'wagon') drawRig(w, mode === 'tent' ? 214 : 26, GL + 10, t, p, false, mode === 'tent' ? -1 : 1);
  if (mode === 'wagon') {
    const lit = dark > 0.3; drawWagon62(w, cx - 70, GL + 14, lit, -1); door = [cx - 32, cy - 4];   // 뒤(덮개 구멍)가 불 쪽
    if (lit) { lights.push({ x: cx - 70, y: GL - 16, r: 64, c: '#f0c060', glow: 1, flick: 0 }); post.push(g => { R(g, cx - 34.5, GL - 22, 1, 6, '#3a2a1a'); }); post.push(g => lanternHi(g, cx - 31, GL - 6, t)); lights.push({ x: cx - 31, y: GL - 12, r: 46, c: '#f0c060', glow: 1, flick: 1 }); }
  }
  const draw = (a, x, y, o, flip) => { shadowAt(w, x, y, o.sleep ? 14 : 8); w.save(); w.translate(x, y); w.scale(flip ? -1 : 1, 1); drawAdv(w, a, t, Object.assign({ z: ZS, side: 1 }, o)); w.restore(); pos['a' + a.id] = [x, y]; };
  if (mode === 'fire') {
    // 모두 불가: 불침번만 앉아 있고 나머지는 누워 잔다 (교대하면 일어나 앉는다)
    let si = 0;
    team.forEach(a => {
      const watch = a === cur || (swap && a === nxt && sw > 0.5), awakeNext = swap && a === nxt;
      if (a === cur) { draw(a, seat[0], seat[1], swap && sw > 0.6 ? { sleep: 0, walk: 0 } : { sit: 1 }, true); if (swap && sw > 0.6) post.push(g => drawZ(g, seat[0] - 6, seat[1] - 14, t, 0)); return; }
      const side = si % 2 ? 1 : -1, kk = Math.floor(si / 2); si++;
      const x = cx + (side < 0 ? -1 : 1) * (side < 0 ? 26 + kk * 24 : 46 + kk * 24), y = cy + (side < 0 ? 0 : 4);
      if (awakeNext && sw > 0.35) draw(a, x, y, { sit: 1 }, side > 0);
      else { draw(a, x, y, { sleep: 1 }, side > 0); post.push(g => drawZ(g, x + (side > 0 ? 8 : -8), y - 14, t, si * 0.3)); }
    });
  } else {
    // 텐트 · 웨건: 불침번만 밖. 교대 때 다음 사람이 잠자리에서 나와 걸어오고, 앞 사람은 그 잠자리로 들어간다 (불 앞으로 돌아서 걷는다)
    const qIn = Math.min(1, sw * 1.4), qOut = Math.max(0, sw * 1.4 - 0.4);
    const path = (A, B, q) => { const mid = [A[0] + (B[0] - A[0]) * 0.15, Math.max(A[1], B[1]) + 4], u = q < 0.35 ? q / 0.35 : (q - 0.35) / 0.65, P = q < 0.35 ? [A, mid] : [mid, B]; return [P[0][0] + (P[1][0] - P[0][0]) * u, P[0][1] + (P[1][1] - P[0][1]) * u]; };
    if (!swap) draw(cur, seat[0], seat[1], { sit: 1 }, true);
    else {
      const a1 = path(door, [seat[0] + 10, seat[1]], qIn), a0 = path(seat, door, qOut);
      draw(nxt, a1[0], a1[1], { walk: 1 }, a1[0] < door[0]);                                  // 나와서 불 쪽으로
      draw(cur, a0[0], a0[1], qOut > 0 ? { walk: 1 } : { sit: 1 }, true);                     // 일어나 잠자리로
    }
    if (mode === 'tent') TP.forEach(([x, y], i) => {   // 텐트마다 안에서 자는 사람 수만큼 쿨쿨
      const inside = slots.slice(i * 2, i * 2 + 2).filter(a => !(swap && a === nxt && qIn > 0));
      inside.forEach((a, m) => post.push(g => drawZ(g, x + 1 + m * 6, y - 19 - m * 3, t, i * 0.5 + m * 0.3)));
    });
    else for (let i = 0; i < 3; i++) post.push(g => drawZ(g, door[0] + 4 + i * 3, door[1] - 22 - i * 2, t, i * 0.4));
  }
  post.push(g => fireHi(g, cx, cy, t)); lights.push({ x: cx, y: cy - 6, r: 90, c: '#f09040', glow: 1, flick: 1 });
  Object.assign(V.last, pos);
};
window.CAMP_RUN = (mode, taus, crop, n) => {
  if (!S) S = blankState();
  if (!V.g) { const cv = document.createElement('canvas'); cv.width = AW * HI; cv.height = AH * HI; initView(cv); }
  S.t = (C62.hour || 0.84) * DAY_SEC + DAY_SEC * 3;   // 밤
  C62.mode = mode;
  const lead = mode === 'fire' ? 'porter' : 'coachman';
  if (!C62.coach0) C62.coach0 = PXL.coachman;
  PXL.coachman = mode === 'wagon' ? CG[1][2] : C62.coach0;   // 코네스토가 = B 푸른 짐칸 (00:49)
  PXC.clear();
  const cls = [lead, 'warrior', 'cleric', 'archer', 'mage', 'rogue'].slice(0, n || 4);
  const team = cls.map((c, i) => { const a = makeAdv({ cls: c, lv: 60 }); a.id = 900 + i; a.look = { hair: ['#5a3a22', '#c89a4a', '#2a2a3a', '#8a4a2a', '#d8d0c0', '#3a2a22'][i], skin: ['#e0ac7e', '#f0c8a0', '#c8946a', '#e8b890', '#f0c8a0', '#c8946a'][i] }; a.status = 'away'; a.fat = 50; return a; });
  S.advs = team.slice();
  if (!S.parties.length) S.parties.push(newParty('1팀', [])); const p = S.parties[0]; p.members = team.map(a => a.id); p.wagon = mode === 'tent' ? 'wagon' : mode === 'fire' ? 'cart' : null; p.horse = mode === 'tent' ? 'h:gray' : null; S.view = p.id;
  const e = { field: 'plains', area: 'field', stage: 8, pos: 60, mode: 'advance', encs: [], ei: 0, foes: [], next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], camp: { t: 0, tent: mode !== 'fire' ? 1.5 : 0 } };
  p.exp = e; V.mode = ''; V.fx = [];
  const out = [], t0 = 10;
  drawFrame(t0 * 1000 - 100, t0 - 0.1);
  for (const tau of taus) {
    e.camp.t = tau; const t = t0 + tau; drawFrame(t * 1000, t);
    const [x, y, cw, ch] = crop, c = document.createElement('canvas'); c.width = cw * HI; c.height = ch * HI;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(V.off, x * HI, y * HI, cw * HI, ch * HI, 0, 0, cw * HI, ch * HI);
    out.push(c.toDataURL());
  }
  return out;
};
