"""강화 주문서 25장 (갈래 다섯 × 확률 다섯): 문양 넣기(픽셀랩 inpaint) 결과를 받아 cat/<갈래>_<확률>.png로 모으고 판을 그린다.
   python cat25.py <판.png>   — 부장비(방패)는 바탕 그림 그대로 (raw/e_*.png)"""
import os, sys, urllib.request
from PIL import Image, ImageDraw, ImageFont
BASE = {100: 'e_100_0', 80: 'e_80_0', 60: 'e_60_0', 30: 'e_30b_0', 10: 'e_10_0'}   # 대표님 고름: 30%는 가(갈라짐 줄인 것)
JOBS = {   # 픽셀랩 inpaint 작업 번호
    'weapon_100': '50ef8d4e-3603-40da-9fdc-abe56ef365b7', 'armor_100': 'd2f4c65b-6557-4df7-b0b8-d26b28d813dd', 'acc_100': '40d6b459-38dd-4379-a751-4724a28ee5dc', 'bag_100': '4ab0e8ef-6f56-43f0-a31a-773670614ce5',
    'weapon_80': '0aa39594-111b-41ab-9ca1-83fe2f9187fc', 'armor_80': '040e55d3-631a-4f68-a7c5-c26f7e692ecc', 'acc_80': '7907d298-f822-49a9-8867-e88ccb596b6c', 'bag_80': 'f69b9b22-4b44-4851-a494-33e432b18d6d',
    'weapon_60': 'd9fb8144-78eb-4ffd-9009-f9d7533a84a3', 'armor_60': '352db6cb-3875-4f6d-87d8-c504eca28ade', 'acc_60': '5b251692-63eb-40b8-9d33-5a8f2dc59ec9', 'bag_60': '399be7fe-a7d0-424b-83a3-905097811805',
    'weapon_30': '375ca14a-d334-4a3c-9387-a2b9e147699d', 'armor_30': 'e1d64efc-2be5-4767-97b6-d5ea9e12da74', 'acc_30': 'e5158913-73a0-4634-a92d-f799273e6033', 'bag_30': '3967720b-5f85-4cbd-9e9c-ca340921ecba',
    'weapon_10': '4ce575ac-3eea-4e4d-9e92-f687b25f8275', 'armor_10': '6c7dab1f-fcdc-43a6-8974-d80ef31396bb', 'acc_10': '67a695f4-d9a9-4520-afad-9f4b7b253768', 'bag_10': '988bc7e4-0429-4cdb-acf3-2f9532d110e9',
}
CATS = [('weapon', '주무기'), ('off', '부장비'), ('armor', '방어구'), ('acc', '장신구'), ('bag', '가방')]
RATES = [100, 80, 60, 30, 10]
os.makedirs('cat', exist_ok=True)
for k, j in JOBS.items():
    p = f'cat/{k}.png'
    if not os.path.exists(p):
        d = urllib.request.urlopen(urllib.request.Request(f'https://api.pixellab.ai/mcp/images/{j}/download', headers={'User-Agent': 'game-asset-fetch'}), timeout=60).read()
        open(p, 'wb').write(d)
for r in RATES: Image.open(f'raw/{BASE[r]}.png').save(f'cat/off_{r}.png')

FD = 'C:/Windows/Fonts/'
f12 = ImageFont.truetype(FD + 'malgun.ttf', 12); f14 = ImageFont.truetype(FD + 'malgunbd.ttf', 14); f18 = ImageFont.truetype(FD + 'malgunbd.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
RQ = {100: ((26, 32, 48), (70, 78, 96)), 80: ((38, 60, 34), (74, 138, 62)), 60: ((30, 56, 88), (60, 118, 184)), 30: ((64, 36, 90), (147, 86, 204)), 10: ((87, 64, 18), (224, 160, 50))}
cw = 220; W = 110 + 5 * cw; H = 90 + 5 * 150
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((20, 12), '강화 주문서 25장 — 갈래 다섯 × 확률 다섯 (픽셀랩)', font=f18, fill=GOLD)
d.text((20, 40), '확률이 낮을수록 낡은 양피지: 100% 새것 · 80% 깨끗 · 60% 바랜 색 · 30% 낡음 · 10% 이끼 덮인 고대 유물.  큰 그림 = 128px 원본, 작은 칸 = 게임 창고 칸 72px', font=f12, fill=INK2)
for i, r in enumerate(RATES): d.text((110 + i * cw + 60, 66), f'{r}%', font=f14, fill=GOLD)
for ci, (c, cn) in enumerate(CATS):
    y = 90 + ci * 150; d.text((20, y + 60), cn, font=f14, fill=INK)
    for i, r in enumerate(RATES):
        src = Image.open(f'cat/{c}_{r}.png').convert('RGBA'); x = 110 + i * cw
        d.rectangle([x, y, x + 129, y + 129], fill=(40, 44, 56)); im.alpha_composite(src, (x + 1, y + 1))
        inner, border = RQ[r]; d.rectangle([x + 134, y + 54, x + 209, y + 129], fill=inner, outline=border, width=2)
        im.alpha_composite(src.resize((72, 72), Image.LANCZOS), (x + 136, y + 56))
im.save(sys.argv[1]); print(im.size)
