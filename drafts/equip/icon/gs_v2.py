"""대검(광전사 · 피의 군주, 두 손) — 원형 시안 A~D + 16자루 (네 레벨 묶음마다 A · B · C · D 한 번씩).
축 x + y = 19. 모든 부품이 축 위, 윤곽 축 대칭(sym_err).
틀
  날     u −4..17, 한 줄 7칸(|v| ≤ 3) — 글라디우스(5칸) · 장검(3칸)보다 훨씬 넓다
  코등이 u −6..−5 두 줄 긴 막대 |v| ≤ 8 — B 끝이 휨 + 날 밑동 가죽 감은 리카소 · 받이 돌기 / C 칼끝 쪽으로 꺾인 V / D 짧고 두꺼움
  손잡이 u −12..−7 (11-10 17:34 줄임, 예전 −12..−5), 한 줄 3칸 · 코등이 u −6..−5 · 날 u −4..17
  자루 끝 3×3 (가운데 (2,17) = 축 위)
글자: 날 w b c B n f(홈) · 코등이 h g G j J · 보석 z Z u · 리카소 감기 k K · 손잡이 r q R m M · 자루 끝 p o x O Q y · 효과 1 2"""
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
def pom3(s, roles, boss=None):
    for j, r in enumerate(POM3):
        for i, ch in enumerate(r): s.put(1 + i, 16 + j, 'pommel', roles[ch])
    if boss: s.put(2, 17, 'pommel', boss)
def rbody(u, v): return 'r' if v < 0 else ('R' if v > 0 else 'q')
def gbody(u, v): return 'h' if v <= -4 else ('G' if v >= 4 else 'g')
STYLE = {'A': '투박한 대검', 'B': '리카소 대검', 'C': 'V 코등이', 'D': '처형인'}
def b7(fuller=None, wide=False):
    """7칸 날 명암 (fuller = 홈이 있는 u 범위)"""
    def f(u, v, h):
        e = edge_of(v, h)
        if fuller and fuller[0] <= u <= fuller[1] and (abs(v) <= (1 if wide else 0)): return 'f'
        if v < 0: return 'w' if e else 'b'
        if v > 0: return 'n' if e else 'B'
        return 'c'
    return f
