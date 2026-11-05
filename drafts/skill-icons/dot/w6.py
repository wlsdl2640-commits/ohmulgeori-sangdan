"""전사 나머지 스킬 10개 — 뭉툭 도트 시안. 칸 좌표: x 0..15, y 0..19 (육각 틀 안쪽)."""
import math
import cell
from cell import Art, radial, mix
from w5 import slash, crescent, flash, rays_bg, ring, HILT, FL, pips
def mirror(rows, swap=None):
    """좌우 뒤집기 (swap: 글자 바꾸기, 명암 방향 맞추기)"""
    sw = swap or {}
    return [''.join(sw.get(c, c) for c in r.ljust(16, '.')[::-1]) for r in rows]
def blank(): return [['.'] * 16 for _ in range(20)]
def rows(g): return [''.join(r) for r in g]
def put(g, x, y, ch):
    if 0 <= x < 16 and 0 <= y < 20: g[y][x] = ch
# ── 6. 대지 가르기: 땅에 박힌 칼 + 좌우로 갈라지며 빛나는 틈 + 튀는 바위 ──
EARTH = ['#1e0e04', '#3e2008', '#64360e', '#8e5216', '#b8742a', '#e09c48']
VSWORD_DOWN = ['................',
               '.......gG.......',
               '.......rR.......',
               '.......rR.......',
               '.....gggGGG.....',
               '.....g.wM.G.....',
               '.......wM.......',
               '.......wM.......',
               '.......wM.......',
               '.......wM.......',
               '.......wM.......',
               '.......wM.......',
               '.......wM.......',
               '.......wM.......']
GROUND = ['................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '....tT....Tt....',
          'ttttTTyhhyTTtttt',
          'TTTTTyTyyTyTTTTT',
          'TTTyyTTTyTTyyTTT',
          'vvyvvvvyvvvvvyvv',
          'vyvvvvvvyvvvvvyv',
          'vvvvvvvyvvvvvvvv',
          'vvvvvvvyvvvvvvvv']
GP = {'t': '#c88e4a', 'T': '#8e5628', 'v': '#5a3416', 'y': '#ffc848', 'h': '#fff4c0'}
ROCK = {'s': ('#b08050', 9), 'S': ('#7a5030', 9)}
def earthsplit():
    a = Art().bg(radial(EARTH, 7.5, 13.0, 13, [0.0, 0.2, 0.4, 0.6, 0.8]))
    for (x, y) in [(1, 12), (2, 11), (3, 12), (12, 12), (13, 11), (14, 12)]: a.set(x, y, '#ffe0a0')
    a.sym(VSWORD_DOWN, HILT)
    a.paint(GROUND, GP)
    for (x, y, r) in [(2, 7, ['sS', 'SS']), (12, 6, ['sS', 'SS']), (4, 4, ['s']), (11, 9, ['s']), (1, 3, ['s'])]:
        g = ['.' * x + rr for rr in r]; a.sym(['................'] * y + g, ROCK)
    return a, 0
# ── 8. 수호자: 둥근 방패 + 붉은 하트 (최대 HP) ──
GREEN = ['#04180c', '#0a3018', '#124a24', '#1c6a34', '#2e8e48', '#56b868']
HEART = ['.11..11.', '11111111', '1w111112', '.111122.', '..1122..', '...22...']
def round_shield():
    g = blank(); cx, cy = 7.5, 9.5
    for y in range(20):
        for x in range(16):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            if d <= 6.1:
                up = (x + 0.5 - cx) + (y + 0.5 - cy) < 0
                g[y][x] = ('b' if up else 'B') if d > 4.9 else ('m' if up else 'M')
    for i, r in enumerate(HEART):
        for j, ch in enumerate(r):
            if ch != '.': g[7 + i][4 + j] = ch
    for (x, y) in [(7, 4), (2, 9), (13, 9), (7, 15)]: g[y][x] = 'f'
    return rows(g)
SHP2 = {'b': ('#e0a050', 6), 'B': ('#9a6424', 6), '1': ('#ee3448', 13), '2': ('#a8182c', 13), 'w': ('#ffffff', 1), 'f': ('#fff0c0', 1)}
def guardian():
    a = Art().bg(radial(GREEN, 7.5, 9.5, 11, [0.0, 0.2, 0.42, 0.64, 0.86]))
    a.sym(round_shield(), SHP2, glow='#9ae8a8')
    return a, 0
# ── 11. 왕국 방패술: 세 방패가 겹친 방패벽 + 왕관 ──
ROYAL = ['#0a0626', '#1a1052', '#2a1e84', '#3c34b4', '#5a5ad8', '#8a8cf4']
def heater(w, h, x0, y0, rim, face, top=0.5):
    g = {}
    for j in range(h):
        t = j / (h - 1)
        if t <= top: half = w / 2
        else: half = w / 2 * (1 - ((t - top) / (1 - top)) ** 1.6)
        lo, hi = round(x0 + w / 2 - half), round(x0 + w / 2 + half)
        for x in range(lo, hi):
            edge = x == lo or x == hi - 1 or j == 0 or (t > top and (x == lo or x == hi - 1))
            left = x < x0 + w / 2
            g[(x, y0 + j)] = (rim[0] if left else rim[1]) if edge else (face[0] if left else face[1])
    return g
