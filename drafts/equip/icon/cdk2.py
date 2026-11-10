"""트럼프 카드 덱 — 사선 덱 확정판 (11-10 20:16 사용자 「다 적용」).
카드 긴 쪽이 무기 축(왼쪽 아래 → 오른쪽 위 45°)을 따라 눕고, 뒤 카드 두 장이 한 칸씩 아래로 비친다(두께 2칸).
꼭짓점 위 (11,1) · 오른쪽 (17,7) · 아래 (8,16) · 왼쪽 (2,10). 테·보석 띠는 카드를 따라 눕고, 안 그림은 알아보기 쉽게 똑바로 세운다.
원형(덱 4): A 종이 덱 · B 금박 덱(옆면 금) · C 쇠날 덱(쇠 테 · 모서리 번뜩임) · D 검은 덱(검은 카드 · 붉은 옆면)
앞면 4: F1 무늬 · F2 화려한 테(보석 띠) + 작은 무늬 · F3 큰 그림(카드 안을 바탕색으로 채움) · F4 화려한 테 + 그림
글자: 옆면 L(짧은 변 밑) D(긴 변 밑) — 둘째 장 l d · 테 e E · 종이 a · 모서리 무늬 m · 띠 q Q(점) Y(보석) · 그림 0~9 c h · 효과 * + ~"""
from sh import Sh
import cdt3
from cd import MOTIF
CARD, IN1, IN2, RIM, BAND = cdt3.CARD, cdt3.IN1, cdt3.IN2, cdt3.RIM, cdt3.BAND
BAND_GEM = {(11, 2), (16, 7), (8, 15), (3, 10), (7, 6), (12, 11)}          # 네 꼭짓점 + 긴 변 가운데
def base(s, fill=None):
    cdt3.stack(s, 2)
    for (x, y) in CARD:
        if (x, y) in RIM: s.put(x, y, 'e' if cdt3.lit(x, y) else 'E')
        else: s.put(x, y, fill or 'a')
def band(s):
    for (x, y) in BAND: s.put(x, y, 'Y' if (x, y) in BAND_GEM else ('Q' if x % 2 == 0 else 'q'))
def pips(s): s.put(11, 3, 'm'); s.put(8, 14, 'm')                       # 카드 왼쪽 위(화면 꼭대기) · 오른쪽 아래(화면 맨 아래) 모서리 무늬
def art(s, rows, ox, oy, keep=IN1):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            p = (ox + i, oy + j)
            if ch not in '. ' and p in keep: s.put(p[0], p[1], ch)
