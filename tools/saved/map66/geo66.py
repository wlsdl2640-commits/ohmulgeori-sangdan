"""빌드 66 지도 시안 — 같은 땅 모양(geo)을 두 그림 방식(A 양피지 고지도 · B 도트 지형)으로 그린다.
게임 지도는 240×240 논리 픽셀(두 배로 늘려 480×480), 노드 단추 자리(MAP_NODES · MAP_KINGS · MAP_ORGS)는 그대로."""
import numpy as np
from scipy import ndimage as ndi

W = H = 240
NODES = dict(plains=(84, 116), forest=(44, 76), mountain=(122, 58), valley=(176, 94), snow=(204, 40), desert=(206, 150),
             alley=(92, 164), sewer=(150, 176), swamp=(44, 222), barren=(122, 224), castle=(200, 222),
             grave=(34, 112), volcano=(158, 22), roots=(76, 34))
KINGS = dict(inglisia=(22, 134), frama=(58, 186), elves=(24, 48), dwarves=(128, 26), sarak=(226, 178))
KCOL = dict(inglisia=('#3f6aa8', '#e8c060'), frama=('#a8432f', '#f4f0e0'), elves=('#3f8a4a', '#e8f0c0'), dwarves=('#7a5a3a', '#e87a3a'), sarak=('#c08a3a', '#3a6aa8'))
CITY = (120, 148)
GUILD = (150, 192)
YY, XX = np.mgrid[0:H, 0:W].astype(float)


def hx(c):
    c = c.lstrip('#'); return np.array([int(c[i:i + 2], 16) for i in (0, 2, 4)], float)


def vnoise(scale, seed, w=W, h=H):
    """값 잡음 0..1 (부드러운 보간)"""
    r = np.random.default_rng(seed)
    gw, gh = int(w / scale) + 3, int(h / scale) + 3
    G = r.random((gh, gw))
    x = XX[:h, :w] / scale; y = YY[:h, :w] / scale
    x0 = np.floor(x).astype(int); y0 = np.floor(y).astype(int)
    fx = x - x0; fy = y - y0
    sx = fx * fx * (3 - 2 * fx); sy = fy * fy * (3 - 2 * fy)
    a = G[y0, x0]; b = G[y0, x0 + 1]; c = G[y0 + 1, x0]; d = G[y0 + 1, x0 + 1]
    return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy


def fbm(seed, octs=((24, 0.5), (12, 0.3), (6, 0.2))):
    return sum(vnoise(s, seed + i * 17) * a for i, (s, a) in enumerate(octs))


def blob(cx, cy, rx, ry, seed, amp=0.35, sc=10):
    n = fbm(seed, ((sc * 2, 0.6), (sc, 0.4)))
    return ((XX - cx) / rx) ** 2 + ((YY - cy) / ry) ** 2 + (n - 0.5) * 2 * amp < 1


def disk(cx, cy, r):
    return (XX - cx) ** 2 + (YY - cy) ** 2 <= r * r


def catmull(pts, n=12):
    """점들을 지나는 매끈한 선 → 정수 칸 목록"""
    P = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = [np.array(v, float) for v in P[i - 1:i + 3]]
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t * t, t * t * t
            q = 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
            out.append(q)
    out.append(np.array(pts[-1], float))
    cells, last = [], None
    for a, b in zip(out[:-1], out[1:]):
        m = int(max(abs(b[0] - a[0]), abs(b[1] - a[1]))) + 1
        for k in range(m):
            q = a + (b - a) * k / m
            c = (int(round(q[0])), int(round(q[1])))
            if c != last: cells.append(c); last = c
    return cells


def bend(a, b, k, seed):
    """두 점 사이 살짝 굽은 길 (가운데 점을 옆으로)"""
    r = np.random.default_rng(seed)
    ax, ay = a; bx, by = b
    mx, my = (ax + bx) / 2, (ay + by) / 2
    dx, dy = bx - ax, by - ay
    L = max(1, (dx * dx + dy * dy) ** 0.5)
    o = (r.random() - 0.5) * 2 * k * L
    return [a, (mx - dy / L * o, my + dx / L * o), b]


