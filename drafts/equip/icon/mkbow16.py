"""활 16자루 판 넷 → A_short16.png · A_comp16.png · A_long16.png · A_great16.png"""
from mktype import type_sheet
import bow16, bowf
TITLE = {'short': ('A_short16.png', '단궁 — 궁수 · 정찰가 · 탐험가 (1차부터, Lv1 ~ 150)', ''),
         'comp': ('A_comp16.png', '복합궁 — 레인저 (2차부터, Lv50 ~ 200)', ' · 2차 직업부터 쓰니 Lv50 ~ 200'),
         'long': ('A_long16.png', '장궁 — 저격수 · 신궁 (2차부터, Lv50 ~ 200)', ' · 2차 직업부터 쓰니 Lv50 ~ 200'),
         'great': ('A_great16.png', '대궁 — 사냥꾼 · 괴수사냥꾼 (2차부터, Lv50 ~ 200 · 트래커 · 스토커와 합치는지는 물어봄)', ' · 2차 직업부터 쓰니 Lv50 ~ 200')}
for k, (path, title, tail) in TITLE.items():
    fr = [(bowf.icon(d)[1].render(), '원형 ' + d['key'], d['name'], d['desc']) for d in bowf.FR if d['kind'] == k]
    it = [(bow16.icon(d)[1].render(), 'Lv%d · 원형 %s' % (d['lv'], d['st']), d['name'], d['desc']) for d in bow16.G[k]]
    print(path, type_sheet(path, title, '원형 넷(A_frames)을 네 레벨 묶음마다 한 번씩 · 자루마다 이름 · 재질 · 손잡이 · 끝 · 고리 · 깃 · 빛이 다르다. 시위는 축 위 흰 줄. 이름은 제안. 오른쪽 위 = 게임 속 크기',
                           fr, it, ihead='16자루 (네 레벨 묶음마다 A · B · C · D 한 번씩)' + tail))
