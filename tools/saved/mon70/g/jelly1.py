"""성운 해파리 (nebula · 별의 정원 · 괴물 · 어둠 · 마법 · 떠 있음 · 맞히면 냉기) 시안 — 떠 있는 해파리 · noArm · still
마법 기본 공격 wspit(갓이 부풀었다 오므리며 성운 구슬) · 공격 갈래 bswoop(촉수 휘감기) · 스킬 = 성운 흡수
A 보랏빛 성운 해파리: 반투명 보랏빛 갓 속에 분홍 · 파랑 성운 소용돌이와 별 · 끝이 빛나는 긴 물결 촉수
B 은하 소용돌이 해파리: 갓 위에 감긴 은하 소용돌이 무늬 · 프릴 같은 입팔 · 짧은 빛 촉수
C 등롱 해파리: 위로 긴 남빛 갓(하늘빛 빛 테) · 갓 속 등불 같은 빛 · 리본처럼 늘어진 촉수
피한 것: 십자 무늬(갓 위 네 갈래 줄) · 더하기 꼴 반짝이"""
from kit import *

ACT = {'mag': ['wspit'], 'atk': ['bswoop'], 'skl': ['wspit'], 'tk': 1.0,
       'fx': {'mag': {'pal': 'arcane', 'hit': 'flash', 'p': 'orb'}, 'atk': {'pal': 'dark', 'hit': 'slashes'},
              'skl': {'pal': 'dark', 'hit': 'vortex', 'p': 'orb', 'big': 1, 'after': 'drain'}}}
B = Batch('jelly1', 'nebula', ACT, 'stargarden', show=[['wspit', 2], ['wspit', 4], ['bswoop', 4]], still=1, noArm=1, wpn='none', float=1)
MODES = ['idle0', 'idle1', 'bite', 'swell', 'spit']


def tent(c, x0, y0, L, ph, ch, tip, amp=1.2, fwd=0.0, w=0.6):
    pts = [(x0 + amp * math.sin(ph + k * 0.9) + fwd * k / 6, y0 + k * L / 6) for k in range(7)]
    c.fill(path(pts, w, 0.4), ch); c.set(pts[-1][0], pts[-1][1], tip)


