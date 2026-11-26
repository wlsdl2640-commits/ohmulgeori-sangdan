#!/bin/bash
# usage: runr.sh <tag> <how held> — 뒤 손에 우리 게임 성표(Lv1 · cleric1/holy_lv1.png) (11-26 대표님 「우리 아이템 사제 부장비 성표를 한 손에」)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Image 1 is our pixel-art priest character. Image 2 is our game's item 'holy symbol' (a gold holy symbol with a ring on top, two round side arms with dark openings, a small gem in the middle and a long stem).
Edit image 1 and output ONE new image. Keep EVERYTHING the same: same young female priest, white hooded robe with sky-blue trim, same face, hair and braid, same golden scepter in the front hand, same satchel with two rolled scrolls, same boots, same pose facing right, same chunky pixel-art style with thick near-black outline and 3-tone shading, same proportions and canvas, plain pure white background, full body, no text.
Change ONLY her REAR hand (left side of the image, now holding a round gold thing on a chain that looks like a bell): remove that, and make her hold the holy symbol from image 2 in that hand, copying its exact shape, proportions and gold colors, redrawn in the same pixel-art style with a dark outline. $2 Its flat face is turned toward the viewer so the shape reads clearly. Size: about as tall as her head."
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . -i pri_v1/pri_SW1.png -i pri_v1/holy_lv1_ref.png - > pri_v1/$1.log 2>&1
echo done $1
