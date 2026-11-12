"""방어구 시안 32개 (갑옷 · 로브 · 후드 · 망토 × 8) — 틀은 bases.py, 그림판은 ad.py.
참고: 사용자가 ChatGPT와 만든 그림(11-12 08:56 · 09:06, 저장소에 안 넣음)의 네 갈래 · 색 배치. 십자 문장은 해 · 초승달 · 왕관 · 날개 · 불꽃 · 잎 · 보석으로 바꿨다."""
import ad
import bases as B

K = ('#2a1c24', '#140c10')
# 테
GOLD = ('#fff0b0', '#e8b840', '#94601a')
SILV = ('#ffffff', '#c8d0dc', '#6a7288')
REDT = ('#ffa080', '#d8362a', '#701414')
VIOT = ('#f0dcff', '#b48ae8', '#5a3a98')
LEAFT = ('#f0ffb0', '#b8d850', '#5a7a1a')
# 쇠 (반짝 · 빛 · 가운데 · 그늘)
M_SIL = ('#ffffff', '#e2e8f0', '#a4b0c2', '#56627c')
M_BLU = ('#c8dcff', '#6a90e8', '#3456b0', '#1a2866')
M_BLK = ('#8a8494', '#5a5464', '#3a3440', '#1e1a24')
M_WHT = ('#ffffff', '#f6f4f0', '#cfcbc4', '#8a8478')
M_GRN = ('#d0f0b0', '#6ab048', '#3a7a2a', '#1a4018')
M_PUR = ('#e8d4ff', '#9a6ae0', '#6a3ab0', '#341a66')
M_IRN = ('#b8bcc8', '#6a7080', '#444a58', '#22262e')
M_GLD = ('#fff6c8', '#f4cc58', '#c88e2a', '#6a4410')
# 천 (빛 · 가운데 · 그늘) — 쇠 칸(1 a b c)에 쓸 때는 앞에 반짝 색을 붙인다
C_BLU = ('#8ab0f8', '#3a5ab8', '#1a2866')
C_NAV = ('#5a6ab0', '#22306a', '#10163a')
C_WHT = ('#ffffff', '#e4e8f0', '#9aa4b8')
C_RED = ('#f07a6a', '#b02a2a', '#5a1010')
C_BLK = ('#5a5464', '#2e2834', '#16121a')
C_GRN = ('#8ad070', '#3a8a3a', '#1a4a1a')
C_DGN = ('#5a9a4a', '#2a5a2a', '#122a12')
C_PUR = ('#b48ae8', '#6a3ab0', '#341a66')
C_DPU = ('#7a5aa8', '#3e2466', '#1c0e34')
C_SKY = ('#d8f0ff', '#8ac4f4', '#3a6ab0')
C_LAV = ('#f0e8ff', '#bca8ec', '#6a5aa8')
C_CRM = ('#fffaf0', '#efe4cc', '#a8987a')
C_SLT = ('#7a7a94', '#45455a', '#22222e')
C_GLD = ('#fff0b0', '#e8b840', '#94601a')
# 보석
J_BLU = ('#d8f4ff', '#4aa0f0', '#1a3a8a')
J_RED = ('#ffc8b0', '#e83a2a', '#701010')
J_GRN = ('#d8ffc0', '#4ac050', '#1a6020')
J_PUR = ('#f0d0ff', '#a060e8', '#4a1a8a')
J_PRL = ('#ffffff', '#d8e0f0', '#8a94b0')
J_SKY = ('#ffffff', '#a8e4ff', '#3a8ad0')
F_WHT = ('#ffffff', '#ece8e0', '#a8a094')
F_CRM = ('#fffaf0', '#f0e2c0', '#b09868')


def M4(c3, sp=None):
    """천 색 셋 → 쇠 칸 넷 (반짝 = 빛보다 더 밝게)"""
    return (sp or ad.mix(c3[0], '#ffffff', 0.55),) + tuple(c3)


# ── 덧그림 (온 좌표, 20칸) ──
def em_gem(y=5):      # 금 테 보석 (마름모)
    return ad.grid([".gh.", "gvwh", "hwxi", ".hi."], 8, y)


def em_sun(y=5):      # 해 원반 (금) · 가운데 보석
    return ad.grid([".gh.", "gvhh", "hhhi", ".hi."], 8, y)


def em_wing(y=5):     # 날개 V (금) · 아래 보석
    return ad.grid(["g....h", ".g..h.", "..vw.."], 7, y)


def em_crown(y=5):    # 왕관 (봉우리 셋)
    return ad.grid(["g.gh.h", "gghhhh", "hvhhwi"], 7, y)


