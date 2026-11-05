"""공통 12개"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
def A(theme, **k): return bg(Art(), theme, **k)
def firstaid():
    a = A('teal')
    sp(a, FIRSTAID, 4, 6)
    for (x, y) in [(3, 4), (13, 5), (12, 15)]: plus(a, x, y, '#ffffff', '#c8fff0')
    return a, 0
def sprint():
    a = A('sky', cx=10, cy=9)
    speed(a, [(0, 6, 3, 6), (0, 9, 4, 9), (1, 12, 4, 12), (2, 15, 5, 15)], '#d8f0ff')
    sp(a, RUNNER, 6, 5)
    return a, 0
def meditate():
    a = A('arcane', cy=9)
    glow(a, 7.5, 10.0, 6.4, ['#3a4ac0', '#5a7ae8', '#8ab0ff'])
    sp(a, MEDITATE, 2, 6)
    for (x, y) in [(3, 3), (12, 3), (7, 1)]: plus(a, x, y, '#ffffff', '#b0c8ff')
    return a, 0
def toughness():
    a = A('stone', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    cm = {}
    rows_ = ['.111..111.', '1w11111112', '1111111122', '1111111122', '.11111122.', '..111122..', '...1122...', '....22....']
    sp(a, (rows_, {'1': ('#b8c4d8', 5), '2': ('#6a7690', 5)}), 3, 6)
    dot(a, [(5, 8), (10, 8), (7, 11), (8, 11)], '#ffffff')
    for (x, y) in [(5, 9), (10, 9)]: a.set(x, y, '#4a5266')
    return a, 0
def focus():
    a = A('teal', rays=12, k=0.3)
    ring(a, 7.5, 9.5, 6.6, [(0, 360)], '#bff0e8', w=0.5)
    sp(a, EYE, 3, 6, {'1': ('#3ad0a0', 1), '2': ('#1a7a60', 1), '3': ('#0e2a24', 1)})
    return a, 0
def secondwind():
    a = A('wind')
    for i in range(60):
        t = i / 59; ang = t * 5.8 + 0.6; r = 2.0 + t * 5.0
        x, y = 7.5 + math.cos(ang) * r, 10 + math.sin(ang) * r * 0.85
        for dx, dy in ((0, 0), (1, 0)): a.set(int(x) + dx, int(y) + dy, '#ffffff' if t > 0.6 else '#a8f0c0')
    sp(a, HEART, 4, 7)
    return a, 0
def haste():
    a = A('amber', rays=10, k=0.35)
    speed(a, [(0, 7, 2, 7), (0, 11, 3, 11), (1, 14, 3, 14)], '#fff0c8')
    sp(a, HOURGLASS, 5, 5)
    return a, 0
def tactics():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(13, 18):
        for x in range(16):
            if (x // 2 + y) % 2: a.set(x, y, '#2a1e84')
    sp(a, KNIGHT, 4, 4)
    return a, 0
def rhythm():
    a = A('pink', rays=10, k=0.3)
    sp(a, METRONOME, 4, 6)
    for (x, y) in [(2, 5), (13, 6)]: sp(a, ['.1', '.1', '11'], x, y, {'1': ('#ffffff', 7)})
    return a, 0
def ar_cheer():
    a = A('sand', cy=6)
    sp(a, HAND_UP, 1, 9); sp(a, (flip(HAND_UP[0]), HAND_UP[1]), 8, 8)
    for (x, y, c) in [(3, 3, '#ff6a8a'), (7, 2, '#ffe060'), (11, 4, '#6ad0ff'), (13, 2, '#8af07a'), (5, 6, '#ffffff'), (9, 5, '#ff9a3a')]: a.set(x, y, c)
    return a, 0
def ar_finish():
    a = A('blood', cy=13)
    burst(a, 7, 15)
    sp(a, ['.......y.', '......yY.', '.....mM..', '.....mM..', '.....mM..', '.....mM..', '.....mM..', '.....wM..'], 0, 3, GOLD)
    sp(a, ['11', '11', '11', '11', '..', '11'], 12, 4, {'1': ('#ffffff', 7)})
    return a, 0
def bandage():
    a = A('rose', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BANDAGE, 3, 6)
    for y in range(9, 12):
        for x in range(13, 16): a.set(x, y, '#fff8ec')
    return a, 0
ICONS = {'firstaid': ('응급 처치', 'heal', firstaid), 'sprint': ('질주', 'none', sprint), 'meditate': ('명상', 'none', meditate),
         'toughness': ('강인함', 'none', toughness), 'focus': ('집중', 'none', focus), 'secondwind': ('재기', 'heal', secondwind),
         'haste': ('신속', 'none', haste), 'tactics': ('전술', 'none', tactics), 'rhythm': ('전투 리듬', 'none', rhythm),
         'ar_cheer': ('관중의 응원', 'heal', ar_cheer), 'ar_finish': ('피니시', 'dmg', ar_finish), 'bandage': ('붕대 감기', 'buff', bandage)}
