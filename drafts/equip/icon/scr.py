"""마법 두루마리 — 마법서 대신 (11-10 20:16 사용자): 마법사 · 마도사 · 대마도사 · 원소술사(· 연금술사)의 부장비.
무기처럼 사선(축 x + y = 19, 오른쪽 위 45°) · 축 대칭(봉인 두루마리의 밀랍만 한쪽).
틀
  A 말린 두루마리: 축을 따라 말린 종이 · 양 끝 말린 결 · 가운데 끈과 매듭
  (B 펼친 두루마리는 11-10 21:09 사용자가 뺌 — A · C · D 셋으로. 네 레벨 묶음마다 A · C · D 한 번씩 + 한 자리는 셋 중 하나를 돌려 씀)
  C 봉인 두루마리: 말린 종이 · 끈 · 밀랍 봉인이 한쪽에 매달림
  D 축 두루마리: 말린 종이 · 양 끝으로 나온 나무 축 · 둥근 꼭지
글자: 종이 w(빛) a b(몸) B(그늘) n(가장자리) · 말린 결 c C · 끈 r R · 밀랍 s S · 축 h g G · 꼭지 o O · 주문 띠 m M · 원소 띠 e l q y · 효과 1 2"""
import math
from g4 import Sw
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
def roll(s, u0, u1, hw=2):
    """축을 따라 말린 종이 (|v| ≤ hw): 빛 쪽 w · 몸 a b · 그늘 B · 끝 n"""
    for u in range(u0, u1 + 1):
        for v in range(-hw, hw + 1):
            ch = 'w' if v == -hw else ('a' if v < 0 else ('b' if v == 0 else ('B' if v < hw else 'n')))
            P(s, 'blade', u, v, ch)
    for u in (u0 - 1, u1 + 1):                                                     # 말린 결 (양 끝 단면)
        for v in range(-hw, hw + 1):
            P(s, 'guard', u, v, 'C' if abs(v) == hw else 'c')
    P(s, 'guard', u1 + 1, 0, 'C'); P(s, 'guard', u0 - 1, 0, 'C')
def band(s, u0, u1, hw=2, ch=('r', 'R')):
    for u in range(u0, u1 + 1):
        for v in range(-hw - 1, hw + 2): P(s, 'grip', u, v, ch[0] if v < 0 else ch[1])
def stripe(s, u, hw, ch=('m', 'M')):
    """종이를 가로지르는 주문 띠 (u · u+1 두 줄 = 화면에서 끊기지 않는 띠): 빛 쪽 ch[0] · 그늘 쪽 ch[1]"""
    for uu in (u, u + 1):
        for v in range(-hw, hw + 1): P(s, 'blade', uu, v, ch[0] if v < 1 else ch[1])
def fA(s):
    roll(s, -11, 11)
    band(s, -1, 1)
    for sg in (-1, 1):                                                             # 매듭 고리 양옆
        for (u, v) in ((-2, 4), (2, 4), (0, 4), (-1, 5), (1, 5)): P(s, 'grip', u, sg * v, 'r' if sg < 0 else 'R')
def fB(s):
    for u in range(-7, 8):                                                         # 펼친 종이 (|v| ≤ 4)
        for v in range(-4, 5):
            P(s, 'blade', u, v, 'w' if v == -4 else ('n' if v == 4 else ('a' if v < 0 else 'b')))
    for uc in (-9, 9):                                                             # 두루마리 축 둘 (축에 수직으로 가로놓임)
        for u in (uc - 1, uc, uc + 1):
            for v in range(-6, 7):
                t = (u - uc) * (1 if uc > 0 else -1)
                P(s, 'guard', u, v, 'c' if t < 0 else ('C' if t > 0 else 'a'))
        for v in (-7, 7):
            P(s, 'pommel', uc, v, 'o' if v < 0 else 'O')
    for y in range(20):                                                            # 마법진 (종이 가운데 고리 + 점)
        for x in range(20):
            d = math.hypot(x + .5 - 10.0, y + .5 - 10.0)
            if 2.3 <= d <= 3.1: s.put(x, y, 'blade', 'm' if (x + y) % 2 else 'M')
    s.put(9, 9, 'blade', 'M'); s.put(10, 10, 'blade', 'M'); s.put(9, 10, 'blade', 'm'); s.put(10, 9, 'blade', 'm')
def fC(s):
    roll(s, -11, 11)
    band(s, -1, 1)
    for (u, v) in ((0, 4), (-1, 5), (1, 5), (0, 6)): P(s, 'grip', u, v, 'R')     # 끈이 한쪽(오른쪽 아래)으로 내려옴
    for (dx, dy, ch) in ((0, 0, 's'), (1, 0, 's'), (0, 1, 'S'), (1, 1, 'S'), (-1, 0, 's'), (0, -1, 's'), (2, 1, 'S'), (1, 2, 'S')):
        s.put(13 + dx, 12 + dy, 'pommel', ch)                                      # 밀랍 봉인
    s.put(13, 12, 'pommel', 'S'); s.put(14, 13, 'pommel', 's')
