/* ───────── 스킬 설명: 계수·대기시간·확률·증가율을 전부 숫자로 ─────────
   skillSpec(id)        — 스킬북·도감·상점용 (계수 그대로)
   skillSpec(id, a)     — 모험가 창용 (그 모험가의 공격력·숙련·재사용 감소를 넣은 실제 수치)
   basicSpec(a)         — 기본 공격 (5초 ÷ 공격 속도, 공격력 ×2.5) */
const SK_TGT = { front: '앞의 적', low: '가장 약한 적', all: '모든 적', self: '자신', party: '파티 전원' };
const SK_KIND = { dmg: '물리 피해', mdmg: '마법 피해', heal: '치유', buff: '강화', dot: '지속 피해', taunt: '도발', cure: '해제' };
const SK_BUFF = { atk: '공격력', matk: '마법 공격력', def: '방어력', eva: '회피', block: '방어 확률', counter: '반격', rheal: '받는 회복량', spd: '공격 속도', heal: '회복량' };
// 지속 효과 이름과 표기 방식: pct(배율 %) · pp(%p 더함) · neg(줄임) · x(배)
const SK_PASS = { atkPct: ['공격력', 'pct'], matkPct: ['마법 공격력·치유량', 'pct'], defPct: ['방어력', 'pct'], hpPct: ['최대 HP', 'pct'], mpPct: ['최대 MP', 'pct'], carryPct: ['짐', 'pct'], movePct: ['이동 속도', 'pct'], spdPct: ['공격 속도', 'pct'], cdr: ['스킬 재사용 대기시간', 'neg'], crit: ['치명타', 'pp'], eva: ['회피', 'pp'], block: ['방어 확률', 'pp'], counter: ['반격', 'pp'], double: ['연타', 'pp'], mpRegen: ['MP 회복', 'x'] };
const skPct = v => `${Math.round(v * 1000) / 10}%`;
const skSec = v => `${Math.round(v * 10) / 10}초`;
const skN = v => fmt(Math.round(v));
const skRange = v => `${skN(v * 0.85)}~${skN(v * 1.15)}`;
const skMul = v => `×${Math.round(v * 100) / 100}`;
// 스킬 하나의 수치 목록 (문자열 배열)
function skillSpec(id, a) {
  const s = SKILLS[id]; if (!s) return [];
  const out = [], d = a ? derive(a) : null, T = a ? TR(a) : {}, M = a ? smMul(a, id) : 1, ml = a ? smLv(a, id) : 0;
  if (s.passive) {
    for (const [k, v] of Object.entries(s.passive)) {
      const P = SK_PASS[k] || [STAT_NAMES[k] || k, 'pct'];
      out.push(`${P[0]} ${P[1] === 'x' ? '×' + (1 + v) : P[1] === 'neg' ? '-' + skPct(v) : '+' + skPct(v) + (P[1] === 'pp' ? 'p' : '')}`);
    }
    out.push('지속 효과 · 배우고 있는 동안 늘 적용');
    return out;
  }
  const magic = s.kind === 'mdmg' || (s.kind === 'dot' && s.magic), hits = s.hits || 1;
  if (s.kind === 'dmg' || s.kind === 'mdmg') {
    out.push(`${SK_KIND[s.kind]} ${magic ? '마법 공격력' : '공격력'} ${skMul(s.mult)}${hits > 1 ? ` ${hits}연타 (합 ${skMul(s.mult * hits)})` : ''}`);
    if (d) { const base = (magic ? d.matk : d.atk) * s.mult * M; out.push(`한 방 약 <b>${skRange(base)}</b>${hits > 1 ? ` × ${hits}` : ''} (방어 0 기준)`); }
    out.push(`대상 ${SK_TGT[s.tgt] || s.tgt}`);
    if (s.crit === 1) out.push('반드시 치명타');
    else if (s.crit) out.push(d ? `치명타 ${skPct(Math.min(1, d.crit + s.crit))} (기본 ${skPct(d.crit)} + ${skPct(s.crit)}p)` : `치명타 +${skPct(s.crit)}p`);
    else if (d) out.push(`치명타 ${skPct(d.crit)}`);
    if (d) out.push(`치명타 피해 ×${T.critMul || 1.75}`);
    if (s.boss) out.push(`보스에게 ×${s.boss}`);
    if (s.drain) out.push(`준 피해의 ${skPct(s.drain)} 흡혈`);
    if (s.steal) out.push(`맞힌 적마다 금화 +${s.steal}G${hits > 1 ? ` ×${hits}` : ''}`);
  } else if (s.kind === 'dot') {
    out.push(`${SK_KIND.dot} ${magic ? '마법 공격력' : '공격력'} ${skMul(s.mult)}/초 · ${s.dur}초 (합 ${skMul(s.mult * s.dur)})`);
    if (d) { const dps = (magic ? d.matk : d.atk) * s.mult * M * (T.dot || 1); out.push(`초당 약 <b>${skN(dps)}</b> × ${s.dur}초 ≈ ${skN(dps * s.dur)}`); }
    out.push(`대상 ${SK_TGT[s.tgt] || s.tgt}`);
  } else if (s.kind === 'heal' && s.tgt === 'self') {
    out.push(`최대 HP의 ${skPct(s.pct)} 회복`);
    if (d) out.push(`약 <b>${skN(d.maxHp * s.pct * M * d.healPow * (1 + d.rheal))}</b> 회복`);
  } else if (s.kind === 'heal') {
    out.push(`치유 마법 공격력 ${skMul(s.mult)} · ${SK_TGT[s.tgt] || s.tgt}`);
    if (d) out.push(`약 <b>${skRange(d.matk * s.mult * M * (T.healPow || 1) * d.healPow)}</b> 회복${s.tgt === 'party' ? ' (한 사람마다)' : ''}`);
    if (s.cures && s.cures.length) out.push(`${s.cures.map(k => STATUS[k] ? STATUS[k].name : k).join('·')} 해제`);
    else out.push('출혈 해제');
  } else if (s.kind === 'buff') {
    out.push(`${SK_BUFF[s.stat] || STAT_NAMES[s.stat] || s.stat} ${s.mult ? skMul(s.mult) : '+' + skPct(s.add) + 'p'}${s.haste ? ` · 공격 속도 ${skMul(s.haste)}` : ''}`);
    out.push(`${s.dur}초 · ${SK_TGT[s.tgt] || s.tgt}`);
  } else if (s.kind === 'taunt') {
    out.push(`${s.dur}초 동안 모든 적이 자신만 노린다`);
  } else if (s.kind === 'cure') {
    out.push(`${(s.cures || []).map(k => STATUS[k] ? STATUS[k].name : k).join('·')} 해제 · 파티 전원`);
  }
  if (s.sta) { const St = STATUS[s.sta.k]; out.push(`${St ? St.name : s.sta.k} ${skPct(s.sta.p)} · ${s.sta.d}초${s.sta.m ? ` · 초당 스킬 공격력의 ${skPct(s.sta.m)}` : ''}`); }
  if (s.slow) out.push(`${s.slow}초 느려짐 (적 공격 간격 ×1.6)`);
  // 비용과 재사용 대기시간
  out.push(s.cost.hp ? `HP ${skPct(s.cost.hp)}${d ? ` (${skN(d.maxHp * s.cost.hp)})` : ''} 소모` : `MP ${s.cost.mp} 소모`);
  if (s.cd) {
    const eff = a ? skillCdOf(a, d, id, null) : s.cd;
    out.push(`재사용 ${skSec(s.cd)}${a && Math.abs(eff - s.cd) >= 0.05 ? ` → <b>${skSec(eff)}</b>` : ''}`);
  }
  if (a) out.push(`숙련 ${ml}/${SM_MAX}${ml ? ` (위력 +${ml * 3}% · 재사용 -${ml * 2}%)` : ' (쓸수록 위력 +3%, 재사용 -2%씩)'}`);
  return out;
}
const skillSpecLine = (id, a) => `<span class="sk-spec">${skillSpec(id, a).join(' · ')}</span>`;
// 기본 공격 설명 (모험가 창)
function basicSpec(a) {
  const d = derive(a), T = TR(a), magic = basicIsMagic(a), cd = basicCd(a, d, null), out = [];
  const base = magic ? d.matk * BASIC_MAGIC : d.atk * BASIC_MULT + (T.hybrid ? d.matk * T.hybrid * BASIC_MULT : 0);
  out.push(`${magic ? '마법 공격력' : '공격력'} ${skMul(magic ? BASIC_MAGIC : BASIC_MULT)}${T.hybrid ? ` + 마법 공격력 ${skMul(T.hybrid * BASIC_MULT)}` : ''}`);
  out.push(`한 방 약 <b>${skRange(base)}</b> (방어 0 기준)`);
  out.push(`대상 ${CLASSES[a.cls].act === 'arrow' ? SK_TGT.low : SK_TGT.front}`);
  out.push(`치명타 ${skPct(d.crit)} (×${T.critMul || 1.75})`);
  const dbl = (T.double || 0) + d.double; if (dbl) out.push(`연타 ${skPct(dbl)}`);
  if (T.aoe) out.push(`다른 적에게도 ${skMul(T.aoe)}`);
  if (T.pet) out.push(`동물 동료가 ${skPct(0.5 + T.pet)}로 함께 문다 (공격력 ${skMul((0.35 + T.pet) * BASIC_MULT)})`);
  out.push(`재사용 ${BASIC_CD}초 ÷ 공격 속도 ${skMul(d.spd)} = <b>${skSec(cd)}</b>`);
  return out;
}
// 공격 속도·재사용 감소가 어디서 오는지 (능력치 탭)
function speedBreakdown(a) {
  const C = CLASSES[a.cls], d = derive(a), G = gearSum(a), P = passives(a), T = d.T;
  const parts = [`직업 ${skMul(C.spd)}`, `민첩 +${skPct(T.agi * 0.004)}`];
  if (P.spdPct) parts.push(`지속 스킬 +${skPct(P.spdPct)}`);
  if (traitSum(a, 'spdPct')) parts.push(`특성 +${skPct(traitSum(a, 'spdPct'))}`);
  if (G.spdPct) parts.push(`룬 +${skPct(G.spdPct)}`);
  const cd = [];
  if (P.cdr) cd.push(`지속 스킬 ${skPct(P.cdr)}`);
  if (traitSum(a, 'cdr')) cd.push(`특성 ${skPct(traitSum(a, 'cdr'))}`);
  if (G.cdr) cd.push(`룬 ${skPct(G.cdr)}`);
  return { spd: parts.join(' · '), cdr: cd.length ? cd.join(' · ') + (d.cdr >= CDR_MAX ? ' (상한 50%)' : '') : '없음 (지속 스킬 「전술」·특성 「전술가」·시간의 룬으로 늘어요)' };
}
// 스킬북이 어디서 나오는지 (도감·창고)
function bookFromText(id) {
  const s = SKILLS[id]; if (!s) return '';
  if (Object.values(CLASSES).some(C => C.innate === id)) return '직업 기본 스킬 (고용·전직하면 바로)';
  if (s.own) return '훈련소 고유 수련 (스킬북 없이)';
  if (s.awk) return '각성';
  const mons = bookFrom(id).filter(m => MONS[m]);
  if (!mons.length) return s.kingdom ? `${KINGDOMS[s.kingdom].name} 상단·의뢰` : s.arena ? '투기장 상단' : '암시장·던전 보물 상자';
  return `떨어뜨리는 몬스터: ${mons.map(m => `${MONS[m].name}${MONS[m].boss && !MONS[m].fb ? '(주인 ' + Math.round(BOOK_RATE.boss * 100) + '%)' : ''}`).join(', ')} · 필드 ${BOOK_RATE.field * 100}% · 던전 ${BOOK_RATE.dungeon * 100}% · 우두머리 ${Math.round(BOOK_RATE.fb * 100)}% · 주인 ${Math.round(BOOK_RATE.boss * 100)}%`;
}
