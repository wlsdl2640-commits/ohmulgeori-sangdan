(() => {
  const out = {};
  const ids = ['heal', 'prayer', 'restore', 'sacredsong', 'cureall', 'revival', 'greatheal'];
  out.data = ids.map(id => { const s = SKILLS[id]; return [id, s.name, s.kind, s.tgt, s.mult, s.dur || 0, s.cd, s.urgent || 0, s.desc]; });
  const ev0 = ev, cast0 = cast, rec = {};
  let cur = null;
  cast = function (e, a, d, id, team, dm) {
    if (['restore', 'sacredsong', 'cureall', 'revival'].includes(id)) { cur = { id, hp: team.filter(up).map(x => +(x.hp / dm[x.id].maxHp).toFixed(2)), heals: [], regen: [] }; (rec[id] = rec[id] || []).push(cur); }
    else cur = null;
    const r = cast0.apply(this, arguments);
    if (cur && (cur.id === 'cureall' || cur.id === 'revival')) cur.regen = e.buffs.filter(b => b.stat === 'regen' && typeof b.sid === 'string' && b.sid.startsWith(id + '@')).map(b => [b.to, Math.round(b.add), +b.t.toFixed(1)]);
    cur = null; return r;
  };
  ev = function (e, k, x) { if (cur && k === 'heal' && !x.rg) { const A = advById(x.d); cur.heals.push(x.v); } return ev0.apply(this, arguments); };
  H.fresh();
  const T1 = [H.adv('paladin', 100, { slv: 5, sm: 5 }), H.adv('hawkeye', 100, { slv: 5, sm: 5 }), H.adv('archmage', 100, { slv: 5, sm: 5 }), H.adv('archbishop', 100, { sk: ['miracle', 'prayer', 'heal', 'massheal', 'greatheal', 'revival', 'restore', 'sacredsong', 'grace'], slv: 5, sm: 5 })];
  const r1 = H.push(T1, 'sky', 1, 900);
  H.fresh();
  const T2 = [H.adv('paladin', 100, { slv: 5, sm: 5 }), H.adv('hawkeye', 100, { slv: 5, sm: 5 }), H.adv('archmage', 100, { slv: 5, sm: 5 }), H.adv('physician', 100, { sk: ['cureall', 'heal', 'remedy', 'massheal', 'greatheal', 'revival', 'panacea', 'miasma', 'chant'], slv: 5, sm: 5 })];
  const r2 = H.push(T2, 'sky', 1, 900);
  ev = ev0; cast = cast0;
  out.push = [[r1.flv, r1.R.downs, Math.round(r1.R.heff)], [r2.flv, r2.R.downs, Math.round(r2.R.heff)]];
  out.heal = { a: r1.R.heal, p: r2.R.heal };
  for (const id in rec) { const L = rec[id]; out[id] = { n: L.length, sample: L.slice(0, 5), nTargets: L.map(c => c.heals.length).reduce((t, v) => t + v, 0) / Math.max(1, L.length), minHpOk: id === 'sacredsong' ? L.every(c => c.heals.length >= 1) : null }; }
  out.spec = ['restore', 'sacredsong', 'cureall', 'revival'].map(id => skillSpec(id, T1[3]).join(' / '));
  return JSON.stringify(out);
})()
