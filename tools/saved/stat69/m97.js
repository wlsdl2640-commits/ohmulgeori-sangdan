// 회복량 · 흡혈 · MP 상한 안건 측정 (시험 묶음 아님): 직업 · 레벨마다 주는 회복 보너스 · 받는 회복 · 흡혈 · MP 회복
(() => {
  H.fresh(); const out = [];
  const plan = [['priest', 60], ['plaguedoc', 60], ['archbishop', 100], ['physician', 100], ['paladin', 100], ['archbishop', 150], ['bloodlord', 150], ['lich', 150], ['archmage', 150]];
  for (const [cls, lv] of plan) {
    const a = H.adv(cls, lv, { slv: 5, sm: 5, q: 3 }), d = derive(a), P = passives(a);
    const tr = chainOf(cls).map(c => jobTraitOf(c)).filter(Boolean);
    out.push({ cls: CLASSES[cls].name, lv, traits: a.traits, healBonus: +(d.healPow - 1).toFixed(3), fromTrait: +traitSum(a, 'healPow').toFixed(3), fromPassive: +(P.healPow || 0).toFixed(3), jobTr: TR(a).healPow || 1, rheal: +d.rheal.toFixed(3), leech: +((TR(a).lifesteal || 0) + (TR(a).mdrain || 0) + d.lifesteal).toFixed(3), mpRegen: +d.mpRegen.toFixed(2), maxMp: d.maxMp });
    S.advs = [];
  }
  return JSON.stringify({ out, runeHeal: RUNES.heal.w.v, runeLeech: RUNES.hp.w.v, cap: { healPow: CAP.healPow, rheal: CAP.rheal, lifesteal: CAP.lifesteal, mpRegen: CAP.mpRegen } });
})()
