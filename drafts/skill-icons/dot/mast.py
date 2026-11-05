"""숙련 패시브 12종 시안 (빌드 37): A안 월계관 문장 · B안 휘장 깃발 + 별. 단계(초급·중급·상급)마다 그림 하나씩.
python3 mast.py → mast_sheet_1.png, mast_sheet_2.png"""
import math, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from spear import spear, SPP
def A(theme, **k): return bg(Art(), theme, **k)
GOLD = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
# 단계 쇠 색: 동 · 은 · 금 (밝음, 어둠)
TIER = [('#e0965a', '#8a4a22'), ('#eef2f8', '#8e96a4'), ('#ffe070', '#c08a1c')]
TIER_NAME = ['초급', '중급', '상급']
# ── 상징 (가운데 놓는 손그림) ──
SWORD = ['...mM...',
         '..wmmM..',
         '..wmmM..',
         '..wmmM..',
         '..wmmM..',
         '..wmmM..',
         '..wmmM..',
         '..wmmM..',
         'yyyyyyYY',
         '.YYYYYY.',
         '...lL...',
         '...lL...',
         '..yyYY..']
AXE2 = ['.wm..tT..mM.',
        'wmmm.tT.mmMM',
        'wmmmmtTmmmMM',
        'wmmmmtTmmmMM',
        'wmmm.tT.mmMM',
        '.wm..tT..MM.',
        '.....tT.....',
        '.....tT.....',
        '.....tT.....',
        '.....tT.....',
        '.....lL.....',
        '.....lL.....',
        '.....yY.....']
MACE2 = ['....yY....',
         '..mmmmMM..',
         '.mwmmmmMn.',
         'ymwmmmmMnY',
         '.mmmmmMMn.',
         '..mMMMMn..',
         '....yY....',
         '....tT....',
         '....tT....',
         '....tT....',
         '....tT....',
         '....lL....',
         '....lL....',
         '...yyYY...']
BOWUP = ['......m......',
         '.....wmM.....',
         '....wmmMM....',
         '......t......',
         '...yyyyyYY...',
         '.yy...t...YY.',
         'y.....t.....Y',
         'y.e...t...e.Y',
         '...e..t..e...',
         '....e.t.e....',
         '.....eTe.....',
         '.....rtR.....',
         '.....rtR.....',
         '......T......']
LUTE2 = ['......Tt.',
         '.....tT..',
         '....tT...',
         '...yT....',
         '..oooo...',
         '.oooooo..',
         'ooookooo.',
         'oookkooO.',
         'oooooOOO.',
         'ooyyyOOO.',
         '.ooooOO..',
         '..OOOO...']
PLATE = ['..mm....mm..',
         '.mwmmmmmmMn.',
         'mwmmmMMmmmMn',
         'mmmmmMMmmmMn',
         'mmmmmMMmmMMn',
         '.mmmmMMmmMn.',
         '.mMMMMMMMMn.',
         '..mmmMMmmn..',
         '..mMMMMMMn..',
         '..mmmMMmmn..',
         '..yyyyyyYY..',
         '...mMMMMn...']
TOME = ['yYppppppppyY',
        'Yppppzzpppye',
        'pppppzwwzppe',
        'pppzwzzzzwze',
        'ppppzwzzwzpe',
        'pppppzwwzppe',
        'Yppppzzpppye',
        'yYPPPPPPPPye',
        '.eeeeeeeeee.']
CHALICE = ['..h......h..',
           '...h....h...',
           '.yyyyyyyyyy.',
           '.ycccccccccY',
           '.yyccwcccYY.',
           '..yycccYYY..',
           '...yyyYYY...',
           '....yyYY....',
           '.....yY.....',
           '.....yY.....',
           '...yyyYYY...',
           '..yyyyYYYY..']
SHIELD2 = ['.mmmmmmmmMM.',
           'mwbbbbbbbbMn',
           'mbbbbyybbbMn',
           'mbbbbyybbbMn',
           'mbbyyyyyybMn',
           'mbbyyyyyybMn',
           'mbbbbyybbbMn',
           '.mbbbyybbMn.',
           '.mbbbbbbbMn.',
           '..mbbbbbMn..',
           '...mbbbMn...',
           '....mMn.....']
PACK = ['...tTtTt...',
        '..tT...Tt..',
        '..tT...Tt..',
        '.lllllllll.',
        '.lLLLLLLLl.',
        '.ll.yYy.lL.',
        '.lllllllll.',
        '.lllllllll.',
        '.llfllllfL.',
        '.lLLLLLLLL.',
        '.lL.lllLLL.',
        '.lLLLLLLLL.',
        '..LLLLLLL..']
