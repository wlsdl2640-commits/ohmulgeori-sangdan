/* ───────── 스킬 설명: 계수·대기시간·확률·증가율을 전부 숫자로 ─────────
   skillSpec(id)        — 스킬북·도감·상점용 (계수 그대로)
   skillSpec(id, a)     — 모험가 창용 (그 모험가의 공격력·숙련·재사용 감소를 넣은 실제 수치)
   basicSpec(a)         — 기본 공격 (5초 ÷ 공격 속도, 공격력 ×2.5) */
const SK_TGT = { front: '앞의 적', low: '가장 약한 적', strong: '가장 센 적', pierce: '맨 앞 적과 그 뒤 적 (꿰뚫기)', all: '모든 적', self: '자신', party: '파티 전원' };
const SK_TGT_ALLY = Object.assign({}, SK_TGT, { low: '가장 다친 동료', ally: '가장 다친 동료' });   // 빌드 69: 치유 · 재생 · 보호막 · 강화의 low는 가장 다친 동료 (예전엔 「가장 약한 적」으로 나왔다)
const SK_KIND = { dmg: '물리 피해', mdmg: '마법 피해', heal: '치유', buff: '강화', dot: '지속 피해', taunt: '도발', cure: '해제', shield: '보호막', regen: '재생', revive: '부활' };
const SK_BUFF = { deflect: '기본 공격 튕겨내기', steal: '훔치는 돈', hide: '적이 덜 노림', ncrit: '다음 공격 치명타 확정', nmul: '다음 공격', ground: '땅에 내려앉음', atk: '공격력', matk: '마법 공격력', def: '방어력', eva: '회피', block: '방어 확률', counter: '반격', rheal: '받는 회복량', spd: '공격 속도', heal: '회복량', crit: '치명타', guard: '받는 피해 감소', cdr: '스킬 재사용 감소' };
// 지속 효과 이름과 표기 방식: pct(배율 %) · pp(%p 더함) · neg(줄임) · x(배)
const SK_PASS = { el_water: ['물 속성 피해', 'pct'], atkPct: ['공격력', 'pct'], matkPct: ['마법 공격력·치유량', 'pct'], defPct: ['방어력', 'pct'], hpPct: ['최대 HP', 'pct'], mpPct: ['최대 MP', 'pct'], carryPct: ['짐', 'pct'], movePct: ['이동 속도', 'pct'], spdPct: ['공격 속도', 'pct'], cdr: ['스킬 재사용 대기시간', 'neg'], crit: ['치명타', 'pp'], eva: ['회피', 'pp'], block: ['방어 확률', 'pp'], counter: ['반격', 'pp'], double: ['연타', 'pp'], mpRegen: ['MP 회복', 'x'], healPow: ['치유량', 'pct'], hpRegen: ['초당 HP 재생', 'pct'], exec: ['약해진 적(HP 30% 아래) 피해', 'pct'], stun: ['기본 공격 기절', 'pp'], buffDur: ['강화 스킬 지속 시간', 'pct'],
  critDmg: ['치명타 피해', 'pct'], chestGold: ['보물 상자 · 보물고 돈', 'pct'], thrownPct: ['암기 피해', 'pct'], thrownCap: ['암기 담는 수', 'pct'], petDmg: ['늑대 · 와이번 공격 피해', 'pct'], pbuffDur: ['파티 강화 스킬 지속 시간', 'pct'], camp: ['야영 회복', 'pct'], campAmb: ['야영 중 밤습격', 'neg'], campSleep: ['웨건 야영 중 숙면 피로 회복 (초당)', 'n'],   // 빌드 69 개척민의 지혜   // 빌드 65 직업 개편
  slowHit: ['기본 공격에 맞은 적 1.5초 느림', 'pp'], bleedHit: ['기본 공격 출혈', 'pp'], stealPct: ['훔치는 돈', 'pct'], chestExtra: ['보물고 상자 하나 더', 'pp'], thrownTwice: ['암기 한 번 더', 'pp'], comboMax: ['연계 한도', 'n'],   // 빌드 65 새 숙련
  offDmg: ['둘째 칼(보조 단검) 피해', 'pct'], arenaFame: ['투기장 랭킹 점수', 'pct'], shieldPow: ['거는 보호막', 'pct'], boltPct: ['볼트 피해', 'pct'], boltPierce: ['볼트 방어 무시', 'pct'], boltTwice: ['볼트 한 발 더', 'pp'], petTwice: ['탈것이 한 번 더', 'pp'],
  spiritPct: ['정령 스킬 피해', 'pct'], weakPct: ['약점 피해', 'pct'], immPierce: ['면역인 적에게도 피해', 'pct'], mdrain: ['마법 피해 흡수', 'pct'], dotPct: ['지속 피해', 'pct'], wagonSpd: ['모는 마차 속도', 'pct'], wagonCap: ['모는 마차 짐', 'pct'] };
