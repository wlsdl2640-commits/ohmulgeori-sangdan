/* ───────── 라비린토스 지하 3구역 「옛 제국 수로」(Lv100) · 「지하미궁 통로」(Lv120 ~ 140) (빌드 70) ─────────
   11-18 01:38 · 09:05 · 09:19 사용자 고른 그림(pxaqueduct.js · pxpassage.js — tools/saved/mon70/emitunder70.py)
   + 「사슬 확정 , 누런 매연, 검은두건까지 넣고 다음 ㄱㄱ」 · 계획 문서 「라비린토스 지하」 · 「암살자 길드」 절:
   · 3구역 옛 제국 수로(Lv100, 지하수로 깊은 곳 다음 — 2구역 연성 실험실은 고르면 그 사이에 끼운다): 수로 히드라 · 동굴 거머리 · 독이끼 덩굴 · 눈먼 동굴어 · 석상 파수꾼,
     던전 「옛 제국의 대저수조」 주인 수문장(수도교 거인). 새 장치 = 물이 찬 스테이지는 걸음이 느리다(FLOOD70 — core.js stepExp · view.js 물 그림).
   · 지하미궁 통로(Lv120 ~ 140): 쥐의 왕관(쥐인간 금고털이 · 두목 쥐 기수) · 붉은 손 형제단(사슬잡이 · 쇠가시 목줄 사냥개 · 두목 붉은 장갑 사냥꾼) ·
     잿빛 장부(짐짝 밀수꾼 · 두목 장부지기 = 통로의 주인) · 암살자 길드의 매연 그림자. 필드 우두머리 = 조직 두목 셋(1-20 · 1-40 · 1-50).
     던전 「암살자 길드 본부」 주인 길드장 검은 두건(진짜) — 패턴 둘(MONS.guildmaster.pat — core.js fPhase):
       1 「그림자 분신」 HP 50%: 매연 그림자 분신 둘을 부르고 등 뒤의 분신이 벨 때마다 따라 벤다(피해 절반)
       2 「독 안개」 HP 25%: 광역기가 독 약병으로 — 맞은 자리마다 독 안개(맹독 · 눈멂)
   · 암살자 길드: 뒷골목 은신처(빌드 51)는 이제 「지부」 — 깨면 「대역이었다」 이야기와 함께 자릿세 절반(flags.guildDown),
     본부를 깨면 자릿세 끝(flags.guildHQ — econ.js rentMul). 지하미궁은 다음 차례(그림 시안부터).
   build.py에서 data-sea69.js 다음 · data-stat69.js 앞 (data-store.js가 새 부속품의 레어도를 보게).
   몬스터 타입 · 속성 · 스킬 목록 · 연타는 여기서 바로 넣는다 (data-elem.js · data-fight.js · data-monup69.js의 몫 — 이 파일은 그 뒤에 읽힌다). */

// ── 부속품
Object.assign(ITEMS, {
  // 옛 제국 수로
  leech_tooth:    { name: '동굴 거머리 이빨판',   v: 880,   w: 1, icon: 'fang',   c: '#e0d0c8' },
  catfish_barbel: { name: '눈먼 메기 수염',       v: 900,   w: 1, icon: 'tail',   c: '#8a9a98' },
  poison_moss:    { name: '독이끼 꽃술',          v: 870,   w: 1, icon: 'flower', c: '#b06ad8' },
  statue_shard:   { name: '옛 석상 조각',         v: 960,   w: 3, icon: 'ore',    c: '#c8b48a' },
  hydra_scale:    { name: '수로 히드라 비늘',     v: 990,   w: 2, icon: 'hide',   c: '#4a8aa8' },
  sluice_key:     { name: '수문장의 청동 열쇠',   v: 24000, w: 2, icon: 'crest',  c: '#5aa890' },
  // 지하미궁 통로
  burglar_tools:  { name: '금고털이 연장',        v: 1120,  w: 2, icon: 'blade',  c: '#b8a060' },
  hunter_chain:   { name: '사슬잡이의 쇠사슬',    v: 1160,  w: 2, icon: 'ore',    c: '#8a8a92' },
  spike_collar:   { name: '쇠가시 목줄',          v: 1180,  w: 1, icon: 'belt',   c: '#5a5a62' },
  contraband:     { name: '밀수품 꾸러미',        v: 1240,  w: 3, icon: 'bag',    c: '#8a6a40' },
  smog_ash:       { name: '누런 매연재',          v: 1300,  w: 1, icon: 'blob',   c: '#9c9068' },
  rat_crown:      { name: '쥐의 왕관',            v: 9000,  w: 2, icon: 'crown',  c: '#e0b040' },
  red_glove:      { name: '붉은 손 두목의 장갑',  v: 9500,  w: 1, icon: 'glove',  c: '#b02a2a' },
  grey_ledger:    { name: '잿빛 장부',            v: 11000, w: 2, icon: 'book',   c: '#7a7a80' },
  guild_seal:     { name: '암살자 길드장의 인장', v: 40000, w: 1, icon: 'ring',   c: '#3a2a34' }
});

