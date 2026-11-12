"""요리 그림 20×20 (빌드 65): 시안(ing68.py) 넷 말고 나머지 요리를 같은 결의 그릇 · 접시 · 잔으로"""
import math
from px68 import Ico, hx, mix
WOOD = ('#a8703e', '#c89060', '#704620'); RIMW = ('#c89060', '#e8b484', '#9a6a3a')
BLUE = ('#3a6aa8', '#5a8ac8', '#244a7a'); RIMB = ('#e8eef4', '#ffffff', '#a8b4c4')
STONE = ('#7a7a86', '#9a9aa6', '#50505a'); RIMS = ('#a8a8b4', '#c8c8d4', '#7a7a86')
def tone(c): return (c, mix(c, '#ffffff', 0.3), mix(c, '#000000', 0.32))
def bowl(kind, soup, chunks=(), steam=True, top=None):
    body, rim = {'wood': (WOOD, RIMW), 'blue': (BLUE, RIMB), 'stone': (STONE, RIMS)}[kind]
    ic = Ico(); ic.mat('b', *body); ic.mat('r', *rim); ic.mat('s', *tone(soup))
    ic.ell(10, 12.6, 8.2, 5.6, 'b')
    for y in range(0, 12):
        for x in range(20):
            if ic.m[y][x] == 'b': ic.m[y][x] = None
    ic.ell(10, 11.6, 8.2, 2.3, 'r'); ic.ell(10, 11.5, 6.6, 1.5, 's'); ic.rect(7, 17, 6, 2, 'b')
    if top: top(ic)
    ic.shade(deep=False); im = ic.render(); P = im.load()
    for x, y, c in chunks: P[x, y] = hx(c)
    if steam:
        for (x, y) in ((6, 8), (7, 7), (6, 6), (7, 5), (12, 8), (13, 7), (12, 6), (13, 5), (13, 4)): P[x, y] = hx('#e4e4ea')
    return im
def plate(fill, big=False):
    ic = Ico(); ic.mat('p', '#e8eef4', '#ffffff', '#a8b4c4')
    ic.ell(10, 14.0, 9.0 if big else 8.6, 3.8 if big else 3.4, 'p')
    fill(ic)
    ic.shade(deep=False); return ic
def dome(c):
    def f(ic): ic.mat('d', *tone(c), hi='#ffffff'); ic.ell(10, 11.4, 5.4, 4.6, 'd')
    return lambda: plate(f).render()
def sandwich():
    def f(ic):
        ic.mat('t', '#e0b878', '#f4d8a0', '#a8804a'); ic.mat('m', '#c8504a', '#e07a6a', '#8a2a24'); ic.mat('l', '#6ab84a', '#94d870', '#3a7a2a'); ic.mat('u', '#e0b878', '#f4d8a0', '#a8804a')
        ic.poly([(3, 13), (17, 13), (16, 11), (4, 11)], 't'); ic.rect(4, 10, 12, 1, 'l'); ic.rect(4, 9, 12, 1, 'm'); ic.poly([(4, 9), (16, 9), (14, 5.5), (6, 5.5)], 'u')
    return plate(f).render()
def legs():
    def f(ic):
        for i, (cx, cy, a) in enumerate(((7.4, 11.2, -0.5), (12.6, 11.2, 0.5))):
            k = 'g%d' % i; ic.mat(k, '#a8743a', '#d09a5a', '#6a4220', hi='#f0c890'); ic.ell(cx, cy, 2.8, 2.0, k, ang=a)
        ic.mat('b', '#f0ecdc', '#ffffff', '#c4bca8'); ic.ell(5.0, 8.6, 1.0, 1.0, 'b'); ic.ell(15.0, 8.6, 1.0, 1.0, 'b')
    return plate(f).render()
def cup(c, ice=False):
    ic = Ico(); ic.mat('c', '#e8e4dc', '#ffffff', '#b0a898'); ic.mat('d', *tone(c), hi='#ffffff')
    ic.poly([(5, 8), (15, 8), (14, 17), (6, 17)], 'c'); ic.ell(10, 8.2, 5.0, 1.4, 'd')
    if ice: ic.ell(10, 7.0, 5.2, 3.6, 'd')
    else: ic.ell(16.4, 12, 1.8, 2.4, 'c')
    ic.shade(deep=False); im = ic.render(); P = im.load()
    if ice:
        for (x, y) in ((8, 5), (11, 4), (12, 6)): P[x, y] = hx('#e85a7a')
    else:
        for (x, y) in ((8, 5), (9, 4), (8, 3), (12, 5), (11, 4)): P[x, y] = hx('#e4e4ea')
    return im
