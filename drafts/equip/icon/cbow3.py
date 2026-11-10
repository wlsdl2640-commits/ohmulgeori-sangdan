"""컴파운드 보우 원형 시안 2 (11-10 23:40 사용자: 「컴파운드보우 이미지 보고 좀더 자세하게 디테일 넣어서」).
사용자 참고 사진에서 부위 · 짜임만 따랐다(게임 속 활 · 상표 무늬는 베끼지 않음). 칼 좌표(wic.py): s = 축을 따라(아래 캠 → 위 캠),
t = 옆(− = 왼쪽 위 = 활 앞 · 과녁 쪽, + = 오른쪽 아래 = 시위 · 쏘는 사람 쪽), 단위 = 화면 픽셀.
짜임(세로로 세운 사진을 45° 눕힌 것):
  시위 t = TS 곧은 줄(효과) · 캠 둘(시위가 바깥에 닿는 바퀴, 축 · 구멍) · 림(짧고 굵은 팔 — 화면에서 위 팔은 가로, 아래 팔은 세로)
  · 림 포켓(팔이 끼는 쇠 덩이) · 라이저(포켓에서 손잡이로 「〉」꼴 — 손잡이가 시위 쪽으로 들어간다) · 라이저 창
  · 핸들(손잡이) · 화살 받침 · 케이블(시위 안쪽 한 줄) · 케이블 가이드(라이저에서 케이블까지 막대)
  · 갈래마다: 조준기(손잡이 위에서 앞으로 뻗은 받침 + 고리 · 빛 핀) · 스태빌라이저(손잡이 아래에서 앞으로 막대 + 추) · 손목 끈.
글자(몸): 라이저 a b c · 창 W · 포켓 p P · 림 l m n · 손잡이 k K · 캠 o O · 캠 구멍 h · 축 x · 받침 g · 조준 r R · 핀 i · 스태빌 d D · 끈 j J
글자(효과): 시위 s · 케이블 q · 가이드 g · 고리 e"""
import math
from wic import Ico, N, st, xy
TS = 2.3                     # 시위 줄
MID = 12.02                  # 가운데 (손잡이) s
def bez(p0, p1, p2, n=60):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in (i / n for i in range(n + 1))]
class CBow:
    """반쪽(위) 짜임을 정하면 아래는 s ↔ 2·MID − s 로 똑같이"""
    def __init__(s, cam=7.8, rc=2.2, pk=(6.0, -3.9), grip=-2.3, hr=(1.55, 1.35), hl=(1.05, 0.85), lb=0.6, ts=TS):
        s.cam, s.rc, s.pk, s.grip, s.hr, s.hl, s.lb, s.ts = cam, rc, pk, grip, hr, hl, lb, ts
        s.camc = (MID + cam, ts - rc)                         # 위 캠 가운데 (s, t)
        s.pts = []                                            # (s, t, 반폭, 부위, 0..1)
        top = (MID + pk[0], pk[1])
        for i, (a, b) in enumerate(bez((MID, grip), (MID + pk[0] * 0.55, grip - 0.15), top, 40)):
            k = i / 40.0; s.pts.append((a, b, hr[0] + (hr[1] - hr[0]) * k, 'riser', k))
        ctrl = (top[0] + (s.camc[0] - top[0]) * 0.35, top[1] - lb)
        for i, (a, b) in enumerate(bez(top, ctrl, s.camc, 40)):
            k = i / 40.0; s.pts.append((a, b, hl[0] + (hl[1] - hl[0]) * k, 'limb', k))
    def near(s, S, T):
        S2 = S if S >= MID else 2 * MID - S                   # 아래 반은 위로 접어서
        best = (1e9, None)
        for p in s.pts:
            d = math.hypot(S2 - p[0], T - p[1])
            if d < best[0]: best = (d, p)
        return best
    def rt(s, S):
        """라이저 가운데 줄 t (손잡이 ~ 포켓)"""
        S2 = abs(S - MID)
        if S2 >= s.pk[0]: return s.pk[1]
        best = min(s.pts[:41], key=lambda p: abs(p[0] - MID - S2)); return best[1]
