"""전사 1차 참고 판 그리기: python3 compose96.py <out 폴더(run96 결과)> <출력 폴더> [제목 꼬리표 — 없으면 「지금 게임 그림」]
   11-19: 전사 1차가 리마스터 그림으로 바뀐 뒤(빌드 71)에는 꼬리표를 「옛 그림 …」으로 준다 · 글자 없는 낱장 판 warrior1_0_sprites.png(투명 바탕)도 함께 낸다
   (run96.py를 새 빌드에서 다시 돌리면 전투 장면에는 리마스터 전사가 찍힌다 — 옛 그림 판은 11-18에 뽑아 둔 out 폴더로 만든다)"""
import json, base64, io, sys, os
from PIL import Image, ImageDraw, ImageFont
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
TAG = sys.argv[3] if len(sys.argv) > 3 else '지금 게임 그림'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FB if b else FR, n, index=2)
GOLD, TXT, SUB, BG, PANEL = (240, 196, 90), (236, 230, 220), (160, 156, 148), (21, 23, 28), (44, 48, 58)
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
J = lambda n: json.load(open(os.path.join(SRC, n)))
look, mots, icons = J('look.json'), J('mots.json'), J('icons.json')
SKN = {'bash': '강타', 'taunt': '도발 1', 'ironwall': '철벽', 'ironskin': '강철 피부', 'sweep': '휩쓸기', 'berserk': '광폭화', 'riposte': '되치기', 'resolve': '결의',
       'earthsplit': '대지 가르기', 'shockwave': '충격파', 'warcry': '전쟁의 함성', 'guardian': '수호자', 'titanblow': '거인의 일격'}
SKI = {   # 배우는 레벨 · 종류 · 하는 일 · 동작 · 효과(게임 SKFX)
 'bash': (1, '공격 · 앞의 적', '앞의 적을 세게 내리친다 (공격력 ×2.7) · 기절 20% 2초 · 재사용 8초', '내려베기', '모으기 빛 → 칼 자취 → 별 터짐(크게) → 먼지 · 화면 흔들림'),
 'taunt': (5, '도발', '12초 동안 모든 적이 자신만 노린다 · 재사용 24초', '칼끝 겨누기', '도발 표시(!) 퍼짐'),
 'ironwall': (10, '강화 · 자신', '12초 동안 방어력 ×2 · 재사용 32초', '방패 세우기', '방패 막(배리어)'),
 'ironskin': (14, '지속 효과', '방어력 +20%', '—', '—'),
 'sweep': (15, '공격 · 모든 적', '모든 적을 베어 낸다 (공격력 ×1.65) · 재사용 16초', '횡베기', '모으기 빛 → 칼 자취 → 초승달 바람 날아감'),
 'berserk': (22, '강화 · 자신', 'HP 15%를 깎아 16초 동안 공격력 ×1.6 · 공격 속도 ×1.25 · 재사용 40초', '칼 치켜들기', '붉은 분노 기운'),
 'riposte': (22, '강화 · 자신', '맞으면 되받아친다 (되치기) · 도적 계열과 함께 씀', '되치기 자세', '되치기 표시'),
 'resolve': (26, '강화 · 파티', '파티의 방어 · 버팀을 올린다 · 공포를 푼다', '방패 세우기', '강철빛 막 — 파티 모두에게'),
 'earthsplit': (32, '공격 · 모든 적 · 흙', '땅을 내리쳐 모든 적을 벤다 (공격력 ×2.4) · 기절 20% 1.5초 · 재사용 20초', '내려베기', '빛이 모임 → 칼 자취 → 땅 금 퍼짐 · 화면 흔들림'),
 'shockwave': (40, '공격 · 모든 적', '충격파로 모든 적을 친다 · 짐꾼 계열과 함께 씀', '내려베기', '빛이 모임 → 칼 자취 → 땅 금 퍼짐 · 화면 흔들림'),
 'warcry': (45, '강화 · 파티', '20초 동안 파티 공격력 ×1.3 · 공격 속도 ×1.15 · 재사용 40초', '칼 치켜들기', '함성 고리 — 파티 모두에게'),
 'guardian': (60, '지속 효과', '최대 HP +10%', '—', '—'),
 'titanblow': (75, '공격 · 앞의 적', '모든 힘을 실어 내리친다 (공격력 ×6.3) · 기절 30% 2초 · 보스에게 더 아픔 · 재사용 28초', '내려베기', '온몸 기운 → 굵은 칼 자취 → 큰 별 터짐 → 고리 · 크게 흔들림'),
}
MOTN = [('down', '내려베기', '기본 공격 · 강타 · 대지 가르기 · 충격파 · 거인의 일격'), ('up', '올려베기', '기본 공격'), ('side', '횡베기', '기본 공격 · 휩쓸기'),
        ('thrust', '찌르기', '기본 공격'), ('bash', '방패 밀기', '방패를 들면 기본 공격에 섞인다'), ('block', '방패 막기', '맞을 때 막으면'),
        ('raise', '칼 치켜들기', '광폭화 · 전쟁의 함성 · 그 밖의 강화'), ('guard', '방패 세우기', '철벽 · 결의 · 방어 강화'), ('salute', '칼 세우기', '치유 (공용 붕대 감기 · 재기)'),
        ('taunt', '칼끝 겨누기', '도발'), ('parry', '흘려 받기', '검투사부터 (전사 1차는 안 씀)'), ('ready', '되치기 자세', '되치기'), ('toss', '모래 뿌리기', '지금 쓰는 스킬 없음')]

