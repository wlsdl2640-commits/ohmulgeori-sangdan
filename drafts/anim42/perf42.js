window.PERF = () => { if (!S) S = blankState();
  V.fx = []; V.mot = {}; V.motLast = {}; V.skSeen = {}; V.flash = {}; V.flash0 = {}; V.atk = {}; V.jump = {}; V.fall = {}; V.lunge = {}; V.lastN = 0; V.dir = 1;
  const cls = ['archer', 'mage', 'rogue', 'dragoon', 'cleric', 'bard'], team = cls.map((c, i) => { const a = makeAdv({ cls: c, lv: 60 }); a.id = 700 + i; a.hp = 100; return a; }); S.advs = team.slice();
  const foes = ['bandit', 'wolf', 'slime'].map((m, i) => ({ uid: 50 + i, id: m, hp: 100, maxHp: 100, sc: 0 }));
  const pos = {}; team.forEach((x, i) => { pos['a' + x.id] = SLOT_P[i].slice(); }); foeSlots(foes).forEach(([x, y], i) => { pos['f' + foes[i].uid] = [x, y]; }); Object.assign(V.last, pos);
  const c = document.createElement('canvas'); c.width = 240; c.height = 200; const g = c.getContext('2d');
  const sk = { archer: ['rain', 'aimed', 'double'], mage: ['fireball', 'meteor', 'chain'], rogue: ['shadow', 'backstab'], dragoon: ['jump'], cleric: ['holy', 'smite'], bard: ['lullaby'] };
  let n = 1, t0 = performance.now(), t = 10, frames = 0, maxMs = 0;
  for (let k = 0; k < 600; k++) {
    t += 1 / 60;
    if (k % 12 === 0) { const a = team[(k / 12) % 6 | 0], ss = sk[a.cls], useSk = (k / 12) % 3 === 0, id = useSk ? ss[(k / 36 | 0) % ss.length] : null, s = id && SKILLS[id], ev = [];
      if (id) ev.push({ n: n++, type: 'skill', s: a.id, id });
      const kk = s ? (s.fx || (s.kind === 'mdmg' ? 'magic' : CLASSES[a.cls].act === 'arrow' ? 'arrow' : 'melee')) : (CLASSES[a.cls].act === 'magic' ? 'magic' : CLASSES[a.cls].act === 'arrow' ? (a.cls === 'bard' ? 'note' : 'arrow') : 'melee');
      const tg = s && s.tgt === 'all' ? foes : [foes[0]];
      for (const f of tg) for (let h = 0; h < ((s && s.hits) || 1); h++) ev.push(Object.assign({ n: n++, type: 'hit', s: a.id, d: f.uid, v: 30, k: kk }, id ? { sid: id } : { b: 1 }));
      events({ foes, ev }, pos, t, team, { id: 1, name: 'x', members: team.map(x => x.id) }); }
    const f0 = performance.now();
    for (const a of team) { const [x0, y0] = pos['a' + a.id], z = zAt(y0), mo = motNow(a, t); g.save(); g.translate(x0, y0); drawAdv(g, a, t, { mot: mo, z, side: 1 }); g.restore(); if (mo) motFx(g, a, mo, x0, y0, z, 1, t); }
    fx(g, t); const ms = performance.now() - f0; if (k > 60) maxMs = Math.max(maxMs, ms); frames++;
  }
  return { avgMs: +((performance.now() - t0) / frames).toFixed(2), maxMs: +maxMs.toFixed(1), cache: PXC.size, fx: V.fx.length };
};
