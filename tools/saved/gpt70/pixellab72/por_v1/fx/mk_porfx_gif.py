# 짐꾼 1차 공격 효과(고른 1 · 2 · 2) 움직이는 GIF — 늪 장면 · 짐꾼 동작 · 맞히는 장에 효과(제자리에서 커짐 → 픽셀랩 사라짐 장).  python mk_porfx_gif.py <출력 폴더>
import os, sys, numpy as np
from PIL import Image, ImageDraw, ImageFont
import mk_porfx as P
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 14)
PICK = {'bolt': ('bolt_1', '석궁 쏘기 ①'), 'junk': ('junk_2', '짐 던지기 ②'), 'aval': ('aval_2', '짐 사태 ②')}
IDLE_D = os.path.join(P.H, '..', 'anim', 'idle'); IDLE_D = os.path.join(IDLE_D, sorted(os.listdir(IDLE_D))[0])
IDLE = [Image.open(os.path.join(IDLE_D, f)).convert('RGBA') for f in sorted(os.listdir(IDLE_D)) if f.endswith('.png')]
def lum(im):
    a = np.asarray(im).astype(float); m = a[..., 3] > 40; return a[..., :3][m].mean() if m.sum() > 20 else 0
def fade(im, t): a = np.array(im); a[..., 3] = (a[..., 3] * t).astype(np.uint8); return Image.fromarray(a)
for k, (fk, nm) in PICK.items():
    ko, mv, fi, mode, ax, ay, mh, mw, _ = P.S[k]
    peak = Image.open(f'{fk}/00.png').convert('RGBA')
    if fk == 'aval_2': peak = Image.open(f'{fk}/anim_src.png').convert('RGBA')
    outs = [Image.open(f'anim/{fk}_out/{f}').convert('RGBA') for f in sorted(os.listdir(f'anim/{fk}_out'))][1:]
    L0 = lum(peak); cut = next((i for i, e in enumerate(outs) if lum(e) < 0.6 * L0 or (np.asarray(e)[..., 3] > 0).sum() < 30), len(outs)); outs = outs[:cut]
    last = outs[-1] if outs else peak; outs += [fade(last, 1 - (j + 1) / 9) for j in range(8)]
    b = peak.getbbox(); cx = (b[0] + b[2]) / 2; by = (b[1] + b[3]) / 2 if mode == 'c' else b[3]
    grow = []
    for i in range(5):
        t = (i + 1) / 6; sc = 0.3 + 0.7 * t; r = peak.resize((max(1, round(peak.width * sc)), max(1, round(peak.height * sc))), Image.NEAREST)
        c = Image.new('RGBA', peak.size); c.alpha_composite(fade(r, 0.4 + 0.6 * t), (round(cx - cx * sc), round(by - by * sc))); grow.append(c)
    FLY = k in ('bolt', 'junk')   # 날아가는 것: 커지지 않고 손에서 맞는 자리로 미끄러져 온다(짐은 포물선)
    if FLY: grow = [peak] * 5
    eff = [P.fit(e, mh, mw) for e in grow + [peak] * 2 + outs]
    e0 = eff[5]; bb = e0.getbbox(); ox = ax - (bb[0] + bb[2]) // 2; oy = ay - (bb[1] + bb[3]) // 2 if mode == 'c' else ay - bb[3]
    md = os.path.join(P.H, '..', 'anim', mv); mf = [Image.open(os.path.join(md, f)).convert('RGBA') for f in sorted(os.listdir(md)) if f.endswith('.png')]
    st = max(0, fi - 4); T = max(len(mf), st + len(eff)) + 6; frames = []
    for i in range(T):
        t = P.m.tile(); p = mf[i] if i < len(mf) else IDLE[(i - len(mf)) % len(IDLE)]
        t.alpha_composite(p, (P.FX - 60, P.GY - 116))
        if 0 <= i - st < len(eff):
            j = i - st; e = eff[j]; dx = dy = 0
            if FLY and j < 5: q = (j + 1) / 6; dx = -int((1 - q) * (ox + bb[0] - (P.FX + 10))); dy = -int(30 * 4 * q * (1 - q)) if k == 'junk' else 0
            t.alpha_composite(e, (ox + dx, oy + dy))
        ImageDraw.Draw(t).text((6, 4), nm, font=F, fill=(255, 230, 150)); frames.append(t.convert('RGB').resize((t.width * 2, t.height * 2), Image.NEAREST))
    frames[0].save(f'{OUT}/{k}.gif', save_all=True, append_images=frames[1:], duration=70, loop=0, optimize=True); print(k, len(frames), os.path.getsize(f'{OUT}/{k}.gif') // 1024, 'KB')
