"""단검 — 도적 · 암살자 · 그림자 군주 · 쌍검사/검무사(두 자루) · 닌자 · 카게닌자. 원형 5 (A~E) + 16 (네 레벨 묶음마다 A · B · C 한 번씩 + 넷째 자리는 D 휜 날 · E 주먹 번갈아)
축 x + y = 19, 모든 부품이 축 위 · 윤곽 축 대칭(sym_err). 칼보다 날이 짧고 자루가 상대적으로 크다.
틀
  A 찌르개: 밑동 5칸 → 곧게 좁아지는 세모 날 · 짧은 십자 코등이 · 가죽 손잡이 · 공 자루 끝
  B 송곳: 3칸 바늘 날 · 작은 원반 코등이 · 철사 손잡이 · 공 자루 끝
  C 잎: 밑동 3칸 → 가운데 5칸 → 뾰족 (잎꼴) · 끝이 뭉툭한 코등이 · 감은 손잡이 · 모난 자루 끝
  D 휜 날: 양날이 칼끝 쪽에서 그늘 쪽으로 휜다 · 넓은 목테 · 잘록한 손잡이 · 넓게 벌어진 자루 끝 (11-10 19:29 사용자 고름, 옛 D 고리 = 쿠나이 닮아 뺌)
  E 주먹(카타르): 넓은 세모 날 · 날 밑 막대 · 양쪽 곁대 사이 가로 손잡이 두 줄 (H 꼴) (11-10 19:29 사용자 고름)
글자: 날 w b c B n f(홈/독) · 코등이 h g G j J · 보석 z Z u · 손잡이 r q R k K · 자루 끝 p o x O Q · 효과 1 2"""
import math
import g4
g4.AX = 19
from g4 import Sw, UV
from g4d import region, edge_of
from wic import N
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
POM3 = ["hlm", "lmd", "mdD"]
BALL = dict(h='p', l='o', m='x', d='O', D='Q')
def pom3(s, cx, cy, roles, boss=None):
    for j, r in enumerate(POM3):
        for i, ch in enumerate(r): s.put(cx - 1 + i, cy - 1 + j, 'pommel', roles[ch])
    if boss: s.put(cx, cy, 'pommel', boss)
def rbody(u, v): return 'r' if v < 0 else ('R' if v > 0 else 'q')
def gbody(u, v): return 'h' if v <= -2 else ('G' if v >= 2 else 'g')
STYLE = {'A': '찌르개', 'B': '송곳', 'C': '잎', 'D': '휜 날', 'E': '주먹'}
def bl5(fuller=None):
    def f(u, v, h):
        e = edge_of(v, h)
        if fuller and fuller[0] <= u <= fuller[1] and v == 0: return 'f'
        if v < 0: return 'w' if e else 'b'
        if v > 0: return 'n' if e else 'B'
        return 'c'
    return f
