/* ───────── 빌드 72: 요리 다시 짜기 (사용자 11-21 16:33 「날고기, 옛레시피는 삭제 … 후추, 소금, 설탕, 고춧가루, 간장, 된장(여러 조미료들을 너가 추가) …
   구이, 찜, 꼬치, 볶음, 탕, 죽, 스프 등으로 분류해서 너가 알아서 재료 선정 … 열매, 수액, 이슬, 꿀 등은 약초랑 섞어서 음료 … 여러 재료가 들어가는 것도」) ─────────
   · 옛 요리 26가지 · 「날고기」 · 「향신료」는 없앰. 요리 화면(cook68.js 큰 구리솥 · 재료와 수가 딱 맞아야 함 · 솥 6개) · 도시락 효과(kitchen.js fx)는 그대로.
   · 조미료 12가지는 라비린토스 시장(KITCHEN_BUY)에서 판다. 이름은 나중에 사용자가 판타지 이름 · 나라 · 기후 이름을 덧붙일 예정 → SEASON72 한 곳만 고치면 된다.
   · 고기는 마물육(mat72.js MMEAT · 갈무리로만 얻음). 밥 · 죽의 쌀은 허수아비의 「벼」.
   · 면 · 초밥 같은 분류는 마땅한 재료가 생기면 추가 (사용자).
   · 요리 이름 · 재료 · 효과 값은 전부 내가 정한 기본값 — 사용자가 목록을 보고 고칠 수 있다. */
const SEASON72 = {   // id: [이름, 사는 값, 색, 설명]
  salt:      ['소금',     300, '#f4f4f0', '모든 간의 바탕'],
  sugar:     ['설탕',     400, '#fff8ec', '단맛을 내는 흰 가루'],
  vinegar:   ['식초',     400, '#e8dca0', '새콤한 맛을 내는 물'],
  oil:       ['식용유',   400, '#f0d060', '볶고 튀길 때 두르는 기름'],
  chilipow:  ['고춧가루', 500, '#d8301a', '말린 고추를 빻은 매운 가루'],
  soy:       ['간장',     500, '#4a2a1a', '콩을 삭혀 짠 검은 장'],
  doenjang:  ['된장',     500, '#b07a3a', '콩을 삭혀 띄운 구수한 장'],
  ricewine:  ['맛술',     500, '#f0e8c0', '잡내를 잡는 요리용 술'],
  pepper:    ['후추',     600, '#5a5048', '알싸한 검은 가루'],
  gochujang: ['고추장',   600, '#b02a1a', '맵고 달큰한 붉은 장'],
  butter:    ['버터',     700, '#f8e08a', '고소한 우유 기름 덩이'],
  sesame:    ['참기름',   800, '#c88a2a', '한 방울로 고소해지는 기름']
};
const SEASON_IDS = Object.keys(SEASON72);
// 옛 재료 · 옛 요리 지우기
const FOOD72_GONE = {};   // 옛 저장 창고에 남은 것의 값 (불러올 때 돈으로 돌려줌 — food72Gone)
['raw_meat', 'spice'].forEach(k => { if (ITEMS[k]) FOOD72_GONE[k] = ITEMS[k].v; delete ITEMS[k]; delete KITCHEN_BUY[k]; delete FOOD_PRICE[k]; });
FOOD_IDS.forEach(id => { if (ITEMS['food_' + id]) FOOD72_GONE['food_' + id] = ITEMS['food_' + id].v; delete ITEMS['food_' + id]; delete ITEMS['rcp_' + id]; delete FOODS[id]; });
FOOD_IDS.length = 0; Object.keys(RECIPE_OF).forEach(k => delete RECIPE_OF[k]);
Object.keys(MONS).forEach(id => { const m = MONS[id]; if (m.drops) m.drops = m.drops.filter(d => d[0] !== 'raw_meat'); });
SEASON_IDS.forEach(k => { const [name, price, c, d] = SEASON72[k]; ITEMS[k] = { name, v: Math.round(price / 5), w: 1, icon: 'potion', c, food: 1, season: 1, g: 0, desc: `${d}. 라비린토스 시장에서 판다 (조미료).` }; KITCHEN_BUY[k] = price; FOOD_PRICE[k] = price; });
Object.keys(MMEAT).forEach(id => { const I = ITEMS['mm_' + id]; if (I) { I.icon = 'hide'; I.c = '#c8504a'; } });

