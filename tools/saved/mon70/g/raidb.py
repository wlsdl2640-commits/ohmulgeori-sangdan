"""레이드 보스 베히모스 (behemoth · Lv190 · 하늘 레이드) 새 그림 시안 — 「구름섬 위 하늘을 떠다니는 거대한 고래. 눈이 넷, 지느러미가 수없이 많다」
레이드 거인 한 장 그림(PXRAID · 반 해상도 · 명암 · 부위 선은 격자에). 별의 정원 별고래(남빛 별무늬 · 유리)와 겹치지 않게.
A 네 눈 하늘 고래: 연보랏빛 등과 등줄기의 짙은 판 · 줄무늬 진 크림빛 배 · 머리 옆에 나란한 호박빛 눈 넷 · 배를 따라 늘어선 지느러미 여섯 · 배 밑 구름
B 갑각 하늘 괴수: 머리부터 꼬리까지 겹친 남보랏빛 갑각 마디 여덟 · 마디마다 배 밑 작은 지느러미 다리 · 주둥이의 짧은 뿔 · 눈 넷 · 가시 꼬리
C 구름 해파리 고래: 옅은 하늘빛 몸 · 배 밑으로 길게 늘어진 구름 촉수 · 빛줄기 비치는 보랏빛 지느러미 · 하늘빛으로 빛나는 눈 넷
피한 것: 등에 섬 · 집(아스피도켈론 · 하늘의 거인 몫) · 등에 도시를 진 우주 고래 · 별무늬(별고래)"""
import json, sys, math
from kit import *
from cloud import puffs


def whale(c, cy=16.0, body='C', lite='Q', dark='c', belly='P', grooves='p'):
    fl = [(14.0, cy - 1.0), (6.0, cy - 8.0), (1.6, cy - 10.0), (4.0, cy - 4.0), (8.6, cy + 0.6), (4.0, cy + 5.0), (1.6, cy + 10.4), (6.6, cy + 8.0), (14.0, cy + 1.6)]
    body_c = ell(42.0, cy, 18.0, 10.6) | ell(26.0, cy + 0.4, 15.0, 8.6) | poly([(16.0, cy - 5.0), (20.0, cy - 6.6), (20.0, cy + 6.4), (13.0, cy + 1.4)]) | poly(fl)
    c.fill(body_c, body)
    bl = {(x, y) for (x, y) in ell(42.0, cy + 7.0, 19.0, 5.4) if (x, y) in body_c and y > cy + 2.6}
    blunt(c.g, body, lite, dark, bottom=1, side=0)
    c.fill(bl, belly)
    for k in range(5): c.only(thins([(28.0 + k * 0.8, cy + 6.4 + k * 0.8), (58.0 - k * 1.4, cy + 4.2 + k * 1.0)]), grooves, belly)   # 배 줄무늬
    c.fill(thins([(59.6, cy + 2.6), (47.0, cy + 4.0), (44.0, cy + 2.8)]), 'k')                                                        # 입 줄
    return body_c, fl


def four_eyes(c, cy, ch='E', pupil='e', x0=42.0, sock=None):
    for i in range(4):
        x = x0 + i * 4.2; y = cy - 3.4 + i * 0.4
        if sock: c.fill(box(x - 0.6, y - 0.6, x + 2.0, y + 1.6), sock)                                                      # 눈두덩 (눈마다 따로)
        c.fill(box(x, y, x + 1.4, y + 1.0), ch); c.fill(box(x + 1.0, y, x + 1.4, y + 1.0), pupil)


def fin(c, base, ang, L, w, ch, edge):
    a = math.radians(ang); ux, uy = math.cos(a), math.sin(a); px, py = -uy, ux
    pts = [(base[0] - px * w, base[1] - py * w), (base[0] + ux * L * 0.6 - px * w * 0.8, base[1] + uy * L * 0.6 - py * w * 0.8), (base[0] + ux * L, base[1] + uy * L), (base[0] + px * w, base[1] + py * w)]
    cells = poly(pts); c.fill(cells, ch); c.only(thin(base, (base[0] + ux * L * 0.9, base[1] + uy * L * 0.9)), edge, ch)


def behA():
    c = Cv(66, 42); cy = 16.0
    puffs(c, [(24.0, 29.0, 3.4), (32.0, 30.6, 4.2), (41.0, 30.4, 4.0), (49.0, 29.0, 3.4), (16.0, 27.6, 2.6), (56.0, 27.4, 2.4)], 'W', 'w', light='V')   # 배 밑 구름
    body_c, fl = whale(c, cy)
    for i in range(6):                                                                                                       # 배를 따라 늘어선 지느러미 여섯
        bx = 26.0 + i * 5.4; by = cy + 8.0 - abs(i - 3) * 0.4
        fin(c, (bx, by), 148 - i * 2, 8.0 - abs(i - 2.5) * 0.5, 2.3, 'F', 'f')
    for x in range(20, 56, 3):                                                                                               # 등줄기의 짙은 판
        y = min(yy for (xx, yy) in body_c if xx == x) if any(xx == x for (xx, yy) in body_c) else cy - 8
        c.fill(poly([(x - 1.2, y + 0.8), (x - 0.2, y - 1.6), (x + 1.2, y + 0.8)]), 'D')
    four_eyes(c, cy)
    seams(c, {'body': ('CQc', 'c'), 'belly': ('Pp', 'p'), 'fin': ('Ff', 'f'), 'plate': ('D', 'D'), 'cloud': ('WwV', 'w')})
    return c


