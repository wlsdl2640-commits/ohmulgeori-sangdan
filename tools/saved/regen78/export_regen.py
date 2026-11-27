"""리젠 자리 그림(밀짚더미 3 · 낡은 축사 2) · 마법 걸린 밀짚 반지(4) → src/data-regenart78.js — 손으로 고치지 말 것
   python export_regen.py <src/data-regenart78.js>   (먼저 clean.py로 pick_*.png를 만든다)"""
import sys, io, base64, os
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def url(im, fmt='PNG'):
    b = io.BytesIO(); im.save(b, fmt, optimize=True) if fmt == 'PNG' else im.save(b, fmt, lossless=True); return f'data:image/{fmt.lower()};base64,' + base64.b64encode(b.getvalue()).decode()
hay = Image.open('pick_hay.png').convert('RGBA'); barn = Image.open('pick_barn.png').convert('RGBA')
hay = hay.crop(hay.getbbox()); barn = barn.crop(barn.getbbox())
ring = Image.open('pick_ring.png').convert('RGBA'); bb = ring.getbbox(); c = ring.crop(bb); s = max(c.size) + 4
sq = Image.new('RGBA', (s, s)); sq.alpha_composite(c, ((s - c.width) // 2, (s - c.height) // 2)); sq = sq.resize((96, 96), Image.LANCZOS)
js = ('/* 빌드 78: 리젠 자리 그림(밀짚더미 · 낡은 축사 — 평원 중경과 같은 점 굵기 hs 2) · 마법 걸린 밀짚 반지 그림 — tools/saved/regen78/export_regen.py로 뽑는다(손으로 고치지 말 것). regen78.js가 쓴다 */\n'
      f"const REGEN_ART = {{ hay: {{ url: '{url(hay)}', w: {hay.width}, h: {hay.height} }}, barn: {{ url: '{url(barn)}', w: {barn.width}, h: {barn.height} }} }};\n"
      f"GEARART.strawring = ['{url(sq, 'WEBP')}'];\n")
open(sys.argv[1], 'w', encoding='utf-8').write(js); print(round(len(js) / 1024), 'KB', hay.size, barn.size)
