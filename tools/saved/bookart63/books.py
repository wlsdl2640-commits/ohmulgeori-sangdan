"""스킬북 그림 시안 (빌드 63) — 20×20 도트. 게임에는 아직 넣지 않는다 (사용자가 고른 뒤 적용).
스킬북 단계 여섯 × 시안 A·B, 펼쳐서 나오는 직업별 스킬북 × A·B."""
import math, random

W = H = 20
K = (26, 20, 16)          # 테두리
P = (238, 226, 196)       # 책장
Q = (196, 178, 140)       # 책장 그늘
Q2 = (160, 140, 104)


def hx(s):
    s = s.lstrip('#'); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def lt(c, t):
    return mix(c, (255, 255, 255), t)


def dk(c, t):
    return mix(c, (0, 0, 0), t)


class Cv:
    def __init__(self):
        self.px = {}
        self.glow = {}     # 뒤에 깔리는 빛 (반투명)

    def set(self, x, y, c):
        if 0 <= x < W and 0 <= y < H and c is not None:
            self.px[(x, y)] = c

    def get(self, x, y):
        return self.px.get((x, y))

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.set(x, y, c)

    def pat(self, x0, y0, rows, cmap):
        for j, r in enumerate(rows):
            for i, ch in enumerate(r):
                if ch != '.' and ch in cmap:
                    self.set(x0 + i, y0 + j, cmap[ch])

    def outline(self, col=K):
        add = []
        for (x, y) in list(self.px):
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                p = (x + dx, y + dy)
                if p not in self.px and 0 <= p[0] < W and 0 <= p[1] < H:
                    add.append(p)
        for p in add:
            self.px[p] = col


# ── 책 바탕: 앞표지 x 2..14 · y 1..15 (테 포함), 책장 오른쪽 x 15..16 · 아래 y 16..17, 뒤표지 테 x 17 · y 18
def base(cv, C, spine=None, band=None, pages=True):
    L, D, D2 = lt(C, .28), dk(C, .3), dk(C, .5)
    S = spine or dk(C, .38)
    # 책장
    if pages:
        for y in range(3, 17):
            cv.set(15, y, P); cv.set(16, y, P if y % 2 else Q)
        for x in range(4, 17):
            cv.set(x, 16, P if x % 2 else Q); cv.set(x, 17, Q)
        cv.set(16, 17, Q2)
        for y in range(3, 18): cv.set(17, y, K)
        for x in range(4, 18): cv.set(x, 18, K)
        cv.set(3, 16, K); cv.set(3, 17, K)
    # 앞표지
    cv.rect(2, 1, 14, 15, K)
    cv.rect(3, 2, 13, 14, C)
    cv.rect(3, 2, 4, 14, S)                # 등
    cv.rect(5, 2, 13, 2, L); cv.rect(5, 2, 5, 14, L)
    cv.rect(13, 3, 13, 14, D); cv.rect(5, 14, 13, 14, D)
    cv.set(3, 2, lt(S, .25))
    for y in range(3, 14): cv.set(3, y, lt(S, .12) if y % 3 else S)
    if band:
        for y in (4, 12): cv.rect(3, y, 4, y, band)
    return L, D, D2, S


def sparkle(cv, x, y, c, big=False):
    cv.set(x, y, c)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        cv.set(x + dx, y + dy, mix(c, (255, 255, 255), .2) if big else dk(c, .15))
    if big:
        for d in (2, -2): cv.set(x + d, y, dk(c, .1)); cv.set(x, y + d, dk(c, .1))


# ───────── 스킬북 단계 ─────────
def torn_a():
    cv = Cv(); C = hx('#8a7c66')
    L, D, D2, S = base(cv, C)
    # 오른쪽 위가 비스듬히 찢겨 첫 장이 드러남
    edge = {}
    for y in range(1, 10):
        cut = 8 + int((y - 1) * 0.75) + (1 if y in (3, 6) else 0) - (1 if y == 5 else 0)
        edge[y] = cut
        for x in range(cut + 1, 15):
            cv.set(x, y, None)
            cv.px.pop((x, y), None)
    # 드러난 첫 장 (글 줄)
    for y in range(1, 10):
        for x in range(edge[y] + 1, 15):
            if x == 14 or y == 1: continue
            cv.set(x, y, P if (y % 2 or x < edge[y] + 2) else Q)
    for y in range(2, 10):
        for x in range(edge[y] + 2, 14):
            if y % 2 == 0 and x < 13: cv.set(x, y, (150, 128, 98))
    # 찢긴 가장자리: 보푸라기
    for y in range(1, 10):
        x = edge[y]
        if (x, y) in cv.px and x >= 5: cv.set(x, y, lt(C, .45))
        if y % 2 == 1 and x + 1 <= 14: cv.set(x + 1, y, (214, 200, 170))
    # 바깥 테 다시 (책장 둘레)
    for y in range(1, 10): cv.set(14, y, K)
    for x in range(edge[1] + 1, 15): cv.set(x, 1, K)
    # 접혀 늘어진 조각
    cv.pat(9, 9, ['.dd', 'ddk', '.k.'], {'d': dk(C, .45), 'k': K})
    # 얼룩 · 등 해어짐
    cv.pat(6, 10, ['.ss', 'sss', '.s.'], {'s': dk(C, .18)})
    cv.set(3, 7, lt(C, .3)); cv.set(4, 9, lt(C, .3))
    return cv


