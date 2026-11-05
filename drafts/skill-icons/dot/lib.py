"""스킬 아이콘 부품 모음 (뭉툭 도트, 16×20칸 판).
배경 색띠 · 효과(번쩍·별·속도 줄·고리) · 손그림 상징 · 만들어 그리는 부품(화살·번개·구슬·불꽃·물방울 …)."""
import math
import cell
from cell import Art, radial, mix, W, H
from w5 import slash, crescent, flash, rays_bg, ring, pips
from cell import crescent2
# ── 배경 색띠 (어둠 → 밝음 6단) ──
R = {
 'fire':   ['#1a0304', '#3a0806', '#621208', '#8e1e0c', '#b8300e', '#e05a18'],
 'ember':  ['#1e0604', '#481006', '#7a1e08', '#ae360c', '#dc5a14', '#ff8a2a'],
 'blood':  ['#1a0204', '#3a0606', '#640c0a', '#921a10', '#c43418', '#f06a30'],
 'amber':  ['#1e0a02', '#4a1c04', '#7a3206', '#a8500c', '#d07818', '#f0a030'],
 'warm':   ['#2a1002', '#5a2606', '#8e440c', '#c06a16', '#e8962c', '#ffc858'],
 'sand':   ['#2a1404', '#5a2e08', '#8e4e10', '#c0781e', '#e8a238', '#ffd070'],
 'earth':  ['#1e0e04', '#3e2008', '#64360e', '#8e5216', '#b8742a', '#e09c48'],
 'gold':   ['#2a1602', '#5a3406', '#8e5a0c', '#c08a18', '#e8b830', '#fff0a0'],
 'holy':   ['#2a1e06', '#5a440e', '#8e6e1a', '#c49a2c', '#ecc650', '#fff4b8'],
 'sky':    ['#060c2a', '#0e1e5a', '#18388e', '#2a62c4', '#4a94ec', '#9ad4ff'],
 'ice':    ['#04122a', '#0a2652', '#12447e', '#1e6aac', '#3a9ad4', '#8ad8f4'],
 'water':  ['#02102a', '#062656', '#0c4486', '#1468b4', '#2e94dc', '#7ccaf4'],
 'steelb': ['#06102a', '#0e2050', '#183680', '#2652b0', '#3c78d8', '#70a8f4'],
 'royal':  ['#0a0626', '#1a1052', '#2a1e84', '#3c34b4', '#5a5ad8', '#8a8cf4'],
 'arcane': ['#0a0630', '#1a0c5a', '#2e188e', '#4a2cc0', '#7050e4', '#a890ff'],
 'purple': ['#10041e', '#24083e', '#3e1066', '#5e1e8e', '#8434b4', '#b464dc'],
 'dark':   ['#08040e', '#160a24', '#26123c', '#3a1a58', '#562878', '#7a3aa0'],
 'evil':   ['#120206', '#2a0610', '#480a1e', '#6e1230', '#9a1e44', '#c8325e'],
 'night':  ['#04040e', '#0a0a22', '#121438', '#1c2052', '#2a3070', '#404894'],
 'shadow': ['#06060c', '#12121e', '#1e1e32', '#2c2c48', '#3e3e60', '#56567c'],
 'green':  ['#04180c', '#0a3018', '#124a24', '#1c6a34', '#2e8e48', '#56b868'],
 'heal':   ['#04180a', '#0a3214', '#125020', '#1e7430', '#349a46', '#64c66a'],
 'poison': ['#0a1404', '#182a06', '#2a440a', '#3e6210', '#58861a', '#80b028'],
 'wind':   ['#03180e', '#08301c', '#0e4c2c', '#186c3e', '#2a9052', '#54ba74'],
 'teal':   ['#031a1e', '#08323a', '#0e4e58', '#167078', '#26989c', '#5ac8c4'],
 'storm':  ['#04121a', '#0a2434', '#103a50', '#18546e', '#24728e', '#4a9cb4'],
 'thunder':['#0e0820', '#1e1240', '#30206a', '#463496', '#6248c0', '#8a6ce6'],
 'pink':   ['#1e0418', '#3e0a32', '#62124e', '#8a1e6c', '#b4308c', '#e054b0'],
 'rose':   ['#200610', '#40101e', '#661a30', '#902848', '#ba3c62', '#e86488'],
 'stone':  ['#0e0e10', '#1e1e22', '#303036', '#46464e', '#60606a', '#80808c'],
 'dawn':   ['#0a0626', '#1c1050', '#3a2278', '#7a4a7a', '#c88a4a', '#ffd070'],
}
CUTS = [0.0, 0.2, 0.42, 0.64, 0.86]
def bg(a, theme, cx=7.5, cy=9.5, r=11.0, cuts=None, rays=0, rot=0.0, k=0.45, w=0.5, hole=3.0):
    rp = R[theme]; cu = cuts or CUTS
    if rays: a.bg(rays_bg(rp, cx, cy, r, cu, rays, rp[0], rot=rot, w=w, k=k, hole=hole))
    else: a.bg(radial(rp, cx, cy, r, cu))
    return a
