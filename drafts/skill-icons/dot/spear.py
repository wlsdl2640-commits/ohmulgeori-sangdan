"""창 (용기사 계열 공용): 잎 모양 쇠 창날 + 금 고리 + 붉은 술 + 나무 자루.
spear(tx, ty, ang, ...) → {(x,y): 글자}. ang = 창끝에서 자루 쪽 방향(도, 화면 좌표: 아래로 꽂기 = -90)."""
import math
from cell import W, H
SPP = {'w': ('#ffffff', 5), 'm': ('#d4dcea', 5), 'M': ('#7a849a', 5), 't': ('#d09a5a', 3), 'T': ('#8a5a2a', 3),
       'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'r': ('#ff4a3a', 13), 'R': ('#a82a22', 13)}
def spear(tx, ty, ang, Lh=6.0, hw=1.9, Ls=8.0, sw=0.75, collar=1.2, cw=1.25, tassel=True, ss=4, thr=0.45, apex=0.66, sharp=1.25):
    ux, uy = math.cos(math.radians(ang)), math.sin(math.radians(ang)); nx, ny = -uy, ux
    lit = 1 if (nx + ny) < 0 else -1          # v 쪽 부호: 왼쪽 위를 보는 쪽이 밝다
    def prof(u):
        a = Lh * apex
        if u < a: return 0.3 + (hw - 0.3) * (u / a) ** sharp
        return max(0.45, hw - (hw - 0.45) * ((u - a) / (Lh - a)) ** 0.8)
    out = {}
    for y in range(-2, H + 2):
        for x in range(-2, W + 2):
            n = 0; part = None
            cnt = {}
            for j in range(ss):
                for i in range(ss):
                    px, py = x + (i + 0.5) / ss - tx, y + (j + 0.5) / ss - ty
                    u = px * ux + py * uy; v = px * nx + py * ny
                    if 0 <= u <= Lh and abs(v) <= prof(u): k = 'h'
                    elif Lh < u <= Lh + collar and abs(v) <= cw: k = 'c'
                    elif Lh + collar < u <= Lh + collar + Ls and abs(v) <= sw: k = 's'
                    else: continue
                    cnt[k] = cnt.get(k, 0) + 1
            tot = sum(cnt.values())
            if tot < thr * ss * ss: continue
            k = max(cnt, key=cnt.get)
            px, py = x + 0.5 - tx, y + 0.5 - ty; u = px * ux + py * uy; v = (px * nx + py * ny) * lit
            if k == 'h':
                w = prof(max(0.01, min(Lh, u)))
                out[(x, y)] = 'w' if v > w * 0.3 else ('M' if v < -w * 0.3 else 'm')
            elif k == 'c': out[(x, y)] = 'y' if v >= 0 else 'Y'
            else: out[(x, y)] = 't' if v >= 0 else 'T'
    # 창끝 한 칸은 늘 흰색
    tip = (int(math.floor(tx + ux * 0.3)), int(math.floor(ty + uy * 0.3)))
    if tip in out: out[tip] = 'w'
    if tassel:
        # 고리 아래(화면 아래쪽)로 늘어진 술
        cx, cy = tx + ux * (Lh + collar * 0.5), ty + uy * (Lh + collar * 0.5)
        for (dx, dy, c) in ((0.0, 1.0, 'r'), (0.0, 2.0, 'R'), (0.9, 1.0, 'R'), (-0.9, 1.0, 'r')):
            q = (int(math.floor(cx + dx)), int(math.floor(cy + dy)))
            if q not in out: out[q] = c
    return {k: v for k, v in out.items() if 0 <= k[0] < W and 0 <= k[1] < H}
