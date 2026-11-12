/* 빌드 65 넷째 묶음 (11-12 20:34 사용자 「최소 가장싼 식재료 가격을 300원으로 그에 맞게 다 올리자 … 가격 조정하고 다 넣어」):
   식재료 · 요리 · 재배소 · 항구 · 펫 알 데이터. 시안 tools/saved/draft68 · 문서 「펫 · 알 · 재배소 · 식재료 · 요리 개편 시안」.
   값: 가장 싼 식재료(하르겐 감자 · 양파) 300G — 처음 제안 값 × 25. 파는 값 기준(v)은 사는 값의 1/5 (재배소에서 길러 팔아 남기지 못하게). */
const FOOD_PRICE_MUL = 25;
// 채소: id → [이름, 처음 제안 값, 파는 곳(하르겐 시장 | 왕국 id), 색, 설명]
const VEG68 = {
  hg_potato: ['하르겐 감자', 12, 'hargen', '#c8a060', '포슬포슬한 감자'],
  hg_onion: ['하르겐 양파', 12, 'hargen', '#d0883a', '단맛이 도는 양파'],
  hg_carrot: ['하르겐 당근', 14, 'hargen', '#e8802a', '아삭한 당근'],
  hg_cabbage: ['하르겐 양배추', 18, 'hargen', '#6ab84a', '겹겹이 단단한 양배추'],
  in_pea: ['기사단 완두', 30, 'inglisia', '#5aa83a', '꼬투리째 달콤한 완두'],
  in_turnip: ['잉그리시아 순무', 32, 'inglisia', '#9a4a9a', '보랏빛 어깨의 순무'],
  fr_tomato: ['프라마 토마토', 36, 'frama', '#d83a2a', '남쪽 햇볕에 익은 토마토'],
  fr_olive: ['햇살 올리브', 45, 'frama', '#7a8a2a', '기름이 도는 올리브'],
  el_lettuce: ['이슬 상추', 30, 'elves', '#8ad06a', '아침 이슬을 머금은 상추'],
  el_mush: ['실바레아 은버섯', 42, 'elves', '#c8c8e4', '은빛으로 반짝이는 버섯'],
  dw_beet: ['브론하임 비트', 34, 'dwarves', '#9a1a3a', '붉고 단단한 뿌리'],
  dw_garlic: ['바위 마늘', 38, 'dwarves', '#eeeae2', '바위틈에서 자란 매운 마늘'],
  sr_chili: ['모래 고추', 40, 'sarak', '#d82a1a', '혀가 타는 붉은 고추'],
  sr_cactus: ['선인장 열매', 44, 'sarak', '#d8306a', '가시를 벗기면 새콤달콤']
};
// 해산물: 항구에 들어오는 해상왕국 배에서만 판다
const SEA68 = {
  sea_mackerel: ['은빛 고등어', 72, '#5a8eaa', '등이 푸른 고등어'],
  sea_shrimp: ['붉은 새우', 64, '#e8683a', '통통한 새우'],
  sea_clam: ['가리비', 60, '#e6c4a2', '쫄깃한 관자의 조개'],
  sea_crab: ['꽃게', 90, '#d8502a', '살이 꽉 찬 게'],
  sea_squid: ['오징어', 70, '#f2d4dc', '쫄깃한 오징어'],
  sea_kelp: ['다시마', 60, '#4a5e34', '말린 바다 잎']
};
const FOOD_PRICE = {};   // 사는 값 (하르겐 시장 · 왕국 상단 · 항구 배)
const VEG_FROM = {};
Object.entries(VEG68).forEach(([k, [name, p0, from, c, d]]) => {
  const price = p0 * FOOD_PRICE_MUL; FOOD_PRICE[k] = price; VEG_FROM[k] = from;
  const where = from === 'hargen' ? '하르겐 시장' : `${KINGDOMS[from].name} 상단`;
  ITEMS[k] = { name, v: Math.round(price / 5), w: 1, icon: 'leaf', c, food: 1, veg: 1, g: from === 'hargen' ? 0 : 1, from, desc: `${d}. ${where}에서 판다 · 재배소에서 기를 수 있다.` };
});
Object.entries(SEA68).forEach(([k, [name, p0, c, d]]) => {
  const price = p0 * FOOD_PRICE_MUL; FOOD_PRICE[k] = price;
  ITEMS[k] = { name, v: Math.round(price / 5), w: 1, icon: 'blob', c, food: 1, sea: 1, g: 2, from: 'sea', desc: `${d}. 항구에 들어오는 해상왕국 배에서만 판다.` };
});
ITEMS.egg_none = { name: '무정란', v: 60, w: 1, icon: 'egg', c: '#f0e6d0', food: 1, g: 1, desc: '사육장에서 품었지만 깨어나지 않은 알 (무정란이었거나 부화에 실패했다). 요리 재료.' };
ITEMS.food_sus = { name: '수상한 죽', v: 5, w: 1, icon: 'potion', c: '#7a8a5a', food: 1, petFood: 1, g: 0, desc: '레시피에 없는 조합으로 끓인 죽. 효과는 없지만 펫은 그럭저럭 먹는다.' };
// 하르겐 시장 (주방 · 요리 화면의 「재료 사기」): 날고기 · 밀가루 · 향신료 · 꿀(예전 40 · 15 · 36 · 28 × 25) + 하르겐 채소 넷
Object.assign(KITCHEN_BUY, { raw_meat: 40 * FOOD_PRICE_MUL, flour: 15 * FOOD_PRICE_MUL, spice: 36 * FOOD_PRICE_MUL, honey: 28 * FOOD_PRICE_MUL });
Object.keys(VEG68).filter(k => VEG68[k][2] === 'hargen').forEach(k => { KITCHEN_BUY[k] = FOOD_PRICE[k]; });
Object.assign(FOOD_PRICE, KITCHEN_BUY);
ITEMS.raw_meat.desc = '짐승에게서 얻는 고기. 요리의 기본 재료. 하르겐 시장에서도 판다.';
ITEMS.flour.desc = '빵과 반죽의 재료. 하르겐 시장에서 판다.';
ITEMS.spice.desc = '음식에 불을 지핀다. 하르겐 시장에서 판다.';
ITEMS.honey.desc = '달콤한 꿀. 하르겐 시장에서 판다.';
ITEMS.egg_none.from = 'pen';
// 알은 품어 봐야 안다 (유정란 50%): 이름에 (?)
PET_IDS.forEach(k => { const P = PETS[k], I = ITEMS['egg_' + k]; if (!I) return; I.name = `${MONS[P.mon].name} 알 (?)`; I.desc = `사육장에서 ${PET_HATCH_DAYS}일 품으면 판정 — 유정란이고 부화에 성공하면 ${P.name}이(가) 태어나고, 아니면 요리 재료 「무정란」이 된다. ${P.desc}`; });

