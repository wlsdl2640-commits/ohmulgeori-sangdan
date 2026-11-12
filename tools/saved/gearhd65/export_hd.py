"""화살통 · 마나소드 16단계 큰 도트 그림 → src/data-hdart65.js (HDART · WNAME · WDESC · WLV)
사용자 11-12 17:23 「3개안건 전부 넣는데」 — 고른 시안(quiver16 · msword16) 그대로. 손으로 고치지 말고 이것으로 다시 뽑는다.
python3 export_hd.py <출력 js> [미리보기 png]   (GALMURI_DIR은 미리보기 판에만 쓰인다)"""
import sys, os, io, base64, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import quiver16 as Q
import msword16 as MS
from PIL import Image

def webp(im):
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=90, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()

def run(out, prev=None):
    sets = {}
    for key, mod, fn in (('quiver', Q, Q.quiver), ('manasword', MS, MS.msword)):
        ims, names, descs = [], [], []
        for nm, ds, o in mod.SPECS:
            ims.append(fn(o).image(96)); names.append(nm); descs.append(ds)
        sets[key] = dict(ims=ims, names=names, descs=descs, lv=list(mod.LV))
    L = ['/* 화살통 · 마나소드 16단계 큰 도트 그림 (빌드 65, 사용자 11-12 17:23 「3개안건 전부 넣는데」) — 손으로 고치지 말고',
         '   tools/saved/gearhd65/export_hd.py로 다시 뽑는다. HDART[종류][단계 차례] = WebP data URL (sprites.js armArtURL이 ARMART 다음으로 본다).',
         '   화살통 = 궁수 계열 공용 부장비 Lv1 ~ 150 (견습부터) · 마나소드 = 마검사 · 마검성 무기 Lv50 ~ 200 (늪지부터, 지금 단계에는 앞 10개) */',
         'const HDART = {']
    total = 0
    for key, S in sets.items():
        urls = [webp(im) for im in S['ims']]; total += sum(len(u) for u in urls)
        L.append(f'  {key}: [')
        L += [f"    '{u}'," for u in urls]
        L.append('  ],')
    L.append('};')
    for key, S in sets.items():
        L.append(f'WNAME.{key} = {json.dumps(S["names"], ensure_ascii=False)};')
        L.append(f'WDESC.{key} = {json.dumps(S["descs"], ensure_ascii=False)};')
        L.append(f'WLV.{key} = {json.dumps(S["lv"])};')
    open(out, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    print('HDART', {k: len(v['ims']) for k, v in sets.items()}, f'{total / 1024:.0f}KB')
    if prev:
        W = 16 * 100; im = Image.new('RGBA', (W, 210), (40, 47, 68, 255))
        for r, S in enumerate(sets.values()):
            for i, a in enumerate(S['ims']): im.paste(a, (i * 100 + (100 - a.width) // 2, r * 105 + (100 - a.height) // 2), a)
        im.save(prev)

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
