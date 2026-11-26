# 4 ~ 8층 점토 협곡 몬스터 시안 판.  python mk_page.py <출력 앞부분>
import json, io, base64, os, sys
from PIL import Image
J = json.load(open('jobs_in.json', encoding='utf-8'))
def b64(im, sc=2):
    im = im.resize((im.width * sc, im.height * sc), Image.NEAREST); b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return base64.b64encode(b.getvalue()).decode()
def card(p):
    im = Image.open(p).convert('RGBA'); c = Image.new('RGBA', im.size, (58, 62, 70, 255)); c.alpha_composite(im); return c
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1300px;margin:0 auto;padding:16px}h3{margin:16px 0 6px;color:#f0c878}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated}.wide{max-width:100%}"
top = ''.join(f"<h3>{t}</h3><img class=wide src='data:image/png;base64,{b64(Image.open(p).convert('RGB').quantize(256), 1)}'>" for t, p in [('게임 크기 — 모험가와 나란히 (일반, 후보 00)', 'lineup_00.png'), ('게임 크기 — 보스 · 갈래 · 던전 (후보 00)', 'lineup_boss.png')])
pages = [[top]]; size = 0
for j in J:
    cards = ''.join(f"<div class=card><img src='data:image/png;base64,{b64(card(f'{j['key']}/{c:02d}.png'))}'><b>{c:02d}</b></div>" for c in range(4) if os.path.exists(f"{j['key']}/{c:02d}.png"))
    h = f"<h3>{j['name']}</h3><div class=row>{cards}</div>"; pages[-1].append(h); size += len(h)
    if size > 380000: pages.append([]); size = 0
for i, p in enumerate([p for p in pages if p], 1):
    f = f'{sys.argv[1]}_{i}.html'
    open(f, 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>협곡 몬스터 시안 {i}</title><style>{CSS}</style><main><h2>4 ~ 8층 점토 협곡 몬스터 시안 {i}</h2><p>계획서(a12)의 층마다 대표 몬스터 둘 + 보스 · 갈래 2 · 던전 2. 그림체 참고를 밝은 철갑 풍뎅이로 바꿔 모험가 · 옛 몬스터와 결을 맞췄다. 몬스터마다 번호 하나씩 골라 주세요(오른쪽을 보는 것은 동작 만들 때 뒤집음).</p>{''.join(p)}</main>")
    print(f, os.path.getsize(f) // 1024, 'KB')