/* ───────── 요리 26가지 (재료와 그 수가 딱 맞아야 한다 · 넣는 차례는 상관없음 · 솥에 6개까지) ───────── */
const POT_MAX = 6;
const FOOD68 = {
  stew: { need: { raw_meat: 2, hg_potato: 1, hg_carrot: 1 } },
  mushsoup: { need: { el_mush: 2, flour: 1, hg_onion: 1 } },
  pudding: { need: { slime_jelly: 2, honey: 1 } },
  sandwich: { need: { flour: 2, raw_meat: 1, el_lettuce: 1 } },
  froglegs: { need: { frog_leg: 2, spice: 1, dw_garlic: 1 } },
  saptea: { need: { treant_sap: 1, honey: 1 } },
  riceball: { need: { flour: 2, hg_potato: 1 } },
  stirfry: { need: { raw_meat: 2, spice: 1, hg_onion: 1, sr_chili: 1 } },
  hotsoup: { need: { sr_chili: 2, raw_meat: 1, hg_onion: 1 } },
  shaveice: { need: { snowherb: 1, honey: 1, slime_jelly: 1, sr_cactus: 1 } },
  porridge: { need: { herb: 2, waterherb: 1, flour: 1 } },
  cookie: { need: { flour: 2, honey: 1, moonflower: 1 } },
  platter: { need: { raw_meat: 2, flour: 1, hg_potato: 1, in_pea: 1, spice: 1 } },
  feast: { need: { raw_meat: 2, spice: 1, mandrake: 1, moonflower: 1, honey: 1 } },
  omelet: { name: '감자 오믈렛', lv: 1, need: { egg_none: 2, hg_potato: 1, hg_onion: 1 }, c: '#f4c844', fx: { hp: 0.1, fat: 0.1 }, desc: '폭신한 오믈렛. 든든하고 덜 지친다.' },
  tomstew: { name: '토마토 스튜', lv: 2, need: { fr_tomato: 2, raw_meat: 1, fr_olive: 1, hg_onion: 1 }, c: '#d84a3a', fx: { hp: 0.1, atk: 0.06 }, desc: '새콤한 남쪽 스튜. 힘이 오른다.' },
  kpie: { name: '기사단 파이', lv: 2, need: { flour: 2, in_pea: 1, in_turnip: 1, raw_meat: 1 }, c: '#d8a050', fx: { def: 0.08, carry: 6 }, desc: '기사들의 행군 도시락. 몸이 단단해지고 짐을 더 진다.' },
  salad: { name: '숲의 샐러드', lv: 2, need: { el_lettuce: 2, el_mush: 1, fr_olive: 1 }, c: '#8ad06a', fx: { exp: 0.08, luck: 0.05 }, desc: '엘프식 샐러드. 머리가 맑아지고 운이 따른다.' },
  beetstew: { name: '드워프 비트 스튜', lv: 2, need: { dw_beet: 2, raw_meat: 1, dw_garlic: 1, spice: 1 }, c: '#9a1a3a', fx: { hp: 0.12, coldRes: 1 }, desc: '광부들의 붉은 스튜. 추위 디버프를 받지 않는다.' },
  cactusmochi: { name: '선인장 꿀떡', lv: 2, need: { sr_cactus: 2, honey: 1, flour: 1 }, c: '#e070a0', fx: { hotRes: 1, move: 0.06 }, desc: '사막의 쫀득한 떡. 더위 디버프를 받지 않는다.' },
  fishmeal: { name: '생선구이 정식', lv: 2, need: { sea_mackerel: 2, spice: 1, el_lettuce: 1 }, c: '#8ab0c8', fx: { crit: 0.05, move: 0.05 }, desc: '노릇한 고등어 구이. 손끝이 예민하고 발걸음이 가볍다.' },
  kelpsoup: { name: '다시마 국', lv: 2, need: { sea_kelp: 2, sea_clam: 1, egg_none: 1 }, c: '#5a7a48', fx: { regen: 0.003, sta: 0.3 }, desc: '시원한 바다 국. 상처가 아물고 상태이상이 짧아진다.' },
  crabsteam: { name: '꽃게 찜', lv: 3, need: { sea_crab: 2, dw_garlic: 1, sr_chili: 1 }, c: '#e0603a', fx: { def: 0.15 }, desc: '껍질째 찐 꽃게. 몸이 게딱지처럼 단단해진다.' },
  squidfry: { name: '오징어 볶음', lv: 3, need: { sea_squid: 2, sr_chili: 1, hg_onion: 1, hg_carrot: 1 }, c: '#e88a6a', fx: { atk: 0.1, crit: 0.04 }, desc: '매콤한 오징어 볶음. 손이 빨라진다.' },
  seasoup: { name: '해물 수프', lv: 3, need: { sea_mackerel: 1, sea_shrimp: 1, sea_clam: 1, hg_onion: 1 }, c: '#e0702a', fx: { matk: 0.1, hp: 0.05 }, desc: '바다를 끓인 수프. 마력이 차오른다.' },
  seafeast: { name: '해상왕의 만찬', lv: 3, need: { sea_crab: 1, sea_shrimp: 1, sea_clam: 1, sea_mackerel: 1, sea_squid: 1, spice: 1 }, c: '#f0a050', fx: { exp: 0.12, luck: 0.1, atk: 0.06, matk: 0.06 }, desc: '해상왕국 왕실의 상차림. 경험치와 전리품이 오른다.' }
};
Object.entries(FOOD68).forEach(([id, o]) => {
  if (FOODS[id]) { FOODS[id].need = o.need; FOODS[id].fee = 0; return; }
  FOODS[id] = Object.assign({ fee: 0 }, o); FOOD_IDS.push(id);
});
FOOD_IDS.forEach(id => { const F = FOODS[id]; F.fee = 0; ITEMS['food_' + id] = { name: F.name, v: Math.round(40 + vOfNeed(F.need) * 1.2), w: 1, icon: 'potion', c: F.c, dish: id, g: Math.min(4, F.lv), desc: `원정 도시락. ${F.desc}` }; });
const OLD_FOODS = ['stew', 'mushsoup', 'pudding', 'sandwich', 'froglegs', 'saptea', 'riceball', 'stirfry', 'hotsoup', 'shaveice', 'porridge', 'cookie', 'platter', 'feast'];   // 옛 저장은 이 14가지를 찾은 것으로
const potKey = list => { const m = {}; list.forEach(k => { m[k] = (m[k] || 0) + 1; }); return Object.keys(m).sort().map(k => `${k}:${m[k]}`).join(','); };
const needKey = need => Object.keys(need).sort().map(k => `${k}:${need[k]}`).join(',');
const RECIPE_OF = {}; FOOD_IDS.forEach(id => { RECIPE_OF[needKey(FOODS[id].need)] = id; });
const needCount = need => Object.values(need).reduce((s, n) => s + n, 0);
const needTxt = need => Object.entries(need).map(([k, q]) => `${ITEMS[k] ? ITEMS[k].name : k}${q > 1 ? ' ' + q : ''}`).join(' · ');
// 레시피 팔기 (11-12 19:57 「힌트 없이, 대신 각 왕국 상단 판매품에 그 왕국 식재료가 들어가는 요리의 레시피 · 하나에 10만」)
const RECIPE_PRICE = 100000;
const recipesOfKing = kid => FOOD_IDS.filter(id => Object.keys(FOODS[id].need).some(k => VEG_FROM[k] === kid));
const recipesOfSea = () => FOOD_IDS.filter(id => Object.keys(FOODS[id].need).some(k => ITEMS[k] && ITEMS[k].sea));
FOOD_IDS.forEach(id => { ITEMS['rcp_' + id] = { name: `${FOODS[id].name} 레시피`, v: 0, w: 0, icon: 'book', c: '#e8d8b0', recipe: id, g: 3, desc: `사면 바로 도감 「요리」에 적힌다 — ${needTxt(FOODS[id].need)}` }; });
// 펫이 먹는다: 수상한 죽은 모든 펫이 먹는다 (좋아하는 먹이처럼)
PET_IDS.forEach(k => { if (PETS[k] && PETS[k].likes && !PETS[k].likes.includes('food_sus')) PETS[k].likes.push('food_sus'); });

