"""45° 눕힌 카드 위에 카드 좌표(t = 카드 위쪽, w = 카드 오른쪽)로 모양을 그려 칸에 찍는 도구 — 칸마다 4×4 표본으로 덮인 몫을 잰다.
카드 가운데 (10.0, 9.0) · 위쪽 û = (1, −1)/√2 · 오른쪽 r̂ = (1, 1)/√2 · 축 거울 (x, y) ↔ (18 − y, 18 − x)."""
import math
R2 = math.sqrt(2)
C = (10.0, 9.0)
def tw(px, py):
    dx, dy = px - C[0], py - C[1]
    return (dx - dy) / R2, (dx + dy) / R2
def at(t, w): return C[0] + (t + w) / R2, C[1] + (w - t) / R2
def cover(test, th=0.45, keep=None):
    out = set()
    for y in range(20):
        for x in range(20):
            if keep is not None and (x, y) not in keep: continue
            n = 0
            for j in range(4):
                for i in range(4):
                    t, w = tw(x + (i + .5) / 4, y + (j + .5) / 4)
                    if test(t, w): n += 1
            if n / 16 > th: out.add((x, y))
    return out
def disc(t0, w0, r): return lambda t, w: (t - t0) ** 2 + (w - w0) ** 2 <= r * r
def rect(t0, t1, w0, w1): return lambda t, w: t0 <= t <= t1 and w0 <= w <= w1
def ring(t0, w0, r0, r1): return lambda t, w: r0 * r0 <= (t - t0) ** 2 + (w - w0) ** 2 <= r1 * r1
def tri(apex, b0, b1):
    """세모: 꼭짓점 apex (t, w), 밑변 b0 · b1"""
    def f(t, w):
        def side(p, q):
            return (q[0] - p[0]) * (w - p[1]) - (q[1] - p[1]) * (t - p[0])
        d1 = side(apex, b0); d2 = side(b0, b1); d3 = side(b1, apex)
        return (d1 >= 0 and d2 >= 0 and d3 >= 0) or (d1 <= 0 and d2 <= 0 and d3 <= 0)
    return f
def anyof(*fs): return lambda t, w: any(f(t, w) for f in fs)
def mirror(px): return set(px) | {(18 - y, 18 - x) for (x, y) in px}
def shade(px, hi, mid, lo):
    """칸 둘레로 명암: 위 · 왼쪽이 비면 빛, 아래 · 오른쪽이 비면 그늘"""
    d = {}
    for (x, y) in px:
        up = (x, y - 1) not in px or (x - 1, y) not in px
        dn = (x, y + 1) not in px or (x + 1, y) not in px
        d[(x, y)] = hi if (up and not dn) else (lo if (dn and not up) else mid)
    return d
def paint(s, d, keep=None):
    for (x, y), ch in d.items():
        if keep is None or (x, y) in keep: s.put(x, y, ch)
