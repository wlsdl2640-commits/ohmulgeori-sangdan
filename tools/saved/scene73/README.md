# 미궁도시 · 시설 장면을 한 그림체로 (11-25 밤, 픽셀랩)
대표님: 「미궁탑이랑 도시가 그려진 그림도 우리 그림체에 맞게 픽셀랩에서 다시 뽑아, 모든 시설이나 장면도 다 통일된 그림체로 맞춰」.
- 픽셀랩 `create_image_pro` — 첫 화면 688×384(25생성분) · 방 17장 792×336(25생성분씩).
- **구도 참고** = 원래 그림(title72/title_labyrinthos.png · rooms72/room_*.png를 768로 줄여 reference_images) · **그림체 참고** = 이번 밤 픽셀랩 계층 배경 `plx73/bg_antnest2/00.png`(외곽선 · 명암 · 디테일만, 색은 안 따라감).
- 시험 두 장(title.png · lobby.png)이 원래 구도 그대로 또렷한 도트로 나와 나머지 16장을 `run_img.mjs`로(jobs_in.json · jobs_done.json · log.txt). 토큰은 ~/.claude.json pixellab 설정에서 프로세스 안에서만.
- 게임에는 아직 안 넣음(대표님이 보고 고른 뒤 data-title.js · data-rooms.js에).
