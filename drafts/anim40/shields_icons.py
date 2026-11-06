"""방패 종류 시안 (빌드 39): 원형·히터·카이트·탑 × 단계 색 넷 (견습·숲지기 나무와 쇠 / 강철·폭풍 강철과 붉은색 / 서리·사막왕 푸른색과 금 / 그 위 금과 상아)
역할 글자: 1 2 테(밝음·어둠) · 3 4 바탕 · 5 6 무늬 · 7 돌기·보석 · 8 못 · 9 날개
python3 shields.py → shields_sheet.png"""
import math, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from cell import W, H
from lib import *
import offhand as O
LOOKS = [
    {'1': ('#c8ccd4', 5), '2': ('#8a8e98', 5), '3': ('#b8823e', 3), '4': ('#7a4c22', 3), '5': ('#c8ccd4', 5), '6': ('#8a8e98', 5), '7': ('#eef2f8', 5), '8': ('#5a5e68', 5), '9': ('#ffffff', 1)},
    {'1': ('#eef2f8', 5), '2': ('#a2aab8', 5), '3': ('#c8ccd4', 5), '4': ('#8a8e98', 5), '5': ('#e84848', 13), '6': ('#b03737', 13), '7': ('#ffffff', 5), '8': ('#626977', 5), '9': ('#ffffff', 1)},
    {'1': ('#ffd84a', 6), '2': ('#c08a1c', 6), '3': ('#4a8aff', 12), '4': ('#3869c2', 12), '5': ('#ffd84a', 6), '6': ('#c08a1c', 6), '7': ('#9aeeff', 12), '8': ('#c08a1c', 6), '9': ('#ffffff', 1)},
    {'1': ('#ffd84a', 6), '2': ('#c08a1c', 6), '3': ('#f0e8d0', 7), '4': ('#b8a684', 7), '5': ('#ffd84a', 6), '6': ('#c08a1c', 6), '7': ('#ff7a8a', 13), '8': ('#c08a1c', 6), '9': ('#ffffff', 1)},
]
GLOW = [None, None, None, None]   # 방패 '그 위'는 빛 테두리 대신 날개 (빌드 38 금 방패와 같이)
def _finish(a, cm, look):
    sp(a, grid(cm), LOOKS[look], glow_c=GLOW[look])
def _wings(cm, look, y=3):
    if look < 3: return
    for (x, yy) in [(1, y), (2, y - 1), (2, y), (2, y + 1), (1, y + 2), (14, y), (13, y - 1), (13, y), (13, y + 1), (14, y + 2), (0, y + 1), (15, y + 1)]: cm.setdefault((x, yy), '9')
def round_(a, look):   # 원형 방패: 둥근 테 + 가운데 돌기 + 못
    cm = {}; cx, cy, r = 7.5, 9.5, 6.4
    for y in range(H):
        for x in range(W):
            dx, dy = x + 0.5 - cx, y + 0.5 - cy; d = math.hypot(dx, dy)
            if d < r - 1.0:
                if look == 0: cm[(x, y)] = '4' if x in (4, 8, 11) else '3'       # 나무 널빤지
                elif look == 1: cm[(x, y)] = '5' if 2.2 < d < 3.4 else ('3' if dx + dy < 0 else '4')   # 붉은 고리
                elif look == 2: cm[(x, y)] = '5' if (abs(dx) < 0.9 or abs(dy) < 0.9) and d > 1.6 else ('3' if dx + dy < 0 else '4')   # 금 십자
                else: cm[(x, y)] = '5' if 2.2 < d < 3.3 else ('3' if dx + dy < 0 else '4')   # 금 고리 + 보석
            elif d < r: cm[(x, y)] = '1' if dx + dy < 0 else '2'
    for (x, y) in [(6, 8), (7, 8), (8, 8), (6, 9), (7, 9), (8, 9), (6, 10), (7, 10), (8, 10)]: cm[(x, y)] = ('7' if look in (0, 3) else '7') if (x, y) != (8, 10) else '2'
    cm[(6, 8)] = 'w'
    for (x, y) in [(7, 4), (3, 9), (12, 9), (7, 15)]: cm[(x, y)] = '8'
    _wings(cm, look, 8)
    _finish(a, cm, look)
def heater_(a, look):   # 히터 방패: 위가 평평, 아래 뾰족 + 세로띠
    cm = {}
    O.heater(cm, 2, 3, 12, 15, lambda x, y: '1' if x < 8 else '2', lambda x, y: ('5' if x < 8 else '6') if 6 <= x <= 9 else ('3' if x < 7 else '4') if look else ('4' if y in (7, 12) else '3' if x < 7 else '4'))
    for (x, y) in [(4, 5), (11, 5)]: cm[(x, y)] = '8'
    if look >= 2: cm[(7, 8)] = '7'; cm[(8, 8)] = '7'
    _wings(cm, look, 3)
    _finish(a, cm, look)