// ── 몬스터 (그림 pxaqueduct.js · pxpassage.js)
const ST70 = (k, p, d, m) => Object.assign({ k, p, d }, m ? { m } : {});
// 수로 히드라는 연타 2 (11-18 시험: 3연타면 1-50 주인으로 Lv116 파티가 126초 만에 전멸 — 구름섬의 주인 하늘의 거인과 맞춰 2)
Object.assign(MONS, {
  // 옛 제국 수로 (Lv100 ~ 109) · 옛 제국의 대저수조 (Lv106 ~ 112)
  caveleech:  { name: '동굴 거머리',   plan: 'worm',  body: '#e0d0c8', dark: '#8a7a74', mh: 1.9, ma: 1.6, md: 1.0, spd: 0.9, minS: 1,
    sta: ST70('bleed', 0.3, 6, 0.25), drops: [['leech_tooth', 0.55]] },
  blindfish:  { name: '눈먼 동굴어',   plan: 'flyer', body: '#8a9a98', dark: '#4a5654', mh: 1.7, ma: 1.7, md: 0.9, spd: 1.1, eva: 0.15, magic: 1, minS: 1,
    sta: ST70('chill', 0.25, 5), drops: [['catfish_barbel', 0.55]] },
  poisonvine: { name: '독이끼 덩굴',   plan: 'tree',  body: '#4a6a3a', dark: '#24361c', leaf: '#b06ad8', mh: 2.2, ma: 1.7, md: 1.4, spd: 0.7, minS: 2,
    sta: ST70('poison', 0.35, 8, 0.3), drops: [['poison_moss', 0.5]] },
  aqsentinel: { name: '석상 파수꾼',   plan: 'golem', body: '#c8b48a', dark: '#7a6a4a', core: '#5aa890', mh: 3.6, ma: 1.9, md: 2.6, spd: 0.55, minS: 4,
    sta: ST70('stun', 0.18, 1.5), drops: [['statue_shard', 0.45]] },
  aqhydra:    { name: '수로 히드라',   plan: 'worm',  body: '#4a8aa8', dark: '#22465a', mh: 3.2, ma: 2.1, md: 1.6, spd: 0.9, minS: 6, hits: 2,
    sta: ST70('bleed', 0.25, 6, 0.25), drops: [['hydra_scale', 0.5]] },
  sluicewarden: { name: '수문장', plan: 'giant', body: '#c8b48a', dark: '#6a5a3e', boss: 1, scale: 2, mh: 10, ma: 2.8, md: 2.6, spd: 0.8, aoe: 1,
    sta: ST70('stun', 0.3, 1.5), sta2: ST70('chill', 0.3, 5), drops: [['sluice_key', 1], ['statue_shard', 1, 3]] },
  // 지하미궁 통로 (Lv120 ~ 139) · 암살자 길드 본부 (Lv136 ~ 142)
  ratburglar: { name: '쥐인간 금고털이', plan: 'biped', body: '#7a6a5a', dark: '#4a3e34', skin: '#8a7a6a', mh: 2.0, ma: 2.1, md: 1.1, spd: 1.3, eva: 0.2, minS: 1, hits: 2,
    sta: ST70('stun', 0.12, 1.2), drops: [['burglar_tools', 0.5]] },
  huntdog:    { name: '형제단 사냥개',   plan: 'quad',  body: '#3a3434', dark: '#1c1818', mh: 2.2, ma: 2.2, md: 1.2, spd: 1.5, eva: 0.12, minS: 1, hits: 2,
    sta: ST70('bleed', 0.25, 6, 0.25), drops: [['spike_collar', 0.5]] },
  manhunter:  { name: '사슬잡이',        plan: 'biped', body: '#5a4a3e', dark: '#2e241e', skin: '#c89070', mh: 2.8, ma: 2.2, md: 1.8, spd: 0.95, minS: 3,
    sta: ST70('para', 0.2, 2), drops: [['hunter_chain', 0.45]] },
  smuggler:   { name: '짐짝 밀수꾼',     plan: 'biped', body: '#6a5a44', dark: '#3a3024', skin: '#c89a78', mh: 2.4, ma: 2.0, md: 1.6, spd: 1.0, minS: 5,
    sta: ST70('blind', 0.15, 3), drops: [['contraband', 0.45]] },
  shadeclone: { name: '매연 그림자',     plan: 'ghost', body: '#7a6e4e', dark: '#2a261a', skin: '#ff6a2a', mh: 1.8, ma: 2.4, md: 0.9, spd: 1.3, eva: 0.25, minS: 7,
    sta: ST70('blind', 0.25, 4), drops: [['smog_ash', 0.5]] },
  ratcrown:   { name: '쥐의 왕관 두목',  plan: 'biped', body: '#7a6a5a', dark: '#4a3e34', skin: '#8a7a6a', fb: 2, scale: 2, mh: 3.6, ma: 2.4, md: 1.8, spd: 1.2, eva: 0.12, hits: 2,
    sta: ST70('bleed', 0.25, 6, 0.25), sta2: ST70('poison', 0.2, 8, 0.2), drops: [['rat_crown', 0.8], ['burglar_tools', 1, 2]] },
  redhand:    { name: '붉은 손 두목',    plan: 'biped', body: '#6a2a24', dark: '#341210', skin: '#c89070', fb: 4, scale: 2, mh: 4.0, ma: 2.6, md: 2.0, spd: 1.0,
    sta: ST70('stun', 0.2, 1.5), sta2: ST70('bleed', 0.25, 6, 0.25), drops: [['red_glove', 0.8], ['hunter_chain', 1, 2]] },
  greyledger: { name: '잿빛 장부 두목',  plan: 'biped', body: '#6a6a70', dark: '#34343a', skin: '#e0c0a0', fb: 5, scale: 3, mh: 4.6, ma: 2.7, md: 2.2, spd: 1.0, eva: 0.1, magic: 1, aoe: 1,
    sta: ST70('curse', 0.25, 8), sta2: ST70('blind', 0.2, 4), drops: [['grey_ledger', 0.8], ['contraband', 1, 2]] },
  guildmaster: { name: '길드장 검은 두건', plan: 'biped', body: '#1c1a22', dark: '#0c0a10', skin: '#c68a5e', boss: 1, scale: 2, mh: 12, ma: 3.1, md: 2.4, spd: 1.1, eva: 0.2, aoe: 1, hits: 2,
    sta: ST70('bleed', 0.35, 6, 0.3), sta2: ST70('venom', 0.25, 8, 0.12), drops: [['guild_seal', 1], ['smog_ash', 1, 3]] }
});
// 타입 · 속성 · 날아다님 (data-elem.js MON_TAG · data-fight.js FLY의 몫)
const TAG70 = {
  caveleech: 'monster|water', blindfish: 'beast|water', poisonvine: 'plant|', aqsentinel: 'construct|earth', aqhydra: 'dragon monster|water', sluicewarden: 'construct kaiju|water earth',
  ratburglar: 'monster|', huntdog: 'beast|', manhunter: 'human|', smuggler: 'human|', shadeclone: 'elemental|dark',
  ratcrown: 'monster beast|', redhand: 'human|', greyledger: 'human|', guildmaster: 'human|dark'
};
Object.entries(TAG70).forEach(([id, t]) => { const [ty, el] = t.split('|'); MONS[id].ty = ty.split(' ').filter(Boolean); MONS[id].el = el ? el.split(' ').filter(Boolean) : []; });
['blindfish', 'shadeclone'].forEach(id => { MONS[id].fly = 1; if (!FLY.includes(id)) FLY.push(id); });   // 물속을 헤엄치는 동굴어 · 떠다니는 매연

