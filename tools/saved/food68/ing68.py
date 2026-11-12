"""빌드 68 시안: 식재료 · 요리 그림 20x20 (python3 ing68.py <출력 json> <미리보기 png>)"""
import sys, json, math
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from px68 import Ico, finish, png_url, mix, hx, seams, ribbon
from PIL import Image

ICONS = {}
def reg(key, name, cat, src, grade, im, desc=''):
    ICONS[key] = dict(name=name, cat=cat, src=src, grade=grade, im=im, desc=desc)

def arcpts(cx, cy, r, a0, a1, n):
    return [(cx + r * math.cos(a0 + (a1 - a0) * i / (n - 1)), cy + r * math.sin(a0 + (a1 - a0) * i / (n - 1))) for i in range(n)]

# ── 하르겐 시장 특산 ──
def potato():
    ic = Ico(); ic.mat('p', '#c89a5a', '#e2bc7c', '#94683a', hi='#f4d8a0')
    ic.ell(10.5, 10, 7.6, 5.4, 'p', ang=-0.32); ic.ell(5.8, 12.6, 3.4, 3.0, 'p'); ic.ell(15.2, 7.4, 2.6, 2.4, 'p')
    post = []
    for x, y in ((8, 9), (12, 12), (14, 8), (6, 13)): post += [(x, y, '#7a5028'), (x - 1, y - 1, '#f0d29a')]
    return finish(ic, post)
def onion():
    ic = Ico(); ic.mat('o', '#d0883a', '#eeae58', '#985620', hi='#fad49a'); ic.mat('t', '#a8743a', '#c8965c', '#76461e')
    ic.ell(10, 12.2, 6.9, 5.7, 'o'); ic.poly([(7.6, 8.2), (12.4, 8.2), (10.9, 3.6), (9.1, 3.6)], 'o'); ic.poly([(9.2, 3.8), (10.8, 3.8), (10.5, 1.1), (9.5, 1.1)], 't')
    ic.shade(); im = ic.render(); P = im.load()
    for y in range(8, 18):
        w = 6.9 * math.sqrt(max(0, 1 - ((y + .5 - 12.2) / 5.7) ** 2))
        for k in (-0.5, 0.5):
            x = int(10 + k * w)
            if 0 <= x < 20 and P[x, y][3] and P[x, y] != hx('#eeae58'): P[x, y] = mix('#d0883a', '#985620', 0.55)
    for x in (9, 10, 11): P[x, 18] = hx('#e8d8a8')
    P[8, 18] = hx('#cdbb8a'); P[12, 18] = hx('#cdbb8a')
    return im
def carrot():
    ic = Ico(); ic.mat('c', '#e8802a', '#f8a852', '#b45616', hi='#ffd08a'); ic.mat('l', '#5aa83a', '#86cc54', '#2e6e24')
    ic.poly([(12.4, 3.4), (16.6, 7.6), (4.0, 17.6), (2.6, 16.2)], 'c'); ic.ell(14.5, 5.5, 2.9, 2.9, 'c')
    ic.ell(16.4, 2.6, 1.3, 2.4, 'l', ang=0.75); ic.ell(18.0, 4.8, 1.1, 2.0, 'l', ang=1.35); ic.ell(14.2, 1.8, 1.0, 1.9, 'l', ang=0.2)
    post = []
    for t in (0.32, 0.52, 0.72):
        cx, cy = 14.5 + (3.3 - 14.5) * t, 5.5 + (16.9 - 5.5) * t
        post += [(int(cx + 0.9), int(cy + 0.9), '#b45616'), (int(cx + 1.6), int(cy + 1.6), '#b45616')]
    return finish(ic, post)
def cabbage():
    ic = Ico(); ic.mat('a', '#58a442', '#7ec458', '#337228', hi='#c0eaa0'); ic.mat('b', '#8ccc62', '#b4e68a', '#5e9e40', hi='#e4fac4')
    ic.ell(10, 11, 8, 7.3, 'a'); ic.ell(10, 9.6, 4.2, 4.0, 'b')
    ic.shade(); im = ic.render(); P = im.load(); V, D = hx('#d6f2b4'), hx('#2e6a24')
    for side in (-1, 1):   # 겹친 잎 가장자리: 아래에서 위로 휜 활꼴 (빛 줄 + 바깥 그늘)
        for y in range(5, 18):
            t = (y - 5) / 12; x = round(10 + side * (2.2 + 3.6 * math.sin(t * math.pi)))
            if P[x, y][3]: P[x, y] = V
            xo = x + side
            if 0 <= xo < 20 and P[xo, y][3] and ic.m[y][xo] == 'a': P[xo, y] = D
    for y in range(13, 18): P[10, y] = V
    return im
reg('hg_potato', '하르겐 감자', 'veg', 'hargen', 0, potato(), '하르겐 시장 · 포슬포슬한 감자')
reg('hg_onion', '하르겐 양파', 'veg', 'hargen', 0, onion(), '하르겐 시장 · 단맛이 도는 양파')
reg('hg_carrot', '하르겐 당근', 'veg', 'hargen', 0, carrot(), '하르겐 시장 · 아삭한 당근')
reg('hg_cabbage', '하르겐 양배추', 'veg', 'hargen', 0, cabbage(), '하르겐 시장 · 겹겹이 단단한 양배추')

