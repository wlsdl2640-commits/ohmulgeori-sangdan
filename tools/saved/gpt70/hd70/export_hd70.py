"""빌드 70 시험: 곡창지대 평원 리마스터 그림 → src/data-hd70.js (손으로 고치지 말 것 — 이 스크립트로 다시 뽑는다)
   몬스터 6종 동작 장(out_mon — extract_mon.py) · 전사 1차 동작 장(out_war — extract_war.py) · 1차 스킬 그림(out_sk — extract_sk.py)
   · 넓은 평원 풍경 겹(사용자 그림: 다 겹친 모습 38f56457 · 겹 4b92ccaf)
   python3 export_hd70.py <src/data-hd70.js> [미리보기 폴더]"""
import json, base64, io, sys, os
import numpy as np
from PIL import Image
from seg import sheet_path
OUT = sys.argv[1]; PRE = sys.argv[2] if len(sys.argv) > 2 else None
if PRE: os.makedirs(PRE, exist_ok=True)
SKI_A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'

def png_url(im, name=None):   # 색이 255개 이하면 팔레트 PNG (투명 한 칸)
    im = im.convert('RGBA'); a = np.array(im); al = a[..., 3] > 0
    cols = np.unique(a[al][:, :3], axis=0)
    if len(cols) <= 255:
        idx = np.zeros(a.shape[:2], np.uint8); lut = {tuple(c): i + 1 for i, c in enumerate(cols)}
        flat = a[..., :3].reshape(-1, 3); fa = al.reshape(-1); out = np.zeros(len(flat), np.uint8)
        for j in np.where(fa)[0]: out[j] = lut[tuple(flat[j])]
        p = Image.fromarray(out.reshape(a.shape[:2]), 'P'); pal = [0, 0, 0] + [int(v) for c in cols for v in c]
        p.putpalette(pal + [0] * (768 - len(pal))); buf = io.BytesIO(); p.save(buf, 'PNG', optimize=True, transparency=0)
    else:
        buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    if PRE and name: im.save(os.path.join(PRE, name + '.png'))
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

# ── 1. 몬스터: 줄마다 한 줄, 장은 옆으로 (멧돼지 둘은 왼쪽을 보고 있어서 뒤집는다 — 게임 몬스터 그림은 오른쪽을 본다)
FLIP = {'boar', 'aboar'}
M = json.load(open('out_mon/meta.json')); mon = {}
for mid, m in M.items():
    rows = list(m['rows'].keys()); W, H = m['w'], m['h']; mx = max(m['rows'].values())
    sh = Image.new('RGBA', (W * mx, H * len(rows)), (0, 0, 0, 0))
    for r, rn in enumerate(rows):
        for i in range(m['rows'][rn]):
            f = Image.open(f'out_mon/{mid}/{rn}_{i}.png').convert('RGBA')
            if mid in FLIP: f = f.transpose(Image.FLIP_LEFT_RIGHT)
            sh.alpha_composite(f, (i * W, r * H))
    mon[mid] = {'w': W, 'h': H, 'ax': (W - m['ax']) if mid in FLIP else m['ax'], 'ay': m['ay'], 'rows': rows, 'n': [m['rows'][r] for r in rows], 'url': png_url(sh, 'mon_' + mid)}

# ── 2. 전사 1차
WM = json.load(open('out_war/meta.json')); rows = list(WM['rows'].keys()); W, H = WM['w'], WM['h']
sh = Image.new('RGBA', (W * 8, H * len(rows)), (0, 0, 0, 0))
for r, rn in enumerate(rows):
    for i in range(WM['rows'][rn]): sh.alpha_composite(Image.open(f'out_war/{rn}_{i}.png').convert('RGBA'), (i * W, r * H))
fr = WM['front']
war = {'w': W, 'h': H, 'ax': WM['ax'], 'ay': WM['ay'], 'rows': rows, 'n': [WM['rows'][r] for r in rows], 'url': png_url(sh, 'warrior'),
       'front': {'w': fr['w'], 'h': fr['h'], 'ax': fr['ax'], 'ay': fr['ay'], 'url': png_url(Image.open('out_war/front.png'), 'warrior_front')}}

# ── 3. 스킬 그림 34×40 (육각 안쪽 x 7 ~ 40 · y 4 ~ 43) — 「팔레트|칸」 꼴 (data-skicon.js와 같은 글자)
ski = {}
SKM = json.load(open('out_sk/meta.json'))
for sid in SKM['ids']:
    a = np.array(Image.open(f'out_sk/icon_{sid}.png').convert('RGB')); cols = []; idx = []
    for px in a.reshape(-1, 3):
        c = '%02x%02x%02x' % tuple(int(v) for v in px)
        if c not in cols: cols.append(c)
        idx.append(cols.index(c))
    assert len(cols) <= 64, (sid, len(cols))
    ski[sid] = ''.join(cols) + '|' + ''.join(SKI_A[i] for i in idx)

