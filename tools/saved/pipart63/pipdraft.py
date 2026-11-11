"""원정 미리보기 창(pip) 시안 — 사용자 11-11 13:06 「이거는 시안부터」. 게임에는 안 넣는다.
지금: 480×256 캔버스를 화면 너비 52%로 늘려 그려서(폰 기기 배율 2.625면 1.17배) 칸 굵기가 들쭉날쭉.
A: 캔버스 1칸 = 기기 1픽셀 (가장 또렷 · 조금 작아짐) / B: 그림 한 칸(2×2) = 기기 3픽셀 (또렷 · 커짐) / C: 지금 크기 그대로, 그림 한 칸 = 기기 3픽셀로 가운데를 잘라 보여 줌"""
import base64, io, json, pathlib
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
HERE = pathlib.Path(__file__).parent
URL = 'file://' + str(HERE / 'sandbox/dist/play.html')
DPR = 2.625
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=DPR)
    pg.goto(URL); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1500)
    for _ in range(12):
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150)
        else: break
    pg.wait_for_timeout(600)
    shot = Image.open(io.BytesIO(pg.screenshot())).convert('RGB')
    bb = pg.locator('#pip').bounding_box()
    data = pg.evaluate("() => window.__VOFF.toDataURL()")
    pg.evaluate("() => { document.getElementById('pip').style.visibility = 'hidden'; }"); pg.wait_for_timeout(200)
    shot = Image.open(io.BytesIO(pg.screenshot())).convert('RGB')
    b.close()
cv = Image.open(io.BytesIO(base64.b64decode(data.split(',')[1]))).convert('RGB').crop((0, 64 * 2, 480, 64 * 2 + 256))   # 미리보기가 보여 주는 줄 (PIP_Y 64 · PIP_H 128)
print('canvas', cv.size, 'pip css', bb)
px = lambda v: int(round(v * DPR))
x0, y0, w0, h0 = px(bb['x']), px(bb['y']), px(bb['width']), px(bb['height'])
top = shot.crop((0, 0, shot.width, px(330)))
def place(img, scale, crop=None, size=None):
    t = top.copy(); im = cv
    if crop: im = cv.crop(crop)
    W, H = int(im.width * scale), int(im.height * scale)
    big = im.resize((W, H), Image.NEAREST)
    if size: big = big.crop(((W - size[0]) // 2, (H - size[1]) // 2, (W - size[0]) // 2 + size[0], (H - size[1]) // 2 + size[1])); W, H = size
    d = ImageDraw.Draw(t); d.rectangle([x0 - 6, y0 - 6, x0 + W + 5, y0 + H + 5], fill=(0, 0, 0)); d.rectangle([x0 - 3, y0 - 3, x0 + W + 2, y0 + H + 2], outline=(160, 120, 40), width=3)
    t.paste(big, (x0, y0)); return t, (x0, y0, W, H)
A = place(cv, 1)
B = place(cv, 1.5)
C = place(cv, 1.5, size=(w0, h0))
cur_img, _ = place(cv, w0 / 480, size=(w0, h0)); cur = (cur_img, (x0, y0, w0, h0))
panels = [('지금 (52% 너비 · 1.17배 — 칸이 빠지고 굵기가 다름)', cur), ('A안 · 캔버스 1칸 = 기기 1픽셀 (또렷, 조금 작아짐)', A), ('B안 · 그림 한 칸 = 기기 3픽셀 (또렷, 커짐)', B), ('C안 · 지금 크기, 그림 한 칸 = 3픽셀로 가운데만', C)]
f = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 26); f2 = ImageFont.truetype(FD + 'Galmuri11.ttf', 22)
pw_ = top.width // 2
out = Image.new('RGB', (pw_ * 2 + 30, (top.height // 2 + 60) * 2 + 60 + 330), (19, 22, 30)); d = ImageDraw.Draw(out)
for i, (lab, (img, (x, y, w, h))) in enumerate(panels):
    ox = (i % 2) * (pw_ + 30); oy = (i // 2) * (top.height // 2 + 60)
    d.text((ox + 10, oy + 10), lab, font=f2, fill=(240, 200, 120))
    out.paste(img.resize((pw_, top.height // 2), Image.NEAREST), (ox, oy + 44))
# 가까이: 파티가 선 곳을 그대로 기기 픽셀로 (×2)
yz = (top.height // 2 + 60) * 2 + 20
d.text((10, yz), '가까이 (기기 픽셀 그대로 2배 확대) — 왼쪽부터 지금 · A · B · C', font=f, fill=(236, 228, 208))
zx = 10
for lab, (img, (x, y, w, h)) in panels:
    cx, cy = x + int(w * 0.30), y + int(h * 0.55)
    z = img.crop((cx, cy, cx + 130, cy + 140)).resize((260, 280), Image.NEAREST)
    out.paste(z, (zx, yz + 40)); zx += 275
out.save(HERE / 'pip_drafts.png'); print(out.size)
