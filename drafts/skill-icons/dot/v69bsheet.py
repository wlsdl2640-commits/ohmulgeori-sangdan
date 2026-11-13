"""빌드 69 시안 판 2 — 짐 덜어 주기 그림 다시 넷 (11-13 17:41 사용자 「짐 덜어주기 시안 4개 다시」) · 확정 셋(물통 돌리기 A · 웨건 보급 A · 개척민의 지혜 A) 함께
python3 v69bsheet.py → v69b_lighten.png"""
import sys, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell, c_v69
from PIL import Image, ImageDraw, ImageFont
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16, index=2)
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
NEW = [('shieldbag_c', 'A', '동료들 짐을 쌓아 묶음', '색이 다른 등짐 셋'), ('shieldbag_d', 'B', '등짐 + 모래시계', '기술이 빨리 돈다'),
       ('shieldbag_e', 'C', '불끈 쥔 팔이 자루를 번쩍', '힘으로 대신 든다'), ('shieldbag_f', 'D', '큰 짐을 진 짐꾼', '옆모습 · 걷는 중')]
DONE = [('medkit_a', '물통 돌리기 A'), ('rations_a', '웨건 보급 A'), ('pioneerwit_a', '개척민의 지혜 A')]
Z = 3; IW = 48 * Z; CW = IW + 46
sh = Image.new('RGB', (12 + 4 * CW + 12, 60 + IW + 120 + 40 + 48 * 2 + 50), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((12, 10), '짐 덜어 주기 — 그림 시안 다시 넷 (효과: 10초 동안 파티 스킬 재사용 −12% · 짐 +%만큼 오래)', font=FB, fill=(240, 196, 90))
for i, (k, tag, name, note) in enumerate(NEW):
    nm, kind, fn = c_v69.ICONS[k]; im = fn()[0].img(kind); z = cell.zoom(im, Z); x0 = 12 + i * CW
    sh.paste(z, (x0, 44), z); sh.paste(im, (x0 + IW - 46, 44 + IW + 8), im)
    d.text((x0, 44 + IW + 6), f'{tag}안', font=FB, fill=(232, 228, 220))
    d.text((x0, 44 + IW + 58), name, font=F, fill=(225, 222, 214)); d.text((x0, 44 + IW + 78), note, font=F, fill=(150, 145, 140))
y1 = 44 + IW + 112
d.line([(12, y1), (sh.width - 12, y1)], fill=(44, 46, 54))
d.text((12, y1 + 10), '확정 (게임에 넣음)', font=FB, fill=(150, 200, 150))
for i, (k, name) in enumerate(DONE):
    nm, kind, fn = c_v69.ICONS[k]; im = fn()[0].img(kind); z = cell.zoom(im, 2); x0 = 12 + i * 220
    sh.paste(z, (x0, y1 + 40), z); d.text((x0 + 104, y1 + 80), name, font=F, fill=(200, 196, 188))
out = D / 'v69b_lighten.png'; sh.save(out); print(out.name, sh.size)
