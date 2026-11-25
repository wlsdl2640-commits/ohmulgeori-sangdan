# 방패 밀치기 다시(11-25 밤 대표님 「에너지 형태의 방패가 나와 앞으로 나아가다 사라지게」): shoveQ1~4 그림을 전사 밀치기 동작에 맞춰
# 방패 자리에서 생겨(작게 · 옅게 → 제 크기) 앞으로 나아가며(빠르게 → 느리게) 잔상 둘을 남기고 천천히 옅어짐 → shoveQ<n>_scene.gif
import os, sys, math
from PIL import Image
import mk_fx3 as m
GY, FX = m.GY, m.FX
import numpy as np
from scipy import ndimage
def lead(e):   # 맨 앞(오른쪽) 방패 덩어리만 — 그림 속 잔상 · 꼬리는 버리고 움직이며 새로 만든다
    a = np.array(e); m_ = a[:, :, 3] > 40; lab, k = ndimage.label(m_, np.ones((3, 3)))
    sz = ndimage.sum(m_, lab, range(1, k + 1)); big = [i + 1 for i in range(k) if sz[i] > sz.max() * 0.15]
    sl = ndimage.find_objects(lab); i = max(big, key=lambda j: sl[j - 1][1].stop)
    ys, xs = sl[i - 1]; x0 = max(0, xs.start - 3); keep = np.zeros_like(m_); keep[:, x0:] = True
    a[~keep] = 0; out = Image.fromarray(a); return out.crop(out.getbbox())
def ease(x): return 1 - (1 - x) ** 3
DIST, TR_, ALPHA, FADE0, FADEN = 84, 22, 1.0, 10, 12
GH = None
def make(n, flip=False, short=False):
    global DIST, TR_, ALPHA, FADE0, FADEN
    if short: DIST, TR_, ALPHA, FADE0, FADEN = 24, 6, 0.72, 3, 7   # 11-25 밤 「아주 짧게 앞으로 나간 뒤 바로 사라지게」 · 투명하게
    name = f'shoveQ{n}_short' if short else f'shoveQ{n}'
    e = Image.open(f'shoveQ{n}/00.png').convert('RGBA')
    if flip: e = e.transpose(Image.FLIP_LEFT_RIGHT)
    e = lead(e); k0 = min(1, (46 if short else 58) / e.height); e = e.resize((round(e.width * k0), round(e.height * k0)), Image.NEAREST) if k0 < 1 else e
    wf, hit, cw = m.strip('shove'); x0 = FX + 30; y0 = GY - 62 - e.height // 2
    if short:   # 11-26 대표님 「나가는 효과 높이가 방패와 맞게 — 너무 높음」: 맞히는 장 방패 가운데(띠 칸 x 138 · y 76)에서 시작
        x0 = FX - 76 + 138 - e.width // 2 + 6; y0 = GY - 124 + 76 - e.height // 2
    T0, TRAV, N = hit, TR_, 26          # 맞히는 장부터 생김
    out = []
    def pos(k):                        # 생긴 뒤 k장째: (x, 크기, 진하기)
        u = min(1, max(0, k / TRAV)); x = x0 + DIST * ease(u)
        sc = 0.7 + 0.3 * min(1, k / 2); al = ALPHA * min(1, (k + 1) / 2) * (1 - max(0, (k - FADE0) / FADEN)) if k >= 0 else 0
        return x, sc, max(0, al)
    for i in range(N):
        t = m.tile(); w = wf[min(i, len(wf) - 1)]; t.alpha_composite(w, (FX - (cw // 2 if cw != m.W else 76), GY - 124))
        k = i - T0
        GHL = ((k - 1, 0.35), (k, 1.0)) if short else ((k - 4, 0.25), (k - 2, 0.45), (k, 1.0))
        for g, ga in GHL:
            if g < 0: continue
            x, sc, al = pos(g); al *= ga
            if al <= 0.02: continue
            im = e.resize((max(1, round(e.width * sc)), max(1, round(e.height * sc))), Image.NEAREST)
            im.putalpha(im.getchannel('A').point(lambda v: int(v * al)))
            t.alpha_composite(im, (int(x + (e.width - im.width) / 2), int(y0 + (e.height - im.height) / 2)))
        out.append(t.convert('RGB').crop((70, 70, 330, 224)))
    o2 = out if short else out[::2]; o2[0].save(f'../fx5/{name}_scene.gif', save_all=True, append_images=o2[1:], duration=[70 if short else 140] * len(o2), loop=0)
    return out
if __name__ == '__main__':
    short = 'short' in sys.argv
    for n in (1, 2, 3, 4): make(n, flip=(n == 3), short=short); print(n)
