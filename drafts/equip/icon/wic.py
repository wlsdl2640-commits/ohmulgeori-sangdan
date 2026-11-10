"""무기 그림판 (게임 장비 그림 크기: 20×20, 1칸 = 1픽셀, 칼끝 오른쪽 위 · 자루 왼쪽 아래 45°).
칼 좌표: s = 자루 끝(0)에서 칼끝 쪽으로, t = 옆 (음수 = 왼쪽 위 = 빛 받는 쪽, 양수 = 오른쪽 아래 = 그늘).
칸 가운데가 모양 안에 들면 칠한다 (가운데 표본 하나 → 45° 계단이 깨끗하다).
층: 몸(테두리 있음) → 검은 테두리 → (빛 테두리) → 효과(테두리 없음, 맨 위)."""
import math
N = 20
R2 = math.sqrt(2)
OUT = '#1a1414'
AX = 1.5                       # 축: (1.5, 18.5) → (18.5, 1.5) 칸 가운데를 잇는 줄. s 0..24
def hexc(h):
    if isinstance(h, tuple): return h
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def tohex(c): return '#%02x%02x%02x' % c
def mix(a, b, k):
    a, b = hexc(a), hexc(b); return tohex(tuple(round(a[i] + (b[i] - a[i]) * k) for i in range(3)))
def lit(c, k): return mix(c, '#ffffff', k) if k >= 0 else mix(c, '#000000', -k)
def st(x, y, ax=AX):
    """칸 (x, y)의 가운데 → (s, t)"""
    dx, dy = x + .5 - ax, y + .5 - (N - ax)
    return (dx - dy) / R2, (dx + dy) / R2
def xy(s, t, ax=AX):
    return ax + (s + t) / R2, (N - ax) + (t - s) / R2

class Ico:
    def __init__(s, pal, ax=AX):
        s.pal = dict(pal); s.ax = ax
        s.body = {}            # (x, y) → 역할 글자 (테두리 있음)
        s.fx = {}              # 테두리 없는 효과 (맨 위)
        s.under = {}           # 테두리 없는 효과 (몸 아래, 테두리 위)
        s.glow = None; s.out = OUT; s.noout = set()
    def cells(s):
        for y in range(N):
            for x in range(N):
                yield x, y, st(x, y, s.ax)
    # ── 모양 ──
    def band(s, s0, s1, tl, td, role, prio=True):
        """날 · 손잡이 같은 띠: s0..s1 사이, 옆으로 -tl(s)..td(s). role(s, t, lo, hi) → 글자"""
        f = lambda v, q: v(q) if callable(v) else v
        for x, y, (S, T) in s.cells():
            if s0 <= S <= s1:
                lo, hi = -f(tl, S), f(td, S)
                if lo <= T <= hi:
                    ch = role(S, T, lo, hi) if callable(role) else role
                    if ch and (prio or (x, y) not in s.body): s.body[(x, y)] = ch
    def disc(s, S0, T0, r, role, layer='body', sq=1.0):
        """동그라미 (칼 좌표 가운데, 칸 반지름). role(dx, dy, d) — dx, dy는 화면 방향 (빛: 왼쪽 위)"""
        cx, cy = xy(S0, T0, s.ax)
        L = getattr(s, layer)
        for y in range(N):
            for x in range(N):
                dx, dy = x + .5 - cx, (y + .5 - cy) * sq
                d = math.hypot(dx, dy)
                if d <= r:
                    ch = role(dx, dy, d) if callable(role) else role
                    if ch: L[(x, y)] = ch
    def poly(s, pts, role, layer='body'):
        """칼 좌표 꼭짓점들 (s, t)로 된 다각형"""
        P = [xy(a, b, s.ax) for a, b in pts]
        L = getattr(s, layer)
        for y in range(N):
            for x in range(N):
                if inside(P, x + .5, y + .5):
                    S, T = st(x, y, s.ax)
                    ch = role(S, T) if callable(role) else role
                    if ch: L[(x, y)] = ch
    def grid(s, rows, ox=0, oy=0, layer='body'):
        """손그림 덮기: '.' 건너뜀, '_' 지움"""
        L = getattr(s, layer)
        for j, r in enumerate(rows):
            for i, ch in enumerate(r):
                if ch == '.' or ch == ' ': continue
                p = (ox + i, oy + j)
                if ch == '_':
                    s.body.pop(p, None); s.fx.pop(p, None); s.under.pop(p, None)
                else: L[p] = ch
    def P(s, x, y, ch, layer='body'):
        if ch == '_': s.body.pop((x, y), None); s.fx.pop((x, y), None); return
        getattr(s, layer)[(x, y)] = ch
    def at(s, x, y): return s.body.get((x, y))
    # ── 그리기 ──
    def render(s):
        img = {}
        for k, ch in s.under.items(): img[k] = hexc(s.pal[ch])
        filled = set(k for k, ch in s.body.items() if ch not in s.noout)
        for k, ch in s.body.items(): img[k] = hexc(s.pal[ch])
        ring = set()
        for (x, y) in filled:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (x + dx, y + dy)
                if q not in s.body and 0 <= q[0] < N and 0 <= q[1] < N: ring.add(q)
        for q in ring: img[q] = hexc(s.out)
        if s.glow:
            ring2 = set()
            for (x, y) in ring:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    q = (x + dx, y + dy)
                    if q not in s.body and q not in ring and 0 <= q[0] < N and 0 <= q[1] < N: ring2.add(q)
            dot = getattr(s, 'glow_dot', False)
            for q in ring2:
                if dot and (q[0] + q[1]) % 2: continue          # 점선 빛 테 (한 칸 걸러)
                if q not in s.under: img[q] = hexc(s.glow)
        for k, ch in s.fx.items(): img[k] = hexc(s.pal[ch])
        return img
def inside(P, x, y):
    c = False; n = len(P)
    for i in range(n):
        x1, y1 = P[i]; x2, y2 = P[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1): c = not c
    return c
# ── 자주 쓰는 명암 ──
def blade_role(edge_w=0.75, fuller=None, core=None):
    """빛 쪽 가장자리 w · 빛 b · 가운데 c(등줄/홈) · 그늘 B · 그늘 가장자리 n"""
    def f(S, T, lo, hi):
        if T < lo + edge_w: return 'w'
        if T > hi - edge_w * 0.9: return 'n'
        if fuller and fuller[0] <= S <= fuller[1] and abs(T) < 0.4: return 'c'
        if core and abs(T) < core: return 'c'
        return 'b' if T < 0.01 else 'B'
    return f
def side3(a, b, c):
    """빛 쪽 a · 가운데 b · 그늘 c (t 기준)"""
    def f(S, T, lo, hi):
        if T < lo + 0.75: return a
        if T > hi - 0.75: return c
        return b
    return f
def ball(a, b, c, hi=None):
    """공 명암 (화면 왼쪽 위 빛)"""
    def f(dx, dy, d):
        k = dx + dy
        if hi and k < -1.1 and d > 0.4: return hi
        return a if k < -0.4 else c if k > 0.6 else b
    return f
