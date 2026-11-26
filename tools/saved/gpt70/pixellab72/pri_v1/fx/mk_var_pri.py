# 사제 효과 시안 넷(① 차분 _a · ② 보통 · ③ 화려 _c · ④ 최대 _d)을 늪지 장면(도적 고른 동작의 맞히는 장 · 몬스터)에 멈춘 그림으로.  python mk_var_rog.py <출력 html>
import os, sys, io, base64
from PIL import Image
S = '../../../../plx73/bg_swamp/00.png'; M = '../../../../plx74/pick/swampbrute_00.png'
bg = Image.open(S).convert('RGBA'); mon = Image.open(M).convert('RGBA')
GY = 206; FX = 120; C = '../anim/'
#  스킬: (이름, 동작 폴더, 장, 놓는 법, x, y, 앞뒤)
A = {
 'heal': ('작은 치유', 'heal/u3', 9, 'b', FX, GY + 4, 'f'),
 'firstaid': ('상처 싸매기', 'firstaid/t1', 10, 'c', FX, GY - 50, 'f'),
 'cure': ('해독 부적', 'cure/t2', 10, 'c', FX + 10, GY - 50, 'f'),
 'bless': ('응원의 기도', 'bless/u2', 9, 'b', FX, GY - 96, 'f'),
 'holy': ('빛 구슬', 'holy/u2', 9, 'c', FX + 120, GY - 58, 'f'),
 'weaken': ('눈부심 (맞은 자리)', 'weaken/t1', 6, 'c', 300, GY - 58, 'f'),
 'holyhammer': ('셉터 내려치기', 'holyhammer/u1', 9, 'b', FX + 48, GY + 6, 'f'),
 'sanctuary': ('보호의 원', 'sanctuary/u1', 10, 'b', FX, GY + 10, 'b'),
 'massheal': ('모두의 기도', 'massheal/u1', 9, 'b', FX, GY + 6, 'f'),
 'greatheal': ('정성 어린 치유', 'greatheal/u1', 10, 'b', FX, GY + 6, 'b'),
}
def scene(k, eff):
    nm, d, f, mode, ax, ay, z = A[k]
    t = bg.crop((0, 0, 360, 224)).copy(); t.alpha_composite(mon, (360 - mon.width - 6, GY - mon.height + 4))
    p = C + 'clean/' + d if os.path.isdir(C + 'clean/' + d) else C + d; fs = sorted(os.listdir(p)); r = Image.open(p + '/' + fs[min(f, len(fs) - 1)]).convert('RGBA')
    if r.width == 132: r = r.crop((6, 6, 126, 126))
    rx = FX - 60 - (64 if r.width == 184 else 0)            # 넓힌 판(뒷걸음)은 몸이 x 64부터
    if eff is not None:
        b = eff.getbbox() or (0, 0, 1, 1)
        if mode == 'c': ox, oy = ax - (b[0] + b[2]) // 2, ay - (b[1] + b[3]) // 2
        elif mode == 'b': ox, oy = ax - (b[0] + b[2]) // 2, ay - b[3]
        else: ox, oy = ax - b[0], ay - b[3]
    if eff is not None and z == 'b': t.alpha_composite(eff, (ox, oy))
    t.alpha_composite(r, (rx, GY - 114))
    if eff is not None and z == 'f': t.alpha_composite(eff, (ox, oy))
    return t.convert('RGB')
def b64(im):
    b = io.BytesIO(); im.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(b, 'PNG', optimize=True); return base64.b64encode(b.getvalue()).decode()
T = [('_a', '① 차분'), ('', '② 보통'), ('_c', '③ 화려'), ('_d', '④ 최대')]
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1500px;margin:0 auto;padding:16px}h3{margin:16px 0 6px;color:#f0c878}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;width:360px}p{opacity:.85}"
pages = [[]]
for k in A:
    cards = ''
    for s, nm in T:
        f = f'{k}{s}/00.png'
        if not os.path.exists(f): continue
        cards += f"<div class=card><img src='data:image/png;base64,{b64(scene(k, Image.open(f).convert('RGBA')))}'><b>{A[k][0]} {nm}</b></div>"
    pages[-1].append(f"<h3>{A[k][0]}</h3><div class=row>{cards}</div>")
    if len(pages[-1]) == 3: pages.append([])
out = sys.argv[1]
for i, p in enumerate([p for p in pages if p], 1):
    open(f'{out}_{i}.html', 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>사제 스킬 효과 시안 {i}</title><style>{CSS}</style><main><h2>사제(여) 1차 스킬 효과 시안 {i}</h2><p>스킬마다 ① 차분 ~ ④ 최대 중 하나를 골라 주세요. 고른 것만 움직이게 만듭니다(생김 · 사라짐 길게).</p>{''.join(p)}</main>")
    print(f'{out}_{i}.html', os.path.getsize(f'{out}_{i}.html'))
