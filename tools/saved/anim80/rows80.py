# 빌드 80: 1차 여섯 직업 픽셀랩 동작 → 게임 줄 (대표님이 고른 판 · 11-25 ~ 11-29). 열쇠 = 게임 줄 이름, 값 = 판 폴더(장 NN.png) 또는 ('strip', png, 칸 너비)
P = '../gpt70/pixellab72/'
W, R, T, C, M = P + 'war_v2/anim/final/', P + 'rog_v1/anim/clean/', P + 'por_v1/anim/', P + 'pri_v1/anim/', P + 'mag_v1/anim/'
A = P + 'arc_v2/'
def arc(k, cell=156): return ('strip', A + k + '.png', cell)
ROWS = {
 'warrior': {'idle': W+'idle/v2', 'walk': W+'walk/v1', 'run': W+'run/v1', 'hurt': W+'hurt/v2', 'death': W+'fall/v2', 'sit': W+'sit/v2',
   'sleep': W+'sleep2/v1', 'sleep_2': W+'sleep2/v2', 'sleep_3': W+'sleep2/v3',
   'slash': W+'slash/v2', 'block': W+'block/v1', 'taunt': W+'taunt/v1', 'lowcut': W+'lowcut/v2', 'sweep': W+'sweep/v3', 'bash': W+'bash/v1',
   'counter': W+'counter/v1', 'downcut': W+'counter/v2', 'brace': W+'brace/v1', 'resolve': W+'resolve/v1', 'warcry': W+'resolve/v3',
   'earth': W+'earth/v1', 'quake': W+'quake/v1', 'leap': W+'quake/v3', 'shove': W+'shove/v2'},
 'archer': {'idle': arc('idle'), 'walk': arc('walk'), 'run': arc('run'), 'hurt': arc('hurt'), 'death': arc('fall'), 'sit': arc('sit'), 'sleep': arc('sleep'),
   'shoot': arc('shoot'), 'quick': arc('quick'), 'power': arc('power', 200), 'triple': arc('triple'), 'sky': arc('sky'), 'buff': arc('buff'), 'mana': arc('mana'),
   'swing': arc('swing'), 'kick': arc('kick')},
 'porter': {'idle': T+'idle/v1', 'walk': T+'walk/v1', 'run': T+'run/v2', 'hurt': T+'hurt/v2', 'death': T+'fall/v2', 'sit': T+'sit/v1',
   'sleep': T+'sleep/v1', 'sleep_2': T+'sleep/v2', 'sleep_3': T+'sleep/v3',
   'shoot': T+'shoot/v4', 'throw': T+'throw/v4', 'shout': T+'shout/v1', 'canteen': T+'canteen/v1', 'lighten': T+'lighten/v3', 'quake': T+'quake/v3', 'avalanche': T+'avalanche2/v1'},
 'rogue': {'idle': R+'idle/v1', 'walk': R+'walk/v1', 'run': R+'run/v1', 'hurt': R+'hurt/v2', 'death': R+'fall/v2', 'sit': R+'sit/v2',
   'sleep': R+'sleep/v1', 'sleep_2': R+'sleep/v2', 'sleep_3': R+'sleep/v3',
   'stab': R+'stab/v1', 'footwork': R+'footwork/v3', 'backhand': R+'backhand/v2', 'counter': R+'counter/v1', 'thunder': R+'thunder/v3', 'sidestab': R+'sidestab/v3',
   'smoke': R+'smoke/v7', 'needle': R+'needle/k2a', 'smokethrow': R+'smokethrow/v2'},
 'cleric': {'idle': C+'clean/idle/v5', 'walk': C+'clean/walk/v2', 'run': C+'run/u1', 'hurt': C+'clean/hurt/v3', 'death': C+'fall/d1', 'sit': C+'sit/w1',
   'sleep': C+'sleep/s1', 'sleep_2': C+'sleep/s2',
   'attack': C+'clean/attack/w1', 'heal': C+'heal/u3', 'firstaid': C+'firstaid/t1', 'cure': C+'cure/t2', 'bless': C+'bless/u2', 'holy': C+'clean/holy/u2',
   'weaken': C+'weaken/t1', 'holyhammer': C+'holyhammer/u1', 'sanctuary': C+'sanctuary/u1', 'massheal': C+'massheal/u1', 'greatheal': C+'greatheal/u1'},
 'mage': {'idle': M+'idle2/x1', 'walk': M+'walk/w4', 'hurt': M+'hurt/w4', 'death': M+'fall/w3', 'sit': M+'sit/w1',
   'sleep': M+'sleep/w1', 'sleep_2': M+'sleep/w2', 'sleep_3': M+'sleep/w3',
   'attack': M+'attack/w3', 'fireball': M+'fireball/w4', 'icelance': M+'icelance/w4', 'chain': M+'chain2/x1', 'weaken': M+'weaken/w3', 'burst': M+'burst/w4',
   'iceprison': M+'iceprison/w1', 'meteor': M+'meteor/w1', 'thunderclap': M+'thunderclap/w1', 'manashield': M+'clean_fix/manashield/w2'},
}
