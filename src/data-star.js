/* ───────── 빌드 31: 2차 각성(Lv100 → 150) · 구름섬의 섬 셋 ─────────
   용사(1차 각성)가 Lv100에 2차 각성하면 2차 각성기를 받고 레벨 상한이 150으로 풀린다.
   구름섬 너머의 섬 셋: 천둥 봉우리(Lv120~130) → 천계의 유적 폐허(Lv130~140) → 별의 정원(Lv140~150). 앞 섬의 던전을 공략하면 다음 섬이 열린다. 모두 비행 마차가 있어야 간다. */
const MAX_LV2 = 150;
const lvCap = a => (a && a.hero2 ? MAX_LV2 : MAX_LV);
SKILL_SLOT_LV.push(120, 140);
const AWAKEN2 = { lv: 100, rank: 4, fee: 300000, souls: 4, core: 'core_12', cores: 1 };
const AWK2_SKILLS = {
  awk2_warrior: { name: '천지개벽',      cls: ['warrior'], lv: 1, cost: { mp: 50 }, cd: 40, kind: 'dmg',  mult: 8.0, tgt: 'all', fx: 'jump', crit: 0.25, sta: { k: 'stun', p: 0.5, d: 2.5 }, awk: 2, desc: '2차 각성기. 하늘과 땅을 가르는 일격으로 모든 적을 베고 기절시킨다.' },
  awk2_archer:  { name: '천궁 강림',     cls: ['archer'],  lv: 1, cost: { mp: 50 }, cd: 40, kind: 'dmg',  mult: 2.4, hits: 5, tgt: 'all', fx: 'arrow', crit: 0.2, awk: 2, desc: '2차 각성기. 하늘에서 내려온 활이 모든 적에게 다섯 번 쏟아진다.' },
  awk2_mage:    { name: '별의 종언',     cls: ['mage'],    lv: 1, cost: { mp: 60 }, cd: 40, kind: 'mdmg', mult: 6.0, tgt: 'all', fx: 'fire', sta: { k: 'burn', p: 1, d: 12, m: 0.4 }, awk: 2, desc: '2차 각성기. 별 하나를 떨어뜨려 모든 적을 태운다.' },
  awk2_cleric:  { name: '천상의 기적',   cls: ['cleric'],  lv: 1, cost: { mp: 60 }, cd: 45, kind: 'heal', mult: 4.5, tgt: 'party', cures: STATUS_IDS, reviveAll: 0.5, awk: 2, desc: '2차 각성기. 파티를 크게 치료하고, 쓰러진 동료를 모두 HP 50%로 일으킨다.' },
  awk2_rogue:   { name: '무영참',        cls: ['rogue'],   lv: 1, cost: { mp: 50 }, cd: 40, kind: 'dmg',  mult: 12, tgt: 'low', crit: 1, exec: 1.5, awk: 2, desc: '2차 각성기. 그림자도 남기지 않는 일격. 가장 약한 적을 반드시 치명타로 베고, 다 죽어 가는 적에게는 더 아프다.' },
  awk2_porter:  { name: '대상단의 기적', cls: ['porter'],  lv: 1, cost: { mp: 50 }, cd: 40, kind: 'buff', stat: 'atk', mult: 1.8, haste: 1.3, dur: 12, tgt: 'party', awk: 2, desc: '2차 각성기. 12초 동안 파티의 공격력이 크게 오르고 손이 빨라진다.' }
};
Object.assign(SKILLS, AWK2_SKILLS);
Object.keys(AWK2_SKILLS).forEach(id => SKILL_IDS.push(id));
const awk2SkillOf = a => 'awk2_' + jobBase(a.cls);
const heroTag = a => (a && a.hero2 ? ' <span class="tag gold-t">초월 용사</span>' : a && a.hero ? ' <span class="tag gold-t">용사</span>' : '');
const hallMul = h => (h.hero2 ? 3 : h.hero ? 2 : 1);   // 동상 효과: 용사 ×2, 초월 용사 ×3