# ─── 땅 모양 ───
RIDGE = np.array([204 + 2.2 * np.sin(x * 0.23) + 1.6 * np.sin(x * 0.61 + 1.3) + (2 if 82 <= x <= 96 else 0) for x in range(W)])   # 마계 경계 (82~96은 고갯길)
DEMON = YY >= RIDGE[None, :].repeat(H, 0)
SEA = (blob(14, 186, 76, 38, 3, 0.18, 14) | ((XX < 4) & (YY > 154))) & ~DEMON
FRAMA_I = blob(58, 186, 12, 7.5, 9, 0.2, 5)
ISLET = blob(30, 196, 5, 3, 12, 0.2, 3)
SEA &= ~(FRAMA_I | ISLET)
LAND = ~SEA & ~DEMON

FOREST = (blob(46, 78, 44, 30, 21, 0.3, 10) | blob(22, 52, 26, 22, 22, 0.3, 8) | blob(64, 50, 18, 12, 23, 0.3, 6)) & LAND
FOREST &= ~disk(24, 47, 9) & ~disk(76, 34, 13) & ~blob(34, 112, 22, 15, 31, 0.25, 6)
GRAVE = blob(34, 112, 21, 14, 31, 0.25, 6) & LAND
MOUNT = blob(120, 52, 50, 26, 41, 0.3, 10) & LAND & ~disk(158, 20, 16) & ~disk(76, 34, 15)
VOLC = disk(158, 20, 15)
SNOW = (blob(212, 34, 44, 38, 51, 0.3, 10) | ((XX > 200) & (YY < 20))) & LAND
MOUNT &= ~SNOW
CANYON = blob(178, 94, 34, 19, 61, 0.25, 8) & LAND & ~SNOW
DESERT = (blob(212, 156, 46, 44, 71, 0.3, 10) | ((XX > 205) & (YY > 150))) & LAND & ~CANYON
TREE_ROOT = disk(76, 34, 15)

RIVER1 = catmull([(114, 70), (108, 84), (101, 98), (103, 112), (106, 128), (100, 143), (88, 155), (76, 166)])
RIVER2 = catmull([(192, 64), (183, 80), (174, 94), (181, 106), (204, 113), (240, 117)])

ROADS = [
    (CITY, NODES['plains'], 0.12), (NODES['plains'], NODES['forest'], 0.15), (NODES['plains'], NODES['mountain'], 0.1), (NODES['mountain'], NODES['valley'], 0.12),
    (NODES['valley'], NODES['snow'], 0.1), (CITY, NODES['desert'], 0.08), (CITY, NODES['alley'], 0.1), (CITY, NODES['sewer'], 0.1),
    (NODES['plains'], KINGS['inglisia'], 0.1), (NODES['forest'], KINGS['elves'], 0.1), (NODES['mountain'], KINGS['dwarves'], 0.08), (NODES['desert'], KINGS['sarak'], 0.1),
    (NODES['plains'], NODES['grave'], 0.1), (NODES['mountain'], NODES['volcano'], 0.1), (NODES['forest'], NODES['roots'], 0.12),
    (CITY, (100, 168), 0.0), ((100, 168), (84, 178), 0.0),   # 프라마로 가는 길 → 다리
    (NODES['alley'], (96, 190), 0.05), ((96, 190), (89, 207), 0.0), ((89, 207), (60, 217), 0.1), ((60, 217), NODES['swamp'], 0.0),
    (NODES['swamp'], NODES['barren'], 0.06), (NODES['barren'], NODES['castle'], 0.06), (NODES['sewer'], GUILD, 0.0),
]
FRAMA_BRIDGE = catmull([(84, 178), (75, 182), (68, 184)])


def road_cells():
    out = []
    for i, (a, b, k) in enumerate(ROADS):
        out.append(catmull(bend(a, b, k, 100 + i), 10))
    return out


def dist_out(mask):
    """mask 밖 칸이 mask에서 얼마나 떨어졌나"""
    return ndi.distance_transform_edt(~mask)


def keep_clear():
    """노드 단추 · 이름이 얹히는 자리 (장식을 안 둔다)"""
    m = np.zeros((H, W), bool)
    for (x, y) in list(NODES.values()):
        m |= (np.abs(XX - x) <= 8) & (YY >= y - 7) & (YY <= y + 13)
    for (x, y) in KINGS.values():
        m |= (np.abs(XX - x) <= 8) & (YY >= y + 2) & (YY <= y + 24)
    return m
