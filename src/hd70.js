/* ───────── 빌드 70 시험: 곡창지대 평원 리마스터 (11-18 18:42 사용자 「몬스터 · 1차 전사 리마스터 · 스킬까지도」 · 「우선 전사 1차만 적용시켜서 … 시험 아티팩트」) ─────────
   그림은 data-hd70.js(HD70_DATA — tools/saved/gpt70/hd70/export_hd70.py로 뽑는다, 손으로 고치지 말 것). 그림 판을 다 풀기 전에는 예전 그림.
   · 그림 몬스터 6종(들쥐 · 뿔토끼 · 들늑대 · 허수아비 · 멧돼지 · 갑옷 멧돼지): PXU 자리를 그대로 써서(fmot 동작 · 효과 · 크기 규칙) pxuSprite가 그림 장을 돌려준다.
     동작 'i_<id>_<줄>' — 장 시간 PXS_MOT_TT · 맞히는 장 PXS_MOT_HITF · 앞으로 나간 거리 dx(논리 픽셀) · 쏘는 자리 tip(닻에서 논리 픽셀)
   · 전사 1차(cls warrior): drawAdv가 리마스터 장을 그린다 — 동작 13가지 × 16장(서 있기 · 걷기 · 달리기 · 베기 · 올려베기 · 찌르기 · 방패 밀기 · 막기 · 맞음 · 쓰러짐 ·
     앉기 · 눕기 · 앞모습, 11-19 사용자 「전부 16장으로 … 기본배속에서도 잘 보이게」). 공격 동작은 엔진 동작(여덟 장)의 시간을 늘려(0.95초쯤) 16장을 다 보여 준다 (아래 HDW_MOT)
   · 점 굵기 (11-20 사용자 「40으로 하자」 — 옛 뭉툭 4픽셀과 빌드 71의 1.5픽셀 사이 값): 전사 · 몬스터 그림은 **한 칸 = 논리 1칸 = 화면 2픽셀**.
     전사 키 40칸(그림 자료 hs 1.5 — drawAdv가 늘 1.5배로 그린다) · 몬스터 hs 1 · 우두머리(2배로 그림)는 두 배 촘촘한 그림(자료의 big · hs 2 — art.js drawMon이 HD.big을 켠다) ·
     초상 · 썸네일은 hdBust(한 칸 = 2픽셀) · 영웅 창은 한 칸 2.4픽셀쯤(hero.js HERO.hdCell). 그림은 tools/saved/gpt70/mid70(extract_mid.py 40 · extract_mid_mon.py)에서 뽑는다. 풍경 겹은 아직 hs 2(한 칸 1픽셀)
   · 1차 스킬 그림 13개: hexURL이 육각 안쪽 34×40을 그린다 (hdSkiCells)
   · 넓은 평원(bg plains_hd): 뒷산 · 중경(언덕 · 농장 · 울타리) · 넓은 땅 · 도는 풍차 날개 — 땅이 화면 아래 40%,
     파티 · 몬스터가 앞뒤로 흩어져 선다 (view.js formSlots · foeSlots · zAt이 V.wide를 본다) */
