"""컴파운드 보우 원형 시안 2 (11-10 23:40 사용자: 「컴파운드보우 이미지 보고 좀더 자세하게 디테일 넣어서」) — 화면 좌표로 짠 뼈대.
사용자 참고 사진에서 부위 · 짜임만 따랐다(게임 속 활 · 상표 무늬는 베끼지 않음). 세로로 세운 활을 45° 눕힌 꼴:
  위 캠은 오른쪽 위 구석, 아래 캠은 왼쪽 아래 구석(x ↔ y 대칭) · 시위는 두 캠 바깥(오른쪽 아래)에 닿는 대각선 x + y = 22
  · 림(팔)은 짧고 굵게 — 위 림은 가로, 아래 림은 세로 · 림 포켓(쇠 덩이) · 라이저는 포켓에서 손잡이로 「〉」꼴(손잡이가 시위 쪽으로 들어간다)
  · 라이저 창 · 핸들(시위 쪽으로 볼록) · 화살 받침 · 케이블(시위 안쪽 한 줄) · 케이블 가이드(라이저 → 케이블 막대)
  · 갈래마다 조준기(손잡이 위에서 앞 = 왼쪽 위로 뻗은 받침 + 고리 · 빛 핀) · 스태빌라이저(손잡이 아래에서 앞으로 막대 + 추) · 손목 끈.
글자(몸): 라이저 a b c · 포켓 p P · 림 l m n · 손잡이 k K · 캠 o O · 캠 구멍 h · 축 x · 받침 g · 조준 r R · 핀 i · 스태빌 d D · 끈 j J
글자(효과): 시위 s · 케이블 q · 가이드 g · 오늬 자리 e"""
import math
from wic import Ico, N
def seg(p, a, b):
    """점 p에서 선분 ab까지 거리, 0..1 위치, 옆(+ = 오른쪽 아래)"""
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx - ax, by - ay; L2 = dx * dx + dy * dy
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L2)) if L2 else 0.0
    cx, cy = ax + dx * t, ay + dy * t
    side = (px - cx) + (py - cy)                                           # 오른쪽 아래(시위 쪽) +
    return math.hypot(px - cx, py - cy), t, side
def mirror(p): return (p[1], p[0])
class Draw:
    """대칭(x ↔ y) 몸 그리기: 위쪽 반만 그리면 아래쪽은 뒤집어서 같이"""
    def __init__(s, pal):
        s.ic = Ico(pal); s.body = s.ic.body; s.fx = s.ic.fx
    def put(s, x, y, ch, sym=True, layer='body'):
        L = s.body if layer == 'body' else s.fx
        if 0 <= x < N and 0 <= y < N: L[(x, y)] = ch
        if sym and 0 <= y < N and 0 <= x < N: L[(y, x)] = ch
    def thick(s, a, b, hw, role, sym=True, hw1=None):
        """굵은 선분 (칸 가운데 기준). role(t, side, hw) → 글자"""
        for y in range(N):
            for x in range(N):
                d, t, side = seg((x + .5, y + .5), a, b)
                h = hw if hw1 is None else hw + (hw1 - hw) * t
                if d <= h + 1e-6:
                    ch = role(t, side, h)
                    if ch: s.put(x, y, ch, sym)
    def disc(s, c, r, role, sym=True):
        for y in range(N):
            for x in range(N):
                dx, dy = x + .5 - c[0], y + .5 - c[1]; d = math.hypot(dx, dy)
                if d <= r + 1e-6:
                    ch = role(dx, dy, d)
                    if ch: s.put(x, y, ch, sym)
    def line(s, a, b, ch, sym=True, over=False):
        """한 칸 줄 (효과 층, 칸 가운데 기준 끝점)"""
        (x0, y0), (x1, y1) = a, b
        n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
        for k in range(n + 1):
            t = k / n; x = math.floor(x0 + (x1 - x0) * t); y = math.floor(y0 + (y1 - y0) * t)
            for (X, Y) in ((x, y), (y, x)) if sym else ((x, y),):
                if 0 <= X < N and 0 <= Y < N and (over or (X, Y) not in s.body): s.fx[(X, Y)] = ch
def shade3(c):
    """빛(왼쪽 위) · 가운데 · 그늘: c = 'abc'"""
    def f(t, side, h): return c[0] if side < -h * 0.35 else (c[2] if side > h * 0.35 else c[1])
    return f
