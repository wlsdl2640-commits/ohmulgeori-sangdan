"""빌드 78 스킬북 그림 시안 (11-27 대표님 — 1차 기본 계열마다 책 생김새를 다르게, 2 · 3 · 4차도 그 계열 모습). 20×20 도트.
계열 여섯 + 공용 × A · B. 레어도는 칸 테가 보여 주고, 책은 계열 모습만 (차수는 모서리 쇠 색으로 고를 수 있게 따로 한 줄)."""
import math, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'bookart63'))
from books import Cv, hx, mix, lt, dk, K, W, H

PG, PG2 = (226, 210, 172), (190, 170, 128)
IRON, IRON2 = (168, 172, 182), (104, 108, 122)
GOLD, GOLD2 = (238, 190, 74), (168, 118, 36)
TRIM = [((176, 112, 66), (116, 68, 36)), ((196, 200, 210), (120, 124, 138)), (GOLD, GOLD2), ((226, 236, 240), (150, 176, 190))]   # 1차 구리 · 2차 은 · 3차 금 · 4차 백금


def book(cv, C, x0, y0, x1, y1, d=3, spine=None, spw=2):
    """두께가 보이는 책: 앞표지 x0..x1 · y0..y1(테 포함), 위 · 오른쪽 옆면 d칸. 돌려주는 값 = 앞표지 안쪽 (ax0, ay0, ax1, ay1)"""
    L, Dk = lt(C, .28), dk(C, .3)
    S = spine or dk(C, .38)
    for k in range(1, d + 1):
        y = y0 - k; col = lt(C, .12) if k == 1 else (PG if k < d else Dk)
        for x in range(x0 + k, x1 + k + 1): cv.set(x, y, mix(PG, PG2, .5) if (k not in (1, d) and x % 3 == 0) else col)
        cv.set(x0 + k, y, S)
        x = x1 + k
        for yy in range(y0 - k, y1 - k + 1):
            cv.set(x, yy, dk(C, .22) if k == 1 else ((PG if yy % 2 else PG2) if k < d else dk(C, .5)))
    cv.rect(x0, y0, x1, y1, K)
    cv.rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, C)
    cv.rect(x0 + 1, y0 + 1, x0 + spw, y1 - 1, S)
    cv.rect(x0 + spw + 1, y0 + 1, x1 - 1, y0 + 1, L); cv.rect(x0 + spw + 1, y0 + 1, x0 + spw + 1, y1 - 1, L)
    cv.rect(x1 - 1, y0 + 2, x1 - 1, y1 - 1, Dk); cv.rect(x0 + spw + 1, y1 - 1, x1 - 1, y1 - 1, Dk)
    cv.outline()
    return x0 + spw + 2, y0 + 2, x1 - 2, y1 - 2


def pat(cv, x0, y0, rows, cmap): cv.pat(x0, y0, rows, cmap)


def spark(cv, x, y, c):
    cv.set(x, y, c)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        if (x + dx, y + dy) not in cv.px: cv.set(x + dx, y + dy, dk(c, .18))


# ───────── 전사: 쇠를 덧댄 두꺼운 가죽 책 ─────────
def war_a(tr=0):
    cv = Cv(); C = (150, 52, 40)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 4, 14, 18, 3)
    m, m2 = TRIM[tr] if tr else (IRON, IRON2)
    for (cx, cy, sx, sy) in ((ax0 - 1, ay0 - 1, 1, 1), (ax1 + 1, ay0 - 1, -1, 1), (ax0 - 1, ay1 + 1, 1, -1), (ax1 + 1, ay1 + 1, -1, -1)):   # 모서리 쇠
        for i in range(3): cv.set(cx + sx * i, cy, m); cv.set(cx, cy + sy * i, m)
        cv.set(cx + sx, cy + sy, m2)
    pat(cv, ax0 + 1, ay0 + 2, ["......b", ".....ba", "....ba.", "a..ba..", ".aba...", ".aa....", "a.a....", "......."],
        {'a': m2, 'b': lt(m, .3)})
    for (x, y) in ((ax0 + 1, ay1 - 1), (ax1 - 1, ay1 - 1)): cv.set(x, y, m)   # 리벳
    return cv


