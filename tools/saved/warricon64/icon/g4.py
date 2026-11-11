"""글라디우스 원형 시안 4 — 모든 부품이 한 축(x + y = AX, 기본 19) 위에 가운데 맞춤.
칸 좌표 u = x − y (칼끝 쪽 +), v = x + y − AX (0 = 축, − = 왼쪽 위 빛 받는 쪽).
축 대칭: (u, v) ↔ (u, −v) — 윤곽은 좌우(축 기준) 똑같고, 명암만 빛(왼쪽 위)을 따른다."""
import math
from wic import Ico, N
AX = 19
def UV(x, y): return x - y, x + y - AX
class Sw:
    def __init__(s):
        s.part = {}        # (x, y) → (부품, 글자)
    def each(s):
        for y in range(N):
            for x in range(N):
                yield x, y, UV(x, y)
    def put(s, x, y, part, ch):
        if 0 <= x < N and 0 <= y < N: s.part[(x, y)] = (part, ch)
    def shape(s, part, test, role):
        for x, y, (u, v) in s.each():
            if test(u, v):
                ch = role(u, v, x, y)
                if ch: s.put(x, y, part, ch)
    def icon(s, pal, fx=None, glow=None):
        ic = Ico(pal)
        for k, (p, ch) in s.part.items(): ic.body[k] = ch
        if fx:
            for k, ch in fx.items(): ic.fx[k] = ch
        ic.glow = glow
        return ic
    def sym_err(s):
        """축 대칭이 아닌 칸 (윤곽)"""
        bad = []
        for (x, y) in s.part:
            u, v = UV(x, y)
            # (u, −v)인 칸
            x2, y2 = (u - v + AX) // 2, (-v - u + AX) // 2
            if (x2, y2) not in s.part: bad.append((x, y))
        return bad

def blade(s, u0, u1, hw, roles='wbcBn', ridge=True, wide=None):
    """날: u0..u1, |v| ≤ hw(u). 글자 = 빛 가장자리 · 빛 면 · 등줄 · 그늘 면 · 그늘 가장자리"""
    W, Bl, C, Bd, Nn = roles
    def test(u, v): return u0 <= u <= u1 and abs(v) <= hw(u) + 1e-6
    def role(u, v, x, y):
        h = hw(u)
        # 그 줄(u)에서 가장 바깥 칸인가
        edge = abs(v) > 0 and abs(v) >= math.floor(h + 1e-6)
        if v < 0: return W if edge else Bl
        if v > 0: return Nn if edge else Bd
        return C if ridge else Bl
    s.shape('blade', test, role)
def ellipse(s, part, uc, vc, ru, rv, roles, extra=None):
    """u 방향 반지름 ru, v 방향 반지름 rv인 타원 (칸 좌표). roles(du, dv, k) — k = 타원 안쪽 깊이 0..1"""
    def test(u, v): return ((u - uc) / ru) ** 2 + ((v - vc) / rv) ** 2 <= 1.0 + 1e-6
    def role(u, v, x, y):
        k = ((u - uc) / ru) ** 2 + ((v - vc) / rv) ** 2
        return roles(u - uc, v - vc, k)
    s.shape(part, test, role)
def ball(s, part, uc, r, roles):
    """화면에서 둥근 공 (반지름 r 픽셀, 가운데 축 위 u = uc)"""
    def test(u, v): return ((u - uc) ** 2 + v * v) / 2.0 <= r * r + 1e-6
    def role(u, v, x, y):
        # 화면 방향: dx = (du + dv)/2, dy = (dv − du)/2
        du = u - uc; dx, dy = (du + v) / 2.0, (v - du) / 2.0
        return roles(dx, dy, math.hypot(dx, dy) / r)
    s.shape(part, test, role)
def grip(s, u0, u1, roles, ribs=()):
    """손잡이: |v| ≤ 1 (한 줄 3칸, 축 가운데). ribs = 마디 u 목록 (마디는 |v| ≤ 2로 불룩)"""
    L, M, D, rl, rm, rd = roles
    def test(u, v): return u0 <= u <= u1 and (abs(v) <= 1 or (u in ribs and abs(v) <= 2))
    def role(u, v, x, y):
        rib = u in ribs
        if v < 0: return rl if rib else L
        if v > 0: return rd if rib else D
        return rm if rib else M
    s.shape('grip', test, role)
def sph(hi, lit, mid, dark, rim=None):
    def f(dx, dy, k):
        t = dx + dy
        if hi and abs(dx + 0.55) < 0.6 and abs(dy + 0.55) < 0.6 and k < 0.75: return hi
        if t < -0.35: return lit
        if t > 0.9 and rim: return rim
        if t > 0.35: return dark
        return mid
    return f
def show(sw):
    for y in range(N): print('%2d ' % y + ''.join(sw.part.get((x, y), ('', '.'))[1] for x in range(N)))
