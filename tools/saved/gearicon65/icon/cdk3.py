"""트럼프 카드 덱 — 사선 덱 + 눕힌 그림 (11-10 20:38 사용자: 「트럼프 카드 그림 같이 사선으로 가야지」).
카드 · 테 · 보석 띠(cdk2)는 그대로, 안 그림도 카드와 같이 45° 눕힌다(그림 위쪽 = 화면 오른쪽 위).
눕히는 길: tilt(격자 한 칸 → 화면 한 칸 + 사이 칸 채움 — 무늬 · 얼굴) · cprim(카드 좌표 모양 — 달 · 열쇠) · rotsprite(해 · 금화 · 보석)."""
from sh import Sh
import cdt3, cdk2, cart, rot45
from tilt import tilt
import cprim as P
from cdk2 import M, PAPER, GILT, STEELD, BLACK, ORN, RED, BLK, DECK, FACEN
I1, I2 = cdt3.IN1, cdt3.IN2
def T(s, rows, keep, strict=False, cu=0):
    for p, ch in tilt(rows, cu=cu, keep=keep, strict=strict).items(): s.put(p[0], p[1], ch)
FACES = {   # 바로 선 격자 (tilt로 눕힘)
    'jack': ["..66.", "hhhh6", "h444h", "49494", ".444.", "77777", "11711"],
    'queen': [".7.7.", "76767", "84448", "89498", "84648", "87778", "11611"],
    'king': ["7.7.7", "76767", "84448", "89498", "85558", ".555."],
    'joker': [".6...6.", ".11.22.", "..1122.", ".44444.", ".49494.", ".47774.", "3131313", "..1.2.."],
    'skull': ["..111..", ".11111.", "1911191", "1991991", "1111111", ".11911.", ".1.1.1."],
    'crown': ["7..7..7", "77.7.77", "7777777", "7373737", "7777777", ".66666.", "6666666"],
    'spade5': ["..1..", ".131.", "11111", "11111", "..1..", ".111."],
}
def F1(s, suit): cdk2.base(s); cdk2.pips(s); cart.SUIT[suit](s, keep=I1)
def F2(s, suit):
    cdk2.base(s); cdk2.band(s)
    if suit == 'spade': T(s, ["..1..", ".111.", "11111", "11.11", "..1..", ".111."], I2, strict=True)
    else: cart.SUIT[suit](s, keep=I2)
def F3(s, what, fill=None):
    cdk2.base(s, fill)
    if what in ('jack', 'queen', 'joker', 'skull', 'crown'): T(s, FACES[what], I1, strict=what in ('joker', 'skull', 'crown'))
    else: cart.ART[what](s, keep=I1)
def F4(s, what):
    cdk2.base(s); cdk2.band(s)
    if what == 'king': T(s, FACES['king'], I2)
    else: cart.ART[what](s, keep=I2)
