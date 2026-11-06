"""빌드 38 성기사 방패: 뭉툭 격자 찍기 + 그림"""
import sys, pathlib, base64
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
from playwright.sync_api import sync_playwright
T = pathlib.Path(__file__).parent
harness.SRC = pathlib.Path('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v39/old38/src')
js = """
window.GR = (cls, view) => { if (!S) S = blankState();
  const a = makeAdv({ cls, lv: 60 }); a.id = 3; a.look = { hair: '#5a3a22', skin: '#e0ac7e' }; if (a.eq) a.eq.off = null;
  const g = view === 'side' ? pxsAdvGrid(a, 'idle', 0) : pxAdvGrid(a, 'idle', 0); const c = pxChunk(g);
  const L = advLook(a), pal = Object.assign(pxPal(L, a.look));
  return { chunk: c.map(r => r.join('')), pal };
};
window.PIC = (cls, Z) => { if (!S) S = blankState();
  const a = makeAdv({ cls, lv: 60 }); a.id = 3; a.look = { hair: '#5a3a22', skin: '#e0ac7e' }; if (a.eq) a.eq.off = null;
  const c = document.createElement('canvas'); c.width = 60 * Z; c.height = 30 * Z; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#3a3430'; g.fillRect(0, 0, c.width, c.height);
  [pxAdvSprite(a, 'idle', 0), pxsAdvSprite(a, 'idle', 0), pxsAdvSprite(a, 'atk', 0)].forEach((s, i) => g.drawImage(s.cv, 0, 0, s.w, s.h, (12 + i * 18) * Z - s.ax * Z / 2, 26 * Z - s.ay * Z / 2, s.w * Z / 2, s.h * Z / 2));
  return c.toDataURL();
};
"""
p = T / 'old38.html'; p.write_text(harness.build_html(js), encoding='utf-8')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    for v in ['side', 'front']:
        r = pg.evaluate('([c, v]) => GR(c, v)', ['paladin', v]); print(v)
        print('\n'.join('%2d %s' % (i, row) for i, row in enumerate(r['chunk']) if i >= 6))
    print({k: r['pal'][k] for k in 'NnMZzGgo'})
    d = pg.evaluate('PIC("paladin", 8)'); (T / 'old38_paladin.png').write_bytes(base64.b64decode(d.split(',')[1]))
    print('errors', errs[:3]); b.close()
