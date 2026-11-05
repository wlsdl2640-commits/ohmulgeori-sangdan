"""부장비 시안 (빌드 38 예정): 계열마다 하나 × 단계 4모습 (견습·숲지기 / 강철·폭풍 / 서리·사막왕 / 그 위).
아이템 그림이라 배경 없이 (16×20칸, 테두리 + B4 손질). python3 offhand.py → offhand_sheet.png"""
import math, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import cell
from cell import Art, mix, W, H
from lib import *
import mast
KEY = (255, 0, 255)
def item(): return Art(KEY)
def grid_of(cm): return grid(cm)
GOLD = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
# ───────── 방패 (전사·마부 계열) ─────────
def shield_round(a):   # 1: 나무 원형 방패 + 쇠 테 + 가운데 쇠 돌기
    cm = {}; cx, cy, r = 7.5, 9.5, 6.4
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            if d < r - 1.0: cm[(x, y)] = 'T' if x in (4, 8, 11) else 't'
            elif d < r: cm[(x, y)] = 'm' if (x + 0.5 - cx) + (y + 0.5 - cy) < 0 else 'M'
    for (x, y) in [(6, 8), (7, 8), (8, 8), (6, 9), (7, 9), (8, 9), (6, 10), (7, 10), (8, 10)]: cm[(x, y)] = 'm' if (x, y) != (8, 10) else 'M'
    cm[(6, 8)] = 'w'
    for (x, y) in [(7, 4), (3, 9), (12, 9), (7, 15)]: cm[(x, y)] = 'n'    # 못
    sp(a, grid(cm), {'t': ('#b8823e', 3), 'T': ('#7a4c22', 3)})
