/* ───────── 건물 ───────── */
const BUILDINGS = {
  shop:     { name: '상점',        max: 15, cost: [0, 800, 2000, 4500, 9000, 16000, 27000, 44000, 70000, 110000, 170000, 260000, 390000, 580000, 850000],
    desc: '부속품과 장비를 진열해 손님에게 판다.', eff: lv => `진열대 ${shopStands(lv)}칸 · 손님 +${Math.round((lv - 1) * 10)}%${lv > 5 ? ` · 판매가 +${(lv - 5) * 2}%` : ''}` },
  inn:      { name: '여관',        max: 12, cost: [0, 700, 1800, 4000, 8000, 15000, 26000, 42000, 65000, 100000, 150000, 220000],
    desc: '모험가들의 숙소. 방이 많을수록 더 고용할 수 있다.', eff: lv => `방 ${2 + lv * 2}개 · 숙면 회복 하루 ${20 + 6 * lv}` },
  smithy:   { name: '대장간',      max: 8,  cost: [1500, 3500, 7000, 12000, 22000, 40000, 70000, 120000],
    desc: '부속품으로 장비를 만든다. 넓힐수록 높은 단계와 등급의 장비를 만든다.', eff: lv => `${GTIERS.filter(t => t.smith <= lv).map(t => t.name).join('·')} 장비${lv >= 5 ? ' · 신화' : ''}${lv >= 7 ? '·신성' : ''} · 좋은 품질 +${lv * 3}%` },
  alchemy:  { name: '연금술 공방', max: 6,  cost: [900, 4000, 12000, 30000, 70000, 150000],
    desc: '약초로 회복 물약과 치료 소모품을 만든다.', eff: lv => (lv >= 2 ? '상급 물약·만병통치약까지' : '하급·중급 물약과 치료제') + (lv > 2 ? ` · 덤 ${(lv - 2) * 15}% · 조제비 -${(lv - 2) * 10}%` : '') },
  training: { name: '훈련소',      max: 5,  cost: [1200, 6000, 20000, 60000, 150000],
    desc: '능력치를 단련하고, 스킬북으로 스킬을 배우고, 전직한다.', eff: lv => `능력치 훈련 · 스킬 배우기 · 전직${lv > 1 ? ` · 훈련비 -${(lv - 1) * 12}%` : ''}` },
  bank:     { name: '은행',        max: 8,  cost: [3000, 7000, 15000, 30000, 60000, 110000, 200000, 350000],
    desc: '모험가의 예금을 받아 굴리고, 돈을 빌려주고 이자를 받는다.', eff: lv => `거래 ${lv * 2 + 1}건까지 · 큰손 ×${(0.7 + lv * 0.3).toFixed(1)}` },
  tower:    { name: '마탑',        max: 5,  cost: [4000, 15000, 40000, 100000, 250000],
    desc: '마법을 연구해 상단 전체를 강하게 만든다.', eff: lv => `마법 연구${lv > 1 ? ` · 연구비 -${(lv - 1) * 10}% · 연구 ${(lv - 1)}일 단축` : ''}` },
  temple:   { name: '신전',        max: 8,  cost: [1000, 4000, 10000, 22000, 45000, 85000, 150000, 260000],
    desc: '다친 모험가를 치료하고, 매달 신의 축복을 내려 준다.', eff: lv => `자연 치료 하루 ${4 + 4 * lv} · 치유사 ${Math.min(4, lv)}명 · 매달 축복` }
};
const shopStands = lv => 2 + Math.min(lv, 8) + Math.floor(Math.max(0, lv - 8) / 2);   // Lv8까지 한 칸씩, 그 뒤 두 단계마다
const BUILD_ORDER = ['shop', 'inn', 'training', 'temple', 'alchemy', 'smithy', 'bank', 'tower'];

/* ───────── 신전의 축복 (매달 하나) ───────── */
const BLESSINGS = {
  war:     { name: '전쟁신 바르크의 축복', short: '전쟁', desc: '공격력과 마법 피해 +15%' },
  earth:   { name: '대지모 테라의 축복',   short: '대지', desc: '최대 HP +15%, 방어력 +10%' },
  wind:    { name: '바람신 실피의 축복',   short: '바람', desc: '이동속도 +15%, 회피 +5%p' },
  moon:    { name: '달의 여신 루나의 축복', short: '달빛', desc: '밤에 몰려드는 몬스터가 줄고, 피로가 25% 덜 쌓인다' },
  harvest: { name: '풍요신 하베스의 축복', short: '풍요', desc: '부속품을 얻을 확률 +15%, 경험치 +15%' }
};
const BLESS_IDS = Object.keys(BLESSINGS);

