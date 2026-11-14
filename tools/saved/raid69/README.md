# 레이드 보스 새 그림 (빌드 69)

## 킹슬라임 (넣음 — 11-14 00:42 「킹슬라임B안」)
- `kingslime.py <출력.json>` — 평원 초록 슬라임을 크게 키운 32×24 반 해상도 격자 A · B · C. 게임에는 B(머리 위 작은 왕관)가 `src/pxraid.js` PXRAID.kingslime에 들어갔다.
- `shot.py` · `sheet.py` — 시안판 `kingslime_drafts.png`, 넣은 뒤 `kingslime_B_game.png` · `kingslime_B_raid_r2.png`.

## 천둥새 (시안 — 11-14 12:18 「ㄱㄱ」, 게임에 아직 안 넣음)
- 옛 대그리핀 자리(레이드에 남는 보스, id raidgriffon 그대로). `thunderbird.py <출력.json>` — 44×32 반 해상도 격자 A 먹구름 날개 · B 번개 깃 · C 비바람 → `thunderbird.json`.
- 날개깃은 한 장씩 뒤에서 앞으로 겹쳐 칠하고(깃마다 위 가장자리 빛), 게임 굽기(pxBake)가 바깥 테 · 부위 사이 선을 더한다.
- 노란 몸 · 뾰족 깃 번개새(유명한 캐릭터)와 겹치지 않게 노랑은 쓰지 않았다(먹구름 · 쪽빛 · 청백 번개).
- `tb_rend.py <훅 페이지> <thunderbird.json> <출력.png>` — PXRAID.raidgriffon을 바꿔 끼워 실제 drawMon으로 · `tb_scene.py` — 실제 레이드 싸움(네 파티) · `tb_sheet.py` → `thunderbird_drafts.png`.
- 고르면: PXRAID.raidgriffon = 고른 격자 · MONS.raidgriffon W/H · 이름 「천둥새」(RAIDS.griffon · FIELDS.raid_griffon · 도감) — 그리핀 이름은 일반 몬스터 그리핀에 그대로.
- 스크립트 안 경로는 세션 작업 폴더(scratchpad) 기준 — 새 세션은 경로만 바꿔 쓴다.

## 천둥새 노란 번개 (시안 — 11-14 13:45 「천둥새 노란색 번개 색상 구상해봐」)
- `thunderbird.py`가 AY · BY · CY도 뽑는다 — 격자는 A · B · C 그대로, 팔레트만 `YEL`(번개 L 노랑 · l 주황빛 호박 · 눈 E 노랑) + B는 볏 R 노랑(`YEL_K`). 몸은 어둡게 둔다(노란 몸 번개새와 겹치지 않게).
- `tb_rend.py … cur A AY B BY C CY` → game_y.png · `tb_scene.py … AY BY CY` → sc/scene_*.png · `tb_sheet_y.py <그 폴더> <출력>` → `thunderbird_yellow_drafts.png`.
