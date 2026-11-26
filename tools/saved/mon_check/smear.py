# 가로로 번진 장(빠르게 움직일 때 픽셀랩이 그리는 가로줄) 찾기 · 빼기: 가로 변화 ÷ 세로 변화가 그 동작 가운데값의 0.6 아래면 번진 장.  python smear.py [--drop] <폴더 …>
import os, sys, numpy as np
from PIL import Image
drop = sys.argv[1] == '--drop'; ps = sys.argv[2:] if drop else sys.argv[1:]
def ratio(a):
    rgb = a[..., :3].astype(int); m = a[..., 3] > 0
    gx = np.abs(np.diff(rgb, axis=1)).sum(-1)[:, :][m[:, 1:] & m[:, :-1]]; gy = np.abs(np.diff(rgb, axis=0)).sum(-1)[m[1:] & m[:-1]]
    return gx.mean() / max(gy.mean(), 1)
for p in ps:
    fs = sorted(f for f in os.listdir(p) if f.endswith('.png'))
    r = [ratio(np.asarray(Image.open(f'{p}/{f}').convert('RGBA'))) for f in fs]; med = np.median(r)
    bad = [i for i, x in enumerate(r) if 0 < i < len(r) - 1 and x < 0.6 * med]
    if not bad: continue
    print(p, 'smear', bad, [round(r[i] / med, 2) for i in bad])
    if drop:
        keep = [f for i, f in enumerate(fs) if i not in bad]
        for f in fs: os.rename(f'{p}/{f}', f'{p}/_{f}')
        for k, f in enumerate(keep): os.rename(f'{p}/_{f}', f'{p}/{k:02d}.png')
        for f in fs:
            if os.path.exists(f'{p}/_{f}'): os.remove(f'{p}/_{f}')
