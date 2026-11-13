"""빌드 69 시안 판 — 짐꾼 · 코네스토가의 회복 스킬 → 운반 · 마차 · 야영 · 피로도 스킬 (c_v69.py)
python3 v69sheet.py → v69_porter.png"""
import sys, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell, c_v69
from PIL import Image, ImageDraw, ImageFont
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 16, index=2)
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
ROWS = [
  ('medkit', '피로도', '물통 돌리기', '짐꾼 공통 · Lv14 · 액티브(강화)',
   ['물통을 돌려 파티 모두의 피로를 6 덜고,', '6초 동안 공격 속도 +8%.', '재사용 15초 · MP 8 · 피로 20 넘은 동료가 있으면 쓴다.'],
   '싸울 때 쌓이는 피로를 덜어 야영으로 멈추는 횟수가 준다.',
   '약상자 — 가장 다친 동료 HP 6% · 출혈 · 중독 풀기'),
  ('shieldbag', '운반', '짐 덜어 주기', '짐꾼 공통 · Lv45 · 액티브(강화)',
   ['동료들의 짐을 대신 져 10초 동안', '파티의 스킬 재사용 대기 −12%.', '이 모험가의 「짐 +%」만큼 지속이 는다(짐 +60%면 16초).', '재사용 18초 · MP 18.'],
   '튼튼한 등짐 · 짐 노새 · 운반술 · 말 돌보기를 키울수록 오래 간다.',
   '보급품 나눠 주기 — 파티 HP 5% · 상태이상 하나 풀기'),
  ('rations', '마차', '웨건 보급', '코네스토가 · Lv116 · 액티브(강화)',
   ['웨건 짐칸을 열어 파티 모두의 화살 · 암기 · 볼트를', '담는 수의 8%씩 채우고, 10초 동안 공격력 ·', '마법 공격력 +10%. 마차를 끌고 왔으면 둘 다 1.5배.', '재사용 22초 · MP 28.'],
   '긴 원정에서 탄약이 바닥나지 않는다(돌아와 채우는 돈도 준다).',
   '비상식량 — 10초 동안 파티 HP 초당 0.8% · 상태이상 하나'),
  ('pioneerwit', '야영', '개척민의 지혜', '코네스토가 · Lv136 · 패시브',
   ['야영 피로 회복 +30% · 야영 중 밤습격 −50%.', '웨건에서 자면 숙면 피로(지금은 여관에서만 풀린다)도', '야영 1초마다 0.15씩 풀린다.'],
   '이름은 그대로, 효과만 바꾼다 — 코네스토가 파티는 원정을 오래 버틴다.',
   '개척민의 지혜 — 회복 · 보호막 +8% · 야영 회복 +20%'),
]
Z = 3; IW = 48 * Z
W_ = 14 + 104 + 16 + 2 * (IW + 14) + 20 + 470
RH = IW + 40
sh = Image.new('RGB', (W_, 60 + len(ROWS) * RH + 70), (21, 23, 28)); d = ImageDraw.Draw(sh)
d.text((14, 10), '짐꾼 · 코네스토가 — 회복 스킬 자리에 운반 · 마차 · 야영 · 피로도 스킬 (그림 A · B 시안)', font=FB, fill=(240, 196, 90))
d.text((14, 34), '지금 그림(작게)은 바뀌는 스킬. 스킬 id는 그대로 두고 이름 · 효과 · 그림만 바꾼다(배운 모험가는 새 스킬로 이어진다).', font=F, fill=(150, 145, 140))
for r, (sid, theme, name, who, eff, why, old) in enumerate(ROWS):
    y0 = 62 + r * RH
    if r: d.line([(14, y0 - 8), (W_ - 14, y0 - 8)], fill=(44, 46, 54))
    oim = Image.open(D / 'final_snap_v67' / f'{sid}.png').convert('RGBA'); oz = cell.zoom(oim, 2)
    sh.paste(oz, (14 + 4, y0 + 10), oz); d.text((14, y0 + 112), '지금', font=FS, fill=(130, 126, 118))
    x = 14 + 104 + 16
    for v in 'ab':
        nm, kind, fn = c_v69.ICONS[f'{sid}_{v}']; im = fn()[0].img(kind); z = cell.zoom(im, Z)
        sh.paste(z, (x, y0), z); sh.paste(im, (x + IW - 50, y0 + IW + 2), im)
        d.text((x + 4, y0 + IW + 8), v.upper() + '안', font=FB, fill=(232, 228, 220))
        x += IW + 14
    tx = x + 14
    d.text((tx, y0 + 2), f'{name}', font=FB, fill=(255, 230, 160)); d.text((tx + 8 + d.textlength(name, font=FB), y0 + 5), f'[{theme}]  {who}', font=F, fill=(170, 200, 230))
    for i, ln in enumerate(eff): d.text((tx, y0 + 30 + i * 19), ln, font=F, fill=(225, 222, 214))
    d.text((tx, y0 + 34 + len(eff) * 19), '→ ' + why, font=FS, fill=(150, 200, 150))
    d.text((tx, y0 + 56 + len(eff) * 19), '지금: ' + old, font=FS, fill=(130, 126, 118))
yb = 62 + len(ROWS) * RH
d.text((14, yb), '같이 바꿀 것: 코네스토가 직업 특성 「개척민의 손」 짐 +6 · 치유량 +6% → 짐 +6 · 피로가 10% 덜 쌓인다 (치유 스킬이 없어져 치유량이 쓸모없다).', font=F, fill=(200, 196, 188))
d.text((14, yb + 22), '네 스킬은 회복 스킬 묶음(스킬북 한 칸 드물게)에서 빠진다. 음유시인 · 마에스트로 · 정령술사의 회복은 그대로.', font=F, fill=(150, 145, 140))
out = D / 'v69_porter.png'; sh.save(out); print(out.name, sh.size)
