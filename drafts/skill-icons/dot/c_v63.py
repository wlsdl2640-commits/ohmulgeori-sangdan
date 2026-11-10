"""빌드 63 후보 — 새 직업 · 바뀐 직업 스킬 그림 시안 (2026-11-11 사용자 「스킬들 이미지 구현 다 하고」)
스킬 시안 문서 「스킬 시안 — 새 직업 · 바뀐 직업」의 새 스킬 · 그림이 바뀌는 스킬.
id가 그대로인 스킬(ambush · volley · farsight · summit · cargoshield · shieldbag · dragonpierce · wyrmbane · slayrain)은 새 그림이 옛 그림을 대신한다.
python3 v63sheet.py → v63_*.png (직업 묶음마다 판)"""
import math
import cell
from cell import Art, mix, W, H, crescent2
from lib import *
from spr import *
from arrows import ar, arrow, arrow_s, recol, AP
from c_rogue import dagger_at
from c_g2 import crosshair
from c_g5 import MARK
from w5 import slash
from fix_c import WOLFHEAD
def A(theme, **k): return bg(Art(), theme, **k)
PAPER = {'e': ('#f4f0e6', 7), 'E': ('#c8bea8', 7)}
# ───────── 새 부품 ─────────
CARD = (['eeeeee', 'eReeee', 'eerree', 'errrre', 'eerree', 'eeeeRe', 'eeeeee'], {'e': ('#f4f0e6', 7), 'r': ('#e83a3a', 13), 'R': ('#9a2020', 13)})
CARD_K = (['eeeeee', 'eqeeee', 'eekkee', 'ekkkke', 'eeqqee', 'eeeeqe', 'eeeeee'], {'e': ('#f4f0e6', 7), 'k': ('#2a2438', 10), 'q': ('#5a4a7a', 10)})
CARD_BACK = (['BBBBBB', 'BbBbBB', 'BBbBbB', 'BbBbBB', 'BBbBbB', 'BbBbBB', 'BBBBBB'], {'B': ('#2a4aa0', 12), 'b': ('#8ac0ff', 12)})
CARD_GOLD = (['yyyyyy', 'yhyyyy', 'yyrryy', 'yrrrry', 'yyrryy', 'yyyyhy', 'yyyyyy'], {'y': ('#ffd84a', 6), 'h': ('#fff6c8', 1), 'r': ('#e83a3a', 13)})
LOG = (['.ttttttteee.', 'tTtttTttEkEe', 'ttttttttEEEe', '.TTTTTTTeee.'], {'t': ('#b07a44', 3), 'T': ('#6a4422', 3), 'e': ('#e8c890', 3), 'E': ('#a8804a', 3), 'k': ('#6a4422', 3)})
FLAG = (['y..........', 'trrrrrrrr..', 'trrryyrrrr.', 'trryyyyrrr.', 'trrryyrrr..', 'trrrrrrr...', 't..........', 't..........', 't..........', 't..........', 'T..........'], {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'r': ('#c0283a', 13), 'y': ('#ffd84a', 6)})
BREAD = (['...tttt...', '.ttTtTtt..', 'tTttttttt.', 'tttttttttT', '.TTTTTTTT.'], {'t': ('#d8a050', 3), 'T': ('#8a5a28', 3)})
FEDORA = (['...ffff...', '..ffFfff..', '..rrrrrr..', 'ffffffffff', '.FFFFFFFF.'], {'f': ('#6a5a4a', 7), 'F': ('#3e3226', 7), 'r': ('#c01828', 13)})
DOMINO = (['.qqqq..qqqq.', 'qqwkqqqqkwqq', '.qqqqqqqqqq.', '..qq....qq..'], {'q': ('#3a2a5a', 10), 'k': ('#0a080e', 1), 'w': ('#ffffff', 1)})
WXBOW = (['........n...', '.......nM...', '......nM....', 'tTTTTTnMTmw.', '......nM....', '.......nM...', '........n...', '.llllll.....', '.LLLLLL.....'], {'t': ('#b07a44', 3), 'T': ('#6a4422', 3), 'l': ('#a8743a', 9), 'L': ('#6a4a2a', 9)})
SEAL = (['.rr.', 'rRrr', 'rrRr', '.rr.'], {'r': ('#c0283a', 13), 'R': ('#ff6a6a', 13)})
VIAL_G = (['.ll.', '.cc.', 'cggc', 'cggc', '.cc.'], {'c': ('#d8f4ff', 12), 'g': ('#6ad04a', 8), 'l': ('#b87a48', 9)})
CLIFF = None

def _machete_rows(N=12):
    out = []
    for y in range(N):
        r = ''
        for x in range(N):
            cx, cy = x + 0.5, y + 0.5
            t = (cx + (N - cy)) / (2 * N); s = (cx - (N - cy)) / math.sqrt(2); ch = '.'
            if 0.04 <= t <= 0.30 and abs(s) <= 0.75: ch = 'l' if s < 0 else 'L'
            elif 0.30 < t <= 0.36 and abs(s) <= 1.25: ch = 'y'
            elif 0.36 < t <= 0.98:
                wmax = 1.0 + 2.1 * min(1, (t - 0.36) / 0.5)
                if t > 0.86: wmax *= max(0, (0.98 - t) / 0.12) ** 0.6
                if -0.85 <= s <= wmax: ch = 'w' if s < -0.2 else ('M' if s > wmax - 0.9 else 'm')
            r += ch
        out.append(r)
    return out
