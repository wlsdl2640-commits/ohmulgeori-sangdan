"""2단계 고치기 C: 레인저·용기사·신궁·마부·대상단장·정찰병·개척자 16개 (사용자 표시)"""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar
from spear import spear, SPP
import w5, w6
def A(theme, **k): return bg(Art(), theme, **k)
def cm_ell(cx, cy, rx, ry, ch): return ellipse(cx, cy, rx, ry, ch)
def ring_cm(cx, cy, rxo, ryo, rxi, ryi, ch_top, ch_bot):
    out = {}
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5 - cx, y + 0.5 - cy
            if (px / rxo) ** 2 + (py / ryo) ** 2 <= 1 and (px / rxi) ** 2 + (py / ryi) ** 2 > 1:
                out[(x, y)] = ch_top if py < 0 else ch_bot
    return out
# ── 덫 놓기: 이빨 달린 쇠 덫 (위에서 비스듬히) ──
def trap():
    a = A('earth', cy=11.5, cuts=[0.0, 0.2, 0.4, 0.62, 0.84])
    for (x, y) in [(2, 16), (3, 15), (12, 16), (13, 15), (5, 17), (10, 17)]: a.set(x, y, '#5a9a3a')
    cm = ring_cm(7.5, 11.0, 6.2, 4.0, 4.9, 2.7, 'm', 'n')
    for x in (4, 6, 8, 10):
        cm[(x, 8)] = 'm'; cm[(x + 1, 8)] = 'M'; cm[(x, 9)] = 'w' if x < 8 else 'm'
    for x in (5, 7, 9):
        cm[(x, 13)] = 'M'; cm[(x + 1, 13)] = 'n'; cm[(x + 1, 12)] = 'w'
    cm[(3, 12)] = 'M'; cm[(3, 11)] = 'w'; cm[(12, 10)] = 'm'; cm[(12, 9)] = 'M'
    for x in (0, 1): cm[(x, 10)] = 'n'; cm[(x, 11)] = 'M'
    for x in (14, 15): cm[(x, 10)] = 'n'; cm[(x, 11)] = 'M'
    for (x, y, c) in [(9, 15, 'm'), (10, 16, 'M'), (11, 16, 'm'), (12, 17, 'M')]: cm[(x, y)] = c
    sp(a, grid(cm), {'n': ('#5e6678', 5)})
    for (x, y) in [(3, 6), (12, 5)]: plus(a, x, y, '#ffffff', '#e0e4ec')
    return a, 0
# ── 늑대 부르기: 큰 보름달 앞에서 울부짖는 늑대 ──
WOLFHEAD = (['.F..........F.',
             '.FF........FF.',
             '.FuF......FuF.',
             '.FuuFFFFFFuuF.',
             'FFFFFFFFFFFFFF',
             'FFfFFFFFFFFfFF',
             'FyyFFFFFFFFyyF',
             '.FkFFffffFFkF.',
             '.FFFffffffFFF.',
             '..FFffkkffFF..',
             '..FFfwffwfFF..',
             '...FwrrrrwF...',
             '....FFrrFF....',
             '.....FFFF.....'], {'F': ('#8a94a8', 4), 'f': ('#e8ecf4', 7), 'u': ('#e890a8', 16), 'y': ('#ffd040', 1), 'k': ('#1a1414', 1), 'w': ('#ffffff', 1), 'r': ('#a82a30', 13)})
