/* ───────── 빌드 63: 전투 개편 (11-11 사용자 답 「응 · 다 넣어 · 회피는 기본공격 직업에만 · 마법 저항 새로 둬」) ─────────
   · 새 상태이상 10개: 맹독 · 눈멂 · 수면 · 저주 · 부식 · 공포 · 빙결 · 석화 · 매혹 · 혼란 (색점 · 이름만 — 그림은 없다)
   · 명중: 회피는 기본 공격에만 든다. 스킬(몬스터 스킬 · 광역기 포함)은 눈멂일 때만 20% 빗나간다
   · 몬스터 스킬: 몬스터마다 0~2개 (MSK 틀 + MON_SK 배정), 우두머리 단계(HP 50% 분노 · 25% 마지막 발악)
   · 속성을 양쪽으로: 몬스터의 마법 공격 · 광역기 · 속성 스킬은 그 몬스터 속성 피해 → 모험가 속성 저항(r_불 …)
   · 마법 저항(mres): 마법 피해 −% (로브 · 마법서 · 성표 · 결계의 룬 · 성직자 계열 · 마검사)
   · 어둠 · 악 약점(data-elem.js), 타입별 면역(언데드 · 골렘 · 원소 → 중독 · 맹독 · 출혈), 비행 몬스터(근접 기본 공격 −30%)
   · 지속 피해 스킬은 스킬마다 따로 돈다(core.js f.dots), 탱커(기사 · 성기사) 행동 방해 시간 −30% */

/* ── 상태이상 ── */
Object.assign(STATUS, {
  venom:   { name: '맹독', c: '#2a9a18', tick: 1, stack: 3, desc: '중독이 세 번까지 쌓이고, 쌓일수록 초당 피해가 커진다. 해독으로 풀린다.' },
  blind:   { name: '눈멂', c: '#8a8ab8', desc: '명중 −20%p: 기본 공격도 스킬도 빗나갈 수 있다. 안약 · 해독으로 풀린다.' },
  sleep:   { name: '수면', c: '#9ab8ff', cc: 1, desc: '아무것도 못 한다. 맞으면 깨어난다. 각성 소금으로 깨운다.' },
  curse:   { name: '저주', c: '#a04ad8', desc: '받는 회복이 절반이 되고 재생이 멈춘다. 성수 · 정화로 풀린다.' },
  corrode: { name: '부식', c: '#c8a830', stack: 3, desc: '방어력 −15%, 세 번까지 쌓인다. 강장제로 풀린다.' },
  fear:    { name: '공포', c: '#e86aa0', cc: 1, desc: '공격력 −30%. 몬스터는 30% 확률로 차례를 건너뛴다. 각성 소금 · 결의로 풀린다.' },
  freeze:  { name: '빙결', c: '#5ab0e8', cc: 1, desc: '얼어붙어 아무것도 못 한다. 불 속성에 맞으면 깨지고 그 한 방은 ×1.3. 온열약으로 녹인다.' },
  petrify: { name: '석화', c: '#9a8a70', cc: 1, desc: '돌이 되어 아무것도 못 한다. 그동안 방어력 ×2. 만병통치약으로 풀린다.' },
  charm:   { name: '매혹', c: '#ff7ac8', cc: 1, desc: '기본 공격이 같은 편을 향하고 스킬을 못 쓴다. 맞으면 풀린다.' },
  confuse: { name: '혼란', c: '#60d8b0', cc: 1, desc: '기본 공격의 절반이 같은 편을 향한다. 맞으면 풀린다.' }
});
['venom', 'blind', 'sleep', 'curse', 'corrode', 'fear', 'freeze', 'petrify', 'charm', 'confuse'].forEach(k => { if (!STATUS_IDS.includes(k)) STATUS_IDS.push(k); });   // 같은 배열을 쓰는 「모든 상태이상」 해제(신의 기적 · 불사의 영약 …)에도 들어간다
CC_IDS.push('sleep', 'freeze', 'petrify', 'fear', 'charm', 'confuse');   // 행동 방해: 냉정함 · 탱커 저항 · 각성 소금
const HARD_CC = ['stun', 'sleep', 'freeze', 'petrify'];   // 아무것도 못 함 (대기시간도 멈춘다)
const isHard = st => !!(st && (st.stun || st.sleep || st.freeze || st.petrify));
const DOT_STA = ['poison', 'burn', 'bleed', 'venom'];     // 초당 피해
const STACK_STA = { venom: 3, corrode: 3 };               // 쌓이는 상태이상: 최대 중첩
const ADV_STA = () => STATUS_IDS.filter(k => k !== 'mark');   // 모험가에게 걸리는 것 (표식은 적에게만)
const FIGHT = {
  blind: 0.2,        // 눈멂: 명중 −20%p (기본 공격은 회피에 더하고, 스킬은 20%로 빗나간다)
  fear: 0.7,         // 공포: 모험가 공격력 ×0.7
  fearSkip: 0.3,     // 공포: 몬스터가 차례를 건너뛸 확률
  corrode: 0.15,     // 부식: 중첩마다 방어력 −15%
  curseHeal: 0.5,    // 저주: 받는 회복 ×0.5
  thaw: 1.3,         // 빙결: 불 속성에 맞으면 깨지고 그 한 방 ×1.3
  stone: 2,          // 석화: 방어력 ×2
  confuse: 0.5,      // 혼란: 기본 공격이 같은 편을 향할 확률
  allyHit: 0.5,      // 매혹 · 혼란으로 같은 편을 칠 때 피해 배율 (쓰러뜨리지는 않는다)
  fly: 0.7,          // 비행 몬스터: 근접 기본 공격 ×0.7
  rage: 1.3,         // 우두머리 분노 (HP 50%): 공격 속도 ×1.3
  lastAoe: 0.5,      // 우두머리 마지막 발악 (HP 25%): 광역기 확률 0.3 → 0.5
  lastSummon: 2,     // 마지막 발악 때 부르는 졸개 수
  foeMax: 5,         // 한 싸움에 서 있는 몬스터 상한 (부르기)
  mresMax: 0.6,      // 마법 저항 상한
  resMax: 0.75,      // 속성 저항 상한
  tankCc: 0.3,       // 기사 · 성기사: 행동 방해 시간 −30%
  skUse: 0.75        // 몬스터 스킬: 준비됐을 때 차례마다 쓸 확률
};
// 타입별 면역: 언데드 · 골렘 · 원소는 중독 · 맹독 · 출혈에 걸리지 않는다 (몸에 피와 숨이 없다)
const STA_TYPE_IMM = { poison: ['undead', 'construct', 'elemental'], venom: ['undead', 'construct', 'elemental'], bleed: ['undead', 'construct', 'elemental'] };
const staTypeImm = (k, f) => !!(f && !f.pvp && STA_TYPE_IMM[k] && monTypes(f.id).some(t => STA_TYPE_IMM[k].includes(t)));
// 지속 피해 스킬이 어떤 독인지 (타입 면역에 쓴다)
const DOT_KIND = { poisonarrow: 'poison', venom: 'poison', deadlyvenom: 'poison', poisonblade: 'poison', miasma: 'poison', epidemic: 'poison', blackdeath: 'poison', trap: 'bleed', snare: 'bleed' };
Object.entries(DOT_KIND).forEach(([id, k]) => { if (SKILLS[id]) SKILLS[id].dk = k; });

