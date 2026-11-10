"""네크로노미콘 — 네크로맨서 · 리치. 11-10 20:38 사용자: 정면 책 — 겉표지와 책 안 종이가 구분되어 보이게 (참고 그림은 꼴만, 그림은 새로).
꼴: 왼쪽 등(x 3–4, 묶음 띠 셋) · 앞표지(x 5–16, y 1–14, 테 · 모서리 쇠/뼈) · 아래 책장 두 줄(y 15–16, 오른쪽 한 칸 들어감) · 뒤표지 아랫단(y 17).
무서운 것: 살가죽 · 꿰맨 자국 · 핏발 선 눈 · 해골 · 송곳니 · 피로 그린 마법진(고리 · 점만 — 별꼴 없음) · 피는 늘 아래로 흘러 책장까지 물든다.
틀
  A 살가죽 장정: 꿰맨 살가죽 표지 · 핏발 선 큰 눈 · 핏물 눈물이 책장까지
  B 뼈 장정: 썩은 가죽 · 뼈 모서리 · 해골 새김 · 뼈 걸쇠
  C 송곳니 책: 표지 아래 끝에 송곳니가 돋아 책장을 문다 · 표지에 찢어진 눈 하나
  D 피의 마법진: 검은 표지에 피로 그린 고리 · 점 · 피가 흘러 책장을 적신다
글자: 등 S s k · 테 e E · 표지 a b · 모서리 h g · 책장 P p · 뒤표지 B · 피 r R · 눈 w v i 9 · 뼈 1 2 · 송곳니 t · 꿰맨 자국 x · 효과 * ~"""
import math
from sh import Sh
X0, X1, Y0, Y1 = 5, 16, 1, 14
def book(s, body='a'):
    for y in range(Y0, 18):
        s.put(3, y, 's'); s.put(4, y, 'S')
    for y in (3, 4, 8, 9, 13, 14): s.put(3, y, 'k'); s.put(4, y, 'k')               # 등 묶음 띠 셋
    for y in range(Y0, Y1 + 1):
        for x in range(X0, X1 + 1):
            if x == X0 or y == Y0: ch = 'e'
            elif x == X1 or y == Y1: ch = 'E'
            else: ch = 'b' if (x == X1 - 1 or y == Y1 - 1) else body
            s.put(x, y, ch)
    for x in range(X0, X1):                                                             # 책장 두 줄 (오른쪽 한 칸 들어감)
        s.put(x, 15, 'P'); s.put(x, 16, 'p' if x % 2 else 'P')
    for x in range(3, X1 + 1): s.put(x, 17, 'B')                                         # 뒤표지 아랫단
def corners(s, hi='h', lo='g'):
    for (x, y, ch) in ((X1, Y0, hi), (X1 - 1, Y0, hi), (X1, Y0 + 1, lo),                 # 오른쪽 위
                       (X1, Y1, lo), (X1 - 1, Y1, lo), (X1, Y1 - 1, lo),                 # 오른쪽 아래
                       (X0, Y0, hi), (X0 + 1, Y0, hi), (X0, Y0 + 1, hi),                 # 왼쪽 위
                       (X0, Y1, hi), (X0 + 1, Y1, lo), (X0, Y1 - 1, hi)):                # 왼쪽 아래
        s.put(x, y, ch)
def art(s, rows, ox, oy):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch not in '. ': s.put(ox + i, oy + j, ch)
def drip(s, pts):
    """(x, y0, n): 아래로 n칸 — 끝은 밝은 방울"""
    for (x, y0, n) in pts:
        for k in range(n): s.put(x, y0 + k, 'R' if k < n - 1 else 'r')
EYE = ["..bbbb..", ".bwwvwb.", "bwviivwb", "bwi99iwb", "bvwiiwvb", ".bwwwwb.", "..bbbb.."]
SKULL = ["..1111..", ".111111.", "11111111", "19911991", "19911991", "11119111", ".111111.", ".1.11.1."]
SLIT = ["..bbbb..", ".bvwwvb.", "bwwr9wwb", ".bvwwvb.", "..bbbb.."]
def seam(s, x, y0, y1):
    for y in range(y0, y1 + 1):
        s.put(x, y, 'x')
        if y % 2: s.put(x - 1, y, 'x'); s.put(x + 1, y, 'x')