def em_moon(y=5):     # 초승달 (오른쪽이 트인 굵은 C) — 비추지 않는다
    return ad.grid([".ss.", "st..", "tt..", ".tu."], 8, y)


def em_crown_x(y=5):  # 왕관 (무늬 색 — 금 갑옷 위)
    return ad.grid(["s.st.t", "sstttt", "tvttwu"], 7, y)


def em_flame(y=5):    # 불꽃
    return ad.grid(["..s.", ".st.", "sttu", ".tu."], 8, y)


def em_leaf(y=5):     # 잎 (오른쪽 위로)
    return ad.grid(["..st", ".stt", "stt.", "u..."], 8, y)


def buckle(y, ch=('g', 'h')):
    return {(9, y): ch[0], (10, y): ch[1]}


def clasp(y):         # 후드 · 망토 여밈 (금 테 보석)
    return ad.grid([".gh.", "gvwh", ".hi."], 8, y)


def clasp4(y):
    return ad.grid([".gh.", "gvwh", "hwxi", ".hi."], 8, y)


def dots(pts, ch='g'):  # 수 장식 점 (왼쪽 좌표만 — 오른쪽은 비춘다)
    out = {}
    for x, y in pts: out[(x, y)] = ch; out[(19 - x, y)] = 'h' if ch == 'g' else ch
    return out


D = []


def add(cat, name, base, extra=(), **pal):
    D.append(dict(cat=cat, name=name, base=base, extra=list(extra), pal=pal))


# ───────── 갑옷 (기사 · 성기사 · 암흑기사 · 마검사 계열) ─────────
add('P', '은빛 기사 갑옷', B.P1, [em_gem(), buckle(10)], M=M_SIL, T=GOLD, S=C_BLU, J=J_BLU)
add('P', '푸른 강철 갑옷', B.P1, [em_wing(), buckle(10)], M=M_BLU, T=GOLD, S=C_WHT, J=J_SKY)
add('P', '흑적 마갑', B.P2, [em_gem(), buckle(10, ('v', 'w'))], M=M_BLK, T=REDT, S=C_RED, J=J_RED)
add('P', '백금 성갑', B.P1, [em_sun(), buckle(10)], M=M_WHT, T=GOLD, S=C_SKY, J=J_SKY)
add('P', '숲 수호 갑옷', B.P3, [em_leaf(), buckle(10)], M=M_GRN, T=SILV, S=C_DGN, X=('#f0ffd0', '#c8e870', '#6a8a2a'))
add('P', '자수정 갑옷', B.P3, [em_gem(), buckle(10)], M=M_PUR, T=SILV, S=C_DPU, J=J_PUR)
add('P', '흑철 갑옷', B.P2, [em_moon(), buckle(10)], M=M_IRN, T=SILV, S=C_BLK, X=('#ffffff', '#d8e0f0', '#8a94b0'))
add('P', '황금 왕갑', B.P1, [em_crown_x(), buckle(10, ('v', 'w'))], M=M_GLD, T=('#ffffff', '#f0ece4', '#a8a090'), S=C_RED, J=J_RED, X=('#ffffff', '#f0ece4', '#a8a090'))
# ───────── 로브 (마법사 · 대마법사 · 사제 · 흑마법사 계열) ─────────
add('R', '청백 마도 로브', B.R1, [ad.grid(["vw"], 9, 4), buckle(9, ('v', 'w')), dots([(4, 16)])],
    M=M4(C_BLU), A=C_WHT, S=C_WHT, L=C_BLU, T=GOLD, J=J_BLU)
add('R', '남빛 금수 로브', B.R1, [ad.grid(["vw"], 9, 4), buckle(9, ('v', 'w')), dots([(4, 16), (3, 13)])],
    M=M4(C_NAV), A=C_NAV, S=C_NAV, L=C_GLD, T=GOLD, J=J_SKY)
add('R', '홍백 사제 로브', B.R2, [buckle(10, ('v', 'w')), ad.grid(["vw"], 9, 5)],
    M=M4(C_WHT), A=C_WHT, S=C_RED, L=C_RED, T=GOLD, J=J_RED)
add('R', '자흑 비전 로브', B.R2, [buckle(10, ('v', 'w')), ad.grid(["vw"], 9, 5)],
    M=M4(C_DPU), A=C_DPU, S=C_BLK, L=C_PUR, T=VIOT, J=J_PUR)
add('R', '하늘빛 로브', B.R1, [ad.grid(["vw"], 9, 4), buckle(9, ('v', 'w')), dots([(4, 16)])],
    M=M4(C_SKY), A=C_WHT, S=C_WHT, L=C_SKY, T=GOLD, J=J_BLU)