function hd78Mot() {   // 빌드 78 허수아비 동작: 장 16 · 0.055초 · 맞히는 장 7 · 까마귀 · 등불은 어깨 위에서 날아간다
  const o = {}, z = () => Array(16).fill(0), add = (id, row, tip, hit) => { o['i_' + id + '_' + row] = { id, row, T: 0.055, hit: hit || 7, dx: z(), tip }; };
  for (const id of ['scare_a3', 'scare_b2']) add(id, 'crow1', [10, -52]);
  add('scare_a3', 'crows', [8, -56]); add('scare_b2', 'lantern', [16, -44]);
  add('scare_c4', 'sickle', null); add('scare_c4', 'crows', [8, -54]);
  for (const id of ['scare_c1', 'scare_c2']) { add(id, 'sickle', null); add(id, 'crows', [8, -54]); add(id, 'swarm', [6, -50], 8); }
  for (const k in o) if (!o[k].tip) delete o[k].tip;
  return o;
}
const HD = { mon: {}, war: null, cls: {}, sky: null, bg: null, spr: new Map(), tint: new WeakMap(), big: false };   // big: 지금 그리는 몬스터가 2배 우두머리 (art.js drawMon이 켰다 끈다)
const HD_EMPTY = (() => { if (typeof document === 'undefined') return null; const [cv] = mkCanvas(1, 1); return { cv, ax: 0, ay: 0, w: 1, h: 1, dx: 0, jy: 0, fo: [0, 0] }; })();
// 그림 몬스터 동작: 줄 · 장 시간 · 맞히는 장 · 앞으로 나간 거리(논리 픽셀, 장마다) · 쏘는 자리
const HD_MOT = {
  i_rat_bite:    { id: 'rat', row: 'bite', T: [0.06, 0.06, 0.07, 0.05, 0.06, 0.07, 0.06, 0.06], hit: 4, dx: [0, 0, 1, 3, 5, 4, 2, 0] },
  i_rat_leap:    { id: 'rat', row: 'leap', T: 0.05, hit: 7, dx: [0, 0, 0, 2, 5, 9, 13, 15, 14, 10, 5, 1] },
  i_rabbit_charge: { id: 'rabbit', row: 'charge', T: [0.05, 0.06, 0.06, 0.05, 0.06, 0.07, 0.06, 0.06], hit: 4, dx: [0, 1, 4, 9, 12, 10, 5, 1] },
  i_rabbit_jump: { id: 'rabbit', row: 'jump', T: 0.055, hit: 6, dx: [0, 0, 2, 6, 10, 13, 14, 11, 6, 2] },
  i_wolf_bite:   { id: 'wolf', row: 'bite', T: [0.06, 0.06, 0.07, 0.05, 0.07, 0.07, 0.06, 0.06], hit: 4, dx: [0, 0, 2, 4, 6, 5, 3, 1] },
  i_wolf_leap:   { id: 'wolf', row: 'leap', T: 0.055, hit: 6, dx: [0, 0, 1, 5, 10, 15, 17, 13, 7, 2] },
  i_scarecrow_crow1: { id: 'scarecrow', row: 'crow1', T: 0.07, hit: 3, tip: [12, -30] },   // 어깨 까마귀 발사
  i_scarecrow_crow2: { id: 'scarecrow', row: 'crow2', T: 0.07, hit: 3, tip: [2, -42] },    // 머리 까마귀 발사
  i_scarecrow_crow3: { id: 'scarecrow', row: 'crow3', T: 0.075, hit: 3, tip: [8, -34] },   // 남은 까마귀 발사
  i_boar_butt:   { id: 'boar', row: 'headbutt', T: [0.07, 0.07, 0.07, 0.06, 0.08, 0.08, 0.08], hit: 4, dx: [0, 0, 1, 4, 7, 5, 2] },
  i_boar_charge: { id: 'boar', row: 'charge', T: 0.055, hit: 5, dx: [0, 3, 8, 14, 20, 24, 18, 8] },
  i_aboar_butt:  { id: 'aboar', row: 'headbutt', T: [0.07, 0.07, 0.07, 0.06, 0.08, 0.08, 0.08, 0.08], hit: 4, dx: [0, 0, 1, 3, 6, 8, 5, 2] },
  i_aboar_charge: { id: 'aboar', row: 'charge', T: 0.06, hit: 5, dx: [0, 3, 8, 14, 20, 24, 18, 8] },
  i_aboar_horn:  { id: 'aboar', row: 'hornup', T: 0.08, hit: 3, dx: [0, 0, 1, 3, 2, 0] },
  // 깊은 숲 여덟 · 세계수 뿌리굴 넷 (빌드 72 · 11-20 23:51)
  i_ewisp_burst: { id: 'ewisp', row: 'burst', T: [0.06, 0.07, 0.08, 0.08, 0.07, 0.06, 0.07, 0.07, 0.06, 0.06], hit: 5, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], tip: [0, -14] },
  i_emoth_dust:  { id: 'emoth', row: 'dust', T: [0.06, 0.08, 0.09, 0.07, 0.06, 0.07, 0.08, 0.07, 0.06, 0.06], hit: 5, dx: [0, -1, -2, 0, 2, 3, 2, 1, 0, 0], tip: [22, -8] },
  i_eshroom_spore: { id: 'eshroom', row: 'spore', T: [0.06, 0.08, 0.09, 0.09, 0.08, 0.08, 0.09, 0.08, 0.07, 0.06], hit: 5, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], tip: [0, -46] },
  i_mlizard_tongue: { id: 'mlizard', row: 'tongue', T: [0.06, 0.07, 0.06, 0.05, 0.06, 0.07, 0.07, 0.06, 0.06, 0.06], hit: 4, dx: [0, -1, 1, 3, 4, 4, 3, 1, 0, 0] },
  i_rcenti_bite: { id: 'rcenti', row: 'bite', T: [0.06, 0.07, 0.08, 0.08, 0.05, 0.06, 0.07, 0.07, 0.07, 0.06, 0.06], hit: 5, dx: [0, 0, 0, 0, 3, 8, 10, 8, 4, 1, 0] },
  i_cstag_pinch: { id: 'cstag', row: 'pinch', T: [0.06, 0.07, 0.08, 0.08, 0.05, 0.06, 0.08, 0.07, 0.06, 0.06], hit: 5, dx: [0, -1, -2, -1, 6, 10, 10, 6, 2, 0] },
  i_sentinel_smash: { id: 'sentinel', row: 'smash', T: [0.07, 0.08, 0.1, 0.1, 0.06, 0.05, 0.09, 0.09, 0.08, 0.07], hit: 5, dx: [0, 0, 0, 1, 3, 6, 6, 4, 1, 0] },
  i_elddragon_bite: { id: 'elddragon', row: 'bite', T: [0.06, 0.08, 0.09, 0.09, 0.05, 0.06, 0.08, 0.08, 0.07, 0.06], hit: 5, dx: [0, 0, -1, -2, 6, 14, 10, 5, 2, 0] },
  i_elddragon_breath: { id: 'elddragon', row: 'breath', T: [0.07, 0.08, 0.09, 0.1, 0.1, 0.08, 0.12, 0.1], hit: 6, dx: [0, 0, 0, 0, 0, 1, 2, 1], tip: [52, -50] },
  i_elddragon_stomp: { id: 'elddragon', row: 'stomp', T: [0.06, 0.07, 0.08, 0.09, 0.1, 0.09, 0.05, 0.09, 0.08, 0.06], hit: 6, dx: [0, 0, 1, 2, 3, 4, 5, 4, 2, 0] },
  i_elddragon_death: { id: 'elddragon', row: 'death', T: 0.08, hit: 9, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  i_smandrake_scream: { id: 'smandrake', row: 'scream', T: [0.06, 0.08, 0.09, 0.07, 0.06, 0.1, 0.09, 0.08, 0.07, 0.06], hit: 4, dx: [0, 0, -1, 1, 2, 2, 1, 0, 0, 0], tip: [12, -22] },
  i_fdryad_whip: { id: 'fdryad', row: 'whip', T: [0.06, 0.07, 0.08, 0.08, 0.05, 0.06, 0.07, 0.07, 0.07, 0.06, 0.06], hit: 5, dx: [0, 0, 0, 1, 3, 5, 6, 4, 2, 1, 0] },
  i_fairies_stab: { id: 'fairies', row: 'stab', T: [0.06, 0.07, 0.07, 0.05, 0.05, 0.05, 0.06, 0.07, 0.07, 0.06, 0.06], hit: 5, dx: [0, -1, -2, 3, 9, 14, 14, 9, 4, 1, 0] },
  i_rahen_slam:  { id: 'rahen', row: 'slam', T: [0.07, 0.08, 0.08, 0.09, 0.1, 0.05, 0.06, 0.09, 0.08, 0.07, 0.06], hit: 6, dx: [0, 0, 0, 0, 0, 3, 5, 5, 3, 1, 0] },
  i_rahen_cast:  { id: 'rahen', row: 'cast', T: [0.07, 0.08, 0.09, 0.09, 0.09, 0.09, 0.08, 0.07, 0.12], hit: 8, dx: [0, 0, 0, 0, 0, 0, 0, 1, 2], tip: [38, -44] },
  i_rahen_roots: { id: 'rahen', row: 'roots', T: [0.07, 0.08, 0.08, 0.09, 0.1, 0.12, 0.1, 0.08, 0.07, 0.06], hit: 5, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  i_rahen_death: { id: 'rahen', row: 'death', T: 0.09, hit: 9, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  // 원시림 일곱 (빌드 72 · 11-20 17:34)
  i_vinesnake_bite: { id: 'vinesnake', row: 'bite', T: [0.06, 0.07, 0.07, 0.05, 0.06, 0.08, 0.07, 0.06, 0.06, 0.06], hit: 4, dx: [0, 0, 0, 2, 5, 6, 2, 0, 0, 0] },
  i_cflower_bite: { id: 'cflower', row: 'bite', T: [0.06, 0.07, 0.07, 0.08, 0.08, 0.05, 0.07, 0.08, 0.07, 0.06], hit: 6, dx: [0, 0, 0, 0, 1, 4, 7, 5, 2, 0] },
  i_stump_bite:  { id: 'stump', row: 'bite', T: [0.06, 0.07, 0.07, 0.08, 0.09, 0.05, 0.07, 0.08, 0.07, 0.06], hit: 6, dx: [0, 0, 1, 2, 4, 6, 8, 6, 2, 0] },
  i_spotshroom_spore: { id: 'spotshroom', row: 'spore', T: [0.06, 0.08, 0.08, 0.08, 0.08, 0.09, 0.09, 0.08, 0.07, 0.06], hit: 5, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], tip: [0, -44] },   // 머리 위 포자 구름에서 날아간다
  i_ibeetle_charge: { id: 'ibeetle', row: 'charge', T: [0.06, 0.08, 0.08, 0.07, 0.06, 0.06, 0.07, 0.08, 0.07, 0.06], hit: 6, dx: [0, -1, -2, 0, 6, 12, 16, 12, 5, 0] },
  i_mgolem_smash: { id: 'mgolem', row: 'smash', T: [0.07, 0.08, 0.09, 0.1, 0.1, 0.05, 0.08, 0.1, 0.08, 0.07], hit: 6, dx: [0, 0, 0, 1, 2, 5, 7, 6, 2, 0] },
  i_fguard_charge: { id: 'fguard', row: 'charge', T: [0.06, 0.08, 0.09, 0.07, 0.06, 0.06, 0.07, 0.08, 0.07, 0.06], hit: 6, dx: [0, -1, -2, 2, 8, 16, 22, 14, 5, 0] },
  i_fguard_bell: { id: 'fguard', row: 'bell', T: [0.07, 0.08, 0.09, 0.1, 0.1, 0.1, 0.08, 0.07, 0.07, 0.06], hit: 4, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  i_fguard_stomp: { id: 'fguard', row: 'stomp', T: [0.06, 0.07, 0.08, 0.09, 0.1, 0.09, 0.05, 0.09, 0.08, 0.06], hit: 6, dx: [0, 0, 1, 2, 3, 4, 5, 4, 2, 0] },
  i_fguard_death: { id: 'fguard', row: 'death', T: 0.08, hit: 9, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },   // 쓰러질 때 (view.js 쓰러지는 적 — HD_DEATH)
  // 원시림 고블린 셋 (빌드 72 · 11-20)
  i_gobclub_smash: { id: 'gobclub', row: 'smash', T: [0.07, 0.08, 0.08, 0.09, 0.05, 0.07, 0.09, 0.07, 0.07], hit: 4, dx: [0, 0, 1, 3, 6, 6, 5, 2, 0] },
  i_goblin_slash: { id: 'goblin', row: 'slash', T: [0.06, 0.07, 0.06, 0.07, 0.07, 0.05, 0.07, 0.07, 0.06, 0.06], hit: 5, dx: [0, 0, 0, 2, 4, 7, 7, 5, 2, 0] },
  i_goblin_thrust: { id: 'goblin', row: 'thrust', T: [0.06, 0.07, 0.06, 0.06, 0.06, 0.05, 0.08, 0.07, 0.06, 0.06], hit: 5, dx: [0, 0, 1, 3, 6, 10, 10, 6, 2, 0] },
  i_gobarcher_shot: { id: 'gobarcher', row: 'shot', T: [0.06, 0.07, 0.07, 0.08, 0.09, 0.09, 0.05, 0.07, 0.07, 0.06], hit: 6, dx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], tip: [22, -21] },   // 화살은 게임이 그린다 (판의 날아가는 화살은 지웠다)
  // 빌드 78: 허수아비 다섯 (픽셀랩 동작 32장 → 16장 · data-pxl78.js) — 8번째 장에서 맞힌다
  ...hd78Mot()
};
const HD_IDLE_FPS = { scare_a3: 8, scare_b2: 8, scare_c4: 8, scare_c1: 8, scare_c2: 8, rat: 7, rabbit: 7, wolf: 7, scarecrow: 6, boar: 6, aboar: 6, gobclub: 7, goblin: 7, gobarcher: 7, ewisp: 8, emoth: 8, eshroom: 6, mlizard: 6, rcenti: 7, cstag: 6, sentinel: 6, elddragon: 6, smandrake: 7, fdryad: 6, fairies: 9, rahen: 6, vinesnake: 7, cflower: 7, stump: 7, spotshroom: 7, ibeetle: 6, mgolem: 6, fguard: 6 };
const HD_DEATH = { fguard: 'i_fguard_death', elddragon: 'i_elddragon_death', rahen: 'i_rahen_death' };
const HD_LIFT = { ewisp: 5, emoth: 5, fairies: 6 };   // 떠 있는 몬스터: 몸을 이만큼 띄운다 (뭉툭 칸 — 그림자는 땅에)   // 쓰러지는 그림이 따로 있는 몬스터 (넘어뜨려 돌리지 않고 이 줄을 돌린다)
const HD_WALK = { gobclub: [3, 4, 5, 6], goblin: [3, 4, 5, 6], gobarcher: [3, 4, 5, 6] };   // 걷기 줄에서 도는 장 (고블린 달리기 줄은 서기 → 달리기 → 서기라서 가운데 넉 장만)
for (const k in HD_MOT) {   // 장 시간 · 맞히는 장을 동작 표에 (fmotOn · pxuMotT · fmotTip이 본다)
  const M = HD_MOT[k], n = (M.dx || []).length || 8;
  PXS_MOT_TT[k] = Array.isArray(M.T) ? M.T : Array.from({ length: n }, () => M.T);
  PXS_MOT_HITF[k] = M.hit;
}
Object.assign(PXU_CAST, { i_scare_a3_crow1: 1, i_scare_a3_crows: 1, i_scare_b2_crow1: 1, i_scare_b2_lantern: 1, i_scare_c4_crows: 1, i_scare_c1_crows: 1, i_scare_c1_swarm: 1, i_scare_c2_crows: 1, i_scare_c2_swarm: 1, i_scarecrow_crow1: 1, i_scarecrow_crow2: 1, i_scarecrow_crow3: 1, i_gobarcher_shot: 1, i_spotshroom_spore: 1, i_ewisp_burst: 1, i_emoth_dust: 1, i_eshroom_spore: 1, i_smandrake_scream: 1, i_elddragon_breath: 1, i_rahen_cast: 1 });   // 까마귀를 날려 보낸다 (fmot.js FMOT_CAST)
// 새 몬스터 셋은 그림만 있다 (PXU 자리 · 크기 규칙만 빌린다) — 들쥐 · 뿔토끼 · 들늑대는 예전 PXU 그림이 그림 판을 풀기 전까지 그대로 나온다
for (const id of ['scare_a3', 'scare_b2', 'scare_c4', 'scare_c1', 'scare_c2', 'scarecrow', 'boar', 'aboar', 'gobclub', 'gobarcher', 'vinesnake', 'cflower', 'stump', 'spotshroom', 'ibeetle', 'mgolem', 'fguard', 'ewisp', 'emoth', 'eshroom', 'mlizard', 'rcenti', 'cstag', 'sentinel', 'elddragon', 'smandrake', 'fdryad', 'fairies', 'rahen']) PXU[id] = { img: 1, g: 'C', ax: 0, pal: {} };
for (const id of ['rat', 'rabbit', 'wolf', 'goblin']) PXU[id].img = 1;
// 동작 갈래: hd = 그림 판이 있을 때 · 없으면 예전 갈래 (새 몬스터는 같은 것)
const HD_ACT = {
  rat:       { atk: ['i_rat_bite', 'i_rat_leap'], skl: ['i_rat_leap'] },
  rabbit:    { atk: ['i_rabbit_charge', 'i_rabbit_jump'], skl: ['i_rabbit_jump'] },
  wolf:      { atk: ['i_wolf_bite', 'i_wolf_leap'], skl: ['i_wolf_leap'] },
  scarecrow: { atk: ['i_scarecrow_crow1', 'i_scarecrow_crow2'], skl: ['i_scarecrow_crow3'] },
  scare_a3: { atk: ['i_scare_a3_crow1'], skl: ['i_scare_a3_crows'] },
  scare_b2: { atk: ['i_scare_b2_crow1'], mag: ['i_scare_b2_lantern'], skl: ['i_scare_b2_lantern'] },
  scare_c4: { atk: ['i_scare_c4_sickle'], skl: ['i_scare_c4_crows'] },
  scare_c1: { atk: ['i_scare_c1_sickle'], skl: ['i_scare_c1_crows', 'i_scare_c1_swarm'] },
  scare_c2: { atk: ['i_scare_c2_sickle'], skl: ['i_scare_c2_crows', 'i_scare_c2_swarm'] },
  boar:      { atk: ['i_boar_butt'], skl: ['i_boar_charge'] },
  aboar:     { atk: ['i_aboar_butt'], skl: ['i_aboar_charge', 'i_aboar_horn'] },
  gobclub:   { atk: ['i_gobclub_smash'], skl: ['i_gobclub_smash'] },
  ewisp: { atk: ['i_ewisp_burst'], mag: ['i_ewisp_burst'], skl: ['i_ewisp_burst'] }, emoth: { atk: ['i_emoth_dust'], mag: ['i_emoth_dust'], skl: ['i_emoth_dust'] }, eshroom: { atk: ['i_eshroom_spore'], mag: ['i_eshroom_spore'], skl: ['i_eshroom_spore'] },
  mlizard: { atk: ['i_mlizard_tongue'], skl: ['i_mlizard_tongue'] }, rcenti: { atk: ['i_rcenti_bite'], skl: ['i_rcenti_bite'] }, cstag: { atk: ['i_cstag_pinch'], skl: ['i_cstag_pinch'] }, sentinel: { atk: ['i_sentinel_smash'], skl: ['i_sentinel_smash'] },
  elddragon: { atk: ['i_elddragon_bite'], mag: ['i_elddragon_breath'], skl: ['i_elddragon_breath', 'i_elddragon_stomp'] },
  smandrake: { atk: ['i_smandrake_scream'], mag: ['i_smandrake_scream'], skl: ['i_smandrake_scream'] }, fdryad: { atk: ['i_fdryad_whip'], skl: ['i_fdryad_whip'] }, fairies: { atk: ['i_fairies_stab'], skl: ['i_fairies_stab'] },
  rahen: { atk: ['i_rahen_slam'], mag: ['i_rahen_cast'], skl: ['i_rahen_cast', 'i_rahen_roots'] },
  vinesnake: { atk: ['i_vinesnake_bite'], skl: ['i_vinesnake_bite'] },
  cflower:   { atk: ['i_cflower_bite'], skl: ['i_cflower_bite'] },
  stump:     { atk: ['i_stump_bite'], skl: ['i_stump_bite'] },
  spotshroom: { atk: ['i_spotshroom_spore'], mag: ['i_spotshroom_spore'], skl: ['i_spotshroom_spore'] },
  ibeetle:   { atk: ['i_ibeetle_charge'], skl: ['i_ibeetle_charge'] },
  mgolem:    { atk: ['i_mgolem_smash'], skl: ['i_mgolem_smash'] },
  fguard:    { atk: ['i_fguard_charge'], skl: ['i_fguard_bell', 'i_fguard_stomp'] },
  goblin:    { atk: ['i_goblin_slash', 'i_goblin_thrust'], skl: ['i_goblin_thrust'] },
  gobarcher: { atk: ['i_gobarcher_shot'], skl: ['i_gobarcher_shot'] }
};
Object.assign(PXU_ACT, {
  scare_a3: Object.assign({ fx: { atk: { pal: 'shadow', hit: 'claw', p: 'dart' }, skl: { pal: 'shadow', hit: 'claw', p: 'dart', big: 1, after: 'feathers', aoe: 'feathers' } } }, HD_ACT.scare_a3),
  scare_b2: Object.assign({ fx: { atk: { pal: 'shadow', hit: 'claw', p: 'dart' }, mag: { pal: 'fire', hit: 'burst', p: 'orb' }, skl: { pal: 'fire', hit: 'burst', p: 'orb', big: 1, after: 'embers' } } }, HD_ACT.scare_b2),
  scare_c4: Object.assign({ fx: { atk: { pal: 'shadow', hit: 'slashes' }, skl: { pal: 'shadow', hit: 'claw', p: 'dart', big: 1, after: 'feathers', aoe: 'feathers' } } }, HD_ACT.scare_c4),
  scare_c1: Object.assign({ tk: 1.05, fx: { atk: { pal: 'shadow', hit: 'slashes' }, skl: { pal: 'shadow', hit: 'claw', p: 'dart', big: 1, after: 'feathers', aoe: 'feathers', shake: 1 } } }, HD_ACT.scare_c1),
  scare_c2: Object.assign({ tk: 1.05, fx: { atk: { pal: 'water', hit: 'slashes' }, skl: { pal: 'evil', hit: 'claw', p: 'dart', big: 1, after: 'feathers', aoe: 'feathers', shake: 2 } } }, HD_ACT.scare_c2),
  scarecrow: Object.assign({ fx: { atk: { pal: 'shadow', hit: 'claw', p: 'dart' }, skl: { pal: 'shadow', hit: 'claw', p: 'dart', big: 1, after: 'feathers', aoe: 'feathers' } } }, HD_ACT.scarecrow),
  boar:      Object.assign({ tk: 1, fx: { atk: { pal: 'earth', hit: 'star', after: 'dust' }, skl: { pal: 'earth', hit: 'star', big: 1, after: 'dust' } } }, HD_ACT.boar),
  aboar:     Object.assign({ tk: 1.05, fx: { atk: { pal: 'steel', hit: 'star', after: 'dust' }, skl: { pal: 'war', hit: 'pierce', big: 1, after: 'dust' } } }, HD_ACT.aboar),
  vinesnake: Object.assign({ fx: { atk: { pal: 'poison', hit: 'bite' }, skl: { pal: 'poison', hit: 'poison', big: 1, after: 'bubbles' } } }, HD_ACT.vinesnake),
  cflower:   Object.assign({ fx: { atk: { pal: 'nature', hit: 'bite' }, skl: { pal: 'evil', hit: 'bite', big: 1, after: 'drain' } } }, HD_ACT.cflower),
  stump:     Object.assign({ tk: 1.05, fx: { atk: { pal: 'earth', hit: 'bite' }, skl: { pal: 'earth', hit: 'bite', big: 1, after: 'dust' } } }, HD_ACT.stump),
  spotshroom: Object.assign({ fx: { atk: { pal: 'poison', hit: 'poison', p: 'orb' }, mag: { pal: 'poison', hit: 'poison', p: 'orb' }, skl: { pal: 'poison', hit: 'poison', p: 'orb', big: 1, after: 'bubbles' } } }, HD_ACT.spotshroom),
  ibeetle:   Object.assign({ tk: 1.05, fx: { atk: { pal: 'steel', hit: 'star', after: 'dust' }, skl: { pal: 'steel', hit: 'pierce', big: 1, after: 'dust' } } }, HD_ACT.ibeetle),
  mgolem:    Object.assign({ tk: 1.1, fx: { atk: { pal: 'earth', hit: 'star', after: 'dust' }, skl: { pal: 'earth', hit: 'quake', big: 1, after: 'dust', aoe: 'roots', shake: 2 } } }, HD_ACT.mgolem),
  fguard:    Object.assign({ tk: 1.05, fx: { atk: { pal: 'nature', hit: 'star', after: 'dust' }, skl: { pal: 'nature', hit: 'star', big: 1, after: 'petals', aoe: 'roots', shake: 2 } } }, HD_ACT.fguard),
  ewisp:     Object.assign({ fx: { atk: { pal: 'water', hit: 'flash', p: 'orb' }, mag: { pal: 'water', hit: 'flash', p: 'orb' }, skl: { pal: 'water', hit: 'burst', p: 'orb', big: 1 } } }, HD_ACT.ewisp),
  emoth:     Object.assign({ fx: { atk: { pal: 'water', hit: 'flash', p: 'orb' }, mag: { pal: 'water', hit: 'flash', p: 'orb' }, skl: { pal: 'water', hit: 'flash', p: 'orb', big: 1, after: 'motes' } } }, HD_ACT.emoth),
  eshroom:   Object.assign({ fx: { atk: { pal: 'water', hit: 'poison', p: 'orb' }, mag: { pal: 'water', hit: 'poison', p: 'orb' }, skl: { pal: 'nature', hit: 'poison', p: 'orb', big: 1, after: 'bubbles' } } }, HD_ACT.eshroom),
  mlizard:   Object.assign({ fx: { atk: { pal: 'nature', hit: 'star' }, skl: { pal: 'nature', hit: 'star', big: 1 } } }, HD_ACT.mlizard),
  rcenti:    Object.assign({ fx: { atk: { pal: 'poison', hit: 'bite' }, skl: { pal: 'poison', hit: 'poison', big: 1, after: 'bubbles' } } }, HD_ACT.rcenti),
  cstag:     Object.assign({ tk: 1.05, fx: { atk: { pal: 'water', hit: 'star', after: 'shards' }, skl: { pal: 'water', hit: 'pierce', big: 1, after: 'shards' } } }, HD_ACT.cstag),
  sentinel:  Object.assign({ tk: 1.1, fx: { atk: { pal: 'earth', hit: 'star', after: 'dust' }, skl: { pal: 'earth', hit: 'quake', big: 1, after: 'dust', aoe: 'roots', shake: 2 } } }, HD_ACT.sentinel),
  elddragon: Object.assign({ tk: 1.05, fx: { atk: { pal: 'nature', hit: 'bite', after: 'dust' }, mag: { pal: 'water', hit: 'burst', p: 'beam', big: 1 }, skl: { pal: 'water', hit: 'burst', big: 1, after: 'motes', aoe: 'roots', shake: 2 }, i_elddragon_breath: { pal: 'water', hit: 'burst', p: 'beam', big: 1, after: 'motes' } } }, HD_ACT.elddragon),
  smandrake: Object.assign({ fx: { atk: { pal: 'music', hit: 'notes', p: 'note' }, mag: { pal: 'music', hit: 'notes', p: 'note' }, skl: { pal: 'music', hit: 'stun', p: 'note', big: 1, shake: 1 } } }, HD_ACT.smandrake),
  fdryad:    Object.assign({ fx: { atk: { pal: 'nature', hit: 'slashes' }, skl: { pal: 'evil', hit: 'slashes', big: 1, after: 'drain' } } }, HD_ACT.fdryad),
  fairies:   Object.assign({ tk: 0.95, fx: { atk: { pal: 'evil', hit: 'pierce' }, skl: { pal: 'evil', hit: 'pierce', big: 1 } } }, HD_ACT.fairies),
  rahen:     Object.assign({ tk: 1.05, fx: { atk: { pal: 'earth', hit: 'quake', after: 'dust' }, mag: { pal: 'poison', hit: 'burst', p: 'orb', big: 1 }, skl: { pal: 'poison', hit: 'burst', big: 1, after: 'bubbles', aoe: 'roots', shake: 2 }, i_rahen_cast: { pal: 'poison', hit: 'burst', p: 'orb', big: 1, after: 'bubbles' } } }, HD_ACT.rahen),
  gobclub:   Object.assign({ tk: 1, fx: { atk: { pal: 'earth', hit: 'star', after: 'dust' }, skl: { pal: 'power', hit: 'star', big: 1, after: 'dust', shake: 2 } } }, HD_ACT.gobclub),
  gobarcher: Object.assign({ fx: { atk: { pal: 'steel', hit: 'star', p: 'arrow' }, skl: { pal: 'blood', hit: 'pierce', p: 'arrow', big: 1 } } }, HD_ACT.gobarcher)
});
for (const id in HD_ACT) PXU_ACT[id].hd = HD_ACT[id];
const hdAct = id => { const A = PXU_ACT[id]; return A && A.hd && HD.mon[id] ? A.hd : A; };   // pxund.js pxuPick이 부른다

// ── 그림 판 풀기 (data URL → 장마다 캔버스) ──
const HD_LD_UP = 24;   // 넓은 맵 (11-22): 한 줄 때 내려 둔 풍경을 이만큼 다시 올려 땅을 넓게 (발 줄 150 ~ 196)
function hdCut(im, w, h, rows, n) { const out = {}; rows.forEach((r, ri) => { out[r] = []; for (let i = 0; i < n[ri]; i++) { const [cv, x] = mkCanvas(w, h); x.drawImage(im, i * w, ri * h, w, h, 0, 0, w, h); out[r].push(cv); } }); return out; }
function hdBox(cv) {   // 그림이 있는 칸의 테두리 [x0, x1, y0]
  let x0 = cv.width, x1 = -1, y0 = cv.height;
  try { const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; } } catch (_) { return null; }
  return x1 < 0 ? null : [x0, x1 + 1, y0];
}
function hdFeetX(cv, m) {   // 맨 아래 여섯 줄의 가운데 (닻에서, 그림 칸) — 내딛는 동작에서 그림자가 몸을 따라간다
  const y0 = Math.max(0, m.ay - Math.max(3, Math.round(3 * (m.hs || 1)))); let x0 = cv.width, x1 = -1;   // 줄 수는 그림 해상도만큼 (hs 2 = 6줄 · hs 1.5 = 5줄)
  try { const d = cv.getContext('2d').getImageData(0, y0, cv.width, Math.min(cv.height, m.ay + 1) - y0), h = d.height; for (let y = 0; y < h; y++) for (let x = 0; x < cv.width; x++) if (d.data[(y * cv.width + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; } } catch (_) { return 0; }
  return x1 < 0 ? 0 : (x0 + x1 + 1) / 2 - m.ax;
}
function hdRing(cv) {   // 칸 둘레 한 겹 (네 쪽으로 한 칸씩 민 것 − 제자리)
  const [c, x] = mkCanvas(cv.width, cv.height);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) x.drawImage(cv, dx, dy);
  x.globalCompositeOperation = 'destination-out'; x.drawImage(cv, 0, 0); return c;
}
function hdLoad() {
  if (typeof Image === 'undefined' || typeof HD70_DATA === 'undefined') return;
  const D = HD70_DATA, img = (url, fn) => { const im = new Image(); im.onload = () => fn(im); im.src = url; };
  const MON = Object.assign({}, D.mon, typeof PXL78_DATA !== 'undefined' ? PXL78_DATA.mon : {});   // 빌드 78: 픽셀랩 허수아비 다섯
  for (const id in MON) {
    const m = MON[id];
    img(m.url, im => {
      const f = hdCut(im, m.w, m.h, m.rows, m.n), b = hdBox(f[m.rows[0]][0]);
      const q = m.hs || 1; HD.mon[id] = { m, f, bb: b ? [(b[0] - m.ax) / q, (b[1] - m.ax) / q, (m.ay - b[2]) / q] : [-10, 10, 20] };   // 닻에서 뒤 끝 · 앞 끝 · 키
      HD.spr.clear(); if (typeof MON_DIM !== 'undefined') delete MON_DIM[id]; if (typeof MON_BACK !== 'undefined') delete MON_BACK[id];
      if (m.big) img(m.big.url, im2 => { const H = HD.mon[id]; H.m2 = Object.assign({ rows: m.rows, n: m.n }, m.big); H.f2 = hdCut(im2, m.big.w, m.big.h, m.rows, m.n); HD.spr.clear(); });   // 우두머리용 두 배 촘촘한 그림 (없으면 작은 그림을 2배로)
    });
  }
  const loadCls = (cls, W) => {   // 직업 하나: 동작 줄을 다 풀어야 켠다 (그 전에는 예전 그림)
    const WR = {}; let wl = Object.keys(W.rows).length;
    const wdone = () => { if (--wl) return; HD.cls[cls] = WR; if (cls === 'warrior') HD.war = WR; HD.spr.clear(); };
    for (const rn in W.rows) {
      const m = W.rows[rn]; if (m.blade) wl++;
      img(m.url, im => { const f = hdCut(im, m.w, m.h, [rn], [m.n])[rn]; WR[rn] = Object.assign(WR[rn] || {}, { m, f, sx: f.map(cv => hdFeetX(cv, m)), bl: m.bl || null }); wdone(); });
      if (m.blade) img(m.blade, im => { const bm = hdCut(im, m.w, m.h, [rn], [m.n])[rn]; WR[rn] = Object.assign(WR[rn] || {}, { bm, br: bm.map(hdRing) }); wdone(); });   // 칼날 칸 · 그 둘레 (스킬 빛)
    }
  };
  loadCls('warrior', D.war);
  for (const c in D.adv || {}) loadCls(c, D.adv[c]);   // 그 밖의 직업 (마법사 1차 — 11-20)
  if (D.sky) { const K = { moon: null, clouds: [] }; let n = D.sky.clouds.length + 1; const done = () => { if (!--n) HD.sky = K; }; img(D.sky.moon, im => { K.moon = im; done(); }); D.sky.clouds.forEach((u, i) => img(u, im => { const [cv, x] = mkCanvas(im.width, im.height); x.drawImage(im, 0, 0); K.clouds[i] = cv; done(); })); }
  HD.bgs = HD.bgs || {};   // 빌드 72: 풍경 여럿 (평원 · 원시림 …) — 겹 그림을 다 풀면 그 풍경을 다시 짓는다
  for (const id in D.bg) { const B = D.bg[id], L = {}, ks = ['back', 'mid', 'gr', 'blades'].filter(k => B[k]); let left = ks.length;
    for (const k of ks) img(B[k].url, im => { L[k] = im; if (--left) return; HD.bgs[id] = L; if (id === 'plains') HD.bg = L; if (typeof BG !== 'undefined') delete BG[id + '_hd']; }); }
}
// FLASH(맞으면 흰 번쩍 · 희귀종 금빛 · 스킬 잔상): 같은 모양을 한 색으로
function hdTint(cv, col) {
  let T = HD.tint.get(cv); if (!T) HD.tint.set(cv, T = {});
  if (T[col]) return T[col];
  const [c, x] = mkCanvas(cv.width, cv.height); x.drawImage(cv, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, cv.width, cv.height);
  return (T[col] = c);
}

// ── 그림 몬스터 ──
const hdMon = id => HD.mon[id] || null;
const hdIdleN = id => { const H = HD.mon[id]; return H ? H.f[H.m.rows[0]].length : 2; };
const hdMonBase = id => { const H = HD.mon[id]; return H ? [H.bb[1] - H.bb[0], H.bb[2]] : null; };   // art.js monBase (너비 · 키)
function hdMonSpr(id, mk, f) {   // pxund.js pxuSprite가 부른다 (그림 판이 없으면 null)
  const H = HD.mon[id];
  if (!H) return PXU[id] && PXU[id].g === 'C' ? HD_EMPTY : null;
  const B = HD.big && H.f2 ? 1 : 0, F = B ? H.f2 : H.f;   // B: 2배 우두머리 그림 (같은 줄 · 같은 장 수, hs만 다르다)
  const M = HD_MOT[mk] && HD_MOT[mk].id === id ? HD_MOT[mk] : null, row = M ? M.row : mk === 'walk' && F.walk ? 'walk' : H.m.rows[0], L = F[row];
  const WK = !M && row === 'walk' && HD_WALK[id], i = M ? Math.max(0, Math.min(L.length - 1, f)) : WK ? WK[((f % WK.length) + WK.length) % WK.length] : ((f % L.length) + L.length) % L.length, key = id + '|' + (M ? mk : row) + '|' + i + '|' + (FLASH || '') + (B ? '|B' : '');
  let s = HD.spr.get(key); if (s) return s;
  const m = B ? H.m2 : H.m, cv = FLASH ? hdTint(L[i], FLASH) : L[i];
  const q = m.hs || 1, lx = m.ax / q, ly = m.ay / q;
  s = { cv, hs: q, ax: m.ax, ay: m.ay, w: m.w, h: m.h, dx: M && M.dx ? (M.dx[i] || 0) / 2 : 0, jy: -(HD_LIFT[id] || 0), fo: [lx, ly], tip: M && M.tip ? [(lx + M.tip[0] - 1) / 2, (ly + M.tip[1] - 1) / 2] : [(lx + H.bb[1] - 2) / 2, (ly - H.bb[2] * 0.6) / 2] };
  HD.spr.set(key, s); if (HD.spr.size > 900) HD.spr.delete(HD.spr.keys().next().value);
  return s;
}

// ── 전사 1차: 동작 13가지 × 16장 (tools/saved/gpt70/hd70/extract_war16.py — 판 차례 그대로 한 줄씩) ──
// 리마스터 그림이 있는 직업(전사 1차 · 마법사 1차). 직업마다 줄 표가 달라서, 그리기 전에 hdUse(a)로 「지금 직업」(HD.war · HDC)을 바꿔 끼운다
// 11-22 04:43 사용자 「GPT한테 받은 모험가 말고 너랑 나랑 만든 모험가 디자인으로 다시 다 바꾸고」: 길드원은 다시 엔진의 뭉툭 도트(pxa.js · pxs*.js — 장비 겉모습 · 무기별 동작이 살아난다). 받은 판 그림은 HD_ADV_ON을 켜면 돌아온다 (자료는 그대로 둠)
const HD_ADV_ON = false;
const hdWarOn = a => !!(HD_ADV_ON && a && HD.cls[a.cls] && HDCFG[a.cls]);
let HDC = null;
const hdUse = a => { const c = a && HD.cls[a.cls] ? a.cls : 'warrior'; HD.war = HD.cls[c] || null; HDC = HDCFG[c]; return !!HD.war; };
const hdRange = (a, b) => Array.from({ length: Math.abs(b - a) + 1 }, (_, i) => a + (b > a ? i : -i));
const HDW_PING = [...hdRange(0, 7), ...hdRange(6, 1), ...hdRange(8, 15), ...hdRange(14, 9)];   // 앞 판을 갔다 오고 → 뒤 판을 갔다 온다 (두 판의 첫 장이 같은 자세라 숨이 튀지 않는다)
// 그림 동작 = 줄 + 장 차례 (판 차례 0 ~ 15 그대로가 아닌 것만)
const HDW_SEQ = {
  idle: ['idle', HDW_PING], front: ['front', HDW_PING],
  sit: ['sit', [...hdRange(0, 7), ...hdRange(6, 1)]],              // 한 판 8장을 갔다 온다 (두 판의 그림이 달라 하나만 쓴다)
  guard: ['guard', [...hdRange(0, 7), ...hdRange(15, 8)]],         // 방패를 올리며 웅크림(앞 판) → 방패를 내리며 일어섬(뒤 판 거꾸로)
  raise: ['upper', [...hdRange(15, 8), 7, ...hdRange(8, 15)]]      // 칼 치켜들기(함성 · 강화 · 도발): 올려베기의 칼 내리는 장을 거꾸로 올렸다가 내린다
};
const hdwRow = k => HDC.seq[k] || [k, null];
const hdwLen = k => { const [rn, seq] = hdwRow(k); return seq ? seq.length : HD.war[rn].f.length; };
const HDW_SHADOW = { slash: 1, upper: 1, thrust: 1, bash: 1, hurt: 1, death: 1 };   // 몸이 닻에서 나가는 줄: 그림자가 발을 따라간다
function hdwSpr(k, i, fl) {   // 그림 동작 k의 i번째 장 (fl: 한 색으로 — 흰 번쩍 · 스킬 잔상)
  const [rn, seq] = hdwRow(k), Q = HD.war[rn], n = seq ? seq.length : Q.f.length, q = ((i % n) + n) % n, j = seq ? seq[q] : q, ck = HDC.id + '|' + rn + '|' + j + '|' + (fl || '');
  let s = HD.spr.get(ck);
  if (!s) { const m = Q.m; s = { cv: fl ? hdTint(Q.f[j], fl) : Q.f[j], hs: m.hs, ax: m.ax, ay: m.ay, w: m.w, h: m.h, sx: HDC.shadow[rn] ? Q.sx[j] : 0 }; HD.spr.set(ck, s); if (HD.spr.size > 900) HD.spr.delete(HD.spr.keys().next().value); }
  return s;
}
const hdFront = (t, a) => (hdUse(a) ? hdwSpr('front', t == null ? 0 : Math.floor(t * HDW_FPS.front)) : null);   // hero.js 영웅 창 · 초상 (앞모습)
// 초상 · 썸네일: 앞모습을 그림 한 칸 = px 픽셀로 (머리 위를 칸 위쪽에 맞추고, 키가 칸보다 크면 발 쪽이 잘린다)
function hdBust(x, W, H, px, a) { const s = hdFront(null, a), k = px * s.hs; x.save(); x.translate(Math.floor(W / 2), Math.max(H - 2, Math.round(s.ay * px) + 1)); x.scale(k, k); pxBlit(x, s); x.restore(); }
/* 엔진 동작(pxs.js 여덟 장) → 그림 동작. 엔진 동작의 장마다 초를 이 표로 바꿔(view.js motTA → hdMotT) 16장이 기본 배속에서 다 보이게 한다.
   H: 차례 안에서 맞히는(막는) 장 — 엔진의 맞히는 장(pxsMotHit) 앞 장들은 0 ~ H-1, 뒤 장들은 H ~ 끝에 고르게 나눈다(모으는 장을 붙잡으면 그 자세에서 멈춘다)
   time: 맞히는 때가 없는 동작(강화 · 함성 · 방패 세우기) — 걸리는 시간에 고르게 */
const HDW_MOT = {
  slash:  { H: 6, T: [0.09, 0.09, 0.12, 0.09, 0.16, 0.14, 0.13, 0.13] },   // 0 ~ 2 당김 · 3 ~ 4 칼을 치켜듦 · 5 내려침 · 6 맞힘 · 7 ~ 10 낮게 버팀 · 11 ~ 15 일어섬
  upper:  { H: 6, T: [0.09, 0.09, 0.12, 0.09, 0.16, 0.14, 0.13, 0.13] },   // 1 ~ 4 낮게 웅크림 · 5 올려침 · 6 맞힘 · 7 ~ 9 칼이 머리 위 · 10 ~ 15 내림
  thrust: { H: 6, T: [0.09, 0.09, 0.12, 0.08, 0.18, 0.15, 0.12, 0.12] },   // 2 ~ 4 당김 · 5 내지름 · 6 맞힘 · 7 ~ 10 뻗은 채 · 11 ~ 15 거둠
  bash:   { H: 6, T: [0.09, 0.09, 0.12, 0.09, 0.17, 0.14, 0.13, 0.13] },   // 1 ~ 4 방패 뒤로 웅크림 · 5 밀기 시작 · 6 맞힘 · 7 ~ 9 뻗은 채 · 10 ~ 15 거둠
  block:  { key: 'guard', H: 3, T: [0.05, 0.05, 0.05, 0.05, 0.2, 0.19, 0.16, 0.15] },     // 막기: 맞는 때(0.2초 뒤)에 방패가 올라와 있다
  guard:  { key: 'guard', time: 1, T: [0.1, 0.1, 0.12, 0.1, 0.14, 0.13, 0.12, 0.12] },    // 방패 세우기(방어 강화 · 보호막 · 되치기 자세)
  raise:  { key: 'raise', time: 1, T: [0.1, 0.1, 0.12, 0.1, 0.15, 0.14, 0.13, 0.13] }     // 칼 치켜들기
};
const HDW_OF = { down: 'slash', side: 'slash', hack: 'slash', smash: 'slash', up: 'upper', toss: 'upper', thrust: 'thrust', bash: 'bash', block: 'block',
  guard: 'guard', parry: 'guard', ready: 'guard', raise: 'raise', salute: 'raise', taunt: 'raise' };
const hdwMot = mk => HDC.mot[HDC.of[mk] || HDC.def], hdwKey = mk => hdwMot(mk).key || HDC.of[mk] || HDC.def;
const hdMotAtk = (mk, a) => { hdUse(a); const M = hdwMot(mk); return !M.time && M !== HDC.mot.block; };
// 마법사 1차 (tools/saved/gpt70/mage1 — 판 넷): 서 있기 · 앞모습은 두 장(둘째 = 한 칸 내려앉은 장)을 1.5초씩, 달리기 = 걷기, 치켜들기 = 마법 쏘기의 지팡이 올리는 장
const HDM_SEQ = { idle: ['idle', [...Array(14).fill(0), ...Array(14).fill(1)]], front: ['front', [...Array(14).fill(0), ...Array(14).fill(1)]], run: ['walk', null],
  raise: ['cast', [0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0]] };
const HDM_MOT = { cast: { H: 6, T: [0.09, 0.09, 0.12, 0.08, 0.18, 0.15, 0.12, 0.12] },   // 1 ~ 4 지팡이를 머리 위로 · 5 내뻗기 · 6 마법이 나감 · 7 ~ 10 뻗은 채 · 11 ~ 15 거둠
  raise: { key: 'raise', time: 1, T: [0.1, 0.1, 0.12, 0.1, 0.15, 0.14, 0.13, 0.13] } };
const HDM_OF = { sraise: 'raise', raise: 'raise', salute: 'raise', taunt: 'raise', guard: 'raise', block: 'raise', parry: 'raise', ready: 'raise' };   // 그 밖(내밀기 · 찌르기 · 휘두르기 · 모아 쏘기)은 마법 쏘기
// 궁수 1차 (tools/saved/gpt70/archer1 — 판 넷): 활쏘기 판은 0 서 있기 · 1 ~ 3 화살을 뽑아 메김 · 4 ~ 7 당김 · 8 ~ 9 화살을 다시 쥔 장(안 씀) · 10 쏜 자세 · 11 ~ 15 거둠
const HDA_SEQ = { idle: HDM_SEQ.idle, front: HDM_SEQ.front, run: ['walk', null],
  shot: ['shot', [0, 1, 2, 3, 4, 5, 6, 7, 10, 10, 10, 11, 12, 13, 14, 15]], raise: ['shot', [0, 1, 2, 3, 4, 5, 5, 5, 5, 4, 3, 2, 1, 0]] };
const HDA_MOT = { shot: { H: 8, T: [0.08, 0.08, 0.1, 0.08, 0.16, 0.14, 0.12, 0.12] },   // 8번째(차례) = 시위를 놓은 장
  raise: { key: 'raise', time: 1, T: [0.1, 0.1, 0.12, 0.1, 0.15, 0.14, 0.13, 0.13] } };
const HDA_OF = { braise: 'raise', raise: 'raise', salute: 'raise', taunt: 'raise', guard: 'raise', block: 'raise', parry: 'raise', ready: 'raise' };   // 그 밖(쏘기 · 힘껏 · 비스듬히 · 잇달아 · 후려치기)은 활쏘기
// 성직자 1차 (tools/saved/gpt70/cleric1 — 판 넷): 셉터 휘두르기 판은 0 서 있기 · 1 ~ 4 셉터를 머리 위로 · 5 내려옴 · 6 다 뻗음(맞히는 장 — 11-20 14:43 견습 셉터 판) · 7 ~ 10 내디딘 채 · 11 ~ 15 거둠
const HDP_SEQ = { idle: HDM_SEQ.idle, front: HDM_SEQ.front, run: ['walk', null], raise: ['swing', [0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0]] };
const HDP_MOT = { swing: { H: 6, T: [0.09, 0.09, 0.12, 0.08, 0.18, 0.15, 0.12, 0.12] }, raise: { key: 'raise', time: 1, T: [0.1, 0.1, 0.12, 0.1, 0.15, 0.14, 0.13, 0.13] } };
const HDP_OF = { raise: 'raise', salute: 'raise', taunt: 'raise', guard: 'raise', block: 'raise', parry: 'raise', ready: 'raise' };   // 그 밖(내려치기 · 올려치기 · 휘두르기 · 내밀기)은 셉터 휘두르기
// 도적 1차 (tools/saved/gpt70/rogue1 — 판 넷): 단검 찌르기 판은 0 서 있기 · 1 ~ 4 웅크리며 단검을 뒤로 · 5 튀어 나감 · 6 다 내지름(맞히는 장) · 7 ~ 9 뻗은 채 · 10 ~ 15 거둠
const HDR_SEQ = { idle: HDM_SEQ.idle, front: HDM_SEQ.front, run: ['walk', null], raise: ['stab', [0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0]] };
const HDR_MOT = { stab: { H: 6, T: [0.08, 0.08, 0.1, 0.07, 0.16, 0.14, 0.12, 0.12] }, raise: { key: 'raise', time: 1, T: [0.1, 0.1, 0.12, 0.1, 0.15, 0.14, 0.13, 0.13] } };
const HDR_OF = { raise: 'raise', salute: 'raise', taunt: 'raise', guard: 'raise', block: 'raise', parry: 'raise', ready: 'raise' };   // 그 밖(베기 · 찌르기 · 난도질 · 던지기)은 단검 찌르기
// 짐꾼 1차 (tools/saved/gpt70/porter1 — 판 넷): 몽둥이 내려치기 판은 0 서 있기 · 1 ~ 4 몽둥이를 머리 위로 · 5 내려옴 · 6 다 뻗음(맞히는 장) · 7 ~ 9 내디딘 채 · 10 ~ 15 거둠
const HDT_SEQ = { idle: HDM_SEQ.idle, front: HDM_SEQ.front, run: ['walk', null], raise: ['smash', [0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1, 0]] };
const HDT_MOT = { smash: { H: 6, T: [0.09, 0.09, 0.12, 0.08, 0.18, 0.15, 0.12, 0.12] }, raise: { key: 'raise', time: 1, T: [0.1, 0.1, 0.12, 0.1, 0.15, 0.14, 0.13, 0.13] } };
const HDT_OF = { raise: 'raise', salute: 'raise', taunt: 'raise', guard: 'raise', block: 'raise', parry: 'raise', ready: 'raise' };
const HDCFG = { warrior: { id: 'W', seq: HDW_SEQ, mot: HDW_MOT, of: HDW_OF, def: 'slash', shadow: HDW_SHADOW }, mage: { id: 'M', seq: HDM_SEQ, mot: HDM_MOT, of: HDM_OF, def: 'cast', shadow: { cast: 1, hurt: 1, death: 1 } },
  archer: { id: 'A', seq: HDA_SEQ, mot: HDA_MOT, of: HDA_OF, def: 'shot', shadow: { hurt: 1, death: 1 } },
  cleric: { id: 'P', seq: HDP_SEQ, mot: HDP_MOT, of: HDP_OF, def: 'swing', shadow: { swing: 1, hurt: 1, death: 1 } },
  rogue: { id: 'R', seq: HDR_SEQ, mot: HDR_MOT, of: HDR_OF, def: 'stab', shadow: { stab: 1, hurt: 1, death: 1 } },
  porter: { id: 'T', seq: HDT_SEQ, mot: HDT_MOT, of: HDT_OF, def: 'smash', shadow: { smash: 1, hurt: 1, death: 1 } } };
HDC = HDCFG.warrior;   // 맞히는 때가 있는 공격 동작 (view.js motCast — 막기가 거두는 장을 끊어도 되는 동작)
const HDW_FPS = { idle: 9, front: 9, sit: 5.5, sleep: 5 };   // 숨쉬기: 서 있기 · 앞모습 28장 ≈ 3.1초 · 앉기 14장 ≈ 2.5초 · 눕기 16장 3.2초
const HDW_HURT_T = 0.55, HDW_DIE_T = 1.0, HDW_RUN_T = 0.7, HDW_WALK_T = 1.05, HDW_BLOCK_PRE = 0.2, HDW_KEEP = 0.22;   // 맞음 · 쓰러짐 · 달리기 한 바퀴 · 걷기 한 바퀴(땅이 안 흐르는 곳) · 막기를 맞는 때보다 먼저 시작하는 초 · 새 공격이 와도 하던 공격을 맞힌 뒤 보여 주는 초
/* 걷기 한 바퀴(두 걸음)에 땅이 흐르는 거리(논리 픽셀). 그림의 보폭대로면 29(발 사이 80칸 × 0.24 × 1.5배 ÷ 2 × 두 걸음)인데, 땅은 초에 7 ~ 8밖에 안 흘러서
   (걷는 길 세 배 WALK_STRETCH) 그대로 맞추면 한 바퀴가 4초 — 느린 그림이 된다. 그래서 보통 빠르기에서 한 바퀴 1초가 되게 잡고, 빠른 파티는 그만큼 발이 빨라지고 느려지면(물 · 냉기) 느려진다 */
const HDW_STRIDE = 7.5;
const HDW_TC = {};
function hdMotT(a, mk) {   // view.js motTA: 이 길드원가 이 동작을 할 때 장마다 초 (null이면 엔진 그대로)
  if (!hdWarOn(a)) return null;
  hdUse(a); const ck = HDC.id + mk;
  if (HDW_TC[ck]) return HDW_TC[ck];
  const T = hdwMot(mk).T, n = pxsMotT(mk).length, hi = pxsMotHit(mk);
  if (n === 8 && hi === 4) return (HDW_TC[ck] = T);
  const pre = T.slice(0, 4).reduce((s, v) => s + v, 0), post = T.slice(4).reduce((s, v) => s + v, 0);   // 맞히는 장이 다른 엔진 동작(내려찍기 다섯째 장)은 앞 · 뒤 시간만 지킨다
  return (HDW_TC[ck] = Array.from({ length: n }, (_, f) => (f < hi ? pre / hi : post / (n - hi))));
}
function hdwMotFrame(mk, fr, mo) {   // 엔진 동작의 지금 자리(mo: view.js motNow — 장 f · 장 안 p · 장마다 초 T · 시작 장 f0) → 그림 동작의 장
  const M = hdwMot(mk), N = hdwLen(hdwKey(mk));
  let i;
  if (!mo || !mo.T) i = Math.round(fr * (N - 1) / Math.max(1, pxsMotT(mk).length - 1));
  else if (M.time) { const T = mo.T; let e = (mo.p || 0) * T[mo.f], tt = 0; for (let f = mo.f0 || 0; f < T.length; f++) { tt += T[f]; if (f < mo.f) e += T[f]; } i = Math.floor(e / tt * N); }
  else { const n = mo.T.length, hi = pxsMotHit(mk), u = mo.f + (mo.p || 0); i = u < hi ? Math.floor(u / hi * M.H) : M.H + Math.floor((u - hi) / (n - hi) * (N - M.H)); }
  return Math.max(0, Math.min(N - 1, i));
}
function hdWarSpr(a, pose, fr, t, o) {   // art.js drawAdv가 부른다 (null이면 예전 그림)
  if (!hdUse(a)) return null;
  const ph = o.ph || 0;
  if (pose === 'sleep') return hdwSpr('sleep', Math.floor(t * HDW_FPS.sleep + ph * 7), FLASH);   // 야영: 누워 자기
  if (pose === 'sit') return hdwSpr('sit', Math.floor(t * HDW_FPS.sit + ph * 5), FLASH);         // 야영: 앉아 쉬기
  if (!o.side) return hdwSpr('front', Math.floor(t * HDW_FPS.front + ph * 11), FLASH);           // 길드 앞 · 초상
  if (o.die != null) return hdwSpr('death', Math.min(15, Math.floor(o.die * 16)), FLASH);        // 쓰러지는 중 (view.js — HDW_DIE_T초)
  if (pose === 'down') return hdwSpr('death', 15, FLASH);                                        // 쓰러져 있다 (들것)
  if (pose.startsWith('m:')) { const mk = pose.slice(2); return hdwSpr(hdwKey(mk), hdwMotFrame(mk, fr, o.mot), FLASH); }
  if (pose === 'atk') return hdwSpr(HDC.def, fr ? 6 : 4, FLASH);                                 // 예전 두 장 공격 (동작이 없을 때)
  const h0 = typeof V !== 'undefined' && V.flash0 && a.id != null ? V.flash0['a' + a.id] : null, dt = h0 != null ? t - h0 : -1;
  if (dt >= 0 && dt < HDW_HURT_T) return hdwSpr('hurt', 1 + Math.min(14, Math.floor(dt / HDW_HURT_T * 15)), FLASH === '#ffffff' && dt > 0.07 ? null : FLASH);   // 맞음: 흰 번쩍은 처음 한순간만
  if (pose === 'walk') return o.run ? hdwSpr('run', Math.floor((t / HDW_RUN_T + ph * 0.37) * 16), FLASH) : hdwSpr('walk', Math.floor(((o.wph != null ? o.wph : t / HDW_WALK_T) + ph * 0.37) * 16), FLASH);
  return hdwSpr('idle', Math.floor(t * HDW_FPS.idle + ph * 11), FLASH);
}
/* 스킬 빛 (view.js 파티 그리기 — skfx.js skAdvFx와 같은 뜻을 리마스터 칼 자리에): ① 모으기 = 칼날이 스킬 색으로 달아오르고(칼날 칸 · 둘레), 빛 알갱이가 칼끝으로 모이고,
   온몸 기운(발밑 고리 · 오르는 불티) ② 자취 = 맞히는 장 앞뒤로 칼이 지나간 자리를 스킬 색 초승달로. 칼날 칸이 없는 줄(방패 밀기 · 막기)은 그리지 않는다 */
function hdSkFx(g, a, mo, sk, x, y, dir, t) {
  hdUse(a); const mk = mo.mk, M = hdwMot(mk), [rn, seq] = hdwRow(hdwKey(mk)), Q = HD.war && HD.war[rn];
  if (!sk || !Q || !Q.bl || !Q.bm || M.time) return;
  const N = seq ? seq.length : Q.f.length, at = i => (seq ? seq[i] : i), i = hdwMotFrame(mk, mo.f, mo), j = at(i), m = Q.m, q = m.hs, P = SK_PAL[sk.pal], fl = Math.floor(t * 25) % 2;
  const k = Math.max(0, Math.min(1, mo.e / Math.max(0.01, mo.hit))), U = 4 / 3;   // U: 화면에서 논리 2칸(다른 스킬 빛과 같은 굵기)이 되는 크기 — 그림은 1.5배
  g.save(); g.translate(x, y); g.scale(dir * 1.5, 1.5);
  const blit = (cv, al) => { if (al <= 0.02) return; g.globalAlpha = Math.min(1, al); g.drawImage(cv, -m.ax / q, -m.ay / q, m.w / q, m.h / q); g.globalAlpha = 1; };
  const cell = (X, Y, c, al) => { if (al != null && al <= 0.02) return; if (al != null && al < 1) g.globalAlpha = al; R(g, Math.round(X / U) * U, Math.round(Y / U) * U, U, U, c); g.globalAlpha = 1; };
  const B = Q.bl[j], tx = B[2] / q, ty = B[3] / q;
  if (sk.charge && sk.charge !== 'shield' && sk.charge !== 'tip' && mo.f >= 1 && mo.f <= 4 && (mo.first || sk.charge === 'glow')) {   // ① 칼날이 달아오른다
    blit(hdTint(Q.br[j], P[fl ? 1 : 2]), 0.35 + 0.5 * (mo.f >= 2 ? 1 : 0.4)); blit(hdTint(Q.bm[j], P[0]), mo.f >= 2 ? 0.9 : 0.55);
  }
  if (mo.first && mo.f <= 2) {
    if (sk.charge === 'gather' || sk.charge === 'aura') for (let n = 0; n < 8; n++) { const an = n * 0.785 + 0.3, r = 16 * (1 - k) + 1.5; cell(tx + Math.cos(an) * r, ty + Math.sin(an) * r * 0.8, P[n % 2 ? 1 : 2]); }   // 빛이 칼끝으로 모인다
    if (sk.charge === 'aura') {   // 온몸 기운: 발밑 고리 + 위로 오르는 불티
      const rr = 7 + 5 * k; for (let n = 0; n < 14; n++) { const an = n / 14 * Math.PI * 2; cell(Math.cos(an) * rr, -1 + Math.sin(an) * rr * 0.28, P[n % 2 ? 2 : 3], 0.8); }
      for (let n = 0; n < 6; n++) { const u = (t * 1.8 + skH(n, 1)) % 1; cell(-8 + skH(n, 2) * 18, -3 - u * 30, P[u < 0.5 ? 1 : 2], 1 - u); }
    }
  }
  if (sk.trail) {   // ② 자취: 맞히는 장 둘레에서 칼이 방금 지나온 자리 (장 사이는 손잡이 · 방향 · 길이를 이어서)
    const T = mo.T, n8 = T.length, hi = pxsMotHit(mk), u = mo.f + (mo.p || 0), v = u < hi ? u / hi * M.H : M.H + (u - hi) / (n8 - hi) * (N - M.H);   // 장 번호(소수)
    if (v > M.H - 1.6 && v < M.H + 2.6) {
      const pose = w => { const a0 = Math.max(0, Math.min(N - 1, Math.floor(w))), a1 = Math.min(N - 1, a0 + 1), f = Math.max(0, Math.min(1, w - a0)), A = Q.bl[at(a0)], C = Q.bl[at(a1)];
        const g0 = Math.atan2(A[3] - A[1], A[2] - A[0]), g1 = Math.atan2(C[3] - C[1], C[2] - C[0]); let d = g1 - g0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const L0 = Math.hypot(A[2] - A[0], A[3] - A[1]), L1 = Math.hypot(C[2] - C[0], C[3] - C[1]);
        return [(A[0] + (C[0] - A[0]) * f) / q, (A[1] + (C[1] - A[1]) * f) / q, g0 + d * f, (L0 + (L1 - L0) * f) / q]; };
      const span = 1.3 + 0.45 * sk.trail, v0 = Math.max(M.H - 2.2, v - span), seen = new Set(), ext = 1 + 0.1 * (sk.trail - 1);
      for (let w = v; w >= v0; w -= 0.04) {   // 촘촘히 (칼이 한 장에 60°씩 도는 구간에서도 칸이 비지 않게)
        const [hx, hy, an, L] = pose(w), age = (v - w) / span, ci = age < 0.2 ? 0 : age < 0.5 ? 1 : age < 0.8 ? 2 : 3;
        for (let r = L * 0.42; r <= L * ext; r += 0.6) { const X = Math.round((hx + Math.cos(an) * r) / U), Y = Math.round((hy + Math.sin(an) * r) / U), key = X + ',' + Y; if (seen.has(key)) continue; seen.add(key); cell(X * U, Y * U, P[ci], 1 - age * 0.55); }
      }
      blit(hdTint(Q.bm[j], P[0]), 0.6);
    }
  }
  g.restore();
}
// 그림자를 옮길 거리 (논리 픽셀 · 보는 쪽 +): 내딛는 장에서 발 가운데가 닻에서 나간 만큼
function hdWarSx(a, t, o) { const [pose, fr] = advPoseOf(t, o), s = hdWarSpr(a, pose, fr, t, o); return s && s.sx ? s.sx * 1.5 / s.hs : 0; }

// ── 1차 스킬 그림 (육각 안쪽 34×40 — hero.js hexURL) ──
const HD_SKI = {};
function hdSkiCells(id) {
  if (HD_SKI[id] !== undefined) return HD_SKI[id];
  const src = typeof HD70_DATA !== 'undefined' && HD70_DATA.ski[id]; if (!src) return (HD_SKI[id] = null);
  const [p, q] = src.split('|'), pal = [], A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
  for (let i = 0; i < p.length; i += 6) pal.push('#' + p.slice(i, i + 6));
  const out = []; for (let i = 0; i < q.length; i++) out.push(pal[A.indexOf(q[i])] || '#ff00ff');
  return (HD_SKI[id] = out);
}

// ── 넓은 평원 풍경 (scene.js getBg → BG_MAKERS.plains_hd) ──
const buildPlainsHD = () => buildWideHD('plains', buildPlains), buildForestHD = () => buildWideHD('forest', buildForest), buildDeepHD = () => buildWideHD('deep', buildForest), buildWtbaseHD = () => buildWideHD('wtbase', buildForest), buildRootcaveHD = () => buildWideHD('rootcave', buildForest);   // 깊은 숲 (2-2 · 11-20)
// 빌드 72 (11-21 00:24 사용자 「원시림, 깊은숲에 햇빛 들어오는 거」): 나무 사이로 내려오는 햇빛 — 어둠을 입힌 뒤에 그린다(scene.js bgEmit)
//   때에 따라: 아침엔 한쪽으로 길게 눕고 한낮엔 곧게, 저녁엔 반대로 눕는다 · 아침 · 저녁은 빛이 누렇게 · 해가 지면(어둠이 낮보다 짙어지면) 사라진다
//   빛줄기 = [자리, 너비, 세기] · 줄마다 겹 셋(넓고 흐린 겹 → 가운데 밝은 겹) + 땅에 닿는 자리의 빛 웅덩이 + 빛 속에 떠다니는 먼지. 색은 그림 위에 더한다(lighter)
const HD_SHAFTS = {
  // 원시림은 햇빛 없음 (11-21 00:46 사용자 「원시림은 햇빛이 드는 효과 없애고, 깊은숲만 남겨두자」 — 그늘 shade도 같이 뺌)
  deep:   { n: [[40, 8, 0.3], [150, 4, 0.22], [262, 11, 0.34], [371, 4, 0.22], [452, 7, 0.26]], span: 520, sp: 1.4, noon: [190, 245, 228], warm: [215, 225, 160], pool: 1, motes: 3, top: 94, fade: 0.12 },
  wtbase: { n: [[70, 10, 0.26], [215, 6, 0.2], [330, 14, 0.3], [470, 6, 0.2]], span: 560, sp: 1.4, noon: [215, 245, 215], warm: [240, 215, 150], pool: 1, motes: 3, top: 94, fade: 0.12 }
};
function hdShafts(g, C, off, t, dark, dim, gy) {
  const k = Math.max(0, Math.min(1, 1 - ((dark || 0) - dim) / C.fade)); if (k <= 0.03) return;
  const ph = typeof S !== 'undefined' && S && typeof DAY_SEC !== 'undefined' ? ((S.t / DAY_SEC) % 1 + 1) % 1 : 0.5, d = Math.max(-1, Math.min(1, (0.34 - ph) / 0.24));   // d: 새벽(0.1) +1 … 한낮(0.34) 0 … 해 질 녘(0.58) −1 (scene.js todAt의 낮)
  const slant = d * 0.7, wm = Math.min(1, d * d * 1.3), col = C.noon.map((v, i) => Math.round(v + (C.warm[i] - v) * wm)), rgb = col.join(','), top = C.top, bot = gy + 30, H = bot - top;
  if (C.shade) R(g, 0, top - 8, AW, AH, `rgba(${C.shade},${(0.2 * k).toFixed(3)})`);   // 나무 그늘: 숲 전체를 조금 눌러 빛줄기가 도드라지게 (밝은 숲)
  g.save(); g.globalCompositeOperation = 'lighter';
  C.n.forEach(([x0, wd, a], bi) => {
    const fl = 0.82 + 0.18 * Math.sin(t * 0.5 + x0 * 0.7), A = a * k * fl, xb = ((x0 - off * C.sp) % C.span + C.span) % C.span - 70;   // xb: 땅에 닿는 자리 (빛줄기는 거기서 위로 뻗는다)
    for (let y = top; y < bot; y += 2) { const u = (y - top) / H, xx = Math.round(xb - (bot - y) * slant), w2 = wd * (0.75 + 0.35 * u), f = 0.55 + 0.45 * u;   // 위는 좁고 흐리게, 아래로 갈수록 넓고 또렷하게
      R(g, Math.round(xx - w2 * 0.9), y, Math.round(w2 * 2.8), 2, `rgba(${rgb},${(A * 0.22 * f).toFixed(3)})`);
      R(g, Math.round(xx - w2 * 0.25), y, Math.round(w2 * 1.5), 2, `rgba(${rgb},${(A * 0.38 * f).toFixed(3)})`);
      R(g, xx, y, Math.max(1, Math.round(w2 * 0.6)), 2, `rgba(${rgb},${(A * 0.5 * f).toFixed(3)})`); }
    if (C.pool) for (let r = 0; r < 4; r++) { const pw = wd * (2.6 - r * 0.5), py = gy + 22 + r * 2; R(g, Math.round(xb + wd * 0.5 - pw / 2), py - 4 + (r === 0 ? 0 : 0), Math.round(pw), 8 - r * 2 > 0 ? 8 - r * 2 : 2, `rgba(${rgb},${(A * 0.2).toFixed(3)})`); }   // 땅의 빛 웅덩이 (겹칠수록 가운데가 밝다)
    for (let m = 0; m < C.motes; m++) { const u = ((t * (0.035 + m * 0.011) + m * 0.37 + bi * 0.21) % 1 + 1) % 1, y = top + 6 + (1 - u) * (H - 12), xx = xb - (bot - y) * slant + wd * (0.5 + 0.8 * Math.sin(t * 0.7 + m * 2.3 + bi)); const ma = A * 2.2 * Math.sin(u * Math.PI); if (ma > 0.03) R(g, Math.round(xx), Math.round(y), 1, 1, `rgba(${rgb},${Math.min(0.8, ma).toFixed(2)})`); }
  });
  g.restore();
}
function buildWideHD(id, old) {
  const L = HD.bgs && HD.bgs[id];
  if (!L) return Object.assign({ hdWait: 1 }, old());   // 그림을 풀기 전: 옛 평원 (풀면 BG.plains_hd를 지워 다시 짓는다)
  const B = HD70_DATA.bg[id], LD = (B.ld != null ? B.ld : 55) - HD_LD_UP;   // 빌드 72 한 줄 배치: 풍경을 55칸 내려 땅을 발밑의 얇은 띠로 (전투 창은 무대 아래 절반만 보인다 — view.js BW_Y)
  const q = B.hs || 1;   // 화면 픽셀 해상도 겹 (scene.js tile이 cv.hs를 본다)
  const mir = (im, h, y) => { const [cv, x] = mkCanvas(im.width * 2, h); x.drawImage(im, 0, Math.round(y * q)); x.save(); x.translate(im.width * 2, 0); x.scale(-1, 1); x.drawImage(im, 0, Math.round(y * q)); x.restore(); cv.hs = q; return cv; };   // 뒤집어 이어 붙여 이음매가 없다
  const back = mir(L.back, AH * q, B.back.y + LD), mid = mir(L.mid, AH * q, B.mid.y + LD), gr = mir(L.gr, L.gr.height, 0);
  const bw = B.blades ? B.blades.w : 0, bl = [];
  for (let i = 0; B.blades && i < B.blades.n; i++) { const [c, x] = mkCanvas(bw, bw); x.drawImage(L.blades, i * bw, 0, bw, bw, 0, 0, bw, bw); bl.push(c); }
  const W2 = mid.width / q, bx = B.blades ? B.blades.x : 0, by = B.blades ? B.blades.y + LD : 0;
  return { tall: 1, wide: 1, hdSky: 1, back, far: null, mid, gr, gy: B.gr.y + LD, clouds: B.sky ? 0 : 7, ambient: B.amb || (B.sky ? 'deep' : 'meadow'), skyOy: B.skyOy + LD, gateY: B.gateY + 40,
    skyFill: B.sky || null, dim: B.dim || 0,   // 깊은 숲: 하늘 대신 어둠 · 낮에도 어둑하다 (view.js)
    noHaze: B.sky ? 1 : 0,
    emit: !HD_SHAFTS[id] ? null : function (g, off, t, dark) { hdShafts(g, HD_SHAFTS[id], off, t, dark, B.dim || 0, B.gr.y + LD); },
    props(g, off, t, dark) {   // 풍차 날개 (뒤집힌 짝은 거꾸로 돈다)
      if (!bl.length) return;
      const fi = Math.floor(t * 8) % bl.length;
      for (const [x0, flip] of [[bx, 0], [W2 - bx, 1]]) {
        const x = ((x0 - off) % W2 + W2) % W2;
        for (const xx of [x, x - W2]) { if (xx < -bw / q || xx > VW + bw / q) continue; g.save(); g.translate(Math.round(xx), Math.round(by)); if (flip) g.scale(-1, 1); g.drawImage(bl[fi], -bw / q / 2, -bw / q / 2, bw / q, bw / q); g.restore(); }
      }
    } };
}
hdLoad();
