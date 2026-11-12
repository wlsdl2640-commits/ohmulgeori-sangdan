"""20x20 아이템 그림판 (빌드 68 시안) — 재질 칸을 칠하고 가장자리 빛/그늘 + 바깥 테"""
from PIL import Image
import math, io, base64

def hx(c):
    if isinstance(c, tuple): return c if len(c) == 4 else c + (255,)
    c = c.lstrip('#'); return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4)) + (255,)
def mix(a, b, t):
    a, b = hx(a) if isinstance(a, str) else a, hx(b) if isinstance(b, str) else b
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3)) + (255,)

class Ico:
    def __init__(s, w=20, h=20):
        s.w, s.h = w, h; s.m = [[None] * w for _ in range(h)]; s.c = [[None] * w for _ in range(h)]
        s.mats = {}
    def mat(s, k, base, light, dark, line=None, hi=None):
        s.mats[k] = dict(base=hx(base), light=hx(light), dark=hx(dark), line=hx(line) if line else mix(dark, '#000000', 0.45), hi=hx(hi) if hi else None)
    def inb(s, x, y): return 0 <= x < s.w and 0 <= y < s.h
    def put(s, x, y, k):
        if s.inb(x, y): s.m[y][x] = k; s.c[y][x] = None
    def col(s, x, y, c):   # 정해진 색 칸 (명암 안 받음); 재질은 '#'
        if s.inb(x, y): s.m[y][x] = '#'; s.c[y][x] = hx(c) if isinstance(c, str) else c
    def ell(s, cx, cy, rx, ry, k, ang=0):
        ca, sa = math.cos(ang), math.sin(ang)
        for y in range(s.h):
            for x in range(s.w):
                dx, dy = x + .5 - cx, y + .5 - cy
                u, v = dx * ca + dy * sa, -dx * sa + dy * ca
                if (u / rx) ** 2 + (v / ry) ** 2 <= 1: s.put(x, y, k)
    def poly(s, pts, k):
        n = len(pts)
        for y in range(s.h):
            for x in range(s.w):
                px, py, ins = x + .5, y + .5, False
                for i in range(n):
                    x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % n]
                    if (y1 > py) != (y2 > py) and px < x1 + (py - y1) * (x2 - x1) / (y2 - y1): ins = not ins
                if ins: s.put(x, y, k)
    def line(s, x0, y0, x1, y1, k=None, c=None):
        dx, dy = abs(x1 - x0), -abs(y1 - y0); sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1); e = dx + dy
        while True:
            (s.col(x0, y0, c) if c else s.put(x0, y0, k))
            if x0 == x1 and y0 == y1: break
            e2 = 2 * e
            if e2 >= dy: e += dy; x0 += sx
            if e2 <= dx: e += dx; y0 += sy
    def rect(s, x, y, w, h, k):
        for j in range(y, y + h):
            for i in range(x, x + w): s.put(i, j, k)
    def has(s, x, y, k): return s.inb(x, y) and s.m[y][x] == k
    def shade(s, deep=True):
        """재질마다: 오른쪽 아래 가장자리 = 그늘, 왼쪽 위 가장자리 = 빛, 큰 덩이는 안쪽 그늘 띠 한 줄 더"""
        out = [[None] * s.w for _ in range(s.h)]
        for k, M in s.mats.items():
            pts = [(x, y) for y in range(s.h) for x in range(s.w) if s.m[y][x] == k]
            if not pts: continue
            xs, ys = [p[0] for p in pts], [p[1] for p in pts]
            cx, cy, rx, ry = (min(xs) + max(xs) + 1) / 2, (min(ys) + max(ys) + 1) / 2, max(1, (max(xs) - min(xs) + 1) / 2), max(1, (max(ys) - min(ys) + 1) / 2)
            for x, y in pts:
                br = not s.has(x + 1, y, k) or not s.has(x, y + 1, k) or not s.has(x + 1, y + 1, k)
                tl = not s.has(x - 1, y, k) or not s.has(x, y - 1, k)
                d = -((x + .5 - cx) / rx + (y + .5 - cy) / ry) * 0.707
                c = M['base']
                if br and not tl: c = M['dark']
                elif tl and not br: c = M['light']
                elif br and tl: c = M['dark'] if d < 0 else M['light']
                elif deep and d < -0.62 and min(rx, ry) >= 3: c = M['dark']
                out[y][x] = c
            if M['hi']:   # 반짝 칸: 빛 쪽 안쪽에서 가장 밝은 자리
                best = max(((x, y) for x, y in pts if out[y][x] == M['base']), key=lambda p: -((p[0] + .5 - cx) / rx + (p[1] + .5 - cy) / ry), default=None)
                if best: out[best[1]][best[0]] = M['hi']
        s.sh = out
    def render(s, outline=True):
        if not hasattr(s, 'sh'): s.shade()
        im = Image.new('RGBA', (s.w, s.h), (0, 0, 0, 0)); P = im.load()
        for y in range(s.h):
            for x in range(s.w):
                k = s.m[y][x]
                if k is None: continue
                P[x, y] = s.c[y][x] if k == '#' else (s.sh[y][x] or s.mats[k]['base'])
        if outline:
            O = []
            for y in range(s.h):
                for x in range(s.w):
                    if s.m[y][x] is not None: continue
                    nb = [s.m[y + dy][x + dx] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if s.inb(x + dx, y + dy) and s.m[y + dy][x + dx] is not None]
                    if nb:
                        k = nb[0]; lc = s.mats[k]['line'] if k in s.mats else (34, 20, 14, 255)
                        O.append((x, y, lc))
            for x, y, c in O: P[x, y] = c
        return im
    def over(s, fn):   # 명암 뒤에 덧칠 (fn(P) 직접)
        s._over = fn

def png_url(im):
    b = io.BytesIO(); im.save(b, 'PNG'); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()

def finish(ic, post=None):
    im = ic.render()
    if post:
        P = im.load()
        for x, y, c in post:
            if 0 <= x < im.width and 0 <= y < im.height: P[x, y] = hx(c) if isinstance(c, str) else c
    return im

def seams(ic, P, keys, color):
    """서로 다른 재질(keys 안)이 맞닿는 칸 중 오른쪽 · 아래쪽 칸을 어둡게 — 알갱이 사이 줄"""
    for y in range(ic.h):
        for x in range(ic.w):
            k = ic.m[y][x]
            if k not in keys: continue
            for dx, dy in ((-1, 0), (0, -1)):
                j = ic.m[y + dy][x + dx] if ic.inb(x + dx, y + dy) else None
                if j in keys and j != k: P[x, y] = hx(color); break

def ribbon(ic, k, pts, w):
    """가운데 줄 pts를 따라 너비 w인 띠를 다각형으로"""
    L, R = [], []
    for i, (x, y) in enumerate(pts):
        a, b = pts[max(0, i - 1)], pts[min(len(pts) - 1, i + 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]; n = math.hypot(dx, dy) or 1; nx, ny = -dy / n, dx / n
        L.append((x + nx * w / 2, y + ny * w / 2)); R.append((x - nx * w / 2, y - ny * w / 2))
    ic.poly(L + R[::-1], k)
