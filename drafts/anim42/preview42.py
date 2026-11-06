"""빌드 42 미리보기: 실제 게임 코드로 — 무기마다 동작 6 · 다른 직업 스킬 효과 6, 장 넷"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
harness.SRC = pathlib.Path('/home/claude/game42/src')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent; D = T / 'd'
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 22, index=2)
FM = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
MOT = [('활 · 시위 당겨 쏘기', {'cls': 'archer', 'mk': 'bfull', 'k': 'arrow'}, [0.08, 0.22, 0.36, 0.5]),
       ('창 · 정면 찌르기', {'cls': 'dragoon', 'mk': 'pthrust'}, [0.06, 0.15, 0.22, 0.3]),
       ('지팡이 · 기 모으기', {'cls': 'mage', 'mk': 'scharge', 'k': 'fire'}, [0.1, 0.22, 0.36, 0.5]),
       ('단검 · 난도질', {'cls': 'assassin', 'mk': 'hack', 'n': 2}, [0.05, 0.12, 0.2, 0.3]),
       ('도끼 · 내려찍기', {'cls': 'berserker', 'mk': 'smash', 'off': None}, [0.08, 0.2, 0.28, 0.36]),
       ('류트 · 켜기', {'cls': 'bard', 'mk': 'lstrum', 'k': 'note'}, [0.1, 0.2, 0.3, 0.42])]
SK = [('화살비 (궁수)', 'rain', 'archer', [0.3, 0.5, 0.6, 0.75]), ('운석 낙하 (마법사)', 'meteor', 'mage', [0.35, 0.62, 0.72, 0.9]),
      ('천벌 (성직자)', 'smite', 'cleric', [0.25, 0.42, 0.52, 0.7]), ('그림자 칼날 (도적)', 'shadow', 'rogue', [0.15, 0.3, 0.45, 0.6]),
      ('도약 찌르기 (용기병)', 'jump', 'dragoon', [0.15, 0.3, 0.45, 0.6]), ('자장가 (음유시인)', 'lullaby', 'bard', [0.2, 0.4, 0.5, 0.7])]
CROP = [58, 128, 160, 78]; Z = 2; CW, CH = CROP[2] * Z, CROP[3] * Z
def shots(page_js, call, taus):
    us = pg.evaluate(call, taus)
    return [Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB') for u in us]
rows = []
with sync_playwright() as pw:
    b = pw.chromium.launch(); errs = []
    pg = b.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
    p = D / 'scene42.html'; p.write_text(harness.build_html((D / 'scene42.js').read_text()), encoding='utf-8'); pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    for nm, r, ts in MOT:
        us = pg.evaluate('([r, ts, z, cr]) => SC42_RUN(r, ts, z, cr)', [r, [-0.1] + ts, Z, CROP])[1:]
        rows.append((nm, [Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB') for u in us]))
    pg2 = b.new_page(); pg2.on('pageerror', lambda e: errs.append(str(e)))
    p2 = D / 'scene42s.html'; p2.write_text(harness.build_html((D / 'scene42s.js').read_text()), encoding='utf-8'); pg2.goto(p2.as_uri()); pg2.wait_for_timeout(300)
    for nm, sid, cls, ts in SK:
        us = pg2.evaluate('([i, c, w, ts, z, cr]) => SS_RUN(i, c, w, ts, z, cr)', [sid, cls, None, [-0.1] + ts, Z, [40, 104, 200, 100]])[1:]
        rows.append((nm, [Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB').resize((CW, int(CW * 100 / 200)), Image.NEAREST) for u in us]))
    b.close()
LW = 170; W = LW + 4 * (CW + 4) + 16
H = 96 + sum(im[0].height + 6 for _, im in rows) + 60
out = Image.new('RGB', (W, H), (21, 23, 28)); d = ImageDraw.Draw(out)
d.text((16, 14), '빌드 42 · 모든 직업 공격 동작 · 다른 직업 스킬 효과 201개', font=FB, fill=(242, 190, 60))
d.text((16, 48), '활·창·지팡이·단검·둔기·류트마다 동작 · 화살·마법은 무기 끝에서 · 모으기 → 쏘기 → 맞히기 → 남은 것', font=FS, fill=(200, 200, 200))
y = 76
for j, (nm, ims) in enumerate(rows):
    if j == len(MOT): d.line((16, y - 3, W - 16, y - 3), fill=(80, 74, 60), width=2); y += 6
    hh = ims[0].height
    d.text((14, y + hh // 2 - 10), nm, font=FM, fill=(240, 240, 240))
    for i, im in enumerate(ims): out.paste(im, (LW + i * (CW + 4), y))
    y += hh + 6
out = out.crop((0, 0, W, y + 10)); out.save(T / 'preview42.png'); print(out.size, errs[:3])
