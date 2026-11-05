"""2단계 고치기 E: 의사·마검사·별검사·사제·대주교·역병 의사·퇴마사·이단 심문관 · 섞인 계열 23개 (사용자 표시)"""
import math
import cell
from cell import Art, mix, W, H, dsword, dsword_ur, sword
from lib import *
from spr import *
from arrows import ar, AP
import w5, w6
def A(theme, **k): return bg(Art(), theme, **k)
GOLD = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
HEART2 = (['.rrr....rrr.', 'rrhrr..rrrrr', 'rhrrrrrrrrrR', 'rrrrrrrrrrRR', 'rrrrrrrrrrRR', '.rrrrrrrrRR.', '..rrrrrrRR..', '...rrrrRR...', '....rrRR....', '.....RR.....'],
          {'r': ('#ff5a5a', 13), 'R': ('#b02a30', 13), 'h': ('#ffd0d0', 1)})
RAT2 = (['....uu..........', '...uUuk.........', '..kkkkkkkk......', '.kkrkkkkkkkkk...', 'ukkkkkkkkkkkkk..', '.wkkkkkkkkkkkkk.', '..kKKKKKKKKKKkk.', '...kk.kkk...kk.u', '..............u.', '............uu..'],
        {'k': ('#5e5468', 4), 'K': ('#3e3646', 4), 'r': ('#ff3a2a', 1), 'u': ('#e8909a', 16), 'U': ('#b05a6a', 16), 'w': ('#ffffff', 1)})
FROSTB = (['.....c......', '....cc......', '....ca......', '..w.ca......', '..wcca.w....', '....ca.ww...', '....ca......', '..wwcac.....', '...cca......', '....caww....', '....ca......',
           '.BbbbbbbbbB.', '....lL......', '....lL......', '....aA......', '....AA......'],
          {'c': ('#e0faff', 12), 'a': ('#7ac8f0', 12), 'w': ('#ffffff', 12), 'b': ('#5aa8e8', 5), 'B': ('#2a5a9a', 5), 'A': ('#2a6ab0', 12), 'l': ('#4a6a9a', 9), 'L': ('#2a3e66', 9)})
NUN = (['....hhhh....', '...hhhhhh...', '..hhhsshhh..', '..hhhsshhh..', '..hhhhhhhh..', '.hhhhsshhhh.', '.hheessseeh.', '.heeessseeh.', 'heeeEssEeeeh', 'heeeeEEeeeeh', 'eeeeeeeeeeee', 'EEEEEEEEEEEE'],
       {'h': ('#3a4a8a', 4), 's': ('#f8d0a8', 2), 'e': ('#e8e4f0', 7), 'E': ('#a8a4c0', 7)})
DOVE3 = (['......w.......', '.....ww.......', '....wwe.......', '...wwee.......', '..wweee....ww.', '.wweeee...wwkO', 'wwwwwwwwwwwwg.', '.wwwwwwwwwwg.g', 'EEwwwwwwwwg.g.', '.EE..EEEE..g..'],
         {'w': ('#ffffff', 7), 'e': ('#c8d0e0', 7), 'E': ('#9aa4b8', 7), 'k': ('#1a1414', 1), 'O': ('#ffa040', 14), 'g': ('#5ac04a', 8)})
ARCH2 = (['......yyy......', '.....y...y.....', '......sss......', 'w.....sss.....w', 'ww...eyyye...ww', 'wEw.eeeeeee.wEw', 'wwEweeeeeeewEww', '.wwEeeeeeeeEww.', '.wwwEeeeeeEwww.', '..wwwEeeeEwww..', '...wwEeeeEww...', '....weeeeew....', '.....eeeee.....', '....EEEEEEE....'],
         {'y': ('#ffd84a', 6), 's': ('#f8d0a8', 2), 'w': ('#ffffff', 7), 'E': ('#b8c0d8', 7), 'e': ('#f4ecd8', 4)})
PHX = (['.......yy.......', '......yyy.......', 'o....oyrr....o..', 'oo..oyyrr...oo..', '.oo.oyyyyo.oo...', '.ooooyyyyyooo...', '..oooyyyyyoo....', '...ooryyyroo....', '....orryyro.....', '.....rryyr......', '.....rroor......', '....rr.oo.rr....', '...r...oo...r...', '......o..o......'],
       {'y': ('#ffe060', 6), 'o': ('#ff8a2a', 14), 'r': ('#e03a1a', 13)})