# ── 나라 특산 (방문 상단) ──
def pea():
    ic = Ico(); ic.mat('d', '#5aa83a', '#84cc56', '#2e6c22'); ic.mat('i', '#3e7e2a', '#4e8e34', '#2a5a1e')
    A = -0.62; ca, sa = math.cos(A), math.sin(A)
    ic.ell(9.8, 10.6, 8.8, 4.2, 'd', ang=A); ic.ell(9.4, 10.0, 7.4, 2.6, 'i', ang=A)
    keys = []
    for j, t in enumerate((-5.0, -1.7, 1.6, 4.9)):
        k = 'e%d' % j; keys.append(k); ic.mat(k, '#86d44c', '#b4f07a', '#4c9a2a', hi='#efffd0')
        ic.ell(9.4 + t * ca + 0.3 * sa, 10.0 + t * sa - 0.3 * ca, 2.05, 2.05, k)
    ic.shade(); im = ic.render(); P = im.load(); seams(ic, P, keys, '#2e6a1e')
    for (x, y) in ((17, 4), (18, 3), (18, 2)): P[x, y] = hx('#3e7a2a')
    return im
def turnip():
    ic = Ico(); ic.mat('w', '#f0ece0', '#ffffff', '#c8c0b0'); ic.mat('u', '#9a4a9a', '#c070c0', '#6a2a6a', hi='#e0a0e0'); ic.mat('f', '#5aa83a', '#84cc56', '#2e6c22')
    ic.ell(10, 12, 6.2, 5.4, 'w'); ic.poly([(8.8, 16.4), (11.2, 16.4), (10.4, 19.0), (9.8, 19.0)], 'w')
    for y in range(20):
        for x in range(20):
            if ic.m[y][x] == 'w' and y < 11 - (1 if abs(x - 10) > 4 else 0): ic.m[y][x] = 'u'
    ic.ell(7.2, 4.0, 1.7, 3.2, 'f', ang=-0.55); ic.ell(12.8, 4.0, 1.7, 3.2, 'f', ang=0.55); ic.ell(10, 3.2, 1.4, 3.0, 'f')
    return finish(ic)
def tomato():
    ic = Ico(); ic.mat('r', '#d83a2a', '#f8664a', '#a0221a', hi='#ffb0a0'); ic.mat('g', '#4a9a3a', '#6abc4a', '#2a6a24')
    ic.ell(10, 11.8, 7.6, 6.6, 'r'); ic.ell(6.4, 11.2, 3.8, 5.0, 'r'); ic.ell(13.8, 11.2, 3.8, 5.0, 'r')
    ic.shade(); im = ic.render(); P = im.load(); G, D = hx('#4e9e3a'), hx('#2a6a24')
    for (x, y) in ((9, 6), (10, 6), (11, 6), (8, 6), (7, 7), (6, 7), (12, 6), (13, 7), (14, 7), (9, 7), (8, 8), (11, 7), (12, 8)): P[x, y] = G
    for (x, y) in ((6, 7), (14, 7), (8, 8), (12, 8)): P[x, y] = D
    for (x, y) in ((10, 5), (10, 4), (11, 3), (12, 3)): P[x, y] = hx('#3e7a2a')
    return im
def olive():
    ic = Ico(); ic.mat('l', '#9ab07a', '#c4d6a4', '#647a4c')
    for (cx, cy, a) in ((6.0, 5.2, -0.9), (10.4, 3.4, 0.35), (14.6, 4.2, -0.7)): ic.ell(cx, cy, 3.0, 1.15, 'l', ang=a)
    ic.mat('o1', '#7e8e2c', '#a8bc4a', '#4c5a18', hi='#e0f09a'); ic.mat('o2', '#5a3a5a', '#8a5a8a', '#38203a', hi='#d0a8d0')
    ic.ell(7.6, 12.8, 3.3, 2.6, 'o1', ang=0.5); ic.ell(13.4, 12.2, 3.3, 2.6, 'o2', ang=0.4)
    ic.shade(); im = ic.render(); P = im.load(); B = hx('#7a5230')
    for (x, y) in ((2, 9), (3, 9), (4, 8), (5, 8), (6, 7), (7, 7), (8, 7), (9, 6), (10, 6), (11, 6), (12, 6), (13, 7), (14, 7), (15, 7), (16, 6), (17, 6)): P[x, y] = B
    for (x, y) in ((7, 8), (7, 9), (13, 8), (13, 9)): P[x, y] = hx('#6a4628')
    return im