def fA(s):
    book(s); seam(s, 7, 2, 13); corners(s)
    art(s, EYE, 8, 4)
    drip(s, [(11, 11, 5), (13, 10, 3)])
def fB(s):
    book(s); corners(s, '1', '2')
    art(s, SKULL, 7, 3)
    for (x, y, ch) in ((16, 7, '1'), (16, 8, '2'), (17, 7, '1'), (17, 8, '2'), (15, 7, '1'), (15, 8, '2')): s.put(x, y, ch)   # 뼈 걸쇠
def fC(s):
    book(s); corners(s)
    art(s, SLIT, 8, 5)
    for x in (6, 8, 10, 12, 14): s.put(x, 14, 't'); s.put(x, 15, 't')                  # 위 송곳니: 표지 끝에서 책장으로
    for x in (7, 11): s.put(x, 16, 't')                                                  # 아래 송곳니: 뒤표지에서 솟음
    drip(s, [(10, 16, 2)])
def fD(s, cx=10.5, cy=7.5):
    book(s, 'a'); corners(s)
    for y in range(Y0 + 1, Y1):
        for x in range(X0 + 1, X1):
            d = math.hypot(x + .5 - cx, y + .5 - cy)
            if 3.2 <= d <= 4.15: s.put(x, y, 'R' if (x + 2 * y) % 5 else 'r')
    for k in range(6):
        a = math.radians(-90 + 60 * k)
        s.put(int(math.floor(cx + 5.1 * math.cos(a))), int(math.floor(cy + 5.1 * math.sin(a))), 'r')
    for (x, y, ch) in ((10, 7, 'r'), (11, 7, 'R'), (10, 8, 'R'), (11, 8, 'R')): s.put(x, y, ch)         # 가운데 핏덩이
    drip(s, [(8, 11, 4), (12, 11, 5), (14, 9, 4), (11, 9, 3)])
def frame(st):
    s = Sh()
    {'A': fA, 'B': fB, 'C': fC, 'D': fD}[st](s)
    return s
STYLE = {'A': '살가죽 장정', 'B': '뼈 장정', 'C': '송곳니 책', 'D': '피의 마법진'}
PAGE = dict(P='#ece0c4', p='#b8a888')
FLESH = dict(a='#c8a8a0', b='#a08480', e='#e0c4bc', E='#7a5a58', S='#8a6a66', s='#5a4240', k='#3a2024', B='#5a4240', x='#3a2024', h='#d8dee8', g='#6a7280')
LEATH = dict(a='#3e2a2a', b='#2e1e1e', e='#5a4040', E='#1e1212', S='#2e1e1e', s='#1a1010', k='#5a4040', B='#2a1a1a', h='#a8b0bc', g='#4e5662', x='#1a1010')
BLOOD = dict(r='#e0283a', R='#8a0e18')
EYEP = dict(w='#f4ece0', v='#e0283a', i='#c8283a', **{'9': '#140808'})
BONE = {'1': '#e8e0d0', '2': '#a89c88', '9': '#140c0c'}
TEETH = dict(t='#f4ece0')
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
@frm('A', '꿰맨 살가죽 표지 · 핏발 선 큰 눈 · 핏물 눈물이 책장까지 흐른다')
def gA(): return frame('A'), M(PAGE, FLESH, BLOOD, EYEP)
@frm('B', '썩은 가죽 표지 · 뼈 모서리 · 해골 새김 · 뼈 걸쇠')
def gB(): return frame('B'), M(PAGE, LEATH, BLOOD, BONE)
@frm('C', '표지 아래 끝에 송곳니가 돋아 책장을 문다 · 찢어진 눈 하나')
def gC(): return frame('C'), M(PAGE, LEATH, BLOOD, EYEP, TEETH)
@frm('D', '검은 표지에 피로 그린 고리 · 점 — 피가 흘러 책장을 적신다')
def gD(): return frame('D'), M(PAGE, LEATH, BLOOD, a='#1e1418', b='#160e12')
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '꿰맨 살가죽 서', '꿰맨 살가죽 표지 · 핏발 선 눈 하나')
def n01(): return frame('A'), M(PAGE, FLESH, BLOOD, EYEP)
@make(10, 'B', '무덤지기의 서', '썩은 가죽 표지 · 뼈 모서리 · 해골 새김')
def n10(): return frame('B'), M(PAGE, LEATH, BLOOD, BONE)
@make(20, 'C', '굶주린 서', '송곳니로 제 책장을 문 책 — 펼치려는 손도 문다')
def n20(): return frame('C'), M(PAGE, LEATH, BLOOD, EYEP, TEETH)
@make(30, 'D', '피의 서', '검은 표지에 피로 그린 마법진 · 피가 흘러내린다')
def n30(): return frame('D'), M(PAGE, LEATH, BLOOD, a='#1e1418', b='#160e12')
@make(40, 'B', '납골당의 서', '뼈를 엮은 흰 표지 · 검은 해골 · 뼈 걸쇠')
def n40(): return frame('B'), M(PAGE, BLOOD, a='#d8d0c0', b='#b8ac98', e='#f0e8d8', E='#7a705e', S='#a89c88', s='#7a705e', k='#5a5040', B='#7a705e',
                                **{'1': '#3a3440', '2': '#14121a', '9': '#d8d0c0'})
