"""에테르 실드 — 마검사 · 마검성: 작은 구슬에 마나를 보내 막을 편다. 원형 시안 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
틀: 가운데 구슬(지름 6, 테두리 있음) + 둘레 마나 막(테두리 없음 = 빛처럼) — 좌우 대칭
막 글자 L(밝음) · l(어두움, 번갈아 일렁임) · 구슬 p o x O Q · 고리 g G h"""
import math
from sh import Sh, d_of, t_of, sh3, dome, CX, CY
STYLE = {'A': '둥근 막', 'B': '육각 막', 'C': '고리 구슬', 'D': '마름모 막'}
def orb(s, r=2.9):
    def role(x, y):
        d = d_of(x, y); dx, dy = x + .5 - CX, y + .5 - CY
        if -1.6 < dx < -0.2 and -1.6 < dy < -0.2 and d < 1.9: return 'p'
        return sh3((dx + dy) / r, 'o', 'x', 'O', -0.35, 0.5) if d < r - 0.7 else ('O' if dx + dy > -0.5 else 'x')
    s.fill(lambda x, y: d_of(x, y) <= r, role)
def put_fx(s, x, y, ch):
    if (x, y) not in s.body and 0 <= x < 20 and 0 <= y < 20: s.fx[(x, y)] = ch
def barrier(s, test, step=3):
    """막: 테두리 없는 효과 층. 각도에 따라 L / l 번갈아 (일렁임)"""
    for y in range(20):
        for x in range(20):
            if test(x, y):
                a = math.atan2(y + .5 - CY, abs(x + .5 - CX))        # 좌우 대칭이 되게 |dx|
                k = int((a + math.pi) / (math.pi / 6))
                put_fx(s, x, y, 'L' if k % 2 == 0 else 'l')
def frame(st):
    s = Sh()
    if st == 'A':
        barrier(s, lambda x, y: 7.0 < d_of(x, y) <= 8.6)
        barrier(s, lambda x, y: abs(d_of(x, y) - 4.6) < 0.4 and (min(x, 19 - x) + y) % 2 == 0)       # 안쪽 옅은 빛 (점)
    elif st == 'B':
        def hexd(x, y):
            dx, dy = abs(x + .5 - CX), abs(y + .5 - CY)
            return max(dy * 1.1547 + 0 * dx, dx * 1.0 + dy * 0.57735) / 1.0     # 뾰족한 꼭지가 위아래인 육각
        barrier(s, lambda x, y: 7.0 < hexd(x, y) <= 8.6)
        barrier(s, lambda x, y: abs(hexd(x, y) - 4.8) < 0.45 and (min(x, 19 - x) + y) % 2 == 0)
    elif st == 'C':
        barrier(s, lambda x, y: 7.2 < d_of(x, y) <= 8.6)
    elif st == 'D':
        md = lambda x, y: abs(x + .5 - CX) + abs(y + .5 - CY)          # 마름모 막
        barrier(s, lambda x, y: 7.4 < md(x, y) <= 9.0)
        barrier(s, lambda x, y: abs(d_of(x, y) - 4.6) < 0.4 and (min(x, 19 - x) + y) % 2 == 0)
    orb(s)
    if st == 'C':                                          # 구슬을 두른 고리 (기울어진 테)
        for y in range(20):
            for x in range(20):
                dx, dy = x + .5 - CX, (y + .5 - CY) * 2.2
                d = math.hypot(dx, dy)
                if 4.0 < d <= 5.2 and not (abs(dx) < 3.0 and y + .5 < CY):   # 뒤쪽(위) 고리는 구슬에 가려짐
                    s.put(x, y, 'h' if dx < -1.5 else ('G' if dx > 1.5 else 'g'))
    return s
def prof(pal): return dict(PO=pal['x'], PL=pal['L'])
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
ORB = dict(p='#ffffff', o='#b8ecff', x='#5ab8f0', O='#2a6ab8', Q='#16386a', L='#c8f4ff', l='#6ac8f0')
@frm('A', '맑은 구슬 둘레에 둥근 마나 막 · 안쪽에 옅은 빛')
def fA(): return frame('A'), dict(ORB)
@frm('B', '육각으로 짜인 마나 막 · 안쪽 육각 빛')
def fB(): return frame('B'), dict(ORB, L='#d0fff0', l='#5ae0c0')
@frm('C', '구슬을 쇠고리가 감싼다 · 둥근 막')
def fC(): return frame('C'), dict(ORB, h='#f0d8a0', g='#c09050', G='#7a5420', L='#fff0c0', l='#e0b060')
@frm('D', '마름모꼴로 짜인 막 · 안쪽 둥근 빛')
def fD(): return frame('D'), dict(ORB, o='#e0c8ff', x='#a878f0', O='#5a3ab0', Q='#2e1a6a', L='#f0e0ff', l='#b080f0')
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '견습 마나 구슬', '처음 마나를 모으는 맑은 구슬 · 둥근 막')
def e01(): return frame('A'), dict(ORB)
@make(10, 'B', '육각 막 구슬', '청록 구슬이 육각 막을 짠다')
def e10(): return frame('B'), dict(ORB, o='#c8fff0', x='#4ad8b0', O='#1a8a70', Q='#0e4a3c', L='#d0fff0', l='#5ae0c0')
@make(20, 'C', '청동 고리 구슬', '호박빛 구슬 · 청동 고리 · 금빛 막')
def e20(): return frame('C'), dict(p='#ffffff', o='#ffe0a0', x='#f0a040', O='#a85a18', Q='#5a2e0c', h='#f0d8a0', g='#c09050', G='#7a5420',
                                   L='#fff0c0', l='#e0b060')
