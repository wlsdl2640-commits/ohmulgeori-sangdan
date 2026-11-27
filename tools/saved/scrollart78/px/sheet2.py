"""둘째 판: python sheet2.py <출력.png> — 고른 스킬북 · 도적 열쇠 · 마법사 다시 · 강화 주문서 확률 상태"""
import sys
from PIL import Image, ImageDraw, ImageFont
FD = 'C:/Windows/Fonts/'
f12 = ImageFont.truetype(FD + 'malgun.ttf', 12); f14 = ImageFont.truetype(FD + 'malgunbd.ttf', 14); f18 = ImageFont.truetype(FD + 'malgunbd.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
RQ = [((26, 32, 48), (70, 78, 96)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184)), ((64, 36, 90), (147, 86, 204)), ((87, 64, 18), (224, 160, 50))]
ROWS = [
    ('고른 스킬북 — 전사 1 · 궁수 4 · 성직자 4 · 도적 3 · 짐꾼 1 · 공용 1', [('b_warrior_0', '전사'), ('b_archer_3', '궁수'), ('b_cleric_3', '성직자'), ('b_rogue_2', '도적'), ('b_porter_0', '짐꾼'), ('b_common_0', '공용')]),
    ('마법사 = 나3 + 앞면 룬을 나1의 룬으로', [('b_mage3_2', '나3 (원래)'), ('b_mage3_0', '나1 (룬 본)'), ('b_mage_fin1_0', '고침 가'), ('b_mage_fin2_0', '고침 나')]),
    ('강화 주문서 확률 상태 — 30% 가운데 갈라짐 줄임 (가 · 나 중 하나)', [('e_100_0', '100%'), ('e_80_0', '80%'), ('e_60_0', '60%'), ('e_30b_0', '30% 가'), ('e_30c_0', '30% 나'), ('e_10_0', '10%')]),
]
S = 2; cw = 128 * S + 14; RH = 128 * S + 120
W = 40 + 6 * cw
im = Image.new('RGBA', (W, 60 + len(ROWS) * RH), BG + (255,)); d = ImageDraw.Draw(im)
d.text((20, 12), '주문서 · 스킬북 둘째 시안 (픽셀랩) — 아래 칸은 게임 창고 칸 72px', font=f18, fill=GOLD)
y = 50
for title, items in ROWS:
    d.text((20, y), title, font=f14, fill=INK)
    for i, (k, lab) in enumerate(items):
        src = Image.open(f'raw/{k}.png').convert('RGBA'); x = 20 + i * cw
        d.rectangle([x - 2, y + 20, x + 128 * S + 1, y + 22 + 128 * S], fill=(40, 44, 56))
        im.alpha_composite(src.resize((128 * S, 128 * S), Image.NEAREST), (x, y + 21)); d.text((x + 4, y + 24), lab, font=f14, fill=GOLD)
        g = {'e_100_0': 0, 'e_80_0': 1, 'e_60_0': 2, 'e_10_0': 4}.get(k, 3 if k.startswith('e_30') else 2)
        inner, border = RQ[g]; cy = y + 30 + 128 * S
        d.rectangle([x, cy, x + 75, cy + 75], fill=inner, outline=border, width=2); im.alpha_composite(src.resize((72, 72), Image.LANCZOS), (x + 2, cy + 2))
    y += RH
im.save(sys.argv[1]); print(im.size)
