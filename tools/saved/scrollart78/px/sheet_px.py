"""픽셀랩 후보 판: python sheet_px.py <출력.png>  — 줄마다 후보 넷(크게 2배) + 게임 칸 크기(72px)"""
import sys
from PIL import Image, ImageDraw, ImageFont
FD = 'C:/Windows/Fonts/'
f12 = ImageFont.truetype(FD + 'malgun.ttf', 12); f14 = ImageFont.truetype(FD + 'malgunbd.ttf', 14); f18 = ImageFont.truetype(FD + 'malgunbd.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
ROWS = [('s_seal', '주문서 A · 말린 두루마리 + 리본 + 밀랍 봉인'), ('s_open', '주문서 B · 반쯤 펼친 두루마리 + 문양'), ('s_rods', '주문서 C · 나무 손잡이 + 술'),
        ('s_gold', '주문서 D · S자로 말린 화려한 두루마리 (10% 느낌)'),
        ('b_warrior', '전사 스킬북 · 붉은 가죽 · 쇠 모서리 · 검'), ('b_archer', '궁수 스킬북 · 초록 수첩 · 가죽 끈 · 깃털'), ('b_mage', '마법사 스킬북 · 보라 마도서 · 금 잠금쇠 · 마나석'),
        ('b_cleric', '성직자 스킬북 · 흰 경전 · 금 모서리 · 해'), ('b_rogue', '도적 스킬북 · 검은 가죽 · 붉은 끈 · 표창'), ('b_porter', '짐꾼 스킬북 · 천 장부 · 밧줄 · 바퀴'),
        ('b_common', '공용 스킬북 · 푸른 가죽 · 마름모')]
S = 2; cw = 128 * S + 16
W = 30 + 4 * cw + 4 * 80 + 20; RH = 128 * S + 54
im = Image.new('RGBA', (W, 70 + len(ROWS) * RH), BG + (255,)); d = ImageDraw.Draw(im)
d.text((20, 12), '주문서 · 스킬북 — 픽셀랩 후보 (게임 부속품 그림을 기준 그림으로 줌)', font=f18, fill=GOLD)
d.text((20, 40), '줄마다 후보 1 ~ 4 (2배) · 오른쪽 = 게임 창고 칸 크기(72px)', font=f12, fill=INK2)
y = 70
for key, name in ROWS:
    d.text((20, y), name, font=f14, fill=INK)
    for i in range(4):
        src = Image.open(f'raw/{key}_{i}.png').convert('RGBA'); x = 20 + i * cw
        d.rectangle([x - 2, y + 20, x + 128 * S + 1, y + 22 + 128 * S], fill=(40, 44, 56))
        im.alpha_composite(src.resize((128 * S, 128 * S), Image.NEAREST), (x, y + 21))
        d.text((x + 4, y + 24), str(i + 1), font=f14, fill=GOLD)
        cx = 20 + 4 * cw + i * 80; d.rectangle([cx, y + 60, cx + 75, y + 135], fill=(30, 56, 88), outline=(60, 118, 184), width=2)
        im.alpha_composite(src.resize((72, 72), Image.LANCZOS), (cx + 2, y + 62))
    y += RH
im.save(sys.argv[1]); print(im.size)
