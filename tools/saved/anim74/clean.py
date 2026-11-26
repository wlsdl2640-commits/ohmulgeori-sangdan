# 전사 동작 정리: 첫 장(기준 그림)에 없는 색(섬광 · 타격 조각) 지우기 → 몸과 떨어진 작은 덩어리(흰 베기 자국 · 튀는 조각) 지우기
#   python clean.py  → clean/<동작>/<v>/NN.png · clean_log.json
import os, json, numpy as np
from PIL import Image
from scipy import ndimage
J = json.load(open('jobs_in.json', encoding='utf-8')); LOG = {}
TH = 46          # 첫 장 색에서 이만큼(RGB 거리) 넘게 떨어진 칸 = 효과
for j in J:
    d = f"{j['mon']}/{j['row']}"
    if not os.path.isdir(d) or not os.path.exists(d + "/00.png"): continue
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))
    p0 = np.array(Image.open(os.path.join(d, fs[0])).convert('RGBA')); pal = np.unique(p0[p0[:, :, 3] > 0][:, :3], axis=0).astype(np.int32); pal = pal[pal.min(1) < 250]   # 순백(투구 반짝 7칸)은 빼서 흰 궤적 · 별을 잡는다
    lum0 = (p0[:, :, :3].astype(int).mean(-1) > 200) & (p0[:, :, 3] > 0); L0 = lum0.sum()
    od = os.path.join('clean', d); os.makedirs(od, exist_ok=True); rm = []; drop = []
    for f in fs:
        a = np.array(Image.open(os.path.join(d, f)).convert('RGBA')); m = a[:, :, 3] > 0
        px = a[:, :, :3].reshape(-1, 3).astype(np.int32); dist = np.full(len(px), 1e9)
        for c0 in range(0, len(pal), 64):
            dd = ((px[:, None, :] - pal[None, c0:c0 + 64, :]) ** 2).sum(-1).min(1); dist = np.minimum(dist, dd)
        dist = np.sqrt(dist).reshape(m.shape); light = a[:, :, :3].astype(int).mean(-1) > 185
        far = ((dist > TH) | (light & (dist > 14))) & m
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
            keep = np.zeros(n + 1, bool); keep[1:] = sz >= max(40, big * 0.04)
            m2 = keep[lab]
        out = a.copy(); out[~m2] = 0
        rm.append(int(m.sum() - m2.sum()))
        L = ((out[:, :, :3].astype(int).mean(-1) > 200) & (out[:, :, 3] > 0)).sum(); drop.append(int(L > L0 * 1.6 + 25))
        Image.fromarray(out).save(os.path.join(od, f))
    LOG[d] = {'rm': rm, 'drop': drop}
json.dump(LOG, open('clean_log.json', 'w'), indent=0)
print('ok')
