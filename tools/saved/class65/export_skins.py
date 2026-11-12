"""빌드 65 직업 개편: 새 직업 · 바뀐 직업의 캐릭터 그림을 게임 파일로 뽑는다.
  python3 tools/saved/class65/export_skins.py src/pxa-skin65.js
원본 = tools/saved/rogue_skins.json · archer_skins.json · porter_skins.json (사용자가 고른 시안 — 반 해상도 머리 · 덧붙이기 · 직업 그림 색).
머리 · 덧붙이기는 pxUp으로 두 배(top = top_h × 2, x = x_h × 2). 앞 = PX_HEAD · PX_EX, 옆 = PXS_HEAD · PXS_EX."""
import json, sys, os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
J = {k: json.load(open(os.path.join(D, k + '_skins.json'), encoding='utf8')) for k in ('rogue', 'archer', 'porter')}
HEADS = [('rogue', 'flatcap'), ('rogue', 'bowler'), ('rogue', 'shinobi'), ('rogue', 'shadow'), ('archer', 'wolfhood'), ('archer', 'lensmask'), ('porter', 'pioneer'), ('porter', 'straw')]
EXS = [('rogue', 'kerchief'), ('rogue', 'sscarf'), ('rogue', 'bowtie'), ('archer', 'wxbow'), ('archer', 'bcase'), ('porter', 'bedroll'), ('porter', 'susp')]
LOOKS = [('treasure', 'rogue', 'pickpocket', '소매치기 — A 헌팅캡'), ('phantomthief', 'rogue', 'phantom', '괴도 — 중절모 도박사'), ('ninja', 'rogue', 'ninja', '닌자 — A 남색 시노비'), ('kageninja', 'rogue', 'kageninja', '카게닌자 — A 그림자 두건'),
         ('mhunter', 'archer', 'tracker', '트래커 — A 늑대 가죽 두건'), ('dslayer', 'archer', 'stalker', '스토커 — A 유리눈 가면'), ('caravanmaster', 'porter', 'caravanmaster', '캐러밴 마스터 — A 개척민'), ('conestoga', 'porter', 'conestoga', '코네스토가 — B 푸른 짐칸')]
q = lambda v: json.dumps(v, ensure_ascii=False)
out = ["/* ───────── 빌드 65 직업 개편: 새 직업 · 바뀐 직업의 캐릭터 그림 ─────────",
       "   tools/saved/class65/export_skins.py가 rogue_skins.json · archer_skins.json · porter_skins.json(사용자가 고른 시안)에서 뽑는다 — 손으로 고치지 말 것.",
       "   머리 · 덧붙이기는 반 해상도 격자를 pxUp으로 두 배. 대도는 예전 그림 그대로. 탈것(늑대 · 와이번)은 모습을 고른 뒤에. */",
       "const H65 = (rows, top, x) => ({ top: top * 2, x: (x || 0) * 2, g: pxUp(rows).join('\\n') });",
       "const E65 = (rows, x, y, under) => Object.assign({ x, y, g: pxUp(rows).join('\\n') }, under ? { under: 1 } : {});"]
for view, tab in (('front', 'PX_HEAD'), ('side', 'PXS_HEAD')):
    out.append(f"Object.assign({tab}, {{")
    out += [f"  {n}: H65({q(J[f]['parts'][n][view]['rows'])}, {J[f]['parts'][n][view]['top_h']}, {J[f]['parts'][n][view]['x_h']})," for f, n in HEADS]
    out[-1] = out[-1].rstrip(','); out.append("});")
for view, tab in (('front', 'PX_EX'), ('side', 'PXS_EX')):
    out.append(f"Object.assign({tab}, {{")
    out += [f"  {n}: E65({q(J[f]['ex'][n][view]['rows'])}, {J[f]['ex'][n][view]['x']}, {J[f]['ex'][n][view]['y']}{', 1' if J[f]['ex'][n][view].get('under') else ''})," for f, n in EXS]
    out[-1] = out[-1].rstrip(','); out.append("});")
out.append("Object.assign(PXL, {")
for cls, f, k, note in LOOKS:
    L = J[f]['looks'][k]['look']; body = ', '.join(f"{a}: {q(b)}" for a, b in L.items())
    out.append(f"  {cls}: {{ {body} }},   // {note}")
out[-1] = out[-1].replace(' },   //', ' }    //'); out.append("});")
open(sys.argv[1], 'w', encoding='utf8').write('\n'.join(out) + '\n'); print(len(out), 'lines')
