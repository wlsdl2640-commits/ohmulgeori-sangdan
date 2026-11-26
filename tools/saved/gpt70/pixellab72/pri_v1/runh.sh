#!/bin/bash
# usage: runh.sh <tag> <holy symbol text> — 뒤 손의 부적(종처럼 보임)을 성표로 (11-26 대표님 「종이 아니라 성표」)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Edit the attached pixel-art character (image 1) and output ONE new image. Keep EVERYTHING the same: same young female priest, white hooded robe with sky-blue trim, same face, hair and braid, same golden scepter in the front hand, same satchel with two rolled scrolls, same boots, same pose facing right, same chunky pixel-art style with thick near-black outline and 3-tone shading, same proportions and canvas, plain pure white background, full body, no text.
Change ONLY the object in her REAR hand (the hand on the left side of the image, now holding a round gold thing on a chain that looks like a bell): remove it and instead she holds up a HOLY SYMBOL in that hand at waist-to-chest height, held by a short handle/grip so its flat face is turned toward the viewer and clearly readable, about the size of her head: $2 Gold metal with dark outline and bright highlights. It must NOT look like a bell, NOT a cross, NOT any real-world religious symbol, no halo."
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . -i pri_v1/pri_SW1.png - > pri_v1/$1.log 2>&1
echo done $1
