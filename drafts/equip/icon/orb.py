"""오브 — 원소술사 · 연금술사 (11-10 20:16 사용자). 원형 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
구슬은 방향이 없어 방패처럼 앞모습 · 좌우 대칭(가운데 x 9.5 — Sh.sym_err). 구슬 속 빛깔 = 속성.
틀
  A 발톱 받침: 받침대에서 솟은 쇠 발톱 넷이 구슬 아래를 쥔다
  B 고리 구슬: 구슬을 두른 기운 고리(앞은 구슬 위 · 뒤는 가려짐) · 작은 받침
  C 띠 구슬: 구슬 허리를 감은 금띠 · 띠 보석 셋 · 위 꼭지 · 받침
  D 위성 구슬: 받침 없이 떠 있고 작은 구슬 셋이 둘레를 돈다 · 속에 소용돌이 · 아래 빛
글자: 구슬 a(반짝) b(빛) c(몸) d(그늘) e(가장 어두움) · 소용돌이 f · 쇠 h g G · 보석 z · 효과 1 2"""
import math
from sh import Sh
CX = 10.0
def dist(x, y, cx, cy): return math.hypot(x + .5 - cx, y + .5 - cy)
L = (-0.55, -0.65, 0.52)
LN = math.sqrt(sum(v * v for v in L)); L = tuple(v / LN for v in L)
def sphere(s, cy=7.6, r=5.6, cx=CX):
    for y in range(20):
        for x in range(20):
            dx, dy = x + .5 - cx, y + .5 - cy
            d2 = (dx * dx + dy * dy) / (r * r)
            if d2 > 1: continue
            nz = math.sqrt(1 - d2); nx, ny = dx / r, dy / r
            i = nx * L[0] + ny * L[1] + nz * L[2]
            ch = 'b' if i > 0.78 else ('c' if i > 0.42 else ('d' if i > 0.05 else 'e'))
            s.put(x, y, ch)
    for (x, y) in ((7, 4), (8, 4), (7, 5)): s.put(x, y, 'a')                     # 반짝 (왼쪽 위)
def mirror(s):
    for (x, y), ch in list(s.body.items()):
        if (19 - x, y) not in s.body: s.body[(19 - x, y)] = ch
def stand(s, top=14, wide=3):
    """받침: 목 + 넓은 발 (좌우 대칭)"""
    for y in range(top, 19):
        w = 1 if y < 17 else (wide if y == 17 else wide + 1)
        for x in range(10 - w, 10 + w):
            s.put(x, y, 'h' if x < 9 else ('G' if x > 10 else 'g'))
def fA(s):
    sphere(s)
    stand(s, 15, 3)
    for (x, y) in ((4, 11), (4, 12), (5, 13), (6, 14), (7, 14), (6, 13), (5, 12)):   # 발톱: 받침에서 바깥으로 벌어져 구슬 옆을 쥠
        s.put(x, y, 'h')
    for (x, y) in ((7, 12), (8, 13), (8, 14)): s.put(x, y, 'g')                       # 안쪽 발톱 (구슬 앞)
    for (x, y) in ((3, 10), (4, 9)): s.put(x, y, 'h')                                 # 발톱 끝
    mirror(s)
    for (x, y), ch in list(s.body.items()):
        if x >= 10 and ch == 'h': s.body[(x, y)] = 'G'
def fB(s):
    stand(s, 14, 2)
    for y in range(20):                                                                # 뒤 고리 (구슬 밖만)
        for x in range(20):
            e = ((x + .5 - CX) / 8.6) ** 2 + ((y + .5 - 7.4) / 2.6) ** 2
            if 0.62 <= e <= 1.0 and y + .5 < 7.4: s.put(x, y, 'G')
    sphere(s)
    for y in range(20):                                                                # 앞 고리
        for x in range(20):
            e = ((x + .5 - CX) / 8.6) ** 2 + ((y + .5 - 7.4) / 2.6) ** 2
            if 0.62 <= e <= 1.0 and y + .5 >= 7.4: s.put(x, y, 'h' if x < 6 else ('g' if x < 14 else 'G'))
def fC(s):
    stand(s, 14, 2)
    sphere(s)
    for y in (8, 9):                                                                   # 허리띠
        for x in range(20):
            if dist(x, y, CX, 7.6) <= 5.6: s.put(x, y, 'h' if y == 8 else 'G')
    for x in (6, 9, 10, 13): s.put(x, 8, 'z') if x in (9, 10) else s.put(x, 9, 'z')   # 띠 보석 (가운데 2칸 + 양옆)
    for (x, y, ch) in ((9, 1, 'h'), (10, 1, 'G'), (9, 0, 'h'), (10, 0, 'G')): s.put(x, y, ch)   # 위 꼭지
