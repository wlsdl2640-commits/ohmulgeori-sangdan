"""표창 — 도적 계열 부장비 (닌자 · 카게닌자는 세 통). 원형 시안 A~D + 16 (네 레벨 묶음마다 A · B · C · D 한 번씩)
앞 그림 20×20, 가운데 (10, 10) 기준 좌우 · 위아래 모두 거울 대칭 (바람개비처럼 한쪽으로 꺾인 날은 쓰지 않는다).
  A 네 날(X): 대각선으로 뻗은 네 날 · 가운데 구멍
  B 여덟 날: 둥근 축에 긴 날 넷(위아래좌우) + 짧은 날 넷(대각선)
  C 톱니: 둥근 날에 이 여덟 · 날 끝 빛 고리 · 가운데 구멍
  D 꽃잎: 잎꼴 날 넷(대각선 — 위아래좌우는 십자처럼 보여 피함) · 고리 축
글자: 날 빛 w · 빛 면 b · 그늘 면 B · 날 끝 e · 축 h g G · 구멍 o · 효과 1 2"""
import math
from sh import Sh
from wic import N
CX = CY = 10.0
LIGHT = (-0.6, -0.8)
def blades(dirs, L, W0, prof='tri'):
    """날 모음: 방향 목록 · 길이 L · 밑 너비 W0. 칸 → (날 번호, 축 거리 t, 옆 거리 w, 날 방향)"""
    def f(x, y):
        dx, dy = x + .5 - CX, y + .5 - CY
        best = None
        for i, (ax, ay) in enumerate(dirs):
            n = math.hypot(ax, ay); ax, ay = ax / n, ay / n
            t = dx * ax + dy * ay; w = -dx * ay + dy * ax
            if t < 0 or t > L: continue
            k = t / L
            wm = W0 * (1 - k) if prof == 'tri' else W0 * math.sin(math.pi * min(1, k * 1.0)) * (1.0 if k > 0.12 else 0.9) + 0.35 * (1 - k)
            if abs(w) <= wm and (best is None or abs(w) / max(wm, 1e-6) < best[4]):
                best = (i, t, w, (ax, ay), abs(w) / max(wm, 1e-6))
        return best
    return f
def lit_side(w, d):
    ax, ay = d; nx, ny = -ay, ax                     # 옆 방향
    s = nx * LIGHT[0] + ny * LIGHT[1]
    return (w * s) > 0 if abs(s) > 0.15 else (w * (nx * 0.3 + ny * -1.0)) > 0
def frame(st, hub_gem=False):
    s = Sh()
    R2 = math.sqrt(0.5)
    if st == 'A':
        bf = blades([(1, -1), (1, 1), (-1, 1), (-1, -1)], 11.6, 3.2)
        hub = lambda d: d <= 3.0
    elif st == 'B':
        bl = blades([(0, -1), (1, 0), (0, 1), (-1, 0)], 9.0, 1.9)
        bs = blades([(1, -1), (1, 1), (-1, 1), (-1, -1)], 7.4, 1.5)
        bf = lambda x, y: bl(x, y) or bs(x, y)
        hub = lambda d: d <= 3.4
    elif st == 'C':
        bf = None
        hub = None
    else:
        bf = blades([(1, -1), (1, 1), (-1, 1), (-1, -1)], 11.2, 2.6, prof='leaf')
        hub = lambda d: d <= 2.9
    def role(x, y):
        dx, dy = x + .5 - CX, y + .5 - CY; d = math.hypot(dx, dy)
        if st == 'C':
            a = math.degrees(math.atan2(dy, dx)) % 45            # 이 여덟 (0°, 45° … 에 세모 이)
            m = min(a, 45 - a)
            if d > 6.7 + max(0.0, 2.2 * (1 - m / 11.0)): return None
            if d > 5.9: return 'e' if (dx + dy) < 2.5 else 'B'      # 날 끝 (빛 고리)
            if d <= 2.0: return None
            if d <= 3.2: return 'h' if dx + dy < -0.6 else ('G' if dx + dy > 0.6 else 'g')
            return 'w' if dx + dy < -2.6 else ('b' if dx + dy < 2.4 else 'B')
        if d <= 1.05 and st != 'C': return None                     # 가운데 구멍
        if hub and hub(d): return 'h' if dx + dy < -0.8 else ('G' if dx + dy > 0.8 else 'g')
        r = bf(x, y)
        if not r: return None
        i, t, w, dd, k = r
        if k > 0.7 and t > 2.0 and lit_side(w, dd): return 'e'               # 날 끝 (빛 쪽 가장자리)
        if abs(w) < 0.55: return 'w'                                         # 등줄
        return 'b' if lit_side(w, dd) else 'B'
    s.fill(lambda x, y: role(x, y) is not None, role)
    if st in 'ABD':                                                          # 구멍 (2×2 어둠)
        for (x, y) in ((9, 9), (10, 9), (9, 10), (10, 10)): s.body.pop((x, y), None)
        for (x, y) in ((9, 9), (10, 9), (9, 10), (10, 10)): s.put(x, y, 'o')
    if hub_gem:
        for (x, y), ch in (((9, 9), 'z'), ((10, 9), 'Z'), ((9, 10), 'Z'), ((10, 10), 'u')): s.put(x, y, ch)
    return s
