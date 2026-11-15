(() => {
  const out = {};
  // 1. 직업 × 레벨: 쿨타임 · 실행 · 한 번
  const rows = [['warrior', 1], ['warrior', 30], ['knight', 50], ['paladin', 100], ['paladin', 200], ['archer', 1], ['sniper', 50], ['hawkeye', 100], ['hawkeye', 200],
    ['rogue', 1], ['assassin', 50], ['shadowlord', 100], ['shadowlord', 200], ['mage', 1], ['sorcerer', 50], ['archmage', 100], ['archmage', 200],
    ['cleric', 1], ['priest', 50], ['archbishop', 100], ['archbishop', 200], ['porter', 1], ['coachman', 50], ['caravanmaster', 150], ['caravanmaster', 200], ['masterthief', 200], ['seadragoon', 200]];
  out.tab = rows.map(([c, lv]) => { H.fresh(); const a = H.adv(c, lv, { slv: 3, sm: 3 }); const d = derive(a), q = basicCutParts(a, d), w = basicCd(a, d, null), x = basicExec(a, d);
    return [CLASSES[c].name, lv, Math.round(d.T.agi), q.cls, q.tier, +q.agi.toFixed(2), +q.pct.toFixed(2), +w.toFixed(2), +d.aspd.toFixed(2), +x.toFixed(2), +(w + x).toFixed(2)]; });
  // 2. 설명 글에 「공격 속도」가 남은 스킬 · 특성
  out.left = Object.keys(SKILLS).filter(id => !SKILLS[id].cut && /공격 ?속도/.test(SKILLS[id].desc || '')).map(id => [id, SKILLS[id].desc]);
  out.leftT = Object.keys(TRAITS).filter(k => /공격 ?속도/.test(TRAITS[k].desc || '')).map(k => [k, TRAITS[k].desc]);
  out.descs = ['quickstep', 'haste', 'rhythm', 'frenzy', 'berserk', 'warcry', 'westward', 'medkit', 'marchsong', 'deepblood'].map(id => [id, SKILLS[id].desc, skillSpec(id).join(' · ')]);
  out.traits = [TRAITS.quick.desc, TRAITS.j_ninja.desc];
  out.rune = runeLine('haste', 'w');
  out.mast = mastFxText(MASTERY.dagger.fx[3]);
  // 3. 싸움: swing 뒤 hit까지의 시간
  H.fresh(); const team = [H.adv('warrior', 30, { slv: 3, sm: 3 }), H.adv('archer', 30, { slv: 3, sm: 3 }), H.adv('mage', 30, { slv: 3, sm: 3 }), H.adv('cleric', 30, { slv: 3, sm: 3 })];
  const sw = {}, gaps = [], cyc = {}; let tt = 0;
  const ev0 = ev; ev = function (e, k, x) { if (k === 'swing') sw[x.s] = { t: tt, w: x.w }; else if ((k === 'hit' && x.b) || (k === 'fmiss' && !x.sk)) { const s0 = sw[x.s]; if (s0) { gaps.push([advById(x.s).cls, +(tt - s0.t).toFixed(2), s0.w]); (cyc[x.s] = cyc[x.s] || []).push(tt); delete sw[x.s]; } } return ev0.apply(this, arguments); };
  const st0 = stepExp; stepExp = function (p, dt) { tt += dt; return st0.apply(this, arguments); };
  try { H.push(team, 'valley', 13, 240); } finally { ev = ev0; stepExp = st0; }
  out.gaps = gaps.slice(0, 16);
  out.cyc = Object.fromEntries(Object.entries(cyc).map(([id, L]) => { const g = []; for (let i = 1; i < L.length; i++) g.push(L[i] - L[i - 1]); g.sort((x, y) => x - y); return [advById(+id).cls, [L.length, +(g[Math.floor(g.length / 2)] || 0).toFixed(2)]]; }));
  // 4. 화면 글
  const a = team[0];
  out.basic = basicSpec(a);
  out.spd = speedBreakdown(team[1]);
  out.story = STORY.v69h;
  return JSON.stringify(out);
})()
