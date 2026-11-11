"""라운드 실드 — 방패를 낄 수 있는 직업 모두의 공용 방패. 원형 시안 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
틀: 지름 18(x 1..18) 원 · 테 1칸 · 가운데 돌기(지름 5) — 좌우 대칭"""
import math
from sh import Sh, d_of, t_of, sh3, dome, rivets, CX, CY
R_OUT, R_RIM, R_BOSS = 9.0, 7.75, 2.6
STYLE = {'A': '판자', 'B': '칠한 원판', 'C': '쇠띠', 'D': '금속 원판'}
SEAMS = (6, 13)                       # 판자 틈 (좌우 대칭: 19 − 6 = 13)
def frame(st, boss_gem=False, band_y=((5, 6), (13, 14)), ring=(4.1, 5.5), n_riv=8):
    s = Sh()
    inside = lambda x, y: d_of(x, y) <= R_OUT
    def face(x, y):
        d = d_of(x, y); t = t_of(x, y)
        if d > R_RIM: return sh3(t, 'e', 'E', 'E', -0.3, 2)            # 테 (빛 쪽 밝게)
        if st in 'AC':
            if x in SEAMS: return 's'
            mid = SEAMS[0] < x < SEAMS[1]
            if st == 'C' and any(a <= y <= b for a, b in band_y):
                return 'm' if y == band_y[0][0] or y == band_y[1][0] else 'M'
            return sh3(t, *(('A', 'B', 'C') if mid else ('a', 'b', 'c')))
        if st == 'B':
            if ring[0] < d <= ring[1]: return sh3(t, 'd', 'd', 'D', -0.3, 0.4)
            return sh3(t, 'a', 'b', 'c')
        if st == 'D':
            if abs(d - 5.3) < 0.55: return 'd' if t < 0.05 else 'D'      # 돋을 고리
            return sh3(t, 'a', 'b', 'c', -0.5, 0.35)
    s.fill(inside, face)
    if st == 'C':                                                        # 쇠띠 끝 징
        for (a, b) in band_y:
            for x in (3, 16):
                if d_of(x, a) <= R_RIM: s.put(x, a, 't')
    if st in 'ABD' and n_riv: rivets(s, CX - .5, CY - .5, 8.4, n_riv, 't', phase=math.pi / n_riv)
    dome(s, CX, CY, R_BOSS)
    if boss_gem:
        for (x, y), ch in (((9, 9), 'z'), ((10, 9), 'Z'), ((9, 10), 'Z'), ((10, 10), 'u')): s.put(x, y, ch)
    return s
def prof(pal):
    """옆면 색: 뒤 = 얼굴 그늘, 얼굴 가장자리 = 얼굴 빛, 테, 돌기"""
    return dict(PK=pal['c'], PF=pal['b'], PE=pal['E'], PO=pal['x'])

FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
IRON = dict(E='#767e8a', e='#aab2be', t='#f4f8ff', p='#ffffff', o='#c8d0dc', x='#8a929e', O='#5a626e', Q='#3a404a')
@frm('A', '세로 판자 세 장 · 쇠 테에 징 · 쇠 돌기. 가장 흔한 둥근 방패')
def fA():
    return frame('A'), dict(IRON, a='#e8b878', b='#c08a4a', c='#8a5a2c', A='#dcaa68', B='#b47e40', C='#7e5026', s='#5a3818')
@frm('B', '얼굴을 칠하고 둥근 띠를 둘렀다 · 쇠 테 징 여덟 · 쇠 돌기')
def fB():
    return frame('B'), dict(IRON, a='#6a8ae0', b='#4a6ac0', c='#2e4a90', d='#f0f0f4', D='#b8bcc8')
@frm('C', '판자 위에 가로 쇠띠 둘 · 띠 끝 징 · 쇠 테 · 쇠 돌기')
def fC():
    return frame('C'), dict(IRON, a='#d8a868', b='#a8743e', c='#74481e', A='#cc9c5c', B='#9c6a36', C='#6a401a', s='#4a2a10',
                            m='#b8c0cc', M='#6e7682')
