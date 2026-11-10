"""네크로노미콘 — 네크로맨서 · 리치 (11-10 20:16 사용자: 사선 형태 · 고어 · 호러 · 저주받은 디자인 · 마법진은 빨갛게 피가 흐르듯).
트럼프 덱처럼 책을 45°로 눕히고(긴 쪽이 무기 축), 책장 두께 3칸이 아래로 보인다. 표지 테 · 모서리 쇠/뼈는 책을 따라 눕고 가운데 그림은 똑바로.
피는 늘 아래로 흘러내린다(화면 아래로 똑똑). 마법진은 고리 · 눈금 · 점으로만(별꼴 · 실제 종교 표식 없음).
틀
  A 살가죽 장정: 꿰맨 자국이 지나가는 살가죽 표지 · 핏발 선 큰 눈
  B 뼈 장정: 썩은 가죽 표지 · 뼈 모서리 · 해골 새김 · 뼈 걸쇠
  C 아가리 책: 표지 한가운데 이빨 난 아가리 · 혀 · 침처럼 흐르는 피
  D 피의 마법진: 검은 표지에 피로 그린 고리 · 눈금 · 점 · 아래로 흐르는 피
글자: 책장 P p(줄) · 뒤표지 K · 표지 a(몸) b(그늘) · 테 e E · 모서리 h g · 꿰맨 자국 x · 피 r(밝은) R(검붉은) · 눈 w(흰자) v(핏발) i(눈동자) 9(동공)
      해골/뼈 1 2 3 · 이빨 t · 아가리 속 9 · 혀 n · 효과 * ~"""
import math
from sh import Sh
LU, LV, AXY, NL = 8, 6, 17, 3
def inside(u, v): return (u + v) % 2 == 1 and abs(u) <= LU and abs(v) <= LV
def XY(u, v): return (u + v + 19) // 2, (v - u + AXY) // 2
def UV(x, y): return x - y + (AXY - 19 + 1 + 1) - 1, x + y - (19 + AXY) // 2 - 0
COVER = set(XY(u, v) for u in range(-LU, LU + 1) for v in range(-LV, LV + 1) if inside(u, v))
def ring(S): return set(p for p in S if all((p[0] + dx, p[1] + dy) in S for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))))
IN1 = ring(COVER); RIM = COVER - IN1
TOPC = min(COVER, key=lambda p: (p[1], p[0])); RGTC = max(COVER, key=lambda p: (p[0], -p[1]))
BOTC = max(COVER, key=lambda p: (p[1], -p[0])); LFTC = min(COVER, key=lambda p: (p[0], p[1]))
def lit(x, y): return x + y < 18                 # 테 빛: 왼쪽 위 반
def pages(s):
    for k in range(NL, 0, -1):
        for (x, y) in COVER:
            q = (x, y + k)
            if q in COVER: continue
            s.put(q[0], q[1], 'K' if k == NL else ('P' if k == 1 else 'p'))
def cover(s, body='a'):
    for (x, y) in COVER:
        if (x, y) in RIM: s.put(x, y, 'e' if lit(x, y) else 'E')
        else: s.put(x, y, body)
def corners(s, ch=('h', 'g')):
    """네 모서리 쇠/뼈 붙이: 꼭짓점과 그 옆 테 두 칸"""
    for c in (TOPC, RGTC, BOTC, LFTC):
        for (dx, dy) in ((0, 0), (1, 1), (-1, 1), (1, -1), (-1, -1), (0, 1), (0, -1), (1, 0), (-1, 0)):
            p = (c[0] + dx, c[1] + dy)
            if p in RIM and abs(dx) + abs(dy) <= 1: s.put(p[0], p[1], ch[0] if c in (TOPC, LFTC) else ch[1])
def art(s, rows, ox, oy, keep=None):
    keep = keep or IN1
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            p = (ox + i, oy + j)
            if ch not in '. ' and p in keep: s.put(p[0], p[1], ch)