const SK_PASS_FLAG = { subst: '싸움마다 한 번, 쓰러질 한 방을 피하고 HP 30%로 버틴다', firstCrit: '싸움마다 첫 공격은 반드시 치명타', baImm: '기본 공격에 맞지 않는다' };
// 숙련 효과 한 줄: 공격력 +8% · 치명타 +1%p
const mastFxText = f => Object.entries(f).map(([k, v]) => { const P = SK_PASS[k] || [STAT_NAMES[k] || k, 'pct']; return `${P[0]} ${P[1] === 'n' ? '+' + v : P[1] === 'neg' ? '-' + skPct(v) : '+' + skPct(v) + (P[1] === 'pp' ? 'p' : '')}`; }).join(' · ');
const skPct = v => `${Math.round(v * 1000) / 10}%`;
const skSec = v => `${Math.round(v * 10) / 10}초`;
const skN = v => fmt(Math.round(v));
const skRange = v => `${skN(v * 0.85)}~${skN(v * 1.15)}`;
const skMul = v => `×${Math.round(v * 100) / 100}`;
// 속성 한 줄: 무속성이면 강철에 면역, 속성이면 빛·신성에 면역
const skElLine = s => (s.els ? `속성 ${s.els.map(elTag).join('·')} 가운데 적의 약점으로 · 빛·신성 몬스터에게 면역` : elOf(s) === 'none' ? `속성 ${elTag('none')} · 강철 몬스터에게 면역` : `속성 ${elTag(elOf(s))} · 같은 계열·빛·신성 몬스터에게 면역`);
// 스킬 하나의 수치 목록 (문자열 배열)
function skillSpec(id, a) {
  const s = SKILLS[id]; if (!s) return [];
  const out = [], d = a ? derive(a) : null, T = a ? TR(a) : {}, L = a ? skLvMul(a, id) : 1, lv = a ? skLv(a, id) : 1, M = (a ? smMul(a, id) : 1) * L, ml = a ? smLv(a, id) : 0;
  const lvLine = a ? `스킬 Lv${lv}/${SK_LV_MAX}${lv > 1 ? ` (위력 +${Math.round(SK_LV_POW * (lv - 1) * 100)}% · 재사용 -${Math.round(SK_LV_CD * (lv - 1) * 100)}%)` : ''}` : '';
  if (s.passive) {
    for (const [k, v0] of Object.entries(s.passive)) {
      if (SK_PASS_FLAG[k]) { out.push(SK_PASS_FLAG[k]); continue; }
      const P = SK_PASS[k] || [STAT_NAMES[k] || k, 'pct'], v = v0 * L;
      out.push(`${P[0]} ${P[1] === 'x' ? '×' + (Math.round((1 + v) * 100) / 100) : P[1] === 'n' ? Math.round(v * 100) / 100 : P[1] === 'neg' ? '-' + skPct(v) : '+' + skPct(v) + (P[1] === 'pp' ? 'p' : '')}`);
    }
    out.push('지속 효과 · 배우고 있는 동안 늘 적용');
    if (lvLine) out.push(lvLine);
    return out;
  }
  const magic = s.kind === 'mdmg' || (s.kind === 'dot' && s.magic), hits = s.hits || 1;
  if (s.kind === 'dmg' || s.kind === 'mdmg') {
    out.push(`${SK_KIND[s.kind]} ${magic ? '마법 공격력' : '공격력'} ${skMul(s.mult * L)}${hits > 1 ? ` ${hits}연타 (합 ${skMul(s.mult * L * hits)})` : ''}`);
    if (d) { const base = (magic ? d.matk : d.atk) * s.mult * M; out.push(`한 방 약 <b>${skRange(base)}</b>${hits > 1 ? ` × ${hits}` : ''} (방어 0 기준)`); }
    out.push(`대상 ${SK_TGT[s.tgt] || s.tgt}`);
    if (s.crit === 1) out.push('반드시 치명타');
    else if (s.crit) out.push(d ? `치명타 ${skPct(capCrit(d, s.crit))} (기본 ${skPct(d.crit)} + ${skPct(s.crit)}p)` : `치명타 +${skPct(s.crit)}p`);
    else if (d) out.push(`치명타 ${skPct(d.crit)}`);
    if (d) out.push(`치명타 피해 ×${T.critMul || 1.75}`);
    if (s.boss) out.push(`보스에게 ×${s.boss}`);
    if (s.exec) out.push(`HP ${skPct(EXEC_HP)} 아래 적에게 ×${s.exec} (처형)`);
    if (s.gamble) out.push(`${skPct(s.gamble.p)} 확률로 ×${s.gamble.mult} 대박 (평균 ${skMul(1 + s.gamble.p * (s.gamble.mult - 1))})`);
    if (s.drain) out.push(`준 피해의 ${skPct(s.drain)} 흡혈`);
    if (s.steal) out.push(`맞힌 적마다 금화 +${s.steal}G${hits > 1 ? ` ×${hits}` : ''}`);
    out.push(skElLine(s));
    if (s.vs) out.push(Object.entries(s.vs).map(([t, v]) => `${MTYPES[t] ? MTYPES[t].name : t}에게 ×${v}`).join(' · '));
    if (s.armor) out.push('강철의 무속성 면역을 꿰뚫는다 (피해 80%)');
    if (s.wagonMul) out.push(`마차를 끌고 왔으면 ×${s.wagonMul}`);
  } else if (s.kind === 'dot') {
    out.push(`${SK_KIND.dot} ${magic ? '마법 공격력' : '공격력'} ${skMul(s.mult * L)}/초 · ${s.dur}초 (합 ${skMul(s.mult * L * s.dur)})`);
    if (d) { const dps = (magic ? d.matk : d.atk) * s.mult * M * (T.dot || 1); out.push(`초당 약 <b>${skN(dps)}</b> × ${s.dur}초 ≈ ${skN(dps * s.dur)}`); }
    out.push(`대상 ${SK_TGT[s.tgt] || s.tgt}`);
    out.push(skElLine(s));
  } else if (s.kind === 'heal' && s.tgt === 'self') {
    out.push(`최대 HP의 ${skPct(s.pct * L)} 회복`);
    if (d) out.push(`약 <b>${skN(d.maxHp * s.pct * M * d.healPow * (1 + d.rheal))}</b> 회복`);
  } else if (s.kind === 'heal') {
    if (s.pct) out.push(`${s.tgt === 'party' ? '파티 전원' : '가장 다친 동료'}의 최대 HP ${skPct(s.pct * L)} 회복`);   // 빌드 65: 약상자 · 보급품
    else { out.push(`치유 마법 공격력 ${skMul(s.mult * L)} · ${SK_TGT_ALLY[s.tgt] || s.tgt}`);
    if (d) out.push(`약 <b>${skRange(d.matk * s.mult * M * (T.healPow || 1) * d.healPow)}</b> 회복${s.tgt === 'party' ? ' (한 사람마다)' : ''}`); }
    if (s.cure1) out.push('상태이상 하나 해제');
    else if (s.cures && s.cures.length) out.push(`${s.cures.length >= STATUS_IDS.length - 1 ? '모든 상태이상' : s.cures.map(k => STATUS[k] ? STATUS[k].name : k).join('·')} 해제`);
    else out.push('출혈 해제');
    if (s.reviveAll) out.push(`쓰러진 동료를 모두 최대 HP의 ${skPct(s.reviveAll)}로 일으킨다 · 부상도 남지 않는다`);
  } else if (s.kind === 'buff') {
    const bf = m2 => (['deflect', 'hide', 'ncrit', 'ground'].includes(m2.stat) ? SK_BUFF[m2.stat] : `${SK_BUFF[m2.stat] || STAT_NAMES[m2.stat] || m2.stat} ${m2.mult ? skMul(1 + (m2.mult - 1) * L) : '+' + skPct(m2.add * L) + 'p'}`);
    out.push(`${bf(s)}${s.haste ? ` · 공격 속도 ${skMul(1 + (s.haste - 1) * L)}` : ''}${(s.more || []).map(m2 => ' · ' + bf(m2)).join('')}`);
    out.push(`${s.dur}초 · ${SK_TGT_ALLY[s.tgt] || s.tgt}`);
    if (s.fat) out.push(`파티 모두의 피로 −${Math.round(s.fat * L * 10) / 10} · 피로 ${s.fatNeed || 20} 넘은 동료가 있을 때 쓴다`);   // 빌드 69 물통 돌리기
    if (s.ammo) out.push(`파티 모두의 화살 · 암기 · 볼트를 담는 수의 ${skPct(s.ammo)}씩 채운다`);   // 빌드 69 웨건 보급
    if (s.durCarry) { const cp = a ? Math.min(s.durCarry, passives(a).carryPct || 0) : 0; out.push(`짐 늘리기(짐 +%)만큼 오래 간다 — 최대 ${Math.round((1 + s.durCarry) * 10) / 10}배${a ? ` · 지금 ${Math.round(s.dur * (1 + cp) * 10) / 10}초` : ''}`); }   // 빌드 69 짐 덜어 주기
    if (s.wagonMul) out.push(`마차를 끌고 왔으면 효과 ×${s.wagonMul}`);
  } else if (s.kind === 'taunt') {
    out.push(`${s.dur}초 동안 모든 적이 자신만 노린다`);
  } else if (s.kind === 'cure') {
    out.push(`${(s.cures || []).map(k => STATUS[k] ? STATUS[k].name : k).join('·')} 해제 · 파티 전원`);
  } else if (s.kind === 'shield') {
    out.push(s.pct ? `보호막 최대 HP의 ${skPct(s.pct * L)}` : `보호막 마법 공격력 ${skMul(s.mult * L)}`);
    if (d) out.push(`약 <b>${skN((s.pct ? d.maxHp * s.pct : d.matk * s.mult * (T.healPow || 1) * d.healPow) * M)}</b> 흡수${s.tgt === 'party' ? ' (한 사람마다)' : ''}`);
    out.push(`${s.dur}초 · ${SK_TGT_ALLY[s.tgt] || s.tgt} · 피해를 대신 받는 임시 HP`);
  } else if (s.kind === 'regen') {
    if (s.pct) out.push(`재생 초당 최대 HP의 ${skPct(s.pct * L)} · ${s.dur}초 (합 ${skPct(s.pct * L * s.dur)})${s.cure1 ? ' · 상태이상 하나 해제' : ''}`);   // 빌드 65: 비상식량
    else { out.push(`재생 마법 공격력 ${skMul(s.mult * L)}/초 · ${s.dur}초 (합 ${skMul(s.mult * L * s.dur)})`);
    if (d) { const hps = d.matk * s.mult * M * (T.healPow || 1) * d.healPow; out.push(`초당 약 <b>${skN(hps)}</b> × ${s.dur}초 ≈ ${skN(hps * s.dur)}`); } }
    out.push(`대상 ${SK_TGT_ALLY[s.tgt] || s.tgt}`);
  } else if (s.kind === 'revive') {
    out.push(`쓰러진 동료를 최대 HP의 ${skPct(s.pct * L)}로 일으킨다 · 싸움마다 한 번 · 부상도 남지 않는다`);
  }
  if (s.sta) { const St = STATUS[s.sta.k]; out.push(`${St ? St.name : s.sta.k} ${skPct(s.sta.p)} · ${s.sta.d}초${s.sta.m ? ` · 초당 스킬 공격력의 ${skPct(s.sta.m)}` : ''}`); }
  if (s.sta2) { const St = STATUS[s.sta2.k]; out.push(`${St ? St.name : s.sta2.k} ${skPct(s.sta2.p)} · ${s.sta2.d}초`); }
  if (s.slow) out.push(`${s.slow}초 느려짐 (적 공격 간격 ×1.6)`);
  [s.after, s.after2].filter(Boolean).forEach(A2 => { out.push(A2.stat === 'ground' ? `쓴 뒤 ${A2.dur}초 동안 기본 공격을 맞는다` : `쓴 뒤 ${A2.dur}초 동안 ${A2.tgt === 'party' ? '파티' : '자신'}의 ${SK_BUFF[A2.stat] || A2.stat} ${A2.mult ? skMul(1 + (A2.mult - 1) * L) : '+' + skPct(A2.add * L) + 'p'}`); });
  if (s.pcures || (s.kind === 'buff' && s.cures)) out.push(`파티의 ${(s.pcures || s.cures).map(k => STATUS[k] ? STATUS[k].name : k).join('·')} 해제`);   // 빌드 63: 정화 · 결의
  if (s.dk && STA_TYPE_IMM[s.dk]) out.push('언데드 · 골렘 · 원소에게는 안 듣는다');
  // 비용과 재사용 대기시간
  out.push(s.cost.hp ? `HP ${skPct(s.cost.hp)}${d ? ` (${skN(d.maxHp * s.cost.hp)})` : ''} 소모` : `MP ${s.cost.mp} 소모`);
  if (arrowSkill(s) && (!a || needsArrows(a))) out.push(`화살 ${s.tgt === 'all' ? `맞히는 적마다 ${s.kind === 'dmg' ? s.hits || 1 : 1}발 (여섯까지)` : `${arrowCost(s, 1)}발`} · 모자라면 못 씀`);
  if (s.thrown) out.push(`암기 ${s.tgt === 'all' ? `맞히는 적마다 ${s.hits || 1}개 (여섯까지)` : `${arrowCost(s, 1)}개`} · 부장비 칸의 암기가 모자라면 못 씀`);
  if (s.bolt) out.push(`볼트 ${arrowCost(s, 1)}발 · 손목 석궁과 볼트가 있어야 씀`);
  if (s.cd) {
    const eff = a ? skillCdOf(a, d, id, null) : s.cd;
    out.push(`재사용 ${skSec(s.cd)}${a && Math.abs(eff - s.cd) >= 0.05 ? ` → <b>${skSec(eff)}</b>` : ''}`);
  }
  if (a) out.push(`숙련 ${ml}/${SM_MAX}${ml ? ` (위력 +${ml * 3}% · 재사용 -${Math.round(ml * SM_CD * 100)}%)` : ` (쓸수록 위력 +3%, 재사용 -${Math.round(SM_CD * 100)}%씩)`}`);   // 빌드 69: 재사용은 SM_CD (2 → 1%)
  if (s.tier) out.push(`${s.tier}차 전직 후 배움`);
  if (lvLine) out.push(lvLine);
  return out;
}
const skillSpecLine = (id, a) => `<span class="sk-spec">${skillSpec(id, a).join(' · ')}</span>`;
// 기본 공격 설명 (모험가 창)
function basicSpec(a) {
  const d = derive(a), T = TR(a), magic = basicIsMagic(a), cd = basicCd(a, d, null), out = [];
  const base = magic ? d.matk * BASIC_MAGIC : d.atk * BASIC_MULT + (T.hybrid ? d.matk * T.hybrid * BASIC_MULT : 0);
  out.push(`${magic ? '마법 공격력' : '공격력'} ${skMul(magic ? BASIC_MAGIC : BASIC_MULT)}${T.hybrid ? ` + 마법 공격력 ${skMul(T.hybrid * BASIC_MULT)}` : ''}`);
  out.push(`한 방 약 <b>${skRange(base)}</b> (방어 0 기준)`);
  out.push(`대상 ${CLASSES[a.cls].act === 'arrow' || shootsArrows(a) ? SK_TGT.low : SK_TGT.front}`);
  out.push(`치명타 ${skPct(d.crit)} (×${Math.round(((T.critMul || 1.75) + (d.critDmg || 0)) * 100) / 100}${d.critOver ? ` — 50%를 넘은 ${skPct(d.critOver)}의 절반은 치명타 피해로` : ''})`);   // 빌드 69 상한
  const dbl = Math.min(CAP.double, (T.double || 0) + d.double); if (dbl) out.push(`연타 ${skPct(dbl)}`);
  if (T.aoe) out.push(`다른 적에게도 ${skMul(T.aoe)}`);
  if (T.pet) out.push(`동물 동료가 ${skPct(0.5 + T.pet)}로 함께 문다 (공격력 ${skMul((0.35 + T.pet) * BASIC_MULT)})`);
  out.push(`재사용 ${BASIC_CD}초 ÷ 공격 속도 ${skMul(d.spd)} = <b>${skSec(cd)}</b>`);
  if (needsArrows(a) && !shootsArrows(a)) out.push('활을 들면 기본 공격이 화살 사격이 된다 (화살 1발씩)');
  if (T.baImm) out.push('하늘에 떠 있어 기본 공격에 맞지 않는다 (혼자 남거나 와이번 강하 뒤 2초는 맞는다)');
  if (shootsArrows(a)) out.push(a.eq.ammo ? `화살 1발씩 · 남은 <b class="${ammoLeft(a.eq.ammo, a) ? '' : 'red-t'}">${ammoTag(a.eq.ammo, a)}</b> (0발이면 기본 공격·화살 스킬을 못 해요)` : '<span class="red-t">화살이 없어 기본 공격을 못 해요</span>');
  if (shootsArrows(a) && arrowEl(a)) { const G = GTYPES[a.eq.ammo.base], St = G.sta && STATUS[G.sta.k]; out.push(`${G.name}: 기본 공격과 속성 없는 화살 스킬이 ${elTag(G.el)} 속성${St ? ` · 맞힐 때 ${Math.round(G.sta.p * 100)}%로 ${St.name} ${G.sta.d}초` : ''}`); }
  const sh = a.eq && a.eq.off, SH = sh && GTYPES[sh.base];
  if (SH && SH.thrown && isAmmo(sh)) { const St = SH.sta && STATUS[SH.sta.k]; out.push(`암기: 기본 공격마다 하나를 더 던짐 (공격력 ${skMul(BASIC_MULT * SHURI_MUL)}${SH.el && SH.el !== 'none' ? ` · ${elTag(SH.el)} 속성` : ''}${St ? ` · ${Math.round(SH.sta.p * 100)}%로 ${St.name} ${SH.sta.d}초` : ''}${SH.pierce ? ' · 적 둘' : ''}) · 남은 ${ammoTag(sh, a)}`); }
  if (SH && SH.xbow) out.push(isAmmo(a.eq.bolt) ? `손목 석궁: 기본 공격마다 볼트 한 발을 더 쏨 (공격력 ${skMul(BASIC_MULT * XBOW_MUL)}) · 남은 <b class="${ammoLeft(a.eq.bolt, a) ? '' : 'red-t'}">${ammoTag(a.eq.bolt, a)}</b>` : '<span class="red-t">손목 석궁: 볼트 칸에 볼트가 없어 쏘지 못해요</span>');
  { const WR = wpnRune(a); if (WR && !shootsArrows(a)) { const St = WR.sta && STATUS[WR.sta.k]; out.push(`속성 대검: 맞으면 ${WR.el !== 'none' ? elTag(WR.el) + ' 속성 ' : ''}추가 피해 (기본 공격의 ${Math.round(ELEM_SWORD_MUL * 100)}%)${St ? ` · ${Math.round(WR.sta.p * 100)}%로 ${St.name} ${WR.sta.d}초` : ''}`); } }
  return out;
}
// 공격 속도·재사용 감소가 어디서 오는지 (능력치 탭)
function speedBreakdown(a) {
  const C = CLASSES[a.cls], d = derive(a), G = gearSum(a), P = passives(a), T = d.T, MF = mastFx(a);
  const parts = [`직업 ${skMul(C.spd)}`, `민첩 +${skPct(T.agi * 0.004)}`], pS = (P.spdPct || 0) - (MF.spdPct || 0), pC = (P.cdr || 0) - (MF.cdr || 0);
  if (pS > 1e-9) parts.push(`지속 스킬 +${skPct(pS)}`);
  if (MF.spdPct) parts.push(`숙련 +${skPct(MF.spdPct)}`);
  if (traitSum(a, 'spdPct')) parts.push(`특성 +${skPct(traitSum(a, 'spdPct'))}`);
  if (G.spdPct) parts.push(`룬 +${skPct(G.spdPct)}`);
  const cd = [];
  if (pC > 1e-9) cd.push(`지속 스킬 ${skPct(pC)}`);
  if (MF.cdr) cd.push(`숙련 ${skPct(MF.cdr)}`);
  if (traitSum(a, 'cdr')) cd.push(`특성 ${skPct(traitSum(a, 'cdr'))}`);
  if (G.cdr) cd.push(`룬 ${skPct(G.cdr)}`);
  return { spd: parts.join(' · '), cdr: cd.length ? cd.join(' · ') + (d.cdr >= CDR_MAX ? ` (상한 ${Math.round(CDR_MAX * 100)}%)` : '') : '없음 (지속 스킬 「전술」·특성 「전술가」·시간의 룬으로 늘어요)' };
}
// 스킬북이 어디서 나오는지 (도감·창고)
function bookFromText(id) {
  const s = SKILLS[id]; if (!s) return '';
  if (Object.values(CLASSES).some(C => C.innate === id)) return '직업 기본 스킬 (고용·전직하면 바로)';
  if (s.awk) return '각성';
  return bookSrcText(id) || '스킬북';   // 빌드 63: 모든 스킬북은 스킬북 단계(찢어진 · 낡은 · 빛바랜 · 신비한 …)를 펼쳐서 (data-store.js)
}

