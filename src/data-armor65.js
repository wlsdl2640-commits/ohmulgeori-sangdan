/* ───────── 방어구 개편(경갑 · 중갑 · 판금 · 천갑) · 하의 · 장갑 · 신발 · 벨트 칸 (빌드 65) ─────────
   사용자 11-12 10:29 「전사 경갑 디자인이야 이걸 그대로 게임에 넣어서 레어도넣고 적용할거니까」 · 10:35 「나중에 200까지 늘릴거니까 다 넣어두고
   몬스터가 더 늘어나면 그때 바로 추가하면되」 · 10:50 「다시찍지말고 그대로 사용」 · 11:27 「이번엔 중갑 넣어」 · 11:28 「이건 판금」
   · 12:04 「판금 다 삭제, 첫 이미지로 판금 대체, 두번째는 천갑 상, 하의야 추가해」(새 판금 판 — 주요 직업 마검사 · 천갑 판 — 주요 직업 검객 · 레인저 · 마법사)
   · 12:24 「가죽신발은, 궁수, 도적 계열신발, 천은 법사, 사제, 계열, 철신발을 판금신발로 바꾸고 전사, 짐꾼 계열로 설정해서 넣어」(신발 판 셋 — 새 신발 칸)
   · 12:54 「이번엔 장갑이야. 천장갑은 마법사, 사제. 판금장갑은 전사, 짐꾼, 가죽은 궁수, 도적용」 · 「이건 벨트인데 전직업 공용이야」(장갑 판 셋 · 벨트 판 — 새 장갑 칸 · 벨트 칸).
   - 11-10 사용자 구분: 경갑 = 기본 전사 · 검투사 / 중갑 = 광전사 · 기사 / 판금 = 마검사(3차는 2차를 따른다).
     경갑(상의, 방어구 칸) · 경갑 하의(새 하의 칸): 전사 · 검투사 · 챔피언 — 기사 · 광전사 · 마검사 계열은 뺀다(cx).
     중갑 · 중갑 하의: 기사 · 성기사 · 광전사 · 피의 군주.
     판금 갑옷(옛 plate — 그림 · 설명을 사용자 판금 상의로, 12:04 새 판) · 판금 하의: 마검사 · 마검성. 판금 갑옷은 예전처럼 용기병 · 심판관도 입는다(그 계열 방어구가 나올 때까지, 판금 하의는 마검사 계열만).
     천갑 · 천갑 하의: 궁수 계열(11-10 구분 천 = 궁수 · 판의 레인저) · 마법사 계열(판의 마법사). 판의 「검객」은 아직 게임에 없는 직업 — 생기면 넣는다.
   - 그림은 사용자가 준 디자인 그대로(ARMART, data-armart.js ← tools/saved/armor_light65/export_armart.py) — 칸에 도트로 굽지 않고 위에 얹는다(sprites.js armArtURL · rarity.js).
   - 디자인 Lv1 · 10 · … · 200 = 21개를 게임 단계 차례대로: 지금 단계 16개(견습 ~ 성좌)에 앞 16개, 나머지 5개는 단계가 늘면 바로 쓴다.
   - 레어도 · 룬 칸 · 합성 · 대장간 · 드랍은 다른 방어구와 같다. 가죽 갑옷 · 로브는 그대로(가죽은 전사 · 궁수 계열도, 로브는 마법사 계열도 입는다). */
SLOTS.splice(SLOTS.findIndex(s => s[0] === 'armor') + 1, 0, ['legs', '하의'], ['gloves', '장갑'], ['boots', '신발'], ['belt', '벨트']);   // 방어구 → 하의 → 장갑 → 신발 → 벨트 → 장신구 → 가방
const LARMOR_CX = ['knight', 'berserker', 'spellblade'];   // 이 직업과 그 3차(성기사 · 피의 군주 · 마검성)는 못 입는다
GTYPES.larmor = { name: '경갑', slot: 'armor', cls: ['warrior'], cx: LARMOR_CX, st: { def: 3.2, hp: 7, agi: 0.4 }, w: 4, icon: 'vest', mat: [1, 3, 0], art: 'larmor', who: '전사 · 검투사 계열',
  desc: '민첩성을 중시한 가벼운 갑옷. 전사 · 검투사 계열의 기본 방어구.' };
GTYPES.lpants = { name: '경갑 하의', slot: 'legs', cls: ['warrior'], cx: LARMOR_CX, st: { def: 1.4, hp: 3, agi: 0.3 }, w: 2, icon: 'pants', mat: [1, 2, 0], art: 'lpants', who: '전사 · 검투사 계열',
  desc: '가볍고 활동성이 높은 경갑 계열의 하의.' };
