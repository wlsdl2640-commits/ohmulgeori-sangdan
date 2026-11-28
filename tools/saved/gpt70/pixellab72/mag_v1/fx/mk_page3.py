# 연쇄 번개 자세 다시(chain2 x1~4) + 합성 번개 · 마나 보호막 다시(shield2 a~d) 시안 쪽
import os, io, base64, numpy as np, sys
from PIL import Image
exec(open('mk_var_mag.py', encoding='utf-8').read().split('A = {')[0])
def b64png(im):
    im = im.resize((im.width * 2, im.height * 2), Image.NEAREST); b = io.BytesIO(); im.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(b, 'PNG', optimize=True); return base64.b64encode(b.getvalue()).decode()
def gif(d):
    fs = sorted(os.listdir(d)); fr = []
    for f in fs:
        im = Image.open(os.path.join(d, f)).convert('RGBA'); c = Image.new('RGBA', im.size, (52, 58, 52, 255)); c.alpha_composite(im)
        fr.append(c.convert('RGB').resize((im.width * 2, im.height * 2), Image.NEAREST).quantize(64, dither=Image.NONE))
    b = io.BytesIO(); fr[0].save(b, 'GIF', save_all=True, append_images=fr[1:], duration=70, loop=0, disposal=1); return base64.b64encode(b.getvalue()).decode()
def peak(d):
    fs = sorted(os.listdir(d)); a0 = np.array(Image.open(d + '/' + fs[0]).convert('RGBA')).astype(int)
    i = max(range(1, min(len(fs), 32)), key=lambda i: np.abs(np.array(Image.open(d + '/' + fs[i]).convert('RGBA')).astype(int) - a0).sum())
    return Image.open(d + '/' + fs[i]).convert('RGBA')
def place(r, eff, ax, ay, mode, front=True):
    t = bg.crop((0, 0, 360, 224)).copy(); t.alpha_composite(mon, (360 - mon.width - 6, GY - mon.height + 4))
    r = r.crop((6, 12, 126, 132)); b = eff.getbbox()
    ox, oy = (ax - (b[0] + b[2]) // 2, ay - (b[1] + b[3]) // 2) if mode == 'c' else (ax - (b[0] + b[2]) // 2, ay - b[3])
    if not front: t.alpha_composite(eff, (ox, oy))
    t.alpha_composite(r, (FX - 60, GY - 114))
    if front: t.alpha_composite(eff, (ox, oy))
    return t.convert('RGB')
CSS = (":root{color-scheme:dark}body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1500px;margin:0 auto;padding-block:16px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}"
       "h3{margin:18px 0 6px;color:#f0c878}p{opacity:.88;margin:4px 0}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center;min-width:0}img{image-rendering:pixelated;max-width:100%;border-radius:6px}.g{height:240px;width:auto}.s{width:360px}")
ch = Image.open('chain_mix/00.png').convert('RGBA')
def orbAt(r):   # 132 판 그림 → 120 자리로 바꾼 뒤 구슬(남빛) 가운데
    a = np.array(r.crop((6, 12, 126, 132))).astype(int); m = (a[..., 3] > 0) & (a[..., 2] - a[..., 0] > 60) & (a[..., 2] - a[..., 1] > 60); m[:, :55] = 0; m[75:] = 0
    ys, xs = np.where(m)
    if len(xs): k = xs >= xs.max() - 6; ys, xs = ys[k], xs[k]   # 맨 앞(오른쪽) 구슬만
    return (FX - 60 + int(xs.mean()), GY - 114 + int(ys.mean())) if len(xs) else (FX + 30, GY - 60)
CA = np.array(ch); L = CA[:, :40, :3].sum(2) * (CA[:, :40, 3] > 0); cy0, cx0 = [int(v.mean()) for v in np.where(L >= L.max() * 0.9)]
def chainScene(r):
    ox, oy = orbAt(r); t = bg.crop((0, 0, 360, 224)).copy(); t.alpha_composite(mon, (360 - mon.width - 6, GY - mon.height + 4))
    t.alpha_composite(r.crop((6, 12, 126, 132)), (FX - 60, GY - 114)); t.alpha_composite(ch, (ox - cx0, oy - cy0)); return t.convert('RGB')
h = '<h3>연쇄 번개 — 자세 다시 (지팡이를 한 손으로 평평하게 뻗기)</h3><div class=row>' + ''.join(f"<div class=card><img class=g alt='자세 {v}' src='data:image/gif;base64,{gif(f'../anim/chain2/x{v}')}'><b>자세 {v}</b></div>" for v in range(1, 5)) + '</div>'
h += '<h3>연쇄 번개 — 합성 번개(시작 ② · 갈래 ③)를 새 자세에</h3><div class=row>' + ''.join(f"<div class=card><img class=s alt='자세 {v} + 번개' src='data:image/png;base64,{b64png(chainScene(peak(f'../anim/chain2/x{v}')))}'><b>자세 {v} + 번개</b></div>" for v in range(1, 5)) + '</div>'
idle = Image.open(sorted([os.path.join('../anim/idle2/x1', f) for f in os.listdir('../anim/idle2/x1')])[0]).convert('RGBA')
h += '<h3>마나 보호막 — 다시 (몸을 다 감싸는 유리 같은 보호막)</h3><div class=row>' + ''.join(f"<div class=card><img class=s alt='보호막 {n}' src='data:image/png;base64,{b64png(place(idle, Image.open(f'shield2_{k}/00.png').convert('RGBA'), FX, GY + 8, 'b'))}'><b>보호막 {n}</b></div>" for k, n in [('a', 'A 길쭉한 캡슐'), ('b', 'B 비눗방울'), ('c_glass', 'C 수정 면 (안쪽 비치게)'), ('d_glass', 'D 흐르는 마나 테 (안쪽 비치게)')]) + '</div>'
open(sys.argv[1], 'w', encoding='utf-8').write(f"<title>마법사(여) 연쇄 번개 · 마나 보호막 다시</title><meta name=\"claude:viewport-fit-sides\" content=\"cover\"><style>{CSS}</style><main><h2>마법사(여) — 연쇄 번개 · 마나 보호막 다시</h2><p>연쇄 번개 자세 넷 중 하나, 마나 보호막 넷 중 하나를 골라 주세요. 예전 연쇄 번개 자세(2)는 별똥별 떨어뜨리는 스킬용으로 보관합니다.</p>{h}</main>")
print(os.path.getsize(sys.argv[1]))