/* ── 비행 몬스터 · 공격 속성 ── */
const FLY = ['bat', 'vbat', 'firebat', 'harpy', 'griffon', 'raidgriffon', 'wyvern', 'stormwyvern', 'tempest', 'skyray', 'thunderbird', 'pegasus', 'thunderhawk', 'stormcloud', 'thunderdragon',
  'wisp', 'banshee', 'evileye', 'imp', 'succubus', 'fallenangel', 'fallenarch', 'ophan', 'starsprite', 'nebula', 'skyemperor', 'icesprite'];
FLY.forEach(id => { if (MONS[id]) MONS[id].fly = 1; });
const isFly = f => !!(f && !f.pvp && MONS[f.id] && MONS[f.id].fly);
const MON_ATK_EL = { lavagolem: 'blaze', stormgolem: 'thunder', skyemperor: 'light' };   // 속성이 둘인 몬스터가 때리는 속성
const fAtkEl = f => (!f || f.pvp ? 'none' : MON_ATK_EL[f.id] || (MONS[f.id] && MONS[f.id].el && MONS[f.id].el[0]) || 'none');
const elFam = el => (ELEMS[el] || ELEMS.none).fam;
const RES_FAMS = ['fire', 'water', 'wind', 'earth', 'thunder', 'steel', 'light', 'dark'];
const RES_NAME = { fire: '불·화염', water: '물·빙결', wind: '바람·폭풍', earth: '흙', thunder: '번개', steel: '강철', light: '빛·신성', dark: '어둠·악' };
RES_FAMS.forEach(f => { STAT_NAMES['r_' + f] = RES_NAME[f] + ' 저항'; PCT_STATS.push('r_' + f); });
STAT_NAMES.mres = '마법 저항'; PCT_STATS.push('mres');
// 빌드 64 룬 개편: 무기 룬의 속성 피해 (d_불 계열 …) · 명중 · 기본 공격 방어 · 행동 방해 시간 · 눈멂 걸기 / 저항 · 주는 / 받는 회복 · 흡혈 · MP 회복 · 최대 MP
RES_FAMS.forEach(f => { STAT_NAMES['d_' + f] = RES_NAME[f] + ' 피해'; PCT_STATS.push('d_' + f); });
Object.assign(STAT_NAMES, { hit: '명중', bblock: '기본 공격 방어 확률', ccRes: '행동 방해 시간', blindHit: '기본 공격 눈멂', blindRes: '눈멂 저항', healPow: '주는 회복', rheal: '받는 회복', lifesteal: '흡혈', mpRegen: 'MP 회복 속도', mpPct: '최대 MP' });
PCT_STATS.push('hit', 'bblock', 'ccRes', 'blindHit', 'blindRes', 'healPow', 'rheal', 'lifesteal', 'mpRegen', 'mpPct');
// 속성 스킬 · 숨결이 거는 상태이상 (MSK의 sta: 'el')
const EL_STA = { fire: { k: 'burn', p: 0.35, d: 8, m: 0.2 }, blaze: { k: 'burn', p: 0.45, d: 8, m: 0.25 }, water: { k: 'chill', p: 0.35, d: 5 }, ice: { k: 'chill', p: 0.45, d: 5 },
  thunder: { k: 'shock', p: 0.3, d: 3 }, storm: { k: 'shock', p: 0.25, d: 2.5 }, wind: { k: 'blind', p: 0.25, d: 4 }, earth: { k: 'stun', p: 0.15, d: 1.5 },
  steel: { k: 'bleed', p: 0.3, d: 6, m: 0.2 }, dark: { k: 'curse', p: 0.35, d: 8 }, evil: { k: 'curse', p: 0.45, d: 8 }, light: { k: 'blind', p: 0.35, d: 5 }, holy: { k: 'blind', p: 0.35, d: 5 } };