# ── 뼈대 (칸 가운데 좌표, 위쪽 반) ──
CAM = (16.2, 4.0); RC = 2.15
PK = (10.6, 3.6)              # 위 림 포켓
GR = (8.1, 8.1)               # 손잡이 (대칭 줄 위)
STRING = 22                   # 시위 칸: x + y = 22
def frame(D, cols, win=True, pocket=True, limb_bow=0.5):
    a, l, p, k = cols['riser'], cols['limb'], cols['pocket'], cols['grip']
    # 라이저: 포켓 → 손잡이
    D.thick(PK, GR, 1.45, shade3(a), hw1=1.35)
    # 림: 포켓 → 캠 (가운데가 살짝 위로 휜다)
    mid = ((PK[0] + CAM[0]) / 2 + 0.2, (PK[1] + CAM[1]) / 2 - limb_bow)
    D.thick(PK, mid, 1.05, shade3(l), hw1=0.95); D.thick(mid, CAM, 0.95, shade3(l), hw1=0.8)
    if pocket: D.disc(PK, 1.45, lambda dx, dy, d: p[0] if dx + dy < 0 else p[1])
    # 손잡이: 시위 쪽으로 볼록
    D.disc((GR[0] + 0.55, GR[1] + 0.55), 1.25, lambda dx, dy, d: k[0] if dx + dy < 0.4 else k[1], sym=False)
    D.disc((GR[0] + 0.55, GR[1] + 0.55), 1.25, lambda dx, dy, d: k[0] if dx + dy < 0.4 else k[1], sym=False)
    if win:   # 창: 라이저 가운데 줄 위 한 칸 (위 · 아래 하나씩)
        wx, wy = (PK[0] * 0.5 + GR[0] * 0.5), (PK[1] * 0.5 + GR[1] * 0.5)
        x, y = math.floor(wx), math.floor(wy)
        D.body.pop((x, y), None); D.body.pop((y, x), None)
def cams(D, chs=('o', 'O'), hub='x', hole='h', holes=((-1, -1), (1, 1)), extra=()):
    """캠: 둥근 바퀴 · 가운데 축 · 구멍(축에서 칸 거리, 위 캠 기준)"""
    D.disc(CAM, RC, lambda dx, dy, d: chs[0] if dx + dy < -0.3 else chs[1])
    cx, cy = math.floor(CAM[0]), math.floor(CAM[1])
    D.put(cx, cy, hub)
    for (dx, dy) in holes: D.put(cx + dx, cy + dy, hole)
    for (dx, dy, ch) in extra: D.put(cx + dx, cy + dy, ch)
def strings(D, sch='s', qch='q', cable=True, loop=None):
    # 시위: x + y = 22, 두 캠 사이
    for x in range(N):
        y = STRING - x
        if 0 <= y < N and (x, y) not in D.body and 5 <= x <= 17: D.fx[(x, y)] = sch
    if cable:   # 케이블: x + y = 20, 캠 안쪽에서 안쪽까지
        for x in range(N):
            y = 20 - x
            if 0 <= y < N and (x, y) not in D.body and 6 <= x <= 14: D.fx[(x, y)] = qch
    for (x, ch) in (loop or []): D.fx[(x, STRING - x)] = ch
def guard(D, ch='g', at=(6, 11), n=2):
    """케이블 가이드: 라이저(손잡이 아래)에서 케이블까지 오른쪽 아래로 짧은 막대 — 한쪽만"""
    x, y = at
    for k in range(n):
        if (x + k, y + k) not in D.body: D.fx[(x + k, y + k)] = ch
def rest(D, ch='g', at=(10, 8)):
    D.put(at[0], at[1], ch, sym=False)
def sight(D, base=(8, 4), n=3, r=1.15, chs=('r', 'R'), pin='i', bar='R'):
    """조준기: 라이저 앞(왼쪽 위) 가장자리에서 왼쪽 위로 받침 n칸 → 고리 + 빛 핀 (한쪽만 = 손잡이 위)"""
    x, y = base
    for k in range(n): D.put(x - k, y - k, bar, sym=False)
    c = (x - n - 0.5, y - n - 0.5)
    D.disc(c, r, lambda dx, dy, d: pin if d < 0.55 else (chs[0] if dx + dy < 0 else chs[1]), sym=False)
def stab(D, base=(4, 8), n=4, chs=('d', 'D'), tip=2, ribs=()):
    """스태빌라이저: 손잡이 아래 라이저 앞에서 왼쪽 위로 막대 n칸 + 끝 추(2칸 굵기)"""
    x, y = base
    for k in range(n):
        X, Y = x - k, y - k
        D.put(X, Y, chs[0] if k not in ribs else chs[1], sym=False)
        if k >= n - tip or k in ribs: D.put(X + 1, Y, chs[1], sym=False)
def sling(D, chs=('j', 'J'), cells=((7, 11), (7, 12), (8, 13), (9, 13))):
    for i, (x, y) in enumerate(cells): D.put(x, y, chs[i % 2], sym=False)
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
COLS = dict(riser='abc', limb='lmn', pocket='pP', grip='kK')
BASE = dict(a='#e8eef6', b='#a8b0bc', c='#5a6270', p='#a8b0bc', P='#5a6270', l='#5a5a66', m='#3a3a44', n='#22222a',
            k='#5a3a22', K='#3a2414', o='#e0b050', O='#8a6418', h='#3a2a10', x='#2a1e14', g='#c8ccd4', r='#3a3a44', R='#22222a', i='#9aff6a',
            d='#4a4a56', D='#22222a', j='#e87a2a', J='#9a4a14', s='#ffffff', q='#a8b0bc', e='#ff4a4a')
