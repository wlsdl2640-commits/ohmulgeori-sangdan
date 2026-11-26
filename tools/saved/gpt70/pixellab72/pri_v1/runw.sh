#!/bin/bash
# usage: runw.sh <tag> <trim text> — A 시안을 흰 옷으로 (11-26 대표님 「1번을 하얀색 옷으로」)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Edit the attached pixel-art character (image 1) and output ONE new image. Keep EVERYTHING the same: same young female priest, same pose facing right, same hood shape, same face, brown hair and braid, same golden scepter with three rings and blue gem, same round gold charm, same satchel with bandages, same boots, same chunky pixel-art style with thick near-black outline and 3-tone cel shading, same proportions and canvas, plain pure white background, full body, no text.
Change ONLY the clothing colors: the hooded robe becomes WHITE cloth (soft warm white with light grey-blue shading so it still reads clearly against a white background and keeps its dark outline). $2 No cross shapes, no halo."
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . -i pri_v1/pri_A.png - > pri_v1/$1.log 2>&1
echo done $1