def fD(s):
    sphere(s, cy=8.0, r=5.2)
    for y in range(20):                                                                # 소용돌이
        for x in range(20):
            dx, dy = x + .5 - CX, y + .5 - 8.0
            rr = math.hypot(dx, dy)
            if 0.9 <= rr <= 3.8:
                a = math.atan2(dy, dx)
                if abs(((a - rr * 1.0) % math.pi) - 1.3) < 0.3: s.put(x, y, 'f')
    for (x, y, ch) in ((2, 3, 'b'), (3, 3, 'c'), (2, 4, 'd'), (3, 4, 'd')): s.put(x, y, ch)    # 위성 (왼쪽 위 · 오른쪽 위 거울)
    for (x, y, ch) in ((9, 16, 'c'), (10, 16, 'c'), (9, 17, 'd'), (10, 17, 'd')): s.put(x, y, ch)   # 위성 (아래 가운데)
    mirror(s)
def frame(st):
    s = Sh()
    {'A': fA, 'B': fB, 'C': fC, 'D': fD}[st](s)
    return s
STYLE = {'A': '발톱 받침', 'B': '고리 구슬', 'C': '띠 구슬', 'D': '위성 구슬'}
EL = {   # a 반짝 · b 빛 · c 몸 · d 그늘 · e 가장 어두움 · f 소용돌이
    'glass': dict(a='#ffffff', b='#e8f4ff', c='#b8d4ec', d='#7a9ac0', e='#4a6a90', f='#ffffff'),
    'fire': dict(a='#ffffff', b='#ffd070', c='#ff7a1a', d='#c8301a', e='#7a1010', f='#fff2b0'),
    'water': dict(a='#ffffff', b='#a8e4fc', c='#3a9ae8', d='#1a5ab8', e='#0c2a6a', f='#e0f8ff'),
    'wind': dict(a='#ffffff', b='#d8fff0', c='#8ae0c0', d='#3a9a7a', e='#1a5a48', f='#ffffff'),
    'earth': dict(a='#fff8e0', b='#f0c878', c='#c08a3a', d='#7a5220', e='#3e2a10', f='#ffe8a0'),
    'bolt': dict(a='#ffffff', b='#fffbd0', c='#fff36a', d='#d0a020', e='#7a5a10', f='#ffffff'),
    'ice': dict(a='#ffffff', b='#f0fcff', c='#c8f0ff', d='#7ac4ec', e='#3a7ab8', f='#ffffff'),
    'lava': dict(a='#fff2b0', b='#ffb040', c='#e0501a', d='#5a2a1a', e='#2a1210', f='#ffd84a'),
    'storm': dict(a='#ffffff', b='#c8d8ff', c='#5a6ab8', d='#2a3478', e='#151a4a', f='#fff36a'),
    'deep': dict(a='#c8f0ff', b='#3a9ae8', c='#1a4a9a', d='#0c2a6a', e='#06142e', f='#5ad8f4'),
    'light': dict(a='#ffffff', b='#fffbe8', c='#ffe8a0', d='#e0b050', e='#a87018', f='#ffffff'),
    'dark': dict(a='#e8d8ff', b='#8a6ac8', c='#4e3a78', d='#2a1e48', e='#120c20', f='#c8a8ff'),
    'stone': dict(a='#ffd0d0', b='#ff6a6a', c='#d8283a', d='#8a0e1a', e='#4a0610', f='#ffb0b0'),
}
IRON = dict(h='#e8eef6', g='#a8b0bc', G='#5a6270')
GOLD = dict(h='#fffbd0', g='#f0c040', G='#a87018')
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
@frm('A', '받침대에서 솟은 쇠 발톱이 구슬 아래를 쥔다')
def gA(): return frame('A'), M(EL['glass'], IRON)
@frm('B', '구슬을 두른 기운 고리 (앞은 구슬 위 · 뒤는 가려짐) · 작은 받침')
def gB(): return frame('B'), M(EL['fire'], GOLD)
@frm('C', '구슬 허리를 감은 금띠 · 띠 보석 · 위 꼭지 · 받침')
def gC(): return frame('C'), M(EL['water'], GOLD, z='#ff4a5a')
@frm('D', '받침 없이 떠 있고 작은 구슬 셋이 둘레를 돈다 · 속에 소용돌이')
def gD(): return frame('D'), M(EL['wind'], **{'1': '#d8fff0'})
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '견습 원소 구슬', '아직 속성이 깃들지 않은 맑은 유리 구슬 · 쇠 발톱')
def o01(): return frame('A'), M(EL['glass'], IRON)
@make(10, 'B', '불씨 고리 구슬', '불씨가 맴도는 붉은 구슬 · 놋쇠 고리')
def o10(): return frame('B'), M(EL['fire'], GOLD)
@make(20, 'C', '물결 띠 구슬', '물결이 이는 푸른 구슬 · 은띠 · 물빛 보석')
def o20(): return frame('C'), M(EL['water'], IRON, z='#5ad8f4')
@make(30, 'D', '바람 위성 구슬', '바람이 감도는 옥빛 구슬 · 작은 바람 구슬 셋')
def o30(): return frame('D'), M(EL['wind'], **{'1': '#d8fff0'})
@make(40, 'C', '대지 띠 구슬', '흙빛 호박 구슬 · 청동 띠 · 초록 보석')
def o40(): return frame('C'), M(EL['earth'], h='#f0c870', g='#c08a3a', G='#7a5220', z='#4ab848')
@make(50, 'A', '번개 발톱 구슬', '번개를 가둔 노란 구슬 · 검은 쇠 발톱')
def o50():
    s = frame('A'); s.fx.update({(1, 2): '1', (18, 3): '2', (16, 0): '1'})
    return s, M(EL['bolt'], h='#8a8e98', g='#4a4e58', G='#2a2c32', **{'1': '#ffffff', '2': '#fff36a'})
