# 빌드 68 시안: 펫 · 알 · 재배소 · 식재료 · 요리 개편 (11-12 18:55 사용자 요청 — 게임에는 안 넣음)

사용자 요청: 용기수 와이번 펫 전직 · 펫 만렙 30 · 펫 레어도 · 알 드랍 낮춤 · 유정란/무정란(부화 30→70%, 사육장 강화) ·
재배소(비닐하우스, 최대 3동, 아래 단추로 넘김) · 약물 재료 드랍 등급 · 채소(하르겐 시장 · 나라 특산) · 해산물(해상왕국만) ·
요리 전용 화면(구리솥 퐁당 · 빼기 · 레시피 직접 찾기 · 도감). 규칙 · 수치 · 물어볼 것은 Claude 문서
「펫 · 알 · 재배소 · 식재료 · 요리 개편 시안」 https://claude.ai/artifact/DVH2ZBaAATBTuhGv9Vkb9R

- `ing/` 식재료 · 요리 그림 20×20 (`px68.py` 그림판 · `ing68.py` 그림 29개 → `python3 ing68.py <icons68.json> <미리보기.png>`).
  하르겐 시장 8(감자 · 양파 · 당근 · 양배추 + 날고기 · 밀가루 · 향신료 · 야생 꿀 새 그림) · 나라 특산 10 · 해산물 6 · 무정란 · 요리 4.
- `cook/cook68.js` 요리 화면 (큰 구리솥 · 넣으면 솥 위에 나타나 퐁당 · 빼면 국물에서 솟아 창고 칸으로 · 요리하기 · 새 레시피 카드).
  `run.py <출력> still|gif|fail [dpr]` — 게임 빌드(dist/play.html)에 `window.__EV` 훅을 걸어 게임 그리기 도구(q* · q3Light · rqArt)를 빌려 그린다.
- `farm/farm68.js` 재배소 장소 장면(HQS.farm · hqPlaces에 끼움) · `run.py` 낮 · 밤 · 2동, `win68.js` · `winrun.py` 재배소 창.
- `pen/pen68.js` 사육장 창(부화 확률 계단 · 품는 알 ? · 펫 레어도 칸) · 유정란/무정란 알림 · 도감 요리 탭 · 식재료 그림판, `run.py`.
- `port/port68.js` 항구 장소 장면(HQS.port · 선술집 다음 · 배가 있을 때 / 없을 때 「다음 배 D-n」) · `run.py` 낮 · 밤 · 빈 부두, `win68.js` · `winrun.py` 항구 창(해산물 · 레시피 100,000G).
  (11-12 19:57 사용자 답: 해상왕국은 「처음부터 열린 시설 항구 + 해상왕국 배가 찾아온다」 — 교역 원정 길은 버림.) `ing68.py`에 레시피 그림 `recipe` 더함.
- 스크립트 안의 `D`는 세션 작업 폴더(scratchpad/v68/) — 다시 돌릴 때 이 폴더 구조로 옮기고 D를 바꾼다.
- `out/` 보여 준 그림: d68_cook.gif · d68_cookfail_dex.png · d68_farm_scene.png · d68_farm_win.png · d68_pen.png · d68_ingredients.png · d68_port.png · d68_skyeye.png(하늘의 눈 다시 그린 시안 넷 — 원본은 시안 저장소 dot/skyeye68.py).
