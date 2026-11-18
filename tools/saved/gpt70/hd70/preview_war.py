import json
from PIL import Image, ImageDraw
M = json.load(open('out_war/meta.json')); W, H = M['w'], M['h']
rows = []
for r, n in M['rows'].items():
    row = Image.new('RGBA', (n * (W + 4), H + 4), (90, 140, 90, 255)); d = ImageDraw.Draw(row)
    for i in range(n):
        f = Image.open(f'out_war/{r}_{i}.png'); row.alpha_composite(f, (i * (W + 4), 2))
        d.line((i * (W + 4) + M['ax'], 0, i * (W + 4) + M['ax'], 3), fill=(255, 0, 0, 255))
    rows.append(row)
fr = Image.open('out_war/front.png'); fr2 = Image.new('RGBA', (fr.width + 4, fr.height + 4), (90, 140, 90, 255)); fr2.alpha_composite(fr, (2, 2)); rows.append(fr2)
S = Image.new('RGBA', (max(r.width for r in rows), sum(r.height + 2 for r in rows)), (30, 30, 30, 255)); y = 0
for r in rows: S.alpha_composite(r, (0, y)); y += r.height + 2
S = S.resize((S.width * 2, S.height * 2), Image.NEAREST); S.save('war_frames.png'); print(S.size)