def deck(st, fn, *a, fx=None, **kw):
    s = Sh(); fn(s, *a, **kw)
    if st == 'C': s.fx.update({(12, 0): '*', (13, 1): '+', (11, 0): '+'})
    if fx: s.fx.update(fx)
    return s
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
@frm('A', '흰 종이 카드 한 벌 · 아래로 카드 두 장이 비친다')
def fA(): return deck('A', F1, 'spade'), M(PAPER, BLK)
@frm('B', '옆면에 금박을 입힌 카드 한 벌 · 금 테')
def fB(): return deck('B', F1, 'heart'), M(GILT, RED)
@frm('C', '쇠 테를 두른 카드 한 벌 — 던지면 벤다 · 모서리가 번뜩인다')
def fC(): return deck('C', F1, 'diamond'), M(STEELD, RED)
@frm('D', '검은 카드 한 벌 · 붉은 옆면 · 무늬는 밝게')
def fD(): return deck('D', F1, 'club'), M(BLACK, {'1': '#e8e0f0', '2': '#a89cb8', '3': '#ffffff'})
G = []
def make(lv, st, face, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, face=face, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', 'F1', '낡은 클로버 패', '모서리가 닳은 종이 카드 한 벌 · 맨 위는 클로버')
def c01(): return deck('A', F1, 'club'), M(PAPER, BLK, a='#efe6d0', L='#e2d6bc')
@make(10, 'B', 'F1', '노름꾼의 다이아', '노름판에서 딴 금박 카드 한 벌 · 다이아 패')
def c10(): return deck('B', F1, 'diamond'), M(GILT, RED)
@make(20, 'C', 'F1', '날 선 하트', '쇠 테 두른 카드 한 벌 · 던지면 벤다')
def c20(): return deck('C', F1, 'heart'), M(STEELD, RED)
@make(30, 'D', 'F2', '스페이드 에이스', '검은 카드 한 벌 · 보석 띠 테 안에 은빛 스페이드')
def c30(): return deck('D', F2, 'spade'), M(BLACK, ORN, {'1': '#e8eef6', '2': '#8a94a8', '3': '#ffffff'})
@make(40, 'A', 'F3', '검은 잭', '깃털 베레모를 쓴 잭 · 금 깃')
def c40(): return deck('A', F3, 'jack'), M(PAPER, h='#2a2630', **{'6': '#d8302e', '4': '#f4d0b0', '9': '#2a2630', '7': '#f0c040', '1': '#2a2630'})
@make(50, 'B', 'F3', '붉은 퀸', '보석 왕관을 쓴 하트 여왕 · 늘어진 머리 · 금 목걸이')
def c50(): return deck('B', F3, 'queen'), M(GILT, {'7': '#f0c040', '6': '#e0283a', '8': '#8a4a1a', '4': '#f8dcc0', '9': '#3a2630', '1': '#d8302e'})
@make(60, 'C', 'F4', '왕의 카드', '보석 띠 테 안의 킹 · 흰 수염')
def c60(): return deck('C', F4, 'king'), M(STEELD, ORN, {'7': '#f0c040', '6': '#e0283a', '8': '#e8e0d0', '4': '#f4d0b0', '9': '#2a2630', '5': '#d8d0c0'})
@make(70, 'D', 'F3', '조커', '무엇이든 될 수 있는 한 장 · 방울 모자 광대')
def c70(): return deck('D', F3, 'joker'), M(BLACK, {'6': '#f0c040', '1': '#a040b8', '2': '#3ab848', '4': '#f8f4ec', '9': '#2a2630', '3': '#e8e0f0', '7': '#e0283a'})
@make(80, 'A', 'F3', '달의 카드', '남빛 밤하늘에 초승달 · 별 · 언덕 그림자')
def c80(): return deck('A', F3, 'moon'), M(PAPER, {'0': '#26307a', '3': '#fffbd0', '7': '#f0c040', '9': '#fff2a0', '8': '#121640'})
@make(90, 'B', 'F3', '해의 카드', '빛살 해가 푸른 언덕 위에 떴다')
def c90(): return deck('B', F3, 'sun', fill='0'), M(GILT, {'0': '#9ad4ff', '6': '#ffe070', '7': '#ff9a2a', '9': '#fff2a0', '1': '#5ab848', '2': '#2e7a34'})
@make(100, 'C', 'F2', '별의 카드', '보석 띠 테 안에 소원을 비는 별')
def c100(): return deck('C', F2, 'star'), M(STEELD, ORN, {'1': '#4a6ad8', '2': '#22346a', '3': '#c8d8ff'}, q='#22346a', Y='#8ac8ff')
@make(110, 'D', 'F3', '해골 카드', '죽음을 부르는 한 장 · 해골')
def c110(): return deck('D', F3, 'skull'), M(BLACK, {'1': '#e8e0d0', '3': '#a89c88', '9': '#14121a'})
@make(120, 'A', 'F4', '열쇠 카드', '보석 띠 테 안에 어떤 문이든 여는 금 열쇠')
def c120(): return deck('A', F4, 'key'), M(PAPER, ORN, {'0': '#22346a', '7': '#f0c040', '3': '#22346a'})
@make(130, 'B', 'F4', '보석 카드', '보석 띠 테 안에 큼직한 보석')
def c130(): return deck('B', F4, 'gem'), M(GILT, ORN, {'1': '#3ac0d8', '2': '#1a5a8a', '3': '#d8faff', '9': '#ffffff'}, q='#1a5a8a', Y='#8af0ff')
@make(140, 'C', 'F3', '금화 카드', '초록 노름판 위 큰 금화 · 금화 더미')
def c140(): return deck('C', F3, 'coins', fill='0'), M(STEELD, {'0': '#2e6a3a', '7': '#f0c040', '3': '#fff2a0', '2': '#a87018', '9': '#ffffff'})
@make(150, 'D', 'F3', '세기의 한 패', '대도가 마지막에 꺼내는 검은 덱 · 루비 박힌 금관 · 금빛이 감돈다')
def c150():
    s = deck('D', F3, 'crown', fx={(1, 6): '~', (18, 11): '~', (5, 2): '*', (15, 15): '*'})
    return s, M(BLACK, {'7': '#f0c040', '6': '#c8283a', '3': '#e0283a', '~': '#fff0a0', '*': '#ffffff'}, L='#f0c040', l='#a87018', D='#a87018', d='#5a3a08')
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = [(icon(d).render(), str(d['lv'])) for d in G]
    zoomsheet(out[:8], 'cdk3_z1.png', z=9); zoomsheet(out[8:], 'cdk3_z2.png', z=9)
    zoomsheet([(icon(d).render(), d['key']) for d in FR], 'cdk3_frames.png', z=10)
