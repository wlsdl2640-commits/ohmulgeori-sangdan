// A3 피해 +15%: 궁수 계열 공격력 ×1.15
{ const d0 = derive; derive = function (a) { const d = d0(a); return a && jobBase(a.cls) === 'archer' ? Object.assign({}, d, { atk: d.atk * 1.15 }) : d; }; }
