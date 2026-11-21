"""전사 시안 3 (11-22 05:51 사용자 「그래픽 수준 더 올려. 우선 전사부터 시안 4종류 이상」) — 키 48칸 안팎, 가는 도트, 3톤 셀 명암.
   python3 war3.py <출력 폴더> → A~E.png (72×72) · sheet.png"""
import sys, math
from PIL import Image
from kit import *
GY = 66
def rot(ox, oy, ang, pts):   # ang: 0 = 위, 90 = 앞(오른쪽)
    a = math.radians(ang); ux, uy = math.sin(a), -math.cos(a); nx, ny = -uy, ux
    return [(round(ox + ux * l + nx * w), round(oy + uy * l + ny * w)) for l, w in pts]
def sword(c, hx_, hy, ang, L=22, w=2, blade='steel', guard='gold', big=False):
    c.P(rot(hx_, hy, ang, [(3, -w), (L - 3, -w), (L + 1, 0), (L - 3, w), (3, w)]), blade, rim=1, shade=1)
    c.P(rot(hx_, hy, ang, [(4, 0), (L - 2, 0), (L - 2, 0.4), (4, 0.4)]), M[blade][2:3] * 4, rim=0, shade=0, line=False)     # 피홈
    c.P(rot(hx_, hy, ang, [(1, -w - 3), (2.6, -w - 3), (2.6, w + 3), (1, w + 3)]), guard, shade=1)
    c.P(rot(hx_, hy, ang, [(-4 - big * 2, -1), (1, -1), (1, 1), (-4 - big * 2, 1)]), 'dleather', rim=0, shade=1)
    c.P(rot(hx_, hy, ang, [(-6 - big * 2, -1.5), (-4 - big * 2, -1.5), (-4 - big * 2, 1.5), (-6 - big * 2, 1.5)]), guard, shade=1)
def leg(c, x, mat, boot, greave=None, w=5, y0=50, back=False):
    c.R(x, y0, x + w, GY - 5, mat, rim=0 if back else 1)
    if greave: c.R(x, y0 + 5, x + w, GY - 5, greave, rim=0 if back else 1); c.hl(x, x + w, y0 + 5, greave, 3)
    c.P([(x, GY - 5), (x + w, GY - 5), (x + w + 2, GY - 2), (x + w + 2, GY - 1), (x, GY - 1)], boot, rim=0 if back else 1, shade=1)
def face(c, x0, y0, x1, y1, eye=(0, 0), skin='skin'):
    c.E(x0, y0, x1, y1, skin, shade=2)
    ex, ey = x1 - 5 + eye[0], (y0 + y1) // 2 + eye[1]
    c.px([(ex, ey), (ex, ey + 1), (ex, ey + 2), (ex + 1, ey), (ex + 1, ey + 1), (ex + 1, ey + 2)], K); c.px([(ex + 1, ey)], 'white', 0)
    c.px([(ex - 6, ey), (ex - 6, ey + 1), (ex - 6, ey + 2), (ex - 5, ey), (ex - 5, ey + 1), (ex - 5, ey + 2)], K); c.px([(ex - 5, ey)], 'white', 0)
    c.px([(ex - 2, ey + 5), (ex - 3, ey + 5)], 'skin', 3)                     # 입
    c.px([(ex - 8, ey + 3), (ex - 7, ey + 3)], 'red', 0)                      # 볼
def arm(c, sx, sy, hx_, hy, mat, glove, pauldron=None, w=2):
    ex, ey = (sx + hx_) // 2 - 1, (sy + hy) // 2 + 1
    c.P([(sx - w, sy), (sx + w, sy), (ex + w, ey), (ex - w, ey)], mat, shade=1)
    c.P([(ex - w, ey - 1), (ex + w, ey - 1), (hx_ + w, hy), (hx_ - w, hy)], glove if glove in ('steel', 'dsteel') else mat, shade=1)
    c.E(hx_ - 2, hy - 2, hx_ + 2, hy + 2, glove, shade=1)
    if pauldron: c.E(sx - 4, sy - 4, sx + 4, sy + 3, pauldron); c.hl(sx - 3, sx + 3, sy + 1, pauldron, 2)

