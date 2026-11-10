"""활 원형 16(종류 넷 × 원형 넷) — bow.py 위에"""
from bow import *
WOOD = dict(a='#d8a868', b='#a8743e', c='#6a4422', k='#5a3a22', K='#3a2414', t='#e8dcc0', T='#a89c80', s='#e8e0d0')
FR = []
def frm(kind, key, name, desc):
    def deco(fn): FR.append(dict(kind=kind, key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
# 단궁
@frm('short', 'A', '반달 단궁', '나무 한 토막 활 · 가죽 손잡이')
def sA():
    B = B_of('short'); return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=0)), dict(WOOD)
@frm('short', 'B', '뿔끝 단궁', '끝에 뿔 덮개 · 붉은 끈 손잡이')
def sB():
    B = B_of('short'); return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=1.8)), dict(WOOD, k='#c8322a', K='#7a1a1a', t='#3a3430', T='#1e1a18')
@frm('short', 'C', '납작 단궁', '팔 가운데가 넓고 납작한 자작나무 활')
def sC():
    B = B_of('short'); B.flat = 1.0
    return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=0)), dict(WOOD, a='#f4e8d0', b='#d8c8a8', c='#a8987a', k='#4a3a2a', K='#2a2018')
@frm('short', 'D', '깃 단궁', '손잡이에 깃털 장식')
def sD():
    B = B_of('short')
    def deco(s, B):
        for (u, v, ch) in ((0, -1, '1'), (-1, -2, '1'), (1, -2, '2'), (0, -3, '2')): pass
    s = mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=0))
    for (x, y, ch) in ((8, 9, 'e'), (9, 9, 'e'), (8, 10, 'E')): s.put(x, y, 'grip', ch)
    return s, dict(WOOD, e='#e84040', E='#ffffff')
# 복합궁
@frm('comp', 'A', '각궁', '검은 뿔 · 흰 힘줄 겹 · 끝이 크게 젖혀진다')
def cA():
    B = B_of('comp'); return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=2.2, cols='abc')), dict(WOOD, a='#f0e4c8', b='#3a3236', c='#1e1a1c', k='#c8322a', K='#7a1a1a', t='#f0e4c8', T='#a89c80')
@frm('comp', 'B', '숲 복합궁', '푸른 나무 · 덩굴 감은 손잡이')
def cB():
    B = B_of('comp'); return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=0)), dict(WOOD, a='#a8c878', b='#6a8a4a', c='#3a5a2a', k='#4a8a3a', K='#2a5a22')
@frm('comp', 'C', '뼈 복합궁', '검은 나무 · 뼈 끝 · 뼈 손잡이 테')
def cC():
    B = B_of('comp'); return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=2.6)), dict(WOOD, a='#6a5a5a', b='#3e3434', c='#221c1c', k='#e8e0d0', K='#a89c88', t='#f0e8d8', T='#b8ac94')
@frm('comp', 'D', '금장 복합궁', '붉은 칠 · 금 고리 · 금 끝')
def cD():
    B = B_of('comp')
    s = mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=1.6))
    ring(s, B, (-5.0, 5.0))
    return s, dict(WOOD, a='#e05a4a', b='#a82a2a', c='#6a1414', k='#3a2a1a', K='#1e140c', t='#ffd860', T='#a87018', h='#ffe890', G='#c89020')
# 장궁
@frm('long', 'A', '주목 장궁', '심재(주황) · 변재(흰) 두 빛 · 긴 활대')
def lA():
    B = B_of('long'); return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=0, cols='aac')), dict(WOOD, a='#f0dcb0', b='#d88a40', c='#a85a22')
@frm('long', 'B', '쇠테 장궁', '활대에 쇠 고리 넷')
def lB():
    B = B_of('long')
    s = mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=1.2))
    ring(s, B, (-8.0, -4.0, 4.0, 8.0))
    return s, dict(WOOD, a='#a8846a', b='#6a5040', c='#3e2e24', h='#e8eef6', G='#7a84a0', t='#c8ccd4', T='#7a84a0')
