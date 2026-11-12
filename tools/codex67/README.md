# 직업별 장비 도감 (빌드 67, 11-13 사용자 「모든 장비들 직업 이미지가 맨 앞에 … 각 직업별 장비들 정보 만들어서 보여줘, 공용장비도 다」)

- 올린 곳: Claude 아티팩트 「판타지상단키우기 장비 도감」 https://claude.ai/artifact/EG7uvz2kNqETAhgcsUshVA
- 다시 뽑기 (게임 자료가 바뀌면):
  1. `BUILD_NO=67 python3 build.py` → `dist/play.html`에 훅(`window.__EV = s => eval(s);`)을 넣은 사본을 만든다
  2. `python3 tools/codex67/extract.py <훅 사본> catalog.json` — 직업(계열 · JOB_TREE 차례) · 직업 그림(그 레벨 대표 무기 · 부장비, 탈것은 타고) · 장비 종류마다 착용 레벨 순 그림 · 이름 · 능력치(일반 등급) · 얻는 곳(떨어짐 · 대장간 · 투기장 · 삼) · 그림만 있는 다음 레벨
  3. `python3 tools/codex67/build_page.py catalog.json gear-codex.html` — 갈무리 글꼴을 쪽에 쓰는 글자만 남겨 넣는다
  4. 같은 아티팩트 주소로 다시 올린다
- 공용 장비(cls all: 벨트 · 반지 · 부적 · 챔피언의 반지 · 귀걸이 · 가방)는 직업 카드에서 빼고 「공용」 탭에만.
