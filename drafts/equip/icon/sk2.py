"""암기(표창 칸) 2판 — 11-10 19:09 사용자: 여덟 날 → 「성게」(네모진 날을 네 날처럼 뾰족하게), 쿠나이 같은 실제 암기 · 다른 꼴 추가,
고드름 같은 속성 특별 암기 몇 개.
원형 8 (레벨 16칸에 두 번씩): A 네 날 · B 성게 · C 톱니 · D 꽃잎 · E 쿠나이 · F 침(봉 표창 셋) · G 마름모(센반) · H 차크람
앞 그림(A B C D G H)은 거울 대칭 · 바람개비 꼴 금지. 쿠나이 · 침은 칼처럼 비스듬한 그림(축 x + y = 19).
특별 암기 6: 고드름(빙결) · 불씨 쿠나이(불) · 벼락 침(번개) · 독침(독) · 바람 표창(바람) · 그림자 쿠나이(어둠)"""
import math
import sk
from sk import blades, lit_side, CX, CY
from sh import Sh
import g4
g4.AX = 19
from g4 import Sw
from g4d import region, edge_of
from wic import N
def urchin(hub_gem=False):
    """성게: 긴 뾰족 날 넷(위아래좌우) + 조금 짧은 뾰족 날 넷(대각선), 작은 축 · 가운데 구멍"""
    s = Sh()
    bl = blades([(0, -1), (1, 0), (0, 1), (-1, 0)], 9.4, 2.7)
    bs = blades([(1, -1), (1, 1), (-1, 1), (-1, -1)], 9.6, 2.5)
    def role(x, y):
        dx, dy = x + .5 - CX, y + .5 - CY; d = math.hypot(dx, dy)
        if d <= 1.05: return None
        if d <= 2.6: return 'h' if dx + dy < -0.8 else ('G' if dx + dy > 0.8 else 'g')
        r = bl(x, y) or bs(x, y)
        if not r: return None
        i, t, w, dd, k = r
        if k > 0.7 and t > 2.0 and lit_side(w, dd): return 'e'
        if abs(w) < 0.55: return 'w'
        return 'b' if lit_side(w, dd) else 'B'
    s.fill(lambda x, y: role(x, y) is not None, role)
    for (x, y) in ((9, 9), (10, 9), (9, 10), (10, 10)): s.put(x, y, 'o')
    if hub_gem:
        for (x, y), ch in (((9, 9), 'z'), ((10, 9), 'Z'), ((9, 10), 'Z'), ((10, 10), 'u')): s.put(x, y, ch)
    return s
def senban(hub_gem=False):
    """마름모 표창(센반): 오목한 네 변 · 뾰족한 네 모서리(위아래좌우 꼭지) · 면 넷 · 가운데 구멍"""
    s = Sh()
    def role(x, y):
        dx, dy = x + .5 - CX, y + .5 - CY
        a, b = abs(dx), abs(dy)
        if (a ** 0.72 + b ** 0.72) > 8.8 ** 0.72: return None
        d = math.hypot(dx, dy)
        if d <= 1.05: return None
        if d <= 2.4: return 'h' if dx + dy < -0.8 else ('G' if dx + dy > 0.8 else 'g')
        if (a ** 0.72 + b ** 0.72) > 7.4 ** 0.72: return 'e' if dx + dy < 0 else 'B'   # 날 끝
        # 면 넷: 왼쪽 위 밝음 · 오른쪽 아래 어둠 · 나머지 가운데
        if dx < 0 and dy < 0: return 'w' if abs(abs(dx) - abs(dy)) < 0.9 else 'b'
        if dx > 0 and dy > 0: return 'B'
        return 'b' if abs(abs(dx) - abs(dy)) > 0.9 else 'w'
    s.fill(lambda x, y: role(x, y) is not None, role)
    for (x, y) in ((9, 9), (10, 9), (9, 10), (10, 10)): s.put(x, y, 'o')
    if hub_gem:
        for (x, y), ch in (((9, 9), 'z'), ((10, 9), 'Z'), ((9, 10), 'Z'), ((10, 10), 'u')): s.put(x, y, ch)
    return s
