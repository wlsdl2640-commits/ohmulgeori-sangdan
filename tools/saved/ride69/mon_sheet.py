"""해룡 시안판 둘: python3 mon_sheet.py <작업 폴더>  (sd_fs.png = sd_rend2.py, mon/close · pets · scene1 · scene2.png = mon_rend.py)
→ seadragon_fs.png(탈것 넷 — 게임에 넣은 앞모습 · 자는 모습) · seadragon_mon_drafts.png(야생 해룡 몬스터 · 새끼 펫 시안)"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
D = sys.argv[1].rstrip('/') + '/'; HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
GOLD, TXT, SUB, BG = (240, 196, 90), (236, 230, 220), (160, 155, 145), (21, 23, 28)

# 1) 탈것: sd_fs.png (7열 × 4줄, 열 420 · 줄 400) → 그대로 줄여서
fs = Image.open(D + 'sd_fs.png').convert('RGB'); s = 0.62
fs = fs.resize((int(fs.width * s), int(fs.height * s)), Image.NEAREST)
sh = Image.new('RGB', (fs.width + 60, fs.height + 130), BG); d = ImageDraw.Draw(sh)
d.text((30, 18), '해룡 탈것 넷 — 게임에 넣음 (11-14 13:45 「다 추가하고」)', font=f(28, True), fill=GOLD)
d.text((30, 60), '옆모습은 고른 시안 그대로, 앞모습(영웅 창 · 초상 · 상단 앞) · 자는 모습(야영 · 마구간)을 새로 그렸다. 해룡기수(용기수 다음 4차)가 들어오면 이 그림으로 탄다 — 그림은 지금 용기수에 잠깐 끼워 찍은 것.', font=f(16), fill=SUB)
sh.paste(fs, (30, 100)); sh.save(HERE + 'seadragon_fs.png'); print('fs', sh.size)

# 2) 몬스터 · 펫
cl = Image.open(D + 'mon/close.png').convert('RGB')
sc = [Image.open(D + f'mon/scene{i}.png').convert('RGB') for i in (1, 2)]
sc = [im.crop((0, 230, im.width, im.height)) for im in sc]; s2 = 0.72
sc = [im.resize((int(im.width * s2), int(im.height * s2)), Image.NEAREST) for im in sc]
pe = Image.open(D + 'mon/pets.png').convert('RGB')
W = max(cl.width + 60, sum(im.width for im in sc) + 80, pe.width + 60)
H = 120 + 40 + cl.height + 70 + sc[0].height + 70 + pe.height + 60
sh = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sh)
d.text((30, 18), '해룡 몬스터 · 새끼 펫 시안 — 게임에 안 넣음 (11-14 13:45)', font=f(28, True), fill=GOLD)
d.text((30, 60), '탈것과 같은 몸에서 안장을 뺀 야생 해룡. 모습 넷 = 몬스터 모습 넷(같은 해룡도 개체마다 모습이 다름), 알은 떨어뜨린 해룡의 모습을 이어받는다(제안).', font=f(16), fill=SUB)
d.text((30, 84), '실제 게임 굽기(뭉툭 도트 B4)로 찍음. 대롱 주둥이 + 푸른 몸 + 크림 배(유명한 해마 용)는 피했다.', font=f(16), fill=SUB)
y = 124
d.text((30, y), '야생 해룡 (몬스터) — 서 있기 둘 · 물기 · 뿜기 준비 · 물 뿜기   (위에서부터 A 산호 · B 해초 · C 심해 · D 진주)', font=f(20, True), fill=TXT)
sh.paste(cl, (30, y + 36)); y += 36 + cl.height + 24
d.text((30, y), '실제 전투 화면 (적 둘씩 — A · B / C · D)', font=f(20, True), fill=TXT)
x = 30
for im in sc: sh.paste(im, (x, y + 36)); x += im.width + 20
y += 36 + sc[0].height + 24
d.text((30, y), '새끼 해룡 (펫) — 알에서 깬 모습, 서 있기 둘씩 (A · B · C · D). 다 자라면 위 야생 해룡 그림, Lv30이면 해룡기수 전직에 쓴다.', font=f(20, True), fill=TXT)
sh.paste(pe, (30, y + 36))
sh.save(HERE + 'seadragon_mon_drafts.png'); print('mon', sh.size)
