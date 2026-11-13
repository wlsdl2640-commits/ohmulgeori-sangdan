"""빌드 69 — 짐꾼 · 코네스토가의 회복 스킬을 운반 · 마차 · 야영 · 피로도 스킬로 바꾸는 시안 (11-13 16:49 사용자
「짐꾼, 코네스토가에 있는 회복관련 스킬은 운반, 마차, 야영, 피로도 쪽으로 새롭게 스킬 능력, 이미지를 디자인해서 시안 주고」).
스킬마다 그림 A · B. 게임에는 고른 뒤에 넣는다. 반짝이는 점 · 비스듬한 꼴만(십자 · 더하기 꼴 없음), 모닥불 장작도 X로 겹치지 않는다.
  medkit  약상자        → 물통 돌리기 (피로도)   A 쇠 수통 · B 가죽 물주머니
  shieldbag 보급품 나눠 주기 → 짐 덜어 주기 (운반) A 등짐 + 오르는 화살꺾쇠 · B 등짐 + 깃털
  rations 비상식량      → 웨건 보급 (마차)       A 웨건 + 화살 상자 · B 열린 보급 상자 + 바퀴
  pioneerwit 개척민의 지혜 → 개척민의 지혜 (야영) A 웨건 옆 모닥불 · 보름달 · B 모닥불 + 모포 + 잠 Z
python3 v69sheet.py → v69_porter.png"""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar
def A(theme, **k): return bg(Art(), theme, **k)
def sparks(a, pts, c1='#ffffff', c2='#fff0c0'):
    """비스듬한 반짝이 (가운데 + 대각 넷)"""
    for (x, y) in pts:
        a.set(x, y, c1)
        for dx, dy in ((1, 1), (-1, -1), (1, -1), (-1, 1)): a.set(x + dx, y + dy, c2)
def drops(a, pts, c1='#bfe8ff', c2='#4a9ae0'):
    for (x, y) in pts: a.set(x, y, c1); a.set(x, y + 1, c2)
# ───────── 1 물통 돌리기 (피로도) ─────────
def flask_cm(cx=7.5, cy=10.0, r=4.6):
    """순례자 물통: 납작한 둥근 몸(가죽) · 가장자리 바느질 · 짧은 목 · 어깨 고리 둘"""
    cm = {}
    for y in range(H):
        for x in range(W):
            dx, dy = x + 0.5 - cx, y + 0.5 - cy; d = math.hypot(dx, dy)
            if d <= r:
                s = (dx + dy) / (r * 1.41)
                cm[(x, y)] = 'e' if abs(d - (r - 0.9)) < 0.45 and (x + y) % 2 == 0 else ('h' if s < -0.35 else 'L' if s > 0.35 else 'l')
    for (x, y), c in [((7, 5), 'y'), ((8, 5), 'Y'), ((7, 4), 'y'), ((8, 4), 'Y'), ((7, 3), 't'), ((8, 3), 'T'), ((3, 6), 'y'), ((12, 6), 'Y')]: cm[(x, y)] = c
    return cm
FLASKP = {'l': ('#a8642e', 9), 'L': ('#6a3a1a', 9), 'h': ('#d8945a', 9), 'e': ('#f0d8a8', 9), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 't': ('#c08a4a', 3), 'T': ('#7a4c22', 3)}
MUG = (['..ccccc',
       '..mmmmM',
       '.lttttT',
       'l.ttttT',
       'l.tttTT',
       '.ltttTT',
       '..tttTT',
       '..mmmmM'], {'c': ('#bfe8ff', 12), 'm': ('#c4ccd8', 5), 'M': ('#6a7488', 5), 't': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'l': ('#a8743a', 3)})
def canteen_a():   # 물 잔 둘이 부딪친다 (한 잔씩 돌린다)
    a = A('teal', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, MUG, 0, 7); sp(a, flip(MUG[0]), 9, 7, MUG[1])
    for (x, y, c) in [(7, 6, '#ffffff'), (8, 6, '#bfe8ff'), (6, 5, '#bfe8ff'), (9, 5, '#7ac0f4'), (5, 4, '#7ac0f4'), (10, 4, '#bfe8ff'), (7, 3, '#ffffff'), (8, 4, '#7ac0f4'), (4, 2, '#bfe8ff'), (11, 2, '#7ac0f4')]: a.set(x, y, c)
    return a, 0
