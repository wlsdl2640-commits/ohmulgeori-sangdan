"""트럼프 카드 — 소매치기(?) · 대도의 무기. 원형 시안 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩), 카드 속 그림이 다 다르다.
  A 한 장: 세운 카드 한 장 · 가운데 그림 · 두 모서리 무늬
  B 세 장: 부채처럼 편 세 장 (뒤 두 장은 뒷면 무늬)
  C 날 선 카드: 쇠 테를 두른 카드 (던지면 벤다)
  D 두 장: 뒷면이 보이는 카드 위에 앞면 카드
글자: 카드 테 E e · 얼굴 a b(그늘) · 뒷면 k K · 그림 1(주색) 2(그늘/둘째 색) 3(빛) · 모서리 무늬 m"""
from sh import Sh
from wic import N
MOTIF = {   # 7칸 너비 그림 (가운데 칸 = 그림 가운데). '1' 주색 · '2' 둘째 색 · '3' 빛
    'club':  ["..111..", "..131..", "11.1.11", "1311111", "11.1.11", "...1...", "..111.."],
    'diamond': ["...1...", "..131..", ".13111.", "1311111", ".11112.", "..112..", "...1..."],
    'heart': [".11.11.", "1311111", "1311111", ".11111.", "..112..", "...1...", "......."],
    'spade': ["...1...", "..131..", ".13111.", "1311111", "11.1.11", "...1...", "..111.."],
    'J':     ["..1111.", "....1..", "....1..", "....1..", "1...1..", "1...1..", ".111..."],
    'Q':     [".11111.", "1.....1", "1.....1", "1.....1", "1...1.1", "1....1.", ".1111.1"],
    'K':     ["1....1.", "1...1..", "1..1...", "111....", "1..1...", "1...1..", "1....1."],
    'joker': ["2.....2", "1..2..1", "11.1.11", ".11111.", "..333..", ".3.3.3.", "..333.."],
    'moon':  ["..111..", ".11....", "113....", "11.....", "11.....", ".11....", "..111.."],
    'sun':   ["1..1..1", ".13331.", ".13111.", "1311111", ".11112.", ".11122.", "1..1..1"],
    'star':  ["...1...", "..131..", "1111111", ".13111.", "..111..", ".11.11.", ".1...1."],
    'skull': [".11111.", "1311111", "1.11.11", "1111111", ".11111.", ".1.1.1.", "......."],
    'key':   ["..111..", "..1.1..", "..131..", "...1...", "...11..", "...1...", "...11.."],
    'gem':   [".11111.", "1313131", "1111111", ".11112.", "..112..", "...1...", "......."],
    'coin':  [".11111.", "11...11", "1.333.1", "1.3.3.1", "1.333.1", "11...11", ".11111."],
    'crown': ["1..1..1", "1.131.1", "1313131", "1111111", "1111111", ".......", "2222222"],
}
def card(s, x0, y0, w, h, face=('a', 'b'), rim=('E', 'e'), back=False, motif=None, pip=None, steel=False):
    """x0..x0+w−1, y0..y0+h−1 카드 (모서리 둥글게)"""
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            cx = x in (x0, x0 + w - 1); cy = y in (y0, y0 + h - 1)
            if cx and cy: continue                                  # 모서리 깎기
            edge = cx or cy or (steel and (x in (x0 + 1, x0 + w - 2) or y in (y0 + 1, y0 + h - 2)))
            if edge: s.put(x, y, rim[1] if (x <= x0 + 1 or y <= y0 + 1) else rim[0]); continue
            if back: s.put(x, y, 'k' if (x + y) % 3 == 0 or (x - y) % 3 == 0 else 'K'); continue
            s.put(x, y, face[1] if (x == x0 + w - 2 or y == y0 + h - 2) else face[0])
    if motif:
        g = MOTIF[motif]; mx = x0 + w // 2 - 3; my = y0 + (h - len(g)) // 2
        for j, r in enumerate(g):
            for i, ch in enumerate(r):
                if ch != '.': s.put(mx + i, my + j, ch)
    if pip:                                                         # 모서리 무늬 (왼쪽 위 · 오른쪽 아래)
        o = 2 if steel else 1
        s.put(x0 + o + 0, y0 + o + 0, 'm'); s.put(x0 + w - 1 - o, y0 + h - 1 - o, 'm')
