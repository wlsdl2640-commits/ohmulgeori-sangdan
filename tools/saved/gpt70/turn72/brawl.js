/* 뒤엉켜 싸우는 전투 시안 (11-23 21:25 사용자: 맵은 예전 옆모습 그대로 · 한 줄로 걷다가 만나면 전투 상태 · 근접끼리 겹치게, 역동감)
   build_brawl.py가 __AN__ · __ARC__ · __BG__ · __GOB__를 채워 page_brawl.html로 만든다. 실시간 자동 · 칸 없음 · 수치는 모두 임시. */
(() => {
  const AN = __AN__, ARC = __ARC__, BG = new Image(), GOB = new Image(); BG.src = '__BG__'; GOB.src = '__GOB__';
  for (const S of [AN, ARC]) for (const k in S) { S[k].im = new Image(); S[k].im.src = S[k].src; }
  const cv = document.getElementById('stage'), g = cv.getContext('2d'); cv.width = 480; cv.height = 240; g.imageSmoothingEnabled = false;
  const msg = document.getElementById('msg'), acts = document.getElementById('acts');
  const GY = 188, LINE = [208, 180, 152, 118, 90];                 // 걷는 줄: 맨 앞이 오른쪽
  const R = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.random() * a.length | 0];
  let U = [], FX = [], scroll = 0, phase = 'walk', tPhase = 0, speed = 1, shake = 0, fights = 0, uid = 0, last = 0, T = 0;

  const KIND = {
    전사: { set: AN, hp: 60, atk: 7, cd: 1.15, spd: 62, melee: 1, atks: ['slash3', 'thrust', 'upslash', 'bash'] },
    도적: { set: AN, hp: 42, atk: 6, cd: 0.8, spd: 84, melee: 1, atks: ['thrust', 'slash3', 'upslash'] },
    궁수: { set: ARC, hp: 30, atk: 6, cd: 1.5, spd: 56, melee: 0, atks: ['shoot'] },
    고블린: { hp: 26, atk: 4, cd: 1.3, spd: 58, melee: 1 }
  };
  function mk(side, cls, x, y) { const K = KIND[cls]; return { id: ++uid, side, cls, K, x, y, hp: K.hp, max: K.hp, face: side === 'A' ? 1 : -1, an: 'idle', at: 0, cd: R(0.2, 0.9), st: 'idle', stT: 0, kx: 0, ky: 0, lx: 0, tg: null, slot: 0, dead: 0, flash: 0, hitDone: 1, home: x }; }
  function reset() { U = [mk('A', '전사', LINE[0], GY), mk('A', '도적', LINE[1], GY), mk('A', '전사', LINE[2], GY), mk('A', '궁수', LINE[3], GY), mk('A', '궁수', LINE[4], GY)]; U.forEach((u, i) => { u.li = i; }); FX = []; phase = 'walk'; tPhase = 0; fights = 0; say('한 줄로 걸어갑니다.'); ui(); }
  const say = t => { msg.textContent = t; };
  const live = s => U.filter(u => u.side === s && !u.dead);

  function spawn() { const n = 4 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) { const f = mk('F', '고블린', 500 + i * R(16, 26), GY + R(-12, 12)); U.push(f); } phase = 'meet'; tPhase = 0; say('몬스터가 나타났습니다!'); }

  // ── 전투 두뇌: 칸 없이 목표에게 달라붙는다 ──
  function chooseTarget(u) { const foes = live(u.side === 'A' ? 'F' : 'A'); if (!foes.length) return null; let best = null, bs = 1e9;
    for (const f of foes) { const n = U.filter(o => !o.dead && o !== u && o.side === u.side && o.tg === f && o.K.melee).length; const s = Math.abs(f.x - u.x) + Math.abs(f.y - u.y) * 1.5 + (u.K.melee ? n * 22 : (f.hp / f.max) * 30) + (u.tg === f ? -14 : 0); if (s < bs) { bs = s; best = f; } } return best; }
  function slotOf(u, f) { const same = U.filter(o => !o.dead && o.side === u.side && o.tg === f && o.K.melee).sort((a, b) => a.id - b.id); const i = same.indexOf(u); return [0, -7, 7, -13, 13][Math.max(0, i) % 5]; }
  function hit(a, f, pow, kb) { if (f.dead) return; const dmg = Math.max(1, Math.round(a.K.atk * pow * R(0.85, 1.2))), dir = Math.sign(f.x - a.x) || a.face; f.hp -= dmg; f.flash = 0.12; f.kx += dir * kb; f.ky += R(-10, 10);
    FX.push({ k: 'num', x: f.x, y: f.y - 44, t: 0, v: dmg, c: f.side === 'A' ? '#ff8a7a' : '#fff3b0' }); FX.push({ k: 'spark', x: f.x - dir * 4, y: f.y - 22 + R(-6, 6), t: 0, d: dir });
    if (kb > 60) { shake = 0.16; for (let i = 0; i < 4; i++) FX.push({ k: 'dust', x: f.x + R(-6, 6), y: f.y, t: 0, vx: dir * R(10, 40), vy: R(-30, -8) }); }
    if (f.hp <= 0) { f.dead = 1; f.st = 'dead'; f.stT = 0; f.an = 'fall'; f.at = 0; f.kx += dir * 40; } else if (f.st !== 'atk' || kb > 60) { f.st = 'hurt'; f.stT = 0.26; f.an = 'hurt'; f.at = 0; } }
  function think(u, dt) {
    if (u.dead) { u.stT += dt; return; }
    if (u.st === 'hurt') { u.stT -= dt; if (u.stT <= 0) { u.st = 'idle'; u.an = 'idle'; } return; }
    u.cd -= dt; if (!u.tg || u.tg.dead || Math.random() < dt * 0.6) u.tg = chooseTarget(u); const f = u.tg; if (!f) { if (u.st !== 'atk') u.an = 'idle'; return; }
    if (u.st === 'atk') { const set = u.K.set, n = set ? set[u.an].n : 10, dur = set ? n / 30 : 0.42, p = u.stT / dur; u.stT += dt; u.at = Math.min(n - 1, p * n);
      u.lx = u.K.melee ? Math.sin(Math.min(1, p / 0.55) * Math.PI * 0.5) * (p < 0.55 ? 7 : 7 * Math.max(0, 1 - (p - 0.55) / 0.3)) * u.face : 0;
      if (!u.hitDone && p >= (u.K.melee ? 0.5 : 0.72)) { u.hitDone = 1; if (u.K.melee) { if (Math.abs(f.x - u.x) < 34 && Math.abs(f.y - u.y) < 16) hit(u, f, u.an === 'bash' ? 0.8 : 1, u.an === 'bash' ? 150 : R(28, 55)); FX.push({ k: 'arc', x: u.x + u.face * 14, y: u.y - 24, t: 0, d: u.face, up: u.an === 'upslash' }); } else FX.push({ k: 'arrow', x: u.x + u.face * 12, y: u.y - 26, t: 0, a: u, f, sx: u.x + u.face * 12, sy: u.y - 26 }); }
      if (p >= 1) { u.st = 'idle'; u.an = 'idle'; u.lx = 0; u.cd = u.K.cd * R(0.8, 1.2); } return; }
    u.face = f.x >= u.x ? 1 : -1; let tx, ty;
    if (u.K.melee) { tx = f.x - u.face * 17; ty = f.y + slotOf(u, f); } else { const front = Math.max(...live('A').filter(o => o.K.melee).map(o => o.x), u.x); tx = Math.min(u.x, Math.min(front - 62, f.x - 120)); tx = Math.max(28, Math.max(tx, u.x - 60)); ty = GY + (u.li % 2 ? 9 : -9); }
    const dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy), near = u.K.melee ? d < 5 : d < 3;
    if (!near) { const far = d > 46, v = u.K.spd * (far && u.K.melee ? 1.9 : 1) * dt, s = Math.min(1, v / d); u.x += dx * s; u.y += dy * s; u.an = 'walk'; u.run = far && u.K.melee; if (u.run && Math.random() < dt * 14) FX.push({ k: 'dust', x: u.x - u.face * 8, y: u.y, t: 0, vx: -u.face * R(8, 26), vy: R(-22, -6) }); if (u.K.melee) return; }
    else u.an = 'idle';
    if (u.cd <= 0 && (u.K.melee ? Math.abs(f.x - u.x) < 30 && Math.abs(f.y - u.y) < 14 : true)) { u.st = 'atk'; u.stT = 0; u.hitDone = 0; u.an = u.K.set ? pick(u.K.atks) : 'atk'; u.at = 0; } }
  function physics(u, dt) { u.x += u.kx * dt; u.y += u.ky * dt; u.kx *= Math.pow(0.0008, dt); u.ky *= Math.pow(0.0008, dt); u.y = Math.max(GY - 16, Math.min(GY + 18, u.y)); u.x = Math.max(14, Math.min(466, u.x)); if (u.flash > 0) u.flash -= dt;
    if (u.dead) return; for (const o of U) if (o !== u && !o.dead && o.side === u.side) { const dx = u.x - o.x, dy = u.y - o.y; if (Math.abs(dx) < 9 && Math.abs(dy) < 4) { u.y += (dy >= 0 ? 1 : -1) * 22 * dt; u.x += (dx >= 0 ? 1 : -1) * 10 * dt; } } }   // 같은 편은 완전히 포개지지만 않게 살짝만 민다

  function step(dt) { T += dt; tPhase += dt; shake = Math.max(0, shake - dt);
    if (phase === 'walk') { scroll += dt * 46; U.forEach(u => { u.an = 'walk'; u.face = 1; const tx = LINE[u.li], ty = GY + (u.li % 2 ? 3 : -3); u.x += (tx - u.x) * Math.min(1, dt * 4); u.y += (ty - u.y) * Math.min(1, dt * 4); }); if (tPhase > 3.2) spawn(); }
    else if (phase === 'meet') { scroll += dt * 46 * Math.max(0, 1 - tPhase / 0.7); U.forEach(u => { if (u.side === 'A') { u.an = tPhase < 0.7 ? 'walk' : 'idle'; } else { u.x -= 150 * dt; u.an = 'walk'; } }); if (Math.min(...live('F').map(f => f.x)) < 388) { phase = 'fight'; tPhase = 0; say('전투! 근접은 달려들어 뒤엉키고, 궁수는 뒤에서 쏩니다.'); } }
    else if (phase === 'fight') { U.forEach(u => think(u, dt)); U.forEach(u => physics(u, dt)); U = U.filter(u => !(u.dead && u.side === 'F' && u.stT > 0.7));
      if (!live('F').length && !U.some(u => u.side === 'F')) { phase = 'regroup'; tPhase = 0; fights++; say('이겼습니다. 다시 줄을 맞춥니다.'); }
      else if (!live('A').length) { phase = 'lost'; say('전멸했습니다.'); ui(); } }
    else if (phase === 'regroup') { U.forEach(u => { if (u.dead) { if (tPhase > 0.6) { u.dead = 0; u.hp = Math.ceil(u.max * 0.5); u.st = 'idle'; } return; } u.st = 'idle'; u.lx = 0; u.hp = Math.min(u.max, u.hp + u.max * 0.25 * dt); const tx = LINE[u.li], ty = GY + (u.li % 2 ? 3 : -3), dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy); if (d > 2) { const s = Math.min(1, 70 * dt / d); u.x += dx * s; u.y += dy * s; u.face = dx >= 0 ? 1 : -1; u.an = 'walk'; } else { u.face = 1; u.an = 'idle'; } }); if (tPhase > 1.8) { phase = 'walk'; tPhase = 0; say('한 줄로 걸어갑니다.'); } }
    for (const f of FX) { f.t += dt; if (f.k === 'arrow') { const tx = f.f.x, ty = f.f.y - 22, dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx, dy), v = 420 * dt; if (d <= v || f.f.dead && d < 12) { hit(f.a, f.f, 1, R(18, 30)); f.t = 9; } else { f.x += dx / d * v; f.y += dy / d * v; f.ang = Math.atan2(dy, dx); } } else if (f.k === 'dust') { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 60 * dt; } }
    FX = FX.filter(f => f.t < ({ num: 0.7, spark: 0.16, arc: 0.14, dust: 0.4, arrow: 3 }[f.k])); }

  // ── 그리기 ──
  function wagon(x, y) { const o = '#060608', bob = phase === 'walk' ? Math.floor(scroll / 6) % 2 : 0; g.fillStyle = 'rgba(30,40,20,.35)'; g.fillRect(x, y - 1, 40, 3); g.fillStyle = o; g.fillRect(x + 1, y - 33 + bob, 36, 20); g.fillStyle = '#e9dcc0'; g.fillRect(x + 2, y - 32 + bob, 34, 18); g.fillStyle = '#cdbb96'; for (let i = 0; i < 4; i++) g.fillRect(x + 9 + i * 8, y - 32 + bob, 1, 18);
    g.fillStyle = o; g.fillRect(x, y - 15 + bob, 40, 10); g.fillStyle = '#8a5a34'; g.fillRect(x + 1, y - 14 + bob, 38, 8); g.fillStyle = '#6b4226'; g.fillRect(x + 1, y - 10 + bob, 38, 1);
    [9, 30].forEach(cx => { g.fillStyle = o; g.beginPath(); g.arc(x + cx, y - 6, 7, 0, 7); g.fill(); g.fillStyle = '#6b4226'; g.beginPath(); g.arc(x + cx, y - 6, 5.6, 0, 7); g.fill(); g.fillStyle = o; g.fillRect(x + cx - 1, y - 7, 3, 3); }); }
  function drawUnit(u) { const x = Math.round(u.x + u.lx), y = Math.round(u.y); g.fillStyle = 'rgba(20,30,15,.3)'; g.beginPath(); g.ellipse(x, y, 11, 3.2, 0, 0, 7); g.fill();
    if (u.K.set) { const a = u.K.set[u.an] || u.K.set.idle, loop = u.an === 'idle' || u.an === 'walk', fr = loop ? Math.floor(T * (u.an === 'walk' ? (u.run ? 26 : 17) : 12)) % (u.an === 'walk' && u.K.set === AN ? Math.min(10, a.n) : a.n) : Math.min(a.n - 1, Math.floor(u.st === 'dead' ? u.stT * 22 : u.st === 'hurt' ? (0.26 - u.stT) / 0.26 * a.n : u.at));
      g.save(); if (u.dead && u.side === 'A') g.globalAlpha = 0.85; if (u.face < 0) { g.translate(x, 0); g.scale(-1, 1); g.drawImage(a.im, fr * 80, 0, 80, 80, -42, y - 66, 80, 80); } else g.drawImage(a.im, fr * 80, 0, 80, 80, x - 38, y - 66, 80, 80);
      if (u.flash > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.5; if (u.face < 0) g.drawImage(a.im, fr * 80, 0, 80, 80, -42, y - 66, 80, 80); else g.drawImage(a.im, fr * 80, 0, 80, 80, x - 38, y - 66, 80, 80); } g.restore(); }
    else { const w = GOB.width, h = GOB.height, p = u.st === 'atk' ? u.stT / 0.42 : 0, sq = u.st === 'atk' ? 1 + Math.sin(Math.min(1, p) * Math.PI) * 0.12 : 1, bob = u.an === 'walk' ? Math.abs(Math.sin(T * 13 + u.id)) * 2 : 0;
      g.save(); g.translate(x, y - bob); if (u.dead) { g.globalAlpha = Math.max(0, 1 - u.stT / 0.7); g.rotate(-u.face * Math.min(1.4, u.stT * 4)); } g.scale(u.face > 0 ? -sq : sq, 2 - sq); g.drawImage(GOB, -w / 2, -h); if (u.flash > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.6; g.drawImage(GOB, -w / 2, -h); } g.restore(); }
    if (!u.dead && phase !== 'walk' && u.hp < u.max) { const top = y - (u.K.set ? 50 : 44); g.fillStyle = '#060608'; g.fillRect(x - 11, top, 22, 4); g.fillStyle = '#3a1f1f'; g.fillRect(x - 10, top + 1, 20, 2); g.fillStyle = u.side === 'A' ? '#6fd36a' : '#e0564c'; g.fillRect(x - 10, top + 1, Math.max(0, Math.round(20 * u.hp / u.max)), 2); } }
  function render() { g.save(); if (shake > 0) g.translate(Math.round(R(-2, 2)), Math.round(R(-1.5, 1.5))); const so = Math.floor(scroll) % 720; g.drawImage(BG, -so, 0); g.drawImage(BG, 720 - so, 0);
    wagon(22, GY + 4);
    [...U].sort((a, b) => a.y - b.y || a.id - b.id).forEach(drawUnit);
    for (const f of FX) { if (f.k === 'num') { const p = f.t / 0.7; g.font = 'bold 10px monospace'; g.textAlign = 'center'; g.fillStyle = '#060608'; g.fillText(f.v, Math.round(f.x) + 1, Math.round(f.y - p * 14) + 1); g.fillStyle = f.c; g.fillText(f.v, Math.round(f.x), Math.round(f.y - p * 14)); }
      else if (f.k === 'spark') { const r = 2 + f.t * 40; g.fillStyle = '#fff8d8'; for (let i = 0; i < 5; i++) { const an = i * 1.256 + f.x; g.fillRect(Math.round(f.x + Math.cos(an) * r), Math.round(f.y + Math.sin(an) * r), 2, 2); } }
      else if (f.k === 'arc') { const p = f.t / 0.14; g.strokeStyle = `rgba(255,255,255,${0.9 - p * 0.7})`; g.lineWidth = 3; g.beginPath(); if (f.d > 0) g.arc(f.x - 8, f.y + 2, 17, f.up ? 0.9 - p : -1.1 + p * 0.4, f.up ? -0.7 : 0.9, f.up); else g.arc(f.x + 8, f.y + 2, 17, f.up ? Math.PI - 0.9 + p : Math.PI + 1.1 - p * 0.4, f.up ? Math.PI + 0.7 : Math.PI - 0.9, !f.up); g.stroke(); }
      else if (f.k === 'dust') { g.fillStyle = `rgba(214,196,150,${0.8 - f.t * 2})`; const s = 2 + Math.floor(f.t * 8); g.fillRect(Math.round(f.x), Math.round(f.y - 2), s, s); }
      else if (f.k === 'arrow') { g.save(); g.translate(Math.round(f.x), Math.round(f.y)); g.rotate(f.ang || 0); g.fillStyle = '#060608'; g.fillRect(-9, -1, 12, 3); g.fillStyle = '#d9c08a'; g.fillRect(-8, 0, 9, 1); g.fillStyle = '#e9e9f0'; g.fillRect(1, 0, 2, 1); g.fillStyle = '#c0392b'; g.fillRect(-9, 0, 2, 1); g.restore(); } }
    g.restore(); }
  function ui() { acts.innerHTML = ''; const add = (t, fn, on) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (on ? ' on' : ''); b.textContent = t; b.addEventListener('click', fn); acts.appendChild(b); };
    add('처음부터 다시', reset); add(speed === 1 ? '느리게 보기' : '보통 빠르기', () => { speed = speed === 1 ? 0.4 : 1; ui(); }, speed !== 1); add('바로 전투', () => { if (phase === 'walk') { tPhase = 9; } }); }
  function loop(ts) { const dt = Math.min(0.05, (ts - last) / 1000 || 0) * speed; last = ts; step(dt); render(); requestAnimationFrame(loop); }
  window.__brawl = { get phase() { return phase; }, get U() { return U; }, get fights() { return fights; } };
  reset(); requestAnimationFrame(loop);
})();
