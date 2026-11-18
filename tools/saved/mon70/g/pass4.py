"""지하미궁 통로(Lv120 ~ 140) 몬스터 시안 — 11-18 01:38 사용자 「다음」(3구역 고른 뒤 다음 구간)
7번가 지하수로 끝, 지하미궁으로 내려가는 통로를 범죄 조직 셋과 암살자 길드가 막고 있다(계획 문서 「하르겐 지하」 절):
쥐의 왕관(쥐인간 도둑 조합) · 붉은 손 형제단(사람 사냥꾼) · 잿빛 장부(밀수꾼) · 암살자 길드.
필드 우두머리 = 조직 두목 셋 · 던전 「암살자 길드 본부」 길드장 검은 두건(뒷골목의 검은 두건은 대역이었다).
일반 다섯은 A · B, 조직 두목 셋은 A · B, 길드장은 A · B · C.
- 쥐인간 금고털이(쥐의 왕관): A 고글 금고털이(쇠지레) · B 열쇠 꾸러미 쥐인간(큰 열쇠)
- 사람 사냥꾼(붉은 손 형제단): A 밧줄잡이(가죽 모자 · 붉은 복면 · 어깨에 감은 밧줄) · B 사슬잡이(민머리 · 얼굴의 붉은 줄 · 몸에 감은 사슬 · 족쇄 사슬)
- 형제단 사냥개: A 쇠가시 목줄 사냥개(검은 큰 개 · 붉은 천) · B 굶주린 잿빛 사냥개(드러난 갈비 · 끊어진 목줄)
- 밀수꾼(잿빛 장부): A 짐짝 밀수꾼(등의 나무 짐짝 · 허리 등불 · 짐 갈고리) · B 장부 회계원(안경 · 겨드랑이의 잿빛 장부 · 지팡이 칼)
- 그림자 분신(암살자 길드): A 연기 그림자(붉은 두 눈 · 아래가 연기) · B 금 간 그림자(보랏빛 금 · 얼굴 없는 눈 틈)
피한 것: 뒷골목 길드원(그림자 두건 암살자 · 역병 의사 독살자 · 상처 덩치 행동대원 · 까마귀 가면 간부) · 1구역 쥐인간 도둑(누더기 두건 · 훔친 자루 · 금니 두목) · 들쥐왕(망토 · 밀 이삭 홀) ·
그물(격자) · 손 모양 문장(손바닥 표식) · 갈고리 손 + 삼각 모자(유명한 해적 선장) · 가시 공(더하기 꼴)
python3 pass4.py → ../t/pass4_*.json"""
from kit import *


def qb(p0, p1, p2, n=10):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in (i / n for i in range(n + 1))]


def tube(pts, rs):
    out = set()
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        for k in range(4):
            t0, t1 = k / 4, (k + 1) / 4
            pa = (a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0); pb = (a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1)
            out |= cap(pa, pb, rs[i] + (rs[i + 1] - rs[i]) * (t0 + t1) / 2)
    return out


def lerp_r(rs, n):
    out = []
    for i in range(n + 1):
        u = i / n * (len(rs) - 1); j = min(len(rs) - 2, int(u)); f = u - j
        out.append(rs[j] + (rs[j + 1] - rs[j]) * f)
    return out


def at_path(pts, u):
    """줄 위 u(0~1) 자리의 점과 방향(단위)"""
    L = [0.0]
    for a, b in zip(pts, pts[1:]): L.append(L[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    s = u * L[-1]
    for i in range(len(pts) - 1):
        if L[i + 1] >= s or i == len(pts) - 2:
            a, b = pts[i], pts[i + 1]; seg = (L[i + 1] - L[i]) or 1e-9; f = max(0.0, min(1.0, (s - L[i]) / seg))
            return (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f), ((b[0] - a[0]) / seg, (b[1] - a[1]) / seg)


def chain_on(c, pts, step=2.6, ring='N', side='n', hi='x', dark='n'):
    """굵은 사슬: 고리(3×3 테 · 가운데 구멍 · 왼쪽 위 빛 · 오른쪽 아래 그늘)와 이음 고리(한 칸)가 번갈아 — 칸 둘레 테가 겹쳐도 더하기 꼴이 안 되게 고리는 늘 구멍을 둔다"""
    L = sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:]))
    n = max(1, int(L / step))
    for k in range(n + 1):
        (x, y), (tx, ty) = at_path(pts, k / n); nx, ny = -ty, tx
        for (a, b) in ((-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)):
            ch = hi if (a + b) <= -1 and b <= 0 else dark if a + b >= 1 else ring
            c.set(x + tx * a * 0.9 + nx * b * 0.9, y + ty * a * 0.9 + ny * b * 0.9, ch)
        if k < n:
            (x2, y2), _ = at_path(pts, (k + 0.5) / n); c.set(x2, y2, side)


def smog(c, puffs, curls=(), soot=(), base='w', light='W', dark='u', hi='V'):
    """매연 덩이: 덩이(원)들의 합 = 뭉게 테두리 실루엣을 한 색으로 채우고(덩이 사이 테 없음 — 돌무더기처럼 안 보이게) 위 빛 · 아래 그늘 →
    위로 드러난 덩이마다 왼쪽 위 볼록 빛 · 안쪽 소용돌이 줄 · 둘레에 떠도는 그을음 덩이(2칸 — 한 칸짜리는 테가 둘러 더하기 꼴이 된다)"""
    cells = set()
    for (x, y, r) in puffs: cells |= ell(x, y, r, r * 0.92)
    c.fill(cells, base)
    blunt(c.g, base, light, dark, bottom=1, side=1, top=1)
    for (x0, y0, r) in puffs:
        if r < 1.8: continue
        for (x, y) in ell(x0, y0, r, r * 0.92):
            if (x, y - 1) not in cells and -0.9 <= (x + 0.5 - x0) / r <= 0.15 and (x, y + 1) in cells: c.set(x, y + 1, hi)
    for pts in curls: c.only(thins(pts), hi, base + dark)
    for (x, y) in soot: c.fill(box(x, y, x + 1.0, y), dark)
    return cells


def cumulus(c, circles, W='W', w='w', V='V', u='u', sq=0.9, low=0.3, spec=True, arc=0.2, drawn=None):
    """뭉게 덩이를 하나씩 겹쳐 그린다(뒤 덩이부터): 아래쪽 그늘 · 왼쪽 위 빛 · 앞 덩이 윗가장자리 테 (raidb.py와 같은 식)"""
    drawn = set(drawn or ())
    for (x0, y0, r) in circles:
        cells = ell(x0, y0, r, r * sq)
        for (x, y) in cells:
            dx = (x + 0.5 - x0) / r; dy = (y + 0.5 - y0) / (r * sq)
            ch = W
            if dy > low - 0.22 * dx + 0.08 * math.sin(x * 1.9 + y0): ch = w
            elif spec and r >= 2.4 and -0.8 <= dx <= -0.15 and -0.88 <= dy <= -0.4: ch = V
            c.set(x, y, ch)
        for (x, y) in cells:
            if (y + 0.5 - y0) / (r * sq) > arc: continue
            if any((x + ex, y + ey) in drawn and (x + ex, y + ey) not in cells for (ex, ey) in ((0, -1), (-1, 0), (1, 0))): c.set(x, y, u)
        drawn |= cells
    return drawn


