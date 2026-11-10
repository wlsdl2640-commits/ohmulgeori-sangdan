"""짐꾼 계열 무기 원형 판 → P_frames.png: 채찍(마부 · 코네스토가 · 캐러밴마스터) · 정글칼(정찰가 · 탐험가)"""
from mktype import section_sheet, FRM
import whip2, machete
wh = [(whip2.icon(d).render(), '원형 ' + d['key'], d['name'], d['desc']) for d in whip2.FR]
mc = [(machete.icon(d)[1].render(), '원형 ' + d['key'], d['name'], d['desc']) for d in machete.FR]
print(section_sheet('P_frames.png', '짐꾼 계열 무기 — 원형 시안 (11-11 00:34)',
    '몽둥이는 데이터만 남기고 그대로(짐꾼). 손잡이 · 자루 끝은 칼과 같은 축(왼쪽 아래 → 오른쪽 위). 채찍 끝끈 · 술은 테두리 없는 가는 줄. 이름은 제안. 오른쪽 위 = 게임 속 크기',
    [('채찍 — 마부(2차) · 코네스토가(3차) · 캐러밴마스터(4차) · 2차부터 Lv50 ~ 200', wh, FRM, (240, 170, 90)),
     ('정글칼 — 정찰가(2차) · 탐험가(3차) · 2차부터 Lv50 ~ 200', mc, FRM, (240, 170, 90))], z=7))
