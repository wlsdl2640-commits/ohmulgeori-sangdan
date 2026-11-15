/* 허수아비 피해 (내 측정): sim99.js와 같은 파티로, 그 땅 몬스터를 HP 무한 · 공격 0으로 만들어 120초 동안 준 피해 — 한 마리(우두머리) · 세 마리
   window.PACE (sim99.js와 같음) · SIM_ONLY · SIM_COMPS · DUM_N(반복) · DUM_T(초) → [{ tier, comp, one: {dps, basic, casts}, three: {...} }] */
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
  if (P.B69) Object.assign(BASIC69, P.B69);   // 빌드 69 밤 기본 공격 (data-rpg.js BASIC69): base · floor · exec · pct · buff …
  if (P.mm) P.mm.forEach(([i, o]) => { MON_MUL69[i][1] = o; });   // 몬스터 레벨 배율 점 바꾸기 (data-monup69.js — [자리, {hp, atk, def}])
  if (P.mpT) MP69.casterT = P.mpT;
  if (P.mpPer != null) MP69.per = P.mpPer;   // 1 + 레벨 ÷ per 배
  if (P.mp69) Object.assign(MP69, P.mp69);   // 빌드 69 밤 넣은 꼴: { k0, per, max } → 배 = min(max, k0 + 레벨 ÷ per)
  if (P.healT) for (const id in SKILLS) { const s = SKILLS[id]; if (!['heal', 'regen', 'shield'].includes(s.kind)) continue; const t = s.ptier || 0; if (s.mult0 != null) s.mult = paceMul(s.mult0 * P.healT[t]); if (s.pct0 != null) s.pct = Math.round(s.pct0 * P.healT[t] * 10000) / 10000; }   // 회복만 차수마다 다시 (넣은 값 위에서)    // 차수마다 MP 배 (있으면)
  if (P.mpK != null) MP69.caster = P.mpK;      // 마법사 · 성직자 스킬 MP 배 (data-pace69.js MP69)
  if (P.F && P.F !== 1) {                       // 기본 공격 한 방 × (지금 BASIC_MULT 3.5 · BASIC_MAGIC 2.94 위에)
    window.__F101 = P.F;
    PATCH('basicAct', '* BASIC_MAGIC, v = hitFoe(', '* BASIC_MAGIC * window.__F101, v = hitFoe(');
    PATCH('basicAct', ')) * BASIC_MULT * (i === 0 && NX', ')) * BASIC_MULT * window.__F101 * (i === 0 && NX');
    PATCH('basicAct', '* (0.35 + T.pet) * BASIC_MULT *', '* (0.35 + T.pet) * BASIC_MULT * window.__F101 *');
    PATCH('offShot', 'atk * BASIC_MULT * (T.thrown', 'atk * BASIC_MULT * window.__F101 * (T.thrown');
  }
  // (P.B: 예전 BASIC_CD 판 — 빌드 69 밤부터 battle 글이 바뀌어 쓰지 않는다)
    if (P.gap) PATCH('battle', 'e.gcd[a.id] = CAST_GAP;', 'e.gcd[a.id] = window.__PG;');
  window.__PG = P.gap || CAST_GAP;
  let D = null;
  if (!window.__W99d) { window.__W99d = 1; const ev1 = ev; ev = function (e, k, x) { if (D && x) { if (k === 'hit' && x.v > 0) { const g = x.b ? 'basic' : x.dot ? 'dot' : (x.sid === 'shuri' || x.sid === 'bolt' || x.ctr || x.k === 'pet' || x.sid === 'reflect') ? 'extra' : x.sid ? 'skill' : 'extra'; D.dmg[g] += x.v; } else if (k === 'skill') D.casts++; } return ev1.apply(this, arguments); }; window.__D99d = v => { D = v; }; }
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
  const N = window.DUM_N || 2, TT = window.DUM_T || 120, out = [];
  const fight = (team, fid, st, nf) => {
    const p = newParty('허수아비', team.map(a => a.id)); S.parties = [p]; p.safe = false; p.auto = false; p.sup = {}; p.autoBuy = false;
    team.forEach(a => { const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; a.status = 'away'; a.inj = null; a.down = false; a.fat = 0; a.sleep = 0; });
    formParty(p); p.exp = newExp(fid, {}, st); team.forEach(a => refillAmmo(a));
    let n = 0; while (p.exp && !p.exp.foes.length && n++ < 3000) stepExp(p, 0.2);
    const e = p.exp; if (!e) return null;
    let fs = e.foes.slice(0, 1); while (fs.length < nf) { const c = Object.assign({}, e.foes[0]); c.uid = nid(); fs.push(c); }
    fs = fs.slice(0, nf);
    fs.forEach(f => { f.maxHp = f.hp = 1e13; f.atk = 0; f.matk = 0; f.msk = null; f.mcd = null; f.boss = nf === 1 ? 1 : 0; f.fb = 0; f.aoe = 0; f.dots = {}; f.sta = {}; f.shd = 0; });
    e.foes = fs;
    const Dv = { dmg: { basic: 0, skill: 0, dot: 0, extra: 0 }, casts: 0 }; window.__D99d(Dv);
    let t = 0; while (t < TT && p.exp && p.exp.foes.length) { stepExp(p, 0.2); t += 0.2; }
    window.__D99d(null);
    const tot = Dv.dmg.basic + Dv.dmg.skill + Dv.dmg.dot + Dv.dmg.extra;
    return { dps: tot / Math.max(1, t), basic: Dv.dmg.basic / Math.max(1, tot), skill: Dv.dmg.skill / Math.max(1, tot), dot: Dv.dmg.dot / Math.max(1, tot), extra: Dv.dmg.extra / Math.max(1, tot), casts: Dv.casts / Math.max(1, t) * 60, t };
  };
  for (const tk of Object.keys(T)) {
    if (window.SIM_ONLY && !window.SIM_ONLY.includes(+tk)) continue;
    const C = T[tk];
    for (const [cn, comp] of Object.entries(C.comps)) {
      if (window.SIM_COMPS && !window.SIM_COMPS.includes(cn)) continue;
      const res = { tier: +tk, comp: cn };
      for (const [lab, nf] of [['one', 1], ['three', 3]]) {
        const rs = [];
        for (let i = 0; i < N; i++) { H.fresh(); const team = comp.map(k => { const [c, sk] = B[k]; return H.adv(c, C.lv, { sk, slv: 5, sm: 5 }); }); const r = fight(team, C.fid, C.st, nf); if (r) rs.push(r); }
        const av = k => +(rs.reduce((t, r) => t + r[k], 0) / Math.max(1, rs.length)).toFixed(3); res[lab] = { dps: Math.round(rs.reduce((t, r) => t + r.dps, 0) / Math.max(1, rs.length)), basic: av('basic'), skill: av('skill'), dot: av('dot'), extra: av('extra'), casts: +(rs.reduce((t, r) => t + r.casts, 0) / Math.max(1, rs.length)).toFixed(1), t: rs.length ? rs[0].t : 0 };
      }
      out.push(res);
    }
  }
  return JSON.stringify(out);
})()
