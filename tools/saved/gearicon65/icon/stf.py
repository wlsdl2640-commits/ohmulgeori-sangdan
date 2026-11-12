"""스태프 — 마법사 · 마도사 · 대마도사 (11-10 20:16 사용자). 원형 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
축 x + y = 19 (머리가 오른쪽 위 45°), 자루 · 머리 · 자루 끝이 모두 축 위 · 윤곽 축 대칭(sym_err).
틀
  A 옹이 지팡이: 나무 자루가 위에서 두 갈래로 갈라져 둥근 보석을 감싸 쥔다
  B 고리 지팡이: 쇠 자루 · 목테 · 큰 고리 안에 떠 있는 구슬
  C 해 지팡이: 둥근 보석 둘레에 빛살 여덟 (초승달은 도끼, 별은 뭉개져 바꿈)
  D 수정 지팡이: 쇠띠 감은 자루 · 발톱 셋이 쥔 긴 수정
글자: 자루 r q R(나무/쇠 빛 · 몸 · 그늘) k(띠) · 쇠붙이 h g G · 보석/구슬 z(빛) Z(몸) u(그늘) w(반짝) · 수정 c C n · 자루 끝 p o O · 효과 1 2"""
import math
from g4 import Sw
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
def UVp(x, y): return x - y, x + y - 19
def dist(x, y, cx, cy): return math.hypot(x + .5 - cx, y + .5 - cy)
def shaft(s, u0, u1, ch3=('r', 'q', 'R'), band=None):
    """3칸 굵기 자루 (|v| ≤ 1): 빛 쪽 r · 가운데 q · 그늘 R, band = 띠 두를 u 목록"""
    for u in range(u0, u1 + 1):
        for v in (-1, 0, 1):
            ch = ch3[0] if v < 0 else (ch3[2] if v > 0 else ch3[1])
            if band and u in band: ch = 'k' if v <= 0 else 'K'
            P(s, 'grip', u, v, ch)
def butt(s, metal=True):
    """자루 끝 (축 위 (1,18) 꼭지) — 쇠 덮개 셋"""
    for (x, y, ch) in ((1, 17, 'p'), (2, 18, 'O'), (1, 18, 'o')): s.put(x, y, 'pommel', ch)
def collar(s, u, w=2):
    for v in range(-w, w + 1): P(s, 'guard', u, v, 'h' if v < 0 else ('G' if v > 0 else 'g'))
def orb(s, cx, cy, r, part='head'):
    """구슬: 왼쪽 위 빛 z · 몸 Z · 오른쪽 아래 그늘 u · 반짝 w"""
    for y in range(20):
        for x in range(20):
            d = dist(x, y, cx, cy)
            if d > r: continue
            dx, dy = x + .5 - cx, y + .5 - cy
            t = (dx + dy) / max(r, 1e-6)
            ch = 'z' if t < -0.55 else ('u' if t > 0.55 else 'Z')
            s.put(x, y, part, ch)
    s.put(int(cx - r * 0.45), int(cy - r * 0.45), part, 'w')
def ring(s, cx, cy, r0, r1, part='guard'):
    for y in range(20):
        for x in range(20):
            d = dist(x, y, cx, cy)
            if r0 <= d <= r1:
                dx, dy = x + .5 - cx, y + .5 - cy
                t = (dx + dy) / r1
                s.put(x, y, part, 'h' if t < -0.35 else ('G' if t > 0.45 else 'g'))
HC = (14.5, 5.5)                                  # 머리 가운데 (축 x + y = 20 위, 칸 (14,5))
def mput(s, part, x, y, ch, chm=None):
    """(x, y)와 축 거울 칸 (19 − y, 19 − x)에 같이 찍는다 (chm = 거울 쪽 글자)"""
    s.put(x, y, part, ch); s.put(19 - y, 19 - x, part, chm or ch)
