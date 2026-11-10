"""트럼프 카드 덱 — 소매치기 · 대도의 무기 (11-10 19:18 사용자: 입체 · 사선 · 한 벌이 두껍게).
앞 카드는 똑바로 세워 그림이 읽히게(11×14), 뒤 카드 4장이 왼쪽 아래로 한 칸씩 물러나며 쌓여 두께가 보인다(사선 덱).
  왼쪽 면 = 카드 옆면(빛) · 아래 면 = 카드 아랫면(그늘) · 한 장마다 줄무늬(카드 · 틈)
원형(덱 4): A 종이 덱 · B 금박 덱(옆면 금) · C 쇠날 덱(쇠 테 · 번뜩임) · D 검은 덱(검은 카드 · 붉은 옆면)
앞면 4: F1 무늬(가운데 7×7 · 모서리 무늬) · F2 화려한 테(보석 띠 · 금줄 · 작은 무늬) · F3 큰 그림(9×12) · F4 화려한 테 + 그림(7×10)
예전 한 장 · 세 장 그림(cd.py)은 스킬 그림으로 돌린다.
글자: 옆면 L l(왼쪽: 카드 · 틈) D d(아래) · 앞 테 e E · 종이 a b · 모서리 무늬 m · 화려한 테 q(띠) Q(띠 점) Y(보석) g G(금줄)
      그림 0~9 (그림마다 뜻이 다름) · 효과 * + ~"""
from sh import Sh
from cd import MOTIF
X0, Y0, W, H, NL = 7, 1, 11, 14, 4                 # 앞 카드 자리 · 뒤 카드 수
def rr(x, y, x0, y0, w, h):
    if not (x0 <= x < x0 + w and y0 <= y < y0 + h): return False
    return not ((x in (x0, x0 + w - 1)) and (y in (y0, y0 + h - 1)))
def stack(s, n=NL):
    for k in range(n, 0, -1):
        ax, ay = X0 - k, Y0 + k
        g = 'l' if k % 2 else 'L'; G = 'd' if k % 2 else 'D'
        for y in range(ay, ay + H):
            for x in range(ax, ax + W):
                if rr(x, y, ax, ay, W, H): s.put(x, y, G if y == ay + H - 1 else g)
def F(s, i, j, ch):
    """앞 카드 안 칸 (i 0..10 · j 0..13)"""
    if ch and ch not in '. ': s.put(X0 + i, Y0 + j, ch)
def base(s):
    for j in range(H):
        for i in range(W):
            if not rr(i, j, 0, 0, W, H): continue
            if i in (0, W - 1) or j in (0, H - 1): F(s, i, j, 'e' if (i == 0 or j == 0) else 'E')
            else: F(s, i, j, 'b' if (i == W - 2 or j == H - 2) else 'a')
def grid(s, rows, i0, j0):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r.replace(' ', '')): F(s, i0 + i, j0 + j, ch)
def band(s, ring=1, side_gem=True):
    """화려한 테: 바깥 테 안쪽 한 줄 = 보석 띠(모서리 보석 Y · 띠 점 Q) — 위아래 띠 점 3 · 4 · 7, 옆 띠 점 3 · 5 · 8 · 10 + 가운데 보석"""
    a, b = ring, W - 1 - ring; c, d = ring, H - 1 - ring
    for i in range(a, b + 1):
        for j in (c, d): F(s, i, j, 'Y' if i in (a, b) else ('Q' if (i - a) in (2, 4, 6) else 'q'))
    for j in range(c + 1, d):
        for i in (a, b):
            if side_gem and j in (6, 7): ch = 'Y'
            else: ch = 'Q' if j in (3, 5, 8, 10) else 'q'
            F(s, i, j, ch)
def gold_line(s, ring=2):
    a, b = ring, W - 1 - ring; c, d = ring, H - 1 - ring
    for i in range(a, b + 1):
        F(s, i, c, 'g'); F(s, i, d, 'G')
    for j in range(c, d + 1):
        F(s, a, j, 'g' if j < d else 'G'); F(s, b, j, 'G')
def face_plain(s, motif):
    base(s); grid(s, MOTIF[motif], 2, 3)
    F(s, 1, 1, 'm'); F(s, 1, 2, 'm'); F(s, W - 2, H - 2, 'm'); F(s, W - 2, H - 3, 'm')
