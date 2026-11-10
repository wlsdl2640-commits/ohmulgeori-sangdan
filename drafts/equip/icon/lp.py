"""락핀(자물쇠 따개) — 소매치기 · 대도의 부장비 (11-10 19:09 사용자: 소매치기 부장비 = 락핀). 원형 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
축 x + y = 19 (끝이 오른쪽 위 45°), 손잡이 · 자루 끝이 축 위. 칼보다 훨씬 가늘다(쇠침은 한 칸 줄).
틀
  A 갈고리 따개: 감은 손잡이 · 쇠 목테(손잡이 굵기) · 가는 쇠침 끝이 위로 살짝 굽은 갈고리
  B 갈퀴 따개: 같은 손잡이 · 끝 쪽이 톱날처럼 오르내리는 물결(갈퀴)
  C 머리핀: 두 가닥 핀(위 가닥 곧게 · 아래 가닥 물결) · 왼쪽 아래에서 둥글게 꺾임 · 꺾인 곳에 장식 구슬 · 끝마다 작은 방울
  D 만능 열쇠: 구멍 뚫린 둥근 머리(5×5) · 목테 · 긴 대 · 끝 쪽 아래로 이빨 달린 열쇠 날
글자: 쇠 w(빛) b B(그늘) · 손잡이 r q R(감기) k K(줄) · 목테 h g G · 자루 끝 / 열쇠 머리 p o x O Q · 보석 z Z u · 핀 장식 m M · 효과 1 2"""
from g4 import Sw
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
def handle(s, gem=False):
    """감은 손잡이 u −13..−5 (|v| ≤ 1) · 줄무늬 · 자루 끝 마개 (2,17) 둘레 · 쇠 목테 u −4 · −3 (|v| ≤ 2)"""
    for u in range(-13, -4):
        for v in (-1, 0, 1):
            ring = (u + 13) // 2
            if ring % 2 == 0: ch = 'k' if v <= 0 else 'K'
            else: ch = 'r' if v < 0 else ('R' if v > 0 else 'q')
            P(s, 'grip', u, v, ch)
    for (x, y, ch) in ((2, 17, 'o'), (1, 17, 'p'), (2, 18, 'O'), (1, 18, 'Q')):    # 자루 끝 마개 (축 위 꼭지 (1,18))
        s.put(x, y, 'pommel', ch)
    if gem: s.put(2, 17, 'pommel', 'z'); s.put(1, 18, 'pommel', 'u')
    for (u, v) in ((-4, -1), (-3, 0), (-4, 1)): P(s, 'guard', u, v, 'h' if v < 0 else ('G' if v > 0 else 'g'))   # 쇠 목테(손잡이 굵기 그대로)
def shaft(s, u0, u1):
    for u in range(u0, u1 + 1): P(s, 'blade', u, 0, 'w' if u >= u1 - 2 else 'b')
def fA(s):
    handle(s); shaft(s, -1, 13)
    for (x, y, ch) in ((16, 2, 'w'), (15, 1, 'w')): s.put(x, y, 'blade', ch)      # 갈고리: 끝에서 위로 굽음
def fB(s):
    handle(s); shaft(s, -1, 7)
    for (x, y, ch) in ((13, 5, 'b'), (13, 4, 'w'), (14, 4, 'b'), (15, 4, 'b'), (15, 3, 'b'), (15, 2, 'w'), (16, 2, 'b'), (17, 2, 'w')):
        s.put(x, y, 'blade', ch)                                                    # 갈퀴: 두 번 오르내림 (봉우리 (13,4) · (15,2))
def fC(s, bead=True):
    for x in range(3, 14): s.put(x, 17 - x, 'blade', 'w' if x >= 12 else 'b')       # 위 가닥 (x + y = 17) 곧게
    low = [(4, 17), (5, 16), (6, 15), (7, 15), (8, 14), (8, 13), (9, 12), (10, 11), (11, 11), (12, 10), (12, 9), (13, 8), (14, 7)]
    for (x, y) in low: s.put(x, y, 'blade', 'B' if (x, y) in ((7, 15), (11, 11)) else 'b')   # 아래 가닥: 물결 두 번
    for (x, y, ch) in ((2, 15, 'b'), (2, 16, 'B'), (3, 17, 'B')): s.put(x, y, 'blade', ch)   # 왼쪽 아래 둥근 꺾임
    for (x, y, ch) in ((14, 2, 'm'), (15, 6, 'm'), (14, 3, 'M'), (15, 7, 'M')): s.put(x, y, 'pommel', ch)   # 끝 방울
    if bead:
        for (x, y, ch) in ((1, 16, 'p'), (1, 17, 'o'), (2, 17, 'x'), (2, 18, 'O')): s.put(x, y, 'pommel', ch)   # 꺾인 곳 장식 구슬
