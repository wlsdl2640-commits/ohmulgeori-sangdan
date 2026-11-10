"""글라디우스 16자루 — 원형 시안 A~D를 골고루 섞어 (네 레벨 묶음마다 A · B · C · D 한 번씩).
모든 칼이 같은 틀(g4d.py): 날 · 코등이 · 손잡이 · 공이 축 x + y = 19 위. 덧붙임(사슬 · 술 · 띠 · 날개) 없음 —
자루마다 다른 건 색 · 재질 · 작은 장식(홈 · 고리 · 징 · 상감 · 보석 · 빛)뿐.
글자 (모든 칼 같음)
  날   w 빛 가장자리 · b 빛 면 · c 등줄 · B 그늘 면 · n 그늘 가장자리 · e 벼린 그늘 가장자리(C) · f F 홈(B) · a 상감 등줄(D)
  코등이 h 빛 끝 · g 몸 · G 그늘 끝 · m M 날 쪽 판(A) · j J 띠/테(B · D) · t 징(C) · z Z u 보석
  손잡이 r q R · k K 홈/고리
  자루 끝 p 하이라이트 · o 빛 · x 가운데 · O 그늘 · Q 깊은 그늘 · y 꼭지 · (B는 j J 띠)
  효과(테두리 없음) 1 2"""
from g4d import Sw, region, blade, blade5, edge_of, guard, grip, pommel, TIP_SHORT, TIP_LONG, TIP_SOFT, OVAL
from g4 import UV
from wic import N

def gbody(u, v): return 'h' if v <= -3 else ('G' if v >= 3 else 'g')
def rbody(u, v): return 'r' if v < 0 else ('R' if v > 0 else 'q')
BALL = dict(h='p', l='o', m='x', d='O', D='Q')
STYLE = {'A': '폼페이 정석', 'B': '마인츠 장식', 'C': '투사 실전형', 'D': '의장 금장'}

def frame(st, bmod=None, gem=False, fx=None):
    """bmod(u, v, h, ch) → 날 글자 바꾸기 (무늬 · 별 · 번개)"""
    s = Sw()
    def wrap(fn):
        if not bmod: return fn
        return lambda u, v, h: bmod(u, v, h, fn(u, v, h))
    if st == 'A':
        blade(s, TIP_SHORT, wrap(blade5()))
        guard(s, lambda u, v: ('m' if v < 0 else 'M') if u == -1 else gbody(u, v))
        grip(s, lambda u, v: ('k' if v < 0 else 'K') if u in (-6, -8) else rbody(u, v))
        pommel(s, BALL, nub='y')
    elif st == 'B':
        def bl(u, v, h):
            if abs(v) == 1 and 1 <= u <= 11: return 'f' if v < 0 else 'F'
            return blade5()(u, v, h)
        blade(s, TIP_LONG, wrap(bl))
        guard(s, lambda u, v: ('j' if v < 0 else 'J') if u == -2 else gbody(u, v))
        grip(s, lambda u, v: ('k' if v < 0 else 'K') if u in (-6, -8) else rbody(u, v))
        pommel(s, BALL, band=('j', 'J'), nub='y')
    elif st == 'C':
        def bl(u, v, h):
            if edge_of(v, h): return 'w' if v < 0 else 'e'
            return 'b' if v < 0 else ('B' if v > 0 else 'c')
        blade(s, TIP_SOFT, wrap(bl))
        guard(s, lambda u, v: 't' if (u == -3 and abs(v) == 2) else gbody(u, v))
        grip(s, lambda u, v: ('r' if v <= 0 else 'q') if (u - v) % 4 in (0, 1) else ('q' if v < 0 else 'R'))
        pommel(s, BALL, nub='y')
    elif st == 'D':
        def bl(u, v, h):
            if v == 0 and u <= 12: return 'a'
            return blade5()(u, v, h)
        blade(s, TIP_SHORT, wrap(bl))
        guard(s, lambda u, v: ('j' if v < 0 else 'J') if u in (-1, -4) else gbody(u, v))
        grip(s, lambda u, v: ('k' if v < 0 else 'K') if u in (-6, -8) else rbody(u, v))
        pommel(s, BALL, nub='y')
    if gem:                                    # 코등이 한가운데 2×2 보석 (축 위)
        for (x, y), ch in (((8, 10), 'z'), ((9, 10), 'Z'), ((8, 11), 'Z'), ((9, 11), 'u')): s.put(x, y, 'guard', ch)
    return s

