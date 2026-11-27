# 사제 1차 효과(고른 10개) 움직이는 GIF — 늪 배경 · 사제(서 있기) · 몬스터 위에.  python mk_prifx_gif.py <출력 폴더>
# 효과 = smooth.py(생김 거꾸로 + 사라짐 · 사이 장 섞기 · 처음/끝 옅어짐). 빛 구슬은 하얀 구슬을 45%로 줄여 사제 손에서 몬스터로 날아간다.
import os, sys
from PIL import Image, ImageDraw, ImageFont
from smooth import smooth
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
R = '../../../../'
bg = Image.open(R + 'plx73/bg_swamp/00.png').convert('RGBA'); mon = Image.open(R + 'plx74/pick/swampbrute_00.png').convert('RGBA')
IDLE = [Image.open('../anim/clean/idle/v5/' + f).convert('RGBA') for f in sorted(os.listdir('../anim/clean/idle/v5'))]
GY = 206; PX = 60; MX = 270
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 14)
# 키: (이름, 자리 'p' 사제 · 'm' 몬스터, 놓는 법 'c' 가운데 · 'b' 바닥, y 올림, 크기)
P = {'heal_a': ('작은 치유 ①', 'p', 'c', 50, 1), 'firstaid_a': ('상처 싸매기 ①', 'p', 'c', 52, 1), 'cure_a': ('해독 부적 ①', 'p', 'c', 54, 1),
     'bless_a': ('응원의 기도 ①', 'p', 'c', 92, 1), 'holyw': ('빛 구슬 ② 하얗게 45%', 'fly', 'c', 56, 0.45), 'weaken_a': ('눈부심 ①', 'm', 'c', 60, 1),
     'holyhammer_a': ('셉터 내려치기 ①', 'm', 'b', 0, 1), 'sanctuary_c': ('보호의 원 ③', 'p', 'b', -2, 1), 'massheal_a': ('모두의 기도 ①', 'p', 'b', 0, 1),
     'greatheal_c': ('정성 어린 치유 ③', 'p', 'b', 0, 1)}
def fit(im, s, mx=150):
    b = im.getbbox()
    if not b: return im
    k = min(s, mx / max(1, b[2] - b[0])) if s == 1 else s
    return im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.NEAREST)
def tile(): t = bg.crop((0, 0, 360, 224)).copy(); t.alpha_composite(mon, (360 - mon.width - 6, GY - mon.height + 4)); return t
import numpy as np
def grow(peak, mode, n=9):   # 생기는 장: 픽셀랩 생김 장은 엉뚱한 점에서 커져서(11-28 대표님 지적) 쓰지 않고, 가장 밝은 장을 제자리(가운데 · 바닥 가운데)에서 키운다
    b = peak.getbbox(); cx = (b[0] + b[2]) / 2; ay = (b[1] + b[3]) / 2 if mode == 'c' else b[3]; out = []
    for i in range(n):
        t = (i + 1) / (n + 1); sc = 0.25 + 0.75 * t
        r = peak.resize((max(1, round(peak.width * sc)), max(1, round(peak.height * sc))), Image.NEAREST)
        a = np.array(r); a[..., 3] = (a[..., 3] * (0.35 + 0.65 * t)).astype(np.uint8); r = Image.fromarray(a)
        c = Image.new('RGBA', peak.size); c.alpha_composite(r, (round(cx - cx * sc), round(ay - ay * sc))); out.append(c)
    return out
def core(im):   # 빛 구슬 몸 가운데 (꼬리 빛 말고 가장 밝은 덩어리)
    a = np.asarray(im).astype(int); m = (a[..., 3] > 0) & (a[..., :3].sum(-1) > 700)
    ys, xs = np.where(m) if m.any() else np.where(a[..., 3] > 0); return xs.mean(), ys.mean()
for k, (nm, at, mode, up, s) in P.items():
    eff, pk = smooth(k); eff = [fit(e, s) for e in eff]
    def lum(im):
        a = np.asarray(im).astype(float); m = a[..., 3] > 40
        return (a[..., :3][m].mean() if m.sum() > 20 else 0)
    L0 = lum(eff[pk]); cut = next((i for i in range(pk + 1, len(eff)) if lum(eff[i]) < 0.6 * L0), len(eff))   # 사라지며 어둡게 변하는 장(검은 고리)은 버리고
    if cut < len(eff):
        last = eff[cut - 1]; tail = []
        for j in range(10):
            a = np.array(last); a[..., 3] = (a[..., 3] * (1 - (j + 1) / 11)).astype(np.uint8); tail.append(Image.fromarray(a))
        eff = eff[:cut] + tail   # 마지막 밝은 장을 투명하게 옅어지게
    eff = grow(eff[pk], mode) + ([eff[pk]] * 14 if at == 'fly' else []) + eff[pk:]; pk = 9   # 빛 구슬: 다 커진 채 14장 날아간 뒤 몬스터 앞에서 사라진다
    b0 = eff[pk].getbbox() or (0, 0, eff[pk].width, eff[pk].height)
    if at == 'fly': ccx, ccy = core(eff[pk]); b0 = (ccx * 2 - 0, ccy * 2 - 0, 0, 0)
    out = []; n = len(eff) + 8
    for i in range(n):
        t = tile(); r = IDLE[i % len(IDLE)]; t.alpha_composite(r, (PX - r.width // 2 + 10, GY - r.height + 6))
        if i < len(eff):
            e = eff[i]; cx = PX + 10 if at == 'p' else MX
            if at == 'fly': cx = PX + 34 + (MX - PX - 34) * max(0, min(1, (i - pk) / 14))   # 지팡이 끝에서 생겨 다 커진 뒤 날아간다
            ox = int(cx - (b0[0] + b0[2]) / 2)
            oy = int((GY - up - (b0[1] + b0[3]) / 2) if mode == 'c' else (GY + 6 - b0[3]))
            if at == 'fly': oy = int(GY - 62 - (b0[1] + b0[3]) / 2)
            t.alpha_composite(e, (ox, oy))
        ImageDraw.Draw(t).text((6, 4), nm, font=F, fill=(255, 230, 150))
        out.append(t.convert('RGB').resize((720, 448), Image.NEAREST))
    out[0].save(f'{OUT}/{k}.gif', save_all=True, append_images=out[1:], duration=70, loop=0, optimize=True); print(k, len(out), os.path.getsize(f'{OUT}/{k}.gif') // 1024, 'KB')
