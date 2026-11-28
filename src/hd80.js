// 빌드 80 (11-29 대표님 「마법사 완성하고 모험가 다 넣고」): 1차 여섯 직업 픽셀랩 동작을 게임에 — 자료는 data-hd80.js (tools/saved/anim80/export80.py)
//   · hd70.js의 리마스터 길(HD_ADV_ON · hdWarSpr · hdMotT)을 그대로 쓰고, 자료(HD70_DATA.war · adv)와 직업마다 줄 표(HDCFG)만 바꿔 끼운다
//   · 스킬마다 고른 동작 줄 (HDC.sk — 스킬 id → 줄). 표에 없는 스킬 · 기본 공격은 def 줄, 막기 · 치켜들기 같은 엔진 동작은 of 줄
//   · 장 수가 줄마다 다르다(16 ~ 40장): 맞히는(쏘는) 장 hit까지는 초에 HD80_FPS장 · HD80_PRE초까지, 그 뒤는 HD80_POST초까지 (빠르면 장을 건너뛴다)
const HD_WORK_OLD = false;   // 짐꾼 작업 자세(data-porterwork.js — 예전 GPT 짐꾼 그림)는 픽셀랩 짐꾼과 생김새가 달라 끈다
const HD80_FPS = 24, HD80_PRE = 0.8, HD80_POST = 0.9, HD80_TIME = 1.7;
const HD80_CFG = {
  warrior: { id: 'W', def: 'slash', time: ['taunt', 'brace', 'resolve', 'warcry'],
    sk: { bash: 'downcut', taunt: 'taunt', ironwall: 'brace', sweep: 'sweep', berserk: 'warcry', earthsplit: 'earth', warcry: 'warcry', titanblow: 'leap', resolve: 'resolve', riposte: 'counter', shockwave: 'quake' },
    of: { block: 'block', parry: 'block', guard: 'brace', ready: 'counter', raise: 'resolve', salute: 'resolve', taunt: 'taunt' } },
  archer: { id: 'A', def: 'shoot', time: ['buff'],
    sk: { aimed: 'power', double: 'quick', poisonarrow: 'mana', rain: 'sky', piercing: 'power', tripleshot: 'triple', stormarrows: 'sky', flasharrow: 'mana' } },
  porter: { id: 'T', def: 'shoot', time: ['shout', 'canteen', 'lighten'],
    sk: { throwjunk: 'throw', shout: 'shout', shieldbag: 'lighten', avalanche: 'avalanche', shockwave: 'quake', medkit: 'canteen', rations: 'shout' } },
  rogue: { id: 'R', def: 'stab', time: ['smoke'],
    sk: { backstab: 'sidestab', smoke: 'smoke', venom: 'backhand', shadow: 'footwork', deadlyvenom: 'backhand', blades: 'footwork', parasting: 'needle', riposte: 'counter', voltstab: 'thunder' } },
  cleric: { id: 'P', def: 'attack', time: ['heal', 'firstaid', 'cure', 'bless', 'sanctuary', 'massheal', 'greatheal'],
    sk: { heal: 'heal', bless: 'bless', massheal: 'massheal', holy: 'holy', firstaid: 'firstaid', sanctuary: 'sanctuary', greatheal: 'greatheal', smite: 'holy', revival: 'massheal', cure: 'cure', weaken: 'weaken', chant: 'massheal', holyhammer: 'holyhammer' } },
  mage: { id: 'M', def: 'attack', time: ['manashield'],
    sk: { fireball: 'fireball', icelance: 'icelance', chain: 'chain', burst: 'burst', meteor: 'meteor', manashield: 'manashield', blizzard: 'iceprison', iceprison: 'iceprison', weaken: 'weaken', thunderclap: 'thunderclap' } }
};
const HD80_LOOP = { idle: 1, walk: 1, run: 1, sit: 1, sleep: 1, sleep_2: 1, sleep_3: 1 };
function hd80Mot(m, time) {   // 줄 하나 → { H 맞히는 장, T 엔진 여덟 장마다 초 } (time: 맞히는 때가 없는 동작 — 걸리는 시간에 고르게)
  const n = m.n, h = Math.max(1, Math.min(n - 2, m.hit));
  if (time) { const tt = Math.min(HD80_TIME, n / 22); return { time: 1, H: h, T: Array(8).fill(tt / 8) }; }
  const pre = Math.min(HD80_PRE, h / HD80_FPS), post = Math.min(HD80_POST, (n - h) / HD80_FPS);
  return { H: h, T: [0, 0, 0, 0].map(() => pre / 4).concat([0, 0, 0, 0].map(() => post / 4)) };
}
if (typeof HD80_ADV !== 'undefined') {
  HD70_DATA.war = HD80_ADV.warrior;
  HD70_DATA.adv = {}; for (const c in HD80_ADV) if (c !== 'warrior') HD70_DATA.adv[c] = HD80_ADV[c];
  for (const c in HD80_CFG) {
    const C = HD80_CFG[c], R = HD80_ADV[c].rows, mot = {}, shadow = {}, seq = { front: ['idle', null] };
    for (const rn in R) { if (!HD80_LOOP[rn]) { mot[rn] = hd80Mot(R[rn], C.time.includes(rn)); shadow[rn] = 1; } }
    if (R.block) mot.block = { H: Math.min(R.block.hit, 6), T: [0.05, 0.05, 0.05, 0.05, 0.12, 0.12, 0.1, 0.1] };   // 막기: 맞는 때(HDW_BLOCK_PRE 0.2초 뒤)에 방패가 올라와 있다
    for (const k of ['sit', 'sleep', 'sleep_2', 'sleep_3']) if (R[k]) seq[k] = [k, [R[k].n - 1]];   // 앉기 · 자기 줄은 앉는(눕는) 동작이라 다 앉은(누운) 마지막 장으로
    if (!R.run) seq.run = ['walk', null];
    const buff = C.time[0], of = Object.assign({ raise: buff, guard: buff, salute: buff, taunt: buff, parry: buff, ready: buff, block: buff, sraise: C.def, braise: buff }, C.of || {});
    HDCFG[c] = { id: C.id + '8', seq, mot, of, def: C.def, shadow, sk: C.sk };
  }
  HDC = HDCFG.warrior;
}

hdLoad();   // hd70.js에 있던 것 — 자료를 바꿔 끼운 뒤에 판을 푼다
