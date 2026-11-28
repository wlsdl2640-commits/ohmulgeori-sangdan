# 빌드 80: 1차 여섯 직업 픽셀랩 동작 → src/data-hd80.js (HD80_ADV — 손으로 고치지 말 것, 이 스크립트로 다시 뽑는다)
#   python export80.py ../../../src/data-hd80.js [미리보기 폴더]
#   · 판 그림(키 100 ~ 110칸)을 절반으로(2×2 칸에서 가장 많은 색, 같으면 어두운 색 — export78 half) → hs 1.5 · 게임은 1.5배로 그린다 = 한 칸이 논리 1칸(몬스터와 같은 점 굵기)
#   · 줄마다: 모든 장을 담는 칸으로 자르고 닻 = 첫 장 발(맨 아래 줄들) 가운데 · 되풀이 줄(서 있기 · 걷기 · 달리기)은 끝 장(= 첫 장)을 뺀다
#   · hit: 공격 줄에서 몸 · 무기가 가장 앞으로 나간 장(앞 75% 안) — 게임이 맞히는 때를 이 장에 맞춘다
import json, os, sys, glob, io, base64
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../anim77')))
from rows80 import ROWS
OUT = sys.argv[1]; PRE = sys.argv[2] if len(sys.argv) > 2 else None
if PRE: os.makedirs(PRE, exist_ok=True)
LOOP = {'idle', 'walk', 'run'}

def half(im):
    a = np.array(im); h, w = a.shape[0] // 2 * 2, a.shape[1] // 2 * 2; a = a[:h, :w]
    b = a.reshape(h // 2, 2, w // 2, 2, 4).transpose(0, 2, 1, 3, 4).reshape(h // 2, w // 2, 4, 4)
    out = np.zeros((h // 2, w // 2, 4), np.uint8)
    for y in range(h // 2):
        for x in range(w // 2):
            q = b[y, x]; q = q[q[:, 3] > 0]
            if len(q) < 2: continue
            cs = {}
            for c in q: k = (int(c[0]), int(c[1]), int(c[2])); cs[k] = cs.get(k, 0) + 1
            out[y, x] = (*max(cs.items(), key=lambda kv: (kv[1], -sum(kv[0])))[0], 255)
    return Image.fromarray(out, 'RGBA')

def load(v):
    if isinstance(v, tuple):
        sh = Image.open(v[1]).convert('RGBA'); c = v[2]; return [sh.crop((i * c, 0, i * c + c, sh.height)) for i in range(sh.width // c)]
    return [Image.open(f).convert('RGBA') for f in sorted(glob.glob(v + '/*.png'))]

def png_url(im):
    a = np.array(im); al = a[..., 3] > 0; cols = np.unique(a[al][:, :3], axis=0); buf = io.BytesIO()
    if len(cols) <= 255:
        key = (a[..., 0].astype(np.int32) << 16) | (a[..., 1].astype(np.int32) << 8) | a[..., 2]
        ck = (cols[:, 0].astype(np.int32) << 16) | (cols[:, 1].astype(np.int32) << 8) | cols[:, 2]
        idx = np.zeros(a.shape[:2], np.uint8); idx[al] = (np.searchsorted(ck, key[al]) + 1).astype(np.uint8)
        p = Image.fromarray(idx, 'P'); pal = [0, 0, 0] + [int(v) for c in cols for v in c]; p.putpalette(pal + [0] * (768 - len(pal)))
        p.save(buf, 'PNG', optimize=True, transparency=0)
    else: im.save(buf, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

def row(rn, fs):
    if rn in LOOP and len(fs) > 2: fs = fs[:-1]
    bb = None
    for im in fs:
        b = im.getbbox()
        if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    bb = (max(0, bb[0] - 2) // 2 * 2, max(0, bb[1] - 2) // 2 * 2, bb[2] + 2, bb[3] + 2)
    Wd, Hd = (bb[2] - bb[0]) // 2 * 2, (bb[3] - bb[1]) // 2 * 2
    cut = [half(f.crop((bb[0], bb[1], bb[0] + Wd, bb[1] + Hd))) for f in fs]
    w, h = Wd // 2, Hd // 2
    f0 = np.array(cut[0])[..., 3] > 0; ys = np.where(f0.any(1))[0]; ay = int(ys.max())
    xs = np.where(f0[max(0, ay - 2):ay + 1].any(0))[0]; ax = int(round((xs.min() + xs.max() + 1) / 2))
    n = len(cut); right = [((np.array(c)[..., 3] > 0).any(0).nonzero()[0].max() if c.getbbox() else 0) for c in cut]
    lo, hi = 2, max(3, int(n * 0.75)); hit = int(max(range(lo, min(hi, n)), key=lambda i: right[i])) if n > 4 else n // 2
    sh = Image.new('RGBA', (w * n, h))
    for i, c in enumerate(cut): sh.paste(c, (i * w, 0))
    if PRE: sh.save(os.path.join(PRE, f'{CLS}_{rn}.png'))
    return {'w': w, 'h': h, 'ax': ax, 'ay': ay, 'n': n, 'hs': 1.5, 'hit': hit, 'url': png_url(sh)}

D = {}
for CLS, rs in ROWS.items():
    D[CLS] = {'rows': {}}
    for rn, v in rs.items():
        D[CLS]['rows'][rn] = row(rn, load(v)); m = D[CLS]['rows'][rn]
        print(CLS, rn, m['n'], m['w'], m['h'], 'hit', m['hit'], len(m['url']) // 1024, 'KB', flush=True)
js = ('// 빌드 80: 1차 여섯 직업 픽셀랩 동작 (tools/saved/anim80/export80.py로 뽑음 — 손으로 고치지 말 것)\n'
      'const HD80_ADV = ' + json.dumps(D, separators=(',', ':')) + ';\n')
open(OUT, 'w', encoding='utf-8').write(js); print('total', len(js) // 1024, 'KB')