def fA(s):
    shaft(s, -17, 2)
    for (u, v) in ((-9, 2), (-9, -2), (-3, 2), (-3, -2)): P(s, 'grip', u, v, 'r' if v < 0 else 'R')   # 옹이
    for (x, y) in ((11, 7), (11, 6), (11, 5), (12, 4), (12, 3), (13, 2), (14, 2)):          # 두 갈래 가지: 보석을 옆에서 감아 끝이 안으로 굽음
        mput(s, 'grip', x, y, 'r', 'R')
    for y in range(4, 7):
        for x in range(13, 16): s.put(x, y, 'head', 'Z')
    for (x, y, ch) in ((13, 4, 'w'), (14, 4, 'z'), (13, 5, 'z'), (15, 6, 'u'), (15, 5, 'u'), (14, 6, 'u')): s.put(x, y, 'head', ch)
def fB(s):
    shaft(s, -17, 0, ch3=('h', 'g', 'G')); collar(s, 1); collar(s, -15)
    ring(s, 14.0, 6.0, 3.1, 4.2)
    orb(s, 14.0, 6.0, 1.5)
def star_pts(cx, cy, R, r, n=5):
    """끝 하나가 축(오른쪽 위)을 향한 별 꼭짓점"""
    a0 = math.atan2(-1, 1)
    pts = []
    for k in range(2 * n):
        a = a0 + math.pi * k / n
        rr = R if k % 2 == 0 else r
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts
def inpoly(px, py, pts):
    c = False
    for i in range(len(pts)):
        x1, y1 = pts[i]; x2, y2 = pts[i - 1]
        if (y1 > py) != (y2 > py) and px < (x2 - x1) * (py - y1) / (y2 - y1) + x1: c = not c
    return c
SUNRAY = [((16, 3), (17, 2)), ((11, 3), (10, 2)), ((16, 8), (17, 9)), ((16, 5), (17, 5)), ((14, 3), (14, 2)), ((13, 8), (13, 9)), ((11, 6), (10, 6))]
def fC(s):
    shaft(s, -17, 1)
    collar(s, 2)
    for ray in SUNRAY:                                                                      # 빛살 일곱 (아래 왼쪽은 자루) — 거울 짝으로 놓아 대칭
        for (x, y) in ray:
            t = (x - 14) + (y - 6)
            s.put(x, y, 'head', 'c' if t < -1 else ('n' if t > 1 else 'C'))
    orb(s, 14.0, 6.0, 2.3)
def fD(s):
    shaft(s, -17, 1, ch3=('h', 'g', 'G'), band=(-12, -11, -6, -5))
    collar(s, 2, 3)
    for u in range(3, 15):                                                                   # 육각 기둥 수정: 곧은 옆 · 짧은 뾰족 끝
        hw = 2.5 if u <= 11 else 2.5 * (14 - u) / 3
        for v in range(-3, 4):
            if abs(v) <= hw + 1e-6 and (u + v) % 2:
                P(s, 'head', u, v, 'c' if v < -1 else ('n' if v > 0 else 'C'))
    for sg in (-1, 1):                                                                       # 발톱 둘: 밑동 양옆을 감아 쥔다
        for (u, v) in ((3, 4), (4, 4), (5, 4), (6, 3)):
            P(s, 'guard', u, sg * v, 'h' if sg < 0 else 'G')
    P(s, 'head', 9, -2, 'w'); P(s, 'head', 12, -1, 'w')
def frame(st):
    s = Sw(); s.fx = {}
    {'A': fA, 'B': fB, 'C': fC, 'D': fD}[st](s)
    butt(s)
    return s
