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

/* ───────── 룬: 장비 등급마다 한 칸씩 열린 룬 슬롯에 끼운다 ─────────
   빌드 64 룬 개편 (사용자 11-11 22:02 「하나의 룬에 두가지 효과 · 어디에 쓰는지에 따라 효과가 달라지게」 · 21:34 「각 룬마다 최상급룬도」):
   19종 × 하급 · 중급 · 상급 · 최상급. 무기에 새기면 w(때리는 쪽), 부장비 · 방어구 · 장신구 · 가방에 새기면 a(막는 쪽).
   옛 17종은 같은 등급의 합친 룬으로 (체력 → 강인 · 민첩 → 영민 · 수호 → 공방 · 결계 → 마력 · 내화 · 내한 · 피뢰 → 화염 · 냉기 · 번개 · 정결 → 어둠, migrate13).
   그림 = data-itemart.js rn_<룬>_<등급> (tools/saved/itemart63/export_itemart.py) */
const EL4 = [0.05, 0.1, 0.18, 0.3], ER4 = [0.04, 0.08, 0.14, 0.24];   // 속성 피해 · 속성 저항
const RUNES = {
  str:   { name: '강인',   c: '#e0503f', w: { st: 'str', v: [2, 5, 10, 18] },                a: { st: 'vit', v: [2, 5, 10, 18] } },
  int:   { name: '영민',   c: '#5a8af0', w: { st: 'int', v: [2, 5, 10, 18] },                a: { st: 'mpRegen', v: [0.08, 0.15, 0.25, 0.4] } },   // MP 회복 속도
  atk:   { name: '공방',   c: '#d09050', w: { st: 'atk', v: [4, 10, 20, 36] },               a: { st: 'def', v: [3, 8, 16, 28] } },
  matk:  { name: '마력',   c: '#b86af0', w: { st: 'matk', v: [4, 10, 20, 36] },              a: { st: 'mres', v: [0.02, 0.04, 0.07, 0.12] } },
  crit:  { name: '예리함', c: '#f7e04a', w: { st: 'crit', v: [0.01, 0.02, 0.04, 0.07] },     a: { st: 'bblock', v: [0.01, 0.02, 0.04, 0.07] } },   // 기본 공격만 막는다 (block은 스킬도 막음)
  eva:   { name: '바람',   c: '#8ad8ff', w: { st: 'hit', v: [0.01, 0.02, 0.04, 0.07] },      a: { st: 'eva', v: [0.01, 0.02, 0.04, 0.07] } },      // 명중: 몬스터 회피 −%p
  haste: { name: '신속',   c: '#ffe08a', w: { st: 'spdPct', v: [0.03, 0.06, 0.1, 0.16] },    a: { st: 'movePct', v: [0.03, 0.06, 0.1, 0.16] } },
  time:  { name: '시간',   c: '#c8a8ff', w: { st: 'cdr', v: [0.02, 0.04, 0.07, 0.12] },      a: { st: 'ccRes', v: [0.05, 0.1, 0.18, 0.3] } },     // 스킬 재사용 · 행동 방해 시간 −%
  flash: { name: '섬광',   c: '#fff4c8', w: { st: 'blindHit', v: [0.01, 0.02, 0.04, 0.07] }, a: { st: 'blindRes', v: [0.1, 0.2, 0.35, 0.6] } },   // 기본 공격에 눈멂 4초 · 눈멂에 안 걸림
  heal:  { name: '치유',   c: '#7ae07a', w: { st: 'healPow', v: EL4 },                       a: { st: 'rheal', v: EL4 } },                        // 주는 회복 · 받는 회복
  hp:    { name: '생명',   c: '#ff7a8a', w: { st: 'lifesteal', v: [0.01, 0.02, 0.04, 0.06] }, a: { st: 'hp', v: [20, 50, 100, 180] } },
  mana:  { name: '마나',   c: '#6a78ff', w: { st: 'mpRegen', v: [0.08, 0.15, 0.25, 0.4] },   a: { st: 'mpPct', v: [0.04, 0.08, 0.14, 0.24] } },
  fire:  { name: '화염',   c: '#ff9a5a', w: { st: 'd_fire', v: EL4 },    a: { st: 'r_fire', v: ER4 } },
  cold:  { name: '냉기',   c: '#8ad0ff', w: { st: 'd_water', v: EL4 },   a: { st: 'r_water', v: ER4 } },
  bolt:  { name: '번개',   c: '#f0e070', w: { st: 'd_thunder', v: EL4 }, a: { st: 'r_thunder', v: ER4 } },
  wind:  { name: '폭풍',   c: '#4ad8c0', w: { st: 'd_wind', v: EL4 },    a: { st: 'r_wind', v: ER4 } },
  earth: { name: '대지',   c: '#c8a060', w: { st: 'd_earth', v: EL4 },   a: { st: 'r_earth', v: ER4 } },
  holy:  { name: '성광',   c: '#ffe8a0', w: { st: 'd_light', v: EL4 },   a: { st: 'r_light', v: ER4 } },
  dark:  { name: '어둠',   c: '#9a6ae8', w: { st: 'd_dark', v: EL4 },    a: { st: 'r_dark', v: ER4 } }
};
const RUNE_IDS = Object.keys(RUNES), RUNE_LV = ['하급', '중급', '상급', '최상급'], RUNE_TOP = RUNE_LV.length - 1;
RUNE_IDS.forEach(k => RUNE_LV.forEach((n, l) => { ITEMS[`rune_${k}_${l}`] = { name: `${n} ${RUNES[k].name}의 룬`, v: [80, 320, 1200, 4800][l], w: 1, icon: 'rune', c: RUNES[k].c, rune: [k, l] }; }));
const runeId = (k, l) => `rune_${k}_${l}`;
const runeSide = g => (g && GTYPES[g.base] && GTYPES[g.base].slot === 'weapon' ? 'w' : 'a');   // 무기 = 때리는 쪽, 나머지 = 막는 쪽
const runeFx = (k, side) => RUNES[k] && RUNES[k][side === 'w' ? 'w' : 'a'];
const runeStat = (rid, side) => { const R = ITEMS[rid] && ITEMS[rid].rune, F = R && runeFx(R[0], side); return F ? { [F.st]: F.v[R[1]] } : {}; };
// 룬으로 쌓는 새 능력치의 상한 (장비 전체 합, d = 속성 피해 하나마다). 기존 능력치(회피 · 치명 · 저항 · 재사용)는 원래 상한을 쓴다
const RUNE_CAP = { hit: 0.3, bblock: 0.6, ccRes: 0.6, blindHit: 0.3, blindRes: 0.9, healPow: 1, rheal: 1, lifesteal: 0.3, mpRegen: 2, mpPct: 1, d: 1 };
const RUNE_BLIND = 4;   // 섬광 룬(무기)이 거는 눈멂 초 (우두머리는 절반)
/* 세트 효과는 없앴다 (빌드 65, 사용자 11-12 10:29 「이제 세트효과는 삭제야」) — 같은 단계 방어구 · 장신구를 함께 껴도 아무 효과 없음.
   단계 이름(숲지기 · 서리 …)은 방어구 · 장신구에 그대로 (tierNamed · gearBaseName, data-rpg.js). */
/* ───────── 옵션 재감정: 희귀 이상 장비의 보너스 능력치를 마탑에서 다시 뽑는다 ───────── */
const REAPPRAISE = { fee: t => Math.round(150 * GTIERS[t].p), crest: 1 };
const RUNE_FUSE = { n: 9, fee: [600, 2500, 10000] };     // 마탑 룬 합성: 같은 단계 룬 9개(종류는 섞어도 됨) → 한 단계 위 하나 (빌드 67 · store.js rf* — 예전엔 같은 룬 3개)
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
