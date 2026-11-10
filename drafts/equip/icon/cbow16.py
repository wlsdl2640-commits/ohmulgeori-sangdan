"""컴파운드 보우 16자루 — 트래커 · 스토커 (11-10 23:59 사용자 「이 시안들로 무기 더 만들어 ㄱㄱ」).
원형 시안 2(cbow5.py) A 나무 · B 쇠 과녁 · C 덤불 사냥 · D 검은 도르래를 네 레벨 묶음마다 한 번씩. 2차 직업부터 쓰니 Lv50 · 60 … 200.
자루마다 고유한 이름 · 모습: 재질 색 · 캠 무늬(바퀴살 넷 · 둘 · 고리) · 창 수 · 덧붙이기(조준기 · 스태빌라이저 · 손목 끈) · 무늬(얼룩 · 줄무늬 · 비늘 · 룬) · 빛(효과 칸).
화살은 궁수 공통 화살을 같이 쓴다(23:58)."""
from wic import Ico
from cbow5 import BODY, put_grid, strings, cam_style, add, SIGHT_RING, SIGHT_BOX, STAB_LONG, STAB_SHORT, STAB_RIB, SLING, BASE
import cbow5
FR = cbow5.FR
STYLE = {'A': '나무 도르래 활', 'B': '쇠 과녁 활', 'C': '덤불 사냥 활', 'D': '검은 도르래 활'}
for d in FR: d.setdefault('desc', '')
PAL = {   # 원형마다 바탕 색 (cbow5와 같다)
    'A': dict(a='#e0aa78', b='#a86e40', c='#6a4220', l='#8a5a34', m='#4a2e14', k='#6a4428', K='#3a2414', q='#b8ac90', e='#e0402a'),
    'B': dict(a='#eef2f8', b='#aab2be', c='#5a6270', p='#5a6270', P='#30343c', l='#3a3a44', m='#1a1a22', k='#2a2a32', K='#16161c',
              o='#e8eef6', O='#8a929e', h='#2a2e36', x='#c8ccd4', s='#8ad0ff', q='#4a8ac0', e='#ffd84a', r='#c8ccd4', R='#6a7280', i='#ff4a3a', d='#aab2be', D='#4a505c'),
    'C': dict(a='#9aaa62', b='#6a7a3a', c='#3a4620', l='#6a7a3a', m='#2e3a18', k='#3a3020', K='#1e1810', p='#4a4a3a', P='#26261c',
              o='#4a4a40', O='#22221c', h='#0c0c08', x='#a8a890', s='#e8e0c0', q='#a89a70', e='#e87a2a', g='#8a8a78', d='#3a3a30', D='#16160e',
              j='#f08a2a', J='#a84a14', y='#8a6a3a', Y='#2a3018'),
    'D': dict(a='#7a7a8a', b='#34343e', c='#18181e', l='#30303a', m='#121218', k='#3a2a2a', K='#1c1414', p='#f0c050', P='#9a6a18',
              o='#ffd860', O='#a87018', h='#3a2208', x='#ff4a4a', s='#ff5a4a', q='#a82a2a', e='#ffd860', g='#8a8a96', r='#3a3a44', R='#1a1a22', i='#8aff5a', d='#34343e', D='#121216'),
}
ACC = {'A': [], 'B': SIGHT_RING + STAB_LONG, 'C': STAB_RIB + SLING, 'D': SIGHT_BOX + STAB_SHORT}
CAM = {'A': 'spoke4', 'B': 'ring', 'C': 'spoke2', 'D': 'spoke2'}
RISER = [(8, 5), (9, 5), (10, 5), (7, 6), (9, 6), (6, 7), (7, 7), (8, 7), (9, 7), (5, 8), (7, 8), (5, 9), (6, 9), (7, 9), (5, 10)]
LIMB = [(x, y) for x in (11, 12, 13) for y in (3, 4)] + [(y, x) for x in (11, 12, 13) for y in (3, 4)]
def pattern(ic, kind, cells=None):
    """라이저 · 림 무늬 (x ↔ y 대칭으로 고른다)"""
    cells = cells or (RISER + LIMB)
    for (x, y) in cells:
        if (x, y) not in ic.body or ic.body[(x, y)] in 'kKgW': continue
        a, b = min(x, y), max(x, y)
        if kind == 'camo':
            h = (a * 5 + b * 3) % 5
            if h == 1: ic.body[(x, y)] = 'y'
            elif h == 3 and ic.body[(x, y)] in 'bcm': ic.body[(x, y)] = 'Y'
        elif kind == 'stripe':                                                  # 줄무늬: 라이저 · 림을 가로지르는 띠 (가운데 · 빛 칸만, 넷에 하나)
            if (a + b) % 4 == 0 and ic.body[(x, y)] in 'abl': ic.body[(x, y)] = 'y'
        elif kind == 'scale':                                                   # 비늘: 한 칸 걸러 밝은 비늘 끝
            if (a + 2 * b) % 4 == 0 and ic.body[(x, y)] in 'bm': ic.body[(x, y)] = 'y'
