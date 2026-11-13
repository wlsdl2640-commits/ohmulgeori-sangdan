"""마석 시안 2 (빌드 69, 11-13 21:22 사용자 「마석은 보석 원형 그대로 · 여러 등급을 없애고 에픽(영웅)으로 고정 ·
호박은 안에 발톱이 들어 있게 · 큼지막한 보석으로 디자인」).
시안 1(maseok.py)의 깎기 여덟을 그대로 두고, 등급 없이 한 장씩 크게(지름 15~17칸) 그린다. 왼쪽 위 빛 · 빛 한 점은 대각(／)만.
게임에는 아직 넣지 않는다 (사용자가 고른 뒤)."""
import math
import os
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, '..', 'runeart64'))
from kit import Ic, P, E, mix, lt, dk, hx, rast, path   # noqa: E402
from runes64 import glint   # noqa: E402
from maseok import facet_gem, cabochon, PAL, GLOW   # noqa: E402

R = 8.4   # 큰 보석 반지름 (시안 1 최상급은 6.2) — 칸 20×20을 거의 채운다


def _ring(cells, M):
    """cells 중 M 안 것만"""
    return [q for q in cells if q in M]


def g_moon():      # 회피 — 환영의 문스톤: 둥근 알, 위쪽을 가로지르는 푸른 빛 결(아둘라레센스) 두 줄 + 흐린 그림자 알
    s = Ic()
    M = cabochon(s, E(10, 10.2, R, R * 0.9), PAL['moon'])
    cx, cy, rx, ry = 10, 10.2, R, R * 0.9
    for (x, y) in M:   # 아둘라레센스: 돔 왼쪽 위를 따라 흐르는 푸른 빛 한 줄기 (안쪽은 옅게)
        u, v = (x + .5 - cx) / rx, (y + .5 - cy) / ry
        d = math.hypot(u, v); a = math.atan2(v, u)
        if -2.75 < a < -0.55:
            if 0.5 < d < 0.74: s.px[(x, y)] = hx('#86c0ff')
            elif 0.36 < d <= 0.5: s.px[(x, y)] = mix(s.px[(x, y)], hx('#b4d8ff'), 0.6)
    for q in _ring([(6, 5), (7, 5)], M): s.px[q] = (255, 255, 255)
    return s, None


def g_sapph():     # 막기 — 결계의 사파이어: 쿠션 컷 + 판 위 결계 고리(속이 빈 마름모)
    s = Ic(); r = R + 0.2; c = 0.6
    out = [(10 - r * c, 10 - r), (10 + r * c, 10 - r), (10 + r, 10 - r * c), (10 + r, 10 + r * c), (10 + r * c, 10 + r), (10 - r * c, 10 + r), (10 - r, 10 + r * c), (10 - r, 10 - r * c)]
    M = facet_gem(s, out, PAL['sapph'], k=0.52, edges=True)
    ward = [(9, 7), (10, 7), (8, 8), (11, 8), (7, 9), (12, 9), (7, 10), (12, 10), (8, 11), (11, 11), (9, 12), (10, 12)]
    for q in _ring(ward, M): s.px[q] = hx('#dce8ff')
    for q in _ring([(5, 4), (6, 4)], M): s.px[q] = (255, 255, 255)
    return s, None


def g_garn():      # 반격 — 역류의 가넷: 트릴리언 컷(세모) + 판 가운데 거꾸로 선 작은 세모(되받아침)
    s = Ic(); r = R + 0.6
    out = [(10, 10.8 - r * 1.02), (10 + r * 0.96, 10.8 + r * 0.6), (10 - r * 0.96, 10.8 + r * 0.6)]
    M = facet_gem(s, out, PAL['garn'], k=0.46, edges=True)
    for q in _ring([(8, 10), (9, 10), (10, 10), (11, 10), (9, 11), (10, 11)], M): s.px[q] = hx('#ffc8cc')
    for q in _ring([(8, 5), (8, 6)], M): s.px[q] = (255, 255, 255)
    return s, None


