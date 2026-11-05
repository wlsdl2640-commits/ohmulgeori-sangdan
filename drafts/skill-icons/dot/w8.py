"""고쳐 그리기 후보: 전쟁의 함성(뿔피리 U / 깃발) · 기사단 돌격(손그림 창)"""
import math
import cell
from cell import Art, radial, mix
from w5 import slash, crescent, flash, rays_bg, ring, HILT, FL, BLOOD
from w6 import blank, rows, put, mirror, cm_rows
from w7 import tube, STEELB
def horn_letter(t, side):
    if t > 0.965 and abs(side) < 0.62: return 'k'
    if 0.26 < t < 0.33 or 0.58 < t < 0.65 or t > 0.9: return 'g' if side < 0.15 else 'G'
    return 'e' if side < -0.3 else 'E' if side > 0.4 else 'c'
HORNP = {'e': ('#fff4dc', 7), 'c': ('#e8c890', 7), 'E': ('#b08850', 7), 'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'k': ('#2a1008', 1)}
def warcry_horn():
    a = Art().bg(rays_bg(BLOOD, 11.5, 5.5, 14, [0.0, 0.2, 0.42, 0.64, 0.86], 12, '#0e0204', rot=0.1, k=0.45, hole=3))
    for R, c in [(3.0, '#ffffff'), (4.6, '#ffe080')]:
        ring(a, 12.2, 5.2, R, [(-150, -10)], c, w=0.5)
    a.sym(cm_rows(tube((2.4, 3.6), (3.2, 18.5), (11.6, 6.4), 0.6, 2.7, horn_letter)), HORNP)
    return a, 0
FLAG = ['.......w........',
        '.......m........',
        '......gtG.......',
        '.......trrrrrr..',
        '.......trrrrrRR.',
        '.......trryyrRR.',
        '.......tryyyyRR.',
        '.......trryyrRR.',
        '.......trrrrrRR.',
        '.......trrrrRR..',
        '.......trrr.rR..',
        '.......tr....R..',
        '.......t........',
        '.......t........',
        '.......t........',
        '.......t........',
        '.......T........']
FLAGP = {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'r': ('#e83a2a', 13), 'R': ('#a01a14', 13), 'y': ('#ffd84a', 6), 'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6)}
WARM = ['#2a1002', '#5a2606', '#8e440c', '#c06a16', '#e8962c', '#ffc858']
def warcry_flag():
    a = Art().bg(rays_bg(WARM, 7.5, 6.0, 13, [0.0, 0.2, 0.42, 0.64, 0.86], 12, '#2a1002', rot=0.1, k=0.4, hole=3))
    ring(a, 7.5, 9.0, 7.4, [(150, 210)], '#fff0c8'); ring(a, 7.5, 9.0, 7.4, [(-30, 30)], '#fff0c8')
    ring(a, 7.5, 9.0, 8.8, [(155, 205)], '#ffd080'); ring(a, 7.5, 9.0, 8.8, [(-25, 25)], '#ffd080')
    a.sym(FLAG, FLAGP, oy=1)
    return a, 0
LANCE = ['................',
         '................',
         '.............w..',
         '........ppPwm...',
         '.......ppPwmM...',
         '......pPP.wmM...',
         '.........wmmM...',
         '........wmmmM...',
         '.......wmmmmM...',
         '......bbbbbB....',
         '.....wmmmmmM....',
         '...ggwmmmmM.....',
         '...gggmmmM......',
         '....GgGGG.......',
         '...rR.GGG.......',
         '..rR...G........',
         '.y..............']
LANCEP = {'p': ('#4a8aff', 12), 'P': ('#2a4aa0', 12), 'w': ('#ffffff', 5), 'm': ('#d0dcf0', 5), 'M': ('#8a9ab8', 5), 'b': ('#4a7ae8', 12), 'B': ('#2a4aa0', 12),
          'g': ('#e0e8f4', 11), 'G': ('#7a8498', 11), 'r': ('#b0682a', 9), 'R': ('#7a4220', 9), 'y': ('#ffd84a', 6)}
def kn_charge2():
    a = Art().bg(rays_bg(STEELB, 12.0, 4.0, 16, [0.0, 0.2, 0.4, 0.6, 0.8], 14, '#06102a', rot=0.0, k=0.35, hole=3))
    for (x0, y0, n) in [(0, 11, 4), (6, 16, 4), (1, 15, 2)]:
        for i in range(n): a.set(x0 + i, y0 - i, '#ffffff' if i == n - 1 else '#a8ccff')
    a.sym(LANCE, LANCEP)
    flash(a, 14, 2, big=True)
    return a, 0
ICONS = {'horn': ('전쟁의 함성 (뿔피리)', 'buff', warcry_horn), 'flag': ('전쟁의 함성 (깃발)', 'buff', warcry_flag), 'lance': ('기사단 돌격', 'dmg', kn_charge2)}
