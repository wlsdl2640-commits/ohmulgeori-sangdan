# 정리 뒤 몸이 깎인 장 빼기: 몸 넓이가 앞뒤 장 가운데값의 85% 아래면 뺀다.  python dropbroken.py <폴더 …>
import os, sys, numpy as np
from PIL import Image
for d in sys.argv[1:]:
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
    ar = [int((np.asarray(Image.open(f'{d}/{f}').convert('RGBA'))[:, :, 3] > 0).sum()) for f in fs]
    bad = [i for i in range(1, len(fs) - 1) if ar[i] < 0.85 * np.median(ar[max(0, i - 3):i] + ar[i + 1:i + 4])]
    if not bad: continue
    keep = [f for i, f in enumerate(fs) if i not in bad]
    for f in fs: os.rename(f'{d}/{f}', f'{d}/_{f}')
    for k, f in enumerate(keep): os.rename(f'{d}/_{f}', f'{d}/{k:02d}.png')
    for f in fs:
        if os.path.exists(f'{d}/_{f}'): os.remove(f'{d}/_{f}')
    print(d, 'drop', bad, len(fs), '->', len(keep))
