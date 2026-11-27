# 빌드 78: 곡창지대 허수아비 다섯(픽셀랩 동작) → src/data-pxl78.js (PXL78_DATA — 손으로 고치지 말 것, 이 스크립트로 다시 뽑는다)
#   python export78.py <src/data-pxl78.js> [미리보기 폴더]
#   · 일반 셋(A3 · B2 · C4): 판 그림을 절반으로(2×2 칸에서 가장 많은 색 — 테두리를 살리려고 같으면 어두운 색) → hs 1 (다른 몬스터와 같은 점 굵기: 한 칸 = 논리 1칸)
#   · 리젠보스 둘(C1 · C2): 작은 그림(hs 1)과 함께 판 그림 그대로(hs 2)를 big으로 — 게임은 우두머리를 2배로 그리며 이 촘촘한 그림을 쓴다(art.js drawMon · hd70.js hdMonSpr)
#   · 서 있기 24장 → 12장, 동작 32장 → 16장(고르게 골라냄 · 끝 장 = 첫 장은 뺀다) · 오른쪽을 보게 뒤집는다(게임 몬스터 그림은 오른쪽을 본다)
import json, os, sys, io, base64
import numpy as np
from PIL import Image
OUT = sys.argv[1]; PRE = sys.argv[2] if len(sys.argv) > 2 else None
if PRE: os.makedirs(PRE, exist_ok=True)
PICK = {   # 대표님이 고른 장(11-27) — 열쇠: 게임 몬스터 id
    'scare_a3': [('idle', 'idle_s11'), ('crow1', 'crow1_s11'), ('crows', 'crows_s12')],
    'scare_b2': [('idle', 'idle_s11'), ('crow1', 'crow1_s12'), ('lantern', 'lantern2_s14')],
    'scare_c4': [('idle', 'idle_s11'), ('sickle', 'sickle_s11'), ('crows', 'crows_s12')],
    'scare_c1': [('idle', 'idle_s12'), ('sickle', 'sickle_s12'), ('crows', 'crows_s11'), ('swarm', 'swarm_s11')],
    'scare_c2': [('idle', 'idle_s12'), ('sickle', 'sickle_s12'), ('crows', 'crows_s12'), ('swarm', 'swarm_s11')],
}
BIG = {'scare_c1', 'scare_c2'}
NF = {'idle': 12}   # 나머지 16

def frames(mid, d, n):
    fs = sorted(f for f in os.listdir(f'clean/{mid}/{d}') if f.endswith('.png'))
    if len(fs) > 2: fs = fs[:-1]   # 끝 장 = 첫 장
    sel = [fs[round(i * len(fs) / n)] for i in range(n)] if len(fs) >= n else fs
    return [Image.open(f'clean/{mid}/{d}/{f}').convert('RGBA').transpose(Image.FLIP_LEFT_RIGHT) for f in sel]

def half(im):   # 2×2 → 1칸: 불투명 둘 이상이면 가장 많은 색(같으면 어두운 색)
    a = np.array(im); h, w = a.shape[0] // 2 * 2, a.shape[1] // 2 * 2; a = a[:h, :w]
    out = np.zeros((h // 2, w // 2, 4), np.uint8)
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            b = a[y:y + 2, x:x + 2].reshape(-1, 4); b = b[b[:, 3] > 0]
            if len(b) < 2: continue
            cs = {}
            for c in b: k = tuple(int(v) for v in c[:3]); cs[k] = cs.get(k, 0) + 1
            best = max(cs.items(), key=lambda kv: (kv[1], -sum(kv[0])))[0]
            out[y // 2, x // 2] = (*best, 255)
    return Image.fromarray(out, 'RGBA')

def png_url(im, name=None):
    a = np.array(im); al = a[..., 3] > 0; cols = np.unique(a[al][:, :3], axis=0)
    buf = io.BytesIO()
    if len(cols) <= 255:
        lut = {tuple(int(v) for v in c): i + 1 for i, c in enumerate(cols)}; idx = np.zeros(a.shape[:2], np.uint8)
        for y, x in zip(*np.where(al)): idx[y, x] = lut[tuple(int(v) for v in a[y, x, :3])]
        p = Image.fromarray(idx, 'P'); pal = [0, 0, 0] + [int(v) for c in cols for v in c]; p.putpalette(pal + [0] * (768 - len(pal)))
        p.save(buf, 'PNG', optimize=True, transparency=0)
    else: im.save(buf, 'PNG', optimize=True)
    if PRE and name: im.save(os.path.join(PRE, name + '.png'))
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

def sheet(rows, k):   # rows: [(줄, [장])] (같은 칸 크기) → 판 · 닻
    ims = [f for _, fs in rows for f in fs]; bb = None
    for im in ims:
        b = im.getbbox()
        if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    p = 2 * k; bb = (max(0, bb[0] - p), max(0, bb[1] - p), bb[2] + p, bb[3] + p)
    W, H = bb[2] - bb[0], bb[3] - bb[1]
    if k == 1: W, H = W // 2 * 2, H // 2 * 2
    cut = [(rn, [f.crop((bb[0], bb[1], bb[0] + W, bb[1] + H)) for f in fs]) for rn, fs in rows]
    if k == 1: cut = [(rn, [half(f) for f in fs]) for rn, fs in cut]; W, H = W // 2, H // 2
    f0 = np.array(cut[0][1][0])[..., 3] > 0; ys = np.where(f0.any(1))[0]; ay = int(ys.max())
    xs = np.where(f0[max(0, ay - 2 * k):ay + 1].any(0))[0]; ax = int(round((xs.min() + xs.max() + 1) / 2))   # 닻 = 맨 아래(장대 끝) 가운데
    mx = max(len(fs) for _, fs in cut); sh = Image.new('RGBA', (W * mx, H * len(cut)))
    for r, (rn, fs) in enumerate(cut):
        for i, f in enumerate(fs): sh.alpha_composite(f, (i * W, r * H))
    return {'hs': k, 'w': W, 'h': H, 'ax': ax, 'ay': ay, 'rows': [rn for rn, _ in cut], 'n': [len(fs) for _, fs in cut]}, sh

mon = {}
for mid, L in PICK.items():
    rows = [(rn, frames(mid, d, NF.get(rn, 16))) for rn, d in L]
    m, sh = sheet(rows, 1); m['url'] = png_url(sh, mid); mon[mid] = m
    if mid in BIG:
        b, sh2 = sheet(rows, 2); assert b['n'] == m['n']; b['url'] = png_url(sh2, mid + '_big'); mon[mid]['big'] = {k: b[k] for k in ('hs', 'w', 'h', 'ax', 'ay', 'url')}
    print(mid, m['w'], m['h'], m['ax'], m['ay'], m['n'], 'big' if mid in BIG else '')
js = ('/* 빌드 78: 곡창지대 허수아비 다섯(픽셀랩 동작 — tools/saved/anim77/export78.py로 뽑는다, 손으로 고치지 말 것). hd70.js hdLoad가 HD70_DATA.mon과 같이 푼다 */\n'
      'const PXL78_DATA = ' + json.dumps({'mon': mon}, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(OUT, 'w', encoding='utf-8').write(js); print(OUT, round(len(js) / 1024), 'KB')