// 분류
const FOOD_KIND = { grill: '구이', steam: '찜', skewer: '꼬치', stir: '볶음', fry: '튀김', tang: '탕', juk: '죽', soup: '스프', rice: '밥', salad: '무침', bake: '빵 · 과자', drink: '음료', set: '정식' };
// id: [이름, 분류, 주방 Lv, 재료, 효과, 색, 설명]
const FOOD72 = {
  /* ── 평원 (주방 Lv1) ── */
  rat_skewer:    ['들쥐 꼬치',             'skewer', 1, { mm_rat: 2, salt: 1 },                                        { atk: 0.05 },                       '#b8683a', '소금만 뿌려 구운 길거리 꼬치.'],
  rat_soup:      ['들쥐 감자 스프',        'soup',   1, { mm_rat: 2, hg_potato: 1, butter: 1 },                        { hp: 0.05, sleep: 0.1 },            '#e0c890', '감자를 풀어 넣은 걸쭉한 스프.'],
  rabbit_grill:  ['뿔토끼 안심 구이',      'grill',  1, { mm_rabbit: 2, salt: 1, pepper: 1 },                          { move: 0.08 },                      '#d89868', '담백하게 구운 안심. 발걸음이 가볍다.'],
  rabbit_steam:  ['뿔토끼 당근 찜',        'steam',  1, { mm_rabbit: 2, hg_carrot: 1, soy: 1 },                        { hp: 0.08 },                        '#c87838', '간장에 당근과 함께 졸인 찜.'],
  rabbit_tomato: ['뿔토끼 토마토 스튜',    'soup',   1, { mm_rabbit: 2, fr_tomato: 1, fr_olive: 1 },                   { hp: 0.08, atk: 0.05 },             '#d84a3a', '남쪽식으로 새콤하게 끓인 스튜.'],
  wolf_skewer:   ['들늑대 꼬치',           'skewer', 1, { mm_wolf: 2, pepper: 1, hg_onion: 1 },                        { crit: 0.04 },                      '#9a4a2a', '양파를 사이사이 끼운 붉은 살 꼬치.'],
  wolf_tang:     ['들늑대 뒷다리 탕',      'tang',   1, { mm_wolf: 2, hg_cabbage: 1, doenjang: 1 },                    { atk: 0.08, fat: 0.05 },            '#a87848', '된장을 풀어 오래 고은 탕.'],
  wolf_pie:      ['들늑대 완두 파이',      'bake',   1, { mm_wolf: 1, flour: 2, in_pea: 1, in_turnip: 1 },             { def: 0.06, carry: 6 },             '#d8a050', '기사들의 행군 도시락.'],
  rice_juk:      ['흰죽',                  'juk',    1, { mm_scarecrow: 2, salt: 1 },                                  { regen: 0.002, sleep: 0.15 },       '#f4f0e4', '벼를 찧어 쑨 죽. 속이 편하다.'],
  herb_juk:      ['약초죽',                'juk',    1, { mm_scarecrow: 2, herb: 1, mugwort: 1 },                      { sta: 0.35 },                       '#a8c87a', '히포크리초와 은엽쑥을 넣어 쑨 쌉쌀한 죽.'],
  riceball:      ['주먹밥',                'rice',   1, { mm_scarecrow: 2, salt: 1, sesame: 1 },                       { carry: 8 },                        '#f0ecd8', '참기름을 발라 뭉친 밥.'],
  fried_rice:    ['달걀 볶음밥',           'stir',   1, { mm_scarecrow: 2, egg_none: 1, oil: 1, hg_onion: 1 },         { carry: 6, move: 0.05 },            '#e8c860', '센 불에 볶은 밥.'],
  rice_drink:    ['벼 감주',               'drink',  1, { mm_scarecrow: 2, sugar: 1 },                                 { fat: 0.2 },                        '#f0e4c0', '벼를 삭혀 만든 달큰한 마실 것.'],
  boar_grill:    ['멧돼지 삼겹살 구이',    'grill',  1, { mm_boar: 2, salt: 1, el_lettuce: 1 },                        { atk: 0.1 },                        '#d88858', '이슬 상추에 싸 먹는 삼겹살.'],
  boar_stir:     ['멧돼지 제육볶음',       'stir',   1, { mm_boar: 2, gochujang: 1, hg_onion: 1, sugar: 1 },           { atk: 0.08, hp: 0.05 },             '#c83a1a', '고추장에 볶은 매콤달콤한 볶음.'],
  boar_gukbap:   ['멧돼지 국밥',           'tang',   1, { mm_boar: 1, mm_scarecrow: 1, hg_cabbage: 1, doenjang: 1 },   { hp: 0.1, fat: 0.1 },               '#c8a878', '밥을 말아 먹는 든든한 탕.'],
  boar_beet:     ['멧돼지 비트 스튜',      'soup',   1, { mm_boar: 2, dw_beet: 1, dw_garlic: 1 },                      { hp: 0.1, coldRes: 1 },             '#9a1a3a', '광부들의 붉은 스튜.'],
  aboar_steam:   ['갑옷 멧돼지 갈비찜',    'steam',  1, { mm_aboar: 2, soy: 1, sugar: 1, hg_carrot: 1 },               { def: 0.1, hp: 0.05 },              '#8a4a2a', '달큰한 간장에 푹 졸인 갈비.'],
  aboar_grill:   ['갑옷 멧돼지 갈비 구이', 'grill',  1, { mm_aboar: 2, soy: 1, sesame: 1 },                            { def: 0.08, atk: 0.04 },            '#a85a2a', '양념을 발라 구운 갈비.'],
  ratking_steak: ['들쥐왕 등심 스테이크',  'grill',  1, { mm_ratking: 1, butter: 1, pepper: 1, salt: 1 },              { atk: 0.1, exp: 0.05 },             '#b85838', '버터에 지진 두툼한 등심.'],
  plains_set:    ['평원 사냥꾼 정식',      'set',    1, { mm_rabbit: 1, mm_wolf: 1, mm_boar: 1, mm_scarecrow: 1, salt: 1 }, { atk: 0.06, hp: 0.06, exp: 0.06 }, '#d8904a', '평원에서 잡은 것을 한 상에 올렸다.'],
  /* ── 원시림 (주방 Lv2) ── */
  snake_grill:   ['덩굴 뱀 소금구이',      'grill',  2, { mm_vinesnake: 2, salt: 1 },                                  { crit: 0.06 },                      '#e0d0a8', '가시를 바르고 구운 흰 살.'],
  snake_tang:    ['덩굴 뱀 탕',            'tang',   2, { mm_vinesnake: 2, dw_garlic: 1, mugwort: 1 },                 { regen: 0.003, sta: 0.2 },          '#c8b878', '마늘과 은엽쑥을 넣고 고은 보양 탕.'],
  cflower_salad: ['식충 꽃 줄기 무침',     'salad',  2, { mm_cflower: 2, vinegar: 1, chilipow: 1, sesame: 1 },         { move: 0.08, hotRes: 1 },           '#8ad06a', '아삭한 줄기를 새콤하게 무쳤다.'],
  stump_stir:    ['그루터기 새순 볶음',    'stir',   2, { mm_stump: 2, oil: 1, soy: 1 },                               { fat: 0.2 },                        '#7ab84a', '연한 새순을 살짝 볶았다.'],
  spot_skewer:   ['점박이 버섯 꼬치',      'skewer', 2, { mm_spotshroom: 2, butter: 1, salt: 1 },                      { matk: 0.1 },                       '#d8a878', '버터를 발라 구운 쫄깃한 기둥.'],
  spot_soup:     ['점박이 버섯 크림 스프', 'soup',   2, { mm_spotshroom: 2, butter: 1, flour: 1, hg_onion: 1 },        { matk: 0.12 },                      '#f0e0c0', '부드럽게 끓인 버섯 스프.'],
  beetle_steam:  ['철갑 풍뎅이 찜',        'steam',  2, { mm_ibeetle: 2, ricewine: 1, dw_garlic: 1 },                  { def: 0.12 },                       '#7a8a9a', '껍데기째 쪄 낸 고소한 속살.'],
  beetle_grill:  ['철갑 풍뎅이 버터구이',  'grill',  2, { mm_ibeetle: 2, butter: 1, pepper: 1 },                       { def: 0.08, crit: 0.03 },           '#c8a858', '껍데기를 그릇 삼아 버터에 구웠다.'],
  rock_jeongol:  ['바위 버섯 전골',        'tang',   2, { mm_mgolem: 2, mm_spotshroom: 1, soy: 1, hg_cabbage: 1 },     { hp: 0.12 },                        '#8a7a5a', '두 가지 버섯을 넣고 끓인 전골.'],
  rock_juk:      ['바위 버섯 죽',          'juk',    2, { mm_mgolem: 1, mm_scarecrow: 2, sesame: 1 },                  { regen: 0.003, sleep: 0.2 },        '#c8c0a0', '버섯을 다져 넣은 고소한 죽.'],
  boar_hot:      ['얼큰 멧돼지 탕',        'tang',   2, { mm_boar: 2, chilipow: 1, sr_chili: 1, hg_onion: 1 },         { coldRes: 1, fat: 0.1 },            '#e0402a', '속까지 데우는 매운 탕.'],
  sap_ribs:      ['수액 조림 갈비',        'steam',  2, { mm_elder: 1, mm_aboar: 2, soy: 1 },                          { def: 0.12, hp: 0.1 },              '#9a5a2a', '트렌트 수액으로 윤을 낸 갈비 조림.'],
  greens_salad:  ['은버섯 샐러드',         'salad',  2, { el_lettuce: 2, el_mush: 1, fr_olive: 1, vinegar: 1 },        { exp: 0.08, luck: 0.05 },           '#a8d88a', '엘프식 샐러드.'],
  dew_tea:       ['이슬 열매 차',          'drink',  2, { mm_fguard: 1, herb: 1, honey: 1 },                           { regen: 0.004 },                    '#c8f0e0', '이슬 열매를 히포크리초와 우린 차.'],
  sap_tea:       ['트렌트 수액 꿀차',      'drink',  2, { mm_elder: 1, honey: 1, mugwort: 1 },                         { regen: 0.005, sta: 0.2 },          '#c8a040', '진한 수액에 꿀과 은엽쑥을 탄 차.'],
  forest_set:    ['원시림 버섯 정식',      'set',    2, { mm_spotshroom: 1, mm_mgolem: 1, mm_stump: 1, mm_vinesnake: 1, soy: 1 }, { matk: 0.08, hp: 0.08, exp: 0.08 }, '#9ab86a', '숲에서 난 것으로 차린 한 상.'],
  /* ── 해산물 · 알 (주방 Lv2) ── */
  egg_steam:     ['달걀찜',                'steam',  1, { egg_none: 2, salt: 1, hg_onion: 1 },                         { hp: 0.1, fat: 0.1 },               '#f4c844', '폭신하게 쪄 낸 달걀찜.'],
  mack_grill:    ['고등어 소금구이',       'grill',  2, { sea_mackerel: 2, salt: 1 },                                  { crit: 0.05, move: 0.05 },          '#8ab0c8', '노릇하게 구운 고등어.'],
  shrimp_skewer: ['새우 버터 꼬치',        'skewer', 2, { sea_shrimp: 2, butter: 1, pepper: 1 },                       { luck: 0.08 },                      '#e8683a', '버터에 구운 통통한 새우.'],
  kelp_tang:     ['다시마 조갯국',         'tang',   2, { sea_kelp: 2, sea_clam: 1, soy: 1 },                          { regen: 0.003, sta: 0.3 },          '#5a7a48', '시원한 바다 국.'],
  crab_steam:    ['꽃게 찜',               'steam',  3, { sea_crab: 2, dw_garlic: 1, ricewine: 1 },                    { def: 0.15 },                       '#e0603a', '껍질째 찐 꽃게.'],
  squid_stir:    ['오징어 볶음',           'stir',   3, { sea_squid: 2, gochujang: 1, hg_onion: 1, hg_carrot: 1 },     { atk: 0.1, crit: 0.04 },            '#e88a6a', '매콤한 오징어 볶음.'],
  sea_tang:      ['해물탕',                'tang',   3, { sea_crab: 1, sea_shrimp: 1, sea_clam: 1, chilipow: 1, hg_onion: 1 }, { matk: 0.1, hp: 0.05 },     '#e0702a', '바다를 통째로 끓인 얼큰한 탕.'],
  /* ── 깊은 숲 (주방 Lv3) ── */
  wisp_drink:    ['반딧불 꿀물',           'drink',  3, { mm_ewisp: 1, waterherb: 1 },                                 { matk: 0.08, luck: 0.05 },          '#f0f0a0', '수심초 우린 물에 빛나는 꿀을 풀었다.'],
  lizard_skewer: ['이끼 도마뱀 꼬리 꼬치', 'skewer', 3, { mm_mlizard: 2, soy: 1, sugar: 1 },                           { regen: 0.005 },                    '#6a9a4a', '달큰한 양념을 발라 구운 꼬리.'],
  lizard_tang:   ['도마뱀 꼬리 곰탕',      'tang',   3, { mm_mlizard: 2, mm_scarecrow: 1, salt: 1, hg_onion: 1 },      { hp: 0.15 },                        '#e8e0c8', '뽀얗게 우린 국물에 밥을 말았다.'],
  centi_stir:    ['뿌리 지네 마디 볶음',   'stir',   3, { mm_rcenti: 2, oil: 1, dw_garlic: 1, chilipow: 1 },           { atk: 0.12 },                       '#d85a2a', '새우 맛 나는 살을 매콤하게 볶았다.'],
  centi_steam:   ['뿌리 지네 술찜',        'steam',  3, { mm_rcenti: 2, ricewine: 1, butter: 1 },                      { crit: 0.07 },                      '#e8b888', '맛술과 버터로 쪄 낸 마디살.'],
  moth_soup:     ['빛가루 나방 버터 스프', 'soup',   3, { mm_emoth: 2, flour: 1, hg_potato: 1, pepper: 1 },            { matk: 0.12, luck: 0.05 },          '#f0e8b0', '버터처럼 녹는 배살로 끓인 스프.'],
  eshroom_grill: ['에테르 버섯 구이',      'grill',  3, { mm_eshroom: 2, butter: 1, soy: 1 },                          { matk: 0.15 },                      '#a8d8ff', '은은한 단맛이 도는 버섯 구이.'],
  eshroom_juk:   ['에테르 버섯 죽',        'juk',    3, { mm_eshroom: 1, mm_scarecrow: 2, ethermoss: 1 },              { matk: 0.08, regen: 0.004 },        '#c8e0f0', '에테르 이끼를 띄운 푸르스름한 죽.'],
  stag_steam:    ['수정 사슴벌레 찜',      'steam',  3, { mm_cstag: 2, ricewine: 1, salt: 1 },                         { def: 0.16 },                       '#a8c8e8', '수정 껍데기째 쪄 낸 탱탱한 살.'],
  stag_tang:     ['수정 사슴벌레 탕',      'tang',   3, { mm_cstag: 2, doenjang: 1, hg_cabbage: 1, sr_chili: 1 },      { def: 0.1, hp: 0.1 },               '#c89858', '된장을 풀어 칼칼하게 끓였다.'],
  oldsap_tea:    ['고목 수액차',           'drink',  3, { mm_sentinel: 1, fairybell: 1 },                              { fat: 0.3, sleep: 0.2 },            '#d8f0e8', '맑은 수액에 요정방울꽃을 띄운 차.'],
  dragon_wine:   ['고룡목 열매주',         'drink',  3, { mm_elddragon: 1, ricewine: 1, sugar: 1, wtsprout: 1 },       { atk: 0.1, matk: 0.1, def: 0.1, hp: 0.1 }, '#b8e8ff', '천 년 열매와 세계수 새순으로 담근 술.'],
  deep_set:      ['깊은 숲 진미 정식',     'set',    3, { mm_mlizard: 1, mm_rcenti: 1, mm_cstag: 1, mm_eshroom: 1, mm_scarecrow: 1, soy: 1 }, { exp: 0.15, atk: 0.06, matk: 0.06 }, '#8ac8a8', '깊은 숲의 귀한 것만 모은 한 상.'],
  /* ── 뿌리굴 (주방 Lv3) ── */
  mand_tang:     ['만드라고라 뿌리 탕',    'tang',   3, { mm_smandrake: 1, mm_rabbit: 2, dw_garlic: 1, salt: 1 },      { hp: 0.15, regen: 0.004 },          '#e0d0a0', '인삼 같은 뿌리를 넣고 고은 보양 탕.'],
  mand_fry:      ['만드라고라 뿌리 튀김',  'fry',    3, { mm_smandrake: 2, flour: 1, oil: 1 },                         { sta: 0.5 },                        '#d8b060', '쌉쌀한 뿌리를 바삭하게 튀겼다.'],
  fairy_ade:     ['요정 이슬꿀 에이드',    'drink',  3, { mm_fairies: 1, fairybell: 1, sr_cactus: 1 },                 { luck: 0.15 },                      '#f0c0e0', '이슬꿀에 선인장 열매 즙을 탄 마실 것.'],
  fairy_cookie:  ['이슬꿀 쿠키',           'bake',   3, { mm_fairies: 1, flour: 2, butter: 1 },                        { luck: 0.1, exp: 0.08 },            '#f0d070', '이슬꿀로 단맛을 낸 쿠키.'],
  black_syrup:   ['검은 수액 열매청',      'drink',  3, { mm_fdryad: 1, sugar: 1, blacktear: 1 },                      { sta: 0.5, matk: 0.08 },            '#6a3a8a', '새콤한 열매를 설탕에 재운 청.'],
  feast:         ['용사의 만찬',           'set',    3, { mm_ratking: 1, mm_elder: 1, mm_elddragon: 1, mm_fdryad: 1, salt: 1, pepper: 1 }, { atk: 0.1, matk: 0.1, def: 0.1, hp: 0.1, exp: 0.1 }, '#f0c24a', '네 땅의 우두머리로 차린 전설의 만찬.']
};
const FOOD_START = { rat_skewer: 1, rabbit_grill: 1, rice_juk: 1 };   // 처음부터 아는 레시피 (cook68.js knows)
Object.entries(FOOD72).forEach(([id, [name, kind, lv, need, fx, c, desc]]) => {
  const res = fx.coldRes ? ' 물·빙결 피해 -10%.' : fx.hotRes ? ' 불·화염 피해 -10%.' : '';
  FOODS[id] = { name, kind, lv, need, fee: 0, c, fx, desc: desc + res }; FOOD_IDS.push(id);
  ITEMS['food_' + id] = { name, v: Math.round(40 + vOfNeed(need) * 1.2), w: 1, icon: 'potion', c, dish: id, g: Math.min(4, lv), desc: `원정 도시락 [${FOOD_KIND[kind]}]. ${desc}${res}` };
  ITEMS['rcp_' + id] = { name: `${name} 레시피`, v: 0, w: 0, icon: 'book', c: '#e8d8b0', recipe: id, g: 3, desc: `사면 바로 도감 「요리」에 적힌다 — ${needTxt(need)}` };
  RECIPE_OF[needKey(need)] = id;
});
OLD_FOODS.length = 0; Object.keys(FOOD_START).forEach(id => OLD_FOODS.push(id));
// (솥에 넣을 수 있는 재료 COOK_MATS는 뒤에 오는 cook68.js가 FOODS에서 뽑는다)
// 옛 저장: 창고의 날고기 · 향신료 · 옛 도시락은 기준가로 돌려주고 지운다 (econ.js 불러오기 정리 바로 앞에서 부름) · 파티 도시락 설정도 비움
function food72Gone(inv) {
  let g = 0;
  for (const k in FOOD72_GONE) if (!ITEMS[k] && inv[k] > 0) { g += FOOD72_GONE[k] * inv[k]; delete inv[k]; }
  (S.parties || []).forEach(p => { if (p.food && !FOODS[p.food]) p.food = null; if (p.exp && p.exp.food && !FOODS[p.exp.food]) p.exp.food = null; });
  (S.presets || []).forEach(p => { if (p.food && !FOODS[p.food]) p.food = null; });
  if (S.cook && S.cook.pot) S.cook.pot = S.cook.pot.filter(k => ITEMS[k]);
  if (g > 0) { S.gold += g; log(`요리 개편: 창고에 있던 날고기 · 향신료 · 옛 도시락을 ${fmt(g)}G로 돌려받았다.`); }
}
STORY.kitchen = [
  '주방을 지었다. 화덕에서 고기 굽는 냄새가 길드 위층까지 올라간다.',
  '주방의 요리 화면에서 큰 구리솥에 재료를 하나씩 넣어 요리한다. 재료와 그 수가 딱 맞아야 요리가 되고, 틀리면 수상한 죽이 끓는다. 레시피는 직접 찾거나 왕국 상단 · 항구의 배에서 산다 (찾은 레시피는 도감 「요리」).',
  '고기는 짐꾼이 몬스터를 갈무리해 얻는 마물육을 쓴다. 소금 · 후추 · 간장 같은 조미료와 밀가루 · 꿀 · 라비린토스 채소는 주방 창의 라비린토스 시장에서 산다. 왕국 특산 채소는 그 나라 상단이, 해산물은 항구의 배가 판다.',
  '파티 창에서 파티마다 도시락을 고르면, 출발할 때 하나씩 들고 가서 원정 내내 효과가 이어진다.'
];
