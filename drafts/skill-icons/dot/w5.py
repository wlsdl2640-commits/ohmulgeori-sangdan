"""전사 기본 스킬 다섯 — 뭉툭 도트 시안. 칸 좌표: x 0..15, y 0..19 (육각 틀 안쪽)."""
import math
import cell
from cell import Art, radial, mix, crescent2
def crescent(cx, cy, R, a0, a1, tmax, fade=0.8, t0=0.0):
    """각도로 가늘어지는 휘두른 자국: a0(두꺼움) → a1(가늚). {(x,y): (바깥에서 깊이 칸, 안쪽까지 남은 칸)}"""
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
FL = {'h': '#fff4c0', 'w': '#ffffff', 'y': '#ffd860'}
def flash(a, x, y, big=False):
    if big: a.paint(['..y..', '..h..', 'yhwhy', '..h..', '..y..'], FL, ox=x - 2, oy=y - 2)
    else: a.paint(['.h.', 'hwh', '.h.'], FL, ox=x - 1, oy=y - 1)
def rays_bg(ramp, cx, cy, R, cuts, n, dark, rot=0.0, w=0.5, k=0.55, hole=2.2):
    """빛살 배경: 둥근 빛 + n갈래 어두운 살"""
    base = radial(ramp, cx, cy, R, cuts)
    def fn(x, y):
        th = math.atan2(y - cy, x - cx) + rot; s = (th * n / (2 * math.pi)) % 1
        if s < w and math.hypot(x - cx, y - cy) > hole: return mix(base(x, y), dark, k)
        return base(x, y)
    return fn
# 칼자루 색: 금 코등이·자루끝, 가죽 손잡이
HILT = {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'r': ('#b0682a', 9), 'R': ('#7a4220', 9)}
# 1. 강타: 큰 초승달 베기 + 내려친 칼 + 칼끝 번쩍
DARKFIRE = ['#1a0304', '#3a0806', '#621208', '#8e1e0c', '#b8300e', '#e05a18']
SWORD_DL = ['................', '................', '................', '................',
            '................',
            '............g...',
            '.......g...r....',
            '........g.R.....',
            '.........g......',
            '.......wmMg.....',
            '......wmM..g....',
            '.....wmM........',
            '....wmM.........',
            '...wmM..........',
            '...mM...........',
            '..m.............']
def bash():
    a = Art().bg(radial(DARKFIRE, 9.0, 11.0, 12.5, [0.0, 0.18, 0.36, 0.56, 0.78]))
    slash(a, crescent2((8.5, 10.0), 7.6, (10.2, 11.4), 7.2))
    a.sym(SWORD_DL, HILT)
    flash(a, 2, 15)
    return a, 0
def ring(a, cx, cy, R, spans, c, w=0.55):
    """고리 조각 (고함 물결): spans = [(시작각, 끝각)...]"""
    for y in range(cell.H):
        for x in range(cell.W):
            px, py = x + 0.5, y + 0.5
            if abs(math.hypot(px - cx, py - cy) - R) > w: continue
            th = math.degrees(math.atan2(py - cy, px - cx))
            if any(a0 <= th <= a1 or a0 <= th + 360 <= a1 or a0 <= th - 360 <= a1 for a0, a1 in spans): a.set(x, y, c)
# 2. 도발: 뿔 투구 + 붉게 빛나는 눈 + 붉은·검은 빛살 + 고함 물결
BLOOD = ['#1a0204', '#3a0606', '#640c0a', '#921a10', '#c43418', '#f06a30']
HELM = ['................',
        '................',
        '................',
        '..t..........t..',
        '..a..........a..',
        '..ab..mmmM..ba..',
        '...ab.mmmM.ba...',
        '....bmmmmmMb....',
        '....mmmmmmMM....',
        '....nfnnnnfn....',
        '....m12mm12M....',
        '....m33mm33M....',
        '....mkkmmkkM....',
        '....mkkmMkkM....',
        '.....mkmMkM.....',
        '.....m....M.....']
