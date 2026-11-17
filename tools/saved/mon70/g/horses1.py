"""말 7 시안 (11-17 22:57 사용자 「다음」 — 새끼 펫 16 · 말 7): 마구간 말(노쇠 · 당나귀 · 갈마 · 흑마 · 백마 · 군마 · 명마)
옛 그림(pxmon3.js HORSE_GRID 한 그림에 색만 다름, 13×10칸)을 PXU 새 그림으로. 마구간 · 마차 끄는 짐승 · 원정 · 교역 장면에 나온다.
A 날씬한 준마(적토마 · 켈피 · 페가수스 펫 말과 같은 뼈대 — 다리가 길다) · B 뭉툭한 짐말(굵은 다리 · 발목 털 · 마차 끌기에 맞는 몸).
종류마다 색 + 생김새 손질(당나귀 긴 귀 · 짧게 선 갈기 · 등줄, 갈마 검은 갈기와 다리, 군마 마갑, 명마 금 굴레와 긴 금빛 갈기 …).
서 있기 두 장(g · g2): 꼬리 흔들기 · 귀 쫑긋. python3 horses1.py → ../t/horses1.json"""
import json, os

def G(s): return [list(r) for r in s.strip('\n').split('\n')]
def T(g): return '\n' + '\n'.join(''.join(r) for r in g) + '\n'
def put(g, x, y, ch):
    while len(g) <= y: g.append([])
    r = g[y]
    while len(r) <= x: r.append('.')
    r[x] = ch
def puts(g, cells, ch):
    for (x, y) in cells: put(g, x, y, ch)
def swap(g, a, b):
    for r in g:
        for i, ch in enumerate(r):
            if ch == a: r[i] = b
def at(g, x, y): return g[y][x] if 0 <= y < len(g) and 0 <= x < len(g[y]) else '.'

# ── A 날씬한 준마 (27칸) ──
A0 = '''
.....................k.k...
....................mQCQ...
...................mmCCCQ..
..................mmCCeCCQ.
.................mmCCCCCCCQ
................mmCCCCcCCCn
...............mmCCCCc..cnn
..............mmCCCCc......
......QQQQQQQmmCCCCC.......
....QQCCCCCCCCCCCCCC.......
..mmCCCCCCCCCCCCCCCC.......
.mmmcCCCCCCCCCCCCCCc.......
.mm..cCCCCCCCCCCCCc........
.m...cCcCccccccCcCc........
.m...C.C.......C..C........
.m...C.C.......C..C........
.....C.C.......C..C........
.....c.c.......c..c........
.....K.K.......K..K........
'''
A1 = '''
.....................k.k...
....................mQCQ...
...................mmCCCQ..
..................mmCCeCCQ.
.................mmCCCCCCCQ
................mmCCCCcCCCn
...............mmCCCCc..cnn
..............mmCCCCc......
......QQQQQQQmmCCCCC.......
....QQCCCCCCCCCCCCCC.......
...mCCCCCCCCCCCCCCCC.......
..mmcCCCCCCCCCCCCCCc.......
.mm..cCCCCCCCCCCCCc........
.mm..cCcCccccccCcCc........
mm...C.C.......C..C........
m....C.C.......C..C........
.....C.C.......C..C........
.....c.c.......c..c........
.....K.K.......K..K........
'''
# ── B 뭉툭한 짐말 (24칸) ──
B0 = '''
..................k.k...
.................mQCQ...
................mmCCCQ..
...............mmCCeCCQ.
..............mmCCCCCCCQ
.............mmCCCCcCCCn
............mmCCCCCc.cnn
....QQQQQQQmmCCCCCC.....
..QQCCCCCCCCCCCCCCCC....
.mmCCCCCCCCCCCCCCCCC....
mmmCCCCCCCCCCCCCCCCc....
mm.cCCCCCCCCCCCCCCc.....
m..cCCcCccccccCCcCc.....
m..cCC.cC.....cCC.cC....
...cCC.cC.....cCC.cC....
...FFF.FFF....FFF.FFF...
...KKK.KKK....KKK.KKK...
'''
B1 = '''
..................k.k...
.................mQCQ...
................mmCCCQ..
...............mmCCeCCQ.
..............mmCCCCCCCQ
.............mmCCCCcCCCn
............mmCCCCCc.cnn
....QQQQQQQmmCCCCCC.....
..QQCCCCCCCCCCCCCCCC....
..mCCCCCCCCCCCCCCCCC....
.mmCCCCCCCCCCCCCCCCc....
mm.cCCCCCCCCCCCCCCc.....
mm.cCCcCccccccCCcCc.....
m..cCC.cC.....cCC.cC....
...cCC.cC.....cCC.cC....
...FFF.FFF....FFF.FFF...
...KKK.KKK....KKK.KKK...
'''

