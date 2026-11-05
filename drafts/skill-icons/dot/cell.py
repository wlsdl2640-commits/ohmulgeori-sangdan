"""뭉툭 도트 스킬 아이콘 판.
지금 쓰는 육각 틀(48px) 안쪽은 16×20칸 (한 칸 = 2×2픽셀, 캐릭터와 같은 반 해상도).
층 순서: 배경(계산) → 효과(손그림·계산, 테두리 없음) → 상징(손그림, 검은 테두리 + B4 손질) → 위 효과(반짝이·점).
"""
import math, sys, pathlib
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / 'skicon')); sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / 'chunky'))
import b4
W, H, OX, OY = 16, 20, 4, 2           # 보이는 칸: 24칸 판에서 x 4..19, y 2..21
rgb = b4.rgb
OUT = rgb(b4.OUT)
def _mask():
    im = b4.hexbase('none'); px = im.load(); t = rgb(b4.HEX_TINT['none']); m = {}
    for cy in range(H):
        for cx in range(W):
            n = sum(1 for dy in (0, 1) for dx in (0, 1) if px[(cx + OX) * 2 + dx, (cy + OY) * 2 + dy][3] and px[(cx + OX) * 2 + dx, (cy + OY) * 2 + dy][:3] == t)
            if n: m[(cx, cy)] = n
    return m
MASK = _mask()
def col(c):
    return c if isinstance(c, tuple) else rgb(c)
def mix(a, b, t):
    a, b = col(a), col(b); return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def scale(c, f):
    return tuple(max(0, min(255, round(v * f))) for v in col(c))
# 재질 묶음: b4와 같음 + 그림마다 덧붙이는 글자
MAT = dict(b4.MAT)
class Art:
    def __init__(self, fill=(0, 0, 0)):
        self.c = [[col(fill)] * W for _ in range(H)]
    def bg(self, fn):
        for y in range(H):
            for x in range(W): self.c[y][x] = col(fn(x + 0.5, y + 0.5))
        return self
    def set(self, x, y, c):
        if 0 <= x < W and 0 <= y < H: self.c[y][x] = col(c)
    def get(self, x, y):
        return self.c[y][x] if 0 <= x < W and 0 <= y < H else None
    def paint(self, rows, pal, ox=0, oy=0):
        """평평한 색 칠 (테두리·손질 없음). '.'·' '는 건너뜀."""
        for y, r in enumerate(rows):
            for x, ch in enumerate(r):
                if ch in '. ': continue
                self.set(x + ox, y + oy, pal[ch])
        return self
    def cells(self, cm):
        for (x, y), c in cm.items(): self.set(x, y, c)
        return self
    def sym(self, rows, pal=None, ox=0, oy=0, out=OUT, fx=True, rim=0.24, line=0.24, glow=None):
        """상징: 1칸 검은 테두리 + B4 손질(부위 사이 어두운 선, 왼쪽 위 가장자리 빛, 쇠·가죽 질감).
        pal: {글자: 색 또는 (색, 재질 묶음)} — b4.FIX 글자는 그대로 쓸 수 있다.
        glow: 테두리 바깥 1칸을 이 색으로 (빛 테두리)."""
        cols = {k: (rgb(v), MAT.get(k, 0)) for k, v in b4.FIX.items()}
        for k, v in (pal or {}).items():
            cols[k] = (col(v[0]), v[1]) if isinstance(v, tuple) and len(v) == 2 and not isinstance(v[0], int) else (col(v), MAT.get(k, 4))
        Hh = len(rows); at = lambda x, y: rows[y][x] if 0 <= y < Hh and 0 <= x < len(rows[y]) else '.'
        filled = set()
        for y in range(Hh):
            for x in range(len(rows[y])):
                c = at(x, y)
                if c in '. ': continue
                base, m = cols[c]; f = 1.0
                if fx and m > 1:
                    up, lf = at(x, y - 1), at(x - 1, y)
                    mu, ml = (cols[up][1] if up not in '. ' else 0), (cols[lf][1] if lf not in '. ' else 0)
                    if (up not in '. ' and mu > 1 and mu != m) or (lf not in '. ' and ml > 1 and ml != m): f *= 1 - line
                    elif up in '. ' or lf in '. ': f *= 1 + rim
                    if m == 5 and (x + ox + y + oy) % 2: f *= 0.93
                    if m == 9 and (x + ox) % 3 == 1 and (y + oy) % 3 == 1: f *= 0.86
                self.set(x + ox, y + oy, scale(base, f)); filled.add((x + ox, y + oy))
        ring = set()
        for (x, y) in filled:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (x + dx, y + dy)
                if q not in filled: ring.add(q)
        for (x, y) in ring: self.set(x, y, out)
        if glow:
            ring2 = set()
            for (x, y) in ring:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    q = (x + dx, y + dy)
                    if q not in filled and q not in ring: ring2.add(q)
            for (x, y) in ring2: self.set(x, y, glow)
        return self
    def img(self, kind='none'):
        """48px 육각 아이콘 (지금 틀)"""
        im = b4.hexbase(kind); px = im.load(); t = rgb(b4.HEX_TINT.get(kind, b4.HEX_TINT['none']))
        for y in range(48):
            for x in range(48):
                if px[x, y][3] and px[x, y][:3] == t:
                    cx, cy = x // 2 - OX, y // 2 - OY
                    if 0 <= cx < W and 0 <= cy < H: px[x, y] = self.c[cy][cx] + (255,)
        return im