// 몬스터 스킬 (틀 data-fight.js MSK + data-monup69.js 새 틀) — 일반 2 · 3개, 우두머리 · 던전 주인 4개
Object.assign(MON_SK, {
  caveleech:  [['drain', '피 빨기'], ['lowhit', '약한 피 노리기', { mult: 1.3 }]],
  blindfish:  [['bolt', '물대포'], ['blind', '흙탕물 뿌리기']],
  poisonvine: [['miasma', '독 꽃가루', { mult: 0.3 }], ['para', '마비 가시']],
  aqsentinel: [['taunt', '돌의 위압'], ['quake', '기둥 내려찍기', { mult: 0.6 }]],
  aqhydra:    [['bite', '세 머리 물기'], ['breath', '물기둥', { mult: 0.6 }], ['regen', '머리 다시 돋기', { pct: 0.1 }]],
  sluicewarden: [['quake', '수도교 무너뜨리기', { mult: 0.8 }], ['sweep', '수문 휩쓸기'], ['guard', '돌 아치'], ['shield', '물의 장막']],
  ratburglar: [['hit', '쇠지레 내려치기', { mult: 1.7, sta: ST70('stun', 0.3, 1.2) }], ['haste', '날쌘 발']],
  huntdog:    [['bite', '목덜미 물기'], ['howl', '사냥개 울음']],
  manhunter:  [['para', '사슬 감기', { mult: 1.3 }], ['hit', '쇠공 휘두르기', { mult: 1.9 }]],
  smuggler:   [['acid', '밀수 독약 병'], ['guard', '짐짝 방패']],
  shadeclone: [['stab', '매연 찌르기'], ['blind', '매연 뿜기']],
  ratcrown:   [['howl', '쥐 떼 호령'], ['summon', '쥐 떼 부르기', { mon: ['ratburglar'], n: 1 }], ['pierce', '왕홀 창 찌르기'], ['lowhit', '약한 자 갉기']],
  redhand:    [['gore', '갈래창 붙잡기', { sta: ST70('stun', 0.5, 2) }], ['lowhit', '약한 사냥감 노리기'], ['rage', '사냥꾼의 피'], ['para', '사슬 던지기']],
  greyledger: [['mpburn', '빚 독촉'], ['dispel', '장부에서 지우기'], ['shield', '금화 방벽'], ['flash', '등불 비추기']],
  guildmaster: [['stab', '그림자 찌르기', { mult: 2.2 }], ['venom', '독 바른 투척 단검'], ['blind', '연막탄', { sta: ST70('blind', 0.9, 5) }], ['dispel', '그림자 장막', { magic: 0, el: null }]]
});
Object.keys(TAG70).forEach(id => {
  MONS[id].msk = (MON_SK[id] || []).map(([tpl, name, o], i) => {
    const s = Object.assign({}, MSK[tpl], o || {}, { id: tpl + i, tpl, name: name || MSK[tpl].name });
    if (s.el === 'self') { s.el = null; s.self = 1; }
    return s;
  });
});

