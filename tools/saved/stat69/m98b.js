// MP · 이동 속도 · 흡혈 안건 측정 (시험 묶음 아님): 원정 시간 나눔(걷기 · 싸움 · 야영) · MP 여유 · 흡혈 회복
(() => {
  const out = { runs: [], mp: [] };
  // 흡혈 회복을 따로 센다
  const LS = { v: 0, n: 0, max: 0, byId: {} };
  if (!window.__leechWrapped) { const o = leech; leech = function (e, a, d, v, magic) { const h0 = a.hp; const r = o.apply(this, arguments); const g = a.hp - h0; if (g > 0) { LS.v += g; LS.n++; LS.max = Math.max(LS.max, g / d.maxHp); (LS.byId[a.id] = LS.byId[a.id] || { v: 0, n: 0, maxHp: d.maxHp, top: 0 }); LS.byId[a.id].v += g; LS.byId[a.id].n++; LS.byId[a.id].top = Math.max(LS.byId[a.id].top, g / d.maxHp); } return r; }; window.__leechWrapped = 1; }
  const runs = [
    { name: 'Lv60 → 원시림(낮은 땅)', lv: 60, fid: 'forest', st: 1, cls: ['knight', 'sorcerer', 'priest', 'sniper'] },
    { name: 'Lv100 → 늪지대(낮은 땅)', lv: 100, fid: 'swamp', st: 1, cls: ['paladin', 'archmage', 'archbishop', 'hawkeye'] },
    { name: 'Lv150 → 구름섬(낮은 땅)', lv: 150, fid: 'sky', st: 1, cls: ['paladin', 'archmage', 'archbishop', 'shadowlord'] }
  ];
  for (const R0 of runs) {
    H.fresh(); LS.v = 0; LS.n = 0; LS.max = 0; LS.byId = {};
    const team = R0.cls.map(c => H.adv(c, R0.lv, { slv: 3, sm: 3, q: 1 }));
    const p = newParty('시험대', team.map(a => a.id)); S.parties = [p];
    p.sup = {}; p.safe = false; p.auto = false; p.campNight = false; p.dmode = 'enter'; p.autoBuy = false; S.fields[R0.fid].cleared = false; S.fields[R0.fid].found = false;
    team.forEach(a => { a.status = 'idle'; a.inj = null; a.down = false; const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; a.fat = 0; a.sleep = 0; });
    formParty(p); p.exp = newExp(R0.fid, {}, R0.st); team.forEach(a => { refillAmmo(a); a.status = 'away'; });
    const e = p.exp; let t = 0, tw = 0, tb = 0, tc = 0, tg = 0, st0 = e.stage, mpLow = {}, mpSum = {}, mpN = 0; const dt = 0.2;
    const v0 = moveOf(p), moves = team.map(a => +derive(a).move.toFixed(1));
    // MP 여유(이론): 싸움 중 회복 ÷ 모든 스킬을 쿨마다 쓸 때 드는 MP
    team.forEach(a => { const d = derive(a); const reg = 0.02 * d.maxMp * d.mpRegen + (d.mpFlat || 0); let drain = 0, costs = []; (a.skills || []).forEach(id => { const s = SKILLS[id]; if (!s || s.passive || !s.cost || !s.cost.mp) return; const cd = skillCdOf(a, d, id, e); drain += s.cost.mp / cd; costs.push(s.cost.mp + '/' + cd.toFixed(1) + 's'); }); out.mp.push({ run: R0.name, cls: CLASSES[a.cls].name, maxMp: d.maxMp, regen: +reg.toFixed(1), drain: +drain.toFixed(1), ratio: drain ? +(reg / drain).toFixed(2) : null, costs: costs.join(' · '), costPct: costs.length ? +((a.skills.map(id => (SKILLS[id].cost && SKILLS[id].cost.mp) || 0).reduce((s, v) => s + v, 0) / Math.max(1, costs.length)) / d.maxMp * 100).toFixed(1) : 0 }); });
    while (p.exp && t < 900) {
      const ex = p.exp; const f = ex.foes.length > 0;
      if (f) { tb += dt; mpN++; teamOf(p).forEach(a => { const d = derive(a); const fr = a.mp / d.maxMp; mpSum[a.id] = (mpSum[a.id] || 0) + fr; if (fr < 0.2) mpLow[a.id] = (mpLow[a.id] || 0) + dt; }); }
      else if (ex.camp) tc += dt; else if (ex.wait === 'gate') tg += dt; else tw += dt;
      stepExp(p, dt); t += dt;
      if (S.fields[R0.fid].cleared) break;
    }
    const ex = p.exp;
    out.runs.push({ run: R0.name, t: Math.round(t), walk: +(tw / t).toFixed(3), fight: +(tb / t).toFixed(3), camp: +(tc / t).toFixed(3), stages: ex ? ex.stage - st0 : null, area: ex ? ex.area : 'done', wiped: !ex, partyMove: +v0.toFixed(1), moves, STAGE_LEN,
      mpAvg: team.map(a => CLASSES[a.cls].name + ' ' + (mpN ? (mpSum[a.id] / mpN * 100).toFixed(0) : '-') + '% · 20% 아래 ' + ((mpLow[a.id] || 0) / Math.max(1, tb) * 100).toFixed(0) + '%'),
      leech: Object.entries(LS.byId).map(([id, r]) => { const a = advById(+id); return (a ? CLASSES[a.cls].name : id) + ' 초당 ' + (r.v / Math.max(1, tb) / r.maxHp * 100).toFixed(2) + '% · 한 번 최대 ' + (r.top * 100).toFixed(1) + '% · ' + r.n + '번'; }) });
  }
  return JSON.stringify(out);
})()
