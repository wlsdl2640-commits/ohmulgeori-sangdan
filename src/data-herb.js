/* ───────── 약초와 회복 소모품 ─────────
   약초(herb: 1)는 필드에서 싸운 뒤 줍는다(F.herbs). 회복 소모품(sup: 1, cure: [상태이상])은 연금술 공방에서 약초로 만들고,
   원정 보급품으로 가져가면 그 상태이상에 걸린 모험가에게 저절로 쓴다. */
ITEMS.herb.name = '히포크리초';
ITEMS.herb.desc = '어디서나 자라는 기본 약초. 부상 처치와 모든 회복 소모품의 바탕이 된다.';
Object.assign(ITEMS, {
  waterherb:  { name: '수심초',      v: 24, w: 1, icon: 'leaf',   c: '#4a9ad8', herb: 1, desc: '물가 깊은 곳에서 자라는 풀. 독을 씻어 낸다.' },
  snowherb:   { name: '설빙초',      v: 28, w: 1, icon: 'leaf',   c: '#a8e0f8', herb: 1, desc: '눈 밑에서 자라는 차가운 풀. 화상을 식힌다.' },
  fireherb:   { name: '염화초',      v: 28, w: 1, icon: 'flower', c: '#f08a3a', herb: 1, desc: '뜨거운 땅에서 피는 붉은 꽃. 몸을 덥힌다.' },
  ethermoss:  { name: '에테르 이끼', v: 42, w: 1, icon: 'blob',   c: '#a8d8ff', herb: 1, desc: '마력이 고인 이끼. 마나 물약과 부적의 재료.' },
  boltbranch: { name: '벼락가지',    v: 48, w: 1, icon: 'branch', c: '#f0e04a', herb: 1, desc: '벼락 맞은 나무의 가지. 번개를 끌어당긴다.' },
  mandrake:   { name: '만드라고라',  v: 70, w: 1, icon: 'root',   c: '#c8a870', herb: 1, desc: '비명을 지르는 뿌리. 정신을 깨우고 기운을 돋운다.' },
  moonflower: { name: '달빛꽃',      v: 60, w: 1, icon: 'flower', c: '#e8e8ff', herb: 1, desc: '밤에만 피는 꽃. 상급 물약의 재료.' },
  bloodshroom:{ name: '핏빛 버섯',   v: 50, w: 1, icon: 'blob',   c: '#c03a3a', herb: 1, desc: '피처럼 붉은 버섯. 피를 만든다.' },
  // 회복 소모품
  antidote:   { name: '해독약',      v: 60,  w: 1, icon: 'potion', c: '#7ad83a', sup: 1, cure: ['poison'], desc: '중독을 푼다.' },
  salve:      { name: '화상 연고',   v: 60,  w: 1, icon: 'potion', c: '#ff8a2a', sup: 1, cure: ['burn'], desc: '화상을 식혀 끈다.' },
  warmer:     { name: '온열약',      v: 60,  w: 1, icon: 'potion', c: '#f0c060', sup: 1, cure: ['chill'], desc: '얼어붙은 몸을 덥혀 냉기를 푼다.' },
  ward:       { name: '피뢰 부적',   v: 80,  w: 1, icon: 'crest',  c: '#f0e04a', sup: 1, cure: ['shock'], desc: '감전을 땅으로 흘려보낸다.' },
  salts:      { name: '각성 소금',   v: 70,  w: 1, icon: 'ore',    c: '#f0f0f0', sup: 1, cure: ['para', 'stun'], desc: '코를 찌르는 냄새로 마비와 기절을 깨운다.' },
  tonic:      { name: '강장제',      v: 90,  w: 1, icon: 'potion', c: '#d8a0ff', sup: 1, cure: ['weak'], desc: '쇠약해진 몸에 기운을 돌려준다.' },
  panacea:    { name: '만병통치약',  v: 420, w: 1, icon: 'potion', c: '#ffffff', sup: 1, cure: ['poison', 'burn', 'chill', 'shock', 'para', 'stun', 'bleed', 'weak'], desc: '어떤 상태이상이든 하나 푼다.' }
});
Object.assign(ITEMS.bandage, { buy: 18, cure: ['bleed'], desc: '출혈을 멎게 한다. 보급품으로 가져가면 저절로 감는다.' });
const HERB_IDS = Object.keys(ITEMS).filter(k => ITEMS[k].herb);
const CURE_IDS = ['antidote', 'salve', 'warmer', 'ward', 'salts', 'bandage', 'tonic', 'panacea'];
const SUPPLY_IDS = POTIONS.concat(CURE_IDS);   // 원정 보급품으로 가져갈 수 있는 것
const cureName = ks => ks.length >= 8 ? '모든 상태이상' : ks.map(k => STATUS[k].name).join('·');

