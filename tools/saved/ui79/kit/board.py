"""UI 키트 시안 A · B · C 판 — 키트 그림 + 같은 장소 그림(대장간) 위에 놓았을 때 — python board.py"""
import os
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)))
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 20); f2 = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 20)
bg = Image.open('C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/ui79/places/04.png').convert('RGBA')
bg = bg.crop((0, 0, bg.width, bg.height)).resize((bg.width // 2 * 1, bg.height // 2 * 1), Image.LANCZOS)
K = [('A', '따뜻한 나무 + 금 모서리 + 진홍 리본', '장소 그림과 가장 가까움'), ('B', '양피지 문서 + 나무판 + 밀랍 도장', '첫 화면 신청서의 결'), ('C', '어두운 돌 + 금빛 룬 테 + 보석', '지금 창을 다듬은 방향')]
W = 3 * (bg.width + 30) + 30; H = 120 + 800 + 40 + bg.height + 40
S = Image.new('RGBA', (W, H), (34, 36, 46, 255)); d = ImageDraw.Draw(S)
for i, (k, t, s) in enumerate(K):
    x = 30 + i * (bg.width + 30); im = Image.open(f'{k}.png').convert('RGBA')
    d.text((x, 20), f'{k}. {t}', font=F, fill=(240, 200, 120)); d.text((x, 60), s, font=f2, fill=(200, 200, 210))
    big = im.resize((int(im.width * 1.4), int(im.height * 1.4)), Image.NEAREST); S.alpha_composite(big, (x + (bg.width - big.width) // 2, 110))
    y = 110 + 800 + 30; b = bg.copy(); w = im.resize((int(im.width * 1.25), int(im.height * 1.25)), Image.NEAREST)
    b.alpha_composite(w, ((b.width - w.width) // 2, (b.height - w.height) // 2 + 40)); S.alpha_composite(b, (x, y))
S.save('kit_board.png'); print(S.size)
