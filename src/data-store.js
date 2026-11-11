/* ───────── 빌드 63: 창고 여럿 · 레어도 등급 · 대장간 합성 · 스킬북 단계 (11-11 10:02 사용자) ─────────
   · 창고: 메인 창고에 칸 제한(WH_MAIN_CAP) + 창고 1~10(기본 1개, 나머지는 상단 랭크로 열림 WH_OPEN). 물건 한 종류 = 한 칸, 장비 한 점 = 한 칸.
     창고 1~10은 보관용 — 팔거나 재료로 쓰려면 메인 창고로 옮긴다.
   · 등급(레어도): 장비는 품질(q), 물건은 제작에 어디 들어가는지로 itemGrade(k) 0~6 (일반 · 고급 · 희귀 · 영웅 · 전설 · 신화 · 신성)
   · 합성: 같은 레어도 · 같은 갈래(무기 · 부장비 · 방어구 · 장신구) 장비 9개 → 다음 레어도 무작위 장비 하나, 아주 가끔 두 단계
   · 스킬북: 찢어진(공용) · 낡은(1차) · 빛바랜(2차) · 신비한(3차) · 고대의(4차) · 신화 속(5차) 스킬북을 펼치면 그 차수 스킬북 하나가 뽑힌다 */

/* ── 창고 ── */
const WH_MAIN_CAP = 200;                 // 메인 창고 칸
const WH_CAP = 100;                      // 창고 1~10 칸
const WH_N = 10;
const WH_OPEN = [1, 2, 3, 5, 6, 8, 10];  // 상단 랭크 F · E · D · C · B · A · S마다 열린 창고 수 (기본 1)
const whOpenAt = i => WH_OPEN.findIndex(n => n > i);   // 창고 i(0부터)가 열리는 랭크

/* ── 레어도 등급 (QUALITY와 같은 이름 · 색) ── */
const GRADE_MAX = 6;
const gradeName = g => QUALITY[Math.max(0, Math.min(GRADE_MAX, g))].name;
const gradeTag = g => `<span class="tag rqt rq${g}">${gradeName(g)}</span>`;
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
const FUSE = { n: 9, jump: 0.01, fee: [300, 1200, 5000, 20000, 80000, 300000] };   // 넣는 수 · 두 단계 오를 확률 · 레어도별 비용
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
const BOOK_MIX = [   // [찢어진, 낡은, 빛바랜, 신비한]
  [55, 45, 0, 0],    // 땅 단계 0~2 (평원 · 원시림 · 검은바위산)
  [35, 40, 25, 0],   // 3~5
  [25, 30, 35, 10],  // 6~8
  [20, 20, 35, 25],  // 9~11
  [15, 15, 30, 40]   // 12~
];
const bookBand = tier => Math.min(BOOK_MIX.length - 1, Math.floor(Math.max(0, tier || 0) / 3));
function tierBookFor(tier, boss) {
  const row = BOOK_MIX[Math.min(BOOK_MIX.length - 1, bookBand(tier) + (boss ? 1 : 0))], sum = row.reduce((x, v) => x + v, 0);
  let r = rnd() * sum;
  for (let i = 0; i < row.length; i++) { r -= row[i]; if (r <= 0 && row[i] > 0 && BOOK_POOL[i].length) return BOOK_TIERS[i].id; }
  return 'bk_torn';
}
// 도감 · 설명용: 그 땅에서 스킬북이 나오면 어느 책이 몇 %인지 [[책 id, %], …]
function tierBookMix(tier, boss) {
  const row = BOOK_MIX[Math.min(BOOK_MIX.length - 1, bookBand(tier) + (boss ? 1 : 0))].map((v, i) => (BOOK_POOL[i].length ? v : 0)), sum = row.reduce((x, v) => x + v, 0) || 1;
  return row.map((v, i) => [BOOK_TIERS[i].id, Math.round(v / sum * 100)]).filter(([, pc]) => pc > 0);
}
// 레벨로 (보물 상자 · 상인 · 의뢰 보상): 그 레벨 장비 단계를 땅 단계로 본다
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
const TIER_BOOK_SRC = [
  '어느 땅의 몬스터든(낮은 땅일수록 잘 나옴) · 보물 상자 · 떠돌이 상인 · 암시장 · 도서관',
  '어느 땅의 몬스터든 · 보물 상자 · 떠돌이 상인 · 암시장 · 투기장 상단(60코인) · 도서관',
  '바람계곡 · 뒷골목부터의 몬스터 · 그 앞 땅의 우두머리 · 던전 주인 · 보물 상자 · 떠돌이 상인 · 암시장 · 투기장 상단(150코인) · 왕국 상단 · 왕국 의뢰(두 권) · 도서관 2단계',
  '늪지대부터의 몬스터 · 바람계곡부터의 우두머리 · 던전 주인 · 보물 상자 · 암시장 · 투기장 상단(400코인) · 왕국 상단 · 도서관 3단계',
  '4차 직업이 생기면 나와요',
  '5차 직업이 생기면 나와요'
];
BUILDINGS.library.desc = '양피지 · 먹물로 스킬북 단계(찢어진 · 낡은 · 빛바랜 · 신비한)를 만든다.';
BUILDINGS.library.eff = lv => `${['낡은', '빛바랜', '신비한'][lv - 1]} 스킬북까지 제작${lv > 1 ? ` · 제작비 -${(lv - 1) * 15}%` : ''}`;
const libTierFee = k => Math.round(LIB_TIER_BOOKS[k].fee * (1 - Math.max(0, ((S && S.bld.library) || 1) - 1) * 0.15) / 10) * 10;   // 넓힐수록 싸게 (예전 도서관과 같음)
const LIB_TIER_BOOKS = {
  bk_torn:  { lib: 1, need: { parchment: 2, ink: 1 }, fee: 300 },
  bk_old:   { lib: 1, need: { parchment: 3, ink: 2 }, fee: 900 },
  bk_faded: { lib: 2, need: { parchment: 5, ink: 3 }, fee: 4000 },
  bk_myst:  { lib: 3, need: { parchment: 8, ink: 5 }, fee: 20000 }
};

