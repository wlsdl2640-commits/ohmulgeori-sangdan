(() => {
  const out = { PACE69, BASIC_CD, PACE69_SM };
  const pick = ['heal', 'prayer', 'greatheal', 'restore', 'sacredsong', 'cureall', 'revival', 'fireball', 'bash', 'bless', 'taunt', 'poisonarrow', 'remedy', 'holyshield', 'westward', 'abyssroar', 'titanfall', 'driveshot', 'meteorfall', 'ultima', 'searoyal'];
  out.sk = pick.map(id => { const s = SKILLS[id]; if (!s) return [id, 'NONE']; const j = skJob(id) || {}; return [id, s.name, s.kind, 't' + j.tier, 'cd ' + s.cd0 + '→' + s.cd, 'dur ' + (s.dur0 || s.dur || 0) + '→' + (s.dur || 0), 'mult ' + (s.mult0 || s.mult) + '→' + s.mult, (s.after ? 'after ' + s.after.dur0 + '→' + s.after.dur : ''), s.desc]; });
  // 설명 글에 남은 예전 지속 (N초 동안) 이 지속과 맞는지
  const bad = [];
  for (const id in SKILLS) { const s = SKILLS[id]; if (s.cut || !s.desc) continue; if (PACE69_DUR.includes(s.kind) && s.dur) { const m = s.desc.match(/(\d+(?:\.\d+)?)초 동안/); if (m && +m[1] !== s.dur && +m[1] === s.dur0) bad.push([id, s.dur0, s.dur, s.desc]); } }
  out.badDesc = bad;
  // 몬스터 스킬은 그대로
  out.msk = Object.keys(MSK).slice(0, 3).map(k => [k, MSK[k].cd]);
  // 스킬 설명 · 기본 공격 설명
  H.fresh();
  const a = H.adv('archmage', 100, { slv: 5, sm: 5 });
  out.basic = basicSpec(a);
  out.spec = ['fireball', 'meteorfall'].map(id => skillSpec(id, a).join(' / '));
  const c = H.adv('archbishop', 100, { sk: ['greatheal', 'restore', 'sacredsong', 'revival'], slv: 5, sm: 5 });
  out.specH = ['greatheal', 'restore', 'sacredsong', 'revival'].map(id => skillSpec(id, c).join(' / '));
  return JSON.stringify(out);
})()
