"""그린 스킬 그림(SVG, 100×100)을 크롬으로 구워 지금 쓰는 육각 틀 안에 넣는다. 크게(144px, 폰에서 보이는 크기)와 실제 CSS 크기(48px)."""
import base64, io, pathlib, sys
from PIL import Image
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / 'skicon'))
import b4
D = pathlib.Path(__file__).parent
def bake_svgs(svgs, size):
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = b.new_page()
        for k, svg in svgs.items():
            data = pg.evaluate('''async ([svg, n]) => { const img = new Image(); img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))); await img.decode();
                const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, n, n); return c.toDataURL(); }''', [svg, size])
            out[k] = Image.open(io.BytesIO(base64.b64decode(data.split(',')[1]))).convert('RGBA')
        b.close()
    return out
def frame(kind='none', z=3):
    """지금 틀을 z배로 (가까운 이웃): (틀 그림, 안쪽 가면)"""
    base = b4.hexbase(kind); W = 48 * z
    big = base.resize((W, W), Image.NEAREST); px = big.load(); tint = b4.rgb(b4.HEX_TINT.get(kind, b4.HEX_TINT['none']))
    mask = Image.new('L', (W, W), 0); mp = mask.load()
    for y in range(W):
        for x in range(W):
            if px[x, y][3] and px[x, y][:3] == tint: mp[x, y] = 255; px[x, y] = (0, 0, 0, 0)
    return big, mask
def compose(art, kind='none', z=3, pips=0):
    W = 48 * z; fr, mask = frame(kind, z)
    a = art.resize((W, W), Image.LANCZOS) if art.size != (W, W) else art
    out = Image.new('RGBA', (W, W), (0, 0, 0, 0)); out.paste(a, (0, 0), mask)
    out.alpha_composite(fr)
    if pips:   # 이름에 숫자만 다른 스킬: 위쪽 흰 점
        from PIL import ImageDraw
        d = ImageDraw.Draw(out); r = 2.2 * z; gap = 6 * z; x0 = W / 2 - (pips - 1) * gap / 2
        for i in range(pips):
            cx, cy = x0 + i * gap, 7.5 * z
            d.ellipse((cx - r - z * 0.8, cy - r - z * 0.8, cx + r + z * 0.8, cy + r + z * 0.8), fill=(26, 10, 6, 255)); d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255, 255))
    return out