/* ───────── 부속품 ───────── */
Object.assign(ITEMS, {
  // 천둥 봉우리
  storm_wisp:     { name: '먹구름 정수',       v: 1100, w: 1, icon: 'blob',   c: '#6a7aa8' },
  bolt_feather:   { name: '번개매 깃',         v: 1150, w: 1, icon: 'wing',   c: '#ffe060' },
  storm_core:     { name: '폭풍 골렘의 핵',    v: 1250, w: 2, icon: 'core',   c: '#8ad8ff' },
  raiju_fang:     { name: '뇌수 송곳니',       v: 1200, w: 1, icon: 'fang',   c: '#c8e0ff' },
  tempest_plate:  { name: '폭풍 기사의 갑편',  v: 1300, w: 3, icon: 'ore',    c: '#4a6ab8' },
  thunder_scale:  { name: '뇌룡의 비늘',       v: 8000, w: 2, icon: 'gem',    c: '#ffe880' },
  storm_crown:    { name: '뇌제의 관',         v: 30000, w: 3, icon: 'crown', c: '#fff4a0' },
  // 천계의 유적 폐허
  ruin_stone:     { name: '수호상의 돌심장',   v: 1400, w: 3, icon: 'core',   c: '#d8c8a0' },
  fallen_feather: { name: '타락한 깃털',       v: 1450, w: 1, icon: 'wing',   c: '#3a3048' },
  seraph_shard:   { name: '천계 갑옷 조각',    v: 1500, w: 2, icon: 'ore',    c: '#f0e8c8' },
  sphinx_mane:    { name: '스핑크스 갈기',     v: 1480, w: 2, icon: 'hide',   c: '#e0b060' },
  ophan_eye:      { name: '오파님의 눈',       v: 1550, w: 1, icon: 'eye',    c: '#ffd040' },
  colossus_rune:  { name: '거상의 룬석',       v: 10000, w: 3, icon: 'gem',   c: '#f0d890' },
  fallen_halo:    { name: '타락한 광륜',       v: 38000, w: 2, icon: 'ring',  c: '#c0a0ff' },
  // 별의 정원
  star_dust:      { name: '별가루',            v: 1700, w: 1, icon: 'gem',    c: '#e8e0ff' },
  moon_fur:       { name: '월광 털',           v: 1750, w: 2, icon: 'hide',   c: '#c8d8ff' },
  nebula_jelly:   { name: '성운 젤리',         v: 1800, w: 1, icon: 'blob',   c: '#b080e0' },
  astral_plate:   { name: '성좌 갑편',         v: 1900, w: 3, icon: 'ore',    c: '#2a3a7a' },
  starbloom:      { name: '별꽃',              v: 1850, w: 1, icon: 'flower', c: '#fff0a0' },
  whale_pearl:    { name: '별고래의 진주',     v: 12000, w: 2, icon: 'gem',   c: '#a8f0ff' },
  star_crown:     { name: '별의 여왕의 왕관',  v: 48000, w: 3, icon: 'crown', c: '#ffffff' }
});

