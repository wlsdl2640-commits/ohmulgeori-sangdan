"""화살 (3판). 사용자: "화살을 더 얇고 가늘게, 화살깃을 더 길게" (2판은 arrows_v2.py).
가는 촉(미늘 달린 3칸 폭) · 1칸 자루 · 긴 깃(5칸, 흰 띠, 끝이 젖혀짐) · 오늬.
arrow(방향, 촉끝 x, 촉끝 y, 자루 길이) → {(x,y): 글자}. 방향: r l u d ur ul dr dl"""
AP = {'w': ('#ffffff', 5), 'm': ('#d4dcea', 5), 'M': ('#7a849a', 5), 't': ('#e8b878', 3), 'T': ('#9a6a34', 3),
      'r': ('#ff5a4a', 13), 'R': ('#a82a22', 13), 'f': ('#fff4ec', 7)}
def _cell_ur(s, o):
    # o와 2s의 홀짝이 같아야 칸이 된다
    x2, y2 = o - 2 * s, o + 2 * s
    if abs(x2 - round(x2)) > 1e-6 or round(x2) % 2: return None
    return (int(round(x2)) // 2, int(round(y2)) // 2)
def _ur(L, F, barbs, small):
    out = {}
    def put(s, o, c):
        q = _cell_ur(s, o)
        if q is not None: out.setdefault(q, c)
    # 촉
    put(0, 0, 'w'); put(0.5, -1, 'm'); put(0.5, 1, 'M')
    hl = 1 if small else 2
    for s2 in range(2, 2 * hl + 1):
        s = s2 / 2
        if s2 % 2 == 0: put(s, 0, 'm')
        else: put(s, -1, 'm'); put(s, 1, 'M')
    if barbs: put(hl, -2, 'm'); put(hl, 2, 'M')
    # 자루
    s0 = hl + (0 if small else 0)
    for k in range(1, L + 1): put(s0 + k, 0, 't')
    # 깃: 자루 끝 쪽 F칸, 양옆 줄 (o=±1), 끝 2칸은 바깥 줄(o=±2)까지 젖힘
    sf = s0 + L
    for k in range(1, F + 1):
        s = sf + k
        put(s, 0, 't')
        put(s - 0.5, -1, 'f' if k == 2 else 'r'); put(s - 0.5, 1, 'f' if k == 2 else 'R')
        if k == F: put(s, -2, 'r'); put(s, 2, 'R')
    put(sf + F + 1, 0, 'T')
    return out
def _r(L, F, small):
    out = {}
    # 촉 (높이 3)
    head = [(0, 0, 'w'), (-1, 0, 'm'), (-2, 0, 'm'), (-2, -1, 'm'), (-2, 1, 'M')]
    if not small: head += [(-3, -1, 'm'), (-3, 1, 'M'), (-3, 0, 'M')]
    for x, y, c in head: out[(x, y)] = c
    hx = -3 if small else -4
    for i in range(L): out[(hx - i, 0)] = 't'
    sx = hx - L
    for i in range(F):
        x = sx - i; out[(x, 0)] = 't'
        out[(x, -1)] = 'f' if i == 1 else 'r'; out[(x, 1)] = 'f' if i == 1 else 'R'
        if i == F - 1: out[(x, -2)] = 'r'; out[(x, 2)] = 'R'
    out[(sx - F, 0)] = 'T'
    return out
SW = {'m': 'M', 'M': 'm', 'r': 'R', 'R': 'r'}
def _place(base, d, tx, ty, diag):
    if not diag:
        if d == 'r': pts = [(x, y, c) for (x, y), c in base.items()]
        elif d == 'l': pts = [(-x, y, c) for (x, y), c in base.items()]
        elif d == 'd': pts = [(-y, x, SW.get(c, c)) for (x, y), c in base.items()]
        else: pts = [(y, -x, c) for (x, y), c in base.items()]
    else:
        if d == 'ur': pts = [(x, y, c) for (x, y), c in base.items()]
        elif d == 'ul': pts = [(-x, y, c) for (x, y), c in base.items()]
        elif d == 'dl': pts = [(-x, -y, SW.get(c, c)) for (x, y), c in base.items()]
        else: pts = [(x, -y, SW.get(c, c)) for (x, y), c in base.items()]
    return {(tx + x, ty + y): c for x, y, c in pts}
def arrow(d, tx, ty, L=6, F=5, barbs=True):
    diag = d not in ('r', 'l', 'u', 'd')
    base = _ur(L, F, barbs, False) if diag else _r(L, F, False)
    return _place(base, d, tx, ty, diag)
def arrow_s(d, tx, ty, L=3, F=3):
    diag = d not in ('r', 'l', 'u', 'd')
    base = _ur(L, F, True, True) if diag else _r(L, F, True)
    return _place(base, d, tx, ty, diag)
def recol(cm, m): return {k: m.get(v, v) for k, v in cm.items()}
# 자주 쓰는 색 바꾸기
GREEN_HEAD = {'w': 'g', 'm': 'g', 'M': 'G'}
GOLD_ALL = {'w': 'h', 'm': 'y', 'M': 'Y', 't': 'y', 'T': 'Y', 'r': 'h', 'R': 'y', 'f': 'w'}
GOLDP = {'h': ('#fff6c8', 6), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'w': ('#ffffff', 7)}
def ar(a, d, tx, ty, L=4, m=None, pal=None, glow_c=None, small=False):
    """화살 놓기 (테두리 + B4 손질)"""
    from lib import sp, grid
    cm = (arrow_s if small else arrow)(d, tx, ty, L)
    if m: cm = recol(cm, m)
    pp = dict(AP); pp.update(pal or {})
    sp(a, grid(cm), pp, glow_c=glow_c)
# ── 아주 작은 화살 (사용자: "화살은 크기를 좀더 줄여서") ──
def _xs_ur(L, F):
    out = {}
    def put(s, o, c):
        q = _cell_ur(s, o)
        if q is not None: out.setdefault(q, c)
    put(0, 0, 'w'); put(0.5, -1, 'm'); put(0.5, 1, 'M')
    for k in range(1, L + 1): put(k, 0, 't')
    for k in range(1, F + 1):
        s = L + k; put(s, 0, 't'); put(s - 0.5, -1, 'r'); put(s - 0.5, 1, 'R')
    put(L + F + 1, 0, 'T')
    return out
def _xs_r(L, F):
    out = {(0, 0): 'w', (-1, 0): 'm', (-1, -1): 'm', (-1, 1): 'M'}
    for i in range(L): out[(-2 - i, 0)] = 't'
    sx = -2 - L
    for i in range(F): out[(sx - i, 0)] = 't'; out[(sx - i, -1)] = 'r'; out[(sx - i, 1)] = 'R'
    out[(sx - F, 0)] = 'T'
    return out
def arrow_xs(d, tx, ty, L=2, F=2):
    diag = d not in ('r', 'l', 'u', 'd')
    return _place(_xs_ur(L, F) if diag else _xs_r(L, F), d, tx, ty, diag)
def arx(a, d, tx, ty, L=2, m=None, pal=None, glow_c=None, F=2):
    """아주 작은 화살 놓기"""
    from lib import sp, grid
    cm = arrow_xs(d, tx, ty, L, F)
    if m: cm = recol(cm, m)
    pp = dict(AP); pp.update(pal or {})
    sp(a, grid(cm), pp, glow_c=glow_c)
