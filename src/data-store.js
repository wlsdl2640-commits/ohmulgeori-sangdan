/* ───────── 빌드 63: 창고 여럿 · 레어도 등급 · 대장간 합성 · 스킬북 단계 (11-11 10:02 사용자) ─────────
   · 창고: 메인 창고에 칸 제한(WH_MAIN_CAP) + 창고 1~10(기본 1개, 나머지는 상단 랭크로 열림 WH_OPEN). 물건 한 종류 = 한 칸, 장비 한 점 = 한 칸.
     창고 1~10은 보관용 — 팔거나 재료로 쓰려면 메인 창고로 옮긴다.
   · 등급(레어도): 장비는 품질(q), 물건은 제작에 어디 들어가는지로 itemGrade(k) 0~GRADE_MAX (일반 · 고급 · 희귀 · 영웅 · 전설 · 신화 · 신성 · 우주)
   · 합성: 같은 레어도 · 같은 갈래(무기 · 부장비 · 방어구 · 장신구) 장비 9개 → 다음 레어도 무작위 장비 하나, 아주 가끔 두 단계
   · 스킬북: 찢어진(공용) · 낡은(1차) · 빛바랜(2차) · 신비한(3차) · 고대의(4차) · 신화 속(5차) 스킬북을 펼치면 그 차수 스킬북 하나가 뽑힌다 */

/* ── 창고 ── */
const WH_MAIN_CAP = 200;                 // 메인 창고 칸
const WH_CAP = 100;                      // 창고 1~10 칸
const WH_N = 10;
const WH_OPEN = [1, 2, 3, 5, 6, 8, 10];  // 상단 랭크 F · E · D · C · B · A · S마다 열린 창고 수 (기본 1)
const whOpenAt = i => WH_OPEN.findIndex(n => n > i);   // 창고 i(0부터)가 열리는 랭크
const WH_FULL = '메인 창고에 빈 칸이 없어요. 팔거나 창고 1~10으로 옮긴 뒤에 받을 수 있어요.';   // 사용자 「넘치면 못 얻게」

/* ── 레어도 등급 (QUALITY와 같은 이름 · 색) ── */
const GRADE_MAX = 7;   // 빌드 63 다섯째 묶음: 신성 다음 우주 (창조는 시안을 고른 뒤 8)
const gradeName = g => QUALITY[Math.max(0, Math.min(GRADE_MAX, g))].name;
const gradeTag = g => `<span class="tag rqt rq${g}">${gradeName(g)}</span>`;
/* 장비 드랍 (빌드 63 다섯째 묶음, 11-11 15:01 사용자 「모든 레어도가 드랍으로 나오게, 대신 영웅 다음 등급부터는 고등급 필드 · 던전 등에서, 드랍율을 극도로 낮춰.
   애초에 모든 장비의 드랍율을 낮추자. 영웅 다음 단계부터는 더 낮추고」) — 장비가 떨어질 확률은 예전의 절반쯤, 레어도는 rollGrade(core.js)가 이 표로 고른다 */