def war_b(tr=0):
    cv = Cv(); C = (128, 70, 44)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 4, 14, 18, 3)
    m, m2 = TRIM[tr] if tr else (IRON, IRON2)
    for y in (ay0 + 1, ay1 - 1):   # 쇠띠 두 줄 + 리벳
        for x in range(ax0 - 2, ax1 + 2): cv.set(x, y, m if x % 3 else m2)
    pat(cv, ax0 + 1, ay0 + 3, [".aaaaa.", ".abbba.", ".abbba.", "..aba..", "...a..."], {'a': m2, 'b': (176, 60, 48)})   # 방패
    return cv


# ───────── 궁수: 끈으로 감은 얇은 야외 수첩 + 깃털 책갈피 ─────────
def arc_a(tr=0):
    cv = Cv(); C = (78, 124, 58)
    ax0, ay0, ax1, ay1 = book(cv, C, 2, 5, 13, 18, 2)
    m = TRIM[tr][0] if tr else (196, 150, 96)
    for x in range(1, 16): cv.set(x, 12, m if x % 2 else dk(m, .2))   # 감은 가죽 끈
    cv.set(15, 13, m); cv.set(16, 14, dk(m, .2))
    # 깃털 책갈피(비스듬히 삐져나옴)
    for (x, y, c) in ((14, 0, (200, 70, 60)), (13, 0, (236, 236, 228)), (13, 1, (236, 236, 228)), (12, 1, (236, 236, 228)),
                      (12, 2, (190, 190, 182)), (11, 2, (236, 236, 228)), (11, 3, (120, 90, 60))):
        cv.set(x, y, c)
    for (x, y) in ((15, 0), (14, 1), (12, 0), (11, 1), (13, 2), (10, 2), (12, 3), (10, 3)):
        if (x, y) not in cv.px: cv.set(x, y, K)
    pat(cv, ax0, ay0 + 1, ["...a.", "..a.b", ".a..b", "a...b", ".a..b", "..a.b", "...a."], {'a': (60, 40, 24), 'b': (226, 220, 200)})   # 활
    return cv


def arc_b(tr=0):
    cv = Cv(); C = (96, 130, 64)
    ax0, ay0, ax1, ay1 = book(cv, C, 2, 5, 13, 18, 2)
    lf, lf2 = (132, 182, 82), (58, 96, 40)
    pat(cv, ax0, ay0, ["...a...", "..aba..", ".abcba.", ".abcba.", "abbcbba", ".abcba.", "..aca..", "...c...", "...c..."],
        {'a': lf2, 'b': lf, 'c': (226, 214, 150)})   # 잎 + 잎맥
    m = TRIM[tr][0] if tr else (170, 120, 70)
    cv.set(14, 9, m); cv.set(15, 9, m); cv.set(16, 10, m); cv.set(16, 11, K); cv.set(17, 10, K)   # 단추 끈
    return cv


# ───────── 마법사: 잠금쇠 · 보석 박힌 마도서 ─────────
def mag_a(tr=0):
    cv = Cv(); C = (92, 56, 150)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 4, 14, 18, 3)
    m, m2 = TRIM[tr] if tr else (GOLD, GOLD2)
    for y in (9, 13):   # 오른쪽 잠금쇠
        for x in range(12, 16): cv.set(x, y, m)
        cv.set(15, y + 1, m2); cv.set(16, y, K); cv.set(16, y + 1, K)
    cx, cy = 8, 11
    for (x, y) in ((cx, cy - 2), (cx - 1, cy - 1), (cx, cy - 1), (cx + 1, cy - 1), (cx - 2, cy), (cx - 1, cy), (cx, cy), (cx + 1, cy), (cx + 2, cy),
                   (cx - 1, cy + 1), (cx, cy + 1), (cx + 1, cy + 1), (cx, cy + 2)):
        cv.set(x, y, (90, 200, 236))
    cv.set(cx - 1, cy - 1, (210, 246, 255)); cv.set(cx, cy, (160, 230, 250))
    for (x, y) in ((cx, cy - 3), (cx - 3, cy), (cx + 3, cy), (cx, cy + 3)): cv.set(x, y, m)
    spark(cv, 4, 6, (230, 214, 255))
    return cv


