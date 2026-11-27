"""빌드 78 주문서 그림 시안 (11-27 대표님 — 양피지 두루마리 · 성공 확률마다 색). 20×20 도트, 게임에는 아직 안 넣음.
꼴 다섯(A 말린 두루마리 + 밀랍 봉인 · B 위아래 축 걸개 · C 끈으로 묶고 꼬리표 · D 양 끝 나무 손잡이 · E 양쪽이 말린 펼친 양피지)
× 색 매김 둘(가: 끈 · 봉인 · 축만 확률 색 / 나: 양피지 자체를 물들임) × 확률 다섯 × 갈래 다섯(주무기 · 부장비 · 방어구 · 장신구 · 가방)."""
import math, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'bookart63'))
from books import Cv, mix, lt, dk, K, W, H

PARCH = (228, 208, 160)
RATES = [100, 80, 60, 30, 10]
# 확률 색 — 1안: 레어도와 같은 결(낮을수록 귀함), 2안: 우리만의 색(황갈 · 청록 · 호박 · 진홍 · 흑금)
RC1 = {100: (156, 146, 132), 80: (82, 168, 76), 60: (66, 128, 214), 30: (156, 88, 214), 10: (240, 172, 48)}
RC2 = {100: (196, 156, 96), 80: (58, 156, 146), 60: (226, 128, 44), 30: (196, 50, 66), 10: (54, 46, 70)}
GOLD = (246, 200, 80)
INK = (92, 60, 34)

E7 = {
    'weapon': ["......b", ".....ba", "....ba.", "a..ba..", ".aba...", ".aa....", "a.a...."],
    'off':    ["aaaaaaa", "abbbbba", "abbbbba", "abbbbba", ".abbba.", "..aba..", "...a..."],
    'armor':  ["aa...aa", "abaaaba", "abbbbba", ".abbba.", ".abbba.", ".abbba.", ".aaaaa."],
    'acc':    ["...b...", "..aba..", ".a...a.", "a.....a", "a.....a", ".a...a.", "..aaa.."],
    'bag':    ["..a.a..", "...a...", ".aaaaa.", "abbbbba", "abbbbba", "abbbbba", ".aaaaa."],
}
E5 = {
    'weapon': ["....b", "...b.", "a.b..", ".a...", "a.a.."],
    'off':    ["aaaaa", "abbba", "abbba", ".aba.", "..a.."],
    'armor':  ["a...a", "aaaaa", ".aba.", ".aba.", ".aaa."],
    'acc':    ["..b..", ".a.a.", "a...a", "a...a", ".aaa."],
    'bag':    [".a.a.", "aaaaa", "abbba", "abbba", ".aaa."],
}
CATS = [('weapon', '주무기'), ('off', '부장비'), ('armor', '방어구'), ('acc', '장신구'), ('bag', '가방')]


def paper(rate, tint, rc):
    if not tint or rate == 100: return PARCH
    if rc is RC2 and rate == 10: return (70, 62, 86)
    return mix(PARCH, rc[rate], .42)


def ink(rate, tint, col, P):
    if not tint or rate in (100, 80): return INK
    return lt(P, .75) if sum(P) < 300 else dk(col, .6)


def roll_diag(cv, P, x0, y0, x1, y1, r=2.6, cap=True):
    """대각선으로 말린 원통(양피지). 끝면은 말린 결."""
    ax, ay = x1 - x0, y1 - y0; L = math.hypot(ax, ay); ux, uy = ax / L, ay / L; nx, ny = -uy, ux
    for y in range(H):
        for x in range(W):
            px, py = x + .5 - x0, y + .5 - y0
            u = px * ux + py * uy; v = px * nx + py * ny
            if -0.3 <= u <= L + .3 and abs(v) <= r:
                t = (v + r) / (2 * r)
                c = lt(P, .32) if t < .25 else (P if t < .6 else (dk(P, .16) if t < .85 else dk(P, .3)))
                if cap and u > L - 1.3: c = dk(P, .08) if abs(v) > 1 else dk(P, .38)
                cv.set(x, y, c)


def seal(cv, cx, cy, col, cat, rad=3.6):
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + .5 - cx, y + .5 - cy)
            if d <= rad:
                cv.set(x, y, K if d > rad - 1 else (lt(col, .25) if (x + .5 - cx) + (y + .5 - cy) < -1.5 else col))
    cv.pat(round(cx - 2.5), round(cy - 2.5), E5[cat], {'a': dk(col, .55), 'b': lt(col, .6)})


def sparkle(cv, x, y, c):
    cv.set(x, y, c)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        if (x + dx, y + dy) not in cv.px: cv.set(x + dx, y + dy, mix(c, (255, 200, 90), .4))


def low_glint(cv, rate, col):
    """30 · 10%: 반짝이 칸(흐린 빛 없음)"""
    if rate == 30: sparkle(cv, 17, 2, lt(col, .6))
    if rate == 10:
        sparkle(cv, 17, 2, GOLD); sparkle(cv, 2, 2, lt(GOLD, .3)); cv.set(18, 16, GOLD)


def band_across(cv, cx, cy, col, dx=.7071, dy=.7071):
    for t in range(-4, 5):
        x, y = int(cx + t * dx + .5), int(cy + t * dy + .5)
        if (x, y) in cv.px and cv.px[(x, y)] != K: cv.set(x, y, col if t % 2 else lt(col, .2))


