# 해룡 (빌드 69, 11-14) — 탈것 넷 · 몬스터 · 새끼 펫 · 해룡기수 모두 넣음(15:54)

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

## 11-14 15:54 「해룡 몬스터 · 새끼 펫 그림 — 이대로 하고, 30LV에 해룡의 모습으로」 · 「해룡 알 — 1번으로」 · 「해룡기수 — 그렇게 넣자」 → 넣음
- `export_sea.py <src/pxsea69.js>` — seadragon_mon.json(야생 넷 · 새끼 넷)을 PXU 항목으로(PXU seadragon · _b · _c · _d · pet_seadragon* · PXU_SKIN · PXU_SKIN_NAME · pxuLook · MONS pet_ 이름표 · PXU_ACT 물기 qbite · 물 뿜기 wspit · 해룡기수 그림 PXL.seadragoon = 용기수 그림을 바다빛으로). 게임 파일은 손으로 고치지 말고 시안을 고친 뒤 다시 뽑는다.
- 몬스터 · 펫 · 알 · 직업 데이터는 `src/data-sea69.js`(build.py에서 data-monup69 다음): MONS.seadragon(심해 Lv150 ~ 170 — 땅이 생기면 FIELDS.deepsea.mons에) · 펫 넷(Lv30 = PET_EVO_LV에 그 모습의 해룡) · 알 넷(pet.js petKill이 쓰러뜨린 해룡의 모습을 이어받음) · CLASSES.seadragoon(4차, from 용기수, req petSea — econ.js promote가 그 펫을 탈것 a.ride.sea로) · 스킬 여섯(물살 화살 tgt 'pierce' = 맨 앞 적과 그 뒤 적 · 거품 감옥 · 해룡왕의 화살 tgt 'strong' = 가장 센 적 — core.js pierceFoes · strongAwake).
- pxride65.js rideKind: chainOf에 seadragoon → 'sea'(용기수보다 먼저).
- `shot_rider.py <훅 페이지> <폴더>` — 해룡기수(해초 해룡 B · Lv170) + 성기사 · 대주교 · 대마도사, 새끼 심해 해룡 펫(C) / 다 자란 진주 해룡 펫(D)으로 용암 화산 전투 둘 · 영웅 창 앞모습 → `seadragoon_game.png`.
- 아직 시안부터: 해룡기수 기수 그림 · 스킬 그림 여섯(지금은 바다빛 용기수 · 예전 글리프).
