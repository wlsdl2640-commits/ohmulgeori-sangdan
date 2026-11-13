"""마석 시안 3 (빌드 69, 11-13 23:06 사용자 「마석 시안은 다시 해줘 일반적인 보석보다 더 마나가 넘치는 느낌으로,
자연의 물질들과도 섞어도 보고 여러시안으로 보여줘」).
보석 여덟(시안 2의 깎기 · 이름 · 효과 그대로)마다 네 갈래:
  A 마나가 끓는 보석 — 깎은 보석 속에서 빛이 끓고(밝은 속 · 빛 결) 위로 마나 불꽃이 피어오른다
  B 원석에 박힌 마석 — 거친 돌덩이를 깨어 낸 창으로 보석이 보이고, 돌 틈으로 마나가 새어 나온다
  C 자연과 하나 된 마석 — 보석마다 어울리는 자연물(깃털 · 얼음 · 용암석 · 거북 등딱지 · 암모나이트 · 조개와 물방울 · 나뭇가지 진 · 뿌리)
  D 마법진 위에 떠오른 마석 — 발밑 마법진에서 피어오른 마나가 보석을 띄운다 (결정이 돋는 꼴은 손 · 짐승 귀처럼 보여 뺐다)
20×20 도트, 왼쪽 위 빛, 등급 없음(늘 영웅 칸). 반짝이는 더하기 꼴 없이 대각(／) · 한 칸만. 게임에는 아직 넣지 않는다 (사용자가 고른 뒤)."""
import math
import os
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, '..', 'runeart64'))
from kit import Ic, P, C, E, mix, lt, dk, hx, rast, path, lens, cap, U, D, shade, W, H, K   # noqa: E402
from maseok import facet_gem, cabochon, PAL, GLOW   # noqa: E402
import maseok2 as M2   # noqa: E402

BG = (30, 36, 52)   # 빛 칸을 섞을 어두운 바탕 (영웅 칸 안쪽 빛과 어울리게)
WH = (255, 255, 255)
KEYS = ['moon', 'sapph', 'garn', 'dia', 'opal', 'aqua', 'amber', 'obsid']


def ok(q): return 0 <= q[0] < W and 0 <= q[1] < H


def shift(s, dx, dy):
    s.px = {(x + dx, y + dy): c for (x, y), c in s.px.items() if ok((x + dx, y + dy))}
    s.O = {(x + dx, y + dy) for (x, y) in s.O if ok((x + dx, y + dy))}
    return s


def base_gem(key, r, dx=0, dy=0):
    """시안 2의 깎기를 반지름 r로 다시 그려 (dx, dy)만큼 옮긴다 — 호박은 작은 발톱을 따로 친다"""
    if key == 'amber': return shift(amber_small(), dx, dy)
    M2.R = r
    fn = dict((st[1], st[0]) for st in M2.STONES)[key]
    s, _ = fn()
    M2.R = 8.4
    return shift(s, dx, dy)


def amber_small(cx=10, cy=10.6, r=6.7):
    """작은 호박 (지름 13칸): 속이 비치고 가운데가 밝다 · 안에 갇힌 발톱(뿌리 굵고 잘린 마디 → 끝은 갈고리)"""
    s = Ic()
    f = lambda x, y: ((x - cx) ** 2 / (r * 0.9) ** 2 + (y - cy) ** 2 / (r * 0.86) ** 2 <= 1) or (abs(x - cx) <= (y - (cy - r * 1.1)) * 0.8 and cy - r * 1.1 < y < cy)
    M = rast(f)
    for (x, y) in M:
        d = math.hypot((x + .5 - cx) / (r * 0.9), (y + .5 - cy) / (r * 0.86))
        br = (x + .5 - cx) + (y + .5 - cy) > r * 0.5 and d > 0.72
        s.px[(x, y)] = hx('#8a460c') if br and d > 0.86 else hx('#c87418') if d > 0.86 or br else hx('#ec9a2c') if d > 0.62 else hx('#ffbe48') if d > 0.36 else hx('#ffd878')
    s.O |= M
    ROWS = {7: [(8, 10)], 8: [(6, 12)], 9: [(5, 7), (10, 13)], 10: [(5, 6), (11, 13)], 11: [(11, 13)], 12: [(11, 12)], 13: [(10, 12)], 14: [(10, 11)], 15: [(9, 10)]}
    claw = {(x, y) for y, spans in ROWS.items() for (a0, a1) in spans for x in range(a0, a1 + 1)}
    for (x, y) in claw:
        outer = (x, y - 1) not in claw or (x + 1, y) not in claw
        s.px[(x, y)] = hx('#5a2c0e') if outer and y < 12 else hx('#2a1206')
    s.px[(5, 9)] = hx('#e8bc80'); s.px[(5, 10)] = hx('#8a5a2a')   # 잘린 뿌리 단면
    for q in [(8, 14), (14, 8), (6, 13)]:
        if q in M: s.px[q] = hx('#fff4cc')
    for q in [(7, 5), (8, 5)]:
        if q in M: s.px[q] = WH
    return s


