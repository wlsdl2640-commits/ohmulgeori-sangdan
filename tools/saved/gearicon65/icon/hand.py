"""손그림 20×20 판 → 그림 (테두리 · 빛 테두리 · 효과)"""
from wic import Ico, N
def H(rows, pal, fx=None, glow=None, out=None, under=None, noout=''):
    ic = Ico(pal)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch not in '. ': ic.body[(x, y)] = ch
    for src, L in ((fx, ic.fx), (under, ic.under)):
        if src:
            for y, r in enumerate(src):
                for x, ch in enumerate(r):
                    if ch not in '. ': L[(x, y)] = ch
    ic.glow = glow
    if out: ic.out = out
    ic.noout = set(noout)
    return ic
def show(ic):
    for y in range(N): print('%2d ' % y + ''.join(ic.body.get((x, y), '.') for x in range(N)))
