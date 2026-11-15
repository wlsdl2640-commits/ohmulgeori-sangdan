(() => {
  // 능력치 1점이 올려 주는 것을 직접 재 본다: 같은 모험가에게 힘 · 민첩 · 체력 · 지능을 10씩 더하고 derive 차이를 본다
  const out = {};
  for (const c of ['warrior', 'archer', 'rogue', 'mage', 'cleric']) {
    H.fresh(); const a = H.adv(c, 50, { slv: 1, sm: 0 }); const d0 = derive(a); const r = {};
    for (const k of ['str', 'agi', 'vit', 'int']) { a.tr[k] += 10; const d1 = derive(a); a.tr[k] -= 10; const df = {}; for (const f of ['atk', 'matk', 'def', 'maxHp', 'maxMp', 'crit', 'eva', 'spd', 'move', 'carry']) { const v = (d1[f] - d0[f]) / 10; if (Math.abs(v) > 1e-6) df[f] = +v.toFixed(4); } r[k] = df; }
    out[CLASSES[c].name] = r;
  }
  out.STATS = STATS;
  return JSON.stringify(out);
})()
