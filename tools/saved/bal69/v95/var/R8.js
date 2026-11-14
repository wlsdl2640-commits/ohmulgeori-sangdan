// R8 크기 가늠: rogue 계열 공격력 ×2.0 (손질이 얼마나 커야 하는지 보려고)
{ const d0 = derive; derive = function (a) { const d = d0(a); return a && jobBase(a.cls) === 'rogue' ? Object.assign({}, d, { atk: d.atk * 2.0 }) : d; }; }
