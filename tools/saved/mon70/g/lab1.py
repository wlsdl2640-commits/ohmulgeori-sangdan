"""지하미궁 B1 ~ B10 「돌 미로」(Lv150 ~ 155) 몬스터 시안 — 11-18 09:19 사용자 「… 넣고 다음 ㄱㄱ」
계획 문서 「하르겐 지하」 지하미궁 표 + 11-14 · 11-17 답(다시 묻지 말 것): 한 층 = 한 스테이지 · 층마다 보스(보스 100 — 다 새 그림) · 킹슬라임 B10 ·
일반 몬스터는 「섞어서」(있는 몬스터의 미궁 변종 — 이름 · 색 · 스킬 — 과 새 그림을 섞는다) · 늘 B1부터.
첫째 묶음(이 파일): 일반 셋 + 층 보스 B1 · B9(무대 주인 「미궁 문지기」 — B10이 킹슬라임이라 한 층 앞으로, 계획 문서 제안). B2 ~ B8은 다음 묶음.
- 미궁 쥐: A 들쥐 미궁 변종 · B 하수도 쥐떼 미궁 변종 (그림은 그대로, 돌가루 털 · 흰 눈 — mon.col)
- 길 잃은 모험가의 망령: A 등불 망령(두건 · 손 등불) · B 지도 망령(찢어진 지도 · 부러진 칼) — 아래가 흩어지는 넋(떠 있음)
- 돌 파수꾼: A 미궁 벽돌 파수꾼(벽돌 몸 · 가로 눈 틈 · 가슴에 새긴 아치 문) · B 돌 골렘 미궁 변종(산 골렘 몸 · 가슴 금은 한 줄 · 푸른 미로 빛)
- B1 잃어버린 탐험대장: A 깃발 대장(탐험대 깃발 창 · 깃털 투구) · B 등불 대장(녹슨 대검 · 허리 등불 · 찢어진 망토)
- B9 미궁 문지기: A 문짝 방패 문지기(돌 문짝 방패 · 열쇠 미늘창 · 가슴의 빛나는 열쇠 구멍) · B 열쇠 구멍 문지기(몸을 꿰뚫은 큰 열쇠 구멍 · 큰 열쇠 칼) — 둘 다 머리는 성가퀴 얹은 성문 탑
피한 것: 흰 옷 · 너울(망령은 청록 가죽 · 두건) · 후광 · 십자(나침반 별 · 십자 창살 · 칼자루 십자 — 깃발 무늬는 줄무늬, 문짝 쇠 띠는 가로만) · 유명한 미노타우로스 · 유명한 두 얼굴 신상
python3 lab1.py → ../t/lab1_*.json"""
from kit import *

T_BASE = json.load(open(T / 'px_base_lab1.json'))   # 게임 그림 (변종의 바탕 — scratchpad v91 dumppx.js로 뽑음)


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


def wisp_tail(c, p0, p1, p2, r0, ch='C', lite='W', dim='w', cut=(0.55, 0.78)):
    """넋 꼬리: 허리에서 아래 뒤로 휘며 가늘어지는 줄기 · 끝쪽은 옅은 색 · 두 군데 끊긴 틈(떨어진 덩이는 2칸 이상)"""
    pts = qb(p0, p1, p2, 12); rs = lerp_r([r0, r0 * 0.75, r0 * 0.45, 0.6], 12)
    n = len(pts)
    for i in range(n - 1):
        u = i / (n - 1)
        if any(abs(u - k) < 0.035 for k in cut): continue
        seg = tube(pts[i:i + 2], rs[i:i + 2])
        c.fill(seg, ch if u < 0.45 else lite if u < 0.75 else dim)
    return pts


