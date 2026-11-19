"""마법사 1차를 GPT에 새로 부탁할 때 쓰는 묶음: 지금 그림(뭉툭 도트) · 화풍 기준(리마스터 전사 걷기 판) · 부탁 글 넷 → 페이지
   python3 magepage.py <run_m1 결과 폴더> <출력 폴더>
   · mage_now.png   지금 마법사 옆 · 앞 (16배 · 글자 없음) — GPT에 붙이는 그림
   · mage_all.png   지금 게임의 자세 · 지팡이 동작 전부 (이름표 있음 — 참고)
   · style_warrior_walk.png   리마스터 전사 걷기 판(../hd70/sheets/warrior1_walk.webp) — 화풍 · 크기 기준
   · index.html     그림마다 「크게 보기 · 저장」, 글마다 「복사」 (page_mage.html이 틀)
   부탁하는 법은 ../hd70/README.md 「GPT에 부탁하는 법」(전사 때 통한 것) + 11-20 줄이기(직업마다 판 넷 · 한 판에 두 줄 16장 · 작은 자세는 한 장씩)"""
import json, base64, io, sys, os
from PIL import Image, ImageDraw, ImageFont
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True); HERE = os.path.dirname(os.path.abspath(__file__))
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FB if b else FR, n, index=2)
BG, INK, SUB = (200, 204, 214), (26, 29, 37), (86, 93, 110)
img = lambda u: Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
look, mots = json.load(open(f'{SRC}/look.json')), json.load(open(f'{SRC}/mots.json'))
def put(S, s, X, Y, Z, dx=0):   # 닻(발)을 (X, Y)에
    im = img(s['u']); S.alpha_composite(im.resize((im.width * Z, im.height * Z), Image.NEAREST), (round(X + (dx - s['ax']) * Z), round(Y - s['ay'] * Z)))

# ── 1. 지금 마법사: 옆 · 앞 (GPT에 붙이는 그림 — 글자 없음) ──
Z = 16; S = Image.new('RGBA', (2 * 30 * Z + 3 * 40, 44 * Z + 80), BG + (255,))
put(S, look['side']['idle0'], 40 + 12 * Z, 40 + 41 * Z, Z); put(S, look['front']['idle0'], 80 + 30 * Z + 14 * Z, 40 + 41 * Z, Z)
S.convert('RGB').save(f'{OUT}/mage_now.png', optimize=True); now_size = S.size

# ── 2. 자세 · 동작 전부 (이름표) ──
POSE = [('idle0', '서 있기 1'), ('idle1', '서 있기 2'), ('walk0', '걷기 1'), ('walk1', '걷기 2'), ('walk2', '걷기 3'), ('walk3', '걷기 4'), ('sit0', '앉기'), ('sleep0', '자기'), ('down0', '쓰러짐')]
MOTN = {'spush': '앞으로 내밀기 (기본 공격 · 마법이 지팡이 끝에서 나간다)', 'sjab': '찌르기', 'spushup': '내밀었다가 위로 들기', 'sswing': '휘두르기', 'scharge': '높이 들어 모았다가 앞으로 (큰 마법)', 'sraise': '치켜들기 (강화 · 보호막)'}
Zp, Zm = 6, 4; CW = 44 * Zp; W = 40 + len(POSE) * CW; rows = [k for k in MOTN if k in mots['mk']]
H = 70 + 2 * (48 * Zp + 34) + 60 + len(rows) * (44 * Zm + 34) + 20
S = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(S)
d.text((20, 16), '지금 게임의 마법사 1차 — 자세와 지팡이 동작', font=fnt(26, True), fill=INK); y = 70
for view, name in (('side', '옆모습'), ('front', '앞모습')):
    d.text((20, y), name, font=fnt(18, True), fill=INK)
    for i, (k, lab) in enumerate(POSE):
        s = look[view].get(k)
        if view == 'front' and k == 'down0': continue      # 앞모습에는 쓰러진 그림이 없다
        if s and 'u' in s: put(S, s, 20 + i * CW + CW // 2, y + 28 + 42 * Zp, Zp); d.text((20 + i * CW + CW // 2, y + 30 + 43 * Zp), lab, font=fnt(15), fill=SUB, anchor='ma')
    y += 48 * Zp + 34
y += 10; d.text((20, y), '지팡이 동작 (8장씩 · 금색 테 = 맞히는 장)', font=fnt(18, True), fill=INK); y += 40
for k in rows:
    M = mots['mk'][k]; d.text((20, y), MOTN[k], font=fnt(15), fill=SUB)
    for f, s in enumerate(M['f']):
        X = 20 + f * 44 * Zm + 20 * Zm; put(S, s, X, y + 24 + 40 * Zm, Zm, s.get('dx', 0))
        if f == M['hit']: d.rectangle((X - 20 * Zm, y + 22, X + 22 * Zm, y + 26 + 41 * Zm), outline=(196, 140, 20), width=2)
    y += 44 * Zm + 34
S.convert('RGB').save(f'{OUT}/mage_all.png', optimize=True); all_size = S.size

# ── 3. 화풍 기준: 리마스터 전사 걷기 판 (받은 그대로) ──
st = Image.open(os.path.join(HERE, '..', 'hd70', 'sheets', 'warrior1_walk.webp')).convert('RGB'); st.save(f'{OUT}/style_warrior_walk.png', optimize=True)

html = open(os.path.join(HERE, 'page_mage.html'), encoding='utf-8').read()
html = html.replace('/*IMG*/{}', json.dumps({'now': list(now_size), 'all': list(all_size), 'style': list(st.size)}))
open(f'{OUT}/index.html', 'w', encoding='utf-8').write(html)
print('ok', now_size, all_size, st.size, {f: os.path.getsize(f'{OUT}/{f}') // 1024 for f in sorted(os.listdir(OUT))})
