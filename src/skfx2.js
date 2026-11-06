/* ───────── 스킬 효과 2 (빌드 42): 전사 계열이 아닌 모든 스킬 ─────────
   동작은 무기 갈래마다(view.js motFam: 활·창·지팡이·단검·둔기·류트), 효과는 빌드 41과 같은 네 단계(모으기 → 쏘기·휘두르기 → 맞히기 → 남은 것).
   새로 더한 것: 날아가는 것 proj(arrow 빛 화살 · orb 빛 구슬 · shard 얼음 가시 · note 음표 · flask 병 · dart 침 · junk 짐 · beam 빛줄기)
     맞히기 hit(rain 화살비 · burst 폭발 · shatter 얼음 깨짐 · bolt 벼락 · meteor 운석 · vortex 소용돌이 · notes 음표 · slashes 난도질 · claw 발톱 · trap 덫 · poison 독 · coins 금화 · flash 섬광 · mark 표식)
     남은 것 after(bubbles 거품 · smoke 연기 · sparks 불꽃 튐 · feathers 깃털 · petals 꽃잎) · 강화 cast(song 노래 · smoke 연막 · aim 조준 · holy 빛 내림 · circle 마법진 · mana 마력 · revive 되살림 · speed 질주 · potion 물약)
   표는 스킬 자료(종류·속성·대상·횟수)에서 만들고(skAuto), 대표 스킬은 손으로 고친다(SKFX2_OVR). */
Object.assign(SK_PAL, {
  poison: ['#f0ffd0', '#b8f06a', '#6ac83a', '#2a7a2a'],
  dark:   ['#f0e0ff', '#c89aff', '#8a4ad8', '#4a2280'],
  shadow: ['#ffffff', '#c8c0e0', '#7a6aa8', '#3a3058'],
  water:  ['#ffffff', '#b8e8ff', '#4aa8ff', '#2a5ac0'],
  nature: ['#f4ffe0', '#c8f08a', '#7ac84a', '#3a8a3a'],
  music:  ['#ffffff', '#fff0a8', '#ff9ac8', '#c85a9a'],
  smoke:  ['#f0f0f0', '#c8c8c8', '#9a9aa0', '#5a5a64'],
  light:  ['#ffffff', '#fffbe0', '#fff0a0', '#e8c860'],
  evil:   ['#ffd8e8', '#ff7aa8', '#c03a6a', '#5a1030'],
  coin:   ['#ffffff', '#fff0a0', '#f2c444', '#a8742a']
});
const SK_PROJ_T = { arrow: 0.18, orb: 0.26, shard: 0.22, note: 0.26, flask: 0.32, dart: 0.14, junk: 0.34, beam: 0.08 };   // 날아가는 초
const SK_PRE = { rain: 0.24, meteor: 0.32, bolt: 0.07, mark: 0.2, slashes: 0.05, claw: 0.06 };   // 맞기 전에 하늘에서 내려오는 초