/* ───────── 마차 몸체 (파티마다 하나) ─────────
   cap: 늘어나는 짐, spd: 이동속도 배율. horse: 말이 끌어야 한다 (1 아무 말 · 'goat' 고산지대 산양 · 'fly' 날개 달린 펫).
   손수레 말고는 짐꾼 계열이 파티에 있어야 끈다. 말은 마구간(data-sky.js HORSES)에서 매고, 말의 cap·spd 배율이 곱해진다. */
const WAGONS = {
  cart:    { name: '손수레',           cost: 400,   cap: 20,  spd: 0.97, desc: '파티가 번갈아 끄는 작은 수레. 말도 짐꾼도 필요 없다.' },
  donkey:  { name: '짐수레',           cost: 1500,  cap: 45,  spd: 1.0,  horse: 1, desc: '말 한 마리가 끄는 작은 수레.' },
  wagon:   { name: '짐마차',           cost: 4000,  cap: 90,  spd: 1.05, horse: 1, desc: '지붕 달린 마차. 비를 맞지 않는다.' },
  caravan: { name: '대형 마차',        cost: 9000,  cap: 160, spd: 1.03, horse: 1, desc: '상단용 대형 마차. 짐을 아주 많이 싣는다.' },
  steel:   { name: '드워프 강철 마차', cost: 16000, cap: 260, spd: 1.1,  need: 'dwarves', tier: 2, horse: 'goat', desc: '드워프 광산 조합이 만든 강철 마차. 고산지대 산양만 끌 수 있다.' }
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

/* ───────── 상단 랭크 ───────── */
// 랭크를 올리면 다음 필드가 열리고(랭크 r = FIELD_IDS[r]까지), 시설·한도·거래 혜택이 늘어난다.
const RANKS = [
  { name: 'F', title: '신생 상단' }, { name: 'E', title: '거리의 상단' }, { name: 'D', title: '이름난 상단' }, { name: 'C', title: '큰 상단' },
  { name: 'B', title: '제국 상단' }, { name: 'A', title: '대상단' }, { name: 'S', title: '전설의 상단' }
];
// RANK_UP[r]: 랭크 r → r+1 조건
const RANK_UP = [
  { dungeon: 'plains',   fame: 60,  reqs: 8,   sold: 4000,   advs: 5, lic: [1, 2] },
  { dungeon: 'forest',   fame: 150, reqs: 20,  sold: 18000,  advs: 6, lic: [1, 4] },
  { dungeon: 'mountain', fame: 260, reqs: 36,  sold: 55000,  advs: 7, lic: [2, 3] },
  { dungeon: 'valley',   fame: 400, reqs: 56,  sold: 130000, advs: 8, lic: [2, 5] },
  { dungeon: 'snow',     fame: 560, reqs: 80,  sold: 260000, advs: 9, lic: [3, 3] },
  { dungeon: 'desert',   fame: 750, reqs: 110, sold: 460000, advs: 10, lic: [4, 1] }
];
const BUILD_RANK = { shop: 0, inn: 0, training: 0, temple: 0, alchemy: 0, smithy: 1, bank: 2, tower: 3 };
const PARTY_MAX = [2, 3, 3, 4, 5, 6, 6];   // 일반 파티는 6개까지
const RAID_PARTY_RANK = 6, RAID_FIGHTERS = 9;   // 빌드 36: 6개가 다 열린 뒤(S랭크) 레이드 전용 파티 하나 · 짐꾼 계열 빼고 9명 + 짐꾼 1 = 10명
const rankStands = r => (r >= 2 ? 1 : 0) + (r >= 4 ? 1 : 0) + (r >= 6 ? 1 : 0);
const rankBeds = r => (r >= 3 ? 2 : 0) + (r >= 5 ? 2 : 0);
function rankGifts(r) {   // 랭크 r에 오르면 받는 것 (설명용)
  const out = [];
  if (FIELD_IDS[r]) out.push(`새 필드: ${FIELDS[FIELD_IDS[r]].name}`);
  Object.entries(BUILD_RANK).filter(([, n]) => n === r).forEach(([b]) => out.push(`새 시설: ${BUILDINGS[b].name}`));
  if (PARTY_MAX[r] > PARTY_MAX[r - 1]) out.push(`파티 ${PARTY_MAX[r]}개까지`);
  if (r === RAID_PARTY_RANK) out.push(`레이드 전용 파티 (짐꾼 포함 ${RAID_FIGHTERS + 1}명까지)`);
  if (rankStands(r) > rankStands(r - 1)) out.push('매대 +1');
  if (rankBeds(r) > rankBeds(r - 1)) out.push('여관 방 +2');
  out.push('길드 매입가 +2%p · 상점 손님 +8% · 의뢰 보상 +6%');
  return out;
}

/* ───────── 모험가 라이선스 (개인 랭크) ───────── */
const LICENSE = [
  { name: '동장', c: '#c08a5a', mul: 1 }, { name: '은장', c: '#c8ccd4', mul: 1.05 }, { name: '금장', c: '#f0c24a', mul: 1.11 },
  { name: '백은', c: '#e8f4ff', mul: 1.18 }, { name: '백금', c: '#d8f0ff', mul: 1.28 }
];
// LICENSE_UP[r]: r → r+1 조건 (레벨, 개인 명성, 길드 심사비, 처치 수, 우두머리·주인 처치 수, 던전 공략 수)
// 길드는 레벨만 보지 않는다. 몬스터를 얼마나 잡았고 우두머리를 몇이나 쓰러뜨렸는지, 던전을 공략해 봤는지를 따진다.
const LICENSE_UP = [
  { lv: 18, pf: 100,  fee: 1000,  kills: 300,  bosses: 3 },
  { lv: 32, pf: 350,  fee: 4000,  kills: 1200, bosses: 15, dungeons: 1 },
  { lv: 48, pf: 800,  fee: 12000, kills: 3000, bosses: 40, dungeons: 3 },
  { lv: 65, pf: 1500, fee: 35000, kills: 6000, bosses: 80, dungeons: 6 }
];
// 심사 조건 하나하나 (UI와 심사가 같은 표를 본다)
function licReqs(a) {
  const L = LICENSE_UP[a.rank || 0]; if (!L) return [];
  const out = [
    { k: 'lv', label: '레벨', cur: a.lv, need: L.lv, ok: a.lv >= L.lv },
    { k: 'pf', label: '개인 명성', cur: Math.floor(a.pf || 0), need: L.pf, ok: (a.pf || 0) >= L.pf },
    { k: 'kills', label: '처치', cur: a.kills || 0, need: L.kills, ok: (a.kills || 0) >= L.kills },
    { k: 'bosses', label: '우두머리·주인 처치', cur: a.bosses || 0, need: L.bosses, ok: (a.bosses || 0) >= L.bosses }
  ];
  if (L.dungeons) out.push({ k: 'dungeons', label: '던전·레이드 공략', cur: a.dungeons || 0, need: L.dungeons, ok: (a.dungeons || 0) >= L.dungeons });
  return out;
}

/* ───────── 전직 ───────── */
// 상단 명성이 오르면 훈련소에 스승이 찾아와 2차(명성 40)·3차(명성 300) 전직이 열린다
const JOB_FAME = { 2: 40, 3: 300 };

/* ───────── 부상과 치료 ───────── */
// 쓰러진 모험가는 부상을 입고 돌아온다. need = 다 나을 때까지 필요한 치료 점수
const INJ = [null, { name: '경상', need: 30, c: '#f0b43c' }, { name: '중상', need: 70, c: '#f08a3c' }, { name: '위중', need: 140, c: '#e0503f' }];
// 신전에서 환자를 돌볼 수 있는 직업: 성직자 계열과 성기사. 수술은 역병의사·명의만
const isHealer = c => jobBase(c) === 'cleric' || c === 'paladin';
const SURGEONS = ['plaguedoc', 'physician'];
const careMul = c => (c === 'plaguedoc' ? 1.5 : c === 'physician' ? 1.8 : (CLASSES[c].tr && CLASSES[c].tr.healPow) || 1);
const STRETCHER = 15;      // 들것 하나가 차지하는 짐
const POT_TREAT = { pot_s: 20, pot_m: 50, pot_l: 110 };
const HERB_USE = 3, HERB_PTS = 30;        // 약초 세 개로 한 번 처치
const MED_MUL = 2;                        // 약재 처방 = 약재 값(med) × 2
const SURGERY = { pct: 0.6, gold: 4 };    // 남은 치료의 60%를 한 번에. 비용 = 남은 점수 × 4G (역병의사 필요, 부상마다 한 번)
const MED = { slime_jelly: 6, spore: 12, treant_sap: 16, venom_gland: 18, poison_vial: 24, snow_essence: 30, frost_crystal: 34 };
Object.entries(MED).forEach(([k, v]) => { if (ITEMS[k]) ITEMS[k].med = v; });
ITEMS.herb = { name: '약초', v: 8, w: 1, icon: 'leaf', c: '#5aa84a', buy: 20, herb: 1, med: 10 };

/* ───────── 숙면 피로 ───────── */
// 원정 동안 쌓이고 여관 방에서 자야만 풀린다. 많이 쌓이면 원정에 못 나간다.
const SLEEP = { field: 0.065, fight: 0.03, block: 30, ready: 8, max: 85, rest: lv => (20 + 6 * lv) / DAY_SEC };
