# 몬스터 동작을 픽셀랩으로 부드럽게(16 · 20장): 동작마다 첫 장 · 끝 장을 올리고 지시문을 만든다 → jobs_in.json
# python prep.py <upload_url>   (out_mon은 hd70/extract_mon.py가 만든 장 — 고블린 셋은 뺀다: 대표님 11-25 「고블린은 나중에 고블린 왕국으로」)
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(H, '..', 'gpt70', 'hd70', 'out_mon')
URL = sys.argv[1]
SKIP = {'gobclub', 'goblin', 'gobarcher'}
SUBJ = {
 'rat': 'a big brown field rat monster', 'rabbit': 'a horned rabbit monster', 'wolf': 'a grey wild wolf monster', 'scarecrow': 'a living scarecrow monster with crows on it',
 'boar': 'a wild boar monster', 'aboar': 'a big armored wild boar monster', 'vinesnake': 'a vine snake monster', 'cflower': 'a carnivorous flower monster',
 'stump': 'a walking tree stump monster', 'spotshroom': 'a spotted mushroom monster', 'ibeetle': 'an iron-shelled horned beetle monster', 'mgolem': 'a moss covered stone golem',
 'fguard': 'a forest guardian spirit beast with a bell', 'ewisp': 'a swarm of glowing ether fireflies', 'emoth': 'a glowing dust moth monster', 'eshroom': 'an old ether mushroom elder',
 'mlizard': 'a moss-backed lizard monster', 'rcenti': 'a root centipede monster', 'cstag': 'a crystal stag beetle monster', 'sentinel': 'an ancient tree sentinel golem',
 'elddragon': 'a sleeping old tree dragon boss', 'smandrake': 'a screaming mandrake root monster', 'fdryad': 'a corrupted dryad woman monster', 'fairies': 'a group of four small corrupted fairies',
 'rahen': 'a corrupted elf druid boss with a root staff'}
MOVE = {
 'idle': 'idle loop: breathes and moves slightly in place, natural small motion; ends in the starting pose',
 'walk': 'walk cycle in place: moves its legs or body as if walking forward, smooth loop; ends in the starting pose',
 'bite': 'lunges forward and bites the enemy in front, then pulls back', 'leap': 'leaps forward through the air and lands', 'jump': 'jumps forward and lands',
 'charge': 'lowers its head and charges forward to ram, then recovers', 'crow1': 'a crow flies off its shoulder toward the enemy', 'crow2': 'a crow flies off its head toward the enemy',
 'crow3': 'the remaining crow flies off toward the enemy', 'hornup': 'raises its head and tusks threateningly', 'headbutt': 'swings its head and headbutts forward',
 'spore': 'puffs and releases spores from its cap', 'smash': 'raises its arms and smashes down heavily', 'bell': 'rings the bell it carries', 'stomp': 'rears up and stomps the ground hard',
 'death': 'collapses and falls down defeated', 'burst': 'the swarm gathers and bursts outward', 'dust': 'flaps its wings and scatters glowing dust', 'tongue': 'shoots its long tongue forward and pulls it back',
 'pinch': 'snaps its big mandibles forward', 'breath': 'opens its mouth and breathes out forward', 'scream': 'opens its mouth wide and screams', 'whip': 'lashes a vine whip forward',
 'stab': 'darts forward and stabs with tiny blades', 'slam': 'slams its staff down', 'cast': 'raises its staff and casts a spell', 'roots': 'commands roots to burst from the ground'}
TAIL = ' Keep the exact same character design, size and colors. No visual effects, no particles, no blood, no sparks, no flashes.'
LOOP = {'idle', 'walk'}
def up(path):
    r = subprocess.run(['curl', '-sS', '-F', f'file=@{path}', URL], capture_output=True, text=True)
    return json.loads(r.stdout)['ref']
meta = json.load(open(os.path.join(SRC, 'meta.json')))
jobs = []
for mid, m in meta.items():
    if mid in SKIP: continue
    for row, n in m['rows'].items():
        first = up(os.path.join(SRC, mid, f'{row}_0.png'))
        last = first if row in LOOP else up(os.path.join(SRC, mid, f'{row}_{n - 1}.png'))
        jobs.append({'mon': mid, 'row': row, 'old': n, 'frames': 16 if row in LOOP else 20, 'first': first, 'last': last,
                     'subject': SUBJ[mid] + ', pixel art, side view', 'desc': MOVE.get(row, row) + '.' + TAIL})
        print(mid, row, flush=True)
json.dump(jobs, open(os.path.join(H, 'jobs_in.json'), 'w'), indent=1)
print('jobs', len(jobs))