def chakram():
    """차크람: 날 선 고리 · 안쪽 홈 고리"""
    s = Sh()
    def role(x, y):
        dx, dy = x + .5 - CX, y + .5 - CY; d = math.hypot(dx, dy); t = dx + dy
        if d > 8.7 or d <= 5.2: return None
        if d > 7.7: return 'e' if t < 1.0 else 'B'            # 바깥 날
        if d <= 6.0: return 'G' if t > -1.0 else 'g'           # 안쪽 홈
        return 'w' if t < -4.5 else ('b' if t < 3.5 else 'B')
    s.fill(lambda x, y: role(x, y) is not None, role)
    return s
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
RING5 = [".ppp.", "p...P", "p...Q", "P...Q", ".QQQ."]      # 고리 글자는 구멍(o)과 겹치지 않게 p P Q
def kunai():
    """쿠나이: 넓은 잎(마름모)꼴 날 · 엇갈려 감은 끈 손잡이 · 5×5 고리 (축 위)"""
    s = Sw(); s.fx = {}
    hw = lambda u: (1 + 2.5 * (u - 1) / 4 if u <= 5 else 3.5 * (17 - u) / 12)
    def bl(u, v):
        h = hw(u); e = edge_of(v, h)
        if v < 0: return 'w' if e else 'b'
        if v > 0: return 'n' if e else 'B'
        return 'c'
    region(s, 'blade', lambda u, v: 1 <= u <= 17 and abs(v) <= hw(u) + 1e-6, bl)
    region(s, 'grip', lambda u, v: -7 <= u <= 0 and abs(v) <= 1,
           lambda u, v: ('k' if v <= 0 else 'K') if ((u + v) % 4 == 0 or (u - v) % 4 == 0) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    for j, r in enumerate(RING5):
        for i, ch in enumerate(r):
            if ch != '.': s.put(2 + i, 13 + j, 'pommel', ch)       # 고리 가운데 (4,15) = 축 위
    return s
def needles():
    """침 셋 (11-10 19:29 사용자 고름 N3): 가는 쇠침 셋을 넉넉히 띄워 나란히 — 한 칸 굵기 · 끝 두 칸만 빛(w) · 꼬리 한 칸 짙게(B) · 뭉친 끝 없음.
    끝: 가운데 (17,2) · 왼쪽 (12,2) · 오른쪽 (17,7)"""
    s = Sw(); s.fx = {}
    for v0, u0, u1 in ((-5, -11, 11), (0, -14, 16), (5, -11, 11)):
        for u in range(u0, u1 + 1):
            if (u + v0) % 2 == 0: continue
            P(s, 'blade', u, v0, 'w' if u >= u1 - 3 else ('B' if u <= u0 + 1 else 'b'))
    return s
def icicle():
    """고드름: 자루 없이 통째로 얼음 — 굵은 밑동에서 끝까지 뾰족, 면마다 빛이 갈린다"""
    s = Sw(); s.fx = {}
    hw = lambda u: 2.6 * (17 - u) / 31
    def bl(u, v):
        h = hw(u); e = edge_of(v, h)
        face = (u // 5) % 2 == 0
        if v < 0: return 'w' if e else ('i' if face else 'b')
        if v > 0: return 'n' if e else ('c' if face else 'B')
        return 'i' if face else 'c'
    region(s, 'blade', lambda u, v: -14 <= u <= 17 and abs(v) <= hw(u) + 0.45, bl)
    return s

STYLE = {'A': '네 날', 'B': '성게', 'C': '톱니', 'D': '꽃잎', 'E': '쿠나이', 'F': '침', 'G': '마름모', 'H': '차크람'}
def frame(st, gem=False):
    if st == 'B': return urchin(gem)
    if st == 'E': return kunai()
    if st == 'F': return needles()
    if st == 'G': return senban(gem)
    if st == 'H': return chakram()
    return sk.frame(st, hub_gem=gem)
STEEL = dict(w='#ffffff', b='#c8d2e2', B='#7a869c', e='#f4f8ff', n='#4e5870', c='#e4ecf6', h='#a8b0bc', g='#6c7482', G='#3e4450', o='#1a1414',
             r='#5a5048', q='#3a322c', R='#221c18', k='#c8b89a', K='#6a5a44', p='#c8d0dc', P='#8a929e', Q='#4e5662')
FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, desc=desc, fn=fn)); return fn
    return deco