def drip(s, pts):
    """피 흘러내림: (x, y0, 길이) — 표지/책장 위에서 아래로, 끝은 밝은 방울"""
    for (x, y0, n) in pts:
        for k in range(n): s.put(x, y0 + k, 'R' if k < n - 1 else 'r')
def stitches(s):
    """꿰맨 자국 둘: 표지 위쪽과 아래쪽을 책 축 따라 가로지르는 솔기 + 땀"""
    for (x, y) in IN1:
        u = x - y + 1; v = x + y - 18
        if v == -6 + 2 and u % 2: s.put(x, y, 'x')
        if v == -6 + 3 and u % 4 == 1: s.put(x, y, 'x')
        if v == -6 + 1 and u % 4 == 1: s.put(x, y, 'x')
        if v == 5 and u % 2 == 0 and u < 2: s.put(x, y, 'x')
EYE = ["...bbb...", ".bbwvwbb.", "bwviiiwwb", "bwvi9ivwb", "bwwiiivwb", ".bbwwvbb.", "...bbb..."]
SKULL = ["..111..", ".11111.", "1311111", "1991991", "1111111", ".19191.", ".1.1.1."]
MAW = [".RRRRRR.", "RtRtRtRR", "Rt9t9t9R", "R99n999R", "R9t9t9tR", "RRtRtRtR", ".RRRRRR."]
def circle(s, cx=10.0, cy=9.0):
    """피의 마법진: 바깥 고리 · 고리 밖 점 여섯 · 안쪽 작은 고리 · 가운데 핏덩이 (별꼴 없음)"""
    for (x, y) in IN1:
        d = math.hypot(x + .5 - cx, y + .5 - cy)
        if 2.75 <= d <= 3.75: s.put(x, y, 'r' if (x * 3 + y) % 5 == 0 else 'R')
        if 0.95 <= d <= 1.6: s.put(x, y, 'R')
    for k in range(6):
        a = math.radians(-45 + 60 * k)
        x = int(math.floor(cx + 4.7 * math.cos(a))); y = int(math.floor(cy + 4.7 * math.sin(a)))
        if (x, y) in IN1: s.put(x, y, 'r')
    s.put(9, 8, 'r'); s.put(10, 9, 'r')
def fA(s):
    pages(s); cover(s); stitches(s); corners(s); art(s, EYE, 5, 5)
    drip(s, [(8, 12, 3), (12, 12, 2)])
def fB(s):
    pages(s); cover(s); corners(s, ('1', '2')); art(s, SKULL, 7, 5)
    for (x, y) in ((4, 9), (5, 10), (15, 6), (14, 7)): s.put(x, y, '1')                                # 뼈 걸쇠 (양쪽 긴 변 가운데)
def fC(s):
    pages(s); cover(s); corners(s); art(s, MAW, 6, 5)
    drip(s, [(8, 12, 3), (11, 12, 4)])
def fD(s):
    pages(s); cover(s); corners(s); circle(s)
    drip(s, [(8, 12, 4), (11, 13, 3), (13, 11, 2)])
def frame(st):
    s = Sh()
    {'A': fA, 'B': fB, 'C': fC, 'D': fD}[st](s)
    return s
