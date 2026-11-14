// 능력치 확장 안건용 측정 (시험 묶음 아님): 레벨 · 직업마다 방어 감소 · 치명 · 회피(상한 전) · 공격 속도 · 막기
(() => {
  H.fresh();
  const rows = [];
  const plan = { 30: ['warrior', 'archer', 'mage', 'rogue', 'cleric'], 60: ['knight', 'gladiator', 'sniper', 'sorcerer', 'assassin', 'priest'], 100: ['paladin', 'champion', 'hawkeye', 'archmage', 'shadowlord', 'archbishop'], 150: ['paladin', 'champion', 'hawkeye', 'archmage', 'shadowlord', 'archbishop'], 200: ['paladin', 'champion', 'hawkeye', 'archmage', 'shadowlord', 'archbishop'] };
  for (const q of [1, 3]) for (const lv of Object.keys(plan)) for (const cls of plan[lv]) {
    if (!CLASSES[cls]) { rows.push({ cls, miss: 1 }); continue; }
    const a = H.adv(cls, +lv, { slv: 3, sm: 3, q }), d = derive(a), G = gearSum(a), P = passives(a), X = k => traitSum(a, k);
    const crit0 = d.critOver > 0 ? CAP.crit + d.critOver : d.crit;
    const evaRaw = d.T.agi * 0.004 + (G.eva || 0) + (P.eva || 0) + X('eva');
    rows.push({ q, lv: +lv, cls: CLASSES[cls].name, hp: d.maxHp, atk: Math.round(d.atk), matk: Math.round(d.matk), def: Math.round(d.def), phys: +(1 - red(d.def)).toFixed(3), mag: +(1 - red(d.def * 0.5) * (1 - (d.mres || 0))).toFixed(3), mres: +(d.mres || 0).toFixed(2), crit0: +crit0.toFixed(3), eva: +d.eva.toFixed(3), evaRaw: +evaRaw.toFixed(3), block: +(d.block || 0).toFixed(3), spd: +d.spd.toFixed(2), bcd: +(BASIC_CD / d.spd).toFixed(2), cdr: +(d.cdr || 0).toFixed(3), agi: Math.round(d.T.agi) });
    S.advs = [];
  }
  // 몬스터 쪽: 레벨마다 필드 몬스터 공격 · 방어 (foeFrom)
  const mons = [];
  for (const fid of ['plains', 'forest', 'swamp', 'castle', 'sky', 'stargarden']) { const F = FIELDS[fid]; if (!F) continue; const id = F.mons[0]; try { const f = foeFrom(id, F.lv, fid); mons.push({ fid, lv: F.lv, id, atk: Math.round(f.atk), def: Math.round(f.def), hp: Math.round(f.maxHp) }); } catch (err) { mons.push({ fid, err: String(err).slice(0, 80) }); } }
  return JSON.stringify({ rows, mons });
})()
