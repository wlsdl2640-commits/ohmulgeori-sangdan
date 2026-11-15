// 성직자 계열 스킬 목록 · 회복량 · 대상 (11-15 12:03 사용자 「사제 계열의 스킬목록을 보고 스킬의 회복력, 회복대상을 손보자」 — 내 측정)
(() => {
  const PLAN = [['cleric', 30, 'warrior', 'archer'], ['priest', 60, 'knight', 'sniper'], ['plaguedoc', 60, 'knight', 'sniper'], ['exorcist', 60, 'knight', 'sniper'],
    ['archbishop', 100, 'paladin', 'hawkeye'], ['physician', 100, 'paladin', 'hawkeye'], ['inquisitor', 100, 'paladin', 'hawkeye'],
    ['archbishop', 150, 'paladin', 'hawkeye'], ['physician', 150, 'paladin', 'hawkeye'], ['inquisitor', 150, 'paladin', 'hawkeye']];
  const out = [];
  for (const [c, lv, tc, dc] of PLAN) {
    H.fresh();
    const tank = H.adv(tc, lv), dps = H.adv(dc, lv), dT = derive(tank), dD = derive(dps);
    const a = H.adv(c, lv, { slv: 5, sm: 5 }), d = derive(a);
    const M = (1 + 0.03 * 5) * (1 + SK_LV_POW * 4);
    const ids = Object.keys(SKILLS).filter(id => { const s = SKILLS[id]; return !s.cut && s.cls && s.cls.length && (canLearn(a, id) || chainOf(a.cls).some(cc => CLASSES[cc].innate === id)); });
    const rows = ids.map(id => {
      const s = SKILLS[id], J = skJob(id) || {};
      const cd = skillCdOf(a, d, id, { buffs: [], sta: {} });
      let heal = null, healD = null;
      if (s.kind === 'heal' && s.tgt === 'self') heal = s.pct * M * d.healPow * 100;
      else if (s.kind === 'heal' || s.kind === 'regen') {
        const per = s.pct ? dT.maxHp * s.pct * M * d.healPow : d.matk * s.mult * M * (TR(a).healPow || 1) * d.healPow;
        const tot = s.kind === 'regen' ? per * (s.dur || 1) : per;
        heal = tot / dT.maxHp * 100; healD = (s.pct ? s.pct * M * d.healPow * (s.kind === 'regen' ? s.dur : 1) * 100 : tot / dD.maxHp * 100);
      } else if (s.kind === 'shield') { const hp = s.pct ? dT.maxHp * s.pct * M : d.matk * (s.mult || 0) * M * d.healPow; heal = hp / dT.maxHp * 100; }
      return { id, name: s.name, tag: skTag(id), tier: J.tier, lv: s.lv, kind: s.kind || (s.passive ? 'passive' : ''), tgt: s.tgt || '', cd: +cd.toFixed(1), mp: (s.cost && s.cost.mp) || 0, mult: s.mult, pct: s.pct, dur: s.dur, stat: s.stat, cures: s.cures || s.pcures || null, heal: heal == null ? null : +heal.toFixed(1), healD: healD == null ? null : +healD.toFixed(1), drain: s.drain || null, desc: (s.desc || '').slice(0, 90) };
    }).sort((x, y) => (x.lv || 0) - (y.lv || 0));
    out.push({ cls: CLASSES[c].name, id: c, lv, tankHp: dT.maxHp, dpsHp: dD.maxHp, matk: Math.round(d.matk), healPow: +d.healPow.toFixed(2), trHeal: TR(a).healPow || 1, maxMp: d.maxMp, rows });
  }
  return JSON.stringify(out);
})()
