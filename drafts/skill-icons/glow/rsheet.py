"""참고 느낌 시안 시트: A안(굵은 배경) · B안(고운 배경), 크게와 실제 크기."""
import sys, json, pathlib, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import rbg, b4, rpick
from art import PAL
from spec import SPEC
ICONS = {}
for m in ['n1', 'n2', 'n3', 'n4', 'n5', 'n6']: ICONS.update(getattr(importlib.import_module(m), m.upper()))
SK = {s['id']: s for s in json.load(open(D.parent / 'skills_dump.json'))}
CLS = json.load(open(D / 'clsnames.json')); CLS['all'] = '공용'
def kind(s): return 'none' if s['passive'] else s['kind']
def theme(sid): t = SPEC[sid][2]; return t if t in rbg.RAMP else 'none'
def make(sid, grid):
    rows, pal = ICONS[sid]; pips = 2 if sid == 'provoke' else 1 if sid == 'taunt' else 0
    g = b4.grid(rows); th, pat, same, dim = rpick.pick(sid, SK[sid], g, pal)
    # 상징과 배경이 같은 색 계열이면 배경을 어둡게 눌러 상징이 떠 보이게 (참고: 검붉은 빛살 위 주황 사람)
    return rbg.icon(g, PAL[pal], th, sid, kind(SK[sid]), pips, grid, 'orig' if same else 'ramp', 'k', pat, same and dim > 0, dim)
def sheet(ids, out, title, cols=3):
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2); fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
    CW, CH = 392, 112; rows = (len(ids) + cols - 1) // cols
    sh = Image.new('RGB', (cols * CW + 16, rows * CH + 70), (21, 23, 28)); dr = ImageDraw.Draw(sh)
    dr.text((10, 10), title, font=f, fill=(242, 190, 60))
    dr.text((10, 32), 'A안: 배경도 굵은 픽셀(2배)   B안: 배경은 고운 픽셀(1배)   — 각 칸: A 크게 · B 크게 · A 실제 · B 실제', font=fs, fill=(170, 170, 180))
    for i, sid in enumerate(ids):
        s = SK[sid]; x0 = 8 + (i % cols) * CW; y0 = 58 + (i // cols) * CH
        a, b = make(sid, 24), make(sid, 48)
        for j, im in enumerate((a, b)):
            big = im.resize((96, 96), Image.NEAREST); sh.paste(big, (x0 + j * 100, y0), big)
        sh.paste(a, (x0 + 204, y0 + 2), a); sh.paste(b, (x0 + 254, y0 + 2), b)
        dr.text((x0 + 206, y0 + 56), s['name'][:7], font=f, fill=(230, 230, 230))
        dr.text((x0 + 206, y0 + 78), '·'.join(CLS.get(c, c) for c in s['cls'].split('/'))[:9], font=fs, fill=(140, 140, 150))
    sh.save(out); return sh.size
if __name__ == '__main__':
    ids = sys.argv[1].split(',')
    print(sheet(ids, D / sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else '참고 그림 느낌 시안'))