@frm('A', '나무 도르래 활', '결 고운 나무 라이저(창 둘) · 쇠 림 포켓 · 짙은 나무 림 · 놋쇠 캠(구멍 둘) · 가죽 손잡이 · 케이블 가이드 · 붉은 오늬 자리')
def kA():
    D = Draw(dict(BASE, a='#d8a070', b='#a06a3c', c='#6a4220', l='#8a5a34', m='#6a4224', n='#42280e', k='#6a4428', K='#3a2414', q='#c8bca0', e='#c8322a'))
    frame(D, COLS); cams(D); rest(D); strings(D, loop=[(11, 'e')]); guard(D)
    return D
@frm('B', '쇠 과녁 활', '창이 둘씩 뚫린 쇠 라이저 · 검은 림 · 바퀴살 쇠 캠 · 앞으로 뻗은 조준기(고리 + 붉은 핀) · 긴 스태빌라이저 · 푸른 시위')
def kB():
    D = Draw(dict(BASE, l='#3a3a44', m='#26262e', n='#16161c', k='#2a2a32', K='#16161c', s='#8ad0ff', q='#5a9ad0', e='#ffd84a',
                  r='#c8ccd4', R='#7a8290', i='#ff5a3a', d='#a8b0bc', D='#4a505c', o='#e8eef6', O='#7a8290', h='#22222a', x='#22222a'))
    frame(D, COLS); cams(D, holes=((-1, -1), (1, 1), (1, -1), (-1, 1))); rest(D); sight(D, n=3); stab(D, n=5)
    strings(D, loop=[(11, 'e')]); guard(D)
    return D
@frm('C', '덤불 사냥 활', '풀 · 흙 · 나무껍질 얼룩 라이저와 림 · 검은 캠 · 짧은 고무 스태빌라이저(마디) · 주황 손목 끈 — 숲에서 몸을 숨긴다')
def kC():
    D = Draw(dict(BASE, a='#8a9a5a', b='#5a6a34', c='#34401c', l='#6a7a40', m='#4a5a2a', n='#2a3418', e2='#8a6a3a', e3='#2a3018',
                  k='#3a3020', K='#1e1810', o='#3a3a32', O='#1e1e18', h='#0c0c08', x='#8a8a80', p='#3a3a30', P='#1e1e18', d='#2a2a24', D='#121210',
                  q='#b8b090', s='#e8e0c0', g='#8a8a80'))
    frame(D, COLS)
    for (x, y), ch in list(D.body.items()):
        if ch in 'pPkK': continue
        h = (min(x, y) * 3 + max(x, y) * 5 + (max(x, y) // 2) * 7) % 6      # 대칭 얼룩
        if h == 0: D.body[(x, y)] = 'e2'
        elif h == 3: D.body[(x, y)] = 'e3'
    cams(D); rest(D); stab(D, n=3, ribs=(1,)); sling(D)
    strings(D, loop=[(11, 'j')]); guard(D)
    return D
@frm('D', '검은 도르래 활', '검은 쇠 라이저(빛 한 줄 · 창 둘) · 금 림 포켓 · 금 캠(붉은 축) · 붉은 시위와 케이블 · 짧은 조준기(초록 빛 핀) · 스태빌라이저')
def kD():
    D = Draw(dict(BASE, a='#6a6a78', b='#30303a', c='#16161c', l='#30303a', m='#1e1e26', n='#0c0c10', p='#e0b040', P='#8a6418',
                  k='#3a2a2a', K='#1c1414', o='#ffd860', O='#a87018', h='#5a3a0a', x='#ff4a4a', g='#8a8a96', r='#30303a', R='#16161c',
                  i='#8aff5a', d='#30303a', D='#121216', s='#ff4a4a', q='#b82a2a', e='#ffd860'))
    frame(D, COLS); cams(D); rest(D); sight(D, n=2, r=1.0); stab(D, n=4)
    strings(D, loop=[(11, 'e')]); guard(D)
    return D
def icon(d):
    D = d['fn'](); return D, D.ic
def grid_text(ic):
    return '\n'.join(''.join(ic.fx.get((x, y), ic.body.get((x, y), '.'))[0] if (x, y) in ic.fx else ic.body.get((x, y), '.')[0] for x in range(N)) for y in range(N))
if __name__ == '__main__':
    import sys
    from zoomv import zoomsheet
    out = []
    for d in FR:
        D, ic = icon(d)
        out.append((ic.render(), '도르래 ' + d['key']))
        if 'txt' in sys.argv: print(d['key']); print(grid_text(ic))
    zoomsheet(out, 'cbow4_z.png', z=14)
