"""스킬북 그림 시안 2 (빌드 63, 11-11 11:10 사용자: 옆 하얀 테 대신 책 두께가 보이게 · 궁수 · 마법사 · 도적 문양 고치기)
20×20 도트. 앞표지 + 위 · 오른쪽 옆면(두께 3칸: 앞표지 모서리 · 책장 · 뒤표지)."""
from books import Cv, hx, mix, lt, dk, K, W, H

PG = (226, 210, 172)    # 책장 (옆면이라 그늘진 크림)
PG2 = (190, 170, 128)   # 책장 사이 줄
FX0, FY0, FX1, FY1, D = 1, 4, 13, 18, 3   # 앞표지 테 (FX0..FX1 · FY0..FY1) · 두께


def base(cv, C, spine=None, band=None, page=PG, line=PG2):
    L, Dk, D2 = lt(C, .28), dk(C, .3), dk(C, .5)
    S = spine or dk(C, .38)
    top_c, side_c = lt(C, .12), dk(C, .22)
    # 윗면 (y = FY0-1 .. FY0-D): 앞표지 모서리 → 책장 → 뒤표지
    for d in range(1, D + 1):
        y = FY0 - d
        col = top_c if d == 1 else (page if d == 2 else Dk)
        for x in range(FX0 + d, FX1 + d + 1):
            c = col
            if d == 2 and x % 3 == 0: c = mix(page, line, .5)
            cv.set(x, y, c)
        cv.set(FX0 + d, y, S if d != 2 else dk(S, .1))     # 등 쪽 끝
    # 오른쪽 옆면 (x = FX1+1 .. FX1+D): 앞표지 모서리 → 책장(줄) → 뒤표지
    for d in range(1, D + 1):
        x = FX1 + d
        for y in range(FY0 - d, FY1 - d + 1):
            if d == 1: c = side_c
            elif d == 2: c = page if (y % 2) else line
            else: c = D2
            cv.set(x, y, c)
    # 모서리 이음 (윗면과 옆면이 만나는 줄은 조금 밝게)
    for d in range(1, D + 1): cv.set(FX1 + d, FY0 - d, lt(C, .05) if d != 2 else page)
    # 앞표지
    cv.rect(FX0, FY0, FX1, FY1, K)
    cv.rect(FX0 + 1, FY0 + 1, FX1 - 1, FY1 - 1, C)
    cv.rect(FX0 + 1, FY0 + 1, FX0 + 2, FY1 - 1, S)     # 등 (두 칸)
    cv.rect(FX0 + 3, FY0 + 1, FX1 - 1, FY0 + 1, L); cv.rect(FX0 + 3, FY0 + 1, FX0 + 3, FY1 - 1, L)
    cv.rect(FX1 - 1, FY0 + 2, FX1 - 1, FY1 - 1, Dk); cv.rect(FX0 + 3, FY1 - 1, FX1 - 1, FY1 - 1, Dk)
    for y in range(FY0 + 1, FY1): cv.set(FX0 + 1, y, lt(S, .14) if y % 3 else S)
    cv.set(FX0 + 3, FY0 + 1, lt(C, .4))
    if band:
        for y in (FY0 + 3, FY1 - 3): cv.rect(FX0 + 1, y, FX0 + 2, y, band)
    # 바깥 테
    cv.outline()
    return L, Dk, D2, S


# 앞표지 꾸밈 자리: x 5..11 (7칸) · y 6..16 (11줄), 가운데 (8, 11)
def emb(cv, x0, y0, rows, cmap):
    cv.pat(x0, y0, rows, cmap)


def sparkle(cv, x, y, c):
    cv.set(x, y, c)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)): cv.set(x + dx, y + dy, dk(c, .15))