def paint(ic, C, cols, pocket=1.0, grip=1.7):
    """몸 칠하기: cols = dict(riser='abc', limb='lmn', pocket='pP', grip='kK') — 빛(왼쪽 위, t −) · 가운데 · 그늘"""
    for y in range(N):
        for x in range(N):
            S, T = st(x, y)
            d, p = C.near(S, T)
            if p is None or d > p[2] + 1e-6: continue
            ps, pt, hw, part, k = p
            off = T - pt
            if part == 'riser' and abs(abs(S - MID) - C.pk[0]) <= pocket: part = 'pocket'
            elif part == 'limb' and k < 0.18: part = 'pocket'
            elif part == 'riser' and abs(S - MID) <= grip: part = 'grip'
            r = cols[part]
            ic.body[(x, y)] = r[0] if off < -hw / 3 else (r[-1] if off > hw / 3 else r[min(1, len(r) - 1)])
def windows(ic, C, ss, ch=None, half=0.55):
    """라이저 창: s 목록 가까이 · 라이저 가운데 줄 둘레를 비움(ch None) 또는 글자"""
    for (x, y) in list(ic.body):
        S, T = st(x, y)
        for q in ss:
            if abs(S - q) <= 0.75 and abs(T - C.rt(S)) <= half:
                if ch: ic.body[(x, y)] = ch
                else: del ic.body[(x, y)]
                break
def cams(ic, C, chs=('o', 'O'), hub='x', hole='h', holes=((-2.4, 1.3), (0.75, 1.3)), mod=None):
    """캠: 반지름 rc 바퀴 · 가운데 축 · 구멍(각도, 반지름 — 위 캠 기준, 아래 캠은 x ↔ y로 뒤집어 같은 꼴)"""
    for top in (True, False):
        cs = C.camc[0] if top else 2 * MID - C.camc[0]
        cx, cy = xy(cs, C.camc[1])
        for y in range(N):
            for x in range(N):
                dx, dy = x + .5 - cx, y + .5 - cy
                if not top: dx, dy = dy, dx
                d = math.hypot(dx, dy)
                if d > C.rc + 0.12: continue
                if d < 0.62: ch = hub
                else:
                    a = math.atan2(dy, dx); ch = None
                    for (ang, rr) in holes:
                        if abs(d - rr) < 0.5 and abs((a - ang + math.pi) % (2 * math.pi) - math.pi) < 0.55: ch = hole
                    if ch is None: ch = chs[0] if dx + dy < -0.35 else chs[1]
                ic.body[(x, y)] = ch
def fxline(ic, a, b, ch, over=False):
    """칼 좌표 a → b 화면 한 칸 줄 (효과 층)"""
    (x0, y0), (x1, y1) = xy(*a), xy(*b)
    x0 -= .5; y0 -= .5; x1 -= .5; y1 -= .5
    n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
    for k in range(n + 1):
        t = k / n; x = math.floor(x0 + (x1 - x0) * t + 0.5); y = math.floor(y0 + (y1 - y0) * t + 0.5)
        if 0 <= x < N and 0 <= y < N and (over or (x, y) not in ic.body): ic.fx[(x, y)] = ch
def strings(ic, C, sch='s', qch='q', cable=1.9, loop=None):
    a, b = 2 * MID - C.camc[0], C.camc[0]
    fxline(ic, (a, C.ts), (b, C.ts), sch)
    if cable: fxline(ic, (a + 0.9, C.ts - cable), (b - 0.9, C.ts - cable), qch)
    for (S, ch) in (loop or []):
        x, y = xy(S, C.ts); ic.fx[(math.floor(x), math.floor(y))] = ch
def guard(ic, C, S=MID - 3.4, ch='g', cable=1.9):
    t0 = C.rt(S) + C.hr[0] - 0.2
    fxline(ic, (S, t0), (S, C.ts - cable + 0.4), ch)