G = []
def make(lv, st, name, desc, **kw):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn, **kw)); return fn
    return deco
def icon(d):
    s, pal, extra = d['fn']()
    ic = s.icon(pal, fx=extra.get('fx'), glow=extra.get('glow'))
    ic.glow_dot = True
    return s, ic
STEEL = dict(w='#ffffff', b='#d8e2ee', c='#eef4fc', B='#8f9db8', n='#566282')

# ── 묶음 1 (Lv1 · 10 · 20 · 30) ──
@make(1, 'C', '나무 연습검', '참나무를 깎은 연습용. 끝이 뭉툭하고 손잡이엔 무명천을 감았다')
def g01():
    return frame('C'), dict(w='#f8e0b0', e='#ecc890', b='#d8a868', c='#e6bc80', B='#a87440',
                            h='#b07a44', g='#8a5a2c', G='#5a3818', t='#3e2410',
                            r='#f2e8d0', q='#cbbd98', R='#8e8064',
                            p='#f0c088', o='#c88c4a', x='#a06a36', O='#6a4420', Q='#42280f', y='#a06a36'), {}

@make(10, 'A', '신참 투사검', '쇠 날 · 호두나무 코등이 · 갈색 가죽 손잡이. 가장 흔한 투사의 칼')
def g10():
    return frame('A'), dict(STEEL, h='#e0a060', g='#a8642e', G='#6a3818', m='#ffe08a', M='#c8902e',
                            r='#b0703e', q='#844c26', R='#522c16', k='#5a3420', K='#3a1e10',
                            p='#f6c080', o='#c88040', x='#a8642e', O='#7a4422', Q='#4a2612', y='#c8902e'), {}

@make(20, 'B', '청동 장식검', '청동을 부어 만든 금빛 날 · 두 줄 홈. 검은 나무 코등이에 금 띠')
def g20():
    return frame('B'), dict(w='#fff4c8', b='#ecc684', c='#f8dca0', B='#b8843e', n='#7c5222', f='#d4a45c', F='#98682a',
                            h='#8a5a3a', g='#5e3a24', G='#3a2214', j='#ffe090', J='#c89038',
                            r='#6a4a3a', q='#4a3022', R='#2e1c14', k='#f0c060', K='#b07e28',
                            p='#fff0b8', o='#e8b860', x='#c48a3a', O='#8a5a22', Q='#5a3612', y='#b07e28'), {}

@make(30, 'D', '뼈자루 검', '짐승 뼈를 깎은 코등이 · 손잡이 · 공. 마디를 힘줄로 묶음')
def g30():
    return frame('D'), dict(w='#f0f2f4', b='#c8ccd2', c='#dfe2e6', a='#dfe2e6', B='#8a8f9a', n='#555a66',
                            h='#fffaee', g='#e6dcc4', G='#b0a284', j='#9a7a5a', J='#6a5038',
                            r='#f8f0dc', q='#e0d4b8', R='#aa9c7e', k='#8a7258', K='#5e4c36',
                            p='#ffffff', o='#f0e8d4', x='#ddd0b4', O='#aa9a7a', Q='#7a6c54', y='#9a7a5a'), {}

# ── 묶음 2 (Lv40 · 50 · 60 · 70) ──
@make(40, 'C', '투견의 송곳니', '상아빛 송곳니 날 · 투견 목줄처럼 은 징 박힌 검은 가죽')
def g40():
    return frame('C'), dict(w='#fffcf0', e='#f2e6c8', b='#e8d8b0', c='#f4e8cc', B='#bca67e',
                            h='#5a4a48', g='#3a2e2e', G='#221a1a', t='#e8ecf4',
                            r='#5a4842', q='#3a2c28', R='#221816',
                            p='#f0f4fa', o='#a8b0bc', x='#78808e', O='#4a5260', Q='#2a303a', y='#78808e'), {}

@make(50, 'B', '붉은 모래검', '모래빛 날 · 사암 코등이에 붉은 띠 · 붉은 가죽 손잡이')
def g50():
    return frame('B'), dict(w='#fffaf0', b='#efe2cc', c='#fbf4e8', B='#b8a488', n='#7a6a54', f='#d8c6a6', F='#988468',
                            h='#f4dcae', g='#d4b27a', G='#9a7a48', j='#e8604a', J='#a83226',
                            r='#e05a44', q='#b0322a', R='#6e1a1a', k='#f4dcae', K='#b8945e',
                            p='#fff0d0', o='#e8c890', x='#d0ae78', O='#9a7a48', Q='#5e4628', y='#a83226'), {}

