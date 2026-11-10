import sys, importlib
from PIL import Image, ImageDraw
from sheet import icon_img, font
def zoomsheet(icons, path, z=14, bg=(58, 54, 68)):
    W = len(icons) * (20 * z + 10) + 10
    im = Image.new('RGB', (W, 20 * z + 40), (26, 24, 32)); d = ImageDraw.Draw(im)
    for i, (img, label) in enumerate(icons):
        x0 = 10 + i * (20 * z + 10)
        d.rectangle([x0, 30, x0 + 20 * z - 1, 30 + 20 * z - 1], fill=bg)
        for k in range(21):
            pass
        ic = icon_img(img, z); im.paste(ic, (x0, 30), ic)
        d.text((x0, 8), label, font=font(13, True), fill=(240, 220, 180))
    im.save(path)
