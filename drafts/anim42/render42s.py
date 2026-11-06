"""빌드 42 스킬 시안: python3 render42s.py 묶음..."""
import sys, pathlib, base64, io, json
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
harness.SRC = pathlib.Path('/home/claude/game42/src')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
G = {
  'sk_archer': [('aimed', 'archer'), ('double', 'archer'), ('rain', 'archer'), ('el_arrow', 'archer'), ('awk_archer', 'archer'), ('awk2_archer', 'archer'),
                ('headshot', 'sniper'), ('lastarrow', 'hawkeye'), ('starfall', 'hawkeye'), ('wolfcall', 'ranger'), ('trapnet', 'mhunter'), ('titanfall', 'kaijuhunter')],
  'sk_dragoon': [('jump', 'dragoon'), ('gale', 'dragoon'), ('skyfall', 'dragoon'), ('dragonfall', 'dragoon'), ('wyvernfall', 'dragoon'), ('harpoon', 'kaijuhunter')],
  'sk_mage': [('fireball', 'mage'), ('icelance', 'mage'), ('chain', 'mage'), ('meteor', 'mage'), ('blizzard', 'mage'), ('awk2_mage', 'mage'),
              ('drain', 'necromancer'), ('gravity', 'archmage'), ('ultima', 'archmage'), ('thundercall', 'elemancer'), ('blazeflask', 'alchemist'), ('spiritking', 'elementlord')],
  'sk_cleric': [('holy', 'cleric'), ('smite', 'cleric'), ('holyhammer', 'cleric'), ('massheal', 'cleric'), ('bless', 'cleric'), ('sanctuary', 'cleric'),
                ('awk_cleric', 'cleric'), ('resurrect', 'archbishop'), ('archangel', 'archbishop'), ('verdict', 'inquisitor'), ('miasma', 'plaguedoc'), ('vaccine', 'plaguedoc')],
  'sk_rogue': [('backstab', 'rogue'), ('venom', 'rogue'), ('shadow', 'rogue'), ('voltstab', 'rogue'), ('awk_rogue', 'rogue'), ('smoke', 'rogue'),
               ('assassinate', 'assassin'), ('shadowclone', 'assassin'), ('thousandcut', 'bladedancer'), ('blitz', 'duelist'), ('heist', 'masterthief'), ('eclipse', 'shadowlord')],
  'sk_porter': [('throwjunk', 'porter'), ('avalanche', 'porter'), ('awk_porter', 'porter'), ('whipcrack', 'coachman'), ('stampede', 'caravanmaster'), ('gallop', 'coachman'),
                ('ballad', 'bard'), ('lullaby', 'bard'), ('hymn', 'bard'), ('requiem', 'maestro'), ('volley', 'scout'), ('steadyaim', 'sniper')],
}
CROP = [20, 104, 220, 100]
Z, DT, DUR = 2, 0.04, 1.7
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def run(names):
    p = T / 'scene42s.html'; p.write_text(harness.build_html((T / 'scene42s.js').read_text()), encoding='utf-8')
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(p.as_uri()); pg.wait_for_timeout(300)
        print('info', pg.evaluate('SS_INFO()'))
        ko = pg.evaluate('Object.fromEntries(Object.keys(SKILLS).map(k => [k, SKILLS[k].name]))')
        jko = pg.evaluate('Object.fromEntries(Object.keys(CLASSES).map(k => [k, CLASSES[k].name]))')
        taus = [round(-0.12 + i * DT, 3) for i in range(int((DUR + 0.12) / DT))]
        for gname in names:
            items = G[gname]; shots = []
            for sid, cls in items: shots.append([img(u) for u in pg.evaluate('([i, c, w, ts, z, cr]) => SS_RUN(i, c, w, ts, z, cr)', [sid, cls, None, taus, Z, CROP])])
            cols = 3; PW, PH = CROP[2] * Z, CROP[3] * Z; rows = (len(items) + cols - 1) // cols
            frames = []
            for k in range(len(taus)):
                im = Image.new('RGB', (cols * PW + (cols + 1) * 6, rows * (PH + 22) + 6), (21, 23, 28)); d = ImageDraw.Draw(im); d.fontmode = '1'
                for j, (sid, cls) in enumerate(items):
                    x, y = 6 + (j % cols) * (PW + 6), 6 + (j // cols) * (PH + 22)
                    d.text((x + 2, y), f'{ko[sid]} ({jko[cls]})', font=FB, fill=(240, 240, 240)); im.paste(shots[j][k], (x, y + 20))
                frames.append(im)
            sample = Image.new('RGB', (frames[0].width, frames[0].height * 8))
            for q, f0 in enumerate(frames[::max(1, len(frames) // 8)][:8]): sample.paste(f0, (0, q * frames[0].height))
            pal = sample.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
            qf = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
            qf[0].save(T / f'{gname}.gif', save_all=True, append_images=qf[1:], duration=[250] + [40] * (len(qf) - 2) + [500], loop=0, disposal=1)
            pick = [int((tt + 0.12) / DT) for tt in (0.12, 0.3, 0.45, 0.6, 0.9)]
            st = Image.new('RGB', (len(pick) * (PW + 4) + 4, len(items) * (PH + 24) + 4), (21, 23, 28)); dd = ImageDraw.Draw(st); dd.fontmode = '1'
            for j, (sid, cls) in enumerate(items):
                y = 4 + j * (PH + 24); dd.text((6, y), f'{ko[sid]} ({jko[cls]})', font=FB, fill=(240, 220, 160))
                for i, k in enumerate(pick): st.paste(shots[j][min(k, len(taus) - 1)], (4 + i * (PW + 4), y + 20))
            st.save(T / f'{gname}_frames.png')
            print(gname, len(frames), frames[0].size)
        print('errors', errs[:5]); b.close()
if __name__ == '__main__':
    run(sys.argv[1:] or list(G))
