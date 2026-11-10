"""룬소드 — 칼마다 속성 하나, 칼 모양에 속성이 들어간다 (색만 바꾸지 않음).
축 x + y = 18, 날 줄 y의 가운데 x = 18 − y."""
from hand import H
def Gd(*rows):
    rows = list(rows)
    return [(r + '.' * 20)[:20] for r in rows] + ['.' * 20] * (20 - len(rows))
def put(g, x, y, ch):
    if 0 <= x < 20 and 0 <= y < 20: g[y][x] = ch
def over(g, rows):
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch == '_': g[y][x] = '.'
            elif ch not in '. ': g[y][x] = ch
def done(g): return [''.join(r) for r in g]
R = []
def make(key, name, el, desc):
    def deco(fn): R.append((key, name, el, desc, fn)); return fn
    return deco

# ───────── 지옥의 업화 (불) ─────────
@make('fire', '지옥의 업화', '불', '칼날이 통째로 불꽃. 날 가운데는 희게 끓고 가장자리는 혀처럼 날름거린다. 검게 그을린 뿔 코등이 · 불씨 자루 끝')
def fire():
    g = [['.'] * 20 for _ in range(20)]
    # (줄, 왼쪽 폭, 오른쪽 폭)
    W = {1: (1, 0), 2: (2, 1), 3: (2, 2), 4: (3, 2), 5: (3, 3), 6: (2, 3), 7: (3, 3), 8: (3, 2), 9: (3, 3), 10: (2, 2), 11: (2, 2)}
    for y, (wl, wr) in W.items():
        cx = 18 - y
        for x in range(cx - wl, cx + wr + 1):
            d = x - cx
            if x == cx - wl: ch = 'r'
            elif x == cx + wr: ch = 'd' if y > 2 else 'r'
            elif d == 0: ch = 'f'
            elif abs(d) == 1: ch = 'y'
            else: ch = 'o'
            put(g, x, y, ch)
    # 불꽃 혀 (위로 날름)
    for (x, y, ch) in [(12, 3, 'r'), (11, 4, 'r'), (9, 6, 'r'), (8, 7, 'r'), (7, 8, 'r'), (18, 4, 'r'), (18, 3, 'd'),
                       (16, 6, 'r'), (17, 5, 'r'), (14, 9, 'r'), (15, 8, 'r'), (13, 2, 'r')]:
        put(g, x, y, ch)
    over(g, Gd(
        "",
        "",
        "",
        "",
        "",
        "",
        "...h",
        "...hg",
        "....hg",
        ".....hg",
        ".....hgx",
        "......GxG",
        ".....kRGGGG",
        "....Rk...GgG",
        "...kR.....Gh",
        "..eR",
        ".eEeE",
        ".EeE",
        "..E",
    ))
    return H(done(g), dict(f='#fffbe0', y='#ffd84a', o='#ff8a1a', r='#e8401a', d='#a82010',
                           h='#6a5050', g='#3e2a2a', G='#241616', x='#ff7a1a', k='#ff5a1a', R='#2a1818',
                           e='#ffb040', E='#c8401a', s='#ffd84a', S='#ff8a1a'),
             fx=Gd(
        "................s.s",
        "..............S",
        "",
        "...........s",
        "",
        "........S",
    ), glow=None)

