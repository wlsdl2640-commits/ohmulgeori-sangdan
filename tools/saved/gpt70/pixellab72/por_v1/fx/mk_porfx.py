# 짐꾼 공격 효과 시안(픽셀랩 · 충격파 그림체 참고) → 늪지 장면 멈춘 그림: 짐꾼이 쏘는/던지는 장 + 효과 ①~④
#   python mk_porfx.py <출력 html>
import os, sys, io, base64
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); W2 = os.path.join(H, '../../war_v2')
sys.path.insert(0, os.path.join(W2, 'fx3')); cwd = os.getcwd(); os.chdir(os.path.join(W2, 'fx3')); import mk_fx3 as m; os.chdir(cwd)
GY, FX = m.GY, m.FX
# 키: (이름, 동작, 장, 놓는 법, x, y, 최대 높이, 최대 너비, 그림 설명)
S = {'bolt': ('석궁 쏘기 (기본 공격)', 'shoot/v4', 9, 'c', 225, GY - 66, 60, 150, '볼트가 날아가 맞은 자리에 불꽃 · 나무 조각'),
     'junk': ('짐 던지기', 'throw/v4', 15, 'c', 230, GY - 50, 70, 150, '자루 · 상자 · 냄비가 날아가 퍽 — 흙먼지'),
     'aval': ('짐 사태', 'avalanche2/v1', 8, 'b', 262, GY + 4, 110, 200, '모든 적 위로 짐이 와르르 — 큰 흙먼지')}
def fit(e, h, w):
    e = e.crop(e.getbbox()); k = min(h / e.height, w / e.width)
    return e.resize((round(e.width * k), round(e.height * k)), Image.NEAREST) if k < 1 else e
def scene(k, eff):
    ko, mv, fi, mode, ax, ay, mh, mw, _ = S[k]; e = fit(eff, mh, mw)
    ox = ax - e.width // 2; oy = ay - e.height // 2 if mode == 'c' else ay - e.height
    p = Image.open(os.path.join(H, '..', 'anim', mv, f'{fi:02d}.png')).convert('RGBA')
    t = m.tile(); t.alpha_composite(p, (FX - 60 - (p.width - 120) // 2 * 0, GY - 116)); t.alpha_composite(e, (ox, oy)); return t.convert('RGB')
def b64(im):
    b = io.BytesIO(); im.quantize(96, dither=Image.NONE).save(b, 'PNG'); return base64.b64encode(b.getvalue()).decode()
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:18px 0 6px;color:#f0c878}p{opacity:.88;margin:4px 0}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;border-radius:6px;width:360px}"
L = ['① 차분', '② 보통', '③ 화려', '④ 최대']
if __name__ == '__main__':
    o = []
    for k, v in S.items():
        o.append(f"<h3>{v[0]}</h3><p>{v[8]}. 충격파 그림체 참고.</p><div class=row>")
        for i in range(4):
            f = os.path.join(H, f'{k}_{i + 1}', '00.png')
            if os.path.exists(f): o.append(f"<div class=card><img src='data:image/png;base64,{b64(scene(k, Image.open(f).convert('RGBA')))}'><b>{L[i]}</b></div>")
        o.append("</div>")
    open(sys.argv[1], 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>짐꾼 공격 효과 시안</title><style>{CSS}</style><main><h2>짐꾼 1차 공격 효과 — 시안 ①~④</h2>{''.join(o)}</main>")
    print(os.path.getsize(sys.argv[1]))
