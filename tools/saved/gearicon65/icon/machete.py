"""정글칼 — 정찰가 · 탐험가 무기 (11-11 00:34 사용자). 칼과 같은 축(x + y = 19): 손잡이 왼쪽 아래, 칼끝 오른쪽 위.
외날: 등(v −, 왼쪽 위 · 짙은 줄)은 곧게, 날(v +, 오른쪽 아래 · 밝은 날 줄)은 끝 쪽으로 넓어진다. 손잡이 · 받침 · 날 뿌리는 축 위.
글자: 날 w(날 줄) b(몸) B(등 쪽) n(등 줄) · 톱니 t · 받침 h g G · 손잡이 k K · 징 o · 끈 구멍 x · 효과 1 2"""
import math
from g4 import Sw
from bow import P
def handle(s, u0=-13, u1=-6, chs=('k', 'K'), rivets=(-11, -8), hole=True):
    for u in range(u0, u1 + 1):
        for v in (-1, 0, 1):
            if (u + v) % 2 == 0: continue
            ch = chs[0] if v < 0 else chs[1]
            if v == 0 or abs(v) == 1:
                ch = chs[0] if v <= 0 else chs[1]
            P(s, 'grip', u, v, ch)
    for u in rivets:
        for v in (-1, 0, 1):
            if (u + v) % 2: P(s, 'grip', u, v, 'o'); break
    if hole:
        for v in (-1, 0, 1):
            if (u0 + v) % 2: P(s, 'pommel', u0, v, 'x'); break
def guard(s, u=-5, hw=2):
    for v in range(-hw, hw + 1): P(s, 'guard', u, v, 'h' if v < 0 else ('G' if v > 0 else 'g'))
def blade(s, u0, u1, spine, edge, saw=None, hook=None):
    """spine(u) · edge(u) = 그 줄의 등 · 날 v (spine ≤ edge). 날 줄 = 가장 바깥 날 칸, 등 줄 = 가장 안 등 칸"""
    for u in range(u0, u1 + 1):
        a, b = spine(u), edge(u)
        if b < a: continue
        cells = [v for v in range(int(math.floor(a)) - 1, int(math.ceil(b)) + 2) if a - 1e-6 <= v <= b + 1e-6 and (u + v) % 2]
        if not cells: continue
        lo, hi = min(cells), max(cells)
        for v in cells:
            ch = 'n' if v == lo else ('w' if v == hi else ('B' if v < (lo + hi) / 2 else 'b'))
            P(s, 'blade', u, v, ch)
    if saw:
        for u in range(saw[0], saw[1] + 1, 2):
            a = spine(u); v = int(math.floor(a)) - 1
            for dv in (0, -1):
                if (u + v + dv) % 2: P(s, 'head', u, v + dv, 't'); P(s, 'head', u + 1, v + dv - 1, 't') if False else None; break
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(w='#ffffff', b='#d8dee8', B='#a8b0bc', n='#5a6270', t='#e8eef6', h='#e8eef6', g='#a8b0bc', G='#5a6270', k='#8a5a34', K='#5a3a1e', o='#e0c060', x='#1a1414')
@frm('A', '정글칼', '곧은 등 · 끝 쪽으로 넓어지는 외날 · 비스듬히 잘린 끝 · 나무 손잡이에 놋쇠 징 둘')
def mA():
    s = Sw(); s.fx = {}
    handle(s); guard(s, -5, 1)
    blade(s, -4, 13, lambda u: -2.2, lambda u: (2.0 + 2.6 * (u + 4) / 14.0) if u <= 10 else (4.6 - 2.0 * (u - 10)))
    return s, dict(BASE)
@frm('B', '쿠크리', '앞으로 굽은 두꺼운 날 · 날 뿌리의 홈 · 짐승 뿔 손잡이')
def mB():
    s = Sw(); s.fx = {}
    handle(s, -13, -6, rivets=(-9,), hole=False); guard(s, -5, 2)
    c = lambda u: 0.03 * (u + 4) ** 2 if u >= -4 else 0.0                          # 날이 날 쪽(+v)으로 굽는다
    wd = lambda u: 3.0 + 2.6 * math.sin(min(1.0, max(0.0, (u + 4) / 15.0)) * math.pi * 0.8)
    blade(s, -4, 11, lambda u: c(u) - 2.2, lambda u: c(u) - 2.2 + wd(u) * (1.0 if u < 9 else max(0.0, 1.0 - (u - 8) * 0.4)))
    for v in (1, 2):                                                               # 날 뿌리 홈(초)
        if (-3 + v) % 2: P(s, 'blade', -3, v, 'x')
    return s, dict(BASE, k='#e8dcc8', K='#a8987a', o='#3a3430')
@frm('C', '볼로', '날 뿌리는 좁고 끝으로 갈수록 배가 불룩하게 넓어지는 무거운 날 · 둥근 끝 · 짧은 손잡이')
def mC():
    s = Sw(); s.fx = {}
    handle(s, -12, -6, rivets=(-10, -8)); guard(s, -5, 1)
    def edge(u):
        t = (u + 4) / 15.0
        if t > 0.82: return -2.2 + 7.4 * math.sqrt(max(0.0, 1 - ((t - 0.82) / 0.18) ** 2))
        return -2.2 + 3.2 + 4.2 * t ** 1.5
    blade(s, -4, 11, lambda u: -2.2 if u < 8 else -2.2 + 0.9 * (u - 7), edge)
    return s, dict(BASE, k='#3a2a1a', K='#1e140c')
@frm('D', '톱날 정글칼', '등에 톱니가 돋은 곧은 날 · 끝이 갈고리처럼 꺾인다 · 검은 고무 손잡이')
def mD():
    s = Sw(); s.fx = {}
    handle(s, rivets=()); guard(s, -5, 2)
    blade(s, -4, 13, lambda u: -1.6 if u < 11 else -1.6 + 1.4 * (u - 10), lambda u: 3.2 if u < 11 else 3.2 - 1.4 * (u - 10), saw=(-2, 9))
    return s, dict(BASE, k='#3a3a44', K='#1e1e26', b='#a8b0bc', B='#7a8290', n='#30343c')
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = [(icon(d)[1].render(), '정글칼 ' + d['key']) for d in FR]
    zoomsheet(out, 'mach_z.png', z=12)