def wolfcall():
    a = A('night', cx=7.5, cy=8, r=12, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    glow(a, 7.5, 8.5, 7.5, ['#2a3070', '#4a54a0', '#c8c8e8'])
    sp(a, WOLFHEAD, 1, 3)
    return a, 0
# ── 사냥꾼의 감: 빛나는 큰 발자국 + 감각 줄 ──
def paw_cm(ox, oy, ch='e', ch2='E'):
    cm = {}
    for (cx, cy, rx, ry) in [(1.7, 5.6, 1.45, 1.85), (4.6, 2.5, 1.55, 2.0), (8.4, 2.5, 1.55, 2.0), (11.3, 5.6, 1.45, 1.85)]:
        cm.update(ellipse(ox + cx, oy + cy, rx, ry, ch))
    cm.update(ellipse(ox + 6.5, oy + 9.6, 3.9, 2.9, ch))
    cm.update(ellipse(ox + 4.6, oy + 10.9, 2.2, 1.7, ch)); cm.update(ellipse(ox + 8.4, oy + 10.9, 2.2, 1.7, ch))
    # 아래쪽 그늘
    out = {}
    for (x, y), c in cm.items():
        out[(x, y)] = ch2 if (x, y + 1) not in cm else c
    return out
def instinct():
    a = A('teal', rays=12, k=0.35, hole=4)
    glow(a, 7.5, 10.0, 7.2, ['#1e8088', '#2ea8a8'])
    for (x0, y0, x1, y1) in [(1, 2, 2, 4), (14, 2, 13, 4), (0, 11, 1, 11), (15, 11, 14, 11), (3, 18, 4, 16), (12, 18, 11, 16)]:
        line(a, x0, y0, x1, y1, '#e8fff8')
    sp(a, grid(paw_cm(1.5, 3.2)), {'e': ('#fff4dc', 7), 'E': ('#d8b890', 7)})
    return a, 0
# ── 도약 찌르기: 뛰어오른 길(점선) + 내리꽂는 창 + 두 번 맞음 ──
def jump():
    a = A('sky', cx=12, cy=14, r=14)
    w5.slash(a, w5.crescent(9.0, 15.0, 8.6, 180, 285, 2.4, fade=0.9), cols=('#ffffff', '#d8f0ff', '#9ad4ff', '#5aa0e8'))
    burst(a, 12, 16, big=True)
    sp(a, grid(spear(12.4, 16.2, -132, Lh=8, hw=2.5, Ls=6, sw=0.8)), SPP)
    return a, 0
# ── 용의 비늘: 비늘 무늬 방패 ──
def scale_tex(x, y, P=6, Q=3):
    r = y // Q; ly = y % Q
    if ly == 0 and r >= 1:
        lxu = (x - (P // 2) * ((r - 1) % 2)) % P
        if 1 <= lxu <= P - 2: return 'G'
    lx = (x - (P // 2) * (r % 2)) % P
    if ly == 0: return 'q'
    if ly == Q - 1 and lx in (0, P - 1): return 'G'
    if ly == 1: return 'h' if lx in (1, 2) else ('g' if lx < P - 1 else 'q')
    return 'g'
def dragonscale():
    a = A('teal', rays=10, k=0.3, hole=4)
    pts = [(1.2, 2.2), (14.8, 2.2), (14.8, 9.5), (13.0, 14.2), (7.5, 18.6), (2.0, 14.2), (1.2, 9.5)]
    inside = poly_cells(pts, 'x'); cm = {}
    for (x, y) in inside:
        edge = any((x + dx, y + dy) not in inside for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        cm[(x, y)] = ('y' if x + y < 17 else 'Y') if edge else scale_tex(x + 2, y + 1)
    sp(a, grid(cm), {'g': ('#3ab47a', 8), 'G': ('#0e4a2e', 8), 'q': ('#24865a', 8), 'h': ('#b0f8d0', 8), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
    return a, 0
# ── 창 돌풍: 비스듬한 창 + 둘러싼 회오리 바람 ──
def gale():
    a = A('wind', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    arcs(a, 7.5, 10.0, [6.6, 4.6], [(200, 330)], ['#c8ffe0', '#ffffff'], w=0.6)
    sp(a, grid(spear(13.2, 3.6, 135, Lh=7, hw=2.2, Ls=9, sw=0.8)), SPP)
    arcs(a, 7.5, 10.0, [6.6, 4.6], [(20, 150)], ['#ffffff', '#c8ffe0'], w=0.6)
    for (x, y) in [(2, 4), (13, 16)]:
        a.paint(['.g', 'gG'], {'g': '#8ae07a', 'G': '#3a9a4a'}, ox=x, oy=y)
    return a, 0
# ── 하늘 낙하: 구름을 뚫고 수직으로 내리꽂는 창 ──
def skyfall():
    a = A('sky', cy=3, r=17, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    paint_cm(a, cloud([(1.5, 5.2, 2.6), (4.2, 4.0, 2.2), (11.0, 4.0, 2.2), (14.0, 5.2, 2.6)]), {'1': '#ffffff', '2': '#c8dcf4'})
    for x in (5, 10):
        for y in range(6, 13): a.set(x, y, '#e8f4ff' if y % 3 else '#9ad4ff')
    for y in range(16, 20):
        for x in range(16): a.set(x, y, '#6a4a2a' if y > 16 else '#8a6a3a')
    burst(a, 7, 16, big=True)
    sp(a, grid(spear(7.5, 16.6, -90, Lh=7.5, hw=2.4, Ls=9, sw=0.5)), SPP)
    return a, 0
# ── 용의 낙하: 용 날개 단 불타는 창 ──
WINGL2 = ['y.......',
          'RR......',
          'rRRR....',
          'rrrRRR..',
          'rrrrrRRR',
          'r.rr.rrr',
          '..r...r.']
def dragonfall():
    a = A('fire', cy=4, r=16, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    tail(a, 7.5, 0.0, 7.5, 8.0, 2.4, 1.0, ['#fff0a0', '#ffc040', '#ff7a20'])
    burst(a, 7, 17, big=True, cols=('#ffffff', '#ffe060', '#ff8a2a'))
    wp = {'r': ('#d8322a', 13), 'R': ('#7a1414', 13), 'y': ('#fff0c0', 7)}
    sp(a, WINGL2, 0, 4, wp); sp(a, flip(WINGL2), 8, 4, wp)
    sp(a, grid(spear(7.5, 17.0, -90, Lh=7.5, hw=2.4, Ls=8, sw=0.5, tassel=False)), SPP)
    return a, 0
# ── 신의 눈: 빛나는 삼각 속 눈 ──
def godseye():
    a = A('royal', rays=16, k=0.35, hole=3)
    glow(a, 7.5, 11.0, 6.5, ['#4a3ca8', '#a88a48', '#ffe890'])
    outer = poly_cells([(7.5, 2.6), (15.2, 16.6), (-0.2, 16.6)], 'o')
    inner = poly_cells([(7.5, 6.4), (12.3, 14.9), (2.7, 14.9)], 'i')
    cm = {}
    for (x, y) in outer:
        if (x, y) in inner: continue
        cm[(x, y)] = 'y' if (x < 8 and y < 15) else 'Y'
    EYE = ['..TTT..', '.TeAeT.', 'TeAkAeT', '.TeAeT.', '..TTT..']
    for j, r in enumerate(EYE):
        for i, c in enumerate(r):
            if c != '.': cm[(4 + i, 9 + j)] = c
    cm[(6, 10)] = 'w'
    sp(a, grid(cm), {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'T': ('#8a5a1a', 3), 'e': ('#fffaf0', 7), 'A': ('#3a8ad0', 12), 'k': ('#1a1414', 1), 'w': ('#ffffff', 1)})
    return a, 0
# ── 말 돌보기: 큰 편자 + 하트 ──
def horseshoe_cm(cx, cy, ro, ri, top):
    cm = {}
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5 - cx, y + 0.5 - cy
            if py >= 0: d = math.hypot(px, py)
            else: d = abs(px) if y + 0.5 >= top else 99
            if ri < d <= ro: cm[(x, y)] = 'm' if px < 0 and py < 2 else 'M'
    # 못 구멍
    for ang in (200, 235, 270, 305, 340):
        pass
    mid = (ro + ri) / 2
    for ang in (15, 60, 120, 165):
        hx, hy = cx + math.cos(math.radians(ang)) * mid, cy + math.sin(math.radians(ang)) * mid
        cm[(int(hx), int(hy))] = 'k'
    for y in (int(cy) - 3,):
        cm[(int(cx - mid), y)] = 'k'; cm[(int(cx + mid), y)] = 'k'
    return cm
def horsecare():
    a = A('green', cy=9, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    sp(a, grid(horseshoe_cm(7.5, 9.6, 6.6, 3.6, 3.0)), {'m': ('#e0e6f0', 5), 'M': ('#8a94a8', 5), 'k': ('#2a2a34', 1)})
    sp(a, HEART[0], 5, 7, HEART[1])
    for (x, y) in [(2, 2), (13, 3), (7, 2)]: plus(a, x, y, '#ffffff', '#ffe0f0')
    return a, 0
# ── 전속력: 하늘을 달리는 흰 말 ──
GALLOP3 = (['..........FF..',
            '.........FFFF.',
            '........kFFeFF',
            '..kk...kkFFFFFn',
            '.kkFFFFkFFF...',
            'kk.FFFFFFFF...',
            'k..FFFFFFFF...',
            '...FF.....FF..',
            '..FF.......FF.',
            '.FF.........F.',
            '.n...........n'], {'F': ('#f4f0e8', 7), 'k': ('#9a8a7a', 3), 'e': ('#1a1414', 1), 'n': ('#5a4a3a', 3)})
def gallop():
    a = A('sky', cx=11, cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    speed(a, [(0, 6, 2, 6), (0, 9, 1, 9), (0, 12, 2, 12)], '#d8f0ff')
    paint_cm(a, cloud([(3, 17.4, 1.5), (6, 17.8, 1.3), (12, 17.4, 1.3)]), {'1': '#e8f4ff', '2': '#b0c8e8'})
    sp(a, GALLOP3, 1, 5)
    return a, 0
# ── 짐칸 방패: 나무 상자 + 앞에 선 방패 ──
def cargoshield():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    CR = ['nTTTTTTTTn', 'TtttttttTT', 'TTtttttTtT', 'TtTtttTttT', 'TttTtTtttT', 'TtttTttttT', 'TttTtTtttT', 'TtTtttTttT', 'TTtttttTtT', 'nTTTTTTTTn']
    sp(a, CR, 1, 3, {'t': ('#e0a860', 3), 'T': ('#7a4a22', 3), 'n': ('#9aa0b0', 5)})
    sp(a, grid(w6.heater(8, 10, 7, 8, ('g', 'G'), ('b', 'B'))), {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'b': ('#4a7ae8', 12), 'B': ('#2e4ea8', 12)})
    return a, 0
# ── 마차 질주: 먼지 날리며 달리는 포장마차 (큰 뒷바퀴 · 작은 앞바퀴 · 끌채) ──
WAGON6 = (['..eeeeeeeee..', '.eEeeeEeeeEe.', 'eeEeeeEeeeEee', 'eeEeeeEeeeEee', 'ttttttttttttt', 'TTTTTTTTTTTTTTT',
           '.tttt....tt..', 't.TT.t..tyTt.', 'tTyyTt..tTyt.', 'tTyyTt...tt..', 't.TT.t.......', '.tttt........'],
          {'e': ('#f8f0dc', 7), 'E': ('#c8b898', 7), 't': ('#d8a060', 3), 'T': ('#7a4c22', 3), 'y': ('#ffd84a', 6)})
def stampede():
    a = A('sky', cx=9, cy=6, r=13, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for y in range(15, 20):
        for x in range(16): a.set(x, y, '#c8944a' if y < 17 else '#a8743a')
    speed(a, [(0, 5, 1, 5), (0, 8, 1, 8)], '#ffffff')
    paint_cm(a, cloud([(0.8, 15.0, 1.9), (2.6, 16.4, 1.5), (5.0, 17.2, 1.2)]), {'1': '#fff0d0', '2': '#e0c898'})
    sp(a, WAGON6, 2, 4)
    return a, 0
# ── 길의 주인: 지평선까지 이어진 길 + 왕관 ──
def roadlord():
    a = A('sky', cy=7, r=13, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    glow(a, 7.5, 7.5, 4.6, ['#9ad4ff', '#fff4c0'])
    for y in range(9, 20):
        for x in range(16): a.set(x, y, '#3a8a3a' if y < 13 else '#2e7a30')
    for y in range(9, 20):
        t = (y - 9) / 10; cx = 7.5 + math.sin(t * 2.6 + 0.4) * 2.6 * t; w = 0.5 + t * 3.6
        for x in range(16):
            d = abs(x + 0.5 - cx)
            if d <= w: a.set(x, y, '#d8c098' if d < w - 0.7 else '#9a8660')
        if y % 2 == 0 and y > 10: a.set(int(cx), y, '#ffffff')
    sp(a, ['y..y..y', 'yy.y.yy', 'yyyyyyy', 'yrYbYry', 'YYYYYYY'], 4, 3, {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'r': ('#e83a3a', 13), 'b': ('#4a8aff', 12)})
    return a, 0
# ── 약점 간파: 돋보기 속에 드러난 붉은 약점 ──
def spotweak():
    a = A('amber', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(H):
        for x in range(W):
            c = scale_tex(x, y, 4, 3)
            a.set(x, y, {'G': '#3a1a0a', 'q': '#5a2a10', 'g': '#6e3814', 'h': '#8a4a1c'}[c])
    lens = ellipse(6.5, 7.5, 4.4, 4.4, 'c'); rimc = ring_cells(6.5, 7.5, 5.1, 5.1, 0.6)
    for (x, y) in lens:
        c = scale_tex(x + 1, y + 1, 6, 3)
        a.set(x, y, {'G': '#8a4a20', 'q': '#c87a3a', 'g': '#e09a52', 'h': '#f8c888'}[c])
    a.paint(['...r...', '..rRr..', '.rRwRr.', 'rRwhwRr', '.rRwRr.', '..rRr..', '...r...'], {'r': '#ff6a3a', 'R': '#e82a1a', 'w': '#ffe080', 'h': '#ffffff'}, ox=3, oy=4)
    cm = {k: ('m' if k[0] + k[1] < 13 else 'M') for k in rimc}
    for i in range(5): cm[(10 + i, 12 + i)] = 't'; cm[(11 + i, 12 + i)] = 'T'; cm[(10 + i, 13 + i)] = 'T'
    sp(a, grid(cm), {'m': ('#f0f4fa', 5), 'M': ('#8a94a8', 5), 't': ('#d09a5a', 3), 'T': ('#8a5a2a', 3)})
    for (x, y) in [(3, 4), (4, 3)]: a.set(x, y, '#ffffff')
    return a, 0
# ── 원거리 저격: 두꺼운 망원경 + 멀리 찍힌 붉은 표식 ──
def tube(p0, p1, rad, bands, ss=4):
    """p0→p1 축, rad(u 0..1) 반지름, bands: [(u끝, 밝은글자, 어두운글자)...]"""
    (x0, y0), (x1, y1) = p0, p1; L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L; nx, ny = -uy, ux
    lit = 1 if (nx + ny) < 0 else -1; out = {}
    for y in range(H):
        for x in range(W):
            n = 0
            for j in range(ss):
                for i in range(ss):
                    px, py = x + (i + .5) / ss - x0, y + (j + .5) / ss - y0; u = (px * ux + py * uy) / L; v = px * nx + py * ny
                    if 0 <= u <= 1 and abs(v) <= rad(u): n += 1
            if n < ss * ss * 0.45: continue
            px, py = x + .5 - x0, y + .5 - y0; u = max(0, min(1, (px * ux + py * uy) / L)); v = (px * nx + py * ny) * lit
            for (ue, l, d) in bands:
                if u <= ue: out[(x, y)] = l if v > -0.2 else d; break
    return out
def farsight():
    a = A('teal', cx=12, cy=4, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    glow(a, 12.0, 4.5, 3.4, ['#3ab0a8', '#a0f0e0'])
    sp(a, ['.r.', 'rRr', '.r.'], 11, 3, {'r': ('#ff4a3a', 13), 'R': ('#ffe0a0', 13)})
    rad = lambda u: 0.9 + 1.3 * u
    cm = tube((1.5, 18.0), (10.6, 8.9), rad, [(0.12, 'y', 'Y'), (0.42, 't', 'T'), (0.5, 'y', 'Y'), (0.82, 't', 'T'), (0.92, 'y', 'Y'), (1.0, 'a', 'A')])
    sp(a, grid(cm), {'y': ('#ffd84a', 6), 'Y': ('#b8801c', 6), 't': ('#a8642e', 9), 'T': ('#6a3a1a', 9), 'a': ('#e8fcff', 12), 'A': ('#7ac0e8', 12)})
    for (x, y) in [(3, 6), (14, 11)]: plus(a, x, y, '#ffffff', '#c8f0f0')
    a.set(11, 8, '#ffffff')
    return a, 0
ICONS = {'trap': ('덫 놓기', 'dot', trap), 'wolfcall': ('늑대 부르기', 'dmg', wolfcall), 'instinct': ('사냥꾼의 감', 'none', instinct), 'jump': ('도약 찌르기', 'dmg', jump),
         'dragonscale': ('용의 비늘', 'none', dragonscale), 'gale': ('창 돌풍', 'dmg', gale), 'skyfall': ('하늘 낙하', 'dmg', skyfall), 'dragonfall': ('용의 낙하', 'dmg', dragonfall),
         'godseye': ('신의 눈', 'none', godseye), 'horsecare': ('말 돌보기', 'none', horsecare), 'gallop': ('전속력', 'buff', gallop), 'cargoshield': ('짐칸 방패', 'none', cargoshield),
         'stampede': ('마차 질주', 'dmg', stampede), 'roadlord': ('길의 주인', 'none', roadlord), 'spotweak': ('약점 간파', 'buff', spotweak), 'farsight': ('원거리 저격', 'dmg', farsight)}