STYLE = {'A': '옹이 지팡이', 'B': '고리 지팡이', 'C': '해 지팡이', 'D': '수정 지팡이'}
WOOD = dict(r='#a8784a', q='#7a5030', R='#4a2e18', k='#c8b08a', K='#6a5236')
IRON = dict(h='#d8dee8', g='#8a94a8', G='#4e5662')
BRASS = dict(h='#fff0b0', g='#e0b050', G='#8a6020')
CAP = dict(p='#e8eef6', o='#a8b0bc', O='#4e5662')
GEM_B = dict(z='#c8f0ff', Z='#3a9ae8', u='#1a4a9a', w='#ffffff')
CRYS = dict(c='#e8fcff', C='#8ad8f4', n='#3a7ab8', w='#ffffff')
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
@frm('A', '나무 자루가 위에서 두 갈래로 갈라져 둥근 보석을 감싸 쥔다 · 옹이')
def gA(): return frame('A'), dict(WOOD, **CAP, **GEM_B)
@frm('B', '쇠 자루 · 목테 · 큰 고리 안에 떠 있는 구슬')
def gB(): return frame('B'), dict(IRON, r='#d8dee8', q='#8a94a8', R='#4e5662', **CAP, **dict(GEM_B, z='#fff0c0', Z='#f0a030', u='#a85a10'))
@frm('C', '둥근 보석 둘레에 빛살 — 해처럼 빛을 뿜는다')
def gC(): return frame('C'), dict(WOOD, **IRON, **CAP, c='#fffbd0', C='#f0c040', n='#a87018', **dict(GEM_B, z='#e8d8ff', Z='#9a6ae8', u='#4a2a9a'))
@frm('D', '쇠띠 감은 자루 · 발톱이 쥔 긴 수정')
def gD(): return frame('D'), dict(IRON, k='#f0c040', K='#a87018', **CAP, **CRYS)
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
@make(1, 'A', '견습 마법사의 지팡이', '마탑 견습생이 처음 받는 나무 지팡이 · 작은 푸른 보석')
def s01(): return frame('A'), M(WOOD, CAP, GEM_B, r='#b89068', q='#8a6440', R='#54381e')
@make(10, 'B', '놋쇠 고리 지팡이', '놋쇠 고리 안에 호박빛 구슬이 떠 있다')
def s10(): return frame('B'), M(BRASS, CAP, r='#fff0b0', q='#e0b050', R='#8a6020', z='#fff4c8', Z='#f0a030', u='#a85a10', w='#ffffff')
@make(20, 'C', '새벽빛 지팡이', '은빛 빛살 · 보랏빛 보석')
def s20(): return frame('C'), M(WOOD, IRON, CAP, c='#ffffff', C='#d8e0ec', n='#8a94aa', z='#e8d8ff', Z='#9a6ae8', u='#4a2a9a', w='#ffffff')
@make(30, 'D', '푸른 수정 지팡이', '푸른 수정을 쇠 발톱이 쥐었다')
def s30(): return frame('D'), M(IRON, CAP, CRYS, k='#5a8ae8', K='#22346a')
@make(40, 'B', '불씨 고리 지팡이', '검은 쇠고리 안에서 불씨 구슬이 타오른다')
def s40():
    s = frame('B'); s.fx.update({(17, 1): '1', (12, 2): '2'})
    return s, M(CAP, h='#6a5a5a', g='#3e2c2c', G='#241616', r='#6a5a5a', q='#3e2c2c', R='#241616', z='#fff2b0', Z='#ff7a1a', u='#c8301a', w='#ffffff',
                **{'1': '#ffd84a', '2': '#ff8a1a'})
@make(50, 'A', '떡갈나무 현자 지팡이', '늙은 떡갈나무 가지 · 숲빛 보석')
def s50(): return frame('A'), M(WOOD, CAP, r='#8a6a3a', q='#64482a', R='#3a2a14', z='#d8ffc0', Z='#4ab848', u='#1e6a28', w='#ffffff')
@make(60, 'D', '서리 수정 지팡이', '얼음 수정 · 서리 낀 은띠')
def s60():
    s = frame('D'); s.fx.update({(18, 0): '1', (13, 2): '2'})
    return s, M(CAP, h='#ffffff', g='#c8e4f4', G='#7aa8c8', k='#ffffff', K='#7aa8c8', c='#ffffff', C='#c8f0ff', n='#5aa8e0', w='#ffffff',
                **{'1': '#ffffff', '2': '#bdeeff'})
@make(70, 'C', '노을 해 지팡이', '저녁노을빛 빛살 · 붉은 보석')
def s70(): return frame('C'), M(WOOD, IRON, CAP, c='#ffe0a0', C='#f09048', n='#a84a28', z='#ffd0c0', Z='#e0283a', u='#7a0e1a', w='#ffffff',
                                r='#5a3a48', q='#3e2834', R='#24161e')