@frm('A', '대각선으로 뻗은 네 날 · 가운데 구멍 — 가장 흔한 표창')
def fA(): return frame('A'), dict(STEEL)
@frm('B', '뾰족한 날 여덟 개가 가시처럼 뻗은 성게 꼴')
def fB(): return frame('B'), dict(STEEL)
@frm('C', '둥근 날에 세모 이 여덟 · 날 끝 빛 고리')
def fC(): return frame('C'), dict(STEEL)
@frm('D', '대각선으로 뻗은 잎꼴 날 넷 · 고리 축')
def fD(): return frame('D'), dict(STEEL)
@frm('E', '넓은 잎꼴 날 · 엇갈려 감은 끈 · 끝 고리 — 던지고 찌르는 쿠나이')
def fE(): return frame('E'), dict(STEEL)
@frm('F', '가는 쇠침 셋을 넉넉히 띄워 나란히 · 끝만 빛 (센본)')
def fF(): return frame('F'), dict(STEEL)
@frm('G', '오목한 네 변 · 뾰족한 네 모서리의 마름모 쇳조각')
def fG(): return frame('G'), dict(STEEL)
@frm('H', '날 선 쇠고리 — 돌며 날아가 벤다')
def fH(): return frame('H'), dict(STEEL)

G = []
def make(lv, st, name, desc, **kw):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn, **kw)); return fn
    return deco
@make(1, 'A', '무쇠 표창', '무쇠를 오려 갈아 만든 네 날 표창')
def k01(): return frame('A'), dict(STEEL, w='#e4e6e8', b='#b0b4ba', B='#767a84', e='#d0d4d8', n='#4a4e58')
@make(10, 'B', '성게 표창', '날 여덟 개가 가시처럼 뻗은 강철 표창')
def k10(): return frame('B'), dict(STEEL)
@make(20, 'E', '쿠나이', '던지고 찌르는 무쇠 쿠나이 · 끈 손잡이 · 끝 고리')
def k20(): return frame('E'), dict(STEEL, w='#e4e6e8', b='#b0b4ba', c='#d0d4d8', B='#767a84', n='#4a4e58', p='#c8ccd4', P='#8a8e98', Q='#4a4e58')
@make(30, 'F', '쇠바늘', '소매에 숨기는 가는 쇠바늘 세 개')
def k30(): return frame('F'), dict(STEEL, w='#eef0f2', b='#a8acb4', B='#5a5e68')
@make(40, 'C', '톱니 표창', '둥근 날에 이를 낸 표창 · 맞으면 살을 뜯는다')
def k40(): return frame('C'), dict(STEEL, h='#e0b060', g='#a8742e', G='#6a4418')
@make(50, 'G', '청동 마름모 표창', '청동 쇳조각을 마름모로 오려 갈았다')
def k50(): return frame('G'), dict(STEEL, w='#fff4c8', b='#e8b860', B='#a8742e', e='#ffe8a0', h='#f0c870', g='#c08a3a', G='#7a5220')
@make(60, 'D', '은 꽃잎 표창', '은을 입힌 잎꼴 날 넷 · 은 고리')
def k60(): return frame('D'), dict(STEEL, w='#ffffff', b='#e8eef6', B='#a8b4c8', e='#ffffff', h='#ffffff', g='#c8d0e0', G='#7a84a0')
@make(70, 'H', '차크람', '날 선 강철 고리 · 돌며 날아가 여럿을 벤다')
def k70(): return frame('H'), dict(STEEL)
@make(80, 'A', '검은 강철 표창', '빛을 먹는 검은 강철 · 날 끝만 하얗게 벼렸다')
def k80(): return frame('A'), dict(STEEL, w='#8a8e98', b='#4a4e58', B='#2e3038', e='#f0f4f8', n='#a8b0bc', h='#5a5664', g='#383440', G='#201e26')
@make(90, 'B', '은빛 성게 표창', '은을 입힌 성게 꼴 · 별처럼 반짝인다')
def k90(): return frame('B'), dict(STEEL, w='#ffffff', b='#e8eef6', B='#a8b4c8', e='#ffffff', h='#ffffff', g='#c8d0e0', G='#7a84a0')
@make(100, 'E', '흑철 쿠나이', '검게 벼린 쿠나이 · 붉은 끈')
def k100(): return frame('E'), dict(STEEL, w='#c8ccd4', b='#5e626c', c='#7a7e88', B='#3e424a', n='#8a8e98', r='#a8323e', q='#7a1a24', R='#4a0c14', k='#e05a5a', K='#5a0a14',
                                     p='#7a7e88', P='#4e5260', Q='#2a2c32')
