"""룬 개편 시안용 도트 도구 (빌드 64). 20×20, 칸 (x, y)는 연속 좌표 (x+.5, y+.5)에서 모양 안인지 본다."""
import math

W = H = 20
K = (26, 20, 16)        # 바깥 테 (게임 아이템 그림과 같은 짙은 갈색 검정)
N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))


def hx(s):
    s = s.lstrip('#'); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def lt(c, t): return mix(c, (255, 255, 255), t)
def dk(c, t): return mix(c, (0, 0, 0), t)


# ── 모양 ──
def P(pts):
    def f(x, y):
        c = False; n = len(pts)
        for i in range(n):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % n]
            if (y0 > y) != (y1 > y) and x < x0 + (x1 - x0) * (y - y0) / (y1 - y0): c = not c
        return c
    return f


def C(cx, cy, r): return lambda x, y: (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def E(cx, cy, rx, ry, a=0.0):
    ca, sa = math.cos(a), math.sin(a)
    def f(x, y):
        dx, dy = x - cx, y - cy; u = dx * ca + dy * sa; v = -dx * sa + dy * ca
        return (u / rx) ** 2 + (v / ry) ** 2 <= 1
    return f


def SQ(cx, cy, rx, ry, n=4): return lambda x, y: abs((x - cx) / rx) ** n + abs((y - cy) / ry) ** n <= 1


def _uv(x0, y0, x1, y1, x, y):
    L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L
    dx, dy = x - x0, y - y0
    return (dx * ux + dy * uy) / L, -dx * uy + dy * ux, L


def lens(x0, y0, x1, y1, w, pw=1.0, skew=0.0):
    """잎 · 칼날처럼 두 끝이 뾰족한 모양 (w = 가운데 반폭, skew>0이면 v>0 쪽이 넓다)"""
    def f(x, y):
        u, v, L = _uv(x0, y0, x1, y1, x, y)
        if not 0 <= u <= 1: return False
        lim = w * (4 * u * (1 - u)) ** pw
        return -lim * (1 - skew) <= v <= lim * (1 + skew)
    return f


def prof(x0, y0, x1, y1, fn):
    """축을 따라 반폭이 fn(u) (u 0..1)인 모양 — fn이 (왼쪽, 오른쪽) 짝을 돌려줘도 된다"""
    def f(x, y):
        u, v, L = _uv(x0, y0, x1, y1, x, y)
        if not 0 <= u <= 1: return False
        r = fn(u)
        a, b = (r, r) if not isinstance(r, tuple) else r
        return -a <= v <= b
    return f


def cap(x0, y0, x1, y1, r0, r1=None):
    r1 = r0 if r1 is None else r1
    def f(x, y):
        dx, dy = x1 - x0, y1 - y0; L2 = dx * dx + dy * dy or 1e-9
        t = max(0.0, min(1.0, ((x - x0) * dx + (y - y0) * dy) / L2))
        px, py = x0 + dx * t, y0 + dy * t
        return (x - px) ** 2 + (y - py) ** 2 <= (r0 + (r1 - r0) * t) ** 2
    return f


def U(*fs): return lambda x, y: any(f(x, y) for f in fs)
def D(f, *gs): return lambda x, y: f(x, y) and not any(g(x, y) for g in gs)
def I(*fs): return lambda x, y: all(f(x, y) for f in fs)
def side(ax, ay, bx, by): return lambda x, y: (bx - ax) * (y - ay) - (by - ay) * (x - ax) > 0
def rast(f): return {(x, y) for y in range(H) for x in range(W) if f(x + .5, y + .5)}


def bres(x0, y0, x1, y1):
    x0, y0, x1, y1 = round(x0), round(y0), round(x1), round(y1)
    out = []; dx = abs(x1 - x0); dy = -abs(y1 - y0); sx = 1 if x0 < x1 else -1; sy = 1 if y0 < y1 else -1; err = dx + dy
    while True:
        out.append((x0, y0))
        if x0 == x1 and y0 == y1: break
        e2 = 2 * err
        if e2 >= dy: err += dy; x0 += sx
        if e2 <= dx: err += dx; y0 += sy
    return out


def path(pts):
    out = []
    for i in range(len(pts) - 1):
        for p in bres(*pts[i], *pts[i + 1]):
            if not out or out[-1] != p: out.append(p)
    return out


def shade(M, hi, mid, lo, band=0.26):
    """왼쪽 위 빛: 왼쪽 위 가장자리 = hi, 오른쪽 아래 가장자리 = lo, 안쪽은 세 칸 띠"""
    px = {}
    if not M: return px
    xs = [p[0] for p in M]; ys = [p[1] for p in M]
    cx = (min(xs) + max(xs)) / 2; cy = (min(ys) + max(ys)) / 2
    span = max(max(xs) - min(xs) + 1, max(ys) - min(ys) + 1)
    for (x, y) in M:
        tl = (x - 1, y) not in M or (x, y - 1) not in M
        br = (x + 1, y) not in M or (x, y + 1) not in M
        t = ((x - cx) + (y - cy)) / span
        if tl and not br: c = hi
        elif br and not tl: c = lo
        elif tl and br: c = mid
        else: c = mix(mid, hi, .42) if t < -band else (mix(mid, lo, .42) if t > band else mid)
        px[(x, y)] = c
    return px


class Ic:
    def __init__(s): s.px = {}; s.O = set(); s.ol = set()

    def fill(s, f, hi, mid, lo, ol=True, band=0.26):
        M = rast(f) if callable(f) else set(f)
        s.px.update(shade(M, hi, mid, lo, band))
        if ol: s.O |= M
        return M

    def facets(s, outer, parts, ol=True):
        """outer 안을 parts [(시험 fn 또는 None, hi, mid, lo), …]로 나눠 칠한다 (앞의 것이 먼저 가져간다 · 구멍 없음)"""
        M = rast(outer) if callable(outer) else set(outer); left = set(M); subs = []
        for (fn, hi, mid, lo) in parts:
            sub = {p for p in left if fn is None or fn(p[0] + .5, p[1] + .5)}
            left -= sub; subs.append((sub, hi, mid, lo))
        if left: subs[-1] = (subs[-1][0] | left,) + subs[-1][1:]
        for sub, hi, mid, lo in subs: s.px.update(shade(sub, hi, mid, lo))
        if ol: s.O |= M
        return M

    def paint(s, f, fn, ol=True):
        M = rast(f) if callable(f) else set(f)
        for (x, y) in M:
            c = fn(x, y, M)
            if c: s.px[(x, y)] = c
        if ol: s.O |= M
        return M

    def put(s, pts, col, within=None, ol=False):
        for p in pts:
            if within is not None and p not in within: continue
            if 0 <= p[0] < W and 0 <= p[1] < H:
                s.px[p] = col
                if ol: s.O.add(p)

    def line(s, pts, col, within=None, ol=False): s.put(path(pts), col, within, ol)

    def tint(s, pts, col, t, within=None):
        for p in pts:
            if p in s.px and (within is None or p in within): s.px[p] = mix(s.px[p], col, t)

    def done(s):
        out = {}
        for (x, y) in s.O:
            for dx, dy in N4:
                q = (x + dx, y + dy)
                if q not in s.px and 0 <= q[0] < W and 0 <= q[1] < H: out[q] = K
        s.px.update(out); s.ol = set(out)
        return s

    def free(s, p, gap=1):
        if not (0 <= p[0] < W and 0 <= p[1] < H) or p in s.px: return False
        return all((p[0] + dx, p[1] + dy) not in s.px for dx in range(-gap, gap + 1) for dy in range(-gap, gap + 1))

    def spark(s, x, y, core, side_):
        if not s.free((x, y)): return
        s.px[(x, y)] = core
        for dx, dy in ((1, 1), (-1, -1), (1, -1), (-1, 1)):
            q = (x + dx, y + dy)
            if 0 <= q[0] < W and 0 <= q[1] < H and q not in s.px: s.px[q] = side_

    def aura(s, c1, c2, n=8, rot=0.0, dist=2, skip=()):
        """물건 둘레(테에서 dist칸 떨어진 빈칸)에 기운 점 n개를 고르게 (c1 · c2 번갈아)"""
        occ = set(s.px)
        if not occ: return
        xs = [p[0] for p in occ]; ys = [p[1] for p in occ]
        cx = (min(xs) + max(xs)) / 2 + .5; cy = (min(ys) + max(ys)) / 2 + .5
        cand = []
        for y in range(H):
            for x in range(W):
                if (x, y) in occ or (x, y) in skip: continue
                d = min(max(abs(x - a), abs(y - b)) for (a, b) in occ)
                if d == dist: cand.append((math.atan2(y + .5 - cy, x + .5 - cx), (x, y)))
        if not cand: return
        cand.sort()
        picks = []
        for i in range(n):
            a = -math.pi + rot + i * 2 * math.pi / n
            a = (a + math.pi) % (2 * math.pi) - math.pi
            best = min(cand, key=lambda c: min(abs(c[0] - a), 2 * math.pi - abs(c[0] - a)))
            if best[1] not in picks and all(max(abs(best[1][0] - q[0]), abs(best[1][1] - q[1])) > 2 for q in picks): picks.append(best[1])
        for i, p in enumerate(picks): s.px[p] = c1 if i % 2 == 0 else c2
