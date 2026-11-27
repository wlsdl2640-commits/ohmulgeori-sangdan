# 점토 협곡 잘린 동작 다시 뽑기(11-28): 판 가장자리에 꼬리 · 날개가 잘리던 11개 → 여백을 넉넉히(양옆 32칸) 둔 첫 장으로 다시. 열쇠 f_<몬스터>
#   python review78/prep_fix5.py   (anim77 폴더에서) → jobs_in.json에 더함 → node run_anim.mjs 6
import json, os, subprocess
from PIL import Image
J = json.load(open('jobs_in.json', encoding='utf-8')); have = {(j['mon'], j['row']) for j in J}
J76 = {(j['mon'], j['row']): j for j in json.load(open('../anim76/jobs_in.json', encoding='utf-8'))}
J77 = {(j['mon'], j['row']): j for j in J}
SRC = {'jawlizard': 'review78/ext_jaw2_out.png', 'otter': 'review78/ext_otter3_out.png', 'canyonbat': '../anim76/first/canyonbat.png',
       'hawk': '../anim76/first/hawk.png', 'earwig': '../anim76/first/earwig.png'}
ROWS = {'jawlizard': ['idle', 'walk', 'atk'], 'otter': ['idle', 'walk', 'atk'], 'canyonbat': ['walk', 'atk'], 'hawk': ['walk', 'atk'], 'earwig': ['walk']}
refs = json.load(open('refs.json')) if os.path.exists('refs.json') else {}
for m, src in SRC.items():
    k = 'f_' + m
    if k not in refs:
        im = Image.open(src).convert('RGBA'); im = im.crop(im.getbbox())
        S = -(-(max(im.width + 64, im.height + 40)) // 4) * 4
        c = Image.new('RGBA', (S, S)); c.alpha_composite(im, ((S - im.width) // 2, S - im.height - 6))
        p = f'first/{k}.png'; c.save(p)
        refs[k] = subprocess.run(['D:/Tools/nodejs/node', 'up.mjs', p], capture_output=True, text=True).stdout.strip()
        json.dump(refs, open('refs.json', 'w'), indent=0); print(k, S, refs[k], flush=True)
    for r in ROWS[m]:
        # 공격: 다시 뽑은 c_ 것(32장 · 세 단계)이 있으면 그 지시를, 없으면 anim76 지시를 그대로. 씨앗 둘.
        base = J77.get(('c_' + m, r + '_s11')) or J76[(m, r)]
        seeds = [21, 22] if r == 'atk' else [21]
        for sd in seeds:
            rr = f'{r}_s{sd}'
            if (k, rr) in have: continue
            j = dict(base); j.update({'mon': k, 'row': rr, 'first': refs[k], 'seed': sd})
            if j.get('last'): j['last'] = refs[k]
            j['desc'] = j['desc'] + ' Keep the whole body, tail and wings inside the frame with empty space around them.'
            J.append(j)
json.dump(J, open('jobs_in.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(len(J))
