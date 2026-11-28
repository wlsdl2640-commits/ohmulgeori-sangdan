#!/bin/bash
# usage: run.sh <tag> <design text>  — 마법사(여) 디자인 시안 (Codex 그림)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Image 1 shows five characters from our pixel-art game (warrior, porter, rogue, archer, female priest), all facing right. Draw ONE new image: a NEW character for the same game, a young FEMALE MAGE (elemental attack spellcaster), standing alone, full body, side view facing RIGHT exactly like them, idle ready pose holding her staff.
Match image 1 EXACTLY in style: same chunky 2.5-head-tall chibi proportions, same height and head size, same thick near-black outline, same 3-tone cel shading, same pixel size, same eye style. Plain pure white background, no text, no shadow, no magic effects, nothing else in the picture.
Design: $2
Rules: NO cross shapes anywhere, NO star or crescent symbols, NO real-world religious or national symbols. She looks clever and confident (an expedition battle mage who walks into a dungeon with the party), not a witch caricature. Clearly different silhouette and colors from the female priest in image 1."
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . -i mag_v1/ref_lineup.png - > mag_v1/$1.log 2>&1
echo done $1