# ───────── 마나 효과 ─────────
def gem_box(s):
    xs = [p[0] for p in s.O]; ys = [p[1] for p in s.O]
    return min(xs), min(ys), max(xs), max(ys), (min(xs) + max(xs) + 1) / 2, (min(ys) + max(ys) + 1) / 2


def core_glow(s, M, col, cx, cy, r, k=1.0):
    """보석 속이 빛난다: 가운데로 갈수록 그 보석 빛(거의 흰색)으로"""
    for q in M:
        if q not in s.px: continue
        d = math.hypot(q[0] + .5 - cx, q[1] + .5 - cy) / max(1e-6, r)
        if d < 0.3 * k: s.px[q] = lt(col, 0.78)
        elif d < 0.52 * k: s.px[q] = mix(s.px[q], lt(col, 0.45), 0.75)
        elif d < 0.74 * k: s.px[q] = mix(s.px[q], col, 0.3)


def veins(s, M, col, lines):
    """빛 결: 속에서 테로 뻗는 한 칸 빛줄 (선 끝은 흐리게)"""
    for pts in lines:
        cells = path(pts)
        for i, q in enumerate(cells):
            if q in M and q in s.px:
                t = i / max(1, len(cells) - 1)
                s.px[q] = lt(col, 0.6) if t < 0.55 else mix(lt(col, 0.3), s.px[q], 0.35)


def halo(s, col, t=0.62, skip=()):
    """테 바깥 한 칸을 그 보석 빛으로 은은하게 (모든 칸을 둘러)"""
    occ = set(s.px); out = {}
    for (x, y) in occ:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                q = (x + dx, y + dy)
                if q not in occ and ok(q) and q not in skip: out[q] = mix(col, BG, t)
    s.px.update(out)


def put(s, pts, c, over=False):
    for q in pts:
        if ok(q) and (over or q not in s.px): s.px[q] = c


def flames(s, col, tongues):
    """마나 불꽃: 아래(보석 테)에서 위로 피어오르는 혀 — tongues = [[(x, y), …] 아래→위]"""
    c0, c1, c2 = lt(col, 0.72), lt(col, 0.3), mix(col, BG, 0.25)
    for tg in tongues:
        n = len(tg)
        for i, q in enumerate(tg):
            if not ok(q): continue
            t = i / max(1, n - 1)
            s.px[q] = c0 if t < 0.34 else c1 if t < 0.7 else c2


def motes(s, col, pts, big=()):
    """떠다니는 마나 알갱이: 한 칸(밝음) · big은 대각 두 칸(／)"""
    for q in pts:
        if ok(q) and q not in s.px: s.px[q] = lt(col, 0.45)
    for (x, y) in big:
        if ok((x, y)) and (x, y) not in s.px: s.px[(x, y)] = lt(col, 0.8)
        if ok((x + 1, y - 1)) and (x + 1, y - 1) not in s.px: s.px[(x + 1, y - 1)] = mix(col, BG, 0.3)


def glint(s, x, y, col):   # 빛 한 점 (／)
    if not ok((x, y)) or (x, y) in s.px: return
    s.px[(x, y)] = (255, 252, 236)
    for (dx, dy), t in (((-1, 1), .2), ((1, -1), .45)):
        q = (x + dx, y + dy)
        if ok(q) and q not in s.px: s.px[q] = lt(col, t) if t < .3 else mix(col, BG, t)


