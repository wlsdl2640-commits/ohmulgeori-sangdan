# 모험가 다섯 + 몬스터를 게임 크기(1:1)로 늪 배경 위에 나란히 — 그림체 통일 점검.  python lineup.py <출력> <그림 …>
import sys
from PIL import Image, ImageDraw
R = 'D:/work/ohmulgeori-sangdan/tools/saved/'
bg = Image.open(R + 'plx73/bg_swamp/00.png').convert('RGBA')
P = R + 'gpt70/pixellab72/'
ADV = [Image.open(P + p).convert('RGBA') for p in ['war_v2/anim/final/idle/v2/00.png', 'por_v1/anim/idle/v1/00.png', 'rog_v1/anim/clean/idle/v1/00.png', 'pri_v1/e/pri_e2_120.png']]
ADV.insert(3, Image.open(P + 'arc_v2/idle.png').convert('RGBA').crop((0, 0, 156, 156)))
ADV = [a.crop(a.getbbox()) for a in ADV]
mons = [Image.open(R + p).convert('RGBA') for p in sys.argv[2:]]
mons = [m.crop(m.getbbox()) for m in mons]
pr = ADV[-1]
W = sum(a.width + 8 for a in ADV) + 20 + sum(m.width + 8 for m in mons) + 20; H = max([a.height for a in ADV] + [m.height for m in mons]) + 30
c = Image.new('RGBA', (W, H)); x = 0
while x < W: c.alpha_composite(bg.crop((0, max(0, bg.height - H), bg.width, bg.height)).resize((bg.width, H)), (x, 0)); x += bg.width
GY = H - 10; x = 10
for im in ADV + mons:
    c.alpha_composite(im, (x, GY - im.height)); x += im.width + (20 if im is pr else 8)
c.resize((c.width * 2, c.height * 2), Image.NEAREST).save(sys.argv[1]); print(c.size)
