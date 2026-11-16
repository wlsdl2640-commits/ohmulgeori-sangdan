# 몬스터 새 그림 — 옛 도트 16마리 (11-16 13:02 사용자 「ㄱㄱ」 시안 → 22:13 · 22:15 고름 → 13마리 넣음)

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

## 고른 것 (11-16 22:13 · 22:15 사용자) — 넣음 (src/pxruins.js · pxstar.js · pxvault.js = `emit70.py`)
| 몬스터 | 고른 것 (차례대로 기본 · _b · _c) | 게임 id |
|---|---|---|
| 유적 수호상 | B 기둥 수문장 | ruinguard |
| 타락 천사 | 전부 A · B · C | fallenangel · _b · _c |
| 스핑크스 | A · B | sphinx · sphinx_b |
| 오파님 | A · C | ophan · ophan_b(= 시안 C 날개 바퀴) |
| 천계의 거상 | A · C | colossus · colossus_b(= 시안 C 청동) |
| 타락한 대천사 | A (무기 vscep) | fallenarch |
| 별빛 요정 | A | starsprite |
| 성운 해파리 | A · B | nebula · nebula_b |
| 별꽃 트렌트 | B 등불 열매 나무 | startreant |
| 별고래 | A · C | starwhale · starwhale_b(= 시안 C 유리 별고래) |
| 별의 여왕 아스테리아 | B 별빛 망토 (무기 sscep) | starqueen |
| 미믹 | A · B | mimic · mimic_b |
| 황금 골렘 | A 금괴 | goldgolem |

「다시」(22:15) — 시안 2를 고르는 중: 월광 사냥개 `g/hound2.py`(A 달빛 갈기 · B 얼음 수정 · C 밤하늘 털 · D 달빛 갑주 — 첫 시안보다 굵은 늑대개 틀, 0.85배) · 성좌 기사 `g/knight2.py`(A 별자리 그림 · B 천구 방패 · C 유성 망토 · D 은하 망토 — ms 1.25 · 새 무기 slance 별빛 창) · 보물 수호자 `g/guard2.py`(A 미믹 왕 · B 보석 수정 거인 · C 열쇠 기사(새 무기 gkey) · D 상자를 진 바위 거인). 판 `d/r_*.png`. 고르면 emit70.py의 FILES에 더하고 다시 뽑는다.

확인(시험 묶음 아님): `python3 chk70.py <훅 페이지> <폴더>` — 새 id마다 모든 동작 장 그림(474장) · 모습 여럿 이름표와 고르는 몫 · 실제 싸움(그 땅 · 던전에서 stepExp + drawFrame 30초, 대천사의 타락 천사 부르기 · 여왕의 별빛 요정 부르기도) 오류 없음 → `fight_*.png`.

## 다시 뽑기
- 그림: `cd g && python3 <도구>.py` → `t/<이름>.json` = `{defs: {id: PXU 항목 + act · mon · label · desc · field · area · show}, extra: 새 무기 JS}`.
  - 공용: `kit.py`(Batch.add — 여러 장을 같은 틀로 자르고(frames) sh · hip를 맞춘다 · head_js — 지팡이 머리 그림 → PXU_WPN) · `feath.py`(깃털 날개 fwing · layer · wing_feathers — raid69/thunderbird.py에서) · `quad.py`(네발 body4 + swell · spit 자세 — v60 beast4.py에서) · `cv.py` · `blunt.py` · `shp.py` · `cloud.py`(빌드 56~61 시안 도구).
  - 새 무기(시안만): vscep 보랏빛 불꽃 수정 지팡이 · dspear 보랏빛 수정 창(대천사) · sscep 금 별 홀(여왕).
- 판: `python3 t/sheet70.py <훅 페이지> <출력.png> <제목> t/<이름>.json [--per 1] [--z 2|3] [--old <옛 id>] [--crop 40,40,200,160] [--lv 140] [--quick]`
  - 훅 페이지 = `tools/saved/bal69/mkpage.py <출력.html>`(dist/play.html에 `window.__EV`). 게임 데이터는 안 바꾸고 PXU · MONS · PXU_ACT에 잠깐 끼워 pxuSprite로 굽는다 · 전투 화면은 그 땅 배경에 파티 셋(성기사 · 대주교 · 신궁)과 적 하나를 drawFrame으로.

## 피한 것
머리 뒤 · 위 고리(후광 · 깨진 고리) · 십자 · 더하기 꼴(투구 틈 세로 콧대 · 바퀴살 · 금고 손잡이 바퀴 · 네 꼭지 반짝이) · 흰 옷 · 베일 · 흰 머리(신 그림) · 별 고리 관(성상) · 이마의 초승달 · 초승달과 별 · 유명한 것(금발 초록 옷 요정 · 흰 늑대 붉은 무늬 · 다리 달린 상자 · 금빛 사람꼴 로봇 · 등에 도시를 진 우주 고래 · 볏 달린 청동 거인 투구 · 짐승 꼴 별자리 갑옷) · 가짜 수염(스핑크스 석상 그대로).
