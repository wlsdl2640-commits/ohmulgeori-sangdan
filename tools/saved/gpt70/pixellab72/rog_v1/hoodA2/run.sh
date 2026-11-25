#!/bin/bash
# usage: run.sh <tag> <pouch description>
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Edit the attached pixel-art character (image 1) and output ONE new image. Keep EVERYTHING the same: same character, same pose facing right, same charcoal-black hood and short cape, face mask, brown hair, red sash, bandaged forearms, dark clothes, boots, same chunky pixel-art style with dark outlines and 3-tone shading, same proportions and canvas, plain white background, full body, no text.
Change only two things:
1) SHURIKEN POUCH on the hip: replace the small round thing with a clearly readable, well-crafted shuriken holder: $2 It must hang from the belt on the hip, be big enough to read at small game size (about the size of the hand), have a dark outline, leather/metal shading, and show 3-4 four-pointed shuriken (mirror-symmetric four-point stars, silver steel with a center hole) partly sticking out so it is obviously a shuriken case.
2) DAGGER in the right hand (lower hand): redraw as a clean, elegant assassin dagger: straight slim double-edged steel blade with a center ridge line and bright edge highlight, sharp point, small dark-iron crossguard, black leather wrapped grip, small round pommel. Blade, guard, grip and pommel must all lie on ONE straight axis. Blade length about 1.5x the hand width, pointing forward-down. Crisp pixel edges, dark outline, no blur.
Keep the shuriken held in the other hand unchanged."
echo "$P" | timeout 600 codex exec --skip-git-repo-check -C . -i rogue_hood_A.png - > rog_v1/hoodA2/$1.log 2>&1
echo done $1
