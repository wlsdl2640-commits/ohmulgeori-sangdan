/* ───────── 스킬북 드랍표 ─────────
   스킬북마다 떨어뜨리는 몬스터를 정한다 (스킬 레벨에 맞는 땅의 몬스터, 주제가 맞으면 그쪽으로).
   같은 몬스터라도 던전 안에서는 더 잘 떨어지고, 우두머리·주인으로 나오면 훨씬 잘 떨어진다.
   고유 스킬(own)·왕국/투기장 스킬북·각성기는 드랍하지 않는다. */
const BOOK_RATE = { field: 0.004, dungeon: 0.008, fb: 0.08, boss: 0.25 };   // 몬스터 하나가 스킬북 하나를 떨어뜨릴 확률
const BOOK_MONS = {
  // 평원·원시림 (Lv1~)
  firstaid:   ['slime', 'rabbit'],
  bandage:    ['rat', 'wolf'],
  taunt:      ['goblin', 'wolf'],
  bless:      ['slime', 'myconid'],
  sprint:     ['rabbit', 'rat'],
  double:     ['wolf', 'goblin'],
  icelance:   ['slime', 'spider'],
  smoke:      ['goblin', 'rat'],
  cure:       ['myconid', 'spider'],
  shout:      ['goblin', 'ratking'],
  meditate:   ['myconid', 'shaman'],
  ironwall:   ['sapling', 'ratking'],
  massheal:   ['sapling', 'ratking'],
  venom:      ['spider', 'myconid'],
  poisonarrow:['spider', 'myconid'],
  chain:      ['shaman', 'elder'],
  sturdy:     ['sapling', 'kobold'],
  // 검은바위산·뒷골목 (Lv14~)
  ironskin:   ['lizard', 'sapling', 'kobold'],
  parasting:  ['spider', 'assassin'],
  sweep:      ['goblin', 'kobold', 'elder'],
  holy:       ['elder', 'shaman'],
  shadow:     ['bat', 'assassin'],
  rain:       ['shaman', 'harpy'],
  weaken:     ['shaman', 'poisoner'],
  burst:      ['elder', 'kobold'],
  chant:      ['bat', 'lizard'],
  haste:      ['bat', 'enforcer', 'windwolf'],
  berserk:    ['kobold', 'enforcer', 'golem'],
  riposte:    ['assassin', 'enforcer', 'officer'],
  toughness:  ['golem', 'lizard', 'sewercroc'],
  resolve:    ['enforcer', 'giant', 'blackhood'],
  iceprison:  ['golem', 'giant', 'snowman'],
  // 바람계곡·지하수로·만년설산 (Lv30~)
  piercing:   ['harpy', 'windwolf', 'giant'],
  quickstep:  ['windwolf', 'harpy', 'sewerrat'],
  packmule:   ['kobold', 'sludge', 'windwolf'],
  earthsplit: ['giant', 'griffon', 'sewercroc'],
  sanctuary:  ['griffon', 'windwolf', 'blackhood'],
  meteor:     ['wyvern', 'griffon', 'stormwyvern'],
  tactics:    ['griffon', 'ratman', 'stormwyvern'],
  eagleeye:   ['wyvern', 'stormwyvern', 'ratman'],
  focus:      ['griffon', 'snowman', 'sewercroc'],
  deadlyvenom:['sludge', 'ratman', 'scorpion'],
  warcry:     ['yeti', 'sewertroll', 'stormwyvern'],
  manashield: ['icesprite', 'snowmaiden'],
  greatheal:  ['snowmaiden', 'icequeen'],
  shieldbag:  ['yeti', 'sewertroll'],
  // 사막·늪지대 (Lv55~)
  tripleshot: ['antlion', 'bandit', 'icequeen'],
  secondwind: ['yeti', 'bandit', 'icequeen'],
  blades:     ['bandit', 'sandworm', 'greatworm'],
  guardian:   ['sandworm', 'greatworm', 'toadking'],
  blizzard:   ['icequeen', 'siren', 'kelpie'],
  smite:      ['greatworm', 'swampwitch', 'siren'],
  rhythm:     ['frogman', 'leech', 'imp', 'greatworm'],
  avalanche:  ['swampthing', 'hydra', 'sandworm'],
  // 메마른 땅·백작의 성 (Lv75~)
  titanblow:  ['ogre', 'ogreking', 'troll', 'skelwar'],
  stormarrows:['hellhound', 'cerberus', 'gargoyle', 'skelarc'],
  vital:      ['succubus', 'vampknight', 'chimera', 'flesh'],
  arcane:     ['evileye', 'chimera', 'skelmage', 'vbat', 'lichking'],
  revival:    ['lichking', 'dracula', 'swampwitch', 'ghoul']
};
const MON_BOOKS = {};   // 몬스터 → 스킬 id 목록
Object.entries(BOOK_MONS).forEach(([sk, list]) => list.forEach(m => { (MON_BOOKS[m] = MON_BOOKS[m] || []).push(sk); }));
const monBooks = id => MON_BOOKS[id] || [];
const bookFrom = sk => BOOK_MONS[sk] || [];
// 지금 잡은 적이 스킬북 하나를 떨어뜨릴 확률 (던전 안·우두머리·주인)
const bookRate = (f, area) => (f.boss && !f.fb ? BOOK_RATE.boss : f.fb ? (f.fb >= 5 ? BOOK_RATE.boss : BOOK_RATE.fb) : area === 'dungeon' ? BOOK_RATE.dungeon : BOOK_RATE.field);
// 도감·창고 설명용: 이 몬스터가 어디서 어떤 확률로 떨어뜨리는지
function bookRateText(mon) {
  const m = MONS[mon]; if (!m) return '';
  if (m.boss && !m.fb) return `${Math.round(BOOK_RATE.boss * 100)}%`;
  return `${BOOK_RATE.field * 100}% · 던전 ${BOOK_RATE.dungeon * 100}% · 우두머리 ${Math.round(BOOK_RATE.fb * 100)}% · 주인 ${Math.round(BOOK_RATE.boss * 100)}%`;
}
