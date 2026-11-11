/* ───────── 부장비 (빌드 38) ─────────
   계열마다 왼손에 드는 장비: 방패(전사·마부) · 화살통(궁수·정찰가) · 마법서(마법사) · 성표(성직자) · 표창(도적) · 등불(짐꾼).
   궁수 계열(활을 쏘는 직업)만 칸이 하나 더 있다 → 「화살」 칸.
   소모형(ammo: 1): 화살·표창. 담은 수(g.n, 없으면 가득)가 기본 공격마다 하나씩 준다. 다 써도 사라지지 않고 0으로 남고,
   상단에 돌아오면(arrive·wipe) 다시 가득 찬다. 화살이 0이면 궁수는 기본 공격도, 화살 스킬(fx 'arrow')도 못 쓴다. 표창은 기본 공격마다 하나를 더 던진다. */
SLOTS.splice(1, 0, ['off', '부장비'], ['ammo', '화살']);
Object.assign(GTYPES, {
  shield:   { name: '히터 방패', slot: 'off', cls: ['warrior', 'coachman'], st: { def: 1.8, hp: 6, block: 0.003 },     w: 3, icon: 'crest',   mat: [3, 1, 0] },
  quiver:   { name: '화살통', slot: 'off',  cls: ['archer', 'scout'],     st: { atk: 1.0, agi: 0.6, crit: 0.003 },      w: 1, icon: 'horn',    mat: [0, 3, 0], capPct: 0.25 },
  tome:     { name: '마법서', slot: 'off',  cls: ['mage'],                st: { matk: 2.4, int: 0.6, mp: 5 },            w: 2, icon: 'book',    mat: [0, 1, 3] },
  relic:    { name: '성표',   slot: 'off',  cls: ['cleric'],              st: { matk: 1.4, int: 0.5, vit: 0.4, mp: 3 },  w: 1, icon: 'amulet',  mat: [1, 0, 3] },
  shuriken: { name: '표창',   slot: 'off',  cls: ['rogue'],               st: { atk: 0.8, crit: 0.004 },                 w: 1, icon: 'blade',   mat: [2, 0, 0], ammo: 1, unit: '개' },
  lantern:  { name: '등불',   slot: 'off',  cls: ['porter'],              st: { def: 1.2, vit: 0.6, movePct: 0.005 },    w: 2, icon: 'potion',  mat: [2, 0, 1] },
  arrows:   { name: '화살',   slot: 'ammo', cls: ['archer', 'scout'],     st: { atk: 1.2 },                              w: 1, icon: 'feather', mat: [1, 1, 0], ammo: 1, unit: '발' },
  // 방패 종류 (빌드 39): 능력치는 히터 방패와 같고 모양·이름만 다르다. 그림 색은 단계 모습
  buckler:  { name: '원형 방패', slot: 'off', cls: ['warrior', 'coachman'], st: { def: 1.8, hp: 6, block: 0.003 },     w: 2, icon: 'crest',   mat: [2, 2, 0] },
  kite:     { name: '카이트 방패', slot: 'off', cls: ['warrior', 'coachman'], st: { def: 1.8, hp: 6, block: 0.003 },   w: 3, icon: 'crest',   mat: [3, 1, 0] },
  tower:    { name: '탑 방패', slot: 'off', cls: ['warrior', 'coachman'], st: { def: 1.8, hp: 6, block: 0.003 },       w: 4, icon: 'crest',   mat: [4, 1, 0] },
  // 빌드 40: 빌드 38 성기사 방패 모양 (모서리 둥근 네모 + 큰 십자) — 성기사가 처음 든다
  cross:    { name: '십자 방패', slot: 'off', cls: ['warrior', 'coachman'], st: { def: 1.8, hp: 6, block: 0.003 },     w: 3, icon: 'crest',   mat: [3, 1, 0] }
});
const SHIELDS = ['buckler', 'shield', 'kite', 'tower', 'cross'];
const isShield = g => !!g && SHIELDS.includes(g.base);
const OFF_IDS = ['shield', 'buckler', 'kite', 'tower', 'cross', 'quiver', 'tome', 'relic', 'shuriken', 'lantern', 'arrows'];
GTYPE_IDS.push(...OFF_IDS.filter(b => !SHIELDS.includes(b) || b === 'shield'));   // 떨어뜨리는 표에는 방패 하나만 (나올 때 종류를 고른다 → dropBase)
const dropBase = () => { const b = pickOne(GTYPE_IDS); return b === 'shield' ? pickOne(SHIELDS) : b; };
// 처음 받는 방패 종류: 직업 그림의 방패 모양 (검투사 원형 · 기사 카이트 · 성기사 십자(빌드 40, 전에는 탑)), 나머지는 히터. 마부 계열은 가벼운 원형
const SHIELD_OF = { gladiator: 'buckler', champion: 'buckler', knight: 'kite', paladin: 'cross', coachman: 'buckler', caravanmaster: 'buckler' };
const shieldOf = c => SHIELD_OF[c] || 'shield';
MASTERY.shield.w = SHIELDS.slice(); MASTERY.shield.wn = '방패';
/* 속성 화살 (빌드 39): 「화살」 칸에 끼운다. 기본 공격과 속성이 따로 없는 화살 스킬이 그 화살의 속성이 되고, 맞힐 때 낮은 확률로 상태이상.
   담는 양은 보통 화살의 60%, 값은 2배. 대장간에서 만들거나 사고, 같은 속성 몬스터한테서도 나온다.
   몬스터 장비 떨어뜨리기(GTYPE_IDS)에는 넣지 않는다 → 무기·갑옷이 덜 나오지 않게. 대장간 목록은 CRAFT_IDS */