RING5 = [".ppp.", "p...o", "p...O", "o...Q", ".OQQ."]
def fD(s, gem=False):
    for j, r in enumerate(RING5):
        for i, ch in enumerate(r):
            if ch != '.': s.put(2 + i, 13 + j, 'pommel', ch)                        # 머리: 가운데 구멍 (4,15) = 축 위
    if gem: s.put(4, 15, 'pommel', 'z')
    for (x, y, ch) in ((6, 13, 'g'), (6, 12, 'h'), (7, 13, 'G')): s.put(x, y, 'guard', ch)   # 머리와 대 사이 목테
    for u in range(-5, 14): P(s, 'blade', u, 0, 'w' if u <= -3 or u >= 12 else 'b')  # 대
    for (x, y, ch) in ((14, 6, 'b'), (15, 6, 'b'), (16, 6, 'b'), (17, 5, 'b'), (15, 7, 'B'), (16, 7, 'B'), (17, 6, 'B')):
        s.put(x, y, 'blade', ch)                                                    # 열쇠 날: 끝 가까이 대 아래(오른쪽 아래)로 매단 네모 날
def frame(st, **kw):
    s = Sw(); s.fx = {}
    {'A': fA, 'B': fB, 'C': fC, 'D': fD}[st](s, **kw)
    return s
STYLE = {'A': '갈고리 따개', 'B': '갈퀴 따개', 'C': '머리핀', 'D': '만능 열쇠'}
STEEL = dict(w='#ffffff', b='#c8d2e2', B='#7a869c')
IRON = dict(h='#a8b0bc', g='#6c7482', G='#3e4450')
CLOTH = dict(r='#8a6a4a', q='#64482e', R='#3e2a18', k='#c8b08a', K='#6a5236')
CAP = dict(p='#e8eef6', o='#a8b0bc', x='#6c7482', O='#3e4450', Q='#262a32')
PIN = dict(m='#e8eef6', M='#7a869c')
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
@frm('A', '감은 손잡이 · 가는 쇠침 끝이 위로 굽은 갈고리 — 자물쇠 핀을 하나씩 들어 올린다')
def gA(): return frame('A'), dict(STEEL, **IRON, **CLOTH, **CAP)
@frm('B', '같은 손잡이 · 끝이 톱날처럼 오르내리는 갈퀴 — 핀을 한꺼번에 훑는다')
def gB(): return frame('B'), dict(STEEL, **IRON, **CLOTH, **CAP)
@frm('C', '두 가닥 머리핀(아래 가닥 물결) · 둥근 꺾임에 장식 구슬 · 끝 방울')
def gC(): return frame('C'), dict(STEEL, **CAP, **PIN)
@frm('D', '구멍 뚫린 둥근 머리 · 긴 대 · 이빨 달린 열쇠 날 — 어떤 문이든 맞춰 깎은 열쇠')
def gD(): return frame('D'), dict(STEEL, **IRON, **CAP)
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
RUST = dict(w='#f0d8c0', b='#c8a080', B='#8a6a4a')
@make(1, 'A', '녹슨 갈고리 따개', '녹슨 쇠꼬챙이를 구부린 따개 · 헝겊 손잡이')
def l01(): return frame('A'), dict(RUST, **IRON, r='#8a7a64', q='#665a48', R='#3e3428', k='#b8a888', K='#5a4c3a', **CAP)
@make(10, 'B', '뒷골목 갈퀴 따개', '뒷골목 열쇠장이가 버린 갈퀴 따개 · 검은 끈')
def l10(): return frame('B'), dict(STEEL, **IRON, r='#3a3a44', q='#26262e', R='#16161c', k='#8a8e98', K='#2a2c32', **CAP)
@make(20, 'C', '구리 머리핀', '구리 머리핀을 펴서 만든 따개 · 작은 구슬')
def l20(): return frame('C'), dict(w='#ffd8b0', b='#e08a4a', B='#9a5228', m='#ffd8b0', M='#9a5228',
                                   p='#fff0e0', o='#e8a070', x='#c06a3a', O='#7a3a18')
@make(30, 'D', '문지기의 열쇠', '졸던 문지기 허리춤에서 슬쩍한 무쇠 열쇠')
def l30(): return frame('D'), dict(w='#d8dce4', b='#8a8e98', B='#54585f', **IRON, p='#c8ccd4', o='#8a8e98', O='#54585f', Q='#34363c', x='#6c7482')
@make(40, 'C', '은 머리핀', '은 머리핀 · 푸른 구슬 · 끝 방울도 은')
def l40(): return frame('C'), dict(w='#ffffff', b='#e8eef6', B='#a8b4c8', m='#ffffff', M='#a8b4c8',
                                   p='#c8e0ff', o='#5a8ae8', x='#3a5ab8', O='#22346a')
@make(50, 'A', '쥐꼬리 따개', '쥐꼬리처럼 가늘게 뽑은 갈고리 · 잿빛 가죽 손잡이')
def l50(): return frame('A'), dict(STEEL, **IRON, r='#7a7268', q='#5a544c', R='#3a3630', k='#b0a89c', K='#4a4640', **CAP)
@make(60, 'D', '금고털이 열쇠', '금고 자물쇠에 맞춰 깎은 놋쇠 열쇠')
def l60(): return frame('D'), dict(w='#fff4c8', b='#e8b860', B='#a8742e', h='#f0c870', g='#c08a3a', G='#7a5220',
                                   p='#fff0b0', o='#e8b860', x='#c08a3a', O='#a8742e', Q='#6a4418')