@frm('D', '통쇠를 두들긴 원판 · 돋을 고리 · 금 테 · 보석 박은 돌기')
def fD():
    return frame('D', boss_gem=True), dict(a='#f4f8ff', b='#c8d2e2', c='#8e9ab0', d='#ffffff', D='#6e7a90',
                                           E='#d8a030', e='#fff0a0', t='#fff6c0', p='#fff6c0', o='#ffd860', x='#e8b030', O='#a87018', Q='#6a4410',
                                           z='#9ad8ff', Z='#2a7ae0', u='#123a8a')
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '나무 둥근 방패', '소나무 판자 세 장을 붙인 첫 방패. 쇠 테 · 쇠 돌기')
def r01():
    return frame('A'), dict(IRON, a='#f0cc8e', b='#d0a464', c='#9a6e3a', A='#e8c284', B='#c69a5a', C='#906434', s='#6a4420')
@make(10, 'B', '경비대 방패', '마을 경비대의 푸른 방패 · 흰 띠 · 쇠 테 징')
def r10():
    return frame('B'), dict(IRON, a='#6a8ae0', b='#4a6ac0', c='#2e4a90', d='#f0f0f4', D='#b8bcc8')
@make(20, 'C', '쇠띠 방패', '참나무 판자에 쇠띠 둘을 박았다 · 띠 끝 징')
def r20():
    return frame('C'), dict(IRON, a='#d8a868', b='#a8743e', c='#74481e', A='#cc9c5c', B='#9c6a36', C='#6a401a', s='#4a2a10',
                            m='#b8c0cc', M='#6e7682')
@make(30, 'D', '놋쇠 원판', '놋쇠를 두들긴 원판 · 돋을 고리 · 청동 테')
def r30():
    return frame('D'), dict(a='#fff0b0', b='#e8c060', c='#b08430', d='#fff8d8', D='#8a6420',
                            E='#a8642e', e='#e0a060', t='#ffe0a0', p='#fff8d8', o='#f0c860', x='#d0a040', O='#8a6420', Q='#5a3e12')
@make(40, 'C', '바다 약탈자 방패', '붉게 칠한 판자 · 검은 쇠띠 · 거친 쇠 돌기')
def r40():
    return frame('C'), dict(E='#5e626c', e='#9aa0aa', t='#c8ccd6', p='#e0e4ea', o='#9aa0aa', x='#6a6e78', O='#44484f', Q='#2a2c32',
                            a='#e8604e', b='#c03c2e', c='#86221c', A='#e0584a', B='#b83628', C='#7e1e18', s='#4a0e0c',
                            m='#5e626c', M='#2e3036')
@make(50, 'A', '자작나무 방패', '흰 자작나무 판자 · 검은 테 · 은 징')
def r50():
    return frame('A'), dict(E='#3e3a3a', e='#6a6464', t='#e8eef6', p='#ffffff', o='#d8dee8', x='#a8b0bc', O='#6a7280', Q='#3e4450',
                            a='#fbf6ea', b='#e6dcc6', c='#b8aa8c', A='#f4eedc', B='#dcd0b6', C='#ae9e80', s='#5a524a')
@make(60, 'D', '은빛 원판', '은을 입힌 원판 · 돋을 고리 · 은 테 · 푸른 보석 돌기')
def r60():
    return frame('D', boss_gem=True), dict(a='#ffffff', b='#dfe6f0', c='#a8b2c6', d='#ffffff', D='#7a849a',
                                           E='#c8d0dc', e='#ffffff', t='#ffffff', p='#ffffff', o='#e0e6f0', x='#b8c2d4', O='#7a849a', Q='#4a5266',
                                           z='#c8ecff', Z='#4a8ae0', u='#1a3a8a')
@make(70, 'B', '해 문양 방패', '노랗게 칠한 얼굴에 주황 띠 — 해를 닮았다 · 금 테')
def r70():
    return frame('B'), dict(a='#ffe070', b='#f0c040', c='#c08a20', d='#ff8a3a', D='#c0501a',
                            E='#d8a030', e='#fff0a0', t='#fff6c0', p='#fff6c0', o='#ffd860', x='#e8b030', O='#a87018', Q='#6a4410')
@make(80, 'B', '늑대 문양 방패', '잿빛 얼굴에 흰 띠 · 검은 쇠 테 · 은 징')
def r80():
    return frame('B'), dict(a='#a8acb4', b='#80848e', c='#555a64', d='#f4f6f8', D='#b8bcc4',
                            E='#3e4248', e='#6a6e76', t='#e8eef6', p='#ffffff', o='#d0d4da', x='#9aa0aa', O='#5e626c', Q='#34363c')
