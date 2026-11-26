# 걷기 v2: 셉터 머리 반짝임 지우기 — 0장 셉터 머리를 장마다 같은 자리에 맞춰 덮고, 머리 둘레의 노랑·흰 부스러기와 떨어진 작은 점을 지운다
import os, numpy as np
from PIL import Image
from scipy import ndimage
S, O = 'walk/v2', 'clean/walk/v2'; os.makedirs(O, exist_ok=True)
fs = sorted(f for f in os.listdir(S) if f.endswith('.png'))
F = [np.asarray(Image.open(f'{S}/{f}').convert('RGBA')).copy() for f in fs]
def blue(a): r, g, b, al = [a[..., i].astype(int) for i in range(4)]; return (al > 0) & (b > 150) & (b > r + 60)
X0, Y0, X1, Y1 = 76, 45, 94, 61                      # 0장 셉터 머리 상자
b0 = blue(F[0]); b0[:, :79] = False; b0[:Y0] = False; b0[Y1:] = False
cy0, cx0 = np.argwhere(b0).mean(0)
head = F[0][Y0:Y1, X0:X1].copy(); hm = head[..., 3] > 0
# 머리 상자 안 몸쪽(얼굴·손) 픽셀은 덮지 않게: 0장에서 셉터 색(금·갈·흰·파랑·검정 테)만 남은 그대로 쓴다
for k, a in enumerate(F):
    bb = blue(a); bb[:, :78] = False; bb[:Y0 - 8] = False; bb[Y1 + 8:] = False
    if bb.sum() < 3: continue
    cy, cx = np.argwhere(bb).mean(0); dx, dy = int(round(cx - cx0)), int(round(cy - cy0))
    x0, y0 = X0 + dx, Y0 + dy
    # 둘레 3칸 안 밝은 노랑·흰 픽셀 지우기
    r, g, b = [a[..., i].astype(int) for i in range(3)]
    spark = (a[..., 3] > 0) & (((r > 200) & (g > 170) & (b < 140)) | ((r > 225) & (g > 225) & (b > 200)))
    zone = np.zeros(spark.shape, bool); zone[max(0, y0 - 4):y0 + head.shape[0] + 4, x0 + 2:x0 + head.shape[1] + 5] = True
    a[spark & zone, 3] = 0
    yel = (a[..., 3] > 0) & (r > 200) & (g > 150) & (b < 120); zl = np.zeros(spark.shape, bool); zl[max(0, y0 - 4):y0 + head.shape[0] + 4, x0 - 4:x0 + 3] = True; a[yel & zl, 3] = 0
    sub = a[y0:y0 + head.shape[0], x0:x0 + head.shape[1]]; sub[hm] = head[hm]
    lab, n = ndimage.label(a[..., 3] > 0)
    if n > 1:
        sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        for i, s in enumerate(sz, 1):
            if s < 8: a[lab == i, 3] = 0
    Image.fromarray(a).save(f'{O}/{fs[k]}')
print(len(F))
