(() => {
  const out = { pass: [], buff: [], trait: [], mast: [], rune: [], cls: [] };
  for (const id in SKILLS) {
    const s = SKILLS[id];
    if (s.cut) continue;
    if (s.passive && s.passive.spdPct) out.pass.push([id, s.name, s.passive.spdPct, s.desc]);
    const spdB = [];
    if (s.haste) spdB.push(['haste', s.haste]);
    if (s.stat === 'spd') spdB.push(['stat', s.mult]);
    (s.more || []).forEach(m => { if (m.stat === 'spd') spdB.push(['more', m.mult]); });
    [s.after, s.after2].forEach(A => { if (A && A.stat === 'spd') spdB.push(['after', A.mult]); });
    if (spdB.length) out.buff.push([id, s.name, JSON.stringify(spdB), s.desc]);
  }
  for (const k in TRAITS) if (TRAITS[k].spdPct) out.trait.push([k, TRAITS[k].name, TRAITS[k].spdPct, TRAITS[k].desc]);
  for (const k in MASTERY) { const M = MASTERY[k]; (M.fx || []).forEach((f, i) => { if (f && f.spdPct) out.mast.push([k, M.name, i, f.spdPct]); }); }
  for (const k in RUNES) { const R = RUNES[k]; out.rune.push([k, R.name, JSON.stringify(R).slice(0, 200)]); }
  for (const c in CLASSES) out.cls.push([c, CLASSES[c].name, CLASSES[c].spd, jobTier(c), Math.round((CLASSES[c].spd - 0.8) * 8) / 2]);
  return JSON.stringify(out);
})()
