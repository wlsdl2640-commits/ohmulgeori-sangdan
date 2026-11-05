"""전사 나머지 스킬 — 둘째 묶음: 전쟁의 함성 · 기사단 돌격 · 거인의 일격 · 검투사의 함성 · 천지개벽"""
import math
import cell
from cell import Art, radial, mix
from w5 import slash, crescent, flash, rays_bg, ring, HILT, FL, pips, BLOOD
from w6 import blank, rows, put, mirror, cm_rows
def bez(p0, p1, p2, t):
    u = 1 - t; return (u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])
def tube(p0, p1, p2, r0, r1, letter):
    """휘어진 관 (뿔피리): 칸마다 가장 가까운 곳의 반지름 안이면 채움. letter(t, side) → 글자"""
    pts = [bez(p0, p1, p2, i / 120) for i in range(121)]
    cm = {}
    for y in range(20):
        for x in range(16):
            px, py = x + 0.5, y + 0.5; best = None
            for i, (qx, qy) in enumerate(pts):
                d = math.hypot(px - qx, py - qy)
                if best is None or d < best[0]: best = (d, i)
            d, i = best; t = i / 120; r = r0 + (r1 - r0) * t ** 1.4
            if d <= r:
                j = min(119, max(1, i)); tx, ty = pts[j + 1][0] - pts[j - 1][0], pts[j + 1][1] - pts[j - 1][1]
                nx, ny = -ty, tx; side = ((px - pts[i][0]) * nx + (py - pts[i][1]) * ny) / (math.hypot(nx, ny) * max(r, 0.3))
                cm[(x, y)] = letter(t, side)
    return cm
# ── 7. 전쟁의 함성: 뿔피리 + 퍼지는 소리 고리 ──
def horn_letter(t, side):
    if 0.30 < t < 0.38 or 0.64 < t < 0.72 or t > 0.93: return 'g' if side < 0.1 else 'G'
    return 'e' if side < -0.25 else 'E' if side > 0.45 else 'c'