// 필드마다 주울 수 있는 약초
Object.assign(FIELDS.plains,   { herbs: ['herb', 'herb', 'bloodshroom'] });
Object.assign(FIELDS.forest,   { herbs: ['herb', 'waterherb', 'ethermoss'] });
Object.assign(FIELDS.mountain, { herbs: ['herb', 'boltbranch', 'bloodshroom'] });
Object.assign(FIELDS.valley,   { herbs: ['herb', 'boltbranch', 'moonflower'] });
Object.assign(FIELDS.snow,     { herbs: ['herb', 'snowherb', 'moonflower'] });
Object.assign(FIELDS.desert,   { herbs: ['herb', 'fireherb', 'mandrake'] });
Object.assign(FIELDS.sewer,    { herbs: ['herb', 'waterherb', 'bloodshroom'] });
Object.assign(FIELDS.swamp,    { herbs: ['waterherb', 'mandrake', 'ethermoss'] });
Object.assign(FIELDS.barren,   { herbs: ['fireherb', 'mandrake', 'bloodshroom'] });
Object.assign(FIELDS.castle,   { herbs: ['mandrake', 'moonflower', 'bloodshroom'] });
const herbFields = it => ALL_FIELDS.filter(f => (FIELDS[f].herbs || []).includes(it)).map(f => FIELDS[f].name);

// 연금술 공방 조제법: 약초가 바탕
RECIPES.length = 0;
RECIPES.push(
  { out: 'pot_s',    need: { herb: 2, slime_jelly: 1 },            fee: 6,   lv: 1 },
  { out: 'bandage',  need: { herb: 2, spider_silk: 1 },            fee: 5,   lv: 1 },
  { out: 'mp_s',     need: { ethermoss: 1, spore: 1 },             fee: 15,  lv: 1 },
  { out: 'pot_m',    need: { herb: 2, bloodshroom: 1, treant_sap: 1 }, fee: 20, lv: 1 },
  { out: 'antidote', need: { herb: 2, waterherb: 1 },              fee: 10,  lv: 1 },
  { out: 'salve',    need: { herb: 1, snowherb: 1 },               fee: 10,  lv: 1 },
  { out: 'warmer',   need: { herb: 1, fireherb: 1 },               fee: 10,  lv: 1 },
  { out: 'ward',     need: { boltbranch: 1, ethermoss: 1 },        fee: 20,  lv: 1 },
  { out: 'salts',    need: { mandrake: 1, herb: 1 },               fee: 20,  lv: 1 },
  { out: 'pot_l',    need: { moonflower: 1, mandrake: 1, lizard_scale: 1 }, fee: 60, lv: 2 },
  { out: 'mp_m',     need: { ethermoss: 2, frost_crystal: 1 },     fee: 60,  lv: 2 },
  { out: 'tonic',    need: { mandrake: 1, ethermoss: 1, bloodshroom: 1 }, fee: 30, lv: 2 },
  { out: 'panacea',  need: { mandrake: 2, moonflower: 1, ethermoss: 1 }, fee: 120, lv: 2 }
);
KINGDOMS.elves.sells.push('waterherb', 'ethermoss');
KINGDOMS.sarak.sells.push('fireherb');
KINGDOMS.dwarves.sells.push('boltbranch');

/* ───────── 창고 분류 ───────── */
const INV_CATS = [['mat', '부속품'], ['herb', '약초'], ['sup', '소모품'], ['book', '스킬북'], ['rune', '룬'], ['gear', '장비']];
function itemCat(k) {
  const I = ITEMS[k]; if (!I) return 'mat';
  if (I.herb) return 'herb';
  if (I.potion || I.sup || I.heal || I.mana || I.use) return 'sup';
  if (I.book) return 'book';
  if (k.startsWith('rune_')) return 'rune';
  return 'mat';
}
