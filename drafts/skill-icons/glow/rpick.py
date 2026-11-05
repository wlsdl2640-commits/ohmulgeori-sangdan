"""스킬마다 배경 색(테마)·무늬 고르기: 속성이면 속성 색, 아니면 직업 계열 색. 상징과 배경 색이 겹치면 대비되는 색으로."""
import json, pathlib, colorsys, hashlib
import b4, rbg
from art import PAL
D = pathlib.Path(__file__).parent
BASE = json.load(open(D / 'clsbase.json')); BASE['all'] = 'all'
rbg.RAMP.setdefault('red', ['#2a0606', '#6a1008', '#b02810', '#e85a20', '#ff9a50', '#ffe0b0'])
rbg.RAMP.setdefault('sky', ['#06203a', '#0e4070', '#2070b0', '#40a8e8', '#90d8ff', '#f0fbff'])
rbg.PATTERN.setdefault('red', 'rays'); rbg.PATTERN.setdefault('sky', 'burst')
ELEM = {'fire', 'blaze', 'ice', 'water', 'wind', 'storm', 'earth', 'thunder', 'holy', 'light', 'dark', 'evil', 'heal', 'poison', 'blood', 'music', 'arcane', 'shadow'}
CLASS_THEME = {'warrior': 'red', 'archer': 'wind', 'rogue': 'dark', 'porter': 'earth', 'cleric': 'holy', 'mage': 'arcane', 'all': 'sky'}
CONTRAST = ['red', 'water', 'wind', 'dark', 'fire', 'storm', 'arcane', 'heal', 'evil', 'gold', 'earth', 'music', 'sky']
def hue_of(hexc):
    r, g, b = rbg.rgb(hexc); h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255); return h * 360, s, l
def theme_hue(t): return hue_of(rbg.RAMP[t][3])[0]
def hd(a, b): d = abs(a - b) % 360; return min(d, 360 - d)
def symbol_hue(rows, pal3):
    ic = b4.bake(rows, pal3, fx=False); p = ic.load(); acc = {}
    for y in range(ic.height):
        for x in range(ic.width):
            c = p[x, y]
            if not c[3] or c[:3] == b4.rgb(b4.OUT): continue
            h, l, s = colorsys.rgb_to_hls(*[v / 255 for v in c[:3]])
            if s < 0.3 or l > 0.9 or l < 0.12: continue
            k = int(h * 360) // 30; acc[k] = acc.get(k, 0) + s
    if not acc: return None
    k = max(acc, key=acc.get); tot = sum(acc.values())
    return (k * 30 + 15, acc[k] / max(1, tot))
def symbol_light(rows, pal3):
    ic = b4.bake(rows, pal3, fx=False); p = ic.load(); ls = []
    for y in range(ic.height):
        for x in range(ic.width):
            c = p[x, y]
            if c[3] and c[:3] != b4.rgb(b4.OUT): ls.append(colorsys.rgb_to_hls(*[v / 255 for v in c[:3]])[1])
    return sum(ls) / len(ls) if ls else 0.5
def pick(sid, skill, rows, spec_pal):
    t = spec_pal if spec_pal in ELEM else CLASS_THEME.get(BASE.get(skill['cls'].split('/')[0], 'all'), 'sky')
    if skill['kind'] == 'taunt': t = 'red'
    sh = symbol_hue(rows, PAL[spec_pal]); elem = spec_pal in ELEM and skill['kind'] != 'taunt'
    if not elem and sh and hd(sh[0], theme_hue(t)) < 38:
        cands = sorted(CONTRAST, key=lambda c: -hd(sh[0], theme_hue(c)))[:4]
        t = cands[int(hashlib.md5(sid.encode()).hexdigest(), 16) % len(cands)]
    kind = 'none' if skill['passive'] else skill['kind']
    pat = {'heal': 'glow', 'regen': 'glow', 'cure': 'glow', 'revive': 'glow', 'dot': 'swirl'}.get(kind)
    if not pat: pat = rbg.PATTERN.get(t, 'rays') if (skill['kind'] == 'mdmg' or spec_pal in ELEM) else ('rays' if skill['kind'] in ('dmg', 'taunt') else 'burst')
    same = bool(elem and sh and sh[1] > 0.35 and hd(sh[0], theme_hue(t)) < 36)
    dim = 0.0
    if same: dim = -0.3 if symbol_light(rows, PAL[spec_pal]) < 0.4 else 0.42   # 어두운 상징이면 배경을 밝게, 밝은 상징이면 어둡게
    return t, pat, same, dim
