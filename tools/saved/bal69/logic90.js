(() => {
  const out = [], ok = (c, m) => out.push((c ? 'OK  ' : 'FAIL') + ' ' + m);
  H.fresh();
  // 상한
  const a1 = H.adv('hawkeye', 150, { q: 4 }), d1 = derive(a1);
  ok(d1.eva <= 0.5 + 1e-9 && d1.crit <= 0.5 + 1e-9, `신궁 Lv150 회피 ${d1.eva} 치명 ${d1.crit} ≤ 50%`);
  ok(d1.critDmg > 0 && d1.critDmg <= CAP.critDmg + 1e-9, `넘친 치명 → 치명 피해 ${d1.critDmg}`);
  ok(Math.abs(capCrit(d1, 0.3) - 0.5) < 1e-9 && critBonus(d1, 0.3) <= CAP.critDmg + 1e-9, 'capCrit · critBonus');
  // 몬스터 데이터
  ok(MONS.spider.hits === 3 && MONS.wolf.hits === 2 && MONS.ratking.sta2 && MONS.ratking.msk.length === 4, '연타 · 둘째 상태이상 · 우두머리 스킬 넷');
  ok(MONS.golem.msk.some(s => s.kind === 'taunt') && MONS.skelmage.msk.some(s => s.kind === 'dispel') && MONS.imp.msk.some(s => s.mp) && MONS.rat.msk.some(s => s.tg === 'low') && MONS.kobold.msk.some(s => s.pen), '새 틀 다섯');
  ok(monMul69(100).hp === 2.3 && monMul69(12).hp === 1.1 && Math.abs(monMul69(98).hp - 1.8) < 1e-9, `배율 Lv12 ${monMul69(12).hp} · 98 ${monMul69(98).hp} · 100 ${monMul69(100).hp}`);
  ok(foeFrom('kingslime', 150).hp === Math.round(mHp(MONS.kingslime, 150) * DIFF.hp), '레이드 거인은 배율 없음');
  // 싸움 한 판: 연타 사건(hn) · 도발 · 강화 지우기 · 마나 태우기
  const team = [H.adv('knight', 60, {}), H.adv('sniper', 60, {}), H.adv('sorcerer', 60, {}), H.adv('priest', 60, {})];
  const p = newParty('시험대', team.map(a => a.id)); S.parties = [p]; p.safe = false;
  team.forEach(a => { a.status = 'away'; const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; });
  formParty(p);
  p.exp = newExp('swamp', {}, 1);
  const e = p.exp; e.ev = []; e.evN = 0;
  const seen = {}; const _ev = ev;
  // 몬스터를 직접 세운다: 거머리(2연타) · 켈피 · 세이렌(마나 태우기) + 도발 쓰는 골렘
  e.foes = [foeFrom('leech', 60), foeFrom('siren', 60), foeFrom('golem', 60)];
  e.foes.forEach(f => { f.mcd = {}; (MONS[f.id].msk || []).forEach(s => { f.mcd[s.id] = 0; }); });
  const dm = {}; team.forEach(a => { dm[a.id] = derive(a); });
  // 버프를 깔아 두고 강화 지우기 시험
  e.buffs.push({ sid: 't1', to: team[0].id, stat: 'atk', mult: 1.2, t: 30 }, { sid: 't2', to: team[0].id, stat: 'def', mult: 1.2, t: 30 }, { sid: 't3', to: 'party', stat: 'atk', mult: 1.1, t: 30 });
  const dz = MONS.golem.msk.find(s => s.kind === 'taunt');
  const g = e.foes[2]; e.foes[2].mcd = {}; MONS.golem.msk.forEach(s => { g.mcd[s.id] = 99; }); g.mcd[dz.id] = 0;
  // 강제로 도발을 고르게: 다른 스킬 대기
  const live = team.filter(up);
  const took = fSkill(p, e, g, e.foes, live, dm);
  ok(took && g.ftaunt > 0 && frontFoe(e.foes) === g && lowAwake(e.foes) === g, `도발: ftaunt ${g.ftaunt} · 앞 · 약한 적 고르기 모두 골렘`);
  const sk = { id: 'dispel0', name: '시험 지우기', kind: 'dispel', mult: 0.1, cd: 1, n: 2, self: 1 };
  MONS.siren.msk.push(sk); const s0 = e.foes[1]; s0.mcd = {}; MONS.siren.msk.forEach(s => { s0.mcd[s.id] = 99; }); s0.mcd.dispel0 = 0;
  const nb0 = e.buffs.length; fSkill(p, e, s0, e.foes, live, dm); MONS.siren.msk.pop();
  ok(!e.buffs.some(b => b.sid === 't1' || b.sid === 't2' || b.sid === 't3'), `강화 지우기: 버프 ${nb0} → ${e.buffs.length}`);
  // 마나 태우기
  const mpk = MONS.siren.msk.find(s => s.mp); s0.mcd = {}; MONS.siren.msk.forEach(s => { s0.mcd[s.id] = 99; }); s0.mcd[mpk.id] = 0;
  const mage = team[2]; const mp0 = mage.mp; let burned = false;
  for (let i = 0; i < 20 && !burned; i++) { s0.mcd[mpk.id] = 0; mage.mp = mp0; fSkill(p, e, s0, e.foes, live, dm); burned = e.ev.some(x => x.type === 'mpburn'); }
  ok(burned, '마나 태우기 사건');
  // 연타: 기본 공격 사건 hn
  e.ev = []; const lf = e.foes[0]; const tgt = team[0];
  for (let i = 0; i < 30; i++) { const nh = MONS.leech.hits; const once = {}; for (let h = 0; h < nh && up(tgt); h++) hitAdv(p, e, lf, tgt, HITS_MUL[nh], dm, { hn: h, once }); tgt.hp = dm[tgt.id].maxHp; }
  const hs = e.ev.filter(x => (x.type === 'hurt' || x.type === 'miss') && x.s === lf.uid);
  ok(hs.some(x => x.hn === 1), `연타 사건: 한 대째 hn 1 (${hs.length}개)`);
  // 둘째 상태이상: 우두머리 sta2
  ok(!!MONS.swampwitch.sta2 && STATUS[MONS.swampwitch.sta2.k], '마녀 둘째 상태이상 ' + MONS.swampwitch.sta2.k);
  // hitAdv 반환
  const r1 = hitAdv(p, e, lf, tgt, 1, dm, { skill: 1 });
  ok(r1 === true, 'hitAdv 맞으면 true');
  // 이길 수 없는 싸움: 회복하는 몬스터
  e.fheal = 0; e.hpS = null;
  return out.join('\n');
})()
