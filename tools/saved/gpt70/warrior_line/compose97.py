"""전사 계열 그림 모음 판: python3 compose97.py <out97> <출력 폴더>"""
import json, base64, io, sys, os
from PIL import Image, ImageDraw, ImageFont
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FB if b else FR, n, index=2)
GOLD, TXT, SUB, DIM, BG, PANEL, PANEL2 = (240, 196, 90), (236, 230, 220), (160, 156, 148), (110, 108, 104), (21, 23, 28), (44, 48, 58), (34, 36, 42)
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
JOBS = {j['c']: j for j in json.load(open(os.path.join(SRC, 'jobs.json')))}
G = json.load(open(os.path.join(SRC, 'gear.json')))
GEARNOTE = {'warrior': '장검 · 라운드 실드 (몽둥이 · 도끼 · 카이트 · 탑 방패도)', 'gladiator': '글라디우스 · 버클러 (단검 · 삼지창도)', 'champion': '글라디우스 · 버클러',
            'knight': '장검 · 십자 방패 (철퇴 · 창 · 삼지창도)', 'paladin': '장검 · 십자 방패', 'berserker': '대검 (두 손 — 방패 없음) · 속성 대검', 'bloodlord': '대검 (두 손) · 속성 대검',
            'spellblade': '마나소드 · 에테르 실드', 'arcblade': '마나소드 · 에테르 실드'}
COLS = 11; CW, IH = 104, 96

def wrap(d, s, f, w):
    out, cur = [], ''
    for ch in s:
        if d.textlength(cur + ch, font=f) > w: out.append(cur); cur = ch
        else: cur += ch
    if cur: out.append(cur)
    return out

def icon_img(it):
    im = img(it['u'])
    if max(im.size) <= 24:   # 도트 그림 (20칸 · 10칸) → 정수배
        k = 80 // max(im.size); im = im.resize((im.width * k, im.height * k), Image.NEAREST)
    return im

