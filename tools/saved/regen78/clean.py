"""고른 리젠 자리(밀짚더미 3 · 낡은 축사 2) 다듬기 + 배경에 앉혀 보기 — python clean.py
   · 축사 2는 픽셀랩이 풀밭 · 밀밭 조각을 같이 그려 와서(바닥 네모 · 옆 밀단) 잘라 붙인 티가 났다 → 초록 풀 · 옆 밀단 칸을 지우고 건물 덩어리만 남김
   · 놓을 때: 중경(plains_mid) 앞줄(꽃 · 돌 · 풀, 88줄부터)을 자리 그림 위에 한 번 더 그려 밑동이 풀 속에 묻히게 + 발밑 그늘"""
import os, numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def keep_main(a):
    lab, n = ndimage.label(a[..., 3] > 0)
    if n > 1:
        sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); big = np.argmax(sz) + 1
        for i in range(1, n + 1):
            if i != big and sz[i - 1] < 0.15 * sz[big - 1]: a[lab == i] = 0   # 떨어진 밀단 · 풀 조각
    return a
b = np.array(Image.open('raw/barn1.png').convert('RGBA')); H, W = b.shape[:2]
r, g, bl = [b[..., i].astype(int) for i in range(3)]
green = (g > r + 6) & (g > bl + 6)
yellow = (r > 150) & (g > 110) & (bl < 90)
ys, xs = np.mgrid[0:H, 0:W]
b[(green & (ys > 70)) | (yellow & ((xs < 16) | (xs > 110)) & (ys > 60))] = 0
# 건물 밑 줄 아래(풀 바닥)는 모두 지움 — 벽 판자가 끝나는 줄을 찾는다
wall = (b[..., 3] > 0) & ~green
rows = np.where(wall[:, 30:100].sum(1) > 40)[0]; base = rows.max() + 1
b[base:] = 0
barn = Image.fromarray(keep_main(b)); barn.save('pick_barn.png')
hay = Image.fromarray(keep_main(np.array(Image.open('raw/hay2.png').convert('RGBA')))); hay.save('pick_hay.png')
ring = Image.open('raw/ring3.png').convert('RGBA'); ring.save('pick_ring.png')
mid = Image.open('plains_mid.png').convert('RGBA'); gr = Image.open('plains_gr.png').convert('RGBA')
FR = 88   # 중경 앞줄(꽃 · 돌 · 풀)이 시작하는 줄
def scene(prop, x):
    S = Image.new('RGBA', (480, 210), (110, 160, 210, 255)); S.alpha_composite(gr.crop((0, 0, 480, 178)), (0, 118)); S.alpha_composite(mid.crop((0, 0, 480, 114)), (0, 30))   # 땅을 중경 밑에 겹쳐 빈 줄이 없게
    p = prop.crop(prop.getbbox()); bx, by = x - p.width // 2, 30 + 103 - p.height
    sh = Image.new('RGBA', S.size); ImageDraw.Draw(sh).ellipse([bx + 4, by + p.height - 5, bx + p.width - 4, by + p.height + 3], fill=(40, 52, 20, 90)); S.alpha_composite(sh)
    S.alpha_composite(p, (bx, by))
    S.alpha_composite(mid.crop((0, FR, 480, 114)), (0, 30 + FR))   # 앞줄을 다시 — 밑동이 풀 속으로
    return S
out = Image.new('RGBA', (480 * 2 + 30, 210 * 2 + 10), (30, 32, 40, 255))
for i, (p, x) in enumerate(((hay, 330), (barn, 330))):
    out.alpha_composite(scene(p, x).resize((960 // 2 * 1, 420 // 2)), (10, 0)) if False else None
A = scene(hay, 330); B = scene(barn, 330)
out = Image.new('RGBA', (980, 440), (30, 32, 40, 255)); out.alpha_composite(A.resize((960, 420), Image.NEAREST).crop((0, 0, 960, 420)).resize((480, 210)), (10, 10))
big = Image.new('RGBA', (1940, 440), (30, 32, 40, 255)); big.alpha_composite(A.resize((960, 420), Image.NEAREST), (0, 10)); big.alpha_composite(B.resize((960, 420), Image.NEAREST), (975, 10))
big.save('regen_seated.png')
z = Image.new('RGBA', (3 * 390, 390), (80, 140, 200, 255))
for i, im in enumerate((hay, barn, ring)): z.alpha_composite(im.resize((im.width * 3, im.height * 3), Image.NEAREST), (i * 390, 0))
z.save('regen_clean_zoom.png'); print(base)
