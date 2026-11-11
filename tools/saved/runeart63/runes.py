"""룬 그림 시안 (빌드 63, 11-11 11:10 사용자: 「공격, 시간 등 룬마다 다른 형태, 문양 시안.」)
20×20 도트. 룬 17종마다 돌 모양 · 문양이 다르고, 하급 · 중급 · 상급은 재질로 가른다.
  하급 = 거친 돌 · 흐린 새김 · 깨진 모서리 / 중급 = 매끈한 돌 · 은 테 · 또렷한 색 / 상급 = 룬 색 수정 · 금 테 · 빛나는 문양 + 반짝이(도트)
게임에는 아직 넣지 않는다 (사용자가 고른 뒤 적용)."""
import math

W = H = 20
CX, CY = 9.5, 9.5
K = (26, 20, 16)


def hx(s):
    s = s.lstrip('#'); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def lt(c, t): return mix(c, (255, 255, 255), t)
def dk(c, t): return mix(c, (0, 0, 0), t)


def poly(pts):
    def inside(x, y):
        c = False; n = len(pts)
        for i in range(n):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % n]
            if (y0 > y) != (y1 > y) and x < x0 + (x1 - x0) * (y - y0) / (y1 - y0): c = not c
        return c
    return inside


def ell(rx, ry, oy=0):
    return lambda x, y: (x / rx) ** 2 + ((y - oy) / ry) ** 2 <= 1


def heart(x, y):
    if y < 0.5:
        return (x - 3.6) ** 2 + (y + 1.6) ** 2 <= 17.5 or (x + 3.6) ** 2 + (y + 1.6) ** 2 <= 17.5 or (abs(x) < 3.6 and y > -2)
    return abs(x) <= 7.6 * (1 - (y - 0.5) / 8.2)


def cog(x, y):
    r = math.hypot(x, y); a = math.atan2(y, x)
    if r <= 6.4: return True
    return r <= 8.4 and math.cos(a * 8) > 0.35


def shield(x, y):
    if y < -7.5 or abs(x) > 7.5: return False
    if y <= 1: return not (abs(x) > 6.5 and y < -6.5)
    return abs(x) <= 7.5 * (1 - (y - 1) / 7.8)


def tablet(x, y):
    if abs(x) > 6.2 or abs(y) > 8.4: return False
    return not (abs(x) > 4.6 and abs(y) > 6.8 and (abs(x) - 4.6) ** 2 + (abs(y) - 6.8) ** 2 > 2.6)


SHAPES = {
    'str': poly([(-5.5, -7.8), (5.5, -7.8), (8.6, 5.5), (6.5, 8.6), (-6.5, 8.6), (-8.6, 5.5)]),       # 무거운 바위 (아래가 넓은)
    'vit': ell(8.1, 8.1),                                                                            # 둥근 조약돌
    'agi': lambda x, y: (x ** 2 + (y - 2) ** 2 <= 6.6 ** 2) or (y < 2 and abs(x) <= (y + 8.8) * 0.61),   # 물방울 (위가 뾰족)
    'int': poly([(-8.6, 0), (-4.3, -7.6), (4.3, -7.6), (8.6, 0), (4.3, 7.6), (-4.3, 7.6)]),           # 육각 (위가 평평)
    'atk': lambda x, y: abs(x) / 8.0 + abs(y) / 9.0 <= 1,                                             # 마름모
    'matk': poly([(0, -8.8), (8.6, -2.4), (5.4, 8.4), (-5.4, 8.4), (-8.6, -2.4)]),                    # 오각 (위가 뾰족)
    'def': shield,                                                                                   # 방패
    'hp': heart,                                                                                     # 하트
    'crit': poly([(0, -9.2), (5.6, -4.5), (5.6, 4.5), (0, 9.2), (-5.6, 4.5), (-5.6, -4.5)]),            # 길쭉한 수정 조각
    'eva': ell(8.8, 6.4),                                                                            # 가로 타원
    'haste': poly([(-7.8, -6.6), (2.8, -6.6), (8.8, 0), (2.8, 6.6), (-7.8, 6.6), (-4.6, 0)]),         # 오른쪽을 가리키는 화살촉 판
    'time': cog,                                                                                     # 톱니바퀴
    'barrier': lambda x, y: abs(x) <= 7.9 and abs(y) <= 7.9 and abs(x) + abs(y) <= 11.0,             # 팔각
    'fireres': poly([(0, -9.0), (8.9, 7.8), (-8.9, 7.8)]),                                           # 세모 (위가 뾰족)
    'coldres': poly([(0, -9.2), (7.8, -4.4), (7.8, 4.4), (0, 9.2), (-7.8, 4.4), (-7.8, -4.4)]),       # 육각 (위가 뾰족)
    'boltres': tablet,                                                                               # 세운 석판
    'darkres': ell(6.6, 8.8, 0.3),                                                                   # 달걀
}

