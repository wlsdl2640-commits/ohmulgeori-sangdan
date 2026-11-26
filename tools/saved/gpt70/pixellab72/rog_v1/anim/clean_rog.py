# 도적 동작 정리(고른 판만 · picks.json) — clean.py에서: 첫 장(기준 그림)에 없는 색(섬광 · 타격 조각) 지우기 → 몸과 떨어진 작은 덩어리(흰 베기 자국 · 튀는 조각) 지우기
#   python clean.py  → clean/<동작>/<v>/NN.png · clean_log.json
import os, json, numpy as np
from PIL import Image
from scipy import ndimage
P = json.load(open('picks.json', encoding='utf-8')); J = [{'mon': m, 'row': r} for m, rs in P.items() for r in rs]; LOG = {}
KEEP = {'needle', 'smoke', 'smokethrow'}   # 떨어진 작은 것(침 · 주머니 · 매달린 표창)을 남길 동작
TH = 46          # 첫 장 색에서 이만큼(RGB 거리) 넘게 떨어진 칸 = 효과
for j in J:
    d = f"{j['mon']}/{j['row']}"; fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
    p0 = np.array(Image.open(os.path.join(d, fs[0])).convert('RGBA')); pal = np.unique(p0[p0[:, :, 3] > 0][:, :3], axis=0).astype(np.int32); pal = pal[pal.min(1) < 250]
    if j['mon'] == 'needle':
        pk = np.array(Image.open(os.path.join(d, '12.png')).convert('RGBA')); pal = np.unique(np.vstack([pal, pk[pk[:, :, 3] > 0][:, :3].astype(np.int32)]), axis=0); pal = pal[pal.min(1) < 250]   # 순백(투구 반짝 7칸)은 빼서 흰 궤적 · 별을 잡는다
    lum0 = (p0[:, :, :3].astype(int).mean(-1) > 200) & (p0[:, :, 3] > 0); L0 = lum0.sum()
    od = os.path.join('clean', d); os.makedirs(od, exist_ok=True); rm = []; drop = []
    for f in fs:
        a = np.array(Image.open(os.path.join(d, f)).convert('RGBA')); m = a[:, :, 3] > 0
        px = a[:, :, :3].reshape(-1, 3).astype(np.int32); dist = np.full(len(px), 1e9)
        for c0 in range(0, len(pal), 64):
            dd = ((px[:, None, :] - pal[None, c0:c0 + 64, :]) ** 2).sum(-1).min(1); dist = np.minimum(dist, dd)
        dist = np.sqrt(dist).reshape(m.shape); light = a[:, :, :3].astype(int).mean(-1) > 185
        far = ((dist > TH) | (light & (dist > 14))) & m
        wl, wn = ndimage.label(far & (a[:, :, :3].min(-1) >= 235), structure=np.ones((3, 3)))   # 도적: 작은 흰 반짝임(표창 · 단검 빛, 16칸 아래 — 단검 날 빛 11칸)은 남김
        if wn: far &= ~(np.isin(wl, 1 + np.where(ndimage.sum(np.ones_like(wl), wl, range(1, wn + 1)) <= 16)[0]))
        m2 = m & ~far
        # 테 없는 밝은 덩어리(흰 베기 궤적 · 별 섬광) 지우기: 캐릭터의 밝은 부분은 검은 테로 둘러싸여 있다
        rgb = a[:, :, :3].astype(int); lum = rgb.mean(-1); dark = m2 & (rgb.sum(-1) < 150)
        hsv_s = (rgb.max(-1) - rgb.min(-1)) / np.maximum(rgb.max(-1), 1)
        cand = m2 & ((lum > 150) | ((hsv_s > .55) & (rgb.max(-1) > 200)))
        cl, cn = ndimage.label(cand, structure=np.ones((3, 3)))
        for i in range(1, cn + 1):
            reg = cl == i; ring = ndimage.binary_dilation(reg, np.ones((3, 3))) & ~reg
            nb = ring & m2; tot = ring.sum()
            if tot == 0: continue
            dk = (ring & dark).sum() / tot; empty = (ring & ~m).sum() / tot
            if dk < .22 and empty > .3: m2 &= ~reg
        lab, n = ndimage.label(m2, structure=np.ones((3, 3)))
        if n:
            sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); big = sz.max()
            keep = np.zeros(n + 1, bool); keep[1:] = sz >= (2 if j['mon'] in KEEP else max(40, big * 0.04))
            m2 = keep[lab]
        out = a.copy(); out[~m2] = 0
        rm.append(int(m.sum() - m2.sum()))
        L = ((out[:, :, :3].astype(int).mean(-1) > 200) & (out[:, :, 3] > 0)).sum(); drop.append(int(L > L0 * 1.6 + 25))
        Image.fromarray(out).save(os.path.join(od, f))
    LOG[d] = {'rm': rm, 'drop': drop}
json.dump(LOG, open('clean_rog_log.json', 'w'), indent=0)
print('ok')
