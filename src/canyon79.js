/* ───────── 빌드 79: 2층 점토 협곡 (11-28 대표님 — 회의 e11 · ai-meeting decisions.md 「e11 점토 협곡」) ─────────
   · 무너진 옛 제국 수로를 따라가는 20칸 · Lv13 ~ 24 · 2-10 중간 우두머리 수로턱 집게벌레 Lv20 · 2-17 리젠보스 수문쇠 집게괴수 Lv25(30분) · 2-20 층 주인 벽흙 들소 Lv27
   · 그림 · 동작은 data-pxl78.js(export78.py — anim76 협곡 13종), 동작 갈래는 hd70.js
   · 칸마다 짝 · 마릿수를 정한다(st20Pack을 덮음: 같은 종 80% · 짝과 섞임 20%, 낮 / 밤 짝이 다른 칸) · 큰 일반 둘은 무리당 1마리
   · 몬스터 기술: 뒤쪽 몬스터는 둘씩(대표님 e11-6) · 리젠보스는 부적 + 1차 후속 스킬북(대표님 e11-5)
   · 배경은 아직 협곡 그림이 없어 바람계곡(valley)을 빌린다 — 그림을 그리면 bg만 바꾼다 */
const CY79 = {
  canyon_ledge_lizard:  ['흙턱 도마뱀',      'quad',  '#b8683a', '#6a3418', 1.30, 1.18, 1.30, 1.15, 'beast|earth',   [['bite', '흙턱 물기']],                                    ST69('stun', 0.10, 1),    ['rscale', 'bone'],  ['도마뱀 꼬리살', '붉은 흙맛이 밴 쫄깃한 꼬리살.'], ['weapon', 'atk', 0]],
  canyon_crack_beetle:  ['벽틈 딱정벌레',    'quad',  '#a8704a', '#5a3420', 1.40, 1.15, 1.65, 0.90, 'monster|earth', [['guard', '등껍질 세우기']],                               null,                     ['ore', 'shell'],    ['딱정벌레 속살', '단단한 껍질 속 하얀 살.'], ['armor', 'def', 0.03]],
  canyon_clay_burrower: ['흙판 잠복충',      'quad',  '#9a7a5a', '#4a3424', 1.38, 1.25, 1.25, 1.00, 'monster|earth', [['stab', '땅에서 솟아 찌르기']],                           ST69('bleed', 0.15, 5),   ['shell', 'ore'],    null, ['bag', 'carry', 0]],
  canyon_pool_toad:     ['웅덩이 두꺼비',    'quad',  '#6a8a5a', '#34482a', 1.55, 1.22, 1.25, 0.90, 'beast|water',   [['blind', '진흙 뱉기']],                                   null,                     ['hide', 'bone'],    ['두꺼비 뒷다리살', '물가에서 단련된 통통한 뒷다리.'], ['armor', 'hp', 0]],
  canyon_cave_bat:      ['협곡박쥐',         'flyer', '#9a3a2a', '#4a1a14', 1.32, 1.30, 1.10, 1.30, 'beast|dark',    [['drain', '흡혈'], ['blind', '눈부신 날갯짓']],              null,                     ['hide'],            null, ['armor', 'eva', 0]],
  canyon_clay_wasp:     ['흙관벌',           'flyer', '#d88a3a', '#6a3a14', 1.30, 1.32, 1.08, 1.25, 'monster|wind',  [['poison', '독침'], ['haste', '날갯짓']],                     ST69('poison', 0.20, 6),  ['shell'],           null, ['weapon', 'crit', 0]],
  canyon_bank_beetle:   ['물턱 황소벌레',    'quad',  '#7a5a3a', '#3a2818', 1.85, 1.42, 1.55, 0.92, 'monster|earth', [['gore', '몸통 들이받기'], ['guard', '물턱 버티기']],       ST69('stun', 0.14, 1.2),  ['ore', 'shell'],    ['황소벌레 가슴살', '물가 흙을 머금어 고소한 가슴살.'], ['off', 'def', 0.03]],
  canyon_bank_otter:    ['둑발 수달',        'biped', '#7a5a3a', '#3a2818', 1.72, 1.45, 1.35, 1.15, 'beast|water',   [['hit', '꼬리 후려치기'], ['acid', '젖은 모래 뿌리기']],     ST69('corrode', 0.15, 6), ['hide', 'bone'],    ['수달 갈비살', '둑을 쌓느라 다져진 갈비살.'], ['acc', 'agi', 0]],
  canyon_slab_toad:     ['흙판을 깨는 큰두꺼비', 'quad', '#5a7a4a', '#2a3a20', 2.35, 1.52, 1.50, 0.85, 'beast|water', [['quake', '땅 구르기'], ['blind', '진흙 뱉기']],           null,                     ['hide', 'bone'],    ['큰두꺼비 통다리살', '흙판을 깨는 굵은 통다리.'], ['armor', 'hp', 0.03]],
  canyon_spire_hawk:    ['흙탑 사냥매',      'flyer', '#d8783a', '#2a2a4a', 2.15, 1.56, 1.25, 1.22, 'beast|wind',    [['stab', '급강하'], ['haste', '바람 타기']],                  ST69('bleed', 0.20, 5),   ['feather', 'bone'], ['사냥매 가슴살', '하늘을 가르던 단단한 가슴살.'], ['bag', 'movePct', 0]],
  canyon_sluice_earwig: ['수로턱 집게벌레',  'quad',  '#5a6a3a', '#2a3418', 4.20, 1.65, 1.60, 0.95, 'monster|earth', [['gore', '집게 꿰뚫기', { sta: { k: 'stun', p: 0.15, d: 1.2 } }], ['acid', '진흙 집게']], ST69('corrode', 0.15, 6), ['ore', 'shell'], ['집게벌레 집게살', '수로 바닥을 긁던 집게 속살.'], null],
  canyon_gate_crab:     ['수문쇠 집게괴수',  'quad',  '#a8783a', '#4a3418', 5.60, 1.75, 1.85, 0.90, 'kaiju|water',   [['sweep', '집게 휩쓸기'], ['shield', '쇠우리 내리기']],     ST69('bleed', 0.22, 6),   ['ore', 'shell'],    ['청동게 집게살', '청동 껍데기 속 달큰한 살.'], null],
  canyon_cliff_bison:   ['벽흙 들소',        'quad',  '#8a4a2a', '#3a1a10', 8.40, 1.90, 2.05, 0.95, 'beast|earth',   [['gore', '들이받기', { sta: { k: 'stun', p: 0.18, d: 1.5 } }], ['quake', '땅 구르기'], ['rage', '흙벽 돌진']], ST69('bleed', 0.20, 6), ['hide', 'bone'], ['들소 등심', '벼랑 풀을 먹고 자란 기름진 등심.'], null]
};
ITEMS.canyon_watermarked_clay = { name: '물자국 점토', v: 48, w: 2, icon: 'ore', c: '#b86a3a', desc: '옛 제국 수로의 물자국이 층층이 밴 붉은 점토. 2층 점토 협곡 몬스터들의 공용 부속품.' };
const CY79_BIG = { canyon_slab_toad: 2, canyon_spire_hawk: 2, canyon_sluice_earwig: 2, canyon_gate_crab: 3, canyon_cliff_bison: 3 };
for (const [id, [name, plan, body, dark, mh, ma, md, spd, tag, sk, sta, mats, meat, scr]] of Object.entries(CY79)) {
  MONS[id] = { name, plan, body, dark, len: 12, h: 6, mh, ma, md, spd, minS: 99, drops: [['canyon_watermarked_clay', 1, CY79_BIG[id] || 1]] };
  if (plan === 'flyer') MONS[id].fly = 1;
  const [ty, el] = tag.split('|'); MONS[id].ty = ty.split(' '); MONS[id].el = el ? [el] : [];
  MONS[id].msk = sk.map(([tpl, nm, o], i) => Object.assign({}, MSK[tpl], o || {}, { id: tpl + i, tpl, name: nm || MSK[tpl].name }));
  if (sta) MONS[id].sta = sta;
  MAT_OF[id] = mats;
  if (meat) { const k = 'mm_' + id; ITEMS[k] = { name: meat[0], v: 30, w: 1, icon: (ITEMS.raw_meat && ITEMS.raw_meat.icon) || 'blob', c: '#c05848', mmeat: id, desc: `${meat[1]} (마물육 — ${name})` }; }
  if (scr) DROP79.mon[id] = scr;
}
DROP79.boss.mid.canyon_sluice_earwig = { m: ['off', 'block'], cat: { cat_str: 0.07 }, whet: 0.12 };
DROP79.boss.lord.canyon_cliff_bison = { m: ['weapon', 'atk'], cat: { cat_str: 0.06, cat_vit: 0.02, cat_int: 0.02, cat_agi: 0.02 }, whet: 0.35 };
DROP79.boss.k3 = { canyon_gate_crab: { m: ['armor', 'mres'], cat: { cat_vit: 0.08 }, whet: 0.25 } };
DROP79.p.k3 = [0.07, 0.05, 0.03, 0.005];