def frame(st, bmod=None, gem=False):
    """손잡이를 줄였다(11-10 17:34): u −12..−7 (6줄, 예전 8줄). 그만큼 코등이 · 날 밑동이 두 칸 아래로 → 날이 길어짐"""
    s = Sw()
    W = lambda fn: (lambda u, v, h: bmod(u, v, h, fn(u, v, h))) if bmod else fn
    grip_wrap = lambda u, v: ('m' if v <= 0 else 'M') if (u - v) % 4 in (0, 1) else rbody(u, v)
    GRIP = (-12, -7)
    if st == 'A':
        hw = lambda u: 3 if u <= 11 else (17 - u) / 2
        region(s, 'blade', lambda u, v: -4 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(b7())(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-5, -6) and abs(v) <= 8, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 7 else gbody(u, v))
        region(s, 'grip', lambda u, v: GRIP[0] <= u <= GRIP[1] and abs(v) <= 1, grip_wrap)
        pom3(s, BALL)
    elif st == 'B':
        hw = lambda u: (1 if u <= 0 else (3 if u <= 11 else (17 - u) / 2))
        def bl(u, v, h):
            if u <= 0: return 'k' if (u - v) % 4 in (0, 1) else 'K'           # 리카소: 가죽 감기
            return b7(fuller=(2, 11))(u, v, h)
        region(s, 'blade', lambda u, v: -4 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(bl)(u, v, hw(u)))
        for (u, v, ch) in [(0, -5, 'j'), (1, -4, 'h'), (0, 5, 'J'), (1, 4, 'G')]: P(s, 'guard', u, v, ch)      # 받이 돌기
        region(s, 'guard', lambda u, v: u in (-5, -6) and abs(v) <= 5, gbody)
        for (u, v, ch) in [(-5, -6, 'j'), (-4, -7, 'j'), (-5, 6, 'J'), (-4, 7, 'J')]: P(s, 'guard', u, v, ch)   # 끝이 칼끝 쪽으로
        region(s, 'grip', lambda u, v: GRIP[0] <= u <= GRIP[1] and abs(v) <= 1, lambda u, v: ('m' if v <= 0 else 'M') if u in (-8, -11) else rbody(u, v))
        pom3(s, BALL, boss='y')
    elif st == 'C':
        hw = lambda u: 3 if u <= 11 else (17 - u) / 2
        region(s, 'blade', lambda u, v: -4 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(b7(fuller=(-2, 11)))(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-5, -6) and abs(v) <= 2, gbody)
        # 칼끝 쪽으로 꺾인 두 팔 (화면에선 왼팔은 위로, 오른팔은 오른쪽으로) + 끝 구슬 — 두 칸 내린 자리
        for (x, y, ch) in [(6, 10, 'h'), (6, 9, 'h'), (5, 10, 'g'), (5, 9, 'g'), (5, 8, 'j'), (6, 8, 'j'), (5, 7, 'j'),
                           (9, 13, 'g'), (10, 13, 'g'), (9, 14, 'G'), (10, 14, 'G'), (11, 14, 'J'), (11, 13, 'J'), (12, 14, 'J')]:
            s.put(x, y, 'guard', ch)
        region(s, 'grip', lambda u, v: GRIP[0] <= u <= GRIP[1] and abs(v) <= 1, grip_wrap)
        pom3(s, BALL, boss='y')
    elif st == 'D':
        hw = lambda u: 3 if u <= 14 else (2 if u == 15 else -1)              # 끝이 뭉툭한 넓은 날
        region(s, 'blade', lambda u, v: -4 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: W(b7(fuller=(-2, 12), wide=True))(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-5, -6) and abs(v) <= 4, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 4 else gbody(u, v))
        for (u, v, ch) in [(-4, -5, 'j'), (-7, -5, 'j'), (-4, 5, 'J'), (-7, 5, 'J')]: P(s, 'guard', u, v, ch)    # 뭉툭한 끝
        region(s, 'grip', lambda u, v: GRIP[0] <= u <= GRIP[1] and abs(v) <= 1, lambda u, v: ('m' if v <= 0 else 'M') if u in (-8, -11) else rbody(u, v))
        pom3(s, BALL, boss='y')
    if gem:
        for (x, y), ch in (((7, 11), 'z'), ((8, 11), 'Z'), ((7, 12), 'Z'), ((8, 12), 'u')): s.put(x, y, 'guard', ch)
    return s

FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, name=f'시안 {key} · {STYLE[key]}', desc=desc, fn=fn)); return fn
    return deco
STEEL7 = dict(w='#ffffff', b='#d0dae8', c='#eef4fc', f='#7e8ca6', B='#8f9db8', n='#566282')
IRON = dict(h='#a8b0bc', g='#6c7482', G='#3e4450', j='#d8dee8', J='#4e5662')
@frm('A', '넓은 날 · 가운데 등줄 · 세모 끝. 긴 곧은 코등이 · 가죽 감은 두 손 손잡이 · 둥근 자루 끝')
def fA():
    return frame('A'), dict(STEEL7, **IRON, r='#8a5a36', q='#64401f', R='#3e2614', m='#a8784a', M='#4a2e18',
                            p='#e8eef6', o='#a8b0bc', x='#6c7482', O='#3e4450', Q='#262a32'), {}
@frm('B', '날 밑동(리카소)을 가죽으로 감고 받이 돌기 둘 · 가운데 홈. 끝이 휜 긴 코등이 · 금 고리 손잡이')
def fB():
    return frame('B'), dict(STEEL7, **IRON, k='#a0603a', K='#5e341c',
                            r='#3e3a3a', q='#2a2626', R='#181414', m='#d8b050', M='#8a6a20',
                            p='#e8eef6', o='#a8b0bc', x='#6c7482', O='#3e4450', Q='#262a32', y='#d8b050'), {}
@frm('C', '가운데 홈 · 세모 끝. 두 팔이 칼끝 쪽으로 꺾인 V 코등이 · 끝 구슬 · 가죽 감은 손잡이')
def fC():
    return frame('C'), dict(STEEL7, **IRON, r='#8a5a36', q='#64401f', R='#3e2614', m='#a8784a', M='#4a2e18',
                            p='#e8eef6', o='#a8b0bc', x='#6c7482', O='#3e4450', Q='#262a32', y='#3e4450'), {}
