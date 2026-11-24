#!/bin/sh
# 픽셀랩 작업 결과 후보를 번호대로 받는다: sh fetch.sh <job_id> <폴더> [개수]
job=$1; dir=$2; n=${3:-25}
mkdir -p "$dir"
i=0
while [ $i -lt $n ]; do
  f=$(printf '%s/%02d.png' "$dir" $i)
  code=$(curl -sS -o "$f" -w '%{http_code}' "https://api.pixellab.ai/mcp/images/$job/download?index=$i")
  if [ "$code" != "200" ]; then rm -f "$f"; echo "stop at $i ($code)"; break; fi
  i=$((i+1))
done
echo "$job -> $dir: $i files"