/* ── 몬스터 스킬 ──
   kind: hit 한 명 · all 모두 · drain 흡혈 · buff 자기 강화 · rally 동료 모두 강화 · heal 가장 다친 동료(self면 자기) · shield 자기 보호막 · summon 졸개 부르기
   mult 피해(기본 공격 1) · cd 재사용(초) · magic 마법(방어 절반 · 마법 저항) · el 'self'면 그 몬스터 속성 · sta 상태이상('el'이면 속성에 맞는 것) */
const MSK = {
  hit:     { name: '강타',        kind: 'hit', mult: 1.9, cd: 12 },
  bite:    { name: '물어뜯기',    kind: 'hit', mult: 1.5, cd: 11, sta: { k: 'bleed', p: 0.6, d: 6, m: 0.25 } },
  gore:    { name: '들이받기',    kind: 'hit', mult: 1.6, cd: 13, sta: { k: 'stun', p: 0.35, d: 1.5 } },
  stab:    { name: '급소 찌르기', kind: 'hit', mult: 2.0, cd: 13, crit: 0.25, sta: { k: 'bleed', p: 0.7, d: 8, m: 0.3 } },
  poison:  { name: '독침',        kind: 'hit', mult: 1.3, cd: 11, sta: { k: 'poison', p: 0.8, d: 8, m: 0.3 } },
  venom:   { name: '맹독',        kind: 'hit', mult: 1.2, cd: 12, sta: { k: 'venom', p: 0.8, d: 10, m: 0.15 } },
  acid:    { name: '산성 침',     kind: 'hit', mult: 1.2, cd: 12, sta: { k: 'corrode', p: 0.85, d: 10 } },
  blind:   { name: '눈 가리기',   kind: 'hit', mult: 1.0, cd: 14, sta: { k: 'blind', p: 0.85, d: 6 } },
  para:    { name: '마비 침',     kind: 'hit', mult: 1.1, cd: 15, sta: { k: 'para', p: 0.6, d: 3 } },
  drain:   { name: '흡혈',        kind: 'drain', mult: 1.4, cd: 12, heal: 0.6 },
  bolt:    { name: '마력 탄',     kind: 'hit', mult: 1.8, cd: 11, magic: 1, el: 'self' },
  curse:   { name: '저주',        kind: 'hit', mult: 1.0, cd: 15, magic: 1, el: 'self', sta: { k: 'curse', p: 0.85, d: 10 } },
  hex:     { name: '약화 주문',   kind: 'hit', mult: 1.0, cd: 14, magic: 1, el: 'self', sta: { k: 'weak', p: 0.8, d: 8 } },
  freeze:  { name: '얼려 버리기', kind: 'hit', mult: 1.3, cd: 16, magic: 1, el: 'self', sta: { k: 'freeze', p: 0.5, d: 3 } },
  petrify: { name: '석화의 눈빛', kind: 'hit', mult: 0.9, cd: 18, magic: 1, el: 'self', sta: { k: 'petrify', p: 0.5, d: 4 } },
  charm:   { name: '매혹',        kind: 'hit', mult: 0.6, cd: 18, magic: 1, el: 'self', sta: { k: 'charm', p: 0.65, d: 5 } },
  roar:    { name: '포효',        kind: 'all', mult: 0.5, cd: 18, sta: { k: 'fear', p: 0.45, d: 6 } },
  sleep:   { name: '잠의 노래',   kind: 'all', mult: 0.35, cd: 20, magic: 1, el: 'self', sta: { k: 'sleep', p: 0.45, d: 6 } },
  confuse: { name: '혼란',        kind: 'all', mult: 0.5, cd: 18, magic: 1, el: 'self', sta: { k: 'confuse', p: 0.4, d: 4 } },
  flash:   { name: '눈부신 빛',   kind: 'all', mult: 0.5, cd: 18, magic: 1, el: 'self', sta: { k: 'blind', p: 0.5, d: 6 } },
  breath:  { name: '숨결',        kind: 'all', mult: 0.8, cd: 16, magic: 1, el: 'self', sta: 'el' },
  storm:   { name: '폭풍',        kind: 'all', mult: 0.75, cd: 16, magic: 1, el: 'self', sta: 'el' },
  quake:   { name: '땅 구르기',   kind: 'all', mult: 0.7, cd: 16, el: 'self', sta: { k: 'stun', p: 0.2, d: 1.5 } },
  sweep:   { name: '휩쓸기',      kind: 'all', mult: 0.7, cd: 14 },
  miasma:  { name: '독 안개',     kind: 'all', mult: 0.4, cd: 18, magic: 1, sta: { k: 'poison', p: 0.6, d: 8, m: 0.2 } },
  hexall:  { name: '저주의 파동', kind: 'all', mult: 0.5, cd: 18, magic: 1, el: 'self', sta: { k: 'curse', p: 0.5, d: 10 } },
  rage:    { name: '분노',        kind: 'buff', stat: 'atk', mul: 1.3, dur: 10, cd: 22 },
  guard:   { name: '단단해지기',  kind: 'buff', stat: 'def', mul: 1.5, dur: 10, cd: 20 },
  haste:   { name: '질풍',        kind: 'buff', stat: 'spd', mul: 1.4, dur: 8, cd: 20 },
  howl:    { name: '울부짖음',    kind: 'rally', stat: 'atk', mul: 1.2, dur: 10, cd: 22 },
  mend:    { name: '치유',        kind: 'heal', pct: 0.2, cd: 16 },
  regen:   { name: '재생',        kind: 'heal', pct: 0.15, cd: 18, self: 1 },
  shield:  { name: '보호막',      kind: 'shield', pct: 0.2, cd: 22 },
  summon:  { name: '부르기',      kind: 'summon', n: 1, max: 2, cd: 28 }
};
// 몬스터마다: [틀, 이름, 덮어쓸 값]
const MON_SK = {
  // 평원 · 곡물 창고
  rat: [['bite', '앞니 물기']], slime: [['acid', '산성 점액']], rabbit: [['gore', '뿔 들이받기']], wolf: [['bite', '물어뜯기'], ['howl', '울부짖음']], goblin: [['blind', '모래 뿌리기']],
  ratking: [['summon', '쥐 떼 부르기', { mon: ['rat'], n: 2 }], ['bite', '이빨 갈기']],
  // 원시림 · 썩은 뿌리 동굴
  myconid: [['sleep', '잠의 포자']], spider: [['para', '거미줄 쏘기']], sapling: [['para', '뿌리 휘감기']], shaman: [['curse', '저주의 주문'], ['mend', '주술 치유']],
  elder: [['summon', '묘목 부르기', { mon: ['sapling'], n: 2 }], ['sleep', '잠의 꽃가루']],
  // 검은바위산 · 드워프 갱도
  lizard: [['blind', '흙먼지 꼬리'], ['guard', '비늘 세우기']], bat: [['confuse', '초음파', { magic: 0 }]], kobold: [['blind', '광석 가루']], golem: [['guard', '돌 갑옷'], ['quake', '땅 구르기']],
  giant: [['hit', '바위 던지기', { mult: 2.2, sta: { k: 'stun', p: 0.4, d: 2 } }], ['summon', '돌 골렘 부르기', { mon: ['golem'], n: 1 }]],
  // 바람계곡 · 와이번 둥지
  harpy: [['flash', '깃털 바람', { magic: 0, sta: { k: 'blind', p: 0.4, d: 5 } }]], windwolf: [['bite', '바람 송곳니'], ['haste', '질풍']], griffon: [['gore', '급강하']], wyvern: [['venom', '독꼬리']],
  stormwyvern: [['venom', '독꼬리'], ['roar', '폭풍의 포효']],
  // 만년설산 · 얼어붙은 신전
  snowman: [['freeze', '눈덩이 던지기', { magic: 0 }]], icesprite: [['freeze', '서리 감옥']], yeti: [['roar', '설산의 포효'], ['hit', '내려찍기']], snowmaiden: [['charm', '눈의 미소']], alpgoat: [['gore', '박치기']],
  icequeen: [['freeze', '얼음 감옥', { mult: 1.6, sta: { k: 'freeze', p: 0.6, d: 3 } }], ['summon', '얼음 정령 부르기', { mon: ['icesprite'], n: 2 }]],
  // 사라크 사막 · 왕릉
  scorpion: [['venom', '맹독 꼬리']], antlion: [['para', '모래 수렁']], bandit: [['blind', '눈에 모래']], sandworm: [['hit', '집어삼키기', { mult: 2.0, sta: { k: 'stun', p: 0.3, d: 2 } }]],
  greatworm: [['summon', '샌드웜 부르기', { mon: ['sandworm'], n: 1 }], ['acid', '산성 체액']],
  // 7번가 뒷골목 · 암살자 길드
  assassin: [['stab', '급소 찌르기']], poisoner: [['venom', '맹독 바늘']], enforcer: [['hit', '몽둥이 찜질', { sta: { k: 'stun', p: 0.3, d: 1.5 } }]],
  officer: [['howl', '돌격 명령'], ['stab', '이중 베기', { hits: 2, mult: 1.1 }]], blackhood: [['flash', '연막탄', { magic: 0, el: null }], ['stab', '그림자 찌르기']],
  // 레이드 (부르기 없음)
  kingslime: [['acid', '산성 홍수', { kind: 'all', mult: 0.6 }], ['guard', '젤리 굳히기']], kaishar: [['stab', '연속 베기', { hits: 3, mult: 0.8 }], ['rage', '검귀의 분노']],
  raidgriffon: [['gore', '급강하'], ['storm', '폭풍 날개']], tempest: [['storm', '폭풍 숨결'], ['roar', '천둥 포효']], behemoth: [['quake', '대지 진동'], ['rage', '분노']],
  // 지하수로
  sewerrat: [['bite', '병균 물기', { sta: { k: 'poison', p: 0.6, d: 8, m: 0.25 } }]], sludge: [['acid', '오물 뿌리기']], sewercroc: [['bite', '물고 비틀기', { mult: 1.8 }]], ratman: [['blind', '눈 할퀴기']],
  sewertroll: [['regen', '재생'], ['hit', '내려찍기', { sta: { k: 'stun', p: 0.35, d: 2 } }]],
  // 눅눅한 늪지대 · 마녀의 오두막
  frogman: [['para', '혀 휘감기']], leech: [['drain', '피 빨기']], kelpie: [['charm', '홀리는 갈기']], siren: [['sleep', '세이렌의 노래']], swampthing: [['miasma', '늪 안개']],
  toadking: [['hit', '짓누르기', { sta: { k: 'stun', p: 0.3, d: 2 } }]], anaconda: [['para', '휘감기', { mult: 1.4 }]],
  hydra: [['breath', '물 숨결'], ['regen', '머리 다시 돋기']],
  swampwitch: [['curse', '마녀의 저주'], ['summon', '거머리 부르기', { mon: ['leech'], n: 2 }]],
  // 메마른 땅 · 키메라 연구소
  imp: [['bolt', '불꽃 화살']], hellhound: [['breath', '불 숨결']], troll: [['regen', '재생'], ['hit', '내려찍기', { sta: { k: 'stun', p: 0.3, d: 1.5 } }]], ogre: [['rage', '분노']],
  cerberus: [['breath', '세 머리 불길'], ['roar', '지옥의 포효']], ogreking: [['howl', '전쟁 함성'], ['rage', '분노']], flesh: [['acid', '부패 체액']],
  chimera: [['venom', '뱀꼬리 독'], ['roar', '사자 포효']],
  // 백작의 성 · 지하 고문실
  vbat: [['drain', '흡혈']], ghoul: [['para', '마비 손톱']], gargoyle: [['petrify', '석화의 눈빛'], ['guard', '돌 피부']], evileye: [['confuse', '혼란의 시선']],
  succubus: [['charm', '매혹'], ['drain', '생기 흡수', { magic: 1 }]], vampknight: [['drain', '피의 일격', { mult: 1.6 }]],
  dracula: [['charm', '매혹의 눈'], ['summon', '박쥐 부르기', { mon: ['vbat'], n: 2 }]],
  skelwar: [['hit', '방패 치기', { sta: { k: 'stun', p: 0.3, d: 1.5 } }]], skelarc: [['curse', '저주 화살', { magic: 0 }]], skelmage: [['curse', '뼈의 저주']],
  lichking: [['freeze', '죽음의 서리'], ['summon', '해골 부르기', { mon: ['skelwar', 'skelarc'], n: 2 }]],
  // 안개 묘지 · 잊힌 지하 묘소
  wisp: [['confuse', '홀림불']], zombie: [['venom', '썩은 이빨']], banshee: [['roar', '통곡', { magic: 1 }]], wraith: [['curse', '망령의 일격', { magic: 0, mult: 1.5 }]], ghosttree: [['sleep', '원혼의 자장가']],
  reaper: [['roar', '죽음의 선고', { magic: 1 }], ['curse', '영혼 수확']], mummy: [['curse', '파라오의 저주'], ['para', '붕대 감기']],
  deathknight: [['roar', '공포의 함성'], ['summon', '망령 기사 부르기', { mon: ['wraith'], n: 1 }]],
  // 용암 화산 · 불의 심장 화구
  magmaslime: [['acid', '용암 튀기기']], firebat: [['blind', '불티 날리기']], salamander: [['breath', '불길']],
  lavagolem: [['guard', '용암 갑옷'], ['hit', '용암 주먹', { el: 'self', sta: { k: 'burn', p: 0.5, d: 8, m: 0.25 } }]], redhare: [['gore', '돌진'], ['haste', '질풍']],
  efreet: [['bolt', '화염탄', { sta: { k: 'burn', p: 0.5, d: 8, m: 0.25 } }]], magmadragon: [['roar', '화산의 포효'], ['rage', '분노']],
  firelord: [['bolt', '대화염탄', { mult: 2.2, sta: { k: 'burn', p: 0.6, d: 10, m: 0.3 } }], ['summon', '마그마 부르기', { mon: ['magmaslime'], n: 2 }]],
  // 세계수 뿌리 · 세계수의 심장
  rootspider: [['para', '거미줄']], treantguard: [['guard', '나무 갑옷'], ['mend', '수액 치유']], dryad: [['charm', '숲의 유혹'], ['mend', '치유의 이슬']],
  mossgolem: [['guard', '이끼 갑옷'], ['sleep', '포자 구름', { magic: 0 }]], rootworm: [['acid', '산성 침']], worldserpent: [['venom', '맹독 독니'], ['petrify', '뱀의 눈']],
  corruptheart: [['summon', '뿌리 거미 부르기', { mon: ['rootspider'], n: 2 }], ['hexall', '타락의 저주']],
  // 구름섬 · 구름 위 신전
  cloudsheep: [['sleep', '구름 솜털', { magic: 0 }]], skyray: [['para', '꼬리 침']], thunderbird: [['storm', '천둥 날개']], pegasus: [['gore', '천마 돌진'], ['haste', '질풍']],
  cloudgiant: [['flash', '안개 뿜기', { magic: 0 }], ['hit', '구름 주먹']], skyknight: [['hit', '창 돌격', { sta: { k: 'stun', p: 0.3, d: 1.5 } }], ['guard', '방패 들기']],
  skytitan: [['roar', '천둥 포효'], ['rage', '분노']], skyemperor: [['flash', '눈부신 빛'], ['summon', '하늘 기사 부르기', { mon: ['skyknight'], n: 1 }]],
  // 보물 던전
  mimic: [['hit', '덥석 물기', { mult: 2.0, sta: { k: 'para', p: 0.5, d: 2.5 } }]], goldgolem: [['guard', '황금 갑옷'], ['flash', '황금 광채', { magic: 0 }]],
  treasureguard: [['summon', '미믹 부르기', { mon: ['mimic'], n: 1 }], ['quake', '땅 울림']],
  // 천둥 봉우리 · 뇌신의 첨탑
  stormcloud: [['storm', '낙뢰']], thunderhawk: [['gore', '번개 급강하']], raiju: [['bolt', '뇌전 덮치기', { sta: { k: 'shock', p: 0.4, d: 3 } }]],
  stormgolem: [['guard', '강철 피부'], ['quake', '천둥 발구르기']], tempestknight: [['hit', '폭풍 찌르기', { sta: { k: 'stun', p: 0.3, d: 1.5 } }], ['howl', '돌격 나팔']],
  thunderdragon: [['roar', '천둥 포효'], ['rage', '분노']],
  stormking: [['bolt', '번개 창', { mult: 2.2, sta: { k: 'shock', p: 0.5, d: 3 } }], ['summon', '폭풍 기사 부르기', { mon: ['tempestknight'], n: 1 }]],
  // 천계의 유적 폐허 · 무너진 성소
  ruinguard: [['petrify', '석화의 빛'], ['guard', '돌 피부']], fallenangel: [['curse', '타락의 저주']], seraphknight: [['hit', '천벌 베기', { sta: { k: 'stun', p: 0.3, d: 1.5 } }], ['guard', '빛의 갑주']],
  sphinx: [['petrify', '수수께끼의 눈'], ['confuse', '수수께끼']], ophan: [['flash', '눈부신 바퀴']], colossus: [['quake', '거상의 발걸음'], ['guard', '빛의 갑주']],
  fallenarch: [['hexall', '대천사의 저주'], ['summon', '타락 천사 부르기', { mon: ['fallenangel'], n: 1 }]],
  // 별의 정원 · 별의 왕좌
  starsprite: [['sleep', '별의 자장가'], ['mend', '별빛 치유']], moonhound: [['bite', '월광 송곳니'], ['howl', '달 울음']], nebula: [['blind', '먹물 성운', { magic: 1 }], ['para', '촉수']],
  constellation: [['hit', '별의 일격', { sta: { k: 'stun', p: 0.3, d: 1.5 } }], ['howl', '성좌의 호령']], startreant: [['sleep', '별꽃 향기', { magic: 0 }], ['guard', '나무 갑옷']],
  starwhale: [['quake', '꼬리 내려치기'], ['sleep', '고래의 노래']],
  starqueen: [['freeze', '별빛 감옥', { mult: 1.6, sta: { k: 'freeze', p: 0.6, d: 3 } }], ['summon', '별빛 요정 부르기', { mon: ['starsprite'], n: 2 }]]
};
// 몬스터마다 풀어 둔 스킬 목록: MONS[id].msk = [{ id, name, kind, … }]
Object.entries(MON_SK).forEach(([mid, list]) => {
  const m = MONS[mid]; if (!m) return;
  m.msk = list.map(([tpl, name, o], i) => {
    const s = Object.assign({}, MSK[tpl], o || {}, { id: tpl + i, tpl, name: name || MSK[tpl].name });
    if (s.el === 'self') { s.el = null; s.self = 1; }   // 그 몬스터의 공격 속성
    if (s.kind === 'summon' && (m.giant || !s.mon)) return null;
    return s;
  }).filter(Boolean);
});
const monSkills = f => (f && !f.pvp && MONS[f.id] && MONS[f.id].msk) || [];
// 스킬이 때리는 속성: 'self'면 그 몬스터 속성 · 정해 둔 것 · 없으면 무속성 (마법이나 모두를 치는 스킬은 몬스터 속성을 따른다)
const mskEl = (s, f) => (s.self || ((s.kind === 'all' || s.magic) && s.el === undefined) ? fAtkEl(f) : s.el || 'none');
const mskSta = (s, f) => (s.sta === 'el' ? EL_STA[mskEl(s, f)] || null : s.sta || null);

