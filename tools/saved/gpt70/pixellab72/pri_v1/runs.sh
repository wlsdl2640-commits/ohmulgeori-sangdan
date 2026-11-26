#!/bin/bash
# usage: runs.sh <tag> <symbol text> [scepter] — N1 기준 · 성표 작게 · 여러 디자인 (11-26 대표님 「N1으로 · 성표 조금 더 작게 · 여러 디자인」)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
EX=""; IMG="-i pri_v1/pri_N1.png -i pri_v1/holy_lv1_ref.png"
if [ "$3" = scepter ]; then EX=" ALSO replace the scepter in her FRONT hand with our game's apprentice scepter from image 3 (gold, four-pronged head around a round dark orb, silver-wrapped grip), copying its shape and colors, same size as her current scepter."; IMG="$IMG -i pri_v1/scepter_lv1_ref.png"; fi
P="Image 1 is our pixel-art priest character holding a holy symbol in front of her chest. Image 2 is our game's base holy symbol item for reference.
Edit image 1 and output ONE new image. Keep EVERYTHING the same: same young female priest, white hooded robe with sky-blue trim, same face, hair and braid, same pose (rear hand bent, holding the symbol in front of her chest), same satchel with two rolled scrolls, same boots, same chunky pixel-art style with thick near-black outline and 3-tone shading, same proportions and canvas, plain pure white background, full body, no text.
Change the holy symbol she holds at her chest: make it SMALLER - about 60% of its current size (roughly the size of her hand plus a little), still clearly readable with a dark outline and turned toward the viewer, the hand gripping its lower stem. Design of the holy symbol: $2$EX"
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . $IMG - > pri_v1/$1.log 2>&1
echo done $1