/* ───────── 약초(조제 재료) 드랍 등급 · 상점 ───────── */
const HERB_TIER = { herb: 0, waterherb: 0, snowherb: 0, fireherb: 0, ethermoss: 1, boltbranch: 1, bloodshroom: 1, moonflower: 2, mandrake: 2 };
const HERB_PICK = [0.02, 0.002, 0.0002];          // 필드 처치마다 줍는 확률 (예전 12%) — 하급 드물게 · 중급 극히 드물게 · 최상급 진짜 진짜 극히 드물게
const HERB_DROP_MUL = [1 / 6, 1 / 60, 1 / 600];   // 몬스터가 떨어뜨리는 약초도 같은 배율
const HERB_BOSS = 10;                             // 필드 우두머리 · 던전 주인은 ×10
const herbTier = k => (HERB_TIER[k] != null ? HERB_TIER[k] : ITEMS[k] && ITEMS[k].herb ? 1 : -1);
KINGDOM_IDS.forEach(k => { const D = KINGDOMS[k]; if (D.sells) D.sells = D.sells.filter(it => !(ITEMS[it] && ITEMS[it].herb && herbTier(it) > 0)); });   // 중급 · 최상급 약초는 상점에서 안 판다

/* ───────── 재배소 (비닐하우스, 최대 3동) ───────── */
const FARM = {
  n: 3, cost: [3000, 15000, 50000], rank: [1, 3, 5],   // 동을 짓는 값 · 열리는 랭크 (E · C · A)
  up: [0, 10000, 30000], plots: [4, 6, 8],             // 동 레벨 Lv1 ~ 3: 강화 값 · 밭 칸
  herbDays: [1, 2, 4], herbGet: [[3, 3], [2, 3], [1, 2]], herbLv: [1, 2, 3],
  vegDays: { hargen: 1, other: 2 }, vegGet: [3, 5]     // 채소: 하나 심으면 3 ~ 5개 (11-12 19:57)
};
BUILDINGS.farm = { name: '재배소', max: FARM.n, cost: FARM.cost, desc: '비닐하우스에서 약초와 채소를 기른다. 한 동씩 지어 최대 3동.', eff: lv => `비닐하우스 ${lv}동` };
BUILD_RANK.farm = FARM.rank[0];
BUILD_ORDER.splice(BUILD_ORDER.indexOf('kitchen') + 1, 0, 'farm');
const farmable = k => !!(ITEMS[k] && (ITEMS[k].veg || (ITEMS[k].herb && HERB_TIER[k] != null)));
const farmDays = k => (ITEMS[k].veg ? (VEG_FROM[k] === 'hargen' ? FARM.vegDays.hargen : FARM.vegDays.other) : FARM.herbDays[herbTier(k)]);
const farmLvNeed = k => (ITEMS[k].veg ? 1 : FARM.herbLv[herbTier(k)]);

