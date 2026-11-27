"""점토 협곡 동작 검수용 움직이는 판 두 장 — python review78/mkgif.py (anim77 폴더에서)
   canyon_all.gif = 13마리 × 가만히 · 걷기 · 공격(다시 뽑은 것은 자동으로 고른 새 것)
   canyon_fix.gif = 다시 뽑은 10개: 예전 | 새 1(s11) | 새 2(s12) — 자동으로 고른 쪽에 금테"""
import os, json
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
P = json.load(open('pick.json', encoding='utf-8'))
NAME = {'jawlizard': '턱도마뱀', 'wedgebeetle': '쐐기 딱정벌레', 'flatbug': '납작 판벌레', 'pooltoad': '웅덩이 두꺼비', 'canyonbat': '협곡 박쥐',
        'barrelwasp': '토관 말벌', 'hornbug': '뿔 물방개', 'otter': '둑 수달', 'earwig': '[보스] 수로 집게벌레', 'bigtoad': '[보스] 바위 두꺼비',
        'hawk': '[보스] 협곡 사냥매', 'bison': '[보스] 점토 들소', 'crab': '[보스] 수문 게'}
ROWS = ['idle', 'walk', 'atk']; RN = {'idle': '가만히', 'walk': '걷기', 'atk': '공격'}
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 15); F2 = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 12)
CELL = 128; BG = (26, 28, 36); CB = (40, 44, 56); GOLD = (240, 180, 60); INK = (236, 228, 208)


def seq(d):
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png')); ims = [Image.open(f'{d}/{f}').convert('RGBA') for f in fs]; bb = None
    for im in ims:
        b = im.getbbox()
        if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    ims = [im.crop(bb) for im in ims]; w, h = ims[0].size; s = min((CELL - 8) / w, (CELL - 8) / h)
    return [im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.NEAREST) for im in ims]


def src(mon, row):
    k = f'c_{mon}/{row}'
    if k in P: return f"clean/c_{mon}/{P[k]['pick']}", True
    return f'../anim76/clean/{mon}/{row}', False


def render(cells, cols, heads, labels, title, out, ticks=48):
    # cells[r][c] = (frames, gold)
    W = 190 + cols * (CELL + 8); H = 70 + len(cells) * (CELL + 8); outf = []
    for t in range(ticks):
        im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im); d.text((14, 8), title, font=F, fill=GOLD)
        for c, h in enumerate(heads): d.text((190 + c * (CELL + 8) + 8, 40), h, font=F2, fill=INK)
        for r, row in enumerate(cells):
            y = 62 + r * (CELL + 8); d.text((14, y + CELL // 2 - 18), labels[r][0], font=F, fill=INK); d.text((14, y + CELL // 2 + 4), labels[r][1], font=F2, fill=(169, 176, 189))
            for c, cell in enumerate(row):
                if not cell: continue
                fr, gold = cell; x = 190 + c * (CELL + 8)
                d.rectangle([x, y, x + CELL - 1, y + CELL - 1], fill=CB, outline=GOLD if gold else CB, width=3)
                f = fr[t % len(fr)]; im.paste(f, (x + (CELL - f.width) // 2, y + CELL - 4 - f.height), f)
        outf.append(im)
    outf[0].save(out, save_all=True, append_images=outf[1:], duration=90, loop=0, optimize=True); print(out, im.size)


mons = list(NAME)
cells = [[(seq(src(m, r)[0]), src(m, r)[1]) for r in ROWS] for m in mons]
render(cells, 3, ['가만히', '걷기', '공격'], [(NAME[m], m) for m in mons], '점토 협곡 13마리 × 동작 3 = 39개  (금테 = 다시 뽑아 바꾼 것)', 'review78/canyon_all.gif')
fx = [k for k in P if k.startswith('c_')]; cells = []; labs = []
for k in fx:
    mon, row = k.split('/'); m = mon[2:]
    cells.append([(seq(f'../anim76/clean/{m}/{row}'), False)] + [(seq(f'clean/{mon}/{row}_{s}'), P[k]['pick'] == f'{row}_{s}') for s in ('s11', 's12')])
    labs.append((NAME[m], RN[row]))
render(cells, 3, ['예전(깨졌던 것)', '새 1', '새 2'], labs, '다시 뽑은 10개 — 금테 = 제가 고른 쪽', 'review78/canyon_fix.gif')