# ───────── 스킬북 단계 ─────────
def torn_a():
    cv = Cv(); C = hx('#8a7c66')
    base(cv, C)
    # 앞표지 오른쪽 위가 찢겨 첫 장(글 줄)이 드러남
    tear = {5: 9, 6: 8, 7: 9, 8: 10, 9: 9, 10: 11, 11: 12}
    for y, x0 in tear.items():
        for x in range(x0, FX1):
            cv.set(x, y, (232, 220, 190) if (y % 2 or x == x0) else (170, 150, 116))
        cv.set(x0 - 1, y, lt(C, .45))     # 찢긴 보푸라기
    for x in range(9, FX1): cv.set(x, FY0, K)
    cv.pat(9, 12, ['dd.', 'ddd', '.d.'], {'d': dk(C, .42)})     # 늘어진 조각
    cv.pat(5, 13, ['.ss', 'sss'], {'s': dk(C, .18)})            # 얼룩
    return cv


def torn_b():
    cv = Cv(); C = hx('#7c7466')
    base(cv, C)
    path = [(8, 5), (8, 6), (7, 7), (8, 8), (9, 9), (8, 10), (8, 11), (7, 12), (8, 13), (9, 14), (8, 15), (8, 16), (8, 17)]
    for (x, y) in path:
        cv.set(x, y, (232, 220, 190) if y % 2 else (196, 178, 140)); cv.set(x - 1, y, dk(C, .5))
        if y % 3 == 0: cv.set(x + 1, y, lt(C, .4))
    T = hx('#c8b48a')
    for i in range(6): cv.set(5 + i, 13 - i, T); cv.set(5 + i, 14 - i, dk(T, .18))
    return cv


def old_a():
    cv = Cv(); C = hx('#8a5530')
    base(cv, C, band=hx('#8a7040'))
    for (x, y) in [(4, 5), (5, 5), (12, 5), (11, 5), (12, 6), (12, 17), (11, 17), (12, 16)]: cv.set(x, y, hx('#b08a5c'))
    for y in range(5, 18): cv.set(10, y, hx('#4a2c16')); cv.set(11, y, hx('#5e3a1e'))
    cv.pat(9, 10, ['MMMM', 'M..M', 'MMMM'], {'M': hx('#9a8048')}); cv.set(10, 11, hx('#4a2c16')); cv.set(11, 11, hx('#5e3a1e'))
    cv.pat(5, 8, ['.ee.', 'e..e', 'e..e', '.ee.'], {'e': hx('#a87048')})
    return cv


def old_b():
    cv = Cv(); C = hx('#7a4a2a')
    base(cv, C)
    R1, R2 = hx('#d8c08a'), hx('#a88a50')
    for x in range(4, 13): cv.set(x, 12, R1 if x % 2 else R2)
    for y in range(5, 18): cv.set(8, y, R1 if y % 2 else R2)
    cv.pat(7, 11, ['RrR', 'r.r', 'RrR'], {'R': R1, 'r': R2}); cv.set(8, 12, R1)
    cv.pat(9, 13, ['R.', '.R', '.R'], {'R': R2})
    cv.pat(5, 14, ['.ww', 'www'], {'w': hx('#946038')})
    return cv