# 문양 (9칸 안): # = 문양 색, w = 밝은 가운데, o = 어두운 칸
GLYPH = {
    'str': ['..##.....', '.####....', '#####....', '.####....', '..#.o....', '.....o...', '......o..', '.......o.', '........o'],   # 비스듬한 큰 망치 (o = 자루)
    'vit': ['..##.##..', '..##.##..', '##.....##', '##.....##', '...###...', '..#####..', '.#######.', '.###.###.'],   # 곰 발자국
    'agi': ['......###', '.....###w', '....###w.', '...###w..', '..###w...', '.###w....', '.#w......', 'w........'],     # 깃털 (w = 깃대)
    'int': ['...###...', '.##...##.', '#..###..#', '#.##w##.#', '#..###..#', '.##...##.', '...###...'],                 # 눈
    'atk': ['.......ww', '......w#w', '.....w#w.', '....w#w..', '.o.w#w...', '..o#w....', '..#o.....', '.#..o....', 'o........'],   # 비스듬한 검 (o = 날밑 · 자루 끝)
    'matk': ['......##.', '.....#ww#', '.....#ww#', '......##.', '.....o...', '....o....', '...o.....', '..o......', '.o.......'],   # 구슬 지팡이 (o = 자루)
    'def': ['#.#.#.#', '#######', '.#####.', '.##o##.', '.##o##.', '.#####.', '#######'],                                 # 망루 (성가퀴 · 문)
    'hp': ['.........', '...#.....', '...##....', '#..#.#..#', '.##..#.#.', '.....##..', '......#..'],                   # 맥박 선
    'crit': ['.....#..#', '....#..#.', '...#..#.#', '..#..#.#.', '.#..#.#..', '#..#.#...', '..#.#....', '.#.......'],    # 할퀸 자국 셋
    'eva': ['.######..', '.......#.', '.####..#.', '.....#.#.', '###..##..', '...#.....', '.###.....'],                    # 바람 소용돌이
    'haste': ['##..##...', '.##..##..', '..##..##.', '...##..##', '..##..##.', '.##..##..', '##..##...'],                # 두 겹 갈매기 (빠르게)
    'time': ['#######', '.#ooo#.', '..#o#..', '...#...', '..#.#..', '.#.o.#.', '#######'],                             # 모래시계 (o = 모래)
    'barrier': ['...###...', '..#...#..', '.#.w...#.', '.#.....#.', '#.......#', '#########'],                         # 결계 돔
    'fireres': ['...#...', '..##...', '..###.#', '.#####.', '.##w##.', '##www##', '.#####.'],                          # 불꽃
    'coldres': ['....#....', '.#..#..#.', '..#.#.#..', '...###...', '....w....', '...###...', '..#.#.#..', '.#..#..#.', '....#....'],   # 눈송이 (가로 팔 없음)
    'boltres': ['....##.', '...##..', '..##...', '.#####.', '...##..', '..##...', '.##....', '.#.....'],               # 번개
    'darkres': ['#...#...#', '.........', '...###...', '#.#www#.#', '..#www#..', '...###...', '.........', '#...#...#'],   # 빛나는 해 (점 빛살)
}
def rrect(cx, cy, ux, uy, hl, hw, ch, out):
    n = math.hypot(ux, uy); ux, uy = ux / n, uy / n
    for y in range(9):
        for x in range(9):
            dx, dy = x + .5 - cx, y + .5 - cy
            if abs(dx * ux + dy * uy) <= hl and abs(-dx * uy + dy * ux) <= hw: out[(x, y)] = ch
    return out


