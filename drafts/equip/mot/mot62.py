"""채찍 · 정글칼 공격 동작 시안: 실제 view.js 길(events → 동작 · 효과)로 GIF · 장 띠 (render42.py에서)
python3 mot62.py [whip|machete]   CLOSE=1 → 가까이 4배"""
import sys, os, pathlib, base64, io
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
import war
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; W = D.parent
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
GROUPS = {
  'whip': [
    ('내려 후려치기 · 기본 공격 · 채찍질', {'cls': 'conestoga', 'wpn': 'whip', 'mk': 'wcrack'}),
    ('옆으로 후려치기', {'cls': 'conestoga', 'wpn': 'whip', 'mk': 'wside'}),
    ('올려 채기 · 올가미 채찍', {'cls': 'conestoga', 'wpn': 'whip', 'mk': 'wflick'}),
    ('머리 위로 돌려 치기 · 모든 적', {'cls': 'conestoga', 'wpn': 'whip', 'mk': 'wtwirl', 'foes': 3, 'all': 1}),
    ('채찍 치켜들기 · 강화(전속력)', {'cls': 'conestoga', 'wpn': 'whip', 'sid': 'gallop', 'cast': 1}),
    ('캐러밴마스터 · 치명타', {'cls': 'caravanmaster', 'wpn': 'whip', 'mk': 'wcrack', 'crit': 1}),
  ],
  'machete': [
    ('내려베기', {'cls': 'scout', 'wpn': 'machete', 'mk': 'down'}),
    ('올려베기', {'cls': 'scout', 'wpn': 'machete', 'mk': 'up'}),
    ('횡베기', {'cls': 'scout', 'wpn': 'machete', 'mk': 'side'}),
    ('난도질 · 덤불 쓸기', {'cls': 'scout', 'wpn': 'machete', 'mk': 'hack'}),
    ('덤불 베기 · 기습 베기', {'cls': 'scout', 'wpn': 'machete', 'mk': 'mchop'}),
    ('탐험가 · 덤불 베기 치명타', {'cls': 'pathfinder', 'wpn': 'machete', 'mk': 'mchop', 'crit': 1}),
  ],
}
PICK = {'whip': (0.08, 0.15, 0.21, 0.27, 0.34, 0.45), 'machete': (0.07, 0.12, 0.17, 0.23, 0.30, 0.41)}
CLOSE = os.environ.get('CLOSE') == '1'
CROP = [56, 128, 112, 76] if CLOSE else [20, 112, 220, 92]
Z, DT, DUR = (4 if CLOSE else 2), 0.04, 1.1
SUF = '_close' if CLOSE else ''
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def run(names):
    (D / '_cg1.js').write_text((W / 'cg1.js').read_text().replace('window.WAR_SHEET', 'window.WAR_SHEET_CG'))
    war.build(['rg1.js', 'rg2.js', 'tk1.js', 'tk2.js', 'mot/_cg1.js', 'mot/mot62.js', 'mot/motsheet62.js', 'mot/scene62.js'])
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto((W / 'war.html').as_uri()); pg.wait_for_timeout(300)
        taus = [round(-0.12 + i * DT, 3) for i in range(int((DUR + 0.12) / DT))]
        for gname in names:
            items = GROUPS[gname]; shots = []
            for ttl, r in items: shots.append([img(u) for u in pg.evaluate('([r, ts, z, cr]) => SC62_RUN(r, ts, z, cr)', [r, taus, Z, CROP])])
            cols = 3 if not CLOSE else 3; PW, PH = CROP[2] * Z, CROP[3] * Z; rows = (len(items) + cols - 1) // cols
            frames = []
            for k in range(len(taus)):
                im = Image.new('RGB', (cols * PW + (cols + 1) * 6, rows * (PH + 22) + 6), (21, 23, 28)); d = ImageDraw.Draw(im); d.fontmode = '1'
                for j, (ttl, r) in enumerate(items):
                    x, y = 6 + (j % cols) * (PW + 6), 6 + (j // cols) * (PH + 22)
                    d.text((x + 2, y), ttl, font=FB, fill=(240, 240, 240)); im.paste(shots[j][k], (x, y + 20))
                frames.append(im)
            sample = Image.new('RGB', (frames[0].width, frames[0].height * 8))
            for q, f0 in enumerate(frames[::max(1, len(frames) // 8)][:8]): sample.paste(f0, (0, q * frames[0].height))
            pal = sample.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
            qf = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
            qf[0].save(D / f'{gname}{SUF}.gif', save_all=True, append_images=qf[1:], duration=[250] + [40] * (len(qf) - 2) + [450], loop=0, disposal=1)
            pick = [min(range(len(taus)), key=lambda i: abs(taus[i] - tt)) for tt in PICK[gname]]
            st = Image.new('RGB', (len(pick) * (PW + 4) + 4, len(items) * (PH + 24) + 4), (21, 23, 28)); dd = ImageDraw.Draw(st); dd.fontmode = '1'
            for j, (ttl, r) in enumerate(items):
                y = 4 + j * (PH + 24); dd.text((6, y), ttl, font=FB, fill=(240, 220, 160))
                for i, k in enumerate(pick): st.paste(shots[j][k], (4 + i * (PW + 4), y + 20))
            st.save(D / f'{gname}{SUF}_frames.png')
            print(gname, len(frames), frames[0].size)
        print('errors', errs[:5]); b.close()
if __name__ == '__main__':
    run(sys.argv[1:] or list(GROUPS))
