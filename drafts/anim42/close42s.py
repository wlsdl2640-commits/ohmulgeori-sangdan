"""스킬 하나를 크게 (시간 띠): python3 close42s.py sid cls [t1,t2,...]"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
harness.SRC = pathlib.Path('/home/claude/game42/src')
from playwright.sync_api import sync_playwright
from PIL import Image
T = pathlib.Path(__file__).parent
sid, cls = sys.argv[1], sys.argv[2]
ts = [float(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else [0.1, 0.25, 0.35, 0.45, 0.55, 0.7, 0.9, 1.1]
CROP = [60, 100, 180, 104]; Z = 3
p = T / 'scene42s.html'; p.write_text(harness.build_html((T / 'scene42s.js').read_text()), encoding='utf-8')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    taus = sorted(set([round(-0.12 + i * 0.02, 3) for i in range(int(1.4 / 0.02))] + ts))
    us = pg.evaluate('([i, c, w, ts, z, cr]) => SS_RUN(i, c, w, ts, z, cr)', [sid, cls, None, taus, Z, CROP]); b.close()
ims = {tt: Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB') for tt, u in zip(taus, us)}
W, H = CROP[2] * Z, CROP[3] * Z; cols = 4; rows = (len(ts) + cols - 1) // cols
out = Image.new('RGB', (cols * (W + 4), rows * (H + 4)), (20, 20, 24))
for j, tt in enumerate(ts): out.paste(ims[tt], ((j % cols) * (W + 4), (j // cols) * (H + 4)))
out.save(T / f'close_{sid}.png'); print('saved', out.size, errs[:3])
