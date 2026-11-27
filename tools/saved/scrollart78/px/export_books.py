"""확정 스킬북 일곱(픽셀랩) → src/data-bookart78.js (ITEM_HD.skb_<계열>) — 손으로 고치지 말 것
   python export_books.py <src/data-bookart78.js>"""
import sys, io, base64
from PIL import Image
PICK = {'warrior': 'b_warrior_0', 'archer': 'b_archer_3', 'mage': 'b_mage_fin1_0', 'cleric': 'b_cleric_3',
        'rogue': 'b_rogue_2', 'porter': 'b_porter_0', 'all': 'b_common_0'}   # 11-27 대표님 고름 (keep/README.md)
SZ = 96


def square(im):
    bb = im.getbbox(); c = im.crop(bb); s = max(c.size) + 4
    out = Image.new('RGBA', (s, s), (0, 0, 0, 0)); out.paste(c, ((s - c.width) // 2, (s - c.height) // 2)); return out.resize((SZ, SZ), Image.LANCZOS)


lines = []
for fam, k in PICK.items():
    im = square(Image.open(f'raw/{k}.png').convert('RGBA')); buf = io.BytesIO(); im.save(buf, 'WEBP', lossless=True)
    lines.append(f"  skb_{fam}: 'data:image/webp;base64,{base64.b64encode(buf.getvalue()).decode()}',")
js = ('/* 빌드 78: 직업 스킬북 그림(픽셀랩 · 11-27 대표님 고름) — tools/saved/scrollart78/px/export_books.py로 뽑는다(손으로 고치지 말 것).\n'
      '   enh72.js itemHD가 펼친 스킬북(ITEMS[id].book)을 계열로 찾아 쓴다. 레어도는 창고 칸 테가 보여 준다. */\n'
      'Object.assign(ITEM_HD, {\n' + '\n'.join(lines) + '\n});\n')
open(sys.argv[1], 'w', encoding='utf-8').write(js); print(round(len(js) / 1024), 'KB')
