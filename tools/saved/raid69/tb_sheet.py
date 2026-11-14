from PIL import Image, ImageDraw, ImageFont
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v90/tb/'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
g = Image.open(D + 'game.png').convert('RGB')   # cur A B C (×4)
labs = [('지금 (대그리핀)', ''), ('A 먹구름 날개', '날개깃 끝이 뭉게구름 · 먹빛 몸 · 청백 번개'), ('B 번개 깃', '지그재그로 갈라진 깃 · 쪽빛 · 빛나는 볏'), ('C 비바람', '날개를 옆으로 넓게 · 꼬리 끝에 빗줄기')]
n = 4; cw = (g.size[0] - 20) // n
cells = [g.crop((20 + i * cw - 4, 0, 20 + (i + 1) * cw - 6, g.size[1])) for i in range(n)]
sc = [Image.open(D + f'sc/scene_{k}.png').convert('RGB').crop((300, 250, 752, 628)) for k in 'ABC']
sw, shh = sc[0].size
s2 = 0.62
sc = [im.resize((int(sw * s2), int(shh * s2)), Image.NEAREST) for im in sc]
Wd = 40 + sum(c.size[0] for c in cells) + 30
Hd = 150 + cells[0].size[1] + 80 + sc[0].size[1] + 120
sh = Image.new('RGB', (Wd, Hd), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((40, 22), '천둥새 새 그림 시안 — 레이드에 남는 보스 (옛 대그리핀 자리)', font=f(30, True), fill=(240, 196, 90))
d.text((40, 68), '날개를 치켜든 거대한 폭풍새. 노란 몸 · 뾰족 깃 번개새(유명한 캐릭터)와 겹치지 않게 노랑 없이 먹구름 · 쪽빛 · 청백 번개로. 실제 게임 굽기(뭉툭 도트 B4) 그대로 · 게임에는 아직 안 넣음.', font=f(18), fill=(160, 155, 145))
x, y = 40, 120
for (lab, sub), im in zip(labs, cells):
    d.text((x, y), lab, font=f(21, True), fill=(236, 230, 220)); d.text((x, y + 28), sub, font=f(15), fill=(150, 146, 138))
    sh.paste(im, (x, y + 52)); x += im.size[0]
y += 52 + cells[0].size[1] + 24
d.text((40, y), '레이드 싸움 화면 (네 파티 · 오른쪽이 천둥새 — 적은 왼쪽을 본다)', font=f(21, True), fill=(236, 230, 220))
x = 40
for k, im in zip('ABC', sc):
    sh.paste(im, (x, y + 36)); d.text((x, y + 36 + im.size[1] + 6), k, font=f(18, True), fill=(240, 196, 90)); x += im.size[0] + 16
sh.save(D + 'thunderbird_drafts.png'); print(sh.size)
