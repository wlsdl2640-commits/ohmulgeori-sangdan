"""시안 JSON 빠른 미리보기 (게임 굽기 아님 — 칸 하나 = z픽셀, 바깥 어두운 테): python3 prev.py <t/이름.json> <출력.png> [z=4] [키,…]
줄마다 시안 하나: 서 있기 g · g2 · gm 장들을 나란히. 모르는 글자는 분홍."""
import json, sys
from PIL import Image, ImageDraw, ImageFont

A = sys.argv[1:]
D = json.load(open(A[0]))['defs']; OUT = A[1]; Z = int(A[2]) if len(A) > 2 else 4
ONLY = A[3].split(',') if len(A) > 3 else None
FNT = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)


def hx(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def grid(txt):
    rows = txt.strip('\n').split('\n'); W = max(len(r) for r in rows)
    return [r.ljust(W, '.') for r in rows]


def draw(rows, pal):
    H, W = len(rows), len(rows[0])
    im = Image.new('RGBA', ((W + 2) * Z, (H + 2) * Z), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    at = lambda x, y: rows[y][x] if 0 <= y < H and 0 <= x < W else '.'
    for y in range(-1, H + 1):
        for x in range(-1, W + 1):
            ch = at(x, y)
            if ch != '.': col = hx(pal[ch]) if ch in pal else (255, 0, 255)
            elif any(at(x + a, y + b) != '.' for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))): col = (16, 12, 22)
            else: continue
            d.rectangle([(x + 1) * Z, (y + 1) * Z, (x + 2) * Z - 1, (y + 2) * Z - 1], fill=col + (255,))
    return im


rowsout = []
for k, e in D.items():
    if ONLY and k not in ONLY: continue
    fr = [('g', e['g'])] + ([('g2', e['g2'])] if 'g2' in e else []) + [(n, t) for n, t in (e.get('gm') or {}).items()]
    ims = [(n, draw(grid(t), e['pal'])) for n, t in fr]
    rowsout.append((k + ' ' + e.get('label', ''), ims))
W = max(sum(im.width + 12 for _, im in ims) for _, ims in rowsout) + 20
H = sum(max(im.height for _, im in ims) + 40 for _, ims in rowsout) + 10
S = Image.new('RGB', (W, H), (52, 54, 66)); d = ImageDraw.Draw(S); y = 6
for name, ims in rowsout:
    d.text((10, y), name, font=FNT, fill=(240, 230, 200)); x = 10; y += 22
    for n, im in ims:
        S.paste(im, (x, y), im); d.text((x, y + im.height - 2), n, font=FNT, fill=(150, 150, 170)); x += im.width + 12
    y += max(im.height for _, im in ims) + 18
S.save(OUT); print(OUT, S.size)