@make(30, 'D', '마름모 막 구슬', '보랏빛 구슬이 마름모 막을 편다')
def e30(): return frame('D'), dict(p='#ffffff', o='#e0c8ff', x='#a878f0', O='#5a3ab0', Q='#2e1a6a', L='#f0e0ff', l='#b080f0')
@make(40, 'C', '수정 고리 구슬', '맑은 수정 구슬 · 은 고리 · 흰 막')
def e40(): return frame('C'), dict(p='#ffffff', o='#f4f8ff', x='#c8d4e8', O='#8a98b8', Q='#4a5678', h='#ffffff', g='#c8d0dc', G='#7a849a',
                                   L='#ffffff', l='#c8d4e8')
@make(50, 'A', '푸른 불꽃 구슬', '안에서 푸른 불꽃이 타는 구슬 · 둥근 막')
def e50(): return frame('A'), dict(p='#ffffff', o='#a8c8ff', x='#4a7af0', O='#2a40b8', Q='#141e6a', L='#c0d4ff', l='#5a80f0')
@make(60, 'D', '비취 마름모 막', '비취 구슬 · 초록 마름모 막')
def e60(): return frame('D'), dict(p='#ffffff', o='#c8f0c0', x='#5ac06a', O='#2a7a3a', Q='#124a20', L='#d8ffd0', l='#6ad87a')
@make(70, 'B', '자수정 육각 막', '자수정 구슬 · 보랏빛 육각 막')
def e70(): return frame('B'), dict(p='#ffffff', o='#ecc8ff', x='#b060e8', O='#6a2aa8', Q='#3a1260', L='#f4d8ff', l='#c078f0')
@make(80, 'B', '홍옥 육각 막', '붉은 홍옥 구슬 · 붉은 육각 막')
def e80(): return frame('B'), dict(p='#ffffff', o='#ffc0c8', x='#f04a5a', O='#a81a2a', Q='#5a0a14', L='#ffd0d8', l='#f06070')
@make(90, 'D', '황금 마름모 막', '금빛 구슬 · 금빛 마름모 막')
def e90(): return frame('D'), dict(p='#ffffff', o='#fff0b0', x='#f0c040', O='#b08018', Q='#6a4a10', L='#fff6c8', l='#f0c850')
@make(100, 'A', '심해 구슬', '깊은 바다빛 구슬 · 물빛 막')
def e100(): return frame('A'), dict(p='#e8ffff', o='#7ad8d8', x='#2a8aa8', O='#16486e', Q='#0a2440', L='#a8fff4', l='#3ac0c8')
@make(110, 'C', '은하 고리 구슬', '별이 도는 밤빛 구슬 · 은 고리 · 보랏빛 막')
def e110():
    s = frame('C')
    for (x, y) in ((9, 10), (10, 8)): s.put(x, y, 'p')
    return s, dict(p='#ffffff', o='#6a6ac8', x='#3a3a8a', O='#22225a', Q='#121234', h='#ffffff', g='#c8d0dc', G='#7a849a',
                   L='#e0d0ff', l='#9a80f0')
@make(120, 'A', '새벽 구슬', '아침놀빛 구슬 · 복숭아빛 막')
def e120(): return frame('A'), dict(p='#ffffff', o='#ffd8c8', x='#f09a7a', O='#b05a4a', Q='#6a2a24', L='#fff0e8', l='#f8b8a0')
@make(130, 'C', '그림자 고리 구슬', '검보랏빛 구슬 · 검은 고리 · 보랏빛 막')
def e130(): return frame('C'), dict(p='#e0c8ff', o='#6a4a90', x='#3a2a58', O='#22183a', Q='#120c20', h='#6a6470', g='#3e3a44', G='#222026',
                                    L='#c8a8ff', l='#7a4ac8')
@make(140, 'B', '서리 육각 막', '눈빛 구슬 · 얼음 육각 막')
def e140(): return frame('B'), dict(p='#ffffff', o='#f0fcff', x='#b8e8f8', O='#6aa8d0', Q='#2e6a98', L='#ffffff', l='#a8e0f8')
@make(150, 'D', '무한의 마나 막', '끝없이 마나가 도는 흰 구슬 · 금빛 마름모 막 · 빛이 감돈다')
def e150():
    s = frame('D'); s.fx.update({(2, 2): '1', (17, 2): '2', (2, 17): '2', (17, 17): '1'})
    return s, dict(p='#ffffff', o='#fffbe8', x='#ffe8a0', O='#d8b050', Q='#8a6420', L='#fff6c8', l='#ffd860',
                   **{'1': '#ffffff', '2': '#fff0a0'})
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, pal = d['fn']()
        bad = s.sym_err() + [(x, y) for (x, y) in s.fx if (19 - x, y) not in s.fx and (19 - x, y) not in s.body]
        if bad: print(d.get('lv', d.get('key')), 'sym', bad[:4])
        out.append((s.icon(pal).render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'et_frames.png', z=12)
    zoomsheet(out[4:12], 'et_z1.png', z=9)
    zoomsheet(out[12:], 'et_z2.png', z=9)
    print(Counter(d['st'] for d in G))