MORTAR = (['......tT..', '.....tT...', '....tT....', 'gG.tT..gG.', 'ggGgggGgg.', 'ffffffffff', 'Ffffffffff', '.Ffffffff.', '..FFFFFF..', '...FFFF...', '..FFFFFF..'],
          {'t': ('#c8a070', 3), 'T': ('#7a5a3a', 3), 'g': ('#6ad04a', 8), 'G': ('#2e8a2a', 8), 'f': ('#c8c0d8', 11), 'F': ('#8a84a0', 11)})
BEAKM = (['..kkkkkkkk....', '.kkkkkkkkkk...', 'kkkkkkkkkkkk..', '...nnnnnn.....', '..nGGnnGGn....', '..nGgnnGgn....', '..nnnnnnnnn...', '...nnnnnnnnn..', '....nnnnnnnnn.', '.....nnnnnnnnn', '......nn..nnn.', '...........nn.'],
         {'k': ('#2a2430', 4), 'n': ('#4a3a30', 9), 'G': ('#1a3a10', 1), 'g': ('#9aff4a', 1)})
HFLASK = (['....yy....', '....yY....', '...fwwf...', '..fwccAf..', '.fwcccAAf.', 'fwcccyAAAf', 'fcccyyyAAf', 'fcccAyAAAf', '.fcccyAAf.', '..ffAAff..'],
          {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'f': ('#e0f0ff', 12), 'w': ('#ffffff', 1), 'c': ('#9ad8ff', 12), 'A': ('#3a8ad0', 12)})
GHO = ['.ppp.', 'pkpkp', 'ppppp', 'pp.pp']
CONCH2 = (['.......ee.', '.....eeEe.', '...eeuueE.', '..euuuuueE', '.euuUUuuuE', 'euuUeeUuuE', 'euuUeUUuE.', '.euuUUuuE.', '..eeuuuE..', '...eeEE...', '....eE....'],
          {'e': ('#fff0e0', 7), 'E': ('#c8a890', 7), 'u': ('#ffb0b8', 16), 'U': ('#d0707a', 16)})
TREE = (['...gggGG...', '.ggghgggGG.', 'gghggggggGG', 'gggggghgggG', 'gggggggggGG', '.ggggggGGG.', '...ttTTG...', '....tT.....', '....tT.....', '...ttTT....', '..tt..TT...'],
        {'g': ('#5ac04a', 8), 'G': ('#2a7a2e', 8), 'h': ('#b8f0a0', 8), 't': ('#a8743a', 3), 'T': ('#6a4422', 3)})
def cureall():
    a = A('heal', rays=12, k=0.35, hole=4)
    sp(a, HEART2, 1, 7)
    for (x, y) in [(3, 9), (4, 10), (5, 11), (6, 11), (7, 12), (8, 13), (9, 13)]: a.set(x, y, '#5a1018')
    for (x, y) in [(3, 8), (4, 11), (5, 10), (6, 12), (7, 11), (8, 14), (9, 12)]: a.set(x, y, '#ffffff')
    for (x, y) in [(10, 12), (11, 11), (12, 10), (12, 9)]: a.set(x, y, '#9aff7a')
    NEED = ['......wm', '.....wmM', '....wmM.', '...wmM..', '..wmM...', '.wmM....', 'mM......', 'M.......']
    sp(a, NEED, 7, 1, {'w': ('#ffffff', 5), 'm': ('#d4dcea', 5), 'M': ('#7a849a', 5)})
    a.set(13, 2, '#3a4a5a')
    for (x, y) in [(2, 3), (1, 15)]: plus(a, x, y, '#ffffff', '#c8ffc0')
    return a, 0
def blackdeath():
    a = A('poison', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(3.5, 5.5, 2.4), (7.5, 4.2, 2.8), (12.0, 5.6, 2.4)]), {'1': '#6a8a2a', '2': '#4a6a1a'})
    for y in range(15, 20):
        for x in range(16): a.set(x, y, '#1e2a0a')
    sp(a, RAT2, 0, 7)
    for (x, y) in [(2, 2), (13, 3), (10, 1), (5, 16), (12, 17)]: a.set(x, y, '#141414')
    for (x, y) in [(3, 1), (14, 2), (11, 2)]: a.set(x, y, '#c8ff8a')
    return a, 0