def faded_a():
    cv = Cv(); C = hx('#6e8aa6')
    base(cv, C, band=hx('#b8c0c8'))
    for y in range(5, 12):
        for x in range(4, 12 - (y - 5) // 2):
            if x + y < 16: cv.set(x, y, mix(cv.get(x, y) or C, hx('#c8d4dc'), .3 if x + y < 13 else .15))
    M, M2 = hx('#c8d0d8'), hx('#8890a0')
    cv.pat(10, 5, ['MMM', '.MM', '..M'], {'M': M}); cv.pat(10, 15, ['..M', '.MM', 'MMM'], {'M': M2})
    cv.pat(5, 9, ['.EEE.', 'E...E', 'E.e.E', 'E...E', '.EEE.'], {'E': hx('#a8bcd0'), 'e': hx('#d0dce8')})
    return cv


def faded_b():
    cv = Cv(); C = hx('#6a8a88')
    base(cv, C)
    G, G2 = hx('#c0b080'), hx('#8a8060')
    for x in range(5, 12): cv.set(x, 6, G); cv.set(x, 16, G2)
    for y in range(6, 17): cv.set(5, y, G); cv.set(11, y, G2)
    for x in range(7, 10): cv.set(x, 9, G); cv.set(x, 11, G2)
    cv.set(8, 13, G)
    return cv


def myst_a():
    cv = Cv(); C = hx('#3e2478')
    base(cv, C, band=hx('#9a7af0'), page=(214, 200, 255), line=(168, 144, 232))
    c0, c1, c2 = hx('#eafcff'), hx('#7af0ff'), hx('#4aa8e8')
    # 마법진: 고리 + 안에 꼭 맞는 마름모 보석 (가운데가 더하기 꼴로 보이지 않게 속을 꽉 채움)
    cv.pat(4, 7, ['..aaa..', '.a.c.a.', 'a.ccb.a', 'acccbba', 'a.cbb.a', '.a.b.a.', '..aaa..'], {'a': c2, 'b': c1, 'c': c0})
    for (x, y) in [(5, 6), (9, 6), (3, 10), (11, 10), (5, 14), (9, 14)]: cv.set(x, y, dk(c2, .25))     # 고리 둘레 점 (룬 자리)
    sparkle(cv, 1, 1, hx('#b8f4ff')); sparkle(cv, 18, 17, hx('#e0b8ff'))
    cv.glow = {'c': hx('#9a7af0'), 'r': 0.45}
    return cv


def myst_b():
    cv = Cv(); C = hx('#2a2a6a')
    base(cv, C, band=hx('#e8d070'))
    Y, Y2, Ln = hx('#fff0a0'), hx('#e0c050'), hx('#5a5ab0')
    stars = [(5, 7), (9, 8), (11, 11), (7, 12), (10, 15), (5, 15)]
    def line(a, b):
        (x0, y0), (x1, y1) = a, b; n = max(abs(x1 - x0), abs(y1 - y0))
        for i in range(1, n):
            cv.set(round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n), Ln)
    for a, b in zip(stars, stars[1:]): line(a, b)
    line(stars[3], stars[5])
    for i, (x, y) in enumerate(stars):     # 별 = 2×2 (밝은 왼쪽 위)
        cv.set(x, y, Y); cv.set(x + 1, y, Y2); cv.set(x, y + 1, Y2); cv.set(x + 1, y + 1, dk(Y2, .25))
    sparkle(cv, 18, 1, hx('#fff6c0')); sparkle(cv, 0, 15, hx('#c8c0ff'))
    cv.glow = {'c': hx('#7070e0'), 'r': 0.4}
    return cv


def ancient_a():
    cv = Cv(); C = hx('#7c7868')
    base(cv, C, spine=hx('#5a5648'))
    G, G2, G3 = hx('#f0d070'), hx('#c09a38'), hx('#8a6a20')
    cv.pat(4, 5, ['GGG', 'Gg.', 'G..'], {'G': G, 'g': G2}); cv.pat(10, 5, ['GGG', '.gG', '..G'], {'G': G, 'g': G2})
    cv.pat(4, 15, ['G..', 'Gg.', 'GGG'], {'G': G2, 'g': G3}); cv.pat(10, 15, ['..G', '.gG', 'GGG'], {'G': G2, 'g': G3})
    cv.pat(5, 8, ['c.c.c.c', '.......'], {'c': dk(C, .35)})
    cv.pat(5, 10, ['.GGG.', 'GeEeG', 'GEhEG', '.GGG.'], {'G': G2, 'e': hx('#1a8a5a'), 'E': hx('#2ac87a'), 'h': hx('#b8ffd8')})
    return cv


def ancient_b():
    cv = Cv(); C = hx('#5e7a5c')
    base(cv, C, spine=hx('#3e5a40'), band=hx('#c8a050'))
    G, G2 = hx('#f0c860'), hx('#b08830')
    cv.pat(4, 7, ['..g.g..', '.GGGGG.', 'gGgGgGg', '.GGGGG.', 'gGgGgGg', '.GGGGG.', '..g.g..'], {'G': G, 'g': G2})
    cv.pat(6, 9, ['.r.', 'rRr', '.r.'], {'r': hx('#d05a30'), 'R': hx('#ff9a50')})
    for (x, y) in [(5, 6), (11, 6), (5, 16), (11, 16)]: cv.set(x, y, hx('#d8c8a0'))
    return cv


