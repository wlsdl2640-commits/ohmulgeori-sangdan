"""스킬 아이콘 시안 시트: 지금(왼쪽) → 새 시안(오른쪽). 실제 hex 틀(hero.js hexURL)과 같은 모양으로 그린다."""
import json, pathlib, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from art import FIX, PAL, OBJ, ACC
D = pathlib.Path(__file__).parent
OLD = json.load(open(D / 'old.json'))
SK = {x['id']: x for x in json.load(open(D.parent / 'skills_dump.json'))}
HEX_TINT = {'dmg': '#4a2a22', 'mdmg': '#2e2246', 'heal': '#1e3a24', 'buff': '#1e2a44', 'dot': '#243a1e', 'taunt': '#4a2e18', 'none': '#241e1a'}
def hx(c): c = c.lstrip('#'); return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
def hexbase(kind):
    W = 48; im = Image.new('RGBA', (W, W), (0, 0, 0, 0)); px = im.load(); cx = cy = W / 2; r = 22
    def span(y):
        dy = abs(y + 0.5 - cy); half = r * 0.866 if dy <= r / 2 else r * 0.866 * (r - dy) / (r / 2)
        return (round(cx - half), round(cx + half)) if half > 0 else None
    def line(y, c0, c1, col):
        for x in range(c0, c1): px[x, y] = hx(col) + (255,)
    for y in range(W):
        s = span(y)
        if s: line(y, s[0], s[1], '#120e0c')
    for y in range(2, W - 2):
        s = span(y)
        if not s: continue
        t, b = span(y - 2), span(y + 2); edge = not t or not b
        l = max(s[0] + 2, t[0] + 1 if t else s[0] + 2, b[0] + 1 if b else s[0] + 2); rr = min(s[1] - 2, t[1] - 1 if t else s[1] - 2, b[1] - 1 if b else s[1] - 2)
        line(y, s[0] + 1, s[1] - 1, '#c8a870' if y < cy else '#8a6a3c')
        if not edge and l < rr: line(y, l, rr, '#8a6a3c' if y < cy else '#5a4428')
        if not edge and l + 1 < rr - 1: line(y, l + 1, rr - 1, HEX_TINT.get(kind, HEX_TINT['none']))
    return im
def put(im, rows, ox, oy, colors, z=1):
    px = im.load()
    for yy, row in enumerate(rows):
        for xx, ch in enumerate(row):
            if ch in '. ': continue
            col = colors.get(ch)
            if not col: col = '#ff00ff'
            for dy in range(z):
                for dx in range(z): px[ox + xx * z + dx, oy + yy * z + dy] = hx(col) + (255,)
def grid(s): return [r for r in s.strip('\n').split('\n')]
def old_icon(glyph, kind):
    im = hexbase(kind)
    put(im, grid('\n'.join(OLD['glyph'][glyph])), 16, 16, OLD['pal'])
    return im
def new_icon(spec, kind):
    obj, acc, pal = spec[0], spec[1], spec[2]; pips = spec[3] if len(spec) > 3 else 0
    im = hexbase(kind); cols = dict(FIX); cols.update({'1': PAL[pal][0], '2': PAL[pal][1], '3': PAL[pal][2]})
    rows = grid(OBJ[obj]); assert all(len(r) == 12 for r in rows) and len(rows) == 12, obj
    put(im, rows, 11, 12, cols, 2)
    if acc:
        ar = grid(ACC[acc]); assert all(len(r) == 6 for r in ar) and len(ar) == 6, acc
        put(im, ar, 29, 7, cols, 2)
    for i in range(pips):   # 이름에 숫자만 다른 스킬: 아래에 점
        put(im, ['kkk', 'kyk', 'kkk'], 18 + i * 8, 37, cols, 2) if False else put(im, ['kk', 'ky'][:1] and ['kkkk', 'kyyk', 'kyyk', 'kkkk'], 17 + i * 7, 38, cols, 1)
    return im
def old_glyph(s):
    if s['passive']: return 'book'
    if s['kind'] == 'heal': return 'healp' if s['tgt'] == 'party' else 'heal'
    if s['kind'] == 'buff': return 'shield' if s['stat'] == 'def' else 'batk' if s['stat'] == 'atk' else 'wing' if s['stat'] in ('eva', 'spd') else 'buff'
    if s['kind'] == 'taunt': return 'taunt'
    if s['kind'] == 'dot': return 'curse' if s['fx'] == 'dark' else 'fire' if s['fx'] == 'fire' else 'poison'
    if s['fx']: return {'arrow': 'volley' if s['hits'] > 1 else 'arrow', 'bolt': 'bolt', 'dark': 'dark', 'fire': 'fire', 'holy': 'holy', 'ice': 'ice', 'jump': 'heavy', 'wind': 'wind'}.get(s['fx'], 'magic')
    if s['kind'] == 'mdmg': return 'magic'
    return 'flurry' if s['hits'] > 1 else 'slash'
