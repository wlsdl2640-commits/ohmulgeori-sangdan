# 몬스터 새 그림 — 옛 도트 16마리 (11-16 13:02 사용자 「ㄱㄱ」 시안 → 22:13 · 22:15 · 11-17 18:46 고름 → 16마리 모두 넣음)

옛 그림(PXM)으로 남아 있던 몬스터 16마리의 「뭉툭 도트」 새 그림 시안. 마리마다 A · B · C 셋. 사용자가 고르면 그때 게임에 넣는다
(고른 순서대로 기본 id · `_b` · `_c` — pxuLook + PXU_SKIN/PXU_SKIN_NAME, PXU_ACT는 기본 id에만 · 빌드 57~61과 같은 길).

| 땅 | 몬스터 (id) | 그림 도구 | A | B | C |
|---|---|---|---|---|---|
| 천계의 유적 폐허 | 유적 수호상 (ruinguard) | g/ruin2.py | 부서진 기사 석상 (sword) | 기둥 수문장 (rfist) | 덩굴 감긴 고대 수호상 (rfist) |
| | 타락 천사 (fallenangel) | g/angel1.py | 찢긴 검은 날개 (forb 보라) | 끝이 검게 번진 날개 (fpalm 보라) | 사슬 묶인 날개 (forb 핏빛) |
| | 스핑크스 (sphinx) | g/sphinx1.py | 사막 왕관 | 날개 | 석상 |
| | 오파님 (ophan) | g/ophan1.py | 눈 박힌 두 고리 | 불꽃 바퀴 | 날개 바퀴 |
| | 천계의 거상 (colossus, 필드 우두머리) | g/colossus1.py | 백금 갑주 | 신전 기둥 | 청동 |
| | 타락한 대천사 (fallenarch, 성소 주인) | g/arch1.py | 여섯 검은 날개 (vscep) | 녹슨 금빛 갑주 (dspear) | 검은 불꽃 날개 (forb) |
| 별의 정원 | 별빛 요정 (starsprite) | g/sprite1.py | 별머리 정령 | 별가루 솜뭉치 | 유리 날개 꼬마 요정 |
| | 월광 사냥개 (moonhound) | g/hound1.py | 은빛 시가하운드 | 서리 갈기 사냥개 | 그림자 달 사냥개 |
| | 성운 해파리 (nebula) | g/jelly1.py | 보랏빛 성운 | 은하 소용돌이 | 등롱 |
| | 성좌 기사 (constellation) | g/knight1.py | 밤하늘 갑주 | 별자리 몸 | 혜성 깃 |
| | 별꽃 트렌트 (startreant) | g/tree1.py | 별꽃 고목 | 등불 열매 나무 | 수정 가지 그루터기 |
| | 별고래 (starwhale, 필드 우두머리) | g/whale1.py | 별무늬 남빛 | 성운 지느러미 | 유리 별고래 |
| | 별의 여왕 아스테리아 (starqueen, 왕좌 주인) | g/queen1.py | 밤하늘 드레스 (sscep) | 별빛 망토 | 성운 머리칼 |
| 보물 던전 | 미믹 (mimic) | g/mimic1.py | 나무 보물 상자 | 쇠 금고 | 황금 상자 |
| | 황금 골렘 (goldgolem) | g/gold1.py | 금괴 | 금화 더미 | 보석 박힌 황금 갑주 |
| | 보물 수호자 (treasureguard, 보물고 주인) | g/guard1.py | 금고 문 | 황금 사자 수호상 | 보물 더미 거인 |

판: `d/g1_*.png`(유적) · `d/g2_*.png`(별의 정원) · `d/g3_*.png`(보물 던전) — 지금 그림(옛 도트) · 마리마다 서 있기 두 장 + 동작 장 · 실제 전투 화면.

## 고른 것 (11-16 22:13 · 22:15 · 11-17 18:46 사용자) — 넣음 (src/pxruins.js · pxstar.js · pxvault.js = `emit70.py`)
| 몬스터 | 고른 것 (차례대로 기본 · _b · _c) | 게임 id |
|---|---|---|
| 유적 수호상 | B 기둥 수문장 | ruinguard |
| 타락 천사 | 전부 A · B · C | fallenangel · _b · _c |
| 스핑크스 | A · B | sphinx · sphinx_b |
| 오파님 | A · C | ophan · ophan_b(= 시안 C 날개 바퀴) |
| 천계의 거상 | A · C | colossus · colossus_b(= 시안 C 청동) |
| 타락한 대천사 | A (무기 vscep) | fallenarch |
| 별빛 요정 | A | starsprite |
| 월광 사냥개 | 시안 2 A 달빛 갈기 늑대개 (`g/hound2.py`) | moonhound |
| 성좌 기사 | 시안 2 B 천구 방패 기사 (`g/knight2.py` · 무기 slance 별빛 창) | constellation |
| 성운 해파리 | A · B | nebula · nebula_b |
| 별꽃 트렌트 | B 등불 열매 나무 | startreant |
| 별고래 | A · C | starwhale · starwhale_b(= 시안 C 유리 별고래) |
| 별의 여왕 아스테리아 | B 별빛 망토 (무기 sscep) | starqueen |
| 미믹 | A · B | mimic · mimic_b |
| 황금 골렘 | A 금괴 | goldgolem |
| 보물 수호자 | 시안 2 A 미믹 왕 (`g/guard2.py`) | treasureguard |

