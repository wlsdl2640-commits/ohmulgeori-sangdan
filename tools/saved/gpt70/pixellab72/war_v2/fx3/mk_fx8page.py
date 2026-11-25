# 11-25 밤 판: 고른 방패 두드리기 ⑥ · 막기 ② 움직임(생김 24 + 사라짐 40) · 밀치기 짧게(투명 에너지 방패 1~4)
import sys, os, base64
from PIL import Image
import mk_fx3 as m
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h3{margin:18px 0 6px;color:#f0c878}p{opacity:.88;margin:4px 0}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated;border-radius:6px;width:540px}"
card = lambda b, c: f"<div class=card><img src='data:image/gif;base64,{b}'><b>{c}</b></div>"
H = ["<h3>고르신 것 — 움직임 (생기는 장 24 + 사라지는 장 40 · 사이 장 섞기)</h3><div class=row>"]
for k in ('bashQ6', 'blockQ2'):
    fr = m.build(k); H.append(card(m.g64(fr), f'{m.P[k][0]} · {len(fr)}장'))
H.append("</div>"); H2 = []; H2.append("<h3>방패 밀치기 — 투명한 에너지 방패가 아주 짧게 나갔다가 바로 사라짐</h3><p>맞히는 장에 방패 자리에서 생겨 24칸만 나가고, 3장째부터 옅어져 약 0.7초 안에 사라집니다. 진하기 72%로 뒤가 비쳐 보입니다. 1번 추천(가장 방패 꼴).</p><div class=row>")
for n in (1, 2, 3, 4):
    b = base64.b64encode(open(f'../fx5/shoveQ{n}_short_scene.gif', 'rb').read()).decode(); H2.append(card(b, f'밀치기 {n} (짧게)'))
H2.append("</div>")
for o, t, b in ((sys.argv[1], '전사 방패 두드리기 ⑥ · 막기 ② 움직임 (11-25 밤)', H), (sys.argv[1].replace('.html', '_2.html'), '전사 방패 밀치기 — 짧게 (11-25 밤)', H2)):
    open(o, 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>{t}</title><style>{CSS}</style><main><h2>{t}</h2>{''.join(b)}</main>"); print(o, os.path.getsize(o))
