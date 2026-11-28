# 연쇄 번개: 시작(빛 덩이 · 줄기)은 ②, 갈래는 ③처럼 (11-29 대표님) → chain_mix/00.png
# ② 줄기의 J2 칸까지 쓰고, 그 뒤는 ③을 줄기 높이가 맞게 옮겨 붙인다(이음매 4칸은 밝은 쪽)
from PIL import Image; import numpy as np, os
A = np.array(Image.open('chain/00.png').convert('RGBA')).astype(int); C = np.array(Image.open('chain_c/00.png').convert('RGBA')).astype(int)
lum = lambda a: (a[..., :3].sum(2) * (a[..., 3] > 0))
def ymid(a, x):   # 그 칸 줄기의 가운데 높이(가장 밝은 칸들)
    l = lum(a)[:, x]; ys = np.where(l >= l.max() * 0.85)[0]; return int(ys.mean())
J2, J3 = 140, 112          # ②는 갈래 앞(140칸)까지 · ③은 갈래 앞 112칸부터
dx, dy = J2 - J3, ymid(A, J2) - ymid(C, J3)
print('dx dy', dx, dy, ymid(A, J2), ymid(C, J3))
W = A.shape[1] + 40; out = np.zeros((A.shape[0] + 30, W, 4), int)
out[15:15 + A.shape[0], :J2] = A[:, :J2]
for y in range(C.shape[0]):
    for x in range(J3 - 2, C.shape[1]):
        X, Y = x + dx, y + dy + 15
        if 0 <= X < W and 0 <= Y < out.shape[0] and C[y, x, 3] > 0:
            if X < J2 + 2 and out[Y, X, 3] > 0 and lum(out[Y:Y+1, X:X+1])[0, 0] >= C[y, x, :3].sum(): continue
            out[Y, X] = C[y, x]
os.makedirs('chain_mix', exist_ok=True)
im = Image.fromarray(out.astype(np.uint8)); im = im.crop(im.getbbox()); im.save('chain_mix/00.png'); print(im.size)
