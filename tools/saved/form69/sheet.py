"""대형 시안판: 파티 넷 × 지금 · 새 대형, 발밑에 역할 색 점"""
import json
from PIL import Image, ImageDraw, ImageFont
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v87/form/'
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 22, index=2)
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 24, index=2)
FT = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 30, index=2)
meta = json.load(open(D + 'z_meta.json', encoding='utf-8'))
ROLE = {'knight': 0, 'gladiator': 0, 'assassin': 0, 'berserker': 0, 'duelist': 0, 'ninja': 0, 'sniper': 1, 'archmage': 1, 'ranger': 1, 'sorcerer': 1, 'hawkeye': 1,
        'priest': 2, 'archbishop': 2, 'coachman': 3, 'conestoga': 3, 'bard': 3}
RC = [(232, 84, 72), (84, 150, 240), (96, 200, 110), (196, 140, 84)]
RN = ['근접', '원거리', '힐러 · 버퍼', '짐꾼 계열']
ROWS = {'A': '근접 셋 + 원거리 하나 + 짐꾼', 'B': '근접 둘 + 마법 + 힐러 + 짐꾼', 'C': '근접 넷 — 넷째는 가운데 줄 맨 앞', 'D': '근접 없음 — 줄을 앞으로 당긴다 (탈것 · 활 · 마법 · 힐러 · 음유시인)'}
K = 752 / 240
X0, X1, Y0, Y1 = 0, 520, 420, 628
cw, chh = X1 - X0, Y1 - Y0
W = 40 + cw * 2 + 30 + 40
SH = 70
H = 150 + len(ROWS) * (chh + 96 + SH) + 30
sh = Image.new('RGB', (W, H), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((40, 26), '대형 시안 — 근접 맨 앞(셋까지) · 원거리 가운데 · 힐러 · 버퍼 뒤 · 짐꾼 맨 뒤', font=FT, fill=(240, 196, 90))
x = 40
for i, n in enumerate(RN):
    d.rectangle([x, 84, x + 16, 100], fill=RC[i]); d.text((x + 24, 76), n, font=F, fill=(220, 214, 200)); x += 24 + d.textlength(n, font=F) + 34
d.text((40 + cw * 2 + 30 - 360, 76), '발밑 색 점 = 역할 · 한낮 걷는 장면', font=F, fill=(150, 146, 138))
y = 140
for key, desc in ROWS.items():
    d.text((40, y), f'{key}  {desc}', font=FB, fill=(236, 230, 220))
    names = ' · '.join(m[0] for m in meta['new_' + key])
    d.text((40, y + 32), names, font=F, fill=(170, 165, 155))
    for j, tag in enumerate(('old', 'new')):
        im = Image.open(D + f'z_{tag}_{key}.png').crop((X0, Y0, X1, Y1))
        dd = ImageDraw.Draw(im)
        ox = 40 + j * (cw + 30)
        sh.paste(im, (ox, y + 66))
        sy = y + 66 + chh + 6   # 위에서 본 자리 띠: 오른쪽이 앞(적 쪽), 아래가 가까운 줄
        d.rectangle([ox, sy, ox + cw, sy + SH - 8], fill=(36, 34, 42))
        d.text((ox + 10, sy + 2), '위에서 본 자리 — 오른쪽이 앞(적 쪽)', font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 17, index=2), fill=(120, 116, 110))
        for name, cls, lx, ly, ru in meta[f'{tag}_{key}']:
            px, py = ox + lx * K - X0, sy + 8 + (ly - 175) * 1.9
            d.ellipse([px - 9, py - 9, px + 9, py + 9], fill=RC[ROLE.get(cls, 1)], outline=(10, 10, 12), width=2)
            d.text((px, py - 1), name[0], font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 14, index=2), fill=(16, 16, 18), anchor='mm')
        d.text((ox + 10, y + 70), ['지금', '새 대형'][j], font=FB, fill=(255, 255, 255), stroke_width=3, stroke_fill=(0, 0, 0))
    y += chh + 96 + SH
sh.save(D + 'formation_drafts.png'); print(sh.size)