/* ───────── 항구 (처음부터 열린 시설 · 해상왕국 배가 찾아온다) ───────── */
const PORT = { gap: [4, 6], stay: 1, stock: [6, 12], king: '해상왕국 코랄리아', ship: '산호호' };

/* ───────── 펫 알 (유정란 50% · 부화 30 ~ 70%, 실패하면 무정란) · 레어도 ───────── */
const PEN_FERTILE = 0.5, PEN_HATCH = [0.3, 0.4, 0.5, 0.6, 0.7];
const penHatch = () => PEN_HATCH[Math.max(0, Math.min(PEN_HATCH.length - 1, (S.bld.pen || 1) - 1))];
const PET_Q = [[50, 1], [30, 1.1], [14, 1.25], [5, 1.45], [0.9, 1.7], [0.1, 2.0]];   // 레어도: [나올 몫 %, 힘 · 상단 효과 배율]
const petQMul = pet => (PET_Q[(pet && pet.q) || 0] || PET_Q[0])[1];
function rollPetQ(lucky) {
  const one = () => { let r = rnd() * 100; for (let i = 0; i < PET_Q.length; i++) { if (r < PET_Q[i][0]) return i; r -= PET_Q[i][0]; } return 0; };
  const a = one(); return lucky ? Math.max(a, one()) : a;
}
STORY.v68 = [
  '펫 · 알: 펫 만렙은 Lv30, 진화도 Lv30에. Lv30 펫의 힘은 예전 Lv60과 같다. 알에서 태어날 때 레어도(일반 ~ 신화)가 정해지고, 레어도만큼 힘과 상단 효과가 커진다 (예전 펫은 일반).',
  '알은 품어 봐야 안다: 유정란일 확률 50%, 유정란도 부화 확률(사육장 Lv1 30% → Lv5 70%)을 넘어야 태어난다. 무정란이거나 부화에 실패하면 요리 재료 「무정란」이 된다. 사육장은 Lv5까지.',
  '알 드랍이 약 4분의 1로 줄었다. 용기수로 전직하려면 와이번 펫 Lv30이 하나 있어야 한다 (그 와이번이 탈것이 된다).',
  '재배소(비닐하우스, 최대 3동)에서 약초와 채소를 기른다. 대신 약초를 줍는 일은 아주 드물어졌고, 중급 · 최상급 약초는 상점에서 팔지 않는다.',
  '채소는 하르겐 시장(늘)과 왕국 상단(그 나라 특산), 해산물은 항구에 들어오는 해상왕국 배에서만 판다. 가장 싼 식재료가 300G.',
  '새 시설 「항구」(처음부터 열림, 본부 선술집 옆): 해상왕국 코랄리아의 배 「산호호」가 4 ~ 6일마다 들어와 하루 머문다.',
  '요리는 주방의 요리 화면에서 큰 구리솥에 재료를 하나씩 넣어 만든다. 재료와 그 수가 딱 맞아야 하고, 틀리면 수상한 죽. 레시피는 직접 찾거나 왕국 상단 · 해상왕국 배에서 하나에 100,000G에 산다. 찾은 레시피는 도감 「요리」에 적힌다.',
  '예전에 만들던 요리 14가지는 레시피를 아는 것으로 했다 (재료는 새 식재료로 바뀌었다 · 만드는 값은 없앰).'
];
STORY.farm = [
  '상단 뒤뜰에 비닐하우스를 세웠다. 본부의 「재배소」 장소에서 밭을 볼 수 있고, 아래 「재배소 1 · 2 · 3」 단추로 동을 넘긴다.',
  '창고의 약초나 채소 하나를 모종으로 심으면 자란다: 하급 약초 1일 → 3개 · 중급 2일 → 2 ~ 3개(동 Lv2) · 최상급 4일 → 1 ~ 2개(동 Lv3) · 하르겐 채소 1일 · 왕국 채소 2일 → 3 ~ 5개.',
  '동은 Lv3까지 강화해 밭을 4 → 6 → 8칸으로 늘린다. 「거두면 다시 심기」를 켜 두면 거둘 때 하나를 다시 심는다. 2동은 C랭크, 3동은 A랭크에 지을 수 있다.'
];
STORY.port = [
  '항구에 해상왕국 코랄리아의 배 「산호호」가 처음으로 들어왔다.',
  '해산물(고등어 · 새우 · 가리비 · 꽃게 · 오징어 · 다시마)은 이 배에서만 살 수 있다. 해산물이 들어가는 요리의 레시피도 하나에 100,000G에 판다.',
  '배는 하루만 머물고 떠나며, 4 ~ 6일 뒤 다시 온다. 본부의 「항구」 장소나 시설 창에서 장을 볼 수 있다.'
];
STORY.kitchen = [
  '주방을 지었다. 화덕에서 고기 굽는 냄새가 상단 위층까지 올라간다.',
  '주방의 요리 화면에서 큰 구리솥에 재료를 하나씩 넣어 요리한다. 재료와 그 수가 딱 맞아야 요리가 되고, 틀리면 수상한 죽이 끓는다. 레시피는 직접 찾거나 왕국 상단 · 항구의 배에서 산다 (찾은 레시피는 도감 「요리」).',
  '날고기는 짐승을 사냥하면 얻고, 주방 창의 하르겐 시장에서 날고기 · 밀가루 · 향신료 · 꿀 · 하르겐 채소를 산다. 왕국 특산 채소는 그 나라 상단이, 해산물은 항구의 배가 판다.',
  '원정대 창에서 파티마다 도시락을 고르면, 출발할 때 하나씩 들고 가서 원정 내내 효과가 이어진다.'
];
PETS.rat.desc = PETS.rat.desc.replace('들판에서 약초를 물어 온다', '재배소 일을 거들어 수확이 는다');