@frm('long', 'C', '깃 장궁', '흰 활대 · 손잡이에 푸른 깃')
def lC():
    B = B_of('long')
    s = mk(B, lambda pu, off, hw: wood(pu, off, hw, B, tipk=0))
    for (x, y, ch) in ((8, 8, 'e'), (8, 9, 'E'), (9, 8, 'E')): s.put(x, y, 'grip', ch)
    return s, dict(WOOD, a='#ffffff', b='#e0dcd0', c='#a8a090', k='#3a5aa8', K='#1e2e6a', e='#5ac0f0', E='#ffffff')
@frm('long', 'D', '쇠 손잡이 장궁', '검은 활대 · 길게 깎은 쇠 손잡이 — 저격수의 활')
def lD():
    B = B_of('long')
    def role(pu, off, hw):
        if abs(pu) <= 3.2: return 'h' if off < -hw / 3 else ('G' if off > hw / 3 else 'g')
        return wood(pu, off, hw, B, grip=0, tipk=1.0)
    return mk(B, role), dict(WOOD, a='#6a6a74', b='#3a3a44', c='#202028', h='#e8eef6', g='#a8b0bc', G='#5a6270', t='#c8ccd4', T='#7a84a0')
# 대궁
@frm('great', 'A', '통나무 대궁', '굵은 통나무 활대 · 굵은 손잡이')
def gA():
    B = B_of('great'); return mk(B, lambda pu, off, hw: wood(pu, off, hw, B, grip=2.0, tipk=0)), dict(WOOD, a='#b88a5a', b='#7a5432', c='#4a301a', k='#3a2a1a', K='#20160c')
@frm('great', 'B', '쇠 덧댄 대궁', '팔마다 쇠판 · 쇠 끝')
def gB():
    B = B_of('great')
    s = mk(B, lambda pu, off, hw: wood(pu, off, hw, B, grip=2.0, tipk=2.4))
    ring(s, B, (-7.5, -4.5, 4.5, 7.5))
    return s, dict(WOOD, a='#9a7a5a', b='#5e4632', c='#3a2a1e', h='#e8eef6', G='#7a84a0', t='#d8dee8', T='#7a84a0', k='#5a3a22', K='#3a2414')
@frm('great', 'C', '뿔 대궁', '마디진 짐승 뿔 · 털 손잡이')
def gC():
    B = B_of('great')
    def role(pu, off, hw):
        if abs(pu) <= 2.0: return 'k' if int(round(pu)) % 2 == 0 else 'K'
        seg = int(abs(pu)) % 3 == 0
        return 'c' if seg else ('a' if off < -hw / 3 else 'b')
    return mk(B, role), dict(WOOD, a='#f0e0b8', b='#c8a878', c='#7a6040', k='#e8e0d0', K='#a89c88')
@frm('great', 'D', '고래뼈 대궁', '흰 뼈 활대 · 끝에 가시 · 푸른 끈 손잡이')
def gD():
    B = B_of('great', L=10.8)
    s = mk(B, lambda pu, off, hw: wood(pu, off, hw, B, grip=2.0, tipk=1.8))
    spike(s, B, 2, 'T')
    return s, dict(WOOD, a='#ffffff', b='#e0dcd0', c='#a8a090', k='#3a5a7a', K='#1e2e48', t='#d8d0c0', T='#8a8478')
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in FR:
        s, ic = icon(d)
        e = tsym(s)
        if e: print(d['kind'], d['key'], 'tsym', len(e), e[:4])
        bx = bbox(s)
        if bx[0] < 1 or bx[1] < 1 or bx[2] > 18 or bx[3] > 18: print(d['kind'], d['key'], 'edge', bx)
        out.append((ic.render(), KIND[d['kind']] + ' ' + d['key']))
    zoomsheet(out[:8], 'bow_z1.png', z=9); zoomsheet(out[8:], 'bow_z2.png', z=9)
