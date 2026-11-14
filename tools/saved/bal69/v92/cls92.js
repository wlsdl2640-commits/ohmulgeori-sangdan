(() => {
  const r = {};
  for (const id of ALL_CLASS_IDS) { const C = CLASSES[id]; if (!C) continue; const t = C.tier || jobTier(id); (r[t] = r[t] || []).push([id, C.name, jobBase(id), C.act || '', isPorter ? (jobBase(id) === 'porter' ? 'P' : '') : '']); }
  return JSON.stringify(r);
})()