def A():   # 둥근 투구 기사: 깃 장식 · 판금 흉갑 · 붉은 망토 · 둥근 방패
    c = Cv()
    c.P([(27, 36), (33, 36), (30, 58), (20, 60), (22, 46)], 'red', shade=3)                       # 망토
    c.vl(24, 46, 58, 'red', 2); c.vl(27, 42, 57, 'red', 2)
    leg(c, 28, 'dark', 'dleather', 'dsteel', back=True); leg(c, 34, 'dark', 'leather', 'steel')
    c.P([(27, 37), (41, 37), (41, 47), (39, 50), (29, 50), (27, 47)], 'steel', shade=3)           # 흉갑
    c.hl(29, 40, 42, 'steel', 2); c.hl(30, 39, 39, 'steel', 0)
    c.R(27, 47, 41, 49, 'leather', shade=1); c.R(35, 47, 37, 49, 'gold', shade=0)                 # 띠
    c.P([(27, 50), (41, 50), (42, 52), (26, 52)], 'red', shade=1); c.vl(31, 51, 52, 'red', 2); c.vl(36, 51, 52, 'red', 2)
    sword(c, 33, 49, 232, L=22)   # 허리 천
    c.E(40, 38, 54, 52, 'wood', shade=3); c.E(41, 39, 53, 51, 'steel', rim=1, shade=2, line=False); c.E(43, 41, 51, 49, 'red', shade=2, line=False); c.E(45, 43, 49, 47, 'gold', shade=1)   # 방패
    face(c, 26, 20, 42, 36)
    c.P([(25, 27), (25, 22), (28, 18), (34, 16), (39, 18), (43, 22), (43, 27), (36, 26), (31, 27), (30, 33), (26, 33)], 'steel', shade=3)   # 투구
    c.hl(29, 35, 18, 'steel', 0); c.hl(27, 30, 20, 'steel', 0); c.hl(26, 42, 26, 'steel', 3); c.hl(31, 42, 25, 'gold', 1)
    c.P([(33, 16), (36, 16), (33, 9), (25, 9), (20, 14), (20, 22), (24, 18), (29, 15)], 'red', shade=2)       # 깃 장식
    c.px([(23, 13), (26, 11), (30, 11)], 'red', 0)
    arm(c, 31, 39, 33, 49, 'dark', 'steel', 'steel')
    return c
def B():   # 맨머리 검사: 머리띠 · 가죽 갑옷 + 한쪽 어깨받이 · 푸른 목도리 · 연 방패
    c = Cv()
    c.P([(26, 36), (30, 36), (24, 44), (17, 43), (15, 47), (20, 40)], 'blue', shade=1)             # 목도리 꼬리
    c.P([(19, 36), (29, 36), (29, 46), (24, 55), (19, 46)], 'blue', shade=3); c.P([(21, 38), (27, 38), (27, 45), (24, 51), (21, 45)], 'white', shade=1, rim=0); c.P([(23, 40), (25, 40), (25, 45), (24, 47), (23, 45)], 'blue', shade=0, rim=0, line=False)   # 등에 멘 연 방패
    leg(c, 28, 'cloth', 'dleather', back=True); leg(c, 34, 'cloth', 'leather')
    c.R(34, 60, 39, 61, 'leather', line=False, shade=0, rim=0); c.hl(34, 39, 56, 'leather', 2)
    c.P([(27, 37), (41, 37), (41, 48), (39, 51), (29, 51), (27, 48)], 'leather', shade=3)
    for y in (40, 43): c.hl(28, 40, y, 'leather', 2)
    for x in (30, 34, 38): c.px([(x, 41), (x, 44)], 'gold', 0)
    c.R(27, 47, 41, 49, 'dleather', shade=1); c.R(35, 47, 37, 49, 'steel', shade=0)
    c.P([(27, 50), (41, 50), (41, 52), (27, 52)], 'dleather', shade=1)
    face(c, 26, 20, 42, 36)
    c.P([(25, 30), (25, 22), (28, 17), (35, 15), (41, 18), (43, 23), (40, 23), (37, 21), (34, 24), (30, 24), (29, 30), (27, 34)], 'hair', shade=2)   # 머리
    c.px([(30, 18), (31, 17), (32, 17), (36, 17), (28, 21)], 'hair', 0); c.P([(38, 15), (41, 13), (40, 17)], 'hair', shade=0)
    c.R(26, 23, 43, 25, 'red', shade=1); c.P([(26, 23), (21, 26), (19, 31), (23, 28), (26, 26)], 'red', shade=1)                 # 머리띠
    c.R(27, 35, 41, 38, 'blue', shade=1); c.hl(28, 40, 35, 'blue', 0)                                                              # 목도리
    sword(c, 43, 46, 48, L=23); arm(c, 32, 40, 43, 46, 'cloth', 'leather', 'steel')
    return c
