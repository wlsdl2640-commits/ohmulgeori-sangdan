"""깃털 날개 (tools/saved/raid69/thunderbird.py에서 떼어 옴): zig · fpoly · layer · wing_feathers"""
import math
from cv import poly


def zig(a, b, n, amp):
    L = math.hypot(b[0] - a[0], b[1] - a[1]) or 1; nx, ny = -(b[1] - a[1]) / L, (b[0] - a[0]) / L
    pts = [a]
    for k in range(1, n):
        t = k / n; s = amp if k % 2 else -amp
        pts.append((a[0] + (b[0] - a[0]) * t + nx * s, a[1] + (b[1] - a[1]) * t + ny * s))
    return pts + [b]


def fpoly(a, b, tip, w, jag=False):
    """깃 한 장: 밑동 두 점 a · b → 둥근(또는 뾰족한) 끝 tip"""
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2; dx, dy = tip[0] - mx, tip[1] - my; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L; px, py = -uy, ux
    if jag:   # 번개 깃: 옆으로 한 번 꺾인 뾰족 끝
        k = (mx + dx * 0.62 + px * w * 0.9, my + dy * 0.62 + py * w * 0.9)
        return [a, k, tip, (tip[0] - ux * w * 0.9 - px * w * 0.2, tip[1] - uy * w * 0.9 - py * w * 0.2), (mx + dx * 0.5 - px * w * 0.3, my + dy * 0.5 - py * w * 0.3), b]
    return [a, (tip[0] - ux * w * 0.7 + px * w * 0.55, tip[1] - uy * w * 0.7 + py * w * 0.55), tip, (tip[0] - ux * w * 0.7 - px * w * 0.55, tip[1] - uy * w * 0.7 - py * w * 0.55), b]


def layer(c, feathers, base, lite, dark=None, jag=False):
    """깃을 뒤에서 앞으로 겹쳐 칠한다. 깃마다 위(앞) 가장자리 칸은 lite, 아래 가장자리는 dark"""
    for (a, b, tip, w) in feathers:
        cells = poly(fpoly(a, b, tip, w, jag))
        for q in cells: c.set(*q, base)
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2; dx, dy = tip[0] - mx, tip[1] - my; L = math.hypot(dx, dy) or 1
        px, py = dy / L, -dx / L   # 깃 축에서 위쪽(시계 반대) 방향
        for (x, y) in cells:
            up = (int(math.floor(x + 0.5 + px * 1.0)), int(math.floor(y + 0.5 + py * 1.0)))
            dn = (int(math.floor(x + 0.5 - px * 1.0)), int(math.floor(y + 0.5 - py * 1.0)))
            if up not in cells: c.set(x, y, lite)
            elif dark and dn not in cells: c.set(x, y, dark)


def wing_feathers(sh, wr, tips, sec):
    """날개깃(손목 둘레 밑동 → tips) · 둘째날개깃(팔뚝을 따라 → sec)을 뒤(아래) → 앞(위) 순서로"""
    prim = []
    for i, t in enumerate(tips):
        ang = math.atan2(t[1] - wr[1], t[0] - wr[0])
        a = (wr[0] + math.cos(ang + 1.3) * 1.6, wr[1] + math.sin(ang + 1.3) * 1.6)
        b = (wr[0] + math.cos(ang - 1.3) * 1.6, wr[1] + math.sin(ang - 1.3) * 1.6)
        prim.append((a, b, t, 2.4 - 0.15 * i))
    secs = []
    for i, t in enumerate(sec):
        u = (i + 1) / (len(sec) + 1)
        base = (wr[0] + (sh[0] - wr[0]) * u, wr[1] + (sh[1] - wr[1]) * u)
        ang = math.atan2(t[1] - base[1], t[0] - base[0])
        a = (base[0] + math.cos(ang + 1.4) * 1.7, base[1] + math.sin(ang + 1.4) * 1.7)
        b = (base[0] + math.cos(ang - 1.4) * 1.7, base[1] + math.sin(ang - 1.4) * 1.7)
        secs.append((a, b, t, 2.6))
    return list(reversed(prim)), list(reversed(secs))




def fwing(c, root, wrist, tips, sec, base, lite, dark, skip=(), jag=False, short=(), bone=None):
    """깃털 날개 하나: 팔뚝(root → wrist) + 둘째날개깃(sec) + 날개깃(tips). skip = 빠진 깃 번호(바깥 0부터) · short = 짧게 잘린 깃"""
    from cv import path, thin
    prim, secs = wing_feathers(root, wrist, tips, sec)
    n = len(prim)
    keep = []
    for i, (a, b, t, w) in enumerate(prim):
        j = n - 1 - i
        if j in skip: continue
        if j in short: t = (t[0] + (a[0] - t[0]) * 0.35, t[1] + (a[1] - t[1]) * 0.35)
        keep.append((a, b, t, w))
    layer(c, secs, base, lite, dark, jag); layer(c, keep, base, lite, dark, jag)
    c.fill(path([root, wrist], 1.3, 1.0), bone or base); c.only(thin(root, wrist), lite, bone or base)
