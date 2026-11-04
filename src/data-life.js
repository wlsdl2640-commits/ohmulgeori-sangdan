/* ───────── 빌드 31: 계절과 날씨 · 요리 · 교역로 (데이터) ───────── */

/* 계절: 3~5월 봄 · 6~8월 여름 · 9~11월 가을 · 12~2월 겨울 */
const SEASONS = [{ id: 'spring', name: '봄' }, { id: 'summer', name: '여름' }, { id: 'autumn', name: '가을' }, { id: 'winter', name: '겨울' }];
const seasonOfMonth = m => (m >= 3 && m <= 5 ? 0 : m >= 6 && m <= 8 ? 1 : m >= 9 && m <= 11 ? 2 : 3);
// 하늘: wet(비·폭설 — 모닥불을 못 피운다) · move(이동 속도 배율)
const WX_SKY = {
  clear:   { name: '맑음',     icon: 'sun' },
  cloud:   { name: '흐림',     icon: 'cloud' },
  fog:     { name: '안개',     icon: 'fog' },
  rain:    { name: '비',       icon: 'rain',  wet: 1, move: 0.95 },
  monsoon: { name: '장마',     icon: 'rain',  wet: 1, move: 0.92 },
  storm:   { name: '뇌우',     icon: 'storm', wet: 1, move: 0.9 },
  snow:    { name: '눈',       icon: 'snow',  move: 0.95 },
  heavy:   { name: '폭설',     icon: 'heavy', wet: 1, move: 0.8 },
  sand:    { name: '모래바람', icon: 'sand',  move: 0.9 }
};
// 계절마다 하늘이 나올 확률
const WX_SKY_P = [
  [['clear', 0.45], ['cloud', 0.30], ['rain', 0.20], ['fog', 0.05]],
  [['clear', 0.50], ['cloud', 0.20], ['rain', 0.18], ['storm', 0.12]],
  [['clear', 0.55], ['cloud', 0.28], ['rain', 0.12], ['fog', 0.05]],
  [['clear', 0.40], ['cloud', 0.25], ['snow', 0.25], ['heavy', 0.10]]
];
// 온도 단계: +2 무더위(해가 지면 열대야) · +1 더움 · 0 온화함 · -1 쌀쌀함 · -2 강추위. 모험가 능력치 배율
const WX_T = { '2': { name: '무더위', stat: 0.7 }, '1': { name: '더움', stat: 0.9 }, '0': { name: '온화함', stat: 1.1 }, '-1': { name: '쌀쌀함', stat: 0.9 }, '-2': { name: '강추위', stat: 0.7 } };
// 땅의 기후 (계절과 상관없이): t 온도 보정 · lo/hi 범위 · dry 비가 안 온다 · sand 강풍이면 모래바람 · snowy 비 대신 눈 · cloudy 비구름이 발밑 · stormy 뇌우가 잦다
// clear 늘 맑다 · wet 비가 잦다(배율) · wind 강풍이 잦다(배율) · indoor 날씨가 없다
const CLIMATE = {
  desert:     { t: 1, lo: -1, dry: 1, sand: 1, note: '사막이라 늘 덥다 (겨울 밤에도 쌀쌀한 정도)' },
  barren:     { t: 1, dry: 1, note: '메마른 땅이라 덥고 비가 거의 없다' },
  volcano:    { t: 2, lo: 0, dry: 1, note: '화산이라 언제나 덥다' },
  snow:       { t: -2, hi: -1, snowy: 1, note: '설산이라 언제나 춥다 (여름 한낮에도 쌀쌀하다)' },
  valley:     { wind: 2.2, note: '바람계곡이라 강풍이 잦다' },
  mountain:   { wind: 1.6, note: '산이라 바람이 세다' },
  swamp:      { wet: 1.8, note: '늪지대라 비가 잦다' },
  sky:        { cloudy: 1, wind: 1.5, note: '구름 위라 비는 발밑 구름에 내린다' },
  thunder:    { t: -1, stormy: 1, wind: 2, note: '천둥 봉우리라 뇌우가 그치지 않고 서늘하다' },
  stargarden: { clear: 1, note: '별의 정원은 늘 맑다' },
  roots: { indoor: 1 }, alley: { indoor: 1 }, sewer: { indoor: 1 }
};
// 던전 안은 날씨가 없지만 몇 곳은 늘 덥거나 춥다 (던전 그림 id → 온도)
const DUNGEON_CLIMATE = { crater: 2, icetemple: -2, tomb: 1 };

