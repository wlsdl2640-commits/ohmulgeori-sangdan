"""오파님 (ophan · 천계의 유적 폐허 · 천상 · 신성 · 마법 · 떠 있음 · 맞히면 감전) 시안 — 떠 있는 바퀴 · noArm · still
마법 기본 공격 wspit(눈들이 빛을 모았다가 쏨 → 빛 구슬) · 공격 갈래 bswoop(굴러 내리꽂기) · 스킬 = 번개
A 눈 박힌 두 고리: 맞물려 도는 금 고리 둘(하나는 비스듬히 누움) · 고리마다 박힌 눈 · 가운데 흰 금빛 불꽃
B 불꽃 바퀴: 굵은 금 테 둘레에 일렁이는 불꽃 혀 · 테에 박힌 작은 눈 넷 · 가운데 큰 눈 하나(바퀴살 없음)
C 날개 바퀴: 가운데 큰 눈을 두른 금 고리 · 양옆으로 펼친 깃털 날개 둘 · 날갯짓
피한 것: 바퀴살(더하기 · 십자 꼴) · 사람 머리 위 고리(후광) · 세모 안의 눈"""
from kit import *
from feath import layer, wing_feathers

ACT = {'mag': ['wspit'], 'atk': ['bswoop'], 'skl': ['wspit'], 'tk': 0.95,
       'fx': {'mag': {'pal': 'holy', 'hit': 'flash', 'p': 'orb'}, 'atk': {'pal': 'holy', 'hit': 'star'},
              'skl': {'pal': 'bolt', 'hit': 'bolt', 'p': 'orb', 'big': 1, 'after': 'sparks'}}}
B = Batch('ophan1', 'ophan', ACT, 'ruins', show=[['wspit', 4], ['bswoop', 4]], still=1, noArm=1, wpn='none', float=1)
CX, CY = 17.0, 15.0
MODES = ['idle0', 'idle1', 'bite', 'swell', 'spit']


def ering(rx, ry, rot, a0=0, a1=360, step=3):
    pts = []
    for k in range(int(a0), int(a1) + 1, step):
        t = math.radians(k); x, y = rx * math.cos(t), ry * math.sin(t); r = math.radians(rot)
        pts.append((CX + x * math.cos(r) - y * math.sin(r), CY + x * math.sin(r) + y * math.cos(r), k))
    return pts


def band(c, rx, ry, rot, w, ch, lite, dark, a0=0, a1=360, only_empty=False):
    """두께 w 고리 (바깥 위 = 빛, 안쪽 아래 = 그늘)"""
    for (x, y, k) in ering(rx, ry, rot, a0, a1, 2):
        for (qx, qy) in ell(x, y, w * 0.5 + 0.35, w * 0.5 + 0.35):
            if only_empty and c.get(qx, qy) != '.': continue
            d = math.hypot(qx + 0.5 - CX, qy + 0.5 - CY) - math.hypot(x - CX, y - CY)
            c.set(qx, qy, lite if (d > w * 0.25 and qy < CY) else dark if d < -w * 0.25 else ch)


def eye(c, x, y, mode, big=False):
    gl = mode in ('swell', 'spit')
    if big:
        c.fill(ell(x, y, 3.2, 2.0), 'w'); c.fill(ell(x + 0.4, y, 1.6, 1.6), 'Y' if gl else 'B'); c.fill(box(x, y - 0.4, x + 1, y + 0.4), 'k' if not gl else 'L')
        c.fill(thins([(x - 3.0, y - 1.6), (x + 3.0, y - 1.8)]), 'g')
    else:
        c.fill(box(x - 1.4, y - 0.4, x + 1.4, y + 0.8), 'w'); c.fill(box(x - 0.4, y - 0.4, x + 0.6, y + 0.8), 'Y' if gl else 'B')


