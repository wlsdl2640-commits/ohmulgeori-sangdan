// MP · 흡혈 · 걷기 안건 비교 (내 측정 — 시험 묶음 아님). window.__CFG:
//   name · lv · fid · st · secs · cls[] · mpInt(지능 → 최대 MP 배율) · mpCost(스킬 MP 배율 | 'tier') · cd50 · bucket(흡혈 그릇) · slowGreat(대검 느리게) · ls(흡혈 더함) · walk(걷는 구간 배율) · move(이동 속도 배율)
(() => {
  const C = window.__CFG;
  window.__T = 0;
  if (C.mpInt && C.mpInt !== 1) PATCH('deriveBase', 'T.int * 4 + L', 'T.int * 4 * window.__CFG.mpInt + L');
  const TIER_MUL = [1, 1, 1.5, 2, 3];
  if (C.mpCost) for (const id in SKILLS) { const s = SKILLS[id]; if (!s.cost || !s.cost.mp) continue; const k = C.mpCost === 'tier' ? TIER_MUL[Math.max(0, Math.min(4, (skJob(id) || {}).tier || 0))] : C.mpCost; s.cost.mp = Math.round(s.cost.mp * k); }
  if (C.cd50) { const o = skillCdOf; skillCdOf = function () { return o.apply(this, arguments) * (0.5 / 0.7); }; }
  { const o = derive; derive = function (a) { const d = o(a); if (C.slowGreat && chainOf(a.cls).includes('berserker')) d.spd *= 0.7; if (C.ls && (chainOf(a.cls).includes('berserker') || chainOf(a.cls).includes('necromancer'))) d.lifesteal = (d.lifesteal || 0) + C.ls; return d; }; }
  if (C.walk || C.move) { const o = moveOf; moveOf = function (p) { return o(p) / (C.walk || 1) * (C.move || 1); }; }
  let LS = {}, DMG = {}, CNT = {}, DOWN = {};
  { const o = leech; leech = function (e, a, d, v, magic) { const h0 = a.hp; const r = o.apply(this, arguments); let g = a.hp - h0; if (g <= 0) return r;
      const w = LS[a.id] = LS[a.id] || { v: 0, n: 0, top: 0, cut: 0, t0: -99, used: 0 };
      if (C.bucket) { if (window.__T - w.t0 >= 10) { w.t0 = window.__T; w.used = 0; } const ok = Math.max(0, Math.min(g, d.maxHp * 0.1, d.maxHp * 0.25 - w.used)); w.cut += g - ok; a.hp = h0 + ok; g = ok; w.used += ok; }
      w.v += g / d.maxHp; w.n++; w.top = Math.max(w.top, g / d.maxHp); return r; }; }
  { const o = hitFoe; hitFoe = function (e, f, atk, crit, magic, a) { const v = o.apply(this, arguments); if (a && a.id) DMG[a.id] = (DMG[a.id] || 0) + (v || 0); return v; }; }
  { const o = cast; cast = function (e, a) { CNT[a.id] = (CNT[a.id] || 0) + 1; return o.apply(this, arguments); }; }
  { const o = ev; ev = function (e, k, x) { if (k === 'down' && x) DOWN[x.d] = (DOWN[x.d] || 0) + 1; return o.apply(this, arguments); }; }
  const runOnce = () => {
    LS = {}; DMG = {}; CNT = {}; DOWN = {}; window.__T = 0;
  H.fresh();
    const team = C.cls.map(c => H.adv(c, C.lv, { slv: 3, sm: 3, q: 1 }));
    const p = newParty('시험대', team.map(a => a.id)); S.parties = [p];
    p.sup = {}; p.safe = false; p.auto = false; p.campNight = false; p.dmode = 'enter'; p.autoBuy = false; S.fields[C.fid].cleared = false; S.fields[C.fid].found = false;
    team.forEach(a => { a.status = 'idle'; a.inj = null; a.down = false; const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; a.fat = 0; a.sleep = 0; });
    formParty(p); p.exp = newExp(C.fid, {}, C.st || 1); team.forEach(a => { refillAmmo(a); a.status = 'away'; });
    let t = 0, tw = 0, tb = 0, tc = 0; const dt = 0.2, mpS = {}, mpLow = {}; let n = 0, maxStage = C.st || 1, inDun = 0;
    while (p.exp && t < C.secs) {
      const ex = p.exp, f = ex.foes.length > 0;
      if (f) { tb += dt; n++; team.forEach(a => { const d = derive(a), fr = a.mp / d.maxMp; mpS[a.id] = (mpS[a.id] || 0) + fr; if (fr < 0.1) mpLow[a.id] = (mpLow[a.id] || 0) + dt; }); }
      else if (ex.camp) tc += dt; else if (!ex.wait) tw += dt;
      stepExp(p, dt); t += dt; window.__T += dt;
      if (p.exp) { if (p.exp.area === 'dungeon') inDun = Math.max(inDun, p.exp.stage); else maxStage = Math.max(maxStage, p.exp.stage); }
      if (S.fields[C.fid].cleared) break;
    }
    return ({ name: C.name, t: Math.round(t), fightT: Math.round(tb), walk: +(tw / t).toFixed(3), fight: +(tb / t).toFixed(3), camp: +(tc / t).toFixed(3), stage: maxStage, dun: inDun, cleared: !!S.fields[C.fid].cleared, wiped: !p.exp,
    rows: team.map(a => { const d = derive(a), L = LS[a.id]; return { cls: CLASSES[a.cls].name, maxMp: d.maxMp, casts: +((CNT[a.id] || 0) / Math.max(1, tb)).toFixed(2), mp: n ? Math.round(mpS[a.id] / n * 100) : null, mpLow: +((mpLow[a.id] || 0) / Math.max(1, tb) * 100).toFixed(1), dps: Math.round((DMG[a.id] || 0) / Math.max(1, tb)), downs: DOWN[a.id] || 0, leech: L ? { perSec: +(L.v / Math.max(1, tb) * 100).toFixed(2), top: +(L.top * 100).toFixed(1), n: L.n, cut: Math.round(L.cut) } : null }; }) });
  };
  const all = []; for (let r = 0; r < (C.reps || 1); r++) all.push(runOnce());
  return JSON.stringify(all);
})()
