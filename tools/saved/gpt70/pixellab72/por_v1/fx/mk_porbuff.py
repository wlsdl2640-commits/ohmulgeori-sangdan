# 짐꾼 버프 셋(효과 도구) → 늪지 장면: 짐꾼(뒤 · 왼쪽) + 동료 전사(앞 · 오른쪽) + 머리 위 스킬 아이콘 → buff/<이름>_scene.gif
#   효과 도구 저장: 함성 776fc245(동료 78bf44ed) · 물통 08e2363e(동료 5a55f530) · 짐 덜어 주기 154dd9ad(동료 2e371fca)
import json, os, sys
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); W2 = os.path.join(H, '../../war_v2')
sys.path.insert(0, os.path.join(W2, 'fx3')); sys.path.insert(0, os.path.join(W2, 'fx4'))
cwd = os.getcwd(); os.chdir(os.path.join(W2, 'fx3')); import mk_fx3 as m; os.chdir(os.path.join(W2, 'fx4')); import buffhud as BH
def sheet(n):
    p = os.path.join(H, 'buff', n); im = Image.open(p + '.png').convert('RGBA'); J = json.load(open(p + '.json', encoding='utf-8'))
    return [im.crop((f['frame']['x'], f['frame']['y'], f['frame']['x'] + f['frame']['w'], f['frame']['y'] + f['frame']['h'])) for f in J['frames']]
def put(fr, cx):
    c = Image.new('RGBA', (360 + 230, 224 + 196)); c.alpha_composite(fr, (cx, m.GY - 160 + 98)); return c.crop((115, 98, 115 + 360, 98 + 224))
SK = {'shout': ('porter-shout-v1', 'porter-shout-ally', 'shout', 8), 'canteen': ('porter-canteen-v1', 'porter-canteen-ally', 'medkit', 13), 'lighten': ('porter-lighten-v1', 'porter-lighten-ally', 'shieldbag', 10)}
for k, (a, b, ic, t0) in SK.items():
    P = [put(f, m.FX - 70) for f in sheet(a)]; A = [put(f, m.FX + 40) for f in sheet(b)]
    P = BH.over(P, ic, t0, fade=(24, 31)); A = BH.over(A, ic, t0 + 4, fade=(24, 31))
    out = []
    for i in range(len(P)):
        t = m.tile(); t.alpha_composite(P[i]); t.alpha_composite(A[i]); out.append(t.convert('RGB').crop((0, 24, 300, 224)))
    out += [out[-1]] * 6
    out[0].save(os.path.join(H, 'buff', k + '_scene.gif'), save_all=True, append_images=out[1:], duration=83, loop=0)
    c = Image.new('RGB', (300 * 3, 200 * 2))
    for j, i in enumerate((6, 10, 14, 18, 22, 28)): c.paste(out[i], ((j % 3) * 300, (j // 3) * 200))
    c.save(os.path.join(H, 'buff', k + '_peek.png')); print(k, len(out))