// 필드
FIELDS.canyon = {
  no: 2, name: '점토 협곡', lv: 13, bg: 'valley', tier: 0,
  desc: '붉은 벼랑을 따라 무너진 옛 제국 수로가 이어진다. 물자국을 따라가면 3층으로 내려가는 물길이 나온다.',
  mons: ['canyon_ledge_lizard', 'canyon_crack_beetle', 'canyon_clay_burrower', 'canyon_pool_toad', 'canyon_cave_bat', 'canyon_clay_wasp', 'canyon_bank_beetle', 'canyon_bank_otter', 'canyon_slab_toad', 'canyon_spire_hawk'],
  bosses: ['canyon_sluice_earwig', null, null, null, 'canyon_cliff_bison'],
  stages: 20, lvTab: [13, 13, 14, 15, 15, 16, 16, 17, 18, 19, 19, 19, 20, 20, 21, 22, 22, 23, 24, 27],   // 2-10 우두머리 = 칸 + 1 = Lv20 · 2-20 주인은 표 그대로(lordX) = Lv27
  st20: { canyon_ledge_lizard: [1, 13], canyon_crack_beetle: [1, 6], canyon_clay_burrower: [3, 18], canyon_pool_toad: [5, 16], canyon_cave_bat: [6, 18], canyon_clay_wasp: [6, 13], canyon_bank_beetle: [8, 19], canyon_bank_otter: [11, 19], canyon_slab_toad: [14, 16], canyon_spire_hawk: [15, 18] },
  pack20: Array.from({ length: 20 }, (_, i) => [8, 9, 12, 17, 19].includes(i + 1) ? [2, 3, 2, 3] : [1, 2, 1, 2]),
  same20: 0.8,
  lordX: { hp: 8.4, atk: 1.9, def: 2.05 },
  herbs: ['herb', 'mugwort'],
  next: 'forest'
};
// 칸마다 짝 [낮 주종, 낮 짝, 밤 주종, 밤 짝] (e11 20칸 무리표)
const CY79_PACK = { 1: ['canyon_ledge_lizard', 'canyon_crack_beetle'], 2: ['canyon_crack_beetle', 'canyon_ledge_lizard'], 3: ['canyon_clay_burrower', 'canyon_crack_beetle'], 4: ['canyon_ledge_lizard', 'canyon_clay_burrower'],
  5: ['canyon_pool_toad', 'canyon_ledge_lizard'], 6: ['canyon_clay_wasp', 'canyon_crack_beetle', 'canyon_cave_bat', 'canyon_crack_beetle'], 7: ['canyon_clay_burrower', 'canyon_clay_wasp', 'canyon_clay_burrower', 'canyon_cave_bat'],
  8: ['canyon_pool_toad', 'canyon_bank_beetle'], 9: ['canyon_bank_beetle', 'canyon_pool_toad'], 10: ['canyon_bank_beetle', 'canyon_pool_toad'], 11: ['canyon_bank_otter', 'canyon_pool_toad'], 12: ['canyon_bank_beetle', 'canyon_bank_otter'],
  13: ['canyon_clay_wasp', 'canyon_ledge_lizard', 'canyon_cave_bat', 'canyon_ledge_lizard'], 14: ['canyon_slab_toad', 'canyon_pool_toad'], 15: ['canyon_spire_hawk', 'canyon_clay_burrower', 'canyon_cave_bat', 'canyon_clay_burrower'],
  16: ['canyon_slab_toad', 'canyon_pool_toad'], 17: ['canyon_bank_otter', 'canyon_bank_beetle'], 18: ['canyon_spire_hawk', 'canyon_clay_burrower', 'canyon_cave_bat', 'canyon_clay_burrower'], 19: ['canyon_bank_beetle', 'canyon_bank_otter'] };