@make(70, 'B', '독사 갈퀴 따개', '독사 혀처럼 날름거리는 갈퀴 · 초록 비늘 손잡이')
def l70(): return frame('B'), dict(w='#f0fff0', b='#a8e0a0', B='#4a8a48', **IRON,
                                   r='#3a8a30', q='#2a6a24', R='#164a14', k='#a8f070', K='#1a4a1a', **CAP)
@make(80, 'B', '그림자 갈퀴 따개', '빛을 먹는 검은 갈퀴 — 소리 없이 연다')
def l80(): return frame('B'), dict(w='#d0d4e0', b='#7a7e8c', B='#3e4048', h='#5a5664', g='#383440', G='#201e26',
                                   r='#2a2630', q='#1c1a22', R='#0e0c12', k='#5a5664', K='#16141a',
                                   p='#8a8494', o='#4e4656', x='#3a3442', O='#221e28', Q='#120e16')
@make(90, 'D', '보물고 열쇠', '왕실 보물고 열쇠를 본떠 만든 금 열쇠 · 머리에 루비')
def l90(): return frame('D', gem=True), dict(w='#fffbd0', b='#ffd860', B='#c08a20', h='#fff2a0', g='#f0c040', G='#a87018',
                                             p='#fffbd0', o='#ffd860', x='#f0c040', O='#c08a20', Q='#6a4a10', z='#ff4a5a')
@make(100, 'A', '달빛 갈고리 따개', '달빛처럼 옅은 은 갈고리 · 보랏빛 손잡이 · 자수정 마개')
def l100():
    s = frame('A'); handle(s, gem=True)
    return s, dict(w='#ffffff', b='#e4dcf8', B='#a89ad8', h='#ffffff', g='#d0d4e6', G='#8a8ea8',
                   r='#5a3aa0', q='#3e2470', R='#2a1850', k='#c8b8f0', K='#3e2470', **CAP, z='#d0a8ff', u='#6a2ab8')
@make(110, 'C', '비취 머리핀', '귀부인의 비취 머리핀 · 금 줄기 · 비취 구슬')
def l110(): return frame('C'), dict(w='#fff6c0', b='#f0c040', B='#a87018', m='#d8fff0', M='#2a9a70',
                                    p='#d8fff0', o='#5ad0a0', x='#2a9a70', O='#14603e')
@make(120, 'A', '서리 갈고리 따개', '얼음처럼 차갑게 벼린 갈고리 · 흰 감기 · 얼음 마개')
def l120(): return frame('A'), dict(w='#ffffff', b='#d8f4ff', B='#8ac8ec', h='#ffffff', g='#c8e4f4', G='#7aa8c8',
                                    r='#f4fbff', q='#c8dcea', R='#8aa8c4', k='#7ac4ec', K='#4a7aa0',
                                    p='#ffffff', o='#d0f0ff', x='#9ad4f4', O='#4a8ac8', Q='#24507a')
@make(130, 'C', '흑진주 머리핀', '검은 은 머리핀 · 흑진주 구슬 · 보랏빛 윤')
def l130(): return frame('C'), dict(w='#d8d0e8', b='#7a7090', B='#3e3652', m='#e8dcff', M='#4e3a78',
                                    p='#c8b8f0', o='#4e3a78', x='#2e2442', O='#160f24')
@make(140, 'B', '불씨 갈퀴 따개', '자물쇠를 녹이듯 여는 달아오른 갈퀴 · 검은 손잡이')
def l140():
    s = frame('B'); s.fx.update({(18, 1): '1', (17, 0): '2', (12, 3): '2'})
    return s, dict(w='#fff2b0', b='#ffb040', B='#e0501a', h='#6a5a5a', g='#3e2c2c', G='#241616',
                   r='#3a2424', q='#2a1818', R='#1a0e0e', k='#ff6a1a', K='#1a0a0a',
                   p='#fff2b0', o='#ffb040', x='#ff7a1a', O='#c8401a', Q='#7a1a0c', **{'1': '#ffd84a', '2': '#ff8a1a'})
@make(150, 'D', '만물의 열쇠', '대도의 전설 — 세상의 어떤 문이든 연다 · 금 열쇠 머리에 자수정 · 금빛이 감돈다')
def l150():
    s = frame('D', gem=True); s.fx.update({(0, 12): '1', (6, 19): '2', (18, 1): '1', (15, 9): '2'})
    return s, dict(w='#ffffff', b='#ffe890', B='#c89028', h='#fffbd0', g='#f0c040', G='#a87018',
                   p='#fffbd0', o='#ffd860', x='#f0c040', O='#c08a20', Q='#6a4a10', z='#d0a8ff', **{'1': '#fff0a0', '2': '#ffffff'})
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = [(icon(d)[1].render(), str(d.get('lv', d.get('key')))) for d in FR + G]
    zoomsheet(out[:4], 'lp_frames.png', z=12)
    zoomsheet(out[4:12], 'lp_z1.png', z=9); zoomsheet(out[12:], 'lp_z2.png', z=9)
    print(Counter(d['st'] for d in G))