@make(80, 'A', '벼락 맞은 고목 지팡이', '벼락에 그을린 고목 · 노란 번개 보석')
def s80():
    s = frame('A'); s.fx.update({(18, 2): '1', (11, 2): '2', (17, 8): '2'})
    return s, M(CAP, r='#5a5048', q='#3a322c', R='#1e1a16', z='#fffbd0', Z='#fff36a', u='#c0901a', w='#ffffff', **{'1': '#ffffff', '2': '#fff36a'})
@make(90, 'D', '자수정 지팡이', '자수정 기둥 · 금띠 · 금 발톱')
def s90(): return frame('D'), M(BRASS, CAP, k='#f0c040', K='#a87018', c='#f4e0ff', C='#b07ae8', n='#5a2a9a', w='#ffffff')
@make(100, 'B', '마도사의 금 고리 지팡이', '마도사만 드는 금 고리 · 하늘빛 구슬')
def s100(): return frame('B'), M(CAP, h='#fffbd0', g='#f0c040', G='#a87018', r='#fffbd0', q='#f0c040', R='#a87018', z='#e0fbff', Z='#5ad8f4', u='#1a7aa8', w='#ffffff')
@make(110, 'C', '창공의 지팡이', '흰 빛살 · 하늘을 담은 푸른 보석 · 은 자루')
def s110():
    s = frame('C'); s.fx.update({(18, 1): '1', (10, 2): '2'})
    return s, M(IRON, CAP, r='#e8eef6', q='#a8b4c8', R='#5a6680', c='#ffffff', C='#e0ecff', n='#8aa0d8', z='#e0f0ff', Z='#5a8ae8', u='#22346a', w='#ffffff',
                **{'1': '#ffffff', '2': '#c8d8ff'})
@make(120, 'D', '흑요석 수정 지팡이', '빛을 먹는 검은 수정 · 보랏빛 금')
def s120(): return frame('D'), M(CAP, h='#5a5664', g='#383440', G='#201e26', k='#a878ff', K='#4e3a78', c='#c8a8ff', C='#3e3252', n='#1a1426', w='#e8d8ff')
@make(130, 'C', '핏빛 태양 지팡이', '핏빛 빛살 · 검붉은 보석 · 검은 자루')
def s130(): return frame('C'), M(CAP, r='#3a3434', q='#262222', R='#141010', h='#5a3a3a', g='#3a2424', G='#1a0e0e',
                                 c='#ff8a8a', C='#c8283a', n='#6a0e1a', z='#ffb0b0', Z='#a01a24', u='#4a0610', w='#ffffff')
@make(140, 'A', '세계수 가지 지팡이', '세계수에서 떨어진 가지 · 생명의 보석이 빛난다')
def s140():
    s = frame('A'); s.fx.update({(18, 2): '1', (11, 3): '2', (16, 9): '1'})
    return s, M(CAP, r='#c8a070', q='#9a7448', R='#5a4024', z='#f0fff0', Z='#7ae880', u='#2a9a48', w='#ffffff', **{'1': '#d8ffc0', '2': '#7ae880'})
@make(150, 'B', '대마도사의 성운 지팡이', '금 고리 안에 성운이 도는 구슬 — 대마도사의 마지막 지팡이 · 별빛이 감돈다')
def s150():
    s = frame('B'); s.fx.update({(18, 0): '1', (9, 3): '2', (19, 9): '2', (16, 11): '1'})
    return s, M(CAP, h='#fffbd0', g='#f0c040', G='#a87018', r='#2a2450', q='#1a1640', R='#0c0a22', z='#ffd8ff', Z='#8a4ae8', u='#22186a', w='#ffffff',
                **{'1': '#ffffff', '2': '#d8b8ff'})
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d.get('lv', d.get('key')), 'sym', len(e), e[:4])
        out.append((ic.render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'stf_frames.png', z=12)
    zoomsheet(out[4:12], 'stf_z1.png', z=9); zoomsheet(out[12:], 'stf_z2.png', z=9)
    print(Counter(d['st'] for d in G))