// 스킬 자료 → 효과 표 한 줄
function skAuto(id, s) {
  const cls = (s.cls || ['warrior'])[0], fam = cls === 'all' ? 'all' : jobBase(cls), el = s.el || '', fx = s.fx || '';
  const atk = s.kind === 'dmg' || s.kind === 'mdmg' || s.kind === 'dot', lv = s.lv || 1, awk = /^awk2?_/.test(id), awk2 = /^awk2_/.test(id);
  const elPal = { fire: 'fire', blaze: 'fire', ice: 'ice', water: 'water', thunder: 'bolt', storm: 'bolt', light: 'light', holy: 'holy', dark: 'dark', evil: 'evil', wind: 'wind', earth: 'earth', steel: 'steel' }[el];
  const fxPal = { fire: 'fire', ice: 'ice', bolt: 'bolt', holy: 'holy', dark: 'dark', wind: 'wind', spell: 'arcane', jump: 'steel', pet: 'earth' }[fx];
  const famPal = { archer: 'wind', rogue: 'shadow', porter: 'earth', cleric: 'holy', mage: 'arcane', warrior: 'power', all: 'gold' }[fam] || 'gold';
  const out = { pal: elPal || fxPal || (s.kind === 'dot' && !s.magic ? 'poison' : famPal), auto: 1 };
  const hold = awk2 ? 0.45 : awk ? 0.35 : lv <= 15 ? 0.1 : lv <= 40 ? 0.14 : lv <= 70 ? 0.2 : 0.26;
  if (atk) {
    const arrow = fx === 'arrow', magic = s.kind === 'mdmg' || (s.kind === 'dot' && s.magic) || ['fire', 'ice', 'bolt', 'holy', 'dark', 'spell'].includes(fx), all = s.tgt === 'all', hits = s.hits || 1;
    const ctl = !!(s.sta || s.slow || s.stun), trap = /trap|snare|net/.test(id), pet = fx === 'pet' || /wolf|hound/.test(id);
    out.hold = hold; out.charge = awk ? 'aura' : magic ? 'gather' : 'glow';
    out.trail = arrow ? 1 : magic ? 1 : awk ? 3 : 2;
    // 동작 (역할로 고르면 무기 갈래가 바꾼다)
    out.mot = fx === 'jump' ? 'pjump' : hits >= 3 ? (arrow ? 'brapid' : magic ? 'spush' : 'hack') : hits === 2 ? (arrow ? 'brapid' : magic ? ['spush', 'sjab'] : ['down', 'up'])
      : all ? (arrow ? 'bdiag' : magic ? 'scharge' : 'side') : ctl || s.crit ? (arrow ? 'bfull' : magic ? 'spushup' : 'thrust') : arrow ? 'bshot' : magic ? 'spush' : 'down';
    // 맞히기
    const pierce = /pierce|headshot|harpoon|longshot|farsight|heart|deadeye|throat|backstab|assassin|stab/.test(id);
    out.hit = trap ? 'trap' : pet ? 'claw' : fx === 'jump' ? 'quake' : arrow ? (all ? 'rain' : pierce ? 'pierce' : ctl ? 'stun' : 'star')
      : fx === 'fire' || el === 'fire' || el === 'blaze' ? (/meteor|awk_mage|awk2_mage|mirage|genesis|magnum/.test(id) ? 'meteor' : 'burst')
      : fx === 'ice' || el === 'ice' || el === 'water' ? 'shatter' : fx === 'bolt' || el === 'thunder' || el === 'storm' ? 'bolt'
      : fx === 'holy' || el === 'holy' || el === 'light' ? (all ? 'pillar' : 'cross') : fx === 'dark' || el === 'dark' || el === 'evil' ? 'vortex'
      : fx === 'wind' || el === 'wind' ? 'vortex' : s.kind === 'dot' ? 'poison' : magic ? 'star' : hits >= 3 ? 'slashes' : pierce ? 'pierce' : ctl ? 'stun' : 'star';
    // 날아가는 것
    out.proj = out.hit === 'rain' || out.hit === 'meteor' || out.hit === 'bolt' || out.hit === 'pillar' || out.hit === 'quake' || out.hit === 'trap' || out.hit === 'claw' ? null
      : arrow ? 'arrow' : fx === 'note' ? 'note' : out.hit === 'shatter' ? 'shard' : magic ? (out.hit === 'cross' ? 'beam' : 'orb') : null;
    out.after = out.hit === 'burst' || out.hit === 'meteor' ? 'embers' : out.hit === 'shatter' ? 'shards' : out.hit === 'cross' || out.hit === 'pillar' ? 'motes'
      : out.hit === 'vortex' ? (out.pal === 'wind' ? 'feathers' : 'motes') : out.hit === 'quake' ? 'dust' : out.hit === 'poison' ? 'bubbles' : out.hit === 'bolt' ? 'sparks' : null;
    out.big = awk2 ? 2 : awk || (all && lv >= 60) ? 1 : 0;
    if (hits > 1) { out.lastBig = out.big + 1; delete out.big; }
    out.shake = awk2 ? 5 : awk ? 4 : out.hit === 'meteor' ? 3 : out.hit === 'quake' || (all && lv >= 60) ? 2 : 0;
    if (!out.shake) delete out.shake;
  } else {
    const st = s.stat || '', party = s.tgt === 'party';
    out.mot = 'raise'; out.hold = Math.min(0.3, hold);
    if (s.kind === 'heal' || s.kind === 'regen') { out.cast = 'heal'; out.pal = fam === 'porter' && /hymn|overture|song/.test(id) ? 'music' : 'heal'; out.big = party ? 1 : 0; }
    else if (s.kind === 'revive') { out.cast = 'revive'; out.pal = 'holy'; }
    else if (s.kind === 'cure') { out.cast = 'cure'; out.pal = 'heal'; }
    else if (s.kind === 'shield') { out.cast = 'dome'; out.pal = fam === 'cleric' ? 'holy' : fam === 'mage' ? 'arcane' : 'guard'; }
    else if (s.kind === 'taunt') { out.mot = 'taunt'; out.cast = 'taunt'; out.pal = 'taunt'; }
    else if (st === 'def' || st === 'guard' || st === 'block') { out.mot = 'guard'; out.cast = fam === 'cleric' ? 'circle' : fam === 'mage' ? (id === 'bonewall' ? 'barrier' : 'circle') : 'barrier'; out.pal = id === 'bonewall' ? 'smoke' : fam === 'cleric' ? 'holy' : fam === 'mage' ? 'earth' : 'guard'; }
    else if (st === 'eva') { out.cast = fam === 'rogue' ? 'smoke' : fam === 'archer' && /camo/.test(id) ? 'smoke' : 'speed'; out.pal = fam === 'rogue' ? 'smoke' : fam === 'archer' ? 'nature' : 'wind'; }
    else if (st === 'rheal') { out.cast = 'holy'; out.pal = 'heal'; }
    else if (st === 'crit' || /aim|spot/.test(id)) { out.cast = 'aim'; out.pal = 'gold'; }
    else if (st === 'matk') { out.cast = 'mana'; out.pal = 'arcane'; }
    else if (st === 'cdr' || st === 'spd') { out.cast = 'speed'; out.pal = 'wind'; }
    else { out.cast = fam === 'porter' && /song|ballad|symph|finale|march|war/.test(id) ? 'song' : fam === 'cleric' ? 'holy' : 'shout'; out.pal = out.cast === 'song' ? 'music' : fam === 'cleric' ? 'holy' : 'war'; }
    if (fam === 'porter' && ['bard', 'maestro'].includes(cls) && !['taunt'].includes(out.cast)) { if (out.cast === 'shout' || out.cast === 'speed') out.cast = 'song'; out.pal = out.pal === 'heal' ? 'heal' : 'music'; }
    if (party) out.party = 1;
    if (awk) { out.big = 1; out.hold = 0.3; }
  }
  return out;
}
// 손으로 고친 대표 스킬 (skAuto 위에 덮는다)
const SKFX2_OVR = {
  // 궁수
  aimed: { mot: 'bfull', hit: 'pierce', charge: 'glow' }, double: { mot: 'brapid' }, tripleshot: { mot: 'brapid', hit: 'star', lastBig: 1 },
  rain: { mot: 'bdiag', hit: 'rain' }, piercing: { mot: 'bfull', hit: 'pierce', proj: 'beam', all: 1 }, flasharrow: { hit: 'flash', after: 'sparks' },
  stormarrows: { mot: 'bdiag', hit: 'rain', pal: 'wind', after: 'feathers' }, el_arrow: { mot: 'bfull', pal: 'ice', hit: 'shatter', proj: 'arrow', after: 'shards' },
  poisonarrow: { mot: 'bshot', pal: 'poison', hit: 'poison', proj: 'arrow', after: 'bubbles' },
  awk_archer: { mot: 'bdiag', hold: 0.35, pal: 'star', charge: 'aura', hit: 'rain', big: 1, after: 'motes', shake: 4 },
  awk2_archer: { mot: 'bdiag', hold: 0.45, pal: 'light', charge: 'aura', hit: 'rain', big: 2, after: 'motes', shake: 5 },
  beastshot: { mot: 'brapid', hit: 'star' }, trap: { mot: 'bshot', hit: 'trap', proj: null, pal: 'earth' }, wolfcall: { mot: 'braise', hit: 'claw', pal: 'earth' },
  arrowstorm: { mot: 'bdiag', hit: 'rain', big: 1, shake: 2 }, headshot: { mot: 'bfull', hit: 'mark', after: 'sparks', shake: 2 }, longshot: { mot: 'bfull', hit: 'pierce' },
  piercearrow: { mot: 'bfull', hit: 'pierce', pal: 'steel' }, divinearrow: { mot: 'bfull', pal: 'light', hit: 'cross', proj: 'arrow' }, starfall: { mot: 'bdiag', pal: 'star', hit: 'rain', after: 'motes' },
  lastarrow: { mot: 'bfull', hold: 0.3, pal: 'holy', charge: 'aura', hit: 'pillar', proj: 'arrow', big: 1, shake: 3 }, dragonpierce: { mot: 'bfull', pal: 'fire', hit: 'pierce', after: 'embers' },
  slayrain: { mot: 'bdiag', pal: 'fire', hit: 'rain', after: 'embers' }, dragonheart: { mot: 'bfull', pal: 'blood', hit: 'pierce', shake: 2 },
  trackshot: { mot: 'bshot', hit: 'mark' }, snaretrap: { hit: 'trap' }, houndpack: { mot: 'braise', hit: 'claw', pal: 'earth' }, driveshot: { mot: 'brapid', hit: 'star' },
  giantslayer: { mot: 'bfull', hold: 0.26, pal: 'war', hit: 'pierce', big: 1, shake: 3 }, harpoon: { mot: 'bfull', pal: 'steel', hit: 'pierce', proj: 'arrow' },
  quaketrap: { mot: 'bswing', pal: 'earth', hit: 'quake', after: 'dust', shake: 3 }, titanfall: { mot: 'bdiag', hold: 0.3, pal: 'war', hit: 'meteor', proj: null, big: 1, shake: 4 },
  huntmark: { hit: 'mark' }, trapnet: { hit: 'trap' }, biggame: { mot: 'bfull', hit: 'pierce', big: 1, shake: 2 }, volleytrap: { mot: 'brapid', hit: 'trap' },
  ambush: { mot: 'bfull', hit: 'stun' }, volley: { mot: 'brapid' }, farsight: { mot: 'bfull', hit: 'mark' }, summit: { mot: 'bdiag', hit: 'rain' },
  // 용기병
  jump: { mot: 'pjump', pal: 'steel', hit: 'quake', after: 'dust' }, skyfall: { mot: 'pjump', pal: 'wind', hit: 'quake', shake: 3 }, wyvernfall: { mot: 'pjump', pal: 'wind', hit: 'quake', big: 1, shake: 3 },
  dragonfall: { mot: 'pjump', hold: 0.3, pal: 'fire', charge: 'aura', hit: 'burst', proj: null, big: 2, after: 'embers', shake: 4 }, gale: { mot: 'pspin', pal: 'wind', hit: 'vortex', after: 'feathers' },
  // 마법사
  fireball: { mot: 'spush', proj: 'orb', hit: 'burst' }, icelance: { mot: 'spush', proj: 'shard', hit: 'shatter' }, chain: { mot: 'spushup', hit: 'bolt', after: 'sparks' },
  burst: { mot: 'scharge', hit: 'burst', big: 1, shake: 2 }, iceprison: { mot: 'spushup', hit: 'shatter', big: 1 }, meteor: { mot: 'scharge', hold: 0.3, hit: 'meteor', big: 1, shake: 3 },
  thunderclap: { mot: 'spushup', hit: 'bolt', big: 1, shake: 2 }, blizzard: { mot: 'scharge', hit: 'shatter', after: 'shards' }, sa_mirage: { mot: 'scharge', hit: 'burst', pal: 'sand', after: 'smoke' },
  awk_mage: { mot: 'scharge', hold: 0.35, charge: 'aura', hit: 'meteor', big: 1, shake: 4 }, awk2_mage: { mot: 'scharge', hold: 0.45, pal: 'star', charge: 'aura', hit: 'meteor', big: 2, after: 'motes', shake: 5 },
  arcanebolt: { mot: 'spush', pal: 'arcane', proj: 'orb', hit: 'star' }, meteorfall: { mot: 'scharge', hold: 0.3, hit: 'meteor', big: 1, shake: 3 }, disintegrate: { mot: 'spush', pal: 'arcane', proj: 'beam', hit: 'flash' },
  arcanestorm: { mot: 'scharge', pal: 'arcane', hit: 'bolt', big: 1 }, gravity: { mot: 'scharge', pal: 'dark', hit: 'vortex', lastBig: 2, shake: 3 }, ultima: { mot: 'scharge', hold: 0.35, pal: 'light', charge: 'aura', hit: 'flash', big: 2, after: 'motes', shake: 4 },
  windspirit: { mot: 'spushup', hit: 'vortex', after: 'feathers' }, firespirit: { mot: 'spush', proj: 'orb', hit: 'burst' }, storm: { mot: 'scharge', hit: 'bolt', big: 1 },
  spiritking: { mot: 'scharge', hold: 0.3, pal: 'wind', charge: 'aura', hit: 'vortex', big: 2, after: 'feathers', shake: 3 }, elemental: { mot: 'scharge', hold: 0.3, pal: 'star', charge: 'aura', hit: 'burst', big: 2, after: 'motes', shake: 3 },
  genesis: { mot: 'scharge', hold: 0.4, pal: 'fire', charge: 'aura', hit: 'meteor', big: 2, shake: 5 },
  drain: { mot: 'spush', pal: 'dark', proj: 'orb', hit: 'vortex', after: 'drain' }, curse: { mot: 'spush', pal: 'dark', proj: 'orb', hit: 'vortex' }, raise: { mot: 'scharge', pal: 'smoke', hit: 'claw' },
  deathwave: { mot: 'scharge', pal: 'evil', hit: 'vortex' }, soulrend: { mot: 'spush', pal: 'evil', proj: 'orb', hit: 'vortex', after: 'drain' }, deathplague: { mot: 'scharge', pal: 'evil', hit: 'poison', after: 'bubbles' },
  apocalypse: { mot: 'scharge', hold: 0.35, pal: 'evil', charge: 'aura', hit: 'meteor', big: 2, shake: 4 },
  prism: { mot: 'spush', pal: 'star', proj: 'beam', hit: 'flash' }, tidalwave: { mot: 'scharge', pal: 'water', hit: 'shatter', after: 'bubbles', shake: 2 }, stonefist: { mot: 'spushup', pal: 'earth', hit: 'quake', after: 'dust', shake: 2 },
  thundercall: { mot: 'spushup', hit: 'bolt', after: 'sparks' }, transmute: { mot: 'spush', pal: 'coin', proj: 'orb', hit: 'coins' }, frostflask: { mot: 'spushup', pal: 'ice', proj: 'flask', hit: 'shatter' },
  flashbang: { mot: 'spushup', pal: 'light', proj: 'flask', hit: 'flash' }, blazeflask: { mot: 'spushup', pal: 'fire', proj: 'flask', hit: 'burst' }, magnumopus: { mot: 'scharge', hold: 0.35, pal: 'gold', charge: 'aura', hit: 'burst', big: 2, after: 'motes', shake: 4 },
  weaken: { mot: 'spush', pal: 'dark', hit: 'vortex' }, sa_curse: { mot: 'spush', pal: 'dark', proj: 'orb', hit: 'vortex' },
  // 성직자
  holy: { mot: 'sraise', hit: 'pillar', proj: null }, holyhammer: { mot: 'smash', pal: 'holy', hit: 'cross', proj: null, after: 'motes', shake: 2 }, smite: { mot: 'sraise', hit: 'pillar', proj: null, big: 1, shake: 2 },
  purify: { mot: 'sraise', hit: 'pillar', proj: null }, archangel: { mot: 'scharge', hold: 0.35, pal: 'light', charge: 'aura', hit: 'pillar', big: 2, shake: 4 },
  banish: { mot: 'spush', hit: 'cross', proj: 'beam' }, sealing: { mot: 'spushup', hit: 'cross', proj: null }, holywater: { mot: 'spushup', pal: 'water', proj: 'flask', hit: 'poison', after: 'motes' },
  exorcism: { mot: 'scharge', hit: 'pillar', big: 1, shake: 2 }, verdict: { mot: 'smash', pal: 'holy', hit: 'cross', proj: null, shake: 2 }, pyre: { mot: 'spushup', pal: 'fire', hit: 'burst', after: 'embers' },
  inquisition: { mot: 'spush', hit: 'cross', proj: 'beam' }, lastjudgment: { mot: 'scharge', hold: 0.35, pal: 'holy', charge: 'aura', hit: 'pillar', big: 2, shake: 4 },
  blackdeath: { mot: 'spushup', pal: 'poison', hit: 'poison', proj: 'flask' }, miasma: { mot: 'spushup', pal: 'poison', hit: 'poison', proj: 'flask' }, epidemic: { mot: 'scharge', pal: 'poison', hit: 'poison', big: 1 },
  // 도적
  backstab: { mot: 'thrust', pal: 'shadow', hit: 'pierce', dash: 1 }, venom: { mot: 'hack', pal: 'poison', hit: 'poison' }, parasting: { mot: 'thrust', pal: 'bolt', hit: 'stun', proj: 'dart' },
  shadow: { mot: 'hack', pal: 'shadow', hit: 'slashes' }, voltstab: { mot: 'thrust', pal: 'bolt', hit: 'bolt', after: 'sparks' }, deadlyvenom: { mot: 'hack', pal: 'poison', hit: 'poison', after: 'bubbles' },
  blades: { mot: 'side', pal: 'steel', hit: 'slashes' }, awk_rogue: { mot: 'hack', hold: 0.35, pal: 'shadow', charge: 'aura', hit: 'slashes', big: 1, dash: 1, shake: 3 },
  awk2_rogue: { mot: 'hack', hold: 0.45, pal: 'dark', charge: 'aura', hit: 'slashes', big: 2, dash: 1, shake: 4 },
  assassinate: { mot: 'thrust', hold: 0.2, pal: 'shadow', hit: 'pierce', dash: 1, shake: 2 }, poisonblade: { mot: 'hack', pal: 'poison', hit: 'poison' }, throatcut: { mot: 'side', pal: 'blood', hit: 'slashes', dash: 1 },
  shadowclone: { mot: 'hack', pal: 'shadow', hit: 'slashes', dash: 1 }, twinslash: { mot: ['down', 'up'], pal: 'steel', hit: 'star' }, crossslash: { mot: 'down', pal: 'steel', hit: 'cross', proj: null },
  blitz: { mot: ['thrust', 'side', 'up', 'down', 'thrust'], pal: 'wind', hit: 'star', dash: 1, lastBig: 1 }, twinstorm: { mot: ['side', 'side'], pal: 'wind', hit: 'wave' },
  bladewaltz: { mot: ['side', 'up', 'down'], pal: 'music', hit: 'star', lastBig: 1 }, swordrain: { mot: ['down', 'down'], pal: 'steel', hit: 'slashes' },
  thousandcut: { mot: ['down', 'up', 'side', 'thrust'], hold: 0.3, pal: 'wind', charge: 'aura', hit: 'slashes', lastBig: 2, shake: 3 },
  grandheist: { mot: 'hack', pal: 'coin', hit: 'coins' }, phantom: { mot: 'side', pal: 'dark', hit: 'vortex', dash: 1 }, heist: { mot: 'hack', hold: 0.3, pal: 'coin', charge: 'aura', hit: 'coins', big: 1, shake: 3 },
  shadowstep: { mot: 'thrust', pal: 'dark', hit: 'pierce', dash: 1 }, shadowstorm: { mot: 'side', pal: 'dark', hit: 'slashes', big: 1 }, soulreap: { mot: 'down', hold: 0.22, pal: 'evil', hit: 'vortex', after: 'drain' },
  eclipse: { mot: 'side', hold: 0.3, pal: 'dark', charge: 'aura', hit: 'vortex', big: 2, shake: 4 }, pilfer: { mot: 'thrust', pal: 'coin', hit: 'coins' }, goldrush: { mot: 'side', pal: 'coin', hit: 'coins', big: 1 },
  jackpot: { mot: 'thrust', pal: 'coin', hit: 'coins', big: 1 },
  // 짐꾼 · 마부 · 음유시인 · 정찰가
  throwjunk: { mot: 'spushup', pal: 'earth', proj: 'junk', hit: 'star', after: 'dust' }, avalanche: { mot: 'smash', hold: 0.26, pal: 'earth', hit: 'quake', big: 1, after: 'dust', shake: 4 },
  whipcrack: { mot: 'side', pal: 'war', hit: 'stun' }, wheelcrush: { mot: 'thrust', pal: 'earth', hit: 'quake', dash: 1, shake: 3 }, stampede: { mot: 'side', pal: 'earth', hit: 'quake', dash: 1, after: 'dust', shake: 3 },
  grandcaravan: { mot: 'side', hold: 0.3, pal: 'gold', charge: 'aura', hit: 'quake', big: 1, dash: 1, after: 'dust', shake: 4 },
  lullaby: { mot: 'lstrum', pal: 'music', proj: 'note', hit: 'notes', after: 'petals' }, requiem: { mot: 'lraise', hold: 0.3, pal: 'holy', charge: 'aura', proj: null, hit: 'notes', big: 1, after: 'motes' },
  // 강화·치유 (모양을 고른다)
  camouflage: { cast: 'smoke', pal: 'nature' }, steadyaim: { cast: 'aim', pal: 'gold' }, spotweak: { cast: 'aim', pal: 'gold' },
  bless: { cast: 'holy', pal: 'holy' }, sanctuary: { cast: 'circle', pal: 'holy' }, holyland: { cast: 'circle', pal: 'holy', big: 1 }, wardcircle: { cast: 'circle', pal: 'holy' },
  heal: { cast: 'heal', pal: 'heal' }, greatheal: { cast: 'heal', pal: 'heal', big: 1 }, massheal: { cast: 'heal', pal: 'heal', big: 1 }, miracle: { cast: 'holy', pal: 'heal', big: 1 },
  awk_cleric: { cast: 'holy', pal: 'holy', big: 1, hold: 0.35 }, awk2_cleric: { cast: 'holy', pal: 'light', big: 1, hold: 0.45 }, resurrect: { cast: 'revive', pal: 'holy', hold: 0.3 },
  vaccine: { cast: 'potion', pal: 'poison' }, remedy: { cast: 'potion', pal: 'heal' }, panacea: { cast: 'potion', pal: 'heal', big: 1 }, elixir: { cast: 'potion', pal: 'gold', big: 1 }, quarantine: { cast: 'circle', pal: 'poison' },
  manashield: { mot: 'guard', cast: 'dome', pal: 'arcane' }, manaward: { cast: 'dome', pal: 'arcane' }, amplify: { cast: 'mana', pal: 'arcane' }, earthward: { cast: 'circle', pal: 'earth' }, waterspirit: { cast: 'heal', pal: 'water', big: 1 },
  bonewall: { cast: 'barrier', pal: 'smoke' }, smoke: { cast: 'smoke', pal: 'smoke' }, vanish: { cast: 'smoke', pal: 'shadow' }, nightfall: { cast: 'smoke', pal: 'dark' }, smokebomb: { cast: 'smoke', pal: 'smoke', big: 1 },
  parrying: { mot: 'parry', cast: 'wind', pal: 'wind' }, gallop: { cast: 'speed', pal: 'earth' }, convoy: { mot: 'guard', cast: 'barrier', pal: 'gold' }, wagonwall: { mot: 'guard', cast: 'dome', pal: 'earth' },
  awk_porter: { cast: 'shout', pal: 'gold', big: 1 }, awk2_porter: { cast: 'shout', pal: 'gold', big: 1 }, shout: { cast: 'shout', pal: 'earth' }, shieldbag: { mot: 'guard', cast: 'barrier', pal: 'earth' },
  drumbeat: { cast: 'shout', pal: 'war' }, encore: { cast: 'song', pal: 'music', big: 1 }, grandfinale: { cast: 'song', pal: 'gold', big: 1 }
};
// 표 채우기: 빌드 41 표(전사 계열)는 그대로 두고, 없는 스킬만
for (const [id, s] of Object.entries(SKILLS)) {
  if (SKFX[id] || !s.kind || s.kind === 'passive') continue;
  const o = Object.assign(skAuto(id, s), SKFX2_OVR[id] || {});
  for (const k of Object.keys(o)) if (o[k] === null || o[k] === undefined) delete o[k];
  SKFX[id] = o;
}

