"""볼트(석궁 화살) 묶음 — 석궁 탄약 (11-10 22:36 사용자). 칼과 같은 축(x + y = 19), 머리가 오른쪽 위.
볼트를 나란히 두되 사이를 비워(검은 테두리가 갈라 준다) 한 자루씩 읽히게 · X로 엇갈리게 놓지 않는다.
볼트: 굵은 대(2칸) · 대보다 넓은 머리 · 짧고 빳빳한 깃 둘. 축 대칭.
글자: 대 a b · 머리 h g G · 깃 f F · 끈 r R"""
from g4 import Sw
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
HEADS = {   # 머리 줄마다 반폭 (대 쪽에서 끝으로)
    'bodkin': [1.5, 1.5, 1.0, 0.0],
    'broad':  [1.0, 2.0, 1.5, 0.5, 0.0],
    'chisel': [1.5, 1.5, 1.5],
    'barb':   [2.0, 1.0, 1.5, 1.0, 0.0],
}
def one(s, v0, u0, u1, head='bodkin', sh='ab', hd='hgG', fl='fF', vane=2.0, outer=None):
    for u in range(u0 + 2, u1 + 1):                                                    # 대
        for v in (v0 - 1, v0, v0 + 1): P(s, 'blade', u, v, sh[0] if v <= v0 else sh[1])
    for k, hw in enumerate(HEADS[head]):                                               # 머리
        u = u1 + 1 + k
        for v in range(int(v0 - hw - 1), int(v0 + hw + 2)):
            if abs(v - v0) <= hw + 1e-6: P(s, 'head', u, v, hd[0] if v < v0 else (hd[2] if v > v0 else hd[1]))
    for k in range(3):                                                                 # 깃 (꼬리 세 줄, 대보다 넓게)
        u = u0 + k; hw = vane - 0.5 * k
        for v in range(int(v0 - hw - 1), int(v0 + hw + 2)):
            if abs(v - v0) <= hw + 1e-6:
                if outer is not None and (v - v0) * outer < -1: continue
                P(s, 'grip', u, v, fl[0] if v <= v0 else fl[1])
def tie(s, u, v0, v1, ch='rR'):
    for uu in (u, u + 1):
        for v in range(v0, v1 + 1): P(s, 'pommel', uu, v, ch[0] if v < 0 else ch[1])
def bundle(head='bodkin', sh='ab', hd='hgG', fl='fF', tch='rR', n=2):
    s = Sw(); s.fx = {}
    if n == 2:
        one(s, -3, -9, 4, head, sh, hd, fl, outer=-1); one(s, 3, -8, 5, head, sh, hd, fl, outer=1)
        tie(s, -3, -5, 5, tch)
    else:
        one(s, -5, -9, 2, head, sh, hd, fl, outer=-1); one(s, 0, -8, 5, head, sh, hd, fl); one(s, 5, -9, 2, head, sh, hd, fl, outer=1)
        tie(s, -4, -7, 7, tch)
    return s
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(a='#d8b070', b='#8a6438', h='#e8eef6', g='#a8b0bc', G='#5a6270', f='#f0e8d8', F='#b8ac94', r='#8a5a34', R='#4a2e18')
@frm('A', '쇠 볼트', '뾰족한 쇠 머리 · 나무 대 · 흰 깃 · 가죽 끈으로 묶은 둘')
def bA(): return bundle('bodkin'), dict(BASE)
@frm('B', '넓은 날 볼트', '넓은 세모 날 머리 · 붉은 깃 · 셋')
def bB(): return bundle('broad', n=3), dict(BASE, f='#f05a4a', F='#9a2a22')
@frm('C', '쇠 깃 볼트', '대 · 깃까지 모두 쇠 · 네모 끌 머리')
def bC(): return bundle('chisel', sh='hG', fl='gG', tch='GG'), dict(BASE, h='#e8eef6', g='#a8b0bc', G='#4a505c')
@frm('D', '미늘 볼트', '미늘 달린 머리 · 검은 깃 · 붉은 끈 · 셋')
def bD(): return bundle('barb', n=3), dict(BASE, f='#4a4a56', F='#22222a', r='#c8322a', R='#7a1a1a', a='#a8845a', b='#5a4026')
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
        out.append((ic.render(), '볼트 ' + d['key']))
    zoomsheet(out, 'bolt_z.png', z=12)