def rim(s, M, col):
    """보석 테 안쪽 한 칸을 빛 색과 섞어 (빛이 테에서 번진다)"""
    for (x, y) in M:
        if any((x + dx, y + dy) not in M for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
            s.px[(x, y)] = mix(s.px[(x, y)], col, 0.35)


# 보석마다 마나 불꽃 모양 (A: 위로 셋 · 가운데가 높다)
def tongues_for(x0, x1, ytop):
    mid = (x0 + x1) // 2
    return [[(mid, ytop), (mid, ytop - 1), (mid - 1, ytop - 2), (mid - 1, ytop - 3), (mid, ytop - 4)],
            [(x0 + 1, ytop + 1), (x0 + 1, ytop), (x0, ytop - 1), (x0, ytop - 2)],
            [(x1 - 1, ytop + 1), (x1 - 1, ytop), (x1, ytop - 1)]]


# ───────── A 마나가 끓는 보석 ─────────
def var_a(key):
    col = GLOW[key]
    s = base_gem(key, 6.8, 0, 2)
    M = set(s.O)
    x0, y0, x1, y1, cx, cy = gem_box(s)
    core_glow(s, M, col, cx, cy + 0.3, max(x1 - x0, y1 - y0) / 2)
    L = {'moon': [[(10, 12), (13, 9)], [(10, 12), (7, 15)]], 'sapph': [[(10, 12), (14, 9)], [(10, 12), (6, 15)], [(10, 12), (12, 16)]],
         'garn': [[(10, 13), (10, 7)], [(10, 13), (6, 16)], [(10, 13), (14, 16)]], 'dia': [[(10, 11), (7, 9)], [(10, 11), (13, 9)], [(10, 11), (10, 16)]],
         'opal': [[(10, 12), (13, 8)], [(10, 12), (7, 16)]], 'aqua': [[(10, 12), (10, 6)], [(10, 12), (10, 17)]],
         'amber': [], 'obsid': [[(10, 12), (10, 6)], [(10, 12), (10, 18)]]}[key]
    veins(s, M, col, L)
    s.done()
    ytop = min(y for (x, y) in s.px) - 1
    xs = sorted(x for (x, y) in s.px if y == ytop + 1)
    halo(s, col, 0.66)
    flames(s, col, tongues_for(xs[0], xs[-1], ytop))
    motes(s, col, [(3, 4), (17, 6), (2, 12), (18, 13)], big=[(4, 2), (15, 3)])
    return s


# ───────── B 원석에 박힌 마석 ─────────
ROCK = {   # 돌 빛 (밝음 → 어두움 넷) · 결 무늬 색
    'moon':  ([hx('#d8d2c4'), hx('#b4ac9a'), hx('#8a8272'), hx('#5e5848')], hx('#ece6d8')),    # 장석 (흰 돌)
    'sapph': ([hx('#7c8090'), hx('#5a5e6e'), hx('#40434f'), hx('#282a34')], hx('#9aa0b4')),    # 현무암
    'garn':  ([hx('#a8a4a0'), hx('#82807c'), hx('#5e5c5a'), hx('#3e3c3c')], hx('#e8e4dc')),    # 운모 편암 (반짝이 결)
    'dia':   ([hx('#8a98a4'), hx('#687684'), hx('#4c5866'), hx('#323c48')], hx('#b8c8d8')),    # 킴벌라이트 (푸른 회색)
    'opal':  ([hx('#c8885a'), hx('#a0663e'), hx('#784628'), hx('#502c18')], hx('#e0a878')),    # 철 사암 (보울더 오팔)
    'aqua':  ([hx('#e4dcd4'), hx('#c4b8b0'), hx('#9a8c86'), hx('#6a5e5a')], hx('#e8a8a0')),    # 페그마타이트 (분홍 점)
    'amber': ([hx('#8a6a4a'), hx('#6a4e34'), hx('#4c3622'), hx('#302014')], hx('#a88a62')),    # 갈탄 (나무 화석)
    'obsid': ([hx('#9a5a48'), hx('#7a4234'), hx('#5a2e24'), hx('#3a1c16')], hx('#c07a62')),    # 붉은 화산암
}


def rock_mass(key):
    """거친 돌덩이: 윗면(밝음) · 왼쪽 앞면 · 오른쪽 옆면(어두움) 세 면 + 결 · 광물 점"""
    pal, fleck = ROCK[key]
    s = Ic()
    O = P([(1.6, 11.2), (3.4, 6.4), (7.6, 3.2), (12.4, 2.8), (16.8, 5.2), (18.6, 9.6), (17.8, 14.6), (13.6, 18.4), (6.6, 18.6), (2.4, 15.6)])
    topf = P([(1.6, 11.2), (3.4, 6.4), (7.6, 3.2), (12.4, 2.8), (16.8, 5.2), (13.2, 7.4), (6.2, 8.2)])
    rightf = P([(13.2, 7.4), (16.8, 5.2), (18.6, 9.6), (17.8, 14.6), (13.6, 18.4), (14.4, 11.6)])
    M = s.facets(O, [(topf, pal[0], lt(pal[0], 0.08), pal[1]), (rightf, pal[2], dk(pal[2], 0.1), pal[3]), (None, pal[1], pal[1], pal[2])])
    for (x, y) in M:   # 결 · 광물 점
        if (x * 3 + y * 5) % 13 == 0: s.px[(x, y)] = dk(s.px[(x, y)], 0.22)
        if (x * 7 + y * 3) % 19 == 0: s.px[(x, y)] = fleck
    for q in path([(6.2, 8.2), (13.2, 7.4), (14.4, 11.6), (13.6, 18.4)]):   # 모서리 줄
        if q in M: s.px[q] = mix(s.px[q], pal[3], 0.5)
    return s, M


def var_b(key):
    col = GLOW[key]
    s, RM = rock_mass(key)
    # 깨어 낸 창: 바위 가운데에서 보석이 보인다 (창 둘레 한 칸은 깨진 테 = 어두운 돌)
    g = base_gem(key, 4.6, -2, 2)
    gm = set(g.O)
    x0, y0, x1, y1, cx, cy = gem_box(g)
    core_glow(g, gm, col, cx, cy, max(x1 - x0, y1 - y0) / 2, 0.95)
    pal = ROCK[key][0]
    for (x, y) in gm:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                q = (x + dx, y + dy)
                if q in RM and q not in gm: s.px[q] = pal[3] if dx + dy > 0 else dk(pal[2], 0.25)
    for q in gm: s.px[q] = g.px[q]
    # 돌 틈으로 새어 나오는 마나: 창에서 테까지 빛 금 셋
    cracks = [[(12, 11), (14, 9), (15, 6), (17, 5)], [(7, 16), (6, 17), (4, 17)], [(12, 15), (14, 16), (16, 15)], [(9, 7), (10, 5), (12, 3)]]
    for pts in cracks:
        cells = path(pts)
        for i, q in enumerate(cells):
            if q in RM and q not in gm: s.px[q] = lt(col, 0.62) if i < len(cells) - 2 else col
    s.done()
    halo(s, col, 0.74)
    flames(s, col, [[(17, 4), (18, 3), (18, 2)], [(12, 2), (12, 1), (13, 0)]])
    motes(s, col, [(2, 5), (19, 8), (1, 18)], big=[(4, 2)])
    return s


# ───────── C 자연과 하나 된 마석 ─────────
def c_moon():   # 깃털: 문스톤 알 뒤로 은빛 깃털 두 장이 날개처럼 (회피 — 가볍게 비켜 난다)
    col = GLOW['moon']; s = Ic()
    fe = [hx('#ffffff'), hx('#dfe8f4'), hx('#a8b8d0')]
    for (ax, ay, bx, by, sk) in ((9.5, 12.5, 1.6, 3.0, -0.3), (10.5, 12.5, 18.4, 3.0, 0.3)):
        F = rast(lens(ax, ay, bx, by, 3.0, 0.8, sk))
        s.px.update(shade(F, fe[0], fe[1], fe[2], 0.3)); s.O |= F
        for i, q in enumerate(path([(ax - .5, ay - .5), (bx - .5, by - .5)])):   # 깃대
            if q in F and i > 1: s.px[q] = hx('#8a9cb8')
        for q in F:   # 깃 결: 깃대에서 비스듬히
            if (q[0] + 2 * q[1]) % 4 == 0 and s.px[q] not in (hx('#8a9cb8'),): s.px[q] = mix(s.px[q], fe[2], 0.45)
    g = base_gem('moon', 5.6, 0, 3)
    gm = set(g.O)
    x0, y0, x1, y1, cx, cy = gem_box(g)
    core_glow(g, gm, col, cx, cy, (x1 - x0) / 2)
    s.px.update(g.px); s.O |= gm
    s.done()
    halo(s, col, 0.7)
    motes(s, col, [(3, 15), (17, 15), (10, 3)], big=[(2, 18), (16, 18)])
    return s


def c_sapph():   # 얼음: 사파이어가 얼음 결정 기둥 속에 얼어 있다 (막기 — 얼음 벽)
    col = GLOW['sapph']; s = Ic()
    small = P([(15.6, 6.6), (18.2, 9), (18.2, 15.6), (15.6, 17.6), (13.2, 15.6), (13.2, 9)])
    s.facets(small, [(lambda x, y: x < 15.6, hx('#e0f4ff'), hx('#b4dcf4'), hx('#86bce4')), (None, hx('#9ccaec'), hx('#74a8dc'), hx('#5084c4'))])
    big = P([(9.4, 0.8), (14.4, 4.8), (14.4, 15.6), (9.4, 19.2), (4.4, 15.6), (4.4, 4.8)])
    BM = s.facets(big, [(lambda x, y: x < 9.4, hx('#f2fbff'), hx('#cdeefa'), hx('#9fd4f0')), (None, hx('#b0dcf4'), hx('#88c0e8'), hx('#609cd8'))])
    tiny = P([(3.2, 9.4), (5, 11), (5, 16), (3.2, 17.4), (1.4, 16), (1.4, 11)])
    s.facets(tiny, [(lambda x, y: x < 3.2, hx('#e8f8ff'), hx('#c0e4f6'), hx('#90c4e6')), (None, hx('#a4d0ee'), hx('#7cb0e0'), hx('#5890cc'))])
    g = base_gem('sapph', 3.9, -1, 1)
    gm = set(g.O)
    x0, y0, x1, y1, cx, cy = gem_box(g)
    core_glow(g, gm, col, cx, cy, (x1 - x0) / 2, 0.9)
    for (x, y) in gm:   # 얼음 속 보석 둘레는 짙은 얼음 그늘
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q in BM and q not in gm: s.px[q] = hx('#5a94cc')
    s.px.update(g.px)
    for q in [(6, 4), (7, 3), (6, 5)]:   # 얼음 면 빛
        if q in BM: s.px[q] = WH
    s.done()
    halo(s, col, 0.72)
    motes(s, hx('#bfe8ff'), [(1, 4), (18, 2), (17, 19)], big=[(16, 3)])
    return s


def c_garn():   # 용암석: 검은 화산암 위에 박힌 가넷, 돌 틈 용암이 빛나고 불씨가 오른다 (반격 — 되받아 치솟는 불)
    col = GLOW['garn']; s = Ic()
    rock = P([(1.8, 14), (4, 9.6), (8, 8.6), (13, 9.4), (17.4, 10.6), (18.6, 15.2), (15, 18.6), (5, 18.6)])
    RM = rast(rock)
    s.px.update(shade(RM, hx('#5a5254'), hx('#3a3436'), hx('#1c1818'), 0.2)); s.O |= RM
    lava = [[(3, 15), (6, 14), (8, 16), (11, 15)], [(13, 12), (15, 14), (17, 13)], [(9, 17), (13, 17)]]
    for pts in lava:
        for i, q in enumerate(path(pts)):
            if q in RM: s.px[q] = hx('#ffcc5a') if i % 3 == 1 else hx('#ff7a2a')
    g = base_gem('garn', 5.0, 0, -2)
    gm = set(g.O)
    x0, y0, x1, y1, cx, cy = gem_box(g)
    core_glow(g, gm, col, cx, cy + 1, (x1 - x0) / 2)
    s.px.update(g.px); s.O |= gm
    s.done()
    halo(s, hx('#ff7a3a'), 0.74)
    put(s, [(5, 6), (15, 5), (12, 2), (7, 3)], hx('#ffb04a'))
    put(s, [(4, 4), (16, 3)], hx('#ff6a2a'))
    return s


def c_dia():   # 거북 등딱지: 천 년 거북의 등딱지(가운데 판 + 둘레 판 여섯) 가운데 박힌 다이아몬드 (피해 감소 — 단단한 껍질)
    col = GLOW['dia']; s = Ic()
    outer = lambda x, y: (x - 10) ** 2 / 8.9 ** 2 + (y - 10.4) ** 2 / 8.2 ** 2 <= 1
    HM = rast(outer)
    hexi = P([(10, 4.6), (14.6, 7.4), (14.6, 13.0), (10, 15.8), (5.4, 13.0), (5.4, 7.4)])
    IM2 = rast(hexi)
    seam = set()
    for a in range(6):   # 둘레 판을 나누는 이음매 (가운데 판 꼭짓점에서 바깥으로)
        ang = -math.pi / 2 + a * math.pi / 3
        for q in path([(10 + 5.5 * math.cos(ang), 10.4 + 5.5 * math.sin(ang)), (10 + 9.2 * math.cos(ang), 10.4 + 9.2 * math.sin(ang))]):
            if q in HM: seam.add(q)
    for (x, y) in HM:
        u = (x + .5 - 10) * -0.62 + (y + .5 - 10.4) * -0.78
        if (x, y) in IM2: pal = [hx('#a4b46a'), hx('#84944e'), hx('#64743a'), hx('#465428')]
        else:
            a = (math.degrees(math.atan2(y + .5 - 10.4, x + .5 - 10)) + 90) % 360
            pal = [hx('#b89458'), hx('#967444'), hx('#725432'), hx('#4e3820')] if int(a // 60) % 2 else [hx('#a88a50'), hx('#86683c'), hx('#644a2a'), hx('#44301a')]
        c = pal[0] if u > 4.5 else pal[1] if u > 0.5 else pal[2] if u > -4 else pal[3]
        d = math.hypot((x + .5 - 10) / 8.9, (y + .5 - 10.4) / 8.2)
        if (x, y) not in IM2 and 0.78 < d < 0.86: c = dk(c, 0.18)   # 판 자람 테
        s.px[(x, y)] = c
    for q in seam:
        if q not in IM2: s.px[q] = hx('#2e2214')
    for (x, y) in IM2:   # 가운데 판 둘레 이음매에 마나 빛
        if any((x + dx, y + dy) not in IM2 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): s.px[(x, y)] = hx('#d8f0ff') if (x + y) % 2 else lt(col, 0.1)
    s.O |= HM
    g = base_gem('dia', 3.8, 0, 0)
    gm = set(g.O)
    s.px.update(g.px)
    s.done()
    halo(s, col, 0.74)
    motes(s, col, [(1, 1), (19, 2), (0, 18)], big=[(17, 19)])
    return s


def c_opal():   # 암모나이트: 오팔이 된 조개 화석 — 돌돌 말린 껍데기 마디마다 무지갯빛 (반사 — 둘레로 되돌리는 소용돌이)
    col = GLOW['opal']; s = Ic()
    cx, cy = 10.0, 10.4
    F = {(x, y) for y in range(H) for x in range(W) if math.hypot(x + .5 - cx, y + .5 - cy) <= 8.4}
    k = math.log(1 / 0.5) / (2 * math.pi)   # 한 바퀴에 반지름이 두 배
    rain = [hx('#ffb0c8'), hx('#ffe08a'), hx('#a8f0a0'), hx('#90e8f0'), hx('#a8b8ff'), hx('#e0b0ff')]
    for (x, y) in F:
        dx, dy = x + .5 - cx, y + .5 - cy
        r = max(math.hypot(dx, dy), 0.35); a = math.atan2(dy, dx)
        t = (math.log(r / 8.4) / (2 * math.pi * k) - a / (2 * math.pi)) % 1.0   # 나선 좌표: 0 = 감긴 이음매
        u = dx * -0.62 + dy * -0.78
        base = hx('#f4eefc') if u > 4 else hx('#dcd2f0') if u > 0 else hx('#bcaed8') if u > -4 else hx('#9688bc')
        whorl = int(math.log(r / 8.4) / (2 * math.pi * k) - a / (2 * math.pi) + 100)
        rib = int((a + math.pi) / (2 * math.pi) * (14 + whorl % 3 * 2)) % 2
        c = base
        if t < 0.2 or t > 0.93: c = hx('#4e4478')                   # 감긴 이음매 (어두운 나선 줄)
        elif rib and 0.35 < t < 0.8: c = mix(base, rain[(whorl + int((a + math.pi) * 3)) % 6], 0.55)   # 마디마다 무지갯빛
        s.px[(x, y)] = c
    s.O |= F
    for q in [(10, 10), (9, 10)]: s.px[q] = lt(col, 0.75)   # 가운데 마나 빛
    for q in [(5, 4), (6, 4)]:
        if q in F: s.px[q] = WH
    s.done()
    halo(s, col, 0.72)
    motes(s, col, [(1, 2), (19, 3), (0, 18)], big=[(17, 19)])
    return s


def c_aqua():   # 조개와 물방울: 열린 조개에 놓인 아쿠아마린을 물방울 막이 감싼다 (보호막 — 물의 막)
    col = GLOW['aqua']; s = Ic()
    shell = lambda x, y: (y > 12.2) and ((x - 10) ** 2 / 8.6 ** 2 + (y - 12.2) ** 2 / 6.0 ** 2 <= 1)
    SM = rast(shell)
    for (x, y) in SM:
        a = math.atan2(y + .5 - 12.2, x + .5 - 10)
        rib = int(a / math.pi * 18) % 2
        s.px[(x, y)] = (hx('#ffe4ec') if rib else hx('#f0c0d0')) if y < 15 else (hx('#e8a8bc') if rib else hx('#c88098'))
    s.O |= SM
    for x in range(2, 19):   # 조개 입술 줄
        if (x, 13) in SM: s.px[(x, 13)] = hx('#fff4f8')
    # 물방울 막: 원 테 한 칸 (속은 비치게 비워 두고 보석만)
    BM = {(x, y) for y in range(H) for x in range(W) if 5.4 <= math.hypot(x + .5 - 10, y + .5 - 8.6) <= 6.5 and (x, y) not in SM}
    for q in BM: s.px[q] = hx('#bff8f0') if (q[0] + q[1]) % 5 else hx('#ffffff')
    for q in [(6, 4), (5, 5), (7, 4)]:
        if q in BM: s.px[q] = WH
    g = base_gem('aqua', 4.0, 0, -1)
    gm = set(g.O)
    x0, y0, x1, y1, cx, cy = gem_box(g)
    core_glow(g, gm, col, cx, cy, (y1 - y0) / 2, 0.9)
    s.px.update(g.px); s.O |= gm
    for q in [(8, 5), (12, 6), (6, 9), (14, 10), (9, 13)]:   # 막 속 작은 거품
        if q not in s.px: s.px[q] = mix(col, BG, 0.35)
    s.done()
    for q in BM: s.px[q] = s.px[q]   # 막은 테 없이 (테는 조개 · 보석에만)
    motes(s, col, [(1, 4), (18, 3), (18, 9)], big=[(2, 1)])
    return s


def c_amber():   # 나뭇가지 진: 나뭇가지에 맺혀 굳은 호박 — 속에 갇힌 발톱 (버티기 — 천 년을 버틴 진)
    col = GLOW['amber']; s = Ic()
    BR = rast(U(cap(0.6, 3.4, 19.4, 2.6, 1.6, 1.3), cap(13, 3, 16.8, 0.4, 0.8, 0.5)))
    s.px.update(shade(BR, hx('#a8784a'), hx('#7a5230'), hx('#4a301a'), 0.25)); s.O |= BR
    for (x, y) in BR:   # 나무껍질 결
        if (x * 2 + y) % 5 == 0: s.px[(x, y)] = hx('#3a2412')
    LF = rast(lens(4.5, 2.6, 1.2, 0.2, 1.4, 1.0, 0.2))
    s.px.update(shade(LF, hx('#9ad85a'), hx('#5aa83a'), hx('#2e7024'), 0.3)); s.O |= LF
    g = amber_small(10, 11.6, 6.5)
    gm = set(g.O)
    s.px.update({q: c for q, c in g.px.items() if q not in BR}); s.O |= gm - BR
    for q in [(9, 4), (10, 4), (11, 4)]:   # 가지에 붙은 진 목
        s.px[q] = hx('#e08a1c'); s.O.add(q)
    s.done()
    halo(s, col, 0.74, skip={(x, y) for y in range(0, 5) for x in range(W)})
    motes(s, col, [(2, 9), (18, 11), (3, 16)], big=[(16, 17)])
    return s


def c_obsid():   # 뿌리: 검은 뿌리가 흑요석을 움켜쥐고, 틈으로 보랏빛 기운이 새어 나온다 (은신 — 땅속 그림자)
    col = GLOW['obsid']; s = Ic()
    g = base_gem('obsid', 6.2, 0, -1)
    gm = set(g.O)
    x0, y0, x1, y1, cx, cy = gem_box(g)
    core_glow(g, gm, col, cx, cy, (y1 - y0) / 2, 0.8)
    s.px.update(g.px); s.O |= gm
    RT = set()
    for (pts, r0, r1) in (([(10, 19.6), (8.6, 16.6), (6.2, 14.2), (5.6, 10.6), (6.8, 7.2)], 1.2, 0.5),
                          ([(10.4, 19.6), (11.8, 16.4), (14.0, 14.0), (14.6, 10.4), (13.4, 7.6)], 1.2, 0.5),
                          ([(9.6, 19.6), (6.4, 18.6), (3.4, 19.6)], 0.9, 0.5), ([(10.8, 19.6), (14.2, 18.4), (17.0, 19.6)], 0.9, 0.5)):
        n = len(pts) - 1
        for i in range(n):
            (ax, ay), (bx, by) = pts[i], pts[i + 1]
            rr0 = r0 + (r1 - r0) * i / n; rr1 = r0 + (r1 - r0) * (i + 1) / n
            RT |= rast(cap(ax, ay, bx, by, rr0, rr1))
    for q in RT:
        if q in gm and q[1] < 12: continue   # 위쪽은 보석 앞을 덮지 않게 (뿌리가 옆을 감싼다)
        u = (q[0] - 10) * -0.62 + (q[1] - 14) * -0.78
        s.px[q] = hx('#7a5a40') if u > 1.5 else hx('#5a4030') if u > -1.5 else hx('#3a281c'); s.O.add(q)
    s.done()
    halo(s, col, 0.7)
    flames(s, col, [[(10, 2), (10, 1), (11, 0)], [(7, 4), (6, 3), (6, 2)], [(13, 4), (14, 3)]])
    motes(s, col, [(3, 6), (17, 7), (2, 12)], big=[(16, 3)])
    return s


C_FN = {'moon': c_moon, 'sapph': c_sapph, 'garn': c_garn, 'dia': c_dia, 'opal': c_opal, 'aqua': c_aqua, 'amber': c_amber, 'obsid': c_obsid}


def var_c(key): return C_FN[key]()


# ───────── D 마나 결정이 자라난 보석 ─────────
def prism(bx, by, ang, L, w):
    """결정 기둥: 밑(bx, by)에서 ang 쪽으로 길이 L · 폭 w — 곧은 몸 + 뾰족한 끝 (왼쪽 면 / 오른쪽 면)"""
    ux, uy = math.cos(ang), math.sin(ang); nx, ny = -uy, ux
    sh = L * 0.68
    pts = [(bx + nx * w, by + ny * w), (bx + ux * sh + nx * w, by + uy * sh + ny * w), (bx + ux * L, by + uy * L),
           (bx + ux * sh - nx * w, by + uy * sh - ny * w), (bx - nx * w, by - ny * w)]
    left = lambda x, y: (x - bx) * nx + (y - by) * ny > 0
    return P(pts), left, (bx + ux * L, by + uy * L)


def var_d(key):
    """마법진 위에 떠오른 마석: 발밑 마법진(둥근 테 둘 + 룬 점)에서 마나가 피어올라 보석을 띄운다"""
    col = GLOW[key]
    s = Ic()
    g = base_gem(key, 5.0, 0, -3)
    gm = set(g.O)
    x0, y0, x1, y1, gx, gy = gem_box(g)
    core_glow(g, gm, col, gx, gy, max(x1 - x0, y1 - y0) / 2, 0.95)
    s.px.update(g.px); s.O |= gm
    s.done()
    solid = set(s.px)   # 보석 + 테 (마법진이 덮지 않는다)
    halo(s, col, 0.7)
    for q in list(s.px):
        if q not in solid and q[1] >= 13: del s.px[q]   # 마법진 자리의 은은한 빛은 걷는다
    cx, cy = 10, 16.4
    for y in range(12, 20):
        for x in range(W):
            if (x, y) in s.px: continue
            d = math.hypot((x + .5 - cx) / 8.8, (y + .5 - cy) / 2.7)
            if 0.82 <= d <= 1.0: s.px[(x, y)] = lt(col, 0.4) if y + .5 >= cy else mix(col, BG, 0.2)   # 앞(아래) 테는 밝게 · 뒤(위)는 어둡게
            elif d < 0.82: s.px[(x, y)] = mix(col, BG, 0.62 if d < 0.4 else 0.76)                     # 속은 은은하게 (가운데가 밝다)
    for a in (0.55, 1.35, 1.8, 2.6):   # 룬 점: 앞 테 위
        q = (int(cx + 8.0 * math.cos(a)), int(cy + 2.45 * math.sin(a)))
        if ok(q): s.px[q] = lt(col, 0.85)
    for (x, y) in [(10, 13), (9, 14), (11, 14)]:   # 마법진에서 보석으로 오르는 빛
        if ok((x, y)) and (x, y) not in s.px: s.px[(x, y)] = mix(col, BG, 0.35)
    motes(s, col, [(3, 4), (17, 3), (2, 10), (18, 10), (5, 13), (15, 12)], big=[(15, 0), (4, 0)])
    return s


VARS = [('A', '마나가 끓는 보석', var_a), ('B', '원석에 박힌 마석', var_b), ('C', '자연과 하나 된 마석', var_c), ('D', '마법진 위에 떠오른 마석', var_d)]
C_NOTE = {'moon': '은빛 깃털 두 장', 'sapph': '얼음 결정 기둥', 'garn': '용암이 흐르는 화산암', 'dia': '천 년 거북 등딱지',
          'opal': '오팔이 된 암모나이트', 'aqua': '조개 + 물방울 막', 'amber': '나뭇가지에 맺힌 진', 'obsid': '움켜쥔 검은 뿌리'}
B_NOTE = {'moon': '흰 장석', 'sapph': '현무암', 'garn': '반짝이는 운모 편암', 'dia': '푸른 킴벌라이트', 'opal': '철 사암(보울더 오팔)',
          'aqua': '분홍 점 페그마타이트', 'amber': '갈탄(나무 화석)', 'obsid': '붉은 화산암'}


def icon(key, v):
    fn = dict((a, f) for a, _, f in VARS)[v]
    return fn(key).px


if __name__ == '__main__':
    from PIL import Image
    im = Image.new('RGB', (len(VARS) * 22 * 6, len(KEYS) * 22 * 6), (24, 20, 30))
    for j, key in enumerate(KEYS):
        for i, (v, _, _) in enumerate(VARS):
            px = icon(key, v)
            for (x, y), c in px.items():
                for a in range(6):
                    for b in range(6): im.putpixel(((i * 22 + 1 + x) * 6 + a - 6 * 1 + 6, (j * 22 + 1 + y) * 6 + b), tuple(c[:3]))
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'maseok3_quick.png')
    im.save(out); print(out)
