"""볼트통 — 석궁 쓰는 직업(괴물사냥꾼 · 드래곤 슬레이어)의 화살통 자리. 허리에 찬다(초소형 가방 자리, 11-10 22:36 사용자).
앞모습 · 좌우 대칭: 작은 주머니 + 허리띠 고리 + 위로 비죽 나온 볼트 꼬리(깃).
글자: 주머니 a b c(빛 · 몸 · 그늘) · 실밥 d · 띠 k K · 버클 o O · 쇠 h g · 볼트 대 e · 깃 f F · 털 w W"""
from sh import Sh
def put_rows(s, rows, ox, oy, mapch=None):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch != '.': s.put(ox + i, oy + j, (mapch or {}).get(ch, ch))
def mirror(s):
    for (x, y), ch in list(s.body.items()):
        if (19 - x, y) not in s.body: s.body[(19 - x, y)] = ch
def pouch(s, x0=5, x1=14, y0=8, y1=17, round_=2):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            cut = max(0, round_ - (y1 - y)) if y > y1 - round_ else 0
            if x < x0 + cut or x > x1 - cut: continue
            k = (x - x0) / (x1 - x0)
            s.put(x, y, 'a' if k < 0.25 or y == y0 else ('c' if k > 0.75 or y == y1 else 'b'))
def tails(s, xs, y0=2, y1=8, vane=('f', 'F'), lift=(0, -1, 0, 0)):
    """볼트 꼬리: 2칸 대 + 위쪽 깃(갈라진 끝 · 대 쪽으로 좁아짐). 볼트마다 사이 한 칸 비움(테두리가 가른다)"""
    for i, x in enumerate(xs):
        t = y0 + (lift[i] if i < len(lift) else 0)
        for y in range(t + 3, y1 + 1): s.put(x, y, 'e'); s.put(x + 1, y, 'e')
        for (dx, dy, ch) in ((-1, 0, 0), (2, 0, 1), (-1, 1, 0), (0, 1, 0), (1, 1, 1), (2, 1, 1), (0, 2, 0), (1, 2, 1)):
            s.put(x + dx, t + dy, vane[ch])
def belt(s, y=9, x0=2, x1=17):
    for x in list(range(x0, 5)) + list(range(15, x1 + 1)):
        s.put(x, y, 'k'); s.put(x, y + 1, 'K')
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(a='#c8946a', b='#9a6a42', c='#6a4426', d='#e8d0a0', k='#5a3a22', K='#3a2414', o='#e0c060', O='#a87818', h='#e8eef6', g='#7a8290',
            e='#8a6438', f='#f0e8d8', F='#b8ac94', w='#e8dcc8', W='#a89880')
@frm('A', '가죽 볼트통', '가죽 주머니 · 앞 실밥 · 볼트 셋 · 허리띠')
def cA():
    s = Sh(); belt(s); tails(s, (4, 9, 14), lift=(1, 0, 1)); pouch(s)
    for y in range(10, 16): s.put(9, y, 'd') if y % 2 == 0 else None
    for x in range(6, 14, 2): s.put(x, 15, 'd')
    mirror(s); return s, dict(BASE)
@frm('B', '천 볼트통', '국방색 천 · 끈 둘 · 금 버클 · 볼트 넷')
def cB():
    s = Sh(); belt(s); tails(s, (3, 7, 11, 15), lift=(1, 0, 0, 1)); pouch(s, 4, 15)
    for x in (6, 13):
        for y in range(8, 16): s.put(x, y, 'k')
        s.put(x, 12, 'o'); s.put(x, 13, 'O')
    mirror(s); return s, dict(BASE, a='#8a9a6a', b='#5e6e44', c='#3e4a2a', k='#2e3420', K='#1e2414', e='#6a5a3a')
@frm('C', '쇠테 볼트통', '검은 가죽 · 쇠 테두리 · 징 · 붉은 깃 볼트 셋')
def cC():
    s = Sh(); belt(s); tails(s, (4, 9, 14), lift=(1, 0, 1)); pouch(s)
    for x in range(5, 15): s.put(x, 8, 'h')
    for y in range(8, 16): s.put(5, y, 'h'); s.put(14, y, 'g')
    for (x, y) in ((7, 11), (12, 11), (7, 14), (12, 14)): s.put(x, y, 'o')
    mirror(s); return s, dict(BASE, a='#4a3a3a', b='#2e2424', c='#1a1414', f='#f05a4a', F='#9a2a22', o='#c8ccd4')
@frm('D', '털 볼트통', '털 두른 입구 · 짐승 가죽 · 검은 깃 볼트 셋')
def cD():
    s = Sh(); belt(s); tails(s, (4, 9, 14), lift=(1, 0, 1)); pouch(s)
    for x in range(4, 16):
        s.put(x, 8, 'w' if x % 2 else 'W'); s.put(x, 9, 'W' if x % 2 else 'w')
    mirror(s); return s, dict(BASE, a='#b88a5a', b='#8a6038', c='#5a3a1e', f='#4a4a56', F='#22222a')
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
