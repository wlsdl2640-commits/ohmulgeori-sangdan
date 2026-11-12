"""무기 종류 하나 = 한 판: 원형 시안 4 (맨 위 줄) + 16자루"""
from PIL import Image, ImageDraw
from sheet import font, icon_img, wrap, N
BG = (26, 24, 32); BIG = (44, 41, 54); FRM = (54, 48, 40); LINE = (60, 56, 70); SLOT = (14, 17, 24, 255)
def cell(im, d, x0, y0, img, tag, name, desc, z, tw, bg, tagcol):
    d.rectangle([x0, y0, x0 + N * z + 3, y0 + N * z + 3], fill=bg, outline=LINE)
    ic = icon_img(img, z); im.paste(ic, (x0 + 2, y0 + 2), ic)
    tx = x0 + N * z + 12
    # 게임 속 크기 (두 배 · 실제)는 글 칸 오른쪽 위
    a1 = icon_img(img, 1, SLOT); a2 = icon_img(img, 2, SLOT)
    im.paste(a2, (tx + tw - 64, y0 + 1)); im.paste(a1, (tx + tw - 20, y0 + 21))
    d.text((tx, y0 + 1), tag, font=font(12, True), fill=tagcol)
    yy = y0 + 19
    for ln in wrap(name, font(14, True), tw - 70, d):
        d.text((tx, yy), ln, font=font(14, True), fill=(250, 236, 200)); yy += 18
    yy = max(yy + 3, y0 + 46)
    nmax = max(1, (y0 + N * z + 2 - yy) // 14)
    lines = wrap(desc, font(11), tw, d)
    if len(lines) > nmax: lines = lines[:nmax]; lines[-1] = lines[-1].rstrip() + '…'
    for ln in lines:
        d.text((tx, yy), ln, font=font(11), fill=(170, 162, 148)); yy += 14
def type_sheet(path, title, sub, frames, items, z=6, tw=180, cols=4, ihead='16자루 (네 레벨 묶음마다 A · B · C · D 한 번씩)'):
    cw = N * z + tw + 22; ch = N * z + 26
    W = max(cols, len(frames)) * cw + 16          # 원형이 다섯 이상이면 맨 위 줄만큼 넓힌다
    top = 74
    H = top + 26 + ch + 34 + 4 * ch + 10
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    d.text((14, 12), title, font=font(17, True), fill=(240, 196, 90))
    d.text((14, 40), sub, font=font(12), fill=(168, 156, 140))
    d.text((14, top), '원형 시안 %d (틀)' % len(frames), font=font(14, True), fill=(240, 196, 90))
    for i, (img, tag, name, desc) in enumerate(frames):
        cell(im, d, 12 + i * cw, top + 24, img, tag, name, desc, z, tw, FRM, (240, 170, 90))
    y1 = top + 24 + ch + 8
    d.text((14, y1), ihead, font=font(14, True), fill=(240, 196, 90))
    for i, (img, tag, name, desc) in enumerate(items):
        cell(im, d, 12 + (i % cols) * cw, y1 + 24 + (i // cols) * ch, img, tag, name, desc, z, tw, BIG, (150, 142, 128))
    im.save(path); return im.size
def section_sheet(path, title, sub, sections, z=6, tw=180, cols=4):
    """sections: [(제목, [(그림, 꼬리표, 이름, 설명)], 바탕색, 꼬리표색)]"""
    cw = N * z + tw + 22; ch = N * z + 26
    W = cols * cw + 16; top = 74
    H = top + sum(28 + ((len(it) + cols - 1) // cols) * ch + 6 for _, it, _, _ in sections) + 6
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    d.text((14, 12), title, font=font(17, True), fill=(240, 196, 90))
    d.text((14, 40), sub, font=font(12), fill=(168, 156, 140))
    y = top
    for name, items, bg, tagcol in sections:
        d.text((14, y), name, font=font(14, True), fill=(240, 196, 90)); y += 24
        for i, (img, tag, nm, desc) in enumerate(items):
            cell(im, d, 12 + (i % cols) * cw, y + (i // cols) * ch, img, tag, nm, desc, z, tw, bg, tagcol)
        y += ((len(items) + cols - 1) // cols) * ch + 10
    im.save(path); return im.size
