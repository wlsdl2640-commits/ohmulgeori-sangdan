"""한 동작을 크게 (python3 zoom.py down [warrior])"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
from harness import build_html
from playwright.sync_api import sync_playwright
from PIL import Image
T = pathlib.Path(__file__).parent
from render import RIGS, grab
mk = sys.argv[1]; r = RIGS[sys.argv[2] if len(sys.argv) > 2 else 'warrior']; Z = 9
p = T / 'anim.html'; p.write_text(build_html((T / 'anim.js').read_text()), encoding='utf-8')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    ims = [grab(pg, r, mk, -1)] + [grab(pg, r, mk, i) for i in range(8)]
    cw, ch = 32, 22
    out = Image.new('RGB', (5 * cw * Z, 2 * ch * Z), (0, 0, 0))
    for i, im in enumerate(ims[:10]):
        out.paste(im.crop((4, 6, 4 + cw, 6 + ch)).resize((cw * Z, ch * Z), Image.NEAREST), ((i % 5) * cw * Z, (i // 5) * ch * Z))
    out.save(T / f'z_{mk}.png'); print('errors', errs[:3]); b.close()
