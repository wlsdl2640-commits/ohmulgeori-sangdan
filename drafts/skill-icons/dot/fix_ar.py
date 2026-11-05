"""화살 3판에 맞춰 화살 스킬 자리 다시 잡기 (사용자: "화살 스킬 말고는 모두 확정, 화살을 더 얇고 가늘게, 깃은 더 길게").
화살이 가늘어지고 깃이 길어져서 길이·자리가 바뀐 것만 여기서 다시 놓는다. 나머지 화살 스킬은 원래 파일 그대로 새 화살로 그려진다."""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar, arrow, arrow_s, recol, AP, GOLD_ALL, GOLDP
from c_archer import BOW
from c_g2 import BOAR2
from c_g5 import MARK
import fix_d
def A(theme, **k): return bg(Art(), theme, **k)
def aimed():
    a = A('green', cx=11, cy=6, r=12)
    sp(a, (grid(target(11.0, 6.0, 5.0)), TGT))
    ar(a, 'ur', 11, 6, 1)
    for (x0, y0, x1, y1) in [(15, 2, 15, 1), (15, 8, 15, 8), (10, 0, 10, 0), (5, 3, 4, 2)]: line(a, x0, y0, x1, y1, '#ffffff')
    return a, 0
def double():
    a = A('teal', rays=10, rot=0.4, k=0.3)
    speed(a, [(0, 13, 2, 11), (1, 16, 3, 14), (5, 18, 7, 16)], '#c8fff0')
    ar(a, 'ur', 9, 2, 1); ar(a, 'ur', 14, 7, 1)
    return a, 0
