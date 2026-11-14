#!/bin/bash
# sw_one.sh <조각 이름> : 그 조각을 돌려 swo/<이름>.json (이미 있으면 건너뜀)
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
n=$1; [ -s $D/v92/swo/$n.json ] && exit 0
cd $D/v83 && timeout 3000 python3 ev83.py $D/v92/sw/$n.js $D/v83/h83.js $D/v92/sim92.js --page $D/v92/play_ev92.html > $D/v92/swo/$n.tmp 2> $D/v92/swo/$n.err && tail -1 $D/v92/swo/$n.tmp > $D/v92/swo/$n.json; rm -f $D/v92/swo/$n.tmp
