# 다시 고를 시안 쪽(11-25 저녁): 자세 고정 · 강철 피부 몸 감싸기(fx4 GIF) · 방패 셋 새 시안 · 안 고른 뛰어들기 · 방패 착지 · 확인할 것
#   python mk_fx4page.py <출력 html>
import sys, os, io, base64
from PIL import Image
import mk_var as V
def b64(im, fmt='PNG'):
    im = im.convert('RGB').quantize(96, dither=Image.NONE)
    b = io.BytesIO(); im.save(b, fmt); return base64.b64encode(b.getvalue()).decode()
def gif(f, bg=(40, 46, 40)):
    im = Image.open(f); fr = []
    try:
        while True:
            c = Image.new('RGBA', im.size, bg + (255,)); c.alpha_composite(im.convert('RGBA'))
            fr.append(c.convert('RGB').quantize(48, dither=Image.NONE)); im.seek(im.tell() + 1)
    except EOFError: pass
    b = io.BytesIO(); fr[0].save(b, 'GIF', save_all=True, append_images=fr[1:], duration=71, loop=0); return base64.b64encode(b.getvalue()).decode()
card = lambda src, cap, w='': f"<div class=card><img {w} src='{src}'><b>{cap}</b></div>"
H = []
H.append("<h3>자세 고정 — 새로 (몸 감싸는 빛 · 바닥 효과 없음)</h3><p>자세 고정 v2의 몸 빛(테두리 빛 두 번 · 몸에서 오르는 반짝이) + v1의 하얀 테. 32장, 마지막에 천천히 사라집니다.</p><div class=row>")
for k, c in [('brace_A', 'A — v2 빛만'), ('brace_B', 'B — v2 빛 + v1 하얀 테'), ('brace_C', 'C — B를 호박 빛으로')]:
    H.append(card('data:image/gif;base64,' + gif(f'../fx4/{k}.gif'), c, 'class=g'))
H.append("</div><h3>강철 피부 — 새로 (상시 효과라 작게)</h3><div class=row>")
for k, c in [('steel_A', 'A — 맞을 때 쇠빛 번쩍'), ('steel_B', 'B — 몸이 쇠빛으로 감싸임')]:
    H.append(card('data:image/gif;base64,' + gif(f'../fx4/{k}.gif'), c, 'class=g'))
H.append("</div>")
for k, ko, tip in [('bash', '방패 두드리기', '둔탁한 충격 · 나무 조각 · 쇠 부스러기 · 먼지'), ('shove', '방패 밀치기', '앞으로 미는 흙먼지 · 기절 별'), ('block', '둥근 방패 막기', '방패 면에서 튀는 쇠 불꽃 · 막힘 자국')]:
    H.append(f"<h3>{ko} — 다시 ({tip} · 마법 막 · 금빛 룬 뺌)</h3><div class=row>")
    for s in [1, 2, 3]:
        f = f'{k}S{s}/00.png'
        if os.path.exists(f): H.append(card('data:image/png;base64,' + b64(V.scene(k, Image.open(f).convert('RGBA'))), f'{ko} 새 {s}', 'class=s'))
    H.append("</div>")
H2 = []
H2.append("<h3>도발 — 새로 (몸 테두리가 붉게 감싸여 빛남 + 머리 위 느낌표)</h3><p>느낌표 = 라비린토스 폰트 키트 v1.1의 B2 큰 진홍 「!」(b2-big crimson). 외칠 때 머리 위로 솟아 잠깐 머물고 천천히 옅어집니다.</p><div class=row>" + card('data:image/gif;base64,' + gif('../fx4/taunt_v4x.gif'), '도발 v4', 'class=g') + "</div>")
H2.append("<h3>아직 안 고르신 것 — 뛰어들기 · 방패 착지 (① 차분 · ② 보통 · ③ 화려 · ④ 최대)</h3>")
for k, ko in [('leap', '뛰어들기'), ('shieldland', '방패 착지')]:
    im = Image.open(f'var/{k}.png').convert('RGB'); im = im.resize((im.width * 3 // 4, im.height * 3 // 4), Image.NEAREST)
    H2.append(f"<p><b>{ko}</b></p><img class=w src='data:image/png;base64,{b64(im)}'>")
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:18px 0 6px;color:#f0c878}p{opacity:.88;margin:4px 0}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;border-radius:6px}.g{width:280px}.s{width:360px}.w{width:100%;max-width:1100px}"
open(sys.argv[1], 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>전사 효과 다시 고르기</title><style>{CSS}</style><main><h2>전사 1차 효과 — 다시 고를 것 (11-25 저녁)</h2>{''.join(H)}</main>")
f2 = sys.argv[1].replace('.html', '_2.html')
open(f2, 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>전사 효과 다시 고르기 2</title><style>{CSS}</style><main><h2>전사 1차 효과 — 새 도발 · 아직 안 고르신 것</h2>{''.join(H2)}</main>")
print(os.path.getsize(sys.argv[1]), os.path.getsize(f2))
