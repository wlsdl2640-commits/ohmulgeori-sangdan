#!/bin/bash
# sw_one94.sh <조각> : 파티 치유 고침 페이지(play_ev94.html — 한 명이 HP 40% 아래면 파티 치유도 쓴다)로 → swo94/<조각>.json
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
n=$1; [ -s $D/v92/swo94/$n.json ] && exit 0
cd $D/v83 && timeout 3000 python3 ev83.py $D/v92/sw/$n.js $D/v83/h83.js $D/v92/sim92.js --page $D/v92/play_ev94.html > $D/v92/swo94/$n.tmp 2> $D/v92/swo94/$n.err && tail -1 $D/v92/swo94/$n.tmp > $D/v92/swo94/$n.json; rm -f $D/v92/swo94/$n.tmp
