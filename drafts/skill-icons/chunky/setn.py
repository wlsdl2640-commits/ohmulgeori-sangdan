"""뭉툭 아이콘 바꾸기/더하기: setn.py n2.py <<< '키 팔레트\\n줄...\\n\\n키 팔레트\\n줄...'  (키 앞에 - 를 붙이면 지움)"""
import pathlib, re, sys
p = pathlib.Path(sys.argv[1]); s = p.read_text(); var = p.stem.upper()
blocks = [b.strip('\n') for b in sys.stdin.read().split('\n\n') if b.strip()]
for b in blocks:
    lines = b.split('\n'); head = lines[0].split(); k = head[0]
    if k.startswith('-'):
        s, n = re.subn(r"'%s': \(\"\"\".*?\"\"\", '[a-z]+'\),\n" % re.escape(k[1:]), '', s, flags=re.S); print(k, 'deleted' if n else 'missing'); continue
    pal = head[1]; rows = lines[1:]
    assert 1 <= len(rows) <= 12 and all(len(r) <= 12 for r in rows), (k, len(rows), [len(r) for r in rows])
    body = "'%s': (\"\"\"\n%s\"\"\", '%s')" % (k, '\n'.join(rows), pal)
    s, n = re.subn(r"'%s': \(\"\"\".*?\"\"\", '[a-z]+'\)" % re.escape(k), lambda m: body, s, flags=re.S)
    if n == 0: s = s.rstrip().rstrip('}').rstrip() + '\n' + body + ',\n}\n'
    print(k, 'replaced' if n else 'added')
p.write_text(s)
