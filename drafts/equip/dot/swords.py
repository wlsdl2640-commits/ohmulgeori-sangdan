"""전사 계열 검 시안 — 10레벨마다 새 디자인 · 이름 (사용자 11-10 14:4x)
칼 하나 = 부분 사양(자루 끝 · 손잡이 · 코등이 · 날)을 칼 축(u: 자루 끝 → 칼끝, v: 축에 수직)으로 적고,
그림 칸마다 (u, v)를 구해 그 자리의 부분 · 색을 정한다(45° 사선 그림). 테는 마지막에 둘레 한 칸.
python3 swords.py → ../s_gladius.png (글라디우스 16 + 룬소드 둘)
"""
import math, pathlib, sys
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
FONT = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/Galmuri11-Bold.ttf'
FONT_R = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/Galmuri11.ttf'

def hexc(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def ramp(c, k):   # k: -1 어둡게 ~ +1 밝게
    r, g, b = hexc(c)
    if k >= 0: return tuple(round(v + (255 - v) * k) for v in (r, g, b))
    return tuple(round(v * (1 + k)) for v in (r, g, b))

# ── 칼 그리기 ──
def render(spec, N=24):
    """spec: pommel(r, col, nub, gem, shape) · grip(len, col, rib, ribc, wrap) · guard(len, w, col, shape, gem) · blade(len, w, col, edge, fuller, tip, shape, …)"""
    P, G, Q, B = spec['pommel'], spec['grip'], spec['guard'], spec['blade']
    o = (2.0, N - 2.0)   # 자루 끝 (왼쪽 아래)
    d = (1 / math.sqrt(2), -1 / math.sqrt(2)); p = (1 / math.sqrt(2), 1 / math.sqrt(2))
    a = P['r'] * 2; b = a + G['len']; c = b + Q['len']; L = c + B['len']
    cells = {}
    for y in range(N):
        for x in range(N):
            px, py = x + 0.5 - o[0], y + 0.5 - o[1]
            u = px * d[0] + py * d[1]; v = px * p[0] + py * p[1]
            col = part(spec, u, v, a, b, c, L)
            if col: cells[(x, y)] = col
    for (x, y), col in list(spec.get('extra', lambda *_: {})(N, o, d, p, c, L).items()): cells[(x, y)] = col
    # 테: 둘레 한 칸 (가장 어두운 색)
    ol = hexc(spec.get('outline', '#1c130e'))
    out = dict(cells)
    for (x, y) in cells:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q not in cells and 0 <= q[0] < N and 0 <= q[1] < N: out[q] = ol
    return out

def part(spec, u, v, a, b, c, L):
    P, G, Q, B = spec['pommel'], spec['grip'], spec['guard'], spec['blade']
    av = abs(v)
    if u < 0 or u > L + 0.3: return None
    if u < a:   # 자루 끝: 공 · 원반 · 보석
        r = P['r']; du = u - r
        sh = P.get('shape', 'ball')
        inside = (du * du + v * v <= (r + 0.15) ** 2) if sh == 'ball' else (abs(du) <= r * 0.55 and av <= r + 0.2) if sh == 'disc' else (abs(du) + av <= r + 0.3)
        if P.get('nub') and u < 0.9 and av < 0.7: inside = True
        if not inside: return None
        if P.get('gem') and du * du + v * v <= (r * 0.45) ** 2: return ramp(P['gem'], 0.25 if v < 0 else -0.1)
        return ramp(P['col'], 0.35 if (du + v) < -r * 0.45 else -0.35 if (du + v) > r * 0.55 else 0)
    if u < b:   # 손잡이: 마디 (rib)
        w = G.get('w', 0.95)
        if av > w: return None
        t = u - a; ribs = G.get('rib', 0)
        if ribs and (t % (G['len'] / (ribs + 0.5))) < 0.75: return ramp(G.get('ribc', G['col']), 0.15 if v < 0 else -0.2)
        if G.get('wrap') and int((t + v) * 1.4) % 2 == 0: return ramp(G['wrap'], 0 if v < 0 else -0.25)
        return ramp(G['col'], 0.18 if v < -0.2 else -0.28 if v > 0.3 else 0)
    if u < c:   # 코등이
        w = Q['w']; sh = Q.get('shape', 'bar')
        t = (u - b) / max(0.01, Q['len'])
        if sh == 'cup': w = Q['w'] * (0.7 + 0.3 * math.sin(t * math.pi))   # 반구 (글라디우스)
        if sh == 'wing': w = Q['w'] * (1.0 if av > 1.2 else 1)
        if av > w: return None
        if Q.get('gem') and av < 0.7: return ramp(Q['gem'], 0.2 if v < 0 else -0.1)
        return ramp(Q['col'], 0.3 if v < -w * 0.3 else -0.3 if v > w * 0.4 else 0.05)
    # 날
    t = (u - c) / B['len']
    hw = blade_w(B, t)
    if av > hw: return None
    edge = hw - av < 0.75
    col = B['col']
    if B.get('core') and av < hw * 0.45: return ramp(B['core'], 0.1 if v < 0 else 0)
    if B.get('fuller') and av < 0.55 and t < B.get('fuller_to', 0.7): return ramp(B.get('fuller_col', col), -0.25)
    if edge: return ramp(B.get('edge', col), 0.45 if v < 0 else -0.15)
    return ramp(col, 0.2 if v < 0 else -0.22)

def blade_w(B, t):
    w = B['w']; sh = B.get('shape', 'straight'); tip = B.get('tip', 0.22)
    if sh == 'leaf': w = w * (0.86 + 0.22 * math.sin(min(1, t / (1 - tip)) * math.pi * 0.9))
    if sh == 'flame': w = w * (0.85 + 0.35 * abs(math.sin(t * math.pi * B.get('waves', 3))))
    if sh == 'crystal': k = (t * B.get('facets', 3)) % 1; w = w * (0.75 + 0.45 * (1 - abs(k - 0.5) * 2))
    if t > 1 - tip: w = w * max(0, (1 - t) / tip) ** B.get('tip_pow', 1.0)
    return w

# ── 글라디우스 16 (10레벨마다) ──
IRON, STEEL = '#b8c0cc', '#d0d6e0'
def gl(name, lv, blade, guard, grip, pommel, **kw):
    return dict(name=name, lv=lv, blade=blade, guard=guard, grip=grip, pommel=pommel, **kw)
GLADIUS = [
    gl('연습용 글라디우스', 1, dict(len=15, w=1.6, col=IRON, tip=0.22), dict(len=1.6, w=2.4, col='#8a5a30', shape='cup'), dict(len=4, col='#a8743e'), dict(r=1.6, col='#8a5a30')),
    gl('청동 테 글라디우스', 10, dict(len=15, w=1.7, col=IRON, tip=0.22, fuller=1), dict(len=1.6, w=2.6, col='#c08a3a', shape='cup'), dict(len=4, col='#e8dcc0', rib=3, ribc='#c08a3a'), dict(r=1.7, col='#c08a3a')),
    gl('잎날 글라디우스', 20, dict(len=15.5, w=1.6, col=STEEL, shape='leaf', tip=0.25, fuller=1), dict(len=1.6, w=2.6, col='#9a6a3a', shape='cup'), dict(len=4, col='#5a3a22', rib=3, ribc='#8a5a30'), dict(r=1.7, col='#9a6a3a', nub=1)),
    gl('모래먼지 검', 30, dict(len=15.5, w=1.7, col='#c8c0b0', tip=0.32, edge='#f4ece0'), dict(len=1.6, w=2.6, col='#7a6a50', shape='cup'), dict(len=4, col='#d8c08a', wrap='#a88a50'), dict(r=1.7, col='#7a6a50', nub=1)),
    gl('투견의 송곳니', 40, dict(len=15, w=1.8, col=STEEL, tip=0.3, tip_pow=0.7, fuller=1), dict(len=1.7, w=2.8, col='#3a3440', shape='cup'), dict(len=4, col='#2a2430', rib=3, ribc='#4a4050'), dict(r=1.8, col='#b83a32')),
    gl('백전의 글라디우스', 50, dict(len=16, w=1.8, col=STEEL, tip=0.24, fuller=1, fuller_to=0.75), dict(len=1.7, w=2.8, col='#c9a04a', shape='cup', gem='#b83a32'), dict(len=4, col='#a8302a', rib=3, ribc='#c9a04a'), dict(r=1.8, col='#c9a04a')),
    gl('검붉은 투혼', 60, dict(len=16, w=1.8, col='#6a6070', edge='#ff6a4a', tip=0.26), dict(len=1.7, w=2.9, col='#8a1a20', shape='cup'), dict(len=4, col='#2a1a1e', rib=3, ribc='#8a1a20'), dict(r=1.8, col='#8a1a20', gem='#ff6a4a')),
    gl('사자갈기 검', 70, dict(len=16, w=1.9, col=STEEL, tip=0.24, fuller=1), dict(len=1.9, w=3.2, col='#e0a838', shape='cup'), dict(len=4, col='#7a4a20', wrap='#c08a3a'), dict(r=1.9, col='#e0a838', gem='#f0c060')),
    gl('사슬 감은 검', 80, dict(len=16, w=1.9, col='#a8b0bc', tip=0.22), dict(len=1.8, w=3.0, col='#5a5e68', shape='cup'), dict(len=4, col='#7a808a', rib=4, ribc='#c8ccd4'), dict(r=1.9, col='#5a5e68', shape='disc')),
    gl('황금 투구 검', 90, dict(len=16, w=1.9, col=STEEL, tip=0.24, fuller=1, fuller_col='#c9a04a'), dict(len=1.9, w=3.1, col='#e8b830', shape='cup', gem='#3a8ad0'), dict(len=4, col='#f4ecd8', rib=3, ribc='#e8b830'), dict(r=1.9, col='#e8b830', nub=1)),
    gl('챔피언의 월계 검', 100, dict(len=16.5, w=1.9, col='#e8ecf2', edge='#ffffff', tip=0.24, fuller=1), dict(len=1.9, w=3.2, col='#c8a038', shape='cup', gem='#5ab84a'), dict(len=4, col='#f8f4ea', rib=3, ribc='#c8a038'), dict(r=2.0, col='#c8a038', gem='#5ab84a')),
    gl('핏빛 개선검', 110, dict(len=16.5, w=2.0, col=STEEL, tip=0.24, fuller=1, fuller_col='#c0302a', fuller_to=0.8), dict(len=1.9, w=3.2, col='#2a2228', shape='cup', gem='#e83a3a'), dict(len=4, col='#a8202a', wrap='#3a1a1e'), dict(r=2.0, col='#2a2228', gem='#e83a3a')),
    gl('번개 투사의 검', 120, dict(len=16.5, w=2.0, col='#9ab0d0', edge='#e8f4ff', tip=0.26, core='#f0f8ff'), dict(len=1.9, w=3.2, col='#3a4a6a', shape='cup', gem='#ffe04a'), dict(len=4, col='#2a3048', rib=3, ribc='#ffe04a'), dict(r=2.0, col='#3a4a6a', gem='#ffe04a')),
    gl('흑요석 글라디우스', 130, dict(len=16.5, w=2.0, col='#2a2236', edge='#b88aff', tip=0.28), dict(len=1.9, w=3.3, col='#5a3a8a', shape='cup'), dict(len=4, col='#1e1828', rib=3, ribc='#5a3a8a'), dict(r=2.0, col='#1e1828', gem='#c88aff')),
    gl('별빛 투기장 검', 140, dict(len=17, w=2.0, col='#3a4a8a', edge='#c8d8ff', tip=0.26, fuller=1, fuller_col='#f8f0c8'), dict(len=2.0, w=3.3, col='#d8dce8', shape='cup', gem='#7af0ff'), dict(len=4, col='#2a3060', rib=3, ribc='#d8dce8'), dict(r=2.0, col='#d8dce8', gem='#7af0ff')),
    gl('불멸의 투기왕 검', 150, dict(len=17, w=2.1, col='#f4f0e4', edge='#ffffff', tip=0.26, fuller=1, fuller_col='#e8b830', core='#fffbe8'), dict(len=2.0, w=3.4, col='#f0c040', shape='cup', gem='#e83a3a'), dict(len=4, col='#fbf8ee', rib=3, ribc='#f0c040'), dict(r=2.1, col='#f0c040', gem='#e83a3a', nub=1)),
]

# ── 룬소드 둘: 지옥의 업화(불꽃 날) · 혹한의 결정(얼음 결정 날) ──
def flames(N, o, d, p, c, L):   # 날 둘레에 떨어져 나온 불씨 (칼끝 쪽)
    out = {}
    for u, v, col in [(c + 4.5, -2.6, '#ffb040'), (c + 8.5, 2.4, '#ff6a2a'), (c + 12, -2.3, '#ffd060'), (L + 0.8, 0.6, '#ff8a2a'), (c + 6.5, 2.7, '#ffd060')]:
        x, y = o[0] + d[0] * u + p[0] * v, o[1] + d[1] * u + p[1] * v
        out[(int(x), int(y))] = hexc(col)
    return out
def shards(N, o, d, p, c, L):   # 날에서 튀어나온 얼음 가시
    out = {}
    for u, v in [(c + 5, -2.6), (c + 5.6, -3.3), (c + 10, 2.5), (c + 10.6, 3.2), (c + 13.5, -2.2)]:
        x, y = o[0] + d[0] * u + p[0] * v, o[1] + d[1] * u + p[1] * v
        out[(int(x), int(y))] = hexc('#e8fbff' if v < 0 else '#7ac8f0')
    return out
RUNE = [
    dict(name='지옥의 업화', lv=0, el='불', blade=dict(len=16, w=2.0, col='#ff7a2a', edge='#c8281a', core='#fff0a0', shape='flame', waves=3.5, tip=0.3, tip_pow=0.6),
         guard=dict(len=1.7, w=3.2, col='#3a2622', gem='#ff5a1a'), grip=dict(len=4, col='#2a1814', wrap='#5a2a1a'), pommel=dict(r=1.7, col='#3a2622', gem='#ffb040'), extra=flames, outline='#2a0a06'),
    dict(name='혹한의 결정', lv=0, el='빙결', blade=dict(len=16, w=2.0, col='#8ad8f8', edge='#ffffff', core='#d8f6ff', shape='crystal', facets=3, tip=0.28),
         guard=dict(len=1.7, w=3.3, col='#7ab8e0', gem='#e8fbff', shape='wing'), grip=dict(len=4, col='#c8d8e8', rib=3, ribc='#5a8ab8'), pommel=dict(r=1.7, col='#7ab8e0', shape='diamond', gem='#ffffff'), extra=shards, outline='#0e2a48'),
]

def sheet(items, title, out, cols=6, Z=6):
    N = 24; CW, RH = N * Z + 40, N * Z + 70
    rows = (len(items) + cols - 1) // cols
    W, H = cols * CW + 20, rows * RH + 60
    im = Image.new('RGB', (W, H), (26, 24, 32)); dr = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(FONT, 16); f2 = ImageFont.truetype(FONT, 13); f3 = ImageFont.truetype(FONT_R, 11)
    dr.text((14, 14), title, font=f1, fill=(240, 196, 90))
    for i, s in enumerate(items):
        x0, y0 = 14 + (i % cols) * CW, 50 + (i // cols) * RH
        cells = render(s)
        for (x, y), col in cells.items(): dr.rectangle([x0 + x * Z, y0 + 20 + y * Z, x0 + x * Z + Z - 1, y0 + 20 + y * Z + Z - 1], fill=col)
        # 실제 크기(1배 · 2배) 미리보기
        for k, zz in ((0, 1), (1, 2)):
            bx, by = x0 + N * Z - (N * zz) - 2 - k * 30, y0 + 20 + N * Z - N * zz
            for (x, y), col in cells.items(): dr.rectangle([bx + x * zz, by + y * zz, bx + x * zz + zz - 1, by + y * zz + zz - 1], fill=col)
        dr.text((x0, y0), s['name'], font=f2, fill=(244, 236, 216))
        dr.text((x0, y0 + 20 + N * Z + 4), (f"Lv{s['lv']}" if s['lv'] else '') + (f"  {s['el']} 속성" if s.get('el') else ''), font=f3, fill=(168, 156, 140))
    im.save(out); print(out, im.size)

if __name__ == '__main__':
    sheet(GLADIUS, '글라디우스 — 10레벨마다 새 디자인 · 이름 (짧고 곧은 날 · 반구 코등이 · 마디 손잡이 · 둥근 자루 끝)', T.parent / 's_gladius.png')
    sheet(RUNE, '룬소드 — 지옥의 업화(불꽃이 날이 된 칼) · 혹한의 결정(얼음 결정 날)', T.parent / 's_rune2.png', cols=2, Z=10)
