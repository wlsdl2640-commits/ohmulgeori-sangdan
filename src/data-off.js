/* ───────── 부장비 (빌드 38) ─────────
   계열마다 왼손에 드는 장비: 방패(전사·마부) · 화살통(궁수·정찰가) · 마법서(마법사) · 성표(성직자) · 표창(도적) · 등불(짐꾼).
   궁수 계열(활을 쏘는 직업)만 칸이 하나 더 있다 → 「화살」 칸.
   소모형(ammo: 1): 화살·표창. 담은 수(g.n, 없으면 가득)가 기본 공격마다 하나씩 준다. 다 써도 사라지지 않고 0으로 남고,
   상단에 돌아오면(arrive·wipe) 다시 가득 찬다. 화살이 0이면 궁수는 기본 공격도, 화살 스킬(fx 'arrow')도 못 쓴다. 표창은 기본 공격마다 하나를 더 던진다. */
SLOTS.splice(1, 0, ['off', '부장비'], ['ammo', '화살']);
Object.assign(GTYPES, {
  shield:   { name: '방패',   slot: 'off',  cls: ['warrior', 'coachman'], st: { def: 2.6, hp: 6, block: 0.004 },        w: 3, icon: 'crest',   mat: [3, 1, 0] },
  quiver:   { name: '화살통', slot: 'off',  cls: ['archer', 'scout'],     st: { atk: 1.4, agi: 0.6, crit: 0.003 },      w: 1, icon: 'horn',    mat: [0, 3, 0], capPct: 0.25 },
  tome:     { name: '마법서', slot: 'off',  cls: ['mage'],                st: { matk: 2.4, int: 0.6, mp: 5 },            w: 2, icon: 'book',    mat: [0, 1, 3] },
  relic:    { name: '성표',   slot: 'off',  cls: ['cleric'],              st: { matk: 1.8, int: 0.5, vit: 0.4, mp: 3 },  w: 1, icon: 'amulet',  mat: [1, 0, 3] },
  shuriken: { name: '표창',   slot: 'off',  cls: ['rogue'],               st: { atk: 1.2, crit: 0.004 },                 w: 1, icon: 'blade',   mat: [2, 0, 0], ammo: 1, unit: '개' },
  lantern:  { name: '등불',   slot: 'off',  cls: ['porter'],              st: { def: 1.2, vit: 0.6, movePct: 0.005 },    w: 2, icon: 'potion',  mat: [2, 0, 1] },
  arrows:   { name: '화살',   slot: 'ammo', cls: ['archer', 'scout'],     st: { atk: 1.8 },                              w: 1, icon: 'feather', mat: [1, 1, 0], ammo: 1, unit: '발' }
});
const OFF_IDS = ['shield', 'quiver', 'tome', 'relic', 'shuriken', 'lantern', 'arrows'];
GTYPE_IDS.push(...OFF_IDS);
PCT_STATS.push('block', 'movePct');
Object.assign(STAT_NAMES, { block: '방어 확률', movePct: '이동 속도' });
// 단계마다 담는 수 (품질 +10%씩, 화살통 +25%). 강철 화살 = 1,000발
const AMMO_CAP = { arrows: [300, 600, 1000, 1400, 1800, 2200, 2600, 3000, 3400, 3800, 4200, 4600, 5000, 5400, 5800, 6200], shuriken: [120, 240, 400, 560, 720, 880, 1040, 1200, 1360, 1520, 1680, 1840, 2000, 2160, 2320, 2480] };
const isAmmo = g => !!(g && GTYPES[g.base] && GTYPES[g.base].ammo);
function ammoMax(g, a) {
  if (!isAmmo(g)) return 0;
  const C = AMMO_CAP[g.base] || AMMO_CAP.arrows, base = C[Math.min(g.t, C.length - 1)];
  const off = a && a.eq && a.eq.off, cap = g.base === 'arrows' && off && GTYPES[off.base] ? GTYPES[off.base].capPct || 0 : 0;
  return Math.round(base * (1 + 0.1 * (g.q || 0)) * (1 + cap));
}
const ammoLeft = (g, a) => (isAmmo(g) ? (g.n == null ? ammoMax(g, a) : Math.max(0, Math.min(g.n, ammoMax(g, a)))) : 0);
const ammoUnit = g => (GTYPES[g.base] && GTYPES[g.base].unit) || '개';
const ammoTag = (g, a) => (isAmmo(g) ? `${fmt(ammoLeft(g, a))}/${fmt(ammoMax(g, a))}${ammoUnit(g)}` : '');
// 화살을 쓰는 직업: 기본 공격이 사격(act arrow)이고 궁수 계열 또는 정찰가 계열 (음유시인은 음표라서 아님)
const needsArrows = a => !!a && CLASSES[a.cls].act === 'arrow' && (jobBase(a.cls) === 'archer' || chainOf(a.cls).includes('scout'));
const hasAmmoSlot = a => GTYPE_IDS.some(b => GTYPES[b].slot === 'ammo' && gearFits(a, { base: b, t: 0 }));
// 한 번에 n개를 쓴다 (모자라면 false, 아무것도 안 씀)
function useAmmo(g, a, n = 1) {
  const left = ammoLeft(g, a); if (left < n) return false;
  g.n = left - n; return true;
}
// 상단에 돌아오면 다시 가득
function refillAmmo(a) { for (const [s] of SLOTS) { const g = a.eq && a.eq[s]; if (isAmmo(g)) g.n = null; } }
// 화살 스킬이 쏘는 발 수: 맞히는 적 수 × 연타 수 (모두 노리면 남은 적만큼, 여섯까지)
const arrowSkill = s => !!s && s.fx === 'arrow' && (s.kind === 'dmg' || s.kind === 'dot');
const arrowCost = (s, nFoes) => (s.tgt === 'all' ? Math.max(1, Math.min(6, nFoes || 1)) : 1) * (s.kind === 'dmg' ? s.hits || 1 : 1);
// 레벨에 맞는 화살 단계 (기본 6단계 안에서): 새 모험가·옛 저장
const arrowTierOf = lv => { let t = 0; for (let i = 0; i < Math.min(6, GTIERS.length); i++) if (lv >= GTIERS[i].lv) t = i; return t; };
const SHURI_MUL = 0.55;   // 표창 한 개 = 공격력 × 2.5(기본 공격) × 0.55
// 대장간에서 바로 사기 (재료 없이): 값 = 장비 값 × 1.5
const ammoPrice = (base, t) => Math.round(gearValue({ base, t, q: 0 }) * 1.5 / 10) * 10;
STORY.v38 = [
  '빌드 38: 부장비가 생겼다. 계열마다 왼손 장비 하나 — 전사·마부 계열 방패, 궁수 계열 화살통, 마법사 계열 마법서, 성직자 계열 성표, 도적 계열 표창, 짐꾼 계열 등불.',
  '궁수 계열(활을 쏘는 정찰가·탐험가 포함)은 「화살」 칸이 하나 더 있다. 기본 공격마다 화살 1발, 화살 스킬은 쏘는 만큼 쓴다. 다 쓰면 0발이 되어 기본 공격과 화살 스킬을 못 쓰고, 상단에 돌아오면 다시 가득 찬다.',
  '표창은 기본 공격마다 하나를 더 던진다. 부장비는 대장간에서 만들고, 몬스터한테서도 나온다. 화살과 표창은 대장간에서 돈으로 살 수도 있다. 방패술은 이제 방패를 들었을 때 켜진다.'
];
