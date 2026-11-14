"""노란 번개 천둥새 시안판: python3 tb_sheet_y.py <game_y.png 폴더> <출력.png>
game_y.png = tb_rend.py … cur A AY B BY C CY,  sc/scene_AY · BY · CY.png = tb_scene.py … AY BY CY"""
import sys
from PIL import Image, ImageDraw, ImageFont
D, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2]
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
g = Image.open(D + 'game_y.png').convert('RGB')   # cur A AY B BY C CY (×4)
n = 7; cw = (g.size[0] - 20) // n
cells = [g.crop((20 + i * cw - 4, 0, 20 + (i + 1) * cw - 6, g.size[1])) for i in range(n)][1:]
labs = [('A 먹구름 날개', '지난 시안 (청백 번개)'), ('AY 노란 번개', '깃 사이를 가로지르는 노란 번개 · 노란 눈'),
        ('B 번개 깃', '지난 시안 (청백 번개)'), ('BY 노란 번개', '노랗게 빛나는 볏 · 노란 번개 깃'),
        ('C 비바람', '지난 시안 (청백 번개)'), ('CY 노란 번개', '노란 번개 줄 · 꼬리 끝에 불똥 같은 빗방울')]
sc = [Image.open(D + f'sc/scene_{k}.png').convert('RGB').crop((300, 250, 752, 628)) for k in ('AY', 'BY', 'CY')]
sw, shh = sc[0].size; s2 = 0.62
sc = [im.resize((int(sw * s2), int(shh * s2)), Image.NEAREST) for im in sc]
Wd = 40 + sum(c.size[0] for c in cells) + 30
Hd = 150 + cells[0].size[1] + 80 + sc[0].size[1] + 70
sh = Image.new('RGB', (Wd, Hd), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((40, 22), '천둥새 시안 — 노란 번개 (11-14 13:45 「노란색 번개 색상 구상해봐」)', font=f(30, True), fill=(240, 196, 90))
d.text((40, 68), '몸은 먹구름 · 쪽빛 · 잿빛 그대로 두고 번개 · 눈 · (B) 볏만 노랑 — 노란 몸 · 뾰족 깃 번개새(유명한 캐릭터)와 겹치지 않게. 실제 게임 굽기(뭉툭 도트 B4) 그대로 · 게임에는 아직 안 넣음.', font=f(18), fill=(160, 155, 145))
x, y = 40, 120
for i, ((lab, sub), im) in enumerate(zip(labs, cells)):
    col = (236, 230, 220) if i % 2 else (150, 146, 138)
    d.text((x, y), lab, font=f(21, True), fill=col); d.text((x, y + 28), sub, font=f(15), fill=(150, 146, 138))
    sh.paste(im, (x, y + 52)); x += im.size[0]
y += 52 + cells[0].size[1] + 24
d.text((40, y), '레이드 싸움 화면 (네 파티 · 오른쪽이 천둥새)', font=f(21, True), fill=(236, 230, 220))
x = 40
for k, im in zip(('AY', 'BY', 'CY'), sc):
    sh.paste(im, (x, y + 36)); d.text((x, y + 36 + im.size[1] + 6), k, font=f(18, True), fill=(240, 196, 90)); x += im.size[0] + 16
sh.save(OUT); print(sh.size)
