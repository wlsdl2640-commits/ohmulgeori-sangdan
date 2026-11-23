/* 턴제 전투 시안 2 (11-23 기획서 + 사용자 답): 격자 8×6 · AP 1(기본 공격/방어 태세) · GP 3(이동) · SP +1/턴 · HP 20칸 겹 · 밀치기 · 바위 · 오폭 · 궁수 연격 · 전사 패링 · 짐꾼 석궁+옮기기.
   build_battle2.py가 __AN__ · __ARC__ · __BG__ · __GOB__를 채워 page_battle.html로 만든다. 수치는 모두 임시. */
(() => {
  const AN = __AN__, ARC = __ARC__, SETS = { 궁수: ARC }, BG = new Image(), GOB = new Image(); BG.src = '__BG__'; GOB.src = '__GOB__';
  for (const S of [AN, ARC]) for (const k in S) { S[k].im = new Image(); S[k].im.src = S[k].src; }
  const cv = document.getElementById('stage'), g = cv.getContext('2d'); cv.width = 480; cv.height = 240; g.imageSmoothingEnabled = false;
  const NC = 8, NR = 6, CW = 50, RH = 21, SK = 6;
  const cellXY = (c, r) => [Math.round(44 + c * CW + (NR - 1 - r) * SK), Math.round(124 + r * RH)];
  const inG = (c, r) => c >= 0 && c < NC && r >= 0 && r < NR, DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  // 스킬: rng adj 옆 한 칸 · man n 거리 n 안 · line n 네 방향 직선 n칸 · self / shape one · cross · around(자기 둘레 3×3) · line
  const SK_ = {
    parry:  { n: '패링', sp: 1, rng: 'self', shape: 'one', parry: 1, anim: 'block', d: '다음에 맞는 한 번을 완전히 막고 기본 공격으로 되받아칩니다.' },
    push:   { n: '방패 밀치기', sp: 2, rng: 'adj', shape: 'one', dmg: 5, push: 2, anim: 'bash', d: '옆 한 칸 · 피해 + 2칸 밀치기. 바위에 부딪히면 바위가 부서지고 그 뒤 칸이 연쇄 피해를 입습니다. 아군에게 쓰면 피해 없이 밀기만 합니다.' },
    shout:  { n: '우렁찬 외침', sp: 1, rng: 'self', shape: 'around', taunt: 2, anim: 'block', d: '자기 둘레 3 × 3 · 적이 2턴 동안 전사만 노립니다.' },
    stab:   { n: '급소 찌르기', sp: 1, rng: 'adj', shape: 'one', dmg: 8, bleed: 2, anim: 'thrust', d: '옆 한 칸 · 큰 피해 + 출혈 2턴.' },
    swap:   { n: '그림자 교대', sp: 1, rng: 'man', r: 2, shape: 'one', swap: 1, anim: 'block', d: '거리 2 안의 아군이나 적과 자리를 맞바꿉니다.' },
    pierce: { n: '관통 화살', sp: 1, rng: 'line', r: 4, shape: 'line', dmg: 6, breaks: 1, anim: 'thrust', d: '직선 4칸 · 처음 닿는 대상에게 피해. 바위는 부숩니다.' },
    wind:   { n: '풍압 화살', sp: 2, rng: 'line', r: 3, shape: 'line', dmg: 3, push: 2, anim: 'thrust', d: '직선 3칸 · 피해 + 화살 방향으로 2칸 밀치기. 아군은 피해 없이 밀립니다.' },
    fire:   { n: '화염구', sp: 2, rng: 'man', r: 4, shape: 'cross', dmg: 8, ff: 1, anim: 'upslash', d: '거리 4 안 · 십자 5칸. 범위 안의 아군도 맞습니다.' },
    heal:   { n: '치유의 빛', sp: 1, rng: 'man', r: 3, shape: 'one', heal: 10, anim: 'block', d: '거리 3 안 한 칸 · 회복. 넘친 만큼 하늘색 보호막 칸이 됩니다.' },
    supply: { n: '보급품 살포', sp: 1, rng: 'self', shape: 'cross', heal: 4, anim: 'block', d: '자기 둘레 십자 · 아군 회복.' },
    carry:  { n: '옮기기', sp: 1, rng: 'adj', shape: 'one', carry: 2, anim: 'block', d: '옆 칸의 아군이나 바위를 들어, 거리 2 안의 빈 칸에 내려놓습니다.' }
  };
  const CLS = {
    전사: { hp: 60, atk: 6, rng: 1, sk: ['parry', 'push', 'shout'], spec: '반격' }, 도적: { hp: 40, atk: 5, rng: 1, sk: ['stab', 'swap'], eva: 0.3, spec: '회피' },
    짐꾼: { hp: 40, atk: 4, rng: 4, sk: ['carry', 'supply'], spec: '짐들기 · 석궁' }, 궁수: { hp: 28, atk: 4, rng: 4, sk: ['pierce', 'wind'], combo: 5, spec: '연격' },
    마법사: { hp: 20, atk: 4, rng: 4, sk: ['fire'], spec: '영창' }, 사제: { hp: 20, atk: 2, rng: 3, sk: ['heal'], spec: '치유' }
  };
  const LAYER = ['#57c84d', '#3a8ee6', '#a45ee0', '#f0b030', '#ff6a5a'];       // HP 겹 색: 20칸마다 한 겹
  let U = [], sel = null, mode = null, pend = null, phase = 'walk', busy = false, auto = false, round = 1, fxs = [], t = 0, last = 0, scroll = 120, moving = false, gridA = 0, dragU = null, fights = 0, gen = 0;
  const LINE = { 짐꾼: 58, 사제: 92, 궁수: 122, 마법사: 152, 도적: 182, 전사: 212 };
  const mk = (kind, cls, c, r) => { const C = kind === 'A' ? CLS[cls] : kind === 'F' ? { hp: 24, atk: 5, rng: 1, sk: [] } : { hp: 1, atk: 0, sk: [] }; return { kind, cls, c, r, hp: C.hp, max: C.hp, sh: 0, atk: C.atk, C, sp: kind === 'A' ? 2 : 0, ap: 1, gp: 3, st: {}, combo: 0, alive: true, pos: null, ox: 0, oy: 0, an: 'idle', at: 0 }; };
  const live = k => U.filter(u => u.kind === k && u.alive), at = (c, r) => U.find(u => u.alive && u.c === c && u.r === r);
  const posOf = u => u.pos || cellXY(u.c, u.r), man = (a, c, r) => Math.abs(a.c - c) + Math.abs(a.r - r);
  const sleep = ms => new Promise(r => setTimeout(r, ms / (auto ? 1.7 : 1))), say = m => { document.getElementById('msg').textContent = m; };
  const num = (u, v, c) => { const [x, y] = posOf(u); fxs.push({ x, y: y - 46, v, c, t: 0 }); };
  async function glide(u, x, y, ms) { const [sx, sy] = posOf(u); for (let i = 1; i <= 8; i++) { u.pos = [sx + (x - sx) * i / 8, sy + (y - sy) * i / 8]; await sleep(ms / 8); } }
  function reset() { gen++; U = [mk('A', '전사', 2, 1), mk('A', '도적', 2, 4), mk('A', '마법사', 1, 2), mk('A', '궁수', 1, 3), mk('A', '사제', 0, 1), mk('A', '짐꾼', 0, 4)]; fights = 0; walkPhase(); }
  async function walkPhase() { const my = gen; phase = 'walk'; busy = true; sel = null; mode = null; pend = null; U = U.filter(u => u.kind === 'A'); U.forEach(u => { if (!u.alive) { u.alive = true; u.hp = Math.round(u.max * 0.3); u.dead = null; } u.st = {}; u.def = u.parry = 0; u.an = 'walk'; }); say(fights ? '싸움이 끝나 다시 길을 갑니다.' : '원정대가 길을 가는 중입니다.'); ui();
    await Promise.all(U.map(u => glide(u, LINE[u.cls], 176 + (LINE[u.cls] / 30 % 2 ? 6 : -4), 500))); if (my !== gen) return; moving = true; await sleep(2600); if (my !== gen) return; moving = false; encounter(my); }
  async function encounter(my) { const fc = [5, 6, 7].flatMap(c => [0, 1, 2, 3, 4, 5].map(r => [c, r])).sort(() => Math.random() - 0.5), n = 3 + (Math.random() * 3 | 0);
    fc.slice(0, n).forEach(([c, r]) => { const f = mk('F', '고블린', c, r), [x, y] = cellXY(c, r); f.pos = [x + 200, y]; U.push(f); });
    [3, 4, 5, 6].flatMap(c => [0, 1, 2, 3, 4, 5].map(r => [c, r])).filter(([c, r]) => !at(c, r)).sort(() => Math.random() - 0.5).slice(0, 3).forEach(([c, r]) => U.push(mk('O', '바위', c, r)));
    say('몬스터가 나타났습니다!'); U.forEach(u => { if (u.kind === 'A') u.an = 'idle'; });
    await Promise.all(U.filter(u => u.kind !== 'O').map(u => { const [x, y] = cellXY(u.c, u.r); return glide(u, x, y, u.kind === 'A' ? 450 : 600); })); if (my !== gen) return; U.forEach(u => { u.pos = null; }); phase = 'place'; busy = false; say('모험가를 끌어 왼쪽 세 열 안에서 자리를 바꿀 수 있습니다. 다 되면 「전투 시작」.'); ui(); if (auto) setTimeout(() => { if (my === gen && phase === 'place') startBattle(); }, 900); }
  function turnStart(k) { live(k).forEach(u => { u.ap = 1; u.gp = 3; u.def = 0; if (k === 'A') u.sp = Math.min(3, u.sp + 1); const had = u.st.bleed || u.st.stun; if (u.st.bleed) { hurt(u, 1, null, 1); num(u, '출혈', '#ff8a70'); } if (had && u.C.combo) u.combo = 0; for (const s in u.st) if (u.st[s] > 0) u.st[s]--; }); }
  function startBattle() { phase = 'A'; round = 1; fights++; U.forEach(u => { u.combo = 0; u.parry = 0; if (u.kind === 'A') u.sp = 2; }); turnStart('A'); say('1턴 · 모험가를 눌러 고르세요.'); ui(); if (auto) autoPlay(); }
  function won() { if (phase === 'end') return; phase = 'end'; sel = null; mode = null; pend = null; say('이겼습니다!'); ui(); const my = gen; setTimeout(() => { if (my === gen) walkPhase(); }, 1100); }
  // ── 규칙 ──
  function hurt(x, d, by, raw) { if (!x.alive) return 0; if (x.kind === 'O') { breakRock(x); return 0; }
    if (!raw && x.parry && by && by.alive) { x.parry = 0; num(x, '패링!', '#ffd040'); x.an = 'block'; x.at = 0; setTimeout(() => { if (x.alive) { x.an = 'slash3'; x.at = 0; hurt(by, x.atk, null, 1); setTimeout(() => { if (x.an === 'slash3') x.an = 'idle'; }, 420); } }, 260); return 0; }
    if (!raw && x.C.eva && Math.random() < x.C.eva) { num(x, '회피', '#9be3ff'); return 0; }
    if (!raw && x.def) d = Math.ceil(d / 2); const s = Math.min(x.sh, d); x.sh -= s; d -= s; x.hp = Math.max(0, x.hp - d); num(x, (s ? '(' + s + ') ' : '') + d, x.kind === 'A' ? '#ff9a80' : '#ffe27a'); x.flash = 0.18;
    if (x.kind === 'A' && x.hp > 0 && (x.an === 'idle' || x.an === 'hurt')) { x.an = 'hurt'; x.at = 0; setTimeout(() => { if (x.an === 'hurt') x.an = 'idle'; }, 430); }
    if (x.hp <= 0) { x.alive = false; if (x.kind === 'A') { x.an = 'fall'; x.at = 0; } x.dead = 0; } return d; }
  function breakRock(o) { if (!o.alive) return; o.alive = false; o.dead = 0; const [x, y] = cellXY(o.c, o.r); for (let i = 0; i < 6; i++) fxs.push({ x: x + (i - 3) * 4, y: y - 8 - (i % 3) * 5, boom: 1, t: 0, c: '#c9c2b4' }); }
  async function pushUnit(x, dc, dr, n, by) { for (let i = 0; i < n; i++) { const c = x.c + dc, r = x.r + dr; if (!inG(c, r)) break; const o = at(c, r);
      if (o) { if (o.kind === 'O') { breakRock(o); num(x, '쾅!', '#ffffff'); const b = at(c + dc, r + dr); if (b && b.kind !== 'O') hurt(b, 6, null, 1); if (x.kind !== 'O' && x.kind !== by.kind) hurt(x, 3, null, 1); } else if (x.kind !== by.kind) { hurt(x, 2, null, 1); hurt(o, 2, null, 1); } break; }
      const [tx, ty] = cellXY(c, r); await glide(x, tx, ty, 110); x.c = c; x.r = r; x.pos = null; } }
  function anchors(u, sk) { const out = []; if (sk.rng === 'self') return [[u.c, u.r]]; if (sk.rng === 'adj') { DIRS.forEach(([a, b]) => { if (inG(u.c + a, u.r + b)) out.push([u.c + a, u.r + b]); }); return out; }
    if (sk.rng === 'line') { DIRS.forEach(([a, b]) => { for (let i = 1; i <= sk.r; i++) if (inG(u.c + a * i, u.r + b * i)) out.push([u.c + a * i, u.r + b * i]); }); return out; }
    for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) { const d = man(u, c, r); if (d <= sk.r && (d > 0 || sk.heal)) out.push([c, r]); } return out; }
  function area(u, sk, a) { if (sk.shape === 'cross') return [[a[0], a[1]], ...DIRS.map(([x, y]) => [a[0] + x, a[1] + y])].filter(([c, r]) => inG(c, r));
    if (sk.shape === 'around') { const o = []; for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) if ((x || y) && inG(u.c + x, u.r + y)) o.push([u.c + x, u.r + y]); return o; }
    if (sk.shape === 'line') { const dc = Math.sign(a[0] - u.c), dr = Math.sign(a[1] - u.r), o = []; for (let i = 1; i <= sk.r; i++) if (inG(u.c + dc * i, u.r + dr * i)) o.push([u.c + dc * i, u.r + dr * i]); return o; } return [a]; }
  const basicSk = u => ({ n: '기본 공격', rng: u.C.rng > 1 ? 'man' : 'adj', r: u.C.rng, shape: 'one', basic: 1 });
  function why(u, sk) { if (u.st.stun) return '기절해서 움직일 수 없습니다.'; if (sk.basic) return u.ap < 1 ? '이번 턴 행동(AP)을 이미 썼습니다.' : ''; return u.sp < sk.sp ? '스킬 포인트가 모자랍니다.' : ''; }
  function reach(u) { const seen = new Map([[u.c + ',' + u.r, 0]]), q = [[u.c, u.r]]; while (q.length) { const [c, r] = q.shift(), d = seen.get(c + ',' + r); if (d >= u.gp) continue; for (const [a, b] of DIRS) { const k = (c + a) + ',' + (r + b); if (inG(c + a, r + b) && !seen.has(k) && !at(c + a, r + b)) { seen.set(k, d + 1); q.push([c + a, r + b]); } } } seen.delete(u.c + ',' + u.r); return seen; }
  function pathTo(u, tc, tr, stopAt, incl) { const prev = new Map([[u.c + ',' + u.r, null]]), q = [[u.c, u.r]]; let end = null; while (q.length && !end) { const [c, r] = q.shift(); for (const [a, b] of DIRS) { const nc = c + a, nr = r + b, k = nc + ',' + nr; if (!inG(nc, nr) || prev.has(k)) continue; if (stopAt(nc, nr)) { prev.set(k, [c, r]); end = [nc, nr]; break; } if (at(nc, nr)) continue; prev.set(k, [c, r]); q.push([nc, nr]); } } if (!end) return []; const p = []; let cur = prev.get(end[0] + ',' + end[1]); while (cur && !(cur[0] === u.c && cur[1] === u.r)) { p.unshift(cur); cur = prev.get(cur[0] + ',' + cur[1]); } if (incl) p.push(end); return p; }
  async function walkPath(u, path) { busy = true; u.an = u.kind === 'A' ? 'walk' : 'idle'; for (const [c, r] of path) { if (u.gp < 1) break; const [x, y] = cellXY(c, r); await glide(u, x, y, 150); u.c = c; u.r = r; u.pos = null; u.gp--; } u.an = 'idle'; busy = false; }
  async function strike(u, tg, anim) { const [ux, uy] = cellXY(u.c, u.r), [tx, ty] = cellXY(tg.c, tg.r), close = man(u, tg.c, tg.r) === 1, dir = Math.sign(tx - ux) || 1;
    if (close) { u.ox = (tx - ux) * 0.45; u.oy = (ty - uy) * 0.45; } u.an = u.kind === 'A' ? anim : 'idle'; u.at = 0; await sleep(u.kind === 'A' ? 400 : 170);
    if (!close) { fxs.push({ arrow: 1, x: ux + 14 * dir, y: uy - 22, x1: tx - 6 * dir, y1: ty - 18, t: 0 }); await sleep(170); } }
  async function back(u) { await sleep(220); u.ox = u.oy = 0; if (u.alive && u.an !== 'hurt') u.an = 'idle'; }
  async function basic(u, tg) { busy = true; u.ap = 0; const n = u.C.combo ? 1 + u.combo : 1; if (n > 1) num(u, '연격 ×' + n, '#9be3ff');
    for (let k = 0; k < n && tg.alive; k++) { await strike(u, tg, u.C.rng > 1 ? 'thrust' : 'slash3'); hurt(tg, u.atk + (Math.random() * 2 | 0), u); if (k < n - 1) await sleep(120); }
    if (u.C.combo) u.combo = Math.min(u.C.combo, u.combo + 1); await back(u); busy = false; }
  async function cast(u, sk, a, drop) { busy = true; u.sp -= sk.sp; num(u, sk.n, '#ffffff'); const cells = area(u, sk, a), first = cells.map(([c, r]) => at(c, r)).find(Boolean);
    if (sk.parry) { u.parry = 1; u.an = 'block'; u.at = 0; await sleep(380); u.an = 'idle'; busy = false; return; }
    if (sk.carry) { const x = at(a[0], a[1]); u.an = 'block'; u.at = 0; if (x && drop) { const [tx, ty] = cellXY(drop[0], drop[1]); x.oy = -10; await glide(x, tx, ty, 320); x.c = drop[0]; x.r = drop[1]; x.pos = null; x.oy = 0; } u.an = 'idle'; busy = false; return; }
    if (sk.swap) { const x = at(a[0], a[1]); if (x && x.kind !== 'O') { const [c, r] = [u.c, u.r], [ax, ay] = cellXY(x.c, x.r), [bx, by] = cellXY(c, r); await Promise.all([glide(u, ax, ay, 200), glide(x, bx, by, 200)]); u.c = x.c; u.r = x.r; x.c = c; x.r = r; u.pos = x.pos = null; } busy = false; return; }
    if (sk.shape === 'line') { const tg = first; if (tg) { await strike(u, tg, sk.anim); const dc = Math.sign(a[0] - u.c), dr = Math.sign(a[1] - u.r); if (tg.kind === 'O') { if (sk.breaks) { breakRock(tg); const b = at(tg.c + dc, tg.r + dr); if (b && b.kind !== 'O') hurt(b, 4, null, 1); } } else { if (tg.kind !== u.kind) hurt(tg, sk.dmg, u); if (sk.push && tg.alive) await pushUnit(tg, dc, dr, sk.push, u); } } else { u.an = sk.anim; u.at = 0; await sleep(400); } await back(u); busy = false; return; }
    if (sk.rng === 'adj' && first) await strike(u, first, sk.anim); else { u.an = sk.anim; u.at = 0; await sleep(400); }
    cells.forEach(([c, r]) => { const [x, y] = cellXY(c, r); fxs.push({ x, y: y - 10, boom: 1, t: 0, c: sk.heal ? '#9be37a' : sk.taunt ? '#ffd040' : sk.ff ? '#ff9040' : '#ffffff' }); });
    for (const [c, r] of cells) { const x = at(c, r); if (!x) continue; const foe = x.kind !== u.kind && x.kind !== 'O';
      if (sk.heal) { if (x.kind === u.kind) { const over = Math.max(0, x.hp + sk.heal - x.max); x.hp = Math.min(x.max, x.hp + sk.heal); x.sh = Math.min(10, x.sh + over); num(x, '+' + sk.heal + (over ? ' 보호막 ' + over : ''), '#9be37a'); } continue; }
      if (sk.taunt) { if (foe) { x.st.taunt = sk.taunt + 1; x.tauntBy = u; num(x, '도발', '#ffd040'); } continue; }
      if (sk.dmg && (foe || sk.ff || x.kind === 'O')) { if (x.kind === 'O') { if (sk.ff) breakRock(x); } else hurt(x, sk.dmg, u); }
      if (sk.bleed && foe && x.alive) { x.st.bleed = sk.bleed + 1; num(x, '출혈', '#ff8a70'); }
      if (sk.push && x.alive) await pushUnit(x, Math.sign(x.c - u.c), Math.sign(x.r - u.r), sk.push, u); }
    await back(u); busy = false; }
  // ── 몬스터 차례 · 자동 ──
  const nearest = (u, list) => list.slice().sort((a, b) => man(u, a.c, a.r) - man(u, b.c, b.r))[0];
  async function foeTurn() { phase = 'F'; busy = true; sel = null; mode = null; pend = null; turnStart('F'); ui(); say('몬스터 차례입니다.'); await sleep(300);
    for (const f of live('F')) { if (!live('A').length || !f.alive) break; if (f.st.stun) continue; let tg = f.st.taunt && f.tauntBy && f.tauntBy.alive ? f.tauntBy : nearest(f, live('A'));
      if (man(f, tg.c, tg.r) > 1) { f.gp = 2; await walkPath(f, pathTo(f, tg.c, tg.r, (c, r) => c === tg.c && r === tg.r)); busy = true; }
      if (man(f, tg.c, tg.r) === 1) { await strike(f, tg, 'idle'); hurt(tg, f.atk + (Math.random() * 2 | 0), f); await back(f); await sleep(380); } await sleep(80); }
    round++; if (phase !== 'F') return; busy = false; if (!live('A').length) { phase = 'end'; say('전멸했습니다. 「다시」를 눌러 주세요.'); ui(); return; } if (!live('F').length) return won(); phase = 'A'; turnStart('A'); say(round + '턴 · 모험가 차례입니다.'); ui(); if (auto) autoPlay(); }
  async function autoPlay() { if (busy || phase !== 'A') return; const my = gen;
    for (const u of live('A')) { if (my !== gen || phase !== 'A') return; if (!live('F').length) break; if (u.st.stun) continue; const foes = live('F'), C = u.C;
      if (u.cls === '사제' && u.sp >= 1) { const x = live('A').filter(a => a.hp < a.max * 0.7 && man(u, a.c, a.r) <= 3).sort((a, b) => a.hp / a.max - b.hp / b.max)[0]; if (x) await cast(u, SK_.heal, [x.c, x.r]); }
      if (u.cls === '마법사' && u.sp >= 2) { let best = null, bs = 0; for (const a of anchors(u, SK_.fire)) { const xs = area(u, SK_.fire, a).map(([c, r]) => at(c, r)).filter(Boolean); if (xs.some(x => x.kind === 'A')) continue; const n = xs.filter(x => x.kind === 'F').length; if (n > bs) { bs = n; best = a; } } if (best && bs >= 2) await cast(u, SK_.fire, best); }
      let tg = nearest(u, foes); if (!tg) break;
      if (man(u, tg.c, tg.r) > C.rng) { let p = pathTo(u, 0, 0, (c, r) => !at(c, r) && man({ c, r }, tg.c, tg.r) <= C.rng, true); if (!p.length) p = pathTo(u, 0, 0, (c, r) => c === tg.c && r === tg.r); await walkPath(u, p); }
      tg = nearest(u, live('F')); if (!tg) break;
      if (man(u, tg.c, tg.r) <= C.rng) { if (u.cls === '도적' && u.sp >= 1 && man(u, tg.c, tg.r) === 1) await cast(u, SK_.stab, [tg.c, tg.r]); if (u.cls === '전사' && u.sp >= 2 && live('F').filter(f => man(u, f.c, f.r) <= 2).length >= 2) await cast(u, SK_.shout, [u.c, u.r]); if (tg.alive && u.ap) await basic(u, tg); }
      else if (u.cls === '전사' && u.sp >= 1 && !u.parry) await cast(u, SK_.parry, [u.c, u.r]);
      ui(); }
    if (my !== gen || phase !== 'A') return; if (live('F').length) await foeTurn(); else won(); }
  // ── 그리기 ──
  function tile(c, r, fill, line) { const [x, y] = cellXY(c, r), k = SK / RH, p = [[-25, -14], [25, -14], [25, 7], [-25, 7]].map(([dx, dy]) => [x + dx - dy * k, y + dy]); g.beginPath(); p.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (line) { g.strokeStyle = line; g.lineWidth = 1; g.stroke(); } }
  function hpBar(u, x, top) { const per = 20, lay = Math.max(0, Math.ceil(u.hp / per) - 1), fill = u.hp - lay * per, cTop = LAYER[Math.min(lay, LAYER.length - 1)], cUnder = lay > 0 ? LAYER[Math.min(lay - 1, LAYER.length - 1)] : '#3a2a2a';
    g.fillStyle = '#060608'; g.fillRect(x - 16, top + 2, 31, 5); for (let i = 0; i < 10; i++) { g.fillStyle = i < Math.ceil(fill / 2) ? cTop : cUnder; g.fillRect(x - 15 + i * 3, top + 3, 2, 3); }
    if (u.sh > 0) { g.fillStyle = '#060608'; g.fillRect(x - 16, top - 4, u.sh * 3 + 1, 4); g.fillStyle = '#8fe0ff'; for (let i = 0; i < u.sh; i++) g.fillRect(x - 15 + i * 3, top - 3, 2, 2); } }
  function render() { const so = Math.floor(scroll) % 720; g.drawImage(BG, -so, 0); g.drawImage(BG, 720 - so, 0); gridA += ((phase === 'walk' ? 0 : 1) - gridA) * 0.15; g.globalAlpha = gridA;
    for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) tile(c, r, phase === 'place' && c < 3 ? 'rgba(120,190,255,.25)' : null, 'rgba(255,255,255,.34)');
    if (sel && sel.alive && phase === 'A') tile(sel.c, sel.r, 'rgba(255,224,90,.4)', '#ffe05a');
    if (mode === 'move' && sel) reach(sel).forEach((d, k) => { const [c, r] = k.split(',').map(Number); tile(c, r, 'rgba(90,200,255,.33)', '#bfe8ff'); });
    if (pend) { if (pend.step === 2) pend.drops.forEach(([c, r]) => tile(c, r, c === pend.drop[0] && r === pend.drop[1] ? 'rgba(90,230,120,.6)' : 'rgba(90,230,120,.2)', '#d8ffd8')); else { pend.valid.forEach(([c, r]) => tile(c, r, 'rgba(255,255,255,.14)', null)); area(sel, pend.sk, pend.a).forEach(([c, r]) => tile(c, r, pend.sk.heal || pend.sk.carry || pend.sk.swap ? 'rgba(90,230,120,.5)' : 'rgba(255,70,50,.5)', '#ffffff')); } }
    g.globalAlpha = 1 - gridA; if (gridA < 0.97) { const wx = 4, wy = 192, bob = moving ? Math.floor(scroll / 6) % 2 : 0, o = '#060608';
      g.fillStyle = 'rgba(30,40,20,.35)'; g.fillRect(wx, wy - 1, 40, 3);
      g.fillStyle = o; g.fillRect(wx + 1, wy - 33 + bob, 36, 20); g.fillStyle = '#e9dcc0'; g.fillRect(wx + 2, wy - 32 + bob, 34, 18); g.fillStyle = '#cdbb96'; for (let i = 0; i < 4; i++) g.fillRect(wx + 9 + i * 8, wy - 32 + bob, 1, 18); g.fillStyle = '#f6eed9'; g.fillRect(wx + 3, wy - 31 + bob, 32, 2);
      g.fillStyle = o; g.fillRect(wx, wy - 15 + bob, 40, 10); g.fillStyle = '#8a5a34'; g.fillRect(wx + 1, wy - 14 + bob, 38, 8); g.fillStyle = '#6b4226'; g.fillRect(wx + 1, wy - 10 + bob, 38, 1); g.fillStyle = '#a9713f'; g.fillRect(wx + 1, wy - 14 + bob, 38, 1); g.fillStyle = o; g.fillRect(wx + 39, wy - 11 + bob, 9, 3); g.fillStyle = '#8a5a34'; g.fillRect(wx + 39, wy - 10 + bob, 8, 1);
      [9, 30].forEach(cx => { g.fillStyle = o; g.beginPath(); g.arc(wx + cx, wy - 6, 7, 0, 7); g.fill(); g.fillStyle = '#6b4226'; g.beginPath(); g.arc(wx + cx, wy - 6, 5.6, 0, 7); g.fill(); g.fillStyle = '#c9a274'; const t = moving ? scroll / 7 : 0; for (let k = 0; k < 4; k++) { const an = t + k * Math.PI / 4; g.fillRect(Math.round(wx + cx + Math.cos(an) * 3) - 1, Math.round(wy - 6 + Math.sin(an) * 3) - 1, 2, 2); g.fillRect(Math.round(wx + cx - Math.cos(an) * 3) - 1, Math.round(wy - 6 - Math.sin(an) * 3) - 1, 2, 2); } g.fillStyle = o; g.fillRect(wx + cx - 1, wy - 7, 3, 3); }); }
    g.globalAlpha = 1;
    [...U].sort((a, b) => posOf(a)[1] + a.oy * 0 - posOf(b)[1]).forEach(u => { if (!u.alive && u.kind !== 'A') { if (u.dead > 0.4) return; g.globalAlpha = 1 - u.dead * 2.5; } const [cx, cy] = posOf(u), x = Math.round(cx + u.ox), y = Math.round(cy + u.oy);
      if (u.kind === 'O') { g.fillStyle = 'rgba(30,40,20,.35)'; g.fillRect(x - 13, y - 1, 26, 3); g.fillStyle = '#060608'; g.beginPath(); g.moveTo(x - 14, y + 1); g.lineTo(x - 11, y - 12); g.lineTo(x - 3, y - 19); g.lineTo(x + 8, y - 17); g.lineTo(x + 14, y - 7); g.lineTo(x + 13, y + 1); g.fill(); g.fillStyle = '#8c8a86'; g.beginPath(); g.moveTo(x - 12, y); g.lineTo(x - 9, y - 11); g.lineTo(x - 3, y - 17); g.lineTo(x + 7, y - 15); g.lineTo(x + 12, y - 7); g.lineTo(x + 11, y); g.fill(); g.fillStyle = '#b9b6ae'; g.fillRect(x - 6, y - 15, 9, 3); g.fillRect(x - 9, y - 11, 5, 3); g.fillStyle = '#5f5d5a'; g.fillRect(x + 3, y - 6, 8, 5); g.globalAlpha = 1; return; }
      g.fillStyle = 'rgba(30,40,20,.35)'; g.fillRect(x - 11, y - 2, 22, 3);
      if (u.kind === 'A') { const S = SETS[u.cls] || AN, a = S[u.an] || AN[u.an], f = u.an === 'idle' || u.an === 'walk' ? Math.floor(u.at * 12) % a.n : Math.min(a.n - 1, Math.floor(u.at * (u.an === 'fall' ? 16 : 44))); g.drawImage(a.im, f * 80, 0, 80, 80, x - 38, y - 66, 80, 80); } else g.drawImage(GOB, x - GOB.width / 2, y - GOB.height);
      if (u.flash > 0) { g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x - 10, y - 38, 20, 36); g.globalCompositeOperation = 'source-over'; }
      g.globalAlpha = 1; if (!u.alive || phase === 'walk') return; const top = y - 50; hpBar(u, x, top);
      if (u.kind === 'A') { for (let i = 0; i < 3; i++) { g.fillStyle = '#060608'; g.beginPath(); g.arc(x - 6 + i * 6, top - (u.sh ? 9 : 5), 2.6, 0, 7); g.fill(); g.fillStyle = i < u.sp ? '#5ac8ff' : '#3a3644'; g.beginPath(); g.arc(x - 6 + i * 6, top - (u.sh ? 9 : 5), 1.7, 0, 7); g.fill(); } }
      const tag = (u.parry ? '패링 ' : '') + (u.def ? '방어 ' : '') + (u.st.taunt ? '도발 ' : '') + (u.st.bleed ? '출혈 ' : '') + (u.combo ? '연격' + u.combo : ''); g.font = '8px sans-serif'; g.textAlign = 'center';
      if (tag) { g.fillStyle = '#060608'; g.fillText(tag, x + 1, y + 10); g.fillStyle = '#ffd040'; g.fillText(tag, x, y + 9); } });
    fxs.forEach(f => { if (f.arrow) { const k = Math.min(1, f.t / 0.17), x = Math.round(f.x + (f.x1 - f.x) * k), y = Math.round(f.y + (f.y1 - f.y) * k - Math.sin(k * Math.PI) * 5); g.fillStyle = '#060608'; g.fillRect(x - 6, y - 1, 13, 3); g.fillStyle = '#d59a57'; g.fillRect(x - 5, y, 9, 1); g.fillStyle = '#dae0ea'; g.fillRect(x + 4, y, 2, 1); g.fillStyle = '#ffffff'; g.fillRect(x - 5, y, 2, 1); }
      else if (f.boom) { const k = f.t / 0.3, r = 3 + Math.round(k * 9); g.fillStyle = f.c; g.globalAlpha = 1 - k; g.fillRect(f.x - r, f.y - 1, r * 2, 2); g.fillRect(f.x - 1, f.y - r, 2, r * 2); g.globalAlpha = 1; }
      else { g.font = 'bold 9px sans-serif'; g.textAlign = 'center'; const y = f.y - f.t * 16; g.fillStyle = '#060608'; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => g.fillText(f.v, f.x + a, y + b)); g.fillStyle = f.c; g.fillText(f.v, f.x, y); } }); }
  function loop(ms) { const dt = Math.min(0.05, (ms - last) / 1000 || 0); last = ms; t += dt; U.forEach(u => { u.at += dt; if (u.flash > 0) u.flash -= dt; if (u.dead != null) u.dead += dt; }); fxs.forEach(f => f.t += dt); fxs = fxs.filter(f => f.t < (f.arrow ? 0.17 : f.boom ? 0.3 : 0.9)); if (moving) scroll += dt * 46; render(); requestAnimationFrame(loop); }
  // ── 조작 ──
  const acts = document.getElementById('acts'), info = document.getElementById('info');
  function ui() { acts.innerHTML = ''; const add = (txt, fn, cls, dis) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (cls || ''); b.textContent = txt; b.disabled = !!dis; b.addEventListener('click', fn); acts.appendChild(b); return b; };
    info.textContent = sel && sel.alive && phase === 'A' ? sel.cls + ' (' + sel.C.spec + ') · 체력 ' + sel.hp + '/' + sel.max + (sel.sh ? ' + 보호막 ' + sel.sh : '') + ' · 행동 AP ' + sel.ap + ' · 이동 GP ' + sel.gp + ' · 스킬 SP ' + sel.sp : '';
    if (phase === 'place' && !auto) add('전투 시작', startBattle, 'go');
    if (phase === 'A' && !busy && !auto) { if (pend) { add(pend.step === 2 ? '여기에 내려놓기' : pend.sk.carry ? '이것을 들기' : '시전', confirm, 'go'); add('취소', () => { pend = null; say('취소했습니다.'); ui(); }); }
      else if (sel && sel.alive) { const u = sel; add(mode === 'move' ? '이동 끝' : '이동 (' + u.gp + ')', () => { mode = mode === 'move' ? null : 'move'; say(mode ? '하늘색 칸을 누르면 그리로 걸어갑니다. 한 칸에 GP 1.' : ''); ui(); }, mode === 'move' ? 'go' : '', u.gp < 1);
        const b = basicSk(u), wb = why(u, b); add('기본 공격', () => wb ? say(wb) : aim(u, b), wb ? 'off' : ''); add('방어 태세', () => { if (u.ap < 1) return say('이번 턴 행동(AP)을 이미 썼습니다.'); u.ap = 0; u.def = 1; num(u, '방어', '#9be3ff'); say('다음 내 차례까지 받는 피해가 절반이 됩니다.'); ui(); }, u.ap < 1 ? 'off' : '');
        u.C.sk.forEach(id => { const sk = SK_[id], w = why(u, sk); add(sk.n + ' ●' + sk.sp, () => w ? say(w) : aim(u, sk), w ? 'off' : ''); }); } }
    add('턴 종료', () => { if (!busy && phase === 'A') foeTurn(); }, '', busy || phase !== 'A' || auto); add(auto ? '자동 끄기' : '자동', () => { auto = !auto; ui(); if (auto) { if (phase === 'place') startBattle(); else autoPlay(); } }); add('다시', () => { auto = false; reset(); }); }
  function aim(u, sk) { mode = null; const valid = anchors(u, sk); if (!valid.length) return say('쓸 수 있는 칸이 없습니다.'); const want = x => x && (sk.heal ? x.kind === 'A' : sk.carry ? x.kind !== 'F' : x.kind === 'F'), nf = nearest(u, live('F')); const tg = valid.find(([c, r]) => want(at(c, r))) || (nf && sk.rng !== 'self' && !sk.heal && !sk.carry ? near(valid, [nf.c, nf.r]) : valid[0]); pend = { sk, valid, a: tg, step: 1 }; say(sk.n + (sk.d ? ' — ' + sk.d : ' — 붉은 칸을 끌어 옮긴 뒤 「시전」.')); ui(); }
  async function confirm() { const p = pend, u = sel; if (p.sk.carry && p.step === 1) { const x = at(p.a[0], p.a[1]); if (!x || x.kind === 'F') return say('아군이나 바위만 들 수 있습니다.'); const drops = []; for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) if (!at(c, r) && man(u, c, r) <= 2) drops.push([c, r]); if (!drops.length) return say('내려놓을 빈 칸이 없습니다.'); p.step = 2; p.drops = drops; p.drop = drops[0]; say('내려놓을 초록 칸을 누른 뒤 「여기에 내려놓기」.'); return ui(); }
    pend = null; ui(); if (p.sk.basic) { const tg = at(p.a[0], p.a[1]); if (!tg || tg.kind === 'A') { say('그 칸에는 칠 것이 없습니다.'); pend = p; return ui(); } await basic(u, tg); } else await cast(u, p.sk, p.a, p.drop);
    if (!live('F').length) return won(); say('이어서 고르세요. 다 했으면 「턴 종료」.'); ui(); }
  function pick(e) { const b = cv.getBoundingClientRect(), x = (e.clientX - b.left) * 480 / b.width, y = (e.clientY - b.top) * 240 / b.height; let best = null, bd = 1e9; for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) { const [cx, cy] = cellXY(c, r), d = ((x - cx - 1) / 25) ** 2 + ((y - cy + 3.5) / 10.5) ** 2; if (d < bd) { bd = d; best = [c, r]; } } return bd < 2 ? best : null; }
  const near = (list, p) => list.slice().sort((a, b) => Math.abs(a[0] - p[0]) + Math.abs(a[1] - p[1]) - Math.abs(b[0] - p[0]) - Math.abs(b[1] - p[1]))[0];
  let drag = false;
  function place(e, kind) { const b = cv.getBoundingClientRect(), x = (e.clientX - b.left) * 480 / b.width, y = (e.clientY - b.top) * 240 / b.height, p = pick(e);
    if (kind === 'down') { const u = p && at(p[0], p[1]); if (u && u.kind === 'A') dragU = u; } else if (kind === 'move' && dragU) dragU.pos = [x, y + 12];
    else if (kind === 'up' && dragU) { const u = dragU; dragU = null; u.pos = null; if (p && p[0] < 3) { const o = at(p[0], p[1]); if (o && o !== u) { o.c = u.c; o.r = u.r; } u.c = p[0]; u.r = p[1]; say(u.cls + '의 자리를 옮겼습니다.'); } } }
  async function point(e) { if (phase === 'place' && !auto) return place(e, e.type === 'pointerdown' ? 'down' : 'move'); if (busy || phase !== 'A' || auto) return; const p = pick(e); if (!p) return;
    if (pend) { if (pend.step === 2) pend.drop = near(pend.drops, p); else if (pend.sk.rng !== 'self') pend.a = near(pend.valid, p); return; }
    if (e.type !== 'pointerdown') return; const u = at(p[0], p[1]);
    if (mode === 'move' && sel && !u) { const rc = reach(sel); if (!rc.has(p[0] + ',' + p[1])) return say('거기까지는 이동력이 모자랍니다.'); const path = pathTo(sel, p[0], p[1], (c, r) => c === p[0] && r === p[1], true); await walkPath(sel, path); if (sel.gp < 1) mode = null; return ui(); }
    if (u && u.kind === 'A') { sel = u; mode = null; say(u.cls + ' — 이동, 기본 공격(또는 방어), 스킬을 원하는 순서로 쓸 수 있습니다.'); ui(); } }
  cv.addEventListener('pointerdown', e => { drag = true; try { cv.setPointerCapture(e.pointerId); } catch (_) {} point(e); });
  cv.addEventListener('pointermove', e => { if (drag) point(e); }); cv.addEventListener('pointerup', e => { drag = false; if (phase === 'place') place(e, 'up'); }); cv.addEventListener('pointercancel', () => { drag = false; if (dragU) { dragU.pos = null; dragU = null; } });
  reset(); requestAnimationFrame(loop);
})();
