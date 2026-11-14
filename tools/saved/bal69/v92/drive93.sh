#!/bin/bash
# 조합 밀기 둘째: 2차 직업을 눅눅한 늪지대(Lv54, 독 면역 몬스터 없음)에서 Lv55 파티로 — drive92.sh가 끝난 뒤
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v92
until grep -q ALLDONE $D/drive92.log; do sleep 20; done
date +%T; cd $D && cat jobs2.txt | xargs -P 2 -n 1 ./sw_one.sh; echo t55 done; date +%T