@make(110, 'F', '달빛 은침', '달빛처럼 옅은 보랏빛 은바늘 셋')
def k110(): return frame('F'), dict(STEEL, w='#ffffff', b='#d8ccf8', B='#7a6ab8')
@make(120, 'C', '핏빛 톱니 표창', '검붉은 톱니 · 맞으면 피가 멎지 않는다')
def k120(): return frame('C'), dict(STEEL, w='#ffb0b0', b='#a8323e', B='#6a1424', e='#ff5a5a', h='#5a2a30', g='#3a1a20', G='#200c10')
@make(130, 'G', '황금 마름모 표창', '금을 입힌 마름모 · 붉은 보석')
def k130(): return frame('G', True), dict(STEEL, w='#fffbd0', b='#ffd860', B='#c08a20', e='#fff6c0', h='#fff2a0', g='#f0c040', G='#a87018',
                                         z='#ffb0bc', Z='#e0283a', u='#8a1020')
@make(140, 'D', '비취 꽃잎 표창', '비취빛 꽃잎 날 · 휘어 날아간다')
def k140(): return frame('D'), dict(STEEL, w='#f0fff8', b='#8ae0c0', B='#3a9a7a', e='#d8fff0', h='#c8f0e0', g='#5ac0a0', G='#2a7a60')
@make(150, 'H', '칠흑의 차크람', '카게닌자의 차크람 · 칠흑빛 고리에 보랏빛 어둠이 일렁인다')
def k150():
    s = frame('H'); s.fx.update({(1, 1): '1', (18, 1): '2', (1, 18): '2', (18, 18): '1'})
    return s, dict(STEEL, w='#6a5a90', b='#2e2442', B='#160f24', e='#c8a8ff', g='#4a3a6a', G='#22183a', **{'1': '#c8a8ff', '2': '#a878ff'})

# ───────── 특별 암기 (속성 · 상태이상) ─────────
SP = []
def spc(key, st, name, el, eff, desc):
    def deco(fn): SP.append(dict(key=key, st=st, name=name, el=el, eff=eff, desc=desc, fn=fn)); return fn
    return deco
@spc('icicle', 'I', '고드름', '빙결', '동상: 맞은 적이 느려진다', '통째로 얼음인 고드름 · 면마다 빛이 갈린다')
def x_icicle():
    s = icicle(); s.fx.update({(15, 0): '1', (18, 4): '2', (12, 3): '2', (4, 12): '1'})
    return s, dict(w='#ffffff', i='#d4f6ff', b='#a8e4fc', c='#7ccaf0', B='#4a9ad8', n='#2a5aa0', **{'1': '#ffffff', '2': '#bdeeff'})