def base(style, f):
    return G({'A': (A0, A1), 'B': (B0, B1)}[style][f])

def head_x(style): return {'A': 18, 'B': 15}[style]   # 머리 · 목이 시작하는 열 (손질 자리 기준)

# ── 종류마다 손질 ──
def f_old(g, st, f):   # 노쇠: 듬성듬성한 잿빛 갈기 · 흰 주둥이 · 처진 눈꺼풀 · 기운 없는 꼬리
    hx = head_x(st)
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if ch == 'm' and (x + y) % 3 == 0: r[x] = '.' if x < 6 else 'C'
    for (x, y) in ((hx + 7, 5), (hx + 8, 5), (hx + 7, 6), (hx + 8, 6)):
        if at(g, x, y) in 'Ccn': put(g, x, y, 'w')
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if ch == 'e': put(g, x, y - 1, 'd')
def f_donkey(g, st, f):   # 당나귀: 길쭉한 귀 · 짧게 선 검은 갈기 · 흰 주둥이 · 흰 배 · 등줄 · 끝에 술 달린 꼬리
    hx = head_x(st)
    ex = [x for x, ch in enumerate(g[0]) if ch == 'k']
    for x in ex: put(g, x, 0, 'C')
    g.insert(0, ['.'] * len(g[0])); g.insert(0, ['.'] * len(g[0]))
    for x in ex: put(g, x, 0, 'k'); put(g, x, 1, 'C'); put(g, x, 2, 'c' if x == ex[0] else 'C')
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if ch == 'm':
                if x < hx - 2 and y > 8: r[x] = '.'
                else: r[x] = 'K' if (x + y) % 2 else 'm'
    for y, r in enumerate(g):   # 주둥이 · 배를 희게
        for x, ch in enumerate(r):
            if ch == 'n' or (ch in 'Cc' and x >= hx + 6 and 6 <= y <= 8): r[x] = 'w' if ch != 'n' else 'n'
    # 꼬리: 가는 줄 + 끝 술
    tail = [(3, 11), (2, 12), (2, 13), (1, 14), (1, 15)] if st == 'A' else [(2, 11), (1, 12), (1, 13), (0, 14)]
    if f: tail = [(x - (1 if i > 1 else 0), y) for i, (x, y) in enumerate(tail)]
    for i, (x, y) in enumerate(tail): put(g, x, y, 'c' if i < len(tail) - 1 else 'K')
    # 등줄
    for y, r in enumerate(g):
        if 'Q' in r:
            xs = [x for x, ch in enumerate(r) if ch == 'Q']
            if len(xs) > 5: [put(g, x, y, 'd') for x in xs[2:-1] if x % 2 == 0]
            break
def f_gray(g, st, f):   # 갈마(밤색): 검은 갈기 · 검은 아랫다리 · 이마의 흰 별
    hx = head_x(st)
    legs_top = max(y for y, r in enumerate(g) if any(ch in 'cC' for ch in r[:12])) - 2
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if ch in 'Cc' and y >= legs_top and y < len(g) - 1 and x < hx + 4: r[x] = 'b'
    put(g, hx + 4, 3 if st == 'A' else 3, 'w')
def f_black(g, st, f):   # 흑마: 검은 몸 · 길게 흐르는 검은 갈기 · 얼굴의 흰 줄
    hx = head_x(st)
    for (x, y) in ((hx + 5, 3), (hx + 6, 4), (hx + 7, 5)):
        if at(g, x, y) in 'Cce': put(g, x, y, 'w')
    for y, r in enumerate(g):   # 갈기를 한 칸 더 길게
        for x, ch in list(enumerate(r)):
            if ch == 'm' and at(g, x - 1, y) == '.' and x > 6 and (x + y) % 2 == 0: put(g, x - 1, y, 'm')
def f_white(g, st, f):   # 백마: 흰 몸 · 은빛 갈기 · 푸른 안장 천(기사의 말)
    xs0, xs1 = (7, 15) if st == 'A' else (6, 14)
    for y in range(len(g)):
        for x in range(xs0, xs1):
            ch = at(g, x, y)
            if ch in 'QCc' and y <= (11 if st == 'A' else 10): put(g, x, y, 'B' if y > (8 if st == 'A' else 7) else ch)
    for x in range(xs0, xs1):
        y = 12 if st == 'A' else 11
        if at(g, x, y) in 'Cc': put(g, x, y, 'b')
