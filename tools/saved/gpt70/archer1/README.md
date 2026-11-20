# 궁수 부탁 묶음 (11-20 12:34 사용자 「이번엔 궁수 ㄱㄱ」)

마법사 묶음(`../mage1/`)과 같은 길. GPT에 보낼 지금 궁수 그림과 부탁 글 넷(기준 자세 5장 한 줄 · 걷기 16 · 활쏘기 16 · 쓰러짐 16, 16장 판은 두 줄 × 8).

```
python3 ../mage1/run_m1.py <훅 페이지> out archer bow        # 작업 폴더에서 — 지금 궁수 자세 · 활 동작을 뽑는다
KIT=archer python3 ../mage1/magepage.py out site              # site/ archer_now.png · archer_all.png · style_warrior_walk.png · index.html (틀 page_archer.html)
```

- 활쏘기 판: 7번째 장 = 화살이 떠나는 장(화살 · 빛은 그리지 않게 — 게임이 따로 그린다).
- 받은 판 넷은 마법사처럼 40칸으로 다시 찍어 넣는다(`../mage1/seg_m1.py` · `extract_m1.py` — 바탕 마젠타만 지우는 열쇠. 초록 옷이라 색 걱정은 없다).
- 페이지: 아티팩트 「궁수 부탁 묶음」(주소는 CLAUDE.md).

## 받은 판 → 게임 (11-20 12:45)
```
CLS=archer python3 ../mage1/extract_m1.py 40 [점검판]      # 작업 폴더에 out_archer1_40/ · archer1_pal.pkl
python3 ../hd70/export_hd70.py <src/data-hd70.js>          # adv.archer
TEAM=warrior,archer,mage python3 ../mid70/cap_mid.py <훅 페이지> cap/arch fight 56 0.0667 12
KIT=archer python3 ../mage1/magepage.py out site - - cap/arch   # 페이지 맨 위 「게임에 넣은 모습」
```
활쏘기 판: 판의 9 · 10번째 장은 화살을 다시 쥔 그림이라 쓰지 않는다(hd70.js HDA_SEQ.shot). 키는 두건 끝까지 40칸.
