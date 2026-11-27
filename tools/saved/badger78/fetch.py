"""둑굴 오소리 시안(픽셀랩 create_image_pro_from_style, 멧돼지 · 수달 그림체 참고) 받기 + 판 — python fetch.py"""
import os, time, urllib.request, urllib.error
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)))
JOBS = {'a': '6301ac35-e911-4cd5-86d1-e21ba6e9dadc', 'b': 'b5379764-57b8-4f22-9c5e-f9244159a684'}
os.makedirs('raw', exist_ok=True)
for k, j in JOBS.items():
    for i in range(4):
        p = f'raw/{k}{i}.png'
        while not os.path.exists(p):
            try:
                d = urllib.request.urlopen(urllib.request.Request(f'https://api.pixellab.ai/mcp/images/{j}/download?index={i}', headers={'User-Agent': 'game-asset-fetch'}), timeout=60).read()
                open(p, 'wb').write(d)
            except urllib.error.HTTPError as e:
                if e.code in (423, 425, 429): time.sleep(20)
                else: raise
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 16)
ims = [(f'{k}{i}', Image.open(f'raw/{k}{i}.png').convert('RGBA')) for k in JOBS for i in range(4)]
boar = Image.open('../anim77/first/boar.png').convert('RGBA')
S = 2; cw = 140 * S + 16
W = 4 * cw + 16; H = 2 * (140 * S + 40) + 140 * S + 60
im = Image.new('RGB', (W, H), (40, 44, 56)); d = ImageDraw.Draw(im)
for n, (lab, a) in enumerate(ims):
    x = 8 + (n % 4) * cw; y = 8 + (n // 4) * (140 * S + 40)
    im.paste(a.resize((140 * S, 140 * S), Image.NEAREST), (x, y + 24), a.resize((140 * S, 140 * S), Image.NEAREST))
    d.text((x + 4, y), f'{n + 1}', font=F, fill=(240, 180, 60))
y = 8 + 2 * (140 * S + 40); d.text((8, y), '게임 크기 비교: 멧돼지 · 후보 1~8 (원래 크기)', font=F, fill=(236, 228, 208))
x = 8
for a in [boar] + [b for _, b in ims]:
    bb = a.getbbox(); c = a.crop(bb); im.paste(c, (x, y + 30 + 120 - c.height), c); x += c.width + 10
im.save('badger_drafts.png'); print(im.size)
