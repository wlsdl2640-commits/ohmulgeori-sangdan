from PIL import Image, ImageDraw, ImageFont
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v87/ks/'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
keys = [('cur', '지금 (레이드 그림)'), ('A', 'A 왕관 없음'), ('B', 'B 머리 위 작은 왕관 (추천)'), ('C', 'C 왕관도 삼켰다')]
z = 5
ims = [Image.open(D + f'close_{k}.png').convert('RGBA').crop((60, 84, 140, 146)) for k, _ in keys]
w, h = ims[0].size
cellw = w * z + 30
Wd = 40 + cellw * 4 + 10
sc = Image.open(D + 'scene_B.png').convert('RGB').crop((0, 300, 752, 628))
Hd = 150 + h * z + 70 + sc.size[1] + 90
sh = Image.new('RGB', (Wd, Hd), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((40, 24), '킹슬라임 새 그림 시안 — 평원 초록 슬라임을 그대로 크게', font=f(30, True), fill=(240, 196, 90))
d.text((40, 70), '몸속에 삼킨 장검 · 보물 상자 · 금화가 녹빛으로 비친다 (원천물 「슬라임의 위장」). 움직임은 평원 슬라임의 납작 · 늘어남을 그대로 쓴다. 게임에는 아직 안 넣음.', font=f(19), fill=(160, 155, 145))
y = 120
for i, ((k, lab), im) in enumerate(zip(keys, ims)):
    x = 40 + i * cellw
    big = im.resize((w * z, h * z), Image.NEAREST)
    bg = Image.new('RGB', big.size, (40, 44, 56)); bg.paste(big, (0, 0), big)
    sh.paste(bg, (x, y + 36)); d.text((x, y), lab, font=f(21, True), fill=(240, 196, 90) if '추천' in lab else (236, 230, 220))
y += 36 + h * z + 30
d.text((40, y), 'B안을 레이드 무대에 (네 파티 · 화면 너비는 지금과 비슷하게)', font=f(21, True), fill=(236, 230, 220))
sh.paste(sc, (40, y + 36))
sh.save(D + 'kingslime_drafts.png'); print(sh.size)