def frame(st, bmod=None, gem=False):
    s = Sw(); s.fx = {}
    W = lambda fn: (lambda u, v, h: bmod(u, v, h, fn(u, v, h))) if bmod else fn
    if st == 'A':
        hw = lambda u: 2 if u <= 4 else 2 * (17 - u) / 13
        region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(bl5(fuller=(1, 8)))(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-1, -2) and abs(v) <= 4, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 4 else gbody(u, v))
        region(s, 'grip', lambda u, v: -9 <= u <= -3 and abs(v) <= 1, lambda u, v: ('k' if v <= 0 else 'K') if (u - v) % 4 in (0, 1) else rbody(u, v))
        pom3(s, 3, 16, BALL)
    elif st == 'B':
        hw = lambda u: 1 if u <= 12 else (0 if u in (13, 15, 17) else -1)          # 바늘
        region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(lambda u, v, h: 'w' if v < 0 else ('B' if v > 0 else 'c'))(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-1, -2) and abs(v) <= (3 if u == -2 else 2), gbody)   # 작은 원반
        region(s, 'grip', lambda u, v: -9 <= u <= -3 and abs(v) <= 1, lambda u, v: ('k' if v <= 0 else 'K') if u % 2 == 0 else rbody(u, v))
        pom3(s, 3, 16, BALL)
    elif st == 'C':
        hw = lambda u: 1 if u <= 1 else (2 if u <= 9 else 2 * (17 - u) / 8)
        region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(bl5())(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-1, -2) and abs(v) <= 3, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 3 else gbody(u, v))
        for (u, v, ch) in [(0, -3, 'j'), (-3, -4, 'j'), (0, 3, 'J'), (-3, 4, 'J')]: P(s, 'guard', u, v, ch)
        region(s, 'grip', lambda u, v: -9 <= u <= -3 and abs(v) <= 1, lambda u, v: ('k' if v <= 0 else 'K') if (u + v) % 4 in (0, 1) else rbody(u, v))
        pom3(s, 3, 16, BALL)
        for (x, y) in ((2, 15), (4, 17)): s.put(x, y, 'pommel', 'Q' if x == 4 else 'o')
    elif st == 'D':                                                                   # 휜 날
        c = lambda u: 0 if u <= 6 else (u - 6) * 0.32
        hw = lambda u: 2.0 if u <= 5 else max(0, 2.0 * (17 - u) / 12)
        def role(u, v, h):
            d = v - c(u)
            if d <= -h + 0.9: return 'w'
            if d >= h - 0.9: return 'n'
            if abs(d) < 0.6: return 'c'
            return 'b' if d < 0 else 'B'
        region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v - c(u)) <= hw(u) + 1e-6, lambda u, v: W(role)(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-1, -2) and abs(v) <= (3 if u == -1 else 2), gbody)                    # 넓은 목테
        region(s, 'grip', lambda u, v: -9 <= u <= -3 and abs(v) <= 1, lambda u, v: ('k' if v <= 0 else 'K') if u in (-4, -8) else rbody(u, v))
        region(s, 'pommel', lambda u, v: u in (-10, -11, -12) and abs(v) <= {-10: 2, -11: 3, -12: 2}[u],
               lambda u, v: 'p' if v <= -2 else ('O' if v >= 2 else 'x'))                                         # 넓게 벌어진 끝
    elif st == 'E':                                                                   # 주먹 (카타르)
        hw = lambda u: 3.0 * (17 - u) / 15
        region(s, 'blade', lambda u, v: 2 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(bl5())(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (0, 1) and abs(v) <= 4, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 4 else gbody(u, v))   # 날 밑 막대
        for u in range(-9, 0):
            for v in (-4, -3, 3, 4): P(s, 'guard', u, v, 'h' if v < 0 else 'G')                                  # 곁대 둘
        region(s, 'grip', lambda u, v: u in (-3, -4, -6, -7) and abs(v) <= 2, lambda u, v: 'r' if v < 0 else ('R' if v > 0 else 'q'))   # 가로 손잡이 두 줄
        region(s, 'pommel', lambda u, v: u in (-10, -11) and abs(v) <= 4, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 3 else gbody(u, v))
    if gem:
        for (x, y), ch in (((8, 10), 'z'), ((9, 10), 'Z'), ((8, 11), 'Z'), ((9, 11), 'u')): s.put(x, y, 'guard', ch)
    return s

FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
STEEL = dict(w='#ffffff', b='#d8e2ee', c='#eef4fc', f='#8f9db8', B='#8f9db8', n='#566282')
IRON = dict(h='#a8b0bc', g='#6c7482', G='#3e4450', j='#d8dee8', J='#4e5662')
LEATHER = dict(r='#8a5a36', q='#64401f', R='#3e2614', k='#a8784a', K='#4a2e18')
BALLI = dict(p='#e8eef6', o='#a8b0bc', x='#6c7482', O='#3e4450', Q='#262a32')
@frm('A', '밑동이 넓고 곧게 좁아지는 세모 날 · 가운데 홈. 짧은 십자 코등이 · 가죽 손잡이 · 공 자루 끝')
def fA(): return frame('A'), dict(STEEL, **IRON, **LEATHER, **BALLI)
@frm('B', '가늘고 긴 바늘 날 (찌르기 전용). 작은 원반 코등이 · 철사 감은 손잡이')
def fB(): return frame('B'), dict(STEEL, **IRON, r='#3a3a44', q='#26262e', R='#16161c', k='#c8d0dc', K='#6a7280', **BALLI)
@frm('C', '밑동이 좁고 가운데가 불룩한 잎꼴 날. 끝이 뭉툭한 코등이 · 감은 손잡이 · 모난 자루 끝')
def fC(): return frame('C'), dict(STEEL, **IRON, **LEATHER, **BALLI)
@frm('D', '양날이 칼끝 쪽에서 휘어 내려간다. 넓은 목테 · 잘록한 손잡이 · 넓게 벌어진 자루 끝')
def fD(): return frame('D'), dict(STEEL, **IRON, **LEATHER, **BALLI)
@frm('E', '넓은 세모 날 · 날 밑 막대. 양쪽 곁대 사이 가로 손잡이를 주먹에 쥐고 내지른다 (H 꼴 자루)')
def fE(): return frame('E'), dict(STEEL, **IRON, **LEATHER, **BALLI)

G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '녹슨 단검', '뒷골목에서 주운 녹슨 단검 · 낡은 가죽')
def d01(): return frame('A'), dict(w='#f0d8c0', b='#c8a080', c='#dcb898', f='#8a5a3a', B='#9a7458', n='#5e3e28', **IRON, **LEATHER, **BALLI)
@make(10, 'B', '뒷골목 송곳', '뒷골목 도둑들이 소매에 숨기는 송곳 · 검은 철사 손잡이')
def d10(): return frame('B'), dict(STEEL, **IRON, r='#3a3a44', q='#26262e', R='#16161c', k='#8a8e98', K='#2a2c32', **BALLI)
@make(20, 'C', '독초 잎 단검', '독초 즙에 담가 날이 푸르스름하다 · 초록 감기')
def d20(): return frame('C'), dict(w='#f0fff0', b='#b8e0b0', c='#d8f4d0', B='#6aa868', n='#2e6a34', **IRON,
                                   r='#5ab848', q='#3a8a30', R='#1e5a1e', k='#a8f070', K='#1a4a1a', **BALLI)
