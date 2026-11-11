/* ───────── v0.7: 이웃 왕국 · 초대형 레이드 ───────── */
// 왕국 상단이 찾아와 물건을 대량으로 사 간다. need: 그 필드가 열려야 찾아온다
const KINGDOMS = {
  inglisia: { name: '잉그리시아 왕국', race: '인간', c: '#3f6aa8', c2: '#e8c060', need: null,
    wants: ['wolf_pelt', 'wolf_fang', 'iron_ore', 'lizard_scale', 'kobold_pick', 'golem_core', 'yeti_fur', 'griffon_claw', 'rh_kaishar', 'rh_tempest'],
    desc: '파로스 제국 서쪽의 기사 왕국. 군대에 쓸 가죽과 철을 대량으로 사들인다.' },
  frama: { name: '프라마 왕국', race: '인간', c: '#a8432f', c2: '#f4f0e0', need: null,
    wants: ['rabbit_horn', 'shaman_feather', 'harpy_feather', 'spider_silk', 'maiden_veil', 'sand_silk', 'ratking_crown', 'giant_gem', 'worm_pearl', 'rh_kingslime', 'rh_griffon'],
    desc: '남쪽 바다의 상업 왕국. 사치품과 보석에 돈을 아끼지 않는다.' },
  elves: { name: '엘프 왕국 실바레아', race: '엘프', c: '#3f8a4a', c2: '#e8f0c0', need: 'forest',
    wants: ['herb', 'slime_jelly', 'spore', 'treant_sap', 'bark', 'venom_gland', 'elder_heart', 'snow_essence', 'harpy_feather', 'rh_behemoth'],
    desc: '세계수 너머 엘프들의 왕국. 약초와 숲의 재료를 귀하게 여긴다.' },
  dwarves: { name: '드워프 왕국 브론하임', race: '드워프', c: '#7a5a3a', c2: '#e87a3a', need: 'mountain',
    wants: ['iron_ore', 'kobold_pick', 'golem_core', 'giant_gem', 'lizard_scale', 'frost_crystal', 'wyvern_scale', 'antlion_jaw', 'rh_tempest', 'rh_kaishar'],
    desc: '검은바위산 아래 드워프들의 왕국. 광석과 핵이라면 모조리 사 간다.' },
  sarak: { name: '사라크 술탄국', race: '사막의 민족', c: '#c08a3a', c2: '#3a6aa8', need: 'desert',
    wants: ['scorpion_stinger', 'antlion_jaw', 'sand_silk', 'sandworm_hide', 'worm_pearl', 'storm_heart', 'ice_crown', 'rh_griffon', 'rh_behemoth'],
    desc: '모래바다 건너 술탄의 나라. 진귀한 것이라면 값을 따지지 않는다.' }
};
const KINGDOM_IDS = Object.keys(KINGDOMS);
const FAVOR = [{ at: 0, name: '경계', m: 1.35 }, { at: 30, name: '보통', m: 1.5 }, { at: 70, name: '우호', m: 1.65 }, { at: 130, name: '동맹', m: 1.85 }];
const favorTier = f => FAVOR.reduce((t, x, i) => (f >= x.at ? i : t), 0);

