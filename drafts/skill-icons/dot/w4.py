"""전사 기본 스킬 다섯 — 뭉툭 도트 시안. 칸 좌표: x 0..15, y 0..19 (육각 틀 안쪽)."""
import math
import cell
from cell import Art, radial, mix, rows_of, dsword, crescent2
def crescent(cx, cy, R, a0, a1, tmax, fade=0.8, t0=0.0):
    """각도로 가늘어지는 휘두른 자국: a0(두꺼움) → a1(가늚). {(x,y): (바깥에서 깊이 칸, s)}"""
    out = {}
    for y in range(cell.H):
        for x in range(cell.W):
            px, py = x + 0.5, y + 0.5; r = math.hypot(px - cx, py - cy)
            th = math.degrees(math.atan2(py - cy, px - cx)); span = a1 - a0
            s = ((th - a0) % 360) / span if span > 0 else ((a0 - th) % 360) / -span
            if not 0 <= s <= 1: continue
            t = t0 + (tmax - t0) * (1 - s) ** fade
            if R - t <= r <= R:
                out[(x, y)] = (R - r, t - (R - r))
    return out
def slash(a, cm, cols=('#ffffff', '#fff0a0', '#ffb040', '#f07a20')):
    for (x, y), (fo, fi) in cm.items():
        k = 0 if fo < 0.9 else 1 if fo < 1.8 else 2 if fo < 2.6 else 3
        if fi < 0.6 and k < 2: k = max(k, 1)
        a.set(x, y, cols[k])
def pips(a, n):
    """이름에 숫자만 다른 스킬: 꼭대기에 흰 점 (2×2칸, 검은 테두리)"""
    xs = [7] if n == 1 else [5, 9] if n == 2 else [4, 7, 10]
    for x in xs:
        for dx in (-1, 0, 1, 2):
            for dy in (-1, 0, 1, 2):
                if (dx in (-1, 2)) and (dy in (-1, 2)): continue
                a.set(x + dx, 1 + dy, '#ffffff' if dx in (0, 1) and dy in (0, 1) else cell.OUT)
def flash(a, x, y, big=False):
    P = {'h': '#fff4c0', 'w': '#ffffff', 'y': '#ffd860'}
    if big: a.paint(['..y..', '..h..', 'yhwhy', '..h..', '..y..'], P, ox=x - 2, oy=y - 2)
    else: a.paint(['.h.', 'hwh', '.h.'], P, ox=x - 1, oy=y - 1)
DARKFIRE = ['#1a0304', '#3a0806', '#621208', '#8e1e0c', '#b8300e', '#e05a18']
def rays_bg(ramp, cx, cy, R, cuts, n, dark, rot=0.0, w=0.5):
    """빛살 배경: 둥근 빛 + n갈래 어두운 살 (참고 그림의 붉은·검은 살)"""
    base = radial(ramp, cx, cy, R, cuts)
    def fn(x, y):
        th = math.atan2(y - cy, x - cx) + rot; s = (th * n / (2 * math.pi)) % 1
        d = math.hypot(x - cx, y - cy)
        if s < w and d > 2.2: return mix(base(x, y), dark, 0.55)
        return base(x, y)
    return fn
# 칼 (손그림): 칼끝 왼쪽 아래 / 오른쪽 위
HILT = {'g': ('#ffe060', 1), 'G': ('#d09a20', 1), 'h': ('#fff6c8', 1), 'r': ('#8a2010', 1), 'R': ('#5a140a', 1)}
SWORD_DL = ['................',
            '................',
            '................',
            '................',
            '............hg..',
            '............gG..',
            '.......hg..r....',
            '........ggR.....',
            '.........gg.....',
            '.......wmMgg....',
            '......wmM..gG...',
            '.....wmM........',
            '....wmM.........',
            '...wmM..........',
            '...mM...........',
            '..m.............']
SWORD_UR = ['................',
            '................',
            '................',
            '.............w..',
            '............mM..',
            '...........wmM..',
            '..........wmM...',
            '.........wmM....',
            '........wmM.....',
            '....hg.wmM......',
            '.....ggmM.......',
            '......gg........',
            '.....Rggg.......',
            '....r...gG......',
            '..hg............',
            '..gG............']
# 1. 강타: 큰 초승달 베기 + 칼 + 칼끝 번쩍
def bash():
    a = Art().bg(radial(DARKFIRE, 9.0, 11.0, 12.5, [0.0, 0.18, 0.36, 0.56, 0.78]))
    slash(a, crescent2((8.5, 10.0), 7.6, (10.2, 11.4), 7.2))
    a.sym(SWORD_DL, HILT)
    flash(a, 2, 15)
    return a, 0