@make(30, 'D', '그을린 휜 단검', '검게 그을린 휜 날 · 검은 끈 · 쇠 자루 끝')
def d30(): return frame('D'), dict(w='#c8ccd4', b='#5e626c', c='#7a7e88', B='#3e424a', n='#8a8e98', **IRON,
                                   r='#3a3434', q='#262222', R='#141010', k='#6a6262', K='#1a1616', **BALLI)
@make(40, 'C', '은빛 잎 단검', '은을 입힌 잎꼴 날 · 푸른 가죽')
def d40(): return frame('C'), dict(w='#ffffff', b='#e8eef6', c='#f6faff', B='#a8b4c8', n='#6a7690',
                                   h='#ffffff', g='#c8d0e0', G='#7a84a0', j='#ffffff', J='#8a94aa',
                                   r='#5a7ad8', q='#3a56a8', R='#22346a', k='#a8c0ff', K='#1a2a5a',
                                   p='#ffffff', o='#e0e6f0', x='#b8c2d4', O='#7a849a', Q='#4a5266')
@make(50, 'E', '밤바람 주먹 단검', '밤하늘빛 세모 날 · 은 곁대 · 남빛 손잡이 — 주먹에 쥐고 내지른다')
def d50(): return frame('E'), dict(w='#c8d8ff', b='#4a5aa8', c='#6a7ac8', B='#2a3478', n='#5a6ab8', **IRON,
                                   r='#5a6ac8', q='#3a4a98', R='#1e2660', k='#c8ccd4', K='#3a3c42',
                                   p='#ffffff', o='#e0e6f0', x='#b8c2d4', O='#7a849a', Q='#4a5266')
@make(60, 'A', '핏빛 단검', '날 끝이 붉게 물든 단검 · 검은 코등이 · 검붉은 가죽')
def d60(): return frame('A'), dict(w='#ffb0a8', b='#d8c8cc', c='#ecdde0', f='#a8323e', B='#9a8a90', n='#c8283a',
                                   h='#5a5462', g='#3a3442', G='#221e28', j='#ff4a4a', J='#a01a24',
                                   r='#7a1a24', q='#561018', R='#34080e', k='#c83a4a', K='#2a060a',
                                   p='#8a7e90', o='#4e4656', x='#3a3442', O='#221e28', Q='#120e16')
@make(70, 'B', '맹독 송곳', '보랏빛 독이 흐르는 바늘 날 · 초록 철사')
def d70(): return frame('B'), dict(w='#f0d0ff', b='#b070e0', c='#d8a8f8', B='#6a2aa8', n='#3a1260', **IRON,
                                   r='#2e6a34', q='#1e4a22', R='#0e2a12', k='#8aff5a', K='#2a8a30', **BALLI)
@make(80, 'B', '달그림자 송곳', '달빛처럼 옅은 보랏빛 바늘 · 은 원반 · 짙은 보라 철사')
def d80(): return frame('B'), dict(w='#ffffff', b='#e4dcf8', c='#f4f0ff', B='#a89ad8', n='#5e5290',
                                   h='#ffffff', g='#d0d4e6', G='#8a8ea8', j='#ffffff', J='#a8acc4',
                                   r='#3e2470', q='#2a1850', R='#160c2e', k='#c8b8f0', K='#5a4a90',
                                   p='#ffffff', o='#e8e4fa', x='#c8c0ec', O='#8a80b8', Q='#544a80')
@make(90, 'A', '황금 쥐 단검', '도둑 길드 두목이 차던 금장 단검 · 붉은 가죽')
def d90(): return frame('A'), dict(STEEL, f='#ffd860', h='#fff2a0', g='#f0c040', G='#b08018', j='#fffbd0', J='#c89028',
                                   r='#c8303a', q='#8e1a24', R='#560c16', k='#ffd860', K='#a87018',
                                   p='#fffbd0', o='#ffd860', x='#f0c040', O='#b08018', Q='#6a4a10')
