# 도적 동작 시안 쪽: python mk_page.py <출력 접두> [clean]  → <접두>_1.html … (쪽마다 1MB 아래)
import os, sys, json, io, base64
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(H, 'anim')
J = json.load(open(os.path.join(A, 'jobs_in.json'), encoding='utf-8'))
src = os.path.join(A, 'clean') if len(sys.argv) > 2 else A
BG = (52, 58, 52, 255); S = 2
def gif(d, n):
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
    fr = []
    for f in fs:
        im = Image.open(os.path.join(d, f)).convert('RGBA'); c = Image.new('RGBA', im.size, BG); c.alpha_composite(im)
        fr.append(c.convert('RGB').resize((im.width * S, im.height * S), Image.NEAREST).quantize(64, dither=Image.NONE))
    b = io.BytesIO(); fr[0].save(b, 'GIF', save_all=True, append_images=fr[1:], duration=90, loop=0, disposal=1)
    return base64.b64encode(b.getvalue()).decode()
mons = []; [mons.append((j['mon'], j['ko'])) for j in J if (j['mon'], j['ko']) not in mons]
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:16px 0 6px;color:#f0c878}p{opacity:.88;margin:4px 0}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;height:240px;width:auto;border-radius:6px}"
pages = []; cur = []; size = 0
for m, ko in mons:
    rows = [j for j in J if j['mon'] == m]; cards = ''
    for j in rows:
        d = os.path.join(src, m, j['row'])
        if not os.path.isdir(d): continue
        g = gif(d, j['frames']); size += len(g)
        cards += f"<div class=card><img src='data:image/gif;base64,{g}'><b>{ko} {j['row'][1:]}</b></div>"
    cur.append(f"<h3>{ko}</h3><div class=row>{cards}</div>")
    if size > 560000: pages.append(cur); cur = []; size = 0
if cur: pages.append(cur)
for i, p in enumerate(pages, 1):
    open(f"{sys.argv[1]}_{i}.html", 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>도적 동작 {i}</title><style>{CSS}</style><main><h2>도적(1차) 동작 시안 {i}/{len(pages)}</h2><p>동작마다 판 하나(예: 「비껴 찌르기 2」)를 골라 주세요. 다시 뽑을 동작도 말씀해 주세요.</p>{''.join(p)}</main>")
    print(f"{sys.argv[1]}_{i}.html", os.path.getsize(f"{sys.argv[1]}_{i}.html"))
