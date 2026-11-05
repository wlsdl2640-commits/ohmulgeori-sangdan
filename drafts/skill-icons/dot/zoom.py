"""확대 보기: python3 zoom.py 출력.png 모듈:키,키 ... (6배)"""
import sys, pathlib, importlib
from PIL import Image
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell
out = sys.argv[1]; z = 6; ims = []
for spec in sys.argv[2:]:
    m, _, ks = spec.partition(':'); mod = importlib.import_module(m)
    for k in (ks.split(',') if ks else list(mod.ICONS)):
        _, kind, fn = mod.ICONS[k]; art, _ = fn(); ims.append(cell.zoom(art.img(kind), z))
sh = Image.new('RGB', (len(ims) * (48 * z + 8) + 8, 48 * z + 16), (21, 23, 28))
for i, im in enumerate(ims): sh.paste(im, (8 + i * (48 * z + 8), 8), im)
sh.save(D / out); print(sh.size)
