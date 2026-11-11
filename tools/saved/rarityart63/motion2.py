"""움직임 판 2: 홀로그램 빛 방식(한 줄 · 칸 전체 넷)을 줄마다, 영웅~창조 칸 12장을 3배로 GIF · MP4로. python3 motion2.py <sandbox2 play.html> <출력 이름>"""
import sys, os, io, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright
src, name = sys.argv[1], sys.argv[2]
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
f14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 15); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12); f18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
s = open(src, encoding='utf-8').read(); m = "(() => {\n'use strict';\n"; assert s.count(m) == 1
open('rq_mo.html', 'w', encoding='utf-8').write(s.replace(m, m + "window.__RQ = () => ({ rqArt, gearIconURL, iconURL, QUALITY });\n"))
ROWS = [  # (제목, 설명, 칸들, 빛 방식)
    ('지금 · 한 줄', '대각선 빛 줄 하나(신화부터 둘)가 지나간다 — 나머지는 그대로', [('sw', 3, {}, '영웅'), ('sw', 4, {}, '전설'), ('sw', 5, {}, '신화'), ('sw', 6, {}, '신성'), ('sw', 7, {}, '우주'), ('sw', 8, {8: 'A'}, '창조 A'), ('sw', 8, {8: 'B'}, '창조 B')], 'line'),
    ('1 · 전체 물결', '좁은 빛 띠가 칸 전체에 여러 줄 깔려 함께 흐른다 · 띠마다 그 레어도 색이 바뀜', [('sw', 3, {}, '영웅'), ('sw', 4, {}, '전설'), ('sw', 5, {}, '신화'), ('sw', 6, {}, '신성'), ('sw', 7, {}, '우주'), ('sw', 8, {8: 'A'}, '창조 A'), ('sw', 8, {8: 'B'}, '창조 B')], 'wave'),
    ('2 · 전체 빛 흐름', '칸 전체가 레어도 색 띠로 물들어 비스듬히 흐른다 · 가장 밝은 띠가 하나', [('sw', 3, {}, '영웅'), ('sw', 4, {}, '전설'), ('sw', 5, {}, '신화'), ('sw', 6, {}, '신성'), ('sw', 7, {}, '우주'), ('sw', 8, {8: 'A'}, '창조 A'), ('sw', 8, {8: 'B'}, '창조 B')], 'flow'),
    ('3 · 넓은 빛', '칸 절반을 덮는 넓은 빛 덩어리가 지나간다 · 가장자리는 바둑 무늬로 옅게', [('sw', 3, {}, '영웅'), ('sw', 4, {}, '전설'), ('sw', 5, {}, '신화'), ('sw', 6, {}, '신성'), ('sw', 7, {}, '우주'), ('sw', 8, {8: 'A'}, '창조 A'), ('sw', 8, {8: 'B'}, '창조 B')], 'sheen'),
    ('4 · 필름', '칸 전체에 색 결이 흐르고 밝은 곳(테 · 그림 빛)일수록 더 반짝인다', [('sw', 3, {}, '영웅'), ('sw', 4, {}, '전설'), ('sw', 5, {}, '신화'), ('sw', 6, {}, '신성'), ('sw', 7, {}, '우주'), ('sw', 8, {8: 'A'}, '창조 A'), ('sw', 8, {8: 'B'}, '창조 B')], 'foil'),
]
JS = r"""async (rows) => {
  const R = window.__RQ(), U = { sw: R.gearIconURL({ base: 'sword', t: 12, q: 0 }), rb: R.gearIconURL({ base: 'robe', t: 13, q: 0 }), rn: R.iconURL('rune_atk_2'), bk: R.iconURL('book_taunt') };
  const box = document.createElement('div'); box.id = 'mo'; box.style.cssText = 'position:absolute;left:0;top:0;z-index:99999;background:#13161e;padding:4px';
  rows.forEach((r, i) => {
    const row = document.createElement('div'); row.id = 'mr' + i; row.style.cssText = 'display:flex;gap:8px;padding:4px;background:#13161e;width:max-content';
    window.RQH = r[3]; row.innerHTML = r[2].map(([k, g, opt]) => { window.RQD = opt; return R.rqArt(U[k], g, 2, 0); }).join('');
    box.appendChild(row);
  });
  document.body.appendChild(box); await new Promise(r => setTimeout(r, 300)); return 1;
}"""
SC = 3
frames = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 800, 'height': 600}, device_scale_factor=1); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath('rq_mo.html')); pg.wait_for_timeout(1500)
    pg.evaluate(JS, [[r[0], r[1], [[c[0], c[1], {str(k): v for k, v in c[2].items()}] for c in r[2]], r[3]] for r in ROWS])
    for i in range(12):
        pg.evaluate("i => { let st = document.getElementById('frz'); if (!st) { st = document.createElement('style'); st.id = 'frz'; document.head.appendChild(st); } st.textContent = `#mo .rqa.holo{animation-play-state:paused;animation-delay:-${(i * 0.15 + 0.01).toFixed(2)}s}`; }", i)
        pg.wait_for_timeout(60)
        frames.append([Image.open(io.BytesIO(pg.locator('#mr%d' % r).screenshot())).convert('RGB') for r in range(len(ROWS))])
    print('errors:', errs[:3]); b.close()
# 판 짜기: 제목 · 줄마다 글 + 3배 칸 + 칸 이름
W = 40 + max(f.width for f in frames[0]) * SC + 40
H = 70 + sum(48 + f.height * SC + 30 for f in frames[0]) + 10
W += W % 2; H += H % 2
out = []
for fr in frames:
    im = Image.new('RGB', (W, H), (19, 22, 30)); d = ImageDraw.Draw(im)
    d.text((24, 16), '홀로그램 빛을 칸 전체에 — 시안 넷 (3배, 실제 게임 칸 12장 · 1.8초마다 되풀이)', font=f18, fill=(240, 180, 60))
    d.text((24, 44), '맨 위는 지금(한 줄). 1~4 중에서 골라 주세요. 그림(장비) 위에는 빛을 조금 약하게. 창조 A · B도 같이 골라 주세요.', font=f12, fill=(169, 176, 189))
    y = 70
    for r, (t, desc, cells, _m) in enumerate(ROWS):
        d.text((24, y), t, font=f14, fill=(236, 228, 208)); d.text((24, y + 20), desc, font=f12, fill=(169, 176, 189)); y += 42
        big = fr[r].resize((fr[r].width * SC, fr[r].height * SC), Image.NEAREST); im.paste(big, (24, y))
        for j, c in enumerate(cells):
            x = 24 + (4 + j * 60) * SC + 26 * SC - 20
            d.text((x, y + big.height + 4), c[3], font=f12, fill=(169, 176, 189))
        y += big.height + 30
    out.append(im)
out[0].save(name + '.png')
pal = [o.quantize(colors=255, method=Image.Quantize.MEDIANCUT) for o in out]
pal[0].save(name + '.gif', save_all=True, append_images=pal[1:], duration=150, loop=0, disposal=1)
tmp = 'mo_frames'; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
n = 0
for rep in range(5):
    for o in out: o.save(f'{tmp}/f{n:03d}.png'); n += 1
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '20/3', '-i', f'{tmp}/f%03d.png', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '20', name + '.mp4'], check=True)
print(W, H, name)
