"""글라디우스 16자루 — 손그림 20×20 (칼끝 오른쪽 위). 날 줄 y의 빛 쪽 끝 x = 16 − y, 축 x + y = 18.
글자: 날 w b c B n · 코등이 h g G · 손잡이 r R k · 자루 끝 o O p · 그 밖은 칼마다."""
from hand import H
def Gd(*rows):
    rows = list(rows)
    return [(r + '.' * 20)[:20] for r in rows] + ['.' * 20] * (20 - len(rows))
STEEL = dict(w='#ffffff', b='#d6dae2', c='#aab0bc', B='#9298a6', n='#62687a')
G = []
def make(lv, name, desc):
    def deco(fn): G.append((lv, name, desc, fn)); return fn
    return deco

@make(1, '나무 연습검', '참나무를 깎은 연습용. 끝이 둥글고 날이 없다')
def g01():
    return H(Gd(
        "",
        "...............bb",
        "..............wbbB",
        ".............wbcBn",
        "............wbBcn",
        "...........wcbBn",
        "..........wbcBn",
        ".........wbBcn",
        "....hg..wcbBn",
        ".....hg..bBn",
        "......hgGn",
        ".....rRhgG",
        "....kr..hG",
        "...rR",
        "..kr",
        ".oRO",
        ".oO",
    ), dict(w='#f4d8a4', b='#d8a868', c='#b8844a', B='#a8743e', n='#6e4624',
            h='#c8945a', g='#9a6a38', G='#64401e', r='#ece0c4', R='#b0a07e', k='#cfc0a0', o='#b07a40', O='#6e4624'))

HILT10 = dict(h='#e8b878', g='#b8823e', G='#7a4c22', r='#6a4024', R='#4a2a16', k='#9a6438', o='#c8924a', O='#8a5a2a', p='#f0c888')
@make(10, '신참 투사검', '쇠 날 · 나무 코등이 · 공 자루 끝. 가장 흔한 투사의 칼')
def g10():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        ".........wbcBn",
        ".....hh.wbcBn",
        ".....hgg.bBn",
        "......ggggn",
        ".....kRgggG",
        "....rR..GG",
        "...kR",
        "..pR",
        ".pooO",
        ".ooOO",
        "..OO",
    ), dict(STEEL, **HILT10))

@make(20, '잘록허리 청동검', '허리가 잘록하고 끝이 길게 빠진 날. 청동 코등이')
def g20():
    return H(Gd(
        "",
        "................w",
        "...............wB",
        "..............wbB",
        "............wbcBn",
        "...........wbcB",
        "..........wbcB",
        ".........wbcB",
        ".....hh.wbcBnn",
        ".....hgg.bBn",
        "......ggggn",
        ".....kRgggG",
        "....rR..GG",
        "...kR",
        "..pR",
        ".pooO",
        ".ooOO",
        "..OO",
    ), dict(STEEL, h='#fff0a0', g='#e0a840', G='#9a6418', r='#3a2a1e', R='#22180f', k='#e0a840', o='#e0a840', O='#9a6418', p='#fff0a0'))

@make(30, '뼈자루 검', '짐승 뼈를 깎아 맞춘 코등이와 등뼈 마디 손잡이')
def g30():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        ".........wbcBn",
        "....hh..wbcBn",
        "....hgg..bBn",
        ".....gGgg.n",
        "......kgGgh",
        ".....rk.hgG",
        "....Rr...GG",
        "...kR",
        "..pr",
        ".ppoO",
        ".poOO",
        "..OO",
    ), dict(STEEL, b='#ccd0d8', c='#a0a6b2', h='#fffbe8', g='#e4dabc', G='#a89a78', r='#f4ecd4', R='#b8ac8c', k='#7a6e58',
            o='#e8dcc0', O='#a89a78', p='#ffffff'))

@make(40, '투견의 송곳니', '짐승 이빨처럼 휜 상아빛 날. 가시 박힌 개 목줄 코등이')
def g40():
    return H(Gd(
        "",
        ".................w",
        "...............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        "....s....wbcBn",
        ".....hh.wbcBn",
        "...shgg.bBn",
        "......ggggn",
        ".....kRgggGs",
        "....rR..GG",
        "...kR....s",
        "..pR",
        ".pooO",
        ".ooOO",
        "..OO",
    ), dict(w='#fffbe8', b='#f0e4c4', c='#dccca4', B='#c8b48c', n='#8a7a5a',
            h='#6a4a3a', g='#4a3226', G='#2e1e16', s='#e8ecf4', r='#5a3a2a', R='#3a2418', k='#7a5a44',
            o='#9aa0ac', O='#5e6472', p='#e8ecf4'))

