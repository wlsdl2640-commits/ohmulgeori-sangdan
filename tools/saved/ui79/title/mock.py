"""첫 화면 시안: 배경(bg_A/B/C) + 제목 글자(logo_A/B/C) + 단추(states) → mock_*.png (폰 412×900 · 2배) — python mock.py"""
import os
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)))
GF = ImageFont.truetype('C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/Galmuri11-Bold.ttf', 22)
W, H = 824, 1800
def fit(im):
    k = max(W / im.width, H / im.height); im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    return im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
def button(kind, state, label, w=520):
    b = Image.open(f'states/{kind}_{state}.png').convert('RGBA'); b = b.crop(b.getbbox()); s = 4; h = b.height * s // 2 * 2
    # 9조각으로 늘리기: 양 끝 14칸은 그대로
    e = 14; L = b.crop((0, 0, e, b.height)); R = b.crop((b.width - e, 0, b.width, b.height)); M = b.crop((e, 0, b.width - e, b.height))
    k = 3; out = Image.new('RGBA', (w, b.height * k)); mid = w - 2 * e * k
    out.alpha_composite(L.resize((e * k, b.height * k), Image.NEAREST), (0, 0)); out.alpha_composite(M.resize((mid, b.height * k), Image.NEAREST), (e * k, 0)); out.alpha_composite(R.resize((e * k, b.height * k), Image.NEAREST), (w - e * k, 0))
    d = ImageDraw.Draw(out); tw = d.textlength(label, font=GF); col = (42, 20, 6) if kind == 'gold' else (246, 224, 176)
    dy = 3 if state == 'pressed' else 0
    d.text(((w - tw) / 2 + 2, out.height / 2 - 13 + dy + 2), label, font=GF, fill=(0, 0, 0, 90)); d.text(((w - tw) / 2, out.height / 2 - 13 + dy), label, font=GF, fill=col if state != 'disabled' else (120, 116, 110))
    return out
for k in 'ABC':
    if not os.path.exists(f'bg_{k}.png'): continue
    for lg in 'ABC':
        im = fit(Image.open(f'bg_{k}.png').convert('RGBA'))
        lo = Image.open(f'logo_{lg}.png').convert('RGBA'); s = min(680 / lo.width, 1.0) * 1.0; lo = lo.resize((round(lo.width * s), round(lo.height * s)), Image.NEAREST)
        im.alpha_composite(lo, ((W - lo.width) // 2, 150))
        y = H - 520
        for i, (kind, st, lb) in enumerate((('gold', 'hover', '게임시작'), ('wood', 'normal', '시스템설정'), ('wood', 'normal', '언어설정'))):
            b = button(kind, st, lb); im.alpha_composite(b, ((W - b.width) // 2, y + i * 140))
        im.convert('RGB').save(f'mock_{k}{lg}.png')
print('ok')
