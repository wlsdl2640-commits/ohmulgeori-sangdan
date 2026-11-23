/* 뒤엉켜 싸우는 전투 시안 (11-23 21:25 사용자: 맵은 예전 옆모습 그대로 · 한 줄로 걷다가 만나면 전투 상태 · 근접끼리 겹치게, 역동감)
   build_brawl.py가 __AN__ · __ARC__ · __BG__ · __GOB__를 채워 page_brawl.html로 만든다. 실시간 자동 · 칸 없음 · 수치는 모두 임시. */
(() => {
  const AN = __AN__, ARC = __ARC__, ROG = __ROG__, BG = new Image(), GOB = new Image(); BG.src = '__BG__'; GOB.src = '__GOB__';
  for (const S of [AN, ARC, ROG]) for (const k in S) { S[k].im = new Image(); S[k].im.src = S[k].src; }
  const cv = document.getElementById('stage'), g = cv.getContext('2d'); cv.width = 480; cv.height = 240; g.imageSmoothingEnabled = false;
  const msg = document.getElementById('msg'), acts = document.getElementById('acts');
  const GY = 188, YT = 154, YB = 214, LINE = [208, 180, 152, 118, 90];                 // 걷는 줄: 맨 앞이 오른쪽
  const R = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.random() * a.length | 0];
  let U = [], FX = [], scroll = 0, phase = 'walk', tPhase = 0, speed = 1, shake = 0, fights = 0, uid = 0, last = 0, T = 0;

  const KIND = {
    전사: { set: AN, hp: 110, atk: 8, cd: 1.15, spd: 62, melee: 1, atks: ['slash3', 'thrust', 'upslash', 'bash'] },
    도적: { set: ROG, hp: 75, atk: 7, cd: 0.8, spd: 84, melee: 1, atks: ['thrust', 'slash', 'double', 'backstab'] },
    궁수: { set: ARC, hp: 55, atk: 7, cd: 1.5, spd: 56, melee: 0, atks: ['shoot'] },
    고블린: { hp: 22, atk: 2, cd: 1.5, spd: 60, melee: 1 }
  };
  function mk(side, cls, x, y) { const K = KIND[cls]; return { id: ++uid, side, cls, K, x, y, hp: K.hp, max: K.hp, face: side === 'A' ? 1 : -1, an: 'idle', at: 0, cd: R(0.2, 0.9), st: 'idle', stT: 0, kx: 0, ky: 0, lx: 0, tg: null, slot: 0, dead: 0, flash: 0, hitDone: 1, home: x, shout: R(1, 2), kick: 0, bash: 0 }; }
  function reset() { U = [mk('A', '전사', LINE[0], GY), mk('A', '도적', LINE[1], GY), mk('A', '전사', LINE[2], GY), mk('A', '궁수', LINE[3], GY), mk('A', '궁수', LINE[4], GY)]; U.forEach((u, i) => { u.li = i; u.lane = [GY, YT + 10, YB - 8, GY, GY][i]; u.post = [[318, GY - 4], null, [240, GY + 8]][i] || null; }); FX = []; phase = 'walk'; tPhase = 0; fights = 0; say('한 줄로 걸어갑니다.'); ui(); }
  const say = t => { msg.textContent = t; };
  const live = s => U.filter(u => u.side === s && !u.dead);

  function spawn() { const n = 8 + (Math.random() * 5 | 0); for (let i = 0; i < n; i++) { const f = mk('F', '고블린', 500 + i * R(14, 24), R(YT + 4, YB - 4)); f.lane = f.y; U.push(f); } const front = U.filter(u => u.side === 'A' && u.K.melee), back = U.filter(u => u.side === 'A' && !u.K.melee); live('F').forEach((f, i) => { f.pref = i % 5 === 4 ? back[i % back.length] : front[i % front.length]; f.caught = 0; }); phase = 'meet'; tPhase = 0; say('몬스터가 나타났습니다!'); }

  // ── 전투 두뇌: 칸 없이 목표에게 달라붙는다 ──
  function chooseTarget(u) { let foes = live(u.side === 'A' ? 'F' : 'A'); if (!foes.length) return null; if (u.pref && !u.pref.dead) return u.pref; if (u.cls === '도적') { let b = null, bs2 = 1e9; for (const f of foes) { const held = f.tg && f.tg.cls === '전사' && Math.hypot(f.x - f.tg.x, f.y - f.tg.y) < 40 ? 1 : 0, sc = f.hp / f.max * 70 + Math.hypot(f.x - u.x, f.y - u.y) * 0.45 - held * 34 + (u.tg === f ? -16 : 0); if (sc < bs2) { bs2 = sc; b = f; } } return b; } if (u.post && foes.length > 3) { const nearP = foes.filter(f => Math.hypot(f.x - u.post[0], (f.y - u.post[1]) * 1.6) < 78); if (!nearP.length) return null; foes = nearP; } let best = null, bs = 1e9;
    for (const f of foes) { const n = U.filter(o => !o.dead && o !== u && o.side === u.side && o.tg === f && o.K.melee).length; const s = Math.abs(f.x - u.x) + Math.abs(f.y - u.y) * 0.8 + (u.K.melee ? n * (u.side === 'A' ? 46 : 34) : (f.hp / f.max) * 30) + (u.tg === f ? -18 : 0) + (u.K.melee && u.lane != null ? Math.abs(f.y - u.lane) * (u.side === 'A' ? 1.6 : 0.5) : 0); if (s < bs) { bs = s; best = f; } } return best; }
  function slotOf(u, f) { const same = U.filter(o => !o.dead && o.side === u.side && o.tg === f && o.K.melee).sort((a, b) => a.id - b.id); const i = same.indexOf(u); return [[1, 0], [-1, -4], [1, -13], [1, 13], [-1, 10], [-1, -16], [1, 22]][Math.max(0, i) % 7]; }
  function hit(a, f, pow, kb) { if (f.dead) return; const dmg = Math.max(1, Math.round(a.K.atk * pow * R(0.85, 1.2))), dir = Math.sign(f.x - a.x) || a.face; f.hp -= dmg; f.flash = 0.12; f.kx += dir * (kb + (f.cls === '도적' ? 70 : 0)); f.ky += R(-10, 10);
    FX.push({ k: 'num', x: f.x, y: f.y - 44, t: 0, v: dmg, c: f.side === 'A' ? '#ff8a7a' : '#fff3b0' }); FX.push({ k: 'spark', x: f.x - dir * 4, y: f.y - 22 + R(-6, 6), t: 0, d: dir });
    if (kb > 60) { shake = 0.16; for (let i = 0; i < 4; i++) FX.push({ k: 'dust', x: f.x + R(-6, 6), y: f.y, t: 0, vx: dir * R(10, 40), vy: R(-30, -8) }); }
    if (f.hp <= 0) { f.dead = 1; f.st = 'dead'; f.stT = 0; f.an = 'fall'; f.at = 0; f.kx += dir * 40; } else if (f.st !== 'atk' || kb > 60) { f.st = 'hurt'; f.stT = 0.26; f.an = 'hurt'; f.at = 0; } }
  function think(u, dt) {
    if (u.dead) { u.stT += dt; return; }
    if (u.st === 'hurt') { u.stT -= dt; if (u.stT <= 0) { u.st = 'idle'; u.an = 'idle'; } return; }
    u.cd -= dt; u.shout -= dt; u.kick -= dt; u.bash -= dt;
    if (u.st === 'spec') { const kick = u.spK === 'kick', nUse = kick ? 14 : 18, p = u.stT / (nUse / 30); u.stT += dt; u.an = kick ? 'kick' : 'homerun'; u.at = Math.min(nUse - 1, p * nUse); u.lx = 0;
      if (!u.hitDone && p >= (kick ? 0.43 : 0.47)) { u.hitDone = 1; const q = u.sp; if (q && !q.dead && Math.hypot(q.x - u.x, q.y - u.y) < 46) { hit(u, q, kick ? 0.5 : 0.9, kick ? 250 : 430); if (!kick) { q.ky -= 60; shake = 0.2; } } }
      if (p >= 1) { u.st = 'idle'; u.an = 'idle'; u.cd = Math.max(u.cd, 0.25); } return; }
    if (u.side === 'F' && u.pref && !u.pref.K.melee && !u.caught) for (const w of live('A')) if (w.cls === '전사' && w.st !== 'hurt' && Math.hypot(w.x - u.x, (w.y - u.y) * 1.3) < 27) { u.caught = 1; u.pref = w; u.tg = w; u.kx += 90; FX.push({ k: 'txt', x: w.x, y: w.y - 52, t: 0, v: '막았다!', c: '#bfe0ff' }); FX.push({ k: 'spark', x: (w.x + u.x) / 2, y: w.y - 22, t: 0, d: 1 }); break; }     // 길목 막기: 전사 옆을 지나 뒷줄로 가려던 몬스터는 전사에게 붙잡힌다
    if (u.cls === '전사' && u.shout <= 0 && u.st !== 'atk') { const pests = live('F').filter(q => q.tg && !q.tg.K.melee && Math.hypot(q.x - q.tg.x, q.y - q.tg.y) < 40); if (pests.length) { u.shout = 7; pests.forEach(q => { q.pref = u; q.tg = u; q.caught = 1; }); FX.push({ k: 'ring', x: u.x, y: u.y - 22, t: 0 }); FX.push({ k: 'txt', x: u.x, y: u.y - 56, t: 0, v: '우렁찬 외침!', c: '#ffe08a' }); shake = 0.12; } }     // 끌어오기
    if (!u.tg || u.tg.dead || Math.random() < dt * 0.9) u.tg = chooseTarget(u); const f = u.tg; if (!f) { if (u.st !== 'atk') { if (u.post && live('F').length) { const dx = u.post[0] - u.x, dy = u.post[1] - u.y, d = Math.hypot(dx, dy); if (d > 3) { const s2 = Math.min(1, u.K.spd * 1.9 * dt / d); u.x += dx * s2; u.y += dy * s2; u.an = 'walk'; u.run = 1; u.face = dx >= 0 ? 1 : -1; if (Math.random() < dt * 14) FX.push({ k: 'dust', x: u.x - u.face * 8, y: u.y, t: 0, vx: -u.face * R(8, 26), vy: R(-22, -6) }); return; } u.face = 1; } u.an = 'idle'; } return; }
    if (u.st === 'atk') { const set = u.K.set, n = set ? set[u.an].n : 10, dur = set ? n / 30 : 0.42, p = u.stT / dur; u.stT += dt; u.at = Math.min(n - 1, p * n);
      u.lx = u.K.melee ? Math.sin(Math.min(1, p / 0.55) * Math.PI * 0.5) * (p < 0.55 ? 7 : 7 * Math.max(0, 1 - (p - 0.55) / 0.3)) * u.face : 0;
      if (!u.hitDone && p >= (u.K.melee ? 0.5 : 0.72)) { u.hitDone = 1; if (u.K.melee) { if (Math.abs(f.x - u.x) < 36 && Math.abs(f.y - u.y) < 24) { const back = u.cls === '도적' && Math.sign(u.x - f.x) === -f.face; if (back) FX.push({ k: 'txt', x: f.x, y: f.y - 54, t: 0, v: '뒤치기!', c: '#ffb0d0' }); hit(u, f, (u.an === 'bash' ? 0.8 : 1) * (back ? 1.7 : 1), u.an === 'bash' ? 150 : R(28, 55)); } FX.push({ k: 'arc', x: u.x + u.face * 14, y: u.y - 24, t: 0, d: u.face, up: u.an === 'upslash' }); } else FX.push({ k: 'arrow', x: u.x + u.face * 12, y: u.y - 26, t: 0, a: u, f, sx: u.x + u.face * 12, sy: u.y - 26 }); }
      if (p >= 1) { u.st = 'idle'; u.an = 'idle'; u.lx = 0; u.cd = u.K.cd * R(0.8, 1.2); } return; }
    u.face = f.x >= u.x ? 1 : -1; let tx, ty;
    if (u.K.melee) { const sl = u.cls === '도적' ? [f.face > 0 ? 1 : -1, u.id % 2 ? 6 : -6] : slotOf(u, f), base = u.side === 'A' ? -1 : 1; tx = f.x + base * sl[0] * 19; ty = f.y + sl[1]; } else { const front = Math.max(...live('A').filter(o => o.K.melee).map(o => o.x), u.x); tx = Math.min(u.x, Math.min(front - 62, f.x - 120)); tx = Math.max(74, Math.max(tx, u.x - 60)); ty = GY + (u.li % 2 ? 20 : -22); const nf = live('F').sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0]; if (nf && Math.hypot(nf.x - u.x, nf.y - u.y) < 27 && (u.kick <= 0 || u.bash <= 0)) { u.spK = u.bash <= 0 ? 'bash' : 'kick'; if (u.spK === 'kick') u.kick = 3; else u.bash = 5; u.st = 'spec'; u.stT = 0; u.hitDone = 0; u.sp = nf; u.face = nf.x >= u.x ? 1 : -1; FX.push({ k: 'txt', x: u.x, y: u.y - 54, t: 0, v: u.spK === 'kick' ? '발차기!' : '활로 치기!', c: '#c8f0b0' }); return; }
      if (nf && Math.hypot(nf.x - u.x, nf.y - u.y) < 48) { const w = live('A').filter(o => o.cls === '전사').sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0]; if (w) { const ax = w.x - nf.x, ay = w.y - nf.y, al = Math.hypot(ax, ay) || 1; tx = w.x + ax / al * 30; ty = w.y + ay / al * 18; } else { tx = u.x - 40; ty = u.y + (u.y > nf.y ? 30 : -30); } tx = Math.max(40, Math.min(440, tx)); ty = Math.max(YT, Math.min(YB, ty)); } }
    const dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy), near = u.K.melee ? d < 5 : d < 3;
    if (!near) { const far = d > 46, v = u.K.spd * (far && u.K.melee ? 1.9 : 1) * dt, s = Math.min(1, v / d); u.x += dx * s; u.y += dy * s; u.an = 'walk'; u.run = far && u.K.melee || !u.K.melee && d > 14; if (!u.K.melee && d > 14) { u.x += dx * s * 0.7; u.y += dy * s * 0.7; } if (u.run && Math.random() < dt * 14) FX.push({ k: 'dust', x: u.x - u.face * 8, y: u.y, t: 0, vx: -u.face * R(8, 26), vy: R(-22, -6) }); if (u.K.melee) return; }
    else u.an = 'idle';
    if (u.cd <= 0 && (u.K.melee ? Math.abs(f.x - u.x) < 32 && Math.abs(f.y - u.y) < 22 : true)) { u.st = 'atk'; u.stT = 0; u.hitDone = 0; u.an = u.K.set ? pick(u.K.atks) : 'atk'; u.at = 0; } }
  function physics(u, dt) { u.x += u.kx * dt; u.y += u.ky * dt; u.kx *= Math.pow(0.0008, dt); u.ky *= Math.pow(0.0008, dt); u.y = Math.max(YT, Math.min(YB, u.y)); u.x = Math.max(14, Math.min(466, u.x)); if (u.flash > 0) u.flash -= dt;
    if (u.dead) return; for (const o of U) if (o !== u && !o.dead && o.side === u.side) { const dx = u.x - o.x, dy = u.y - o.y; if (Math.abs(dx) < 12 && Math.abs(dy) < 6) { u.y += (dy >= 0 ? 1 : -1) * 30 * dt; u.x += (dx >= 0 ? 1 : -1) * 14 * dt; } } }   // 같은 편은 완전히 포개지지만 않게 살짝만 민다

  function step(dt) { T += dt; tPhase += dt; shake = Math.max(0, shake - dt);
    if (phase === 'walk') { scroll += dt * 46; U.forEach(u => { u.an = 'walk'; u.face = 1; const tx = LINE[u.li], ty = GY + (u.li % 2 ? 3 : -3); u.x += (tx - u.x) * Math.min(1, dt * 4); u.y += (ty - u.y) * Math.min(1, dt * 4); }); if (tPhase > 3.2) spawn(); }
    else if (phase === 'meet') { scroll += dt * 46 * Math.max(0, 1 - tPhase / 0.7); U.forEach(u => { if (u.side === 'A') { u.an = tPhase < 0.7 ? 'walk' : 'idle'; } else { u.x -= 150 * dt; u.an = 'walk'; } }); if (Math.min(...live('F').map(f => f.x)) < 400) { phase = 'fight'; tPhase = 0; say('전투! 땅 전체로 퍼져 뒤엉켜 싸웁니다.'); } }
    else if (phase === 'fight') { U.forEach(u => think(u, dt)); U.forEach(u => physics(u, dt)); U = U.filter(u => !(u.dead && u.side === 'F' && u.stT > 0.7));
      if (!live('F').length && !U.some(u => u.side === 'F')) { phase = 'regroup'; tPhase = 0; fights++; say('이겼습니다. 다시 줄을 맞춥니다.'); }
      else if (!live('A').length) { phase = 'lost'; say('전멸했습니다.'); ui(); } }
    else if (phase === 'regroup') { U.forEach(u => { if (u.dead) { if (tPhase > 0.6) { u.dead = 0; u.hp = Math.ceil(u.max * 0.5); u.st = 'idle'; } return; } u.st = 'idle'; u.lx = 0; u.hp = Math.min(u.max, u.hp + u.max * 0.25 * dt); const tx = LINE[u.li], ty = GY + (u.li % 2 ? 3 : -3), dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy); if (d > 2) { const s = Math.min(1, 70 * dt / d); u.x += dx * s; u.y += dy * s; u.face = dx >= 0 ? 1 : -1; u.an = 'walk'; } else { u.face = 1; u.an = 'idle'; } }); if (tPhase > 1.8) { phase = 'walk'; tPhase = 0; say('한 줄로 걸어갑니다.'); } }
    for (const f of FX) { f.t += dt; if (f.k === 'arrow') { const tx = f.f.x, ty = f.f.y - 22, dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx, dy), v = 420 * dt; if (d <= v || f.f.dead && d < 12) { hit(f.a, f.f, 1, R(18, 30)); f.t = 9; } else { f.x += dx / d * v; f.y += dy / d * v; f.ang = Math.atan2(dy, dx); } } else if (f.k === 'dust') { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 60 * dt; } }
    FX = FX.filter(f => f.t < ({ num: 0.7, spark: 0.16, arc: 0.14, dust: 0.4, arrow: 3, txt: 0.9, ring: 0.5 }[f.k])); }

  // ── 그리기 ──
  function wagon(x, y) { const o = '#060608', bob = phase === 'walk' ? Math.floor(scroll / 6) % 2 : 0; g.fillStyle = 'rgba(30,40,20,.35)'; g.fillRect(x, y - 1, 40, 3); g.fillStyle = o; g.fillRect(x + 1, y - 33 + bob, 36, 20); g.fillStyle = '#e9dcc0'; g.fillRect(x + 2, y - 32 + bob, 34, 18); g.fillStyle = '#cdbb96'; for (let i = 0; i < 4; i++) g.fillRect(x + 9 + i * 8, y - 32 + bob, 1, 18);
    g.fillStyle = o; g.fillRect(x, y - 15 + bob, 40, 10); g.fillStyle = '#8a5a34'; g.fillRect(x + 1, y - 14 + bob, 38, 8); g.fillStyle = '#6b4226'; g.fillRect(x + 1, y - 10 + bob, 38, 1);
    [9, 30].forEach(cx => { g.fillStyle = o; g.beginPath(); g.arc(x + cx, y - 6, 7, 0, 7); g.fill(); g.fillStyle = '#6b4226'; g.beginPath(); g.arc(x + cx, y - 6, 5.6, 0, 7); g.fill(); g.fillStyle = o; g.fillRect(x + cx - 1, y - 7, 3, 3); }); }
  function drawUnit(u) { const x = Math.round(u.x + u.lx), y = Math.round(u.y); g.fillStyle = 'rgba(20,30,15,.3)'; g.beginPath(); g.ellipse(x, y, 11, 3.2, 0, 0, 7); g.fill();
    if (u.K.set) { const a = (u.an === 'walk' && u.run && u.K.set.run) || u.K.set[u.an] || u.K.set.idle, loop = u.an === 'idle' || u.an === 'walk', fr = loop ? Math.floor(T * (u.an === 'walk' ? (u.run ? 26 : 17) : 12)) % (u.an === 'walk' && u.K.set === AN ? Math.min(10, a.n) : a.n) : Math.min(a.n - 1, Math.floor(u.st === 'dead' ? u.stT * 22 : u.st === 'hurt' ? (0.26 - u.stT) / 0.26 * a.n : u.at));
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
      else if (f.k === 'txt') { const p = f.t / 0.9; g.font = 'bold 9px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#060608'; g.fillText(f.v, Math.round(f.x) + 1, Math.round(f.y - p * 10) + 1); g.fillStyle = f.c; g.fillText(f.v, Math.round(f.x), Math.round(f.y - p * 10)); }
      else if (f.k === 'ring') { const p = f.t / 0.5; g.strokeStyle = `rgba(255,224,138,${1 - p})`; g.lineWidth = 2; g.beginPath(); g.ellipse(f.x, f.y + 20, 12 + p * 90, 5 + p * 34, 0, 0, 7); g.stroke(); }
      else if (f.k === 'dust') { g.fillStyle = `rgba(214,196,150,${0.8 - f.t * 2})`; const s = 2 + Math.floor(f.t * 8); g.fillRect(Math.round(f.x), Math.round(f.y - 2), s, s); }
      else if (f.k === 'arrow') { g.save(); g.translate(Math.round(f.x), Math.round(f.y)); g.rotate(f.ang || 0); g.fillStyle = '#060608'; g.fillRect(-9, -1, 12, 3); g.fillStyle = '#d9c08a'; g.fillRect(-8, 0, 9, 1); g.fillStyle = '#e9e9f0'; g.fillRect(1, 0, 2, 1); g.fillStyle = '#c0392b'; g.fillRect(-9, 0, 2, 1); g.restore(); } }
    g.restore(); }
  function ui() { acts.innerHTML = ''; const add = (t, fn, on) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (on ? ' on' : ''); b.textContent = t; b.addEventListener('click', fn); acts.appendChild(b); };
    add('처음부터 다시', reset); add(speed === 1 ? '느리게 보기' : '보통 빠르기', () => { speed = speed === 1 ? 0.4 : 1; ui(); }, speed !== 1); add('바로 전투', () => { if (phase === 'walk') { tPhase = 9; } }); }
  function loop(ts) { const dt = Math.min(0.05, (ts - last) / 1000 || 0) * speed; last = ts; step(dt); render(); requestAnimationFrame(loop); }
  window.__brawl = { get phase() { return phase; }, get U() { return U; }, get fights() { return fights; } };
  reset(); requestAnimationFrame(loop);
})();
