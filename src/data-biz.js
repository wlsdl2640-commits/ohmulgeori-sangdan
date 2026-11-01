/* ───────── 건물 ───────── */
const BUILDINGS = {
  shop:     { name: '상점',        max: 5, cost: [0, 800, 2000, 4500, 9000],         desc: '부속품과 장비를 진열해 손님에게 판다.', eff: lv => `진열대 ${lv + 2}칸` },
  inn:      { name: '여관',        max: 6, cost: [0, 700, 1800, 4000, 8000, 15000],  desc: '모험가들의 숙소. 방이 많을수록 더 고용할 수 있다.', eff: lv => `방 ${2 + lv * 2}개` },
  smithy:   { name: '대장간',      max: 4, cost: [1500, 3500, 7000, 12000],          desc: '부속품으로 장비를 만든다. 넓힐수록 높은 단계 장비를 만든다.', eff: lv => `${GTIERS.filter(t => t.smith <= lv).map(t => t.name).join('·')} 장비` },
  alchemy:  { name: '연금술 공방', max: 2, cost: [900, 4000],                        desc: '부속품으로 회복 물약과 마나 물약을 만든다.', eff: lv => (lv >= 2 ? '상급 물약까지' : '하급·중급 물약') },
  training: { name: '훈련소',      max: 1, cost: [1200],                             desc: '능력치를 단련하고, 스킬북으로 스킬을 배운다.', eff: () => '능력치 훈련 · 스킬 배우기' },
  bank:     { name: '은행',        max: 3, cost: [3000, 7000, 15000],                desc: '모험가의 예금을 받아 굴리고, 돈을 빌려주고 이자를 받는다.', eff: lv => `거래 ${lv * 2 + 1}건까지` },
  tower:    { name: '마탑',        max: 1, cost: [4000],                             desc: '마법을 연구해 상단 전체를 강하게 만든다.', eff: () => '마법 연구' },
  temple:   { name: '신전',        max: 1, cost: [2500],                             desc: '쓰러진 모험가를 되살리고, 매달 신의 축복을 내려 준다.', eff: () => `부활 ${REVIVE_COST}G · 매달 축복` }
};
const BUILD_ORDER = ['shop', 'inn', 'training', 'temple', 'alchemy', 'smithy', 'bank', 'tower'];
const REVIVE_COST = 300;

/* ───────── 신전의 축복 (매달 하나) ───────── */
const BLESSINGS = {
  war:     { name: '전쟁신 바르크의 축복', short: '전쟁', desc: '공격력과 마법 피해 +15%' },
  earth:   { name: '대지모 테라의 축복',   short: '대지', desc: '최대 HP +15%, 방어력 +10%' },
  wind:    { name: '바람신 실피의 축복',   short: '바람', desc: '이동속도 +15%, 회피 +5%p' },
  moon:    { name: '달의 여신 루나의 축복', short: '달빛', desc: '밤에 몰려드는 몬스터가 줄고, 피로가 25% 덜 쌓인다' },
  harvest: { name: '풍요신 하베스의 축복', short: '풍요', desc: '부속품을 얻을 확률 +15%, 경험치 +15%' }
};
const BLESS_IDS = Object.keys(BLESSINGS);

/* ───────── 마차 (파티마다 하나) ───────── */
// cap: 늘어나는 짐, spd: 이동속도 배율
const WAGONS = {
  cart:    { name: '손수레',           cost: 400,   cap: 20,  spd: 0.97, desc: '파티가 번갈아 끄는 작은 수레.' },
  donkey:  { name: '당나귀 수레',      cost: 1500,  cap: 45,  spd: 1.0,  desc: '고집 센 당나귀가 끄는 수레.' },
  wagon:   { name: '짐마차',           cost: 4000,  cap: 90,  spd: 1.05, desc: '말 한 마리가 끄는 지붕 달린 마차.' },
  caravan: { name: '대형 마차',        cost: 9000,  cap: 160, spd: 1.03, desc: '말 두 마리가 끄는 상단용 대형 마차.' },
  steel:   { name: '드워프 강철 마차', cost: 16000, cap: 260, spd: 1.1,  need: 'dwarves', tier: 2, desc: '드워프 광산 조합이 만든 강철 마차. 산양 두 마리가 끈다.' }
};
const WAGON_IDS = Object.keys(WAGONS);

/* ───────── 피로 ───────── */
const FATIGUE = { walk: 0.42, fight: 0.55, sleep: 2.4, home: 1.5, camp: 80, nightCamp: 15, nightRest: 20, wake: 6, depart: 20 };
const fatMul = f => (f >= 100 ? 0.65 : f >= 85 ? 0.78 : f >= 60 ? 0.92 : 1);