def fD(s):
    roll(s, -6, 6, hw=3)
    for u0, u1 in ((-11, -8), (8, 11)):                                          # 나무 축 (짧게)
        for u in range(u0, u1 + 1):
            for v in (-1, 0, 1): P(s, 'grip', u, v, 'h' if v < 0 else ('G' if v > 0 else 'g'))
    for (x, y) in ((3, 16), (16, 3)):                                              # 둥근 꼭지 3×3 (가운데 칸 축 위)
        for (dx, dy, ch) in ((-1, -1, 'o'), (0, -1, 'o'), (1, -1, 'g'), (-1, 0, 'o'), (0, 0, 'g'), (1, 0, 'O'), (-1, 1, 'g'), (0, 1, 'O'), (1, 1, 'O')):
            s.put(x + dx, y + dy, 'pommel', ch)
def frame(st):
    s = Sw(); s.fx = {}
    {'A': fA, 'B': fB, 'C': fC, 'D': fD}[st](s)
    return s
STYLE = {'A': '말린 두루마리', 'C': '봉인 두루마리', 'D': '축 두루마리'}
PAPER = dict(w='#fff8e8', a='#f0e0c0', b='#e0cca0', B='#b89c70', n='#8a6e48', c='#d8c098', C='#8a6e48')
TWINE = dict(r='#a8784a', R='#6a4a2a')
WAX = dict(s='#e0283a', S='#8a0e18')
WOODR = dict(h='#c8a070', g='#8a6440', G='#54381e', o='#a8784a', O='#4a2e18')
CIRC = dict(m='#e0283a', M='#8a0e18')
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
@frm('A', '축을 따라 말린 종이 · 양 끝 말린 결 · 가운데 끈과 매듭')
def gA(): return frame('A'), M(PAPER, TWINE)
@frm('C', '말린 종이 · 끈 · 한쪽에 매달린 밀랍 봉인')
def gC(): return frame('C'), M(PAPER, TWINE, WAX)
@frm('D', '말린 종이 · 양 끝으로 나온 나무 축 · 둥근 꼭지')
def gD(): return frame('D'), M(PAPER, WOODR)
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '견습 두루마리', '마탑 견습생의 첫 주문서 · 삼끈')
def r01(): return frame('A'), M(PAPER, TWINE)
@make(10, 'D', '불꽃 주문 두루마리', '붉은 옻칠 축 · 불꽃빛 꼭지 · 종이에 붉은 주문 띠 둘 · 불티가 오른다')
def r10():
    s = frame('D')
    for u in (-4, 3): stripe(s, u, 3)
    s.fx.update({(18, 0): '1', (19, 2): '2', (17, 0): '2'})
    return s, M(PAPER, CIRC, h='#e86a4a', g='#a8281e', G='#5a1010', o='#ffd84a', O='#e0501a', **{'1': '#ffd84a', '2': '#ff7a1a'})
@make(20, 'C', '봉인된 두루마리', '붉은 밀랍으로 봉한 주문서')
def r20(): return frame('C'), M(PAPER, TWINE, WAX)
@make(30, 'D', '마탑 두루마리', '마탑 서고의 나무 축 두루마리')
def r30(): return frame('D'), M(PAPER, WOODR)
@make(40, 'C', '서리 주문 두루마리', '서리 낀 푸른 종이 · 은빛 끈 · 얼음빛 밀랍 봉인 · 서리가 반짝인다')
def r40():
    s = frame('C'); s.fx.update({(17, 1): '1', (1, 15): '1', (18, 4): '2'})
    return s, M(w='#ffffff', a='#e8f6ff', b='#cce8f8', B='#8ab8dc', n='#4a78a8', c='#d8f0ff', C='#4a78a8', r='#a8c8e8', R='#4a6a98',
                s='#8ad8f4', S='#2a6ab8', **{'1': '#ffffff', '2': '#c8f0ff'})
@make(50, 'A', '비단 두루마리', '희고 고운 비단 · 푸른 비단 끈')
def r50(): return frame('A'), M(PAPER, w='#ffffff', a='#f4f4fa', b='#e0e4f0', B='#b8bed4', n='#8a90aa', c='#e8ecf6', C='#8a90aa', r='#5a7ad8', R='#2a3a8a')
@make(60, 'D', '금축 두루마리', '금 축 · 금 꼭지 · 누런 종이')
def r60(): return frame('D'), M(PAPER, h='#fffbd0', g='#f0c040', G='#a87018', o='#ffd860', O='#a87018')
@make(70, 'C', '왕실 봉인 두루마리', '금빛 밀랍 · 왕실 붉은 끈')
def r70(): return frame('C'), M(PAPER, r='#d8302e', R='#8a1a1a', s='#ffd860', S='#a87018')
@make(80, 'A', '번개 주문 두루마리', '말린 종이 틈으로 번개가 번쩍인다')
def r80():
    s = frame('A'); s.fx.update({(18, 0): '1', (16, 1): '2', (2, 16): '2', (0, 18): '1'})
    return s, M(PAPER, r='#3a5aa8', R='#142650', **{'1': '#ffffff', '2': '#fff36a'})