def piercing():
    a = A('amber', cx=12, cy=10, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for cx_ in (5.5, 9.5):
        for y in range(4, 16):
            for x in range(16):
                d = ((x + 0.5 - cx_) / 1.2) ** 2 + ((y + 0.5 - 9.5) / 4.6) ** 2
                if 0.5 <= d <= 1.0: a.set(x, y, '#ffffff' if x + 0.5 < cx_ else '#ffc860')
    ar(a, 'r', 15, 9, 4)
    return a, 0
def tripleshot():
    a = A('green', cx=4, cy=10, r=14, rays=9, rot=0.1, k=0.3)
    for (tx, y, L) in [(13, 5, 4), (15, 10, 4), (13, 15, 4)]:
        line(a, tx - 13, y, tx - 12, y, '#d8ffd8')
        ar(a, 'r', tx, y, L, small=True)
    return a, 0
def stormarrows():
    a = A('wind', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for i in range(110):
        t = i / 109; ang = t * 9.0 + 1.0; r = 6.6 - t * 5.0
        x, y = 7.5 + math.cos(ang) * r, 10.0 + math.sin(ang) * r * 1.0
        for (dx, dy) in ((0, 0), (0, 1)): a.set(int(x) + dx, int(y) + dy, '#ffffff' if t < 0.5 else '#a8f0c0')
    ar(a, 'r', 13, 4, 2, small=True); ar(a, 'l', 2, 15, 2, small=True)
    return a, 0
def el_arrow():
    a = A('ice', cx=11, cy=5)
    cm = arrow('ur', 12, 4, 2)
    cm = recol(cm, {'w': 'w', 'm': 'a', 'M': 'A', 't': 'c', 'T': 'C', 'r': 'a', 'R': 'A', 'f': 'w'})
    for (x, y, c) in [(13, 3, 'a'), (12, 2, 'a'), (13, 2, 'w')]: cm[(x, y)] = c
    sp(a, grid(cm), {'a': ('#a8ecff', 12), 'A': ('#3a8ad0', 12), 'c': ('#d8f8ff', 12), 'C': ('#7ac0e8', 12), 'w': ('#ffffff', 1)})
    for (x, y) in [(8, 3), (15, 8), (5, 9), (10, 12)]: plus(a, x, y, '#ffffff', '#9ae4ff')
    return a, 0
def flasharrow():
    a = A('holy', cx=10, cy=6, rays=12, k=0.3)
    ar(a, 'ur', 10, 6, 1)
    burst(a, 11, 5)
    for (x, y) in [(15, 2), (14, 9), (7, 1)]: plus(a, x, y)
    return a, 0
def beastshot():
    a = A('green', cx=11, cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BOAR2, 4, 5)
    for (tx, y) in [(7, 7), (6, 13)]:
        ar(a, 'r', tx, y, 0, small=True)
    return a, 0
def arrowstorm():
    a = A('storm', cy=4)
    sp(a, grid(cloud([(3, 2.2, 2.6), (7.5, 1.4, 3.0), (12, 2.4, 2.6)], 'f', 'F')), {'f': ('#4a5a6e', 11), 'F': ('#2a3442', 11)})
    paint_cm(a, bolt([(9, 4), (8, 6), (10, 7)], w=0), {'w': '#fff060'})
    for (x, y) in [(13, 9), (4, 6), (12, 15)]:
        for k in range(3): a.set(x + k, y - k, mix('#ffffff', '#4a9cb4', k / 3))
    for (tx, ty) in [(1, 12), (6, 16)]:
        ar(a, 'dl', tx, ty, 1)
    return a, 0
def piercearrow():
    a = A('steelb', cx=9, cy=9)
    cm = {}
    for y in range(4, 16):
        for x in range(7, 11): cm[(x, y)] = 'm' if x < 9 else 'M'
    for p_ in [(7, 5), (10, 5), (7, 14), (10, 14)]: cm[p_] = 'w'
    sp(a, grid(cm))
    for (x, y) in [(8, 8), (9, 8), (8, 10), (9, 10), (7, 7), (10, 11), (7, 11), (10, 7)]: a.set(x, y, '#2a2a34')
    ar(a, 'r', 15, 9, 4)
    for (x, y) in [(6, 6), (11, 12), (6, 12), (11, 6)]: a.set(x, y, '#ffffff')
    return a, 0
def huntmark():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, MARK, 7, 2, {'r': ('#ff4a3a', 13), 'R': ('#a01a1a', 13)})
    ar(a, 'ur', 10, 5, 1)
    return a, 0
def volley():
    a = A('sky', cx=4, cy=15, r=15, rays=10, rot=0.2, k=0.25)
    ar(a, 'u', 4, 3, 3, small=True)
    ar(a, 'ur', 13, 5, 3, small=True)
    ar(a, 'r', 15, 14, 3, small=True)
    for (x, y) in [(9, 2), (15, 9)]: plus(a, x, y, '#ffffff', '#c8e8ff')
    return a, 0
def summit():
    a = A('sky', cy=3, r=15)
    for y in range(20):
        for x in range(16):
            u = abs(x + 0.5 - 7.5)
            if y >= 7 + u * 1.25: a.set(x, y, '#f4f8ff' if y < 9 + u * 1.25 and y < 11 else '#6a7a8a' if x < 8 else '#4a5a6a')
    sp(a, ['.rrr', '.rr.', '.r..', 't...', 't...'], 7, 2, {'r': ('#e83a3a', 13), 't': ('#7a4c22', 3)})
    ar(a, 'dl', 1, 16, 2, small=True); ar(a, 'dr', 14, 16, 2, small=True)
    return a, 0
def volleytrap():
    a = A('green', cy=4, r=16)
    sp(a, BEARTRAP, 2, 12)
    for (x, ty) in [(3, 10), (8, 8), (13, 10)]: ar(a, 'd', x, ty, 2, small=True)
    return a, 0
def dragonpierce():
    a = A('fire', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    cm = {}
    for y in range(3, 17):
        for x in range(5, 12):
            lx = (x + (2 if ((y - 3) // 3) % 2 else 0)) % 4; ly = (y - 3) % 3
            cm[(x, y)] = 'G' if ly == 2 else ('h' if ly == 0 and lx == 1 else 'g')
    sp(a, grid(cm), {'g': ('#c04a2a', 8), 'G': ('#6a1a0a', 8), 'h': ('#ff9a6a', 8)})
    ar(a, 'r', 15, 10, 4)
    burst(a, 9, 10, big=False)
    return a, 0
def slayrain():
    a = A('dawn', cy=17, r=16)
    import spr as S
    sp(a, S.WYVERN, 0, 8)
    for (x, ty) in [(4, 9), (8, 8), (12, 9)]: ar(a, 'd', x, ty, 1, small=True)
    return a, 0
def dragonheart():
    a = A('evil', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    big = (['.111..111.', '1w11111112', '1111111122', '1111111122', '.11111122.', '..111122..', '...1122...', '....22....'], HEART[1])
    cm = arrow('ur', 14, 2, 5)
    sp(a, grid(cm), AP)
    sp(a, big, 3, 6)
    sp(a, grid({k: v for k, v in cm.items() if (k[1] - k[0]) / 2 + 6 <= 3.5}), AP)
    return a, 0
def driveshot():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for k, (r, c) in enumerate([(6.4, '#ffffff'), (4.4, '#c8ffc0')]):
        for i in range(16):
            t = i / 15; ang = math.radians(190 + t * 110); a.set(int(8 + math.cos(ang) * r), int(14 + math.sin(ang) * r), c)
    ar(a, 'r', 14, 7, 2, small=True); ar(a, 'r', 12, 12, 2, small=True)
    return a, 0
# ── 거신 낙하: 굵던 금 화살도 가늘게, 깃은 길게 ──
GP2 = {'w': ('#ffffff', 6), 'm': ('#ffe890', 6), 'M': ('#c08a1c', 6), 't': ('#ffd84a', 6), 'T': ('#c08a1c', 6), 'r': ('#ff5a3a', 13), 'R': ('#a82a22', 13), 'f': ('#fff4ec', 7)}
def titanfall():
    a = A('evil', cx=8, cy=6, r=13, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    tail(a, 8.0, 0.0, 8.0, 10.0, 1.6, 0.8, ['#fff0a0', '#ffc040', '#e07a20'])
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#2a0a10')
    sp(a, fix_d.FALLEN, 0, 11)
    burst(a, 8, 12, big=True)
    cm = {}
    HEAD = ['..w..', '.wmM.', '.wmM.', 'wwmMM', '.wmM.', '..m..']
    for j, r in enumerate(reversed(HEAD)):
        for i, c in enumerate(r):
            if c != '.': cm[(6 + i, 8 + j)] = c
    for y in range(1, 8): cm[(8, y)] = 't'
    for y in range(1, 7):
        cm[(7, y)] = 'f' if y == 3 else 'r'; cm[(9, y)] = 'f' if y == 3 else 'R'
    cm[(6, 1)] = 'r'; cm[(10, 1)] = 'R'; cm[(8, 0)] = 'T'
    sp(a, grid(cm), GP2)
    paint_cm(a, cloud([(1.5, 17.6, 1.6), (14.0, 17.4, 1.8)]), {'1': '#c88a6a', '2': '#8a5a4a'})
    return a, 0
NAMES = dict(aimed='조준 사격', double='연사', piercing='관통 사격', tripleshot='삼연사', stormarrows='폭풍 화살', el_arrow='정령의 화살', flasharrow='섬광 화살', beastshot='짐승 사냥',
             arrowstorm='화살 폭우', piercearrow='철갑 화살', huntmark='사냥꾼의 표식', volley='연속 사격', summit='정상 등반', volleytrap='덫 사격', dragonpierce='용 관통',
             slayrain='용살의 비', dragonheart='용의 심장 꿰기', driveshot='몰이 사격', titanfall='거신 낙하')
ICONS = {k: (v, 'dmg', globals()[k]) for k, v in NAMES.items()}
