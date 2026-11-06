"""한 직업의 동작 몇 개를 크게: python3 zoom42.py cls[:wpn] mk1,mk2 [Z]"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
harness.SRC = pathlib.Path('/home/claude/game42/src')
from playwright.sync_api import sync_playwright
from PIL import Image
T = pathlib.Path(__file__).parent
cls, *w = sys.argv[1].split(':'); mks = sys.argv[2].split(','); Z = int(sys.argv[3]) if len(sys.argv) > 3 else 8
r = {'cls': cls}
if w: r['wpn'] = w[0]
p = T / 'sheet42.html'; p.write_text(harness.build_html((T / 'sheet42.js').read_text()), encoding='utf-8')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    u, info = pg.evaluate('([r, m, z]) => MS42(r, m, z)', [r, mks, Z]); b.close()
im = Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
out = T / f'zoom_{cls}_{"_".join(mks)}.png'; im.save(out); print(out, im.size, info['err'][:2], errs[:2])
