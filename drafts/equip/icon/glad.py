"""글라디우스 16자루 (Lv1 · 10 · … · 150): 넓고 짧은 곧은 날 · 둥근 덩이 코등이 · 마디 손잡이 · 공 자루 끝"""
import math
from wic import *
from sheet import sheet
# 기본 꼴 (칼 좌표)
POM = 2.1      # 자루 끝 공 가운데
GR0, GR1 = 3.6, 7.4   # 손잡이
GU0, GU1 = 7.4, 9.4   # 코등이
BL0, BL1 = 9.4, 23.6  # 날
def pompeii(tipl=3.4, hw=1.55):
    """곧은 날 · 짧은 세모 끝"""
    return lambda S: hw if S < BL1 - tipl else hw * (BL1 - S) / tipl
def mainz(hw=1.6, waist=1.15, tipl=5.5):
    """허리 잘록 · 긴 끝"""
    def f(S):
        k = (S - BL0) / (BL1 - BL0)
        if S > BL1 - tipl: return hw * 1.02 * (BL1 - S) / tipl
        return hw - (hw - waist) * math.sin(min(1, k / 0.62) * math.pi) * 0.9
    return f
def guard_round(ic, w=3.1, s0=GU0, s1=GU1, roles=('h', 'g', 'G')):
    """둥근 덩이 코등이: 양 끝을 둥글게"""
    m = (s0 + s1) / 2
    def tw(S): return w - 0.9 * ((S - m) / ((s1 - s0) / 2)) ** 2
    ic.band(s0, s1, tw, tw, side3(*roles))
def grip_rib(ic, s0=GR0, s1=GR1, hw=0.8, a='r', b='R', step=1.42, rib='q'):
    def f(S, T, lo, hi):
        k = int((S - s0) / step)
        if rib and k % 2 == 1: return rib if T < 0.3 else b
        return a if T < 0.3 else b
    ic.band(s0, s1, hw, hw, f)
def pommel_ball(ic, r=1.9, S=POM, roles=('p', 'p', 'P'), hi='q', nub=None):
    ic.disc(S, 0, r, ball(*roles, hi=hi))
    if nub: ic.disc(S - r - 0.4, 0, 0.6, nub)

# ───────── 16자루 ─────────
G = []
def make(lv, name, desc):
    def deco(fn): G.append((lv, name, desc, fn)); return fn
    return deco
STEEL = dict(w='#ffffff', b='#d2d6de', c='#a8aeba', B='#9298a6', n='#5e6472')
WOOD = dict(h='#d8a868', g='#a8743e', G='#6a4422')

@make(1, '나무 연습검', '참나무를 깎은 투사 연습용. 끝이 뭉툭하다')
def g01():
    ic = Ico(dict(w='#e8c48a', b='#c89458', c='#a87440', B='#9a6a38', n='#6a4422', h='#c89458', g='#9a6a38', G='#5e3c1e',
                  r='#d8c8a0', R='#9a8a68', q='#b8a880', p='#b07a40', P='#6a4422'))
    def tw(S): return 1.55 if S < BL1 - 1.6 else 1.55 * max(0.35, (BL1 - S) / 1.6) + 0.15
    ic.band(BL0, BL1 - 0.2, tw, tw, blade_role(fuller=(BL0 + 2, BL1 - 3)))
    ic.band(GU0 + 0.3, GU1, 2.2, 2.2, side3('h', 'g', 'G'))
    grip_rib(ic, a='r', b='R', rib='q', step=0.9)
    pommel_ball(ic, r=1.5, S=POM + 0.6, roles=('p', 'p', 'P'), hi=None)
    return ic

@make(10, '신참 투사검', '쇠 날 · 나무 코등이 · 공 자루 끝. 가장 흔한 투사의 칼')
def g10():
    ic = Ico(dict(STEEL, **WOOD, r='#8a5a32', R='#5a3418', q='#a87444', p='#b8823e', P='#6a4422', q2='#e0b070'))
    ic.band(BL0, BL1, pompeii(), pompeii(), blade_role(fuller=(BL0 + 1, BL1 - 4)))
    guard_round(ic)
    grip_rib(ic)
    pommel_ball(ic, roles=('h', 'g', 'G'), hi=None)
    return ic

@make(20, '잘록허리 청동검', '허리가 잘록하고 끝이 긴 날. 청동 코등이')
def g20():
    BR = dict(h='#ffd890', g='#d0a050', G='#8a6020')
    ic = Ico(dict(STEEL, **BR, r='#5a3a22', R='#3a2414', q='#d0a050', p='#d0a050', P='#8a6020'))
    ic.band(BL0, BL1, mainz(), mainz(), blade_role(core=0.35))
    guard_round(ic, w=3.0)
    grip_rib(ic, rib='q', step=1.0)
    pommel_ball(ic, r=1.8, roles=('h', 'g', 'G'), hi=None, nub='g')
    return ic

if __name__ == '__main__':
    import sys
    items = [(fn().render(), name, f'Lv{lv}', desc) for lv, name, desc, fn in G]
    sheet(items, sys.argv[1] if len(sys.argv) > 1 else 'g_test.png', '글라디우스 시험', cols=4)
