"""마석 시안 (빌드 69, 11-13 20:28 사용자 「마석이라 이름짓고 형태는 보석으로 하고, 보석들 이름에 마법과 관련된 걸 붙이는데,
효과를 회피 · 방어 · 반격 같은 걸로 — 시안하고 효과」). 모든 장비(일반 포함)에 마석 칸이 딱 하나.
20×20 도트, 왼쪽 위 빛. 깎은 보석은 면마다 밝기(면이 왼쪽 위를 보면 밝게), 문스톤 · 오팔 · 호박은 둥근 알(카보숑).
등급 넷 = 하급(작은 원석) · 중급(깎은 알) · 상급(큰 알 + 마력 무늬) · 최상급(큰 알 + 둘레 빛 + 기운 점 + 빛 한 점) — 룬의 등급 결과 같다.
게임에는 아직 넣지 않는다 (사용자가 고른 뒤)."""
import math
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'runeart64'))
from kit import Ic, P, C, E, mix, lt, dk, hx, K, W, H, rast
from runes64 import glint, top

WH = (255, 255, 255)
LIGHT = (-0.62, -0.78)


def _cent(pts):
    return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)


def poly_n(cx, cy, rx, ry, n, rot=0.0):
    return [(cx + rx * math.cos(rot + 2 * math.pi * i / n), cy + ry * math.sin(rot + 2 * math.pi * i / n)) for i in range(n)]


def facet_gem(s, outer, pal, k=0.5, steps=1, sigil=None, sig_col=None, edges=False, alt=False, trot=0.0):
    """깎은 보석: outer(시계 방향 볼록 다각형) 안을 가운데 판(table) + 둘레 면으로. pal = 밝음 → 어두움 다섯 색.
    steps 2면 계단 깎기(에메랄드 컷)처럼 둘레 면이 두 겹."""
    cx, cy = _cent(outer); n = len(outer)
    rings = [outer]
    for j in range(1, steps + 1):
        kk = 1 - (1 - k) * j / steps
        rings.append([(cx + (x - cx) * kk, cy + (y - cy) * kk) for (x, y) in outer])
    if trot:   # 판을 돌려 별 면 (브릴리언트)
        rings[-1] = [(cx + (x - cx) * math.cos(trot) - (y - cy) * math.sin(trot), cy + (x - cx) * math.sin(trot) + (y - cy) * math.cos(trot)) for (x, y) in rings[-1]]
    table = rings[-1]
    M = rast(P(outer)); T = rast(P(table))
    def facet_col(i, ring):
        (x0, y0), (x1, y1) = outer[i], outer[(i + 1) % n]
        ex, ey = x1 - x0, y1 - y0; L = math.hypot(ex, ey) or 1
        nx, ny = ey / L, -ex / L                     # 바깥쪽 법선 (시계 방향)
        if nx * (x0 - cx) + ny * (y0 - cy) < 0: nx, ny = -nx, -ny
        b = nx * LIGHT[0] + ny * LIGHT[1]            # 1 = 왼쪽 위를 본다
        if ring > 0: b = b * 0.6 - 0.1               # 안쪽 겹은 조금 어둡게
        if alt and i % 2: b -= 0.45                  # 번갈아 어두운 면 (반짝임)
        return pal[0] if b > 0.55 else pal[1] if b > 0.1 else pal[2] if b > -0.35 else pal[3] if b > -0.75 else pal[4]
    for (x, y) in M:
        px, py = x + .5, y + .5
        if (x, y) in T:
            t = ((px - cx) * LIGHT[0] + (py - cy) * LIGHT[1])
            s.px[(x, y)] = pal[0] if t > 1.2 else pal[1]
            continue
        # 어느 둘레 면인가: 가운데에서 본 각으로 가장 가까운 변
        a = math.atan2(py - cy, px - cx); best = None
        for i in range(n):
            (x0, y0), (x1, y1) = outer[i], outer[(i + 1) % n]
            a0 = math.atan2(y0 - cy, x0 - cx); a1 = math.atan2(y1 - cy, x1 - cx)
            d0 = (a - a0) % (2 * math.pi); d1 = (a1 - a0) % (2 * math.pi)
            if d0 <= d1: best = i; break
        if best is None: best = 0
        ring = 0
        if steps > 1:
            for j in range(1, steps):
                if (x, y) in rast(P(rings[j])): ring = j
        s.px[(x, y)] = facet_col(best, ring)
    if edges:   # 판 꼭짓점 → 바깥 꼭짓점 줄 (면이 또렷하게)
        from kit import path
        for i in range(n):
            for q in path([(table[i][0] - .5, table[i][1] - .5), (outer[i][0] - .5, outer[i][1] - .5)]):
                if q in M and q not in T:
                    up = (q[0] - cx) * LIGHT[0] + (q[1] - cy) * LIGHT[1] > 0
                    s.px[q] = mix(s.px[q], pal[4] if not up else pal[2], 0.55)
    s.O |= M
    if sigil:
        for (dx, dy) in sigil:
            q = (round(cx - .5 + dx), round(cy - .5 + dy))
            if q in T: s.px[q] = sig_col
    return M