/* ───────── 몬스터 (그림은 pxmon4.js) ───────── */
Object.assign(MONS, {
  // 천둥 봉우리
  stormcloud:   { name: '먹구름 정령',     plan: 'blob',  body: '#5a6a8a', dark: '#2e3a52', mh: 1.8, ma: 1.9, md: 1.0, spd: 1.2, eva: 0.2, magic: 1, minS: 1, sta: { k: 'shock', p: 0.25, d: 3 }, drops: [['storm_wisp', 0.6]] },
  thunderhawk:  { name: '번개매',          plan: 'flyer', body: '#f0d040', dark: '#4a5aa8', mh: 1.6, ma: 2.1, md: 0.9, spd: 1.6, eva: 0.25, minS: 1, sta: { k: 'para', p: 0.2, d: 2.5 }, drops: [['bolt_feather', 0.55]] },
  stormgolem:   { name: '폭풍 골렘',       plan: 'golem', body: '#6a7488', dark: '#3a4054', core: '#8ad8ff', mh: 3.6, ma: 2.0, md: 2.6, spd: 0.6, minS: 3, sta: { k: 'stun', p: 0.18, d: 2 }, drops: [['storm_core', 0.45]] },
  raiju:        { name: '뇌수',            plan: 'quad',  body: '#c8e0ff', dark: '#5a7ac8', mh: 2.2, ma: 2.2, md: 1.2, spd: 1.4, eva: 0.15, minS: 2, sta: { k: 'shock', p: 0.3, d: 3 }, drops: [['raiju_fang', 0.5]] },
  tempestknight:{ name: '폭풍 기사',       plan: 'biped', body: '#4a6ab8', dark: '#22346a', skin: '#e0c8a8', mh: 3.0, ma: 2.3, md: 2.2, spd: 1.0, minS: 5, drops: [['tempest_plate', 0.45]] },
  thunderdragon:{ name: '뇌룡',            plan: 'flyer', body: '#3a4a8a', dark: '#1e2648', beak: '#ffe060', big: 1, fb: 5, scale: 3, mh: 4.4, ma: 2.6, md: 2.2, spd: 1.0, eva: 0.1, aoe: 1, sta: { k: 'shock', p: 0.4, d: 3 }, drops: [['thunder_scale', 0.8], ['storm_wisp', 1, 2]] },
  stormking:    { name: '뇌제 아스트라',   plan: 'biped', body: '#2a3a7a', dark: '#141c40', skin: '#e8d8c0', boss: 1, scale: 2, mh: 10, ma: 3.0, md: 2.4, spd: 1.0, eva: 0.12, magic: 1, aoe: 1, sta: { k: 'shock', p: 0.45, d: 3 }, drops: [['storm_crown', 1], ['tempest_plate', 1, 3]] },
  // 천계의 유적 폐허
  ruinguard:    { name: '유적 수호상',     plan: 'golem', body: '#c8b890', dark: '#7a6a4a', core: '#ffd040', mh: 4.0, ma: 2.2, md: 2.8, spd: 0.55, minS: 1, sta: { k: 'stun', p: 0.18, d: 2 }, drops: [['ruin_stone', 0.5]] },
  fallenangel:  { name: '타락 천사',       plan: 'ghost', body: '#3a3048', dark: '#1a1424', skin: '#e8e0e8', mh: 2.4, ma: 2.5, md: 1.2, spd: 1.2, eva: 0.2, magic: 1, minS: 1, sta: { k: 'weak', p: 0.3, d: 8, m: 0.25 }, drops: [['fallen_feather', 0.55]] },
  seraphknight: { name: '천계 기사의 망령', plan: 'biped', body: '#e8e0c8', dark: '#9a9070', skin: '#c8d0e0', mh: 3.2, ma: 2.4, md: 2.4, spd: 1.0, minS: 2, sta: { k: 'bleed', p: 0.3, d: 8, m: 0.3 }, drops: [['seraph_shard', 0.45]] },
  sphinx:       { name: '스핑크스',        plan: 'quad',  body: '#e0b060', dark: '#9a7030', mh: 3.0, ma: 2.4, md: 1.8, spd: 1.1, magic: 1, minS: 3, sta: { k: 'para', p: 0.25, d: 3 }, drops: [['sphinx_mane', 0.45]] },
  ophan:        { name: '오파님',          plan: 'flyer', body: '#ffd040', dark: '#a87a1a', mh: 2.2, ma: 2.7, md: 1.4, spd: 1.2, eva: 0.2, magic: 1, minS: 5, sta: { k: 'shock', p: 0.3, d: 3 }, drops: [['ophan_eye', 0.45]] },
  colossus:     { name: '천계의 거상',     plan: 'golem', body: '#f0e0b0', dark: '#a89060', core: '#ffffff', fb: 5, scale: 3, mh: 4.8, ma: 2.7, md: 2.6, spd: 0.6, aoe: 1, sta: { k: 'stun', p: 0.3, d: 2 }, drops: [['colossus_rune', 0.8], ['ruin_stone', 1, 2]] },
  fallenarch:   { name: '타락한 대천사',   plan: 'ghost', body: '#2a2038', dark: '#120c1c', skin: '#f0e8f0', boss: 1, scale: 2, mh: 11, ma: 3.2, md: 2.5, spd: 1.0, eva: 0.15, magic: 1, aoe: 1, sta: { k: 'weak', p: 0.45, d: 10, m: 0.3 }, drops: [['fallen_halo', 1], ['fallen_feather', 1, 3]] },
  // 별의 정원
  starsprite:   { name: '별빛 요정',       plan: 'ghost', body: '#e8e0ff', dark: '#8a80c8', skin: '#fff8e8', mh: 2.2, ma: 2.8, md: 1.2, spd: 1.4, eva: 0.28, magic: 1, minS: 1, sta: { k: 'chill', p: 0.3, d: 6, m: 0.3 }, drops: [['star_dust', 0.6]] },
  moonhound:    { name: '월광 사냥개',     plan: 'quad',  body: '#c8d8ff', dark: '#6a7ab8', mh: 2.8, ma: 2.7, md: 1.5, spd: 1.5, eva: 0.15, minS: 1, sta: { k: 'bleed', p: 0.3, d: 8, m: 0.3 }, drops: [['moon_fur', 0.5]] },
  nebula:       { name: '성운 해파리',     plan: 'flyer', body: '#b080e0', dark: '#5a3a8a', mh: 2.6, ma: 2.8, md: 1.3, spd: 1.0, eva: 0.15, magic: 1, minS: 2, sta: { k: 'chill', p: 0.35, d: 6, m: 0.3 }, drops: [['nebula_jelly', 0.5]] },
  constellation:{ name: '성좌 기사',       plan: 'biped', body: '#2a3a7a', dark: '#141c44', skin: '#d8e0ff', mh: 3.6, ma: 2.8, md: 2.6, spd: 1.0, minS: 4, drops: [['astral_plate', 0.45]] },
  startreant:   { name: '별꽃 트렌트',     plan: 'tree',  body: '#3a2a4a', dark: '#1e1428', leaf: '#fff0a0', mh: 4.2, ma: 2.6, md: 2.6, spd: 0.6, minS: 6, sta: { k: 'para', p: 0.2, d: 3 }, drops: [['starbloom', 0.45]] },
  starwhale:    { name: '별고래',          plan: 'flyer', body: '#2a3a6a', dark: '#141c3a', beak: '#a8f0ff', big: 1, fb: 5, scale: 3, mh: 5.2, ma: 2.9, md: 2.6, spd: 0.8, aoe: 1, sta: { k: 'chill', p: 0.4, d: 6, m: 0.35 }, drops: [['whale_pearl', 0.8], ['star_dust', 1, 2]] },
  starqueen:    { name: '별의 여왕 아스테리아', plan: 'ghost', body: '#e8e8ff', dark: '#6a6aa8', skin: '#fff8f0', boss: 1, scale: 2, mh: 12, ma: 3.4, md: 2.6, spd: 1.0, eva: 0.18, magic: 1, aoe: 1, sta: { k: 'chill', p: 0.5, d: 8, m: 0.4 }, drops: [['star_crown', 1], ['star_dust', 1, 3]] }
});

