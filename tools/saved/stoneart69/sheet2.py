"""마석 시안 2 판: 큰 그림 + 실제 게임 영웅 칸(rarity.js rqArt, 홀로그램 세 장면) + 창고 칸 한 줄.
python3 sheet2.py <훅 페이지 play.html (window.__EV)> <출력.png>"""
import base64
import io
import os
import sys
from PIL import Image
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import maseok2 as M   # noqa: E402

src, out = sys.argv[1], sys.argv[2]


def durl(px, z=1):
    im = Image.new('RGBA', (20, 20), (0, 0, 0, 0))
    for (x, y), c in px.items():
        if 0 <= x < 20 and 0 <= y < 20: im.putpixel((x, y), tuple(c[:3]) + (255,))
    if z > 1: im = im.resize((20 * z, 20 * z), Image.NEAREST)
    b = io.BytesIO(); im.save(b, 'PNG'); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


data = []
for i, st in enumerate(M.STONES):
    px = M.icon(i)
    data.append({'name': st[2], 'kind': st[3], 'eff': st[4], 'cap': st[5], 'px': durl(px), 'big': durl(px, 8)})

JS = r"""async (data) => {
  const RQ = window.__EV('({ rqArt, keepCv })');
  const css = document.createElement('style');
  css.textContent = `#shx{position:absolute;left:0;top:0;z-index:99999;width:980px;padding:18px 22px 22px;background:#15171c;color:#ece4d0;font-family:var(--font);}
  #shx h1{font-size:19px;color:#f0b43c;margin:0 0 4px;font-weight:700} #shx .sub{font-size:12.5px;color:#a9b0bd;margin:0 0 12px;line-height:1.55}
  #shx .row{display:flex;align-items:center;gap:16px;padding:8px 0;border-top:1px solid #262b38}
  #shx .big{width:160px;height:160px;image-rendering:pixelated;background:#221f28;flex:none}
  #shx .info{width:330px;flex:none} #shx .info b{display:block;font-size:16px;margin-bottom:3px} #shx .info em{font-style:normal;color:#c8a0ff;font-size:12px;margin-left:6px}
  #shx .info .e{font-size:13.5px;color:#ece4d0;line-height:1.5} #shx .info .c{font-size:12px;color:#a9b0bd;margin-top:2px}
  #shx .cells{display:flex;gap:10px} #shx .cells div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;color:#a9b0bd}
  #shx .cells .rqa.holo{animation-play-state:paused}
  #shx .grid{display:flex;gap:2px;padding:10px;background:#1d1a22;width:max-content;margin-top:6px}
  #shx .grid .rqa.holo{animation-play-state:paused;animation-delay:-0.6s}
  #shx h2{font-size:14px;color:#f0b43c;margin:14px 0 2px}`;
  document.head.appendChild(css);
  const box = document.createElement('div'); box.id = 'shx';
  const cv = async u => { const img = new Image(); img.src = u; await img.decode(); const c = document.createElement('canvas'); c.width = 20; c.height = 20; c.getContext('2d').drawImage(img, 0, 0); return RQ.keepCv(c); };
  let h = `<h1>마석 시안 2 — 큼지막한 보석 · 등급 하나(영웅) · 호박 속 발톱</h1><div class="sub">시안 1의 깎기 여덟을 그대로 두고 크게(지름 15~17칸). 등급이 없어 마석은 늘 영웅 칸(보라 테 · 홀로그램 빛). 장비마다 마석 칸 셋 · 여러 장비에 박으면 효과가 더해지고, 효과마다 합쳐서 상한(여섯 개 몫)까지. 효과 값은 제안 — 게임에는 아직 안 넣음.</div>`;
  const urls = [];
  for (const d of data) {
    const u = await cv(d.px); urls.push(u);
    const cells = [0, 0.6, 1.2].map((dl, j) => `<div><span style="display:block">${RQ.rqArt(u, 3, 2, 0).replace('class="rqa', `style="animation-delay:-${dl}s" class="rqa`)}</span>${['영웅 칸', '빛 지남', '빛 지남'][j]}</div>`).join('');
    h += `<div class="row"><img class="big" src="${d.big}"><div class="info"><b>${d.name}<em>${d.kind}</em></b><div class="e">한 개: ${d.eff}</div><div class="c">합쳐서 상한 ${d.cap}</div></div><div class="cells">${cells}</div></div>`;
  }
  h += `<h2>창고 칸에 놓으면</h2><div class="grid">${urls.map(u => RQ.rqArt(u, 3, 2, 0)).join('')}</div>`;
  box.innerHTML = h; document.body.appendChild(box);
  await new Promise(r => setTimeout(r, 400));
  return box.getBoundingClientRect().height;
}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1024, 'height': 1600}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(src)); pg.wait_for_timeout(1800)
    hgt = pg.evaluate(JS, data)
    pg.set_viewport_size({'width': 1024, 'height': int(hgt) + 10})
    pg.locator('#shx').screenshot(path=out)
    print(out, 'errors:', errs[:3]); b.close()