def gl_hammer():
    o = {}
    rrect(5.9, 5.9, 1, 1, 3.4, 0.62, 'b', o)      # 자루
    rrect(2.7, 2.7, 1, -1, 3.0, 1.75, '#', o)     # 머리
    for (x, y) in [(0, 2), (1, 1), (2, 0)]:
        if (x, y) in o: o[(x, y)] = 'w'
    return o


def gl_sword():
    o = {}
    rrect(6.0, 3.0, 1, -1, 3.9, 0.95, '#', o)     # 날
    for (x, y), ch in list(o.items()):
        if x + y <= 8 and ch == '#': o[(x, y)] = 'w'   # 날 한쪽 빛
    rrect(2.9, 6.1, 1, 1, 2.3, 0.62, 'g', o)      # 날밑
    rrect(1.6, 7.4, -1, 1, 1.1, 0.6, 'b', o)      # 손잡이
    o[(0, 8)] = 'g'
    return o


GLYPH_FN = {'str': gl_hammer, 'atk': gl_sword}
GOFF = {'fireres': (0, 2), 'hp': (0, 0), 'matk': (0, 1), 'def': (0, 0), 'barrier': (0, 1), 'str': (0, 0), 'haste': (-1, 0), 'vit': (0, 0)}

STONE = [((150, 142, 128), (118, 110, 98), (82, 76, 68)),       # 하급: 거친 잿빛 돌
         ((138, 148, 164), (100, 108, 124), (64, 70, 84))]      # 중급: 매끈한 청회색 돌
RIM = [None, ((214, 222, 232), (150, 158, 172)), ((248, 208, 96), (184, 132, 40))]


