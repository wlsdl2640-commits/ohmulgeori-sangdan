"""대형: 시안(11-13) · 넣은 것(간격 넓힘) 나란히"""
import json
from PIL import Image, ImageDraw, ImageFont
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v89/form/'
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 22, index=2)
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 24, index=2)
FT = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 30, index=2)
meta = json.load(open(D + 'z_meta.json', encoding='utf-8'))
ROWS = {'A': '근접 셋 + 원거리 + 짐꾼', 'B': '근접 둘 + 마법 + 힐러 + 짐꾼', 'C': '근접 넷 — 넷째는 가운데 줄 맨 앞', 'D': '근접 없음 — 줄을 앞으로 당긴다',
        'E': '한 줄에 하나씩 (기사 · 신궁 · 대주교 · 마부)', 'F': '짐꾼 없이 (근접 둘 · 마법 · 힐러)'}
X0, X1, Y0, Y1 = 0, 560, 400, 628
cw, chh = X1 - X0, Y1 - Y0
W = 40 + cw * 2 + 30 + 40
H = 130 + len(ROWS) * (chh + 80) + 20
sh = Image.new('RGB', (W, H), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((40, 24), '대형 — 시안(11-13) · 넣은 것(줄 사이 26 → 31~34 · 줄 안 깊이도 조금 넓게)', font=FT, fill=(240, 196, 90))
d.text((40, 70), '오른쪽이 앞(적 쪽). 줄이 넷 이상이면 화면에 들게 줄 사이를 좁힌다(넷이면 31). 펫은 맨 뒤 줄 뒤.', font=F, fill=(170, 165, 155))
y = 120
for key, desc in ROWS.items():
    d.text((40, y), f'{key}  {desc}', font=FB, fill=(236, 230, 220))
    names = ' · '.join(m[0] for m in meta['cur_' + key])
    d.text((40 + d.textlength(f'{key}  {desc}', font=FB) + 24, y + 3), names, font=F, fill=(170, 165, 155))
    for j, (tag, path) in enumerate((('시안', SP + f'/v87/form/z_new_{key}.png'), ('넣은 것', D + f'z_cur_{key}.png'))):
        ox = 40 + j * (cw + 30)
        try: im = Image.open(path).crop((X0, Y0, X1, Y1))
        except FileNotFoundError:
            d.rectangle([ox, y + 40, ox + cw, y + 40 + chh], fill=(34, 32, 40)); d.text((ox + 20, y + 60), '(시안에 없던 파티)', font=F, fill=(120, 116, 110)); continue
        sh.paste(im, (ox, y + 40))
        dd = ImageDraw.Draw(sh); tw = d.textlength(tag, font=FB)
        dd.rectangle([ox, y + 40, ox + tw + 16, y + 40 + 34], fill=(21, 23, 28)); dd.text((ox + 8, y + 42), tag, font=FB, fill=(240, 196, 90) if j else (180, 176, 168))
    y += chh + 80
sh.save(D + 'formation_applied.png'); print(sh.size)
