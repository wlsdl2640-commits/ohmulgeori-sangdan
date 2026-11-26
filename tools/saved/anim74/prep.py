# 첫 장 만들기(132보다 작으면 132로 넓힘 — 발 줄 그대로) · 올리기 · jobs_in.json.  python prep.py
import json, os, subprocess, sys
from PIL import Image
sys.path.insert(0, '.'); from mons import M
R = '../'; refs = json.load(open('refs.json')) if os.path.exists('refs.json') else {}
TAIL = " Only this monster: no target, no other creatures, no visual effects, no blood, no sparks, no flashes, no particles, no motion trails. Keep the exact same design, size and colors."
MOVE = {'walk': 'walks forward in place with natural steps', 'crawl': 'crawls forward in place with a natural slithering body motion', 'fly': 'hovers in place, flapping its wings',
        'hop': 'hops forward in place with small light hops', 'blob': 'wobbles and bounces forward in place'}
# 오른쪽을 보는 그림 — 좌우로 뒤집어 모두 왼쪽(파티 쪽)을 보게
FLIP = {'trapjaw', 'honeypot', 'aphids', 'antlion', 'mimicspider', 'swampbrute0', 'swampbrute2', 'seedbeetle', 'reedhopper', 'mantis', 'kelpie', 'watersnake', 'vernola', 'trapleaf', 'suckerfrog', 'poisonhopper', 'toad', 'snapturtle'}
J = []
for k, src, subj, atk, mv in M:
    im = Image.open(R + src).convert('RGBA')
    if k in FLIP: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if max(im.size) < 132:
        c = Image.new('RGBA', (132, 132)); c.alpha_composite(im, ((132 - im.width) // 2, 132 - im.height - 6)); im = c
    p = f'first/{k}.png'; im.save(p)
    if k not in refs:
        refs[k] = subprocess.run(['D:/Tools/nodejs/node', 'up.mjs', p], capture_output=True, text=True).stdout.strip(); json.dump(refs, open('refs.json', 'w'), indent=0)
    ref = refs[k]; s = subj + ', pixel art, side view, facing left'
    J.append({'mon': k, 'row': 'idle', 'frames': 16, 'first': ref, 'last': ref, 'dir': 'west', 'subject': s, 'seed': 1, 'desc': 'Idle loop: breathes and moves slightly in place, natural small motion, loops back to the start pose.' + TAIL})
    J.append({'mon': k, 'row': 'walk', 'frames': 16, 'first': ref, 'last': ref, 'dir': 'west', 'subject': s, 'seed': 2, 'desc': f'Movement loop: {MOVE[mv]}, loops back to the start pose.' + TAIL})
    J.append({'mon': k, 'row': 'atk', 'frames': 24, 'first': ref, 'dir': 'west', 'subject': s, 'seed': 3, 'desc': f'Attack toward the left: it {atk}, then returns to the start pose and holds still for the last few frames.' + TAIL})
    print(k, ref, im.size, flush=True)
json.dump(J, open('jobs_in.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(len(J))
