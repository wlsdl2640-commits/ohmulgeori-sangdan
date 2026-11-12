"""식재료 · 요리 그림 → 게임 src/data-foodart.js (빌드 65, 11-12 20:34 「다 넣어」)
python3 export_food.py <출력 data-foodart.js> [미리보기.png]
- ing68.py: 시안에서 보인 그림 30개(하르겐 시장 8 · 나라 특산 10 · 해산물 6 · 무정란 · 요리 4 · 레시피) — 그대로
- dishes.py: 나머지 요리 22가지(같은 결의 그릇 · 접시 · 잔)
ITEMART 열쇠 'f_<아이템 id>' (레시피 아이템 rcp_*는 모두 'f_recipe') — 손으로 고치지 말 것"""
import sys, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import ing68, dishes
from PIL import Image
A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-/:;<=>?@[]^_{}~'
def enc(im):
    im = im.convert('RGBA'); px = im.load(); pal = []; cells = []
    for y in range(20):
        for x in range(20):
            r, g, b, a = px[x, y]
            if a == 0: cells.append('.'); continue
            c = '%02x%02x%02x' % (r, g, b)
            if c not in pal: pal.append(c)
            cells.append(A[pal.index(c)])
    assert len(pal) <= len(A), len(pal)
    return ''.join(pal) + '|' + ''.join(cells)
out = {}
for k, v in ing68.ICONS.items(): out['f_' + k] = v['im']
for k, fn in dishes.DISH.items(): out['f_food_' + k] = fn()
js = ['/* 식재료 · 요리 그림 (빌드 65, 20×20 「팔레트|칸 400」 — ITEMART와 같은 꼴). tools/saved/food68/export_food.py로 뽑는다 — 손으로 고치지 말 것 */',
      'Object.assign(ITEMART, {'] + [f"  {k}: {enc(im)!r}," for k, im in out.items()]
js[-1] = js[-1].rstrip(','); js += ['});', '']
pathlib.Path(sys.argv[1]).write_text('\n'.join(js).replace("'", '"'), encoding='utf-8')
print(len(out), 'icons')
if len(sys.argv) > 2:
    keys = list(out); cols = 10; S = 4; W = 20 * S + 6
    sh = Image.new('RGBA', (cols * W, ((len(keys) + cols - 1) // cols) * W), (60, 56, 70, 255))
    for i, k in enumerate(keys): sh.alpha_composite(out[k].resize((20 * S, 20 * S), Image.NEAREST), ((i % cols) * W + 3, (i // cols) * W + 3))
    sh.save(sys.argv[2])
