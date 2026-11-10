"""방패 한 종류 = 한 판: 원형 시안 4 + 16 · 칸마다 앞 그림(장비 그림) · 게임 속 크기 · 옆면(원정 옆모습)"""
from PIL import Image, ImageDraw
from sheet import font, icon_img, wrap, N
from sh import prof_img
BG = (26, 24, 32); BIG = (44, 41, 54); FRM = (54, 48, 40); LINE = (60, 56, 70); SLOT = (14, 17, 24, 255)
def pimg(cells, z):
    W = max(x for x, y in cells) + 2; H = max(y for x, y in cells) + 2
    im = Image.new('RGBA', (W * z, H * z), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in cells.items(): d.rectangle([x * z, y * z, x * z + z - 1, y * z + z - 1], fill=c)
    return im
def cell(im, d, x0, y0, img, prof, tag, name, desc, z, tw, bg, tagcol):
    d.rectangle([x0, y0, x0 + N * z + 3, y0 + N * z + 3], fill=bg, outline=LINE)
    ic = icon_img(img, z); im.paste(ic, (x0 + 2, y0 + 2), ic)
    tx = x0 + N * z + 12
    a1 = icon_img(img, 1, SLOT); a2 = icon_img(img, 2, SLOT)
    im.paste(a2, (tx + tw - 64, y0 + 1)); im.paste(a1, (tx + tw - 20, y0 + 21))
    # 옆면 (게임 픽셀 × 3)
    pi = pimg(prof, 3)
    px = tx + tw - 42 + (40 - pi.width) // 2; py = y0 + 48
    d.rectangle([tx + tw - 44, py - 3, tx + tw - 1, y0 + N * z + 2], fill=(20, 22, 30))
    im.paste(pi, (px, py), pi)
    d.text((tx + tw - 41, y0 + N * z - 12), '옆면', font=font(10), fill=(120, 112, 100))
    d.text((tx, y0 + 1), tag, font=font(12, True), fill=tagcol)
    yy = y0 + 19
    for ln in wrap(name, font(14, True), tw - 70, d):
        d.text((tx, yy), ln, font=font(14, True), fill=(250, 236, 200)); yy += 18
    yy = max(yy + 3, y0 + 46)
    nmax = max(1, (y0 + N * z + 2 - yy) // 14)
    lines = wrap(desc, font(11), tw - 50, d)
    if len(lines) > nmax: lines = lines[:nmax]; lines[-1] = lines[-1].rstrip() + '…'
    for ln in lines:
        d.text((tx, yy), ln, font=font(11), fill=(170, 162, 148)); yy += 14
def shield_sheet(path, title, sub, frames, items, z=6, tw=200, cols=4):
    cw = N * z + tw + 22; ch = N * z + 26
    W = cols * cw + 16; top = 74
    H = top + 26 + ch + 34 + 4 * ch + 10
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    d.text((14, 12), title, font=font(17, True), fill=(240, 196, 90))
    d.text((14, 40), sub, font=font(12), fill=(168, 156, 140))
    d.text((14, top), '원형 시안 4 (틀)', font=font(14, True), fill=(240, 196, 90))
    for i, it in enumerate(frames): cell(im, d, 12 + i * cw, top + 24, *it, z, tw, FRM, (240, 170, 90))
    y1 = top + 24 + ch + 8
    d.text((14, y1), '16개 (네 레벨 묶음마다 A · B · C · D 한 번씩)', font=font(14, True), fill=(240, 196, 90))
    for i, it in enumerate(items): cell(im, d, 12 + (i % cols) * cw, y1 + 24 + (i // cols) * ch, *it, z, tw, BIG, (150, 142, 128))
    im.save(path); return im.size
