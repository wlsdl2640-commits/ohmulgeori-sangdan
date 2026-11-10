"""정령 — 정령술사 · 정령왕의 부장비 (11-10 20:16 사용자: 여러 형태 · 속성의 정령들). 앞모습 · 떠 있음 · 좌우 대칭(가운데 x 9.5).
틀(꼴 4): A 불꽃꼴(위가 갈라진 불꽃 몸) · B 방울꼴(위가 뾰족한 물방울 몸) · C 날개꼴(작은 몸 + 잎 날개 넷) · D 바위꼴(뭉툭한 몸 + 등에 수정 돌기)
글자: 몸 a(빛) b(몸) c(그늘) d(테) · 속 빛 e · 눈 9 · 반짝 w · 입 m · 날개 f F · 돌기 g G · 효과 1 2"""
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
def fC(s):
    """날개꼴: 작은 몸(머리 + 옷) + 잎 날개 넷 (머리와 한 칸 띄움)"""
    for (wx, wy, rx, ry, ch) in ((4.3, 6.6, 2.7, 2.0, 'f'), (5.0, 11.6, 2.2, 1.5, 'F')):
        for y in range(20):
            for x in range(10):
                if ((x + .5 - wx) / rx) ** 2 + ((y + .5 - wy) / ry) ** 2 <= 1: s.put(x, y, ch)
    for y in range(20):
        for x in range(20):
            if dist(x, y, CX, 6.6) <= 2.5: s.put(x, y, 'a')                                          # 머리
            if 9.5 <= y + .5 <= 15.5 and abs(x + .5 - CX) <= 0.8 + (y + .5 - 9.5) * 0.4: s.put(x, y, 'b' if x < 10 else 'c')   # 옷
    for (x, y) in ((8, 4), (9, 4), (10, 4), (11, 4)): s.put(x, y, 'b')                                # 머리칼
    face(s, 6, gap=2, mouth=False)
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
FN = {'A': fA, 'B': fB, 'C': fC, 'D': fD}
def frame(st):
    s = Sh(); FN[st](s); mirror(s)
    return s
STYLE = {'A': '불꽃꼴', 'B': '방울꼴', 'C': '날개꼴', 'D': '바위꼴'}
EYE = {'9': '#14121a', 'w': '#ffffff', 'm': '#3a1a1a'}
EL = {
    'fire': dict(a='#fff2b0', b='#ff9a2a', c='#e0401a', e='#ffe070'),
    'water': dict(a='#e0f8ff', b='#5ac0f0', c='#1a6ab8', e='#a8e4fc'),
    'wind': dict(a='#f0fff8', b='#a8f0d0', c='#3a9a7a', e='#d8fff0', f='#d8fff0', F='#8ae0c0'),
    'earth': dict(a='#e0c090', b='#a8784a', c='#6a4a2a', e='#c8a070', g='#c8f0a0', G='#6aa840'),
    'flower': dict(a='#fff0f8', b='#ffd0e8', c='#e07ab0', f='#ffd0e8', F='#8ad870'),
    'wisp': dict(a='#e0fff0', b='#7ae8c0', c='#2a9a7a', e='#c8fff0'),
    'crystal': dict(a='#d0d8e0', b='#8a94a8', c='#4e5662', e='#a8b0bc', g='#e8d8ff', G='#9a6ae8'),
    'ice': dict(a='#ffffff', b='#c8f0ff', c='#7ac4ec', e='#f0fcff'),
    'bolt': dict(a='#fffbd0', b='#fff36a', c='#d0a020', e='#ffffff'),
    'flame': dict(a='#ffffff', b='#ffd84a', c='#ff5a1a', e='#fff6c8'),
    'lava': dict(a='#5a4a48', b='#3a2a2a', c='#1e1414', e='#ff7a1a', g='#ffd070', G='#e0501a'),
    'light': dict(a='#ffffff', b='#fff6c8', c='#f0c040', f='#ffffff', F='#fff0a0'),
    'dark': dict(a='#c8a8ff', b='#6a4ac8', c='#2a1a5a', e='#a878ff'),
    'mount': dict(a='#c8c0b0', b='#8a8478', c='#4e4a44', e='#a8a094', g='#a8e070', G='#4a8a30'),
    'sea': dict(a='#c8f0ff', b='#2a8ae0', c='#163a8a', e='#5ad8f4'),
    'king': dict(a='#ffffff', b='#e8d8ff', c='#a878ff', f='#ffd0f0', F='#a8e8ff'),
}
def M(*ds, **kw):
    r = dict(EYE, f='#d8fff0', F='#8ae0c0', g='#e8eef6', G='#8a94a8', e='#ffffff')
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
@frm('C', '작은 몸 · 둥근 머리 · 잎 날개 넷')
def gC(): return frame('C'), M(EL['wind'])
@frm('D', '뭉툭한 바위 몸 · 등에 수정 돌기 · 짧은 팔')
def gD(): return frame('D'), M(EL['earth'])
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
@make(80, 'B', '번개 방울 정령', '번개를 머금은 노란 방울 · 불똥이 튄다')
def p80():
    s = frame('B'); s.fx.update({(4, 3): '1', (16, 4): '2', (3, 13): '2'})
    return s, M(EL['bolt'], **{'1': '#ffffff', '2': '#fff36a'})
