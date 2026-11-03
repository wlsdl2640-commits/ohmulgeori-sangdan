/* ───────── v0.7: 보스 부속품 · 보스 장비 · 룬 · 유물 ───────── */
// 필드마다 보스 전용 부속품이 셋: 우두머리의 증표(1-10~1-40), 주인의 핵(1-50), 던전 주인의 혼
const BOSS_NAMES = {
  plains:   ['들판 우두머리의 증표', '평원 주인의 핵', '들쥐왕의 혼'],
  forest:   ['숲 우두머리의 증표', '원시림 주인의 핵', '늙은 트렌트의 혼'],
  mountain: ['바위 우두머리의 증표', '검은바위산 주인의 핵', '바위거인의 혼'],
  valley:   ['바람 우두머리의 증표', '바람계곡 주인의 핵', '폭풍 와이번의 혼'],
  snow:     ['설원 우두머리의 증표', '만년설산 주인의 핵', '설녀 여왕의 혼'],
  desert:   ['모래 우두머리의 증표', '사막 주인의 핵', '거대 샌드웜의 혼']
};
const BOSS_COL = ['#c8a050', '#5fbf7a', '#a89a8a', '#7ab8ff', '#bfe8ff', '#f0c24a'];
FIELD_IDS.forEach((fid, t) => {
  const [a, b, c] = BOSS_NAMES[fid];
  ITEMS['crest_' + t] = { name: a, v: 60 * (t + 1), w: 1, icon: 'crest', c: BOSS_COL[t], boss: 1 };
  ITEMS['core_' + t] = { name: b, v: 220 * (t + 1), w: 2, icon: 'core', c: BOSS_COL[t], boss: 2 };
  ITEMS['soul_' + t] = { name: c, v: 900 * (t + 1), w: 1, icon: 'soul', c: BOSS_COL[t], boss: 3 };
});
const isBossPart = k => !!(ITEMS[k] && ITEMS[k].boss);

// 보스 장비: 그 등급을 반드시 얻는다. 일반 재료 × mat, 보스 부속품, 제작비 × fee
const BOSS_RECIPE = {
  3: { mat: 1.5, crest: 2, core: 0, soul: 0, fee: 2,  smith: 1 },   // 영웅
  4: { mat: 2,   crest: 4, core: 1, soul: 0, fee: 3,  smith: 3 },   // 전설
  5: { mat: 2,   crest: 6, core: 3, soul: 1, fee: 5,  smith: 5 },   // 신화
  6: { mat: 3,   crest: 8, core: 6, soul: 2, fee: 10, smith: 7 }    // 신성
};
function bossNeed(base, t, q) {
  const B = BOSS_RECIPE[q], need = {};
  Object.entries(recipeNeed(base, t)).forEach(([k, n]) => { need[k] = Math.ceil(n * B.mat); });
  if (B.crest) need['crest_' + t] = B.crest;
  if (B.core) need['core_' + t] = B.core;
  if (B.soul) need['soul_' + t] = B.soul;
  return need;
}

