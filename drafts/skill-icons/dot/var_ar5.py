"""유성우 다섯째 판 (사용자: "1번 시안을 4개 더 만들어봐") — 넷째 판 1번(오로라 + 눈 숲 + 별자리 활 → 금 화살)을 바탕으로 4가지.
이름: awk_archer_17 … _20 (시트에는 1~4)"""
import math
from cell import Art, mix, W, H
from lib import *
from arrows import ar, arx, recol, AP, GOLD_ALL, GOLDP
from var_ar import A, GOLD
from var_ar3 import meteor_streak
from var_ar4 import aurora_bg, const_bow
# 1) 큰 별자리 활 + 위로 쏜 금 화살이 긴 별빛 꼬리를 끎
def awk_archer_17():
    a = aurora_bg()
    const_bow(a, [(5, 2), (2, 4), (1, 8), (2, 12), (5, 14)], (4, 8))
    for i in range(1, 8): a.set(5 + i, 8 - i * 6 // 7, mix('#ffffff', '#fff0a0', i / 8))
    for i in range(1, 8): a.set(6 + i, 8 - i * 6 // 7, mix('#c8b0ff', '#8a6ae0', i / 8))
    arx(a, 'ur', 14, 2, 1, GOLD_ALL, GOLDP)
    for (x, y) in [(10, 9), (12, 12), (8, 4)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
# 2) 별자리 활이 금 화살 셋을 부채꼴로 (유성우 = 여러 발)
def awk_archer_18():
    a = aurora_bg()
    const_bow(a, [(5, 2), (2, 4), (1, 8), (2, 12), (5, 14)], (4, 8))
    for i in range(0, 4, 2): a.set(6 + i, 8, '#ffffff')
    arx(a, 'ur', 12, 3, 0, GOLD_ALL, GOLDP)
    arx(a, 'r', 15, 8, 0, GOLD_ALL, GOLDP)
    arx(a, 'dr', 12, 13, 0, GOLD_ALL, GOLDP)
    for (x0, y0, x1, y1) in [(7, 7, 9, 5), (7, 9, 9, 11)]:
        for i in range(3): a.set(x0 + (x1 - x0) * i // 2, y0 + (y1 - y0) * i // 2, '#ffffff') if i != 1 else None
    return a, 0
# 3) 위를 겨눈 별자리 활 (활이 아래, 화살이 오로라 속으로)
def awk_archer_19():
    a = aurora_bg()
    const_bow(a, [(2, 9), (4, 12), (8, 13), (12, 12), (14, 9)], (8, 11))
    for y in range(4, 11, 2): a.set(8, y, '#ffffff')
    arx(a, 'u', 8, 2, 1, GOLD_ALL, GOLDP)
    for (x, y) in [(4, 4), (12, 5)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
# 4) 1번 그대로 + 뒤로 쏟아지는 작은 별똥별들
def awk_archer_20():
    a = aurora_bg()
    for (hx, hy, L) in [(9, 5, 4), (12, 11, 3), (14, 4, 2)]: meteor_streak(a, hx, hy, L, ('#ffffff', '#e0fff0', '#9ad8c8', '#4a6a8a'))
    const_bow(a, [(6, 2), (3, 4), (2, 8), (3, 12), (6, 14)], (5, 8))
    for i in range(0, 5, 2): a.set(7 + i, 8, '#ffffff')
    arx(a, 'r', 15, 8, 1, GOLD_ALL, GOLDP)
    return a, 0
ICONS = {f'awk_archer_{k}': (f'유성우 {k - 16}', 'dmg', globals()[f'awk_archer_{k}']) for k in range(17, 21)}
