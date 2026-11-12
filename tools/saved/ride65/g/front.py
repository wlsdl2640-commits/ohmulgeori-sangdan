"""탈것 정면 모습 (영웅 화면 · 초상 · 상단 앞). 두 겹: 뒤(몸 · 날개 · 안장 천) → 기수 → 앞(머리 · 가슴 · 앞다리).
머리는 손으로 그린 틀(반 해상도 칸)을 찍는다. 장: front0 · front1(숨쉬기) + 앞 겹 front0_f · front1_f.
python3 front.py → ../t/front.json"""
import json, math
from cv import Cv, ell, poly, path, box, blunt, frames, thin, thins, wing, bone_cells
import wolf as WO
import wyv as WY

W, H, CX, GY = 44, 44, 22, 41


def stamp(c, t, x0, y0, skip='.'):
    for j, r in enumerate(t.strip('\n').split('\n')):
        for i, ch in enumerate(r):
            if ch not in skip: c.set(x0 + i, y0 + j, ch)


# ───────────── 늑대 정면 틀 (가로 10 · 귀 → 눈 → 주둥이 → 턱)
HEAD_W = """
.C......C.
.CC....CC.
.CAC..CAC.
cCACQQCACc
cCCCQQCCCc
CKeCCCCeKC
CCCAAAACCC
AACAAAACAA
.AAAKKAAA.
..AAAAAA..
"""
CHEST_W = """
.cAAAAAAc.
cCAAAAAACc
cCCAAAACCc
.cCCCCCCc.
"""
LEGS_W = """
..CC..CC..
..CC..CC..
..CC..CC..
..CC..CC..
..Cc..cC..
.AAA..AAA.
"""
# 다이어울프: 머리가 더 넓고 갈기가 둘레를 감싼다(좌우 다르게) · 작은 귀 · 짙은 눈썹 · 송곳니
HEAD_B = """
.F..F.....F..
.FFdF..F.FdF.
FFdCdFFFFdCdF
FCCCCQQQQCCCF
FCCCCQQQQCCCF.
FCKKeCCCCeKKCF
FCCCCCCCCCCCF
.FCCCQQQQCCF.
.FCCwQKKQwCF.
..FCCCQQCCF..
...FcccccF...
"""
CHEST_B = """
.cCCQQQQCCc.
cCCCCQQCCCCc
cCCCCCCCCCCc
.cCCCCCCCCc.
"""
LEGS_B = """
..CCC..CCC..
..CCC..CCC..
..CCC..CCC..
..CCc..cCC..
.cccc..cccc.
"""


