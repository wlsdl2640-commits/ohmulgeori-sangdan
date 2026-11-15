(() => {
  // 지금 공격 속도 출처를 갈래마다 떼어 본다: 직업 C.spd · 민첩 · spdPct(패시브 · 특성 · 장비 룬) · 강화(haste 배율)
  const lvs = [1, 30, 50, 80, 100, 150, 200];
  const cl = ['warrior', 'archer', 'mage', 'cleric', 'rogue', 'porter', 'knight', 'gladiator', 'berserker', 'sniper', 'ranger', 'assassin', 'duelist', 'sorcerer', 'priest', 'plaguedoc', 'paladin', 'champion', 'bloodlord', 'hawkeye', 'shadowlord', 'bladedancer', 'archmage', 'lich', 'archbishop', 'physician', 'kageninja', 'masterthief', 'caravanmaster'];
  const out = [];
  for (const c of cl) { if (!CLASSES[c]) continue; for (const lv of lvs) { if (lv < 50 && jobTier(c) >= 2) continue; if (lv < 100 && jobTier(c) >= 3) continue; if (lv < 150 && jobTier(c) >= 4) continue; if (lv >= 100 && jobTier(c) < 2) continue; if (lv >= 150 && jobTier(c) < 3) continue;
    H.fresh(); const a = H.adv(c, lv, { slv: 3, sm: 3 }); const d = derive(a), G = gearSum(a), P = passives(a);
    const sp = (P.spdPct || 0) + traitSum(a, 'spdPct') + (G.spdPct || 0);
    out.push([c, lv, jobTier(c), CLASSES[c].spd, Math.round(d.T.agi), +sp.toFixed(3), +d.spd.toFixed(2), +(5 / d.spd).toFixed(2)]); } }
  return JSON.stringify(out);
})()