add('R', '흑적 주술 로브', B.R2, [buckle(10, ('v', 'w')), ad.grid(["vw"], 9, 5)],
    M=M4(C_BLK), A=C_BLK, S=C_DPU, L=C_RED, T=REDT, J=J_RED)
add('R', '청은 로브', B.R1, [ad.grid(["vw"], 9, 4), buckle(9, ('v', 'w')), dots([(4, 16)], 's')],
    M=M4(C_BLU), A=C_BLU, S=C_WHT, L=C_WHT, T=SILV, J=J_SKY, X=('#ffffff', '#c8d0dc', '#6a7288'))
add('R', '연보라 로브', B.R2, [buckle(10, ('v', 'w')), ad.grid(["vw"], 9, 5)],
    M=M4(C_LAV), A=C_LAV, S=C_WHT, L=C_PUR, T=SILV, J=J_PUR)
# ───────── 후드 (암살자 · 도적 · 레인저 · 그림자 추적자 계열) ─────────
add('H', '백청 후드', B.H1, [clasp(10)], M=M4(C_WHT), L=C_BLU, T=GOLD, J=J_BLU)
add('H', '흑적 후드', B.H2, [clasp(10)], M=M4(C_BLK), L=C_RED, T=REDT, J=J_RED)
add('H', '설백 후드', B.H1, [clasp(10)], M=M4(C_WHT), L=C_SKY, T=SILV, J=J_SKY)
add('H', '자줏빛 후드', B.H1, [clasp(10)], M=M4(C_PUR), L=C_DPU, T=GOLD, J=J_RED)
add('H', '숲 사냥꾼 후드', B.H2, [clasp(10)], M=M4(C_DGN), L=C_BLK, T=LEAFT, J=J_GRN)
add('H', '상아 후드', B.H1, [clasp(10)], M=M4(C_CRM), L=C_GLD, T=GOLD, J=J_BLU)
add('H', '진홍 후드', B.H1, [clasp(10)], M=M4(C_RED), L=C_BLK, T=GOLD, J=J_PRL)
add('H', '그림자 후드', B.H2, [clasp(10)], M=M4(C_SLT), L=C_DPU, T=VIOT, J=J_PUR)
# ───────── 망토 (왕실 · 신성 · 자연 · 심연 계열) ─────────
add('C', '왕실 청 망토', B.C1, [clasp4(3), dots([(3, 16)])], M=M4(C_BLU), F=F_WHT, L=('#4a6ac8', '#2a3e98', '#16205a'), T=GOLD, J=J_BLU)
add('C', '왕실 홍 망토', B.C1, [clasp4(3), dots([(3, 16)])], M=M4(C_RED), F=F_WHT, L=('#c04a44', '#8a2222', '#4a0e0e'), T=GOLD, J=J_RED)
add('C', '흑철 망토', B.C2, [em_moon(3)], M=M4(C_BLK), L=('#5a5a70', '#34344a', '#1c1c28'), T=('#d8dce8', '#8a90a0', '#4a4e5a'), X=('#ffffff', '#e8eef8', '#9aa4b8'))
add('C', '설백 망토', B.C1, [clasp4(3), dots([(3, 16)], 's')], M=M4(C_WHT), F=F_WHT, L=C_SKY, T=SILV, J=J_SKY, X=('#ffffff', '#8ac4f4', '#3a6ab0'))
add('C', '자줏빛 망토', B.C2, [clasp(3), dots([(3, 16)])], M=M4(C_PUR), L=C_DPU, T=GOLD, J=J_PUR)
add('C', '숲 망토', B.C2, [em_leaf(2), dots([(3, 16)], 's')], M=M4(C_GRN), L=C_DGN, T=GOLD, X=('#f0ffd0', '#c8e870', '#6a8a2a'))
add('C', '흑적 망토', B.C2, [clasp(3), dots([(3, 16)], 'v')], M=M4(C_BLK), L=('#9a3030', '#5e1616', '#300808'), T=REDT, J=J_RED)
add('C', '백금 망토', B.C1, [clasp4(3), dots([(3, 16)])], M=M4(C_WHT), F=F_CRM, L=C_CRM, T=GOLD, J=J_BLU)

CATS = {'P': '갑옷', 'R': '로브', 'H': '후드', 'C': '망토'}


def img(d):
    body = ad.mirror(d['base'])
    for e in d['extra']: ad.put(body, e)
    p = dict(K=K); p.update(d['pal'])
    for f in ('A', 'S', 'L', 'F', 'X', 'J', 'T'):   # 덜 준 부위는 쇠 · 테 색을 빌린다
        if f not in p: p[f] = p['M'][1:] if f in 'ASLF' else (p.get('T') or GOLD)
    return ad.render(body, ad.pal(**p))