/* 체질 특성: 날씨에 약하거나 강한 몸 (약한 체질은 새 모험가에게만 붙는다) */
Object.assign(TRAITS, {
  coldWeak: { name: '추위에 약함', desc: '쌀쌀함·추위·강추위에 능력치 -10% 더', neg: 1, wxCold: -0.1 },
  hotWeak:  { name: '더위에 약함', desc: '더움·무더위·열대야에 능력치 -10% 더', neg: 1, wxHot: -0.1 },
  wetWeak:  { name: '비에 약함',   desc: '비·눈이 오면 능력치 -10%', neg: 1, wxWet: -0.1 },
  windWeak: { name: '바람에 약함', desc: '강풍이 불면 능력치 -10%', neg: 1, wxWind: -0.1 },
  coldRes:  { name: '추위에 강함', desc: '추운 날씨의 능력치·이동·공격 디버프를 받지 않음', wxColdRes: 1 },
  hotRes:   { name: '더위에 강함', desc: '더운 날씨의 능력치·이동·공격 디버프를 받지 않음', wxHotRes: 1 }
});
const WEAK_TRAIT_IDS = ['coldWeak', 'hotWeak', 'wetWeak', 'windWeak'];
TRAIT_IDS.push('coldRes', 'hotRes'); ROLL_TRAIT_IDS.push('coldRes', 'hotRes');
// 새 모험가 넷 중 한 명꼴로 약한 체질을 타고난다 (rollTraits가 부른다)
function rollWeak(out) {
  if (rnd() >= 0.25) return out;
  const w = pickOne(WEAK_TRAIT_IDS);
  if (out.includes(w)) return out;
  if (out.length >= TRAIT_MAX) out[out.length - 1] = w; else out.push(w);
  return out;
}