/* ───────── 마탑 연구 ───────── */
// cost[n] = [골드, 재료], days[n] = 걸리는 날 (게임 속 날짜)
const RESEARCH = {
  power:    { name: '마력 증폭',      max: 3, desc: lv => `마법 피해와 치유량 +${lv * 10}%`,           cost: [[800, { shaman_feather: 4 }], [2400, { golem_core: 3 }], [6000, { harpy_feather: 6 }]], days: [2, 4, 7] },
  mana:     { name: '마나 순환',      max: 2, desc: lv => `MP 회복 +${lv * 30}%`,                      cost: [[700, { spore: 6 }], [3000, { snow_essence: 4 }]], days: [2, 5] },
  potion:   { name: '정제 연금술',    max: 2, desc: lv => `물약 회복량 +${lv * 25}%`,                  cost: [[600, { treant_sap: 4 }], [2500, { frost_crystal: 3 }]], days: [2, 4] },
  carry:    { name: '공간 확장 마법', max: 3, desc: lv => `파티가 드는 짐 +${lv * 10}%`,               cost: [[900, { spider_silk: 6 }], [2600, { bat_wing: 8 }], [6500, { wyvern_scale: 5 }]], days: [2, 4, 7] },
  ward:     { name: '수호 결계',      max: 2, desc: lv => `모험가 방어력 +${lv * 8}%`,                 cost: [[1200, { lizard_scale: 6 }], [5000, { yeti_fur: 4 }]], days: [3, 6] },
  appraise: { name: '감정술',         max: 2, desc: lv => `장비·스킬북을 얻을 확률 +${lv * 25}%`,      cost: [[1000, { venom_gland: 5 }], [4000, { griffon_claw: 4 }]], days: [3, 5] },
  time:     { name: '시간 결속',      max: 2, desc: lv => `자리를 비운 동안 보상 시간 +${lv}시간`,     cost: [[1500, { golem_core: 2 }], [6000, { maiden_veil: 3 }]], days: [3, 6] }
};

/* ───────── 후원 ───────── */
// need: 그 지역이 열려야 나타난다
const SPONSORS = {
  clinic:   { name: '오물거리 무료 진료소',  desc: '가난한 사람을 공짜로 치료하는 곳.', cost: [400, 1500, 4500], fame: [5, 12, 25],
              perks: ['물약 사는 값 20% 할인', '대기 중 회복 속도 두 배', '물약 회복량 +20%'] },
  guild:    { name: '모험가 길드 신인 지원', desc: '갓 등록한 모험가에게 장비와 숙식을 지원한다.', cost: [600, 2000, 6000], fame: [5, 12, 25],
              perks: ['길드 매입가 70% → 80%', '여관 손님 레벨 +2', '여관 손님 한 명 더, 봉급 10% 할인'] },
  citizens: { name: '하르겐 시민회',         desc: '7번가 상인과 주민의 모임. 암살자 길드에 맞설 힘을 모으고 있다.', cost: [500, 2500, 7000], fame: [6, 15, 30],
              perks: ['상점 손님 +15%', '암살자 길드 토벌 지지', '상점 손님 +15% 더, 특별 의뢰'] },
  dwarves:  { name: '드워프 광산 조합',      desc: '검은바위산 드워프들의 상인 조합.', need: 'mountain', cost: [1500, 4500, 10000], fame: [8, 18, 35],
              perks: ['대장간 제작비 30% 할인', '고급·희귀 장비 확률 상승', '희귀 장비 확률 크게 상승'] },
  elves:    { name: '세계수 수호대',         desc: '세계수를 지키는 엘프 순찰대.', need: 'forest', cost: [1200, 4000, 9000], fame: [8, 18, 35],
              perks: ['부속품을 얻을 확률 +10%', '경험치 +10%', '경험치 +15% 더'] }
};
const GUILD_RAID = { fame: 150, advs: 8, sponsor: 'citizens', tier: 2 };

/* ───────── 은행 ───────── */
const BANK = {
  depositors: ['모험가 하라', '은퇴한 용병 고르', '떠돌이 상인 에반', '모험가 파티 「붉은 매」', '항구 선장 마르코', '견습 기사 루시엔', '음유시인 펠', '대장장이 하겐'],
  borrowers: [
    { name: '빵집 주인 도라', grade: 'A' }, { name: '포목전 상인 시몬', grade: 'A' }, { name: '대장장이 하겐', grade: 'A' },
    { name: '선술집 주인 핀', grade: 'B' }, { name: '광산 투자자 크롬', grade: 'B' }, { name: '여행 상단 「모래바람」', grade: 'B' },
    { name: '몰락한 귀족 벨로아', grade: 'C' }, { name: '노름꾼 짐', grade: 'C' }, { name: '수상한 망토 사내', grade: 'C' }
  ],
  grades: { A: { name: '높음', risk: 0.04, rate: [6, 10] }, B: { name: '보통', risk: 0.12, rate: [12, 18] }, C: { name: '낮음', risk: 0.28, rate: [20, 32] } }
};