@make(50, 'A', '천 개의 눈', '눈 여럿이 깜박이는 살가죽 표지')
def n50():
    s = frame('A')
    for (x, y, ch) in ((13, 2, 'i'), (14, 2, 'w'), (9, 12, 'w'), (10, 12, 'i'), (14, 12, 'i'), (15, 3, 'w')): s.put(x, y, ch)
    return s, M(PAGE, FLESH, BLOOD, EYEP)
@make(60, 'D', '혈월의 서', '붉은 달 같은 피의 고리 · 핏빛 표지 · 핏방울이 맺혔다')
def n60():
    s = frame('D'); s.fx.update({(8, 19): 'r', (12, 19): 'r'})
    return s, M(PAGE, LEATH, BLOOD, a='#2a0e14', b='#1e080c', e='#5a1a24', E='#140608', S='#1e080c', s='#100406', B='#1e080c')
@make(70, 'C', '이 가는 서', '날카로운 송곳니 · 피 묻은 책장 · 검붉은 표지')
def n70():
    s = frame('C')
    for x in (7, 9, 13): s.put(x, 15, 'r')
    return s, M(PAGE, BLOOD, EYEP, TEETH, a='#4a1a20', b='#341216', e='#6a2a30', E='#1e0a0c', S='#341216', s='#1e0a0c', k='#6a2a30', B='#2a0e12', h='#e8e0d0', g='#a89c88')
@make(80, 'A', '역병의 서', '썩어 문드러진 초록 살가죽 · 고름 낀 눈')
def n80(): return frame('A'), M(PAGE, EYEP, a='#8a9a6a', b='#6a7a4a', e='#a8b888', E='#3a4428', S='#5a6a40', s='#3a4428', k='#2a3018', B='#3a4428', x='#2a3018',
                                i='#c8d040', v='#8a9a30', w='#e8f0c0', h='#8a8e98', g='#4a4e58', r='#a8c040', R='#5a6a20')
@make(90, 'C', '사령의 아가리', '송곳니 사이로 흰 넋이 새어 나온다')
def n90():
    s = frame('C'); s.fx.update({(9, 18): '~', (8, 19): '~', (13, 18): '~'})
    return s, M(PAGE, LEATH, BLOOD, EYEP, TEETH, **{'~': '#d8f0ff'})
