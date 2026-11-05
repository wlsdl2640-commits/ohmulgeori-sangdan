#!/bin/bash
# 시안 파일을 skill-icons-draft 가지에 올림: ./save.sh "메시지"
set -e
SP=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/dot
WT=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/wt-draft
cd /home/claude/game
rm -rf "$WT"; git worktree prune
git worktree add -q "$WT" skill-icons-draft
D="$WT/drafts/skill-icons/dot"; mkdir -p "$D"
cp "$SP"/*.py "$SP"/PLAN.md "$SP"/save.sh "$D/"
for f in "$SP"/*.png; do case "$(basename "$f")" in all15.png|dot_draft1.png|sheet_*.png) cp "$f" "$D/";; esac; done
sed -i "s#sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / 'skicon'))\$#sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / 'skicon')); sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / 'chunky'))#" "$D/cell.py"
cd "$WT"; git add drafts/skill-icons/dot
if ! git diff --cached --quiet; then
  git -c user.name="wlsdl2640" -c user.email="wlsdl2640@gmail.com" commit -q -m "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WLiZx3Lii4cu91RuDKqyaT"
  git push -q origin skill-icons-draft
fi
git log --oneline -1
cd /home/claude/game; git worktree remove --force "$WT"
