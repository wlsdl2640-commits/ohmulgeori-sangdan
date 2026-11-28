#!/bin/bash
# usage: run_staff.sh <tag> <staff text> — C 디자인에서 지팡이만 바꾸기
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Image 1 is our pixel-art female mage character. Redraw the SAME character EXACTLY (same pose, same size, same hat, hair, face, robes, satchel, boots, colors, outline, shading and pixel size), changing ONLY the staff she holds in her front hand. New staff: $2
Plain pure white background, no text, no shadow, no magic effects. NO cross shapes, NO star or crescent symbols."
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . -i mag_v1/mag_C.png - > mag_v1/$1.log 2>&1
echo done $1