def cabochon(s, f, pal, sheen=None):
    """둥근 알: 왼쪽 위가 밝고 오른쪽 아래가 어두운 다섯 단, sheen = [(칸들, 색)]"""
    M = rast(f)
    xs = [p[0] for p in M]; ys = [p[1] for p in M]
    cx = (min(xs) + max(xs) + 1) / 2; cy = (min(ys) + max(ys) + 1) / 2
    R = max(max(xs) - min(xs) + 1, max(ys) - min(ys) + 1) / 2
    for (x, y) in M:
        d = ((x + .5 - cx) * LIGHT[0] + (y + .5 - cy) * LIGHT[1]) / R
        edge = any((x + dx, y + dy) not in M for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        c = pal[0] if d > 0.62 else pal[1] if d > 0.18 else pal[2] if d > -0.3 else pal[3] if d > -0.7 else pal[4]
        if edge and d < 0: c = pal[min(4, pal.index(c) + 1)]
        s.px[(x, y)] = c
    for pts, col in (sheen or []):
        for q in pts:
            if q in M: s.px[q] = col
    s.O |= M
    return M


# ── 보석 여덟 (효과 · 이름) ──
PAL = {
    'moon':  [hx('#f4fbff'), hx('#cfe4f8'), hx('#9cbede'), hx('#6c8eb6'), hx('#4a6488')],
    'sapph': [hx('#bcd6ff'), hx('#6a9cff'), hx('#3a64d8'), hx('#243e9e'), hx('#16245e')],
    'garn':  [hx('#ffb0b4'), hx('#e0404c'), hx('#a81e32'), hx('#701424'), hx('#420a16')],
    'dia':   [hx('#ffffff'), hx('#e6f2ff'), hx('#bcd2ec'), hx('#8aa4c8'), hx('#60789e')],
    'opal':  [hx('#fbf6ff'), hx('#e4dcf4'), hx('#bcb2d8'), hx('#8a80b0'), hx('#5e5686')],
    'aqua':  [hx('#e4fffb'), hx('#9cf0e6'), hx('#58c8c4'), hx('#2e8e96'), hx('#1a5a66')],
    'amber': [hx('#fff0b4'), hx('#ffc24a'), hx('#e08a1c'), hx('#a85a10'), hx('#6a3608')],
    'obsid': [hx('#b8a8e8'), hx('#5a4a8a'), hx('#34284e'), hx('#1e1630'), hx('#0e0a18')],
}
GLOW = {'moon': hx('#9ad0ff'), 'sapph': hx('#6a9cff'), 'garn': hx('#ff5a64'), 'dia': hx('#e8f4ff'),
        'opal': hx('#e0b0ff'), 'aqua': hx('#6af0e0'), 'amber': hx('#ffc040'), 'obsid': hx('#a080ff')}
SIG = [(0, -1), (-1, 0), (1, 0), (0, 1)]          # 마력 무늬 (상급부터 판 가운데 네 점 — 마름모)
SIG_X = [(-1, -1), (1, -1), (-1, 1), (1, 1)]


def size(lv): return (3.6, 4.8, 6.0, 6.2)[lv]


def g_moon(lv):      # 회피 — 환영의 문스톤: 둥근 알, 위쪽에 푸른 빛 결(아둘라레센스)
    s = Ic(); r = size(lv)
    M = cabochon(s, E(10, 10.4, r, r * 0.86), PAL['moon'])
    band = [(x, y) for (x, y) in M if abs((x + .5 - 9.4) * 0.55 + (y + .5 - (10.4 - r * 0.42))) < 0.9 and y + .5 < 10.4]
    for q in band: s.px[q] = hx('#a8d8ff') if lv < 2 else hx('#8ac8ff')
    if lv >= 2:
        for q in [(9, 10), (11, 10), (10, 9), (10, 11)]:
            if q in M: s.px[q] = mix(s.px[q], hx('#6aa8ff'), 0.5)
    return s


def g_sapph(lv):     # 막기 — 결계의 사파이어: 쿠션 컷 (모서리를 깎은 네모)
    s = Ic(); r = size(lv) + 0.1; c = 0.62
    out = [(10 - r * c, 10 - r), (10 + r * c, 10 - r), (10 + r, 10 - r * c), (10 + r, 10 + r * c), (10 + r * c, 10 + r), (10 - r * c, 10 + r), (10 - r, 10 + r * c), (10 - r, 10 - r * c)]
    facet_gem(s, out, PAL['sapph'], k=0.5, sigil=SIG if lv >= 2 else None, sig_col=hx('#e8f0ff'), edges=lv >= 1)
    return s


def g_garn(lv):      # 반격 — 역류의 가넷: 트릴리언 컷 (세모 — 맞받아치는 칼끝)
    s = Ic(); r = size(lv) + 1.0
    out = [(10, 10.6 - r * 1.05), (10 + r * 0.98, 10.6 + r * 0.62), (10 - r * 0.98, 10.6 + r * 0.62)]
    facet_gem(s, out, PAL['garn'], k=0.42, sigil=[(0, 0), (-1, 1), (1, 1)] if lv >= 2 else None, sig_col=hx('#ffd0d0'))
    return s


def g_dia(lv):       # 피해 감소 — 수호진의 다이아몬드: 옆에서 본 브릴리언트 (평평한 윗면 · 비스듬한 크라운 · 뾰족한 아래)
    s = Ic(); r = size(lv) + 0.6
    w, tw = r * 1.12, r * 0.56
    y0, y1, y2 = 10 - r * 0.78, 10 - r * 0.18, 10 + r * 1.02
    cw = [hx('#ffffff'), hx('#e4f2ff'), hx('#b8d4f0'), hx('#8aaad4'), hx('#5c78a8'), hx('#3c5280')]
    parts = [
        ([(10 - tw, y0), (10 - tw * 0.3, y0), (10 - w * 0.36, y1), (10 - w, y1)], cw[0]),
        ([(10 - tw * 0.3, y0), (10 + tw * 0.3, y0), (10 + w * 0.36, y1), (10 - w * 0.36, y1)], cw[1]),
        ([(10 + tw * 0.3, y0), (10 + tw, y0), (10 + w, y1), (10 + w * 0.36, y1)], cw[2]),
        ([(10 - w, y1), (10 - w * 0.36, y1), (10, y2)], cw[2]),
        ([(10 - w * 0.36, y1), (10 + w * 0.36, y1), (10, y2)], cw[3]),
        ([(10 + w * 0.36, y1), (10 + w, y1), (10, y2)], cw[4]),
    ]
    M = set()
    for poly, col in parts:
        sub = rast(P(poly)) - M
        for q in sub: s.px[q] = col
        M |= sub
    if lv >= 1:   # 크라운과 아래 사이 띠(거들) 한 줄 밝게
        for (x, y) in M:
            if abs(y + .5 - y1) < 0.5: s.px[(x, y)] = mix(s.px[(x, y)], cw[0], 0.45)
    if lv >= 2:   # 마력 무늬: 크라운 가운데에 네 점
        for q in ((10, int(y0 + 1)), (9, int(y0 + 2)), (11, int(y0 + 2)), (10, int(y0 + 3))):
            if q in M: s.px[q] = hx('#9ac0ec')
    s.O |= M
    return s


def g_opal(lv):      # 반사 — 거울 마법의 오팔: 달걀꼴 알, 무지갯빛 점(유색 효과)
    s = Ic(); r = size(lv)
    M = cabochon(s, E(10, 10, r * 0.82, r), PAL['opal'])
    flecks = [((8, 8), '#8af0e0'), ((11, 9), '#ff9ad0'), ((9, 11), '#ffe07a'), ((12, 12), '#8ab0ff'), ((10, 13), '#a8f08a'), ((8, 12), '#ff8a8a'), ((11, 6), '#c8a8ff')]
    for (q, col) in flecks[:3 + lv]:
        if q in M: s.px[q] = hx(col)
    return s


def g_aqua(lv):      # 보호막 — 방벽의 아쿠아마린: 에메랄드 컷 (긴 팔각, 계단 깎기)
    s = Ic(); r = size(lv)
    rx, ry, c = r * 0.78, r * 1.08, 0.36
    out = [(10 - rx * (1 - c), 10 - ry), (10 + rx * (1 - c), 10 - ry), (10 + rx, 10 - ry * (1 - c * 0.7)), (10 + rx, 10 + ry * (1 - c * 0.7)),
           (10 + rx * (1 - c), 10 + ry), (10 - rx * (1 - c), 10 + ry), (10 - rx, 10 + ry * (1 - c * 0.7)), (10 - rx, 10 - ry * (1 - c * 0.7))]
    facet_gem(s, out, PAL['aqua'], k=0.42, steps=2 if lv >= 1 else 1, sigil=[(0, -1), (0, 0), (0, 1)] if lv >= 2 else None, sig_col=hx('#f0fffc'))
    return s


def g_amber(lv):     # 버티기 — 불멸의 호박: 물방울꼴 알, 속에 갇힌 금빛 씨
    s = Ic(); r = size(lv)
    f = lambda x, y: ((x - 10) ** 2 / (r * 0.8) ** 2 + (y - 11.4) ** 2 / (r * 0.78) ** 2 <= 1) or (abs(x - 10) <= (y - (11.4 - r * 1.55)) * 0.62 and y < 11.4 and y > 11.4 - r * 1.55)
    M = cabochon(s, f, PAL['amber'])
    core = [(10, 12), (9, 12), (10, 11)] if lv >= 1 else [(10, 12)]
    for q in core:
        if q in M: s.px[q] = hx('#fff4c0') if lv >= 2 else hx('#ffd870')
    return s


def g_obsid(lv):     # 은신 — 은신의 흑요석: 마키즈 컷 (끝이 뾰족한 길쭉한 알), 검보랏빛
    s = Ic(); r = size(lv) + 0.8
    out = [(10, 10 - r * 1.12), (10 + r * 0.42, 10 - r * 0.62), (10 + r * 0.56, 10), (10 + r * 0.42, 10 + r * 0.62), (10, 10 + r * 1.12),
           (10 - r * 0.42, 10 + r * 0.62), (10 - r * 0.56, 10), (10 - r * 0.42, 10 - r * 0.62)]
    facet_gem(s, out, PAL['obsid'], k=0.42, sigil=[(0, -1), (0, 1)] if lv >= 2 else None, sig_col=hx('#c8b0ff'))
    return s


# (함수, 보석, 이름, 효과, 등급 값 넷, 합쳐서 상한, 기호)
STONES = [
    (g_moon,  'moon',  '환영의 문스톤',   '회피',        '회피 +1 · 2 · 3.5 · 5%p',                    '+15%p'),
    (g_sapph, 'sapph', '결계의 사파이어', '막기',        '방어 확률 +1 · 2 · 3.5 · 5%p (막으면 피해 1/4)', '+15%p'),
    (g_garn,  'garn',  '역류의 가넷',     '반격',        '반격 확률 +2 · 3 · 5 · 8%p',                 '+25%p'),
    (g_dia,   'dia',   '수호진의 다이아몬드', '피해 감소', '받는 피해 −1 · 2 · 3 · 5%',                  '−15%'),
    (g_opal,  'opal',  '거울 마법의 오팔', '반사',       '받은 피해의 3 · 5 · 8 · 12%를 되돌려 준다',    '30%'),
    (g_aqua,  'aqua',  '방벽의 아쿠아마린', '보호막',    '싸움을 시작할 때 최대 HP 2 · 3 · 5 · 8% 보호막', '25%'),
    (g_amber, 'amber', '불멸의 호박',     '버티기',      '쓰러질 한 방을 HP 1로 버틸 확률 5 · 10 · 15 · 25% (싸움마다 한 번)', '50%'),
    (g_obsid, 'obsid', '은신의 흑요석',   '은신',        '적에게 노려질 확률 −3 · 5 · 8 · 12%',          '−40%'),
]


def icon(i, lv):
    fn, key = STONES[i][0], STONES[i][1]
    s = fn(lv)
    s.done()
    if lv == 3: top(s, GLOW[key], n=6, rot=0.3, glints=((16, 3),))
    elif lv == 2: glint(s, 15, 4, GLOW[key])
    return s.px