# ───────── 혹한의 결정 (빙결) ─────────
@make('ice', '혹한의 결정', '빙결', '얼음 결정을 깎은 날. 면마다 빛이 갈리고 날 끝마다 얼음 가시가 돋는다. 얼음 가시 코등이 · 결정 자루 끝')
def ice():
    g = [['.'] * 20 for _ in range(20)]
    for y in range(1, 12):
        cx = 18 - y
        wl, wr = (2, 2) if y > 3 else ((1, 1) if y > 1 else (0, 0))
        for x in range(cx - wl, cx + wr + 1):
            d = x - cx
            # 면: 줄 묶음마다 밝은 면이 바뀐다
            band = (y // 3) % 2
            if x == cx - wl: ch = 'w'
            elif x == cx + wr: ch = 'n'
            elif d <= 0: ch = 'b' if band else 'i'
            else: ch = 'B' if band else 'c'
            put(g, x, y, ch)
    # 얼음 가시: 칼끝 쪽으로 비스듬히
    for (x, y, ch) in [(12, 3, 'w'), (11, 2, 'i'), (9, 6, 'w'), (8, 5, 'i'), (17, 6, 'n'), (18, 5, 'B'), (14, 9, 'n'), (15, 8, 'B'),
                       (6, 9, 'w'), (5, 8, 'i')]:
        put(g, x, y, ch)
    over(g, Gd(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "...h",
        "....hg.",
        ".....hgg",
        "....kRgGGG",
        "...kR..GG.G",
        "..kR....G..G",
        ".pkR",
        "poO",
        ".O",
    ))
    return H(done(g), dict(w='#ffffff', i='#e8fcff', b='#bdeeff', c='#8ad4f4', B='#5aaee0', n='#2a6ab0',
                           h='#ffffff', g='#a8e4ff', G='#4a8ad0', k='#e8fcff', R='#3a5a8a',
                           o='#8ad4f4', O='#3a7ac0', p='#ffffff', s='#ffffff', S='#bdeeff'),
             fx=Gd(
        "...................",
        "..................s",
        ".................sSs",
        "..................s",
        "",
        "",
        "",
        "....s",
    ))

# ───────── 광휘의 여명 (빛) ─────────
@make('light', '광휘의 여명', '빛', '해 뜨는 하늘빛 날 — 밑동은 아침놀 금빛, 끝은 새벽 하늘빛. 떠오르는 해 코등이')
def light():
    g = [['.'] * 20 for _ in range(20)]
    for y in range(1, 11):
        cx = 18 - y
        wl, wr = (2, 2) if y > 2 else ((1, 1) if y > 1 else (0, 1))
        for x in range(cx - wl, cx + wr + 1):
            d = x - cx
            warm = y >= 7
            if x == cx - wl: ch = 'w'
            elif x == cx + wr: ch = 'n' if warm else 'V'
            elif d == 0: ch = 'c' if warm else 'v'
            else: ch = ('b' if d < 0 else 'B') if warm else ('w' if d < 0 else 'v')
            put(g, x, y, ch)
    over(g, Gd(
        "",
        "",
        "",
        "",
        "",
        "",
        "...a",
        "....a.a",
        ".a...hgh",
        "..a.hggga",
        "...hggjgg",
        "....gjjjgG.a",
        "...kRgjgGG",
        "..kR.GGGG.a",
        ".pR....a",
        "pjoO",
        "ooOO",
        ".OO",
    ))
    return H(done(g), dict(w='#ffffff', b='#fff2d0', c='#ffd890', B='#f0c070', n='#c8902e', v='#e4f2ff', V='#9ec4f0',
                           h='#fff8c0', g='#ffd040', G='#e0901a', j='#ff8a3a', a='#fff0a0',
                           k='#ffd040', R='#d8ccb0', o='#ffd040', O='#e0901a', p='#fff8c0', s='#ffffff', S='#fff0a0'),
             fx=Gd(
        "...............s",
        "..................s",
        "",
        "...........s",
        "..........sSs",
        "...........s",
    ), glow=None)

# ───────── 극독의 어금니 (독) ─────────
@make('poison', '극독의 어금니', '독', '독사 아가리에서 뻗은 휜 독니. 날 가운데 독 홈을 타고 독이 맺혀 떨어진다. 뱀 머리 코등이 · 비늘 손잡이')
def poison():
    g = [['.'] * 20 for _ in range(20)]
    # 휜 독니: 밑동 넓고 끝으로 갈수록 그늘 쪽으로 휜다
    W = {2: (0, 0), 3: (1, 0), 4: (1, 1), 5: (2, 1), 6: (2, 2), 7: (2, 2), 8: (3, 2), 9: (3, 2), 10: (3, 3)}
    shift = {2: 1, 3: 1, 4: 1, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0}
    for y, (wl, wr) in W.items():
        cx = 18 - y + shift[y]
        for x in range(cx - wl, cx + wr + 1):
            d = x - cx
            if x == cx - wl: ch = 'w'
            elif x == cx + wr: ch = 'n'
            elif d == 0 and y >= 4: ch = 'c'
            else: ch = 'b' if d < 0 else 'B'
            put(g, x, y, ch)
    over(g, Gd(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "...hhh",
        "..hgge.",
        "...gGgg",
        "....kgGgG",
        "...kRrGG.g",
        "..kR..hgGG",
        ".rR....GG",
        "rkRk",
        "kRr.",
        "Rk",
    ))
    return H(done(g), dict(w='#ffc8ff', b='#d070e0', c='#8aff5a', B='#a040b8', n='#5a1a70',
                           h='#9ae86a', g='#4aa83a', G='#22602a', e='#ffe040', k='#9ae86a', r='#4aa83a', R='#22602a',
                           v='#8aff5a', V='#3ac02a'),
             fx=Gd(
        "",
        "",
        "",
        "...................",
        "..................v",
        "..................V",
    ))
