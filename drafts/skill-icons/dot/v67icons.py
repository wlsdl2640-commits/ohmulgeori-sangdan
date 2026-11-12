"""빌드 65 (사용자 11-12 17:23 「새 숙련 15개 · 새 스킬 이미지 다만들고 구상해서 시안 보여줘」) — 그림 시안 판
- 게임에 들어간 새 · 바뀐 스킬 54개: 11-11 시안(c_v63 · c_ride63)을 게임 스킬 id · 이름에 맞췄다(시안 id와 게임 id가 다른 것은 MAP).
- 숙련 27개(새로 15 + 지금 12) × 다섯 단계 — 안 배움 · 초급(동) · 중급(은) · 상급(금) · 달인(백금, 4차 Lv150).
- 반짝이는 더하기 꼴을 쓰지 않는다(사용자 규칙): lib.plus · star5 · burst를 비스듬한(X) 꼴로 바꿔 그린다(XPLUS · XSTAR · XBURST).
python3 v67icons.py → v67_1.png … v67_6.png · m_v67.png (+ v67/{게임 id}.png · v67m/{숙련}_{단계}.png 낱장)"""
import sys, json, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell, b4, lib
import c_v63, c_ride63, m_v63, mast, catalog
from PIL import Image, ImageDraw, ImageFont

def XPLUS(a, x, y, c=lib.WH, c2=lib.PALE):
    a.set(x, y, c)
    for dx, dy in ((1, 1), (-1, -1), (1, -1), (-1, 1)): a.set(x + dx, y + dy, c2)
def XSTAR(a, x, y, c=lib.WH, c2=lib.PALE, c3=lib.YEL):
    a.set(x, y, c)
    for dx, dy in ((1, 1), (-1, -1), (1, -1), (-1, 1)): a.set(x + dx, y + dy, c2)
    for dx, dy in ((2, 2), (-2, -2), (2, -2), (-2, 2)): a.set(x + dx, y + dy, c3)
def XBURST(a, x, y, big=True, cols=('#ffffff', '#fff0a0', '#ffc040')):
    if big:
        a.paint(['.y.....y.', '..yh.hy..', '...hwh...', '..hwwwh..', '...hwh...', '..yh.hy..', '.y.....y.'], {'y': cols[2], 'h': cols[1], 'w': cols[0]}, ox=x - 4, oy=y - 3)
    else:
        a.paint(['y...y', '.yhy.', '.hwh.', '.yhy.', 'y...y'], {'y': cols[2], 'h': cols[1], 'w': cols[0]}, ox=x - 2, oy=y - 2)
for mod in (c_v63, c_ride63, m_v63, lib):
    for nm, fn in (('plus', XPLUS), ('star5', XSTAR), ('burst', XBURST)):
        if hasattr(mod, nm): setattr(mod, nm, fn)

# 시안 id → 게임 id (같으면 그대로)
MAP = {'frontierlash': 'pioneerwhip', 'lasso': 'lassowhip', 'caravanwhip': 'wagonlash', 'caravanbanner': 'caravanflag', 'callingcard': 'calling', 'grandshow': 'magicshow',
       'safecracker': 'safecrack', 'thiefcode': 'thieveshonor', 'shurikenvolley': 'shuriburst', 'sneakstrike': 'ambushkill', 'kawarimi': 'logswap', 'spinshuriken': 'spinshuri',
       'shurikenart': 'shurimastery', 'shadowshuriken': 'shadowshuri', 'shadowslash': 'shadowcut', 'phantomshuriken': 'phantomshuri', 'spacecleave': 'spacecut',
       'thousandshadows': 'thousandshuri', 'wristbolt': 'wristshot', 'stalk': 'holdbreath'}
