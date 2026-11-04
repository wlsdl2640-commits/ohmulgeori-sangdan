"""물건 그림 바꾸기: setobj.py 파일 <<< '키\\n12줄\\n\\n키\\n12줄...'"""
import pathlib, re, sys
p = pathlib.Path(sys.argv[1]); s = p.read_text()
blocks = [b.strip('\n') for b in sys.stdin.read().split('\n\n') if b.strip()]
for b in blocks:
    lines = b.split('\n'); k = lines[0].strip(); rows = lines[1:]
    assert len(rows) == 12 and all(len(r) == 12 for r in rows), (k, len(rows), [len(r) for r in rows])
    body = "'%s': \"\"\"\n%s\"\"\"" % (k, '\n'.join(rows))
    s, n = re.subn(r"'%s': \"\"\".*?\"\"\"" % re.escape(k), lambda m: body, s, flags=re.S)
    if n == 0:
        s = s.rstrip().rstrip('}').rstrip() + '\n' + body + ',\n}\n'
    print(k, 'replaced' if n else 'added')
p.write_text(s)
