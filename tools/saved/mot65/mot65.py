"""새 무기 손에 든 모습 · 동작 시안 판 · GIF — python3 mot65.py <출력 폴더> (게임 dist/play.html 위에서 돈다)"""
import base64, io, json, pathlib, sys
from PIL import Image
from playwright.sync_api import sync_playwright
D = pathlib.Path(__file__).parent; OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
h = (D / '../../../dist/play.html').resolve().read_text(encoding='utf-8')
BOOT = "if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();\n"
assert h.count(BOOT) == 1
hook = OUT / '_play.html'; hook.write_text(h.replace(BOOT, BOOT + "window.__EV = s => eval(s);\n"), encoding='utf-8')
code = '\n'.join((D / f).read_text(encoding='utf-8') for f in ('_w62.js', 'mot65.js', 'sheet65.js'))
SHEETS = [
  ('M65_whip.png', '채찍 (마부 · 코네스토가 · 캐러밴 마스터) — 11-11 시안 그대로', [['내려 후려치기', 'conestoga', 'whip', 'wcrack'], ['옆으로 후려치기', 'coachman', 'whip', 'wside'], ['올려 채기', 'conestoga', 'whip', 'wflick'], ['머리 위로 돌려 치기', 'caravanmaster', 'whip', 'wtwirl'], ['채찍 치켜들기', 'coachman', 'whip', 'wraise']]),
  ('M65_machete.png', '정글칼 (정찰가 · 탐험가) — 11-11 시안 그대로', [['내려베기', 'scout', 'machete', 'down'], ['올려베기', 'scout', 'machete', 'up'], ['횡베기', 'pathfinder', 'machete', 'side'], ['난도질', 'scout', 'machete', 'hack'], ['덤불 베기', 'pathfinder', 'machete', 'mchop']]),
  ('M65_card.png', '트럼프 카드 (소매치기 · 괴도 · 대도) — 새 동작', [['카드 던지기', 'treasure', 'card', 'cflick'], ['카드 부채', 'phantomthief', 'card', 'cfan'], ['카드 펼쳐 보이기', 'masterthief', 'card', 'cshow']]),
  ('M65_wand.png', '완드 (정령술사 · 정령왕) — 새 동작', [['완드 겨눠 쏘기', 'elementalist', 'wand', 'vflick'], ['원 그려 쏘기', 'elementlord', 'wand', 'vswirl'], ['완드 치켜들기', 'elementalist', 'wand', 'vraise']]),
  ('M65_orb.png', '오브 (원소술사 · 연금술사) — 새 동작', [['오브 밀어 쏘기', 'elemancer', 'orb', 'opush'], ['오브 들어 올리기', 'alchemist', 'orb', 'olift'], ['오브 돌리기', 'elemancer', 'orb', 'ospin']]),
  ('M65_necro.png', '네크로노미콘 (네크로맨서 · 리치) — 새 동작', [['책 펼쳐 주문', 'necromancer', 'necro', 'bkcast'], ['책 높이 들기', 'lich', 'necro', 'bkraise'], ['책 덮어 내리치기', 'necromancer', 'necro', 'bkshut']]),
]
GIF = [['coachman', 'whip', ['wcrack', 'wside', 'wtwirl'], '채찍'], ['scout', 'machete', ['down', 'side', 'mchop'], '정글칼'], ['treasure', 'card', ['cflick', 'cfan', 'cshow'], '카드'],
       ['elementalist', 'wand', ['vflick', 'vswirl', 'vraise'], '완드'], ['elemancer', 'orb', ['opush', 'olift', 'ospin'], '오브'], ['necromancer', 'necro', ['bkcast', 'bkraise', 'bkshut'], '네크로노미콘']]
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(hook.as_uri()); pg.wait_for_timeout(700); pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1000)
    pg.evaluate("() => document.fonts.ready")
    print(pg.evaluate(f"() => {{ try {{ window.__EV({json.dumps(code)}); return 'loaded'; }} catch (e) {{ return 'ERR ' + e.stack; }} }}"))
    for fn, title, rows in SHEETS:
        u = pg.evaluate("([t, r]) => window.M65_SHEET(t, r, 3)", [title, rows]); (OUT / fn).write_bytes(base64.b64decode(u.split(',')[1])); print(fn)
    fr = pg.evaluate("([l]) => window.M65_GIF(l, 3)", [GIF])
    ims = [Image.open(io.BytesIO(base64.b64decode(f['u'].split(',')[1]))).convert('RGB') for f in fr]
    pal = [im.quantize(colors=255, method=Image.Quantize.MEDIANCUT) for im in ims]
    pal[0].save(OUT / 'M65_all.gif', save_all=True, append_images=pal[1:], duration=[f['d'] for f in fr], loop=0, disposal=1)
    print('gif frames', len(fr), 'errors', errs[:5]); br.close()