def lettuce():
    ic = Ico(); ic.mat('a', '#5eae46', '#86d066', '#367a2a'); ic.mat('c', '#5eae46', '#86d066', '#367a2a'); ic.mat('b', '#9ade6e', '#c8f49e', '#6cb24a', hi='#f0ffe0'); ic.mat('s', '#eef6dc', '#ffffff', '#c4d8a8')
    ic.ell(6.0, 10.4, 3.2, 6.4, 'a', ang=-0.42); ic.ell(14.0, 10.4, 3.2, 6.4, 'c', ang=0.42); ic.ell(10, 8.8, 3.6, 7.4, 'b')
    for (cx, cy) in ((3.0, 6.0), (4.6, 3.6), (17.0, 6.0), (15.4, 3.6)): ic.ell(cx, cy, 1.5, 1.4, 'a' if cx < 10 else 'c')
    for (cx, cy) in ((8.0, 2.4), (10.2, 1.6), (12.2, 2.4)): ic.ell(cx, cy, 1.5, 1.4, 'b')
    ic.rect(8, 16, 4, 3, 's')
    ic.shade(); im = ic.render(); P = im.load()
    for y in range(4, 17): P[10, y] = hx('#eaf8d4')
    for (x, y) in ((6, 8), (6, 10), (7, 12), (14, 8), (14, 10), (13, 12)): P[x, y] = hx('#a8dc84')
    P[12, 6], P[13, 6], P[12, 7], P[13, 7] = hx('#ffffff'), hx('#bfeaff'), hx('#bfeaff'), hx('#6ab8e8')
    return im
def silvershroom():
    ic = Ico(); ic.mat('c', '#c8c8e4', '#f0f0ff', '#8a8ab0', hi='#ffffff'); ic.mat('k', '#c8c8e4', '#f0f0ff', '#8a8ab0', hi='#ffffff')
    ic.mat('s', '#ece4cc', '#fffaf0', '#bcb090'); ic.mat('t', '#ece4cc', '#fffaf0', '#bcb090')
    ic.ell(8.6, 9.0, 6.6, 5.2, 'c')
    for y in range(9, 20):
        for x in range(20):
            if ic.m[y][x] == 'c': ic.m[y][x] = None
    ic.rect(6, 9, 5, 7, 's'); ic.ell(8.5, 16.4, 3.0, 1.6, 's')
    ic.ell(15.0, 13.2, 3.6, 3.0, 'k')
    for y in range(13, 20):
        for x in range(20):
            if ic.m[y][x] == 'k': ic.m[y][x] = None
    ic.rect(14, 13, 2, 5, 't')
    ic.shade(); im = ic.render(); P = im.load()
    for x in range(3, 15): 
        if ic.m[9][x] == 's' or (P[x, 9][3] and x not in (6, 7, 8, 9, 10)): P[x, 9] = hx('#7a7a9a')
    for x in range(12, 19):
        if P[x, 13][3] and x not in (14, 15): P[x, 13] = hx('#7a7a9a')
    for (x, y) in ((4, 2), (17, 9), (2, 13)): P[x, y] = hx('#f0f0ff')
    return im
def beet():
    ic = Ico(); ic.mat('b', '#9a1a3a', '#c83a5c', '#640a26', hi='#f08aa0'); ic.mat('f', '#4a9a3a', '#6abc4a', '#2a6a24')
    ic.ell(10, 11.8, 6.4, 5.6, 'b'); ic.poly([(8.4, 16.4), (11.6, 16.4), (10.5, 19.0), (9.9, 19.0)], 'b')
    ic.ell(5.4, 2.8, 2.2, 1.5, 'f', ang=-0.4); ic.ell(14.6, 2.8, 2.2, 1.5, 'f', ang=0.4); ic.ell(10, 1.8, 1.4, 1.6, 'f')
    ic.shade(); im = ic.render(); P = im.load(); R = hx('#b02a4a')
    for (x, y) in ((9, 6), (8, 5), (7, 4), (10, 6), (10, 5), (10, 4), (10, 3), (11, 6), (12, 5), (13, 4)): P[x, y] = R
    return im
def garlic():
    ic = Ico(); ic.mat('a', '#eeeae2', '#ffffff', '#c4bcb0', hi='#ffffff'); ic.mat('b', '#eeeae2', '#ffffff', '#c4bcb0'); ic.mat('c', '#eeeae2', '#ffffff', '#c4bcb0')
    ic.ell(6.4, 12.8, 3.6, 4.8, 'a'); ic.ell(13.6, 12.8, 3.6, 4.8, 'c'); ic.ell(10, 12.2, 3.9, 5.6, 'b'); ic.poly([(8.4, 8.0), (11.6, 8.0), (10.6, 3.2), (9.4, 3.2)], 'b')
    ic.shade(); im = ic.render(); P = im.load()
    for (x, y) in ((9, 3), (10, 2), (10, 1)): P[x, y] = hx('#c8b890')
    for (x, y) in ((5, 15), (6, 16), (14, 15), (13, 16), (10, 16)): P[x, y] = hx('#c8a8d0')
    for x in (8, 9, 10, 11, 12): P[x, 18] = hx('#d8c8a0')
    return im