def brick_band(c, x0, y0, x1, y1, ch, mortar, row=3, w=4):
    """벽돌 무늬: 가로 줄 + 줄마다 엇갈린 세로 이음 (T자만 — 십자 이음이 없게)"""
    for y in range(int(y0) + row, int(y1), row):
        c.only(box(x0, y, x1, y), mortar, ch)
    for j, y in enumerate(range(int(y0), int(y1), row)):
        for x in range(int(x0) + (j % 2) * (w // 2) + 1, int(x1), w):
            c.only(box(x, y + 1, x, min(y + row - 1, y1)), mortar, ch)


# ═══════════ 1. 미궁 쥐 — 미궁 변종 (그림 그대로 · 몸 색 · 눈) ═══════════
def variant(B, key, base, lab, desc, col, pal_over, act=None):
    src = dict(T_BASE[base]); act0 = src.pop('_act'); src.pop('_mon')
    e = dict(src); e['pal'] = dict(src.get('pal', {})); e['pal'].update(pal_over)
    e.update(act=act or act0, mon={'base': base, 'col': col}, label=lab, desc=desc, field=B.field, area=B.area, show=B.show)
    B.D[key] = e
    return e


B1 = Batch('lab1_rat', 'rat', None, 'passage', show=[['qbite', 4], ['qpounce', 5]])
variant(B1, 'mazerat', 'rat', 'A 미궁 쥐 (들쥐 변종)', '돌 미로에 사는 들쥐 · 벽에서 갈려 나온 돌가루에 털이 잿빛으로 굳었다 · 빛을 못 봐 하얗게 흐려진 눈 · 앞니로 돌을 갉는다(그림은 평원 들쥐 그대로 · 색만)',
        {'body': '#8c877c', 'dark': '#55514a', 'skin': '#d8cfc6'}, {'K': '#f2f4ff'})
variant(B1, 'mazerat_b', 'sewerrat', 'B 미궁 쥐 떼 (하수도 쥐떼 변종)', '미궁 벽 틈에서 쏟아져 나오는 쥐 떼 · 잿빛 돌가루 털 · 흰 눈 · 무리로 덮쳐 갉는다(그림은 하수도 쥐떼 그대로 · 색만)',
        {'body': '#7c776c', 'dark': '#48443c', 'skin': '#cfc4b8'}, {'K': '#f2f4ff'})
B1.dump()

# ═══════════ 2. 길 잃은 모험가의 망령 ═══════════
ACT2A = {'atk': ['spush', 'sjab'], 'mag': ['sraise'], 'skl': ['scharge'], 'tk': 1.0,
         'fx': {'atk': {'pal': 'water', 'hit': 'burst'}, 'mag': {'pal': 'water', 'hit': 'burst', 'p': 'orb'}, 'skl': {'pal': 'water', 'hit': 'burst', 'p': 'orb', 'big': 1, 'after': 'bubbles'}}}
ACT2B = {'atk': ['down', 'side', 'thrust'], 'skl': ['jstab'], 'tk': 1.0,
         'fx': {'atk': {'pal': 'steel', 'hit': 'star'}, 'skl': {'pal': 'water', 'hit': 'slashes', 'big': 1, 'after': 'bubbles'}}}
B2 = Batch('lab1_ghost', 'wraith', ACT2A, 'passage', show=[['spush', 4], ['scharge', 6]], ms=1.0, float=1)
B2.extra = head_js('ghostlamp', """
.GG.
GLLG
GllG
.GG.
""", '모험가의 손 등불 (길 잃은 모험가의 망령 A): 넋불이 든 작은 쇠 등불', L=3.0, shaft='g', below=0.5, fxw='staff') + head_js('brokensword', """
N.
NN
.N
.N
""", '부러진 칼 (길 잃은 모험가의 망령 B): 반쯤 부러진 날', L=3.5, shaft='N', below=1.5, fxw='sword')
PG = {'C': '#3e7c7a', 'Q': '#6ab8b0', 'c': '#2a5458', 'd': '#18343a', 'H': '#2e5e64', 'h': '#1c3e44', 'K': '#0a1416', 'E': '#e8fff4',
      'B': '#4e5a46', 'b': '#343c30', 'W': '#7ad0c4', 'w': '#4a9a96', 'G': '#a8905a', 'g': '#6e5c38', 'L': '#e8fff0', 'l': '#8af0d8',
      'P': '#b8ac84', 'p': '#857a58', 'N': '#8a9298', 'n': '#5a6066'}


def lostsoul(opt):
    c = Cv(28, 40)
    wisp_tail(c, (13.0, 24.0), (10.0, 31.0), (4.4, 36.0), 4.2)                                                  # 아래로 흩어지는 넋
    c.fill(path([(11.4, 14.6), (10.0, 19.0), (10.4, 22.6)], 1.2), 'c'); c.fill(ell(10.6, 23.0, 1.2, 1.0), 'c')   # 먼 팔 (늘어뜨림)
    torso = poly([(10.6, 13.4), (17.0, 12.6), (19.4, 15.6), (19.0, 21.4), (17.6, 25.4), (10.6, 25.6), (9.4, 20.0)])
    c.fill(torso, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(thins([(11.4, 13.8), (17.8, 21.4)]), 'b')                                                          # 어깨끈 (가죽)
    c.fill(box(10.0, 21.6, 19.0, 22.4), 'B'); c.fill(rbox(16.6, 21.2, 18.6, 23.4, 0.4), 'b')                     # 허리띠 · 주머니
    c.fill(poly([(11.0, 9.0), (13.6, 4.4), (18.6, 4.6), (21.0, 8.6), (20.4, 13.4), (12.6, 14.4)]), 'H')         # 두건
    c.fill(poly([(12.0, 12.6), (9.4, 15.0), (11.6, 16.0), (14.0, 14.4)]), 'H')                                  # 두건 자락 (뒤)
    blunt(c.g, 'H', 'C', 'h', bottom=1, side=0, top=1)
    c.fill(poly([(17.0, 7.6), (20.6, 7.8), (20.2, 12.4), (17.0, 12.2)]), 'K')                                   # 두건 속 어둠
    eyes(c, [(18.6, 9.2)], 'E')                                                                              # 넋불 눈
    if opt == 'B':
        c.fill(poly([(7.6, 16.2), (11.6, 15.0), (12.6, 19.4), (8.4, 20.6)]), 'P')                               # 먼 손에 쥔 찢어진 지도
        c.fill(thins([(8.4, 17.6), (11.4, 16.8)]), 'p'); c.set(9.0, 19.6, 'p'); c.set(11.8, 15.4, '_')
        c.fill(ell(9.6, 20.2, 1.0, 0.9), 'c')
        c.fill(poly([(12.0, 4.8), (14.6, 2.4), (17.0, 4.6)]), 'h')                                               # 찢긴 두건 끝
    for (x, y) in ((3.0, 30.0), (6.6, 38.4)): c.fill(box(x, y, x + 1, y), 'w')                               # 떠도는 넋 조각 (2칸)
    return c


for opt, lab, desc, wpn, act in (('A', 'A 등불 망령', '돌 미로에서 길을 잃고 죽은 모험가의 넋 · 청록 가죽옷과 두건 · 두건 속 어둠에 넋불 눈 하나 · 손에 든 작은 쇠 등불에 아직 넋불이 탄다 · 허리 아래는 넋 줄기로 흩어진다 · 등불을 휘두르고 넋불을 던진다', 'ghostlamp', ACT2A),
                                 ('B', 'B 지도 망령', '끝내 출구를 찾지 못한 모험가의 넋 · 먼 손에 찢어진 미궁 지도를 쥐고 · 앞 손에는 반쯤 부러진 칼 · 찢긴 두건 · 허리 아래는 넋 줄기', 'brokensword', ACT2B)):
    B2.add('lostsoul' + ('' if opt == 'A' else '_b'), lab, desc, lostsoul(opt), PG, (17, 15), 14, 23, pad=3, wpn=wpn, arm=['C', 'c'], hand='Q', act=act,
           idle={'h': [2, 2], 'a': 70 if opt == 'A' else -30}, show=[['spush', 4], ['scharge', 6]] if opt == 'A' else [['down', 4], ['jstab', 5]])
B2.dump()

# ═══════════ 3. 돌 파수꾼 ═══════════
ACT3 = {'atk': ['down', 'side'], 'skl': ['smash'], 'tk': 1.2,
        'fx': {'atk': {'pal': 'earth', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'earth', 'hit': 'quake', 'big': 1, 'after': 'dust', 'shake': 2}}}
B3 = Batch('lab1_warden', 'golem', ACT3, 'passage', show=[['down', 4], ['smash', 5]])
PW = {'C': '#7c766a', 'Q': '#a49e8e', 'c': '#55504a', 'd': '#34312c', 'M': '#4a4640', 'K': '#141210', 'E': '#ffe6a0', 'e': '#c8a050',
      'R': '#d8c080', 'r': '#8a7444'}


def stonewarden():
    c = Cv(32, 44)
    for (x, ch) in ((11.0, 'c'), (17.6, 'C')):                                                                # 기둥 다리 둘
        c.fill(rbox(x, 28.0, x + 4.6, 40.6, 0.6), ch)
        c.fill(rbox(x - 0.6, 38.6, x + 5.6, 40.8, 0.4), 'd' if ch == 'c' else 'c')
    c.fill(rbox(7.6, 13.0, 13.0, 25.6, 1.0), 'c')                                                            # 먼 팔 (돌덩이 둘)
    c.fill(rbox(9.0, 12.0, 24.0, 29.0, 1.2), 'C')                                                            # 벽돌 몸통
    c.fill(rbox(7.8, 10.6, 14.6, 15.6, 1.0), 'C'); c.fill(rbox(18.6, 10.6, 25.4, 15.6, 1.0), 'C')             # 어깨 돌
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)
    brick_band(c, 9.4, 15.4, 23.6, 28.6, 'C', 'M', row=3, w=6)
    c.fill(rbox(12.6, 2.6, 21.4, 10.8, 1.2), 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)        # 머리 돌덩이
    c.fill(box(15.4, 6.2, 21.0, 7.0), 'K'); c.fill(box(17.4, 6.2, 20.0, 7.0), 'E')                          # 가로 눈 틈 · 빛
    c.fill(box(13.0, 9.4, 21.0, 9.8), 'M')
    arch = [(14.0, 25.0), (14.0, 20.0), (14.6, 18.6), (16.0, 17.8), (17.6, 17.8), (19.0, 18.6), (19.6, 20.0), (19.6, 25.0)]
    c.fill(thins(arch), 'R')                                                                                # 가슴에 새긴 아치 문 (미궁 문 표식 — 줄이 엇갈리지 않게)
    c.fill(box(16.4, 21.0, 17.2, 22.6), 'r')                                                                # 문 속 열쇠 구멍
    return c


B3.add('stonewarden', 'A 미궁 벽돌 파수꾼', '미궁을 지키려고 옛 제국이 벽돌로 쌓은 파수꾼 · 벽 벽돌을 그대로 쌓은 몸(엇갈린 이음) · 돌덩이 머리의 가로 눈 틈에 누런 빛 · 가슴에 새긴 아치 문과 열쇠 구멍 · 기둥 다리 · 돌주먹으로 내리친다',
       stonewarden(), PW, (20, 13), 18, 27, ms=1.25, wpn='rfist', wmap={'K': 'c'}, arm=['C', 'c'], hand='C', idle={'h': [2, 2], 'a': 80})
e = variant(B3, 'stonewarden_b', 'golem', 'B 돌 골렘 미궁 변종', '미궁 벽을 뜯어 일어난 돌 골렘 · 검은바위산 골렘 몸 그대로 · 잿빛 마름돌 몸 · 가슴의 금은 어깨에서 허리로 비스듬히 한 줄로 갈라지고 푸른 미로 빛이 샌다',
            {'body': '#77736a', 'dark': '#46433c'}, {'X': '#a8e0ff', 'x': '#5a9ad0', 'O': '#7aa8c8'}, act=ACT3)
# 산 골렘의 가슴 금은 두 줄이 엇갈린 X 꼴 — 푸른 빛이면 X 표식처럼 또렷해서, 변종은 한 줄로 꺾여 내려가는 금으로 (6 ~ 11줄만 바꾼다)
GL = e['g'].split('\n')
assert GL[7] == '..QQQcccQCxKXKccdCCc' and GL[8] == '.QCCCc.QCCKXxXKcccc.' and GL[9] == '.QCCCc.ccccKXKxc....', GL[7:10]
GL[7] = '..QQQcccQCXKCCccdCCc'
GL[8] = '.QCCCc.QCCKXXKccccc.'
GL[9] = '.QCCCc.cccccKXKc....'
GL[10] = '.cccc..QQQQQQQxQ....'
GL[11] = '.QQQQc.ccccccccx....'
e['g'] = '\n'.join(GL)
B3.dump()

# ═══════════ 4. B1 잃어버린 탐험대장 (층 보스) ═══════════
ACT4A = {'atk': ['pthrust', 'pswing'], 'skl': ['pspin'], 'tk': 1.2,
         'fx': {'atk': {'pal': 'water', 'hit': 'pierce', 'big': 1}, 'skl': {'pal': 'water', 'hit': 'slashes', 'big': 2, 'after': 'bubbles', 'aoe': 'spin', 'shake': 2}}}
ACT4B = {'atk': ['down', 'side', 'up'], 'skl': ['down'], 'tk': 1.3,
         'fx': {'atk': {'pal': 'water', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'water', 'hit': 'quake', 'big': 2, 'after': 'bubbles', 'aoe': 'nova', 'shake': 2}}}
B4 = Batch('lab1_b1', 'deathknight', ACT4A, 'passage', show=[['pthrust', 4], ['pspin', 5]], ms=1.5, float=1)
B4.extra = head_js('bannerspear', """
...N...
..NNN..
..NNN..
...N...
...NFFF
...Nfff
...NFFF
...Nfff
...NF.F
""", '탐험대 깃발 창 (잃어버린 탐험대장 A): 창날 아래 찢긴 줄무늬 깃발', L=7.5, shaft='g', below=3.0, fxw='lance')
PC = {'C': '#3e7c7a', 'Q': '#6ab8b0', 'c': '#2a5458', 'd': '#18343a', 'H': '#2e5e64', 'h': '#1c3e44', 'K': '#0a1416', 'E': '#e8fff4',
      'M': '#7a8a8c', 'm': '#4e5a5c', 'B': '#5a4632', 'b': '#3a2c1e', 'W': '#7ad0c4', 'w': '#4a9a96', 'R': '#8a3a34', 'r': '#5a2420',
      'F': '#c8a050', 'f': '#8a6a30', 'G': '#a8905a', 'g': '#6e5c38', 'L': '#e8fff0', 'l': '#8af0d8', 'N': '#a0a8b0', 'n': '#5e666e', 'Y': '#d8c080'}


def lostcaptain(opt):
    c = Cv(44, 58)
    wisp_tail(c, (19.0, 36.0), (14.0, 46.0), (6.0, 52.0), 6.2)                                                # 넋 꼬리
    cape = poly([(15.0, 18.0), (21.0, 17.0), (19.0, 32.0), (14.0, 44.0), (7.0, 47.0), (10.6, 36.0)])          # 뒤로 날리는 찢긴 망토
    c.fill(cape, 'R'); blunt(c.g, 'R', 'R', 'r', bottom=1, side=0)
    for (x, y) in ((8.0, 46.4), (11.4, 44.6), (13.6, 43.2)): c.fill(box(x, y, x + 1, y + 1.4), '_')           # 망토 끝 찢김
    c.fill(path([(17.0, 21.0), (14.6, 28.0), (15.6, 33.0)], 1.8), 'm'); c.fill(ell(15.6, 33.4, 1.8, 1.6), 'm')  # 먼 팔 (팔뚝 갑옷)
    torso = poly([(16.0, 18.4), (27.0, 17.6), (30.0, 22.0), (29.4, 31.0), (27.0, 37.6), (16.4, 37.6), (14.6, 29.0)])
    c.fill(torso, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(poly([(17.0, 18.0), (27.4, 17.2), (28.6, 22.6), (17.6, 24.0)]), 'M'); blunt(c.g, 'M', 'N', 'm', bottom=1, side=0)   # 가슴 갑옷 (낡은 쇠)
    c.fill(rbox(24.6, 15.6, 31.0, 21.0, 1.2), 'M')                                                           # 앞 어깨받이
    c.fill(box(15.6, 31.6, 28.6, 32.8), 'B'); c.fill(rbox(25.4, 30.6, 27.8, 34.4, 0.4), 'F')                  # 허리띠 · 쇠고리
    c.fill(rbox(20.0, 5.6, 29.4, 16.6, 2.4), 'M'); blunt(c.g, 'M', 'N', 'm', bottom=1, side=1, top=1)        # 투구
    c.fill(poly([(25.6, 9.6), (29.6, 9.6), (29.0, 15.0), (25.6, 14.4)]), 'K')                               # 투구 틈 속 어둠
    eyes(c, [(27.0, 11.2)], 'E')
    c.fill(box(21.0, 12.0, 29.2, 12.6), 'm')
    if opt == 'A':
        for (x, y, rx) in ((24.0, 4.6, 2.2), (21.6, 3.0, 2.4), (18.8, 2.4, 2.4), (16.0, 2.8, 2.2), (13.6, 4.2, 1.9), (11.8, 6.0, 1.5)):   # 투구 위 붉은 깃털 장식 (뒤로 휘며 늘어진다)
            c.fill(ell(x, y, rx, 1.6), 'R')
        blunt(c.g, 'R', 'Y', 'r', bottom=1, side=0, top=1)
        c.only(thins([(23.6, 3.6), (19.0, 1.8), (14.0, 3.4)]), 'r', 'R')                                     # 깃 결
    else:
        c.fill(rbox(12.4, 30.4, 16.0, 35.0, 0.6), 'g'); c.fill(box(13.0, 31.4, 15.4, 33.8), 'l'); c.fill(box(13.6, 32.0, 14.8, 33.2), 'L')   # 허리 뒤 등불
        c.fill(poly([(20.4, 5.8), (23.6, 2.6), (26.6, 5.6)]), 'm')                                               # 투구 꼭지 (부러진 뿔)
    for (x, y) in ((4.0, 44.0), (8.6, 54.6)): c.fill(box(x, y, x + 1, y), 'w')
    return c


B4.add('lostcaptain', 'A 깃발 대장', 'B1 층 보스 · 첫 탐험대를 이끌다 돌 미로에서 대원들과 함께 사라진 대장의 넋 · 낡은 쇠 투구(깃털 장식) 틈의 넋불 눈 · 가슴 갑옷 · 찢긴 붉은 망토 · 탐험대 깃발 창(줄무늬 깃발) · 허리 아래는 넋 줄기 · 창을 휘돌려 넋 바람을 일으킨다',
       lostcaptain('A'), PC, (27, 19), 22, 33, pad=3, wpn='bannerspear', arm=['C', 'c'], hand='N', idle={'h': [3, 3], 'a': -70})
B4.add('lostcaptain_b', 'B 등불 대장', 'B1 층 보스 · 첫 탐험대장의 넋 · 꼭지가 부러진 투구 · 찢긴 붉은 망토 · 허리 뒤에 넋불 등불 · 녹슨 큰 칼을 내려친다 · 허리 아래는 넋 줄기',
       lostcaptain('B'), PC, (27, 19), 22, 33, pad=3, wpn='gsword', arm=['C', 'c'], hand='N', idle={'h': [3, 3], 'a': -50}, act=ACT4B, show=[['down', 4], ['up', 4]])
B4.dump()

# ═══════════ 5. B9 미궁 문지기 (무대 주인 — B10 킹슬라임 바로 앞) ═══════════
ACT5A = {'atk': ['pthrust', 'pswing'], 'skl': ['smash'], 'tk': 1.35,
         'fx': {'atk': {'pal': 'earth', 'hit': 'pierce', 'big': 1}, 'skl': {'pal': 'earth', 'hit': 'quake', 'big': 2, 'after': 'dust', 'aoe': 'slam', 'shake': 3}}}
ACT5B = {'atk': ['down', 'side'], 'skl': ['smash'], 'tk': 1.35,
         'fx': {'atk': {'pal': 'earth', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'gold', 'hit': 'quake', 'big': 2, 'after': 'dust', 'aoe': 'rocks', 'shake': 3}}}
B5 = Batch('lab1_b9', 'golem', ACT5A, 'passage', show=[['pthrust', 4], ['smash', 5]], ms=1.5)
B5.extra = head_js('keyhalberd', """
.GGG.
.G.G.
.GGG.
..G..
..GGG
..G..
..GG.
..G..
""", '열쇠 미늘창 (미궁 문지기 A): 창대 끝이 큰 열쇠 — 둥근 손잡이 고리와 한쪽으로 난 열쇠 이', L=8.0, shaft='n', below=3.5, fxw='lance') + head_js('giantkey', """
..GG.
..G..
..GGG
..G..
..G..
..G..
""", '큰 열쇠 칼 (미궁 문지기 B): 칼처럼 쥔 큰 놋쇠 열쇠 — 끝에 한쪽으로 난 열쇠 이', L=6.5, shaft='G', below=2.5, fxw='club')
PK = {'C': '#8a8476', 'Q': '#b2ac9a', 'c': '#5e5a50', 'd': '#3a3832', 'M': '#4c4842', 'K': '#141210', 'E': '#ffd080', 'e': '#c88a3a',
      'N': '#6a6e74', 'n': '#3e4248', 'x': '#9aa0a6', 'G': '#c8a050', 'g': '#8a6a30', 'R': '#d8c080', 'D': '#6a5e4c', 'Dd': '#4a4034'}
PK = {k: v for k, v in PK.items() if len(k) == 1}; PK['o'] = '#4a4034'


def gatekeeper(opt):
    c = Cv(48, 62)
    for (x, ch) in ((15.0, 'c'), (24.6, 'C')):                                                                # 기둥 다리
        c.fill(rbox(x, 40.0, x + 6.4, 57.0, 0.8), ch)
        c.fill(rbox(x - 0.8, 54.4, x + 7.6, 57.4, 0.6), 'd' if ch == 'c' else 'c')
    c.fill(rbox(12.0, 18.0, 36.0, 42.0, 2.0), 'C')                                                           # 큰 돌 몸통
    c.fill(rbox(10.0, 16.0, 19.0, 23.0, 1.6), 'C'); c.fill(rbox(28.0, 15.6, 38.0, 23.0, 1.6), 'C')             # 어깨 돌
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)
    brick_band(c, 12.6, 23.0, 35.4, 41.4, 'C', 'M', row=4, w=8)
    c.fill(rbox(17.6, 6.0, 30.4, 16.8, 1.2), 'C')                                                            # 머리 = 작은 성문 탑
    for (x0, x1) in ((17.6, 20.4), (22.6, 25.4), (27.6, 30.4)): c.fill(box(x0, 1.6, x1, 6.4), 'C')           # 머리 위 성가퀴 셋 (사이 두 칸)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)
    c.fill(rbox(24.6, 8.4, 29.4, 11.8, 1.0), 'K'); c.fill(box(25.8, 9.6, 28.4, 10.4), 'E')                   # 아치 눈 틈 · 빛
    c.fill(box(18.0, 14.4, 30.0, 14.8), 'M')
    if opt == 'A':
        door = rbox(4.0, 20.0, 15.6, 47.0, 1.0) | ell(9.8, 21.0, 5.8, 4.4)                                   # 돌 문짝 방패 (먼 팔 · 위가 둥근 문짝)
        c.fill(door, 'D'); blunt(c.g, 'D', 'Q', 'o', bottom=1, side=1, top=1)
        for y in (25.0, 34.0, 43.0): c.only(box(4.6, y, 15.0, y + 0.8), 'N', 'Do')                           # 쇠 띠 (가로만)
        for y in (25.0, 34.0, 43.0):
            for x in (5.6, 13.2): c.only(box(x, y, x + 1, y + 0.8), 'x', 'N')                               # 쇠못 (2칸)
        c.fill(ell(12.2, 30.0, 1.2, 1.2), 'G'); c.set(12.2, 30.0, 'g')                                       # 문고리
        c.fill(ell(24.0, 28.0, 2.0, 2.0) | poly([(22.8, 29.0), (25.2, 29.0), (26.0, 34.0), (22.0, 34.0)]), 'e')   # 가슴의 열쇠 구멍 (빛나는 테)
        c.fill(ell(24.0, 28.0, 1.0, 1.0) | poly([(23.4, 29.2), (24.6, 29.2), (25.0, 33.0), (23.0, 33.0)]), 'E')
    else:
        c.fill(rbox(5.0, 24.0, 13.0, 36.0, 1.2), 'c')                                                         # 먼 팔 (돌덩이)
        hole = ell(24.0, 27.0, 3.4, 3.4) | poly([(21.6, 28.6), (26.4, 28.6), (28.0, 37.6), (20.0, 37.6)])      # 몸을 꿰뚫은 큰 열쇠 구멍 (뒤가 보인다)
        rimc = {(x + dx, y + dy) for (x, y) in hole for dx in (-1, 0, 1) for dy in (-1, 0, 1)} - hole
        c.fill(rimc, 'e'); c.fill({(x, y) for (x, y) in rimc if (x + 1, y) in hole or (x, y + 1) in hole}, 'E')   # 구멍 둘레 빛
        c.fill(hole, '_')
        for (x, y) in ((32.0, 26.0), (33.6, 30.0), (33.0, 34.6)): c.fill(box(x, y, x + 1.6, y + 0.8), 'N')     # 몸에 걸친 쇠사슬 마디
    return c


B5.add('gatekeeper', 'A 문짝 방패 문지기', 'B9 층 보스(돌 미로의 무대 주인 — B10 킹슬라임 바로 앞) · 미궁 아래로 가는 문을 지키는 큰 돌 거인 · 성가퀴 얹은 성문 탑 머리 · 아치 눈 틈의 누런 빛 · 가슴의 빛나는 열쇠 구멍 · 위가 둥근 돌 문짝을 방패로(가로 쇠 띠 · 쇠못 · 문고리) · 끝이 큰 열쇠인 미늘창으로 찌른다 · 땅을 구르면 돌이 솟는다',
       gatekeeper('A'), PK, (33, 19), 27, 41, wpn='keyhalberd', arm=['C', 'c'], hand='C', idle={'h': [3, 3], 'a': -75})
B5.add('gatekeeper_b', 'B 열쇠 구멍 문지기', 'B9 층 보스(돌 미로의 무대 주인) · 몸통을 꿰뚫은 큰 열쇠 구멍(뒤가 보인다 · 둘레가 누렇게 빛난다) · 성가퀴 얹은 성문 탑 머리 · 몸에 걸친 쇠사슬 · 칼처럼 쥔 큰 열쇠로 내리친다 · 미로의 돌이 쏟아진다',
       gatekeeper('B'), PK, (33, 19), 27, 41, wpn='giantkey', arm=['C', 'c'], hand='C', idle={'h': [3, 3], 'a': -60}, act=ACT5B, show=[['down', 4], ['smash', 5]])
B5.dump()
