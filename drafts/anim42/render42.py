"""빌드 42 시안: 실제 view.js 길로 직업마다 동작 → GIF(묶음별). python3 render42.py [묶음]"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
harness.SRC = pathlib.Path('/home/claude/game42/src')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
# 묶음: [(제목, 패널)]
GROUPS = {
  'archer': [
    ('시위 당겨 쏘기', {'cls': 'archer', 'mk': 'bshot', 'k': 'arrow'}),
    ('더 강하게 당기기', {'cls': 'archer', 'mk': 'bfull', 'k': 'arrow'}),
    ('사선으로 쏘기', {'cls': 'archer', 'mk': 'bdiag', 'k': 'arrow'}),
    ('연사 (세 발)', {'cls': 'archer', 'mk': 'brapid', 'k': 'arrow', 'n': 3}),
    ('활 휘두르기', {'cls': 'archer', 'mk': 'bswing', 'k': 'melee'}),
    ('장궁 (저격수)', {'cls': 'sniper', 'mk': 'bfull', 'k': 'arrow'}),
  ],
  'dragoon': [
    ('정면 찌르기', {'cls': 'dragoon', 'mk': 'pthrust'}),
    ('위로 찌르기', {'cls': 'dragoon', 'mk': 'pup'}),
    ('아래로 찌르기', {'cls': 'dragoon', 'mk': 'plow'}),
    ('창 휘두르기', {'cls': 'dragoon', 'mk': 'pswing'}),
    ('창 돌리기', {'cls': 'dragoon', 'mk': 'pspin', 'foes': 3, 'all': 1}),
    ('창 치켜들기', {'cls': 'dragoon', 'mk': 'praise', 'k': 'melee'}),
  ],
  'mage': [
    ('지팡이 내밀기', {'cls': 'mage', 'mk': 'spush', 'k': 'magic'}),
    ('지팡이로 찌르기', {'cls': 'mage', 'mk': 'sjab', 'k': 'magic'}),
    ('내밀었다 위로 들기', {'cls': 'mage', 'mk': 'spushup', 'k': 'magic'}),
    ('휘두르기', {'cls': 'mage', 'mk': 'sswing', 'k': 'fire'}),
    ('지팡이에 기 모으기', {'cls': 'mage', 'mk': 'scharge', 'k': 'fire'}),
    ('해골 지팡이 (강령술사)', {'cls': 'necromancer', 'mk': 'spush', 'k': 'dark'}),
  ],
  'rogue': [
    ('내려베기', {'cls': 'rogue', 'mk': 'down'}),
    ('올려베기', {'cls': 'rogue', 'mk': 'up'}),
    ('횡베기', {'cls': 'rogue', 'mk': 'side'}),
    ('찌르기', {'cls': 'rogue', 'mk': 'thrust'}),
    ('난도질', {'cls': 'rogue', 'mk': 'hack'}),
    ('난도질 (쌍단검 · 암살자)', {'cls': 'assassin', 'mk': 'hack', 'n': 2}),
  ],
  'others': [
    ('도끼 내려찍기 (광전사)', {'cls': 'berserker', 'mk': 'smash', 'off': None}),
    ('철퇴 (성직자)', {'cls': 'cleric', 'mk': 'down'}),
    ('몽둥이 (짐꾼)', {'cls': 'porter', 'mk': 'side'}),
    ('망치 내려찍기 (심문관)', {'cls': 'inquisitor', 'mk': 'smash'}),
    ('류트 켜기 (음유시인)', {'cls': 'bard', 'mk': 'lstrum', 'k': 'note'}),
    ('류트로 치기 (음유시인)', {'cls': 'bard', 'mk': 'lswing', 'k': 'note'}),
    ('삼지창 (기사)', {'cls': 'knight', 'wpn': 'trident', 'mk': 'pthrust'}),
    ('주교 지팡이 (대주교)', {'cls': 'archbishop', 'mk': 'sraise', 'k': 'holy'}),
    ('도약 찌르기 (용기병)', {'cls': 'dragoon', 'mk': 'pjump', 'k': 'jump'}),
  ],
}
import os
CLOSE = os.environ.get('CLOSE') == '1'
CROP = [58, 138, 104, 62] if CLOSE else [20, 112, 220, 92]
Z, DT, DUR = (4 if CLOSE else 2), 0.04, 1.4
SUF = '_close' if CLOSE else ''
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def run(names):
    p = T / 'scene42.html'; p.write_text(harness.build_html((T / 'scene42.js').read_text()), encoding='utf-8')
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(p.as_uri()); pg.wait_for_timeout(300)
        taus = [round(-0.12 + i * DT, 3) for i in range(int((DUR + 0.12) / DT))]
        for gname in names:
            items = GROUPS[gname]; shots = []
            for ttl, r in items: shots.append([img(u) for u in pg.evaluate('([r, ts, z, cr]) => SC42_RUN(r, ts, z, cr)', [r, taus, Z, CROP])])
            cols = 3; PW, PH = CROP[2] * Z, CROP[3] * Z; rows = (len(items) + cols - 1) // cols
            frames = []
            for k in range(len(taus)):
                im = Image.new('RGB', (cols * PW + (cols + 1) * 6, rows * (PH + 22) + 6), (21, 23, 28)); d = ImageDraw.Draw(im); d.fontmode = '1'
                for j, (ttl, r) in enumerate(items):
                    x, y = 6 + (j % cols) * (PW + 6), 6 + (j // cols) * (PH + 22)
                    d.text((x + 2, y), ttl, font=FB, fill=(240, 240, 240)); im.paste(shots[j][k], (x, y + 20))
                frames.append(im)
            sample = Image.new('RGB', (frames[0].width, frames[0].height * 8))
            for q, f0 in enumerate(frames[::max(1, len(frames) // 8)][:8]): sample.paste(f0, (0, q * frames[0].height))
            pal = sample.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
            qf = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
            qf[0].save(T / f'{gname}{SUF}.gif', save_all=True, append_images=qf[1:], duration=[250] + [40] * (len(qf) - 2) + [450], loop=0, disposal=1)
            # 장 띠: 고른 때 다섯
            pick = [int((tt + 0.12) / DT) for tt in (0.05, 0.15, 0.24, 0.32, 0.45)]
            st = Image.new('RGB', (len(pick) * (PW + 4) + 4, len(items) * (PH + 24) + 4), (21, 23, 28)); dd = ImageDraw.Draw(st); dd.fontmode = '1'
            for j, (ttl, r) in enumerate(items):
                y = 4 + j * (PH + 24); dd.text((6, y), ttl, font=FB, fill=(240, 220, 160))
                for i, k in enumerate(pick): st.paste(shots[j][min(k, len(taus) - 1)], (4 + i * (PW + 4), y + 20))
            st.save(T / f'{gname}{SUF}_frames.png')
            print(gname, len(frames), frames[0].size)
        print('errors', errs[:5]); b.close()
if __name__ == '__main__':
    run(sys.argv[1:] or list(GROUPS))
