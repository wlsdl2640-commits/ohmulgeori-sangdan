#!/bin/bash
# 빌드 42 전체 시험 (worktree game42): 하네스 시험은 SRC를 game42로, 빌드한 게임을 여는 시험은 game42/dist로 바꾼 사본으로
cd /tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
for f in /home/claude/game42/src/*.js; do node --check "$f" || echo "SYNTAX ERROR $f"; done
(cd /home/claude/game42 && BUILD_NO=42 python3 build.py > /dev/null 2>&1)
for t in v7/t/uitest7.py v7/t/fresh7.py hero/herotest.py front/exptest.py front/undertest.py front/maptest.py front/dextest.py demon/demontest.py demon/stonetest.py demon/pettest.py demon/eventtest.py demon/logic.py skills/sktest.py skills/sk2test.py skills/reqtest.py skills/portertest.py skills/uiskill.py skills/ui23.py skills/ui25.py skills/reqtest_ui.py skills/savetest.py skills/saveui.py skills/stone28.py skills/ui28.py skills/role29.py skills/ui29.py sky30/load.py sky30/logic30.py sky30/ui30.py sky31/logic31.py sky31/ui31.py salv34/logic34.py salv34/ui34.py v36/logic36.py v36/ui36.py v37/iconcmp.py v37/logic37.py v37/stuntest.py v37/ui37.py v38/logic38.py v38/ui38.py v39/logic39.py v40/logic40.py v41/logic41.py v42/logic42.py; do
  echo "=== $t"
  d=$(dirname "$t"); b=$(basename "$t")
  if grep -q "/home/claude/game/" "$t"; then
    tmp="$d/_g42_$b"; sed "s#/home/claude/game/#/home/claude/game42/#g" "$t" > "$tmp"
    timeout 900 python3 run42one.py "$tmp" 2>&1 | grep -v agent-proxy | grep -E "ERRORS|errors|Traceback|Error|error|FAIL" | head -5
    rm -f "$tmp"
  else
    timeout 900 python3 run42one.py "$t" 2>&1 | grep -v agent-proxy | grep -E "ERRORS|errors|Traceback|Error|error|FAIL" | head -5
  fi
done
echo "=== DONE"
