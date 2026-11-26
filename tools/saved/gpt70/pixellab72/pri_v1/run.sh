#!/bin/bash
# usage: run.sh <tag> <design text>  — 사제(여) 디자인 시안 (Codex 그림)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Image 1 shows four characters from our pixel-art game (warrior, porter, rogue, archer), all facing right. Draw ONE new image: a NEW character for the same game, a young FEMALE PRIEST (healer class), standing alone, full body, side view facing RIGHT exactly like them, idle ready pose.
Match image 1 EXACTLY in style: same chunky 2.5-head-tall chibi proportions, same height and head size, same thick near-black outline, same 3-tone cel shading, same pixel size, same eye style. Plain pure white background, no text, no shadow, nothing else in the picture.
Design: $2
Rules: NO cross shapes anywhere, NO halo, NO real-world religious symbols, NO pure white robe. She looks gentle but capable (an expedition field healer who walks into a dungeon with the party), not a nun."
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . -i pri_v1/ref_lineup.png - > pri_v1/$1.log 2>&1
echo done $1
