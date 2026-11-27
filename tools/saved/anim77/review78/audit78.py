# 점토 협곡 39개(고른 것) 점검: 몸이 깎임(넓이가 가운데값의 80% 아래) · 판 가장자리에 닿아 잘림 · 떨어진 덩어리 · 핏빛 · 큰 튐
import os, sys, json, numpy as np
from PIL import Image
from scipy import ndimage
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
P = json.load(open('pick.json', encoding='utf-8'))
MONS = ['jawlizard', 'wedgebeetle', 'flatbug', 'pooltoad', 'canyonbat', 'barrelwasp', 'hornbug', 'otter', 'earwig', 'bigtoad', 'hawk', 'bison', 'crab']
def src(m, r):
    k = f'c_{m}/{r}'
    return f"clean/c_{m}/{P[k]['pick']}" if k in P else f'../anim76/clean/{m}/{r}'
res = {}
for m in MONS:
    for r in ['idle', 'walk', 'atk']:
        d = src(m, r); fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
        A = [np.asarray(Image.open(f'{d}/{f}').convert('RGBA')) for f in fs]; al = [a[..., 3] > 0 for a in A]
        ar = np.array([x.sum() for x in al]); med = np.median(ar); H, W = al[0].shape
        bad = []
        for i, x in enumerate(al):
            why = []
            if ar[i] < 0.8 * med: why.append(f'깎임 {ar[i] / med:.2f}')
            if x[0].any() or x[-1].any() or x[:, 0].any() or x[:, -1].any(): why.append('가장자리')
            lab, n = ndimage.label(x)
            if n > 1:
                sz = sorted(ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)), reverse=True)
                if sum(1 for s in sz[1:] if s >= 20) > 0: why.append('덩어리')
            a = A[i]; red = ((a[..., 3] > 0) & (a[..., 0] > 170) & (a[..., 1] < 60) & (a[..., 2] < 60)).sum()
            if red > 30: why.append(f'붉음 {red}')
            if i and (x ^ al[i - 1]).sum() / med > 0.5: why.append('튐')
            if why: bad.append((i, why))
        if bad: res[f'{m}/{r}'] = {'dir': d, 'n': len(fs), 'bad': bad}
for k, v in res.items(): print(k, v['n'], v['dir'], [(i, w) for i, w in v['bad']][:8], '...' if len(v['bad']) > 8 else '')
json.dump(res, open('review78/audit78.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
