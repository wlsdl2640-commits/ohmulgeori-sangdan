"""사이 값 시안 6단계: 찍은 장면(cap_mid.py)을 시안 페이지 묶음으로 — 그림 파일 + index.html
   python3 mkpage_mid.py <찍은 폴더(cap)> <출력 폴더>
   · solo_<판>.png   걷는 전사 하나 (무대 116×128 그대로)
   · f_<판>.webp     싸움 56장 (352×240 × 8줄 판, 무손실) · w_<판>.webp 걷기 32장 (200×220)
   · mon_<판>.png    전사와 몬스터 여섯이 선 모습 두 칸 (허수아비 · 멧돼지 · 갑옷 멧돼지 / 들늑대 · 들쥐 · 뿔토끼)
   페이지는 같은 장 번호에서 그림만 바꿔 보여 준다 (모든 판이 같은 싸움 · 같은 때)."""
import sys, os, json
import numpy as np
from PIL import Image
CAP, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
VAR = [   # 폴더 · 이름 · 점 한 칸(화면 픽셀) · 키(칸) · 키(화면 픽셀) · 한 줄 설명
    ('old',     '옛 뭉툭',        '4픽셀',   '17칸', '70픽셀쯤', '빌드 70까지의 전사. 점이 가장 굵고 키가 작습니다.'),
    ('mid40',   '사이 40',        '2픽셀',   '40칸', '80픽셀',   '가장 작은 사이 값. 눈 · 손이 뭉개지기 시작합니다.'),
    ('mid44',   '사이 44',        '2픽셀',   '44칸', '88픽셀',   '가운데 사이 값.'),
    ('mid48',   '사이 48',        '2픽셀',   '48칸', '96픽셀',   '지금 전사와 키가 같습니다. 점만 굵어집니다.'),
    ('mid44bg', '사이 44 + 배경', '2픽셀',   '44칸', '88픽셀',   '풍경 · 구름까지 같은 굵기로 맞춘 판.'),
    ('now',     '지금',           '1.5픽셀', '64칸', '96픽셀',   '빌드 71. 점이 1픽셀 · 2픽셀로 번갈아 찍힙니다.'),
]
SOLO = (168, 244, 284, 372); FIGHT = (96, 160, 448, 400); WALK = (130, 180, 330, 400); MON = (150, 176, 478, 400)   # 무대 픽셀 (왼쪽 · 위 · 오른쪽 · 아래)
KEEP = os.environ.get('KEEP')   # 1이면 이미 있는 장 판(webp)은 다시 만들지 않는다 (무손실 압축이 3분쯤 걸린다)
NF, NW, COLS = 56, 32, 8
fr = lambda v, s, i, box: Image.open(f'{CAP}/{v}/{s}_{i}.png').convert('RGB').crop(box)
def sheet(v, s, n, box):
    w, h = box[2] - box[0], box[3] - box[1]; S = Image.new('RGB', (w * COLS, h * ((n + COLS - 1) // COLS)))
    for i in range(n): S.paste(fr(v, s, i, box), ((i % COLS) * w, (i // COLS) * h))
    return S
size = {}
for v, *_ in VAR:
    if v != 'mid44bg': fr(v, 'solo', 4, SOLO).save(f'{OUT}/solo_{v}.png', optimize=True)
    for tag, s, n, box in (('f', 'fight', NF, FIGHT), ('w', 'walk', NW, WALK)):
        p = f'{OUT}/{tag}_{v}.webp'
        if not (KEEP and os.path.exists(p)): sheet(v, s, n, box).save(p, 'WEBP', lossless=True, quality=100, method=6)
        size[os.path.basename(p)] = os.path.getsize(p) // 1024
for v in ('now', 'mid44', 'mid44bg'):
    a, b = fr(v, 'mons', 43, MON), fr(v, 'fight', 2, MON); S = Image.new('RGB', (a.width, a.height + b.height + 4), (21, 23, 28)); S.paste(a, (0, 0)); S.paste(b, (0, a.height + 4)); S.save(f'{OUT}/mon_{v}.png', optimize=True)
print('판 크기(KB)', size, '합', sum(size.values()))
html = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'page_mid.html'), encoding='utf-8').read()
html = html.replace('/*VAR*/[]', json.dumps([dict(id=v, name=n, dot=d, cells=k, px=x, note=c) for v, n, d, k, x, c in VAR], ensure_ascii=False))
html = html.replace('/*MON*/[]', json.dumps([MON[2] - MON[0], (MON[3] - MON[1]) * 2 + 4]))
html = html.replace('/*SCN*/{}', json.dumps({'fight': dict(tag='f', name='싸움', w=FIGHT[2] - FIGHT[0], h=FIGHT[3] - FIGHT[1], n=NF, cols=COLS, fps=15), 'walk': dict(tag='w', name='걷기', w=WALK[2] - WALK[0], h=WALK[3] - WALK[1], n=NW, cols=COLS, fps=15)}, ensure_ascii=False))
open(f'{OUT}/index.html', 'w', encoding='utf-8').write(html); print('index.html', len(html) // 1024, 'KB', sorted(os.listdir(OUT)))
