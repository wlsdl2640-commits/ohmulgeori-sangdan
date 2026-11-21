"""export_enh.py <src/data-enhart.js> [미리보기 폴더] — 강화 화면 그림(GPT 판 → 게임 자료). 손으로 고치지 말 것.
   bg.png 무대 배경 · hammer.png 망치(자홍 바탕) · mj6.png 마정석 여섯(밑동 돌을 지우고 윗부분을 180° 돌려 붙여 양끝이 뾰족한 결정으로)
   · mats8.png 재료 여덟(에테르 주괴 · 강화 주괴 · 깨진 조각 · 숫돌 다섯) · fx_*.png 효과 6장(3 × 2, 검은 바탕 → 밝기를 투명도로)."""
import sys, io, base64, os
import numpy as np
from PIL import Image
from scipy import ndimage
D = os.path.dirname(os.path.abspath(__file__)) + '/'
def url(im, q=86, lossless=False):
    b = io.BytesIO(); im.save(b, 'WEBP', quality=q, lossless=lossless, method=6); return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
def key_magenta(im):
    a = np.asarray(im.convert('RGB')).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bg = (r > 150) & (b > 150) & (g < 110) & (abs(r - b) < 90)
    bg = ndimage.binary_dilation(bg, iterations=1) & ((r + b) / 2 - g > 60)   # 가장자리 자홍 번짐
    out = np.dstack([a, np.where(bg, 0, 255)]).astype(np.uint8); return out
def biggest(rgba, keep=0.04):
    lab, n = ndimage.label(rgba[..., 3] > 0, structure=np.ones((3, 3)));
    if not n: return rgba
    sz = ndimage.sum(rgba[..., 3] > 0, lab, range(1, n + 1)); ok = [i + 1 for i, s in enumerate(sz) if s >= sz.max() * keep]
    m = np.isin(lab, ok); rgba = rgba.copy(); rgba[~m] = 0; return rgba
def crop(rgba, pad=2):
    ys, xs = np.nonzero(rgba[..., 3]); return rgba[max(0, ys.min() - pad):ys.max() + 1 + pad, max(0, xs.min() - pad):xs.max() + 1 + pad]