const GEAR_DROP = { field: 0.003, dungeon: 0.012, fb: 0.35, boss: 0.6, chest: 0.2 };   // 예전 필드 0.006 · 던전 0.025 · 필드 우두머리 0.6 · 던전 주인 1 · 보물고 상자 0.35
const GRADE_DROP = {
  p: [0, 0.25, 0.05, 0.004, 0.0002, 0.00003, 0.000004, 5e-7, 6e-8],   // 장비 한 점이 그 레어도일 확률 (보통 몬스터) — 일반 · 고급 · 희귀 · 영웅 · 전설 · 신화 · 신성 · (우주 · 창조)
  tier: [0, 0, 0, 0, 6, 9, 12, 14, 15],   // 이 장비 단계 땅부터 나온다 — 전설 늪지대(마계)~ · 신화 안개 묘지(북쪽 변경)~ · 신성 구름섬~ · 우주 천계의 유적 폐허~ · 창조 별의 정원
  lo: { fb: 0.2, boss: 0.25, chest: 0.3, raid: 0.3 },   // 고급 · 희귀에 더하는 몫 (예전 rollQuality의 boost)
  hi: { fb: 3, boss: 6, chest: 4, raid: 8 }   // 영웅부터 곱하는 배율 — 필드 우두머리 · 던전 주인 · 보물 상자 · 레이드 보상
};
const tierGrade = t => Math.min(5, Math.floor(t / 3));   // 장비 단계 0~15 → 일반 ~ 신화
const SUP_GRADE = { pot_s: 0, mp_s: 0, bandage: 0, pot_m: 1, mp_m: 1, antidote: 1, salve: 1, warmer: 1, ward: 1, salts: 1, eyedrop: 1, pot_l: 2, tonic: 2, holyvial: 2, panacea: 3 };
const vGrade = v => (v < 30 ? 0 : v < 100 ? 1 : v < 300 ? 2 : v < 1000 ? 3 : v < 5000 ? 4 : 5);   // 아무 데도 안 들어가는 것은 값으로
let IGRADE = null;
// 재료가 들어가는 곳: 장비 단계 재료 · 조제법 · 요리. 여러 곳에 들어가면 가장 낮은 쓰임새(흔한 재료는 흔하게) — 히포크리초 · 날고기 · 밀가루는 일반
function gradeTable() {
  const G = {};
  const use = (k, g) => { if (ITEMS[k]) G[k] = Math.min(G[k] == null ? GRADE_MAX : G[k], Math.max(0, Math.min(GRADE_MAX, g))); };
  GTIERS.forEach((T, t) => (T.mats || []).forEach(m => use(m, tierGrade(t))));
  for (const r of RECIPES) { const g = SUP_GRADE[r.out] != null ? SUP_GRADE[r.out] : 1; for (const m in r.need) use(m, g); }
  if (typeof FOODS !== 'undefined') for (const id in FOODS) for (const m in FOODS[id].need) use(m, FOODS[id].lv - 1);
  // 보스 부속품은 들어가는 장비 등급 그대로 (BOSS_RECIPE): 증표 = 영웅 · 핵 = 전설 · 혼 = 신화, 레이드 부속품 = 신화 · 심장 = 신성
  for (let t = 0; t < GTIERS.length; t++) { if (ITEMS['crest_' + t]) G['crest_' + t] = 3; if (ITEMS['core_' + t]) G['core_' + t] = 4; if (ITEMS['soul_' + t]) G['soul_' + t] = 5; }
  Object.keys(ITEMS).forEach(k => { if (k.startsWith('rp_')) G[k] = 5; if (k.startsWith('rh_')) G[k] = 6; });
  return G;
}
function itemGrade(k) {
  const I = ITEMS[k]; if (!I) return 0;
  if (!IGRADE) IGRADE = gradeTable();
  if (I.g != null) return I.g;                          // 정해 둔 레어도 (상단 전용 물건)
  if (I.book) return bookGrade(I.book);
  if (I.btier != null) return BOOK_TIERS[I.btier].g;
  if (I.rune) return [1, 3, 5][I.rune[1]] || 1;
  if (I.egg) return 3;
  if (I.use) return 4;                                   // 마법사의 돌 · 개화석
  if (I.dish) return Math.min(GRADE_MAX, (FOODS[I.dish] && FOODS[I.dish].lv) || 1);
  if (SUP_GRADE[k] != null) return SUP_GRADE[k];
  if (I.trade) return 2;
  if (I.herb) return IGRADE[k] != null ? IGRADE[k] : Math.max(0, vGrade(I.v) - 1);
  if (IGRADE[k] != null) return IGRADE[k];
  return vGrade(I.v || 0);
}

/* ── 대장간 합성 ── */
const FUSE = { n: 9, jump: 0.01, fee: [300, 1200, 5000, 20000, 80000, 300000, 1200000] };   // 넣는 수 · 두 단계 오를 확률 · 레어도별 비용
const FUSE_CAT = { weapon: '무기', off: '부장비', armor: '방어구', acc: '장신구' };
const fuseCatOf = g => { const sl = GTYPES[g.base] && GTYPES[g.base].slot; return FUSE_CAT[sl] ? sl : null; };   // 화살 · 가방은 합성하지 않는다
const fuseBases = cat => GTYPE_IDS.filter(b => GTYPES[b].slot === cat && !GTYPES[b].ammo);   // 떨어뜨리는 표와 같은 종류 (방패는 dropBase처럼 고른다 · 표창 · 투기장 장비는 빼고)
const fuseTier = gs => Math.round(gs.reduce((x, g) => x + g.t, 0) / Math.max(1, gs.length));   // 나오는 장비의 단계(Lv 구간) = 넣은 장비 단계의 평균