# ── 효과 ──
WH = '#ffffff'; PALE = '#fff4c0'; YEL = '#ffd860'
def dot(a, pts, c=WH):
    for (x, y) in pts: a.set(x, y, c)
def plus(a, x, y, c=WH, c2=PALE):
    a.set(x, y, c)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)): a.set(x + dx, y + dy, c2)
def star5(a, x, y, c=WH, c2=PALE, c3=YEL):
    a.set(x, y, c)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)): a.set(x + dx, y + dy, c2)
    for dx, dy in ((2, 0), (-2, 0), (0, 2), (0, -2)): a.set(x + dx, y + dy, c3)
def burst(a, x, y, big=True, cols=('#ffffff', '#fff0a0', '#ffc040')):
    if big:
        a.paint(['....y....', '...yhy...', '.yyhwhyy.', 'yhhwwwhhy', '.yyhwhyy.', '...yhy...', '....y....'],
                {'y': cols[2], 'h': cols[1], 'w': cols[0]}, ox=x - 4, oy=y - 3)
    else:
        a.paint(['..y..', '.yhy.', 'yhwhy', '.yhy.', '..y..'], {'y': cols[2], 'h': cols[1], 'w': cols[0]}, ox=x - 2, oy=y - 2)
def line(a, x0, y0, x1, y1, c, c_end=None):
    n = max(abs(x1 - x0), abs(y1 - y0))
    for i in range(n + 1):
        t = i / n if n else 0; a.set(round(x0 + (x1 - x0) * t), round(y0 + (y1 - y0) * t), c_end if (c_end and i == n) else c)
def speed(a, segs, c='#ffffff', c2=None):
    """속도 줄: [(x0,y0,x1,y1)...] 끝(x1,y1) 쪽이 밝다"""
    for (x0, y0, x1, y1) in segs: line(a, x0, y0, x1, y1, c2 or mix(c, '#000000', 0.25), c)
def arcs(a, cx, cy, radii, spans, cols, w=0.55):
    for r_, c in zip(radii, cols): ring(a, cx, cy, r_, spans, c, w=w)
def disc(a, cx, cy, r, c):
    for y in range(H):
        for x in range(W):
            if math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r: a.set(x, y, c)
def glow(a, cx, cy, r, cols):
    """여러 겹 둥근 빛 (바깥 → 안)"""
    n = len(cols)
    for i, c in enumerate(cols): disc(a, cx, cy, r * (1 - i / n), c)
# ── 상징 놓기 ──
def blank(): return [['.'] * W for _ in range(H)]
def rows(g): return [''.join(r) for r in g]
def put(g, x, y, ch):
    if 0 <= x < W and 0 <= y < H: g[y][x] = ch
def grid(cm):
    g = blank()
    for (x, y), ch in cm.items(): put(g, x, y, ch)
    return rows(g)
def flip(rows_, swap=None):
    sw = swap or {}
    w = max(len(r) for r in rows_)
    return [''.join(sw.get(c, c) for c in r.ljust(w, '.')[::-1]) for r in rows_]
def vflip(rows_): return list(reversed(rows_))
def rot90(rows_):
    """시계 방향 90° (위 → 오른쪽)"""
    w = max(len(r) for r in rows_); rr = [r.ljust(w, '.') for r in rows_]
    return [''.join(rr[len(rr) - 1 - j][i] for j in range(len(rr))) for i in range(w)]
def sp(a, spr, x=0, y=0, pal=None, glow_c=None, fx=True):
    """손그림 상징 놓기: spr = (줄들, 팔레트) 또는 줄들"""
    if isinstance(x, dict): pal, x = x, 0
    if isinstance(spr, tuple): rws, p = spr
    else: rws, p = spr, {}
    pp = dict(p); pp.update(pal or {})
    a.sym(rws, pp, ox=x, oy=y, glow=glow_c, fx=fx)
    return a
def fl(a, spr, x=0, y=0, pal=None):
    """테두리 없이 평평하게 (효과용 손그림)"""
    rws, p = spr if isinstance(spr, tuple) else (spr, {})
    pp = {k: (v[0] if isinstance(v, tuple) else v) for k, v in p.items()}; pp.update(pal or {})
    a.paint(rws, pp, ox=x, oy=y)
    return a
