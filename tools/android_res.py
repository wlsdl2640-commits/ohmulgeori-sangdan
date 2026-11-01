"""안드로이드 앱 아이콘과 시작 화면을 만든다. 결과는 android-res/ 에 저장되고, 자동 빌드가 앱 프로젝트에 덮어쓴다."""
import io, pathlib
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'android-res'
ICON = [
    '................',
    '......kkkkk.....',
    '.....kbbbbbk....',
    '......kyyyk.....',
    '.....kbbbbbk....',
    '....kbbbbbbbk...',
    '...kbbbbbbbbbk..',
    '..kbbbkkkkbbbbk.',
    '..kbbkyyyykbbbk.',
    '..kbkyyllyykbbk.',
    '..kbkyylyyykbbk.',
    '..kbkyyyyyykbbk.',
    '..kbbkyyyykbbbk.',
    '...kbbkkkkbbbk..',
    '....kkkkkkkkk...',
    '................',
]
PAL = {'k': (26, 20, 16, 255), 'b': (138, 90, 50, 255), 'y': (240, 180, 60, 255), 'l': (255, 242, 192, 255)}
BG = (19, 22, 30, 255)
SPLASH_BG = (11, 13, 18, 255)
GOLD = (240, 180, 60, 255)

def art(img, cx, cy, cell):
    off_x, off_y = cx - cell * 8, cy - cell * 8
    for y, row in enumerate(ICON):
        for x, ch in enumerate(row):
            if ch in PAL:
                img.paste(PAL[ch], (off_x + x * cell, off_y + y * cell, off_x + (x + 1) * cell, off_y + (y + 1) * cell))

def save(img, rel):
    p = OUT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    img.save(p)

# 아이콘: 예전 방식(사각·원형)과 적응형 아이콘 전경
for d, s, f in [('mdpi', 48, 108), ('hdpi', 72, 162), ('xhdpi', 96, 216), ('xxhdpi', 144, 324), ('xxxhdpi', 192, 432)]:
    sq = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(sq).rounded_rectangle((0, 0, s - 1, s - 1), radius=s // 6, fill=BG)
    art(sq, s // 2, s // 2, max(1, int(s * 0.72) // 16))
    save(sq, f'mipmap-{d}/ic_launcher.png')
    rd = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(rd).ellipse((0, 0, s - 1, s - 1), fill=BG)
    art(rd, s // 2, s // 2, max(1, int(s * 0.62) // 16))
    save(rd, f'mipmap-{d}/ic_launcher_round.png')
    fg = Image.new('RGBA', (f, f), (0, 0, 0, 0))
    art(fg, f // 2, f // 2, max(1, int(f * 0.5) // 16))
    save(fg, f'mipmap-{d}/ic_launcher_foreground.png')
(OUT / 'values').mkdir(parents=True, exist_ok=True)
(OUT / 'values' / 'ic_launcher_background.xml').write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#13161E</color>\n</resources>\n', encoding='utf-8')

# 시작 화면: 금화 주머니와 게임 이름
woff = TTFont(ROOT / 'fonts' / 'Galmuri11-Bold.woff2')
woff.flavor = None
buf = io.BytesIO(); woff.save(buf)
def font(px):
    buf.seek(0)
    return ImageFont.truetype(io.BytesIO(buf.getvalue()), px)

def splash(w, h):
    img = Image.new('RGBA', (w, h), SPLASH_BG)
    m = min(w, h)
    cell = max(2, int(m * 0.28) // 16)
    cy = h // 2 - m // 10
    art(img, w // 2, cy, cell)
    size = max(22, round(m * 0.075 / 11) * 11)
    f = font(size)
    text = '오물거리 상단'
    d = ImageDraw.Draw(img)
    tw = d.textlength(text, font=f)
    ty = cy + cell * 8 + m // 16
    sh = max(2, size // 11)
    d.text(((w - tw) / 2 + sh, ty + sh), text, font=f, fill=(0, 0, 0, 255))
    d.text(((w - tw) / 2, ty), text, font=f, fill=GOLD)
    return img

save(splash(480, 320), 'drawable/splash.png')
for d, (w, h) in {'mdpi': (320, 480), 'hdpi': (480, 800), 'xhdpi': (720, 1280), 'xxhdpi': (960, 1600), 'xxxhdpi': (1280, 1920)}.items():
    save(splash(w, h), f'drawable-port-{d}/splash.png')
    save(splash(h, w), f'drawable-land-{d}/splash.png')
print('android-res 완료:', sum(1 for _ in OUT.rglob('*.png')), '개 이미지')