/* ── 스킬북 단계 ── */
const BOOK_TIERS = [
  { id: 'bk_torn',    name: '찢어진 스킬북', g: 0, c: '#a8987a', v: 150,   desc: '겉면이 찢겨 나간 스킬북. 펼치면 누구나 배우는 공용 스킬북 하나가 나온다.' },
  { id: 'bk_old',     name: '낡은 스킬북',   g: 1, c: '#9a7048', v: 400,   desc: '손때가 잔뜩 묻은 스킬북. 펼치면 1차 직업 스킬북 하나가 나온다.' },
  { id: 'bk_faded',   name: '빛바랜 스킬북', g: 2, c: '#6a90b8', v: 1600,  desc: '글씨가 바랜 스킬북. 펼치면 2차 직업 스킬북 하나가 나온다.' },
  { id: 'bk_myst',    name: '신비한 스킬북', g: 3, c: '#9a60e0', v: 6000,  desc: '책장이 스스로 빛나는 스킬북. 펼치면 3차 직업 스킬북 하나가 나온다.' },
  { id: 'bk_ancient', name: '고대의 스킬북', g: 4, c: '#d8a840', v: 24000, desc: '고대 문자로 쓰인 스킬북. 펼치면 4차 직업 스킬북 하나가 나온다.' },
  { id: 'bk_myth',    name: '신화 속 스킬북', g: 5, c: '#ff6a4a', v: 90000, desc: '신화에만 전하던 스킬북. 펼치면 5차 직업 스킬북 하나가 나온다.' }
];
BOOK_TIERS.forEach((B, t) => { ITEMS[B.id] = { name: B.name, v: B.v, w: 1, icon: 'book', c: B.c, btier: t, desc: B.desc }; });
const TIER_BOOK_IDS = BOOK_TIERS.map(B => B.id);
// 스킬의 차수: 공용 0 · 직업 차수(여러 직업이면 가장 높은 것) · 왕국 스킬북처럼 「n차 전직 후」(s.tier)면 그 차수
function skillBookTier(id) {
  const s = SKILLS[id]; if (!s || s.awk || isInnate(id)) return -1;
  if ((s.cls || []).includes('all')) return 0;
  let t = Math.max(1, ...(s.cls || []).map(c => (CLASSES[c] ? jobTier(c) : 1)));
  if (s.tier) t = Math.max(t, s.tier);
  return Math.min(5, t);
}
const BOOK_POOL = BOOK_TIERS.map(() => []);
Object.keys(SKILLS).forEach(id => { const t = skillBookTier(id); if (t >= 0) BOOK_POOL[t].push(id); });
// 2차 · 3차 스킬도 이제 스킬북으로만 배운다 → 없던 책을 만든다 (전직 기본 스킬 · 각성기는 빼고)
BOOK_POOL.forEach(L => L.forEach(id => {
  if (ITEMS['book_' + id]) return;
  const s = SKILLS[id], fam = (s.cls || []).map(c => (CLASSES[c] ? jobBase(c) : c))[0] || 'all';
  ITEMS['book_' + id] = { name: `스킬북: ${s.name}`, v: 60 + s.lv * 35, w: 1, icon: 'book', c: BOOK_COLORS[fam] || '#4a8ac8', book: id };
  if (!BOOK_IDS.includes(id)) BOOK_IDS.push(id);
}));
/* 뽑기 확률: 직업(공용은 공용끼리)마다 배우는 레벨 순서로 등급을 매기고 무게로 나눈다
   앞 35% 흔함 4 · 60%까지 보통 2.5 · 85%까지 드묾 1.5 · 나머지 희귀 1 · Lv90 이상 전설 0.4 · 패시브는 한 칸 드물게 · 왕국 · 투기장 스킬은 드묾부터.
   표는 사용자에게 시트로 보냈다 (빌드 63) — 손으로 바꾼 무게는 BOOK_W_SET에.
   확률 = 무게 ÷ 그 책 전체 무게 합. 손으로 정할 스킬은 BOOK_W_SET에 무게를 적는다 */
