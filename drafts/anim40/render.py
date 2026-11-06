"""전사 공격 동작 시안 → GIF + 장면 띠 (python3 render.py [이름])"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
from harness import build_html
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
ORDER = ['down', 'up', 'side', 'thrust', 'bash', 'block']
RIGS = {
    'warrior': {'cls': 'warrior', 'off': ['shield', 0]},
    'knight': {'cls': 'knight', 'off': ['kite', 2]},
    'paladin': {'cls': 'paladin', 'off': ['cross', 6]},
}
DUR = [70, 70, 100, 60, 120, 80, 70, 70]
def grab(pg, r, mk, i):
    u = pg.evaluate('([r, m, i]) => AN_FRAME(r, m, i)', [r, mk, i])
    return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def main(tag='warrior', Z=6, rigs=None):
    rigs = rigs or [RIGS[tag]]
    p = T / 'anim.html'; p.write_text(build_html((T / 'anim.js').read_text()), encoding='utf-8')
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(p.as_uri()); pg.wait_for_timeout(300)
        names = pg.evaluate('AN_NAMES()')
        for r in rigs:
            fr = {mk: [grab(pg, r, mk, i) for i in range(names[mk][1])] for mk in ORDER}
            idle = [grab(pg, r, 'down', -1), grab(pg, r, 'down', -2)]
            nm = r['cls']
            # 장면 띠: 줄 = 동작, 칸 = 서기 + 8장
            cw, ch = 30, 28
            crop = lambda im: im.crop((5, 2, 5 + cw, 2 + ch))
            Zs = 5; LW = 96
            sh = Image.new('RGB', (LW + 9 * cw * Zs + 8, 34 + len(ORDER) * (ch * Zs + 6)), (21, 23, 28)); d = ImageDraw.Draw(sh)
            d.text((10, 8), f'{nm} 공격 동작 시안 · 왼쪽 = 지금 서 있기 · 1→8장 (게임에서 한 장 0.04~0.06초)', font=F, fill=(242, 190, 60))
            for j, mk in enumerate(ORDER):
                y = 34 + j * (ch * Zs + 6)
                d.text((10, y + ch * Zs // 2 - 10), names[mk][0], font=F, fill=(240, 240, 240))
                for i, im in enumerate([idle[0]] + fr[mk]):
                    sh.paste(crop(im).resize((cw * Zs, ch * Zs), Image.NEAREST), (LW + i * cw * Zs, y))
                    d.text((LW + i * cw * Zs + 4, y + 2), '서기' if i == 0 else str(i), font=FS, fill=(150, 150, 150))
            sh.save(T / f'strip_{nm}.png')
            # 움직이는 그림: 3 × 2 칸, 모두 같이
            PW, PH = 34 * Z, 28 * Z
            pcrop = lambda im: im.crop((3, 2, 37, 30)).resize((PW, PH), Image.NEAREST)
            frames, durs = [], []
            def compose(pick):
                im = Image.new('RGB', (3 * PW + 4 * 6, 2 * (PH + 24) + 6), (21, 23, 28)); dd = ImageDraw.Draw(im); dd.fontmode = '1'
                for j, mk in enumerate(ORDER):
                    x, y = 6 + (j % 3) * (PW + 6), 6 + (j // 3) * (PH + 24)
                    dd.text((x + 4, y), names[mk][0], font=F, fill=(240, 240, 240))
                    im.paste(pcrop(pick(mk)), (x, y + 22))
                return im
            for k in range(2): frames.append(compose(lambda mk: idle[k])); durs.append(260)
            for i in range(8): frames.append(compose(lambda mk: fr[mk][i])); durs.append(DUR[i])
            frames.append(compose(lambda mk: idle[0])); durs.append(380)
            # 같은 팔레트로 (색이 장마다 바뀌지 않게)
            allc = Image.new('RGB', (frames[0].width, frames[0].height * len(frames)))
            for k, f0 in enumerate(frames): allc.paste(f0, (0, k * frames[0].height))
            pal = allc.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
            q = [f0.quantize(palette=pal, dither=Image.Dither.NONE) for f0 in frames]
            q[0].save(T / f'anim_{nm}.gif', save_all=True, append_images=q[1:], duration=durs, loop=0, disposal=1)
            q[0].save(T / f'anim_{nm}_slow.gif', save_all=True, append_images=q[1:], duration=[d0 if k in (0, 1, len(durs) - 1) else int(d0 * 2.5) for k, d0 in enumerate(durs)], loop=0, disposal=1)
            # 하나씩 (느리게 보기)
            for mk in ORDER:
                fs = [pcrop(idle[0])] + [pcrop(x) for x in fr[mk]] + [pcrop(idle[0])]
                fs[0].save(T / f'one_{nm}_{mk}.gif', save_all=True, append_images=fs[1:], duration=[400] + [x * 2 for x in DUR] + [400], loop=0)
        print('errors', errs[:3]); b.close()
if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'warrior')
