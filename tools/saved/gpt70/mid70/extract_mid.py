"""사이 값 시안 2단계: 전사 16장 동작을 「점 한 칸 = 화면 2픽셀」 굵기로 다시 줄인다 (mid_core.py — 다수결 · 테 살리기)
   python3 extract_mid.py <키(칸)> [점검판 폴더]   → out_mid<키>/<동작>_<i>.png · <동작>_b_<i>.png(칼날 칸) · meta.json  (hd70/out_war16과 같은 꼴 · hs 1.5)
   먼저 prep_mid.py (mid_prep/). 팔레트는 mid_pal.pkl에 한 번 만들어 모든 키가 같이 쓴다."""
import json, os, sys, pickle
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mid_core import Palette, flat_pixels, down, to_rgba
H = int(sys.argv[1]); CHK = sys.argv[2] if len(sys.argv) > 2 else None
OUT = f'out_mid{H}'; os.makedirs(OUT, exist_ok=True)
REF = json.load(open('mid_prep/ref.json'))['h']; c = REF / H
MOTS = ['walk', 'run', 'idle', 'slash', 'upper', 'thrust', 'bash', 'guard', 'hurt', 'death', 'sit', 'sleep', 'front']   # extract_war16.py MOT 차례
Z = {k: np.load(f'mid_prep/{k}.npz') for k in MOTS}
if not os.path.exists('mid_pal.pkl'):
    samp = np.vstack([flat_pixels(z[f'rgb{i}'], z[f'm{i}']) for z in Z.values() for i in range(0, int(z['n']), 2)]); rs = np.random.RandomState(1)
    pickle.dump(Palette(samp[rs.choice(len(samp), min(len(samp), 200000), replace=False)]), open('mid_pal.pkl', 'wb'))
P = pickle.load(open('mid_pal.pkl', 'rb')); meta = {}
for name in MOTS:
    z = Z[name]; n = int(z['n']); F = []
    for i in range(n):
        o = z[f'o{i}']; ex = z[f'b{i}'] if f'b{i}' in z else None
        r = down(z[f'rgb{i}'], z[f'm{i}'], (o[0], o[1] - 1), c, P, extra=ex); F.append(r)     # 땅 줄 = 발 맨 아래 줄의 아래 끝
    X0 = min(-r[1][0] for r in F); Y0 = min(-r[1][1] for r in F); X1 = max(r[0].shape[1] - r[1][0] for r in F); Y1 = max(r[0].shape[0] - r[1][1] for r in F)
    W, Hh, ax, ay = X1 - X0 + 2, Y1 - Y0 + 2, 1 - X0, 1 - Y0
    for i, r in enumerate(F):
        im = np.zeros((Hh, W, 4), np.uint8); a = to_rgba(r[0], P.pal); x, y = ax - r[1][0], ay - r[1][1]; im[y:y + a.shape[0], x:x + a.shape[1]] = a
        Image.fromarray(im, 'RGBA').save(f'{OUT}/{name}_{i}.png')
        if len(r) > 2:
            b = np.zeros((Hh, W), np.uint8); b[y:y + a.shape[0], x:x + a.shape[1]] = (r[2] & (r[0] >= 0)) * 255
            Image.fromarray(np.dstack([np.full((Hh, W, 3), 255, np.uint8), b]), 'RGBA').save(f'{OUT}/{name}_b_{i}.png')
    meta[name] = {'hs': 1.5, 'w': int(W), 'h': int(Hh), 'ax': int(ax), 'ay': int(ay), 'n': n}
    if 'e0' in z: meta[name]['bl'] = [[round(float(v), 1) for v in (z[f'e{i}'] / c).ravel()] for i in range(n)]   # 닻에서: 손잡이 끝 x, y · 칼끝 x, y (칸 · 위가 −)
    print('%-6s 칸 %3d×%3d  닻 %3d,%3d' % (name, W, Hh, ax, ay))
json.dump(meta, open(f'{OUT}/meta.json', 'w'))
print('색', len(P.pal), '한 칸 = 판 %.2f픽셀' % c)
if CHK:
    os.makedirs(CHK, exist_ok=True)
    for name, m in meta.items():
        Zm = 4; W, Hh, n = m['w'], m['h'], m['n']; S = Image.new('RGBA', (8 * W * Zm, ((n + 7) // 8) * (Hh * Zm + 12)), (96, 150, 84, 255)); d = ImageDraw.Draw(S)
        for i in range(n):
            x, y = (i % 8) * W * Zm, (i // 8) * (Hh * Zm + 12)
            S.alpha_composite(Image.open(f'{OUT}/{name}_{i}.png').resize((W * Zm, Hh * Zm), Image.NEAREST), (x, y + 12)); d.text((x + 3, y), str(i), fill=(255, 255, 255, 255))
            d.line([(x, y + 12 + m['ay'] * Zm), (x + W * Zm, y + 12 + m['ay'] * Zm)], fill=(255, 255, 0, 110))
        S.convert('RGB').save(f'{CHK}/mid{H}_{name}.png')
