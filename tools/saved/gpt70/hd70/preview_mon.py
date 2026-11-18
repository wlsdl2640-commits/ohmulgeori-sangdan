import json, os
from PIL import Image, ImageDraw
M = json.load(open('out_mon/meta.json'))
ims = []
for mid, m in M.items():
    rows = []
    for r, n in m['rows'].items():
        fr = [Image.open(f'out_mon/{mid}/{r}_{i}.png') for i in range(n)]
        W, H = m['w'], m['h']; row = Image.new('RGBA', (n * (W + 4), H + 4), (90, 140, 90, 255))
        for i, f in enumerate(fr): row.alpha_composite(f, (i * (W + 4), 2)); d = ImageDraw.Draw(row); d.line((i * (W + 4) + m['ax'], 0, i * (W + 4) + m['ax'], 3), fill=(255, 0, 0, 255)); d.line((i * (W + 4), 2 + m['ay'], i * (W + 4) + W, 2 + m['ay']), fill=(255, 255, 0, 90))
        rows.append(row)
    S = Image.new('RGBA', (max(r.width for r in rows), sum(r.height + 2 for r in rows)), (30, 30, 30, 255)); y = 0
    for r in rows: S.alpha_composite(r, (0, y)); y += r.height + 2
    ims.append(S)
T = Image.new('RGBA', (max(i.width for i in ims), sum(i.height + 8 for i in ims)), (20, 20, 20, 255)); y = 0
for i in ims: T.alpha_composite(i, (0, y)); y += i.height + 8
T = T.resize((T.width * 3, T.height * 3), Image.NEAREST); T.save('mon_frames.png'); print(T.size)
