"""빌드 42 동작 판 (실제 pxs.js): python3 sheet42.py [묶음]"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
harness.SRC = pathlib.Path('/home/claude/game42/src')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 14, index=2)
BOW = ['bshot', 'bfull', 'bdiag', 'brapid', 'bswing', 'braise']
POLE = ['pthrust', 'pup', 'plow', 'pswing', 'pjump', 'pspin', 'praise']
STAFF = ['spush', 'sjab', 'spushup', 'sswing', 'scharge', 'sraise']
DAG = ['down', 'up', 'side', 'thrust', 'hack']
HEAVY = ['down', 'up', 'side', 'smash']
LUTE = ['lstrum', 'lraise', 'lswing']
G = {
  'bow': [({'cls': 'archer'}, BOW), ({'cls': 'sniper'}, BOW)],
  'pole': [({'cls': 'dragoon'}, POLE), ({'cls': 'knight', 'wpn': 'trident'}, POLE[:4])],
  'staff': [({'cls': 'mage'}, STAFF), ({'cls': 'necromancer'}, STAFF[:3]), ({'cls': 'archbishop'}, STAFF[:3])],
  'dagger': [({'cls': 'rogue'}, DAG), ({'cls': 'assassin'}, DAG)],
  'heavy': [({'cls': 'berserker'}, HEAVY), ({'cls': 'cleric'}, HEAVY), ({'cls': 'porter'}, HEAVY), ({'cls': 'inquisitor'}, HEAVY), ({'cls': 'warrior', 'wpn': 'axe'}, HEAVY)],
  'lute': [({'cls': 'bard'}, LUTE)],
}
def run(names):
    p = T / 'sheet42.html'; p.write_text(harness.build_html((T / 'sheet42.js').read_text()), encoding='utf-8')
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(p.as_uri()); pg.wait_for_timeout(300)
        for nm in names:
            ims = []
            for r, mk in G[nm]:
                u, info = pg.evaluate('([r, m, z]) => MS42(r, m, z)', [r, mk, 4])
                if info['err']: print('ERR', r, info['err'][:3])
                im = Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
                lab = Image.new('RGB', (im.width, 24), (21, 23, 28)); d = ImageDraw.Draw(lab); d.fontmode = '1'
                d.text((6, 3), f"{r['cls']} · {info['wk']} ({info['fam']}) — " + ' / '.join(mk), font=FB, fill=(240, 220, 160))
                ims.append(lab); ims.append(im)
            H = sum(x.height for x in ims); out = Image.new('RGB', (max(x.width for x in ims), H)); y = 0
            for x in ims: out.paste(x, (0, y)); y += x.height
            out.save(T / f'sheet_{nm}.png'); print(nm, out.size)
        print('errors', errs[:3]); b.close()
if __name__ == '__main__':
    run(sys.argv[1:] or list(G))
