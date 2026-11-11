"""APK 앞 확인 그림 (시험 묶음 아님): 창고 장비 · 대장간 합성 · 도서관 합성 · 도감 등급 — 화면 오류만 본다"""
import json
from playwright.sync_api import sync_playwright
URL = 'file:///home/claude/game62/dist/play.html'; KEY = 'paros-sangdan:v1'
SETUP = r"""(() => { const S = JSON.parse(localStorage.getItem('%s'));
  S.rank = 4; S.gold = 9e7; Object.assign(S.bld, { smithy: 8, library: 3, tower: 1 }); let id = 990001;
  const add = (base, t, q, plus) => S.gear.push({ id: id++, base, t, q, bonus: null, runes: [], plus: plus || 0 });
  for (let i = 0; i < 9; i++) add('sword', 15, 7); add('robe', 15, 8, 10); add('ring', 12, 6); add('bow', 11, 5);
  Object.assign(S.inv, { book_shadow: 3, book_taunt: 9, bk_torn: 4 });
  S.seq = Math.max(S.seq, id + 10); Object.assign(S.flags, { wh63: 1, v63b: 1, v63: 1, v63c: 1 }); return JSON.stringify(S); })()""" % KEY
def skip(pg):
    for _ in range(14):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(150); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150); continue
        break
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(900)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1300); skip(pg)
    for _ in range(20):
        if pg.evaluate(f"() => !!localStorage.getItem('{KEY}')"): break
        pg.wait_for_timeout(300)
    save = pg.evaluate(SETUP); pg.add_init_script(f"localStorage.setItem({json.dumps(KEY)}, {json.dumps(save)});")
    pg.reload(); pg.wait_for_timeout(1400); skip(pg)
    pg.click('#menu-btn'); pg.wait_for_timeout(250); pg.click('.mtile[data-open="inv"]'); pg.wait_for_timeout(400)
    pg.click('.tab[data-id="gear"]'); pg.wait_for_timeout(400); pg.screenshot(path='sm_inv.png')
    pg.click('#menu-btn'); pg.wait_for_timeout(250); pg.click('.mtile[data-open="fac"]'); pg.wait_for_timeout(400)
    pg.locator('[data-act="bopen"][data-id="smithy"]').first.click(); pg.wait_for_timeout(400)
    pg.locator('button', has_text='합성').first.click(); pg.wait_for_timeout(400)
    q7 = pg.locator('button.q7')
    print('우주 칩:', q7.count())
    if q7.count(): q7.first.click(); pg.wait_for_timeout(300)
    a = pg.locator('button', has_text='자동')
    if a.count(): a.first.click(); pg.wait_for_timeout(300)
    pg.screenshot(path='sm_fuse.png', full_page=True)
    pg.click('#menu-btn'); pg.wait_for_timeout(250); pg.click('.mtile[data-open="fac"]'); pg.wait_for_timeout(400)
    pg.locator('[data-act="bopen"][data-id="library"]').first.click(); pg.wait_for_timeout(500); pg.screenshot(path='sm_lib.png', full_page=True)
    print('page errors:', errs[:5]); b.close()
