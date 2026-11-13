"""마석 시안 3 판: 보석 여덟 × 네 갈래(A 마나가 끓는 · B 원석 · C 자연물 · D 마법진) — 큰 그림 + 실제 게임 영웅 칸(rarity.js rqArt, 홀로그램)
+ 갈래마다 창고 칸 한 줄. python3 sheet3.py <훅 페이지 play.html (window.__EV)> <출력.png>"""
import base64
import io
import os
import sys
from PIL import Image
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import maseok3 as M   # noqa: E402
import maseok2 as M2  # noqa: E402

src, out = sys.argv[1], sys.argv[2]


def durl(px, z=1):
    im = Image.new('RGBA', (20, 20), (0, 0, 0, 0))
    for (x, y), c in px.items():
        if 0 <= x < 20 and 0 <= y < 20: im.putpixel((x, y), tuple(c[:3]) + (255,))
    if z > 1: im = im.resize((20 * z, 20 * z), Image.NEAREST)
    b = io.BytesIO(); im.save(b, 'PNG'); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


rows = []
for st in M2.STONES:
    key = st[1]
    cells = []
    for v, vname, _ in M.VARS:
        px = M.icon(key, v)
        note = M.C_NOTE[key] if v == 'C' else M.B_NOTE[key] if v == 'B' else ''
        cells.append({'v': v, 'px': durl(px), 'big': durl(px, 6), 'note': note})
    rows.append({'name': st[2], 'kind': st[3], 'eff': st[4], 'cap': st[5], 'cells': cells})
vnames = [[v, n] for v, n, _ in M.VARS]

JS = r"""async ([rows, vnames]) => {
  const RQ = window.__EV('({ rqArt, keepCv })');
  const css = document.createElement('style');
  css.textContent = `#shx{position:absolute;left:0;top:0;z-index:99999;width:1240px;padding:18px 22px 22px;background:#15171c;color:#ece4d0;font-family:var(--font);}
  #shx h1{font-size:20px;color:#f0b43c;margin:0 0 4px;font-weight:700} #shx .sub{font-size:12.5px;color:#a9b0bd;margin:0 0 6px;line-height:1.55}
  #shx .vh{display:grid;grid-template-columns:200px repeat(4,1fr);gap:10px;margin:10px 0 2px;font-size:14px;font-weight:700;color:#f0b43c}
  #shx .vh small{display:block;font-size:11.5px;font-weight:400;color:#a9b0bd;margin-top:2px;line-height:1.4}
  #shx .row{display:grid;grid-template-columns:200px repeat(4,1fr);gap:10px;align-items:center;padding:8px 0;border-top:1px solid #262b38}
  #shx .info b{display:block;font-size:15px;margin-bottom:2px} #shx .info em{font-style:normal;color:#c8a0ff;font-size:12px}
  #shx .info .e{font-size:12px;color:#ece4d0;line-height:1.45;margin-top:3px} #shx .info .c{font-size:11.5px;color:#a9b0bd}
  #shx .vc{display:flex;align-items:center;gap:8px} #shx .vc img.big{width:120px;height:120px;image-rendering:pixelated;background:#221f28;flex:none}
  #shx .vc .cl{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10.5px;color:#a9b0bd;text-align:center;max-width:84px}
  #shx .rqa.holo{animation-play-state:paused}
  #shx h2{font-size:14px;color:#f0b43c;margin:16px 0 4px} #shx .grid{display:flex;gap:2px;padding:10px;background:#1d1a22;width:max-content;margin-top:4px}
  #shx .grid .rqa.holo{animation-play-state:paused;animation-delay:-0.6s} #shx .gl{display:flex;align-items:center;gap:12px;margin-top:6px} #shx .gl span{width:150px;font-size:12.5px}`;
  document.head.appendChild(css);
  const box = document.createElement('div'); box.id = 'shx';
  const cv = async u => { const img = new Image(); img.src = u; await img.decode(); const c = document.createElement('canvas'); c.width = 20; c.height = 20; c.getContext('2d').drawImage(img, 0, 0); return RQ.keepCv(c); };
  const VD = { A: '깎은 보석 속에서 빛이 끓고 위로 마나 불꽃이 피어오른다', B: '거친 돌덩이를 깨어 낸 창으로 보석이 보이고, 돌 틈으로 마나가 새어 나온다', C: '보석마다 어울리는 자연물과 하나로 — 깃털 · 얼음 기둥 · 용암석 · 거북 등딱지 · 암모나이트 · 조개 · 나뭇가지 · 뿌리', D: '발밑 마법진에서 피어오른 마나가 보석을 띄운다' };
  let h = `<h1>마석 시안 3 — 마나가 넘치는 보석 · 자연물과 섞기 · 네 갈래</h1><div class="sub">보석 여덟(이름 · 효과는 시안 2 그대로)마다 네 갈래. 모두 20×20 도트 · 등급 없이 늘 영웅 칸(보라 테 · 홀로그램 빛)이고, 칸마다 왼쪽은 크게(6배), 오른쪽은 실제 게임 창고 칸. 갈래를 하나 고르거나 보석마다 다른 갈래를 골라도 된다. 게임에는 아직 안 넣음.</div>`;
  h += `<div class="vh"><div></div>${vnames.map(([v, n]) => `<div>${v} ${n}<small>${VD[v]}</small></div>`).join('')}</div>`;
  const urls = { A: [], B: [], C: [], D: [] };
  for (const r of rows) {
    let cells = '';
    for (const c of r.cells) {
      const u = await cv(c.px); urls[c.v].push(u);
      cells += `<div class="vc"><img class="big" src="${c.big}"><div class="cl">${RQ.rqArt(u, 3, 2, 0)}<span>${c.v}${c.note ? ' · ' + c.note : ''}</span></div></div>`;
    }
    h += `<div class="row"><div class="info"><b>${r.name}</b><em>${r.kind}</em><div class="e">한 개: ${r.eff}</div><div class="c">합쳐서 상한 ${r.cap}</div></div>${cells}</div>`;
  }
  h += `<h2>창고 칸에 놓으면 (갈래마다)</h2>`;
  for (const [v, n] of vnames) h += `<div class="gl"><span>${v} ${n}</span><div class="grid">${urls[v].map(u => RQ.rqArt(u, 3, 2, 0)).join('')}</div></div>`;
  box.innerHTML = h; document.body.appendChild(box);
  await new Promise(r => setTimeout(r, 500));
  return box.getBoundingClientRect().height;
}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1300, 'height': 1800}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(src)); pg.wait_for_timeout(1800)
    hgt = pg.evaluate(JS, [rows, vnames])
    pg.set_viewport_size({'width': 1300, 'height': int(hgt) + 10})
    pg.locator('#shx').screenshot(path=out)
    print(out, 'errors:', errs[:3]); b.close()