GTYPES.hvarmor = { name: '중갑', slot: 'armor', cls: ['knight', 'berserker'], st: { def: 3.8, hp: 9 }, w: 5, icon: 'armor', mat: [2, 2, 0], art: 'hvarmor', who: '기사 · 광전사 계열',
  desc: '두꺼운 쇠판을 겹친 무거운 갑옷. 기사 · 광전사 계열의 방어구.' };
GTYPES.hvpants = { name: '중갑 하의', slot: 'legs', cls: ['knight', 'berserker'], st: { def: 1.7, hp: 4 }, w: 3, icon: 'pants', mat: [2, 1, 0], art: 'hvpants', who: '기사 · 광전사 계열',
  desc: '무릎과 허벅지를 쇠판으로 감싼 중갑 계열의 하의.' };
// 판금: 옛 판금 갑옷(이름 그대로)에 사용자 판금 상의 그림 · 설명 — 「경량화 판금갑옷」이라 옛 민첩 −0.3 · 무게 6을 민첩 감소 없음 · 무게 5로. 입는 직업은 마검사 계열(전사 · 검투사 · 기사 · 광전사 계열은 이제 경갑 · 중갑)
Object.assign(GTYPES.plate, { cls: ['spellblade', 'dragoon', 'inquisitor'], st: { def: 4.2, hp: 10 }, w: 5, art: 'plate', who: '마검사 계열 · 용기병 · 심판관',
  desc: '핵심 부위만 금속으로 보호하고, 나머지는 가죽과 벨트로 연결한 경량화 판금갑옷.' });
GTYPES.ppants = { name: '판금 하의', slot: 'legs', cls: ['spellblade'], st: { def: 1.9, hp: 4.5 }, w: 3, icon: 'pants', mat: [2, 1, 0], art: 'ppants', who: '마검사 계열',
  desc: '주요 부위(허리 · 골반 · 대퇴)를 금속으로 보강하고, 가죽과 벨트로 연결한 기동성 높은 하의.' };
// 천갑: 가죽 갑옷보다 방어는 낮고 민첩은 높다 · 가볍다
GTYPES.cloth = { name: '천갑', slot: 'armor', cls: ['archer', 'mage'], st: { def: 2.2, hp: 5, agi: 0.8 }, w: 2, icon: 'vest', mat: [0, 2, 2], art: 'cloth', who: '궁수 · 마법사 계열',
  desc: '천을 기본으로 제작하고, 보호가 필요한 부위에 가죽을 덧댄 경량 보호구.' };
GTYPES.cpants = { name: '천갑 하의', slot: 'legs', cls: ['archer', 'mage'], st: { def: 1.0, hp: 2, agi: 0.4 }, w: 1, icon: 'pants', mat: [0, 1, 2], art: 'cpants', who: '궁수 · 마법사 계열',
  desc: '가볍고 유연한 천을 기반으로, 무릎 · 허리 · 허벅지 등 주요 부위를 가죽으로 보강한 하의.' };
// 신발(새 신발 칸): 판금신발(받은 판 이름은 철신발 — 사용자가 판금신발로) = 전사 · 짐꾼 계열 / 가죽신발 = 궁수 · 도적 계열 / 천신발 = 마법사 · 성직자 계열 → 모든 직업에 신발 칸
// 설명은 판 글에서 「전사 전용」 · 「전사용」 · 「전용」만 뺐다(입는 직업을 사용자가 다시 정해서)
GTYPES.pboots = { name: '판금신발', slot: 'boots', cls: ['warrior', 'porter'], st: { def: 1.3, hp: 3 }, w: 2, icon: 'boot', mat: [2, 1, 0], art: 'pboots', who: '전사 · 짐꾼 계열',
  desc: '견고한 금속으로 제작된 신발. 전투 시 발과 정강이를 단단히 보호한다.' };
GTYPES.lboots = { name: '가죽신발', slot: 'boots', cls: ['archer', 'rogue'], st: { def: 0.9, hp: 2, agi: 0.3 }, w: 1, icon: 'boot', mat: [0, 2, 0], art: 'lboots', who: '궁수 · 도적 계열',
  desc: '가죽을 기반으로 제작된 신발. 가볍고 유연하면서도 주요 부위를 튼튼하게 보호한다.' };
GTYPES.cboots = { name: '천신발', slot: 'boots', cls: ['mage', 'cleric'], st: { def: 0.6, mp: 2, int: 0.25 }, w: 1, icon: 'boot', mat: [0, 1, 1], art: 'cboots', who: '마법사 · 성직자 계열',
  desc: '가벼운 천 소재로 만든 신발. 밑창만 가죽으로 제작해 유연하고 가볍다.' };