@make(60, 'D', '서리 위성 구슬', '얼음 구슬 · 둘레를 도는 서리 알갱이 셋')
def o60(): return frame('D'), M(EL['ice'], **{'1': '#ffffff'})
@make(70, 'B', '용암 고리 구슬', '검은 돌 속에서 용암이 끓는다 · 검은 쇠고리')
def o70(): return frame('B'), M(EL['lava'], h='#6a5a5a', g='#3e2c2c', G='#241616')
@make(80, 'B', '폭풍 고리 구슬', '먹구름 구슬 속에 번개가 친다 · 은 고리')
def o80():
    s = frame('B'); s.fx.update({(1, 1): '1', (18, 2): '2'})
    return s, M(EL['storm'], IRON, **{'1': '#ffffff', '2': '#fff36a'})
@make(90, 'A', '심해 발톱 구슬', '깊은 바다빛 구슬 · 산호 발톱')
def o90(): return frame('A'), M(EL['deep'], h='#ffb0a8', g='#e05a5a', G='#8a2a30')
@make(100, 'D', '프리즘 구슬', '빛을 여러 속성으로 가르는 프리즘 · 무지갯빛 위성')
def o100(): return frame('D'), M(EL['glass'], f='#ff8a5a', b='#fff6c8', c='#e0d0ff', d='#8ab0f0', e='#5a6ab8', **{'1': '#ffe890'})
@make(110, 'C', '빛의 띠 구슬', '햇빛을 담은 금빛 구슬 · 흰 띠 · 하늘빛 보석')
def o110(): return frame('C'), M(EL['light'], h='#ffffff', g='#e8eef6', G='#a8b4c8', z='#5ad8f4')
@make(120, 'A', '어둠 발톱 구슬', '빛을 삼키는 보랏빛 어둠 · 검은 발톱')
def o120(): return frame('A'), M(EL['dark'], h='#5a5664', g='#383440', G='#201e26')
@make(130, 'C', '현자의 돌', '연금술사가 끝내 빚어낸 붉은 돌 · 금띠 · 흰 보석')
def o130():
    s = frame('C'); s.fx.update({(2, 2): '1', (17, 1): '2'})
    return s, M(EL['stone'], GOLD, z='#ffffff', **{'1': '#ffd0d0', '2': '#ffe890'})
@make(140, 'B', '원소의 고리', '여섯 원소가 차례로 도는 금 고리 · 보랏빛 구슬')
def o140():
    s = frame('B'); s.fx.update({(1, 6): '1', (18, 6): '2', (2, 10): '3', (17, 10): '4'})
    return s, M(EL['glass'], GOLD, c='#c8b8f0', d='#8a7ad8', e='#4a3a98', **{'1': '#ff8a5a', '2': '#5ac0f0', '3': '#8ae070', '4': '#fff36a'})
@make(150, 'D', '태초의 구슬', '모든 원소가 처음 갈라진 구슬 — 별이 도는 속 · 위성 셋 · 금빛이 감돈다')
def o150():
    s = frame('D'); s.fx.update({(1, 0): '2', (18, 0): '2', (0, 9): '2', (19, 9): '2'})
    return s, M(EL['dark'], f='#fff0a0', b='#c8a8ff', c='#4a2a8a', d='#22186a', e='#0c0a22', **{'1': '#fff0a0', '2': '#ffffff'})
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, pal = d['fn']()
        e = s.sym_err()
        if e: print(d.get('lv', d.get('key')), 'sym', len(e), e[:4])
        out.append((s.icon(pal).render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'orb_frames.png', z=12)
    zoomsheet(out[4:12], 'orb_z1.png', z=9); zoomsheet(out[12:], 'orb_z2.png', z=9)
    print(Counter(d['st'] for d in G))
