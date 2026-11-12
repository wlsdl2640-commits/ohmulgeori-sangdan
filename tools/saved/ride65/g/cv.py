"""빌드 56 시안 도구: 칸 판 + 도형 + 뭉툭 명암 + 장 맞추기 (빌드 55 G/GO · shp · blunt를 한데)"""
import math
from shp import ell, poly, path, box as _box, cap


def box(x0, y0, x1, y1):
    return _box(int(round(x0)), int(round(y0)), int(round(x1)), int(round(y1)))
from blunt import blunt


class Cv:
    def __init__(s, W, H): s.W, s.H = W, H; s.g = [['.'] * W for _ in range(H)]
    def inb(s, x, y): return 0 <= x < s.W and 0 <= y < s.H
    def get(s, x, y):
        x, y = int(round(x)), int(round(y)); return s.g[y][x] if s.inb(x, y) else '.'
    def set(s, x, y, ch):
        x, y = int(round(x)), int(round(y))
        if s.inb(x, y): s.g[y][x] = '.' if ch == '_' else ch
    def fill(s, cells, ch):
        for (x, y) in cells: s.set(x, y, ch)
    def under(s, cells, ch):
        """빈 칸에만 (몸 뒤에 그리기)"""
        for (x, y) in cells:
            if s.get(x, y) == '.': s.set(x, y, ch)
    def only(s, cells, ch, on):
        """on 글자 칸에만"""
        for (x, y) in cells:
            if s.get(x, y) in on: s.set(x, y, ch)
    def stamp(s, t, x0, y0, under=False):
        for j, r in enumerate(t.strip('\n').split('\n')):
            for i, ch in enumerate(r):
                if ch in '. ': continue
                if under and s.get(x0 + i, y0 + j) != '.': continue
                s.set(x0 + i, y0 + j, ch)
    def pts(s, lst, ch):
        for (x, y) in lst: s.set(x, y, ch)
    def copy(s):
        d = Cv(s.W, s.H); d.g = [r[:] for r in s.g]; return d
    def cells(s, chs):
        return {(x, y) for y in range(s.H) for x in range(s.W) if s.g[y][x] in chs}
    def move(s, box_, dx, dy):
        """box (x0, y0, x1, y1) 안 칸을 옮긴다"""
        x0, y0, x1, y1 = box_; cs = [(x, y, s.g[y][x]) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1) if s.inb(x, y) and s.g[y][x] != '.']
        for x, y, ch in cs: s.g[y][x] = '.'
        for x, y, ch in cs: s.set(x + dx, y + dy, ch)


def scallop(cells, A, B, inner, depth):
    """날개막 뒷가장자리 오목 자르기: A–B 줄을 inner(안쪽 점) 쪽으로 depth만큼 파낸다"""
    (ax, ay), (bx, by) = A, B; mx, my = (ax + bx) / 2, (ay + by) / 2; L = math.hypot(bx - ax, by - ay) or 1
    nx, ny = -(by - ay) / L, (bx - ax) / L
    if (inner[0] - mx) * nx + (inner[1] - my) * ny < 0: nx, ny = -nx, -ny   # n = 안쪽
    R = L / 2 / math.sin(math.radians(80)) if depth <= 0 else (L * L / 4 + depth * depth) / (2 * depth)
    cx, cy = mx + nx * (depth - R), my + ny * (depth - R)
    return {(x, y) for (x, y) in cells if math.hypot(x + 0.5 - cx, y + 0.5 - cy) >= R}


def wing(shoulder, wrist, tips, back, depth=1.2):
    """박쥐 날개막: 어깨 → 손목 → 손가락 끝들 → 몸에 붙는 자리. 끝 사이는 오목. 돌려주는 것 (막 칸, 뼈 줄 [(점, 점)])"""
    pts = [shoulder, wrist] + list(tips) + [back]
    m = poly(pts); edge = list(tips) + [back]
    for a, b in zip(edge, edge[1:]): m = scallop(m, a, b, wrist, depth)
    bones = [(shoulder, wrist)] + [(wrist, t) for t in tips]
    return m, bones


def bone_cells(bones, r=0.5):
    out = set()
    for a, b in bones: out |= path([a, b], r)
    return out


def frames(fs, pad_top=0, pad_bottom=0):
    """여러 장을 같은 틀로: 맨 위 빈 줄은 모두 같은 만큼 자르고, 모든 장 높이를 맞춘 뒤 아래에 빈 줄 pad_bottom (떠 있는 높이)"""
    gs = [f.g if isinstance(f, Cv) else f for f in fs]
    top = min(next((y for y, r in enumerate(g) if any(c != '.' for c in r)), len(g)) for g in gs); top = max(0, top - pad_top)
    bot = max(max((y for y, r in enumerate(g) if any(c != '.' for c in r)), default=0) for g in gs)
    out = []
    for g in gs:
        rs = [''.join(r).rstrip('.') or '.' for r in g[top:bot + 1]] + ['.'] * pad_bottom
        out.append('\n' + '\n'.join(rs) + '\n')
    return out, top


def overlay(base, alt):
    """gp 조각 그림: base와 alt가 다른 줄만 (같은 칸 '.' · 지움 '_')"""
    B = [list(r) for r in base.strip('\n').split('\n')]; A = [list(r) for r in alt.strip('\n').split('\n')]
    W = max(max(len(r) for r in B), max(len(r) for r in A)); H = max(len(B), len(A))
    B = [r + ['.'] * (W - len(r)) for r in B] + [['.'] * W] * (H - len(B)); A = [r + ['.'] * (W - len(r)) for r in A] + [['.'] * W] * (H - len(A))
    ys = [y for y in range(H) if B[y] != A[y]]
    if not ys: return None
    y0, y1 = min(ys), max(ys); rows = []
    for y in range(y0, y1 + 1):
        r = ''.join('.' if B[y][x] == A[y][x] else ('_' if A[y][x] == '.' else A[y][x]) for x in range(W))
        rows.append(r.rstrip('.') or '.')
    return {'y': y0, 'g': '\n' + '\n'.join(rows) + '\n'}


def show_txt(g):
    return '\n'.join(''.join(r) for r in (g.g if isinstance(g, Cv) else g))


def thin(a, b):
    """한 칸 굵기 곧은 줄 (끝 포함)"""
    (x0, y0), (x1, y1) = a, b; n = int(max(abs(x1 - x0), abs(y1 - y0)) * 1.0 + 0.999) or 1
    return {(int(round(x0 + (x1 - x0) * i / n - 0.0)), int(round(y0 + (y1 - y0) * i / n))) for i in range(n + 1)}


def thins(pts):
    out = set()
    for a, b in zip(pts, pts[1:]): out |= thin(a, b)
    return out


def rbox(x0, y0, x1, y1, r):
    """둥근 네모 (모서리 반지름 r)"""
    out = set()
    for y in range(int(y0), int(y1) + 1):
        for x in range(int(x0), int(x1) + 1):
            cx = min(max(x + 0.5, x0 + r), x1 + 1 - r); cy = min(max(y + 0.5, y0 + r), y1 + 1 - r)
            if (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r + 1e-9: out.add((x, y))
    return out


def hem(cells, y, xs, r=1.0):
    """아랫단 오목 자르기: y줄 아래 끝을 xs 자리마다 반원으로 파낸다"""
    out = set(cells)
    for x0 in xs:
        out = {(x, yy) for (x, yy) in out if not ((x + 0.5 - x0) ** 2 + (yy + 0.5 - (y + 1)) ** 2 < r * r)}
    return out
