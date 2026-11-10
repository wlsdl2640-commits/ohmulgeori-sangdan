"""시안 판: 그림 × 확대 + 실제 크기(20px) + 이름 · 레벨"""
from PIL import Image, ImageDraw, ImageFont
from wic import N, hexc
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
def font(sz, bold=False): return ImageFont.truetype(FD + ('Galmuri11-Bold.ttf' if bold else 'Galmuri11.ttf'), sz)
BG = (26, 24, 32); SLOT = (14, 17, 24); LINE = (54, 50, 62)
def icon_img(img, z, bg=None):
    im = Image.new('RGBA', (N * z, N * z), bg or (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for (x, y), c in img.items():
        if 0 <= x < N and 0 <= y < N: d.rectangle([x * z, y * z, x * z + z - 1, y * z + z - 1], fill=c)
    return im
def wrap(text, f, w, d):
    out, cur = [], ''
    for ch in text:
        if d.textlength(cur + ch, font=f) > w and cur:
            # 띄어쓰기에서 끊기
            k = cur.rfind(' ')
            if k > 0: out.append(cur[:k]); cur = cur[k + 1:] + ch
            else: out.append(cur); cur = ch
        else: cur += ch
    if cur: out.append(cur)
    return out
def sheet(items, path, title, cols=4, z=6, sub=None, note=None):
    """items: [(img, 이름, 'Lv', 설명)]"""
    cw = N * z + 150; ch = N * z + 34
    rows = (len(items) + cols - 1) // cols
    top = 46 + (18 if sub else 0)
    W = cols * cw + 24; H = top + rows * ch + 16 + (22 if note else 0)
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    d.text((14, 12), title, font=font(16, True), fill=(240, 196, 90))
    if sub: d.text((14, 36), sub, font=font(11), fill=(168, 156, 140))
    for i, it in enumerate(items):
        img, name, lv, desc = it
        cx = 12 + (i % cols) * cw; cy = top + (i // cols) * ch
        d.rectangle([cx, cy, cx + N * z + 3, cy + N * z + 3], fill=SLOT, outline=LINE)
        im.paste(icon_img(img, z), (cx + 2, cy + 2), icon_img(img, z))
        tx = cx + N * z + 12
        d.text((tx, cy + 2), lv, font=font(11), fill=(150, 142, 128))
        yy = cy + 18
        for ln in wrap(name, font(13, True), 132, d):
            d.text((tx, yy), ln, font=font(13, True), fill=(250, 236, 200)); yy += 17
        yy += 2
        for ln in wrap(desc, font(11), 132, d)[:4]:
            d.text((tx, yy), ln, font=font(11), fill=(168, 160, 146)); yy += 14
        # 실제 크기 (게임 목록 20px · 큰 칸 40px)
        a1 = icon_img(img, 1, SLOT + (255,)); a2 = icon_img(img, 2, SLOT + (255,))
        im.paste(a1, (tx, cy + N * z - 18)); im.paste(a2, (tx + 26, cy + N * z - 38))
    if note: d.text((14, H - 26), note, font=font(11), fill=(138, 132, 120))
    im.save(path)
    return im
