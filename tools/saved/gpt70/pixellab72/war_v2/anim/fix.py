# 고른 판에 남은 궤적 · 타격 조각을 장마다 지운다: 검은 테로 둘러싸인 안쪽(+테)만 남긴다
#   python fix.py → final/<동작>/<v>/NN.png (clean/을 복사하고 FIX 장만 고침)
import os, shutil, numpy as np
from PIL import Image
from scipy import ndimage
FIX = {'hurt/v2': [1], 'slash/v2': [5, 8], 'block/v1': [6, 7], 'lowcut/v2': [4, 6, 7], 'sweep/v3': [3], 'bash/v1': [4, 5], 'counter/v1': [4],
       'earth/v1': [5], 'quake/v1': [5, 6], 'sweep/v2': [3, 7], 'counter/v2': [7], 'resolve/v3': [4, 11], 'quake/v3': [6, 7], 'quake/v4': [7, 8, 9, 10, 11]}
HOLD = {'slash/v2': [5], 'lowcut/v2': [6], 'resolve/v3': [4, 11]}   # 몸에 붙은 큰 궤적 — 바로 앞 장을 한 번 더
PICK = ['idle/v2', 'walk/v1', 'run/v1', 'hurt/v2', 'fall/v2', 'sit/v2', 'sleep2/v1', 'sleep2/v2', 'sleep2/v3', 'dodge3/v3', 'slash/v2', 'block/v1', 'taunt/v1',
        'lowcut/v2', 'sweep/v3', 'bash/v1', 'counter/v1', 'brace/v1', 'resolve/v1', 'earth/v1', 'quake/v1', 'sweep/v2', 'counter/v2', 'resolve/v3', 'quake/v3', 'quake/v4']
def near(d, i, fl):
    # 앞뒤로 고치지 않을 가장 가까운 장의 몸 모양에서 R칸 넘게 떨어진 칸(궤적 · 튄 조각)을 지운다
    fs = sorted(os.listdir('clean/' + d)); n = len(fs); R = 7
    a = np.array(Image.open(f'clean/{d}/{i:02d}.png').convert('RGBA')); m = a[:, :, 3] > 0
    ref = np.zeros_like(m)
    for step in (-1, 1):
        j = i + step
        while 0 <= j < n and j in fl: j += step
        if 0 <= j < n: ref |= np.array(Image.open(f'clean/{d}/{j:02d}.png').convert('RGBA'))[:, :, 3] > 0
    keep = m & ndimage.binary_dilation(ref, np.ones((3, 3)), iterations=R)
    out = a.copy(); out[~keep] = 0; return out
for d in PICK:
    src, dst = 'clean/' + d, 'final/' + d
    if os.path.exists(dst): shutil.rmtree(dst)
    shutil.copytree(src, dst)
    for i in FIX.get(d, []):
        p = os.path.join(dst, f'{i:02d}.png'); Image.fromarray(near(d, i, FIX[d])).save(p)

    for i in HOLD.get(d, []):
        shutil.copy(os.path.join(dst, f'{i - 1:02d}.png'), os.path.join(dst, f'{i:02d}.png'))
print('ok')
