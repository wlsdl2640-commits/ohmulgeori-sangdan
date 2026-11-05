"""시안 고르기 시트: 줄마다 스킬 이름 · 지금 그림 · 시안 1~4. python3 varsheet.py 모듈 출력이름 id,id,..."""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import catalog
from PIL import Image, ImageDraw, ImageFont
import importlib, cell
D = pathlib.Path(__file__).parent
mod = importlib.import_module(sys.argv[1]); outname = sys.argv[2]; ids = sys.argv[3].split(',')
ic = catalog.collect(); SK = {s['id']: s for s in catalog.SK}
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 15, index=2)
fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 17, index=2)
fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
Z = 3; IW = 48 * Z; LW = 150; CW = IW + 14; RH = IW + 30; PER = 6
for pi in range(0, len(ids), PER):
    chunk = ids[pi:pi + PER]
    sh = Image.new('RGB', (LW + CW * 5 + 20, len(chunk) * RH + 40), (21, 23, 28)); dr = ImageDraw.Draw(sh)
    dr.text((12, 8), '지금 그림 → 시안 1 · 2 · 3 · 4  (고를 번호를 알려 주세요)', font=f, fill=(242, 190, 60))
    for r, sid in enumerate(chunk):
        y0 = 38 + r * RH
        dr.text((12, y0 + 50), SK[sid]['name'], font=fb, fill=(240, 240, 240))
        dr.text((12, y0 + 76), SK[sid].get('desc', '')[:11], font=fs, fill=(160, 160, 170))
        dr.text((12, y0 + 94), SK[sid].get('desc', '')[11:22], font=fs, fill=(160, 160, 170))
        cells = [('지금', ic[sid])] + [(str(k), mod.ICONS[f'{sid}_{k}']) for k in range(1, 5)]
        for j, (lab, (name, kind, fn)) in enumerate(cells):
            art, _ = fn(); im = cell.zoom(art.img(SK[sid].get('kind') and kind or kind), Z)
            x0 = LW + j * CW
            sh.paste(im, (x0, y0), im)
            dr.text((x0 + IW // 2 - 8, y0 + IW + 4), lab, font=fb if j else f, fill=(242, 190, 60) if j else (170, 170, 180))
        if r < len(chunk) - 1: dr.line([(10, y0 + RH - 6), (sh.width - 10, y0 + RH - 6)], fill=(44, 46, 54))
    p = D / f'{outname}_{pi // PER + 1}.png'; sh.save(p); print(p.name, sh.size)