# ── 배경 도우미 ──
def ramp_pick(ramp, v, cuts):
    """v(0..1)를 끊는 곳(cuts, 오름차순)으로 단계 고르기"""
    k = sum(1 for c in cuts if v >= c); return ramp[min(k, len(ramp) - 1)]
def radial(ramp, cx, cy, R, cuts, rays=0, rot=0.0, ray_w=0.5, ray_amp=0.1, sq=1.0):
    """둥근 빛 + 빛살. ramp: 어둠→밝음."""
    def fn(x, y):
        dx, dy = (x - cx), (y - cy) * sq; d = math.hypot(dx, dy); v = 1 - d / R
        if rays:
            th = math.atan2(dy, dx) + rot; s = (th * rays / (2 * math.pi)) % 1
            v += ray_amp if s < ray_w else -ray_amp * 0.4
        return ramp_pick(ramp, v, cuts)
    return fn
def cover(fn, ss=6):
    """칸마다 덮인 정도(0..1): fn(x, y) → 참/거짓 (칸 좌표, 실수)"""
    out = {}
    for y in range(H):
        for x in range(W):
            n = 0
            for j in range(ss):
                for i in range(ss):
                    if fn(x + (i + 0.5) / ss, y + (j + 0.5) / ss): n += 1
            if n: out[(x, y)] = n / (ss * ss)
    return out
def zoom(im, z):
    return im.resize((im.width * z, im.height * z), Image.NEAREST)
# ── 칼 그리기: 칼끝(tx,ty)에서 각도 ang(도, 칼끝→자루 방향, 화면 좌표)으로 ──
def sword(tx, ty, ang, blade=8.0, bw=2.2, tip=1.6, guard=5.0, gt=1.2, grip=2.4, gw=1.1, pom=0.9, ridge=True):
    """돌려주는 것: {(x,y): 글자} — w 날 밝은 쪽, m 날 가운데, M 날 어두운 쪽, y/Y 코등이, l/L 손잡이, y 자루끝"""
    ux, uy = math.cos(math.radians(ang)), math.sin(math.radians(ang)); nx, ny = -uy, ux
    out = {}
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5 - tx, y + 0.5 - ty
            u = px * ux + py * uy; v = px * nx + py * ny   # u: 칼끝에서 자루 쪽으로, v: 옆
            # 빛은 왼쪽 위에서: 옆 방향 중 왼쪽 위를 향하는 쪽이 밝다
            side = v * (1 if (nx + ny) < 0 else -1)          # side > 0: 밝은 쪽
            g0 = blade; g1 = blade + gt; p0 = g1 + grip
            if 0 <= u < blade:
                half = bw / 2 * min(1.0, (u + 0.35) / tip)
                if abs(v) <= half:
                    out[(x, y)] = 'w' if side > bw * 0.17 else ('M' if side < -bw * 0.17 else 'm')
            elif g0 <= u < g1:
                if abs(v) <= guard / 2: out[(x, y)] = 'y' if (u - g0) < gt / 2 or side > 0 else 'Y'
            elif g1 <= u < p0:
                if abs(v) <= gw / 2: out[(x, y)] = 'l' if side >= 0 else 'L'
            elif math.hypot(u - (p0 + pom * 0.6), v) <= pom:
                out[(x, y)] = 'y' if side >= 0 else 'Y'
    return out