const ELEM_ON = false;   // 빌드 39: 속성 화살은 나중에 다시 (켜면 아래 셋이 대장간·드롭·출발 고르기에 들어간다. 그림은 export_v39.py EL_ON)
const ELEM_ARROWS = ELEM_ON ? ['firearrows', 'icearrows', 'boltarrows'] : [];
if (ELEM_ON) Object.assign(GTYPES, {
  firearrows: { name: '불화살',    slot: 'ammo', cls: ['archer', 'scout'], st: { atk: 1.8 }, w: 1, icon: 'feather', mat: [1, 1, 1], ammo: 1, unit: '발', el: 'fire',    sta: { k: 'burn', p: 0.1, d: 6, m: 0.2 }, capMul: 0.6, priceMul: 2 },
  icearrows:  { name: '얼음 화살', slot: 'ammo', cls: ['archer', 'scout'], st: { atk: 1.8 }, w: 1, icon: 'feather', mat: [1, 1, 1], ammo: 1, unit: '발', el: 'ice',     sta: { k: 'chill', p: 0.1, d: 3 }, capMul: 0.6, priceMul: 2 },
  boltarrows: { name: '번개 화살', slot: 'ammo', cls: ['archer', 'scout'], st: { atk: 1.8 }, w: 1, icon: 'feather', mat: [1, 1, 1], ammo: 1, unit: '발', el: 'thunder', sta: { k: 'shock', p: 0.08, d: 2 }, capMul: 0.6, priceMul: 2 }
});
const CRAFT_IDS = GTYPE_IDS.flatMap(b => (b === 'shield' ? SHIELDS : [b])).concat(ELEM_ARROWS);   // 대장간 목록: 방패는 네 종류
const isArrowAmmo = g => !!g && !!GTYPES[g.base] && GTYPES[g.base].slot === 'ammo';
// 몬스터 속성 → 떨어뜨리는 속성 화살
const ARROW_OF_EL = { fire: 'firearrows', blaze: 'firearrows', ice: 'icearrows', thunder: 'boltarrows' };
const elemArrowOf = id => { if (!ELEM_ON) return null; for (const el of monEls(id)) if (ARROW_OF_EL[el]) return ARROW_OF_EL[el]; return null; };
PCT_STATS.push('block', 'movePct');
Object.assign(STAT_NAMES, { block: '방어 확률', movePct: '이동 속도' });
// 단계마다 담는 수 (품질 +10%씩, 화살통 +25%). 강철 화살 = 350발 — 레벨에 맞는 원정 한 번에 50~150발쯤 쓴다 (빌드 38에서 처음 1,000발 → 1/3로)
const AMMO_CAP = { arrows: [100, 200, 350, 450, 600, 750, 850, 1000, 1150, 1250, 1400, 1550, 1650, 1800, 1950, 2050], shuriken: [60, 120, 195, 285, 360, 435, 525, 600, 675, 765, 840, 915, 1005, 1080, 1155, 1245] };   // 표창은 빌드 39에서 1/3 → 빌드 63에서 1.5배 (사용자 「표창의 장전량을 좀 더 올려줘」)
const isAmmo = g => !!(g && GTYPES[g.base] && GTYPES[g.base].ammo);
function ammoMax(g, a) {
  if (!isAmmo(g)) return 0;
  const C = AMMO_CAP[g.base] || AMMO_CAP.arrows, base = C[Math.min(g.t, C.length - 1)] * (GTYPES[g.base].capMul || 1);
  const off = a && a.eq && a.eq.off, cap = isArrowAmmo(g) && off && GTYPES[off.base] ? GTYPES[off.base].capPct || 0 : 0;
  return Math.round(base * (1 + 0.1 * (g.q || 0)) * (1 + cap));
}
const ammoLeft = (g, a) => (isAmmo(g) ? (g.n == null ? ammoMax(g, a) : Math.max(0, Math.min(g.n, ammoMax(g, a)))) : 0);
const ammoUnit = g => (GTYPES[g.base] && GTYPES[g.base].unit) || '개';
const ammoTag = (g, a) => (isAmmo(g) ? `${fmt(ammoLeft(g, a))}/${fmt(ammoMax(g, a))}${ammoUnit(g)}` : '');
// 화살을 쓰는 직업 (화살 칸 · 화살 스킬이 화살을 쓴다): 궁수 계열(용기병 포함) · 정찰가 계열. 음유시인은 음표라서 아님
const needsArrows = a => !!a && !!CLASSES[a.cls] && (jobBase(a.cls) === 'archer' || chainOf(a.cls).includes('scout'));
// 기본 공격이 화살: 사격 직업은 늘, 창을 드는 용기병은 활을 들었을 때
const shootsArrows = a => needsArrows(a) && (CLASSES[a.cls].act === 'arrow' || !!(a.eq && a.eq.weapon && a.eq.weapon.base === 'bow'));
const hasAmmoSlot = a => needsArrows(a);
// 한 번에 n개를 쓴다 (모자라면 false, 아무것도 안 씀)
function useAmmo(g, a, n = 1) {
  const left = ammoLeft(g, a); if (left < n) return false;
  g.n = left - n; return true;
}
// 상단에 돌아오면 다시 채운다 (빌드 39: 쓴 만큼 돈을 낸다, 모자라면 낼 수 있는 만큼만). free면 공짜
function refillAmmo(a, free) {
  const r = { n: 0, cost: 0, short: 0 };
  for (const [s] of SLOTS) {
    const g = a.eq && a.eq[s]; if (!isAmmo(g) || g.n == null) continue;
    const max = ammoMax(g, a), left = ammoLeft(g, a), miss = max - left; if (miss <= 0) { g.n = null; continue; }
    const unit = ammoUnitPrice(g); let k = miss;
    if (!free) { const can = Math.floor(Math.max(0, S.gold) / unit); if (can < miss) { k = Math.max(0, can); r.short += miss - k; } }
    const c = free ? 0 : Math.ceil(k * unit);
    if (c) { S.gold -= c; S.stats.spent = (S.stats.spent || 0) + c; S.stats.ammoGold = (S.stats.ammoGold || 0) + c; }
    r.cost += c; r.n += k; g.n = k >= miss ? null : left + k;
  }
  return r;
}
// 파티가 돌아올 때 한 줄로 알린다
function refillParty(team, pname) {
  const t = { n: 0, cost: 0, short: 0 }; team.forEach(a => { const r = refillAmmo(a); t.n += r.n; t.cost += r.cost; t.short += r.short; });
  if (t.cost) log(`${pname}: 화살·표창 ${fmt(t.n)}개를 다시 채웠다 (−${fmt(t.cost)}G).`);
  if (t.short) log(`${pname}: 돈이 모자라 화살·표창 ${fmt(t.short)}개를 못 채웠다.`, 'bad');
  return t;
}
// 화살 스킬이 쏘는 발 수: 맞히는 적 수 × 연타 수 (모두 노리면 남은 적만큼, 여섯까지)
const arrowSkill = s => !!s && s.fx === 'arrow' && (s.kind === 'dmg' || s.kind === 'dot');
const arrowCost = (s, nFoes) => (s.tgt === 'all' ? Math.max(1, Math.min(6, nFoes || 1)) : 1) * (s.kind === 'dmg' ? s.hits || 1 : 1);
// 레벨에 맞는 화살 단계 (기본 6단계 안에서): 새 모험가·옛 저장
const arrowTierOf = lv => { let t = 0; for (let i = 0; i < Math.min(6, GTIERS.length); i++) if (lv >= GTIERS[i].lv) t = i; return t; };
const SHURI_MUL = 0.3;   // 표창 한 개 = 공격력 × 2.5(기본 공격) × 0.3 (빌드 39: 0.55 → 0.3)
// 대장간에서 바로 사기 (재료 없이): 값 = 장비 값 × 1.5
const ammoPrice = (base, t) => Math.round(gearValue({ base, t, q: 0 }) * 4.5 * (GTYPES[base].priceMul || 1) / 10) * 10;   // 빌드 39: 1.5 → 4.5배 (충전 값과 맞춘다)
// 상단에서 다시 채울 때 한 개 값 (빌드 39): 사는 값 ÷ 담는 수 — 쓴 만큼만 낸다
const ammoUnitPrice = g => ammoPrice(g.base, g.t) / Math.max(1, ammoMax({ base: g.base, t: g.t, q: 0 }));
// 끼운 화살의 속성·상태이상 (활을 쏠 때만)
const arrowEl = a => { const g = a && a.eq && a.eq.ammo; return (g && GTYPES[g.base] && GTYPES[g.base].el) || ''; };
const arrowSta = a => { const g = a && a.eq && a.eq.ammo; return (g && GTYPES[g.base] && GTYPES[g.base].sta) || null; };
// 출발할 때 갈 곳 몬스터에 맞는 화살로 바꿔 끼운다 (창고에 있는 것 중에서, 맞는 게 없으면 보통 화살). a.arrowLock이면 손대지 않는다
const ARROW_AUTO = true;
function pickArrows(a, fid) {
  if (!ELEM_ON || !ARROW_AUTO || !a || a.arrowLock || !needsArrows(a) || a.status !== 'idle') return '';
  const F = FIELDS[fid]; if (!F) return '';
  const ids = [...new Set([...(F.mons || []), ...(F.dungeon ? [...(F.dungeon.mons || []), F.dungeon.boss] : [])])].filter(id => id && MONS[id]);
  if (!ids.length) return '';
  const cur = a.eq.ammo, d = derive(a), base = d.atk - ((cur && gearStats(cur).atk) || 0);
  const mul = el => ids.reduce((t, id) => t + elemMul(el || 'none', { id }, a), 0) / ids.length;
  const val = g => (g ? mul(GTYPES[g.base].el) * (base + (gearStats(g).atk || 0)) : 0);
  const best = S.gear.filter(g => isArrowAmmo(g) && gearFits(a, g)).sort((x, y) => val(y) - val(x))[0];
  if (!best || val(best) <= val(cur) * 1.03) return '';
  equip(a.id, best.id);
  return best.base;
}
STORY.v40 = [
  '빌드 40: 칼을 든 모험가의 공격이 여러 장 동작이 되었다 — 내려베기·올려베기·횡베기·찌르기를 그때그때 바꿔 가며 휘두르고, 방패를 들었으면 방패로 밀기도 한다. 칼끝이 지나간 자리에 자취가 남는다.',
  '스킬은 스킬에 맞는 동작으로 나간다(강타 내려베기, 휩쓸기 횡베기, 방패 치기 방패 밀기, 돌격 찌르기 …). 여러 번 베는 스킬은 동작을 이어서 휘두르고, 칼이 닿는 때에 맞춰 숫자가 뜬다. 적의 공격을 방패로 막으면 방패를 내밀어 막는다.',
  '방패가 한 종류 더 — 십자 방패(빌드 38 성기사 방패 모양: 모서리가 둥근 네모에 큰 십자). 성기사가 처음 드는 방패가 되었다. 능력치는 다른 방패와 같다.'
];
STORY.v39 = [
  '빌드 39: 부장비가 모험가 그림에 보인다 — 방패, 등의 화살통(화살이 떨어지면 깃이 안 보인다), 떠다니는 마법서, 허리에 건 성표, 손에 쥔 표창, 등불. 표창은 빙글빙글 돌며 날아간다.',
  '방패가 네 종류가 되었다 — 원형·히터·카이트·탑 방패(능력치는 같고 모양만 다르다, 색은 단계 모습). 전사·마부 계열은 이제 방패를 들고 오고, 방패가 없던 모험가에게도 하나씩 나눠 주었다.',
  '무기·갑옷·장신구·가방·투기장 장비 그림을 새로 그렸다(단계마다 모습이 다르다). 진열대와 손님 손에도 그 그림이 올라간다. 화살·표창이 떨어지면 머리 위에 「화살 없음!」·「표창 없음!」이 뜬다.',
  '균형: 표창 추가 타격 공격력 ×0.55 → ×0.3(공격 +1.2 → +0.8), 화살 공격 +1.8 → +1.2, 화살통 +1.4 → +1.0, 방패 방어 +2.6 → +1.8·방어 확률 0.4% → 0.3%, 방패술 방어 5/10/15% → 4/7/10%·방어 확률 3/5/8 → 2/4/6%p, 성표 마법 +1.8 → +1.4 (모두 단계마다).',
  '화살·표창 충전에 돈이 든다: 상단에 돌아와 다시 채울 때 쓴 만큼 낸다(1개 값 = 사는 값 ÷ 담는 수). 대장간에서 사는 값은 3배가 되었다. 돈이 모자라면 낼 수 있는 만큼만 채운다.'
];
STORY.v38 = [
  '빌드 38: 부장비가 생겼다. 계열마다 왼손 장비 하나 — 전사·마부 계열 방패, 궁수 계열 화살통, 마법사 계열 마법서, 성직자 계열 성표, 도적 계열 표창, 짐꾼 계열 등불.',
  '궁수 계열(용기병 포함)과 활을 쏘는 정찰가·탐험가는 「화살」 칸이 하나 더 있다(강철 화살 350발). 기본 공격마다 화살 1발, 화살 스킬은 쏘는 만큼 쓴다. 다 쓰면 0발이 되어 기본 공격과 화살 스킬을 못 쓰고, 상단에 돌아오면 다시 가득 찬다. 용기병은 활을 들면 화살을 쏜다.',
  '표창은 기본 공격마다 하나를 더 던진다. 부장비는 대장간에서 만들고, 몬스터한테서도 나온다. 화살과 표창은 대장간에서 돈으로 살 수도 있다. 방패술은 이제 방패를 들었을 때 켜진다.'
];
