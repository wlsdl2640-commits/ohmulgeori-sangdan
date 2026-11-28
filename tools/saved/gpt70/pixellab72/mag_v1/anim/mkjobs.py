# 마법사(여) 1차 동작 지시문 → jobs_in.json (후보 넷 · 132칸 첫 장)
import json
UP = 'upload:128e86cf-da15-4b92-a09e-a937ddf60fbb'
SUBJ = ('young female mage: midnight-blue wide-brim pointed hat with a cream feather, silver-white braided hair, indigo and sky-blue robe, '
        'brown potion satchel, gray boots, tall pale wooden staff with a silver cage holding an indigo orb')   # 300자 아래 (픽셀랩 제한)
POSE = 'standing facing right, holding the tall staff upright in the front hand'
KEEP = ' Keep the exact same character design, size, colors and equipment; the staff stays in her hand.'
NOFX = ' Only the character moves. Absolutely no visual effects: no magic, no motion trails, no sparks, no flashes, no glow, no smoke, no dust clouds, no other characters.'
M = [  # (id, 한국말, 장 수, 끝 장 = 첫 장, 움직임)
 ('idle', '서 있기', 16, 1, 'She breathes calmly in place, the hat brim, braid and robe sway slightly, loops back to the start pose.'),
 ('walk', '걷기', 16, 1, 'She walks forward to the right in place with a light confident step, staff swinging slightly with each step, loops back to the start pose.'),
 ('run', '달리기', 16, 1, 'She runs forward to the right in place, holding her hat down with the rear hand and the staff in the front hand, loops back to the start pose.'),
 ('hurt', '맞음', 16, 1, 'She is hit from the front, flinches and staggers back a little with her eyes shut, then recovers to the start pose.'),
 ('fall', '쓰러짐', 20, 0, 'She staggers, drops her staff and falls backward onto the ground, her hat falling beside her, lying still with eyes closed.'),
 ('sit', '앉기', 20, 0, 'She sits down on the ground with her legs folded to the side, the staff laid across her lap, and rests.'),
 ('sleep', '자기', 20, 0, 'She lies down on the ground on her side, pulls the hat over her face and falls asleep breathing slowly, the staff beside her.'),
 ('attack', '마력탄(기본 공격)', 20, 1, 'She thrusts the staff forward pointing the orb at an enemy to the right, a short recoil of the staff, then returns to the start pose.'),
 ('fireball', '화염구', 20, 1, 'She pulls the staff back behind her shoulder, then swings it forward hard as if hurling a ball toward the right, then returns to the start pose.'),
 ('icelance', '얼음 창', 20, 1, 'She raises the staff to shoulder height and stabs it straight forward toward the right with both hands like a spear thrust, holds, then returns to the start pose.'),
 ('chain', '연쇄 번개', 20, 1, 'She lifts the staff overhead and sweeps it down in a wide arc from behind her to in front of her, then returns to the start pose.'),
 ('weaken', '약화의 저주', 20, 1, 'She leans forward and stretches her rear hand toward the right with fingers spread in a menacing gesture, the staff held back, then returns to the start pose.'),
 ('burst', '마나 폭주', 20, 1, 'She crouches low gathering strength, then springs up and plants the staff while throwing both arms out wide, then returns to the start pose.'),
 ('iceprison', '얼음 감옥', 20, 1, 'She points the staff at an enemy to the right, then slowly closes her rear hand into a tight fist, then returns to the start pose.'),
 ('meteor', '운석 낙하', 20, 1, 'She raises the staff high above her head with both hands looking up at the sky, then brings it down to point forward to the right, then returns to the start pose.'),
 ('thunderclap', '뇌격', 20, 1, 'She raises the staff straight up, then slams the bottom of the staff down onto the ground with a strong stance, then returns to the start pose.'),
 ('manashield', '마나 보호막', 20, 1, 'She holds the staff vertically in front of her body with both hands and braces her feet firmly as if guarding, holds, then returns to the start pose.'),
]
J = []
NF = {'idle': 24, 'walk': 24, 'run': 24, 'hurt': 24, 'fall': 32, 'sit': 32, 'sleep': 32}   # 11-28 대표님 「프레임 적게 썼지」 — 둘째 판: 공격 · 스킬 40
for i, (mid, ko, n, loop, d) in enumerate(M):
    n = NF.get(mid, 40)
    for v in range(4):
        j = {'mon': mid, 'row': f'w{v + 1}', 'ko': ko, 'frames': n, 'first': UP, 'seed': 500 + i * 10 + v, 'subject': SUBJ, 'pose': POSE, 'desc': d + KEEP + NOFX}
        if loop: j['last'] = UP
        J.append(j)
json.dump(J, open('jobs_in.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(len(J))
