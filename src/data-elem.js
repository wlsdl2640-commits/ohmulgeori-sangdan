/* ───────── 빌드 31: 속성과 상성 · 몬스터 타입 · 기절 스킬 ─────────
   스킬 속성: 무속성(베기·찌르기·화살 같은 물리 공격과 기본 공격) + 물·불·바람·흙·번개·강철·빙결·화염·폭풍·빛·어둠·신성·악.
   같은 계열끼리는 서로 면역: 불↔화염, 물↔빙결, 바람↔폭풍, 빛↔신성, 어둠↔악 (흙·번개·강철은 저마다 한 계열).
   빛·신성 몬스터는 속성 스킬에 모두 면역 (기본 공격·무속성 · 빌드 63부터 어둠·악만 들어간다). 강철 몬스터는 무속성에 면역 (속성 스킬로만 들어간다).
   빛·신성 → 어둠·악 ×1.5 · 물·빙결 → 불·화염 ×1.5 · 번개 → 물·강철 ×1.5 · 불·화염 → 빙결·강철 ×1.5 · 바람·폭풍 → 흙 ×1.5 · 흙 → 번개 ×1.5
   반대로 불 → 물 ×0.5 · 번개 → 흙 ×0.5 · 흙 → 바람·폭풍 ×0.5. 빛·신성은 언데드·악마에게, 불·화염은 식물에게 ×1.3 더.
   몬스터 타입: 마물·짐승·괴수·언데드·식물·원소·인간·악마·천상·골렘·용. 하나 이상, 여럿일 수도 있다. */
