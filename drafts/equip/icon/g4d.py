"""글라디우스 원형 시안 A~D — 날 · 코등이 · 손잡이 · 자루 끝이 모두 한 축(x + y = 19) 위.
칸 좌표 u = x − y (칼끝 +), v = x + y − 19 (0 = 축, − = 왼쪽 위 = 빛 쪽).
틀 (네 시안 같음):
  날     u 0..17 (칼끝 (18,1)), 반폭 |v| ≤ 2 (한 줄 5칸)
  코등이 u −4..−1 둥근 덩이: |v| ≤ 3 · 4 · 4 · 3 (날 쪽 → 손잡이 쪽)
  손잡이 u −9..−5, |v| ≤ 1 (한 줄 3칸)
  자루 끝 4×4 둥근 공 x 2..5 · y 14..17 (가운데 (3.5, 15.5) = 축 위) + 꼭지 (2,17)"""
import math
from g4 import Sw, UV, show
from wic import N

def region(s, part, test, role):
    s.shape(part, test, lambda u, v, x, y: role(u, v))
def blade(s, hw, role, u0=0, u1=17):
    region(s, 'blade', lambda u, v: u0 <= u <= u1 and abs(v) <= hw(u) + 1e-6, lambda u, v: role(u, v, hw(u)))
def edge_of(v, h): return abs(v) > 0 and abs(v) >= math.floor(h + 1e-6)
def blade5(W='w', L='b', C='c', D='B', E='n'):
    def f(u, v, h):
        e = edge_of(v, h)
        if v < 0: return W if e else L
        if v > 0: return E if e else D
        return C
    return f
OVAL = {-1: 3, -2: 4, -3: 4, -4: 3}       # 둥근 덩이 코등이 (u → |v| 한도)
BOX = {-1: 4, -2: 4, -3: 4, -4: 4}        # 둥근 네모 (모서리는 홀짝으로 저절로 깎임)
def guard(s, role, lim=OVAL): region(s, 'guard', lambda u, v: u in lim and abs(v) <= lim[u], role)
def grip(s, role, u0=-9, u1=-5): region(s, 'grip', lambda u, v: u0 <= u <= u1 and abs(v) <= 1, role)
BALL4 = [".hl.", "hlmd", "lmdD", ".dD."]
def pommel(s, roles, nub=None, band=None):
    for j, r in enumerate(BALL4):
        for i, ch in enumerate(r):
            if ch != '.': s.put(2 + i, 14 + j, 'pommel', roles[ch])
    if band:                                   # 축과 직각인 띠 (공 가운데 '\\' 줄)
        s.put(3, 15, 'pommel', band[0]); s.put(4, 16, 'pommel', band[1])
    if nub: s.put(2, 17, 'pommel', nub)
TIP_SHORT = lambda u: min(2, (17 - u) / 2)                 # 짧은 세모 끝 (끝 반짝)
TIP_LONG = lambda u: min(2, (17 - u) / 3)                  # 길게 빠진 끝
TIP_SOFT = lambda u: (min(2, max(0, (16 - u) / 2)) if u <= 15 else -1)   # 살짝 무딘 끝

D = []
def make(key, name, desc):
    def deco(fn): D.append((key, name, desc, fn)); return fn
    return deco