def cm_rows(cm):
    g = blank()
    for (x, y), ch in cm.items(): put(g, x, y, ch)
    return rows(g)
CROWN = ['1.11.1', '111111', '1r11r1', '111111']
def kn_wall():
    a = Art().bg(rays_bg(ROYAL, 7.5, 9.5, 11, [0.0, 0.2, 0.42, 0.64, 0.86], 8, '#0a0626', rot=0.2, w=0.4, k=0.4))
    a.sym(cm_rows(heater(6, 10, 0, 6, ('n', 'n'), ('b', 'B'))), {'b': ('#3a64c8', 12), 'B': ('#26408a', 12)})
    a.sym(cm_rows(heater(6, 10, 10, 6, ('n', 'n'), ('b', 'B'))), {'b': ('#3a64c8', 12), 'B': ('#26408a', 12)})
    cm = heater(8, 12, 4, 4, ('g', 'G'), ('b', 'B'))
    for i, r in enumerate(CROWN):
        for j, ch in enumerate(r):
            if ch != '.': cm[(5 + j, 7 + i)] = ch
    a.sym(cm_rows(cm), {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'b': ('#4a7ae8', 12), 'B': ('#2e4ea8', 12), '1': ('#ffd84a', 6), 'r': ('#ff3a4a', 1)})
    return a, 0
# ── 13. 결의: 끝이 위로 엇갈린 두 칼 (맹세) + 엇갈린 자리 빛 ──
TEAL = ['#031a1e', '#08323a', '#0e4e58', '#167078', '#26989c', '#5ac8c4']
def xsword():
    g = blank()
    put(g, 12, 3, 'w')
    for y in range(4, 11): put(g, 15 - y, y, 'w'); put(g, 16 - y, y, 'M')
    for (x, y) in [(3, 10), (4, 11), (5, 12)]: put(g, x, y, 'g')
    put(g, 3, 12, 'r'); put(g, 2, 13, 'R'); put(g, 1, 14, 'g')
    return rows(g)
def resolve():
    a = Art().bg(rays_bg(TEAL, 7.5, 8.0, 11, [0.0, 0.2, 0.42, 0.64, 0.86], 10, '#031a1e', rot=0.0, w=0.45, k=0.45))
    A = xsword(); B = mirror(A, {'w': 'w', 'M': 'M'})
    a.sym(A, HILT); a.sym(B, HILT)
    a.paint(['..h..', '.hwh.', 'hwwwh', '.hwh.', '..h..'], FL, ox=5, oy=6)
    return a, 0
# ── 14. 용사의 일격 (각성): 하늘에서 내리꽂는 금빛 칼 + 큰 빛 터짐 ──
GOLD = ['#2a1602', '#5a3406', '#8e5a0c', '#c08a18', '#e8b830', '#fff0a0']
HERO = ['................',
        '.......gG.......',
        '.......rR.......',
        '...g...rR...G...',
        '...ggggbBGGGG...',
        '....gg.wM.GG....',
        '.......wM.......',
        '.......wM.......',
        '.......wM.......',
        '.......wM.......',
        '.......wM.......',
        '.......wM.......',
        '.......wM.......',
        '.......wM.......',
        '.......wM.......']
HEROP = dict(HILT); HEROP.update({'r': ('#3050c0', 12), 'R': ('#203080', 12), 'b': ('#8ae0ff', 1), 'B': ('#3a8ad0', 1)})
def awk_warrior():
    a = Art().bg(rays_bg(GOLD, 7.5, 16.0, 16, [0.0, 0.2, 0.4, 0.6, 0.8], 14, '#2a1602', rot=0.0, w=0.45, k=0.4, hole=4))
    for x, y0, y1 in [(2, 4, 10), (13, 4, 10), (4, 0, 3), (11, 0, 3)]:
        for y in range(y0, y1): a.set(x, y, '#fff4c0')
    a.sym(HERO, HEROP)
    a.paint(['....y....', '...yhy...', '.yyhwhyy.', 'yhhwwwhhy', '.yyhwhyy.', '...yhy...', '....y....'],
            {'y': '#ffc040', 'h': '#fff0a0', 'w': '#ffffff'}, ox=3, oy=13)
    return a, 0
ICONS = {'earthsplit': ('대지 가르기', 'dmg', earthsplit), 'guardian': ('수호자', 'none', guardian), 'kn_wall': ('왕국 방패술', 'buff', kn_wall),
         'resolve': ('결의', 'buff', resolve), 'awk_warrior': ('용사의 일격', 'dmg', awk_warrior)}
