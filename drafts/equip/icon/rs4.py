"""룬소드 4자루 (4판) — 2판(rs2.py)의 날 그림은 그대로 두고, 자루를 다시 짰다.
룬소드 축은 x + y = 18 (2판 날 그대로). 코등이 · 손잡이 · 공이 모두 이 축 위, 코등이 장식은 축 대칭.
  코등이 u −5..−2 둥근 덩이(|v| ≤ 3 · 4 · 4 · 3) · 손잡이 u −10..−6(|v| ≤ 1) · 4×4 공 x 1..4 y 14..17 + 꼭지 (1,17)"""
import g4
g4.AX = 18
from g4 import Sw, UV
from g4d import region
import rs2
from wic import N
LIM = {-2: 3, -3: 4, -4: 4, -5: 3}
BALL4 = [".hl.", "hlmd", "lmdD", ".dD."]
def P(s, part, u, v, ch):
    if (u + v) % 2: return                       # 축 18: u + v는 짝수
    s.put((u + v + 18) // 2, (v - u + 18) // 2, part, ch)
def gbody(u, v): return 'h' if v <= -3 else ('G' if v >= 3 else 'g')
def hilt(s, guard_role, grip_role, ball, nub):
    region(s, 'guard', lambda u, v: u in LIM and abs(v) <= LIM[u], guard_role)
    region(s, 'grip', lambda u, v: -10 <= u <= -6 and abs(v) <= 1, grip_role)
    for j, r in enumerate(BALL4):
        for i, ch in enumerate(r):
            if ch != '.': s.put(1 + i, 14 + j, 'pommel', ball[ch])
    if nub: s.put(1, 17, 'pommel', nub)
def from_v2(key, letters):
    """2판 날 칸만 가져오기 (u ≥ −1, 날 글자만)"""
    fn = {k: f for k, n, e, d, f in rs2.R}[key]
    ic = fn(); s = Sw()
    for (x, y), ch in ic.body.items():
        u, v = UV(x, y)
        if u >= -1 and ch in letters: s.put(x, y, 'blade', ch)
    return s, ic.pal, dict(ic.fx)
def rings(us, a, b):
    return lambda u, v: (a if v <= 0 else b) if u in us else None
R = []
def make(key, name, el, desc):
    def deco(fn): R.append(dict(key=key, name=name, el=el, desc=desc, fn=fn)); return fn
    return deco

@make('fire', '지옥의 업화', '불', '칼날이 통째로 불꽃 — 가운데는 희게 끓고 가장자리는 혀처럼 위로 날름거린다. 그을린 뿔 코등이 · 불씨 공')
def fire():
    s, pal, fx = from_v2('fire', 'royfd')
    hilt(s, gbody,
         lambda u, v: ('x' if v <= 0 else 'X') if u in (-7, -9) else ('R' if v > 0 else 'k'),
         dict(h='P', l='e', m='e', d='E', D='F'), 'g')
    for (u, v, ch) in [(-3, -5, 'g'), (-2, -6, 'h'), (0, -6, 'H'), (-3, 5, 'G'), (-2, 6, 'h'), (0, 6, 'H')]: P(s, 'guard', u, v, ch)
    pal.update(h='#6a5a5a', g='#3e2c2c', G='#241616', H='#d8c8b0', k='#3a2424', R='#1a0e0e', x='#ff6a1a', X='#c83a10',
               P='#fff2b0', e='#ffb040', E='#c8401a', F='#7a1a0c')
    return s, pal, fx

@make('ice', '혹한의 결정', '빙결', '얼음 결정을 깎은 날. 면마다 빛이 갈리고 칼끝 쪽으로 비스듬한 얼음 가시가 돋는다. 얼음 가시 코등이 · 결정 공')
def ice():
    s, pal, fx = from_v2('ice', 'wibcBn')
    hilt(s, lambda u, v: 'w' if v <= -3 else ('G' if v >= 3 else ('j' if u == -2 else 'g')),
         lambda u, v: ('k' if v <= 0 else 'K') if u in (-7, -9) else ('r' if v < 0 else ('R' if v > 0 else 'q')),
         dict(h='w', l='i', m='b', d='B', D='n'), 'c')
    for (u, v, ch) in [(-3, -5, 'w'), (-2, -6, 'i'), (-1, -5, 'w'), (-3, 5, 'B'), (-2, 6, 'n'), (-1, 5, 'B')]: P(s, 'guard', u, v, ch)
    pal.update(g='#c8f0ff', G='#5aa0e0', j='#e8fcff', r='#4a6a9a', q='#2e4a78', R='#1a2c50', k='#d4f6ff', K='#8ac8f0')
    return s, pal, fx

@make('light', '광휘의 여명', '빛', '해 뜨는 하늘빛 날 — 밑동은 아침놀 금빛, 끝은 새벽 하늘빛. 떠오르는 해 코등이 · 빛살')
def light():
    import math
    s, pal, fx = from_v2('light', 'wvVbcBn')
    hilt(s, lambda u, v: None,                       # 코등이 자리는 해로 그린다
         lambda u, v: ('k' if v <= 0 else 'K') if u in (-7, -9) else ('r' if v < 0 else ('R' if v > 0 else 'q')),
         dict(h='p', l='o', m='x', d='O', D='Q'), 'o')
    cx, cy = 7.25, 10.75                              # 해 가운데 (축 위: u −3.5)
    for y in range(N):
        for x in range(N):
            d = math.hypot(x - cx, y - cy)
            if d <= 2.75 and (x, y) not in s.part:
                t = (x - cx) + (y - cy)
                s.put(x, y, 'guard', 'h' if t < -1.5 else ('G' if t > 1.5 else ('j' if d < 1.2 else 'g')))
    for (x, y) in [(4, 7), (3, 6), (11, 14), (12, 15), (7, 6), (7, 5), (12, 11), (13, 11), (3, 10), (2, 10), (8, 15), (8, 16)]:
        s.put(x, y, 'guard', 'a')
    s.put(2, 15, 'pommel', 'j'); s.put(3, 16, 'pommel', 'J')            # 공 가운데 작은 해 (축과 직각)
    pal.update(h='#fff8c0', g='#ffd040', G='#e0901a', j='#ff9a3a', J='#e0601a', a='#fff0a0',
               r='#fffbf0', q='#e8dcc4', R='#c0b090', k='#ffd040', K='#c8902a',
               p='#ffffff', o='#ffe890', x='#ffd040', O='#e0901a', Q='#a85a10')
    return s, pal, fx

@make('poison', '극독의 어금니', '독', '독사 아가리에서 뻗은 휜 독니. 가운데 독 홈을 타고 맺힌 독이 끝에서 떨어진다. 뱀 머리 코등이 · 비늘 손잡이 · 꼬리 공')
def poison():
    s, pal, fx = from_v2('poison', 'wbcBn')
    hilt(s, lambda u, v: 'e' if (u == -3 and abs(v) == 3) else gbody(u, v),
         lambda u, v: 'k' if (u + v) % 4 == 0 else ('r' if v < 0 else ('R' if v > 0 else 'q')),
         dict(h='p', l='o', m='x', d='O', D='Q'), 'k')
    for (u, v, ch) in [(-1, -3, 't'), (-1, 3, 't')]: P(s, 'guard', u, v, ch)      # 송곳니 둘
    pal.update(h='#a8f070', g='#4aa83a', G='#22602a', e='#ffe040', t='#ffffff',
               r='#5ab848', q='#3a8a30', R='#1e5a1e', k='#a8f070',
               p='#d8ffa0', o='#7ad85a', x='#4aa83a', O='#22602a', Q='#123a14')
    return s, pal, fx

def sym_hilt(s):
    """자루(코등이 · 손잡이 · 공) 윤곽이 축 대칭인지"""
    bad = []
    for (x, y), (p, ch) in s.part.items():
        if p == 'blade': continue
        x2, y2 = 18 - y, 18 - x
        q = s.part.get((x2, y2))
        if not q or q[0] == 'blade' and p != 'blade': bad.append((x, y))
    return bad
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in R:
        s, pal, fx = d['fn']()
        print(d['key'], 'hilt sym err:', sym_hilt(s))
        out.append((s.icon(pal, fx=fx).render(), d['name']))
    zoomsheet(out, 'rs4_z.png', z=12)
