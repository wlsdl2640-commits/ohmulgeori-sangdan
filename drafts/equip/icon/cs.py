"""십자 방패 — 기사 · 성기사 (히터꼴: 위는 곧고 아래로 뾰족). 원형 시안 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
틀: 너비 16(x 2..17) · 높이 18(y 1..18) · 테 1칸 · 십자(세로 x 9..10, 가로 y 6..7) — 좌우 대칭. 이름 · 색은 장검 16자루와 짝"""
import math
from sh import Sh, t_of, sh3
STYLE = {'A': '곧은 십자', 'B': '테 두른 십자', 'C': '넓은 십자', 'D': '의장 금장'}
def half_w(y):
    """줄 y의 반너비 (가운데 9.5 기준)"""
    yc = y + .5
    if yc < 2: return 7.0
    if yc <= 9.5: return 8.0
    k = yc - 9.5
    return 8 * (1 - (k / 9.6) ** 1.5) if k < 9.6 else -1
def inside(x, y): return 1 <= y <= 18 and abs(x + .5 - 10) <= half_w(y) + 1e-6
def on_rim(x, y): return inside(x, y) and any(not inside(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
def frame(st, gem=False):
    s = Sh()
    wv = (9, 10) if st != 'C' else (8, 11)          # 세로 막대 x 범위
    hv = (6, 7) if st != 'C' else (5, 8)            # 가로 막대 y 범위
    def cross(x, y): return (wv[0] <= x <= wv[1]) or (hv[0] <= y <= hv[1])
    def role(x, y):
        t = t_of(x, y, r=9.0)
        if on_rim(x, y): return 'e' if t < -0.3 else 'E'
        if st == 'D' and any(on_rim(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): return 'E'   # 두 칸 금 테
        if cross(x, y):
            # 막대 아래 · 오른쪽 가장자리는 그늘
            edge = (x == wv[1] and not (hv[0] <= y <= hv[1])) or (y == hv[1] and not (wv[0] <= x <= wv[1]))
            return 'D' if edge else 'd'
        if st == 'B' and any(cross(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): return 'f'   # 십자 테
        return sh3(t, 'a', 'b', 'c', -0.45, 0.5)
    s.fill(inside, role)
    if st == 'B':
        for (x, y) in ((3, 2), (16, 2)): s.put(x, y, 't')                # 위 두 모서리 징
    if gem:
        for (x, y), ch in (((9, 6), 'z'), ((10, 6), 'Z'), ((9, 7), 'Z'), ((10, 7), 'u')): s.put(x, y, ch)
    return s
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
@frm('A', '곧은 히터꼴 방패 · 가는 곧은 십자 · 쇠 테')
def fA(): return frame('A'), dict(a='#f4f4f8', b='#d8dae4', c='#a8acbc', d='#3a56a8', D='#22346a', E='#7a828e', e='#c8d0dc')
@frm('B', '십자를 흰 테로 두르고 위 두 모서리에 징 · 쇠 테')
def fB(): return frame('B'), dict(a='#5a7ad0', b='#3e5aaa', c='#283c78', d='#f0c040', D='#a87818', f='#ffffff',
                                  E='#7a828e', e='#c8d0dc', t='#ffffff')
@frm('C', '굵은 십자 · 쇠 테 (멀리서도 잘 보이는 문장)')
def fC(): return frame('C'), dict(a='#3e3a44', b='#2a2630', c='#18141c', d='#f4f4f8', D='#a8acbc', E='#7a828e', e='#c8d0dc')
@frm('D', '두 칸 금 테 · 금 십자 · 가운데 보석')
def fD(): return frame('D', gem=True), dict(a='#ffffff', b='#e8ecf6', c='#b8c0d4', d='#ffd860', D='#b08018', E='#d8a030', e='#fff0a0',
                                           z='#9ad8ff', Z='#2a7ae0', u='#123a8a')
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
IRON = dict(E='#7a828e', e='#c8d0dc', t='#ffffff')
@make(1, 'A', '견습 기사 방패', '무명빛 바탕에 갈색 십자 — 갓 서약한 견습 기사의 방패')
def c01(): return frame('A'), dict(IRON, a='#f4ead0', b='#dccfae', c='#ae9e7e', d='#8a5a32', D='#5a3618')
@make(10, 'B', '성문 수비 방패', '잿빛 바탕 · 모래빛 테 두른 적갈색 십자 · 모서리 징')
def c10(): return frame('B'), dict(IRON, a='#a8acb4', b='#80848e', c='#555a64', d='#9a3a2a', D='#5e1e16', f='#e8d8b0')
@make(20, 'C', '은빛 맹세 방패', '푸른 바탕에 굵은 은 십자')
def c20(): return frame('C'), dict(IRON, a='#5a7ad8', b='#3a56a8', c='#22346a', d='#ffffff', D='#a8b2c6')
@make(30, 'D', '떡갈잎 기사 방패', '초록 바탕 · 청동 테 · 청동 십자 · 초록 보석')
def c30(): return frame('D', gem=True), dict(a='#8ad870', b='#4aa83a', c='#22682a', d='#f0c070', D='#a8742e', E='#c88a3a', e='#ffd890',
                                             z='#c8ffb0', Z='#3ac04a', u='#126a22')
@make(40, 'C', '푸른 강철 방패', '파랗게 담금질한 강철 바탕에 굵은 흰 십자')
def c40(): return frame('C'), dict(E='#c8d0dc', e='#ffffff', a='#8ab0e8', b='#4a72b8', c='#24407a', d='#ffffff', D='#b8c8e0')
@make(50, 'D', '붉은 매 방패', '붉은 바탕 · 금 테 · 금 십자 · 붉은 보석')
def c50(): return frame('D', gem=True), dict(a='#f06a5a', b='#c83a30', c='#8a1e1e', d='#ffd860', D='#b08018', E='#d8a030', e='#fff0a0',
                                             z='#ffb0bc', Z='#e0283a', u='#8a1020')
@make(60, 'A', '서리 기사 방패', '서리 낀 하늘빛 바탕 · 흰 십자 · 은 테')
def c60(): return frame('A'), dict(a='#e8f8ff', b='#b8e0f8', c='#7ab4e0', d='#ffffff', D='#a0bcd8', E='#c8d0dc', e='#ffffff')
@make(70, 'B', '황금 문장 방패', '금빛 바탕 · 흰 테 두른 남빛 십자 · 금 테 징')
def c70(): return frame('B'), dict(a='#ffe070', b='#f0c040', c='#b88a18', d='#2e4a9a', D='#1a2a60', f='#ffffff',
                                   E='#b08018', e='#fff0a0', t='#fffbd0')
@make(80, 'B', '흑철 기사 방패', '검은 바탕 · 은 테 두른 금 십자 · 금 징')
def c80(): return frame('B'), dict(a='#4a4652', b='#2e2a34', c='#1a171e', d='#ffd860', D='#b08018', f='#c8d0dc',
                                   E='#b08018', e='#ffe890', t='#fffbd0')
@make(90, 'A', '용비늘 방패', '초록 비늘빛 바탕 · 금 십자 · 금 테')
def c90(): return frame('A'), dict(a='#8ad870', b='#3e9a34', c='#1e5a22', d='#ffd860', D='#b08018', E='#b08018', e='#ffe890')
@make(100, 'D', '왕실 근위 방패', '보라 바탕 · 금 테 · 금 십자 · 자수정')
def c100(): return frame('D', gem=True), dict(a='#b07ae8', b='#7a44c0', c='#4a2280', d='#ffd860', D='#b08018', E='#d8a030', e='#fff0a0',
                                              z='#f0d0ff', Z='#a050f0', u='#4a1a8a')
@make(110, 'C', '폭풍 기사 방패', '먹구름빛 바탕에 청록 굵은 십자 · 은 테')
def c110(): return frame('C'), dict(E='#c8d0dc', e='#ffffff', a='#7a8898', b='#566474', c='#323e4c', d='#5ae0d8', D='#2a9a94')
@make(120, 'A', '노을 맹세 방패', '저녁놀 주황 바탕 · 구리 십자 · 구리 테')
def c120(): return frame('A'), dict(a='#ffb070', b='#f08a3a', c='#b0561a', d='#ffe0c0', D='#c88a5a', E='#a8582a', e='#f0a070')
@make(130, 'C', '달빛 방패', '짙은 보라 바탕에 굵은 은 십자 · 은 테')
def c130(): return frame('C'), dict(E='#c8d0dc', e='#ffffff', a='#6a5aa8', b='#463a80', c='#2a2050', d='#f4f0ff', D='#b8b0d8')
@make(140, 'B', '극광 방패', '청록 바탕 · 흰 테 두른 보라 십자 · 은 테 징')
def c140(): return frame('B'), dict(a='#5ad8b8', b='#2a9a8a', c='#165a54', d='#a878ff', D='#6a3ac8', f='#ffffff',
                                    E='#c8d0dc', e='#ffffff', t='#ffffff')
@make(150, 'D', '영원의 맹세 방패', '흰 금빛 바탕 · 금 테 · 금 십자 · 사파이어 · 빛이 감돈다')
def c150():
    s = frame('D', gem=True); s.fx.update({(1, 1): '1', (18, 2): '2', (2, 14): '2', (17, 12): '1'})
    return s, dict(a='#ffffff', b='#fff4d8', c='#e8cf98', d='#ffd860', D='#c08a20', E='#d8a030', e='#fff0a0',
                   z='#c8ecff', Z='#2a7ae0', u='#123a8a', **{'1': '#ffffff', '2': '#fff0a0'})
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, pal = d['fn']()
        if s.sym_err(): print(d.get('lv', d.get('key')), 'sym', s.sym_err()[:4])
        out.append((s.icon(pal).render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'cs_frames.png', z=12)
    zoomsheet(out[4:12], 'cs_z1.png', z=9)
    zoomsheet(out[12:], 'cs_z2.png', z=9)
    print(Counter(d['st'] for d in G))
