"""컴파운드 보우 전용 화살 (11-10 23:40 사용자: 「컴파운드보우 전용 화살도 추가해주고」). 칼과 같은 축(x + y = 19), 촉이 오른쪽 위.
사용자 참고 사진에서 짜임만 따랐다(상표 · 글자 없음): 가는 카본 대(한 칸, 결 무늬) · 짧은 플라스틱 깃(포물선꼴, 위아래 둘) · 색 오늬 · 깃 앞 감개(줄)
· 촉은 탄두꼴 필드 촉 또는 세 날 광역촉(날 안에 구멍). 궁수 공통 화살(나무 대 · 새 깃)과 달라 보이게.
둘을 나란히 두고 사이를 비워(테두리가 갈라 준다) 한 자루씩 읽히게 · 깃 자리를 엇갈리게.
글자: 대 a A · 깃 f F(위 · 아래) · 수탉 깃 w · 오늬 n N · 감개 r · 촉 h g G · 촉 구멍 K · 빛(효과) e"""
from g4 import Sw
from bow import P
HEADS = {   # 촉: 대 끝 다음 칸부터 (u 한 칸마다 반폭)
    'field': [1.0, 1.0, 1.0, 0.0],
    'bullet': [1.0, 1.0, 1.0, 0.0],
    'broad': [2.0, 2.6, 2.0, 1.5, 1.0, 0.0],
}
def arrow(s, v0, u0, u1, head='field', sh=('a', 'A'), vane=('f', 'F'), cock=None, nock=('n', 'N'), wrap=None, vlen=5,
          vh=(2.0, 2.0, 2.0, 1.0, 1.0), hole=False):
    """한 자루: u0 = 오늬 끝, u1 = 대 끝(촉 앞)"""
    for u in range(u0 + 1, u1 + 1):                                                        # 대: 한 칸 · 결(두 칸마다 밝고 어둡게)
        P(s, 'blade', u, v0, sh[0] if (u // 2) % 3 == 0 else sh[1])
    for u in (u0 - 1, u0, u0 + 1):                                                         # 오늬: 끝 두 칸
        P(s, 'pommel', u, v0, nock[0] if u <= u0 else nock[1])
        if u == u0 - 1:
            for v in (v0 - 1, v0 + 1): P(s, 'pommel', u, v, nock[1])
    for k in range(vlen):                                                                  # 깃: 꼬리 쪽이 높고 앞으로 낮아진다 (위아래 둘)
        u = u0 + 2 + k; h = vh[min(k, len(vh) - 1)]
        for v in range(int(v0 - h - 1), int(v0 + h + 2)):
            if v == v0 or abs(v - v0) > h + 1e-6: continue
            top = v < v0
            ch = (cock if (cock and top) else vane[0]) if top else vane[1]
            P(s, 'grip', u, v, ch)
    if wrap:                                                                               # 깃 앞 감개 (대 위 두 칸)
        for u in (u0 + 2 + vlen, u0 + 3 + vlen): P(s, 'blade', u, v0, wrap)
    W = HEADS[head]
    for k, hw in enumerate(W):                                                             # 촉
        u = u1 + 1 + k
        for v in range(int(v0 - hw - 1), int(v0 + hw + 2)):
            if abs(v - v0) <= hw + 1e-6:
                ch = 'h' if v < v0 else ('G' if v > v0 else 'g')
                if hole and head == 'broad' and 1 <= k <= 2 and abs(v - v0) == 1 and abs(v - v0) < hw: ch = 'K'
                P(s, 'head', u, v, ch)
    if head == 'broad':                                                                    # 광역촉 밑동(대에 끼우는 깃)
        for v in (v0 - 1, v0 + 1): P(s, 'head', u1, v, 'G')
def pair(**kw):
    s = Sw(); s.fx = {}
    arrow(s, -3, -13, 9 if kw.get('head') != 'broad' else 7, **kw)
    arrow(s, 4, -11, 9 if kw.get('head') != 'broad' else 7, **kw)
    return s
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(a='#7a7a8a', A='#4a4a56', f='#6ab0ff', F='#2a6ac8', w='#f0f4fa', n='#4a9aff', N='#1a4a9a', r='#e8eef6',
            h='#f0f4fa', g='#a8b0bc', G='#5a6270', K='#1a1414', e='#8aff5a')
@frm('A', '카본 화살', '검은 카본 대(결 무늬) · 푸른 깃 + 흰 수탉 깃 · 푸른 오늬 · 흰 감개 · 탄두꼴 쇠 촉')
def aA(): return pair(head='bullet', cock='w', wrap='r'), dict(BASE)
@frm('B', '형광 화살', '눈에 잘 띄는 형광 연두 대와 깃 · 검은 수탉 깃 · 검은 오늬 · 검은 촉 — 쏜 화살을 찾기 쉽다')
def aB(): return pair(head='field', cock='w'), dict(BASE, a='#d8ff4a', A='#9ad81a', f='#c8f03a', F='#7aa81a', w='#3a3a44',
                                                    n='#3a3a44', N='#16161c', h='#6a6a76', g='#3a3a44', G='#16161c')
@frm('C', '사냥 화살 (세 날 광역촉)', '검은 카본 대 · 주황 깃 · 주황 오늬 · 날 안에 구멍 난 세 날 광역촉 — 큰 짐승 사냥')
def aC(): return pair(head='broad', hole=True, cock='w'), dict(BASE, f='#ff7a2a', F='#c8401a', w='#f0e0c8', n='#ff8a3a', N='#a8401a',
                                                                    h='#e8eef6', g='#a8b0bc', G='#4a505c')
@frm('D', '빛 오늬 화살', '보랏빛 카본 대 · 흰 깃과 보라 깃 · 빛나는 오늬(초록 빛) · 보라 감개 · 쇠 촉')
def aD():
    s = pair(head='field', cock='w', wrap='r')
    for (x, y), (part, ch) in list(s.part.items()):                                       # 오늬 둘레 빛 (효과)
        if ch == 'n':
            for dx, dy in ((-1, 0), (0, 1), (-1, 1)):
                q = (x + dx, y + dy)
                if q not in s.part: s.fx[q] = 'e'
    return s, dict(BASE, a='#7a5aa8', A='#4a326e', f='#b88aff', F='#6a3ab8', w='#f4f0ff', n='#c8ff8a', N='#6ad83a', r='#b88aff', e='#8aff5a')
def icon(d):
    s, pal = d['fn']()
    ic = s.icon(pal, fx=dict(s.fx))
    return s, ic
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in FR:
        s, ic = icon(d)
        out.append((ic.render(), '화살 ' + d['key']))
    zoomsheet(out, 'carr_z.png', z=14)
