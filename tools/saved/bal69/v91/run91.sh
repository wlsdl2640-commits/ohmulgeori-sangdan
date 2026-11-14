#!/bin/bash
# run91.sh <page> <outdir> <extra.js 또는 -> [tiers…] : 단계마다 따로 (나란히) — extra.js에 SIM_MUL · SIM_COMPS
SP=/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad
PAGE=$1; OUT=$2; EXTRA=$3; shift 3; TIERS=${@:-"12 20 30 45 60 80 90 100 120 130 146"}
mkdir -p $OUT
cd $SP/v83
for t in $TIERS; do
  echo "window.SIM_N = 4; window.SIM_SECS = 2400; window.SIM_ST = [[1, 0], [5, 5]]; window.SIM_ONLY = [$t];" > $OUT/cfg$t.js
  if [ "$EXTRA" != "-" ]; then cat $EXTRA >> $OUT/cfg$t.js; fi
  python3 ev83.py $OUT/cfg$t.js $SP/v83/h83.js $SP/v91/sim91.js --page $PAGE > $OUT/t$t.json 2> $OUT/t$t.err &
done
wait
python3 - "$OUT" $TIERS <<'PY'
import json, sys
out=[]
for t in sys.argv[2:]:
    try: out += json.load(open(f'{sys.argv[1]}/t{t}.json'))
    except Exception as e: print('ERR', t, e)
json.dump(out, open(f'{sys.argv[1]}/all.json','w'))
PY
