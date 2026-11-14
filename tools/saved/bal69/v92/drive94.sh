#!/bin/bash
# 대주교가 든 3차 조합만 파티 치유 고침 페이지로 다시 — drive93.sh(t55)가 끝난 뒤
D=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v92
until grep -q "t55 done" $D/drive93.log 2>/dev/null; do sleep 20; done
date +%T; cd $D && cat jobs94.txt | xargs -P 2 -n 1 ./sw_one94.sh; echo ab done; date +%T
