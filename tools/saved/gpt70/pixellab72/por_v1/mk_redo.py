# 짐꾼 다시 뽑은 동작 판: dodge2(주춤주춤 물러나기 — 그림은 제자리, 판에서 몸을 왼쪽으로 옮겨 보임) · avalanche2(넓은 칸)
#   python mk_redo.py <출력 html>
import os, sys, io, base64, math
from PIL import Image
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'anim'); BG = (52, 58, 52, 255)
def gif(m, v, shift=0):
    d = os.path.join(A, m, v); fs = sorted(os.listdir(d)); n = len(fs); fr = []
    for i, f in enumerate(fs):
        im = Image.open(os.path.join(d, f)).convert('RGBA'); W = 240 if shift else im.width
        c = Image.new('RGBA', (W, im.height), BG)
        u = i / (n - 1); dx = 0
        if shift:   # 걸음마다 멈칫: 계단처럼 물러남(4걸음) — 게임에서 쓸 옮김 곡선
            st = 4; k = u * st; dx = -shift * (math.floor(k) + (0.5 - 0.5 * math.cos(math.pi * (k % 1)))) / st
        c.alpha_composite(im, (int((W - im.width) + dx - 8) if shift else 0, 0))
        fr.append(c.convert('RGB').quantize(64, dither=Image.NONE))
    b = io.BytesIO(); fr[0].save(b, 'GIF', save_all=True, append_images=fr[1:], duration=90, loop=0); return base64.b64encode(b.getvalue()).decode()
H = ["<h3>뒤로 물러나기 — 주춤주춤 (다시)</h3><p>그림은 제자리에서 주춤거리고, 게임에서 몸을 왼쪽으로 네 걸음 멈칫멈칫 옮깁니다(뛰어들기 포물선과 같은 방식). 이 판도 그렇게 옮겨서 보입니다.</p><div class=row>"]
for v in ['v1', 'v2', 'v3', 'v4']: H.append(f"<div class=card><img class=w2 src='data:image/gif;base64,{gif('dodge2', v, 60)}'><b>물러나기 {v[1]}</b></div>")
H.append("</div><h3>짐 사태 — 넓은 칸 (고르신 2번은 짐이 캔버스 끝에 잘려서)</h3><div class=row>")
for v in ['v1', 'v2', 'v3']: H.append(f"<div class=card><img class=w3 src='data:image/gif;base64,{gif('avalanche2', v)}'><b>짐 사태 넓은 {v[1]}</b></div>")
H.append("</div>")
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:16px 0 6px;color:#f0c878}p{opacity:.88;margin:4px 0}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;border-radius:6px}.w2{width:480px}.w3{width:400px}"
open(sys.argv[1], 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>짐꾼 동작 다시</title><style>{CSS}</style><main><h2>짐꾼(1차) 동작 — 다시 뽑은 것</h2>{''.join(H)}</main>")
print(os.path.getsize(sys.argv[1]))