# ── 만들어 그리는 부품 ──
def arrow_ur(tx, ty, L=6, head='m', shaft='t', fl_='r'):
    """오른쪽 위를 가리키는 45° 화살 (칸 사전). tx,ty = 화살촉 끝"""
    cm = {(tx, ty): 'w', (tx - 1, ty): head, (tx, ty + 1): head, (tx - 1, ty + 1): 'M', (tx - 2, ty): head, (tx, ty + 2): 'M'}
    for i in range(1, L + 1): cm[(tx - 1 - i, ty + 1 + i)] = shaft
    fx, fy = tx - 1 - L, ty + 1 + L
    for (dx, dy) in ((-1, 0), (0, 1), (-1, -1), (1, 1)): cm[(fx + dx, fy + dy)] = fl_
    cm[(fx - 1, fy + 1)] = 'R'
    return cm
def arrow_dn(x, ty, L=5, head='m', shaft='t', fl_='r'):
    """아래를 가리키는 화살. (x,ty) = 끝"""
    cm = {(x, ty): 'w', (x - 1, ty - 1): head, (x, ty - 1): head, (x + 1, ty - 1): 'M'}
    for i in range(2, L + 2): cm[(x, ty - i)] = shaft
    top = ty - L - 1
    for (dx, dy) in ((-1, 0), (1, 0), (-1, -1), (1, -1)): cm[(x + dx, top + dy)] = fl_
    return cm
def arrow_r(tx, y, L=7, head='m', shaft='t', fl_='r'):
    """오른쪽을 가리키는 화살"""
    cm = {(tx, y): 'w', (tx - 1, y - 1): head, (tx - 1, y): head, (tx - 1, y + 1): 'M'}
    for i in range(2, L + 2): cm[(tx - i, y)] = shaft
    t = tx - L - 1
    for (dx, dy) in ((0, -1), (0, 1), (-1, -1), (-1, 1)): cm[(t + dx, y + dy)] = fl_
    return cm
def rot_cm(cm, k):
    """칸 사전 90°×k 돌리기 (판 가운데 7.5, 9.5 기준이 아니라 16×20 판 그대로: 위아래·좌우 뒤집기 조합)"""
    out = {}
    for (x, y), ch in cm.items():
        if k == 1: out[(15 - x, y)] = ch          # 좌우
        elif k == 2: out[(x, 19 - y)] = ch        # 위아래
        elif k == 3: out[(15 - x, 19 - y)] = ch   # 둘 다
        else: out[(x, y)] = ch
    return out
def merge(*cms):
    out = {}
    for c in cms: out.update(c)
    return out
def orb(cx, cy, r, letters='123'):
    """빛나는 구슬: 왼쪽 위 밝음(1) → 가운데(2) → 오른쪽 아래 어둠(3) + 반짝 'w'"""
    cm = {}
    for y in range(H):
        for x in range(W):
            dx, dy = x + 0.5 - cx, y + 0.5 - cy; d = math.hypot(dx, dy)
            if d <= r:
                s = (dx + dy) / (r * 1.41)
                cm[(x, y)] = letters[0] if s < -0.3 else letters[2] if s > 0.35 else letters[1]
    hx, hy = int(cx - r * 0.45), int(cy - r * 0.45)
    cm[(hx, hy)] = 'w'
    return cm
def ellipse(cx, cy, rx, ry, ch):
    return {(x, y): ch for y in range(H) for x in range(W) if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1}
def poly_cells(pts, ch):
    """다각형 안 칸 (칸 가운데로 판정)"""
    out = {}
    n = len(pts)
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5, y + 0.5; inside = False; j = n - 1
            for i in range(n):
                xi, yi = pts[i]; xj, yj = pts[j]
                if (yi > py) != (yj > py) and px < (xj - xi) * (py - yi) / (yj - yi + 1e-9) + xi: inside = not inside
                j = i
            if inside: out[(x, y)] = ch
    return out
def bolt(pts, w=1, core='w', edge='y'):
    """번개: 꺾인 줄. w=1 → 가운데 흰 줄 + 양옆 노랑"""
    cm = {}
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(abs(x1 - x0), abs(y1 - y0), 1)
        for i in range(n + 1):
            x, y = round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n)
            cm[(x, y)] = core
            if w:
                for dx in (-1, 1):
                    if (x + dx, y) not in cm: cm[(x + dx, y)] = edge
    for (x, y), c in list(cm.items()):
        pass
    return cm
def paint_cm(a, cm, pal):
    for (x, y), ch in cm.items():
        if ch in pal: a.set(x, y, pal[ch])
