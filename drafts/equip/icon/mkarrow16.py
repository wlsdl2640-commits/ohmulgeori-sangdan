"""화살(궁수 공통) 판 → A_arrow16.png: 원형 나무 넷 · 카본 넷 + 16묶음"""
from mktype import section_sheet, FRM, BIG
import arrow16, carr
tfr = [(arrow16.ticon(d)[1].render(), '나무 ' + d['key'], d['name'], d['desc']) for d in arrow16.TFR]
cfr = [(carr.icon(d)[1].render(), '카본 ' + d['key'], d['name'] if d['key'] != 'C' else '세 날 광역촉 화살', d['desc']) for d in carr.FR]
it = [(arrow16.icon(d)[1].render(), 'Lv%d · %s %s' % (d['lv'], '나무' if d['lv'] <= 70 else '카본', d['st']), d['name'], d['desc']) for d in arrow16.G]
print(section_sheet('A_arrow16.png', '화살 — 궁수 공통 부장비 (화살 칸 · 모든 궁수 직업 · 1차부터 Lv1 ~ 150)',
    '23:58 「화살은 그냥 기본 화살 같이쓰자」 · 23:59 「이번에 만든 화살 이미지는 기본화살쪽으로」 → 원형 여덟 = 나무 넷(지금 게임 화살을 20×20으로 새로) + 카본 넷. 이름은 제안. 오른쪽 위 = 게임 속 크기',
    [('원형 — 나무 화살 넷 (새로)', tfr, FRM, (240, 170, 90)), ('원형 — 카본 화살 넷 (23:40에 만든 것)', cfr, FRM, (240, 170, 90)),
     ('16묶음 — Lv1 ~ 70은 나무 넷을 두 번 · Lv80 ~ 150은 카본 넷을 두 번 (묶음마다 A · B · C · D 한 번씩)', it, BIG, (150, 142, 128))]))
