"""괴물 사냥꾼 5 · 용 사냥꾼 4 · 사냥꾼 5 · 괴수 사냥꾼 5 · 마술사 5 · 대마법사 4 · 원소술사 5 · 연금술사 5"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
from c_archer import arrow_u, arrow_dl, arrow_l, arrow_ul
from c_g2 import crosshair
from arrows import ar, arrow, arrow_s, recol, AP, GOLD_ALL, GOLDP
def A(theme, **k): return bg(Art(), theme, **k)
WSL = ('#ffffff', '#fff0a0', '#ffb040', '#f07a20')
MARK = ['...r...', '..rRr..', '.rR.Rr.', 'rR.r.Rr', '.rR.Rr.', '..rRr..', '...r...']
def huntmark():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, MARK, 7, 2, {'r': ('#ff4a3a', 13), 'R': ('#a01a1a', 13)})
    ar(a, 'ur', 10, 5, 2)
    return a, 0
def trapnet():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    cm = {}
    for y in range(3, 17):
        for x in range(2, 14):
            if (x - 2) % 3 == 0 or (y - 3) % 3 == 0: cm[(x, y)] = 't'
    for p in [(2, 3), (13, 3), (2, 16), (13, 16)]: cm[p] = 'f'
    sp(a, grid(cm), {'t': ('#d8b070', 3), 'f': ('#74747e', 11)})
    return a, 0
def biggame():
    a = A('earth', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BULLHEAD, 2, 6)
    crosshair(a, 7.5, 10.5, 6.4, '#ff4a3a')
    return a, 0
def skinning():
    a = A('warm', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, PELT, 2, 5)
    sp(a, ['....w', '...wM', '..wM.', 'll...', 'l....'], 10, 12)
    return a, 0
def volleytrap():
    a = A('green', cy=4, r=16)
    sp(a, BEARTRAP, 2, 12)
    for (x, ty) in [(3, 10), (8, 8), (13, 10)]: ar(a, 'd', x, ty, 3, small=True)
    return a, 0
def dragonpierce():
    a = A('fire', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    cm = {}
    for y in range(3, 17):
        for x in range(4, 11):
            lx = (x + (2 if ((y - 3) // 3) % 2 else 0)) % 4; ly = (y - 3) % 3
            cm[(x, y)] = 'G' if ly == 2 else ('h' if ly == 0 and lx == 1 else 'g')
    sp(a, grid(cm), {'g': ('#c04a2a', 8), 'G': ('#6a1a0a', 8), 'h': ('#ff9a6a', 8)})
    ar(a, 'r', 15, 10, 5)
    burst(a, 8, 10, big=False)
    return a, 0
def wyrmbane():
    a = A('blood', rays=10, k=0.35)
    sp(a, DRAGONSKULL, 2, 6)
    return a, 0
def slayrain():
    a = A('dawn', cy=17, r=16)
    import spr as S
    sp(a, S.WYVERN, 0, 8)
    for (x, ty) in [(3, 8), (8, 6), (12, 9)]: ar(a, 'd', x, ty, 3, small=True)
    return a, 0
def dragonheart():
    a = A('evil', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    big = (['.111..111.', '1w11111112', '1111111122', '1111111122', '.11111122.', '..111122..', '...1122...', '....22....'], HEART[1])
    cm = arrow('ur', 14, 2, 7)
    sp(a, grid({k: v for k, v in cm.items() if k[0] + k[1] > 15}), AP)
    sp(a, big, 3, 6)
    sp(a, grid({k: v for k, v in cm.items() if k[0] + k[1] <= 11}), AP)
    return a, 0
def trackshot():
    a = A('green', cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(20):
        for x in range(16):
            if abs((x - 7.5) + (y - 9.5) * 0.9) < 3.2 and x + y > 9: a.set(x, y, '#b88a50' if (x + y) % 5 else '#a07a44')
    for (x, y) in [(1, 15), (4, 13), (6, 10)]: a.paint(['1.1', '.1.', '111'], {'1': '#4a2a10'}, ox=x, oy=y)
    ar(a, 'ur', 14, 2, 1)
    return a, 0
def snaretrap():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BOOT, 3, 7)
    for (x, y) in ring_cells(7.0, 13.5, 4.6, 1.4, w=0.6): a.set(x, y, '#e0c080')
    for y in range(2, 12): a.set(12, y, '#e0c080')
    return a, 0
def houndpack():
    a = A('amber', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    speed(a, [(0, 4, 2, 4), (0, 14, 2, 14)], '#ffe8c0')
    sp(a, DOGHEAD, 6, 1); sp(a, DOGHEAD, 2, 10, {'F': ('#8a5a3a', 3)})
    return a, 0
def wildsense():
    a = A('night', cuts=[0.0, 0.3, 0.55, 0.78, 0.94])
    for (x, y) in [(3, 6), (8, 6), (6, 12), (11, 12)]:
        a.paint(['gG', 'GG'], {'g': '#c8ff7a', 'G': '#5ac03a'}, ox=x, oy=y)
    return a, 0
def driveshot():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for k, (r, c) in enumerate([(6.4, '#ffffff'), (4.4, '#c8ffc0')]):
        for i in range(16):
            t = i / 15; ang = math.radians(190 + t * 110); a.set(int(8 + math.cos(ang) * r), int(14 + math.sin(ang) * r), c)
    ar(a, 'r', 13, 8, 2, small=True); ar(a, 'r', 11, 11, 2, small=True)
    return a, 0
def giantslayer():
    a = A('dawn', cy=17, r=16)
    sp(a, KAIJU, 0, 7)
    crosshair(a, 4.5, 11.5, 3.2, '#ff4a3a')
    return a, 0
def harpoon():
    a = A('water', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HARPOON, 1, 3)
    for (x, y) in [(2, 16), (4, 17), (0, 15)]: a.set(x, y, '#9ad4ff')
    return a, 0
def anatomy():
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(20):
        for x in range(16):
            if x % 4 == 0 or y % 4 == 0: a.set(x, y, mix(a.get(x, y), '#8ac0ff', 0.25))
    a.paint(DRAGONSKULL[0], {'e': '#e0f0ff', 'E': '#8ac0ff', 'k': '#ffffff'}, ox=2, oy=6)
    return a, 0
def quaketrap():
    a = A('earth', cy=16, r=13)
    for y in range(13, 20):
        for x in range(16): a.set(x, y, '#5a3418' if y > 13 else '#8e5c2a')
    for (x, y) in [(2, 14), (3, 15), (12, 14), (13, 15), (14, 16)]: a.set(x, y, '#ffc848')
    sp(a, TNT, 3, 6)
    plus(a, 4, 4, '#ffffff', '#ffd040')
    return a, 0
def titanfall():
    a = A('amber', cy=17, r=15)
    cm = {}
    for y in range(1, 13): cm[(7, y)] = 't'; cm[(8, y)] = 'T'
    for (x, y) in [(5, 13), (6, 13), (7, 13), (8, 13), (9, 13), (10, 13), (6, 14), (7, 14), (8, 14), (9, 14), (7, 15), (8, 15)]: cm[(x, y)] = 'm' if x < 8 else 'M'
    for (x, y) in [(5, 1), (6, 2), (10, 1), (9, 2)]: cm[(x, y)] = 'r'
    sp(a, grid(cm), {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3)})
    burst(a, 8, 17, big=False)
    for (x, y) in [(2, 17), (13, 17), (4, 18), (11, 18)]: a.set(x, y, '#e0c090')
    return a, 0
def arcanebolt():
    a = A('arcane', cx=10, cy=7)
    tail(a, 10.0, 7.5, 1.0, 14.5, 2.6, 0.6, ['#ffffff', '#d8c0ff', '#a880ff', '#6a40d0'])
    glow(a, 10.5, 7.0, 3.2, ['#6a40d0', '#b090ff', '#f0e0ff', '#ffffff'])
    for (x, y) in [(13, 3), (5, 4), (13, 11)]: plus(a, x, y, '#ffffff', '#c0b0ff')
    return a, 0
def manaward():
    a = A('arcane', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    ring(a, 7.5, 9.5, 6.6, [(0, 360)], '#c0b0ff', w=0.5); ring(a, 7.5, 9.5, 5.0, [(0, 360)], '#8a70e0', w=0.45)
    paint_cm(a, poly_cells(star_poly(7.5, 9.5, 4.6, 2.0, 6, -90), '1'), {'1': '#6a50c0'})
    for k in range(8):
        ang = math.radians(k * 45); a.set(int(7.5 + math.cos(ang) * 5.8), int(9.5 + math.sin(ang) * 5.8), '#ffffff')
    plus(a, 7, 9)
    return a, 0
def meteorfall():
    a = A('fire', cy=17, r=15)
    for (x, y, s) in [(4, 7, 1.6), (10, 12, 1.8), (12, 4, 1.3)]:
        tail(a, x + 0.5, y + 0.5, x + 5.5, y - 5.5, s, 0.4, ['#fff0a0', '#ffa030', '#e04a10'])
        sp(a, grid(orb(x + 0.5, y + 0.5, s + 0.3, 'fFd')), {'f': ('#a87a5a', 11), 'F': ('#6a4a34', 11), 'd': ('#3a261a', 11)})
    return a, 0
def arcanefocus():
    a = A('purple', rays=10, k=0.3)
    sp(a, CRYSTALBALL, 3, 5)
    return a, 0
def disintegrate():
    a = A('arcane', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    import spr as S
    body = S.NINJA[0]
    for (y, r) in enumerate(body):
        for x, ch in enumerate(r):
            if ch == '.': continue
            if x < 5: a.set(x + 2, y + 4, '#e8e0ff' if x < 4 else '#b8a8f0')
            elif (x * 3 + y) % 2 == 0: a.set(x + 2 + (x - 4) + (y % 3), y + 4 - (x - 4) // 2, '#e8e0ff' if (x + y) % 3 else '#a880ff')
    for (x, y) in [(13, 5), (14, 8), (12, 11), (14, 13), (11, 15)]: a.set(x, y, '#ffffff')
    return a, 0
def arcanestorm():
    a = A('arcane', cuts=[0.0, 0.3, 0.5, 0.72, 0.9])
    for k in range(3):
        slash(a, crescent(7.5, 9.5, 7.0 - k * 2.0, k * 120, k * 120 + 230, 1.6, fade=0.6), ('#ffffff', '#e0d0ff', '#a880ff', '#6a40d0'))
    for (x, y) in [(3, 4), (12, 5), (11, 15), (3, 14)]: plus(a, x, y, '#ffffff', '#c0b0ff')
    return a, 0
def amplify():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for r in (2.6, 4.2, 5.8): ring(a, 7.5, 4.5, r, [(0, 360)], '#8a8cf4' if r > 4 else '#c0c4ff', w=0.45)
    sp(a, STAFF, 4, 3)
    return a, 0
def gravity():
    a = A('night', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (x, y) in ring_cells(7.5, 9.5, 6.8, 2.6, w=0.7): a.set(x, y, '#c090ff')
    for (x, y) in ring_cells(7.5, 9.5, 5.2, 1.8, w=0.6): a.set(x, y, '#ffe0ff')
    disc(a, 7.5, 9.5, 3.0, '#0a0612'); ring(a, 7.5, 9.5, 3.0, [(0, 360)], '#8a5ac0', w=0.45)
    return a, 0
def ultima():
    a = A('holy', cuts=[0.0, 0.2, 0.4, 0.6, 0.8])
    ring(a, 7.5, 9.5, 7.0, [(0, 360)], '#ffffff', w=0.5)
    for k in range(2):
        pts = [(7.5 + 6.4 * math.cos(math.radians(-90 + k * 60 + i * 120)), 9.5 + 6.4 * math.sin(math.radians(-90 + k * 60 + i * 120))) for i in range(3)]
        for p0, p1 in zip(pts, pts[1:] + pts[:1]): line(a, round(p0[0]), round(p0[1]), round(p1[0]), round(p1[1]), '#fff4c0')
    glow(a, 7.5, 9.5, 3.0, ['#ffe890', '#ffffff'])
    return a, 0
def prism():
    a = A('night', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for i in range(7): a.set(i, 9, '#ffffff')
    for k, c in enumerate(['#ff4a4a', '#ff9a2a', '#ffe040', '#5ad05a', '#4a9aff', '#9a5aff']):
        for i in range(7): a.set(9 + i, 8 + k - 2 + round(i * (k - 2.5) * 0.25), c)
    sp(a, ['...c...', '..ccc..', '..cwcc.', '.ccccc.', '.cccccC', 'cccccCC', 'CCCCCCC'], 4, 5, {'c': ('#d8f4ff', 12), 'C': ('#8ac0e0', 12), 'w': ('#ffffff', 1)})
    return a, 0
def tidalwave():
    a = A('water', cy=4, r=16)
    for y in range(20):
        for x in range(16):
            cx, cy = 9.0, 9.0; d = math.hypot(x + 0.5 - cx, y + 0.5 - cy); ang = math.degrees(math.atan2(y + 0.5 - cy, x + 0.5 - cx))
            if y > 12 or (d < 6.2 and d > 3.0 and -200 < ang - 360 * (ang > 90) < 30):
                a.set(x, y, '#ffffff' if (d > 5.4 and y <= 12) else '#7ccaf4' if y < 14 else '#2e94dc')
    for x in range(16): a.set(x, 12 + (x % 3 == 0), '#e0f8ff')
    return a, 0
def stonefist():
    a = A('earth', cy=17, r=14)
    for y in range(15, 20):
        for x in range(16): a.set(x, y, '#5a3418' if y > 15 else '#8e5c2a')
    sp(a, STONEFIST, 2, 3)
    sp(a, ['ffffffff', 'FFFFFFFF'], 4, 13, {'f': ('#a89a88', 11), 'F': ('#6a5e50', 11)})
    for (x, y) in [(2, 14), (13, 14), (1, 12), (14, 11)]: a.set(x, y, '#e0c090')
    return a, 0
def elemfocus():
    a = A('arcane', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    ring(a, 7.5, 9.5, 5.4, [(0, 360)], '#c0b0ff', w=0.45)
    for k, c in enumerate(['#ff6a2a', '#3a9ae8', '#4ac05a', '#e0a040', '#fff060', '#bff0ff']):
        ang = math.radians(-90 + k * 60); x, y = 7.5 + math.cos(ang) * 5.4, 9.5 + math.sin(ang) * 5.4
        sp(a, grid(orb(x, y, 1.4)), {'1': (mix(c, '#ffffff', 0.4), 1), '2': (c, 1), '3': (mix(c, '#000000', 0.4), 1)})
    plus(a, 7, 9)
    return a, 0
def thundercall():
    a = A('thunder', cy=16)
    paint_cm(a, bolt([(4, 0), (2, 4), (5, 6), (3, 11), (4, 15)]), {'w': '#ffffff', 'y': '#fff060'})
    paint_cm(a, bolt([(11, 0), (13, 4), (10, 7), (12, 12), (11, 16)]), {'w': '#ffffff', 'y': '#fff060'})
    burst(a, 4, 16, big=False); burst(a, 11, 17, big=False)
    return a, 0
def transmute():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    ring(a, 7.5, 9.5, 6.6, [(0, 360)], '#bff0e8', w=0.5)
    pts = [(7.5 + 6.0 * math.cos(math.radians(-90 + i * 120)), 9.5 + 6.0 * math.sin(math.radians(-90 + i * 120))) for i in range(3)]
    for p0, p1 in zip(pts, pts[1:] + pts[:1]): line(a, round(p0[0]), round(p0[1]), round(p1[0]), round(p1[1]), '#8ae0d0')
    sp(a, INGOT, 2, 9)
    return a, 0
def frostflask():
    a = A('ice', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, FLASK, 4, 6, {'1': ('#9ae4ff', 12), '2': ('#3a8ad0', 12)})
    for (x, y, c) in [(2, 4, '#ffffff'), (13, 5, '#bff0ff'), (12, 13, '#ffffff'), (2, 14, '#bff0ff'), (11, 2, '#bff0ff'), (3, 9, '#9ae4ff')]:
        a.set(x, y, c)
    a.paint(['.w.', 'wcw', '.w.'], {'w': '#bff0ff', 'c': '#ffffff'}, ox=11, oy=8)
    return a, 0
def flashbang():
    a = A('holy', cuts=[0.0, 0.2, 0.4, 0.6, 0.8])
    sp(a, GRENADE, 2, 9)
    burst(a, 10, 6)
    return a, 0
def blazeflask():
    a = A('fire', cy=12)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y > 4 + 2 * abs(math.sin(x * 1.3)) + abs(u) * 0.3 and y < 11: a.set(x, y, '#ffa030' if abs(u) < 3 else '#e04a10')
    sp(a, FLASK, 4, 8, {'1': ('#ff6a3a', 14), '2': ('#a02a0a', 14)})
    return a, 0
def magnumopus():
    a = A('gold', rays=12, k=0.35)
    ring(a, 7.5, 9.5, 6.6, [(0, 360)], '#fff0a0', w=0.5)
    sq = [(3.5, 5.5), (11.5, 5.5), (11.5, 13.5), (3.5, 13.5)]
    for p0, p1 in zip(sq, sq[1:] + sq[:1]): line(a, round(p0[0]), round(p0[1]), round(p1[0]), round(p1[1]), '#ffe070')
    sp(a, ['..rr..', '.rhrr.', 'rrrrrR', 'rrrrRR', '.rrRR.', '..RR..'], 5, 7, {'r': ('#ff3a4a', 13), 'R': ('#9a1020', 13), 'h': ('#ffc0c0', 1)})
    return a, 0
ICONS = {'huntmark': ('사냥꾼의 표식', 'dmg', huntmark), 'trapnet': ('그물 덫', 'dmg', trapnet), 'biggame': ('대물 사냥', 'dmg', biggame), 'skinning': ('가죽 벗기기', 'none', skinning), 'volleytrap': ('덫 사격', 'dmg', volleytrap),
         'dragonpierce': ('용 관통', 'dmg', dragonpierce), 'wyrmbane': ('용살자의 눈', 'none', wyrmbane), 'slayrain': ('용살의 비', 'dmg', slayrain), 'dragonheart': ('용의 심장 꿰기', 'dmg', dragonheart),
         'trackshot': ('추적 사격', 'dmg', trackshot), 'snaretrap': ('올무 덫', 'dmg', snaretrap), 'houndpack': ('사냥개 풀기', 'dmg', houndpack), 'wildsense': ('야생의 감', 'none', wildsense), 'driveshot': ('몰이 사격', 'dmg', driveshot),
         'giantslayer': ('거대 사냥', 'dmg', giantslayer), 'harpoon': ('작살포', 'dmg', harpoon), 'anatomy': ('괴수 해부학', 'none', anatomy), 'quaketrap': ('지진 덫', 'dmg', quaketrap), 'titanfall': ('거신 낙하', 'dmg', titanfall),
         'arcanebolt': ('마력탄', 'mdmg', arcanebolt), 'manaward': ('마력 방벽', 'buff', manaward), 'meteorfall': ('유성 낙하', 'mdmg', meteorfall), 'arcanefocus': ('마력 집중', 'none', arcanefocus), 'disintegrate': ('분해', 'mdmg', disintegrate),
         'arcanestorm': ('마력 폭풍', 'mdmg', arcanestorm), 'amplify': ('마력 증폭', 'buff', amplify), 'gravity': ('중력 붕괴', 'mdmg', gravity), 'ultima': ('궁극 마법', 'mdmg', ultima),
         'prism': ('원소 프리즘', 'mdmg', prism), 'tidalwave': ('해일', 'mdmg', tidalwave), 'stonefist': ('바위 주먹', 'mdmg', stonefist), 'elemfocus': ('원소 조율', 'none', elemfocus), 'thundercall': ('낙뢰', 'mdmg', thundercall),
         'transmute': ('금속 변성', 'mdmg', transmute), 'frostflask': ('빙결 플라스크', 'mdmg', frostflask), 'flashbang': ('섬광탄', 'mdmg', flashbang), 'blazeflask': ('화염 플라스크', 'mdmg', blazeflask), 'magnumopus': ('대작 · 마그눔 오푸스', 'mdmg', magnumopus)}
