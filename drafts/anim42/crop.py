import sys
from PIL import Image
im = Image.open(sys.argv[1]); Z = int(sys.argv[2]); W = 34 * Z; H = 30 * Z
rows = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else list(range(im.height // H))
cols = [int(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 else list(range(9))
y0 = 8 * Z  # 위쪽 빈 곳을 조금 자른다
out = Image.new('RGB', (len(cols) * W, len(rows) * (H - y0)))
for i, r in enumerate(rows):
    for j, c in enumerate(cols): out.paste(im.crop((c * W, r * H + y0, (c + 1) * W, (r + 1) * H)), (j * W, i * (H - y0)))
out.save(sys.argv[5] if len(sys.argv) > 5 else 'crop.png'); print(out.size)