def sheet(title, sub, sections, fn):
    W = 40 + COLS * CW; S = Image.new('RGBA', (W, 8000), BG + (255,)); d = ImageDraw.Draw(S); y = 18
    d.text((20, y), title, font=fnt(28, True), fill=GOLD); y += 44
    for ln in sub: d.text((20, y), ln, font=fnt(15), fill=SUB); y += 22
    y += 12
    for head, note, items in sections:
        d.text((20, y), head, font=fnt(20, True), fill=TXT); y += 30
        if note: d.text((20, y), note, font=fnt(14), fill=SUB); y += 24
        rows = (len(items) + COLS - 1) // COLS
        for i, it in enumerate(items):
            x, yy = 20 + (i % COLS) * CW, y + (i // COLS) * (IH + 64)
            future = '안 나옴' in (it.get('note') or '')
            d.rectangle((x, yy, x + CW - 6, yy + IH + 4), fill=PANEL2 if future else PANEL)
            im = icon_img(it); S.alpha_composite(im, (x + (CW - 6 - im.width) // 2, yy + 2 + (IH - im.height) // 2))
            nm = it['name'] or (f"Lv{it['lv']} 디자인" if it.get('lv') else f"Lv{160 + (it['idx'] - 16) * 10} 디자인" if it.get('idx') is not None and it['idx'] >= 16 else '다음 단계 디자인')   # 방어구 판: 21장 = Lv1 · 10 · … · 200 디자인, 16번부터 Lv160
            for k, ln in enumerate(wrap(d, nm, fnt(12), CW - 8)[:2]): d.text((x + 2, yy + IH + 6 + k * 16), ln, font=fnt(12), fill=DIM if future else TXT)
            tag = ' · '.join(x for x in [f"Lv{it['lv']}" if it.get('lv') else '', it.get('note') or ''] if x)
            d.text((x + 2, yy + IH + 40), tag, font=fnt(11), fill=GOLD if it.get('note') == '대장간에서만' else DIM if future else SUB)
        y += rows * (IH + 64) + 18
    S = S.crop((0, 0, W, y)); S.convert('RGB').save(os.path.join(OUT, fn)); print(fn, S.size)

def gsec(b, head=None, note=None, label=None):
    g = G[b]; n = len(g['items']); fut = sum(1 for i in g['items'] if '안 나옴' in (i.get('note') or ''))
    h = head or f"{label or g['name']} — {n}장"
    nt = note if note is not None else f"쓰는 직업: {' · '.join(g['who'])}" + (f" · 회색 칸 {fut}장은 다음 단계용(아직 게임에 안 나옴)" if fut else '')
    return (h, nt, g['items'])

# ── 장비 ──
LEG = ['칸 아래: 게임 속 이름 · 착용 레벨 · 금색 「대장간에서만」 = 막 전직한 Lv50용으로 대장간에서만 만든다 · 회색 칸 = 그려 둔 다음 단계(Lv150 ~ 200)용, 아직 안 나옴',
       '큰 그림(디자인 그림)은 96칸 그대로, 도트 그림(20칸 · 10칸)은 정수배로 키움 — 게임에서는 레어도 틀 안에 들어간다']
sheet('전사 계열 무기 ① — 전사(1차)부터', LEG, [gsec('sword'), gsec('club', note='쓰는 직업: 전사 계열 전부 (다른 근접 계열도 씀)'), gsec('axe', note='쓰는 직업: 전사 계열 전부 (다른 근접 계열도 씀)')], 'warrior_weapons_1.png')
rs = G['rs_fire']['items'] + G['rs_ice']['items'] + G['rs_light']['items'] + G['rs_poison']['items']
sheet('전사 계열 무기 ② — 2차 직업부터 (Lv50)', LEG, [
    gsec('gladius', note='검투사 · 챔피언 주무기 · 착용 레벨 사다리 Lv50 · 55 · 60 … (그림 차례 = 착용 레벨)'), gsec('dagger', note='검투사 · 챔피언도 낄 수 있음 (도적 계열 주무기)'),
    gsec('trident', note='검투사 · 챔피언 · 기사 · 성기사 — 투기장 상단 전용 · 그림 없음(공용 도트)'), gsec('mace', note='기사 · 성기사도 낄 수 있음 (성직자 계열 주무기)'),
    gsec('lance', note='기사 · 성기사'), gsec('great', note='광전사 · 피의 군주 주무기 (두 손)'),
    ('속성 대검 — 4장', '광전사 · 피의 군주 · 레벨마다 한 자루 (불 Lv50 · 빙결 Lv100 · 빛 Lv150 · 독 Lv200)', rs), gsec('manasword', note='마검사 · 마검성 주무기')], 'warrior_weapons_2.png')
sheet('전사 계열 방패 · 부장비', LEG, [
    gsec('shield', note='전사 계열 공용 방패 (전사 기본 방패)'), gsec('kite', note='전사 계열 공용 · 디자인 그림 없음(도트 4모습)'), gsec('tower', note='전사 계열 공용 · 디자인 그림 없음(도트 4모습)'),
    gsec('buckler', note='검투사 · 챔피언 전용 · 착용 레벨 사다리'), gsec('cross', note='기사 · 성기사 전용 · 착용 레벨 사다리'), gsec('ether', note='마검사 · 마검성 전용 (마나 막 구슬) · 착용 레벨 사다리')], 'warrior_offhands.png')
sheet('전사 계열 방어구 ① — 상의 · 하의', LEG, [
    gsec('larmor', note='전사 · 검투사 · 챔피언 (기사 · 광전사 · 마검사 계열은 못 입음)'), gsec('lpants', note='전사 · 검투사 · 챔피언'),
    gsec('hvarmor', note='기사 · 성기사 · 광전사 · 피의 군주 · 착용 레벨 사다리'), gsec('hvpants', note='기사 · 성기사 · 광전사 · 피의 군주'),
    gsec('plate', note='마검사 · 마검성 (용기수 · 심판관도) · 착용 레벨 사다리'), gsec('ppants', note='마검사 · 마검성')], 'warrior_armor_1.png')
sheet('전사 계열 방어구 ② — 장갑 · 신발 · 그 밖의 갑옷', LEG, [
    gsec('pgloves', note='전사 계열 전부 (짐꾼 계열도)'), gsec('pboots', note='전사 계열 전부 (짐꾼 계열도)'),
    gsec('leather', note='전사 계열도 입을 수 있는 가죽 갑옷 (궁수 · 도적 · 짐꾼 계열 주 갑옷) · 디자인 그림 없음(공용 도트)'),
    gsec('arenamail', note='투기장 상단 흉갑 · 디자인 그림 없음(공용 도트)')], 'warrior_armor_2.png')

# ── 스킬 그림 ──
def skill_sheet(title, sub, jobs, fn, Z=6):
    CWs, IHs = 16 * Z + 30, 20 * Z; cols = 8; W = 40 + cols * CWs
    S = Image.new('RGBA', (W, 6000), BG + (255,)); d = ImageDraw.Draw(S); y = 18
    d.text((20, y), title, font=fnt(28, True), fill=GOLD); y += 44
    for ln in sub: d.text((20, y), ln, font=fnt(15), fill=SUB); y += 22
    y += 12
    for c in jobs:
        j = JOBS[c]; tierTxt = {1: '1차', 2: '2차 · Lv50 전직', 3: '3차 · Lv100 전직'}[j['tier']]
        frm = f" · {JOBS[j['from']]['name']}에서" if j['from'] else ''
        d.text((20, y), f"{j['name']}", font=fnt(24, True), fill=TXT); d.text((20 + d.textlength(j['name'], font=fnt(24, True)) + 12, y + 6), f"{tierTxt}{frm} · 스킬 {len(j['skills'])}개", font=fnt(15), fill=GOLD); y += 34
        d.text((20, y), f"「{j['desc']}」 · {GEARNOTE[c]}", font=fnt(14), fill=SUB); y += 26
        for i, s in enumerate(j['skills']):
            x, yy = 20 + (i % cols) * CWs, y + (i // cols) * (IHs + 52)
            if s['cells']:
                art = Image.new('RGBA', (16, 20)); px = art.load()
                for k, col in enumerate(s['cells']): px[k % 16, k // 16] = tuple(int(col[q:q + 2], 16) for q in (1, 3, 5)) + (255,)
                S.alpha_composite(art.resize((16 * Z, IHs), Image.NEAREST), (x, yy))
            else: d.rectangle((x, yy, x + 16 * Z, yy + IHs), outline=DIM); d.text((x + 8, yy + IHs // 2 - 8), '그림 없음', font=fnt(13), fill=DIM)
            d.text((x, yy + IHs + 4), s['name'], font=fnt(14, True), fill=TXT)
            k = {'dmg': '공격', 'mdmg': '마법 공격', 'buff': '강화', 'heal': '치유', 'regen': '재생', 'taunt': '도발', 'passive': '지속', 'shield': '보호막', 'dot': '지속 피해', 'cure': '해제', 'revive': '부활'}.get(s['kind'], s['kind'])
            d.text((x, yy + IHs + 24), f"Lv{s['lv']} · {k}" + (' · 공유' if s['other'] else ''), font=fnt(12), fill=SUB)
        y += ((len(j['skills']) + cols - 1) // cols) * (IHs + 52) + 22
    S = S.crop((0, 0, W, y)); S.convert('RGB').save(os.path.join(OUT, fn)); print(fn, S.size)
SUBS = ['스킬 그림 원본 16×20칸을 6배로 — 게임에서는 육각 틀(코드가 그림)에 넣어 보인다 · Lv = 배우는 레벨 (Lv1 = 전직할 때 받는 직업 기본 스킬)']
skill_sheet('전사 (1차) — 스킬 그림 13개', SUBS + ['전사 계열 공통: 1차부터 배우고 2 · 3차도 배운다 · 「공유」 = 다른 계열도 배움(되치기 — 도적 · 충격파 — 짐꾼)'], ['warrior'], 'warrior_skills_1.png')
skill_sheet('전사 계열 2차 직업 — 이름 · 스킬 그림', SUBS, ['gladiator', 'knight', 'berserker', 'spellblade'], 'warrior_skills_2.png')
skill_sheet('전사 계열 3차 직업 — 이름 · 스킬 그림', SUBS, ['champion', 'paladin', 'bloodlord', 'arcblade'], 'warrior_skills_3.png')