// 초대형 레이드: 달마다 둘이 열리고, 다른 상단과 왕국 원정대가 함께 겨룬다
const RAIDS = {
  kingslime: { name: '킹슬라임', lv: 30, mon: 'kingslime', bg: 'plains', hp: 2.0e6,
    part: ['킹슬라임 왕관 젤리', 600], heart: ['킹슬라임의 심장', 4000], c: '#5ab0f0',
    desc: '평원의 슬라임이 모두 모여 하나가 된 괴물. 왕관을 쓰고 있다.' },
  kaishar: { name: '고블린 소드마스터 카이샤르', lv: 50, mon: 'kaishar', bg: 'forest', hp: 6.0e6,
    part: ['카이샤르의 부러진 검날', 1100], heart: ['소드마스터의 투혼', 7000], c: '#c0392b',
    desc: '천 번의 결투에서 살아남은 고블린 검객. 두 자루 대검을 쓴다.' },
  griffon: { name: '대그리폰', lv: 70, mon: 'raidgriffon', bg: 'valley', hp: 1.3e7,
    part: ['대그리폰의 황금 깃털', 1800], heart: ['대그리폰의 심장', 11000], c: '#f0c24a',
    desc: '바람계곡의 하늘을 다스리는 거대한 그리폰.' },
  tempest: { name: '템페스트 드래곤', lv: 90, mon: 'tempest', bg: 'mountain', hp: 2.2e7,
    part: ['폭풍룡의 뇌린', 2800], heart: ['템페스트 드래곤의 심장', 18000], c: '#7ab8ff',
    desc: '번개 구름을 몰고 다니는 폭풍의 용.' },
  behemoth: { name: '베히모스', lv: 100, mon: 'behemoth', bg: 'snow', hp: 2.8e7,
    part: ['베히모스의 지느러미', 3500], heart: ['베히모스의 네 번째 눈', 25000], c: '#8a7ad8',
    desc: '하늘을 떠다니는 거대한 고래. 눈이 넷, 지느러미가 수없이 많다.' }
};
const RAID_IDS = Object.keys(RAIDS);
RAID_IDS.forEach(id => {
  const R = RAIDS[id];
  ITEMS['rp_' + id] = { name: R.part[0], v: R.part[1], w: 2, icon: 'core', c: R.c, raid: 1 };
  ITEMS['rh_' + id] = { name: R.heart[0], v: R.heart[1], w: 2, icon: 'heart', c: R.c, raid: 2 };
  // 레이드 터: 원정 목적지로 고른다
  FIELDS['raid_' + id] = { no: 0, name: R.name, lv: R.lv, bg: R.bg, tier: Math.min(5, Math.floor(R.lv / 18)), giant: id, mons: [], desc: R.desc,
    dungeon: { name: R.name, bg: R.bg, mons: [], boss: R.mon } };
});
// 신성 장비에는 장비 단계에 맞는 레이드 부속품이 든다
const RAID_FOR_TIER = ['kingslime', 'kingslime', 'kaishar', 'griffon', 'tempest', 'behemoth'];
// 함께 겨루는 다른 상단과 왕국 원정대
const RIVALS = [
  { name: '황금사자 상단', c: '#f0c24a' }, { name: '푸른 돛 상단', c: '#4a8ad8' }, { name: '검은 늪 상단', c: '#5a6a4a' },
  { name: '잉그리시아 왕립 원정대', c: '#3f6aa8', k: 'inglisia' }, { name: '프라마 용병단', c: '#a8432f', k: 'frama' },
  { name: '실바레아 순찰대', c: '#3f8a4a', k: 'elves' }, { name: '브론하임 철벽대', c: '#7a5a3a', k: 'dwarves' }
];
const RAID_REWARD = [
  { gold: 1.0, fame: 40, part: 4, heart: 1, gear: 3, rune: 2 },   // gear = 적어도 이 레어도 (빌드 63 다섯째 묶음: 1등 전설 → 영웅, 그 위는 rollGrade)
  { gold: 0.6, fame: 25, part: 3, heart: 0, gear: 2, rune: 1 },
  { gold: 0.4, fame: 15, part: 2, heart: 0, gear: 0, rune: 1 },
  { gold: 0.15, fame: 5, part: 1, heart: 0, gear: 0, rune: -1 }
];
const raidGold = lv => Math.round(4000 * Math.pow(lv / 30, 1.6) / 50) * 50;

// 레이드 몬스터 (몸집이 커서 그림은 따로 그린다)
Object.assign(MONS, {
  kingslime:   { name: '킹슬라임', plan: 'kingslime', W: 46, H: 40, body: '#5ab0f0', dark: '#2a6aa8', boss: 1, giant: 1, mh: 3, ma: 1.6, md: 1.0, spd: 0.8, aoe: 1, drops: [] },
  kaishar:     { name: '카이샤르', plan: 'swordmaster', W: 34, H: 44, skin: '#6e9e44', cloth: '#5a1a1a', boss: 1, giant: 1, mh: 3, ma: 2.0, md: 1.4, spd: 1.2, eva: 0.12, aoe: 1, drops: [] },
  raidgriffon: { name: '대그리폰', plan: 'giantgriffon', W: 60, H: 52, body: '#c8a050', dark: '#8a6a3a', boss: 1, giant: 1, mh: 3, ma: 1.9, md: 1.3, spd: 1.0, eva: 0.08, aoe: 1, drops: [] },
  tempest:     { name: '템페스트 드래곤', plan: 'dragon', W: 76, H: 62, body: '#3a5a8a', dark: '#1e3050', boss: 1, giant: 1, mh: 3, ma: 2.1, md: 1.6, spd: 0.9, magic: 1, aoe: 1, drops: [] },
  behemoth:    { name: '베히모스', plan: 'whale', W: 112, H: 70, body: '#6a6aa8', dark: '#3a3a6a', boss: 1, giant: 1, fly: 1, mh: 3, ma: 2.2, md: 1.8, spd: 0.75, aoe: 1, drops: [] }
});