const ELEMS = {
  none:    { name: '무속성', c: '#c9c3b8', fam: 'none' },
  water:   { name: '물',   c: '#4aa8ff', fam: 'water',   vs: { fire: 1.5, blaze: 1.5 } },
  fire:    { name: '불',   c: '#ff7a3a', fam: 'fire',    vs: { ice: 1.5, steel: 1.5, water: 0.5 } },
  wind:    { name: '바람', c: '#8ae8b0', fam: 'wind',    vs: { earth: 1.5 } },
  earth:   { name: '흙',   c: '#c8a060', fam: 'earth',   vs: { thunder: 1.5, wind: 0.5, storm: 0.5 } },
  thunder: { name: '번개', c: '#ffe04a', fam: 'thunder', vs: { water: 1.5, ice: 1.3, steel: 1.5, earth: 0.5 } },
  steel:   { name: '강철', c: '#b8c4d4', fam: 'steel',   vs: { earth: 1.3, ice: 1.3 } },
  ice:     { name: '빙결', c: '#9ae8ff', fam: 'water',   vs: { fire: 1.5, blaze: 1.5, wind: 1.3, storm: 1.3 } },
  blaze:   { name: '화염', c: '#ff4a2a', fam: 'fire',    vs: { ice: 1.5, steel: 1.5, water: 0.5 } },
  storm:   { name: '폭풍', c: '#5ad8c8', fam: 'wind',    vs: { earth: 1.5, water: 1.3 } },
  light:   { name: '빛',   c: '#fff4a0', fam: 'light',   vs: { dark: 1.5, evil: 1.5 } },
  dark:    { name: '어둠', c: '#8a6ad8', fam: 'dark',    vs: { light: 1.5, holy: 1.5 } },   // 빌드 63: 빛 · 신성 몬스터에게 ×1.5
  holy:    { name: '신성', c: '#ffe8a0', fam: 'light',   vs: { dark: 1.5, evil: 1.5 } },
  evil:    { name: '악',   c: '#c03a6a', fam: 'dark',    vs: { light: 1.5, holy: 1.5 } }
};
const ELEM_IDS = Object.keys(ELEMS).filter(k => k !== 'none');
const MTYPES = {
  monster:   { name: '마물' }, beast: { name: '짐승' }, kaiju: { name: '괴수' }, undead: { name: '언데드' }, plant: { name: '식물' }, elemental: { name: '원소' },
  human:     { name: '인간' }, demon: { name: '악마' }, divine: { name: '천상' }, construct: { name: '골렘' }, dragon: { name: '용' }
};
const MTYPE_IDS = Object.keys(MTYPES);
// 몬스터: 타입(여럿이면 공백) | 속성(여럿이면 공백, 없으면 비움)
const MON_TAG = {
  rat: 'beast|', slime: 'monster|', rabbit: 'beast|', wolf: 'beast|', goblin: 'monster|', ratking: 'beast|',
  myconid: 'plant monster|', spider: 'monster|', sapling: 'plant|', shaman: 'monster|dark', elder: 'plant|earth',
  lizard: 'beast|earth', bat: 'beast|', kobold: 'monster|', golem: 'construct|earth', giant: 'kaiju construct|earth',
  harpy: 'monster|wind', windwolf: 'beast|wind', griffon: 'beast|wind', wyvern: 'dragon|wind', stormwyvern: 'dragon kaiju|storm',
  snowman: 'elemental|ice', icesprite: 'elemental|ice', yeti: 'beast kaiju|ice', snowmaiden: 'monster|ice', icequeen: 'monster|ice',
  scorpion: 'monster|', antlion: 'monster|earth', bandit: 'human|', sandworm: 'kaiju|earth', greatworm: 'kaiju|earth',
  assassin: 'human|', poisoner: 'human|', enforcer: 'human|', officer: 'human|', blackhood: 'human|',
  kingslime: 'monster kaiju|water', kaishar: 'human|', raidgriffon: 'beast kaiju|storm', tempest: 'dragon kaiju|storm', behemoth: 'kaiju beast|earth',
  sewerrat: 'beast|', sludge: 'monster|', sewercroc: 'beast|water', ratman: 'monster|', sewertroll: 'monster kaiju|',
  frogman: 'monster|water', leech: 'monster|water', kelpie: 'monster beast|water', siren: 'monster|water', swampthing: 'plant monster|water',
  toadking: 'beast kaiju|water', hydra: 'kaiju dragon|water', anaconda: 'beast kaiju|water', swampwitch: 'human|dark',
  imp: 'demon|fire', hellhound: 'demon beast|fire', troll: 'monster kaiju|', ogre: 'monster kaiju|', flesh: 'construct undead|dark',
  cerberus: 'demon beast kaiju|blaze', ogreking: 'monster kaiju|', chimera: 'kaiju beast|fire',
  vbat: 'beast|dark', ghoul: 'undead|dark', gargoyle: 'construct|earth', evileye: 'demon|evil', succubus: 'demon|evil',
  vampknight: 'undead human|dark', dracula: 'undead|evil', skelwar: 'undead|dark', skelarc: 'undead|dark', skelmage: 'undead|dark', lichking: 'undead|evil',
  alpgoat: 'beast|', wisp: 'elemental undead|dark', zombie: 'undead|dark', banshee: 'undead|dark', wraith: 'undead|dark', ghosttree: 'undead plant|dark',
  mummy: 'undead|dark', reaper: 'undead|evil', deathknight: 'undead human|evil',
  magmaslime: 'monster elemental|fire', firebat: 'beast|fire', salamander: 'elemental beast|fire', lavagolem: 'construct elemental|blaze earth',
  redhare: 'beast|fire', efreet: 'elemental|blaze', magmadragon: 'dragon kaiju|blaze', firelord: 'elemental|blaze',
  rootspider: 'monster|', treantguard: 'plant|earth', dryad: 'plant|', mossgolem: 'construct plant|earth', rootworm: 'monster|earth',
  worldserpent: 'kaiju|earth', corruptheart: 'plant demon|evil',
  cloudsheep: 'beast|wind', skyray: 'beast|wind', thunderbird: 'beast|thunder', pegasus: 'beast|wind', cloudgiant: 'kaiju|wind',
  skyknight: 'human|steel', skytitan: 'kaiju|storm', skyemperor: 'human divine|light',
  mimic: 'monster|', goldgolem: 'construct|steel', treasureguard: 'construct|earth',   // 보물 던전 주인은 강철이 아니다 (무속성 파티도 지도를 헛쓰지 않게)
  stormcloud: 'elemental|thunder', thunderhawk: 'beast|thunder', stormgolem: 'construct|steel thunder', raiju: 'beast|thunder',
  tempestknight: 'human|storm', thunderdragon: 'dragon kaiju|thunder', stormking: 'human divine|storm',
  ruinguard: 'construct|earth', fallenangel: 'demon|evil', seraphknight: 'undead divine|holy', sphinx: 'beast monster|earth',
  ophan: 'divine|holy', colossus: 'construct divine kaiju|holy', fallenarch: 'demon|evil',
  starsprite: 'elemental divine|light', moonhound: 'beast|ice', nebula: 'monster|dark', constellation: 'human|steel',
  startreant: 'plant|earth', starwhale: 'kaiju beast|water', starqueen: 'divine|light'
};
Object.entries(MON_TAG).forEach(([id, t]) => { const m = MONS[id]; if (!m) return; const [ty, el] = t.split('|'); m.ty = ty.split(' ').filter(Boolean); m.el = el ? el.split(' ').filter(Boolean) : []; });
// 표에 없는 몬스터(나중에 생긴 것)는 모양으로 짐작한다
const PLAN_TY = { quad: 'beast', flyer: 'beast', blob: 'monster', golem: 'construct', tree: 'plant', ghost: 'undead', biped: 'monster', giant: 'kaiju', bug: 'monster', worm: 'monster', shroom: 'plant', human: 'human', beast: 'beast', slime: 'monster', dragon: 'dragon', whale: 'kaiju' };
Object.keys(MONS).forEach(id => { const m = MONS[id]; if (m.plan === 'pet') return; if (!m.ty || !m.ty.length) m.ty = [PLAN_TY[m.plan] || 'monster']; if (!m.el) m.el = []; });
const monTypes = id => (MONS[id] && MONS[id].ty) || [];
const monEls = id => (MONS[id] && MONS[id].el) || [];