CASK = (['...tttttt...',
         '..tTtttttTt.',
         '.mmmmmmmmmmM',
         '.tttttttttTT',
         '.tTttttttTTT',
         '.tttttttttTT',
         '.mmmmmmmmmmM',
         '.tTttttttTTT',
         '..TTTTTTTTT.'], {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'm': ('#c4ccd8', 5), 'M': ('#6a7488', 5)})
def canteen_b():   # 꼭지 달린 나무 물통 + 떨어지는 물
    a = A('sky', cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, CASK, 1, 4)
    sp(a, (['yy', 'yY', '.Y'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}), 13, 8)   # 꼭지
    for (x, y, c) in [(14, 11, '#bfe8ff'), (14, 12, '#7ac0f4'), (14, 14, '#bfe8ff'), (13, 15, '#4a9ae0'), (12, 15, '#7ac0f4')]: a.set(x, y, c)
    drops(a, [(4, 1), (9, 2)])
    return a, 0
# ───────── 2 짐 덜어 주기 (운반) ─────────
CHEV = (['..yy..', '.yhhy.', 'yh..hy'], {'y': ('#ffd84a', 6), 'h': ('#fff6c8', 1)})
def lighten_a():   # 등짐 + 위로 오르는 꺾쇠(가벼워짐)
    a = A('sand', cy=12, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BACKPACK, 2, 6)
    sp(a, CHEV, 5, 1)
    for (x, y) in [(0, 10), (1, 9), (2, 8)]: a.set(x, y, '#fff0c0')
    for (x, y) in [(15, 10), (14, 9), (13, 8)]: a.set(x, y, '#fff0c0')
    return a, 0