/* ───────── 전투 통계 (DPS 미터) ───────── */
// stats = e.stats(원정 중) 또는 p.last.stats(지난 원정), names = {id: 이름} (떠난 모험가용)
const SK_SRC = { basic: '기본 공격', counter: '반격', pet: '펫 행동', companion: '동물 동료', dot: '지속 피해', shuri: '암기', bolt: '손목 석궁', rsw: '속성 대검', mast: '숙련', reflect: '마석 반사', etc: '그 밖' };
function bstatName(who, names) {
  if (String(who).charAt(0) === 'P') { const pt = petById(+String(who).slice(1)); return pt ? `펫 ${pt.name}` : '펫'; }
  const a = advById(+who); return a ? a.name : (names && names[who]) || '?';
}
function bstatRows(stats, names) {
  const ids = Object.keys(stats || {});
  if (!ids.length) return '<div class="sub muted">아직 기록이 없어요. 전투가 벌어지면 누가 얼마나 때리고 맞았는지 여기에 쌓여요.</div>';
  const total = Math.max(1, ids.reduce((s, k) => s + (stats[k].dealt || 0), 0)), tk = Math.max(1, ids.reduce((s, k) => s + (stats[k].taken || 0), 0));
  return ids.sort((x, y) => (stats[y].dealt || 0) - (stats[x].dealt || 0)).map(k => {
    const r = stats[k], d = r.dealt || 0, top = Object.entries(r.sk || {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([sid, v]) => `${SKILLS[sid] ? SKILLS[sid].name : SK_SRC[sid] || sid} ${Math.round(v / Math.max(1, d) * 100)}%`).join(' · ');
    return `<div class="bst"><div class="row"><b class="grow">${esc(bstatName(k, names))}</b><span class="sub">준 피해 <b>${fmt(Math.round(d))}</b> · ${Math.round(d / total * 100)}%</span></div><div class="bar"><i style="width:${Math.round(d / total * 100)}%"></i></div><div class="sub muted">받은 피해 ${fmt(Math.round(r.taken || 0))} (${Math.round((r.taken || 0) / tk * 100)}%) · 치유 ${fmt(Math.round(r.healed || 0))} · 처치 ${r.kills || 0}${top ? `<br>${top}` : ''}</div></div>`;
  }).join('') + `<div class="sub muted">파티 전체 피해 ${fmt(Math.round(total))} · 받은 피해 ${fmt(Math.round(tk))}</div>`;
}
