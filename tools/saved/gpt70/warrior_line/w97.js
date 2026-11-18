/* 전사 계열 그림 모음: 직업 · 스킬 그림 · 장비 그림(무기 · 부장비 · 방어구) — 실제 게임 함수 */
window.W97 = (() => {
  const W = {};
  W.line = ['warrior', 'gladiator', 'champion', 'knight', 'paladin', 'berserker', 'bloodlord', 'spellblade', 'arcblade'];
  W.jobs = () => W.line.map(c => { const sk = c === 'warrior'
      ? SKILL_IDS.filter(id => { const j = skJob(id); return j.kind === 'line' && (j.fams || []).includes('warrior'); })
      : SKILL_IDS.filter(id => !SKILLS[id].cut && (SKILLS[id].cls || []).includes(c));
    sk.sort((x, y) => (SKILLS[x].lv || 0) - (SKILLS[y].lv || 0));
    return { c, name: CLASSES[c].name, tier: jobTier(c), from: JOB_PARENT[c] || null, desc: CLASSES[c].desc, weapon: WEAPON_OF[c] ? GTYPES[WEAPON_OF[c]].name : null, off: typeof shieldOf === 'function' && shieldOf(c) ? GTYPES[shieldOf(c)].name : null,
      skills: sk.map(id => ({ id, name: SKILLS[id].name, lv: SKILLS[id].lv || 1, kind: SKILLS[id].kind || 'passive', cells: skiCells(id), other: (SKILLS[id].cls || []).filter(x => jobBase(x) !== 'warrior') })) }; });
  W.gear = b => { const T = GTYPES[b], out = [];
    const big = T.art && ((typeof ARMART !== 'undefined' && ARMART[T.art]) || (typeof HDART !== 'undefined' && HDART[T.art]) || GEARART[T.art]);
    const nImg = big ? big.length : (typeof WICON !== 'undefined' && WICON[b]) ? WICON[b].length : 0;
    const one = (t, lv, note) => { const g = makeGear(b, t, 0, lv == null ? undefined : lv); return { t, lv: gearReqLv(g), name: gearBaseName(g), u: gearIconURL(g), big: !!armArtURL(g), idx: big || nImg ? artIdx(g) : null, note }; };
    if (UNIQ_ONLY[b] != null) { const g = makeGear(b, GTIERS.length - 1, 0); out.push({ t: null, lv: UNIQ_ONLY[b], name: (WNAME[b] || [T.name])[0], u: gearIconURL(g), big: false, idx: 0, note: uniqOnlyTier(b) < 0 ? '아직 안 나옴' : '' }); }
    else if (LADDER_B[b]) {
      const n = nImg || ARM_LADDER.filter(L => ladderOn(L)).length;
      for (let k = 0; k < Math.min(n, ARM_LADDER.length); k++) { const L = ARM_LADDER[k]; if (!nImg && !ladderOn(L)) continue;
        out.push(one(lvTier(L), L, L === 50 ? '대장간에서만' : ladderOn(L) ? '' : '아직 안 나옴')); }
    } else {
      const used = new Set();
      for (let t = 0; t < GTIERS.length; t++) { if (!tierOk(b, t)) continue; const it = one(t, null, ''); if (it.idx != null) used.add(it.idx); out.push(it); }
      if (big) big.forEach((u, i) => { if (!used.has(i)) out.push({ t: null, lv: null, name: (typeof WNAME !== 'undefined' && WNAME[b] && WNAME[b][i]) || null, u, big: true, idx: i, note: '아직 안 나옴' }); });
    }
    const who = W.line.filter(c => clsFits({ cls: c }, b)).map(c => CLASSES[c].name);
    return { b, name: T.name, slot: T.slot, who, items: out, ladder: !!LADDER_B[b], nImg, desc: T.who || '' };
  };
  return W;
})();
