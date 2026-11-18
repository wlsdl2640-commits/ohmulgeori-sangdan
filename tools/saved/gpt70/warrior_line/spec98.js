(() => {
  const line = ['warrior', 'gladiator', 'knight', 'berserker', 'spellblade', 'champion', 'paladin', 'bloodlord', 'arcblade'];
  const strip = s => String(s).replace(/<[^>]+>/g, '');
  return JSON.stringify(line.map(c => { const ids = c === 'warrior'
      ? SKILL_IDS.filter(id => { const j = skJob(id); return j.kind === 'line' && (j.fams || []).includes('warrior'); })
      : SKILL_IDS.filter(id => !SKILLS[id].cut && (SKILLS[id].cls || []).includes(c));
    ids.sort((x, y) => (SKILLS[x].lv || 0) - (SKILLS[y].lv || 0));
    return { c, name: CLASSES[c].name, tier: jobTier(c), skills: ids.map(id => { const s = SKILLS[id]; return { id, name: s.name, lv: s.lv || 1, kind: s.kind || 'passive', tgt: s.tgt || null, desc: s.desc, spec: skillSpec(id).map(strip), other: (s.cls || []).filter(x => jobBase(x) !== 'warrior').map(x => CLASSES[x].name) }; }) }; }));
})()
