(() => {
  const res = [];
  const comps = [
    ['paladin', 'bloodlord', 'hawkeye', 'archbishop', 'conestoga'],
    ['champion', 'shadowlord', 'archmage', 'physician', 'maestro'],
    ['arcblade', 'bladedancer', 'kaijuhunter', 'archbishop', 'pathfinder'],
    ['paladin', 'kageninja', 'elementlord', 'inquisitor', 'caravanmaster'],
  ];
  for (const [rid, LV, atk] of window.__PLAN) {
    RAID69.atk = atk;
    H.fresh(); S.rank = 6; S.bld.airfield = 1; S.flags.v69c = 1;
    S.parties = comps.map((L, i) => { const p = newParty(`${i + 1}팀`, L.map(c => H.adv(c, LV, { slv: 3, sm: 3 }).id)); p.sup = {}; p.auto = false; p.safe = false; return p; });
    S.raid = { list: [newRaid(rid)], from: today() };
    const rec = raidRec(rid), max0 = rec.max; rec.hp = rec.max = 1e12;
    UI.raidSel = { [rid]: S.parties.map(p => p.id) };
    H.rec = H.newRec();
    const m = raidLaunch(rid);
    let n = 0, downAt = null; while (n < 4000 && S.parties.some(p => p.exp)) { step(0.1); n++; if (downAt == null && H.rec.downs) downAt = n / 10; }
    const mh = S.advs.reduce((s, a) => s + derive(a).maxHp, 0);
    res.push({ rid, LV, atk, err: m || '', pct: Math.round(rec.me / max0 * 1000) / 10, sec: n / 10, downs: H.rec.downs, firstDown: downAt, taken: Math.round(H.rec.taken / mh * 100) + '%maxHP', healed: Math.round(H.rec.heff / mh * 100) + '%', injured: S.advs.filter(a => a.inj).length });
    H.rec = null;
  }
  return JSON.stringify(res);
})()
