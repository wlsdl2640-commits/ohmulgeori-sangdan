import sys, runpy, pathlib
sys.path.insert(0, '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/sky31')
import harness
harness.SRC = pathlib.Path('/home/claude/game42/src')
script = str(pathlib.Path(sys.argv[1]).resolve())
sys.argv = [script]
runpy.run_path(script, run_name='__main__')
