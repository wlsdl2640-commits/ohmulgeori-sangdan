"""바로 선 그림 격자를 45° 돌려(그림 위쪽 → 화면 오른쪽 위) 카드 칸에 찍는다 — 칸마다 4×4 표본의 다수결(빈 칸 포함)."""
import math
from collections import Counter
R2 = math.sqrt(2)
def rot(rows, cx, cy, keep=None, scale=1.0, ss=4, bias=0.0):
    """rows: 바로 선 격자('.' = 빈칸). (cx, cy) = 화면 연속 좌표의 그림 가운데. 돌려서 {(x, y): 글자}"""
    rows = [r.replace(' ', '') for r in rows]
    h = len(rows); w = len(rows[0])
    sx0, sy0 = w / 2, h / 2
    out = {}
    for y in range(20):
        for x in range(20):
            if keep is not None and (x, y) not in keep: continue
            c = Counter()
            for j in range(ss):
                for i in range(ss):
                    X = x + (i + .5) / ss - cx; Y = y + (j + .5) / ss - cy
                    a = (X + Y) / R2 / scale; b = (X - Y) / R2 / scale       # a = 그림 오른쪽 · b = 그림 위쪽
                    u = sx0 + a; v = sy0 - b
                    ch = '.'
                    if 0 <= u < w and 0 <= v < h: ch = rows[int(v)][int(u)]
                    c[ch] += 1
            ch, n = c.most_common(1)[0]
            if ch == '.':
                inks = [(k, m) for k, m in c.items() if k != '.']
                if inks and sum(m for _, m in inks) >= ss * ss * (0.5 - bias): ch = max(inks, key=lambda t: t[1])[0]
            if ch != '.': out[(x, y)] = ch
    return out

def scale2x(g):
    """EPX(Scale2x): 가장자리를 살리며 두 배 — 글자 격자"""
    h = len(g); w = len(g[0])
    def px(x, y): return g[y][x] if 0 <= x < w and 0 <= y < h else '.'
    out = [[None] * (2 * w) for _ in range(2 * h)]
    for y in range(h):
        for x in range(w):
            P = px(x, y); A = px(x, y - 1); B = px(x + 1, y); C = px(x - 1, y); D = px(x, y + 1)
            e0 = e1 = e2 = e3 = P
            if C == A and C != D and A != B: e0 = A
            if A == B and A != C and B != D: e1 = B
            if D == C and D != B and C != A: e2 = C
            if B == D and B != A and D != C: e3 = D
            out[2 * y][2 * x] = e0; out[2 * y][2 * x + 1] = e1; out[2 * y + 1][2 * x] = e2; out[2 * y + 1][2 * x + 1] = e3
    return [''.join(r) for r in out]
def rotsprite(rows, cx, cy, keep=None, up=3, ss=4, ink=0.45):
    """RotSprite: 2^up배로 EPX 확대 → 45° 돌림(가까운 칸) → 칸마다 ss×ss 표본 다수결. ink = 그림 칸이 이만큼 넘으면 그림으로"""
    rows = [r.replace(' ', '') for r in rows]
    w = max(len(r) for r in rows); rows = [r.ljust(w, '.') for r in rows]
    g = rows
    for _ in range(up): g = scale2x(g)
    k = 2 ** up; h2 = len(g); w2 = len(g[0])
    sx0, sy0 = w2 / 2, h2 / 2
    out = {}
    for y in range(20):
        for x in range(20):
            if keep is not None and (x, y) not in keep: continue
            c = Counter()
            for j in range(ss):
                for i in range(ss):
                    X = x + (i + .5) / ss - cx; Y = y + (j + .5) / ss - cy
                    a = (X + Y) / R2 * k; b = (X - Y) / R2 * k
                    u = int(math.floor(sx0 + a)); v = int(math.floor(sy0 - b))
                    c[g[v][u] if 0 <= u < w2 and 0 <= v < h2 else '.'] += 1
            inks = Counter({kk: m for kk, m in c.items() if kk != '.'})
            if inks and sum(inks.values()) >= ss * ss * ink: out[(x, y)] = inks.most_common(1)[0][0]
    return out
