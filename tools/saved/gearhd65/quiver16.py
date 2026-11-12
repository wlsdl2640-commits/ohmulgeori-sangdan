"""화살통 16단계 시안: python3 quiver16.py <출력 폴더> [번호,…] → q_00.png … + quiver16.png"""
import sys, os
from quiver_hd import *
A3 = [(-0.6, -10, 15), (0.6, 9, 16), (0.0, -1, 20)]
A4 = [(-0.7, -12, 14), (0.72, 11, 15), (-0.2, -4, 19), (0.3, 4, 21)]
A5 = [(0.05, 1, 22), (-0.75, -13, 14), (0.75, 12, 15), (-0.25, -5, 18), (0.3, 4, 20)]
def icicles(tw0, ths, ln=4.0, k=1.06, R='ice'):
    def f(C):
        for th0 in ths:
            q = C['S'](tw0, th0, k); tri(C['A'], q, -C['F'].ax, ln * (1 - 0.25 * abs(th0)), 1.3, R)
    return f
def leaves(tw0, ths, ln=6.5, w=2.3, R='vine', k=1.08, down=True):
    def f(C):
        for i, th0 in enumerate(ths):
            q = C['S'](tw0, th0, k); d = (-C['F'].ax if down else C['F'].ax) + C['F'].nx * math.sin(th0) * 0.7
            leaf(C['A'], q, d, ln - (i % 2), w, R)
    return f
def roots(R='dwood'):
    def f(C):
        F = C['F']
        for th0, ln in ((-1.0, 6.5), (0.1, 5.0), (1.0, 6.0)):
            q = C['S'](0.03, th0, 1.0); tri(C['A'], q + F.ax * 1.5, -F.ax * 0.8 + F.nx * math.sin(th0) * 0.9, ln, 1.8, R)
    return f
def tipcrystal(R='ice', ln=8, w=3.4, glow=None):
    def f(C):
        F = C['F']; q = F.P(-K * C['rb'] / F.L + 0.03); crystal(C['A'], q, -F.ax, ln, w, R, glow=glow)
        crystal(C['A'], q - F.nx * 3.2 + F.ax * 0.5, -F.ax - F.nx * 0.5, ln * 0.6, w * 0.6, R); crystal(C['A'], q + F.nx * 3.2 + F.ax * 0.5, -F.ax + F.nx * 0.5, ln * 0.55, w * 0.6, R)
    return f
def gemat(tw0, th0, r, R, shape='dia', ring='gold', glow=None, k=1.0):
    def f(C):
        q = C['S'](tw0, th0, k); gem(C['A'], (q[0], q[1]), r, R, shape, ring=ring, glow=glow)
    return f
def aura(c, r=3.2, a=0.55):
    def f(C): C['A'].glow(C['A'].on, c, r, a)
    return f
