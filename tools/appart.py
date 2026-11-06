"""앱 그림 (빌드 47, 사용자가 고른 시안 A): 실제 게임으로 찍은 밤의 상단 앞 — 모험가 다섯이 정면을 보고, 뒤에 왕국 마차.
원본 두 장(논리 240×200을 두 배로 찍은 480×400): tools/app_scene.png(한 줄로 선 다섯 · 마차 x168), tools/app_icon_scene.png(아이콘용으로 모아 선 다섯 · 마차 x150).
다시 찍기: scratchpad/appimg/master.py (appimg.js — drawFrame 그대로, 밤 0.77 · 잉그리시아 마차).
여기서 상단 건물 위 하늘에 게임 제목(두 줄, 갈무리11 굵게 · 금빛 · 테두리)을 얹고 아이콘·시작 화면을 만든다. build.py(웹 아이콘)와 android_res.py(앱 아이콘·시작 화면)가 쓴다."""
import io, pathlib
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
GOLD, INK, SHADOW = (240, 180, 60), (34, 20, 8), (0, 0, 0)
_FONT = None
def font(px):
    global _FONT
    if _FONT is None:
        woff = TTFont(ROOT / 'fonts' / 'Galmuri11-Bold.woff2'); woff.flavor = None
        b = io.BytesIO(); woff.save(b); _FONT = b.getvalue()
    return ImageFont.truetype(io.BytesIO(_FONT), px)

def titled(im, name, size=33, y0=10, gap=7):
    """하늘에 제목 두 줄 (앞 낱말 / 나머지). size는 11의 배수라야 픽셀이 또렷하다."""
    im = im.convert('RGB').copy(); d = ImageDraw.Draw(im); f = font(size)
    lines = name.split(' ', 1) if ' ' in name else [name]
    y = y0
    for ln in lines:
        w = d.textlength(ln, font=f); x = round((im.width - w) / 2)
        for dx, dy in [(-3, 0), (3, 0), (0, -3), (0, 3), (-3, -3), (3, -3), (-3, 3), (3, 3)]: d.text((x + dx, y + dy), ln, font=f, fill=INK)
        d.text((x + 4, y + 5), ln, font=f, fill=SHADOW)
        for dx, dy in [(-3, 0), (3, 0), (0, -3), (0, 3)]: d.text((x + dx, y + dy), ln, font=f, fill=INK)
        d.text((x, y), ln, font=f, fill=GOLD)
        y += size + gap
    return im

def scene(name): return titled(Image.open(ROOT / 'tools' / 'app_scene.png'), name)
def art_square(name, y0=10):
    """아이콘 그림: 아이콘 장면을 가운데 400×400(논리 200×200)으로 — 제목 · 상단 · 모험가 다섯 · 마차 앞머리.
    원·적응형처럼 위가 둥글게 잘리는 아이콘은 y0=46(제목을 조금 내려 지붕 끝에 걸친다)"""
    return titled(Image.open(ROOT / 'tools' / 'app_icon_scene.png'), name, y0=y0).crop((40, 0, 440, 400))

def fit(im, px):
    """픽셀 그림 줄이기·키우기: 크게는 가까운 칸으로 정수배 뒤 고르게 줄인다"""
    if px == im.width: return im.copy()
    k = max(1, -(-px // im.width))
    big = im.resize((im.width * k, im.height * k), Image.NEAREST) if k > 1 else im
    return big.resize((px, px), Image.LANCZOS)

def adaptive_fg(art, px, frac=72 / 108):
    """적응형 아이콘 앞 그림(108dp): 그림을 가운데 72dp(보이는 곳)에 맞추고, 바깥 띠는 그림을 늘여 채운다(가려지는 곳)"""
    out = art.resize((px, px), Image.LANCZOS)
    s = round(px * frac); a = fit(art, s); out.paste(a, ((px - s) // 2, (px - s) // 2))
    return out

def splash(name, w, h, bg=(11, 13, 18)):
    im = Image.new('RGB', (w, h), bg); sc = scene(name)
    s = min(w * 0.94 / sc.width, h * 0.72 / sc.height)
    if s >= 1: k = int(s * 4) / 4; sc = sc.resize((round(sc.width * k), round(sc.height * k)), Image.NEAREST)   # 0.25배씩: 그림 한 칸(4픽셀)이 늘 정수
    else: sc = sc.resize((round(sc.width * s), round(sc.height * s)), Image.LANCZOS)
    im.paste(sc, ((w - sc.width) // 2, (h - sc.height) // 2))
    return im
