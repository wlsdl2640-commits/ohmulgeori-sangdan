(() => {
  const out = {};
  const fams = { rogue: ['rogue', 'assassin', 'duelist', 'treasure', 'ninja', 'shadowlord', 'bladedancer', 'phantomthief', 'kageninja', 'masterthief'], archer: ['archer', 'ranger', 'sniper', 'mhunter', 'huntsman', 'dragoon', 'hawkeye', 'dslayer', 'kaijuhunter'] };
  for (const [fam, cls] of Object.entries(fams)) {
    out[fam] = Object.keys(SKILLS).filter(id => { const s = SKILLS[id]; return !s.cut && s.cls && s.cls.some(c => cls.includes(c)); }).map(id => { const s = SKILLS[id]; const p = s.passive ? 'P:' + JSON.stringify(s.passive) : ''; const b = s.kind === 'buff' || s.kind === 'shield' ? `B:${s.stat || ''}${s.mult ? '×' + s.mult : ''}${s.add ? '+' + s.add : ''}/${s.dur || ''}s/${s.tgt}${s.more ? ' more' + JSON.stringify(s.more) : ''}` : ''; return `${id}|${s.name}|${s.cls.join(',')}|lv${s.lv0 || s.lv || ''}|${s.kind || 'pas'}|${s.tgt || ''}|m${s.mult || ''}${s.hits ? 'x' + s.hits : ''}|cd${s.cd || ''}|${p}${b}${s.sta ? ' sta:' + s.sta.k + s.sta.p : ''}`; });
  }
  out.tr = Object.fromEntries([...fams.rogue, ...fams.archer].map(c => [c, CLASSES[c] ? { tr: CLASSES[c].tr, act: CLASSES[c].act, row: CLASSES[c].row, spd: CLASSES[c].spd, crit: CLASSES[c].crit, trait: JOB_TRAITS[c] && JOB_TRAITS[c].desc } : null]));
  return JSON.stringify(out);
})()
