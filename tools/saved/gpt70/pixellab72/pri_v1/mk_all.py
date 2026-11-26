# 사제(여) 다 모은 판: 고른 동작 + 성표 고친 스킬 + 천천히 판.  python mk_all.py <출력 앞부분>  → <앞부분>_1.html …
import os, sys, io, base64, numpy as np
from PIL import Image
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'anim'); BG = (52, 58, 52, 255)
def load(d):
    p = f'{A}/clean/{d}' if os.path.isdir(f'{A}/clean/{d}') else f'{A}/{d}'
    return [Image.open(f'{p}/{f}').convert('RGBA') for f in sorted(os.listdir(p)) if f.endswith('.png')]
def retime(fr):
    al = [np.asarray(f)[:, :, 3] > 0 for f in fr]; mv = [0] + [(al[i] ^ al[i - 1]).sum() for i in range(1, len(fr))]
    first = min(i for i, m in enumerate(mv) if m > 50); last = max(i for i, m in enumerate(mv) if m > 50)
    return fr[max(0, first - 3):last + 7]                # 원래 빠르기 · 앞뒤 가만히 있는 장만 줄임
def gif(fr):
    q = []
    for im in fr:
        if im.width == 132: im = im.crop((6, 6, 126, 126))
        c = Image.new('RGBA', im.size, BG); c.alpha_composite(im); q.append(c.convert('RGB').resize((im.width * 2, im.height * 2), Image.NEAREST).quantize(64, dither=Image.NONE))
    b = io.BytesIO(); q[0].save(b, 'GIF', save_all=True, append_images=q[1:], duration=90, loop=0, disposal=1); return base64.b64encode(b.getvalue()).decode()
#  (제목, [(폴더, 이름표)], 천천히)
G = [
 ('기본 동작 — 확정', [('idle/v5', '서 있기 5'), ('walk/v2', '걷기 2'), ('run/u1', '달리기 1'), ('hurt/v3', '맞음 3')], 0),
 ('쓰러짐 — 확정', [('fall/s2', '쓰러짐 2')], 1),
 ('앉기 (새로 — 앉으면서 성표를 가방에)', [('sit/w1', '앉기 1'), ('sit/w3', '앉기 2')], 1),
 ('자기 — 둘 다', [('sleep/s1', '자기 1'), ('sleep/s2', '자기 2')], 1),
 ('기본 공격 (새로 — 성표 팔 고정 · 끝 까딱 없음)', [('attack/w1', '1'), ('attack/w2', '2'), ('attack/w3', '3')], 0),
 ('확정한 스킬', [('heal/u3', '작은 치유'), ('firstaid/t1', '상처 싸매기'), ('cure/t2', '해독 부적'), ('bless/u2', '응원의 기도')], 0),
 ('확정한 스킬 2', [('holy/u2', '빛 구슬'), ('weaken/t1', '눈부심'), ('holyhammer/u1', '셉터 내려치기')], 0),
 ('확정한 스킬 3', [ ('sanctuary/u1', '보호의 원'), ('massheal/u1', '모두의 기도'), ('greatheal/u1', '정성 어린 치유')], 0),
]
css = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:16px 0 6px;color:#f0c878}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;height:240px}"
pages, cur, size = [], '', 0
for t, ds, slow in G:
    cards = ''
    for d, nm in ds:
        if not os.path.isdir(f'{A}/{d}'): continue
        fr = load(d); g = gif(retime(fr) if slow else fr); size += len(g)
        cards += f"<div class=card><img src='data:image/gif;base64,{g}'><b>{nm}</b></div>"
    cur += f"<h3>{t}</h3><div class=row>{cards}</div>"
    if size > 600000: pages.append(cur); cur, size = '', 0
if cur: pages.append(cur)
for i, p in enumerate(pages, 1):
    f = f'{sys.argv[1]}_{i}.html'
    open(f, 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>사제 동작 {i}</title><style>{css}</style><main><h2>사제(여) 동작 — 성표 고친 판 {i}/{len(pages)}</h2><p>성표는 뒷손에 쥔 물건: 손이 가면 같이 가고, 붕대를 쓸 때는 넣는다. 동작마다 하나씩 골라 주세요.</p>{p}</main>")
    print(f, os.path.getsize(f) // 1024, 'KB')
