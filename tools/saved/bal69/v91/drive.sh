#!/bin/bash
# 변형마다 차례로 (CPU 2개라 한 번에 하나)
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v91
cd $D
T="12 20 30 45 60 80 90 100 120 130"
date +%T; ./run91.sh $D/play_ev91.html $D/r_now $D/heal.js $T; ./run91.sh $D/play_ev91.html $D/r_now - 146; echo now done; date +%T
./run91.sh $D/play_ev91_e40.html $D/r_e40 $D/heal.js $T; ./run91.sh $D/play_ev91_e40.html $D/r_e40 - 146; echo e40 done; date +%T
./run91.sh $D/play_ev91_e50.html $D/r_e50 $D/heal.js $T; ./run91.sh $D/play_ev91_e50.html $D/r_e50 - 146; echo e50 done; date +%T
./run91.sh $D/play_ev91.html $D/r_sg1 $D/sg1.js 146; echo sg1 done; date +%T
./run91.sh /tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v90/play_ev90a.html $D/r_old $D/melee.js $T 146; echo old done; date +%T
echo ALLDONE