const BOOK_BAND = [{ n: '흔함', w: 4 }, { n: '보통', w: 2.5 }, { n: '드묾', w: 1.5 }, { n: '희귀', w: 1 }, { n: '전설', w: 0.4 }];
const BOOK_W_SET = {};
const BOOK_BAND_OF = {}, BOOK_W = {}, BOOK_P = {};
BOOK_POOL.forEach((L, t) => {
  const groups = {};
  L.forEach(id => { const s = SKILLS[id], k = (s.cls || ['all']).includes('all') ? 'all' : s.cls[0]; (groups[k] = groups[k] || []).push(id); });
  Object.values(groups).forEach(G => {
    G.sort((a, b) => SKILLS[a].lv - SKILLS[b].lv || (SKILLS[a].passive ? 1 : 0) - (SKILLS[b].passive ? 1 : 0));
    G.forEach((id, i) => {
      const s = SKILLS[id], f = (i + 0.5) / G.length;   // 그 묶음 안에서 배우는 레벨 순서 (가운데 기준)
      let b = f < 0.35 ? 0 : f < 0.6 ? 1 : f < 0.85 ? 2 : 3;
      if (s.passive) b = Math.min(3, b + 1);
      if (s.kingdom || s.arena) b = Math.max(2, b);
      if (s.lv >= 90) b = 4;
      BOOK_BAND_OF[id] = b; BOOK_W[id] = BOOK_W_SET[id] != null ? BOOK_W_SET[id] : BOOK_BAND[b].w;
    });
  });
  const sum = L.reduce((x, id) => x + BOOK_W[id], 0);
  L.forEach(id => { BOOK_P[id] = sum ? BOOK_W[id] / sum : 0; });
});
// 스킬북 하나의 레어도: 그 차수 + 뽑기 등급 (흔함 · 보통은 그대로, 드묾 +1, 희귀 · 전설 +2)
function bookGrade(id) { const t = skillBookTier(id), b = BOOK_BAND_OF[id] || 0; return t < 0 ? 1 : Math.min(GRADE_MAX, Math.max(1, t) + (b >= 3 ? 2 : b === 2 ? 1 : 0)); }
// 그 단계 책에서 하나 뽑는다
function drawBook(t) {
  const L = BOOK_POOL[t]; if (!L || !L.length) return null;
  let r = rnd(), last = L[L.length - 1];
  for (const id of L) { r -= BOOK_P[id]; if (r <= 0) return id; }
  return last;
}
/* 어디서 나오나: 몬스터를 잡으면 스킬북이 나올 확률(BOOK_RATE 그대로: 필드 0.4% · 던전 0.8% · 우두머리 8% · 주인 25%) 뒤
   그 땅의 단계에 따라 어느 책인지 고른다. 우두머리 · 주인은 한 줄 아래 표를 쓴다. 고대의 · 신화 속 스킬북은 4차 · 5차가 생길 때부터 */