def build(st, pal, cam=None, win2=None, acc=None, guard=True, pat=None, deco=(), fx=(), loop='e', cable=True):
    P0 = dict(BASE); P0.update(PAL[st]); P0.update(pal)
    ic = Ico(P0)
    put_grid(ic, BODY)
    if win2 or (win2 is None and st == 'B'): ic.body.pop((9, 5), None); ic.body.pop((5, 9), None)
    cs = cam or CAM[st]
    if cs != 'spoke4': cam_style(ic, cs)
    if pat: pattern(ic, pat)
    add(ic, ACC[st] if acc is None else acc)
    for (x, y, ch) in deco: ic.body[(x, y)] = ch
    strings(ic, loop=loop, guard='g' if guard else None, cable=cable)
    for (x, y, ch) in fx:
        if (x, y) not in ic.body: ic.fx[(x, y)] = ch
    return ic
def sym(cells):
    """(x, y, 글자) → 대칭 짝까지"""
    out = list(cells)
    for (x, y, ch) in cells:
        if (y, x, ch) not in out: out.append((y, x, ch))
    return out
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
# ── 1묶음 ──
@make(1, 'A', '참나무 도르래 활', '참나무 라이저 · 쇠 림 포켓 · 놋쇠 캠 · 가죽 손잡이 — 처음 잡는 도르래 활')
def c01(): return build('A', dict(a='#e8c08a', b='#b88a52', c='#7a5430'))
@make(10, 'C', '덤불 사냥 활', '풀 · 흙 얼룩 · 검은 캠 · 고무 스태빌라이저 · 주황 손목 끈')
def c10(): return build('C', {}, pat='camo')
@make(20, 'B', '강철 과녁 활', '창 뚫린 강철 라이저 · 고리 캠 · 조준기 · 긴 스태빌라이저 · 푸른 시위')
def c20(): return build('B', {})
@make(30, 'D', '흑철 도르래 활', '검은 쇠 라이저 · 금 포켓 · 금 캠(붉은 축) · 붉은 시위')
def c30(): return build('D', {})
# ── 2묶음 ──
@make(40, 'B', '서리 과녁 활', '얼음빛 라이저 · 남빛 림 · 서리 고리 캠 · 물빛 핀 조준기 — 둘레에 서리가 반짝인다')
def c40(): return build('B', dict(a='#f4fbff', b='#c8e8f8', c='#6aa8d0', l='#2a4a7a', m='#162a4a', p='#a8d0ec', P='#4a7aa8', o='#f4fbff', O='#8ac0e0',
                                  h='#1a3a5a', x='#ffffff', k='#2a3a5a', K='#16203a', s='#d8f8ff', q='#7ac4ec', e='#ffffff', r='#e8f4ff', R='#7aa8c8',
                                  i='#8af0ff', d='#c8e8f8', D='#4a7aa8', **{'1': '#ffffff', '2': '#bdeeff'}),
                            fx=[(12, 1, '1'), (19, 7, '2'), (7, 18, '2'), (1, 12, '1')])
@make(50, 'A', '단풍 도르래 활', '붉게 물든 단풍나무 라이저 · 구릿빛 캠 · 크림빛 시위 — 단풍잎 하나가 날린다')
def c50(): return build('A', dict(a='#ffb070', b='#d0602a', c='#8a2e14', l='#8a3a1e', m='#4a1a0c', o='#f0b070', O='#a85a20', h='#3a1a08', x='#3a1a08',
                                  s='#fff0d8', q='#d8b080', e='#ffd84a', p='#e8d0b0', P='#8a6a4a', **{'1': '#ff8a3a', '2': '#ffd84a'}),
                            fx=[(12, 6, '1'), (13, 6, '2'), (1, 13, '1')])
