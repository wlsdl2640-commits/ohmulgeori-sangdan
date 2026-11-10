"""컴파운드 보우 원형 시안 2 (11-10 23:40 사용자: 「컴파운드보우 이미지 보고 좀더 자세하게 디테일 넣어서」).
사용자 참고 사진에서 부위 이름 · 짜임만 따랐다(게임 속 활 · 상표 무늬는 베끼지 않음):
  캠(바퀴 · 축 · 구멍) · 어퍼림/로워림(짧고 굵은 팔, 화면에서 가로 · 세로) · 라이저(긴 몸통, 손잡이 쪽이 시위로 들어간 「)」꼴 · 창)
  · 림 포켓(팔이 끼는 쇠) · 핸들(손잡이) · 화살 받침 · 케이블 가이드(시위 쪽 막대) · 시위 + 케이블(효과 층 한 칸 줄)
  · 갈래마다 조준기(앞으로 뻗은 받침 + 고리 · 빛 핀) · 스태빌라이저(앞으로 뻗은 막대 + 추) · 활 화살통.
칸 좌표 u = x − y (위 캠 +), v = x + y − 19 (− = 왼쪽 위 = 앞(과녁 쪽), + = 시위 · 쏘는 사람 쪽).
글자: 라이저 a b c · 창 W · 포켓 p P · 팔 l m n · 손잡이 k K · 캠 o O · 캠 구멍 K · 축 x · 받침 · 가이드 g · 조준 r R · 핀 i ·
      스태빌 d D · 시위(효과) s · 케이블(효과) q · 고리(효과) e"""
import math
from g4 import Sw
from bow import P, tsym, bbox
R2 = math.sqrt(2)
def XY(u, v): return ((u + v + 19) / 2.0, (v - u + 19) / 2.0)
def UVc(x, y): return x - y, x + y - 19
def fxline(s, a, b, ch, over=False):
    """화면 칸 곧은 한 칸 줄 (효과 층). a, b = uv. over면 그림 칸 위에도 긋는다"""
    (x0, y0), (x1, y1) = XY(*a), XY(*b)
    n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
    for k in range(n + 1):
        t = k / n; x = math.floor(x0 + (x1 - x0) * t + 0.5); y = math.floor(y0 + (y1 - y0) * t + 0.5)
        if 0 <= x < 20 and 0 <= y < 20 and (over or (x, y) not in s.part): s.fx[(x, y)] = ch
class CB:
    """몸 줄(위쪽 반, u ≥ 0) = 라이저 [(0, vg) → (Lr, ve)] + 팔 [(Lr, ve) → 캠 가운데 (Lc, vcam)] — 아래쪽은 u ↔ −u"""
    def __init__(s, vs=3.6, rc=2.2, Lc=10.4, Lr=5.6, vg=-1.6, ve=-4.2, hr=(2.1, 1.7), hl=(1.35, 1.0), bow=1.0, pk=1.0):
        s.vs, s.rc, s.Lc, s.Lr, s.vg, s.ve, s.hr, s.hl, s.bow, s.pk = vs, rc, Lc, Lr, vg, ve, hr, hl, bow, pk
        s.vcam = vs - rc * R2                                                     # 시위가 캠 바깥에 닿는다
        s.pts = []                                                                # (u, v, 반폭, 부위)
        for i in range(0, 101):
            t = i / 100.0; u = s.Lr * t; v = vg + (ve - vg) * t * t
            s.pts.append((u, v, hr[0] + (hr[1] - hr[0]) * t, 'riser'))
        # 팔: 2차 베지어 — 포켓에서 라이저 결을 이어 앞(−v)으로 조금 나갔다가 캠으로
        p0, p2 = (s.Lr, ve), (s.Lc, s.vcam)
        p1 = (s.Lr + (s.Lc - s.Lr) * 0.45, ve - bow)
        for i in range(1, 101):
            t = i / 100.0
            u = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]
            v = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
            s.pts.append((u, v, hl[0] + (hl[1] - hl[0]) * t, 'limb'))
    def near(s, u, v):
        best = (1e9, None)
        for p in s.pts:
            d = math.hypot(abs(u) - p[0], v - p[1])
            if d < best[0]: best = (d, p)
        return best
    def vc(s, u):
        """라이저 가운데 줄의 v (|u| ≤ Lr)"""
        t = min(1.0, abs(u) / s.Lr); return s.vg + (s.ve - s.vg) * t * t
