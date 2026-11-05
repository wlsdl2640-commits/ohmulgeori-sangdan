/* ───────── 숙련 패시브: 초급 → 중급 → 상급 (빌드 37) ─────────
   무기술(w)은 그 무기·갑옷을 끼고 있을 때만, 지식·방패·운반(job)은 늘 켜져 있다.
   훈련소에서 돈을 내고 한 단계씩 배운다. 스킬 칸을 차지하지 않는다 → a.mast = { 숙련 id: 단계(1~3) }
   fx 글자: atkPct matkPct defPct hpPct mpPct crit block counter spdPct cdr carryPct movePct healPow
           exec(HP 30% 아래 적에게 주는 피해 +) · stun(기본 공격이 기절시킬 확률) · buffDur(강화 스킬 지속 시간 +) */
const MAST_TIERS = [
  { name: '초급', lv: 10, job: 1, fee: 1000 },
  { name: '중급', lv: 30, job: 2, fee: 5000 },
  { name: '상급', lv: 60, job: 3, fee: 20000 }
];
const MASTERY = {
  sword:  { name: '검술',      w: ['sword'],         icon: 'sword',  fx: [{ atkPct: 0.04 }, { atkPct: 0.08, crit: 0.01 }, { atkPct: 0.12, crit: 0.03 }], desc: '장검을 쥐는 법부터 베는 각도까지.' },
  axe:    { name: '도끼술',    w: ['axe'],           icon: 'axe',    fx: [{ atkPct: 0.05 }, { atkPct: 0.1 }, { atkPct: 0.15, exec: 0.1 }], desc: '무게를 실어 내리찍는다. 상급은 약해진 적을 끝낸다.' },
  blunt:  { name: '둔기술',    w: ['club', 'mace'],  icon: 'club',   fx: [{ atkPct: 0.03, defPct: 0.02 }, { atkPct: 0.06, defPct: 0.04 }, { atkPct: 0.1, defPct: 0.06, stun: 0.06 }], desc: '묵직하게 치고 버틴다. 상급은 기본 공격이 가끔 적을 기절시킨다.' },
  lance:  { name: '창술',      w: ['lance'],         icon: 'lance',  fx: [{ atkPct: 0.03, counter: 0.03 }, { atkPct: 0.06, counter: 0.05 }, { atkPct: 0.1, counter: 0.08 }], desc: '거리를 지키며 찌르고, 달려드는 적을 받아친다.' },
  bow:    { name: '궁술',      w: ['bow'],           icon: 'bow',    fx: [{ atkPct: 0.04, crit: 0.02 }, { atkPct: 0.08, crit: 0.03 }, { atkPct: 0.12, crit: 0.05 }], desc: '숨을 고르고 겨눈다. 급소를 꿰뚫는다.' },
  dagger: { name: '단검술',    w: ['dagger'],        icon: 'dagger', fx: [{ crit: 0.03, spdPct: 0.05 }, { crit: 0.05, spdPct: 0.08 }, { crit: 0.08, spdPct: 0.12 }], desc: '빠르고 날카롭게, 틈을 찌른다.' },
  lute:   { name: '연주법',    w: ['lute'],          icon: 'lute',   fx: [{ buffDur: 0.1, atkPct: 0.02 }, { buffDur: 0.2, atkPct: 0.04 }, { buffDur: 0.3, atkPct: 0.06, cdr: 0.04 }], desc: '노래(강화 스킬)가 더 오래 울린다.' },
  plate:  { name: '갑옷 숙련', w: ['plate'],         icon: 'armor',  fx: [{ hpPct: 0.04 }, { hpPct: 0.07, defPct: 0.03 }, { hpPct: 0.1, defPct: 0.06 }], desc: '무거운 판금 갑옷을 몸처럼 입는다.' },
  magic:  { name: '마법 지식', job: ['mage', 'cleric'], icon: 'book', fx: [{ matkPct: 0.04 }, { matkPct: 0.08, mpPct: 0.08 }, { matkPct: 0.12, mpPct: 0.15, cdr: 0.03 }], desc: '마력을 다루는 이론. 마법 공격력이 오르면 치유량도 함께 오른다.' },
  holy:   { name: '신성학',    job: ['cleric'],      icon: 'heart',  fx: [{ healPow: 0.05 }, { healPow: 0.1 }, { healPow: 0.15 }], desc: '기도와 의술. 치유·재생·보호막이 더 세진다.' },
  shield: { name: '방패술',    w: ['shield'],        icon: 'crest', fx: [{ defPct: 0.05, block: 0.03 }, { defPct: 0.1, block: 0.05 }, { defPct: 0.15, block: 0.08 }], desc: '방패를 세워 받아 막고 버틴다.' },
  carry:  { name: '운반술',    job: ['porter'],      icon: 'bag',    fx: [{ carryPct: 0.1 }, { carryPct: 0.2 }, { carryPct: 0.3, movePct: 0.05 }], desc: '짐을 꾸리고 나르는 요령. 상급은 발걸음도 빨라진다.' }
};
const MAST_IDS = Object.keys(MASTERY);
const MAST_MAX = MAST_TIERS.length;
// 배울 수 있는 직업: 무기술은 그 장비를 쓸 수 있는 직업(gearFits와 같은 계열 규칙), 나머지는 job 계열
const mastCls = k => { const M = MASTERY[k]; return M.w ? [...new Set(M.w.flatMap(w => GTYPES[w].cls))] : M.job; };
const canMast = (a, k) => !!MASTERY[k] && chainOf(a.cls).some(c => mastCls(k).includes(c));
const mastTier = (a, k) => Math.min(MAST_MAX, (a && a.mast && a.mast[k]) || 0);
const mastName = (k, t) => (t ? MAST_TIERS[t - 1].name + ' ' : '') + MASTERY[k].name;
// 효과가 켜지는 조건: 무기술은 그 장비를 끼고 있을 때만
const mastOn = (a, k) => { const M = MASTERY[k]; if (!M.w) return true; const g = a.eq && a.eq[GTYPES[M.w[0]].slot]; return !!g && M.w.includes(g.base); };
const mastCond = k => { const M = MASTERY[k]; return M.w ? `${jo(M.w.map(w => GTYPES[w].name).join('·'), '을', '를')} ${GTYPES[M.w[0]].slot === 'armor' ? '입었을' : '들었을'} 때` : '늘'; };
// 켜져 있는 숙련 효과의 합
function mastFx(a) {
  const out = {}; if (!a || !a.mast) return out;
  for (const k in a.mast) {
    const t = mastTier(a, k); if (!t || !MASTERY[k] || !mastOn(a, k)) continue;
    const f = MASTERY[k].fx[t - 1]; for (const s in f) out[s] = (out[s] || 0) + f[s];
  }
  return out;
}
// 장비 고르기에서 숙련한 무기·갑옷을 조금 더 쳐준다 (단계마다 +3, 장비 한 단계 = 10)
const mastGearBonus = (a, g) => { if (!a || !g || !a.mast) return 0; let t = 0; for (const k in a.mast) { const M = MASTERY[k]; if (M && M.w && M.w.includes(g.base)) t = Math.max(t, mastTier(a, k)); } return t * 3; };
STORY.v37 = [
  '빌드 37: 스킬 307개의 그림이 모두 새로 그려졌다(모험가 창의 스킬 육각 · 스킬 탭 목록).',
  '숙련이 생겼다. 검술·도끼술·둔기술·창술·궁술·단검술·연주법·갑옷 숙련은 그 무기·갑옷을 끼고 있을 때, 마법 지식·신성학·방패술·운반술은 늘 켜진다. 스킬 칸을 차지하지 않는다.',
  `훈련소에서 한 단계씩 배운다: ${MAST_TIERS.map(T => `${T.name} Lv${T.lv}${T.job > 1 ? '·' + T.job + '차 전직' : ''}·${T.fee.toLocaleString('ko-KR')}G`).join(' → ')}. 모험가 창 → 스킬 탭 → 숙련.`
];
