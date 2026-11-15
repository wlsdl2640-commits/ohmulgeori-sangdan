#!/bin/bash
SP=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
R=$SP/v99/run99.sh; OLD=$SP/v96/play_ev98.html; NEW=$SP/v99/play_ev99a.html
$R base $OLD '{}' 4 '[[5, 5]]'
$R c0 $NEW '{}' 4 '[[5, 5]]'
$R k2B3 $NEW '{"k":2,"B":3,"dw":2}' 4 '[[5, 5]]'
$R k2B3d1 $NEW '{"k":2,"B":3,"dw":1}' 4 '[[5, 5]]'
$R k15B4 $NEW '{"k":1.5,"B":4,"dw":1.5}' 4 '[[5, 5]]'
$R k3B25 $NEW '{"k":3,"B":2.5,"dw":3}' 4 '[[5, 5]]'