/* 스킬 속성: el 하나, 또는 els(여럿 가운데 그 적에게 가장 잘 듣는 것) */
const SKILL_EL = {
  fireball: 'fire', icelance: 'ice', chain: 'thunder', burst: 'fire', holy: 'holy', earthsplit: 'earth', stormarrows: 'wind', meteor: 'blaze', blizzard: 'ice', smite: 'holy',
  holystrike: 'holy', judgment: 'holy', divinity: 'holy', gale: 'wind', dragonfall: 'blaze', divinearrow: 'light', starfall: 'light', lastarrow: 'holy', requiem: 'holy',
  shadowstep: 'dark', shadowstorm: 'dark', soulreap: 'evil', eclipse: 'dark', goldrush: 'steel', phantom: 'dark',
  windspirit: 'wind', firespirit: 'fire', storm: 'storm', spiritking: 'storm', drain: 'dark', curse: 'dark', raise: 'dark', deathwave: 'evil', soulrend: 'evil', deathplague: 'evil', apocalypse: 'evil',
  meteorfall: 'blaze', gravity: 'dark', ultima: 'light', flameblade: 'fire', frostblade: 'ice', thunderblade: 'thunder', starblade: 'light', swordsaint: 'storm',
  purify: 'holy', archangel: 'holy', banish: 'holy', sealing: 'holy', holywater: 'holy', exorcism: 'holy', verdict: 'holy', pyre: 'blaze', inquisition: 'holy', lastjudgment: 'holy',
  el_arrow: 'ice', dw_smash: 'earth', sa_mirage: 'fire', sa_curse: 'dark', iceprison: 'ice', weaken: 'dark', awk_mage: 'blaze', awk2_mage: 'blaze'
};
Object.entries(SKILL_EL).forEach(([id, el]) => { if (SKILLS[id]) SKILLS[id].el = el; });
Object.assign(SKILLS.elemental, { els: ['fire', 'water', 'wind', 'earth'] });   // 4원소 폭발: 적마다 가장 잘 듣는 원소로
Object.assign(SKILLS.genesis, { els: ['blaze', 'ice', 'storm', 'earth'] });
SKILLS.piercearrow.armor = 1;   // 철갑 화살: 강철의 무속성 면역을 꿰뚫는다
SKILLS.elixir.cures = STATUS_IDS;

