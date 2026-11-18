import numpy as np, json
from PIL import Image
from scipy import ndimage
from seg import sheet_path, runs
rgb = np.array(Image.open(sheet_path('4ea8aeea')).convert('RGB')).astype(int)
L = [84, 150, 215, 280, 342, 403, 470, 535, 598, 660, 722, 788, 853, 922]
IDS = ['bash', 'taunt', 'ironwall', 'ironskin', 'sweep', 'berserk', 'riposte', 'resolve', 'earthsplit', 'shockwave', 'warcry', 'guardian', 'titanblow']
boxes = []
S = Image.new('RGB', (13 * 70, 70), (40, 40, 40))
for i, sid in enumerate(IDS):
    y0, y1 = L[i] + 3, L[i + 1] - 2
    reg = rgb[y0:y1, 30:140]; fg = reg.sum(axis=2) > 90
    lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
    big = lab == (int(np.argmax(sz)) + 1)
    ys, xs = np.where(big)
    bx = (xs.min() + 30, ys.min() + y0, xs.max() + 31, ys.max() + y0 + 1)
    boxes.append(bx); print(sid, bx, bx[2] - bx[0], bx[3] - bx[1])
    S.paste(Image.fromarray(rgb[bx[1]:bx[3], bx[0]:bx[2]].astype(np.uint8)), (i * 70 + 4, 4))
S.resize((S.width * 2, S.height * 2), Image.NEAREST).save('sk_icons_raw.png')
json.dump(dict(zip(IDS, boxes)), open('sk_boxes.json', 'w'), default=int)