@spc('fire', 'E', '불씨 쿠나이', '불', '화상: 몇 초 동안 불에 탄다', '날이 달아오른 쿠나이 · 끝에서 불씨가 튄다')
def x_fire():
    s = kunai(); s.fx.update({(18, 0): '1', (16, 1): '2', (13, 2): '1', (17, 4): '2'})
    return s, dict(STEEL, w='#fff2b0', b='#ffb040', c='#ffd070', B='#e0501a', n='#8a2a10', r='#3a2424', q='#2a1818', R='#1a0e0e', k='#ff6a1a', K='#8a2a10',
                   p='#ffd070', P='#e0601a', Q='#8a2a10', **{'1': '#ffd84a', '2': '#ff8a1a'})
@spc('bolt', 'F', '벼락 침', '번개', '감전: 맞은 적이 잠깐 멈춘다', '번개를 머금은 쇠바늘 셋 · 불똥이 튄다')
def x_bolt():
    s = needles()
    for (x, y), (pt, ch) in list(s.part.items()):
        if ch == 'b' and x % 2 == 0: s.part[(x, y)] = (pt, 'c')               # 몸통이 한 칸 걸러 번쩍 — 전기가 흐른다
    s.fx.update({(18, 1): '1', (13, 1): '1', (18, 6): '1', (19, 0): '2', (14, 0): '2', (19, 5): '2'})   # 끝마다 앞으로 튀는 불똥 두 칸
    return s, dict(STEEL, w='#ffffff', b='#ffd84a', c='#fffbd0', B='#a87010', **{'1': '#ffffff', '2': '#fff36a'})
@spc('venom', 'F', '독침', '독', '중독: 몇 초 동안 독 피해', '초록 독을 바른 바늘 셋 · 끝에 독이 맺혔다')
def x_venom():
    s = needles(); s.fx.update({(18, 3): '1', (18, 4): '2', (13, 3): '1', (13, 4): '2', (18, 8): '1', (18, 9): '2'})
    return s, dict(STEEL, w='#d8ffc0', b='#8ad870', B='#2e7a28', **{'1': '#8aff5a', '2': '#3ac02a'})
@spc('wind', 'A', '바람 표창', '바람', '꿰뚫기: 바람을 타고 적 둘을 지난다', '비취빛 네 날 · 날 끝에 바람이 감긴다')
def x_wind():
    s = frame('A'); s.fx.update({(1, 9): '1', (18, 10): '1', (9, 1): '2', (10, 18): '2'})
    return s, dict(STEEL, w='#f0fff8', b='#8ae0c0', B='#3a9a7a', e='#d8fff0', h='#c8f0e0', g='#5ac0a0', G='#2a7a60', **{'1': '#d8fff0', '2': '#8ae0c0'})
@spc('shade', 'E', '그림자 쿠나이', '어둠', '어둠: 맞은 적의 명중률이 떨어진다', '빛을 먹는 검보랏빛 쿠나이 · 그림자가 흘러내린다')
def x_shade():
    s = kunai(); s.fx.update({(18, 0): '1', (15, 1): '2', (4, 12): '1', (2, 13): '2'})
    return s, dict(STEEL, w='#c8a8ff', b='#3a2a5a', c='#4e3a78', B='#22183a', n='#7a5ac8', r='#2a2230', q='#1c1620', R='#0e0a10', k='#7a5ac8', K='#1a1024',
                   p='#7a5ac8', P='#3a2a5a', Q='#22183a', **{'1': '#c8a8ff', '2': '#a878ff'})

def icon(d):
    s, pal = d['fn']()
    return s.icon(pal, fx=dict(getattr(s, 'fx', {}))) if isinstance(s, Sw) else s.icon(pal)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = [(icon(d).render(), d['key']) for d in FR]
    zoomsheet(out, 'sk2_frames.png', z=9)
    out = [(icon(d).render(), str(d['lv'])) for d in G]
    zoomsheet(out[:8], 'sk2_z1.png', z=9); zoomsheet(out[8:], 'sk2_z2.png', z=9)
    out = [(icon(d).render(), d['key']) for d in SP]
    zoomsheet(out, 'sk2_sp.png', z=10)
    print(Counter(d['st'] for d in G))