const BOOK_MIX = [   // [찢어진, 낡은, 빛바랜, 신비한] — 합이 50: 나머지 50은 꽝 (사용자 「찢어진 30 · 낡은 20, 너무 높음」)
  [30, 20, 0, 0],    // 땅 단계 0~2 (평원 · 원시림 · 검은바위산)
  [18, 20, 12, 0],   // 3~5
  [12, 15, 18, 5],   // 6~8
  [10, 10, 18, 12],  // 9~11
  [8, 7, 15, 20]     // 12~
];
const bookBand = tier => Math.min(BOOK_MIX.length - 1, Math.floor(Math.max(0, tier || 0) / 3));
function tierBookFor(tier, boss) {   // 꽝이면 null
  const row = BOOK_MIX[Math.min(BOOK_MIX.length - 1, bookBand(tier) + (boss ? 1 : 0))];
  let r = rnd() * 100;
  for (let i = 0; i < row.length; i++) { r -= row[i]; if (r < 0) return row[i] > 0 && BOOK_POOL[i].length ? BOOK_TIERS[i].id : null; }
  return null;
}
// 도감 · 설명용: 그 땅에서 스킬북 뽑기를 하면 어느 책이 몇 %인지 [[책 id, %], …] (나머지는 꽝)
function tierBookMix(tier, boss) {
  const row = BOOK_MIX[Math.min(BOOK_MIX.length - 1, bookBand(tier) + (boss ? 1 : 0))];
  return row.map((v, i) => [BOOK_TIERS[i].id, BOOK_POOL[i].length ? v : 0]).filter(([, pc]) => pc > 0);
}
// 드랍 말고 다른 곳은 아주 드물고 비싸게 (사용자 11-11 11:10): 상인 · 암시장 · 왕국 상단에 나올 확률과 값(기준가 ×)
// 빌드 63 (11-11 13:03 사용자 「스킬북은 드랍 외에는 얻는 방법이 없게」): 상인 · 암시장 · 왕국 상단 · 투기장 · 왕국 의뢰는 스킬북을 팔지도 주지도 않는다 — 대신 상단마다 전용 물건(EXCL, 아래)
// 레벨로 (원정 보물 상자 · 던전 공략 상자): 그 레벨 장비 단계를 땅 단계로 본다
const tierOfLv = L => { let t = 0; GTIERS.forEach((T, i) => { if (T.lv <= L) t = Math.max(t, i); }); return t; };
const tierBookForLv = (L, boss) => tierBookFor(tierOfLv(L), boss);
// 도서관: 스킬북 단계를 만든다 (양피지 · 먹물)
const pctTxt = p => (p >= 0.1 ? (p * 100).toFixed(1) : p >= 0.01 ? (p * 100).toFixed(2) : (p * 100).toFixed(3)).replace(/\.?0+$/, '') + '%';
// 스킬 하나가 어디서 나오는지 (창고 · 도감 · 모험가 창)
function bookSrcText(id) {
  const t = skillBookTier(id);
  if (t < 0 || !BOOK_P[id]) return '';
  return `「${BOOK_TIERS[t].name}」을 펼치면 ${pctTxt(BOOK_P[id])} (${BOOK_BAND[BOOK_BAND_OF[id]].n})`;
}
// 스킬북 단계가 어디서 나오는지
const TIER_BOOK_SRC = [   // 몬스터 드랍과 원정 중 보물 상자(보물고 · 던전 첫 공략)만
  '몬스터(땅이 낮을수록 잘 나옴) · 원정 보물 상자',
  '몬스터 · 원정 보물 상자',
  '바람계곡 · 뒷골목부터의 몬스터 · 그 앞 땅의 우두머리 · 던전 주인 · 원정 보물 상자',
  '늪지대부터의 몬스터 · 바람계곡부터의 우두머리 · 던전 주인 · 원정 보물 상자',
  '4차 직업이 생기면 나와요',
  '5차 직업이 생기면 나와요'
];
BUILDINGS.library.desc = '같은 레어도 스킬북 9권을 합성해 한 단계 위 레어도 스킬북 하나를 만든다.';
BUILDINGS.library.eff = lv => `${['고급 · 희귀', '영웅 · 전설', '신화'][lv - 1]} 스킬북 합성까지`;
const LIB_FUSE = { n: 9, jump: 0.01, fee: [200, 800, 3000, 12000, 40000, 150000], lib: [1, 1, 2, 2, 3, 3] };   // 넣는 레어도마다 비용 · 도서관 단계

