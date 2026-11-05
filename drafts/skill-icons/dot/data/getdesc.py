import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent.parent / 'sky31'))
from harness import build_html
from playwright.sync_api import sync_playwright
html = build_html()
p = pathlib.Path('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/dot/data/page.html'); p.write_text(html)
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page()
    pg.goto('file://' + str(p))
    out = pg.evaluate('''() => { const S = G.D.SKILLS; return Object.keys(S).map(k => { const s = S[k]; return {id: k, name: s.name, desc: s.desc || '', cls: (s.cls||[]).join('/'), kind: s.kind || '', el: s.el || '', fx: s.fx || '', tgt: s.tgt || '', stat: s.stat || '', passive: s.passive ? 1 : 0, awk: s.awk || 0, lv: s.lv || 0, sta: s.sta ? s.sta.k : '', hits: s.hits || 1}; }); }''')
    b.close()
json.dump(out, open(pathlib.Path(__file__).parent / 'skills.json', 'w'), ensure_ascii=False, indent=0)
print(len(out))
