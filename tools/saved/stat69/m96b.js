(() => {
  const ids = Object.keys(SKILLS).filter(id => !SKILLS[id].cut && SKILLS[id].cls && SKILLS[id].cls.length);
  const kinds = {}, tgts = {}, fx = {}; let multi = 0, projMulti = 0, all = 0, summ = [], dur = 0, heal = 0;
  for (const id of ids) { const s = SKILLS[id]; kinds[s.kind] = (kinds[s.kind] || 0) + 1; if (s.tgt) tgts[s.tgt] = (tgts[s.tgt] || 0) + 1; if (s.fx) fx[s.fx] = (fx[s.fx] || 0) + 1;
    if ((s.hits || 1) > 1) { multi++; if (/arrow|dart|orb|shard|bolt/.test(s.fx || '') || s.thrown || s.bolt) projMulti++; }
    if (s.tgt === 'all') all++; if (/summon|pet|wolf|spirit|skeleton|undead/.test((s.kind || '') + ' ' + (s.fx || '') + ' ' + id)) summ.push(id + ':' + s.kind);
    if (s.dur) dur++; if (s.kind === 'heal' || s.kind === 'regen') heal++; }
  return JSON.stringify({ n: ids.length, kinds, tgts, fx, multi, projMulti, all, dur, heal, summ: summ.slice(0, 30), SK_LV_MAX, CAST_GAP, BASIC_CD, COMBO_MAX, statKeys: STAT_KEYS, bonusQ: BONUS_Q });
})()
