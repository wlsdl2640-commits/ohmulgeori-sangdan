# 3층 개미굴 · 늪지대 시안 (11-25 낮, 회의 c1 → 픽셀랩)
- 회의: ai-meeting `c1_antnest` → 저장소 docs/meeting/c1_개미굴늪지대_최종안.md(픽셀랩 그림 목록).
- `create_image_pro` — 몬스터 96×96(후보 4) · 문지기 144×144(후보 4) · 여왕 256×256(한 장씩 4번, seed 1000~1003) · 물길 배경 528×224(낮 · 밤, 늪 시안 A · B를 참고 그림 · 스타일로).
- 그림체 참고(style_image) = plx73/workerant/01.png. 지시문 꼬리: 효과 · 섬광 · 사람 없이 몬스터만.
- 병정개미는 첫 판 머리가 작아 jobs_in2.json(머리 = 몸만큼)으로 다시 뽑아 바꿈.
- 실행: `node run_pro.mjs [동시 수] [jobs 파일]` → <key>/NN.png · 검사 판 `sheet.py` · 페이지 `mk_page.py` → page_plx74.html.
- 정원 일개미 · 수렁 큰부리는 plx73 시안 그대로.
