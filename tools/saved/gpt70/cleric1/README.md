# 사제(성직자 1차) 부탁 묶음 (11-20 12:49 사용자 「이제 사제」)

마법사 · 궁수 묶음과 같은 길. 아티팩트 「사제 부탁 묶음」(주소는 CLAUDE.md).

```
LOOK='{"head":"hood","c1":"#bcd6ee","hc":"#a9c8e6","ex":[]}' python3 ../mage1/run_m1.py <훅 페이지> out cleric mace
KIT=cleric python3 ../mage1/magepage.py out site
```

- **생김새를 바꿔 부탁한다**: 지금 게임 성직자는 흰 머리 수건 · 흰 로브 · 이마의 금색 십자 무늬(pxa.js PXL.cleric — coif · holy). 그림 규칙(십자 · 후광 · 흰 옷과 머리 수건을 피함)에 걸려서, 붙이는 그림을 하늘빛 후드 로브로 바꿔 뽑고(LOOK) 부탁 글에 「가슴의 금색 둥근 해 장식 · 십자 무늬 · 후광 · 흰 옷은 그리지 않는다」를 넣었다. 사용자가 다르게 정하면 LOOK과 page_cleric.html의 생김새 글만 바꾼다.
- 판 넷: 기준 자세 5 · 걷기 16 · 철퇴 내려치기 16(2 ~ 5번째 = 철퇴를 머리 위로 — 치유 · 강화 동작으로도 쓴다 · 7번째 = 맞히는 장) · 쓰러짐 16.
- 받은 뒤: `CLS=cleric`을 ../mage1/extract_m1.py(ATK 표 · 걷기 닻)와 ../hd70/export_hd70.py · hd70.js HDCFG에 한 줄씩.

## 11-20 12:54 셉터 + 성표 · 13:01 받은 판 → 게임
- 사용자: 철퇴 대신 셉터, 왼손에 Lv1 성표(holy_lv1.png — 사용자 성표 판에서 오림). 위의 「가슴 해 장식」은 뺐다.
- `CLS=cleric python3 ../mage1/extract_m1.py 40` → `../hd70/export_hd70.py` → hd70.js HDCFG.cleric. 페이지: `KIT=cleric python3 ../mage1/magepage.py out site - - <cap 폴더>`.

## 11-20 14:22 셉터 판
사용자가 셉터 21장 판(../../scepter70/)을 만들어 옴 → 부탁 글의 셉터를 Lv1 견습 셉터(scepter_lv1.png · 고리 셋 머리)로. 이미 넣은 판은 파란 구슬 셉터라, 판 넷을 다시 받으면 `hd70/sheets/cleric1_*`를 바꿔 다시 뽑는다.