STORY.v63b = [
  '상단 창고가 넓어졌다. 지금까지 쓰던 창고는 「메인 창고」(200칸)가 되고, 그 왼편에 창고 1~10(100칸씩)이 생겼다. 창고 1은 처음부터 열려 있고, 나머지는 상단 랭크가 오를 때마다 열린다.',
  '물건 한 종류 · 장비 한 점이 한 칸이다. 메인 창고에 빈 칸이 없으면 사기 · 만들기 · 장비 빼기를 할 수 없다. 원정 짐은 메인이 가득 차면 창고 1~10으로 가고, 거기에도 빈 칸이 없으면 못 가져온다. 창고 1~10은 보관용이라 쓰거나 팔려면 메인 창고로 옮긴다 — 칸을 여럿 골라 한꺼번에, 또는 왼쪽 창고 띠로 끌어다 놓아도 된다.',
  '「창고 정리」를 누르면 레어도가 높은 것부터 늘어선다. 부속품 · 재료도 제작에 어디 들어가는지에 따라 레어도(일반 ~ 신성)가 매겨져 칸 테두리 색이 달라지고, 레어도가 높을수록 칸이 빛난다. 장비 칸은 직업마다 나눠 볼 수 있다.',
  '대장간에 「합성」이 생겼다. 같은 레어도 · 같은 갈래(무기 · 부장비 · 방어구 · 장신구) 장비 9점을 넣으면 다음 레어도 장비 하나가 무작위로 나온다. 아주 드물게(1%) 두 단계 위가 나온다.',
  '스킬북은 이제 스킬북 단계로 나온다: 찢어진(공용) · 낡은(1차) · 빛바랜(2차) · 신비한(3차) 스킬북. 고대의 · 신화 속 스킬북은 4차 · 5차 직업이 생기면 나온다. 창고에서 펼치면 그 차수 스킬북 하나가 뽑힌다 — 스킬마다 뽑힐 확률이 다르다.',
  '스킬북은 몬스터가 떨어뜨리거나 원정 중 보물 상자에서만 나온다. 상인 · 암시장 · 왕국 상단 · 투기장 상단은 스킬북 대신 저마다 전용 물건(나침반 · 부적 · 창고 증서 · 합성 촉매 같은 것)을 판다. 도서관에서는 같은 레어도 스킬북 9권을 합성해 한 단계 위 스킬북을 만든다.',
  '2차 · 3차 고유 스킬도 이제 스킬북으로 배운다. 직업 기본 스킬은 전직할 때 그대로 받는다. 이미 배운 스킬과 가지고 있던 스킬북은 그대로다.',
  '메뉴는 오른쪽 위 「메뉴」 하나로 접었다. 누르면 메뉴판이 펼쳐진다. 영웅 레어도부터는 칸과 그림 위로 홀로그램 빛이 지나간다. 표창은 한 통에 1.5배 더 담는다.'
];

STORY.v63c = [   // 빌드 63 다섯째 묶음 (다음 APK)
  '장비가 떨어지는 일이 예전보다 드물어졌다. 그 대신 이제 모든 레어도가 몬스터에게서 나올 수 있다.',
  '영웅 장비는 어디서나 아주 가끔. 전설은 늪지대(마계)부터, 신화는 안개 묘지(북쪽 변경)부터, 신성은 구름섬부터 나온다. 필드 우두머리 · 던전 주인 · 보물 상자 · 레이드일수록 잘 나오지만, 그래도 아주 드물다.',
  '던전 첫 공략 · 보물고 · 레이드 보상에 정해져 있던 전설 장비는 영웅 장비가 되었다(높은 땅이면 아주 가끔 그 위가 나온다). 암시장 · 경매장은 영웅 장비까지만 판다.',
  '영웅 레어도부터는 칸 전체에 그 레어도 색(영웅 보라 · 전설 금 · 신화 빨강 · 신성 흰빛 · 우주 별빛)의 홀로그램 필름 결이 흐르고, 넓은 빛이 비스듬히 지나간다.',
  '신성 위에 새 레어도 「우주」가 생겼다. 남빛 테 안에 별밤이 흐른다. 천계의 유적 폐허부터 아주아주 드물게 나오고, 대장간에서 신성 장비 9점을 합성해도 된다.'
];

/* ───────── 다른 상단의 전용 물건 (빌드 63, 사용자 11-11 13:03 「스킬북은 드랍 외에는 없게, 대신 다른 상단이 판매하는 전용템을 고안해줘」) ─────────
   bst = 원정 휴대품: 창고에서 「쓰기」 하면 다음 원정 n번(어느 파티든 떠날 때 하나씩) 효과가 붙는다. 효과 글자는 도시락(FOODS fx)과 같은 길로 간다(kitchen.js foodFx가 합친다)
         luck 전리품 · exp 경험치 · fat 피로 · sleep 졸음 · move 이동 · atk · matk + 새 글자 book(스킬북 뽑기 확률) · rare(반짝이는 희귀종)
   perm = 영구: whPlus(메인 창고 칸) · salePlus(진열대 판매 값) · fuseCat(다음 합성 한 번 두 단계 위 확률 FUSE_CAT_P) */