def wolf_front(opt, fr):
    back, fr_ = Cv(W, H), Cv(W, H); br = 1 if fr == 'front1' else 0
    big = opt == 'B'
    hw = 13 if big else 10
    top = 18                       # 머리 틀 맨 윗줄
    hx0 = CX - hw // 2
    # ── 뒤 겹: 어깨 · 몸 · 뒷다리 · 꼬리 · 안장 천
    bw = 16 if big else 14
    body = box(CX - bw // 2, top + 2 - br, CX + bw // 2 - 1, top + 13)
    body = {(x, y) for (x, y) in body if not ((x in (CX - bw // 2, CX + bw // 2 - 1)) and y in (top + 2 - br, top + 13))}
    for (x, y) in body: back.set(x, y, 'C')
    for sx in (-1, 1):   # 뒷다리 (몸 바깥쪽, 짙게)
        x = CX + sx * (bw // 2 - 1) - (1 if sx > 0 else 0)
        for y in range(top + 14, top + 19): back.set(x, y, 'd'); back.set(x + 1, y, 'd')
        for dx in (-1, 0, 1, 2): back.set(x + dx, top + 19, 'd')
    tail = path([(CX + bw / 2, top + 6 - br), (CX + bw / 2 + 2.4, top + 9), (CX + bw / 2 + 3.0, top + 13)], 1.6 if not big else 1.9, 1.2)
    for (x, y) in tail:
        if back.get(x, y) == '.': back.set(x, y, 'C')
    blunt(back.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    for (x, y) in path([(CX + bw / 2 + 2.4, top + 9), (CX + bw / 2 + 3.0, top + 13)], 1.3, 1.3) & tail:
        if back.get(x, y) in 'CQc': back.set(x, y, {'A': 'A', 'B': 'c', 'C': 'd', 'D': 'A'}[opt])
    def cloth(ch, trim, h, zig=None):
        for sx in (-1, 1):
            x0 = CX + sx * (bw // 2) - (3 if sx > 0 else 0)
            for y in range(top + 3 - br, top + 3 + h):
                for dx in range(3): back.set(x0 + dx + (0 if sx > 0 else 0), y, trim if y == top + 2 + h else ch)
            if zig:
                for dx in range(3): back.set(x0 + dx, top + h - (dx % 2), zig)
    if opt == 'A': cloth('R', 'G', 7)
    if opt == 'B':
        for sx in (-1, 1):
            x0 = CX + sx * (bw // 2) - (3 if sx > 0 else 0)
            for y in range(top + 3, top + 10):
                for dx in range(3): back.set(x0 + dx, y, 'O')
            for dx in range(3): back.set(x0 + dx, top + 10 + (dx % 2), 'o')
    if opt == 'C': cloth('R', 'r', 8, zig='Z')
    if opt == 'D': cloth('J', 'G', 13)
    for x in range(CX - 4, CX + 4):   # 안장 (기수에 거의 가림)
        back.set(x, top + 2 - br, 'W'); back.set(x, top + 3 - br, 'V')
    # ── 앞 겹: 머리 · 가슴 · 앞다리
    if big:
        stamp(fr_, HEAD_B, hx0, top); stamp(fr_, CHEST_B, CX - 6, top + 11); stamp(fr_, LEGS_B, CX - 6, top + 15)
    else:
        stamp(fr_, HEAD_W, hx0, top); stamp(fr_, CHEST_W, hx0, top + 10); stamp(fr_, LEGS_W, hx0, top + 14)
    if opt == 'C':   # 깃털 굴레 (귀 밑에서 양쪽으로 늘어짐) · 볼 무늬 · 구슬
        for sx, x in ((-1, hx0 - 1), (1, hx0 + hw)):
            for k, y in enumerate(range(top + 3, top + 8)): fr_.set(x, y, 'R' if k < 4 else 'Z')
            fr_.set(x - sx, top + 3, 'G')
        fr_.set(hx0 + 1, top + 7, 'Z'); fr_.set(hx0 + 8, top + 7, 'Z')
    if opt == 'D':   # 쇠 투구: 이마에서 콧등까지 판 · 이마 뿔 · 가슴 판
        for y in range(top + 2, top + 8):
            fr_.set(hx0 + 4, y, 'x'); fr_.set(hx0 + 5, y, 'M' if y < top + 7 else 'N')
        for y in (top + 3, top + 4):
            fr_.set(hx0 + 3, y, 'M'); fr_.set(hx0 + 6, y, 'N')
        fr_.set(hx0 + 4, top + 1, 'x'); fr_.set(hx0 + 4, top, 'M')
        for (x, y) in box(hx0 + 3, top + 11, hx0 + 6, top + 12): fr_.set(x, y, 'M' if x < hx0 + 5 else 'N')
        fr_.set(hx0 + 4, top + 11, 'G')
    seat = (CX, top + 2 - br)
    return back, fr_, seat


# ───────────── 와이번 정면 틀 (가로 10 · 뿔 → 눈 → 주둥이)
HEAD_Y = {
 'A': """
Z........Z
zZ......Zz
.zCC..CCz.
.CCQQQQCC.
CKeCCCCeKC
CCCCCCCCCC
.CCAAAACC.
.CCKAAKCC.
..CAAAAC..
...cccc...
""",
 'B': """
..........
J.z....z.J
JJCC..CCJJ
JCCQQQQCCJ
CKeCCCCeKC
JCCCCCCCCJ
.CCAAAACC.
.CCKAAKCC.
..CAAAAC..
...cccc...
""",
 'C': """
Z..........Z
.Z........Z.
.zZ......Zz.
..zCC..CCz..
..CCQQQQCC..
.CeKCCCCKeC.
.CCCCCCCCCC.
..CCAAAACC..
..CCKAAKCC..
...CAAAAC...
....cccc....
""",
}


def wyv_front(opt, fr):
    S = {'A': WY.S_A, 'B': WY.S_B, 'C': WY.S_C}[opt]
    back, fr_ = Cv(W + 10, H), Cv(W + 10, H); br = 1 if fr == 'front1' else 0
    cx = CX + 5
    up_ = 0 if fr == 'front0' else 1   # 날개: 0 위 · 1 조금 내림
    for sx in (-1, 1):
        sh = (cx + sx * 3.0, 20.4 - br); wr = (cx + sx * 9.6, (10.6 if not up_ else 13.6) - br)
        tips = [(cx + sx * 17.4, (8.0 if not up_ else 12.2)), (cx + sx * 19.0, (14.4 if not up_ else 18.4)), (cx + sx * 15.0, (20.6 if not up_ else 23.6))]
        if opt == 'B': tips = tips + [(cx + sx * 11.6, (23.6 if not up_ else 26.0))]
        m, bones = wing(sh, wr, tips, (cx + sx * 5.6, 23.4 - br), S.get('depth', 1.6))
        for (x, y) in m: back.set(x, y, 'F')
        for (x, y) in m:
            if (x, y + 1) not in m: back.set(x, y, 'f')
        if S.get('holes'):
            for t in tips[:2]:
                mx, my = (wr[0] * 0.45 + t[0] * 0.55), (wr[1] * 0.45 + t[1] * 0.55) + 1.2
                if (round(mx), round(my)) in m: back.set(mx, my, '.')
        for (x, y) in bone_cells([bones[0]], 1.0): back.set(x, y, 'C')
        for (a, b) in bones[1:]:
            for (x, y) in thin(a, b):
                if back.get(x, y) in 'Ff': back.set(x, y, 'c')
        back.set(wr[0], wr[1] - 1, 'Z')
    # 몸 · 늘어뜨린 다리 · 꼬리
    tp = [(cx, 27.0), (cx + 1.2, 32.0), (cx + 3.0, 35.4)]
    back.fill(path(tp, 1.6, 0.6), 'C')
    if S.get('tailtip'): S['tailtip'](back, tp)
    for sx in (-1, 1):
        back.fill(ell(cx + sx * 3.8, 27.0 - br, 2.3, 2.5), 'C')
        back.fill(path([(cx + sx * 4.0, 28.4 - br), (cx + sx * 4.4, 32.0 - br)], 1.0, 0.8), 'C')
        for dx in (-1, 0, 1): back.set(cx + sx * 4.4 + dx, 33.0 - br, 'Z')
    back.fill(ell(cx, 23.8 - br, 5.6, 4.8), 'C')
    blunt(back.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    for (x, y) in ell(cx, 23.8 - br, 5.6, 4.8):
        if y >= 25.6 - br and back.get(x, y) in 'CQc' and abs(x - cx) < 3.4: back.set(x, y, 'A' if y % 2 == 0 else 'a')
    for sx in (-1, 1):   # 안장 천
        cl = poly([(cx + sx * 6.0, 20.6 - br), (cx + sx * 3.4, 20.0 - br), (cx + sx * 3.4, 25.4 - br), (cx + sx * 6.2, 25.8 - br)])
        for (x, y) in cl:
            if back.get(x, y) in 'CQcAa': back.set(x, y, 'R')
        for (x, y) in cl:
            if (x, y + 1) not in cl and back.get(x, y) == 'R': back.set(x, y, 'G' if opt != 'C' else 'Z')
    back.fill(poly([(cx - 3.6, 19.4 - br), (cx + 3.6, 19.4 - br), (cx + 3.8, 21.2 - br), (cx - 3.8, 21.2 - br)]), 'W')
    # ── 앞 겹: 목 토막 + 정면 머리(가슴 앞에 숙임)
    t = HEAD_Y[opt]; tw = len(t.strip('\n').split('\n')[0]); th = len(t.strip('\n').split('\n'))
    hy0 = 25 - br
    for y in range(int(22 - br), hy0 + 2):
        for x in range(cx - 1, cx + 1): fr_.set(x, y, 'C')
    fr_.set(cx - 2, 23 - br, 'c'); fr_.set(cx + 1, 23 - br, 'c')
    stamp(fr_, t, cx - tw // 2, hy0)
    if opt == 'C': fr_.set(cx - 1, 21 - br, 'Z'); fr_.set(cx - 1, 20 - br, 'z')
    return back, fr_, (cx, 20.2 - br)


HEAD_S = """
J..........J
JJ.Z....Z.JJ
.JJZC..CZJJ.
.JCCQQQQCCJ.
JCeKCCCCKeCJ
.JCCCCCCCCJ.
..CCAAAACC..
..CCKAAKCC..
...CAAAAC...
....cccc....
"""


def serp_front(fr):
    back, fr_ = Cv(W + 10, H), Cv(W + 10, H); br = 1 if fr == 'front1' else 0
    cx = CX + 5
    for sx in (-1, 1):   # 지느러미 날개
        sh = (cx + sx * 4.0, 20.6 - br); wr = (cx + sx * 8.6, 14.2 - br - (1 if fr == 'front1' else 0))
        tips = [(cx + sx * 13.0, 13.4), (cx + sx * 13.6, 17.4), (cx + sx * 10.6, 20.6)]
        m, bones = wing(sh, wr, tips, (cx + sx * 6.0, 22.2 - br), 1.0)
        for (x, y) in m: back.set(x, y, 'F')
        for (a, b) in bones:
            for (x, y) in thin(a, b): back.set(x, y, 'j')
    ring = ell(cx, 24.0 - br, 9.0, 3.6) - ell(cx, 23.2 - br, 5.4, 1.6)   # 앞에서 본 똬리 고리
    for (x, y) in ring: back.set(x, y, 'C')
    back.fill(path([(cx + 7.6, 25.6), (cx + 9.2, 30.0), (cx + 8.0, 34.0)], 2.0, 0.8), 'C')
    blunt(back.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    for (x, y) in ring:
        if y >= 25.2 - br and back.get(x, y) in 'CQc': back.set(x, y, 'A')
    for (x, y) in poly([(cx + 8.0, 34.2), (cx + 6.0, 36.6), (cx + 9.6, 37.0)]): back.set(x, y, 'D')
    for k in (-3, -2, 2, 3): back.set(cx + k * 2.4, 19.8 - br, 'D')
    back.fill(poly([(cx - 3.4, 19.6 - br), (cx + 3.4, 19.6 - br), (cx + 3.6, 21.4 - br), (cx - 3.6, 21.4 - br)]), 'W')
    for sx in (-1, 1):
        for (x, y) in poly([(cx + sx * 5.6, 20.8 - br), (cx + sx * 3.4, 20.2 - br), (cx + sx * 3.4, 24.8 - br), (cx + sx * 5.8, 25.2 - br)]): back.set(x, y, 'R')
    hy0 = 25 - br
    for y in range(int(22 - br), hy0 + 2):
        for x in range(cx - 1, cx + 1): fr_.set(x, y, 'C')
    stamp(fr_, HEAD_S, cx - 6, hy0)
    return back, fr_, (cx, 20.2 - br)


def emit(fn, pal, label, ax, rider):
    b0, f0, s0 = fn('front0'); b1, f1, s1 = fn('front1')
    o, top = frames([b0, b1, f0, f1])
    return {'frames': {'front0': o[0], 'front1': o[1], 'front0_f': o[2], 'front1_f': o[3]}, 'pal': pal, 'ax': ax,
            'seat': {'front0': [round(s0[0]), round(s0[1]) - top], 'front1': [round(s1[0]), round(s1[1]) - top], 'front0_f': [0, 0], 'front1_f': [0, 0]},
            'label': label, 'rider': rider}


OUT = {}
for k, pal, lab, r in (('A', WO.PAL_A, 'A 은빛 늑대', 'rA'), ('B', WO.PAL_B, 'B 검은 다이어울프', 'rB'), ('C', WO.PAL_C, 'C 갈색 늑대', 'rC'), ('D', WO.PAL_D, 'D 갑주 늑대', 'rD')):
    OUT['frontW' + k] = emit(lambda f, k=k: wolf_front(k, f), pal, lab, CX, r)
for k, pal, lab, r in (('A', WY.PAL_A, 'A 올리브 뿔 와이번', 'wA'), ('B', WY.PAL_B, 'B 황금 와이번', 'wB'), ('C', WY.PAL_C, 'C 먹빛 와이번', 'wC')):
    OUT['frontY' + k] = emit(lambda f, k=k: wyv_front(k, f), pal, lab, CX + 5, r)
OUT['frontYD'] = emit(serp_front, WY.PAL_D, 'D 푸른 하늘뱀 용', CX + 5, 'wD')

if __name__ == '__main__':
    json.dump(OUT, open('../t/front.json', 'w'), ensure_ascii=False, indent=1)
    print(list(OUT))
