"""사이 값 시안 3단계: 평원 몬스터 6종을 같은 굵기(점 한 칸 = 화면 2픽셀 = 논리 1픽셀)로 다시 줄인다
   python3 extract_mid_mon.py [점검판 폴더]   → out_midmon/<id>/<줄>_<i>.png · meta.json  (hd70/out_mon과 같은 꼴 · hs 1)
   장 나누기 · 닻은 ../hd70/extract_mon.py 그대로(그 파일의 「meta = {}」 앞까지를 돌리고, 닻을 잡는 고리만 여기 옮겨 적었다 — 거기를 고치면 여기도)"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); HD = os.path.join(HERE, '..', 'hd70')
sys.path.insert(0, HD); sys.path.insert(0, HERE)
from mid_core import Palette, flat_pixels, down, to_rgba, nb4
src = open(os.path.join(HD, 'extract_mon.py'), encoding='utf-8').read().split('\nmeta = {}')[0].replace("OUT = 'out_mon'; os.makedirs(OUT, exist_ok=True)", "OUT = None")
ns = {'__name__': 'xmon'}; exec(compile(src, 'extract_mon_head', 'exec'), ns)
CONF, load, row_bands, frames_of, scale_band, main_comp, prof_box, best_off = (ns[k] for k in ('CONF', 'load', 'row_bands', 'frames_of', 'scale_band', 'main_comp', 'prof_box', 'best_off'))
CHK = sys.argv[1] if len(sys.argv) > 1 else None
OUT = 'out_midmon'; os.makedirs(OUT, exist_ok=True); meta = {}
for mid, cf in CONF.items():
    ns['GRID'] = cf.get('grid'); GRID = ns['GRID']
    rgb, fg = load(cf); B = row_bands(fg, len(cf['rows'])); assert len(B) == len(cf['rows']), (mid, B)
    allf = []; ref = None; cnt0 = None
    for (rname, n), (y0, y1) in zip(cf['rows'], B):
        bfg, brgb = fg[y0:y1 + 1], rgb[y0:y1 + 1]
        masks, centers = frames_of(bfg, 0, y1 - y0, n)
        cnt = float(np.median([main_comp(m).sum() for m in masks]))
        if cnt0 is None: cnt0 = cnt
        r = (cnt / cnt0) ** 0.5
        if cf.get('norm', True) and abs(r - 1) > 0.06:
            f = 1 / r; bfg, brgb = scale_band(bfg, brgb, f); masks, centers = frames_of(bfg, 0, bfg.shape[0] - 1, n)
            if GRID is not None: centers = [c * f for c in centers]
        bots = [np.where(m.any(axis=1))[0].max() for m in masks]
        base = bots[0] if rname in cf['jump'] else int(np.median(bots))
        mains = [main_comp(m) for m in masks]
        if ref is None:
            ref = mains[0]; xs = np.where(ref.any(axis=0))[0]; ref_cx = (xs.min() + xs.max()) / 2; ref_p, ref_x0 = prof_box(ref)
        cxs = []
        for i, (m, mm) in enumerate(zip(masks, mains)):
            xs = np.where(mm.any(axis=0))[0]; cx = (xs.min() + xs.max()) / 2
            if rname in cf['jump'] and i > 0: dx = cxs[0][1] - (centers[i] - centers[0])
            else: pf, fx0 = prof_box(mm); dx = ref_x0 + best_off(ref_p, pf) - fx0
            cxs.append((cx, dx)); allf.append((rname, i, m, brgb, int(round(dx)), base))
    ys_ref = np.where(ref.any(axis=1))[0]; c = (ys_ref.max() - ys_ref.min() + 1) / (cf['th'] * 1.2)     # 한 칸 = 판 c픽셀 (지금 그림은 이 절반 — hs 2)
    crops = []
    for rname, i, m, brgb, dx, base in allf:
        ys, xs = np.where(m); sl = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
        crops.append((rname, i, np.clip(brgb[sl], 0, 255).astype(np.uint8), m[sl], (xs.min() + dx - ref_cx, ys.min() - base - 1)))
    samp = np.vstack([flat_pixels(cr[2], cr[3]) for cr in crops[::2]]); rs = np.random.RandomState(1)
    P = Palette(samp[rs.choice(len(samp), min(len(samp), 120000), replace=False)], groups=9)
    F = [down(cr[2], cr[3], cr[4], c, P) for cr in crops]
    if cf['bg'] == 'dark':   # 검은 바탕 판은 바깥 테가 바탕에 묻혀 덮개에 없다 → 한 칸 테를 두른다 (extract_mon.py와 같은 뜻)
        for r in F:
            o = np.pad(r[0], 1, constant_values=-1); a = o >= 0; ring = np.logical_or.reduce(nb4(a)) & ~a; o[ring] = 1; r[0] = o; r[1] = (r[1][0] + 1, r[1][1] + 1)
    X0 = min(-r[1][0] for r in F); Y0 = min(-r[1][1] for r in F); X1 = max(r[0].shape[1] - r[1][0] for r in F); Y1 = max(r[0].shape[0] - r[1][1] for r in F)
    W, Hh, ax, ay = X1 - X0 + 2, Y1 - Y0 + 2, 1 - X0, 1 - Y0
    os.makedirs(f'{OUT}/{mid}', exist_ok=True); rows = {}
    for (rname, i, *_), r in zip(crops, F):
        im = np.zeros((Hh, W, 4), np.uint8); a = to_rgba(r[0], P.pal); x, y = ax - r[1][0], ay - r[1][1]; im[y:y + a.shape[0], x:x + a.shape[1]] = a
        Image.fromarray(im, 'RGBA').save(f'{OUT}/{mid}/{rname}_{i}.png'); rows[rname] = rows.get(rname, 0) + 1
    meta[mid] = {'hs': 1, 'w': int(W), 'h': int(Hh), 'ax': int(ax), 'ay': int(ay), 'rows': rows}
    print('%-9s 칸 %3d×%3d  닻 %3d,%3d  한 칸 = 판 %.2f픽셀  색 %d' % (mid, W, Hh, ax, ay, c, len(P.pal)), rows)
json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
if CHK:
    os.makedirs(CHK, exist_ok=True)
    for mid, m in meta.items():
        Zm = 4; W, Hh = m['w'], m['h']; mx = max(m['rows'].values()); S = Image.new('RGBA', (mx * W * Zm, len(m['rows']) * (Hh * Zm + 4)), (96, 150, 84, 255))
        for r, (rn, n) in enumerate(m['rows'].items()):
            for i in range(n): S.alpha_composite(Image.open(f'{OUT}/{mid}/{rn}_{i}.png').resize((W * Zm, Hh * Zm), Image.NEAREST), (i * W * Zm, r * (Hh * Zm + 4)))
        S.convert('RGB').save(f'{CHK}/midmon_{mid}.png')
