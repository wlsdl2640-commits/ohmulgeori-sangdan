# 스킬 아이콘 전체 (뭉툭 도트) — 작업 계획

사용자: "이제 모든 스킬로 진행하자 지금 시안 만들던 방식으로 해" (전사 15개 시안 확인 후).
방식: 육각 틀 안 16×20칸(한 칸 2px), 배경(속성 색 빛/빛살) + 효과 + 손그림 상징(검은 테두리 + B4 손질). 그림 모두 다르게.
게임에는 아직 넣지 않음 → 시안 시트로 보여 주고, skill-icons-draft 가지 drafts/skill-icons/dot/ 에 보관.

파일: cell.py(판) · lib.py(부품) · w5.py, w9.py(전사) · c_*.py(계열별) · review.py(검토 시트) · catalog.py(전체 시트)

## 구상 (계열별)
archer: aimed 과녁+화살 | double 나란한 두 화살 | poisonarrow 초록 독 방울 화살 | rain 위에서 쏟아지는 화살 | piercing 과녁 여럿 꿰뚫음 | eagleeye 독수리 눈(P) | tripleshot 부채꼴 세 화살 | stormarrows 초록 회오리 속 화살 | el_arrow 얼음 결정 화살 | awk_archer 불꼬리 유성 화살 | awk2_archer 하늘의 금빛 큰 활 | flasharrow 화살촉 섬광
mage: fireball 불덩이+꼬리 | icelance 얼음 창 | chain 갈라지는 번개 | burst 마나 폭발 고리 | meteor 큰 운석 | manashield 푸른 육각 막 | blizzard 눈송이+바람 | arcane 빛나는 마법책(P) | sa_mirage 사막 해+아지랑이 | iceprison 얼음 덩어리 속 그림자 | awk_mage 해골 모양 큰 불길 | awk2_mage 떨어지는 별 | thunderclap 구름에서 벼락
cleric: heal 초록 십자 | bless 금빛 고리 빛 | massheal 십자 셋 | holy 위에서 빛기둥+십자 | sanctuary 빛나는 성소 지붕 | greatheal 빛나는 하트+십자 | smite 금빛 벼락 | revival 빛나는 새싹 | cure 해독 물약 | awk_cleric 날개+후광 | awk2_cleric 빛의 문+날개 | holyhammer 빛 철퇴
rogue: backstab 단검+붉은 치명 | smoke 심지 달린 폭탄+연기 | venom 독 떨어지는 단검 | shadow 보라 그림자 칼날 | quickstep 달리는 장화(P) | deadlyvenom 초록 해골+독 | blades 원으로 도는 단검들 | vital 과녁 한가운데 단검(P) | parasting 노란 마비 침 | awk_rogue 붉은 X 처형 | awk2_rogue 어둠 속 한 줄 흰 베기 | voltstab 번개 두른 단검
porter: throwjunk 날아가는 잡동사니 | shout 큰 등짐+고함 | sturdy 꽉 찬 등짐(P) | packmule 노새 머리(P) | shieldbag 방패 무늬 짐 | avalanche 무너지는 상자 더미 | awk_porter 빛나는 거대 등짐 | awk2_porter 금빛 마차+금화
warrior/porter: ironskin 강철 팔(P) | dw_smash 드워프 망치+바위 | shockwave 땅 충격 고리
all: firstaid 구급 상자 | sprint 날개 장화(P) | meditate 명상하는 사람(P) | toughness 갑옷 하트(P) | focus 집중 눈(P) | secondwind 초록 바람+하트 | haste 빠른 모래시계(P) | tactics 작전판(P) | rhythm 북+박자(P) | ar_cheer 환호 손+꽃가루 | ar_finish 마지막 일격 ! | bandage 붕대 두루마리
gladiator: arena 모래 위 X 베기 | parry 칼과 칼 불꽃 | roar 콜로세움 아치+고함 | execute 붉은 세 줄 베기 | spinslash 회전 베기 소용돌이
champion: glory 월계관+칼 | crowd 우승컵(P) | finale 불꽃놀이+칼 | colosseum 콜로세움+휩쓸기
knight: shieldbash 방패 후려침 | provoke 도발 2 (점 둘) | fortress 요새 탑 | rally 깃발+작은 방패들 | lancecharge 달리는 말 머리
paladin: holystrike 빛 두른 칼 | guard 십자 방패 맹세 | layhands 빛나는 손 | judgment 구름에서 빛의 칼 | aegis 날개 금 방패 | devotion 기도하는 손(P) | divinity 날개 달린 해
berserker: bloodstrike 피 묻은 도끼 | whirl 도는 두 도끼 | bloodthirst 피 술잔 | rampage 핏발 선 눈 | frenzy 엇갈린 도끼+불(P)
bloodlord: bloodfeast 송곳니+피 | bloodlust 송곳니 핏방울(P) | bloodmoon 붉은 보름달 | ragnarok 불타는 세상 칼
ranger: beastshot 멧돼지+화살 | trap 쇠 덫 | wolfcall 울부짖는 늑대+달 | camouflage 덤불 속 눈 | instinct 발자국+눈(P) | arrowstorm 구름+두 겹 화살비
dragoon: jump 아래로 꽂는 창+도약 | dragonscale 비늘(P) | gale 창+바람 소용돌이 | skyfall 구름 뚫고 낙하 | wyvernfall 와이번 급강하 | dragonblood 용 핏방울(P) | dragonfall 불타는 창+용 불길
sniper: headshot 해골 위 조준선 | steadyaim 조준경 | longshot 먼 과녁 긴 궤적 | piercearrow 철판 뚫는 화살 | deadeye 조준선 눈동자(P)
hawkeye: divinearrow 날개 금 화살 | starfall 별 화살촉 비 | godseye 삼각 속 눈(P) | lastarrow 하늘에서 내려꽂는 큰 화살
bard: ballad 류트+음표 | lullaby 달+Zz+음표 | hymn 하프+초록 음표 | marchsong 작은북+음표 | warsong 나팔+붉은 음표
maestro: symphony 지휘봉+음표 물결 | requiem 촛불+음표 | overture 악보 두루마리 | encore 되돌이 화살+음표 | grandfinale 금 나팔 불꽃
coachman: whipcrack 채찍 딱 | horsecare 편자+하트(P) | gallop 달리는 말 | wheelcrush 굴러가는 바퀴 | wagonwall 짐칸 벽+막 | cargoshield 방패 상자(P)
caravanmaster: stampede 편자 발자국+먼지 | roadlord 길+왕관(P) | convoy 둥글게 선 마차+방패 | grandcaravan 노을 속 낙타 행렬
scout: ambush 덤불 속 화살 | pathfind 나침반(P) | snare 올가미 | campcraft 천막+모닥불(P) | spotweak 돋보기+붉은 X | volley 부채꼴 다섯 화살
pathfinder: farsight 망원경 | mapmaker 지도 X(P) | drumbeat 큰북+물결 | summit 깃발 꽂은 산꼭대기
assassin: assassinate 두건 속 눈+단검 | poisonblade 굽은 독날 | vanish 희미해지는 그림자 | throatcut 가로 붉은 베기 | shadowclone 셋 겹친 그림자 | killer 붉은 눈 복면(P)
shadowlord: shadowstep 그림자 발자국 | nightfall 달+어둠 장막 | shadowstorm 칼날 어둠 소용돌이 | soulreap 낫+영혼 | darkness 어둠 왕관(P) | eclipse 일식
duelist: twinslash 나란한 두 베기 | crossslash X 베기 | parrying 세검+되돌림 | blitz 다섯 줄 빠른 베기 | twinstorm 두 칼 회오리
bladedancer: bladewaltz 칼+나선 리본 | swordrain 떨어지는 칼들 | dancemaster 무희 신발(P) | thousandcut 그물처럼 겹친 베기
treasure: pilfer 금화 쥔 손 | lockpick 자물쇠+따개(P) | smokebomb 분홍 연기+금화 | goldrush 금화 소나기 | jackpot 터지는 보물 상자
masterthief: grandheist 장갑 손+보석 | phantom 괴도 가면 | fortune 네잎클로버(P) | heist 큰 다이아몬드
elementalist: windspirit 눈 달린 바람 | earthward 돌 방패+잎 | firespirit 눈 달린 불꽃 | waterspirit 눈 달린 물방울 | storm 폭풍 구름+번개
elementlord: spiritking 왕관 쓴 정령 | spiritlink 이어진 네 구슬(P) | elemental 네 색 폭발 | genesis 빛나는 새 세상
necromancer: drain 붉은 생명 줄기+손 | curse 저주 해골 | bonewall 뼈 방벽 | raise 땅에서 솟는 해골 | deathwave 해골 섞인 썩은 물결
lich: soulrend 찢기는 영혼 | lichmind 왕관 해골(P) | deathplague 해골 역병 구름 | apocalypse 붉은 하늘 해골 달
mhunter: huntmark 붉은 표식 화살 | trapnet 그물 | biggame 뿔 괴물 머리+조준 | skinning 가죽+칼(P) | volleytrap 덫+화살
dslayer: dragonpierce 비늘 뚫는 화살 | wyrmbane 용 눈+조준(P) | slayrain 용 그림자 위 화살비 | dragonheart 심장 꿰는 화살
huntsman: trackshot 발자국+화살 | snaretrap 발목 올무 | houndpack 달리는 사냥개 | wildsense 어둠 속 초록 눈(P) | driveshot 휘어 모는 화살
kaijuhunter: giantslayer 거대 괴수 그림자+조준 | harpoon 사슬 작살 | anatomy 괴수 뼈 도면(P) | quaketrap 땅속 폭약 | titanfall 거신에 꽂히는 큰 화살
sorcerer: arcanebolt 보라 마력탄 | manaward 룬 고리 막 | meteorfall 여러 작은 유성 | arcanefocus 수정구(P) | disintegrate 부서지는 과녁
archmage: arcanestorm 보라 폭풍 | amplify 지팡이+증폭 고리 | gravity 검은 구멍 | ultima 흰 마법진 폭발
elemancer: prism 무지개 프리즘 | tidalwave 큰 파도 | stonefist 땅에서 솟은 바위 주먹 | elemfocus 여섯 원소 고리(P) | thundercall 두 줄기 벼락
alchemist: transmute 변성진+주괴 | frostflask 깨지는 얼음 병 | flashbang 섬광탄 | blazeflask 터지는 불 병 | magnumopus 현자의 돌
physician: elixir 화려한 영약 병 | cureall 실 꿴 바늘 손 | surgeon 청진기(P) | regenall 링거 | blackdeath 흑사병 쥐
spellblade: flameblade 불칼 | frostblade 얼음칼 | thunderblade 번개칼 | arcaneguard 마법진 속 칼 | spellsword 보라 일섬
arcblade: starblade 별빛 칼 | manaburst 몸에서 터지는 푸른 기운 | starward 별 방패 | dimension 공간 틈 베기 | swordsaint 번개+바람 칼
priest: prayer 기도 손+빛 | grace 비둘기 | restore 빛 고리+더하기 | purify 흰 불꽃 | holyshield 금빛 방울 막 | sacredsong 촛불+음표
archbishop: miracle 날개 빛별 | holyland 대성당 | archangel 대천사 | resurrect 일어나는 불새 | dawnlight 지평선 해돋이
plaguedoc: miasma 초록 독병 | remedy 처방전+알약 | quarantine 격리 울타리 | vaccine 주사기 | panacea 무지개 물약 | epidemic 새부리 가면+독안개
exorcist: banish 부적 | sealing 사슬 봉인 | holywater 성수 병 | wardcircle 빛 결계 원 | exorcism 빛에 날아가는 유령
inquisitor: verdict 판사봉 | pyre 화형대 불 | inquisition 불 속 눈+사슬 책 | lastjudgment 천칭
섞인 계열: fr_wit 윙크하는 금화 | fr_song 소라+음표 | el_breath 세계수 잎+숨결 | dw_grit 곡괭이+광부 모자 | sa_curse 저주받은 램프 | weaken 부러진 칼+저주 | ar_sand 모래 뿌리는 손 | riposte 칼+되돌아오는 화살 | ar_combo 칼+세 번 번쩍 | ar_phalanx 방패 줄+창 | chant 찬송가 책+초록 음표
