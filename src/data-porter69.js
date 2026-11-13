/* 빌드 69 — 짐꾼 · 코네스토가의 회복 스킬을 운반 · 마차 · 야영 · 피로도 스킬로 (11-13 사용자: 16:49 「짐꾼, 코네스토가에 있는 회복관련 스킬은
   운반, 마차, 야영, 피로도 쪽으로 새롭게 스킬 능력, 이미지를 디자인해서 시안 주고」 → 17:41 「물통 돌리기 A · 웨건보급 A · 개척민의지혜 A로 확정」).
   스킬 id는 그대로(배운 모험가는 새 스킬로 이어진다), 이름 · 효과 · 그림만 바꾼다. 그림은 시안 저장소 dot/c_v69.py A안 → export_v67.py.
   - medkit 약상자 → 물통 돌리기: 파티 피로 −6(스킬 레벨만큼) · 6초 동안 공격 속도 +8%. 피로 20 넘은 동료가 있을 때만 쓴다(core.js pickSkill).
   - rations 비상식량 → 웨건 보급: 파티 화살 · 암기 · 볼트를 담는 수의 8%씩 채우고 10초 동안 공격력 · 마법 공격력 +10%. 마차를 끌고 왔으면 둘 다 1.5배.
   - pioneerwit 개척민의 지혜(이름 그대로): 야영 회복 +30% · 야영 밤습격 −50% · 웨건 야영이면 숙면 피로가 야영 1초마다 0.15씩 풀린다(core.js startCamp · stepCamp).
   - 코네스토가 특성 「개척민의 손」: 치유량 +6% → 피로 10% 덜 쌓임.
   - 셋 다 회복 스킬 묶음(HEAL_BOOK — 스킬북 한 칸 드물게)에서 뺀다.
   - shieldbag 보급품 나눠 주기 → 짐 덜어 주기 (11-13 20:28 사용자 「짐 덜어주기는 C안」 · 쿨감 손질과 함께): 동료들의 짐을 대신 짊어져 10초 동안 파티 재사용 +8%
     (목록 시트 제안 +12% → +8%), 짐 늘리기(짐 +%)만큼 오래 — 최대 1.5배(durCarry, core.js cast). 짐 패시브를 키우면 늘 켜지던 문제 때문에 재사용 16 → 24초.
     그림은 시안 저장소 dot/c_v69.py lighten2_c(불끈 팔 + 자루). */
function SK69(id, o) {
  const s = SKILLS[id]; if (!s) return null;
  Object.assign(s, o);
  for (const k of Object.keys(s)) if (s[k] === undefined) delete s[k];
  return s;
}
const PORTER69 = { medkit: '약상자', rations: '비상식량', pioneerwit: '개척민의 지혜', shieldbag: '보급품 나눠 주기' };   // 옛 이름 (알림 글)
SK69('medkit', { name: '물통 돌리기', kind: 'buff', stat: 'spd', mult: 1.08, dur: 6, tgt: 'party', cd: 15, cost: { mp: 8 }, fat: 6, fatNeed: 20,
  pct: undefined, cures: undefined, cure1: undefined, add: undefined,
  desc: '물통을 돌려 파티 모두의 피로를 6 덜고, 6초 동안 공격 속도를 8% 올린다. 피로가 20 넘은 동료가 있을 때 쓴다.' });
SK69('rations', { name: '웨건 보급', kind: 'buff', stat: 'atk', mult: 1.1, more: [{ stat: 'matk', mult: 1.1 }], dur: 10, tgt: 'party', cd: 22, cost: { mp: 28 }, ammo: 0.08, wagonMul: 1.5,
  pct: undefined, cure1: undefined, cures: undefined,
  desc: '웨건 짐칸을 열어 파티 모두의 화살 · 암기 · 볼트를 담는 수의 8%씩 채우고, 10초 동안 공격력 · 마법 공격력을 10% 올린다. 마차를 끌고 왔으면 둘 다 1.5배.' });
SK69('pioneerwit', { passive: { camp: 0.3, campAmb: 0.5, campSleep: 0.15 },
  desc: '야영 피로 회복이 30% 빨라지고, 야영 중 밤습격이 절반으로 준다. 웨건에서 자면 숙면 피로도 야영 1초마다 0.15씩 풀린다.' });
SK69('shieldbag', { name: '짐 덜어 주기', kind: 'buff', stat: 'cdr', add: 0.08, dur: 10, durCarry: 0.5, tgt: 'party', cd: 24, cost: { mp: 18 },
  pct: undefined, cure1: undefined, cures: undefined, mult: undefined,
  desc: '동료들의 짐을 대신 짊어져 10초 동안 파티의 스킬 재사용 대기시간이 8% 더 빨리 돈다. 짐 늘리기(짐 +%)만큼 오래 간다 — 최대 1.5배.' });
['medkit', 'rations', 'pioneerwit', 'shieldbag'].forEach(id => HEAL_BOOK.delete(id));
// 코네스토가 특성: 치유 스킬이 없어져 치유량 대신 피로
Object.assign(JOB_TRAITS.conestoga, { desc: '짐 +6 · 피로 10% 덜 쌓임', fatigue: 0.1 }); delete JOB_TRAITS.conestoga.healPow;
if (TRAITS.j_conestoga) { Object.assign(TRAITS.j_conestoga, { desc: '짐 +6 · 피로 10% 덜 쌓임', fatigue: 0.1 }); delete TRAITS.j_conestoga.healPow; }
CLASSES.conestoga.desc = '포장마차를 끄는 개척민. 웨건을 세워 파티를 지키고, 웨건 짐칸을 열어 화살 · 암기 · 볼트를 채우고, 긴 채찍으로 적을 묶는다. 짐 +35% · 속도 +10%, 야영 회복 2배.';
// 웨건 보급: 원정 중에 화살 · 암기 · 볼트를 담는 수의 pct만큼 채운다 (상단에서 채우는 것과 달리 공짜). 채운 수를 돌려준다
function ammoTop(a, pct) {
  let n = 0;
  for (const [sl] of SLOTS) {
    const g = a.eq && a.eq[sl]; if (!isAmmo(g) || g.n == null) continue;
    const max = ammoMax(g, a), left = ammoLeft(g, a), add = Math.min(max - left, Math.ceil(max * pct));
    if (add <= 0) continue;
    g.n = left + add >= max ? null : left + add; n += add;
  }
  return n;
}
// 탄약이 절반 아래인가 (웨건 보급을 먼저 쓰는 때)
const ammoLow = a => SLOTS.some(([sl]) => { const g = a.eq && a.eq[sl]; return isAmmo(g) && g.n != null && ammoLeft(g, a) < ammoMax(g, a) * 0.5; });
STORY.v69b.push('짐꾼 계열 스킬도 바뀌었다: 약상자는 「물통 돌리기」(파티 피로를 덜고 공격 속도 +8%), 코네스토가의 비상식량은 「웨건 보급」(화살 · 암기 · 볼트를 채우고 공격력 · 마법 +10%, 마차가 있으면 1.5배), 개척민의 지혜는 야영 스킬(야영 회복 +30% · 밤습격 절반 · 웨건에서 자면 숙면 피로도 풀림)이 됐다. 보급품 나눠 주기는 「짐 덜어 주기」(동료들의 짐을 대신 져 파티 스킬 재사용 +8%)가 됐다. 배운 모험가는 그대로 새 스킬을 쓴다.');
