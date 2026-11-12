"""룬소드 손그림 (2판). 축 x + y = 18."""
from hand import H
def Gd(*rows):
    rows = list(rows)
    return [(r + '.' * 20)[:20] for r in rows] + ['.' * 20] * (20 - len(rows))
R = []
def make(key, name, el, desc):
    def deco(fn): R.append((key, name, el, desc, fn)); return fn
    return deco

@make('fire', '지옥의 업화', '불', '칼날이 통째로 불꽃 — 가운데는 희게 끓고 가장자리는 혀처럼 위로 날름거린다. 그을린 뿔 코등이 · 불씨 자루 끝')
def fire():
    return H(Gd(
        "",
        "................rr",
        ".............rryfr",
        "............rryfydd",
        "...........royfyd.r",
        "..........royfyodr",
        ".........rryfyodr",
        "...H....royfyod",
        "...Hh..royfyd..r",
        "....h.royfyod.r",
        "....hgoyfyod",
        ".....gGyfod..H",
        "......gGod..hH",
        ".....xRGGGgh",
        "....Rx..GGG",
        "...xR",
        "..eR",
        ".eEeE",
        ".EeEE",
        "..EE",
    ), dict(f='#fffbe0', y='#ffd84a', o='#ff8a1a', r='#e8401a', d='#a82010',
            H='#c8b8a0', h='#7a6a5e', g='#3e2a2a', G='#241616', x='#ff6a1a', R='#2a1818',
            e='#ffb040', E='#c8401a', s='#ffd84a', S='#ff8a1a'), fx=Gd(
        "................s.s",
        "..............S",
        "",
        "...........s",
        "",
        "........S",
    ))

@make('ice', '혹한의 결정', '빙결', '얼음 결정을 깎은 날. 면마다 빛이 갈리고 앞으로 비스듬한 얼음 가시가 돋는다. 얼음 가시 코등이 · 결정 자루 끝')
def ice():
    return H(Gd(
        "",
        ".................w",
        "................wB",
        "...........i..wiBn",
        "...........w.wibBn",
        "...........wiibBn.BB",
        "..........wiicBn",
        "........i.wicBBnBB",
        "........wwicBBn",
        ".......wwicBBn",
        ".....i.wicBnBB",
        ".....wgwcBn",
        "....kwjgGBB",
        "...kRggGGGG",
        "..kR.GG",
        ".kR...G",
        "jkR",
        "jJ",
        ".J",
    ), dict(w='#ffffff', i='#d4f6ff', b='#a8e4fc', c='#7ccaf0', B='#4a9ad8', n='#2a5aa0',
            g='#c8f0ff', G='#5aa0e0', j='#e8fcff', J='#7ab8ec', k='#c8f0ff', R='#2a4a7a',
            s='#ffffff', S='#bdeeff'), fx=Gd(
        "",
        "..................s",
        ".................sSs",
        "..................s",
        "",
        "",
        "",
        "",
        "",
        "...s",
        "..sSs",
        "...s",
    ))

@make('light', '광휘의 여명', '빛', '해 뜨는 하늘빛 날 — 밑동은 아침놀 금빛, 끝은 새벽 하늘빛. 떠오르는 해 코등이 · 빛살')
def light():
    return H(Gd(
        "",
        ".................wV",
        "...............wvV",
        ".............wwvvV",
        "............wwvvV",
        "...........wwvvV",
        "..........wwvvV",
        "...a.....wbcBn",
        "...a....wbcBn",
        ".a...hhwbcBn",
        "..a.hggbcBn",
        "....hgjjGn..a",
        "....gjjjgG.a",
        "...kRjjgGG",
        "..kR.gGGG",
        ".pR....a",
        "pjoO....a",
        "ooOO",
        ".OO",
    ), dict(w='#ffffff', b='#fff2d0', c='#ffd890', B='#f0c070', n='#c8902e', v='#e4f2ff', V='#9ec4f0',
            h='#fff8c0', g='#ffd040', G='#e0901a', j='#ff9a3a', a='#fff0a0',
            k='#ffd040', R='#d8ccb0', o='#ffd040', O='#e0901a', p='#fff8c0', s='#ffffff', S='#fff0a0'), fx=Gd(
        "...............s",
        "..................s",
        "",
        "...........s",
        "..........sSs",
        "...........s",
    ))

@make('poison', '극독의 어금니', '독', '독사 아가리에서 뻗은 휜 독니. 가운데 독 홈을 타고 맺힌 독이 끝에서 떨어진다. 뱀 머리 코등이 · 비늘 손잡이 · 꼬리 자루 끝')
def poison():
    return H(Gd(
        "",
        "",
        "................ww",
        "..............wbbBn",
        "............wbcBn.n",
        "...........wbcBBn",
        "..........wbcBBn",
        ".........wbcBBn",
        "...hh...wbcBBn",
        "..hgghwbbcBn",
        "...egghbcBBn",
        "....gGgGBn",
        "....kgGGGt",
        "...kRrGGt",
        "..kR...",
        ".rRk",
        "rkR",
        "Rr",
        ".R",
    ), dict(w='#ffd0ff', b='#d474e4', c='#8aff5a', B='#a040b8', n='#5a1a70',
            h='#a8f070', g='#4aa83a', G='#22602a', e='#ffe040', t='#ffffff', k='#a8f070', r='#4aa83a', R='#22602a',
            v='#8aff5a', V='#3ac02a'), fx=Gd(
        "",
        "",
        "",
        "",
        "",
        "",
        "..................v",
        "..................V",
    ))