def body(s, C, chs):
    """라이저 · 팔 · 포켓 · 손잡이 칠하기. chs: dict(riser='abc', limb='lmn', pocket='pP', grip='kK')"""
    for y in range(20):
        for x in range(20):
            u, v = UVc(x, y)
            d, p = C.near(u, v)
            if p is None or d > p[2] + 1e-6: continue
            pu, pv, hw, part = p; off = v - pv
            if part == 'riser' and abs(abs(u) - C.Lr) <= C.pk: part = 'pocket'
            if part == 'riser' and abs(u) <= 1.6 and off > -0.2: part = 'grip'
            role = chs.get(part, chs['riser'])
            ch = role[0] if off < -hw / 3 else (role[-1] if off > hw / 3 else role[min(1, len(role) - 1)])
            s.put(x, y, 'blade', ch)
def grip_bulge(s, C, ch='K'):
    """손잡이가 시위 쪽으로 볼록 (|u| ≤ 1)"""
    for u in (-1, 0, 1):
        c = C.vc(u) + C.hr[0]
        for v in range(int(math.floor(c)) + 1, int(math.floor(c)) + 3):
            if (u + v) % 2 and v <= c + 1.6: P(s, 'grip', u, v, ch)
def windows(s, C, us, ch=None, half=0.7):
    """라이저 창: u 목록의 칸 중 가운데 줄 둘레 |off| ≤ half 를 비우거나(ch None) 어두운 글자로"""
    for (x, y), (part, c0) in list(s.part.items()):
        u, v = UVc(x, y)
        if any(abs(u - q) < 0.6 for q in us) and abs(abs(u) - C.Lr) > C.pk and abs(u) > 1.6 and abs(v - C.vc(u)) <= half:
            if ch: s.put(x, y, 'blade', ch)
            else: del s.part[(x, y)]
def cams(s, C, chs=('o', 'O'), hole='K', hub='x', holes=((0.0, 1.35), (math.pi, 1.35)), module=None):
    """캠 둘: 반지름 rc 둥근 바퀴 · 가운데 축 · 바퀴살 사이 구멍 · module = 바깥에 붙은 작은 모듈 글자"""
    for sg in (-1, 1):
        cx, cy = XY(sg * C.Lc, C.vcam)
        cx += .5; cy += .5
        for y in range(20):
            for x in range(20):
                dx, dy = x + .5 - cx, y + .5 - cy; d = math.hypot(dx, dy)
                if d > C.rc + 0.15: continue
                if d < 0.6: ch = hub
                else:
                    a = math.atan2(dy, dx) if sg > 0 else math.atan2(dx, dy)    # 아래 캠은 x ↔ y로 같은 꼴 (u ↔ −u 대칭)
                    ch = None
                    for (ang, rr) in holes:
                        if abs(d - rr) < 0.55 and abs((a - ang + math.pi) % (2 * math.pi) - math.pi) < 0.5: ch = hole
                    if ch is None: ch = chs[0] if dx + dy < -0.3 else chs[1]
                s.put(x, y, 'head', ch)
        if module:
            # 시위가 감기는 쪽 반대(라이저 쪽) 가장자리에 한 칸
            mx, my = XY(sg * (C.Lc - 0.0), C.vcam - C.rc * R2 - 1.0)
            s.put(int(round(mx)), int(round(my)), 'head', module)
def strings(s, C, sch='s', qch='q', cross=True, loop=None):
    """시위(바깥, v = vs) + 케이블: cross면 두 줄이 캠 축 쪽에서 엇갈려 X, 아니면 한 줄 나란히"""
    fxline(s, (-C.Lc, C.vs), (C.Lc, C.vs), sch)
    if cross:
        fxline(s, (C.Lc, C.vcam + 1.6), (-C.Lc + 0.5, C.vs - 1.2), qch)
        fxline(s, (-C.Lc, C.vcam + 1.6), (C.Lc - 0.5, C.vs - 1.2), qch)
    else:
        fxline(s, (-C.Lc + 0.6, C.vs - 2.0), (C.Lc - 0.6, C.vs - 2.0), qch)
    if loop:
        for (u, ch) in loop:
            x, y = XY(u, C.vs); s.fx[(int(math.floor(x + .5)), int(math.floor(y + .5)))] = ch