# ── A 말린 두루마리 + 밀랍 봉인(봉인 문양 = 갈래)
def shape_a(cat, rate, tint, rc=RC1):
    cv = Cv(); col = rc[rate]; P = paper(rate, tint, rc)
    roll_diag(cv, P, 2.6, 17.2, 17.2, 2.7, 3.5)
    cv.outline()
    rib = col if not tint else dk(col, .3)
    band_across(cv, 6.0, 13.3, rib); band_across(cv, 13.6, 5.9, rib)
    seal(cv, 9.9, 9.9, (176, 44, 40) if not tint else dk(col, .05), cat, 4.4)
    low_glint(cv, rate, col)
    return cv


# ── B 위아래 나무 축 걸개(펼친 종이에 갈래 문양)
def shape_b(cat, rate, tint, rc=RC1):
    cv = Cv(); col = rc[rate]; P = paper(rate, tint, rc)
    cv.rect(4, 4, 15, 16, P)
    for y in range(4, 17): cv.set(15, y, dk(P, .12)); cv.set(4, y, lt(P, .2))
    for x in range(5, 15, 3): cv.set(x, 17, dk(P, .12))
    for x in range(5, 15): cv.set(x, 5, col); cv.set(x, 15, col)
    cv.pat(6, 7, E7[cat], {'a': ink(rate, tint, col, P), 'b': lt(col, .35)})
    cv.outline()
    for yy, top in ((2, True), (17, False)):
        for x in range(2, 18):
            cv.set(x, yy, (130, 86, 46)); cv.set(x, yy - 1 if top else yy + 1, K)
        for x in (1, 18): cv.set(x, yy, col); cv.set(x, yy - 1, K); cv.set(x, yy + 1, K)
        cv.set(0, yy, K); cv.set(19, yy, K)
        if top:
            for x in range(2, 18): cv.set(x, 3, (88, 56, 30))
    for x in (8, 9, 10, 11): cv.set(x, 0, K)
    cv.set(7, 0, None); cv.set(8, 0, K)
    low_glint(cv, rate, col)
    return cv


# ── C 끈으로 묶은 두루마리 + 꼬리표(꼬리표 색 = 확률, 꼬리표 안 문양)
def shape_c(cat, rate, tint, rc=RC1):
    cv = Cv(); col = rc[rate]; P = paper(rate, tint, rc)
    roll_diag(cv, P, 2.4, 13.6, 16.2, 2.4, 3.3)
    cv.outline()
    twine = (154, 112, 66)
    band_across(cv, 6.0, 10.4, twine, .64, .77); band_across(cv, 11.8, 5.8, twine, .64, .77)
    for (x, y) in ((9, 9), (9, 10), (10, 11), (10, 12)): cv.set(x, y, twine)
    tx, ty = 10, 12
    cv.rect(tx, ty, tx + 8, ty + 7, K); cv.rect(tx + 1, ty + 1, tx + 7, ty + 6, col)
    cv.rect(tx + 1, ty + 1, tx + 7, ty + 1, lt(col, .3))
    cv.set(tx, ty, None); cv.set(tx + 8, ty, None)
    cv.pat(tx + 2, ty + 2, E5[cat][:4] + [E5[cat][4]][:0], {'a': dk(col, .6), 'b': lt(col, .65)})
    cv.set(tx + 4, ty + 1, twine)
    low_glint(cv, rate, col)
    return cv


# ── D 양 끝 나무 손잡이(손잡이 끝 보석 = 확률 색, 가운데 찍힌 문양)
def shape_d(cat, rate, tint, rc=RC1):
    cv = Cv(); col = rc[rate]; P = paper(rate, tint, rc)
    roll_diag(cv, P, 4.2, 15.6, 15.6, 4.2, 3.7, cap=False)
    cv.outline()
    wood, wd = (146, 96, 52), (92, 58, 30)
    for (x, y) in ((3, 16), (16, 3)): cv.set(x, y, wood)
    for (x, y) in ((2, 16), (3, 17), (16, 2), (17, 3)): cv.set(x, y, wd)
    for (x, y) in ((2, 17), (17, 2)):
        cv.set(x, y, col)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            if (x + dx, y + dy) not in cv.px: cv.set(x + dx, y + dy, K)
    cv.set(17, 2, lt(col, .35))
    cv.pat(7, 7, E7[cat], {'a': (150, 40, 34) if not tint else ink(rate, tint, col, P), 'b': (214, 90, 70) if not tint else lt(col, .45)})
    low_glint(cv, rate, col)
    return cv


# ── E 양쪽이 말린 펼친 양피지(가로)
def shape_e(cat, rate, tint, rc=RC1):
    cv = Cv(); col = rc[rate]; P = paper(rate, tint, rc)
    cv.rect(5, 4, 14, 15, P)
    for y in range(4, 16): cv.set(14, y, dk(P, .1))
    cv.pat(6, 5, E7[cat], {'a': ink(rate, tint, col, P), 'b': lt(col, .35)})
    for x in range(6, 14): cv.set(x, 13, col if x % 2 else dk(col, .2))
    for x0 in (2, 15):
        for y in range(3, 17):
            cv.set(x0, y, lt(P, .3)); cv.set(x0 + 1, y, P); cv.set(x0 + 2, y, dk(P, .25))
        for x in range(x0, x0 + 3): cv.set(x, 2, dk(P, .35)); cv.set(x, 17, dk(P, .35))
    cv.outline()
    for x0 in (2, 15): cv.set(x0 + 1, 2, col); cv.set(x0 + 1, 17, col)
    low_glint(cv, rate, col)
    return cv


SHAPES = [('A', '말린 두루마리 + 밀랍 봉인', shape_a), ('B', '위아래 나무 축 걸개', shape_b), ('C', '끈으로 묶고 꼬리표', shape_c),
          ('D', '양 끝 나무 손잡이 + 보석', shape_d), ('E', '양쪽이 말린 펼친 양피지', shape_e)]
