"""ev83.py <js 파일> [js 파일 …] [--page page.html] — 훅 페이지에서 JS들을 이어 붙여 돌리고 결과(문자열)를 찍는다"""
import sys, json
from playwright.sync_api import sync_playwright
D = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v83/'
args = sys.argv[1:]; page = D + 'play_ev83.html'
if '--page' in args: i = args.index('--page'); page = args[i + 1]; args = args[:i] + args[i + 2:]
js = '\n;\n'.join(open(f, encoding='utf-8').read() for f in args)
def skip(pg):
    for _ in range(20):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + page); pg.wait_for_timeout(900)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
    pg.set_default_timeout(0)
    r = pg.evaluate("s => window.__EV(s)", js)
    print(r if isinstance(r, str) else json.dumps(r, ensure_ascii=False))
    if errs: print('PAGE ERRORS', errs[:5], file=sys.stderr)
    br.close()
