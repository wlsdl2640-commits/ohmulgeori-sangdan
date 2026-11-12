"""방어구 시안 한 장 (갑옷 · 로브 · 후드 · 망토 × 8) → armor_drafts64.png
python3 sheet_arm64.py  (글꼴: FONT_DIR 아래 Galmuri11 · Galmuri11-Bold .ttf)"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import designs as Dz   # noqa: E402

FD = os.environ.get('FONT_DIR', '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/')
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
b13 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 13); b15 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 15); b18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (24, 28, 40); CARD = (34, 40, 56); SLOT = (52, 44, 36); TXT = (232, 232, 240); DIM = (150, 156, 176); GOLD = (240, 200, 90)
S = 6
CW, CH = 20 * S + 34, 20 * S + 108
COLS = 8
SECT = {'P': ('갑옷', '판금 갑옷 자리 — 둥근 어깨 · 가시 어깨 · 날개 어깨'),
        'R': ('로브', '로브 자리 — 어깨 망토 · 높은 깃과 소매 띠'),
        'H': ('후드', '후드 망토 — 금 단 V · 너덜 단 (가죽 갑옷 자리로 쓰면?)'),
        'C': ('망토', '털 깃 · 어깨 망토 — 지금은 망토 칸이 없다')}
X0, Y0 = 20, 64
HEAD = 30
W = X0 * 2 + COLS * CW
H = Y0 + 4 * (HEAD + CH + 14) + 70
out = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(out)
d.text((X0, 16), '빌드 64 방어구 시안 — 우리 장비 그림 결 (20×20 · 검은 테 · 왼쪽 위 빛 · 좌우 대칭)', fill=GOLD, font=b18)
d.text((X0, 42), '참고: ChatGPT 그림의 네 갈래 · 색 배치. 큰 그림 = 6배, 아래 = 게임 크기 2배 · 3배. 번호로 골라 주세요.', fill=DIM, font=f12)


def paint(img, x0, y0, s, bg=None):
    if bg: d.rectangle([x0, y0, x0 + 20 * s - 1, y0 + 20 * s - 1], fill=bg)
    for (x, y), c in img.items(): d.rectangle([x0 + x * s, y0 + y * s, x0 + x * s + s - 1, y0 + y * s + s - 1], fill=tuple(c))


y = Y0
n = 0
for cat in 'PRHC':
    nm, sub = SECT[cat]
    d.text((X0, y + 6), nm, fill=TXT, font=b15)
    d.text((X0 + 46, y + 9), sub, fill=DIM, font=f12)
    y += HEAD
    for i, dz in enumerate([z for z in Dz.D if z['cat'] == cat]):
        n += 1
        x = X0 + i * CW
        d.rounded_rectangle([x + 2, y, x + CW - 6, y + CH - 4], 8, fill=CARD)
        im = Dz.img(dz)
        paint(im, x + 14, y + 10, S)
        d.text((x + 10, y + 6), str(n), fill=GOLD, font=b13)
        paint(im, x + 14, y + 20 * S + 16, 2, SLOT)
        paint(im, x + 64, y + 20 * S + 16, 3, SLOT)
        d.text((x + 12, y + CH - 20), dz['name'], fill=TXT, font=f11)
    y += CH + 14
d.text((X0, y + 4), '· 십자 문장은 쓰지 않았다 — 참고 그림의 십자 자리는 초승달 · 해 원반 · 왕관 · 날개 V · 불꽃 · 잎 · 보석으로 바꿈.', fill=DIM, font=f12)
d.text((X0, y + 24), '· 고르면 게임에 넣을 때 단계(견습 ~ 성좌)별 이름 · 그림으로 나눈다. 참고 그림은 저장소에 넣지 않음.', fill=DIM, font=f12)
out.save(os.path.join(HERE, 'armor_drafts64.png'))
print(out.size, n)
