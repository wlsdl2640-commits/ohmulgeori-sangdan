// h83.js보다 먼저: 스킬 MP 셈을 바꾸는 변형 — gauge(차수별 × 최대 MP) 또는 clsMp(마법사 · 성직자 계열 magic 배, 그 밖 phys 배)
if (window.__CFG.gauge || window.__CFG.clsMp) {
  var MPCOST = (a, d, id) => {
    const C = window.__CFG, s = SKILLS[id];
    if (C.gauge) { const t = Math.max(0, Math.min(4, (skJob(id) || {}).tier || 0)); return d.maxMp * C.gauge[t] * (C.healCut && ['heal', 'regen', 'shield', 'revive', 'cure'].includes(s.kind) ? C.healCut : 1); }
    return s.cost.mp * (['mage', 'cleric'].includes(jobBase(a.cls)) ? C.clsMp.magic : C.clsMp.phys);
  };
  PATCH('pickSkill', 's.cost.mp && a.mp < s.cost.mp', 's.cost.mp && a.mp < MPCOST(a, d, id)');
  PATCH('cast', 'if (s.cost.mp) a.mp -= s.cost.mp;', 'if (s.cost.mp) a.mp -= MPCOST(a, d, id);');
}
