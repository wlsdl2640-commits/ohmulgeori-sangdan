# 버프 머리 위 아이콘(11-25 대표님 「버프 스킬은 전부 머리 위에 관련 아이콘이 나왔다 사라지게」)
#   badge(id) = 게임 스킬 리마스터 그림(icons/<id>.png 34×40) + 모서리 깎기 + 어두운 테 1칸 + 아래 꼬리(말풍선처럼 머리를 가리킴)
#   over(frames, id, t0, head) = 장마다 머리 위에 붙임: 아래에서 솟아(진하기 0.35 → 1) 살짝 넘쳤다 자리 잡고, 1칸 위아래로 숨 쉬다, 끝에서 천천히 옅어짐
#   python buffhud.py <효과 이름> <아이콘 id> <솟는 장> → <이름>_hud.gif · <이름>_hud.png · <이름>_hud.json (원본 <이름>.png 시트 + .json, 위를 HUD_PAD칸 늘림)
import json, sys
from PIL import Image
HUD_PAD = 56; OUT = (40, 26, 18, 255)
def badge(k):
    ic = Image.open(f'icons/{k}.png').convert('RGBA'); w, h = ic.size
    for x, y in [(0, 0), (1, 0), (0, 1), (w - 1, 0), (w - 2, 0), (w - 1, 1), (0, h - 1), (1, h - 1), (0, h - 2), (w - 1, h - 1), (w - 2, h - 1), (w - 1, h - 2)]: ic.putpixel((x, y), (0, 0, 0, 0))
    b = Image.new('RGBA', (w + 2, h + 6), (0, 0, 0, 0)); b.alpha_composite(ic, (1, 1))
    a = b.getchannel('A'); o = Image.new('RGBA', b.size, (0, 0, 0, 0))
    for y in range(b.height):
        for x in range(b.width):
            if a.getpixel((x, y)) == 0 and any(0 <= x + dx < b.width and 0 <= y + dy < b.height and a.getpixel((x + dx, y + dy)) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): o.putpixel((x, y), OUT)
    cx = b.width // 2                      # 꼬리: 아래 가운데 작은 세모
    for i, half in enumerate([3, 2, 1]):
        for x in range(cx - half, cx + half): o.putpixel((x, h + 2 + i), OUT)
    for i, half in enumerate([2, 1]):
        for x in range(cx - half, cx + half): o.putpixel((x, h + 2 + i), (200, 168, 112, 255))
    o.alpha_composite(b); return o
def head(f):
    a = f.getchannel('A')
    for y in range(f.height):
        xs = [x for x in range(f.width) if a.getpixel((x, y)) > 128]
        if len(xs) >= 6 and max(xs) - min(xs) < 60: return (sum(xs) // len(xs), y)
    return (f.width // 2, HUD_PAD)
RISE = [(10, 0.35), (5, 0.7), (-2, 1.0), (1, 1.0), (0, 1.0)]
def over(frames, k, t0, hx=None, hy=None, fade=(23, 30), gap=6):
    B = badge(k); out = []
    if hx is None: hx, hy = head(frames[min(len(frames) - 1, t0 + 4)])
    for i, f in enumerate(frames):
        c = f.copy(); n = i - t0
        if 0 <= n < fade[1] - t0:
            dy, al = RISE[n] if n < len(RISE) else ((-1 if (n // 4) % 2 else 0), 1.0)
            if i >= fade[0]: al *= max(0.0, 1 - (i - fade[0] + 1) / (fade[1] - fade[0] + 1))
            e = B.copy(); e.putalpha(e.getchannel('A').point(lambda v: int(v * al)))
            c.alpha_composite(e, (hx - B.width // 2, hy - B.height - gap + dy))
        out.append(c)
    return out
def save(name, out, ms=71):
    strip = Image.new('RGBA', (out[0].width * len(out), out[0].height))
    for i, c in enumerate(out): strip.alpha_composite(c, (i * c.width, 0))
    strip.save(f'{name}_hud.png')
    json.dump({'w': out[0].width, 'h': out[0].height, 'n': len(out), 'ms': ms}, open(f'{name}_hud.json', 'w'))
    g = [Image.alpha_composite(Image.new('RGBA', c.size, (40, 46, 40, 255)), c).convert('RGB').quantize(64, dither=Image.NONE) for c in out]
    g[0].save(f'{name}_hud.gif', save_all=True, append_images=g[1:], duration=ms, loop=0)
if __name__ == '__main__':
    name, k, t0 = sys.argv[1], sys.argv[2], int(sys.argv[3])
    J = json.load(open(f'{name}.json', encoding='utf-8')); sh = Image.open(f'{name}.png').convert('RGBA'); fr = []
    for f in J['frames']:
        r = f['frame']; c = Image.new('RGBA', (r['w'], r['h'] + HUD_PAD), (0, 0, 0, 0)); c.alpha_composite(sh.crop((r['x'], r['y'], r['x'] + r['w'], r['y'] + r['h'])), (0, HUD_PAD)); fr.append(c)
    save(name, over(fr, k, t0)); print(name, len(fr))
