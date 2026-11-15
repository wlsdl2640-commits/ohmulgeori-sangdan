(() => {
  const out = {};
  // 새 게임은 알림 없음, 옛 저장(플래그 없음)은 알림 하나
  const fl = blankState('시험 상단').flags; out.newGame = !!fl.v69h;
  const keep = S.flags.v69h; delete S.flags.v69h; const n0 = S.modals.length; notes69h(); out.oldSave = S.modals.length - n0; out.title = S.modals.length ? S.modals[S.modals.length - 1].title : null; out.body = S.modals.length ? S.modals[S.modals.length - 1].body : null; S.flags.v69h = keep;
  // 숙련도: 한 번 쓸 때 PACE69_SM
  H.fresh(); const a = H.adv('archmage', 60, { slv: 1, sm: 0 }); a.sm = {};
  const p = newParty('시험', [a.id]); S.parties = [p]; p.safe = false; p.auto = false; a.status = 'away'; p.exp = newExp('swamp', {}, 1);
  let n = 0; while (p.exp && !p.exp.foes.length && n++ < 3000) stepExp(p, 0.2);
  const e = p.exp, foes = e.foes.filter(f => f.hp > 0), d = derive(a), dm = { [a.id]: d };
  e.scd[a.id] = {}; cast(e, a, d, a.skills.find(id => SKILLS[id] && SKILLS[id].kind === 'mdmg') || a.skills[0], [a], dm, foes);
  out.smAfterOne = a.sm;
  return JSON.stringify(out);
})()
