"""전사 기본 스킬 — 뭉툭 도트 시안. 칸 좌표: x 0..15, y 0..19 (육각 틀 안쪽)."""
import math
import cell
from cell import Art, radial, cover, mix, rows_of, dsword, crescent2
FIRE = ['#2a0604', '#5a1008', '#8e1e0c', '#c43a12', '#ea6a1c', '#ffa040', '#ffd870']
DARKFIRE = ['#1a0304', '#3a0806', '#621208', '#8e1e0c', '#b8300e', '#e05a18']
def slash(a, cm, cols=('#ffffff', '#fff0a0', '#ffb040', '#f07a20')):
    for (x, y), (fo, fi) in cm.items():
        k = 0 if fo < 0.9 else 1 if fo < 1.8 else 2 if fo < 2.6 else 3
        if fi < 0.6 and k < 2: k = max(k, 1)
        a.set(x, y, cols[k])
STAR = ['...o...', '...y...', '..yhy..', 'oyhwhyo', '..yhy..', '...y...', '...o...']
STARP = {'o': '#ff9a30', 'y': '#ffd860', 'h': '#fff4c0', 'w': '#ffffff'}
def bash_a():
    a = Art().bg(radial(DARKFIRE, 9.0, 11.0, 12.5, [0.0, 0.18, 0.36, 0.56, 0.78]))
    slash(a, crescent2((8.5, 10.0), 7.6, (10.0, 11.2), 7.4))
    a.sym(rows_of(dsword(2, 15, Lb=6, Lg=2, g=2)))
    return a, 0
def bash_b():
    a = Art().bg(radial(DARKFIRE, 6.0, 13.0, 13, [0.0, 0.18, 0.36, 0.56, 0.78]))
    slash(a, crescent2((8.6, 9.6), 7.3, (10.2, 11.0), 7.2))
    a.sym(rows_of(dsword(3, 14, Lb=5, Lg=2, g=1)))
    a.paint(STAR, STARP, ox=-1, oy=12)
    return a, 0
def bash_c():
    a = Art().bg(radial(DARKFIRE, 9.0, 11.0, 12.5, [0.0, 0.18, 0.36, 0.56, 0.78], rays=10, rot=0.3, ray_w=0.5, ray_amp=0.09))
    slash(a, crescent2((8.5, 10.0), 7.6, (10.0, 11.2), 7.4))
    a.sym(rows_of(dsword(2, 15, Lb=6, Lg=2, g=1)))
    return a, 0
ICONS = {'bash_a': ('강타 A', 'dmg', bash_a), 'bash_b': ('강타 B', 'dmg', bash_b), 'bash_c': ('강타 C', 'dmg', bash_c)}