KEEP = {'quickdraw', 'windread', 'wolfpack', 'marksense', 'lineshot', 'arrowtempest', 'surehit', 'holdbreath', 'marktargets', 'tempest', 'finalshot'}   # 보관(샤프슈터 · 데드아이 → 나중에 거너) — 시안 holdbreath(숨 멈춤)는 게임 holdbreath(숨죽이기 = 시안 stalk)와 다르다
GAME = {MAP.get(k, k): k for k in c_v63.ICONS if k not in KEEP}   # 게임 id → 시안 id
SK = json.loads((D / 'v67_skills.json').read_text(encoding='utf-8'))   # 게임 스킬 이름 · 종류 · 직업 (ev로 뽑음)
GROUPS = [
  ('짐꾼 · 마부 · 코네스토가 · 캐러밴마스터', ['medkit', 'shieldbag', 'cargoshield', 'pioneerwhip', 'wagonfort', 'rations', 'lassowhip', 'pioneerwit', 'westward', 'wagonlash', 'caravanflag']),
  ('정찰가 · 탐험가 (정글칼)', ['ambush', 'volley', 'farsight', 'junglecamo', 'vinetrap', 'summit']),
  ('소매치기 · 괴도 · 대도 (트럼프 카드)', ['cardfan', 'bottomdeal', 'calling', 'disguise', 'cardtrick', 'magicshow', 'safecrack', 'thieveshonor', 'nightking']),
  ('닌자 · 카게닌자 (암기 · 단검)', ['shuriburst', 'ambushkill', 'logswap', 'spinshuri', 'deflect', 'shurimastery', 'shadowshuri', 'shadowcut', 'shadowhide', 'phantomshuri', 'spacecut', 'thousandshuri']),
  ('트래커 · 스토커 · 저격수 (컴파운드 보우 · 손목 석궁 · 장궁)', ['wristshot', 'dragonpierce', 'holdbreath', 'wyrmbane', 'slayrain', 'chaintrap', 'firstarrow']),
  ('랑기수 · 용기수 (복합궁 · 탈것) — 늑대 부르기 · 늑대와 한 몸 · 와이번 강하는 지금 그림 그대로', ['beastshot', 'trap', 'camouflage', 'arrowstorm', 'jump', 'gale', 'dragonscale', 'dragonblood', 'dragonfall']),
]
KIND = {'dmg': '공격', 'buff': '강화', 'heal': '회복', 'regen': '회복', 'dot': '지속', 'none': '패시브', 'mdmg': '마법', 'taunt': '도발'}
def skill_img(gid):
    name, kind, fn = c_v63.ICONS[GAME[gid]]; art, _ = fn()
    return art, art.img(kind), kind

FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
def skill_sheets():
    OLD = catalog.collect(); (D / 'v67').mkdir(exist_ok=True)
    PER, CW, RH = 6, 170, 214
    for gi, (title, keys) in enumerate(GROUPS):
        n = len(keys); rows = (n + PER - 1) // PER
        sh = Image.new('RGB', (PER * CW + 12, 40 + rows * RH + 6), (21, 23, 28)); dr = ImageDraw.Draw(sh)
        dr.text((8, 8), f'{title} — 스킬 그림 시안 ({n})', font=FB, fill=(240, 196, 90))
        for i, k in enumerate(keys):
            art, im, kind = skill_img(k); im.save(D / 'v67' / f'{k}.png'); s = SK[k]
            x0 = 8 + (i % PER) * CW; y0 = 40 + (i // PER) * RH
            z3 = cell.zoom(im, 3); sh.paste(z3, (x0, y0), z3)
            if k in OLD and s['has']:   # 지금 게임 그림 (작게)
                o = OLD[k][2]()[0].img(OLD[k][1]); sh.paste(o, (x0 + 146, y0 + 4), o)
                dr.text((x0 + 140, y0 + 54), '지금', font=F, fill=(150, 140, 130))
            dr.text((x0 + 2, y0 + 148), s['n'], font=FB, fill=(232, 228, 220))
            dr.text((x0 + 2, y0 + 168), f"{KIND.get(s['k'], s['k'])} · {s['c']}", font=F, fill=(150, 145, 140))
            dr.text((x0 + 2, y0 + 186), k, font=F, fill=(110, 106, 100))
        out = D / f'v67_{gi + 1}.png'; sh.save(out); print(out.name, sh.size)

# 기승술: 안장 아래 등자 고리가 단계 점과 붙어 글자(P · R)처럼 보여서 숙련 그림에서는 등자를 빼고 안장을 한 칸 내린다
SADDLE_M = [(c, [(4.6, 8.0), (5.6, 8.0), (5.6, 11.4), (4.6, 11.4)] if c == 'L' else pts) for c, pts in c_ride63.SADDLE_V if c not in ('m', '.')]
def g_ride2(a, dy=0):
    cm = {xy: c for xy, c in c_ride63.raster(SADDLE_M, dx=1.2, dy=3.0 + dy).items() if c != '.'}
    c_ride63.sp(a, c_ride63.grid(cm), c_ride63.SADDLEP)
m_v63.MAST63 = [(k, n, th, g_ride2 if k == 'ride' else g) for k, n, th, g in m_v63.MAST63]
# ── 숙련: 새 15(m_v63) + 지금 12(mast) · 달인 = 점 셋 흰 금빛 + 점 위 작은 별 + 백금 틀
FRAME4 = m_v63.FRAME4
def frame_img(art, fr):
    im = art.img('buff'); px = im.load(); hb = b4.hexbase('buff').load()
    m = {b4.rgb(mast.FRAME0[i]): b4.rgb(fr[i]) for i in range(3)}
    for y in range(48):
        for x in range(48):
            c = hb[x, y]
            if c[3] and c[:3] in m: px[x, y] = m[c[:3]] + (255,)
    return im
def old_art(k, lit):
    if lit < 4: return mast.mast_art(k, lit)
    a = mast.mast_art(k, 3)
    for i in range(3):
        x = 4 + i * 3
        for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)): a.set(x + dx, 16 + dy, '#fffbe8' if (dx, dy) == (0, 0) else '#d8c070')
    a.set(7, 15, '#ffffff'); a.set(8, 15, '#fff0a0')
    return a