def guard(s, C, u=-3.0, ch='g', to=None):
    """케이블 가이드: 라이저 시위 쪽 가장자리에서 케이블까지 막대 (효과 층)"""
    v0 = C.vc(u) + C.hr[0] * 0.6; v1 = (to if to is not None else C.vs - 1.0)
    fxline(s, (u, v0), (u, v1), ch, over=False)
def rest(s, C, u=2.0, ch='g'):
    """화살 받침: 손잡이 위, 시위 쪽으로 한 칸"""
    c = C.vc(u) + C.hr[0]
    for v in range(int(math.floor(c)), int(math.floor(c)) + 3):
        if (u + v) % 2 and v > c - 0.5: P(s, 'guard', int(u), v, ch); break
def sight(s, C, u=3.5, reach=4.0, chs=('r', 'R'), pin='i', box=1.6):
    """조준기: 라이저 앞(−v) 가장자리에서 앞으로 뻗은 받침 + 끝의 고리(테 r R · 빛 핀 i)"""
    v0 = C.vc(u) - C.hr[0]; ui = int(round(u))
    for v in range(int(math.floor(v0)), int(math.floor(v0 - reach)) - 1, -1): P(s, 'guard', ui, v, chs[1])
    cu, cv = ui, v0 - reach - box
    for y in range(20):
        for x in range(20):
            uu, vv = UVc(x, y)
            if math.hypot(uu - cu, vv - cv) <= box * R2 * 0.75 + 1e-6:
                s.put(x, y, 'guard', pin if math.hypot(uu - cu, vv - cv) < 0.9 else chs[0])
def stab(s, C, u=-2.2, reach=6.0, chs=('d', 'D'), w=1.0, tip=2):
    """스태빌라이저: 라이저 앞 가장자리에서 앞으로 막대 + 끝 추(tip 칸, 굵게)"""
    v0 = C.vc(u) - C.hr[0] + 0.4
    for y in range(20):
        for x in range(20):
            uu, vv = UVc(x, y)
            if vv > v0 or vv < v0 - reach: continue
            far = vv < v0 - reach + tip * 1.4
            if abs(uu - u) <= (w + (0.9 if far else 0)) + 1e-6:
                s.put(x, y, 'pommel', chs[0] if uu < u else chs[1])
def qarrows(s, C, us=(-0.2, 1.8), v_off=-1.2, u0=-8.0, u1=6.4, sh='q', fl=('f', 'F'), hood=('h', 'H')):
    """활 화살통: 라이저 앞에 나란히 꽂은 화살(대 = 효과 한 칸 줄) · 아래(로워림 쪽)에 깃 · 위 캠 쪽에 덮개"""
    pass
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(a='#e8eef6', b='#a8b0bc', c='#5a6270', W='#1a1414', p='#5a6270', P='#30343c', l='#5a5a66', m='#3a3a44', n='#22222a',
            k='#4a3424', K='#2a1c12', o='#e0b050', O='#8a6418', x='#2a1e14', g='#c8ccd4', r='#3a3a44', R='#22222a', i='#9aff6a',
            d='#4a4a56', D='#22222a', s='#ffffff', q='#a8b0bc', e='#ff4a4a', f='#e85a3a', F='#9a2a1a', h='#3a3a44', H='#22222a')
def base(C, chs, holes=((math.pi / 4, 1.35), (-3 * math.pi / 4, 1.35)), cross=True, win=(), loop=None, camc=('o', 'O'), hub='x', hole='K'):
    s = Sw(); s.fx = {}
    body(s, C, chs)
    grip_bulge(s, C, chs['grip'][-1])
    if win: windows(s, C, win)
    cams(s, C, camc, hole, hub, holes)
    rest(s, C)
    return s
@frm('A', '나무 도르래 활', '결 고운 나무 라이저(창 하나씩) · 쇠 림 포켓 · 짙은 나무 팔 · 놋쇠 캠(구멍 둘) · 가죽 손잡이 · 케이블 가이드 · 시위와 엇갈린 케이블')
def kA():
    C = CB()
    chs = dict(riser='abc', limb='lmn', pocket='pP', grip='kK')
    s = base(C, chs, win=(3, -3))
    guard(s, C, -3.2); strings(s, C, loop=[(0.6, 'e')])
    return s, dict(BASE, a='#d8a070', b='#a06a3c', c='#6a4220', l='#7a5232', m='#5a3a1e', n='#3a2410', W='#1a1414',
                   p='#a8b0bc', P='#5a6270', k='#5a3a22', K='#3a2414', q='#c8bca0', e='#c8322a')
