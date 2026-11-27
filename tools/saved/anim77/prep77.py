# 공격 · 특수 동작 다시 뽑기(11-27 전수 조사 뒤) — 첫 장 = 끝 장(서 있는 첫 모습), 32장, 단계별 동작 지시, 치는 말 없이.
# python prep77.py <목록.json>  목록: [[열쇠, 줄, 그림 경로, 생김새, 동작(치지 않는 몸짓), [씨앗…]], …]
import json, os, sys, subprocess
from PIL import Image
L = json.load(open(sys.argv[1], encoding='utf-8'))
refs = json.load(open('refs.json')) if os.path.exists('refs.json') else {}
J = json.load(open('jobs_in.json', encoding='utf-8')) if os.path.exists('jobs_in.json') else []
have = {(j['mon'], j['row']) for j in J}
TAIL = (" The creature moves through empty air: it does not touch or hit anything and nothing else appears in the frame."
        " Only the creature's own body is drawn in every frame, whole and inside the frame, same side view facing left, same design, size and colors.")
for k, row, src, subj, act, seeds in L:
    if k not in refs:
        im = Image.open(('../../../' + src if src.startswith('tools/') else '../' + src)).convert('RGBA'); im = im.crop(im.getbbox())
        S = max(132, -(-(max(im.width, im.height) + 40) // 4) * 4)
        c = Image.new('RGBA', (S, S)); c.alpha_composite(im, (S - im.width - 8, S - im.height - 6))
        p = f'first/{k}.png'; c.save(p)
        refs[k] = subprocess.run(['D:/Tools/nodejs/node', 'up.mjs', p], capture_output=True, text=True).stdout.strip()
        json.dump(refs, open('refs.json', 'w'), indent=0); print(k, S, refs[k], flush=True)
    for sd in seeds:
        r = f'{row}_s{sd}'
        if (k, r) in have: continue
        if isinstance(act, dict):  # 걷기 · 날기 · 기어가기 반복 — 24장, 첫 장 = 끝 장
            J.append({'mon': k, 'row': r, 'frames': 24, 'first': refs[k], 'last': refs[k], 'dir': 'west', 'seed': sd,
                      'subject': subj + ', pixel art, side view, facing left',
                      'desc': ('Smooth seamless 24-frame movement loop in place: ' + act['walk'] +
                               '. The body keeps exactly the same shape, size and proportions in every frame; only the limbs, wings or body wave move. '
                               'Every change between frames is small and even, and the last frames lead smoothly back into the first pose.' + TAIL)})
            continue
        J.append({'mon': k, 'row': r, 'frames': 32, 'first': refs[k], 'last': refs[k], 'dir': 'west', 'seed': sd,
                  'subject': subj + ', pixel art, side view, facing left',
                  'desc': ('Smooth 32-frame action in three phases. Frames 1-10: slowly wind up — ' + act[0] + '. Frames 11-18: ' + act[1] +
                           '. Frames 19-32: ease back gradually and return exactly to the starting pose. Every change between frames is small and gradual.' + TAIL)})
json.dump(J, open('jobs_in.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(len(J))
