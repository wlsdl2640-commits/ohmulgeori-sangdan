"""X 친 3개(유성우 · 별똥별 화살 · 거신 낙하) 시안 다시 4개씩. 이름: <id>_5 … <id>_8"""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar, arx, arrow, arrow_s, arrow_xs, recol, AP, GOLD_ALL, GOLDP
import crit as C
from var_ar import A, GOLD, FIRE, FIREP, flat_arrow, streak, mark
import w5
# ───────── 유성우 ─────────
METEOR = (['...ooo', '..oyyo', '.oyhyo', 'oyhyo.', 'oyyo..', 'yo....'], {'o': ('#ff7a2a', 14), 'y': ('#ffd040', 6), 'h': ('#fff8d0', 1)})
def awk_archer_5():
    a = A('night', cx=4, cy=17, r=16, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    dot(a, [(3, 3), (8, 1), (1, 9), (6, 6), (14, 13)], '#ffffff')
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#3a1a10' if y > 17 else '#8a3a10')
    tail(a, 6.0, 12.0, 17.0, 1.0, 3.6, 0.7, ['#fff8d0', '#ffd040', '#ff8a2a', '#c8401a', '#6a2010'])
    sp(a, METEOR, 2, 9, glow_c='#ffb040')
    for (tx, ty) in [(12, 15), (14, 10)]: arx(a, 'dl', tx, ty, 0, FIRE, FIREP)
    return a, 0
BOW_V = (['..yY', '.yY.', 'yY..', 'y...', 'y...', 'y...', 'yY..', '.yY.', '..yY'], GOLD)
def awk_archer_6():
    a = A('night', cx=8, cy=3, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    glow(a, 8.0, 3.5, 4.0, ['#a03a1a', '#ff8a2a', '#ffd040', '#fff8d0'])
    for (tx, ty, d) in [(2, 12, 'dl'), (6, 16, 'dl'), (10, 16, 'dr'), (14, 12, 'dr'), (8, 18, 'd')]:
        sx, sy = (1 if d == 'dl' else -1 if d == 'dr' else 0), -1
        streak(a, tx + sx, ty + sy, tx + sx * 4, ty - 4, ('#fff0a0', '#ff9a3a', '#c8401a'))
        arx(a, d, tx, ty, 0, FIRE, FIREP)
    dot(a, [(1, 4), (14, 3), (2, 18)], '#ffffff')
    return a, 0
def awk_archer_7():
    a = A('night', cy=16, r=15)
    for y in range(15, 20):
        for x in range(16):
            if y >= 15 + (1 if x % 4 in (0, 1) else 0): a.set(x, y, '#1a1018')
    for (x, y) in [(3, 15), (8, 16), (13, 15)]:
        glow(a, x + 0.5, y + 0.5, 2.6, ['#c8401a', '#ff9a2a', '#ffe080'])
    for (x, y) in [(3, 15), (8, 16), (13, 15)]: burst(a, x, y, big=False, cols=('#ffffff', '#ffe080', '#ff8a2a'))
    for (tx, ty) in [(4, 11), (9, 12), (14, 11)]:
        streak(a, tx + 1, ty - 1, tx + 5, ty - 5, ('#fff0a0', '#ff9a3a', '#c8401a'))
        arx(a, 'dl', tx, ty, 0, FIRE, FIREP)
    dot(a, [(2, 4), (7, 2), (12, 3)], '#ffffff')
    return a, 0
def awk_archer_8():
    a = A('night', cx=12, cy=3, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    dot(a, [(2, 3), (5, 1), (9, 2), (13, 6), (1, 8), (6, 7), (11, 9), (3, 12)], '#ffffff')
    for (tx, ty) in [(2, 7), (6, 5), (10, 8), (4, 12), (13, 11), (14, 4)]:
        streak(a, tx, ty, tx + 4, ty - 4, ('#ffffff', '#c8e0ff', '#4a6aa8'))
    TREES = ['..k....k.....k..', '.kkk..kkk...kkk.', 'kkkkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkk']
    a.paint(TREES, {'k': '#0a0e1a'}, ox=0, oy=16)
    streak(a, 8, 14, 15, 7, ('#ffffff', '#fff4c0', '#c8b070'))
    arx(a, 'dl', 7, 15, 1, GOLD_ALL, GOLDP)
    return a, 0
# ───────── 별똥별 화살 ─────────
def starfall_5():
    a = A('purple', rays=16, k=0.4, hole=3)
    glow(a, 7.5, 9.5, 2.6, ['#e0b0ff', '#ffffff'])
    for (d, tx, ty) in [('u', 7, 1), ('d', 7, 18), ('l', 0, 9), ('r', 15, 9), ('ur', 13, 3), ('ul', 2, 3), ('dr', 13, 16), ('dl', 2, 16)]:
        arx(a, d, tx, ty, 1, GOLD_ALL, GOLDP)
    plus(a, 7, 9, '#ffffff', '#fff0a0')
    return a, 0
STARH = (['..y..', '.yhy.', 'yhwhy', '.yhy.', 'y...y'], {'y': ('#ffd84a', 6), 'h': ('#fff0a0', 6), 'w': ('#ffffff', 1)})
def starfall_6():
    a = A('purple', cy=4)
    for (x, y) in [(2, 3), (7, 2), (14, 15), (1, 9), (12, 3)]: a.set(x, y, '#ffffff')
    for (hx, hy) in [(2, 10), (8, 14)]:
        tail(a, hx + 3.5, hy + 1.0, hx + 9.0, hy - 5.0, 1.2, 0.3, ['#fff0a0', '#e0b0ff', '#a060e0'])
        cm = {}
        for k in range(1, 4): cm[(hx + 4 + k, hy + 1 - k)] = 'y' if k < 3 else 'Y'
        for (dx, dy) in ((5, 0), (6, 1), (7, -2), (8, -1)): cm[(hx + dx + 1, hy + dy - 1)] = 'Y'
        sp(a, grid(cm), GOLD)
        sp(a, STARH, hx, hy)
    return a, 0
def starfall_7():
    a = A('night', cx=8, cy=6, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    BOWP = [(7, 2), (4, 4), (3, 9), (4, 14), (7, 16)]
    for (p0, p1) in zip(BOWP, BOWP[1:]): line(a, *p0, *p1, '#c8c8ff')
    line(a, 7, 2, 6, 9, '#4a4aa0'); line(a, 6, 9, 7, 16, '#4a4aa0')
    for (x, y) in BOWP: star5(a, x, y, '#ffffff', '#fff0a0', '#c8a8ff')
    for i in range(0, 5, 2): a.set(8 + i, 9, '#c8c8ff')
    arx(a, 'r', 15, 9, 1, GOLD_ALL, GOLDP)
    for (x, y) in [(12, 13), (10, 17), (13, 4), (11, 2)]: a.set(x, y, '#ffffff')
    return a, 0
def starfall_8():
    a = A('night', cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for (cx, cy, r, c) in [(5.0, 6.0, 4.0, '#4a2a7a'), (11.0, 9.0, 4.5, '#6a2a7a'), (7.0, 13.0, 3.6, '#3a2a6a'), (6.0, 7.0, 2.4, '#8a4aa8'), (11.0, 10.0, 2.2, '#b05a9a')]:
        for (x, y) in ellipse(cx, cy, r, r * 0.8, 'x'):
            if (x * 7 + y * 3) % 5: a.set(x, y, mix(a.get(x, y), c, 0.7))
    for (x, y) in [(2, 3), (13, 4), (4, 16), (14, 14), (9, 6), (6, 11)]: a.set(x, y, '#ffffff')
    for (tx, ty) in [(4, 10), (9, 15), (12, 8)]:
        streak(a, tx + 1, ty - 1, tx + 4, ty - 4, ('#fff0a0', '#e0b0ff', '#a060e0'))
        arx(a, 'dl', tx, ty, 1, GOLD_ALL, GOLDP)
        plus(a, tx, ty, '#ffffff', '#fff0a0')
    return a, 0
# ───────── 거신 낙하 ─────────
ATITAN = (['.h..........h.', '.hh........hh.', '..hhkkkkkkhh..', '...kkkkkkkk...', '...kkkkkkkk...', '...kookkook...', '...kkkkkkkk...', '.KKKkkkkkkKKK.', 'KKKKkkkkkkKKKK',
           'KK.kkkkkkkk.KK', 'kk.kkkkkkkk.kk', 'kk.kkkkkkkk.kk', '...kkkkkkkk...', '...kkkk.kkk...', '...kkk..kkk...', '..kkkk..kkkk..'],
          {'h': ('#e8dcc0', 7), 'k': ('#5a5e6e', 5), 'K': ('#8a90a0', 5), 'o': ('#ff8a2a', 1)})
def titanfall_5():
    a = A('evil', rays=14, k=0.4, hole=3)
    T = [list(r) for r in C.TITAN[0]]
    sp(a, C.TITAN, 2, 3)
    for (x0, y0, x1, y1) in [(8, 10, 5, 5), (8, 10, 11, 6), (8, 10, 4, 14), (8, 10, 12, 15), (8, 10, 8, 16)]:
        n = max(abs(x1 - x0), abs(y1 - y0))
        for i in range(1, n + 1):
            x, y = round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n)
            if a.get(x, y) and sum(a.get(x, y)) > 200: a.set(x, y, '#ffb040' if i < n - 1 else '#ff7a20')
    glow(a, 8.0, 10.0, 1.6, ['#ffd040', '#ffffff'])
    arx(a, 'ur', 8, 10, 2, GOLD_ALL, GOLDP)
    for (x, y) in [(0, 6), (14, 4), (1, 13), (14, 12), (13, 17)]: sp(a, ['fF', 'FF'], x, y, {'f': ('#9a948a', 11), 'F': ('#5e5850', 11)})
    return a, 0
def titanfall_6():
    a = A('blood', cy=6, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    KN = (['.h........h.', '.hh......hh.', '..hkkkkkkh..', '...kkkkkk...', '...kokkok...', '...kkkkkk...', '.KKKkkkkKKK.', 'KKKKkkkkKKKK', 'KK.kkkkkk.KK', 'kk.kkkkkk.kk', 'kk.kkkkkk.kk', '...kkkkkk...', '..kkkk.kkk..', '.kkkk..kkkkk', 'kkkk...kkkkk'],
          {'h': ('#e8dcc0', 7), 'k': ('#5a5e6e', 5), 'K': ('#8a90a0', 5), 'o': ('#ff8a2a', 1)})
    sp(a, KN, 2, 3)
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#2a0a0a')
    paint_cm(a, cloud([(1.5, 17.2, 1.8), (14.0, 17.0, 2.0)]), {'1': '#c89080', '2': '#8a5a50'})
    arx(a, 'ur', 8, 10, 2, GOLD_ALL, GOLDP)
    for (x, y) in [(7, 11), (8, 11), (7, 10)]: a.set(x, y, '#ffe080')
    return a, 0
def titanfall_7():
    a = A('dawn', cy=17, r=17, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    GIANT = ['....kkkk....', '...kkkkkk...', '...kkookk...', '...kkkkkk...', '.kkkkkkkkkk.', 'kkkkkkkkkkkk', 'kkkkkkkkkkkk', 'kk.kkkkkk.kk', 'kk.kkkkkk.kk', 'kk.kkkkkk.kk', '...kkkkkk...', '...kkk.kkk..']
    cm = C.rot_rows(GIANT, -14, 6.0, 12.0, 9.5, 15.5)
    for (x, y), c in cm.items(): a.set(x, y, '#2a1a2a' if c == 'k' else '#ff6a3a')
    for y in range(15, 20):
        for x in range(16): a.set(x, y, '#1a1020')
    for i in range(11): a.set(1 + i * 7 // 10, 17 - i, mix('#ffffff', '#ffc040', i / 11))
    burst(a, 8, 6, big=False, cols=('#ffffff', '#fff0a0', '#ffc040'))
    paint_cm(a, cloud([(12.5, 15.6, 1.8), (15.0, 14.6, 1.4)]), {'1': '#8a6a7a', '2': '#5a4a5a'})
    return a, 0
TBUST = (['.h............h.', '.hh..........hh.', '..hh.kkkkkk.hh..', '...hkkkkkkkkh...', '....kkkkkkkk....', '....kookkook....', '....kkkkkkkk....', '..KKKkkkkkkKKK..', '.KKKKKkkkkKKKKK.', 'KKKKKKkkkkKKKKKK', 'KKK.kkkkkkkk.KKK', 'kk..kkkkkkkk..kk'],
         {'h': ('#e8dcc0', 7), 'k': ('#5a5e6e', 5), 'K': ('#8a90a0', 5), 'o': ('#ff8a2a', 1)})
HANDT = (['..f.f.f.....', '..f.f.f.f...', '..f.f.f.f...', '.ffffffff...', '.ffffffff.f.', '.ffffffffff.', '.fffffffff..', '..ffffffff..', '..ffffffF...', '...FFFFF....', '...FFFFF....'],
         {'f': ('#a8a090', 11), 'F': ('#6a6458', 11)})
HELM = (['h..........h', 'hh........hh', '.hhkkkkkkhh.', '..kkkkkkkk..', '.kkkkkkkkkk.', '.kkookkookk.', '.kkkkkkkkkk.', '.KKKKKKKKKK.', '..KKKKKKKK..'],
        {'h': ('#e8dcc0', 7), 'k': ('#6a6e7e', 5), 'K': ('#8a90a0', 5), 'o': ('#2a1a10', 1)})
def titanfall_8():
    a = A('ember', cx=4, cy=4, r=15, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    sp(a, grid(C.rot_rows(C.KAIJU3[0], 24, 6.5, 13.5, 9.0, 17.5)), C.KAIJU3[1])
    paint_cm(a, cloud([(2.5, 18.4, 2.0), (8.0, 19.0, 2.4), (13.0, 18.4, 2.0)]), {'1': '#e8b880', '2': '#b8804a'})
    for (x0, y0, x1, y1) in [(9, 11, 7, 9), (9, 11, 11, 9), (9, 11, 9, 14)]: line(a, x0, y0, x1, y1, '#ffd080')
    arx(a, 'ul', 9, 11, 2, GOLD_ALL, GOLDP)
    speed(a, [(14, 3, 15, 4), (13, 1, 14, 2)], '#fff0d0')
    return a, 0
ICONS = {}
for _id in ['awk_archer', 'starfall', 'titanfall']:
    for _k in range(5, 9):
        ICONS[f'{_id}_{_k}'] = (f'{_id} {_k}', 'dmg', globals()[f'{_id}_{_k}'])