STYLE = {'A': '한 장', 'B': '세 장', 'C': '날 선 카드', 'D': '두 장'}
def frame(st, motif):
    s = Sh()
    if st == 'A':
        card(s, 5, 1, 11, 18, motif=motif, pip=1)
    elif st == 'B':
        card(s, 1, 3, 9, 14, back=True)
        card(s, 10, 3, 9, 14, back=True)
        card(s, 5, 1, 11, 18, motif=motif, pip=1)
    elif st == 'C':
        card(s, 5, 1, 11, 18, motif=motif, pip=1, steel=True)
    else:
        card(s, 2, 1, 11, 16, back=True)
        card(s, 7, 3, 11, 16, motif=motif, pip=1)
    return s
FR = []
def frm(key, desc, motif):
    def deco(fn): FR.append(dict(key=key, desc=desc, motif=motif, fn=fn)); return fn
    return deco
CARD = dict(a='#fbf8f0', b='#d8d0c0', E='#6a6460', e='#a8a098', k='#c83a3a', K='#8a1e22', m='#c83a3a')
RED = {'1': '#d8302e', '2': '#8a1a1a', '3': '#ff9a8a'}
BLK = {'1': '#2a2630', '2': '#14121a', '3': '#8a8494'}
@frm('A', '세운 카드 한 장 · 가운데 그림 · 두 모서리 무늬', 'spade')
def fA(): return frame('A', 'spade'), dict(CARD, **BLK, m='#2a2630')
@frm('B', '부채처럼 편 세 장 · 뒤 두 장은 뒷면 무늬', 'heart')
def fB(): return frame('B', 'heart'), dict(CARD, **RED)
@frm('C', '쇠 테를 두른 카드 — 던지면 벤다', 'diamond')
def fC(): return frame('C', 'diamond'), dict(CARD, **RED, E='#7a869c', e='#e8eef6')
@frm('D', '뒷면이 보이는 카드 위에 앞면 카드 한 장', 'club')
def fD(): return frame('D', 'club'), dict(CARD, **BLK, m='#2a2630')
G = []
def make(lv, st, motif, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, motif=motif, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', 'club', '낡은 클로버', '모서리가 닳은 클로버 카드 한 장')
def c01(): return frame('A', 'club'), dict(CARD, a='#ece4d0', b='#c8bca0', **BLK, m='#2a2630')
@make(10, 'B', 'diamond', '노름꾼의 다이아', '노름판에서 딴 다이아 패 · 뒤에 두 장 더')
def c10(): return frame('B', 'diamond'), dict(CARD, **RED, k='#2a4a9a', K='#1a2a5a')
@make(20, 'C', 'heart', '날 선 하트', '쇠 테를 두른 하트 카드 · 던지면 벤다')
def c20(): return frame('C', 'heart'), dict(CARD, **RED, E='#7a869c', e='#e8eef6')
@make(30, 'D', 'spade', '스페이드 에이스', '가장 센 한 장 · 검은 뒷면 위에')
def c30(): return frame('D', 'spade'), dict(CARD, **BLK, k='#3a3a44', K='#1a1a20', m='#2a2630')
@make(40, 'C', 'J', '검은 잭', '쇠 테 두른 잭 카드')
def c40(): return frame('C', 'J'), dict(CARD, **BLK, E='#7a869c', e='#e8eef6', m='#2a2630')
@make(50, 'A', 'Q', '붉은 퀸', '하트 여왕의 카드')
def c50(): return frame('A', 'Q'), dict(CARD, **RED)
@make(60, 'D', 'K', '왕의 카드', '킹 카드 · 금빛 뒷면 위에')
def c60(): return frame('D', 'K'), dict(CARD, **BLK, k='#f0c040', K='#a87018', m='#c89028', E='#a88a3a', e='#e8d08a')
@make(70, 'B', 'joker', '조커', '무엇이든 될 수 있는 한 장 · 광대 모자')
def c70(): return frame('B', 'joker'), dict(CARD, **{'1': '#a040b8', '2': '#e8b030', '3': '#5ab848'}, k='#5a2a7a', K='#2e1240', m='#a040b8')
@make(80, 'B', 'moon', '달의 카드', '밤에만 빛나는 초승달 카드 · 남빛 뒷면')
def c80(): return frame('B', 'moon'), dict(CARD, a='#e8ecf8', b='#b8c0d8', **{'1': '#f0c040', '2': '#a87018', '3': '#fffbd0'}, k='#2a3478', K='#151a4a', m='#3e4ea0')
@make(90, 'C', 'sun', '해의 카드', '금 테 두른 해 카드')
def c90(): return frame('C', 'sun'), dict(CARD, **{'1': '#ff9a2a', '2': '#c0501a', '3': '#ffe070'}, E='#b08018', e='#fff0a0', m='#ff9a2a')
@make(100, 'A', 'star', '별의 카드', '소원을 비는 별 카드')
def c100(): return frame('A', 'star'), dict(CARD, a='#eef2ff', b='#c0c8e8', **{'1': '#4a6ad8', '2': '#22346a', '3': '#c8d8ff'}, m='#4a6ad8')
@make(110, 'D', 'skull', '해골 카드', '죽음을 부르는 한 장 · 검붉은 뒷면')
def c110(): return frame('D', 'skull'), dict(CARD, a='#e8e0d0', b='#b8ac94', **{'1': '#3a3440', '2': '#14121a', '3': '#a89cb0'}, k='#6a1a24', K='#34080e', m='#3a3440')
@make(120, 'A', 'key', '열쇠 카드', '어떤 문이든 여는 열쇠가 그려진 도둑의 패')
def c120(): return frame('A', 'key'), dict(CARD, **{'1': '#c89028', '2': '#6a4410', '3': '#ffe890'}, m='#c89028')
@make(130, 'C', 'gem', '보석 카드', '은 테 두른 카드 · 큼직한 보석')
def c130(): return frame('C', 'gem'), dict(CARD, **{'1': '#3ac0d8', '2': '#1a5a8a', '3': '#d8faff'}, E='#a8b0bc', e='#ffffff', m='#3ac0d8')
@make(140, 'B', 'coin', '금화 카드', '금화가 쏟아지는 패 · 금빛 뒷면')
def c140(): return frame('B', 'coin'), dict(CARD, **{'1': '#f0c040', '2': '#a87018', '3': '#fffbd0'}, k='#f0c040', K='#a87018', m='#c89028')
@make(150, 'D', 'crown', '세기의 한 패', '대도가 마지막에 꺼내는 왕관 카드 · 루비 · 금빛이 감돈다')
def c150():
    s = frame('D', 'crown')
    s.put(12, 9, 'r')                                   # 왕관 가운데 루비
    s.fx.update({(1, 18): '4', (18, 1): '5', (0, 9): '5', (19, 12): '4'})
    return s, dict(CARD, a='#fffbe8', b='#e8d8a8', **{'1': '#f0c040', '2': '#a87018', '3': '#fffbd0', '4': '#ffffff', '5': '#fff0a0'},
                   r='#e0283a', k='#a8182a', K='#5a0a14', E='#b08018', e='#fff0a0', m='#e0283a')
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, pal = d['fn']()
        out.append((s.icon(pal).render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'cd_frames.png', z=12)
    zoomsheet(out[4:12], 'cd_z1.png', z=9)
    zoomsheet(out[12:], 'cd_z2.png', z=9)
    print(Counter(d['st'] for d in G))
