#!/bin/bash
# sw_one.sh <변형> <조각> → swo/<변형>_<조각>.json (파티 치유 고친 빌드 play_ev95 + var/<변형>.js)
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
v=$1; n=$2; o=$D/v95/swo/${v}_$n; [ -s $o.json ] && exit 0
cd $D/v83 && timeout 3000 python3 ev83.py $D/v95/sw/$n.js $D/v95/var/_patch.js $D/v95/var/$v.js $D/v83/h83.js $D/v92/sim92.js --page $D/v95/play_ev95.html > $o.tmp 2> $o.err && tail -1 $o.tmp > $o.json; rm -f $o.tmp
