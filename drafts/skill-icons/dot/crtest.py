from lib import *
from cell import Art
import crit as C
def mk(spr, x, y, theme='sky'):
    def f():
        a = bg(Art(), theme); sp(a, spr, x, y); return a, 0
    return f
ICONS = {'boar': ('멧돼지', 'dmg', mk(C.BOAR, 0, 6, 'green')), 'stag': ('수사슴', 'dmg', mk(C.STAG, 1, 3, 'green')), 'deer': ('달리는 사슴', 'dmg', mk(C.DEERRUN, 1, 5, 'green')),
         'dh': ('용 머리', 'dmg', mk(C.DRAGONH, 0, 4, 'fire')), 'df': ('나는 용', 'dmg', mk(C.DRAGONFLY, 0, 5, 'dawn')), 'kj': ('괴수', 'dmg', mk(C.KAIJU3, 1, 4, 'ember')),
         'ti': ('돌 거신', 'dmg', mk(C.TITAN, 2, 4, 'evil')), 'cy': ('외눈 거인', 'dmg', mk(C.CYCLOPS, 1, 5, 'amber'))}
