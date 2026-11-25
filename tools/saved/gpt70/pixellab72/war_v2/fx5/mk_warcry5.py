# 돌격 함성 v5(효과 도구: 전사 a37cfd89 · 동료 efc1ad79) → 늪지 장면: 동료(짐꾼) 왼쪽 · 전사 · 머리 위 함성 아이콘 둘 → warcry_v5_scene.gif
import json, os, sys
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
def sheet(n):
    im = Image.open(os.path.join(H, n + '.png')).convert('RGBA'); J = json.load(open(os.path.join(H, n + '.json'), encoding='utf-8'))
    return [im.crop((f['frame']['x'], f['frame']['y'], f['frame']['x'] + f['frame']['w'], f['frame']['y'] + f['frame']['h'])) for f in J['frames']]
cwd = os.getcwd(); os.chdir(os.path.join(R, 'fx3')); sys.path.insert(0, os.path.join(R, 'fx3')); import mk_fx3 as m; os.chdir(os.path.join(R, 'fx4')); sys.path.insert(0, os.path.join(R, 'fx4')); import buffhud as BH
W = sheet('warcry-v5'); A = sheet('warcry-v5-ally'); GY, FX = m.GY, m.FX
def lay(fr, cx):  # 효과 장(230×196, 발 115,160)을 장면 360×224에 — 발 x = cx, y = GY
    c = Image.new('RGBA', (360, 224)); c.alpha_composite(fr, (0, 0), (max(0, 115 - cx), 0)) if cx < 115 else c.alpha_composite(fr, (cx - 115, GY - 160)); return c
def put(fr, cx):
    c = Image.new('RGBA', (360 + 230, 224 + 196)); c.alpha_composite(fr, (cx - 115 + 115, GY - 160 + 98)); return c.crop((115, 98, 115 + 360, 98 + 224))
wl = [put(f, FX + 30) for f in W]; al = [put(f, FX - 70) for f in A]
wl = BH.over(wl, 'warcry', 6, fade=(24, 31)); al = BH.over(al, 'warcry', 13, fade=(24, 31))
out = []
for i in range(len(W)):
    t = m.tile(); t.alpha_composite(al[i]); t.alpha_composite(wl[i]); out.append(t.convert('RGB'))
os.chdir(H); out += [out[-1]] * 6
out[0].save('warcry_v5_scene.gif', save_all=True, append_images=out[1:], duration=[83] * len(out), loop=0)
os.makedirs('warcry_v5_frames', exist_ok=True)
for i, f in enumerate(out): f.save(f'warcry_v5_frames/{i:02d}.png')
print(len(out))
