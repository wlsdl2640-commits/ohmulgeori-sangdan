// R5 그림자 기습: 회피 강화가 걸린 동안 도적 계열의 스킬 피해 +50% · 도적 회피 강화 지속 ×1.5
['smoke', 'vanish', 'parrying', 'nightfall', 'smokebomb', 'disguise', 'shadowhide'].forEach(id => { SKILLS[id].dur *= 1.5; });
PATCH('cast', "* s.mult * M * wag", "* s.mult * M * wag * (jobBase(a.cls) === 'rogue' && buffAdd(e, a.id, 'eva') > 0 ? 1.5 : 1)");