def jelly(mode, opt):
    c = Cv(28, 34); ph = {'idle0': 0, 'idle1': 1.6, 'bite': 0.8, 'swell': 0.4, 'spit': 2.2}[mode]
    sw = {'swell': 1.18, 'spit': 0.86}.get(mode, 1.0); fwd = 4.0 if mode == 'bite' else (1.6 if mode == 'spit' else 0.0)
    cx, cy = 13.0, 9.0
    if opt == 'A':
        for i, x in enumerate((8.4, 10.6, 13.0, 15.4, 17.6)): tent(c, x, cy + 4.0, 16.0 - abs(i - 2) * 1.6, ph + i, 'p', 'L', 1.4, fwd)   # 긴 물결 촉수
        bell = ell(cx, cy + 1.0, 7.4 * sw, 6.6 * sw) - {(x, y) for x in range(28) for y in range(int(cy + 4.4), 34)}
        c.fill(bell, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        c.only(path([(cx - 5.4, cy + 3.4), (cx - 1.0, cy + 0.6), (cx + 3.0, cy - 1.6)], 1.3), 'P', 'CQc'); c.only(path([(cx - 2.0, cy + 3.6), (cx + 2.4, cy + 2.0), (cx + 5.4, cy + 0.0)], 1.0), 'B', 'CQc')   # 갓 속을 비스듬히 흐르는 분홍 · 파랑 성운 띠
        for (x, y) in ((cx - 3.6, cy - 1.6), (cx + 1.0, cy - 3.4), (cx + 4.4, cy - 0.4), (cx - 0.6, cy + 3.0)): c.set(x, y, 'L')   # 별
        c.fill(thins([(cx - 7.0 * sw, cy + 4.2), (cx + 7.0 * sw, cy + 4.2)]), 'c')
    elif opt == 'B':
        for i, x in enumerate((9.0, 11.4, 14.6, 17.0)): tent(c, x, cy + 4.6, 9.0, ph + i * 1.3, 'q', 'L', 1.0, fwd, 0.5)          # 짧은 빛 촉수
        for i, x in enumerate((11.0, 14.4)):                                                                                   # 프릴 같은 입팔
            pts = [(x + 1.6 * math.sin(ph + k * 1.1 + i) + fwd * k / 5, cy + 5.0 + k * 1.8) for k in range(6)]
            c.fill(path(pts, 1.4, 0.9), 'R'); c.only(path(pts, 0.4), 'r', 'R')
        bell = ell(cx, cy + 1.4, 7.8 * sw, 5.8 * sw) - {(x, y) for x in range(28) for y in range(int(cy + 4.8), 34)}
        c.fill(bell, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        spiral = []
        for k in range(36):
            a = k * 0.42 + ph * 0.3; r = 0.3 + k * 0.16
            spiral.append((cx + math.cos(a) * r * 1.3 * sw, cy + 1.0 + math.sin(a) * r * 0.8 * sw))
        c.only(thins(spiral), 'P', 'CQc'); c.only({(int(cx), int(cy + 1))}, 'L', 'PCQc')                                       # 은하 소용돌이 무늬
    else:
        for i, x in enumerate((9.4, 12.0, 14.6, 17.2)):                                                                        # 리본처럼 늘어진 촉수
            pts = [(x + 1.8 * math.sin(ph + k * 0.7 + i) + fwd * k / 7, cy + 6.0 + k * 2.2) for k in range(8)]
            c.fill(path(pts, 0.9, 0.5), 'R' if i % 2 else 'r')
        bell = rbox(cx - 5.6 * sw, cy - 6.0 * sw, cx + 5.6 * sw, cy + 6.0, 4.6 * sw)
        c.fill(bell, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        c.only(ell(cx, cy + 1.6, 2.6, 3.0), 'Y', 'CQc'); c.only(ell(cx, cy + 1.6, 1.2, 1.6), 'L', 'Y')                          # 갓 속 등불 같은 빛
        for (x, y) in [(x, y) for (x, y) in bell if (x, y + 1) not in bell or (x - 1, y) not in bell or (x + 1, y) not in bell]: c.set(x, y, 'B')   # 하늘빛 빛 테
    if mode == 'spit': c.fill(ell(cx + 6.6, cy + 1.0, 1.4, 1.4), 'L')
    return c


PAL = {
    'A': {'C': '#8a5ad0', 'Q': '#c09aff', 'c': '#5a3696', 'P': '#ff8ad0', 'B': '#6ab8ff', 'L': '#ffffff', 'p': '#a87ae8'},
    'B': {'C': '#3a4aa8', 'Q': '#6a7ae0', 'c': '#222e70', 'P': '#c8b0ff', 'L': '#ffffff', 'q': '#8ab8ff', 'R': '#b07ae8', 'r': '#e8c8ff'},
    'C': {'C': '#24306e', 'Q': '#3a4a9a', 'c': '#141c48', 'B': '#7ae8ff', 'Y': '#ffd870', 'L': '#fffbe0', 'R': '#5ab0e0', 'r': '#a0dcff'},
}
LAB = {'A': ('A 보랏빛 성운 해파리', '반투명 보랏빛 갓 속에 분홍 · 파랑 성운과 별 · 끝이 빛나는 긴 물결 촉수 다섯 · 마법을 쏠 때 갓이 부풀었다 오므린다'),
       'B': ('B 은하 소용돌이 해파리', '남빛 갓 위에 감긴 연보랏빛 은하 소용돌이 무늬(가운데 별) · 보랏빛 프릴 입팔 둘 · 짧은 빛 촉수'),
       'C': ('C 등롱 해파리', '위로 긴 남빛 갓과 하늘빛 빛 테 · 갓 속 등불 같은 금빛 · 리본처럼 늘어진 하늘빛 촉수 넷')}
for opt in 'ABC':
    fr = {m: jelly(m, opt) for m in MODES}
    B.add('nebula' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'], fr['idle1']], PAL[opt], (20, 10), 13, pad=3,
          gm={m: fr[m] for m in ('bite', 'swell', 'spit')})
B.dump()
