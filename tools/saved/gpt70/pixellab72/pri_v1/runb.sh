#!/bin/bash
# usage: runb.sh <W1|W2|W3> — 가방 속 말린 것을 두루마리로 또렷하게 (11-26 대표님 「두루마리처럼 보이게 다시」)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Edit the attached pixel-art character (image 1) and output ONE new image. Keep EVERYTHING the same: same character, same white robe and trim colors, same pose facing right, same face, hair, braid, scepter, gold charm, belt, strap, boots, same chunky pixel-art style with thick near-black outline and 3-tone shading, same proportions and canvas, plain pure white background, full body, no text.
Change ONLY the two rolled things sticking out of the brown leather satchel on her hip: redraw them as clearly readable ROLLED SCROLLS: two cream parchment scrolls standing UPRIGHT and slightly tilted, poking well out of the top of the satchel, each a long cylinder seen from the SIDE (show the long side of the roll with 2-3 horizontal wrap lines and shading, and a small round end on top), one tied with a thin red ribbon, one with a small wax-seal dot. They must read as scrolls even at tiny game size - NOT bread rolls, NOT spirals, NOT snail shells. Keep the satchel itself the same."
echo "$P" | timeout 900 codex exec --skip-git-repo-check -C . -i pri_v1/pri_$1.png - > pri_v1/S$1.log 2>&1
echo done $1
