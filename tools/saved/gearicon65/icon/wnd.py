"""완드 — 정령술사 · 정령왕 (11-10 20:16 사용자). 원형 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
스태프보다 짧고 가늘다: 자루 끝 구슬 (4,15) → 감은 손잡이 → 한 칸 대 → 끝 장식. 모두 축 x + y = 19 위 · 윤곽 축 대칭.
틀
  A 새싹 가지: 가는 나뭇가지 · 잎 두 쌍이 끝 쪽으로 돋음 · 끝에 빛나는 꽃눈
  B 물방울: 은 대 · 받침 · 밑이 둥글고 끝이 뾰족한 물방울 수정
  C 나선 뿔: 손잡이에서 끝까지 가늘어지는 뿔 · 비스듬한 나선 홈
  D 정령 꽃: 가는 대 끝에 꽃잎 여섯 · 가운데 빛
글자: 대 r q R · 손잡이 k K(감기) · 쇠 h g G · 끝 z Z u w · 잎/꽃잎 l L · 자루 끝 구슬 p o O · 효과 1 2"""
import math
from g4 import Sw
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
def dist(x, y, cx, cy): return math.hypot(x + .5 - cx, y + .5 - cy)
def disc(s, part, cx, cy, r, fn):
    for y in range(20):
        for x in range(20):
            if dist(x, y, cx, cy) <= r: s.put(x, y, part, fn(x + .5 - cx, y + .5 - cy, r))