def chili():
    ic = Ico(); ic.mat('r', '#d82a1a', '#f85a3a', '#9a1a10', hi='#ffb090'); ic.mat('g', '#4a9a3a', '#6abc4a', '#2a6a24')
    for i in range(16):
        t = i / 15; x = (1 - t) ** 2 * 14.2 + 2 * (1 - t) * t * 12.5 + t * t * 3.8; y = (1 - t) ** 2 * 5.6 + 2 * (1 - t) * t * 14.6 + t * t * 16.6
        r = 3.0 - 2.2 * t; ic.ell(x, y, r, r, 'r')
    ic.ell(14.6, 4.6, 2.6, 1.6, 'g', ang=0.3)
    ic.shade(); im = ic.render(); P = im.load()
    for (x, y) in ((15, 3), (16, 2), (16, 1)): P[x, y] = hx('#3e7a2a')
    for (x, y) in ((12, 8), (11, 10), (10, 12), (8, 14)): P[x, y] = hx('#ff9a7a')
    return im
def dates():   # 사막 선인장 열매 (손바닥 선인장 + 붉은 열매)
    ic = Ico(); ic.mat('p', '#5a9a4a', '#80c06a', '#336a2c', hi='#c4ecb0'); ic.mat('q', '#4e8c40', '#72b05c', '#2c5e26')
    ic.ell(9.4, 12.4, 5.4, 6.0, 'p', ang=-0.15); ic.ell(15.0, 9.6, 3.0, 3.8, 'q', ang=0.5)
    ic.mat('f0', '#d8306a', '#f8608e', '#9a1a48', hi='#ffc0d4'); ic.mat('f1', '#d8306a', '#f8608e', '#9a1a48', hi='#ffc0d4')
    ic.ell(7.6, 5.2, 2.0, 2.5, 'f0'); ic.ell(11.6, 4.8, 2.0, 2.5, 'f1')
    ic.shade(); im = ic.render(); P = im.load(); seams(ic, P, ['p', 'q', 'f0', 'f1'], '#24481e')
    for (x, y) in ((7, 10), (11, 9), (8, 14), (12, 13), (10, 16), (6, 13), (15, 8), (16, 11)): P[x, y] = hx('#f4f0c0')
    return im
reg('in_pea', '기사단 완두', 'veg', 'inglisia', 1, pea(), '잉그리시아 상단 · 꼬투리째 달콤한 완두')
reg('in_turnip', '잉그리시아 순무', 'veg', 'inglisia', 1, turnip(), '잉그리시아 상단 · 보랏빛 어깨의 순무')
reg('fr_tomato', '프라마 토마토', 'veg', 'frama', 1, tomato(), '프라마 상단 · 남쪽 햇볕에 익은 토마토')
reg('fr_olive', '햇살 올리브', 'veg', 'frama', 1, olive(), '프라마 상단 · 기름이 도는 올리브')
reg('el_lettuce', '이슬 상추', 'veg', 'elves', 1, lettuce(), '엘프 상단 · 아침 이슬을 머금은 상추')
reg('el_mush', '실바레아 은버섯', 'veg', 'elves', 1, silvershroom(), '엘프 상단 · 은빛으로 반짝이는 버섯')
reg('dw_beet', '브론하임 비트', 'veg', 'dwarves', 1, beet(), '드워프 상단 · 붉고 단단한 뿌리')
reg('dw_garlic', '바위 마늘', 'veg', 'dwarves', 1, garlic(), '드워프 상단 · 바위틈에서 자란 매운 마늘')
reg('sr_chili', '모래 고추', 'veg', 'sarak', 1, chili(), '사라크 상단 · 혀가 타는 붉은 고추')
reg('sr_cactus', '선인장 열매', 'veg', 'sarak', 1, dates(), '사라크 상단 · 가시를 벗기면 새콤달콤')

# ── 해상왕국 해산물 ──
def mackerel():
    ic = Ico(); ic.mat('k', '#3a6a8a', '#5a8eaa', '#22445e'); ic.mat('w', '#dce8f0', '#ffffff', '#a8bccb', hi='#ffffff'); ic.mat('t', '#3a6a8a', '#5a8eaa', '#22445e')
    ic.ell(9.2, 10.6, 7.6, 3.7, 'w')
    for y in range(20):
        for x in range(20):
            if ic.m[y][x] == 'w' and y < 10: ic.m[y][x] = 'k'
    ic.poly([(15.6, 10.6), (18.8, 7.4), (18.0, 10.6), (18.8, 13.8)], 't'); ic.poly([(8.4, 7.2), (12.6, 7.0), (10.4, 5.4)], 'k')
    ic.shade(); im = ic.render(); P = im.load()
    for (x, y) in ((7, 8), (8, 9), (10, 8), (11, 9), (13, 8), (14, 9)): P[x, y] = hx('#1a3448')
    for (x, y) in ((5, 9), (5, 10), (5, 11), (4, 12)): P[x, y] = hx('#7a90a0')
    P[3, 10] = hx('#101820'); P[3, 9] = hx('#ffffff')
    return im