def kite_(a, look):   # 카이트 방패: 길쭉하게 뾰족 + 십자
    cm = {}
    O.heater(cm, 2, 2, 12, 17, lambda x, y: '1' if x < 8 else '2', lambda x, y: '3' if (x + y) % 7 else '4')
    for y in range(5, 15): cm[(7, y)] = '5'; cm[(8, y)] = '6'
    for x in range(4, 12): cm[(x, 8)] = '5' if x < 8 else '6'
    if look >= 3: cm[(7, 8)] = '7'; cm[(8, 8)] = '7'
    _wings(cm, look, 2)
    _finish(a, cm, look)
def tower_(a, look):   # 탑 방패: 키 큰 네모 + 띠 두 줄 + 가운데 문장
    cm = {}; x0, x1, y0, y1 = 3, 12, 1, 18
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (y == y1 and x in (x0, x1)): continue
            edge = x in (x0, x1) or y in (y0, y1)
            cm[(x, y)] = ('1' if x < 8 else '2') if edge else ('4' if look == 0 and x in (5, 8, 11) else '3' if x < 8 else '4')
    for x in range(x0 + 1, x1): cm[(x, 5)] = '5' if x < 8 else '6'; cm[(x, 14)] = '5' if x < 8 else '6'
    for (x, y) in [(6, 8), (7, 8), (8, 8), (9, 8), (6, 9), (9, 9), (6, 10), (9, 10), (7, 11), (8, 11)]: cm[(x, y)] = '5' if x < 8 else '6'
    cm[(7, 9)] = '7'; cm[(8, 9)] = '7'; cm[(7, 10)] = '7'; cm[(8, 10)] = '2'
    for (x, y) in [(4, 3), (11, 3), (4, 16), (11, 16)]: cm[(x, y)] = '8'
    _wings(cm, look, 2)
    _finish(a, cm, look)
def cross_(a, look):   # 십자 방패 (빌드 40, 빌드 38 성기사 방패 모양): 모서리 둥근 네모 + 큰 십자(가로대가 위쪽) + 가운데 보석
    cm = {}; x0, x1, y0, y1 = 3, 12, 2, 17
    cut = {(x0, y0), (x1, y0), (x0, y1), (x1, y1), (x0 + 1, y1), (x1 - 1, y1), (x0, y1 - 1), (x1, y1 - 1)}
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x, y) in cut: continue
            edge = x in (x0, x1) or y in (y0, y1) or (y == y1 - 1 and x in (x0 + 1, x1 - 1))
            cm[(x, y)] = ('1' if x < 8 else '2') if edge else ('3' if x < 7 else '4')
    for y in range(y0 + 1, y1 - 1): cm[(7, y)] = '5'; cm[(8, y)] = '6'
    for x in range(x0 + 1, x1): cm[(x, 7)] = '5' if x < 8 else '6'; cm[(x, 8)] = '6'
    if look >= 2: cm[(7, 7)] = '7'; cm[(8, 7)] = '7'; cm[(7, 8)] = '7'; cm[(8, 8)] = '2'
    for (x, y) in [(4, 3), (11, 3)]: cm[(x, y)] = '8'
    _wings(cm, look, 3)
    _finish(a, cm, look)
KINDS = [('buckler', '원형 방패', round_), ('shield', '히터 방패', heater_), ('kite', '카이트 방패', kite_), ('tower', '탑 방패', tower_), ('cross', '십자 방패 (새)', cross_)]
def sheet(out):
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 17, index=2)
    Z = 6; CW, RH, LW = W * Z + 66, H * Z + 22, 130
    sh = Image.new('RGB', (LW + CW * 4 + 10, RH * len(KINDS) + 90), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 10), '방패 종류 시안 · 왼쪽 → 오른쪽 단계 색 (견습·숲지기 / 강철·폭풍 / 서리·사막왕 / 그 위) · 작은 그림 = 목록 크기', font=fb, fill=(242, 190, 60))
    for c, t in enumerate(O.TIER_RANGE): d.text((LW + c * CW + 20, 52), t, font=f, fill=(200, 200, 200))
    for r, (k, nm, fn) in enumerate(KINDS):
        y = 76 + r * RH
        d.text((10, y + 50), nm, font=fb, fill=(240, 240, 240))
        for c in range(4):
            x = LW + c * CW; g = lambda a, fn=fn, c=c: fn(a, c)
            d.rectangle((x, y, x + W * Z + 8, y + H * Z + 8), fill=(40, 34, 30), outline=(90, 74, 50))
            big = O.render(g, Z); sh.paste(big, (x + 4, y + 4), big)
            sm = O.render(g, 2); d.rectangle((x + W * Z + 14, y + 4, x + W * Z + 14 + 36, y + 4 + 44), fill=(40, 34, 30)); sh.paste(sm, (x + W * Z + 16, y + 6), sm)
    sh.save(out)
if __name__ == '__main__':
    sheet(pathlib.Path(__file__).parent / 'shields_sheet.png'); print('ok')