@make(90, 'D', '황금 원판', '금을 입힌 원판 · 돋을 고리 · 금 테 · 루비 돌기')
def r90():
    return frame('D', boss_gem=True), dict(a='#fffbd0', b='#ffd860', c='#c89a28', d='#fffbe8', D='#9a6e18',
                                           E='#b07818', e='#ffe890', t='#fffbd0', p='#fffbd0', o='#ffe070', x='#f0c040', O='#a87018', Q='#6a4410',
                                           z='#ffb0bc', Z='#e0283a', u='#8a1020')
@make(100, 'A', '흑단 방패', '검은 흑단 판자 · 은 테 · 은 징 · 은 돌기')
def r100():
    return frame('A'), dict(E='#c8d0dc', e='#ffffff', t='#ffffff', p='#ffffff', o='#e0e6f0', x='#b8c2d4', O='#7a849a', Q='#4a5266',
                            a='#6a5a6e', b='#4a3c50', c='#2e2434', A='#625266', B='#443648', C='#2a2030', s='#16101a')
@make(110, 'C', '용비늘 쇠띠 방패', '초록 비늘빛 판자에 금띠 둘 · 금 테 · 금 돌기')
def r110():
    return frame('C'), dict(E='#d8a030', e='#fff0a0', t='#fff6c0', p='#fff6c0', o='#ffd860', x='#e8b030', O='#a87018', Q='#6a4410',
                            a='#8ad870', b='#4aa83a', c='#22682a', A='#82d068', B='#44a034', C='#1e6026', s='#103a14',
                            m='#ffd860', M='#b88a20')
@make(120, 'A', '돌나무 방패', '돌처럼 굳은 나무 판자 · 호박빛 틈 · 쇠 테')
def r120():
    return frame('A'), dict(IRON, a='#c8c0b4', b='#9e968a', c='#6e685e', A='#bcb4a6', B='#928a7e', C='#645e54', s='#e0a040')
@make(130, 'C', '불씨 쇠띠 방패', '그을린 판자에 아직 달아오른 쇠띠 둘 · 검은 테')
def r130():
    return frame('C'), dict(E='#3e3434', e='#6a5a5a', t='#ffd070', p='#fff2b0', o='#ffb040', x='#ff7a1a', O='#c8401a', Q='#7a1a0c',
                            a='#6a5450', b='#4a3a38', c='#2e2422', A='#62504c', B='#443634', C='#2a201e', s='#1a1212',
                            m='#ffb040', M='#e0501a')
@make(140, 'B', '별하늘 방패', '밤하늘빛 얼굴에 별빛 띠 · 은 테 · 은 돌기')
def r140():
    s = frame('B')
    for (x, y) in ((5, 6), (14, 6), (4, 12), (15, 12), (9, 3), (10, 16)): s.put(x, y, 'S')
    return s, dict(a='#3e4ea0', b='#2a3478', c='#181e4e', d='#e8eeff', D='#9aa8e0', S='#ffe890',
                   E='#c8d0dc', e='#ffffff', t='#ffffff', p='#ffffff', o='#e0e6f0', x='#b8c2d4', O='#7a849a', Q='#4a5266')
@make(150, 'D', '영웅의 원판', '전설의 영웅이 든 흰 금빛 원판 · 금 테 · 사파이어 돌기 · 빛이 감돈다')
def r150():
    s = frame('D', boss_gem=True)
    s.fx.update({(1, 1): '1', (18, 3): '2', (2, 17): '2', (17, 18): '1'})
    return s, dict(a='#ffffff', b='#fff4d8', c='#e8cf98', d='#ffffff', D='#c8a050',
                   E='#d8a030', e='#fff0a0', t='#ffffff', p='#ffffff', o='#ffe8a0', x='#ffd860', O='#c08a20', Q='#7a5410',
                   z='#c8ecff', Z='#2a7ae0', u='#123a8a', **{'1': '#ffffff', '2': '#fff0a0'})

def norm(fn):
    r = fn()
    return (r[0], r[1]) if isinstance(r, tuple) else r
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, pal = norm(d['fn'])
        if s.sym_err(): print(d.get('lv', d.get('key')), 'sym', len(s.sym_err()))
        out.append((s.icon(pal).render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'rnd_frames.png', z=12)
    zoomsheet(out[4:12], 'rnd_z1.png', z=9)
    zoomsheet(out[12:], 'rnd_z2.png', z=9)
    print(Counter(d['st'] for d in G))