def shrimp():
    ic = Ico(); pts = arcpts(10, 10.2, 5.4, math.radians(205), math.radians(-40), 9)
    for i, (x, y) in enumerate(pts):
        k = 's%d' % (i % 2); ic.mat(k, '#e8683a', '#ff9a6a', '#b2401c', hi='#ffd0b0'); r = 3.1 - 1.6 * i / 8; ic.ell(x, y, r, r, k)
    ic.mat('f', '#e8683a', '#ff9a6a', '#b2401c'); tx, ty = pts[-1]; ic.poly([(tx, ty), (tx + 4.2, ty + 0.4), (tx + 2.0, ty + 3.8)], 'f')
    ic.shade(); im = ic.render(); P = im.load()
    hx0, hy0 = pts[0]; P[int(hx0) - 1, int(hy0) - 1] = hx('#101010')
    for (x, y) in ((3, 9), (2, 8), (2, 7), (3, 6), (4, 5), (5, 4), (4, 8), (4, 7), (5, 6), (6, 5)): P[x, y] = hx('#c85a30')
    for (x, y) in ((7, 15), (8, 16), (10, 16), (11, 17), (12, 15), (13, 16)): P[x, y] = hx('#b2401c')
    return im
def clam():
    ic = Ico(); ic.mat('c', '#eab48a', '#fbd8b4', '#b6764a', hi='#fff0e0'); ic.mat('h', '#eab48a', '#fbd8b4', '#b6764a')
    ic.poly([(10, 16.6)] + [(10 + 8.3 * math.cos(math.radians(a)), 16.6 - 13.2 * math.sin(math.radians(a))) for a in range(12, 169, 6)], 'c')
    ic.poly([(6.4, 15.6), (13.6, 15.6), (14.4, 18.6), (5.6, 18.6)], 'h')
    ic.shade(); im = ic.render(); P = im.load(); R, L = hx('#a8663c'), hx('#fff0dc')
    for a in (28, 52, 76, 100, 124, 148):
        for r in range(2, 14):
            x, y = round(10 + r * 0.62 * math.cos(math.radians(a))), round(16.6 - r * math.sin(math.radians(a)))
            if 0 <= x < 20 and 0 <= y < 20 and ic.m[y][x] == 'c':
                P[x, y] = R
                xl = x - 1 if a < 90 else x + 1
                if 0 <= xl < 20 and ic.m[y][xl] == 'c' and P[xl, y] != R: P[xl, y] = L
    for x in range(6, 15): P[x, 16] = hx('#b6764a')
    return im
def crab():
    ic = Ico(); ic.mat('b', '#d8502a', '#f4784a', '#9e2e14', hi='#ffb090'); ic.mat('l', '#d8502a', '#f4784a', '#9e2e14'); ic.mat('r', '#d8502a', '#f4784a', '#9e2e14')
    ic.ell(10, 12.4, 6.2, 4.0, 'b'); ic.ell(3.8, 6.0, 2.5, 2.2, 'l'); ic.ell(16.2, 6.0, 2.5, 2.2, 'r')
    for k, x in (('l', 3), ('r', 16)):
        for (dx, dy) in ((0, -2), (1, -2), (0, -1)) if k == 'l' else ((0, -2), (-1, -2), (0, -1)):
            if ic.m[6 + dy][x + dx] == k: ic.m[6 + dy][x + dx] = None
    ic.shade(); im = ic.render(); P = im.load(); A, D = hx('#c8462a'), hx('#8a2a12')
    for (x, y) in ((5, 9), (5, 8), (4, 8), (14, 9), (14, 8), (15, 8)): P[x, y] = A
    for (x, y) in ((4, 13), (3, 14), (2, 15), (4, 15), (3, 16), (5, 16), (4, 17), (15, 13), (16, 14), (17, 15), (15, 15), (16, 16), (14, 16), (15, 17)): P[x, y] = D
    for (x, y) in ((8, 8), (8, 7), (12, 8), (12, 7)): P[x, y] = hx('#c8462a')
    P[8, 6], P[12, 6] = hx('#101010'), hx('#101010')
    return im
def squid():
    ic = Ico(); ic.mat('m', '#f2d4dc', '#fff0f4', '#c4949e', hi='#ffffff'); ic.mat('t', '#eac2cc', '#f8dce2', '#b8848e')
    ic.poly([(10, 1.2), (14.6, 9.6), (5.4, 9.6)], 'm'); ic.ell(10, 7.6, 4.4, 4.2, 'm'); ic.poly([(6.2, 4.4), (3.4, 7.6), (6.4, 7.6)], 'm'); ic.poly([(13.8, 4.4), (16.6, 7.6), (13.6, 7.6)], 'm')
    ic.ell(10, 11.0, 4.0, 2.2, 't')
    for i, x0 in enumerate((6.5, 8.5, 10.5, 12.5)):
        for y in range(12, 19):
            x = int(x0 + math.sin((y - 12) * 0.9 + i) * 0.8); ic.put(x, y, 't')
    ic.shade(); im = ic.render(); P = im.load()
    for (x, y) in ((9, 4), (11, 6), (8, 7), (12, 8)): P[x, y] = hx('#b06a9a')
    P[8, 11], P[12, 11] = hx('#101010'), hx('#101010')
    return im
