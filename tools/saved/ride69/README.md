# 해룡 탈것 시안 (빌드 69, 11-14) — 게임에 아직 안 넣음

- 사용자: 11-13 21:22 「용기수 푸른 용 탈것을 해마 꼴 해룡으로」 · 11-14 00:42 「해룡(용기수 탈것)은 해상왕국이 배로 올 때 가져와서 판매」 · 12:18 「ㄱㄱ」(그림 시안부터).
- `seadragon.py <출력.json>` — 해마 꼴 용 넷(A 산호 · B 해초 · C 심해 · D 진주), 장 idle0 · idle1 · run0~3 · seat · float.
  그림 도구는 `../ride65/g`(cv · shp · blunt), 꼴은 `../ride65`(wyv.json · export_ride.py)와 같다 — 고르면 export_ride.py에 해룡 종류(또는 와이번 모습)로 넣는다.
- 대롱 주둥이 + 푸른 몸 + 크림 배(유명한 해마 용 캐릭터)는 피했다: 짧은 용 주둥이(턱 · 이빨), 푸른 몸에 크림 배를 쓰지 않음.
- `sd_rend.py <훅 페이지> <seadragon.json> <폴더>` — RIDE65.wyv에 모습을 끼워 실제 rideComp(탈것 + 용기수)로 찍는다 · `sd_sheet.py` → `seadragon_drafts.png`.
- 아직 없는 것: 앞모습(front0 · front1 + 머리 덮개) · 자는 모습(sleep0 · sleep1) — 고른 뒤에 그린다.