def frostblade():
    a = A('ice', rays=12, k=0.35, hole=3)
    paint_cm(a, cloud([(3, 17.5, 1.8), (7.5, 18.2, 1.6), (12, 17.6, 1.8)]), {'1': '#c8eaff', '2': '#8ac0e8'})
    sp(a, FROSTB, 2, 1)
    for (x, y) in [(13, 4), (1, 9), (13, 13)]: a.paint(['.w.', 'wcw', '.w.'], {'w': '#ffffff', 'c': '#9ad8ff'}, ox=x - 1, oy=y - 1)
    return a, 0
def arcaneguard():
    a = A('arcane', rays=12, k=0.35, hole=4)
    sp(a, grid(dsword(11, 17, Lb=10, Lg=2, g=1, wide=3)), dict(GOLD, l=('#5a3a8a', 9), L=('#3a2460', 9)))
    sh = w6.heater(12, 13, 1, 3, ('z', 'Z'), ('p', 'P'))
    sh = {k: v for k, v in sh.items()}
    for (x, y) in [(6, 7), (7, 6), (8, 7), (7, 8), (7, 7), (5, 9), (9, 9), (7, 10), (6, 11), (8, 11), (7, 12)]:
        if (x, y) in sh: sh[(x, y)] = 'w'
    sp(a, grid(sh), {'z': ('#e8d8ff', 10), 'Z': ('#a888e8', 10), 'p': ('#8a5ae0', 10), 'P': ('#5a34b0', 10), 'w': ('#ffffff', 1)}, glow_c='#c8a8ff')
    return a, 0