PACK8 = (['.tTtTtT.',
          '.TTTTTT.',
          'llllllLL',
          'lLLLLLLL',
          'll.yY.LL',
          'llllllLL',
          'lllllLLL',
          'lfllllfL',
          'lLLLLLLL',
          '.LLLLLL.'], {'t': ('#e0c08a', 3), 'T': ('#a07a4a', 3), 'l': ('#a8642e', 9), 'L': ('#6a3a1a', 9), 'f': ('#5a3010', 9), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
WING_P = (['.....ww',
           '...wwwf',
           '.wwwwff',
           'wwwwfff',
           '.wwfff.',
           '..ff...'], {'w': ('#ffffff', 1), 'f': ('#c8d4f0', 5)})
def lighten_b():   # 날개 달린 등짐 (짐이 날아갈 듯 가볍다)
    a = A('warm', cy=11, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, WING_P, 0, 5); sp(a, flip(WING_P[0]), 9, 5, WING_P[1])
    sp(a, PACK8, 4, 5)
    for (x, y) in [(3, 13), (12, 14), (5, 2), (10, 2)]: a.set(x, y, '#fff6d8')
    return a, 0
# ───────── 3 웨건 보급 (마차) ─────────
def quiver_s(a, x0, y0, fl=('#ffffff', '#c8c8d0'), tube=('#b87a48', '#7a4a2a'), band='#5a3418'):
    """작은 화살통: 통 6×5 (x0..x0+5, y0+3..) · 깃 셋은 높이를 엇갈려 따로 보이게"""
    for k, x in enumerate([x0, x0 + 2, x0 + 4]):
        top = y0 + (k % 2); am = {}
        for y in range(top, top + 2): am[(x, y)] = 'f'; am[(x + 1, y)] = 'F'
        am[(x, top + 2)] = 't'
        sp(a, grid(am), {'t': ('#e8d8b0', 7), 'f': (fl[0], 1), 'F': (fl[1], 1)})
    cm = {}
    for y in range(y0 + 3, y0 + 8):
        for x in range(x0, x0 + 6): cm[(x, y)] = 'l' if x < x0 + 4 else 'L'
    for x in range(x0, x0 + 6): cm[(x, y0 + 3)] = 'q'; cm[(x, y0 + 6)] = 'q'
    sp(a, grid(cm), {'l': (tube[0], 9), 'L': (tube[1], 9), 'q': (band, 6)})
def up_arrows(a, xs, top, bottom, head=('#eef2fa', '#8a94a8'), sh='#c08a4a'):
    """촉이 위로 선 화살들 (세모 촉 3칸 + 1칸 자루)"""
    for i, x in enumerate(xs):
        t = top + (i % 2)
        cm = {(x, t): 'w', (x - 1, t + 1): 'm', (x, t + 1): 'w', (x + 1, t + 1): 'M'}
        for y in range(t + 2, bottom + 1): cm[(x, y)] = 't'
        sp(a, grid(cm), {'w': (head[0], 5), 'm': (head[0], 5), 'M': (head[1], 5), 't': (sh, 3)})
def supply_a():   # 웨건 짐칸에 촉을 위로 세워 실은 화살
    a = A('earth', cy=5, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    up_arrows(a, [5, 8, 11], 2, 9)
    sp(a, WAGON, 1, 9)
    return a, 0
CRATE2 = (['ttttttttT',
           'tTTTTTTTT',
           'ttttttttT',
           'tttttttTT',
           'tTTTTTTTT',
           'TTTTTTTTT'], {'t': ('#d09a5a', 3), 'T': ('#8a5a2a', 3)})
def supply_b():   # 보급 상자에 세운 화살 + 자루
    a = A('amber', cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    up_arrows(a, [3, 6, 9], 3, 10)
    sp(a, CRATE2, 1, 10)
    sp(a, SACK, 10, 9)
    for (x, y) in [(12, 4), (13, 7)]: a.set(x, y, '#fff0c0')
    return a, 0
# ───────── 4 개척민의 지혜 (야영) ─────────
FLAME = (['..o...', '..oo.o', '.oyoo.', '.oyyo.', 'oyhyyo', 'oyhhyo', '.oyyo.'], {'o': ('#e8541a', 14), 'y': ('#ffb030', 14), 'h': ('#fff4b0', 1)})
LOGS = (['.tttttt.', 'tTtttTtT', '.TTTTTT.'], {'t': ('#a8743a', 3), 'T': ('#5a3a1a', 3)})
def camp_a():   # 밤 · 웨건 옆 모닥불 · 보름달
    a = A('night', cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    disc(a, 10.5, 4.0, 1.9, '#f4ecc8'); a.set(10, 3, '#ffffff'); a.set(11, 4, '#d8cfa8')
    for (x, y) in [(4, 3), (6, 5), (13, 6)]: a.set(x, y, '#c8d0ff')
    sp(a, WAGON, 0, 7)
    glow(a, 11.5, 13.0, 2.6, ['#5a3a20', '#a8642e'])
    sp(a, FLAME, 9, 9)
    sp(a, LOGS, 8, 15)
    return a, 0
BEDROLL = (['..bbbbbbbbbb',
            '.bBbbbbbbbbB',
            'eebbbbbbbbBB',
            'eEBBBBBBBBB.',
            '.EE.........'], {'b': ('#5a7ad8', 12), 'B': ('#2a3a8a', 12), 'e': ('#f0e0c0', 7), 'E': ('#b09a78', 7)})
Z5 = (['zzzzz', '...z.', '..z..', '.z...', 'zzzzz'], {'z': ('#ffffff', 1)})
Z4 = (['zzzz', '..z.', '.z..', 'zzzz'], {'z': ('#e8e0ff', 1)})
def camp_b():   # 새벽 · 모닥불 곁 모포에서 푹 잔다 (숙면)
    a = A('dawn', cy=16, r=15, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    glow(a, 4.5, 11.5, 3.0, ['#7a4a3a', '#c8783a'])
    sp(a, FLAME, 2, 7)
    sp(a, LOGS, 1, 13)
    sp(a, BEDROLL, 4, 11)
    sp(a, Z5, 9, 3); sp(a, Z4, 6, 7)
    return a, 0
ICONS = {
  'medkit_a': ('물통 돌리기 A', 'buff', canteen_a), 'medkit_b': ('물통 돌리기 B', 'buff', canteen_b),
  'shieldbag_a': ('짐 덜어 주기 A', 'buff', lighten_a), 'shieldbag_b': ('짐 덜어 주기 B', 'buff', lighten_b),
  'rations_a': ('웨건 보급 A', 'buff', supply_a), 'rations_b': ('웨건 보급 B', 'buff', supply_b),
  'pioneerwit_a': ('개척민의 지혜 A', 'none', camp_a), 'pioneerwit_b': ('개척민의 지혜 B', 'none', camp_b),
}
# ───────── 2차 시안 (11-13 17:41 사용자 「짐 덜어주기 시안 4개 다시」) ─────────
MINIPACK = ['.tTt..', 'llllll', 'lyYlLL', 'llllLL', '.LLLL.']
def minipack(col, col2):
    return (MINIPACK, {'t': ('#e0c08a', 3), 'T': ('#a07a4a', 3), 'l': (col, 9), 'L': (col2, 9), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
def lighten2_a():   # 동료들 저마다의 짐(색이 다른 등짐 셋)을 한데 쌓아 묶었다 — 끈은 가로로만
    a = A('sand', cy=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, minipack('#4a7ad8', '#24408a'), 1, 9)    # 파란 등짐 (마법사)
    sp(a, minipack('#c8403a', '#7a1e1a'), 9, 9)    # 붉은 등짐 (전사)
    sp(a, minipack('#4a9a5a', '#24582e'), 5, 4)    # 초록 등짐 (궁수)
    for x in range(1, 15): a.set(x, 12, '#e0c08a' if x % 2 else '#a07a4a')   # 묶은 밧줄 (가로 한 줄)
    for (x, y) in [(2, 3), (13, 4), (12, 2)]: a.set(x, y, '#fff6d8')
    return a, 0
HG = (['YyyyyyyyY',
       'p.ccccc.p',
       'p.csssc.p',
       'p..csc..p',
       'p...s...p',
       'p...s...p',
       'p..cac..p',
       'p.caaac.p',
       'p.caaac.p',
       'YyyyyyyyY'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'p': ('#a8743a', 3), 'c': ('#d8f4ff', 12), 's': ('#ffe090', 7), 'a': ('#e8c060', 7)})
def lighten2_b():   # 등짐 + 모래시계 (짐을 덜어 기술을 더 자주)
    a = A('sand', cy=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, PACK8, 0, 7)
    sp(a, HG, 7, 4)
    for (x, y) in [(2, 4), (4, 3), (5, 5)]: a.set(x, y, '#fff6c8')
    return a, 0
SKINARM = {'m': ('#f4c494', 2), 'M': ('#c88a5a', 2), 'n': ('#8a5a3a', 2), 'w': ('#fff0d8', 2)}
def lighten2_c():   # 불끈 쥔 팔이 자루를 번쩍 (힘으로 대신 든다)
    a = A('amber', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, (['...l...', '..lyl..', '.lllll.', 'llllllL', 'llllLLL', 'lllLLLL', '.lLLLL.'], {'l': ('#d8b880', 9), 'L': ('#9a7a48', 9), 'y': ('#8a5a2a', 9)}), 8, 0)
    sp(a, ARMFLEX[0], 0, 7, SKINARM)
    for (x, y) in [(2, 3), (4, 5), (15, 9)]: a.set(x, y, '#fff6d8')
    return a, 0
PORTER = (['...tTtT.......',
           '..tTtTtT......',
           '.lllllllL.....',
           'llLLLLLLLL.hh.',
           'lll.yy.lLLhhhh',
           'lllllllLLLssk.',
           'lllllllLLggss.',
           'llfllllfLggg..',
           'llllllLLLgggs.',
           'lLLLLLLLLggg..',
           '.LLLLLLLLggg..',
           '.........nnN..',
           '........nn.NN.',
           '........nn..NN',
           '.......kk...kk'], {'t': ('#e0c08a', 3), 'T': ('#a07a4a', 3), 'l': ('#a8642e', 9), 'L': ('#6a3a1a', 9), 'f': ('#5a3010', 9), 'y': ('#ffd84a', 6),
                               'h': ('#7a4a2a', 9), 's': ('#f4c494', 2), 'k': ('#2a1e18', 1), 'g': ('#4a8a5a', 7), 'n': ('#5a5a7a', 7), 'N': ('#3a3a58', 7)})
def lighten2_d():   # 제 몸보다 큰 짐을 진 짐꾼 (옆모습)
    a = A('sand', cy=12, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, PORTER, 1, 2)
    for (x, y) in [(14, 3), (13, 1)]: a.set(x, y, '#fff6d8')
    return a, 0
ICONS.update({
  'shieldbag_c': ('짐 덜어 주기 2-A 지게', 'buff', lighten2_a), 'shieldbag_d': ('짐 덜어 주기 2-B 모래시계', 'buff', lighten2_b),
  'shieldbag_e': ('짐 덜어 주기 2-C 불끈 팔', 'buff', lighten2_c), 'shieldbag_f': ('짐 덜어 주기 2-D 짐꾼', 'buff', lighten2_d),
})
