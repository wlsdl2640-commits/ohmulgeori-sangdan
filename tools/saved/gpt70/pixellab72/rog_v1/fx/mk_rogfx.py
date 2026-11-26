# 도적 1차 효과(① _a) 움직이는 판: 늪지 배경 · 도적 고른 동작 · 몬스터 위에.  python mk_rogfx.py <출력 html 앞부분> [키,…]
# 효과 = smooth.py(생김 24 거꾸로 + 사라짐 40 · 사이 장 섞기 · 처음/끝 옅어짐). 동작이 끝나도 효과는 끝까지 사라진다(그동안 서 있기).
import os, sys, io, base64
from PIL import Image
from smooth import smooth
bg = Image.open('../../../../plx73/bg_swamp/00.png').convert('RGBA'); mon = Image.open('../../../../plx74/pick/swampbrute_00.png').convert('RGBA')
GY = 206; FX = 120; C = '../anim/clean/'
#  키: (이름, 동작 폴더, 맞히는 장, 놓는 법, x, y, 앞뒤, 생기는 장 수, 앞서 시작)
P = {
 'stab':     ('비껴 찌르기 ①', 'stab/v1', 11, 'c', FX + 62, GY - 56, 'f', 4, 1),
 'footwork': ('빠른 발놀림 ①', 'footwork/v3', 6, 'b', FX, GY + 4, 'b', 10, 0),
 'backhand': ('손등 긋기 ①', 'backhand/v2', 7, 'c', FX + 50, GY - 44, 'f', 4, 1),
 'smoke':    ('연막 주머니 ①', 'smoke/v7', 12, 'b', FX + 36, GY + 6, 'f', 6, 0),
 'needle':   ('마비 침 ① (맞은 자리)', 'needle/k2a', 14, 'c', 300, GY - 58, 'f', 6, 0),
 'counter':  ('비켜 되치기 ①', 'counter/v1', 12, 'c', FX + 40, GY - 54, 'f', 4, 1),
 'thunder':  ('뇌전 찌르기 ①', 'thunder/v3', 8, 'c', FX + 100, GY - 54, 'f', 4, 1),
 'sidestab': ('옆걸음 찌르기 ①', 'sidestab/v3', 10, 'c', FX + 40, GY - 50, 'f', 4, 1),
 'backstep': ('뒷걸음 ①', 'backstep/v3', 8, 'b', FX + 40, GY + 6, 'b', 6, 0),
}
STRETCH = {'stab', 'backhand', 'counter', 'thunder', 'sidestab'}   # 베기 · 찌르기는 사라짐을 늘여 천천히
def frames(d): return [Image.open(C + d + '/' + f).convert('RGBA') for f in sorted(os.listdir(C + d))]
IDLE = frames('idle/v1')
def tile(): t = bg.crop((0, 0, 360, 224)).copy(); t.alpha_composite(mon, (360 - mon.width - 6, GY - mon.height + 4)); return t
def bbox(fr):
    b = None
    for f in fr:
        x = f.getbbox()
        if x: b = x if b is None else (min(b[0], x[0]), min(b[1], x[1]), max(b[2], x[2]), max(b[3], x[3]))
    return b
def build(k):
    nm, d, hit, mode, ax, ay, z, tin, lead = P[k]
    eff, pk = smooth(k + '_a', stretch_out=2 if k in STRETCH else 1)
    pre = eff[:pk]; idx = [round(i * (len(pre) - 1) / max(1, tin - 1)) for i in range(tin)] if pre else []
    eff = [pre[i] for i in idx] + eff[pk:]
    # 늘어난 사라짐 장을 띠 맞춤: 0 장째 그림 bbox 기준으로 놓는다(시안 판과 같은 자리)
    b0 = Image.open(f'{k}_a/00.png').getbbox()
    if mode == 'c': ox, oy = ax - (b0[0] + b0[2]) // 2, ay - (b0[1] + b0[3]) // 2
    else: ox, oy = ax - (b0[0] + b0[2]) // 2, ay - b0[3]
    wf = frames(d); st = hit - tin if lead else hit
    T = max(len(wf), st + len(eff)); out = []
    for i in range(T):
        t = tile(); e = eff[i - st] if 0 <= i - st < len(eff) else None
        r = wf[i] if i < len(wf) else IDLE[(i - len(wf)) % len(IDLE)]
        rx = FX - 60 - (64 if r.width == 184 else 0)
        if e is not None and z == 'b': t.alpha_composite(e, (ox, oy))
        t.alpha_composite(r, (rx, GY - 114))
        if e is not None and z == 'f': t.alpha_composite(e, (ox, oy))
        out.append(t.convert('RGB'))
    return out
def g64(fr):
    pal = fr[len(fr) // 3].quantize(200)
    q = [f.quantize(palette=pal, dither=0) for f in fr]
    b = io.BytesIO(); q[0].save(b, 'GIF', save_all=True, append_images=q[1:], duration=70, loop=0, optimize=True); return base64.b64encode(b.getvalue()).decode()
if __name__ == '__main__':
    out = sys.argv[1]; ks = sys.argv[2].split(',') if len(sys.argv) > 2 else list(P)
    css = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1200px;margin:0 auto;padding:14px}h3{color:#f0c878;margin:16px 0 6px}.row{display:flex;gap:10px;flex-wrap:wrap}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px}img{image-rendering:pixelated;width:540px;height:336px;border-radius:6px}"
    pages = []; cur = []; size = 0
    for k in ks:
        n = build(k); g = g64(n)
        cur.append(f"<h3>{P[k][0]}</h3><div class=row><div class=card><img src='data:image/gif;base64,{g}'><b>{len(n)}장</b></div></div>"); size += len(g)
        print(k, len(n), len(g) // 1024, 'KB', flush=True)
        if size > 650_000: pages.append(cur); cur = []; size = 0
    if cur: pages.append(cur)
    for i, p in enumerate(pages, 1):
        f = f'{out}_{i}.html'
        open(f, 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>도적 1차 효과 {i}</title><style>{css}</style><main><h2>도적 1차 스킬 효과 — ① 차분 움직임 {i}</h2><p>생기는 장 + 사라지는 장(사이 장 섞기 · 끝은 천천히 옅어짐). 동작이 끝나도 효과는 끝까지 사라진다.</p>{''.join(p)}</main>")
        print(f, os.path.getsize(f) // 1024, 'KB')
