// R4 회피 강화 손질: 도적 회피 강화 지속 ×1.5 · 재사용 ×0.75 · 도적 계열 회피의 민첩 몫 35% → 45%
['smoke', 'vanish', 'parrying', 'nightfall', 'smokebomb', 'disguise', 'shadowhide'].forEach(id => { SKILLS[id].dur *= 1.5; SKILLS[id].cd *= 0.75; });
PATCH('deriveBase', "Math.min(EVA_AGI_MAX, T.agi * 0.004)", "Math.min(jobBase(a.cls) === 'rogue' ? 0.45 : EVA_AGI_MAX, T.agi * 0.004)");
