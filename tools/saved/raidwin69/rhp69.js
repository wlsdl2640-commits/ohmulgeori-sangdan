(() => {
  const res = [];
  const comps = [
    ['paladin', 'bloodlord', 'hawkeye', 'archbishop', 'conestoga'],
    ['champion', 'shadowlord', 'archmage', 'physician', 'maestro'],
    ['arcblade', 'bladedancer', 'kaijuhunter', 'archbishop', 'pathfinder'],
    ['paladin', 'kageninja', 'elementlord', 'inquisitor', 'caravanmaster'],
  ];
  for (const [rid, LV] of (window.__PLAN || [['kingslime', 150], ['kingslime', 140], ['kaishar', 160], ['griffon', 170], ['tempest', 180], ['behemoth', 190]])) {
    H.fresh(); S.rank = 6; S.bld.airfield = 1; S.flags.v69c = 1;
    S.parties = comps.map((L, i) => { const p = newParty(`${i + 1}팀`, L.map(c => H.adv(c, LV, { slv: 3, sm: 3 }).id)); p.sup = {}; p.auto = false; p.safe = false; return p; });
    S.raid = { list: [newRaid(rid)], from: today() };
    const rec = raidRec(rid); rec.hp = rec.max = 1e12;   // 끝까지 싸우게 (한 번 도전 몫을 잰다)
    UI.raidSel = { [rid]: S.parties.map(p => p.id) };
    const m = raidLaunch(rid);
    let n = 0; while (n < 4000 && S.parties.some(p => p.exp)) { step(0.1); n++; }
    const downs = S.advs.filter(a => a.inj).length;
    res.push({ rid, LV, err: m || '', dealt: Math.round(rec.me), hpNow: raidHp(RAIDS[rid].lv), pct: Math.round(rec.me / raidHp(RAIDS[rid].lv) * 1000) / 10, sec: n / 10, downs, why: S.parties.map(p => p.last ? p.last.area : '-').join(',') });
  }
  return JSON.stringify(res);
})()