/* 기절: 개념이 맞는 기존 스킬에 기절을 붙인다 (이미 상태이상이 있는 스킬은 그대로) */
const STUN_ADD = { titanblow: [0.3, 2], earthsplit: [0.2, 1.5], lancecharge: [0.3, 2], skyfall: [0.3, 1.5], dragonfall: [0.4, 2], throwjunk: [0.15, 1.5], avalanche: [0.3, 2],
  ragnarok: [0.3, 2], shadowstep: [0.25, 1.5], smite: [0.25, 1.5], judgment: [0.3, 2], meteor: [0.25, 1.5], headshot: [0.35, 2], awk_warrior: [0.4, 2], lullaby: [0.35, 2.5], whipcrack: [0.2, 1.5] };
Object.entries(STUN_ADD).forEach(([id, [p, d]]) => { const s = SKILLS[id]; if (s && !s.sta) s.sta = { k: 'stun', p, d, m: 0 }; });
// 새 스킬북: 기절을 거는 기술 다섯 (계열마다 하나)
const STUN_BOOKS = {
  shockwave:   { name: '충격파',       cls: ['warrior', 'porter'], lv: 40, cost: { mp: 18 }, cd: 12, kind: 'dmg', mult: 1.5, tgt: 'all', fx: 'jump', el: 'earth', sta: { k: 'stun', p: 0.3, d: 1.6, m: 0 }, desc: '흙 속성. 땅을 내리쳐 모든 적을 뒤흔든다. 기절시킬 수 있다.' },
  flasharrow:  { name: '섬광 화살',    cls: ['archer'], lv: 34, cost: { mp: 12 }, cd: 10, kind: 'dmg', mult: 1.4, tgt: 'front', fx: 'arrow', el: 'light', sta: { k: 'stun', p: 0.5, d: 2, m: 0 }, desc: '빛 속성. 화살촉이 터지며 눈을 멀게 한다. 절반 확률로 기절.' },
  thunderclap: { name: '뇌격',         cls: ['mage'], lv: 38, cost: { mp: 16 }, cd: 10, kind: 'mdmg', mult: 1.9, tgt: 'front', fx: 'bolt', el: 'thunder', sta: { k: 'stun', p: 0.45, d: 2, m: 0 }, desc: '번개 속성. 앞의 적에게 벼락을 내려 기절시킨다.' },
  voltstab:    { name: '뇌전 찌르기',  cls: ['rogue'], lv: 30, cost: { mp: 12 }, cd: 9, kind: 'dmg', mult: 2.2, crit: 0.1, tgt: 'front', el: 'thunder', sta: { k: 'stun', p: 0.45, d: 2, m: 0 }, desc: '번개 속성. 전기를 두른 단검으로 급소를 찔러 기절시킨다.' },
  holyhammer:  { name: '성스러운 철퇴', cls: ['cleric'], lv: 32, cost: { mp: 14 }, cd: 11, kind: 'mdmg', mult: 1.8, tgt: 'front', fx: 'holy', el: 'holy', sta: { k: 'stun', p: 0.4, d: 2, m: 0 }, desc: '신성 속성. 빛의 철퇴로 앞의 적을 내리쳐 기절시킨다. 언데드·악마에게 잘 듣는다.' }
};
Object.assign(SKILLS, STUN_BOOKS);
const STUN_BOOK_MONS = { shockwave: ['golem', 'troll', 'ogre'], flasharrow: ['griffon', 'skelarc', 'harpy'], thunderclap: ['stormwyvern', 'thunderbird', 'raiju'], voltstab: ['assassin', 'bandit', 'enforcer'], holyhammer: ['skelwar', 'ghoul', 'mummy'] };
Object.keys(STUN_BOOKS).forEach(id => {
  const s = SKILLS[id]; SKILL_IDS.push(id); BOOK_IDS.push(id);
  ITEMS['book_' + id] = { name: `스킬북: ${s.name}`, v: 60 + s.lv * 35, w: 1, icon: 'book', c: BOOK_COLORS[s.cls[0]] || '#4a8ac8', book: id };
  BOOK_MONS[id] = STUN_BOOK_MONS[id]; STUN_BOOK_MONS[id].forEach(m => { (MON_BOOKS[m] = MON_BOOKS[m] || []).push(id); });
});
// 새 직업 스킬도 목록에
['trackshot', 'snaretrap', 'houndpack', 'wildsense', 'driveshot', 'giantslayer', 'harpoon', 'anatomy', 'quaketrap', 'titanfall', 'prism', 'tidalwave', 'stonefist', 'elemfocus', 'thundercall', 'transmute', 'frostflask', 'flashbang', 'blazeflask', 'elixir', 'magnumopus']
  .forEach(id => { if (!SKILL_IDS.includes(id)) SKILL_IDS.push(id); });
