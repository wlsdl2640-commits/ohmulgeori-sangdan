# 해룡 (빌드 69, 11-14) — 탈것 넷은 게임 데이터에 넣음, 몬스터 · 새끼 펫은 시안

- 사용자: 11-13 21:22 「용기수 푸른 용 탈것을 해마 꼴 해룡으로」 · 11-14 00:42 「해룡(용기수 탈것)은 해상왕국이 배로 올 때 가져와서 판매」 · 12:18 「ㄱㄱ」(그림 시안부터).
- `seadragon.py <출력.json>` — 해마 꼴 용 넷(A 산호 · B 해초 · C 심해 · D 진주), 장 idle0 · idle1 · run0~3 · seat · float.
  그림 도구는 `../ride65/g`(cv · shp · blunt), 꼴은 `../ride65`(wyv.json · export_ride.py)와 같다 — 고르면 export_ride.py에 해룡 종류(또는 와이번 모습)로 넣는다.
- 대롱 주둥이 + 푸른 몸 + 크림 배(유명한 해마 용 캐릭터)는 피했다: 짧은 용 주둥이(턱 · 이빨), 푸른 몸에 크림 배를 쓰지 않음.
- `sd_rend.py <훅 페이지> <seadragon.json> <폴더>` — RIDE65.wyv에 모습을 끼워 실제 rideComp(탈것 + 용기수)로 찍는다 · `sd_sheet.py` → `seadragon_drafts.png`.

## 11-14 13:45 「다 추가하고, 해룡도 몬스터로 구상해서 알로 얻을 수 있게 · 펫을 30LV까지 키워서 용기수 다음 4차전직용(해룡기수) · 거품마차용 말로도 사용 예정」
- 항구에서 탈것을 파는 안은 없앴다 — 알로 얻어 펫으로 키운다.
- **탈것 넷 넣음**: `seadragon.py seadragon.json` → `seadragon_fs.py seadragon.json`(앞모습 front0 · front1 + 머리 덮개 _f · 자는 모습 sleep0 · sleep1을 같은 파일에 더함) → `../ride65/export_ride.py src/data-ride65.js`(RIDE65.sea[A~D] — 늑대 · 와이번 데이터는 바이트까지 그대로). pxride65.js `RIDE_KIND_NAME.sea` · rideShadow만 — rideKind에는 해룡기수가 들어올 때 잇는다.
- `sd_rend2.py <훅 페이지> <seadragon.json> <출력.png>` — RIDE65.wyv에 통째로 끼워 실제 rideComp(옆 · 앞) · rideMSpr(자는 모습)로 찍는다 → `mon_sheet.py`가 `seadragon_fs.png`로.
- **몬스터 · 새끼 펫 시안**: `seadragon_mon.py <출력.json>`(야생 = seahorse(S + wild) 안장 없음 · 몬스터 장 POSE_MON bite · swell · spit(입 벌림 mouth) · 발 밑 빈 4줄, 새끼 = 머리 큰 아기 해마 용) → `mon_rend.py <훅 페이지> <json> <폴더>`(PXU · MONS에 잠깐 끼워 pxuSprite 가까이 + 늪지대 전투 둘) → `mon_sheet.py <폴더>` → `seadragon_mon_drafts.png`.
- seadragon.py에 더한 것(탈것 장은 그대로): `S['wild']`(안장 · 가슴 끈 없음) · `P['mouth']`(턱을 경첩에서 0.6×mouth 라디안 벌림 · 입 안 K · 윗니 셋 · 아랫니) · POSE_MON.
