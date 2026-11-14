(() => {
  const out = {};
  H.fresh();
  const p = newParty('t', [H.adv('knight', 120).id]); S.parties = [p];
  const e = { ev: [], evN: 0, foes: [], buffs: [], field: 'thunder', area: 'field', stage: 10, mode: 'advance', encs: [1], ei: 1, sta: {}, cd: {} };
  // 2 행동 방해 저항
  const F = FIELDS.thunder; const b = fieldBoss(F, 10, 125);
  const ds = [];
  for (let i = 0; i < 5; i++) { if (b.sta) delete b.sta.stun; inflictFoe(e, b, { k: 'stun', d: 2 }, 100, 0, 'x'); ds.push(b.sta && b.sta.stun ? +b.sta.stun.toFixed(3) : 0); }
  out.dr = ds; out.res = e.ev.filter(x => x.type === 'sta' && x.res).length;
  fTick(e, b, 16); if (b.sta) delete b.sta.stun; inflictFoe(e, b, { k: 'stun', d: 2 }, 100, 0, 'x'); out.afterWin = b.sta && b.sta.stun;
  // 보통 몬스터는 그대로
  const m = foeFrom('golem', 50); for (let i = 0; i < 3; i++) { if (m.sta) delete m.sta.stun; inflictFoe(e, m, { k: 'stun', d: 2 }, 100, 0, 'x'); } out.normal = m.sta.stun;
  // 3 75% 단계
  const b2 = fieldBoss(F, 20, 130); const foes = [b2]; b2.hp = Math.floor(b2.maxHp * 0.74);
  const sumS = monSkills(b2).some(s => s.kind === 'summon');
  fPhase(e, b2, foes); out.ph0 = { sum: sumS, n: foes.length, shd: b2.shd || 0, pct: +((b2.shd || 0) / b2.maxHp).toFixed(3), ev: e.ev.filter(x => x.type === 'fphase').map(x => x.k) };
  // 부르기가 있는 우두머리
  const withSum = Object.keys(MONS).find(id => MONS[id].msk && MONS[id].msk.some(s => s.kind === 'summon') && !MONS[id].giant);
  const b3 = foeFrom(withSum, 100); b3.boss = true; const foes3 = [b3]; b3.hp = Math.floor(b3.maxHp * 0.7); fPhase(e, b3, foes3); out.ph0sum = { id: withSum, n: foes3.length, shd: b3.shd || 0 };
  // 4 무리: Lv100 넘는 땅 마릿수
  const cnt = (fid, st) => { const ee = { field: fid, area: 'field', stage: st, mode: 'advance', encs: [1, 1, 1], ei: 1 }; let t = 0; for (let i = 0; i < 400; i++) t += rollFoes(ee, 0).length; return +(t / 400).toFixed(2); };
  out.pack = { swamp20: cnt('swamp', 20), sky20: cnt('sky', 20), thunder20: cnt('thunder', 20) };
  return JSON.stringify(out);
})()
