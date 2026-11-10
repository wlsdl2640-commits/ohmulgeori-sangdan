"""45° 칼 그림을 정수 칸 좌표로: u = x − y (칼끝 쪽 +), v = x + y − 19 (오른쪽 아래 = 그늘 쪽 +).
u + v는 늘 홀수. u가 같은 칸들은 '\\' 줄(칼과 직각), v가 같은 칸들은 '/' 줄(칼과 나란히).
칼끝 (18,1) = (u 17, v 0) · 자루 끝 (1,18) = (u −17, v 0)."""
from wic import Ico, N
def XY(u, v):
    if (u + v) % 2 == 0: return None
    return ((u + v + 19) // 2, (v - u + 19) // 2)
def UV(x, y): return (x - y, x + y - 19)
class UIco(Ico):
    def put(s, u, v, ch, layer='body'):
        p = XY(u, v)
        if p and 0 <= p[0] < N and 0 <= p[1] < N:
            L = getattr(s, layer)
            if ch == '_': L.pop(p, None)
            else: L[p] = ch
    def row(s, u, v0, v1, fn, layer='body'):
        """u 줄 하나에 v0..v1 (홀짝 맞는 칸만). fn(v, 처음, 끝) → 글자 또는 글자 하나"""
        vs = [v for v in range(v0, v1 + 1) if (u + v) % 2]
        for i, v in enumerate(vs):
            ch = fn(v, i == 0, i == len(vs) - 1) if callable(fn) else fn
            if ch: s.put(u, v, ch, layer)
    def get(s, u, v):
        p = XY(u, v); return s.body.get(p) if p else None
    def strip(s, u0, u1, prof, fn, layer='body'):
        """u0..u1 (칼 방향) 각 줄 v 범위 prof(u) → (lo, hi) 또는 None. fn(u, v, lo, hi, 처음, 끝)"""
        for u in range(u0, u1 + 1):
            r = prof(u)
            if not r: continue
            lo, hi = r
            vs = [v for v in range(lo, hi + 1) if (u + v) % 2]
            for i, v in enumerate(vs):
                ch = fn(u, v, lo, hi, i == 0, i == len(vs) - 1) if callable(fn) else fn
                if ch: s.put(u, v, ch, layer)
# 날 명암 (v 기준: 가장 바깥 빛 쪽 w · 빛 b · 가운데 c · 그늘 B · 가장 바깥 그늘 n)
def shade5(center='c'):
    def f(u, v, lo, hi, first, last):
        if v <= lo + 0 and v < 0: return 'w'
        if v == lo + 1 and v < 0 and lo <= -2: return 'w' if (u + v) % 2 and v == lo else 'b'
        if v >= hi and v > 0: return 'n'
        if v == 0 or abs(v) <= 0: return center
        return 'b' if v < 0 else 'B'
    return f
def blade_fn(u, v, lo, hi, first, last):
    if first and v < 0: return 'w'
    if last and v > 0: return 'n'
    if v == 0: return 'c'
    return 'b' if v < 0 else 'B'