def mag_b(tr=0):
    cv = Cv(); C = (60, 46, 120)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 4, 14, 18, 3)
    m, m2 = TRIM[tr] if tr else (GOLD, GOLD2)
    cx, cy, r = 8.5, 11.5, 3.6   # 고리 마법진(고리 · 점만)
    for y in range(ay0, ay1 + 1):
        for x in range(ax0, ax1 + 1):
            dd = math.hypot(x + .5 - cx, y + .5 - cy)
            if r - .8 <= dd <= r + .2: cv.set(x, y, (150, 120, 230))
    for (x, y) in ((8, 8), (5, 11), (11, 11), (8, 14)): cv.set(x, y, m)
    cv.set(8, 11, (220, 200, 255)); cv.set(9, 12, (220, 200, 255))
    for x in range(3, 13): cv.set(x, 5, m2)
    return cv


# ───────── 성직자: 흰 경전 · 금 모서리 · 아치 창의 햇살 ─────────
def cle_a(tr=0):
    cv = Cv(); C = (232, 226, 210)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 4, 14, 18, 3, spine=(196, 170, 110))
    m, m2 = TRIM[tr] if tr else (GOLD, GOLD2)
    for (cx, cy, sx, sy) in ((ax0 - 1, ay0 - 1, 1, 1), (ax1 + 1, ay0 - 1, -1, 1), (ax0 - 1, ay1 + 1, 1, -1), (ax1 + 1, ay1 + 1, -1, -1)):
        cv.set(cx, cy, m); cv.set(cx + sx, cy, m2); cv.set(cx, cy + sy, m2)
    pat(cv, ax0 + 1, ay0 + 1, ["..aaa..", ".abbba.", "abcbcba", "abbbbba", "abbcbba", "abcccba", "accccca", "aaaaaaa"],
        {'a': m2, 'b': (120, 170, 220), 'c': (255, 226, 120)})   # 아치 창 안 햇살
    return cv


def cle_b(tr=0):
    cv = Cv(); C = (220, 212, 190)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 4, 14, 18, 3, spine=(176, 150, 96))
    m, m2 = TRIM[tr] if tr else (GOLD, GOLD2)
    for x in range(ax0 - 2, ax1 + 2): cv.set(x, ay0 - 1, m); cv.set(x, ay1 + 1, m)
    cx, cy = 8.5, 11.5
    for y in range(ay0, ay1 + 1):
        for x in range(ax0, ax1 + 1):
            dd = math.hypot(x + .5 - cx, y + .5 - cy); ang = math.atan2(y + .5 - cy, x + .5 - cx)
            if dd <= 1.7: cv.set(x, y, (255, 214, 96))
            elif dd <= 3.7 and (round(ang / (math.pi / 4)) % 2 == 0) and dd > 2.4: cv.set(x, y, m)
    cv.set(8, 11, (255, 246, 200))
    return cv


# ───────── 도적: 비스듬히 놓인 작은 검은 가죽 책 · 잠금 끈 · 표창 ─────────
def rog_a(tr=0):
    cv = Cv(); C = (52, 50, 62)
    ax0, ay0, ax1, ay1 = book(cv, C, 2, 6, 13, 18, 2)
    m = TRIM[tr][0] if tr else (150, 40, 44)
    for y in range(ay0 - 2, ay1 + 2): cv.set(11, y, m)   # 세로 잠금 끈
    cv.set(11, 12, (200, 200, 210)); cv.set(12, 12, K)
    pat(cv, ax0, ay0 + 2, ["...a...", "..aba..", "aab.baa", ".b.c.b.", "aab.baa", "..aba..", "...a..."][0:7],
        {'a': (176, 180, 196), 'b': (110, 114, 130), 'c': K})   # 네 날 표창
    return cv


