(() => {
  const rows = [['warrior', 1], ['knight', 50], ['paladin', 100], ['paladin', 200], ['archer', 1], ['sniper', 50], ['hawkeye', 100], ['hawkeye', 200],
    ['rogue', 1], ['assassin', 50], ['shadowlord', 100], ['shadowlord', 200], ['mage', 1], ['sorcerer', 50], ['archmage', 100], ['archmage', 200],
    ['cleric', 1], ['priest', 50], ['archbishop', 100], ['archbishop', 200], ['porter', 1], ['coachman', 50], ['caravanmaster', 150], ['caravanmaster', 200]];
  const tab = rows.map(([c, lv]) => { H.fresh(); const a = H.adv(c, lv, { slv: 3, sm: 3 }); const d = derive(a), w = basicCd(a, d, null), x = basicExec(a, d);
    return [CLASSES[c].name, lv, +(5 / d.spd).toFixed(1), +(3 / d.spd).toFixed(1), +w.toFixed(1), +x.toFixed(2), +(w + x).toFixed(1)]; });
  const mp = [12, 30, 54, 60, 100, 146, 200].map(lv => { H.fresh(); const a = H.adv(lv < 50 ? 'mage' : lv < 100 ? 'sorcerer' : 'archmage', lv, { slv: 1, sm: 0 }); const d = derive(a);
    return [lv, +mpMul69(a).toFixed(2), Math.round(d.maxMp), skMp(a, SKILLS.fireball), skMp(a, SKILLS.chain), SKILLS.meteor && lv >= 50 ? skMp(a, SKILLS.meteor) : '-', SKILLS.ultima && lv >= 146 ? skMp(a, SKILLS.ultima) : '-']; });
  const heals = [['cleric', 12], ['cleric', 30], ['priest', 60], ['archbishop', 146]].map(([c, lv]) => { H.fresh(); const a = H.adv(c, lv, { slv: 1, sm: 0 }); return [c, lv, +mpMul69(a, SKILLS.heal).toFixed(2), skMp(a, SKILLS.heal), SKILLS.heal.cost.mp, skMp(a, SKILLS.massheal), SKILLS.massheal.cost.mp, +mpMul69(a, SKILLS.holy || SKILLS.smite || SKILLS.fireball).toFixed(2)]; });
  const cds = ['heal', 'fireball', 'greatheal', 'prayer', 'meteor', 'miracle', 'titanblow', 'ultima', 'searoyal', 'berserk', 'taunt'].filter(id => SKILLS[id]).map(id => [id, SKILLS[id].name, paceTier(id), SKILLS[id].cd0, SKILLS[id].cd, SKILLS[id].mult0 || '', SKILLS[id].mult || '']);
  return JSON.stringify({ tab, mp, cds, heals });
})()
