"""스킬 아이콘 시안: 12×12 물건(2배 굵은 픽셀) + 6×6 덧그림(오른쪽 위) + 속성 팔레트.
'1','2','3' = 속성 색(밝음·중간·어둠), 나머지는 고정 색. '.' = 빈칸."""
FIX = {
    'k': '#1a1414', 'w': '#ffffff', 'm': '#d0d8e4', 'M': '#8a94a8', 'n': '#4a5266',
    't': '#a8743e', 'T': '#6a4422', 'y': '#ffd84a', 'Y': '#b08a1c', 's': '#f0c090', 'S': '#c08a5a',
    'r': '#e04040', 'R': '#8a1818', 'g': '#6ad04a', 'G': '#2a7a2a', 'p': '#b070ff', 'P': '#5a2a9a',
    'b': '#4a8aff', 'B': '#20408a', 'c': '#8ae8ff', 'o': '#ff8a2a', 'e': '#ece4cc', 'E': '#b0a080',
    'l': '#b07a48', 'L': '#6a4024', 'f': '#b8b8c0', 'F': '#6a6a74', 'h': '#ffe8a0', 'q': '#3a2a4a',
}
PAL = {   # 속성 팔레트: 1 밝음 · 2 중간 · 3 어둠
    'none': ('#f0f4f8', '#b8c4d4', '#6a7488'), 'fire': ('#fff0a0', '#ff8a2a', '#c03a1a'), 'blaze': ('#ffe080', '#ff4a1a', '#8a1a0a'),
    'ice': ('#f0fcff', '#8ae8ff', '#3a8ad0'), 'water': ('#c8e8ff', '#4a9aff', '#1a4a9a'), 'wind': ('#e0fff0', '#7ae0b0', '#2a8a6a'),
    'storm': ('#d0fff8', '#3ad0c0', '#1a6a7a'), 'earth': ('#e8c898', '#a87a4a', '#5a3a1a'), 'thunder': ('#fffcc0', '#ffd84a', '#b08a1c'),
    'steel': ('#ffffff', '#c8d0dc', '#7a8496'), 'holy': ('#fffbe0', '#ffe070', '#c8a030'), 'light': ('#ffffff', '#fff4b0', '#e0c050'),
    'dark': ('#d8b8ff', '#8a5ad8', '#3a1a6a'), 'evil': ('#ffa0b0', '#c02a4a', '#5a0a2a'), 'heal': ('#d8ffd8', '#5ae070', '#1a8a3a'),
    'poison': ('#d8ff90', '#8ad030', '#3a6a10'), 'blood': ('#ff9a9a', '#d02a2a', '#6a0a0a'), 'arcane': ('#ece4ff', '#9a7aff', '#4a2aa8'),
    'music': ('#ffe0f0', '#ff8ad0', '#a83a8a'),
    'gold': ('#fff4a0', '#ffd040', '#a87a10'), 'shadow': ('#b8b8d8', '#6a6a8a', '#2a2a40'), 'wood': ('#e0b070', '#a8743e', '#6a4422'),
}
OBJ = {
'hammer': """
..kkkkkkkk..
.k11111112k.
.k12222223k.
.k22223333k.
..kkkTtkkk..
....kTtk....
....kTtk....
....kTtk....
....kTtk....
....kLLk....
....kLLk....
.....kk.....""",
'sword': """
.........kk.
........k1k.
.......k12k.
......k12k..
.....k12k...
....k12k....
.k.k12k.....
.kkk2k......
..kYYk......
.kTkkYk.....
kTk..kk.....
kk..........""",
'dagger': """
............
.........kk.
........k1k.
.......k12k.
......k12k..
.....k12k...
..k.k12k....
..kkk2k.....
...kYYk.....
..kLkkYk....
..kk..kk....
............""",
'spear': """
.........kk.
........k11k
........k12k
.......k23k.
......kTkk..
.....kTk....
....kTk.....
...kTk......
..kTk.......
.kTk........
kTk.........
kk..........""",
'spearDown': """
....kkkk....
....kTTk....
....kTTk....
....kTTk....
...kkYYkk...
..k111111k..
..k112222k..
...k1223k...
...k1223k...
....k23k....
....k23k....
.....kk.....""",
'shield': """
.kkkkkkkkkk.
k1111222223k
k1122222233k
k1222yy2233k
k122yyyy233k
k1222yy2233k
.k22222233k.
.k22222333k.
..k223333k..
...k2333k...
....k33k....
.....kk.....""",
'tower': """
.kkkkkkkkkk.
k1m1m1m1m1Mk
kmmmmmmmmmMk
kmMMMMMMMMMk
kmMnnnnnnMMk
kmMn1111nMMk
kmMn1221nMMk
kmMn1221nMMk
kmMnnnnnnMMk
kmMMMMMMMMMk
kmmmmmmmmmMk
.kkkkkkkkkk.""",
'axe': """
..kkk.......
.k111k......
k11222k.....
k12222kkk...
k1222kTTk...
.k22kTTk....
..kkTTk.....
...kTTk.....
..kTTk......
.kTTk.......
.kLk........
..k.........""",
'arc': """
............
............
...kkkkkk...
.kk111111kk.
k1122222211k
k12kkkkkk21k
k2k......k2k
kk........kk
............
..k......k..
.kyk....kyk.
..k......k..""",
'face': """
..kkkkkkkk..
.kssssssssk.
kssssssssssk
kskksssskksk
kssssssssssk
ksskkkkkkssk
kssk1111kssk
kssk1rr1kssk
kssk1111kssk
.kssskkksssk
..kssssssk..
...kkkkkk...""",
'lute': """
.........kk.
........kyyk
.......kTTk.
......kTTk..
..kkkkTTk...
.k1111kk....
k1112211k...
k112kk21k...
k112kk22k...
k1122223k...
.k12233k....
..kkkkk.....""",
'moon': """
....kkkk....
..kk111k....
.k1111k.....
k1112k......
k1122k......
k1122k......
k1122k......
k1112k......
.k1122k.....
..k11222kk..
...kk2222k..
.....kkkk...""",
'harp': """
.kk.........
k11k........
k1k1kkkk....
k1kkT.T.kk..
k1k.T.T.T1k.
k1k.T.T.T1k.
k1k.T.T.T1k.
k1k.T.T.T1k.
k1k.T.T.T1k.
k1kkkkkkk1k.
k11111111k..
.kkkkkkkk...""",
'drum': """
............
..kkkkkkkk..
.k11111111k.
k1111111111k
kk11111111kk
krkkkkkkkkrk
krrRrRrRrRrk
krRrRrRrRrrk
krrRrRrRrRrk
.krrrrrrrrk.
..kkkkkkkk..
............""",
'horn': """
..........k.
.........k1k
........k12k
.......k12k.
..kkkkk12k..
.k1111122k..
k122222223k.
k123kkk223k.
k23k...k3k..
.kk.....k...
............
............""",
'notes': """
....kkkkkkk.
....k11111k.
....k1kkk1k.
....k1k.k1k.
....k1k.k1k.
....k1k.k1k.
..kkk1kkk1k.
.k2221k2221k
.k2222k2222k
..k22k.k22k.
...kk...kk..
............""",
'bell': """
.....kk.....
....kYYk....
...k1111k...
..k112222k..
..k122223k..
..k122223k..
.k1122223k..
.k12222233k.
k1222222333k
kkkkkkkkkkkk
....kYYk....
.....kk.....""",
'scroll': """
.kkkkkkkkk..
kTeeeeeeeTk.
kTkkkkkkkTk.
.keeeeeeek..
.ke1e1e1ek..
.keeeeeeek..
.ke1e1e1ek..
.keeeeeeek..
.ke1e1eeek..
kTkkkkkkkTk.
kTeeeeeeeTk.
.kkkkkkkkk..""",
'baton': """
...........k
..........kw
.........k1k
........k1k.
.......k1k..
......k1k...
.....k1k....
....kyk.....
...kYYk.....
..kYYk......
..kkk.......
............""",
'skull': """
..kkkkkkkk..
.keeeeeeeek.
keeeeeeeeeek
keekkeekkeek
kek11eek11ek
keekkeekkeek
keeeeEEeeeek
.keeeEEeeek.
..kekekeke..
..keEeEeEk..
...kkkkkk...
............""",
'cloud': """
............
....kkkk....
...k1111k...
.kkk11111kk.
k1111111111k
k1122222211k
k1222222221k
k2222233322k
.k23333333k.
..kkkkkkkk..
............
............""",
'vial': """
....kkkk....
....kTTk....
....kmmk....
...kmmmmk...
..kmm11mmk..
..km1112mk..
.km112222mk.
.km122223mk.
.km122233mk.
.km223333mk.
..kmmmmmmk..
...kkkkkk...""",
'mask': """
............
.kkkkkkkkkk.
k3322222233k
k3kk2222kk3k
k3kwk22kwk3k
k3kkk22kkk3k
k3322222233k
.k32222223k.
..k322223k..
...k3223k...
....kkkk....
............""",
'twin': """
..kkkk......
.k3333k.....
k333333k....
k3w33w3k....
k33333kkkk..
k3333k1112k.
k333k111222k
k333k1w22w2k
.kkkk122222k
....k222222k
....k223333k
....kkkkkkkk""",
'boot': """
.kkkkkk.....
.keeeeek....
.k11112k....
.k11122k....
.k11122k....
.k111222kkk.
.k111222222k
.k122222222k
.kkkkkkkkkkk
.k333333333k
.kkkkkkkkkkk
............""",
'tornado': """
k1111111111k
.k22222222k.
..k111111k..
...k2222k...
..k11111k...
...k222k....
....k111k...
...k22k.....
....k11k....
.....k2k....
....k1k.....
.....k......""",
'scythe': """
..kkkkkkk...
.k111111kk..
k122kkkk11k.
k12k....kTk.
.kk.....kTk.
........kTk.
.......kTk..
.......kTk..
......kTk...
......kTk...
.....kLLk...
......kk....""",
'eclipse': """
....kkkk....
..kk2222kk..
.k21qqqq12k.
.k1qqqqqq1k.
k2qqqqqqqq2k
k1qqqqqqqq1k
k1qqqqqqqq1k
k2qqqqqqqq2k
.k1qqqqqq1k.
.k21qqqq12k.
..kk2222kk..
....kkkk....""",
'wing': """
............
kk..........
k1kk........
k111kk......
k11111kk....
k1111111kkk.
k1111111111k
k2222222222k
.k22k222k22k
.k2k.k2k.k2k
..k...k...k.
............""",
'dragon': """
.kk.....kk..
k22k...k22k.
.k2kkkkk2k..
..k22222k...
.k2222222k..
k22kk22kk2k.
k22ky22yk2k.
k222222222kk
k2223333322k
.k23kkkkk3k.
..kwk.k.kwk.
..kk.....kk.""",
'scale': """
....kkkk....
..kk1111kk..
.k11k22k11k.
.k1k2222k1k.
k1k2k11k2k1k
k1k2k12k2k1k
kk2k1222k2kk
k2k1k22k1k2k
.k2k1kk1k2k.
.kk2k22k2kk.
...kk22kk...
.....kk.....""",
'drop': """
.....kk.....
....k11k....
....k12k....
...k1122k...
...k1122k...
..k112222k..
..k122222k..
.k12222223k.
.k12222233k.
.k22223333k.
..k233333k..
...kkkkkk...""",
'orb': """
....kkkk....
..kk1111kk..
.k11w11112k.
.k1ww11122k.
k111112222k.
k111122222k.
k112222223k.
k122222233k.
.k22222333k.
.k22333333k.
..kk3333kk..
....kkkk....""",
'icicle': """
.........kk.
........k11k
.......k112k
......k1122k
.....k1122k.
....k1122k..
...k1122k...
..k1122k....
..k122k.....
.k122k......
.k2kk.......
..k.........""",
'bolt': """
.....kkkkk..
....k1111k..
....k112k...
...k112k....
...k12kkkk..
..k1111111k.
..kkkk112k..
.....k12k...
....k12k....
....k2k.....
...k2k......
...kk.......""",
'snowflake': """
.....kk.....
..k..k1k..k.
.k1k.k1k.k1k
..k1kk1kk1k.
...k11111k..
kkkk11211kkk
k11112221111
kkkk11211kkk
...k11111k..
..k1kk1kk1k.
.k1k.k1k.k1k
..k..kk...k.""",
'comet': """
kk..........
k1k.........
.k1kk.......
.k112kk.....
..k1122kk...
...k112kkkk.
....kk1k111k
......k1ww1k
......k1w12k
......k1122k
.......k22k.
........kk..""",
'hand': """
....kk......
...k1kkk....
...k1k1kkk..
...k1k1k1kk.
...k1k1k1k1k
.kkk1k1k1k1k
k11k111111k.
k111111111k.
.k1111111k..
..k111111k..
...k11111k..
....kkkkk...""",
'halo': """
............
...kkkkkk...
..k111111k..
.k1kkkkkk1k.
..k111111k..
...kkkkkk...
.....kk.....
....k11k....
...k1221k...
..k122221k..
..k122221k..
...kkkkkk...""",
'heart': """
............
.kkk....kkk.
k111k..k111k
k1w11kk1112k
k1111111122k
k1111111222k
.k11112222k.
..k112222k..
...k1222k...
....k22k....
.....kk.....
............""",
'sun': """
.....kk.....
..k..k1k..k.
.k1k.k1k.k1k
..k1kkkkk1k.
...k11111k..
kkk1122211kk
k11122222111
kkk1122211kk
...k11111k..
..k1kkkkk1k.
.k1k.k1k.k1k
..k..kk...k.""",
'lotus': """
.....kk.....
....k11k....
...k1221k...
.kkk1221kkk.
k11k1221k11k
k1221221221k
.k122112221k
..k2222222k.
.kkkkkkkkkk.
k3333333333k
.kkkkkkkkkk.
............""",
'hourglass': """
.kkkkkkkkkk.
.kYYYYYYYYk.
..k111111k..
..k122221k..
...k1221k...
....k11k....
....k12k....
...k1112k...
..k111222k..
..k122223k..
.kYYYYYYYYk.
.kkkkkkkkkk.""",
'chess': """
.....kk.....
....k11k....
...k1kk1k...
...k1111k...
....k12k....
...k1112k...
...k1122k...
..k111222k..
..k122223k..
.kkkkkkkkkk.
k1122222333k
.kkkkkkkkkk.""",
}
ACC = {   # 6×6 덧그림
'spark': """
..kk..
.kyyk.
kyhhyk
kyhhyk
.kyyk.
..kk..""",
'flame': """
..k...
.kok..
.kook.
koyyok
koyyok
.kkkk.""",
'snow': """
.k..k.
kckkck
.kcck.
.kcck.
kckkck
.k..k.""",
'up': """
..kk..
.kggk.
kggggk
.kggk.
.kggk.
.kkkk.""",
'upR': """
..kk..
.krrk.
krrrrk
.krrk.
.krrk.
.kkkk.""",
'upB': """
..kk..
.kbbk.
kbbbbk
.kbbk.
.kbbk.
.kkkk.""",
'plus': """
.kkkk.
.kggk.
kkggkk
kggggk
kkggkk
.kkkk.""",
'swirl': """
.kkkk.
kyyyyk
kykkyk
kyky.k
kykyyk
.kkkk.""",
'drop': """
..kk..
.krrk.
.krrk.
krrrrk
krRRrk
.kkkk.""",
'poison': """
..kk..
.kgGk.
kggGgk
kgGggk
.kgGk.
..kk..""",
'x2': """
k.k...
kyky..
.kyky.
..kyky
...kyk
....k.""",
'x3': """
kkk...
kykkk.
kykyky
.kykyk
..kyky
...kkk""",
'ring': """
.kkkk.
kyyyyk
kykkyk
kykkyk
kyyyyk
.kkkk.""",
'target': """
.kkkk.
krrrrk
krwwrk
krwwrk
krrrrk
.kkkk.""",
'wing': """
....kk
..kkwk
.kwwwk
kwwwk.
kwwk..
.kk...""",
'star': """
..kk..
kkyykk
kyyyyk
.kyyk.
kykkyk
kk..kk""",
'note': """
..kkk.
..kyyk
..kyk.
.kkyk.
kyyyk.
.kkk..""",
'clock': """
.kkkk.
kwwwwk
kwkwwk
kwkkwk
kwwwwk
.kkkk.""",
'cross': """
..kk..
.kyyk.
kyyyyk
kyyyyk
.kyyk.
..kk..""",
'ghost': """
.kkkk.
kwwwwk
kwkkwk
kwwwwk
kwkwkk
kk.k..""",
'chain': """
kkk...
kmk...
kkkkk.
..kmk.
..kkkk
....kk""",
'heart': """
.k..k.
krkkrk
krrrrk
.krrk.
..kk..
......""",
'wind': """
kkkk..
.kwwk.
..kkwk
kkkkwk
kwwwk.
kkkk..""",
'excl': """
.kkkk.
.kyyk.
.kyyk.
.kkkk.
.kyyk.
.kkkk.""",
'shield': """
kkkkkk
kmmmmk
kmMMmk
kmMMmk
.kmmk.
..kk..""",
'down': """
.kkkk.
.kyyk.
.kyyk.
kyyyyk
.kyyk.
..kk..""",
}
PIPS = {1: '1', 2: '2'}