def rest(ic, C, S=MID + 2.1, ch='g'):
    x, y = xy(S, C.rt(S) + C.hr[0] + 0.8); ic.body[(math.floor(x), math.floor(y))] = ch
def sight(ic, C, S=MID + 3.6, reach=3.4, r=1.25, chs=('r', 'R'), pin='i', bar='R'):
    """조준기: 라이저 앞 가장자리에서 앞(t −)으로 받침 → 고리(테 + 빛 핀)"""
    t0 = C.rt(S) - C.hr[0] + 0.3
    for k in range(int(reach * 2) + 1):
        x, y = xy(S, t0 - k * 0.5); ic.body[(math.floor(x), math.floor(y))] = bar
    cx, cy = xy(S, t0 - reach - r)
    for y in range(N):
        for x in range(N):
            d = math.hypot(x + .5 - cx, y + .5 - cy)
            if d <= r + 0.25: ic.body[(x, y)] = pin if d < 0.6 else (chs[0] if (x + .5 - cx) + (y + .5 - cy) < 0 else chs[1])
def stab(ic, C, S=MID - 2.3, reach=5.0, chs=('d', 'D'), w=0.55, tip=1.6, tw=1.05, ribs=()):
    """스태빌라이저: 라이저 앞 가장자리에서 앞으로 막대 + 끝 추"""
    t0 = C.rt(S) - C.hr[0] + 0.4
    for y in range(N):
        for x in range(N):
            S2, T2 = st(x, y)
            if T2 > t0 or T2 < t0 - reach: continue
            far = T2 < t0 - reach + tip
            hw = tw if far else w
            if any(abs(T2 - (t0 - q)) < 0.45 for q in ribs): hw += 0.35
            if abs(S2 - S) <= hw: ic.body[(x, y)] = chs[0] if S2 < S else chs[1]
def sling(ic, C, S=MID - 1.2, chs=('j', 'J')):
    """손목 끈: 손잡이 아래 시위 쪽에 늘어진 고리"""
    t0 = C.rt(S) + C.hr[0]
    for (ds, dt, k) in ((0, 0.7, 0), (-0.7, 1.4, 1), (-1.4, 1.4, 0), (-2.0, 0.8, 1)):
        x, y = xy(S + ds, t0 + dt); ic.body[(math.floor(x), math.floor(y))] = chs[k]
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
COLS = dict(riser='abc', limb='lmn', pocket='pP', grip='kK')
BASE = dict(a='#e8eef6', b='#a8b0bc', c='#5a6270', W='#1a1414', p='#a8b0bc', P='#5a6270', l='#5a5a66', m='#3a3a44', n='#22222a',
            k='#5a3a22', K='#3a2414', o='#e0b050', O='#8a6418', h='#3a2a10', x='#2a1e14', g='#c8ccd4', r='#3a3a44', R='#22222a', i='#9aff6a',
            d='#4a4a56', D='#22222a', j='#e87a2a', J='#9a4a14', s='#ffffff', q='#a8b0bc', e='#ff4a4a')
@frm('A', '나무 도르래 활', '결 고운 나무 라이저(창 둘) · 쇠 림 포켓 · 짙은 나무 림 · 놋쇠 캠(구멍 둘) · 가죽 손잡이 · 케이블 가이드 · 붉은 오늬 자리')
def kA():
    C = CBow(); ic = Ico(BASE); ic.fx = {}
    paint(ic, C, COLS); windows(ic, C, (MID + 3.6, MID - 3.6)); cams(ic, C); rest(ic, C)
    strings(ic, C, loop=[(MID + 0.4, 'e')]); guard(ic, C)
    ic.pal.update(a='#d8a070', b='#a06a3c', c='#6a4220', l='#7a5232', m='#5a3a1e', n='#3a2410', k='#6a4428', K='#3a2414', q='#c8bca0', e='#c8322a')
    return C, ic