「다시」(11-16 22:15)는 시안 2(넷씩, `d/r_*.png`)에서 골랐다(11-17 18:46): 월광 사냥개 A · 성좌 기사 B · 보물 수호자 A — 첫 시안(hound1 · knight1 · guard1)은 쓰지 않는다.

확인(시험 묶음 아님): `python3 chk70.py <훅 페이지> <폴더>` — 새 id마다 모든 동작 장 그림(552장 · 24 id) · 모습 여럿 이름표와 고르는 몫 · 실제 싸움(그 땅 · 던전에서 stepExp + drawFrame 30초, 대천사의 타락 천사 부르기 · 여왕의 별빛 요정 부르기 · 보물 수호자의 미믹 부르기도) 오류 없음 → `fight_*.png`.

## 레이드 보스 셋 (11-17 18:56 사용자 「다음 해야 할거 ㄱㄱ」 시안 → 19:10 카이샤르 A 넣음 → 22:53 「템페스트 드래곤은 A+C 색으로 베히모스는 B+A ㄱㄱ」 셋 다 넣음)
옛 그림으로 남은 레이드 보스(킹슬라임 · 천둥새는 빌드 69에 새로). 레이드 거인은 **한 장 그림**(PXRAID — 반 해상도 격자 · 게임이 B4 손질을 하지 않아서 명암 · 부위 선을 격자에 직접: `kit.seams` · `kit.rim`, `kit.gridtxt`로 빈 줄 · 열을 잘라 낸다).
| 보스 (id · 레이드) | 도구 | A | B | C |
|---|---|---|---|---|
| 고블린 소드마스터 카이샤르 (kaishar · Lv160) | g/raidk.py | 대태도 고블린 검성 | 칼집 지게 고블린 군주 | 칼바람 쌍검 고블린 |
| 템페스트 드래곤 (tempest · Lv180) | g/raidt.py | 폭풍우 바다용 | 바람 날개 용 | 먹구름 갑주 용 |
| 베히모스 (behemoth · Lv190 · 하늘) | g/raidb.py | 네 눈 하늘 고래 | 갑각 하늘 괴수 | 구름 해파리 고래 |

판 `d/raid_*.png` = `python3 t/rsheet70.py <훅 페이지> t/raid_<id>.json <몬스터 id> <레이드 열쇠> <출력> <제목> [<부제>]`(넣은 것 판 `d/raid_*_in.png`은 `t/raid_*_in.json`)(PXRAID[id]를 잠깐 바꿔 끼워 pxGiantSprite 가까이 ×2 + 실제 레이드 싸움 — 레이드 원정대 네 파티 Lv192). 고르면 PXRAID[id] = 고른 격자 · 팔레트(+ MONS[id] W/H는 PXG_DIM이 격자에서 잰다), 이름 · 설명은 그대로(바꿀지는 그때).

### 11-17 19:10 사용자 「카이샤르 A 템페스트 A에 C색상입혀봐 베히모스는 B에 A기존 배아래에 있는 구름 좀더 업글해서 붙히고 C의 해파리다리 붙혀줘」
| 보스 | 한 것 | 판 |
|---|---|---|
| 카이샤르 | **A 넣음** — `python3 applyraid70.py ../../../src/pxraid.js t/raid_kaishar.json kaishar A`(PXRAID 한 항목만 바꿈) + `src/data-raid69.js`(설명 「두 자루 대검」 → 긴 외날 칼 · MONS W 82 · H 92 · 색). 허리 금 매듭이 금 십자처럼 보여서 네모 매듭 + 벌어진 끈 둘로 바꿈(`d/raid_kaishar.png`는 옛 매듭 시안) | `d/raid_kaishar_in.png`(게임 그림 · 실제 레이드) |
| 템페스트 드래곤 | 시안 `AC`(A 꼴 + C 색 — 먹빛 몸 · 먹빛 막 날개 · 잿빛 먹구름 갈기 · 흰 눈 · 푸른 빗줄기) · `AC2`(같고 갈기만 A처럼 흰 물거품) → **22:53 「A+C 색」 = `AC` 넣음** — `python3 applyraid70.py ../../../src/pxraid.js t/raid_tempest.json tempest AC`(52×46 → 104×92) + data-raid69.js(설명 · MONS W 104 · H 92 · 몸 색) | 시안 `d/raid_tempest_AC.png`(A · C와 나란히, `t/raid_tempest2.json`) · 넣은 것 `d/raid_tempest_in.png` |
| 베히모스 | 시안 `D` = B 몸 + 배에 붙은 뭉게구름 + C 해파리 다리 → **22:53 「B+A」 = `D` 넣음** — `python3 applyraid70.py ../../../src/pxraid.js t/raid_behemoth.json behemoth D`(64×52 → 128×104) + data-raid69.js(하늘 레이드 설명 「거대한 갑각 괴수 … 해파리 다리」 · MONS W 128 · H 104 · 몸 색) | 시안 `d/raid_behemoth_D.png`(A · B · C와 나란히, `t/raid_behemoth2.json`) · 넣은 것 `d/raid_behemoth_in.png` |