STYLE = {'A': '살가죽 장정', 'B': '뼈 장정', 'C': '아가리 책', 'D': '피의 마법진'}
PAGE = dict(P='#e8dcc0', p='#a89878', K='#2a1a1a')
FLESH = dict(a='#c8a8a0', b='#8a6a66', e='#d8b8b0', E='#6a4a48', x='#3a2024', h='#d8dee8', g='#6a7280')
LEATH = dict(a='#3e2a2a', b='#2a1c1c', e='#5a4040', E='#1e1212', h='#a8b0bc', g='#4e5662', x='#1a1010')
BLOOD = dict(r='#e0283a', R='#8a0e18')
EYEP = dict(w='#f4ece0', v='#e0283a', i='#c8283a', **{'9': '#140808'})
BONE = {'1': '#e8e0d0', '2': '#a89c88', '3': '#ffffff', '9': '#140c0c'}
MAWP = dict(t='#f4ece0', n='#e07a8a', **{'9': '#1a0808'})
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
@frm('A', '꿰맨 자국이 지나가는 살가죽 표지 · 핏발 선 큰 눈 · 피가 흘러내린다')
def gA(): return frame('A'), M(PAGE, FLESH, BLOOD, EYEP)
@frm('B', '썩은 가죽 표지 · 뼈 모서리 · 해골 새김 · 뼈 걸쇠')
def gB(): return frame('B'), M(PAGE, LEATH, BLOOD, BONE)
@frm('C', '표지 한가운데 이빨 난 아가리 · 혀 · 피가 침처럼 흐른다')
def gC(): return frame('C'), M(PAGE, LEATH, BLOOD, MAWP)
@frm('D', '검은 표지에 피로 그린 고리 · 눈금 · 점 — 피가 아래로 흘러내린다')
def gD(): return frame('D'), M(PAGE, LEATH, BLOOD, a='#1e1418', b='#140c10')
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '꿰맨 살가죽 서', '꿰맨 살가죽 표지 · 핏발 선 눈 하나')
def n01(): return frame('A'), M(PAGE, FLESH, BLOOD, EYEP)
@make(10, 'B', '무덤지기의 서', '썩은 가죽 표지 · 뼈 모서리 · 해골 새김')
def n10(): return frame('B'), M(PAGE, LEATH, BLOOD, BONE)
@make(20, 'C', '굶주린 서', '표지 한가운데 이빨 난 아가리 — 펼치려는 손을 문다')
def n20(): return frame('C'), M(PAGE, LEATH, BLOOD, MAWP)
@make(30, 'D', '피의 서', '검은 표지에 피로 그린 마법진 · 피가 흘러내린다')
def n30(): return frame('D'), M(PAGE, LEATH, BLOOD, a='#1e1418', b='#140c10')
@make(40, 'B', '납골당의 서', '뼈를 엮은 흰 표지 · 검은 해골 · 뼈 걸쇠')
def n40(): return frame('B'), M(PAGE, BLOOD, a='#d8d0c0', b='#a89c88', e='#f0e8d8', E='#7a705e', h='#ffffff', g='#a89c88',
                                **{'1': '#3a3440', '2': '#14121a', '3': '#8a8494', '9': '#d8d0c0'})
@make(50, 'A', '천 개의 눈', '눈 여럿이 깜박이는 살가죽 표지')
def n50():
    s = frame('A')
    for (x, y, ch) in ((12, 4, 'i'), (13, 4, 'w'), (5, 9, 'w'), (6, 9, 'i'), (13, 11, 'i'), (14, 10, 'w'), (8, 13, 'i')): s.put(x, y, ch)
    return s, M(PAGE, FLESH, BLOOD, EYEP)
@make(60, 'D', '혈월의 서', '붉은 달 같은 피의 고리 · 핏방울이 맺혔다')
def n60():
    s = frame('D'); s.fx.update({(16, 15): 'r', (6, 18): 'r'})
    return s, M(PAGE, LEATH, BLOOD, a='#2a0e14', b='#1a080c', e='#5a1a24', E='#140608')
@make(70, 'C', '이 가는 서', '날카로운 송곳니 · 피 묻은 혀 · 검붉은 표지')
def n70(): return frame('C'), M(PAGE, BLOOD, MAWP, a='#4a1a20', b='#2a0e12', e='#6a2a30', E='#1e0a0c', h='#e8e0d0', g='#a89c88', x='#1a0808')
@make(80, 'A', '역병의 서', '썩어 문드러진 초록 살가죽 · 고름 낀 눈')
def n80(): return frame('A'), M(PAGE, BLOOD, EYEP, a='#8a9a6a', b='#5a6a40', e='#a8b888', E='#3a4428', x='#2a3018', i='#c8d040', v='#8a9a30', w='#e8f0c0',
                                h='#8a8e98', g='#4a4e58', r='#a8c040', R='#5a6a20')