@frm('D', '끝이 뭉툭한 처형인의 넓은 날 · 넓은 홈. 짧고 두꺼운 코등이 · 고리 손잡이 · 둥근 자루 끝')
def fD():
    return frame('D'), dict(STEEL7, **IRON, r='#5a2a2a', q='#3e1a1c', R='#260e10', m='#a8b0bc', M='#4e5662',
                            p='#e8eef6', o='#a8b0bc', x='#6c7482', O='#3e4450', Q='#262a32', y='#a8b0bc'), {}

G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '무쇠 대검', '무쇠를 두들겨 편 투박한 대검. 새끼줄 감은 손잡이')
def d01():
    return frame('A'), dict(w='#e4e6e8', b='#b8bcc2', c='#d0d4d8', f='#868a94', B='#8a8e98', n='#50545e',
                            h='#9a9ea8', g='#6a6e78', G='#40444c', j='#c0c4cc', J='#4a4e56',
                            r='#e0d0a8', q='#b8a47c', R='#7e6c4c', m='#c8b48a', M='#6a5a3e',
                            p='#d0d4da', o='#9a9ea8', x='#6a6e78', O='#40444c', Q='#2a2c32'), {}
@make(10, 'B', '산적 두목 대검', '짙은 쇠 날 · 밑동에 붉은 넝마를 감았다 · 검은 쇠 코등이')
def d10():
    return frame('B'), dict(w='#d8dce4', b='#8e96a4', c='#aab2be', f='#5e6674', B='#646c7a', n='#3a404c',
                            h='#6a6e78', g='#44484f', G='#2a2c32', j='#8a8e98', J='#34363c', k='#c83a2a', K='#7a1e16',
                            r='#3e3a3a', q='#2a2626', R='#181414', m='#5a5454', M='#100c0c',
                            p='#a8acb4', o='#6a6e78', x='#44484f', O='#2a2c32', Q='#16181c', y='#c83a2a'), {}
@make(20, 'C', '곰 사냥꾼 대검', '곰도 베는 사냥꾼의 칼. 청동 V 코등이 · 갈색 털가죽 손잡이')
def d20():
    return frame('C'), dict(STEEL7, h='#f0c070', g='#c08a3a', G='#7a5220', j='#ffe0a0', J='#a06a28',
                            r='#9a6a44', q='#6e4628', R='#432a16', m='#b8885a', M='#4e3018',
                            p='#ffe0a0', o='#e0a850', x='#c08a3a', O='#7a5220', Q='#4a3012', y='#7a5220'), {}
@make(30, 'D', '녹슨 처형검', '붉게 녹슨 뭉툭한 날 · 검은 쇠 코등이 · 낡은 가죽')
def d30():
    return frame('D'), dict(w='#f0c8a0', b='#c8885a', c='#d89a6a', f='#8e5232', B='#a05e36', n='#5e3018',
                            h='#6a6460', g='#4a4440', G='#2e2a28', j='#8a827c', J='#3a3432',
                            r='#5a4232', q='#3e2c20', R='#241810', m='#8a6a52', M='#2e2016',
                            p='#a8a29c', o='#6a6460', x='#4a4440', O='#2e2a28', Q='#1a1816', y='#c8885a'), {}
@make(40, 'B', '늑대 가죽 대검', '밑동에 잿빛 늑대 털가죽을 감았다 · 은 코등이 · 은 받이 돌기')
def d40():
    return frame('B'), dict(STEEL7, h='#ffffff', g='#c8d0e0', G='#7a84a0', j='#ffffff', J='#8a94aa', k='#b8bcc4', K='#6a6e78',
                            r='#6a5e54', q='#4a4038', R='#2c2620', m='#c8d0e0', M='#7a84a0',
                            p='#ffffff', o='#c8d0e0', x='#a8b2c6', O='#6a748a', Q='#3e465a', y='#c8d0e0'), {}
@make(50, 'D', '피의 서약 대검', '넓은 홈에 피처럼 붉은 빛이 고였다 · 검은 코등이 붉은 끝 · 붉은 손잡이')
def d50():
    return frame('D'), dict(STEEL7, f='#c82838',
                            h='#5a5462', g='#3a3442', G='#221e28', j='#ff4a4a', J='#a01a24',
                            r='#c8283a', q='#8e1424', R='#560a16', m='#3a3442', M='#16121a',
                            p='#8a7e90', o='#4e4656', x='#3a3442', O='#221e28', Q='#120e16', y='#e0283a'), {}