def make(k, col, lv):
    c = hx(col)
    f = SHAPES[k]
    M = {(x, y) for y in range(H) for x in range(W) if f(x - CX, y - CY)}
    if lv == 0:   # 깨진 모서리: 오른쪽 위 끝 두 칸
        tip = sorted(M, key=lambda p: (p[0] - p[1]), reverse=True)[:2]
        M -= set(tip)
    px = {}
    if lv < 2: L, Md, D = STONE[lv]
    else: L, Md, D = dk(c, .22), mix(dk(c, .5), (36, 28, 56), .25), dk(c, .72)
    edge = {p for p in M if any((p[0] + dx, p[1] + dy) not in M for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
    ring = {p for p in M - edge if any((p[0] + dx, p[1] + dy) in edge for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
    for (x, y) in M:
        tl = (x - 1, y) not in M or (x, y - 1) not in M
        br = (x + 1, y) not in M or (x, y + 1) not in M
        s = (x - CX) + (y - CY)
        if tl and not br: col_ = L
        elif br and not tl: col_ = D
        elif tl and br: col_ = Md
        else: col_ = mix(Md, L, .35) if s < -7 else (mix(Md, D, .35) if s > 7 else Md)
        if lv == 0 and (x * 7 + y * 13) % 11 == 0 and (x, y) not in edge: col_ = mix(col_, D, .55)    # 돌 얼룩
        if lv == 2 and (x, y) not in edge and -9 <= s <= -6 and (x + y) % 2 == 0: col_ = mix(col_, L, .6)   # 수정 결
        px[(x, y)] = col_
    if RIM[lv]:
        a, b = RIM[lv]
        for (x, y) in ring: px[(x, y)] = a if (x - CX) + (y - CY) < 0 else b
    # 문양
    g = GLYPH[k]; gh = len(g); gw = max(len(r) for r in g)
    ox = round(CX - gw / 2) + GOFF.get(k, (0, 0))[0]; oy = round(CY - gh / 2) + GOFF.get(k, (0, 0))[1]
    G = {}
    if k in GLYPH_FN:
        gw = gh = 9; ox = round(CX - 4.5) + GOFF.get(k, (0, 0))[0]; oy = round(CY - 4.5) + GOFF.get(k, (0, 0))[1]
        for (i, j), ch in GLYPH_FN[k]().items(): G[(ox + i, oy + j)] = ch
    else:
        for j, row in enumerate(g):
            for i, ch in enumerate(row):
                if ch != '.': G[(ox + i, oy + j)] = ch
    if lv == 0: gc, gw_, go = mix(D, c, .45), mix(D, c, .62), dk(D, .3)
    elif lv == 1: gc, gw_, go = c, lt(c, .45), dk(c, .45)
    else: gc, gw_, go = lt(c, .45), (255, 252, 236), dk(c, .2)
    if lv >= 1:   # 그림자 (중급) · 빛 번짐 칸 (상급, 도트로)
        for (x, y) in list(G):
            for dx, dy in (((1, 1),) if lv == 1 else ((1, 0), (-1, 0), (0, 1), (0, -1))):
                q = (x + dx, y + dy)
                if q in M and q not in G and q not in ring and q not in edge:
                    px[q] = dk(Md, .4) if lv == 1 else mix(Md, c, .42)
    for (x, y), ch in G.items():
        if (x, y) not in M: continue
        if ch == 'g': px[(x, y)] = [mix(D, (200, 160, 60), .55), (232, 190, 80), (255, 222, 112)][lv]
        elif ch == 'b': px[(x, y)] = [mix(D, (110, 70, 40), .5), (128, 82, 44), (156, 102, 54)][lv]
        else: px[(x, y)] = gc if ch == '#' else (gw_ if ch == 'w' else go)
    if lv == 0:   # 새김 아래쪽 밝은 턱 (파낸 느낌)
        for (x, y), ch in G.items():
            q = (x, y + 1)
            if q in M and q not in G and q not in edge: px[q] = mix(px[q], L, .5)
    # 바깥 테
    out = {}
    for (x, y) in M:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q not in M and 0 <= q[0] < W and 0 <= q[1] < H: out[q] = K
    px.update(out)
    if lv == 2:   # 반짝이 (도트 두 개: 가운데 흰 칸 + 대각 흐린 칸)
        for (sx, sy) in ((17, 2), (2, 16)):
            if (sx, sy) in px: continue
            px[(sx, sy)] = (255, 250, 220)
            for dx, dy in ((1, 1), (-1, -1), (1, -1), (-1, 1)):
                q = (sx + dx, sy + dy)
                if q not in px and 0 <= q[0] < W and 0 <= q[1] < H: px[q] = lt(c, .3)
    return px


RUNES = [('str', '힘', '#e0503f'), ('vit', '체력', '#e0a03f'), ('agi', '민첩', '#5ac84a'), ('int', '지능', '#5a8af0'),
         ('atk', '공격', '#f08a3c'), ('matk', '마력', '#b86af0'), ('def', '수호', '#9aa0a8'), ('hp', '생명', '#ff7a8a'),
         ('crit', '예리함', '#f7e04a'), ('eva', '바람', '#8ad8ff'), ('haste', '신속', '#ffe08a'), ('time', '시간', '#c8a8ff'),
         ('barrier', '결계', '#c8b8ff'), ('fireres', '내화', '#ff9a5a'), ('coldres', '내한', '#8ad0ff'), ('boltres', '피뢰', '#f0e070'),
         ('darkres', '정결', '#e0d0f8')]
NOTE = {'str': '무거운 바위 · 큰 망치', 'vit': '둥근 조약돌 · 곰 발자국', 'agi': '물방울 · 깃털', 'int': '육각 · 눈', 'atk': '마름모 · 비스듬한 검',
        'matk': '오각 · 구슬 지팡이', 'def': '방패 · 망루', 'hp': '하트 · 맥박 선', 'crit': '수정 조각 · 할퀸 자국', 'eva': '가로 타원 · 바람',
        'haste': '화살촉 판 · 두 겹 갈매기', 'time': '톱니바퀴 · 모래시계', 'barrier': '팔각 · 결계 돔', 'fireres': '세모 · 불꽃',
        'coldres': '세운 육각 · 눈송이', 'boltres': '세운 석판 · 번개', 'darkres': '달걀 · 빛나는 해'}
