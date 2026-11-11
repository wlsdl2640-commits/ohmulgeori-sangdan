"""버클러 — 검투사 · 챔피언의 작은 둥근 방패. 원형 시안 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
틀: 지름 14(x 3..16) — 라운드보다 작다 · 말린 테 2칸 · 큰 돌기(지름 7) — 좌우 대칭. 이름 · 색은 글라디우스 16자루와 짝"""
import math
from sh import Sh, d_of, t_of, sh3, dome, rivets, CX, CY
R_OUT, R_RIM, R_BOSS = 7.45, 5.8, 3.5
STYLE = {'A': '쇠 접시', 'B': '가죽 덮개', 'C': '뾰족 돌기', 'D': '새긴 고리'}
def frame(st, gem=False):
    s = Sh()
    def face(x, y):
        d = d_of(x, y); t = t_of(x, y, r=7.2)
        if d > R_RIM + 0.75: return sh3(t, 'e', 'E', 'E', -0.25, 2)        # 바깥 테 (말린 쇠)
        if d > R_RIM: return 'k'                                            # 말린 테 안쪽 홈 (빙 둘러 어둡게)
        if st == 'D' and abs(d - 4.6) < 0.5: return 'd' if t < 0.05 else 'D'
        if st == 'A':                                                       # 쇠 접시: 테 쪽이 밝고 돌기 쪽이 어둡게 오목
            return sh3(t - (5.8 - d) * 0.06, 'a', 'b', 'c', -0.35, 0.4)
        return sh3(t, 'a', 'b', 'c', -0.4, 0.45)
    s.fill(lambda x, y: d_of(x, y) <= R_OUT, face)
    if st == 'B': rivets(s, CX - .5, CY - .5, 4.7, 8, 't', phase=math.pi / 8)
    dome(s, CX, CY, R_BOSS)
    if st == 'C':                                                           # 뾰족 돌기: 둘레가 어둡고 끝이 밝은 뿔
        for y in range(20):
            for x in range(20):
                d = d_of(x, y)
                if d <= R_BOSS:
                    t = t_of(x, y, r=3.4)
                    ch = 'Q' if d > 2.75 else ('O' if d > 1.6 and t > -0.2 else ('x' if d > 1.6 else 'o'))
                    s.put(x, y, ch)
        for (x, y), ch in (((9, 9), 'p'), ((10, 9), 'o'), ((9, 10), 'o'), ((10, 10), 'x')): s.put(x, y, ch)
    if gem:
        for (x, y), ch in (((9, 9), 'z'), ((10, 9), 'Z'), ((9, 10), 'Z'), ((10, 10), 'u')): s.put(x, y, ch)
    return s
def prof(pal): return dict(PK=pal['c'], PF=pal['b'], PE=pal['E'], PO=pal['x'])
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
STEEL = dict(a='#c2ccda', b='#8e9ab0', c='#5e6a80', E='#9aa2ae', e='#f4f8ff', k='#2e3542',
             p='#ffffff', o='#f4f8ff', x='#ccd6e4', O='#8a96ac', Q='#343c4a', t='#f4f8ff')
@frm('A', '통쇠를 오목하게 두들긴 접시 · 말린 테 · 큰 쇠 돌기')
def fA(): return frame('A'), dict(STEEL)
@frm('B', '나무에 가죽을 씌우고 징 여덟 개로 둘렀다 · 쇠 테 · 쇠 돌기')
def fB(): return frame('B'), dict(STEEL, a='#c88a54', b='#9a6234', c='#683e1c')
@frm('C', '가운데 돌기가 뾰족하게 솟았다 · 쇠 접시 · 말린 테')
def fC(): return frame('C'), dict(STEEL)
@frm('D', '돌기 둘레에 고리를 새겼다 · 금 테 · 보석 돌기')
def fD(): return frame('D', gem=True), dict(STEEL, E='#d8a030', e='#fff0a0', k='#8a5e14', d='#ffffff', D='#6a748a',
                                           z='#ffb0bc', Z='#e0283a', u='#8a1020')
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'B', '가죽 버클러', '나무에 소가죽을 씌운 연습 버클러 · 쇠 징')
def b01(): return frame('B'), dict(STEEL, a='#d8a068', b='#a8743e', c='#74481e', E='#7e6a58', e='#b8a48e', k='#4a3a2c', t='#e8e0d0')
@make(10, 'A', '쇠 접시 방패', '투사가 처음 드는 쇠 접시 · 큰 쇠 돌기')
def b10(): return frame('A'), dict(STEEL)
@make(20, 'C', '뾰족 돌기 버클러', '돌기가 뾰족해 밀어 치면 아프다 · 청동 테')
def b20(): return frame('C'), dict(STEEL, E='#b07a3a', e='#f0c078', k='#6a4418')
@make(30, 'D', '청동 투사 버클러', '청동을 두들긴 접시에 고리를 새겼다 · 청동 돌기')
def b30(): return frame('D'), dict(a='#fff0b8', b='#e0b060', c='#a87430', E='#8a5a22', e='#e8b860', k='#4a3010', d='#fff8d8', D='#7a5020',
                                   p='#fff8d8', o='#f0c870', x='#d0a048', O='#8a5a22', Q='#5a3612', t='#fff0b8')
