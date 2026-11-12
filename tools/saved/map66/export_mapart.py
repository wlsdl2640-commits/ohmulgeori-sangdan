"""지도 그림 → src/data-mapart.js (빌드 66): python3 export_mapart.py <출력 data-mapart.js> [미리보기.png]
대륙 = map_a.draw() — 사용자가 고른 시안 A 양피지 고지도(11-12 22:29 「지도 A로」) 240×240.
하늘 = sky_a.draw() — 같은 결 240×150. 둘 다 그림 그대로(1배) 색 판 PNG로 — 화면은 CSS image-rendering: pixelated로 키운다."""
import sys, io, base64
import numpy as np
from PIL import Image
import map_a, sky_a


def png_bytes(im):
    a = np.array(im.convert('RGB'))
    cols, inv = np.unique(a.reshape(-1, 3), axis=0, return_inverse=True)
    if len(cols) <= 256:   # 색 판 PNG (색이 그대로인지 되돌려 확인)
        p = Image.fromarray(inv.reshape(a.shape[:2]).astype(np.uint8), 'P')
        pal = cols.astype(np.uint8).flatten().tolist()
        p.putpalette(pal + [0] * (768 - len(pal)))
        assert (np.array(p.convert('RGB')) == a).all()
        im = p
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return b.getvalue(), len(cols)


def main(out, prev=None):
    land, sky = map_a.draw(), sky_a.draw()
    assert land.size == (240, 240) and sky.size == (240, 150)
    rows = []
    for name, im in [('MAP_ART', land), ('SKY_MAP_ART', sky)]:
        data, n = png_bytes(im)
        rows.append(f"const {name} = 'data:image/png;base64,{base64.b64encode(data).decode()}';")
        print(name, im.size, n, 'colors', len(data), 'bytes')
    head = ('/* 지도 그림 (빌드 66) — tools/saved/map66/export_mapart.py로 뽑는다(손으로 고치지 말 것).\n'
            '   대륙 MAP_ART = 사용자가 고른 시안 A 양피지 고지도(map_a.py · 240×240), 하늘 SKY_MAP_ART = 같은 결(sky_a.py · 240×150).\n'
            '   노드 자리는 map.js MAP_NODES · MAP_KINGS · MAP_ORGS · MAP_NODES_SKY 그대로(geo66.py · sky_a.py가 같은 값을 쓴다). */\n')
    open(out, 'w', encoding='utf-8').write(head + '\n'.join(rows) + '\n')
    if prev:   # 두 장을 3배로 나란히
        z = 3; W = 240 * z * 2 + 24; c = Image.new('RGB', (W, 240 * z), (40, 32, 24))
        c.paste(land.resize((720, 720), Image.NEAREST), (0, 0)); c.paste(sky.resize((720, 450), Image.NEAREST), (744, 0))
        c.save(prev)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