@make(60, 'A', '화산석 대검', '식은 용암을 깎은 검은 돌 날 · 등줄에 붉은 불빛이 남았다')
def d60():
    fx = {(2, 6): '1', (6, 2): '2', (15, 13): '1', (13, 16): '2'}
    return frame('A'), dict(w='#a89890', b='#4e4444', c='#ff8a2a', f='#ff8a2a', B='#342c2c', n='#5a3a30',
                            h='#5a5050', g='#3a3232', G='#221c1c', j='#ff8a2a', J='#c8401a',
                            r='#3a3030', q='#261e1e', R='#140e0e', m='#5a4a4a', M='#0e0a0a',
                            p='#ffd080', o='#ff8a2a', x='#d0501a', O='#8a2a10', Q='#4a1408',
                            **{'1': '#ff8a2a', '2': '#ffc060'}), dict(fx=fx)
@make(70, 'C', '빙하 거인 대검', '빙하를 깎은 듯한 얼음빛 날 · 은빛 V 코등이 · 푸른 털가죽 손잡이')
def d70():
    return frame('C'), dict(w='#ffffff', b='#d0f0ff', c='#eafaff', f='#7ac4ec', B='#9ad4f4', n='#3a7ab8',
                            h='#ffffff', g='#c0dcf0', G='#7aa0c8', j='#e8fcff', J='#5a88c0',
                            r='#5a7ab0', q='#3e5a8a', R='#22365a', m='#a8c8f0', M='#2a3e68',
                            p='#ffffff', o='#d0f0ff', x='#9ad4f4', O='#4a8ac8', Q='#24507a', y='#7ac4ec'), {}
@make(80, 'A', '흑철 파쇄검', '검은 쇠로 두껍게 벼린 날 · 은빛 날 끝 · 검은 코등이 은 끝')
def d80():
    return frame('A'), dict(w='#f0f4f8', b='#4a4e58', c='#6a6e78', f='#2e3038', B='#2e3038', n='#c8ccd6',
                            h='#5a5664', g='#383440', G='#201e26', j='#e0e6f0', J='#8a94aa',
                            r='#2e2a30', q='#1e1a20', R='#100e12', m='#a8b0bc', M='#4a4e58',
                            p='#c8ccd6', o='#5a5664', x='#383440', O='#201e26', Q='#100e12'), {}
@make(90, 'C', '용의 송곳니 대검', '용 이빨빛 상아 날에 초록 홈 · 초록 V 코등이 금 구슬 · 비늘 손잡이')
def d90():
    return frame('C'), dict(w='#fffcf0', b='#ece8c4', c='#f6f4de', f='#7aa858', B='#c4c49c', n='#6a7a4a',
                            h='#8ae05a', g='#4aa83a', G='#22602a', j='#ffd860', J='#b88a20',
                            r='#5ab848', q='#3a8a30', R='#1e5a1e', m='#a8f070', M='#1a4a1a',
                            p='#fff6c0', o='#ffd860', x='#e8b030', O='#a87018', Q='#6a4410', y='#4aa83a'), {}
@make(100, 'D', '폭군의 대검', '검은 날에 금빛 날 끝 · 금 코등이 · 검붉은 손잡이 금 고리')
def d100():
    return frame('D'), dict(w='#ffe890', b='#3a3440', c='#4e4656', f='#24202a', B='#2e2834', n='#d8a030',
                            h='#fff2a0', g='#f0c040', G='#b08018', j='#fffbd0', J='#c89028',
                            r='#6a1a24', q='#4a1018', R='#2a080e', m='#ffd860', M='#a87018',
                            p='#fffbd0', o='#ffd860', x='#f0c040', O='#b08018', Q='#6a4a10', y='#6a1a24'), {}
@make(110, 'B', '피바람 대검', '핏빛이 번진 날 · 밑동에 검붉은 천 · 붉은 받이 돌기')
def d110():
    return frame('B'), dict(w='#ffe0e0', b='#d89aa0', c='#ecc0c4', f='#a8323e', B='#a8646c', n='#6a2a32',
                            h='#e05a5a', g='#a0303a', G='#5e1820', j='#ff8a8a', J='#7a1a24', k='#7a1a24', K='#3e0a10',
                            r='#5a1a22', q='#3e1016', R='#22080c', m='#c83a4a', M='#2a080c',
                            p='#ffb0b0', o='#c84a54', x='#a0303a', O='#5e1820', Q='#320c10', y='#ff4a4a'), {}
