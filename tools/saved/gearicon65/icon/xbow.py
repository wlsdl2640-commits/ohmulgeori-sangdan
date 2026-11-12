"""손목 석궁 — 괴물사냥꾼 · 드래곤 슬레이어 (11-10 22:36 사용자: 손목에 차는 석궁 · 볼트 · 허리 볼트통). 칼과 같은 축(x + y = 19), 앞이 오른쪽 위.
위에서 본 팔뚝: 팔찌(덧대 판 + 끈, 개머리보다 넓다) 위에 개머리 · 앞에 활대(가로로 넓게, 끝이 뒤로 휨) · 시위는 활대 끝에서 걸쇠로 V · 메긴 볼트 머리가 활대 앞으로.
축 대칭((u, v) ↔ (u, −v)). 시위는 화면 칸에 곧은 한 칸 줄(효과 층, 테두리 없음).
글자: 팔찌 w V(판) W(끈) · 버클 o · 쇠 h g G · 나무 a b c · 볼트 대 f · 볼트 머리 x X · 상자 e E · 시위(효과) s"""
import math
from g4 import Sw
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
def XY(u, v): return ((u + v + 19) / 2.0, (v - u + 19) / 2.0)
def band(s, part, u0, u1, hw, role):
    for u in range(u0, u1 + 1):
        h = hw(u) if callable(hw) else hw
        for v in range(-int(h) - 1, int(h) + 2):
            if abs(v) <= h + 1e-6:
                ch = role(u, v, h)
                if ch: P(s, part, u, v, ch)
def prod(s, uc, span, back, hw=1.0, hook=0.0, chs=('h', 'G'), tipc=None, gap=1.5):
    """활대: 가운데 u = uc, v 방향으로 ±span, 끝으로 갈수록 뒤(−u)로 back · hook이면 끝 30%가 더 꺾인다"""
    for x, y, (u, v) in s.each():
        if (u + v) % 2 == 0 or abs(v) > span + 0.5 or abs(v) < gap: continue
        t = min(1.0, abs(v) / span)
        c = uc - back * t * t - hook * max(0.0, (t - 0.7) / 0.3) ** 2
        if abs(u - c) <= hw + 1e-6:
            ch = (tipc if tipc and t > 0.85 else (chs[0] if u > c else chs[1]))
            s.put(x, y, 'guard', ch)
def tipat(uc, span, back, hook=0.0):
    return uc - back - hook, span
def line(s, a, b, ch='s'):
    """화면 칸 곧은 한 칸 줄 (효과 층, 그림 칸은 건너뜀)"""
    (x0, y0), (x1, y1) = a, b
    n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
    seen = set()
    for k in range(n + 1):
        t = k / n; x = math.floor(x0 + (x1 - x0) * t + 0.5); y = math.floor(y0 + (y1 - y0) * t + 0.5)
        if (x, y) in seen: continue
        seen.add((x, y))
        if (x, y) not in s.part and 0 <= x < 20 and 0 <= y < 20: s.fx[(x, y)] = ch
def string(s, tip, un, ch='s'):
    ut, span = tip
    for sg in (-1, 1): line(s, XY(ut, sg * span), XY(un, 0), ch)
def bracer(s, u0=-9, u1=-4, hw=3.2, straps=(-8, -5), buckle='o', plate=('w', 'V')):
    """팔찌: 덧대 판 + 끈(판보다 한 칸 넓고 짙다) · 끈 오른쪽 아래 끝에 버클"""
    band(s, 'grip', u0, u1, hw - 1, lambda u, v, h: plate[0] if v < 0 else plate[1])
    for a in straps:
        band(s, 'grip', a, a, hw, lambda u, v, h: buckle if v >= h - 0.6 else 'W')
def stock(s, u0=-10, u1=5, chs='abc'):
    band(s, 'blade', u0, u1, 1, lambda u, v, h: chs[0] if v < 0 else (chs[2] if v > 0 else chs[1]))
