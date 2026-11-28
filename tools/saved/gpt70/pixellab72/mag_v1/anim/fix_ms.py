# 마나 보호막(w2): 지팡이를 앞에 세운 장(10 ~ 26)에서 은빛 새장 안 틈이 검게 칠해진 것을 둘레 색(뒤의 모자 · 바탕)으로 메움 (11-28 대표님)
from PIL import Image; import numpy as np, os, sys
src, out = 'manashield/w2', 'clean_fix/manashield/w2'
os.makedirs(out, exist_ok=True)
for f in sorted(os.listdir(src)):
    i = int(f[:2]); a = np.array(Image.open(os.path.join(src, f)).convert('RGBA')).astype(int)
    if 10 <= i <= 26:
        R, G, B = a[..., 0], a[..., 1], a[..., 2]
        orb = (a[..., 3] > 0) & (B - R > 60) & (B - G > 60); orb[:, :78] = 0; orb[75:] = 0; orb[:30] = 0
        ys, xs = np.where(orb); cy, cx = ys.mean(), xs.mean()
        yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]; dist = np.hypot(yy - cy, xx - cx)
        dark = (a[..., 3] > 0) & (R + G + B < 110)
        silver = (abs(R - G) < 14) & (B >= R) & (R > 110)
        hole = dark & (dist > 3.2) & (dist < 6.6)
        for _ in range(12):   # 둘레의 뒤 색(검정 · 은 · 구슬이 아닌 칸)으로 안쪽으로 메움
            if not hole.any(): break
            ok = (a[..., 3] > 0) & ~hole & ~dark & ~silver & ~orb
            new = hole.copy()
            for y, x in zip(*np.where(hole)):
                nb = [(y + dy, x + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy or dx) and ok[y + dy, x + dx]]
                if len(nb) >= 2:
                    a[y, x, :3] = np.mean([a[p][:3] for p in nb], 0).round(); new[y, x] = False
            ok2 = new; hole = new if (new != hole).any() else new & False
        # 남은 칸(둘레가 모두 은빛인 좁은 틈)은 새장 그늘 색
        a[hole] = [142, 143, 161, 255]
    Image.fromarray(a.astype(np.uint8)).save(os.path.join(out, f))
print('ok')