def C():   # 중장 기사: 통 투구 + 뿔 · 푸른 겉옷 · 탑 방패 · 키 52칸
    c = Cv()
    c.P([(25, 34), (33, 34), (31, 60), (19, 62), (21, 46)], 'blue', shade=3); c.vl(24, 44, 60, 'blue', 2); c.vl(28, 40, 59, 'blue', 2)
    leg(c, 27, 'dsteel', 'dsteel', 'dsteel', w=6, y0=51, back=True); leg(c, 34, 'steel', 'steel', 'steel', w=6, y0=51)
    c.E(34, 54, 40, 58, 'steel', shade=1)                                                           # 무릎
    c.P([(25, 34), (42, 34), (43, 47), (41, 51), (27, 51), (25, 47)], 'steel', shade=3)
    c.P([(29, 36), (39, 36), (40, 56), (28, 56)], 'blue', shade=2); c.P([(32, 39), (36, 39), (37, 43), (34, 46), (31, 43)], 'gold', shade=1)   # 겉옷 + 문장(방패 꼴)
    c.R(27, 46, 41, 48, 'leather', shade=1); c.R(33, 46, 35, 48, 'gold', shade=0)
    c.R(42, 32, 53, 58, 'dsteel', shade=3); c.R(44, 34, 51, 56, 'blue', shade=2, rim=1); c.R(44, 43, 51, 46, 'gold', shade=1, line=False); c.px([(43, 33), (52, 33), (43, 57), (52, 57)], 'gold', 0)   # 탑 방패
    c.P([(26, 15), (41, 15), (43, 18), (43, 33), (26, 33), (25, 18)], 'steel', shade=3)             # 통 투구
    c.R(33, 23, 43, 24, [K] * 4, line=False, shade=0, rim=0); c.px([(37, 24), (41, 24)], 'white', 0)
    for y in (27, 29, 31): c.px([(38, y), (41, y)], 'steel', 3)
    c.hl(27, 40, 16, 'steel', 0); c.vl(34, 15, 22, 'gold', 1); c.hl(26, 43, 21, 'steel', 2)
    c.P([(27, 16), (24, 12), (24, 7), (26, 11), (30, 15)], 'cloth', shade=1); c.P([(39, 15), (43, 12), (44, 7), (45, 12), (42, 16)], 'cloth', shade=1)   # 뿔
    sword(c, 47, 47, 4, L=26, w=2); arm(c, 31, 38, 47, 47, 'steel', 'steel', 'gold', w=3)
    return c
