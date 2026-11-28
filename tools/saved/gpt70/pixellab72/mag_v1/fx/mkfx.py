# 마법사(여) 1차 스킬 효과 시안 — 사제 · 도적 부탁 글 형식 그대로(① 차분 _a · ② 보통 · ③ 화려 _c · ④ 최대 _d) → jobs_in.json
import json
STYLE = 'upload:8f742c44-4fb0-432b-8a47-21c35d655947'   # 늪지 괴물 그림체 (사제 · 도적과 같은 참고 그림)
COM = (' Detailed 16-bit pixel art in the same art style and palette mood as the reference swamp monster: solid parts (ice, rock, chains) have bold dark outlines and 3-4 step shading; '
       'glowing energy parts are bright with a hot near-white core fading to saturated color, crisp stepped pixel edges, no blur. Layered composition: a bright core shape, secondary shapes, and small scattered particles. '
       'No crosses, no star or crescent symbols, no religious symbols, no letters or runes. Only the effect: no characters, no people, no silhouettes, no creatures, no weapons, no staff, no text, transparent background.')
LV = {'_a': ' Restrained version: compact size, fewer particles, small glow core, clean readable shape.', '': '',
      '_c': ' Flashy version: bigger and brighter, extra layered secondary shapes, more sparkles and particles, strong hot white core with a vivid gradient, rich trailing particles, but still crisp pixel art.',
      '_d': ' Ultimate version: huge and spectacular, filling most of the frame, three layered stages, many sparkles and soft rays, strong hot white core with a vivid gradient, still crisp pixel art.'}
# 직업 색: 남빛 · 하늘빛 마력(마력탄 · 마나 폭주 · 마나 보호막) + 스킬마다 속성 색
FX = {
 'attack': ('a small bolt of arcane mana flying to the right: an indigo and violet energy dart with a bright white core and a short tapering trail of tiny sky-blue sparkles', 'h'),
 'fireball': ('a fireball flying to the right: a round ball of orange and yellow flame with a white-hot core, licking flame tongues and a trail of embers and small smoke puffs behind it', 'h'),
 'icelance': ('a spear of ice flying to the right: a long sharp crystal lance of pale cyan and white ice with faceted edges, frosty mist and tiny ice shards trailing behind it', 'h'),
 'chain': ('a chain of lightning arcing to the right: a jagged bright yellow-white electric bolt zigzagging horizontally and forking into two smaller branches, with crackling sparks', 'h'),
 'weaken': ('a curse settling on a target: dark violet and sickly green wisps of smoke spiraling downward in a loose ring, with drooping heavy shadow tendrils and faint dull motes', 'h'),
 'burst': ('an arcane mana explosion bursting outward from a center point: a ring shockwave of indigo and sky-blue energy with a bright white flash core, flying mana shards and sparkles', 'h'),
 'iceprison': ('an ice prison: jagged pale cyan ice crystal pillars erupting from the ground in a tight cluster, forming a cage shape, with frost mist at the base and glinting facets', 'h'),
 'meteor': ('a flaming meteor falling diagonally from the upper left toward the lower right: a burning rock with a molten orange core, a long trail of fire, smoke and embers behind it', 'v'),
 'thunderclap': ('a lightning strike from the sky straight down onto the ground: a thick jagged yellow-white thunderbolt with a bright impact flash and crackling sparks spreading at the ground', 'v'),
 'manashield': ('a protective mana barrier: a translucent dome of indigo and sky-blue energy with a faint honeycomb pattern, a bright glowing rim and small sparkles drifting along its surface', 'h'),
}
J = []
for i, (k, (d, o)) in enumerate(FX.items()):
    for s, lv in LV.items():
        w, h = (256, 144) if o == 'h' else (192, 256)
        if s == '_d': w, h = (344, 192) if o == 'h' else (256, 344)
        J.append({'key': k + s, 'tool': 'create_image_pro', 'n': 1, 'args': {'description': 'Game skill effect sprite, side view: ' + d + '.' + lv + COM, 'width': w, 'height': h, 'no_background': True, 'style_image_url': STYLE, 'seed': 4100 + i * 10 + len(s)}})
json.dump(J, open('jobs_in.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(len(J), max(len(j['args']['description']) for j in J))