def paste_spr(S, s, X, Y, Z, dx=0):
    im = img(s['u']); big = im.resize((im.width * Z, im.height * Z), Image.NEAREST)
    S.alpha_composite(big, (round(X + dx * Z - s['ax'] * Z), round(Y - s['ay'] * Z)))

# ── 1. 생김새 ──
Z = 5; poses = [('idle0', '서 있기 1'), ('idle1', '서 있기 2'), ('walk0', '걷기 1'), ('walk1', '걷기 2'), ('walk2', '걷기 3'), ('walk3', '걷기 4'), ('sit0', '앉기 (야영)'), ('sleep0', '자기 (야영)'), ('down0', '쓰러짐')]
CW, CH = 44 * Z, 40 * Z
S = Image.new('RGBA', (40 + len(poses) * (CW + 8), 140 + 2 * (CH + 70) + 330), BG + (255,)); d = ImageDraw.Draw(S); y = 18
d.text((20, y), f'전사 (1차) — {TAG}', font=fnt(30, True), fill=GOLD); y += 46
d.text((20, y), '「앞에 서서 적의 공격을 받아낸다.」 · 오른손 장검 · 왼손 라운드 실드 · 갑옷(경갑 상 · 하의 · 판금 장갑 · 판금 신발)은 그림에 안 그려진다', font=fnt(16), fill=SUB); y += 26
d.text((20, y), f'{Z}배로 키움 · 뭉툭 도트 한 칸 = 게임 화면 2×2 픽셀 · 옆모습 서 있기 13×17칸 · 앞모습 16×16칸(무기 · 방패 포함)', font=fnt(16), fill=SUB); y += 40
for side, title in (('side', '옆모습 — 전투 · 원정 (오른쪽을 본다, 적은 오른쪽)'), ('front', '앞모습 — 길드 앞 · 본부 · 모험가 창')):
    d.text((20, y), title, font=fnt(19, True), fill=TXT); y += 32
    for i, (k, nm) in enumerate(poses):
        x = 20 + i * (CW + 8); d.rectangle((x, y, x + CW, y + CH), fill=PANEL)
        if side == 'front' and k == 'down0': d.text((x + 14, y + CH // 2 - 10), '앞모습은 없음', font=fnt(16), fill=SUB)
        else: s = look[side][k]; paste_spr(S, s, x + CW // 2 - 4 * Z, y + CH - 4 * Z, Z)
        d.text((x + 6, y + CH + 4), nm, font=fnt(15), fill=SUB)
    y += CH + 40
d.text((20, y), '게임 속 실제 크기 (전투 화면 1배 — 폰에서는 이것을 화면 너비로 키운다)', font=fnt(19, True), fill=TXT); y += 32
sc = img(J('sk_bash.json')['frames'][0]); S.alpha_composite(sc, (20, y)); y += sc.height + 20
S = S.crop((0, 0, S.width, y)); S.convert('RGB').save(os.path.join(OUT, 'warrior1_1_look.png')); print('look', S.size)

# ── 0. 낱장 (글자 없이 · 투명 바탕 · 8배 — 위 줄 옆모습 · 아래 줄 앞모습, 차례는 1번 판과 같다) ──
Z0 = 8; C0W, C0H = 44 * Z0, 38 * Z0
S0 = Image.new('RGBA', (len(poses) * C0W, 2 * C0H), (0, 0, 0, 0))
for r, side in enumerate(('side', 'front')):
    for i, (k, _) in enumerate(poses):
        if side == 'front' and k == 'down0': continue
        paste_spr(S0, look[side][k], i * C0W + C0W // 2 - 4 * Z0, r * C0H + C0H - 3 * Z0, Z0)
S0.save(os.path.join(OUT, 'warrior1_0_sprites.png')); print('sprites', S0.size)

# ── 2. 동작 ──
Z = 3; xs, ys = [], []
for mk, _, _ in MOTN:
    for s in mots[mk]['f']:
        xs += [2 * s['dx'] - s['ax'], 2 * s['dx'] - s['ax'] + s['w']]; ys += [-s['ay'], -s['ay'] + s['h']]
        if s['mfx']:
            for L in (s['mfx']['back'], s['mfx']['front']):
                for X, Y, ci in L: xs += [2 * X - 19, 2 * X - 17]; ys += [2 * Y - 47, 2 * Y - 45]
x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys); FW, FH = (x1 - x0 + 4) * Z, (y1 - y0 + 4) * Z
LW = 250; PAL = [(255, 255, 255), (255, 242, 160), (168, 160, 144)]
S = Image.new('RGBA', (LW + 8 * (FW + 6) + 20, 150 + len(MOTN) * (FH + 34)), BG + (255,)); d = ImageDraw.Draw(S); y = 18
d.text((20, y), '전사 (1차) — 동작 (옆모습 · 장검 + 라운드 실드)' + ('' if len(sys.argv) <= 3 else ' · ' + TAG), font=fnt(30, True), fill=GOLD); y += 46
d.text((20, y), f'동작마다 8장 · {Z}배 · 흰 · 노란 칸은 칼 자취(게임이 동작에 붙여 그림) · 장 밑 숫자 = 그 장을 보여 주는 시간(초) · 금색 테 = 맞히는 장(이때 피해 숫자가 뜬다)', font=fnt(16), fill=SUB); y += 26
d.text((20, y), '서 있기 · 걷기는 1번 판. 탈것 · 쌍검 동작은 전사 1차에 없음.', font=fnt(16), fill=SUB); y += 36
for mk, nm, use in MOTN:
    M = mots[mk]; d.text((20, y + 8), nm, font=fnt(20, True), fill=TXT); d.text((20, y + 38), mk, font=fnt(14), fill=SUB)
    lines = [use[i:i + 15] for i in range(0, len(use), 15)]
    for k, ln in enumerate(lines[:4]): d.text((20, y + 60 + k * 20), ln, font=fnt(14), fill=SUB)
    for f, s in enumerate(M['f']):
        x = LW + f * (FW + 6); hit = f == M['hit']
        d.rectangle((x, y, x + FW - 1, y + FH - 1), fill=PANEL, outline=GOLD if hit else None, width=3 if hit else 0)
        OX, OY = x + (2 - x0) * Z, y + (2 - y0) * Z
        paste_spr(S, s, OX, OY, Z, 2 * s['dx'] + 2 * s.get('jy', 0) * 0)
        if s['mfx']:
            for L in (s['mfx']['back'], s['mfx']['front']):
                for X, Y, ci in L: d.rectangle((OX + (2 * X - 19) * Z, OY + (2 * Y - 47) * Z, OX + (2 * X - 17) * Z - 1, OY + (2 * Y - 45) * Z - 1), fill=PAL[ci])
        d.text((x + 4, y + FH + 2), f"{M['T'][f]:.3f}" + (' 맞힘' if hit else ''), font=fnt(13), fill=GOLD if hit else SUB)
    y += FH + 34
S = S.crop((0, 0, S.width, y)); S.convert('RGB').save(os.path.join(OUT, 'warrior1_2_motions.png')); print('motions', S.size, 'frame', FW, FH)

# ── 3 · 4. 스킬 효과 단계 띠 + GIF ──
def stages(sid):
    r = J(f'sk_{sid}.json'); taus = r['taus']; h = r['hitAt']
    want = [0.06, h * 0.6, h, h + 0.1, h + 0.3, h + 0.7] if not r['cast'] else [0.06, h * 0.7, h + 0.15, h + 0.45, h + 0.8, h + 1.2]
    idx = [min(range(len(taus)), key=lambda i: abs(taus[i] - w)) for w in want]
    return r, idx
def skill_sheet(ids, title, fn):
    LW = 330; CR = (0, 40, 410, 200); fr0 = img(J(f'sk_{ids[0]}.json')['frames'][0]).crop(CR); PW, PH = fr0.size
    S = Image.new('RGBA', (LW + 6 * (PW + 6) + 14, 120 + len(ids) * (max(PH, 210) + 30)), BG + (255,)); d = ImageDraw.Draw(S); y = 18
    d.text((20, y), title, font=fnt(30, True), fill=GOLD); y += 46
    d.text((20, y), '실제 게임 전투 화면(1배) · 왼쪽 → 오른쪽 시간 순서 · 장 위 숫자 = 쓴 뒤 지난 초', font=fnt(16), fill=SUB); y += 40
    icon = {c['id']: c for c in icons}
    for sid in ids:
        r, idx = stages(sid); lv, kind, what, mot, fx = SKI[sid]
        hx = img(icon[sid]['hex']); S.alpha_composite(hx.resize((96, 96), Image.NEAREST), (20, y + 24))
        d.text((126, y + 24), SKN[sid], font=fnt(21, True), fill=TXT); d.text((126, y + 54), f'Lv{lv} · {kind}', font=fnt(15), fill=SUB)
        d.text((126, y + 76), f'동작: {mot}', font=fnt(15), fill=SUB)
        for k, ln in enumerate([fx[i:i + 19] for i in range(0, len(fx), 19)][:4]): d.text((20, y + 128 + k * 20), ln, font=fnt(14), fill=SUB)
        for j, i in enumerate(idx):
            x = LW + j * (PW + 6); S.alpha_composite(img(r['frames'][i]).crop(CR), (x, y + 20)); d.text((x + 4, y), f"{r['taus'][i]:.2f}초", font=fnt(14), fill=GOLD if abs(r['taus'][i] - r['hitAt']) < 0.03 and not r['cast'] else SUB)
        y += max(PH, 210) + 30
    S = S.crop((0, 0, S.width, y)); S.convert('RGB').save(os.path.join(OUT, fn + '.png')); print(fn, S.size)
    # GIF: 두 줄 격자, 모든 장
    cols = 2; rows = (len(ids) + 1) // 2; GC = (40, 40, 410, 200); PW, PH = (GC[2] - GC[0]) * 2, (GC[3] - GC[1]) * 2
    n = len(J(f'sk_{ids[0]}.json')['frames']); frames = []
    shots = {sid: [(lambda q: q.resize((q.width * 2, q.height * 2), Image.NEAREST))(img(u).crop(GC)) for u in J(f'sk_{sid}.json')['frames']] for sid in ids}
    for k in range(n):
        im = Image.new('RGB', (cols * (PW + 6) + 6, rows * (PH + 26) + 6), BG); dd = ImageDraw.Draw(im)
        for j, sid in enumerate(ids):
            x, yy = 6 + (j % cols) * (PW + 6), 6 + (j // cols) * (PH + 26)
            dd.text((x + 2, yy), SKN[sid], font=fnt(16, True), fill=TXT); im.paste(shots[sid][k].convert('RGB'), (x, yy + 22))
        frames.append(im)
    smp = Image.new('RGB', (frames[0].width, frames[0].height * 6))
    for q, f0 in enumerate(frames[::max(1, n // 6)][:6]): smp.paste(f0, (0, q * frames[0].height))
    pal = smp.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    qf = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    qf[0].save(os.path.join(OUT, fn + '.gif'), save_all=True, append_images=qf[1:], duration=[300] + [40] * (n - 2) + [700], loop=0, disposal=1); print(fn + '.gif', frames[0].size, n)
skill_sheet(['bash', 'sweep', 'earthsplit', 'shockwave', 'titanblow'], '전사 (1차) — 공격 스킬 효과', 'warrior1_3_skills_attack')
skill_sheet(['taunt', 'ironwall', 'berserk', 'riposte', 'resolve', 'warcry'], '전사 (1차) — 강화 · 도발 스킬 효과', 'warrior1_4_skills_buff')

# ── 5. 스킬 그림 ──
Z = 9; IW, IH = 16 * Z, 20 * Z; cols = 5; CWI = IW + 130
S = Image.new('RGBA', (20 + cols * (CWI + 16), 130 + ((len(icons) + cols - 1) // cols) * (IH + 90)), BG + (255,)); d = ImageDraw.Draw(S)
d.text((20, 18), '전사 (1차) — 스킬 그림 13개', font=fnt(30, True), fill=GOLD)
d.text((20, 64), f'왼쪽 = 그림 원본(16×20칸, {Z}배) · 오른쪽 = 게임에서 보이는 육각 틀(2배) · 레벨 = 배우는 레벨', font=fnt(16), fill=SUB)
for i, c in enumerate(icons):
    x, y = 20 + (i % cols) * (CWI + 16), 110 + (i // cols) * (IH + 90)
    cells = c['cells']; art = Image.new('RGBA', (16, 20))
    if cells:
        px = art.load()
        for k, col in enumerate(cells): px[k % 16, k // 16] = tuple(int(col[j:j + 2], 16) for j in (1, 3, 5)) + (255,)
    S.alpha_composite(art.resize((IW, IH), Image.NEAREST), (x, y))
    S.alpha_composite(img(c['hex']).resize((96, 96), Image.NEAREST), (x + IW + 16, y + 10))
    lv, kind = SKI[c['id']][0], SKI[c['id']][1]
    d.text((x, y + IH + 6), c['name'], font=fnt(19, True), fill=TXT); d.text((x, y + IH + 34), f"Lv{lv} · {kind}", font=fnt(14), fill=SUB)
S.convert('RGB').save(os.path.join(OUT, 'warrior1_5_icons.png')); print('icons', S.size)