def g_dia():       # 피해 감소 — 수호진의 다이아몬드: 옆에서 본 브릴리언트, 크라운 면을 다섯으로
    s = Ic(); r = R - 0.6
    w, tw = r * 1.12, r * 0.52
    y0, y1, y2 = 10 - r * 0.74, 10 - r * 0.16, 10 + r * 1.04
    cw = [hx('#ffffff'), hx('#e6f3ff'), hx('#bcd6f2'), hx('#8cacd6'), hx('#5e7aaa'), hx('#3e5482')]
    parts = [
        ([(10 - tw, y0), (10 - tw * 0.35, y0), (10 - w * 0.42, y1), (10 - w, y1)], cw[0]),
        ([(10 - tw * 0.35, y0), (10 + tw * 0.35, y0), (10 + w * 0.42, y1), (10 - w * 0.42, y1)], cw[1]),
        ([(10 + tw * 0.35, y0), (10 + tw, y0), (10 + w, y1), (10 + w * 0.42, y1)], cw[2]),
        ([(10 - w, y1), (10 - w * 0.55, y1), (10, y2)], cw[1]),
        ([(10 - w * 0.55, y1), (10 - w * 0.12, y1), (10, y2)], cw[2]),
        ([(10 - w * 0.12, y1), (10 + w * 0.3, y1), (10, y2)], cw[3]),
        ([(10 + w * 0.3, y1), (10 + w, y1), (10, y2)], cw[4]),
    ]
    M = set()
    for poly, col in parts:
        sub = rast(P(poly)) - M
        for q in sub: s.px[q] = col
        M |= sub
    for (x, y) in M:   # 거들(크라운과 아래 사이) 한 줄
        if abs(y + .5 - y1) < 0.5: s.px[(x, y)] = mix(s.px[(x, y)], cw[0], 0.5)
    for q in _ring([(9, int(y0 + 1)), (10, int(y0 + 1)), (8, int(y0 + 2)), (11, int(y0 + 2))], M): s.px[q] = hx('#a4c4ec')   # 수호진 무늬: 크라운 위 낮은 아치
    s.O |= M
    for q in _ring([(6, 5), (7, 5)], M): s.px[q] = (255, 255, 255)
    return s, None


def g_opal():      # 반사 — 거울 마법의 오팔: 달걀꼴 알, 무지갯빛 점이 가득(유색 효과)
    s = Ic()
    M = cabochon(s, E(10, 10, R * 0.84, R), PAL['opal'])
    flecks = [((7, 6), '#8af0e0'), ((11, 7), '#ff9ad0'), ((9, 9), '#ffe07a'), ((12, 10), '#8ab0ff'), ((8, 12), '#a8f08a'), ((10, 13), '#ff8a8a'),
              ((13, 13), '#c8a8ff'), ((6, 10), '#ffd08a'), ((12, 5), '#9af0ff'), ((9, 15), '#ffb0e8'), ((14, 9), '#a8ffc8'), ((8, 7), '#ffc8f0')]
    for (q, col) in flecks:
        if q in M: s.px[q] = hx(col)
        r2 = (q[0] + 1, q[1])
        if r2 in M and (q[0] + q[1]) % 3 == 0: s.px[r2] = mix(hx(col), s.px[r2], 0.5)
    for q in _ring([(7, 4), (8, 4)], M): s.px[q] = (255, 255, 255)
    return s, None


def g_aqua():      # 보호막 — 방벽의 아쿠아마린: 에메랄드 컷(긴 팔각) · 계단 깎기 두 겹 · 판 가운데 세로 빛줄
    s = Ic(); r = R
    rx, ry, c = r * 0.8, r * 1.04, 0.34
    out = [(10 - rx * (1 - c), 10 - ry), (10 + rx * (1 - c), 10 - ry), (10 + rx, 10 - ry * (1 - c * 0.7)), (10 + rx, 10 + ry * (1 - c * 0.7)),
           (10 + rx * (1 - c), 10 + ry), (10 - rx * (1 - c), 10 + ry), (10 - rx, 10 + ry * (1 - c * 0.7)), (10 - rx, 10 - ry * (1 - c * 0.7))]
    M = facet_gem(s, out, PAL['aqua'], k=0.4, steps=2)
    for q in _ring([(6, 3), (7, 3)], M): s.px[q] = (255, 255, 255)
    return s, None


def claw_cells(pts, r0, r1, n=40):
    """굽은 발톱: pts(베지어 조절점 넷)를 따라 굵기 r0 → r1로 가늘어지는 칸"""
    (ax, ay), (bx, by), (cx, cy), (dx, dy) = pts
    out = {}
    for i in range(n + 1):
        t = i / n; mt = 1 - t
        x = mt ** 3 * ax + 3 * mt * mt * t * bx + 3 * mt * t * t * cx + t ** 3 * dx
        y = mt ** 3 * ay + 3 * mt * mt * t * by + 3 * mt * t * t * cy + t ** 3 * dy
        r = r0 + (r1 - r0) * t
        for qx in range(int(x - r - 1), int(x + r + 2)):
            for qy in range(int(y - r - 1), int(y + r + 2)):
                if (qx + .5 - x) ** 2 + (qy + .5 - y) ** 2 <= r * r:
                    out.setdefault((qx, qy), t)
    return out


