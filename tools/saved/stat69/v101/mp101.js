(() => {
  // 스킬을 재사용마다 다 쓴다고 칠 때 초당 MP와 싸움 중 초당 회복 (스킬 단계 5 · 숙련도 5) — 차수마다 쓰는 MP 몫
  const B = {
    mage12: ['mage', 12, ['fireball', 'icelance', 'chain']], cleric12: ['cleric', 12, ['heal', 'massheal', 'bless']],
    mage30: ['mage', 30, ['fireball', 'icelance', 'chain', 'burst', 'iceprison']], cleric30: ['cleric', 30, ['heal', 'massheal', 'chant', 'bless', 'holy']],
    sorc60: ['sorcerer', 60, ['arcanebolt', 'fireball', 'chain', 'meteor', 'thunderclap', 'blizzard']], priest60: ['priest', 60, ['prayer', 'heal', 'massheal', 'greatheal', 'grace', 'chant']],
    plague60: ['plaguedoc', 60, ['miasma', 'heal', 'remedy', 'massheal', 'greatheal', 'chant']], necro60: ['necromancer', 60, ['drain', 'fireball', 'curse', 'chain', 'meteor', 'blizzard']],
    archmage100: ['archmage', 100, ['arcanestorm', 'arcanebolt', 'fireball', 'chain', 'meteor', 'thunderclap', 'blizzard', 'meteorfall', 'disintegrate']],
    archb100: ['archbishop', 100, ['miracle', 'prayer', 'heal', 'massheal', 'greatheal', 'revival', 'restore', 'sacredsong', 'grace']],
    lich100: ['lich', 100, ['soulrend', 'drain', 'curse', 'chain', 'meteor', 'blizzard', 'deathwave', 'raise', 'lichmind']],
    archmage146: ['archmage', 146, ['arcanestorm', 'arcanebolt', 'chain', 'meteor', 'blizzard', 'meteorfall', 'disintegrate', 'amplify', 'gravity', 'ultima']],
    archb146: ['archbishop', 146, ['miracle', 'prayer', 'greatheal', 'revival', 'restore', 'sacredsong', 'grace', 'resurrect', 'dawnlight', 'massheal']],
    lich146: ['lich', 146, ['soulrend', 'drain', 'curse', 'chain', 'meteor', 'blizzard', 'deathwave', 'raise', 'lichmind', 'deathplague']],
    sniper60: ['sniper', 60, ['headshot', 'aimed', 'double', 'rain', 'piercing', 'steadyaim']], hawkeye146: ['hawkeye', 146, ['divinearrow', 'headshot', 'rain', 'piercing', 'steadyaim', 'longshot', 'piercearrow', 'stormarrows', 'starfall', 'godseye']],
    paladin146: ['paladin', 146, ['holystrike', 'shieldbash', 'provoke', 'fortress', 'guardian', 'rally', 'judgment', 'layhands', 'aegis', 'devotion']]
  };
  const out = [];
  for (const [k, [c, lv, sk]] of Object.entries(B)) {
    H.fresh(); const a = H.adv(c, lv, { sk, slv: 5, sm: 5 }); const d = derive(a);
    const regen = d.maxMp * 0.02 * d.mpRegen + (d.mpFlat || 0);
    let spend = 0; const byT = [0, 0, 0, 0, 0];
    for (const id of a.skills) { const s = SKILLS[id]; if (!s || s.passive || !s.cost.mp) continue; const cd = Math.max(skillCdOf(a, d, id, null), CAST_GAP); const r = s.cost.mp / cd; spend += r; byT[paceTier(id)] += r; }
    out.push([k, Math.round(d.maxMp), +regen.toFixed(1), +spend.toFixed(2), +(spend / regen).toFixed(3), byT.map(v => +v.toFixed(2))]);
  }
  return JSON.stringify(out);
})()
