/* 시험 도구 (빌드 69 회복 개편 측정) — 게임 안 eval로 돈다 */
window.H = (() => {
  const H = {};
  H.tierFor = lv => { let b = 0; GTIERS.forEach((G, i) => { if (G.lv <= lv && G.lv >= GTIERS[b].lv) b = i; }); return b; };
  H.fresh = () => { S = blankState('시험'); S.gold = 1e12; S.rank = 6; S.bld.training = 5; S.bld.smithy = 13; S.advs = []; S.parties = []; S.gear = []; S.log = []; return S; };
  // 장비: 그 레벨 단계(고급 q)로 낄 수 있는 모든 종류를 만들어 자동 장착
  H.gear = (a, q) => {
    const t = H.tierFor(a.lv), keep = S.gear; S.gear = [];
    const bases = [...new Set(CRAFT_IDS.concat(GTYPE_IDS))].filter(b => GTYPES[b] && !GTYPES[b].old && !GTYPES[b].el && !GTYPES[b].arena);
    for (const b of bases) {
      let tt = t; while (tt > 0 && !tierOk(b, tt)) tt = [...GTIERS.keys()].filter(i => GTIERS[i].lv < GTIERS[tt].lv).sort((x, y) => GTIERS[y].lv - GTIERS[x].lv)[0] ?? 0;
      if (!tierOk(b, tt)) continue;
      let g; try { g = gearFor(b, tt, q, a.lv); } catch (err) { continue; }
      if (g && gearFits(a, g)) S.gear.push(g);
    }
    a.status = 'idle'; autoEquip(a.id); S.gear = keep;
  };
  // 모험가: 직업 · 레벨 · 스킬 목록(없으면 고유 → 스킬북 순) · 스킬 단계 slv · 숙련도 sm(0~5) · 숙련(배울 수 있는 만큼)
  H.adv = (cls, lv, o = {}) => {
    const a = makeAdv({ cls, lv }); a.wxt = null; a.fat = 0; a.sleep = 0;
    a.traits = chainOf(cls).map(jobTraitOf).filter(Boolean);
    S.advs.push(a);
    const slots = skillSlots(a);
    let list = [CLASSES[cls].innate].concat(o.sk || []).filter((id, i, L) => SKILLS[id] && L.indexOf(id) === i && (id === CLASSES[cls].innate || canLearn(a, id)));
    if (!o.sk) {
      const own = Object.keys(SKILLS).filter(id => !SKILLS[id].cut && SKILLS[id].own && chainOf(cls).some(c => SKILLS[id].cls.includes(c)) && SKILLS[id].lv <= lv && canLearn(a, id)).sort((x, y) => SKILLS[y].lv - SKILLS[x].lv);
      const inn = chainOf(cls).map(c => CLASSES[c].innate);
      list = [...new Set(list.concat(inn.filter(id => SKILLS[id] && SKILLS[id].cls.length)).concat(own))];
    }
    a.skills = list.slice(0, slots);
    a.sl = {}; a.sm = {}; a.skills.forEach(id => { a.sl[id] = o.slv || 1; a.sm[id] = SM_STEPS[o.sm || 0]; });
    a.mast = {};
    if (o.mast !== false) MAST_IDS.forEach(k => { if (!canMast(a, k)) return; const n = MAST_TIERS.filter(T => a.lv >= T.lv && jobTier(a.cls) >= T.job).length; if (n) a.mast[k] = n; });
    H.gear(a, o.q == null ? 1 : o.q);
    const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; a.status = 'idle';
    return a;
  };
  // 회복 기록: cast를 감싸 지금 쓰는 스킬을 알고, ev를 감싸 회복 · 받은 피해를 센다
  H.cur = null; H.rec = null;
  if (!H._wrapped) {
    const _cast = cast; cast = function (e, a, d, id) { const pv = H.cur; H.cur = id; try { return _cast.apply(null, arguments); } finally { H.cur = pv; } };
    const _ev = ev; ev = function (e, type, data) {
      const R = H.rec;
      if (R && data) {
        if (type === 'heal') { const x = advById(data.d); const raw = data.v || 0; let eff = raw; if (x) { const prev = R.snap[x.id]; if (prev != null) eff = Math.max(0, Math.min(raw, x.hp - prev)); R.snap[x.id] = x.hp; }
          const k = data.rg ? 'regen' : (H.cur ? H.cur : (data.s === data.d ? 'leech' : 'pdrain')); const r = R.heal[k] || (R.heal[k] = { raw: 0, eff: 0, n: 0 }); r.raw += raw; r.eff += eff; r.n++; R.hraw += raw; R.heff += eff; }
        else if (type === 'hurt') { R.taken += data.v || 0; const x = advById(data.d); if (x) R.snap[x.id] = x.hp; }
        else if (type === 'down') R.downs++;
        else if (type === 'revive') R.revives++;
        else if (type === 'kill') R.kills++;
      }
      return _ev.apply(null, arguments);
    };
    H._wrapped = 1;
  }
  H.newRec = () => ({ heal: {}, hraw: 0, heff: 0, taken: 0, downs: 0, revives: 0, kills: 0, snap: {}, fights: 0, fightT: 0 });
  // 원정 밀기: fid 필드 stage부터 safe 끔 · 물약 없음 · 전멸 · 끝 · secs까지
  H.push = (team, fid, stage, secs, o = {}) => {
    const p = newParty('시험대', team.map(a => a.id)); S.parties = [p];
    p.sup = o.sup || {}; p.safe = false; p.auto = false; p.campNight = false; p.dmode = o.dmode || 'enter'; p.autoBuy = false; S.fields[fid].cleared = false; S.fields[fid].found = false;
    team.forEach(a => { a.status = 'idle'; a.inj = null; a.down = false; const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; a.fat = 0; a.sleep = 0; });
    formParty(p);
    p.exp = newExp(fid, Object.assign({}, p.sup), stage);
    team.forEach(a => { refillAmmo(a); a.status = 'away'; });
    const R = H.newRec(); H.rec = R;
    let t = 0, maxSt = stage, inF = false, reach = fieldLv(FIELDS[fid], stage); const dt = o.dt || 0.2; const e = p.exp;
    while (p.exp && t < secs) {
      teamOf(p).forEach(a => { R.snap[a.id] = a.hp; });
      stepExp(p, dt); t += dt;
      if (p.exp) { const ex = p.exp, zl = ex.area === 'dungeon' ? dungeonLv(FIELDS[fid], ex.stage) : fieldLv(FIELDS[fid], ex.stage); reach = Math.max(reach, zl); if (ex.area !== 'dungeon') maxSt = Math.max(maxSt, ex.stage); const f = ex.foes.length > 0; if (f && !inF) R.fights++; if (f) R.fightT += dt; inF = f; }
      if (S.fields[fid].cleared) { reach = Math.max(reach, dungeonBossLv(FIELDS[fid]) + 1); break; }
    }
    H.rec = null;
    const F = FIELDS[fid];
    return { t: Math.round(t), stage: maxSt, flv: reach, cleared: !!S.fields[fid].cleared, wiped: !p.exp && !!(p.last && p.last.wiped), still: !!p.exp, R };
  };
  return H;
})();
