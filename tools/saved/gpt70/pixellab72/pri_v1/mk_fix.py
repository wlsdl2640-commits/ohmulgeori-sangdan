# 성표 시험 판 + 천천히 판(움직이는 장 두 번 · 뒤 정지 줄임): python mk_fix.py <출력.html>
import os, sys, io, base64, numpy as np
from PIL import Image
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'anim'); BG = (52, 58, 52, 255)
def load(d): return [Image.open(f'{A}/{d}/{f}').convert('RGBA') for f in sorted(os.listdir(f'{A}/{d}')) if f.endswith('.png')]
def retime(fr):
    al = [np.asarray(f)[:, :, 3] > 0 for f in fr]; mv = [0] + [(al[i] ^ al[i - 1]).sum() for i in range(1, len(fr))]
    last = max(i for i, m in enumerate(mv) if m > 50); out = []
    for i, f in enumerate(fr[:last + 9]): out += [f, f] if mv[i] > 50 else [f]
    return out
def gif(fr):
    q = []
    for im in fr:
        c = Image.new('RGBA', im.size, BG); c.alpha_composite(im); q.append(c.convert('RGB').resize((im.width * 2, im.height * 2), Image.NEAREST).quantize(64, dither=Image.NONE))
    b = io.BytesIO(); q[0].save(b, 'GIF', save_all=True, append_images=q[1:], duration=90, loop=0, disposal=1); return base64.b64encode(b.getvalue()).decode()
G = [('눈부심 — 성표를 앞으로', ['weaken/t1', 'weaken/t2'], 0), ('상처 싸매기 — 성표 넣고 붕대', ['firstaid/t1', 'firstaid/t2'], 0),
     ('셉터 내려치기 — 성표 손도 같이', ['holyhammer/t1', 'holyhammer/t2'], 0), ('작은 치유 — 셉터와 성표', ['heal/t1', 'heal/t2'], 0),
     ('쓰러짐 40장 (천천히 재생)', ['fall/s1', 'fall/s2'], 1), ('앉기 40장 (천천히 재생)', ['sit/s1', 'sit/s2'], 1), ('자기 40장 (천천히 재생)', ['sleep/s1', 'sleep/s2'], 1)]
css = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:16px 0 6px;color:#f0c878}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;height:250px}"
sel = sys.argv[2] if len(sys.argv) > 2 else 'all'
G = [g for g in G if sel == 'all' or (sel == 'slow') == bool(g[2])]
body = ''
for t, ds, slow in G:
    cards = ''
    for d in ds:
        fr = load(d); fr = retime(fr) if slow else fr
        cards += f"<div class=card><img src='data:image/gif;base64,{gif(fr)}'><b>{d.split('/')[1][1:]}번</b></div>"
    body += f"<h3>{t}</h3><div class=row>{cards}</div>"
open(sys.argv[1], 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>사제 성표 고침</title><style>{css}</style><main><h2>사제(여) — 성표 고친 시험 · 천천히 판</h2>{body}</main>")
print(os.path.getsize(sys.argv[1]) // 1024, 'KB')