@make(120, 'C', '지옥 대장간 대검', '지옥 불에 벼려 날 끝과 홈이 아직 달아올라 있다 · 불씨 구슬 V 코등이')
def d120():
    fx = {(3, 5): '1', (5, 2): '2', (16, 12): '1', (14, 15): '2', (11, 1): '1'}
    return frame('C'), dict(w='#ffd070', b='#4a3a3a', c='#6a5050', f='#ff6a1a', B='#3a2a2a', n='#ff8a2a',
                            h='#6a5a5a', g='#3e2c2c', G='#241616', j='#ffb040', J='#e0501a',
                            r='#3a2424', q='#2a1818', R='#1a0e0e', m='#ff6a1a', M='#1a0a0a',
                            p='#fff2b0', o='#ffb040', x='#ff7a1a', O='#c8401a', Q='#7a1a0c', y='#ff6a1a',
                            **{'1': '#ff8a2a', '2': '#ffd070'}), dict(fx=fx)
@make(130, 'A', '혈월 대검', '붉은 달빛 날에 은 등줄 · 은 코등이 · 붉은 손잡이')
def d130():
    return frame('A'), dict(w='#ffd0d4', b='#9a2a3a', c='#eef0f6', f='#5a1a26', B='#5e1a28', n='#3e0e18',
                            h='#ffffff', g='#c8d0e0', G='#7a84a0', j='#ffffff', J='#8a94aa',
                            r='#a8283a', q='#781826', R='#4a0c16', m='#e8eef6', M='#5a1a26',
                            p='#ffffff', o='#c8d0e0', x='#a8b2c6', O='#6a748a', Q='#3e465a'), {}
@make(140, 'B', '종말의 대검', '검보랏빛 날 홈에 보랏빛이 타오른다 · 보라 받이 돌기 · 보라 감기')
def d140():
    fx = {(4, 4): '1', (15, 15): '2', (17, 8): '1'}
    return frame('B'), dict(w='#e0c8ff', b='#4a3a6a', c='#6a5a90', f='#a878ff', B='#2e2448', n='#5a4a88',
                            h='#8a6ad8', g='#3e2e5e', G='#22183a', j='#c8a8ff', J='#5a3a9a', k='#7a4ac8', K='#3a1e6a',
                            r='#3a2a5a', q='#26183e', R='#140c22', m='#a878ff', M='#1a1030',
                            p='#e0c8ff', o='#6a5a90', x='#4a3a6a', O='#2e2448', Q='#160f24', y='#a878ff',
                            **{'1': '#c8a8ff', '2': '#a878ff'}), dict(fx=fx)
@make(150, 'D', '피의 군주', '피의 군주의 처형검. 넓은 홈에 핏빛이 타오르고 금 날 끝 · 금 코등이 루비')
def d150():
    fx = {(3, 4): '1', (6, 1): '2', (16, 13): '1', (14, 16): '2', (18, 7): '1'}
    return frame('D', gem=True), dict(w='#ffe890', b='#3a2a30', c='#4e3a42', f='#e0283a', B='#2a1e24', n='#d8a030',
                                      h='#fff2a0', g='#f0c040', G='#b08018', j='#fffbd0', J='#c89028',
                                      z='#ffb0bc', Z='#e0283a', u='#8a1020',
                                      r='#a8182a', q='#7a0e1e', R='#4a0612', m='#ffd860', M='#a87018',
                                      p='#fffbd0', o='#ffd860', x='#f0c040', O='#b08018', Q='#6a4a10', y='#e0283a',
                                      **{'1': '#ff4a4a', '2': '#ffd860'}), dict(fx=fx)

def icon(d):
    s, pal, extra = d['fn']()
    return s, s.icon(pal, fx=extra.get('fx'))
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d.get('lv', d.get('key')), 'sym err', e)
        out.append((ic.render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'gs_frames.png', z=12)
    zoomsheet(out[4:12], 'gs_z1.png', z=9)
    zoomsheet(out[12:], 'gs_z2.png', z=9)
    print(Counter(d['st'] for d in G))
