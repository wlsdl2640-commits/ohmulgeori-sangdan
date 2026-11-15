/* 스킬 재사용 · 기본 공격 빠르기 비교 (빌드 69, 11-15 20:20 사용자 「모든 스킬의 기본 쿨타임을 더 늘려보자. 기본공격의 쿨타임은 줄이고」 — 내 측정, 시험 묶음 아님)
   window.PACE = { k 스킬 재사용 ×, B 기본 공격 초(BASIC_CD 대신), dw 강화 · 도발 · 지속 피해 지속 ×, pw 공격 스킬 세기 ×, hw 치유 · 재생 · 보호막 세기 ×, gap 스킬 사이 간격(초) }
   s.cd0 · s.dur0 · s.mult0(data-pace69.js가 남긴 값, 없으면 지금 값)에서 다시 매긴다.
   window.SIM_ONLY(단계) · SIM_COMPS(파티) · SIM_N · SIM_SECS · SIM_ST([[스킬 단계, 숙련도]]) — sim91.js와 같은 파티 표
   → [{ tier, comp, slv, sm, runs: [{ flv, wiped, cleared, t, taken, heff, downs, fightT, dmg {basic, skill, dot, extra}, casts {직업: n}, basics, mp {직업: 평균 %}, ammo }] }] */
