# 늪 몬스터를 모험가 · 옛 몬스터 결에 맞추기: 밝기 · 채도를 조금 올리고 바깥 1칸 검은 테.  python pop.py <입력> <출력> [밝기 1.18] [채도 1.25]
import sys, numpy as np
from PIL import Image, ImageEnhance
from scipy import ndimage
im = Image.open(sys.argv[1]).convert('RGBA'); vb = float(sys.argv[3]) if len(sys.argv) > 3 else 1.18; sb = float(sys.argv[4]) if len(sys.argv) > 4 else 1.25
a = np.asarray(im)[:, :, 3] > 0
rgb = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(im.convert('RGB')).enhance(vb)).enhance(1.08)).enhance(sb)
o = np.dstack([np.asarray(rgb), np.asarray(im)[:, :, 3]]).copy()
ring = ndimage.binary_dilation(a) & ~a
o[ring] = (24, 16, 20, 255)
Image.fromarray(o).save(sys.argv[2])