// 길드장 패턴 (11-18 09:05 「B, C는 패턴으로 승화」): HP 50% · 25% 단계에서 그 패턴 — 그림은 PXU.guildmaster.low(pxpassage.js)
// 세기 (11-18 시험 scratchpad v91 sim4 · var2 — Lv142 3차 넷, 스킬 3단계 · 숙련도 3 · 희귀 장비, 1-50부터): 무너진 천계의 성소(주인 Lv142)는 3/3, 이 본부는 2/3 —
//   성소보다 한 걸음 어렵게 (처음 값 공격 3.3 · 따라 베기 50% · 맹독 75%는 1/3)
MONS.guildmaster.pat = {
  1: { name: '그림자 분신', sum: ['shadeclone', 2], echo: 0.4, desc: '매연 그림자 분신 둘을 부르고, 등 뒤에 붙은 분신이 벨 때마다 한 번 더 따라 벤다(피해 40%)' },
  2: { name: '독 안개', gas: { mult: 0.5, sta: ST70('venom', 0.6, 10, 0.12), sta2: ST70('blind', 0.6, 5) }, desc: '광역기가 독 약병으로 — 맞은 자리마다 초록 독 안개(맹독 60% · 눈멂 60%)' }
};

// ── 땅
FIELDS.aqueduct = {
  no: 19, name: '옛 제국 수로', lv: 100, span: 10, bg: 'aqueduct', tier: 12, after: 'sewer', under: 1, parts: 1, flood: 1,
  unlock: '지하수로 깊은 곳(하수도 트롤)을 공략하면 열려요',
  desc: '하수도 밑으로 이어지는 옛 제국의 돌 수로. 무너진 아치와 녹청 낀 청동 사이로 물이 차오르고, 빛을 못 본 거머리와 눈먼 메기가 산다. 물이 찬 스테이지(3 스테이지마다)는 걸음이 느리다. 대저수조 끝에는 수도교를 몸으로 삼은 수문장이 있다.',
  mons: ['caveleech', 'blindfish', 'poisonvine', 'aqsentinel', 'aqhydra'],
  bosses: ['blindfish', 'caveleech', 'poisonvine', 'aqsentinel', 'aqhydra'],
  dungeon: { name: '옛 제국의 대저수조', bg: 'cistern', mons: ['aqhydra', 'aqsentinel', 'caveleech', 'blindfish'], boss: 'sluicewarden' },
  herbs: ['waterherb', 'ethermoss', 'bloodshroom'],
  next: 'passage'
};
FIELDS.passage = {
  no: 20, name: '지하미궁 통로', lv: 120, span: 20, bg: 'passage', tier: 13, after: 'aqueduct', under: 1, parts: 1,
  unlock: '옛 제국의 대저수조를 공략하면 열려요',
  desc: '지하미궁으로 내려가는 통로. 쥐의 왕관 · 붉은 손 형제단 · 잿빛 장부, 라비린토스 지하의 범죄 조직 셋이 길목마다 진을 쳤다. 조직 두목은 20 · 40 · 50 스테이지의 우두머리. 통로 끝에는 암살자 길드의 진짜 본부가 있다.',
  mons: ['ratburglar', 'huntdog', 'manhunter', 'smuggler', 'shadeclone'],
  bosses: ['ratburglar', 'ratcrown', 'manhunter', 'redhand', 'greyledger'],
  dungeon: { name: '암살자 길드 본부', bg: 'guildhq', mons: ['shadeclone', 'manhunter', 'smuggler', 'huntdog'], boss: 'guildmaster', guards: ['officer', 'officer'] },
  herbs: ['bloodshroom', 'mandrake', 'herb'],
  next: null
};
FIELDS.sewer.next = 'aqueduct';
const UNDER70_IDS = ['aqueduct', 'passage'];
UNDER70_IDS.forEach(f => { if (!ALL_FIELDS.includes(f)) ALL_FIELDS.push(f); });
Object.assign(CLIMATE, { aqueduct: { indoor: 1 }, passage: { indoor: 1 } });   // 땅 밑이라 날씨가 없다