/* ── 새 치료 소모품 · 조제법 ── */
Object.assign(ITEMS, {
  eyedrop:  { name: '안약', v: 60, w: 1, icon: 'potion', c: '#a8c8ff', sup: 1, cure: ['blind'], desc: '눈에 넣으면 눈멂이 걷힌다.' },
  holyvial: { name: '성수', v: 90, w: 1, icon: 'potion', c: '#f8f0c8', sup: 1, cure: ['curse'], desc: '신전에서 축복한 물. 저주를 씻어 낸다.' }
});
ITEMS.antidote.cure.push('venom'); ITEMS.antidote.desc = '중독과 맹독을 푼다.';
ITEMS.warmer.cure.push('freeze'); ITEMS.warmer.desc = '얼어붙은 몸을 덥혀 냉기와 빙결을 푼다.';
ITEMS.salts.cure.push('sleep', 'fear', 'charm', 'confuse'); ITEMS.salts.desc = '코를 찌르는 냄새로 마비 · 기절 · 수면 · 공포 · 매혹 · 혼란을 깨운다.';
ITEMS.tonic.cure.push('corrode'); ITEMS.tonic.desc = '쇠약해진 몸에 기운을 돌려주고 부식을 씻는다.';
ITEMS.panacea.cure = ADV_STA(); ITEMS.panacea.desc = '어떤 상태이상이든 하나 푼다 (석화까지).';
[CURE_IDS, SUPPLY_IDS].forEach(L => { const i = L.indexOf('panacea'); L.splice(i < 0 ? L.length : i, 0, 'eyedrop', 'holyvial'); });
RECIPES.push(
  { out: 'eyedrop',  need: { herb: 1, waterherb: 1 },               fee: 10, lv: 1 },
  { out: 'holyvial', need: { moonflower: 1, waterherb: 1 },         fee: 25, lv: 2 }
);