def D():   # 북방 용병: 털 깃 · 반 투구 · 땋은 수염 · 두 손 대검(방패 없음)
    c = Cv()
    leg(c, 28, 'dleather', 'dleather', back=True); leg(c, 34, 'leather', 'fur')
    c.R(34, 57, 40, 59, 'fur', shade=1)
    c.P([(26, 38), (42, 38), (42, 48), (40, 52), (28, 52), (26, 48)], 'dsteel', shade=3)
    for y in range(40, 47, 2):
        for x in range(28 + (y // 2) % 2, 41, 2): c.px([(x, y)], 'dsteel', 0)                     # 사슬
    c.R(26, 47, 42, 49, 'leather', shade=1); c.E(33, 46, 37, 50, 'gold', shade=1)
    c.P([(26, 50), (42, 50), (43, 55), (25, 55)], 'red', shade=1); c.hl(26, 42, 54, 'gold', 1)
    face(c, 26, 20, 42, 36)
    c.P([(30, 30), (41, 31), (40, 37), (36, 43), (33, 37)], 'blond', shade=2); c.px([(35, 39), (36, 41)], 'red', 1); c.px([(37, 33), (38, 33)], 'skin', 3)    # 수염
    c.P([(25, 28), (25, 22), (28, 18), (34, 16), (40, 18), (43, 22), (43, 26), (26, 27)], 'dsteel', shade=3); c.hl(26, 43, 25, 'gold', 1); c.vl(39, 26, 30, 'dsteel', 1); c.px([(39, 31)], 'dsteel', 2)   # 반 투구 + 코가리개
    c.hl(29, 35, 18, 'dsteel', 0)
    c.P([(25, 27), (29, 27), (28, 36), (24, 38)], 'blond', shade=1)                                 # 뒷머리
    c.P([(23, 35), (31, 33), (40, 34), (44, 37), (42, 41), (34, 39), (26, 41), (22, 39)], 'fur', shade=2); c.px([(26, 36), (30, 35), (35, 36), (40, 37)], 'fur', 2)   # 털 깃
    sword(c, 40, 48, -56, L=34, w=3, blade='steel', guard='dsteel', big=True)
    arm(c, 31, 41, 39, 48, 'dsteel', 'leather', None); c.E(34, 45, 38, 49, 'leather', shade=1)
    return c
def E():   # 견습 병사: 챙 투구 · 누비옷 · 작은 방패 · 짧은 칼
    c = Cv()
    leg(c, 28, 'dleather', 'dleather', back=True); leg(c, 34, 'leather', 'dleather')
    c.P([(27, 37), (41, 37), (42, 52), (26, 52)], 'green', shade=3)
    for x in (30, 34, 38): c.vl(x, 38, 51, 'green', 2)
    for y in (41, 45): c.hl(28, 40, y, 'green', 2)
    c.R(26, 46, 42, 48, 'leather', shade=1); c.R(35, 46, 37, 48, 'gold', shade=0); c.R(28, 48, 31, 52, 'leather', shade=1)
    c.E(40, 43, 50, 53, 'steel', shade=2); c.E(43, 46, 47, 50, 'dsteel', shade=1); c.px([(42, 45), (48, 45), (42, 51), (48, 51)], 'steel', 3)
    face(c, 26, 20, 42, 36)
    c.P([(26, 27), (27, 33), (30, 28)], 'hair', shade=1)
    c.P([(27, 24), (28, 19), (34, 16), (40, 19), (41, 24)], 'steel', shade=2); c.P([(22, 26), (27, 23), (41, 23), (46, 26), (46, 27), (22, 27)], 'steel', shade=1); c.hl(30, 36, 18, 'steel', 0)
    c.R(27, 36, 41, 38, 'cloth', shade=1)
    sword(c, 42, 44, 50, L=17); arm(c, 32, 40, 42, 44, 'green', 'leather', None)
    return c
V = [('A', '둥근 투구 기사', A), ('B', '맨머리 검사', B), ('C', '중장 기사', C), ('D', '북방 용병', D), ('E', '견습 병사', E)]
if __name__ == '__main__':
    out = sys.argv[1]; Z = 6; sheet = Image.new('RGB', (len(V) * W * Z, H * Z), '#a3ad6c')
    for i, (k, n, f) in enumerate(V):
        c = f(); c.outline(); im = c.img(); im.save(f'{out}/{k}.png'); sheet.paste(im.resize((W * Z, H * Z), Image.NEAREST), (i * W * Z, 0), im.resize((W * Z, H * Z), Image.NEAREST))
    sheet.save(f'{out}/sheet.png'); print(sheet.size)
