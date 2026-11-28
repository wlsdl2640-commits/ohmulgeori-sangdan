"""시안 7(raw/b2.png)에서 등에 꽂힌 밀 이삭 셋을 지운다 (11-28 대표님 「갈대 같은 것들은 빼고」) → orebug7_clean.png"""
import os
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
im = Image.open('raw/b2.png').convert('RGBA'); px = im.load()
clear = lambda x0, x1, y0, y1: [px.__setitem__((x, y), (0, 0, 0, 0)) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1)]
line = px[49, 49]; body = px[50, 51]
clear(41, 48, 43, 50); px[48, 50] = line; px[48, 51] = body; px[48, 52] = body   # 왼쪽 이삭
clear(59, 62, 38, 43); px[62, 44] = line; px[60, 44] = line                     # 가운데 이삭
clear(102, 105, 54, 58)                                                        # 오른쪽 이삭
im.save('orebug7_clean.png')
b = im.getbbox(); im.crop(b).resize(((b[2] - b[0]) * 6, (b[3] - b[1]) * 6), Image.NEAREST).save('orebug7_zoom.png')
