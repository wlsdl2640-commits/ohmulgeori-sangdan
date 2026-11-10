import math, nec2
from nec2 import *
def moon(s, cx=10.5, cy=7.0, r=3.4):
    for y in range(Y0 + 1, Y1):
        for x in range(X0 + 1, X1):
            dx, dy = x + .5 - cx, y + .5 - cy
            if math.hypot(dx, dy) <= r:
                k = (dx + dy) / r
                s.put(x, y, 'm' if k < -0.75 else ('n' if k < 0.55 else 'o'))
    for q in ((9, 5), (12, 6), (10, 8), (11, 8)): s.put(*q, 'o')                      # 달 구멍
def v1():
    s = Sh(); book(s, 'a'); corners(s); moon(s)
    drip(s, [(9, 10, 5), (12, 10, 6)])
    for q in ((7, 3), (14, 3), (7, 12)): s.put(*q, 'w')
    s.fx.update({(9, 19): 'r'})
    return s
def v2():
    s = v1()
    for k in range(6):
        a = math.radians(-90 + 60 * k)
        s.put(int(math.floor(10.5 + 5.0 * math.cos(a))), int(math.floor(7.0 + 5.0 * math.sin(a))), 'r')
    return s
PAL = M(PAGE, LEATH, BLOOD, a='#1c1426', b='#140e1c', e='#3e2e50', E='#0c0812', S='#140e1c', s='#0c0812', k='#3e2e50', B='#140e1c',
        m='#ff7a6a', n='#d8202e', o='#7a0a18', w='#e8dcc8')
if __name__ == '__main__':
    from zoomv import zoomsheet
    base = [d for d in nec2.G if d['lv'] == 30][0]
    out = [(nec2.icon(base).render(), '30'), (v1().icon(PAL).render(), 'v1'), (v2().icon(PAL).render(), 'v2')]
    zoomsheet(out, 'moon_try.png', z=12)
def crescent(s, cx=10.0, cy=7.0, r=3.7, ox=11.9, oy=5.6, r2=3.1):
    for y in range(Y0 + 1, Y1):
        for x in range(X0 + 1, X1):
            px, py = x + .5, y + .5
            if math.hypot(px - cx, py - cy) <= r and math.hypot(px - ox, py - oy) > r2:
                k = ((px - cx) + (py - cy)) / r
                s.put(x, y, 'm' if k < -0.5 else ('n' if k < 0.6 else 'o'))
def v3():
    s = Sh(); book(s, 'a'); corners(s); crescent(s)
    drip(s, [(8, 11, 3), (10, 11, 5), (12, 11, 2)])
    for q in ((13, 3), (7, 3), (14, 9)): s.put(*q, 'w')
    return s
def v4():
    s = Sh(); book(s, 'a'); corners(s); moon(s)
    for (x, y) in ((6, 6), (7, 6), (8, 6), (7, 7), (13, 7), (14, 7), (12, 8), (13, 8), (14, 8), (15, 7)): s.put(x, y, 'c')     # 먹구름 띠
    drip(s, [(8, 10, 2), (10, 10, 5), (12, 10, 3)])
    for q in ((7, 3), (14, 3), (7, 12)): s.put(*q, 'w')
    return s
if __name__ == '__main__':
    PAL2 = dict(PAL, c='#3a2c4a')
    out = [(v3().icon(PAL2).render(), 'v3'), (v4().icon(PAL2).render(), 'v4')]
    zoomsheet(out, 'moon_try2.png', z=12)
def halo(s, cx=10.5, cy=7.0, r0=3.4, r1=4.4):
    for y in range(Y0 + 1, Y1):
        for x in range(X0 + 1, X1):
            d = math.hypot(x + .5 - cx, y + .5 - cy)
            if r0 < d <= r1 and (x, y) not in s.body or (r0 < d <= r1 and s.body.get((x, y)) in ('a', 'b')): s.put(x, y, 'q')
def v5(h=False):
    s = Sh(); book(s, 'a'); corners(s)
    if h: halo(s)
    moon(s)
    drip(s, [(8, 10, 1), (9, 10, 3), (11, 10, 2), (12, 10, 4)])
    for x in (9, 12): s.put(x, 15, 'r')
    for q in ((7, 3), (14, 2), (14, 12)): s.put(*q, 'w')
    return s
if __name__ == '__main__':
    PAL3 = dict(PAL, q='#4a1424')
    out = [(v5().icon(PAL3).render(), 'v5'), (v5(True).icon(PAL3).render(), 'v6')]
    zoomsheet(out, 'moon_try3.png', z=12)
