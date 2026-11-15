#!/bin/bash
# run99.sh <이름> <page> '<PACE JSON>' [N] [ST] [tiers…] → out/<이름>/t<단계>.json (단계마다 한 프로세스, 둘씩 나란히)
export SP=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
export G=/home/claude/game62/tools/saved/bal69
export NAME=$1 PAGE=$2 PACE=$3 N=${4:-4} ST=${5:-'[[5, 5]]'}; shift 5; TIERS=${@:-"12 20 30 45 60 80 90 100 120 130 146"}
export O=$SP/v100/out/$NAME; mkdir -p $O
for t in $TIERS; do echo $t; done | xargs -P 2 -I{} bash -c '
t={}; [ -s $O/t$t.json ] && exit 0
printf "window.SIM_N = %s; window.SIM_SECS = 2400; window.SIM_ST = %s; window.SIM_ONLY = [%s]; window.PACE = %s;\n" "$N" "$ST" "$t" "$PACE" > $O/cfg$t.js
cd $SP/v100 && python3 $G/ev83.py $SP/v95/var/_patch.js $O/cfg$t.js $G/h83.js $SP/v100/sim100.js --page $PAGE > $O/t$t.tmp 2> $O/t$t.err && tail -1 $O/t$t.tmp > $O/t$t.json; rm -f $O/t$t.tmp'
echo done $NAME
