"""표창 문양 시안판: 큰 그림 + 실제 게임 레어도 칸(rarity.js rqArt)으로 일반~신화. python3 rogue_shuri_sheet.py <play.html> <출력.png>"""
import sys, io, base64, json
from PIL import Image
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rogue_shuri as SH
from playwright.sync_api import sync_playwright

src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
m = "(() => {\n'use strict';\n"
assert s.count(m) == 1
s = s.replace(m, m + "window.__RQ = () => ({ rqArt, keepCv });\n")
open('play_rq.html', 'w', encoding='utf-8').write(s)


def durl(cv):
    im = Image.new('RGBA', (20, 20), (0, 0, 0, 0))
    for (x, y), c in cv.px.items(): im.putpixel((x, y), tuple(c[:3]) + (255,))
    b = io.BytesIO(); im.save(b, 'PNG'); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


rows = [('지금', SH.CUR)] + list(SH.OPTS.items())
data = [{'k': k, 'name': o[0], 'desc': o[1], 'big': durl(SH.book(o, 3)), 'g': [durl(SH.book(o, g)) for g in range(6)]} for k, o in rows]
GN = ['일반', '고급', '희귀', '영웅', '전설', '신화']
JS = r"""async ([data, GN]) => {
  const RQ = window.__RQ();
  const css = document.createElement('style');
  css.textContent = `#shx{position:absolute;left:0;top:0;z-index:99999;width:900px;padding:18px 22px 22px;background:#13161e;color:#ece4d0;font-family:var(--font);}
  #shx h1{font-size:19px;color:#f0b43c;margin:0 0 4px;font-weight:700} #shx .sub{font-size:12px;color:#a9b0bd;margin:0 0 14px;line-height:1.5}
  #shx .row{display:flex;align-items:center;gap:16px;padding:10px 0;border-top:1px solid #262b38}
  #shx .big{width:160px;height:160px;image-rendering:pixelated;background:#0c0e14;flex:none}
  #shx .info{width:190px;flex:none} #shx .info b{display:block;font-size:15px;margin-bottom:4px} #shx .info b i{color:#f0b43c;font-style:normal;margin-right:6px}
  #shx .info span{font-size:12px;color:#a9b0bd;line-height:1.5}
  #shx .cells{display:flex;gap:6px} #shx .cells div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;color:#a9b0bd}
  #shx .rqa.holo{animation-play-state:paused;animation-delay:-0.75s}
  #shx .row.cur{opacity:.8}`;
  document.head.appendChild(css);
  const box = document.createElement('div'); box.id = 'shx';
  let h = `<h1>도적 스킬북 문양 — 표창 시안 (게임에는 아직 안 넣음)</h1><div class="sub">표창은 거울 대칭만 · 바람개비 꼴 · 위아래좌우 십자 꼴은 쓰지 않음. 왼쪽 큰 그림은 영웅 띠, 오른쪽은 실제 창고 칸(52px) — 띠 색 = 레어도, 영웅부터 홀로그램 빛(한 장면 멈춤)</div>`;
  for (const d of data) {
    const cells = [];
    for (let g = 0; g < 6; g++) {
      const img = new Image(); img.src = d.g[g]; await img.decode();
      const c = document.createElement('canvas'); c.width = 20; c.height = 20; c.getContext('2d').drawImage(img, 0, 0);
      cells.push(`<div>${RQ.rqArt(RQ.keepCv(c), g, 2, 0)}${GN[g]}</div>`);
    }
    h += `<div class="row${d.k === '지금' ? ' cur' : ''}"><img class="big" src="${d.big}"><div class="info"><b>${d.k === '지금' ? '' : `<i>${d.k}</i>`}${d.name}</b><span>${d.desc}</span></div><div class="cells">${cells.join('')}</div></div>`;
  }
  box.innerHTML = h; document.body.appendChild(box);
  await new Promise(r => setTimeout(r, 300));
  return box.getBoundingClientRect().height;
}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 944, 'height': 1200}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + __import__('os').path.abspath('play_rq.html')); pg.wait_for_timeout(1500)
    hgt = pg.evaluate(JS, [data, GN])
    pg.set_viewport_size({'width': 944, 'height': int(hgt) + 10})
    pg.locator('#shx').screenshot(path=out)
    print('errors:', errs[:3]); b.close()
print(out)
