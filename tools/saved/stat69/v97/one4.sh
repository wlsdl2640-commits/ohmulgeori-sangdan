#!/bin/bash
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v97
G=/home/claude/game62/tools/saved/bal69
n=$1
[ -s $D/out2/$n.json ] && exit 0
timeout 1500 python3 $G/ev83.py /tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v95/var/_patch.js $D/cfg/$n.js $D/pre97.js $G/h83.js $D/reps.js $D/sim102.js --page /tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v96/play_ev96.html > $D/out2/$n.json 2> $D/out2/$n.err
echo "$(date +%H:%M:%S) $n $(wc -c < $D/out2/$n.json)" >> $D/drive2.log
