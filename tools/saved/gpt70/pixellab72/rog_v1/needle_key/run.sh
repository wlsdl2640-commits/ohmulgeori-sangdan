#!/bin/bash
# usage: run.sh <tag> <extra>  — 마비 침 쏘는 순간 자세(키 장면)
cd /d/work/ohmulgeori-sangdan/tools/saved/gpt70/pixellab72
export CODEX_HOME='D:\Tools\codex-home'
P="Edit the attached pixel-art character (image 1) and output ONE new image. Keep EVERYTHING the same: same character facing right, same charcoal-black hood and short cape, face mask, brown hair, red sash, bandaged forearms, dark clothes, boots, the closed black drawstring pouch, the dagger held low in the rear hand, same legs and stance, same chunky pixel-art style with dark outlines and 3-tone shading, same size, proportions and canvas, plain white background, full body, no text.
Change ONLY the front arm (the arm on the right side of the image that now holds the shuriken up):
- The front arm is thrust straight forward to the right, horizontal at shoulder height, elbow straight, the bandaged wrist wrap clearly visible.
- The hand is FLAT and HORIZONTAL like a knife blade: back of the hand faces DOWN to the ground, palm faces UP to the sky, fingers together and straight pointing forward. Because we look from the side, we see the hand EDGE-ON: a thin flat horizontal hand (the knife-edge / side of the hand), NOT the palm and NOT the back of the hand, no spread fingers.
- The four-pointed silver shuriken is pinched between two fingers and sits UNDER the hand, hanging just below the back of the hand.
- From the cloth wrap on the wrist, one very thin tiny steel needle is flying straight forward, a short distance in front of the fingertips.
$2"
echo "$P" | timeout 600 codex exec --skip-git-repo-check -C . -i rog_v1/needle_key/src_e4.png - > rog_v1/needle_key/$1.log 2>&1
echo done $1