// 장갑(새 장갑 칸): 신발과 같은 나눔 — 판금장갑 = 전사 · 짐꾼 계열 / 가죽장갑 = 궁수 · 도적 계열 / 천장갑 = 마법사 · 성직자 계열. 설명은 판 글(천장갑은 「마법사 · 학자 · 사제 계열이 주로 착용」을 뺌 — 입는 직업 줄이 따로 있다)
GTYPES.pgloves = { name: '판금장갑', slot: 'gloves', cls: ['warrior', 'porter'], st: { def: 1.0, hp: 2, str: 0.3 }, w: 2, icon: 'glove', mat: [2, 1, 0], art: 'pgloves', who: '전사 · 짐꾼 계열',
  desc: '견고한 금속으로 제작된 중갑 장갑. 높은 방어력과 내구성을 지닌다.' };
GTYPES.lgloves = { name: '가죽장갑', slot: 'gloves', cls: ['archer', 'rogue'], st: { def: 0.7, hp: 1.5, agi: 0.4 }, w: 1, icon: 'glove', mat: [0, 2, 0], art: 'lgloves', who: '궁수 · 도적 계열',
  desc: '유연하고 가벼운 가죽으로 제작된 장갑. 민첩성과 활동성이 뛰어나다.' };
GTYPES.cgloves = { name: '천장갑', slot: 'gloves', cls: ['mage', 'cleric'], st: { def: 0.5, mp: 1.5, int: 0.3 }, w: 1, icon: 'glove', mat: [0, 1, 1], art: 'cgloves', who: '마법사 · 성직자 계열',
  desc: '가볍고 유연한 천 재질의 장갑.' };
// 벨트(새 벨트 칸): 모든 직업 공용
GTYPES.belt = { name: '벨트', slot: 'belt', cls: ['all'], st: { def: 0.6, hp: 3 }, w: 1, icon: 'belt', mat: [1, 2, 0], art: 'belt',
  desc: '가죽, 천, 금속 등 다양한 재질로 제작된 공용 벨트. 모든 직업이 착용 가능.' };
// 대장간 · 떨어뜨리는 표: 판금 갑옷 자리에 새 방어구를 차례로 (경갑 · 중갑 · 판금 · 가죽 · 천갑, 상의 다음 하의 · 장갑 셋 · 신발 셋 · 벨트)
const ARMOR65 = ['larmor', 'lpants', 'hvarmor', 'hvpants', 'plate', 'ppants', 'leather', 'cloth', 'cpants', 'pgloves', 'lgloves', 'cgloves', 'pboots', 'lboots', 'cboots', 'belt'];
for (const L of [GTYPE_IDS, CRAFT_IDS]) { const at = L.indexOf('plate'); for (const b of ARMOR65) { const i = L.indexOf(b); if (i >= 0) L.splice(i, 1); } L.splice(Math.min(at, L.length), 0, ...ARMOR65); }
// 갑옷 숙련: 판금만 → 전사 방어구 셋 (전사 · 검투사가 판금을 못 입게 되어도 배운 숙련이 그대로 쓰이게)
Object.assign(MASTERY.plate, { w: ['larmor', 'hvarmor', 'plate'], wn: '경갑 · 중갑 · 판금 갑옷', desc: '갑옷(경갑 · 중갑 · 판금)을 몸처럼 입는다.' });
// 옛 저장 · 손님 · 투기장 상대: 이제 판금을 못 입는 전사 계열이 입던 판금 갑옷은 그 계열 갑옷으로(단계 · 레어도 · 룬 · 옵션 그대로) — notes65가 부른다
const clsFits = (a, b) => { const T = GTYPES[b], ch = chainOf(a.cls); return (T.cls.includes('all') || ch.some(c => T.cls.includes(c))) && !(T.cx && ch.some(c => T.cx.includes(c))); };
function plate65(a) {
  const g = a && a.eq && a.eq.armor; if (!g || g.base !== 'plate' || !CLASSES[a.cls] || clsFits(a, 'plate')) return 0;
  const to = ['hvarmor', 'larmor'].find(b => clsFits(a, b)); if (!to) return 0;
  g.base = to; return 1;
}
// 하의 · 장갑 · 신발 · 벨트 칸을 쓰는 모험가 (그 칸에 입을 수 있는 장비가 있을 때만 창에 칸이 보인다 — 장갑 · 신발 · 벨트는 모든 직업)
const wearsSlot = (a, s) => !!a && GTYPE_IDS.some(b => GTYPES[b].slot === s && gearFits(a, { base: b, t: 0 }));
const hasLegs = a => wearsSlot(a, 'legs');
const SLOTS65 = ['legs', 'gloves', 'boots', 'belt'];   // 빌드 65에 생긴 칸
const slotShown = (a, s) => (s === 'ammo' ? hasAmmoSlot(a) : !SLOTS65.includes(s) || wearsSlot(a, s) || !!(a.eq && a.eq[s]));
