"""세운 칼 시안 (칼끝이 위) — 부분(날 · 코등이 · 손잡이 · 자루 끝)을 줄마다 반폭으로 그려 좌우 대칭 · 곧은 테.
python3 vsword.py → ../v_gladius.png · ../v_rune2.png
색: 날 왼쪽 빛 · 가운데 등줄 · 오른쪽 그늘 · 날끝 빛 / 코등이 · 자루 끝 공 명암 / 테 1칸
"""
import math, pathlib
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
def hexc(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def rp(c, k):
    r, g, b = hexc(c) if isinstance(c, str) else c
    return tuple(round(v + (255 - v) * k) if k >= 0 else round(v * (1 + k)) for v in (r, g, b))

W = 17
def draw(s):
    """s: blade{len, w, prof, tip, col, ridge, fuller, edge, core} · guard{h, w, shape, col, gem} · grip{h, w, col, rib, ribc} · pommel{r, col, gem, nub, shape}"""
    B, G, Q, P = s['blade'], s['guard'], s['grip'], s['pommel']
    cx = W // 2; px = {}
    def put(x, y, c):
        if 0 <= x < W: px[(x, y)] = c
    y = 1
    # 날 (위 = 칼끝)
    Lb = B['len']
    for j in range(Lb):
        t = 1 - j / (Lb - 1)          # 1 = 칼끝, 0 = 코등이 쪽
        w = blade_hw(B, t)
        if w < 0.2: continue
        n = int(round(w))
        for dx in range(-n, n + 1):
            ax = abs(dx)
            if dx < 0: c = rp(B.get('edge', B['col']), 0.55) if ax == n else rp(B['col'], 0.28)
            elif dx > 0: c = rp(B.get('edge', B['col']), -0.35) if ax == n else rp(B['col'], -0.12)
            else: c = rp(B.get('ridge', B['col']), 0.45) if B.get('ridge', True) else rp(B['col'], 0.1)
            if B.get('fuller') and dx == 0 and t < B.get('fuller_to', 0.75) and t > 0.08: c = rp(B.get('fuller_col', B['col']), -0.3)
            if B.get('core') and ax <= max(0, n - 2): c = rp(B['core'], 0.15 if dx <= 0 else 0)
            put(cx + dx, y + j, c)
        for k in B.get('deco', []):   # 날 무늬: (높이 t, x 오프셋, 색)
            pass
    y += Lb
    for (tt, ox, col) in B.get('deco', []):
        put(cx + ox, 1 + int(round((1 - tt) * (Lb - 1))), hexc(col))
    # 코등이
    gh, gw = G['h'], G['w']
    for j in range(gh):
        k = j / max(1, gh - 1)
        sh = G.get('shape', 'bar')
        w = gw
        if sh == 'cup': w = gw - (1 if j == 0 or j == gh - 1 else 0)
        if sh == 'crescent': w = gw - (0 if j == gh - 1 else 1 + (gh - 1 - j))
        if sh == 'wing': w = gw if j == 0 else gw - 1 - j
        for dx in range(-w, w + 1):
            c = rp(G['col'], 0.35 if j == 0 else -0.3 if j == gh - 1 else (0.12 if dx < 0 else -0.12))
            put(cx + dx, y + j, c)
        if G.get('gem') and j == gh // 2: put(cx, y + j, hexc(G['gem'])); put(cx - 1, y + j, rp(G['gem'], 0.4)) if gh > 2 else None
    y += gh
    # 손잡이
    gq = Q['h']; qw = Q.get('w', 1)
    for j in range(gq):
        rib = Q.get('rib') and j % Q['rib'] == Q['rib'] - 1
        w = qw + (1 if rib else 0)
        for dx in range(-w, w + 1):
            c = rp(Q.get('ribc', Q['col']) if rib else Q['col'], 0.3 if dx < 0 else -0.25 if dx > 0 else 0.05)
            if Q.get('wrap') and not rib and (j + dx) % 3 == 0: c = rp(Q['wrap'], -0.1)
            put(cx + dx, y + j, c)
    y += gq
    # 자루 끝
    r = P['r']; sh = P.get('shape', 'ball')
    for j in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if sh == 'ball' and dx * dx + j * j > r * r + r * 0.6: continue
            if sh == 'disc' and abs(j) > max(1, r // 2): continue
            if sh == 'diamond' and abs(dx) + abs(j) > r: continue
            k = 0.4 if (dx + j) < -r * 0.6 else -0.35 if (dx + j) > r * 0.5 else 0
            c = rp(P['col'], k)
            if P.get('gem') and abs(dx) + abs(j) <= max(0, r - 2): c = rp(P['gem'], 0.3 if dx + j < 0 else 0)
            put(cx + dx, y + r + j, c)
    y += 2 * r + 1
    if P.get('nub'): put(cx, y, rp(P['col'], -0.1)); put(cx, y + 1, rp(P['col'], -0.3)); y += 2
    # 테
    out = dict(px); ol = hexc(s.get('outline', '#1c130e'))
    for (x, yy) in px:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, yy + dy)
            if q not in px: out[q] = ol
    for (x, yy, col) in s.get('extra', []): out[(cx + x, yy)] = hexc(col)
    return out, y + 2

def blade_hw(B, t):
    w = B['w']; tip = B.get('tip', 0.2); pr = B.get('prof', 'straight')
    if pr == 'mainz': w = w * (1 - 0.18 * math.sin(min(1, t / (1 - tip)) * math.pi))        # 허리가 잘록
    if pr == 'leaf': w = w * (0.85 + 0.3 * math.sin(min(1, t / (1 - tip)) * math.pi))       # 잎 꼴
    if pr == 'taper': w = w * (1 - 0.25 * t)
    if pr == 'flame': w = w * (0.7 + 0.45 * abs(math.sin(t * math.pi * B.get('waves', 3.5))))
    if pr == 'crystal': k = (t * B.get('facets', 3)) % 1; w = w * (0.6 + 0.6 * (1 - abs(k - 0.5) * 2))
    if pr == 'fang': w = w * (0.75 if 0.55 < t < 0.62 else 1)
    if t > 1 - tip: w = w * max(0, (1 - t) / tip) ** B.get('pow', 1.0)
    return w

ST, IR = '#c4ccd8', '#a8b0bc'
def g(name, lv, blade, guard, grip, pommel, **kw): return dict(name=name, lv=lv, blade=blade, guard=guard, grip=grip, pommel=pommel, **kw)
GLADIUS = [
    g('연습용 목검', 1, dict(len=22, w=2, col='#a8743e', edge='#8a5a30', ridge=False, tip=0.15), dict(h=2, w=3, col='#7a5030', shape='cup'), dict(h=6, col='#8a5a30', rib=3, ribc='#6e4626'), dict(r=2, col='#7a5030')),
    g('폼페이 철검', 10, dict(len=24, w=2, col=IR, tip=0.17, pow=0.9), dict(h=3, w=3, col='#7a5030', shape='cup'), dict(h=7, col='#a8743e', rib=3, ribc='#7a5030'), dict(r=3, col='#7a5030', nub=1)),
    g('허리 잘록한 청동장식 검', 20, dict(len=26, w=3, col=ST, prof='mainz', tip=0.3, fuller=1), dict(h=3, w=4, col='#c08a3a', shape='cup'), dict(h=7, col='#e8dcc0', rib=2, ribc='#c08a3a'), dict(r=3, col='#c08a3a', nub=1)),
    g('뼈 손잡이 검', 30, dict(len=25, w=2, col=ST, prof='taper', tip=0.25, fuller=1), dict(h=3, w=3, col='#5a5e68', shape='cup'), dict(h=7, col='#f0e8d0', rib=2, ribc='#c8bca0'), dict(r=3, col='#f0e8d0', nub=1)),
    g('투견의 송곳니', 40, dict(len=26, w=3, col=ST, prof='fang', tip=0.22, fuller=1), dict(h=3, w=4, col='#3a3440', shape='cup'), dict(h=7, col='#2a2430', rib=3, ribc='#5a5060'), dict(r=3, col='#b83a32', nub=1)),
    g('붉은 모래 투사검', 50, dict(len=27, w=3, col=ST, prof='leaf', tip=0.25, fuller=1, fuller_col='#b83a32'), dict(h=3, w=4, col='#c9a04a', shape='cup', gem='#b83a32'), dict(h=7, col='#a8302a', rib=3, ribc='#c9a04a'), dict(r=3, col='#c9a04a', nub=1)),
    g('검붉은 투혼', 60, dict(len=27, w=3, col='#5a5060', edge='#ff6a4a', ridge='#ff8a6a', tip=0.24), dict(h=3, w=4, col='#8a1a20', shape='cup'), dict(h=7, col='#2a1a1e', rib=2, ribc='#8a1a20'), dict(r=3, col='#2a1a1e', gem='#ff6a4a')),
    g('사자갈기 검', 70, dict(len=27, w=3, col=ST, tip=0.22, fuller=1), dict(h=4, w=5, col='#e0a838', shape='crescent'), dict(h=7, col='#7a4a20', wrap='#c08a3a'), dict(r=3, col='#e0a838', gem='#f8d870')),
    g('사슬 감은 검', 80, dict(len=27, w=3, col='#9aa2ae', tip=0.2, pow=0.8), dict(h=3, w=4, col='#5a5e68', shape='bar'), dict(h=8, col='#7a808a', rib=2, ribc='#c8ccd4'), dict(r=3, col='#5a5e68', shape='disc')),
    g('황금 투구 검', 90, dict(len=28, w=3, col=ST, prof='mainz', tip=0.3, fuller=1, fuller_col='#e8b830'), dict(h=3, w=5, col='#e8b830', shape='cup', gem='#3a8ad0'), dict(h=7, col='#f4ecd8', rib=2, ribc='#e8b830'), dict(r=3, col='#e8b830', nub=1)),
    g('챔피언의 월계 검', 100, dict(len=28, w=3, col='#e8ecf2', edge='#ffffff', tip=0.24, fuller=1, fuller_col='#5ab84a', deco=[(0.5, -1, '#5ab84a'), (0.42, 1, '#5ab84a'), (0.34, -1, '#5ab84a')]), dict(h=4, w=5, col='#c8a038', shape='wing', gem='#5ab84a'), dict(h=7, col='#f8f4ea', rib=2, ribc='#c8a038'), dict(r=3, col='#c8a038', gem='#5ab84a', nub=1)),
    g('핏빛 개선검', 110, dict(len=29, w=3, col=ST, prof='leaf', tip=0.25, fuller=1, fuller_col='#c0302a', fuller_to=0.85), dict(h=3, w=5, col='#2a2228', shape='cup', gem='#e83a3a'), dict(h=7, col='#a8202a', wrap='#3a1a1e'), dict(r=3, col='#2a2228', gem='#e83a3a', nub=1)),
    g('번개 투사의 검', 120, dict(len=29, w=3, col='#9ab0d0', edge='#e8f4ff', core='#f0f8ff', tip=0.26, deco=[(0.7, 0, '#ffe04a'), (0.55, 1, '#ffe04a'), (0.4, 0, '#ffe04a'), (0.25, -1, '#ffe04a')]), dict(h=3, w=5, col='#3a4a6a', shape='crescent', gem='#ffe04a'), dict(h=7, col='#2a3048', rib=2, ribc='#ffe04a'), dict(r=3, col='#3a4a6a', gem='#ffe04a')),
    g('흑요석 글라디우스', 130, dict(len=29, w=3, col='#2a2236', edge='#b88aff', ridge='#5a3a8a', prof='taper', tip=0.3), dict(h=4, w=5, col='#5a3a8a', shape='wing'), dict(h=7, col='#1e1828', rib=2, ribc='#5a3a8a'), dict(r=3, col='#1e1828', gem='#c88aff', shape='diamond')),
    g('별빛 투기장 검', 140, dict(len=30, w=3, col='#3a4a8a', edge='#c8d8ff', ridge='#8aa0e0', tip=0.26, deco=[(0.75, -1, '#ffffff'), (0.6, 1, '#f8f0c8'), (0.48, 0, '#ffffff'), (0.33, -1, '#f8f0c8'), (0.2, 1, '#ffffff')]), dict(h=3, w=5, col='#d8dce8', shape='cup', gem='#7af0ff'), dict(h=7, col='#2a3060', rib=2, ribc='#d8dce8'), dict(r=3, col='#d8dce8', gem='#7af0ff', nub=1)),
    g('불멸의 투기왕 검', 150, dict(len=30, w=4, col='#f4f0e4', edge='#ffffff', core='#fffbe8', prof='mainz', tip=0.3, fuller=1, fuller_col='#e8b830'), dict(h=4, w=6, col='#f0c040', shape='wing', gem='#e83a3a'), dict(h=7, col='#fbf8ee', rib=2, ribc='#f0c040'), dict(r=4, col='#f0c040', gem='#e83a3a', nub=1)),
]
RUNE = [
    dict(name='지옥의 업화', lv=0, el='불 속성 룬소드', blade=dict(len=30, w=3, col='#ff7a2a', edge='#c8281a', core='#fff0a0', prof='flame', waves=3.5, tip=0.3, pow=0.7, ridge='#ffd060'),
         guard=dict(h=3, w=5, col='#3a2622', shape='crescent', gem='#ff5a1a'), grip=dict(h=7, col='#2a1814', wrap='#6a2a1a'), pommel=dict(r=3, col='#3a2622', gem='#ffb040', shape='diamond'),
         extra=[(-5, 6, '#ffd060'), (5, 11, '#ff8a2a'), (-5, 17, '#ffb040'), (4, 3, '#ff6a2a'), (0, 0, '#ffd060')], outline='#2a0a06'),
    dict(name='혹한의 결정', lv=0, el='빙결 속성 룬소드', blade=dict(len=30, w=3, col='#8ad8f8', edge='#ffffff', core='#d8f6ff', prof='crystal', facets=3, tip=0.25, ridge='#ffffff'),
         guard=dict(h=4, w=6, col='#7ab8e0', shape='wing', gem='#e8fbff'), grip=dict(h=7, col='#c8d8e8', rib=2, ribc='#5a8ab8'), pommel=dict(r=3, col='#7ab8e0', gem='#ffffff', shape='diamond'),
         extra=[(-5, 9, '#e8fbff'), (-6, 8, '#ffffff'), (5, 16, '#7ac8f0'), (6, 15, '#a8e8ff'), (-5, 22, '#e8fbff')], outline='#0e2a48'),
]

def sheet(items, title, out, Z=5):
    sizes = [draw(s) for s in items]
    Hm = max(h for _, h in sizes)
    CW = W * Z + 30; Wd = len(items) * CW + 30; Hd = Hm * Z + 90
    im = Image.new('RGB', (Wd, Hd), (26, 24, 32)); dr = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 16); f2 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 11); f3 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11)
    dr.text((14, 12), title, font=f1, fill=(240, 196, 90))
    for i, (s, (px, h)) in enumerate(zip(items, sizes)):
        x0 = 20 + i * CW; y0 = 70 + (Hm - h) * Z
        for (x, y), col in px.items(): dr.rectangle([x0 + x * Z, y0 + y * Z, x0 + x * Z + Z - 1, y0 + y * Z + Z - 1], fill=col)
        nm = s['name']; lines = [nm[k:k + 6] for k in range(0, len(nm), 6)]
        for k, ln in enumerate(lines): dr.text((x0, 38 + k * 13 - (len(lines) - 1) * 13 + 13), ln, font=f2, fill=(244, 236, 216))
        dr.text((x0, Hd - 18), f"Lv{s['lv']}" if s['lv'] else s.get('el', ''), font=f3, fill=(168, 156, 140))
    im.save(out); print(out, im.size)

if __name__ == '__main__':
    sheet(GLADIUS[:8], '글라디우스 1/2 — 10레벨마다 새 디자인 · 이름 (Lv1~70)', T.parent / 'v_gladius1.png')
    sheet(GLADIUS[8:], '글라디우스 2/2 (Lv80~150)', T.parent / 'v_gladius2.png')
    sheet(RUNE, '룬소드 — 지옥의 업화 · 혹한의 결정', T.parent / 'v_rune2.png', Z=8)