def square(rgba, size=96):
    h, w = rgba.shape[:2]; n = max(h, w); o = np.zeros((n, n, 4), np.uint8); o[(n - h) // 2:(n - h) // 2 + h, (n - w) // 2:(n - w) // 2 + w] = rgba
    return Image.fromarray(o).resize((size, size), Image.LANCZOS)
def crystal(cell):
    """밑동 돌을 지우고, 결정 윗부분(끝 쪽 45%)을 180° 돌려 아래에 붙인다"""
    c = biggest(key_magenta(cell), 0.002); a = c.astype(int); r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    rock = (al > 0) & (r - b > 18) & (r > 70) & (r < 215) & (g - b > 4)
    rock = ndimage.binary_opening(rock, iterations=1); rows = np.nonzero(rock.sum(1) >= 4)[0]; ycut = rows.min() - 14
    ys = np.nonzero(al.any(1))[0]; y0 = ys.min(); T = c[y0:ycut].copy()
    rk = ndimage.binary_dilation(rock[y0:ycut], iterations=3); rk[:-40] = False; T[rk] = 0   # 자른 줄 바로 위에 남은 돌 조각
    # 반짝이 조각(따로 떨어진 작은 덩이)은 몸통에서 떼어 둔다
    lab, n = ndimage.label(T[..., 3] > 0, structure=np.ones((3, 3))); sz = ndimage.sum(T[..., 3] > 0, lab, range(1, n + 1)); body = lab == (int(np.argmax(sz)) + 1)
    B = T.copy(); B[~body] = 0; H = B.shape[0]; ht = int(H * 0.46)
    tip = B[:ht][::-1, ::-1]                                      # 180° 돌린 끝
    def span(row): xs = np.nonzero(row[..., 3])[0]; return xs.min(), xs.max()
    a0, a1 = span(B[H - 1]); t0, t1 = span(tip[0]); dx = int(round((a0 + a1) / 2 - (t0 + t1) / 2))
    W = B.shape[1] + abs(dx) + 40; out = np.zeros((H + ht, W, 4), np.uint8); ox = 20 + max(0, -dx)
    out[:H, ox:ox + T.shape[1]] = T
    sub = out[H:H + ht, ox + dx:ox + dx + tip.shape[1]]; m = tip[..., 3] > 0; sub[m] = tip[m]
    return square(crop(out), 96)
def fx(name, size=168):
    im = Image.open(D + name).convert('RGB'); W, H = im.size; cw, ch = W // 3, H // 2
    strip = Image.new('RGBA', (size * 6, size))
    for i in range(6):
        cel = np.asarray(im.crop(((i % 3) * cw, (i // 3) * ch, (i % 3 + 1) * cw, (i // 3 + 1) * ch)).resize((size, size), Image.LANCZOS)).astype(float)
        al = cel.max(2); al = np.where(al < 10, 0, al); rgb = np.where(al[..., None] > 0, cel * 255 / np.maximum(al[..., None], 1), 0)
        al = np.clip(al * 1.25, 0, 255)                         # 조금 더 또렷하게
        strip.paste(Image.fromarray(np.dstack([np.clip(rgb, 0, 255), al]).astype(np.uint8)), (i * size, 0))
    return strip
out = {}; prev = {}
bg = Image.open(D + 'bg.png').convert('RGB'); bg = bg.resize((900, round(900 * bg.height / bg.width)), Image.LANCZOS); out['bg'] = url(bg, 84); prev['bg'] = bg
hm = Image.fromarray(crop(biggest(key_magenta(Image.open(D + 'hammer.png'))), 4)); hm = hm.resize((256, round(256 * hm.height / hm.width)), Image.LANCZOS); out['hammer'] = url(hm, 90); prev['hammer'] = hm
for k in ['hit', 'ok', 'fail', 'break', 'save']: s = fx('fx_%s.png' % k); out['fx_' + k] = url(s, 84); prev['fx_' + k] = s
items = {}
mj = Image.open(D + 'mj6.png'); cw = mj.width // 6
for i in range(6): im = crystal(mj.crop((i * cw, 0, (i + 1) * cw, mj.height))); items['mj_%d' % i] = url(im, 92); prev['mj_%d' % i] = im
mt = Image.open(D + 'mats8.png'); cw, ch = mt.width // 4, mt.height // 2
for i, k in enumerate(['ether_ingot', 'ingot', 'scrap', 'whet_1', 'whet_3', 'whet_5', 'whet_7', 'whet_10']):
    im = square(crop(biggest(key_magenta(mt.crop(((i % 4) * cw, (i // 4) * ch, (i % 4 + 1) * cw, (i // 4 + 1) * ch))), 0.01)), 96); items[k] = url(im, 92); prev[k] = im
js = '/* 강화 화면 그림 — tools/saved/enh72/export_enh.py로 뽑는다(손으로 고치지 말 것) */\nconst ENH_ART = {\n' + ''.join("  %s: '%s',\n" % kv for kv in out.items()) + '};\nconst ITEM_HD = {\n' + ''.join("  %s: '%s',\n" % kv for kv in items.items()) + '};\n'
open(sys.argv[1], 'w', encoding='utf-8').write(js); print('bytes', len(js))
if len(sys.argv) > 2:
    P = sys.argv[2]; os.makedirs(P, exist_ok=True)
    sh = Image.new('RGB', (96 * 7 + 8, 96 * 2 + 12), '#3a3f55')
    for i in range(6): sh.paste(prev['mj_%d' % i], (4 + i * 96, 4), prev['mj_%d' % i])
    for i, k in enumerate(['ether_ingot', 'ingot', 'scrap', 'whet_1', 'whet_3', 'whet_5', 'whet_7']): sh.paste(prev[k], (4 + i * 96, 104), prev[k])
    sh.resize((sh.width * 2, sh.height * 2), Image.NEAREST).save(P + '/icons.png')
    for k in ['fx_ok', 'fx_fail', 'hammer']: b = Image.new('RGB', prev[k].size, '#2a2233'); b.paste(prev[k], (0, 0), prev[k]); b.save(P + '/%s.png' % k)