def torn_b():
    cv = Cv(); C = hx('#7c7466')
    L, D, D2, S = base(cv, C)
    # 가운데를 세로로 가른 찢김 + 덕지덕지 붙인 천 조각
    path = [(9, 1), (9, 2), (8, 3), (9, 4), (10, 5), (9, 6), (9, 7), (8, 8), (9, 9), (10, 10), (9, 11), (9, 12)]
    for (x, y) in path:
        cv.set(x, y, P if y % 2 else Q); cv.set(x - 1, y, dk(C, .5))
        if y % 3 == 0: cv.set(x + 1, y, lt(C, .4))
    cv.set(9, 1, K)
    # 테이프 (비스듬히)
    T = hx('#c8b48a')
    for i in range(6):
        x, y = 6 + i, 9 - i
        cv.set(x, y, T); cv.set(x, y + 1, dk(T, .18))
    # 뜯겨 나간 아래 귀퉁이
    for (x, y) in [(12, 14), (13, 14), (13, 13), (12, 15), (13, 15), (14, 15), (14, 14), (14, 13), (14, 12)]:
        cv.px.pop((x, y), None)
    for (x, y) in [(11, 15), (12, 14), (13, 13), (14, 12)]: cv.set(x, y, K)
    cv.set(12, 13, lt(C, .4)); cv.set(13, 12, lt(C, .4))
    cv.pat(5, 4, ['ss.', '.s.'], {'s': dk(C, .2)})
    return cv


def old_a():
    cv = Cv(); C = hx('#8a5530')
    L, D, D2, S = base(cv, C, band=hx('#8a7040'))
    # 닳은 모서리 (밝게 해짐)
    for (x, y) in [(5, 2), (6, 2), (5, 3), (13, 2), (12, 2), (13, 3), (13, 14), (12, 14), (13, 13)]: cv.set(x, y, hx('#b08a5c'))
    # 가죽 띠 + 녹슨 버클
    for y in range(2, 15): cv.set(11, y, hx('#4a2c16')); cv.set(12, y, hx('#5e3a1e'))
    cv.pat(10, 7, ['MMMM', 'M..M', 'MMMM'], {'M': hx('#9a8048')})
    cv.set(11, 8, hx('#4a2c16')); cv.set(12, 8, hx('#5e3a1e'))
    # 흐린 둥근 문양
    cv.pat(6, 6, ['.ee.', 'e..e', 'e..e', '.ee.'], {'e': hx('#a87048')})
    # 갈라진 등
    cv.set(4, 6, hx('#c09060')); cv.set(3, 10, hx('#c09060'))
    return cv


def old_b():
    cv = Cv(); C = hx('#7a4a2a')
    L, D, D2, S = base(cv, C)
    # 노끈으로 묶음 (가로 · 세로)
    R1, R2 = hx('#d8c08a'), hx('#a88a50')
    for x in range(3, 14): cv.set(x, 9, R1 if x % 2 else R2)
    for y in range(2, 15): cv.set(9, y, R1 if y % 2 else R2)
    cv.pat(8, 8, ['RrR', 'r.r', 'RrR'], {'R': R1, 'r': R2}); cv.set(9, 9, R1)
    cv.pat(10, 10, ['R.', '.R', '.R'], {'R': R2})
    # 접힌 귀 (오른쪽 위)
    for (x, y) in [(13, 2), (12, 2), (13, 3)]: cv.px.pop((x, y), None)
    cv.pat(11, 1, ['kkk.', 'kffk', 'kfk.', 'kk..'], {'k': K, 'f': hx('#c8a070')})
    cv.set(14, 1, None); cv.px.pop((14, 1), None); cv.set(14, 2, K); cv.set(14, 3, K)
    # 물 얼룩
    cv.pat(5, 11, ['.ww', 'www'], {'w': hx('#946038')})
    return cv