@make(90, 'A', '불꽃 정령', '하얗게 타오르는 큰 불꽃')
def p90():
    s = frame('A'); s.fx.update({(4, 2): '1', (15, 1): '2', (17, 8): '1'})
    return s, M(EL['flame'], **{'1': '#ffd84a', '2': '#ff8a1a'})
@make(100, 'D', '용암 정령', '검은 바위 몸 속에 용암이 흐른다 · 불타는 돌기')
def p100(): return frame('D'), M(EL['lava'], **{'9': '#ffd070'})
@make(110, 'C', '빛의 요정', '빛나는 흰 날개 · 금빛 몸')
def p110():
    s = frame('C'); s.fx.update({(2, 3): '1', (17, 3): '1', (9, 1): '2'})
    return s, M(EL['light'], **{'1': '#ffffff', '2': '#fff0a0'})
@make(120, 'A', '어둠 불꽃 정령', '빛을 삼키는 보랏빛 불꽃')
def p120(): return frame('A'), M(EL['dark'], **{'9': '#fff0ff'})
@make(130, 'D', '산의 정령', '이끼 낀 산바위 · 초록 돌기 — 오래된 산의 넋')
def p130(): return frame('D'), M(EL['mount'])
@make(140, 'B', '바다 정령', '깊은 남빛 물방울 · 물결이 인다')
def p140():
    s = frame('B'); s.fx.update({(3, 14): '1', (16, 13): '1', (4, 15): '2', (15, 15): '2'})
    return s, M(EL['sea'], **{'1': '#a8e4fc', '2': '#5ad8f4'})
@make(150, 'C', '정령왕의 요정', '여섯 빛 날개 — 정령왕 곁을 지키는 요정 · 무지갯빛이 감돈다')
def p150():
    s = frame('C'); s.fx.update({(1, 2): '1', (18, 2): '2', (0, 10): '3', (19, 10): '4', (3, 17): '5', (16, 17): '6'})
    return s, M(EL['king'], **{'1': '#ff8a5a', '2': '#5ac0f0', '3': '#8ae070', '4': '#fff36a', '5': '#c8f0ff', '6': '#e8a8ff'})
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = [(icon(d).render(), str(d.get('lv', d.get('key')))) for d in FR + G]
    zoomsheet(out[:4], 'spr_frames.png', z=12)
    zoomsheet(out[4:12], 'spr_z1.png', z=9); zoomsheet(out[12:], 'spr_z2.png', z=9)
    print(Counter(d['st'] for d in G))