@frm('B', '쇠 과녁 활', '줄지어 뚫린 창 쇠 라이저 · 검은 팔 · 쇠 캠(바퀴살) · 앞으로 길게 뻗은 조준기(고리 + 빛 핀) · 긴 스태빌라이저 · 푸른 시위')
def kB():
    C = CB()
    chs = dict(riser='abc', limb='lmn', pocket='pP', grip='kK')
    s = base(C, chs, win=(2, 3, 4, -2, -3, -4), camc=('a', 'c'), hub='W', hole='W')
    sight(s, C, 3.6, 4.0); stab(s, C, -2.6, 7.0)
    guard(s, C, -3.6); strings(s, C, cross=False, loop=[(0.6, 'e')])
    return s, dict(BASE, l='#3a3a44', m='#26262e', n='#16161c', k='#2a2a32', K='#16161c', s='#8ad0ff', q='#5a9ad0', e='#ffd84a',
                   r='#c8ccd4', R='#7a8290', i='#ff6a4a', d='#7a8290', D='#3a4048')
@frm('C', '덤불 사냥 활', '얼룩(풀 · 흙 · 나무껍질) 라이저와 팔 · 검은 캠 · 짧은 고무 스태빌라이저 · 사냥꾼의 활')
def kC():
    C = CB()
    def camo(u, v):
        h = (u * 7 + v * 13) % 5
        return h
    chs = dict(riser='abc', limb='lmn', pocket='pP', grip='kK')
    s = base(C, chs, camc=('m', 'n'), hub='o', hole='K')
    # 얼룩 무늬: 라이저 · 팔 칸을 섞는다
    for (x, y), (part, ch) in list(s.part.items()):
        if part != 'blade' or ch in 'pPkK': continue
        u, v = UVc(x, y)
        h = (abs(u) * 5 + (v + 40) * 3 + (abs(u) // 3) * 2) % 7
        if h in (0, 3): s.put(x, y, 'blade', 'e' if v < C.vc(u) else 'E')
        elif h == 5: s.put(x, y, 'blade', 'h')
    stab(s, C, -2.4, 4.0, ('d', 'D'), w=0.9, tip=2)
    guard(s, C, -3.4); strings(s, C, loop=[(0.6, 'r')])
    return s, dict(BASE, a='#8a9a5a', b='#5a6a34', c='#34401c', l='#6a7a40', m='#2a2a22', n='#16160e', e='#8a6a3a', E='#5a4022', h='#2a3018',
                   k='#3a3020', K='#1e1810', o='#c8ccd4', p='#3a3a30', P='#1e1e18', d='#2a2a24', D='#121210', q='#b8b090', r='#e87a2a')
@frm('D', '검은 도르래 활', '검은 쇠 라이저(빛 한 줄 · 창) · 금 캠(붉은 축) · 붉은 시위와 케이블 · 짧은 조준기(초록 빛 핀) · 스태빌라이저')
def kD():
    C = CB()
    chs = dict(riser='abc', limb='lmn', pocket='pP', grip='kK')
    s = base(C, chs, win=(3, -3), camc=('o', 'O'), hub='e', hole='K')
    sight(s, C, 3.4, 2.0, ('r', 'R'), 'i', 1.4); stab(s, C, -2.6, 5.0)
    guard(s, C, -3.4, 'g'); strings(s, C, sch='e', qch='E', loop=[(0.6, 'o')])
    return s, dict(BASE, a='#6a6a78', b='#30303a', c='#16161c', l='#26262e', m='#16161c', n='#0c0c10', p='#c8a040', P='#7a5a18',
                   k='#3a2a2a', K='#1c1414', o='#ffd860', O='#a87018', e='#ff4a4a', E='#b82a2a', g='#8a8a96', r='#30303a', R='#16161c',
                   i='#8aff5a', d='#30303a', D='#121216')
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in FR:
        s, ic = icon(d)
        bx = bbox(s)
        if bx[0] < 0 or bx[1] < 0 or bx[2] > 19 or bx[3] > 19: print(d['key'], 'edge', bx)
        out.append((ic.render(), '도르래 ' + d['key']))
    zoomsheet(out, 'cbow2_z.png', z=14)
