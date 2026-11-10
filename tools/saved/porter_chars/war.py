"""전사 리모델링 시안판: 게임 src(빌드 순서)를 IIFE로 묶고 시안 js를 덧붙여 그림을 찍는다.
python3 war.py 시안.js 출력.png [js 식]  — 시안 js 끝의 window.WAR_SHEET()가 dataURL을 돌려준다
"""
import base64, os, pathlib, re, sys
from playwright.sync_api import sync_playwright
T = pathlib.Path(__file__).parent
GAME = pathlib.Path(os.environ.get('GAME', '/home/claude/game62'))


def build(drafts):
    order = re.search(r"JS = \[(.*?)\]", (GAME / 'build.py').read_text()).group(1)
    files = [f.strip().strip("'") for f in order.split(',') if f.strip()]
    js = "const BUILD_NO = 62, REPO = 'x';\n" + '\n'.join((GAME / 'src' / f).read_text(encoding='utf-8') for f in files)
    for d in drafts: js += '\n' + (T / d).read_text(encoding='utf-8')
    js += "\nwindow.W = (src) => eval(src);\n"
    faces = ''
    for file, weight in [('Galmuri11.woff2', 400), ('Galmuri11-Bold.woff2', 700)]:
        b64 = base64.b64encode((GAME / 'fonts' / file).read_bytes()).decode()
        faces += '@font-face{font-family:"Galmuri11";font-weight:%d;font-style:normal;src:url(data:font/woff2;base64,%s) format("woff2")}\n' % (weight, b64)
    css = (GAME / 'src' / 'style.css').read_text(encoding='utf-8')
    html = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>war</title><style>' + faces + css + '</style></head><body>' + \
        (GAME / 'src' / 'markup.html').read_text(encoding='utf-8') + "\n<script>\n(() => {\n'use strict';\n" + js + "\n})();\n</script></body></html>"
    (T / 'war.html').write_text(html, encoding='utf-8')


if __name__ == '__main__':
    drafts = [x for x in sys.argv[1:] if x.endswith('.js')]
    outs = [x for x in sys.argv[1:] if x.endswith('.png')]
    build(drafts)
    with sync_playwright() as pw:
        b = pw.chromium.launch(); page = b.new_page(viewport={'width': 600, 'height': 800})
        errs = []; page.on('pageerror', lambda e: errs.append(str(e)))
        page.goto((T / 'war.html').as_uri()); page.wait_for_timeout(500)
        page.evaluate("document.fonts.ready")
        urls = page.evaluate("W('WAR_SHEET()')")
        if isinstance(urls, str): urls = [urls]
        for o, u in zip(outs, urls): (T / o).write_bytes(base64.b64decode(u.split(',')[1])); print(o)
        print('errors', errs[:5]); b.close()