/* ───────── 섬 셋: span 10 (Lv F.lv ~ F.lv+10), 던전 F.lv+6 ~ +10, 주인 F.lv+12 ───────── */
Object.assign(FIELDS, {
  thunder: {
    no: 16, name: '천둥 봉우리', lv: 120, span: 10, bg: 'thunder', tier: 13, after: 'sky', region: 'sky', unlock: '구름 위 신전을 공략하면 열려요',
    desc: '구름섬 너머, 번개가 그치지 않는 바위 봉우리. 먹구름 정령과 번개매가 하늘을 가르고 뇌수가 바위를 뛰어다닌다. 꼭대기 첨탑에는 뇌제가 산다.',
    mons: ['stormcloud', 'thunderhawk', 'raiju', 'stormgolem', 'tempestknight'],
    bosses: ['thunderhawk', 'raiju', 'stormgolem', 'tempestknight', 'thunderdragon'],
    dungeon: { name: '뇌신의 첨탑', bg: 'spire', mons: ['stormcloud', 'stormgolem', 'tempestknight', 'raiju'], boss: 'stormking' },
    next: 'ruins'
  },
  ruins: {
    no: 17, name: '천계의 유적 폐허', lv: 130, span: 10, bg: 'ruins', tier: 14, after: 'thunder', region: 'sky', unlock: '뇌신의 첨탑을 공략하면 열려요',
    desc: '옛 천계의 도시가 무너진 자리. 수호상이 아직도 길을 막고, 날개를 잃은 천사와 천계 기사단의 망령이 떠돈다. 성소 깊은 곳에서 타락한 대천사가 기다린다.',
    mons: ['ruinguard', 'fallenangel', 'seraphknight', 'sphinx', 'ophan'],
    bosses: ['fallenangel', 'sphinx', 'seraphknight', 'ophan', 'colossus'],
    dungeon: { name: '무너진 천계의 성소', bg: 'sanctum', mons: ['ruinguard', 'fallenangel', 'seraphknight', 'ophan'], boss: 'fallenarch' },
    next: 'stargarden'
  },
  stargarden: {
    no: 18, name: '별의 정원', lv: 140, span: 10, bg: 'stargarden', tier: 15, after: 'ruins', region: 'sky', unlock: '무너진 천계의 성소를 공략하면 열려요',
    desc: '하늘의 끝, 별이 꽃처럼 피는 정원. 별빛 요정과 월광 사냥개가 정원을 지키고 성운 해파리가 떠다닌다. 정원 가운데 별의 왕좌에 별의 여왕이 앉아 있다.',
    mons: ['starsprite', 'moonhound', 'nebula', 'constellation', 'startreant'],
    bosses: ['moonhound', 'nebula', 'constellation', 'startreant', 'starwhale'],
    dungeon: { name: '별의 왕좌', bg: 'starthrone', mons: ['starsprite', 'nebula', 'constellation', 'moonhound'], boss: 'starqueen' },
    next: null
  }
});
FIELDS.sky.next = 'thunder';
const STAR_IDS = ['thunder', 'ruins', 'stargarden'];
STAR_IDS.forEach(f => { SKY_IDS.push(f); ALL_FIELDS.push(f); TIER_FIELDS.push(f); });
DUNGEON_GOLD.push(1200000, 1600000, 2200000);
Object.assign(FIELDS.thunder,    { herbs: ['boltbranch', 'ethermoss', 'moonflower'] });
Object.assign(FIELDS.ruins,      { herbs: ['mandrake', 'moonflower', 'ethermoss'] });
Object.assign(FIELDS.stargarden, { herbs: ['moonflower', 'ethermoss', 'snowherb'] });

