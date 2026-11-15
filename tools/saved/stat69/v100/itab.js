(() => {
  const Q = { base: 8, floor: 1.5 };
  const rows = [['warrior', 1], ['warrior', 30], ['knight', 50], ['knight', 80], ['paladin', 100], ['paladin', 150], ['paladin', 200],
    ['archer', 1], ['archer', 30], ['sniper', 50], ['sniper', 80], ['hawkeye', 100], ['hawkeye', 150], ['hawkeye', 200],
    ['rogue', 1], ['rogue', 30], ['assassin', 50], ['assassin', 80], ['shadowlord', 100], ['shadowlord', 150], ['shadowlord', 200],
    ['mage', 1], ['mage', 30], ['sorcerer', 50], ['sorcerer', 80], ['archmage', 100], ['archmage', 150], ['archmage', 200],
    ['cleric', 1], ['cleric', 30], ['priest', 50], ['priest', 80], ['archbishop', 100], ['archbishop', 150], ['archbishop', 200],
    ['porter', 1], ['porter', 30], ['coachman', 50], ['conestoga', 100], ['caravanmaster', 150], ['caravanmaster', 200],
    ['berserker', 50], ['bloodlord', 100], ['bloodlord', 150], ['gladiator', 50], ['champion', 100], ['champion', 150], ['masterthief', 150]];
  const out = [];
  for (const [c, lv] of rows) {
    if (!CLASSES[c]) { out.push([c, lv, 'NONE']); continue; }
    H.fresh(); const a = H.adv(c, lv, { slv: 3, sm: 3 }); const d = derive(a), C = CLASSES[c], agi = d.T.agi;
    const sp = Math.max(0, d.spd / (C.spd * (1 + agi * 0.004)) - 1);
    const rc = Math.round((C.spd - 0.8) * 8) / 2, rt = jobTier(c) - 1, ra = Math.floor(agi / 10) * 0.03, rp = sp * 5;
    const iv = Math.max(Q.floor, Q.base - rc - rt - ra - rp);
    out.push([C.name, lv, jobTier(c), C.spd, Math.round(agi), +(5 / d.spd).toFixed(2), +(3 / d.spd).toFixed(2), rc, rt, +ra.toFixed(2), +rp.toFixed(2), +iv.toFixed(2)]);
  }
  return JSON.stringify(out);
})()
