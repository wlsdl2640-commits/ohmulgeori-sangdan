#!/bin/bash
# drive95.sh — jobs.txt(mksw95.py가 만든 「변형 조각」 줄)를 두 개씩 나란히 sw_one.sh로 돌린다 → swo/ · 끝나면 python3 an95.py
# 64줄(120조합 · 2400초씩)이 두 개씩 나란히 ≈ 35분(11-14 20:04 ~ 20:38 — 한 줄 1 ~ 2분)
D=$(cd "$(dirname "$0")" && pwd)
cd "$D" && xargs -P 2 -L 1 ./sw_one.sh < jobs.txt
