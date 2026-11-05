"""전사 기본 스킬 다섯 — 뭉툭 도트 시안 1차. 칸 좌표: x 0..15, y 0..19 (육각 틀 안쪽)."""
import math
import cell
from cell import Art, radial, mix, rows_of, dsword, crescent2
DARKFIRE = ['#1a0304', '#3a0806', '#621208', '#8e1e0c', '#b8300e', '#e05a18']
def slash(a, cm, cols=('#ffffff', '#fff0a0', '#ffb040', '#f07a20')):
    for (x, y), (fo, fi) in cm.items():
        k = 0 if fo < 0.9 else 1 if fo < 1.8 else 2 if fo < 2.6 else 3
        if fi < 0.6 and k < 2: k = max(k, 1)
        a.set(x, y, cols[k])
def pips(a, n):
    """이름에 숫자만 다른 스킬: 꼭대기에 흰 점 (2×2칸, 검은 테두리)"""
    x0 = 8 - n * 3 // 2 + (0 if n % 2 else 0)
    xs = [7] if n == 1 else [5, 9] if n == 2 else [4, 7, 10]
    for x in xs:
        for dx in (-1, 0, 1, 2):
            for dy in (-1, 0, 1, 2):
                a.set(x + dx, 1 + dy, '#ffffff' if dx in (0, 1) and dy in (0, 1) else cell.OUT)
STAR = ['...o...', '...y...', '..yhy..', 'oyhwhyo', '..yhy..', '...y...', '...o...']
STARP = {'o': '#ff9a30', 'y': '#ffd860', 'h': '#fff4c0', 'w': '#ffffff'}
# 1. 강타
def bash():
    a = Art().bg(radial(DARKFIRE, 9.0, 11.0, 12.5, [0.0, 0.18, 0.36, 0.56, 0.78]))
    slash(a, crescent2((8.5, 10.0), 7.6, (10.0, 11.2), 7.4))
    a.sym(rows_of(dsword(2, 15, Lb=6, Lg=2, g=2)))
    a.paint(['.h.', 'hwh', '.h.'], STARP, ox=1, oy=14)
    return a, 0
# 2. 도발: 뿔 투구 + 붉게 빛나는 눈 + 퍼지는 고함
BLOOD = ['#140204', '#2e0406', '#560a0a', '#86140e', '#b82a14', '#e8542a']
HELM = ['................',
        '................',
        '................',
        '..e..........e..',
        '.ee..........ee.',
        '.eE...mmmm...Ee.',
        '..eE.mmmmmm.Ee..',
        '...EmmmmmmmMME..',
        '...mmmmmmmmmMM..',
        '...nnnnnnnnnnn..',
        '...m4123m4123M..',
        '...m3333m3333M..',
        '...mmkkkmkkkmM..',
        '...mmkkkmkkkmM..',
        '....mmkkmkkmM...',
        '....mm.....mM...']
def taunt():
    a = Art().bg(radial(BLOOD, 7.5, 10.5, 11, [0.0, 0.2, 0.42, 0.64, 0.86], rays=12, rot=0.13, ray_w=0.5, ray_amp=0.1))
    # 고함 물결 (양옆 둥근 줄)
    a.paint(['..h..........h..'[:0]], {})
    for (x, y) in [(1, 10), (0, 11), (0, 12), (1, 13), (14, 10), (15, 11), (15, 12), (14, 13)]: a.set(x, y, '#ffd0a0')
    a.sym(HELM, {'1': ('#ff4a1a', 13), '2': ('#ffe8a0', 1), '3': ('#c01808', 13), '4': ('#ff8a3a', 13)})
    pips(a, 1)
    return a, 1
# 3. 철벽: 큰 쇠 방패 + 금빛 성 무늬 + 푸른 결계 빛
SKY = ['#060c2a', '#0e1e5a', '#18388e', '#2a62c4', '#4a94ec', '#8ac8ff']
SHIELD = ['................',
          '................',
          '................',
          '...nnnnnnnnnn...',
          '...nwwmmmmmmn...',
          '...nwmmmmmmMn...',
          '...nmmy.y.yMn...',
          '...nmmyyyyyMn...',
          '...nmmyykyyMn...',
          '...nmmyykyyMn...',
          '...nmmmmmmMMn...',
          '....nmmmmmMn....',
          '....nmmmmmMn....',
          '.....nmmmMn.....',
          '......nmMn......',
          '.......nn.......']
def ironwall():
    a = Art().bg(radial(SKY, 7.5, 9.5, 11, [0.0, 0.2, 0.42, 0.64, 0.86]))
    a.sym(SHIELD, oy=1, glow='#bfe8ff')
    for (x, y, c) in [(13, 4, '#ffffff'), (14, 3, '#fff6c0'), (12, 3, '#fff6c0'), (14, 5, '#fff6c0'), (2, 14, '#ffffff'), (1, 13, '#fff6c0'), (1, 15, '#fff6c0'), (3, 15, '#fff6c0')]:
        a.set(x, y, c)
    return a, 0
# 4. 휩쓸기: 앞을 가로로 크게 베는 자국 + 칼
EMBER = ['#1e0604', '#481006', '#7a1e08', '#ae360c', '#dc5a14', '#ff8a2a']
SWEEPSW = ['................',
           '................',
           '................',
           '................',
           '................',
           '................',
           '................',
           '..............y.',
           '.wwwwwwwwww.y.yY',
           'mmmmmmmmmmmMyllY',
           '.MMMMMMMMMM.y.YY',
           '............Y...']
def sweep():
    a = Art().bg(radial(EMBER, 7.5, 11.0, 12, [0.0, 0.2, 0.42, 0.64, 0.86]))
    slash(a, crescent2((7.5, 6.5), 8.6, (7.5, 4.6), 8.4))
    a.sym(SWEEPSW, oy=0)
    for (x, y) in [(1, 13), (14, 13)]:
        a.paint(['.h.', 'hwh', '.h.'], STARP, ox=x - 1, oy=y - 1)
    return a, 0
# 5. 광폭화: 두 팔 치켜든 검은 몸 + 불꽃 테두리 빛 + 이글거리는 불길
BODY = ['................',
        '................',
        '................',
        '......k.kk.k....',
        '.dd...kkkkkk..dd',
        '.ddd..kwkkwk.ddd',
        '.ddd..kkkkkk.ddd',
        '..dd...krrk..dd.',
        '..dd..dddddd.dd.',
        '..dddddddddddd..',
        '...dddddddddd...',
        '....dddddddd....',
        '.....dddddd.....',
        '.....dddddd.....',
        '.....ddd.ddd....',
        '.....dd...dd....']
def berserk():
    a = Art().bg(radial(DARKFIRE, 7.5, 12.0, 12, [0.0, 0.16, 0.34, 0.54, 0.76]))
    a.sym(BODY, {'d': ('#2a0c0a', 1), 'k': ('#2a0c0a', 1), 'r': ('#ff4a10', 1), 'w': ('#ffffff', 1)}, glow='#ff9a2a')
    return a, 0
ICONS = {'bash': ('강타', 'dmg', bash), 'taunt': ('도발 1', 'taunt', taunt), 'ironwall': ('철벽', 'buff', ironwall),
         'sweep': ('휩쓸기', 'dmg', sweep), 'berserk': ('광폭화', 'buff', berserk)}