STORY.v63b = [
  '상단 창고가 넓어졌다. 지금까지 쓰던 창고는 「메인 창고」(200칸)가 되고, 그 왼편에 창고 1~10(100칸씩)이 생겼다. 창고 1은 처음부터 열려 있고, 나머지는 상단 랭크가 오를 때마다 열린다.',
  '물건 한 종류 · 장비 한 점이 한 칸이다. 원정에서 돌아왔을 때 메인 창고가 가득 차면 짐이 창고 1~10으로 가고, 거기에도 빈 칸이 없으면 길드에 판다. 창고 1~10은 보관용이라 쓰거나 팔려면 메인 창고로 옮긴다.',
  '「창고 정리」를 누르면 레어도가 높은 것부터 늘어선다. 부속품 · 재료도 제작에 어디 들어가는지에 따라 레어도(일반 ~ 신성)가 매겨져 칸 테두리 색이 달라지고, 레어도가 높을수록 칸이 빛난다. 장비 칸은 직업마다 나눠 볼 수 있다.',
  '대장간에 「합성」이 생겼다. 같은 레어도 · 같은 갈래(무기 · 부장비 · 방어구 · 장신구) 장비 9점을 넣으면 다음 레어도 장비 하나가 무작위로 나온다. 아주 드물게(1%) 두 단계 위가 나온다.',
  '스킬북은 이제 스킬북 단계로 나온다: 찢어진(공용) · 낡은(1차) · 빛바랜(2차) · 신비한(3차) 스킬북. 고대의 · 신화 속 스킬북은 4차 · 5차 직업이 생기면 나온다. 창고에서 펼치면 그 차수 스킬북 하나가 뽑힌다 — 스킬마다 뽑힐 확률이 다르다.',
  '2차 · 3차 고유 스킬도 이제 스킬북으로 배운다. 직업 기본 스킬은 전직할 때 그대로 받는다. 이미 배운 스킬과 가지고 있던 스킬북은 그대로다.',
  '메뉴는 오른쪽 위 「메뉴」 하나로 접었다. 누르면 메뉴판이 펼쳐진다. 표창은 한 통에 1.5배 더 담는다.'
];