def behB():
    c = Cv(66, 40); cy = 16.0
    body_c, fl = whale(c, cy, body='A', lite='a', dark='Z', belly='P', grooves='p')
    for i in range(8):                                                                                                       # 겹친 갑각 마디 여덟 (마디 사이 짙은 줄)
        x = 18.0 + i * 5.2
        c.only(thin((x, cy - 11.0), (x - 1.4, cy + 4.0)), 'Z', 'Aa')
        top = [(xx, yy) for (xx, yy) in body_c if abs(xx - (x + 2.6)) < 0.6]
        if top: ty = min(yy for (xx, yy) in top); c.fill(box(x + 1.0, ty, x + 4.2, ty), 'a')
        fin(c, (x + 2.0, cy + 7.6 - abs(i - 4) * 0.3), 100 + i * 3, 4.6, 1.0, 'F', 'f')                                     # 마디마다 작은 지느러미 다리
    c.fill(poly([(58.0, cy - 4.6), (64.6, cy - 8.6), (60.4, cy - 2.4)]), 'O')                                                # 주둥이의 짧은 뿔
    for (x, y) in ((2.0, cy - 10.6), (2.0, cy + 10.8), (5.0, cy - 7.4)): c.fill(poly([(x, y), (x - 1.4, y - 1.6 if y < cy else y + 1.6), (x + 1.4, y)]), 'O')   # 가시 꼬리
    four_eyes(c, cy, 'E', 'e')
    seams(c, {'body': ('AaZ', 'Z'), 'belly': ('Pp', 'p'), 'fin': ('Ff', 'f'), 'horn': ('O', 'O')})
    return c


def behC():
    c = Cv(66, 46); cy = 16.0
    for i, x in enumerate((24.0, 30.0, 36.0, 42.0, 48.0)):                                                                   # 배 밑으로 길게 늘어진 구름 촉수
        pts = [(x + 1.6 * math.sin(k * 0.8 + i), cy + 7.0 + k * 3.4) for k in range(8)]
        c.fill(path(pts, 1.6, 0.6), 'W'); c.only(path(pts[:4], 0.5), 'V', 'W')
    body_c, fl = whale(c, cy)
    for (bx, by, ang, L) in ((34.0, cy + 4.0, 125, 12.0), (44.0, cy + 4.0, 118, 10.0), (20.0, cy - 2.0, 200, 9.0)):        # 빛줄기 비치는 보랏빛 지느러미
        fin(c, (bx, by), ang, L, 2.6, 'F', 'f')
        a = math.radians(ang); c.only(thin((bx + math.cos(a + 0.3) * 2, by + math.sin(a + 0.3) * 2), (bx + math.cos(a) * L * 0.8, by + math.sin(a) * L * 0.8)), 'L', 'F')
    four_eyes(c, cy, 'E', 'L', sock=None)
    seams(c, {'body': ('CQc', 'c'), 'belly': ('Pp', 'p'), 'fin': ('FfL', 'f'), 'cloud': ('WV', 'V')})
    return c


PAL = {
    'A': {'C': '#8a7ad0', 'Q': '#b4a6ee', 'c': '#5a4a9e', 'P': '#f2ecfa', 'p': '#c8bce0', 'F': '#6a5ab8', 'f': '#d0c4ff', 'D': '#3e3078',
          'W': '#f4f6ff', 'w': '#c8d0ec', 'V': '#ffffff', 'E': '#ffc040', 'e': '#3a1a08', 'k': '#1e1640'},
    'B': {'A': '#4a3c8a', 'a': '#7a6cc0', 'Z': '#2a2058', 'P': '#c8c0e8', 'p': '#9a90c0', 'F': '#5a4ca0', 'f': '#8a7cd0', 'O': '#e8e0d0',
          'E': '#ff6a5a', 'e': '#2a0a08', 'k': '#140e2a'},
    'C': {'C': '#b8cce8', 'Q': '#e4eefc', 'c': '#7e96c0', 'P': '#f4f8ff', 'p': '#c8d6ec', 'F': '#9a7ae0', 'f': '#c8a8ff', 'L': '#ffffff',
          'W': '#e8f0ff', 'V': '#ffffff', 'E': '#7af0ff', 'k': '#2a3450'},
}
LAB = {'A': ('A 네 눈 하늘 고래', '연보랏빛 몸 · 등줄기를 따라 솟은 짙은 판 · 줄무늬 진 크림빛 배 · 머리 옆에 나란한 호박빛 눈 넷 · 배를 따라 늘어선 보랏빛 지느러미 여섯 · 배 밑의 흰 구름'),
       'B': ('B 갑각 하늘 괴수', '머리부터 꼬리까지 겹친 남보랏빛 갑각 마디 여덟(마디 사이 짙은 줄) · 마디마다 배 밑 작은 지느러미 다리 · 주둥이의 짧은 흰 뿔 · 붉은 눈 넷 · 가시 꼬리'),
       'C': ('C 구름 해파리 고래', '옅은 하늘빛 몸 · 배 밑으로 길게 늘어진 흰 구름 촉수 다섯 · 빛줄기가 비치는 보랏빛 지느러미 셋 · 하늘빛으로 빛나는 눈 넷')}
if __name__ == '__main__':
    out = {'pal': PAL, 'label': {k: v[0] for k, v in LAB.items()}, 'desc': {k: v[1] for k, v in LAB.items()}}
    for k, fn in (('A', behA), ('B', behB), ('C', behC)): out[k] = gridtxt(fn())
    json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else '../t/raid_behemoth.json', 'w'), ensure_ascii=False)
    print('ok', [(len(out[k].split('\n')), max(len(r) for r in out[k].split('\n'))) for k in 'ABC'])
