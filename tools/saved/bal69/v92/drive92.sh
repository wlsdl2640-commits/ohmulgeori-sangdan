#!/bin/bash
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v92
V=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v91
cd $V
date +%T
./run91.sh $D/play_ev92.html $D/r92 $V/heal.js 12 20 30 45 60 80 90 100 120 130; ./run91.sh $D/play_ev92.html $D/r92 - 146; echo r92 done; date +%T
./run91.sh $D/play_ev92_np.html $D/r92np $V/heal.js 100 120 130; ./run91.sh $D/play_ev92_np.html $D/r92np - 146; echo r92np done; date +%T
cd $D && cat jobs.txt | xargs -P 2 -n 1 ./sw_one.sh; echo sweep done; date +%T
echo ALLDONE
