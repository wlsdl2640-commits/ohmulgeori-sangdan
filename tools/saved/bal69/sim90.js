/* 원정 밀기 비교: 단계 · 파티 · 스킬 상태 · 반복 (window.SIM_ONLY로 골라 돌릴 수 있다) */
(() => {
  if (window.SIM_MUL) { MON_MUL69.length = 0; window.SIM_MUL.forEach(x => MON_MUL69.push(x)); }
  const B = {
    warrior30: ['warrior', ['bash', 'taunt', 'ironwall', 'ironskin', 'sweep']],
    archer30: ['archer', ['aimed', 'double', 'poisonarrow', 'rain', 'piercing']],
    mage30: ['mage', ['fireball', 'icelance', 'chain', 'burst', 'iceprison']],
    cleric30: ['cleric', ['heal', 'massheal', 'chant', 'bless', 'holy']],
    rogue30: ['rogue', ['backstab', 'smoke', 'venom', 'parasting', 'shadow']],
    warrior12: ['warrior', ['bash', 'taunt', 'ironwall']], archer12: ['archer', ['aimed', 'double', 'poisonarrow']], mage12: ['mage', ['fireball', 'icelance', 'chain']], cleric12: ['cleric', ['heal', 'massheal', 'bless']], rogue12: ['rogue', ['backstab', 'smoke', 'venom']],
    warrior20: ['warrior', ['bash', 'taunt', 'ironwall', 'ironskin']], archer20: ['archer', ['aimed', 'double', 'poisonarrow', 'rain']], mage20: ['mage', ['fireball', 'icelance', 'chain', 'burst']], cleric20: ['cleric', ['heal', 'massheal', 'bless', 'holy']], rogue20: ['rogue', ['backstab', 'smoke', 'venom', 'parasting']],
    knight60: ['knight', ['shieldbash', 'taunt', 'provoke', 'ironwall', 'guardian', 'sweep']],
    sniper60: ['sniper', ['headshot', 'aimed', 'double', 'rain', 'piercing', 'steadyaim']],
    sorc60: ['sorcerer', ['arcanebolt', 'fireball', 'chain', 'meteor', 'thunderclap', 'blizzard']],
    priest60: ['priest', ['prayer', 'heal', 'massheal', 'greatheal', 'grace', 'chant']],
    plague60: ['plaguedoc', ['miasma', 'heal', 'remedy', 'massheal', 'greatheal', 'chant']],
    assassin60: ['assassin', ['assassinate', 'backstab', 'shadow', 'venom', 'poisonblade', 'blades']],
    berserker60: ['berserker', ['bloodstrike', 'whirl', 'bloodthirst', 'sweep', 'berserk', 'guardian']],
    necro60: ['necromancer', ['drain', 'fireball', 'curse', 'chain', 'meteor', 'blizzard']],
    paladin100: ['paladin', ['holystrike', 'shieldbash', 'taunt', 'provoke', 'fortress', 'guardian', 'rally', 'judgment', 'ironwall']],
    hawkeye100: ['hawkeye', ['divinearrow', 'headshot', 'aimed', 'rain', 'piercing', 'steadyaim', 'longshot', 'piercearrow', 'stormarrows']],
    archmage100: ['archmage', ['arcanestorm', 'arcanebolt', 'fireball', 'chain', 'meteor', 'thunderclap', 'blizzard', 'meteorfall', 'disintegrate']],
    archb100: ['archbishop', ['miracle', 'prayer', 'heal', 'massheal', 'greatheal', 'revival', 'restore', 'sacredsong', 'grace']],
    phys100: ['physician', ['cureall', 'heal', 'remedy', 'massheal', 'greatheal', 'revival', 'panacea', 'miasma', 'chant']],
    shadow100: ['shadowlord', ['shadowstep', 'assassinate', 'backstab', 'shadow', 'blades', 'throatcut', 'shadowclone', 'poisonblade', 'vanish']],
    blood100: ['bloodlord', ['bloodfeast', 'bloodstrike', 'whirl', 'bloodthirst', 'bloodmoon', 'rampage', 'guardian', 'sweep', 'frenzy']],
    lich100: ['lich', ['soulrend', 'drain', 'curse', 'chain', 'meteor', 'blizzard', 'deathwave', 'raise', 'lichmind']],
    paladin146: ['paladin', ['holystrike', 'shieldbash', 'provoke', 'fortress', 'guardian', 'rally', 'judgment', 'layhands', 'aegis', 'devotion']],
    hawkeye146: ['hawkeye', ['divinearrow', 'headshot', 'rain', 'piercing', 'steadyaim', 'longshot', 'piercearrow', 'stormarrows', 'starfall', 'godseye']],
    archmage146: ['archmage', ['arcanestorm', 'arcanebolt', 'chain', 'meteor', 'blizzard', 'meteorfall', 'disintegrate', 'amplify', 'gravity', 'ultima']],
    archb146: ['archbishop', ['miracle', 'prayer', 'greatheal', 'revival', 'restore', 'sacredsong', 'grace', 'resurrect', 'dawnlight', 'massheal']],
    phys146: ['physician', ['cureall', 'remedy', 'greatheal', 'revival', 'panacea', 'regenall', 'elixir', 'surgeon', 'massheal', 'miasma']],
    shadow146: ['shadowlord', ['shadowstep', 'assassinate', 'shadow', 'blades', 'throatcut', 'shadowclone', 'poisonblade', 'shadowstorm', 'soulreap', 'eclipse']],
    blood146: ['bloodlord', ['bloodfeast', 'bloodstrike', 'whirl', 'bloodthirst', 'bloodmoon', 'rampage', 'guardian', 'frenzy', 'bloodlust', 'ragnarok']],
    lich146: ['lich', ['soulrend', 'drain', 'curse', 'chain', 'meteor', 'blizzard', 'deathwave', 'raise', 'lichmind', 'deathplague']]
  };
  const T = {
    12: { lv: 12, fid: 'forest', st: 13, comps: { 힐러: ['warrior12', 'archer12', 'mage12', 'cleric12'], 힐러없음: ['warrior12', 'archer12', 'mage12', 'rogue12'] } },
    20: { lv: 20, fid: 'mountain', st: 9, comps: { 힐러: ['warrior20', 'archer20', 'mage20', 'cleric20'], 힐러없음: ['warrior20', 'archer20', 'mage20', 'rogue20'] } },
    30: { lv: 30, fid: 'valley', st: 13, comps: { 힐러: ['warrior30', 'archer30', 'mage30', 'cleric30'], 힐러없음: ['warrior30', 'archer30', 'mage30', 'rogue30'] } },
    45: { lv: 45, fid: 'desert', st: 1, comps: { 힐러: ['warrior30', 'archer30', 'mage30', 'cleric30'], 힐러없음: ['warrior30', 'archer30', 'mage30', 'rogue30'] } },
    60: { lv: 60, fid: 'swamp', st: 25, comps: { 사제: ['knight60', 'sniper60', 'sorc60', 'priest60'], 역병의사: ['knight60', 'sniper60', 'sorc60', 'plague60'], 힐러없음: ['knight60', 'sniper60', 'sorc60', 'assassin60'], 흡혈: ['knight60', 'berserker60', 'sniper60', 'necro60'] } },
    80: { lv: 80, fid: 'volcano', st: 1, comps: { 사제: ['knight60', 'sniper60', 'sorc60', 'priest60'], 역병의사: ['knight60', 'sniper60', 'sorc60', 'plague60'], 힐러없음: ['knight60', 'sniper60', 'sorc60', 'assassin60'], 흡혈: ['knight60', 'berserker60', 'sniper60', 'necro60'] } },
    90: { lv: 90, fid: 'roots', st: 1, comps: { 사제: ['knight60', 'sniper60', 'sorc60', 'priest60'], 역병의사: ['knight60', 'sniper60', 'sorc60', 'plague60'], 힐러없음: ['knight60', 'sniper60', 'sorc60', 'assassin60'], 흡혈: ['knight60', 'berserker60', 'sniper60', 'necro60'] } },
    100: { lv: 100, fid: 'sky', st: 1, comps: { 대주교: ['paladin100', 'hawkeye100', 'archmage100', 'archb100'], 명의: ['paladin100', 'hawkeye100', 'archmage100', 'phys100'], 힐러없음: ['paladin100', 'hawkeye100', 'archmage100', 'shadow100'], 흡혈: ['paladin100', 'blood100', 'hawkeye100', 'lich100'] } },
    120: { lv: 120, fid: 'thunder', st: 1, comps: { 대주교: ['paladin146', 'hawkeye146', 'archmage146', 'archb146'], 명의: ['paladin146', 'hawkeye146', 'archmage146', 'phys146'], 힐러없음: ['paladin146', 'hawkeye146', 'archmage146', 'shadow146'], 흡혈: ['paladin146', 'blood146', 'hawkeye146', 'lich146'] } },
    130: { lv: 130, fid: 'ruins', st: 1, comps: { 대주교: ['paladin146', 'hawkeye146', 'archmage146', 'archb146'], 명의: ['paladin146', 'hawkeye146', 'archmage146', 'phys146'], 힐러없음: ['paladin146', 'hawkeye146', 'archmage146', 'shadow146'], 흡혈: ['paladin146', 'blood146', 'hawkeye146', 'lich146'] } },
    146: { lv: 146, fid: 'stargarden', st: 30, comps: { 대주교: ['paladin146', 'hawkeye146', 'archmage146', 'archb146'], 명의: ['paladin146', 'hawkeye146', 'archmage146', 'phys146'], 힐러없음: ['paladin146', 'hawkeye146', 'archmage146', 'shadow146'], 흡혈: ['paladin146', 'blood146', 'hawkeye146', 'lich146'] } }
  };
  const ST = (window.SIM_ST || [[1, 0], [5, 5]]), N = window.SIM_N || 3, SECS = window.SIM_SECS || 1500;
  const out = [];
  for (const tk of Object.keys(T)) {
    if (window.SIM_ONLY && !window.SIM_ONLY.includes(+tk)) continue;
    const C = T[tk];
    for (const [cn, comp] of Object.entries(C.comps)) {
      for (const [slv, sm] of ST) {
        const runs = [];
        for (let i = 0; i < N; i++) {
          H.fresh();
          const team = comp.map(k => { const [c, sk] = B[k]; return H.adv(c, C.lv, { sk, slv, sm }); });
          const r = H.push(team, C.fid, C.st, SECS);
          runs.push({ flv: r.flv, stage: r.stage, wiped: r.wiped, cleared: r.cleared, t: r.t, taken: Math.round(r.R.taken), hraw: Math.round(r.R.hraw), heff: Math.round(r.R.heff), downs: r.R.downs, rev: r.R.revives, fights: r.R.fights, fightT: Math.round(r.R.fightT), heal: Object.fromEntries(Object.entries(r.R.heal).map(([k, v]) => [k, Math.round(v.eff)])) });
        }
        out.push({ tier: +tk, comp: cn, slv, sm, runs, hp: 0 });
      }
    }
  }
  return JSON.stringify(out);
})()