def myth_a():
    cv = Cv(); C = hx('#9a1424')
    base(cv, C, spine=hx('#5a0a14'), band=hx('#f0c050'))
    G, G2 = hx('#ffe08a'), hx('#d09a30')
    for x in range(4, 13): cv.set(x, 6, G2); cv.set(x, 16, G2)
    for y in range(6, 17): cv.set(4, y, G2); cv.set(12, y, G2)
    cv.pat(5, 8, ['G.....G', '.GrrrG.', '.rRRrr.', '.rRrrr.', '.rrrrd.', '.GrddG.', 'G.....G'], {'G': G, 'r': hx('#e03040'), 'R': hx('#ffb0b0'), 'd': hx('#8a1020')})
    for (x, y) in [(8, 7), (8, 15), (4, 11), (12, 11)]: cv.set(x, y, G)     # 테 가운데 금 못
    for (x, y, c) in [(0, 3, '#ffd070'), (19, 6, '#ff9a40'), (0, 12, '#ff7a30'), (19, 18, '#ffd070'), (18, 0, '#ffe8a0')]: cv.set(x, y, hx(c))
    cv.glow = {'c': hx('#ffb040'), 'r': 0.55}
    return cv


def myth_b():
    cv = Cv(); C = hx('#e8dcc0')
    base(cv, C, spine=hx('#c0a060'), band=hx('#fff4b0'))
    G, G2 = hx('#f0c040'), hx('#c89020')
    cv.pat(4, 8, ['G.......G', 'GG.....GG', 'gGG.o.GGg', '.gGgOgGg.', '..ggOgg..', '....g....'], {'G': G, 'g': G2, 'o': hx('#ff8a40'), 'O': hx('#ffd080')})
    for (x, y) in [(0, 0), (19, 0), (0, 19), (19, 19), (9, 0), (0, 9)]: cv.set(x, y, hx('#fff4b0'))
    cv.glow = {'c': hx('#fff0a0'), 'r': 0.6}
    return cv


TIERS = [
    ('찢어진 스킬북', '공용 · 일반', torn_a, torn_b, ('A 비스듬히 찢겨 첫 장이 드러남', 'B 가운데가 갈라져 테이프로 붙임')),
    ('낡은 스킬북', '1차 · 고급', old_a, old_b, ('A 닳은 가죽 · 녹슨 버클 띠', 'B 노끈으로 묶음')),
    ('빛바랜 스킬북', '2차 · 희귀', faded_a, faded_b, ('A 바랜 푸른 천 · 은 모서리', 'B 바랜 청록 · 금 테두리')),
    ('신비한 스킬북', '3차 · 영웅', myst_a, myst_b, ('A 빛나는 마법진(마름모 보석) · 보랏빛 책장', 'B 별자리')),
    ('고대의 스킬북', '4차 · 전설', ancient_a, ancient_b, ('A 돌 표지 · 금 모서리 · 에메랄드', 'B 녹청 청동 · 해 원반')),
    ('신화 속 스킬북', '5차 · 신화', myth_a, myth_b, ('A 진홍 · 금 세공 · 둥근 루비', 'B 상아 · 금 날개 · 빛살')),
]

# ───────── 펼쳐서 나오는 스킬북: 직업 문장 (7×7, 여러 색 — 한 색이면 칼이 십자처럼 보여서) ─────────
SC = {'Y': '#fff0b0', 'y': '#d8b860', 'B': '#eef2f6', 'b': '#a8b2c0', 'G': '#f0c040', 'g': '#b88a20', 'h': '#7a4a26', 'W': '#d89a50', 'w': '#f4ead0',
      'A': '#e8d8b0', 'a': '#cfd6e0', 'f': '#e05a4a', 'H': '#f4e2a8', 's': '#fff8d0', 'k': '#1a1410'}
