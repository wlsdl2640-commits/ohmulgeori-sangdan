"""빌드 69 시안 판 — 해룡기수 스킬 그림 여섯 × A · B (c_v69s.py)
python3 v69ssheet.py → v69_seadragoon.png"""
import sys, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell, c_v69s
from PIL import Image, ImageDraw, ImageFont
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16, index=2)
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
ROWS = [
  ('tidalshot', '물살 화살', 'Lv150 · 고유', ['해룡이 뿜은 물살을 타고 화살 세 발 —', '맨 앞 적과 그 뒤 적까지 꿰뚫는다. ×1.8 × 3 · 7초'], ('물살 꼬리를 끌며 나란히 오르는 화살 셋', '물줄기를 타고 나란히 나는 화살 셋')),
  ('bubbleprison', '거품 감옥', 'Lv158', ['가장 센 적을 거품에 가둬 4초 동안', '아무것도 못 하게(맞으면 터짐 · 우두머리는 절반)'], ('큰 거품 속에 잠든 적', '화살이 꽂힌 거품 송이')),
  ('deepblood', '깊은 바다의 피', 'Lv166 · 패시브', ['치명타 +6%p · 공격 속도 +10% ·', '물 속성 피해 +20%'], ('깊은 바다빛 핏방울', '물결 위 푸른 심장')),
  ('tsunami', '해일', 'Lv176', ['모든 적을 두 번 ×1.6 · 냉기 30% ·', '내려온 2초는 기본 공격을 맞음'], ('덮쳐 오는 큰 파도', '겹친 파도 둘 + 물보라')),
  ('abyssroar', '심해의 포효', 'Lv186', ['모든 적 공포 30%(3초) · 10초 동안', '파티 공격 +15% · 받는 피해 −10%'], ('입을 벌린 해룡 머리 + 포효 물결', '어둠 속 해룡의 눈 + 포효 고리')),
  ('searoyal', '해룡왕의 화살', 'Lv196', ['가장 센 적에게 거대한 화살 한 발 ×9.0 ·', '우두머리에게 1.3배'], ('물기둥을 타고 내리꽂는 큰 화살', '왕관 아래 큰 화살')),
]
Z = 3; IW = 48 * Z
W_ = 14 + 2 * (IW + 150) + 380
RH = IW + 44
sh = Image.new('RGB', (W_, 70 + len(ROWS) * RH + 20), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((14, 10), '해룡기수(용기수 다음 4차) 스킬 그림 시안 — 스킬마다 A · B (게임은 고른 뒤에, 지금은 예전 글리프)', font=FB, fill=(240, 196, 90))
d.text((14, 34), '모두 물 속성 — 물빛 · 거품 · 물보라. 반짝이는 비스듬한 점만(십자 · 더하기 꼴 없음). 해룡 머리는 산호 해룡(A) 빛깔.', font=F, fill=(150, 145, 140))
for r, (sid, name, lv, eff, what) in enumerate(ROWS):
    y0 = 66 + r * RH
    if r: d.line([(14, y0 - 8), (W_ - 14, y0 - 8)], fill=(44, 46, 54))
    x = 14
    for i, v in enumerate('ab'):
        nm, kind, fn = c_v69s.ICONS[f'{sid}_{v}']; im = fn()[0].img(kind); z = cell.zoom(im, Z)
        sh.paste(z, (x, y0), z); sh.paste(im, (x + IW + 8, y0 + IW - 48), im)
        d.text((x + IW + 8, y0 + 4), v.upper() + '안', font=FB, fill=(232, 228, 220))
        for j, ln in enumerate([what[i][k:k + 8] for k in range(0, len(what[i]), 8)]): d.text((x + IW + 8, y0 + 28 + j * 16), ln, font=FS, fill=(170, 200, 230))
        x += IW + 150
    tx = x + 4
    d.text((tx, y0 + 2), name, font=FB, fill=(255, 230, 160)); d.text((tx + 8 + d.textlength(name, font=FB), y0 + 5), lv, font=F, fill=(170, 200, 230))
    for i, ln in enumerate(eff): d.text((tx, y0 + 30 + i * 19), ln, font=F, fill=(225, 222, 214))
out = D / 'v69_seadragoon.png'; sh.save(out); print(out.name, sh.size)
