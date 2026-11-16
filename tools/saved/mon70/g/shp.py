"""빌드 53 시안 도구: 도형으로 부위를 그리고, 부위마다 손 3톤(위 가장자리 빛 · 가운데 · 아래 가장자리 그늘)을 놓는다.
자동 공 명암(ball) 대신 — 띠가 깔끔하고 얼룩이 없다. 칸 = 반 해상도 한 칸(화면 2×2 픽셀)."""
import math
class Cv:
    def __init__(s, W, H): s.W, s.H = W, H; s.g = [['.'] * W for _ in range(H)]
    def inb(s, x, y): return 0 <= x < s.W and 0 <= y < s.H
    def get(s, x, y): return s.g[y][x] if s.inb(x, y) else '.'
    def set(s, x, y, ch):
        x, y = int(round(x)), int(round(y))
        if s.inb(x, y): s.g[y][x] = '.' if ch == '_' else ch
    def text(s):
        rs = [''.join(r).rstrip('.') or '.' for r in s.g]
        while len(rs) > 1 and rs[0] == '.': rs.pop(0)
        return '\n' + '\n'.join(rs) + '\n'
    def rows(s): return [r[:] for r in s.g]
# ── 도형 → 칸 집합 ──
def ell(cx, cy, rx, ry, W=99, H=99):
    out = set()
    for y in range(max(0, int(cy - ry - 1)), min(H, int(cy + ry + 2))):
        for x in range(max(0, int(cx - rx - 1)), min(W, int(cx + rx + 2))):
            if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1.0: out.add((x, y))
    return out
def poly(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; out = set()
    for y in range(int(min(ys)) - 1, int(max(ys)) + 2):
        for x in range(int(min(xs)) - 1, int(max(xs)) + 2):
            px, py = x + 0.5, y + 0.5; c = False; j = len(pts) - 1
            for i in range(len(pts)):
                xi, yi = pts[i]; xj, yj = pts[j]
                if (yi > py) != (yj > py) and px < (xj - xi) * (py - yi) / (yj - yi + 1e-9) + xi: c = not c
                j = i
            if c: out.add((x, y))
    return out
def cap(p0, p1, r):
    """두께 있는 선분 (끝이 둥근)"""
    (x0, y0), (x1, y1) = p0, p1; out = set(); L2 = (x1 - x0) ** 2 + (y1 - y0) ** 2 or 1e-9
    for y in range(int(min(y0, y1) - r - 1), int(max(y0, y1) + r + 2)):
        for x in range(int(min(x0, x1) - r - 1), int(max(x0, x1) + r + 2)):
            px, py = x + 0.5, y + 0.5; t = max(0, min(1, ((px - x0) * (x1 - x0) + (py - y0) * (y1 - y0)) / L2))
            if (px - x0 - t * (x1 - x0)) ** 2 + (py - y0 - t * (y1 - y0)) ** 2 <= r * r: out.add((x, y))
    return out
def path(pts, r0, r1=None):
    """여러 점을 잇는 굵은 줄 (두께가 r0에서 r1로)"""
    r1 = r0 if r1 is None else r1; out = set(); n = len(pts) - 1
    for i in range(n):
        ra = r0 + (r1 - r0) * i / max(1, n); rb = r0 + (r1 - r0) * (i + 1) / max(1, n)
        for k in range(6):
            t0 = k / 6; t1 = (k + 1) / 6
            a = (pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t0, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t0)
            b = (pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t1, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t1)
            out |= cap(a, b, ra + (rb - ra) * (t0 + t1) / 2)
    return out
def box(x0, y0, x1, y1): return {(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1)}
# ── 칠하기 ──
def paint(cv, cells, L, M, D, light=1, dark=1, lightx=0.7, mode='edge'):
    """부위 칸을 3톤으로: 위가 비었으면(또는 다른 부위) 빛 L(왼쪽 lightx 비율까지만), 아래가 비었으면 그늘 D(dark 줄), 나머지 M"""
    if not cells: return
    xs = [c[0] for c in cells]; xa, xb = min(xs), max(xs)
    for (x, y) in cells:
        ch = M
        below = all((x, y + k) not in cells for k in [dark]) or (x, y + 1) not in cells
        if dark and any((x, y + k) not in cells for k in range(1, dark + 1)): ch = D
        elif light and (x, y - 1) not in cells and (xb == xa or (x - xa) / (xb - xa + 1e-9) <= lightx): ch = L
        cv.set(x, y, ch)
def fill(cv, cells, ch):
    for (x, y) in cells: cv.set(x, y, ch)
def dots(cv, pts, ch):
    for (x, y) in pts: cv.set(x, y, ch)
def outline_in(cv, cells, ch):
    """부위 안쪽 테두리(바깥과 맞닿은 칸)만 ch로"""
    for (x, y) in cells:
        if any((x + dx, y + dy) not in cells for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): cv.set(x, y, ch)
def mirror_x(cells, cx): return {(int(round(2 * cx - x - 1)), y) for (x, y) in cells}
def shift(cells, dx, dy): return {(x + dx, y + dy) for (x, y) in cells}
