"""(옛 2판, 사용자가 "더 얇고 가늘게, 깃은 더 길게" 해서 3판으로 바뀜) 새 화살 (사용자: "화살이 너무 이상하게 생겼어").
뾰족한 쇠 화살촉(밝은 쪽 · 어두운 쪽) + 곧은 자루(대각선은 2칸 굵기) + 흰 끝 붉은 깃털.
arrow(방향, 촉끝 x, 촉끝 y, 자루 길이) → {(x,y): 글자}. 방향: r l u d ur ul dr dl"""
AP = {'w': ('#ffffff', 5), 'm': ('#d4dcea', 5), 'M': ('#7a849a', 5), 't': ('#e8b878', 3), 'T': ('#9a6a34', 3),
      'r': ('#ff5a4a', 13), 'R': ('#a82a22', 13), 'f': ('#fff4ec', 7)}
# 오른쪽 위 45° (촉끝 기준 상대 위치)
_H45 = [(-1, 0, 'm'), (0, 0, 'w'), (-2, 1, 'm'), (-1, 1, 'w'), (0, 1, 'M'), (-4, 2, 'm'), (-3, 2, 'm'), (-2, 2, 'm'), (-1, 2, 'M'), (0, 2, 'M'),
        (-4, 3, 'm'), (-3, 3, 't'), (-2, 3, 'T'), (-1, 3, 'M'), (-5, 4, 't'), (-4, 4, 'T'), (-3, 4, 'M'), (-2, 4, 'M'), (-6, 5, 't'), (-5, 5, 'T'), (-3, 5, 'M')]
_T45 = [(-1, -1, 'r'), (-1, 0, 'r'), (-2, 1, 'f'), (-1, 1, 'R'), (0, 1, 'T'), (-1, 2, 'r'), (0, 2, 'R'), (0, 3, 'r'), (1, 3, 'f')]
def _ur(L):
    out = list(_H45); K = 5 + L
    for k in range(6, K + 1): out += [(-k - 1, k, 't'), (-k, k, 'T')]
    bx, by = -(K + 1), K
    out += [(bx + dx, by + dy, c) for dx, dy, c in _T45]
    return out
# 오른쪽 (가로)
_HR = [(-3, -2, 'm'), (-3, -1, 'm'), (-2, -1, 'm'), (-4, 0, 'm'), (-3, 0, 'm'), (-2, 0, 'm'), (-1, 0, 'M'), (0, 0, 'w'), (-3, 1, 'M'), (-2, 1, 'M'), (-3, 2, 'M')]
_TR = [(-4, -2, 'f'), (-3, -2, 'r'), (-2, -2, 'r'), (-3, -1, 'f'), (-2, -1, 'r'), (-1, -1, 'r'), (-2, 0, 'R'), (-1, 0, 'R'),
       (-3, 1, 'f'), (-2, 1, 'r'), (-1, 1, 'r'), (-4, 2, 'f'), (-3, 2, 'r'), (-2, 2, 'r')]
def _r(L):
    out = list(_HR)
    for i in range(L): out.append((-5 - i, 0, 't'))
    sx = -4 - L
    out += [(sx + dx, dy, c) for dx, dy, c in _TR]
    return out
SW = {'m': 'M', 'M': 'm', 't': 'T', 'T': 't'}
def arrow(d, tx, ty, L=6):
    if d in ('r', 'l', 'u', 'd'):
        base = _r(L)
        if d == 'r': pts = base
        elif d == 'l': pts = [(-dx, dy, c) for dx, dy, c in base]
        elif d == 'd': pts = [(-dy, dx, SW.get(c, c) if c in 'mM' else c) for dx, dy, c in base]
        else: pts = [(dy, -dx, c) for dx, dy, c in base]
    else:
        base = _ur(L)
        if d == 'ur': pts = base
        elif d == 'ul': pts = [(-dx, dy, c) for dx, dy, c in base]
        elif d == 'dl': pts = [(-dx, -dy, SW.get(c, c)) for dx, dy, c in base]
        else: pts = [(dx, -dy, SW.get(c, c)) for dx, dy, c in base]
    return {(tx + dx, ty + dy): c for dx, dy, c in pts}
def recol(cm, m): return {k: m.get(v, v) for k, v in cm.items()}
# 자주 쓰는 색 바꾸기
GREEN_HEAD = {'w': 'g', 'm': 'g', 'M': 'G'}
GOLD_ALL = {'w': 'h', 'm': 'y', 'M': 'Y', 't': 'y', 'T': 'Y', 'r': 'h', 'R': 'y', 'f': 'w'}
GOLDP = {'h': ('#fff6c8', 6), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'w': ('#ffffff', 7)}
# 작은 화살 (여러 발 그릴 때)
_H45S = [(-1, 0, 'm'), (0, 0, 'w'), (-2, 1, 'm'), (-1, 1, 'w'), (0, 1, 'M'), (-3, 2, 't'), (-2, 2, 'T'), (-1, 2, 'M'), (0, 2, 'M')]
_T45S = [(-1, 0, 'r'), (-1, 1, 'f'), (0, 1, 'R'), (1, 2, 'f'), (0, 2, 'r')]
def _urs(L):
    out = list(_H45S); K = 2 + L
    for k in range(3, K + 1): out += [(-k - 1, k, 't'), (-k, k, 'T')]
    bx, by = -(K + 1), K
    out += [(bx + dx, by + dy, c) for dx, dy, c in _T45S]
    return out
_HRS = [(0, 0, 'w'), (-1, 0, 'm'), (-1, -1, 'm'), (-1, 1, 'M'), (-2, 0, 'M')]
_TRS = [(-1, -1, 'r'), (-2, -1, 'f'), (-1, 1, 'r'), (-2, 1, 'f'), (-1, 0, 'R')]
def _rs(L):
    out = list(_HRS)
    for i in range(L): out.append((-3 - i, 0, 't'))
    sx = -2 - L
    out += [(sx + dx, dy, c) for dx, dy, c in _TRS]
    return out
def arrow_s(d, tx, ty, L=3):
    if d in ('r', 'l', 'u', 'd'):
        base = _rs(L)
        if d == 'r': pts = base
        elif d == 'l': pts = [(-dx, dy, c) for dx, dy, c in base]
        elif d == 'd': pts = [(-dy, dx, SW.get(c, c) if c in 'mM' else c) for dx, dy, c in base]
        else: pts = [(dy, -dx, c) for dx, dy, c in base]
    else:
        base = _urs(L)
        if d == 'ur': pts = base
        elif d == 'ul': pts = [(-dx, dy, c) for dx, dy, c in base]
        elif d == 'dl': pts = [(-dx, -dy, SW.get(c, c)) for dx, dy, c in base]
        else: pts = [(dx, -dy, SW.get(c, c)) for dx, dy, c in base]
    return {(tx + dx, ty + dy): c for dx, dy, c in pts}
def ar(a, d, tx, ty, L=4, m=None, pal=None, glow_c=None, small=False):
    """화살 놓기 (테두리 + B4 손질)"""
    from lib import sp, grid
    cm = (arrow_s if small else arrow)(d, tx, ty, L)
    if m: cm = recol(cm, m)
    pp = dict(AP); pp.update(pal or {})
    sp(a, grid(cm), pp, glow_c=glow_c)