@make(50, '붉은 모래검', '모래빛 날 · 붉은 천 손잡이. 코등이에 붉은 술이 달렸다')
def g50():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        ".........wbcBn",
        ".....hh.wbcBn",
        ".....hgg.bBn",
        "......ggggn",
        ".....kRgggG",
        "....rR..GGy",
        "...kR.....y",
        "..pR.....utT",
        ".pooO....ttT",
        ".ooOO....t.T",
        "..OO",
    ), dict(w='#fff8e8', b='#ecdcc4', c='#ccb89c', B='#b8a48a', n='#7a6a58',
            h='#f0d8a8', g='#d0b078', G='#9a7a48', r='#d04232', R='#7a1e16', k='#ff6a4a',
            o='#d0b078', O='#9a7a48', p='#f0d8a8', t='#e04a3a', T='#9a2018', u='#ff9a7a', y='#e0b060'))

@make(60, '검붉은 투혼', '검게 그을린 날에 붉은 불길이 선다. 붉은 보석 코등이')
def g60():
    ic = H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        ".........wbcBn",
        ".....hh.wbcBn",
        ".....hjg.bBn",
        "......gJgGn",
        ".....kRgGGG",
        "....rR..GG",
        "...kR",
        "..pR",
        ".pooO",
        ".ooOO",
        "..OO",
    ), dict(w='#ffb090', b='#5a3438', c='#3e1e24', B='#4a262c', n='#d0342e',
            h='#5a5260', g='#3a3440', G='#24202a', j='#ff4a3a', J='#a01818', r='#4a2a2e', R='#2a161a', k='#8a2a2a',
            o='#3a3440', O='#24202a', p='#ff5a4a', e='#ff5a3a', E='#ffb040'), fx=Gd(
        "..................e",
        "",
        "...............e",
        "",
        "..................E",
        "",
        ".........e",
        "",
        "...............E",
    ))
    return ic

@make(70, '사자갈기 검', '황금 갈기 코등이 · 사자 머리 자루 끝 · 금빛 홈')
def g70():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        "....m.m..wbcBn",
        "...mhhhmwbcBn",
        "..mhggg.bBn",
        "...mgggggn",
        "....mkRgggGm",
        "....rRmGGGG",
        "...kR..mGm",
        "..mR....m",
        ".mppm",
        "mpeoem",
        ".mooOm",
        "..mOm",
        "...m",
    ), dict(w='#ffffff', b='#d6dae2', c='#e0b040', B='#9298a6', n='#62687a',
            h='#fff0a0', g='#f0b830', G='#b07818', m='#d8781c', r='#8a3a1e', R='#5a2210', k='#b05a2a',
            o='#f0b830', O='#b07818', p='#fff0a0', e='#4a1e08'))

@make(80, '사슬 감은 검', '이 빠진 날 · 손잡이를 감고 늘어진 쇠사슬')
def g80():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        ".............bcBn",
        "...........wbcBn",
        "..........wbcBn",
        "..........bcBn",
        ".....hh.wbcBn",
        ".....hgg.bBn",
        "......ggggn",
        ".....lLgggG",
        "....Ll..GGl",
        "...lL.....L",
        "..pL.......l",
        ".pooO.....L",
        ".ooOO......l",
        "..OO......L",
        "..........GG",
    ), dict(w='#e8ecf0', b='#c4c8d0', c='#9aa0aa', B='#868c98', n='#545a66',
            h='#6e727c', g='#4e525c', G='#32363e', l='#f0f4fa', L='#8a8e98',
            o='#5e626c', O='#3a3e46', p='#8a8e98'))

@make(90, '황금 투구 검', '자루 끝이 붉은 깃 달린 투사 투구. 금 코등이')
def g90():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        ".........wbcBn",
        ".....hh.wbcBn",
        ".....hgg.bBn",
        "......ggggn",
        ".....kRgggG",
        "....rR..GG",
        "...kR",
        "..ppR",
        ".xpoO",
        "XxvoO",
        ".XOO",
        "..X",
    ), dict(w='#ffffff', b='#d6dae2', c='#f0c040', B='#9298a6', n='#62687a',
            h='#fff0a0', g='#f0c040', G='#b08018', r='#4a3a7a', R='#2a2050', k='#7a6ab0',
            o='#f0c040', O='#b08018', p='#fff0a0', v='#3a2a10', x='#ff4a4a', X='#a01818'))

@make(100, '월계 챔피언검', '우승자에게 내리는 칼. 월계 잎 코등이 · 흰 손잡이')
def g100():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        "....l....wbcBn",
        "...lLl..wbcBn",
        "....LlhhbBn",
        ".....hgggn",
        ".....kRgGGl",
        "....rR.GlLl",
        "...kR....L",
        "..pR",
        ".pooO",
        ".ooOO",
        "..OO",
    ), dict(w='#ffffff', b='#e8ecf4', c='#c4cad6', B='#a4acbc', n='#6a7284',
            h='#fff0a0', g='#f0c040', G='#b08018', l='#9ae860', L='#3a8a2a', r='#f4f0e4', R='#b8b0a0', k='#f0c040',
            o='#f0c040', O='#b08018', p='#fff0a0'))

