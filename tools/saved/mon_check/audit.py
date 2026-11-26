# 몬스터 동작 점검: 빨간 핏빛 · 떨어진 덩어리(다른 물건) · 큰 튐.  python audit.py <동작 폴더 …>  → 문제 있는 것만 출력
import os, sys, numpy as np
from PIL import Image
from scipy import ndimage
def check(d):
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
    A = [np.asarray(Image.open(f'{d}/{f}').convert('RGBA')).astype(int) for f in fs]
    al = [a[..., 3] > 0 for a in A]; area = np.mean([x.sum() for x in al])
    def red(a): return int(((a[..., 3] > 0) & (a[..., 0] > 170) & (a[..., 1] < 60) & (a[..., 2] < 60)).sum())
    r0 = red(A[0]); reds = [red(a) - r0 for a in A]
    blobs = []
    for a in al:
        lab, n = ndimage.label(a)
        if n > 1:
            sz = sorted(ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)), reverse=True)
            blobs.append(sum(1 for s in sz[1:] if s >= 12))
        else: blobs.append(0)
    jump = [(al[i] ^ al[i - 1]).sum() / area for i in range(1, len(al))]
    out = []
    if max(reds) > 15: out.append(f'red {max(reds)}@{reds.index(max(reds))}')
    b0 = blobs[0]; bx = max(blobs)
    if bx > b0: out.append(f'blob +{bx - b0}@{blobs.index(bx)}')
    j = max(jump)
    if j > 0.5: out.append(f'jump {j:.2f}@{jump.index(j) + 1}')
    return out
for d in sys.argv[1:]:
    r = check(d)
    if r: print(d, ' · '.join(r))