def rows_of(cm):
    g = [['.'] * W for _ in range(H)]
    for (x, y), ch in cm.items():
        if 0 <= x < W and 0 <= y < H: g[y][x] = ch
    return [''.join(r) for r in g]
def dsword(tipx, tipy, Lb=6, Lg=2, g=1, wide=3, base_light=False, pom=2):
    """45° 칼 (칼끝 왼쪽 아래, 자루 오른쪽 위), 칸 단위로 정확히. tip = 칼끝 한 칸.
    날: wide=3 → w m M, wide=2 → w M. 코등이: 날 끝 너머 가로지르는 2칸 두께, 길이 2g+1. 손잡이 1칸, 자루끝 2×2."""
    x0, y0 = tipx + 1, tipy - 1; cm = {}
    M = lambda k: (x0 + k, y0 - k)
    cm[M(-1)] = 'm' if wide == 3 else 'w'
    for k in range(Lb):
        mx, my = M(k)
        if wide == 3:
            cm[(mx, my)] = 'm'; cm[(mx + 1, my)] = 'M'
            if k < Lb - 1 or base_light: cm[(mx, my - 1)] = 'w'
        else:
            cm[(mx, my)] = 'w'; cm[(mx + 1, my)] = 'M'
    gx, gy = M(Lb)
    for j in range(-g, g + 1):
        cm[(gx + j, gy + j)] = 'y' if j < 1 else 'Y'
        cm[(gx + j + 1, gy + j)] = 'y' if j < 0 else 'Y'
    for i in range(Lg):
        cm[M(Lb + 1 + i)] = 'l' if i % 2 == 0 else 'L'
    px, py = M(Lb + 1 + Lg)
    if pom == 2:
        for (dx, dy), ch in (((0, 0), 'y'), ((1, 0), 'Y'), ((0, -1), 'y'), ((1, -1), 'y')): cm[(px + dx, py + dy)] = ch
    else: cm[(px, py)] = 'y'
    return cm
def crescent2(c1, r1, c2, r2):
    """두 원으로 만든 초승달: 바깥 원 안 & 안쪽 원 밖. {(x,y): 바깥 가장자리에서 안쪽으로 몇 칸(실수)}"""
    out = {}
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5, y + 0.5
            d1 = math.hypot(px - c1[0], py - c1[1]); d2 = math.hypot(px - c2[0], py - c2[1])
            if d1 <= r1 and d2 > r2: out[(x, y)] = (r1 - d1, d2 - r2)
    return out
def dsword_ur(tipx, tipy, Lb=6, Lg=2, g=1, base_light=False):
    """45° 칼 (칼끝 오른쪽 위, 자루 왼쪽 아래). 날 w m M (밝은 쪽 왼쪽 위)."""
    x0, y0 = tipx - 1, tipy + 1; cm = {}
    M = lambda k: (x0 - k, y0 + k)
    cm[M(-1)] = 'w'
    for k in range(Lb):
        mx, my = M(k)
        cm[(mx, my)] = 'm'; cm[(mx, my + 1)] = 'M'
        if k > 0 or base_light: cm[(mx - 1, my)] = 'w'
    gx, gy = M(Lb)
    for j in range(-g, g + 1):
        cm[(gx + j, gy + j)] = 'y' if j < 1 else 'Y'
        cm[(gx + j - 1, gy + j)] = 'y' if j < 0 else 'Y'
    for i in range(Lg):
        cm[M(Lb + 1 + i)] = 'l' if i % 2 == 0 else 'L'
    px, py = M(Lb + 1 + Lg)
    for (dx, dy), ch in (((0, 0), 'y'), ((-1, 0), 'y'), ((0, 1), 'Y'), ((-1, 1), 'Y')): cm[(px + dx, py + dy)] = ch
    return cm
