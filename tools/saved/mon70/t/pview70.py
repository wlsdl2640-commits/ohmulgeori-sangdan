"""새끼 펫 · 말 시안 빠른 보기 (실제 게임 굽기 — pxuSprite · 뭉툭 B4): python3 pview70.py <훅 페이지> <시안.json> <출력.png> [키,…] [--z 5]
시안.json = {'pets': {종류: {'base': 색을 빌릴 MONS id, 'name', 'pal': {…}, 'A': {'g', 'g2', 'ax', 'float', 'ifr', 'label', 'desc'}, 'B': …}}}
줄마다: 이름 · 옛 새끼 그림(×2) · 시안마다 서 있기 두 장(×z) · 다 자란 모습(×2)"""
import json, base64, sys, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

A = sys.argv[1:]
Z = 5
if '--z' in A: i = A.index('--z'); Z = int(A[i + 1]); del A[i:i + 2]
PAGE, JS, OUT = A[0], A[1], A[2]; ONLY = A[3].split(',') if len(A) > 3 else None
D = json.load(open(JS)); P = D['pets']; KS = [k for k in P if not ONLY or k in ONLY]
INJ = r"""((P, KS, Z) => {
  const out = {};
  const spr = (id, f) => PXU[id] ? pxuSprite(id, 'idle', f) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', f);
  const url = (s, z) => { const c = document.createElement('canvas'); c.width = s.w * z; c.height = s.h * z; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(s.cv, 0, 0, s.w, s.h, 0, 0, s.w * z, s.h * z); return c.toDataURL(); };
  for (const k of KS) {
    const d = P[k], r = { old: [], vars: {}, adult: null };
    const oldId = d.old || ('pet_' + k);
    try { r.old = [url(spr(oldId, 0), 2), url(spr(oldId, 1), 2)]; } catch (e) { r.old = []; }
    const ad = d.adult || (PETS[k] ? (PETS[k].adult || PETS[k].mon) : null);
    if (ad) try { r.adult = url(spr(ad, 0), 2); } catch (e) {}
    for (const v of Object.keys(d)) {
      if (!/^[A-Z]$/.test(v)) continue;
      const x = d[v], id = '__pv_' + k + '_' + v;
      PXU[id] = Object.assign({ noArm: 1, still: 1, wpn: 'none', hip: 99, sh: [4, 2] }, { pal: Object.assign({}, d.pal || {}, x.pal || {}), g: x.g, g2: x.g2 || x.g, ax: x.ax, float: x.float || 0 });
      const m = MONS[d.base] || {}; MONS[id] = { name: x.label || v, plan: 'pet', body: x.body || m.body, dark: x.dark || m.dark, drops: [] };
      delete MON_DIM[id]; PXC.clear();
      const a = spr(id, 0), b = spr(id, 1);
      r.vars[v] = { f: [url(a, Z), url(b, Z), url(a, 2)], w: a.w, h: a.h, label: x.label || v };
    }
    out[k] = r;
  }
  return out;
})"""
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FB if b else FR, n, index=2)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(900)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1000)
    R = pg.evaluate("s => window.__EV(s)", f"{INJ}({json.dumps(P)}, {json.dumps(KS)}, {Z})")
    if errs: print('PAGE ERRORS', errs[:3])
    b.close()
BG = (28, 30, 38); CELL = (42, 44, 54)
rows = []
for k in KS:
    r = R[k]; ims = [img(u) for u in r['old']]
    parts = [('지금', ims)]
    for v, x in r['vars'].items(): parts.append((f"{x['label']} {x['w']}×{x['h']}", [img(u) for u in x['f']]))
    if r['adult']: parts.append(('다 자람', [img(r['adult'])]))
    h = max(max((i.height for i in imgs), default=10) for _, imgs in parts) + 34
    w = sum(sum(i.width + 8 for i in imgs) + 24 for _, imgs in parts) + 130
    rows.append((k, parts, w, h))
W = max(w for *_, w, h in rows); H = sum(h for *_, h in rows) + 10
sh = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sh); y = 6
for k, parts, w, h in rows:
    d.text((8, y + 4), k + '\n' + P[k].get('name', ''), font=fnt(15, True), fill=(236, 230, 220)); x = 130
    for lab, imgs in parts:
        d.text((x, y), lab, font=fnt(13), fill=(170, 165, 155))
        for im in imgs:
            bx = Image.new('RGB', (im.width, h - 34), CELL); bx.paste(im, (0, h - 34 - im.height), im); sh.paste(bx, (x, y + 22)); x += im.width + 8
        x += 24
    y += h
sh.save(OUT); print(OUT, sh.size)