HELMP = {'a': ('#f4dca0', 7), 'b': ('#b8884a', 7), 't': ('#fff6e0', 7), '1': ('#fff0b0', 1), '2': ('#ff4a1a', 1), '3': ('#b81408', 1)}
def taunt():
    a = Art().bg(radial(BLOOD, 7.5, 10.0, 11.5, [0.0, 0.2, 0.42, 0.64, 0.86]))
    ring(a, 7.5, 10.5, 7.0, [(150, 210), (-30, 30)], '#ffb070')
    ring(a, 7.5, 10.5, 8.6, [(155, 205), (-25, 25)], '#e05a2a')
    a.sym(HELM, HELMP)
    pips(a, 1)
    return a, 1
# 3. 철벽: 쇠 방패 + 금빛 성 무늬 + 푸른 결계 빛
SKY = ['#060c2a', '#0e1e5a', '#18388e', '#2a62c4', '#4a94ec', '#9ad4ff']
SHIELD = ['................',
          '................',
          '................',
          '................',
          '...gggggggggg...',
          '...gmmMMMMMnG...',
          '...gmMMMMMMnG...',
          '...gm1M11M1nG...',
          '...gm111111nG...',
          '...gm11dd11nG...',
          '...gm11dd11nG...',
          '...gmMMMMMMnG...',
          '....gmMMMMnG....',
          '.....gmMMnG.....',
          '......gmnG......',
          '.......gG.......']
SHP = {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), '1': ('#ffd84a', 6), 'd': ('#5a3a10', 1)}
def ironwall():
    a = Art().bg(rays_bg(SKY, 7.5, 9.5, 11, [0.0, 0.2, 0.42, 0.64, 0.86], 8, '#0a1a4a', rot=0.2, w=0.4, k=0.45))
    a.sym(SHIELD, SHP, glow='#c8f0ff')
    flash(a, 14, 5); flash(a, 1, 14)
    return a, 0
# 4. 휩쓸기: 칼이 한 바퀴 돌며 남긴 큰 고리 + 칼 + 여러 번 맞은 번쩍임
AMBER = ['#1e0a02', '#4a1c04', '#7a3206', '#a8500c', '#d07818', '#f0a030']
SWORD_UR = ['................', '................', '................', '................',
            '............w...',
            '...........m....',
            '.........wmM....',
            '........wmM.....',
            '.......wmM......',
            '.....gwmM.......',
            '......gM........',
            '.....r.g........',
            '....R...........',
            '...g............']
def sweep():
    a = Art().bg(radial(AMBER, 7.5, 9.5, 11, [0.0, 0.26, 0.46, 0.66, 0.86]))
    slash(a, crescent(7.5, 9.5, 7.3, -44, 222, 3.0, fade=0.8))
    a.sym(SWORD_UR, HILT)
    flash(a, 1, 11); flash(a, 10, 16)
    return a, 0
# 5. 광폭화: 빛나는 몸이 두 팔을 치켜든 자세 + 붉은·검은 빛살
BODY = ['................',
        '................',
        '................',
        '......h..h......',
        '.Ho...hhhh...Ho.',
        '.oO...Hooo...oO.',
        '.Ho...woow...Ho.',
        '.oO...oRRO...oO.',
        '.HoO...oO...HoO.',
        '..HoooHooooooO..',
        '...HHooooooOO...',
        '....HoooooOO....',
        '.....HooooO.....',
        '......HoOO......',
        '.....HoooOO.....',
        '....Hoo..oOO....',
        '....Ho....oO....',
        '....Ho....oO....']
BODYP = {'H': ('#ffe070', 14), 'o': ('#ff9a2a', 14), 'O': ('#d0501a', 14), 'h': ('#7a1408', 13), 'w': ('#ffffff', 1), 'R': ('#5a0a04', 1)}
def berserk():
    a = Art().bg(rays_bg(BLOOD, 7.5, 10.0, 11.5, [0.0, 0.18, 0.38, 0.6, 0.82], 12, '#0e0204', rot=0.1, k=0.5, hole=3.0))
    a.sym(BODY, BODYP)
    return a, 0
ICONS = {'bash': ('강타', 'dmg', bash), 'taunt': ('도발 1', 'taunt', taunt), 'ironwall': ('철벽', 'buff', ironwall),
         'sweep': ('휩쓸기', 'dmg', sweep), 'berserk': ('광폭화', 'buff', berserk)}