// 물이 찬 스테이지 (계획 문서 「3구역 새 장치」): 3 스테이지마다(던전은 3층) 걸음 ×0.7 — 물 그림은 under70.js
const FLOOD70 = { every: 3, mul: 0.7 };
const floodOn = e => !!(e && FIELDS[e.field] && FIELDS[e.field].flood && (e.area === 'field' || e.area === 'dungeon') && e.stage % FLOOD70.every === 0);
const floodMul = e => (floodOn(e) ? FLOOD70.mul : 1);

// 유물 · 왕국이 사는 부속품
Object.assign(RELICS, {
  aqueduct: { name: '옛 제국의 샘물 항아리', desc: '물약 회복량 +15%',     potion: 0.15 },
  passage:  { name: '길드장의 금고 열쇠',     desc: '상점 판매 가격 +5%',   price: 0.05 }
});
const relicFields = () => TIER_FIELDS.concat(ALL_FIELDS.filter(f => RELICS[f] && !TIER_FIELDS.includes(f)));   // 유물 창 · 개수 (장비 단계가 없는 땅의 유물도)
KINGDOMS.inglisia.wants.push('statue_shard', 'hunter_chain');
KINGDOMS.frama.wants.push('catfish_barbel', 'contraband');
KINGDOMS.elves.wants.push('poison_moss', 'smog_ash');
KINGDOMS.dwarves.wants.push('hydra_scale', 'spike_collar');
KINGDOMS.sarak.wants.push('leech_tooth', 'burglar_tools');