@make(90, 'D', '별자리 두루마리', '밤빛 종이에 별자리 · 은 축')
def r90():
    s = frame('D')
    for (x, y) in ((9, 8), (11, 10), (8, 11), (12, 7)): s.put(x, y, 'blade', 'w')
    return s, M(w='#fff6c8', a='#2a3478', b='#22286a', B='#151a4a', n='#0c0e2a', c='#3e4ea0', C='#151a4a', h='#e8eef6', g='#a8b4c8', G='#5a6680', o='#e8eef6', O='#7a84a0')
@make(100, 'A', '원소 주문 두루마리', '불 · 물 · 바람 · 흙 네 빛깔 띠로 묶은 두루마리 · 네 빛 알갱이')
def r100():
    s = frame('A')
    EL = {-3: 'e', -2: 'e', -1: 'l', 0: 'l', 1: 'q', 2: 'y', 3: 'y'}
    for u in range(-1, 2):
        for v in range(-3, 4): P(s, 'grip', u, v, EL[v])
    for sg in (-1, 1):
        for (u, v) in ((-2, 4), (2, 4), (0, 4), (-1, 5), (1, 5)): P(s, 'grip', u, sg * v, 'e' if sg < 0 else 'y')
    s.fx.update({(18, 1): '1', (16, 0): '2', (1, 16): '3', (3, 18): '4'})
    return s, M(PAPER, e='#e8402a', l='#3a8ae0', q='#4ac070', y='#f0c040', **{'1': '#ff8a5a', '2': '#5ac0f0', '3': '#8ae070', '4': '#fff36a'})
@make(110, 'C', '금서 봉인 두루마리', '검은 밀랍으로 봉한 금지된 주문 · 검은 끈')
def r110(): return frame('C'), M(PAPER, r='#2a2630', R='#14121a', s='#4e3a78', S='#1a1030', b='#d8c8a0', B='#a08a60')
@make(120, 'D', '대마법 두루마리', '흰 종이에 보랏빛 주문 띠 둘 · 가운데 금 인 · 보라 축 · 금 꼭지 — 대마도사의 큰 주문')
def r120():
    s = frame('D')
    for u in (-5, 4): stripe(s, u, 3)
    for q in ((0, -1), (0, 1), (1, 0), (-1, 0)): P(s, 'blade', q[0], q[1], 'o')              # 가운데 금 인
    s.fx.update({(18, 0): '1', (0, 18): '1', (19, 5): '2', (5, 19): '2'})
    return s, M(w='#ffffff', a='#fbf8ff', b='#ece4f8', B='#c0b0dc', n='#7a68a0', c='#f4eefc', C='#7a68a0', m='#a878ff', M='#5a2ab8',
                h='#c8a8ff', g='#7a4ad8', G='#3a1a78', o='#ffd860', O='#a87018', **{'1': '#ffffff', '2': '#e0c8ff'})
@make(130, 'A', '용피지 두루마리', '용 가죽을 무두질한 붉은 두루마리 · 금 끈')
def r130(): return frame('A'), M(w='#ffd0b0', a='#e07a4a', b='#c8583a', B='#8a2e1e', n='#5a1a10', c='#c8583a', C='#5a1a10', r='#f0c040', R='#a87018')
@make(140, 'C', '현자의 봉인 두루마리', '보랏빛 밀랍에 현자의 인 · 은 끈')
def r140(): return frame('C'), M(PAPER, r='#e8eef6', R='#7a84a0', s='#a878ff', S='#4e3a78')
@make(150, 'D', '태초의 두루마리', '세상이 처음 적힌 두루마리 — 빛나는 종이 · 금 축 · 보석 꼭지 · 금빛이 감돈다')
def r150():
    s = frame('D'); s.fx.update({(19, 0): '1', (0, 19): '1', (16, 5): '2', (4, 14): '2'})
    return s, M(w='#ffffff', a='#fffbe8', b='#fff0c0', B='#e0c070', n='#a87018', c='#fff0c0', C='#a87018', h='#fffbd0', g='#f0c040', G='#a87018',
                o='#d0a8ff', O='#6a2ab8', **{'1': '#ffffff', '2': '#fff0a0'})
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
        if e and d.get('st', d.get('key')) != 'C': print(d.get('lv', d.get('key')), 'sym', len(e), e[:4])
        out.append((ic.render(), str(d.get('lv', d.get('key')))))
    nf = len(FR)
    zoomsheet(out[:nf], 'scr_frames.png', z=12)
    zoomsheet(out[nf:nf + 8], 'scr_z1.png', z=9); zoomsheet(out[nf + 8:], 'scr_z2.png', z=9)
    print(Counter(d['st'] for d in G))
