(() => {
  const out = {};
  H.fresh();
  const pal = H.adv('paladin', 100, { slv: 5, sm: 5 }), hk = H.adv('hawkeye', 100, { slv: 5, sm: 5 }), am = H.adv('archmage', 100, { slv: 5, sm: 5 });
  const ab = H.adv('archbishop', 100, { sk: ['restore', 'sacredsong'], slv: 5, sm: 5 });
  const ph = H.adv('physician', 100, { sk: ['cureall', 'revival'], slv: 5, sm: 5 });
  const team = [pal, hk, am, ab, ph];
  const p = newParty('시험대', team.map(a => a.id)); S.parties = [p]; p.safe = false; p.auto = false;
  team.forEach(a => { const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; a.status = 'away'; });
  p.exp = newExp('sky', {}, 1);
  let n = 0; while (p.exp && !p.exp.foes.length && n++ < 2000) stepExp(p, 0.2);
  const e = p.exp, foes = e.foes.filter(f => f.hp > 0), dm = {}; team.forEach(a => { dm[a.id] = derive(a); });
  const setHp = fr => team.forEach((a, i) => { a.hp = Math.round(dm[a.id].maxHp * fr[i]); });
  const tryPick = (a, fr) => { setHp(fr); e.scd[a.id] = {}; e.buffs = []; return pickSkill(a, dm[a.id], team, dm, foes, e); };
  const tryCast = (a, id, fr) => { setHp(fr); e.buffs = []; e.scd[a.id] = e.scd[a.id] || {}; const before = team.map(x => x.hp); cast(e, a, dm[a.id], id, team, dm, foes); return { healed: team.map((x, i) => x.hp - before[i]), regen: e.buffs.filter(b => b.stat === 'regen').map(b => [team.findIndex(x => x.id === b.to), Math.round(b.add), b.t]) }; };
  out.foes = foes.length;
  // 대주교: 회복의 빛 · 소생의 기도
  out.pick = {
    full: tryPick(ab, [1, 1, 1, 1, 1]),
    one55: tryPick(ab, [0.55, 1, 1, 1, 1]),
    two65: tryPick(ab, [0.65, 0.68, 1, 1, 1]),
    one35: tryPick(ab, [0.35, 1, 1, 1, 1]),
    two35: tryPick(ab, [0.35, 0.3, 1, 1, 1])
  };
  out.restore = tryCast(ab, 'restore', [0.5, 0.6, 0.9, 1, 0.95]);
  out.sacred = tryCast(ab, 'sacredsong', [0.3, 0.35, 0.39, 0.5, 0.95]);
  // 명의: 명의의 손 · 생명의 축복 (urgent)
  out.pickP = {
    full: tryPick(ph, [1, 1, 1, 1, 1]),
    one80: tryPick(ph, [0.8, 1, 1, 1, 1]),
    one55: tryPick(ph, [0.55, 1, 1, 1, 1]),
    two65: tryPick(ph, [0.65, 0.68, 1, 1, 1])
  };
  out.cureall = tryCast(ph, 'cureall', [0.5, 0.6, 0.9, 1, 0.95]);
  // 이미 명의의 손 재생이 걸린 탱커 → 다음 사람에게
  setHp([0.5, 0.6, 0.9, 1, 0.95]); e.buffs = [{ sid: 'cureall@' + pal.id, to: pal.id, stat: 'regen', add: 100, t: 4 }]; cast(e, ph, dm[ph.id], 'cureall', team, dm, foes);
  out.cureall2 = e.buffs.filter(b => b.stat === 'regen').map(b => [team.findIndex(x => x.id === b.to), Math.round(b.add), b.t]);
  out.revival = tryCast(ph, 'revival', [0.5, 0.6, 0.9, 1, 0.95]);
  out.maxHp = team.map(a => dm[a.id].maxHp);
  return JSON.stringify(out);
})()