- 베히모스 D 구름(`g/raidb.py`): `cumulus(c, [(x, y, r) …])`가 덩이를 하나씩 겹쳐 그린다(뒤 덩이부터 — 덩이마다 아래 그늘 w · 왼쪽 위 빛 V · 앞 덩이가 뒤 덩이에 걸치는 **윗부분만** 테 x(옆 · 아래까지 테를 두르면 비늘 무늬가 된다)) → `fill_holes`(덩이 사이 갇힌 틈을 그늘로) → `seams`의 구름 테 u. 덩이: 배를 덮는 위 덩이 일곱 · 꼬리와 턱 밑 끝 덩이 · 가운데 큰 덩이 · 맨 앞 아래 작은 덩이 + 뒤의 잿보랏빛 아랫면 G. 해 보고 뺀 것: 넓은 바닥 타원(원반처럼 보였다) · 꼬리 쪽 흩어지는 구름 줄(빛 줄처럼 보였다) · 끝으로 벌어지는 다리(거미 다리처럼 보였다).
- 빠른 미리보기(게임 굽기 아님): `python3 t/quickprev.py <json> <키> <출력.png> [배율]` — 칸 2×2 + 바깥 검은 테, 갇힌 빈 칸(구멍) 수도 찍는다.

## 다시 뽑기
- 그림: `cd g && python3 <도구>.py` → `t/<이름>.json` = `{defs: {id: PXU 항목 + act · mon · label · desc · field · area · show}, extra: 새 무기 JS}`.
  - 공용: `kit.py`(Batch.add — 여러 장을 같은 틀로 자르고(frames) sh · hip를 맞춘다 · head_js — 지팡이 머리 그림 → PXU_WPN) · `feath.py`(깃털 날개 fwing · layer · wing_feathers — raid69/thunderbird.py에서) · `quad.py`(네발 body4 + swell · spit 자세 — v60 beast4.py에서) · `cv.py` · `blunt.py` · `shp.py` · `cloud.py`(빌드 56~61 시안 도구).
  - 새 무기(시안만): vscep 보랏빛 불꽃 수정 지팡이 · dspear 보랏빛 수정 창(대천사) · sscep 금 별 홀(여왕).
- 판: `python3 t/sheet70.py <훅 페이지> <출력.png> <제목> t/<이름>.json [--per 1] [--z 2|3] [--old <옛 id>] [--crop 40,40,200,160] [--lv 140] [--quick]`
  - 훅 페이지 = `tools/saved/bal69/mkpage.py <출력.html>`(dist/play.html에 `window.__EV`). 게임 데이터는 안 바꾸고 PXU · MONS · PXU_ACT에 잠깐 끼워 pxuSprite로 굽는다 · 전투 화면은 그 땅 배경에 파티 셋(성기사 · 대주교 · 신궁)과 적 하나를 drawFrame으로.

## 피한 것
머리 뒤 · 위 고리(후광 · 깨진 고리) · 십자 · 더하기 꼴(투구 틈 세로 콧대 · 바퀴살 · 금고 손잡이 바퀴 · 네 꼭지 반짝이) · 흰 옷 · 베일 · 흰 머리(신 그림) · 별 고리 관(성상) · 이마의 초승달 · 초승달과 별 · 유명한 것(금발 초록 옷 요정 · 흰 늑대 붉은 무늬 · 다리 달린 상자 · 금빛 사람꼴 로봇 · 등에 도시를 진 우주 고래 · 볏 달린 청동 거인 투구 · 짐승 꼴 별자리 갑옷) · 가짜 수염(스핑크스 석상 그대로).

## 새끼 펫 16 · 말 7 시안 (11-17 22:57 사용자 「다음」 — 게임에는 아직 안 넣음)
옛 그림으로 남은 새끼 펫 16(pxpet.js · pxmon3.js PXPET3 — 10칸 남짓 뭉툭 덩어리)과 마구간 말 7(pxmon3.js HORSE_GRID 한 그림에 색만 다름)을 PXU 새 그림으로.
펫은 다 자란 모습(PXU)의 색 · 글자를 그대로 빌려(`base` MONS의 body · dark → C Q c d, `pal`) 반 해상도로 손그림 — 서 있기 두 장(g · g2: 꼬리 · 귀 · 날개 · 숨쉬기, `ifr` 빠르기).

