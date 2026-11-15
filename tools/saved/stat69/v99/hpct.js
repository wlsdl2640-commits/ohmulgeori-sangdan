(() => {
  const out = [];
  const rows = [[12, 'cleric', 'warrior', ['heal', 'massheal']], [20, 'cleric', 'warrior', ['heal', 'massheal']], [30, 'cleric', 'warrior', ['heal', 'massheal', 'firstaid']], [45, 'cleric', 'warrior', ['heal', 'massheal', 'greatheal']],
    [60, 'priest', 'knight', ['heal', 'prayer', 'greatheal', 'massheal']], [60, 'plaguedoc', 'knight', ['heal', 'greatheal', 'massheal', 'remedy']], [80, 'priest', 'knight', ['heal', 'prayer', 'greatheal', 'restore', 'revival']], [90, 'priest', 'knight', ['heal', 'prayer', 'greatheal', 'restore', 'sacredsong', 'revival']],
    [100, 'archbishop', 'paladin', ['heal', 'prayer', 'greatheal', 'restore', 'sacredsong', 'revival', 'miracle']], [100, 'physician', 'paladin', ['heal', 'cureall', 'remedy', 'greatheal', 'revival', 'panacea']], [146, 'archbishop', 'paladin', ['heal', 'prayer', 'greatheal', 'restore', 'sacredsong', 'miracle', 'dawnlight']], [146, 'physician', 'paladin', ['heal', 'cureall', 'remedy', 'regenall', 'elixir']]];
  for (const [lv, hc, tc, sks] of rows) {
    H.fresh();
    const h = H.adv(hc, lv, { sk: sks, slv: 5, sm: 5 }), t = H.adv(tc, lv, { slv: 5, sm: 5 });
    const d = derive(h), dt = derive(t);
    const r = { lv, hc, tankHp: dt.maxHp, sk: {} };
    for (const id of sks) { const s = SKILLS[id]; if (!s) continue; const M = smMul(h, id) * skLvMul(h, id); const pow = d.matk * s.mult * M * (TR(h).healPow || 1) * d.healPow; const tot = s.kind === 'regen' ? pow * s.dur : pow; r.sk[id] = Math.round(tot / dt.maxHp * 100); }
    out.push(r);
  }
  return JSON.stringify(out);
})()