MACHETE = (_machete_rows(), {'y': ('#ffd84a', 6), 'l': ('#7a4a2a', 9), 'L': ('#4a2a10', 9), 'w': ('#f4f8ff', 11), 'm': ('#b8c4d4', 11), 'M': ('#6a7488', 11)})
def _shuri_rows(N, R, W0, pw=1.0, hole=0.7):
    """X로 놓인 네 날 표창: 날마다 가운데에서 끝(모서리)으로 가늘어진다 · 날 한쪽은 밝게 한쪽은 어둡게 (거울 대칭)"""
    out = []; c = (N - 1) / 2
    for y in range(N):
        r = ''
        for x in range(N):
            dx, dy = x - c, y - c; u, v = (dx + dy) / math.sqrt(2), (dx - dy) / math.sqrt(2); ch = '.'
            for (a_, b_, sg) in ((u, v, 1), (v, u, -1)):
                if abs(a_) <= R:
                    w = W0 * max(0, 1 - abs(a_) / R) ** pw
                    if abs(b_) <= w:
                        if math.hypot(dx, dy) <= hole: ch = 'k'; break
                        side = b_ * (1 if a_ > 0 else -1) * sg
                        ch = 'a' if side < 0 else ('c' if abs(b_) > w - 0.6 else 'b'); break
            r += ch
        out.append(r)
    return out
