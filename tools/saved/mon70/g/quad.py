"""네발 짐승 몸 (v60 beast4.py에서): rot · POSE · body4 — 시안 70은 swell(고개 듦) · spit(고개 내밂) 자세를 더함"""
import math
from cv import ell, poly, path


def rot(pts, cx, cy, a):
    ca, sa = math.cos(a), math.sin(a)
    return [(cx + (x - cx) * ca - (y - cy) * sa, cy + (x - cx) * sa + (y - cy) * ca) for (x, y) in pts]


POSE = {   # 몸 기울기 · 앞다리 발끝 (어깨 기준 dx, 땅 위 dy) · 뒷다리 발끝 (엉덩이 기준) · 머리 숙임 · 입 벌림 · 몸 높이 더함
    'idle0': dict(tilt=0.0, fl=(0.4, 0), bl=(-0.4, 0), hd=0.0, op=0, up=0),
    'idle1': dict(tilt=0.0, fl=(0.4, 0), bl=(-0.4, 0), hd=-0.4, op=0, up=0),
    'bite': dict(tilt=0.08, fl=(1.6, 0), bl=(-1.2, 0), hd=1.6, op=1, up=0),
    'charge': dict(tilt=0.12, fl=(4.6, -0.6), bl=(-4.4, -0.4), hd=1.2, op=0, up=0.6),
    'leap': dict(tilt=-0.22, fl=(3.6, -3.4), bl=(-5.4, -1.4), hd=-0.6, op=1, up=1.6),
    'swell': dict(tilt=-0.08, fl=(0.0, 0), bl=(-0.6, 0), hd=-1.6, op=0, up=0.4),
    'spit': dict(tilt=0.06, fl=(1.4, 0), bl=(-1.0, 0), hd=0.8, op=1, up=0),
}


def body4(c, mode, S, ch='C', far='c', leg='C', farleg='c', foot=None):
    """네발 짐승 몸통 · 다리 넷 · 목. 머리 · 꼬리는 따로. 돌려주는 값: 어깨 · 엉덩이 · 목 끝 · 발 가운데 x"""
    P = POSE[mode]; GY = S['gy']; ll = S['ll']; bl = S['bl']; bh = S['bh']
    bx, by = S['bx'], GY - ll - bh * 0.5 - P['up']
    shp, hip = rot([(bx + bl * 0.5 - 1.2, by), (bx - bl * 0.5 + 1.2, by)], bx, by, P['tilt'])
    feet = []
    for (j, base, d, colr) in ((0, hip, P['bl'], farleg), (1, shp, P['fl'], farleg), (2, hip, P['bl'], leg), (3, shp, P['fl'], leg)):   # 먼 다리 둘 → 가까운 다리 둘
        off = -1.0 if j < 2 else 0.4
        fx, fy = base[0] + d[0] + off, GY + d[1] - (0.3 if j < 2 else 0)
        knee = ((base[0] + fx) / 2 + (0.8 if base is hip else -0.4), (base[1] + fy) / 2)
        c.fill(path([(base[0] + off, base[1]), knee, (fx, fy)], S['lw'], S['lw'] * 0.8), colr)
        if foot: c.fill(ell(fx + 0.4, fy - 0.2, S['lw'] * 0.9, 0.7), foot)
        feet.append(fx)
    body = rot([(bx - bl * 0.5, by - bh * 0.15), (bx - bl * 0.3, by - bh * 0.5), (bx + bl * 0.3, by - bh * 0.55), (bx + bl * 0.5, by - bh * 0.1),
                (bx + bl * 0.42, by + bh * 0.45), (bx - bl * 0.42, by + bh * 0.45)], bx, by, P['tilt'])
    c.fill(poly(body), ch)
    nk = rot([(bx + bl * 0.5 - 0.6, by - bh * 0.25), (bx + bl * 0.5 + S['nk'][0], by - bh * 0.25 - S['nk'][1] + P['hd'])], bx, by, P['tilt'])
    c.fill(path(nk, S['nw'], S['nw'] * 0.85), ch)
    return shp, hip, nk[-1], (min(feet) + max(feet)) / 2, (bx, by)


