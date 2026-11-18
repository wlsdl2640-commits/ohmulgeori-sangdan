"""새 평원 배경(사용자 GPT 그림) + 넓은 싸움 땅 목업 — 지금 게임 화면 크기(240×200 논리, 화면 2배)"""
import json, base64, io, sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage
ATT = '/mnt/user-data/attachments/4368c869-ae47-5efb-8102-510605121dd4/'
V95 = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v95/'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FB if b else FR, n, index=2)
GOLD, TXT, SUB, BG = (240, 196, 90), (236, 230, 220), (160, 156, 148), (21, 23, 28)
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
def keyed(path):   # 마젠타 → 투명 (가장자리 분홍 번짐까지)
    a = np.array(Image.open(path).convert('RGB')).astype(int); R, G, B = a[..., 0], a[..., 1], a[..., 2]
    mag = ((R > 170) & (B > 170) & (G < 110) & (np.abs(R - B) < 90)) | ((R - G > 70) & (B - G > 70))   # 가장자리 분홍 번짐도
    out = np.dstack([a, np.where(mag, 0, 255)]).astype(np.uint8); return Image.fromarray(out, 'RGBA')
# 몬스터 리마스터 1 (v95 monmock의 오리기 그대로)
src = open(V95 + 'monmock.py', encoding='utf-8').read(); src = src[:src.index("def bbox(")]
cwd = os.getcwd(); os.chdir(V95); ns = {}; exec(src, ns); os.chdir(cwd); S1 = ns['S1']
SIZE = {'rat': (91, 46), 'slime': (70, 50), 'rabbit': (75, 60), 'wolf': (92, 56), 'goblin': (64, 64)}   # 지금 게임 크기(화면 픽셀, 앞줄 1.25배)
H = json.load(open('m97/heroes.json'))
sky = Image.open('m97/sky.png').convert('RGBA')
z_at = lambda y: 1.0 + 0.25 * max(0, min(1, (y - 130) / 65))

BLADES = None
def scene(bgimg, x0, units):
    C = Image.new('RGBA', (480, 400), (0, 0, 0, 255))
    C.alpha_composite(sky.crop((0, 70, 480, 400)), (0, 0))
    lay = bgimg.resize((480, round(bgimg.height * 480 / bgimg.width)), Image.LANCZOS)          # 두 화면 너비 = 논리 480
    al = np.array(lay)[..., 3]; arr = np.array(lay); arr[..., 3] = np.where(al > 128, 255, 0); lay = Image.fromarray(arr)
    lay = lay.resize((lay.width * 2, lay.height * 2), Image.NEAREST)                           # 논리 1px = 화면 2px
    C.alpha_composite(lay.crop((x0 * 2, 0, x0 * 2 + 480, lay.height)), (0, 400 - lay.height))
    if BLADES is not None:   # 풍차 날개 다섯 장 (사용자 그림 2 오른쪽) — 탑 지붕 앞 축에, 탑 너비의 2.2배쯤
        k = 480 / bgimg.width; hx, hy = 1387 * k - x0, (400 - lay.height) / 2 + 186 * k          # 논리 좌표
        span = 50; bl = BLADES.resize((span, round(BLADES.height * span / BLADES.width)), Image.LANCZOS)
        a2 = np.array(bl); a2[..., 3] = np.where(a2[..., 3] > 128, 255, 0); bl = Image.fromarray(a2).resize((bl.width * 2, bl.height * 2), Image.NEAREST)
        C.alpha_composite(bl, (round(hx * 2 - bl.width / 2), round(hy * 2 - bl.height / 2)))
    d = ImageDraw.Draw(C, 'RGBA')
    for kind, k, x, y in sorted(units, key=lambda u: u[3]):
        z = z_at(y); X, Y = x * 2, y * 2
        d.ellipse((X - 9 * z * 2 * 0.9, Y - 3 * z, X + 9 * z * 2 * 0.9, Y + 3 * z), fill=(0, 0, 0, 60))
        if kind == 'h':
            s = H['heroes'][k]; im = img(s['u']); k2 = 2 * z
            big = im.resize((round(im.width * k2), round(im.height * k2)), Image.NEAREST)
            C.alpha_composite(big, (round(X - s['ax'] * k2), round(Y - s['ay'] * k2)))
            d.rectangle((X - 18, Y + 6, X + 18, Y + 9), fill=(40, 20, 20, 255)); d.rectangle((X - 17, Y + 7, X + 12, Y + 8), fill=(220, 60, 50, 255))
            d.rectangle((X - 18, Y + 10, X + 18, Y + 13), fill=(20, 20, 40, 255)); d.rectangle((X - 17, Y + 11, X + 8, Y + 12), fill=(70, 130, 230, 255))
        else:
            spr = S1[k]; tw, th = SIZE[k]; kk = ((tw * th) / (spr.width * spr.height)) ** 0.5 * z / 1.25
            lw, lh = max(1, round(spr.width * kk / 2)), max(1, round(spr.height * kk / 2))
            sm = spr.resize((lw, lh), Image.LANCZOS); a2 = np.array(sm); a2[..., 3] = np.where(a2[..., 3] > 110, 255, 0); sm = Image.fromarray(a2).resize((lw * 2, lh * 2), Image.NEAREST)
            C.alpha_composite(sm, (round(X - sm.width / 2), Y - sm.height))
            d.rectangle((X - 16, Y + 6, X + 16, Y + 9), fill=(40, 20, 20, 255)); d.rectangle((X - 15, Y + 7, X + 10, Y + 8), fill=(220, 60, 50, 255))
    return C.convert('RGB')