@frm('B', '쇠 과녁 활', '창이 줄지어 뚫린 쇠 라이저 · 검은 림 · 바퀴살 쇠 캠 · 앞으로 뻗은 조준기(고리 + 붉은 핀) · 긴 스태빌라이저 · 푸른 시위')
def kB():
    C = CBow(); ic = Ico(BASE); ic.fx = {}
    paint(ic, C, COLS); windows(ic, C, (MID + 2.9, MID + 4.4, MID - 2.9, MID - 4.4)); cams(ic, C, ('a', 'c'), 'W', 'W', ((-2.4, 1.3), (0.75, 1.3), (2.3, 1.3)))
    rest(ic, C); sight(ic, C, reach=3.0); stab(ic, C, reach=6.5)
    strings(ic, C, loop=[(MID + 0.4, 'e')]); guard(ic, C)
    ic.pal.update(l='#3a3a44', m='#26262e', n='#16161c', k='#2a2a32', K='#16161c', s='#8ad0ff', q='#5a9ad0', e='#ffd84a',
                  r='#c8ccd4', R='#7a8290', i='#ff5a3a', d='#a8b0bc', D='#4a505c')
    return C, ic
@frm('C', '덤불 사냥 활', '풀 · 흙 · 나무껍질 얼룩 라이저와 림 · 검은 캠 · 짧은 고무 스태빌라이저(마디) · 주황 손목 끈 — 숲에서 몸을 숨긴다')
def kC():
    C = CBow(); ic = Ico(BASE); ic.fx = {}
    paint(ic, C, COLS)
    for (x, y), ch in list(ic.body.items()):
        if ch in 'pPkK': continue
        h = (x * 3 + y * 5 + (x // 2) * 7) % 6
        if h == 0: ic.body[(x, y)] = 'e2'
        elif h == 3: ic.body[(x, y)] = 'e3'
    cams(ic, C, ('m', 'n'), 'g', 'h'); rest(ic, C); stab(ic, C, reach=3.6, ribs=(1.0, 2.0)); sling(ic, C)
    strings(ic, C, loop=[(MID + 0.4, 'j')]); guard(ic, C)
    ic.pal.update(a='#8a9a5a', b='#5a6a34', c='#34401c', l='#6a7a40', m='#2a2a22', n='#16160e', e2='#8a6a3a', e3='#2a3018',
                  k='#3a3020', K='#1e1810', h='#0c0c08', p='#3a3a30', P='#1e1e18', d='#2a2a24', D='#121210', q='#b8b090', s='#e8e0c0', g='#8a8a80')
    return C, ic
@frm('D', '검은 도르래 활', '검은 쇠 라이저(빛 한 줄 · 창 둘) · 금 림 포켓 · 금 캠(붉은 축) · 붉은 시위와 케이블 · 짧은 조준기(초록 빛 핀) · 스태빌라이저')
def kD():
    C = CBow(); ic = Ico(BASE); ic.fx = {}
    paint(ic, C, COLS); windows(ic, C, (MID + 3.6, MID - 3.6)); cams(ic, C, ('o', 'O'), 'e', 'h'); rest(ic, C)
    sight(ic, C, reach=2.2, r=1.1); stab(ic, C, reach=4.6)
    strings(ic, C, 'e', 'E', loop=[(MID + 0.4, 'o')]); guard(ic, C)
    ic.pal.update(a='#6a6a78', b='#30303a', c='#16161c', l='#26262e', m='#16161c', n='#0c0c10', p='#c8a040', P='#7a5a18',
                  k='#3a2a2a', K='#1c1414', o='#ffd860', O='#a87018', h='#5a3a0a', e='#ff4a4a', E='#b82a2a', g='#8a8a96', r='#30303a', R='#16161c',
                  i='#8aff5a', d='#30303a', D='#121216')
    return C, ic
def icon(d):
    C, ic = d['fn']()
    return C, ic
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in FR:
        C, ic = icon(d)
        out.append((ic.render(), '도르래 ' + d['key']))
    zoomsheet(out, 'cbow3_z.png', z=14)
