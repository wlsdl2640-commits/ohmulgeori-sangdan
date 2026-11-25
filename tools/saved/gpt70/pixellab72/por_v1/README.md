# 짐꾼(1차) 동작 다시 만들기 (11-25 · 로드맵 직업 모델링 전사 → 짐꾼)

- 기준 그림 `porter_east_120.png`(동쪽 · 키 105 · 궁수 · 전사와 같은 크기 · 그림체). GPT(Codex) 원본 `../porter_gpt_src1.png`(옛 판 `../porter_ref_512.png` = hd70/sheets/porter1_base.webp 옆모습 + 궁수 그림) → `python ../fit_crisp.py ../porter_gpt_src1.png porter_east_120.png 105 120`.
- 무기는 몽둥이가 아니라 **석궁**(회의 a6 · a11 · a13 — 1차 짐꾼 · 정찰가 · 탐험가 = 석궁) + 왼손 등불 + 큰 등짐(붉은 담요).
- 움직이기: `anim/up.mjs <png>`(첫 장 올리기) → `anim/jobs_in.json` → `node anim/run_anim.mjs 6`(전사와 같은 runner — 결과 `anim/<동작>/<v>/NN.png`) → 효과 지우기 `anim/clean.py` → 시안 쪽 `python mk_page.py ../page_por [clean]`.
- 동작(1차 스킬 a14 짐꾼 8개 중 동작이 있는 것 + 기본): 서 있기 · 걷기 · 달리기 · 맞음 · 쓰러짐 · 앉기 · 자기 · 뒤로 피하기 · 석궁 쏘기(기본 공격) · 짐 던지기 · 짐꾼의 함성 · 물통 돌리기 · 충격파 · 짐 덜어 주기 · 짐 사태. 튼튼한 등짐 · 짐 노새는 상시라 동작 없음.