/* ── 모험가 쪽: 저항 · 치료 · 스킬 ── */
Object.assign(TRAITS.calm, { desc: '행동 방해(기절 · 마비 · 수면 · 빙결 · 석화 · 공포 · 매혹 · 혼란 · 냉기 · 감전) 시간 -50%' });
Object.assign(TRAITS.fireproof, { desc: '화상 피해 -50% · 불·화염 피해 -25%', r_fire: 0.25 });
Object.assign(TRAITS, {
  frostproof: { name: '추위에 강함', desc: '물·빙결 피해 -25% · 빙결 시간 -50%', r_water: 0.25, resFreeze: 0.5 },
  warded:     { name: '마력 저항',   desc: '마법 피해 -10%',                    mres: 0.10 }
});
['frostproof', 'warded'].forEach(t => { if (!TRAIT_IDS.includes(t)) TRAIT_IDS.push(t); if (!ROLL_TRAIT_IDS.includes(t)) ROLL_TRAIT_IDS.push(t); });
// 탱커: 앞줄이 행동 방해에 묶이지 않게
['knight', 'paladin'].forEach(c => { const T = CLASSES[c].tr || (CLASSES[c].tr = {}); T.ccRes = FIGHT.tankCc; });
// 마법 저항: 직업 (성직자 계열 · 마검사 · 마검성 · 성기사)
const MRES_JOB = { cleric: 0.08 }, MRES_CLS = { spellblade: 0.08, arcblade: 0.12, paladin: 0.06 };
const mresJob = a => (MRES_CLS[a.cls] || 0) + (MRES_JOB[jobBase(a.cls)] || 0);
// 장비: 로브 · 마법서 · 성표에 마법 저항 (단계 힘을 곱하고 한 점에 12%까지)
GTYPES.robe.st.mres = 0.004; GTYPES.tome.st.mres = 0.002; GTYPES.relic.st.mres = 0.003;
// 룬: 빌드 63의 결계 · 내화 · 내한 · 피뢰 · 정결은 빌드 64 룬 개편에서 마력 · 화염 · 냉기 · 번개 · 어둠으로 합쳤다 (data-gear.js RUNES · migrate13)
// 세트 속성 저항(같은 단계 장비 → 그 땅에 많은 속성 저항)은 세트 효과와 함께 없앴다 (빌드 65)
// 도시락: 뜨거운 수프 → 물·빙결 피해 −10%, 얼음 빙수 → 불·화염 피해 −10%
['hotsoup', 'shaveice'].forEach((id, i) => { const t = i ? ' 불·화염 피해 -10%.' : ' 물·빙결 피해 -10%.'; FOODS[id].desc += t; if (ITEMS['food_' + id]) ITEMS['food_' + id].desc += t; });
const FOOD_RES = { coldRes: 'water', hotRes: 'fire' };