@make(60, 'A', '검붉은 투혼', '그을린 검은 날 가장자리에 붉은 불길 · 달군 쇠 판')
def g60():
    fx = {(2, 4): '1', (5, 1): '2', (14, 12): '1', (17, 9): '2', (12, 15): '1'}
    return frame('A'), dict(w='#ffb48a', b='#6a3c40', c='#8a4a4a', B='#4a2428', n='#e0402e',
                            h='#5e5664', g='#3c3442', G='#241e2a', m='#ff6a48', M='#b02a20',
                            r='#7a2a2a', q='#561a1e', R='#3a1014', k='#2a1416', K='#1a0c0e',
                            p='#8a7e90', o='#4e4656', x='#3c3442', O='#241e2a', Q='#161218', y='#ff5a3a',
                            **{'1': '#ff7a3a', '2': '#ffc060'}), dict(fx=fx)

@make(70, 'D', '사자갈기 검', '황금 코등이에 갈기빛 주황 테 · 금 상감 등줄 · 호박빛 가죽 손잡이')
def g70():
    return frame('D'), dict(w='#ffffff', b='#e4ecf8', c='#f6faff', a='#ffd860', B='#9cabc6', n='#5e6a8c',
                            h='#fff2a0', g='#f0c040', G='#b08018', j='#ff9a3a', J='#c05a14',
                            r='#c8783a', q='#9a5224', R='#62300f', k='#ffd860', K='#c8902a',
                            p='#fffbd0', o='#ffd860', x='#e8a830', O='#a87018', Q='#6e4410', y='#ff9a3a'), {}

# ── 묶음 3 (Lv80 · 90 · 100 · 110) ──
@make(80, 'C', '백전의 검', '백 번 싸운 칼. 짙은 쇠 날 · 벼린 날 끝 · 놋쇠 징')
def g80():
    return frame('C'), dict(w='#ffffff', e='#dfe8f4', b='#9eaabc', c='#bec8d6', B='#646f86',
                            h='#a8b2c2', g='#6c7686', G='#3c4452', t='#ffd870',
                            r='#d06448', q='#963a2a', R='#5a1e1a',
                            p='#f0f4fa', o='#a8b2c2', x='#6c7686', O='#3c4452', Q='#262c38', y='#ffd870'), {}

@make(90, 'A', '황금 투구 검', '투사 투구처럼 둥근 금 공에 붉은 꼭지 · 금 코등이에 붉은 칠 판')
def g90():
    return frame('A'), dict(STEEL, h='#fff2a0', g='#f0c040', G='#b08018', m='#ff5a4a', M='#b8241e',
                            r='#e05044', q='#a82a26', R='#6a1618', k='#ffd860', K='#b88a24',
                            p='#fffbd0', o='#ffd860', x='#f0c040', O='#c08a20', Q='#7a5210', y='#ff4a3a'), {}

@make(100, 'D', '월계 챔피언검', '우승자의 칼. 금 코등이에 월계 잎빛 테 · 초록 손잡이')
def g100():
    return frame('D'), dict(w='#ffffff', b='#eef4fb', c='#fafdff', a='#ffe27a', B='#a8b6cc', n='#66728e',
                            h='#fff2a0', g='#f0c040', G='#b08018', j='#8ae05a', J='#3a8a2a',
                            r='#6ad04a', q='#3a9a30', R='#1e5a1e', k='#ffe27a', K='#c8902a',
                            p='#fffbd0', o='#ffe27a', x='#f0c040', O='#b08018', Q='#6e4a10', y='#3a8a2a'), {}

@make(110, 'B', '핏빛 개선검', '승리 행진의 칼. 두 줄 홈에 붉은 빛이 흐르고 코등이 띠도 붉다')
def g110():
    return frame('B'), dict(STEEL, f='#ff5a5a', F='#b82030',
                            h='#e8c070', g='#b88a3a', G='#7a5418', j='#ff4a4a', J='#a01a24',
                            r='#c8283a', q='#8e1424', R='#560a16', k='#e8c070', K='#a87a2a',
                            p='#fff0b0', o='#e8c070', x='#b88a3a', O='#7a5418', Q='#4a3010', y='#a01a24'), {}

