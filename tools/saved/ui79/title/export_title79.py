"""첫 화면 빌드 79 그림 → src/data-title79.js (손으로 고치지 말 것) — python export_title79.py <출력.js>
   배경 px2_B1.png(픽셀랩 206×450) · 제목 글자 logo_A.png · 단추 states/{gold,wood}_{normal,hover,pressed,disabled}.png(픽셀랩 상태)"""
import sys, os, base64, json
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def u(p, crop=False):
    im = Image.open(p).convert('RGBA')
    if crop: im = im.crop(im.getbbox())
    import io; b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
D = {'bg': u('px2_B1.png'), 'logo': u('logo_A.png', True), 'btn': {k: {s: u(f'states/{k}_{s}.png', True) for s in ('normal', 'hover', 'pressed', 'disabled')} for k in ('gold', 'wood')}}
open(sys.argv[1], 'w', encoding='utf-8').write('/* 빌드 79 첫 화면(세로 화면): 밝은 미궁 대문 B1 · 제목 글자 A · 단추 네 모습 — tools/saved/ui79/title/export_title79.py, 손으로 고치지 말 것 */\nconst TITLE79 = ' + json.dumps(D) + ';\n')
print(os.path.getsize(sys.argv[1]))
