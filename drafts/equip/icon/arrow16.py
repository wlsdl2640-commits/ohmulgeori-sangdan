"""화살 — 궁수 공통 부장비(화살 칸) 16묶음 (11-10 23:58~23:59 사용자: 「화살은 그냥 기본 화살 같이쓰자」 · 「이번에 만든 화살 이미지는 기본화살쪽으로 넣어서 추가해」).
원형 여덟: 나무 화살 넷(나무 대 · 새 깃 — 지금 게임 화살을 20×20으로 새로) + 카본 화살 넷(carr.py, 23:40에 만든 것).
1차부터 쓰니 Lv1 · 10 … 150. 앞 여덟(Lv1 ~ 70)은 나무 넷을 두 번(A · B · C · D 한 번씩), 뒤 여덟(Lv80 ~ 150)은 카본 넷을 두 번.
둘을 나란히 · 촉이 오른쪽 위(칼과 같은 축). 글자: 대 a A · 깃 f F(줄무늬 b) · 수탉 깃 w · 오늬 n N · 감개 r · 촉 h g G · 구멍 K · 빛(효과) 1 2 e"""
from g4 import Sw
from bow import P
import carr
HEADS = dict(carr.HEADS, leaf=[1.0, 1.6, 1.6, 1.0, 0.0], needle=[1.0, 0.6, 0.6, 0.6, 0.0], barb=[2.0, 1.0, 1.6, 1.0, 0.0])
def tarrow(s, v0, u0, u1, head='leaf', sh=('a', 'A'), vane=('f', 'F'), cock=None, bar=None, nock=('n', 'N'), wrap=None, vlen=6,
           vh=(2.0, 2.0, 2.0, 1.6, 1.0, 1.0), hole=False):
    """나무 화살 한 자루: 나무 결 대(세 칸마다 짙게) · 긴 새 깃(꼬리 쪽 높고 앞으로 낮게, bar면 한 칸 걸러 줄무늬) · 감긴 오늬"""
    for u in range(u0 + 1, u1 + 1): P(s, 'blade', u, v0, sh[1] if (u // 2) % 3 == 0 else sh[0])
    for u in (u0 - 1, u0, u0 + 1):
        P(s, 'pommel', u, v0, nock[0] if u <= u0 else nock[1])
        if u == u0 - 1:
            for v in (v0 - 1, v0 + 1): P(s, 'pommel', u, v, nock[1])
    for k in range(vlen):
        u = u0 + 2 + k; h = vh[min(k, len(vh) - 1)]
        for v in range(int(v0 - h - 1), int(v0 + h + 2)):
            if v == v0 or abs(v - v0) > h + 1e-6: continue
            top = v < v0
            ch = (cock if (cock and top) else vane[0]) if top else vane[1]
            if bar and k % 2 == 1: ch = bar[0] if top else bar[1]
            P(s, 'grip', u, v, ch)
    if wrap:
        for u in (u0 + 2 + vlen, u0 + 3 + vlen): P(s, 'blade', u, v0, wrap)
    for k, hw in enumerate(HEADS[head]):
        u = u1 + 1 + k
        for v in range(int(v0 - hw - 1), int(v0 + hw + 2)):
            if abs(v - v0) <= hw + 1e-6:
                ch = 'h' if v < v0 else ('G' if v > v0 else 'g')
                if hole and head == 'broad' and 1 <= k <= 2 and abs(v - v0) == 1 and abs(v - v0) < hw: ch = 'K'
                P(s, 'head', u, v, ch)
    if head in ('broad', 'barb'):
        for v in (v0 - 1, v0 + 1): P(s, 'head', u1, v, 'G')
def tpair(**kw):
    s = Sw(); s.fx = {}
    short = kw.get('head') in ('broad', 'barb', 'leaf')
    tarrow(s, -3, -13, 7 if short else 8, **kw)
    tarrow(s, 4, -11, 7 if short else 8, **kw)
    return s
TBASE = dict(a='#d8b070', A='#a8784a', f='#e8e8ec', F='#a8a8b4', w='#ffffff', b='#5a4a3a', B='#3a2e24', n='#6a4428', N='#3a2414', r='#c8322a',
             h='#e8eef6', g='#a8b0bc', G='#5a6270', K='#1a1414')
TFR = []
def tfrm(key, name, desc):
    def deco(fn): TFR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
@tfrm('A', '나무 화살', '나무 대(결) · 잎꼴 쇠 촉 · 잿빛 거위 깃 · 감긴 오늬 — 지금 게임 화살을 20×20으로')
def tA(): return tpair(head='leaf'), dict(TBASE)
@tfrm('B', '붉은 깃 화살', '짙은 나무 대 · 가는 바늘 촉 · 붉은 깃 + 흰 수탉 깃')
def tB(): return tpair(head='needle', cock='w'), dict(TBASE, a='#b8865a', A='#7a5432', f='#e8402a', F='#9a1e14')
@tfrm('C', '매깃 사냥 화살', '나무 대 · 미늘 넓은 촉 · 줄무늬 매 깃(갈색 · 크림)')
def tC(): return tpair(head='barb', bar=('b', 'B')), dict(TBASE, f='#f0e0c0', F='#c8a878', b='#7a5232', B='#4a3018')
@tfrm('D', '쇠 화살', '쇠 대 · 쇠 바늘 촉 · 검은 깃 · 쇠 오늬')
def tD(): return tpair(head='needle'), dict(TBASE, a='#c8ccd4', A='#7a8290', f='#4a4a56', F='#22222a', n='#a8b0bc', N='#5a6270')
def ticon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
# ── 16묶음 ──
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
SP = lambda a, b=None: {'1': a, '2': b or a}
def T(key, pal=None, fx=(), **kw):
    d = next(f for f in TFR if f['key'] == key)
    s, p = d['fn']()
    if kw:   # 모양을 바꿀 때는 다시 그린다
        base = dict(head={'A': 'leaf', 'B': 'needle', 'C': 'barb', 'D': 'needle'}[key], cock='w' if key == 'B' else None, bar=('b', 'B') if key == 'C' else None)
        base.update(kw); s = tpair(**base)
    if pal: p.update(pal)
    for (x, y, ch) in fx:
        if (x, y) not in s.part: s.fx[(x, y)] = ch
    return s, p
def Cb(key, pal=None, fx=()):
    d = next(f for f in carr.FR if f['key'] == key)
    s, p = d['fn']()
    if pal: p.update(pal)
    for (x, y, ch) in fx:
        if (x, y) not in s.part: s.fx[(x, y)] = ch
    return s, p
@make(1, 'A', '나무 화살', '나무 대 · 잎꼴 쇠 촉 · 잿빛 거위 깃 — 궁수가 처음 받는 화살')
def a01(): return T('A')
@make(10, 'B', '붉은 깃 화살', '짙은 나무 대 · 바늘 촉 · 붉은 깃 + 흰 수탉 깃')
def a10(): return T('B')
@make(20, 'C', '매깃 사냥 화살', '미늘 넓은 촉 · 줄무늬 매 깃 — 짐승 사냥')
def a20(): return T('C')
@make(30, 'D', '쇠 화살', '쇠 대 · 쇠 바늘 촉 · 검은 깃')
def a30(): return T('D')
@make(40, 'C', '멧돼지 사냥 화살', '짙은 나무 대 · 넓은 세모 촉 · 흰 · 갈색 줄무늬 깃', )
def a40(): return T('C', dict(a='#a8784a', A='#6a4424', f='#ffffff', F='#d8d0c0', b='#8a6438', B='#5a3a1e'), head='broad', hole=False)
@make(50, 'A', '자작나무 화살', '흰 자작나무 대 · 잎꼴 강철 촉 · 흰 깃 · 검은 감개')
def a50(): return T('A', dict(a='#f4ece0', A='#c8b898', f='#ffffff', F='#c8ccd4', n='#2a2a30', N='#141418', r='#2a2a30'), wrap='r')
@make(60, 'D', '흑철 화살', '검은 쇠 대 · 검은 바늘 촉 · 붉은 깃')
def a60(): return T('D', dict(a='#6a6a78', A='#34343e', f='#e8402a', F='#8a1a10', h='#8a8a98', g='#4a4a56', G='#202028', n='#4a4a56', N='#202028'))
@make(70, 'B', '백조깃 화살', '짙은 대 · 은 바늘 촉 · 흰 백조 깃 · 은 감개')
def a70(): return T('B', dict(a='#7a5a3a', A='#4a3420', f='#ffffff', F='#d8dee8', w='#ffffff', h='#ffffff', g='#c8ccd4', G='#7a84a0', r='#c8ccd4'), wrap='r')
@make(80, 'A', '카본 화살', '검은 카본 대(결 무늬) · 푸른 깃 + 흰 수탉 깃 · 푸른 오늬 · 흰 감개 · 탄두꼴 쇠 촉')
def a80(): return Cb('A')
@make(90, 'B', '형광 화살', '형광 연두 대와 깃 · 검은 수탉 깃 · 검은 오늬 · 검은 촉 — 쏜 화살을 찾기 쉽다')
def a90(): return Cb('B')
@make(100, 'C', '세 날 광역촉 화살', '검은 카본 대 · 주황 깃 · 주황 오늬 · 날 안에 구멍 난 세 날 광역촉 — 큰 짐승 사냥')
def a100(): return Cb('C')
@make(110, 'D', '빛 오늬 화살', '보랏빛 카본 대 · 흰 깃과 보라 깃 · 빛나는 오늬(초록 빛) · 보라 감개')
def a110(): return Cb('D')
@make(120, 'D', '서리 오늬 화살', '은빛 푸른 카본 대 · 흰 깃 · 빛나는 얼음 오늬 — 서리가 반짝인다')
def a120():
    s, p = Cb('D', dict(a='#c8e8f8', A='#6aa8d0', f='#ffffff', F='#9ad0f0', w='#ffffff', n='#e8fbff', N='#8af0ff', r='#ffffff', e='#bdeeff', **SP('#ffffff', '#bdeeff')),
              fx=[(18, 1, '1'), (13, 0, '2')])
    return s, p
@make(130, 'B', '불꽃 화살', '주홍 카본 대 · 노란 깃 · 붉은 오늬 · 금빛 촉 — 불씨가 날린다')
def a130(): return Cb('B', dict(a='#ff8a3a', A='#c84a1a', f='#ffd84a', F='#c8901a', w='#e8402a', n='#e8402a', N='#8a1a10', h='#fff0a0', g='#ffd860', G='#a87018',
                                **SP('#ffd84a', '#ff6a1a')), fx=[(18, 1, '1'), (13, 0, '2'), (18, 6, '2')])
@make(140, 'C', '용 사냥 화살', '검붉은 카본 대 · 붉은 깃 · 금 세 날 광역촉 — 용의 비늘을 뚫는다')
def a140(): return Cb('C', dict(a='#8a3a3a', A='#4a1a1a', f='#e8402a', F='#8a1a10', w='#ffd860', n='#ffd860', N='#a87018', h='#fff0a0', g='#ffd860', G='#a87018'))
@make(150, 'A', '별빛 화살', '밤하늘빛 카본 대 · 흰 깃 + 금 수탉 깃 · 금 오늬 · 금 감개 · 흰 별 촉 — 둘레에 별')
def a150(): return Cb('A', dict(a='#5a6ad0', A='#2a3a8a', f='#ffffff', F='#c8d8ff', w='#ffe890', n='#ffe890', N='#c8901a', r='#ffe890', h='#ffffff', g='#e8eef6', G='#8a94b8',
                                **SP('#ffffff', '#ffe890')), fx=[(18, 1, '1'), (13, 0, '2'), (2, 10, '1'), (17, 5, '2')])
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = [(ticon(d)[1].render(), '나무 ' + d['key']) for d in TFR]
    zoomsheet(out, 'arrow_t_z.png', z=12)
    out = [(icon(d)[1].render(), str(d['lv'])) for d in G]
    zoomsheet(out[:8], 'a16_1.png', z=8); zoomsheet(out[8:], 'a16_2.png', z=8)
