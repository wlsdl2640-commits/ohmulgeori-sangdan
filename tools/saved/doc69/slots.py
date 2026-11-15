"""빌드 69 설명 문서용 장비 칸 판: python3 slots.py <stoneart69/shot89m.py 출력 폴더> <출력.png> — 장비 칸 창 · 창고 「룬·마석」 · 능력치 탭(상한)을 나란히"""
import sys
from PIL import Image, ImageDraw, ImageFont
D, OUT = sys.argv[1], sys.argv[2]
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
fb = ImageFont.truetype(F.replace('Regular', 'Bold'), 26, index=1); fr = ImageFont.truetype(F, 21, index=1)
P = [('1_slotwin', '장비 칸 창', '룬 3 · 마석 3 · 원천물 칸 (신성 장비)'), ('2_inv', '창고 「룬·마석」 칸', '마석 여덟 · 룬'), ('3b_adv_stat', '능력치 탭', '확률 50% 상한 · 마석 효과 줄')]
ims = [Image.open(f'{D}/{f}.png').convert('RGB').crop((0, 350, 824, 1650)) for f, _, _ in P]
w, h = ims[0].size; pad, lab = 24, 74
sheet = Image.new('RGB', (pad + 3 * (w + pad), 70 + lab + h + pad), (24, 26, 33))
dr = ImageDraw.Draw(sheet)
dr.text((pad, 18), '장비 9칸 · 마석 — 실제 게임 화면 (빌드 69)', font=fb, fill=(255, 215, 122))
for i, ((f, t, s), im) in enumerate(zip(P, ims)):
    x = pad + i * (w + pad); y = 70
    dr.text((x, y), t, font=fb, fill=(242, 242, 242)); dr.text((x, y + 34), s, font=fr, fill=(154, 163, 181))
    sheet.paste(im, (x, y + lab))
sheet.save(OUT); print(sheet.size)
