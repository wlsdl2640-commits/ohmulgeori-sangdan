"""안드로이드 앱 아이콘과 시작 화면을 만든다. 결과는 android-res/ 에 저장되고, 자동 빌드가 앱 프로젝트에 덮어쓴다.
빌드 47부터: 밤의 상단 앞(모험가 다섯 · 왕국 마차) + 건물 위 하늘에 게임 제목 — 그림은 tools/appart.py."""
import pathlib, sys
from PIL import Image, ImageDraw
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import appart

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'android-res'
NAME = '판타지세계 상단 키우기'

def save(img, rel):
    p = OUT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    img.save(p)

art = appart.art_square(NAME)
art_r = appart.art_square(NAME, y0=46)   # 원·적응형: 위가 둥글게 잘리니 제목을 조금 내린다
# 아이콘: 예전 방식(둥근 사각·원형)과 적응형 아이콘 앞 그림
for d, s, f in [('mdpi', 48, 108), ('hdpi', 72, 162), ('xhdpi', 96, 216), ('xxhdpi', 144, 324), ('xxxhdpi', 192, 432)]:
    a = appart.fit(art, s).convert('RGBA')
    m = Image.new('L', (s, s), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, s - 1, s - 1), radius=s // 6, fill=255)
    sq = Image.new('RGBA', (s, s), (0, 0, 0, 0)); sq.paste(a, (0, 0), m)
    save(sq, f'mipmap-{d}/ic_launcher.png')
    m = Image.new('L', (s, s), 0); ImageDraw.Draw(m).ellipse((0, 0, s - 1, s - 1), fill=255)
    rd = Image.new('RGBA', (s, s), (0, 0, 0, 0)); rd.paste(appart.fit(art_r, s).convert('RGBA'), (0, 0), m)
    save(rd, f'mipmap-{d}/ic_launcher_round.png')
    save(appart.adaptive_fg(art_r, f).convert('RGBA'), f'mipmap-{d}/ic_launcher_foreground.png')
(OUT / 'values').mkdir(parents=True, exist_ok=True)
(OUT / 'values' / 'ic_launcher_background.xml').write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#13161E</color>\n</resources>\n', encoding='utf-8')

# 시작 화면: 제목을 얹은 밤의 상단 앞 장면
save(appart.splash(NAME, 480, 320), 'drawable/splash.png')
for d, (w, h) in {'mdpi': (320, 480), 'hdpi': (480, 800), 'xhdpi': (720, 1280), 'xxhdpi': (960, 1600), 'xxxhdpi': (1280, 1920)}.items():
    save(appart.splash(NAME, w, h), f'drawable-port-{d}/splash.png')
    save(appart.splash(NAME, h, w), f'drawable-land-{d}/splash.png')
print('android-res 완료:', sum(1 for _ in OUT.rglob('*.png')), '개 이미지')
