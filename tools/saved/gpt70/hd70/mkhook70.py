import subprocess, os
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
r = subprocess.run(['python3', 'build.py'], cwd='/home/claude/game62', env=dict(os.environ, BUILD_NO='70'), capture_output=True, text=True)
print(r.stdout[-120:], r.stderr[-400:])
h = open('/home/claude/game62/dist/play.html', encoding='utf-8').read()
BOOT = "(() => {\n'use strict';\n"; assert h.count(BOOT) == 1
open(SP + '/hd70/play.html', 'w', encoding='utf-8').write(h.replace(BOOT, BOOT + "window.__EV = s => eval(s);\n"))
print('hook ok')
