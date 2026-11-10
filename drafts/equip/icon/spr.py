"""정령 — 정령술사 · 정령왕의 부장비 (11-10 20:16 사용자: 여러 형태 · 속성의 정령들). 앞모습 · 떠 있음 · 좌우 대칭(가운데 x 9.5).
틀(꼴 4): A 불꽃꼴(위가 갈라진 불꽃 몸) · B 방울꼴(위가 뾰족한 물방울 몸) · C 날개꼴(둥근 머리 · 더듬이 · 작은 옷 몸 + 날개 넷) · D 바위꼴(뭉툭한 몸 + 등에 수정 돌기) · E 구름꼴(먹구름 몸 + 삐져나온 번개 — 번개 정령, 11-10 21:09 사용자)
글자: 몸 a(빛) b(몸) c(그늘) d(테) · 속 빛 e · 눈 9 · 반짝 w · 입 m · 위 날개 f(속) F(테) · 아래 날개 h(속) H(테) · 돌기 g G · 번개 y Y z · 효과 1 2"""
import math
from sh import Sh
CX = 10.0
def dist(x, y, cx, cy): return math.hypot(x + .5 - cx, y + .5 - cy)
def fill(s, test, shade=True, r=5.0, cy=10.0):
    for y in range(20):
        for x in range(20):
            if not test(x + .5, y + .5): continue
            k = ((x + .5 - CX) + (y + .5 - cy)) / r
            s.put(x, y, 'a' if k < -0.6 else ('b' if k < 0.45 else 'c'))
def mirror(s):
    for (x, y), ch in list(s.body.items()):
        if (19 - x, y) not in s.body: s.body[(19 - x, y)] = ch
