# 마법사(여) 효과 시안 넷(① 차분 _a · ② 보통 · ③ 화려 _c · ④ 최대 _d)을 늪지 장면(고른 동작의 가장 크게 움직인 장 · 몬스터)에 멈춘 그림으로 한 쪽에.  python mk_var_mag.py <출력.html>
import os, sys, io, base64, json
import numpy as np
from PIL import Image
S = '../../../../plx73/bg_swamp/00.png'; M = '../../../../plx74/pick/swampbrute_00.png'
bg = Image.open(S).convert('RGBA'); mon = Image.open(M).convert('RGBA')
GY = 206; FX = 120; C = '../anim/'; P = json.load(open(C + 'picks.json', encoding='utf-8'))
MX = 360 - mon.width // 2 - 6   # 몬스터 가운데
#  스킬: (이름, 동작, 놓는 법, x, y, 앞뒤)  놓는 법 c 가운데 · b 바닥
A = {
 'attack': ('마력탄', 'c', (FX + MX) // 2, GY - 58, 'f'), 'fireball': ('화염구', 'c', (FX + MX) // 2, GY - 58, 'f'),
 'icelance': ('얼음 창', 'c', (FX + MX) // 2, GY - 58, 'f'), 'chain': ('연쇄 번개', 'c', (FX + MX) // 2 + 20, GY - 58, 'f'),
 'weaken': ('약화의 저주 (맞은 자리)', 'c', MX, GY - 50, 'f'), 'burst': ('마나 폭주 (마법사 둘레)', 'c', FX, GY - 50, 'f'),
 'iceprison': ('얼음 감옥 (맞은 자리)', 'b', MX, GY + 6, 'f'), 'meteor': ('운석 낙하', 'b', MX - 30, GY - 10, 'f'),
 'thunderclap': ('뇌격', 'b', MX, GY + 6, 'f'), 'manashield': ('마나 보호막 (마법사 둘레)', 'b', FX, GY + 10, 'b'),
}
def pose(k):
    row = P[k]; d = C + ('clean_fix/' if k == 'manashield' else '') + k + '/' + row
    fs = sorted(os.listdir(d)); a0 = np.array(Image.open(d + '/' + fs[0]).convert('RGBA')).astype(int)
    best = max(range(1, min(len(fs), 30)), key=lambda i: np.abs(np.array(Image.open(d + '/' + fs[i]).convert('RGBA')).astype(int) - a0).sum())
    return Image.open(d + '/' + fs[best]).convert('RGBA')
def scene(k, eff):
    nm, mode, ax, ay, z = A[k]
    t = bg.crop((0, 0, 360, 224)).copy(); t.alpha_composite(mon, (360 - mon.width - 6, GY - mon.height + 4))
    r = pose(k); r = r.crop((6, 12, 126, 132))   # 132 판 → 120 (발 줄 맞춤)
    b = eff.getbbox() or (0, 0, 1, 1)
    ox, oy = (ax - (b[0] + b[2]) // 2, ay - (b[1] + b[3]) // 2) if mode == 'c' else (ax - (b[0] + b[2]) // 2, ay - b[3])
    if z == 'b': t.alpha_composite(eff, (ox, oy))
    t.alpha_composite(r, (FX - 60, GY - 114))
    if z == 'f': t.alpha_composite(eff, (ox, oy))
    return t.convert('RGB')
def b64(im):
    im = im.resize((im.width * 2, im.height * 2), Image.NEAREST)
    b = io.BytesIO(); im.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(b, 'PNG', optimize=True); return base64.b64encode(b.getvalue()).decode()
T = [('_a', '① 차분'), ('', '② 보통'), ('_c', '③ 화려'), ('_d', '④ 최대')]
CSS = (":root{color-scheme:dark}body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1500px;margin:0 auto;padding-block:16px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}"
       "h3{margin:18px 0 6px;color:#f0c878}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center;min-width:0}img{image-rendering:pixelated;width:360px;max-width:100%;border-radius:6px}")
body = ''
for k in A:
    cards = ''.join(f"<div class=card><img alt='{A[k][0]} {nm}' src='data:image/png;base64,{b64(scene(k, Image.open(f'{k}{s}/00.png').convert('RGBA')))}'><b>{A[k][0]} {nm}</b></div>" for s, nm in T if os.path.exists(f'{k}{s}/00.png'))
    body += f"<h3>{A[k][0]}</h3><div class=row>{cards}</div>"
open(sys.argv[1], 'w', encoding='utf-8').write(f"<title>마법사(여) 1차 스킬 효과 시안</title><meta name=\"claude:viewport-fit-sides\" content=\"cover\"><style>{CSS}</style><main><h2>마법사(여) 1차 스킬 효과 시안</h2><p>스킬마다 ① 차분 · ② 보통 · ③ 화려 · ④ 최대 중 하나를 골라 주세요(예: 「화염구 ①」). 멈춘 그림이고, 고르신 것만 움직이게 만듭니다. 고르지 않은 판은 2 · 3차용으로 보관합니다.</p>{body}</main>")
print(os.path.getsize(sys.argv[1]))