def rog_b(tr=0):
    cv = Cv(); C = (40, 38, 50)
    ax0, ay0, ax1, ay1 = book(cv, C, 2, 6, 13, 18, 2)
    m = TRIM[tr][0] if tr else (150, 40, 44)
    for i in range(7):   # 대각선 칼자국
        x, y = ax0 + i, ay0 + 1 + i
        cv.set(x, y, (20, 18, 26)); cv.set(x + 1, y, (96, 94, 110))
    pat(cv, ax0, ay1 - 3, ["aaaaaa", "a.aa.a", ".aaaa."], {'a': m})   # 가면
    return cv


# ───────── 짐꾼: 두툼한 장부 · 천 등 테이프 · 가로 끈 · 바퀴 ─────────
def por_a(tr=0):
    cv = Cv(); C = (156, 116, 70)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 5, 13, 18, 4, spw=3, spine=(96, 120, 150))
    m = TRIM[tr][0] if tr else (210, 190, 140)
    for x in range(0, 18): cv.set(x, 15, m if x % 2 else dk(m, .2))   # 가로 끈
    cx, cy = 8.5, 10.5; rim = (226, 196, 130); hub = (88, 58, 32)
    for y in range(ay0, ay1):
        for x in range(ax0, ax1 + 1):
            dd = math.hypot(x + .5 - cx, y + .5 - cy)
            if 2.6 <= dd <= 3.6: cv.set(x, y, rim)
    for (x, y) in ((7, 9), (9, 9), (7, 11), (9, 11)): cv.set(x, y, rim)
    cv.set(8, 10, hub)
    return cv


def por_b(tr=0):
    cv = Cv(); C = (120, 98, 72)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 5, 13, 18, 4, spw=3, spine=(70, 90, 70))
    m = TRIM[tr][0] if tr else (200, 160, 90)
    # 표지에 붙인 꼬리표 쪽지 + 숫자 줄(장부)
    cv.rect(ax0, ay0 + 1, ax1, ay0 + 6, (232, 220, 186))
    for y in (ay0 + 2, ay0 + 4):
        for x in range(ax0 + 1, ax1, 2): cv.set(x, y, (120, 96, 70))
    cv.rect(ax0 + 1, ay1 - 3, ax1 - 1, ay1 - 1, m); cv.set(ax0 + 3, ay1 - 2, dk(m, .4)); cv.set(ax1 - 3, ay1 - 2, dk(m, .4))   # 쇠 걸쇠판
    return cv


# ───────── 공용 ─────────
def com_a(tr=0):
    cv = Cv(); C = (70, 120, 176)
    ax0, ay0, ax1, ay1 = book(cv, C, 1, 4, 14, 18, 3)
    m = TRIM[tr][0] if tr else (236, 220, 160)
    pat(cv, ax0 + 1, ay0 + 3, ["...a...", "..aba..", ".ab.ba.", "ab...ba", ".ab.ba.", "..aba..", "...a..."], {'a': m, 'b': dk(C, .35)})
    return cv


LINES = [('warrior', '전사', '쇠를 덧댄 두꺼운 가죽 책 · 비스듬한 검', '쇠띠 두 줄 · 방패', war_a, war_b),
         ('archer', '궁수', '끈으로 감은 얇은 야외 수첩 · 깃털 책갈피 · 활', '나뭇잎 표지 · 단추 끈', arc_a, arc_b),
         ('mage', '마법사', '금 잠금쇠 · 마나 보석 박힌 마도서', '고리 마법진(고리 · 점만)', mag_a, mag_b),
         ('cleric', '성직자', '흰 경전 · 금 모서리 · 아치 창 햇살', '금 테 · 해 메달', cle_a, cle_b),
         ('rogue', '도적', '작은 검은 가죽 책 · 붉은 잠금 끈 · 네 날 표창', '칼자국 · 가면', rog_a, rog_b),
         ('porter', '짐꾼', '두툼한 장부 · 천 등 테이프 · 가로 끈 · 바퀴', '장부 쪽지 · 쇠 걸쇠판', por_a, por_b),
         ('common', '공용', '푸른 표지 · 마름모', '—', com_a, None)]