def nut(s, u=-3):
    for v in (-1, 0, 1): P(s, 'guard', u, v, 'G')
def bolt(s, u0, uc, head=4):
    for u in range(u0, uc + 1): P(s, 'head', u, 0, 'f')
    for u in range(uc + 1, uc + head + 1):
        hw = 1 if u < uc + head else 0
        for v in range(-hw, hw + 1): P(s, 'head', u, v, 'x' if v <= 0 else 'X')
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(w='#b8603a', V='#8a4024', W='#2a1a14', o='#e0c060', h='#c8ccd4', g='#7a8290', G='#4a505c', a='#8a5a34', b='#6a4224', c='#42280e',
            f='#d8b880', x='#e8eef6', X='#7a84a0', e='#6a4a2a', E='#3a2614', s='#ffffff')
@frm('A', '가죽 손목 석궁', '붉은 가죽 팔찌(끈 둘 · 금 버클) · 나무 개머리 · 쇠 활대 · 볼트를 메겼다')
def xA():
    s = Sw(); s.fx = {}
    bracer(s); stock(s, -10, 5); bolt(s, -3, 5); prod(s, 5.0, 7.0, 1.6, 1.0); nut(s, 1); string(s, tipat(5.0, 6.7, 1.8), 1)
    return s, dict(BASE)
@frm('B', '쇠 손목 석궁', '마디진 쇠 팔찌 · 쇠 개머리 · 끝이 앞으로 젖혀진 쇠 활대')
def xB():
    s = Sw(); s.fx = {}
    band(s, 'grip', -10, -4, 3.2, lambda u, v, h: ('h' if v < 0 else 'g') if (u % 2) else 'G')          # 마디 쇠 팔찌
    stock(s, -10, 5, 'hgG'); bolt(s, -3, 5); prod(s, 5.0, 7.0, 1.6, 1.0, hook=-1.2); nut(s, 2); string(s, tipat(5.0, 6.7, 1.8, -1.2), 2)
    return s, dict(BASE, f='#e8eef6')
@frm('C', '연발 손목 석궁', '개머리 위 볼트 상자(세 발이 꽂혀 있다) · 짧고 굵은 활대')
def xC():
    s = Sw(); s.fx = {}
    bracer(s); stock(s, -10, 5)
    band(s, 'pommel', -7, -2, 2, lambda u, v, h: 'e' if v < 0 else 'E')                                  # 볼트 상자
    for v in (-2, 0, 2):
        for u in (-2, -1): P(s, 'pommel', u + (1 if v else 0), v, 'f')                                    # 상자에서 나온 볼트 셋
    bolt(s, 0, 5); prod(s, 5.0, 6.0, 1.2, 1.3); nut(s, 2); string(s, tipat(5.0, 5.7, 1.4), 2)
    return s, dict(BASE, e='#c8a070', E='#7a5232', f='#f0e0c0')
@frm('D', '갈고리 손목 석궁', '활대 끝이 갈고리처럼 뒤로 크게 꺾인다 · 검은 쇠 · 금 끝 · 검은 가죽 팔찌')
def xD():
    s = Sw(); s.fx = {}
    bracer(s, plate=('V', 'W'), buckle='o'); stock(s, -10, 5, 'hgG'); bolt(s, -3, 5)
    prod(s, 5.5, 7.5, 1.4, 1.0, hook=3.4, tipc='o'); nut(s, 1); string(s, tipat(5.5, 6.4, 1.2, 1.8), 1)
    return s, dict(BASE, w='#4a3a3a', V='#2e2424', W='#141010', h='#8a8a98', g='#4a4a56', G='#2a2a34', x='#ffd860', X='#a87018')
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in FR:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d['key'], 'sym', len(e), e[:4])
        out.append((ic.render(), '석궁 ' + d['key']))
    zoomsheet(out, 'xbow_z.png', z=12)
