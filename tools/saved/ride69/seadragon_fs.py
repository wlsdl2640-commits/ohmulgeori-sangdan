"""해룡 탈것 앞모습 · 자는 모습 (빌드 69, 11-14 13:45 사용자 「다 추가하고」 — 시안 A~D 모두 넣는다).
꼴은 ../ride65/g/front.py · sleep.py와 같다:
  앞모습 두 겹 — 뒤(옆 잎 지느러미 · 몸 · 배 마디 · 말린 꼬리 · 안장) → 기수 → 앞(목 토막 · 정면 머리 · 뿔 · 뺨 지느러미), 장 front0 · front1(숨쉬기) + 앞 겹 _f
  자는 모습 — 몸을 옆으로 누이고 꼬리를 말아 앞에 두고, 머리는 가슴 앞 땅에 턱을 괸다, 장 sleep0 · sleep1
python3 seadragon_fs.py <seadragon.json>  → 같은 파일의 모습마다 front · sleep을 더한다 (seadragon.py를 먼저 돌린다)."""
import json, math, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ride65', 'g'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cv import Cv, ell, poly, path, thin, frames   # noqa: E402
from blunt import blunt                            # noqa: E402
import seadragon as SD                             # noqa: E402

W, H, CX = 44, 44, 22

# 정면 머리 (가로 12 · 뺨 지느러미 F/f → 이마 → 눈 → 짧은 용 주둥이 → 콧구멍 → 턱 · 송곳니 둘)
HEAD_F = """
F..........F
FF........FF
fFF.CQQC.FFf
.FCCQQQQCCF.
FCeKCQQCKeCF
.fCCCCCCCCf.
..CCAAAACC..
..CAKAAKAC..
...cwAAwc...
....cccc....
"""


def stamp(c, t, x0, y0, fin, fin2):
    for j, r in enumerate(t.strip('\n').split('\n')):
        for i, ch in enumerate(r):
            if ch == '.': continue
            c.set(x0 + i, y0 + j, fin if ch == 'F' else fin2 if ch == 'f' else ch)


def spiral(cx0, cy0, r0=3.0):
    return [(cx0 + math.cos(math.radians(a)) * r * r0 / 3.0, cy0 + math.sin(math.radians(a)) * r * r0 / 3.0)
            for a, r in ((180, 3.0), (225, 3.0), (270, 2.9), (315, 2.7), (360, 2.5), (405, 2.2), (450, 1.8), (500, 1.2))]


