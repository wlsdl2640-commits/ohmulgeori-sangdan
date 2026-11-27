"""잘림을 고친 점토 협곡 동작 비교판 — 예전(잘림) | 새로(여백 넉넉) · 공격은 고른 씨앗.  python review78/mkfix.py (anim77에서)
   고른 것은 review78/fix_pick.json (게임에 넣을 때 이걸 본다)"""
import os, json, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
P = json.load(open('pick.json', encoding='utf-8'))
def score(d):
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png')); al = [np.asarray(Image.open(f'{d}/{f}'))[..., 3] > 0 for f in fs]; med = np.median([x.sum() for x in al])
    e = sum(1 for x in al if x[0].any() or x[-1].any() or x[:, 0].any() or x[:, -1].any())
    j = sum(1 for i in range(1, len(al)) if (al[i] ^ al[i - 1]).sum() / med > 0.5)
    b = 0
    for x in al:
        lab, n = ndimage.label(x)
        if n > 1 and sorted(ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)))[-2] >= 20: b += 1
    return e * 5 + j + b * 3
NEW = {'jawlizard': 'f_jawlizard', 'otter': 'f_otter', 'canyonbat': 'f2_canyonbat', 'hawk': 'f_hawk', 'earwig': 'f_earwig'}
ROWS = {'jawlizard': ['idle', 'walk', 'atk'], 'otter': ['idle', 'walk', 'atk'], 'canyonbat': ['walk', 'atk'], 'hawk': ['walk', 'atk'], 'earwig': ['walk']}
NAME = {'jawlizard': '턱도마뱀', 'otter': '둑 수달', 'canyonbat': '협곡 박쥐', 'hawk': '[보스] 협곡 사냥매', 'earwig': '[보스] 수로 집게벌레'}
RN = {'idle': '가만히', 'walk': '걷기', 'atk': '공격'}
def old(m, r):
    k = f'c_{m}/{r}'; return f"clean/c_{m}/{P[k]['pick']}" if k in P else f'../anim76/clean/{m}/{r}'
pick = {}
for m, k in NEW.items():
    for r in ROWS[m]:
        c = sorted(x for x in os.listdir(f'clean/{k}') if x.startswith(r + '_'))
        pick[f'{m}/{r}'] = f'clean/{k}/' + min(c, key=lambda x: score(f'clean/{k}/{x}'))
json.dump(pick, open('review78/fix_pick.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
CELL = 170; F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 15)
def seq(d, full):   # 판 그대로(잘림이 보이게) 칸에 맞춤
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png')); ims = [Image.open(f'{d}/{f}').convert('RGBA') for f in fs]
    s = (CELL - 10) / ims[0].width
    return [im.resize((round(im.width * s), round(im.height * s)), Image.NEAREST) for im in ims]
rows = [(f'{NAME[m]} · {RN[r]}', seq(old(m, r), 0), seq(pick[f'{m}/{r}'], 1)) for m in NEW for r in ROWS[m]]
W = 200 + 2 * (CELL + 10); H = 50 + len(rows) * (CELL + 8); out = []
for t in range(40):
    im = Image.new('RGB', (W, H), (26, 28, 36)); d = ImageDraw.Draw(im)
    d.text((10, 10), '잘린 동작 고침 — 빨간 테 = 그림 판 가장자리', font=F, fill=(240, 180, 60))
    d.text((210, 30), '예전', font=F, fill=(236, 228, 208)); d.text((210 + CELL + 10, 30), '새로', font=F, fill=(236, 228, 208))
    for i, (lab, a, b) in enumerate(rows):
        y = 52 + i * (CELL + 8); d.text((10, y + CELL // 2 - 8), lab, font=F, fill=(236, 228, 208))
        for j, fr in enumerate((a, b)):
            x = 200 + j * (CELL + 10); f = fr[t % len(fr)]
            d.rectangle([x, y, x + CELL - 1, y + CELL - 1], fill=(44, 48, 60))
            ox, oy = x + (CELL - f.width) // 2, y + (CELL - f.height) // 2
            im.paste(f, (ox, oy), f); d.rectangle([ox - 1, oy - 1, ox + f.width, oy + f.height], outline=(220, 70, 70))
    out.append(im)
out[0].save('review78/canyon_cutfix.gif', save_all=True, append_images=out[1:], duration=90, loop=0, optimize=True); print(pick)
