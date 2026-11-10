"""컴파운드 보우(도르래 활) — 트래커 · 스토커 주무기 (11-10 23:09 사용자). 활 그리기(bow.py) 위에.
굵고 곧은 손잡이(라이저, 가운데 창) · 짧고 빳빳한 팔 · 팔 끝 도르래(둥근 바퀴) · 도르래 사이 시위 + 안쪽 케이블 한 줄.
u ↔ −u 대칭. 글자: 라이저 h g G · 창 K · 팔 a b c · 도르래 o O · 축 x · 손잡이 k · 시위(효과) s · 케이블(효과) q"""
import math
from bow import *
def riser(s, B, L=4.5, w=2.4, chs=('h', 'g', 'G'), window=True, grip=('k', 'K')):
    """손잡이 몸통: |u| ≤ L, 활대 줄 둘레 w. 가운데 손잡이 감기 · 위아래로 창(구멍)"""
    for x, y, (u, v) in s.each():
        if (u + v) % 2 == 0 or abs(u) > L + 0.5: continue
        c = B.vc(u)
        off = v - c
        if abs(off) <= w + 1e-6:
            if abs(u) <= 1.2: ch = grip[0] if off < 0 else grip[1]
            elif window and 2 <= abs(u) <= L - 1 and abs(off) <= w - 1.6: ch = None
            else: ch = chs[0] if off < -w / 3 else (chs[2] if off > w / 3 else chs[1])
            if ch: s.put(x, y, 'grip', ch)
def cam(s, B, r=1.6, chs=('o', 'O'), hub='x'):
    """팔 끝 도르래: 반지름 r(화면 픽셀) 둥근 바퀴 + 가운데 축"""
    for sg in (-1, 1):
        u0 = sg * B.L; v0 = B.vc(B.L)
        cx, cy = (u0 + v0 + 19) / 2.0 + .5, (v0 - u0 + 19) / 2.0 + .5
        for y in range(20):
            for x in range(20):
                d = math.hypot(x + .5 - cx, y + .5 - cy)
                if d <= r + 0.15:
                    s.put(x, y, 'head', hub if d < 0.6 else (chs[0] if (x + .5 - cx) + (y + .5 - cy) < 0 else chs[1]))
def cables(s, B, inset=1.4, ch='q'):
    """도르래 사이: 바깥 시위(s) + 안쪽 케이블(q) — 효과 층 한 칸 줄"""
    from xbow import line, XY
    v0 = B.vc(B.L)
    a = XY(-B.L, v0); b = XY(B.L, v0)
    line(s, a, b, 's')
    a2 = XY(-B.L + 0.8, v0 - inset); b2 = XY(B.L - 0.8, v0 - inset)
    line(s, a2, b2, ch)
def cmk(B, limb, riser_kw=None, cam_kw=None, cab=True):
    s = Sw(); s.fx = {}
    stave(s, B, limb)
    riser(s, B, **(riser_kw or {}))
    cam(s, B, **(cam_kw or {}))
    if cab: cables(s, B)
    return s
SPECC = dict(L=10.0, D=4.4, vs=3.6, hw0=1.5, hw1=1.2, p='arc')
def CB(**kw):
    d = dict(SPECC); d.update(kw); return Bow(**d)
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
LIMB = lambda pu, off, hw: 'a' if off < -hw / 3 else ('c' if off > hw / 3 else 'b')
BASE = dict(a='#a8743e', b='#7a5232', c='#4a301a', h='#e8eef6', g='#a8b0bc', G='#5a6270', K='#1a1414', k='#5a3a22', o='#e0b050', O='#8a6418', x='#2a1e14', s='#ffffff', q='#a8b0bc')
@frm('A', '나무 도르래 활', '나무 손잡이 · 짧은 팔 · 놋쇠 도르래 · 시위와 케이블')
def kA():
    B = CB()
    return cmk(B, LIMB, dict(chs=('a', 'b', 'c'), window=False)), dict(BASE, a='#c8946a', b='#8a5a34', c='#5a3a1e')
@frm('B', '쇠 도르래 활', '구멍 뚫린 쇠 손잡이(창 둘) · 검은 팔 · 쇠 도르래')
def kB():
    B = CB()
    return cmk(B, LIMB, dict(), dict(chs=('h', 'G'))), dict(BASE, a='#5a5a66', b='#3a3a44', c='#22222a')
@frm('C', '덤불 도르래 활', '풀빛 천을 감은 손잡이 · 이끼빛 팔 — 숲에서 몸을 숨긴다')
def kC():
    B = CB()
    def rk(pu, off, hw): return 'a' if (int(abs(pu) * 1.5) + (off > 0)) % 2 else 'b'
    s = cmk(B, LIMB, dict(chs=('e', 'E', 'G'), window=False, grip=('k', 'K')))
    return s, dict(BASE, a='#7a8a4a', b='#4a5a2a', c='#2a3418', e='#8a9a5a', E='#4e5a30', k='#3a3020', K='#1e1810')
@frm('D', '검은 도르래 활', '검은 쇠 손잡이 · 금 도르래 · 붉은 가늠 구슬')
def kD():
    B = CB()
    s = cmk(B, LIMB, dict(chs=('g', 'G', 'K')), dict(chs=('o', 'O'), hub='r'))
    # 가늠 구슬 (손잡이 위 창 안쪽, 축 대칭 아님 — 한쪽만)
    return s, dict(BASE, a='#3a3a44', b='#24242c', c='#14141a', g='#5a5a66', G='#30303a', o='#ffd860', O='#a87018', r='#ff4a4a')
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in FR:
        s, ic = icon(d)
        e = tsym(s)
        if e: print(d['key'], 'tsym', len(e), e[:4])
        bx = bbox(s)
        if bx[0] < 1 or bx[1] < 1 or bx[2] > 18 or bx[3] > 18: print(d['key'], 'edge', bx)
        out.append((ic.render(), '도르래 ' + d['key']))
    zoomsheet(out, 'cbow_z.png', z=12)