bg1 = keyed(ATT + '38f56457-image.png')   # 사용자 그림 1: 다 겹친 모습 (넓은 땅)
_bl = keyed(ATT + '4b92ccaf-image.png').crop((1786, 0, 2172, 724)); BLADES = _bl.crop(_bl.getbbox())
UNITS = [('h', 0, 106, 170), ('h', 3, 80, 190), ('h', 1, 68, 150), ('h', 2, 42, 174),
         ('m', 'rat', 148, 192), ('m', 'slime', 158, 158), ('m', 'rabbit', 182, 178), ('m', 'wolf', 206, 146), ('m', 'goblin', 212, 192)]
NEW = scene(bg1, 120, UNITS)
CUR = Image.open(V95 + 'sc/reg_all.png').convert('RGB')
SW = 1000; sh = Image.new('RGB', (SW, 2000), BG); d = ImageDraw.Draw(sh); y = 18
d.text((20, y), '평원 — 넓은 싸움 땅으로 바꾸면 (목업)', font=fnt(30, True), fill=GOLD); y += 46
d.text((20, y), '보내 준 그림 1을 지금 배경 겹 해상도(두 화면 너비 = 논리 480)로 줄여 깔고, 하늘 · 해 · 구름은 게임 것 · 모험가는 지금 그림 · 몬스터는 리마스터 1', font=fnt(15), fill=SUB); y += 24
d.text((20, y), '폰에서 보이는 크기 · 뒤에 선 사람일수록 작게(1.0 ~ 1.25배) · 체력 막대 자리는 어림', font=fnt(15), fill=SUB); y += 34
for title, P in [('지금 게임 (땅이 화면 아래 한 줄)', CUR), ('새 방식 — 지평선을 올리고 넓은 땅에 파티 · 몬스터가 앞뒤로 흩어져 선다', NEW)]:
    d.text((20, y), title, font=fnt(19, True), fill=TXT); y += 30
    sh.paste(P.resize((960, 800), Image.NEAREST), (20, y)); y += 800 + 24
sh = sh.crop((0, 0, SW, y)); sh.save('layout_mock.png'); print(sh.size)
NEW.save('new_scene_480.png')
