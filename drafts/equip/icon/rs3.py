"""룬소드 4자루 (3판) — 글라디우스와 같은 줄 맞춤: 손잡이 · 공은 축 x + y = 19 위, 코등이는 축 대칭.
날만 속성 모양(불꽃 혀 · 얼음 가시 · 휜 독니)이라 일부러 비대칭일 수 있다.
글자: 날은 칼마다 · 코등이 h g G (+ 칼마다) · 손잡이 r q R k · 공 p o x O Q y · 효과 1 2 3"""
import math
from g4d import Sw, region, guard, grip, pommel, OVAL, edge_of
from g4 import UV
from wic import N
BALL = dict(h='p', l='o', m='x', d='O', D='Q')
def gbody(u, v): return 'h' if v <= -3 else ('G' if v >= 3 else 'g')
def P(s, part, u, v, ch):
    """칸 좌표로 한 칸 (홀짝이 안 맞으면 무시)"""
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
R = []
def make(key, name, el, desc):
    def deco(fn): R.append(dict(key=key, name=name, el=el, desc=desc, fn=fn)); return fn
    return deco

@make('fire', '지옥의 업화', '불', '칼날이 통째로 불꽃 — 가운데는 희게 끓고 가장자리는 혀처럼 날름거린다. 그을린 뿔 코등이 · 불씨 공')
def fire():
    s = Sw()
    def hw(u):
        if u <= 9: return 3
        return max(0, 3 - (u - 9) * 0.42)
    def role(u, v, h):
        a = abs(v)
        if a == 0: return 'f'
        if a == 1: return 'Y'
        if a == 2: return 'A'
        return 'E' if v < 0 else 'D'
    region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: role(u, v, hw(u)))
    # 불꽃 혀: 빛 쪽(왼쪽 위)으로 길게, 그늘 쪽은 칼끝 쪽으로 말려 짧게
    for (u, v) in [(3, -4), (2, -5), (8, -4), (7, -5), (13, -2), (12, -3), (14, -3)]: P(s, 'blade', u, v, 'E')
    for (u, v) in [(5, 4), (6, 5), (11, 4), (12, 3)]: P(s, 'blade', u, v, 'D')
    guard(s, lambda u, v: gbody(u, v))
    # 뿔: 코등이 두 끝에서 칼끝 쪽으로 휘어 (축 대칭)
    for (u, v, ch) in [(-2, -5, 'g'), (-1, -6, 'h'), (1, -6, 'H'), (-2, 5, 'G'), (-1, 6, 'h'), (1, 6, 'H')]: P(s, 'guard', u, v, ch)
    grip(s, lambda u, v: ('k' if v <= 0 else 'K') if u in (-6, -8) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    pommel(s, BALL, nub='y')
    fx = {(16, 0): '1', (13, 1): '2', (18, 5): '1', (9, 3): '2'}
    return s, dict(f='#fffbe0', Y='#ffd84a', A='#ff8a1a', E='#e8401a', D='#a82010',
                   h='#6a5a5a', g='#3e2c2c', G='#241616', H='#d8c8b0',
                   r='#3a2424', q='#2a1818', R='#1a0e0e', k='#ff6a1a', K='#c83a10',
                   p='#fff2b0', o='#ffb040', x='#ff7a1a', O='#c8401a', Q='#7a1a0c', y='#3e2c2c',
                   **{'1': '#ffd84a', '2': '#ff8a1a'}), fx

@make('ice', '혹한의 결정', '빙결', '얼음 결정을 깎은 날. 면마다 빛이 갈리고 칼끝 쪽으로 비스듬한 얼음 가시가 돋는다. 얼음 가시 코등이 · 결정 공')
def ice():
    s = Sw()
    hw = lambda u: min(2, (17 - u) / 3)
    def role(u, v, h):
        e = edge_of(v, h)
        lightface = (u // 4) % 2 == 0          # 면: 네 칸마다 밝은 면이 바뀐다
        if v < 0: return 'w' if e else ('i' if lightface else 'b')
        if v > 0: return 'n' if e else ('c' if lightface else 'B')
        return 'i' if lightface else 'c'
    region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: role(u, v, hw(u)))
    # 얼음 가시 (칼끝 쪽으로 비스듬히): 빛 쪽 · 그늘 쪽 엇갈려
    for (u, v, ch) in [(4, -3, 'w'), (5, -4, 'i'), (10, -3, 'w'), (11, -4, 'i'),
                       (6, 3, 'B'), (7, 4, 'n'), (12, 3, 'B'), (13, 4, 'n')]: P(s, 'blade', u, v, ch)
    guard(s, lambda u, v: gbody(u, v))
    # 코등이 두 끝 얼음 가시 (축 대칭)
    for (u, v, ch) in [(-2, -5, 'h'), (-1, -6, 'w'), (-2, 5, 'G'), (-1, 6, 'B'), (0, -5, 'i'), (0, 5, 'c')]: P(s, 'guard', u, v, ch)
    grip(s, lambda u, v: ('k' if v <= 0 else 'K') if u in (-6, -8) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    pommel(s, BALL, nub='y')
    fx = {(17, 3): '1', (16, 3): '2', (18, 3): '2', (17, 2): '2', (17, 4): '2', (4, 6): '1'}
    return s, dict(w='#ffffff', i='#d4f6ff', b='#a8e4fc', c='#7ccaf0', B='#4a9ad8', n='#2a5aa0',
                   h='#e8faff', g='#a8e0fa', G='#4a8ad0',
                   r='#3a5a8a', q='#2a4270', R='#1a2a4a', k='#d4f6ff', K='#8ac8f0',
                   p='#ffffff', o='#c8f0ff', x='#7ccaf0', O='#3a7ac0', Q='#1e4a8a', y='#a8e4fc',
                   **{'1': '#ffffff', '2': '#bdeeff'}), fx

@make('light', '광휘의 여명', '빛', '해 뜨는 하늘빛 날 — 밑동은 아침놀 금빛, 끝은 새벽 하늘빛. 떠오르는 해 코등이 · 빛살')
def light():
    s = Sw()
    hw = lambda u: min(2, (17 - u) / 2)
    def role(u, v, h):
        e = edge_of(v, h)
        warm = u <= 5; mid = 6 <= u <= 9
        if v < 0: return 'w' if e else ('b' if warm else ('m' if mid else 'v'))
        if v > 0: return ('n' if warm else 'V') if e else ('B' if warm else ('M' if mid else 'V'))
        return 'c' if warm else ('w' if not mid else 'm')
    region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: role(u, v, hw(u)))
    # 떠오르는 해: 날 밑동 뒤 둥근 해 (가운데 (8.5, 10.5) = 축 위) + 빛살 (축 대칭)
    cx, cy = 8.5, 10.5
    for y in range(N):
        for x in range(N):
            d = math.hypot(x - cx, y - cy)
            if d <= 3.0 and (x, y) not in s.part:
                t = (x - cx) + (y - cy)
                s.put(x, y, 'guard', 'h' if t < -1.6 else ('G' if t > 1.6 else ('j' if d < 1.3 else 'g')))
    for (x, y) in [(4, 7), (5, 6), (12, 14), (13, 15), (8, 5), (8, 4), (14, 11), (15, 11), (3, 10), (2, 10), (9, 16), (9, 17)]:
        s.put(x, y, 'guard', 'a')
    grip(s, lambda u, v: ('k' if v <= 0 else 'K') if u in (-6, -8) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    pommel(s, BALL, nub='y')
    s.put(3, 15, 'pommel', 'j'); s.put(4, 16, 'pommel', 'J')            # 공 가운데 작은 해
    fx = {(14, 0): '1', (18, 4): '2', (11, 2): '1', (2, 4): '2'}
    return s, dict(w='#ffffff', b='#fff2d0', c='#ffe0a0', B='#f0c070', n='#c8902e', m='#fff4e8', M='#f0d4b4',
                   v='#e4f2ff', V='#9ec4f0',
                   h='#fff8c0', g='#ffd040', G='#e0901a', j='#ff9a3a', J='#e0601a', a='#fff0a0',
                   r='#fffbf0', q='#e8dcc4', R='#c0b090', k='#ffd040', K='#c8902a',
                   p='#ffffff', o='#ffe890', x='#ffd040', O='#e0901a', Q='#a85a10', y='#ffd040',
                   **{'1': '#ffffff', '2': '#fff0a0'}), fx

@make('poison', '극독의 어금니', '독', '독사 아가리에서 뻗은 휜 독니. 가운데 독 홈을 타고 맺힌 독이 끝에서 떨어진다. 뱀 머리 코등이 · 비늘 손잡이 · 꼬리 공')
def poison():
    s = Sw()
    # 휜 독니: 밑동이 넓고, 끝으로 갈수록 그늘 쪽(v +)으로 휜다
    def c(u): return 0 if u <= 10 else (u - 10) * 0.45
    def hw(u):
        if u <= 6: return 2.6
        return max(0, 2.6 - (u - 6) * 0.24)
    def test(u, v): return 0 <= u <= 17 and abs(v - c(u)) <= hw(u) + 1e-6
    def role(u, v):
        h = hw(u); d = v - c(u)
        if abs(d) < 0.6 and 1 <= u <= 13: return 'c'
        if d <= -h + 0.9: return 'w'
        if d >= h - 0.9: return 'n'
        return 'b' if d < 0 else 'B'
    region(s, 'blade', test, role)
    # 뱀 머리 코등이: 축 대칭 (눈 둘 · 송곳니 둘)
    guard(s, lambda u, v: 'e' if (u == -2 and abs(v) == 3) else gbody(u, v))
    for (u, v, ch) in [(0, -3, 't'), (0, 3, 't')]: P(s, 'guard', u, v, ch)
    def sc(u, v):                                   # 비늘 무늬
        if (u + 2 * v) % 4 == 0: return 'k'
        return 'r' if v < 0 else ('R' if v > 0 else 'q')
    grip(s, sc)
    pommel(s, BALL, nub='y')
    fx = {(18, 7): '1', (18, 8): '2'}
    return s, dict(w='#ffd0ff', b='#d474e4', c='#8aff5a', B='#a040b8', n='#5a1a70',
                   h='#a8f070', g='#4aa83a', G='#22602a', e='#ffe040', t='#ffffff',
                   r='#5ab848', q='#3a8a30', R='#1e5a1e', k='#a8f070',
                   p='#d8ffa0', o='#7ad85a', x='#4aa83a', O='#22602a', Q='#123a14', y='#a8f070',
                   **{'1': '#8aff5a', '2': '#3ac02a'}), fx

if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in R:
        s, pal, fx = d['fn']()
        out.append((s.icon(pal, fx=fx).render(), d['name']))
    zoomsheet(out, 'rs3_z.png', z=12)
