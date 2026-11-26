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
 ('기본 동작', [('idle/v5', '서 있기 5'), ('walk/v2', '걷기 2 (반짝임 지움)'), ('run/u1', '달리기 1'), ('run/u2', '달리기 2'), ('hurt/v3', '맞음 3')], 0),
 ('쓰러짐 (40장)', [('fall/s1', '쓰러짐 1'), ('fall/s2', '쓰러짐 2')], 1),
 ('앉기 (40장 · 성표 무릎에)', [('sit/u1', '앉기 1'), ('sit/u3', '앉기 2')], 1),
 ('자기 (40장)', [('sleep/s1', '자기 1'), ('sleep/s2', '자기 2')], 1),
 ('작은 치유 (치유)', [('heal/u2', '1'), ('heal/u3', '2')], 0),
 ('상처 싸매기 (응급 처치)', [('firstaid/t1', '1'), ('firstaid/t2', '2')], 0),
 ('해독 부적 (해독)', [('cure/t1', '1'), ('cure/t2', '2')], 0),
 ('응원의 기도 (축복)', [('bless/u2', '1')], 0),
 ('빛 구슬 (신성한 빛)', [('holy/u2', '1')], 0),
 ('눈부심 (약화의 저주 자리)', [('weaken/t1', '1 (번쩍임은 지울 것)'), ('weaken/t2', '2')], 0),
 ('셉터 내려치기 (성스러운 철퇴)', [('holyhammer/u1', '1 (휘두른 자국은 지울 것)')], 0),
 ('보호의 원 (성역)', [('sanctuary/u1', '1'), ('sanctuary/u2', '2'), ('sanctuary/u3', '3')], 0),
 ('모두의 기도 (광역 치유)', [('massheal/u1', '1')], 0),
 ('정성 어린 치유 (대치유)', [('greatheal/u1', '1'), ('greatheal/u2', '2'), ('greatheal/u3', '3')], 0),
 ('기본 공격', [('attack/u1', '1 (휘두른 자국은 지울 것)'), ('attack/u3', '2 (휘두른 자국은 지울 것)')], 0),
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