def handle(s):
    for (x, y, ch) in ((3, 15, 'p'), (4, 15, 'o'), (3, 16, 'o'), (4, 16, 'O')): s.put(x, y, 'pommel', ch)   # 자루 끝 구슬 2×2 (가운데 (4,16) 모서리 = 축 위)
    for u in range(-9, -3):                                                               # 감은 손잡이 (|v| ≤ 1)
        for v in (-1, 0, 1):
            P(s, 'grip', u, v, ('k' if v <= 0 else 'K') if (u % 2 == 0) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    for v in (-1, 0, 1): P(s, 'guard', -3, v, 'h' if v < 0 else ('G' if v > 0 else 'g'))
    P(s, 'guard', -2, -1, 'h'); P(s, 'guard', -2, 1, 'G')
def rod(s, u0, u1, ch='q'):
    for u in range(u0, u1 + 1): P(s, 'blade', u, 0, ch)
def fA(s):
    handle(s); rod(s, -1, 11)
    for u0, pts in ((2, ((0, 1), (1, 2), (2, 3), (3, 2), (2, 1))), (8, ((0, 1), (1, 2), (2, 1)))):   # 잎 두 쌍 (밖으로 돋았다 끝 쪽으로, u + v 홀수 칸)
        for sg in (-1, 1):
            for (du, v) in pts: P(s, 'head', u0 + du, sg * v, 'l' if sg < 0 else 'L')
    for (u, v, ch) in ((12, -1, 'z'), (12, 1, 'u'), (13, 0, 'Z'), (14, -1, 'z'), (14, 1, 'u'), (15, 0, 'w')): P(s, 'head', u, v, ch)   # 꽃눈
def fB(s):
    handle(s); rod(s, -1, 6, 'g')
    for v in (-2, -1, 0, 1, 2): P(s, 'guard', 7, v, 'h' if v < 0 else ('G' if v > 0 else 'g'))   # 받침
    for u in range(8, 17):                                                               # 물방울: 밑이 둥글고 끝이 뾰족
        hw = {8: 1, 9: 2, 10: 2.5, 11: 2.5, 12: 2}.get(u, 2.0 * (16 - u) / 4)
        for v in range(-3, 4):
            if abs(v) <= hw + 1e-6 and (u + v) % 2:
                P(s, 'head', u, v, 'z' if v < 0 else ('u' if v > 0 else 'Z'))
    P(s, 'head', 10, -1, 'w'); P(s, 'head', 9, -2, 'w')
def fC(s):
    for (x, y, ch) in ((3, 15, 'p'), (4, 15, 'o'), (3, 16, 'o'), (4, 16, 'O')): s.put(x, y, 'pommel', ch)
    for u in range(-9, -4):
        for v in (-1, 0, 1):
            P(s, 'grip', u, v, ('k' if v <= 0 else 'K') if (u % 2 == 0) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    for u in range(-4, 17):                                                              # 뿔: 굵게 시작해 끝으로 가늘어짐 · 나선 홈
        hw = 2.0 if u <= 0 else max(0.0, 2.0 * (16 - u) / 16)
        for v in range(-2, 3):
            if abs(v) <= hw + 1e-6 and (u + v) % 2:
                groove = (u - v) % 6 in (0, 1)
                P(s, 'head', u, v, 'u' if groove else ('z' if v < 0 else ('Z' if v == 0 else 'u' if v > 1 else 'Z')))
def fD(s):
    handle(s); rod(s, -1, 9)
    c = (14.0, 6.0); a = (1 / math.sqrt(2), -1 / math.sqrt(2)); p = (1 / math.sqrt(2), 1 / math.sqrt(2))
    for k in range(6):                                                                    # 꽃잎 여섯 (축 방향부터 60°마다, 축 대칭)
        th = math.radians(60 * k)
        if k == 3: continue                                                               # 대 쪽 꽃잎은 대가 지나간다
        cx = c[0] + 2.7 * (math.cos(th) * a[0] + math.sin(th) * p[0]); cy = c[1] + 2.7 * (math.cos(th) * a[1] + math.sin(th) * p[1])
        disc(s, 'head', cx, cy, 1.3, lambda dx, dy, r: 'l' if dx + dy < -0.5 else ('L' if dx + dy > 0.5 else 'l'))
    disc(s, 'head', c[0], c[1], 1.25, lambda dx, dy, r: 'w' if dx + dy < -0.6 else 'Z')
def frame(st):
    s = Sw(); s.fx = {}
    {'A': fA, 'B': fB, 'C': fC, 'D': fD}[st](s)
    return s
STYLE = {'A': '새싹 가지', 'B': '물방울', 'C': '나선 뿔', 'D': '정령 꽃'}
WOOD = dict(r='#b89068', q='#8a6440', R='#54381e', k='#c8b08a', K='#6a5236')
IRON = dict(h='#e8eef6', g='#a8b0bc', G='#5a6270')
BEAD = dict(p='#e8eef6', o='#a8b0bc', O='#4e5662')
LEAF = dict(l='#8ad870', L='#3a8a30')
BUD = dict(z='#f0ffd0', Z='#c8f070', u='#6aa830', w='#ffffff')
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
@frm('A', '가는 나뭇가지 · 끝 쪽으로 돋은 잎 두 쌍 · 빛나는 꽃눈')
def gA(): return frame('A'), M(WOOD, IRON, BEAD, LEAF, BUD)
@frm('B', '은 대 · 받침 · 밑이 둥글고 끝이 뾰족한 물방울 수정')
def gB(): return frame('B'), M(WOOD, IRON, BEAD, z='#e0f8ff', Z='#5ac0f0', u='#1a6ab8', w='#ffffff', q='#a8b0bc')
@frm('C', '손잡이에서 끝까지 가늘어지는 뿔 · 비스듬한 나선 홈')
def gC(): return frame('C'), M(WOOD, BEAD, z='#fffbf0', Z='#e8dcc8', u='#a8987c')
@frm('D', '가는 대 끝에 꽃잎 여섯 · 가운데 빛')
def gD(): return frame('D'), M(WOOD, IRON, BEAD, l='#ffd0e8', L='#e07ab0', Z='#fff36a', w='#ffffff')
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '버들가지 완드', '갓 꺾은 버들가지 · 연두 꽃눈')
def w01(): return frame('A'), M(WOOD, IRON, BEAD, LEAF, BUD)
@make(10, 'B', '이슬 완드', '아침 이슬을 담은 맑은 물방울')
def w10(): return frame('B'), M(WOOD, IRON, BEAD, z='#f0fcff', Z='#a8e4fc', u='#4a9ad8', w='#ffffff', q='#a8b0bc')
@make(20, 'C', '나선 뿔 완드', '산양 뿔을 깎아 만든 완드 · 가죽 손잡이')
def w20(): return frame('C'), M(WOOD, BEAD, z='#fff4e0', Z='#e0c8a0', u='#9a7a50')
@make(30, 'D', '들꽃 완드', '들꽃 정령이 깃든 분홍 꽃')
def w30(): return frame('D'), M(WOOD, IRON, BEAD, l='#ffd0e8', L='#e07ab0', Z='#fff36a', w='#ffffff')
@make(40, 'C', '바람 뿔 완드', '바람 정령이 휘감은 옥빛 뿔')
def w40():
    s = frame('C'); s.fx.update({(18, 1): '1', (13, 2): '2', (17, 7): '2'})
    return s, M(WOOD, BEAD, z='#f0fff8', Z='#a8f0d0', u='#3a9a7a', **{'1': '#d8fff0', '2': '#8ae0c0'})
@make(50, 'A', '단풍 가지 완드', '붉게 물든 잎 · 주홍 꽃눈')
def w50(): return frame('A'), M(WOOD, IRON, BEAD, l='#ff9a4a', L='#c8401a', z='#fff0c0', Z='#ffb040', u='#c86a1a', w='#ffffff')
@make(60, 'D', '불꽃 꽃 완드', '불의 정령이 피운 꽃 · 꽃잎 끝이 타오른다')
def w60():
    s = frame('D'); s.fx.update({(18, 2): '1', (12, 1): '2'})
    return s, M(WOOD, BEAD, h='#6a5a5a', g='#3e2c2c', G='#241616', q='#3e2c2c', l='#ffb040', L='#e0401a', Z='#fff2b0', w='#ffffff', **{'1': '#ffd84a', '2': '#ff8a1a'})
@make(70, 'B', '샘물 완드', '깊은 샘에서 길어 올린 푸른 물방울')
def w70(): return frame('B'), M(WOOD, IRON, BEAD, z='#c8f0ff', Z='#2a8ae0', u='#163a8a', w='#ffffff', q='#a8b0bc')
@make(80, 'B', '번개 방울 완드', '번개 정령을 가둔 노란 방울 · 불똥이 튄다')
def w80():
    s = frame('B'); s.fx.update({(18, 1): '1', (16, 0): '2', (18, 6): '2'})
    return s, M(WOOD, BEAD, h='#5a5664', g='#383440', G='#201e26', q='#383440', z='#fffbd0', Z='#fff36a', u='#c0901a', w='#ffffff', **{'1': '#ffffff', '2': '#fff36a'})
@make(90, 'A', '이끼 가지 완드', '이끼 낀 고목 가지 · 반딧불처럼 빛나는 꽃눈')
def w90():
    s = frame('A'); s.fx.update({(17, 2): '1', (12, 2): '2', (18, 7): '2'})
    return s, M(WOOD, IRON, BEAD, r='#6a7a48', q='#4a5a30', R='#2a361a', l='#a8e070', L='#4a8a30', z='#f0ffd0', Z='#d8ff8a', u='#7ac040', w='#ffffff',
                **{'1': '#f0ffb0', '2': '#c8f070'})
@make(100, 'D', '얼음 꽃 완드', '서리 정령이 피운 얼음 꽃')
def w100():
    s = frame('D'); s.fx.update({(18, 1): '1', (11, 2): '2'})
    return s, M(BEAD, r='#e8eef6', q='#a8b4c8', R='#5a6680', k='#ffffff', K='#7aa8c8', h='#ffffff', g='#c8e4f4', G='#7aa8c8',
                l='#e0f8ff', L='#7ac4ec', Z='#ffffff', w='#ffffff', **{'1': '#ffffff', '2': '#bdeeff'})
@make(110, 'C', '유니콘 뿔 완드', '진줏빛 유니콘 뿔 · 은 손잡이')
def w110(): return frame('C'), M(BEAD, r='#e8eef6', q='#a8b4c8', R='#5a6680', k='#ffffff', K='#7a84a0', z='#ffffff', Z='#f0eaff', u='#b8a8e0')
@make(120, 'A', '세계수 새싹 완드', '세계수에서 돋은 새싹 · 금빛 꽃눈')
def w120():
    s = frame('A'); s.fx.update({(17, 2): '1', (12, 1): '2'})
    return s, M(IRON, BEAD, r='#c8a070', q='#9a7448', R='#5a4024', k='#f0c040', K='#a87018', l='#7ae880', L='#2a9a48',
                z='#fffbd0', Z='#f0c040', u='#a87018', w='#ffffff', **{'1': '#fff0a0', '2': '#7ae880'})
@make(130, 'D', '빛의 꽃 완드', '빛의 정령이 피운 흰 꽃 · 금빛 가운데')
def w130():
    s = frame('D'); s.fx.update({(18, 1): '1', (10, 3): '2', (18, 9): '2'})
    return s, M(BEAD, r='#fffbe8', q='#e8d8a8', R='#a89060', k='#f0c040', K='#a87018', h='#fffbd0', g='#f0c040', G='#a87018',
                l='#ffffff', L='#e8e0c8', Z='#ffd84a', w='#ffffff', **{'1': '#ffffff', '2': '#fff0a0'})
@make(140, 'B', '바다의 눈물 완드', '바다 정령이 흘린 눈물 — 깊은 남빛 물방울 · 진주 받침')
def w140(): return frame('B'), M(WOOD, BEAD, h='#ffffff', g='#e8e4f0', G='#a8a0c0', q='#e8e4f0', z='#a8e0ff', Z='#1a5ab8', u='#0c2a6a', w='#ffffff')
@make(150, 'C', '정령왕의 뿔 완드', '정령왕만 드는 무지갯빛 뿔 — 여섯 정령이 둘레를 돈다')
def w150():
    s = frame('C'); s.fx.update({(18, 1): '1', (13, 1): '2', (18, 7): '3', (9, 4): '4', (15, 11): '5', (6, 9): '6'})
    return s, M(BEAD, r='#fffbd0', q='#f0c040', R='#a87018', k='#fffbd0', K='#a87018', z='#ffffff', Z='#e0d0ff', u='#9a7ae8',
                **{'1': '#ff8a5a', '2': '#5ac0f0', '3': '#8ae070', '4': '#fff36a', '5': '#c8f0ff', '6': '#e8a8ff'})
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d.get('lv', d.get('key')), 'sym', len(e), e[:4])
        out.append((ic.render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'wnd_frames.png', z=12)
    zoomsheet(out[4:12], 'wnd_z1.png', z=9); zoomsheet(out[12:], 'wnd_z2.png', z=9)
    print(Counter(d['st'] for d in G))