def mast_img(k, lit, new):
    if new: return m_v63.img63(k, lit), m_v63.art63(k, lit)
    art = old_art(k, lit)
    return (art.img('buff') if not lit else frame_img(art, FRAME4 if lit == 4 else mast.FRAME[lit - 1])), art
MAST_ALL = [(k, nm, True) for k, nm, _, _ in m_v63.MAST63] + [(k, nm, False) for k, nm, _, _ in mast.MAST]
def mast_sheet():
    (D / 'v67m').mkdir(exist_ok=True)
    Z = 2; CW = 48 * Z + 8; LW = 104; COLS = 2
    per = (len(MAST_ALL) + COLS - 1) // COLS; RH = 48 * Z + 10
    sh = Image.new('RGB', (COLS * (LW + 5 * CW + 20) + 10, 78 + per * RH), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 8), '숙련 27개 — 새로 15(위 15줄) + 지금 12(달인 단계만 새로) · 칸: 안 배움 · 초급(동) · 중급(은) · 상급(금) · 달인(백금 · 4차 Lv150)', font=FB, fill=(240, 196, 90))
    d.text((10, 30), '단계 점 셋 + 틀 색(지금 게임과 같은 B안). 달인은 점 셋이 흰 금빛 · 점 위 작은 빛 · 틀 백금.', font=F, fill=(160, 155, 145))
    for c in range(COLS):
        for t, tt in enumerate(['안 배움', '초급', '중급', '상급', '달인']): d.text((10 + c * (LW + 5 * CW + 20) + LW + t * CW + 24, 54), tt, font=F, fill=(170, 165, 155))
    for i, (k, name, new) in enumerate(MAST_ALL):
        c, r = i // per, i % per; x0 = 10 + c * (LW + 5 * CW + 20); y0 = 74 + r * RH
        d.text((x0, y0 + 32), name, font=FB, fill=(232, 228, 220) if new else (190, 186, 178))
        d.text((x0, y0 + 52), '새로' if new else '지금', font=F, fill=(240, 196, 90) if new else (130, 126, 118))
        for t in range(5):
            im, _ = mast_img(k, t, new); im.save(D / 'v67m' / f'{k}_{t}.png')
            z = cell.zoom(im, Z); sh.paste(z, (x0 + LW + t * CW, y0), z)
    out = D / 'm_v67.png'; sh.save(out); print(out.name, sh.size)

if __name__ == '__main__':
    skill_sheets(); mast_sheet()
