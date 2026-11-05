"""함수 통째로 바꾸기: python3 patch.py 파일 < 새코드 (새 코드 안의 def 이름마다 기존 것을 찾아 바꿈, 없으면 ICONS 앞에 넣음)"""
import sys, re
p = sys.argv[1]; src = open(p).read(); new = sys.stdin.read()
blocks = re.split(r'(?m)^(?=def |[A-Z_][A-Z0-9_]* = )', new)
for b in blocks:
    if not b.strip(): continue
    m = re.match(r'def (\w+)\(|([A-Z_][A-Z0-9_]*) = ', b)
    name = m.group(1) or m.group(2)
    if m.group(1): pat = re.compile(r'(?ms)^def ' + name + r'\(.*?(?=^def |^[A-Z_][A-Z0-9_]* = |^ICONS = |\Z)')
    else: pat = re.compile(r'(?ms)^' + name + r' = .*?(?=^def |^[A-Z_][A-Z0-9_]* = |^ICONS = |\Z)')
    if pat.search(src): src = pat.sub(lambda _: b if b.endswith('\n') else b + '\n', src, count=1)
    else:
        i = src.index('ICONS = {'); src = src[:i] + b + ('' if b.endswith('\n') else '\n') + src[i:]
open(p, 'w').write(src); print('ok', p)
