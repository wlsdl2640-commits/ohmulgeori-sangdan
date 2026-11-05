"""유성우 넷째 판 (사용자: "4번의 배경에 별똥별 화살 속 이미지를 결합해서 시안 4개").
배경 = 셋째 판 4번(오로라 + 눈 덮인 숲), 그림 = 별똥별 화살(별자리 활 + 금 화살) 쪽. 이름: awk_archer_13 … _16 (시트에는 1~4)"""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar, arx, arrow_xs, recol, AP, GOLD_ALL, GOLDP
from var_ar import A, GOLD, streak
from var_ar3 import meteor_streak
def aurora_bg(top_shift=0.0, low=9.0):
    """오로라 + 눈 덮인 숲 (셋째 판 4번 배경)"""
    a = A('night', cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for x in range(16):
        top = 1.5 + top_shift + 1.6 * math.sin(x * 0.6); bot = low + 1.4 * math.sin(x * 0.45 + 1.0)
        for y in range(max(0, int(top)), int(bot)):
            t = (y - top) / max(bot - top, 1)
            c = mix('#5ae09a', '#7a4ad0', t) if x % 2 else mix('#8af0c0', '#9a6ae8', t)
            a.set(x, y, mix(a.get(x, y), c, 0.62 - 0.25 * t))
    for (x, y) in [(2, 11), (13, 12), (9, 11), (5, 13)]: a.set(x, y, '#ffffff')
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#f0f6ff' if y == 17 else '#c8d4e8')
    TREES = ['..w......w....w.', '.wkw....wkw..wkw', '.kkk...wkkkw.kkk', 'wkkkw..kkkkkwkkk']
    a.paint(TREES, {'k': '#0a1828', 'w': '#e8f0ff'}, ox=0, oy=13)
    return a
def const_bow(a, pts, string_mid, line_c='#e0e0ff', str_c='#6a6ac8'):
    for (p0, p1) in zip(pts, pts[1:]): line(a, *p0, *p1, line_c)
    line(a, *pts[0], *string_mid, str_c); line(a, *string_mid, *pts[-1], str_c)
    for (x, y) in pts: star5(a, x, y, '#ffffff', '#fff0a0', '#c8a8ff')
# 1) 오로라 하늘에 별자리 활 → 오른쪽으로 금 화살
def awk_archer_13():
    a = aurora_bg()
    const_bow(a, [(6, 2), (3, 4), (2, 8), (3, 12), (6, 14)], (5, 8))
    for i in range(0, 5, 2): a.set(7 + i, 8, '#ffffff')
    arx(a, 'r', 15, 8, 1, GOLD_ALL, GOLDP)
    return a, 0
# 2) 별자리 활이 하늘로 쏜 화살 → 숲으로 쏟아지는 별똥별 화살
def awk_archer_14():
    a = aurora_bg()
    const_bow(a, [(1, 7), (2, 4), (5, 2), (8, 2)], (4, 6))
    for i in range(3): a.set(6 + i, 5 - i, '#ffffff')
    for (tx, ty) in [(4, 13), (9, 15), (13, 11)]:
        for i in range(2, 6): a.set(tx + i, ty - i, mix('#ffffff', '#9ab4ff', i / 6))
        arx(a, 'dl', tx, ty, 1)
    return a, 0
# 3) 오로라를 가르고 떨어지는 큰 금빛 별똥별 화살
def awk_archer_15():
    a = aurora_bg()
    tail(a, 5.0, 12.0, 17.0, 0.0, 2.4, 0.4, ['#ffffff', '#fff4c0', '#ffc860', '#e07a2a'])
    for (x, y) in [(10, 5), (13, 3), (8, 9)]: plus(a, x, y, '#ffffff', '#fff0a0')
    ar(a, 'dl', 4, 13, 0, GOLD_ALL, GOLDP, small=True)
    return a, 0
# 4) 별 촉 화살 셋이 반짝이며 숲으로
def awk_archer_16():
    a = aurora_bg()
    for (hx, hy) in [(3, 11), (8, 14), (12, 10)]:
        for i in range(3, 7): a.set(hx + i, hy - i, mix('#ffffff', '#c8a8ff', i / 7))
        arx(a, 'dl', hx, hy, 1)
        star5(a, hx, hy, '#ffffff', '#fff0a0', '#ffd84a')
    return a, 0
ICONS = {f'awk_archer_{k}': (f'유성우 {k - 12}', 'dmg', globals()[f'awk_archer_{k}']) for k in range(13, 17)}