// 스킬: 기절 일부를 새 상태이상으로 · 저주 · 부식 · 맹독 · 공포 · 치료
const SK63 = {
  lullaby:     { sta: { k: 'sleep', p: 0.45, d: 6 }, desc: '모든 적을 재운다. 잠든 적은 맞으면 깬다.' },
  iceprison:   { sta: { k: 'freeze', p: 0.7, d: 3 }, desc: '적을 얼려 3초 동안 아무것도 못 하게 한다. 불 속성에 맞으면 깨지며 크게 다친다.' },
  frostflask:  { sta: { k: 'freeze', p: 0.35, d: 2.5 }, desc: '빙결 속성. 깨지면 모든 적을 얼린다. 얼어붙은 적은 불에 맞으면 깨진다.' },
  flasharrow:  { sta: { k: 'blind', p: 0.85, d: 6 }, desc: '빛 속성. 화살촉이 터지며 적의 눈을 멀게 한다(명중 −20%p).' },
  flashbang:   { sta: { k: 'blind', p: 0.85, d: 6 }, desc: '빛 속성. 눈부신 섬광으로 모든 적의 눈을 멀게 한다. 어둠·악에 잘 듣는다.' },
  requiem:     { sta: { k: 'sleep', p: 0.3, d: 5 } },
  ragnarok:    { sta: { k: 'fear', p: 0.6, d: 6 }, desc: 'HP를 크게 깎아 세상을 끝낼 듯 휘두른다. 살아남은 적은 겁에 질린다.' },
  curse:       { sta: { k: 'curse', p: 1, d: 10 } },
  sa_curse:    { sta: { k: 'curse', p: 0.6, d: 8 } },
  deathwave:   { sta: { k: 'corrode', p: 0.5, d: 8 } },
  transmute:   { sta: { k: 'corrode', p: 0.4, d: 8 } },
  deadlyvenom: { sta: { k: 'venom', p: 0.6, d: 10, m: 0.15 } },
  epidemic:    { sta: { k: 'venom', p: 0.4, d: 8, m: 0.15 } },
  purify:      { pcures: ['curse'], desc: '성스러운 빛으로 적을 태우고, 파티에 걸린 저주를 씻어 낸다.' },
  resolve:     { cures: ['fear'], desc: '8초 동안 파티의 방어 확률을 올리고 공포를 떨쳐 낸다.' }
};
Object.entries(SK63).forEach(([id, o]) => { if (SKILLS[id]) Object.assign(SKILLS[id], o); });
if (SKILLS.cure) { SKILLS.cure.cures = ['poison', 'venom', 'weak', 'blind']; SKILLS.cure.desc = '파티의 중독 · 맹독 · 쇠약 · 눈멂을 푼다.'; }
if (SKILLS.el_breath) SKILLS.el_breath.cures = ['poison', 'venom', 'bleed'];
if (SKILLS.panacea) SKILLS.panacea.cures = ['poison', 'venom', 'burn', 'bleed', 'weak', 'corrode'];

