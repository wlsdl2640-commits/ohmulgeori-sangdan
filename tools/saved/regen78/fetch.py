"""리젠 자리(밀짚더미 · 낡은 축사) · 마법 걸린 밀짚 반지 시안 받기 + 판 — python fetch.py
   자리 그림은 평원 HD 배경(plains_mid · gr) 위에 게임 크기로 놓아 본다. 반지는 크게 + 창고 칸 크기."""
import os, time, urllib.request, urllib.error
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)))
JOBS = {'hay': 'f6b8def3-e946-4d38-bbdb-df3c6913cc6b', 'barn': '11a4e9be-bd0a-4a96-89ec-d8d2f0928380', 'ring': '70adbef4-cc7b-4d85-aedb-a614dcc09b39'}
os.makedirs('raw', exist_ok=True)
for k, j in JOBS.items():
    for i in range(4):
        p = f'raw/{k}{i}.png'
        while not os.path.exists(p):
            try: dat = urllib.request.urlopen(urllib.request.Request(f'https://api.pixellab.ai/mcp/images/{j}/download?index={i}', headers={'User-Agent': 'game-asset-fetch'}), timeout=60).read(); open(p, 'wb').write(dat)
            except urllib.error.HTTPError as e:
                if e.code in (423, 425, 429): time.sleep(20)
                else: raise
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 16)
mid = Image.open('plains_mid.png').convert('RGBA'); gr = Image.open('plains_gr.png').convert('RGBA')
def scene(prop):
    S = Image.new('RGBA', (480, 200), (110, 160, 210, 255)); S.alpha_composite(mid.crop((0, 0, 480, 114)), (0, 30)); S.alpha_composite(gr.crop((0, 0, 480, 178)), (0, 120) if False else (0, 130))
    p = prop.crop(prop.getbbox()); S.alpha_composite(p, (330 - p.width // 2, 150 - p.height)); return S
rows = []
for k, nm in (('hay', '밀짚더미 (첫째 리젠보스 자리)'), ('barn', '낡은 축사 (둘째 리젠보스 자리)')):
    rows.append((nm, [scene(Image.open(f'raw/{k}{i}.png').convert('RGBA')).resize((480, 200)) for i in range(4)]))
W = 4 * 490 + 10; H = 2 * 240 + 280
out = Image.new('RGB', (W, H), (30, 32, 40)); d = ImageDraw.Draw(out); y = 8
for nm, ims in rows:
    d.text((10, y), nm, font=F, fill=(240, 200, 120)); y += 26
    for i, im in enumerate(ims): out.paste(im.convert('RGB'), (10 + i * 490, y)); d.text((16 + i * 490, y + 4), str(i + 1), font=F, fill=(255, 255, 255))
    y += 210
d.text((10, y), '마법 걸린 밀짚 반지 — 크게 · 창고 칸 크기(60px)', font=F, fill=(240, 200, 120)); y += 26
for i in range(4):
    r = Image.open(f'raw/ring{i}.png').convert('RGBA'); x = 10 + i * 490
    d.rectangle([x, y, x + 200, y + 200], fill=(40, 44, 56)); out.paste(r.resize((192, 192), Image.NEAREST), (x + 4, y + 4), r.resize((192, 192), Image.NEAREST))
    d.rectangle([x + 220, y + 60, x + 280, y + 120], fill=(54, 40, 80), outline=(150, 100, 210), width=2); s = r.resize((52, 52), Image.LANCZOS); out.paste(s, (x + 224, y + 64), s)
    d.text((x + 6, y + 4), str(i + 1), font=F, fill=(255, 255, 255))
out.save('regen_drafts.png'); print(out.size)