const EXCL = {
  ex_compass:  { name: '길잡이 나침반',      shop: 'merchant', price: 6000,  v: 2000, c: '#c8a040', icon: 'compass',  g: 2, bst: { n: 3, fx: { move: 0.15 } }, desc: '바늘이 언제나 지름길을 가리킨다는 떠돌이 상인의 나침반.' },
  ex_coin:     { name: '행운의 은화',        shop: 'merchant', price: 8000,  v: 2600, c: '#d8dce4', icon: 'coin',     g: 2, bst: { n: 3, fx: { luck: 0.2 } }, desc: '「한 번도 진 적 없는 동전」이라며 상인이 내미는 은화.' },
  ex_bookcharm:{ name: '금서 사냥꾼의 부적', shop: 'bm',       price: 15000, v: 4000, c: '#8a5ac8', icon: 'charm',    g: 3, bst: { n: 3, fx: { book: 0.5 } }, desc: '스킬북 냄새를 맡는다는 부적. 출처는 묻지 말 것.' },
  ex_bait:     { name: '희귀종 미끼',        shop: 'bm',       price: 9000,  v: 2600, c: '#e0c040', icon: 'bait',     g: 2, bst: { n: 3, fx: { rare: 1 } }, desc: '반짝이는 것들만 꾀어내는 금빛 미끼.' },
  ex_flag:     { name: '투사의 깃발',        shop: 'arena',    coins: 120,   v: 1800, c: '#c0392b', icon: 'flag',     g: 2, bst: { n: 3, fx: { atk: 0.08, matk: 0.08 } }, desc: '투기장 우승자가 들던 깃발. 들고 나가면 피가 끓는다.' },
  ex_laurel:   { name: '승리의 월계관',      shop: 'arena',    coins: 150,   v: 2200, c: '#5ac84a', icon: 'laurel',   g: 2, bst: { n: 3, fx: { exp: 0.25 } }, desc: '쓰고 나간 날은 배우는 것이 많다.' },
  ex_deed:     { name: '왕실 창고 증서',     shop: 'inglisia', price: 30000, v: 6000, c: '#3f6aa8', icon: 'deed',     g: 3, perm: { whPlus: 10, max: 100 }, desc: '잉그리시아 왕실 창고 한쪽을 빌려 쓰는 증서. 쓰면 메인 창고가 10칸 넓어진다 (100칸까지).' },
  ex_seal:     { name: '상인 길드 인장',     shop: 'frama',    price: 50000, v: 9000, c: '#a8432f', icon: 'seal',     g: 3, perm: { salePlus: 0.02, max: 0.1 }, desc: '프라마 상인 길드의 인장. 쓰면 진열대에서 파는 값이 2% 오른다 (10%까지).' },
  ex_dew:      { name: '세계수 이슬',        shop: 'elves',    price: 8000,  v: 2400, c: '#7ad8a8', icon: 'dew',      g: 2, bst: { n: 3, fx: { fat: 0.3, sleep: 0.3 } }, desc: '엘프가 새벽에 모은 세계수 잎의 이슬. 마시면 몸이 가볍다.' },
  ex_bell:     { name: '사막 낙타 방울',     shop: 'sarak',    price: 7000,  v: 2200, c: '#e0b050', icon: 'bell',     g: 2, bst: { n: 3, fx: { carry: 5 } }, desc: '사라크 대상(隊商)이 낙타 목에 다는 방울. 짐을 더 지고도 발이 가볍다.' },
  ex_catalyst: { name: '드워프 합성 촉매',   shop: 'dwarves',  price: 20000, v: 5000, c: '#e87a3a', icon: 'catalyst', g: 3, perm: { fuseCat: 1 }, desc: '브론하임 대장장이의 비전 가루. 다음 합성(대장간 · 도서관) 한 번, 두 단계 위가 나올 확률이 15%가 된다.' }
};
const FUSE_CAT_P = 0.15;
const EXCL_SHOP = { merchant: '떠돌이 상인', bm: '암시장', arena: '투기장 상단', inglisia: '잉그리시아 왕국 상단', frama: '프라마 왕국 상단', elves: '엘프 왕국 실바레아 상단', dwarves: '드워프 왕국 브론하임 상단', sarak: '사라크 술탄국 상단' };
Object.entries(EXCL).forEach(([k, X]) => { ITEMS[k] = { name: X.name, v: X.v, w: 1, icon: X.icon, c: X.c, use: 'excl', excl: 1, g: X.g, desc: X.desc }; });
const exclOf = shop => Object.keys(EXCL).filter(k => EXCL[k].shop === shop);
const exclPrice = k => EXCL[k].price;