/* ───────── 요리: 주방에서 만든 도시락을 원정 출발 때 들려 보낸다 ───────── */
Object.assign(ITEMS, {
  raw_meat: { name: '날고기',   v: 22, w: 1, icon: 'hide',   c: '#c8504a', food: 1, desc: '짐승에게서 얻는 고기. 요리의 기본 재료. 주방에서 사도 된다.' },
  flour:    { name: '밀가루',   v: 14, w: 1, icon: 'ore',    c: '#f0e8d0', food: 1, desc: '빵과 반죽의 재료. 주방에서 판다. 잉그리시아에서 싸게 들여온다.' },
  spice:    { name: '향신료',   v: 34, w: 1, icon: 'leaf',   c: '#d8642a', food: 1, desc: '음식에 불을 지핀다. 주방에서 판다. 사라크에서 싸게 들여온다.' },
  honey:    { name: '야생 꿀',  v: 26, w: 1, icon: 'blob',   c: '#f0b43c', food: 1, desc: '달콤한 꿀. 주방에서 판다. 엘프 왕국에서 싸게 들여온다.' }
});
const KITCHEN_BUY = { raw_meat: 40, flour: 15, spice: 36, honey: 28 };   // 주방에서 사는 값 (날고기는 사냥이 훨씬 싸다)
// 짐승 타입 몬스터는 날고기를 떨어뜨린다
Object.keys(MONS).forEach(id => { const m = MONS[id]; if (m.plan === 'pet' || m.boss || !(m.ty || []).includes('beast')) return; m.drops = (m.drops || []).concat([['raw_meat', 0.3]]); });
// fx: atk·matk·def·hp(%) · move(%) · crit(p) · regen(초당 HP 비율) · fat(피로가 덜 쌓임) · sleep(숙면 피로가 덜 쌓임) · exp · luck(전리품) · carry(짐) · sta(상태이상 저항) · coldRes·hotRes(날씨)
const FOODS = {
  stew:     { name: '고기 스튜',       lv: 1, need: { raw_meat: 2, herb: 1 },                          fee: 20,  c: '#a8643a', fx: { atk: 0.12, hp: 0.05 },              desc: '푹 고은 고기 국물. 힘이 난다.' },
  mushsoup: { name: '버섯 수프',       lv: 1, need: { bloodshroom: 1, flour: 1, herb: 1 },             fee: 20,  c: '#c86a5a', fx: { matk: 0.12 },                        desc: '핏빛 버섯을 우린 수프. 머리가 맑아진다.' },
  pudding:  { name: '젤리 푸딩',       lv: 1, need: { slime_jelly: 2, honey: 1 },                      fee: 15,  c: '#7ad87a', fx: { fat: 0.25 },                         desc: '탱글한 푸딩. 오래 걸어도 덜 지친다.' },
  sandwich: { name: '든든한 샌드위치', lv: 1, need: { flour: 2, raw_meat: 1 },                         fee: 15,  c: '#e0b878', fx: { move: 0.1, carry: 4 },               desc: '걸으면서 먹는 빵. 발걸음이 가볍다.' },
  froglegs: { name: '개구리 다리 구이', lv: 1, need: { frog_leg: 2, spice: 1 },                         fee: 25,  c: '#8ab84a', fx: { crit: 0.06 },                        desc: '바삭한 구이. 손끝이 예민해진다.' },
  saptea:   { name: '수액 꿀차',       lv: 1, need: { treant_sap: 1, honey: 1 },                       fee: 20,  c: '#c8a040', fx: { regen: 0.004 },                      desc: '트렌트 수액에 꿀을 탄 차. 상처가 저절로 아문다.' },
  riceball: { name: '주먹밥 도시락',   lv: 1, need: { flour: 2, herb: 1 },                             fee: 10,  c: '#f4f0e4', fx: { carry: 8, sleep: 0.2 },              desc: '든든한 도시락. 짐을 더 지고, 덜 졸린다.' },
  stirfry:  { name: '철판 볶음',       lv: 2, need: { raw_meat: 2, spice: 1, flour: 1 },               fee: 40,  c: '#c8502a', fx: { def: 0.12, hp: 0.08 },               desc: '불맛 나는 볶음. 몸이 단단해진다.' },
  hotsoup:  { name: '뜨거운 수프',     lv: 2, need: { fireherb: 2, raw_meat: 1, spice: 1 },            fee: 40,  c: '#e0502a', fx: { coldRes: 1, fat: 0.1 },              desc: '속까지 데우는 수프. 추위 디버프를 받지 않는다.' },
  shaveice: { name: '얼음 빙수',       lv: 2, need: { snowherb: 2, honey: 1, slime_jelly: 1 },         fee: 40,  c: '#9ae0ff', fx: { hotRes: 1, move: 0.05 },             desc: '시원한 빙수. 더위 디버프를 받지 않는다.' },
  porridge: { name: '약초죽',          lv: 2, need: { herb: 2, waterherb: 1, flour: 1 },               fee: 30,  c: '#a8c87a', fx: { sta: 0.4, regen: 0.002 },            desc: '쓴 약초를 끓인 죽. 상태이상이 짧고 약해진다.' },
  cookie:   { name: '행운의 쿠키',     lv: 2, need: { flour: 2, honey: 1, moonflower: 1 },             fee: 50,  c: '#f0d070', fx: { luck: 0.15 },                        desc: '속에 쪽지가 든 쿠키. 전리품이 늘어난다.' },
  platter:  { name: '모험가 정식',     lv: 3, need: { raw_meat: 2, flour: 1, herb: 2, spice: 1 },      fee: 80,  c: '#d8904a', fx: { exp: 0.15, atk: 0.05, matk: 0.05 },  desc: '길드 식당의 대표 메뉴. 경험치가 늘어난다.' },
  feast:    { name: '용사의 만찬',     lv: 3, need: { raw_meat: 4, spice: 2, mandrake: 1, moonflower: 1, honey: 1 }, fee: 200, c: '#f0c24a', fx: { atk: 0.1, matk: 0.1, def: 0.1, hp: 0.1, exp: 0.1 }, desc: '전설의 만찬. 모든 능력과 경험치가 오른다.' }
};
const FOOD_IDS = Object.keys(FOODS);
FOOD_IDS.forEach(id => { const F = FOODS[id]; ITEMS['food_' + id] = { name: F.name, v: Math.round(40 + vOfNeed(F.need) * 1.2 + F.fee), w: 1, icon: 'potion', c: F.c, dish: id, desc: `원정 도시락. ${F.desc}` }; });
function vOfNeed(need) { return Object.entries(need).reduce((s, [k, q]) => s + ((ITEMS[k] && ITEMS[k].v) || 10) * q, 0); }
const FOOD_FX_TXT = { atk: '공격력', matk: '마법 공격력', def: '방어력', hp: '최대 HP', move: '이동 속도', exp: '경험치', luck: '전리품' };
function foodFxText(fx) {
  const out = [];
  for (const [k, v] of Object.entries(fx || {})) {
    if (FOOD_FX_TXT[k]) out.push(`${FOOD_FX_TXT[k]} +${Math.round(v * 100)}%`);
    else if (k === 'crit') out.push(`치명타 +${Math.round(v * 100)}%p`);
    else if (k === 'regen') out.push(`초당 HP ${Math.round(v * 1000) / 10}% 재생`);
    else if (k === 'fat') out.push(`피로 ${Math.round(v * 100)}% 덜 쌓임`);
    else if (k === 'sleep') out.push(`숙면 피로 ${Math.round(v * 100)}% 덜 쌓임`);
    else if (k === 'carry') out.push(`짐 +${v}`);
    else if (k === 'sta') out.push(`상태이상 ${Math.round(v * 100)}% 약하게`);
    else if (k === 'coldRes') out.push('추위 디버프 없음');
    else if (k === 'hotRes') out.push('더위 디버프 없음');
  }
  return out.join(' · ');
}
BUILDINGS.kitchen = { name: '주방', max: 3, cost: [3000, 10000, 30000], desc: '재료로 원정 도시락을 만든다. 출발할 때 파티에 들려 보내면 원정 내내 효과가 이어진다.',
  eff: lv => `요리 ${FOOD_IDS.filter(id => FOODS[id].lv <= lv).length}가지${lv >= 2 ? ` · 한 번에 두 개 나올 확률 ${lv >= 3 ? 30 : 15}%` : ''}` };