STEEL = {'a': ('#eef2fa', 11), 'b': ('#9aa4b8', 11), 'c': ('#545e72', 11), 'k': ('#0a0a10', 1)}
SHURI = (_shuri_rows(12, 7.8, 2.6), dict(STEEL))
SHURI_S = (_shuri_rows(8, 5.2, 1.8, 1.0, 0.5), dict(STEEL))
def _cr(pts, n=80):
    """Catmull-Rom 곡선 위 점들"""
    P = [pts[0]] + list(pts) + [pts[-1]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    out.append(pts[-1]); return out
def whip_cm(pts, handle):
    """채찍: 손잡이 (x0,y0)→(x1,y1) 두 칸 굵기 + 곡선 끈 (한 칸) + 끝 술"""
    cm = {}
    (x0, y0), (x1, y1) = handle; n = max(abs(x1 - x0), abs(y1 - y0))
    for i in range(n + 1):
        x = round(x0 + (x1 - x0) * i / n); y = round(y0 + (y1 - y0) * i / n)
        cm[(x, y)] = 'h' if i < n else 'y'
        if i < n - 1: cm[(x + 1, y)] = 'H'
    path = [(round(px), round(py)) for (px, py) in _cr(pts)]
    seen = []
    for q in path:
        if not seen or seen[-1] != q: seen.append(q)
    for i, q in enumerate(seen):
        if q not in cm: cm[q] = 'w' if i >= len(seen) - 1 else ('L' if i < len(seen) * 0.3 else 'l')
    return cm
WHIPP = {'h': ('#5a3418', 9), 'H': ('#3a200c', 9), 'y': ('#ffd84a', 6), 'l': ('#b07a44', 9), 'L': ('#7a4a24', 9), 'w': ('#f4f0e6', 1)}
CHAIN = (['mmmm..mmmm..', 'm..mmmm..mmm', 'mmmm..mmmm..'], {'m': ('#c4ccd8', 11)})
SAFE = (['nnnnnnnnnnn', 'nMMMMMMMMMn', 'nMmmmmmmmMn', 'nMmmyyymmMn', 'nMmykYymmnn', 'nMmyyyYmmnn', 'nMmmYYmmmMn', 'nMmmmmmmmMn', 'nMMMMMMMMMn', 'nnnnnnnnnnn', '.nn.....nn.'],
        {'n': ('#3a4458', 11), 'M': ('#6a7488', 11), 'm': ('#9aa4b8', 11), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'k': ('#1a1414', 1)})
# ───────── 짐꾼 · 마부 ─────────
def cargoshield():   # 여행 채비 (짐칸 방패 자리, 패시브: 파티 강화 지속 · 짐)
    a = A('sand', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BACKPACK, 1, 5)
    sp(a, MAPSCROLL, 6, 10)
    for (x, y) in [(13, 4), (2, 3)]: plus(a, x, y, '#ffffff', '#fff0c0')
    return a, 0
def medkit():   # 약상자 (가장 다친 동료 회복 · 출혈 · 중독 풀기)
    a = A('heal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BANDAGE, 1, 9)
    sp(a, VIAL_G, 11, 4); sp(a, (['.ll.', '.cc.', 'crrc', 'crrc', '.cc.'], {'c': ('#d8f4ff', 12), 'r': ('#e8483a', 13), 'l': ('#b87a48', 9)}), 6, 3)
    for (x, y) in [(3, 4), (14, 12)]: plus(a, x, y, '#ffffff', '#c8ffd0')
    return a, 0
def shieldbag():   # 보급품 나눠 주기 (파티 HP 회복 · 상태이상 하나)
    a = A('heal', cy=12, rays=8, k=0.3)
    sp(a, SACK, 5, 12)
    sp(a, POTION, 1, 3, {'1': ('#ff6a6a', 13), '2': ('#a02020', 13)}); sp(a, VIAL_G, 11, 3); sp(a, BREAD, 4, 7)
    for (x, y) in [(8, 3), (14, 10), (1, 12)]: plus(a, x, y, '#ffffff', '#c8ffd0')
    return a, 0
# ───────── 코네스토가 ─────────
def frontierlash():   # 개척자의 채찍 (두 번 · 느림)
    a = A('sky', cx=12, cy=5)
    sp(a, grid(whip_cm([(4, 13), (6, 8), (10, 6), (12, 9), (10, 12), (12.5, 4.5)], ((1, 17), (3, 14)))), WHIPP)
    star5(a, 13, 3)
    speed(a, [(14, 8, 15, 10), (8, 3, 10, 2)], '#fff0c0')
    return a, 0
def wagonfort():   # 포장마차 진지 (파티가 받는 피해 −15%)
    a = A('steelb', cy=11, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    ring(a, 7.5, 11.5, 7.2, [(195, 345)], '#bfe0ff', w=0.6)
    ring(a, 7.5, 11.5, 6.0, [(200, 340)], '#6aa8ff', w=0.5)
    sp(a, WAGON, 1, 9)
    return a, 0
def rations():   # 비상식량 (파티 재생 · 상태이상 하나)
    a = A('warm', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BREAD, 1, 11)
    sp(a, (['..lL..', '.eeee.', 'eEeeee', 'eeeeeE', 'eeeeEE', '.EEEE.'], {'e': ('#e8e0d0', 7), 'E': ('#a89a80', 7), 'l': ('#7a4a2a', 9), 'L': ('#4a2a10', 9)}), 9, 4)
    for (x, y) in [(3, 5), (6, 3), (14, 12)]: plus(a, x, y, '#ffffff', '#c8ffd0')
    return a, 0
def lasso():   # 올가미 채찍 (마비 · 표식)
    a = A('teal', cx=11, cy=7)
    cm = whip_cm([(4, 13), (7, 10), (9.5, 9.5)], ((1, 17), (3, 14)))
    for (x, y) in ring_cells(10.5, 6.0, 3.0, 3.2, w=0.5): cm[(x, y)] = 'l'
    sp(a, grid(cm), WHIPP)
    sp(a, (grid({(13, 13): 'r', (12, 14): 'r', (13, 14): 'R', (14, 14): 'r', (13, 15): 'r'})), {'r': ('#ff4a3a', 13), 'R': ('#ffe0a0', 13)})
    return a, 0
def pioneerwit():   # 개척민의 지혜 (패시브: 회복 · 보호막 세기 · 야영)
    a = A('night', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    glow(a, 9.5, 7.5, 5.2, ['#3a3060', '#7a6a50', '#d8b060'])
    sp(a, TENT, 1, 10)
    sp(a, LAMP, 4, 3)
    for (x, y) in [(2, 3), (13, 2), (14, 9)]: a.set(x, y, '#fff6c8')
    return a, 0
def westward():   # 서부로! (웨건 돌진 · 모두)
    a = A('dawn', cy=15, r=15, rays=10, k=0.3, hole=5)
    speed(a, [(0, 9, 2, 9), (0, 12, 3, 12), (0, 15, 2, 15)], '#ffe8c0')
    sp(a, WAGON, 2, 8)
    for (x, y) in [(13, 3), (3, 4)]: plus(a, x, y, '#ffffff', '#ffe0a0')
    return a, 0
# ───────── 캐러밴마스터 ─────────
def caravanwhip():   # 행렬 채찍 (머리 위로 돌려 모든 적 두 번)
    a = A('royal', rays=12, k=0.3)
    ring(a, 7.5, 7.5, 6.4, [(180, 360)], '#fff0a0', w=0.5)
    sp(a, grid(whip_cm([(6, 9), (3, 6), (6, 2.5), (11, 3), (13, 7), (10.5, 9.5)], ((5, 17), (6, 13)))), WHIPP)
    for (x, y) in [(1, 14), (12, 14)]: sp(a, COIN, x, y)
    return a, 0
def caravanbanner():   # 대상단의 깃발 (파티 공격 · 방어)
    a = A('royal', rays=10, k=0.3, cy=7)
    sp(a, FLAG, 3, 3)
    for (x, y) in [(13, 4), (12, 14), (2, 16)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
# ───────── 정찰가 · 탐험가 (정글칼) ─────────
def ambush():   # 기습 베기 (덤불에서 뛰쳐나와 약한 적 · 표식)
    a = A('green', cx=12, cy=5, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, (grid(target(12.5, 4.5, 2.4, '123')), TGT))
    cm = cloud([(3, 14, 3.0), (6.5, 15.5, 2.6), (2, 17, 2.2), (8.5, 17.5, 2.2), (4.5, 11.5, 2.0)], 'g', 'G')
    for (x, y), c in list(cm.items()):
        if (x * 3 + y * 2) % 7 == 0: cm[(x, y)] = 'h'
    sp(a, grid(cm), {'g': ('#4ab04a', 8), 'G': ('#2a7a34', 8), 'h': ('#8ae07a', 8)})
    sp(a, MACHETE, 3, 2)
    return a, 0
def volley():   # 덤불 쓸기 (모든 적 두 번 · 출혈)
    a = A('wind', cx=8, cy=11)
    slash(a, crescent2((7.5, 14.5), 6.4, (7.5, 16.6), 6.0), ('#ffffff', '#e0ffd0', '#8ae07a', '#3a9a4a'))
    sp(a, MACHETE, 2, 1)
    for (x, y) in [(2, 16), (13, 15)]: sp(a, LEAF, x - 2, y - 2)
    return a, 0
def farsight():   # 급소 가르기 (약한 적 · 표식 8초)
    a = A('teal', cx=11, cy=6)
    crosshair(a, 11.5, 5.5, 3.2, '#ff6a5a')
    slash_line(a, 1.0, 13.0, 15.0, 5.0, w=2.0, core='#ffffff', edge='#a0f0e0')
    sp(a, MACHETE, 1, 7)
    return a, 0
def junglecamo():   # 밀림 위장 (파티 회피)
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HOOD, 2, 6, {'k': ('#2a5a2a', 10), 'q': ('#0a1408', 1), 'r': ('#c8ff8a', 1)})
    for (x, y) in [(1, 4), (11, 3), (12, 13), (0, 13), (6, 15)]: sp(a, LEAF, x, y)
    return a, 0
def vinetrap():   # 덩굴 덫 (모든 적 마비)
    a = A('poison', cy=14, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    cm = {}
    for k in range(3):
        x0 = 2 + k * 5
        for i in range(14):
            y = 17 - i; x = round(x0 + 1.4 * math.sin(i * 0.9 + k))
            cm[(x, y)] = 'g' if i % 3 else 'G'
            if i % 4 == 2: cm[(x + (1 if k % 2 else -1), y)] = 'h'
    sp(a, grid(cm), {'g': ('#5ab83a', 8), 'G': ('#2a7a2a', 8), 'h': ('#9ae86a', 8)})
    for (x, y) in [(4, 3), (12, 4)]: plus(a, x, y, '#ffffff', '#e0ffc0')
    return a, 0
def summit():   # 절벽 낙하 (뛰어내리며 모든 적 두 번)
    a = A('sky', cy=3, r=15)
    for y in range(20):
        for x in range(16):
            if x < 6 and y >= 6 + x * 0.6: a.set(x, y, '#6a7a8a' if x < 3 else '#4a5a6a')
    speed(a, [(8, 1, 9, 4), (11, 0, 12, 3), (14, 2, 14, 5)], '#e0f0ff')
    sp(a, MACHETE, 4, 5)
    burst(a, 12, 17, big=False)
    return a, 0
# ───────── 소매치기 · 괴도 · 대도 (트럼프 카드) ─────────
def cardfan():   # 카드 부채 (세 장)
    a = A('royal', cy=12)
    sp(a, CARD_BACK, 1, 7); sp(a, CARD_K, 5, 5); sp(a, CARD, 9, 3)
    speed(a, [(13, 12, 15, 12), (12, 15, 15, 15)], '#ffffff')
    return a, 0
def bottomdeal():   # 밑장 빼기 (치명 · 훔치는 돈 ×2)
    a = A('purple', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for i in range(4): sp(a, CARD_BACK, 2 + i, 3 + i)
    sp(a, CARD_GOLD, 8, 11)
    for (x, y) in [(14, 9), (13, 17)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
def callingcard():   # 예고장 (표식 · 훔치기)
    a = A('night', rays=10, k=0.3)
    sp(a, (['eeeeeeee', 'eEEEEEEe', 'eeeeeeee', 'eEEEEeee', 'eeeeeeee', 'eEEEEEee', 'eeeeeeee', 'eeeeeeee'], PAPER), 3, 5)
    sp(a, SEAL, 8, 10)
    dagger_at(a, 8, 1, 'ur')
    return a, 0
def disguise():   # 변장 (회피 · 덜 노림)
    a = A('dark', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, FEDORA, 3, 4)
    sp(a, DOMINO, 2, 11)
    for (x, y) in [(14, 3), (1, 17)]: plus(a, x, y, '#e0d0ff', '#9a80d0')
    return a, 0
def cardtrick():   # 카드 마술 (모든 적 세 번)
    a = A('pink', rays=10, k=0.3)
    ring(a, 7.5, 9.5, 6.4, [(0, 300)], '#ffd0f0', w=0.5)
    sp(a, CARD, 1, 2); sp(a, CARD_K, 9, 5); sp(a, CARD_GOLD, 3, 11)
    return a, 0
def grandshow():   # 세기의 마술쇼 (모든 적 · 훔치기 · 파티 회피)
    a = A('gold', rays=14, k=0.35, hole=4)
    sp(a, TOPHAT, 2, 10)
    sp(a, CARD, 1, 2); sp(a, CARD_GOLD, 9, 1)
    for (x, y) in [(8, 7), (14, 9), (6, 2)]: star5(a, x, y)
    return a, 0
def safecracker():   # 금고털이 (패시브: 공격 · 보물 상자 돈)
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, SAFE, 2, 4)
    sp(a, COIN, 11, 15); sp(a, COIN, 1, 16)
    plus(a, 13, 4, '#ffffff', '#fff0a0')
    return a, 0
def thiefcode():   # 도둑의 의리 (파티 공격 · 공격 속도)
    a = A('purple', rays=10, k=0.3)
    dagger_at(a, 6, 3, 'ur'); dagger_at(a, 1, 3, 'ul')
    sp(a, COIN, 6, 14)
    for (x, y) in [(2, 16), (13, 16)]: plus(a, x, y, '#ffffff', '#e0d0ff')
    return a, 0
def nightking():   # 밤의 왕 (약한 적 처형 · 훔치기)
    a = A('night', cx=10, cy=6, rays=8, k=0.3)
    sp(a, MOON_C, 2, 3, {'1': ('#fff0b0', 1)})
    sp(a, CROWN_D, 5, 12, {'p': ('#ffd84a', 6), 'P': ('#c08a1c', 6), 'q': ('#fff6c8', 1), 'r': ('#7a3aff', 1)})
    for (x, y) in [(12, 3), (14, 8), (9, 2)]: a.set(x, y, '#ffffff')
    return a, 0
# ───────── 닌자 · 카게닌자 (표창 · 단검) ─────────
def shurikenvolley():   # 표창 연발 (세 번)
    a = A('shadow', cx=12, cy=9)
    speed(a, [(0, 4, 3, 4), (0, 10, 3, 10), (0, 16, 3, 16)], '#d0d8ff')
    sp(a, SHURI_S, 4, 1); sp(a, SHURI_S, 8, 6); sp(a, SHURI_S, 4, 12)
    return a, 0
def sneakstrike():   # 암습 (등 뒤로 가서 목을 딴다)
    a = A('dark', cx=6, cy=10)
    sp(a, NINJA, 1, 6, {'k': ('#3a2a5a', 10)})
    slash_line(a, 7.0, 3.0, 15.0, 13.0, w=1.8, core='#ffffff', edge='#ff5a7a')
    dagger_at(a, 7, 9, 'ur')
    return a, 0
def kawarimi():   # 통나무 바꾸기 (쓰러질 때 한 번 · HP 30%)
    a = A('earth', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(5, 7, 3.0), (9, 5.5, 3.2), (12, 8, 2.6), (7.5, 9.5, 2.4)]), {'1': '#d8d8e0', '2': '#9a9aa8'})
    sp(a, LOG, 2, 12)
    for (x, y) in [(2, 3), (14, 3)]: plus(a, x, y, '#ffffff', '#e0e0e8')
    return a, 0
def spinshuriken():   # 회전 표창 (모든 적 두 번 · 돌아온다)
    a = A('steelb', rays=8, k=0.3)
    ring(a, 7.5, 9.5, 6.6, [(20, 160), (200, 340)], '#bfe0ff', w=0.55)
    sp(a, SHURI, 2, 4)
    return a, 0
def deflect():   # 튕겨내기 (기본 공격에 무적)
    a = A('amber', rays=10, k=0.3)
    dagger_at(a, 5, 4, 'ul')
    burst(a, 10, 7)
    ring(a, 7.5, 9.5, 7.2, [(250, 330)], '#fff0a0', w=0.5)
    for (x, y) in [(14, 13), (12, 16)]: a.set(x, y, '#ffe0a0')
    return a, 0
def shurikenart():   # 표창술 (패시브: 표창 피해 · 담는 수)
    a = A('stone', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, SHURI, 1, 1)
    sp(a, SHURI_S, 8, 12)
    return a, 0
DARK = {'a': ('#d0b8ff', 11), 'b': ('#8a64d8', 11), 'c': ('#46307a', 11), 'k': ('#0a0812', 1)}
def shadowshuriken():   # 그림자 표창 (어둠 · 눈멂)
    a = A('dark', rays=8, k=0.3)
    glow(a, 7.5, 9.5, 6.0, ['#2a1a40', '#4a2a70'])
    sp(a, SHURI, 2, 4, DARK, glow_c='#7a4ab0')
    return a, 0
def shadowslash():   # 그림자 가르기 (그림자에서 솟아 벤다)
    a = A('purple', cx=8, cy=16)
    for y in range(16, 20):
        for x in range(1, 15): a.set(x, y, '#1a0a28' if (x + y) % 3 else '#2a1440')
    slash(a, crescent2((9.0, 12.0), 7.0, (6.4, 13.4), 6.6), ('#f0d8ff', '#c090ff', '#7a40c0', '#4a2080'))
    dagger_at(a, 6, 2, 'ur', {'w': ('#e8d8ff', 5), 'm': ('#9a70d0', 5), 'M': ('#5a3a90', 5)})
    return a, 0
def shadowhide():   # 그림자 숨기 (회피 · 다음 공격 치명)
    a = A('shadow', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, NINJA, 4, 5, {'k': ('#46406a', 10)})
    for y in range(20):
        for x in range(16):
            if (x + y) % 2 == 0 and y > 11 and a.get(x, y) and sum(a.get(x, y)) > 150: a.set(x, y, '#1e1e32')
    for (x, y) in [(2, 4), (13, 6)]: plus(a, x, y, '#9a90d0', '#56567c')
    return a, 0
def phantomshuriken():   # 환영 표창 (분신 둘이 함께)
    a = A('arcane', cx=11, cy=9)
    sp(a, SHURI_S, 1, 2, {'a': ('#7a6ac0', 11), 'b': ('#4a3a90', 11), 'c': ('#2a1a5a', 11)})
    sp(a, SHURI_S, 1, 12, {'a': ('#7a6ac0', 11), 'b': ('#4a3a90', 11), 'c': ('#2a1a5a', 11)})
    sp(a, SHURI, 5, 5, DARK, glow_c='#a890ff')
    return a, 0
def spacecleave():   # 공간 가르기 (모든 적 · 방어 무시)
    a = A('night', rays=10, k=0.25)
    for i in range(20):
        x = round(4 + i * 0.45 + (1 if i % 5 == 2 else 0))
        a.set(x, i, '#ffffff'); a.set(x + 1, i, '#c8b0ff'); a.set(x - 1, i, '#7a50e0')
    for (x, y) in [(12, 3), (2, 14), (13, 15), (3, 5)]: plus(a, x, y, '#e0d0ff', '#7a50e0')
    return a, 0
def thousandshadows():   # 천 개의 그림자 표창 (모든 적 여섯 번)
    a = A('dark', cy=4, r=15, rays=12, k=0.3)
    speed(a, [(13, 0, 12, 3), (3, 6, 2, 9), (14, 9, 13, 12)], '#c8b0ff')
    for (x, y) in [(1, 0), (8, 3), (2, 9), (8, 12)]:
        sp(a, SHURI_S, x, y, {'a': ('#e0d0ff', 11), 'b': ('#9a7ae0', 11), 'c': ('#4a3480', 11)})
    return a, 0
# ───────── 트래커 · 스토커 (컴파운드 보우 · 손목 석궁) ─────────

def _wxbow_cm():
    """손목 석궁 (45°): 개머리 왼쪽 아래 → 앞 오른쪽 위, 활대는 앞끝에서 직각으로 살짝 뒤로 휨, 시위 V, 볼트, 팔찌"""
    cm = {}
    def put(x, y, c):
        if 0 <= x < 16 and 0 <= y < 20: cm[(x, y)] = c
    for i in range(8):   # 개머리 (두 칸 굵기)
        x, y = 2 + i, 12 - i; put(x, y, 't'); put(x + 1, y, 'T')
    for i in range(4): put(9 + i, 4 - i, 'm')   # 볼트
    put(13, 0, 'w'); put(12, 0, 'm'); put(13, 1, 'M')
    for k in range(-4, 5):   # 활대: 앞끝 (9,5) 둘레, 직각 방향 (1,1)
        bx, by = 9 + k * 0.72, 5 + k * 0.72; back = 0.09 * k * k
        put(round(bx - back), round(by + back), 'M' if abs(k) < 4 else 'n')
    for (tx, ty) in ((6, 2), (12, 8)):   # 시위: 활대 끝 → 걸쇠 (6, 8)
        n = max(abs(tx - 6), abs(ty - 8))
        for j in range(1, n):
            x, y = round(tx + (6 - tx) * j / n), round(ty + (8 - ty) * j / n)
            if (x, y) not in cm: put(x, y, 'e')
    for (x, y) in [(2, 14), (3, 14), (4, 14), (2, 15), (3, 15), (4, 15), (5, 13), (5, 14), (1, 13), (1, 14)]: put(x, y, 'l')
    return cm
WXBOW = (['.....n.........',
          '......nM.......',
          '.e.....nM......',
          '..e.....nM.....',
          'TTTTTTTTTnMmmmw',
          'tttttttttnMtt..',
          '..e.....nM.....',
          '.e.....nM......',
          '......nM.......',
          '.....n.........',
          '.lLlLlL........',
          'ssssssss.......',
          '.lLlLlL........'], {'t': ('#b07a44', 3), 'T': ('#6a4422', 3), 'l': ('#8a5a30', 9), 'L': ('#5a3a1a', 9), 'e': ('#f0e8d0', 1), 's': ('#e0ac7e', 2)})
BOLTP = {'r': ('#8a94a8', 5), 'R': ('#4a5266', 5), 'f': ('#c4c4cc', 11)}
def wristbolt():   # 손목 석궁 (볼트 두 발 · 방어 무시)
    a = A('steelb', cx=12, cy=6)
    sp(a, WXBOW, 0, 4)
    speed(a, [(11, 2, 14, 2), (11, 13, 14, 13), (13, 6, 15, 6)], '#ffe8c0')
    return a, 0
def dragonpierce():   # 급소 관통 (옛 용 관통 자리 · 표식)
    a = A('blood', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    crosshair(a, 8.5, 10.5, 4.2, '#ffd0c0')
    ar(a, 'ur', 14, 3, 6)
    burst(a, 8, 10, big=False, cols=('#ffffff', '#ffb0a0', '#ff5a4a'))
    return a, 0
def stalk():   # 숨죽이기 (회피 · 다음 공격 ×2)
    a = A('shadow', cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, (['..kkkkkkkk..', '.kkkkkkkkkk.', 'kkaakkkkaakk', 'kaAAkkkkAAak', 'kkaakkkkaakk', '.kkkkkkkkkk.', '..kkkkkkkk..'], {'k': ('#3a3440', 10), 'a': ('#9ad8ff', 12), 'A': ('#e8fcff', 12)}), 2, 4)
    cm = cloud([(3, 16, 2.6), (7, 17, 2.8), (12, 16, 2.6), (14.5, 17.5, 2.0), (0.5, 17.5, 2.0)], 'g', 'G')
    sp(a, grid(cm), {'g': ('#3a7a3a', 8), 'G': ('#1e4a24', 8)})
    return a, 0
def wyrmbane():   # 사냥감의 눈 (옛 용살자의 눈 자리 · 패시브)
    a = A('teal', rays=8, k=0.3)
    sp(a, EYE, 3, 6, {'1': ('#8ad8ff', 1), '2': ('#2a6aa0', 1), '3': ('#0a1a2a', 1)})
    ring(a, 7.5, 9.5, 6.4, [(0, 360)], '#bff0e8', w=0.45)
    return a, 0
def slayrain():   # 볼트 소나기 (옛 용살의 비 자리 · 화살 + 볼트)
    a = A('storm', cy=3, r=16)
    for (x, ty) in [(3, 9), (8, 7), (13, 10)]: ar(a, 'd', x, ty, 3, small=True)
    for (x, ty) in [(5, 16), (11, 17)]: ar(a, 'd', x, ty, 2, m={'r': 'f', 'R': 'F'}, small=True)
    return a, 0
def chaintrap():   # 사슬 덫 (모든 적 마비 · 느림)
    a = A('stone', cy=14, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BEARTRAP, 2, 12)
    sp(a, CHAIN, 2, 4); sp(a, CHAIN, 2, 8)
    return a, 0
# ───────── 샤프슈터 · 데드아이 · 저격수 (복합궁) ─────────
def quickdraw():   # 속사 (약한 적 세 번)
    a = A('sky', cx=4, cy=15, r=15)
    for (tx, ty) in [(9, 3), (12, 6), (15, 9)]: ar(a, 'ur', tx, ty, 3, small=True)
    speed(a, [(0, 11, 2, 9), (1, 15, 3, 13)], '#d8f0ff')
    return a, 0
def windread():   # 바람 읽기 (공격 속도 · 치명)
    a = A('wind', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    ring(a, 7.5, 9.5, 6.2, [(150, 300)], '#e0fff0', w=0.5)
    ring(a, 7.5, 9.5, 4.4, [(330, 480)], '#a0f0c0', w=0.45)
    ar(a, 'ur', 13, 4, 6)
    return a, 0
def wolfpack():   # 늑대 사냥대 (늑대 둘 · 모든 적 · 출혈)
    a = A('night', cy=12)
    glow(a, 6.5, 7.5, 6.0, ['#2a3070', '#4a54a0'])
    sp(a, WOLFHEAD, 0, 1)
    for k in range(3): slash_line(a, 8.0 + k * 2.3, 18.5, 11.5 + k * 2.3, 11.0, w=1.2, core='#ffffff', edge='#ff6a6a')
    return a, 0
def marksense():   # 명사수의 감 (패시브: 치명 · 연계 한도)
    a = A('gold', rays=10, k=0.3)
    sp(a, SCOPE_EYE, 3, 6, {'1': ('#fff0a0', 6), '2': ('#e83a3a', 13)})
    return a, 0
def lineshot():   # 꿰뚫는 화살 (모든 적 · 방어 무시)
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (cx, cy) in [(4.5, 14.5), (8.5, 10.5), (12.5, 6.5)]: ring(a, cx, cy, 2.2, [(0, 360)], '#bfe0ff', w=0.45)
    ar(a, 'ur', 15, 2, 9)
    return a, 0
def arrowtempest():   # 화살 폭풍 (모든 적 여섯 번)
    a = A('storm', rays=12, k=0.3)
    ring(a, 7.5, 9.5, 7.0, [(0, 140), (180, 320)], '#d0f0ff', w=0.5)
    for (d, tx, ty) in [('ur', 12, 3), ('dr', 14, 14), ('dl', 3, 16), ('ul', 2, 4), ('r', 15, 9)]: ar(a, d, tx, ty, 2, small=True)
    return a, 0
def surehit():   # 필중 (빗나가지 않음 · 치명)
    a = A('blood', rays=10, k=0.3)
    sp(a, (grid(target(8.5, 9.5, 4.6, '1213')), TGT))
    ar(a, 'ur', 9, 9, 6)
    return a, 0
def holdbreath():   # 숨 멈춤 (6초 동안 모든 공격 치명)
    a = A('ice', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HOURGLASS, 5, 6)
    crosshair(a, 7.5, 9.5, 6.2, '#e8fcff')
    return a, 0
def marktargets():   # 표적 지정 (모든 적 표식)
    a = A('evil', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (x, y) in [(1, 2), (8, 6), (2, 12)]: sp(a, MARK, x, y, {'r': ('#ff4a3a', 13), 'R': ('#a01a1a', 13)})
    return a, 0
def tempest():   # 화살 폭풍우 (모든 적 다섯 번)
    a = A('thunder', cy=3, r=16, rays=10, k=0.3)
    paint_cm(a, cloud([(4, 3, 3.0), (8, 2, 3.2), (12, 3.5, 2.8)]), {'1': '#8a80b0', '2': '#4a4470'})
    for (x, ty) in [(3, 13), (7, 16), (11, 13), (14, 17)]: ar(a, 'd', x, ty, 2, small=True)
    paint_cm(a, bolt([(9, 6), (7, 9), (9, 10), (6, 14)], w=1), {'w': '#ffffff', 'y': '#ffe060'})
    return a, 0
def finalshot():   # 마지막 한 발 (약한 적 처형)
    a = A('dark', rays=12, k=0.35, hole=4)
    sp(a, SKULL, 7, 9)
    ar(a, 'ur', 14, 2, 6, glow_c='#ff6a5a')
    return a, 0
def firstarrow():   # 첫 화살 (저격수 · 싸움마다 첫 공격 치명)
    a = A('dawn', cy=17, r=17, rays=10, k=0.3, hole=5)
    glow(a, 7.5, 17.5, 5.0, ['#c88a4a', '#ffd070', '#fff4c8'])
    ar(a, 'ur', 13, 3, 7)
    star5(a, 13, 3)
    return a, 0
from c_ride63 import *   # 랑기수 · 용기수 (02:08)
ICONS = {
  # 짐꾼 계열
  'cargoshield': ('여행 채비', 'none', cargoshield), 'medkit': ('약상자', 'heal', medkit), 'shieldbag': ('보급품 나눠 주기', 'heal', shieldbag),
  'frontierlash': ('개척자의 채찍', 'dmg', frontierlash), 'wagonfort': ('포장마차 진지', 'buff', wagonfort), 'rations': ('비상식량', 'heal', rations),
  'lasso': ('올가미 채찍', 'dmg', lasso), 'pioneerwit': ('개척민의 지혜', 'none', pioneerwit), 'westward': ('서부로!', 'dmg', westward),
  'caravanwhip': ('행렬 채찍', 'dmg', caravanwhip), 'caravanbanner': ('대상단의 깃발', 'buff', caravanbanner),
  'ambush': ('기습 베기', 'dmg', ambush), 'volley': ('덤불 쓸기', 'dmg', volley), 'farsight': ('급소 가르기', 'dmg', farsight),
  'junglecamo': ('밀림 위장', 'buff', junglecamo), 'vinetrap': ('덩굴 덫', 'dmg', vinetrap), 'summit': ('절벽 낙하', 'dmg', summit),
  # 도적 계열
  'cardfan': ('카드 부채', 'dmg', cardfan), 'bottomdeal': ('밑장 빼기', 'buff', bottomdeal),
  'callingcard': ('예고장', 'dmg', callingcard), 'disguise': ('변장', 'buff', disguise), 'cardtrick': ('카드 마술', 'dmg', cardtrick), 'grandshow': ('세기의 마술쇼', 'dmg', grandshow),
  'safecracker': ('금고털이', 'none', safecracker), 'thiefcode': ('도둑의 의리', 'buff', thiefcode), 'nightking': ('밤의 왕', 'dmg', nightking),
  'shurikenvolley': ('표창 연발', 'dmg', shurikenvolley), 'sneakstrike': ('암습', 'dmg', sneakstrike), 'kawarimi': ('통나무 바꾸기', 'none', kawarimi),
  'spinshuriken': ('회전 표창', 'dmg', spinshuriken), 'deflect': ('튕겨내기', 'buff', deflect), 'shurikenart': ('표창술', 'none', shurikenart),
  'shadowshuriken': ('그림자 표창', 'dmg', shadowshuriken), 'shadowslash': ('그림자 가르기', 'dmg', shadowslash), 'shadowhide': ('그림자 숨기', 'buff', shadowhide),
  'phantomshuriken': ('환영 표창', 'dmg', phantomshuriken), 'spacecleave': ('공간 가르기', 'dmg', spacecleave), 'thousandshadows': ('천 개의 그림자 표창', 'dmg', thousandshadows),
  # 궁수 계열
  'wristbolt': ('손목 석궁', 'dmg', wristbolt), 'dragonpierce': ('급소 관통', 'dmg', dragonpierce), 'stalk': ('숨죽이기', 'buff', stalk),
  'wyrmbane': ('사냥감의 눈', 'none', wyrmbane), 'slayrain': ('볼트 소나기', 'dmg', slayrain), 'chaintrap': ('사슬 덫', 'dmg', chaintrap),
  'quickdraw': ('속사', 'dmg', quickdraw), 'windread': ('바람 읽기', 'buff', windread), 'wolfpack': ('늑대 사냥대', 'dmg', wolfpack),
  'marksense': ('명사수의 감', 'none', marksense), 'lineshot': ('꿰뚫는 화살', 'dmg', lineshot), 'arrowtempest': ('화살 폭풍', 'dmg', arrowtempest),
  'surehit': ('필중', 'dmg', surehit), 'holdbreath': ('숨 멈춤', 'buff', holdbreath), 'marktargets': ('표적 지정', 'dmg', marktargets),
  'tempest': ('화살 폭풍우', 'dmg', tempest), 'finalshot': ('마지막 한 발', 'dmg', finalshot), 'firstarrow': ('첫 화살', 'none', firstarrow),
  # 랑기수 · 용기수 (02:08) — 옛 id 그대로, 그림만 새로
  'beastshot': ('질주 사격', 'dmg', wolfrun), 'trap': ('늑대 돌진', 'dmg', wolfpounce), 'camouflage': ('울부짖음', 'buff', wolfhowl), 'arrowstorm': ('달빛 사냥', 'dmg', moonhunt),
  'jump': ('하늘 사격', 'dmg', skyshot), 'gale': ('돌풍 화살', 'dmg', galearrow), 'dragonscale': ('하늘의 눈', 'dmg', skyeye), 'dragonblood': ('하늘의 주인', 'none', skylord), 'dragonfall': ('불타는 하늘', 'dmg', firesky),
}
GROUPS = [
  ('짐꾼 · 마부 · 코네스토가 · 캐러밴마스터', ['medkit', 'shieldbag', 'cargoshield', 'frontierlash', 'wagonfort', 'rations', 'lasso', 'pioneerwit', 'westward', 'caravanwhip', 'caravanbanner']),
  ('정찰가 · 탐험가 (정글칼)', ['ambush', 'volley', 'farsight', 'junglecamo', 'vinetrap', 'summit']),
  ('소매치기 · 괴도 · 대도 (트럼프 카드)', ['cardfan', 'bottomdeal', 'callingcard', 'disguise', 'cardtrick', 'grandshow', 'safecracker', 'thiefcode', 'nightking']),
  ('닌자 · 카게닌자 (표창 · 단검)', ['shurikenvolley', 'sneakstrike', 'kawarimi', 'spinshuriken', 'deflect', 'shurikenart', 'shadowshuriken', 'shadowslash', 'shadowhide', 'phantomshuriken', 'spacecleave', 'thousandshadows']),
  ('트래커 · 스토커 (컴파운드 보우 · 손목 석궁)', ['wristbolt', 'dragonpierce', 'stalk', 'wyrmbane', 'slayrain', 'chaintrap']),
  ('랑기수 · 용기수 (복합궁 · 탈것) — 늑대 부르기 · 늑대와 한 몸 · 와이번 강하는 옛 그림 그대로', ['beastshot', 'trap', 'camouflage', 'arrowstorm', 'jump', 'gale', 'dragonscale', 'dragonblood', 'dragonfall']),
  ('저격수 첫 화살 + 보관(샤프슈터 · 데드아이 → 나중에 거너)', ['firstarrow', 'quickdraw', 'windread', 'wolfpack', 'marksense', 'lineshot', 'arrowtempest', 'surehit', 'holdbreath', 'marktargets', 'tempest', 'finalshot']),
]