MOTIF5 = {
    'spade': ["..1..", ".131.", "13111", "11111", "11.11", "..1..", ".111."],
    'star':  ["..1..", "..1..", "13111", ".111.", ".1.1.", "1...1"],
}
ART = {   # 똑바로 선 그림 (화면 칸) — (ox, oy, 줄)
    'jack': (7, 3, ["....66.",        # 깃털 베레모 · 금 깃 · 검은 옷 · 금 어깨띠
                    "..hhh6.",
                    ".hhhhhh",
                    ".844448",
                    ".849498",
                    ".844548",
                    "..4444.",
                    "7777777",
                    "1117111",
                    "112171.",
                    ".1171.."]),
    'queen': (7, 3, ["...7.7.",       # 보석 왕관 · 늘어진 머리 · 금 목걸이 · 붉은 옷
                     "..76767",
                     ".877778",
                     "8844448",
                     "8849498",
                     "8844548",
                     "8844648",
                     ".87778.",
                     "1116111",
                     "121c121",
                     ".11211."]),
    'joker': (7, 4, ["...12..",       # 두 갈래 방울 모자 · 양옆 방울 · 흰 얼굴 · 붉은 웃음 · 주름 깃
                     ".611226",
                     "..1122.",
                     ".44444.",
                     ".49494.",
                     ".47774.",
                     "3333333",
                     "1113222",
                     ".11.22."]),
    'moon': (4, 3, ["......3..",      # 초승달 · 별 · 성 그림자 (남빛 밤하늘)
                    ".....77.3",
                    "....79...",
                    "...79..3.",
                    "3..79....",
                    "...79....",
                    "....79...",
                    ".....77..",
                    ".8.8..3..",
                    "8888.....",
                    "88888.88.",
                    "8888888.."]),
    'sun': (4, 3, ["....6.6..",       # 빛살 해 · 하늘 · 푸른 언덕
                   "...6...6.",
                   ".6..777..",
                   "...79977.",
                   "..677977.6",
                   "...77777.",
                   "....777..",
                   "..6...6..",
                   "......11.",
                   "..11.1111",
                   "1111111122",
                   "112222222"]),
    'skull': (6, 4, ["..1111..",      # 해골 · 엇갈린 뼈
                     ".131111.",
                     ".199199.",
                     ".199199.",
                     ".111911.",
                     "..1919..",
                     "3.....31",
                     ".31..13.",
                     "...33...",
                     ".31..13."]),
    'coins': (5, 3, [".....9...",     # 큰 금화 · 금화 더미 · 반짝임 (초록 노름판)
                     "....777..",
                     "...73337.",
                     "..7322227",
                     "..7327227",
                     "..7322227",
                     "...72227.",
                     "....777..",
                     ".333.333.",
                     ".777.777.",
                     ".222.222.",
                     "..777.77."]),
    'king': (8, 4, ["7.7.7",          # 왕관 · 흰 수염 (띠 안)
                    "76767",
                    "77777",
                    "84448",
                    "89498",
                    "84448",
                    "85558",
                    ".555."]),
    'key': (8, 4, ["..777",           # 구멍 뚫린 둥근 머리 · 곧은 대 · 이빨 둘 (남빛 바탕)
                   "..737",
                   "..777",
                   "..7..",
                   "..7..",
                   "..7..",
                   ".77..",
                   "..7..",
                   "777.."]),
    'gem': (8, 5, [".111.",           # 깎은 보석
                   "13931",
                   "11111",
                   ".112.",
                   "..2.."]),
    'crown': (8, 5, ["7.7.7",         # 보석 왕관 · 붉은 방석
                     "73737",
                     "77777",
                     "22222",
                     "66666",
                     ".555."]),
}
def F1(s, motif): base(s); pips(s); art(s, MOTIF[motif], 6, 5)
def F2(s, motif): base(s); band(s); g = MOTIF5[motif]; art(s, g, 8, 5 + (7 - len(g)) // 2, keep=IN2)
def F3(s, what, fill=None): base(s, fill); ox, oy, g = ART[what]; art(s, g, ox, oy)
def F4(s, what, fill=None):
    base(s); band(s)
    if fill:
        for p in IN2: s.put(p[0], p[1], fill)
    ox, oy, g = ART[what]; art(s, g, ox, oy, keep=IN2)
DECK = {'A': '종이 덱', 'B': '금박 덱', 'C': '쇠날 덱', 'D': '검은 덱'}
FACEN = {'F1': '무늬', 'F2': '화려한 테', 'F3': '큰 그림', 'F4': '화려한 테 + 그림'}
PAPER = dict(L='#efe6d2', l='#9a8e76', D='#b8ac94', d='#6e6450', e='#d0c8bc', E='#8a8278', a='#fbf8f0', m='#2a2630')
GILT = dict(L='#ffe890', l='#c89028', D='#d8a838', d='#8a5a10', e='#f0c860', E='#a87018', a='#fffbea', m='#a87018')
STEELD = dict(L='#f4f8ff', l='#8a94a8', D='#b0b8c6', d='#4e5870', e='#ffffff', E='#6a7690', a='#f4f7fb', m='#4e5870', **{'*': '#ffffff', '+': '#c8dcff'})
BLACK = dict(L='#a8323e', l='#5a1a24', D='#6a1a24', d='#2a0c12', e='#5a5464', E='#1e1a24', a='#2e2a36', m='#d8d0e0')
ORN = dict(q='#8a1a2a', Q='#f0c040', Y='#ff4a5a')
RED = {'1': '#d8302e', '2': '#8a1a1a', '3': '#ff9a8a'}
BLK = {'1': '#2a2630', '2': '#14121a', '3': '#8a8494'}
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
def deck(st, fn, *a, fx=None, **kw):
    s = Sh(); fn(s, *a, **kw)
    if st == 'C': s.fx.update({(12, 0): '*', (13, 1): '+', (11, 0): '+'})        # 쇠날 번뜩임 (꼭대기 모서리)
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
@make(40, 'A', 'F3', '검은 잭', '깃털 베레모를 쓴 잭 · 금 깃 · 금 어깨띠')
def c40(): return deck('A', F3, 'jack'), M(PAPER, h='#2a2630', **{'3': '#6a6478', '6': '#d8302e', '8': '#5a3a22', '4': '#f4d0b0', '5': '#d8a888', '9': '#2a2630',
                                                                     '7': '#f0c040', '1': '#2a2630', '2': '#4a4452'})
@make(50, 'B', 'F3', '붉은 퀸', '보석 왕관을 쓴 하트 여왕 · 늘어진 머리 · 금 목걸이')
def c50(): return deck('B', F3, 'queen'), M(GILT, {'7': '#f0c040', '6': '#e0283a', '8': '#8a4a1a', '4': '#f8dcc0', '5': '#e0b090', '9': '#3a2630',
                                                     '1': '#d8302e', '2': '#8a1a1a', 'c': '#ffd0d8'})
@make(60, 'C', 'F4', '왕의 카드', '보석 띠 테 안의 킹 · 흰 수염')
def c60(): return deck('C', F4, 'king'), M(STEELD, ORN, {'7': '#f0c040', '6': '#e0283a', '8': '#e8e0d0', '4': '#f4d0b0', '9': '#2a2630', '5': '#d8d0c0'})
@make(70, 'D', 'F3', '조커', '무엇이든 될 수 있는 한 장 · 방울 모자 광대')
def c70(): return deck('D', F3, 'joker'), M(BLACK, {'6': '#f0c040', '1': '#a040b8', '2': '#3ab848', '4': '#f8f4ec', '9': '#2a2630', '3': '#e8e0f0', '7': '#e0283a'})
@make(80, 'A', 'F3', '달의 카드', '남빛 밤하늘에 초승달 · 별 · 성 그림자')
def c80(): return deck('A', F3, 'moon', fill='0'), M(PAPER, {'0': '#26307a', '3': '#fffbd0', '7': '#f0c040', '9': '#fff2a0', '8': '#121640'})
@make(90, 'B', 'F3', '해의 카드', '빛살 해가 푸른 언덕 위에 떴다')
def c90(): return deck('B', F3, 'sun', fill='0'), M(GILT, {'0': '#9ad4ff', '6': '#ffe070', '7': '#ff9a2a', '9': '#fff2a0', '1': '#5ab848', '2': '#2e7a34'})
@make(100, 'C', 'F2', '별의 카드', '보석 띠 테 안에 소원을 비는 별')
def c100(): return deck('C', F2, 'star'), M(STEELD, ORN, {'1': '#4a6ad8', '2': '#22346a', '3': '#c8d8ff'}, q='#22346a', Y='#8ac8ff')
@make(110, 'D', 'F3', '해골 카드', '죽음을 부르는 한 장 · 엇갈린 뼈')
def c110(): return deck('D', F3, 'skull'), M(BLACK, {'1': '#e8e0d0', '3': '#a89c88', '9': '#14121a'})
@make(120, 'A', 'F4', '열쇠 카드', '보석 띠 테 안에 어떤 문이든 여는 금 열쇠')
def c120(): return deck('A', F4, 'key', fill='0'), M(PAPER, ORN, {'0': '#22346a', '7': '#f0c040', '3': '#22346a'})
@make(130, 'B', 'F4', '보석 카드', '보석 띠 테 안에 큼직한 보석')
def c130(): return deck('B', F4, 'gem'), M(GILT, ORN, {'1': '#3ac0d8', '2': '#1a5a8a', '3': '#d8faff', '9': '#ffffff'}, q='#1a5a8a', Y='#8af0ff')
@make(140, 'C', 'F3', '금화 카드', '초록 노름판 위 큰 금화 · 금화 더미')
def c140(): return deck('C', F3, 'coins', fill='0'), M(STEELD, {'0': '#2e6a3a', '7': '#f0c040', '3': '#fff2a0', '2': '#a87018', '9': '#ffffff'})
@make(150, 'D', 'F4', '세기의 한 패', '대도가 마지막에 꺼내는 검은 덱 · 보석 띠 테 · 왕관 · 금빛이 감돈다')
def c150():
    s = deck('D', F4, 'crown', fx={(1, 6): '~', (18, 11): '~', (5, 2): '*', (15, 15): '*'})
    return s, M(BLACK, ORN, {'7': '#f0c040', '6': '#c8283a', '5': '#8a1424', '3': '#e0283a', '2': '#a87018', '~': '#fff0a0', '*': '#ffffff'},
                q='#3a0a14', L='#f0c040', l='#a87018', D='#a87018', d='#5a3a08')
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
if __name__ == '__main__':
    from zoomv import zoomsheet
    zoomsheet([(icon(d).render(), d['key']) for d in FR], 'cdk2_frames.png', z=10)
    out = [(icon(d).render(), str(d['lv'])) for d in G]
    zoomsheet(out[:8], 'cdk2_z1.png', z=9); zoomsheet(out[8:], 'cdk2_z2.png', z=9)
