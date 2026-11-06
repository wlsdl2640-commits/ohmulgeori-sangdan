"""스킬 효과 시안 → GIF(스킬마다 칸) + 단계 띠
python3 render.py  → skfx_attack.gif · skfx_more.gif · skfx_stages.png"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
from harness import build_html
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
GROUPS = [('skfx_attack', ['bash', 'sweep', 'earthsplit', 'titanblow', 'shieldbash', 'lancecharge']), ('skfx_more', ['holystrike', 'judgment', 'glory', 'ironwall', 'warcry'])]
WHO = {'bash': '전사', 'sweep': '전사', 'earthsplit': '전사', 'titanblow': '전사', 'shieldbash': '기사', 'lancecharge': '기사', 'holystrike': '성기사', 'judgment': '성기사', 'glory': '챔피언', 'ironwall': '전사', 'warcry': '전사'}
Z, DT = 2, 0.04
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
p = T / 'skfx.html'; p.write_text(build_html((T / 'skfx.js').read_text()), encoding='utf-8')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    L = {k: (nm, hits, end) for k, nm, hits, end in pg.evaluate('SK_LIST()')}
    shot = lambda k, tau, z=Z: img(pg.evaluate('([k, t, z]) => SK_SCENE(k, t, z)', [k, tau, z]))
    for name, ids in GROUPS:
        n = int(round((max(L[k][2] for k in ids) + 0.35) / DT))
        cols = 2; PW, PH = 200 * Z, 96 * Z; rows = (len(ids) + cols - 1) // cols
        frames = []
        for i in range(n):
            tau = -0.3 + i * DT
            im = Image.new('RGB', (cols * PW + (cols + 1) * 6, rows * (PH + 24) + 6), (21, 23, 28)); d = ImageDraw.Draw(im); d.fontmode = '1'
            for j, k in enumerate(ids):
                x, y = 6 + (j % cols) * (PW + 6), 6 + (j // cols) * (PH + 24)
                d.text((x + 2, y), f'{L[k][0]} ({WHO[k]})', font=FB, fill=(240, 240, 240))
                im.paste(shot(k, min(tau, L[k][2])), (x, y + 21))
            frames.append(im)
        allc = Image.new('RGB', (frames[0].width, frames[0].height * min(len(frames), 12)))
        for q, f0 in enumerate(frames[::max(1, len(frames) // 12)][:12]): allc.paste(f0, (0, q * frames[0].height))
        pal = allc.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
        qf = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
        qf[0].save(T / f'{name}.gif', save_all=True, append_images=qf[1:], duration=[400] + [40] * (len(qf) - 2) + [500], loop=0, disposal=1)
        qf[0].save(T / f'{name}_slow.gif', save_all=True, append_images=qf[1:], duration=[400] + [100] * (len(qf) - 2) + [600], loop=0, disposal=1)
        print(name, len(frames), frames[0].size)
    # 단계 띠: 모으기 · 휘두르기 · 맞힘(번쩍) · 맞힘(모양) · 흩어짐 · 남은 것
    ids = [k for _, g in GROUPS for k in g]; CW, CH = 240, 129; LW = 120
    st = Image.new('RGB', (LW + 6 * (CW + 4), 40 + len(ids) * (CH + 8)), (21, 23, 28)); d = ImageDraw.Draw(st)
    d.text((10, 8), '스킬 효과 단계 (왼쪽 → 오른쪽): ① 모으기 · ② 휘두르기 · ③ 번쩍 · ③ 모양 · ③ 흩어짐 · ④ 남은 것', font=FB, fill=(242, 190, 60))
    for j, k in enumerate(ids):
        nm, hits, end = L[k]; h = hits[-1] if hits else 0.3
        taus = [hits[0] * 0.7, hits[0] - 0.03, h + 0.02, h + 0.1, h + 0.28, h + 0.6] if k not in ('ironwall', 'warcry') else [0.05, 0.15, 0.25, 0.35, 0.5, 0.7]
        y = 36 + j * (CH + 8)
        d.text((10, y + CH // 2 - 20), nm, font=FB, fill=(240, 240, 240)); d.text((10, y + CH // 2 + 2), WHO[k], font=FS, fill=(170, 170, 170))
        for i, t in enumerate(taus):
            st.paste(shot(k, t, 2).crop((60, 20, 380, 192)).resize((CW, CH), Image.NEAREST), (LW + i * (CW + 4), y))
    st.save(T / 'skfx_stages.png'); print('stages', st.size)
    print('errors', errs[:3]); b.close()