@make(60, 'D', '용비늘 도르래 활', '붉은 용비늘 라이저 · 금 캠(불씨 축) · 주황 시위 — 불씨가 튄다')
def c60(): return build('D', dict(a='#f07a4a', b='#8a1e14', c='#4a0c08', y='#e0503a', l='#5a1a14', m='#2a0a08', p='#ffd860', P='#a87018', o='#ffd860', O='#c87018',
                                  h='#5a1a08', x='#ff8a1a', s='#ffb040', q='#c85a1a', e='#ffffff', r='#5a1a14', R='#2a0a08', i='#ffb040', d='#5a1a14', D='#2a0a08',
                                  **{'1': '#ffd84a', '2': '#ff6a1a'}),
                            pat='scale', fx=[(19, 2, '1'), (13, 0, '2'), (11, 6, '2')])
@make(70, 'C', '설원 사냥 활', '눈밭 얼룩(흰 · 잿빛) 라이저와 림 · 검은 캠 · 붉은 손목 끈 — 눈 속에 숨는다')
def c70(): return build('C', dict(a='#f4f8fc', b='#c8d0dc', c='#7a8494', y='#9aa4b4', Y='#5a6272', l='#c8d0dc', m='#6a7484', p='#5a6270', P='#30343c',
                                  o='#5a6270', O='#2a2e36', h='#121418', x='#e8eef6', k='#4a505c', K='#262a32', s='#ffffff', q='#c8d0dc', j='#e8402a', J='#8a1a10',
                                  d='#6a7484', D='#30343c', e='#e8402a'), pat='camo')
# ── 3묶음 ──
@make(80, 'C', '그림자 사냥 활', '검보라 그림자 얼룩 · 보랏빛 시위 · 보라 손목 끈 · 빛나는 오늬 자리 — 둘레에 그림자 불씨')
def c80(): return build('C', dict(a='#6a5a8a', b='#3a2e52', c='#1e182e', y='#5a4a80', Y='#120e1c', l='#3a2e52', m='#16121e', p='#5a4a7a', P='#2a2240',
                                  o='#3a2e52', O='#16121e', h='#0a0810', x='#c89aff', k='#2a2238', K='#14101c', s='#e0d0ff', q='#8a6ac8', j='#b88aff', J='#6a3ab8',
                                  d='#3a2e52', D='#16121e', e='#c89aff', **{'1': '#c89aff', '2': '#6a3ab8'}),
                            pat='camo', fx=[(12, 1, '1'), (1, 12, '2'), (19, 8, '2')])
@make(90, 'A', '세계수 도르래 활', '세계수의 금빛 나무 라이저 · 금 캠(초록 보석 축) · 초록 가죽 손잡이 — 포켓에 새잎이 돋았다')
def c90(): return build('A', dict(a='#f8e8b0', b='#d8b870', c='#9a7a3a', l='#a89a50', m='#5a5020', p='#ffd860', P='#a87018', o='#ffe890', O='#c8901a',
                                  h='#5a3a08', x='#7ae880', k='#4a7a3a', K='#2a4a1e', s='#f0ffe8', q='#a8d890', e='#7ae880', n2='#8ae070', N2='#3a9a48',
                                  **{'1': '#fff0a0'}),
                            deco=sym([(8, 2, 'n2'), (8, 3, 'N2')]), fx=[(12, 0, '1'), (0, 12, '1')])
@make(100, 'D', '번개 도르래 활', '먹빛 쇠 라이저에 번개 무늬 · 노란 캠(흰 축) · 노란 시위 — 캠에서 불똥이 튄다')
def c100(): return build('D', dict(a='#8a8a9a', b='#3a3a48', c='#1a1a22', p='#fff36a', P='#c0901a', o='#fff36a', O='#c0901a', h='#3a2a08', x='#ffffff',
                                   s='#fff36a', q='#c0901a', e='#ffffff', i='#fff36a', z2='#fff36a', **{'1': '#ffffff', '2': '#fff36a'}),
                             deco=sym([(8, 7, 'z2'), (9, 6, 'z2')]), fx=[(19, 1, '1'), (13, 1, '2'), (19, 6, '2'), (1, 19, '1')])