| 새끼 펫 (id) | A | B |
|---|---|---|
| 슬라임 새끼 (slime) | 물방울 아기 | 금화 삼킨 아기 |
| 새끼 늑대 (wolf) | 솜털 강아지 | 앉은 강아지 |
| 아기 거미 (spider) | 동글 아기 거미 | 앞다리 든 아기 거미 |
| 골렘 조각 (golem) | 조약돌 꼬마 골렘 | 수정 왕관 꼬마 골렘 |
| 아기 그리핀 (griffon) | 솜털 아기 그리핀 | 날개 편 아기 그리핀 |
| 하피 병아리 (harpy) | 솜털 병아리 하피 | 알 껍데기 쓴 하피 |
| 얼음 정령 새끼 (icesprite) | 작은 결정 정령 | 눈송이 방울 정령 |
| 아기 전갈 (scorpion) | 동글 아기 전갈 | 집게 든 아기 전갈 |
| 하수도 생쥐 (sewerrat) | 동글 아기 생쥐 | 빵 부스러기 든 생쥐 |
| 켈피 망아지 (kelpie) | 켈프 갈기 망아지 | 물방울 켈피 망아지 |
| 임프 새끼 (imp) | 두건 쓴 꼬마 임프 | 불씨 든 꼬마 임프 |
| 아기 박쥐 (vbat) | 동글 아기 박쥐 | 날개 망토 아기 박쥐 |
| 아기 산양 (goat) | 뿔 돋은 아기 산양 | 수염 난 아기 산양 |
| 아기 와이번 (wyvern) | 통통 아기 와이번 | 날갯짓하는 아기 와이번 |
| 적토마 망아지 (redhare) | 불씨 갈기 망아지 | 불꽃 망아지 |
| 페가수스 망아지 (pegasus) | 작은 날개 망아지 | 날개 접은 망아지 |

말(`g/horses1.py`): A 날씬한 준마(적토마 · 켈피 · 페가수스 펫 말과 같은 뼈대 — 27칸 · 다리가 길다) · B 뭉툭한 짐말(24칸 · 굵은 다리 · 발목 털). 종류마다 색 + 손질 — 노쇠 듬성한 잿빛 갈기 · 흰 주둥이 · 처진 눈꺼풀 / 당나귀 긴 귀 · 짧게 선 검은 갈기 · 흰 주둥이 · 등줄 · 끝에 술 달린 꼬리 / 갈마 밤색 몸 · 검은 갈기 · 검은 아랫다리 · 이마의 흰 별 / 흑마 검은 몸 · 긴 갈기 · 얼굴의 흰 줄 / 백마 흰 몸 · 은빛 갈기 · 기사의 푸른 안장 천 / 군마 쇠 마면 · 목 비늘 갑옷 · 붉은 마의(금 테 · 무늬 없음) · 머리의 붉은 술 / 명마 금빛 몸 · 연금빛 긴 갈기 · 금 굴레 · 붉은 장미 매듭.

- 판: `d/p1_pets.png` ~ `d/p4_pets.png`(넷씩) · `d/h1_horses.png` · `d/h2_horses.png` = `python3 t/psheet70.py <훅 페이지> t/pets1.json <출력> <제목> --mode pet --keys …` / `t/horses1.json --mode horse` — 줄마다 지금 그림 · 시안 서 있기 두 장(펫 ×4 · 말 ×3) · 다 자란 모습, 실제 장면(펫: 전투에서 파티 뒤를 따라오는 새끼 펫 · 상단 사육장, 말: 마차를 끄는 원정 걷기 · 상단 마구간). 시안을 PXU[pet_종류 | horse_종류]에 잠깐 끼운다.
- 빠른 보기 `python3 t/pview70.py <훅 페이지> <시안.json> <출력> [종류,…] [--z 5]`(×z와 ×2).
- 넣을 때 함께 바꿀 것(판의 장면은 이미 이렇게 찍었다): 새끼 펫이 지금 그림(20칸 안팎)보다 커서 전투 `view.js` 펫 크기 `1.1 × monFit(…, 18)` → `monFit(…, 26)` · 사육장 `hq.js` `monFit(id, 22)` → 26. 새끼 그림은 PXU 항목 + `pxuLook('pet_종류', 다 자란 모습, 이름)`(예전 pet_rat · 새끼 해룡과 같은 길), 말은 PXU['horse_종류'] + MONS 색(PXM3 옛 그림은 남겨 둠 — PXU가 먼저).