def face(s, ey, gap=2, mouth=True):
    for x in (CX - 1 - gap // 2, CX + gap // 2):
        s.put(int(x) if x == int(x) else int(x), ey, '9'); s.put(int(x), ey + 1, '9')
    s.put(int(CX - 1 - gap // 2), ey, 'w')
    if mouth: s.put(9, ey + 3, 'm'); s.put(10, ey + 3, 'm')
def fA(s):
    """불꽃꼴: 둥근 밑 + 세 갈래 불꽃 끝"""
    def t(px, py):
        if dist(px - .5, py - .5, CX, 11.0) <= 4.6: return True
        for (tx, ty, w) in ((CX, 2.0, 2.4), (CX - 3.2, 4.6, 1.6), (CX + 3.2, 4.6, 1.6)):
            if ty <= py <= 11.0 and abs(px - tx) <= w * (py - ty) / (11.0 - ty) + 0.3: return True
        return False
    fill(s, t, cy=9.0)
    for y in range(8, 15):
        for x in range(20):
            if dist(x, y, CX, 11.5) <= 2.2: s.put(x, y, 'e')
    face(s, 10)
def fB(s):
    """방울꼴: 위가 뾰족한 물방울"""
    def t(px, py):
        if dist(px - .5, py - .5, CX, 11.4) <= 4.8: return True
        return 3.0 <= py <= 11.4 and abs(px - CX) <= 4.6 * (py - 3.0) / 8.4
    fill(s, t, cy=10.0)
    s.put(7, 8, 'w'); s.put(7, 9, 'w'); s.put(8, 7, 'w')
    face(s, 11)
FAIRY = [   # 왼쪽 반(x 0..9) — 오른쪽은 비춘다. U 위 날개 · L 아래 날개 · H 머리 · D 옷 몸 · t 더듬이 끝 · s 더듬이 대
 "..........",
 "..........",
 "..UU....t.",
 ".UUUU....s",
 ".UUUUU..HH",
 ".UUUUU.HHH",
 ".UUUUU.HHH",
 "..UUUU.HHH",
 "...UUU.HHH",
 "....UUU.HH",
 ".....UUU.D",
 "........DD",
 ".....LLLDD",
 "...LLLLDDD",
 "..LLLL.DDD",
 "..LLL.DDDD",
 "...L......",
]
def fairy_parts():
    P = {}
    for y, r in enumerate(FAIRY):
        for x, ch in enumerate(r):
            if ch != '.': P.setdefault(ch, set()).update({(x, y), (19 - x, y)})
    return P
def fC(s):
    """날개꼴: 둥근 머리 · 더듬이 · 작은 옷 몸 + 날개 넷 (위 큰 날개 · 아래 작은 날개) — 머리와 날개 사이 한 칸 띄움"""
    P = fairy_parts()
    for key, fill_ch, rim_ch in (('U', 'f', 'F'), ('L', 'h', 'H')):
        W = P[key]
        for (x, y) in W:
            inner = all((x + dx, y + dy) in W for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            s.put(x, y, fill_ch if inner else rim_ch)
    for key, cy, r in (('H', 7.0, 3.0), ('D', 13.0, 3.5)):
        for (x, y) in P[key]:
            k = ((x + .5 - CX) + (y + .5 - cy)) / r
            s.put(x, y, 'a' if k < -0.6 else ('b' if k < 0.45 else 'c'))
    for (x, y) in P['s']: s.put(x, y, 'c')
    for (x, y) in P['t']: s.put(x, y, 'e')
    s.put(2, 4, 'w'); s.put(17, 4, 'w')                                                            # 날개 반짝
    face(s, 5)
def fD(s):
    """바위꼴: 뭉툭한 몸 · 등에 수정 돌기 셋 · 짧은 팔"""
    def t(px, py):
        return 6.5 <= py <= 16.0 and abs(px - CX) <= 5.0 - max(0, 8.5 - py) * 0.9 - max(0, py - 14.5) * 1.2
    fill(s, t, cy=11.0)
    for (cx, top, w) in ((CX, 1.5, 1.4), (CX - 3.0, 3.6, 1.1)):
        for y in range(20):
            for x in range(20):
                py = y + .5; px = x + .5
                if top <= py <= 8.0 and abs(px - cx) <= w * (py - top) / (8.0 - top) + 0.4: s.put(x, y, 'g' if px < cx else 'G')
    for (x, y) in ((3, 11), (3, 12), (4, 12)): s.put(x, y, 'c')                                     # 팔
    face(s, 10)
CLOUD = [   # 왼쪽 반(x 0..9) — 오른쪽은 비춘다. 혹 셋(왼 · 가운데 · 오른) 사이에 한 칸 홈
 "..........",
 "..........",
 "..........",
 "........xx",
 ".......xxx",
 "...xx.xxxx",
 "..xxxxxxxx",
 ".xxxxxxxxx",
 ".xxxxxxxxx",
 ".xxxxxxxxx",
 "..xxxxxxxx",
 "...xxxxxxx",
]
BOLT_BIG = [(6, 12), (7, 12), (5, 13), (6, 13), (4, 14), (5, 14), (6, 14), (7, 14), (5, 15), (6, 15), (4, 16), (5, 16), (3, 17), (4, 17), (3, 18)]
BOLT_SMALL = [(13, 12), (14, 12), (14, 13), (15, 13), (13, 14), (14, 14), (15, 14), (15, 15), (16, 16)]
def fE(s):
    """구름꼴: 혹 셋 먹구름 몸 · 아래로 큰 번개 하나(왼쪽) · 작은 번개 하나(오른쪽)가 삐져나온다 — 번개만 대칭이 아니다(다리로 안 보이게)"""
    for y, r in enumerate(CLOUD):
        for x, ch in enumerate(r):
            if ch == '.': continue
            for xx in (x, 19 - x):
                k = ((xx + .5 - CX) + (y + .5 - 7.5)) / 5.5
                s.put(xx, y, 'a' if k < -0.6 else ('b' if k < 0.45 else 'c'))
    for B in (BOLT_BIG, BOLT_SMALL):
        for (x, y) in B:
            s.put(x, y, 'y' if (x - 1, y) not in B else 'Y')
    for q in ((5, 14), (6, 14), (14, 14)): s.put(*q, 'z')
    face(s, 7)
FN = {'A': fA, 'B': fB, 'C': fC, 'D': fD, 'E': fE}
def frame(st):
    s = Sh(); FN[st](s)
    if st != 'E': mirror(s)
    return s
STYLE = {'A': '불꽃꼴', 'B': '방울꼴', 'C': '날개꼴', 'D': '바위꼴', 'E': '구름꼴'}
EYE = {'9': '#14121a', 'w': '#ffffff', 'm': '#3a1a1a'}
EL = {
    'fire': dict(a='#fff2b0', b='#ff9a2a', c='#e0401a', e='#ffe070'),
    'water': dict(a='#e0f8ff', b='#5ac0f0', c='#1a6ab8', e='#a8e4fc'),
    'wind': dict(a='#e0fff0', b='#7ad8b0', c='#2a8a6a', e='#ffffff', f='#f0fffa', F='#a8f0d0', h='#d8fff0', H='#7ad8b0'),
    'earth': dict(a='#e0c090', b='#a8784a', c='#6a4a2a', e='#c8a070', g='#c8f0a0', G='#6aa840'),
    'flower': dict(a='#fff0f8', b='#ffb0d8', c='#d0609a', e='#fff6a0', f='#ffe4f2', F='#ff9ac8', h='#b8f0a0', H='#5aa840'),
    'wisp': dict(a='#e0fff0', b='#7ae8c0', c='#2a9a7a', e='#c8fff0'),
    'crystal': dict(a='#d0d8e0', b='#8a94a8', c='#4e5662', e='#a8b0bc', g='#e8d8ff', G='#9a6ae8'),
    'ice': dict(a='#ffffff', b='#c8f0ff', c='#7ac4ec', e='#f0fcff'),
    'storm': dict(a='#e0e4f4', b='#9aa4c8', c='#5a6488', e='#ffffff', y='#fff36a', Y='#f0b020', z='#ffffff'),
    'flame': dict(a='#ffffff', b='#ffd84a', c='#ff5a1a', e='#fff6c8'),
    'lava': dict(a='#7a6058', b='#56423e', c='#3a2a27', e='#ff7a1a', g='#ffd070', G='#e0501a'),
    'light': dict(a='#ffffff', b='#ffe88a', c='#d8a020', e='#ffffff', f='#ffffff', F='#fff0b0', h='#fffbe0', H='#f0d070'),
    'dark': dict(a='#c8a8ff', b='#6a4ac8', c='#2a1a5a', e='#a878ff'),
    'mount': dict(a='#c8c0b0', b='#8a8478', c='#4e4a44', e='#a8a094', g='#a8e070', G='#4a8a30'),
    'sea': dict(a='#c8f0ff', b='#2a8ae0', c='#163a8a', e='#5ad8f4'),
    'king': dict(a='#ffffff', b='#e0d0ff', c='#9a70e8', e='#ffffff', f='#ffeefa', F='#ff9ad8', h='#e4f8ff', H='#6ac8f0'),
}
def M(*ds, **kw):
    r = dict(EYE, f='#f0fffa', F='#a8f0d0', h='#d8fff0', H='#7ad8b0', g='#e8eef6', G='#8a94a8', e='#ffffff')
    for d in ds: r.update(d)
    r.update(kw); return r
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
@frm('A', '둥근 밑에 위가 세 갈래로 갈라진 불꽃 몸 · 속에서 빛이 일렁인다')
def gA(): return frame('A'), M(EL['fire'])
@frm('B', '위가 뾰족한 물방울 몸 · 맑은 반짝임')
def gB(): return frame('B'), M(EL['water'])
@frm('C', '둥근 머리 · 더듬이 · 작은 옷 몸 · 날개 넷(위 큰 날개 · 아래 작은 날개)')
def gC(): return frame('C'), M(EL['wind'])
@frm('D', '뭉툭한 바위 몸 · 등에 수정 돌기 · 짧은 팔')
def gD(): return frame('D'), M(EL['earth'])
@frm('E', '혹 셋 먹구름 몸 · 아래로 큰 번개 · 작은 번개가 삐져나온다 (번개 정령, 11-10 21:09)')
def gE(): return frame('E'), M(EL['storm'])
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '불씨 정령', '모닥불에서 태어난 작은 불씨')
def p01(): return frame('A'), M(EL['fire'])
@make(10, 'B', '물방울 정령', '샘물에서 떨어진 물방울 하나')
def p10(): return frame('B'), M(EL['water'])
@make(20, 'C', '바람 요정', '옥빛 날개로 바람을 타는 요정')
def p20(): return frame('C'), M(EL['wind'])
@make(30, 'D', '흙 정령', '조약돌 몸 · 등에 새싹')
def p30(): return frame('D'), M(EL['earth'])
@make(40, 'C', '꽃잎 요정', '분홍 꽃잎 날개 · 초록 잎 날개')
def p40(): return frame('C'), M(EL['flower'])
@make(50, 'A', '도깨비불', '밤 숲을 떠도는 푸른 넋불')
def p50():
    s = frame('A'); s.fx.update({(3, 4): '1', (16, 6): '2'})
    return s, M(EL['wisp'], **{'1': '#c8fff0', '2': '#7ae8c0'})
@make(60, 'D', '수정 정령', '잿빛 바위 몸 · 보랏빛 수정 돌기')
def p60(): return frame('D'), M(EL['crystal'])
@make(70, 'B', '서리 방울 정령', '얼어붙은 물방울 · 서리가 반짝인다')
def p70():
    s = frame('B'); s.fx.update({(4, 5): '1', (15, 4): '1'})
    return s, M(EL['ice'], **{'1': '#ffffff'})
@make(80, 'E', '번개 구름 정령', '먹구름 몸 · 아래로 큰 번개 · 작은 번개가 삐져나온다 · 불똥이 튄다')
def p80():
    s = frame('E'); s.fx.update({(2, 3): '1', (17, 2): '2', (1, 14): '2', (18, 17): '1', (10, 16): '1'})
    return s, M(EL['storm'], **{'1': '#ffffff', '2': '#fff36a'})
@make(90, 'A', '불꽃 정령', '하얗게 타오르는 큰 불꽃')
def p90():
    s = frame('A'); s.fx.update({(4, 2): '1', (15, 1): '2', (17, 8): '1'})
    return s, M(EL['flame'], **{'1': '#ffd84a', '2': '#ff8a1a'})
@make(100, 'D', '용암 정령', '검은 바위 몸 속에 용암이 흐른다 · 불타는 돌기')
def p100():
    s = frame('D')
    for (x, y, ch) in ((7, 8, 'e'), (6, 9, 'e'), (5, 12, 'e'), (6, 12, 'y'), (7, 13, 'e'), (7, 14, 'e'), (8, 15, 'e'), (9, 15, 'y')):
        s.put(x, y, ch); s.put(19 - x, y, ch)                                                     # 용암 금
    return s, M(EL['lava'], **{'9': '#ffd070', 'y': '#ffe08a'})
@make(110, 'C', '빛의 요정', '빛나는 흰 날개 · 금빛 몸')
def p110():
    s = frame('C'); s.fx.update({(5, 1): '1', (14, 1): '1', (1, 11): '2', (18, 11): '2'})
    return s, M(EL['light'], **{'1': '#ffffff', '2': '#fff0a0'})
@make(120, 'A', '어둠 불꽃 정령', '빛을 삼키는 보랏빛 불꽃')
def p120(): return frame('A'), M(EL['dark'], **{'9': '#fff0ff'})
@make(130, 'D', '산의 정령', '이끼 낀 산바위 · 초록 돌기 — 오래된 산의 넋')
def p130(): return frame('D'), M(EL['mount'])
@make(140, 'B', '바다 정령', '깊은 남빛 물방울 · 물결이 인다')
def p140():
    s = frame('B'); s.fx.update({(3, 14): '1', (16, 13): '1', (4, 15): '2', (15, 15): '2'})
    return s, M(EL['sea'], **{'1': '#a8e4fc', '2': '#5ad8f4'})
@make(150, 'C', '정령왕의 요정', '작은 왕관 · 분홍 위 날개 · 하늘빛 아래 날개 — 정령왕 곁을 지키는 요정 · 무지갯빛 알갱이가 감돈다')
def p150():
    s = frame('C')
    for q in ((8, 2), (11, 2), (9, 3), (10, 3)): s.body.pop(q, None)                              # 더듬이 대신 작은 왕관
    for x in range(8, 12): s.put(x, 3, '7')
    s.put(9, 2, 'j'); s.put(10, 2, 'j')
    s.fx.update({(5, 1): '1', (14, 1): '2', (1, 10): '3', (18, 10): '4', (3, 18): '5', (16, 18): '6'})
    return s, M(EL['king'], **{'7': '#f0c040', 'j': '#ff6ab8', '1': '#ff8a5a', '2': '#5ac0f0', '3': '#8ae070', '4': '#fff36a', '5': '#c8f0ff', '6': '#e8a8ff'})
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = [(icon(d).render(), str(d.get('lv', d.get('key')))) for d in FR + G]
    nf = len(FR)
    zoomsheet(out[:nf], 'spr_frames.png', z=12)
    zoomsheet(out[nf:nf + 8], 'spr_z1.png', z=9); zoomsheet(out[nf + 8:], 'spr_z2.png', z=9)
    print(Counter(d['st'] for d in G))
