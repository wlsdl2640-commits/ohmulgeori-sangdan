/* ───────── 빌드 69: 몬스터 강화 (11-14 12:18 사용자 「좋은데 그렇게 맞춰서 테스트 한번 돌려 보자」 · 「평원도 좀더 강하게 하긴 하나 각 LV에 맞는 벨런스로」) ─────────
   문서 물음 10의 안(11-14 아침): 필드 · 던전 몬스터 124종(레이드 거인 다섯은 빼고 — 그쪽은 data-raid69.js RAID69)
   · 맞힐 때 거는 상태이상: 모두 하나 이상(컨셉에 맞게 — 빌드 63의 새 열 가지까지), 우두머리 · 던전 주인은 둘(MONS.sta2 — core.js hitAdv)
   · 기본 공격 연타: 빠르거나 팔다리 · 머리가 많은 몬스터는 2 · 3연타 — 대마다 회피를 따로 굴리고 피해 × HITS_MUL, 상태이상 · 반격은 한 번만 (core.js battle)
   · 몬스터 스킬: 모두 2 ~ 3개(처음 땅 · 뒷골목은 2), 우두머리 · 던전 주인은 4개 — 새 틀: 강화 지우기 · 도발 · 마나 태우기 · 약한 자 노리기 · 꿰뚫기 (core.js fSkill)
   · 능력치: 몬스터 레벨마다 HP · 공격 · 방어 배율 MON_MUL69(monMul69 — core.js foeFrom). 레벨마다 시험해서 맞춘다(scratchpad v90 sim)
   표 MU69[몬스터] = { sta: [상태이상, 확률, 초, 지속 피해 배율] (없으면 그대로) · sta2 (우두머리) · hits 2 | 3 · sk: [[틀, 이름, 덮어쓸 값] …] (MON_SK 뒤에 더함) } */