@make(90, 'C', '사령의 아가리', '검은 아가리에서 흰 넋이 새어 나온다')
def n90():
    s = frame('C'); s.fx.update({(10, 3): '~', (11, 2): '~', (9, 1): '~', (12, 0): '~'})
    return s, M(PAGE, LEATH, BLOOD, MAWP, **{'~': '#d8f0ff'})
@make(100, 'D', '망자의 마법진', '해골빛 마법진 · 검게 굳은 피')
def n100(): return frame('D'), M(PAGE, LEATH, a='#1e1418', b='#140c10', r='#e8e0d0', R='#7a1a24')
@make(110, 'B', '해골 왕의 서', '왕관 쓴 해골 · 금 모서리 · 검붉은 표지')
def n110():
    s = frame('B')
    for (x, y) in ((8, 3), (10, 3), (12, 3), (8, 4), (9, 4), (10, 4), (11, 4), (12, 4)): s.put(x, y, 'h') if (x, y) in IN1 else None
    return s, M(PAGE, BLOOD, BONE, a='#3a1a20', b='#24100c', e='#5a2a30', E='#1a0a0c', h='#f0c040', g='#a87018', x='#1a0808')
@make(120, 'B', '리치의 서', '푸른 넋불이 타는 해골 · 은 모서리 · 얼어붙은 표지')
def n120():
    s = frame('B'); s.fx.update({(9, 6): '*', (11, 6): '*', (10, 2): '~', (11, 1): '~'})
    return s, M(PAGE, BLOOD, BONE, a='#2a3448', b='#1a2030', e='#4a5a78', E='#10141e', h='#e8eef6', g='#7a84a0', **{'9': '#0c1428', '*': '#5ad8f4', '~': '#a8e8ff'})
@make(130, 'D', '저주의 마법진', '두 겹 피의 고리 · 고리마다 눈금 · 피가 줄줄')
def n130():
    s = frame('D')
    for y in range(20):
        for x in range(20):
            if (x, y) in IN1 and 4.9 <= math.hypot(x + .5 - 10.0, y + .5 - 8.5) <= 5.5: s.put(x, y, 'R')
    drip(s, [(5, 11, 3), (15, 9, 4)])
    return s, M(PAGE, LEATH, BLOOD, a='#1e1418', b='#140c10')
@make(140, 'A', '심연의 눈', '심연을 들여다보는 큰 눈 · 핏줄이 뻗은 표지')
def n140():
    s = frame('A')
    for (x, y) in ((5, 10), (4, 10), (14, 6), (15, 6), (11, 13), (11, 14)): s.put(x, y, 'v') if (x, y) in IN1 else None
    return s, M(PAGE, BLOOD, EYEP, a='#4a2a3a', b='#2a1424', e='#6a3a50', E='#1e0a14', x='#14060c', i='#8a2ae0', v='#c8283a', h='#5a5664', g='#2a2630')
@make(150, 'C', '네크로노미콘', '죽은 이의 책 — 아가리 위에 눈 · 피의 고리 · 붉은 기운이 감돈다')
def n150():
    s = frame('C')
    for (x, y, ch) in ((10, 3, 'b'), (9, 4, 'w'), (10, 4, 'i'), (11, 4, 'w')): s.put(x, y, ch)
    s.fx.update({(2, 5): '*', (17, 3): '*', (18, 13): '*', (4, 17): '*'})
    return s, M(PAGE, BLOOD, MAWP, EYEP, a='#2a0e14', b='#1a080c', e='#6a1a24', E='#140608', h='#e8e0d0', g='#a89c88', x='#1a0808', **{'*': '#ff4a5a'})
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = [(icon(d).render(), str(d.get('lv', d.get('key')))) for d in FR + G]
    zoomsheet(out[:4], 'nec_frames.png', z=12)
    zoomsheet(out[4:12], 'nec_z1.png', z=9); zoomsheet(out[12:], 'nec_z2.png', z=9)
    print(Counter(d['st'] for d in G), TOPC, RGTC, BOTC, LFTC)
