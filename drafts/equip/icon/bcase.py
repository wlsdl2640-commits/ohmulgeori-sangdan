"""볼트통 — 석궁 쓰는 직업(괴물사냥꾼 · 드래곤 슬레이어)의 화살통 자리. 허리에 찬다(초소형 가방 자리, 11-10 22:36 사용자).
앞모습 · 좌우 대칭. 11-10 22:53 「볼트통보다 볼트가 더 커서 이상함 — 볼트통 안으로 들어가고 밖으로 튀어나가지 않게」:
통(뒤판이 앞판보다 높다)이 그림의 대부분 · 볼트는 통 안에 꽂혀 뒤판과 앞판 사이로 작은 깃 끝만 보인다(뒤판 위로 안 나감).
글자: 주머니 a b c(빛 · 몸 · 그늘) · 실밥 d · 띠 k K · 버클 o O · 쇠 h g · 볼트 대 e · 깃 f F · 털 w W"""
from sh import Sh
def put_rows(s, rows, ox, oy, mapch=None):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch != '.': s.put(ox + i, oy + j, (mapch or {}).get(ch, ch))
def mirror(s):
    for (x, y), ch in list(s.body.items()):
        if (19 - x, y) not in s.body: s.body[(19 - x, y)] = ch
def case(s, x0=3, x1=16, back=4, front=8, y1=18, round_=2, cols='abc', back_c='c'):
    """뒤판(back부터, 짙게) + 앞판(front부터) · 아래 모서리 둥글게"""
    for y in range(back, y1 + 1):
        for x in range(x0, x1 + 1):
            cut = max(0, round_ - (y1 - y)) if y > y1 - round_ else 0
            if x < x0 + cut or x > x1 - cut: continue
            if y < front:
                s.put(x, y, back_c if 0 < x - x0 < x1 - x0 else 'K'); continue
            k = (x - x0) / (x1 - x0)
            s.put(x, y, cols[0] if k < 0.2 or y == front else (cols[2] if k > 0.8 or y == y1 else cols[1]))
def tips(s, xs, y0=5, y1=7, vane=('f', 'F')):
    """통 안에 꽂힌 볼트: 앞판 위로 깃 끝 두 줄 + 대 한 줄만 (2칸 너비)"""
    for x in xs:
        s.put(x, y0, vane[0]); s.put(x + 1, y0, vane[1])
        s.put(x, y0 + 1, vane[0]); s.put(x + 1, y0 + 1, vane[1])
        for y in range(y0 + 2, y1 + 1): s.put(x, y, 'e'); s.put(x + 1, y, 'e')
def belt(s, y=10, x0=1, x1=18):
    for x in list(range(x0, 3)) + list(range(17, x1 + 1)):
        s.put(x, y, 'k'); s.put(x, y + 1, 'K')
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(a='#c8946a', b='#9a6a42', c='#6a4426', d='#e8d0a0', k='#5a3a22', K='#3a2414', o='#e0c060', O='#a87818', h='#e8eef6', g='#7a8290',
            e='#8a6438', f='#f0e8d8', F='#b8ac94', w='#e8dcc8', W='#a89880')
@frm('A', '가죽 볼트통', '가죽 통 · 앞 실밥 · 안에 꽂힌 볼트 셋(깃 끝만) · 허리띠')
def cA():
    s = Sh(); belt(s); case(s); tips(s, (5, 9, 13))
    for y in range(11, 17, 2): s.put(9, y, 'd'); s.put(10, y, 'd')
    mirror(s); return s, dict(BASE)
@frm('B', '천 볼트통', '국방색 천 통 · 끈 둘 · 금 버클 · 볼트 넷')
def cB():
    s = Sh(); belt(s); case(s); tips(s, (4, 7, 11, 14))
    for x in (6, 13):
        for y in range(8, 17): s.put(x, y, 'k')
        s.put(x, 12, 'o'); s.put(x, 13, 'O')
    mirror(s); return s, dict(BASE, a='#8a9a6a', b='#5e6e44', c='#3e4a2a', k='#2e3420', K='#1e2414', e='#6a5a3a')
@frm('C', '쇠테 볼트통', '검은 가죽 통 · 쇠 테두리 · 징 · 붉은 깃 볼트 셋')
def cC():
    s = Sh(); belt(s); case(s); tips(s, (5, 9, 13))
    for x in range(3, 17): s.put(x, 8, 'h')
    for y in range(8, 17): s.put(3, y, 'h'); s.put(16, y, 'g')
    for (x, y) in ((6, 11), (13, 11), (6, 15), (13, 15)): s.put(x, y, 'o')
    mirror(s); return s, dict(BASE, a='#4a3a3a', b='#2e2424', c='#1e1818', f='#f05a4a', F='#9a2a22', o='#c8ccd4', K='#120e0e')
@frm('D', '털 볼트통', '털 두른 통 입구 · 짐승 가죽 · 검은 깃 볼트 셋')
def cD():
    s = Sh(); belt(s); case(s); tips(s, (5, 9, 13))
    for x in range(3, 17):
        s.put(x, 8, 'w' if x % 2 else 'W'); s.put(x, 9, 'W' if x % 2 else 'w')
    mirror(s); return s, dict(BASE, a='#b88a5a', b='#8a6038', c='#5a3a1e', f='#5a5a66', F='#2e2e38')
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal)
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    for d in FR:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d['key'], 'sym', len(e), e[:4])
        out.append((ic.render(), '볼트통 ' + d['key']))
    zoomsheet(out, 'bcase_z.png', z=12)