const _st20Pack79c = st20Pack;
st20Pack = function (F, e, pool, extra) {   // eslint-disable-line no-func-assign
  const P = F === FIELDS.canyon && CY79_PACK[e.stage]; if (!P) return _st20Pack79c(F, e, pool, extra);
  const nt = isNight(), main = nt && P[2] ? P[2] : P[0], mate = nt && P[3] ? P[3] : P[1];
  const R = F.pack20[Math.max(0, Math.min(19, e.stage - 1))]; let n = e.mode === 'return' ? 1 : ri(nt ? R[2] : R[0], nt ? R[3] : R[1]); n = Math.min(5, n + (extra || 0));
  if (CY79_BIG[main]) return rnd() < (F.same20 || 0.8) || n < 2 ? [main] : [main, mate];   // 큰 일반은 무리당 1마리
  if (n < 2 || rnd() < (F.same20 || 0.8)) return Array(n).fill(main);
  const nb = Math.floor(n / 2); return Array(n - nb).fill(main).concat(Array(nb).fill(mate));
};
// 리젠보스 수문쇠 집게괴수 (2-17 · 30분 · 부적 + 1차 후속 스킬북)
GTYPES.gateamulet = { name: '수문쇠 부적', slot: 'acc', cls: ['all'], st: { vit: 7 / 1.55, def: 3 / 1.55, hp: 20 / 1.55 }, w: 1, icon: 'amulet', boss: 1, nocraft: 1, shieldStart: 0.15,
  desc: '수문쇠 집게괴수의 쇠우리에서 떨어진 청동 조각을 엮은 부적. 싸움이 시작되면 끼고 있는 사람을 한 번 감싼다(최대 HP의 15%).' };