@make(100, 'D', '흑요석 휜 단검', '검은 유리를 쪼아 만든 휜 날 · 보랏빛 날 끝 · 돌 자루 끝')
def d100(): return frame('D'), dict(w='#e8d4ff', b='#3e3252', c='#5a4a78', B='#241c34', n='#b89ae8',
                                    h='#b0aaa0', g='#7e786e', G='#4e4a44', r='#4e3020', q='#36200f', R='#1e1208', k='#9a6a42', K='#2a1a0c',
                                    p='#d0cac0', o='#a8a29a', x='#7e786e', O='#4e4a44', Q='#2e2c28')
@make(110, 'C', '서리 잎 단검', '서리 낀 얼음빛 잎꼴 날 · 흰 감기 · 얼음 자루 끝')
def d110(): return frame('C'), dict(w='#ffffff', b='#d8f4ff', c='#f0fbff', B='#8ac8ec', n='#3a7ab8',
                                    h='#ffffff', g='#c8e4f4', G='#7aa8c8', j='#e8fcff', J='#5a88c0',
                                    r='#f4fbff', q='#c8dcea', R='#8aa8c4', k='#7ac4ec', K='#4a7aa0',
                                    p='#ffffff', o='#d0f0ff', x='#9ad4f4', O='#4a8ac8', Q='#24507a')
@make(120, 'E', '그림자 주먹 단검', '빛을 먹는 검보랏빛 세모 날 · 잿빛 곁대 · 보랏빛 손잡이 — 그림자 속에서 내지른다')
def d120(): return frame('E'), dict(w='#c8a8ff', b='#3a2a5a', c='#4e3a78', B='#22183a', n='#7a5ac8',
                                    h='#7a6e90', g='#4a4060', G='#2a2238', j='#c8a8ff', J='#5a4a80', r='#8a6ad8', q='#5a42a0', R='#2e2058', k='#7a5ac8', K='#1a1024',
                                    p='#a888f0', o='#4e3a78', x='#3a2a5a', O='#22183a', Q='#120c20')
@make(130, 'C', '불씨 잎 단검', '날 끝이 아직 달아오른 잎꼴 날 · 검은 코등이 불씨 끝 · 불씨 자루 끝')
def d130(): return frame('C'), dict(w='#ffd070', b='#5a4444', c='#7a5a50', B='#3a2a2a', n='#ff8a2a',
                                    h='#6a5a5a', g='#3e2c2c', G='#241616', j='#ffb040', J='#e0501a',
                                    r='#3a2424', q='#2a1818', R='#1a0e0e', k='#ff6a1a', K='#1a0a0a',
                                    p='#fff2b0', o='#ffb040', x='#ff7a1a', O='#c8401a', Q='#7a1a0c')
@make(140, 'B', '별똥 송곳', '밤하늘빛 바늘 끝에 별똥별이 맺혔다 · 은 원반')
def d140():
    s = frame('B'); s.fx.update({(18, 0): '1', (16, 2): '2', (3, 5): '2', (13, 14): '1'})
    return s, dict(w='#c8dcff', b='#3e4ea0', c='#7a8ae0', B='#262e78', n='#151a4a',
                   h='#ffffff', g='#c8d0e0', G='#7a84a0', j='#ffffff', J='#8a94aa',
                   r='#24245e', q='#16163a', R='#0c0c22', k='#ffe890', K='#8a7a40',
                   p='#ffffff', o='#e0e6f0', x='#c8d0e0', O='#7a84a0', Q='#4a5270', **{'1': '#ffffff', '2': '#ffe890'})
@make(150, 'A', '밤의 군주 단검', '그림자 군주가 허리에 찬 단검 · 검보랏빛 날 은 날 끝 · 자수정 · 어둠이 감돈다')
def d150():
    s = frame('A', gem=True); s.fx.update({(3, 4): '1', (15, 14): '1', (12, 2): '2', (5, 9): '2'})
    return s, dict(w='#ffffff', b='#4a3a6a', c='#6a5a90', f='#a878ff', B='#2e2448', n='#d8dcf0',
                   h='#e0e6f0', g='#a8b2c6', G='#6a748a', j='#ffffff', J='#8a94aa',
                   z='#f0d0ff', Z='#a050f0', u='#4a1a8a',
                   r='#3a2a5a', q='#26183e', R='#140c22', k='#a878ff', K='#1a1030',
                   p='#ffffff', o='#c8d0e0', x='#a8b2c6', O='#6a748a', Q='#3e465a', **{'1': '#c8a8ff', '2': '#a878ff'})
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d.get('lv', d.get('key')), 'sym', e[:4])
        out.append((ic.render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'dg_frames.png', z=12)
    zoomsheet(out[4:12], 'dg_z1.png', z=9)
    zoomsheet(out[12:], 'dg_z2.png', z=9)
    print(Counter(d['st'] for d in G))
