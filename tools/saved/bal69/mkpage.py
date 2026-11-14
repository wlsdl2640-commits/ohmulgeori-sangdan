import sys
s=open('/home/claude/game62/dist/play.html',encoding='utf-8').read()
k="(() => {\n'use strict';\n"
assert k in s
s=s.replace(k,k+"window.__EV = s => eval(s);\n",1)
open(sys.argv[1],'w',encoding='utf-8').write(s)
print('page', sys.argv[1])
