"""python3 dump_icons.py 폴더 출력폴더 id,id,... → 각 id 48px 아이콘 png (그 폴더의 catalog.collect 기준)"""
import sys, pathlib, importlib
src = pathlib.Path(sys.argv[1]).resolve(); out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(src))
import catalog
ic = catalog.collect()
for sid in sys.argv[3].split(','):
    name, kind, fn = ic[sid]; art, _ = fn(); art.img(kind).save(out / f'{sid}.png')
print(len(sys.argv[3].split(',')))