BUILD_RANK.kitchen = 1;
BUILD_ORDER.splice(BUILD_ORDER.indexOf('alchemy') + 1, 0, 'kitchen');
STORY.kitchen = ['주방을 지었다. 화덕에서 고기 굽는 냄새가 상단 위층까지 올라간다.', '주방 창에서 재료로 도시락을 만든다. 날고기는 짐승을 사냥하면 얻고, 밀가루·향신료·꿀은 주방에서 사거나 교역으로 싸게 들여온다.', '원정대 창에서 파티마다 도시락을 고르면, 출발할 때 하나씩 들고 가서 원정 내내 효과가 이어진다. 날씨에 맞는 도시락(뜨거운 수프·얼음 빙수)도 있다.'];

/* ───────── 교역로: 마차에 교역품을 싣고 이웃 왕국까지 갔다 온다 ───────── */
Object.assign(ITEMS, {
  steel_ingot: { name: '잉그리시아 강철 주괴', v: 240, w: 3, icon: 'ore',    c: '#a8b4c8', trade: 'inglisia', desc: '기사 왕국의 제련소에서 나온 강철. 교역품.' },
  knight_wine: { name: '기사단 포도주',        v: 180, w: 2, icon: 'potion', c: '#8a2a3a', trade: 'inglisia', desc: '기사단 수도원의 포도주. 교역품.' },
  silk_roll:   { name: '프라마 비단',          v: 300, w: 2, icon: 'hide',   c: '#e8a0c8', trade: 'frama',    desc: '남쪽 바다의 고운 비단. 교역품.' },
  perfume:     { name: '프라마 향수',          v: 220, w: 1, icon: 'potion', c: '#c8a0f0', trade: 'frama',    desc: '항구 도시의 향수. 교역품.' },
  elf_mead:    { name: '엘프 꿀술',            v: 200, w: 2, icon: 'potion', c: '#f0c860', trade: 'elves',    desc: '세계수 꽃꿀로 빚은 술. 교역품.' },
  gear_parts:  { name: '드워프 정밀 톱니',     v: 260, w: 2, icon: 'core',   c: '#c8a060', trade: 'dwarves',  desc: '브론하임 장인의 톱니바퀴. 교역품.' },
  blackpowder: { name: '드워프 화약',          v: 180, w: 2, icon: 'ore',    c: '#4a4a52', trade: 'dwarves',  desc: '광산에서 쓰는 화약. 교역품.' },
  carpet:      { name: '사라크 양탄자',        v: 320, w: 3, icon: 'hide',   c: '#c84a3a', trade: 'sarak',    desc: '술탄국의 무늬 양탄자. 교역품.' }
});
// 거리(스테이지) · 길의 산적 최소 레벨 · 길 풍경 · 기후 · 나오는 적 · 그 나라에서 사 올 것
const TRADE = {
  inglisia: { dist: 6,  lv: 12, bg: 'plains',   clim: null,      mons: ['wolf', 'bandit', 'enforcer'],      goods: ['steel_ingot', 'knight_wine', 'flour'] },
  frama:    { dist: 7,  lv: 18, bg: 'plains',   clim: null,      mons: ['bandit', 'assassin', 'poisoner'],  goods: ['silk_roll', 'perfume'] },
  elves:    { dist: 8,  lv: 25, bg: 'forest',   clim: null,      mons: ['wolf', 'spider', 'myconid'],       goods: ['elf_mead', 'honey', 'treant_sap'] },
  dwarves:  { dist: 8,  lv: 32, bg: 'mountain', clim: 'mountain', mons: ['kobold', 'bandit', 'lizard'],     goods: ['gear_parts', 'blackpowder', 'iron_ore'] },
  sarak:    { dist: 10, lv: 55, bg: 'desert',   clim: 'desert',  mons: ['bandit', 'scorpion', 'antlion'],   goods: ['carpet', 'spice'] }
};
const TRADE_IDS = Object.keys(TRADE);
const TRADE_BUY_MUL = 0.6;     // 그 나라에서 사는 값 (기준가 대비)
const TRADE_CAP_KEEP = 0.15;   // 오는 길에 주울 전리품 자리로 비워 두는 몫
// 다른 나라 교역품을 원한다 (사 와서 다른 나라에 판다)
KINGDOMS.inglisia.wants.push('silk_roll', 'carpet', 'elf_mead');
KINGDOMS.frama.wants.push('steel_ingot', 'gear_parts', 'knight_wine', 'spice');
KINGDOMS.elves.wants.push('perfume', 'silk_roll', 'knight_wine');
KINGDOMS.dwarves.wants.push('elf_mead', 'carpet', 'knight_wine');
KINGDOMS.sarak.wants.push('steel_ingot', 'perfume', 'gear_parts', 'blackpowder');
// 교역로는 숨은 필드로 둔다 (지도·필드 목록에는 없다)
TRADE_IDS.forEach(k => {
  const T = TRADE[k];
  FIELDS['trade_' + k] = { no: 0, name: `${KINGDOMS[k].name.replace(/ 왕국$/, '')} 교역로`, lv: T.lv, bg: T.bg, trade: k, hidden: 1, mons: T.mons, bosses: [], herbs: [] };
});
STORY.trade = ['교역로가 열렸다. 마차에 교역품을 가득 싣고 이웃 왕국까지 직접 가서 팔 수 있다.', '원정대 창의 목적지에서 「교역」을 고르면 그 나라가 원하는 물건을 창고에서 골라 싣고 떠난다. 그 나라에서 다 팔고, 그 나라 특산물을 싸게 사 온다.', '길에는 산적과 짐승이 나온다. 말이 끄는 마차(짐수레 이상)와 짐꾼 계열이 있어야 떠날 수 있다.'];