if (typeof WNAME !== 'undefined') WNAME.gateamulet = ['수문쇠 부적'];
let CY79_BOOKS = null;
const cy79Books = () => CY79_BOOKS || (CY79_BOOKS = ['warrior', 'archer', 'mage', 'cleric', 'rogue', 'porter'].map(c => Object.keys(SKILLS).find(id => { const s = SKILLS[id]; return s.cls && s.cls.includes(c) && !s.cut && (s.lv || 0) >= 8 && (s.lv || 0) <= 30 && ITEMS['book_' + id] && !REGEN_BOOKS78.includes(id); })).filter(Boolean));
REGEN78.k3 = { mon: 'canyon_gate_crab', field: 'canyon', stage: 17, min: 30, lvAdd: 3, hp: 5.6, atk: 1.75, def: 1.85, spot: '청동 수문', fall: '쇠우리째 수로 바닥에 주저앉았다',
  drop: [['gear', 0.10], ['book', 0.18]], gear: () => ({ id: nid(), base: 'gateamulet', t: 0, q: 2, bonus: null, runes: [] }), books: cy79Books };
// 펫 먹이 (2층) · 현상 수배 이름
PET_FOOD79.pf_canyon = { exp: 180, aff: 6, need: { mm_canyon_ledge_lizard: 1, mm_canyon_pool_toad: 1, mm_scarecrow: 1 }, buy: 260 };
ITEMS.pf_canyon = { name: '협곡 고기 경단', v: 60, w: 1, icon: 'blob', c: '#c8783a', petFood: 1, keep: 1, desc: '도마뱀 꼬리살과 두꺼비 뒷다리살을 벼와 함께 빚은 펫 먹이. 펫 경험치 +180 · 호감도 +6.' };
for (const k of PET_IDS) PETS[k].likes = Object.keys(PET_FOOD79);
B79.find(b => b.id === 'own_canyon').name = '2층 주인 벽흙 들소';
B79.push({ id: 'rg_k3', regen: 'k3', name: '수문쇠 집게괴수', gold: 200, fame: 0 });
PLOG79.canyon[1] = '권장 Lv13 ~ 27 · 무너진 옛 제국 수로를 따라간다. 갑각 몬스터가 단단하니 방어를 깨는 공격을, 밤에는 협곡박쥐의 흡혈에 대비할 것.';
// 계층 순서 (decisions 29장): 1층 곡창지대 → 2층 점토 협곡 → 3층 개미굴 → 4 ~ 8층 원시림
if (!ALL_FIELDS.includes('canyon')) ALL_FIELDS.splice(ALL_FIELDS.indexOf('plains') + 1, 0, 'canyon');
FIELDS.plains.next = 'canyon';
if (FIELDS.forest) FIELDS.forest.no = 4;
