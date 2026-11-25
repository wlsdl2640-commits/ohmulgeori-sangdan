# 짐꾼 1차 스킬 효과 (11-26 새벽 시작 — 전사와 같은 길, 시안은 버리지 말 것)
- 공격(픽셀랩 create_image_pro · 충격파 quake_a 그림체 참고 upload:6ee842f6…, ① 차분 ~ ④ 최대): 석궁 쏘기 `bolt_1~4` · 짐 던지기 `junk_1~4` · 짐 사태 `aval_1~4`(344×192). jobs_in.json · run_pro.mjs. 판 `../page_porfx_1_attack.html`(mk_porfx.py — 짐꾼 동작 shoot v4 9장 · throw v4 15장 · avalanche2 v1 8장 위에).
- 충격파(shockwave)는 전사와 같은 스킬 → 전사 효과 quake_a 그대로 쓸 생각(대표님 확인).
- 버프(효과 도구, 전사 돌격 함성 v5와 같은 길 — 몸 감싸는 빛 + 머리 위 아이콘, 동료 = 전사 서 있기): 짐꾼의 함성(청동빛) 776fc245 · 동료 78bf44ed / 물통 돌리기(물빛 · 물방울 · 바람 줄) 08e2363e · 동료 5a55f530 / 짐 덜어 주기(연둣빛 · 깃털 조각) 154dd9ad · 동료 2e371fca. 아이콘 = 게임 SKICON shout · medkit · shieldbag 16×20을 2배(`../../war_v2/fx4/icons/`). `mk_porbuff.py` → buff/*_scene.gif → `mk_porbuffpage.py` → `../page_porfx_2_buff.html` · `_3_buff.html`.