@make(100, 'D', '망자의 마법진', '해골빛 마법진 · 검게 굳은 피')
def n100(): return frame('D'), M(PAGE, LEATH, a='#1e1418', b='#160e12', r='#e8e0d0', R='#7a1a24')
@make(110, 'B', '해골 왕의 서', '왕관 쓴 해골 · 금 모서리 · 검붉은 표지')
def n110():
    s = frame('B')
    for (x, y) in ((8, 2), (10, 2), (11, 2), (13, 2)): s.put(x, y, 'h')
    return s, M(PAGE, BLOOD, BONE, a='#3a1a20', b='#2a100c', e='#5a2a30', E='#1a0a0c', S='#2a100c', s='#1a0a0c', k='#f0c040', B='#24100c', h='#f0c040', g='#a87018')
@make(120, 'B', '리치의 서', '푸른 넋불이 타는 해골 · 은 모서리 · 얼어붙은 표지')
def n120():
    s = frame('B')
    for (x, y) in ((8, 6), (9, 7), (12, 6), (13, 7)): s.put(x, y, 'z')
    s.fx.update({(10, 0): '~', (11, 0): '~'})
    return s, M(PAGE, BLOOD, BONE, a='#2a3448', b='#1e2638', e='#4a5a78', E='#10141e', S='#1e2638', s='#10141e', k='#7a84a0', B='#141a28', h='#e8eef6', g='#7a84a0',
                z='#5ad8f4', **{'9': '#0c1428', '~': '#a8e8ff'})
@make(130, 'D', '저주의 마법진', '두 겹 피의 고리 · 고리 밖 점 · 피가 줄줄')
def n130():
    s = frame('D')
    for y in range(Y0 + 1, Y1):
        for x in range(X0 + 1, X1):
            if 4.7 <= math.hypot(x + .5 - 10.5, y + .5 - 7.5) <= 5.2: s.put(x, y, 'R')
    return s, M(PAGE, LEATH, BLOOD, a='#1e1418', b='#160e12')
@make(140, 'A', '심연의 눈', '심연을 들여다보는 보랏빛 눈 · 핏줄이 뻗은 표지')
def n140():
    s = frame('A')
    for (x, y) in ((6, 6), (6, 7), (15, 5), (15, 10), (14, 11), (9, 12)): s.put(x, y, 'v')
    return s, M(PAGE, BLOOD, EYEP, a='#4a2a3a', b='#341a2a', e='#6a3a50', E='#1e0a14', S='#341a2a', s='#1e0a14', k='#6a3a50', B='#24101a', x='#14060c',
                i='#8a2ae0', v='#c8283a', h='#5a5664', g='#2a2630')
@make(150, 'C', '네크로노미콘', '죽은 이의 책 — 송곳니 · 찢어진 눈 · 피의 고리가 한데 · 붉은 기운이 감돈다')
def n150():
    s = frame('C')
    for y in range(Y0 + 1, Y1 - 1):
        for x in range(X0 + 1, X1):
            d = math.hypot(x + .5 - 10.5, y + .5 - 7.0)
            if 4.4 <= d <= 5.0 and (x, y) not in ((10, 2), (11, 2)): s.put(x, y, 'R')
    art(s, SLIT, 8, 5)
    s.fx.update({(1, 3): '*', (18, 2): '*', (0, 12): '*', (19, 15): '*'})
    return s, M(PAGE, BLOOD, EYEP, TEETH, a='#2a0e14', b='#1e080c', e='#6a1a24', E='#140608', S='#1e080c', s='#100406', k='#6a1a24', B='#1e080c',
                h='#e8e0d0', g='#a89c88', **{'*': '#ff4a5a'})
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = [(icon(d).render(), str(d.get('lv', d.get('key')))) for d in FR + G]
    zoomsheet(out[:4], 'nec2_frames.png', z=12)
    zoomsheet(out[4:12], 'nec2_z1.png', z=9); zoomsheet(out[12:], 'nec2_z2.png', z=9)
    print(Counter(d['st'] for d in G))
