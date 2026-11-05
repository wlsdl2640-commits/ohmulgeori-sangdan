import cell
from cell import Art
from lib import *
from arrows import arrow, AP
def A(theme, **k): return bg(Art(), theme, **k)
def mk(cms, theme):
    def fn():
        a = A(theme)
        for cm in cms: sp(a, grid(cm), AP)
        return a, 0
    return fn
ICONS = {'ur': ('ur', 'dmg', mk([arrow('ur', 13, 3, 4)], 'teal')), 'dl': ('dl', 'dmg', mk([arrow('dl', 2, 16, 4)], 'teal')),
         'ul': ('ul', 'dmg', mk([arrow('ul', 2, 3, 4)], 'green')), 'dr': ('dr', 'dmg', mk([arrow('dr', 13, 16, 4)], 'green')),
         'r': ('r', 'dmg', mk([arrow('r', 15, 9, 7)], 'sky')), 'l': ('l', 'dmg', mk([arrow('l', 0, 9, 7)], 'sky')),
         'd': ('d', 'dmg', mk([arrow('d', 7, 17, 8)], 'amber')), 'u': ('u', 'dmg', mk([arrow('u', 7, 1, 8)], 'amber'))}