def g_amber():     # 버티기 — 불멸의 호박: 속이 비치는 호박(가운데가 밝다) 안에 갇힌 짐승 발톱 — 뿌리는 굵고 잘린 마디, 끝은 갈고리
    s = Ic(); r = R
    cx, cy = 10, 10.8
    f = lambda x, y: ((x - cx) ** 2 / (r * 0.9) ** 2 + (y - cy) ** 2 / (r * 0.86) ** 2 <= 1) or (abs(x - cx) <= (y - (cy - r * 1.1)) * 0.8 and cy - r * 1.1 < y < cy)
    M = rast(f)
    for (x, y) in M:   # 빛이 비쳐 가운데가 밝고, 테로 갈수록 짙은 주황 · 오른쪽 아래 테는 더 짙게
        d = math.hypot((x + .5 - cx) / (r * 0.9), (y + .5 - cy) / (r * 0.86))
        br = (x + .5 - cx) + (y + .5 - cy) > r * 0.5 and d > 0.72
        s.px[(x, y)] = hx('#8a460c') if br and d > 0.86 else hx('#c87418') if d > 0.86 or br else hx('#ec9a2c') if d > 0.66 else hx('#ffbe48') if d > 0.4 else hx('#ffd878')
    s.O |= M
    # 발톱(손으로 친 칸): 왼쪽 뿌리(굵기 4칸, 잘린 단면)에서 위로 둥글게 넘어가 오른쪽으로 내려오며 가늘어져 왼쪽 아래로 뾰족한 갈고리
    ROWS = {5: [(7, 9)], 6: [(5, 11)], 7: [(4, 12)], 8: [(4, 6), (9, 13)], 9: [(4, 5), (11, 14)], 10: [(12, 14)], 11: [(12, 14)],
            12: [(12, 13)], 13: [(11, 13)], 14: [(11, 12)], 15: [(10, 11)], 16: [(10, 10)]}
    claw = {(x, y) for y, spans in ROWS.items() for (a0, a1) in spans for x in range(a0, a1 + 1)}
    dark, edge = hx('#2a1206'), hx('#5a2c0e')
    for (x, y) in claw:
        outer = (x, y - 1) not in claw or (x + 1, y) not in claw
        s.px[(x, y)] = edge if outer and y < 13 else dark
    for (x, y) in [(4, 7), (4, 8)]: s.px[(x, y)] = hx('#e8bc80')     # 잘린 뿌리 단면: 속 뼈
    for (x, y) in [(4, 9), (5, 9)]: s.px[(x, y)] = hx('#8a5a2a')
    for q in _ring([(7, 14), (15, 6), (5, 12), (14, 15)], M): s.px[q] = hx('#fff4cc')   # 공기 방울
    for q in _ring([(7, 4), (8, 4), (7, 5)], M): s.px[q] = (255, 255, 255)
    return s, None


def g_obsid():     # 은신 — 은신의 흑요석: 마키즈 컷(끝이 뾰족한 길쭉한 알) · 속에 피어오르는 보랏빛 연기 한 줄기
    s = Ic(); r = R - 0.4
    out = [(10, 10 - r * 1.1), (10 + r * 0.44, 10 - r * 0.6), (10 + r * 0.58, 10), (10 + r * 0.44, 10 + r * 0.6), (10, 10 + r * 1.1),
           (10 - r * 0.44, 10 + r * 0.6), (10 - r * 0.58, 10), (10 - r * 0.44, 10 - r * 0.6)]
    M = facet_gem(s, out, PAL['obsid'], k=0.44, edges=True)
    for q in _ring([(10, 14), (9, 13), (9, 12), (10, 11), (10, 10), (9, 9), (9, 8)], M): s.px[q] = hx('#7a62b8')
    for q in _ring([(8, 4), (8, 5)], M): s.px[q] = (214, 200, 255)
    return s, None


# (함수, 보석 키, 이름, 갈래, 한 개 효과, 합쳐서 상한)
STONES = [
    (g_moon,  'moon',  '환영의 문스톤',       '회피',      '회피 +2%p',                                  '12%p'),
    (g_sapph, 'sapph', '결계의 사파이어',     '막기',      '막을 확률 +2%p (막으면 피해 1/4)',            '12%p'),
    (g_garn,  'garn',  '역류의 가넷',         '반격',      '반격 확률 +3%p',                             '18%p'),
    (g_dia,   'dia',   '수호진의 다이아몬드', '피해 감소', '받는 피해 −2%',                              '−12%'),
    (g_opal,  'opal',  '거울 마법의 오팔',    '반사',      '받은 피해의 4%를 되돌려 준다',                '24%'),
    (g_aqua,  'aqua',  '방벽의 아쿠아마린',   '보호막',    '싸움을 시작할 때 최대 HP 3% 보호막',          '18%'),
    (g_amber, 'amber', '불멸의 호박',         '버티기',    '쓰러질 한 방을 HP 1로 버틸 확률 8% (싸움마다 한 번)', '48%'),
    (g_obsid, 'obsid', '은신의 흑요석',       '은신',      '적에게 노려질 확률 −5%',                      '−30%'),
]


def icon(i):
    fn, key = STONES[i][0], STONES[i][1]
    s, gl = fn()
    s.done()
    if gl: glint(s, gl[0], gl[1], GLOW[key])
    return s.px