def f_war(g, st, f):   # 군마: 쇠 마면(얼굴 갑옷) · 목 비늘 갑옷 · 붉은 마의(무늬 없음, 금 테) · 머리의 붉은 술
    hx = head_x(st)
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if x >= hx + 2 and y <= 7 and ch in 'CQc' and not (x >= hx + 8): r[x] = 'M' if (x + y) % 3 else 'N'
            if hx - 3 <= x < hx + 2 and 5 <= y <= 9 and ch in 'CQc': r[x] = 'N' if (x + y) % 2 else 'M'
    top = 8 if st == 'A' else 7
    for y in range(top, len(g)):
        for x in range(2, hx + 1):
            ch = at(g, x, y)
            if ch in 'QCc':
                low = (12 if st == 'A' else 11)
                if y <= low + 2: put(g, x, y, 'R' if y < low + 1 else 'G')
    ex = [x for x, ch in enumerate(g[0]) if ch == 'k']
    if ex: g.insert(0, ['.'] * len(g[0])); put(g, ex[0] + 1, 0, 'R'); put(g, ex[0] + 1, 1, 'R')
def f_noble(g, st, f):   # 명마: 금빛 몸 · 길게 흐르는 연금빛 갈기와 꼬리 · 금 굴레 · 붉은 장미 매듭
    hx = head_x(st)
    for y, r in enumerate(g):
        for x, ch in list(enumerate(r)):
            if ch == 'm' and x > 6 and at(g, x - 1, y) == '.': put(g, x - 1, y, 'M')
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if ch == 'm' and x <= 3: r[x] = 'M'
    for (x, y) in ((hx + 5, 4), (hx + 6, 4), (hx + 7, 4), (hx + 8, 5)):
        if at(g, x, y) in 'Cc': put(g, x, y, 'G')
    put(g, hx + 4, 4, 'R'); put(g, hx + 4, 5, 'r')

BREEDS = {
  'old':    ('노쇠', '#8a7a6a', '#5a4e42', {'m': '#b4aca2', 'M': '#d0cac0', 'n': '#3a302a', 'w': '#d8d2c8'}, f_old, '늙은 말: 듬성한 잿빛 갈기 · 흰 주둥이 · 처진 눈꺼풀'),
  'donkey': ('당나귀', '#9a9088', '#625a52', {'m': '#4a4440', 'K': '#2a2420', 'n': '#2a2420', 'w': '#e8e2da'}, f_donkey, '긴 귀 · 짧게 선 검은 갈기 · 흰 주둥이 · 등줄 · 끝에 술 달린 꼬리'),
  'gray':   ('갈마', '#a8743e', '#6a4824', {'m': '#2a1e16', 'b': '#2e2218', 'n': '#2a1e16', 'w': '#f4ece0'}, f_gray, '밤색 몸 · 검은 갈기와 꼬리 · 검은 아랫다리 · 이마의 흰 별'),
  'black':  ('흑마', '#2e2a30', '#1a181c', {'m': '#0e0c10', 'Q': '#4a4656', 'n': '#0e0c10', 'w': '#f0f0f4', 'e': '#c8a040'}, f_black, '검은 몸 · 길게 흐르는 검은 갈기 · 얼굴의 흰 줄'),
  'white':  ('백마', '#f0f0f4', '#b8b8c4', {'m': '#c8ccd8', 'n': '#a8a0a8', 'B': '#4a7ac8', 'b': '#2e508a', 'e': '#2a2a3a'}, f_white, '흰 몸 · 은빛 갈기 · 기사의 푸른 안장 천'),
  'war':    ('군마', '#5a3a2a', '#38241a', {'m': '#1e1410', 'n': '#1e1410', 'R': '#a82a2a', 'G': '#d8a838', 'M': '#a8a8b4', 'N': '#6e6e7a'}, f_war, '쇠 마면 · 목 비늘 갑옷 · 붉은 마의(금 테) · 머리의 붉은 술'),
  'noble':  ('명마', '#c08a3a', '#7a5420', {'m': '#f0d070', 'M': '#fff0b0', 'n': '#5a3a18', 'G': '#ffd040', 'R': '#d8303a', 'r': '#8a1820'}, f_noble, '금빛 몸 · 길게 흐르는 연금빛 갈기 · 금 굴레 · 붉은 장미 매듭'),
}
STYLE = {'A': ('A 날씬한 준마', 13), 'B': ('B 뭉툭한 짐말', 10)}
out = {}
for k, (nm, body, dark, pal, fn, desc) in BREEDS.items():
    d = {'base': 'horse_' + k, 'name': nm, 'old': 'horse_' + k, 'adult': None, 'pal': dict({'F': '#e8e0d0', 'k': '#2a1e1a', 'K': '#2a201a', 'e': '#1a1418'}, **pal)}
    for st, (lab, ax) in STYLE.items():
        gs = []
        for f in (0, 1):
            g = base(st, f); fn(g, st, f); gs.append(T(g))
        d[st] = {'label': f'{lab}', 'desc': desc, 'ax': ax, 'ifr': 2, 'body': body, 'dark': dark, 'g': gs[0], 'g2': gs[1]}
    out[k] = d
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 't', 'horses1.json')
json.dump({'pets': out}, open(dst, 'w'), ensure_ascii=False, indent=0); print('ok', dst, len(out))
