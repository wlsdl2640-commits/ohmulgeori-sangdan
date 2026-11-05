"""유성우 시안 셋째 판 (앞 8개 모두 X). 사용자가 고른 것들(별자리 활 · 지평선 거인 그림자 · 붉은 달 앞 용 그림자)처럼
또렷한 그림자 하나 + 밝은 빛줄기로 깔끔하게. 이름: awk_archer_9 … _12 (시트에는 1~4)"""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar, arx, arrow_xs, recol, AP, GOLD_ALL, GOLDP
from var_ar import A, GOLD, FIRE, FIREP, streak
def meteor_streak(a, hx, hy, L, cols=('#ffffff', '#fff4c0', '#ffc860', '#a8784a')):
    """머리(hx,hy)가 왼쪽 아래, 꼬리가 오른쪽 위로 가는 별똥별 줄 (테두리 없음)"""
    for i in range(L):
        t = i / max(L - 1, 1); a.set(hx + i, hy - i, cols[min(len(cols) - 1, int(t * len(cols)))])
    a.set(hx, hy + 1, cols[1]); a.set(hx - 1, hy, cols[1])
# 1) 언덕 위 궁수 그림자가 하늘로 쏜 화살 → 반대편에 쏟아지는 별똥별
ARCHER = ['...hh...', '...hh..b', '..kkk.b.', '.kkkkkb.', 'kk.kkbk.', '...kk.b.', '...kk..b', '..k..k..', '..k..k..']
def awk_archer_9():
    a = A('dawn', cx=4, cy=19, r=17, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    dot(a, [(5, 2), (9, 1), (3, 5), (12, 9)], '#ffffff')
    for (hx, hy, L) in [(8, 8, 6), (11, 10, 5), (13, 13, 3), (10, 5, 4), (14, 6, 2)]:
        meteor_streak(a, hx, hy, L)
    for y in range(20):
        for x in range(16):
            if y >= 16 - max(0, 4 - abs(x - 3) * 0.8): a.set(x, y, '#1a1024')
    a.paint(ARCHER, {'h': '#1a1024', 'k': '#1a1024', 'b': '#1a1024'}, ox=0, oy=6)
    for i in range(4): a.set(7 + i, 6 - i, mix('#ffffff', '#ffc860', i / 4))
    return a, 0
# 2) 하늘을 가로지르는 큰 금빛 별똥별 화살 하나 + 산 그림자
def awk_archer_10():
    a = A('dawn', cx=8, cy=19, r=17, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    dot(a, [(3, 3), (8, 2), (2, 9), (6, 6)], '#ffffff')
    tail(a, 5.0, 12.0, 17.0, 0.0, 2.4, 0.4, ['#ffffff', '#fff4c0', '#ffc860', '#e07a2a'])
    for (x, y) in [(10, 5), (13, 4), (8, 9)]: plus(a, x, y, '#ffffff', '#fff0a0')
    for y in range(13, 20):
        for x in range(16):
            if y >= 14 + 2.4 * abs(math.sin((x + 2) * 0.5)) - (2 if 5 <= x <= 9 else 0): a.set(x, y, '#1a1024')
    ar(a, 'dl', 4, 13, 0, GOLD_ALL, GOLDP, small=True)
    return a, 0
# 3) 별똥별이 쏟아지는 밤 호수 (물에 비친 빛)
def awk_archer_11():
    a = A('night', cx=8, cy=10, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    sp(a, grid({k: 'm' for k in crescent2((3.5, 3.5), 2.4, (4.6, 2.8), 2.0)}), {'m': ('#fff4c8', 1)})
    for (hx, hy, L) in [(7, 6, 5), (10, 8, 4), (12, 3, 3)]: meteor_streak(a, hx, hy, L)
    for x in range(16): a.set(x, 10, '#141830')
    for y in range(11, 20):
        for x in range(16): a.set(x, y, '#0c1838' if (x + 2 * y) % 5 else '#162a5a')
    for y in range(11, 19):
        if y % 2: a.set(3, y, '#c8c0a0'); a.set(4, y, '#8a8070')
    for (hx, hy, L) in [(7, 6, 5), (10, 8, 4)]:
        for i in range(0, L, 2): a.set(hx + i, 10 + (10 - (hy - i)) // 2 + 1, '#8aa0d0'); a.set(hx + i + 1, 10 + (10 - (hy - i)) // 2 + 1, '#5a70a8')
    arx(a, 'dl', 7, 6, 0, GOLD_ALL, GOLDP)
    return a, 0
# 4) 오로라를 뚫고 떨어지는 별똥별 화살 + 눈 덮인 숲
def awk_archer_12():
    a = A('night', cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for x in range(16):
        top = 2 + 1.6 * math.sin(x * 0.6); bot = 9 + 1.4 * math.sin(x * 0.45 + 1.0)
        for y in range(int(top), int(bot)):
            t = (y - top) / max(bot - top, 1)
            a.set(x, y, mix('#7affb0', '#8a5ae0', t) if (x + y) % 3 else mix('#c8ffe0', '#b08aff', t))
    for (hx, hy, L) in [(3, 13, 6), (12, 12, 4)]: meteor_streak(a, hx, hy, L, ('#ffffff', '#e0fff0', '#9ad8c8', '#4a6a8a'))
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#e8f0ff' if y == 17 else '#c8d4e8')
    TREES = ['..k......k....k.', '.kkk....kkk..kkk', 'kkkkk..kkkkkkkkk']
    a.paint(TREES, {'k': '#0a1420'}, ox=0, oy=14)
    arx(a, 'dl', 8, 14, 1, GOLD_ALL, GOLDP)
    for i in range(5): a.set(9 + i, 13 - i, mix('#fff4c0', '#ffc860', i / 5))
    return a, 0
ICONS = {f'awk_archer_{k}': (f'유성우 {k - 8}', 'dmg', globals()[f'awk_archer_{k}']) for k in range(9, 13)}
