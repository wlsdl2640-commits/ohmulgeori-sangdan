from PIL import Image, ImageDraw, ImageFont
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v90/sd/'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
im = Image.open(D + 'rend.png').convert('RGB'); cw, ch = 420, 360
row = lambda r, i: im.crop((20 + i * cw, 10 + r * ch, 20 + (i + 1) * cw, 10 + (r + 1) * ch))
labs = [('A 산호 해룡', '산호빛 몸 · 가지 친 산호 뿔 · 청록 잎 지느러미'), ('B 해초 해룡', '올리브 몸 · 늘어진 해초 잎 · 나무빛 뿔 · 금빛 눈'), ('C 심해 해룡', '남보라 몸 · 빛나는 청록 점 · 은빛 뿔'), ('D 진주 해룡', '진주빛 몸 · 분홍 잎 지느러미 · 이마에 진주')]
cut = lambda x: x.crop((60, 30, 380, 350))   # 칸 가운데
Wd = 40 + 4 * 330 + 20
Hd = 140 + (330 + 330 + 40) + 70 + 200
sh = Image.new('RGB', (Wd, Hd), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((40, 22), '해룡 탈것 시안 — 용기수가 타는 해마 꼴 용 (해상왕국 배가 항구에 올 때 판다)', font=f(28, True), fill=(240, 196, 90))
d.text((40, 64), '곧은 S자 몸을 앞으로 기울여 공중을 헤엄친다(와이번처럼 떠 있음) · 앞으로 내민 가슴의 마디 · 고리로 말린 꼬리 · 잎사귀 지느러미. 대롱 주둥이 + 푸른 몸 + 크림 배(유명한 해마 용)는 피했다.', font=f(17), fill=(160, 155, 145))
d.text((40, 88), '실제 게임 그리기(탈것 + 용기수 합치기 · 뭉툭 도트 B4)로 찍음 · 게임에는 아직 안 넣음', font=f(17), fill=(160, 155, 145))
x0, y0 = 40, 130
for i, (lab, sub) in enumerate(labs):
    x = x0 + i * 330
    d.text((x, y0), lab, font=f(21, True), fill=(236, 230, 220)); d.text((x, y0 + 28), sub, font=f(14), fill=(150, 146, 138))
    sh.paste(cut(row(2 + i, 0)), (x, y0 + 50))
    sh.paste(cut(row(2 + i, 1)), (x, y0 + 50 + 330))
y = y0 + 50 + 660 + 20
d.text((40, y), '탈것끼리 크기 비교 (두 배 — 왼쪽부터 지금 와이번 A · 하늘뱀 용 D · 해룡 A · B · C · D)', font=f(19, True), fill=(236, 230, 220))
x = 40
for r in range(6):
    t = row(r, 1).resize((140, 120), Image.NEAREST).crop((10, 0, 130, 120))
    big = t.resize((240, 240), Image.NEAREST)
    sh.paste(big.crop((20, 30, 220, 200)), (x, y + 30)); x += 210
sh.save(D + 'seadragon_drafts.png'); print(sh.size)
