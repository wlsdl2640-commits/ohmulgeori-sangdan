# 한 장만 튀는 장(번진 줄 · 반짝임 · 갑자기 바뀐 모양) 빼기: 앞 장과도, 뒤 장과도 몸이 많이 다르고 앞뒤 장끼리는 비슷하면 뺀다.  python dropspike.py <폴더 …>
import os, sys, numpy as np
from PIL import Image
def d(a, b, area): return (a ^ b).sum() / area
for p in sys.argv[1:]:
    fs = sorted(f for f in os.listdir(p) if f.endswith('.png'))
    A = [np.asarray(Image.open(f'{p}/{f}').convert('RGBA'))[:, :, 3] > 0 for f in fs]; area = np.mean([a.sum() for a in A])
    bad = [i for i in range(1, len(A) - 1) if d(A[i], A[i - 1], area) > 0.3 and d(A[i], A[i + 1], area) > 0.3 and d(A[i - 1], A[i + 1], area) < 0.6 * min(d(A[i], A[i - 1], area), d(A[i], A[i + 1], area))]
    if not bad: continue
    keep = [f for i, f in enumerate(fs) if i not in bad]
    for f in fs: os.rename(f'{p}/{f}', f'{p}/_{f}')
    for k, f in enumerate(keep): os.rename(f'{p}/_{f}', f'{p}/{k:02d}.png')
    for f in fs:
        if os.path.exists(f'{p}/_{f}'): os.remove(f'{p}/_{f}')
    print(p, 'drop', bad)