def target(cx, cy, r, rings='1213'):
    """과녁: 바깥부터 rings 글자 (기본 빨강·흰·빨강·금)"""
    cm = {}
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            if d <= r:
                k = min(len(rings) - 1, int((r - d) / (r / len(rings))))
                cm[(x, y)] = rings[k]
    return cm
TGT = {'1': ('#e83a3a', 13), '2': ('#f4f0e8', 7), '3': ('#ffd84a', 6)}
def rot180(rows_, swap=None):
    sw = swap or {}
    w = max(len(r) for r in rows_)
    return [''.join(sw.get(c, c) for c in r.ljust(w, '.')[::-1]) for r in reversed(rows_)]
def shift(cm, dx, dy): return {(x + dx, y + dy): c for (x, y), c in cm.items()}
def recolor(cm, m): return {k: m.get(v, v) for k, v in cm.items()}
def cloud(circles, ch='1', ch2='2'):
    """뭉게구름: [(cx,cy,r)...] 합. 아래쪽은 ch2(그늘)"""
    cm = {}
    ys = [c[1] for c in circles]; base = max(ys)
    for y in range(H):
        for x in range(W):
            for (cx, cy, r) in circles:
                if math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r:
                    cm[(x, y)] = ch2 if y + 0.5 > base + 0.2 else ch; break
    return cm
def spike(tip, base, w, light='a', dark='A', ridge='w'):
    """뾰족한 결정 창: base(밑)에서 tip(끝)까지 가늘어짐"""
    cm = {}; L = math.hypot(tip[0] - base[0], tip[1] - base[1])
    ux, uy = (tip[0] - base[0]) / L, (tip[1] - base[1]) / L; nx, ny = -uy, ux
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5 - base[0], y + 0.5 - base[1]; u = px * ux + py * uy; v = px * nx + py * ny
            if 0 <= u <= L:
                r = w * (1 - u / L) + 0.3
                if abs(v) <= r:
                    side = v if (nx + ny) < 0 else -v
                    cm[(x, y)] = ridge if abs(v) < 0.35 and u > L * 0.15 else (light if side > 0 else dark)
    return cm
def cross_cm(cx, cy, arm, th, l1='1', l2='2'):
    cm = {}
    for y in range(H):
        for x in range(W):
            dx, dy = x + 0.5 - cx, y + 0.5 - cy
            if (abs(dx) <= th / 2 and abs(dy) <= arm) or (abs(dy) <= th / 2 and abs(dx) <= arm):
                cm[(x, y)] = l2 if (dx > th / 2 - 0.6 and abs(dy) <= th / 2) or (dy > th / 2 - 0.6 and abs(dx) <= th / 2) or dx + dy > th * 0.9 else l1
    return cm
def star_poly(cx, cy, ro, ri, n=5, rot=-90):
    pts = []
    for i in range(n * 2):
        ang = math.radians(rot + 180 * i / n); r = ro if i % 2 == 0 else ri
        pts.append((cx + math.cos(ang) * r, cy + math.sin(ang) * r))
    return pts
def hex_ring(cx, cy, r, w=0.6):
    pts = [(cx + r * math.cos(math.radians(90 + 60 * i)), cy + r * math.sin(math.radians(90 + 60 * i))) for i in range(6)]
    out = set()
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5, y + 0.5
            for i in range(6):
                (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % 6]
                vx, vy = x1 - x0, y1 - y0; t = max(0, min(1, ((px - x0) * vx + (py - y0) * vy) / (vx * vx + vy * vy)))
                if math.hypot(px - x0 - vx * t, py - y0 - vy * t) <= w: out.add((x, y)); break
    return out
def tail(a, x0, y0, x1, y1, w0, w1, cols):
    """꼬리 (불꼬리·빛꼬리): (x0,y0) 굵기 w0 → (x1,y1) 굵기 w1, 가운데일수록 cols 앞쪽 색"""
    L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5 - x0, y + 0.5 - y0; u = px * ux + py * uy; v = abs(-px * uy + py * ux)
            if 0 <= u <= L:
                r = w0 + (w1 - w0) * u / L
                if v <= r:
                    k = min(len(cols) - 1, int(v / max(r, 0.01) * len(cols) * 0.999 + (u / L) * 1.2))
                    a.set(x, y, cols[min(k, len(cols) - 1)])
def ring_cells(cx, cy, rx, ry, w=0.55):
    """타원 고리 칸"""
    out = []
    for y in range(H):
        for x in range(W):
            d = math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry)
            if abs(d - 1) * min(rx, ry) <= w: out.append((x, y))
    return out
