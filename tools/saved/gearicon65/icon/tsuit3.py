"""45° 눕힌 카드 무늬 (확정 후보): 카드 가운데 (10.0, 9.0) · 카드 위쪽 û = (1, −1)/√2 · 오른쪽 r̂ = (1, 1)/√2. 축 거울 (x, y) ↔ (18 − y, 18 − x)."""
import math
from tilt import tilt
R2 = math.sqrt(2)
U = (1 / R2, -1 / R2); RR = (1 / R2, 1 / R2)
C = (10.0, 9.0)
def at(t, w): return C[0] + t * U[0] + w * RR[0], C[1] + t * U[1] + w * RR[1]
def disc(cx, cy, r):
    out = set()
    for y in range(20):
        for x in range(20):
            n = sum(1 for j in range(4) for i in range(4) if math.hypot(x + (i + .5) / 4 - cx, y + (j + .5) / 4 - cy) <= r)
            if n >= 8: out.add((x, y))
    return out
def axis_px(t0, t1):
    """카드 축 위 칸 (x + y = 18), 축 좌표 t0 → t1"""
    out = set()
    for x in range(20):
        y = 18 - x
        t = ((x + .5 - C[0]) * U[0] + (y + .5 - C[1]) * U[1])
        if min(t0, t1) <= t <= max(t0, t1): out.add((x, y))
    return out
def mirror(px): return set(px) | {(18 - y, 18 - x) for (x, y) in px}
def shade(px, hi='3', mid='1', lo='2'):
    d = {}
    for (x, y) in px:
        up = (x, y - 1) not in px or (x - 1, y) not in px
        dn = (x, y + 1) not in px or (x + 1, y) not in px
        d[(x, y)] = hi if (up and not dn) else (lo if (dn and not up) else mid)
    return d
HEART_G = ["11.11", "13111", "11111", ".111.", "..1.."]
def heart():
    px = set(tilt(HEART_G, cu=0).keys())
    return shade(mirror(px))
def spade():
    h = set(tilt(HEART_G, cu=0).keys())
    body = {(19 - x, 17 - y) for (x, y) in h}                         # 하트를 뒤집어 (끝이 위로)
    body = {(x + 1, y - 1) for (x, y) in body}                         # 위쪽으로 한 걸음
    stem = axis_px(-1.0, -4.4)
    base = {(x, y) for (x, y) in axis_px(-4.4, -4.4 - 1.5)}
    end = min(stem, key=lambda p: p[0])
    flare = {(end[0] - 1, end[1]), (end[0], end[1] + 1)}
    return shade(mirror(body | stem | flare))
def club():
    px = set()
    for (t, w) in ((2.25, 0.0), (-0.15, -2.1), (-0.15, 2.1)): px |= disc(*at(t, w), 1.45)
    px |= disc(*at(0.3, 0.0), 1.0)
    stem = axis_px(-0.8, -4.3)
    end = min(stem, key=lambda p: p[0])
    flare = {(end[0] - 1, end[1]), (end[0], end[1] + 1)}
    return shade(mirror(px | stem | flare))
def diamond():
    px = set()
    for y in range(20):
        for x in range(20):
            n = 0
            for j in range(4):
                for i in range(4):
                    dx = x + (i + .5) / 4 - C[0]; dy = y + (j + .5) / 4 - C[1]
                    t = dx * U[0] + dy * U[1]; w = dx * RR[0] + dy * RR[1]
                    if abs(w) / 2.55 + abs(t) / 4.6 <= 1: n += 1
            if n >= 8: px.add((x, y))
    return shade(mirror(px))
def star4():
    """반짝 별 (끝 넷: 카드 위 · 아래 · 왼쪽 · 오른쪽 = 화면 대각선) — 가운데 마름모 + 가는 끝"""
    px = set()
    for y in range(20):
        for x in range(20):
            n = 0
            for j in range(4):
                for i in range(4):
                    dx = x + (i + .5) / 4 - C[0]; dy = y + (j + .5) / 4 - C[1]
                    t = dx * U[0] + dy * U[1]; w = dx * RR[0] + dy * RR[1]
                    a, b = abs(t), abs(w)
                    if (a + b <= 1.8) or (b <= 0.45 and a <= 4.6) or (a <= 0.45 and b <= 3.4): n += 1
            if n >= 7: px.add((x, y))
    return shade(mirror(px))
SUIT = {'heart': heart, 'spade': spade, 'club': club, 'diamond': diamond, 'star': star4}
