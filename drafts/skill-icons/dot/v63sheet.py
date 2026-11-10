"""빌드 63 후보 스킬 그림 판: python3 v63sheet.py [묶음 번호…] → v63_1.png …
묶음마다 3배 그림 + 이름 · 옛 그림이 있는 스킬(id 그대로 바뀐 그림)은 옆에 작게 옛 그림"""
import sys, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell, c_v63, catalog
from PIL import Image, ImageDraw, ImageFont
OLD = catalog.collect()
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
KIND = {'dmg': '공격', 'buff': '강화', 'heal': '회복', 'dot': '지속', 'none': '패시브', 'mdmg': '마법', 'taunt': '도발'}
PER, CW, RH = 6, 170, 196
def sheet(gi):
    title, keys = c_v63.GROUPS[gi]
    n = len(keys); rows = (n + PER - 1) // PER
    sh = Image.new('RGB', (PER * CW + 12, 36 + rows * RH + 6), (21, 23, 28)); dr = ImageDraw.Draw(sh)
    dr.text((8, 8), f'{title} — 새 스킬 그림 시안 ({n})', font=FB, fill=(240, 196, 90))
    for i, k in enumerate(keys):
        name, kind, fn = c_v63.ICONS[k]; art, _ = fn(); im = art.img(kind)
        x0 = 8 + (i % PER) * CW; y0 = 36 + (i // PER) * RH
        z3 = cell.zoom(im, 3); sh.paste(z3, (x0, y0), z3)
        if k in OLD:   # 옛 그림 (작게)
            o = OLD[k][2]()[0].img(OLD[k][1]); sh.paste(o, (x0 + 146, y0 + 4), o)
            dr.text((x0 + 146, y0 + 54), '옛', font=F, fill=(150, 140, 130))
        dr.text((x0 + 2, y0 + 148), name, font=FB, fill=(232, 228, 220))
        dr.text((x0 + 2, y0 + 168), f'{KIND.get(kind, kind)} · {k}', font=F, fill=(150, 145, 140))
    out = D / f'v63_{gi + 1}.png'; sh.save(out); print(out.name, sh.size)
if __name__ == '__main__':
    for g in (sys.argv[1:] or range(len(c_v63.GROUPS))): sheet(int(g) - 1 if isinstance(g, str) else g)