STORY.v63 = [
  '전투가 새로워졌다. 몬스터도 스킬을 쓰고, 상태이상이 열 가지 늘었다.',
  '몬스터 스킬: 몬스터마다 0~2개를 대기시간에 맞춰 쓴다 — 강타 · 물어뜯기 · 독침 · 포효 · 숨결 · 저주 · 매혹 · 치유 · 보호막 · 졸개 부르기 같은 것. 쓰면 머리 위에 스킬 이름이 뜬다.',
  '우두머리(필드 우두머리 · 던전 주인 · 레이드)는 HP 50%에서 분노해 공격이 30% 빨라지고, 25%에서 마지막 발악으로 광역기를 더 자주 쓰며 졸개를 부른다.',
  '새 상태이상: 맹독(쌓이는 독) · 눈멂(명중 −20%p) · 수면(맞으면 깸) · 저주(받는 회복 절반) · 부식(방어 −15%, 세 번까지) · 공포(공격 −30%) · 빙결(불에 맞으면 깨짐) · 석화(방어 ×2) · 매혹 · 혼란(같은 편을 침).',
  '회피는 기본 공격에만 든다. 스킬과 광역기는 빗나가지 않고, 눈멀었을 때만 20% 빗나간다.',
  '몬스터의 마법 공격과 광역기에 속성이 붙었다. 마법 저항(로브 · 마법서 · 성표 · 결계의 룬 · 성직자 계열 · 마검사)과 속성 저항(같은 단계 장비 3점 · 4점 세트 · 내화 · 내한 · 피뢰 · 정결의 룬 · 특성 · 도시락)이 그 피해를 줄인다.',
  '어둠 · 악은 천상 · 인간에게 ×1.3, 빛 · 신성 몬스터에게 ×1.5로 들어간다. 언데드 · 골렘 · 원소는 중독 · 맹독 · 출혈에 걸리지 않고, 날아다니는 몬스터는 근접 기본 공격을 30% 덜 받는다.',
  '모험가 쪽: 자장가는 재우고, 얼음 감옥 · 빙결 플라스크는 얼리고, 섬광 화살 · 섬광탄은 눈을 멀게 한다. 기사 · 성기사는 행동 방해를 30% 짧게 받는다. 새 소모품 안약 · 성수를 연금술 공방에서 만든다.'
];