def edge(cells):
    """칸 묶음의 바깥 둘레 칸"""
    return {(x, y) for (x, y) in cells if any((x + dx, y + dy) not in cells for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}


def legs(c, xf, xn, top, w, far='p', near='P', boot='k', gy=35.6, foot=2.4, bh=2.6):
    """먼 다리 · 앞 다리 + 장화"""
    for (x, ch) in ((xf, far), (xn, near)):
        c.fill(rbox(x - w / 2, top, x + w / 2, gy - 0.6, 0.5), ch)
        c.fill(rbox(x - w / 2 - 0.2, gy - bh, x + w / 2 + foot, gy, 0.5), boot)


def rathead(c, x, y, s=1.0, F='F', f='f', O='O', eye='K', open_=False):
    """옆을 본 쥐 머리 (x, y = 머리뼈 가운데, 오른쪽을 봄): 둥근 귀 둘 · 긴 주둥이 · 분홍 코 · 앞니 · 수염"""
    c.fill(ell(x - 2.4 * s, y - 3.6 * s, 1.5 * s, 1.7 * s), f)                                                       # 먼 귀
    c.fill(ell(x, y, 3.4 * s, 3.0 * s), F)
    c.fill(poly([(x + 1.6 * s, y - 2.0 * s), (x + 4.6 * s, y - 0.4 * s), (x + 7.2 * s, y + 0.8 * s), (x + 7.0 * s, y + 1.8 * s), (x + 1.8 * s, y + 2.6 * s)]), F)   # 주둥이
    if open_:
        c.fill(poly([(x + 1.6 * s, y + 2.0 * s), (x + 6.0 * s, y + 2.4 * s), (x + 5.0 * s, y + 4.0 * s), (x + 1.4 * s, y + 3.2 * s)]), f)
        c.fill(poly([(x + 2.6 * s, y + 2.2 * s), (x + 5.4 * s, y + 2.4 * s), (x + 4.4 * s, y + 3.2 * s)]), 'k')
    c.fill(ell(x - 0.6 * s, y - 3.8 * s, 2.0 * s, 2.2 * s), F); c.fill(ell(x - 0.4 * s, y - 3.6 * s, 1.0 * s, 1.2 * s), O)   # 앞 귀 (분홍 속)
    c.fill(box(x + 6.6 * s, y + 0.8 * s, x + 7.4 * s, y + 1.6 * s), O)                                               # 코
    c.set(x + 5.2 * s, y + 2.6 * s, 'w')                                                                             # 앞니
    c.fill(box(x + 1.4 * s, y - 0.8 * s, x + 2.0 * s, y - 0.4 * s), eye)                                             # 눈
    for (a, b) in (((x + 5.4 * s, y + 1.2 * s), (x + 8.6 * s, y + 0.2 * s)), ((x + 5.4 * s, y + 1.8 * s), (x + 8.4 * s, y + 2.8 * s))): c.fill(thin(a, b), f)   # 수염


def hhead(c, x0, y0, S='S', s='s', eye='k', w=6.4, h=7.4):
    """옆을 본 사람 머리 (x0, y0 = 왼쪽 위): 둥근 머리 · 코 · 눈 · 귀"""
    c.fill(rbox(x0, y0, x0 + w, y0 + h, 2.2), S)
    c.fill(box(x0 + w + 0.4, y0 + 3.2, x0 + w + 0.8, y0 + 4.2), S)                                                   # 코
    c.fill(box(x0 + w - 1.6, y0 + 2.6, x0 + w - 1.0, y0 + 2.6), eye)                                                 # 눈
    c.fill(box(x0 + 1.8, y0 + 3.0, x0 + 2.6, y0 + 4.4), s)                                                           # 귀


ACT_DAG = {'atk': ['thrust', 'hack', 'down'], 'skl': ['jstab'], 'tk': 1.0,
           'fx': {'atk': {'pal': 'steel', 'hit': 'star'}, 'skl': {'pal': 'shadow', 'hit': 'slashes', 'big': 1, 'after': 'smoke'}}}

# ═══════════ 1. 쥐인간 금고털이 (쥐의 왕관) ═══════════
ACT1 = {'atk': ['down', 'side'], 'skl': ['smash'], 'tk': 1.05,
        'fx': {'atk': {'pal': 'steel', 'hit': 'star'}, 'skl': {'pal': 'steel', 'hit': 'stun', 'big': 1, 'after': 'sparks'}}}
B1 = Batch('pass4_rat', 'ratman', ACT1, 'sewer', show=[['down', 4], ['smash', 5]], ms=1.0)
B1.extra = head_js('crowbar', """
NN.
.N.
""", '쇠지레 (쥐인간 금고털이 A): 끝이 꺾인 쇠막대', L=5.5, shaft='N', below=1.5, fxw='club') + head_js('bigkey', """
GG
G.
GG
G.
""", '큰 놋쇠 열쇠 (쥐인간 금고털이 B): 한쪽으로 난 열쇠 이', L=5.5, shaft='G', below=1.5, fxw='club')
P1A = {'F': '#8a7a68', 'f': '#5e5044', 'O': '#d8a0a0', 'K': '#140c0c', 'C': '#6a4a30', 'c': '#46301e', 'A': '#8a6a44', 'a': '#5e4630', 'B': '#3a2a1e', 'b': '#2a1e14',
       'G': '#d8b040', 'L': '#9ad8f0', 'P': '#3e3a44', 'p': '#2a262e', 'k': '#1a1418', 't': '#c89a8a', 'N': '#8a9098', 'n': '#565c64', 'w': '#ffffff'}
P1B = {'F': '#6a6a72', 'f': '#46464e', 'O': '#d0a0a8', 'K': '#ff4a3a', 'H': '#2e4a3a', 'h': '#1c3026', 'C': '#4a3a2e', 'c': '#30241c', 'B': '#3a2a1e', 'b': '#2a1e14',
       'G': '#d8b040', 'g': '#9a7a28', 'P': '#3a3a42', 'p': '#26262c', 'k': '#141418', 't': '#c0a0a0', 'w': '#ffffff'}


def ratburglar(opt):
    c = Cv(30, 38)
    c.fill(tube([(9.6, 25.0), (6.4, 27.4), (3.6, 31.4), (2.6, 34.4), (5.0, 35.4)], [1.0, 0.9, 0.7, 0.5, 0.4]), 't')   # 꼬리
    legs(c, 12.6, 16.8, 26.0, 2.6)
    torso = poly([(12.6, 14.2), (18.6, 13.6), (20.4, 16.6), (20.6, 22.6), (19.4, 27.0), (11.0, 27.0), (9.8, 22.0), (10.6, 17.0)])   # 구부정한 몸 (등이 둥글다)
    if opt == 'A':
        c.fill(path([(12.0, 16.4), (10.4, 21.0), (11.4, 24.4)], 1.2), 'f'); c.fill(ell(11.6, 24.8, 1.2, 1.0), 'f')       # 먼 팔
        c.fill(torso, 'C')
        c.fill(poly([(17.0, 14.6), (20.0, 15.6), (20.4, 21.0), (17.6, 21.0)]), 'F')                                   # 열린 조끼 사이 가슴 털
        c.fill(poly([(12.4, 21.6), (20.4, 21.4), (20.8, 28.6), (11.6, 28.6)]), 'A')                                  # 연장 앞치마
        blunt(c.g, 'C', 'C', 'c', bottom=1, side=0)
        for x in (13.8, 16.0, 18.2): c.only(box(x, 23.0, x + 0.6, 25.4), 'a', 'A')                                     # 앞치마 연장 고리
        c.fill(box(10.4, 20.6, 20.6, 21.4), 'B'); c.fill(rbox(9.0, 21.0, 11.4, 24.0, 0.4), 'b')                        # 허리띠 · 주머니
        rathead(c, 17.6, 10.6, 1.15)
        c.fill(thins([(13.6, 8.0), (20.6, 9.2)]), 'b')                                                               # 고글 끈
        c.fill(ell(15.6, 7.6, 1.5, 1.4), 'G'); c.set(15.6, 7.6, 'L')                                                 # 이마에 올린 고글 알
        c.fill(ell(19.4, 9.8, 1.6, 1.5), 'G'); c.fill(box(19.0, 9.4, 19.8, 10.2), 'L')                               # 눈에 내린 확대 알
    else:
        c.fill(path([(12.0, 16.4), (10.4, 21.6), (11.0, 25.0)], 1.2), 'h'); c.fill(ell(11.0, 25.4, 1.2, 1.0), 'f')     # 먼 팔
        c.fill(torso | poly([(10.0, 22.0), (20.6, 22.0), (21.4, 30.4), (9.2, 30.4)]), 'H')                          # 두건 망토
        c.fill(poly([(17.2, 14.6), (20.2, 15.6), (20.2, 20.6), (17.8, 20.6)]), 'F')                                   # 망토 앞섶 사이 털
        blunt(c.g, 'H', 'H', 'h', bottom=1, side=0)
        c.only(thins([(14.6, 17.0), (14.0, 29.8)]), 'h', 'H')                                                        # 망토 주름 (세로)
        c.fill(box(10.0, 22.0, 20.8, 22.8), 'B')                                                                     # 허리띠
        c.fill(ell(19.2, 24.8, 1.7, 1.7) - ell(19.2, 24.8, 0.7, 0.7), 'G')                                           # 열쇠 꾸러미 고리
        for (x, L) in ((18.2, 2.4), (19.6, 3.2), (21.0, 2.0)): c.fill(box(x, 26.2, x + 0.4, 26.2 + L), 'g'); c.set(x + 0.6, 26.2 + L, 'g')   # 매달린 열쇠
        rathead(c, 17.6, 10.6, 1.15, F='F', f='f', O='O', eye='K')
        c.fill(poly([(12.4, 8.6), (14.0, 5.4), (20.0, 5.8), (21.8, 8.8), (18.0, 7.8), (13.6, 10.4)]), 'H')            # 머리를 덮은 두건 (귀는 밖으로)
        c.fill(ell(16.6, 6.4, 1.7, 1.9), 'F'); c.fill(ell(16.8, 6.6, 0.8, 1.0), 'O')                                  # 두건 밖 앞 귀
    return c


for opt, lab, desc, pal, wpn in (('A', 'A 고글 금고털이', '쥐의 왕관 조합원 · 갈색 쥐인간이 구부정하게 선다 · 이마에 올린 놋쇠 고글과 눈에 내린 확대 알 · 가죽 조끼와 연장 고리 달린 앞치마 · 허리 주머니 · 쇠지레로 내리친다', P1A, 'crowbar'),
                                 ('B', 'B 열쇠 꾸러미 쥐인간', '쥐의 왕관 조합원 · 잿빛 털 · 붉은 눈 · 귀만 내놓은 짙은 초록 두건 망토 · 허리에 찰랑이는 놋쇠 열쇠 꾸러미 · 큰 놋쇠 열쇠를 몽둥이처럼 휘두른다', P1B, 'bigkey')):
    B1.add('ratburglar' + ('' if opt == 'A' else '_b'), lab, desc, ratburglar(opt), pal, (18, 16), 14.5, 25, wpn=wpn, arm=['C', 'c'] if opt == 'A' else ['H', 'h'], hand='F', idle={'h': [2, 2], 'a': -40})
B1.dump()

# ═══════════ 2. 사람 사냥꾼 (붉은 손 형제단) ═══════════
ACT2 = {'atk': ['down', 'side'], 'skl': ['smash'], 'tk': 1.05,
        'fx': {'atk': {'pal': 'blood', 'hit': 'star'}, 'skl': {'pal': 'blood', 'hit': 'stun', 'big': 1, 'after': 'dust'}}}
B2 = Batch('pass4_hunter', 'enforcer', ACT2, 'sewer', show=[['side', 4], ['smash', 5]], ms=1.0)
B2.extra = r"""// 쇠공 사슬 (사슬잡이): 정면 고리 · 옆 고리가 번갈아 처지는 사슬 + 끝의 무거운 쇠공 (가시 없음 · 위 빛 · 아래 그늘)
PXU_WPN.chainball = (F, d) => { const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1;
  const at = (t, s, ch) => out.push([hx + dx * t + px * s, hy + dy * t + py * s, ch]);
  const L = 7.2 * k, ring = (t, s) => { for (const [a, b] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) at(t + a * 0.8, s + b * 0.8, a + b <= -1 && b <= 0 ? 'x' : a + b >= 1 ? 'n' : 'N'); };
  for (let t = 1.2, i = 0; t <= L - 2.0; t += 1.25, i++) { const s = Math.sin(t / L * Math.PI) * 1.0; if (i % 2 === 0) ring(t, s); else at(t, s, 'n'); }   // 구멍 난 고리 · 이음 고리 번갈아 (가운데가 처진다)
  for (let a = -2.0; a <= 2.0; a += 0.45) for (let b = -2.0; b <= 2.0; b += 0.45) { const q = a * a + b * b; if (q > 4.0) continue; at(L + 0.6 + a, b, a < -0.6 && b < -0.4 && q < 2.6 ? 'x' : a > 0.8 || b > 1.1 ? 'n' : 'N'); }   // 무거운 쇠공
  return out; };
PXU_FXW.chainball = 'club';
"""
B2.extra += head_js('sap', """
JJ
JJ
Jj
jj
""", '가죽 곤봉 (사람 사냥꾼 A): 모래를 채운 굵은 가죽 곤봉', L=3.5, shaft='j', below=1.0, fxw='club')
P2A = {'S': '#d0a080', 's': '#a07858', 'k': '#1a1210', 'L': '#6a4a30', 'l': '#46301e', 'R': '#a82a2a', 'r': '#6e1a1a', 'C': '#5a4a3a', 'c': '#3a2e24', 'J': '#c0a070', 'j': '#8a7048',
       'B': '#2e2420', 'N': '#8a9098', 'n': '#565c64', 'P': '#4a3e36', 'p': '#30282a', 'K': '#1a1418'}
P2B = {'S': '#c89070', 's': '#9a6a4e', 'k': '#1a1210', 'R': '#b02a2a', 'r': '#701a1a', 'Y': '#7a6a58', 'y': '#54483c', 'C': '#4a3a30', 'c': '#30261e', 'N': '#8a9098', 'n': '#4a5058', 'x': '#d8dce4',
       'B': '#2e2420', 'P': '#3e3630', 'p': '#2a2420', 'K': '#1a1418', 'b': '#3a2a20'}


def manhunter(opt):
    c = Cv(30, 38)
    legs(c, 12.6, 17.0, 24.6, 2.8, boot='K')
    if opt == 'A':
        c.fill(path([(12.2, 15.6), (10.8, 20.6), (11.6, 23.6)], 1.3), 'c'); c.fill(ell(11.8, 24.0, 1.2, 1.0), 'R')     # 먼 팔 · 붉은 손
        c.fill(rbox(10.4, 14.4, 20.2, 25.6, 1.4), 'C')                                                               # 가죽 윗옷
        blunt(c.g, 'C', 'C', 'c', bottom=1, side=0)
        c.fill(box(10.4, 22.0, 20.2, 22.8), 'B')
        for x in (12.4, 14.0): c.fill(ell(x, 24.0, 0.9, 0.9) - {(int(x), 24)}, 'N')                                    # 허리에 건 쇠고랑 둘
        rope = ell(13.0, 16.8, 3.2, 2.6) - ell(13.0, 16.8, 1.6, 1.2)                                                 # 어깨에 감은 밧줄
        c.fill(rope, 'J'); c.only({(x, y) for (x, y) in rope if (x + y) % 2 == 0 and y > 16}, 'j', 'J')
        hhead(c, 14.0, 5.6)
        c.fill(poly([(13.4, 8.4), (13.8, 5.0), (16.4, 3.8), (20.6, 4.6), (21.4, 7.2), (14.6, 7.4), (15.0, 11.2), (13.4, 10.6)]), 'L')   # 귀덮개 가죽 모자
        c.fill(thins([(14.4, 7.4), (21.6, 7.4)]), 'l')
        c.fill(poly([(16.4, 10.0), (21.6, 9.6), (21.6, 12.6), (17.0, 13.2)]), 'R'); c.fill(thins([(17.0, 12.8), (21.4, 12.4)]), 'r')   # 붉은 복면
    else:
        c.fill(path([(12.2, 15.6), (10.6, 20.4), (11.4, 23.6)], 1.4), 'S'); c.fill(path([(10.8, 20.6), (11.4, 23.6)], 1.3), 'R'); c.fill(ell(11.6, 24.0, 1.2, 1.0), 'R')   # 붉게 물든 먼 팔
        c.fill(rbox(10.2, 14.2, 20.4, 25.6, 1.6), 'C')                                                               # 가죽 조끼
        blunt(c.g, 'C', 'C', 'c', bottom=1, side=0)
        c.fill(rbox(9.8, 13.4, 20.8, 16.4, 1.4), 'Y'); c.only(thins([(10.4, 16.0), (20.4, 16.0)]), 'y', 'Y')          # 털 어깨 덮개
        c.fill(box(10.2, 22.2, 20.4, 23.0), 'B')
        chain_on(c, [(19.4, 15.8), (11.6, 24.0)])                                                                    # 앞 어깨에서 먼 허리로 감은 굵은 사슬 (구멍 난 고리 · 이음 고리)
        chain_on(c, [(18.0, 24.4), (18.6, 29.0)], 2.3)                                                               # 허리에서 늘어진 족쇄 사슬
        hhead(c, 14.0, 5.8)
        c.fill(poly([(15.6, 10.2), (21.2, 10.0), (20.8, 14.0), (17.6, 14.6), (15.8, 13.0)]), 'b')                     # 덥수룩한 검은 수염
        c.fill(thins([(18.6, 6.6), (19.8, 9.4)]), 'r')                                                               # 눈썹을 가로지른 흉터
    return c


for opt, lab, desc, pal, wpn, arm in (('A', 'A 밧줄잡이', '붉은 손 형제단의 사람 사냥꾼 · 귀덮개 가죽 모자 · 코까지 가린 붉은 복면 · 어깨에 감은 밧줄과 허리의 쇠고랑 · 팔꿈치까지 붉게 물들인 손 · 굵은 가죽 곤봉으로 때려눕힌다', P2A, 'sap', ['C', 'R']),
                                      ('B', 'B 사슬잡이', '붉은 손 형제단의 사람 사냥꾼 · 민머리 · 덥수룩한 검은 수염 · 눈썹의 흉터 · 털 어깨 덮개 · 앞 어깨에서 먼 허리로 감은 굵은 고리 사슬(구멍 난 고리 · 이음 고리)과 허리에 늘어진 사슬 · 붉게 물든 팔 · 처지는 사슬 끝의 쇠공을 휘두른다', P2B, 'chainball', ['S', 'R'])):
    B2.add('manhunter' + ('' if opt == 'A' else '_b'), lab, desc, manhunter(opt), pal, (18, 15), 14.8, 24, wpn=wpn, arm=arm, hand='R', idle={'h': [2, 2], 'a': 40})
B2.dump()

# ═══════════ 3. 형제단 사냥개 (짐승 · noArm) ═══════════
ACT3 = {'atk': ['qbite'], 'skl': ['qpounce'], 'tk': 1.15,
        'fx': {'atk': {'pal': 'blood', 'hit': 'bite'}, 'skl': {'pal': 'blood', 'hit': 'claw', 'big': 1, 'after': 'dust'}}}
B3 = Batch('pass4_dog', 'windwolf', ACT3, 'sewer', show=[['qbite', 4], ['qpounce', 4]], still=1, noArm=1, wpn='none')
P3A = {'C': '#3a3030', 'Q': '#5a4c48', 'c': '#241c1c', 'd': '#140e0e', 'M': '#6a5a52', 'e': '#ffb030', 'k': '#0a0606', 'w': '#ffffff', 'R': '#b02a2a', 'r': '#701a1a',
       'N': '#8a9098', 'n': '#565c64', 'x': '#c8ccd4', 'T': '#d06a6a'}
P3B = {'C': '#8a8680', 'Q': '#aaa6a0', 'c': '#5e5a56', 'd': '#3a3634', 'M': '#a8a49e', 'e': '#ff4a3a', 'k': '#0a0606', 'w': '#ffffff', 'R': '#b02a2a', 'r': '#701a1a',
       'N': '#8a9098', 'n': '#565c64', 'x': '#c8ccd4', 'T': '#d06a6a'}


def hound(mode, opt):
    c = Cv(36, 26); gy = 24.6
    lean = opt == 'B'
    up = {'idle0': 0, 'idle1': 0.4, 'bite': 0, 'leap': -3.0}[mode]; st = mode == 'leap'
    by = 13.0 + up
    for (x0, x1, ch) in ((10.2, 8.6 if st else 10.6, 'c'), (22.6, 24.6 if st else 22.4, 'c')):                       # 먼 다리
        c.fill(path([(x0, by + 1.0), (x1 - 0.4, by + 6.0), (x1 - 1.4 if st else x1, gy - 1.0)], 1.3, 1.0), ch)
    tail = [(7.0, by - 1.0), (4.6, by - 3.6), (4.2, by - 6.0)] if not st else [(7.0, by - 0.6), (3.6, by - 1.8), (1.6, by - 2.4)]
    c.fill(path(tail, 1.1, 0.7), 'C')
    body = (ell(15.4, by, 7.4, 4.8) | ell(21.4, by - 0.6, 5.0, 5.6)) if not lean else (ell(14.6, by, 8.4, 4.0) | ell(21.0, by - 0.4, 4.6, 4.4))
    c.fill(body, 'C')
    for (x0, x1) in ((12.6, 11.4 if st else 12.2), (24.2, 27.4 if st else 23.8)):                                     # 앞 다리
        c.fill(path([(x0, by + 1.4), (x1, by + 6.4), (x1 - 1.6 if st else x1, gy - 0.8)], 1.5, 1.1), 'C')
        c.fill(rbox(x1 - (2.0 if st else 0.8), gy - 1.4, x1 + 1.6 - (1.6 if st else 0), gy, 0.4), 'C')
    hx, hy = 28.4 + (2.0 if st else 0), by - 4.6 + (1.0 if st else 0)
    hs = 1.0 if lean else 1.25
    c.fill(rbox(hx - 3.6 * hs, hy - 3.2 * hs, hx + 2.0, hy + 2.6 * hs, 2.0), 'C')                                     # 큰 머리 (A는 더 크고 각지다)
    jaw = mode in ('bite', 'leap')
    c.fill(rbox(hx + 0.6, hy - 1.0, hx + 5.4 + (0 if lean else 0.6), hy + 1.6 + (0 if lean else 0.6), 0.8), 'C')       # 주둥이
    if jaw:
        c.fill(poly([(hx + 0.4, hy + 1.4), (hx + 5.0, hy + 3.0), (hx + 4.4, hy + 4.4), (hx + 0.4, hy + 3.4)]), 'C')
        c.fill(poly([(hx + 1.2, hy + 1.6), (hx + 5.2, hy + 1.6), (hx + 4.2, hy + 3.0)]), 'k'); c.fill(box(hx + 1.6, hy + 2.6, hx + 3.0, hy + 3.0), 'T')
        for x in (hx + 2.0, hx + 3.8): c.set(x, hy + 1.6, 'w')
    else:
        c.fill(poly([(hx + 0.4, hy + 1.4), (hx + 5.0, hy + 1.6), (hx + 4.6, hy + 2.8), (hx + 0.6, hy + 3.2)]), 'C')    # 처진 볼
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(box(hx + 4.8, hy - 1.0, hx + 5.6, hy - 0.4), 'k')                                                         # 코
    c.fill(box(hx + 0.4, hy - 1.6, hx + 1.2, hy - 1.2), 'e'); c.fill(thins([(hx - 0.4, hy - 2.2), (hx + 1.6, hy - 2.0)]), 'd')   # 눈 · 눈두덩
    if opt == 'A':
        c.fill(poly([(hx - 2.8, hy - 2.6), (hx - 1.6, hy - 5.0), (hx - 0.6, hy - 2.8)]), 'c')                          # 짧게 자른 귀
        col = path([(hx - 3.0, hy - 1.6), (hx - 2.4, hy + 3.4)], 1.0)
        c.fill(col, 'N'); c.only({(x, y) for (x, y) in col if x == int(hx - 3.6)}, 'n', 'N')
        for (x, y) in ((hx - 4.6, hy - 1.0), (hx - 4.4, hy + 1.6)): c.fill(poly([(x + 0.8, y - 0.6), (x + 0.8, y + 0.6), (x - 0.8, y)]), 'x')   # 쇠가시 (뒤로)
        c.fill(poly([(hx - 2.4, hy + 3.0), (hx - 0.6, hy + 3.2), (hx - 1.0, hy + 7.0), (hx - 2.2, hy + 6.4)]), 'R')   # 목줄에 맨 붉은 천
        c.only(thins([(hx - 1.8, hy + 4.0), (hx - 1.6, hy + 6.4)]), 'r', 'R')
        c.only(ell(hx + 2.6, hy + 0.6, 2.2, 1.4), 'M', 'CQc')                                                        # 주둥이 밝은 털
    else:
        c.fill(poly([(hx - 2.6, hy - 2.6), (hx - 1.0, hy - 5.6), (hx - 0.4, hy - 3.0)]), 'c'); c.set(hx - 1.4, hy - 4.6, '.')   # 찢어진 귀
        for k in range(3): c.only(thins([(12.0 + k * 2.2, by - 2.4), (12.6 + k * 2.2, by + 1.8)]), 'c', 'CQ')            # 드러난 갈비
        c.only(thins([(18.6, by - 3.0), (20.4, by - 1.4)]), 'R', 'CQc')                                              # 흉터
        col = path([(hx - 3.0, hy - 1.6), (hx - 2.4, hy + 3.4)], 0.9); c.fill(col, 'N')
        for k in range(4): c.set(hx - 2.6 - k * 0.6, hy + 4.4 + k * 1.0, 'N' if k % 2 == 0 else 'n')                 # 끊어진 목줄 사슬
    return c


for opt, pal, lab, desc in (('A', P3A, 'A 쇠가시 목줄 사냥개', '붉은 손 형제단이 부리는 먹빛 큰 사냥개 · 각진 큰 머리와 처진 볼 · 짧게 자른 귀 · 쇠가시 목줄과 붉은 천 · 주황 눈 · 물어뜯고 덮친다'),
                            ('B', P3B, 'B 굶주린 잿빛 사냥개', '굶주린 잿빛 사냥개 · 드러난 갈비 · 찢어진 귀와 흉터 · 붉은 눈 · 끊어진 사슬 목줄을 매단 채 달려든다')):
    fr = {m: hound(m, opt) for m in ('idle0', 'idle1', 'bite', 'leap')}
    B3.add('huntdog' + ('' if opt == 'A' else '_b'), lab, desc, [fr['idle0'], fr['idle1']], pal, (33, 9), 18, gm={m: fr[m] for m in ('bite', 'leap')})
B3.dump()

# ═══════════ 4. 밀수꾼 (잿빛 장부) ═══════════
ACT4 = {'atk': ['side', 'thrust'], 'mag': ['spush'], 'skl': ['jstab'], 'tk': 1.05,
        'fx': {'atk': {'pal': 'steel', 'hit': 'star'}, 'mag': {'pal': 'coin', 'hit': 'coins', 'p': 'orb'}, 'skl': {'pal': 'coin', 'hit': 'coins', 'big': 1, 'after': 'sparks'}}}
B4 = Batch('pass4_smug', 'assassin', ACT4, 'sewer', show=[['side', 4], ['jstab', 5]], ms=1.0)
B4.extra = head_js('chook', """
NN.
..N
..N
.NN
""", '짐 갈고리 (밀수꾼 A): 짧은 자루 끝의 휜 쇠갈고리', L=2.5, shaft='b', below=1.0, fxw='dagger') + head_js('canesword', """
x
x
M
M
M
""", '지팡이 칼 (장부 회계원 B): 지팡이에서 뽑은 가는 칼날', L=4.0, shaft='M', below=1.6, fxw='sword')
P4A = {'S': '#c89a78', 's': '#9a6e52', 'k': '#141010', 'H': '#6a6a6e', 'h': '#46464c', 'D': '#8a8a8e', 'C': '#5a4636', 'c': '#3a2c22', 'J': '#9a7448', 'j': '#6a4e2e',
       'b': '#3a2a1e', 'N': '#6a6e76', 'n': '#3e424a', 'Y': '#ffd060', 'P': '#3e3a3e', 'p': '#2a262a', 'K': '#1a1418'}
P4B = {'S': '#d8b098', 's': '#a88068', 'k': '#141010', 'h': '#c8c8cc', 'C': '#5e5e66', 'c': '#3e3e46', 'V': '#7a3a34', 'v': '#4e2420', 'W': '#e8e4d8', 'L': '#7a7a80', 'l': '#4e4e54',
       'G': '#d8b040', 'M': '#3a3036', 'x': '#d8dce4', 'b': '#2a2226', 'P': '#3a3a40', 'p': '#26262c', 'K': '#141418'}


def smuggler(opt):
    c = Cv(30, 38)
    legs(c, 12.8, 17.0, 25.0, 2.6, boot='K')
    if opt == 'A':
        crate = rbox(3.6, 11.0, 11.6, 22.0, 0.4)                                                                     # 등의 나무 짐짝 (가로 널)
        c.fill(crate, 'J'); c.fill(edge(crate), 'j')
        for y in (14.6, 18.2): c.only(thins([(4.4, y), (10.8, y)]), 'j', 'J')
        c.fill(rbox(10.2, 14.6, 20.0, 26.2, 1.4), 'C')                                                               # 갈색 웃옷
        c.fill(poly([(9.8, 14.0), (20.4, 14.0), (21.6, 29.0), (9.2, 29.0)]) - rbox(10.8, 15.0, 19.8, 25.0, 1.0), 'H')   # 잿빛 두건 망토 자락
        blunt(c.g, 'C', 'C', 'c', bottom=1, side=0); blunt(c.g, 'H', 'H', 'h', bottom=1, side=0)
        c.fill(thins([(19.6, 15.0), (12.4, 23.0)]), 'b')                                                             # 짐짝 멜빵 (비스듬히)
        c.fill(box(10.4, 22.8, 19.8, 23.6), 'b')
        c.fill(box(18.6, 24.2, 18.8, 24.6), 'N'); c.fill(rbox(17.8, 25.0, 20.0, 28.2, 0.4), 'N'); c.fill(box(18.6, 25.8, 19.2, 27.4), 'Y')   # 허리에 단 등불
        hhead(c, 14.2, 5.8)
        c.fill(poly([(12.4, 11.0), (13.0, 5.6), (16.0, 3.8), (20.4, 4.4), (22.0, 7.6), (20.6, 7.0), (15.2, 6.8), (15.4, 13.4), (12.6, 13.6)]), 'H')   # 잿빛 두건
        c.fill(poly([(16.2, 9.8), (21.6, 9.4), (21.6, 13.0), (16.6, 13.4)]), 'D')                                    # 코까지 가린 천
        c.fill(box(18.8, 8.4, 19.4, 8.4), 'k')
    else:
        c.fill(poly([(10.0, 14.0), (20.4, 14.0), (21.4, 30.4), (9.0, 30.4)]), 'C')                                   # 잿빛 긴 외투
        c.fill(rbox(13.6, 14.6, 19.6, 22.4, 0.8), 'V'); c.fill(box(16.4, 14.4, 18.8, 15.6), 'W')                       # 붉은 조끼 · 흰 깃
        blunt(c.g, 'C', 'C', 'c', bottom=1, side=0)
        c.only(thins([(14.6, 23.0), (14.0, 30.0)]), 'c', 'C')
        for y in (16.6, 18.6, 20.6): c.set(18.6, y, 'G')                                                             # 조끼 금단추
        book = rbox(7.6, 16.4, 12.6, 23.6, 0.4)                                                                      # 겨드랑이에 낀 잿빛 장부
        c.fill(book, 'L'); c.fill(box(11.8, 17.0, 12.6, 23.0), 'W'); c.fill(edge(book) - box(11.8, 17.0, 12.6, 23.0), 'l')
        c.fill(box(9.0, 19.4, 10.2, 20.6), 'G')                                                                      # 장부 잠금쇠
        c.fill(path([(12.0, 15.4), (10.6, 18.0), (11.6, 21.6)], 1.2), 'c')                                           # 장부를 낀 먼 팔
        hhead(c, 14.2, 5.6)
        c.fill(poly([(14.2, 7.2), (14.8, 5.8), (16.0, 5.6), (16.0, 9.6), (14.4, 10.6)]), 'h')                         # 벗어진 머리 옆 흰 머리
        for x in (18.6, 20.2): c.fill(ell(x, 8.4, 0.9, 0.8) - {(int(x), 8)}, 'G')                                     # 둥근 안경
        c.fill(thins([(18.6, 11.8), (20.6, 11.6)]), 's')
    return c


for opt, lab, desc, pal, wpn in (('A', 'A 짐짝 밀수꾼', '잿빛 장부의 밀수꾼 · 잿빛 두건 망토와 코까지 가린 천 · 등에 멘 나무 짐짝(가로 널) · 허리에 단 작은 등불 · 짧은 짐 갈고리로 걸어 당긴다 · 훔친 금화를 던진다', P4A, 'chook'),
                                 ('B', 'B 장부 회계원', '잿빛 장부의 회계원 · 벗어진 머리와 흰 옆머리 · 둥근 안경 · 잿빛 긴 외투에 붉은 조끼와 금단추 · 겨드랑이에 낀 잠금쇠 달린 장부 · 지팡이에서 뽑은 가는 칼로 찌르고 금화를 던진다', P4B, 'canesword')):
    B4.add('smuggler' + ('' if opt == 'A' else '_b'), lab, desc, smuggler(opt), pal, (18, 15), 15, 24, wpn=wpn, arm=['C', 'c'] if opt == 'B' else ['H', 'h'], hand='S', idle={'h': [2, 2], 'a': 45 if opt == 'A' else -55})
B4.dump()

# ═══════════ 5. 그림자 분신 (암살자 길드 · 떠 있음) ═══════════
ACT5 = {'atk': ['thrust', 'hack'], 'skl': ['jstab'], 'tk': 0.95,
        'fx': {'atk': {'pal': 'shadow', 'hit': 'slashes'}, 'skl': {'pal': 'shadow', 'hit': 'slashes', 'big': 1, 'after': 'smoke'}}}
B5 = Batch('pass4_shade', 'assassin', ACT5, 'sewer', show=[['thrust', 4], ['jstab', 5]], ms=1.0, float=1)
P5A = {'W': '#4e4e54', 'w': '#2c2c32', 'V': '#727278', 'u': '#141418', 'd': '#0a0a0c', 'e': '#ff3a3a', 'M': '#3a3a40', 'N': '#56565e', 'x': '#9a9aa2'}
P5B = {'W': '#7a6e4e', 'w': '#4c4430', 'V': '#9c9068', 'u': '#2a261a', 'd': '#16120c', 'e': '#ff6a2a', 'O': '#ffa040', 'o': '#c05a1a', 'M': '#3a3426', 'N': '#5a5038', 'x': '#ffb050'}


def smog_body(c, opt, dx=0.0):
    """매연 덩이 사람꼴 (A 그을음 · B 누런 매연 — B는 머리 뒤로 매연 기둥이 날린다)"""
    D = lambda L: [(x + dx, y, r) for (x, y, r) in L]
    head = [(13.4, 10.6, 2.6), (16.6, 6.2, 2.4), (15.8, 8.8, 3.4), (18.6, 9.8, 2.8)]
    body = [(11.2, 14.6, 2.8), (19.2, 15.0, 2.6), (12.0, 18.6, 3.4), (17.2, 18.4, 3.4), (14.6, 21.6, 3.4), (12.4, 24.4, 3.2), (17.0, 24.2, 2.8)]
    if opt == 'A':
        tail = [(11.6, 28.8, 2.8), (10.2, 32.2, 2.2), (8.8, 35.2, 1.7), (7.6, 37.8, 1.3), (5.0, 39.0, 1.0)]
        curls = [[(12.4, 17.8), (13.8, 16.6), (15.6, 17.0)], [(15.0, 22.8), (16.4, 21.6), (18.0, 22.2)], [(10.8, 27.4), (12.2, 26.2), (13.8, 26.6)], [(14.4, 6.8), (15.8, 5.8)]]
        soot = [(4.4, 30.0), (22.0, 21.2), (21.0, 29.2), (4.0, 24.6), (23.0, 12.6)]
    else:
        tail = [(13.2, 28.6, 2.6), (12.8, 32.0, 2.0), (13.6, 35.0, 1.5), (12.6, 37.6, 1.1)]
        head = [(3.4, 2.2, 1.2), (6.0, 2.4, 1.7), (9.0, 3.4, 2.2), (11.8, 5.0, 2.6)] + head
        curls = [[(12.4, 17.8), (13.8, 16.6), (15.6, 17.0)], [(15.0, 22.8), (16.4, 21.6), (18.0, 22.2)], [(6.6, 3.0), (8.4, 2.2), (10.4, 2.8)]]
        soot = [(20.8, 28.6), (4.0, 7.0), (22.4, 21.0)]
    smog(c, D(tail + body + head), [[(x + dx, y) for (x, y) in p] for p in curls], [(x + dx, y) for (x, y) in soot])
    c.fill(ell(18.6 + dx, 10.4, 2.0, 1.6), 'd')                                                                   # 매연 속 어둠 (얼굴 자리)
    c.set(17.8 + dx, 10.2, 'e'); c.set(19.8 + dx, 10.4, 'e')                                                      # 두 눈 (떨어져)
    if opt == 'B':
        for (x, y, ch) in ((13.0, 20.0, 'O'), (16.6, 23.0, 'o'), (11.4, 25.6, 'O'), (18.0, 17.0, 'o'), (13.2, 31.0, 'o'), (8.8, 3.6, 'O'), (14.6, 15.6, 'O')): c.set(x + dx, y, ch)   # 속에서 깜빡이는 불티


def shade(opt):
    c = Cv(30, 40)
    smog_body(c, opt)
    return c


for opt, lab, desc, pal, wmap in (('A', 'A 그을음 매연 그림자', '길드장이 부려 놓은 그림자 분신 · 굴뚝 매연처럼 뭉게뭉게 피어오른 그을음 한 덩이로 지은 사람꼴(덩이 위 볼록 빛 · 안쪽 소용돌이) · 매연 속 어둠의 붉은 두 눈 · 아래는 그을음 줄기로 흩어지고 그을음 덩이가 떠돈다 · 그을음 단검', P5A, {'M': 'u', 'N': 'w', 'x': 'V'}),
                                  ('B', 'B 누런 매연 그림자', '길드장이 부려 놓은 그림자 분신 · 누렇게 찌든 매연 덩이 사람꼴 · 머리 뒤로 매연 기둥이 길게 날린다 · 속에서 깜빡이는 불티 · 주홍 두 눈 · 끝이 달아오른 매연 단검', P5B, {'M': 'u', 'N': 'w', 'x': 'x'})):
    B5.add('shadeclone' + ('' if opt == 'A' else '_b'), lab, desc, shade(opt), pal, (19, 15), 15, 24, pad=3, wpn='dagger', wmap=wmap, arm=['W', 'w'], hand='w', idle={'h': [2, 2], 'a': 30})
B5.dump()

# ═══════════ 6 ~ 8. 조직 두목 셋 (필드 우두머리 · ms 1.5) ═══════════
GY = 51


def legsB(c, xf, xn, top, w, far='p', near='P', boot='K', foot=3.4, bh=3.2):
    for (x, ch) in ((xf, far), (xn, near)):
        c.fill(rbox(x - w / 2, top, x + w / 2, GY - 1.6, 0.8), ch); c.fill(rbox(x - w / 2 - 0.6, GY - bh, x + w / 2 + foot, GY, 0.6), boot)


def flip(cv):
    d = Cv(cv.W, cv.H); d.g = [r[::-1] for r in cv.g]; return d


def comp_at(dst, src_, dx=0, dy=0):
    for y in range(src_.H):
        for x in range(src_.W):
            if src_.g[y][x] != '.': dst.set(x + dx, y + dy, src_.g[y][x])


def crown(c, x0, y0, w=6.0, tilt=0.0):
    """도둑맞은 금관: 띠 + 뾰족한 끝 셋 + 붉은 보석 (tilt = 오른쪽이 내려감)"""
    T = lambda x, y: (x, y + (x - x0) / w * tilt)
    c.fill(poly([T(x0, y0), T(x0 + w, y0), T(x0 + w, y0 + 1.6), T(x0, y0 + 1.6)]), 'G')
    for k in range(3):
        a = x0 + k * w / 3; c.fill(poly([T(a, y0 + 0.2), T(a + w / 6, y0 - 2.6), T(a + w / 3, y0 + 0.2)]), 'G')
    c.set(*T(x0 + w / 2, y0 + 0.8), 'r'); c.set(*T(x0 + 0.8, y0 + 0.8), 'g'); c.set(*T(x0 + w - 0.8, y0 + 0.8), 'g')


ACT6A = {'atk': ['pthrust', 'pswing'], 'skl': ['pspin'], 'tk': 1.2,
         'fx': {'atk': {'pal': 'steel', 'hit': 'pierce', 'big': 1}, 'skl': {'pal': 'coin', 'hit': 'slashes', 'big': 2, 'after': 'sparks', 'aoe': 'rats', 'shake': 2}}}
ACT6B = {'atk': ['qbite'], 'skl': ['sslam'], 'tk': 1.25,
         'fx': {'atk': {'pal': 'blood', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'blood', 'hit': 'bite', 'big': 2, 'after': 'dust', 'aoe': 'rats', 'shake': 3}}}
B6 = Batch('pass4_ratboss', 'ratking', ACT6A, 'sewer', 'dungeon', show=[['pthrust', 4], ['pspin', 4]], ms=1.5, mx=20, my=20)
B6.extra = head_js('ratlance', """
..x..
.xMx.
.xMx.
..MRR
..MRR
..M..
""", '깃발 단 왕홀 창 (쥐 기수 두목): 금빛 창날 · 쥐의 왕관 붉은 작은 깃발', L=8.5, shaft='g', below=4.0, fxw='lance')
P6A = {'F': '#7a6a5a', 'f': '#4e4236', 'O': '#d8a0a0', 'e': '#ff4a3a', 't': '#c8949a', 'H': '#5e5e66', 'h': '#3e3e46', 'R': '#9a2a34', 'G': '#e0b040', 'g': '#a8802a',
       'r': '#d02a3a', 'U': '#5a2a6a', 'u': '#3a1a46', 'Y': '#c8a070', 'P': '#3a3236', 'K': '#1a1416', 'k': '#140c0c', 'w': '#ffffff', 'M': '#e0c060', 'x': '#fff0b0'}
P6B = {'F': '#7a6a5a', 'f': '#4e4236', 'H': '#6a6a72', 'h': '#46464e', 'D': '#4a4038', 'd': '#2e2822', 'O': '#d8a0a0', 'e': '#ff4a3a', 't': '#d0989e', 'T': '#9a5a62',
       'G': '#e0b040', 'g': '#a8802a', 'r': '#d02a3a', 'k': '#140c0c', 'w': '#ffffff'}


def ratrider():
    c = Cv(54, 56)
    c.fill(tube([(9.0, 41.0), (4.6, 42.6), (2.0, 46.0), (2.6, 49.6), (6.4, 50.6)], [1.4, 1.2, 0.9, 0.6, 0.4]), 't')   # 큰 쥐 꼬리
    for x in (13.0, 33.0): c.fill(path([(x, 44.0), (x - 0.6, 48.0), (x, 50.4)], 1.6), 'f')                          # 먼 다리
    c.fill(ell(22.0, 40.4, 14.0, 6.6), 'F')                                                                         # 탈 쥐 몸
    for (x0, x1) in ((17.6, 16.6), (36.4, 37.6)):
        c.fill(path([(x0, 43.0), (x1, 47.4), (x1 + 0.4, 50.2)], 2.0, 1.7), 'F'); c.fill(ell(x1 + 1.6, 50.6, 2.0, 0.8), 'O')
    blunt(c.g, 'F', 'F', 'f', bottom=1, side=0)
    rathead(c, 39.6, 37.6, 1.5, F='F', f='f', O='O', eye='e')
    c.fill(rbox(15.0, 31.6, 28.0, 35.4, 0.8), 'R'); c.fill(poly([(16.0, 35.0), (27.4, 35.0), (26.4, 39.6), (17.0, 39.6)]), 'R')   # 붉은 안장 · 안장 천
    c.fill(thins([(17.0, 39.4), (26.4, 39.4)]), 'G'); c.fill(thins([(15.2, 31.6), (27.8, 31.6)]), 'G')
    c.fill(path([(19.0, 21.0), (17.4, 26.0), (19.6, 29.4)], 1.4), 'u'); c.fill(ell(20.2, 29.8, 1.2, 1.0), 'H')     # 고삐 쥔 먼 팔
    c.fill(thins([(20.6, 29.6), (30.0, 33.6), (37.0, 37.0)]), 'k')                                                  # 고삐
    c.fill(rbox(17.4, 19.0, 26.4, 32.0, 2.2), 'U')                                                                  # 훔친 보랏빛 외투
    blunt(c.g, 'U', 'U', 'u', bottom=1, side=0)
    c.fill(thins([(25.6, 20.6), (25.6, 31.0)]), 'G')                                                                # 금 테 앞섶
    c.fill(rbox(16.8, 17.8, 26.8, 20.6, 1.2), 'Y')                                                                  # 털 깃
    c.fill(path([(23.0, 31.6), (26.6, 33.4)], 1.8), 'P'); c.fill(path([(26.6, 33.4), (26.8, 38.4)], 1.6), 'P')      # 안장에 걸친 앞 다리
    c.fill(rbox(25.4, 38.2, 29.2, 40.6, 0.5), 'K')
    rathead(c, 23.6, 13.6, 1.55, F='H', f='h', O='O', eye='e')
    crown(c, 16.4, 6.6, 7.6, 1.6)                                                                                  # 비스듬히 얹은 큰 금관
    c.fill(ell(22.7, 7.7, 2.6, 2.8), 'H'); c.fill(ell(22.9, 8.0, 1.3, 1.5), 'O')                                    # 앞 귀 (관 앞으로)
    return c


def ratpile(mode):
    c = Cv(48, 42); gy = 40.0
    bob = {'idle0': 0, 'idle1': 0.6, 'bite': 0, 'squash': 2.4, 'stretch': -2.0}[mode]; sq = mode == 'squash'; st = mode == 'stretch'
    op = mode in ('bite', 'stretch')
    knot = (22.4, 33.6 + (0.8 if sq else 0))
    for (x0, y0) in ((8.6, 35.6), (12.0, 27.0), (35.0, 34.6), (34.0, 26.6), (19.6, 21.6)):                         # 가운데로 모여 엉킨 꼬리
        c.fill(tube(qb((x0, y0 + bob * 0.4), ((x0 + knot[0]) / 2, knot[1] + 2.4), knot, 6), [0.9] * 7), 't')
    def rat(bx, by, rx, ry, F, f, hx, hy, s, left=False, crowned=False):
        t = Cv(48, 42)
        t.fill(ell(bx if not left else 48 - bx, by, rx, ry), F)
        rathead(t, hx if not left else 48 - hx, hy, s, F=F, f=f, O='O', eye='e', open_=op)
        blunt(t.g, F, F, f, bottom=1, side=0)
        if crowned: crown(t, (hx if not left else 48 - hx) - 3.6, hy - 4.4, 5.4, 0.8)
        comp_at(c, flip(t) if left else t)
    y = lambda v: v + bob * (1 if v < 30 else 0.3)
    rat(16.4, y(27.4), 6.0, 3.2, 'D', 'd', 22.4, y(23.6), 0.95, left=True)
    rat(13.4, y(35.8), 7.0, 3.6, 'H', 'h', 19.6, y(34.6), 1.0, left=True)
    rat(30.6, y(26.6), 6.0, 3.2, 'H', 'h', 36.4, y(24.4), 1.0)
    rat(31.0, y(35.6), 7.0, 3.6, 'F', 'f', 37.6, y(34.0), 1.1)
    rat(22.8, y(19.6), 5.6, 4.0, 'F', 'f', 27.4, y(14.4) - (1.0 if st else 0), 1.25, crowned=True)
    c.fill(ell(knot[0], knot[1], 3.4, 2.6), 't')                                                                   # 꼬리 매듭
    for k in range(3): c.only(thins([(knot[0] - 2.4 + k * 1.6, knot[1] - 2.0), (knot[0] - 1.0 + k * 1.6, knot[1] + 2.0)]), 'T', 't')   # 꼬인 줄 (나란히)
    return c


fr = {m: ratpile(m) for m in ('idle0', 'idle1', 'bite', 'squash', 'stretch')}
B6.add('ratcrown', 'A 쥐 기수 두목', '쥐의 왕관 두목 · 붉은 안장을 얹은 큰 쥐를 탄 잿빛 쥐인간 · 비스듬히 얹은 도둑맞은 금관 · 훔친 보랏빛 외투와 털 깃 · 고삐 · 쥐의 왕관 붉은 깃발 단 금빛 왕홀 창으로 찌르고 쥐 떼를 부른다',
       ratrider(), P6A, (25, 20), 26, 31, wpn='ratlance', arm=['U', 'u'], hand='H', idle={'h': [1, 4], 'a': -70})
B6.add('ratcrown_b', 'B 쥐 떼 왕', '쥐의 왕관이 떠받드는 「쥐 떼 왕」 · 꼬리가 한 매듭으로 엉킨 쥐 다섯이 한 덩이로 움직인다 · 맨 위 쥐가 쓴 작은 금관 · 붉은 눈 · 한꺼번에 물어뜯고 쥐 떼를 쏟아낸다',
       [fr['idle0'], fr['idle1']], P6B, (42, 36), 24, gm={m: fr[m] for m in ('bite', 'squash', 'stretch')}, act=ACT6B, show=[['qbite', 4], ['sslam', 4]], noArm=1, still=1, wpn='none')
B6.dump()

ACT7A = {'atk': ['side', 'down'], 'skl': ['smash'], 'tk': 1.3,
         'fx': {'atk': {'pal': 'blood', 'hit': 'star', 'big': 2}, 'skl': {'pal': 'blood', 'hit': 'quake', 'big': 2, 'after': 'dust', 'aoe': 'slam', 'shake': 4}}}
ACT7B = {'atk': ['pthrust', 'pswing'], 'skl': ['pspin'], 'tk': 1.2,
         'fx': {'atk': {'pal': 'blood', 'hit': 'pierce', 'big': 1}, 'skl': {'pal': 'blood', 'hit': 'stun', 'big': 2, 'after': 'dust', 'aoe': 'lash', 'shake': 2}}}
B7 = Batch('pass4_redboss', 'enforcer', ACT7A, 'sewer', 'dungeon', show=[['side', 4], ['smash', 5]], ms=1.5, mx=20, my=20)
B7.extra = head_js('padlock', """
NNNNN
NxNNN
NNnNN
NNnNn
NNNnn
.N.N.
.NNN.
""", '큰 자물쇠 사슬 (붉은 팔 두목): 사슬 끝에 매단 사람 크기 자물쇠 (구멍은 세로 틈)', L=6.5, shaft='n', below=1.0, fxw='club') + head_js('mancatch', """
N...N
N...N
x...x
.N.N.
..N..
""", '사람 잡는 갈래창 (붉은 장갑 사냥꾼): 목을 걸어 잡는 U자 쇠 갈래 (가운데 날 없음)', L=8.5, shaft='j', below=4.0, fxw='lance')
P7A = {'S': '#c88a68', 's': '#9a6448', 'R': '#a82424', 'r': '#6a1414', 'b': '#2a201c', 'k': '#140c0c', 'Y': '#6a5440', 'y': '#46382a', 'N': '#8a9098', 'n': '#565c64', 'x': '#c8ccd4',
       'B': '#3a2a20', 'P': '#3a3236', 'p': '#2a2428', 'K': '#1a1416'}
P7B = {'C': '#6a2a26', 'c': '#461a18', 'Q': '#8a3a34', 'S': '#d0a080', 's': '#a07858', 'k': '#140c0c', 'D': '#2e2626', 'Y': '#8a7058', 'y': '#5e4a3a', 'J': '#6a4a30', 'j': '#46301e',
       'W': '#e8e0d0', 'w': '#b8b0a0', 'r': '#d03030', 'B': '#2e2420', 'P': '#3a3236', 'p': '#2a2428', 'K': '#1a1416'}


def redbrute():
    c = Cv(52, 56)
    legsB(c, 19.0, 28.6, 38.0, 6.4)
    c.fill(path([(13.4, 20.4), (10.6, 27.0)], 3.0, 2.8), 'S'); c.fill(path([(10.6, 27.0), (10.4, 32.6)], 2.8, 2.6), 'R')   # 붉게 물든 먼 팔
    c.fill(rbox(6.8, 31.8, 14.2, 38.4, 1.6), 'R')
    c.fill(rbox(13.4, 16.4, 35.6, 37.6, 3.0), 'S')                                                                  # 맨 가슴 덩치
    blunt(c.g, 'S', 'S', 's', bottom=1, side=0)
    c.only(thins([(16.6, 24.6), (21.0, 26.0), (25.4, 25.0)]), 's', 'S')                                              # 가슴 근육 줄
    for k in range(17):                                                                                             # 앞 어깨에서 먼 허리로 비스듬히 감은 사슬 (하나만)
        x, y = 32.6 - k * 1.05, 17.6 + k * 1.0; c.set(x, y, 'N' if k % 2 == 0 else 'n'); c.set(x + 0.8, y, 'n' if k % 2 == 0 else 'N')
    c.fill(rbox(13.2, 33.4, 35.8, 37.0, 0.6), 'B')
    for x in (16.0, 24.4, 32.6): c.set(x, 35.2, 'N')                                                                # 허리띠 징
    c.fill(rbox(14.0, 36.6, 34.6, 40.4, 0.8), 'P')
    mant = poly([(10.6, 15.6), (37.8, 15.6), (38.6, 20.4), (35.0, 22.0), (31.6, 20.6), (27.4, 22.4), (22.6, 20.8), (18.0, 22.4), (14.0, 20.6), (10.0, 21.6)])
    c.fill(mant, 'Y')                                                                                               # 털 어깨 망토
    for x in (13.0, 17.6, 22.4, 27.0, 31.6, 36.0): c.only(thins([(x, 16.6), (x - 0.6, 20.4)]), 'y', 'Y')
    c.fill(rbox(20.0, 3.8, 30.6, 15.8, 3.2), 'S')                                                                   # 큰 민머리
    c.fill(box(30.8, 8.6, 31.6, 10.2), 'S')                                                                         # 코
    c.fill(thins([(25.6, 7.2), (30.2, 7.2)]), 's'); c.fill(box(27.6, 8.4, 28.4, 8.8), 'k')                           # 눈두덩 · 작은 눈
    c.fill(box(22.2, 8.0, 23.2, 10.6), 's')                                                                         # 귀
    c.fill(poly([(21.2, 11.0), (31.2, 10.6), (31.0, 16.4), (26.8, 18.8), (22.0, 16.6)]), 'b')                        # 덥수룩한 검은 수염
    c.fill(thins([(26.6, 5.2), (28.8, 10.0)]), 'r')                                                                 # 흉터
    return c


def redhunter():
    c = Cv(52, 56)
    legsB(c, 19.6, 28.0, 36.0, 5.4, bh=7.4)
    coat = poly([(14.6, 17.0), (33.8, 17.0), (35.4, 38.0), (29.8, 40.0), (27.6, 33.6), (22.4, 33.6), (20.6, 40.0), (13.4, 38.0)])
    c.fill(coat, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                                  # 무릎 위 검붉은 사냥 외투 (앞 트임)
    c.fill(rbox(14.2, 27.6, 34.4, 29.2, 0.4), 'B')
    for x in (16.4, 19.6): c.fill(rbox(x, 29.0, x + 2.2, 31.6, 0.4), 'j')                                           # 허리 주머니
    horn = poly([(30.6, 29.2), (35.0, 29.8), (36.0, 32.8), (34.6, 33.2), (33.6, 31.0), (30.6, 30.6)]); c.fill(horn, 'W'); c.only(thins([(31.0, 30.2), (34.2, 30.6)]), 'w', 'W')   # 상아 뿔피리
    cape = poly([(12.6, 15.6), (35.4, 15.6), (36.0, 21.4), (31.6, 22.6), (27.0, 21.2), (22.6, 22.8), (18.0, 21.0), (13.0, 22.6)])
    c.fill(cape, 'Y'); [c.only(thins([(x, 16.6), (x - 0.6, 21.0)]), 'y', 'Y') for x in (15.6, 20.4, 25.2, 30.0, 34.0)]   # 털 어깨 망토
    c.fill(path([(16.6, 19.6), (14.6, 25.0), (15.6, 29.4)], 1.8), 'c'); c.fill(ell(15.8, 30.0, 1.4, 1.2), 'r')       # 먼 팔 · 붉은 장갑
    c.fill(rbox(21.0, 6.6, 30.0, 16.4, 2.8), 'S')                                                                   # 얼굴
    c.fill(poly([(18.4, 12.0), (19.6, 5.6), (23.4, 2.8), (28.6, 3.0), (31.4, 6.8), (30.6, 8.0), (24.0, 7.6), (23.2, 15.6), (18.6, 15.6)]), 'C')   # 두건
    c.fill(thins([(23.4, 7.6), (30.8, 7.8)]) | thins([(23.2, 8.0), (22.8, 15.0)]), 'Y')                              # 두건 털 테
    c.fill(box(27.2, 10.0, 28.2, 10.4), 'k'); c.fill(thins([(26.6, 9.0), (28.8, 9.2)]), 's')
    c.fill(poly([(24.0, 12.4), (30.6, 12.2), (30.4, 16.4), (24.4, 16.6)]), 'D')                                      # 입을 가린 천
    return c


B7.add('redhand', 'A 붉은 팔 사슬잡이', '붉은 손 형제단 두목 · 큰 민머리와 덥수룩한 검은 수염 · 흉터 · 털 어깨 망토 · 맨 가슴에 비스듬히 감은 사슬 하나 · 팔꿈치까지 붉게 물든 두 팔 · 사슬 끝의 큰 자물쇠를 휘둘러 내리찍는다',
       redbrute(), P7A, (34, 21), 24, 36, wpn='padlock', arm=['S', 'R'], hand='R', idle={'h': [1, 4], 'a': 78})
B7.add('redhand_b', 'B 붉은 장갑 사냥꾼', '붉은 손 형제단 두목 · 털 테 두른 두건과 입을 가린 천 · 털 어깨 망토 · 무릎 위 검붉은 사냥 외투와 긴 장화 · 붉은 장갑 · 허리의 상아 뿔피리 · 사람의 목을 걸어 잡는 U자 갈래창으로 찌르고 걸어 넘어뜨린다',
       redhunter(), P7B, (32, 20), 24, 36, wpn='mancatch', arm=['C', 'c'], hand='r', idle={'h': [1, 4], 'a': -72}, act=ACT7B, show=[['pthrust', 4], ['pspin', 4]])
B7.dump()

ACT8A = {'atk': ['spush', 'sjab'], 'mag': ['sraise'], 'skl': ['scharge'], 'tk': 1.2,
         'fx': {'atk': {'pal': 'coin', 'hit': 'star', 'big': 1}, 'mag': {'pal': 'coin', 'hit': 'coins', 'p': 'orb'}, 'skl': {'pal': 'coin', 'hit': 'coins', 'big': 2, 'after': 'sparks', 'aoe': 'meteor', 'shake': 2}}}
ACT8B = {'atk': ['side', 'down'], 'skl': ['smash'], 'tk': 1.3,
         'fx': {'atk': {'pal': 'steel', 'hit': 'star', 'big': 2}, 'skl': {'pal': 'steel', 'hit': 'quake', 'big': 2, 'after': 'dust', 'aoe': 'slam', 'shake': 4}}}
B8 = Batch('pass4_greyboss', 'officer', ACT8A, 'sewer', 'dungeon', show=[['sjab', 4], ['scharge', 6]], ms=1.5, mx=20, my=20)
B8.extra = head_js('lanternst', """
NNN
NYN
NYN
NNN
.N.
""", '등불 지팡이 (장부지기): 긴 지팡이 끝에 매단 놋쇠 등불', L=8.0, shaft='b', below=4.0, fxw='staff') + head_js('bighook', """
NN..
..N.
..N.
..N.
.NN.
""", '큰 짐 갈고리 (금고지기): 긴 자루 끝의 큰 쇠갈고리', L=6.5, shaft='b', below=3.0, fxw='axe')
P8A = {'C': '#5e5e66', 'c': '#3e3e46', 'Q': '#7e7e88', 'Y': '#b8b4ac', 'y': '#8a867e', 'S': '#d8b098', 's': '#a88068', 'W': '#e8e4dc', 'w': '#b8b4ac', 'G': '#d8b040', 'g': '#9a7a28',
       'L': '#46464c', 'l': '#2e2e34', 'N': '#a08850', 'Y2': '#ffd060', 'b': '#3a2a20', 'n': '#565c64', 'k': '#140c0c', 'P': '#3a3a40', 'K': '#1a1418'}
P8A['Y'] = '#ffd060'; P8A['V'] = '#b8b4ac'; P8A['v'] = '#8a867e'; del P8A['Y2']
P8B = {'C': '#5a5a60', 'c': '#3a3a40', 'Q': '#7a7a82', 'S': '#c89a78', 's': '#9a6e52', 'N': '#6a6e76', 'n': '#3e424a', 'x': '#9aa0aa', 'e': '#ffd040', 'k': '#140c0c',
       'b': '#3a2a20', 'P': '#34343a', 'K': '#1a1418', 'G': '#d8b040'}


def ledgerkeeper():
    c = Cv(52, 56)
    legsB(c, 19.4, 28.0, 38.0, 5.4)
    book = rbox(5.0, 22.0, 14.6, 35.0, 0.6)                                                                        # 먼 손목에 사슬로 맨 큰 잿빛 장부
    c.fill(book, 'L'); c.fill(box(13.6, 22.6, 14.6, 34.4), 'W'); c.fill(edge(book) - box(13.6, 22.6, 14.6, 34.4), 'l')
    for (x, y) in ((5.4, 22.4), (5.4, 34.6), (12.8, 22.4), (12.8, 34.6)): c.set(x, y, 'G')                         # 놋쇠 모서리
    c.fill(rbox(7.6, 27.4, 9.6, 29.8, 0.4), 'G')                                                                   # 잠금쇠
    coat = poly([(13.6, 16.4), (34.6, 16.4), (36.8, 45.0), (11.4, 45.0)])
    c.fill(coat, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                                 # 잿빛 긴 외투
    c.only(thins([(31.0, 19.0), (32.4, 44.6)]), 'c', 'CQ')
    for y in (23.0, 27.0, 31.0): c.set(29.8, y, 'G')                                                               # 금단추
    c.fill(path([(14.0, 19.4), (11.8, 25.0), (12.6, 28.4)], 2.2), 'c'); c.fill(ell(12.8, 29.0, 1.4, 1.2), 'S')        # 장부를 받친 먼 팔
    for k in range(4): c.set(12.4 - k * 0.2, 30.4 + k, 'n' if k % 2 else 'G')                                       # 손목 사슬
    c.fill(rbox(12.8, 14.6, 35.6, 19.6, 2.0), 'V'); c.only(thins([(13.4, 19.0), (35.0, 19.0)]), 'v', 'V')            # 털 깃
    c.fill(rbox(20.6, 4.0, 30.2, 15.4, 3.0), 'S')                                                                  # 벗어진 머리
    c.fill(box(30.4, 8.8, 31.2, 10.2), 'S')
    c.fill(poly([(21.0, 7.6), (24.4, 8.0), (25.0, 15.4), (21.4, 15.0)]), 'W')                                       # 흰 구레나룻
    for x in (26.8, 29.4): c.fill(ell(x, 9.4, 1.1, 1.0) - {(int(x), 9)}, 'G')                                       # 둥근 안경
    c.fill(thins([(26.4, 13.2), (29.8, 13.0)]), 's')
    return c


def vaultguard():
    c = Cv(52, 56)
    legsB(c, 19.0, 28.6, 38.0, 6.6)
    box_ = rbox(3.6, 11.0, 14.6, 31.0, 0.8)                                                                        # 등에 진 쇠 금고
    c.fill(box_, 'N'); c.fill(edge(box_), 'n')
    for y in (17.0, 25.0): c.only(thins([(4.2, y), (14.0, y)]), 'n', 'N')                                           # 쇠 띠 (가로만)
    for (x, y) in ((5.0, 12.4), (13.2, 12.4), (5.0, 29.6), (13.2, 29.6)): c.set(x, y, 'x')                          # 모서리 리벳
    c.fill(rbox(6.8, 19.4, 9.4, 22.4, 0.4), 'G')                                                                   # 금고 자물쇠
    c.fill(path([(13.4, 20.4), (10.8, 27.0), (11.0, 33.0)], 3.0, 2.7), 'c'); c.fill(rbox(7.4, 32.4, 14.4, 38.6, 1.6), 'S')   # 먼 팔
    c.fill(rbox(13.4, 16.0, 35.8, 38.0, 3.0), 'C')                                                                 # 덩치 큰 잿빛 누빈 외투
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    for y in (22.0, 27.0, 32.0): c.only(thins([(14.0, y), (35.0, y)]), 'c', 'CQ')                                   # 누빈 줄 (가로만)
    for k in range(16):                                                                                            # 금고를 맨 사슬 (어깨에서 허리로 하나)
        x, y = 33.0 - k * 1.1, 17.2 + k * 1.0; c.set(x, y, 'N' if k % 2 == 0 else 'n')
    c.fill(rbox(13.2, 34.0, 36.0, 37.2, 0.6), 'b')
    c.fill(rbox(20.6, 5.2, 30.4, 16.0, 3.0), 'S')                                                                  # 머리
    c.fill(rbox(20.0, 3.4, 31.0, 10.8, 3.0), 'N'); c.only(thins([(20.4, 4.4), (30.6, 4.4)]), 'x', 'N')              # 쇠 반투구
    c.fill(box(25.6, 8.2, 30.8, 9.0), 'k'); c.fill(box(27.6, 8.4, 28.2, 8.8), 'e'); c.fill(box(29.4, 8.4, 30.0, 8.8), 'e')   # 가로 눈 틈 (노란 눈빛)
    c.fill(box(31.0, 11.2, 31.6, 12.6), 'S'); c.only(box(24.6, 13.4, 30.0, 16.0), 's', 'S')                          # 코 · 거친 턱
    return c


B8.add('greyledger', 'A 장부지기', '잿빛 장부 두목 · 벗어진 머리와 흰 구레나룻 · 둥근 안경 · 털 깃 단 잿빛 긴 외투와 금단추 · 먼 손목에 사슬로 맨 큰 잿빛 장부(놋쇠 모서리 · 잠금쇠) · 놋쇠 등불 지팡이로 찌르고 금화를 쏟아붓는다',
       ledgerkeeper(), P8A, (33, 20), 24, 36, wpn='lanternst', arm=['C', 'c'], hand='S', idle={'h': [1, 4], 'a': -72})
B8.add('greyledger_b', 'B 금고지기', '잿빛 장부 두목 · 쇠 반투구의 가로 눈 틈에 노란 눈빛 · 덩치 큰 잿빛 누빈 외투 · 등에 사슬로 진 쇠 금고(자물쇠 · 리벳) · 큰 짐 갈고리로 걸어 내리찍는다',
       vaultguard(), P8B, (34, 21), 24, 36, wpn='bighook', arm=['C', 'c'], hand='S', idle={'h': [1, 4], 'a': 70}, act=ACT8B, show=[['side', 4], ['smash', 5]])
B8.dump()

# ═══════════ 9. 길드장 검은 두건 (본체 · 던전 「암살자 길드 본부」 주인 · ms 1.5) ═══════════
ACT9 = {'atk': ['thrust', 'hack', 'side'], 'skl': ['jstab'], 'tk': 1.35,
        'fx': {'atk': {'pal': 'shadow', 'hit': 'slashes', 'big': 1}, 'skl': {'pal': 'shadow', 'hit': 'slashes', 'big': 2, 'after': 'smoke', 'aoe': 'blades', 'shake': 2}}}
B9 = Batch('pass4_guild', 'blackhood', ACT9, 'alley', 'dungeon', show=[['hack', 4], ['jstab', 5]], ms=1.5, mx=20, my=20)
P9 = {'H': '#1e1a26', 'h': '#100e16', 'C': '#24202c', 'c': '#14121a', 'Q': '#3a3446', 'K': '#06050a', 'e': '#ff3a3a', 'r': '#8a1a24', 'R': '#b02a36', 'M': '#c8ccd8', 'x': '#f4f6fa',
      'N': '#8a90a0', 'G': '#d8b040', 'g': '#9a7a28', 'P': '#1c1a22', 'p': '#121016', 'k': '#0a080c', 'S': '#c8a080',
      'W': '#4e4e54', 'w': '#2c2c32', 'V': '#727278', 'u': '#141418', 'd': '#0a0a0c', 'T': '#6ad050', 't': '#3a8a30', 'Y': '#b8f070', 'b': '#6a4a30'}


def guildmaster(pat=0):
    """검은 두건 본체 (A 확정) · pat 1 = 「그림자 분신」 등 뒤 매연 분신 · pat 2 = 「독 안개」 독 약병 띠 · 발밑 독 안개"""
    c = Cv(52, 58)
    if pat == 1:                                                                                                   # 등 뒤에 선 매연 분신 (B를 패턴으로)
        smog(c, [(6.0, 45.0, 1.2), (8.6, 42.4, 1.8), (7.0, 38.6, 2.4), (10.6, 34.0, 2.8), (7.6, 31.0, 3.2), (12.4, 25.6, 3.4), (8.2, 24.6, 3.8),
                 (13.6, 17.6, 3.6), (9.2, 18.0, 4.0), (9.0, 10.4, 2.6), (14.4, 9.2, 3.0), (11.6, 7.4, 3.6), (12.6, 4.6, 2.2)],
             [[(8.0, 20.0), (9.6, 18.8), (11.4, 19.4)], [(7.4, 28.6), (9.0, 27.4), (10.6, 28.0)], [(10.0, 6.4), (11.6, 5.4)]], [(3.0, 27.0), (2.6, 37.6), (4.4, 47.0)])
        c.fill(ell(14.4, 10.2, 1.8, 1.3), 'd'); c.set(13.6, 10.0, 'e'); c.set(15.6, 10.2, 'e')
    tails = poly([(14.0, 18.0), (20.0, 18.0), (18.0, 38.0), (14.6, 50.0), (8.6, 49.0), (9.6, 36.0)])                 # 뒤로 펄럭이는 외투 자락 (붉은 안감)
    c.fill(tails, 'C'); c.fill(poly([(11.6, 40.0), (15.4, 40.6), (14.0, 49.4), (10.0, 48.6)]), 'R')
    legsB(c, 20.0, 27.8, 37.6, 5.0, bh=6.0)
    c.fill(poly([(15.6, 17.0), (33.6, 17.0), (35.0, 31.0), (33.6, 44.0), (29.4, 44.0), (28.0, 36.0), (22.0, 36.0), (20.4, 44.0), (14.6, 44.0), (13.6, 31.0)]), 'C')   # 긴 검은 외투
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(thins([(33.2, 18.0), (34.4, 30.6), (33.2, 43.6)]), 'r')                                                 # 앞섶 붉은 안감
    c.fill(path([(16.6, 19.0), (14.8, 25.0), (15.8, 30.0)], 1.8), 'c'); c.fill(ell(16.0, 30.6, 1.3, 1.1), 'K')      # 먼 팔
    for k in range(10): c.set(31.0 - k * 1.3, 19.0 + k * 1.2, 'c')                                                  # 비스듬한 띠
    if pat == 2:
        for k in (1, 4, 7): x, y = 31.0 - k * 1.3, 19.0 + k * 1.2; c.fill(rbox(x - 0.6, y - 2.4, x + 0.6, y - 0.4, 0.2), 'T'); c.set(x, y - 2.8, 'b')   # 띠에 꽂은 초록 독 약병 셋
        c.fill(rbox(15.0, 31.0, 17.4, 34.2, 0.4), 'T'); c.set(16.2, 30.6, 'b'); c.set(15.4, 31.6, 'Y')              # 먼 손에 쥔 던질 약병
        for (x, y, rx, ry) in ((16.0, 49.6, 3.0, 1.2), (24.0, 50.4, 3.6, 1.0), (32.0, 49.8, 3.0, 1.2), (20.0, 46.8, 1.6, 0.8), (29.6, 47.0, 1.4, 0.7), (11.6, 47.6, 1.6, 0.8)):
            c.fill(ell(x, y, rx, ry), 't'); c.fill(ell(x - 0.4, y - 0.3, rx * 0.5, ry * 0.5), 'T')                 # 발밑에 감도는 독 안개
    else:
        for k in (2, 5, 8): x, y = 31.0 - k * 1.3, 19.0 + k * 1.2; c.fill(thin((x, y - 1.0), (x + 0.6, y - 2.0)), 'M')   # 띠에 꽂은 던지는 칼 손잡이
    c.fill(ell(25.4, 23.0, 1.6, 0.9), 'M'); c.set(25.0, 22.8, 'x')                                                 # 은빛 길드 문장 (둥근 브로치)
    hood = rbox(19.6, 3.0, 30.8, 16.0, 4.2) | poly([(17.0, 7.0), (21.0, 4.0), (21.6, 12.0)])                      # 큰 검은 두건 (뒤로 뾰족)
    c.fill(hood, 'H')
    c.fill(rbox(23.4, 6.8, 30.6, 14.2, 1.6), 'K')                                                                  # 두건 속 어둠
    c.set(25.8, 10.0, 'e'); c.set(28.6, 10.0, 'e')                                                                 # 붉은 두 눈
    c.only(thins([(20.4, 6.0), (24.0, 3.4)]), 'h', 'H')
    if pat != 2:
        for (x, y) in ((12.0, 50.4), (18.4, 51.0), (31.4, 51.0)): c.fill(path([(x, y), (x - 1.6, y - 1.0), (x - 2.6, y - 0.4)], 0.6, 0.3), 'w')   # 발밑 그림자 자락
    return c


for key, lab, desc in (
        ('guildmaster', 'A 검은 두건 (본체 · 확정)', '암살자 길드 본부의 진짜 길드장 · 얼굴을 삼킨 큰 검은 두건 속 붉은 두 눈 · 붉은 안감이 펄럭이는 긴 검은 외투 · 던지는 칼을 꽂은 비스듬한 띠 · 은빛 둥근 길드 문장 · 발밑 그림자 자락 · 물결 단검'),
        ('guildmaster_p1', '패턴 1 「그림자 분신」 (HP 50%)', 'B를 패턴으로: HP가 절반 아래로 떨어지면 발밑 그림자에서 매연 그림자 분신 둘을 부르고, 등 뒤에 매연 분신이 붙어 서서 길드장이 벨 때마다 한 번 더 따라 벤다(피해 절반)'),
        ('guildmaster_p2', '패턴 2 「독 안개」 (HP 25%)', 'C를 패턴으로: HP가 4분의 1 아래로 떨어지면 띠의 칼을 초록 독 약병으로 바꿔 쥐고 파티에게 던진다 — 깨진 자리마다 초록 독 안개가 피어 맹독 · 눈멂을 건다 · 발밑에도 독 안개가 감돈다')):
    B9.add(key, lab, desc, guildmaster({'guildmaster': 0, 'guildmaster_p1': 1, 'guildmaster_p2': 2}[key]), P9, (32, 20), 24, 36, wpn='kris', arm=['C', 'c'], hand='K', idle={'h': [2, 3], 'a': 20})
B9.dump()
