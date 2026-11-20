# 첫 화면 (빌드 72 · 11-21)

- `title_labyrinthos.png`: 사용자가 준 첫 화면 그림(미궁도시 라비린토스 — 광장과 미궁의 탑). 받은 그대로.
- 게임에는 1344×756 WebP(품질 84)로 줄여 `src/data-title.js`의 `TITLE_ART`에 넣는다(다시 뽑기: 이 폴더의 그림을 PIL로 줄여 base64).
- 화면: markup.html `#title-scr`(첫 화면 — 게임시작 · 시스템설정 · 언어설정) · `#t-found`(길드 창립 신청서) · `#t-opt` · `#t-lang`, ui.js showTitle, style.css `.title-scr …`.
