"""45° 눕힌 무늬 — 모양 함수(카드 좌표: X 오른쪽, Y 위)를 칸에 찍고, 위·왼쪽 끝은 빛 3 · 아래·오른쪽 끝은 그늘 2.
알아보기 쉽게 볼을 작게 · 오목한 데를 깊게 · 끝을 길게 과장한다."""
import math
R2 = math.sqrt(2)
def heart(X, Y):
    for cx in (-0.56, 0.56):
        if (X - cx) ** 2 + (Y - 0.42) ** 2 <= 0.5 ** 2: return True
    return -1.15 <= Y <= 0.45 and abs(X) <= 1.06 * (Y + 1.15) / 1.6
def spade(X, Y):
    for cx in (-0.56, 0.56):
        if (X - cx) ** 2 + (Y + 0.25) ** 2 <= 0.47 ** 2: return True
    if -0.35 <= Y <= 1.25 and abs(X) <= 1.02 * (1.25 - Y) / 1.6: return True
    return -1.35 <= Y <= -0.3 and abs(X) <= 0.12 + 0.75 * max(0.0, -1.0 - Y)
def club(X, Y):
    for cx, cy in ((0, 0.62), (-0.62, -0.12), (0.62, -0.12)):
        if (X - cx) ** 2 + (Y - cy) ** 2 <= 0.42 ** 2: return True
    if abs(X) <= 0.26 and -0.3 <= Y <= 0.5: return True
    return -1.35 <= Y <= -0.2 and abs(X) <= 0.12 + 0.75 * max(0.0, -0.95 - Y)
def diamond(X, Y): return abs(X) / 0.62 + abs(Y) / 1.25 <= 1
def star5(X, Y):
    """끝 하나가 카드 위쪽"""
    a = math.atan2(X, Y); r = math.hypot(X, Y)
    k = (a % (2 * math.pi / 5)) / (2 * math.pi / 5)
    edge = 0.42 + (1.0 - 0.42) * abs(1 - 2 * k) ** 1.0
    return r <= edge * 1.15
def raster(fn, k, cx=10.0, cy=9.0, th=0.5, keep=None):
    out = set()
    for y in range(20):
        for x in range(20):
            n = 0
            for sy in range(4):
                for sx in range(4):
                    dx = x + (sx + .5) / 4 - cx; dy = y + (sy + .5) / 4 - cy
                    X = (dx + dy) / (R2 * k); Y = (dx - dy) / (R2 * k)
                    if fn(X, Y): n += 1
            if n / 16 > th and (keep is None or (x, y) in keep): out.add((x, y))
    return out
def shaded(px):
    d = {}
    for (x, y) in px:
        up = (x, y - 1) not in px or (x - 1, y) not in px
        dn = (x, y + 1) not in px or (x + 1, y) not in px
        d[(x, y)] = '3' if (up and not dn) else ('2' if (dn and not up) else '1')
    return d
def mirror_fix(px):
    """카드 축 (x + y = 18) 거울: 한쪽에만 있는 칸은 짝을 채운다"""
    s = set(px)
    for (x, y) in list(s): s.add((18 - y, 18 - x))
    return s
SUITS = {'heart': (heart, 3.5), 'spade': (spade, 3.45), 'club': (club, 3.35), 'diamond': (diamond, 3.9), 'star': (star5, 3.6)}
def suit(name, keep=None, cx=10.0, cy=9.0):
    fn, k = SUITS[name]
    return shaded(mirror_fix(raster(fn, k, cx, cy, keep=keep)))