# ── 묶음 4 (Lv120 · 130 · 140 · 150) ──
BOLT = {(1, 0), (2, -1), (4, -1), (5, 0), (6, 1), (8, 1), (9, 0), (10, -1), (12, -1)}
def zig(u, v, h, ch):
    """홈 자리에 꺾인 번개 한 줄 (칸이 서로 닿게 이어진 지그재그)"""
    if (u, v) in BOLT: return 'f'
    if ch in 'fF': return 'b' if v < 0 else 'B'
    return ch
@make(120, 'B', '번개 투사검', '푸른 쇠 날 두 줄 홈을 따라 번개가 지그재그로 흐른다. 노란 띠 · 고리')
def g120():
    fx = {(15, 9): '1', (16, 10): '2', (3, 6): '2', (10, 2): '1'}
    return frame('B', bmod=zig), dict(w='#e0ecff', b='#6a7ea4', c='#8a9cc0', B='#465878', n='#2a3654', f='#fff36a', F='#ffd02a',
                                      h='#8ea2c8', g='#5a6e96', G='#34446a', j='#fff36a', J='#d0a020',
                                      r='#3a5aa8', q='#24407e', R='#142650', k='#fff36a', K='#d0a020',
                                      p='#dbe6ff', o='#8ea2c8', x='#5a6e96', O='#34446a', Q='#1e2a48', y='#fff36a',
                                      **{'1': '#ffffff', '2': '#fff36a'}), dict(fx=fx)

@make(130, 'C', '흑요석 검', '검은 유리를 쪼아 만든 날 · 보랏빛 날 끝 · 돌 코등이')
def g130():
    return frame('C'), dict(w='#e8d4ff', e='#b89ae8', b='#3e3252', c='#5a4a78', B='#241c34',
                            h='#b0aaa0', g='#7e786e', G='#4e4a44', t='#8a6ad8',
                            r='#7a5032', q='#4e3020', R='#2e1c12',
                            p='#d8c0ff', o='#5a4a78', x='#3e3252', O='#241c34', Q='#140f1e', y='#8a6ad8'), {}

def stars(u, v, h, ch):
    return {(9, -1): '1', (5, 1): '2', (13, 1): '1', (2, -1): '1', (11, 0): '2'}.get((u, v), ch)
@make(140, 'A', '별빛 투기장검', '밤하늘 빛 날에 별이 박혔다 · 은 코등이 · 별빛 꼭지')
def g140():
    fx = {(3, 5): '1', (14, 13): '2', (17, 8): '1'}
    return frame('A', bmod=stars), dict(w='#c8dcff', b='#3e4ea0', c='#5464bc', B='#262e78', n='#151a4a',
                                        h='#ffffff', g='#c8d0e0', G='#7a84a0', m='#a8c0ff', M='#5a6ad0',
                                        r='#3a3a8a', q='#24245e', R='#14143a', k='#c8d0e0', K='#7a84a0',
                                        p='#ffffff', o='#e0e6f0', x='#c8d0e0', O='#7a84a0', Q='#4a5270', y='#ffe890',
                                        **{'1': '#ffffff', '2': '#ffe890'}), dict(fx=fx)

@make(150, 'D', '불멸의 투기왕', '투기장 왕좌의 칼. 흰 금빛 날 · 코등이 루비 · 빛이 감돈다')
def g150():
    fx = {(3, 4): '1', (15, 14): '1', (12, 2): '2', (16, 9): '2', (5, 8): '2'}
    return frame('D', gem=True), dict(w='#ffffff', b='#fff8e0', c='#fffdf4', a='#ffd860', B='#f0d488', n='#c09838',
                                      h='#fffbe8', g='#ffe8a0', G='#d8b050', j='#ffd860', J='#c08a20',
                                      z='#ffb0bc', Z='#e0283a', u='#8a1020',
                                      r='#fffaf0', q='#e8dcc4', R='#b8a888', k='#ffd860', K='#c08a20',
                                      p='#ffffff', o='#ffe8a0', x='#ffd860', O='#c08a20', Q='#7a5410', y='#e0283a',
                                      **{'1': '#ffffff', '2': '#fff0a0'}), dict(fx=fx)

from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in G:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d['lv'], 'sym err', e)
        out.append((ic.render(), f"Lv{d['lv']} {d['st']}"))
    zoomsheet(out[:8], 'g16_z1.png', z=9)
    zoomsheet(out[8:], 'g16_z2.png', z=9)
    from collections import Counter
    print(Counter(d['st'] for d in G))