@make(110, '핏빛 개선검', '승리 행진의 칼. 붉은 홈 · 코등이에 묶은 붉은 띠')
def g110():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbcBn",
        ".........wbcBn",
        "..yx.hh.wbcBn",
        ".xXXxhgg.bBn",
        "x..yXxggggn",
        "....XkRgggG",
        "...XxR..GG",
        "..X.kR",
        "...pR",
        ".pooO",
        ".ooOO",
        "..OO",
    ), dict(w='#ffffff', b='#d6dae2', c='#c83a3a', B='#9298a6', n='#62687a',
            h='#d8c070', g='#a88a3a', G='#6a5418', r='#8a1a2a', R='#5a0e1a', k='#c83a4a',
            o='#a88a3a', O='#6a5418', p='#d8c070', x='#e83a4a', X='#9a1a2a', y='#ff9aa8'))

@make(120, '번개 투사검', '푸른 쇠 날에 번개 무늬가 흐른다. 번개 꼴 코등이')
def g120():
    return H(Gd(
        "",
        "................w",
        "..............wzB",
        ".............wbcBn",
        "............wcbBn",
        "...........wbcBn",
        "..........wbBcn",
        ".........wbcBn",
        ".....hh.wcbBn",
        "....hgg..bBn",
        "......gGgGn",
        ".....kRgGhG",
        "....rR..hG",
        "...kR",
        "..pR",
        ".pooO",
        ".ooOO",
        "..OO",
    ), dict(w='#d8e8ff', b='#5a6a8a', c='#ffe84a', z='#fffbd0', B='#3e4a66', n='#2a3248',
            h='#ffe84a', g='#d0a020', G='#8a6a10', r='#3a4a6a', R='#22304a', k='#ffe84a',
            o='#ffe84a', O='#c09018', p='#fffbd0', s='#ffffff', S='#ffe84a'), fx=Gd(
        "..................s",
        "...............S",
        "",
        "",
        "................S",
    ))

@make(130, '흑요석 검', '검은 유리를 쪼아 만든 날. 들쭉날쭉한 날 끝 · 돌 코등이')
def g130():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        "............wwbcBn",
        "............bcBn",
        "..........wwbcBn",
        "..........bcBnn",
        "........wwbcBn",
        ".....hh..bcBn",
        ".....hgg.bBn",
        "......ggggn",
        ".....kRgggG",
        "....rR..GG",
        "...kR",
        "..pR",
        ".poO",
        "pooO",
        ".OO",
    ), dict(w='#c8a8ff', b='#4a3a6a', c='#2e2442', B='#241a34', n='#3a2a56',
            h='#a8a49c', g='#7a766e', G='#4e4a44', r='#7a5032', R='#4a2e1a', k='#9a6a42',
            o='#3a2e52', O='#1e1630', p='#9a7aea'))

@make(140, '별빛 투기장검', '밤하늘 빛 날에 별이 박혔다. 초승달 코등이 · 별 자루 끝')
def g140():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbsBn",
        "............wbcBn",
        "...........wbcBn",
        "..........wbSBn",
        ".........wbcBn",
        "....h...wbcBn",
        "....hg...bBn",
        ".....hggGn",
        ".....kRgGG",
        "....rR..G",
        "...kR",
        "..pR",
        "..o",
        ".ooO",
        "..O",
    ), dict(w='#c8e0ff', b='#3a4a9a', c='#2a3478', B='#22286a', n='#141848', s='#ffffff', S='#ffe890',
            h='#ffffff', g='#c8d0e0', G='#7a84a0', r='#2a2a5a', R='#16163a', k='#c8d0e0',
            o='#ffe890', O='#c8a040', p='#ffffff', t='#ffffff'), fx=Gd(
        "",
        "",
        "..................t",
        "",
        "",
        ".......t",
        "",
        "..............t",
    ))

@make(150, '불멸의 투기왕', '투기장 왕좌의 칼. 금빛 날개 코등이 · 왕관 자루 끝 · 빛이 감돈다')
def g150():
    return H(Gd(
        "",
        "................w",
        "..............wbB",
        ".............wbcBn",
        "............wbcBn",
        "...........wbcBn",
        "..f.......wbcBn",
        "..fF.....wbcBn",
        "...fFhh.wbcBn",
        "..ffFhjg.bBn",
        "....FFggggn",
        ".....kRgggGFF",
        "....rR..GGFFf",
        "...kR.....FFf",
        "..pR........f",
        ".pjoO",
        ".pooO",
        ".pOO",
    ), dict(w='#ffffff', b='#fff8e0', c='#ffe8a8', B='#f0d488', n='#c09838',
            h='#fff0a0', g='#f0c040', G='#b08018', j='#ff4a5a', f='#ffffff', F='#e8dcc0',
            r='#f8f4ea', R='#c8bea8', k='#f0c040', o='#f0c040', O='#b08018', p='#fff0a0', s='#ffffff'),
        fx=Gd(
        "..................s",
        "",
        "",
        ".s",
        "",
        "",
        "...............s",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ".............s",
    ))