def crown(n=5, amp=0.10): return lambda th: amp * np.abs(np.sin(th * n * 0.5 + 0.4)) ** 3
SPECS = [
 ('낡은 가죽 화살통', '손때 묻은 가죽 통 · 기운 자국 · 가는 끈', dict(seed=3, rt=8.8, rb=7.6, body='worn', tex=0.13, skin=[seam(0.40), patch(0.30, 0.54, -0.75, 0.05, 'leather')],
   collar=dict(R='worn', a=0.90, k=1.04), cap=dict(R='dleather', h=0.11, k=1.03), strap=dict(R='dleather', w=2.0, bulge=8, a=0.88, b=0.14),
   arrows=A3, akw=dict(fe='white', style='para', shaft='worn'))),
 ('사냥꾼의 화살통', '기름 먹인 가죽 · 접어 박은 목 테 · 쇠 죔쇠 끈', dict(seed=5, rt=9.3, rb=7.4, body='leather', tex=0.09, skin=[seam(0.48)],
   collar=dict(R='tan', a=0.82, k=1.09), cap=dict(R='dleather', h=0.15, k=1.05), strap=dict(R='dleather', w=3.0, bulge=9.5, a=0.90, b=0.12, buckle='iron'),
   arrows=A3, akw=dict(fe='white', tip='brown', style='shield'))),
 ('덧댄 가죽 화살통', '마름모로 누빈 겉가죽 · 작은 주머니 · 징 박은 목 테', dict(seed=7, rt=9.4, rb=7.8, body='dleather', tex=0.07, pat=p_quilt(5.6),
   collar=dict(R='tan', a=0.83, k=1.09, riv=4, rivR='iron'), cap=dict(R='tan', h=0.15, k=1.06), mid=[emb(0.44, -0.25, 4.6, 5.2, 'leather', 'rect'), emb(0.52, -0.25, 4.9, 2.0, 'tan', 'rect')],
   strap=dict(R='leather', w=3.0, bulge=9.5, a=0.90, b=0.12, buckle='iron'), arrows=A3, akw=dict(fe='red', tip='white', style='para'))),
 ('털가죽 화살통', '목과 밑동에 두른 흰 털 · 붉은 깃 장식', dict(seed=9, rt=9.4, rb=7.2, body='tan', tex=0.10, skin=[seam(0.46, '#3a2414')],
   collar=dict(k=1.15, rimR='fur'), mid=[fur(0.78, 1.0, 'fur', 1.15), fur(0.0, 0.13, 'fur', 1.12)], bands=[dict(a=0.42, b=0.50, R='dleather', k=1.04)],
   strap=dict(R='leather', w=2.8, bulge=9.5, a=0.86, b=0.16), arrows=A3, akw=dict(fe='green', tip='white', style='shield'), front=[hang(1.25, 0.80, 4, 'feather', 'red', k=1.15)])),
 ('쇠테 화살통', '쇠 테 셋으로 조인 통 · 금빛 징 · 쇠 밑동', dict(seed=11, rt=9.2, rb=8.0, body='dleather', tex=0.07,
   collar=dict(R='iron', a=0.82, k=1.10, riv=4, rivR='gold', met=1), cap=dict(R='iron', h=0.17, k=1.07, knob='iron', met=1), bands=[dict(a=0.44, b=0.55, R='iron', k=1.06, riv=3, rivR='gold', met=1)],
   strap=dict(R='dleather', w=3.0, bulge=9.5, a=0.90, b=0.12, buckle='iron'), arrows=A4, akw=dict(fe='white', band='black', style='para'))),
 ('푸른 천 화살통', '푸른 천을 비스듬히 감은 통 · 노란 술', dict(seed=13, rt=9.6, rb=6.9, body='blue', tex=0.05, pat=p_wrap(5.2, 0.9),
   collar=dict(R='tan', a=0.84, k=1.08, riv=3, rivR='gold'), cap=dict(R='tan', h=0.16, k=1.06), bands=[dict(a=0.40, b=0.47, R='tan', k=1.04)],
   strap=dict(R='tan', w=2.8, bulge=9.5, a=0.90, b=0.12, buckle='gold'), arrows=A4, akw=dict(fe='blue', tip='white', style='shield'), front=[hang(1.2, 0.84, 3, 'tassel', 'yellow', 'gold')])),
 ('청동 장식 화살통', '나팔꽃처럼 벌어진 청동 목 테 · 해 무늬 판', dict(seed=15, rt=9.9, rb=7.2, bulge=0.5, body='leather', tex=0.08,
   collar=dict(R='bronze', a=0.80, k=1.15, met=1, riv=5, rivR='gold'), cap=dict(R='bronze', h=0.18, k=1.08, knob='bronze', met=1), bands=[dict(a=0.30, b=0.36, R='bronze', k=1.04, met=1)],
   mid=[emb(0.57, -0.28, 4.6, 5.4, 'bronze', 'round', 'sun', 'gold')], strap=dict(R='dleather', w=3.0, bulge=9.5, a=0.88, b=0.12, buckle='bronze'),
   arrows=A4, akw=dict(fe='orange', tip='yellow', style='swept'))),
 ('숲지기 화살통', '이끼빛 가죽 · 덩굴 감기 · 잎사귀 목 테', dict(seed=17, rt=9.2, rb=7.0, body='green', tex=0.09, skin=[vine(10.5, 1.0, 'vine', 0.15, 0.14, 0.74)],
   collar=dict(R='dwood', a=0.86, k=1.07), cap=dict(R='dwood', h=0.14, k=1.06), mid=[leaves(0.86, (-0.9, -0.3, 0.3, 0.9), 7.0, 2.4, 'vine', 1.07), emb(0.50, -0.3, 3.8, 4.6, 'bronze', 'shield', 'leaf', 'jade')],
   strap=dict(R='dleather', w=2.6, bulge=9.5, a=0.88, b=0.12), arrows=A4, akw=dict(fe='green', tip='yellow', style='leaf'), front=[hang(1.25, 0.84, 3, 'feather', 'yellow', k=1.07)])),
 ('은장 화살통', '흰 가죽에 은 테 · 푸른 보석', dict(seed=19, rt=9.4, rb=7.0, body='white', tex=0.05, skin=[seam(0.5, '#8890a8')],
   collar=dict(R='silver', a=0.81, k=1.10, met=1), cap=dict(R='silver', h=0.18, k=1.07, knob='silver', met=1), bands=[dict(a=0.36, b=0.42, R='silver', k=1.04, met=1)],
   mid=[gemat(0.905, -0.25, 2.3, 'blue', 'dia', 'gold', k=1.10), gemat(0.58, -0.28, 2.6, 'blue', 'oval', 'silver')],
   strap=dict(R='white', w=2.8, bulge=9.5, a=0.90, b=0.12, buckle='silver'), arrows=A4, akw=dict(fe='white', tip='blue', style='swept', shaft='white'))),
 ('붉은 용비늘 화살통', '붉은 비늘 가죽 · 뼈 가시 박힌 흑철 테 · 송곳니 장식', dict(seed=21, rt=10.0, rb=7.4, body='scale', tex=0.04, pat=p_scales(4.6, 4.3),
   collar=dict(R='steeld', a=0.82, k=1.10, met=1), cap=dict(R='steeld', h=0.16, k=1.07, met=1), mid=[spikes(0.90, (-1.3, -0.45, 0.45, 1.3), 5.0, 1.8, 'bone', 1.10)],
   front=[hang(1.2, 0.82, 3, 'fang', 'bone', k=1.10), lambda C: tri(C['A'], C['F'].P(-K * C['rb'] / C['F'].L + 0.05), -C['F'].ax, 6.5, 2.6, 'bone')],
   strap=dict(R='dleather', w=3.0, bulge=9.5, a=0.88, b=0.12, buckle='steeld'), arrows=A4, akw=dict(fe='black', tip='red', style='swept', shaft='dwood'))),
 ('흑철 화살통', '검은 쇠판 통 · 금 테두리 · 보랏빛 보석', dict(seed=23, rt=9.6, rb=8.2, body='black', tex=0.03, sheen=0.22, pat=p_plates(7.4),
   collar=dict(R='black', a=0.80, k=1.10, met=1, rimR='gold'), cap=dict(R='black', h=0.17, k=1.07, knob='gold', met=1),
   bands=[dict(a=0.775, b=0.81, R='gold', k=1.11, met=1), dict(a=0.165, b=0.20, R='gold', k=1.08, met=1)], mid=[gemat(0.52, -0.3, 3.0, 'purple', 'dia', 'gold', '#b070ff')],
   strap=dict(R='steeld', w=2.8, bulge=9.5, a=0.88, b=0.12, chain=1), arrows=A4, akw=dict(fe='purple', band='black', style='shield', shaft='dwood'))),
 ('서리 수정 화살통', '얼음 수정을 깎은 통 · 흰 털 목 테 · 고드름', dict(seed=25, rt=9.6, rb=6.6, body='ice', tex=0.03, sheen=0.25, pat=p_facets(6.5, 0.17),
   collar=dict(k=1.15, rimR='fur'), mid=[fur(0.80, 1.0, 'fur', 1.15), icicles(0.40, (-0.9, -0.35, 0.2, 0.75), 4.5, 1.05)], bands=[dict(a=0.40, b=0.46, R='silver', k=1.05, met=1)],
   front=[tipcrystal('ice', 8, 3.2)], strap=dict(R='white', w=2.6, bulge=9.5, a=0.86, b=0.2), arrows=A4, akw=dict(fe='cyan', tip='white', style='dia', shaft='silver'))),
 ('황금 왕실 화살통', '붉은 우단에 금 테 · 왕관 꼴 목 테 · 홍옥', dict(seed=27, rt=9.9, rb=7.3, bulge=0.6, body='red', tex=0.04, pat=p_quilt(6.2),
   collar=dict(R='gold', a=0.80, k=1.12, met=1, top=crown(6, 0.09)), cap=dict(R='gold', h=0.19, k=1.08, knob='red', met=1), bands=[dict(a=0.34, b=0.40, R='gold', k=1.05, met=1)],
   mid=[emb(0.59, -0.28, 4.8, 5.4, 'gold', 'round'), gemat(0.59, -0.28, 2.5, 'red', 'round', None), gemat(0.90, -0.3, 2.0, 'red', 'dia', None, k=1.12)],
   strap=dict(R='red', w=3.0, bulge=9.5, a=0.88, b=0.12, buckle='gold'), arrows=A5, akw=dict(fe='red', tip='gold', style='shield'), front=[hang(1.2, 0.82, 3, 'tassel', 'red', 'gold', k=1.12)])),
 ('폭풍 화살통', '먹구름빛 통에 번개 무늬 · 은 테 · 빛나는 깃', dict(seed=29, rt=9.6, rb=7.0, body='navy', tex=0.05, sheen=0.16,
   skin=[bolt([(0.80, -0.45), (0.60, 0.10), (0.65, -0.25), (0.40, 0.25), (0.45, -0.10), (0.20, 0.30)])],
   collar=dict(R='silver', a=0.82, k=1.10, met=1), cap=dict(R='silver', h=0.17, k=1.07, met=1), mid=[gemat(0.905, -0.3, 2.3, 'yellow', 'dia', None, '#ffe060', k=1.10)],
   front=[lambda C: tri(C['A'], C['F'].P(-K * C['rb'] / C['F'].L + 0.05), -C['F'].ax, 6.0, 2.4, 'silver')],
   strap=dict(R='navy', w=2.8, bulge=9.5, a=0.88, b=0.12, buckle='silver'), arrows=A5, akw=dict(fe='yellow', tip='white', style='flame', lum=True, glow='#ffe060', shaft='silver'))),
 ('세계수 화살통', '살아 있는 나무 통 · 덩굴과 새잎 · 수액 구슬', dict(seed=31, rt=9.6, rb=7.6, body='wood', tex=0.05, pat=p_grain(1.9), skin=[vine(11.0, 1.1, 'vine', 0.14, 0.16, 0.80)],
   collar=dict(R='dwood', a=0.84, k=1.08), cap=dict(R='dwood', h=0.14, k=1.05), back=[roots('dwood')],
   mid=[leaves(0.84, (-1.0, -0.4, 0.2, 0.85), 7.5, 2.6, 'vine', 1.08), gemat(0.52, -0.3, 3.0, 'jade', 'round', 'gold', '#80ffb0')],
   strap=dict(R='vine', w=2.4, bulge=9.5, a=0.86, b=0.14), arrows=A5, akw=dict(fe='vine', tip='yellow', style='leaf', shaft='wood'), front=[leaves(1.0, (-1.2, 1.2), 6.5, 2.4, 'vine', 1.12, down=False)])),
 ('별빛 화살통', '밤하늘을 담은 통 · 백금 테와 날개 · 빛의 깃', dict(seed=33, rt=9.8, rb=7.0, body='star', tex=0.06, sheen=0.14, skin=[stars(24, 5)],
   collar=dict(R='plat', a=0.81, k=1.10, met=1), cap=dict(R='plat', h=0.18, k=1.07, knob='cyan', met=1), bands=[dict(a=0.36, b=0.41, R='plat', k=1.04, met=1)],
   back=[wing(-1, 4, 'white', 15, 0.86)], mid=[gemat(0.60, -0.28, 3.0, 'cyan', 'dia', 'plat', '#80e8ff')],
   strap=None, arrows=A5, akw=dict(fe='cyan', tip='white', style='swept', lum=True, glow='#80e8ff', shaft='plat'), front=[wing(1, 3, 'white', 12, 0.86), aura('#6090ff', 3.0, 0.5)])),
]
LV = [1] + list(range(10, 151, 10))
if __name__ == '__main__':
    out = sys.argv[1]; os.makedirs(out, exist_ok=True); only = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 else range(16)
    items = []
    for i in only:
        nm, ds, o = SPECS[i]; im = quiver(o).image(96); im.save(f'{out}/q_{i:02d}.png'); items.append((im, f'Lv{LV[i]}', nm, ds))
    print(sheet(items, f'{out}/quiver16.png', '화살통 16단계 시안', '궁수 계열 공용 부장비 · Lv1 ~ 150 · 왼쪽 위 작은 그림 = 게임 창고 칸 크기', cols=4, z=2))