def kelp():
    ic = Ico()
    for j, (pts, w, base) in enumerate((
        ([(9.0 + 2.4 * math.sin(y * 0.62), y) for y in [18.4 - i * 0.5 for i in range(32)]], 4.6, '#6a6a24'),
        ([(13.6 + 1.8 * math.sin(y * 0.7 + 2.0), y) for y in [18.4 - i * 0.5 for i in range(24)]], 3.6, '#5a5a1e'))):
        k = 'k%d' % j; ic.mat(k, base, mix(base, '#d8d890', 0.35), mix(base, '#000000', 0.42))
        n = len(pts); L, R = [], []
        for i, (x, y) in enumerate(pts):
            a0, b0 = pts[max(0, i - 1)], pts[min(n - 1, i + 1)]; dx, dy = b0[0] - a0[0], b0[1] - a0[1]; m = math.hypot(dx, dy) or 1
            ww = w * (0.55 + 0.45 * math.sin(math.pi * min(1, i / (n * 0.9)))) * (1 + 0.18 * math.sin(i * 1.9)) / 2
            L.append((x - dy / m * ww, y + dx / m * ww)); R.append((x + dy / m * ww, y - dx / m * ww))
        ic.poly(L + R[::-1], k)
    ic.mat('h', '#4a3a1e', '#6a5430', '#2a2010'); ic.ell(10.6, 18.4, 3.0, 1.2, 'h')
    ic.shade(); im = ic.render(); P = im.load()
    for y in range(4, 18):
        x = round(9.0 + 2.4 * math.sin((y + 0.5) * 0.62))
        if ic.m[y][x] == 'k0': P[x, y] = hx('#a8a858')
    for (x, y) in ((5, 3), (16, 4), (4, 9)): P[x, y] = hx('#cfe8f4')
    return im
reg('sea_mackerel', '은빛 고등어', 'sea', 'sea', 2, mackerel(), '해상왕국 · 등이 푸른 고등어')
reg('sea_shrimp', '붉은 새우', 'sea', 'sea', 2, shrimp(), '해상왕국 · 통통한 새우')
reg('sea_clam', '가리비', 'sea', 'sea', 2, clam(), '해상왕국 · 쫄깃한 관자의 조개')
reg('sea_crab', '꽃게', 'sea', 'sea', 2, crab(), '해상왕국 · 살이 꽉 찬 게')
reg('sea_squid', '오징어', 'sea', 'sea', 2, squid(), '해상왕국 · 쫄깃한 오징어')
reg('sea_kelp', '다시마', 'sea', 'sea', 2, kelp(), '해상왕국 · 말린 바다 잎')

# ── 알 ──
def egg():
    ic = Ico(); ic.mat('e', '#f0e6d0', '#fffaf0', '#c8b898', hi='#ffffff')
    ic.ell(10, 12.0, 5.8, 6.4, 'e'); ic.ell(10, 8.6, 4.4, 5.2, 'e')
    ic.shade(); im = ic.render(); P = im.load()
    for (x, y) in ((8, 12), (12, 9), (11, 14), (13, 13)): P[x, y] = hx('#d8c8a8')
    return im
reg('egg_none', '무정란', 'egg', 'pen', 1, egg(), '사육장에서 품었지만 깨어나지 않은 알 · 요리 재료')


# ── 기본 재료 (하르겐 시장 · 새 그림) ──
def meat():
    ic = Ico(); ic.mat('m', '#c8443a', '#e8706a', '#8a2420', hi='#ffb0a0'); ic.mat('b', '#f0ecdc', '#ffffff', '#c4bca8')
    ic.ell(11.6, 8.6, 6.6, 5.8, 'm', ang=0.6); ic.ell(8.6, 11.0, 3.4, 3.0, 'm')
    for i in range(7): ic.ell(6.6 - i * 0.62, 13.2 + i * 0.62, 1.3, 1.3, 'b')
    ic.ell(2.6, 16.0, 1.6, 1.6, 'b'); ic.ell(4.0, 17.4, 1.6, 1.6, 'b')
    ic.shade(); im = ic.render(); P = im.load()
    for (x, y) in ((10, 6), (11, 7), (13, 9), (14, 8), (9, 9), (12, 11), (15, 6)): P[x, y] = hx('#f4c8c0')
    return im
def flour():
    ic = Ico(); ic.mat('s', '#d8c094', '#ecd8b0', '#a88c5c', hi='#fff0d0'); ic.mat('t', '#c8ac78', '#e0c898', '#987a48')
    ic.ell(10, 12.6, 6.8, 5.6, 's'); ic.poly([(5.6, 9.0), (14.4, 9.0), (12.6, 5.4), (7.4, 5.4)], 's'); ic.poly([(7.2, 5.6), (12.8, 5.6), (13.8, 2.4), (6.2, 2.4)], 't')
    ic.shade(); im = ic.render(); P = im.load()
    for x in range(7, 13): P[x, 5] = hx('#7a5230')
    for (x, y) in ((8, 2), (10, 1), (12, 2), (9, 1), (11, 1)): P[x, y] = hx('#ffffff')
    for (x, y) in ((10, 10), (10, 11), (10, 12), (10, 13), (10, 14), (9, 11), (11, 11), (9, 13), (11, 13)): P[x, y] = hx('#a87a44')
    for (x, y) in ((15, 17), (16, 17), (17, 16), (16, 16), (3, 17), (4, 17)): P[x, y] = hx('#f8f4ec')
    return im