def faded_a():
    cv = Cv(); C = hx('#6e8aa6')
    L, D, D2, S = base(cv, C, band=hx('#b8c0c8'))
    # 햇빛에 바랜 왼쪽 위
    for y in range(2, 10):
        for x in range(5, 13 - y // 2):
            if (x + y) < 13: cv.set(x, y, mix(cv.get(x, y) or C, hx('#c8d4dc'), .35 if (x + y) < 10 else .18))
    # 은 모서리 쇠
    M, M2 = hx('#c8d0d8'), hx('#8890a0')
    cv.pat(11, 2, ['MMM', '.MM', '..M'], {'M': M}); cv.pat(11, 12, ['..M', '.MM', 'MMM'], {'M': M2})
    # 흐린 고리 문양
    E = hx('#a8bcd0')
    cv.pat(6, 6, ['.EEE.', 'E...E', 'E.e.E', 'E...E', '.EEE.'], {'E': E, 'e': hx('#d0dce8')})
    return cv


def faded_b():
    cv = Cv(); C = hx('#6a8a88')
    L, D, D2, S = base(cv, C)
    G = hx('#c0b080'); G2 = hx('#8a8060')
    # 바랜 금 테두리
    for x in range(6, 13): cv.set(x, 3, G); cv.set(x, 13, G2)
    for y in range(3, 14): cv.set(6, y, G); cv.set(12, y, G2)
    # 제목 줄 (흐림)
    for x in range(8, 11): cv.set(x, 6, G); cv.set(x, 8, G2)
    cv.set(9, 10, G)
    # 바랜 얼룩
    for (x, y) in [(10, 4), (11, 5), (7, 11), (8, 12)]: cv.set(x, y, lt(C, .3))
    return cv


def myst_a():
    cv = Cv(); C = hx('#3e2478')
    L, D, D2, S = base(cv, C, band=hx('#9a7af0'))
    # 빛나는 마법진
    c0, c1, c2 = hx('#eafcff'), hx('#7af0ff'), hx('#4aa8e8')
    cv.pat(5, 4, ['..aaa..', '.a...a.', 'a..b..a', 'a.bcb.a', 'a..b..a', '.a...a.', '..aaa..'], {'a': c2, 'b': c1, 'c': c0})
    # 책장 끝이 빛남
    for y in range(3, 17): cv.set(16, y, hx('#d8c8ff') if y % 2 else hx('#a890e8'))
    for x in range(4, 17): cv.set(x, 17, hx('#a890e8'))
    for (x, y) in [(9, 1)]: pass
    cv.outline()
    sparkle(cv, 1, 3, hx('#b8f4ff'))
    sparkle(cv, 18, 13, hx('#e0b8ff'))
    cv.set(17, 1, hx('#b8f4ff'))
    cv.glow = {'c': hx('#9a7af0'), 'r': 0.45}
    return cv


def myst_b():
    cv = Cv(); C = hx('#2a2a6a')
    L, D, D2, S = base(cv, C, band=hx('#e8d070'))
    Y, Y2 = hx('#fff0a0'), hx('#e0c050')
    # 초승달 + 별 셋
    cv.pat(6, 4, ['.YYY.', 'YY...', 'Y....', 'Y....', 'YY...', '.YYY.'], {'Y': Y})
    cv.pat(7, 5, ['y'], {'y': Y2})
    for (x, y, big) in [(11, 5, False), (10, 9, False), (12, 11, False)]:
        cv.set(x, y, Y); cv.set(x + 1, y, Y2); cv.set(x - 1, y, Y2); cv.set(x, y - 1, Y2); cv.set(x, y + 1, Y2)
    cv.outline()
    sparkle(cv, 18, 2, hx('#fff6c0'))
    sparkle(cv, 1, 12, hx('#c8c0ff'))
    cv.glow = {'c': hx('#7070e0'), 'r': 0.4}
    return cv


def ancient_a():
    cv = Cv(); C = hx('#7c7868')
    L, D, D2, S = base(cv, C, spine=hx('#5a5648'))
    G, G2, G3 = hx('#f0d070'), hx('#c09a38'), hx('#8a6a20')
    # 금 모서리 덮개 (L자)
    cv.pat(5, 2, ['GGG', 'Gg.', 'G..'], {'G': G, 'g': G2}); cv.pat(11, 2, ['GGG', '.gG', '..G'], {'G': G, 'g': G2})
    cv.pat(5, 12, ['G..', 'Gg.', 'GGG'], {'G': G2, 'g': G3}); cv.pat(11, 12, ['..G', '.gG', 'GGG'], {'G': G2, 'g': G3})
    # 새긴 글자 줄
    cv.pat(6, 5, ['c.c.c.c', '.......', 'c.cc.c.'], {'c': dk(C, .35)})
    # 가운데 에메랄드 자물쇠
    cv.pat(7, 8, ['.GGG.', 'GeEeG', 'GEhEG', '.GGG.'], {'G': G2, 'e': hx('#1a8a5a'), 'E': hx('#2ac87a'), 'h': hx('#b8ffd8')})
    # 갈라짐
    cv.set(12, 6, dk(C, .45)); cv.set(11, 7, dk(C, .45))
    return cv


def ancient_b():
    cv = Cv(); C = hx('#5e7a5c')
    L, D, D2, S = base(cv, C, spine=hx('#3e5a40'), band=hx('#c8a050'))
    G, G2 = hx('#f0c860'), hx('#b08830')
    # 해 원반 + 빛살
    cv.pat(6, 4, ['..g.g..', '.GGGGG.', 'gGgGgGg', '.GGGGG.', 'gGgGgGg', '.GGGGG.', '..g.g..'],
           {'G': G, 'g': G2})
    cv.pat(8, 6, ['.r.', 'rRr', '.r.'], {'r': hx('#d05a30'), 'R': hx('#ff9a50')})
    # 리벳
    for (x, y) in [(6, 3), (12, 3), (6, 13), (12, 13)]: cv.set(x, y, hx('#d8c8a0'))
    # 녹청
    for (x, y) in [(10, 12), (11, 11), (7, 12)]: cv.set(x, y, hx('#7aa890'))
    return cv


def myth_a():
    cv = Cv(); C = hx('#9a1424')
    L, D, D2, S = base(cv, C, spine=hx('#5a0a14'), band=hx('#f0c050'))
    G, G2 = hx('#ffe08a'), hx('#d09a30')
    # 금 세공 테
    for x in range(5, 14): cv.set(x, 3, G2); cv.set(x, 13, G2)
    for y in range(3, 14): cv.set(5, y, G2); cv.set(13, y, G2)
    for (x, y) in [(5, 3), (13, 3), (5, 13), (13, 13)]: cv.set(x, y, G)
    # 가운데 빛나는 별 + 루비
    cv.pat(6, 4, ['...G...', '..GGG..', 'GGGrGGG', '.GrRrG.', 'GGGrGGG', '..GGG..', '...G...'],
           {'G': G, 'r': hx('#e03040'), 'R': hx('#ffb0b0')})
    cv.pat(6, 11, ['g.g.g.g'], {'g': G})
    cv.outline()
    # 불티
    for (x, y, c) in [(1, 2, '#ffd070'), (18, 5, '#ff9a40'), (0, 10, '#ff7a30'), (18, 15, '#ffd070'), (16, 0, '#ffe8a0')]:
        cv.set(x, y, hx(c))
    cv.glow = {'c': hx('#ffb040'), 'r': 0.55}
    return cv


def myth_b():
    cv = Cv(); C = hx('#e8dcc0')
    L, D, D2, S = base(cv, C, spine=hx('#c0a060'), band=hx('#fff4b0'))
    G, G2, G3 = hx('#f0c040'), hx('#c89020'), hx('#fff4b0')
    # 금 날개 문양
    cv.pat(5, 5, ['G.......G', 'GG.....GG', 'gGG.o.GGg', '.gGgOgGg.', '..ggOgg..', '....g....'],
           {'G': G, 'g': G2, 'o': hx('#ff8a40'), 'O': hx('#ffd080')})
    cv.pat(6, 12, ['ggggggg'], {'g': G2})
    cv.outline()
    # 뒤로 퍼지는 빛살 (테 밖)
    for (x, y) in [(0, 0), (1, 1), (19, 0), (18, 1), (0, 19), (19, 19), (9, 0), (0, 8), (19, 9)]:
        cv.set(x, y, G3)
    cv.glow = {'c': hx('#fff0a0'), 'r': 0.6}
    return cv


TIERS = [
    ('찢어진 스킬북', '공용 · 일반', torn_a, torn_b, ('A 비스듬히 찢겨 첫 장이 드러남', 'B 가운데가 갈라져 테이프로 붙임')),
    ('낡은 스킬북', '1차 · 고급', old_a, old_b, ('A 닳은 가죽 · 녹슨 버클 띠', 'B 노끈으로 묶음 · 접힌 귀')),
    ('빛바랜 스킬북', '2차 · 희귀', faded_a, faded_b, ('A 바랜 푸른 천 · 은 모서리', 'B 바랜 청록 · 금 테두리')),
    ('신비한 스킬북', '3차 · 영웅', myst_a, myst_b, ('A 빛나는 마법진 · 책장 빛', 'B 초승달과 별 · 빛')),
    ('고대의 스킬북', '4차 · 전설', ancient_a, ancient_b, ('A 돌 표지 · 금 모서리 · 에메랄드 자물쇠', 'B 녹청 청동 · 해 원반')),
    ('신화 속 스킬북', '5차 · 신화', myth_a, myth_b, ('A 진홍 · 금 세공 · 루비 별 · 불티', 'B 상아 · 금 날개 · 빛살')),
]

# ───────── 펼쳐서 나오는 스킬북 (직업별) ─────────
SIGIL = {
    'warrior': ['..Y..', '..Y..', '..Y..', '..Y..', '.YYY.', '..y..'],
    'archer':  ['..Y..', '.YYY.', '..Y..', '..Y..', '.Y.Y.', 'Y...Y'],
    'mage':    ['..Y..', '.YYY.', 'YYYYY', '.YYY.', '.Y.Y.', '.....'],
    'cleric':  ['Y.Y.Y', '.YYY.', 'YYyYY', '.YYY.', 'Y.Y.Y', '.....'],
    'rogue':   ['....Y', '...Y.', '..Y..', 'yY...', '.y...', '.....'],
    'porter':  ['.YYY.', 'Y.Y.Y', 'YYyYY', 'Y.Y.Y', '.YYY.', '.....'],
    'all':     ['..Y..', '.Y.Y.', 'Y.y.Y', '.Y.Y.', '..Y..', '.....'],
}
CLS = [('warrior', '전사', '#c0392b'), ('archer', '궁수', '#4f9a3a'), ('mage', '마법사', '#7a4ac8'), ('cleric', '성직자', '#d9b44a'),
       ('rogue', '도적', '#5a5a6a'), ('porter', '짐꾼', '#9a7a4f'), ('all', '공용', '#4a8ac8')]
QCOL = ['#b0a898', '#7bd36a', '#6ab0ff', '#c07af0', '#f0b43c', '#ff6a5a', '#fff4b0']


def skill_a(cls, col, grade):
    cv = Cv(); C = hx(col)
    L, D, D2, S = base(cv, C, band=hx('#e8c860'))
    Y, y = hx('#fff0b0'), hx('#d8b860')
    if cls == 'cleric': Y, y = hx('#fffbe8'), hx('#f0e0a0')
    cv.pat(7, 5, SIGIL[cls], {'Y': Y, 'y': y})
    # 아래로 늘어진 책갈피 끈 (레어도 색)
    R = hx(QCOL[grade])
    for yy in range(14, 19): cv.set(11, yy, R); cv.set(12, yy, dk(R, .25))
    cv.set(11, 19, R); cv.set(12, 19, None); cv.px.pop((12, 19), None)
    cv.set(10, 18, K); cv.set(10, 19, K); cv.set(13, 17, K); cv.set(13, 18, K); cv.set(12, 19, K)
    return cv


def skill_b(cls, col, grade):
    cv = Cv(); C = hx(col)
    L, D, D2, S = base(cv, C)
    R = hx(QCOL[grade])
    # 레어도 색 띠 두 줄 (위 · 아래)
    for x in range(5, 14): cv.set(x, 3, R); cv.set(x, 13, dk(R, .2))
    # 가운데 판 (어두운 창) + 문장
    cv.rect(6, 5, 12, 11, dk(C, .55))
    for x in range(6, 13): cv.set(x, 5, dk(C, .7))
    Y, y = hx('#fff0b0'), hx('#d8b860')
    cv.pat(7, 6, SIGIL[cls][:6], {'Y': Y, 'y': y})
    # 모서리 쇠
    for (x, y0) in [(5, 2), (13, 2), (5, 14), (13, 14)]: cv.set(x, y0, hx('#e8d090'))
    return cv