# ── 4. 넓은 평원 풍경 (논리 480 = 그림 2172칸, k = 480 / 2172)
def keyed(path):
    a = np.array(Image.open(path).convert('RGB')).astype(int); R, G, B = a[..., 0], a[..., 1], a[..., 2]
    mag = ((R > 170) & (B > 170) & (G < 110) & (np.abs(R - B) < 90)) | ((R - G > 70) & (B - G > 70))
    return np.dstack([a, np.where(mag, 0, 255)]).astype(np.uint8)
K = 480 / 2172
def shrink(rgba, k, colors=None):   # 프리멀티플로 줄이고 알파 0/255
    a = rgba.astype(np.float32); A = a[..., 3:4] / 255.0; P = a[..., :3] * A
    h, w = a.shape[:2]; tw, th = max(1, round(w * k)), max(1, round(h * k))
    def rs(ch): return np.array(Image.fromarray(ch, 'F').resize((tw, th), Image.LANCZOS))
    A2 = np.clip(rs(A[..., 0]), 0, 1); C = np.dstack([rs(P[..., c]) for c in range(3)]) / np.maximum(A2[..., None], 1e-3)
    out = np.dstack([np.clip(C, 0, 255), (A2 > 0.5) * 255]).astype(np.uint8)
    im = Image.fromarray(out, 'RGBA')
    if colors:
        q = im.convert('RGB').quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
        im = Image.fromarray(np.dstack([np.array(q), out[..., 3]]).astype(np.uint8), 'RGBA')
    return im
comp = keyed(sheet_path('38f56457'))   # 사용자 그림 1: 다 겹친 모습
Y = lambda y: 200 - (724 - y) * K           # 그림 1의 y → 무대 y (아래를 맞춘다)
MID0, CUT, GR0 = 134, 392, 380              # 중경(언덕 · 농장 · 울타리 앞 풀) = 134 ~ 392 · 땅 = 380 ~ 724 (12줄 겹침)
mid = shrink(comp[MID0:CUT], K, 160); gr = shrink(comp[GR0:], K, 160)
g = np.array(gr); g[..., 3] = 255   # 땅은 꽉 차게 · 위 세 줄은 바둑 무늬로 엷게 (중경과 땅이 다른 빠르기로 흐를 때 이음매를 숨긴다)
for yy, keep in [(0, 4), (1, 2), (2, 4 / 3)]:
    for xx in range(g.shape[1]):
        if keep >= 4 and (xx + yy) % 4: g[yy, xx, 3] = 0
        elif keep == 2 and (xx + yy) % 2: g[yy, xx, 3] = 0
        elif keep < 2 and (xx + yy) % 4 == 0: g[yy, xx, 3] = 0
gr = Image.fromarray(g, 'RGBA')
lay = keyed(sheet_path('4b92ccaf'))     # 사용자 그림 2: 겹 (먼 언덕 · 뒷산 · 땅 띠 · 앞 풀 · 풍차 날개)
back = shrink(lay[207:428, :1783], K, 96)   # 초록 뒷산
bl = lay[150:560, 1786:2172]; hub = (1979 - 1786, 357 - 150)
blades = []
BSPAN = 52; bk = BSPAN / 369
for i in range(12):   # 날개 다섯 장 → 72°를 12장 (한 바퀴 = 60장 몫)
    im = Image.fromarray(bl, 'RGBA'); big = Image.new('RGBA', (600, 600), (0, 0, 0, 0)); big.alpha_composite(im, (300 - hub[0], 300 - hub[1]))
    rot = big.rotate(-i * 6, resample=Image.BICUBIC, center=(300, 300)).crop((300 - 192, 300 - 192, 300 + 192, 300 + 192))
    blades.append(shrink(np.array(rot), bk))
bw = blades[0].width; bsh = Image.new('RGBA', (bw * 12, bw), (0, 0, 0, 0))
for i, b in enumerate(blades): bsh.alpha_composite(b, (i * bw, 0))
bg = {'k': K,
      'mid': {'url': png_url(mid, 'bg_mid'), 'y': round(Y(MID0), 1)},
      'gr': {'url': png_url(gr, 'bg_gr'), 'y': round(Y(GR0), 1)},
      'back': {'url': png_url(back, 'bg_back'), 'y': round(95 - back.height, 1)},
      'blades': {'url': png_url(bsh, 'bg_blades'), 'w': bw, 'n': 12, 'x': round(1387 * K, 1), 'y': round(Y(188), 1)},
      'skyOy': -58, 'gateY': 150}
D = {'mon': mon, 'war': war, 'ski': ski, 'bg': {'plains': bg}}
js = ('/* 빌드 70 시험: 곡창지대 평원 리마스터 그림 (GPT 그림 판에서 오림) — 손으로 고치지 말 것.\n'
      '   다시 뽑기: tools/saved/gpt70/hd70/export_hd70.py (extract_mon.py · extract_war.py · extract_sk.py 다음에) */\n'
      'const HD70_DATA = ' + json.dumps(D, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(OUT, 'w', encoding='utf-8').write(js)
print('written', OUT, round(len(js) / 1024), 'KB', {k: round(len(json.dumps(v)) / 1024) for k, v in D.items()})
print('bg', {k: (v if not isinstance(v, dict) else {kk: vv for kk, vv in v.items() if kk != 'url'}) for k, v in bg.items()}, 'mid', mid.size, 'gr', gr.size, 'back', back.size)
