import sys, pathlib
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
from harness import build_html
from playwright.sync_api import sync_playwright
T = pathlib.Path(__file__).parent
p = T / 'probe2.html'; p.write_text(build_html((T / 'anim.js').read_text()), encoding='utf-8')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    for cls, legs in [('warrior', 'stand'), ('warrior', 'walkA'), ('knight', 'stand'), ('gladiator', 'stand')]:
        r = pg.evaluate('([c, l]) => AN_PROBE(c, l)', [cls, legs]); print(cls, legs)
        print('   ' + ''.join(str(i % 10) for i in range(20)))
        print('\n'.join('%2d %s' % (i, row) for i, row in enumerate(r) if i >= 8))
    print('errors', errs[:3]); b.close()