def ophan(mode, opt):
    global CX
    CX = 24.0 if opt == 'C' else 17.0
    c = Cv(48, 34) if opt == 'C' else Cv(36, 32); ph = {'idle0': 0, 'idle1': 18, 'bite': 9, 'swell': 0, 'spit': 0}[mode]; tilt = 14 if mode == 'bite' else 0
    if opt == 'A':
        band(c, 11.4, 4.8, -32 + tilt, 1.6, 'G', 'o', 'g', 180, 360)                                                             # 누운 고리 (뒤쪽 반)
        band(c, 10.6, 10.6, 0, 1.7, 'G', 'o', 'g')                                                                                # 선 고리
        band(c, 11.4, 4.8, -32 + tilt, 1.6, 'G', 'o', 'g', 0, 180)                                                               # 누운 고리 (앞쪽 반)
        core = 3.2 if mode != 'swell' else 4.0
        c.fill(ell(CX, CY, core, core), 'Y'); c.fill(ell(CX, CY, core - 1.2, core - 1.2), 'L'); c.fill(ell(CX, CY - 0.4, 0.9, 0.9), 'x')   # 가운데 흰 금빛 불꽃
        for k in (20, 80, 140, 200, 260, 320):
            t = math.radians(k + ph); eye(c, CX + 10.6 * math.cos(t), CY + 10.6 * math.sin(t) - 0.5, mode)
        for k in (40, 160, 280):
            t = math.radians(k + ph * 1.5); x, y = 11.0 * math.cos(t), 4.6 * math.sin(t); r = math.radians(-32 + tilt)
            eye(c, CX + x * math.cos(r) - y * math.sin(r), CY + x * math.sin(r) + y * math.cos(r) - 0.5, mode)
    elif opt == 'B':
        for k in range(0, 360, 30):                                                                                               # 불꽃 혀
            t = math.radians(k + ph * 0.7); L = 3.4 + (1.4 if (k // 30 + (1 if mode == 'idle1' else 0)) % 2 else 0) + (1.2 if mode in ('swell', 'spit') else 0)
            bx, by = CX + 10.0 * math.cos(t), CY + 10.0 * math.sin(t); tx, ty = CX + (10.0 + L) * math.cos(t - 0.18), CY + (10.0 + L) * math.sin(t - 0.18) - 1.0
            c.fill(poly([(bx - math.sin(t) * 1.6, by + math.cos(t) * 1.6), (tx, ty), (bx + math.sin(t) * 1.6, by - math.cos(t) * 1.6)]), 'O')
            c.only(path([(bx, by), ((bx + tx) / 2, (by + ty) / 2)], 0.6), 'Y', 'O')
        band(c, 9.0, 9.0, 0, 3.6, 'G', 'o', 'g')                                                                                  # 굵은 금 테
        c.fill(ell(CX, CY, 6.6, 6.6), 'D'); c.fill(ell(CX, CY, 5.6, 5.6), 'd')                                                  # 테 안 어둠
        eye(c, CX + 0.4, CY, mode, big=True)                                                                                     # 가운데 큰 눈
        for k in (45, 135, 225, 315):
            t = math.radians(k + ph); eye(c, CX + 9.0 * math.cos(t), CY + 9.0 * math.sin(t) - 0.5, mode)
    else:
        dn = {'idle0': 0, 'idle1': 3.0, 'bite': -1.0, 'swell': -1.6, 'spit': 1.0}[mode]
        for (sx, base, lite, dark) in ((-1, 'V', 'W', 'v'), (1, 'W', 'w', 'V')):                                                # 양옆으로 펼친 큰 날개 둘 (먼 쪽 · 앞쪽)
            root = (CX + sx * 6.0, CY - 1.0); wr = (CX + sx * 10.6, CY - 7.0 + dn * 0.5)
            tips = [(wr[0] + sx * 6.4, wr[1] - 3.0 + dn), (wr[0] + sx * 7.2, wr[1] + 1.4 + dn), (wr[0] + sx * 6.6, wr[1] + 5.4 + dn), (wr[0] + sx * 4.6, wr[1] + 9.0 + dn * 0.6)]
            tips = [(min(42, max(-6, x)), y) for (x, y) in tips]
            prim, sec = wing_feathers(root, wr, tips, [(wr[0] + sx * 2.4, wr[1] + 11.0), (wr[0] - sx * 0.6, wr[1] + 11.4)])
            layer(c, sec, base, lite, dark); layer(c, prim, base, lite, dark)
            c.fill(path([root, wr], 1.1, 0.9), base); c.only(thin(root, wr), lite, base)
        band(c, 6.8, 6.8, 0, 2.2, 'G', 'o', 'g')
        c.fill(ell(CX, CY, 5.0, 5.0), 'D')
        eye(c, CX + 0.4, CY, mode, big=True)
    if mode == 'spit': c.fill(ell(CX + 4.6, CY, 1.4, 1.2), 'L')
    return c


PAL = {
    'A': {'G': '#e8c050', 'o': '#fff0a0', 'g': '#a8842a', 'Y': '#ffe070', 'L': '#fffbe0', 'x': '#ffffff', 'w': '#f4f0e8', 'B': '#3a8ae8', 'k': '#141018'},
    'B': {'G': '#e8b840', 'o': '#fff0a0', 'g': '#a87a20', 'O': '#ff8a2a', 'Y': '#ffe070', 'L': '#fffbe0', 'D': '#5a2a10', 'd': '#3a1a0a', 'w': '#f4f0e8', 'B': '#e8501a', 'k': '#141018'},
    'C': {'G': '#e8c050', 'o': '#fff0a0', 'g': '#a8842a', 'W': '#e8dcc0', 'w': '#fffaf0', 'V': '#b0a07c', 'v': '#7a6c50', 'D': '#2a3a6a', 'Y': '#ffe070', 'L': '#fffbe0', 'w2': '', 'B': '#3a8ae8', 'k': '#141018'},
}
PAL['C'].pop('w2')
LAB = {'A': ('A 눈 박힌 두 고리', '맞물려 도는 금 고리 둘(하나는 비스듬히 누워 앞뒤로 감김) · 고리마다 박힌 눈(돌면 자리가 바뀐다) · 가운데 흰 금빛 불꽃 · 마법을 모으면 눈들이 금빛'),
       'B': ('B 불꽃 바퀴', '굵은 금 테 둘레에 일렁이는 불꽃 혀 · 테에 박힌 작은 눈 넷 · 어두운 테 안의 큰 눈 하나(붉은 눈동자) · 바퀴살 없음'),
       'C': ('C 날개 바퀴', '가운데 큰 눈을 두른 금 고리 · 양옆으로 크게 펼친 크림빛 깃털 날개 둘 · 날갯짓 · 마법을 모으면 눈동자가 금빛')}
for opt in 'ABC':
    fr = {m: ophan(m, opt) for m in MODES}
    cx = 24.0 if opt == 'C' else 17.0
    B.add('ophan' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'], fr['idle1']], PAL[opt], (cx + 4, CY), cx, pad=4,
          gm={m: fr[m] for m in ('bite', 'swell', 'spit')})
B.dump()
