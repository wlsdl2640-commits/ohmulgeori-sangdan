/* 대주교가 Lv100 구름섬에서 900초 동안 스킬을 몇 번 쓰나 (빌드 69, 11-14 — 파티 치유만 골라 한 명이 다쳐도 치유를 안 하던 것). ev83.py h83.js heal92.js */
(() => {
  const out = {};
  const pick = (cls, lv) => { const a = makeAdv({ cls, lv }); return Object.keys(SKILLS).filter(id => { const s = SKILLS[id]; return !s.cut && s.cls && chainOf(cls).some(c => s.cls.includes(c)) && (s.lv || 1) <= lv && canLearn(a, id); }).sort((x, y) => (SKILLS[y].lv || 0) - (SKILLS[x].lv || 0)); };
  H.fresh();
  const team = ['paladin', 'lich', 'archmage', 'archbishop'].map(c => H.adv(c, 100, { sk: pick(c, 100), slv: 3, sm: 3 }));
  const ab = team[3];
  out.ab = ab.skills.map(id => { const s = SKILLS[id]; return [id, s.name, s.kind || 'passive', s.tgt, s.mult, s.cost && s.cost.mp, s.cd, s.lv]; });
  out.slots = typeof skillSlots === 'function' ? skillSlots(ab) : null;
  out.mp = [ab.mp, derive(ab).maxMp];
  const cnt = {}; const c0 = cast;
  cast = function (e, a, d, id) { if (a.id === ab.id) cnt[id] = (cnt[id] || 0) + 1; return c0.apply(this, arguments); };
  let lowMp = 0, ticks = 0; const s0 = step;
  const r = H.push(team, 'sky', 1, 900);
  cast = c0;
  out.casts = cnt; out.flv = r.flv; out.t = r.t;
  out.mpEnd = [ab.mp, derive(ab).maxMp];
  out.active = typeof activeSkills === 'function' ? activeSkills(ab) : null;
  return JSON.stringify(out);
})()