def triangles():
    def f(ic):
        for i, x0 in enumerate((4.2, 10.2)):
            k = 'r%d' % i; ic.mat(k, '#f4f0e4', '#ffffff', '#c8c0b0', hi='#ffffff'); ic.poly([(x0, 13.4), (x0 + 6.0, 13.4), (x0 + 3.0, 7.4)], k)
    return plate(f).render()
def mound(c, chunk_cols):
    def f(ic): ic.mat('m', *tone(c), hi=mix(c, '#ffffff', 0.55)); ic.ell(10, 11.8, 6.2, 3.6, 'm')
    ic = plate(f); im = ic.render(); P = im.load()
    for i, (x, y) in enumerate(((7, 11), (10, 10), (12, 12), (9, 12), (13, 10), (6, 12))): P[x, y] = hx(chunk_cols[i % len(chunk_cols)])
    return im
def cookies():
    def f(ic):
        for i, (cx, cy) in enumerate(((6.6, 12.2), (13.4, 12.2), (10, 10.4))):
            k = 'k%d' % i; ic.mat(k, '#e8b858', '#f8d888', '#a87a2a', hi='#fff0c0'); ic.ell(cx, cy, 3.0, 2.0, k)
    ic = plate(f); im = ic.render(); P = im.load()
    for (x, y) in ((6, 12), (14, 12), (10, 10), (7, 11), (11, 11)): P[x, y] = hx('#6a3a1a')
    return im
def roast():
    def f(ic):
        ic.mat('r', '#c8702a', '#f0a050', '#7a3a14', hi='#ffd8a0'); ic.ell(10, 11.0, 6.4, 3.8, 'r')
        ic.mat('b', '#f0ecdc', '#ffffff', '#c4bca8'); ic.ell(16.6, 8.6, 1.3, 1.3, 'b'); ic.ell(3.4, 8.6, 1.3, 1.3, 'b')
    ic = plate(f, big=True); im = ic.render(); P = im.load()
    for (x, y) in ((6, 15), (14, 15), (4, 13), (16, 13)): P[x, y] = hx('#5aa83a')
    for (x, y) in ((8, 9), (12, 9)): P[x, y] = hx('#ffe080')
    return im
def pie():
    def f(ic):
        ic.mat('c', '#d8a050', '#f0c478', '#9a6a28', hi='#fff0c0'); ic.ell(10, 11.6, 6.8, 3.6, 'c')
    ic = plate(f); im = ic.render(); P = im.load()
    for x in range(5, 16, 3): P[x, 11] = hx('#9a6a28')
    for (x, y) in ((8, 10), (12, 10), (10, 12)): P[x, y] = hx('#6ab84a')
    return im
def mochi():
    def f(ic):
        for i, (cx, c) in enumerate(((6.4, '#f08ab0'), (10.0, '#f4f0e4'), (13.6, '#8ad06a'))):
            k = 'm%d' % i; ic.mat(k, *tone(c), hi='#ffffff'); ic.ell(cx, 11.6, 2.4, 2.2, k)
    return plate(f).render()
def fish():
    def f(ic):
        ic.mat('f', '#8ab0c8', '#b8d4e4', '#4a6a80', hi='#ffffff'); ic.ell(9.4, 11.4, 6.2, 2.4, 'f'); ic.poly([(14.6, 11.4), (17.4, 9.2), (17.4, 13.6)], 'f')
    ic = plate(f); im = ic.render(); P = im.load()
    P[5, 11] = hx('#101820')
    for (x, y) in ((8, 10), (10, 10), (12, 10)): P[x, y] = hx('#5a3a20')
    for (x, y) in ((4, 14), (5, 14), (15, 15)): P[x, y] = hx('#5aa83a')
    return im