// ── 이야기
STORY.guild = [   // 빌드 70: 뒷골목 은신처는 지부였다 (계획 문서 「암살자 길드」)
  '검은 두건이 무릎을 꿇었다. 그런데 두건을 벗기자 낯선 얼굴이 나왔다. 길드장의 대역이었다.',
  '은신처는 길드의 지부였을 뿐이다. 지부가 무너져 오물거리의 자릿세는 절반으로 줄었다. 거리에 사람이 늘고, 상점 손님도 많아졌다.',
  '대역의 품에서 쪽지가 나왔다. 「본부는 수로 밑, 미궁으로 내려가는 길목에.」 진짜 검은 두건은 라비린토스 지하 깊은 곳에 있다. 길드 장부 마지막 장에는 마왕을 섬기는 교단의 표식이 찍혀 있었다.'
];
STORY.aqueduct = [
  '수도교 거인이 무너지자 대저수조의 물이 빠지며 바닥에 옛 제국의 글이 드러났다. 「이 아래 짐승을 가둔다. 미궁의 문을 열지 말라.」',
  '물이 빠진 계단 아래로 횃불이 보인다. 쥐의 왕관 · 붉은 손 형제단 · 잿빛 장부, 라비린토스 지하의 범죄 조직 셋이 미궁으로 내려가는 통로를 막고 있다.',
  '지하미궁 통로(Lv120 ~ 140)가 열렸다.'
];
STORY.passage = [
  '검은 두건이 독 안개 속에서 무릎을 꿇었다. 이번에는 대역이 아니다. 두건 아래에 길드장의 얼굴이 있었다.',
  '암살자 길드 본부가 무너졌다. 이제 오물거리에 자릿세는 없다. 7번가가 들썩였다.',
  '길드장의 금고에는 마왕 교단의 편지가 있었다. 「봉인을 풀 열쇠는 미궁의 바닥에.」 본부 바로 아래, 옛 제국이 미노타우로스를 가둔 지하미궁의 문이 있다. 미궁은 다음 이야기에서 열린다.'
];
STORY.guildHalf = [   // 옛 저장: 뒷골목을 이미 토벌한 상단 (notes70)
  '지하수로에서 소문이 올라왔다. 뒷골목에서 쓰러뜨린 검은 두건은 길드장의 대역이었고, 은신처는 지부였다고.',
  '암살자 길드가 다시 자릿세를 걷으러 왔다. 다만 지부가 무너진 뒤라 예전의 절반만 걷는다.',
  '진짜 본부는 라비린토스 지하 깊은 곳, 지하미궁 통로(Lv120 ~ 140) 끝에 있다. 본부를 토벌해야 자릿세가 끝난다.'
];
STORY.v70 = [
  '라비린토스 지하가 깊어졌다. 지하수로 깊은 곳(하수도 트롤)을 공략하면 3구역 「옛 제국 수로」(Lv100)가 열린다. 물이 찬 스테이지(3 스테이지마다)는 걸음이 느리다. 던전은 「옛 제국의 대저수조」.',
  '대저수조를 공략하면 「지하미궁 통로」(Lv120 ~ 140). 쥐의 왕관 · 붉은 손 형제단 · 잿빛 장부, 범죄 조직 셋의 두목이 20 · 40 · 50 스테이지의 우두머리다. 통로 끝에 「암살자 길드 본부」가 있다.',
  '암살자 길드: 뒷골목 은신처는 이제 길드의 지부다. 지부를 깨면 자릿세가 절반이 되고, 지하미궁 통로의 길드 본부를 깨야 자릿세가 끝난다. 본부의 길드장은 HP 50%에서 「그림자 분신」, 25%에서 「독 안개」 패턴을 쓴다.',
  '새 그림: 천계의 유적 폐허 · 별의 정원 · 보물 던전 몬스터 16, 레이드 거인 셋(카이샤르 · 템페스트 드래곤 · 베히모스), 새끼 펫 · 말이 새로 그려졌다.'
];