# 창: 위로 세운 잎 창날 + 술
def spear_up(a, x=7.5, top=0.4, L=13.5):
    cm = spear(x, top, 90, Lh=7.0, hw=2.4, Ls=L - 8.0, sw=0.6, collar=1.0, cw=1.4, tassel=True, apex=0.58, sharp=1.0)
    sp(a, grid(cm), SPP)
# 단검 둘 엇걸기
def daggers_x(a, y=2):
    D = cell.dsword(3, 15, Lb=6, Lg=1, g=1, wide=2, pom=1)          # 칼끝 왼쪽 아래 → 돌려서 칼끝 오른쪽 위
    D1 = {(W - 1 - x, H - 1 - yy + y - 2): ({'w': 'M', 'M': 'w'}.get(c, c)) for (x, yy), c in D.items()}
    D2 = {(W - 1 - x, yy): c for (x, yy), c in D1.items()}
    sp(a, grid(D2), dict(GOLD)); sp(a, grid(D1), dict(GOLD))
# 마법 지식 / 신성학 / 방패술 / 운반술 등 손그림 팔레트
LUTE_P = {'o': ('#e0904a', 3), 'O': ('#9a5a24', 3), 'k': ('#3a1a0a', 1), 't': ('#7a4c22', 3), 'T': ('#4a2a10', 3)}
TOME_P = dict(GOLD, p=('#7a4ad0', 10), P=('#4a2a90', 10), z=('#c8a8ff', 1), w=('#ffffff', 1), e=('#f4ecd8', 7))
CHAL_P = dict(GOLD, c=('#9aeeff', 12), w=('#ffffff', 1), h=('#fff0a8', 1))
PACK_P = {'t': ('#e0c08a', 3), 'T': ('#a07a4a', 3), 'l': ('#a8642e', 9), 'L': ('#6a3a1a', 9), 'f': ('#5a3010', 9), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
SH_P = {'b': ('#3a6ae8', 12), 'y': ('#ffd84a', 6)}
# 숙련마다: 배경 테마, 상징 그리는 함수(위치는 문장 A·깃발 B 공통으로 가운데)
def g_sword(a, dy=0): sp(a, SWORD, 4, 2 + dy, GOLD)
def g_axe(a, dy=0): sp(a, AXE2, 2, 2 + dy, GOLD)
def g_blunt(a, dy=0): sp(a, MACE2, 3, 1 + dy, GOLD)
def g_lance(a, dy=0): spear_up(a, 7.5, 0.4 + dy)
def bow_side(a, dy=0, cx=5.2, cy=9.0, rx=5.6, ry=7.6):
    top, bot = (int(cx), int(cy - ry) + dy), (int(cx), int(cy + ry) - 1 + dy)
    nock = (2, int(cy) + dy)
    for (x0, y0), (x1, y1) in ((top, nock), (nock, bot)):   # 당긴 시위 (테두리 없이)
        n = max(abs(x1 - x0), abs(y1 - y0))
        for i in range(n + 1): a.set(round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n), '#f4ecd8')
    cm = {}
    for y in range(H):
        v = (y + 0.5 - dy - cy) / ry
        if abs(v) >= 1: continue
        xo = cx + rx * math.sqrt(1 - v * v)
        x = int(xo); cm[(x, y)] = 't'
        if abs(v) < 0.75: cm[(x - 1, y)] = 'T'
        if abs(v) < 0.22: cm[(x, y)] = 'y'; cm[(x - 1, y)] = 'Y'
    sp(a, grid(cm), {'t': ('#c88a4a', 3), 'T': ('#7a4c22', 3), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
    yy = int(cy) + dy; arr = {}
    for x in range(2, 12): arr[(x, yy)] = 't'
    for (x, y, c) in [(12, yy - 1, 'm'), (12, yy, 'm'), (12, yy + 1, 'M'), (13, yy, 'w'), (11, yy - 1, 'm'), (11, yy + 1, 'M'), (2, yy - 1, 'r'), (3, yy - 1, 'r'), (2, yy + 1, 'R'), (3, yy + 1, 'R')]: arr[(x, y)] = c
    sp(a, grid(arr), {'t': ('#e8d8b0', 7), 'r': ('#e84848', 13), 'R': ('#9a2020', 13)})
def g_bow(a, dy=0): bow_side(a, dy)
def g_dagger(a, dy=0): daggers_x(a, 2 + dy)
def g_lute(a, dy=0):
    sp(a, LUTE2, 3, 3 + dy, LUTE_P)
    for (x, y) in [(12, 3), (13, 6)]: a.set(x, y + dy, '#ffffff')
def g_plate(a, dy=0): sp(a, PLATE, 2, 3 + dy, GOLD)
OPEN = ['.eeeee..eeeee.',
        'eeeeeeeeeeeeeE',
        'eEEEEeeeEEEEeE',
        'eeeeeeeeeeeeeE',
        'eEEEeeeeeEEEeE',
        'eeeeeeeeeeeeEE',
        'pPpppppYpppPPP',
        '.PPPPPPPPPPPP.']
SIGIL = ['..z..', '.zwz.', 'zwwwz', '.zwz.', '..z..']
def g_magic(a, dy=0):
    glow(a, 7.5, 6.0 + dy, 4.2, ['#5a3ab0', '#8a68e8'])
    sp(a, SIGIL, 5, 3 + dy, {'z': ('#c8a8ff', 1), 'w': ('#ffffff', 1)}, glow_c='#a890ff')
    for (x, y) in [(3, 4), (12, 3), (11, 8), (4, 8)]: a.set(x, y + dy, '#e0d0ff')
    sp(a, OPEN, 1, 10 + dy, TOME_P)
CHAL2 = ['.yyyyyyyyyy.',
         'yccccccccccY',
         'yyccwccccYYY',
         '.yyyyyyyYYY.',
         '..yyyyyYYY..',
         '...yyyYYY...',
         '.....yY.....',
         '....yyYY....',
         '.....yY.....',
         '...yyyyYY...',
         '..yyyyYYYY..']
def g_holy(a, dy=0):
    glow(a, 7.5, 3.5 + dy, 3.2, ['#fff0a0', '#ffffff'])
    sp(a, ['.h.', 'hwh', '.h.', '.h.'], 6, 1 + dy, {'h': ('#fff4c0', 1), 'w': ('#ffffff', 1)})
    sp(a, CHAL2, 2, 6 + dy, CHAL_P)
def g_shield(a, dy=0): sp(a, SHIELD2, 2, 3 + dy, SH_P)
def g_carry(a, dy=0): sp(a, PACK, 2, 3 + dy, PACK_P)
MAST = [('sword', '검술', 'blood', g_sword), ('axe', '도끼술', 'ember', g_axe), ('blunt', '둔기술', 'stone', g_blunt), ('lance', '창술', 'teal', g_lance),
        ('bow', '궁술', 'green', g_bow), ('dagger', '단검술', 'dark', g_dagger), ('lute', '연주법', 'rose', g_lute), ('plate', '갑옷 숙련', 'steelb', g_plate),
        ('magic', '마법 지식', 'arcane', g_magic), ('holy', '신성학', 'holy', g_holy), ('shield', '방패술', 'royal', g_shield), ('carry', '운반술', 'earth', g_carry)]
# ── A안: 월계관 ──
def wreath_cells(t):
    """양쪽 가지(아래 가운데 → 위 옆): 줄기 2, 잎 1. 칸 사전"""
    cm = {}; cx, cy, rx, ry = 7.5, 9.0, 6.4, 8.2
    def put(x, y, ch):
        x, y = int(math.floor(x)), int(math.floor(y))
        if 0 <= x < W and 0 <= y < H and (cm.get((x, y)) != '1' or ch == '1'): cm[(x, y)] = ch
    for side in (-1, 1):
        for i in range(0, 34):
            th = math.radians(96 + i * 3.4)
            x = cx + side * rx * math.cos(th) * -1 if False else cx - side * rx * abs(math.cos(th)) * (1 if math.cos(th) < 0 else -1)
            x = cx + side * rx * -math.cos(th); y = cy + ry * math.sin(th)
            put(x, y, '2')
            if i % 3 == 1:   # 잎: 바깥 · 안쪽 번갈아
                ox = side * 1.1 * (1 if (i // 3) % 2 == 0 else -1)
                put(x + ox, y - 0.6, '1')
    return cm
def ring_cm(cx=7.5, cy=9.5, ro=7.3, ri=5.5):
    cm = {}
    for y in range(H):
        for x in range(W):
            n = 0
            for j in range(4):
                for i in range(4):
                    r = math.hypot(x + (i + 0.5) / 4 - cx, (y + (j + 0.5) / 4 - cy) * 0.92)
                    if ri <= r <= ro: n += 1
            if n >= 8: cm[(x, y)] = '1' if (x + 0.5 - cx) + (y + 0.5 - cy) < 0 else '2'
    return cm
RING = ring_cm()
def style_a(theme, glyph, t):
    rp = R[theme]
    a = A(theme, cy=9.5)
    for (x, y) in [(x, y) for y in range(H) for x in range(W) if math.hypot(x + 0.5 - 7.5, (y + 0.5 - 9.5) * 0.92) < 5.6]: a.set(x, y, rp[1])
    l, d = TIER[t]
    sp(a, grid(RING), {'1': (l, 6), '2': (d, 6)})
    glyph(a, 0)
    return a
def style_c(theme, glyph, t):
    a = A(theme, cy=8.5, rays=12, k=0.3, hole=4)
    glyph(a, 0)
    return a
# ── B안: 휘장 깃발 + 별 ──
def banner(a, col, col2, col3):
    for y in range(H):
        for x in range(W): a.set(x, y, '#1c1a20' if (x + y // 3) % 5 else '#141218')
    for y in range(3, 19):
        for x in range(3, 13):
            if y >= 15 and abs(x + 0.5 - 8) < (y - 14) * 1.25: continue
            a.set(x, y, col3 if x in (3, 12) else col if x < 10 else col2)
    for x in range(1, 15): a.set(x, 2, '#c08a4a'); a.set(x, 3, '#7a4c22')
    a.set(0, 2, '#ffd84a'); a.set(15, 2, '#ffd84a')
def style_b(theme, glyph, t):
    a = A(theme, cy=8.0, rays=12, k=0.3, hole=4)
    glyph(a, -1)
    l, d = TIER[t]
    for i in range(3):   # 아래 가운데 단계 점 셋: 배운 만큼 쇠 색, 나머지는 빈 칸
        x = 4 + i * 3
        for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)):
            a.set(x + dx, 16 + dy, (l if (dx, dy) == (0, 0) else d) if i <= t else ('#3a3440' if (dx, dy) == (0, 0) else '#241e28'))
    return a
# ── 시트 ──
FRAME = [('#d89a64', '#9a5e34', '#64381c'), ('#e4e8f0', '#9aa2ae', '#5e6672'), ('#ffe07a', '#c8962c', '#7e5814')]
FRAME0 = ('#c8a870', '#8a6a3c', '#5a4428')
def framed(art, t):
    im = art.img('buff'); px = im.load(); base = cell.b4.hexbase('buff').load() if hasattr(cell, 'b4') else None
    import b4
    hb = b4.hexbase('buff').load(); m = {b4.rgb(FRAME0[i]): b4.rgb(FRAME[t][i]) for i in range(3)}
    for y in range(48):
        for x in range(48):
            c = hb[x, y]
            if c[3] and c[:3] in m: px[x, y] = m[c[:3]] + (255,)
    return im
def sheet(items, out, Z=3):
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 15, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 17, index=2)
    CW, RH, LW = 48 * Z + 14, 48 * Z + 34, 110
    sh = Image.new('RGB', (LW + CW * 9 + 50, RH * len(items) + 44), (21, 23, 28)); d = ImageDraw.Draw(sh)
    for s_, tt in enumerate(['A안 · 메달 고리 (동·은·금)', 'B안 · 단계 점 + 틀 색', 'C안 · 그림만 (틀 색으로 단계)']): d.text((LW + 10 + s_ * (CW * 3 + 20), 8), tt, font=fb, fill=(242, 190, 60))
    for r, (k, name, theme, g) in enumerate(items):
        y = 40 + r * RH
        d.text((10, y + 60), name, font=fb, fill=(240, 240, 240))
        for t in range(3):
            for s, fn in enumerate((style_a, style_b, style_c)):
                im = framed(fn(theme, g, t), t).resize((48 * Z, 48 * Z), Image.NEAREST)
                x = LW + s * (CW * 3 + 20) + t * CW
                sh.paste(im, (x, y), im); d.text((x + 52, y + 48 * Z + 4), TIER_NAME[t], font=f, fill=(200, 200, 200))
    sh.save(out)
if __name__ == '__main__':
    D = pathlib.Path(__file__).parent
    sheet(MAST[:6], D / 'mast_sheet_1.png'); sheet(MAST[6:], D / 'mast_sheet_2.png'); print('ok')
