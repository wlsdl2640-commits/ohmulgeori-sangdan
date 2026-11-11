import sys; sys.path.insert(0, '.')
import books2 as B
from PIL import Image, ImageDraw, ImageFont
V = {
 '1 복면 · 반짝이는 눈 · 씩 웃음': ['.bbbbb.', 'bbwwwbb', 'bkkkkkb', 'bkBkBkb', 'bwwwwkb', 'bwkkkwb', '.bwwwb.'],
 '2 가면 · 치켜뜬 눈 · 비웃음': ['.......', 'kk...kk', 'YkYYYkY', 'YBkYBkY', 'YYYYYYY', '.YkkkY.', '...kk..'],
 '3 두건 그림자 · 빛나는 눈 · 웃는 입': ['..bbb..', '.bbbbb.', 'bkkkkkb', 'bkGkGkb', 'bkkkkkb', 'bkfffkb', '.bkkkb.'],
 '4 가면 · 윙크': ['.......', 'Y.....Y', 'YYYYYYY', 'YkkYBkY', 'YYYYYYY', '.Y.k.Y.', '..kkk..'],
}
S = 6
im = Image.new('RGB', (len(V) * 150 + 20, 200), (19, 22, 30)); d = ImageDraw.Draw(im)
f = ImageFont.truetype('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/Galmuri11.ttf', 11)
for i, (name, pat) in enumerate(V.items()):
    B.SIGIL['rogue'] = pat
    cv = B.skill_b('rogue', '#5a5a6a', 3)
    x0 = 20 + i * 150
    for (x, y), c in cv.px.items(): d.rectangle([x0 + x * S, 20 + y * S, x0 + x * S + S - 1, 20 + y * S + S - 1], fill=tuple(c))
    d.text((x0, 150), name, font=f, fill=(220, 220, 220))
im.save('rogue_opts.png'); print(im.size)