/* 파티 인원: 짐꾼 계열을 빼고 넷까지, 짐꾼 계열 하나를 더해 모두 다섯 */
const PARTY_FIGHTERS = 4;

STORY.v31 = [
  '빌드 31: 계절과 날씨가 생겼다. 시계 아래에 지금 날씨가 보인다. 봄은 온화하고(능력치 +10%), 가을은 쌀쌀하고(-10%), 여름 폭염의 무더위·열대야와 겨울 강추위는 -30%. 밤과 새벽은 한 단계 춥다. 사막은 덥고 설산은 늘 춥다.',
  '비가 오면 모닥불을 못 피워 노숙하는 파티의 피로가 잘 안 풀리고, 강풍은 모닥불을 약하게 한다. 정찰가의 텐트는 비·바람을, 탐험가의 대형 텐트는 추위까지 막는다. 상단 창의 「날씨」에서 예보를 본다.',
  '주방을 지으면 원정 도시락을 만든다. 파티마다 도시락을 골라 두면 출발할 때 들고 가서 원정 내내 효과가 이어진다.',
  '교역: 원정대 창 목적지의 「교역」에서 이웃 나라를 고르면, 그 나라가 원하는 물건을 마차에 싣고 가서 팔고 특산물을 싸게 사 온다. 마차는 이제 원정 화면에서 파티 뒤를 따라온다.',
  '스킬에 속성이 생겼다. 같은 계열 속성은 면역, 빛·신성 몬스터는 속성 스킬에 면역, 강철 몬스터는 무속성(기본 공격)에 면역. 몬스터마다 타입(짐승·괴수·언데드…)이 있고, 새 직업 사냥꾼→괴수사냥꾼, 원소술사→연금술사가 생겼다.',
  'Lv100 용사는 2차 각성으로 Lv150까지 오르고 2차 각성기를 얻는다. 구름섬 너머 천둥 봉우리·천계의 유적 폐허·별의 정원이 기다린다. 파티는 이제 짐꾼 계열을 빼고 넷까지다.'
];