@make('A', '시안 A · 폼페이 정석', '곧은 날 · 짧은 세모 끝 · 가운데 등줄. 호두나무 코등이(날 쪽 놋쇠 판) · 상아 손잡이에 홈 두 줄 · 호두나무 공 + 놋쇠 꼭지')
def dA():
    s = Sw()
    blade(s, TIP_SHORT, blade5())
    guard(s, lambda u, v: ('m' if v < 0 else 'M') if u == -1 else ('h' if v <= -3 else ('G' if v >= 3 else 'g')))
    grip(s, lambda u, v: ('k' if v < 0 else 'K') if u in (-6, -8) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    pommel(s, dict(h='p', l='o', m='o', d='O', D='Q'), nub='M')
    return s, dict(w='#ffffff', b='#d8e2ee', c='#eef4fc', B='#8f9db8', n='#566282',
                   h='#f0b070', g='#b06c34', G='#6e3a1a', m='#ffe08a', M='#c8902e',
                   r='#fbf2dc', q='#e0d2b0', R='#a8946e', k='#8a7454', K='#5e4c34',
                   p='#f8c890', o='#c8803e', O='#7e4422', Q='#4e2612')

@make('B', '시안 B · 마인츠 장식', '끝이 길게 빠진 날 · 등줄 옆 두 줄 홈. 청동 코등이 가운데 금 띠 · 붉은 가죽 손잡이 금 고리 · 청동 공 금 띠')
def dB():
    s = Sw()
    def bl(u, v, h):
        if abs(v) == 1 and 1 <= u <= 11: return 'f' if v < 0 else 'F'
        return blade5()(u, v, h)
    blade(s, TIP_LONG, bl)
    guard(s, lambda u, v: ('j' if v < 0 else 'J') if u == -2 else ('h' if v <= -3 else ('G' if v >= 3 else 'g')))
    grip(s, lambda u, v: ('j' if v < 0 else 'J') if u in (-6, -8) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    pommel(s, dict(h='p', l='h', m='g', d='G', D='Q'), band=('j', 'J'), nub='J')
    return s, dict(w='#fffdf2', b='#e8e2d4', c='#faf6ec', B='#a89c8a', n='#6a5e50', f='#c6baa6', F='#857866',
                   h='#f8c070', g='#d08a3a', G='#8a5220', j='#fff0a0', J='#d8a030',
                   r='#e8604e', q='#b8342c', R='#701c1e', p='#ffe6b0', Q='#5a3010')

@make('C', '시안 C · 투사 실전형', '살짝 무딘 끝 · 벼린 날 끝이 양쪽 다 밝다. 쇠 코등이 징 두 개 · 소가죽 감은 손잡이 · 쇠 공')
def dC():
    s = Sw()
    def bl(u, v, h):
        if edge_of(v, h): return 'w' if v < 0 else 'e'
        return 'b' if v < 0 else ('B' if v > 0 else 'c')
    blade(s, TIP_SOFT, bl)
    guard(s, lambda u, v: 'i' if (u == -3 and abs(v) == 2) else ('h' if v <= -3 else ('G' if v >= 3 else 'g')))
    grip(s, lambda u, v: ('r' if v <= 0 else 'q') if (u - v) % 4 in (0, 1) else ('q' if v < 0 else 'R'))
    pommel(s, dict(h='i', l='h', m='g', d='G', D='Q'), nub='g')
    return s, dict(w='#ffffff', e='#dfe8f4', b='#9eaabc', c='#bec8d6', B='#646f86',
                   h='#a8b2c2', g='#6c7686', G='#3c4452', i='#f0f4fa', Q='#262c38',
                   r='#d06448', q='#963a2a', R='#5a1e1a')

@make('D', '시안 D · 의장 금장', '거울처럼 닦은 날 · 금 상감 등줄. 상아 코등이 날 쪽 금 테 · 푸른 칠 손잡이 금 마디 · 상아 공 금 꼭지')
def dD():
    s = Sw()
    def bl(u, v, h):
        if v == 0 and u <= 12: return 'j'
        return blade5()(u, v, h)
    blade(s, TIP_SHORT, bl)
    guard(s, lambda u, v: ('j' if v < 0 else 'J') if u in (-1, -4) else ('h' if v <= -3 else ('G' if v >= 3 else 'g')))
    grip(s, lambda u, v: ('j' if v < 0 else 'J') if u in (-6, -8) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    pommel(s, dict(h='p', l='h', m='g', d='G', D='Q'), nub='J')
    return s, dict(w='#ffffff', b='#e4ecf8', c='#f6faff', B='#9cabc6', n='#5e6a8c', j='#ffe27a', J='#c8902a',
                   h='#fffaea', g='#e6dcc0', G='#aa9a78', Q='#7a6c50', p='#ffffff',
                   r='#5a8cf0', q='#3458b8', R='#1e3070')

if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for key, name, desc, fn in D:
        s, pal = fn()
        print(key, 'sym err:', s.sym_err())
        out.append((s.icon(pal).render(), key))
    zoomsheet(out, 'g4d_z.png', z=12)
    s, p = dA(); show(s)