def face_ornate(s, motif5):
    g = MOTIF5[motif5]; base(s); band(s); gold_line(s); grid(s, g, 3, 3 + (8 - len(g)) // 2)
def face_art(s, art):
    base(s); grid(s, ART9[art], 1, 1)
def face_ornate_art(s, art):
    base(s); band(s, side_gem=False); grid(s, ART7[art], 2, 2)
MOTIF5 = {   # 5칸 너비 · 7~8줄 (F2 가운데 작은 무늬, 안쪽 5×8 칸 j 3..10)
    'spade': ["..1..", "..3..", ".131.", "13111", "11111", "11.11", "..1..", ".111."],   # 8줄: 뾰족한 끝 · 두 잎 · 자루
    'star':  ["..1..", "..1..", ".131.", "13331", ".131.", "..1..", "..1.."],      # 반짝이는 네 갈래 별 (소원 별)
}
ART9 = {     # 9×12 큰 그림 (F3). '.' = 카드 바탕
    'jack': [   # 깃털 꽂은 베레모 · 금 깃 · 검은 옷 · 금 어깨띠
        "......66.",
        "..hhhh6..",
        ".hh3hhhh.",
        "..84448..",
        "..89498..",
        "..84548..",
        "...444...",
        ".7777777.",
        "117111711",
        "121117121",
        "121171121",
        "111711111"],
    'queen': [  # 보석 왕관 · 늘어진 머리 · 금 목걸이 · 붉은 옷
        "..7.7.7..",
        "..76767..",
        ".8777778.",
        ".8444448.",
        "884949488",
        "884454488",
        "884464488",
        "888444888",
        "817777718",
        "111767111",
        "1211c1121",
        "121111121"],
    'joker': [  # 두 갈래 방울 모자 · 흰 얼굴 · 붉은 웃음 · 주름 깃
        "6.......6",
        "11.....22",
        ".11...22.",
        "..11122..",
        "..44444..",
        "..49494..",
        "..44444..",
        "..47774..",
        ".3344433.",
        "313333323",
        "111333222",
        "1113.3222"],
    'moon': [   # 남빛 밤하늘 · 큰 초승달 · 별 · 성 그림자
        "000000000",
        "030077000",
        "000790003",
        "007900000",
        "007900000",
        "007900030",
        "000790000",
        "300077000",
        "000000000",
        "080800000",
        "088800080",
        "888888888"],
    'sun': [    # 하늘 · 빛살 해 · 푸른 언덕
        "006000600",
        "000777000",
        "067797760",
        "007799700",
        "067777760",
        "000777000",
        "006000600",
        "000000000",
        "000001100",
        "011111111",
        "112211122",
        "222222222"],
    'skull': [  # 검은 바탕 · 해골 · 엇갈린 뼈 · 양옆 촛불
        "6.......6",
        "7.11111.7",
        "711111117",
        "719919917",
        "719919917",
        "711191117",
        "8.11111.8",
        "..19191..",
        "13.....31",
        ".113.311.",
        "...131...",
        ".113.311."],
    'coins': [  # 초록 노름판 위 큰 금화(네모 새김) · 아래 양쪽 금화 더미 · 반짝임
        "000000090",
        "000777000",
        "007333700",
        "073333770",
        "733222772",
        "737272772",
        "737222722",
        "077777220",
        "007722200",
        "900222000",
        "333000333",
        "727000727"],
}
ART7 = {     # 7×10 그림 (F4: 보석 띠 안)
    'king': [   # 왕관 · 흰 수염 · 붉은 망토 · 금 깃
        "7.7.7.7",
        "7676767",
        "7777777",
        "8444448",
        "8494948",
        "8444448",
        "8855588",
        "1885881",
        "1177711",
        "1217121"],
    'key': [    # 구멍 뚫린 둥근 머리 · 붉은 매듭 · 긴 대 · 이빨 둘
        "..777..",
        ".73337.",
        "73...27",
        "73...27",
        ".72227.",
        "..767..",
        "...7...",
        "...777.",
        "...7...",
        "...77.."],
    'gem': [    # 깎은 보석 · 빛살
        "6..6..6",
        ".6...6.",
        ".11111.",
        "1393931",
        "1111111",
        ".11112.",
        "..112..",
        "...2...",
        ".6...6.",
        "6..6..6"],
    'crown': [  # 보석 왕관 · 붉은 방석
        "...9...",
        "7..7..7",
        "77.7.77",
        "7737377",
        "7777777",
        "7373737",
        "2222222",
        "6666666",
        "6555556",
        ".66666."],
}
for _k, _g in ART9.items(): assert len(_g) == 12 and all(len(r) == 9 for r in _g), _k
for _k, _g in ART7.items(): assert len(_g) == 10 and all(len(r) == 7 for r in _g), _k
FACE = {'F1': face_plain, 'F2': face_ornate, 'F3': face_art, 'F4': face_ornate_art}
DECK = {'A': '종이 덱', 'B': '금박 덱', 'C': '쇠날 덱', 'D': '검은 덱'}
FACEN = {'F1': '무늬', 'F2': '화려한 테', 'F3': '큰 그림', 'F4': '화려한 테 + 그림'}
PAPER = dict(L='#efe6d2', l='#b8ac94', D='#a89c84', d='#6e6450', e='#d0c8bc', E='#8a8278', a='#fbf8f0', b='#e2dacb', m='#2a2630')
GILT = dict(L='#ffe890', l='#c89028', D='#d8a838', d='#8a5a10', e='#f0c860', E='#a87018', a='#fffbea', b='#efe4c4', m='#a87018')
STEELD = dict(L='#f4f8ff', l='#8a94a8', D='#b0b8c6', d='#4e5870', e='#ffffff', E='#6a7690', a='#f4f7fb', b='#dde3ec', m='#4e5870', **{'*': '#ffffff', '+': '#c8dcff'})
BLACK = dict(L='#a8323e', l='#2a2630', D='#6a1a24', d='#16121a', e='#5a5464', E='#1e1a24', a='#2e2a36', b='#26222e', m='#d8d0e0')
DECKPAL = {'A': PAPER, 'B': GILT, 'C': STEELD, 'D': BLACK}
ORN = dict(q='#8a1a2a', Q='#f0c040', Y='#ff4a5a', g='#f0c040', G='#a87018')
def deck(st, face, what, fx=None):
    s = Sh(); stack(s); FACE[face](s, what)
    if st == 'C': s.fx.update({(18, 0): '*', (17, 0): '+', (19, 1): '+'})          # 쇠날 번뜩임 (오른쪽 위 모서리)
    if fx: s.fx.update(fx)
    return s
def M(*ds, **kw):
    r = {}
    for d in ds: r.update(d)
    r.update(kw); return r
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
BLK7 = {'1': '#2a2630', '2': '#14121a', '3': '#8a8494'}
RED7 = {'1': '#d8302e', '2': '#8a1a1a', '3': '#ff9a8a'}
@frm('A', '흰 종이 카드 한 벌 · 옆면에 카드 결이 줄무늬로 보인다')
def fA(): return deck('A', 'F1', 'spade'), dict(PAPER, **BLK7)
@frm('B', '옆면에 금박을 입힌 카드 한 벌 · 금 테')
def fB(): return deck('B', 'F1', 'heart'), dict(GILT, **RED7)
@frm('C', '쇠 테를 두른 카드 한 벌 — 던지면 벤다 · 모서리가 번뜩인다')
def fC(): return deck('C', 'F1', 'diamond'), dict(STEELD, **RED7)
@frm('D', '검은 카드 한 벌 · 붉은 옆면 · 무늬는 밝게')
def fD(): return deck('D', 'F1', 'club'), dict(BLACK, **{'1': '#e8e0f0', '2': '#a89cb8', '3': '#ffffff'})
G = []
def make(lv, st, face, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, face=face, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', 'F1', '낡은 클로버 패', '모서리가 닳은 종이 카드 한 벌 · 맨 위는 클로버')
def c01(): return deck('A', 'F1', 'club'), dict(PAPER, a='#efe6d0', b='#d8ccb0', L='#e2d6bc', **BLK7)
@make(10, 'B', 'F1', '노름꾼의 다이아', '노름판에서 딴 금박 카드 한 벌 · 다이아 패')
def c10(): return deck('B', 'F1', 'diamond'), dict(GILT, **RED7)
@make(20, 'C', 'F1', '날 선 하트', '쇠 테 두른 카드 한 벌 · 던지면 벤다')
def c20(): return deck('C', 'F1', 'heart'), dict(STEELD, **RED7)
@make(30, 'D', 'F2', '스페이드 에이스', '검은 카드 한 벌 · 보석 띠 테 안에 은빛 스페이드')
def c30(): return deck('D', 'F2', 'spade'), dict(BLACK, **ORN, **{'1': '#e8eef6', '2': '#8a94a8', '3': '#ffffff'})
@make(40, 'A', 'F3', '검은 잭', '깃털 베레모를 쓴 잭 · 금 깃 · 금 어깨띠')
def c40(): return deck('A', 'F3', 'jack'), dict(PAPER, h='#2a2630', **{'3': '#6a6478', '6': '#d8302e', '8': '#5a3a22', '4': '#f4d0b0', '5': '#d8a888', '9': '#2a2630',
                                                 '7': '#f0c040', '1': '#2a2630', '2': '#4a4452', 'c': '#c8d0dc'})
@make(50, 'B', 'F3', '붉은 퀸', '보석 왕관을 쓴 하트 여왕 · 늘어진 머리 · 금 목걸이')
def c50(): return deck('B', 'F3', 'queen'), dict(GILT, **{'7': '#f0c040', '6': '#e0283a', '8': '#8a4a1a', '4': '#f8dcc0', '5': '#e0b090', '9': '#3a2630',
                                                   '1': '#d8302e', '2': '#8a1a1a', 'c': '#ffd0d8'})
@make(60, 'C', 'F4', '왕의 카드', '보석 띠 테 안의 킹 · 수염 · 붉은 망토')
def c60(): return deck('C', 'F4', 'king'), dict(STEELD, **ORN, **{'7': '#f0c040', '6': '#e0283a', '8': '#e8e0d0', '4': '#f4d0b0', '9': '#2a2630', '5': '#c8c0b0',
                                                   '1': '#c8303a', '2': '#8a1a24'})
@make(70, 'D', 'F3', '조커', '무엇이든 될 수 있는 한 장 · 방울 모자 광대')
def c70(): return deck('D', 'F3', 'joker'), dict(BLACK, **{'6': '#f0c040', '1': '#a040b8', '2': '#3ab848', '4': '#f8f4ec', '9': '#2a2630', '3': '#e8e0f0', '7': '#e0283a'})
@make(80, 'A', 'F3', '달의 카드', '남빛 밤하늘에 초승달 · 별 · 성 그림자')
def c80(): return deck('A', 'F3', 'moon'), dict(PAPER, **{'0': '#26307a', '3': '#fffbd0', '7': '#f0c040', '9': '#fff2a0', '8': '#121640'})
@make(90, 'B', 'F3', '해의 카드', '빛살 해가 푸른 언덕 위에 떴다')
def c90(): return deck('B', 'F3', 'sun'), dict(GILT, **{'0': '#9ad4ff', '6': '#ffe070', '7': '#ff9a2a', '9': '#fff2a0', '1': '#5ab848', '2': '#2e7a34'})
@make(100, 'C', 'F2', '별의 카드', '보석 띠 테 안에 소원을 비는 별')
def c100(): return deck('C', 'F2', 'star'), M(STEELD, ORN, {'1': '#4a6ad8', '2': '#22346a', '3': '#c8d8ff'}, q='#22346a', Y='#8ac8ff')
@make(110, 'D', 'F3', '해골 카드', '죽음을 부르는 한 장 · 엇갈린 뼈 · 촛불')
def c110(): return deck('D', 'F3', 'skull'), dict(BLACK, **{'1': '#e8e0d0', '3': '#a89c88', '9': '#14121a', '8': '#8a7a5a', '7': '#f0e0c0', '6': '#ffb040'})
@make(120, 'A', 'F4', '열쇠 카드', '보석 띠 테 안에 어떤 문이든 여는 금 열쇠 · 붉은 매듭')
def c120(): return deck('A', 'F4', 'key'), dict(PAPER, **ORN, **{'7': '#f0c040', '3': '#fff2a0', '2': '#a87018', '6': '#d8302e'})
@make(130, 'B', 'F4', '보석 카드', '보석 띠 테 안에 큼직한 보석 · 빛살')
def c130(): return deck('B', 'F4', 'gem'), M(GILT, ORN, {'1': '#3ac0d8', '2': '#1a5a8a', '3': '#d8faff', '9': '#ffffff', '6': '#ffe070'}, q='#1a5a8a', Y='#8af0ff')
@make(140, 'C', 'F3', '금화 카드', '초록 노름판 위 큰 금화 · 양쪽에 금화 더미')
def c140(): return deck('C', 'F3', 'coins'), dict(STEELD, **{'0': '#2e6a3a', '7': '#f0c040', '3': '#fff2a0', '2': '#a87018', '9': '#ffffff'})
@make(150, 'D', 'F4', '세기의 한 패', '대도가 마지막에 꺼내는 검은 덱 · 보석 띠 테 · 왕관 · 금빛이 감돈다')
def c150():
    s = deck('D', 'F4', 'crown', fx={(1, 3): '~', (19, 9): '~', (3, 0): '*'})
    return s, M(BLACK, ORN, {'7': '#f0c040', '6': '#c8283a', '5': '#8a1424', '3': '#e0283a', '2': '#a87018', '9': '#ffffff', '~': '#fff0a0', '*': '#ffffff'},
                q='#3a0a14', L='#f0c040', D='#a87018')
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
if __name__ == '__main__':
    from zoomv import zoomsheet
    zoomsheet([(icon(d).render(), d['key']) for d in FR], 'cdk_frames.png', z=10)
    out = [(icon(d).render(), str(d['lv'])) for d in G]
    zoomsheet(out[:8], 'cdk_z1.png', z=9); zoomsheet(out[8:], 'cdk_z2.png', z=9)