Object.assign(MSK, {
  dispel: { name: '강화 지우기',     kind: 'dispel', mult: 0.45, cd: 22, magic: 1, el: 'self', n: 2 },   // 모두에게 약하게 + 모험가마다 걸린 강화 둘 · 파티 강화는 모두 지운다
  taunt:  { name: '도발',            kind: 'taunt', dur: 6, cd: 24, mul: 1.3 },                          // 6초 동안 한 명을 치는 공격 · 스킬이 이 몬스터에게 + 방어 ×1.3
  mpburn: { name: '마나 태우기',     kind: 'hit', mult: 1.1, cd: 16, magic: 1, el: 'self', mp: 0.25, tg: 'mp' },   // MP가 가장 많은 모험가 · 최대 MP 25%를 태운다
  lowhit: { name: '약한 자 노리기',  kind: 'hit', mult: 1.6, cd: 14, tg: 'low' },                        // 가장 다친 모험가를 노린다 (도발 · 엄호는 그대로 든다)
  pierce: { name: '꿰뚫기',          kind: 'hit', mult: 1.5, cd: 13, pen: 0.5 }                          // 방어를 절반만 본다
});
const HITS_MUL = { 2: 0.55, 3: 0.4 };   // 연타 한 대의 피해 (두 대 합 1.1 · 세 대 합 1.2)
const FB_HEAL69 = 0.4;                  // 필드 우두머리(HP ×3.9 ~ 7.5)가 스킬로 회복 · 보호막을 걸 때 몫 (최대 HP %가 그만큼 크다)
const ST69 = (k, p, d, m) => Object.assign({ k, p, d }, m ? { m } : {});
const MU69 = {
  // 평원 · 곡물 창고 (Lv1 ~ 18)
  rat:      { sta: ST69('bleed', 0.15, 4, 0.15), hits: 2, sk: [['lowhit', '약한 곳 물어뜯기', { mult: 1.3 }]] },
  slime:    { sta: ST69('corrode', 0.15, 8), sk: [['regen', '몸 다시 뭉치기', { pct: 0.12 }]] },
  rabbit:   { sta: ST69('stun', 0.08, 1), hits: 2, sk: [['haste', '깡충 뛰기', { mul: 1.3 }]] },
  wolf:     { sta: ST69('bleed', 0.18, 5, 0.2), hits: 2 },
  goblin:   { sta: ST69('blind', 0.12, 3), sk: [['hit', '몽둥이 후려치기', { mult: 1.6, sta: ST69('stun', 0.25, 1.2) }]] },
  ratking:  { sta: ST69('bleed', 0.3, 6, 0.25), sta2: ST69('poison', 0.2, 6, 0.2), hits: 2, sk: [['howl', '왕의 호령'], ['miasma', '병균 구름', { mult: 0.3 }]] },
  // 원시림 · 썩은 뿌리 동굴 (Lv9 ~ 26)
  myconid:  { sk: [['miasma', '독 포자 구름', { mult: 0.3 }]] },
  spider:   { sta: ST69('venom', 0.25, 8, 0.12), hits: 3, sk: [['venom', '맹독 송곳니']] },
  sapling:  { sta: ST69('para', 0.1, 1.5), sk: [['regen', '광합성', { pct: 0.12 }]] },
  shaman:   {},
  elder:    { sta2: ST69('sleep', 0.12, 3), sk: [['quake', '뿌리 솟아오르기', { mult: 0.6 }], ['regen', '나이테 재생', { pct: 0.1 }]] },
  // 검은바위산 · 드워프 갱도 (Lv18 ~ 35)
  lizard:   { sta: ST69('bleed', 0.15, 4, 0.2) },
  bat:      { sta: ST69('bleed', 0.15, 4, 0.2), hits: 2, sk: [['drain', '피 빨기', { mult: 1.1, heal: 0.5 }]] },
  kobold:   { sta: ST69('bleed', 0.15, 5, 0.2), sk: [['pierce', '곡괭이 찍기']] },
  golem:    { sk: [['taunt', '돌 울림']] },
  giant:    { sta2: ST69('petrify', 0.08, 2), sk: [['guard', '바위 피부'], ['roar', '산의 포효']] },
  // 바람계곡 · 와이번 둥지 (Lv27 ~ 44)
  harpy:    { hits: 2, sk: [['charm', '하피의 노래']] },
  windwolf: { sta: ST69('bleed', 0.2, 5, 0.2), hits: 2, sk: [['howl', '바람의 울부짖음']] },
  griffon:  { sta: ST69('bleed', 0.2, 5, 0.22), hits: 2, sk: [['storm', '날개 바람', { mult: 0.6 }]] },
  wyvern:   { sta: ST69('bleed', 0.15, 5, 0.2), sk: [['breath', '바람 숨결', { mult: 0.6 }], ['rage', '비룡의 분노']] },
  stormwyvern: { sta2: ST69('venom', 0.2, 8, 0.12), sk: [['breath', '뇌전 숨결'], ['haste', '폭풍 질주']] },
  // 지하수로 (Lv30 ~ 47)
  sewerrat: { sta: ST69('poison', 0.2, 6, 0.2), hits: 3, sk: [['miasma', '병균 냄새', { mult: 0.3 }]] },
  sludge:   { sk: [['regen', '오물 흡수', { pct: 0.12 }]] },
  sewercroc: { sk: [['hit', '꼬리 후려치기', { mult: 1.5, sta: ST69('stun', 0.25, 1.2) }], ['guard', '비늘 갑옷']] },
  ratman:   { hits: 2, sk: [['lowhit', '약한 놈부터']] },
  sewertroll: { sta: ST69('stun', 0.2, 1.5), sta2: ST69('poison', 0.25, 8, 0.25), sk: [['roar', '트롤의 포효'], ['acid', '하수 뿌리기', { kind: 'all', mult: 0.5 }]] },
  // 만년설산 · 얼어붙은 신전 (Lv36 ~ 53)
  snowman:  { sk: [['guard', '눈 단단히 뭉치기']] },
  icesprite: { sk: [['bolt', '얼음 송곳', { mult: 1.6 }]] },
  yeti:     { sta: ST69('chill', 0.2, 4), hits: 2, sk: [['rage', '설산의 분노']] },
  snowmaiden: { sk: [['freeze', '얼음 입맞춤', { mult: 1.2, sta: ST69('freeze', 0.35, 2.5) }]] },
  alpgoat:  { sta: ST69('stun', 0.1, 1), sk: [['haste', '바위 뛰어오르기']] },
  icequeen: { sta2: ST69('freeze', 0.1, 2), sk: [['charm', '여왕의 미소'], ['shield', '얼음 방벽']] },
  // 사라크 사막 · 왕릉 (Lv45 ~ 62)
  scorpion: { hits: 2, sk: [['guard', '껍질 세우기'], ['pierce', '집게 찌르기']] },
  antlion:  { sta: ST69('bleed', 0.2, 5, 0.22), sk: [['drain', '체액 빨기'], ['blind', '모래 뿌리기']] },
  bandit:   { hits: 2, sk: [['stab', '급소 찌르기'], ['lowhit', '약한 자 노리기']] },
  sandworm: { sta: ST69('corrode', 0.2, 8), sk: [['quake', '모래 속 울림', { mult: 0.6 }], ['acid', '소화액']] },
  greatworm: { sta: ST69('corrode', 0.3, 10), sta2: ST69('stun', 0.12, 1.5), sk: [['hit', '통째로 삼키기', { mult: 2.4, sta: ST69('stun', 0.4, 2) }], ['quake', '땅속 돌진', { mult: 0.7 }]] },
  // 7번가 뒷골목 · 암살자 길드 (Lv22 ~ 28 던전)
  assassin: { sta: ST69('bleed', 0.25, 5, 0.25), hits: 2, sk: [['lowhit', '뒤에서 찌르기', { mult: 1.8 }]] },
  poisoner: { sta: ST69('poison', 0.3, 8, 0.25), sk: [['miasma', '독 연기', { mult: 0.35 }]] },
  enforcer: { sta: ST69('stun', 0.15, 1.2), sk: [['taunt', '덤벼 봐']] },
  officer:  { sta: ST69('bleed', 0.2, 5, 0.22), hits: 2 },
  blackhood: { sta: ST69('bleed', 0.3, 6, 0.3), sta2: ST69('blind', 0.2, 4), hits: 3, sk: [['lowhit', '암살', { mult: 2.2 }], ['dispel', '그림자 장막', { magic: 0, el: null }]] },
  // 눅눅한 늪지대 · 마녀의 오두막 (Lv54 ~ 71)
  frogman:  { sta: ST69('poison', 0.2, 6, 0.2), hits: 2, sk: [['acid', '점액 뱉기'], ['haste', '개구리 뜀']] },
  leech:    { hits: 2, sk: [['curse', '멎지 않는 피', { magic: 0, el: null }], ['regen', '피로 불어나기']] },
  kelpie:   { sk: [['drain', '물속으로 끌기'], ['breath', '물보라', { mult: 0.6 }]] },
  siren:    { sk: [['charm', '홀리는 노래'], ['mpburn', '정신 흐트러뜨리기']] },
  swampthing: { sk: [['regen', '늪 재생'], ['para', '진흙 휘감기']] },
  toadking: { sta2: ST69('stun', 0.15, 1.5), sk: [['acid', '독 점액 폭포', { kind: 'all', mult: 0.5, sta: ST69('poison', 0.5, 8, 0.2) }], ['summon', '개구리 부르기', { mon: ['frogman'], n: 2 }], ['roar', '개굴 포효']] },
  anaconda: { sta2: ST69('para', 0.12, 2), sk: [['bite', '독니', { sta: ST69('venom', 0.6, 8, 0.12) }], ['drain', '조여 삼키기'], ['guard', '비늘 갑옷']] },
  swampwitch: { sta2: ST69('curse', 0.25, 8), sk: [['dispel', '마법 풀기'], ['sleep', '마녀의 자장가']] },
  // 메마른 땅 · 키메라 연구소 (Lv66 ~ 83)
  imp:      { sk: [['mpburn', '마력 훔치기'], ['confuse', '장난질']] },
  hellhound: { hits: 2, sk: [['bite', '지옥 송곳니'], ['howl', '사냥의 울부짖음']] },
  troll:    { sta: ST69('stun', 0.15, 1.5), sk: [['rage', '트롤의 분노']] },
  ogre:     { sk: [['hit', '몽둥이 휘두르기', { mult: 2.0, sta: ST69('stun', 0.3, 1.5) }], ['sweep', '쓸어 버리기']] },
  cerberus: { sta2: ST69('fear', 0.15, 4), hits: 3, sk: [['bite', '세 머리 물기', { hits: 3, mult: 0.7 }], ['rage', '지옥 개의 분노']] },
  ogreking: { sta2: ST69('fear', 0.15, 4), sk: [['hit', '대왕의 철퇴', { mult: 2.3, sta: ST69('stun', 0.4, 2) }], ['taunt', '덤벼라']] },
  flesh:    { sk: [['regen', '살덩이 붙이기'], ['taunt', '흉측한 울음']] },
  chimera:  { sta2: ST69('venom', 0.25, 8, 0.12), hits: 2, sk: [['gore', '염소 뿔 들이받기'], ['rage', '세 짐승의 분노']] },
  // 백작의 성 · 지하 고문실 (Lv78 ~ 95)
  vbat:     { hits: 2, sk: [['confuse', '초음파', { magic: 0 }], ['lowhit', '피 냄새 따라가기']] },
  ghoul:    { hits: 2, sk: [['drain', '살점 뜯기'], ['roar', '굶주린 울부짖음']] },
  gargoyle: { sta: ST69('bleed', 0.15, 5, 0.2), sk: [['taunt', '석상의 눈길']] },
  evileye:  { sk: [['mpburn', '마력을 삼키는 눈'], ['petrify', '저주의 눈빛']] },
  succubus: { sk: [['sleep', '달콤한 꿈']] },
  vampknight: { sta2: ST69('curse', 0.2, 8), sk: [['guard', '피의 갑주'], ['stab', '피의 찌르기'], ['roar', '공포의 기사']] },
  dracula:  { sta2: ST69('charm', 0.08, 3), sk: [['drain', '백작의 흡혈', { mult: 1.8, heal: 0.8, magic: 1 }], ['dispel', '어둠의 장막']] },
  skelwar:  { sta: ST69('stun', 0.12, 1.2), sk: [['guard', '뼈 방패'], ['taunt', '뼈 부딪치기']] },
  skelarc:  { sta: ST69('bleed', 0.2, 5, 0.2), hits: 2, sk: [['lowhit', '약한 자 겨누기'], ['pierce', '관통 화살']] },
  skelmage: { sk: [['bolt', '뼈 마탄'], ['dispel', '마력 해제']] },
  lichking: { sta2: ST69('curse', 0.25, 8), sk: [['hexall', '죽음의 저주'], ['mpburn', '영혼 흡수', { mult: 1.4 }]] },
  // 안개 묘지 · 잊힌 지하 묘소 (Lv70 ~ 87)
  wisp:     { sk: [['bolt', '도깨비불 튀기기'], ['mpburn', '넋 빨기']] },
  zombie:   { sk: [['regen', '썩은 살 붙이기'], ['curse', '좀비 병', { magic: 0 }]] },
  banshee:  { sk: [['mpburn', '넋 흔들기'], ['confuse', '울음소리']] },
  wraith:   { sk: [['guard', '망령의 갑주'], ['stab', '유령 찌르기']] },
  ghosttree: { sk: [['drain', '원혼 빨기'], ['regen', '원혼 재생']] },
  reaper:   { sta2: ST69('fear', 0.2, 4), sk: [['lowhit', '목숨 거두기', { mult: 2.2 }], ['dispel', '영혼 벗기기']] },
  mummy:    { sk: [['guard', '붕대 감싸기']] },
  deathknight: { sta2: ST69('fear', 0.2, 4), sk: [['hit', '암흑 베기', { mult: 2.2, magic: 1, el: 'self' }], ['dispel', '죽음의 서약']] },
  // 용암 화산 · 불의 심장 화구 (Lv80 ~ 97)
  magmaslime: { sk: [['regen', '용암 뭉치기'], ['shield', '굳은 껍질']] },
  firebat:  { hits: 2, sk: [['drain', '뜨거운 흡혈'], ['haste', '불꽃 날갯짓']] },
  salamander: { sk: [['bite', '불 꼬리 물기', { sta: ST69('burn', 0.5, 8, 0.25) }], ['regen', '꼬리 재생']] },
  lavagolem: { sk: [['taunt', '끓는 몸']] },
  redhare:  { sta: ST69('stun', 0.12, 1), hits: 2, sk: [['breath', '불 콧김', { mult: 0.6 }]] },
  efreet:   { sk: [['shield', '불꽃 방패'], ['dispel', '불길로 태우기']] },
  magmadragon: { sta2: ST69('corrode', 0.2, 8), sk: [['breath', '용암 숨결'], ['pierce', '용암 발톱']] },
  firelord: { sta2: ST69('fear', 0.15, 4), sk: [['shield', '화염의 장막'], ['dispel', '불의 심판']] },
  // 세계수 뿌리 · 세계수의 심장 (Lv90 ~ 107)
  rootspider: { sta: ST69('venom', 0.3, 8, 0.12), hits: 3, sk: [['venom', '뿌리 독니'], ['lowhit', '덫 사냥']] },
  treantguard: { sk: [['taunt', '숲의 방패']] },
  dryad:    { sk: [['sleep', '꽃잎 바람']] },
  mossgolem: { sta: ST69('sleep', 0.1, 3), sk: [['quake', '이끼 발구르기', { mult: 0.6 }]] },
  rootworm: { sk: [['drain', '뿌리 즙 빨기'], ['guard', '굳은 껍질']] },
  worldserpent: { sta2: ST69('petrify', 0.08, 2), sk: [['para', '휘감아 조이기', { mult: 1.4 }], ['regen', '허물 벗기']] },
  corruptheart: { sta2: ST69('curse', 0.25, 8), sk: [['drain', '생명 빨아들이기', { magic: 1 }], ['dispel', '타락의 파동']] },
  // 구름섬 · 구름 위 신전 (Lv100 ~ 117)
  cloudsheep: { sta: ST69('sleep', 0.08, 3), sk: [['guard', '솜털 부풀리기'], ['gore', '박치기']] },
  skyray:   { sk: [['storm', '하늘 물결', { mult: 0.6 }], ['lowhit', '꼬리 채찍']] },
  thunderbird: { hits: 2, sk: [['gore', '번개 급강하'], ['haste', '번개 날갯짓']] },
  pegasus:  { sta: ST69('stun', 0.1, 1), hits: 2, sk: [['flash', '천마의 빛', { magic: 0 }]] },
  cloudgiant: { sk: [['quake', '구름 발구르기', { mult: 0.6 }]] },
  skyknight: { sta: ST69('bleed', 0.2, 5, 0.22), sk: [['taunt', '기사의 도전']] },
  skytitan: { sta2: ST69('shock', 0.2, 2.5), sk: [['hit', '하늘 내려치기', { mult: 2.3, sta: ST69('stun', 0.35, 2) }], ['storm', '폭풍 일으키기']] },
  skyemperor: { sta2: ST69('blind', 0.25, 4), sk: [['dispel', '황제의 칙령'], ['shield', '하늘의 가호']] },
  // 보물 던전 (파티 레벨)
  mimic:    { hits: 2, sk: [['drain', '통째로 삼키기'], ['guard', '뚜껑 닫기']] },
  goldgolem: { sta: ST69('stun', 0.15, 1.2), sk: [['taunt', '황금빛 유혹']] },
  treasureguard: { sta: ST69('stun', 0.2, 1.5), sta2: ST69('petrify', 0.1, 2), sk: [['guard', '수호자의 갑주'], ['dispel', '봉인의 빛']] },
  // 천둥 봉우리 · 뇌신의 첨탑 (Lv120 ~ 132)
  stormcloud: { sk: [['bolt', '번개 화살'], ['shield', '먹구름 장막']] },
  thunderhawk: { hits: 2, sk: [['storm', '번개 깃털', { mult: 0.6 }], ['lowhit', '번개 낚아채기']] },
  raiju:    { hits: 2, sk: [['bite', '번개 송곳니', { sta: ST69('shock', 0.4, 2.5) }], ['haste', '뇌속']] },
  stormgolem: { sk: [['taunt', '피뢰침']] },
  tempestknight: { sta: ST69('shock', 0.2, 2.5), sk: [['pierce', '폭풍 관통']] },
  thunderdragon: { sta2: ST69('stun', 0.15, 1.5), sk: [['gore', '뇌룡 돌진'], ['dispel', '천둥 폭발']] },
  stormking: { sta2: ST69('stun', 0.2, 1.5), sk: [['dispel', '뇌제의 심판'], ['shield', '번개 방벽']] },
  // 천계의 유적 폐허 · 무너진 성소 (Lv130 ~ 142)
  ruinguard: { sk: [['taunt', '수호의 명령']] },
  fallenangel: { sk: [['bolt', '타락의 빛'], ['dispel', '검은 날개 바람']] },
  seraphknight: { sk: [['flash', '천벌의 빛']] },
  sphinx:   { sk: [['mpburn', '수수께끼 풀이']] },
  ophan:    { sk: [['bolt', '빛의 바퀴'], ['mend', '천상의 노래']] },
  colossus: { sta2: ST69('petrify', 0.1, 2), sk: [['hit', '거상의 주먹', { mult: 2.3 }], ['taunt', '거상의 위압']] },
  fallenarch: { sta2: ST69('curse', 0.3, 8), sk: [['dispel', '대천사의 심판'], ['charm', '타락의 미소']] },
  // 별의 정원 · 별의 왕좌 (Lv140 ~ 152)
  starsprite: { sk: [['bolt', '별빛 화살']] },
  moonhound: { hits: 2, sk: [['lowhit', '달빛 사냥']] },
  nebula:   { sk: [['mpburn', '성운 흡수']] },
  constellation: { sta: ST69('bleed', 0.2, 5, 0.22), sk: [['pierce', '별자리 창']] },
  startreant: { sk: [['regen', '별꽃 재생']] },
  starwhale: { sta2: ST69('sleep', 0.08, 3), sk: [['breath', '물기둥', { mult: 0.7 }], ['shield', '별빛 거품']] },
  starqueen: { sta2: ST69('freeze', 0.12, 2), sk: [['dispel', '별의 심판'], ['charm', '여왕의 미소']] }
};
// 몬스터 레벨마다 능력치 배율 (사이는 곧은 선으로 잇는다) — 11-14 시험(같은 레벨 파티가 필드를 어디까지 밀고 가나, 레벨 12 ~ 146 열한 곳)으로 맞춘 값:
//   평원 · 원시림 ×1.1(「평원도 좀더 강하게」) · Lv27 ~ 47은 새 스킬 · 연타 · 상한만으로도 예전보다 어려워 ×1 · Lv54 ~ 90 ×1.1 ~ 1.25 ·
//   구름섬(Lv100 ~ 117)은 3차 전직 바로 뒤라 예전엔 힐러 파티가 던전까지 다 깼다 → ×2.3 · 천둥 봉우리는 이미 느린 싸움이라 HP는 그대로 공격만 ×1.35 ·
//   유적 ×1.35 · 별의 정원 ×1.1 · Lv200(새 땅)은 ×1.4로 미리
const MON_MUL69 = [
  [1, { hp: 1.1, atk: 1.1, def: 1.05 }], [24, { hp: 1.1, atk: 1.1, def: 1.05 }], [27, { hp: 1, atk: 1, def: 1 }], [47, { hp: 1, atk: 1, def: 1 }],
  [54, { hp: 1.1, atk: 1.1, def: 1.05 }], [80, { hp: 1.1, atk: 1.1, def: 1.05 }], [90, { hp: 1.25, atk: 1.25, def: 1.1 }], [96, { hp: 1.3, atk: 1.3, def: 1.15 }],
  [100, { hp: 2.3, atk: 2.3, def: 1.6 }], [117, { hp: 2.3, atk: 2.3, def: 1.6 }], [120, { hp: 1, atk: 1.35, def: 1 }], [132, { hp: 1, atk: 1.35, def: 1 }],
  [134, { hp: 1.35, atk: 1.35, def: 1.15 }], [142, { hp: 1.35, atk: 1.35, def: 1.15 }], [146, { hp: 1.1, atk: 1.1, def: 1.05 }], [152, { hp: 1.1, atk: 1.1, def: 1.05 }],
  [200, { hp: 1.4, atk: 1.4, def: 1.2 }]
];
function monMul69(lv) {
  const P = MON_MUL69; if (lv <= P[0][0]) return P[0][1];
  for (let i = 1; i < P.length; i++) if (lv <= P[i][0]) { const [l0, a] = P[i - 1], [l1, b] = P[i], t = (lv - l0) / (l1 - l0); return { hp: a.hp + (b.hp - a.hp) * t, atk: a.atk + (b.atk - a.atk) * t, def: a.def + (b.def - a.def) * t }; }
  return P[P.length - 1][1];
}
// 표를 MONS · MON_SK에 얹고, 그 몬스터의 스킬 목록(MONS.msk)을 다시 푼다 (data-fight.js와 같은 길)
Object.entries(MU69).forEach(([id, U]) => {
  const m = MONS[id]; if (!m) return;
  if (U.sta) m.sta = U.sta;
  if (U.sta2) m.sta2 = U.sta2;
  if (U.hits) m.hits = U.hits;
  if (U.sk) MON_SK[id] = (MON_SK[id] || []).concat(U.sk);
  m.msk = (MON_SK[id] || []).map(([tpl, name, o], i) => {
    const s = Object.assign({}, MSK[tpl], o || {}, { id: tpl + i, tpl, name: name || MSK[tpl].name });
    if (s.el === 'self') { s.el = null; s.self = 1; }
    if (s.kind === 'summon' && (m.giant || !s.mon)) return null;
    return s;
  }).filter(Boolean);
});
STORY.v69e = [
  '능력치 상한이 바뀌었다 — 확률이 붙는 것(회피 · 치명타 · 막기 · 반격 · 한 번 더 · 명중 · 눈멂 걸기 · 눈멂 저항)은 모두 더해 50%까지. 회피 가운데 민첩으로 얻는 몫은 35%까지라, 나머지는 장비 · 바람 룬 · 환영의 문스톤 · 특성 · 스킬로 채운다.',
  '치명타 확률이 50%를 넘는 몫은 절반만큼 치명타 피해로 바뀐다(치명타 피해는 +150%까지). 주는 · 받는 회복 · 흡혈 · MP 회복 · 최대 MP · 속성 피해(룬)는 상한이 1.5배로 커졌다.',
  '줄이는 것은 상한을 남겼다: 받는 피해 감소 60% · 마법 저항 60% · 속성 저항 60%(예전 75%) · 행동 방해 시간 60%(냉정함 · 탱커 · 룬을 더해도) · 화상 · 중독 피해 60%(예전 90%). 여럿을 곱해도 받는 피해는 원래의 20% 아래로 안 내려간다.',
  '몬스터가 세졌다 — 모든 몬스터가 맞힐 때 상태이상을 걸고(우두머리 · 던전 주인은 둘), 빠르거나 팔다리 · 머리가 많은 몬스터는 2 · 3연타, 스킬은 2 ~ 4개(새 스킬: 강화 지우기 · 도발 · 마나 태우기 · 약한 자 노리기 · 꿰뚫기). 레벨마다 능력치도 올랐다 — 특히 구름섬(Lv100 ~ 117).',
  '회복하는 몬스터를 45초 동안 넘지 못하면 이길 수 없는 싸움이라 물러난다(필드 우두머리의 회복 · 보호막은 몫이 작다).'
];
