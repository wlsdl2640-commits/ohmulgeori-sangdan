"""마법사 1차 판 넷(GPT) → 사이 값 그림(점 한 칸 = 화면 2픽셀) 시안
   python3 extract_m1.py <서 있는 키(칸 · 모자 포함)> [점검판 폴더]   → out_m1_<키>/<줄>_<i>.png · meta.json (hs 1.5 — ../mid70/out_mid40과 같은 꼴)
   판마다 그린 크기가 달라서(기준 자세 판은 서 있는 키 371픽셀 · 두 줄 판은 220 ~ 229) 판마다 서 있는 키를 재어 같은 칸 수로 맞춘다.
   줄: side · front · sit · sleep · hurt(기준 자세 판에서 한 장씩) · walk 16 · cast 16 · death 16
   닻: 걷기 = 모자 챙(금 띠) 가운데 · 그 밖 = 뒷발 뒤꿈치 · 땅 줄 = 그 장의 맨 아래. 팔레트는 네 판이 함께 쓴다(m1_pal.pkl)"""
import json, os, sys, pickle
import numpy as np
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'mid70'))
from mid_core import Palette, flat_pixels, down, to_rgba
from seg_m1 import key, split, heel
T = int(sys.argv[1]); CHK = sys.argv[2] if len(sys.argv) > 2 else None
CLS = os.environ.get('CLS', 'mage')   # 다른 직업: CLS=archer (판 archer1_base · walk · shot · death → out_archer1_<키>/ · 팔레트 archer1_pal.pkl)
ATK = {'mage': 'cast', 'archer': 'shot', 'cleric': 'swing'}[CLS]; TAG = 'm1' if CLS == 'mage' else CLS + '1'; OUT = f'out_{TAG}_{T}'; os.makedirs(OUT, exist_ok=True); PALF = f'{TAG}_pal.pkl'
SH = os.path.join(HERE, '..', 'hd70', 'sheets')
SHEETS = [('base', 1, 5), ('walk', 2, 8), (ATK, 2, 8), ('death', 2, 8)]
D = {}
for name, rows, per in SHEETS:
    rgb, fg = key(np.array(Image.open(f'{SH}/{CLS}1_{name}.webp').convert('RGB')))
    D[name] = [(rgb[y0:y0 + m.shape[0], x0:x0 + m.shape[1]], m) for m, (x0, y0) in split(fg, rows, per)]
REFH = {'base': D['base'][0][1].shape[0], 'walk': float(np.median([m.shape[0] for _, m in D['walk']])), ATK: D[ATK][0][1].shape[0], 'death': D['death'][0][1].shape[0]}   # 서 있는 키(판 픽셀)
if not os.path.exists(PALF):
    samp = np.vstack([flat_pixels(r, m) for F in D.values() for r, m in F]); rs = np.random.RandomState(1)
    pickle.dump(Palette(samp[rs.choice(len(samp), min(len(samp), 200000), replace=False)], groups=11), open(PALF, 'wb'))
P = pickle.load(open(PALF, 'rb'))

def brim_x(rgb, m):   # 모자 챙의 금 띠 가운데 (머리는 제자리, 발이 돈다)
    r, g, b = [rgb[..., i].astype(int) for i in range(3)]; gold = m & (r > 170) & (g > 120) & (b < 110) & (r - b > 90); gold[int(m.shape[0] * 0.45):] = False
    xs = np.where(gold.any(0))[0]; return (xs.min() + xs.max()) / 2 if len(xs) else m.shape[1] / 2

def head_x(rgb, m):   # 궁수: 두건(위 35% — 붉은 깃은 빼고)의 가운데
    r, g, b = [rgb[..., i].astype(int) for i in range(3)]; hd = m & ~((r > 150) & (r - g > 60)); hd[int(m.shape[0] * 0.35):] = False
    xs = np.where(hd.sum(0) > 2)[0]; return (xs.min() + xs.max()) / 2 if len(xs) else m.shape[1] / 2

WALK_X = brim_x if CLS == 'mage' else head_x
ROWS = [('side', 'base', [0]), ('front', 'base', [1]), ('sit', 'base', [2]), ('sleep', 'base', [3]), ('hurt', 'base', [4]), ('walk', 'walk', range(16)), (ATK, ATK, range(16)), ('death', 'death', range(16))]
meta = {}
for rn, sheet, idx in ROWS:
    c = REFH[sheet] / T; F = []
    for i in idx:
        rgb, m = D[sheet][i]
        ax = WALK_X(rgb, m) if rn == 'walk' else m.shape[1] / 2 if rn in ('front', 'sit', 'sleep') else heel(m)
        F.append(down(rgb, m, (-ax, -m.shape[0]), c, P))
    X0 = min(-r[1][0] for r in F); Y0 = min(-r[1][1] for r in F); X1 = max(r[0].shape[1] - r[1][0] for r in F); Y1 = max(r[0].shape[0] - r[1][1] for r in F)
    W, H, ax, ay = X1 - X0 + 2, Y1 - Y0 + 2, 1 - X0, 1 - Y0
    for i, r in enumerate(F):
        im = np.zeros((H, W, 4), np.uint8); a = to_rgba(r[0], P.pal); x, y = ax - r[1][0], ay - r[1][1]; im[y:y + a.shape[0], x:x + a.shape[1]] = a
        Image.fromarray(im, 'RGBA').save(f'{OUT}/{rn}_{i}.png')
    meta[rn] = {'hs': 1.5, 'w': int(W), 'h': int(H), 'ax': int(ax), 'ay': int(ay), 'n': len(F)}
    print('%-6s 칸 %3d×%3d 닻 %3d,%3d · 한 칸 = 판 %.2f픽셀' % (rn, W, H, ax, ay, c))
json.dump(meta, open(f'{OUT}/meta.json', 'w')); print('색', len(P.pal), REFH)
if CHK:
    os.makedirs(CHK, exist_ok=True); Z = 4
    for rn, m in meta.items():
        if m['n'] < 2: continue
        S = Image.new('RGBA', (8 * m['w'] * Z, 2 * (m['h'] * Z + 4)), (96, 150, 84, 255))
        for i in range(m['n']): S.alpha_composite(Image.open(f'{OUT}/{rn}_{i}.png').resize((m['w'] * Z, m['h'] * Z), Image.NEAREST), ((i % 8) * m['w'] * Z, (i // 8) * (m['h'] * Z + 4)))
        S.convert('RGB').save(f'{CHK}/{TAG}_{T}_{rn}.png')
