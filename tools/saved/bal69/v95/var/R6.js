// R6 잔영 쌓기: 도적 계열이 회피할 때마다 잔영 +1(최대 5) — 잔영 하나에 주는 피해 +10%, 맞으면 잔영 둘을 잃는다
PATCH('hitAdv', "ev(e, 'miss', Object.assign({ s: f.uid, d: x.id, bl: blind ? 1 : 0 }, hn)); return false; }", "ev(e, 'miss', Object.assign({ s: f.uid, d: x.id, bl: blind ? 1 : 0 }, hn)); if (jobBase(x.cls) === 'rogue') { e.af = e.af || {}; e.af[x.id] = Math.min(5, (e.af[x.id] || 0) + 1); } return false; }");
PATCH('hitAdv', "x.hp -= v;", "x.hp -= v; if (e.af && e.af[x.id]) e.af[x.id] = Math.max(0, e.af[x.id] - 2);");
PATCH('hitFoe', "const T = a ? TR(a) : {};", "const T = a ? TR(a) : {}; if (a && e.af && e.af[a.id] && jobBase(a.cls) === 'rogue') atk *= 1 + 0.1 * e.af[a.id];");