STYLE = {'A': '네 날', 'B': '여덟 날', 'C': '톱니', 'D': '꽃잎'}
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
STEEL = dict(w='#ffffff', b='#c8d2e2', B='#7a869c', e='#f4f8ff', n='#4e5870', h='#a8b0bc', g='#6c7482', G='#3e4450', o='#1a1414')
@frm('A', '대각선으로 뻗은 네 날 · 가운데 구멍 — 가장 흔한 표창')
def fA(): return frame('A'), dict(STEEL)
@frm('B', '둥근 축에 긴 날 넷 · 짧은 날 넷')
def fB(): return frame('B'), dict(STEEL)
@frm('C', '둥근 날에 이 여덟 개 · 날 끝 빛 고리 · 가운데 구멍')
def fC(): return frame('C'), dict(STEEL)
@frm('D', '대각선으로 뻗은 잎꼴 날 넷 · 고리 축')
def fD(): return frame('D'), dict(STEEL)
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '무쇠 표창', '무쇠를 오려 갈아 만든 네 날 표창')
def k01(): return frame('A'), dict(STEEL, w='#e4e6e8', b='#b0b4ba', B='#767a84', e='#d0d4d8', n='#4a4e58')
@make(10, 'B', '여덟 날 표창', '긴 날 넷 · 짧은 날 넷을 단 강철 표창')
def k10(): return frame('B'), dict(STEEL)
@make(20, 'C', '톱니 표창', '둥근 날에 이를 낸 표창 · 맞으면 살을 뜯는다')
def k20(): return frame('C'), dict(STEEL, h='#e0b060', g='#a8742e', G='#6a4418')
@make(30, 'D', '청동 꽃잎 표창', '청동 잎꼴 날 넷 · 청동 고리')
def k30(): return frame('D'), dict(w='#fff4c8', b='#e8b860', B='#a8742e', e='#ffe8a0', n='#6a4418', h='#f0c870', g='#c08a3a', G='#7a5220', o='#1a1414')
@make(40, 'D', '독 꽃잎 표창', '잎꼴 날 끝에 초록 독을 발랐다')
def k40(): return frame('D'), dict(STEEL, e='#8aff5a', n='#2a8a30')
@make(50, 'A', '검은 강철 표창', '빛을 먹는 검은 강철 · 날 끝만 하얗게 벼렸다')
def k50(): return frame('A'), dict(w='#8a8e98', b='#4a4e58', B='#2e3038', e='#f0f4f8', n='#a8b0bc', h='#5a5664', g='#383440', G='#201e26', o='#1a1414')
@make(60, 'B', '은빛 별 표창', '은을 입힌 여덟 날 · 별처럼 반짝인다')
def k60(): return frame('B'), dict(w='#ffffff', b='#e8eef6', B='#a8b4c8', e='#ffffff', n='#6a7690', h='#ffffff', g='#c8d0e0', G='#7a84a0', o='#1a1414')
@make(70, 'C', '불씨 톱니 표창', '이가 아직 달아오른 톱니 표창')
def k70(): return frame('C'), dict(w='#8a7a70', b='#5a4a44', B='#3a2a2a', e='#ff8a2a', n='#c8401a', h='#ffb040', g='#e0601a', G='#8a2a10', o='#1a1414')
@make(80, 'C', '서리 톱니 표창', '얼음빛 톱니 · 맞은 자리에 서리가 앉는다')
def k80(): return frame('C'), dict(w='#ffffff', b='#c8ecff', B='#6aaed8', e='#ffffff', n='#3a7ab8', h='#e8fcff', g='#8ac8ec', G='#4a7aa0', o='#1a1414')
@make(90, 'D', '금빛 꽃잎 표창', '금을 입힌 꽃잎 표창 · 붉은 보석 축')
def k90(): return frame('D', hub_gem=True), dict(w='#fffbd0', b='#ffd860', B='#c08a20', e='#fff6c0', n='#8a5a10', h='#fff2a0', g='#f0c040', G='#a87018', o='#1a1414',
                                                 z='#ffb0bc', Z='#e0283a', u='#8a1020')
