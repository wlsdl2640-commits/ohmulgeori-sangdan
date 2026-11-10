"""시안 판 (보내는 것): 큰 그림 + 이름 · 레벨 · 설명 + 게임 속 크기(실제 · 두 배)"""
from PIL import Image, ImageDraw
from sheet import font, icon_img, wrap, N
BG = (26, 24, 32); BIG = (44, 41, 54); LINE = (60, 56, 70); SLOT = (14, 17, 24, 255)
def sheet2(items, path, title, sub=None, cols=4, z=6, tw=170, tagcol=None):
    cw = N * z + tw + 22; ch = N * z + 26
    rows = (len(items) + cols - 1) // cols
    top = 50 + (20 if sub else 0)
    W = cols * cw + 16; Hh = top + rows * ch + 10
    im = Image.new('RGB', (W, Hh), BG); d = ImageDraw.Draw(im)
    d.text((14, 12), title, font=font(17, True), fill=(240, 196, 90))
    if sub: d.text((14, 40), sub, font=font(12), fill=(168, 156, 140))
    for i, (img, name, lv, desc) in enumerate(items):
        cx = 12 + (i % cols) * cw; cy = top + (i // cols) * ch
        d.rectangle([cx, cy, cx + N * z + 3, cy + N * z + 3], fill=BIG, outline=LINE)
        ic = icon_img(img, z); im.paste(ic, (cx + 2, cy + 2), ic)
        tx = cx + N * z + 12
        d.text((tx, cy + 1), lv, font=font(12, True), fill=tagcol or (150, 142, 128))
        yy = cy + 19
        for ln in wrap(name, font(14, True), tw, d):
            d.text((tx, yy), ln, font=font(14, True), fill=(250, 236, 200)); yy += 18
        yy += 3
        by = cy + N * z - 38                       # 작은 그림 자리
        nmax = max(1, (by - 4 - yy) // 14)
        lines = wrap(desc, font(11), tw, d)
        if len(lines) > nmax: lines = lines[:nmax]; lines[-1] = lines[-1].rstrip() + '…'
        for ln in lines:
            d.text((tx, yy), ln, font=font(11), fill=(170, 162, 148)); yy += 14
        a1 = icon_img(img, 1, SLOT); a2 = icon_img(img, 2, SLOT)
        im.paste(a2, (tx, by)); im.paste(a1, (tx + 46, by + 20))
        d.text((tx + 70, by + 22), '게임 속 크기', font=font(10), fill=(110, 104, 96))
    im.save(path); return im
