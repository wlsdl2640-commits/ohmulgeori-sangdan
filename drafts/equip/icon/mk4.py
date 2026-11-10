"""글라디우스 원형 시안 4 판 + 축 맞춤 전/후"""
from PIL import Image, ImageDraw
from sheet import font, icon_img, wrap, N
import g4d, gl
BG = (26, 24, 32); BIG = (44, 41, 54); LINE = (60, 56, 70); SLOT = (14, 17, 24, 255)
def axis(d, ox, oy, z, AXV=19, col=(90, 220, 255, 210)):
    # 칸 가운데를 잇는 축 x + y = AXV (확대 좌표에선 x + y = (AXV + 1)·z)
    L = (AXV + 1) * z
    d.line([(ox + max(0, L - N * z), oy + min(N * z, L)), (ox + min(N * z, L), oy + max(0, L - N * z))], fill=col, width=2)
def main():
    z = 8; tw = 250
    items = []
    for key, name, desc, fn in g4d.D:
        s, pal = fn(); items.append((s.icon(pal).render(), name, desc))
    cw = N * z + tw + 24; ch = N * z + 22
    W = 2 * cw + 16; top = 70
    H = top + 2 * ch + 230
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im, 'RGBA')
    d.text((14, 12), '글라디우스 원형 시안 4 — 이 중 하나로 16자루 틀을 맞춘다', font=font(17, True), fill=(240, 196, 90))
    d.text((14, 40), '날 · 코등이 · 손잡이 · 자루 끝 공이 모두 칼 한가운데 줄 위 (아래 전/후 그림의 선). 겉모양(틀)은 넷이 같고 끝 모양 · 코등이 장식 · 손잡이 · 색이 다르다', font=font(12), fill=(168, 156, 140))
    for i, (img, name, desc) in enumerate(items):
        cx = 12 + (i % 2) * cw; cy = top + (i // 2) * ch
        d.rectangle([cx, cy, cx + N * z + 3, cy + N * z + 3], fill=BIG, outline=LINE)
        ic = icon_img(img, z); im.paste(ic, (cx + 2, cy + 2), ic)
        tx = cx + N * z + 14
        d.text((tx, cy + 4), name, font=font(15, True), fill=(250, 236, 200))
        yy = cy + 30
        for ln in wrap(desc, font(12), tw, d)[:6]:
            d.text((tx, yy), ln, font=font(12), fill=(176, 168, 152)); yy += 16
        by = cy + N * z - 40
        a1 = icon_img(img, 1, SLOT); a2 = icon_img(img, 2, SLOT)
        im.paste(a2, (tx, by)); im.paste(a1, (tx + 46, by + 20))
        d.text((tx + 72, by + 22), '게임 속 크기 (두 배 · 실제)', font=font(10), fill=(118, 110, 100))
    # 전 / 후
    y0 = top + 2 * ch + 14
    d.text((14, y0), '고친 점 — 손잡이 끝 공이 축에서 앞으로 비켜 나가던 것', font=font(14, True), fill=(240, 196, 90))
    old = gl.g10().render(); new = items[0][0]
    zz = 8
    for k, (img, lab, AXV) in enumerate(((old, '전 (지난 시안): 손잡이 · 공이 칼 줄에서 비켜 있음', 18), (new, '후: 모두 한 줄', 19))):
        cx = 14 + k * (N * zz + 260); cy = y0 + 26
        d.rectangle([cx, cy, cx + N * zz + 3, cy + N * zz + 3], fill=BIG, outline=LINE)
        ic = icon_img(img, zz); im.paste(ic, (cx + 2, cy + 2), ic)
        axis(d, cx + 2, cy + 2, zz, AXV, (255, 90, 120, 220) if k == 0 else (90, 220, 255, 220))
        for j, ln in enumerate(wrap(lab, font(12), 240, d)):
            d.text((cx + N * zz + 12, cy + 8 + j * 16), ln, font=font(12), fill=(200, 190, 170))
    im = im.crop((0, 0, W, y0 + 26 + N * zz + 14))
    im.save('G4.png'); print(im.size)
main()
