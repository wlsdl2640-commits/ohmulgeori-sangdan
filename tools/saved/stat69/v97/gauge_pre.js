// 「MP = 연료 게이지」 변형: 스킬 MP = 최대 MP × 차수별 % (h83.js보다 먼저 — cast를 고쳐야 해서)
if (window.__CFG.gauge) {
  var MPCOST = (a, d, id) => { const t = Math.max(0, Math.min(4, (skJob(id) || {}).tier || 0)); return d.maxMp * window.__CFG.gauge[t] * (window.__CFG.healCut && ['heal', 'regen', 'shield', 'revive', 'cure'].includes(SKILLS[id].kind) ? window.__CFG.healCut : 1); };
  PATCH('pickSkill', 's.cost.mp && a.mp < s.cost.mp', 's.cost.mp && a.mp < MPCOST(a, d, id)');
  PATCH('cast', 'if (s.cost.mp) a.mp -= s.cost.mp;', 'if (s.cost.mp) a.mp -= MPCOST(a, d, id);');
}