def front_sea(key, fr):
    S = SD.LOOKS[key][0]; FIN, FIN2 = S.get('finch', ('F', 'f'))
    back, fr_ = Cv(W + 10, H), Cv(W + 10, H); br = 1 if fr == 'front1' else 0; fin = 1 if fr == 'front1' else 0
    cx = CX + 5
    # 옆 잎 지느러미 (날개처럼 양옆 위로) · 아래 작은 잎
    for sx in (-1, 1):
        for (a, b, w) in (((cx + sx * 4.0, 22.4 - br), (cx + sx * 12.6, 15.2 - br - fin), 2.1), ((cx + sx * 4.4, 27.4 - br), (cx + sx * 10.8, 26.4 - br + fin * 0.6), 1.4)):
            L = SD.leaf(a, b, w)
            for (x, y) in L: back.set(x, y, FIN)
            for (x, y) in thin(a, b):
                if (x, y) in L: back.set(x, y, FIN2)
    # 몸통 (가슴 · 배) — 머리 밑으로 배 마디가 보이고, 그 밑에 말린 꼬리
    torso = ell(cx, 28.0 - br * 0.5, 5.0, 6.6)
    back.fill(torso, 'C')
    tp = [(cx + 0.2, 33.4), (cx + 0.8, 35.6)] + spiral(cx + 2.6, 38.0, 2.6)
    back.fill(path(tp[:3], 2.4, 1.6), 'C'); back.fill(path(tp[2:], 1.6, 0.9), 'C')
    for (a, b, w) in (((cx - 1.2, 35.0), (cx - 4.6, 37.2 + fin * 0.4), 1.0), ((cx + 4.8, 38.6), (cx + 7.4, 40.2), 0.9)):   # 꼬리 잎
        back.under(SD.leaf(a, b, w), FIN2)
    blunt(back.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    for (x, y) in torso:   # 배 마디 (가운데 띠, 줄마다 번갈아)
        if abs(x + 0.5 - cx) < 3.0 and y >= 25 - br and back.get(x, y) in 'CQc': back.set(x, y, 'A' if y % 2 == 0 else 'a')
    # 안장 천 · 안장
    cloth, trim = S.get('cloth', 'R'), S.get('trim', 'G')
    for sx in (-1, 1):
        cl = poly([(cx + sx * 5.8, 21.0 - br), (cx + sx * 3.2, 20.4 - br), (cx + sx * 3.2, 25.0 - br), (cx + sx * 5.6, 25.4 - br)])
        for (x, y) in cl:
            if back.get(x, y) in 'CQcAa' or back.get(x, y) == FIN: back.set(x, y, cloth)
        for (x, y) in cl:
            if (x, y + 1) not in cl and back.get(x, y) == cloth: back.set(x, y, trim)
    back.fill(poly([(cx - 3.6, 19.6 - br), (cx + 3.6, 19.6 - br), (cx + 3.8, 21.4 - br), (cx - 3.8, 21.4 - br)]), 'W')
    for sx in (-1, 1): back.fill(poly([(cx + sx * 3.8, 18.6 - br), (cx + sx * 2.6, 18.6 - br), (cx + sx * 2.6, 20.0 - br), (cx + sx * 3.8, 20.0 - br)]), 'V')
    if S.get('post') is SD.glow_post:   # C: 몸 · 지느러미 빛 점
        for (x, y) in ((cx - 3, 29), (cx + 3, 31), (cx - 2, 33), (cx + 4, 37)):
            if back.get(x, y - br) in 'CQcAa': back.set(x, y - br, 'L')
        for sx in (-1, 1):
            for (x, y) in ((cx + sx * 11, 17), (cx + sx * 9, 19)):
                if back.get(x, y - br) in (FIN, FIN2): back.set(x, y - br, 'L')
    if S.get('post') is SD.kelp_post:   # B: 몸에서 늘어진 해초 잎
        for (a, b, w) in (((cx - 4.4, 30.0), (cx - 6.6, 35.0), 0.9), ((cx + 4.4, 30.6), (cx + 6.4, 35.4), 0.9)):
            for (x, y) in SD.leaf(a, b, w):
                if back.get(x, y) in '.Cc': back.set(x, y, FIN)
    # ── 앞 겹: 목 토막 + 정면 머리 (가슴 앞에 숙임) + 뿔
    hy0 = 22 - br
    for y in range(int(20 - br), hy0 + 3):
        for x in range(cx - 1, cx + 1): fr_.set(x, y, 'C')
    fr_.set(cx - 2, 21 - br, 'c'); fr_.set(cx + 1, 21 - br, 'c')
    stamp(fr_, HEAD_F, cx - 6, hy0, FIN, FIN2)
    for sx in (-1, 1):   # 뿔: 이마에서 위 · 바깥으로
        ln = [(cx + sx * 1.6, hy0 + 2.4), (cx + sx * 3.0, hy0 - 0.2), (cx + sx * 3.6, hy0 - 2.6)]
        for (x, y) in path(ln, 0.85, 0.45):
            if fr_.get(x, y) in '.' or fr_.get(x, y) in (FIN, FIN2): fr_.set(x, y, 'Z')
        for (x, y) in path(ln, 0.85, 0.45):
            if fr_.get(x + sx, y) == '.' and fr_.get(x, y) == 'Z': fr_.set(x, y, 'z')
        if S.get('hornfx') is SD.coral_horns:   # A: 산호 곁가지
            for (x, y) in path([(cx + sx * 2.8, hy0 + 0.4), (cx + sx * 4.8, hy0 - 1.0)], 0.5, 0.35):
                if fr_.get(x, y) == '.': fr_.set(x, y, 'z')
        if S.get('post') is SD.glow_post: fr_.set(cx + sx * 3.6, hy0 - 2.6, 'L')
    if S.get('post') is SD.pearl_post: fr_.set(cx - 1, hy0 + 2, 'P'); fr_.set(cx, hy0 + 2, 'p')
    if S.get('post') is SD.kelp_post:
        for sx in (-1, 1):
            for (x, y) in SD.leaf((cx + sx * 5.4, hy0 + 5.0), (cx + sx * 6.4, hy0 + 9.6), 0.8):
                if fr_.get(x, y) == '.': fr_.set(x, y, FIN)
    return back, fr_, (cx, 20.4 - br)


def front_emit(key):
    b0, f0, s0 = front_sea(key, 'front0'); b1, f1, s1 = front_sea(key, 'front1')
    o, top = frames([b0, b1, f0, f1])
    return {'frames': {'front0': o[0], 'front1': o[1], 'front0_f': o[2], 'front1_f': o[3]}, 'ax': CX + 5,
            'seat': {'front0': [round(s0[0]), round(s0[1]) - top], 'front1': [round(s1[0]), round(s1[1]) - top]}}


def sleep_sea(key, fr):
    S = SD.LOOKS[key][0]; FIN, FIN2 = S.get('finch', ('F', 'f'))
    c = Cv(W + 6, H); br = 1 if fr == 'sleep1' else 0
    # 몸: 엎드려 웅크린 몸 (오른쪽이 가슴) — 짧고 둥글게
    body = SD.rell((25.6, 33.2 - br * 0.4), 7.2, 5.0 + br * 0.4, 0.0) | SD.rell((30.8, 31.8 - br * 0.5), 4.6, 4.6 + br * 0.3, 0.0)
    c.fill(body, 'C')
    # 꼬리: 몸 왼쪽 아래에서 나와 앞에 크게 한 바퀴 (가운데가 빈 고리 — 해마 꼬리로 읽히게)
    tp = [(20.0, 36.6), (17.4, 37.8)] + spiral(14.2, 35.6, 3.4)
    c.fill(path(tp[:3], 2.2, 1.7), 'C'); c.fill(path(tp[2:], 1.7, 0.9), 'C')
    # 등 지느러미 (접혀 등에 붙은 부채) · 꼬리 잎
    df = poly([(20.6, 30.0 - br), (22.6, 26.0 - br), (27.6, 25.6 - br), (29.6, 28.8 - br)])
    for (x, y) in df:
        if c.get(x, y) == '.' or (x, y) in body: c.set(x, y, FIN)
    for k in range(3):
        for (x, y) in thin((22.0 + k * 2.4, 29.6 - br), (23.0 + k * 1.8, 26.4 - br)):
            if (x, y) in df: c.set(x, y, FIN2)
    c.under(SD.leaf((11.4, 34.8), (8.2, 32.2 - br * 0.5), 1.1), FIN2)
    # 목 · 머리: 가슴에서 앞으로 숙여 땅에 턱을 괸다 (오른쪽을 봄)
    nk = [(32.4, 29.0 - br), (35.6, 28.6 - br), (38.0, 31.4 - br * 0.5)]
    c.fill(path(nk, 2.5, 2.1), 'C')
    hx, hy = 39.6, 34.0 - br * 0.3
    hd = ell(hx, hy, 3.4, 2.8) | poly([(hx + 1.2, hy - 1.6), (hx + 5.6, hy - 0.6), (hx + 6.2, hy + 0.9), (hx + 5.4, hy + 2.0), (hx + 1.0, hy + 2.4)])
    c.fill(hd, 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)
    # 배 마디 (몸 아래 · 가슴 앞, 칸마다 번갈아)
    for (x, y) in body:
        if (x, y + 1) not in body or (x, y + 2) not in body:
            if x >= 21 and c.get(x, y) in 'CQc': c.set(x, y, 'A' if x % 2 == 0 else 'a')
    for (x, y) in path(nk, 2.4, 2.0):
        if c.get(x, y) in 'CQc' and (x, y + 1) not in path(nk, 2.4, 2.0) | body | hd: c.set(x, y, 'a')
    # 뿔: 머리 위에서 뒤(왼쪽)로 눕힘
    for (a, b, ch, r0, r1) in (((39.0, 31.6), (35.2, 28.6), 'Z', 0.9, 0.45), ((40.2, 31.2), (37.4, 27.6), 'z', 0.8, 0.4)):
        for (x, y) in path([(a[0], a[1] - br * 0.3), ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.6 - br * 0.3), (b[0], b[1] - br * 0.3)], r0, r1):
            if c.get(x, y) in '.CQc': c.set(x, y, ch)
    if S.get('hornfx') is SD.coral_horns:
        for (x, y) in path([(36.8, 29.8 - br * 0.3), (35.6, 27.4 - br * 0.3)], 0.5, 0.35):
            if c.get(x, y) == '.': c.set(x, y, 'z')
    # 뺨 지느러미 (머리 뒤)
    for (x, y) in SD.leaf((37.6, 34.4 - br * 0.3), (34.6, 36.6), 1.2):
        if c.get(x, y) in '.CQcAa': c.set(x, y, FIN)
    # 감은 눈 · 콧구멍 · 입
    c.set(round(hx), round(hy - 1), 'K'); c.set(round(hx) + 1, round(hy - 1), 'K')
    c.set(round(hx + 4.6), round(hy - 0.2), 'K')
    for i in range(3): c.set(round(hx + 2 + i), round(hy + 1.4), 'K')
    if S.get('post') is SD.pearl_post: c.set(round(hx - 0.6), round(hy - 2.2), 'P'); c.set(round(hx + 0.4), round(hy - 2.2), 'p')
    if S.get('post') is SD.glow_post:
        for (x, y) in ((23, 33), (28, 35), (31, 31), (14, 39), (24, 27)):
            if c.get(x, y - br) in 'CQcAaFf' or c.get(x, y - br) in (FIN, FIN2): c.set(x, y - br, 'L')
    if S.get('post') is SD.kelp_post:
        for (a, b, w) in (((27.0, 37.4), (30.0, 39.6), 0.8), ((20.6, 30.4 - br), (17.4, 28.0 - br), 0.9)):
            for (x, y) in SD.leaf(a, b, w):
                if c.get(x, y) in '.Cc': c.set(x, y, FIN)
    return c


def sleep_emit(key):
    fs = [sleep_sea(key, 'sleep0'), sleep_sea(key, 'sleep1')]
    outs, top = frames(fs)
    return {'frames': {'sleep0': outs[0], 'sleep1': outs[1]}, 'ax': 25}


if __name__ == '__main__':
    p = sys.argv[1]; D = json.load(open(p))
    for key in SD.LOOKS:
        D[key]['front'] = front_emit(key)
        D[key]['sleep'] = sleep_emit(key)
    json.dump(D, open(p, 'w'), ensure_ascii=False, indent=0)
    print(D['seaA']['front']['frames']['front0'])
    print(D['seaA']['front']['frames']['front0_f'])
    print(D['seaA']['sleep']['frames']['sleep0'])
