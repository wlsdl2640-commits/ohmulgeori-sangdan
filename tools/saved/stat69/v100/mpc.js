(() => {
  const out = [];
  const rows = [['mage', 1], ['mage', 30], ['sorcerer', 80], ['archmage', 150], ['cleric', 1], ['cleric', 30], ['priest', 80], ['archbishop', 150], ['warrior', 1], ['warrior', 30], ['knight', 80], ['paladin', 150], ['archer', 1], ['archer', 30], ['sniper', 80], ['hawkeye', 150], ['rogue', 1], ['rogue', 30], ['assassin', 80], ['shadowlord', 150]];
  for (const [c, lv] of rows) { H.fresh(); const a = H.adv(c, lv, { slv: 3, sm: 3 }); const d = derive(a); const costs = a.skills.map(id => SKILLS[id]).filter(s => s && !s.passive && s.cost && s.cost.mp).map(s => s.cost.mp); const avg = costs.length ? costs.reduce((t, v) => t + v, 0) / costs.length : 0; out.push([CLASSES[c].name, lv, d.maxMp, Math.round(d.T.int), costs.length, Math.round(avg), avg ? Math.round(d.maxMp / avg) : 0, +(d.maxMp * 0.02 * d.mpRegen).toFixed(1)]); }
  return JSON.stringify(out);
})()
