"""레어도 시안판 (실제 rarity.js 칸): 홀로그램 레어도 색 · 우주 · 창조 A/B. python3 rqsheet.py <sandbox play.html> <출력 png> <출력 gif>"""
import sys, os, io
from PIL import Image
from playwright.sync_api import sync_playwright
src, out, gif = sys.argv[1:4]
s = open(src, encoding='utf-8').read(); m = "(() => {\n'use strict';\n"; assert s.count(m) == 1
open('rq_sb.html', 'w', encoding='utf-8').write(s.replace(m, m + "window.__RQ = () => ({ rqArt, gearIconURL, iconURL, QUALITY });\n"))
JS = r"""async () => {
  const R = window.__RQ(), Q = R.QUALITY;
  const sw = R.gearIconURL({ base: 'sword', t: 12, q: 0 }), rb = R.gearIconURL({ base: 'robe', t: 13, q: 0 }), rn = R.iconURL('rune_atk_2'), bk = R.iconURL('book_taunt');
  const cell = (u, g, lab) => `<div class="c">${R.rqArt(u, g, 2, 0)}<em>${lab || ''}</em></div>`;
  const set = (opt, old) => { window.RQD = opt; window.RQOLD = old; };
  const css = document.createElement('style');
  css.textContent = `#rqs{position:absolute;left:0;top:0;z-index:99999;width:940px;padding:18px 22px 24px;background:#13161e;color:#ece4d0;font-family:var(--font)}
  #rqs h1{font-size:19px;color:#f0b43c;margin:0 0 4px} #rqs .sub{font-size:12px;color:#a9b0bd;margin:0 0 6px;line-height:1.5}
  #rqs h2{font-size:15px;margin:16px 0 6px;color:#ece4d0} #rqs .row{display:flex;align-items:center;gap:14px;padding:8px 0;border-top:1px solid #262b38}
  #rqs .lab{width:210px;flex:none;font-size:12px;color:#a9b0bd;line-height:1.5} #rqs .lab b{display:block;font-size:14px;color:#ece4d0;margin-bottom:2px} #rqs .lab b i{font-style:normal;color:#f0b43c;margin-right:6px}
  #rqs .cells{display:flex;gap:8px;flex-wrap:wrap} #rqs .c{display:flex;flex-direction:column;align-items:center;gap:2px} #rqs .c em{font-style:normal;font-size:11px;color:#a9b0bd}
  #rqs .tg{display:inline-block;padding:0 6px;margin-left:8px;border:2px solid;font-size:12px;line-height:18px}
  #rqs .nm{font-size:13px;margin-top:4px}`;
  document.head.appendChild(css);
  let h = `<h1>레어도 — 홀로그램 레어도 색 · 새 등급 우주 · 창조 시안</h1><div class="sub">실제 게임 레어도 칸(52px)으로 그렸다. 영웅부터 홀로그램 빛이 지나간다 (그림은 한 장면, 움직임은 같이 보낸 GIF). 우주 · 창조는 아직 게임에 안 넣음 — A · B 중에서 골라 주세요 (섞어도 됨).</div>`;
  set({}, false);
  h += `<h2>지금 일곱 단계 — 홀로그램을 그 레어도 색으로 바꿈 (넣음)</h2><div class="row"><div class="lab"><b>레어도 색 홀로그램</b>영웅 보라 · 전설 금 · 신화 빨강 · 신성 흰빛</div><div class="cells">${[0, 1, 2, 3, 4, 5, 6].map(g => cell(sw, g, Q[g].name)).join('')}</div></div>`;
  set({}, true);
  h += `<div class="row"><div class="lab"><b>예전 (비교)</b>무지갯빛 — 영웅부터 모두 비슷한 빛</div><div class="cells">${[3, 4, 5, 6].map(g => cell(sw, g, Q[g].name)).join('')}</div></div>`;
  const opts = [
    [7, 'A', '우주 A · 별밤', '남빛 테 · 칸 안은 성운 띠가 비스듬히 흐르는 밤하늘 · 별이 깜빡 · 네 모서리 별 · 옆 보석 둘 · 홀로그램 푸른 보라 · 하늘색', '#9c9cff', '#3c38a0'],
    [7, 'B', '우주 B · 은하 고리', '검푸른 테 + 하늘색 가장자리 · 성운 두 덩이(분홍 · 파랑) · 테를 도는 행성 셋 · 홀로그램 분홍 · 보라 · 하늘색', '#8fe6ff', '#1e2256'],
    [8, 'A', '창조 A · 흰 빛 프리즘', '진주빛 흰 테 · 안쪽 테를 도는 무지개 줄 · 옆 보석 · 보석 가운데가 무지개로 바뀜 · 홀로그램 무지개 둘', '#ffffff', '#b0b0d0'],
    [8, 'B', '창조 B · 무지개 테', '테 자체가 무지개(천천히 돈다) · 어두운 칸 안에 여러 빛깔 별 · 홀로그램은 진주빛 흰 줄 둘', '#ffffff', '#ff8ad8']
  ];
  let last = 0;
  for (const [g, o, name, desc, tc, bc] of opts) {
    if (g !== last) h += `<h2>${g === 7 ? '새 등급 우주 (신성 다음)' : '새 등급 창조 (우주 다음, 맨 끝)'}</h2>`; last = g;
    set({ [g]: o }, false);
    h += `<div class="row"><div class="lab"><b><i>${o}</i>${name}</b>${desc}<div class="nm" style="color:${tc}">${g === 7 ? '우주' : '창조'} 장검<span class="tg" style="color:${tc};border-color:${bc}">${g === 7 ? '우주' : '창조'}</span></div></div><div class="cells">${cell(sw, g, '장비')}${cell(rb, g, '방어구')}${cell(rn, g, '룬')}${cell(bk, g, '스킬북')}${cell(sw, 6, '(신성)')}</div></div>`;
  }
  const box = document.createElement('div'); box.id = 'rqs'; box.innerHTML = h; document.body.appendChild(box);
  await new Promise(r => setTimeout(r, 300)); return box.getBoundingClientRect().height;
}"""
def freeze(pg, i):
    pg.evaluate("i => { let st = document.getElementById('frz'); if (!st) { st = document.createElement('style'); st.id = 'frz'; document.head.appendChild(st); } st.textContent = `#rqs .rqa.holo{animation-play-state:paused;animation-delay:-${(i * 0.15 + 0.01).toFixed(2)}s}`; }", i)
with sync_playwright() as p:
    b = p.chromium.launch()
    for dsf, mode in ((2, 'png'), (1, 'gif')):
        pg = b.new_page(viewport={'width': 984, 'height': 1400}, device_scale_factor=dsf); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://' + os.path.abspath('rq_sb.html')); pg.wait_for_timeout(1500)
        hgt = pg.evaluate(JS); pg.set_viewport_size({'width': 984, 'height': int(hgt) + 10})
        if mode == 'png':
            freeze(pg, 5); pg.wait_for_timeout(100); pg.locator('#rqs').screenshot(path=out)
        else:
            frames = []
            for i in range(12):
                freeze(pg, i); pg.wait_for_timeout(60); frames.append(Image.open(io.BytesIO(pg.locator('#rqs').screenshot())).convert('RGB'))
            pal = [f.quantize(colors=255, method=Image.Quantize.MEDIANCUT) for f in frames]
            pal[0].save(gif, save_all=True, append_images=pal[1:], duration=150, loop=0, disposal=1)
        print(mode, 'errors:', errs[:3]); pg.close()
    b.close()
