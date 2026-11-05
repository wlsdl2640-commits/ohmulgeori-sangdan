"""전체 시안 모음: 모든 계열 파일의 ICONS를 모아 게임 스킬 id와 맞춰 보고, 계열별로 시트를 만든다.
python3 catalog.py [check]  → 빠진 것 / 남는 것 확인
python3 catalog.py pages    → sheet_01.png …"""
import sys, json, pathlib, importlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
MODS = ['w5', 'w9', 'c_archer', 'c_rogue', 'c_mage', 'c_cleric', 'c_porter', 'c_all', 'c_g1', 'c_g2', 'c_g3', 'c_g4', 'c_g5', 'c_g6', 'fix_a', 'fix_b', 'fix_c', 'fix_d', 'fix_e', 'fix_f']
def collect():
    out = {}
    for m in MODS:
        try: mod = importlib.import_module(m)
        except ModuleNotFoundError: continue
        for k, v in mod.ICONS.items():
            out[k] = v
    return out
SK = json.load(open(D / 'data' / 'skills.json'))
def check():
    ic = collect(); ids = [s['id'] for s in SK]
    miss = [i for i in ids if i not in ic]; extra = [k for k in ic if k not in ids]
    print('스킬', len(ids), '그림', len(ic), '빠짐', miss, '남음', extra)
    return ic
CLS_KO = json.load(open(D.parent / 'skicon' / 'clsnames.json')) if (D.parent / 'skicon' / 'clsnames.json').exists() else {}
CLS_KO['all'] = '공통'
def cls_name(c):
    return ' / '.join(CLS_KO.get(x, x) for x in c.split('/'))
def grouped():
    order = []
    for s in SK:
        if s['cls'] not in order: order.append(s['cls'])
    return [s for c in order for s in SK if s['cls'] == c]
def pages(per_page=48, per_row=8):
    from PIL import Image, ImageDraw, ImageFont
    import cell
    ic = collect()
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16, index=2)
    groups = []
    for s in SK:
        if not groups or groups[-1][0] != s['cls']: groups.append((s['cls'], []))
        groups[-1][1].append(s['id'])
    # 줄 단위로 쌓기: 계열 머리줄 + 아이콘 줄들
    blocks = []
    for c, ids in groups:
        blocks.append(('head', cls_name(c) + f'  ({len(ids)})'))
        for i in range(0, len(ids), per_row): blocks.append(('row', ids[i:i + per_row]))
    CW, RH, HH = 156, 172, 30
    pg, cur, h, n = [], [], 0, 0
    for b in blocks:
        bh = HH if b[0] == 'head' else RH
        if h + bh > 1500 and cur and b[0] == 'head':
            pg.append(cur); cur, h = [], 0
        cur.append(b); h += bh
    if cur: pg.append(cur)
    files = []
    for pi, bl in enumerate(pg):
        H_ = sum(HH if b[0] == 'head' else RH for b in bl) + 10
        sh = Image.new('RGB', (per_row * CW + 12, H_), (21, 23, 28)); dr = ImageDraw.Draw(sh); y = 6
        for b in bl:
            if b[0] == 'head':
                dr.text((10, y + 4), b[1], font=fb, fill=(242, 190, 60)); y += HH; continue
            for j, sid in enumerate(b[1]):
                name, kind, fn = ic[sid]; art, _ = fn(); im = art.img(kind)
                x0 = 8 + j * CW; z3 = cell.zoom(im, 3); sh.paste(z3, (x0, y), z3)
                dr.text((x0 + 2, y + 146), name, font=f, fill=(225, 225, 225))
            y += RH
        p = D / f'sheet_{pi + 1:02d}.png'; sh.save(p); files.append(p.name)
    print(files)
if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'pages': pages()
    else: check()
def pages2(per_row=8, rows_per_page=8):
    """빈칸 없이 이어서: 계열이 바뀌는 칸 위에 계열 이름"""
    from PIL import Image, ImageDraw, ImageFont
    import cell
    ic = collect()
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 14, index=2)
    seq = []; prev = None
    for s in grouped():
        seq.append((s['id'], cls_name(s['cls']) if s['cls'] != prev else None)); prev = s['cls']
    CW, RH = 156, 190; per = per_row * rows_per_page; files = []
    for pi in range(0, len(seq), per):
        chunk = seq[pi:pi + per]; nr = (len(chunk) + per_row - 1) // per_row
        sh = Image.new('RGB', (per_row * CW + 12, nr * RH + 10), (21, 23, 28)); dr = ImageDraw.Draw(sh)
        for i, (sid, tag) in enumerate(chunk):
            x0 = 8 + (i % per_row) * CW; y0 = 6 + (i // per_row) * RH
            if tag:
                dr.rectangle([x0 - 4, y0, x0 - 2, y0 + 184], fill=(242, 190, 60))
                dr.text((x0 + 2, y0 - 1), tag, font=fb, fill=(242, 190, 60))
            name, kind, fn = ic[sid]; art, _ = fn(); im = art.img(kind)
            z3 = cell.zoom(im, 3); sh.paste(z3, (x0, y0 + 18), z3)
            dr.text((x0 + 2, y0 + 164), name, font=f, fill=(225, 225, 225))
        p = D / f'sheet_{pi // per + 1:02d}.png'; sh.save(p); files.append(p.name)
    print(files)
if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'pages2': pages2()