@make(110, 'B', '수정 과녁 활', '분홍 수정 라이저 · 수정 고리 캠 · 흰 시위 · 무지개 핀 조준기 — 빛이 갈라져 반짝인다')
def c110(): return build('B', dict(a='#fff0ff', b='#e8b8f0', c='#a86ac8', l='#c88ae0', m='#7a3a9a', p='#e8eef6', P='#a8b0bc', o='#fff0ff', O='#c88ae0',
                                   h='#5a2a7a', x='#ffffff', k='#7a3a9a', K='#4a1a6a', s='#ffffff', q='#e8a8f0', e='#ffffff', r='#ffffff', R='#c8a8e0',
                                   i='#8af0ff', d='#e8b8f0', D='#a86ac8', **{'1': '#ffffff', '2': '#ffd0ff'}),
                             fx=[(12, 1, '1'), (19, 7, '2'), (8, 18, '1')])
# ── 4묶음 ──
@make(120, 'B', '천공 과녁 활', '흰 · 금 라이저 · 하늘빛 림 · 흰 고리 캠(금 축) · 금빛 시위 · 별 핀 조준기 — 둘레에 별')
def c120(): return build('B', dict(a='#ffffff', b='#e8eef6', c='#a8b8d0', l='#5ab0f0', m='#2a6ab8', p='#ffe890', P='#c8901a', o='#ffffff', O='#c8d8f0',
                                   h='#c8901a', x='#ffe890', k='#2a6ab8', K='#163a7a', s='#ffe890', q='#8ad0ff', e='#ffffff', r='#ffe890', R='#c8901a',
                                   i='#ffffff', d='#ffffff', D='#c8d8f0', **{'1': '#ffffff', '2': '#ffe890'}),
                             fx=[(12, 0, '1'), (19, 8, '2'), (9, 19, '1'), (13, 7, '2')])
@make(130, 'C', '맹호 사냥 활', '범 무늬(주황 · 검은 줄) 라이저와 림 · 검은 캠(주황 축) · 붉은 손목 끈 — 큰 짐승을 쫓는 사냥꾼의 활')
def c130(): return build('C', dict(a='#ffc060', b='#f08a24', c='#9a4410', y='#1a1210', l='#f08a24', m='#7a3008', p='#3a3a30', P='#1e1e18', o='#3a3a32',
                                   O='#16160e', h='#000000', x='#ffb04a', k='#3a2414', K='#1e120a', s='#fff0d8', q='#d8a060', j='#c83a1a', J='#6a1a0a',
                                   d='#2a2a24', D='#121210', e='#ffffff'), pat='stripe')
@make(140, 'D', '심연 도르래 활', '검은 라이저에 보랏빛 룬 · 보라 캠(빛나는 축) · 빛나는 보라 시위 — 둘레에 어둠 빛이 떠돈다')
def c140(): return build('D', dict(a='#4a3a6a', b='#1e1630', c='#0c0816', l='#2a2040', m='#0c0816', p='#a87ae8', P='#5a3a9a', o='#b88aff', O='#6a3ab8',
                                   h='#1e1030', x='#ffffff', s='#e0c8ff', q='#8a5ad8', e='#ffffff', r='#2a2040', R='#0c0816', i='#e0c8ff', d='#2a2040', D='#0c0816',
                                   u2='#c89aff', **{'1': '#e0c8ff', '2': '#8a5ad8'}),
                             deco=sym([(8, 7, 'u2'), (8, 5, 'u2')]), fx=[(12, 1, '1'), (19, 8, '2'), (13, 7, '1'), (1, 19, '2')])
@make(150, 'A', '태양목 도르래 활', '해처럼 빛나는 금빛 나무 라이저 · 흰 금 포켓 · 금 캠(붉은 해 축) · 붉은 손잡이 — 캠에서 햇살이 뻗는다')
def c150(): return build('A', dict(a='#fffbd8', b='#ffd860', c='#c88a1a', l='#e8a030', m='#9a5a10', p='#ffffff', P='#e8c060', o='#fff0a0', O='#e0a020',
                                   h='#a85a08', x='#ff5a2a', k='#c83a1a', K='#7a1a0a', s='#fffbe0', q='#ffd860', e='#ff5a2a', **{'1': '#ffffff', '2': '#fff0a0'}),
                             fx=[(19, 1, '1'), (13, 0, '2'), (19, 7, '2'), (0, 13, '2'), (1, 19, '1'), (7, 19, '2')])
def icon(d):
    r = d['fn']()
    return (r[0] if isinstance(r, tuple) else r)
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = [(icon(d).render(), str(d['lv'])) for d in G]
    zoomsheet(out[:8], 'cbow16_z1.png', z=9); zoomsheet(out[8:], 'cbow16_z2.png', z=9)
