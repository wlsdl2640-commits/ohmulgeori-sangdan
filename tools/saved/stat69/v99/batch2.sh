#!/bin/bash
SP=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
R=$SP/v99/run99.sh; NEW=$SP/v99/play_ev99a.html
$R k2B3T $NEW '{"k":2,"B":3,"dw":2,"pwT":[1,1,1.3,1.6,1.6]}' 4 '[[5, 5]]'
$R k2B3Th14 $NEW '{"k":2,"B":3,"dw":2,"pwT":[1,1,1.3,1.6,1.6],"hw":1.4}' 4 '[[5, 5]]'
$R k2B3Tn13 $NEW '{"k":2,"B":3,"dw":2,"pwT":[1,1,1.3,1.6,1.6],"heal0":1,"hw":1.3}' 4 '[[5, 5]]'