def starward():
    a = A('night', rays=16, k=0.3, hole=3)
    sh = {}
    for (x, y) in ellipse(7.5, 10.0, 6.0, 6.0, 'x'):
        d = math.hypot(x + 0.5 - 7.5, y + 0.5 - 10.0)
        sh[(x, y)] = ('y' if x + y < 17 else 'Y') if d > 4.9 else ('b' if x + y < 17 else 'B')
    for (x, y) in poly_cells(star_poly(7.5, 10.2, 4.0, 1.7), 's'): sh[(x, y)] = 's' if x + y < 18 else 'S'
    sp(a, grid(sh), dict(GOLD, b=('#2e4ea8', 12), B=('#1c3070', 12), s=('#fff0a0', 6), S=('#e0b030', 6)))
    for (x, y) in [(1, 3), (14, 4), (0, 15), (15, 15), (7, 2)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
def swordsaint():
    a = A('royal', rays=12, k=0.35, hole=3)
    w5.slash(a, w5.crescent(5.5, 13.5, 11.0, 250, 360, 3.0, fade=0.85), cols=('#ffffff', '#c8f0ff', '#8ab4ff', '#7a5ae0'))
    sp(a, grid(dsword_ur(14, 2, Lb=9, Lg=2, g=1)), dict(GOLD, l=('#4a2a7a', 9), L=('#2a1850', 9)), glow_c='#a8d8ff')
    for (x, y) in [(3, 4), (12, 15), (2, 12)]: star5(a, x, y, '#ffffff', '#c8e8ff', '#8ab4ff')
    return a, 0
def prayer():
    a = A('night', cx=7.5, cy=3, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for y in range(0, 18):
        w = 2.4 + y * 0.2
        for x in range(16):
            d = abs(x + 0.5 - 7.5)
            if d < w: a.set(x, y, mix(a.get(x, y), '#fff4c0', 0.5 if d < w - 1.2 else 0.25))
    sp(a, [r.replace(' ', 'h') for r in NUN[0]], 2, 6, NUN[1])
    a.paint(['.g.', 'ggg', '.g.'], {'g': '#7aff6a'}, ox=12, oy=3)
    a.paint(['.y.', 'yhy', '.y.'], {'y': '#ffe070', 'h': '#ffffff'}, ox=6, oy=2)
    return a, 0
def grace():
    a = A('holy', rays=16, k=0.4, hole=3)
    sp(a, DOVE3, 1, 5)
    for (x, y) in [(13, 2), (2, 16), (13, 16)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
def miracle():
    a = A('holy', rays=16, k=0.45, hole=2)
    glow(a, 7.5, 9.5, 5.0, ['#ecc650', '#fff4b8'])
    a.paint(['......w......', '......w......', '.....hwh.....', '.....hwh.....', '....hwwwh....', 'ww.hwwwwwh.ww', '.hwwwwwwwwwh.', 'ww.hwwwwwh.ww', '....hwwwh....', '.....hwh.....', '.....hwh.....', '......w......', '......w......'][0:13],
            {'w': '#ffffff', 'h': '#fff0a0'}, ox=1, oy=3)
    for (x, y) in [(2, 3), (12, 3), (1, 14), (13, 14)]:
        sp(a, ['.g.', 'ggG', '.G.'], x, y, {'g': ('#6ae05a', 8), 'G': ('#2e8a2a', 8)})
    return a, 0
def holyland():
    a = A('sky', cy=8, r=13, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for (x, y) in ring_cells(7.5, 15.0, 7.4, 11.0, 0.5):
        if y < 15: a.set(x, y, '#fff4b8')
    for y in range(H):
        for x in range(W):
            if (x + 0.5 - 7.5) ** 2 / 64 + (y + 0.5 - 21) ** 2 / 49 <= 1: a.set(x, y, '#4ab04a' if y < 16 else '#2e8a30')
    sp(a, ['..yy..', '..yY..', 'yyyyYY', 'YYyYYY', '..yY..', '..yY..', '..yY..', '..YY..'], 5, 5, GOLD, glow_c='#fff4b8')
    for (x, y) in [(2, 9), (13, 9)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
def archangel():
    a = A('holy', cy=6, rays=14, k=0.4, hole=3)
    sp(a, ARCH2, 0, 5)
    sp(a, ['w', 'w', 'h', 'h', 'h', 'h', 'Y'], 12, 1, {'w': ('#ffffff', 1), 'h': ('#fff0a0', 6), 'Y': ('#c08a1c', 6)}, glow_c='#fff4c0')
    return a, 0
def resurrect():
    a = A('dark', cy=14, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    glow(a, 7.5, 9.0, 6.0, ['#562878', '#9a3a5a'])
    for (x, y) in [(2, 16), (13, 15), (5, 18), (10, 18)]: a.set(x, y, '#ff8a2a')
    sp(a, PHX, 0, 3)
    a.set(8, 4, '#1a1414')
    return a, 0
def remedy():
    a = A('heal', cy=14, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, MORTAR, 3, 7)
    for (x, y) in [(2, 5), (12, 3), (4, 2), (13, 8)]:
        a.paint(['.g.', 'gwg', '.g.'], {'g': '#7aff6a', 'w': '#e0ffd8'}, ox=x - 1, oy=y - 1)
    ring(a, 7.5, 13.0, 7.2, [(200, 250), (290, 340)], '#c8ffb8', w=0.5)
    return a, 0
def epidemic():
    a = A('poison', cy=13, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(2.5, 15.0, 2.6), (6.5, 16.5, 2.6), (11.0, 16.0, 2.8), (14.0, 13.0, 1.8)]), {'1': '#8ab040', '2': '#5a7a2a'})
    sp(a, BEAKM, 1, 3)
    for (x, y) in [(13, 3), (14, 6), (1, 12)]: a.set(x, y, '#c8ff8a')
    return a, 0
def holywater():
    a = A('sky', rays=14, k=0.35, hole=3)
    rws = rot90(HFLASK[0])
    sp(a, (rws, HFLASK[1]), 1, 2)
    for (x, y) in [(12, 6), (13, 9), (11, 11), (14, 13), (12, 15), (9, 14), (13, 17)]:
        a.paint(['.c.', 'cwc', '.c.'], {'c': '#9ad8ff', 'w': '#ffffff'}, ox=x - 1, oy=y - 1)
    for (x, y) in [(10, 9), (15, 11), (10, 17)]: a.set(x, y, '#fff0a0')
    return a, 0
def exorcism():
    a = A('holy', rays=16, k=0.45, hole=2)
    glow(a, 7.5, 9.5, 4.2, ['#fff0a0', '#ffffff'])
    a.paint(['.......w.......', '.......w.......', '......hwh......', 'ww...hwwwh...ww', '.hhhwwwwwwwhhh.', 'ww...hwwwh...ww', '......hwh......', '.......w.......', '.......w.......'], {'w': '#ffffff', 'h': '#fff0a0'}, ox=0, oy=5)
    GH = (['.pppp.', 'pppppp', 'pkppkp', 'ppkkpp', 'pppppp', 'p.pp.p'], {'p': ('#d8ccf8', 10), 'k': ('#2a1a4a', 1)})
    for (x, y) in [(0, 3), (10, 3), (5, 13)]:
        sp(a, GH, x, y)
    for (x0, y0, x1, y1) in [(6, 6, 7, 7), (9, 6, 8, 7), (7, 12, 7, 11)]: pass
    return a, 0
def inquisition():
    a = A('blood', cy=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    BOOK = ['RRRRRRRRRRR', 'RrrrrrrrrrRe', 'RrrrryrrrrRe', 'RrrryyyrrrRe', 'RrrrryrrrrRe', 'RrrrryrrrrRe', 'RrrrrrrrrrRe', 'RrrrrrrrrrRe', 'RRRRRRRRRRRe', '.eeeeeeeeeee']
    sp(a, BOOK, 2, 4, {'R': ('#5a1418', 13), 'r': ('#8a2026', 13), 'y': ('#ffd84a', 6), 'e': ('#e8dcc0', 7)})
    ch = {}
    for i in range(14):
        x, y = 1 + i, 3 + i * 0.85
        ch[(x, int(y))] = 'm' if i % 2 == 0 else 'M'
        x2, y2 = 14 - i, 3 + i * 0.85
        ch[(x2, int(y2))] = 'm' if i % 2 == 0 else 'M'
    sp(a, grid(ch), {'m': ('#c8ccd8', 5), 'M': ('#6a7084', 5)})
    sp(a, ['.mm.', 'm..m', 'mMMm', 'MMMM'], 6, 13, {'m': ('#c8ccd8', 5), 'M': ('#6a7084', 5)})
    for (x, y) in [(2, 17), (13, 17), (7, 1)]: a.set(x, y, '#ff8a3a')
    return a, 0
def fr_song():
    a = A('water', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(15, 20):
        for x in range(16):
            if y > 15: a.set(x, y, '#2e94dc' if y < 17 else '#1468b4')
    for x in range(16):
        if (x + 1) % 4 < 2: a.set(x, 15, '#c8f0ff')
        else: a.set(x, 15, '#2e94dc')
    sp(a, CONCH2, 1, 5)
    N8 = ['.ww', '.w.', '.w.', 'ww.', 'ww.']
    sp(a, N8, 11, 1, {'w': ('#ffffff', 1)}); sp(a, N8, 12, 8, {'w': ('#ffffff', 1)})
    return a, 0
def el_breath():
    a = A('green', cy=8, rays=12, k=0.3, hole=4)
    sp(a, TREE, 0, 4)
    w5.slash(a, w5.crescent(5.0, 9.0, 9.6, 300, 400, 2.0, fade=0.7), cols=('#ffffff', '#e0ffe8', '#a8f0c0', '#5ac080'))
    for (x, y) in [(13, 13), (11, 16), (14, 9)]:
        a.paint(['gG', 'G.'], {'g': '#9aff7a', 'G': '#3a9a3a'}, ox=x, oy=y)
    return a, 0
def dw_grit():
    a = A('earth', cy=6, rays=12, k=0.35, hole=3)
    PICK = ['mmmm......', 'MMMmm.....', '...tMm....', '...t.Mm...', '..t...M...', '.t........', 't.........']
    PK = ['mmmm...', 'MMMmm..', '..tTMm.', '..tT.Mm', '.tT...M', 'tT.....', 'T......']
    sp(a, PK, 1, 10, {'m': ('#d4dcea', 5), 'M': ('#7a849a', 5), 't': ('#c08a4a', 3), 'T': ('#7a4c22', 3)})
    sp(a, flip(PK), 8, 10, {'m': ('#d4dcea', 5), 'M': ('#7a849a', 5), 't': ('#c08a4a', 3), 'T': ('#7a4c22', 3)})
    HELM = ['....ww....', '...wwww...', '..yyhhyy..', '.yyyhhyyY.', 'yyyyyyyyYY', 'yyyyyyyyYY', 'YYYYYYYYYY', 'ttttttttttt']
    sp(a, HELM, 3, 3, {'w': ('#ffffff', 1), 'h': ('#fff8c8', 1), 'y': ('#ffd040', 6), 'Y': ('#b8901c', 6), 't': ('#7a5a3a', 3)})
    for i, (x, y) in enumerate([(7, 2), (8, 1), (6, 1), (9, 0), (5, 0)]): a.set(x, y, '#fff8c8')
    return a, 0
def weaken():
    a = A('purple', cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (cx, cy, r) in [(4, 5, 2.0), (12, 4, 1.6), (2, 13, 1.8)]:
        paint_cm(a, cloud([(cx, cy, r)]), {'1': '#9a5ac8', '2': '#6a3a98'})
    up = {k: v for k, v in dsword_ur(12, 2, Lb=4, Lg=0, g=0).items() if v in 'wmM'}
    sp(a, grid(up), {})
    sp(a, grid(dsword_ur(6, 9, Lb=3, Lg=2, g=1)), dict(GOLD, l=('#5a3a2a', 9), L=('#3a2418', 9)))
    for (x, y) in [(8, 7), (9, 6), (7, 6)]: a.set(x, y, '#ffffff')
    sp(a, ['.rR.', '.rR.', 'rrRR', '.rR.'], 10, 10, {'r': ('#ff5a5a', 13), 'R': ('#b02a2a', 13)})
    sp(a, ['.rR.', '.rR.', 'rrRR', '.rR.'], 6, 13, {'r': ('#ff5a5a', 13), 'R': ('#b02a2a', 13)})
    return a, 0
def riposte():
    a = A('steelb', cy=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    BUCK = {}
    for (x, y) in ellipse(4.5, 9.5, 3.6, 3.6, 'x'):
        d = math.hypot(x + 0.5 - 4.5, y + 0.5 - 9.5)
        BUCK[(x, y)] = 'y' if d < 1.2 else ('m' if x + y < 14 else 'M')
    sp(a, grid(BUCK), dict(GOLD, m=('#d4dcea', 5), M=('#7a849a', 5)))
    sp(a, grid(sword(15.0, 4.6, 140, blade=8.0, bw=1.8, tip=1.4, guard=3.6, gt=1.0, grip=2.0, gw=1.0, pom=0.8)), dict(GOLD, l=('#7a4a2a', 9), L=('#4a2a18', 9)))
    flash(a, 2, 6, big=True)
    ring(a, 7.5, 9.5, 6.4, [(110, 200)], '#ff8a6a', w=0.5)
    return a, 0
def ar_combo():
    a = A('earth', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (x0, y0, x1, y1) in [(9, 1, 1, 9), (13, 3, 3, 13), (15, 7, 7, 15)]:
        slash_line(a, x0, y0, x1, y1, 1.7, '#ffffff', '#ff9a4a')
    for (x, y) in [(2, 8), (4, 12), (8, 14)]: flash(a, x, y)
    sp(a, grid(dsword(1, 18, Lb=4, Lg=1, g=1, wide=3)), dict(GOLD, l=('#7a4a2a', 9), L=('#4a2a18', 9)))
    return a, 0
ICONS = {'cureall': ('명의의 손', 'heal', cureall), 'blackdeath': ('흑사병', 'dot', blackdeath), 'frostblade': ('냉기검', 'mdmg', frostblade), 'arcaneguard': ('마력 보호막', 'shield', arcaneguard), 'starward': ('별의 보호막', 'shield', starward), 'swordsaint': ('검성의 일격', 'mdmg', swordsaint), 'prayer': ('기도', 'heal', prayer), 'grace': ('신의 은총', 'buff', grace), 'miracle': ('기적', 'heal', miracle), 'holyland': ('성지', 'buff', holyland), 'archangel': ('대천사 강림', 'mdmg', archangel), 'resurrect': ('부활', 'revive', resurrect), 'remedy': ('재생 처방', 'regen', remedy), 'epidemic': ('역병 확산', 'dot', epidemic), 'holywater': ('성수', 'dot', holywater), 'exorcism': ('대퇴마', 'mdmg', exorcism), 'inquisition': ('이단 심문', 'mdmg', inquisition), 'fr_song': ('남해의 노래', 'heal', fr_song), 'el_breath': ('숲의 숨결', 'heal', el_breath), 'dw_grit': ('광부의 끈기', 'buff', dw_grit), 'weaken': ('약화의 저주', 'mdmg', weaken), 'riposte': ('되치기', 'buff', riposte), 'ar_combo': ('투기장 연격', 'dmg', ar_combo)}