def spice():
    ic = Ico(); ic.mat('p', '#b4542a', '#d47a48', '#7a3216', hi='#f0a878'); ic.mat('w', '#e8962a', '#ffb850', '#b46a14', hi='#ffe0a0')
    ic.ell(9.4, 12.8, 6.0, 5.2, 'p'); ic.poly([(6.8, 8.6), (12.0, 8.6), (13.2, 4.6), (5.6, 4.6)], 'p')
    ic.ell(15.6, 16.0, 3.2, 1.8, 'w')
    ic.shade(); im = ic.render(); P = im.load()
    for x in range(6, 13): P[x, 8] = hx('#4a2a10')
    for (x, y) in ((14, 12), (15, 13), (17, 14), (13, 14), (12, 16)): P[x, y] = hx('#ffb850')
    for (x, y) in ((8, 12), (10, 14), (11, 11)): P[x, y] = hx('#e8962a')
    return im
def honey():
    ic = Ico(); ic.mat('j', '#b07a4a', '#d0a070', '#7a4e2a', hi='#f0d0a8'); ic.mat('h', '#f0b020', '#ffd85a', '#c08010', hi='#fff4b0')
    ic.ell(10, 13.2, 6.6, 5.4, 'j'); ic.rect(6, 6, 9, 3, 'j'); ic.ell(10, 6.6, 4.8, 1.6, 'h')
    ic.shade(); im = ic.render(); P = im.load(); Hc = hx('#f0b020')
    for (x, y) in ((6, 8), (6, 9), (6, 10), (7, 8), (13, 8), (13, 9), (14, 8), (14, 9), (14, 10), (14, 11), (10, 8), (10, 9)): P[x, y] = Hc
    for (x, y) in ((6, 11), (14, 12), (10, 10)): P[x, y] = hx('#ffd85a')
    for (x, y) in ((15, 2), (14, 3), (13, 4), (12, 5)): P[x, y] = hx('#c8945a')
    P[16, 1], P[16, 2], P[17, 1] = hx('#f0b020'), hx('#f0b020'), hx('#ffd85a')
    return im
reg('raw_meat', '날고기', 'meat', 'hargen', 0, meat(), '하르겐 시장 · 짐승 몬스터에게서도 나온다 (새 그림)')
reg('flour', '밀가루', 'grain', 'hargen', 0, flour(), '하르겐 시장 (새 그림)')
reg('spice', '향신료', 'grain', 'hargen', 0, spice(), '하르겐 시장 (새 그림)')
reg('honey', '야생 꿀', 'grain', 'hargen', 0, honey(), '하르겐 시장 (새 그림)')

# ── 요리 ──
def bowl(body, rim, soup, chunks=(), steam=True, extra=None):
    ic = Ico(); ic.mat('b', *body); ic.mat('r', *rim); ic.mat('s', *soup)
    ic.ell(10, 12.6, 8.2, 5.6, 'b')
    for y in range(0, 12):
        for x in range(20):
            if ic.m[y][x] == 'b': ic.m[y][x] = None
    ic.ell(10, 11.6, 8.2, 2.3, 'r'); ic.ell(10, 11.5, 6.6, 1.5, 's'); ic.rect(7, 17, 6, 2, 'b')
    ic.shade(deep=False); im = ic.render(); P = im.load()
    for x, y, c in chunks: P[x, y] = hx(c)
    if steam:
        for (x, y) in ((6, 8), (7, 7), (6, 6), (7, 5), (12, 8), (13, 7), (12, 6), (13, 5), (13, 4)): P[x, y] = (236, 236, 240, 170)
    if extra: extra(P)
    return im
WOOD = ('#a8703e', '#c89060', '#704620'); RIMW = ('#c89060', '#e8b484', '#9a6a3a')
def stew(): return bowl(WOOD, RIMW, ('#8a4a22', '#a8642e', '#6a3416'), [(7, 11, '#f08a2a'), (8, 11, '#f08a2a'), (12, 11, '#f0d070'), (13, 12, '#f0d070'), (10, 11, '#5a2a14'), (10, 12, '#5a2a14'), (11, 11, '#6ac04a')])
def omelette():
    ic = Ico(); ic.mat('p', '#e8eef4', '#ffffff', '#a8b4c4'); ic.mat('o', '#f4c844', '#ffe27a', '#c89a24', hi='#fff4b0')
    ic.ell(10, 13.4, 8.6, 4.2, 'p'); ic.ell(10, 12.0, 6.2, 3.0, 'o')
    ic.shade(deep=False); im = ic.render(); P = im.load()
    for x in range(6, 14): P[x, 12] = hx('#d8a830') if x % 2 else P[x, 12]
    for (x, y) in ((14, 10), (15, 10), (15, 11), (5, 11)): P[x, y] = hx('#5aa83a')
    for (x, y) in ((8, 10), (11, 10)): P[x, y] = hx('#c87a2a')
    return im