HORNP = {'e': ('#fff0d0', 7), 'c': ('#e0c08a', 7), 'E': ('#a8804a', 7), 'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'k': ('#3a1a0a', 1)}
def warcry():
    a = Art().bg(rays_bg(BLOOD, 11.0, 8.5, 13, [0.0, 0.2, 0.42, 0.64, 0.86], 12, '#0e0204', rot=0.1, k=0.45, hole=3))
    for R, c in [(2.6, '#ffffff'), (4.2, '#ffe080'), (5.8, '#ffb050')]:
        ring(a, 11.2, 8.6, R, [(-55, 55)], c, w=0.5)
    cm = tube((2.6, 16.2), (3.4, 8.0), (10.6, 8.4), 0.7, 3.0, horn_letter)
    for (x, y) in [(10, 7), (10, 8), (10, 9)]: cm[(x, y)] = 'k'
    a.sym(cm_rows(cm), HORNP)
    return a, 0
# ── 10. 기사단 돌격: 줄무늬 창 + 손 보호판 + 뒤로 흐르는 속도 줄 + 창끝 번쩍 ──
STEELB = ['#06102a', '#0e2050', '#183680', '#2652b0', '#3c78d8', '#70a8f4']
def lance():
    cm = {}; T = (13.2, 3.8); B = (5.2, 11.8); L = math.hypot(T[0] - B[0], T[1] - B[1])
    ux, uy = (T[0] - B[0]) / L, (T[1] - B[1]) / L; nx, ny = -uy, ux
    for y in range(20):
        for x in range(16):
            px, py = x + 0.5 - B[0], y + 0.5 - B[1]; u = px * ux + py * uy; v = px * nx + py * ny
            if 0 <= u <= L:
                r = 1.9 * (1 - u / L) + 0.25
                if abs(v) <= r:
                    stripe = int((u + v * 0.9) / 1.7) % 2
                    light = v < -0.2 * r * 0 - 0.15 if ny < 0 else v > 0.15
                    cm[(x, y)] = ('w' if light else 'm') if stripe == 0 else ('b' if light else 'B')
    # 손 보호판 (창에 수직, 2칸 두께)
    for j in range(-3, 4):
        for k in (0, 1):
            cx, cy = B[0] - ux * (0.4 + k) + nx * j * 0.75, B[1] - uy * (0.4 + k) + ny * j * 0.75
            cm[(int(cx), int(cy))] = 'n' if j > 0 else 'M'
    # 손잡이
    for k in range(2, 5):
        cx, cy = B[0] - ux * (0.4 + k), B[1] - uy * (0.4 + k); cm[(int(cx), int(cy))] = 'r' if k % 2 else 'R'
    return cm
def kn_charge():
    a = Art().bg(rays_bg(STEELB, 12.0, 4.0, 16, [0.0, 0.2, 0.4, 0.6, 0.8], 14, '#06102a', rot=0.0, k=0.35, hole=3))
    for (x0, y0, n) in [(1, 9, 4), (5, 15, 4), (0, 14, 3)]:
        for i in range(n): a.set(x0 + i, y0 - i, '#cfe6ff' if i else '#ffffff')
    a.sym(cm_rows(lance()), {'w': ('#ffffff', 5), 'm': ('#c8d4e8', 5), 'b': ('#4a7ae8', 12), 'B': ('#2a4aa0', 12), 'r': ('#b0682a', 9), 'R': ('#7a4220', 9)})
    flash(a, 14, 3, big=True)
    return a, 0
# ── 9. 거인의 일격: 앞으로 내지르는 쇠 주먹 + 사방으로 터지는 빛살 ──
FIST = ['................',
        '................',
        '................',
        '................',
        '...mm.mm.mm.m...',
        '..mmMnmMnmMnmM..',
        '..mMMnMMnMMnMM..',
        '..mMMnMMnMMnMM..',
        '..nnnnnnnnnnMM..',
        '..wwwwwwmnMMMM..',
        '..mmmmmmMnMMMM..',
        '..nnnnnnnMMMMM..',
        '...MMMMMMMMMM...',
        '...gggggggGGG...',
        '...gggggggGGG...']
def titanblow():
    a = Art().bg(rays_bg(['#1a0304', '#3a0806', '#7a1408', '#c03410', '#f07020', '#ffc050'], 7.5, 9.5, 11, [0.0, 0.16, 0.34, 0.54, 0.76], 12, '#1a0304', rot=0.13, k=0.55, hole=2.5))
    for ang in range(0, 360, 45):
        r0, r1 = 7.2, 9.5; c = math.cos(math.radians(ang + 22)); s = math.sin(math.radians(ang + 22))
        for k in range(3): a.set(int(7.5 + c * (r0 + k * 0.8)), int(9.5 + s * (r0 + k * 0.8)), '#fff0b0')
    a.sym(FIST, HILT)
    return a, 0
# ── 12. 검투사의 함성: 붉은 가로 볏 청동 투구 + 고함 물결 ──
SAND = ['#2a1404', '#5a2e08', '#8e4e10', '#c0781e', '#e8a238', '#ffd070']
GLAD = ['................',
        '................',
        '....rrrrrrrr....',
        '..rrrrrrrrrrrr..',
        '..RrRrRrRrRrRR..',
        '....yyyyyyyy....',
        '...yyyyyyyyyY...',
        '...yyyyyyyyyY...',
        '...ykkkkkkkkY...',
        '...yk1kkkk1kY...',
        '...yyyykkyyyY...',
        '...yyyk22kyyY...',
        '....yyk33kyY....',
        '....yyk..kyY....',
        '.....y....Y.....']
GLADP = {'r': ('#ff4a3a', 13), 'R': ('#a01a1a', 13), 'y': ('#e8b050', 6), 'Y': ('#a8702a', 6), '1': ('#ffffff', 1), '2': ('#c01818', 1), '3': ('#ffffff', 1)}
def ar_roar():
    a = Art().bg(rays_bg(SAND, 7.5, 9.5, 11.5, [0.0, 0.2, 0.42, 0.64, 0.86], 10, '#2a1404', rot=0.31, k=0.4, hole=3.5))
    ring(a, 7.5, 10.5, 7.0, [(150, 210), (-30, 30)], '#fff0c0')
    ring(a, 7.5, 10.5, 8.6, [(155, 205), (-25, 25)], '#ffc060')
    a.sym(GLAD, GLADP)
    return a, 0
# ── 15. 천지개벽 (2차 각성): 하늘(별 밤)과 땅(갈라진 바위)을 비스듬히 가르는 빛 ──
def awk2_warrior():
    a = Art()
    SKYC = ['#06041e', '#120a3e', '#22146a', '#3a2496']
    EAR = ['#3a1404', '#622408', '#8e3a0e', '#c05a16', '#f08a24']
    for y in range(20):
        for x in range(16):
            v = x + y - 16            # 0이 가른 줄
            if v < 0:
                d = math.hypot(x - 2, y - 2); a.set(x, y, SKYC[min(3, int((16 - d) / 4.5))] if d < 16 else SKYC[0])
            else:
                k = 4 if v <= 1 else 3 if v <= 3 else 2 if v <= 6 else 1 if v <= 10 else 0
                if (x * 3 + y * 5) % 11 == 0 and v > 3: k = max(0, k - 1)
                a.set(x, y, EAR[k])
    for (x, y) in [(3, 6), (6, 3), (9, 2), (1, 9), (5, 8), (2, 12)]: a.set(x, y, '#ffffff')
    a.paint(['.h.', 'hwh', '.h.'], {'h': '#b0c0ff', 'w': '#ffffff'}, ox=3, oy=3)
    a.paint(['.mm', 'm..', 'm..', '.mm'], {'m': '#fff4c0'}, ox=7, oy=4)
    for x in range(16):
        for y in range(20):
            v = x + y - 16; t = abs((x - y) + 1) / 18
            w = 1.6 * (1 - t ** 2)
            if abs(v + 0.5) <= w * 0.45: a.set(x, y, '#ffffff')
            elif abs(v + 0.5) <= w * 0.95: a.set(x, y, '#fff0a0')
            elif abs(v + 0.5) <= w * 1.5: a.set(x, y, '#ffb040' if v >= 0 else '#c0a0ff')
    return a, 0
ICONS = {'warcry': ('전쟁의 함성', 'buff', warcry), 'kn_charge': ('기사단 돌격', 'dmg', kn_charge), 'titanblow': ('거인의 일격', 'dmg', titanblow),
         'ar_roar': ('검투사의 함성', 'buff', ar_roar), 'awk2_warrior': ('천지개벽', 'dmg', awk2_warrior)}
