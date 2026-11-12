"""컴파운드 보우 원형 시안 2 (11-10 23:40 사용자: 「컴파운드보우 이미지 보고 좀더 자세하게 디테일 넣어서」) — 손그림 칸.
사용자 참고 사진에서 부위 · 짜임만 따랐다(게임 속 활 · 상표 무늬는 베끼지 않음). 세로로 세운 활을 45° 눕힌 꼴, 몸은 x ↔ y 대칭:
  캠(바퀴 · 바퀴살 구멍 넷 · 축) 오른쪽 위 · 왼쪽 아래 구석 · 림(팔) 짧고 굵게 · 림 포켓(쇠) · 라이저(포켓 → 손잡이 「〉」꼴 · 창 둘)
  · 핸들(손잡이) · 화살 받침 · 시위(바깥, x + y = 23) · 케이블(안쪽, x + y = 20) · 케이블 가이드(손잡이 아래 라이저 → 케이블).
  갈래마다 덧붙이기: 조준기(손잡이 위, 앞 = 왼쪽 위로 뻗은 받침 + 고리 · 빛 핀) · 스태빌라이저(손잡이 아래, 앞으로 막대 + 추) · 손목 끈 · 오늬 자리.
글자(몸): 라이저 a b c · 포켓 p P · 림 l m · 손잡이 k K · 캠 o O · 캠 구멍 h · 축 x · 받침 g · 조준 r R · 핀 i · 스태빌 d D · 끈 j J
글자(효과, 테두리 없음): 시위 s · 케이블 q · 가이드 g · 오늬 자리 e"""
from wic import Ico, N
BODY = """
....................
....................
.........pp....ooo..
.........pPlllohohO.
.........PPmmmooxOO.
........abc...ohOhO.
.......a.c.....OOO..
......aabc..........
.....a.bkKg.........
..ppPbccK...........
..pPPc..............
...lm...............
...lm...............
...lm...............
...ooo..............
..ohohO.............
..ooxOO.............
..ohOhO.............
...OOO..............
...................."""
def rows(t): return [r for r in t.strip('\n').split('\n')]
def put_grid(ic, t, layer='body'):
    L = getattr(ic, layer)
    for y, r in enumerate(rows(t)):
        for x, ch in enumerate(r):
            if ch == '.': continue
            if ch == '_': L.pop((x, y), None); continue
            L[(x, y)] = ch
def strings(ic, sch='s', qch='q', loop='e', guard='g', cable=True, guard_at=((6, 10), (7, 11))):
    for x in range(7, 17): ic.fx[(x, 23 - x)] = sch
    if cable:
        for x in range(6, 15):
            if (x, 20 - x) not in ic.body: ic.fx[(x, 20 - x)] = qch
    if loop: ic.fx[(12, 11)] = loop
    if guard:
        for p in guard_at:
            if p not in ic.body: ic.fx[p] = guard
def check_sym(ic, skip=()):
    """몸이 x ↔ y 대칭인지 (덧붙이기 칸은 skip)"""
    bad = []
    for (x, y), ch in ic.body.items():
        if (x, y) in skip or (y, x) in skip: continue
        if ic.body.get((y, x)) != ch: bad.append((x, y, ch, ic.body.get((y, x))))
    return bad
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(a='#e8eef6', b='#a8b0bc', c='#5a6270', p='#c8ccd4', P='#6a7280', l='#5a5a66', m='#2e2e38',
            k='#5a3a22', K='#3a2414', o='#e0b050', O='#8a6418', h='#2a1a08', x='#2a1e14', g='#c8ccd4', r='#3a3a44', R='#22222a', i='#9aff6a',
            d='#4a4a56', D='#22222a', j='#e87a2a', J='#9a4a14', s='#ffffff', q='#a8a090', e='#ff4a4a')
@frm('A', '나무 도르래 활', '결 고운 나무 라이저(창 둘) · 쇠 림 포켓 · 짙은 나무 림 · 놋쇠 캠(바퀴살 구멍 넷) · 가죽 손잡이 · 케이블 가이드 · 붉은 오늬 자리')
def kA():
    ic = Ico(dict(BASE, a='#e0aa78', b='#a86e40', c='#6a4220', l='#8a5a34', m='#4a2e14', k='#6a4428', K='#3a2414', q='#b8ac90', e='#e0402a'))
    put_grid(ic, BODY); strings(ic)
    return ic, ((10, 8),)