/* ───────── 룬: 장비 등급마다 한 칸씩 열린 룬 슬롯에 끼운다 ───────── */
const RUNES = {
  str:  { name: '힘',     st: 'str',  v: [2, 5, 10],         c: '#e0503f' },
  vit:  { name: '체력',   st: 'vit',  v: [2, 5, 10],         c: '#e0a03f' },
  agi:  { name: '민첩',   st: 'agi',  v: [2, 5, 10],         c: '#5ac84a' },
  int:  { name: '지능',   st: 'int',  v: [2, 5, 10],         c: '#5a8af0' },
  atk:  { name: '공격',   st: 'atk',  v: [4, 10, 20],        c: '#f08a3c' },
  matk: { name: '마력',   st: 'matk', v: [4, 10, 20],        c: '#b86af0' },
  def:  { name: '수호',   st: 'def',  v: [3, 8, 16],         c: '#9aa0a8' },
  hp:   { name: '생명',   st: 'hp',   v: [20, 50, 100],      c: '#ff7a8a' },
  crit: { name: '예리함', st: 'crit', v: [0.01, 0.02, 0.04], c: '#f7e04a' },
  eva:  { name: '바람',   st: 'eva',  v: [0.01, 0.02, 0.04], c: '#8ad8ff' },
  haste: { name: '신속',  st: 'spdPct', v: [0.03, 0.06, 0.1],  c: '#ffe08a' },   // 공격 속도 → 기본 공격 대기시간 ↓
  time: { name: '시간',   st: 'cdr',  v: [0.02, 0.04, 0.07], c: '#c8a8ff' }    // 스킬 재사용 감소
};
const RUNE_IDS = Object.keys(RUNES), RUNE_LV = ['하급', '중급', '상급'];
RUNE_IDS.forEach(k => RUNE_LV.forEach((n, l) => { ITEMS[`rune_${k}_${l}`] = { name: `${n} ${RUNES[k].name}의 룬`, v: [80, 320, 1200][l], w: 1, icon: 'rune', c: RUNES[k].c, rune: [k, l] }; }));
const runeId = (k, l) => `rune_${k}_${l}`;
/* ───────── 세트 효과: 같은 단계 장비를 3·4점 끼면 ───────── */
const SET_BONUS = { 3: { name: '3점 세트', atkPct: 0.05, matkPct: 0.05, defPct: 0.05 }, 4: { name: '4점 세트', atkPct: 0.08, matkPct: 0.08, defPct: 0.08, hpPct: 0.06 } };
// 끼고 있는 장비 가운데 가장 많은 같은 단계: { t, n, bonus }
function setInfo(a) {
  const cnt = {};
  for (const [sl] of SLOTS) { const g = a.eq && a.eq[sl]; if (g) cnt[g.t] = (cnt[g.t] || 0) + 1; }
  let best = null;
  for (const t in cnt) if (!best || cnt[t] > best.n || (cnt[t] === best.n && +t > best.t)) best = { t: +t, n: cnt[t] };
  if (!best) return { t: -1, n: 0, bonus: null };
  return { t: best.t, n: best.n, bonus: best.n >= 4 ? SET_BONUS[4] : best.n >= 3 ? SET_BONUS[3] : null };
}
const setBonusText = B => B ? Object.entries(B).filter(([k]) => k !== 'name').map(([k, v]) => `${{ atkPct: '공격력', matkPct: '마법 공격력', defPct: '방어력', hpPct: '최대 HP' }[k] || k} +${Math.round(v * 100)}%`).join(' · ') : '';
/* ───────── 옵션 재감정: 희귀 이상 장비의 보너스 능력치를 마탑에서 다시 뽑는다 ───────── */
const REAPPRAISE = { fee: t => Math.round(150 * GTIERS[t].p), crest: 1 };
const RUNE_FUSE = { n: 3, fee: [600, 2500] };            // 같은 룬 3개 → 한 단계 위 (마탑)
const RUNE_CARVE = { crest: 2, fee: 300 };               // 증표 2개 + 300G → 하급 룬 (마탑)

/* ───────── 유물: 던전 주인을 쓰러뜨리면 하나씩 (상단 전체에 효과) ───────── */
const RELICS = {
  plains:   { name: '들쥐왕의 금관',          desc: '부속품을 얻을 확률 +10%',                      drop: 0.1 },
  forest:   { name: '세계수의 새싹',          desc: '상단에서 쉬는 동안 회복·치료·숙면 +30%',      rest: 0.3 },
  mountain: { name: '드워프 장인의 망치',     desc: '대장간 제작비 -20%, 좋은 품질이 더 잘 나온다', smith: 0.2 },
  valley:   { name: '폭풍 와이번의 깃털',     desc: '모험가 이동속도 +10%',                         move: 0.1 },
  snow:     { name: '설녀 여왕의 얼음 왕관',  desc: '모험가가 받는 피해 -8%',                       guard: 0.08 },
  desert:   { name: '왕릉의 황금 가면',       desc: '상점 판매 가격 +10%',                          price: 0.1 }
};
const relic = k => (S && S.relics ? S.relics.reduce((s, f) => s + ((RELICS[f] && RELICS[f][k]) || 0), 0) : 0);
