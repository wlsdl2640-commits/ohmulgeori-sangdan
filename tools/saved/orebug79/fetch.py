"""광맥 콩벌레 시안(픽셀랩 create_image_pro_from_style, 멧돼지 · 납작벌레 · 쐐기벌레 그림체 참고) 받기 + 판 — python fetch.py"""
import os, time, urllib.request, urllib.error
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)))
JOBS = {'a': '2581a1cc-7cfa-43af-89d8-b0fe621cf50e', 'b': 'd32c5acc-02b4-4b32-8727-b94b628ec2e8'}
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
ref = [Image.open(f'../anim77/first/{n}.png').convert('RGBA') for n in ('boar', 'badger')]
S = 2; cw = 140 * S + 16
W = 4 * cw + 16; H = 2 * (140 * S + 40) + 200
im = Image.new('RGB', (W, H), (40, 44, 56)); d = ImageDraw.Draw(im)
for n, (lab, a) in enumerate(ims):
    x = 8 + (n % 4) * cw; y = 8 + (n // 4) * (140 * S + 40)
    b = a.resize((140 * S, 140 * S), Image.NEAREST); im.paste(b, (x, y + 24), b)
    d.text((x + 4, y), f'{n + 1}', font=F, fill=(240, 180, 60))
y = 8 + 2 * (140 * S + 40); d.text((8, y), '게임 크기 비교 (원래 크기): 멧돼지 · 오소리 · 후보 1~8', font=F, fill=(236, 228, 208))
x = 8
for a in ref + [b for _, b in ims]:
    bb = a.getbbox(); c = a.crop(bb); im.paste(c, (x, y + 30 + 150 - c.height), c); x += c.width + 10
im.save('orebug_drafts.png'); print('ok', im.size)
