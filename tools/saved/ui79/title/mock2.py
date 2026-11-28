"""첫 화면 시안 2 (밝은 미궁 대문 B1 · B2 · B3): 단추는 아래쪽에 큰 단추 하나 + 작은 단추 둘 — python mock2.py"""
import os
from PIL import Image, ImageDraw
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import mock as M
W, H = 824, 1800
for k in ('B1', 'B2', 'B3'):
    im = Image.open(f'px2_{k}.png').convert('RGBA').resize((W, H), Image.NEAREST)
    lo = Image.open('logo_A.png').convert('RGBA'); im.alpha_composite(lo, ((W - lo.width) // 2, 110))
    g = M.button('gold', 'hover', '게임시작', 560); im.alpha_composite(g, ((W - g.width) // 2, H - 300))
    a = M.button('wood', 'normal', '시스템설정', 270); b = M.button('wood', 'normal', '언어설정', 270)
    im.alpha_composite(a, (W // 2 - 280, H - 170)); im.alpha_composite(b, (W // 2 + 10, H - 170))
    im.convert('RGB').save(f'pxmock2_{k}.png')
S = Image.new('RGB', (3 * (412 + 16) + 16, 900 + 60), (30, 32, 40)); d = ImageDraw.Draw(S)
for i, k in enumerate(('B1', 'B2', 'B3')):
    S.paste(Image.open(f'pxmock2_{k}.png').resize((412, 900), Image.NEAREST), (16 + i * 428, 50)); d.text((16 + i * 428, 12), k, font=M.GF, fill=(240, 200, 120))
S.save('title_mocks_px2.png'); print('ok')