# 2. 도발: 뿔 투구 + 붉게 빛나는 눈 + 붉은·검은 빛살 + 고함 물결
BLOOD = ['#1a0204', '#3a0606', '#640c0a', '#921a10', '#c43418', '#f06a30']
HELM = ['................',
        '................',
        '................',
        '..e..........e..',
        '..e..........e..',
        '..ee..mmmm..ee..',
        '...ee.mmmm.ee...',
        '...emmmmmmmmE...',
        '....nnnnnnnn....',
        '....m12mm12m....',
        '....m33mm33m....',
        '....mkkmmkkm....',
        '....mkkmmkkM....',
        '.....mkmmkM.....',
        '.....mm..MM.....']
def taunt():
    a = Art().bg(rays_bg(BLOOD, 7.5, 10.0, 11, [0.0, 0.2, 0.42, 0.64, 0.86], 10, '#0e0204', rot=0.31))
    for (x, y) in [(1, 9), (0, 10), (0, 11), (1, 12), (14, 9), (15, 10), (15, 11), (14, 12)]: a.set(x, y, '#ffe0b0')
    a.sym(HELM, {'1': ('#fff0b0', 1), '2': ('#ff4a1a', 1), '3': ('#c81a0a', 1)})
    pips(a, 1)
    return a, 1
# 3. 철벽: 쇠 방패 + 금빛 성 무늬 + 푸른 결계 빛 + 튕기는 불꽃
SKY = ['#060c2a', '#0e1e5a', '#18388e', '#2a62c4', '#4a94ec', '#9ad4ff']
SHIELD = ['................',
          '................',
          '................',
          '................',
          '....yyyyyyyy....',
          '....ywmmmmmY....',
          '....ym1.1.1Y....',
          '....ym11111Y....',
          '....ym11.11Y....',
          '....ym11.11Y....',
          '....ymmmmmMY....',
          '.....ymmmMY.....',
          '......ymMY......',
          '.......yY.......']
def ironwall():
    a = Art().bg(rays_bg(SKY, 7.5, 9.0, 11, [0.0, 0.2, 0.42, 0.64, 0.86], 8, '#0a1a4a', rot=0.2, w=0.4))
    a.sym(SHIELD, {'1': ('#ffd84a', 6)}, glow='#c8f0ff')
    flash(a, 13, 4); flash(a, 2, 13)
    return a, 0
# 4. 휩쓸기: 왼쪽에서 아래로 돌아 오른쪽 위까지 크게 휘감은 자국(U) + 끝에 칼 + 여러 번 맞은 번쩍임
AMBER = ['#1e0a02', '#4a1c04', '#7a3206', '#a8500c', '#d07818', '#f0a030']
def sweep():
    a = Art().bg(radial(AMBER, 7.5, 10.0, 12, [0.0, 0.2, 0.42, 0.64, 0.86]))
    slash(a, crescent(7.4, 8.8, 6.9, -38, 178, 3.0, fade=0.85))
    a.sym(SWORD_UR, HILT)
    flash(a, 3, 13); flash(a, 9, 15)
    return a, 0
# 5. 광폭화: 빛나는 몸이 두 팔을 치켜든 자세 + 붉은·검은 빛살
BODY = ['................',
        '................',
        '................',
        '......h..h......',
        '.oo...hhhh...oo.',
        '.oo...oooo...oo.',
        '.oo...owwo...oo.',
        '.oo...oRRo...oo.',
        '.ooo...oo...ooo.',
        '..oooooooooooo..',
        '...oooooooooo...',
        '....oooooooo....',
        '.....oooooo.....',
        '......oooo......',
        '.....oooooo.....',
        '....ooo..ooo....',
        '....oo....oo....',
        '....oo....oo....']
def berserk():
    a = Art().bg(rays_bg(BLOOD, 7.5, 10.0, 11, [0.0, 0.2, 0.42, 0.64, 0.86], 12, '#0e0204', rot=0.1))
    a.sym(BODY, {'o': ('#ff9a2a', 14), 'h': ('#c0300e', 13), 'w': ('#ffffff', 1), 'R': ('#5a0a04', 1)})
    return a, 0
ICONS = {'bash': ('강타', 'dmg', bash), 'taunt': ('도발 1', 'taunt', taunt), 'ironwall': ('철벽', 'buff', ironwall),
         'sweep': ('휩쓸기', 'dmg', sweep), 'berserk': ('광폭화', 'buff', berserk)}