@make(100, 'A', '번개 표창', '푸른 쇠 네 날 · 날 끝에 번개가 튄다')
def k100():
    s = frame('A'); s.fx.update({(1, 1): '1', (18, 1): '2', (1, 18): '2', (18, 18): '1'})
    return s, dict(w='#e0ecff', b='#6a7ea4', B='#3e4a6a', e='#fff36a', n='#d0a020', h='#8ea2c8', g='#5a6e96', G='#34446a', o='#1a1414',
                   **{'1': '#ffffff', '2': '#fff36a'})
@make(110, 'B', '달빛 표창', '옅은 보랏빛 여덟 날 · 달빛을 머금었다')
def k110(): return frame('B'), dict(w='#ffffff', b='#e4dcf8', B='#a89ad8', e='#ffffff', n='#5e5290', h='#f4f0ff', g='#c8c0ec', G='#8a80b8', o='#1a1414')
@make(120, 'B', '그림자 표창', '검보랏빛 여덟 날 · 그림자에 섞이면 보이지 않는다')
def k120(): return frame('B'), dict(w='#7a5ac8', b='#3a2a5a', B='#22183a', e='#c8a8ff', n='#5a3a9a', h='#4a3a6a', g='#2e2442', G='#160f24', o='#1a1414')
@make(130, 'C', '핏빛 톱니 표창', '검붉은 톱니 · 맞으면 피가 멎지 않는다')
def k130(): return frame('C'), dict(w='#ffb0b0', b='#a8323e', B='#6a1424', e='#ff5a5a', n='#8a1020', h='#5a2a30', g='#3a1a20', G='#200c10', o='#1a1414')
@make(140, 'D', '바람 꽃잎 표창', '비취빛 꽃잎 날 · 바람을 타고 휘어 날아간다')
def k140(): return frame('D'), dict(w='#f0fff8', b='#8ae0c0', B='#3a9a7a', e='#d8fff0', n='#1a6a50', h='#c8f0e0', g='#5ac0a0', G='#2a7a60', o='#1a1414')
@make(150, 'A', '칠흑의 표창', '카게닌자의 표창 · 칠흑빛 날 끝에 보랏빛 어둠이 일렁인다')
def k150():
    s = frame('A', hub_gem=True); s.fx.update({(2, 2): '1', (17, 2): '2', (2, 17): '2', (17, 17): '1'})
    return s, dict(w='#6a5a90', b='#2e2442', B='#160f24', e='#c8a8ff', n='#8a5ae0', h='#4a3a6a', g='#2e2442', G='#160f24', o='#1a1414',
                   z='#f0d0ff', Z='#a050f0', u='#4a1a8a', **{'1': '#c8a8ff', '2': '#a878ff'})
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, pal = d['fn']()
        bad = [(x, y) for (x, y) in s.body if (19 - x, y) not in s.body or (x, 19 - y) not in s.body]
        if bad: print(d.get('lv', d.get('key')), 'sym', bad[:4])
        out.append((s.icon(pal).render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'sk_frames.png', z=12)
    zoomsheet(out[4:12], 'sk_z1.png', z=9)
    zoomsheet(out[12:], 'sk_z2.png', z=9)
    print(Counter(d['st'] for d in G))
