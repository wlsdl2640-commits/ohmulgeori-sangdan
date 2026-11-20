# 짐꾼 부탁 묶음 (11-20 13:17 사용자 「이거 정리하고 다음 짐꾼」)

앞 직업들과 같은 길. 아티팩트 「짐꾼 부탁 묶음」(주소는 CLAUDE.md).

```
python3 ../mage1/run_m1.py <훅 페이지> out porter club
KIT=porter python3 ../mage1/magepage.py out site
```

- 지금 짐꾼: 삐죽한 갈색 머리 · 붉은 머리띠 · 밀빛 윗옷 · 큰 갈색 등짐(위에 붉은 담요) · 몽둥이.
- 판 넷: 기준 자세 5 · 걷기 16 · 몽둥이 내려치기 16(2 ~ 5번째 = 치켜들기 · 7번째 = 맞히는 장) · 쓰러짐 16. 등짐 크기가 장마다 달라지지 않게 글에 적었다.
- 받은 뒤: `CLS=porter`를 ../mage1/extract_m1.py(ATK 표 · 걷기 닻 — 등짐이 넓어 머리띠 자리로 잡는 게 낫다) · ../hd70/export_hd70.py · hd70.js HDCFG에 한 줄씩.

## 11-20 13:47 등불
사용자(등불 판 「부장비 47」을 보내며) 「짐꾼 손에 이거 들어야 해」 → 왼손에 Lv1 등불(lantern_lv1.png = 판에서 그 그림만 오림). 부탁 글 1에 그림 셋을 붙인다.

## 받은 판 → 게임 (11-20 14:43)
`CLS=porter python3 ../mage1/extract_m1.py 40` → `../hd70/export_hd70.py` → hd70.js HDCFG.porter. 판 `../hd70/sheets/porter1_*`. 페이지: `TEAM=warrior,porter,cleric`로 찍고(짐꾼은 파티에 하나) `KIT=porter python3 ../mage1/magepage.py out site - - <cap 폴더>`.
