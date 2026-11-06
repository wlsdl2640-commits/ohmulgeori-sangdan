"""방패 다섯 종류 게임 그림 (앞·옆 · 단계 색 넷) + 빌드 38 성기사 방패 + 목록 그림 → kinds_sheet.png"""
import sys, pathlib, base64, io
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
from harness import build_html
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
T = pathlib.Path(__file__).parent
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16, index=2)
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
js = (T / 'anim.js').read_text() + """
window.KT = (cls, off, view, Z) => {
  const a = anAdv({ cls, off }), W = 20, H = 26, c = document.createElement('canvas'); c.width = W * Z; c.height = H * Z;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#3a3430'; g.fillRect(0, 0, c.width, c.height);
  const s = view === 'side' ? pxsAdvSprite(a, 'idle', 0) : pxAdvSprite(a, 'idle', 0);
  g.drawImage(s.cv, 0, 0, s.w, s.h, 10 * Z - s.ax * Z / 2, 24 * Z - s.ay * Z / 2, s.w * Z / 2, s.h * Z / 2);
  return c.toDataURL();
};
"""
KINDS = [('buckler', '원형'), ('shield', '히터'), ('kite', '카이트'), ('tower', '탑'), ('cross', '십자 (새)'), ('towerB', '탑 (띠 안)')]
TIERS = [0, 2, 4, 6]
Z = 4
p = T / 'kinds.html'; p.write_text(build_html(js), encoding='utf-8')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(p.as_uri()); pg.wait_for_timeout(300)
    tile = lambda cls, off, v: Image.open(io.BytesIO(base64.b64decode(pg.evaluate('([c, o, v, z]) => KT(c, o, v, z)', [cls, off, v, Z]).split(',')[1]))).convert('RGB')
    TW, TH = 20 * Z, 26 * Z; LW = 110
    sh = Image.new('RGB', (LW + 4 * (2 * TW + 14) + 10, 70 + len(KINDS) * (TH + 10)), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 8), '방패 다섯 종류 · 게임 그림 (앞 · 옆) · 왼쪽 → 오른쪽 단계 색', font=F, fill=(242, 190, 60))
    for c, t in enumerate(['견습·숲지기', '강철·폭풍', '서리·사막왕', '그 위 단계']): d.text((LW + c * (2 * TW + 14) + 40, 40), t, font=FS, fill=(200, 200, 200))
    for r, (k, nm) in enumerate(KINDS):
        y = 64 + r * (TH + 10)
        d.text((10, y + TH // 2 - 10), nm + ' 방패', font=F, fill=(255, 240, 160) if k in ('cross', 'towerB') else (240, 240, 240))
        for c, t in enumerate(TIERS):
            x = LW + c * (2 * TW + 14)
            sh.paste(tile('paladin' if k == 'cross' else 'knight', [k, t], 'front'), (x, y)); sh.paste(tile('paladin' if k == 'cross' else 'knight', [k, t], 'side'), (x + TW + 2, y))
    sh.save(T / 'kinds_sheet.png'); print(sh.size, 'errors', errs[:3]); b.close()
# 빌드 38 성기사와 나란히
ref = Image.open(T / 'old38_paladin.png'); ic = Image.open(T / 'icons_sheet.png')
out = Image.new('RGB', (max(ref.width, 700) + 20, ref.height + 40), (21, 23, 28)); d = ImageDraw.Draw(out)
d.text((10, 6), '참고: 빌드 38 성기사 (앞 · 옆 · 옆 공격)', font=F, fill=(200, 200, 200)); out.paste(ref, (10, 34)); out.save(T / 'ref38.png')