def crab():
    def f(ic):
        ic.mat('c', '#e0603a', '#f88a5a', '#9a2e14', hi='#ffc0a0'); ic.ell(10, 11.6, 5.4, 3.2, 'c'); ic.ell(4.2, 9.4, 1.8, 1.6, 'c'); ic.ell(15.8, 9.4, 1.8, 1.6, 'c')
    ic = plate(f); im = ic.render(); P = im.load()
    for (x, y) in ((4, 13), (3, 14), (16, 13), (17, 14)): P[x, y] = hx('#9a2e14')
    return im
def rings():
    def f(ic): ic.mat('m', '#c8502a', '#e07a4a', '#8a2a14'); ic.ell(10, 12.0, 6.4, 3.0, 'm')
    ic = plate(f); im = ic.render(); P = im.load()
    for (cx, cy) in ((7, 11), (11, 10), (13, 12), (9, 13)):
        for (dx, dy) in ((-1, 0), (1, 0), (0, -1), (0, 1)): P[cx + dx, cy + dy] = hx('#f8e8e8')
    return im
def seafeast():
    def f(ic):
        ic.mat('c', '#e0603a', '#f88a5a', '#9a2e14', hi='#ffc0a0'); ic.ell(7.0, 11.4, 3.6, 2.6, 'c')
        ic.mat('f', '#8ab0c8', '#b8d4e4', '#4a6a80', hi='#ffffff'); ic.ell(13.0, 12.6, 3.8, 1.6, 'f')
        ic.mat('s', '#f08a4a', '#ffb07a', '#b8501e'); ic.ell(13.6, 9.8, 2.4, 1.6, 's')
    ic = plate(f, big=True); im = ic.render(); P = im.load()
    for (x, y) in ((4, 15), (16, 15), (10, 15)): P[x, y] = hx('#5aa83a')
    P[10, 13] = hx('#ffe080'); P[7, 9] = hx('#101010')
    return im
def salad():
    def top(ic):
        for i, (cx, cy) in enumerate(((7, 10), (10, 9.2), (13, 10), (8.6, 8.4), (11.6, 8.6))):
            k = 'l%d' % i; ic.mat(k, '#6ab84a', '#94d870', '#3a7a2a'); ic.ell(cx, cy, 2.2, 1.6, k)
    return bowl('wood', '#8ad06a', [(9, 9, '#c8c8e4'), (12, 9, '#7a8a2a')], steam=False, top=top)
DISH = {
    'mushsoup': lambda: bowl('wood', '#b8625a', [(7, 11, '#e0e0f0'), (8, 11, '#c8c8e4'), (12, 11, '#e0e0f0'), (11, 12, '#f0e0c0')]),
    'pudding': dome('#7ad87a'), 'sandwich': sandwich, 'froglegs': legs,
    'saptea': lambda: cup('#c8a040'), 'riceball': triangles,
    'stirfry': lambda: mound('#c8502a', ['#f08a2a', '#6ab84a', '#d82a1a', '#f0d070']),
    'hotsoup': lambda: bowl('stone', '#e0502a', [(7, 11, '#ff9a6a'), (12, 11, '#d82a1a'), (10, 12, '#8a3a1a')]),
    'shaveice': lambda: cup('#9ae0ff', ice=True),
    'porridge': lambda: bowl('wood', '#a8c87a', [(8, 11, '#5aa83a'), (12, 12, '#4a9ab8')]),
    'cookie': cookies, 'platter': lambda: mound('#d8904a', ['#c8504a', '#f0d070', '#5aa83a', '#e0b878']), 'feast': roast,
    'tomstew': lambda: bowl('blue', '#d84a3a', [(7, 11, '#f86a4a'), (12, 11, '#7a8a2a'), (10, 12, '#a8443a')]),
    'kpie': pie, 'salad': salad,
    'beetstew': lambda: bowl('stone', '#9a1a3a', [(7, 11, '#c83a5c'), (12, 11, '#eeeae2'), (10, 12, '#6a0a2a')]),
    'cactusmochi': mochi, 'fishmeal': fish,
    'kelpsoup': lambda: bowl('wood', '#5a7a48', [(7, 11, '#2e3a1c'), (12, 11, '#e6c4a2'), (10, 12, '#f4ecd8')]),
    'crabsteam': crab, 'squidfry': rings, 'seafeast': seafeast,
}