def heater(cm, x0, y0, w, h, edge, field):
    """위가 평평하고 아래가 뾰족한 방패 꼴: 테두리 edge, 안 field(함수 또는 글자)"""
    cells = set()
    for j in range(h):
        hw = w / 2 if j < h * 0.45 else (w / 2) * max(0.0, 1 - ((j - h * 0.45) / (h * 0.55)) ** 1.6)
        for i in range(w):
            if abs(i + 0.5 - w / 2) <= hw: cells.add((x0 + i, y0 + j))
    for (x, y) in cells:
        inner = all((x + dx, y + dy) in cells for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        cm[(x, y)] = (field(x, y) if callable(field) else field) if inner else edge(x, y) if callable(edge) else edge
    return cells
def shield_heater(a):   # 2: 강철 히터 방패 + 붉은 세로띠
    cm = {}
    heater(cm, 2, 3, 12, 15, lambda x, y: 'm' if x < 8 else 'M', lambda x, y: 'r' if 6 <= x <= 9 else ('m' if x < 7 else 'M'))
    for (x, y) in [(4, 5), (11, 5)]: cm[(x, y)] = 'n'
    sp(a, grid(cm))
def shield_kite(a):   # 3: 기사 연 방패 + 금 테 + 금 십자
    cm = {}
    heater(cm, 2, 2, 12, 17, lambda x, y: 'y' if x < 8 else 'Y', lambda x, y: 'b' if (x + y) % 7 else 'B')
    for y in range(5, 15): cm[(7, y)] = 'y'; cm[(8, y)] = 'Y'
    for x in range(4, 12): cm[(x, 8)] = 'y' if x < 8 else 'Y'
    sp(a, grid(cm), GOLD)
def shield_gold(a):   # 4: 황금 성방패 + 날개 장식 + 붉은 보석
    cm = {}
    heater(cm, 3, 3, 10, 15, lambda x, y: 'y' if x < 8 else 'Y', lambda x, y: 'e' if x < 8 else 'E')
    for (x, y) in [(1, 3), (2, 2), (2, 3), (2, 4), (1, 5), (14, 3), (13, 2), (13, 3), (13, 4), (14, 5), (0, 4), (15, 4)]: cm[(x, y)] = 'w' if x < 8 else 'f'
    for y in range(5, 15): cm[(7, y)] = 'y'; cm[(8, y)] = 'Y'
    for x in range(5, 11): cm[(x, 7)] = 'y' if x < 8 else 'Y'
    for (x, y, c) in [(7, 9, 'r'), (8, 9, 'R'), (7, 10, 'R'), (8, 10, 'R')]: cm[(x, y)] = c
    cm[(7, 9)] = 'u'
    sp(a, grid(cm), dict(GOLD, u=('#ff9a9a', 13)))
# ───────── 화살통 (궁수·정찰가 계열) ─────────
def quiver(a, tube, tube2, band, fl, n=3, cap=None, glow_c=None, tip=None):
    """곧게 선 통 + 입구 테 + 띠, 위로 삐져나온 화살 (깃 · 오늬)"""
    if glow_c: glow(a, 7.5, 4.0, 4.5, glow_c)
    xs = [5, 7, 9] if n == 3 else [4, 6, 8, 10]
    for k, x in enumerate(xs):
        top = 1 + (k % 2); am = {}
        for y in range(top + 3, 9): am[(x, y)] = 't'
        for y in range(top, top + 3): am[(x, y)] = 'f'; am[(x + 1, y)] = 'F'
        if tip: am[(x, top - 1)] = 'c'
        sp(a, grid(am), {'t': ('#e8d8b0', 7), 'f': (fl[0], 1), 'F': (fl[1], 1), 'c': ('#ffffff', 1)})
    cm = {}
    for y in range(8, 19):
        for x in range(4, 12): cm[(x, y)] = 'l' if x < 9 else 'L'
    for x in range(4, 12): cm[(x, 8)] = 'q'; cm[(x, 13)] = 'q'; cm[(x, 18)] = cap or 'q'
    for (x, y) in [(10, 13), (10, 12), (10, 14)]: cm[(x, y)] = 'y'          # 띠 고리
    sp(a, grid(cm), dict(GOLD, l=(tube, 9), L=(tube2, 9), q=(band, 6)))
def quiver_1(a): quiver(a, '#b87a48', '#7a4a2a', '#5a3418', ('#ffffff', '#c8c8d0'))
def quiver_2(a): quiver(a, '#8a6a3a', '#5a4422', '#c08a4a', ('#7ad860', '#3a8a3a'), n=4)
def quiver_3(a): quiver(a, '#4a3a5a', '#2e2238', '#ffd84a', ('#ff6a5a', '#b02a22'), n=4, cap='y')
def quiver_4(a): quiver(a, '#2a4a7a', '#1a2e50', '#e8eef8', ('#c8f8ff', '#5ab8e8'), n=4, cap='y', glow_c=None, tip='c')
# ───────── 마법서 (마법사 계열): 덮인 책 시안 4개를 아이템으로 ─────────
def tome_1(a): mast.closed_tome(a, -1, '#2e52b8', '#1e3888', '#142460', '#e8eef8', '#8e96a4', mast.RING_B, '#ffd84a', '#fff4c0', ribbon='#ffd84a')
def tome_2(a): mast.closed_tome(a, -1, '#7a4ad0', '#5a32a8', '#3a1e78', '#ffd84a', '#c08a1c', mast.RING_F, '#e0ccff', '#ffffff', rx='#ffd84a')
def tome_3(a): mast.closed_tome(a, -1, '#a8283a', '#7a1828', '#4a0c18', '#ffd84a', '#c08a1c', mast.RING_E, '#9aeeff', '#ffffff', clasp='#6a3a1a', mat=13, ribbon=None)
def tome_4(a): mast.closed_tome(a, -1, '#3a2a6a', '#261a4a', '#160e30', '#ffd84a', '#c08a1c', mast.RING_D, '#ffe070', '#fff8d0', halo=0.25, ribbon='#7ad8c8')
# ───────── 성표 (성직자 계열) ─────────
def holy_celtic(a):   # 1: 나무 고리 십자 + 끈
    cm = {}; cx, cy = 7.5, 8.5
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            if 2.6 <= d < 3.7: cm[(x, y)] = 't' if x + y < 16 else 'T'
    for y in range(3, 18): cm[(7, y)] = 't'; cm[(8, y)] = 'T'
    for x in range(3, 13): cm[(x, 7)] = 't' if x < 8 else 'T'; cm[(x, 8)] = 'T' if x > 7 else 't'
    for (x, y) in [(6, 0), (7, 0), (8, 0), (9, 0), (5, 1), (10, 1), (6, 2), (9, 2)]: cm[(x, y)] = 'l'
    sp(a, grid(cm), {'t': ('#c89a5a', 3), 'T': ('#8a5a2a', 3), 'l': ('#9a6a3a', 9)})
def holy_ankh(a):   # 2: 은 앙크 + 파란 보석
    cm = {}; cx, cy = 7.5, 5.0
    for y in range(H):
        for x in range(W):
            d = math.hypot((x + 0.5 - cx) * 1.1, y + 0.5 - cy)
            if 2.0 <= d < 3.3 and y < 8: cm[(x, y)] = 'm' if x < 8 else 'M'
    for x in range(3, 13): cm[(x, 8)] = 'm' if x < 8 else 'M'; cm[(x, 9)] = 'M'
    for y in range(8, 18): cm[(7, y)] = 'm'; cm[(8, y)] = 'M'
    for (x, y) in [(6, 17), (9, 17)]: cm[(x, y)] = 'M'
    for (x, y, c) in [(7, 8, 'a'), (8, 8, 'b'), (7, 9, 'b'), (8, 9, 'B')]: cm[(x, y)] = c
    sp(a, grid(cm))
def holy_sun(a):   # 3: 금 해 원반 + 빛살 + 붉은 보석
    cm = {}; cx, cy = 7.5, 9.5
    for y in range(H):
        for x in range(W):
            dx, dy = x + 0.5 - cx, y + 0.5 - cy; d = math.hypot(dx, dy); th = math.degrees(math.atan2(dy, dx)) % 45
            if d < 3.8: cm[(x, y)] = 'y' if dx + dy < 0 else 'Y'
            elif d < 6.8 and (th < 9 or th > 36): cm[(x, y)] = 'y' if dx + dy < 0 else 'Y'
    for (x, y, c) in [(7, 9, 'u'), (8, 9, 'r'), (7, 10, 'r'), (8, 10, 'R'), (6, 9, 'r'), (9, 10, 'R'), (7, 8, 'r'), (8, 11, 'R')]: cm[(x, y)] = c
    sp(a, grid(cm), dict(GOLD, u=('#ff9a9a', 13)))
def holy_relic(a):   # 4: 둥근 빛무리를 등진 금 십자 + 흰 보석
    cm = {}; cx, cy = 7.5, 8.0
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            if 4.4 <= d < 5.6: cm[(x, y)] = 'h' if (x + 0.5 - cx) + (y + 0.5 - cy) < 2 else 'H'
    for y in range(1, 18): cm[(7, y)] = 'y'; cm[(8, y)] = 'Y'
    for x in range(2, 14): cm[(x, 6)] = 'y' if x < 8 else 'Y'; cm[(x, 7)] = 'Y'
    for (x, y, c) in [(7, 6, 'w'), (8, 6, 'a'), (7, 7, 'a'), (8, 7, 'A')]: cm[(x, y)] = c
    for (x, y) in [(6, 17), (9, 17)]: cm[(x, y)] = 'Y'
    sp(a, grid(cm), dict(GOLD, h=('#fff4b0', 1), H=('#e8c860', 1)))
# ───────── 투척 단검 (도적 계열) ─────────
def knives(a, blade, blade2, grip, grip2, band, tipc=None, glow_c=None, shine='#ffffff'):
    """칼끝이 위로 부채꼴로 벌어진 던지는 칼 셋 + 손잡이를 묶은 띠"""
    if glow_c: glow(a, 7.5, 6.0, 5.5, glow_c)
    pal = {'w': (shine, 5), 'm': (blade, 5), 'M': (blade2, 5), 'l': (grip, 9), 'L': (grip2, 9)}
    for (tx, ty, ang) in ((3.4, 3.4, 68), (11.6, 3.4, 112), (7.5, 1.6, 90)):
        cm = cell.sword(tx, ty, ang, blade=6.8, bw=2.1, tip=1.5, guard=3.4, gt=1.0, grip=3.2, gw=1.2, pom=0.8)
        if tipc:
            for (x, y), c in list(cm.items()):
                if c in 'wmM' and math.hypot(x + 0.5 - tx, y + 0.5 - ty) < 2.2: cm[(x, y)] = 'c'
        sp(a, grid(cm), dict(GOLD, c=(tipc or '#ffffff', 1), **pal))
    sp(a, ['qqqqqqqq', 'QQQQQQQQ'], 4, 13, {'q': (band, 9), 'Q': (mix(band, '#000000', 0.35), 9)})
def knives_1(a): knives(a, '#d0d8e4', '#8a94a8', '#b87a48', '#7a4a2a', '#6a4422')
def knives_2(a): knives(a, '#e8eef8', '#9aa2ae', '#3a3a44', '#1e1e26', '#a02a2a')
def knives_3(a): knives(a, '#5a5a6a', '#34343e', '#3a2a1a', '#22180e', '#2a4a22', tipc='#7af04a', shine='#9a9aa8')
def knives_4(a): knives(a, '#b48cff', '#6a40c0', '#2a1a40', '#160e26', '#e8eef8', shine='#f0e4ff', glow_c=['#2a1a4a', '#4a2a7a'])
# ───────── 등불 (짐꾼 계열) ─────────
LANT = ['....MM....',
        '...M..M...',
        '...M..M...',
        '..MMMMMM..',
        '.MmmmmmmM.',
        '.n.gggg.n.',
        '.nghhhhgn.',
        '.nghoohgn.',
        '.nghoohgn.',
        '.nghwohgn.',
        '.nggeeggn.',
        '.nggggggn.',
        '.MmmmmmmM.',
        '..MMMMMM..']
def lantern(a, metal, metal2, dark, glass, flame, flame2, core='#ffffff', glow_c=None, star=False):
    if glow_c: glow(a, 7.5, 9.5, 5.5, glow_c)
    pal = {'m': (metal, 6), 'M': (metal2, 6), 'n': (dark, 6), 'g': (glass, 12), 'h': (mix(glass, flame, 0.45), 12), 'o': (flame, 1), 'w': (core, 1), 'e': ('#f4ecd8', 7)}
    rows = [r for r in LANT]
    if star: rows[7] = '.nghwohgn.'; rows[8] = '.ngwoowgn.'
    sp(a, rows, 3, 3, pal)
def lantern_1(a): lantern(a, '#c4c8d0', '#7a7e88', '#4a4e58', '#e8d8a0', '#ff9a3a', '#ffd060')
def lantern_2(a): lantern(a, '#ffd84a', '#c08a1c', '#7a5614', '#f4e0a0', '#ff8a2a', '#ffd060')
def lantern_3(a): lantern(a, '#5a6070', '#3a3e48', '#22242c', '#a8e0f0', '#5ac8ff', '#c8f8ff')
def lantern_4(a): lantern(a, '#ffe070', '#c8962c', '#7e5814', '#fff4c8', '#ffd84a', '#fff8d0', star=True)
# ───────── 화살 (궁수 계열 둘째 칸, 소모형: 기본 공격마다 1발) ─────────
def arrow_line(cm, xt, yt, xb, yb, head, shaft, fl, nock='T'):
    n = max(abs(xb - xt), abs(yb - yt)); pts = []
    for i in range(n + 1): pts.append((round(xt + (xb - xt) * i / n), round(yt + (yb - yt) * i / n)))
    for (x, y) in pts[2:-3]: cm[(x, y)] = shaft
    x0, y0 = pts[0]; x1, y1 = pts[1]
    cm[(x0, y0)] = head[0]; cm[(x1, y1)] = head[1]; cm[(x1 - 1, y1)] = head[0]; cm[(x1 + 1, y1)] = head[2]
    for (x, y) in pts[-3:-1]: cm[(x, y)] = fl[0]; cm[(x - 1, y)] = fl[0]; cm[(x + 1, y)] = fl[1]
    xb_, yb_ = pts[-1]; cm[(xb_, yb_)] = nock
def arrows(a, n, head, fl, band, glow_c=None, ss=4, sparkle=None):
    """사선으로 놓은 화살 한 대 (촉이 오른쪽 위): 큰 세모 촉 · 나무 자루 · 양쪽 깃 · 오늬"""
    ux, uy = 0.7071, -0.7071; px_, py_ = 0.7071, 0.7071
    tx, ty, L = 15.2, 2.6, 19.6
    cm = {}
    for y in range(H):
        for x in range(W):
            cnt = {}
            for j_ in range(ss):
                for i_ in range(ss):
                    X, Y = x + (i_ + 0.5) / ss, y + (j_ + 0.5) / ss; dx, dy = X - tx, Y - ty
                    s_ = L + (dx * ux + dy * uy); v = dx * px_ + dy * py_
                    if s_ < 0 or s_ > L: continue
                    if s_ >= L - 4.6 and abs(v) <= 2.5 * (L - s_) / 4.6: part = 'H' if v > 0.35 else 'w' if v < -0.35 else 'h'
                    elif L - 5.4 <= s_ < L - 4.6 and abs(v) <= 0.9: part = 'q'
                    elif 0.7 <= s_ <= 4.4 and 0.5 < abs(v) <= 1.55 - (s_ - 0.7) * 0.1: part = 'f' if v < 0 else 'F'
                    elif s_ < 0.9 and abs(v) <= 0.7: part = 'T'
                    elif abs(v) <= 0.72: part = 't'
                    else: continue
                    cnt[part] = cnt.get(part, 0) + 1
            if sum(cnt.values()) >= 0.42 * ss * ss: cm[(x, y)] = max(cnt, key=cnt.get)
    pal = {'w': (head[0], 5), 'h': (head[1], 5), 'H': (head[2], 5), 't': (band[0], 3), 'T': (band[1], 3), 'q': (band[2], 6), 'f': (fl[0], 1), 'F': (fl[1], 1)}
    sp(a, grid(cm), pal)
    for (x, y) in (sparkle or []): a.set(x, y, '#ffffff')
def arrows_1(a): arrows(a, 1, ('#c8ccd4', '#8a8e98', '#5a5e68'), ('#ffffff', '#c8c8d0'), ('#c89a5a', '#7a4c22', '#8a8e98'))
def arrows_2(a): arrows(a, 1, ('#ffffff', '#d0d8e4', '#8a94a8'), ('#d8d8e0', '#8a8a94'), ('#e0c08a', '#8a5a2a', '#d0d8e4'))
def arrows_3(a): arrows(a, 1, ('#fff4c0', '#ffd84a', '#c08a1c'), ('#ff6a5a', '#b02a22'), ('#5a3a2a', '#2e1e14', '#ffd84a'))
def arrows_4(a): arrows(a, 1, ('#ffffff', '#9aeeff', '#3a9ad4'), ('#ffffff', '#9ad8ff'), ('#e8eef8', '#8a94a8', '#9aeeff'), sparkle=[(11, 1), (15, 6), (13, 9)])
# ───────── 표창 (도적 계열, 투척 단검 대신 · 소모형: 기본 공격마다 하나 더 던짐) ─────────
def star_blade(a, n, R, Ri, rot, cols, hole=1.0, cx=7.5, cy=9.5, glow_c=None, tipc=None, pow_=3.0):
    if glow_c: glow(a, cx, cy, R + 1.5, glow_c)
    cm = {}
    for y in range(H):
        for x in range(W):
            dx, dy = x + 0.5 - cx, y + 0.5 - cy; d = math.hypot(dx, dy)
            if d < hole: continue
            th = math.atan2(dy, dx) - math.radians(rot)
            r = Ri + (R - Ri) * ((math.cos(n * th) + 1) / 2) ** pow_
            if d <= r:
                if tipc and d > R - 2.0: cm[(x, y)] = 'c'
                else: cm[(x, y)] = 'm' if dx + dy < -0.5 else 'M' if dx + dy > 0.5 else 'w'
    for y in range(H):
        for x in range(W):
            if (x, y) not in cm and math.hypot(x + 0.5 - cx, y + 0.5 - cy) < hole + 0.9 and math.hypot(x + 0.5 - cx, y + 0.5 - cy) >= hole: cm[(x, y)] = 'n'
    pal = {'w': (cols[0], 5), 'm': (cols[1], 5), 'M': (cols[2], 5), 'n': (mix(cols[2], '#000000', 0.4), 5), 'c': (tipc or '#ffffff', 1)}
    sp(a, grid(cm), pal)
def shuri_1(a): star_blade(a, 4, 7.2, 2.6, -90, ('#c8ccd4', '#a0a6b0', '#6a707c'), hole=1.1, pow_=1.4)
def shuri_2(a):
    star_blade(a, 4, 7.4, 2.4, -45, ('#ffffff', '#d0d8e4', '#8a94a8'), hole=1.1, pow_=1.6)
    sp(a, ['rr', 'rR', '.R'], 13, 14, {'r': ('#e84848', 13), 'R': ('#9a2020', 13)})
def shuri_3(a): star_blade(a, 6, 7.0, 3.0, -90, ('#8a8a98', '#5a5a68', '#34343e'), hole=1.2, tipc='#7af04a', pow_=1.5)
def shuri_4(a): star_blade(a, 8, 7.2, 3.6, -90, ('#f0e4ff', '#b48cff', '#6a40c0'), hole=1.4, pow_=1.3)
OFF = [('shield', '방패', '전사·마부 계열', [shield_round, shield_heater, shield_kite, shield_gold], ['나무 원형', '강철 히터', '기사 연 방패', '황금 성방패']),
       ('quiver', '화살통', '궁수 계열 첫째 칸', [quiver_1, quiver_2, quiver_3, quiver_4], ['가죽 통', '사슴가죽 · 녹색 깃', '검은 통 · 금 테 · 붉은 깃', '푸른 통 · 빛 화살']),
       ('arrows', '화살', '궁수 계열 둘째 칸 · 소모형', [arrows_1, arrows_2, arrows_3, arrows_4], ['나무 화살', '강철 화살', '금촉 · 붉은 깃', '빛나는 마법 화살']),
       ('tome', '마법서', '마법사 계열', [tome_1, tome_2, tome_3, tome_4], ['남색 · 금 열십자', '보라 · 연보라 고리', '검붉은 · 여밈 · 해 별', '검보라 · 금빛 겹고리']),
       ('relic', '성표', '성직자 계열', [holy_celtic, holy_ankh, holy_sun, holy_relic], ['나무 고리 십자', '은 앙크 · 파란 보석', '금 해 원반 · 붉은 보석', '빛 두른 금 십자']),
       ('shuriken', '표창', '도적 계열 · 소모형', [shuri_1, shuri_2, shuri_3, shuri_4], ['쇠 네 날', '강철 네 날 · 붉은 끈', '검은 여섯 날 · 독', '보랏빛 여덟 날']),
       ('lantern', '등불', '짐꾼 계열', [lantern_1, lantern_2, lantern_3, lantern_4], ['양철 등불', '놋쇠 등불', '쇠 등불 · 푸른 불', '별빛 등불'])]
TIER_RANGE = ['견습·숲지기', '강철·폭풍', '서리·사막왕', '그 위 단계']
def render(fn, z):
    """칸 1개 = z픽셀, 배경 투명"""
    from PIL import Image
    a = item(); fn(a)
    im = Image.new('RGBA', (W * z, H * z), (0, 0, 0, 0)); px = im.load()
    for y in range(H):
        for x in range(W):
            c = a.c[y][x]
            if c == KEY: continue
            for j in range(z):
                for i in range(z): px[x * z + i, y * z + j] = c + (255,)
    return im
def sheet(out):
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 17, index=2)
    Z = 6; CW, RH, LW = W * Z + 70, H * Z + 54, 150
    sh = Image.new('RGB', (LW + CW * 4 + 10, RH * len(OFF) + 50), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 10), '부장비 시안 · 단계가 오를수록 (왼쪽 → 오른쪽) · 오른쪽 작은 그림 = 목록 크기', font=fb, fill=(242, 190, 60))
    for c, t in enumerate(TIER_RANGE): d.text((LW + c * CW + 20, 34), t, font=f, fill=(200, 200, 200))
    for r, (k, name, who, fns, labels) in enumerate(OFF):
        y = 56 + r * RH
        d.text((10, y + 40), name, font=fb, fill=(240, 240, 240)); d.text((10, y + 64), who, font=f, fill=(170, 170, 170))
        for c, fn in enumerate(fns):
            x = LW + c * CW
            d.rectangle((x, y, x + W * Z + 8, y + H * Z + 8), fill=(40, 34, 30), outline=(90, 74, 50))
            big = render(fn, Z); sh.paste(big, (x + 4, y + 4), big)
            sm = render(fn, 2); d.rectangle((x + W * Z + 14, y + 4, x + W * Z + 14 + 36, y + 4 + 44), fill=(40, 34, 30)); sh.paste(sm, (x + W * Z + 16, y + 6), sm)
            d.text((x, y + H * Z + 12), labels[c], font=f, fill=(210, 210, 210))
    sh.save(out)
if __name__ == '__main__':
    sheet(pathlib.Path(__file__).parent / 'offhand_sheet.png'); print('ok')