/* 날아가는 것: V.fx 'skp' (x0,y0 → x1,y1 · d초 · arc 포물선 높이 · style) */
function skProjDraw(g, f, sk, P, e) {
  if (e < 0 || e > f.d) return;
  const k = e / f.d, H = f.arc || 0, at = q => [f.x0 + (f.x1 - f.x0) * q, f.y0 + (f.y1 - f.y0) * q - Math.sin(q * Math.PI) * H];
  const [x, y] = at(k), [xb, yb] = at(Math.max(0, k - 0.05)), L = Math.hypot(x - xb, y - yb) || 1, ux = (x - xb) / L || f.dir || 1, uy = (y - yb) / L || 0;
  switch (f.style) {
    case 'arrow': for (let i = 0; i < 10; i++) skQ(g, x - ux * i * 2, y - uy * i * 2, i === 0 ? P[0] : i < 4 ? P[1] : P[2], i < 4 ? 1 : 1 - (i - 4) / 6); break;
    case 'dart': for (let i = 0; i < 6; i++) skQ(g, x - ux * i * 2, y - uy * i * 2, i < 2 ? P[0] : P[2], i < 2 ? 1 : 1 - (i - 2) / 4); break;
    case 'shard': for (let i = 0; i < 5; i++) { skQ(g, x - ux * i * 2, y - uy * i * 2, i < 2 ? P[0] : P[1]); if (i > 1 && i < 4) { skQ(g, x - ux * i * 2 - uy * 2, y - uy * i * 2 + ux * 2, P[2]); skQ(g, x - ux * i * 2 + uy * 2, y - uy * i * 2 - ux * 2, P[2]); } } for (let i = 5; i < 9; i++) skQ(g, x - ux * i * 2, y - uy * i * 2, P[2], 1 - (i - 5) / 4); break;
    case 'orb': { const s = (f.big || 0) + 1; skQ(g, x, y, P[0]); for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) skQ(g, x + ox * s, y + oy * s, P[1]); if (s > 1) for (const [ox, oy] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) skQ(g, x + ox, y + oy, P[1]);
      for (let i = 1; i < 7; i++) skQ(g, x - ux * i * 3 + Math.sin(e * 40 + i) * 1.5, y - uy * i * 3 + Math.cos(e * 40 + i) * 1.5, P[i < 3 ? 1 : i < 5 ? 2 : 3], 1 - i / 7); break; }
    case 'note': { const wy = Math.sin(e * 30) * 3; skQ(g, x, y + wy, P[0]); skQ(g, x + 2, y + wy, P[1]); skQ(g, x + 2, y + wy - 2, P[1]); skQ(g, x + 2, y + wy - 4, P[1]); skQ(g, x + 4, y + wy - 4, P[2]); for (let i = 1; i < 4; i++) skQ(g, x - ux * i * 4, y - uy * i * 4 + Math.sin(e * 30 - i) * 3, P[2], 1 - i / 4); break; }
    case 'flask': { const sp = Math.floor(e * 20) % 2; skQ(g, x, y, P[1]); skQ(g, x, y - 2, sp ? '#e8e8f0' : P[0]); skQ(g, x + (sp ? 2 : -2), y, P[2]); for (let i = 1; i < 4; i++) skQ(g, x - ux * i * 3, y - uy * i * 3, P[2], 0.6 - i * 0.15); break; }
    case 'junk': { const sp = Math.floor(e * 16) % 4; for (const [ox, oy] of [[0, 0], [2, 0], [0, 2], [2, 2]]) skQ(g, x + ox, y + oy, '#a8743e'); skQ(g, x + (sp % 2) * 2, y + (sp >> 1) * 2, '#d8b878'); break; }
    case 'beam': { const al = k < 0.5 ? 1 : 1 - (k - 0.5) * 2, n = Math.ceil(Math.hypot(f.x1 - f.x0, f.y1 - f.y0) / 2); for (let i = 0; i <= n; i++) { const q = i / n, bx = f.x0 + (f.x1 - f.x0) * q, by = f.y0 + (f.y1 - f.y0) * q; skQ(g, bx, by, P[0], al); if (k < 0.6) { skQ(g, bx, by - 2, P[1], al * 0.8); skQ(g, bx, by + 2, P[2], al * 0.6); } } break; }
  }
}
// 음표 하나 (머리 + 대 + 꼬리)
const skNote = (g, x, y, c1, c2, a) => { skQ(g, x, y, c1, a); skQ(g, x + 2, y, c1, a); skQ(g, x + 2, y - 2, c2, a); skQ(g, x + 2, y - 4, c2, a); skQ(g, x + 4, y - 4, c2, a); };
/* ③ 맞히기 (빌드 42) — skHitDraw가 모르는 모양을 여기서 그린다. e: 맞은 뒤 초(음수면 내려오는 중) */
const SK_HIT2 = {
  rain(g, f, P, e, big) {   // 하늘에서 화살이 쏟아진다 → 땅에 꽂힌다
    const n = 9 + 5 * big, W = 16 + 6 * big, pre = SK_PRE.rain;
    for (let i = 0; i < n; i++) { const t0 = -pre + skH(i, 1) * 0.24, q = (e - t0) / 0.16, x = f.x + (skH(i, 2) - 0.5) * W * 2, gy = f.fy - 2 - skH(i, 3) * 6;
      if (q < 0) continue;
      if (q < 1) { const y = gy - 80 * (1 - q), xx = x + 10 * (1 - q); for (let j = 0; j < 6; j++) skQ(g, xx + j, y - j * 2, j === 0 ? P[0] : j < 3 ? P[2] : P[3], j < 4 ? 1 : 0.7); }
      else if (q < 4.5) { const al = q < 3 ? 1 : 1 - (q - 3) / 1.5; skQ(g, x, gy, P[3], al); skQ(g, x + 1, gy - 2, P[3], al); skQ(g, x + 2, gy - 4, P[1], al); if (q < 1.5) { skQ(g, x - 2, gy, P[0]); skQ(g, x + 2, gy, P[0]); skQ(g, x, gy - 2, P[0]); } } }
  },
  burst(g, f, P, e, big) {   // 터짐: 번쩍 → 불덩이 고리 → 연기
    const cx = f.x, cy = f.y, b = big;
    if (e < 0) return;
    if (e < 0.06) { const r = 6 + 3 * b; for (let y = -r; y <= r; y += 2) for (let x = -r; x <= r; x += 2) if (x * x + y * y <= r * r) skQ(g, cx + x, cy + y, x * x + y * y < r * r * 0.4 ? P[0] : P[1]); return; }
    if (e < 0.32) { const u = (e - 0.06) / 0.26, R0 = 6 + (10 + 6 * b) * u, m = Math.round(R0 * 2.2); for (let i = 0; i < m; i++) { const an = i / m * Math.PI * 2; skQ(g, cx + Math.cos(an) * R0, cy + Math.sin(an) * R0 * 0.8, P[2 + (i % 2)], 1 - u * 0.6); }
      const r2 = (5 + 3 * b) * (1 - u); for (let y = -r2; y <= r2; y += 2) for (let x = -r2; x <= r2; x += 2) if (x * x + y * y <= r2 * r2) skQ(g, cx + x, cy + y, P[1]); }
    if (e > 0.12 && e < 0.8) { const u = (e - 0.12) / 0.68; for (let i = 0; i < 5 + 2 * b; i++) { const x = cx + (skH(i, 4) - 0.5) * (18 + 8 * b), y = cy - 4 - u * (14 + skH(i, 5) * 12); skQ(g, x, y, i % 2 ? '#a8a0a0' : '#787078', (1 - u) * 0.7); skQ(g, x + 2, y, '#a8a0a0', (1 - u) * 0.5); } }
  },
  shatter(g, f, P, e, big) {   // 얼음: 가시가 솟았다가 깨진다
    const cx = f.x, cy = f.y; if (e < 0) return;
    if (e < 0.05) { skStar(g, cx, cy, e, P, big); return; }
    if (e < 0.4) { const u = Math.min(1, (e - 0.05) / 0.08); for (let i = 0; i < 7 + 2 * big; i++) { const an = -Math.PI / 2 + (i - 3 - big) * 0.42, L = (8 + 4 * big + skH(i, 6) * 6) * u; for (let d = 0; d <= L; d += 2) skQ(g, cx + Math.cos(an) * d, cy + 6 + Math.sin(an) * d, d > L - 3 ? P[0] : d > L * 0.5 ? P[1] : P[2]); } }
    else if (e < 0.9) { const q = e - 0.4; for (let i = 0; i < 9; i++) { const an = skH(i, 7) * Math.PI * 2, v = 30 + skH(i, 8) * 40; skQ(g, cx + Math.cos(an) * v * q, cy + Math.sin(an) * v * q * 0.6 + 120 * q * q, P[i % 2 ? 0 : 1], 1 - q / 0.5); } }
  },
  bolt(g, f, P, e, big) {   // 벼락: 하늘에서 지그재그 → 번쩍 → 불꽃 튐
    const pre = SK_PRE.bolt; if (e < -pre || e > 0.3) return;
    const top = f.fy - 100, al = e < 0.12 ? 1 : 1 - (e - 0.12) / 0.18, seed = Math.floor((f.t0 || 0) * 10);
    let x = f.x + (skH(seed, 9) - 0.5) * 10, yEnd = e < 0 ? top + (f.fy - top) * (1 + e / pre) : f.fy;
    for (let y = top; y < yEnd; y += 2) { const j = Math.floor((y - top) / 8); x += (skH(j + seed, 10) - 0.5) * 3.2; skQ(g, x, y, P[0], al); if (e >= 0 && e < 0.12) { skQ(g, x - 2, y, P[2], al * 0.8); skQ(g, x + 2, y, P[2], al * 0.8); } if (big && j % 3 === 1) skQ(g, x + 4, y + 2, P[1], al * 0.7); }
    if (e >= 0 && e < 0.06) skStar(g, f.x, f.y, e, P, big);
    if (e >= 0) for (let i = 0; i < 6; i++) { const an = Math.PI + skH(i, 11) * Math.PI, v = 40 + skH(i, 12) * 40; skQ(g, f.x + Math.cos(an) * v * e, f.fy - 2 + Math.sin(an) * v * e * 0.8 + 100 * e * e, P[1], al); }
  },
  meteor(g, f, P, e, big) {   // 운석: 오른쪽 위에서 불덩이가 떨어져 크게 터진다
    const pre = SK_PRE.meteor, b = big;
    if (e < 0) { const q = 1 + e / pre, x = f.x + 60 * (1 - q) * (f.dir || 1), y = f.y - 120 * (1 - q), r = 4 + 2 * b;
      for (let i = 1; i < 12; i++) skQ(g, x + i * 3 * (f.dir || 1), y - i * 6, P[i < 3 ? 1 : i < 7 ? 2 : 3], 1 - i / 12);
      for (let yy = -r; yy <= r; yy += 2) for (let xx = -r; xx <= r; xx += 2) if (xx * xx + yy * yy <= r * r) skQ(g, x + xx, y + yy, xx * xx + yy * yy < r * r * 0.35 ? P[0] : P[1]);
      return; }
    SK_HIT2.burst(g, f, P, e, b + 1);
    if (e < 0.6) { const u = e / 0.6, r = 10 + u * (40 + 10 * b); for (let i = 0; i < 26; i++) { const an = i / 26 * Math.PI * 2; skQ(g, f.x + Math.cos(an) * r, f.fy + Math.sin(an) * r * 0.22, P[i % 2 ? 2 : 3], 1 - u); } }
  },
  vortex(g, f, P, e, big) {   // 소용돌이: 팔 셋이 돌며 조여든다
    if (e < 0 || e > 0.7) return;
    const u = e / 0.7, R0 = (16 + 4 * big) * (1 - u * 0.75), al = u < 0.7 ? 1 : (1 - u) / 0.3;
    for (let arm = 0; arm < 3; arm++) for (let i = 0; i < 7; i++) { const an = e * 9 + arm * 2.09 + i * 0.32, r = R0 * (1 - i / 9); skQ(g, f.x + Math.cos(an) * r, f.y + Math.sin(an) * r * 0.7, i < 2 ? P[0] : i < 4 ? P[1] : P[2], al * (1 - i / 9)); }
    skQ(g, f.x, f.y, P[3], al); if (e < 0.06) skStar(g, f.x, f.y, e, P, big);
  },
  notes(g, f, P, e, big) {   // 음표가 둘레에서 튀어 오른다
    if (e < 0 || e > 0.9) return;
    for (let i = 0; i < 4 + 2 * big; i++) { const t0 = skH(i, 13) * 0.25, q = (e - t0) / 0.6; if (q < 0 || q > 1) continue; const an = i * 1.7, x = f.x + Math.cos(an) * (10 + q * 6), y = f.y - 4 - q * 18 + Math.sin(an) * 6; skNote(g, x, y, P[i % 2 ? 1 : 2], P[3], 1 - q * 0.7); }
    if (e < 0.06) skStar(g, f.x, f.y, e, P, 0);
  },
  slashes(g, f, P, e, big) {   // 난도질: 짧은 베기 줄이 여러 번 엇갈린다
    if (e < -0.05 || e > 0.45) return;
    const n = 4 + 2 * big;
    for (let i = 0; i < n; i++) { const t0 = -0.05 + i * 0.06, q = (e - t0) / 0.08; if (q < 0 || q > 1.6) continue; const an = (skH(i, 14) - 0.5) * 2.4 + (i % 2 ? 0.8 : -0.8), L = 10 + 4 * big, al = q < 1 ? 1 : (1.6 - q) / 0.6;
      for (let d = -L; d <= L; d += 2) { const w = Math.abs(d) / L; if (q < 1 && (d / L + 1) / 2 > q) continue; skQ(g, f.x + Math.cos(an) * d, f.y + Math.sin(an) * d, w < 0.4 ? P[0] : w < 0.75 ? P[1] : P[2], al); } }
  },
  claw(g, f, P, e, big) {   // 발톱 자국 셋 (왼쪽 위 → 오른쪽 아래)
    if (e < -0.06 || e > 0.5) return;
    for (let k = 0; k < 3; k++) { const t0 = -0.06 + k * 0.05, q = (e - t0) / 0.08; if (q < 0) continue; const al = q < 2 ? 1 : Math.max(0, 1 - (q - 2) / 3), L = 12 + 3 * big;
      for (let d = 0; d <= L * Math.min(1, q); d += 2) skQ(g, f.x - 8 + k * 5 + d * 0.5, f.y - 10 + d, d < 3 || d > L - 3 ? P[2] : P[0], al); }
  },
  trap(g, f, P, e, big) {   // 덫: 땅의 이빨이 닫히고 그물
    if (e < 0 || e > 0.9) return;
    const y = f.fy - 2, c = Math.min(1, e / 0.1), w = 12 * (1 - c * 0.6), al = e < 0.6 ? 1 : (0.9 - e) / 0.3;
    for (let i = -3; i <= 3; i++) { skQ(g, f.x + i * 3, y - w * 0.5 - Math.abs(i) * 0.5, '#c8c8d0', al); skQ(g, f.x + i * 3, y + 2 + w * 0.2, '#8a8a96', al); if (i % 2) { skQ(g, f.x + i * 3, y - w * 0.5 + 2, '#ffffff', al); } }
    if (e > 0.1) for (let gy = -16; gy <= 0; gy += 4) for (let gx = -10; gx <= 10; gx += 4) skQ(g, f.x + gx + (gy % 8 ? 2 : 0), f.fy - 4 + gy * Math.min(1, (e - 0.1) / 0.1), P[2], al * 0.7);
    if (e < 0.06) skStar(g, f.x, y - 4, e, P, 0);
  },
  poison(g, f, P, e, big) {   // 독: 튀는 거품과 방울
    if (e < 0 || e > 0.8) return;
    if (e < 0.05) { skStar(g, f.x, f.y, e, P, 0); return; }
    for (let i = 0; i < 8 + 3 * big; i++) { const q = e - 0.05, an = skH(i, 15) * Math.PI * 2, v = 30 + skH(i, 16) * 30, x = f.x + Math.cos(an) * v * q, y = f.y + Math.sin(an) * v * q * 0.7 + 60 * q * q; if (y > f.fy) continue; skQ(g, x, y, P[1 + (i % 3)], 1 - q / 0.75); if (i % 3 === 0) skQ(g, x, y - 2, P[0], 1 - q / 0.75); }
  },
  coins(g, f, P, e, big) {   // 금화가 튀어 오르고 반짝인다
    if (e < 0 || e > 1) return;
    if (e < 0.05) skStar(g, f.x, f.y, e, P, 0);
    for (let i = 0; i < 7 + 4 * big; i++) { const q = e, an = -Math.PI / 2 + (skH(i, 17) - 0.5) * 2.2, v = 60 + skH(i, 18) * 40, x = f.x + Math.cos(an) * v * q * 0.6, y = f.y + Math.sin(an) * v * q + 170 * q * q, fl = Math.floor(e * 14 + i) % 3;
      if (y > f.fy + 2) continue; skQ(g, x, y, fl ? P[2] : P[0], 1 - q * 0.6); skQ(g, x + 2, y, P[3], 1 - q * 0.6); }
  },
  flash(g, f, P, e, big) {   // 섬광: 크게 번쩍이고 빛살
    if (e < 0 || e > 0.45) return;
    if (e < 0.1) { const r = (14 + 6 * big) * (0.5 + e * 5); for (let y = -r; y <= r; y += 2) for (let x = -r; x <= r; x += 2) if (x * x + y * y <= r * r) skQ(g, f.x + x, f.y + y, x * x + y * y < r * r * 0.3 ? P[0] : P[1], 0.85); return; }
    const u = (e - 0.1) / 0.35; for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2, L = 10 + (20 + 6 * big) * u; for (let d = 6; d < L; d += 2) skQ(g, f.x + Math.cos(an) * d, f.y + Math.sin(an) * d * 0.8, d < L * 0.5 ? P[0] : P[1], 1 - u); }
  },
  mark(g, f, P, e, big) {   // 표식: 조준 테두리가 조여들고 → 번쩍
    if (e < -0.2 || e > 0.6) return;
    const q = Math.min(1, (e + 0.2) / 0.2), r = 18 - 10 * q, al = e < 0.4 ? 1 : (0.6 - e) / 0.2;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { skQ(g, f.x + sx * r, f.y + sy * r, P[3], al); skQ(g, f.x + sx * (r - 2), f.y + sy * r, P[3], al); skQ(g, f.x + sx * r, f.y + sy * (r - 2), P[3], al); }
    if (e >= 0) skStar(g, f.x, f.y, e, P, big + 1);
  }
};
/* ④ 남은 것 (빌드 42) */
const SK_AFTER2 = {
  bubbles(g, f, P, e, u0) { if (e > 1.1) return; const u = u0 / 0.95; for (let i = 0; i < 6; i++) { const x = f.x + (skH(i, 21) - 0.5) * 20 + Math.sin(e * 5 + i) * 2, y = f.fy - 4 - u * (20 + skH(i, 22) * 16); skQ(g, x, y, P[1 + (i % 2)], 1 - u); } },
  smoke(g, f, P, e, u0) { if (e > 1.0) return; const u = u0 / 0.85; for (let i = 0; i < 6; i++) { const x = f.x + (skH(i, 23) - 0.5) * (16 + u * 14), y = f.fy - 6 - u * 18 - skH(i, 24) * 6; skQ(g, x, y, '#b8b0b0', 0.6 * (1 - u)); skQ(g, x + 2, y + 2, '#908890', 0.5 * (1 - u)); } },
  sparks(g, f, P, e, u0) { if (e > 0.7) return; const q = u0; for (let i = 0; i < 6; i++) { const an = skH(i, 25) * Math.PI * 2, v = 30 + skH(i, 26) * 30; if (Math.floor(e * 20 + i) % 2) skQ(g, f.x + Math.cos(an) * v * q, f.y + Math.sin(an) * v * q * 0.7 + 50 * q * q, P[1], 1 - q / 0.55); } },
  feathers(g, f, P, e, u0) { if (e > 1.2) return; const u = u0 / 1.05; for (let i = 0; i < 5; i++) { const x = f.x + (skH(i, 27) - 0.5) * 30 + Math.sin(e * 4 + i * 2) * 6, y = f.y - 10 + u * 26 + skH(i, 28) * 6; skQ(g, x, y, P[i % 2 ? 0 : 1], 1 - u); skQ(g, x + 2, y + (Math.sin(e * 4 + i * 2) > 0 ? -2 : 2), P[2], 1 - u); } },
  petals(g, f, P, e, u0) { if (e > 1.2) return; const u = u0 / 1.05; for (let i = 0; i < 6; i++) { const x = f.x + (skH(i, 29) - 0.5) * 30 + Math.sin(e * 3 + i) * 5, y = f.y - 14 + u * 26; skQ(g, x, y, ['#ff9ac8', '#fff0a8', '#ffffff'][i % 3], 1 - u); } }
};
/* 강화 (빌드 42): skCastDraw가 모르는 모양 */
const SK_CAST2 = {
  song(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 노래: 음표가 오르고 동료에게 흘러간다
    if (e > 0.08 && e < 1.2) for (let i = 0; i < 6 + 2 * (sk.big || 0); i++) { const u = ((e - 0.08) * 1.1 + skH(i, 31)) % 1, x = f.x + 8 * f.dir + Math.sin(u * 6 + i) * 8 + (skH(i, 32) - 0.5) * 12, y = cy - u * 30; skNote(g, x, y, P[1 + (i % 2)], P[3], (1 - u) * fade); }
    mates((x, y, zz, u) => skNote(g, x - 2 + Math.sin(u * 8) * 4, y - 26 * zz / 1.25 - u * 10, P[1], P[3], 1 - u), 0.05);
  },
  smoke(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 연막: 회색 연기가 몸을 감싼다
    const puff = (x, y, zz, u, n) => { const al = u < 0.5 ? 0.9 : 0.9 * (1 - u) / 0.5; for (let i = 0; i < n; i++) { const an = skH(i, 33) * Math.PI * 2, r = (4 + u * 12 + skH(i, 34) * 6) * zz / 1.25, px = x + Math.cos(an) * r, py = y - 12 * zz / 1.25 + Math.sin(an) * r * 0.8 - u * 8, c = P[1 + (i % 3)];
      skQ(g, px, py, c, al); skQ(g, px + 2, py, c, al); skQ(g, px + 1, py - 2, P[i % 2 ? 0 : 1], al * 0.9); } };
    if (e < 1.1) puff(f.x, f.y, z, Math.min(1, e / 1.1), 16 + 6 * (sk.big || 0));
    mates((x, y, zz, u) => puff(x, y, zz, u, 9), 0.05);
  },
  aim(g, f, sk, P, e, t, z, cy, hy, fade) {   // 조준: 눈앞에 조준 테두리가 조여들고 앞으로 빛줄
    if (e > 0.6) return;
    const q = Math.min(1, e / 0.25), r = 12 - 6 * q, x = f.x + 6 * f.dir, y = hy + 4, al = e < 0.45 ? 1 : (0.6 - e) / 0.15;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { skQ(g, x + sx * r, y + sy * r, P[3], al); skQ(g, x + sx * (r - 2), y + sy * r, P[2], al); skQ(g, x + sx * r, y + sy * (r - 2), P[2], al); }
    if (q >= 1) for (let d = 8; d < 60; d += 2) skQ(g, x + d * f.dir, y, d < 30 ? P[0] : P[1], al * (1 - d / 70));
  },
  holy(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 빛 내림: 하늘에서 빛줄기가 내려와 감싼다
    const beam = (x, y, zz, u, w) => { const al = u < 0.6 ? 1 : (1 - u) / 0.4, top = y - 70 * zz / 1.25; for (let yy = top; yy < y; yy += 2) for (let xx = -w; xx <= w; xx += 2) if ((Math.floor(yy / 2) + xx) % 3) skQ(g, x + xx, yy, Math.abs(xx) < w / 2 ? P[0] : P[2], al * 0.55); for (let i = 0; i < 4; i++) { const v = (u * 1.4 + skH(i, 35)) % 1; skQ(g, x + (skH(i, 36) - 0.5) * w * 2, y - 4 - v * 30, P[1], al); } };
    if (e > 0.06 && e < 1.1) beam(f.x, f.y, z, Math.min(1, (e - 0.06) / 1.0), 8 + 2 * (sk.big || 0));
    mates((x, y, zz, u) => beam(x, y, zz, u, 6), 0.08);
  },
  circle(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 마법진: 발밑에 도는 고리 + 빛 점 + 오르는 알갱이
    const ring = (x, y, zz, u, r0) => { const al = u < 0.7 ? 1 : (1 - u) / 0.3, r = r0 * Math.min(1, u * 4) * zz / 1.25, m = Math.max(16, Math.round(r * 2.4)); for (let i = 0; i < m; i++) { const an = i / m * Math.PI * 2 + t * 1.5; skQ(g, x + Math.cos(an) * r, y + Math.sin(an) * r * 0.3, i % 4 === 0 ? P[0] : P[2], al); } for (let i = 0; i < 6; i++) { const an = i / 6 * Math.PI * 2 - t * 2; skQ(g, x + Math.cos(an) * r * 0.6, y + Math.sin(an) * r * 0.18, P[1], al); } for (let i = 0; i < 4; i++) { const v = (u * 1.5 + skH(i, 37)) % 1; skQ(g, x + (skH(i, 38) - 0.5) * r * 1.6, y - v * 26, P[1], al * (1 - v)); } };
    if (e > 0.05 && e < 1.3) ring(f.x, f.y, z, Math.min(1, (e - 0.05) / 1.25), 16 + 4 * (sk.big || 0));
    mates((x, y, zz, u) => ring(x, y, zz, u, 11), 0.08);
  },
  mana(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 마력: 몸 둘레 나선 + 위로 튀는 빛
    if (e > 0.06 && e < 1.0) for (let k = 0; k < 2; k++) for (let i = 0; i < 10; i++) { const an = t * 8 + k * Math.PI + i * 0.35, r = 12 * z / 1.25, y = f.y - 4 - i * 3.2 * z / 1.25; skQ(g, f.x + Math.cos(an) * r, y, i % 3 ? P[2] : P[0], fade * (1 - i / 12)); }
    mates((x, y, zz, u) => { for (let i = 0; i < 6; i++) { const an = u * 10 + i * 1.05; skQ(g, x + Math.cos(an) * 8, y - 14 * zz / 1.25 + Math.sin(an) * 3, P[1], 1 - u); } }, 0.06);
  },
  revive(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 되살림: 금빛 기둥 + 날개처럼 퍼지는 빛
    SK_CAST2.holy(g, f, sk, P, e, t, z, cy, hy, fade, mates);
    if (e > 0.2 && e < 0.9) { const u = (e - 0.2) / 0.7; for (let s = -1; s <= 1; s += 2) for (let i = 0; i < 6; i++) skQ(g, f.x + s * (6 + i * 3 * Math.min(1, u * 2)), hy + 2 - Math.sin(i / 5 * Math.PI) * 6, P[i < 2 ? 0 : 1], 1 - u); }
  },
  speed(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 질주: 몸 뒤로 빠른 줄 + 발밑 먼지
    const lines = (x, y, zz, u) => { const al = u < 0.6 ? 1 : (1 - u) / 0.4; for (let i = 0; i < 4; i++) { const yy = y - (4 + i * 7) * zz / 1.25, L = 10 + skH(i, 39) * 10, off = ((t * 90 + i * 17) % 20); for (let d = 0; d < L; d += 2) skQ(g, x - f.dir * (8 + off + d), yy, d < 4 ? P[0] : P[2], al * (1 - d / L)); } skQ(g, x - f.dir * 6, y - 1, '#d8c8b0', al * 0.6); skQ(g, x - f.dir * 10, y - 3, '#d8c8b0', al * 0.4); };
    if (e > 0.05 && e < 1.0) lines(f.x, f.y, z, Math.min(1, e / 1.0));
    mates((x, y, zz, u) => lines(x, y, zz, u), 0.05);
  },
  potion(g, f, sk, P, e, t, z, cy, hy, fade, mates) {   // 물약: 손에서 거품이 오르고 동료에게 방울
    if (e > 0.05 && e < 1.0) for (let i = 0; i < 8 + 3 * (sk.big || 0); i++) { const u = ((e - 0.05) * 1.3 + skH(i, 40)) % 1, x = f.x + 6 * f.dir + Math.sin(u * 7 + i) * 4 + (skH(i, 41) - 0.5) * 10, y = cy - 4 - u * 26; skQ(g, x, y, P[1 + (i % 2)], (1 - u) * fade); if (i % 4 === 0) skQ(g, x, y - 2, P[0], (1 - u) * fade); }
    mates((x, y, zz, u) => { for (let i = 0; i < 4; i++) skQ(g, x - 4 + i * 3, y - 18 * zz / 1.25 - u * 12 - (i % 2) * 3, P[1 + (i % 2)], 1 - u); }, 0.08);
  }
};
STORY.v42 = [
  '빌드 42: 모든 직업이 무기에 맞는 공격 동작을 쓴다 — 활은 시위를 당겨 쏘기·더 강하게 당기기·사선으로 쏘기·연사·활 휘두르기, 창은 정면·위·아래 찌르기·휘두르기·돌리기·도약 찌르기, 지팡이는 내밀기·찌르기·내밀었다 위로 들기·휘두르기·기 모으기, 단검은 베기·찌르기·난도질, 도끼·철퇴·망치·몽둥이는 내려찍기까지, 류트는 켜기와 치기.',
  '화살·마법·음표는 무기 끝에서, 시위를 놓는(지팡이를 내미는) 때에 날아간다. 사선으로 쏜 화살은 포물선을 그린다.',
  '다른 직업 스킬 200여 개에도 단계 효과가 붙었다 — 빛나는 화살·마법 구슬·얼음 가시·음표·병이 날아가고, 화살비·폭발·얼음 깨짐·벼락·운석·소용돌이·음표·난도질·발톱·덫·독·금화·섬광·표식으로 맞는다. 노래·연막·조준·빛 내림·마법진·마력·되살림·질주·물약 같은 강화 모양도 생겼다.'
];