/* ───────── 장비 단계 · 보스 부속품 · 유물 ───────── */
GTIERS.push(
  { name: '천둥', lv: 120, p: 54.0, smith: 11, mats: ['tempest_plate', 'raiju_fang', 'storm_wisp'] },
  { name: '천계', lv: 130, p: 64.0, smith: 12, mats: ['seraph_shard', 'sphinx_mane', 'fallen_feather'] },
  { name: '성좌', lv: 140, p: 76.0, smith: 13, mats: ['astral_plate', 'moon_fur', 'star_dust'] }
);
BUILDINGS.smithy.max = 13; BUILDINGS.smithy.cost.push(450000, 650000, 900000);
const STAR_BOSS_NAMES = {
  thunder:    ['봉우리 우두머리의 증표', '천둥 봉우리 주인의 핵', '뇌제의 혼'],
  ruins:      ['유적 우두머리의 증표', '천계 유적 주인의 핵', '타락한 대천사의 혼'],
  stargarden: ['정원 우두머리의 증표', '별의 정원 주인의 핵', '별의 여왕의 혼']
};
const STAR_COL = ['#ffe060', '#f0d890', '#c8c8ff'];
STAR_IDS.forEach((fid, i) => {
  const t = TIER_FIELDS.indexOf(fid), [a, b, c] = STAR_BOSS_NAMES[fid];
  BOSS_COL[t] = STAR_COL[i];
  ITEMS['crest_' + t] = { name: a, v: 60 * (t + 1), w: 1, icon: 'crest', c: STAR_COL[i], boss: 1 };
  ITEMS['core_' + t] = { name: b, v: 220 * (t + 1), w: 2, icon: 'core', c: STAR_COL[i], boss: 2 };
  ITEMS['soul_' + t] = { name: c, v: 900 * (t + 1), w: 1, icon: 'soul', c: STAR_COL[i], boss: 3 };
});
Object.assign(RELICS, {
  thunder:    { name: '뇌제의 뿔피리',       desc: '전투 경험치 +8%',          exp: 0.08 },
  ruins:      { name: '대천사의 깃털 망토',  desc: '모험가가 받는 피해 -6%',   guard: 0.06 },
  stargarden: { name: '별의 여왕의 왕관',    desc: '모험가 최대 체력 +10%',    hp: 0.1 }
});
KINGDOMS.inglisia.wants.push('tempest_plate', 'seraph_shard');
KINGDOMS.frama.wants.push('star_dust', 'nebula_jelly', 'ophan_eye');
KINGDOMS.elves.wants.push('starbloom', 'moon_fur', 'fallen_feather');
KINGDOMS.dwarves.wants.push('storm_core', 'ruin_stone', 'astral_plate');
KINGDOMS.sarak.wants.push('sphinx_mane', 'bolt_feather', 'raiju_fang');

STORY.sky = (STORY.sky || []).concat(['구름 위 신전 뒤편, 번개가 치는 봉우리로 이어지는 하늘길이 드러났다. 천둥 봉우리(Lv120)가 열렸다.']);
STORY.thunder = ['뇌제 아스트라가 관을 떨어뜨리자 봉우리의 번개가 멎었다. 먹구름 너머로 무너진 천계의 도시가 보인다.', '뇌제의 뿔피리를 불면 싸움의 기억이 더 또렷해진다. 전투 경험치가 늘었다.'];
STORY.ruins = ['타락한 대천사가 광륜과 함께 부서졌다. 성소의 천장이 갈라지며 별빛이 쏟아진다. 하늘의 끝, 별의 정원으로 가는 길이 열렸다.', '대천사의 깃털 망토는 모험가들을 감싸 상처를 덜어 준다.'];
STORY.stargarden = ['별의 여왕 아스테리아가 왕좌에서 내려왔다. "그대들은 하늘의 끝까지 왔구나." 정원의 별꽃이 일제히 피어난다.', '여왕의 왕관은 모험가들에게 별의 생명력을 나누어 준다. 최대 체력이 늘었다.'];
