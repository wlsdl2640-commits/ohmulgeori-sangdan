#!/bin/bash
# 넣은 값 그대로(게임 빌드 — PACE built) 재기
SP=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
$SP/v99/run99.sh final1 $SP/v99/play_ev99b.html '{"built":1}' 4 '[[5, 5]]'
$SP/v99/dsweep.sh final1 $SP/v99/play_ev99b.html '{"built":1}'