DRAFT = [   # (스킬 id, 물건, 덧그림, 팔레트, 점)
    ('bash', 'hammer', 'spark', 'none'), ('taunt', 'face', 'excl', 'none', 1), ('provoke', 'face', 'excl', 'none', 2), ('ironwall', 'tower', 'upB', 'steel'),
    ('sweep', 'arc', 'ring', 'none'), ('berserk', 'axe', 'flame', 'blood'),
    ('ballad', 'lute', 'upR', 'music'), ('lullaby', 'moon', 'swirl', 'music'), ('hymn', 'harp', 'plus', 'heal'), ('marchsong', 'drum', 'wing', 'none'),
    ('warsong', 'horn', 'upR', 'gold'), ('symphony', 'notes', 'star', 'music'), ('requiem', 'bell', 'cross', 'holy'), ('overture', 'scroll', 'heart', 'music'),
    ('encore', 'notes', 'clock', 'gold'), ('grandfinale', 'baton', 'star', 'gold'),
    ('backstab', 'dagger', 'drop', 'none'), ('smoke', 'cloud', 'wing', 'shadow'), ('venom', 'vial', 'poison', 'poison'), ('shadow', 'dagger', 'x3', 'dark'),
    ('assassinate', 'skull', 'target', 'none'), ('vanish', 'mask', 'wing', 'shadow'), ('throatcut', 'dagger', 'heart', 'blood'), ('shadowclone', 'twin', 'x3', 'shadow'),
    ('shadowstep', 'boot', 'swirl', 'dark'), ('nightfall', 'moon', 'wing', 'dark'), ('shadowstorm', 'tornado', 'x2', 'dark'), ('soulreap', 'scythe', 'ghost', 'evil'), ('eclipse', 'eclipse', 'ring', 'dark'),
    ('jump', 'spearDown', 'wing', 'none'), ('gale', 'spear', 'wind', 'wind'), ('skyfall', 'spearDown', 'swirl', 'steel'), ('wyvernfall', 'wing', 'down', 'earth'),
    ('dragonfall', 'dragon', 'flame', 'blaze'), ('dragonscale', 'scale', 'shield', 'earth'), ('dragonblood', 'drop', 'heart', 'blood'),
    ('fireball', 'orb', 'flame', 'fire'), ('icelance', 'icicle', 'snow', 'ice'), ('chain', 'bolt', 'chain', 'thunder'), ('blizzard', 'snowflake', 'wind', 'ice'), ('meteor', 'comet', 'spark', 'blaze'),
    ('heal', 'hand', 'plus', 'heal'), ('bless', 'halo', 'upR', 'holy'), ('massheal', 'heart', 'ring', 'heal'), ('holy', 'sun', 'star', 'holy'), ('smite', 'bolt', 'cross', 'holy'),
    ('meditate', 'lotus', 'drop', 'water'), ('sprint', 'boot', 'wind', 'wind'), ('haste', 'hourglass', 'upB', 'thunder'), ('tactics', 'chess', 'clock', 'steel'),
]
def kind_of(s): return 'none' if s['passive'] else s['kind'] if s['kind'] in HEX_TINT else 'buff' if s['kind'] in ('shield', 'regen', 'cure') else 'heal' if s['kind'] == 'revive' else 'none'
if __name__ == "__main__":
    COLS, CW, CH, S = 5, 300, 132, 2
    rows = (len(DRAFT) + COLS - 1) // COLS
    sheet = Image.new('RGB', (COLS * CW + 20, rows * CH + 70), (21, 23, 28)); dr = ImageDraw.Draw(sheet)
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 18, index=2); fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
    dr.text((12, 12), '스킬 아이콘 시안 — 왼쪽: 지금 · 오른쪽: 새 그림 (도발 1·2만 같은 그림에 점 하나/둘)', font=f, fill=(242, 190, 60))
    seen = {}
    for i, spec in enumerate(DRAFT):
        sid = spec[0]; s = SK[sid]; kind = kind_of(s)
        key = spec[1:4]; seen.setdefault(key, []).append(sid)
        x0 = 10 + (i % COLS) * CW; y0 = 50 + (i // COLS) * CH
        o = old_icon(old_glyph(s), kind).resize((48 * S, 48 * S), Image.NEAREST); n = new_icon(spec[1:], kind).resize((48 * S, 48 * S), Image.NEAREST)
        sheet.paste(o, (x0, y0), o); dr.text((x0 + 98, y0 + 40), '→', font=f, fill=(150, 150, 150)); sheet.paste(n, (x0 + 120, y0), n)
        dr.text((x0 + 4, y0 + 98), s['name'], font=f, fill=(230, 230, 230)); dr.text((x0 + 4 + 12 * len(s['name']) + 18, y0 + 102), s['cls'][:14], font=fs, fill=(140, 140, 150))
    sheet.save(D / 'draft.png')
    dup = {k: v for k, v in seen.items() if len(v) > 1}
    print(sheet.size, 'dup', dup)
