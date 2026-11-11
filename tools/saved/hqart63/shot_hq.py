"""본부 상점 장면 시안 찍기: 지금 · A(물건 그림) · A+L(도트 빛) × 낮 · 밤"""
import json, pathlib
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = pathlib.Path(__file__).parent
URL = 'file://' + str(HERE / 'dist/play.html')
KEY = 'paros-sangdan:v1'
OUT = HERE / 'shots'; OUT.mkdir(exist_ok=True)


def skip(pg, n=14):
    for _ in range(n):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(150); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150); continue
        break


SETUP = r"""
((dp) => {
  const S = JSON.parse(localStorage.getItem('%s'));
  S.bld.shop = 5; S.gold = 50000;
  const sl = S.shop.slots.filter(Boolean);
  const items = ['herb', 'pot_s', 'wolf_pelt', 'rat_tail', 'slime_jelly', 'pot_m', 'iron_ore'];
  for (let i = 0; i < 7; i++) { S.shop.slots[i] = { item: items[i], tier: i %% 3, tm: 0 }; S.inv[items[i]] = 5 + i; }
  S.t = Math.floor(S.t / 180) * 180 + 180 + dp * 180;
  S.flags.wh63 = 1; S.flags.v63b = 1; S.flags.v63 = 1;
  return JSON.stringify(S);
})
""" % KEY


def shot(b, variant, dp, name):
    ctx = b.new_context(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script(f"window.HQD = {json.dumps(variant)};")
    pg.goto(URL); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
    for _ in range(20):
        if pg.evaluate(f"() => !!localStorage.getItem('{KEY}')"): break
        pg.wait_for_timeout(250)
    save = pg.evaluate(SETUP + f"({dp})")
    pg.add_init_script(f"localStorage.setItem({json.dumps(KEY)}, {json.dumps(save)});")
    pg.reload(); pg.wait_for_timeout(1300); skip(pg)
    # 상점으로
    for _ in range(20):
        if pg.locator('#placebar .ptab[data-pwin="shop"]').count(): break
        if pg.locator('#placebar .pnav.prev[disabled]').count(): break
        pg.click('#placebar .pnav.prev'); pg.wait_for_timeout(420)
    for _ in range(20):
        if pg.locator('#placebar .ptab[data-pwin="shop"]').count(): break
        pg.click('#placebar .pnav.next'); pg.wait_for_timeout(420)
    pg.wait_for_timeout(900)
    bb = pg.locator('#hq').bounding_box()
    pg.screenshot(path=str(OUT / f'{name}.png'), clip=bb)
    print(name, bb, errs[:3])
    ctx.close()


with sync_playwright() as pw:
    b = pw.chromium.launch()
    for variant, vn in (('', 'cur'), ('A', 'A'), ('AL', 'AL')):
        for dp, dn in ((0.5, 'day'), (0.92, 'night')):
            shot(b, variant, dp, f'{vn}_{dn}')
    b.close()
