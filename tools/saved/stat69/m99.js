// 쿨감 · 시전 간격 · MP 안건 측정 (시험 묶음 아님): Lv150 파티, 변형마다 스킬 횟수/초 · MP · 피해/초
(() => {
  const VAR = window.__VAR || 'base';
  if (VAR === 'cd50' && !window.__cdP) { const o = skillCdOf; skillCdOf = function () { return o.apply(this, arguments) * (0.5 / 0.7); }; window.__cdP = 1; }   // 쿨감 30% → 50%만큼 더 짧게 (어림)
  if (VAR === 'gap50' && !window.__gapP) { PATCH('battle', 'e.gcd[a.id] = CAST_GAP;', 'e.gcd[a.id] = CAST_GAP / 1.5;'); window.__gapP = 1; }   // 시전 속도 +50%
  const CNT = {};
  if (!window.__castW) { const o = cast; cast = function (e, a) { CNT[a.id] = (CNT[a.id] || 0) + 1; return o.apply(this, arguments); }; window.__castW = 1; window.__CNT = CNT; }
  const C = window.__CNT; for (const k in C) delete C[k];
  H.fresh();
  const team = ['paladin', 'archmage', 'archbishop', 'shadowlord'].map(c => H.adv(c, 150, { slv: 3, sm: 3, q: 1 }));
  const p = newParty('시험대', team.map(a => a.id)); S.parties = [p];
  p.sup = {}; p.safe = false; p.auto = false; p.campNight = false; p.dmode = 'enter'; p.autoBuy = false; S.fields.stargarden.cleared = false; S.fields.stargarden.found = false;
  team.forEach(a => { a.status = 'idle'; a.inj = null; a.down = false; const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; a.fat = 0; a.sleep = 0; });
  formParty(p); p.exp = newExp('stargarden', {}, 1); team.forEach(a => { refillAmmo(a); a.status = 'away'; });
  let t = 0, tb = 0, dealt = 0; const dt = 0.2, mpS = {}; let n = 0;
  while (p.exp && t < 900) { const f = p.exp.foes.length > 0; if (f) { tb += dt; n++; team.forEach(a => { mpS[a.id] = (mpS[a.id] || 0) + a.mp / derive(a).maxMp; }); } stepExp(p, dt); t += dt; }
  const st = p.exp ? p.exp.stage : null;
  return JSON.stringify({ VAR, t: Math.round(t), fightT: Math.round(tb), stage: st, rows: team.map(a => ({ cls: CLASSES[a.cls].name, skills: a.skills.length, castsPerSec: +((C[a.id] || 0) / Math.max(1, tb)).toFixed(2), mp: +(mpS[a.id] / Math.max(1, n) * 100).toFixed(0) })) });
})()
