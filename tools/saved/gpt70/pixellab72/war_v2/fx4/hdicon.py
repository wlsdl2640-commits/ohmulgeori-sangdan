# 게임 스킬 리마스터 그림(src/data-hd70.js HD70_DATA.ski — 34×40, 육각 안쪽)을 PNG로. 버프 머리 위 아이콘에 쓴다.
#   python hdicon.py <출력 폴더> [id,…]
import json, sys, os
from PIL import Image
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../../../..')
S = open(os.path.join(R, 'src/data-hd70.js'), encoding='utf-8').read(); J = json.loads(S[S.index('{'):S.rindex('}') + 1])['ski']
A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
def icon(k):
    p, q = J[k].split('|'); P = [tuple(int(p[i + j:i + j + 2], 16) for j in (0, 2, 4)) for i in range(0, len(p), 6)]
    im = Image.new('RGBA', (34, 40))
    for n, ch in enumerate(q): im.putpixel((n % 34, n // 34), P[A.index(ch)] + (255,))
    return im
if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    for k in (sys.argv[2].split(',') if len(sys.argv) > 2 else J): icon(k).save(f'{od}/{k}.png')
