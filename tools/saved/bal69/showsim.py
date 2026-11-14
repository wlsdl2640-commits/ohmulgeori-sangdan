import json, sys, statistics as stt
d = json.load(open(sys.argv[1]))
for r in d:
    R = r['runs']
    flv = [x['flv'] for x in R]; wip = sum(x['wiped'] for x in R)
    taken = sum(x['taken'] for x in R); heff = sum(x['heff'] for x in R); hraw = sum(x['hraw'] for x in R); ft = sum(x['fightT'] for x in R) or 1
    heals = {}
    for x in R:
        for k, v in x['heal'].items(): heals[k] = heals.get(k, 0) + v
    top = sorted(heals.items(), key=lambda kv: -kv[1])[:5]
    print(f"Lv{r['tier']:3d} {r['comp']:5s} sl{r['slv']}sm{r['sm']} | 도달 Lv {stt.mean(flv):5.1f} ({min(flv)}~{max(flv)}) 전멸 {wip}/{len(R)} 공략 {sum(x.get('cleared', 0) for x in R)} | 받은 {taken/ft:6.0f}/s 회복 {heff/ft:6.0f}/s (헛 {hraw/max(1,heff):4.1f}배) 쓰러짐 {sum(x['downs'] for x in R)/len(R):4.1f} | " + ' '.join(f"{k}:{v/max(1,heff)*100:.0f}%" for k, v in top))