// 타입 특공을 다른 직업에도 조금씩
const TYPE_TR = { mhunter: { monster: 0.2 }, dslayer: { dragon: 0.4, monster: 0.2 }, exorcist: { undead: 0.25, demon: 0.25 }, inquisitor: { undead: 0.35, demon: 0.35 }, paladin: { undead: 0.2 } };
Object.entries(TYPE_TR).forEach(([c, vs]) => { const T = CLASSES[c].tr || (CLASSES[c].tr = {}); T.vs = Object.assign({}, T.vs || {}, vs); });

/* ───────── 계산 ───────── */
const elOf = s => (s && s.el) || 'none';
// 공격 속성 → 몬스터에게 들어가는 배율 (0 = 면역)
function elemBase(el, f) {
  if (!f || f.pvp) return 1;
  const fe = monEls(f.id), atk = el || 'none';
  if (atk === 'none') return fe.includes('steel') ? 0 : 1;               // 강철: 무속성 면역   (빌드 63: 속성이 없는 몬스터도 타입 상성은 받는다 — 식물 · 인간)
  const E = ELEMS[atk]; if (!E) return 1;
  if ((fe.includes('light') || fe.includes('holy')) && E.fam !== 'dark') return 0;   // 빛·신성: 속성 면역 (어둠 · 악만 들어간다 — 빌드 63)
  let m = 1;
  for (const x of fe) { if (ELEMS[x] && ELEMS[x].fam === E.fam) return 0; m *= (E.vs && E.vs[x]) || 1; }   // 같은 계열: 면역
  const ty = monTypes(f.id);
  if (E.fam === 'light' && (ty.includes('undead') || ty.includes('demon'))) m *= 1.3;
  if (E.fam === 'fire' && ty.includes('plant')) m *= 1.3;
  if (E.fam === 'dark' && (ty.includes('divine') || ty.includes('human'))) m *= 1.3;   // 어둠 · 악 → 천상 · 인간 (빌드 63)
  return m;
}
// 모험가(직업 특성 elw: 약점 피해 · immPierce: 면역 관통)까지 더한 배율
function elemMul(el, f, a, s) {
  let m = elemBase(el, f);
  if (m === 0 && s && s.armor && (el || 'none') === 'none' && monEls(f.id).includes('steel')) m = 0.8;   // 철갑 화살
  if (!a) return m;
  const T = TR(a), P = passives(a);   // 빌드 65 구슬술: 약점 피해 + · 면역 꿰뚫기
  if (m > 1) m *= 1 + (T.elw || 0) + traitSum(a, 'elw') + (P.weakPct || 0);
  if (m === 0 && (T.immPierce || P.immPierce)) m = Math.max(T.immPierce || 0, P.immPierce || 0);
  return m;
}
// 여러 속성 스킬: 그 적에게 가장 잘 듣는 속성
function skillEl(s, f, a) {
  if (!s) return 'none';
  if (!s.els) return s.el || (a && typeof arrowSkill === 'function' && arrowSkill(s) && arrowEl(a)) || 'none';   // 속성 없는 화살 스킬은 끼운 화살의 속성 (빌드 39)
  let best = s.els[0], bm = -1;
  for (const el of s.els) { const m = elemMul(el, f, a, s); if (m > bm) { bm = m; best = el; } }
  return best;
}
const skillElMul = (s, f, a) => elemMul(skillEl(s, f, a), f, a, s);
// 몬스터 타입 특공: 직업 특성 vs · 스킬 vs · 특성 vsBeast 같은 것
const TY_TRAIT = { beast: 'vsBeast', kaiju: 'vsKaiju', undead: 'vsUndead', demon: 'vsDemon', dragon: 'vsDragon', monster: 'vsMonster' };
function typeMul(a, f, s) {
  if (!f || f.pvp) return 1;
  const ty = monTypes(f.id); if (!ty.length) return 1;
  const T = a ? TR(a) : {};
  let add = 0, sm = 1;
  for (const t of ty) {
    add += (T.vs && T.vs[t]) || 0;
    if (a && TY_TRAIT[t]) add += traitSum(a, TY_TRAIT[t]);
    if (s && s.vs && s.vs[t]) sm = Math.max(sm, s.vs[t]);
  }
  return (1 + add) * sm;
}
// 상단 도감 기준 그 타입 몬스터 처치 수
const typeKills = ty => Object.entries((S && S.dex && S.dex.kills) || {}).reduce((n, [id, v]) => n + (monTypes(id).includes(ty) ? v : 0), 0);
// 마지막 공격 결과 (면역·약점·저항) — 전투 화면에 띄운다
const HIT = { imm: 0, wk: 0, res: 0 };
const hitTag = () => (HIT.imm ? { imm: 1 } : HIT.wk ? { wk: 1 } : HIT.res ? { res: 1 } : {});
// 화면용 글자
const elName = el => (ELEMS[el] || ELEMS.none).name;
const elTag = el => `<span class="elt" style="color:${(ELEMS[el] || ELEMS.none).c}">${elName(el)}</span>`;
const skillElText = s => (s.els ? s.els.map(elName).join('·') + ' 중 약점' : elName(elOf(s)));
const monTypeText = id => monTypes(id).map(t => MTYPES[t] ? MTYPES[t].name : t).join('·');
const monElText = id => monEls(id).map(elName).join('·') || '없음';
function monElNote(id) {
  const fe = monEls(id);
  if (fe.includes('light') || fe.includes('holy')) return '어둠 · 악 말고는 속성 스킬 면역 · 기본 공격 · 무속성 · 어둠 · 악으로 (어둠 · 악 ×1.5)';
  if (fe.includes('steel')) return '무속성·기본 공격 면역 · 속성 스킬로';
  if (!fe.length) return '';
  const fam = [...new Set(fe.map(x => ELEMS[x].fam))];
  const imm = ELEM_IDS.filter(x => fam.includes(ELEMS[x].fam)).map(elName).join('·');
  const strong = ELEM_IDS.filter(x => elemBase(x, { id }) > 1).map(elName).join('·');
  return `${imm} 면역${strong ? ` · 약점 ${strong}` : ''}`;
}