# 덧붙이기 (한쪽만 — 대칭 검사에서 뺀다): (x, y, 글자)
SIGHT_RING = [(7, 4, 'R'), (6, 3, 'R'), (3, 1, 'r'), (4, 1, 'r'), (5, 1, 'r'), (3, 2, 'r'), (4, 2, 'i'), (5, 2, 'R'), (3, 3, 'R'), (4, 3, 'R'), (5, 3, 'R')]
SIGHT_BOX = [(7, 4, 'R'), (6, 3, 'r'), (7, 3, 'R'), (6, 2, 'i'), (5, 3, 'r'), (5, 2, 'r'), (6, 1, 'r')]
STAB_LONG = [(4, 8, 'd'), (3, 7, 'd'), (2, 6, 'd'), (1, 5, 'D'), (1, 4, 'd'), (2, 5, 'D')]
STAB_SHORT = [(4, 8, 'd'), (3, 7, 'D'), (2, 6, 'd'), (2, 7, 'D'), (1, 6, 'D')]
STAB_RIB = [(4, 8, 'd'), (3, 7, 'D'), (3, 8, 'D'), (2, 6, 'd'), (1, 5, 'D'), (2, 5, 'D')]
SLING = [(7, 10, 'J'), (8, 10, 'j'), (9, 10, 'J'), (9, 9, 'j')]
def cam_style(ic, style):
    """캠 무늬 바꾸기 (위 캠 가운데 (16, 4), 아래 캠 (4, 16)): spoke4 = 구멍 넷(기본) · spoke2 = 구멍 둘(엇갈림) · ring = 밝은 테 + 어두운 안 + 밝은 축"""
    for (cx, cy) in ((16, 4), (4, 16)):
        inner = [(cx + dx, cy + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)]
        if style == 'spoke2':
            for (x, y) in inner:
                if (x, y) != (cx, cy): ic.body[(x, y)] = 'o' if (x - cx) + (y - cy) < 0 else 'O'
            for (dx, dy) in ((1, -1), (-1, 1)): ic.body[(cx + dx, cy + dy)] = 'h'
        elif style == 'ring':
            for (x, y) in inner:
                if (x, y) != (cx, cy): ic.body[(x, y)] = 'h'
            ic.body[(cx, cy)] = 'x'
def add(ic, cells):
    for (x, y, ch) in cells: ic.body[(x, y)] = ch
    return tuple((x, y) for (x, y, ch) in cells)
@frm('B', '쇠 과녁 활', '긴 창이 뚫린 쇠 라이저 · 검은 림 · 쇠 바퀴살 캠 · 앞으로 뻗은 조준기(고리 + 붉은 핀) · 긴 스태빌라이저(끝 추) · 푸른 시위')
def kB():
    ic = Ico(dict(BASE, a='#eef2f8', b='#aab2be', c='#5a6270', p='#5a6270', P='#30343c', l='#3a3a44', m='#1a1a22', k='#2a2a32', K='#16161c',
                  o='#e8eef6', O='#8a929e', h='#2a2e36', x='#c8ccd4', s='#8ad0ff', q='#4a8ac0', e='#ffd84a',
                  r='#c8ccd4', R='#6a7280', i='#ff4a3a', d='#aab2be', D='#4a505c'))
    put_grid(ic, BODY); ic.body.pop((9, 5)); ic.body.pop((5, 9)); cam_style(ic, 'ring')
    sk = add(ic, SIGHT_RING) + add(ic, STAB_LONG) + ((10, 8),)
    strings(ic)
    return ic, sk
@frm('C', '덤불 사냥 활', '풀 · 흙 · 나무껍질 얼룩 라이저와 림 · 검은 캠 · 마디 진 짧은 고무 스태빌라이저 · 주황 손목 끈 — 숲에서 몸을 숨긴다')
def kC():
    ic = Ico(dict(BASE, a='#9aaa62', b='#6a7a3a', c='#3a4620', l='#6a7a3a', m='#2e3a18', k='#3a3020', K='#1e1810', p='#4a4a3a', P='#26261c',
                  o='#4a4a40', O='#22221c', h='#0c0c08', x='#a8a890', s='#e8e0c0', q='#a89a70', e='#e87a2a', g='#8a8a78',
                  d='#3a3a30', D='#16160e', j='#f08a2a', J='#a84a14', y='#8a6a3a', Y='#2a3018'))
    put_grid(ic, BODY); cam_style(ic, 'spoke2')
    for (x, y), ch in list(ic.body.items()):            # 대칭 얼룩: 라이저 · 림 칸만
        if ch not in 'abclm': continue
        h = (min(x, y) * 5 + max(x, y) * 3) % 5
        if h == 1: ic.body[(x, y)] = 'y'
        elif h == 3 and ch in 'bcm': ic.body[(x, y)] = 'Y'
    sk = add(ic, STAB_RIB) + add(ic, SLING) + ((10, 8),)
    strings(ic, guard=None)
    return ic, sk
@frm('D', '검은 도르래 활', '검은 쇠 라이저(빛 한 줄 · 창 둘) · 금 림 포켓 · 금 캠(붉은 축) · 붉은 시위와 케이블 · 조준기(초록 빛 핀) · 짧은 스태빌라이저')
def kD():
    ic = Ico(dict(BASE, a='#7a7a8a', b='#34343e', c='#18181e', l='#30303a', m='#121218', k='#3a2a2a', K='#1c1414', p='#f0c050', P='#9a6a18',
                  o='#ffd860', O='#a87018', h='#3a2208', x='#ff4a4a', s='#ff5a4a', q='#a82a2a', e='#ffd860', g='#8a8a96',
                  r='#3a3a44', R='#1a1a22', i='#8aff5a', d='#34343e', D='#121216'))
    put_grid(ic, BODY); cam_style(ic, 'spoke2')
    sk = add(ic, SIGHT_BOX) + add(ic, STAB_SHORT) + ((10, 8),)
    strings(ic)
    return ic, sk
def icon(d): return d['fn']()
def text(ic):
    return '\n'.join(''.join(ic.fx.get((x, y)) or ic.body.get((x, y), '.') for x in range(N)) for y in range(N))
if __name__ == '__main__':
    import sys
    from zoomv import zoomsheet
    out = []
    for d in FR:
        ic, skip = icon(d)
        bad = check_sym(ic, skip)
        if bad: print(d['key'], 'sym', bad[:6])
        out.append((ic.render(), '도르래 ' + d['key']))
    zoomsheet(out, 'cbow5_z.png', z=16)