SIGIL = {
    'warrior': ['.....BB', '....BBb', '...BBb.', 'G.BBb..', '.GBb...', '.hG....', 'h.g....'],      # 비스듬한 검 (세운 검은 십자처럼 보여서)
    'archer':  ['.w..WW.', '.w...W.', '.w....W', 'fAAAAAa', '.w....W', '.w...W.', '.w..WW.'],      # 활 (나무 활대 · 시위) + 건 화살
    'mage':    ['....H..', '...HH..', '...HH..', '..HsHH.', '..HHHH.', '.GGGGG.', 'HHHHHHH'],      # 뾰족 모자 · 별 · 금 띠
    'cleric':  ['Y..Y..Y', '.Y.Y.Y.', '..YYY..', 'YYYyYYY', '..YYY..', '.Y.Y.Y.', 'Y..Y..Y'],      # 햇살
    'rogue':   ['.......', 'Y.....Y', 'YYYYYYY', 'Yk.Y.kY', 'YYYYYYY', '.Y...Y.', '.......'],      # 눈가리개 가면 (입 없음)
    'porter':  ['..YYY..', '.Y.Y.Y.', 'Y..Y..Y', 'YYYyYYY', 'Y..Y..Y', '.Y.Y.Y.', '..YYY..'],      # 수레바퀴
    'all':     ['...Y...', '..Y.Y..', '.Y...Y.', 'Y..y..Y', '.Y...Y.', '..Y.Y..', '...Y...'],      # 마름모 별
}
SIGIL_B = {   # 다른 꼴
    'archer':  ['......a', '.....a.', '....A..', '...A...', 'f.A....', '.f.....', 'f.f....'],      # 비스듬히 나는 화살
    'mage':    ['....s.s', '.....H.', '....s.s', '...W...', '..W....', '.W.....', 'W......'],      # 반짝이는 마법 지팡이
    'rogue':   ['B.....B', '.B...B.', '..B.B..', '...G...', '..h.h..', '.h...h.', 'g.....g'],      # 엇갈린 단검 둘
    'warrior': ['...GG..', '.BBBBG.', 'BBBBBBb', 'BkkkkkB', 'BBbBbbb', 'BbbBbbb', '.bbbbb.'],      # 깃 장식 투구 (눈 틈은 가로 한 줄만)
}
CLS = [('warrior', '전사', '#c0392b'), ('archer', '궁수', '#4f9a3a'), ('mage', '마법사', '#7a4ac8'), ('cleric', '성직자', '#d9b44a'),
       ('rogue', '도적', '#5a5a6a'), ('porter', '짐꾼', '#9a7a4f'), ('all', '공용', '#4a8ac8')]
QCOL = ['#b0a898', '#7bd36a', '#6ab0ff', '#c07af0', '#f0b43c', '#ff6a5a', '#fff4b0']


def skill_a(cls, col, grade, alt=False):
    cv = Cv(); C = hx(col)
    base(cv, C, band=hx('#e8c860'))
    sig = (SIGIL_B if alt and cls in SIGIL_B else SIGIL)[cls]
    cv.pat(5, 8, sig, {k: hx(v) for k, v in SC.items()})
    # 책갈피 끈 (레어도 색): 책 아래로 늘어진다
    R = hx(QCOL[grade])
    for yy in range(FY1, 20): cv.set(10, yy, R); cv.set(11, yy, dk(R, .25))
    cv.set(9, 19, K); cv.set(12, 19, K); cv.set(9, 18, K); cv.set(12, 18, K)
    return cv


def skill_b(cls, col, grade, alt=False):
    cv = Cv(); C = hx(col)
    base(cv, C)
    R = hx(QCOL[grade])
    for x in range(4, 13): cv.set(x, 6, R); cv.set(x, 16, dk(R, .2))
    cv.rect(4, 7, 12, 15, dk(C, .55))
    sig = (SIGIL_B if alt and cls in SIGIL_B else SIGIL)[cls]
    cv.pat(5, 8, sig, {k: hx(v) for k, v in SC.items()})
    for (x, y0) in [(4, 5), (12, 5), (4, 17), (12, 17)]: cv.set(x, y0, hx('#e8d090'))
    return cv
