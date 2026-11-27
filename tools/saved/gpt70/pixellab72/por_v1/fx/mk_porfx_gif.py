# 짐꾼 1차 공격 효과(고른 1 · 2 · 2) 움직이는 GIF — 늪 장면 · 짐꾼 동작에 맞춰.  python mk_porfx_gif.py <출력 폴더>
# 11-28 대표님 「행동 프레임과 어색하게 이어지는 것 · 볼트 크기」 고침:
#   · 효과는 짐꾼이 실제로 쏘고 · 던지고 · 쏟는 장에서 시작한다 — 석궁 10장째(석궁 끝에서) · 짐 던지기 14장째(손을 떠난 다음 장) · 짐 사태 7장째(등짐을 쏟는 장)
#   · 볼트: 시안 그림은 꼬리 빛 + 볼트 + 맞은 불꽃이 한 장에 길게 그려져 있어 그대로 쓰면 짐꾼보다 큰 볼트가 된다
#     → 볼트 · 꼬리 빛 · 맞은 자리를 잘라 나눠, 날아가는 동안은 석궁에 맞는 작은 볼트(길이 22칸)만, 맞으면 불꽃 · 흙먼지(사라짐 장도 같은 자리만)
#   · 짐: 날아가는 동안은 작게(×0.45) 포물선, 맞으면 원래 크기 → 사라짐 장
import os, sys, numpy as np
from PIL import Image, ImageDraw, ImageFont
import mk_porfx as P
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 14)
PX0, PY0 = P.FX - 60, P.GY - 116          # 짐꾼 그림 놓는 자리 (120칸 판의 0,0)
IDLE_D = os.path.join(P.H, '..', 'anim', 'idle'); IDLE_D = os.path.join(IDLE_D, sorted(os.listdir(IDLE_D))[0])
IDLE = [Image.open(os.path.join(IDLE_D, f)).convert('RGBA') for f in sorted(os.listdir(IDLE_D)) if f.endswith('.png')]
def frames(d): d = os.path.join(P.H, '..', 'anim', d); return [Image.open(os.path.join(d, f)).convert('RGBA') for f in sorted(os.listdir(d)) if f.endswith('.png')]
def outs(fk):
    return [Image.open(f'anim/{fk}_out/{f}').convert('RGBA') for f in sorted(os.listdir(f'anim/{fk}_out'))][1:]
def lum(im):
    a = np.asarray(im).astype(float); m = a[..., 3] > 40; return a[..., :3][m].mean() if m.sum() > 20 else 0
def fade(im, t): a = np.array(im); a[..., 3] = (a[..., 3] * t).astype(np.uint8); return Image.fromarray(a)
def sc(im, k): return im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.NEAREST)
def tail_of(peak, seq):   # 사라짐 장: 검게 변하거나 거의 빈 장부터 버리고, 마지막 밝은 장을 옅게
    L0 = lum(peak); cut = next((i for i, e in enumerate(seq) if lum(e) < 0.6 * L0 or (np.asarray(e)[..., 3] > 0).sum() < 30), len(seq)); seq = seq[:cut]
    last = seq[-1] if seq else peak; return seq + [fade(last, 1 - (j + 1) / 9) for j in range(8)]
def put(t, im, cx, cy, mode='c'):
    b = im.getbbox()
    if not b: return
    x = int(cx - (b[0] + b[2]) / 2); y = int(cy - (b[1] + b[3]) / 2) if mode == 'c' else int(cy - b[3]); t.alpha_composite(im, (x, y))

def plan_bolt():
    pk = Image.open('bolt_1/00.png').convert('RGBA')
    bolt = sc(pk.crop((127, 62, 223, 84)), 22 / 96)          # 볼트만 → 길이 22칸
    trail = sc(pk.crop((8, 62, 124, 84)), 0.22)               # 꼬리 빛 (볼트 뒤에 따라옴)
    IMP = (186, 30, 256, 110); K = 0.55                       # 맞은 자리: 불꽃 · 나무 조각 · 흙먼지
    imp = [sc(pk.crop(IMP), K)] * 2 + [sc(e.crop(IMP), K) for e in tail_of(pk, outs('bolt_1'))]
    x0, y0 = PX0 + 116, PY0 + 54; x1, y1 = 246, y0 + 2       # 석궁 끝 → 몬스터 앞
    ev = {}; n = 4
    for j in range(n):
        q = (j + 1) / n; x = x0 + (x1 - x0) * q; L = []
        L.append((trail, x - bolt.width // 2 - trail.width // 2 + 2, y0, 'c')); L.append((bolt, x, y0, 'c')); ev[10 + j] = L
    for j, im in enumerate(imp): ev.setdefault(10 + n + j, []).append((im, x1 + 10, y1, 'c'))
    return 'shoot/v4', ev
def plan_junk():
    pk = P.fit(Image.open('junk_2/00.png').convert('RGBA'), 70, 150); seq = [P.fit(e, 70, 150) for e in tail_of(pk, outs('junk_2'))]
    small = sc(pk, 0.45); x0, y0 = PX0 + 118, PY0 + 55; x1, y1 = 236, P.GY - 50; n = 5; ev = {}
    for j in range(n):
        q = (j + 1) / n; ev[14 + j] = [(small, x0 + (x1 - x0) * q, y0 + (y1 - y0) * q - 34 * 4 * q * (1 - q), 'c')]
    for j, im in enumerate([pk] * 2 + seq): ev.setdefault(14 + n + j, []).append((im, x1, y1, 'c'))
    return 'throw/v4', ev
def plan_aval():
    pk = P.fit(Image.open('aval_2/anim_src.png').convert('RGBA'), 110, 200); seq = [P.fit(e, 110, 200) for e in tail_of(pk, outs('aval_2'))]
    b = pk.getbbox(); cx = (b[0] + b[2]) / 2; by = b[3]; grow = []
    for i in range(5):   # 적 자리 바닥에서 쏟아지며 커진다
        t = (i + 1) / 6; s = 0.3 + 0.7 * t; r = sc(pk, s); c = Image.new('RGBA', pk.size); c.alpha_composite(fade(r, 0.4 + 0.6 * t), (round(cx - cx * s), round(by - by * s))); grow.append(c)
    ev = {}
    for j, im in enumerate(grow + [pk] * 2 + seq): ev[7 + j] = [(im, 262, P.GY + 4, 'b')]
    return 'avalanche2/v1', ev

for k, nm, plan in (('bolt', '석궁 쏘기 ①', plan_bolt), ('junk', '짐 던지기 ②', plan_junk), ('aval', '짐 사태 ②', plan_aval)):
    mv, ev = plan(); mf = frames(mv); T = max(len(mf), max(ev) + 1) + 6; out = []
    for i in range(T):
        t = P.m.tile(); p = mf[i] if i < len(mf) else IDLE[(i - len(mf)) % len(IDLE)]
        t.alpha_composite(p, (PX0, PY0))
        for im, x, y, mode in ev.get(i, []): put(t, im, x, y, mode)
        ImageDraw.Draw(t).text((6, 4), nm, font=F, fill=(255, 230, 150)); out.append(t.convert('RGB').resize((t.width * 2, t.height * 2), Image.NEAREST))
    out[0].save(f'{OUT}/{k}.gif', save_all=True, append_images=out[1:], duration=70, loop=0, optimize=True); print(k, len(out), os.path.getsize(f'{OUT}/{k}.gif') // 1024, 'KB')
