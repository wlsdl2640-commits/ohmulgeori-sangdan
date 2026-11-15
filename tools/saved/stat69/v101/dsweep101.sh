#!/bin/bash
# dsweep.sh <이름> <page> '<PACE JSON>' → dout/<이름>.json (허수아비 피해, 모든 단계 · 파티)
SP=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad; G=/home/claude/game62/tools/saved/bal69
NAME=$1; PAGE=$2; PACE=$3; mkdir -p $SP/v101/dout; [ -s $SP/v101/dout/$NAME.json ] && exit 0
printf "window.DUM_N = %s; window.PACE = %s;\n" "${DN:-2}" "$PACE" > $SP/v101/dout/$NAME.cfg.js
cd $SP/v101 && python3 $G/ev83.py $SP/v95/var/_patch.js $SP/v101/dout/$NAME.cfg.js $G/h83.js $SP/v101/dummy101.js --page $PAGE > $SP/v101/dout/$NAME.tmp 2> $SP/v101/dout/$NAME.err && tail -1 $SP/v101/dout/$NAME.tmp > $SP/v101/dout/$NAME.json; rm -f $SP/v101/dout/$NAME.tmp
echo done $NAME
