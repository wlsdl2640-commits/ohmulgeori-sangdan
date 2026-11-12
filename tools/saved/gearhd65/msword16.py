"""마나소드 16단계 시안: python3 msword16.py <출력 폴더> [번호,…] → m_00.png … + msword16.png"""
import sys, os
from msword_hd import *
sym = lambda f: (lambda s: (f(s), f(s)))
rin = lambda s: np.clip(s / 0.04, 0, 1) ** 0.5
pk = lambda s, c, h, w: h * np.clip(1 - np.abs(s - c) / w, 0, 1)
P_BROAD = sym(lambda s: 6.0 * (1 - s) ** 0.62 * rin(s) + 0.45 * (s < 0.985))
P_FLAME = lambda s: (5.0 * (1 - s) ** 0.6 * (1 + 0.22 * np.sin(s * 21)) * rin(s) + 0.4 * (s < 0.98), 5.0 * (1 - s) ** 0.6 * (1 + 0.22 * np.sin(s * 21 + 2.4)) * rin(s) + 0.4 * (s < 0.98))
P_KRIS = sym(lambda s: 3.7 * tp(s, 2.5, 0.7) * rin(s) + 0.45 * (s < 0.985))
P_SPIKE = sym(lambda s: 3.2 * tp(s, 2.8, 0.8) * rin(s) + pk(s, 0.09, 4.2, 0.055) + pk(s, 0.23, 3.0, 0.05) + pk(s, 0.37, 1.9, 0.045) + 0.4 * (s < 0.985))
P_JAG = lambda s: (4.8 * (1 - s) ** 0.55 * (1 + 0.34 * (((s * 5.0) % 1.0) - 0.5)) * rin(s) + 0.4 * (s < 0.98), 4.8 * (1 - s) ** 0.55 * (1 + 0.34 * (((s * 5.0 + 0.5) % 1.0) - 0.5)) * rin(s) + 0.4 * (s < 0.98))
P_SABER = lambda s: (2.6 * tp(s, 2.6, 0.8) * rin(s) + 0.4 * (s < 0.985), 5.2 * tp(s, 2.0, 0.95) * rin(s) + 0.4 * (s < 0.985))
P_LEAF = sym(lambda s: 6.2 * np.sin(np.pi * s ** 0.70) ** 0.85 + 1.2 * np.exp(-(s / 0.05) ** 2) + 0.4 * (s < 0.985))
P_NEEDLE = sym(lambda s: 2.3 * tp(s, 2.2, 0.6) + 2.4 * np.exp(-(s / 0.07) ** 2) + 0.3 * (s < 0.985))
P_CLEAVER = lambda s: (2.2 * np.clip((1 - s) / 0.10, 0, 1) ** 0.5 * rin(s) + 0.3 * (s < 0.985), 6.6 * np.clip((1 - s) / 0.24, 0, 1) ** 0.85 * rin(s) + 0.3 * (s < 0.985))
P_TWIN = sym(lambda s: 5.4 * tp(s, 4.0, 0.5) * rin(s))
P_AURORA = sym(lambda s: 4.9 * tp(s, 2.4, 0.8) * (0.86 + 0.16 * np.sin(s * 10)) * rin(s) + 0.4 * (s < 0.985))
P_WING = lambda s: (3.9 * (1 - s) ** 0.6 * rin(s) + 0.4 * (s < 0.985), 3.9 * (1 - s) ** 0.6 * rin(s) + 5.6 * np.exp(-((s - 0.13) / 0.085) ** 2) + 0.4 * (s < 0.985))
P_CRYSTAL = sym(lambda s: 5.7 * np.minimum(np.minimum(s / 0.10, 1), np.clip((1 - s) / 0.26, 0, 1)) + 0.4 * (s < 0.985))
P_STRAIGHT = sym(lambda s: 4.2 * tp(s, 3.2, 0.7) * rin(s) + 1.8 * np.exp(-((s - 0.04) / 0.05) ** 2) + 0.4 * (s < 0.985))
P_STAR = sym(lambda s: 3.8 * tp(s, 3.0, 0.75) * rin(s) + pk(s, 0.10, 4.6, 0.07) + 0.4 * (s < 0.985))
SPECS = [
 ('마나 칼날', '넓게 뿜는 푸른 마나 날 · 청동 날개 자루', dict(seed=2, R='azure', prof=P_BROAD, gripR='dleather', hilt=[collar(14.5, 18.5, 3.0, 'bronze'), wings(17.0, 7.0, 0.75, 2.2, 'bronze'), pommel('bronze', 2.6)])),
 ('푸른 불씨', '불꽃처럼 일렁이는 날 · 쇠 가로대', dict(seed=3, R='cyan', prof=P_FLAME, gripR='blue', wisps=7, hilt=[bar(16.5, 6.5, 1.5, 'iron', 'iron'), collar(13.5, 15.2, 2.6, 'iron'), pommel('iron', 2.6)])),
 ('물결 마나소드', '물결치며 흐르는 청록 날 · 은 초승 자루', dict(seed=4, R='teal', prof=P_KRIS, bend=lambda s: 2.3 * np.sin(s * 13.5) * (1 - 0.55 * s) * np.clip(s / 0.08, 0, 1), gripR='dleather',
   hilt=[crescent(15.0, 5.2, 1.5, 'silver', 0.35), collar(13.0, 15.0, 2.5, 'silver'), pommel('silver', 2.9, shape='ring')])),
 ('서릿발', '곁가시가 돋은 서리 날 · 얼음 보석', dict(seed=5, R='frost', prof=P_SPIKE, gripR='white', spark=10, hilt=[collar(14.0, 18.0, 3.1, 'silver'), gemg(16.0, 2.2, 'ice', 'dia', None), pommel('silver', 2.5, gemR='ice')])),
 ('뇌전 칼날', '번개처럼 꺾인 보랏빛 날 · 금 발톱 자루', dict(seed=6, R='violet', prof=P_JAG, gripR='purple', wisps=6, hilt=[claws(15.5, 2, 6.5, 'gold', 4.0), collar(13.5, 17.0, 3.0, 'steeld'), pommel('gold', 2.4, shape='spike')])),
 ('달빛 세이버', '한쪽으로 휜 달빛 날 · 은 원반 코등이', dict(seed=7, R='moon', prof=P_SABER, bend=lambda s: -3.6 * np.sin(np.pi * s * 0.9) * s, gripR='navy',
   hilt=[disc(16.5, 5.6, 1.7, 'silver'), gemg(16.5, 1.9, 'blue', 'round', None), collar(13.5, 15.0, 2.4, 'silver'), pommel('silver', 2.7)])),
 ('비취 잎날', '잎사귀 꼴로 부푼 비취 날 · 덩굴 자루', dict(seed=8, R='jade', prof=P_LEAF, gripR='wood', hilt=[wings(16.5, 6.5, 1.1, 2.4, 'vine'), collar(14.0, 17.5, 2.9, 'bronze'), pommel('bronze', 2.5, gemR='jade')])),
 ('성운의 송곳', '가늘고 긴 보랏빛 심 · 날을 두른 빛 고리', dict(seed=9, R='purple', prof=P_NEEDLE, gripR='black', blade=[ringfx(0.20, 7.0, 1.2), ringfx(0.42, 4.6, 1.0)],
   hilt=[disc(16.5, 4.8, 1.6, 'gold'), gemg(16.5, 1.8, 'purple', 'round', None), collar(13.5, 15.0, 2.4, 'gold'), pommel('gold', 3.0, shape='ring')])),
 ('태양 대도', '한쪽 날이 넓은 금빛 큰 칼 · 홍옥', dict(seed=10, R='sun', prof=P_CLEAVER, gripR='red', hilt=[bar(17.0, 6.0, 1.5, 'gold', 'gold'), collar(13.5, 16.0, 2.8, 'gold'), gemg(14.8, 1.8, 'red', 'round', None), pommel('gold', 2.8)])),
 ('심연의 틈', '속이 검은 두 갈래 날 · 흑철 발톱', dict(seed=11, R='abyss', dark=True, prof=P_TWIN, gap=lambda s: 2.1 * np.clip((s - 0.22) / 0.22, 0, 1), gripR='black', spark=8,
   hilt=[claws(15.0, 3, 7.0, 'black', 4.2), collar(13.5, 17.0, 3.0, 'steeld'), gemg(15.4, 1.9, 'purple', 'dia', None, '#c060ff'), pommel('steeld', 2.4, shape='spike')])),
 ('오로라 리본', '빛깔이 흘러 바뀌는 리본 날 · 백금 초승 자루', dict(seed=12, R='aurora', prof=P_AURORA, bend=lambda s: 1.5 * np.sin(s * 8.0) * s, gripR='white', blade=[aurora_cols()],
   hilt=[crescent(15.0, 5.6, 1.6, 'plat', 0.4), collar(13.0, 15.0, 2.5, 'plat'), gemg(14.0, 1.8, 'cyan', 'round', None), pommel('plat', 2.7)])),
 ('홍염의 송곳니', '밑동에 큰 미늘이 돋은 붉은 날 · 뼈 발톱', dict(seed=13, R='crimson', prof=P_WING, gripR='dleather', wisps=7, hilt=[claws(15.5, 2, 6.0, 'bone', 3.8), collar(13.5, 17.0, 3.0, 'steeld'), pommel('bone', 2.4, shape='spike')])),
 ('수정 대검', '모서리가 선 수정 날 · 은 날개 자루', dict(seed=14, R='rose', prof=P_CRYSTAL, gripR='white', blade=[facets(0.2, 6.5)], hilt=[wings(16.5, 7.5, 0.5, 2.3, 'silver', 0.5), collar(14.0, 18.0, 3.0, 'silver'), gemg(16.0, 2.0, 'pink', 'dia', None), pommel('silver', 2.6, gemR='pink')])),
 ('세계수의 가지', '금빛 심이 든 초록 날 · 살아 있는 나무 자루', dict(seed=15, R='emerald', prof=P_STRAIGHT, gripR='wood', blade=[core('star', 0.36)], hilt=[wings(16.0, 6.5, 1.3, 2.3, 'vine'), wings(15.0, 5.0, 0.2, 2.0, 'vine'), collar(14.0, 17.5, 2.8, 'gold'), pommel('gold', 2.6, gemR='jade')])),
 ('무지개 고리', '무지갯빛 날 · 떠도는 빛 조각과 고리', dict(seed=16, R='prism', hue=True, prof=P_STRAIGHT, gripR='navy', blade=[aurora_cols(('#60a0ff', '#60f0c0', '#fff080', '#ff90c0')), ringfx(0.18, 7.2, 1.2), shards(4, None, 4, 6.5, 5.0)],
   hilt=[disc(16.5, 5.4, 1.7, 'plat'), gemg(16.5, 1.9, 'cyan', 'round', None), collar(13.5, 15.0, 2.5, 'plat'), pommel('plat', 2.7, gemR='pink')])),
 ('별의 검', '흰 금빛 별빛 날 · 백금 두 겹 날개 · 빛 조각', dict(seed=17, R='star', prof=P_STAR, gripR='white', gr=3.2, ga=0.75, spark=22, blade=[core(ramp('#fff2b0', '#fff8d8', '#ffffff', '#ffffff'), 0.4), shards(4, None, 6, 7.0, 6.0)],
   hilt=[wings(16.5, 8.5, 0.6, 2.5, 'plat', 0.6), wings(15.5, 5.5, 1.4, 2.0, 'gold'), collar(14.0, 18.0, 3.0, 'gold'), gemg(16.0, 2.1, 'cyan', 'dia', None, '#80e8ff'), pommel('gold', 2.8, gemR='cyan')])),
]
LV = list(range(50, 201, 10))
if __name__ == '__main__':
    out = sys.argv[1]; os.makedirs(out, exist_ok=True); only = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 else range(16)
    items = []
    for i in only:
        nm, ds, o = SPECS[i]; im = msword(o).image(96); im.save(f'{out}/m_{i:02d}.png'); items.append((im, f'Lv{LV[i]}', nm, ds))
    print(sheet(items, f'{out}/msword16.png', '마나소드 16단계 시안', '마검사 · 마검성 무기 · Lv50 ~ 200 (지금 단계에는 앞 10개) · 왼쪽 위 작은 그림 = 게임 창고 칸 크기', cols=4, z=2))