def seasoup():
    def ex(P):
        for (x, y) in ((13, 9), (14, 8), (15, 8), (15, 9), (14, 10)): P[x, y] = hx('#ff7a4a')
        for (x, y) in ((6, 10), (7, 10), (5, 11), (8, 11)): P[x, y] = hx('#e8d0b0')
    return bowl(('#3a6aa8', '#5a8ac8', '#244a7a'), ('#e8eef4', '#ffffff', '#a8b4c4'), ('#e0702a', '#f89a4a', '#b04a18'), [(10, 11, '#f8e0c0'), (11, 12, '#6ac04a')], extra=ex)
def sus():
    def ex(P):
        for (x, y) in ((10, 9), (11, 8), (12, 7), (13, 6), (14, 5), (12, 9), (10, 7), (14, 7), (12, 5), (15, 4), (15, 5), (14, 4)): P[x, y] = hx('#f2f0e2')
        for (x, y) in ((9, 10), (9, 9)): P[x, y] = hx('#d8d4c0')
        for (x, y) in ((5, 7), (6, 6), (5, 5), (6, 4)): P[x, y] = (170, 120, 200, 190)
    return bowl(('#7a6a5a', '#9a8a78', '#4a4036'), ('#9a8a78', '#bcae9a', '#6a5e50'), ('#7a8a5a', '#9aac70', '#566438'), [(7, 11, '#c4d4a0'), (8, 12, '#c4d4a0'), (12, 11, '#c4d4a0')], steam=False, extra=ex)
reg('food_stew', '고기 스튜', 'dish', 'kitchen', 1, stew(), '날고기 2 · 하르겐 감자 · 하르겐 당근')
reg('food_omelet', '감자 오믈렛', 'dish', 'kitchen', 1, omelette(), '무정란 2 · 하르겐 감자 · 하르겐 양파')
reg('food_seasoup', '해물 수프', 'dish', 'kitchen', 2, seasoup(), '고등어 · 새우 · 가리비 · 양파')
reg('food_sus', '수상한 죽', 'dish', 'kitchen', 0, sus(), '레시피에 없는 조합 · 펫 먹이로는 그럭저럭')


# ── 레시피 (왕국 상단 · 해상왕국 배가 판다, 100,000G) ──
def recipe():
    ic = Ico(); ic.mat('p', '#efe0bc', '#fff6dc', '#c4ac80', hi='#ffffff'); ic.mat('c', '#d8c49a', '#ecdcb4', '#a88c60')
    ic.rect(4, 3, 12, 15, 'p'); ic.rect(3, 2, 14, 2, 'c'); ic.rect(3, 17, 14, 2, 'c')
    ic.shade(deep=False); im = ic.render(); P = im.load()
    for x in range(7, 14): P[x, 9] = hx('#a8703e')
    for x in range(8, 13): P[x, 10] = hx('#a8703e')
    for x in range(9, 12): P[x, 11] = hx('#7a4a22')
    for x in range(7, 14): P[x, 8] = hx('#8a4a22') if x % 2 else hx('#c87a3a')
    for (x, y) in ((8, 6), (9, 5), (11, 6), (12, 5)): P[x, y] = hx('#b8b8c0')
    for x in range(6, 15, 1): P[x, 13] = hx('#8a7a60') if x not in (10,) else P[x, 13]
    for x in range(6, 12): P[x, 15] = hx('#8a7a60')
    for (x, y) in ((15, 15), (16, 16), (15, 16), (16, 15)): P[x, y] = hx('#c0392b')
    P[15, 15] = hx('#e05a4a'); P[17, 17] = hx('#8a1e14'); P[16, 17] = hx('#a82a1e')
    return im
reg('recipe', '레시피', 'recipe', 'kitchen', 3, recipe(), '왕국 상단 · 해상왕국 배가 판다 (100,000G) — 사면 도감에 적힌다')

if __name__ == '__main__':
    out, prev = sys.argv[1], sys.argv[2]
    json.dump({k: dict(name=v['name'], cat=v['cat'], src=v['src'], grade=v['grade'], desc=v['desc'], url=png_url(v['im'])) for k, v in ICONS.items()}, open(out, 'w'), ensure_ascii=False)
    keys = list(ICONS); cols = 9; S = 6; W = 20 * S + 8
    sheet = Image.new('RGBA', (cols * W, ((len(keys) + cols - 1) // cols) * W), (70, 64, 80, 255))
    for i, k in enumerate(keys):
        im = ICONS[k]['im'].resize((20 * S, 20 * S), Image.NEAREST); sheet.alpha_composite(im, ((i % cols) * W + 4, (i // cols) * W + 4))
    sheet.save(prev); print(len(keys), 'icons')
