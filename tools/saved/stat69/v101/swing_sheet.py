"""swing.py가 찍은 장으로 휘두르기 판을 만든다 — 내 확인, 시험 묶음 아님:
   python3 swing_sheet.py <swing.py 출력 폴더> <출력.png> [모험가 id] [간격 ms]
   첫 swing 사건(모험가 id를 주면 그 사람)부터 −1칸 ~ +12칸을 간격마다 가장 가까운 장으로 골라 전투 자리만 2배로 자른다."""
import json, sys, os
from PIL import Image, ImageDraw
D, OUT = sys.argv[1], sys.argv[2]
WHO = int(sys.argv[3]) if len(sys.argv) > 3 else None
STEP = int(sys.argv[4]) if len(sys.argv) > 4 else 150
T = json.load(open(os.path.join(D, 'times.json')))
LOG = json.load(open(os.path.join(D, 'log.json'))) if os.path.exists(os.path.join(D, 'log.json')) else None
if LOG is None:
    raise SystemExit('log.json 없음 — swing.py 끝의 print에서 log를 log.json으로 저장할 것')
sw = [x for x in LOG if x[0] == 'swing' and (WHO is None or x[1] == WHO)]
t0, who, w = sw[0][2], sw[0][1], sw[0][3]
hit = next((x[2] for x in LOG if x[0] == 'hit' and x[1] == who and x[2] >= t0), None)
pick = []
for k in range(-1, 13):
    i = min(range(len(T)), key=lambda j: abs(T[j] - (t0 + k * STEP)))
    pick.append((i, T[i] - t0))
BOX, Z = (40, 200, 300, 314), 2
fw, fh = (BOX[2] - BOX[0]) * Z, (BOX[3] - BOX[1]) * Z
cols = 4; rows = (len(pick) + cols - 1) // cols
sheet = Image.new('RGB', (fw * cols, fh * rows), (0, 0, 0))
dr = ImageDraw.Draw(sheet)
for n, (i, dt) in enumerate(pick):
    im = Image.open(os.path.join(D, f'f{i:03d}.png')).convert('RGB').crop(BOX).resize((fw, fh), Image.NEAREST)
    x, y = (n % cols) * fw, (n // cols) * fh
    sheet.paste(im, (x, y))
    tag = f'{dt:+d}ms'
    if hit is not None and abs(T[i] - hit) <= STEP / 2: tag += '  hit'
    dr.rectangle([x, y, x + 8 + 7 * len(tag), y + 14], fill=(0, 0, 0))
    dr.text((x + 4, y + 2), tag, fill=(255, 220, 90))
sheet.save(OUT)
print({'who': who, 'w': w, 't0': t0, 'hit': hit, 'hit_dt': None if hit is None else hit - t0, 'frames': [p[0] for p in pick]})
