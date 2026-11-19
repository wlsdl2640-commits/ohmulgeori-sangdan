"""전사 1차 16장 동작 판 (11-18 22:09 ~ 11-19 사용자 「전부 16장으로 받자 기본배속에서도 잘 보이게 하고 싶어」)
   마젠타 바탕 · 동작마다 8장 판 둘(앞 8장 a · 뒤 8장 b, 앉기는 하나) — sheets/w16_<동작>_<a|b>.webp
   → out_war16/<동작>_<i>.png(판 차례 그대로 16장) + meta.json (화면 픽셀 해상도 hs 2 · 서 있는 키 64)
   · 장 나누기: 판을 여덟 칸으로 보고 덩어리를 칸에 넣는다 — 가장 큰 덩어리의 12%가 안 되는 조각(불꽃 · 먼지 · 충격 표시)은 버린다
   · 마젠타 번짐(보랏빛 가장자리)은 지운다 — 망토의 진홍(색상 337° 위)은 그대로
   · 크기: 모든 판이 같은 배율 (걷기 키 → 64). 판마다 투구 너비가 105 ~ 117칸으로 다르지만 고개 돌린 정도 차이다 — 장화 길이는 판마다 같다(53칸).
     미리보기 때는 투구 너비로 방패 밀기 ×1.05 · 앉기 ×1.10을 했는데, 그러면 서 있는 키가 67(다른 동작 62 ~ 65)로 튀어서 뺐다
   · 세로: 판마다 가장 낮은 발이 땅 (쓰러짐만 장마다 — 무릎 꿇고 엎드리며 판 안에서 내려간다)
   · 가로(판 안 자리는 GPT가 칸 가운데에 맞춰 놓아 장마다 · 판마다 다르다 → 몸의 한 곳을 닻으로):
       head  투구 윤곽 (걷기 · 달리기 — 발은 돌고 머리는 제자리)
       heel  뒷발 뒤꿈치 (서 있기 · 베기 · 올려베기 · 찌르기 · 방패 밀기 · 막기 · 맞음 — 뒷발은 땅에 박혀 있고 몸이 나갔다 돌아온다)
             + 이음 손질: 동작의 첫 장 · 끝 장(서 있는 자세)은 판마다 발 벌린 너비가 조금씩 달라서, 뒤꿈치만 맞추면 서 있기로 돌아올 때 머리가 2 ~ 3칸 튄다.
               두 끝에서 「뒤꿈치 닻 − 투구 닻」 어긋남의 절반씩을 빼고(머리 · 발이 반씩 나눠 갖는다) 그 사이는 재생 차례(seq)대로 고르게 잇는다. 서 있기는 판마다 같은 값
       helm  투구 가운데 (앞모습) · slot 칸 가운데 (앉기 · 눕기)
       쓰러짐: 앞 판은 heel, 뒤 판은 첫 장을 앞 판 끝 장에 맞추고 그대로(엎드리면 장화가 눕는다)
   · 칼날(베기 · 올려베기 · 찌르기): 장마다 칼날 칸(<동작>_b_<i>.png)과 손잡이 끝 · 칼끝 자리(meta bl) — 게임이 스킬 빛(칼날이 달아오름 · 자취)을 칼에 맞춰 그린다
   python3 extract_war16.py [점검판 폴더]"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from seg import HERE
OUT = 'out_war16'; os.makedirs(OUT, exist_ok=True)
CHK = sys.argv[1] if len(sys.argv) > 1 else None
if CHK: os.makedirs(CHK, exist_ok=True)
HEEL_C = 41          # 뒤꿈치 → 닻(두 발 가운데): 서 있을 때 장화 너비의 반 (판 픽셀)
HELM_C = 0.8         # 투구 가운데 → 닻: 서 있기 첫 장에서 뒤꿈치 닻과 같은 자리
R = lambda a, b: list(range(a, b + 1)) if b >= a else list(range(a, b - 1, -1))
MOT = {              # 판 · 가로 닻 · (fix: 장 번호 → 뒤꿈치 자리를 손으로, 칸 가운데에서)
    'walk':   dict(sh='ab', ax='head'),
    'run':    dict(sh='ab', ax='head'),
    'idle':   dict(sh='ab', ax='heel', ping=1),             # 게임이 판마다 갔다 온다 (hd70.js HDW_PING) — 판마다 같은 값으로
    'slash':  dict(sh='ab', ax='heel', fix={0: -31}),   # 첫 장은 걷는 자세 — 뒷발이 들려 있다
    'upper':  dict(sh='ab', ax='heel'),
    'thrust': dict(sh='ab', ax='heel'),
    'bash':   dict(sh='ab', ax='heel'),
    'guard':  dict(sh='ab', ax='heel', seq=R(0, 7) + R(15, 8)),   # 게임 재생 차례: 앞 판 → 뒤 판 거꾸로 (hd70.js HDW_SEQ)
    'hurt':   dict(sh='ab', ax='heel'),
    'death':  dict(sh='ab', ax='heel', rigid_b=1, base='frame'),
    'sit':    dict(sh='a', ax='slot'),
    'sleep':  dict(sh='ab', ax='slot'),
    'front':  dict(sh='ab', ax='helm'),
}
BLADE = {'slash', 'upper', 'thrust'}                # 칼날 칸 · 손잡이 끝 · 칼끝을 함께 뽑는 동작

def hsv(rgb):
    a = rgb.astype(float) / 255; mx = a.max(-1); mn = a.min(-1); d = mx - mn; R, G, B = a[..., 0], a[..., 1], a[..., 2]
    k = d > 1e-6; dd = np.where(k, d, 1)
    h = np.where(mx == R, ((G - B) / dd) % 6, np.where(mx == G, (B - R) / dd + 2, (R - G) / dd + 4)) * 60
    return np.where(k, h, 0), np.where(mx > 0, d / np.where(mx > 0, mx, 1), 0), mx

def load(name, s):
    im = Image.open(os.path.join(HERE, 'sheets', f'w16_{name}_{s}.webp')).convert('RGB')
    if im.width != 2172: im = im.resize((2172, round(im.height * 2172 / im.width)), Image.NEAREST)   # 2170칸으로 온 판 둘
    rgb = np.array(im).astype(int); R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    bg = ((R > 150) & (B > 150) & (G < 120) & (abs(R - B) < 110)) | ((R - G > 55) & (B - G > 55))
    h, s2, v = hsv(rgb); fr = (~bg) & (h >= 265) & (h < 330) & (s2 > 0.3) & (v > 0.15)   # 마젠타 번짐
    bg |= fr & (v >= 0.45)                       # 밝은 번짐(분홍 테)은 바탕으로
    dk = fr & (v < 0.45); g = rgb[dk].min(axis=1)  # 어두운 번짐(테두리 선에 섞인 보라)은 보랏빛만 뺀다
    rgb[dk] = np.stack([g + 6, g, g + 4], axis=1)
    return rgb, ~bg

def frames(rgb, fg):
    lab, n = ndimage.label(fg); W = rgb.shape[1]; sl = ndimage.find_objects(lab); sz = ndimage.sum(fg, lab, range(1, n + 1))
    slot = [[] for _ in range(8)]
    for i in range(n): slot[min(7, int((sl[i][1].start + sl[i][1].stop) / 2 * 8 / W))].append(i)
    out = []
    for j in range(8):
        big = max(slot[j], key=lambda i: sz[i]); m = np.zeros_like(fg)
        for i in slot[j]:
            if i == big or sz[i] > 0.12 * sz[big]: m |= lab == i + 1
        out.append((m, (j + .5) * W / 8))
    return out

def helm_box(m):
    top = np.where(m.any(1))[0].min(); xs = np.where(m[top:top + 60].any(0))[0]; return xs.min(), xs.max()

def heel_x(rgb, m, base, band=22, foot=7, loose=False):
    h, s, v = hsv(rgb); bm = m & (h >= 8) & (h <= 34) & (s > 0.42) & (v > 0.2) & (v < 0.74)   # 갈색 장화
    cols = bm[base - band:base + 1].any(0); touch = bm[base - foot:base + 1].any(0); xs = np.where(cols)[0]
    if not len(xs): return None
    runs = []; s0 = p = xs[0]
    for x in xs[1:]:
        if x > p + 5: runs.append((s0, p)); s0 = x
        p = x
    runs.append((s0, p))
    runs = [r for r in runs if r[1] - r[0] >= 14 and (loose or touch[r[0]:r[1] + 1].sum() >= 8)]   # 땅에 닿은 장화만
    return runs[0][0] if runs else None

def blade_of(rgb, m):   # 칼날: 밝고 채도 낮은(쇠) 길쭉한 덩어리 — 투구 챙(투구 칸 안 · 거의 가로)은 뺀다
    h, s, v = hsv(rgb); lab, n = ndimage.label(m & (s < 0.16) & (v > 0.5)); out = None; best = 0
    top = np.where(m.any(1))[0].min(); hx = np.where(m[top:top + 60].any(0))[0]; hx0, hx1, hy1 = hx.min(), hx.max(), top + 78
    for i in range(1, n + 1):
        c = lab == i; a = c.sum()
        if a < 250: continue
        ys, xs = np.where(c); pts = np.stack([xs, ys], 1).astype(float); mu = pts.mean(0); ev, evec = np.linalg.eigh(np.cov((pts - mu).T))
        L, Wd = 4 * np.sqrt(ev[1]), 4 * np.sqrt(ev[0]); ang = abs(np.degrees(np.arctan2(evec[1, 1], evec[0, 1]))); ang = min(ang, 180 - ang)
        if hx0 < mu[0] < hx1 and mu[1] < hy1 and ang < 20: continue
        if L / Wd > 3.2 and L > 55 and a > best: best = a; out = c
    return out
def blade_ends(rgb, m, b):   # (손잡이 끝, 칼끝): 금빛 코등이가 가깝고 몸 가운데에 가까운 끝이 손잡이
    ys, xs = np.where(b); pts = np.stack([xs, ys], 1).astype(float); mu = pts.mean(0); ev, evec = np.linalg.eigh(np.cov((pts - mu).T)); ax = evec[:, 1]
    pr = (pts - mu) @ ax; A, B = mu + ax * pr.min(), mu + ax * pr.max()
    h, s, v = hsv(rgb); gy, gx = np.where(m & (h >= 18) & (h <= 48) & (s > 0.5) & (v > 0.55)); G = np.stack([gx, gy], 1).astype(float)
    by, bx = np.where(m); C = np.array([bx.mean(), by.mean()])
    sc = lambda P: (((G - P) ** 2).sum(1) < 18 ** 2).sum() - 0.5 * np.hypot(*(P - C))
    return (A, B) if sc(A) > sc(B) else (B, A)

def prof(m):
    xs = np.where(m.any(axis=0))[0]; return m[:, xs.min():xs.max() + 1].sum(axis=0).astype(float), xs.min()
def best(pr, pf, rng=60):
    b, bo = -1, 0
    for o in range(-rng, rng + 1):
        a0, b0 = max(0, o), min(len(pr), o + len(pf))
        if b0 <= a0: continue
        v = np.minimum(pr[a0:b0], pf[a0 - o:b0 - o]).sum()
        if v > b: b, bo = v, o
    return bo

# ── 1. 장 나누기 · 닻
DATA = {}; REF = None
for name, M in MOT.items():
    F = []
    for s in M['sh']:
        rgb, fg = load(name, s); fr = frames(rgb, fg)
        sb = max(np.where(m.any(1))[0].max() for m, c in fr)
        for m, c in fr: F.append(dict(rgb=rgb, m=m, c=c, sheet=s, bot=int(np.where(m.any(1))[0].max()), top=int(np.where(m.any(1))[0].min()), sb=int(sb)))
    for f in F: f['base'] = f['bot'] if M.get('base') == 'frame' else f['sb']
    hw = [helm_box(f['m']) for f in F]; hws = [b - a + 1 for a, b in hw]; hs = [f['bot'] - f['top'] + 1 for f in F]
    if name == 'walk': REF = (float(np.median(hws)), float(np.median(hs)))
    fit = 1   # 판마다 같은 배율 (머리 설명)
    ax = M['ax']
    if ax == 'head':
        HH = int((F[0]['bot'] - F[0]['top']) * 0.33); ref = None
        for f in F:
            pf, x0 = prof(f['m'][f['top']:f['top'] + HH])
            if ref is None: ref = (pf, x0); a, b = helm_box(f['m']); a0 = (a + b) / 2; f['ax'] = a0
            else: f['ax'] = a0 - (ref[1] + best(ref[0], pf) - x0)
    elif ax == 'helm':
        for f, (a, b) in zip(F, hw): f['ax'] = (a + b) / 2
    elif ax == 'slot':
        for f in F: f['ax'] = f['c']
    else:
        for i, f in enumerate(F):
            if M.get('rigid_b') and f['sheet'] == 'b' and i > 8: f['ax'] = f['c'] + (F[8]['ax'] - F[8]['c']); continue   # 뒤 판은 첫 장의 뒤꿈치로 닻을 잡고, 나머지는 판 안 자리 그대로
            fx = M.get('fix', {}).get(i)
            hx = f['c'] + fx if fx is not None else heel_x(f['rgb'], f['m'], f['bot'])
            assert hx is not None, (name, i)
            f['heel'] = hx; f['ax'] = hx + HEEL_C
        # 이음 손질 (머리 설명)
        D = [f['ax'] - ((a + b) / 2 + HELM_C) if 'heel' in f else None for f, (a, b) in zip(F, hw)]
        if M.get('ping'):
            for f in F: f['ax'] -= (D[8] - D[0]) / 2 if f['sheet'] == 'b' else 0
        elif M.get('rigid_b'):
            for f in F[:9]: f['ax'] -= D[0] / 2
            for f in F[9:]: f['ax'] = f['c'] + (F[8]['ax'] - F[8]['c'])
        else:
            seq = M.get('seq') or list(range(len(F))); c0, c1 = D[seq[0]] / 2, D[seq[-1]] / 2
            for p, i in enumerate(seq): F[i]['ax'] -= c0 + (c1 - c0) * p / (len(seq) - 1)
    if name in BLADE:
        for i, f in enumerate(F): f['bm'] = blade_of(f['rgb'], f['m']); assert f['bm'] is not None, (name, i); f['be'] = blade_ends(f['rgb'], f['m'], f['bm'])
    DATA[name] = (F, fit)
    print('%-6s %2d장  투구 %3d~%3d  키 %3d~%3d  배율 %.3f  닻(칸 가운데에서) %s' % (name, len(F), min(hws), max(hws), min(hs), max(hs), fit, ' '.join('%+d' % round(f['ax'] - f['c']) for f in F)))
K = 64 / REF[1]

# ── 2. 같은 크기 칸에 놓고 줄이기 (한 동작의 장은 닻 · 땅 줄이 같은 자리)
meta = {}; outs = []
for name, (F, fit) in DATA.items():
    k = K * fit
    for f in F:
        ys, xs = np.where(f['m']); f['ys'], f['xs'] = ys, xs; f['ox'] = xs - int(round(f['ax'])); f['oy'] = ys - f['base']
    X0 = min(f['ox'].min() for f in F); X1 = max(f['ox'].max() for f in F); Y0 = min(f['oy'].min() for f in F); Y1 = max(f['oy'].max() for f in F)
    W, H = int(np.ceil((X1 - X0 + 1) * k)) + 2, int(np.ceil((Y1 - Y0 + 1) * k)) + 2; ax, ay = int(round(-X0 * k)) + 1, int(round(-Y0 * k)) + 1
    for i, f in enumerate(F):
        big = np.zeros((Y1 - Y0 + 1, X1 - X0 + 1, 4), np.float32)
        big[f['oy'] - Y0, f['ox'] - X0, :3] = f['rgb'][f['ys'], f['xs']]; big[f['oy'] - Y0, f['ox'] - X0, 3] = 255
        tw, th = int(round(big.shape[1] * k)), int(round(big.shape[0] * k))
        rs = lambda ch: np.array(Image.fromarray(ch, 'F').resize((tw, th), Image.BOX))
        Al = rs(big[..., 3]); C = np.dstack([rs(big[..., c] * big[..., 3] / 255) for c in range(3)]) * 255 / np.maximum(Al[..., None], 1)
        o = np.zeros((H, W, 4), np.uint8); hh, ww = min(H - 1, th), min(W - 1, tw)
        o[1:1 + hh, 1:1 + ww, :3] = np.clip(C[:hh, :ww], 0, 255); o[1:1 + hh, 1:1 + ww, 3] = (Al[:hh, :ww] > 120) * 255
        outs.append((name, i, o))
        if 'bm' in f:   # 칼날 칸: 같은 자리 · 같은 배율로 (덮인 몫이 35% 넘는 칸)
            bb = np.zeros(big.shape[:2], np.float32); by, bx = np.where(f['bm']); bb[by - f['base'] - Y0, bx - int(round(f['ax'])) - X0] = 255
            ba = np.zeros((H, W), np.uint8); ba[1:1 + hh, 1:1 + ww] = (rs(bb)[:hh, :ww] > 90) * 255
            Image.fromarray(np.dstack([np.full((H, W, 3), 255, np.uint8), ba]), 'RGBA').save(f'{OUT}/{name}_b_{i}.png')
    meta[name] = {'hs': 2, 'w': W, 'h': H, 'ax': ax, 'ay': ay, 'n': len(F)}
    if name in BLADE: meta[name]['bl'] = [[round(float(v), 1) for P in f['be'] for v in ((P[0] - int(round(f['ax']))) * k, (P[1] - f['base']) * k)] for f in F]   # 닻에서: 손잡이 끝 x, y · 칼끝 x, y (그림 칸 · 위가 −)
    print('%-6s 칸 %3d×%3d  닻 %3d,%3d  k %.4f' % (name, W, H, ax, ay, k))

# ── 3. 색: 모든 동작이 한 팔레트 (동작이 바뀌어도 색이 튀지 않게)
stack = np.concatenate([o[..., :3][o[..., 3] > 0] for _, _, o in outs])
pal = Image.fromarray(stack.reshape(-1, 1, 3)).quantize(colors=224, method=Image.Quantize.MEDIANCUT)
for name, i, o in outs:
    im = np.array(Image.fromarray(o[..., :3]).quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB'))
    Image.fromarray(np.dstack([im, o[..., 3]]).astype(np.uint8), 'RGBA').save(f'{OUT}/{name}_{i}.png')
json.dump(meta, open(f'{OUT}/meta.json', 'w'))

# ── 4. 점검판: 동작마다 16장 3배 · 닻 줄(하늘색) · 땅 줄(노랑)
if CHK:
    for name, m in meta.items():
        Z = 3; W, H = m['w'], m['h']; n = m['n']; S = Image.new('RGBA', (8 * W * Z, ((n + 7) // 8) * (H * Z + 12)), (96, 150, 84, 255)); d = ImageDraw.Draw(S)
        for i in range(n):
            x, y = (i % 8) * W * Z, (i // 8) * (H * Z + 12)
            S.alpha_composite(Image.open(f'{OUT}/{name}_{i}.png').resize((W * Z, H * Z), Image.NEAREST), (x, y + 12))
            d.line([(x + m['ax'] * Z, y + 12), (x + m['ax'] * Z, y + 12 + H * Z)], fill=(0, 255, 255, 120)); d.line([(x, y + 12 + m['ay'] * Z), (x + W * Z, y + 12 + m['ay'] * Z)], fill=(255, 255, 0, 120))
            d.text((x + 3, y), str(i), fill=(255, 255, 255, 255))
        S.convert('RGB').save(f'{CHK}/w16_{name}.png')
