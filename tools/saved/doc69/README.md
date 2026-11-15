# 빌드 69 설명 문서 그림 (11-16 사용자 「새롭게 추가된 것들을 설명하는 문서도 작성 해주고, 아이템, 직업, 몬스터등은 이미지도 만들어서 넣어줘」)
문서: Claude 문서 「판타지상단키우기 빌드 69 — 새로 들어온 것」 https://claude.ai/artifact/4Y619kHrGmBFcnAQq7fi95 — 그림은 모두 실제 게임 그리기 · 화면.
- `sheets.py <훅 페이지> <출력 폴더>` → jobs.png(해룡기수 탈것 넷 옆 · 앞) · skills.png(해룡기수 스킬 여섯 · 짐꾼 넷 · 신성력 넷) · mons.png(천둥새 · 킹슬라임 · 해룡 넷 · 새끼 해룡 넷) · items.png(마석 여덟 · 마나 물약 넷 · 해룡 알 넷 · 천둥새 부속품 둘). 페이지 위에 판을 놓고(rideComp · pxuSprite · drawMon · iArt · skIco · mastIco) 그 칸만 찍는다(DPR 2).
- `formation.py <훅 페이지> <출력 폴더>`(form69/shot89f.py를 인자로) → formation.png(파티 여섯 걷기 장면, 하늘을 잘라 땅 쪽만).
- `slots.py <stoneart69/shot89m.py 출력 폴더> <출력.png>` → slots.png(장비 칸 창 · 창고 「룬·마석」 · 능력치 탭).
- 함께 쓴 그림: stat69/v101/swing_sheet.png(기본 공격 실행 1.5초) · raidwin69/raid_window_r2_game.png(레이드 원정대 창).
- 훅 페이지: `python3 tools/saved/bal69/mkpage.py <출력.html>`. 라벨 글꼴은 Noto Sans CJK KR(/usr/share/fonts/opentype/noto, index 1).