@make(40, 'A', '강철 버클러', '닦은 강철 접시 · 검은 쇠 테')
def b40(): return frame('A'), dict(STEEL, a='#ffffff', b='#d0dae8', c='#8e9cb4', E='#4e5662', e='#9aa4b4', k='#262c36')
@make(50, 'C', '붉은 모래 버클러', '모래빛 접시 · 붉은 테 · 뾰족 돌기')
def b50(): return frame('C'), dict(STEEL, a='#fff4dc', b='#e4cfa8', c='#b09670', E='#c03a2a', e='#f07a5a', k='#6e1a14',
                                   p='#ffffff', o='#efe2cc', x='#c8b494', O='#8e7a5c', Q='#5a4a34')
@make(60, 'D', '은 고리 버클러', '은 접시에 고리를 새겼다 · 은 테 · 푸른 보석 돌기')
def b60(): return frame('D', gem=True), dict(STEEL, a='#ffffff', b='#dfe6f0', c='#a8b2c6', E='#c8d0dc', e='#ffffff', k='#6a748a',
                                             d='#ffffff', D='#7a849a', z='#c8ecff', Z='#4a8ae0', u='#1a3a8a')
@make(70, 'B', '사자 가죽 버클러', '황금빛 사자 가죽을 씌웠다 · 금 징 · 금 돌기')
def b70(): return frame('B'), dict(a='#f8d890', b='#d8a850', c='#a87428', E='#b07818', e='#ffe890', k='#6a4410', t='#fffbd0',
                                   p='#fffbd0', o='#ffe070', x='#f0c040', O='#a87018', Q='#6a4410')
@make(80, 'D', '흑철 버클러', '검은 쇠 접시에 금 고리 · 금 테 · 금 돌기')
def b80(): return frame('D'), dict(a='#6a6e78', b='#44484f', c='#2a2c32', E='#d8a030', e='#fff0a0', k='#6a4410', d='#ffd860', D='#a87018',
                                   p='#fffbd0', o='#ffe070', x='#f0c040', O='#a87018', Q='#6a4410')
@make(90, 'B', '붉은 깃 버클러', '투구 깃처럼 붉은 가죽 · 금 징 · 금 테')
def b90(): return frame('B'), dict(a='#f06a5a', b='#c83a30', c='#8a1e1e', E='#d8a030', e='#fff0a0', k='#6a4410', t='#fffbd0',
                                   p='#fffbd0', o='#ffe070', x='#f0c040', O='#a87018', Q='#6a4410')
@make(100, 'A', '챔피언 버클러', '우승자의 흰 강철 접시 · 월계 초록 테 · 금 돌기')
def b100(): return frame('A'), dict(a='#ffffff', b='#e4ecf8', c='#a8b6cc', E='#3a9a30', e='#9ae860', k='#1e5a1e',
                                    p='#fffbd0', o='#ffe070', x='#f0c040', O='#a87018', Q='#6a4410')
@make(110, 'C', '핏빛 버클러', '검붉게 물든 접시 · 뾰족 돌기 · 검은 테')
def b110(): return frame('C'), dict(a='#e07080', b='#b03044', c='#6a1424', E='#3a2a30', e='#7a5a64', k='#1a1014',
                                    p='#ffd0d8', o='#d8a0a8', x='#a8646e', O='#6a2a34', Q='#3a1018')
@make(120, 'C', '번개 버클러', '푸른 쇠 접시 · 노란 테 · 번쩍이는 뾰족 돌기')
def b120(): return frame('C'), dict(a='#a8bce8', b='#6a7ea4', c='#3e4a6a', E='#e0b020', e='#fff36a', k='#8a6a10',
                                    p='#ffffff', o='#fff36a', x='#d0a020', O='#8a6a10', Q='#4a3a08')
@make(130, 'A', '흑요석 버클러', '검은 유리 접시 · 보랏빛 테 · 흑요석 돌기')
def b130(): return frame('A'), dict(a='#8a7aaa', b='#4a3a6a', c='#241c34', E='#7a5ac8', e='#c8a8ff', k='#2a1a4a',
                                    p='#e8d4ff', o='#8a7aaa', x='#5a4a78', O='#2e2442', Q='#160f24')
@make(140, 'B', '별빛 버클러', '밤하늘빛 가죽에 별 징 · 은 테 · 은 돌기')
def b140(): return frame('B'), dict(a='#4a5ab0', b='#2e3880', c='#1a2050', E='#c8d0dc', e='#ffffff', k='#5a6280', t='#ffe890',
                                    p='#ffffff', o='#e0e6f0', x='#b8c2d4', O='#7a849a', Q='#4a5266')
@make(150, 'D', '투기왕 버클러', '투기장 왕좌의 흰 금 접시 · 금 테 · 루비 돌기 · 빛이 감돈다')
def b150():
    s = frame('D', gem=True); s.fx.update({(2, 2): '1', (17, 3): '2', (3, 17): '2', (16, 16): '1'})
    return s, dict(a='#ffffff', b='#fff4d8', c='#e8cf98', E='#d8a030', e='#fff0a0', k='#8a5e14', d='#ffffff', D='#c8a050',
                   p='#ffffff', o='#ffe8a0', x='#ffd860', O='#c08a20', Q='#7a5410', z='#ffb0bc', Z='#e0283a', u='#8a1020',
                   **{'1': '#ffffff', '2': '#fff0a0'})
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, pal = d['fn']()
        if s.sym_err(): print(d.get('lv', d.get('key')), 'sym', len(s.sym_err()))
        out.append((s.icon(pal).render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'bk_frames.png', z=12)
    zoomsheet(out[4:12], 'bk_z1.png', z=9)
    zoomsheet(out[12:], 'bk_z2.png', z=9)
    print(Counter(d['st'] for d in G))