(() => {
  const P = Object.assign({ k: 1, B: 0, dw: 1, pw: 1, hw: 1, gap: 0 }, window.PACE || {});
  const DUR_K = ['buff', 'taunt', 'dot'], POW_K = ['dmg', 'mdmg', 'dot'], HEAL_K = ['heal', 'regen', 'shield'];
  if (!P.built && P.heal0 && typeof CLERIC69_OLD !== 'undefined') { ['heal', 'prayer'].forEach(id => { const s = SKILLS[id]; if (s.mult0 === undefined) s.mult0 = s.mult; s.mult0 = CLERIC69_OLD[id].mult; s.mult = s.mult0; }); }   // 치유 · 기도를 작게 하지 않은 판
  if (!P.built) for (const id in SKILLS) {   // built: 페이지에 넣은 값 그대로 (다시 매기지 않음)
    const s = SKILLS[id];
    if (s.cd0 === undefined) s.cd0 = s.cd; if (s.dur0 === undefined) s.dur0 = s.dur; if (s.mult0 === undefined) s.mult0 = s.mult;
    const tierA = Math.max(0, Math.min(4, (typeof skJob === 'function' && skJob(id) && skJob(id).tier) || 0));
    if (s.cd0) s.cd = s.cd0 * (P.cdT ? P.cdT[tierA] : P.k);
    if (s.dur0 && DUR_K.includes(s.kind)) s.dur = s.dur0 * (P.cdT ? P.cdT[tierA] : P.dw);
    [s.after, s.after2].forEach(A2 => { if (A2 && A2.dur && A2.stat !== 'ground') { if (A2.dur0 === undefined) A2.dur0 = A2.dur; A2.dur = A2.dur0 * (P.cdT ? P.cdT[tierA] : P.dw); } });
    const tier = Math.max(0, Math.min(4, (typeof skJob === 'function' && skJob(id) && skJob(id).tier) || 0));   // 차수 (공용 0 · 1차 1 … 4차 4)
    if (P.sw) { [s.sta, s.sta2].forEach(st => { if (st && st.d) { if (st.d0 === undefined) st.d0 = st.d; st.d = st.d0 * P.sw; } }); if (s.slow) { if (s.slow0 === undefined) s.slow0 = s.slow; s.slow = s.slow0 * P.sw; } }   // 스킬이 거는 상태이상 · 느려짐 지속 ×
    if (s.mult0 && POW_K.includes(s.kind)) s.mult = s.mult0 * P.pw * (P.pwT ? P.pwT[tier] : 1);
    if (s.mult0 && HEAL_K.includes(s.kind) && s.tgt !== 'self') s.mult = s.mult0 * P.hw * (P.hwT ? P.hwT[tier] : 1);
    if (P.hwp && HEAL_K.includes(s.kind) && s.pct) { if (s.pct0 === undefined) s.pct0 = s.pct; s.pct = s.pct0 * P.hw * (P.hwT ? P.hwT[tier] : 1); }   // 최대 HP % 회복 · 보호막(자기 회복 포함)도
  }
  if (P.B8) {   // 기본 공격 = max(floor, base − 직업 − 차수 − 민첩 − 빠르기 효과 − 강화) × 추위 · 기본 공격 피해 × F
    const Q = window.__B8 = Object.assign({ base: 8, floor: 1.5, cls: 1, tier: 1, agi: 0.03, agiStep: 10, pct: 5, buff: 5, F: 1, clsT: null }, P.B8);
    window.__bcd8 = (a, d, e) => {
      const C = CLASSES[a.cls], agi = d.T.agi, sp = Math.max(0, d.spd / (C.spd * (1 + agi * 0.004)) - 1);
      const rc = Q.clsT ? (Q.clsT[a.cls] != null ? Q.clsT[a.cls] : 0) : Math.round((C.spd - 0.8) * 8) / 2 * Q.cls;
      const r = rc + (jobTier(a.cls) - 1) * Q.tier + Math.floor(agi / Q.agiStep) * Q.agi + sp * Q.pct + (buffMul(e, a.id, 'spd') - 1) * Q.buff;
      return Math.max(Q.floor, Q.base - r) * (d.wxBa || 1);
    };
    PATCH('battle', 'e.cd[a.id] = basicCd(a, d, e) * (0.95 + rnd() * 0.1);', 'e.cd[a.id] = window.__bcd8(a, d, e) * (0.95 + rnd() * 0.1);');
    PATCH('basicAct', '* BASIC_MAGIC, v = hitFoe(', '* BASIC_MAGIC * window.__B8.F, v = hitFoe(');
    PATCH('basicAct', ')) * BASIC_MULT * (i === 0 && NX', ')) * BASIC_MULT * window.__B8.F * (i === 0 && NX');
    PATCH('basicAct', '* (0.35 + T.pet) * BASIC_MULT *', '* (0.35 + T.pet) * BASIC_MULT * window.__B8.F *');
    PATCH('offShot', 'atk * BASIC_MULT * (T.thrown', 'atk * BASIC_MULT * window.__B8.F * (T.thrown');
  }
  if (P.B) PATCH('battle', 'e.cd[a.id] = basicCd(a, d, e) * (0.95 + rnd() * 0.1);', 'e.cd[a.id] = basicCd(a, d, e) * window.__PB * (0.95 + rnd() * 0.1);');
  window.__PB = P.B ? P.B / BASIC_CD : 1;
  if (P.gap) PATCH('battle', 'e.gcd[a.id] = CAST_GAP;', 'e.gcd[a.id] = window.__PG;');
  window.__PG = P.gap || CAST_GAP;
  // 기록: 피해 갈래 · 스킬 수 · 기본 공격 수 · MP · 화살
  let D = null;
  if (!window.__W99) {
    window.__W99 = 1;
    const ev1 = ev; ev = function (e, k, x) {
      if (D && x) {
        if (k === 'hit' && x.v > 0) { const g = x.b ? 'basic' : x.dot ? 'dot' : (x.sid === 'shuri' || x.sid === 'bolt' || x.ctr || x.k === 'pet' || x.sid === 'reflect') ? 'extra' : x.sid ? 'skill' : 'extra'; D.dmg[g] += x.v; if (x.b) D.basics++; }
        else if (k === 'skill') { const a = advById(x.s); if (a) D.casts[a.cls] = (D.casts[a.cls] || 0) + 1; }
      }
      return ev1.apply(this, arguments);
    };
    const ua = useAmmo; useAmmo = function (g, a, n) { if (D) D.ammo += (n == null ? 1 : n); return ua.apply(this, arguments); };
    let sc = 0; const se = stepExp; stepExp = function (p, dt) { if (D && p.exp && p.exp.foes.length) { D.ft += dt; if (++sc % 5 === 0) teamOf(p).forEach(a => { const d = derive(a); D.mp[a.cls] = (D.mp[a.cls] || 0) + a.mp / Math.max(1, d.maxMp) * dt * 5; }); } return se.apply(this, arguments); };
    window.__D99 = v => { D = v; };
  }
  const B = {
    warrior30: ['warrior', ['bash', 'taunt', 'ironwall', 'ironskin', 'sweep']],
    archer30: ['archer', ['aimed', 'double', 'poisonarrow', 'rain', 'piercing']],
    mage30: ['mage', ['fireball', 'icelance', 'chain', 'burst', 'iceprison']],
    cleric30: ['cleric', ['heal', 'massheal', 'chant', 'bless', 'holy']],
    rogue30: ['rogue', ['backstab', 'smoke', 'venom', 'parasting', 'shadow']],
    warrior12: ['warrior', ['bash', 'taunt', 'ironwall']], archer12: ['archer', ['aimed', 'double', 'poisonarrow']], mage12: ['mage', ['fireball', 'icelance', 'chain']], cleric12: ['cleric', ['heal', 'massheal', 'bless']], rogue12: ['rogue', ['backstab', 'smoke', 'venom']],
    warrior20: ['warrior', ['bash', 'taunt', 'ironwall', 'ironskin']], archer20: ['archer', ['aimed', 'double', 'poisonarrow', 'rain']], mage20: ['mage', ['fireball', 'icelance', 'chain', 'burst']], cleric20: ['cleric', ['heal', 'massheal', 'bless', 'holy']], rogue20: ['rogue', ['backstab', 'smoke', 'venom', 'parasting']],
    knight60: ['knight', ['shieldbash', 'taunt', 'provoke', 'ironwall', 'guardian', 'sweep']],
    sniper60: ['sniper', ['headshot', 'aimed', 'double', 'rain', 'piercing', 'steadyaim']],
    sorc60: ['sorcerer', ['arcanebolt', 'fireball', 'chain', 'meteor', 'thunderclap', 'blizzard']],
    priest60: ['priest', ['prayer', 'heal', 'massheal', 'greatheal', 'grace', 'chant']],
    plague60: ['plaguedoc', ['miasma', 'heal', 'remedy', 'massheal', 'greatheal', 'chant']],
    assassin60: ['assassin', ['assassinate', 'backstab', 'shadow', 'venom', 'poisonblade', 'blades']],
    berserker60: ['berserker', ['bloodstrike', 'whirl', 'bloodthirst', 'sweep', 'berserk', 'guardian']],
    necro60: ['necromancer', ['drain', 'fireball', 'curse', 'chain', 'meteor', 'blizzard']],
    paladin100: ['paladin', ['holystrike', 'shieldbash', 'taunt', 'provoke', 'fortress', 'guardian', 'rally', 'judgment', 'ironwall']],
    hawkeye100: ['hawkeye', ['divinearrow', 'headshot', 'aimed', 'rain', 'piercing', 'steadyaim', 'longshot', 'piercearrow', 'stormarrows']],
    archmage100: ['archmage', ['arcanestorm', 'arcanebolt', 'fireball', 'chain', 'meteor', 'thunderclap', 'blizzard', 'meteorfall', 'disintegrate']],
    archb100: ['archbishop', ['miracle', 'prayer', 'heal', 'massheal', 'greatheal', 'revival', 'restore', 'sacredsong', 'grace']],
    phys100: ['physician', ['cureall', 'heal', 'remedy', 'massheal', 'greatheal', 'revival', 'panacea', 'miasma', 'chant']],
    shadow100: ['shadowlord', ['shadowstep', 'assassinate', 'backstab', 'shadow', 'blades', 'throatcut', 'shadowclone', 'poisonblade', 'vanish']],
    blood100: ['bloodlord', ['bloodfeast', 'bloodstrike', 'whirl', 'bloodthirst', 'bloodmoon', 'rampage', 'guardian', 'sweep', 'frenzy']],
    lich100: ['lich', ['soulrend', 'drain', 'curse', 'chain', 'meteor', 'blizzard', 'deathwave', 'raise', 'lichmind']],
    paladin146: ['paladin', ['holystrike', 'shieldbash', 'provoke', 'fortress', 'guardian', 'rally', 'judgment', 'layhands', 'aegis', 'devotion']],
    hawkeye146: ['hawkeye', ['divinearrow', 'headshot', 'rain', 'piercing', 'steadyaim', 'longshot', 'piercearrow', 'stormarrows', 'starfall', 'godseye']],
    archmage146: ['archmage', ['arcanestorm', 'arcanebolt', 'chain', 'meteor', 'blizzard', 'meteorfall', 'disintegrate', 'amplify', 'gravity', 'ultima']],
    archb146: ['archbishop', ['miracle', 'prayer', 'greatheal', 'revival', 'restore', 'sacredsong', 'grace', 'resurrect', 'dawnlight', 'massheal']],
    phys146: ['physician', ['cureall', 'remedy', 'greatheal', 'revival', 'panacea', 'regenall', 'elixir', 'surgeon', 'massheal', 'miasma']],
    shadow146: ['shadowlord', ['shadowstep', 'assassinate', 'shadow', 'blades', 'throatcut', 'shadowclone', 'poisonblade', 'shadowstorm', 'soulreap', 'eclipse']],
    blood146: ['bloodlord', ['bloodfeast', 'bloodstrike', 'whirl', 'bloodthirst', 'bloodmoon', 'rampage', 'guardian', 'frenzy', 'bloodlust', 'ragnarok']],
    lich146: ['lich', ['soulrend', 'drain', 'curse', 'chain', 'meteor', 'blizzard', 'deathwave', 'raise', 'lichmind', 'deathplague']]
  };
  const T = {
    12: { lv: 12, fid: 'forest', st: 13, comps: { 힐러근접: ['warrior12', 'rogue12', 'archer12', 'cleric12'], 힐러: ['warrior12', 'archer12', 'mage12', 'cleric12'], 힐러없음: ['warrior12', 'archer12', 'mage12', 'rogue12'] } },
    20: { lv: 20, fid: 'mountain', st: 9, comps: { 힐러근접: ['warrior20', 'rogue20', 'archer20', 'cleric20'], 힐러: ['warrior20', 'archer20', 'mage20', 'cleric20'], 힐러없음: ['warrior20', 'archer20', 'mage20', 'rogue20'] } },
    30: { lv: 30, fid: 'valley', st: 13, comps: { 힐러근접: ['warrior30', 'rogue30', 'archer30', 'cleric30'], 힐러: ['warrior30', 'archer30', 'mage30', 'cleric30'], 힐러없음: ['warrior30', 'archer30', 'mage30', 'rogue30'] } },
    45: { lv: 45, fid: 'desert', st: 1, comps: { 힐러근접: ['warrior30', 'rogue30', 'archer30', 'cleric30'], 힐러: ['warrior30', 'archer30', 'mage30', 'cleric30'], 힐러없음: ['warrior30', 'archer30', 'mage30', 'rogue30'] } },
    60: { lv: 60, fid: 'swamp', st: 25, comps: { 힐러근접: ['knight60', 'assassin60', 'sniper60', 'priest60'], 사제: ['knight60', 'sniper60', 'sorc60', 'priest60'], 역병의사: ['knight60', 'sniper60', 'sorc60', 'plague60'], 힐러없음: ['knight60', 'sniper60', 'sorc60', 'assassin60'], 흡혈: ['knight60', 'berserker60', 'sniper60', 'necro60'] } },
    80: { lv: 80, fid: 'volcano', st: 1, comps: { 힐러근접: ['knight60', 'assassin60', 'sniper60', 'priest60'], 사제: ['knight60', 'sniper60', 'sorc60', 'priest60'], 역병의사: ['knight60', 'sniper60', 'sorc60', 'plague60'], 힐러없음: ['knight60', 'sniper60', 'sorc60', 'assassin60'], 흡혈: ['knight60', 'berserker60', 'sniper60', 'necro60'] } },
    90: { lv: 90, fid: 'roots', st: 1, comps: { 힐러근접: ['knight60', 'assassin60', 'sniper60', 'priest60'], 사제: ['knight60', 'sniper60', 'sorc60', 'priest60'], 역병의사: ['knight60', 'sniper60', 'sorc60', 'plague60'], 힐러없음: ['knight60', 'sniper60', 'sorc60', 'assassin60'], 흡혈: ['knight60', 'berserker60', 'sniper60', 'necro60'] } },
    100: { lv: 100, fid: 'sky', st: 1, comps: { 힐러근접: ['paladin100', 'shadow100', 'hawkeye100', 'archb100'], 대주교: ['paladin100', 'hawkeye100', 'archmage100', 'archb100'], 명의: ['paladin100', 'hawkeye100', 'archmage100', 'phys100'], 힐러없음: ['paladin100', 'hawkeye100', 'archmage100', 'shadow100'], 흡혈: ['paladin100', 'blood100', 'hawkeye100', 'lich100'] } },
    120: { lv: 120, fid: 'thunder', st: 1, comps: { 힐러근접: ['paladin146', 'shadow146', 'hawkeye146', 'archb146'], 대주교: ['paladin146', 'hawkeye146', 'archmage146', 'archb146'], 명의: ['paladin146', 'hawkeye146', 'archmage146', 'phys146'], 힐러없음: ['paladin146', 'hawkeye146', 'archmage146', 'shadow146'], 흡혈: ['paladin146', 'blood146', 'hawkeye146', 'lich146'] } },
    130: { lv: 130, fid: 'ruins', st: 1, comps: { 힐러근접: ['paladin146', 'shadow146', 'hawkeye146', 'archb146'], 대주교: ['paladin146', 'hawkeye146', 'archmage146', 'archb146'], 명의: ['paladin146', 'hawkeye146', 'archmage146', 'phys146'], 힐러없음: ['paladin146', 'hawkeye146', 'archmage146', 'shadow146'], 흡혈: ['paladin146', 'blood146', 'hawkeye146', 'lich146'] } },
    146: { lv: 146, fid: 'stargarden', st: 30, comps: { 힐러근접: ['paladin146', 'shadow146', 'hawkeye146', 'archb146'], 대주교: ['paladin146', 'hawkeye146', 'archmage146', 'archb146'], 명의: ['paladin146', 'hawkeye146', 'archmage146', 'phys146'], 힐러없음: ['paladin146', 'hawkeye146', 'archmage146', 'shadow146'], 흡혈: ['paladin146', 'blood146', 'hawkeye146', 'lich146'] } }
  };
  const ST = (window.SIM_ST || [[5, 5]]), N = window.SIM_N || 3, SECS = window.SIM_SECS || 2400;
  const out = [];
  for (const tk of Object.keys(T)) {
    if (window.SIM_ONLY && !window.SIM_ONLY.includes(+tk)) continue;
    const C = T[tk];
    for (const [cn, comp] of Object.entries(C.comps)) {
      if (window.SIM_COMPS && !window.SIM_COMPS.includes(cn)) continue;
      for (const [slv, sm] of ST) {
        const runs = [];
        for (let i = 0; i < N; i++) {
          H.fresh();
          const team = comp.map(k => { const [c, sk] = B[k]; return H.adv(c, C.lv, { sk, slv, sm }); });
          const Dv = { dmg: { basic: 0, skill: 0, dot: 0, extra: 0 }, casts: {}, basics: 0, mp: {}, ft: 0, ammo: 0 };
          window.__D99(Dv);
          const r = H.push(team, C.fid, C.st, SECS);
          window.__D99(null);
          const ft = Math.max(1, Dv.ft);
          runs.push({ flv: r.flv, stage: r.stage, wiped: r.wiped, cleared: r.cleared, t: r.t, taken: Math.round(r.R.taken), heff: Math.round(r.R.heff), downs: r.R.downs, fightT: Math.round(Dv.ft),
            dmg: Object.fromEntries(Object.entries(Dv.dmg).map(([k, v]) => [k, Math.round(v)])), basics: Dv.basics, ammo: Dv.ammo,
            casts: Object.fromEntries(Object.entries(Dv.casts).map(([k, v]) => [k, +(v / ft * 60).toFixed(1)])),
            mp: Object.fromEntries(Object.entries(Dv.mp).map(([k, v]) => [k, Math.round(v / ft * 100)])) });
        }
        out.push({ tier: +tk, comp: cn, slv, sm, runs });
      }
    }
  }
  return JSON.stringify(out);
})()
